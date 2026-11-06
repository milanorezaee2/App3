import type { StarterLesson } from './newCourses';

export type ExtraQuestion = { target: string; choices: string[]; correctIndex: number };

/** Optional recognition practice, derived only from the current lesson.
 * It has no persistence and never affects lesson completion or review cards.
 */
export function buildExtraPractice(lesson: StarterLesson): ExtraQuestion[] {
  const unique = lesson.sentences.filter((sentence, index, all) =>
    all.filter(other => other.text.trim() === sentence.text.trim()).length === 1 &&
    all.findIndex(other => other.fa.trim() === sentence.fa.trim()) === index
  );
  if (unique.length < 4) return [];
  return [0, 2, 4].filter(index => index < unique.length).map((index, questionIndex) => {
    const target = unique[index];
    const distractors = unique.filter(item => item !== target).slice(0, 3).map(item => item.fa);
    const choices = [...distractors];
    const correctIndex = (questionIndex + 1) % 4;
    choices.splice(correctIndex, 0, target.fa);
    return {target: target.text, choices, correctIndex};
  });
}
