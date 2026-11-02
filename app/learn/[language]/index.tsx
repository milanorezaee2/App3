import { Redirect, useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import RussianHome from '@/components/RussianHome';
import TurkishHome from '@/components/TurkishHome';
import { isLanguageEnabled } from '@/lib/features';

export default function LearningHomeRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  if (!isLanguageEnabled(language)) return <Redirect href={'/languages' as never} />;
  if (language === 'en') return <Redirect href={'/lang' as never} />;
  if (language === 'ru') return <RussianHome />;
  if (language === 'tr') return <TurkishHome />;
  return <CoursePage title="این مسیر آموزشی پیدا نشد">{null}</CoursePage>;
}
