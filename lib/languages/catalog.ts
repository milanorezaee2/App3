import type { LanguageDefinition } from './types';

// Keep this registry deliberately data-only. Importing full English, Russian and
// Turkish curricula here made the first language-selection screen parse thousands
// of lesson records before the learner could even sign in. Course data is loaded
// only by its own route after a language is selected.
export const LANGUAGES: readonly LanguageDefinition[] = [
  { id: 'en', name: 'انگلیسی', nativeName: 'English', speechLocale: 'en-US', accent: '#6356d9', lessonsCount: 237, description: 'جمله‌های کاربردی، کارگاه تلفظ، مرور و مجموعه ۵۰۴', status: 'available', home: '/lang' },
  { id: 'ru', name: 'روسی', nativeName: 'Русский', speechLocale: 'ru-RU', accent: '#4267a8', lessonsCount: 129, description: 'مسیر آغازین مستقل با خط سیریلیک، جمله‌های کاربردی و مرور محلی', status: 'starter', home: '/learn/ru' },
  { id: 'tr', name: 'ترکی استانبولی', nativeName: 'İstanbul Türkçesi', speechLocale: 'tr-TR', accent: '#C94F62', lessonsCount: 329, description: 'مسیر مستقل Pre-A1 تا C1 ترکی استانبولی با جمله‌های بومی، هماهنگی واکه‌ها و مرور محلی', status: 'starter', home: '/learn/tr' },
];

export function findLanguage(id: string | undefined) {
  return LANGUAGES.find(language => language.id === id);
}
