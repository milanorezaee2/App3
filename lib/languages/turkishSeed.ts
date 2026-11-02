import type { LearningLesson, LearningSentence } from './types';

export type TurkishSentenceRow = readonly [
  text: string,
  fa: string,
  pronunciation: string,
  word: string,
  meaning: string,
  pattern?: string,
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

export interface TurkishLessonSeed {
  id: string;
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
  sentencePrefix: 'tr1' | 'tr2' | 'tr3' | 'tr4' | 'tr5' | 'tr6',
  startSentenceNumber = 1,
): Array<LearningLesson & { subtitle: string }> {
  let counter = startSentenceNumber;
  return seeds.map(seed => {
    const sentences: LearningSentence[] = seed.rows.map(([text, fa, pronunciation, word, meaning, pattern]) => {
      const id = `${sentencePrefix}-${String(counter).padStart(3, '0')}`;
      counter += 1;
      return {
        id,
        text,
        fa,
        pronunciation,
        ...(pattern ? { pattern } : {}),
        vocabulary: [{ word, meaning }],
      };
    });
    return {
      id: seed.id,
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
