import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

/**
 * Pre-rendered recordings shipped with content packs. `tryPlayRecorded` plays the recording for a
 * sentence when one is registered and returns true; otherwise callers fall back to device TTS.
 */
const recordings = new Map<string, string>();
const key = (text: string) => text.normalize('NFC').replace(/\s+/g, ' ').trim().toLowerCase();

export function registerPackAudio(text: string, url: string): void { recordings.set(key(text), url); }
export function hasRecordedAudio(text: string): boolean { return recordings.has(key(text)); }

let current: AudioPlayer | null = null;
export async function tryPlayRecorded(text: string, rate = 1): Promise<boolean> {
  const url = recordings.get(key(text));
  if (!url) return false;
  try {
    stopRecorded();
    const player = createAudioPlayer({ uri: url });
    current = player;
    if (rate !== 1) player.setPlaybackRate(Math.max(0.5, Math.min(1.5, rate)));
    player.play();
    return true;
  } catch { return false; }
}
export function stopRecorded(): void {
  try { current?.pause(); current?.remove(); } catch { /* already released */ }
  current = null;
}
