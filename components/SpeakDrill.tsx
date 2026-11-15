import { LocalizedText as Text } from '@/components/LocalizedText';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronLeft, RotateCcw, Trophy, Volume2 } from 'lucide-react-native';
import SpeakCheck, { type SpeakCheckResult } from '@/components/SpeakCheck';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';

type Item = { id: string; text: string; fa?: string };
export type SpeakDrillResult = { average: number; scores: Record<string, number> };
type Props = { items: Item[]; locale: string; accent?: string; onSpeak?: (text: string) => void; /** Called once when the learner reaches the result page. */ onFinish?: (result: SpeakDrillResult) => void };

/**
 * «آزمون گفتاری» — a speaking checkpoint: the learner says every sentence of the lesson
 * one by one, each attempt is scored with SpeakCheck, and a final average is shown.
 */
export default function SpeakDrill({ items, locale, accent = Palette.primary, onSpeak, onFinish }: Props) {
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const current = items[index];
  const answered = current ? scores[current.id] !== undefined : false;
  const average = useMemo(() => {
    const values = items.map(item => scores[item.id]).filter((value): value is number => value !== undefined);
    return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
  }, [items, scores]);

  if (!items.length) return null;

  const restart = () => { setIndex(0); setScores({}); setDone(false); };
  const next = () => {
    if (index < items.length - 1) { setIndex(index + 1); return; }
    setDone(true);
    const filled: Record<string, number> = {};
    for (const item of items) filled[item.id] = scores[item.id] ?? 0;
    onFinish?.({ average, scores: filled });
  };
  const onResult = (result: SpeakCheckResult) => { if (current) setScores(previous => ({ ...previous, [current.id]: Math.max(previous[current.id] ?? 0, result.score) })); };

  if (done) {
    const color = average >= 70 ? '#15803D' : average >= 40 ? '#B45309' : '#B91C1C';
    return (
      <View style={styles.card}>
        <View style={styles.headRow}><Trophy size={20} color={accent} /><Text style={styles.title}>نتیجه</Text></View>
        <Text keepColor style={[styles.bigScore, { color }]}>{fa(average)}٪</Text>
        <Text style={styles.summary}>{average >= 85 ? 'روان و واضح.' : average >= 60 ? 'خوب؛ جمله‌های کم‌امتیاز را دوباره بگو.' : 'سایه‌خوانی را یک بار دیگر مرور کن.'}</Text>
        <View style={styles.list}>{items.map((item, i) => {
          const value = scores[item.id] ?? 0;
          return <View key={item.id} style={styles.listRow}><Text keepColor style={[styles.listScore, { color: value >= 70 ? '#15803D' : value >= 40 ? '#B45309' : '#B91C1C' }]}>{fa(value)}٪</Text><Text style={styles.listText} numberOfLines={2}>{fa(i + 1)}. {item.text}</Text></View>;
        })}</View>
        <Pressable accessibilityRole="button" style={[styles.button, { backgroundColor: accent }]} onPress={restart}><RotateCcw size={16} color="#FFFFFF" /><Text keepColor style={styles.buttonText}>آزمون دوباره</Text></Pressable>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.progressRow}>{items.map((item, i) => <View key={item.id} style={[styles.segment, i < index && styles.segmentDone, i === index && { backgroundColor: accent }]} />)}</View>
      <Text style={styles.counter}>{fa(index + 1)} / {fa(items.length)}</Text>
      <Text style={styles.sentence}>{current.text}</Text>
      {current.fa ? <Text keepColor style={styles.persian}>{current.fa}</Text> : null}
      {onSpeak ? <Pressable accessibilityRole="button" accessibilityLabel="شنیدن نمونه" style={styles.listen} onPress={() => onSpeak(current.text)}><Volume2 size={16} color={accent} /><Text keepColor style={[styles.listenText, { color: accent }]}>شنیدن نمونه</Text></Pressable> : null}
      <SpeakCheck key={current.id} text={current.text} locale={locale} accent={accent} title="بگو" onResult={onResult} />
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" style={[styles.button, { backgroundColor: answered ? accent : '#D97706' }]} onPress={next}><Text keepColor style={styles.buttonText}>{index < items.length - 1 ? (answered ? 'جملهٔ بعدی' : 'رد کردن') : 'پایان آزمون'}</Text><ChevronLeft size={17} color="#FFFFFF" /></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', marginTop: 18, padding: 18, borderRadius: 22, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: 10, alignItems: 'center', shadowColor: '#172033', shadowOpacity: .04, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  headRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  title: { fontFamily: Typography.fontFamily, fontSize: 15, color: Palette.ink, writingDirection: 'rtl' },
  summary: { fontFamily: Typography.fontFamily, fontSize: 12.5, lineHeight: 20, color: Palette.text, textAlign: 'center', writingDirection: 'rtl' },
  progressRow: { flexDirection: 'row', gap: 4, width: '100%', marginTop: 2 },
  segment: { flex: 1, height: 5, borderRadius: 3, backgroundColor: Palette.border },
  segmentDone: { backgroundColor: Palette.primarySoft, borderWidth: 1, borderColor: '#DDE2FF' },
  counter: { fontFamily: Typography.fontFamily, fontSize: 11, color: Palette.muted, writingDirection: 'rtl' },
  sentence: { fontFamily: Typography.latinFontFamily, fontSize: 21, fontWeight: '800', color: Palette.ink, textAlign: 'center', lineHeight: 32, writingDirection: 'ltr' },
  persian: { fontFamily: Typography.fontFamily, fontSize: 13, color: Palette.muted, textAlign: 'center', writingDirection: 'rtl' },
  listen: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: Palette.primarySoft },
  listenText: { fontFamily: Typography.fontFamily, fontSize: 12, writingDirection: 'rtl' },
  actions: { width: '100%', alignItems: 'center', marginTop: 2 },
  button: { minHeight: 48, flexDirection: 'row-reverse', alignItems: 'center', gap: 7, paddingHorizontal: 22, borderRadius: 999 },
  buttonText: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 13, writingDirection: 'rtl' },
  bigScore: { fontSize: 40, fontWeight: '900' },
  list: { width: '100%', gap: 6 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  listScore: { width: 48, fontSize: 14, fontWeight: '800', textAlign: 'center' },
  listText: { flex: 1, fontSize: 14, color: '#334155', writingDirection: 'ltr', textAlign: 'left' },
});
