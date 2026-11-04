import { useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import RussianLesson from '@/components/RussianLesson';
import TurkishLesson from '@/components/TurkishLesson';
import { findRussianLesson, RUSSIAN_LESSONS } from '@/lib/languages/russian';
import { findTurkishLesson, TURKISH_LESSONS } from '@/lib/languages/turkish';

export default function LanguageLessonRoute() {
  const { language, id, fromStart, restarted } = useLocalSearchParams<{ language: string; id?: string; fromStart?: string; restarted?: string }>();
  if (language === 'tr') {
    const trLesson = id ? findTurkishLesson(id) : TURKISH_LESSONS[0];
    return trLesson
      ? <TurkishLesson key={trLesson.id} lesson={trLesson} fromStart={fromStart === '1'} restarted={restarted === '1'} />
      : <CoursePage title="درس ترکی استانبولی پیدا نشد" back="/learn/tr/library">{null}</CoursePage>;
  }
  const lesson = language === 'ru' ? (id ? findRussianLesson(id) : RUSSIAN_LESSONS[0]) : undefined;
  return lesson ? <RussianLesson key={lesson.id} lesson={lesson} fromStart={fromStart === '1'} restarted={restarted === '1'} /> : <CoursePage title="درس پیدا نشد">{null}</CoursePage>;
}
