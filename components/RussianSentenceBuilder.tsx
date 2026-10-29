import type { LearningSentence } from '@/lib/languages/types';
import { SentenceBuilder } from '@/components/course/SentenceBuilder';

/** Russian shares the common sentence builder so the exercise matches English and German. */
export default function RussianSentenceBuilder({ sentence }: { sentence: LearningSentence }) {
  return <SentenceBuilder seed={sentence.id} text={sentence.text} fa={sentence.fa} />;
}
