import { LocalizedText as Text } from '@/components/LocalizedText';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type TextStyle } from 'react-native';
import { Eye } from 'lucide-react-native';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { Typography } from '@/lib/theme';

/**
 * B1+ sentence cards hide the Persian until tapped: guess first, then check.
 * `resetKey` collapses it again when the sentence changes.
 */
export default function RevealText({ text, style, resetKey, label = 'معنی را حدس بزن، بعد ببین' }: { text: string; style?: StyleProp<TextStyle>; resetKey: string | number; label?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [resetKey]);
  if (open) return <Text keepColor style={style}>{text}</Text>;
  return <Pressable accessibilityRole="button" accessibilityLabel="نمایش معنی" onPress={() => setOpen(true)} style={styles.button}>
    <View style={styles.inner}><Eye size={15} color={Palette.muted} /><Text style={styles.label}>{label}</Text></View>
  </Pressable>;
}

const styles = StyleSheet.create({
  button: { alignSelf: 'stretch', minHeight: 44, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  inner: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  label: { fontFamily: Typography.fontFamily, fontSize: 13, color: Palette.muted },
});
