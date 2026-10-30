import { Platform } from 'react-native';
import * as Application from 'expo-application';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type RegistrationProfile = {
  user_id: string;
  full_name: string;
  email: string;
  registered_at: string;
  last_seen_at: string;
};

export type LearnerAuthMode = 'login' | 'register';
export type LearnerOtpType = 'email' | 'email_change';

export function isPermanentLearner(user: User | null | undefined): boolean {
  return !!user?.email && !!user.email_confirmed_at;
}

function normalizeEmail(email: string): string {
  const cleanEmail = email.trim().toLowerCase();
  // Accept any valid email provider, including Gmail and Microsoft addresses.
  if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) throw new Error('EMAIL_INVALID');
  return cleanEmail;
}

function validateFullName(fullName: string): string {
  const cleanName = fullName.trim();
  if (cleanName.length < 2 || cleanName.length > 80) throw new Error('NAME_INVALID');
  return cleanName;
}

export function normalizeOtpDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 0x0660))
    .replace(/\D/g, '')
    .slice(0, 6);
}

async function saveProfile(user: User, fullName: string): Promise<void> {
  if (!user.email) throw new Error('EMAIL_REQUIRED');
  const cleanName = validateFullName(fullName);
  const now = new Date().toISOString();
  const { error } = await supabase.from('app_user_profiles').upsert({
    user_id: user.id,
    full_name: cleanName,
    email: user.email.trim().toLowerCase(),
    platform: Platform.OS,
    app_version: Application.nativeApplicationVersion || '1.0.0',
    last_seen_at: now,
    updated_at: now,
  }, { onConflict: 'user_id' });
  if (error) throw error;
}

export async function getRegisteredSession(): Promise<{ session: Session | null; profile: RegistrationProfile | null }> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const session = data.session;
  if (!session || !isPermanentLearner(session.user)) return { session: null, profile: null };
  const { data: profile, error: profileError } = await supabase
    .from('app_user_profiles')
    .select('user_id,full_name,email,registered_at,last_seen_at')
    .eq('user_id', session.user.id)
    .maybeSingle();
  if (profileError) throw profileError;
  if (!profile) {
    const fallbackName = String(session.user.user_metadata?.full_name || '').trim();
    if (fallbackName) {
      await saveProfile(session.user, fallbackName);
      return getRegisteredSession();
    }
  }
  return { session, profile: (profile || null) as RegistrationProfile | null };
}

/** Sends a real Supabase email OTP; anonymous accounts retain their user ID during upgrade. */
export async function requestLearnerOtp(email: string, mode: LearnerAuthMode, fullName = ''): Promise<LearnerOtpType> {
  const cleanEmail = normalizeEmail(email);
  const cleanName = mode === 'register' ? validateFullName(fullName) : '';
  const { data: current, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (mode === 'register' && current.session && !current.session.user.email) {
    const { error } = await supabase.auth.updateUser({ email: cleanEmail, data: { full_name: cleanName } });
    if (error) throw error;
    return 'email_change';
  }
  const { error } = await supabase.auth.signInWithOtp({
    email: cleanEmail,
    options: {
      shouldCreateUser: mode === 'register',
      ...(cleanName ? { data: { full_name: cleanName } } : {}),
    },
  });
  if (error) throw error;
  return 'email';
}

/** Verifies the emailed six-digit token and creates/updates the learner profile. */
export async function verifyLearnerOtp(email: string, token: string, fullName = '', type: LearnerOtpType = 'email'): Promise<void> {
  const cleanEmail = normalizeEmail(email);
  const cleanToken = normalizeOtpDigits(token);
  if (!/^\d{6}$/.test(cleanToken)) throw new Error('OTP_INVALID');
  const cleanName = fullName.trim() ? validateFullName(fullName) : '';
  const { data, error } = await supabase.auth.verifyOtp({
    email: cleanEmail,
    token: cleanToken,
    type,
  });
  if (error) throw error;
  const { data: current, error: currentError } = await supabase.auth.getSession();
  if (currentError) throw currentError;
  const session = data.session ?? current.session;
  const user = session?.user ?? data.user;
  if (!session || !user || !isPermanentLearner(user)) throw new Error('OTP_SESSION_MISSING');

  if (cleanName) {
    const { data: updated, error: updateError } = await supabase.auth.updateUser({ data: { full_name: cleanName } });
    if (updateError) throw updateError;
    await saveProfile(updated.user ?? user, cleanName);
  }
}

/** Completes the profile for an older verified account whose name is missing. */
export async function completeLearnerProfile(fullName: string): Promise<void> {
  const cleanName = validateFullName(fullName);
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const user = data.session?.user;
  if (!user || !isPermanentLearner(user)) throw new Error('LEARNER_SESSION_REQUIRED');
  const { data: updated, error: updateError } = await supabase.auth.updateUser({ data: { full_name: cleanName } });
  if (updateError) throw updateError;
  await saveProfile(updated.user ?? user, cleanName);
}

export async function touchLearnerActivity(): Promise<void> {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!isPermanentLearner(user)) return;
  const now = new Date().toISOString();
  await supabase.from('app_user_profiles').update({
    last_seen_at: now,
    platform: Platform.OS,
    app_version: Application.nativeApplicationVersion || '1.0.0',
    updated_at: now,
  }).eq('user_id', user!.id);
}

export function registrationError(error: unknown): string {
  const message = error && typeof error === 'object' && 'message' in error ? String(error.message) : '';
  if (/NAME_INVALID/.test(message)) return 'نام و نام خانوادگی را کامل وارد کنید.';
  if (/EMAIL_INVALID|invalid.*email/i.test(message)) return 'نشانی ایمیل معتبری وارد کنید.';
  if (/OTP_INVALID|OTP_SESSION_MISSING|invalid.*token|token.*(expired|invalid)|expired.*token/i.test(message)) return 'کد معتبر نیست یا منقضی شده است؛ کد تازه بگیرید و دوباره تلاش کنید.';
  if (/rate limit|too many requests|email rate/i.test(message)) return 'تعداد درخواست‌ها زیاد شده است؛ چند دقیقه صبر کنید و دوباره کد بگیرید.';
  if (/signup.*disabled|signups not allowed/i.test(message)) return 'ثبت‌نام کاربران در تنظیمات Supabase غیرفعال است.';
  if (/row-level security|permission denied/i.test(message)) return 'کد تأیید شد، اما مجوز ساخت پروفایل روی سرور کامل نیست؛ RLS جدول app_user_profiles را بررسی کنید.';
  if (/app_user_profiles|schema cache|does not exist/i.test(message)) return 'جدول پروفایل کاربران روی Supabase در دسترس نیست؛ migration ثبت‌نام را بررسی کنید.';
  if (/fetch|network|internet|timeout/i.test(message)) return 'ارتباط با سرور برقرار نشد؛ اینترنت یا VPN را بررسی کنید.';
  if (/EMAIL_REQUIRED|LEARNER_SESSION_REQUIRED|PROFILE_INCOMPLETE/.test(message)) return 'حساب تأیید شد، اما تکمیل پروفایل انجام نشد؛ دوباره وارد شوید یا با پشتیبانی تماس بگیرید.';
  if (/Email not confirmed|email.*not.*confirmed/i.test(message)) return 'تأیید ایمیل در Supabase با تنظیم OTP هماهنگ نیست؛ تنظیمات Email Auth و قالب OTP را بررسی کنید.';
  return message ? `ورود انجام نشد: ${message.slice(0, 140)}` : 'ورود انجام نشد؛ اتصال اینترنت و تنظیمات Email OTP را بررسی کنید.';
}
