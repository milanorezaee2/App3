import type { LanguageDefinition } from './types';
import { SENTENCE_LESSONS } from '../courseContent';
import { RUSSIAN_LESSONS, russianProgress } from './russian';

export const LANGUAGES: readonly LanguageDefinition[] = [
  { id: 'en', name: 'انگلیسی', nativeName: 'English', speechLocale: 'en-US', accent: '#6356d9', lessonsCount: SENTENCE_LESSONS.length, description: 'جمله‌های کاربردی، کارگاه تلفظ، مرور و مجموعه ۵۰۴', status: 'available', home: '/lang' },
  { id: 'ru', name: 'روسی', nativeName: 'Русский', speechLocale: 'ru-RU', accent: '#4267a8', lessonsCount: RUSSIAN_LESSONS.length, description: 'مسیر آغازین مستقل با خط سیریلیک، جمله‌های کاربردی و مرور محلی', status: 'starter', home: '/learn/ru' },
];
export { russianProgress };
export function findLanguage(id: string | undefined) { return LANGUAGES.find(l => l.id === id); }
