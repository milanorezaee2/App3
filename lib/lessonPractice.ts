import type { LearningLesson } from './languages/types';

/**
 * Builds retrieval practice from a lesson's own sentences — no new teaching
 * content is introduced. Three exercise kinds per sentence:
 *  - fill:    the key word is blanked out; pick the missing word
 *  - meaning: Persian meaning shown; pick the matching sentence
 *  - listen:  the sentence is played; pick the Persian meaning
 * Order and distractors are deterministic per lesson (seeded), so a lesson
 * always produces the same practice set, while differing between lessons.
 */
export type PracticeKind = 'fill' | 'meaning' | 'listen';
export interface PracticeItem {
  id: string;
  kind: PracticeKind;
  /** Primary prompt (blanked sentence, Persian meaning, or sentence to play). */
  prompt: string;
  /** Secondary helper line (Persian meaning for fill, pronunciation hint, …). */
  hint?: string;
  /** Text to speak for this item (listen → full sentence; fill/meaning → after answering). */
  speakText: string;
  choices: string[];
  correctIndex: number;
  /** Shown after answering: the full sentence + Persian meaning. */
  answerText: string;
  answerFa: string;
  /** True when the choices are in the target language (LTR) rather than Persian. */
  foreignChoices: boolean;
}

function hash(input: string): number {
  let value = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    value ^= input.charCodeAt(i);
    value = Math.imul(value, 16777619) >>> 0;
  }
  return value;
}

function rng(seed: number): () => number {
  let state = seed >>> 0 || 1;
  return () => {
    state = (Math.imul(state, 1103515245) + 12345) >>> 0;
    return state / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Strip combining stress marks (Russian learning aids) so matching is tolerant. */
function plain(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function blankOut(text: string, word: string): string | null {
  const target = plain(word).split(/\s+/)[0];
  if (!target || target.length < 2) return null;
  const tokens = text.split(/(\s+)/);
  for (let i = 0; i < tokens.length; i += 1) {
    const stripped = plain(tokens[i]).replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
    if (!stripped) continue;
    if (stripped === target || stripped.startsWith(target) || target.startsWith(stripped) && stripped.length >= 3) {
      const match = tokens[i].match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u);
      const core = match ? match[2] : tokens[i];
      tokens[i] = tokens[i].replace(core, '______');
      return tokens.join('');
    }
  }
  return null;
}

function pickDistractors<T>(pool: readonly T[], exclude: T, count: number, random: () => number, key: (item: T) => string): T[] {
  const seen = new Set([key(exclude)]);
  const candidates = shuffle(pool.filter(item => { const k = key(item); if (seen.has(k)) return false; seen.add(k); return true; }), random);
  return candidates.slice(0, count);
}

function withChoices(correct: string, distractors: string[], random: () => number): { choices: string[]; correctIndex: number } {
  const choices = shuffle([correct, ...distractors], random);
  return { choices, correctIndex: choices.indexOf(correct) };
}

export function buildLessonPractice(lesson: Pick<LearningLesson, 'id' | 'sentences'>, options?: { kinds?: PracticeKind[]; limit?: number; seedSalt?: string }): PracticeItem[] {
  const sentences = lesson.sentences.filter(s => s.text && s.fa);
  if (sentences.length < 2) return [];
  const random = rng(hash(`${lesson.id}#practice#${options?.seedSalt ?? ''}`));
  const kinds = options?.kinds ?? ['fill', 'meaning', 'listen'];
  const items: PracticeItem[] = [];
  const allWords = sentences.flatMap(s => (s.vocabulary ?? []).map(v => v.word)).filter(Boolean);

  for (const sentence of sentences) {
    const word = sentence.vocabulary?.[0]?.word;
    if (kinds.includes('fill') && word) {
      const blanked = blankOut(sentence.text, word);
      const distractors = pickDistractors(allWords, word, 2, random, w => plain(w));
      if (blanked && distractors.length === 2) {
        const { choices, correctIndex } = withChoices(word, distractors, random);
        items.push({ id: `${sentence.id}-fill`, kind: 'fill', prompt: blanked, hint: sentence.fa, speakText: sentence.text, choices, correctIndex, answerText: sentence.text, answerFa: sentence.fa, foreignChoices: true });
      }
    }
    if (kinds.includes('meaning')) {
      const distractors = pickDistractors(sentences, sentence, 2, random, s => s.text).map(s => s.text);
      if (distractors.length === 2) {
        const { choices, correctIndex } = withChoices(sentence.text, distractors, random);
        items.push({ id: `${sentence.id}-meaning`, kind: 'meaning', prompt: sentence.fa, speakText: sentence.text, choices, correctIndex, answerText: sentence.text, answerFa: sentence.fa, foreignChoices: true });
      }
    }
    if (kinds.includes('listen')) {
      const distractors = pickDistractors(sentences, sentence, 2, random, s => s.fa).map(s => s.fa);
      if (distractors.length === 2) {
        const { choices, correctIndex } = withChoices(sentence.fa, distractors, random);
        items.push({ id: `${sentence.id}-listen`, kind: 'listen', prompt: sentence.text, hint: sentence.pronunciation, speakText: sentence.text, choices, correctIndex, answerText: sentence.text, answerFa: sentence.fa, foreignChoices: false });
      }
    }
  }
  // Interleave kinds so the same sentence is not asked three times in a row.
  const byKind: Record<PracticeKind, PracticeItem[]> = { fill: [], meaning: [], listen: [] };
  for (const item of items) byKind[item.kind].push(item);
  const ordered: PracticeItem[] = [];
  const queues = kinds.map(kind => shuffle(byKind[kind], random));
  let remaining = items.length;
  while (remaining > 0) {
    for (const queue of queues) {
      const next = queue.shift();
      if (next) { ordered.push(next); remaining -= 1; }
    }
  }
  return typeof options?.limit === 'number' ? ordered.slice(0, options.limit) : ordered;
}

/** Short warm-up drawn from the previous lesson: a handful of mixed items. */
export function buildWarmUp(previous: Pick<LearningLesson, 'id' | 'sentences'> | null | undefined, count = 5): PracticeItem[] {
  if (!previous) return [];
  return buildLessonPractice(previous, { seedSalt: 'warmup' }).slice(0, count);
}
