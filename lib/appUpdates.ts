/**
 * Learner-side in-app updates (Android). The app asks the server for the
 * newest published release of its own package, downloads the APK into the
 * cache and hands it to the system installer.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import { Platform } from 'react-native';
import type { AppRelease } from './appReleases';
import { isSupabaseConfigured } from './pairing';
import { supabase } from './supabase';

const LAST_CHECK_KEY = 'milo_update_last_check_v1';
const SKIPPED_KEY = 'milo_update_skipped_v1';
const PENDING_INSTALL_KEY = 'milo_update_pending_install_v1';
const SEEN_VERSION_KEY = 'milo_update_seen_version_v1';
// Short debounce only: a release published by the admin must show up on the
// learner's next launch/resume, not hours later.
export const UPDATE_CHECK_INTERVAL_MS = 60 * 1000;
const SKIP_REMINDER_MS = 24 * 60 * 60 * 1000;

export function installedVersion(): { package: string | null; code: number; name: string } {
  const code = Number.parseInt(Application.nativeBuildVersion || '0', 10);
  return { package: Application.applicationId, code: Number.isFinite(code) ? code : 0, name: Application.nativeApplicationVersion || '—' };
}

export function isUpdateSupported(): boolean {
  return Platform.OS === 'android' && isSupabaseConfigured() && Boolean(Application.applicationId);
}

export class UpdateServerNotReadyError extends Error {
  constructor() { super('سرور به‌روزرسانی هنوز راه‌اندازی نشده است (SETUP-APP-UPDATES-ONCE.sql اجرا نشده).'); this.name = 'UpdateServerNotReadyError'; }
}

/** Newest published release for this package, regardless of the installed version. */
export async function fetchLatestRelease(): Promise<AppRelease | null> {
  if (!isUpdateSupported()) return null;
  const installed = installedVersion();
  const { data, error } = await supabase.rpc('latest_app_release', { p_package_name: installed.package, p_platform: 'android' });
  if (error) {
    if (/Could not find the function|does not exist|schema cache/i.test(error.message)) throw new UpdateServerNotReadyError();
    throw new Error(`بررسی به‌روزرسانی انجام نشد: ${error.message}`);
  }
  const release = (Array.isArray(data) ? data[0] : data) as AppRelease | undefined;
  return release ?? null;
}

/** Returns the newest release if it is newer than the installed build. */
export async function fetchAvailableUpdate(): Promise<AppRelease | null> {
  if (!isUpdateSupported()) return null;
  let release: AppRelease | null;
  try { release = await fetchLatestRelease(); } catch (cause) {
    if (cause instanceof UpdateServerNotReadyError) return null;
    throw cause;
  }
  if (!release || release.version_code <= installedVersion().code) return null;
  return release;
}

/** Throttled automatic check for app start; honours a "later" choice unless mandatory. */
export async function checkForUpdateOnLaunch(): Promise<AppRelease | null> {
  if (!isUpdateSupported()) return null;
  try {
    const last = Number(await AsyncStorage.getItem(LAST_CHECK_KEY)) || 0;
    if (Date.now() - last < UPDATE_CHECK_INTERVAL_MS) return null;
    await AsyncStorage.setItem(LAST_CHECK_KEY, String(Date.now()));
    const release = await fetchAvailableUpdate();
    if (!release) return null;
    const skippedRaw = await AsyncStorage.getItem(SKIPPED_KEY);
    if (!release.mandatory && skippedRaw) {
      const [skippedId, atRaw] = skippedRaw.split('|');
      const skippedAt = Number(atRaw) || 0;
      // "Later" hides this release for a day, then it is offered again.
      if (skippedId === release.id && Date.now() - skippedAt < SKIP_REMINDER_MS) return null;
    }
    return release;
  } catch {
    return null;
  }
}

export async function skipUpdate(release: AppRelease): Promise<void> {
  await AsyncStorage.setItem(SKIPPED_KEY, `${release.id}|${Date.now()}`);
}

export type DownloadProgress = (fraction: number) => void;

/** Downloads the APK to the cache and opens the Android package installer. */
export async function downloadAndInstall(release: AppRelease, onProgress?: DownloadProgress): Promise<void> {
  if (Platform.OS !== 'android') throw new Error('نصب به‌روزرسانی فقط روی اندروید پشتیبانی می‌شود.');
  const directory = `${FileSystem.cacheDirectory}updates/`;
  await FileSystem.makeDirectoryAsync(directory, { intermediates: true }).catch(() => undefined);
  const target = `${directory}milo-update-${release.version_code}.apk`;
  await FileSystem.deleteAsync(target, { idempotent: true }).catch(() => undefined);
  const download = FileSystem.createDownloadResumable(release.download_url, target, {}, progress => {
    if (!onProgress || !progress.totalBytesExpectedToWrite) return;
    onProgress(Math.min(1, progress.totalBytesWritten / progress.totalBytesExpectedToWrite));
  });
  const result = await download.downloadAsync();
  if (!result || (result.status && result.status >= 400)) throw new Error('دانلود فایل به‌روزرسانی ناموفق بود.');
  const info = await FileSystem.getInfoAsync(target);
  if (!info.exists || (release.file_size && info.size && Math.abs(info.size - release.file_size) > 1024)) {
    throw new Error('فایل دانلودشده ناقص است؛ دوباره تلاش کنید.');
  }
  onProgress?.(1);
  // Remembered so the next launch can show «what changed» for this release.
  await AsyncStorage.setItem(PENDING_INSTALL_KEY, JSON.stringify({ version_code: release.version_code, version_name: release.version_name, release_notes: release.release_notes || '' })).catch(() => undefined);
  const contentUri = await FileSystem.getContentUriAsync(target);
  await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
    data: contentUri,
    type: 'application/vnd.android.package-archive',
    flags: 1 | 268435456, // FLAG_GRANT_READ_URI_PERMISSION | FLAG_ACTIVITY_NEW_TASK
  });
}

export function formatSize(bytes: number | null | undefined): string {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
}

export interface InstalledUpdateInfo { version_code: number; version_name: string; release_notes: string }

/**
 * Called once per launch. Returns release info when the app has just been
 * updated to a newer build than the one last seen, so a «به‌روزرسانی انجام شد»
 * sheet can be shown. The first launch ever only records the current version.
 */
export async function consumeJustUpdated(): Promise<InstalledUpdateInfo | null> {
  if (Platform.OS === 'web') return null;
  const installed = installedVersion();
  if (!installed.code) return null;
  try {
    const seenRaw = await AsyncStorage.getItem(SEEN_VERSION_KEY);
    const seen = Number(seenRaw) || 0;
    await AsyncStorage.setItem(SEEN_VERSION_KEY, String(installed.code));
    if (seenRaw) {
      if (seen >= installed.code) return null;
    } else {
      // Older builds never recorded a version; an earlier update check proves
      // this is an upgrade rather than a fresh install.
      const ranBefore = await AsyncStorage.getItem(LAST_CHECK_KEY);
      if (!ranBefore) return null;
    }

    let info: InstalledUpdateInfo = { version_code: installed.code, version_name: installed.name, release_notes: '' };
    const pendingRaw = await AsyncStorage.getItem(PENDING_INSTALL_KEY);
    await AsyncStorage.removeItem(PENDING_INSTALL_KEY).catch(() => undefined);
    if (pendingRaw) {
      const pending = JSON.parse(pendingRaw) as Partial<InstalledUpdateInfo>;
      if (pending.version_code === installed.code && typeof pending.release_notes === 'string') info.release_notes = pending.release_notes;
    }
    if (!info.release_notes) {
      // Installed by hand (or notes not cached): the server knows this build's notes.
      try {
        const latest = await fetchLatestRelease();
        if (latest && latest.version_code === installed.code) info.release_notes = latest.release_notes || '';
      } catch { /* notes are optional */ }
    }
    return info;
  } catch {
    return null;
  }
}
