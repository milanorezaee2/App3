import { LAB_LESSONS } from './labLessons.generated';
import type { LabLanguage, LabLesson } from './labLessonTypes';

/**
 * Real, bundled review lessons produced by `scripts/content/genLabLessons.ts`.
 *
 * They are ordinary lessons (sentences, dialogue, checks, teaching note), inserted next to the
 * other lessons of their CEFR level. This is what closes the *structure* half of readiness:
 * `computeReadiness` counts lessons per band, not downloaded pack sentences.
 */
export function labLessonsOf(language: LabLanguage): readonly LabLesson[] {
  const lessons = LAB_LESSONS[language] ?? [];
  // The bundled data was generated when Pre-A1 had id -1. The ladder now starts at 0, so map on read
  // instead of rewriting the generated file (its ids, sentences and checks stay untouched).
  return lessons.map(lesson => (lesson.levelId as number) < 0 ? { ...lesson, levelId: 0 as const } : lesson);
}

/**
 * Inserted extra lessons, per language.
 *
 * Pre-A1 is exempt: the generated review lessons that once filled that band were frequency frames
 * («In class we read «of» today.») — unusable for somebody who cannot read English yet. English
 * Pre-A1 now carries hand-written review lessons of its own (`courseContentPreA1.ts`), so nothing
 * generated is inserted there.
 */
const EXEMPT_LEVELS: Partial<Record<LabLanguage, ReadonlySet<number>>> = {
  en: new Set([0]),
};

/** Insert extra lessons immediately after the last existing lesson of the same level. */
export function insertLabLessons<T extends { levelId: number }>(
  base: readonly T[],
  extras: readonly T[],
  language?: LabLanguage,
): T[] {
  const out: T[] = [...base];
  const groups = new Map<number, T[]>();
  const skip = language ? EXEMPT_LEVELS[language] : undefined;
  for (const extra of extras) {
    if (skip?.has(extra.levelId)) continue;
    const list = groups.get(extra.levelId) ?? [];
    list.push(extra);
    groups.set(extra.levelId, list);
  }
  for (const levelId of [...groups.keys()].sort((a, b) => a - b)) {
    const group = groups.get(levelId)!;
    let index = -1;
    for (let i = 0; i < out.length; i++) if (out[i].levelId === levelId) index = i;
    if (index >= 0) out.splice(index + 1, 0, ...group);
    else {
      const next = out.findIndex(lesson => lesson.levelId > levelId);
      if (next >= 0) out.splice(next, 0, ...group);
      else out.push(...group);
    }
  }
  return out;
}
