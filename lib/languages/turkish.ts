import type { LearningLesson } from './types';
import { createCourseProgressStore } from '../createCourseProgressStore';
import { TURKISH_FOUNDATION_PART_A } from './turkishFoundationPartA';
import { TURKISH_FOUNDATION_PART_B } from './turkishFoundationPartB';
import { TURKISH_SURVIVAL_PART_A } from './turkishSurvivalPartA';
import { TURKISH_SURVIVAL_PART_B } from './turkishSurvivalPartB';
import { TURKISH_A2_FOUNDATION_PART_A } from './turkishA2FoundationPartA';
import { TURKISH_A2_FOUNDATION_PART_B } from './turkishA2FoundationPartB';
import { TURKISH_A2_SURVIVAL_PART_A } from './turkishA2SurvivalPartA';
import { TURKISH_A2_SURVIVAL_PART_B } from './turkishA2SurvivalPartB';
import { TURKISH_B1_FOUNDATION_PART_A } from './turkishB1FoundationPartA';
import { TURKISH_B1_FOUNDATION_PART_B } from './turkishB1FoundationPartB';
import { TURKISH_B1_SURVIVAL_PART_A } from './turkishB1SurvivalPartA';
import { TURKISH_B1_SURVIVAL_PART_B } from './turkishB1SurvivalPartB';
import { TURKISH_B2_FOUNDATION_PART_A } from './turkishB2FoundationPartA';
import { TURKISH_B2_FOUNDATION_PART_B } from './turkishB2FoundationPartB';
import { TURKISH_B2_SURVIVAL_PART_A } from './turkishB2SurvivalPartA';
import { TURKISH_B2_SURVIVAL_PART_B } from './turkishB2SurvivalPartB';
import { TURKISH_C1_FOUNDATION_PART_A } from './turkishC1FoundationPartA';
import { TURKISH_C1_FOUNDATION_PART_B } from './turkishC1FoundationPartB';
import { TURKISH_C1_SURVIVAL_PART_A } from './turkishC1SurvivalPartA';
import { TURKISH_C1_SURVIVAL_PART_B } from './turkishC1SurvivalPartB';

/** الفبای ۲۹حرفی ترکی استانبولی (İstanbul Türkçesi). */
export const TURKISH_ALPHABET = [...'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'] as const;

/** مراحل ۹گانهٔ درس‌ها — هماهنگ با دوره‌های انگلیسی و روسی. */
export const TURKISH_LESSON_STAGES = [
  { id: 'situation', labelFa: 'موقعیت', labelEn: 'Situation' },
  { id: 'core-sentences', labelFa: 'جمله‌های اصلی', labelEn: 'Core Sentences' },
  { id: 'listening', labelFa: 'شنیدن', labelEn: 'Listening' },
  { id: 'shadowing', labelFa: 'سایه‌خوانی', labelEn: 'Shadowing' },
  { id: 'sentence-building', labelFa: 'ساخت جمله', labelEn: 'Sentence Building' },
  { id: 'vocabulary', labelFa: 'واژگان از جمله', labelEn: 'Vocabulary From Sentences' },
  { id: 'grammar-through-usage', labelFa: 'دستور در کاربرد', labelEn: 'Grammar Through Usage' },
  { id: 'conversation', labelFa: 'مکالمه', labelEn: 'Conversation Practice' },
  { id: 'review', labelFa: 'مرور هوشمند', labelEn: 'Spaced Review' },
] as const;

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

const FOUNDATION_RAW = [
  ...TURKISH_FOUNDATION_PART_A,
  ...TURKISH_FOUNDATION_PART_B,
] as const;

const SURVIVAL_RAW = [
  ...TURKISH_SURVIVAL_PART_A,
  ...TURKISH_SURVIVAL_PART_B,
] as const;

const EVERYDAY_A2_RAW = [
  ...TURKISH_A2_FOUNDATION_PART_A,
  ...TURKISH_A2_FOUNDATION_PART_B,
  ...TURKISH_A2_SURVIVAL_PART_A,
  ...TURKISH_A2_SURVIVAL_PART_B,
] as const;

const COMMUNICATION_B1_RAW = [
  ...TURKISH_B1_FOUNDATION_PART_A,
  ...TURKISH_B1_FOUNDATION_PART_B,
  ...TURKISH_B1_SURVIVAL_PART_A,
  ...TURKISH_B1_SURVIVAL_PART_B,
] as const;

const UPPER_INTERMEDIATE_B2_RAW = [
  ...TURKISH_B2_FOUNDATION_PART_A,
  ...TURKISH_B2_FOUNDATION_PART_B,
  ...TURKISH_B2_SURVIVAL_PART_A,
  ...TURKISH_B2_SURVIVAL_PART_B,
] as const;

const ADVANCED_COMMUNICATION_C1_RAW = [
  ...TURKISH_C1_FOUNDATION_PART_A,
  ...TURKISH_C1_FOUNDATION_PART_B,
  ...TURKISH_C1_SURVIVAL_PART_A,
  ...TURKISH_C1_SURVIVAL_PART_B,
] as const;

export const TURKISH_LEVELS: readonly TurkishCourseLevel[] = [
  {
    id: 0,
    title: 'Foundation',
    cefr: 'A1 · ساختار زبان و جمله‌سازی',
    description: 'الفبا و تلفظ حروف ویژه، ضمایر، پسوندهای شخصی و ملکی، حال استمراری، حالت‌های چهارگانهٔ اسم، توانایی، هماهنگی واکه‌ها و ترتیب کلمات در جمله',
    color: '#6555E9',
    modules: FOUNDATION_RAW.map(item => item.title),
    status: 'available',
  },
  {
    id: 1,
    title: 'Survival Turkish',
    cefr: 'A1 · مکالمه و ارتباط روزمره',
    description: 'مکالمه در موقعیت‌های واقعی روزمره: خرید، رستوران و کافه، آدرس و حمل‌ونقل، سفر و هتل، پزشک، کار و تحصیل، دعوت، ترجیح، مقایسه و گفتگوی پیوسته',
    color: '#27A1D6',
    modules: SURVIVAL_RAW.map(item => item.title),
    status: 'available',
  },
  {
    id: 2,
    title: 'Everyday Turkish',
    cefr: 'A2 · ارتباط پایه و مکالمهٔ روزمره',
    description: 'سطح کامل A2 در دو بخش Foundation و Survival: زمان‌های گذشتهٔ قطعی و نقلی، عادت، آینده، شرط، وجوبی، بازگویی گفته‌ها، خرید، سفر، سلامت، کار، مسکن و مکالمه‌های طولانی‌تر',
    color: '#19A88B',
    modules: EVERYDAY_A2_RAW.map(item => item.title),
    status: 'available',
  },
  {
    id: 3,
    title: 'Communication Turkish',
    cefr: 'B1 · ارتباط مستقل',
    description: 'سطح کامل B1 در دو بخش Foundation و Survival: زمان‌های گذشتهٔ دقیق، شرط‌های واقعی و فرضی، استدلال و مذاکره، جمله‌های موصولی، مجهول، خلاصه‌سازی، ارائهٔ کوتاه و مدیریت مستقل مکالمه در موقعیت‌های ناآشنا',
    color: '#E4A436',
    modules: COMMUNICATION_B1_RAW.map(item => item.title),
    status: 'available',
  },
  {
    id: 4,
    title: 'Advanced Turkish',
    cefr: 'B2 · ارتباط upper-intermediate',
    description: 'سطح کامل B2 در دو بخش Foundation و Survival: روایت تحلیلی رویدادها، استدلال و استنتاج، فرضیه و سناریوهای خلاف واقع، ساختارهای نحوی پیچیده، و مکالمهٔ حرفه‌ای: مناظره، مذاکره، ارائه و موقعیت‌های اجتماعی',
    color: '#9A68E8',
    modules: UPPER_INTERMEDIATE_B2_RAW.map(item => item.title),
    status: 'available',
  },
  {
    id: 5,
    title: 'Advanced Communication Turkish',
    cefr: 'C1 · ارتباط master-level',
    description: 'سطح کامل C1 در دو بخش Foundation و Survival: تحلیل انتقادی و استدلال چندوجهی، فرضیه‌های پیچیده، ساختارهای زبانی و گفتمانی پیشرفته، و مدیریت مستقل مکالمه در موقعیت‌های حرفه‌ای، اجتماعی و دانشگاهی',
    color: '#D56788',
    modules: ADVANCED_COMMUNICATION_C1_RAW.map(item => item.title),
    status: 'available',
  },
];

export const TURKISH_LESSONS: readonly TurkishCourseLesson[] = [
  ...FOUNDATION_RAW.map((lesson, idx): TurkishCourseLesson => ({
    ...lesson,
    levelId: 0,
    order: idx + 1,
  })),
  ...SURVIVAL_RAW.map((lesson, idx): TurkishCourseLesson => ({
    ...lesson,
    levelId: 1,
    order: FOUNDATION_RAW.length + idx + 1,
  })),
  ...EVERYDAY_A2_RAW.map((lesson, idx): TurkishCourseLesson => ({
    ...lesson,
    levelId: 2,
    order: FOUNDATION_RAW.length + SURVIVAL_RAW.length + idx + 1,
  })),
  ...COMMUNICATION_B1_RAW.map((lesson, idx): TurkishCourseLesson => ({
    ...lesson,
    levelId: 3,
    order: FOUNDATION_RAW.length + SURVIVAL_RAW.length + EVERYDAY_A2_RAW.length + idx + 1,
  })),
  ...UPPER_INTERMEDIATE_B2_RAW.map((lesson, idx): TurkishCourseLesson => ({
    ...lesson,
    levelId: 4,
    order: FOUNDATION_RAW.length + SURVIVAL_RAW.length + EVERYDAY_A2_RAW.length + COMMUNICATION_B1_RAW.length + idx + 1,
  })),
  ...ADVANCED_COMMUNICATION_C1_RAW.map((lesson, idx): TurkishCourseLesson => ({
    ...lesson,
    levelId: 5,
    order: FOUNDATION_RAW.length + SURVIVAL_RAW.length + EVERYDAY_A2_RAW.length + COMMUNICATION_B1_RAW.length + UPPER_INTERMEDIATE_B2_RAW.length + idx + 1,
  })),
];

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
