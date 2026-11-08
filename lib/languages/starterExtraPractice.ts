import type { StarterLesson } from './newCourses';
import { A1_EXTENSION_SLUGS } from './a1TopicExtensions';

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
  const initial = [0, 2, 4].filter(index => index < unique.length).map(index => unique[index]);
  const slug = lesson.id.replace(/^(fr|de|es)-a1-/, '');
  const added = lesson.levelId === 1 && A1_EXTENSION_SLUGS.includes(slug)
    ? lesson.sentences.slice(8).filter(sentence => unique.includes(sentence)).slice(0, 2)
    : [];
  return [...initial, ...added].map((target, questionIndex) => {
    const distractors = unique.filter(item => item !== target).slice(0, 3).map(item => item.fa);
    const choices = [...distractors];
    const correctIndex = (questionIndex + 1) % 4;
    choices.splice(correctIndex, 0, target.fa);
    return {target: target.text, choices, correctIndex};
  });
}
