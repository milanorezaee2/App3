import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { ReviewRating } from './courseProgress';
import type { WordLabLanguage, WordLabWord } from './languages/wordLab';

/**
 * Local, word-level spaced repetition for the «واژه‌ها» lab of each language (Russian, German).
 *
 * A word is not a lesson sentence, and spoken production is recorded on its own. Everything stays on
 * the device: no Supabase, no token, no service-role key.
 */
export const VOCAB_STORAGE_PREFIX = 'milo.wordlab.v1';
export const NEW_WORDS_PER_SESSION = 8;
export const DUE_WORDS_PER_SESSION = 8;

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

export interface WordCard {
  id: string;
  dueAt: string;
  intervalDays: number;
  ease: number;
  repetitions: number;
  lapses: number;
  spokenSuccess: number;
  listened: number;
  introducedAt: string;
  lastReviewedAt?: string;
}

export interface WordProgress {
  cards: Record<string, WordCard>;
}

export interface WordSession {
  queue: readonly WordLabWord[];
  dueCount: number;
  newCount: number;
  introduced: WordProgress;
}

const emptyProgress = (): WordProgress => ({ cards: {} });

export function vocabStorageKey(language: WordLabLanguage): string {
  return `${VOCAB_STORAGE_PREFIX}.${language}`;
}

function validCard(value: unknown): value is WordCard {
  if (!value || typeof value !== 'object') return false;
  const card = value as Partial<WordCard>;
  return typeof card.id === 'string'
    && typeof card.dueAt === 'string' && Number.isFinite(Date.parse(card.dueAt))
    && typeof card.introducedAt === 'string' && Number.isFinite(Date.parse(card.introducedAt))
    && [card.intervalDays, card.ease, card.repetitions, card.lapses, card.spokenSuccess, card.listened]
      .every(n => typeof n === 'number' && Number.isFinite(n) && n >= 0)
    && (card.ease ?? 0) >= 1.3 && (card.ease ?? 0) <= 3;
}

/** The Russian lab used this key before the two-step redesign; those cards stay valid and are migrated once. */
const LEGACY_KEYS: Partial<Record<WordLabLanguage, string>> = { ru: 'milo.ru.vocab.v1' };

async function readRaw(key: string): Promise<string | null> {
  return Platform.OS === 'web' ? window.localStorage.getItem(key) : AsyncStorage.getItem(key);
}

export async function loadWordProgress(language: WordLabLanguage): Promise<WordProgress> {
  const key = vocabStorageKey(language);
  try {
    const legacy = LEGACY_KEYS[language];
    const raw = await readRaw(key) ?? (legacy ? await readRaw(legacy) : null);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<WordProgress>;
    const cards: Record<string, WordCard> = {};
    for (const [id, card] of Object.entries(parsed.cards ?? {})) {
      if (validCard(card) && card.id === id) cards[id] = card;
    }
    // A migrated legacy store is rewritten under the new key on the next save; nothing is deleted.
    return { cards };
  } catch {
    return emptyProgress();
  }
}

export async function saveWordProgress(language: WordLabLanguage, progress: WordProgress): Promise<void> {
  try {
    const raw = JSON.stringify(progress);
    if (Platform.OS === 'web') window.localStorage.setItem(vocabStorageKey(language), raw);
    else await AsyncStorage.setItem(vocabStorageKey(language), raw);
  } catch {
    /* Local-only progress; a storage failure must never block the drill. */
  }
}

export function introduceWords(
  progress: WordProgress,
  ids: readonly string[],
  now = new Date(),
): WordProgress {
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
      listened: 0,
      introducedAt: now.toISOString(),
    };
    changed = true;
  }
  return changed ? { cards } : progress;
}

export function dueWords(
  words: readonly WordLabWord[],
  progress: WordProgress,
  now = new Date(),
): WordLabWord[] {
  return words
    .filter(word => {
      const card = progress.cards[word.id];
      return !!card && Date.parse(card.dueAt) <= now.getTime();
    })
    .sort((a, b) => Date.parse(progress.cards[a.id].dueAt) - Date.parse(progress.cards[b.id].dueAt));
}

export function newWords(
  words: readonly WordLabWord[],
  progress: WordProgress,
  limit = NEW_WORDS_PER_SESSION,
): WordLabWord[] {
  return words.filter(word => !progress.cards[word.id]).slice(0, limit);
}

export function buildWordSession(
  words: readonly WordLabWord[],
  progress: WordProgress,
  now = new Date(),
): WordSession {
  const due = dueWords(words, progress, now).slice(0, DUE_WORDS_PER_SESSION);
  const fresh = newWords(words, progress);
  const introduced = introduceWords(progress, fresh.map(word => word.id), now);
  return {
    queue: [...due, ...fresh],
    dueCount: due.length,
    newCount: fresh.length,
    introduced,
  };
}

/** `spoken` = the learner produced the word from Persian and the recogniser accepted it. */
export function rateWordCard(
  progress: WordProgress,
  id: string,
  rating: ReviewRating,
  spoken: boolean,
  now = new Date(),
): WordProgress {
  const current = progress.cards[id] ?? {
    id,
    dueAt: now.toISOString(),
    intervalDays: 0,
    ease: 2.3,
    repetitions: 0,
    lapses: 0,
    spokenSuccess: 0,
    listened: 0,
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
  const card: WordCard = {
    ...current,
    intervalDays,
    ease,
    repetitions: rating === 'again' ? 0 : current.repetitions + 1,
    lapses: rating === 'again' ? current.lapses + 1 : current.lapses,
    listened: current.listened + 1,
    spokenSuccess: current.spokenSuccess + (spoken && rating !== 'again' ? 1 : 0),
    lastReviewedAt: now.toISOString(),
    dueAt: new Date(now.getTime() + dueInMs).toISOString(),
  };
  return { cards: { ...progress.cards, [id]: card } };
}

export function isWordMastered(card: WordCard | undefined): boolean {
  return !!card && card.repetitions >= 3 && card.spokenSuccess >= 1 && card.intervalDays >= 3;
}

export function wordStats(words: readonly WordLabWord[], progress: WordProgress) {
  const introduced = Object.keys(progress.cards).length;
  const mastered = words.filter(word => isWordMastered(progress.cards[word.id])).length;
  const due = dueWords(words, progress).length;
  return { introduced, mastered, due, total: words.length };
}

export function wordReason(card: WordCard | undefined): string {
  if (!card) return 'تازه معرفی شده؛ امروز باید از فارسی بگویی‌اش.';
  if (card.lapses > 0) return 'چندبار یادآوری‌اش سخت بوده، برای همین زودتر برگشته.';
  if (card.repetitions === 0) return 'اولین مرور بعد از معرفی؛ هنوز گفتاری ثبت نشده.';
  return `نوبت مرور فاصله‌دار بعد از ${card.intervalDays} روز؛ گفتن دوباره لازم است.`;
}
