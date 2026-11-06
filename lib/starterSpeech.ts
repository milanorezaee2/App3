import * as Speech from 'expo-speech';
import { speechTagFor } from './speechLanguage';

let requestId = 0;
let queue: Promise<void> = Promise.resolve();
const normalized = (value: string) => value.toLowerCase().replace(/_/g, '-');

/**
 * Prefer a voice installed for the course's exact region. The engine is still
 * expo-speech, just as in the other courses. No available device voice can be
 * certified as a human native speaker, nor can the locale be guaranteed when
 * the OS provides no matching voice. Voice enumeration can hang on web until
 * voiceschanged; never block playback indefinitely.
 */
async function findVoice(locale: string): Promise<{ voice?: string; fallback: boolean; unsupported: boolean }> {
  const key = normalized(locale);
  const voices = await Promise.race([
    Speech.getAvailableVoicesAsync().catch(() => []),
    new Promise<Speech.Voice[]>(resolve => setTimeout(() => resolve([]), 700)),
  ]);
  const matches = voices.filter(voice => normalized(voice.language) === key || normalized(voice.language).startsWith(`${key}-`));
  const exact = matches.find(voice => voice.quality === 'Enhanced') ?? matches[0];
  if (exact) {
    return {voice:exact.identifier, fallback:false, unsupported:false};
  }
  const prefix = key.split('-')[0];
  const sameLanguage = voices.filter(voice => normalized(voice.language).split('-')[0] === prefix);
  const fallbackVoice = sameLanguage.find(voice => voice.quality === 'Enhanced') ?? sameLanguage[0];
  return {voice:fallbackVoice?.identifier, fallback:true, unsupported:voices.length > 0 && !fallbackVoice};
}

export function playStarterSpeech(locale: string, text: string, rate: number, onError?: () => void, onVoiceFallback?: () => void) {
  const request = ++requestId;
  queue = queue.catch(() => undefined).then(async () => {
    if (request !== requestId) return;
    await Speech.stop().catch(() => undefined);
    if (request !== requestId) return;
    const selected = await findVoice(locale);
    if (request !== requestId) return;
    if (selected.unsupported) { onError?.(); return; }
    if (selected.fallback) onVoiceFallback?.();
    try {
      Speech.speak(text, {language:speechTagFor(locale), ...(selected.voice ? {voice:selected.voice} : {}), rate, onError:() => {if (request === requestId) onError?.();}});
    } catch { if (request === requestId) onError?.(); }
  });
  return queue;
}
export function stopStarterSpeech() {
  const request = ++requestId;
  queue = queue.catch(() => undefined).then(async () => { if (request === requestId) await Speech.stop().catch(() => undefined); });
  return queue;
}
