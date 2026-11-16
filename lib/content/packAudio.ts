import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import { CONTENT_RELEASE_BASE } from './audioRelease';

/**
 * Pre-rendered recordings shipped with content packs. `tryPlayRecorded` plays the recording for a
 * sentence when one is registered and returns true; otherwise callers fall back to device TTS.
 *
 * Two URI forms are accepted:
 *   • a plain https URL (one MP3 per sentence, e.g. a Supabase Storage object), or
 *   • `milo-segment:<bundle>.mp3?start=<ms>&dur=<ms>` — a slice of one MP3 per pack, hosted as a
 *     normal GitHub release asset. 36 bundles instead of 15 243 objects, so no paid storage and no
 *     service-role secret is needed. Bundles are cached locally after the first download.
 */
const RELEASE_BASE = CONTENT_RELEASE_BASE;
const SEGMENT = /^milo-segment:([A-Za-z0-9._-]+\.mp3)\?start=(\d+)&dur=(\d+)$/;

type Recording = { url: string } | { file: string; startMs: number; durationMs: number };
const recordings = new Map<string, Recording>();
const key = (text: string) => text.normalize('NFC').replace(/\s+/g, ' ').trim().toLowerCase();

export function registerPackAudio(text: string, url: string): void {
  const match = SEGMENT.exec(url);
  recordings.set(key(text), match
    ? { file: match[1], startMs: Number(match[2]), durationMs: Number(match[3]) }
    : { url });
}
export function hasRecordedAudio(text: string): boolean { return recordings.has(key(text)); }

let current: AudioPlayer | null = null;
let segmentTimer: ReturnType<typeof setTimeout> | null = null;
const downloads = new Map<string, Promise<string | null>>();

/** Download a bundle once and keep it in the app cache (offline after the first play). */
async function cachedBundle(file: string): Promise<string | null> {
  const cached = downloads.get(file);
  if (cached) return cached;
  const task = (async () => {
    const dir = `${FileSystem.cacheDirectory ?? ''}milo-audio/`;
    const target = `${dir}${file}`;
    try {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true }).catch(() => undefined);
      const info = await FileSystem.getInfoAsync(target);
      if (info.exists && 'size' in info && typeof info.size === 'number' && info.size > 0) return target;
      const result = await FileSystem.downloadAsync(`${RELEASE_BASE}/${file}`, target);
      return result?.uri ?? target;
    } catch { return null; }
  })();
  downloads.set(file, task);
  task.then(local => { if (!local) downloads.delete(file); });
  return task;
}

/** expo-audio needs the source loaded before seekTo() is reliable. */
async function waitUntilLoaded(player: AudioPlayer): Promise<boolean> {
  if (player.isLoaded) return true;
  return new Promise(resolve => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let subscription: { remove(): void } | null = null;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      try { subscription?.remove(); } catch { /* already released */ }
      resolve(ok);
    };
    subscription = player.addListener('playbackStatusUpdate', status => {
      if (status.isLoaded) finish(true);
    });
    timer = setTimeout(() => finish(player.isLoaded), 4000);
  });
}

export async function tryPlayRecorded(text: string, rate = 1): Promise<boolean> {
  const rec = recordings.get(key(text));
  if (!rec) return false;
  try {
    stopRecorded();
    let uri: string;
    let segment: { startMs: number; durationMs: number } | null = null;
    if ('url' in rec) {
      uri = rec.url;
    } else if (Platform.OS === 'web') {
      uri = `${RELEASE_BASE}/${rec.file}`; // web has no FileSystem; let the browser download it
      segment = rec;
    } else {
      const local = await cachedBundle(rec.file);
      if (!local) return false;
      uri = local;
      segment = rec;
    }
    const player = createAudioPlayer({ uri }, { downloadFirst: Platform.OS === 'web' });
    current = player;
    if (!(await waitUntilLoaded(player))) return false;
    if (segment) await player.seekTo(segment.startMs / 1000);
    if (rate !== 1) player.setPlaybackRate(Math.max(0.5, Math.min(1.5, rate)));
    player.play();
    if (segment) {
      segmentTimer = setTimeout(() => {
        try { current?.pause(); } catch { /* already released */ }
      }, Math.max(120, segment.durationMs / Math.max(0.5, rate)));
    }
    return true;
  } catch { return false; }
}

export function stopRecorded(): void {
  if (segmentTimer) { clearTimeout(segmentTimer); segmentTimer = null; }
  try { current?.pause(); current?.remove(); } catch { /* already released */ }
  current = null;
}
