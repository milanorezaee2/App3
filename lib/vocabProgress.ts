import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { ReviewRating } from './courseProgress';

/**
 * Local, word-level spaced repetition shared by every vocabulary lab.
 *
 * Deliberately separate from the sentence review cards: a word is not a lesson sentence, and spoken
 * production has to be recorded on its own. No Supabase, token or service-role key — a course keeps its
 * own storage key, so Russian and German progress never mix.
 */
export const NEW_VOCAB_PER_SESSION = 5;
export const DUE_VOCAB_PER_SESSION = 10;

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

export interface VocabCard {
  id: string;
  dueAt: string;
  intervalDays: number;
  ease: number;
  repetitions: number;
  lapses: number;
  spokenSuccess: number;
  writtenOnly: number;
  introducedAt: string;
  lastReviewedAt?: string;
}

export interface VocabProgress {
  cards: Record<string, VocabCard>;
}

export interface VocabSession<T> {
  queue: readonly T[];
  dueCount: number;
  newCount: number;
  introduced: VocabProgress;
}

export interface VocabStats {
  introduced: number;
  mastered: number;
  due: number;
  total: number;
}

export interface VocabProgressStore<T extends { id: string }> {
  storageKey: string;
  load(): Promise<VocabProgress>;
  save(progress: VocabProgress): Promise<void>;
  introduce(progress: VocabProgress, ids: readonly string[], now?: Date): VocabProgress;
  due(words: readonly T[], progress: VocabProgress, now?: Date): T[];
  fresh(words: readonly T[], progress: VocabProgress, limit?: number): T[];
  buildSession(words: readonly T[], progress: VocabProgress, now?: Date): VocabSession<T>;
  rate(progress: VocabProgress, id: string, rating: ReviewRating, spoken: boolean, now?: Date): VocabProgress;
  mastered(card: VocabCard | undefined): boolean;
  stats(words: readonly T[], progress: VocabProgress): VocabStats;
  reason(card: VocabCard | undefined): string;
}

const emptyProgress = (): VocabProgress => ({ cards: {} });

function validCard(value: unknown): value is VocabCard {
  if (!value || typeof value !== 'object') return false;
  const card = value as Partial<VocabCard>;
  return typeof card.id === 'string'
    && typeof card.dueAt === 'string' && Number.isFinite(Date.parse(card.dueAt))
    && typeof card.introducedAt === 'string' && Number.isFinite(Date.parse(card.introducedAt))
    && [card.intervalDays, card.ease, card.repetitions, card.lapses, card.spokenSuccess, card.writtenOnly]
      .every(n => typeof n === 'number' && Number.isFinite(n) && n >= 0)
    && (card.ease ?? 0) >= 1.3 && (card.ease ?? 0) <= 3;
}

export function createVocabProgressStore<T extends { id: string }>(
  storageKey: string,
  options: { newPerSession?: number; duePerSession?: number } = {},
): VocabProgressStore<T> {
  const newPerSession = options.newPerSession ?? NEW_VOCAB_PER_SESSION;
  const duePerSession = options.duePerSession ?? DUE_VOCAB_PER_SESSION;

  const load = async (): Promise<VocabProgress> => {
    try {
      const raw = Platform.OS === 'web'
        ? window.localStorage.getItem(storageKey)
        : await AsyncStorage.getItem(storageKey);
      if (!raw) return emptyProgress();
      const parsed = JSON.parse(raw) as Partial<VocabProgress>;
      const cards: Record<string, VocabCard> = {};
      for (const [id, card] of Object.entries(parsed.cards ?? {})) {
        if (validCard(card) && card.id === id) cards[id] = card;
      }
      return { cards };
    } catch {
      return emptyProgress();
    }
  };

  const save = async (progress: VocabProgress): Promise<void> => {
    try {
      const raw = JSON.stringify(progress);
      if (Platform.OS === 'web') window.localStorage.setItem(storageKey, raw);
      else await AsyncStorage.setItem(storageKey, raw);
    } catch {
      /* Local-only progress; a storage failure must never block the drill. */
    }
  };

  const introduce = (progress: VocabProgress, ids: readonly string[], now = new Date()): VocabProgress => {
    const cards = { ...progress.cards };
    let changed = false;
    for (const id of ids) {
      if (cards[id]) continue;
      cards[id] = {
        id,
        dueAt: new Date(now.getTime() + 10 * MINUTE).toISOString(),
        intervalDays: 0,
        ease: 2.3,
        repetitions: 0,
        lapses: 0,
        spokenSuccess: 0,
        writtenOnly: 0,
        introducedAt: now.toISOString(),
      };
      changed = true;
    }
    return changed ? { cards } : progress;
  };

  const due = (words: readonly T[], progress: VocabProgress, now = new Date()): T[] => words
    .filter(word => {
      const card = progress.cards[word.id];
      return !!card && Date.parse(card.dueAt) <= now.getTime();
    })
    .sort((a, b) => Date.parse(progress.cards[a.id].dueAt) - Date.parse(progress.cards[b.id].dueAt));

  const fresh = (words: readonly T[], progress: VocabProgress, limit = newPerSession): T[] =>
    words.filter(word => !progress.cards[word.id]).slice(0, limit);

  const buildSession = (words: readonly T[], progress: VocabProgress, now = new Date()): VocabSession<T> => {
    const dueWords = due(words, progress, now).slice(0, duePerSession);
    const freshWords = fresh(words, progress);
    const introduced = introduce(progress, freshWords.map(word => word.id), now);
    return {
      queue: [...dueWords, ...freshWords],
      dueCount: dueWords.length,
      newCount: freshWords.length,
      introduced,
    };
  };

  const rate = (progress: VocabProgress, id: string, rating: ReviewRating, spoken: boolean, now = new Date()): VocabProgress => {
    const current = progress.cards[id] ?? {
      id,
      dueAt: now.toISOString(),
      intervalDays: 0,
      ease: 2.3,
      repetitions: 0,
      lapses: 0,
      spokenSuccess: 0,
      writtenOnly: 0,
      introducedAt: now.toISOString(),
    };
    let intervalDays = current.intervalDays;
    let ease = current.ease;
    let dueInMs: number;
    if (rating === 'again') {
      intervalDays = 0;
      ease = Math.max(1.3, ease - 0.2);
      dueInMs = 10 * MINUTE;
    } else if (rating === 'hard') {
      intervalDays = intervalDays < 1 ? 1 : Math.max(1, Math.ceil(intervalDays * 1.2));
      ease = Math.max(1.3, ease - 0.1);
      dueInMs = intervalDays * DAY;
    } else if (rating === 'easy') {
      intervalDays = intervalDays < 1 ? 4 : Math.max(4, Math.round(intervalDays * (ease + 0.35)));
      ease = Math.min(3, ease + 0.1);
      dueInMs = intervalDays * DAY;
    } else {
      intervalDays = current.repetitions === 0
        ? 1
        : current.repetitions === 1
          ? 3
          : Math.max(3, Math.round(intervalDays * ease));
      dueInMs = intervalDays * DAY;
    }
    const card: VocabCard = {
      ...current,
      intervalDays,
      ease,
      repetitions: rating === 'again' ? 0 : current.repetitions + 1,
      lapses: rating === 'again' ? current.lapses + 1 : current.lapses,
      spokenSuccess: current.spokenSuccess + (spoken && rating !== 'again' ? 1 : 0),
      writtenOnly: current.writtenOnly + (!spoken ? 1 : 0),
      lastReviewedAt: now.toISOString(),
      dueAt: new Date(now.getTime() + dueInMs).toISOString(),
    };
    return { cards: { ...progress.cards, [id]: card } };
  };

  const mastered = (card: VocabCard | undefined): boolean =>
    !!card && card.repetitions >= 3 && card.spokenSuccess >= 1 && card.intervalDays >= 3;

  const stats = (words: readonly T[], progress: VocabProgress): VocabStats => {
    const introduced = Object.keys(progress.cards).length;
    const masteredCount = words.filter(word => mastered(progress.cards[word.id])).length;
    const dueCount = due(words, progress).length;
    return { introduced, mastered: masteredCount, due: dueCount, total: words.length };
  };

  const reason = (card: VocabCard | undefined): string => {
    if (!card) return 'تازه معرفی شده؛ امروز باید آن را بلند بگویی.';
    if (card.lapses > 0) return 'چندبار یادآوری‌اش سخت بوده، برای همین زودتر برگشته.';
    if (card.repetitions === 0) return 'اولین مرور بعد از معرفی؛ هنوز گفتاری ثبت نشده.';
    return `نوبت مرور فاصله‌دار بعد از ${card.intervalDays} روز؛ تکرار گفتاری دوباره لازم است.`;
  };

  return { storageKey, load, save, introduce, due, fresh, buildSession, rate, mastered, stats, reason };
}
