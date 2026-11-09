import { Redirect, useLocalSearchParams } from 'expo-router';
import { PronunciationCourse } from '@/components/PronunciationCourse';
import { isPronunciationLanguage } from '@/lib/languages/pronunciationCourse';

/**
 * One workshop for every language that ships pronunciation units. Languages
 * without units yet stay closed instead of showing an empty promise.
 */
export default function PronunciationRoute() {
  const { language } = useLocalSearchParams<{ language?: string }>();
  if (!isPronunciationLanguage(language)) return <Redirect href={'/languages' as never} />;
  return <PronunciationCourse key={language} language={language} />;
}
