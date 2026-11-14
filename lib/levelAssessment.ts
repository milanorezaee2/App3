import AsyncStorage from '@react-native-async-storage/async-storage';
import { buildLessonPractice, type PracticeItem } from './lessonPractice';
import type { LearningLesson } from './languages/types';

type LevelId = number;
type LevelLesson = Pick<LearningLesson, 'id' | 'title' | 'sentences'> & { levelId: LevelId };

/** End-of-level assessment and daily supplementary practice, shared by every non-English course. */
export const ASSESSMENT_QUESTIONS = 20;
export const ASSESSMENT_PASS_PERCENT = 70;
export const SUPPLEMENT_QUESTIONS = 10;

const keyFor = (courseId: string) => `milo.${courseId}.levelAssessment.v1`;
export interface LevelAssessmentRecord { bestPercent: number; lastPercent: number; attempts: number; passedAt?: string; lastAt: string }
export type LevelAssessmentState = Partial<Record<LevelId, LevelAssessmentRecord>>;

export async function loadLevelAssessments(courseId: string): Promise<LevelAssessmentState> {
  try { const raw = await AsyncStorage.getItem(keyFor(courseId)); return raw ? JSON.parse(raw) as LevelAssessmentState : {}; } catch { return {}; }
}
export async function saveLevelAssessment(courseId: string, levelId: LevelId, percent: number): Promise<LevelAssessmentRecord> {
  const state = await loadLevelAssessments(courseId);
  const previous = state[levelId];
  const now = new Date().toISOString();
  const record: LevelAssessmentRecord = {
    bestPercent: Math.max(previous?.bestPercent ?? 0, percent), lastPercent: percent, attempts: (previous?.attempts ?? 0) + 1, lastAt: now,
    passedAt: previous?.passedAt ?? (percent >= ASSESSMENT_PASS_PERCENT ? now : undefined),
  };
  try { await AsyncStorage.setItem(keyFor(courseId), JSON.stringify({ ...state, [levelId]: record })); } catch { /* local only */ }
  return record;
}

/** A pooled pseudo-lesson with every sentence of the level, so items can draw distractors from the whole level. */
export function levelPool(courseId: string, allLessons: readonly LevelLesson[], levelId: LevelId) {
  const lessons = allLessons.filter(lesson => lesson.levelId === levelId);
  return { id: `${courseId}-level-${levelId}`, title: lessons[0]?.title ?? '', sentences: lessons.flatMap(lesson => lesson.sentences) };
}

function dayKey(): string { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }

/** Exam: fixed count, seeded per attempt so a retake is a different paper. */
export function buildLevelExam(pool: ReturnType<typeof levelPool>, attempt: number): PracticeItem[] {
  return buildLessonPractice(pool, { count: ASSESSMENT_QUESTIONS, seedSalt: `exam-${attempt}` });
}
/** Supplement: a fresh short round every day. */
export function buildLevelSupplement(pool: ReturnType<typeof levelPool>): PracticeItem[] {
  return buildLessonPractice(pool, { count: SUPPLEMENT_QUESTIONS, seedSalt: `daily-${dayKey()}` });
}
