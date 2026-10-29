import { Redirect, useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import { CourseLessonPlayer } from '@/components/course/CourseLessonPlayer';
import { RUSSIAN_COURSE, findFormatLesson } from '@/lib/languages/courseRegistry';
import { FEATURES } from '@/lib/features';

export default function RussianLessonRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  if (!FEATURES.russianCourse) return <Redirect href={'/languages' as never} />;
  const lesson = findFormatLesson(RUSSIAN_COURSE, id);
  if (!lesson) return <CoursePage title="درس روسی پیدا نشد" subtitle="از کتابخانه یک درس معتبر انتخاب کنید." back="/learn/ru">{null}</CoursePage>;
  return <CourseLessonPlayer key={lesson.id} course={RUSSIAN_COURSE} lesson={lesson} />;
}
