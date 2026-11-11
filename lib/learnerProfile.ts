import type { CourseProgress, SentenceReviewCard } from './courseProgress';
import { getCourseProgress as getEnglishProgress } from './courseProgress';
import { COURSE_LEVELS, SENTENCE_LESSONS } from './courseContent';
import { loadStudy } from './englishStudyState';
import { loadProgress as loadEnglishVocabulary } from './langProgress';
import { LANGUAGE_REGISTRY, type LanguageId } from './languages/registry';
import { isLanguageEnabled } from './features';
import { NEW_COURSES, isNewLanguage } from './languages/newCourses';
import { RUSSIAN_LESSONS, RUSSIAN_LEVELS, russianProgress } from './languages/russian';
import { TURKISH_LESSONS, TURKISH_LEVELS, turkishProgress } from './languages/turkish';

type LessonLike = { id: string; title: string; levelId: number };
type LevelLike = { id: number; title: string; cefr: string };

export interface LevelBreakdown {
  id: number;
  title: string;
  cefr: string;
  completed: number;
  total: number;
  percent: number;
  state: 'done' | 'active' | 'locked' | 'idle';
}

export interface ReviewBreakdown {
  total: number;
  dueNow: number;
  dueToday: number;
  learning: number;   // interval < 7 days
  maturing: number;   // 7–20 days
  mastered: number;   // >= 21 days
  lapses: number;
  averageEase: number | null;
  lastReviewedAt: string | null;
}

export interface LanguageProfileStat {
  id: LanguageId;
  name: string;
  nativeName: string;
  accent: string;
  home: string;
  started: boolean;
  completedLessons: number;
  totalLessons: number;
  percent: number;
  currentLessonTitle: string | null;
  currentLevelTitle: string | null;
  currentLevelCefr: string | null;
  levels: LevelBreakdown[];
  reviews: ReviewBreakdown;
  currentStreak: number;
  longestStreak: number;
  totalMinutes: number;
  todayMinutes: number;
  dailyGoalMinutes: number;
  lastActiveDate: string | null;
  updatedAt: string | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  progress: number; // 0..1
  detail: string;
}

export interface WeekDay {
  key: string;
  weekdayShort: string;
  minutes: number;
  reviews: number;
  isToday: boolean;
}

export interface LearnerProfileSummary {
  languages: LanguageProfileStat[];
  activeLanguages: number;
  completedLessons: number;
  totalLessons: number;
  totalMinutes: number;
  todayMinutes: number;
  dailyGoalMinutes: number;
  longestStreak: number;
  currentStreak: number;
  reviewsTotal: number;
  reviewsDueNow: number;
  reviewsMastered: number;
  vocabulary: { seen: number; mastered: number; totalReviews: number; xp: number };
  week: WeekDay[];
  weekMinutes: number;
  activeDaysLast30: number;
  level: { title: string; next: string | null; progress: number; remaining: number; index: number; total: number };
  achievements: Achievement[];
}

const WEEKDAY_SHORT = ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش']; // Sunday-first to match Date#getDay

const localDateKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

type Source = { id: LanguageId; lessons: readonly LessonLike[]; levels: readonly LevelLike[]; read: () => Promise<CourseProgress> };

function sources(): Source[] {
  const list: Source[] = [
    { id: 'en', lessons: SENTENCE_LESSONS, levels: COURSE_LEVELS, read: getEnglishProgress },
    { id: 'ru', lessons: RUSSIAN_LESSONS, levels: RUSSIAN_LEVELS, read: russianProgress.getCourseProgress },
    { id: 'tr', lessons: TURKISH_LESSONS, levels: TURKISH_LEVELS, read: turkishProgress.getCourseProgress },
  ];
  for (const id of ['de', 'fr', 'es'] as const) {
    if (isNewLanguage(id)) list.push({ id, lessons: NEW_COURSES[id].lessons, levels: NEW_COURSES[id].levels, read: NEW_COURSES[id].progress.getCourseProgress });
  }
  return list.filter(item => isLanguageEnabled(item.id));
}

function summarizeReviews(cards: SentenceReviewCard[], now: Date): ReviewBreakdown {
  const endOfDay = new Date(now); endOfDay.setHours(23, 59, 59, 999);
  let dueNow = 0, dueToday = 0, learning = 0, maturing = 0, mastered = 0, lapses = 0, easeSum = 0, easeCount = 0;
  let last: string | null = null;
  for (const card of cards) {
    const due = new Date(card.dueAt).getTime();
    if (due <= now.getTime()) dueNow += 1;
    if (due <= endOfDay.getTime()) dueToday += 1;
    if (card.intervalDays >= 21) mastered += 1; else if (card.intervalDays >= 7) maturing += 1; else learning += 1;
    lapses += card.lapses || 0;
    if (Number.isFinite(card.ease)) { easeSum += card.ease; easeCount += 1; }
    if (card.lastReviewedAt && (!last || card.lastReviewedAt > last)) last = card.lastReviewedAt;
  }
  return { total: cards.length, dueNow, dueToday, learning, maturing, mastered, lapses, averageEase: easeCount ? easeSum / easeCount : null, lastReviewedAt: last };
}

function breakdownLevels(lessons: readonly LessonLike[], levels: readonly LevelLike[], completed: Set<string>, currentLessonId: string): LevelBreakdown[] {
  const currentLevel = lessons.find(lesson => lesson.id === currentLessonId)?.levelId;
  const out: LevelBreakdown[] = [];
  for (const level of levels) {
    const own = lessons.filter(lesson => lesson.levelId === level.id);
    if (!own.length) continue;
    const done = own.filter(lesson => completed.has(lesson.id)).length;
    const percent = Math.round((done / own.length) * 100);
    const state: LevelBreakdown['state'] = done === own.length ? 'done' : level.id === currentLevel || done > 0 ? 'active' : 'idle';
    out.push({ id: level.id, title: level.title, cefr: level.cefr, completed: done, total: own.length, percent, state });
  }
  return out;
}

const LEVEL_STEPS: Array<[number, string]> = [[0, 'تازه‌کار'], [5, 'نوآموز'], [15, 'پیگیر'], [40, 'مستمر'], [80, 'حرفه‌ای'], [150, 'استاد']];

/** Learner rank derived from finished lessons across every language (motivational, not a certificate). */
export function learnerLevel(completedLessons: number): LearnerProfileSummary['level'] {
  let index = 0;
  for (let i = 0; i < LEVEL_STEPS.length; i++) if (completedLessons >= LEVEL_STEPS[i][0]) index = i;
  const next = LEVEL_STEPS[index + 1];
  const start = LEVEL_STEPS[index][0];
  const progress = next ? Math.min(1, (completedLessons - start) / (next[0] - start)) : 1;
  return { title: LEVEL_STEPS[index][1], next: next ? next[1] : null, progress, remaining: next ? Math.max(0, next[0] - completedLessons) : 0, index, total: LEVEL_STEPS.length };
}

function buildAchievements(s: Omit<LearnerProfileSummary, 'achievements'>): Achievement[] {
  const make = (id: string, title: string, description: string, value: number, target: number, unit: string): Achievement => ({
    id, title, description, earned: value >= target, progress: Math.min(1, target ? value / target : 1), detail: `${Math.min(value, target)} از ${target} ${unit}`,
  });
  return [
    make('first-lesson', 'اولین قدم', 'نخستین درس را تمام کردید', s.completedLessons, 1, 'درس'),
    make('ten-lessons', 'ده‌تایی', 'ده درس را کامل کردید', s.completedLessons, 10, 'درس'),
    make('fifty-lessons', 'نیم‌قرن', 'پنجاه درس را کامل کردید', s.completedLessons, 50, 'درس'),
    make('streak-7', 'یک هفته پیاپی', 'هفت روز پشت‌سرهم تمرین کردید', s.longestStreak, 7, 'روز'),
    make('streak-30', 'یک ماه پیاپی', 'سی روز پشت‌سرهم تمرین کردید', s.longestStreak, 30, 'روز'),
    make('hours-5', 'پنج ساعت تمرین', 'پنج ساعت یادگیری ثبت شد', s.totalMinutes, 300, 'دقیقه'),
    make('hours-25', 'بیست‌وپنج ساعت', 'بیست‌وپنج ساعت یادگیری ثبت شد', s.totalMinutes, 1500, 'دقیقه'),
    make('review-50', 'مرورگر', 'پنجاه کارت مرور فعال دارید', s.reviewsTotal, 50, 'کارت'),
    make('mastered-25', 'حافظهٔ بلندمدت', 'بیست‌وپنج جمله به حافظهٔ بلندمدت رسید', s.reviewsMastered, 25, 'جمله'),
    make('polyglot-2', 'دوزبانه', 'در دو زبان پیشرفت ثبت شد', s.activeLanguages, 2, 'زبان'),
    make('polyglot-3', 'چندزبانه', 'در سه زبان پیشرفت ثبت شد', s.activeLanguages, 3, 'زبان'),
    make('words-100', 'صد واژه', 'صد واژهٔ انگلیسی را دیده‌اید', s.vocabulary.seen, 100, 'واژه'),
  ];
}

export async function loadLearnerProfileSummary(now = new Date()): Promise<LearnerProfileSummary> {
  const languages: LanguageProfileStat[] = [];
  const today = localDateKey(now);
  for (const item of sources()) {
    const entry = LANGUAGE_REGISTRY.find(language => language.id === item.id);
    if (!entry) continue;
    let progress: CourseProgress | null = null;
    try { progress = await item.read(); } catch { progress = null; }
    const completed = new Set(progress?.completedLessonIds ?? []);
    const currentLesson = item.lessons.find(lesson => lesson.id === progress?.currentLessonId) ?? null;
    const currentLevel = currentLesson ? item.levels.find(level => level.id === currentLesson.levelId) ?? null : null;
    const reviews = summarizeReviews(progress?.reviewCards ?? [], now);
    const totalMinutes = progress?.totalMinutes ?? 0;
    const started = completed.size > 0 || totalMinutes > 0 || reviews.total > 0 || !!progress?.lastActiveDate;
    languages.push({
      id: item.id,
      name: entry.name,
      nativeName: entry.nativeName,
      accent: entry.accent,
      home: entry.home,
      started,
      completedLessons: completed.size,
      totalLessons: item.lessons.length,
      percent: item.lessons.length ? Math.round((completed.size / item.lessons.length) * 100) : 0,
      currentLessonTitle: currentLesson?.title ?? null,
      currentLevelTitle: currentLevel?.title ?? null,
      currentLevelCefr: currentLevel?.cefr ?? null,
      levels: breakdownLevels(item.lessons, item.levels, completed, progress?.currentLessonId ?? ''),
      reviews,
      currentStreak: progress?.currentStreak ?? 0,
      longestStreak: progress?.longestStreak ?? 0,
      totalMinutes,
      todayMinutes: progress?.activityDate === today ? progress?.todayMinutes ?? 0 : 0,
      dailyGoalMinutes: progress?.dailyGoalMinutes ?? 10,
      lastActiveDate: progress?.lastActiveDate ?? null,
      updatedAt: progress?.updatedAt ?? null,
    });
  }

  // Week + 30-day activity: English measured study time plus vocabulary reviews per day.
  let studyDays: Record<string, number> = {};
  let vocab = { seen: 0, mastered: 0, totalReviews: 0, xp: 0 };
  let daily: Record<string, { reviewed: number; xp: number }> = {};
  try { studyDays = (await loadStudy()).days; } catch { studyDays = {}; }
  try {
    const p = await loadEnglishVocabulary();
    daily = p.daily;
    let seen = 0, mastered = 0;
    for (const v of Object.values(p.mastery)) { if (v >= 1) seen += 1; if (v >= 2) mastered += 1; }
    vocab = { seen, mastered, totalReviews: p.totalReviews, xp: p.xp };
  } catch { /* vocabulary store unavailable */ }

  const week: WeekDay[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const key = localDateKey(d);
    const minutes = Math.round((studyDays[key] ?? 0) / 60000) + (i === 0 ? languages.filter(l => l.id !== 'en').reduce((sum, l) => sum + l.todayMinutes, 0) : 0);
    week.push({ key, weekdayShort: WEEKDAY_SHORT[d.getDay()], minutes, reviews: daily[key]?.reviewed ?? 0, isToday: i === 0 });
  }
  const activeKeys = new Set<string>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const key = localDateKey(d);
    if ((studyDays[key] ?? 0) > 0 || (daily[key]?.reviewed ?? 0) > 0 || languages.some(l => l.lastActiveDate === key)) activeKeys.add(key);
  }

  const completedLessons = languages.reduce((sum, item) => sum + item.completedLessons, 0);
  const base: Omit<LearnerProfileSummary, 'achievements'> = {
    languages,
    activeLanguages: languages.filter(item => item.started).length,
    completedLessons,
    totalLessons: languages.reduce((sum, item) => sum + item.totalLessons, 0),
    totalMinutes: languages.reduce((sum, item) => sum + item.totalMinutes, 0),
    todayMinutes: languages.reduce((sum, item) => sum + item.todayMinutes, 0),
    dailyGoalMinutes: languages.reduce((max, item) => Math.max(max, item.started ? item.dailyGoalMinutes : 0), 0) || 10,
    longestStreak: languages.reduce((max, item) => Math.max(max, item.longestStreak), 0),
    currentStreak: languages.reduce((max, item) => Math.max(max, item.currentStreak), 0),
    reviewsTotal: languages.reduce((sum, item) => sum + item.reviews.total, 0),
    reviewsDueNow: languages.reduce((sum, item) => sum + item.reviews.dueNow, 0),
    reviewsMastered: languages.reduce((sum, item) => sum + item.reviews.mastered, 0),
    vocabulary: vocab,
    week,
    weekMinutes: week.reduce((sum, day) => sum + day.minutes, 0),
    activeDaysLast30: activeKeys.size,
    level: learnerLevel(completedLessons),
  };
  return { ...base, achievements: buildAchievements(base) };
}

/** Two-letter monogram for the avatar, Persian or Latin. */
export function nameInitials(fullName: string, email = ''): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`;
  if (parts.length === 1) return parts[0].slice(0, 2);
  return (email.trim()[0] || '؟').toUpperCase();
}
