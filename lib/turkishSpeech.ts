import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import { speechTagFor } from './speechLanguage';

// Turkish has its own independent state, but follows the same responsive
// playback lifecycle as the English narrator. No stop/start queue is inserted
// before a cold playback, and only the latest request is allowed to speak.
const playCounts = new Map<string, number>();
let active = false;
let requestId = 0;
let preferredVoicePromise: Promise<string | undefined> | null = null;

function selectWarmTurkishVoice(voices: Speech.Voice[]): string | undefined {
  const candidates = voices.filter(voice => voice.language.toLowerCase().startsWith('tr'));
  let best: Speech.Voice | undefined;
  let bestScore = -Infinity;
  for (const voice of candidates) {
    const label = `${voice.name} ${voice.identifier}`.toLowerCase();
    let score = voice.quality === Speech.VoiceQuality.Enhanced ? 100 : 0;
    // Prefer natural/high-fidelity voices. A gentle female voice is used as
    // the experiment's warm-voice tie-breaker, never as a content change.
    if (/natural|neural|premium|enhanced|high|hd/.test(label)) score += 30;
    if (/network/.test(label)) score += 10;
    if (/female|femme|woman|kadın|kadin|trf/.test(label)) score += 20;
    if (/compact|legacy|deprecated|low/.test(label)) score -= 60;
    if (score > bestScore) { best = voice; bestScore = score; }
  }
  return best?.identifier;
}

function preferredTurkishVoice(): Promise<string | undefined> {
  // Browser previews keep their existing default voice; native builds select
  // only from voices already installed on the device, with a safe fallback.
  if (Platform.OS === 'web') return Promise.resolve(undefined);
  if (!preferredVoicePromise) {
    preferredVoicePromise = Speech.getAvailableVoicesAsync()
      .then(selectWarmTurkishVoice)
      .catch(() => undefined);
  }
  return preferredVoicePromise;
}

/** First manual press uses natural 1× speed; the repeated phrase uses 0.5×. */
function alternatingRate(text: string) {
  const count = playCounts.get(text) ?? 0;
  playCounts.set(text, count + 1);
  return count % 2 === 0 ? 1 : 0.5;
}

export function playTurkishSpeech(text: string, rate?: number, onError?: () => void): Promise<void> {
  const currentRequest = ++requestId;
  const selectedRate = rate ?? alternatingRate(text);
  const start = async () => {
    const voice = await preferredTurkishVoice();
    if (currentRequest !== requestId) return;
    active = true;
    try {
      Speech.speak(text, {
        language: speechTagFor('tr-TR'),
        rate: selectedRate,
        ...(voice ? { voice } : {}),
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
  return start();
}

export function stopTurkishSpeech(): Promise<void> {
  requestId += 1;
  active = false;
  return Speech.stop().catch(() => undefined);
}
