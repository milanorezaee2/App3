import type { LanguageId } from './registry';

export type { LanguageId };
export interface LearningSentence {
  id: string;
  text: string;
  fa: string;
  pronunciation: string;
  pattern?: string;
  vocabulary: Array<{ word: string; meaning: string }>;
}
export interface LearningLesson {
  id: string;
  title: string;
  situation: string;
  durationMinutes: number;
  teachingFa?: string;
  checks?: Array<{ promptFa: string; choices: string[]; correctIndex: number; explanationFa: string }>;
  sentences: LearningSentence[];
  dialogue: Array<{ speaker: string; text: string; fa: string }>;
}
export interface LanguageDefinition {
  id: LanguageId;
  name: string;
  nativeName: string;
  speechLocale: string;
  accent: string;
  lessonsCount: number;
  description: string;
  status: 'available' | 'starter' | 'planned';
  home: string;
  /** Shows the "starts from zero" badge on the language card. */
  startsFromZero?: boolean;
}
