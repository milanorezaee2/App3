import { useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import RussianLesson from '@/components/RussianLesson';
import { findRussianLesson } from '@/lib/languages/russian';

export default function LanguageLessonRoute() {
  const { language, id } = useLocalSearchParams<{ language: string; id?: string }>();
  const lesson = language === 'ru' ? findRussianLesson(id) : undefined;
  return lesson ? <RussianLesson key={lesson.id} lesson={lesson} /> : <CoursePage title="درس پیدا نشد">{null}</CoursePage>;
}
