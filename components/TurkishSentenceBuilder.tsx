import type { LearningSentence } from '@/lib/languages/types';
import LanguageSentenceBuilder from '@/components/LanguageSentenceBuilder';

/** Turkish word-order practice. Layout is shared; only the hint differs. */
export default function TurkishSentenceBuilder({ sentence }: { sentence: LearningSentence }) {
  return <LanguageSentenceBuilder sentence={sentence} placeholder="واژه‌ها را به ترتیب جملهٔ ترکی استانبولی انتخاب کنید." />;
}
