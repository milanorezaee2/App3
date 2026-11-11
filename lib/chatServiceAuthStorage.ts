import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getStoredChatServiceSession, stopChatForegroundService } from '@/modules/milo-chat-foreground';

function sessionUserId(value: unknown): string | null {
  if (!value || typeof value !== 'object') return null;
  const user = (value as { user?: { id?: unknown } }).user;
  return user && typeof user.id === 'string' ? user.id : null;
}

/** Auth storage used by learner and manager clients on native platforms. */
export function createChatServiceAuthStorage() {
  return {
    async getItem(key: string): Promise<string | null> {
      let stored = await AsyncStorage.getItem(key);
      if (Platform.OS !== 'android') return stored;

      try {
        const nativeSession = await getStoredChatServiceSession(key);
        if (!nativeSession) return stored;
        const fresh = JSON.parse(nativeSession) as Record<string, unknown>;
        const old = stored ? JSON.parse(stored) as Record<string, unknown> : null;
        const oldUserId = sessionUserId(old);
        const freshUserId = sessionUserId(fresh);
        if (oldUserId && freshUserId && oldUserId !== freshUserId) {
          await stopChatForegroundService(key).catch(() => false);
          return stored;
        }
        const merged = { ...(old || {}), ...fresh, user: fresh.user || old?.user };
        stored = JSON.stringify(merged);
        await AsyncStorage.setItem(key, stored);
      } catch {
        // A stale or unreadable native snapshot must not prevent sign-in.
      }
      return stored;
    },

    async setItem(key: string, value: string): Promise<void> {
      await AsyncStorage.setItem(key, value);
    },

    async removeItem(key: string): Promise<void> {
      if (Platform.OS === 'android') {
        await stopChatForegroundService(key).catch(() => false);
      }
      await AsyncStorage.removeItem(key);
    },
  };
}
