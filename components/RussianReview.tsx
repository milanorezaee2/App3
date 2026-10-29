import { CourseReview } from '@/components/course/CourseReview';
import { RUSSIAN_COURSE } from '@/lib/languages/courseRegistry';

/** Russian review page: the shared review flow with the Russian course behind it. */
export default function RussianReview() {
  return <CourseReview course={RUSSIAN_COURSE} note="مرور روسی جدا از پیشرفت انگلیسی و آلمانی، فقط در حافظهٔ همین دستگاه ذخیره می‌شود." />;
}
