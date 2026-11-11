import { Platform } from 'react-native';
import * as FileSystemLegacy from 'expo-file-system/legacy';

/**
 * Phase 2: recorded (MP3) episodes with offline download.
 *
 * Audio files are hosted at EXPO_PUBLIC_PODCAST_AUDIO_URL (any static host or a
 * public Supabase Storage bucket). Layout:
 *   <base>/manifest.json            -> { episodes: { [episodeId]: { durationSec, cues?: number[] } } }
 *   <base>/<episodeId>.mp3          -> the recording
 * `cues` are optional segment start times (seconds) used to highlight the transcript.
 * When an episode has no recording, the player falls back to on-device TTS.
 */

export const PODCAST_AUDIO_BASE_URL = (process.env.EXPO_PUBLIC_PODCAST_AUDIO_URL || '').replace(/\/$/, '');
export const RECORDED_AUDIO_CONFIGURED = PODCAST_AUDIO_BASE_URL.length > 0;

export interface RecordedEpisodeInfo {
  durationSec?: number;
  cues?: number[];
}

export interface PodcastAudioManifest {
  episodes: Record<string, RecordedEpisodeInfo>;
}

let manifestCache: PodcastAudioManifest | null = null;
let manifestPromise: Promise<PodcastAudioManifest> | null = null;

export function loadAudioManifest(): Promise<PodcastAudioManifest> {
  if (manifestCache) return Promise.resolve(manifestCache);
  if (!RECORDED_AUDIO_CONFIGURED) return Promise.resolve({ episodes: {} });
  if (!manifestPromise) {
    manifestPromise = fetch(`${PODCAST_AUDIO_BASE_URL}/manifest.json`)
      .then(async response => {
        if (!response.ok) throw new Error(`manifest ${response.status}`);
        const parsed = (await response.json()) as Partial<PodcastAudioManifest>;
        manifestCache = { episodes: parsed.episodes && typeof parsed.episodes === 'object' ? parsed.episodes : {} };
        return manifestCache;
      })
      .catch(() => {
        manifestPromise = null;
        return { episodes: {} } as PodcastAudioManifest;
      });
  }
  return manifestPromise;
}

export const remoteEpisodeUrl = (episodeId: string) => `${PODCAST_AUDIO_BASE_URL}/${encodeURIComponent(episodeId)}.mp3`;

const DOWNLOAD_DIR = () => `${FileSystemLegacy.documentDirectory ?? ''}podcast/`;
const localPath = (episodeId: string) => `${DOWNLOAD_DIR()}${episodeId}.mp3`;

export const OFFLINE_DOWNLOADS_SUPPORTED = Platform.OS !== 'web' && !!FileSystemLegacy.documentDirectory;

async function ensureDir() {
  const info = await FileSystemLegacy.getInfoAsync(DOWNLOAD_DIR());
  if (!info.exists) await FileSystemLegacy.makeDirectoryAsync(DOWNLOAD_DIR(), { intermediates: true });
}

/** Local file URI when the episode has been downloaded, otherwise null. */
export async function getDownloadedEpisodeUri(episodeId: string): Promise<string | null> {
  if (!OFFLINE_DOWNLOADS_SUPPORTED) return null;
  try {
    const info = await FileSystemLegacy.getInfoAsync(localPath(episodeId));
    return info.exists && (info.size ?? 0) > 0 ? localPath(episodeId) : null;
  } catch {
    return null;
  }
}

export async function listDownloadedEpisodes(): Promise<Set<string>> {
  const result = new Set<string>();
  if (!OFFLINE_DOWNLOADS_SUPPORTED) return result;
  try {
    const info = await FileSystemLegacy.getInfoAsync(DOWNLOAD_DIR());
    if (!info.exists) return result;
    const names = await FileSystemLegacy.readDirectoryAsync(DOWNLOAD_DIR());
    names.forEach(name => { if (name.endsWith('.mp3')) result.add(name.slice(0, -4)); });
  } catch {
    // Treat unreadable storage as "nothing downloaded".
  }
  return result;
}

const activeDownloads = new Map<string, FileSystemLegacy.DownloadResumable>();

export async function downloadEpisode(episodeId: string, onProgress?: (fraction: number) => void): Promise<string> {
  if (!OFFLINE_DOWNLOADS_SUPPORTED) throw new Error('دانلود آفلاین فقط در اپ موبایل در دسترس است.');
  if (!RECORDED_AUDIO_CONFIGURED) throw new Error('آدرس فایل‌های صوتی پادکست تنظیم نشده است.');
  const existing = await getDownloadedEpisodeUri(episodeId);
  if (existing) return existing;
  await ensureDir();
  const resumable = FileSystemLegacy.createDownloadResumable(
    remoteEpisodeUrl(episodeId),
    localPath(episodeId),
    {},
    progress => {
      if (progress.totalBytesExpectedToWrite > 0) onProgress?.(progress.totalBytesWritten / progress.totalBytesExpectedToWrite);
    },
  );
  activeDownloads.set(episodeId, resumable);
  try {
    const result = await resumable.downloadAsync();
    if (!result || result.status < 200 || result.status >= 300) {
      await FileSystemLegacy.deleteAsync(localPath(episodeId), { idempotent: true });
      throw new Error('فایل صوتی این اپیزود هنوز منتشر نشده است.');
    }
    return result.uri;
  } finally {
    activeDownloads.delete(episodeId);
  }
}

export async function cancelDownload(episodeId: string) {
  const task = activeDownloads.get(episodeId);
  if (!task) return;
  try { await task.pauseAsync(); } catch { /* ignore */ }
  activeDownloads.delete(episodeId);
  await FileSystemLegacy.deleteAsync(localPath(episodeId), { idempotent: true }).catch(() => undefined);
}

export async function deleteDownloadedEpisode(episodeId: string) {
  if (!OFFLINE_DOWNLOADS_SUPPORTED) return;
  await FileSystemLegacy.deleteAsync(localPath(episodeId), { idempotent: true }).catch(() => undefined);
}

/** Best available recorded source: local download first, then the online file. Null when none. */
export async function resolveRecordedSource(episodeId: string): Promise<{ uri: string; offline: boolean; info: RecordedEpisodeInfo } | null> {
  const local = await getDownloadedEpisodeUri(episodeId);
  const manifest = await loadAudioManifest();
  const info = manifest.episodes[episodeId];
  if (local) return { uri: local, offline: true, info: info ?? {} };
  if (info && RECORDED_AUDIO_CONFIGURED) return { uri: remoteEpisodeUrl(episodeId), offline: false, info };
  return null;
}

/** Segment index for a playback position, using manifest cues when present. */
export function segmentIndexForTime(seconds: number, cues: number[] | undefined, segmentCount: number, durationSec: number | undefined) {
  if (cues && cues.length) {
    let index = 0;
    for (let i = 0; i < cues.length; i += 1) { if (seconds >= cues[i]) index = i; else break; }
    return Math.min(segmentCount - 1, index);
  }
  if (durationSec && durationSec > 0) return Math.min(segmentCount - 1, Math.floor((seconds / durationSec) * segmentCount));
  return 0;
}
