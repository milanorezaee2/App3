import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Long lessons, cut into reachable pieces.
 *
 * The English course ships 64 lessons with 40–50 sentences (about 35 minutes each) right next to
 * 8-sentence lessons. Instead of rewriting that content, a long lesson is walked in fixed chunks so
 * the learner always sees «بخش ۲ از ۵» and can stop with a win instead of abandoning halfway.
 */
export const CHUNK_SIZE = 10;
/** Lessons at or below this length behave exactly as before. */
export const CHUNK_THRESHOLD = 12;

const DONE_KEY = 'milo_lesson_chunks_done_v1';

export interface LessonChunks {
  total: number;
  /** 1-based index of the chunk the learner is on. */
  current: number;
  size: number;
  /** True when this lesson is long enough to be chunked. */
  chunked: boolean;
  start: number;
  end: number;
}

export function lessonChunks(lessonId: string, sentenceCount: number, completedChunks: readonly number[] = []): LessonChunks {
  if (sentenceCount <= CHUNK_THRESHOLD) {
    return { total: 1, current: 1, size: sentenceCount, chunked: false, start: 0, end: sentenceCount };
  }
  const total = Math.ceil(sentenceCount / CHUNK_SIZE);
  for (let index = 1; index <= total; index++) {
    if (!completedChunks.includes(index)) {
      return { total, current: index, size: CHUNK_SIZE, chunked: true, start: (index - 1) * CHUNK_SIZE, end: Math.min(sentenceCount, index * CHUNK_SIZE) };
    }
  }
  // Every chunk is done: reopen the last one rather than pretend there is a sixth.
  return { total, current: total, size: CHUNK_SIZE, chunked: true, start: (total - 1) * CHUNK_SIZE, end: sentenceCount };
}

export async function loadCompletedChunks(lessonId: string): Promise<number[]> {
  try {
    const raw = await AsyncStorage.getItem(DONE_KEY);
    const parsed = raw ? JSON.parse(raw) as Record<string, unknown> : {};
    const value = parsed[lessonId];
    return Array.isArray(value) ? value.filter((item): item is number => typeof item === 'number' && Number.isInteger(item) && item > 0) : [];
  } catch {
    return [];
  }
}

export async function markChunkDone(lessonId: string, chunk: number): Promise<number[]> {
  const current = await loadCompletedChunks(lessonId);
  const next = [...new Set([...current, chunk])].sort((a, b) => a - b);
  try {
    const raw = await AsyncStorage.getItem(DONE_KEY);
    const parsed = raw ? JSON.parse(raw) as Record<string, unknown> : {};
    await AsyncStorage.setItem(DONE_KEY, JSON.stringify({ ...parsed, [lessonId]: next }));
  } catch {
    /* Local only; losing a chunk marker must never block the lesson. */
  }
  return next;
}
