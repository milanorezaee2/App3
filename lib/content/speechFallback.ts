import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { tryPlayRecorded } from './packAudio';

/**
 * Per-device speech fallback.
 *
 * The device TTS engine (the phone's own voice) is the DEFAULT narrator everywhere, including the
 * German word lab: a word is spoken once by the phone, then its Persian meaning. Pre-rendered pack
 * recordings are an OPTION, never the starting point:
 *   • the learner can pick them at any time — the «صدا» control in the word lab or Profile → حساب,
 *   • a device whose engine fails three times in a row is switched over as a safety net, and the UI
 *     is told through `subscribeSpeechSource` so the choice is visible instead of silent.
 *
 * A "choppy but playing" engine cannot be detected reliably from JavaScript, which is why the manual
 * choice is the dependable fix and the auto-switch is only a safety net.
 */
const KEY = 'milo_recorded_speech_v1';
const FAILURES_TO_SWITCH = 3;

let cached: boolean | null = null;
let consecutiveFailures = 0;

type SpeechSourceListener = (useRecorded: boolean) => void;
const listeners = new Set<SpeechSourceListener>();

/** Screens that show a «صدا» choice subscribe here so an automatic switch is never invisible. */
export function subscribeSpeechSource(listener: SpeechSourceListener): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function publish(useRecorded: boolean): void {
  for (const listener of [...listeners]) {
    try { listener(useRecorded); } catch { /* a screen that unmounted must not break playback */ }
  }
}

async function read(): Promise<boolean> {
  try {
    return Platform.OS === 'web'
      ? window.localStorage.getItem(KEY) === '1'
      : (await AsyncStorage.getItem(KEY)) === '1';
  } catch { return false; }
}

/** Whether this device should use pre-rendered recordings when they exist. */
export async function prefersRecordedSpeech(): Promise<boolean> {
  if (cached === null) cached = await read();
  return cached;
}

/** Manual toggle from the profile screen. */
export async function setPrefersRecordedSpeech(value: boolean): Promise<void> {
  cached = value;
  if (value) consecutiveFailures = FAILURES_TO_SWITCH;
  publish(value);
  try {
    if (Platform.OS === 'web') window.localStorage.setItem(KEY, value ? '1' : '0');
    else await AsyncStorage.setItem(KEY, value ? '1' : '0');
  } catch { /* keep the in-memory choice for this session */ }
}

export function noteSpeechSuccess(): void { consecutiveFailures = 0; }

/** A device-TTS failure; three in a row turn the recorded fallback on for this device. */
export async function noteSpeechFailure(): Promise<void> {
  consecutiveFailures += 1;
  if (consecutiveFailures >= FAILURES_TO_SWITCH && !(await prefersRecordedSpeech())) {
    await setPrefersRecordedSpeech(true);
  }
}

/** Use a recording first, but ONLY on devices that opted in or were auto-switched. */
export async function playPreferredRecording(text: string, rate: number): Promise<boolean> {
  if (!(await prefersRecordedSpeech())) return false;
  return tryPlayRecorded(text, rate);
}

/** Last resort when the device engine failed: remember the failure and try the recording. */
export async function playFallbackRecording(text: string, rate: number): Promise<boolean> {
  await noteSpeechFailure();
  return tryPlayRecorded(text, rate);
}
