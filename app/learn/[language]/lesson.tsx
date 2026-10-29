import { useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import { CourseLessonPlayer } from '@/components/course/CourseLessonPlayer';
import { courseById, findFormatLesson } from '@/lib/languages/courseRegistry';
import { FEATURES } from '@/lib/features';

/**
 * Russian lessons run through the same nine-stage player that English uses, so
 * the learning flow is identical in the courses that ship with the app.
 */
export default function LanguageLessonRoute() {
  const { language, id } = useLocalSearchParams<{ language: string; id: string }>();
  const course = language === 'ru' ? courseById(language) : undefined;
  const lesson = course ? findFormatLesson(course, id) : undefined;
  if (language === 'ru' && !FEATURES.russianCourse) {
    return <CoursePage title="این مسیر آموزشی پیدا نشد" back="/languages">{null}</CoursePage>;
  }
  if (!course || !lesson) {
    return <CoursePage title="درس پیدا نشد" subtitle="از کتابخانه یک درس معتبر انتخاب کنید." back="/languages">{null}</CoursePage>;
  }
  return (
    <CourseLessonPlayer
      key={`${course.id}-${lesson.id}`}
      course={course}
      lesson={lesson}
      resumeLabel="جلسهٔ ذخیره‌شده بازیابی شد"
    />
  );
}
