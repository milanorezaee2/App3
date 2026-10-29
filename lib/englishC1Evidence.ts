import { C1_ADVANCED_LESSONS } from './courseContentC1Advanced';
import type { Task } from './englishSupplement/content';
/** Completion checks are scoped to C1 lesson content; they do not certify CEFR proficiency. */
export const C1_EVIDENCE: Readonly<Record<string, readonly Task[]>> = Object.fromEntries(C1_ADVANCED_LESSONS.map(lesson => {
  const first = lesson.sentences[0], second = lesson.sentences[2], third = lesson.sentences[4];
  const options = [second.fa, third.fa, first.fa];
  return [lesson.id, [
    { id: `${lesson.id}-listening-v1`, skill: 'listening', prompt: 'جمله را بشنوید و معنای آن را انتخاب کنید.', audio: first.en, options, answers: [first.fa], explanation: 'به معنی دقیق و رابطهٔ اجزای جمله دقت کنید.' },
    { id: `${lesson.id}-reading-v1`, skill: 'reading', prompt: 'معنای جمله را انتخاب کنید.', source: second.en, options, answers: [second.fa], explanation: 'جمله را با ترجمه و بافت درس مقایسه کنید.' },
    { id: `${lesson.id}-writing-v1`, skill: 'writing', prompt: 'جملهٔ این درس را مطابق متن انگلیسی آن بنویسید.', source: third.fa, answers: [third.en], explanation: `متن نمونهٔ درس: ${third.en}` },
  ] satisfies Task[]];
}));
