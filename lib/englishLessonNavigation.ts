/** Previous sentence only; the first sentence cannot move to another stage. */
export function previousSentenceIndex(sentenceIndex: number) {
  return Math.max(0, sentenceIndex - 1);
}

/** Physical course order, not the learner's furthest saved position. */
export function nextLessonInOrder<T extends { id: string }>(lessons: readonly T[], currentId: string): T | undefined {
  const index = lessons.findIndex(lesson => lesson.id === currentId);
  return index >= 0 ? lessons[index + 1] : undefined;
}
