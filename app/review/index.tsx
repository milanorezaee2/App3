import { CourseReview } from '@/components/course/CourseReview';
import { ENGLISH_COURSE } from '@/lib/languages/courseRegistry';

/** English review page: the shared review flow with the English course behind it. */
export default function ReviewHome() {
  return <CourseReview course={ENGLISH_COURSE} note="لغات، از جمله واژه‌های ۵۰۴، همیشه همراه جمله اصلی مرور می‌شوند." />;
}
