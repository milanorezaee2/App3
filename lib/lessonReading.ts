/**
 * B1+ lessons open with the dialogue as a reading text, before any sentence is
 * taught. These helpers turn the dialogue into a small comprehension check
 * (three questions at most) built only from the text itself, so the learner
 * must actually read before the translation is revealed.
 */
export interface ReadingLine { speaker: string; text: string; fa: string }

export interface ReadingQuestion {
  promptFa: string;
  /** `foreign` choices are target-language lines; otherwise Persian. */
  choices: string[];
  correctIndex: number;
  foreign: boolean;
}

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function rng(seed: string) {
  let s = hash(seed) || 1;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 10000) / 10000; };
}

function shuffle<T>(items: T[], seed: string): T[] {
  const next = rng(seed); const out = [...items];
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}

const short = (text: string) => text.replace(/\s+/g, ' ').trim();

/** Up to three questions: meaning of a line, locate a line by its meaning, who said it. */
export function buildReadingQuestions(lines: readonly ReadingLine[], seed: string): ReadingQuestion[] {
  const usable = lines.filter(line => short(line.text).length > 0 && short(line.fa).length > 0);
  if (usable.length < 2) return [];
  const order = shuffle(usable.map((_, index) => index), `${seed}:order`);
  const questions: ReadingQuestion[] = [];

  const pick = (correct: number, key: 'text' | 'fa', salt: string) => {
    const others = shuffle(usable.filter((_, index) => index !== correct), `${seed}:${salt}`).slice(0, 2);
    const choices = shuffle([usable[correct], ...others], `${seed}:${salt}:mix`);
    return { choices: choices.map(line => short(line[key])), correctIndex: choices.indexOf(usable[correct]) };
  };

  // 1) Read a line → choose its meaning.
  const a = order[0];
  questions.push({ promptFa: `«${short(usable[a].text)}» یعنی چه؟`, ...pick(a, 'fa', 'meaning'), foreign: false });

  // 2) Meaning → find the line in the text.
  const b = order[1 % order.length];
  questions.push({ promptFa: `کدام جملهٔ متن این معنی را دارد: «${short(usable[b].fa)}»؟`, ...pick(b, 'text', 'find'), foreign: true });

  // 3) Who said it (only when the text has at least two distinct speakers).
  const speakers = Array.from(new Set(usable.map(line => short(line.speaker)).filter(Boolean)));
  if (speakers.length >= 2 && usable.length >= 3) {
    const c = order[2 % order.length];
    const choices = shuffle(speakers.slice(0, 3), `${seed}:who`);
    const correctIndex = choices.indexOf(short(usable[c].speaker));
    if (correctIndex >= 0) questions.push({ promptFa: `چه کسی گفت: «${short(usable[c].fa)}»؟`, choices, correctIndex, foreign: false });
  }
  return questions;
}
