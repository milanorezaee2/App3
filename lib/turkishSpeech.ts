import * as Speech from 'expo-speech';
import { playPreferredRecording, playFallbackRecording, noteSpeechSuccess } from '@/lib/content/speechFallback';
import { speechTagFor } from './speechLanguage';
import { voiceFor } from './voiceRotation';

// Serialize stop/start requests: an asynchronous stop must not cancel the next
// sentence after it has started. Only the most recent request may speak.
let requestId = 0;
let queue: Promise<void> = Promise.resolve();

function enqueue(operation: () => Promise<void>): Promise<void> {
  queue = queue.catch(() => undefined).then(operation);
  return queue;
}

export function playTurkishSpeech(text: string, rate: number, onError?: () => void): Promise<void> {
  const request = ++requestId;
  return enqueue(async () => {
    if (request !== requestId) return;
    await Speech.stop().catch(() => undefined);
    if (request !== requestId) return;
    // Content-pack recordings win over the device voice (same voice on every phone, no TTS dependency).
    // Device TTS stays primary; recordings are used only on devices that opted in.
    if (await playPreferredRecording(text, rate / 0.78)) return;
    if (request !== requestId) return;
    const voice = await voiceFor('tr-TR', text).catch(() => undefined);
    if (request !== requestId) return;
    const say = (withVoice: boolean) => {
      try {
        Speech.speak(text, {
          language: speechTagFor('tr-TR'),
          ...(withVoice && voice ? { voice } : {}),
          rate,
          onDone: () => { if (request === requestId) noteSpeechSuccess(); },
          // A rotated voice that fails to start falls back to the device default once,
          // then to a recording on devices whose engine is unreliable.
          onError: () => {
            if (request !== requestId) return;
            if (withVoice && voice) { say(false); return; }
            void playFallbackRecording(text, rate / 0.78).then(ok => { if (request === requestId && !ok) onError?.(); });
          },
        });
      } catch {
        if (request !== requestId) return;
        if (withVoice && voice) { say(false); return; }
        void playFallbackRecording(text, rate / 0.78).then(ok => { if (request === requestId && !ok) onError?.(); });
      }
    };
    say(true);
  });
}

export function stopTurkishSpeech(): Promise<void> {
  const request = ++requestId;
  return enqueue(async () => {
    if (request !== requestId) return;
    await Speech.stop().catch(() => undefined);
  });
}
