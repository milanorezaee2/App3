import type { LearningLesson, LearningSentence } from './types';

export type TurkishSentenceRow = readonly [
  text: string,
  fa: string,
  pronunciation: string,
  word: string,
  meaning: string,
  pattern?: string,
  additionalVocabulary?: readonly (readonly [word: string, meaning: string])[],
];

export type TurkishDialogueTurn = readonly [
  speaker: string,
  text: string,
  fa: string,
];

export interface TurkishCheckSeed {
  promptFa: string;
  choices: [string, string, string];
  correctIndex: 0 | 1 | 2;
  explanationFa: string;
}

export type TurkishLearningMode = 'words' | 'chunks' | 'sentences';

export interface TurkishLessonSeed {
  id: string;
  learningMode?: TurkishLearningMode;
  title: string;
  subtitle: string;
  situation: string;
  teachingFa: string;
  rows: readonly [
    TurkishSentenceRow,
    TurkishSentenceRow,
    TurkishSentenceRow,
    TurkishSentenceRow,
    TurkishSentenceRow,
    TurkishSentenceRow,
    TurkishSentenceRow,
    TurkishSentenceRow,
  ];
  dialogue: readonly TurkishDialogueTurn[];
  checks: readonly [TurkishCheckSeed, TurkishCheckSeed];
}

export function buildTurkishLessons(
  seeds: readonly TurkishLessonSeed[],
  sentencePrefix: 'tr0' | 'tr1' | 'tr2' | 'tr3' | 'tr4' | 'tr5' | 'tr6',
  startSentenceNumber = 1,
  stableSentenceStarts: Readonly<Record<string, number>> = {},
): Array<LearningLesson & { subtitle: string; learningMode: TurkishLearningMode }> {
  let counter = startSentenceNumber;
  return seeds.map(seed => {
    const stableStart = stableSentenceStarts[seed.id];
    const sentences: LearningSentence[] = seed.rows.map(([text, fa, pronunciation, word, meaning, pattern, additionalVocabulary = []], rowIndex) => {
      const sentenceNumber = stableStart === undefined ? counter++ : stableStart + rowIndex;
      const id = `${sentencePrefix}-${String(sentenceNumber).padStart(3, '0')}`;
      const vocabulary = new Map<string, string>([[word, meaning], ...additionalVocabulary]);
      return {
        id,
        text,
        fa,
        pronunciation,
        ...(pattern ? { pattern } : {}),
        vocabulary: [...vocabulary].map(([vocabularyWord, vocabularyMeaning]) => ({ word: vocabularyWord, meaning: vocabularyMeaning })),
      };
    });
    return {
      id: seed.id,
      learningMode: seed.learningMode ?? 'sentences',
      title: seed.title,
      subtitle: seed.subtitle,
      situation: seed.situation,
      durationMinutes: 8,
      teachingFa: seed.teachingFa,
      sentences,
      dialogue: seed.dialogue.map(([speaker, text, fa]) => ({ speaker, text, fa })),
      checks: seed.checks.map(check => ({
        promptFa: check.promptFa,
        choices: [...check.choices],
        correctIndex: check.correctIndex,
        explanationFa: check.explanationFa,
      })),
    };
  });
}
