import { LocalizedText as Text } from '@/components/LocalizedText';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Check, ChevronLeft, Play, RefreshCw, Sparkles, Volume2 } from 'lucide-react-native';
import SpeakCheck from '@/components/SpeakCheck';
import { ReviewRatingGrid } from '@/components/ReviewRecall';
import { speakPersian } from '@/lib/persianSpeech';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';
import { markPlanStep } from '@/lib/dailyPlan';
import type { ReviewRating } from '@/lib/courseProgress';
import type { VocabProgress, VocabProgressStore } from '@/lib/vocabProgress';

const C = {
  ink: '#0F172A',
  text: '#475569',
  muted: '#64748B',
  primary: '#4338CA',
  primaryDark: '#3730A3',
  primarySoft: '#EEF2FF',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  bg: '#F8FAFC',
  success: '#15803D',
  successSoft: '#DCFCE7',
  warning: '#B45309',
  warningSoft: '#FEF3C7',
  danger: '#B91C1C',
};

/**
 * Two steps per word, not three: hear it once, then say it once.
 *
 * The earlier flow spoke the word twice, made the learner repeat it on a second screen and then asked
 * for the very same word a third time on the reverse screen. That is three repetitions of one card and
 * the reason the drill felt exhausting. Now a card is:
 *   1. LISTEN  — the app says the word, then the Persian meaning («آلمانی → فارسی», no second pass).
 *   2. SPEAK   — only the Persian is shown; one microphone attempt (retry and skip stay available).
 * Then the spaced-repetition rating, and the next card follows immediately.
 */
type Phase = 'loading' | 'listen' | 'speak' | 'rate' | 'done';

/** Resolve on the engine's own callback, never later than the cap (a silent engine must not hang the flow). */
function speechPromise(start: (done: () => void, failed: () => void) => void, capMs: number): Promise<void> {
  return new Promise<void>(resolve => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(finish, capMs);
    try { start(finish, finish); } catch { finish(); }
  });
}

export interface VocabLabSpeech {
  play(text: string, rate: number, onError?: () => void, onDone?: () => void): Promise<void>;
  stop(): Promise<void>;
  warm(): void;
}

export interface VocabLabConfig<T extends { id: string }> {
  /** «واژه‌خانهٔ روسی» / «واژه‌خانهٔ آلمانی» */
  title: string;
  /** Persian name of the target language, used inside the step copy. */
  languageName: string;
  /** BCP-47 tag handed to the recogniser, e.g. `ru-RU` / `de-DE`. */
  locale: string;
  words: readonly T[];
  target: (word: T) => string;
  gloss: (word: T) => string;
  note: (word: T) => string;
  hint: (word: T) => string;
  speech: VocabLabSpeech;
  store: VocabProgressStore<T>;
  homeRoute: string;
  BottomNav: ComponentType;
}

/** Score that counts as «the learner produced the word»; used for the speaking-mastery flag only. */
const SPOKEN_OK = 70;

/**
 * The vocabulary lab itself: listen → say → rate, with spaced repetition.
 *
 * One implementation for every course keeps the Russian and German drills literally identical —
 * same phases, same thresholds, same one-automatic-pass-per-card rule — while content, locale, speech
 * engine and progress store come from the course configuration.
 */
export default function VocabLab<T extends { id: string }>({ config }: { config: VocabLabConfig<T> }) {
  const { title, languageName, locale, words, target, gloss, note, hint, speech, store, homeRoute, BottomNav } = config;
  const router = useRouter();
  const [reloadToken, setReloadToken] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');
  const [progress, setProgress] = useState<VocabProgress | null>(null);
  const [queue, setQueue] = useState<readonly T[]>([]);
  const [index, setIndex] = useState(0);
  const [sessionInfo, setSessionInfo] = useState({ dueCount: 0, newCount: 0 });
  const [spokenOk, setSpokenOk] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  /** Bumped to re-mount SpeakCheck for a deliberate retry only — never automatically. */
  const [attempt, setAttempt] = useState(0);
  /** Reveal the written word after a miss — the learner asked for it, we never show it unasked. */
  const [revealed, setRevealed] = useState(false);
  /** While a hint word is playing, the recogniser is unmounted so it cannot score our own speaker. */
  const [hearing, setHearing] = useState(false);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [error, setError] = useState('');
  const autoToken = useRef(0);
  /** Word whose automatic pronunciation already ran in this session — one automatic pass per card. */
  const autoSpokenFor = useRef('');

  useEffect(() => {
    // Start the TTS engine while the saved progress and the queue are being read, so the first word
    // is audible the moment it appears instead of after the engine's cold start.
    speech.warm();
    autoSpokenFor.current = '';
    let alive = true;
    void (async () => {
      const stored = await store.load();
      const session = store.buildSession(words, stored, new Date());
      if (session.introduced !== stored) await store.save(session.introduced);
      if (!alive) return;
      setProgress(session.introduced);
      setQueue(session.queue);
      setIndex(0);
      setSessionInfo({ dueCount: session.dueCount, newCount: session.newCount });
      // No «start» screen: entering the section means the first word is shown and spoken right away.
      setPhase(session.queue.length ? 'listen' : 'done');
    })();
    return () => { alive = false; void speech.stop(); };
  }, [reloadToken, speech, store, words]);

  const stats = useMemo(() => progress ? store.stats(words, progress) : null, [progress, store, words]);
  const word = queue[index];

  const resetWord = useCallback(() => {
    setSpokenOk(false);
    setScore(null);
    setAttempt(0);
    setRevealed(false);
    setHearing(false);
    setError('');
    autoToken.current += 1;
    // One owner for stopping the target-language audio: stop() also invalidates the callbacks,
    // so a late onDone from the previous card cannot move this one forward.
    void speech.stop();
  }, [speech]);

  const goNext = useCallback(() => {
    resetWord();
    const next = index + 1;
    setIndex(next);
    // «listen» renders the next card; the auto-pronunciation effect below speaks it immediately.
    setPhase(next < queue.length ? 'listen' : 'done');
  }, [index, queue.length, resetWord]);

  /** Target language → Persian, once. The second target-language pass was the extra repetition. */
  const autoSay = useCallback(async (item: T) => {
    const token = ++autoToken.current;
    setAutoPlaying(true);
    await speechPromise(
      (done, failed) => { void speech.play(target(item), 0.6, failed, done); },
      5000,
    );
    if (token !== autoToken.current) return;
    await speechPromise(
      (done, failed) => { speakPersian(gloss(item), 0.95, failed, done); },
      4500,
    );
    if (token !== autoToken.current) return;
    setAutoPlaying(false);
  }, [speech, target, gloss]);

  // The automatic pass: every card that appears is pronounced once, including the very first one.
  useEffect(() => {
    if (phase !== 'listen' || !word) return;
    if (autoSpokenFor.current === word.id) return;
    autoSpokenFor.current = word.id;
    void autoSay(word);
  }, [phase, word, autoSay]);

  const startSpeaking = useCallback(() => {
    // The microphone must never open while the word is still being spoken.
    autoToken.current += 1;
    setAutoPlaying(false);
    void speech.stop();
    setPhase('speak');
  }, [speech]);

  /** Hear the answer once, then hand the microphone back: audio first, recognition after. */
  const hearWord = useCallback(() => {
    if (!word) return;
    setHearing(true);
    setError('');
    const back = () => { setHearing(false); setAttempt(value => value + 1); };
    void speech.play(target(word), 0.6, back, back);
  }, [speech, target, word]);

  const rate = useCallback(async (rating: ReviewRating) => {
    if (!word || !progress) return;
    const next = store.rate(progress, word.id, rating, spokenOk, new Date());
    await store.save(next);
    setProgress(next);
    if (spokenOk) void markPlanStep('speak').catch(() => undefined);
    goNext();
  }, [word, progress, spokenOk, goNext, store]);

  const home = homeRoute as never;
  const position = queue.length ? `واژهٔ ${fa(index + 1)} از ${fa(queue.length)}` : '';
  const progressPercent = queue.length ? Math.round(((index + 1) / queue.length) * 100) : 0;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="بازگشت" onPress={() => { void speech.stop(); router.replace(home); }} style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
          <ArrowRight size={20} color={C.ink} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSub}>می‌شنوی و معنی را می‌گیری، بعد خودت از فارسی به {languageName} می‌گویی</Text>
        </View>
        <Sparkles size={22} color={C.primary} />
      </View>

      {(phase === 'listen' || phase === 'speak' || phase === 'rate') && word ? (
        <View style={styles.progressStrip}>
          <Text style={styles.progressText}>{position}</Text>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.max(4, progressPercent)}%` }]} /></View>
        </View>
      ) : null}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {phase === 'loading' ? (
          <View style={styles.centerCard}><ActivityIndicator color={C.primary} /><Text style={styles.bodyText}>در حال آماده کردن واژه‌ها…</Text></View>
        ) : null}

        {phase === 'listen' && word ? (
          <View style={styles.wordCard}>
            <Text style={styles.stepLabel}>قدم ۱ از ۲ · می‌شنوی</Text>
            <Text keepColor style={styles.bigWord}>{target(word)}</Text>
            <Text style={styles.wordFaOnDark}>{gloss(word)}</Text>
            <View style={styles.autoBox}>
              <Volume2 size={16} color={C.primary} />
              <Text style={styles.autoText}>{autoPlaying ? `${languageName} → فارسی، خودکار…` : 'پخش تمام شد. اگر صدا را نشنیدی، «دوباره بشنو» را بزن.'}</Text>
            </View>
            {index === 0 ? (
              <View style={styles.guideBox}>
                <Text style={styles.guideTitle}>هر واژه فقط دو قدم</Text>
                <Text style={styles.stepLine}>۱. اپ واژهٔ {languageName} را می‌گوید، بعد معنی فارسی. یک بار، بدون تکرار پشت‌سرهم.</Text>
                <Text style={styles.stepLine}>۲. فقط فارسی را می‌بینی و خودت {languageName}اش را می‌گویی؛ یک تلاش کافی است.</Text>
                <Text style={styles.smallText}>{fa(sessionInfo.newCount)} واژهٔ تازه · {fa(sessionInfo.dueCount)} مرور سررسید · هر واژه حدود بیست ثانیه</Text>
                {stats ? <Text style={styles.smallText}>معرفی‌شده: {fa(stats.introduced)} · مسلط گفتاری: {fa(stats.mastered)}</Text> : null}
              </View>
            ) : null}
            <View style={styles.rowButtons}>
              <Pressable accessibilityRole="button" onPress={() => { void autoSay(word); }} style={({ pressed }) => [styles.ghostButton, pressed && styles.pressed]}>
                <RefreshCw size={14} color={C.primaryDark} /><Text style={styles.ghostText}>دوباره بشنو</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={startSpeaking} style={({ pressed }) => [styles.primary, styles.grow, pressed && styles.pressed]}>
                <Text style={styles.primaryText}>حالا می‌گویم</Text><ChevronLeft size={15} color="#FFFFFF" />
              </Pressable>
            </View>
            {note(word) ? <Text style={styles.note}>{note(word)}</Text> : null}
          </View>
        ) : null}

        {phase === 'speak' && word ? (
          <View style={styles.wordCard}>
            <Text style={styles.stepLabel}>قدم ۲ از ۲ · از فارسی به {languageName}</Text>
            <View style={styles.reversePrompt}>
              <Text style={styles.reverseLabel}>فقط معنی فارسی</Text>
              <Text style={styles.reverseFa}>{gloss(word)}</Text>
            </View>
            {revealed ? <Text keepColor style={styles.bigWordSmall}>{target(word)}</Text> : null}
            {hearing ? (
              <View style={styles.hearingBox}><Volume2 size={16} color={C.primaryDark} /><Text style={styles.autoText}>اول گوش بده؛ بعد از پخش، میکروفن باز می‌شود.</Text></View>
            ) : (
            <SpeakCheck
              key={`${word.id}-speak-${attempt}`}
              text={target(word)}
              locale={locale}
              accent={C.primary}
              title={`واژهٔ ${languageName} را بگو`}
              autoStart
              onResult={result => {
                setScore(result.score);
                if (result.score >= SPOKEN_OK) {
                  setSpokenOk(true);
                  setError('');
                  // One successful attempt is enough: go straight to the rating, no extra screen.
                  setTimeout(() => setPhase('rate'), 700);
                } else {
                  setError('نزدیک بود؛ یک بار آهسته‌تر بگو یا با راهنما ادامه بده.');
                }
              }}
            />
            )}
            {!!error && !spokenOk ? <Text style={styles.hintError}>{error}</Text> : null}
            {spokenOk ? <View style={styles.okBox}><Check size={15} color={C.success} /><Text style={styles.okText}>درست گفتی؛ گفتار موفق ثبت شد.</Text></View> : null}
            {!spokenOk && score !== null ? (
              <Text style={styles.hintWarm}>راهنمایی: {hint(word)} · دوباره بشنو و بعد بگو.</Text>
            ) : null}
            {!spokenOk ? (
              <View style={styles.rowButtons}>
                <Pressable accessibilityRole="button" onPress={hearWord} style={({ pressed }) => [styles.ghostButton, styles.grow, pressed && styles.pressed]}>
                  <Volume2 size={14} color={C.primaryDark} /><Text style={styles.ghostText}>بشنو</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={() => { setError(''); setAttempt(value => value + 1); }} style={({ pressed }) => [styles.ghostButton, styles.grow, pressed && styles.pressed]}>
                  <RefreshCw size={14} color={C.primaryDark} /><Text style={styles.ghostText}>یک بار دیگر</Text>
                </Pressable>
              </View>
            ) : null}
            {!spokenOk && !revealed ? (
              <Pressable accessibilityRole="button" onPress={() => setRevealed(true)} style={({ pressed }) => [styles.skipLink, pressed && styles.pressed]}>
                <Text style={styles.skipText}>نشانم بده</Text>
              </Pressable>
            ) : null}
            {spokenOk ? (
              <Pressable accessibilityRole="button" onPress={() => setPhase('rate')} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
                <Text style={styles.primaryText}>ادامه</Text><ChevronLeft size={15} color="#FFFFFF" />
              </Pressable>
            ) : (
              <Pressable accessibilityRole="button" onPress={() => setPhase('rate')} style={({ pressed }) => [styles.skipLink, pressed && styles.pressed]}>
                <Text style={styles.skipText}>بدون گفتار ادامه می‌دهم</Text>
              </Pressable>
            )}
          </View>
        ) : null}

        {phase === 'rate' && word ? (
          <View style={styles.wordCard}>
            <Text style={styles.stepLabel}>مرور</Text>
            <Text style={styles.title}>این واژه چطور بود؟</Text>
            <Text keepColor style={styles.bigWordSmall}>{target(word)}</Text>
            <Text style={styles.wordFa}>{gloss(word)}</Text>
            <Text style={styles.smallText}>چرا الان؟ {store.reason(progress?.cards[word.id])}</Text>
            <ReviewRatingGrid saving={false} score={score} onRate={rating => void rate(rating)} />
            {!spokenOk ? <Text style={styles.smallText}>بدون گفتار موفق، «تسلط گفتاری» ثبت نمی‌شود؛ کارت زودتر برمی‌گردد.</Text> : null}
          </View>
        ) : null}

        {phase === 'done' ? (
          <View style={styles.centerCard}>
            <View style={[styles.bigIcon, { backgroundColor: C.successSoft }]}><Check size={30} color={C.success} /></View>
            <Text style={styles.title}>تمرین امروز تمام شد</Text>
            <Text style={styles.bodyText}>{fa(sessionInfo.newCount)} واژهٔ تازه و {fa(sessionInfo.dueCount)} مرور انجام شد.</Text>
            {stats ? <Text style={styles.smallText}>معرفی‌شده: {fa(stats.introduced)} · مسلط گفتاری: {fa(stats.mastered)} · سررسید: {fa(stats.due)}</Text> : null}
            <Pressable accessibilityRole="button" onPress={() => setReloadToken(value => value + 1)} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
              <Play size={15} color="#FFFFFF" /><Text style={styles.primaryText}>یک دور دیگر</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => router.replace(home)} style={({ pressed }) => [styles.ghostButton, pressed && styles.pressed]}>
              <Text style={styles.ghostText}>بازگشت به خانه</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border },
  back: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg },
  headerCopy: { flex: 1, alignItems: 'flex-end', gap: 2 },
  headerTitle: { fontFamily: Typography.fontFamily, fontSize: 17, color: C.ink, textAlign: 'right', writingDirection: 'rtl' },
  headerSub: { fontFamily: Typography.fontFamily, fontSize: 10, color: C.muted, textAlign: 'right', writingDirection: 'rtl' },
  progressStrip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border },
  progressText: { fontFamily: Typography.fontFamily, fontSize: 10, color: C.muted, writingDirection: 'rtl' },
  progressTrack: { flex: 1, height: 5, borderRadius: 999, backgroundColor: C.border, overflow: 'hidden' },
  progressFill: { height: 5, borderRadius: 999, backgroundColor: C.primary },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32, gap: 12 },
  centerCard: { width: '100%', borderRadius: 22, padding: 22, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: 'center', gap: 12 },
  wordCard: { width: '100%', borderRadius: 22, padding: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, gap: 12 },
  bigIcon: { width: 58, height: 58, borderRadius: 29, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: Typography.fontFamily, fontSize: 20, color: C.ink, textAlign: 'right', writingDirection: 'rtl' },
  bodyText: { fontFamily: Typography.fontFamily, fontSize: 13, lineHeight: 22, color: C.text, textAlign: 'right', writingDirection: 'rtl' },
  smallText: { fontFamily: Typography.fontFamily, fontSize: 11, lineHeight: 18, color: C.muted, textAlign: 'right', writingDirection: 'rtl' },
  stepLabel: { fontFamily: Typography.fontFamily, fontSize: 11, color: C.primaryDark, textAlign: 'right', writingDirection: 'rtl' },
  stepLine: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: C.text, textAlign: 'right', writingDirection: 'rtl' },
  guideBox: { width: '100%', borderRadius: 14, padding: 12, gap: 5, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  guideTitle: { fontFamily: Typography.fontFamily, fontSize: 12, color: C.primaryDark, textAlign: 'right', writingDirection: 'rtl' },
  bigWord: { fontFamily: 'Times New Roman', fontSize: 36, lineHeight: 46, fontWeight: '800', color: C.ink, textAlign: 'center', writingDirection: 'ltr' },
  bigWordSmall: { fontFamily: 'Times New Roman', fontSize: 26, lineHeight: 36, fontWeight: '800', color: C.ink, textAlign: 'center', writingDirection: 'ltr' },
  wordFa: { fontFamily: Typography.fontFamily, fontSize: 17, color: C.text, textAlign: 'center', writingDirection: 'rtl' },
  wordFaOnDark: { fontFamily: Typography.fontFamily, fontSize: 16, color: C.primaryDark, textAlign: 'center', writingDirection: 'rtl' },
  autoBox: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 7, padding: 10, borderRadius: 12, backgroundColor: C.primarySoft },
  autoText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: 11, lineHeight: 18, color: C.primaryDark, textAlign: 'right', writingDirection: 'rtl' },
  rowButtons: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  grow: { flex: 1 },
  primary: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 46, paddingHorizontal: 18, borderRadius: 14, backgroundColor: C.primary },
  primaryText: { fontFamily: Typography.fontFamily, fontSize: 13, color: '#FFFFFF', writingDirection: 'rtl' },
  ghostButton: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 46, paddingHorizontal: 14, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  ghostText: { fontFamily: Typography.fontFamily, fontSize: 12, color: C.text, writingDirection: 'rtl' },
  pressed: { opacity: 0.82 },
  note: { fontFamily: Typography.fontFamily, fontSize: 11, lineHeight: 19, color: C.warning, textAlign: 'right', writingDirection: 'rtl' },
  hearingBox: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7, padding: 10, borderRadius: 12, backgroundColor: C.primarySoft },
  hintError: { fontFamily: Typography.fontFamily, fontSize: 11, color: C.danger, textAlign: 'right', writingDirection: 'rtl' },
  hintWarm: { fontFamily: Typography.fontFamily, fontSize: 11, color: C.warning, textAlign: 'right', writingDirection: 'rtl' },
  skipLink: { alignSelf: 'center', padding: 6 },
  skipText: { fontFamily: Typography.fontFamily, fontSize: 11, color: C.muted, textDecorationLine: 'underline', writingDirection: 'rtl' },
  okBox: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, padding: 9, borderRadius: 12, backgroundColor: C.successSoft },
  okText: { fontFamily: Typography.fontFamily, fontSize: 11, color: C.success, writingDirection: 'rtl' },
  reversePrompt: { width: '100%', padding: 14, borderRadius: 16, backgroundColor: C.primarySoft, gap: 4, alignItems: 'center' },
  reverseLabel: { fontFamily: Typography.fontFamily, fontSize: 10, color: C.primaryDark, writingDirection: 'rtl' },
  reverseFa: { fontFamily: Typography.fontFamily, fontSize: 22, lineHeight: 34, color: C.ink, textAlign: 'center', writingDirection: 'rtl' },
});
