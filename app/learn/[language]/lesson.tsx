import StarterLesson from '@/components/StarterLesson';
import { NEW_COURSES, isNewLanguage } from '@/lib/languages/newCourses';
import { useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import RussianLesson from '@/components/RussianLesson';
import TurkishLesson from '@/components/TurkishLesson';
import { findRussianLesson, RUSSIAN_LESSONS } from '@/lib/languages/russian';
import { findTurkishLesson, TURKISH_LESSONS } from '@/lib/languages/turkish';

export default function LanguageLessonRoute() {
  const { language, id, fromStart } = useLocalSearchParams<{ language: string; id?: string; fromStart?: string }>();
  if (isNewLanguage(language)) {
    const course = NEW_COURSES[language];
    const lesson = id ? course.lessons.find(item => item.id === id) : course.lessons[0];
    return lesson ? <StarterLesson key={lesson.id} course={course} lesson={lesson} fromStart={fromStart === '1'} /> : <CoursePage title="درس پیدا نشد" back={`${course.home}/library`}>{null}</CoursePage>;
  }
  if (language === 'tr') {
    const trLesson = id ? findTurkishLesson(id) : TURKISH_LESSONS[0];
    return trLesson
      ? <TurkishLesson key={trLesson.id} lesson={trLesson} fromStart={fromStart === '1'} />
      : <CoursePage title="درس ترکی استانبولی پیدا نشد" back="/learn/tr/library">{null}</CoursePage>;
  }
  const lesson = language === 'ru' ? (id ? findRussianLesson(id) : RUSSIAN_LESSONS[0]) : undefined;
  return lesson ? <RussianLesson key={lesson.id} lesson={lesson} fromStart={fromStart === '1'} /> : <CoursePage title="درس پیدا نشد">{null}</CoursePage>;
}
