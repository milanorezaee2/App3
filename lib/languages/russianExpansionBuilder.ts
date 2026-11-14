import type { LearningLesson } from './types';
import { everydayLesson, everydaySentence } from './russianEverydayPartA';

// Shared builder for the A2–C1 expansion blocks. Same nine-stage lesson shape
// as the existing Russian course: 8 sentences, a short dialogue, two checks.
export type Row = [text: string, fa: string, pronunciation: string, word: string, meaning: string];
export type Turn = [speaker: string, text: string, fa: string];
export type Check = NonNullable<LearningLesson['checks']>[number];
export interface Seed { id: string; title: string; situation: string; pattern: string; note: string; rows: Row[]; dialogue: Turn[]; focus: Check }

export function buildExpansionLessons(prefix: string, seeds: readonly Seed[]): readonly LearningLesson[] {
  return seeds.map(seed => {
    const lessonId = `${prefix}-${seed.id}`;
    const sentences = seed.rows.map(([text, fa, pronunciation, word, meaning], index) =>
      everydaySentence(`${lessonId}-${String(index + 1).padStart(2, '0')}`, text, fa, pronunciation, [[word, meaning]], index === 0 ? seed.pattern : undefined));
    const choiceSeed = [...seed.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const choices = [3, 5, 7].map(index => seed.rows[index][0]);
    const answerIndex = choiceSeed % choices.length;
    const [answer] = choices.splice(0, 1);
    choices.splice(answerIndex, 0, answer);
    const focusChoices = [...seed.focus.choices];
    const [focusAnswer] = focusChoices.splice(seed.focus.correctIndex, 1);
    const focusIndex = (choiceSeed + 1) % (focusChoices.length + 1);
    focusChoices.splice(focusIndex, 0, focusAnswer);
    const checks = [{ ...seed.focus, choices: focusChoices, correctIndex: focusIndex }, {
      promptFa: `کدام جمله یعنی «${seed.rows[3][1]}»؟`, choices, correctIndex: answerIndex,
      explanationFa: `پاسخ نمونه: ${seed.rows[3][0]} — ${seed.rows[3][1]}`,
    }];
    return everydayLesson(lessonId, seed.title, seed.situation, sentences,
      seed.dialogue.map(([speaker, text, fa]) => ({ speaker, text, fa })), checks, seed.note);
  });
}
