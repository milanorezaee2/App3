import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { ReviewRating } from './courseProgress';
import type { RussianVocabWord } from './languages/russianVocab';

/**
 * Local, word-level spaced repetition for «آزمایشگاه واژهٔ روسی».
 *
 * This is deliberately separate from the sentence review cards: a word is not a lesson sentence,
 * and spoken production has to be recorded on its own. No Supabase, token or service-role key.
 */
export const RUSSIAN_VOCAB_STORAGE_KEY = 'milo.ru.vocab.v1';
export const NEW_VOCAB_PER_SESSION = 5;
export const DUE_VOCAB_PER_SESSION = 10;

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

export interface RussianVocabCard {
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

export interface RussianVocabProgress {
  cards: Record<string, RussianVocabCard>;
}

export interface VocabSession {
  queue: readonly RussianVocabWord[];
  dueCount: number;
  newCount: number;
  introduced: RussianVocabProgress;
}

const emptyProgress = (): RussianVocabProgress => ({ cards: {} });

function validCard(value: unknown): value is RussianVocabCard {
  if (!value || typeof value !== 'object') return false;
  const card = value as Partial<RussianVocabCard>;
  return typeof card.id === 'string'
    && typeof card.dueAt === 'string' && Number.isFinite(Date.parse(card.dueAt))
    && typeof card.introducedAt === 'string' && Number.isFinite(Date.parse(card.introducedAt))
    && [card.intervalDays, card.ease, card.repetitions, card.lapses, card.spokenSuccess, card.writtenOnly]
      .every(n => typeof n === 'number' && Number.isFinite(n) && n >= 0)
    && (card.ease ?? 0) >= 1.3 && (card.ease ?? 0) <= 3;
}

export async function loadVocabProgress(): Promise<RussianVocabProgress> {
  try {
    const raw = Platform.OS === 'web'
      ? window.localStorage.getItem(RUSSIAN_VOCAB_STORAGE_KEY)
      : await AsyncStorage.getItem(RUSSIAN_VOCAB_STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<RussianVocabProgress>;
    const cards: Record<string, RussianVocabCard> = {};
    for (const [id, card] of Object.entries(parsed.cards ?? {})) {
      if (validCard(card) && card.id === id) cards[id] = card;
    }
    return { cards };
  } catch {
    return emptyProgress();
  }
}

export async function saveVocabProgress(progress: RussianVocabProgress): Promise<void> {
  try {
    const raw = JSON.stringify(progress);
    if (Platform.OS === 'web') window.localStorage.setItem(RUSSIAN_VOCAB_STORAGE_KEY, raw);
    else await AsyncStorage.setItem(RUSSIAN_VOCAB_STORAGE_KEY, raw);
  } catch {
    /* Local-only progress; a storage failure must never block the drill. */
  }
}

export function introduceVocabWords(
  progress: RussianVocabProgress,
  ids: readonly string[],
  now = new Date(),
): RussianVocabProgress {
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
}

export function dueVocabWords(
  words: readonly RussianVocabWord[],
  progress: RussianVocabProgress,
  now = new Date(),
): RussianVocabWord[] {
  return words
    .filter(word => {
      const card = progress.cards[word.id];
      return !!card && Date.parse(card.dueAt) <= now.getTime();
    })
    .sort((a, b) => Date.parse(progress.cards[a.id].dueAt) - Date.parse(progress.cards[b.id].dueAt));
}

export function newVocabWords(
  words: readonly RussianVocabWord[],
  progress: RussianVocabProgress,
  limit = NEW_VOCAB_PER_SESSION,
): RussianVocabWord[] {
  return words.filter(word => !progress.cards[word.id]).slice(0, limit);
}

export function buildVocabSession(
  words: readonly RussianVocabWord[],
  progress: RussianVocabProgress,
  now = new Date(),
): VocabSession {
  const due = dueVocabWords(words, progress, now).slice(0, DUE_VOCAB_PER_SESSION);
  const fresh = newVocabWords(words, progress);
  const introduced = introduceVocabWords(progress, fresh.map(word => word.id), now);
  return {
    queue: [...due, ...fresh],
    dueCount: due.length,
    newCount: fresh.length,
    introduced,
  };
}

export function rateVocabCard(
  progress: RussianVocabProgress,
  id: string,
  rating: ReviewRating,
  spoken: boolean,
  now = new Date(),
): RussianVocabProgress {
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
  const card: RussianVocabCard = {
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
}

export function isVocabMastered(card: RussianVocabCard | undefined): boolean {
  return !!card && card.repetitions >= 3 && card.spokenSuccess >= 1 && card.intervalDays >= 3;
}

export function vocabStats(words: readonly RussianVocabWord[], progress: RussianVocabProgress) {
  const introduced = Object.keys(progress.cards).length;
  const mastered = words.filter(word => isVocabMastered(progress.cards[word.id])).length;
  const due = dueVocabWords(words, progress).length;
  return { introduced, mastered, due, total: words.length };
}

export function vocabReason(card: RussianVocabCard | undefined): string {
  if (!card) return 'تازه معرفی شده؛ امروز باید آن را بلند بگویی.';
  if (card.lapses > 0) return 'چندبار یادآوریاش سخت بوده، برای همین زودتر برگشته.';
  if (card.repetitions === 0) return 'اولین مرور بعد از معرفی؛ هنوز گفتاری ثبت نشده.';
  return `نوبت مرور فاصلهدار بعد از ${card.intervalDays} روز؛ تکرار گفتاری دوباره لازم است.`;
}
