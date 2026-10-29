import { CourseBackup } from '@/components/course/CourseBackup';
import { ENGLISH_COURSE } from '@/lib/languages/courseRegistry';
import { exportEnglishBackup, restoreEnglishBackup } from '@/lib/englishBackup';

/**
 * English backup screen.
 *
 * Renders the shared local-backup layout — the same anatomy as German and
 * Russian — with the English stores (lessons, study state, supplement) behind
 * export and merge-only restore.
 */
export default function EnglishBackupScreen() {
  return (
    <CourseBackup
      course={ENGLISH_COURSE}
      filePrefix="english-journey"
      exportBackup={exportEnglishBackup}
      restoreBackup={restoreEnglishBackup}
      scopeNote="نسخهٔ JSON یک‌جا شامل پیشرفت درس‌ها، جلسه‌ها و شواهد مطالعهٔ انگلیسی است."
    />
  );
}
