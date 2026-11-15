import { LocalizedText as Text } from '@/components/LocalizedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View, type StyleProp, type TextStyle } from 'react-native';
import { Check, Mic2, PenLine, Volume2 } from 'lucide-react-native';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { Typography } from '@/lib/theme';
import { toPersianDigits as fa } from '@/lib/format';
import { hapticTap } from '@/lib/haptics';
import { countWords, productionPrompt, type ProductionPrompt, type ProductionSource } from '@/lib/productionPrompt';

const KEY = (lessonId: string) => `lesson_production_v1:${lessonId}`;

async function load(lessonId: string): Promise<{ text: string; checks: number[] } | null> {
  try {
    const raw = Platform.OS === 'web' ? (typeof window === 'undefined' ? null : window.localStorage.getItem(KEY(lessonId))) : await AsyncStorage.getItem(KEY(lessonId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { text?: unknown; checks?: unknown };
    return { text: typeof parsed.text === 'string' ? parsed.text : '', checks: Array.isArray(parsed.checks) ? parsed.checks.filter((n): n is number => typeof n === 'number') : [] };
  } catch { return null; }
}
async function save(lessonId: string, value: { text: string; checks: number[] }) {
  try { const raw = JSON.stringify(value); if (Platform.OS === 'web') window.localStorage.setItem(KEY(lessonId), raw); else await AsyncStorage.setItem(KEY(lessonId), raw); } catch { /* local only */ }
}

/**
 * B1+ production block: a written answer with a word target and self-check,
 * plus a spoken answer to the same situation. Kept on-device, never graded —
 * but visible as a first-class step, not hidden behind a toggle.
 */
export default function ProductionTask({ source, explicit, examples, onSpeak, foreignStyle, accent = Palette.primary }: {
  source: ProductionSource;
  explicit?: Parameters<typeof productionPrompt>[1];
  examples?: ReadonlyArray<{ text: string; fa: string }>;
  onSpeak: (text: string) => void;
  foreignStyle?: StyleProp<TextStyle>;
  accent?: string;
}) {
  const prompt: ProductionPrompt = useMemo(() => productionPrompt(source, explicit), [source, explicit]);
  const [text, setText] = useState('');
  const [checks, setChecks] = useState<number[]>([]);
  const [showExamples, setShowExamples] = useState(false);
  const [ready, setReady] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { let alive = true; void load(source.id).then(saved => { if (!alive) return; if (saved) { setText(saved.text); setChecks(saved.checks); } setReady(true); }); return () => { alive = false; }; }, [source.id]);
  useEffect(() => {
    if (!ready) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { void save(source.id, { text, checks }); }, 600);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [text, checks, ready, source.id]);

  const words = countWords(text);
  const ratio = Math.min(1, words / prompt.minWords);
  const reached = words >= prompt.minWords;
  const levelLabel = source.levelId >= 5 ? 'C1' : source.levelId === 4 ? 'B2' : 'B1';

  return <View style={styles.root}>
    <View style={styles.header}>
      <View style={[styles.badge, { backgroundColor: accent }]}><PenLine size={16} color="#FFFFFF" /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>تولید آزاد · {levelLabel}</Text>
        <Text style={styles.subtitle}>اینجا خودت می‌سازی، نه انتخاب می‌کنی. نمره ندارد؛ روی همین دستگاه می‌ماند.</Text>
      </View>
    </View>

    <View style={styles.card}>
      <Text style={styles.sectionLabel}>بنویس</Text>
      <Text style={styles.prompt}>{prompt.writing}</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        multiline
        autoCapitalize="sentences"
        autoCorrect={false}
        spellCheck={false}
        placeholder={`دست‌کم ${fa(prompt.minWords)} کلمه…`}
        placeholderTextColor={Palette.muted}
        style={[styles.input, foreignStyle, reached && { borderColor: Palette.success }]}
        accessibilityLabel="پاسخ نوشتاری"
      />
      <View style={styles.meter}>
        <Text style={[styles.meterText, reached && { color: Palette.success }]}>{fa(words)} / {fa(prompt.minWords)} کلمه{reached ? ' ✓' : ''}</Text>
        <View style={styles.track}><View style={[styles.fill, { width: `${Math.round(ratio * 100)}%`, backgroundColor: reached ? Palette.success : accent }]} /></View>
      </View>
      <View style={styles.checklist}>
        {prompt.checklist.map((item, index) => {
          const on = checks.includes(index);
          return <Pressable key={index} accessibilityRole="checkbox" accessibilityState={{ checked: on }} onPress={() => { hapticTap(); setChecks(value => on ? value.filter(n => n !== index) : [...value, index]); }} style={styles.checkRow}>
            <View style={[styles.checkBox, on && { backgroundColor: Palette.success, borderColor: Palette.success }]}>{on ? <Check size={13} color="#FFFFFF" /> : null}</View>
            <Text style={[styles.checkText, on && { color: Palette.ink }]}>{item}</Text>
          </Pressable>;
        })}
      </View>
      {examples?.length ? <>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: showExamples }} onPress={() => setShowExamples(value => !value)} style={styles.examplesToggle}><Text style={styles.examplesToggleText}>{showExamples ? 'پنهان کردن تکیه‌گاه‌ها' : 'گیر کردی؟ دو جملهٔ درس را ببین'}</Text></Pressable>
        {showExamples ? examples.slice(0, 2).map((example, index) => <View key={index} style={styles.example}>
          <Pressable accessibilityRole="button" accessibilityLabel={`شنیدن: ${example.text}`} onPress={() => onSpeak(example.text)} style={styles.exampleSound}><Volume2 size={14} color={accent} /></Pressable>
          <View style={{ flex: 1 }}><Text style={[styles.exampleText, foreignStyle]}>{example.text}</Text><Text keepColor style={styles.exampleFa}>{example.fa}</Text></View>
        </View>) : null}
      </> : null}
    </View>

    <View style={styles.card}>
      <View style={styles.speakHead}><Mic2 size={16} color={Palette.success} /><Text style={styles.sectionLabel}>بگو</Text></View>
      <Text style={styles.prompt}>{prompt.speaking}</Text>
      <Text style={styles.hint}>بلند حرف بزن و اگر شد صدایت را ضبط کن و دوباره گوش بده: کجا مکث کردی؟ کدام کلمه نیامد؟ همان‌ها را با متن بالا پر کن.</Text>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  root: { width: '100%', gap: 12, marginTop: 16 },
  header: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  badge: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: Typography.fontFamily, fontSize: 17, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  subtitle: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: Palette.muted, textAlign: 'right', writingDirection: 'rtl' },
  card: { borderRadius: 16, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surface, padding: 14, gap: 10 },
  sectionLabel: { fontFamily: Typography.fontFamily, fontSize: 13, color: Palette.muted, textAlign: 'right', writingDirection: 'rtl' },
  prompt: { fontFamily: Typography.fontFamily, fontSize: 15, lineHeight: 26, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  input: { minHeight: 120, borderRadius: 14, borderWidth: 1.5, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, lineHeight: 24, color: Palette.ink, textAlign: 'left', writingDirection: 'ltr', textAlignVertical: 'top' },
  meter: { gap: 6 },
  meterText: { fontFamily: Typography.fontFamily, fontSize: 12, color: Palette.muted, textAlign: 'right', writingDirection: 'rtl' },
  track: { height: 6, borderRadius: 3, backgroundColor: Palette.border, overflow: 'hidden', flexDirection: 'row-reverse' },
  fill: { height: '100%', borderRadius: 3 },
  checklist: { gap: 6, marginTop: 4 },
  checkRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, minHeight: 36 },
  checkBox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: Palette.border, alignItems: 'center', justifyContent: 'center' },
  checkText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: 13, lineHeight: 22, color: Palette.muted, textAlign: 'right', writingDirection: 'rtl' },
  examplesToggle: { alignSelf: 'flex-end', paddingVertical: 6 },
  examplesToggleText: { fontFamily: Typography.fontFamily, fontSize: 12, color: Palette.primary },
  example: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderRadius: 12, backgroundColor: Palette.surfaceMuted, padding: 10 },
  exampleSound: { width: 28, height: 28, borderRadius: 14, backgroundColor: Palette.surface, alignItems: 'center', justifyContent: 'center' },
  exampleText: { fontSize: 15, lineHeight: 24, color: Palette.ink, textAlign: 'left', writingDirection: 'ltr' },
  exampleFa: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: Palette.muted, textAlign: 'right', writingDirection: 'rtl' },
  speakHead: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  hint: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 21, color: Palette.muted, textAlign: 'right', writingDirection: 'rtl' },
});
