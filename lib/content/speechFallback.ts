import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { tryPlayRecorded } from './packAudio';

/**
 * Per-device speech fallback.
 *
 * The device TTS engine sounds excellent on most phones, so it stays the primary voice. A small
 * share of devices have a broken / choppy engine (missing voice data, network voices, engine bugs).
 * Those devices can switch to the pre-rendered pack recordings:
 *   • manually — a toggle in Profile → حساب,
 *   • automatically — after two hard failures (onError or a playback cut short), persisted.
 *
 * A "choppy but playing" engine cannot be detected reliably from JavaScript, which is why the
 * manual toggle is the dependable fix and the auto-switch is only a safety net.
 */
const KEY = 'milo_recorded_speech_v1';
const FAILURES_TO_SWITCH = 3;

let cached: boolean | null = null;
let consecutiveFailures = 0;

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
  try {
    if (Platform.OS === 'web') window.localStorage.setItem(KEY, value ? '1' : '0');
    else await AsyncStorage.setItem(KEY, value ? '1' : '0');
  } catch { /* keep the in-memory choice for this session */ }
}

export function noteSpeechSuccess(): void { consecutiveFailures = 0; }

/** A device-TTS failure; two in a row turn the recorded fallback on for this device. */
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
