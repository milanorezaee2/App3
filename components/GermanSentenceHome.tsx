import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CourseHome } from '@/components/course/CourseHome';
import { GuidedModuleCard } from '@/components/course/GuidedModuleCard';
import { GERMAN_COURSE } from '@/lib/languages/courseRegistry';

/**
 * German home. It uses the shared home layout and adds the German-specific
 * guided module that ships with the published A1 reading, listening and
 * writing unit, plus the direct link to this course's backup screen.
 */
export default function GermanSentenceHome() {
  const router = useRouter();
  return (
    <CourseHome
      course={GERMAN_COURSE}
      extras={<View style={styles.extras}>
        <GuidedModuleCard
          eyebrow="GEFÜHRTES MODUL · A1"
          title="خواندن و پیام‌نویسی"
          description="واحد مهارتی منتشرشدهٔ A1: شنیدن، خواندن و نوشتن در یک مسیر کوتاه و بدون نمره."
          actionLabel="بازکردن واحد مهارتی A1"
          onPress={() => router.push('/learn/de/unit?unit=de-a1-skills' as never)}
        />
        <GuidedModuleCard
          eyebrow="AUSSPRACHE · PRONUNCIATION"
          title="کارگاه تلفظ آلمانی"
          description="واکه‌های کوتاه و بلند، Umlaut، ch و آهنگ جمله با نمونهٔ شنیداری و خودارزیابی محلی."
          actionLabel="بازکردن کارگاه تلفظ"
          onPress={() => router.push('/learn/de/pronunciation' as never)}
        />
        <GuidedModuleCard
          eyebrow="BACKUP · LOCAL"
          title="پشتیبان پیشرفت آلمانی"
          description="خروجی و بازیابی محلی پیشرفت همین دستگاه؛ ادغام بدون پاک‌کردن سابقه."
          actionLabel="رفتن به پشتیبان"
          onPress={() => router.push('/learn/de/backup' as never)}
        />
      </View>}
    />
  );
}

const styles = StyleSheet.create({
  extras: { gap: 10 },
});
