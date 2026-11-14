import type { LearningLesson } from './languages/types';

type Check = NonNullable<LearningLesson['checks']>[number];

// Deterministic per lesson + question so the order is stable across re-renders and
// restored sessions (saved answers store a choice index), yet differs between
// questions and lessons instead of always favouring the first option.
function hash(input: string): number {
  let value = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    value ^= input.charCodeAt(i);
    value = Math.imul(value, 16777619) >>> 0;
  }
  return value;
}

export function shuffleChecks(lessonId: string, checks: readonly Check[] | undefined): Check[] {
  return (checks ?? []).map((check, index) => {
    const order = check.choices.map((_, i) => i);
    let seed = hash(`${lessonId}#${index}#${check.promptFa}`);
    for (let i = order.length - 1; i > 0; i -= 1) {
      seed = (Math.imul(seed, 1103515245) + 12345) >>> 0;
      const j = seed % (i + 1);
      [order[i], order[j]] = [order[j], order[i]];
    }
    return { ...check, choices: order.map(i => check.choices[i]), correctIndex: order.indexOf(check.correctIndex) };
  });
}
