import { useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import RussianLesson from '@/components/RussianLesson';
import { findRussianLesson } from '@/lib/languages/russian';

export default function LanguageLessonRoute() {
  const { language, id, fromStart } = useLocalSearchParams<{ language: string; id?: string; fromStart?: string }>();
  const lesson = language === 'ru' ? findRussianLesson(id) : undefined;
  return lesson ? <RussianLesson key={lesson.id} lesson={lesson} fromStart={fromStart === '1'} /> : <CoursePage title="درس پیدا نشد">{null}</CoursePage>;
}
