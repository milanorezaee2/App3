import AsyncStorage from '@react-native-async-storage/async-storage';
import { RUSSIAN_LESSONS, russianProgress } from './languages/russian';
import { hasAnyRussianLessonSession } from './languages/russianStudyState';
import { SENTENCE_LESSONS, type CourseLevelId } from './courseContent';
import { getCourseProgress, setInitialCourseLesson } from './courseProgress';
import { loadStudy } from './englishStudyState';
import { syncPersonalLearningData } from './personalLearningSync';
import { supabase } from './supabase';

export type OnboardingLanguage = 'en' | 'ru';
export type OnboardingFamiliarity = 'new' | 'familiar';
export type PlacementStatus = 'assessed';

export interface LearningOnboardingRecord {
  version: 1;
  status: PlacementStatus;
  language: OnboardingLanguage;
  completedAt: string;
  familiarity: OnboardingFamiliarity;
  questionCount: number;
  correctAnswers: number;
  recommendedLevelId: number;
}

type LearningOnboardingRecords = Partial<Record<OnboardingLanguage, LearningOnboardingRecord>>;

/** Legacy v1 single-language value, read for migration but no longer written. */
export const LEARNING_ONBOARDING_METADATA_KEY = 'milo_learning_onboarding_v1';
export const LEARNING_ONBOARDING_BY_LANGUAGE_KEY = 'milo_learning_onboarding_by_language_v2';
const LOCAL_ONBOARDING_PREFIX = `${LEARNING_ONBOARDING_BY_LANGUAGE_KEY}:`;
const LEGACY_LOCAL_ONBOARDING_PREFIX = `${LEARNING_ONBOARDING_METADATA_KEY}:`;

function isOnboardingLanguage(value: unknown): value is OnboardingLanguage {
  return value === 'en' || value === 'ru';
}

function parseOnboardingRecord(value: unknown): LearningOnboardingRecord | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Partial<LearningOnboardingRecord>;
  if (record.version !== 1 || record.status !== 'assessed'
    || !isOnboardingLanguage(record.language) || typeof record.completedAt !== 'string'
    || !Number.isFinite(Date.parse(record.completedAt))
    || !(record.familiarity === 'new' || record.familiarity === 'familiar')
    || !Number.isInteger(record.questionCount) || record.questionCount! < 1 || record.questionCount! > 2
    || !Number.isInteger(record.correctAnswers) || record.correctAnswers! < 0
    || record.correctAnswers! > record.questionCount!
    || !Number.isInteger(record.recommendedLevelId) || record.recommendedLevelId! < 0 || record.recommendedLevelId! > 2) return null;
  return record as LearningOnboardingRecord;
}

function parseOnboardingRecords(value: unknown): LearningOnboardingRecords {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const source = value as Partial<Record<OnboardingLanguage, unknown>>;
  const records: LearningOnboardingRecords = {};
  for (const language of ['en', 'ru'] as const) {
    const record = parseOnboardingRecord(source[language]);
    if (record?.language === language) records[language] = record;
  }
  return records;
}

async function getCurrentAccountUser() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session?.user ?? null;
}

export async function getLearningOnboardingRecord(language: OnboardingLanguage): Promise<LearningOnboardingRecord | null> {
  let accountId: string | null = null;
  try {
    const user = await getCurrentAccountUser();
    accountId = user?.id ?? null;
    const fromProfile = parseOnboardingRecords(user?.user_metadata?.[LEARNING_ONBOARDING_BY_LANGUAGE_KEY])[language];
    if (fromProfile) return fromProfile;
    const legacyProfileRecord = parseOnboardingRecord(user?.user_metadata?.[LEARNING_ONBOARDING_METADATA_KEY]);
    if (legacyProfileRecord?.language === language) return legacyProfileRecord;
  } catch {
    // Local records still allow a learner to enter the selected language offline.
  }

  const accountKey = accountId ?? 'local';
  try {
    const raw = await AsyncStorage.getItem(`${LOCAL_ONBOARDING_PREFIX}${accountKey}`);
    const localRecord = raw ? parseOnboardingRecords(JSON.parse(raw))[language] : null;
    if (localRecord) return localRecord;

    // Migrate an older single-language local record, but never treat the old
    // "existing-learner" marker as a completed assessment.
    const legacyRaw = await AsyncStorage.getItem(`${LEGACY_LOCAL_ONBOARDING_PREFIX}${accountKey}`);
    const legacyRecord = legacyRaw ? parseOnboardingRecord(JSON.parse(legacyRaw)) : null;
    return legacyRecord?.language === language ? legacyRecord : null;
  } catch {
    return null;
  }
}

async function persistLearningOnboardingRecord(record: LearningOnboardingRecord): Promise<boolean> {
  let user: Awaited<ReturnType<typeof getCurrentAccountUser>> = null;
  try {
    user = await getCurrentAccountUser();
  } catch {
    // Local fallback still lets a signed-in learner finish if auth is temporarily unreachable.
  }
  const accountKey = user?.id ?? 'local';
  const localKey = `${LOCAL_ONBOARDING_PREFIX}${accountKey}`;
  const records: LearningOnboardingRecords = {};

  try {
    const raw = await AsyncStorage.getItem(localKey);
    if (raw) Object.assign(records, parseOnboardingRecords(JSON.parse(raw)));
  } catch {
    // Start with a fresh local map if old cache data is malformed.
  }
  try {
    const legacyRaw = await AsyncStorage.getItem(`${LEGACY_LOCAL_ONBOARDING_PREFIX}${accountKey}`);
    const legacyRecord = legacyRaw ? parseOnboardingRecord(JSON.parse(legacyRaw)) : null;
    if (legacyRecord) records[legacyRecord.language] ??= legacyRecord;
  } catch {
    // Legacy cache migration is best-effort.
  }
  if (user) {
    const legacyProfileRecord = parseOnboardingRecord(user.user_metadata?.[LEARNING_ONBOARDING_METADATA_KEY]);
    if (legacyProfileRecord) records[legacyProfileRecord.language] ??= legacyProfileRecord;
  }
  records[record.language] = record;

  let localSaved = false;
  try {
    await AsyncStorage.setItem(localKey, JSON.stringify(records));
    localSaved = true;
  } catch {
    // The authenticated account metadata write below remains the durable source of truth.
  }

  if (user) {
    try {
      const accountRecords = parseOnboardingRecords(user.user_metadata?.[LEARNING_ONBOARDING_BY_LANGUAGE_KEY]);
      Object.assign(accountRecords, records);
      accountRecords[record.language] = record;
      const { error } = await supabase.auth.updateUser({
        data: { [LEARNING_ONBOARDING_BY_LANGUAGE_KEY]: accountRecords },
      });
      if (!error) return true;
    } catch {
      // Keep the local completion so a transient auth network failure cannot trap onboarding.
    }
  }
  if (localSaved) return false;
  throw new Error('ذخیرهٔ وضعیت شروع یادگیری انجام نشد. دوباره تلاش کنید.');
}

export async function hasPriorLearningActivity(language: OnboardingLanguage): Promise<boolean> {
  try {
    if (language === 'en') {
      await syncPersonalLearningData();
      const [progress, study] = await Promise.all([getCourseProgress(), loadStudy()]);
      return progress.completedLessonIds.length > 0
        || progress.currentLessonId !== SENTENCE_LESSONS[0].id
        || progress.totalMinutes > 0
        || progress.reviewCards.length > 0
        || Object.keys(study.sessions).length > 0;
    }
    const [progress, hasSessions] = await Promise.all([
      russianProgress.getCourseProgress(),
      hasAnyRussianLessonSession(),
    ]);
    return progress.completedLessonIds.length > 0
      || progress.currentLessonId !== RUSSIAN_LESSONS[0].id
      || hasSessions;
  } catch {
    // On unreadable history, never reposition a returning learner's course.
    return true;
  }
}

function firstLessonIdForLevel(language: OnboardingLanguage, levelId: number): string {
  const lesson = language === 'en'
    ? SENTENCE_LESSONS.find(item => item.levelId === levelId as CourseLevelId)
    : RUSSIAN_LESSONS.find(item => item.levelId === levelId);
  if (!lesson) throw new Error('برای نقطهٔ شروع انتخاب‌شده درسی پیدا نشد.');
  return lesson.id;
}

export async function completeLearningPlacement(input: {
  language: OnboardingLanguage;
  familiarity: OnboardingFamiliarity;
  questionCount: number;
  correctAnswers: number;
  recommendedLevelId: 0 | 1 | 2;
}): Promise<{ record: LearningOnboardingRecord; syncedToAccount: boolean }> {
  if (!isOnboardingLanguage(input.language) || !['new', 'familiar'].includes(input.familiarity)
    || !Number.isInteger(input.questionCount) || input.questionCount < 1 || input.questionCount > 2
    || !Number.isInteger(input.correctAnswers) || input.correctAnswers < 0 || input.correctAnswers > input.questionCount
    || ![0, 1, 2].includes(input.recommendedLevelId)) {
    throw new Error('پاسخ‌های سنجش کوتاه معتبر نیستند.');
  }

  // Existing progress is used only to protect the saved course position; it must
  // not stop the learner from answering this language's first-time assessment.
  if (!(await hasPriorLearningActivity(input.language))) {
    const startingLessonId = firstLessonIdForLevel(input.language, input.recommendedLevelId);
    if (input.language === 'en') await setInitialCourseLesson(startingLessonId);
    else await russianProgress.setInitialLesson(startingLessonId);
  }

  const record: LearningOnboardingRecord = {
    version: 1,
    status: 'assessed',
    language: input.language,
    completedAt: new Date().toISOString(),
    familiarity: input.familiarity,
    questionCount: input.questionCount,
    correctAnswers: input.correctAnswers,
    recommendedLevelId: input.recommendedLevelId,
  };
  const syncedToAccount = await persistLearningOnboardingRecord(record);
  return { record, syncedToAccount };
}
