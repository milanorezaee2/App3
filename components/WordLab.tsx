import { LocalizedText as Text } from '@/components/LocalizedText';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Check, ChevronLeft, RefreshCw, Sparkles, Volume2, ArrowRight, Play, Mic2, MessageSquareQuote } from 'lucide-react-native';
import SpeakCheck from '@/components/SpeakCheck';
import { ReviewRatingGrid } from '@/components/ReviewRecall';
import { speakPersian } from '@/lib/persianSpeech';
import { playRussianSpeech, stopRussianSpeech } from '@/lib/russianSpeech';
import { playStarterSpeech, stopStarterSpeech } from '@/lib/starterSpeech';
import { firstLetterHint, hasSpokenSentence, spokenSentence, spokenTarget, WORD_LAB_LOCALE, WORD_LAB_NAME, WORD_LAB_WORDS, type WordLabLanguage, type WordLabWord } from '@/lib/languages/wordLab';
import { buildWordSession, loadWordProgress, rateWordCard, saveWordProgress, wordReason, wordStats, type WordProgress } from '@/lib/wordLabProgress';
import { markPlanStep } from '@/lib/dailyPlan';
import type { ReviewRating } from '@/lib/courseProgress';
import { prefersRecordedSpeech, setPrefersRecordedSpeech, subscribeSpeechSource } from '@/lib/content/speechFallback';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';

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
 * Three screens per card, all of them spoken by the phone's own voice (a recorded voice is opt-in):
 *
 *   1. «می‌بینی و می‌شنوی» — the word is played once in the target language, then its Persian meaning.
 *   2. «جمله را می‌شنوی» — the course sentence that uses the word is played once, with its Persian
 *      translation and respelling on screen.
 *   3. «حالا تو می‌گویی» — the Persian meaning is the prompt, the microphone opens by itself, and the
 *      learner says the *sentence*. A weak attempt shows the first word as a hint and lets them retry.
 *
 * then one rating card, then the next word. Every step is also reachable by a button, so a learner who
 * muted the phone is never stuck.
 */
type Phase = 'loading' | 'intro' | 'listen' | 'sentence' | 'recall' | 'rate' | 'done';

export default function WordLab({ language }: { language: WordLabLanguage }) {
  const router = useRouter();
  const words = WORD_LAB_WORDS[language];
  const locale = WORD_LAB_LOCALE[language];
  const languageName = WORD_LAB_NAME[language];
  const home = `/learn/${language}` as const;

  const [reloadToken, setReloadToken] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');
  const [progress, setProgress] = useState<WordProgress | null>(null);
  const [queue, setQueue] = useState<readonly WordLabWord[]>([]);
  const [index, setIndex] = useState(0);
  const [sessionInfo, setSessionInfo] = useState({ dueCount: 0, newCount: 0 });
  const [spoken, setSpoken] = useState(false);
  /** The phone's own voice is the default narrator; a recorded pack voice is an opt-in choice. */
  const [useRecorded, setUseRecorded] = useState(false);
  const [autoSwitched, setAutoSwitched] = useState(false);
  const [spokenScore, setSpokenScore] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const playback = useRef(0);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const stored = await loadWordProgress(language);
      const session = buildWordSession(words, stored, new Date());
      if (session.introduced !== stored) await saveWordProgress(language, session.introduced);
      if (!alive) return;
      setProgress(session.introduced);
      setQueue(session.queue);
      setIndex(0);
      setSessionInfo({ dueCount: session.dueCount, newCount: session.newCount });
      setPhase(session.queue.length ? 'intro' : 'done');
    })();
    return () => {
      alive = false;
      playback.current += 1;
      void stopLabSpeech(language);
    };
  }, [language, reloadToken, words]);

  // Read the saved choice and follow later automatic switches, so the label always tells the truth.
  useEffect(() => {
    let alive = true;
    void prefersRecordedSpeech().then(value => { if (alive) setUseRecorded(value); });
    const unsubscribe = subscribeSpeechSource(value => { if (alive) { setUseRecorded(value); setAutoSwitched(true); } });
    return () => { alive = false; unsubscribe(); };
  }, []);

  const chooseVoice = useCallback(async (recorded: boolean) => {
    setAutoSwitched(false);
    setUseRecorded(recorded);
    setVoiceError('');
    await setPrefersRecordedSpeech(recorded);
  }, []);

  const stats = useMemo(() => progress ? wordStats(words, progress) : null, [progress, words]);
  const word = queue[index];

  const stopAll = useCallback(() => {
    playback.current += 1;
    void stopLabSpeech(language);
  }, [language]);

  const sayTarget = useCallback(async (item: WordLabWord, rate: number) => {
    setVoiceError('');
    const onError = () => setVoiceError('صدای این دستگاه برای این زبان در دسترس نیست؛ متن و ترجمه همچنان دیده می‌شوند.');
    if (language === 'ru') {
      await new Promise<void>(resolve => {
        playRussianSpeech(spokenTarget(item), rate, onError, () => resolve());
        setTimeout(resolve, 4000);
      });
      return;
    }
    await new Promise<void>(resolve => {
      playStarterSpeech(locale, spokenTarget(item), rate, onError);
      setTimeout(resolve, 4000);
    });
  }, [language, locale]);

  /** The example sentence goes through the same device voice, only slower: the learner must hear every word. */
  const saySentence = useCallback(async (item: WordLabWord, rate: number) => {
    if (!hasSpokenSentence(item)) return;
    setVoiceError('');
    const text = spokenSentence(item);
    const onError = () => setVoiceError('صدای این دستگاه برای این زبان در دسترس نیست؛ متن و ترجمه همچنان دیده می‌شوند.');
    if (language === 'ru') {
      await new Promise<void>(resolve => {
        playRussianSpeech(text, rate, onError, () => resolve());
        setTimeout(resolve, 6000);
      });
      return;
    }
    await new Promise<void>(resolve => {
      playStarterSpeech(locale, text, rate, onError);
      setTimeout(resolve, 6000);
    });
  }, [language, locale]);

  /** One pass only: target language, then Persian. The word is never played twice in a row. */
  const playOnce = useCallback(async (item: WordLabWord) => {
    const token = ++playback.current;
    await sayTarget(item, 0.72);
    if (token !== playback.current) return;
    await new Promise<void>(resolve => { speakPersian(item.fa); setTimeout(resolve, Math.min(3200, 900 + item.fa.length * 90)); });
  }, [sayTarget]);

  /** Step 2: the sentence itself, once, followed by its Persian meaning. */
  const playSentence = useCallback(async (item: WordLabWord) => {
    const token = ++playback.current;
    await saySentence(item, 0.68);
    if (token !== playback.current) return;
    await new Promise<void>(resolve => { speakPersian(item.exampleFa); setTimeout(resolve, Math.min(3600, 900 + item.exampleFa.length * 90)); });
  }, [saySentence]);

  const resetWord = useCallback(() => {
    setSpoken(false);
    setSpokenScore(null);
    setError('');
    setVoiceError('');
    stopAll();
  }, [stopAll]);

  const goNext = useCallback(() => {
    resetWord();
    const next = index + 1;
    setIndex(next);
    setPhase(next < queue.length ? 'listen' : 'done');
  }, [index, queue.length, resetWord]);

  const rate = useCallback(async (rating: ReviewRating) => {
    if (!word || !progress || saving) return;
    setSaving(true);
    const next = rateWordCard(progress, word.id, rating, spoken, new Date());
    await saveWordProgress(language, next);
    setProgress(next);
    if (spoken) void markPlanStep('speak').catch(() => undefined);
    setSaving(false);
    goNext();
  }, [word, progress, spoken, saving, language, goNext]);

  const startLearning = () => {
    setPhase('listen');
    if (word) void playOnce(word);
  };

  /** Move from hearing the word to hearing its sentence, without the learner losing the word on screen. */
  const goToSentence = useCallback(() => {
    stopAll();
    setPhase('sentence');
    if (word) void playSentence(word);
  }, [playSentence, stopAll, word]);

  /** The microphone step is always for the sentence when the card has one. */
  const practiceText = word ? (hasSpokenSentence(word) ? spokenSentence(word) : spokenTarget(word)) : '';

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="بازگشت" onPress={() => { stopAll(); router.replace(home as never); }} style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
          <ArrowRight size={20} color={C.ink} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>واژه‌های {languageName}</Text>
          <Text style={styles.headerSub}>می‌بینی، می‌شنوی، بعد از فارسی می‌گویی</Text>
        </View>
        <Sparkles size={22} color={C.primary} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {phase === 'loading' ? (
          <View style={styles.centerCard}><ActivityIndicator color={C.primary} /><Text style={styles.bodyText}>در حال آماده‌کردن واژه‌ها…</Text></View>
        ) : null}

        {phase === 'intro' && word ? (
          <View style={styles.centerCard}>
            <View style={styles.bigIcon}><Sparkles size={30} color={C.primary} /></View>
            <Text style={styles.title}>سه قدم برای هر واژه</Text>
            <View style={styles.stepList}>
              <Text style={styles.stepLine}>۱. واژه را می‌شنوی و معنی فارسی‌اش را می‌بینی.</Text>
              <Text style={styles.stepLine}>۲. یک جملهٔ واقعی با همان واژه می‌شنوی.</Text>
              <Text style={styles.stepLine}>۳. خودت همان جمله را می‌گویی؛ میکروفن خودش باز می‌شود.</Text>
            </View>
            <Text style={styles.smallText}>همه‌چیز با صدای گوشی خوانده می‌شود؛ اگر صدای ضبط‌شده را ترجیح می‌دهید، در قدم اول انتخابش کنید.</Text>
            <Text style={styles.smallText}>{fa(sessionInfo.newCount)} واژهٔ تازه · {fa(sessionInfo.dueCount)} مرور سررسید · هر واژه حدود نیم دقیقه</Text>
            {stats ? <Text style={styles.smallText}>معرفی‌شده: {fa(stats.introduced)} از {fa(stats.total)} · مسلط گفتاری: {fa(stats.mastered)}</Text> : null}
            <Pressable accessibilityRole="button" onPress={startLearning} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
              <Play size={16} color="#FFFFFF" />
              <Text style={styles.primaryText}>شروع؛ خودش می‌گوید</Text>
            </Pressable>
          </View>
        ) : null}

        {phase === 'listen' && word ? (
          <View style={styles.wordCard}>
            <Text style={styles.stepLabel}>قدم ۱ از ۳ · می‌بینی و می‌شنوی</Text>
            <Text keepColor style={styles.bigWord}>{word.target}</Text>
            <Text style={styles.wordFa}>{word.fa}</Text>
            <View style={styles.autoBox}>
              <Volume2 size={16} color={C.primary} />
              <Text style={styles.autoText}>{languageName} یک بار، بعد فارسی — بدون تکرار</Text>
            </View>
            <View style={styles.voiceBox}>
              <Text style={styles.voiceLabel}>گوینده: {useRecorded ? 'صدای ضبط‌شده' : 'صدای گوشی'}</Text>
              <View style={styles.voiceRow}>
                <Pressable accessibilityRole="button" accessibilityState={{ selected: !useRecorded }} onPress={() => void chooseVoice(false)} style={[styles.voiceButton, !useRecorded && styles.voiceButtonActive]}>
                  <Text style={[styles.voiceText, !useRecorded && styles.voiceTextActive]}>صدای گوشی</Text>
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityState={{ selected: useRecorded }} onPress={() => void chooseVoice(true)} style={[styles.voiceButton, useRecorded && styles.voiceButtonActive]}>
                  <Text style={[styles.voiceText, useRecorded && styles.voiceTextActive]}>صدای ضبط‌شده</Text>
                </Pressable>
              </View>
              {autoSwitched ? <Text style={styles.voiceHint}>صدای گوشی چند بار پخش نشد؛ موقتاً ضبط‌شده روشن شد. هر زمان خواستید «صدای گوشی» را بزنید.</Text> : null}
            </View>
            {word.exampleTarget && word.exampleTarget !== word.target ? (
              <View style={styles.exampleBox}>
                <Text keepColor style={styles.exampleTarget}>{word.exampleTarget}</Text>
                <Text style={styles.exampleFa}>{word.exampleFa}</Text>
              </View>
            ) : null}
            {word.note ? <Text style={styles.note}>{word.note}</Text> : null}
            {!!voiceError && <Text style={styles.hintWarm}>{voiceError}</Text>}
            <View style={styles.rowButtons}>
              <Pressable accessibilityRole="button" onPress={() => void playOnce(word)} style={({ pressed }) => [styles.ghostButton, pressed && styles.pressed]}>
                <RefreshCw size={14} color={C.primaryDark} /><Text style={styles.ghostText}>دوباره بشنو</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={goToSentence} style={({ pressed }) => [styles.primary, styles.grow, pressed && styles.pressed]}>
                <MessageSquareQuote size={15} color="#FFFFFF" /><Text style={styles.primaryText}>جمله را بشنو</Text><ChevronLeft size={15} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        ) : null}

        {phase === 'sentence' && word ? (
          <View style={styles.wordCard}>
            <Text style={styles.stepLabel}>قدم ۲ از ۳ · جمله را می‌شنوی</Text>
            <View style={styles.sentenceBox}>
              <Text keepColor style={styles.sentenceTarget}>{hasSpokenSentence(word) ? word.exampleTarget : word.target}</Text>
              <Text style={styles.sentenceFa}>{hasSpokenSentence(word) ? word.exampleFa : word.fa}</Text>
              {word.examplePronunciation ? <Text style={styles.sentencePronunciation}>{word.examplePronunciation}</Text> : null}
            </View>
            <View style={styles.wordChip}>
              <Text keepColor style={styles.wordChipTarget}>{word.target}</Text>
              <Text style={styles.wordChipFa}>{word.fa}</Text>
            </View>
            <View style={styles.autoBox}>
              <Volume2 size={16} color={C.primary} />
              <Text style={styles.autoText}>جمله یک بار با صدای گوشی، بعد معنی فارسی‌اش</Text>
            </View>
            {!!voiceError && <Text style={styles.hintWarm}>{voiceError}</Text>}
            <View style={styles.rowButtons}>
              <Pressable accessibilityRole="button" onPress={() => void playSentence(word)} style={({ pressed }) => [styles.ghostButton, pressed && styles.pressed]}>
                <RefreshCw size={14} color={C.primaryDark} /><Text style={styles.ghostText}>دوباره بشنو</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => { stopAll(); setPhase('recall'); }} style={({ pressed }) => [styles.primary, styles.grow, pressed && styles.pressed]}>
                <Mic2 size={15} color="#FFFFFF" /><Text style={styles.primaryText}>حالا من می‌گویم</Text><ChevronLeft size={15} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        ) : null}

        {phase === 'recall' && word ? (
          <View style={styles.wordCard}>
            <Text style={styles.stepLabel}>قدم ۳ از ۳ · جمله را تو می‌گویی</Text>
            <View style={styles.reversePrompt}>
              <Text style={styles.reverseLabel}>معنی فارسی جمله</Text>
              <Text style={styles.reverseFa}>{hasSpokenSentence(word) ? word.exampleFa : word.fa}</Text>
              {hasSpokenSentence(word) ? <Text style={styles.reverseWord}>با واژهٔ «{word.target}»</Text> : null}
            </View>
            <SpeakCheck
              key={`${word.id}-recall`}
              text={practiceText}
              locale={locale}
              accent={C.primary}
              title={hasSpokenSentence(word) ? `جملهٔ ${languageName} را بگو` : `واژهٔ ${languageName} را بگو`}
              autoStart
              onResult={result => {
                setError('');
                setSpokenScore(result.score);
                if (result.score >= 70) setSpoken(true);
                else setError('نزدیک بود؛ یک بار دیگر آهسته‌تر و واضح‌تر بگو.');
              }}
            />
            <View style={styles.rowButtons}>
              <Pressable accessibilityRole="button" onPress={() => void playSentence(word)} style={({ pressed }) => [styles.ghostButton, pressed && styles.pressed]}>
                <Volume2 size={14} color={C.primaryDark} /><Text style={styles.ghostText}>جمله را بشنو</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => void playOnce(word)} style={({ pressed }) => [styles.ghostButton, pressed && styles.pressed]}>
                <Volume2 size={14} color={C.primaryDark} /><Text style={styles.ghostText}>واژه را بشنو</Text>
              </Pressable>
            </View>
            {spoken ? <View style={styles.okBox}><Check size={15} color={C.success} /><Text style={styles.okText}>درست گفتی؛ گفتار موفق ثبت شد.</Text></View> : null}
            {!spoken && spokenScore !== null ? <Text style={styles.hintWarm}>راهنمایی: {firstLetterHint(word)} · آهسته‌تر بگو یا این واژه را بعداً تمرین کن.</Text> : null}
            {!!error && <Text style={styles.hintError}>{error}</Text>}
            {!!voiceError && <Text style={styles.hintWarm}>{voiceError}</Text>}
            <Pressable accessibilityRole="button" onPress={() => setPhase('rate')} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
              <Text style={styles.primaryText}>{spoken ? 'ادامه' : 'بعداً تمرین می‌کنم'}</Text><ChevronLeft size={15} color="#FFFFFF" />
            </Pressable>
          </View>
        ) : null}

        {phase === 'rate' && word ? (
          <View style={styles.wordCard}>
            <Text style={styles.stepLabel}>مرور</Text>
            <Text style={styles.title}>این واژه چطور بود؟</Text>
            <Text keepColor style={styles.bigWordSmall}>{word.target}</Text>
            <Text style={styles.wordFa}>{word.fa}</Text>
            {hasSpokenSentence(word) ? <Text keepColor style={styles.exampleTarget}>{word.exampleTarget}</Text> : null}
            <Text style={styles.smallText}>چرا الان؟ {wordReason(progress?.cards[word.id])}</Text>
            <ReviewRatingGrid saving={saving} score={spokenScore} onRate={rating => void rate(rating)} />
            {!spoken ? <Text style={styles.smallText}>بدون گفتار موفق، «تسلط گفتاری» ثبت نمی‌شود؛ کارت زودتر برمی‌گردد.</Text> : null}
          </View>
        ) : null}

        {phase === 'done' ? (
          <View style={styles.centerCard}>
            <View style={[styles.bigIcon, { backgroundColor: C.successSoft }]}><Check size={30} color={C.success} /></View>
            <Text style={styles.title}>{queue.length ? 'تمرین امروز تمام شد' : 'برای امروز چیزی نمانده'}</Text>
            <Text style={styles.bodyText}>{queue.length ? `${fa(sessionInfo.newCount)} واژهٔ تازه و ${fa(sessionInfo.dueCount)} مرور انجام شد.` : 'همهٔ مرورهای امروز انجام شده‌اند؛ فردا دوباره سر بزن.'}</Text>
            {stats ? <Text style={styles.smallText}>معرفی‌شده: {fa(stats.introduced)} از {fa(stats.total)} · مسلط گفتاری: {fa(stats.mastered)} · سررسید: {fa(stats.due)}</Text> : null}
            <Pressable accessibilityRole="button" onPress={() => setReloadToken(value => value + 1)} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
              <RefreshCw size={15} color="#FFFFFF" /><Text style={styles.primaryText}>یک دور دیگر</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => router.replace(home as never)} style={({ pressed }) => [styles.ghostButton, pressed && styles.pressed]}>
              <Text style={styles.ghostText}>بازگشت به خانه</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

/** Device TTS is primary; stopping is per language because each player keeps its own queue. */
async function stopLabSpeech(language: WordLabLanguage) {
  if (language === 'ru') await stopRussianSpeech();
  else await stopStarterSpeech();
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
  stepList: { width: '100%', gap: 6 },
  stepLine: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: C.text, textAlign: 'right', writingDirection: 'rtl' },
  bigWord: { fontFamily: 'Times New Roman', fontSize: 36, lineHeight: 46, fontWeight: '800', color: C.ink, textAlign: 'center', writingDirection: 'ltr' },
  bigWordSmall: { fontFamily: 'Times New Roman', fontSize: 26, lineHeight: 36, fontWeight: '800', color: C.ink, textAlign: 'center', writingDirection: 'ltr' },
  sentenceBox: { width: '100%', gap: 6, padding: 14, borderRadius: 16, backgroundColor: C.primarySoft },
  sentenceTarget: { fontFamily: 'Times New Roman', fontSize: 21, lineHeight: 32, fontWeight: '700', color: C.ink, textAlign: 'center', writingDirection: 'ltr' },
  sentenceFa: { fontFamily: Typography.fontFamily, fontSize: 13, lineHeight: 22, color: C.text, textAlign: 'center', writingDirection: 'rtl' },
  sentencePronunciation: { fontFamily: Typography.fontFamily, fontSize: 11, lineHeight: 20, color: C.muted, textAlign: 'center', writingDirection: 'rtl' },
  wordChip: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8 },
  wordChipTarget: { fontFamily: 'Times New Roman', fontSize: 16, fontWeight: '700', color: C.primaryDark, writingDirection: 'ltr' },
  wordChipFa: { fontFamily: Typography.fontFamily, fontSize: 12, color: C.muted, writingDirection: 'rtl' },
  reverseWord: { fontFamily: Typography.fontFamily, fontSize: 11, color: C.primaryDark, textAlign: 'center', writingDirection: 'rtl' },
  wordFa: { fontFamily: Typography.fontFamily, fontSize: 17, color: C.text, textAlign: 'center', writingDirection: 'rtl' },
  autoBox: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 7, padding: 10, borderRadius: 12, backgroundColor: C.primarySoft },
  autoText: { fontFamily: Typography.fontFamily, fontSize: 11, color: C.primaryDark, writingDirection: 'rtl', textAlign: 'right' },
  voiceBox: { width: '100%', gap: 7, padding: 11, borderRadius: 14, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  voiceLabel: { fontFamily: Typography.fontFamily, fontSize: 11, color: C.muted, textAlign: 'right', writingDirection: 'rtl' },
  voiceRow: { flexDirection: 'row-reverse', gap: 8 },
  voiceButton: { flex: 1, minHeight: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 11, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface },
  voiceButtonActive: { borderColor: C.primary, backgroundColor: C.primarySoft },
  voiceText: { fontFamily: Typography.fontFamily, fontSize: 12, color: C.text, writingDirection: 'rtl' },
  voiceTextActive: { color: C.primaryDark },
  voiceHint: { fontFamily: Typography.fontFamily, fontSize: 10, lineHeight: 17, color: C.warning, textAlign: 'right', writingDirection: 'rtl' },
  exampleBox: { width: '100%', gap: 4, padding: 12, borderRadius: 14, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  exampleTarget: { fontFamily: 'Times New Roman', fontSize: 16, lineHeight: 26, color: C.ink, textAlign: 'center', writingDirection: 'ltr' },
  exampleFa: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: C.muted, textAlign: 'center', writingDirection: 'rtl' },
  rowButtons: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  grow: { flex: 1 },
  primary: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 46, paddingHorizontal: 18, borderRadius: 14, backgroundColor: C.primary },
  primaryText: { fontFamily: Typography.fontFamily, fontSize: 13, color: '#FFFFFF', writingDirection: 'rtl' },
  ghostButton: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 46, paddingHorizontal: 14, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  ghostText: { fontFamily: Typography.fontFamily, fontSize: 12, color: C.text, writingDirection: 'rtl' },
  pressed: { opacity: 0.82 },
  note: { fontFamily: Typography.fontFamily, fontSize: 11, lineHeight: 19, color: C.warning, textAlign: 'right', writingDirection: 'rtl' },
  hintError: { fontFamily: Typography.fontFamily, fontSize: 11, color: C.danger, textAlign: 'right', writingDirection: 'rtl' },
  hintWarm: { fontFamily: Typography.fontFamily, fontSize: 11, color: C.warning, textAlign: 'right', writingDirection: 'rtl' },
  okBox: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, padding: 9, borderRadius: 12, backgroundColor: C.successSoft },
  okText: { fontFamily: Typography.fontFamily, fontSize: 11, color: C.success, writingDirection: 'rtl' },
  reversePrompt: { width: '100%', padding: 14, borderRadius: 16, backgroundColor: C.primarySoft, gap: 4, alignItems: 'center' },
  reverseLabel: { fontFamily: Typography.fontFamily, fontSize: 10, color: C.primaryDark, writingDirection: 'rtl' },
  reverseFa: { fontFamily: Typography.fontFamily, fontSize: 22, lineHeight: 34, color: C.ink, textAlign: 'center', writingDirection: 'rtl' },
});
