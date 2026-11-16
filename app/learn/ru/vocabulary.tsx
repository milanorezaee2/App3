import { Redirect } from 'expo-router';
import { FEATURES } from '@/lib/features';
import RussianVocabLab from '@/components/RussianVocabLab';

export default function RussianVocabularyRoute() {
  return FEATURES.russianCourse ? <RussianVocabLab /> : <Redirect href={'/languages' as never} />;
}
