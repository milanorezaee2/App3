import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { speechTagFor } from '@/lib/speechLanguage';

/**
 * True when the current platform can actually produce a voice. On the web the
 * speech synthesis API is optional (and absent in some embedded browsers), and
 * the expo-speech web module rejects asynchronously when it is missing — which
 * would surface as an unhandled rejection instead of a caught error.
 */
export function narratorAvailable(): boolean {
  if (Platform.OS !== 'web') return true;
  if (typeof window === 'undefined') return false;
  const scope = window as unknown as { speechSynthesis?: unknown; SpeechSynthesisUtterance?: unknown };
  return typeof scope.speechSynthesis !== 'undefined' && typeof scope.SpeechSynthesisUtterance !== 'undefined';
}

/**
 * The last phrase a button played, so the narrator does not repeat it a moment
 * later. Tapping a listening row both speaks the row and moves the screen; the
 * narrator must stay quiet for that phrase instead of reading it twice.
 */
const recentManual: { text: string; locale: string; at: number } = { text: '', locale: '', at: 0 };

/** Call this from every manual play button so the narrator stays out of its way. */
export function noteManualSpeech(text: string, locale: string) {
  recentManual.text = (text ?? '').trim();
  recentManual.locale = locale;
  recentManual.at = Date.now();
}

function manualPlaybackJustHappened(phrase: string, locale: string) {
  return recentManual.text === phrase
    && recentManual.locale === locale
    && Date.now() - recentManual.at < 2500;
}

/**
 * The automatic narrator of the sentence course.
 *
 * Every lesson screen calls this hook with the phrase that is on screen right
 * now. When the phrase changes — a new lesson, the next sentence, a different
 * listening row, a different stage — the phrase is read aloud once, without any
 * tap. Repeating the same phrase (for example when a stage changes but the
 * sentence stays) is deliberately silent so the learner is not read the same
 * line five times in a row.
 *
 * The narrator is an enhancement, never a requirement: if the device has no
 * voice, the browser refuses to speak, or the engine throws, the lesson keeps
 * working silently. Manual play buttons keep using their own speech path.
 */
export function useAutoNarration({
  text,
  locale,
  enabled = true,
  rate = 0.9,
  identity,
}: {
  /** The phrase that is visible on screen. */
  text?: string | null;
  /** Course speech locale, e.g. `en-US`, `de-DE`, `ru-RU`. */
  locale: string;
  /** Turn the narrator off while recording or evaluating speech. */
  enabled?: boolean;
  rate?: number;
  /**
   * Extra identity (usually the lesson id), so a new lesson is read even when
   * its first phrase happens to equal the last phrase of the previous lesson.
   */
  identity?: string;
}) {
  const lastSpoken = useRef('');

  useEffect(() => {
    if (!enabled || !narratorAvailable()) return;
    const phrase = (text ?? '').trim();
    if (!phrase) return;
    const stamp = `${identity ?? ''}|${locale}|${phrase}`;
    if (lastSpoken.current === stamp) return;
    lastSpoken.current = stamp;
    if (manualPlaybackJustHappened(phrase, locale)) return;

    let cancelled = false;
    // A short pause keeps the narrator from fighting the screen transition.
    const timer = setTimeout(() => {
      if (cancelled) return;
      void (async () => {
        try {
          await Speech.stop();
        } catch {
          // Stopping an idle engine is not an error worth surfacing.
        }
        if (cancelled) return;
        try {
          Speech.speak(phrase, {
            language: speechTagFor(locale),
            rate,
            // A missing voice must never interrupt the lesson.
            onError: () => undefined,
          });
        } catch {
          // Same: speech is optional.
        }
      })();
    }, 420);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text, locale, enabled, rate, identity]);
}

/**
 * Speaks one phrase immediately, once. Used for the single phrase a course home
 * shows in its hero card, so opening a language reads its key sentence aloud.
 * Returns a function that cancels the pending narration.
 */
export function narrateOnce({
  text,
  locale,
  enabled = true,
  rate = 0.9,
  delay = 600,
}: {
  text?: string | null;
  locale: string;
  enabled?: boolean;
  rate?: number;
  delay?: number;
}) {
  const phrase = (text ?? '').trim();
  if (!enabled || !phrase || !narratorAvailable()) return () => undefined;
  let cancelled = false;
  const timer = setTimeout(() => {
    if (cancelled) return;
    void (async () => {
      try {
        await Speech.stop();
      } catch {
        // ignore
      }
      if (cancelled) return;
      try {
        Speech.speak(phrase, { language: speechTagFor(locale), rate, onError: () => undefined });
      } catch {
        // ignore
      }
    })();
  }, delay);
  return () => {
    cancelled = true;
    clearTimeout(timer);
  };
}
