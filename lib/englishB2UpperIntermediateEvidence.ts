import { B2_UPPER_INTERMEDIATE_LESSONS } from './courseContentB2UpperIntermediate';
import type { Task } from './englishSupplement/content';

/** Stable, new task IDs; exercises check the supplied examples, not spoken proficiency. */
export const B2_UPPER_INTERMEDIATE_EVIDENCE: Readonly<Record<string, readonly Task[]>> = Object.fromEntries(
  B2_UPPER_INTERMEDIATE_LESSONS.map(lesson => {
    const [first, second, ...remaining] = lesson.sentences.slice(0, 5);
    const options = lesson.sentences.slice(0, 3).map(sentence => sentence.fa);
    const tasks: Task[] = [
      { id: `${lesson.id}-listening-v1`, skill: 'listening', prompt: 'جمله را بشنوید و معنی آن را انتخاب کنید.', audio: first.en, options, answers: [first.fa], explanation: `الگوی جمله: ${first.pattern}` },
      { id: `${lesson.id}-reading-v1`, skill: 'reading', prompt: 'معنی جملهٔ زیر را انتخاب کنید.', source: second.en, options, answers: [second.fa], explanation: `الگوی جمله: ${second.pattern}` },
      ...[second, ...remaining].map((sentence, index): Task => ({
        id: `${lesson.id}-writing-${index + 1}-v1`, skill: 'writing',
        prompt: `جملهٔ این درس را به انگلیسی بنویسید: «${sentence.fa}»`,
        answers: [sentence.en], explanation: `الگوی جمله: ${sentence.pattern}`,
      })),
    ];
    return [lesson.id, tasks];
  }),
);
