import { createLanguageSpeech } from './languageSpeech';

/**
 * Russian course speech. The engine itself lives in `languageSpeech.ts` so the German lab
 * behaves identically; this module only fixes the locale and the exported names.
 */
const speech = createLanguageSpeech('ru-RU');

/**
 * Warm the device speech engine while the word list is still loading.
 *
 * Android builds its TTS engine on the first request and iOS loads the voice list lazily; without this
 * the first word started seconds after the screen appeared (or not at all on a cold engine).
 */
export function warmRussianSpeech(): void {
  speech.warm();
}

export function playRussianSpeech(text: string, rate: number, onError?: () => void, onDone?: () => void): Promise<void> {
  return speech.play(text, rate, onError, onDone);
}

export function stopRussianSpeech(): Promise<void> {
  return speech.stop();
}
