import * as Speech from 'expo-speech';
import { speechTagFor } from './speechLanguage';

// Serialize stop/start requests: an asynchronous stop must not cancel the next
// sentence after it has started. Only the most recent request may speak.
let requestId = 0;
let queue: Promise<void> = Promise.resolve();

function enqueue(operation: () => Promise<void>): Promise<void> {
  queue = queue.catch(() => undefined).then(operation);
  return queue;
}

export function playRussianSpeech(text: string, rate: number, onError?: () => void): Promise<void> {
  const request = ++requestId;
  return enqueue(async () => {
    if (request !== requestId) return;
    await Speech.stop().catch(() => undefined);
    if (request !== requestId) return;
    try {
      Speech.speak(text, {
        language: speechTagFor('ru-RU'),
        rate,
        onError: () => { if (request === requestId) onError?.(); },
      });
    } catch {
      if (request === requestId) onError?.();
    }
  });
}

export function stopRussianSpeech(): Promise<void> {
  const request = ++requestId;
  return enqueue(async () => {
    if (request !== requestId) return;
    await Speech.stop().catch(() => undefined);
  });
}
