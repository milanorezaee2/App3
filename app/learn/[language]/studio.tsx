import { Redirect, useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import { RussianLevelStudio, StarterLevelStudio, TurkishLevelStudio } from '@/components/LevelStudioRoutes';
import { NEW_COURSES, isNewLanguage } from '@/lib/languages/newCourses';
import { FEATURES } from '@/lib/features';

export default function LanguageStudioRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  if (language === 'en') return <Redirect href={'/lang/final-assessment' as never} />;
  if (isNewLanguage(language)) return <StarterLevelStudio key={language} course={NEW_COURSES[language]} />;
  if (language === 'ru') return FEATURES.russianCourse ? <RussianLevelStudio /> : <Redirect href={'/languages' as never} />;
  if (language === 'tr') return <TurkishLevelStudio />;
  return <CoursePage title="مسیر تکمیلی پیدا نشد">{null}</CoursePage>;
}
