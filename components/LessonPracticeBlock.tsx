import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, CheckCircle2, Flame, Volume2, X, SkipForward } from 'lucide-react-native';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { Typography } from '@/lib/theme';
import { toPersianDigits as fa } from '@/lib/format';
import { buildRetryItem, practiceBudgetSeconds, type PracticeItem, type PracticeKind, type PracticeStats } from '@/lib/lessonPractice';
import { hapticCorrect, hapticTap, hapticWrong } from '@/lib/haptics';
import type { LearningLesson } from '@/lib/languages/types';

/**
 * Blitz round: a handful of mixed-format items, a soft timer bar, a combo
 * counter, and one retry (in a different format) for anything missed.
 * No score gate: the round ends when every sentence has been answered correctly once.
 */
interface Props {
  title: string;
  intro: string;
  items: PracticeItem[];
  /** Lesson the items were built from; needed to build a retry in another format. */
  source: Pick<LearningLesson, 'id' | 'sentences'>;
  retryKinds?: PracticeKind[];
  onSpeak: (text: string) => void;
  onComplete: (stats: PracticeStats) => void;
  /** Final stats recorded by the parent; lets a re-mounted block show the right summary (total 0 = skipped). */
  summary?: PracticeStats;
  completed?: boolean;
  /** Lets the learner skip the rest of the round; reported as completed with zero progress. */
  onSkip?: () => void;
  /** Exam mode: no second chances; every item counts once. */
  exam?: boolean;
  foreignStyle: object;
  accent?: string;
}

const KIND_LABEL: Record<PracticeKind, string> = {
  order: 'کلمه‌ها را به ترتیب بچین',
  fill: 'کلمهٔ جاافتاده کدام است؟',
  listen: 'گوش کن؛ معنی کدام است؟',
  truefalse: 'این معنی درست است؟',
  match: 'هر جمله را به معنی‌اش وصل کن',
};

export default function LessonPracticeBlock({ title, intro, items, source, retryKinds, onSpeak, onComplete, completed, onSkip, exam, foreignStyle, accent = Palette.primary, summary }: Props) {
  const [queue, setQueue] = useState<PracticeItem[]>(items);
  const [resolved, setResolved] = useState<null | boolean>(null); // null = unanswered, true/false = outcome
  const [done, setDone] = useState(0);
  const [retries, setRetries] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [combo, setCombo] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number | null>(null);
  const finishedSeconds = useRef(0);
  // per-kind transient state
  const [picked, setPicked] = useState<number | null>(null);
  const [orderPicked, setOrderPicked] = useState<number[]>([]);
  const [matchLeft, setMatchLeft] = useState<number | null>(null);
  const [matchDone, setMatchDone] = useState<Record<number, number>>({});
  const [matchMiss, setMatchMiss] = useState(false);
  const comboPulse = useRef(new Animated.Value(0)).current;

  const total = items.length;
  const current = queue[0];
  const finished = completed || (total > 0 && !current);
  const budget = useMemo(() => practiceBudgetSeconds(total), [total]);

  useEffect(() => { setQueue(items); setResolved(null); setDone(0); setRetries(0); setFirstTry(0); setCombo(0); setElapsed(0); startedAt.current = null; resetTransient(); }, [items]);
  useEffect(() => {
    if (finished || total === 0) return;
    if (startedAt.current === null) startedAt.current = Date.now();
    const handle = setInterval(() => setElapsed(Math.floor((Date.now() - (startedAt.current ?? Date.now())) / 1000)), 1000);
    return () => clearInterval(handle);
  }, [finished, total]);
  useEffect(() => {
    if (!completed && total > 0 && !current) {
      finishedSeconds.current = startedAt.current ? Math.round((Date.now() - startedAt.current) / 1000) : 0;
      onComplete({ total, retries, seconds: finishedSeconds.current, firstTryCorrect: firstTry });
    }
  }, [completed, total, current, onComplete, retries, firstTry]);
  useEffect(() => { if (current?.kind === 'listen' && resolved === null) onSpeak(current.speakText); }, [current, resolved, onSpeak]);

  function resetTransient() { setPicked(null); setOrderPicked([]); setMatchLeft(null); setMatchDone({}); setMatchMiss(false); }

  const settle = useCallback((ok: boolean) => {
    if (!current || resolved !== null) return;
    setResolved(ok);
    if (ok) {
      hapticCorrect();
      if (!current.retry) setFirstTry(v => v + 1);
      setCombo(v => { const next = v + 1; if (next >= 3) { comboPulse.setValue(0); Animated.spring(comboPulse, { toValue: 1, friction: 4, useNativeDriver: true }).start(); } return next; });
    } else { hapticWrong(); setCombo(0); }
  }, [current, resolved, comboPulse]);

  const advance = useCallback(() => {
    if (!current || resolved === null) return;
    const ok = resolved;
    setQueue(value => {
      const [head, ...rest] = value;
      if (ok || head.retry || exam) return rest;
      const retry = buildRetryItem(source.id, head, source, retryKinds);
      return retry ? [...rest, retry] : rest;
    });
    if (ok) setDone(v => v + 1); else if (!current.retry && !exam) setRetries(v => v + 1); else setDone(v => v + 1);
    setResolved(null);
    resetTransient();
    hapticTap();
  }, [current, resolved, source, retryKinds, exam]);

  if (total === 0) return null;
  const fromParent = completed && summary && done === 0 ? summary : null;
  const skipped = fromParent ? fromParent.total === 0 : finished && done < total;
  const shownFirstTry = fromParent ? fromParent.firstTryCorrect : firstTry;
  const shownRetries = fromParent ? fromParent.retries : retries;
  const shownSeconds = fromParent ? fromParent.seconds : finishedSeconds.current;
  if (finished) {
    return (
      <View style={[styles.card, { borderColor: accent }]}>
        {skipped
          ? <><View style={styles.doneRow}><SkipForward size={22} color="#B45309" /><Text style={styles.title}>{title ? `${title} · رد شد` : 'رد شد'}</Text></View>
              <Text style={styles.intro}>{done > 0 ? `${fa(done)} از ${fa(total)} ضربه انجام شد؛ بقیه رد شد.` : 'این بار رد شد؛ در مرور بعدی دوباره می‌آید.'}</Text></>
          : <><View style={styles.doneRow}><CheckCircle2 size={22} color={Palette.success} /><Text style={styles.title}>{title || 'تمام شد'}</Text></View>
              <Text style={styles.intro}>{fa(shownFirstTry)} از {fa(total)} بار اول درست{shownSeconds > 0 ? ` · ${fa(shownSeconds)} ثانیه` : ''}{shownRetries > 0 ? ` · ${fa(shownRetries)} مورد با قالب دیگر جبران شد` : ''}.</Text></>}
      </View>
    );
  }
  if (!current) return null;

  const remaining = Math.max(0, budget - elapsed);
  const overtime = elapsed > budget;
  const timerWidth = `${Math.max(0, Math.min(100, (remaining / budget) * 100))}%` as const;

  return (
    <View style={styles.card}>
      <View style={styles.headRow}>
        {title ? <Text style={styles.title}>{title}</Text> : <View />}
        <View style={styles.headRight}>
          <Text style={styles.counter}>{fa(done + 1)} / {fa(total)}</Text>
          {onSkip ? <Pressable accessibilityRole="button" accessibilityLabel="رد کردن این تمرین" onPress={onSkip} hitSlop={8} style={({ pressed }) => [styles.skipButton, pressed && { opacity: 0.75 }]}><SkipForward size={15} color="#B45309" /><Text style={styles.skipText}>رد کردن</Text></Pressable> : null}
        </View>
      </View>
      {done === 0 && resolved === null ? <Text style={styles.intro}>{intro}</Text> : null}
      <View style={styles.timerRow}>
        <Text style={[styles.timerText, overtime && { color: '#B45309' }]}>{overtime ? 'بدون عجله؛ ادامه بده' : `${fa(remaining)} ث`}</Text>
        <View style={styles.timerTrack}><View style={[styles.timerFill, { width: timerWidth, backgroundColor: overtime ? '#F59E0B' : accent }]} /></View>
      </View>
      {combo >= 3 ? <Animated.View style={[styles.comboPill, { transform: [{ scale: comboPulse.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] }]}><Flame size={14} color="#B45309" /><Text style={styles.comboText}>{fa(combo)} تا پشت‌سرهم!</Text></Animated.View> : null}

      <Text style={styles.kind}>{KIND_LABEL[current.kind]}{current.retry ? ' · دوباره، به شکل دیگر' : ''}</Text>

      {current.kind === 'fill' ? <>
        <Text style={[styles.foreignPrompt, foreignStyle]}>{current.prompt}</Text>
        <Text style={styles.hint}>{current.hint}</Text>
        <View style={styles.choices}>{current.choices.map((choice, index) => {
          const show = resolved !== null; const isCorrect = index === current.correctIndex; const isPicked = picked === index;
          return <Pressable key={index} accessibilityRole="radio" disabled={show} onPress={() => { setPicked(index); settle(index === current.correctIndex); }} style={[styles.choice, show && isCorrect && styles.choiceCorrect, show && isPicked && !isCorrect && styles.choiceWrong]}><Text style={[styles.choiceForeign, foreignStyle]}>{choice}</Text></Pressable>;
        })}</View>
      </> : null}

      {current.kind === 'listen' ? <>
        <Pressable accessibilityRole="button" accessibilityLabel="پخش دوباره" onPress={() => onSpeak(current.speakText)} style={[styles.playButton, { backgroundColor: accent }]}><Volume2 size={20} color="#FFFFFF" /><Text style={styles.playText}>پخش دوباره</Text></Pressable>
        <View style={styles.choices}>{current.choices.map((choice, index) => {
          const show = resolved !== null; const isCorrect = index === current.correctIndex; const isPicked = picked === index;
          return <Pressable key={index} accessibilityRole="radio" disabled={show} onPress={() => { setPicked(index); settle(index === current.correctIndex); }} style={[styles.choice, show && isCorrect && styles.choiceCorrect, show && isPicked && !isCorrect && styles.choiceWrong]}><Text style={styles.choicePersian}>{choice}</Text></Pressable>;
        })}</View>
      </> : null}

      {current.kind === 'truefalse' ? <>
        <Text style={[styles.foreignPrompt, foreignStyle]}>{current.answerText}</Text>
        <Text style={styles.tfMeaning}>{current.shownFa}</Text>
        <View style={styles.tfRow}>
          <Pressable accessibilityRole="button" accessibilityLabel="غلط" disabled={resolved !== null} onPress={() => { setPicked(0); settle(!current.isTrue); }} style={[styles.tfButton, styles.tfNo, resolved !== null && !current.isTrue && styles.choiceCorrect, resolved !== null && picked === 0 && current.isTrue && styles.choiceWrong]}><X size={26} color={Palette.danger} /><Text style={styles.tfLabel}>غلط</Text></Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="درست" disabled={resolved !== null} onPress={() => { setPicked(1); settle(current.isTrue); }} style={[styles.tfButton, styles.tfYes, resolved !== null && current.isTrue && styles.choiceCorrect, resolved !== null && picked === 1 && !current.isTrue && styles.choiceWrong]}><Check size={26} color={Palette.success} /><Text style={styles.tfLabel}>درست</Text></Pressable>
        </View>
      </> : null}

      {current.kind === 'order' ? <>
        <Text style={styles.hint}>{current.answerFa}</Text>
        <View style={styles.orderLine}>{orderPicked.length === 0 ? <Text style={styles.orderPlaceholder}>کلمه‌ها را به ترتیب بزن…</Text> : orderPicked.map((tokenIndex, i) => <Pressable key={`${tokenIndex}-${i}`} disabled={resolved !== null} onPress={() => setOrderPicked(v => v.filter((_, k) => k !== i))} style={[styles.token, styles.tokenPicked]}><Text style={[styles.tokenText, foreignStyle]}>{current.tokens[tokenIndex]}</Text></Pressable>)}</View>
        <View style={styles.tokenBank}>{current.tokens.map((token, index) => orderPicked.includes(index) ? <View key={index} style={[styles.token, styles.tokenUsed]}><Text style={[styles.tokenText, foreignStyle, { opacity: 0 }]}>{token}</Text></View> : <Pressable key={index} disabled={resolved !== null} onPress={() => { const next = [...orderPicked, index]; setOrderPicked(next); if (next.length === current.tokens.length) settle(next.map(i => current.tokens[i]).join(' ') === current.answerTokens.join(' ')); }} style={styles.token}><Text style={[styles.tokenText, foreignStyle]}>{token}</Text></Pressable>)}</View>
      </> : null}

      {current.kind === 'match' ? <View style={styles.matchGrid}>
        <View style={styles.matchCol}>{current.leftOrder.map(i => { const isDone = matchDone[i] !== undefined; const active = matchLeft === i;
          return <Pressable key={`l${i}`} disabled={isDone || resolved !== null} onPress={() => { setMatchLeft(i); setMatchMiss(false); }} style={[styles.matchCell, active && styles.matchActive, isDone && styles.choiceCorrect]}><Text style={[styles.choiceForeign, foreignStyle]}>{current.pairs[i].text}</Text></Pressable>; })}</View>
        <View style={styles.matchCol}>{current.rightOrder.map(i => { const isDone = Object.values(matchDone).includes(i);
          return <Pressable key={`r${i}`} disabled={isDone || matchLeft === null || resolved !== null} onPress={() => { if (matchLeft === null) return; if (matchLeft === i) { const next = { ...matchDone, [i]: i }; setMatchDone(next); setMatchLeft(null); hapticTap(); if (Object.keys(next).length === 3) settle(!matchMiss); } else { setMatchMiss(true); setMatchLeft(null); hapticWrong(); } }} style={[styles.matchCell, isDone && styles.choiceCorrect]}><Text style={styles.choicePersian}>{current.pairs[i].fa}</Text></Pressable>; })}</View>
        {matchMiss && resolved === null ? <Text style={styles.feedbackNo}>جفت اشتباه بود؛ دوباره انتخاب کن.</Text> : null}
      </View> : null}

      {resolved !== null ? <View style={styles.feedback}>
        <Text style={resolved ? styles.feedbackOk : styles.feedbackNo}>{resolved ? (combo >= 3 ? 'عالی! ادامه بده.' : 'درست است.') : current.retry || exam ? 'پاسخ درست این بود:' : 'این بار نه؛ کمی بعد به شکل دیگری می‌پرسم.'}</Text>
        {current.kind !== 'match' ? <><Text style={[styles.answerForeign, foreignStyle]}>{current.answerText}</Text><Text style={styles.answerFa}>{current.answerFa}</Text></> : null}
        <View style={styles.feedbackActions}>
          <Pressable accessibilityRole="button" onPress={() => onSpeak(current.speakText)} style={styles.listenAgain}><Volume2 size={16} color={Palette.primaryDark} /><Text style={styles.listenAgainText}>بشنو</Text></Pressable>
          <Pressable accessibilityRole="button" onPress={advance} style={[styles.nextButton, { backgroundColor: accent }]}><Text style={styles.nextText}>{queue.length === 1 && (resolved || current.retry || exam) ? 'پایان' : 'بعدی'}</Text></Pressable>
        </View>
      </View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', marginTop: 18, borderRadius: 20, padding: 17, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: 10 },
  headRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  doneRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  title: { fontFamily: Typography.fontFamily, fontSize: 17, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  headRight: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  skipButton: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, minHeight: 36, paddingHorizontal: 14, borderRadius: 999, backgroundColor: '#FFFBEB', borderWidth: 1.5, borderColor: '#F59E0B' },
  skipText: { fontFamily: Typography.fontFamily, fontSize: 13, color: '#B45309', fontWeight: '700' },
  counter: { fontFamily: Typography.fontFamily, fontSize: 13, color: Palette.primaryDark },
  intro: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: Palette.text, textAlign: 'right', writingDirection: 'rtl' },
  timerRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  timerText: { fontFamily: Typography.fontFamily, fontSize: 12, color: Palette.text, minWidth: 44, textAlign: 'right' },
  timerTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: Palette.surfaceMuted, overflow: 'hidden' },
  timerFill: { height: 6, borderRadius: 3 },
  comboPill: { alignSelf: 'flex-end', flexDirection: 'row-reverse', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FCD34D' },
  comboText: { fontFamily: Typography.fontFamily, fontSize: 12, color: '#92400E' },
  kind: { fontFamily: Typography.fontFamily, fontSize: 13, color: Palette.primaryDark, textAlign: 'right', writingDirection: 'rtl', marginTop: 2 },
  foreignPrompt: { fontSize: 17, lineHeight: 28, color: Palette.ink, textAlign: 'center', writingDirection: 'ltr' },
  hint: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: '#8A929E', textAlign: 'right', writingDirection: 'rtl' },
  tfMeaning: { fontFamily: Typography.fontFamily, fontSize: 15, lineHeight: 26, color: Palette.ink, textAlign: 'center', writingDirection: 'rtl' },
  tfRow: { flexDirection: 'row-reverse', gap: 12, marginTop: 4 },
  tfButton: { flex: 1, minHeight: 72, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  tfYes: { borderColor: '#BBF7D0', backgroundColor: '#F0FDF4' },
  tfNo: { borderColor: '#FECACA', backgroundColor: '#FEF2F2' },
  tfLabel: { fontFamily: Typography.fontFamily, fontSize: 13, color: Palette.ink },
  playButton: { alignSelf: 'center', flexDirection: 'row-reverse', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingVertical: 11, borderRadius: 999 },
  playText: { fontFamily: Typography.fontFamily, fontSize: 13, color: '#FFFFFF' },
  choices: { gap: 8 },
  choice: { minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, paddingHorizontal: 13, paddingVertical: 11, justifyContent: 'center' },
  choiceCorrect: { borderColor: Palette.success, backgroundColor: Palette.successSoft },
  choiceWrong: { borderColor: Palette.danger, backgroundColor: '#FDECEC' },
  choiceForeign: { fontSize: 13, lineHeight: 21, color: Palette.ink, textAlign: 'right', writingDirection: 'ltr' },
  choicePersian: { fontFamily: Typography.fontFamily, fontSize: 13, lineHeight: 21, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  orderLine: { minHeight: 52, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: Palette.border, padding: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  orderPlaceholder: { fontFamily: Typography.fontFamily, fontSize: 12, color: '#8A929E', writingDirection: 'rtl' },
  tokenBank: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  token: { borderRadius: 10, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, paddingHorizontal: 10, paddingVertical: 7 },
  tokenPicked: { backgroundColor: Palette.primarySoft, borderColor: Palette.primary },
  tokenUsed: { backgroundColor: 'transparent', borderColor: 'transparent' },
  tokenText: { fontSize: 13, lineHeight: 20, color: Palette.ink, writingDirection: 'ltr' },
  matchGrid: { flexDirection: 'row-reverse', gap: 8, flexWrap: 'wrap' },
  matchCol: { flex: 1, gap: 8, minWidth: 130 },
  matchCell: { minHeight: 56, borderRadius: 12, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, paddingHorizontal: 10, paddingVertical: 8, justifyContent: 'center' },
  matchActive: { borderColor: Palette.primary, backgroundColor: Palette.primarySoft },
  feedback: { borderRadius: 12, padding: 12, backgroundColor: Palette.surfaceMuted, gap: 5 },
  feedbackOk: { fontFamily: Typography.fontFamily, color: Palette.success, fontSize: 12, textAlign: 'right', writingDirection: 'rtl' },
  feedbackNo: { fontFamily: Typography.fontFamily, color: Palette.danger, fontSize: 12, textAlign: 'right', writingDirection: 'rtl', width: '100%' },
  answerForeign: { fontSize: 13, lineHeight: 21, color: Palette.ink, textAlign: 'right', writingDirection: 'ltr' },
  answerFa: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: '#8A929E', textAlign: 'right', writingDirection: 'rtl' },
  feedbackActions: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  listenAgain: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surface },
  listenAgainText: { fontFamily: Typography.fontFamily, fontSize: 12, color: Palette.primaryDark },
  nextButton: { paddingHorizontal: 22, paddingVertical: 10, borderRadius: 999 },
  nextText: { fontFamily: Typography.fontFamily, fontSize: 13, color: '#FFFFFF' },
});
