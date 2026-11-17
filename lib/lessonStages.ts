/**
 * One place that knows the shape of a lesson attempt across releases.
 *
 * The lesson ladder used to end with a timed «دور سریع» round (recognise / order / write strikes).
 * It is gone: the lesson now ends with «سنجش کوتاه» and then «آزمون گفتاری». Old saves still hold the
 * previous indexes (8 = blitz, 9 = checks, 10 = speak), so a saved stage is migrated once and then
 * written back with `stageVersion: 2`. Without the version flag a current save at stage 9 would keep
 * being shifted back to stage 8 on every reload.
 */
export const LESSON_STAGE_VERSION = 2;

/**
 * Returns the stage index to resume, or `null` when the saved value is unusable.
 *
 * `stageVersion` is the flag stored next to the stage; `stageCount` is the length of the current
 * ladder (10 for every language now that the blitz round is removed).
 */
export function resumeStage(stage: number, stageVersion: unknown, stageCount: number): number | null {
  if (!Number.isInteger(stage) || stage < 0) return null;
  if (stageVersion === LESSON_STAGE_VERSION) return stage < stageCount ? stage : null;
  // Legacy ladder: 0–7 unchanged, 8 was the blitz round, 9 the short assessment, 10 the speaking check.
  // Both 8 and 9 resume at the short assessment; the speaking check moves from 10 to 9.
  const migrated = stage <= 7 ? stage : stage <= 9 ? 8 : stage - 1;
  return migrated < stageCount ? migrated : null;
}
