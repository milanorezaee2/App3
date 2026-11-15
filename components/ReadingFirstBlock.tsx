import { LocalizedText as Text } from '@/components/LocalizedText';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type TextStyle } from 'react-native';
import { BookOpen, Check, Eye, Volume2, X } from 'lucide-react-native';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { Typography } from '@/lib/theme';
import { toPersianDigits as fa } from '@/lib/format';
import { hapticCorrect, hapticTap, hapticWrong } from '@/lib/haptics';
import { buildReadingQuestions, type ReadingLine } from '@/lib/lessonReading';

/**
 * B1+ opener: the lesson dialogue as a reading text with no translation, then a
 * short comprehension check. The Persian text unlocks only after the questions
 * (or on explicit request), so the learner reads before being told.
 */
export default function ReadingFirstBlock({ lessonId, lines, onSpeak, foreignStyle, accent = Palette.primary }: {
  lessonId: string;
  lines: readonly ReadingLine[];
  onSpeak: (text: string) => void;
  foreignStyle?: StyleProp<TextStyle>;
  accent?: string;
}) {
  const questions = useMemo(() => buildReadingQuestions(lines, lessonId), [lines, lessonId]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState(false);
  const answered = questions.filter((_, index) => answers[index] !== undefined).length;
  const correct = questions.filter((question, index) => answers[index] === question.correctIndex).length;
  const finished = questions.length > 0 && answered === questions.length;
  const showFa = revealed || finished;
  const activeIndex = questions.findIndex((_, index) => answers[index] === undefined);

  if (!lines.length) return null;
  return <View style={styles.root}>
    <View style={styles.header}>
      <View style={[styles.badge, { backgroundColor: accent }]}><BookOpen size={16} color="#FFFFFF" /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>اول بخوان</Text>
        <Text style={styles.subtitle}>متن را بدون ترجمه بخوان؛ بعد {fa(questions.length)} پرسش کوتاه جواب بده.</Text>
      </View>
    </View>

    <View style={styles.passage}>
      {lines.map((line, index) => <View key={`${index}-${line.text}`} style={styles.line}>
        <Pressable accessibilityRole="button" accessibilityLabel={`شنیدن: ${line.text}`} onPress={() => onSpeak(line.text)} style={styles.lineSound}><Volume2 size={15} color={accent} /></Pressable>
        <View style={{ flex: 1, gap: 2 }}>
          {line.speaker ? <Text style={styles.speaker}>{line.speaker}</Text> : null}
          <Text style={[styles.lineText, foreignStyle]}>{line.text}</Text>
          {showFa ? <Text keepColor style={styles.lineFa}>{line.fa}</Text> : null}
        </View>
      </View>)}
      <Pressable accessibilityRole="button" onPress={() => onSpeak(lines.map(line => line.text).join(' '))} style={[styles.playAll, { borderColor: accent }]}>
        <Volume2 size={15} color={accent} /><Text style={[styles.playAllText, { color: accent }]}>پخش کل متن</Text>
      </Pressable>
    </View>

    {questions.map((question, index) => {
      const chosen = answers[index];
      const open = index === activeIndex;
      if (chosen === undefined && !open) return null;
      return <View key={index} style={[styles.question, chosen !== undefined && styles.questionDone]}>
        <Text style={styles.prompt}>{fa(index + 1)}. {question.promptFa}</Text>
        {question.choices.map((choice, choiceIndex) => {
          const isCorrect = choiceIndex === question.correctIndex;
          const picked = chosen === choiceIndex;
          const show = chosen !== undefined;
          return <Pressable key={choiceIndex} accessibilityRole="radio" accessibilityState={{ checked: picked, disabled: show }} disabled={show}
            onPress={() => { hapticTap(); if (isCorrect) hapticCorrect(); else hapticWrong(); setAnswers(value => ({ ...value, [index]: choiceIndex })); }}
            style={[styles.choice, show && isCorrect && styles.choiceCorrect, show && picked && !isCorrect && styles.choiceWrong]}>
            <Text style={[question.foreign ? styles.choiceForeign : styles.choiceFa, question.foreign && foreignStyle, show && isCorrect && { color: Palette.success }, show && picked && !isCorrect && { color: Palette.danger }]}>{choice}</Text>
            {show && isCorrect ? <Check size={16} color={Palette.success} /> : show && picked ? <X size={16} color={Palette.danger} /> : null}
          </Pressable>;
        })}
      </View>;
    })}

    {finished ? <View style={styles.result}>
      <Text style={styles.resultText}>{correct === questions.length ? 'عالی؛ متن را درست فهمیدی.' : `${fa(correct)} از ${fa(questions.length)} درست. حالا ترجمه را ببین و دوباره بخوان.`}</Text>
    </View> : !revealed ? <Pressable accessibilityRole="button" onPress={() => setRevealed(true)} style={styles.reveal}><Eye size={15} color={Palette.muted} /><Text style={styles.revealText}>ترجمه را نشان بده</Text></Pressable> : null}
  </View>;
}

const styles = StyleSheet.create({
  root: { width: '100%', gap: 12, marginTop: 14 },
  header: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  badge: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: Typography.fontFamily, fontSize: 17, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  subtitle: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: Palette.muted, textAlign: 'right', writingDirection: 'rtl' },
  passage: { borderRadius: 16, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surface, padding: 14, gap: 12 },
  line: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  lineSound: { width: 30, height: 30, borderRadius: 15, backgroundColor: Palette.surfaceMuted, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  speaker: { fontFamily: Typography.fontFamily, fontSize: 11, color: Palette.muted, textAlign: 'left', writingDirection: 'ltr' },
  lineText: { fontSize: 17, lineHeight: 27, color: Palette.ink, textAlign: 'left', writingDirection: 'ltr' },
  lineFa: { fontFamily: Typography.fontFamily, fontSize: 13, lineHeight: 22, color: Palette.muted, textAlign: 'right', writingDirection: 'rtl' },
  playAll: { alignSelf: 'flex-start', flexDirection: 'row-reverse', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  playAllText: { fontFamily: Typography.fontFamily, fontSize: 12 },
  question: { borderRadius: 14, backgroundColor: Palette.surfaceMuted, padding: 12, gap: 8 },
  questionDone: { opacity: 0.92 },
  prompt: { fontFamily: Typography.fontFamily, fontSize: 15, lineHeight: 25, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  choice: { minHeight: 44, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8, borderRadius: 12, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surface, paddingHorizontal: 12, paddingVertical: 8 },
  choiceCorrect: { borderColor: Palette.success, backgroundColor: Palette.successSoft },
  choiceWrong: { borderColor: Palette.danger, backgroundColor: Palette.dangerSoft },
  choiceFa: { flex: 1, fontFamily: Typography.fontFamily, fontSize: 14, lineHeight: 23, color: Palette.text, textAlign: 'right', writingDirection: 'rtl' },
  choiceForeign: { flex: 1, fontSize: 15, lineHeight: 24, color: Palette.ink, textAlign: 'left', writingDirection: 'ltr' },
  result: { borderRadius: 12, padding: 12, backgroundColor: Palette.successSoft },
  resultText: { fontFamily: Typography.fontFamily, fontSize: 14, lineHeight: 23, color: Palette.success, textAlign: 'right', writingDirection: 'rtl' },
  reveal: { alignSelf: 'center', flexDirection: 'row-reverse', alignItems: 'center', gap: 6, paddingVertical: 6 },
  revealText: { fontFamily: Typography.fontFamily, fontSize: 12, color: Palette.muted },
});
