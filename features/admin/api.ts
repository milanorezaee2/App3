/**
 * Data access of the management panel. Every call runs as the manager session
 * and every privileged operation is authorised on the server (RPC + RLS).
 */
import { adminClient, deleteRegisteredUser, educationError, type EducationInvite, type StudentRow } from '@/lib/educationAdmin';
import { registerAdminPushToken } from '@/lib/adminPush';
import { readableSupabaseError } from '@/lib/errors';

export const ADMIN_SETUP_FILE = 'supabase/SETUP-ADMIN-PANEL-ONCE.sql';

export interface DashboardStats {
  users_total: number; users_today: number; users_week: number; users_active_week: number; users_blocked: number;
  conversations_total: number; conversations_deleted: number; messages_total: number; messages_today: number;
  support_open: number; support_resolved: number; generated_at: string;
}

export interface AdminUser {
  user_id: string; full_name: string; email: string; platform: string | null; app_version: string | null;
  account_kind: 'email' | 'device' | string; registered_at: string; last_seen_at: string;
  chat_blocked: boolean; block_reason: string | null; conversation_count: number; message_count: number;
  support_conversation_id: string | null; support_status: 'open' | 'resolved' | null;
}

export interface ConversationMember { user_id: string; name: string; email: string | null; blocked: boolean; is_admin: boolean }
export interface AdminConversation {
  conversation_id: string; kind: string; created_at: string; is_support: boolean; support_status: 'open' | 'resolved' | null;
  deleted_at: string | null; message_count: number; last_message_at: string | null; last_message_preview: string | null;
  members: ConversationMember[];
}

export interface AdminMessage { id: string; sender_id: string; sender_name: string; message_type: string; body: string | null; created_at: string }
export interface AuditEntry { id: number; action: string; target_id: string | null; details: Record<string, unknown>; created_at: string }

export class AdminSetupRequiredError extends Error {
  constructor() { super(`راه‌اندازی پنل کامل نیست؛ فایل ${ADMIN_SETUP_FILE} را یک‌بار در SQL Editor پروژهٔ Supabase اجرا کنید.`); this.name = 'AdminSetupRequiredError'; }
}

function isMissingFunction(error: { code?: string; message?: string } | null | undefined): boolean {
  if (!error) return false;
  return error.code === 'PGRST202' || error.code === '42883' || /Could not find the function|does not exist|schema cache/i.test(error.message || '');
}

async function rpc<T>(name: string, args?: Record<string, unknown>): Promise<T> {
  const { data, error } = await adminClient().rpc(name, args);
  if (error) {
    if (isMissingFunction(error)) throw new AdminSetupRequiredError();
    throw new Error(readableSupabaseError(error));
  }
  return data as T;
}

export function adminErrorText(error: unknown): string {
  if (error instanceof AdminSetupRequiredError) return error.message;
  if (error instanceof Error && /[\u0600-\u06FF]/.test(error.message)) return error.message;
  return educationError(error);
}

// ---------------------------------------------------------------- session
export async function currentAdminSession() {
  const { data } = await adminClient().auth.getSession();
  return data.session;
}
export async function signInAdmin(email: string, password: string): Promise<void> {
  const { error } = await adminClient().auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
  const allowed = await rpc<boolean>('is_education_admin');
  if (!allowed) { await adminClient().auth.signOut(); throw new Error('ADMIN_REQUIRED'); }
  void registerAdminPushToken();
}
export async function signOutAdmin(): Promise<void> {
  const { error } = await adminClient().auth.signOut();
  if (error) throw error;
}
export async function assertAdmin(): Promise<void> {
  const allowed = await rpc<boolean>('is_education_admin');
  if (!allowed) throw new Error('ADMIN_REQUIRED');
}

// -------------------------------------------------------------- dashboard
export const fetchDashboardStats = () => rpc<DashboardStats>('admin_dashboard_stats');

// ------------------------------------------------------------------ users
export const fetchUsers = () => rpc<AdminUser[]>('admin_users_overview').then(rows => rows || []);
export async function setUserBlocked(userId: string, blocked: boolean, reason?: string): Promise<void> {
  await rpc('admin_set_chat_access', { p_user_id: userId, p_blocked: blocked, p_reason: blocked ? (reason || 'مسدود توسط مدیر') : null });
}
export const removeUserPermanently = (userId: string) => deleteRegisteredUser(userId);

// ---------------------------------------------------------- conversations
export const fetchConversations = () => rpc<AdminConversation[]>('admin_conversations_overview').then(rows => rows || []);
export const fetchConversationMessages = (conversationId: string, limit = 200) =>
  rpc<AdminMessage[]>('admin_conversation_messages', { p_conversation_id: conversationId, p_limit: limit }).then(rows => rows || []);
export async function setConversationHidden(conversationId: string, hidden: boolean): Promise<void> {
  await rpc('admin_set_conversation_deleted', { p_conversation_id: conversationId, p_deleted: hidden });
}
export const clearConversation = (conversationId: string) => rpc<number>('admin_clear_conversation', { p_conversation_id: conversationId });
export const purgeConversation = (conversationId: string) => rpc<void>('admin_purge_conversation', { p_conversation_id: conversationId });
export const blockConversationMembers = (conversationId: string, blocked: boolean) =>
  rpc<number>('admin_block_conversation_members', { p_conversation_id: conversationId, p_blocked: blocked });

// ---------------------------------------------------------------- support
export async function setSupportStatus(conversationId: string, status: 'open' | 'resolved'): Promise<void> {
  const { data, error } = await adminClient().from('support_requests').update({ status }).eq('conversation_id', conversationId).select('conversation_id');
  if (error) throw new Error(readableSupabaseError(error));
  if (!data?.length) throw new Error('درخواست پشتیبانی پیدا نشد.');
}

// ------------------------------------------------------ learners/invites
export async function fetchLearners(): Promise<{ students: StudentRow[]; invites: EducationInvite[] }> {
  const db = adminClient();
  const [roster, invites] = await Promise.all([
    db.rpc('education_roster'),
    db.from('education_invites').select('id,label,code,expires_at,claimed_at').order('created_at', { ascending: false }),
  ]);
  if (roster.error) throw roster.error;
  if (invites.error) throw invites.error;
  return { students: (roster.data || []) as StudentRow[], invites: (invites.data || []) as EducationInvite[] };
}
export async function createInvite(label: string): Promise<void> {
  const { error } = await adminClient().from('education_invites').insert({ label: label.trim() });
  if (error) throw error;
}
export async function revokeInvite(id: string): Promise<void> {
  const { error } = await adminClient().from('education_invites').delete().eq('id', id);
  if (error) throw error;
}
export async function setEnrollmentStatus(studentId: string, status: 'active' | 'paused'): Promise<void> {
  const { error } = await adminClient().from('education_enrollments').update({ status }).eq('student_id', studentId).select('student_id');
  if (error) throw error;
}

// ------------------------------------------------------------------ audit
export const fetchRecentActions = (limit = 50) => rpc<AuditEntry[]>('admin_recent_actions', { p_limit: limit }).then(rows => rows || []);

// --------------------------------------------------------------- releases
import type { AppRelease } from '@/lib/appReleases';
import { SUPABASE_PUBLIC_ANON_KEY, SUPABASE_PUBLIC_URL } from '@/lib/supabaseConfig';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

export interface AdminRelease extends AppRelease { package_name: string; platform: string; published: boolean; storage_path: string | null }
export const RELEASES_BUCKET = 'app-releases';

export async function fetchReleases(): Promise<AdminRelease[]> {
  const { data, error } = await adminClient().from('app_releases').select('*').order('created_at', { ascending: false }).limit(200);
  if (error) {
    if (isMissingFunction(error) || error.code === '42P01' || error.code === 'PGRST205') throw new AdminSetupRequiredError();
    throw new Error(readableSupabaseError(error));
  }
  return (data || []) as AdminRelease[];
}

export interface PickedApk { name: string; size: number; uri: string; file?: File }

/** Uploads an APK to the public releases bucket and returns its public URL. */
export async function uploadApk(packageName: string, versionCode: number, picked: PickedApk, onProgress?: (fraction: number) => void): Promise<{ url: string; path: string; size: number }> {
  const path = `${packageName}/${versionCode}-${Date.now()}.apk`;
  const client = adminClient();
  if (Platform.OS === 'web') {
    if (!picked.file) throw new Error('فایل انتخاب نشده است.');
    const { error } = await client.storage.from(RELEASES_BUCKET).upload(path, picked.file, { contentType: 'application/vnd.android.package-archive', upsert: false });
    if (error) throw new Error(/exceeded|too large|Payload/i.test(error.message) ? 'حجم فایل از سقف مجاز فضای ذخیره‌سازی پروژه بیشتر است؛ از گزینهٔ «لینک مستقیم» استفاده کنید.' : error.message);
  } else {
    const { data: sessionData } = await client.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) throw new Error('AUTH_REQUIRED');
    const task = FileSystem.createUploadTask(
      `${SUPABASE_PUBLIC_URL}/storage/v1/object/${RELEASES_BUCKET}/${path}`,
      picked.uri,
      { httpMethod: 'POST', headers: { Authorization: `Bearer ${token}`, apikey: SUPABASE_PUBLIC_ANON_KEY, 'Content-Type': 'application/vnd.android.package-archive', 'x-upsert': 'false' }, uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT },
      progress => { if (onProgress && progress.totalBytesExpectedToSend) onProgress(progress.totalBytesSent / progress.totalBytesExpectedToSend); },
    );
    const result = await task.uploadAsync();
    if (!result || result.status >= 400) {
      const body = result?.body || '';
      throw new Error(/exceeded|too large|Payload/i.test(body) ? 'حجم فایل از سقف مجاز فضای ذخیره‌سازی پروژه بیشتر است؛ از گزینهٔ «لینک مستقیم» استفاده کنید.' : `آپلود ناموفق بود (${result?.status ?? '—'}).`);
    }
  }
  onProgress?.(1);
  const { data } = client.storage.from(RELEASES_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path, size: picked.size };
}

export async function publishRelease(input: { packageName: string; versionName: string; versionCode: number; downloadUrl: string; notes: string; mandatory: boolean; storagePath?: string | null; fileSize?: number | null }): Promise<string> {
  return rpc<string>('admin_publish_release', {
    p_package_name: input.packageName, p_version_name: input.versionName, p_version_code: input.versionCode, p_download_url: input.downloadUrl,
    p_release_notes: input.notes, p_mandatory: input.mandatory, p_storage_path: input.storagePath ?? null, p_file_size: input.fileSize ?? null, p_sha256: null,
  });
}
export const setReleasePublished = (id: string, published: boolean) => rpc<void>('admin_set_release_published', { p_release_id: id, p_published: published });
export async function deleteRelease(release: AdminRelease): Promise<void> {
  await rpc<void>('admin_delete_release', { p_release_id: release.id });
  if (release.storage_path) await adminClient().storage.from(RELEASES_BUCKET).remove([release.storage_path]).catch(() => undefined);
}

// ----------------------------------------------------------- app settings
export interface SubscriptionSettings { enabled: boolean; free_lessons: number }
export async function fetchSettings(): Promise<{ subscriptions: SubscriptionSettings }> {
  const data = await rpc<Record<string, unknown>>('public_app_settings');
  const subs = (data?.subscriptions || {}) as Partial<SubscriptionSettings>;
  return { subscriptions: { enabled: Boolean(subs.enabled), free_lessons: Number(subs.free_lessons ?? 10) } };
}
export const saveSetting = (key: string, value: unknown) => rpc<void>('admin_set_setting', { p_key: key, p_value: value });

// ---------------------------------------------------------------- pop-ups
export type PopupKind = 'info' | 'success' | 'warning' | 'promo';
export interface AdminPopup {
  id: string; title: string; body: string; button_label: string | null; button_url: string | null; package_name: string | null;
  kind: PopupKind; show_once: boolean; active: boolean; starts_at: string; ends_at: string | null; priority: number; created_at: string; updated_at: string;
}
export async function fetchPopups(): Promise<AdminPopup[]> {
  const { data, error } = await adminClient().from('app_popups').select('*').order('priority', { ascending: false }).order('updated_at', { ascending: false });
  if (error) { if (isMissingFunction(error) || error.code === '42P01' || error.code === 'PGRST205') throw new AdminSetupRequiredError(); throw new Error(readableSupabaseError(error)); }
  return (data || []) as AdminPopup[];
}
export type PopupInput = Omit<AdminPopup, 'id' | 'created_at' | 'updated_at'> & { id?: string | null };
export const savePopup = (p: PopupInput) => rpc<string>('admin_save_popup', {
  p_id: p.id ?? null, p_title: p.title, p_body: p.body, p_button_label: p.button_label, p_button_url: p.button_url, p_package_name: p.package_name,
  p_kind: p.kind, p_show_once: p.show_once, p_active: p.active, p_starts_at: p.starts_at, p_ends_at: p.ends_at, p_priority: p.priority,
});
export const deletePopup = (id: string) => rpc<void>('admin_delete_popup', { p_id: id });

// --------------------------------------------------- bulk conversation ops
export const purgeConversations = (ids: string[]) => rpc<number>('admin_purge_conversations', { p_conversation_ids: ids });
export interface ExportedMessage { conversation_id: string; message_id: string; sender_id: string; sender_name: string; sender_email: string | null; message_type: string; body: string | null; created_at: string }
export const exportConversations = (ids: string[]) => rpc<ExportedMessage[]>('admin_export_conversations', { p_conversation_ids: ids }).then(rows => rows || []);

// ---------------------------------------------------------- subscriptions
export interface SubscriptionPlan { id: string; code: string; title: string; description: string; price_amount: number; currency: string; duration_days: number; features: string[]; active: boolean; sort_order: number; created_at: string }
export interface UserSubscription { id: string; user_id: string; full_name: string; email: string | null; plan_id: string; plan_title: string; plan_code: string; status: 'active' | 'expired' | 'cancelled'; starts_at: string; ends_at: string; source: string; note: string | null; created_at: string }
export async function fetchPlans(): Promise<SubscriptionPlan[]> {
  const { data, error } = await adminClient().from('subscription_plans').select('*').order('sort_order').order('created_at');
  if (error) { if (isMissingFunction(error) || error.code === '42P01' || error.code === 'PGRST205') throw new AdminSetupRequiredError(); throw new Error(readableSupabaseError(error)); }
  return (data || []).map(row => ({ ...row, features: Array.isArray(row.features) ? row.features : [] })) as SubscriptionPlan[];
}
export const savePlan = (p: Omit<SubscriptionPlan, 'id' | 'created_at'> & { id?: string | null }) => rpc<string>('admin_save_plan', {
  p_id: p.id ?? null, p_code: p.code, p_title: p.title, p_description: p.description, p_price_amount: p.price_amount, p_currency: p.currency,
  p_duration_days: p.duration_days, p_features: p.features, p_active: p.active, p_sort_order: p.sort_order,
});
export const fetchSubscriptions = () => rpc<UserSubscription[]>('admin_subscriptions_overview').then(rows => rows || []);
export const grantSubscription = (userId: string, planId: string, days: number | null, note: string) => rpc<string>('admin_grant_subscription', { p_user_id: userId, p_plan_id: planId, p_days: days, p_note: note || null });
export const cancelSubscription = (id: string) => rpc<void>('admin_cancel_subscription', { p_subscription_id: id });
