import * as Speech from 'expo-speech';
import { playPreferredRecording, playFallbackRecording, noteSpeechSuccess } from '@/lib/content/speechFallback';
import { speechTagFor } from './speechLanguage';
import { voiceFor } from './voiceRotation';

/**
 * One speech engine per course language.
 *
 * The Russian vocabulary lab needed three fixes that every language course needs:
 *   • warm the device engine while the word list loads (Android builds it on the first request),
 *   • never call `stop()` before the first utterance (it swallowed the first word),
 *   • serialise stop/start so an asynchronous stop cannot cancel the sentence queued behind it.
 * Keeping one implementation means German behaves exactly like Russian.
 */
export interface LanguageSpeech {
  play(text: string, rate: number, onError?: () => void, onDone?: () => void): Promise<void>;
  stop(): Promise<void>;
  warm(): void;
}

/** Recordings are rendered at 0.78× the requested rate; keep the same conversion for every course. */
const RECORDING_RATE_SCALE = 0.78;

export function createLanguageSpeech(locale: string): LanguageSpeech {
  let requestId = 0;
  let queue: Promise<void> = Promise.resolve();
  /** Whether our own utterance is (or should be) audible, so a new word only interrupts real audio. */
  let audible = false;
  let engineWarmed = false;

  function enqueue(operation: () => Promise<void>): Promise<void> {
    queue = queue.catch(() => undefined).then(operation);
    return queue;
  }

  async function stopIfAudible(): Promise<void> {
    let speaking = audible;
    if (!speaking && typeof Speech.isSpeakingAsync === 'function') {
      speaking = await Speech.isSpeakingAsync().catch(() => false);
    }
    if (!speaking) return;
    audible = false;
    await Speech.stop().catch(() => undefined);
  }

  function warm(): void {
    if (engineWarmed) return;
    engineWarmed = true;
    try {
      if (typeof Speech.getAvailableVoicesAsync === 'function') {
        void Speech.getAvailableVoicesAsync().catch(() => [] as Speech.Voice[]);
      }
    } catch { /* an engine without a voice list still speaks with its default voice */ }
  }

  function play(text: string, rate: number, onError?: () => void, onDone?: () => void): Promise<void> {
    const request = ++requestId;
    return enqueue(async () => {
      if (request !== requestId) return;
      await stopIfAudible();
      if (request !== requestId) return;
      // Content-pack recordings win over the device voice on devices that opted in;
      // the device TTS stays primary everywhere else.
      if (await playPreferredRecording(text, rate / RECORDING_RATE_SCALE)) { onDone?.(); return; }
      if (request !== requestId) return;
      const voice = await voiceFor(locale, text).catch(() => undefined);
      if (request !== requestId) return;
      const say = (withVoice: boolean) => {
        try {
          audible = true;
          Speech.speak(text, {
            language: speechTagFor(locale),
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
              void playFallbackRecording(text, rate / RECORDING_RATE_SCALE).then(ok => {
                if (request === requestId && !ok) onError?.();
              });
            },
          });
        } catch {
          if (request !== requestId) return;
          if (withVoice && voice) { say(false); return; }
          audible = false;
          void playFallbackRecording(text, rate / RECORDING_RATE_SCALE).then(ok => {
            if (request === requestId && !ok) onError?.();
          });
        }
      };
      say(true);
    });
  }

  function stop(): Promise<void> {
    const request = ++requestId;
    audible = false;
    return enqueue(async () => {
      if (request !== requestId) return;
      await Speech.stop().catch(() => undefined);
    });
  }

  return { play, stop, warm };
}
