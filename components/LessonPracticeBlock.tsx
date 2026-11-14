import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CheckCircle2, Volume2 } from 'lucide-react-native';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { Typography } from '@/lib/theme';
import { toPersianDigits as fa } from '@/lib/format';
import type { PracticeItem } from '@/lib/lessonPractice';

/**
 * Soft-mandatory retrieval practice: every item must be answered, but there is
 * no score and no failure. A wrong answer reveals the correct one and the item
 * is re-queued at the end until it is answered correctly once.
 */
interface Props {
  title: string;
  intro: string;
  items: PracticeItem[];
  /** Plays target-language audio. */
  onSpeak: (text: string) => void;
  /** Fires once when the queue is empty. */
  onComplete: () => void;
  /** When true, the block renders in its finished state. */
  completed?: boolean;
  /** Foreign-text font style (Times New Roman bold in this app). */
  foreignStyle: object;
  accent?: string;
}

const KIND_LABEL: Record<PracticeItem['kind'], string> = {
  fill: 'جای خالی را پر کن',
  meaning: 'کدام جمله این معنی را می‌دهد؟',
  listen: 'گوش کن؛ معنی کدام است؟',
};

export default function LessonPracticeBlock({ title, intro, items, onSpeak, onComplete, completed, foreignStyle, accent = Palette.primary }: Props) {
  const [queue, setQueue] = useState<PracticeItem[]>(items);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(0);
  const [retries, setRetries] = useState(0);
  const total = items.length;
  const current = queue[0];
  const finished = completed || (total > 0 && !current);

  useEffect(() => { setQueue(items); setSelected(null); setDone(0); setRetries(0); }, [items]);
  useEffect(() => { if (!completed && total > 0 && !current) onComplete(); }, [completed, total, current, onComplete]);
  useEffect(() => { if (current?.kind === 'listen' && selected === null) onSpeak(current.speakText); }, [current, selected, onSpeak]);

  const correct = current ? selected === current.correctIndex : false;
  const advance = useCallback(() => {
    if (!current) return;
    setQueue(value => {
      const [head, ...rest] = value;
      return correct ? rest : [...rest, head];
    });
    if (correct) setDone(value => value + 1); else setRetries(value => value + 1);
    setSelected(null);
  }, [current, correct]);

  const progress = useMemo(() => total === 0 ? 0 : Math.round((done / total) * 100), [done, total]);

  if (total === 0) return null;
  if (finished) {
    return (
      <View style={[styles.card, { borderColor: accent }]}>
        <View style={styles.doneRow}><CheckCircle2 size={22} color={Palette.success} /><Text style={styles.title}>{title}</Text></View>
        <Text style={styles.intro}>{fa(total)} تمرین انجام شد{retries > 0 ? `؛ ${fa(retries)} مورد دوباره پرسیده شد و درست جواب دادید.` : ' — همه بار اول درست بود.'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.intro}>{intro}</Text>
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>{fa(done)} از {fa(total)}</Text>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: accent }]} /></View>
      </View>
      {current ? <View style={styles.question}>
        <Text style={styles.kind}>{KIND_LABEL[current.kind]}</Text>
        {current.kind === 'listen'
          ? <Pressable accessibilityRole="button" accessibilityLabel="پخش دوباره" onPress={() => onSpeak(current.speakText)} style={[styles.playButton, { backgroundColor: accent }]}><Volume2 size={20} color="#FFFFFF" /><Text style={styles.playText}>پخش دوباره</Text></Pressable>
          : <Text style={current.kind === 'fill' ? [styles.foreignPrompt, foreignStyle] : styles.persianPrompt}>{current.prompt}</Text>}
        {current.kind === 'fill' && current.hint ? <Text style={styles.hint}>{current.hint}</Text> : null}
        <View style={styles.choices}>
          {current.choices.map((choice, index) => {
            const isSelected = selected === index;
            const showCorrect = selected !== null && index === current.correctIndex;
            const showWrong = isSelected && !showCorrect;
            return (
              <Pressable key={`${current.id}-${index}`} accessibilityRole="radio" accessibilityState={{ checked: isSelected, disabled: selected !== null }} disabled={selected !== null} onPress={() => setSelected(index)}
                style={[styles.choice, showCorrect && styles.choiceCorrect, showWrong && styles.choiceWrong]}>
                <Text style={current.foreignChoices ? [styles.choiceForeign, foreignStyle] : styles.choicePersian}>{choice}</Text>
              </Pressable>
            );
          })}
        </View>
        {selected !== null ? <View style={styles.feedback}>
          <Text style={correct ? styles.feedbackOk : styles.feedbackNo}>{correct ? 'درست است.' : 'این بار درست نبود؛ این تمرین کمی بعد دوباره می‌آید.'}</Text>
          <Text style={[styles.answerForeign, foreignStyle]}>{current.answerText}</Text>
          <Text style={styles.answerFa}>{current.answerFa}</Text>
          <View style={styles.feedbackActions}>
            <Pressable accessibilityRole="button" onPress={() => onSpeak(current.speakText)} style={styles.listenAgain}><Volume2 size={16} color={Palette.primaryDark} /><Text style={styles.listenAgainText}>بشنو</Text></Pressable>
            <Pressable accessibilityRole="button" onPress={advance} style={[styles.nextButton, { backgroundColor: accent }]}><Text style={styles.nextText}>{queue.length === 1 && correct ? 'پایان تمرین' : 'بعدی'}</Text></Pressable>
          </View>
        </View> : null}
      </View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', marginTop: 18, borderRadius: 20, padding: 17, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: 10 },
  doneRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  title: { fontFamily: Typography.fontFamily, fontSize: 17, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  intro: { fontFamily: Typography.fontFamily, fontSize: 11, lineHeight: 19, color: Palette.text, textAlign: 'right', writingDirection: 'rtl' },
  progressRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  progressText: { fontFamily: Typography.fontFamily, fontSize: 12, color: Palette.primaryDark },
  progressTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: Palette.surfaceMuted, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3 },
  question: { gap: 9, marginTop: 4 },
  kind: { fontFamily: Typography.fontFamily, fontSize: 12, color: Palette.primaryDark, textAlign: 'right', writingDirection: 'rtl' },
  foreignPrompt: { fontSize: 17, lineHeight: 28, color: Palette.ink, textAlign: 'center', writingDirection: 'ltr' },
  persianPrompt: { fontFamily: Typography.fontFamily, fontSize: 15, lineHeight: 26, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  hint: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: '#8A929E', textAlign: 'right', writingDirection: 'rtl' },
  playButton: { alignSelf: 'center', flexDirection: 'row-reverse', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingVertical: 11, borderRadius: 999 },
  playText: { fontFamily: Typography.fontFamily, fontSize: 13, color: '#FFFFFF' },
  choices: { gap: 8 },
  choice: { minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, paddingHorizontal: 13, paddingVertical: 11, justifyContent: 'center' },
  choiceCorrect: { borderColor: Palette.success, backgroundColor: Palette.successSoft },
  choiceWrong: { borderColor: Palette.danger, backgroundColor: '#FDECEC' },
  choiceForeign: { fontSize: 13, lineHeight: 21, color: Palette.ink, textAlign: 'right', writingDirection: 'ltr' },
  choicePersian: { fontFamily: Typography.fontFamily, fontSize: 13, lineHeight: 21, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  feedback: { borderRadius: 12, padding: 12, backgroundColor: Palette.surfaceMuted, gap: 5 },
  feedbackOk: { fontFamily: Typography.fontFamily, color: Palette.success, fontSize: 12, textAlign: 'right', writingDirection: 'rtl' },
  feedbackNo: { fontFamily: Typography.fontFamily, color: Palette.danger, fontSize: 12, textAlign: 'right', writingDirection: 'rtl' },
  answerForeign: { fontSize: 13, lineHeight: 21, color: Palette.ink, textAlign: 'right', writingDirection: 'ltr' },
  answerFa: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: '#8A929E', textAlign: 'right', writingDirection: 'rtl' },
  feedbackActions: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  listenAgain: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surface },
  listenAgainText: { fontFamily: Typography.fontFamily, fontSize: 12, color: Palette.primaryDark },
  nextButton: { paddingHorizontal: 22, paddingVertical: 10, borderRadius: 999 },
  nextText: { fontFamily: Typography.fontFamily, fontSize: 13, color: '#FFFFFF' },
});
