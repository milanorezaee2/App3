import { B1_INDEPENDENT_LESSONS } from './courseContentB1Independent';
import type { Task } from './englishSupplement/content';

/** Checks are tied to the five visible examples of each new B1 lesson. */
export const B1_INDEPENDENT_EVIDENCE: Readonly<Record<string, readonly Task[]>> = Object.fromEntries(
  B1_INDEPENDENT_LESSONS.map(lesson => {
    const [first, ...remaining] = lesson.sentences;
    const options = lesson.sentences.slice(0, 3).map(sentence => sentence.fa);
    const tasks: Task[] = [
      { id: `${lesson.id}-listening`, skill: 'listening', prompt: 'جمله را بشنوید و معنی آن را انتخاب کنید.', audio: first.en, options, answers: [first.fa], explanation: `الگوی جمله: ${first.pattern}` },
      { id: `${lesson.id}-reading`, skill: 'reading', prompt: 'معنی جملهٔ زیر را انتخاب کنید.', source: first.en, options, answers: [first.fa], explanation: `الگوی جمله: ${first.pattern}` },
      ...remaining.map((sentence, index): Task => ({
        id: `${lesson.id}-writing-${index + 1}`,
        skill: 'writing',
        prompt: `جملهٔ این درس را به انگلیسی بنویسید: «${sentence.fa}»`,
        answers: [sentence.en],
        explanation: `الگوی جمله: ${sentence.pattern}`,
      })),
    ];
    return [lesson.id, tasks];
  }),
);
