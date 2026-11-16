import { Redirect } from 'expo-router';
import GermanVocabLab from '@/components/GermanVocabLab';
import { isLanguageEnabled } from '@/lib/features';

/** «آزمایشگاه واژهٔ آلمانی» — the German twin of /learn/ru/vocabulary. */
export default function GermanVocabularyRoute() {
  return isLanguageEnabled('de') ? <GermanVocabLab /> : <Redirect href={'/languages' as never} />;
}
