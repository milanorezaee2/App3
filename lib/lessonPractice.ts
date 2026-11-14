import type { LearningLesson } from './languages/types';

/**
 * "Blitz" retrieval practice built from a lesson's own sentences.
 * Each sentence appears once, in a format different from the previous item,
 * so a lesson yields a short, varied round instead of a long uniform drill.
 * Formats:
 *  - order:     tap the shuffled words into the right sentence
 *  - fill:      the key word is blanked out; pick it from three
 *  - listen:    the sentence is played; pick the Persian meaning
 *  - truefalse: a sentence with a meaning that is sometimes swapped; ✓ or ✗
 *  - match:     pair three sentences with their three meanings
 * Everything is deterministic per lesson (seeded), with no new teaching content.
 */
export type PracticeKind = 'order' | 'fill' | 'listen' | 'truefalse' | 'match';
type Sentence = { id: string; text: string; fa: string; pronunciation?: string; vocabulary?: ReadonlyArray<{ word: string; meaning: string }> };

interface Base { id: string; kind: PracticeKind; sentenceId: string; answerText: string; answerFa: string; speakText: string; retry?: boolean }
export type PracticeItem =
  | (Base & { kind: 'fill'; prompt: string; hint: string; choices: string[]; correctIndex: number })
  | (Base & { kind: 'listen'; choices: string[]; correctIndex: number })
  | (Base & { kind: 'order'; tokens: string[]; answerTokens: string[] })
  | (Base & { kind: 'truefalse'; shownFa: string; isTrue: boolean })
  | (Base & { kind: 'match'; pairs: Array<{ text: string; fa: string }>; leftOrder: number[]; rightOrder: number[] });

export interface PracticeStats { total: number; retries: number; seconds: number; firstTryCorrect: number }

function hash(input: string): number {
  let value = 2166136261;
  for (let i = 0; i < input.length; i += 1) { value ^= input.charCodeAt(i); value = Math.imul(value, 16777619) >>> 0; }
  return value;
}
function rng(seed: number): () => number {
  let state = seed >>> 0 || 1;
  return () => { state = (Math.imul(state, 1103515245) + 12345) >>> 0; return state / 4294967296; };
}
function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) { const j = Math.floor(random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy;
}
/** Strip combining stress marks (Russian learning aids) so matching is tolerant. */
function plain(value: string): string { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
function words(text: string): string[] { return text.split(/\s+/).filter(Boolean); }

function blankOut(text: string, word: string): string | null {
  const target = plain(word).split(/\s+/)[0];
  if (!target || target.length < 2) return null;
  const tokens = text.split(/(\s+)/);
  for (let i = 0; i < tokens.length; i += 1) {
    const stripped = plain(tokens[i]).replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
    if (!stripped) continue;
    if (stripped === target || stripped.startsWith(target) || (target.startsWith(stripped) && stripped.length >= 3)) {
      const match = tokens[i].match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u);
      const core = match ? match[2] : tokens[i];
      tokens[i] = tokens[i].replace(core, '______');
      return tokens.join('');
    }
  }
  return null;
}
function distinct<T>(pool: readonly T[], exclude: T, count: number, random: () => number, key: (item: T) => string): T[] {
  const seen = new Set([key(exclude)]);
  return shuffle(pool.filter(item => { const k = key(item); if (seen.has(k)) return false; seen.add(k); return true; }), random).slice(0, count);
}
function withChoices(correct: string, distractors: string[], random: () => number) {
  const choices = shuffle([correct, ...distractors], random);
  return { choices, correctIndex: choices.indexOf(correct) };
}

const ALL_KINDS: PracticeKind[] = ['order', 'fill', 'listen', 'truefalse', 'match'];

function makeItem(kind: PracticeKind, sentence: Sentence, all: Sentence[], random: () => number, retry = false): PracticeItem | null {
  const base = { id: `${sentence.id}-${kind}${retry ? '-r' : ''}`, kind, sentenceId: sentence.id, answerText: sentence.text, answerFa: sentence.fa, speakText: sentence.text, retry } as const;
  if (kind === 'order') {
    const tokens = words(sentence.text);
    if (tokens.length < 3 || tokens.length > 9) return null;
    let mixed = shuffle(tokens, random);
    if (mixed.join(' ') === tokens.join(' ')) mixed = [...tokens.slice(1), tokens[0]];
    return { ...base, kind, tokens: mixed, answerTokens: tokens };
  }
  if (kind === 'fill') {
    const word = sentence.vocabulary?.[0]?.word;
    if (!word) return null;
    const blanked = blankOut(sentence.text, word);
    const pool = all.flatMap(s => (s.vocabulary ?? []).map(v => v.word));
    const distractors = distinct(pool, word, 2, random, plain);
    if (!blanked || distractors.length < 2) return null;
    return { ...base, kind, prompt: blanked, hint: sentence.fa, ...withChoices(word, distractors, random) };
  }
  if (kind === 'listen') {
    const distractors = distinct(all, sentence, 2, random, s => s.fa).map(s => s.fa);
    if (distractors.length < 2) return null;
    return { ...base, kind, ...withChoices(sentence.fa, distractors, random) };
  }
  if (kind === 'truefalse') {
    const isTrue = random() < 0.5;
    const other = distinct(all, sentence, 1, random, s => s.fa)[0];
    if (!isTrue && !other) return null;
    return { ...base, kind, shownFa: isTrue ? sentence.fa : other.fa, isTrue };
  }
  const others = distinct(all, sentence, 2, random, s => s.text);
  if (others.length < 2) return null;
  const pairs = [sentence, ...others].map(s => ({ text: s.text, fa: s.fa }));
  return { ...base, kind, pairs, leftOrder: shuffle([0, 1, 2], random), rightOrder: shuffle([0, 1, 2], random) };
}

export function buildLessonPractice(lesson: Pick<LearningLesson, 'id' | 'sentences'>, options?: { count?: number; kinds?: PracticeKind[]; seedSalt?: string }): PracticeItem[] {
  const all = (lesson.sentences as readonly Sentence[]).filter(s => s.text && s.fa);
  if (all.length < 3) return [];
  const random = rng(hash(`${lesson.id}#blitz#${options?.seedSalt ?? ''}`));
  const kinds = options?.kinds ?? ALL_KINDS;
  const count = Math.min(options?.count ?? 6, all.length);
  const picked = shuffle(all, random).slice(0, count);
  const items: PracticeItem[] = [];
  let lastKind: PracticeKind | null = null;
  let cursor = Math.floor(random() * kinds.length);
  for (const sentence of picked) {
    let item: PracticeItem | null = null;
    for (let attempt = 0; attempt < kinds.length && !item; attempt += 1) {
      const kind = kinds[(cursor + attempt) % kinds.length];
      if (kind === lastKind && kinds.length > 1) continue;
      item = makeItem(kind, sentence, all, random);
      if (item) cursor = (cursor + attempt + 1) % kinds.length;
    }
    if (item) { items.push(item); lastKind = item.kind; }
  }
  return items;
}

/** A second chance for a missed sentence, in a different format than before. */
export function buildRetryItem(lessonId: string, item: PracticeItem, lesson: Pick<LearningLesson, 'id' | 'sentences'>, kinds?: PracticeKind[]): PracticeItem | null {
  const all = (lesson.sentences as readonly Sentence[]).filter(s => s.text && s.fa);
  const sentence = all.find(s => s.id === item.sentenceId);
  if (!sentence) return null;
  const random = rng(hash(`${lessonId}#retry#${item.id}`));
  const order = shuffle((kinds ?? ALL_KINDS).filter(kind => kind !== item.kind && kind !== 'match'), random);
  for (const kind of order) { const next = makeItem(kind, sentence, all, random, true); if (next) return next; }
  return makeItem(item.kind, sentence, all, random, true);
}

/** Short warm-up from the previous lesson: quick formats only. */
export const WARM_UP_KINDS: PracticeKind[] = ['truefalse', 'listen', 'fill'];
export function buildWarmUp(previous: Pick<LearningLesson, 'id' | 'sentences'> | null | undefined, count = 3): PracticeItem[] {
  if (!previous) return [];
  return buildLessonPractice(previous, { count, kinds: WARM_UP_KINDS, seedSalt: 'warmup' });
}

/** Nominal round length used for the (non-punitive) timer bar. */
export function practiceBudgetSeconds(itemCount: number): number { return Math.max(30, itemCount * 15); }
