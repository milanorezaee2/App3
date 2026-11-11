import type { CourseProgress } from './courseProgress';
import { getCourseProgress as getEnglishProgress } from './courseProgress';
import { SENTENCE_LESSONS } from './courseContent';
import { LANGUAGE_REGISTRY, type LanguageId } from './languages/registry';
import { isLanguageEnabled } from './features';
import { NEW_COURSES, isNewLanguage } from './languages/newCourses';
import { russianProgress } from './languages/russian';
import { turkishProgress } from './languages/turkish';
import { RUSSIAN_LESSONS } from './languages/russian';
import { TURKISH_LESSONS } from './languages/turkish';

export interface LanguageProfileStat {
  id: LanguageId;
  name: string;
  nativeName: string;
  accent: string;
  home: string;
  completedLessons: number;
  totalLessons: number;
  percent: number;
  currentStreak: number;
  longestStreak: number;
  totalMinutes: number;
  reviewCards: number;
  lastActiveDate: string | null;
}

export interface LearnerProfileSummary {
  languages: LanguageProfileStat[];
  /** Languages the learner has actually started. */
  activeLanguages: number;
  completedLessons: number;
  totalMinutes: number;
  longestStreak: number;
  currentStreak: number;
  reviewCards: number;
  level: { title: string; next: string | null; progress: number };
}

function readers(): Array<{ id: LanguageId; total: number; read: () => Promise<CourseProgress> }> {
  const list: Array<{ id: LanguageId; total: number; read: () => Promise<CourseProgress> }> = [
    { id: 'en', total: SENTENCE_LESSONS.length, read: getEnglishProgress },
    { id: 'ru', total: RUSSIAN_LESSONS.length, read: russianProgress.getCourseProgress },
    { id: 'tr', total: TURKISH_LESSONS.length, read: turkishProgress.getCourseProgress },
  ];
  for (const id of ['de', 'fr', 'es'] as const) {
    if (isNewLanguage(id)) list.push({ id, total: NEW_COURSES[id].lessons.length, read: NEW_COURSES[id].progress.getCourseProgress });
  }
  return list.filter(item => isLanguageEnabled(item.id));
}

/** Learner rank derived from finished lessons across every language (motivational, not a certificate). */
export function learnerLevel(completedLessons: number): LearnerProfileSummary['level'] {
  const steps: Array<[number, string]> = [[0, 'تازه‌کار'], [5, 'نوآموز'], [15, 'پیگیر'], [40, 'مستمر'], [80, 'حرفه‌ای'], [150, 'استاد']];
  let index = 0;
  for (let i = 0; i < steps.length; i++) if (completedLessons >= steps[i][0]) index = i;
  const next = steps[index + 1];
  const start = steps[index][0];
  const progress = next ? Math.min(1, (completedLessons - start) / (next[0] - start)) : 1;
  return { title: steps[index][1], next: next ? next[1] : null, progress };
}

export async function loadLearnerProfileSummary(): Promise<LearnerProfileSummary> {
  const languages: LanguageProfileStat[] = [];
  for (const item of readers()) {
    const entry = LANGUAGE_REGISTRY.find(language => language.id === item.id);
    if (!entry) continue;
    let progress: CourseProgress | null = null;
    try { progress = await item.read(); } catch { progress = null; }
    const completed = progress?.completedLessonIds.length ?? 0;
    languages.push({
      id: item.id,
      name: entry.name,
      nativeName: entry.nativeName,
      accent: entry.accent,
      home: entry.home,
      completedLessons: completed,
      totalLessons: item.total,
      percent: item.total ? Math.round((completed / item.total) * 100) : 0,
      currentStreak: progress?.currentStreak ?? 0,
      longestStreak: progress?.longestStreak ?? 0,
      totalMinutes: progress?.totalMinutes ?? 0,
      reviewCards: progress?.reviewCards.length ?? 0,
      lastActiveDate: progress?.lastActiveDate ?? null,
    });
  }
  const completedLessons = languages.reduce((sum, item) => sum + item.completedLessons, 0);
  return {
    languages,
    activeLanguages: languages.filter(item => item.completedLessons > 0 || item.totalMinutes > 0 || item.reviewCards > 0).length,
    completedLessons,
    totalMinutes: languages.reduce((sum, item) => sum + item.totalMinutes, 0),
    longestStreak: languages.reduce((max, item) => Math.max(max, item.longestStreak), 0),
    currentStreak: languages.reduce((max, item) => Math.max(max, item.currentStreak), 0),
    reviewCards: languages.reduce((sum, item) => sum + item.reviewCards, 0),
    level: learnerLevel(completedLessons),
  };
}

/** Two-letter monogram for the avatar, Persian or Latin. */
export function nameInitials(fullName: string, email = ''): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`;
  if (parts.length === 1) return parts[0].slice(0, 2);
  return (email.trim()[0] || '؟').toUpperCase();
}
