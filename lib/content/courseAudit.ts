import { computeReadiness, type AuditLesson, type CourseLanguage, type CourseReadiness } from '@/lib/content/readiness';
import type { LearningLesson } from '@/lib/languages/types';
import type { SentenceLesson } from '@/lib/courseContent';
import en from '@/lib/content/frequency/en.json';
import de from '@/lib/content/frequency/de.json';
import fr from '@/lib/content/frequency/fr.json';
import es from '@/lib/content/frequency/es.json';
import ru from '@/lib/content/frequency/ru.json';
import tr from '@/lib/content/frequency/tr.json';

/** Top-8000 frequency words per language (wordfreq); bundled so readiness works offline. */
export const FREQUENCY: Record<CourseLanguage, readonly string[]> = { en, de, fr, es, ru, tr };

/** Adapter for Russian / Turkish / German / French / Spanish lesson records. */
export function auditLessonsFromLearning(lessons: ReadonlyArray<LearningLesson & { levelId: number }>): AuditLesson[] {
  return lessons.map(lesson => ({
    id: lesson.id, levelId: lesson.levelId, title: lesson.title,
    sentences: lesson.sentences.map(s => ({ text: s.text, pattern: s.pattern })),
    hasDialogue: (lesson.dialogue?.length ?? 0) > 0, checks: lesson.checks?.length ?? 0,
  }));
}

/** Adapter for the English course. */
export function auditLessonsFromEnglish(lessons: readonly SentenceLesson[]): AuditLesson[] {
  return lessons.map(lesson => ({
    id: lesson.id, levelId: lesson.levelId, title: lesson.title,
    sentences: lesson.sentences.map(s => ({ text: s.en, pattern: s.pattern })),
    hasDialogue: (lesson.dialogue?.length ?? 0) > 0, checks: (lesson as { checks?: unknown[] }).checks?.length ?? 0,
  }));
}

const cache = new Map<string, CourseReadiness>();
/** Memoised readiness: lesson data is static per build, so each course is computed once. */
export function courseReadiness(language: CourseLanguage, lessons: readonly AuditLesson[]): CourseReadiness {
  const key = `${language}:${lessons.length}`;
  let value = cache.get(key);
  if (!value) { value = computeReadiness(language, lessons, FREQUENCY[language]); cache.set(key, value); }
  return value;
}
