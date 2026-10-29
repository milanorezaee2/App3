import { StyleSheet, Text, View } from 'react-native';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { CourseLibrary } from '@/components/course/CourseLibrary';
import { ENGLISH_COURSE } from '@/lib/languages/courseRegistry';
import { lessonLevelRows } from '@/lib/languages/courseFormat';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';

/**
 * English library: the same shared library layout as German and Russian, with a
 * short English-only summary of unique vocabulary per level.
 */
export default function EnglishLibraryScreen() {
  const rows = lessonLevelRows(ENGLISH_COURSE, []);
  return (
    <CourseLibrary
      course={ENGLISH_COURSE}
      bottomNote={<View style={styles.card}>
        <Text style={styles.heading}>واژگان هر سطح</Text>
        {rows.map(({ level, sentenceCount, vocabularyCount }) => {
          const stats = { sentenceCount, vocabularyCount };
          return <View key={level.id} style={styles.row}>
            <View style={[styles.dot, { backgroundColor: level.color }]} />
            <Text style={styles.level}>{level.title}</Text>
            <Text style={styles.meta}>{fa(stats.sentenceCount)} جمله</Text>
            <Text style={styles.meta}>{fa(stats.vocabularyCount)} واژهٔ یکتا</Text>
          </View>;
        })}
        <Text style={styles.note}>این شمارش از جمله‌های همین دوره محاسبه می‌شود و با پیشرفت شما تغییر نمی‌کند.</Text>
      </View>}
    />
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, padding: 15, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: 8 },
  heading: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 14, textAlign: 'right', writingDirection: 'rtl' },
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  level: { flex: 1, fontFamily: 'Inter-ExtraBold', color: Palette.ink, fontSize: 10, fontWeight: '800', textAlign: 'right', writingDirection: 'ltr' },
  meta: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, writingDirection: 'rtl' },
  note: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, lineHeight: 17, textAlign: 'right', writingDirection: 'rtl' },
});
