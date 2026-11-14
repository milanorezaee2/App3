import { LocalizedText as Text } from '@/components/LocalizedText';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Check, Eye, EyeOff, Volume2, X } from 'lucide-react-native';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';

type Item = { id: string; text: string; fa: string };

interface Props {
  items: readonly Item[];
  activeIndex: number;
  onSelect: (index: number) => void;
  accent?: string;
  /** Font style for the foreign-language text (e.g. Cyrillic serif). */
  foreignStyle?: object;
  /** Label for the unit ("جمله", "واژه"). */
  unitLabel?: string;
}

function seeded(seed: string) {
  let h = 0; for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return () => { h = (h * 1664525 + 1013904223) >>> 0; return h / 4294967296; };
}

/**
 * Listening stage with a «بدون متن» mode: the learner hears the sentence first, picks its meaning
 * from three Persian options, and only then sees the text. The classic list (text visible) is one tap away.
 */
export default function BlindListeningList({ items, activeIndex, onSelect, accent = Palette.primary, foreignStyle, unitLabel = 'جمله' }: Props) {
  const [blind, setBlind] = useState(items.length >= 3);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  useEffect(() => { setAnswers({}); }, [items]);

  const options = useMemo(() => {
    const random = seeded(items.map(item => item.id).join('|'));
    return items.map((item, index) => {
      const others = items.filter((_, i) => i !== index).map(other => other.fa).filter((value, i, all) => value !== item.fa && all.indexOf(value) === i);
      const picked: string[] = [];
      while (picked.length < 2 && others.length) picked.push(others.splice(Math.floor(random() * others.length), 1)[0]);
      const list = [item.fa, ...picked];
      for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
      return list;
    });
  }, [items]);

  const correctCount = items.filter((item, index) => answers[item.id] !== undefined && options[index][answers[item.id]] === item.fa).length;
  const answeredCount = Object.keys(answers).length;

  return (
    <View style={styles.wrap}>
      <View style={styles.modeRow}>
        <Pressable accessibilityRole="button" accessibilityState={{ selected: blind }} onPress={() => setBlind(value => !value)} style={[styles.modeButton, blind && { backgroundColor: accent, borderColor: accent }]}>
          {blind ? <EyeOff size={15} color="#FFFFFF" /> : <Eye size={15} color={accent} />}
          <Text style={[styles.modeText, blind && { color: '#FFFFFF' }]}>{blind ? 'بدون متن · اول بشنو' : 'نمایش متن'}</Text>
        </Pressable>
        {blind && answeredCount > 0 ? <Text style={styles.scoreText}>{fa(correctCount)} از {fa(answeredCount)} درست</Text> : null}
      </View>
      {blind ? <Text style={styles.hint}>روی هر {unitLabel} بزن تا پخش شود؛ بعد معنی‌اش را از سه گزینه انتخاب کن. متن بعد از انتخاب ظاهر می‌شود.</Text> : null}
      <View style={styles.list}>
        {items.map((item, index) => {
          const active = index === activeIndex;
          const picked = answers[item.id];
          const revealed = !blind || picked !== undefined;
          const correct = picked !== undefined && options[index][picked] === item.fa;
          return (
            <View key={item.id} style={[styles.card, active && { borderColor: accent, backgroundColor: '#F5F7FF' }]}>
              <Pressable accessibilityRole="button" accessibilityLabel={`پخش ${unitLabel} ${fa(index + 1)}`} accessibilityState={{ selected: active }} style={styles.row} onPress={() => onSelect(index)}>
                <View style={[styles.number, active && { backgroundColor: accent }]}><Text style={[styles.numberText, active && { color: '#FFFFFF' }]}>{fa(index + 1)}</Text></View>
                {revealed
                  ? <Text style={[styles.foreign, foreignStyle]}>{item.text}</Text>
                  : <View style={styles.hidden}><View style={styles.hiddenBar} /><View style={[styles.hiddenBar, { width: '55%' }]} /></View>}
                <Volume2 size={19} color={accent} />
              </Pressable>
              {blind && picked === undefined ? (
                <View style={styles.options}>
                  {options[index].map((option, optionIndex) => (
                    <Pressable key={`${item.id}-${optionIndex}`} accessibilityRole="button" style={styles.option} onPress={() => { setAnswers(value => ({ ...value, [item.id]: optionIndex })); if (!active) onSelect(index); }}>
                      <Text keepColor style={styles.optionText}>{option}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
              {blind && picked !== undefined ? (
                <View style={[styles.verdict, correct ? styles.verdictOk : styles.verdictMiss]}>
                  {correct ? <Check size={14} color="#15803D" /> : <X size={14} color="#B91C1C" />}
                  <Text keepColor style={[styles.verdictText, { color: correct ? '#15803D' : '#B91C1C' }]}>{correct ? 'درست؛ معنی: ' : 'نه؛ معنی درست: '}<Text keepColor style={styles.verdictFa}>{item.fa}</Text></Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', gap: 10 },
  modeRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  modeButton: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1.5, borderColor: Palette.border, backgroundColor: Palette.surface },
  modeText: { fontFamily: Typography.fontFamily, fontSize: 12, color: Palette.text },
  scoreText: { fontFamily: Typography.fontFamily, fontSize: 12, color: Palette.primaryDark },
  hint: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: Palette.text, textAlign: 'right', writingDirection: 'rtl' },
  list: { gap: 8 },
  card: { borderRadius: 16, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surface, padding: 10, gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  number: { width: 28, height: 28, borderRadius: 14, backgroundColor: Palette.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  numberText: { fontFamily: Typography.fontFamily, fontSize: 12, color: Palette.text },
  foreign: { flex: 1, fontFamily: Typography.latinFontFamily, fontSize: 16, color: Palette.ink, textAlign: 'left', writingDirection: 'ltr' },
  hidden: { flex: 1, gap: 6 },
  hiddenBar: { height: 10, borderRadius: 5, backgroundColor: '#E2E8F0', width: '80%' },
  options: { gap: 6 },
  option: { minHeight: 40, borderRadius: 10, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.canvas, paddingHorizontal: 12, justifyContent: 'center' },
  optionText: { fontFamily: Typography.fontFamily, fontSize: 13, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  verdict: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  verdictOk: { backgroundColor: '#ECFDF5' },
  verdictMiss: { backgroundColor: '#FEF2F2' },
  verdictText: { fontFamily: Typography.fontFamily, fontSize: 12, writingDirection: 'rtl', flexShrink: 1 },
  verdictFa: { fontFamily: Typography.fontFamily, fontSize: 12 },
});
