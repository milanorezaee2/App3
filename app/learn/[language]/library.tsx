import StarterLibrary from '@/components/StarterLibrary';
import { NEW_COURSES, isNewLanguage } from '@/lib/languages/newCourses';
import { useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import RussianLibrary from '@/components/RussianLibrary';
import TurkishLibrary from '@/components/TurkishLibrary';

export default function LanguageLibraryRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  if (isNewLanguage(language)) return <StarterLibrary key={language} course={NEW_COURSES[language]} />;
  if (language === 'ru') return <RussianLibrary />;
  if (language === 'tr') return <TurkishLibrary />;
  return <CoursePage title="این مسیر آموزشی پیدا نشد">{null}</CoursePage>;
}
