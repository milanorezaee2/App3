import type { LanguageDefinition } from './types';
import { SENTENCE_LESSONS } from '../courseContent';
import { RUSSIAN_LESSONS, russianProgress } from './russian';
import { TURKISH_LESSONS, turkishProgress } from './turkish';
import { NEW_COURSES } from './newCourses';
import { LANGUAGE_REGISTRY, STARTS_FROM_ZERO } from './registry';

/**
 * Lesson totals per language. Content modules are imported here rather than in
 * the registry so the registry stays free of course data (and of import cycles).
 * A language without an entry simply reports 0 lessons until its course lands.
 */
const STARTER_COURSE_TOTALS: Record<string, number> = Object.fromEntries(
  Object.entries(NEW_COURSES).map(([id, course]) => [id, course.lessons.length]),
);

const LESSON_TOTALS: Record<string, number> = {
  en: SENTENCE_LESSONS.length,
  ru: RUSSIAN_LESSONS.length,
  tr: TURKISH_LESSONS.length,
  ...STARTER_COURSE_TOTALS,
};

export const LANGUAGES: readonly LanguageDefinition[] = LANGUAGE_REGISTRY.map(entry => ({
  ...entry,
  lessonsCount: LESSON_TOTALS[entry.id] ?? 0,
  startsFromZero: STARTS_FROM_ZERO.has(entry.id),
}));

export { russianProgress, turkishProgress };
export function findLanguage(id: string | undefined) { return LANGUAGES.find(l => l.id === id); }
