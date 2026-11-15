import { COURSE_SPEC, CEFR_BANDS, bandOfLevel, type CefrBand } from '@/lib/content/courseSpec';

/**
 * Course readiness — how far a course is from the course spec, computed from the lesson data itself.
 *
 * Two things are measured per CEFR band and the lower one wins (a band is only as ready as its weakest
 * dimension):
 *   • structure  — lessons present ÷ lessons required by the spec;
 *   • coverage   — share of the language's most frequent words (up to the band's cumulative ceiling)
 *                  that appear in at least one sentence of this band or an earlier one.
 * Coverage uses the open frequency lists in `lib/content/frequency/<lang>.json` (wordfreq, top 8000).
 * Everything here is pure and synchronous so it runs identically in the app, the admin app and scripts.
 */

export type CourseLanguage = 'en' | 'de' | 'fr' | 'es' | 'ru' | 'tr';

export interface AuditSentence { text: string; pattern?: string | null }
export interface AuditLesson {
  id: string;
  levelId: number;
  title: string;
  sentences: readonly AuditSentence[];
  hasDialogue: boolean;
  checks: number;
}

export interface BandReadiness {
  band: CefrBand;
  lessons: number;
  lessonsTarget: number;
  sentences: number;
  sentencesTarget: number;
  lessonsWithDialogue: number;
  lessonsWithChecks: number;
  patterns: number;
  patternsTarget: number;
  /** Frequency words (≤ ceiling) met by the end of this band, cumulative. */
  coveredWords: number;
  vocabularyCeiling: number;
  /** 0–100 */
  structure: number;
  /** 0–100 */
  coverage: number;
  /** 0–100 — min(structure, coverage) */
  readiness: number;
  /** Most frequent uncovered words within the ceiling (the content order for this band). */
  gaps: string[];
}

export interface CourseReadiness { language: CourseLanguage; bands: BandReadiness[]; uniqueWords: number }

const STRESS = /[\u0300\u0301\u0302\u0308]/g; // combining marks used for Russian stress etc. (keep ü/é as precomposed)
/** Tokenise a sentence into comparable lowercase words. Apostrophes split (l'école → l, école) as in the frequency lists. */
export function tokenize(text: string): string[] {
  return text
    .normalize('NFC')
    .replace(/[\u0301]/g, '')
    .toLowerCase()
    .split(/[^\p{L}\p{M}]+/u)
    .map(w => w.replace(STRESS, ''))
    .filter(Boolean);
}

/**
 * Inflection tolerance: frequency lists hold surface forms (говорю / говорит / говорили …), while a course
 * teaches a word once. A frequency word counts as met when a taught token shares its first STEM letters
 * and differs in length by at most 3 (good enough for Russian/Turkish/German endings; it can over-credit
 * short words, which is why the stem must be at least 5 letters).
 */
const STEM = 5;
function stemIndex(seen: Set<string>): Map<string, number[]> {
  const index = new Map<string, number[]>();
  for (const token of seen) if (token.length >= STEM) { const key = token.slice(0, STEM); const list = index.get(key) ?? []; list.push(token.length); index.set(key, list); }
  return index;
}
function stemMatch(word: string, stems: Map<string, number[]>): boolean {
  if (word.length < STEM) return false;
  const lengths = stems.get(word.slice(0, STEM));
  return !!lengths && lengths.some(length => Math.abs(length - word.length) <= 3);
}

const pct = (n: number, d: number) => d <= 0 ? 100 : Math.max(0, Math.min(100, Math.round((n / d) * 100)));

export function computeReadiness(language: CourseLanguage, lessons: readonly AuditLesson[], frequency: readonly string[], gapLimit = 60): CourseReadiness {
  const rank = new Map<string, number>();
  frequency.forEach((word, index) => { if (!rank.has(word)) rank.set(word, index + 1); });
  const seen = new Set<string>();
  const all = new Set<string>();
  const bands: BandReadiness[] = [];
  for (const band of CEFR_BANDS) {
    const spec = COURSE_SPEC[band];
    const own = lessons.filter(lesson => bandOfLevel(lesson.levelId) === band);
    let sentences = 0, patterns = 0;
    for (const lesson of own) for (const sentence of lesson.sentences) {
      sentences++;
      if (sentence.pattern) patterns++;
      for (const token of tokenize(sentence.text)) { all.add(token); if (rank.has(token)) seen.add(token); }
    }
    let covered = 0;
    const gaps: string[] = [];
    const stems = stemIndex(seen);
    for (let i = 0; i < Math.min(spec.vocabularyCeiling, frequency.length); i++) {
      if (seen.has(frequency[i]) || stemMatch(frequency[i], stems)) covered++; else if (gaps.length < gapLimit) gaps.push(frequency[i]);
    }
    const structure = pct(own.length, spec.lessons);
    const coverage = pct(covered, Math.min(spec.vocabularyCeiling, frequency.length));
    bands.push({
      band, lessons: own.length, lessonsTarget: spec.lessons, sentences, sentencesTarget: spec.lessons * spec.sentencesPerLesson,
      lessonsWithDialogue: own.filter(l => l.hasDialogue).length, lessonsWithChecks: own.filter(l => l.checks > 0).length,
      patterns, patternsTarget: spec.lessons * spec.patternsPerLesson,
      coveredWords: covered, vocabularyCeiling: spec.vocabularyCeiling, structure, coverage,
      readiness: own.length === 0 ? 0 : Math.min(structure, coverage), gaps,
    });
  }
  return { language, bands, uniqueWords: all.size };
}

/** Readiness of the band a level belongs to, for level cards. */
export function bandReadinessForLevel(course: CourseReadiness, levelId: number): BandReadiness | undefined {
  return course.bands.find(b => b.band === bandOfLevel(levelId));
}
