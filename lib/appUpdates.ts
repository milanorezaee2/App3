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
export const UPDATE_CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000;

export function installedVersion(): { package: string | null; code: number; name: string } {
  const code = Number.parseInt(Application.nativeBuildVersion || '0', 10);
  return { package: Application.applicationId, code: Number.isFinite(code) ? code : 0, name: Application.nativeApplicationVersion || '—' };
}

export function isUpdateSupported(): boolean {
  return Platform.OS === 'android' && isSupabaseConfigured() && Boolean(Application.applicationId);
}

/** Returns the newest release if it is newer than the installed build. */
export async function fetchAvailableUpdate(): Promise<AppRelease | null> {
  if (!isUpdateSupported()) return null;
  const installed = installedVersion();
  const { data, error } = await supabase.rpc('latest_app_release', { p_package_name: installed.package, p_platform: 'android' });
  if (error) {
    if (/Could not find the function|does not exist|schema cache/i.test(error.message)) return null;
    throw new Error('بررسی به‌روزرسانی انجام نشد؛ اتصال اینترنت را بررسی کنید.');
  }
  const release = (Array.isArray(data) ? data[0] : data) as AppRelease | undefined;
  if (!release || release.version_code <= installed.code) return null;
  return release;
}

/** Throttled automatic check for app start; honours a "later" choice unless mandatory. */
export async function checkForUpdateOnLaunch(): Promise<AppRelease | null> {
  if (!isUpdateSupported()) return null;
  try {
    const last = Number(await AsyncStorage.getItem(LAST_CHECK_KEY)) || 0;
    if (Date.now() - last < UPDATE_CHECK_INTERVAL_MS) return null;
    const release = await fetchAvailableUpdate();
    await AsyncStorage.setItem(LAST_CHECK_KEY, String(Date.now()));
    if (!release) return null;
    const skipped = await AsyncStorage.getItem(SKIPPED_KEY);
    if (!release.mandatory && skipped === release.id) return null;
    return release;
  } catch {
    return null;
  }
}

export async function skipUpdate(release: AppRelease): Promise<void> {
  await AsyncStorage.setItem(SKIPPED_KEY, release.id);
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
