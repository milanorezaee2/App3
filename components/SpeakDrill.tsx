import { LocalizedText as Text } from '@/components/LocalizedText';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronLeft, Mic2, RotateCcw, Trophy, Volume2 } from 'lucide-react-native';
import SpeakCheck, { type SpeakCheckResult } from '@/components/SpeakCheck';
import { toPersianDigits as fa } from '@/lib/format';

type Item = { id: string; text: string; fa?: string };
type Props = { items: Item[]; locale: string; accent?: string; onSpeak?: (text: string) => void };

/**
 * «آزمون گفتاری» — a speaking checkpoint: the learner says every sentence of the lesson
 * one by one, each attempt is scored with SpeakCheck, and a final average is shown.
 */
export default function SpeakDrill({ items, locale, accent = '#2563EB', onSpeak }: Props) {
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
  const next = () => { if (index < items.length - 1) setIndex(index + 1); else setDone(true); };
  const onResult = (result: SpeakCheckResult) => { if (current) setScores(previous => ({ ...previous, [current.id]: Math.max(previous[current.id] ?? 0, result.score) })); };

  if (done) {
    const color = average >= 70 ? '#15803D' : average >= 40 ? '#B45309' : '#B91C1C';
    return (
      <View style={styles.card}>
        <View style={styles.headRow}><Trophy size={20} color={accent} /><Text style={styles.title}>نتیجهٔ آزمون گفتاری</Text></View>
        <Text keepColor style={[styles.bigScore, { color }]}>{fa(average)}٪</Text>
        <Text style={styles.summary}>{average >= 85 ? 'عالی! تلفظ شما در این درس روان و واضح بود.' : average >= 60 ? 'خوب بود؛ جمله‌های کم‌امتیاز را دوباره تمرین کنید.' : 'نیاز به تمرین بیشتر؛ مرحلهٔ سایه‌خوانی را دوباره مرور کنید.'}</Text>
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
      <View style={styles.headRow}><Mic2 size={20} color={accent} /><Text style={styles.title}>آزمون گفتاری · Speaking Check</Text></View>
      <Text style={styles.summary}>هر جمله را با صدای بلند بگویید؛ در پایان میانگین امتیاز شما نمایش داده می‌شود.</Text>
      <View style={styles.progressRow}>{items.map((item, i) => <View key={item.id} style={[styles.segment, i < index && styles.segmentDone, i === index && { backgroundColor: accent }]} />)}</View>
      <Text style={styles.counter}>جملهٔ {fa(index + 1)} از {fa(items.length)}</Text>
      <Text style={styles.sentence}>{current.text}</Text>
      {current.fa ? <Text keepColor style={styles.persian}>{current.fa}</Text> : null}
      {onSpeak ? <Pressable accessibilityRole="button" accessibilityLabel="شنیدن نمونه" style={styles.listen} onPress={() => onSpeak(current.text)}><Volume2 size={16} color={accent} /><Text keepColor style={[styles.listenText, { color: accent }]}>شنیدن نمونه</Text></Pressable> : null}
      <SpeakCheck key={current.id} text={current.text} locale={locale} accent={accent} title="بگو" onResult={onResult} />
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" style={[styles.button, { backgroundColor: answered ? accent : '#94A3B8' }]} onPress={next}><Text keepColor style={styles.buttonText}>{index < items.length - 1 ? (answered ? 'جملهٔ بعدی' : 'رد کردن') : 'پایان آزمون'}</Text><ChevronLeft size={17} color="#FFFFFF" /></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', marginTop: 16, padding: 14, borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', gap: 8, alignItems: 'center' },
  headRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  title: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  summary: { fontSize: 12.5, lineHeight: 20, color: '#475569', textAlign: 'center' },
  progressRow: { flexDirection: 'row', gap: 4, width: '100%', marginTop: 2 },
  segment: { flex: 1, height: 5, borderRadius: 3, backgroundColor: '#E2E8F0' },
  segmentDone: { backgroundColor: '#86EFAC' },
  counter: { fontSize: 12, color: '#64748B' },
  sentence: { fontSize: 20, fontWeight: '700', color: '#0F172A', textAlign: 'center', lineHeight: 30, writingDirection: 'ltr' },
  persian: { fontSize: 13, color: '#6B7280', textAlign: 'center' },
  listen: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: '#F1F5F9' },
  listenText: { fontSize: 13, fontWeight: '700' },
  actions: { width: '100%', alignItems: 'center', marginTop: 2 },
  button: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999 },
  buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  bigScore: { fontSize: 40, fontWeight: '900' },
  list: { width: '100%', gap: 6 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  listScore: { width: 48, fontSize: 14, fontWeight: '800', textAlign: 'center' },
  listText: { flex: 1, fontSize: 14, color: '#334155', writingDirection: 'ltr', textAlign: 'left' },
});
