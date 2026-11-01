import { Redirect, useLocalSearchParams } from 'expo-router';
import TurkishLesson from '@/components/TurkishLesson';
import { CoursePage } from '@/components/LanguageCourseUI';
import { findTurkishLesson } from '@/lib/languages/turkish';
import { FEATURES } from '@/lib/features';

export default function TurkishLessonRoute() {
  const { id, fromStart } = useLocalSearchParams<{ id?: string; fromStart?: string }>();
  if (!FEATURES.turkishCourse) return <Redirect href={'/languages' as never} />;
  const lesson = findTurkishLesson(id);
  if (!lesson) return <CoursePage title="درس ترکی پیدا نشد" subtitle="از کتابخانه یک درس معتبر انتخاب کنید." back="/learn/tr">{null}</CoursePage>;
  return <TurkishLesson key={lesson.id} lesson={lesson} fromStart={fromStart === '1'} />;
}
