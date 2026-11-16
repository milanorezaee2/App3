import { createLanguageSpeech } from './languageSpeech';

/**
 * German course speech — the same engine the Russian course uses (warm-up, single audible stop,
 * serialised queue) with the German locale.
 */
const speech = createLanguageSpeech('de-DE');

/** Warm the engine while the word list loads, so the first German word is audible immediately. */
export function warmGermanSpeech(): void {
  speech.warm();
}

export function playGermanSpeech(text: string, rate: number, onError?: () => void, onDone?: () => void): Promise<void> {
  return speech.play(text, rate, onError, onDone);
}

export function stopGermanSpeech(): Promise<void> {
  return speech.stop();
}
