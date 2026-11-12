import AsyncStorage from '@react-native-async-storage/async-storage';
import { LANGUAGE_IDS, isLanguageId, type LanguageId } from './languages/registry';

export const APP_RESUME_KEY = 'milo_navigation_resume_v1';
export const RESUME_MAX_INACTIVE_MS = 24 * 60 * 60 * 1000;
export type ResumeLanguage = LanguageId | null;
export type ResumeParams = Record<string, string | string[] | undefined>;
export interface ResumeSnapshot {
  version: 1;
  href: string;
  language: ResumeLanguage;
  backgroundAt: number | null;
  updatedAt: number;
}

// Save only parameters required to reconstruct screens; never replay one-shot actions.
const allowedParams = new Set(['id', 'lessonId', 'level', 'name', 'language']);
const learnRouteIds = LANGUAGE_IDS.join('|');
const allowedPaths = new RegExp(
  `^\\/(?:languages|lang(?:\\/[^?#]*)?|course(?:\\/[^?#]*)?|review(?:\\/[^?#]*)?|personal-sync|profile|foundation(?:\\/[^?#]*)?|app-lock|learning-access|permissions|agent(?:\\/[^?#]*)?|admin(?:\\/[^?#]*)?|learn\\/(?:${learnRouteIds})(?:\\/[^?#]*)?|conversations(?:\\/[^?#]*)?)$`,
);

export function resumeHref(pathname: string, params: ResumeParams): string | null {
  if (!allowedPaths.test(pathname) || pathname.includes('//') || /[\x00-\x1f\\]/.test(pathname)) return null;
  const query: string[] = [];
  for (const key of [...allowedParams].sort()) {
    const raw = params[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (typeof value === 'string' && value.length > 0 && value.length <= 256) {
      query.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }
  return pathname + (query.length ? `?${query.join('&')}` : '');
}

export function languageForResume(pathname: string, previous: ResumeLanguage): ResumeLanguage {
  for (const id of LANGUAGE_IDS) {
    if (id === 'en') continue;
    if (pathname === `/learn/${id}` || pathname.startsWith(`/learn/${id}/`)) return id;
  }
  if (pathname === '/lang' || pathname.startsWith('/lang/') || pathname.startsWith('/course/')
    || pathname === '/review' || pathname.startsWith('/review/')
    || pathname === '/learn/en' || pathname.startsWith('/learn/en/') || pathname === '/conversations/emma') return 'en';
  return previous;
}

function validHref(href: string): boolean {
  if (href.length > 2048) return false;
  const [path, query = ''] = href.split('?');
  if (!allowedPaths.test(path) || path.includes('//') || /[\x00-\x1f\\]/.test(path)) return false;
  try {
    for (const pair of query ? query.split('&') : []) {
      const [encodedKey, ...rest] = pair.split('=');
      const key = decodeURIComponent(encodedKey);
      const value = decodeURIComponent(rest.join('='));
      if (!allowedParams.has(key) || !value || value.length > 256) return false;
    }
    return true;
  } catch { return false; }
}

export function parseResumeSnapshot(raw: string | null): ResumeSnapshot | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<ResumeSnapshot>;
    if (!value || value.version !== 1 || typeof value.href !== 'string' || !validHref(value.href)
      || !(value.language === null || isLanguageId(value.language))
      || !(value.backgroundAt === null || (typeof value.backgroundAt === 'number' && Number.isFinite(value.backgroundAt) && value.backgroundAt >= 0))
      || typeof value.updatedAt !== 'number' || !Number.isFinite(value.updatedAt) || value.updatedAt < 0) return null;
    return value as ResumeSnapshot;
  } catch { return null; }
}

export function resumeDestination(snapshot: ResumeSnapshot, now: number, learnerLoginEnabled = false): string {
  const awaySince = snapshot.backgroundAt ?? snapshot.updatedAt;
  // Old account screens must not reappear on open builds. This does not alter
  // optional app-lock enforcement, lesson snapshots, sessions, or local data.
  const disabledAccountRoute = !learnerLoginEnabled && snapshot.href.split('?')[0] === '/personal-sync';
  if (disabledAccountRoute || now - awaySince > RESUME_MAX_INACTIVE_MS) {
    if (snapshot.language === 'en') return '/lang';
    return snapshot.language ? `/learn/${snapshot.language}` : '/languages';
  }
  return snapshot.href;
}

let queue: Promise<void> = Promise.resolve();
export async function readResumeSnapshot(): Promise<ResumeSnapshot | null> {
  // Read only after any earlier background write completes.
  await queue.catch(() => undefined);
  return parseResumeSnapshot(await AsyncStorage.getItem(APP_RESUME_KEY));
}
export function writeResumeSnapshot(snapshot: ResumeSnapshot): Promise<void> {
  const safe = parseResumeSnapshot(JSON.stringify(snapshot));
  if (!safe) return Promise.reject(new Error('Invalid navigation resume snapshot'));
  const job = queue.catch(() => undefined).then(() => AsyncStorage.setItem(APP_RESUME_KEY, JSON.stringify(safe)));
  queue = job;
  return job;
}
