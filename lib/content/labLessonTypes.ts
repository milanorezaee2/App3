/** Shape of the generated, bundled «vocabulary review» lessons. */
export interface LabVocabulary { word: string; meaning: string }
export interface LabSentence {
  text: string;
  fa: string;
  /** The gap words of this sentence, used as a read-aloud hint instead of a transliteration. */
  pronunciation: string;
  pattern?: string;
  vocabulary: LabVocabulary[];
}
export interface LabCheck {
  promptFa: string;
  choices: string[];
  correctIndex: number;
  explanationFa: string;
}
export interface LabLesson {
  id: string;
  levelId: 0 | 1 | 2 | 3 | 4 | 5;
  band: string;
  title: string;
  subtitle: string;
  situation: string;
  teachingFa: string;
  durationMinutes: number;
  sentences: LabSentence[];
  dialogue: Array<{ speaker: string; text: string; fa: string }>;
  checks: LabCheck[];
}

export type LabLanguage = 'en' | 'de' | 'fr' | 'es' | 'tr' | 'ru';
