import { Redirect, useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import { EnglishPlacement, RussianPlacement, StarterPlacement, TurkishPlacement } from '@/components/LevelStudioRoutes';
import { NEW_COURSES, isNewLanguage } from '@/lib/languages/newCourses';
import { FEATURES } from '@/lib/features';

export default function LanguagePlacementRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  if (language === 'en') return <EnglishPlacement />;
  if (isNewLanguage(language)) return <StarterPlacement key={language} course={NEW_COURSES[language]} />;
  if (language === 'ru') return FEATURES.russianCourse ? <RussianPlacement /> : <Redirect href={'/languages' as never} />;
  if (language === 'tr') return <TurkishPlacement />;
  return <CoursePage title="آزمون تعیین سطح پیدا نشد">{null}</CoursePage>;
}
