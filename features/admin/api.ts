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
