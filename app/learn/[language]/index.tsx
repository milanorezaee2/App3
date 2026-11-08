import StarterHome from '@/components/StarterHome';
import { NEW_COURSES, isNewLanguage } from '@/lib/languages/newCourses';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import RussianHome from '@/components/RussianHome';
import TurkishHome from '@/components/TurkishHome';
import { FEATURES } from '@/lib/features';

export default function LearningHomeRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  if (language === 'en') return <Redirect href={'/lang' as never} />;
  if (language === 'ru' && !FEATURES.russianCourse) return <Redirect href={'/languages' as never} />;
  if (isNewLanguage(language)) return <StarterHome key={language} course={NEW_COURSES[language]} />;
  if (language === 'ru') return <RussianHome />;
  if (language === 'tr') return <TurkishHome />;
  return <CoursePage title="این مسیر آموزشی پیدا نشد">{null}</CoursePage>;
}
