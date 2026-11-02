import { useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import RussianLibrary from '@/components/RussianLibrary';
import TurkishLibrary from '@/components/TurkishLibrary';

export default function LanguageLibraryRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  if (language === 'ru') return <RussianLibrary />;
  if (language === 'tr') return <TurkishLibrary />;
  return <CoursePage title="این مسیر آموزشی پیدا نشد">{null}</CoursePage>;
}
