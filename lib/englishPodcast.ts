import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { speechTagFor } from './speechLanguage';

// Pure episode model lives in englishPodcastEpisodes.ts so Node scripts can reuse it.
export * from './englishPodcastEpisodes';

// ---------- listening progress (local, no login required) ----------

export const PODCAST_PROGRESS_KEY = 'english_podcast_progress_v1';

export interface EpisodeProgress {
  segmentIndex: number;
  completed: boolean;
  updatedAt: string;
  /** Phase 3 comprehension quiz: best score out of `quizTotal`. */
  quizScore?: number;
  quizTotal?: number;
}

export interface PodcastProgress {
  episodes: Record<string, EpisodeProgress>;
  lastEpisodeId?: string;
}

const emptyProgress = (): PodcastProgress => ({ episodes: {} });

function parseProgress(raw: string | null): PodcastProgress {
  if (!raw) return emptyProgress();
  try {
    const parsed = JSON.parse(raw) as Partial<PodcastProgress>;
    return { episodes: parsed.episodes && typeof parsed.episodes === 'object' ? parsed.episodes : {}, lastEpisodeId: typeof parsed.lastEpisodeId === 'string' ? parsed.lastEpisodeId : undefined };
  } catch {
    return emptyProgress();
  }
}

async function readRaw() {
  if (Platform.OS === 'web') return typeof window === 'undefined' ? null : window.localStorage.getItem(PODCAST_PROGRESS_KEY);
  return AsyncStorage.getItem(PODCAST_PROGRESS_KEY);
}

async function writeRaw(raw: string) {
  if (Platform.OS === 'web') { if (typeof window !== 'undefined') window.localStorage.setItem(PODCAST_PROGRESS_KEY, raw); return; }
  await AsyncStorage.setItem(PODCAST_PROGRESS_KEY, raw);
}

export async function loadPodcastProgress(): Promise<PodcastProgress> {
  return parseProgress(await readRaw());
}

let queue: Promise<unknown> = Promise.resolve();

export function savePodcastProgress(episodeId: string, update: Partial<EpisodeProgress>): Promise<PodcastProgress> {
  const run = async () => {
    const state = await loadPodcastProgress();
    const previous = state.episodes[episodeId] ?? { segmentIndex: 0, completed: false, updatedAt: new Date().toISOString() };
    const merged = { ...previous, ...update, updatedAt: new Date().toISOString() };
    // Keep the best quiz result.
    if (update.quizScore !== undefined && previous.quizScore !== undefined && previous.quizTotal === update.quizTotal && previous.quizScore > update.quizScore) {
      merged.quizScore = previous.quizScore;
    }
    state.episodes[episodeId] = merged;
    state.lastEpisodeId = episodeId;
    await writeRaw(JSON.stringify(state));
    return state;
  };
  const next = queue.then(run, run);
  queue = next.catch(() => undefined);
  return next;
}

// ---------- speech ----------

export const PODCAST_SPEEDS = [0.75, 1, 1.25] as const;
export type PodcastSpeed = (typeof PODCAST_SPEEDS)[number];
const SLOW_FACTOR = 0.6;

let speechRequest = 0;

/** Speak one English line; resolves true when finished, false when interrupted. */
export function speakPodcastLine(text: string, rate: number): Promise<boolean> {
  const current = ++speechRequest;
  return new Promise<boolean>((resolve) => {
    const begin = () => {
      if (current !== speechRequest) return resolve(false);
      try {
        Speech.speak(text, {
          language: speechTagFor('en-US'),
          rate,
          onDone: () => resolve(current === speechRequest),
          onStopped: () => resolve(false),
          onError: () => resolve(false),
        });
      } catch {
        resolve(false);
      }
    };
    void Speech.stop().catch(() => undefined).finally(begin);
  });
}

export function stopPodcastSpeech() {
  speechRequest += 1;
  return Speech.stop().catch(() => undefined);
}

export const slowRateFor = (speed: PodcastSpeed) => Math.max(0.3, Number((speed * SLOW_FACTOR).toFixed(2)));
