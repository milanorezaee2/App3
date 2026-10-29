import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CourseHome } from '@/components/course/CourseHome';
import { GuidedModuleCard } from '@/components/course/GuidedModuleCard';
import { ENGLISH_COURSE } from '@/lib/languages/courseRegistry';

/**
 * English home.
 *
 * The shell, the section order, the sentence hero, the level rail, the "today"
 * panel with per-level rows and the practice tools all come from the shared
 * CourseHome. Only the guided modules below it belong to this course.
 */
export default function EnglishHomeScreen() {
  const router = useRouter();

  return (
    <CourseHome
      course={ENGLISH_COURSE}
      extras={<View style={styles.stack}>
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
});
