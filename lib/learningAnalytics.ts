import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Six local events, so product questions stop being guesses.
 *
 * Nothing leaves the device: no network call, no token, no analytics SDK. The events answer exactly
 * the questions the experience audit could not answer — where do lessons die, and who comes back.
 */
export const ANALYTICS_KEY = 'milo_learning_events_v1';
export const ANALYTICS_ENABLED_KEY = 'milo_learning_events_enabled_v1';
const MAX_EVENTS = 2000;

export type LearningEventName =
  | 'lesson_started'
  | 'stage_reached'
  | 'lesson_completed'
  | 'practice_retry'
  | 'session_abandoned'
  | 'day_returned';

export interface LearningEvent {
  name: LearningEventName;
  at: string;
  /** Course id (`en`, `ru`, …) or `app` for launch events. */
  course: string;
  lessonId?: string;
  stage?: number;
  /** Free-form, tiny payload: chunk number, retry kind, days away… */
  detail?: string;
}

let enabledCache: boolean | null = null;

export async function isAnalyticsEnabled(): Promise<boolean> {
  if (enabledCache !== null) return enabledCache;
  try {
    const raw = await AsyncStorage.getItem(ANALYTICS_ENABLED_KEY);
    enabledCache = raw === null ? true : raw === '1';
  } catch {
    enabledCache = true;
  }
  return enabledCache;
}

export async function setAnalyticsEnabled(value: boolean): Promise<void> {
  enabledCache = value;
  try { await AsyncStorage.setItem(ANALYTICS_ENABLED_KEY, value ? '1' : '0'); } catch { /* local only */ }
}

async function readAll(): Promise<LearningEvent[]> {
  try {
    const raw = await AsyncStorage.getItem(ANALYTICS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is LearningEvent => !!item && typeof item.name === 'string' && typeof item.at === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Writes are queued: two events fired in the same tick would otherwise both read the old list and
 * the second write would silently erase the first.
 */
let writeQueue: Promise<void> = Promise.resolve();

/** Fire-and-forget: analytics must never delay or break a lesson. */
export function trackEvent(name: LearningEventName, payload: Omit<LearningEvent, 'name' | 'at'>): void {
  writeQueue = writeQueue.catch(() => undefined).then(async () => {
    try {
      if (!await isAnalyticsEnabled()) return;
      const events = await readAll();
      events.push({ name, at: new Date().toISOString(), ...payload });
      await AsyncStorage.setItem(ANALYTICS_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
    } catch {
      /* Never surface analytics failures. */
    }
  });
}

/** Resolves once every queued event is on disk (used by tests and the profile card). */
export function flushAnalytics(): Promise<void> {
  return writeQueue.catch(() => undefined);
}

export interface AnalyticsSummary {
  total: number;
  counts: Record<LearningEventName, number>;
  /** Lessons started vs finished, per course. */
  funnel: Record<string, { started: number; completed: number; abandoned: number }>;
  /** Furthest stage reached per course (0-based, 11 stages). */
  furthestStage: Record<string, number>;
  /** Distinct days with at least one event. */
  activeDays: number;
  /** Returns after a gap of ≥1 day (the «did they come back» metric). */
  returns: number;
  firstEventAt: string | null;
  lastEventAt: string | null;
}

const EMPTY_COUNTS: Record<LearningEventName, number> = {
  lesson_started: 0, stage_reached: 0, lesson_completed: 0, practice_retry: 0, session_abandoned: 0, day_returned: 0,
};

export function summarize(events: readonly LearningEvent[]): AnalyticsSummary {
  const counts = { ...EMPTY_COUNTS };
  const funnel: AnalyticsSummary['funnel'] = {};
  const furthestStage: Record<string, number> = {};
  const days = new Set<string>();
  for (const event of events) {
    counts[event.name] = (counts[event.name] ?? 0) + 1;
    days.add(event.at.slice(0, 10));
    if (event.course && event.course !== 'app') {
      const row = funnel[event.course] ?? { started: 0, completed: 0, abandoned: 0 };
      if (event.name === 'lesson_started') row.started += 1;
      if (event.name === 'lesson_completed') row.completed += 1;
      if (event.name === 'session_abandoned') row.abandoned += 1;
      funnel[event.course] = row;
      if (typeof event.stage === 'number') furthestStage[event.course] = Math.max(furthestStage[event.course] ?? 0, event.stage);
    }
  }
  return {
    total: events.length,
    counts,
    funnel,
    furthestStage,
    activeDays: days.size,
    returns: counts.day_returned,
    firstEventAt: events[0]?.at ?? null,
    lastEventAt: events[events.length - 1]?.at ?? null,
  };
}

export async function loadAnalyticsSummary(): Promise<AnalyticsSummary> {
  return summarize(await readAll());
}

export async function clearAnalytics(): Promise<void> {
  try { await AsyncStorage.removeItem(ANALYTICS_KEY); } catch { /* local only */ }
}

/** Human line for the profile card: «۵ درس شروع شد، ۳ تمام شد». */
export function funnelLine(row: { started: number; completed: number; abandoned: number } | undefined): string {
  if (!row || !row.started) return 'هنوز درسی ثبت نشده';
  const finishRate = Math.round((row.completed / row.started) * 100);
  return `${row.started} شروع · ${row.completed} پایان · ${finishRate}٪ تکمیل`;
}

/** True only on native: the web preview has no reliable launch lifecycle to measure. */
export const analyticsSupported = Platform.OS !== 'web';
