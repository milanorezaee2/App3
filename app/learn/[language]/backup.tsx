import { useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import { CourseBackup } from '@/components/course/CourseBackup';
import { germanProgress } from '@/lib/languages/catalog';
import { GERMAN_COURSE } from '@/lib/languages/courseRegistry';

/**
 * German backup screen. It keeps the German store adapter but renders the same
 * shared backup layout that Russian and English use.
 */
export default function GermanBackupRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  if (language !== 'de') return <CoursePage title="پشتیبان این مسیر پیدا نشد">{null}</CoursePage>;
  return (
    <CourseBackup
      course={GERMAN_COURSE}
      filePrefix="deutsch-journey"
      exportBackup={() => germanProgress.exportProgress()}
      restoreBackup={importText => germanProgress.restoreProgress(importText)}
      scopeNote="فایل شامل پیشرفت درس‌ها و زمان‌بندی کارت‌های مرور آلمانی است."
    />
  );
}
