import { CourseBackup } from '@/components/course/CourseBackup';
import { RUSSIAN_COURSE } from '@/lib/languages/courseRegistry';
import { russianProgress } from '@/lib/languages/russian';

/** Russian backup screen: same layout as the English course, Russian store behind it. */
export default function RussianBackupRoute() {
  return (
    <CourseBackup
      course={RUSSIAN_COURSE}
      filePrefix="russkiy-journey"
      exportBackup={() => russianProgress.exportProgress()}
      restoreBackup={importText => russianProgress.restoreProgress(importText)}
      scopeNote="فایل شامل پیشرفت درس‌ها و زمان‌بندی کارت‌های مرور روسی است."
    />
  );
}
