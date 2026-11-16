import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { localDayKey } from './studyReminder';
import { summarize, trackEvent, loadAnalyticsSummary, type AnalyticsSummary } from './learningAnalytics';

/**
 * Turns the six raw events into the two answers that matter:
 *  - «روز برگشت» — the learner opened the app on a later day than the last one they studied,
 *  - «جلسهٔ نیمه‌کاره» — a lesson was started, then left before it finished.
 */
const LAST_SEEN_KEY = 'milo_analytics_last_seen_v1';
const SESSION_KEY = 'milo_analytics_session_v1';

let wired = false;

/** One-time wiring; safe to call from every mount point. */
export function initAnalytics(): void {
  if (wired) return;
  wired = true;
  void (async () => {
    try {
      const today = localDayKey();
      const raw = await AsyncStorage.getItem(LAST_SEEN_KEY);
      const previous = raw ? (JSON.parse(raw) as { day?: string }) : null;
      if (previous?.day && previous.day < today) {
        trackEvent('day_returned', { course: 'app', detail: previous.day });
      }
      await AsyncStorage.setItem(LAST_SEEN_KEY, JSON.stringify({ day: today }));
    } catch {
      /* Launch bookkeeping is best effort. */
    }
  })();
}

interface SessionMarker {
  course: string;
  lessonId: string;
  stage: number;
  startedAt: string;
}

export function trackLessonStarted(course: string, lessonId: string): void {
  trackEvent('lesson_started', { course, lessonId });
  void AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ course, lessonId, stage: 0, startedAt: new Date().toISOString() })).catch(() => undefined);
}

export function trackStageReached(course: string, lessonId: string, stage: number): void {
  trackEvent('stage_reached', { course, lessonId, stage });
  void AsyncStorage.getItem(SESSION_KEY)
    .then(raw => {
      const current = raw ? JSON.parse(raw) as SessionMarker : null;
      if (!current || current.lessonId !== lessonId) return undefined;
      return AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ ...current, stage }));
    })
    .catch(() => undefined);
}

export function trackLessonCompleted(course: string, lessonId: string): void {
  trackEvent('lesson_completed', { course, lessonId });
  void AsyncStorage.removeItem(SESSION_KEY).catch(() => undefined);
}

export function trackPracticeRetry(course: string, lessonId: string, kind: string): void {
  trackEvent('practice_retry', { course, lessonId, detail: kind });
}

/**
 * Called when the app goes to the background or a lesson screen unmounts. A lesson abandoned at
 * stage 0–1 is counted too: it is the honest signal that the learner never got going.
 */
export function markSessionAbandoned(): void {
  void (async () => {
    try {
      const raw = await AsyncStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const current = JSON.parse(raw) as SessionMarker;
      trackEvent('session_abandoned', { course: current.course, lessonId: current.lessonId, stage: current.stage });
      await AsyncStorage.removeItem(SESSION_KEY);
    } catch {
      /* best effort */
    }
  })();
}

/** Background → abandonment; used once from the root layout. */
export function watchAppStateForAbandonment(): () => void {
  const subscription = AppState.addEventListener('change', state => { if (state === 'background') markSessionAbandoned(); });
  return () => subscription.remove();
}

export async function analyticsForProfile(): Promise<AnalyticsSummary> {
  return loadAnalyticsSummary();
}

export { summarize };
