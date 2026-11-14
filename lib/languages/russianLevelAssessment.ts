import AsyncStorage from '@react-native-async-storage/async-storage';
import { RUSSIAN_LESSONS, type RussianLevelId } from './russian';
import { buildLessonPractice, type PracticeItem } from '../lessonPractice';

/** End-of-level assessment and daily supplementary practice for the Russian course. */
export const ASSESSMENT_QUESTIONS = 20;
export const ASSESSMENT_PASS_PERCENT = 70;
export const SUPPLEMENT_QUESTIONS = 10;

const KEY = 'milo.ru.levelAssessment.v1';
export interface LevelAssessmentRecord { bestPercent: number; lastPercent: number; attempts: number; passedAt?: string; lastAt: string }
export type LevelAssessmentState = Partial<Record<RussianLevelId, LevelAssessmentRecord>>;

export async function loadLevelAssessments(): Promise<LevelAssessmentState> {
  try { const raw = await AsyncStorage.getItem(KEY); return raw ? JSON.parse(raw) as LevelAssessmentState : {}; } catch { return {}; }
}
export async function saveLevelAssessment(levelId: RussianLevelId, percent: number): Promise<LevelAssessmentRecord> {
  const state = await loadLevelAssessments();
  const previous = state[levelId];
  const now = new Date().toISOString();
  const record: LevelAssessmentRecord = {
    bestPercent: Math.max(previous?.bestPercent ?? 0, percent), lastPercent: percent, attempts: (previous?.attempts ?? 0) + 1, lastAt: now,
    passedAt: previous?.passedAt ?? (percent >= ASSESSMENT_PASS_PERCENT ? now : undefined),
  };
  try { await AsyncStorage.setItem(KEY, JSON.stringify({ ...state, [levelId]: record })); } catch { /* local only */ }
  return record;
}

/** A pooled pseudo-lesson with every sentence of the level, so items can draw distractors from the whole level. */
export function levelPool(levelId: RussianLevelId) {
  const lessons = RUSSIAN_LESSONS.filter(lesson => lesson.levelId === levelId);
  return { id: `ru-level-${levelId}`, title: lessons[0]?.title ?? '', sentences: lessons.flatMap(lesson => lesson.sentences) };
}

function dayKey(): string { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }

/** Exam: fixed count, seeded per attempt so a retake is a different paper. */
export function buildLevelExam(levelId: RussianLevelId, attempt: number): PracticeItem[] {
  return buildLessonPractice(levelPool(levelId), { count: ASSESSMENT_QUESTIONS, seedSalt: `exam-${attempt}` });
}
/** Supplement: a fresh short round every day. */
export function buildLevelSupplement(levelId: RussianLevelId): PracticeItem[] {
  return buildLessonPractice(levelPool(levelId), { count: SUPPLEMENT_QUESTIONS, seedSalt: `daily-${dayKey()}` });
}
