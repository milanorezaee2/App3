import type { LearningSentence } from '@/lib/languages/types';
import LanguageSentenceBuilder from '@/components/LanguageSentenceBuilder';

/** Russian word-order practice. Layout is shared; only the hint differs. */
export default function RussianSentenceBuilder({ sentence }: { sentence: LearningSentence }) {
  return <LanguageSentenceBuilder sentence={sentence} placeholder="واژه‌ها را به ترتیب جمله انتخاب کنید." />;
}
