import type { LearningSentence } from '@/lib/languages/types';
import { SentenceBuilder } from '@/components/course/SentenceBuilder';

/** German shares the common sentence builder so the exercise matches English and Russian. */
export function GermanSentenceBuilder({ sentence }: { sentence: LearningSentence }) {
  return <SentenceBuilder seed={sentence.id} text={sentence.text} fa={sentence.fa} />;
}
