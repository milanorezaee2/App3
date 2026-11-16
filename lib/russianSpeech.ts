import * as Speech from 'expo-speech';
import { playPreferredRecording, playFallbackRecording, noteSpeechSuccess } from '@/lib/content/speechFallback';
import { speechTagFor } from './speechLanguage';
import { voiceFor } from './voiceRotation';

// Serialize stop/start requests: an asynchronous stop must not cancel the next
// sentence after it has started. Only the most recent request may speak.
let requestId = 0;
let queue: Promise<void> = Promise.resolve();
/**
 * Whether our own utterance is (or should be) audible right now.
 *
 * `Speech.stop()` immediately before `Speech.speak()` is what made the very first Russian word
 * disappear on some devices: the engine processes the stop asynchronously and swallows the utterance
 * queued right behind it. We therefore only interrupt audio we know is playing.
 */
let audible = false;
let engineWarmed = false;

function enqueue(operation: () => Promise<void>): Promise<void> {
  queue = queue.catch(() => undefined).then(operation);
  return queue;
}

/**
 * Warm the device speech engine while the word list is still loading.
 *
 * Android builds its TTS engine on the first request and iOS loads the voice list lazily; without this
 * the first word started seconds after the screen appeared (or not at all on a cold engine).
 */
export function warmRussianSpeech(): void {
  if (engineWarmed) return;
  engineWarmed = true;
  try {
    if (typeof Speech.getAvailableVoicesAsync === 'function') {
      void Speech.getAvailableVoicesAsync().catch(() => [] as Speech.Voice[]);
    }
  } catch { /* an engine without a voice list still speaks with its default voice */ }
}

/** Stop only when something of ours is playing; keeps the queue honest about what is audible. */
async function stopIfAudible(): Promise<void> {
  let speaking = audible;
  if (!speaking && typeof Speech.isSpeakingAsync === 'function') {
    speaking = await Speech.isSpeakingAsync().catch(() => false);
  }
  if (!speaking) return;
  audible = false;
  await Speech.stop().catch(() => undefined);
}

export function playRussianSpeech(text: string, rate: number, onError?: () => void, onDone?: () => void): Promise<void> {
  const request = ++requestId;
  return enqueue(async () => {
    if (request !== requestId) return;
    await stopIfAudible();
    if (request !== requestId) return;
    // Content-pack recordings win over the device voice (same voice on every phone, no TTS dependency).
    // Device TTS stays primary; recordings are used only on devices that opted in.
    if (await playPreferredRecording(text, rate / 0.78)) { onDone?.(); return; }
    if (request !== requestId) return;
    const voice = await voiceFor('ru-RU', text).catch(() => undefined);
    if (request !== requestId) return;
    const say = (withVoice: boolean) => {
      try {
        audible = true;
        Speech.speak(text, {
          language: speechTagFor('ru-RU'),
          ...(withVoice && voice ? { voice } : {}),
          rate,
          onDone: () => {
            if (request === requestId) { audible = false; noteSpeechSuccess(); onDone?.(); }
          },
          onStopped: () => {
            if (request === requestId) { audible = false; onError?.(); }
          },
          // A rotated voice that fails to start falls back to the device default once,
          // then to a recording on devices whose engine is unreliable.
          onError: () => {
            if (request !== requestId) return;
            if (withVoice && voice) { say(false); return; }
            audible = false;
            void playFallbackRecording(text, rate / 0.78).then(ok => { if (request === requestId && !ok) onError?.(); });
          },
        });
      } catch {
        if (request !== requestId) return;
        if (withVoice && voice) { say(false); return; }
        audible = false;
        void playFallbackRecording(text, rate / 0.78).then(ok => { if (request === requestId && !ok) onError?.(); });
      }
    };
    say(true);
  });
}

export function stopRussianSpeech(): Promise<void> {
  const request = ++requestId;
  audible = false;
  return enqueue(async () => {
    if (request !== requestId) return;
    await Speech.stop().catch(() => undefined);
  });
}
