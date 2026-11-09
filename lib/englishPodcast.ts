import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { COURSE_LEVELS, SENTENCE_LESSONS, type CourseLevelId, type SentenceLesson } from './courseContent';
import { speechTagFor } from './speechLanguage';

/**
 * English-only podcast built from the existing lesson sentences (phase 1: on-device TTS).
 * One episode per lesson; segments are spoken English lines, each with a Persian
 * transcript line. Lesson content itself is never modified.
 */

export type PodcastSegmentKind = 'intro' | 'sentence' | 'dialogue' | 'outro';

export interface PodcastSegment {
  id: string;
  kind: PodcastSegmentKind;
  /** Spoken English text; empty for Persian-only transcript lines. */
  en: string;
  fa: string;
  /** Speaker label for dialogue segments. */
  speaker?: 'learner' | 'partner';
  /** Also repeat this line slowly after the first reading. */
  slowRepeat?: boolean;
}

export interface PodcastEpisode {
  id: string;
  lessonId: string;
  levelId: CourseLevelId;
  number: number;
  title: string;
  subtitle: string;
  situation: string;
  estimatedMinutes: number;
  segments: PodcastSegment[];
}

const WORDS_PER_MINUTE = 110;

function estimateMinutes(segments: PodcastSegment[]) {
  const words = segments.reduce((sum, segment) => sum + segment.en.split(/\s+/).filter(Boolean).length * (segment.slowRepeat ? 2.4 : 1), 0);
  const pauseMinutes = (segments.length * 0.8) / 60;
  return Math.max(2, Math.round(words / WORDS_PER_MINUTE + pauseMinutes));
}

function buildEpisode(lesson: SentenceLesson, number: number): PodcastEpisode {
  const segments: PodcastSegment[] = [];
  segments.push({
    id: `${lesson.id}-intro`,
    kind: 'intro',
    en: `Welcome to the Milo English podcast. Episode ${number}: ${lesson.title}. Listen first, then repeat after each sentence.`,
    fa: `به پادکست انگلیسی میلو خوش آمدید. اپیزود ${number}: ${lesson.title}. ${lesson.situation}`,
  });
  lesson.sentences.forEach((sentence) => {
    segments.push({ id: `${lesson.id}-${sentence.id}`, kind: 'sentence', en: sentence.en, fa: sentence.fa, slowRepeat: true });
  });
  if (lesson.dialogue.length) {
    segments.push({ id: `${lesson.id}-dialogue-intro`, kind: 'intro', en: 'Now, listen to the conversation.', fa: 'حالا به گفت‌وگو گوش کنید.' });
    lesson.dialogue.forEach((line, index) => {
      segments.push({ id: `${lesson.id}-dialogue-${index}`, kind: 'dialogue', en: line.text, fa: line.fa, speaker: line.speaker });
    });
  }
  segments.push({
    id: `${lesson.id}-outro`,
    kind: 'outro',
    en: 'That is the end of this episode. Practice these sentences in the pronunciation workshop. See you next time.',
    fa: 'این اپیزود تمام شد. این جمله‌ها را در کارگاه تلفظ تمرین کنید. تا اپیزود بعدی.',
  });
  return {
    id: lesson.id,
    lessonId: lesson.id,
    levelId: lesson.levelId,
    number,
    title: lesson.title,
    subtitle: lesson.subtitle,
    situation: lesson.situation,
    estimatedMinutes: estimateMinutes(segments),
    segments,
  };
}

export const PODCAST_EPISODES: PodcastEpisode[] = SENTENCE_LESSONS.map((lesson, index) => buildEpisode(lesson, index + 1));

export const getPodcastEpisode = (id: string) => PODCAST_EPISODES.find(episode => episode.id === id);

export const PODCAST_LEVELS = COURSE_LEVELS
  .map(level => ({ level, episodes: PODCAST_EPISODES.filter(episode => episode.levelId === level.id) }))
  .filter(group => group.episodes.length > 0);

export function adjacentEpisode(id: string, direction: 1 | -1) {
  const index = PODCAST_EPISODES.findIndex(episode => episode.id === id);
  if (index < 0) return undefined;
  return PODCAST_EPISODES[index + direction];
}

// ---------- listening progress (local, no login required) ----------

export const PODCAST_PROGRESS_KEY = 'english_podcast_progress_v1';

export interface EpisodeProgress {
  segmentIndex: number;
  completed: boolean;
  updatedAt: string;
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
    state.episodes[episodeId] = { ...previous, ...update, updatedAt: new Date().toISOString() };
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
