import type { StarterLesson } from './newCourses';

type Check = NonNullable<StarterLesson['checks']>[number];
type Editorial = { prompts?: Record<number, string>; explanations?: Record<number, string>; teachingFa?: string };

/**
 * Display-only editorial clarifications. The stored lesson, its ID, question
 * order, choice indexes and old saved answers are deliberately unchanged.
 * Avoid treating these wording improvements as external expert review.
 */
const EDITORIAL: Record<string, Editorial> = {
  'de-pre-2': {prompts:{0:'کدام جمله به‌طور مشخص می‌گوید «اسم من سارا است»، نه فقط «من سارا هستم»؟'}},
  'fr-pre-2': {prompts:{0:'کدام جمله به‌طور مشخص می‌گوید «اسم من سارا است»، نه فقط «من سارا هستم»؟'}},
  'es-pre-2': {prompts:{0:'کدام جمله به‌طور مشخص می‌گوید «اسم من سارا است»، نه فقط «من سارا هستم»؟'}},
  'de-pre-5': {prompts:{0:'کدام عدد به‌تنهایی یعنی «سه»؟'}},
  'fr-pre-5': {prompts:{0:'کدام عدد به‌تنهایی یعنی «سه»؟'}},
  'es-pre-5': {prompts:{0:'کدام عدد به‌تنهایی یعنی «سه»؟'}},
  'de-pre-15': {prompts:{0:'کدام واژه به‌تنهایی یعنی «امروز»؟'}, teachingFa:'Heute یعنی امروز و morgen یعنی فردا. Montag دوشنبه است؛ برای گفتن «تا دوشنبه» در این درس Bis Montag را می‌بینید.'},
  'fr-pre-15': {prompts:{0:'کدام واژه به‌تنهایی یعنی «امروز»؟'}},
  'es-pre-15': {prompts:{0:'کدام واژه به‌تنهایی یعنی «امروز»؟'}},
  'de-pre-16': {prompts:{0:'کدام واژهٔ رنگ به‌تنهایی یعنی «آبی»؟'}},
  'fr-pre-16': {prompts:{0:'کدام واژهٔ رنگ به‌تنهایی یعنی «آبی»؟'}},
  'es-pre-16': {prompts:{0:'کدام واژهٔ رنگ به‌تنهایی یعنی «آبی»؟'}},
  'de-pre-17': {prompts:{0:'کدام واژه به‌تنهایی یعنی «اینجا»، بدون افزودن «بله» یا جملهٔ دیگر؟'}},
  'fr-pre-17': {prompts:{0:'کدام واژه به‌تنهایی یعنی «اینجا»، بدون افزودن «بله» یا جملهٔ دیگر؟'}},
  'es-pre-17': {prompts:{0:'کدام واژه به‌تنهایی یعنی «اینجا»، بدون افزودن «بله» یا جملهٔ دیگر؟'}},
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
};

/** Display-only pronunciation corrections; original sentence IDs and review data stay stable.
 * Persian transliteration is an approximation, not a substitute for audio. */
export function starterDisplayPronunciation(sentence: StarterLesson['sentences'][number]): string {
  const exact: Record<string,string> = {
    'fr-a1-shopping-payment-s5':'وو زَکسِپته لِ کارت',
    'fr-a1-greetings-s5':'تْغِه بیَن، مِرسی',
    'fr-a1-cafe-s3':'اِ یون بوتِی دو، سیل وو پله',
    'es-a1-directions-s2':'اِستا خونتو آ لا پلاثا',
  };
  let result = exact[sentence.id] ?? sentence.pronunciation;
  if (sentence.id.startsWith('de-')) {
    if (/können/i.test(sentence.text)) result = result.replace(/کِنِن/g, 'کونِن');
    if (/sprechen/i.test(sentence.text)) result = result.replace(/اِشپرِخِن/g, 'اِشپرِشِن');
  }
  if (sentence.id.startsWith('es-')) {
    if (/izquierda/i.test(sentence.text)) result = result.replace(/ایسکیِردا/g, 'ایثکیِردا');
    if (/tarjeta/i.test(sentence.text)) result = result.replace(/تارهِتا/g, 'تارخِتا');
  }
  return result;
}

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

/** Correct dialogue speaker labels at presentation time without changing saved lessons. */
export function starterDisplayDialogue(lesson: StarterLesson): StarterLesson['dialogue'] {
  // The original records stay byte-for-byte stable; only the presented roles change.
  if (/^(de|fr|es)-(a1-cafe|pre-18)$/.test(lesson.id)) {
    return lesson.dialogue.map((line, index) => ({...line, speaker:index % 2 === 0 ? 'کارمند کافه' : 'مشتری'}));
  }
  // Sara speaks twice at the end; her partner is Lena/Léa/Lucía.
  if (/^(de|fr|es)-a1-greetings$/.test(lesson.id)) {
    return lesson.dialogue.map((line, index) => index === 5 ? {...line, speaker: lesson.dialogue[0].speaker} : line);
  }
  // The person giving their age returns the question to the other speaker.
  if (/^(de|fr|es)-a1-numbers-age$/.test(lesson.id)) {
    return lesson.dialogue.map((line, index) => index === 2 ? {...line, speaker: lesson.dialogue[1].speaker} : index === 3 ? {...line, speaker: lesson.dialogue[0].speaker} : line);
  }
  // The person answering asks for a repetition or returns the question;
  // two consecutive lines therefore belong to the same speaker.
  if (/^(de|fr|es)-pre-(7|13|20)$/.test(lesson.id)) {
    const roles = ['زبان‌آموز','همراه','همراه','زبان‌آموز'];
    return lesson.dialogue.map((line, index) => ({...line, speaker:roles[index] ?? line.speaker}));
  }
  return lesson.dialogue;
}
