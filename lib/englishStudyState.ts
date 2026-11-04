import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { Skill } from './englishSupplement/content';
import { ENGLISH_ENGINE_STEPS } from './englishLearningEngine';

export const STUDY_KEY = 'english_study_state_v1';

export interface LessonSession {
  stage: number;
  sentenceIndex: number;
  revealed: boolean;
  evidencePassed: boolean;
}

export interface CourseLessonEvidence {
  skill: Skill;
  correct: boolean;
  attempts: number;
  heard: boolean;
}

export interface StudyState {
  version: 1;
  sessions: Record<string, LessonSession>;
  days: Record<string, number>;
  /** Goal-based checks for mapped sentence-course lessons; absent in older v1 data. */
  lessonEvidence: Record<string, Record<string, CourseLessonEvidence>>;
  /**
   * Restart tombstones: lesson ids whose sessions/evidence were explicitly deleted on this
   * device. The personal-cloud merge must keep them deleted (never resurrect them from an
   * older cloud snapshot) until the cleaned state has been uploaded; re-studying a lesson
   * expires its tombstone. Absent in older v1 data.
   */
  deletedLessonIds: string[];
}

export const studyDay = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const freshSession = (): LessonSession => ({ stage: 0, sentenceIndex: 0, revealed: false, evidencePassed: false });

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

const validSkills = new Set<Skill>(['reading', 'listening', 'writing', 'grammar']);

export function parseStudy(raw: string | null): StudyState {
  if (raw === null) return { version: 1, sessions: {}, days: {}, lessonEvidence: {}, deletedLessonIds: [] };
  const parsed = JSON.parse(raw) as Partial<StudyState> | null;
  if (!parsed || parsed.version !== 1 || !isRecord(parsed.sessions) || !isRecord(parsed.days)
    || Object.values(parsed.days).some(value => typeof value !== 'number' || !Number.isFinite(value) || value < 0)
    || Object.values(parsed.sessions).some(value => !value || !Number.isInteger(value.stage)
      || value.stage < 0 || value.stage >= ENGLISH_ENGINE_STEPS.length
      || !Number.isInteger(value.sentenceIndex) || value.sentenceIndex < 0
      || typeof value.revealed !== 'boolean' || typeof value.evidencePassed !== 'boolean')) {
    throw Error('اطلاعات جلسه خوانده نشد؛ داده‌های قبلی بازنویسی نشدند.');
  }

  // Keep existing v1 learner data readable; older records simply have no lessonEvidence field.
  const lessonEvidence = parsed.lessonEvidence ?? {};
  if (!isRecord(lessonEvidence) || Object.values(lessonEvidence).some(results => !isRecord(results)
    || Object.values(results).some(result => !result || !validSkills.has(result.skill as Skill)
      || typeof result.correct !== 'boolean' || typeof result.heard !== 'boolean'
      || !Number.isSafeInteger(result.attempts) || result.attempts < 1))) {
    throw Error('سنجش درس معتبر نیست؛ داده‌های قبلی بازنویسی نشدند.');
  }

  // Restart tombstones are auxiliary: coerce leniently and never fail the whole load for them.
  const deletedLessonIds = Array.isArray(parsed.deletedLessonIds)
    ? [...new Set(parsed.deletedLessonIds.filter((id): id is string => typeof id === 'string' && !!id.trim()))]
    : [];

  return {
    ...parsed,
    version: 1,
    sessions: parsed.sessions as Record<string, LessonSession>,
    days: parsed.days as Record<string, number>,
    lessonEvidence: lessonEvidence as Record<string, Record<string, CourseLessonEvidence>>,
    deletedLessonIds,
  };
}

export async function loadStudy(): Promise<StudyState> {
  return parseStudy(Platform.OS === 'web'
    ? (typeof window === 'undefined' ? null : window.localStorage.getItem(STUDY_KEY))
    : await AsyncStorage.getItem(STUDY_KEY));
}

let queue: Promise<unknown> = Promise.resolve();
function scheduleAccountSync() {
  void import('./personalLearningSync')
    .then(({ schedulePersonalLearningSync }) => schedulePersonalLearningSync())
    .catch(() => undefined);
}
function update(change: (state: StudyState) => void): Promise<StudyState> {
  const job = queue.then(async () => {
    const state = await loadStudy();
    change(state);
    const raw = JSON.stringify(state);
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') throw Error('ذخیره‌سازی در دسترس نیست.');
      window.localStorage.setItem(STUDY_KEY, raw);
    } else await AsyncStorage.setItem(STUDY_KEY, raw);
    scheduleAccountSync();
    return state;
  });
  queue = job.catch(() => {});
  return job;
}

export function saveLessonSession(id: string, value: LessonSession) {
  return update(state => {
    state.sessions[id] = value;
    // Genuine post-restart progress wins over the restart: expire this lesson's tombstone.
    // A pristine auto-save right after a restart landing must NOT (it carries no new progress).
    const progressed = value.stage > 0 || value.sentenceIndex > 0 || value.revealed || value.evidencePassed;
    if (progressed && state.deletedLessonIds.length) state.deletedLessonIds = state.deletedLessonIds.filter(item => item !== id);
  });
}

/**
 * Forget saved positions and assessment evidence for the given lessons (daily study time is kept).
 * Stashes restart tombstones so the personal-cloud merge cannot resurrect the deleted data.
 */
export function clearLessonStudy(lessonIds: string[]) {
  const ids = [...new Set(lessonIds.map(id => id.trim()).filter(Boolean))];
  if (!ids.length) return loadStudy();
  return update(state => {
    ids.forEach(id => {
      delete state.sessions[id];
      delete state.lessonEvidence[id];
    });
    state.deletedLessonIds = [...new Set([...state.deletedLessonIds, ...ids])];
  });
}

/** Drop restart tombstones once the personal cloud row has been written without the deleted data. */
export async function consumeStudyDeletions(): Promise<void> {
  const state = await loadStudy();
  if (!state.deletedLessonIds.length) return;
  await update(next => { next.deletedLessonIds = []; });
}

export function recordLessonEvidence(lessonId: string, taskId: string, skill: Skill, correct: boolean, heard: boolean) {
  if (!lessonId.trim() || !taskId.trim() || !validSkills.has(skill)
    || typeof correct !== 'boolean' || typeof heard !== 'boolean'
    || (skill === 'listening' && !heard)) {
    return Promise.reject(Error('پاسخ سنجش معتبر نیست یا فایل شنیداری کامل نشده است.'));
  }
  return update(state => {
    const existing = state.lessonEvidence[lessonId]?.[taskId];
    state.lessonEvidence[lessonId] = {
      ...state.lessonEvidence[lessonId],
      [taskId]: { skill, correct, heard, attempts: (existing?.attempts ?? 0) + 1 },
    };
    // Fresh post-restart evidence wins over the restart: expire this lesson's tombstone.
    if (state.deletedLessonIds.length) state.deletedLessonIds = state.deletedLessonIds.filter(item => item !== lessonId);
  });
}

export function addStudyTime(day: string, milliseconds: number) {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0 || milliseconds > 10000) {
    return Promise.reject(Error('Invalid measured interval'));
  }
  return update(state => { state.days[day] = (state.days[day] ?? 0) + milliseconds; });
}

/** A delayed timer, background tab or >60s idle gap never earns phantom minutes. */
export function measuredInterval(previous: number, now: number, lastInteraction: number, active: boolean) {
  const delta = now - previous;
  return active && delta > 0 && delta <= 10000 ? Math.max(0, Math.min(delta, lastInteraction + 60000 - previous)) : 0;
}
