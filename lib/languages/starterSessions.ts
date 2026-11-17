import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { StarterLesson, NewLanguageId } from './newCourses';
import { ENGLISH_ENGINE_STEPS } from '../englishLearningEngine';
import { LESSON_STAGE_VERSION, resumeStage } from '../lessonStages';



export interface StarterLessonSession {
  stage: number;
  /** 2 = the current ladder without the removed blitz round; absent on legacy saves. */
  stageVersion?: number;
  sentenceIndex: number;
  revealed: boolean;
  answers: Record<string, number>;
  showCheckAnswers: boolean;
}

interface StarterStudyState {
  schema: 1;
  sessions: Record<string, StarterLessonSession>;
}

export function createStarterSessions(language: NewLanguageId, lessons: readonly StarterLesson[]) {
const storageKey = `${language}_starter_lesson_sessions_v1`;
const stages = { length: ENGLISH_ENGINE_STEPS.length };
function freshStarterLessonSession(): StarterLessonSession {
  return { stage: 0, stageVersion: LESSON_STAGE_VERSION, sentenceIndex: 0, revealed: false, answers: {}, showCheckAnswers: false };
}

async function readRaw(): Promise<string | null> {
  if (Platform.OS === 'web') return typeof window === 'undefined' ? null : window.localStorage.getItem(storageKey);
  return AsyncStorage.getItem(storageKey);
}

async function writeRaw(value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') throw new Error('ذخیرهٔ محلی در دسترس نیست.');
    window.localStorage.setItem(storageKey, value);
    return;
  }
  await AsyncStorage.setItem(storageKey, value);
}

function parseState(raw: string | null): StarterStudyState {
  if (raw === null) return { schema: 1, sessions: {} };
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('دادهٔ جلسهٔ این زبان ساختار معتبری ندارد.');
  const state = value as Partial<StarterStudyState>;
  if (state.schema !== 1 || !state.sessions || typeof state.sessions !== 'object' || Array.isArray(state.sessions)) throw new Error('نسخهٔ دادهٔ جلسهٔ این زبان شناخته‌شده نیست.');
  return { schema: 1, sessions: state.sessions as Record<string, StarterLessonSession> };
}

/**
 * Read a saved attempt. Writes stay strict (`validateSession`), but a *read* tolerates the two fields
 * a content rewrite can legitimately invalidate: a sentence index past the end of the lesson and an
 * answer slot whose choice list changed length. German Pre-A1 was re-authored with the same lesson and
 * sentence ids but three checks of four options instead of the old one-or-two checks of eight, so a
 * learner who had answered the old checks must still open the lesson (clamped, answers dropped) rather
 * than be told that their saved data is corrupt.
 */
function readSession(lessonId: string, value: unknown): StarterLessonSession {
  const lesson = lessons.find(item => item.id === lessonId);
  if (!lesson || !value || typeof value !== 'object' || Array.isArray(value)) throw new Error('جلسهٔ این زبان برای این درس معتبر نیست.');
  const session = value as Partial<StarterLessonSession>;
  const stage = resumeStage(Number(session.stage), session.stageVersion, stages.length);
  if (stage === null
    || !Number.isInteger(session.sentenceIndex)
    || typeof session.revealed !== 'boolean' || typeof session.showCheckAnswers !== 'boolean'
    || !session.answers || typeof session.answers !== 'object' || Array.isArray(session.answers)) {
    throw new Error('وضعیت ذخیره‌شدهٔ درس این زبان معتبر نیست؛ دادهٔ اصلی تغییر نکرده است.');
  }
  const answers: Record<string, number> = {};
  for (const [key, answer] of Object.entries(session.answers)) {
    const checkIndex = Number(key);
    const check = lesson.checks?.[checkIndex];
    if (!Number.isInteger(checkIndex) || !check || !Number.isInteger(answer) || answer! < 0 || answer! >= check.choices.length) continue;
    answers[key] = answer!;
  }
  return {
    stage,
    stageVersion: LESSON_STAGE_VERSION,
    sentenceIndex: Math.min(Math.max(0, session.sentenceIndex!), lesson.sentences.length - 1),
    revealed: session.revealed,
    answers,
    showCheckAnswers: session.showCheckAnswers,
  };
}

function validateSession(lessonId: string, value: unknown): StarterLessonSession {
  const lesson = lessons.find(item => item.id === lessonId);
  if (!lesson || !value || typeof value !== 'object' || Array.isArray(value)) throw new Error('جلسهٔ این زبان برای این درس معتبر نیست.');
  const session = value as Partial<StarterLessonSession>;
  const stage = resumeStage(Number(session.stage), session.stageVersion, stages.length);
  if (stage === null
    || !Number.isInteger(session.sentenceIndex) || session.sentenceIndex! < 0 || session.sentenceIndex! >= lesson.sentences.length
    || typeof session.revealed !== 'boolean' || typeof session.showCheckAnswers !== 'boolean'
    || !session.answers || typeof session.answers !== 'object' || Array.isArray(session.answers)) {
    throw new Error('وضعیت ذخیره‌شدهٔ درس این زبان معتبر نیست؛ دادهٔ اصلی تغییر نکرده است.');
  }
  const answers: Record<string, number> = {};
  for (const [key, answer] of Object.entries(session.answers)) {
    const checkIndex = Number(key);
    const check = lesson.checks?.[checkIndex];
    if (!Number.isInteger(checkIndex) || !check || !Number.isInteger(answer) || answer! < 0 || answer! >= check.choices.length) {
      throw new Error('پاسخ ذخیره‌شدهٔ تمرین این زبان معتبر نیست؛ دادهٔ اصلی تغییر نکرده است.');
    }
    answers[key] = answer!;
  }
  return {
    stage,
    stageVersion: LESSON_STAGE_VERSION,
    sentenceIndex: session.sentenceIndex!,
    revealed: session.revealed,
    answers,
    showCheckAnswers: session.showCheckAnswers,
  };
}

function loadStarterLessonSessionWithPresence(lessonId: string): Promise<{ session: StarterLessonSession; hasSavedSession: boolean }> {
  return serial(async () => {
    if (!lessons.some(item => item.id === lessonId)) throw new Error('درس این زبان پیدا نشد.');
    const state = parseState(await readRaw());
    const saved = state.sessions[lessonId];
    return { session: saved === undefined ? freshStarterLessonSession() : readSession(lessonId, saved), hasSavedSession: saved !== undefined };
  });
}

async function loadStarterLessonSession(lessonId: string): Promise<StarterLessonSession> {
  return (await loadStarterLessonSessionWithPresence(lessonId)).session;
}

let queue: Promise<unknown> = Promise.resolve();
function serial<T>(job: () => Promise<T>): Promise<T> {
  const next = queue.then(job, job);
  queue = next.catch(() => undefined);
  return next;
}

function saveStarterLessonSession(lessonId: string, value: StarterLessonSession): Promise<void> {
  return serial(async () => {
    const safe = validateSession(lessonId, value);
    const state = parseState(await readRaw());
    await writeRaw(JSON.stringify({ ...state, sessions: { ...state.sessions, [lessonId]: safe } }));
  });
}

/** Replace only this lesson's attempt, after any earlier queued saves. */
async function resetStarterLessonSession(lessonId: string): Promise<StarterLessonSession> {
  const fresh = freshStarterLessonSession();
  await saveStarterLessonSession(lessonId, fresh);
  return fresh;
}

function clearStarterLessonSession(lessonId: string): Promise<void> {
  return serial(async () => {
    if (!lessons.some(item => item.id === lessonId)) throw new Error('درس این زبان پیدا نشد.');
    const state = parseState(await readRaw());
    const sessions = { ...state.sessions };
    delete sessions[lessonId];
    if (Object.keys(sessions).length) await writeRaw(JSON.stringify({ ...state, sessions }));
    else if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') window.localStorage.removeItem(storageKey);
    } else await AsyncStorage.removeItem(storageKey);
  });
}

return { loadStarterLessonSessionWithPresence, loadStarterLessonSession, saveStarterLessonSession, resetStarterLessonSession, clearStarterLessonSession };
}
