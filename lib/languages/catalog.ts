import type { LanguageDefinition } from './types';
import { SENTENCE_LESSONS } from '../courseContent';
import { RUSSIAN_LESSONS, russianProgress } from './russian';
import { TURKISH_LESSONS, turkishProgress } from './turkish';
import { NEW_COURSES } from './newCourses';

export const LANGUAGES: readonly LanguageDefinition[] = [
  { id: 'en', name: 'انگلیسی', nativeName: 'English', speechLocale: 'en-US', accent: '#6356d9', lessonsCount: SENTENCE_LESSONS.length, description: 'جمله‌های کاربردی، کارگاه تلفظ، مرور و مجموعه ۵۰۴', status: 'available', home: '/lang' },
  { id: 'ru', name: 'روسی', nativeName: 'Русский', speechLocale: 'ru-RU', accent: '#4267a8', lessonsCount: RUSSIAN_LESSONS.length, description: 'مسیر آغازین مستقل با خط سیریلیک، جمله‌های کاربردی و مرور محلی', status: 'starter', home: '/learn/ru' },
  { id: 'tr', name: 'ترکی استانبولی', nativeName: 'İstanbul Türkçesi', speechLocale: 'tr-TR', accent: '#C94F62', lessonsCount: TURKISH_LESSONS.length, description: 'مسیر مستقل Pre-A1 تا C1 ترکی استانبولی با جمله‌های بومی، هماهنگی واکه‌ها و مرور محلی', status: 'starter', home: '/learn/tr' },
  { id: 'de', name: 'آلمانی', nativeName: 'Deutsch', speechLocale: 'de-DE', accent: '#6555E9', lessonsCount: NEW_COURSES.de.lessons.length, description: 'ده درس Pre-A1', status: 'starter', home: '/learn/de' },
  { id: 'fr', name: 'فرانسوی', nativeName: 'Français', speechLocale: 'fr-FR', accent: '#6555E9', lessonsCount: NEW_COURSES.fr.lessons.length, description: 'ده درس Pre-A1', status: 'starter', home: '/learn/fr' },
  { id: 'es', name: 'اسپانیایی', nativeName: 'Español', speechLocale: 'es-ES', accent: '#6555E9', lessonsCount: NEW_COURSES.es.lessons.length, description: 'ده درس Pre-A1، گونهٔ اسپانیا', status: 'starter', home: '/learn/es' },
];
export { russianProgress, turkishProgress };
export function findLanguage(id: string | undefined) { return LANGUAGES.find(l => l.id === id); }
