/**
 * Course specification — the single standard every language course is measured against.
 *
 * Levels are expressed as CEFR bands. Targets come from the CEFR vocabulary-size guidance (≈500 words
 * at A1 doubling per band to ≈8000 at C1) and a base-heavy lesson pyramid (most learners live in A1–A2).
 * The numbers are deliberately plain so the readiness percentage shown to learners is explainable.
 */

export type CefrBand = 'pre' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
export const CEFR_BANDS: readonly CefrBand[] = ['pre', 'A1', 'A2', 'B1', 'B2', 'C1'];
export const CEFR_LABEL: Record<CefrBand, string> = { pre: 'پیش‌A1', A1: 'A1', A2: 'A2', B1: 'B1', B2: 'B2', C1: 'C1' };

export interface BandSpec {
  /** Lessons the band should contain. */
  lessons: number;
  /** Sentences per lesson. */
  sentencesPerLesson: number;
  /** Frequency-list words (rank ceiling) the learner should have met by the END of this band, cumulative. */
  vocabularyCeiling: number;
  /** Grammar patterns per lesson. */
  patternsPerLesson: number;
}

export const COURSE_SPEC: Record<CefrBand, BandSpec> = {
  pre: { lessons: 15, sentencesPerLesson: 6, vocabularyCeiling: 150, patternsPerLesson: 1 },
  A1: { lessons: 40, sentencesPerLesson: 8, vocabularyCeiling: 500, patternsPerLesson: 2 },
  A2: { lessons: 40, sentencesPerLesson: 10, vocabularyCeiling: 1000, patternsPerLesson: 2 },
  B1: { lessons: 40, sentencesPerLesson: 10, vocabularyCeiling: 2000, patternsPerLesson: 3 },
  B2: { lessons: 35, sentencesPerLesson: 12, vocabularyCeiling: 4000, patternsPerLesson: 3 },
  C1: { lessons: 30, sentencesPerLesson: 12, vocabularyCeiling: 8000, patternsPerLesson: 3 },
};

/**
 * Internal course level ids → CEFR band.
 *
 * Every course now shares one ladder: 0 = Pre-A1, 1 = A1, 2 = A2, 3 = B1, 4 = B2, 5 = C1.
 * Before rev 119 English/Russian/Turkish also had a separate beginner level 0 whose lessons were
 * ordinary fifty-sentence A1 lessons; that card is gone and its lessons are part of A1.
 * Negative ids are still read as Pre-A1 so saved sessions from older builds stay valid.
 */
export function bandOfLevel(levelId: number): CefrBand {
  if (levelId <= 0) return 'pre';
  if (levelId === 1) return 'A1';
  if (levelId === 2) return 'A2';
  if (levelId === 3) return 'B1';
  if (levelId === 4) return 'B2';
  return 'C1';
}

/** Below this readiness a band is labelled «در حال تکمیل». */
export const READY_THRESHOLD = 40;
