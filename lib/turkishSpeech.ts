import * as Speech from 'expo-speech';
import { speechTagFor } from './speechLanguage';

// Turkish has its own independent state, but follows the same responsive
// playback lifecycle as the English narrator. No stop/start queue is inserted
// before a cold playback, and only the latest request is allowed to speak.
const playCounts = new Map<string, number>();
let active = false;
let requestId = 0;

/** First manual press uses natural 1× speed; the repeated phrase uses 0.5×. */
function alternatingRate(text: string) {
  const count = playCounts.get(text) ?? 0;
  playCounts.set(text, count + 1);
  return count % 2 === 0 ? 1 : 0.5;
}

export function playTurkishSpeech(text: string, rate?: number, onError?: () => void): Promise<void> {
  const currentRequest = ++requestId;
  const selectedRate = rate ?? alternatingRate(text);
  const start = () => {
    if (currentRequest !== requestId) return;
    active = true;
    try {
      Speech.speak(text, {
        language: speechTagFor('tr-TR'),
        rate: selectedRate,
        onDone: () => {
          if (currentRequest === requestId) active = false;
        },
        onStopped: () => {
          if (currentRequest === requestId) active = false;
        },
        onError: () => {
          if (currentRequest === requestId) { active = false; onError?.(); }
        },
      });
    } catch {
      if (currentRequest === requestId) { active = false; onError?.(); }
    }
  };

  if (active) {
    return Speech.stop().catch(() => undefined).finally(start);
  }
  start();
  return Promise.resolve();
}

export function stopTurkishSpeech(): Promise<void> {
  requestId += 1;
  active = false;
  return Speech.stop().catch(() => undefined);
}
