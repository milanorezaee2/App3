import * as Speech from 'expo-speech';
import { speechTagFor } from './speechLanguage';

let requestId = 0;
let queue: Promise<void> = Promise.resolve();
const normalized = (value: string) => value.toLowerCase().replace(/_/g, '-');

type VoiceCandidate = { voice?: string; fallback: boolean };

/**
 * Android may list voices whose data is missing or which need a network, and
 * expo-speech cannot tell us which they are. Prefer the requested region, but
 * try other matching voices and the engine's language default if one fails.
 * Enumeration can hang, particularly on web, so it must not block playback.
 */
async function findVoices(locale: string): Promise<VoiceCandidate[]> {
  const key = normalized(locale);
  const voices = await Promise.race([
    Speech.getAvailableVoicesAsync().catch(() => []),
    new Promise<Speech.Voice[]>(resolve => setTimeout(() => resolve([]), 700)),
  ]);
  const sameLanguage = voices.filter(voice => normalized(voice.language).split('-')[0] === key.split('-')[0]);
  const exact = sameLanguage.filter(voice => normalized(voice.language) === key || normalized(voice.language).startsWith(`${key}-`));
  const regionalFallback = sameLanguage.filter(voice => !exact.includes(voice));
  // Some Android engines include “network” in the identifier. Prefer other
  // voices when possible; the identifier alone is not a guarantee of offline use.
  const network = (voice: Speech.Voice) => /(?:[-#_])(network|online)$/i.test(voice.identifier);
  const ordered = (items: Speech.Voice[]) => [...items].sort((a, b) =>
    Number(network(a)) - Number(network(b)) || Number(b.quality === 'Enhanced') - Number(a.quality === 'Enhanced'));
  const candidates: VoiceCandidate[] = [];
  const identifiers = new Set<string>();
  const addVoices = (items: Speech.Voice[], fallback: boolean, limit: number) => {
    let added = 0;
    for (const voice of ordered(items)) {
      if (voice.identifier && !identifiers.has(voice.identifier)) {
        identifiers.add(voice.identifier);
        candidates.push({ voice: voice.identifier, fallback });
        if (++added === limit) break;
      }
    }
  };
  addVoices(exact, false, 3);
  // Only use the engine default if the list was unavailable or the language is
  // present. Otherwise Android may silently speak in the device's language.
  if (!voices.length || sameLanguage.length) candidates.push({ fallback: true });
  addVoices(regionalFallback, true, 2);
  return candidates;
}

export function playStarterSpeech(locale: string, text: string, rate: number, onError?: () => void, onVoiceFallback?: () => void) {
  const request = ++requestId;
  queue = queue.catch(() => undefined).then(async () => {
    if (request !== requestId) return;
    await Speech.stop().catch(() => undefined);
    if (request !== requestId) return;
    const candidates = await findVoices(locale);
    if (request !== requestId) return;
    if (!candidates.length) { onError?.(); return; }

    let index = 0;
    const attempt = () => {
      if (request !== requestId) return;
      const candidate = candidates[index++];
      if (!candidate) { onError?.(); return; }
      let failed = false;
      const retry = () => {
        if (failed || request !== requestId) return;
        failed = true;
        // Serialize retries with stops and newer requests. A late failure must
        // never replay an old sentence after the learner has moved on.
        queue = queue.catch(() => undefined).then(() => { if (request === requestId) attempt(); });
      };
      try {
        Speech.speak(text, {
          language: speechTagFor(locale),
          ...(candidate.voice ? { voice: candidate.voice } : {}),
          rate,
          onStart: () => { if (!failed && request === requestId && candidate.fallback) onVoiceFallback?.(); },
          onError: retry,
        });
      } catch { retry(); }
    };
    attempt();
  });
  return queue;
}
export function stopStarterSpeech() {
  const request = ++requestId;
  queue = queue.catch(() => undefined).then(async () => { if (request === requestId) await Speech.stop().catch(() => undefined); });
  return queue;
}
