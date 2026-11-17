import { CoursePage } from '@/components/LanguageCourseUI';
import { isNewLanguage } from '@/lib/languages/newCourses';
import { useLocalSearchParams } from 'expo-router';
import WordLab from '@/components/WordLab';

/** «واژه‌ها» for the newer courses. German has the word lab; French/Spanish keep their lesson flow. */
export default function LanguageVocabularyRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  if (language === 'de') return <WordLab language="de" />;
  if (isNewLanguage(language)) {
    return <CoursePage title="واژه‌ها هنوز برای این زبان باز نشده" back={`/learn/${language}`}>{null}</CoursePage>;
  }
  return <CoursePage title="این مسیر آموزشی پیدا نشد">{null}</CoursePage>;
}
