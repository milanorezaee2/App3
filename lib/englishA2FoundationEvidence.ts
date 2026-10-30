import { A2_FOUNDATION_LESSONS } from './courseContentA2Foundation';
import type { Task } from './englishSupplement/content';

const grammar: Readonly<Record<string, { prompt: string; answer: string; options: string[]; explanation: string }>> = {
  'a2-foundation-past': { prompt: 'جمله را کامل کنید: Did she ___ to the market?', answer: 'go', options: ['went', 'go', 'goes'], explanation: 'بعد از did فعل به شکل ساده می‌آید.' },
  'a2-foundation-future': { prompt: 'جمله را کامل کنید: If it ___, we will stay inside.', answer: 'rains', options: ['will rain', 'rains', 'rained'], explanation: 'در شرط ساده پس از if از حال ساده استفاده می‌کنیم.' },
  'a2-foundation-quantity': { prompt: 'جمله را کامل کنید: How ___ water is in the bottle?', answer: 'much', options: ['much', 'many', 'most'], explanation: 'water غیرقابل‌شمارش است؛ برای مقدار از how much استفاده می‌کنیم.' },
  'a2-foundation-experiences': { prompt: 'جمله را کامل کنید: He ___ not called me yet.', answer: 'has', options: ['has', 'have', 'is'], explanation: 'در حال کامل با he از has استفاده می‌کنیم.' },
  'a2-foundation-advice': { prompt: 'پارک در اینجا ممنوع است: You ___ park here.', answer: 'must not', options: ['do not have to', 'must not', 'should'], explanation: 'must not ممنوعیت را بیان می‌کند؛ do not have to یعنی لازم نیست.' },
};

export const A2_FOUNDATION_EVIDENCE: Readonly<Record<string, readonly Task[]>> = Object.fromEntries(
  A2_FOUNDATION_LESSONS.map(lesson => {
    const [first, second, third, fourth, fifth, sixth] = lesson.sentences;
    const choices = [first.fa, second.fa, third.fa];
    const rule = grammar[lesson.id];
    if (!rule || new Set(choices).size !== 3) throw new Error(`Incomplete A2 checks: ${lesson.id}`);
    const tasks: Task[] = [
      { id: `${lesson.id}-listening-v1`, skill: 'listening', prompt: 'جمله را بشنوید و معنی آن را انتخاب کنید.', audio: first.en, options: choices, answers: [first.fa], explanation: `الگوی جمله: ${first.pattern}` },
      { id: `${lesson.id}-reading-v1`, skill: 'reading', prompt: 'معنی جملهٔ زیر را انتخاب کنید.', source: second.en, options: choices, answers: [second.fa], explanation: `الگوی جمله: ${second.pattern}` },
      { id: `${lesson.id}-grammar-v1`, skill: 'grammar', prompt: rule.prompt, options: rule.options, answers: [rule.answer], explanation: rule.explanation },
      ...[fourth, fifth, sixth].map((sentence, index): Task => ({
        id: `${lesson.id}-writing-${index + 1}-v1`, skill: 'writing', prompt: `جملهٔ این درس را به انگلیسی بنویسید: «${sentence.fa}»`,
        answers: [sentence.en], explanation: `الگوی جمله: ${sentence.pattern}`,
      })),
    ];
    return [lesson.id, tasks];
  }),
);
