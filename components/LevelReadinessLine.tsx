import { LocalizedText as Text } from '@/components/LocalizedText';
import { StyleSheet, View } from 'react-native';
import { READY_THRESHOLD } from '@/lib/content/courseSpec';
import { bandReadinessForLevel, type CourseReadiness } from '@/lib/content/readiness';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';

/**
 * Honest content indicator for a level card: a thin bar and «محتوا: ۵۳٪ آماده». The number comes
 * from the course spec (lessons present ÷ required, frequency-word coverage) and rises automatically
 * as content packs are added. Below READY_THRESHOLD the level is marked «در حال تکمیل».
 */
export default function LevelReadinessLine({ course, levelId, color }: { course: CourseReadiness; levelId: number; color: string }) {
  const band = bandReadinessForLevel(course, levelId);
  if (!band) return null;
  const value = band.readiness;
  return (
    <View style={styles.wrap}>
      <View style={styles.track}><View style={[styles.fill, { width: `${Math.max(2, value)}%`, backgroundColor: color }]} /></View>
      <Text style={styles.label}>محتوا: {fa(value)}٪ آماده{value < READY_THRESHOLD ? ' · در حال تکمیل' : ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, marginTop: 4 },
  track: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB', overflow: 'hidden' },
  fill: { height: 4, borderRadius: 2 },
  label: { fontFamily: Typography.fontFamily, fontSize: 10.5, color: '#6B7280', writingDirection: 'rtl' },
});
