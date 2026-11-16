import * as Speech from 'expo-speech';
import { speechTagFor } from './speechLanguage';

/**
 * Speaking a Persian prompt out loud.
 *
 * Persian is only ever *prompting* here (the answer is Russian), so a missing Persian voice is never an
 * error: the caller still has the written gloss on screen.
 */
export function speakPersian(text: string, rate = 0.92, onError?: () => void): void {
  const clean = text.replace(/\s*\([^)]*\)/g, '').trim();
  if (!clean) return;
  try {
    Speech.speak(clean, {
      language: speechTagFor('fa-IR'),
      rate,
      onError: () => onError?.(),
    });
  } catch {
    onError?.();
  }
}
