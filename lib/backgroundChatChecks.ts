import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { adminClient } from './educationAdmin';
import { MANAGEMENT_BUILD } from './features';
import { ensureChatIdentity } from './conversations';
import {
  authStorageKey,
  startAndroidChatForegroundService,
  getLastChatServiceFailure,
  stopAndroidChatForegroundServiceForClient,
} from './chatForegroundService';
import { getChatForegroundServiceStatus, isChatForegroundServiceConfigured } from '@/modules/milo-chat-foreground';

/** Retained for old installed builds and the non-Android fallback. */
export const BACKGROUND_CHAT_TASK = 'milo-background-chat-check';
export const BACKGROUND_CHAT_ENABLED_KEY = 'milo_background_chat_check_v1';
const BACKGROUND_CHAT_START_ATTEMPT_KEY = 'milo_background_chat_start_attempt_v1';
const LAST_SEEN_PREFIX = 'milo_background_chat_last_seen_v1';
const CHAT_CHANNEL = 'milo-chat';
export const BACKGROUND_CHAT_INTERVAL_MINUTES = 15;
let reconcileInFlight: Promise<void> | null = null;

export type BackgroundChatStatus =
  | 'enabled'
  | 'disabled'
  | 'permission-denied'
  | 'restricted'
  | 'unsupported';

type MessageRow = {
  id?: string;
  conversation_id?: string;
  sender_id?: string;
  message_type?: string;
  created_at?: string;
};

function client(): SupabaseClient {
  return MANAGEMENT_BUILD ? adminClient() : supabase;
}

async function ensureChatChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHAT_CHANNEL, {
    name: 'پیام‌ها و درخواست‌های چت',
    description: 'پیام‌های خصوصی و درخواست‌های پشتیبانی',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 180, 100, 180],
    lightColor: '#635BFF',
    sound: 'default',
    enableVibrate: true,
    showBadge: true,
  });
}

async function signedInUserId(active: SupabaseClient): Promise<string | null> {
  try {
    const { data } = await active.auth.getSession();
    return data.session?.user?.id ?? null;
  } catch {
    return null;
  }
}

async function resolveAndroidUserId(active: SupabaseClient): Promise<string | null> {
  const current = await signedInUserId(active);
  if (current || MANAGEMENT_BUILD) return current;
  try {
    return (await ensureChatIdentity()).id;
  } catch {
    return null;
  }
}

async function unregisterLegacyTask(): Promise<void> {
  try {
    if (await TaskManager.isTaskRegisteredAsync(BACKGROUND_CHAT_TASK)) {
      await BackgroundTask.unregisterTaskAsync(BACKGROUND_CHAT_TASK);
    }
  } catch {
    // An old WorkManager registration is best-effort cleanup only.
  }
}

async function senderName(active: SupabaseClient, senderId: string | undefined): Promise<string> {
  if (!senderId) return 'مخاطب شما';
  try {
    const { data } = await active.from('profiles').select('display_name').eq('id', senderId).maybeSingle();
    const name = String(data?.display_name || '').trim();
    return name ? name.slice(0, 70) : 'مخاطب شما';
  } catch {
    return 'مخاطب شما';
  }
}

export async function isBackgroundChatChecksEnabled(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(BACKGROUND_CHAT_ENABLED_KEY)) === '1';
  } catch {
    return false;
  }
}

export async function backgroundChatChecksStatus(): Promise<BackgroundChatStatus> {
  if (Platform.OS === 'web') return 'unsupported';
  if (!await isBackgroundChatChecksEnabled()) return 'disabled';
  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) return 'permission-denied';

  if (Platform.OS === 'android') {
    try {
      const active = client();
      return await isChatForegroundServiceConfigured(authStorageKey(active)) ? 'enabled' : 'restricted';
    } catch {
      return 'restricted';
    }
  }

  const status = await BackgroundTask.getStatusAsync();
  return status === BackgroundTask.BackgroundTaskStatus.Available ? 'enabled' : 'restricted';
}

/**
 * Android no longer polls: the explicitly enabled native service listens to
 * Supabase Realtime. Keep this worker inert on Android so an old WorkManager
 * task cannot generate delayed duplicates after upgrading.
 */
export async function runBackgroundChatCheck(): Promise<number> {
  if (Platform.OS === 'web' || Platform.OS === 'android') return 0;
  if (!await isBackgroundChatChecksEnabled()) return 0;
  const active = client();
  const userId = await signedInUserId(active);
  if (!userId) return 0;

  const seenKey = `${LAST_SEEN_PREFIX}:${userId}`;
  const since = await AsyncStorage.getItem(seenKey);
  const startedAt = new Date().toISOString();
  if (!since) {
    await AsyncStorage.setItem(seenKey, startedAt);
    return 0;
  }

  const { data, error } = await active
    .from('messages')
    .select('id,conversation_id,sender_id,message_type,created_at')
    .gt('created_at', since)
    .neq('sender_id', userId)
    .order('created_at', { ascending: true })
    .limit(20);
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as MessageRow[];
  if (!rows.length) return 0;

  const newest = rows[rows.length - 1];
  const conversationId = newest.conversation_id;
  if (!conversationId) return 0;
  const name = await senderName(active, newest.sender_id);
  const count = rows.length;
  const title = count > 1
    ? `${count} پیام تازه`
    : newest.message_type === 'voice'
      ? `پیام صوتی تازه از ${name}`
      : `پیام تازه از ${name}`;

  await ensureChatChannel();
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body: count > 1 ? `آخرین پیام از ${name}` : 'برای خواندن، میلو را باز کنید.',
      data: {
        conversationId,
        route: `/conversations/human/${conversationId}`,
        eventId: `background:${newest.id ?? conversationId}`,
      },
      sound: 'default',
    },
    trigger: null,
  });
  await AsyncStorage.setItem(seenKey, newest.created_at ?? startedAt);
  return count;
}

/** User opt-in: native persistent WebSocket on Android, existing scheduler elsewhere. */
let lastFailure = '';
function setLastBackgroundChatFailure(reason: string) { lastFailure = reason; }
/** Why the last enable attempt failed (Android), for the settings card. */
export function lastBackgroundChatFailure(): string { return lastFailure || getLastChatServiceFailure(); }

export async function enableBackgroundChatChecks(): Promise<BackgroundChatStatus> {
  if (Platform.OS === 'web') return 'unsupported';
  lastFailure = '';
  await ensureChatChannel();
  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) {
    const requested = await Notifications.requestPermissionsAsync();
    if (!requested.granted) return 'permission-denied';
  }

  if (Platform.OS === 'android') {
    const active = client();
    const userId = await resolveAndroidUserId(active);
    if (!userId) { setLastBackgroundChatFailure('ابتدا وارد حساب شوید؛ بدون ورود، اعلان پیام فعال نمی‌شود.'); return 'restricted'; }
    await unregisterLegacyTask();
    try {
      const started = await startAndroidChatForegroundService(active, userId, MANAGEMENT_BUILD);
      if (!started) {
        await AsyncStorage.removeItem(BACKGROUND_CHAT_ENABLED_KEY).catch(() => undefined);
        await stopAndroidChatForegroundServiceForClient(active).catch(() => undefined);
        return 'restricted';
      }
      await AsyncStorage.setItem(BACKGROUND_CHAT_ENABLED_KEY, '1');
      return 'enabled';
    } catch (cause) {
      setLastBackgroundChatFailure(`خطا هنگام فعال‌سازی: ${cause instanceof Error ? cause.message : String(cause)}`);
      await AsyncStorage.removeItem(BACKGROUND_CHAT_ENABLED_KEY).catch(() => undefined);
      await stopAndroidChatForegroundServiceForClient(active).catch(() => undefined);
      return 'restricted';
    }
  }

  const status = await BackgroundTask.getStatusAsync();
  if (status !== BackgroundTask.BackgroundTaskStatus.Available) return 'restricted';
  await BackgroundTask.registerTaskAsync(BACKGROUND_CHAT_TASK, {
    minimumInterval: BACKGROUND_CHAT_INTERVAL_MINUTES,
  });
  await AsyncStorage.setItem(BACKGROUND_CHAT_ENABLED_KEY, '1');
  const userId = await signedInUserId(client());
  if (userId) await AsyncStorage.setItem(`${LAST_SEEN_PREFIX}:${userId}`, new Date().toISOString());
  return 'enabled';
}

export async function disableBackgroundChatChecks(): Promise<BackgroundChatStatus> {
  if (Platform.OS === 'web') return 'unsupported';
  await AsyncStorage.removeItem(BACKGROUND_CHAT_ENABLED_KEY);
  await unregisterLegacyTask();
  if (Platform.OS === 'android') {
    try { await stopAndroidChatForegroundServiceForClient(client()); } catch { /* no active session to stop */ }
  }
  return 'disabled';
}

/** Re-establishes an opted-in native connection when the user opens the app. */
export async function reconcileBackgroundChatChecks(): Promise<void> {
  if (reconcileInFlight) return reconcileInFlight;
  const attempt = reconcileBackgroundChatChecksOnce();
  reconcileInFlight = attempt;
  try {
    await attempt;
  } finally {
    if (reconcileInFlight === attempt) reconcileInFlight = null;
  }
}

async function reconcileBackgroundChatChecksOnce(): Promise<void> {
  if (Platform.OS === 'web' || !await isBackgroundChatChecksEnabled()) return;
  try {
    await ensureChatChannel();
    if (Platform.OS === 'android') {
      await unregisterLegacyTask();
      const active = client();
      const permission = await Notifications.getPermissionsAsync();
      // A missing permission or a session that is still being restored must not
      // flip the user's opt-in off; the next launch/resume retries.
      if (!permission.granted) return;
      const userId = await resolveAndroidUserId(active);
      if (!userId) return;
      // Crash guard: if the previous native start never reported back (process
      // died mid-start), skip exactly one automatic retry instead of looping.
      const pendingAttempt = await AsyncStorage.getItem(BACKGROUND_CHAT_START_ATTEMPT_KEY).catch(() => null);
      if (pendingAttempt === '1') {
        await AsyncStorage.removeItem(BACKGROUND_CHAT_START_ATTEMPT_KEY).catch(() => undefined);
        return;
      }
      await AsyncStorage.setItem(BACKGROUND_CHAT_START_ATTEMPT_KEY, '1').catch(() => undefined);
      const started = await startAndroidChatForegroundService(active, userId, MANAGEMENT_BUILD).catch(() => false);
      await AsyncStorage.removeItem(BACKGROUND_CHAT_START_ATTEMPT_KEY).catch(() => undefined);
      if (!started) {
        // Keep the opt-in; the settings card shows the concrete reason.
        return;
      }
      return;
    }

    const registered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_CHAT_TASK);
    if (!registered) {
      await BackgroundTask.registerTaskAsync(BACKGROUND_CHAT_TASK, {
        minimumInterval: BACKGROUND_CHAT_INTERVAL_MINUTES,
      });
    }
  } catch {
    // A denied permission, expired session or restricted device is reported by the settings card.
  }
}

if (Platform.OS !== 'web') {
  TaskManager.defineTask(BACKGROUND_CHAT_TASK, async () => {
    try {
      await runBackgroundChatCheck();
      return BackgroundTask.BackgroundTaskResult.Success;
    } catch {
      return BackgroundTask.BackgroundTaskResult.Failed;
    }
  });
}
