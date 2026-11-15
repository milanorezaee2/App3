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
  return LAB_LESSONS[language] ?? [];
}

/** Insert extra lessons immediately after the last existing lesson of the same level. */
export function insertLabLessons<T extends { levelId: number }>(base: readonly T[], extras: readonly T[]): T[] {
  const out: T[] = [...base];
  const groups = new Map<number, T[]>();
  for (const extra of extras) {
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
