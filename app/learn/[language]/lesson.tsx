import { useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import RussianLesson from '@/components/RussianLesson';
import TurkishLesson from '@/components/TurkishLesson';
import { findRussianLesson } from '@/lib/languages/russian';
import { findTurkishLesson } from '@/lib/languages/turkish';

export default function LanguageLessonRoute() {
  const { language, id, fromStart } = useLocalSearchParams<{ language: string; id?: string; fromStart?: string }>();
  if (language === 'tr') {
    const turkishLesson = findTurkishLesson(id);
    return turkishLesson ? <TurkishLesson key={turkishLesson.id} lesson={turkishLesson} fromStart={fromStart === '1'} /> : <CoursePage title="درس پیدا نشد">{null}</CoursePage>;
  }
  const lesson = language === 'ru' ? findRussianLesson(id) : undefined;
  return lesson ? <RussianLesson key={lesson.id} lesson={lesson} fromStart={fromStart === '1'} /> : <CoursePage title="درس پیدا نشد">{null}</CoursePage>;
}
