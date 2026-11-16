import { RUSSIAN_LESSONS } from '@/lib/languages/russian';
import { TURKISH_LESSONS } from '@/lib/languages/turkish';
import { NEW_COURSES } from '@/lib/languages/newCourses';
import { SENTENCE_LESSONS } from '@/lib/courseContent';
import type { LearningLesson } from '@/lib/languages/types';
import { auditLessonsFromEnglish, auditLessonsFromLearning, courseReadiness } from '@/lib/content/courseAudit';
import type { CourseLanguage, CourseReadiness } from '@/lib/content/readiness';

/** Readiness of every shipped course (admin reports, gap reports). Heavy import — use only where all courses are needed. */
export const COURSE_LANGUAGES: readonly CourseLanguage[] = ['en', 'tr', 'ru', 'de', 'fr', 'es'];
export const COURSE_NAMES_FA: Record<CourseLanguage, string> = { en: 'انگلیسی', tr: 'ترکی', ru: 'روسی', de: 'آلمانی', fr: 'فرانسوی', es: 'اسپانیایی' };

export function allCourseReadiness(): Record<CourseLanguage, CourseReadiness> {
  return {
    en: courseReadiness('en', auditLessonsFromEnglish(SENTENCE_LESSONS)),
    ru: courseReadiness('ru', auditLessonsFromLearning(RUSSIAN_LESSONS as ReadonlyArray<LearningLesson & { levelId: number }>)),
    tr: courseReadiness('tr', auditLessonsFromLearning(TURKISH_LESSONS as ReadonlyArray<LearningLesson & { levelId: number }>)),
    de: courseReadiness('de', auditLessonsFromLearning(NEW_COURSES.de.lessons as ReadonlyArray<LearningLesson & { levelId: number }>)),
    fr: courseReadiness('fr', auditLessonsFromLearning(NEW_COURSES.fr.lessons as ReadonlyArray<LearningLesson & { levelId: number }>)),
    es: courseReadiness('es', auditLessonsFromLearning(NEW_COURSES.es.lessons as ReadonlyArray<LearningLesson & { levelId: number }>)),
  };
}
