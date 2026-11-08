import { SENTENCE_LESSONS } from '../courseContent';
import { TURKISH_LESSONS } from './turkish';
import { NEW_COURSES } from './newCourses';
import type { LearningSentence } from './types';

/** A new, additive map; the existing curricula and their IDs are not rewritten. */
export type FoundationLanguage = 'en' | 'fr' | 'tr' | 'de' | 'es';
export const FOUNDATION_LANGUAGES: Readonly<Record<FoundationLanguage, {name:string; locale:string}>> = {
  en:{name:'انگلیسی',locale:'en-US'}, fr:{name:'فرانسوی',locale:'fr-FR'},
  tr:{name:'ترکی استانبولی',locale:'tr-TR'}, de:{name:'آلمانی',locale:'de-DE'},
  es:{name:'اسپانیایی اسپانیا',locale:'es-ES'},
};
export const FOUNDATION_TOPICS = [
  {id:'greetings',title:'سلام و احوال‌پرسی',english:'Greetings', goals:'سلام، احوال‌پرسی، پاسخ، خداحافظی، معرفی اولیه و ادب'},
  {id:'identity',title:'هویت شخصی',english:'Personal Identity', goals:'نام و نام خانوادگی، معرفی خود و دیگران و اطلاعات اولیه'},
  {id:'information',title:'اطلاعات شخصی',english:'Personal Information', goals:'سن، تاریخ و محل تولد، محل زندگی، تلفن، نشانی و پرسش اطلاعات شخصی'},
  {id:'people',title:'افراد و ارجاع به اشخاص',english:'People and Pronouns', goals:'اشاره به خود، مخاطب، شخص سوم و چند نفر در جمله'},
  {id:'statements',title:'جملات خبری پایه',english:'Basic Statements', goals:'بیان هویت، وضعیت، مالکیت، وجود، ویژگی و اطلاعات ساده'},
  {id:'questions',title:'پرسش‌های پایه',english:'Basic Questions', goals:'پرسش نام، سن، محل زندگی، ملیت، شغل، مالکیت، اشخاص و اشیا'},
  {id:'positive-negative',title:'جملات مثبت و منفی',english:'Positive and Negative Sentences', goals:'تأیید، رد، نبودن و نداشتن با پاسخ کوتاه و کامل'},
  {id:'countries',title:'کشورها و ملیت‌ها',english:'Countries and Nationalities', goals:'کشور، ملیت، مبدأ، زبان مادری، زبان‌های قابل صحبت و محل سکونت'},
  {id:'numbers-age',title:'اعداد و سن',english:'Numbers and Age', goals:'اعداد پایه، سن، تعداد اشخاص و اشیا، شماره تلفن و قیمت'},
  {id:'family',title:'خانواده و روابط',english:'Family and Relationships', goals:'پدر، مادر، خواهر، برادر، همسر، فرزندان، بستگان و وضعیت خانوادگی'},
  {id:'descriptions',title:'توصیف‌های پایه',english:'Basic Descriptions', goals:'ظاهر، ویژگی شخصیتی، اندازه، رنگ، کیفیت و مکان ساده'},
  {id:'construction',title:'ساخت جملات پایه',english:'Basic Sentence Construction', goals:'جملهٔ مثبت، منفی و پرسشی دربارهٔ خود، دیگران و اشیا و پیوند جمله‌ها'},
] as const;

// Explicit stable source references: existing content and stored progress remain untouched.
type Ref = readonly [lessonId:string, sentenceId:string];
const range = (lessonId:string, prefix:string, numbers:readonly (number|string)[]): Ref[] => numbers.map(n=>[lessonId,`${prefix}${n}`]);
const sourceRefs: Record<FoundationLanguage, readonly Ref[]> = {
  en: range('foundation-introducing-yourself','s',[14,15,16,1,2,3,17,18,19,20,21,22,23,24,25,26,46,47,6,7,8,9,10,11,12]),
  tr: [
    ...range('tr-l1-greetings','tr1-',[9,10,11,12,13,14,15,16].map(n=>String(n).padStart(3,'0'))),
    ...range('tr-l1-introductions','tr1-',[17,18,19,20,21,22,23,24].map(n=>String(n).padStart(3,'0'))),
    ...range('tr-prea1-07-first-short-sentences','tr0-',[49,50,51,52,53].map(n=>String(n).padStart(3,'0'))),
    ['tr-prea1-09-needs-and-places','tr0-071'], ['tr-prea1-10-first-conversation','tr0-079'],
    ['tr-prea1-10-first-conversation','tr0-080'], ['tr-prea1-time-and-calendar-sentences','tr0-200'],
  ],
  de: [
    ...range('de-pre-1','de-pre1-s',[1,2,3,4,5,6,7,8]), ...range('de-pre-2','de-pre2-s',[1,2,3,4,5,6,7,8]),
    ...range('de-a1-profile','de-a1-profile-s',[11,12,13,14,15,16,17,20]), ['de-pre-4','de-pre4-s6'],
  ],
  fr: [
    ...range('fr-pre-1','fr-pre1-s',[1,2,3,4,5,6,7,8]), ...range('fr-pre-2','fr-pre2-s',[1,2,3,4,5,6,7,8]),
    ...range('fr-a1-profile','fr-a1-profile-s',[11,12,13,14,15,16,17,20]), ['fr-pre-4','fr-pre4-s7'],
  ],
  es: [
    ...range('es-pre-1','es-pre1-s',[1,2,3,4,5,6,7,8]), ...range('es-pre-2','es-pre2-s',[1,2,3,4,5,6,7,8]),
    ...range('es-a1-profile','es-a1-profile-s',[11,12,13,14,15,16,17,20]), ['es-pre-4','es-pre4-s7'],
  ],
};

export function isFoundationLanguage(id: string | undefined): id is FoundationLanguage {
  return !!id && Object.prototype.hasOwnProperty.call(FOUNDATION_LANGUAGES,id);
}
export type FoundationExample = LearningSentence & {sourceLessonId:string; sourceSentenceId:string};
export function getFoundationGreetings(language: FoundationLanguage): FoundationExample[] {
  const lessons = language === 'en' ? SENTENCE_LESSONS : language === 'tr' ? TURKISH_LESSONS : NEW_COURSES[language].lessons;
  return sourceRefs[language].map(([lessonId,sentenceId]) => {
    const lesson = lessons.find(l=>l.id===lessonId);
    const sentence = lesson?.sentences.find(s=>s.id===sentenceId);
    if (!sentence) throw new Error(`Foundation source missing: ${language}/${lessonId}/${sentenceId}`);
    const text = 'en' in sentence ? sentence.en : sentence.text;
    return {id:`foundation-a1-${language}-greetings-${sentenceId}`, text, fa:sentence.fa, pronunciation:sentence.pronunciation,
      vocabulary:sentence.vocabulary.map(item=>({word:item.word,meaning:item.meaning})), sourceLessonId:lessonId, sourceSentenceId:sentenceId};
  });
}
