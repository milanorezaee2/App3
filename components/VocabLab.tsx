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

/** Three steps only: می‌شنوی → تکرار می‌کنی → از فارسی به زبان مقصد. */
type Phase = 'loading' | 'teach' | 'repeat' | 'reverse' | 'rate' | 'done';

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

/**
 * The vocabulary lab itself: listen → repeat → produce from Persian → rate, with spaced repetition.
 *
 * One implementation for every course keeps the Russian and German flows literally identical —
 * same phases, same thresholds, same one-automatic-pass-per-card rule — while the content, locale,
 * speech engine and progress store come from the course configuration.
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
  const [reverseSpoken, setReverseSpoken] = useState(false);
  const [reverseScore, setReverseScore] = useState<number | null>(null);
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
      setPhase(session.queue.length ? 'teach' : 'done');
    })();
    return () => { alive = false; void speech.stop(); };
  }, [reloadToken, speech, store, words]);

  const stats = useMemo(() => progress ? store.stats(words, progress) : null, [progress, store, words]);
  const word = queue[index];

  const resetWord = useCallback(() => {
    setReverseSpoken(false);
    setReverseScore(null);
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
    // «teach» renders the next card; the auto-pronunciation effect below speaks it immediately.
    setPhase(next < queue.length ? 'teach' : 'done');
  }, [index, queue.length, resetWord]);

  /** Target language → Persian → target language, exactly as promised, starting with the word itself. */
  const autoSay = useCallback(async (item: T) => {
    const token = ++autoToken.current;
    const spoken = target(item);
    setAutoPlaying(true);
    await speechPromise(
      (done, failed) => { void speech.play(spoken, 0.62, failed, done); },
      5000,
    );
    if (token !== autoToken.current) return;
    await speechPromise(
      (done, failed) => { speakPersian(gloss(item), 0.92, failed, done); },
      3500,
    );
    if (token !== autoToken.current) return;
    await speechPromise(
      (done, failed) => { void speech.play(spoken, 0.55, failed, done); },
      5000,
    );
    if (token !== autoToken.current) return;
    setAutoPlaying(false);
  }, [speech, target, gloss]);

  // The automatic pass: every card that appears is pronounced once, including the very first one.
  useEffect(() => {
    if (phase !== 'teach' || !word) return;
    if (autoSpokenFor.current === word.id) return;
    autoSpokenFor.current = word.id;
    void autoSay(word);
  }, [phase, word, autoSay]);

  const rate = useCallback(async (rating: ReviewRating) => {
    if (!word || !progress) return;
    const next = store.rate(progress, word.id, rating, reverseSpoken, new Date());
    await store.save(next);
    setProgress(next);
    if (reverseSpoken) void markPlanStep('speak').catch(() => undefined);
    goNext();
  }, [word, progress, reverseSpoken, goNext, store]);

  const home = homeRoute as never;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="بازگشت" onPress={() => { void speech.stop(); router.replace(home); }} style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
          <ArrowRight size={20} color={C.ink} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSub}>می‌شنوی، تکرار می‌کنی، از فارسی به {languageName} می‌گویی</Text>
        </View>
        <Sparkles size={22} color={C.primary} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {phase === 'loading' ? (
          <View style={styles.centerCard}><ActivityIndicator color={C.primary} /><Text style={styles.bodyText}>در حال آماده کردن واژه‌ها…</Text></View>
        ) : null}

        {phase === 'teach' && word ? (
          <View style={styles.wordCard}>
            <Text style={styles.stepLabel}>قدم ۱ از ۳ · می‌شنوی</Text>
            <Text keepColor style={styles.bigWord}>{target(word)}</Text>
            <Text style={styles.wordFaOnDark}>{gloss(word)}</Text>
            <View style={styles.autoBox}>
              <Volume2 size={16} color={C.primary} />
              <Text style={styles.autoText}>{autoPlaying ? `${languageName} → فارسی → ${languageName}، خودکار…` : 'پخش تمام شد. اگر صدا را نشنیدی، «دوباره بشنو» را بزن.'}</Text>
            </View>
            {index === 0 ? (
              <View style={styles.guideBox}>
                <Text style={styles.guideTitle}>سه قدم هر واژه</Text>
                <Text style={styles.stepLine}>۱. اپ واژهٔ {languageName} را می‌گوید، بعد معنی فارسی، بعد دوباره {languageName}.</Text>
                <Text style={styles.stepLine}>۲. تو همان واژه را تکرار می‌کنی.</Text>
                <Text style={styles.stepLine}>۳. فقط فارسی را می‌بینی و {languageName}اش را می‌گویی.</Text>
                <Text style={styles.smallText}>{fa(sessionInfo.newCount)} واژهٔ تازه · {fa(sessionInfo.dueCount)} مرور سررسید · هر واژه حدود نیم دقیقه</Text>
                {stats ? <Text style={styles.smallText}>معرفی‌شده: {fa(stats.introduced)} · مسلط گفتاری: {fa(stats.mastered)}</Text> : null}
              </View>
            ) : null}
            <View style={styles.rowButtons}>
              <Pressable accessibilityRole="button" onPress={() => { void autoSay(word); }} style={({ pressed }) => [styles.ghostButton, pressed && styles.pressed]}>
                <RefreshCw size={14} color={C.primaryDark} /><Text style={styles.ghostText}>دوباره بشنو</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => { void speech.stop(); setPhase('repeat'); }} style={({ pressed }) => [styles.primary, styles.grow, pressed && styles.pressed]}>
                <Text style={styles.primaryText}>حالا من می‌گویم</Text><ChevronLeft size={15} color="#FFFFFF" />
              </Pressable>
            </View>
            {note(word) ? <Text style={styles.note}>{note(word)}</Text> : null}
          </View>
        ) : null}

        {phase === 'repeat' && word ? (
          <View style={styles.wordCard}>
            <Text style={styles.stepLabel}>قدم ۲ از ۳ · تکرار می‌کنی</Text>
            <Text keepColor style={styles.bigWordSmall}>{target(word)}</Text>
            <Text style={styles.wordFa}>{gloss(word)}</Text>
            <Pressable accessibilityRole="button" onPress={() => { void speech.play(target(word), 0.6, () => undefined); }} style={({ pressed }) => [styles.audioButton, pressed && styles.pressed]}>
              <Volume2 size={15} color={C.primary} /><Text style={styles.audioButtonText}>اول بشنو</Text>
            </Pressable>
            <SpeakCheck
              key={`${word.id}-repeat`}
              text={target(word)}
              locale={locale}
              accent={C.success}
              title="همان واژه را بگو"
              autoStart
              onResult={result => {
                setError('');
                if (result.score >= 55) setTimeout(() => setPhase('reverse'), 700);
                else setError('نزدیک بود؛ یک بار دیگر آهسته‌تر بگو.');
              }}
            />
            {!!error && <Text style={styles.hintError}>{error}</Text>}
            <Pressable accessibilityRole="button" onPress={() => setPhase('reverse')} style={({ pressed }) => [styles.skipLink, pressed && styles.pressed]}>
              <Text style={styles.skipText}>فعلاً رد کن؛ به قدم ۳ برو</Text>
            </Pressable>
          </View>
        ) : null}

        {phase === 'reverse' && word ? (
          <View style={styles.wordCard}>
            <Text style={styles.stepLabel}>قدم ۳ از ۳ · از فارسی به {languageName}</Text>
            <View style={styles.reversePrompt}>
              <Text style={styles.reverseLabel}>فقط معنی فارسی</Text>
              <Text style={styles.reverseFa}>{gloss(word)}</Text>
            </View>
            <SpeakCheck
              key={`${word.id}-reverse`}
              text={target(word)}
              locale={locale}
              accent={C.primary}
              title={`واژهٔ ${languageName} را بگو`}
              onResult={result => {
                setReverseScore(result.score);
                if (result.score >= 70) setReverseSpoken(true);
              }}
            />
            {reverseSpoken ? <View style={styles.okBox}><Check size={15} color={C.success} /><Text style={styles.okText}>درست گفتی؛ گفتار موفق ثبت شد.</Text></View> : null}
            {!reverseSpoken && reverseScore !== null ? (
              <Text style={styles.hintWarm}>راهنمایی: {hint(word)} · دوباره بشنو و بعد بگو.</Text>
            ) : null}
            <Pressable accessibilityRole="button" onPress={() => setPhase('rate')} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
              <Text style={styles.primaryText}>{reverseSpoken ? 'ادامه' : 'بعداً تمرین می‌کنم'}</Text><ChevronLeft size={15} color="#FFFFFF" />
            </Pressable>
          </View>
        ) : null}

        {phase === 'rate' && word ? (
          <View style={styles.wordCard}>
            <Text style={styles.stepLabel}>مرور</Text>
            <Text style={styles.title}>این واژه چطور بود؟</Text>
            <Text keepColor style={styles.bigWordSmall}>{target(word)}</Text>
            <Text style={styles.wordFa}>{gloss(word)}</Text>
            <Text style={styles.smallText}>چرا الان؟ {store.reason(progress?.cards[word.id])}</Text>
            <ReviewRatingGrid saving={false} score={reverseScore} onRate={rating => void rate(rating)} />
            {!reverseSpoken ? <Text style={styles.smallText}>بدون گفتار موفق، «تسلط گفتاری» ثبت نمی‌شود؛ کارت زودتر برمی‌گردد.</Text> : null}
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
  audioButton: { flexDirection: 'row-reverse', alignItems: 'center', alignSelf: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: C.primarySoft },
  audioButtonText: { fontFamily: Typography.fontFamily, fontSize: 11, color: C.primaryDark },
  pressed: { opacity: 0.82 },
  note: { fontFamily: Typography.fontFamily, fontSize: 11, lineHeight: 19, color: C.warning, textAlign: 'right', writingDirection: 'rtl' },
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
