import * as Speech from 'expo-speech';
import { voiceFor } from './voiceRotation';
import { speechTagFor } from './speechLanguage';
import { stopRecorded } from '@/lib/content/packAudio';
import { playPreferredRecording, playFallbackRecording, noteSpeechSuccess, noteSpeechFailure } from '@/lib/content/speechFallback';

type SpeechLocale = 'en-US';

// Explicit speeds for English lesson playback. They do not alternate between taps.
export const ENGLISH_NORMAL_SPEECH_RATE = 1;
export const ENGLISH_SLOW_SPEECH_RATE = 0.5;
/** Natural conversational pace — slightly faster than the default engine rate. */
export const ENGLISH_NATURAL_SPEECH_RATE = 1.15;

const warmedLocales = new Set<SpeechLocale>();
const playCounts = new Map<string, number>();
let active = false;
let requestId = 0;

/**
 * Starts the platform TTS engine silently while the lesson is loading. Native
 * engines often need one cold-start request before their first audible phrase.
 */
export function warmSpeech(locale: SpeechLocale) {
  // Intentionally silent. Avoid audible warm-up phrases at startup.
  if (warmedLocales.has(locale)) return;
  warmedLocales.add(locale);
}

/** First press uses natural 1× speed; the second press of the same phrase uses 0.5×. */
function alternatingRate(locale: SpeechLocale, text: string) {
  const key = `${locale}:${text}`;
  const count = playCounts.get(key) ?? 0;
  playCounts.set(key, count + 1);
  return count % 2 === 0 ? 1 : 0.5;
}

export function playResponsiveSpeech({
  text,
  locale,
  rate,
  onDone,
  onError,
}: {
  text: string;
  locale: SpeechLocale;
  rate?: number;
  onDone?: () => void;
  onError?: () => void;
}) {
  const currentRequest = ++requestId;
  const selectedRate = rate ?? alternatingRate(locale, text);
  const start = (voice?: string) => {
    if (currentRequest !== requestId) return;
    active = true;
    const startedAt = Date.now();
    let finished = false;
    const failed = () => {
      if (currentRequest !== requestId) return;
      active = false;
      if (voice) { start(); return; }
      void playFallbackRecording(text, selectedRate).then(ok => {
        if (currentRequest === requestId && !ok) onError?.();
      });
    };
    try {
      Speech.speak(text, {
        language: speechTagFor(locale),
        ...(voice ? { voice } : {}),
        rate: selectedRate,
        onDone: () => {
          if (currentRequest !== requestId) return;
          finished = true; active = false; noteSpeechSuccess(); onDone?.();
        },
        onStopped: () => {
          if (currentRequest !== requestId) return;
          active = false;
          // A playback cut off almost immediately is the closest JS signal we have
          // for a choppy / interrupted engine. Three such events switch the device.
          if (!finished && Date.now() - startedAt < 600) void noteSpeechFailure();
        },
        onError: failed,
      });
    } catch { failed(); }
  };

  const begin = () => {
    // Device TTS stays primary; recordings are used only on devices that opted in.
    void playPreferredRecording(text, selectedRate).catch(() => false).then(played => {
      if (currentRequest !== requestId || played) return;
      void voiceFor(locale, text).catch(() => undefined).then(voice => start(voice));
    });
  };
  if (active) {
    void Speech.stop().catch(() => undefined).finally(begin);
  } else {
    begin();
  }

  return selectedRate;
}

export function stopResponsiveSpeech() {
  requestId += 1;
  active = false;
  stopRecorded();
  return Speech.stop().catch(() => undefined);
}
