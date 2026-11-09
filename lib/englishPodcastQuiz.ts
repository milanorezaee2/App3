import { SENTENCE_LESSONS, type CourseSentence } from './courseContent';
import { addSentenceToReview } from './courseProgress';
import { type PodcastEpisode } from './englishPodcast';

/**
 * Phase 3: comprehension questions generated from the episode's own sentences.
 * Wrong answers push the sentence into the existing spaced-repetition review deck.
 */

export type QuizKind = 'meaning' | 'reverse' | 'vocabulary';

export interface QuizQuestion {
  id: string;
  kind: QuizKind;
  sentenceId: string;
  /** Prompt line (English for meaning/vocabulary, Persian for reverse). */
  prompt: string;
  /** English line to speak for the prompt when applicable. */
  speak?: string;
  options: string[];
  answerIndex: number;
  hintFa: string;
}

export const QUIZ_SIZE = 5;

// Deterministic PRNG so the same episode always yields the same quiz.
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => {
    h += 0x6D2B79F5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], random: () => number) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickDistractors(pool: string[], correct: string, count: number, random: () => number) {
  const unique = Array.from(new Set(pool.filter(item => item && item !== correct)));
  return shuffle(unique, random).slice(0, count);
}

function withOptions(correct: string, distractors: string[], random: () => number) {
  const options = shuffle([correct, ...distractors], random);
  return { options, answerIndex: options.indexOf(correct) };
}

export function buildEpisodeQuiz(episode: PodcastEpisode): QuizQuestion[] {
  const lesson = SENTENCE_LESSONS.find(item => item.id === episode.lessonId);
  if (!lesson || lesson.sentences.length < 2) return [];
  const random = seeded(`podcast-quiz:${episode.id}`);
  const levelSentences: CourseSentence[] = SENTENCE_LESSONS.filter(item => item.levelId === lesson.levelId).flatMap(item => item.sentences);
  const faPool = levelSentences.map(sentence => sentence.fa);
  const enPool = levelSentences.map(sentence => sentence.en);
  const vocabPool = levelSentences.flatMap(sentence => sentence.vocabulary.map(item => item.meaning));

  const chosen = shuffle(lesson.sentences, random).slice(0, QUIZ_SIZE);
  const questions: QuizQuestion[] = [];
  chosen.forEach((sentence, index) => {
    const kind: QuizKind = index % 3 === 0 ? 'meaning' : index % 3 === 1 ? 'reverse' : (sentence.vocabulary.length ? 'vocabulary' : 'meaning');
    if (kind === 'meaning') {
      const distractors = pickDistractors(faPool, sentence.fa, 3, random);
      if (distractors.length < 2) return;
      questions.push({ id: `${episode.id}-q${index}`, kind, sentenceId: sentence.id, prompt: sentence.en, speak: sentence.en, hintFa: 'معنی این جمله چیست؟', ...withOptions(sentence.fa, distractors, random) });
    } else if (kind === 'reverse') {
      const distractors = pickDistractors(enPool, sentence.en, 3, random);
      if (distractors.length < 2) return;
      questions.push({ id: `${episode.id}-q${index}`, kind, sentenceId: sentence.id, prompt: sentence.fa, hintFa: 'کدام جملهٔ انگلیسی را در این اپیزود شنیدید؟', ...withOptions(sentence.en, distractors, random) });
    } else {
      const word = sentence.vocabulary[Math.floor(random() * sentence.vocabulary.length)];
      const distractors = pickDistractors(vocabPool, word.meaning, 3, random);
      if (distractors.length < 2) return;
      questions.push({ id: `${episode.id}-q${index}`, kind, sentenceId: sentence.id, prompt: word.word, speak: word.word, hintFa: `معنی «${word.word}» در جملهٔ «${sentence.en}» چیست؟`, ...withOptions(word.meaning, distractors, random) });
    }
  });
  return questions;
}

/** Called once per answered question; misses go to the review deck. */
export async function recordQuizAnswer(episode: PodcastEpisode, question: QuizQuestion, correct: boolean) {
  if (correct) return;
  try { await addSentenceToReview(question.sentenceId, episode.lessonId); } catch { /* review deck is best-effort */ }
}
