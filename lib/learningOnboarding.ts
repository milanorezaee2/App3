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
export type PlacementStatus = 'assessed' | 'existing-learner';

export interface LearningOnboardingRecord {
  version: 1;
  status: PlacementStatus;
  language: OnboardingLanguage;
  completedAt: string;
  familiarity: OnboardingFamiliarity | null;
  questionCount: number;
  correctAnswers: number;
  recommendedLevelId: number | null;
}

export const LEARNING_ONBOARDING_METADATA_KEY = 'milo_learning_onboarding_v1';
const LOCAL_ONBOARDING_PREFIX = `${LEARNING_ONBOARDING_METADATA_KEY}:`;

function isOnboardingLanguage(value: unknown): value is OnboardingLanguage {
  return value === 'en' || value === 'ru';
}

function parseOnboardingRecord(value: unknown): LearningOnboardingRecord | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Partial<LearningOnboardingRecord>;
  if (record.version !== 1 || !['assessed', 'existing-learner'].includes(String(record.status))
    || !isOnboardingLanguage(record.language) || typeof record.completedAt !== 'string'
    || !Number.isFinite(Date.parse(record.completedAt))) return null;
  if (record.status === 'existing-learner') {
    return {
      version: 1,
      status: 'existing-learner',
      language: record.language,
      completedAt: record.completedAt,
      familiarity: null,
      questionCount: 0,
      correctAnswers: 0,
      recommendedLevelId: null,
    };
  }
  if (!(record.familiarity === 'new' || record.familiarity === 'familiar')
    || !Number.isInteger(record.questionCount) || record.questionCount! < 0 || record.questionCount! > 2
    || !Number.isInteger(record.correctAnswers) || record.correctAnswers! < 0
    || record.correctAnswers! > record.questionCount!
    || !Number.isInteger(record.recommendedLevelId) || record.recommendedLevelId! < 0 || record.recommendedLevelId! > 2) return null;
  return record as LearningOnboardingRecord;
}

async function currentAccountId(): Promise<string | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session?.user.id ?? null;
}

export async function getLearningOnboardingRecord(): Promise<LearningOnboardingRecord | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const user = data.session?.user;
  const fromProfile = parseOnboardingRecord(user?.user_metadata?.[LEARNING_ONBOARDING_METADATA_KEY]);
  if (fromProfile?.status === 'assessed') return fromProfile;
  const localKey = `${LOCAL_ONBOARDING_PREFIX}${user?.id ?? 'local'}`;
  try {
    const raw = await AsyncStorage.getItem(localKey);
    const localRecord = raw ? parseOnboardingRecord(JSON.parse(raw)) : null;
    // Older builds marked anyone with course history as "existing-learner" and
    // skipped the assessment. That marker did not mean the learner had answered
    // the onboarding questions, so let them complete it once now.
    return localRecord?.status === 'assessed' ? localRecord : null;
  } catch {
    return null;
  }
}

async function persistLearningOnboardingRecord(record: LearningOnboardingRecord): Promise<boolean> {
  let accountId: string | null = null;
  try {
    accountId = await currentAccountId();
  } catch {
    // Local fallback still lets a signed-in learner finish if auth is temporarily unreachable.
  }
  const localKey = `${LOCAL_ONBOARDING_PREFIX}${accountId ?? 'local'}`;
  let localSaved = false;
  try {
    await AsyncStorage.setItem(localKey, JSON.stringify(record));
    localSaved = true;
  } catch {
    // The account metadata write below remains the durable source of truth.
  }

  if (accountId) {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { [LEARNING_ONBOARDING_METADATA_KEY]: record },
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
    || !Number.isInteger(input.questionCount) || input.questionCount < 0 || input.questionCount > 2
    || !Number.isInteger(input.correctAnswers) || input.correctAnswers < 0 || input.correctAnswers > input.questionCount
    || ![0, 1, 2].includes(input.recommendedLevelId)) {
    throw new Error('پاسخ‌های سنجش کوتاه معتبر نیستند.');
  }

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

export async function rememberExistingLearner(language: OnboardingLanguage): Promise<void> {
  await persistLearningOnboardingRecord({
    version: 1,
    status: 'existing-learner',
    language,
    completedAt: new Date().toISOString(),
    familiarity: null,
    questionCount: 0,
    correctAnswers: 0,
    recommendedLevelId: null,
  });
}
