import type { LearningLesson } from './types';
import { createCourseProgressStore } from '../createCourseProgressStore';
import { TURKISH_FOUNDATION_LESSONS } from './turkishFoundation';
import { TURKISH_SURVIVAL_LESSONS } from './turkishSurvival';

/**
 * دورهٔ ترکی استانبولی برای فارسی‌زبان‌ها — بر همان معماری جمله‌محور دورهٔ روسی.
 *
 * اصول این دوره:
 *  ۱. هر درس با یک موقعیت واقعی شروع می‌شود و جمله‌های کامل و کوتاه می‌آموزد.
 *  ۲. هر جمله با معنی فارسی، تلفظ تقریبی فارسی و یک واژهٔ کلیدی همراه است.
 *  ۳. الفبای لاتین ترکی از درس اول به‌کار می‌رود؛ حرف‌های ویژه (ç، ş، ğ، ı، ö، ü) در نکته‌های آموزشی توضیح داده می‌شوند.
 *  ۴. محتوای فعلی دو سطح آغازین است؛ سطح‌های بالاتر «برنامه‌ریزی‌شده» علامت خورده‌اند و درس جعلی ندارند.
 */

export const TURKISH_ALPHABET = [...'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'] as const;

export const TURKISH_LESSON_STAGES = [
  { id: 'situation', labelFa: 'موقعیت', labelEn: 'Situation' },
  { id: 'core-sentences', labelFa: 'جمله‌های اصلی', labelEn: 'Core Sentences' },
  { id: 'listening', labelFa: 'شنیدن', labelEn: 'Listening' },
  { id: 'sentence-building', labelFa: 'ساخت جمله', labelEn: 'Sentence Building' },
  { id: 'vocabulary', labelFa: 'واژگان از جمله', labelEn: 'Vocabulary From Sentences' },
  { id: 'grammar-through-usage', labelFa: 'دستور در کاربرد', labelEn: 'Grammar Through Usage' },
  { id: 'conversation', labelFa: 'مکالمه', labelEn: 'Conversation Practice' },
  { id: 'review', labelFa: 'مرور هوشمند', labelEn: 'Spaced Review' },
] as const;

const TURKISH_STARTER_LESSONS: readonly LearningLesson[] = [
  ...TURKISH_FOUNDATION_LESSONS,
  ...TURKISH_SURVIVAL_LESSONS,
];

export type TurkishLevelId = 0 | 1 | 2 | 3 | 4 | 5;

export interface TurkishCourseLevel {
  id: TurkishLevelId;
  title: string;
  cefr: string;
  description: string;
  color: string;
  modules: readonly string[];
  status: 'available' | 'planned';
}

export interface TurkishCourseLesson extends LearningLesson {
  levelId: TurkishLevelId;
  order: number;
  subtitle: string;
}

export const TURKISH_LEVELS: readonly TurkishCourseLevel[] = [
  {
    id: 0,
    title: 'Türkçe Foundation',
    cefr: 'سطح ۱ · شروع از صفر',
    description: 'سلام و احوال‌پرسی، معرفی خود، کلمه‌های مؤدبانه، عددها، اشیای ساده، پرسیدن «کجا»، خواستن و رنگ‌ها',
    color: '#D2432F',
    modules: [
      'سلام و خداحافظی',
      'احوال‌پرسی ساده',
      'معرفی خود',
      'کلمه‌های مؤدبانه',
      'بله، نه، متوجه نشدم',
      'عددها و قیمت',
      'این چیست؟',
      'پرسیدن کجا',
      'خواستن و نیاز داشتن',
      'رنگ‌ها و صفت‌های ساده',
    ],
    status: 'available',
  },
  {
    id: 1,
    title: 'Survival Türkçe',
    cefr: 'سطح ۲ · کاربرد روزمره',
    description: 'کافه و رستوران، خرید، مسیر و تاکسی، ساعت و روزها، هتل، سفارش غذا، کمک و سلامت، آشنایی و قرار',
    color: '#1D7FA6',
    modules: [
      'کافه و رستوران',
      'خرید کردن',
      'مسیر، تاکسی و فرودگاه',
      'ساعت و روزهای هفته',
      'هتل و اتاق',
      'سفارش غذا',
      'کمک و سلامت',
      'آشنایی، دعوت و قرار',
    ],
    status: 'available',
  },
  {
    id: 2,
    title: 'Everyday Turkish',
    cefr: 'A2 · برنامه‌ریزی‌شده',
    description: 'گذشته و آینده، توصیف، مقایسه، نظر، کار و خانه. این سطح هنوز درس تأییدشده ندارد.',
    color: '#19A88B',
    modules: ['گذشتهٔ ساده', 'آینده و برنامه', 'مقایسه و توصیف', 'نظر و علاقه'],
    status: 'planned',
  },
  {
    id: 3,
    title: 'Communication Turkish',
    cefr: 'B1 · برنامه‌ریزی‌شده',
    description: 'روایت، دلیل‌آوری و گفت‌وگوی روان. درس‌های این سطح پس از بازبینی محتوا افزوده می‌شوند.',
    color: '#E4A436',
    modules: ['روایت و تجربه', 'دلیل و نتیجه', 'بحث مؤدبانه'],
    status: 'planned',
  },
  {
    id: 4,
    title: 'Advanced Turkish',
    cefr: 'B2 · برنامه‌ریزی‌شده',
    description: 'ترکی دقیق‌تر در موضوع‌های رسمی و حرفه‌ای؛ فعلاً نقشهٔ راه است، نه درس.',
    color: '#9A68E8',
    modules: ['نوشتار رسمی', 'رسانه و مطالعه'],
    status: 'planned',
  },
  {
    id: 5,
    title: 'Advanced Communication Turkish',
    cefr: 'C1 · برنامه‌ریزی‌شده',
    description: 'تحلیل، استدلال و ارتباط حرفه‌ای؛ این سطح در نقشهٔ راه دوره ثبت شده است.',
    color: '#D56788',
    modules: ['تحلیل و استدلال', 'ارتباط حرفه‌ای'],
    status: 'planned',
  },
];

const TURKISH_LESSON_META: Record<string, { levelId: TurkishLevelId; subtitle: string }> = {
  'tr-l1-greetings': { levelId: 0, subtitle: 'سلام، صبح/عصر/شب بخیر، خداحافظ و متشکرم' },
  'tr-l1-how-are-you': { levelId: 0, subtitle: 'احوال‌پرسی دوستانه و رسمی و پاسخ کوتاه' },
  'tr-l1-introductions': { levelId: 0, subtitle: 'گفتن نام، پرسیدن نام و گفتن اهل کجا بودن' },
  'tr-l1-polite-words': { levelId: 0, subtitle: 'لطفاً، متشکرم، ببخشید و درخواست کمک' },
  'tr-l1-yes-no-understand': { levelId: 0, subtitle: 'بله، نه، نفهمیدم و درخواست تکرار' },
  'tr-l1-numbers': { levelId: 0, subtitle: 'عددهای ۱ تا ۱۰ و پرسیدن قیمت' },
  'tr-l1-objects-this-is': { levelId: 0, subtitle: 'این چیست؟ و اشاره به اشیای ساده' },
  'tr-l1-where-is': { levelId: 0, subtitle: 'توالت، مترو، ایستگاه و جهت‌ها' },
  'tr-l1-wants-needs': { levelId: 0, subtitle: 'الگوی «من … می‌خواهم» و «نیاز دارم»' },
  'tr-l1-colors': { levelId: 0, subtitle: 'رنگ‌ها و توصیف ساده با صفت' },
  'tr-l2-cafe': { levelId: 1, subtitle: 'منو، سفارش چای و قهوه، صورت‌حساب و پرداخت' },
  'tr-l2-shopping': { levelId: 1, subtitle: 'قیمت، چانه‌زدن، کارت و کیسه' },
  'tr-l2-directions': { levelId: 1, subtitle: 'تاکسی، فرودگاه، راست و چپ و مستقیم' },
  'tr-l2-time-days': { levelId: 1, subtitle: 'ساعت، روزهای هفته و قرار کوتاه' },
  'tr-l2-hotel': { levelId: 1, subtitle: 'رزرو، اتاق خالی، صبحانه و کلید' },
  'tr-l2-food-order': { levelId: 1, subtitle: 'سفارش غذا، تندی، گوشت و غذای گیاهی' },
  'tr-l2-emergency': { levelId: 1, subtitle: 'بیماری، درد، داروخانه و کمک فوری' },
  'tr-l2-social': { levelId: 1, subtitle: 'آشنایی، دعوت به قهوه و گذاشتن قرار' },
};

export const TURKISH_LESSONS: readonly TurkishCourseLesson[] = TURKISH_STARTER_LESSONS.map((item, index) => {
  const meta = TURKISH_LESSON_META[item.id];
  if (!meta) throw new Error(`Turkish lesson ${item.id} has no level assignment.`);
  return { ...item, ...meta, order: index + 1 };
});

export function findTurkishLesson(id: string | undefined): TurkishCourseLesson | undefined {
  return TURKISH_LESSONS.find(item => item.id === id);
}

export const turkishProgress = createCourseProgressStore({
  key: 'sentence_course_progress_tr_v1',
  lessons: TURKISH_LESSONS,
  cloudSync: false,
  recordEstimatedTime: false,
  markVocabularyOnCompletion: false,
});
