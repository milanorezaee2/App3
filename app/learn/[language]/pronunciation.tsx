import StarterPronunciation from '@/components/StarterPronunciation';
import { NEW_COURSES, isNewLanguage } from '@/lib/languages/newCourses';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { PronunciationCourse } from '@/components/PronunciationCourse';
import { isPronunciationLanguage } from '@/lib/languages/pronunciationCourse';

export default function PronunciationRoute() {
  const { language } = useLocalSearchParams<{ language?: string }>();
  if (isNewLanguage(language)) return <StarterPronunciation key={language} course={NEW_COURSES[language]} />;
  if (!isPronunciationLanguage(language)) return <Redirect href={'/languages' as never} />;
  return <PronunciationCourse language={language} />;
}
