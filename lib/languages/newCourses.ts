import type { LearningLesson } from './types';
import type { CourseLevelId } from '../courseContent';
import { createCourseProgressStore } from '../createCourseProgressStore';
import { createStarterSessions } from './starterSessions';
import { PRE_A1_EXPANSION } from './preA1Expansion';
import { PRE_A1_MORE } from './preA1More';
import { A1_FIRST_UNITS, type A1Seed } from './a1FirstUnits';
import { STARTER_FOUNDATIONS, type FoundationMode, type FoundationSeed } from './starterFoundations';

export type NewLanguageId = 'de' | 'fr' | 'es';
export type StarterLesson = LearningLesson & { levelId: CourseLevelId; order: number; subtitle: string; learningMode?: FoundationMode };
export type SentenceSeed = [string, string, string, string, string, string?];
export type LessonSeed = { title: string; subtitle: string; situation: string; teachingFa: string; sentences: SentenceSeed[]; check: [string, number, string]; dialogue?: number[] };
const seeds: Record<NewLanguageId, LessonSeed[]> = {
  de: [
    { title:'سلام و خداحافظی', subtitle:'نخستین برخورد', situation:'با کسی سلام می‌کنید و هنگام رفتن خداحافظی می‌کنید.', teachingFa:'Hallo دوستانه و عمومی است؛ Guten Tag در موقعیت رسمی‌تر به کار می‌رود. آوانویسی فارسی تنها راهنمای تقریبی است.', sentences:[
      ['Hallo!','سلام!','هالو','Hallo','سلام'], ['Guten Morgen!','صبح بخیر!','گوتِن مورگِن','Morgen','صبح'], ['Guten Tag!','روز بخیر!','گوتِن تاک','Tag','روز'], ['Guten Abend!','عصر بخیر!','گوتِن آبِنت','Abend','عصر'], ['Tschüss!','خداحافظ! (دوستانه)','چوس','Tschüss','خداحافظ'], ['Auf Wiedersehen!','خداحافظ! (رسمی)','آوف ویدِرزِهِن','Auf Wiedersehen','خداحافظ رسمی']
    ], check:['برای خداحافظی رسمی کدام را می‌گوییم؟',5,'Auf Wiedersehen خداحافظی رسمی است.'] },
    { title:'معرفی و احوال‌پرسی', subtitle:'گفت‌وگوی کوتاه', situation:'نام خود را می‌گویید و حال طرف مقابل را می‌پرسید.', teachingFa:'در آلمانی حالت رسمی Sie با حرف بزرگ نوشته می‌شود. «Ich heiße …» برای گفتن نام است.', sentences:[
      ['Ich heiße Sara.','اسم من سارا است.','ایش هایسِه سارا','heiße','نام دارم','Ich heiße …'], ['Wie heißt du?','اسم تو چیست؟','وی هایست دو','wie','چگونه'], ['Ich bin Sara.','من سارا هستم.','ایش بین سارا','bin','هستم','Ich bin …'], ['Wie geht es dir?','حالت چطور است؟','وی گیت اِس دیر','dir','به تو'], ['Mir geht es gut.','حالم خوب است.','میر گیت اِس گوت','gut','خوب'], ['Danke, gut.','ممنون، خوبم.','دانکِه گوت','Danke','ممنون']
    ], check:['برای گفتن «اسم من سارا است» کدام را می‌گوییم؟',0,'Ich heiße Sara یعنی اسم من سارا است.'] },
  ],
  fr: [
    { title:'سلام و خداحافظی', subtitle:'نخستین برخورد', situation:'با کسی سلام می‌کنید و هنگام رفتن خداحافظی می‌کنید.', teachingFa:'Bonjour در روز و Bonsoir در عصر به کار می‌رود. Salut غیررسمی است و می‌تواند سلام یا خداحافظی باشد.', sentences:[
      ['Bonjour !','سلام / روز بخیر!','بونژور','Bonjour','سلام'], ['Bonsoir !','عصر بخیر!','بونسوار','Bonsoir','عصر بخیر'], ['Salut !','سلام! (دوستانه)','سَلو','Salut','سلام دوستانه'], ['Au revoir !','خداحافظ!','اُ رُووار','Au revoir','خداحافظ'], ['À bientôt !','به‌زودی می‌بینمت!','آ بیَنتو','bientôt','به‌زودی'], ['Bonne journée !','روز خوبی داشته باشید!','بُن ژورنه','journée','روز']
    ], check:['برای خداحافظی کدام عبارت مناسب است؟',3,'Au revoir عبارت رایج خداحافظی است.'] },
    { title:'معرفی و احوال‌پرسی', subtitle:'گفت‌وگوی کوتاه', situation:'نام خود را می‌گویید و حال طرف مقابل را می‌پرسید.', teachingFa:'«Je m’appelle …» برای گفتن نام به کار می‌رود. Ça va? پرسشی رایج و غیررسمی برای احوال‌پرسی است.', sentences:[
      ['Je m’appelle Sara.','اسم من سارا است.','ژُ مَپِل سارا','m’appelle','نام دارم','Je m’appelle …'], ['Comment tu t’appelles ?','اسم تو چیست؟','کُمان تو تَپِل','comment','چگونه'], ['Je suis Sara.','من سارا هستم.','ژُ سوی سارا','suis','هستم','Je suis …'], ['Ça va ?','حالت چطور است؟','سا وا','Ça va','حالت چطور است'], ['Ça va bien.','حالم خوب است.','سا وا بیَن','bien','خوب'], ['Merci, ça va.','ممنون، خوبم.','مِرسی، سا وا','Merci','ممنون']
    ], check:['برای گفتن «اسم من سارا است» کدام را می‌گوییم؟',0,'Je m’appelle Sara یعنی اسم من سارا است.'] },
  ],
  es: [
    { title:'سلام و خداحافظی', subtitle:'نخستین برخورد در اسپانیا', situation:'با کسی سلام می‌کنید و هنگام رفتن خداحافظی می‌کنید.', teachingFa:'در اسپانیا Hola سلامی رایج است؛ Buenos días در صبح و ابتدای روز استفاده می‌شود.', sentences:[
      ['¡Hola!','سلام!','اُلا','Hola','سلام'], ['¡Buenos días!','صبح بخیر!','بوئِنوس دیاس','días','روزها'], ['¡Buenas tardes!','عصر بخیر!','بوئِناس تاردِس','tardes','عصرها'], ['¡Buenas noches!','شب بخیر!','بوئِناس نوچِس','noches','شب‌ها'], ['¡Adiós!','خداحافظ!','آدیوس','Adiós','خداحافظ'], ['¡Hasta luego!','بعداً می‌بینمت!','آستا لوئِگو','luego','بعداً']
    ], check:['برای خداحافظی کدام عبارت مناسب است؟',4,'Adiós عبارت رایج خداحافظی است.'] },
    { title:'معرفی و احوال‌پرسی', subtitle:'گفت‌وگوی کوتاه', situation:'نام خود را می‌گویید و حال طرف مقابل را می‌پرسید.', teachingFa:'«Me llamo …» برای گفتن نام استفاده می‌شود. علامت پرسش در اسپانیایی در ابتدا و انتهای پرسش می‌آید.', sentences:[
      ['Me llamo Sara.','اسم من سارا است.','مِه یامو سارا','llamo','نام دارم','Me llamo …'], ['¿Cómo te llamas?','اسم تو چیست؟','کومو تِه یاماس','cómo','چگونه'], ['Soy Sara.','من سارا هستم.','سوی سارا','soy','هستم','Soy …'], ['¿Qué tal?','حالت چطور است؟','کِه تال','qué tal','حالت چطور است'], ['Estoy bien.','حالم خوب است.','اِستوی بیِن','bien','خوب'], ['Gracias, bien.','ممنون، خوبم.','گرا‌ثیاس، بیِن','Gracias','ممنون']
    ], check:['برای گفتن «اسم من سارا است» کدام را می‌گوییم؟',0,'Me llamo Sara یعنی اسم من سارا است.'] },
  ],
};

const pilotExtras: Record<NewLanguageId, SentenceSeed[][]> = {
  de: [
    [['Bis bald!','به‌زودی می‌بینمت!','بیس بالت','bald','به‌زودی'], ['Hallo zusammen!','سلام به همه!','هالو تسوزامِن','zusammen','همه با هم']],
    [['Und du?','و تو؟','اوند دو','du','تو'], ['Mir geht es gut, danke.','حالم خوب است، ممنون.','میر گیت اِس گوت، دانکِه','danke','ممنون']],
  ],
  fr: [
    [['Bonne soirée !','عصر خوبی داشته باشید!','بُن سواره','soirée','عصر'], ['À demain !','فردا می‌بینمت!','آ دُمَن','demain','فردا']],
    [['Et toi ?','و تو؟','اِ توا','toi','تو'], ['Bien, merci.','خوبم، ممنون.','بیَن، مِرسی','merci','ممنون']],
  ],
  es: [
    [['¡Hasta mañana!','تا فردا!','آستا مانیانا','mañana','فردا'], ['¡Hasta pronto!','به‌زودی می‌بینمت!','آستا پرونتو','pronto','به‌زودی']],
    [['¿Y tú?','و تو؟','ای تو','tú','تو'], ['Muy bien, gracias.','خیلی خوبم، ممنون.','موی بیِن، گرا‌ثیاس','bien','خوب']],
  ],
};
const labels = { de: {name:'آلمانی', native:'Deutsch', locale:'de-DE', brand:'GERMAN'}, fr:{name:'فرانسوی',native:'Français',locale:'fr-FR',brand:'FRENCH'}, es:{name:'اسپانیایی',native:'Español',locale:'es-ES',brand:'SPANISH'} } as const;
const levelSeeds: Array<[CourseLevelId,string,string,string,string]> = [
  [-1,'Absolute Beginner','Pre-A1 · شروع از صفر','نخستین واژه‌ها و جمله‌ها','#94a3b8'], [0,'Foundation','پایه · شروع از صفر','پایه‌های جمله‌سازی','#6555E9'], [1,'Survival','A1 · کاربرد روزمره','موقعیت‌های ضروری','#27A1D6'], [2,'Everyday','A2–B1 · زندگی روزمره','گفت‌وگو دربارهٔ زندگی روزمره','#19A88B'], [3,'Communication','B1–B2 · ارتباط مستقل','توضیح و بیان نظر','#E4A436'], [4,'Upper-Intermediate','B2 · پیشرفته‌تر','استدلال و ارتباط حرفه‌ای','#9A68E8'], [5,'Advanced Communication','C1 · پیشرفته','تحلیل و دقت در بیان','#D56788'],
];
export function isNewLanguage(value: string | undefined): value is NewLanguageId { return value === 'de' || value === 'fr' || value === 'es'; }
function buildFoundation(id: NewLanguageId, seed: FoundationSeed): StarterLesson {
  const lessonId = `${id}-foundation-${seed.id}`;
  const sentences = seed.rows.map(([text, fa, pronunciation], index) => ({
    id: `${lessonId}-s${index + 1}`, text, fa, pronunciation,
    vocabulary: [{word: text, meaning: fa}],
  }));
  // Three short checks in both directions; all distractors come from this
  // same lesson and every prompt and answer remains stable for saved sessions.
  const check = (target: number, meaningFirst: boolean) => {
    const indexes = [target, (target + 1) % sentences.length, (target + 3) % sentences.length, (target + 5) % sentences.length];
    const rotated = [...indexes.slice(1), indexes[0]];
    const item = sentences[target];
    return {
      promptFa: meaningFirst ? `کدام گزینه یعنی «${item.fa}»؟` : `«${item.text}» یعنی چه؟`,
      choices: rotated.map(index => meaningFirst ? sentences[index].text : sentences[index].fa),
      correctIndex: rotated.indexOf(target),
      explanationFa: `${item.text} یعنی ${item.fa}.`,
    };
  };
  return {
    id: lessonId, levelId: -1, order: 0, learningMode: seed.mode,
    title: seed.title, subtitle: seed.subtitle, situation: seed.situation,
    teachingFa: seed.teachingFa, durationMinutes: 6, sentences,
    dialogue: [], checks: [check(0, true), check(3, false), check(6, true)],
  };
}

function buildA1(id: NewLanguageId, seed: A1Seed): StarterLesson {
  const lessonId = `${id}-a1-${seed.slug}`;
  const sentences = seed.rows.map(([text, fa, pronunciation, word, meaning, pattern], index) => ({
    id: `${lessonId}-s${index + 1}`, text, fa, pronunciation,
    vocabulary: [{word, meaning}], ...(pattern ? {pattern} : {}),
  }));
  return {
    id: lessonId, levelId: 1, order: 0, title: seed.title, subtitle: seed.subtitle,
    situation: seed.situation, teachingFa: seed.teachingFa, durationMinutes: 20, sentences,
    dialogue: seed.dialogue.map((index, turn) => ({speaker: turn % 2 ? 'همراه' : 'زبان‌آموز', text: sentences[index].text, fa: sentences[index].fa})),
    checks: seed.checks.map(question => ({...question, choices: question.choices.map(index => sentences[index].text)})),
  };
}

function buildCourse(id: NewLanguageId) {
  const allSeeds = [...seeds[id], ...PRE_A1_EXPANSION[id], ...PRE_A1_MORE[id]];
  const legacy: StarterLesson[] = allSeeds.map((seed, n) => {
    const sentenceSeeds = n < 2 ? [...seed.sentences, ...pilotExtras[id][n]] : seed.sentences;
    const sentences = sentenceSeeds.map(([text,fa,pronunciation,word,meaning,pattern], i) => ({ id:`${id}-pre${n+1}-s${i+1}`, text, fa, pronunciation, vocabulary:[{word,meaning}], ...(pattern ? {pattern} : {}) }));
    const [promptFa, correctIndex, explanationFa] = seed.check;
    // Choices use actual sentences from the lesson; no generated or cross-language content.
    const choices = sentences.map(sentence => sentence.text);
    const checks = [{promptFa,choices,correctIndex,explanationFa}];
    // The new bridge lessons include an additional comprehension question.
    // Existing check indexes must not change: saved sessions contain answers.
    if (n >= 10) {
      const secondIndex = sentences.findIndex((sentence, index) => index !== correctIndex
        && sentences.filter(other => other.text === sentence.text || other.fa === sentence.fa).length === 1);
      if (secondIndex >= 0) {
        const sentence = sentences[secondIndex];
        checks.push({promptFa:`«${sentence.fa}» به این زبان کدام است؟`, choices, correctIndex:secondIndex, explanationFa:`${sentence.text} یعنی ${sentence.fa}`});
      }
    }
    return { id:`${id}-pre-${n+1}`, levelId:-1 as const, order:n+1, title:seed.title, subtitle:seed.subtitle, situation:seed.situation, teachingFa:seed.teachingFa, durationMinutes:8, sentences, dialogue: (seed.dialogue ?? (n === 0 ? [0,0,4,4] : [1,0,3,4])).map((idx, i) => ({speaker:i % 2 === 1 ? 'همراه' : 'زبان‌آموز', text:sentences[idx].text, fa:sentences[idx].fa})), checks };
  });
  // The original records retain every ID, sentence, check and review card.
  // Only their presentation order changes; returning learners keep their saved
  // current lesson and may optionally visit the new foundations.
  const legacyOrder = [11, 1, 3, 4, 5, 2, 7, 6, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  const lessons: StarterLesson[] = [
    ...STARTER_FOUNDATIONS[id].map(seed => buildFoundation(id, seed)),
    ...legacyOrder.map(number => legacy[number - 1]),
    ...A1_FIRST_UNITS[id].map(seed => buildA1(id, seed)),
  ].map((lesson, index) => ({...lesson, order: index + 1}));
  const levels = levelSeeds.map(([levelId,title,cefr,description,color])=>({ id:levelId,title,cefr,description,color,modules:lessons.filter(l=>l.levelId===levelId).map(l=>l.title),status:(levelId === -1 || levelId === 1 ? 'available' : 'planned') as 'available'|'planned' }));
  const progress = createCourseProgressStore({key:`sentence_course_progress_${id}_starter_v1`,lessons,cloudSync:false,recordEstimatedTime:false,markVocabularyOnCompletion:false});
  return { id,...labels[id], lessons,levels,progress,sessions:createStarterSessions(id,lessons), home:`/learn/${id}` };
}
export const NEW_COURSES = {de:buildCourse('de'),fr:buildCourse('fr'),es:buildCourse('es')};
export type StarterCourse = ReturnType<typeof buildCourse>;
