import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Results of the two optional closing stages (speaking check, short assessment), kept per lesson so
 * they feed the celebration sheet and the spaced-repetition deck instead of vanishing. Local only,
 * best-effort: a failed write never blocks finishing a lesson.
 */
export interface SpeakingOutcome { average: number; scores: Record<string, number>; at: string }
export interface AssessmentOutcome { correct: number; total: number; at: string }
export interface LessonOutcome { speaking?: SpeakingOutcome; assessment?: AssessmentOutcome }

const KEY = 'milo_lesson_outcomes_v1';
/** Sentences spoken below this score go to the review deck. */
export const WEAK_SPEAKING_SCORE = 60;

type Store = Record<string, LessonOutcome>;

async function readAll(): Promise<Store> {
  try {
    const raw = Platform.OS === 'web' ? window.localStorage.getItem(KEY) : await AsyncStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) as unknown : null;
    return parsed && typeof parsed === 'object' ? parsed as Store : {};
  } catch { return {}; }
}
async function writeAll(store: Store): Promise<void> {
  const raw = JSON.stringify(store);
  if (Platform.OS === 'web') window.localStorage.setItem(KEY, raw); else await AsyncStorage.setItem(KEY, raw);
}

const keyOf = (course: string, lessonId: string) => `${course}:${lessonId}`;

export async function getLessonOutcome(course: string, lessonId: string): Promise<LessonOutcome | null> {
  const all = await readAll();
  return all[keyOf(course, lessonId)] ?? null;
}

export async function saveLessonOutcome(course: string, lessonId: string, patch: Partial<LessonOutcome>): Promise<void> {
  try {
    const all = await readAll();
    const key = keyOf(course, lessonId);
    all[key] = { ...(all[key] ?? {}), ...patch };
    // Keep the store bounded: newest 400 lessons.
    const keys = Object.keys(all);
    if (keys.length > 400) for (const stale of keys.slice(0, keys.length - 400)) delete all[stale];
    await writeAll(all);
  } catch { /* best-effort */ }
}

/** Sentence ids whose speaking score is below the weak threshold. */
export const weakSpokenSentences = (speaking: SpeakingOutcome | undefined | null): string[] =>
  speaking ? Object.entries(speaking.scores).filter(([, score]) => score < WEAK_SPEAKING_SCORE).map(([id]) => id) : [];
