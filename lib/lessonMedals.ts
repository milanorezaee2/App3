import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadLearnerProfileSummary } from './learnerProfile';

/**
 * Medals that appear at the exact moment a lesson is finished.
 *
 * The profile already lists twelve achievements, but nothing announces them where the learner
 * actually is: the end-of-lesson card. This module evaluates those same milestones and reports only
 * the ones that became true with *this* lesson, so the card can celebrate them once.
 */
const SEEN_KEY = 'milo_medals_seen_v1';

export interface MedalProgress {
  completedLessons: number;
  longestStreak: number;
  totalMinutes: number;
  reviewsTotal: number;
  reviewsMastered: number;
  activeLanguages: number;
  vocabularySeen: number;
}

export interface Medal {
  id: string;
  title: string;
  description: string;
  target: number;
  value: number;
}

const MEDALS: ReadonlyArray<{ id: string; title: string; description: string; target: number; pick: (p: MedalProgress) => number }> = [
  { id: 'first-lesson', title: 'اولین قدم', description: 'نخستین درس را تمام کردی', target: 1, pick: p => p.completedLessons },
  { id: 'ten-lessons', title: 'ده‌تایی', description: 'ده درس کامل شد', target: 10, pick: p => p.completedLessons },
  { id: 'fifty-lessons', title: 'نیم‌قرن', description: 'پنجاه درس کامل شد', target: 50, pick: p => p.completedLessons },
  { id: 'streak-7', title: 'یک هفته پیاپی', description: 'هفت روز پشت‌سرهم تمرین', target: 7, pick: p => p.longestStreak },
  { id: 'streak-30', title: 'یک ماه پیاپی', description: 'سی روز پشت‌سرهم تمرین', target: 30, pick: p => p.longestStreak },
  { id: 'hours-5', title: 'پنج ساعت تمرین', description: 'پنج ساعت یادگیری ثبت شد', target: 300, pick: p => p.totalMinutes },
  { id: 'hours-25', title: 'بیست‌وپنج ساعت', description: 'بیست‌وپنج ساعت یادگیری ثبت شد', target: 1500, pick: p => p.totalMinutes },
  { id: 'review-50', title: 'مرورگر', description: 'پنجاه کارت مرور فعال شد', target: 50, pick: p => p.reviewsTotal },
  { id: 'mastered-25', title: 'حافظهٔ بلندمدت', description: 'بیست‌وپنج جمله به حافظهٔ بلندمدت رسید', target: 25, pick: p => p.reviewsMastered },
  { id: 'polyglot-2', title: 'دوزبانه', description: 'در دو زبان پیشرفت ثبت شد', target: 2, pick: p => p.activeLanguages },
  { id: 'polyglot-3', title: 'چندزبانه', description: 'در سه زبان پیشرفت ثبت شد', target: 3, pick: p => p.activeLanguages },
  { id: 'words-100', title: 'صد واژه', description: 'صد واژه دیده شد', target: 100, pick: p => p.vocabularySeen },
];

/** Current medal values, read from the same profile summary the profile tab already uses. */
export async function loadMedalProgress(): Promise<Medal[]> {
  try {
    const summary = await loadLearnerProfileSummary();
    return evaluateMedals({
      completedLessons: summary.completedLessons,
      longestStreak: summary.longestStreak,
      totalMinutes: summary.totalMinutes,
      reviewsTotal: summary.reviewsTotal,
      reviewsMastered: summary.reviewsMastered,
      activeLanguages: summary.activeLanguages,
      vocabularySeen: summary.vocabulary.seen,
    });
  } catch {
    return [];
  }
}

export function evaluateMedals(progress: MedalProgress): Medal[] {
  return MEDALS.map(medal => ({ id: medal.id, title: medal.title, description: medal.description, target: medal.target, value: medal.pick(progress) }));
}

export async function loadSeenMedals(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(SEEN_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

async function saveSeenMedals(ids: readonly string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(SEEN_KEY, JSON.stringify([...new Set(ids)]));
  } catch {
    /* Cosmetic state only. */
  }
}

/**
 * Medals earned by this lesson. `before` is the profile snapshot taken when the lesson opened (or the
 * previous end-of-lesson snapshot), so re-opening the same lesson never re-congratulates.
 */
export function medalsEarnedNow(before: readonly string[], after: readonly Medal[]): Medal[] {
  const seen = new Set(before);
  return after.filter(medal => medal.value >= medal.target && !seen.has(medal.id));
}

export async function claimMedals(medals: readonly Medal[], seen: readonly string[]): Promise<void> {
  if (!medals.length) return;
  await saveSeenMedals([...seen, ...medals.map(medal => medal.id)]);
}
