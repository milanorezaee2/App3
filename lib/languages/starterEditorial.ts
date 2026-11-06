import type { StarterLesson } from './newCourses';

type Check = NonNullable<StarterLesson['checks']>[number];
type Editorial = { prompts?: Record<number, string>; explanations?: Record<number, string>; teachingFa?: string };

/**
 * Display-only editorial clarifications. The stored lesson, its ID, question
 * order, choice indexes and old saved answers are deliberately unchanged.
 * Avoid treating these wording improvements as external expert review.
 */
const EDITORIAL: Record<string, Editorial> = {
  'de-pre-3': {prompts:{0:'کدام واژه به‌تنهایی پاسخ «نه» است؟'}},
  'fr-pre-3': {prompts:{0:'کدام واژه به‌تنهایی پاسخ «نه» است؟'}},
  'es-pre-3': {prompts:{0:'کدام واژه به‌تنهایی پاسخ «نه» است؟'}},
  'fr-foundation-words-1': {prompts:{0:'کدام سلام رایج و خنثی یا «روز بخیر» است، نه سلام دوستانه؟'}},
  'es-foundation-chunks-1': {prompts:{1:'در این درس معنی «Hasta luego» کدام است؟'}},
  'fr-pre-1': {prompts:{0:'کدام عبارت رایج و خنثی به معنی «خداحافظ» است، نه سلام دوستانه، وعدهٔ دیدار یا آرزوی روز و عصر خوب؟'}},
  'es-pre-1': {prompts:{0:'کدام عبارت یعنی «خداحافظ»، بدون اشاره به دیدار بعدی؟'}},
  'de-pre-4': {prompts:{0:'کدام عبارت کوتاه یعنی «ممنون»، نه «خیلی ممنون»؟'}},
  'fr-pre-4': {prompts:{0:'کدام عبارت کوتاه یعنی «ممنون»، نه «خیلی ممنون»؟'}},
  'es-pre-4': {prompts:{0:'کدام عبارت کوتاه یعنی «ممنون»، نه «خیلی ممنون»؟'}},
  'de-pre-9': {
    prompts:{0:'کدام یعنی «این دوست من است»، وقتی دوست مرد است؟'},
    explanations:{0:'Das ist mein Freund یعنی این دوست مرد من است. برای دوست زن در این درس meine Freundin آمده است.'},
  },
  'de-pre-21': {prompts:{1:'در این درس کدام عبارت سلام ساده و دوستانه است، بدون اشاره به زمان روز؟'}},
  'es-pre-21': {prompts:{1:'در این درس کدام عبارت سلام ساده است، بدون اشاره به زمان روز؟'}},
  'de-pre-15': {teachingFa:'Heute یعنی امروز و morgen یعنی فردا. Montag دوشنبه است؛ برای گفتن «تا دوشنبه» در این درس Bis Montag را می‌بینید.'},
};

export function starterTeachingNote(lesson: StarterLesson): string | undefined {
  return EDITORIAL[lesson.id]?.teachingFa ?? lesson.teachingFa;
}

export function starterDisplayChecks(lesson: StarterLesson): Check[] {
  const editorial = EDITORIAL[lesson.id];
  return (lesson.checks ?? []).map((check, index) => ({
    ...check,
    promptFa: editorial?.prompts?.[index] ?? check.promptFa,
    explanationFa: editorial?.explanations?.[index] ?? check.explanationFa,
  }));
}
