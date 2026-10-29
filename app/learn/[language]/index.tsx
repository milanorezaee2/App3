import { Redirect, useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import RussianHome from '@/components/RussianHome';
import { FEATURES } from '@/lib/features';

/** Only the Russian course lives under `/learn`; English has its own `/lang` home. */
export default function LearningHomeRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  if (language === 'en') return <Redirect href={'/lang' as never} />;
  if (language === 'ru' && !FEATURES.russianCourse) return <Redirect href={'/languages' as never} />;
  if (language === 'ru') return <RussianHome />;
  return <Redirect href={'/languages' as never} />;
}
