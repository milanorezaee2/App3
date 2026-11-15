import { LocalizedText as Text } from '@/components/LocalizedText';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { Typography } from '@/lib/theme';
import { toPersianDigits as fa } from '@/lib/format';

/** Height of the compact bar; the lesson auto-scroll stops this far above the content so nothing hides under it. */
export const COMPACT_HEADER_HEIGHT = 46;

/**
 * Collapsing lesson header. Nothing is shown while the full header (brand row, hero card, stepper)
 * is on screen; once it scrolls out — e.g. after «ادامه» jumps to the stage content — this slim
 * bar fades in over the top edge with the back button, lesson title, stage position and a thin
 * progress line. It is rendered outside the scaled scroll area, so it never changes the layout
 * of the stage content.
 */
export default function LessonCompactHeader({ visible, title, stageLabel, stageIndex, stageCount, onBack, accent = Palette.primary }: {
  visible: boolean; title: string; stageLabel: string; stageIndex: number; stageCount: number; onBack: () => void; accent?: string;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(opacity, { toValue: visible ? 1 : 0, duration: 160, useNativeDriver: true }).start(); }, [visible, opacity]);
  return (
    <Animated.View pointerEvents={visible ? 'auto' : 'none'} style={[styles.bar, { opacity, transform: [{ translateY: opacity.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) }] }]}>
      <View style={styles.row}>
        <Pressable accessibilityRole="button" accessibilityLabel="بازگشت" hitSlop={8} style={styles.back} onPress={onBack}><ArrowRight size={18} color="#4F438D" strokeWidth={2.4} /></Pressable>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.stage} numberOfLines={1}>{stageLabel} · {fa(stageIndex + 1)}/{fa(stageCount)}</Text>
      </View>
      <View style={styles.track}><View style={[styles.fill, { width: `${Math.round(((stageIndex + 1) / stageCount) * 100)}%`, backgroundColor: accent }]} /></View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: { position: 'absolute', top: 0, left: 0, right: 0, height: COMPACT_HEADER_HEIGHT, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: Palette.border, zIndex: 20, elevation: 4, shadowColor: '#211A68', shadowOpacity: .06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  row: { flex: 1, flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingHorizontal: 12 },
  back: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.primarySoft },
  title: { flex: 1, fontFamily: Typography.fontFamily, fontSize: 14, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  stage: { fontFamily: Typography.fontFamily, fontSize: 11.5, color: Palette.muted, writingDirection: 'rtl' },
  track: { height: 2, backgroundColor: Palette.border },
  fill: { height: 2 },
});
