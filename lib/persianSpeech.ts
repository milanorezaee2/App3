import * as Speech from 'expo-speech';
import { speechTagFor } from './speechLanguage';

/**
 * Speaking a Persian prompt out loud.
 *
 * Persian is only ever *prompting* here (the answer is Russian), so a missing Persian voice is never an
 * error: the caller still has the written gloss on screen.
 *
 * `onDone`/`onError` let a caller chain the next sound after the Persian gloss instead of guessing how
 * long the sentence takes (a fixed delay either cut the gloss or left dead air before the next word).
 */
export function speakPersian(text: string, rate = 0.92, onError?: () => void, onDone?: () => void): void {
  const clean = text.replace(/\s*\([^)]*\)/g, '').trim();
  if (!clean) { onDone?.(); return; }
  let settled = false;
  const finish = (cb?: () => void) => {
    if (settled) return;
    settled = true;
    cb?.();
  };
  try {
    Speech.speak(clean, {
      language: speechTagFor('fa-IR'),
      rate,
      onDone: () => finish(onDone),
      onStopped: () => finish(onError),
      onError: () => finish(onError),
    });
  } catch {
    finish(onError);
  }
}
