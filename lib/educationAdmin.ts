import { FEATURES } from './features';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { isSupabaseConfigured } from './pairing';
import { SUPABASE_PUBLIC_ANON_KEY, SUPABASE_PUBLIC_URL } from './supabaseConfig';
import { createChatServiceAuthStorage } from './chatServiceAuthStorage';
import { SENTENCE_LESSONS } from './courseContent';
import canonical from '../assets/data/essential504.json';

// Separate auth storage: signing into the panel must not replace the learner session.
let client: SupabaseClient | null = null;
export function adminClient() {
  if (!FEATURES.adminPanel) throw new Error('پنل مدیریت فعلاً غیرفعال است.');
  if (!isSupabaseConfigured()) throw new Error('ابتدا اتصال Supabase پروژه را تنظیم کنید.');
  if (!client) client = createClient(SUPABASE_PUBLIC_URL, SUPABASE_PUBLIC_ANON_KEY, {
    auth: { storageKey: 'education-admin-session-v1', persistSession: true, autoRefreshToken: true, detectSessionInUrl: false,
      storage: Platform.OS === 'web' ? {
        getItem: (key) => typeof window === 'undefined' ? null : window.localStorage.getItem(key),
        setItem: (key, value) => { if (typeof window !== 'undefined') window.localStorage.setItem(key, value); },
        removeItem: (key) => { if (typeof window !== 'undefined') window.localStorage.removeItem(key); },
      } : createChatServiceAuthStorage() },
  });
  return client;
}
export interface StudentRow {
  student_id: string; display_name: string; status: 'active' | 'paused'; consent_at: string;
  synced_at: string | null; summary: Record<string, unknown> | null;
}
export interface EducationInvite { id: string; label: string; code: string; expires_at: string; claimed_at: string | null }
export interface RegisteredUser {
  user_id: string; full_name: string; email: string; platform: string | null;
  app_version: string | null; registered_at: string; last_seen_at: string;
}
const lessonIds = new Set(SENTENCE_LESSONS.map(l => l.id));
const words = new Set<string>(canonical);
export function progressMetrics(summary: Record<string, unknown> | null) {
  const count = (value: unknown, allowed: Set<string>) => Array.isArray(value) ? new Set(value.filter((v): v is string => typeof v === 'string' && allowed.has(v))).size : 0;
  const finite = (value: unknown) => typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  const lessons = count(summary?.completedLessonIds, lessonIds);
  return { lessons, percent: Math.round(lessons / SENTENCE_LESSONS.length * 100), words: count(summary?.learnedEssential504Words, words), minutes: finite(summary?.totalMinutes), streak: finite(summary?.currentStreak) };
}
export function educationError(error: unknown): string {
  const text = error && typeof error === 'object' && 'message' in error ? String(error.message) : '';
  if (/EDUCATION_DISABLED/.test(text)) return 'مدیریت آموزشی فعلاً توسط مدیر سامانه غیرفعال شده است.';
  if (/INVITE_INVALID|invalid input syntax for type uuid/.test(text)) return 'دعوت معتبر نیست؛ ممکن است منقضی، لغو یا مصرف شده باشد.';
  if (/SELF_INVITE/.test(text)) return 'مدیر نمی‌تواند دعوت خودش را بپذیرد.';
  if (/duplicate key/.test(text)) return 'قبلاً عضو این گروه آموزشی شده‌اید.';
  if (/NAME_INVALID/.test(text)) return 'نامی بین ۱ تا ۸۰ نویسه بنویسید.';
  if (/Invalid login credentials/.test(text)) return 'ایمیل یا رمز ورود درست نیست.';
  if (/schema cache|does not exist/.test(text)) return 'راه‌اندازی پایگاه‌داده پنل هنوز کامل نیست؛ راهنمای EDUCATION-ADMIN را اجرا کنید.';
  if (/SELF_DELETE/.test(text)) return 'مدیر نمی‌تواند حساب خودش را حذف کند.';
  if (/ADMIN_ACCOUNT/.test(text)) return 'حساب مدیر از این بخش قابل حذف نیست.';
  if (/ADMIN_REQUIRED|permission denied|row-level security/.test(text)) return 'این حساب اجازه انجام این کار را ندارد.';
  if (/CONSENT_REQUIRED/.test(text)) return 'اشتراک پیشرفت فقط با رضایت شما انجام می‌شود.';
  if (/AUTH_REQUIRED|JWT|session/i.test(text)) return 'نشست ورود معتبر نیست؛ دوباره وارد شوید.';
  return 'عملیات انجام نشد. اتصال شبکه و تنظیمات پنل را بررسی کنید و دوباره تلاش کنید.';
}
/** Permanently deletes a learner account through the manager-only Edge Function. */
export async function deleteRegisteredUser(userId: string): Promise<void> {
  const { data, error } = await adminClient().functions.invoke('admin-delete-user', { body: { userId } });
  if (error) {
    const context = (error as { context?: { json?: () => Promise<unknown> } }).context;
    const payload = (await context?.json?.().catch(() => null)) as { code?: string } | null;
    throw new Error(payload?.code || error.message);
  }
  if (data && typeof data === 'object' && 'error' in data) throw new Error(String((data as { code?: string }).code || 'DELETE_FAILED'));
}
