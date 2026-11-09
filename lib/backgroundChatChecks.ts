import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { adminClient } from './educationAdmin';
import { MANAGEMENT_BUILD } from './features';

/**
 * Chat alerts without Firebase.
 *
 * Android delivers remote push only through Google's FCM service, which needs a
 * Firebase project that cannot be created from Iran. Instead of a push token,
 * this module asks Android's own scheduler (WorkManager) to wake Milo about
 * every 15 minutes — the smallest interval Android allows — and to post a
 * **local** notification when the signed-in user received a new chat message.
 *
 * Consequences that the UI states plainly:
 *  - alerts can arrive up to ~15 minutes late, and battery saving can delay
 *    them further;
 *  - the message text itself is never copied or stored, only the fact that a
 *    message exists and who sent it.
 */

export const BACKGROUND_CHAT_TASK = 'milo-background-chat-check';
export const BACKGROUND_CHAT_ENABLED_KEY = 'milo_background_chat_check_v1';
const LAST_SEEN_PREFIX = 'milo_background_chat_last_seen_v1';
/** Matches the channel already declared in app.json and lib/chatNotifications.ts. */
const CHAT_CHANNEL = 'milo-chat';
/** Android refuses shorter background intervals; the value is in minutes. */
export const BACKGROUND_CHAT_INTERVAL_MINUTES = 15;

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
    description: 'بررسی دوره‌ای پیام‌های تازه و نمایش اعلان محلی',
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
  const status = await BackgroundTask.getStatusAsync();
  if (status !== BackgroundTask.BackgroundTaskStatus.Available) return 'restricted';
  return 'enabled';
}

/**
 * Runs one check. Returns how many new messages produced an alert.
 * The first run only records a starting point, so installing the feature never
 * announces week-old history.
 */
export async function runBackgroundChatCheck(): Promise<number> {
  if (Platform.OS === 'web') return 0;
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
  // Nothing new: leave the marker untouched. Moving it to "now" here would skip
  // messages whenever the server clock runs slightly ahead of the phone.
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

/** Asks for the notification permission, then registers the periodic check. */
export async function enableBackgroundChatChecks(): Promise<BackgroundChatStatus> {
  if (Platform.OS === 'web') return 'unsupported';
  await ensureChatChannel();
  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) {
    const requested = await Notifications.requestPermissionsAsync();
    if (!requested.granted) return 'permission-denied';
  }
  const status = await BackgroundTask.getStatusAsync();
  if (status !== BackgroundTask.BackgroundTaskStatus.Available) return 'restricted';
  await BackgroundTask.registerTaskAsync(BACKGROUND_CHAT_TASK, {
    minimumInterval: BACKGROUND_CHAT_INTERVAL_MINUTES,
  });
  await AsyncStorage.setItem(BACKGROUND_CHAT_ENABLED_KEY, '1');
  const userId = await signedInUserId(client());
  if (userId) {
    // Start counting from now so older messages never arrive as a burst.
    await AsyncStorage.setItem(`${LAST_SEEN_PREFIX}:${userId}`, new Date().toISOString());
  }
  return 'enabled';
}

export async function disableBackgroundChatChecks(): Promise<BackgroundChatStatus> {
  if (Platform.OS === 'web') return 'unsupported';
  await AsyncStorage.removeItem(BACKGROUND_CHAT_ENABLED_KEY);
  try {
    if (await TaskManager.isTaskRegisteredAsync(BACKGROUND_CHAT_TASK)) {
      await BackgroundTask.unregisterTaskAsync(BACKGROUND_CHAT_TASK);
    }
  } catch {
    // The flag is already off, so the worker does nothing even if unregistering fails.
  }
  return 'disabled';
}

/** Restores the registration after an app update or a device reboot. */
export async function reconcileBackgroundChatChecks(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    if (!await isBackgroundChatChecksEnabled()) return;
    await ensureChatChannel();
    const registered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_CHAT_TASK);
    if (!registered) {
      await BackgroundTask.registerTaskAsync(BACKGROUND_CHAT_TASK, {
        minimumInterval: BACKGROUND_CHAT_INTERVAL_MINUTES,
      });
    }
  } catch {
    // A denied permission or restricted device leaves the switch on and the UI
    // reports the real state instead of pretending alerts work.
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
