import { LocalizedText as Text } from '@/components/LocalizedText';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, BookOpen, Check, ChevronLeft, Mic2, RefreshCw, Sparkles, Volume2 } from 'lucide-react-native';
import { RussianBottomNav } from '@/components/RussianBottomNav';
import SpeakCheck from '@/components/SpeakCheck';
import { ReviewRatingGrid } from '@/components/ReviewRecall';
import { playRussianSpeech, stopRussianSpeech } from '@/lib/russianSpeech';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';
import { scoreWritten } from '@/lib/writtenScore';
import { markPlanStep } from '@/lib/dailyPlan';
import type { ReviewRating } from '@/lib/courseProgress';
import {
  RUSSIAN_VOCAB_WORDS,
  firstLetterHint,
  spokenTarget,
  type RussianVocabWord,
} from '@/lib/languages/russianVocab';
import {
  NEW_VOCAB_PER_SESSION,
  buildVocabSession,
  loadVocabProgress,
  rateVocabCard,
  saveVocabProgress,
  vocabReason,
  vocabStats,
  type RussianVocabProgress,
} from '@/lib/russianVocabProgress';

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
  dangerSoft: '#FEE2E2',
};

type Phase = 'loading' | 'intro' | 'expose' | 'shadow' | 'reverse' | 'context' | 'rate' | 'done';
type Outcome = { spoken: boolean; score: number };

type AttemptProps = {
  word: RussianVocabWord;
  phase: 'shadow' | 'reverse';
  onDone: (outcome: Outcome) => void;
};

/** Shared gate: the learner must say the Russian word (or use the explicit no-mic fallback). */
function SpokenAttempt({ word, phase, onDone }: AttemptProps) {
  const target = spokenTarget(word);
  const [speechScore, setSpeechScore] = useState<number | null>(null);
  const [fallback, setFallback] = useState(false);
  const [typed, setTyped] = useState('');
  const [typedOk, setTypedOk] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [typedError, setTypedError] = useState(false);
  const showTarget = phase === 'shadow';

  const speak = () => { void playRussianSpeech(target, 0.62, () => undefined); };
  const spokenPassed = speechScore !== null && speechScore >= 70;
  const canContinue = spokenPassed || typedOk;
  const finalScore = typedOk ? 100 : speechScore ?? 0;

  const continueNext = () => {
    void stopRussianSpeech();
    onDone({ spoken: spokenPassed, score: finalScore });
  };

  const checkTyped = () => {
    const ok = scoreWritten(target, typed).ok;
    setTypedOk(ok);
    setTypedError(!ok);
    if (ok) setHintVisible(false);
  };

  return (
    <View style={styles.attemptCard}>
      {showTarget ? <Text keepColor style={styles.targetWord}>{word.ru}</Text> : null}
      <Text style={styles.attemptPrompt}>
        {showTarget
          ? 'همان واژه را بعد از شنیدن، بلند تکرار کن.'
          : 'روسی مخفی است. فقط معنی فارسی را ببین و واژهٔ روسی را بلند بگو.'}
      </Text>
      <Pressable accessibilityRole="button" onPress={speak} style={({ pressed }) => [styles.audioButton, pressed && styles.pressed]}>
        <Volume2 size={16} color={C.primary} />
        <Text style={styles.audioButtonText}>بشنو</Text>
      </Pressable>

      {!fallback ? (
        <>
          <SpeakCheck
            key={`${word.id}-${phase}`}
            text={target}
            locale="ru-RU"
            accent={C.primary}
            title={showTarget ? 'تکرار کن' : 'از فارسی به روسی بگو'}
            onResult={result => {
              setSpeechScore(result.score);
              if (result.score < 70) setHintVisible(true);
            }}
          />
          <Pressable accessibilityRole="button" onPress={() => setFallback(true)} style={({ pressed }) => [styles.fallbackLink, pressed && styles.pressed]}>
            <Text style={styles.fallbackText}>میکروفن کار نکرد؛ مینویسم</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.typedBox}>
          <Text style={styles.typedLabel}>واژهٔ روسی را تایپ کن</Text>
          <TextInput
            value={typed}
            onChangeText={value => { setTyped(value); setTypedOk(false); setTypedError(false); }}
            onSubmitEditing={checkTyped}
            returnKeyType="done"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="например: Приве́т"
            placeholderTextColor={C.muted}
            style={styles.typedInput}
          />
          {typedError ? <Text style={styles.typedError}>درست نشد؛ دوباره بنویس یا برگرد سراغ میکروفن.</Text> : null}
          <View style={styles.typedActions}>
            <Pressable accessibilityRole="button" onPress={checkTyped} style={({ pressed }) => [styles.smallPrimary, pressed && styles.pressed]}>
              <Text style={styles.smallPrimaryText}>بررسی</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => { setFallback(false); setTypedOk(false); setTypedError(false); }} style={({ pressed }) => [styles.smallGhost, pressed && styles.pressed]}>
              <Text style={styles.smallGhostText}>بازگشت به میکروفن</Text>
            </Pressable>
          </View>
        </View>
      )}

      {hintVisible && !canContinue ? (
        <View style={styles.hintCard}>
          <Text style={styles.hintText}>راهنمایی: {firstLetterHint(word)} · دوباره بشنو و آهستهتر بگو.</Text>
          <Pressable accessibilityRole="button" onPress={speak} style={({ pressed }) => [styles.hintAudio, pressed && styles.pressed]}>
            <Volume2 size={14} color={C.warning} />
            <Text style={styles.hintAudioText}>پخش دوباره</Text>
          </Pressable>
        </View>
      ) : null}

      {canContinue ? (
        <Pressable accessibilityRole="button" onPress={continueNext} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
          <Check size={16} color="#FFFFFF" />
          <Text style={styles.primaryText}>{typedOk && !spokenPassed ? 'نوشته شد؛ ادامه' : 'گفتم؛ ادامه'}</Text>
          <ChevronLeft size={15} color="#FFFFFF" />
        </Pressable>
      ) : null}
      {typedOk && !spokenPassed ? (
        <Text style={styles.noSpeechNote}>این مرحله نوشتاری ثبت شد؛ بدون تلفظ موفق، «تسلط گفتاری» ثبت نمیشود.</Text>
      ) : null}
    </View>
  );
}

export default function RussianVocabLab() {
  const router = useRouter();
  const [reloadToken, setReloadToken] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');
  const [progress, setProgress] = useState<RussianVocabProgress | null>(null);
  const [queue, setQueue] = useState<readonly RussianVocabWord[]>([]);
  const [index, setIndex] = useState(0);
  const [sessionInfo, setSessionInfo] = useState({ dueCount: 0, newCount: 0 });
  const [shadowOutcome, setShadowOutcome] = useState<Outcome | null>(null);
  const [lastOutcome, setLastOutcome] = useState<Outcome | null>(null);
  const [contextScore, setContextScore] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const stored = await loadVocabProgress();
      const session = buildVocabSession(RUSSIAN_VOCAB_WORDS, stored, new Date());
      if (session.introduced !== stored) await saveVocabProgress(session.introduced);
      if (!alive) return;
      setProgress(session.introduced);
      setQueue(session.queue);
      setIndex(0);
      setSessionInfo({ dueCount: session.dueCount, newCount: session.newCount });
      setShadowOutcome(null);
      setLastOutcome(null);
      setContextScore(null);
      setPhase(session.queue.length ? 'intro' : 'done');
    })();
    return () => { alive = false; void stopRussianSpeech(); };
  }, [reloadToken]);

  const stats = useMemo(() => progress ? vocabStats(RUSSIAN_VOCAB_WORDS, progress) : null, [progress]);
  const word = queue[index];

  const resetWordState = useCallback(() => {
    setShadowOutcome(null);
    setLastOutcome(null);
    setContextScore(null);
    void stopRussianSpeech();
  }, []);

  const goNext = useCallback(() => {
    const next = index + 1;
    resetWordState();
    setIndex(next);
    setPhase(next < queue.length ? 'expose' : 'done');
  }, [index, queue.length, resetWordState]);

  const speak = useCallback((text: string, rate = 0.75) => {
    void playRussianSpeech(text, rate, () => undefined);
  }, []);

  const rate = useCallback(async (rating: ReviewRating) => {
    if (!word || !progress) return;
    const next = rateVocabCard(progress, word.id, rating, lastOutcome?.spoken ?? false, new Date());
    if (lastOutcome?.spoken) void markPlanStep('speak').catch(() => undefined);
    await saveVocabProgress(next);
    setProgress(next);
    goNext();
  }, [word, progress, lastOutcome, goNext]);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="بازگشت" onPress={() => { void stopRussianSpeech(); router.replace('/learn/ru' as never); }} style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
          <ArrowRight size={20} color={C.ink} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>واژهخانهٔ روسی</Text>
          <Text style={styles.headerSub}>ببین · بشنو · بگو · برعکس بگو · مرور کن</Text>
        </View>
        <Sparkles size={22} color={C.primary} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {phase === 'loading' ? (
          <View style={styles.centerCard}><ActivityIndicator color={C.primary} /><Text style={styles.bodyText}>در حال آماده کردن واژهها…</Text></View>
        ) : null}

        {phase === 'intro' && word ? (
          <View style={styles.centerCard}>
            <View style={styles.bigIcon}><BookOpen size={30} color={C.primary} /></View>
            <Text style={styles.title}>تمرین امروز</Text>
            <Text style={styles.bodyText}>
              {fa(sessionInfo.newCount)} واژهٔ تازه و {fa(sessionInfo.dueCount)} واژهٔ سررسید. اول اپ واژهٔ روسی و معنی فارسیاش را نشان میدهد؛ بعد تو باید همان واژه را بگویی، سپس فقط فارسی بماند و آن را به روسی برگردانی.
            </Text>
            <Text style={styles.smallText}>
              بانک پایلوت: {fa(RUSSIAN_VOCAB_WORDS.length)} واژه از دل درسهای روسی · معرفی {fa(NEW_VOCAB_PER_SESSION)} واژه در هر جلسه · بدون توکن و سرویس جدید.
            </Text>
            {stats ? <Text style={styles.smallText}>معرفیشده: {fa(stats.introduced)} · مسلط گفتاری: {fa(stats.mastered)} · سررسید: {fa(stats.due)}</Text> : null}
            <Pressable accessibilityRole="button" onPress={() => setPhase('expose')} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
              <Mic2 size={16} color="#FFFFFF" />
              <Text style={styles.primaryText}>شروع تمرین</Text>
            </Pressable>
          </View>
        ) : null}

        {phase === 'expose' && word ? (
          <View style={styles.wordCard}>
            <Text style={styles.stepLabel}>گام ۱ از ۵ · آشنایی</Text>
            <Text keepColor style={styles.bigWord}>{word.ru}</Text>
            <Text style={styles.wordFa}>{word.fa}</Text>
            <View style={styles.noteBox}><Sparkles size={14} color={C.warning} /><Text style={styles.noteText}>{word.note}</Text></View>
            <View style={styles.exampleBox}>
              <Text keepColor style={styles.exampleRu}>{word.exampleRu}</Text>
              <Text style={styles.exampleFa}>{word.exampleFa}</Text>
              <Pressable accessibilityRole="button" onPress={() => speak(word.exampleRu)} style={({ pressed }) => [styles.audioButton, pressed && styles.pressed]}>
                <Volume2 size={15} color={C.primary} /><Text style={styles.audioButtonText}>بشنو</Text>
              </Pressable>
            </View>
            <Pressable accessibilityRole="button" onPress={() => setPhase('shadow')} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
              <Text style={styles.primaryText}>فهمیدم؛ حالا تکرارش میکنم</Text><ChevronLeft size={15} color="#FFFFFF" />
            </Pressable>
          </View>
        ) : null}

        {phase === 'shadow' && word ? (
          <View style={styles.wordCard}>
            <Text style={styles.stepLabel}>گام ۲ از ۵ · تکرار گفتاری</Text>
            <SpokenAttempt key={`${word.id}-shadow`} word={word} phase="shadow" onDone={outcome => { setShadowOutcome(outcome); setPhase('reverse'); }} />
          </View>
        ) : null}

        {phase === 'reverse' && word ? (
          <View style={styles.wordCard}>
            <Text style={styles.stepLabel}>گام ۳ از ۵ · برعکس بگو</Text>
            <View style={styles.reversePrompt}>
              <Text style={styles.reverseLabel}>معنی فارسی</Text>
              <Text style={styles.reverseFa}>{word.fa}</Text>
              <Text style={styles.smallText}>واژهٔ روسی اینجا مخفی است؛ باید آن را بلند بگویی.</Text>
            </View>
            <SpokenAttempt key={`${word.id}-reverse`} word={word} phase="reverse" onDone={outcome => { setLastOutcome(outcome); setPhase('context'); }} />
          </View>
        ) : null}

        {phase === 'context' && word ? (
          <View style={styles.wordCard}>
            <Text style={styles.stepLabel}>گام ۴ از ۵ · واژه در جمله</Text>
            <Text keepColor style={styles.bigWordSmall}>{word.ru}</Text>
            <Text style={styles.wordFa}>{word.fa}</Text>
            <View style={styles.exampleBox}>
              <Text keepColor style={styles.exampleRu}>{word.exampleRu}</Text>
              <Text style={styles.exampleFa}>{word.exampleFa}</Text>
              <Pressable accessibilityRole="button" onPress={() => speak(word.exampleRu)} style={({ pressed }) => [styles.audioButton, pressed && styles.pressed]}>
                <Volume2 size={15} color={C.primary} /><Text style={styles.audioButtonText}>بشنو</Text>
              </Pressable>
            </View>
            <Text style={styles.smallText}>جمله را هم بگو (اختیاری؛ گفتنش نمرهٔ جداگانه میگیرد).</Text>
            <SpeakCheck key={`${word.id}-context`} text={word.exampleRu} locale="ru-RU" accent={C.success} title="جمله را بگو" onResult={result => setContextScore(result.score)} />
            {contextScore !== null ? <Text style={styles.smallText}>امتیاز جمله: {fa(contextScore)}٪</Text> : null}
            <Pressable accessibilityRole="button" onPress={() => setPhase('rate')} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
              <Text style={styles.primaryText}>ادامه؛ امتیاز بده</Text><ChevronLeft size={15} color="#FFFFFF" />
            </Pressable>
          </View>
        ) : null}

        {phase === 'rate' && word ? (
          <View style={styles.wordCard}>
            <Text style={styles.stepLabel}>گام ۵ از ۵ · مرور هوشمند</Text>
            <Text style={styles.title}>یادآوری این واژه چطور بود؟</Text>
            <Text keepColor style={styles.bigWordSmall}>{word.ru}</Text>
            <Text style={styles.wordFa}>{word.fa}</Text>
            {shadowOutcome ? <Text style={styles.smallText}>تکرار اول: {fa(shadowOutcome.score)}٪ · معکوس: {fa(lastOutcome?.score ?? 0)}٪{lastOutcome?.spoken ? '' : ' (نوشتاری)'}</Text> : null}
            {!lastOutcome?.spoken ? <Text style={styles.noSpeechNote}>تلفظ موفق ثبت نشده؛ تا گفتار درست نشود، واژه «مسلط گفتاری» نمیشود.</Text> : null}
            <Text style={styles.smallText}>چرا این کارت اینجاست؟ {vocabReason(progress?.cards[word.id])}</Text>
            <ReviewRatingGrid saving={false} score={lastOutcome?.spoken ? lastOutcome.score : null} onRate={rating => void rate(rating)} />
          </View>
        ) : null}

        {phase === 'done' ? (
          <View style={styles.centerCard}>
            <View style={[styles.bigIcon, { backgroundColor: C.successSoft }]}><Check size={30} color={C.success} /></View>
            <Text style={styles.title}>تمرین امروز تمام شد</Text>
            <Text style={styles.bodyText}>
              {fa(sessionInfo.newCount)} واژهٔ تازه و {fa(sessionInfo.dueCount)} واژهٔ مروری تمرین شد.
            </Text>
            {stats ? <Text style={styles.smallText}>واژههای معرفیشده: {fa(stats.introduced)} · مسلط گفتاری: {fa(stats.mastered)} · سررسید بعدی: {fa(stats.due)}</Text> : null}
            <View style={styles.doneActions}>
              <Pressable accessibilityRole="button" onPress={() => setReloadToken(value => value + 1)} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
                <RefreshCw size={15} color="#FFFFFF" /><Text style={styles.primaryText}>یک دور دیگر</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => router.replace('/learn/ru' as never)} style={({ pressed }) => [styles.smallGhost, styles.doneHome, pressed && styles.pressed]}>
                <Text style={styles.smallGhostText}>بازگشت به خانه</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </ScrollView>
      <RussianBottomNav />
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
  smallText: { fontFamily: Typography.fontFamily, fontSize: 11, lineHeight: 19, color: C.muted, textAlign: 'right', writingDirection: 'rtl' },
  stepLabel: { fontFamily: Typography.fontFamily, fontSize: 11, color: C.primaryDark, textAlign: 'right', writingDirection: 'rtl' },
  bigWord: { fontFamily: 'Times New Roman', fontSize: 34, lineHeight: 44, fontWeight: '800', color: C.ink, textAlign: 'center', writingDirection: 'ltr' },
  bigWordSmall: { fontFamily: 'Times New Roman', fontSize: 26, lineHeight: 36, fontWeight: '800', color: C.ink, textAlign: 'center', writingDirection: 'ltr' },
  wordFa: { fontFamily: Typography.fontFamily, fontSize: 17, color: C.text, textAlign: 'center', writingDirection: 'rtl' },
  noteBox: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 8, padding: 12, borderRadius: 14, backgroundColor: C.warningSoft },
  noteText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: 11, lineHeight: 19, color: C.warning, textAlign: 'right', writingDirection: 'rtl' },
  exampleBox: { width: '100%', padding: 14, borderRadius: 16, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, gap: 6, alignItems: 'center' },
  exampleRu: { fontFamily: 'Times New Roman', fontSize: 19, lineHeight: 30, fontWeight: '700', color: C.ink, textAlign: 'center', writingDirection: 'ltr' },
  exampleFa: { fontFamily: Typography.fontFamily, fontSize: 12, color: C.text, textAlign: 'center', writingDirection: 'rtl' },
  audioButton: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: C.primarySoft },
  audioButtonText: { fontFamily: Typography.fontFamily, fontSize: 11, color: C.primaryDark },
  primary: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 46, paddingHorizontal: 18, borderRadius: 14, backgroundColor: C.primary },
  primaryText: { fontFamily: Typography.fontFamily, fontSize: 13, color: '#FFFFFF', writingDirection: 'rtl' },
  pressed: { opacity: 0.82 },
  attemptCard: { width: '100%', borderRadius: 18, padding: 14, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, gap: 10, alignItems: 'center' },
  attemptPrompt: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: C.text, textAlign: 'center', writingDirection: 'rtl' },
  targetWord: { fontFamily: 'Times New Roman', fontSize: 28, fontWeight: '800', color: C.ink, writingDirection: 'ltr' },
  fallbackLink: { padding: 6 },
  fallbackText: { fontFamily: Typography.fontFamily, fontSize: 11, color: C.muted, textDecorationLine: 'underline', writingDirection: 'rtl' },
  typedBox: { width: '100%', gap: 8, alignItems: 'stretch' },
  typedLabel: { fontFamily: Typography.fontFamily, fontSize: 11, color: C.text, textAlign: 'right', writingDirection: 'rtl' },
  typedInput: { minHeight: 44, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, paddingHorizontal: 12, fontSize: 17, color: C.ink, textAlign: 'left', writingDirection: 'ltr' },
  typedError: { fontFamily: Typography.fontFamily, fontSize: 11, color: C.danger, textAlign: 'right', writingDirection: 'rtl' },
  typedActions: { flexDirection: 'row-reverse', gap: 8, justifyContent: 'center' },
  smallPrimary: { minHeight: 36, paddingHorizontal: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: C.primary },
  smallPrimaryText: { fontFamily: Typography.fontFamily, fontSize: 12, color: '#FFFFFF' },
  smallGhost: { minHeight: 36, paddingHorizontal: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  smallGhostText: { fontFamily: Typography.fontFamily, fontSize: 12, color: C.text, writingDirection: 'rtl' },
  hintCard: { width: '100%', flexDirection: 'row-reverse', alignItems: 'center', gap: 8, padding: 10, borderRadius: 12, backgroundColor: C.warningSoft },
  hintText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: 11, lineHeight: 18, color: C.warning, textAlign: 'right', writingDirection: 'rtl' },
  hintAudio: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 999, backgroundColor: C.surface },
  hintAudioText: { fontFamily: Typography.fontFamily, fontSize: 10, color: C.warning },
  noSpeechNote: { fontFamily: Typography.fontFamily, fontSize: 11, lineHeight: 18, color: C.danger, textAlign: 'right', writingDirection: 'rtl' },
  reversePrompt: { width: '100%', padding: 14, borderRadius: 16, backgroundColor: C.primarySoft, gap: 4, alignItems: 'center' },
  reverseLabel: { fontFamily: Typography.fontFamily, fontSize: 10, color: C.primaryDark, writingDirection: 'rtl' },
  reverseFa: { fontFamily: Typography.fontFamily, fontSize: 22, lineHeight: 34, color: C.ink, textAlign: 'center', writingDirection: 'rtl' },
  doneActions: { width: '100%', gap: 8, alignItems: 'stretch' },
  doneHome: { alignSelf: 'center', paddingHorizontal: 18 },
});
