import type { CourseSentence } from '@/lib/courseContent';
import { SentenceBuilder } from '@/components/course/SentenceBuilder';

/**
 * English keeps its own typed entry point, but the interaction itself is the
 * shared sentence builder so all languages present the same exercise.
 */
export function EnglishSentenceBuilder({ sentence }: { sentence: CourseSentence }) {
  return <SentenceBuilder seed={sentence.id} text={sentence.en} fa={sentence.fa} />;
}
