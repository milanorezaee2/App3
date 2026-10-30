import { SENTENCE_LESSONS } from './courseContent';
import type { Task } from './englishSupplement/content';

/** New identifiers keep answers to the former, harder sentences separate. */
const grammar: Readonly<Record<string, { prompt: string; answer: string; options: string[]; explanation: string }>> = {
  'everyday-facing-a-challenge': { prompt: 'جمله را کامل کنید: There is not ___ clean water here.', answer: 'much', options: ['many', 'much', 'several'], explanation: 'برای water که غیرقابل‌شمارش است، از much استفاده می‌کنیم.' },
  'everyday-making-a-plan': { prompt: 'جمله را کامل کنید: We need to ___ a better plan.', answer: 'make', options: ['make', 'makes', 'made'], explanation: 'بعد از need to فعل به شکل ساده می‌آید.' },
  'everyday-handling-a-misunderstanding': { prompt: 'جمله را کامل کنید: I do not want to ___ my feelings.', answer: 'hide', options: ['hides', 'hid', 'hide'], explanation: 'بعد از want to فعل به شکل ساده می‌آید.' },
  'everyday-talking-about-weather': { prompt: 'جمله را کامل کنید: They say it ___ rain later.', answer: 'may', options: ['may', 'is', 'does'], explanation: 'may همراه فعل ساده، احتمال را بیان می‌کند.' },
  'everyday-handling-an-emergency': { prompt: 'جمله را کامل کنید: A storm ___ the road yesterday.', answer: 'closed', options: ['close', 'closed', 'closing'], explanation: 'برای رویداد تمام‌شدهٔ دیروز از گذشتهٔ ساده استفاده می‌کنیم.' },
};

export const A2_SITUATIONS_EVIDENCE: Readonly<Record<string, readonly Task[]>> = Object.fromEntries(
  SENTENCE_LESSONS.filter(lesson => lesson.a2Section === 'legacy').map(lesson => {
    const [first, second, third, fourth, fifth, sixth] = lesson.sentences;
    const options = [first.fa, second.fa, third.fa];
    const rule = grammar[lesson.id];
    if (!rule || new Set(options).size !== 3) throw new Error(`Incomplete A2 situation checks: ${lesson.id}`);
    const prefix = `a2-situation-${lesson.id}`;
    const tasks: Task[] = [
      { id: `${prefix}-listening-v2`, skill: 'listening', prompt: 'جمله را بشنوید و معنی آن را انتخاب کنید.', audio: first.en, options, answers: [first.fa], explanation: `الگوی جمله: ${first.pattern}` },
      { id: `${prefix}-reading-v2`, skill: 'reading', prompt: 'معنی جملهٔ زیر را انتخاب کنید.', source: second.en, options, answers: [second.fa], explanation: `الگوی جمله: ${second.pattern}` },
      { id: `${prefix}-grammar-v2`, skill: 'grammar', prompt: rule.prompt, options: rule.options, answers: [rule.answer], explanation: rule.explanation },
      ...[fourth, fifth, sixth].map((sentence, index): Task => ({
        id: `${prefix}-writing-${index + 1}-v2`, skill: 'writing', prompt: `جملهٔ این درس را به انگلیسی بنویسید: «${sentence.fa}»`,
        answers: [sentence.en], explanation: sentence.pattern ? `الگوی جمله: ${sentence.pattern}` : 'به جملهٔ همین درس مراجعه کنید.',
      })),
    ];
    return [lesson.id, tasks];
  }),
);
