import { RUSSIAN_LESSONS } from '@/lib/languages/russian';
import { TURKISH_LESSONS } from '@/lib/languages/turkish';
import { NEW_COURSES } from '@/lib/languages/newCourses';
import { SENTENCE_LESSONS } from '@/lib/courseContent';
import { auditLessonsFromEnglish, auditLessonsFromLearning } from '@/lib/content/courseAudit';
import type { AuditLesson, CourseLanguage } from '@/lib/content/readiness';
import type { LearningLesson } from '@/lib/languages/types';

type L = ReadonlyArray<LearningLesson & { levelId: number }>;
export function lessonsOf(language: CourseLanguage): AuditLesson[] {
  switch (language) {
    case 'en': return auditLessonsFromEnglish(SENTENCE_LESSONS);
    case 'ru': return auditLessonsFromLearning(RUSSIAN_LESSONS as L);
    case 'tr': return auditLessonsFromLearning(TURKISH_LESSONS as L);
    default: return auditLessonsFromLearning(NEW_COURSES[language].lessons as L);
  }
}
export const LANGUAGES: CourseLanguage[] = ['en', 'tr', 'ru', 'de', 'fr', 'es'];
