import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { buildLessonPractice, type PracticeItem } from './lessonPractice';
import { levelPool } from './levelAssessment';
import type { LearningLesson } from './languages/types';

/**
 * Entry placement test — «تعیین سطح ورودی».
 *
 * Adaptive by level: the learner answers a short round from the lowest level; each round passed opens
 * the next level's round, and the first round failed decides the placement. At most PLACEMENT_LEVELS
 * rounds × ROUND_SIZE items = 15 questions, usually fewer. Items come from the same practice bank as
 * lessons (listen / fill / order / true-false), in exam mode (no second chances).
 *
 * Result: the first lesson of the placed level becomes the current lesson. Nothing is marked as
 * completed — earlier lessons stay available and the learner's real record stays honest.
 */
export const ROUND_SIZE = 3;
export const PLACEMENT_LEVELS = 5;
/** Correct answers (first try) needed out of ROUND_SIZE to move on to the next level. */
export const ROUND_PASS = 2;

type LevelLesson = Pick<LearningLesson, 'id' | 'title' | 'sentences'> & { levelId: number };
type Level = { id: number; title: string; cefr: string };

export interface PlacementRecord { status: 'placed' | 'skipped'; levelId?: number; lessonId?: string; answered?: number; correct?: number; at: string }
const keyFor = (courseId: string) => `milo.${courseId}.placement.v1`;

export async function loadPlacement(courseId: string): Promise<PlacementRecord | null> {
  try { const raw = Platform.OS === 'web' ? window.localStorage.getItem(keyFor(courseId)) : await AsyncStorage.getItem(keyFor(courseId)); return raw ? JSON.parse(raw) as PlacementRecord : null; } catch { return null; }
}
export async function savePlacement(courseId: string, record: Omit<PlacementRecord, 'at'>): Promise<PlacementRecord> {
  const full: PlacementRecord = { ...record, at: new Date().toISOString() };
  try { const raw = JSON.stringify(full); if (Platform.OS === 'web') window.localStorage.setItem(keyFor(courseId), raw); else await AsyncStorage.setItem(keyFor(courseId), raw); } catch { /* local only */ }
  return full;
}
export async function clearPlacement(courseId: string): Promise<void> {
  try { if (Platform.OS === 'web') window.localStorage.removeItem(keyFor(courseId)); else await AsyncStorage.removeItem(keyFor(courseId)); } catch { /* ignore */ }
}

/** Levels the test walks through, lowest first; evenly spaced when a course has more than PLACEMENT_LEVELS. Levels with too few sentences are skipped. */
export function placementLevels(levels: readonly Level[], lessons: readonly LevelLesson[]): Level[] {
  // Pre-A1 (id < 0) is alphabet/sounds — never tested; failing the first real round places the learner at the course start.
  const usable = [...levels].sort((a, b) => a.id - b.id).filter(level => level.id >= 0).filter(level => lessons.filter(l => l.levelId === level.id).reduce((n, l) => n + l.sentences.length, 0) >= ROUND_SIZE * 2);
  if (usable.length <= PLACEMENT_LEVELS) return usable;
  const picked: Level[] = [];
  for (let i = 0; i < PLACEMENT_LEVELS; i += 1) picked.push(usable[Math.round(i * (usable.length - 1) / (PLACEMENT_LEVELS - 1))]);
  return picked.filter((level, index, all) => all.indexOf(level) === index);
}

export function buildPlacementRound(courseId: string, lessons: readonly LevelLesson[], levelId: number, attempt: number): PracticeItem[] {
  const pool = levelPool(courseId, lessons, levelId);
  return buildLessonPractice(pool, { count: ROUND_SIZE, kinds: ['listen', 'fill', 'truefalse', 'order'], seedSalt: `placement-${attempt}` });
}

/** First lesson of a level (course order). */
export function firstLessonOf(lessons: readonly LevelLesson[], levelId: number): LevelLesson | undefined {
  return lessons.find(lesson => lesson.levelId === levelId);
}
