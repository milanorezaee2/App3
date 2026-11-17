import { Redirect } from 'expo-router';
import { FEATURES } from '@/lib/features';
import WordLab from '@/components/WordLab';

export default function RussianVocabularyRoute() {
  return FEATURES.russianCourse ? <WordLab language="ru" /> : <Redirect href={'/languages' as never} />;
}
