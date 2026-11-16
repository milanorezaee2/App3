import * as Speech from 'expo-speech';
import { speechTagFor } from './speechLanguage';

/**
 * Speaking a Persian gloss out loud.
 *
 * Persian is only ever *prompting* here (the answer is Russian/German), so a missing Persian voice is
 * never an error: the written gloss is always on screen.
 *
 * Two hard-won rules:
 *  1. Ask the engine which voices it really has. Most devices have no Persian voice at all; calling
 *     `speak()` with `language: 'fa'` then either stays silent or reads Persian text with the German
 *     voice, which sounds like a stuck drill. We look the voice up once and only speak when it exists.
 *  2. Pass the discovered voice explicitly, so Android does not fall back to the device language.
 *
 * `onDone`/`onError` let a caller chain the next sound after the Persian gloss instead of guessing how
 * long the sentence takes (a fixed delay either cut the gloss or left dead air before the next word).
 */
const PERSIAN_TAGS = new Set(['fa', 'fa-ir', 'fas', 'per', 'persian']);

function normalizeTag(tag: string | undefined): string {
  return (tag ?? '').toLowerCase().replace(/_/g, '-');
}

function isPersianVoice(voice: Speech.Voice): boolean {
  const tag = normalizeTag(voice.language);
  return PERSIAN_TAGS.has(tag) || tag.startsWith('fa-');
}

let lookup: Promise<Speech.Voice | null> | null = null;

/** Cached, single device query: «is there a voice that can actually read Persian here?» */
function findPersianVoice(): Promise<Speech.Voice | null> {
  if (!lookup) {
    lookup = (async () => {
      try {
        if (typeof Speech.getAvailableVoicesAsync !== 'function') return null;
        // A browser whose engine never reports voices would otherwise leave this promise pending forever.
        const voices = await Promise.race([
          Speech.getAvailableVoicesAsync(),
          new Promise<Speech.Voice[] | null>(resolve => setTimeout(() => resolve(null), 2500)),
        ]);
        return voices?.find(isPersianVoice) ?? null;
      } catch {
        return null;
      }
    })();
  }
  return lookup;
}

/** Warm the lookup while a list loads, so the first gloss does not pay for the query. */
export function warmPersianVoice(): void {
  void findPersianVoice();
}

/** True when the device really has a Persian voice installed. */
export async function hasPersianVoice(): Promise<boolean> {
  return !!(await findPersianVoice());
}

/** Forget the cached answer — used by the «بررسی دوباره» button after installing a voice. */
export function resetPersianVoiceCheck(): void {
  lookup = null;
}

export function speakPersian(text: string, rate = 0.92, onError?: () => void, onDone?: () => void): void {
  const clean = text.replace(/\s*\([^)]*\)/g, '').trim();
  if (!clean) { onDone?.(); return; }
  let settled = false;
  const finish = (cb?: () => void) => {
    if (settled) return;
    settled = true;
    cb?.();
  };
  void (async () => {
    const voice = await findPersianVoice();
    // No Persian voice: say nothing rather than read Persian with a German/Russian voice.
    if (!voice) { finish(onDone); return; }
    try {
      Speech.speak(clean, {
        language: voice.language || speechTagFor('fa-IR'),
        voice: voice.identifier,
        rate,
        onDone: () => finish(onDone),
        onStopped: () => finish(onError),
        onError: () => finish(onError),
      });
    } catch {
      finish(onError);
    }
  })();
}
