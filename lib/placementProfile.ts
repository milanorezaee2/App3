import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import type { PlacementLanguage, PlacementResult } from './placement';

// Bump the onboarding key so existing users receive the new source-backed quiz once.
// Previous recommendations are left intact; learning progress and old metadata are not deleted.
const PLACEMENT_METADATA_KEY = 'milo_language_placement_v2';
const PLACEMENT_CACHE_PREFIX = 'milo_language_placement_v2:';

export type PlacementRecommendation = {
  levelId: number;
  completedAt: string;
  correctCount: number;
  questionCount: number;
};

type PlacementRecords = Partial<Record<PlacementLanguage, PlacementRecommendation>>;

function isRecommendation(value: unknown): value is PlacementRecommendation {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<PlacementRecommendation>;
  return Number.isInteger(record.levelId) && (record.levelId as number) >= 0 && (record.levelId as number) <= 5
    && typeof record.completedAt === 'string' && Number.isFinite(Date.parse(record.completedAt))
    && Number.isInteger(record.correctCount) && (record.correctCount as number) >= 0
    && Number.isInteger(record.questionCount) && (record.questionCount as number) >= 1 && (record.questionCount as number) <= 18
    && (record.correctCount as number) <= (record.questionCount as number);
}

function parseRecords(value: unknown): PlacementRecords {
  if (!value || typeof value !== 'object') return {};
  const candidate = value as Record<string, unknown>;
  return {
    ...(isRecommendation(candidate.en) ? { en: candidate.en } : {}),
    ...(isRecommendation(candidate.ru) ? { ru: candidate.ru } : {}),
  };
}

async function readLocalRecords(userId: string): Promise<PlacementRecords> {
  try {
    const raw = await AsyncStorage.getItem(`${PLACEMENT_CACHE_PREFIX}${userId}`);
    return raw ? parseRecords(JSON.parse(raw)) : {};
  } catch {
    return {};
  }
}

export async function getSavedPlacementRecommendation(language: PlacementLanguage): Promise<PlacementRecommendation | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const user = data.session?.user;
  if (!user) return null;

  const localRecords = await readLocalRecords(user.id);
  const remoteRecords = parseRecords(user.user_metadata?.[PLACEMENT_METADATA_KEY]);
  const merged = { ...localRecords, ...remoteRecords };
  const recommendation = merged[language] ?? null;
  if (recommendation) {
    try { await AsyncStorage.setItem(`${PLACEMENT_CACHE_PREFIX}${user.id}`, JSON.stringify(merged)); } catch { /* account metadata remains authoritative */ }
  }
  return recommendation;
}

/**
 * Stores only the course recommendation and a small score summary, never raw answers.
 * Supabase user metadata keeps the choice with the account without a schema migration;
 * AsyncStorage is a same-device fallback if the metadata update is temporarily unavailable.
 */
export async function savePlacementRecommendation(language: PlacementLanguage, result: PlacementResult): Promise<{ synced: boolean }> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const user = data.session?.user;
  if (!user) throw new Error('LEARNER_SESSION_REQUIRED');

  const localRecords = await readLocalRecords(user.id);
  const remoteRecords = parseRecords(user.user_metadata?.[PLACEMENT_METADATA_KEY]);
  const next: PlacementRecords = {
    ...localRecords,
    ...remoteRecords,
    [language]: {
      levelId: result.recommendedLevelId,
      completedAt: new Date().toISOString(),
      correctCount: result.correctCount,
      questionCount: result.questionCount,
    },
  };

  try { await AsyncStorage.setItem(`${PLACEMENT_CACHE_PREFIX}${user.id}`, JSON.stringify(next)); } catch { /* continue with the account sync */ }
  const update = await supabase.auth.updateUser({ data: { [PLACEMENT_METADATA_KEY]: next } });
  return { synced: !update.error };
}
