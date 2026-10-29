import { supabase } from './supabase';
import { getCourseProgress } from './courseProgress';
import { exportEnglishSyncExtras, mergeEnglishSyncExtras, type EnglishSyncExtras } from './englishBackup';
import {
  mergeRemotePronunciationMarks,
  type PronunciationMarks,
} from './languages/pronunciationProgress';

const TABLE = 'learning_progress';
const MAX_RETRIES = 4;

type PersonalSyncResult =
  | { status: 'signed-out' }
  | { status: 'synced'; email: string; updatedAt: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function asJsonRecord(value: unknown, label: string): Record<string, unknown> {
  if (value === null || value === undefined) return {};
  if (!isRecord(value)) throw new Error(`پیشرفت ابری ${label} قابل‌خواندن نیست؛ دادهٔ محلی حفظ شده است.`);
  return value;
}

function remoteSetupError(error: { code?: string; message?: string }) {
  const detail = `${error.code ?? ''} ${error.message ?? ''}`;
  if (/column .* does not exist|relation .* does not exist|schema cache|PGRST204|PGRST205|PGRST200|42P01/i.test(detail)) {
    return new Error('جدول همگام‌سازی شخصی هنوز آماده نیست. فایل migration با نام 202610120001_personal_language_sync.sql را روی پروژهٔ Supabase اجرا کنید؛ پیشرفت محلی دست‌نخورده می‌ماند.');
  }
  if (/row-level|permission|policy|42501/i.test(detail)) {
    return new Error('دسترسی امن همگام‌سازی تأیید نشد. سیاست RLS باید فقط auth.uid() همان حساب را مجاز کند؛ دادهٔ محلی حفظ شده است.');
  }
  return new Error('همگام‌سازی کامل نشد؛ اتصال Supabase را بررسی کنید. دادهٔ همین دستگاه حفظ شده است.');
}

function canonicalJson(value: unknown): string {
  const normalize = (item: unknown): unknown => Array.isArray(item)
    ? item.map(normalize)
    : isRecord(item)
      ? Object.fromEntries(Object.keys(item).sort().map(key => [key, normalize(item[key])]))
      : item;
  return JSON.stringify(normalize(value));
}
function sameJson(a: unknown, b: unknown) {
  return canonicalJson(a) === canonicalJson(b);
}

function maxTimestamp(...values: Array<string | null | undefined>) {
  const times = values
    .filter((value): value is string => typeof value === 'string')
    .map(value => Date.parse(value))
    .filter(Number.isFinite);
  return new Date(Math.max(Date.now(), ...times.map(time => time + 1))).toISOString();
}


function cloudSafeEnglish(extras: EnglishSyncExtras) {
  return {
    schemaVersion: 1,
    study: extras.study,
    // Answer drafts may contain free text, so keep them local; objective
    // evidence, checklist progress, and self-assessment outcomes are per-user.
    supplement: { ...extras.supplement, drafts: {} },
  };
}

async function performSync(): Promise<PersonalSyncResult> {
  const { data: authData, error: authError } = await supabase.auth.getSession();
  if (authError) throw new Error('نشست حساب خوانده نشد؛ پیشرفت محلی محفوظ است.');
  const user = authData.session?.user;
  // Anonymous Supabase identities are device-specific. Cross-device personal
  // sync is enabled only for a verified email session created by the OTP flow.
  if (!user?.id || !user.email || user.is_anonymous) return { status: 'signed-out' };

  // English's existing, RLS-protected `progress` field remains compatible with
  // earlier app releases. Its loader now merges local and remote evidence.
  await getCourseProgress();

  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    const readController = new AbortController();
    const readTimer = setTimeout(() => readController.abort(), 12000);
    let row: any;
    try {
      const result = await supabase
        .from(TABLE)
        .select('language_progress,pronunciation_progress,updated_at')
        .eq('user_id', user.id)
        .abortSignal(readController.signal)
        .maybeSingle();
      if (result.error) throw remoteSetupError(result.error);
      row = result.data;
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('جدول همگام‌سازی')) throw error;
      if (error instanceof Error && error.message.startsWith('دسترسی امن')) throw error;
      throw new Error('پیشرفت ابری خوانده نشد؛ دادهٔ محلی محفوظ است. اتصال و migration را بررسی کنید.');
    } finally {
      clearTimeout(readTimer);
    }

    const remoteLanguageProgress = asJsonRecord(row?.language_progress, 'دوره‌ها');
    const remotePronunciationProgress = asJsonRecord(row?.pronunciation_progress, 'تلفظ');
    const remoteEnglishValue = remoteLanguageProgress.en;
    const remoteEnglish = remoteEnglishValue === undefined || remoteEnglishValue === null
      ? {}
      : asJsonRecord(remoteEnglishValue, 'پیشرفت تکمیلی انگلیسی');
    const englishExtras = Object.keys(remoteEnglish).length === 0
      ? await exportEnglishSyncExtras()
      : await mergeEnglishSyncExtras(remoteEnglish);
    const mergedEnglish = { ...remoteEnglish, ...cloudSafeEnglish(englishExtras) };

    const cloudEnglishMarks = remotePronunciationProgress.en ?? {};
    const mergedEnglishMarks: PronunciationMarks = await mergeRemotePronunciationMarks('en', cloudEnglishMarks);
    const mergedLanguages = { ...remoteLanguageProgress, en: mergedEnglish };
    const mergedPronunciation = { ...remotePronunciationProgress, en: mergedEnglishMarks };

    const needsWrite = !row
      || !sameJson(mergedLanguages, remoteLanguageProgress)
      || !sameJson(mergedPronunciation, remotePronunciationProgress);
    if (!needsWrite) {
      return { status: 'synced', email: user.email, updatedAt: row.updated_at };
    }

    const updatedAt = maxTimestamp(
      row?.updated_at,
      ...Object.values(mergedEnglishMarks).map(mark => mark?.updatedAt),
    );
    const patch = {
      language_progress: mergedLanguages,
      pronunciation_progress: mergedPronunciation,
      updated_at: updatedAt,
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const result = row
        ? await supabase
            .from(TABLE)
            .update(patch)
            .eq('user_id', user.id)
            .eq('updated_at', row.updated_at)
            .select('updated_at')
            .abortSignal(controller.signal)
            .maybeSingle()
        : await supabase
            .from(TABLE)
            .insert({ user_id: user.id, ...patch })
            .select('updated_at')
            .abortSignal(controller.signal)
            .maybeSingle();

      if (result.error) {
        if (result.error.code === '23505') continue;
        throw remoteSetupError(result.error);
      }
      if (!result.data) continue; // A concurrent device won; re-read and merge, never blind overwrite.
      return { status: 'synced', email: user.email, updatedAt: result.data.updated_at ?? updatedAt };
    } catch (error) {
      if (error instanceof Error && (error.message.startsWith('جدول همگام‌سازی') || error.message.startsWith('دسترسی امن'))) throw error;
      throw new Error('ذخیرهٔ ابری انجام نشد؛ دادهٔ محلی محفوظ است. کمی بعد دوباره همگام‌سازی کنید.');
    } finally {
      clearTimeout(timer);
    }
  }

  throw new Error('هم‌زمان دستگاه دیگری پیشرفت را تغییر داد؛ دادهٔ محلی حفظ شد. کمی بعد دوباره همگام‌سازی کنید.');
}

let serialQueue: Promise<unknown> = Promise.resolve();
export function syncPersonalLearningData(): Promise<PersonalSyncResult> {
  const job = serialQueue.then(performSync, performSync);
  serialQueue = job.catch(() => undefined);
  return job;
}

let scheduledTimer: ReturnType<typeof setTimeout> | undefined;
/** Best-effort debounced upload after local saves; callers never block a lesson on network access. */
export function schedulePersonalLearningSync() {
  if (scheduledTimer) clearTimeout(scheduledTimer);
  scheduledTimer = setTimeout(() => {
    scheduledTimer = undefined;
    void syncPersonalLearningData().catch(() => undefined);
  }, 500);
}
