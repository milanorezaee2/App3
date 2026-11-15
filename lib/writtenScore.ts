import { tokens } from './speechScore';

/**
 * Scoring for the «بنویس» (type the sentence) exercise. Word-by-word comparison that forgives what a
 * learner should not be punished for at A2: case, punctuation, diacritics/stress marks, and one small
 * slip (a single edit) in a word of four letters or more. Word order matters — it is the point.
 */
export type WrittenWordState = 'ok' | 'typo' | 'miss' | 'extra';
export interface WrittenCheck {
  /** All target words present in order (typos allowed). */
  ok: boolean;
  /** No typos at all. */
  exact: boolean;
  words: Array<{ word: string; state: WrittenWordState; typed?: string }>;
  /** Typed words that matched nothing. */
  extra: string[];
}

function distance(a: string, b: string): number {
  const m = a.length, n = b.length;
  const d: number[][] = Array.from({ length: m + 1 }, (_, i) => [i, ...new Array<number>(n).fill(0)]);
  for (let j = 1; j <= n; j += 1) d[0][j] = j;
  for (let i = 1; i <= m; i += 1) for (let j = 1; j <= n; j += 1) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
/** German ß/ss and French/Spanish typed without accents are the same word for this exercise. */
const fold = (w: string) => w.replace(/ß/g, 'ss').replace(/ё/g, 'е');

export function scoreWritten(target: string, typed: string): WrittenCheck {
  const expected = target.trim().split(/\s+/).filter(w => tokens(w).length > 0);
  const want = expected.map(w => fold(tokens(w).join('')));
  const got = tokens(typed).map(fold);
  // Longest-common-subsequence alignment with fuzzy equality, so one missing word doesn't shift everything.
  const eq = (a: string, b: string) => a === b || (a.length >= 4 && distance(a, b) <= 1);
  const m = want.length, n = got.length;
  const lcs: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i -= 1) for (let j = n - 1; j >= 0; j -= 1) lcs[i][j] = eq(want[i], got[j]) ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
  const words: WrittenCheck['words'] = [];
  const usedGot = new Set<number>();
  let i = 0, j = 0;
  while (i < m && j < n) {
    if (eq(want[i], got[j])) { words.push({ word: expected[i], state: want[i] === got[j] ? 'ok' : 'typo', typed: got[j] }); usedGot.add(j); i += 1; j += 1; }
    else if (lcs[i + 1][j] >= lcs[i][j + 1]) { words.push({ word: expected[i], state: 'miss' }); i += 1; }
    else j += 1;
  }
  while (i < m) { words.push({ word: expected[i], state: 'miss' }); i += 1; }
  const extra = got.filter((_, index) => !usedGot.has(index));
  const scored = words;
  const ok = scored.every(w => w.state !== 'miss') && extra.length === 0 && got.length > 0;
  return { ok, exact: ok && scored.every(w => w.state === 'ok'), words, extra };
}
