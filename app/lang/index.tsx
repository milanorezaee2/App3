import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { EnglishProgressTrack } from '@/components/EnglishUI';
import { CourseHome } from '@/components/course/CourseHome';
import { GuidedModuleCard } from '@/components/course/GuidedModuleCard';
import type { CourseProgress } from '@/lib/courseProgress';
import { ENGLISH_COURSE } from '@/lib/languages/courseRegistry';
import { lessonLevelRows } from '@/lib/languages/courseFormat';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';

/**
 * English home. It is the same CourseHome shell as German and Russian, with the
 * English four-skill panel that shows per-level vocabulary evidence.
 */
export default function EnglishHomeScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [dueCount, setDueCount] = useState(0);

  useFocusEffect(useCallback(() => {
    let alive = true;
    void Promise.all([ENGLISH_COURSE.progress.get(), ENGLISH_COURSE.progress.due()])
      .then(([next, cards]) => { if (alive) { setProgress(next); setDueCount(cards.length); } })
      .catch(() => undefined);
    return () => { alive = false; };
  }, []));

  const rows = lessonLevelRows(ENGLISH_COURSE, progress?.completedLessonIds ?? []);
  const completed = progress?.completedLessonIds.length ?? 0;
  const total = ENGLISH_COURSE.lessons.length;

  return (
    <CourseHome
      course={ENGLISH_COURSE}
      hideToday
      extras={<View style={styles.stack}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>TODAY AT A GLANCE</Text>
            <Text style={styles.sectionTitle}>برنامهٔ امروز</Text>
          </View>
          <View style={styles.todayPill}><Text style={styles.todayPillText}>{fa(dueCount)} جمله آماده مرور</Text></View>
        </View>

        <View style={styles.todayCard}>
          <View style={styles.todayTop}>
            <Text style={styles.todayValue}>{fa(completed)} از {fa(total)}</Text>
            <Text style={styles.todayHint}>درس تکمیل‌شده؛ تکمیل یک فعالیت به‌تنهایی به معنی تسلط نیست.</Text>
          </View>
          <EnglishProgressTrack value={total ? (completed / total) * 100 : 0} color={Palette.primary} trackColor={Palette.border} height={9} />
          <View style={styles.levelRows}>
            {rows.map(({ level, completed: levelDone, lessons, vocabularyCount }) => {
              const metrics = { vocabularyCount, lessonCount: lessons.length };
              return (
                <View key={level.id} style={styles.levelRow}>
                  <View style={[styles.levelDot, { backgroundColor: level.color }]} />
                  <Text style={styles.levelName}>{level.title}</Text>
                  <Text style={styles.levelMeta}>{fa(levelDone)} از {fa(metrics.lessonCount)} درس</Text>
                  <Text style={styles.levelVocab}>{fa(metrics.vocabularyCount)} واژهٔ یکتا</Text>
                </View>
              );
            })}
          </View>
        </View>

        <GuidedModuleCard
          eyebrow="FOUR SKILLS · ENGLISH"
          title="خواندن و نوشتن با تکالیف چهارمهارتی"
          description="تمرین نوشتاری، شنیداری و گفتاری همین دوره، همراه با تمرین کوتاه و سنجش پایانی؛ همه محلی و بدون هزینه."
          actionLabel="بازکردن تکالیف تکمیلی"
          onPress={() => router.push('/lang/supplement' as never)}
        />
        <GuidedModuleCard
          eyebrow="PRONUNCIATION · WORKSHOP"
          title="کارگاه تلفظ انگلیسی"
          description="واکه‌های کوتاه و بلند، th، r و l، پایان‌های s و ed و آهنگ جمله با نمونهٔ شنیداری."
          actionLabel="بازکردن کارگاه تلفظ"
          onPress={() => router.push('/learn/en/pronunciation' as never)}
        />
        <GuidedModuleCard
          eyebrow="BACKUP · LOCAL"
          title="پشتیبان پیشرفت انگلیسی"
          description="خروجی و بازیابی محلی پیشرفت همین دستگاه؛ ادغام بدون پاک‌کردن سابقه."
          actionLabel="رفتن به پشتیبان"
          onPress={() => router.push('/lang/backup' as never)}
        />

      </View>}
    />
  );
}

const styles = StyleSheet.create({
  stack: { gap: 11 },
  sectionHeader: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 2 },
  sectionEyebrow: { fontFamily: 'Inter-ExtraBold', color: Palette.primary, fontSize: 6, fontWeight: '800', letterSpacing: 1.3, textAlign: 'right', writingDirection: 'ltr' },
  sectionTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 19, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  todayPill: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 999, backgroundColor: Palette.warningSoft },
  todayPillText: { fontFamily: Typography.fontFamily, color: Palette.warning, fontSize: 9, writingDirection: 'rtl' },
  todayCard: { borderRadius: 20, padding: 16, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: 12 },
  todayTop: { gap: 2 },
  todayValue: { fontFamily: Typography.numberFontFamily, color: Palette.ink, fontSize: 22, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  todayHint: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  levelRows: { gap: 7, paddingTop: 10, borderTopWidth: 1, borderTopColor: Palette.border },
  levelRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7 },
  levelDot: { width: 6, height: 6, borderRadius: 3 },
  levelName: { flex: 1, fontFamily: 'Inter-ExtraBold', color: Palette.ink, fontSize: 10, fontWeight: '800', textAlign: 'right', writingDirection: 'ltr' },
  levelMeta: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, writingDirection: 'rtl' },
  levelVocab: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 9, writingDirection: 'rtl' },
});
