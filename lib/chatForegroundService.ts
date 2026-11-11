import Constants from 'expo-constants';
import { AppState, Platform } from 'react-native';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import {
  getChatForegroundServiceLastError,
  getChatForegroundServiceStatus,
  getStoredChatServiceSession,
  setChatServiceAppForegrounded,
  startChatForegroundService,
  stopChatForegroundService,
  type ChatForegroundServiceConfig,
} from '@/modules/milo-chat-foreground';
import { SUPABASE_PUBLIC_ANON_KEY, SUPABASE_PUBLIC_URL } from './supabaseConfig';
import { MANAGEMENT_BUILD } from './features';

export function authStorageKey(client: SupabaseClient): string {
  const auth = client.auth as typeof client.auth & { storageKey?: string };
  if (typeof auth.storageKey === 'string' && auth.storageKey) return auth.storageKey;
  if (MANAGEMENT_BUILD) return 'education-admin-session-v1';
  try {
    const ref = new URL(SUPABASE_PUBLIC_URL).hostname.split('.')[0];
    return `sb-${ref}-auth-token`;
  } catch {
    return 'sb-default-auth-token';
  }
}

function appScheme(): string {
  const configured = Constants.expoConfig?.scheme;
  if (Array.isArray(configured)) return configured.find(value => typeof value === 'string' && value.trim()) || 'companionenglish';
  return typeof configured === 'string' && configured.trim() ? configured.trim() : 'companionenglish';
}

function persistentSession(session: Session): Record<string, unknown> {
  return {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    expires_in: session.expires_in,
    token_type: session.token_type,
    user: session.user,
  };
}

/** Human-readable reason for the last failed start, shown by the settings card so a device problem is not reported as a battery restriction. */
let lastChatServiceFailure = '';
export function getLastChatServiceFailure(): string { return lastChatServiceFailure; }
function fail(reason: string): false { lastChatServiceFailure = reason; return false; }

export async function startAndroidChatForegroundService(
  client: SupabaseClient,
  userId: string,
  isAdmin = MANAGEMENT_BUILD,
): Promise<boolean> {
  lastChatServiceFailure = '';
  if (Platform.OS !== 'android') return fail('فقط روی اندروید در دسترس است.');
  if (!userId) return fail('ابتدا وارد حساب شوید.');
  if (!SUPABASE_PUBLIC_URL || !SUPABASE_PUBLIC_ANON_KEY) return fail('تنظیمات اتصال سرور در این نسخه موجود نیست.');
  const { data, error } = await client.auth.getSession();
  const session = data.session;
  if (error || !session) return fail('نشست ورود معتبر نیست؛ یک بار خارج و دوباره وارد شوید.');
  if (session.user.id !== userId) return fail('حساب فعال با نشست ذخیره‌شده یکی نیست؛ دوباره وارد شوید.');
  if (!session.access_token || !session.refresh_token) return fail('نشست ورود ناقص است؛ دوباره وارد شوید.');

  const config: ChatForegroundServiceConfig = {
    supabaseUrl: SUPABASE_PUBLIC_URL,
    anonKey: SUPABASE_PUBLIC_ANON_KEY,
    userId,
    storageKey: authStorageKey(client),
    session: persistentSession(session),
    appScheme: appScheme(),
    isAdmin,
    appForeground: AppState.currentState === 'active',
  };
  try {
    const accepted = await startChatForegroundService(config);
    if (!accepted) return fail('سیستم اجازهٔ شروع سرویس اعلان را نداد (کد: start-rejected).');

    const deadline = Date.now() + 8000;
    let last = 'starting';
    let stoppedStreak = 0;
    while (Date.now() < deadline) {
      const status = await getChatForegroundServiceStatus().catch(() => 'unavailable');
      last = status;
      if (status === 'connecting' || status === 'connected' || status === 'reconnecting') return true;
      if (status === 'stopped' || status === 'unavailable' || status === 'unsupported') {
        // "stopped" can be a transient value while the service is still being
        // created; only treat it as final once it persists for about a second.
        stoppedStreak += 1;
        if (stoppedStreak >= 5) {
          const detail = await getChatForegroundServiceLastError();
          return fail(`سرویس اعلان بلافاصله متوقف شد (کد: ${status}${detail ? ` · ${detail}` : ''}).`);
        }
      } else {
        stoppedStreak = 0;
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    await stopChatForegroundService(authStorageKey(client)).catch(() => false);
    const detail = await getChatForegroundServiceLastError();
    return fail(`سرویس اعلان در زمان مقرر شروع نشد (کد: timeout/${last}${detail ? ` · ${detail}` : ''}).`);
  } catch (cause) {
    return fail(`خطای سرویس اعلان: ${cause instanceof Error ? cause.message : String(cause)}`);
  }
}

/**
 * The native service rotates Supabase refresh tokens while JS is suspended.
 * Restore that latest pair before the JS Auth client resumes auto-refresh, so
 * the app and native service never keep competing with a stale refresh token.
 */
export async function restoreLatestAndroidChatSession(client: SupabaseClient): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  const key = authStorageKey(client);
  const raw = await getStoredChatServiceSession(key).catch(() => null);
  if (!raw) return false;
  let latest: Partial<Session>;
  try {
    latest = JSON.parse(raw) as Partial<Session>;
  } catch {
    return false;
  }
  if (!latest.access_token || !latest.refresh_token) return false;
  const { data } = await client.auth.getSession();
  if (data.session?.access_token === latest.access_token && data.session?.refresh_token === latest.refresh_token) return false;
  const result = await client.auth.setSession({
    access_token: latest.access_token,
    refresh_token: latest.refresh_token,
  });
  return !result.error;
}

export async function stopAndroidChatForegroundServiceForClient(client: SupabaseClient): Promise<void> {
  if (Platform.OS !== 'android') return;
  await stopChatForegroundService(authStorageKey(client)).catch(() => false);
}

export async function setAndroidChatServiceAppForegrounded(foreground: boolean): Promise<void> {
  if (Platform.OS !== 'android') return;
  await setChatServiceAppForegrounded(foreground).catch(() => undefined);
}

export async function restoreAndroidChatServiceSessionForStorageKey(storageKey: string): Promise<string | null> {
  if (Platform.OS !== 'android') return null;
  return getStoredChatServiceSession(storageKey).catch(() => null);
}
