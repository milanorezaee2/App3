import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';

/**
 * Device-local learner profile for builds without server login.
 * The user enters a name and e-mail; the app itself generates a random
 * 6-digit access code (no OTP, no network) which the user types back to
 * activate the profile on this device. Nothing leaves the phone.
 */
export interface LocalProfile {
  fullName: string;
  email: string;
  code: string;
  createdAt: string;
  verifiedAt: string | null;
  lastSeenAt: string;
}

const KEY = 'milo_local_profile_v1';

function readRaw(): Promise<string | null> {
  if (Platform.OS === 'web') return Promise.resolve(typeof window === 'undefined' ? null : window.localStorage.getItem(KEY));
  return AsyncStorage.getItem(KEY);
}

function writeRaw(value: string | null): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') { if (value === null) window.localStorage.removeItem(KEY); else window.localStorage.setItem(KEY, value); }
    return Promise.resolve();
  }
  return value === null ? AsyncStorage.removeItem(KEY) : AsyncStorage.setItem(KEY, value);
}

function parse(raw: string | null): LocalProfile | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<LocalProfile>;
    if (typeof value.email !== 'string' || typeof value.code !== 'string') return null;
    return {
      fullName: typeof value.fullName === 'string' ? value.fullName : '',
      email: value.email,
      code: value.code,
      createdAt: typeof value.createdAt === 'string' ? value.createdAt : new Date().toISOString(),
      verifiedAt: typeof value.verifiedAt === 'string' ? value.verifiedAt : null,
      lastSeenAt: typeof value.lastSeenAt === 'string' ? value.lastSeenAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function normalizeLocalEmail(email: string): string {
  const clean = email.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(clean)) throw new Error('EMAIL_INVALID');
  return clean;
}

export function normalizeLocalName(name: string): string {
  const clean = name.trim().replace(/\s+/g, ' ');
  if (clean.length < 2 || clean.length > 80) throw new Error('NAME_INVALID');
  return clean;
}

/** Cryptographically random 6-digit code, never derived from the e-mail. */
export function generateLocalAccessCode(): string {
  try {
    const bytes = Crypto.getRandomBytes(4);
    const n = ((bytes[0] << 24) >>> 0) + (bytes[1] << 16) + (bytes[2] << 8) + bytes[3];
    return String(n % 1_000_000).padStart(6, '0');
  } catch {
    return String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
  }
}

export function normalizeLocalCode(value: string): string {
  return value
    .replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x0660))
    .replace(/\D/g, '')
    .slice(0, 6);
}

export async function getLocalProfile(): Promise<LocalProfile | null> {
  return parse(await readRaw());
}

/** Starts (or restarts) the local profile and returns the freshly generated code. */
export async function beginLocalProfile(fullName: string, email: string): Promise<LocalProfile> {
  const now = new Date().toISOString();
  const profile: LocalProfile = {
    fullName: normalizeLocalName(fullName),
    email: normalizeLocalEmail(email),
    code: generateLocalAccessCode(),
    createdAt: now,
    verifiedAt: null,
    lastSeenAt: now,
  };
  await writeRaw(JSON.stringify(profile));
  return profile;
}

export async function regenerateLocalCode(): Promise<LocalProfile | null> {
  const current = await getLocalProfile();
  if (!current) return null;
  const next = { ...current, code: generateLocalAccessCode(), verifiedAt: null };
  await writeRaw(JSON.stringify(next));
  return next;
}

export async function verifyLocalProfile(code: string): Promise<LocalProfile> {
  const current = await getLocalProfile();
  if (!current) throw new Error('PROFILE_MISSING');
  if (normalizeLocalCode(code) !== current.code) throw new Error('CODE_INVALID');
  const next = { ...current, verifiedAt: new Date().toISOString(), lastSeenAt: new Date().toISOString() };
  await writeRaw(JSON.stringify(next));
  return next;
}

export async function updateLocalProfileName(fullName: string): Promise<LocalProfile> {
  const current = await getLocalProfile();
  if (!current) throw new Error('PROFILE_MISSING');
  const next = { ...current, fullName: normalizeLocalName(fullName) };
  await writeRaw(JSON.stringify(next));
  return next;
}

export async function touchLocalProfile(): Promise<void> {
  const current = await getLocalProfile();
  if (!current) return;
  await writeRaw(JSON.stringify({ ...current, lastSeenAt: new Date().toISOString() }));
}

/** Signs out on this device; learning progress is untouched. */
export async function clearLocalProfile(): Promise<void> {
  await writeRaw(null);
}

export function localProfileError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? '');
  if (message === 'EMAIL_INVALID') return 'ایمیل معتبر نیست.';
  if (message === 'NAME_INVALID') return 'نام باید بین ۲ تا ۸۰ حرف باشد.';
  if (message === 'CODE_INVALID') return 'کد وارد شده درست نیست.';
  if (message === 'PROFILE_MISSING') return 'ابتدا ایمیل را ثبت کنید.';
  return 'عملیات انجام نشد. دوباره تلاش کنید.';
}
