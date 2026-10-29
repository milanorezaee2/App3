import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CourseHome } from '@/components/course/CourseHome';
import { GuidedModuleCard } from '@/components/course/GuidedModuleCard';
import { RUSSIAN_COURSE } from '@/lib/languages/courseRegistry';

/**
 * Russian home. Same layout, same slots and same actions as the English course;
 * only the Russian course content and routes are different.
 */
export default function RussianHome() {
  const router = useRouter();
  return (
    <CourseHome
      course={RUSSIAN_COURSE}
      extras={<View style={styles.extras}>
        <GuidedModuleCard
          eyebrow="ПОВТОРЕНИЕ · REVIEW"
          title="مرور جمله‌محور روسی"
          description="جمله‌هایی که موعد مرورشان رسیده است، با پاسخ، تلفظ و زمان‌بندی تازه."
          actionLabel="بازکردن مرور روسی"
          onPress={() => router.push('/learn/ru/review' as never)}
        />
        <GuidedModuleCard
          eyebrow="ПРОИЗНОШЕНИЕ · PRONUNCIATION"
          title="کارگاه تلفظ روسی"
          description="واکه‌های بی‌تکیه، همخوان نرم و سخت و تکیهٔ واژگانی با نمونهٔ شنیداری و خودارزیابی محلی."
          actionLabel="بازکردن کارگاه تلفظ"
          onPress={() => router.push('/learn/ru/pronunciation' as never)}
        />
        <GuidedModuleCard
          eyebrow="BACKUP · LOCAL"
          title="پشتیبان پیشرفت روسی"
          description="خروجی و بازیابی محلی پیشرفت همین دستگاه؛ ادغام بدون پاک‌کردن سابقه."
          actionLabel="رفتن به پشتیبان"
          onPress={() => router.push('/learn/ru/backup' as never)}
        />
      </View>}
    />
  );
}

const styles = StyleSheet.create({
  extras: { gap: 10 },
});
