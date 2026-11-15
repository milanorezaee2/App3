import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { SUPABASE_PUBLIC_URL } from '@/lib/supabaseConfig';
import { bandOfLevel, type CefrBand } from '@/lib/content/courseSpec';
import { tokenize, type CourseLanguage } from '@/lib/content/readiness';
import { registerPackAudio } from '@/lib/content/packAudio';

/**
 * Content packs — versioned sentence bundles produced by the content factory (`scripts/content/`) and
 * served from Supabase Storage, so a course can grow without a new APK.
 *
 *   bucket `content-packs` (public):
 *     manifest.json                → { schema: 1, packs: [{ language, band, version, path, sentences }] }
 *     <language>/<band>.v<N>.json  → ContentPack
 *
 * The app keeps the last good copy of every pack locally (AsyncStorage / localStorage) and only downloads
 * a pack whose version changed, so lessons work fully offline after the first sync. Pack sentences are
 * attached to the lesson they fit best (explicit `lesson` or word overlap) and surface as extra «دور سریع»
 * items; if a sentence carries `audio`, that recording plays instead of the device TTS voice.
 */

export interface PackSentence {
  id: string;
  text: string;
  fa: string;
  /** Pronunciation / transliteration hint shown under the sentence (optional). */
  pronunciation?: string;
  pattern?: string;
  /** Frequency-list words this sentence was written to cover. */
  targetWords: string[];
  /** Lesson id this sentence belongs to; omitted = attach by word overlap within the band. */
  lesson?: string;
  /** Public URL of a pre-rendered recording (mp3/ogg). */
  audio?: string;
}
export interface ContentPack {
  schema: 1;
  language: CourseLanguage;
  band: CefrBand;
  version: number;
  generatedAt: string;
  /** Human-readable provenance: pipeline + reviewer, e.g. "factory v1 · reviewed 10% sample". */
  source: string;
  sentences: PackSentence[];
}
export interface PackManifest { schema: 1; packs: Array<{ language: CourseLanguage; band: CefrBand; version: number; path: string; sentences: number }> }

const BUCKET_URL = `${SUPABASE_PUBLIC_URL.replace(/\/$/, '')}/storage/v1/object/public/content-packs`;
const STORE_PREFIX = 'milo_content_pack_v1:';
const FETCH_TIMEOUT_MS = 8000;

async function readLocal(key: string): Promise<string | null> {
  try { return Platform.OS === 'web' ? window.localStorage.getItem(key) : await AsyncStorage.getItem(key); } catch { return null; }
}
async function writeLocal(key: string, value: string): Promise<void> {
  try { if (Platform.OS === 'web') window.localStorage.setItem(key, value); else await AsyncStorage.setItem(key, value); } catch { /* best-effort cache */ }
}
async function fetchJson<T>(url: string): Promise<T | null> {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS) : null;
  try {
    const response = await fetch(url, { signal: controller?.signal, headers: { 'cache-control': 'no-cache' } });
    if (!response.ok) return null;
    return await response.json() as T;
  } catch { return null; } finally { if (timer) clearTimeout(timer); }
}

export function isValidPack(value: unknown): value is ContentPack {
  if (!value || typeof value !== 'object') return false;
  const pack = value as Partial<ContentPack>;
  return pack.schema === 1 && typeof pack.language === 'string' && typeof pack.band === 'string' && typeof pack.version === 'number'
    && Array.isArray(pack.sentences) && pack.sentences.every(s => s && typeof s.id === 'string' && typeof s.text === 'string' && typeof s.fa === 'string');
}

const memory = new Map<string, ContentPack[]>();
const inflight = new Map<string, Promise<ContentPack[]>>();

/** All packs of a language: cached copies first, then a background refresh when the manifest lists a newer version. */
export function loadPacks(language: CourseLanguage): Promise<ContentPack[]> {
  const cached = memory.get(language);
  if (cached) return Promise.resolve(cached);
  const pending = inflight.get(language);
  if (pending) return pending;
  const task = (async () => {
    const packs: ContentPack[] = [];
    const localIndex = await readLocal(`${STORE_PREFIX}${language}:index`);
    const bands: CefrBand[] = localIndex ? JSON.parse(localIndex) as CefrBand[] : [];
    for (const band of bands) {
      const raw = await readLocal(`${STORE_PREFIX}${language}:${band}`);
      if (raw) { try { const pack = JSON.parse(raw) as unknown; if (isValidPack(pack)) packs.push(pack); } catch { /* ignore corrupt cache */ } }
    }
    const manifest = await fetchJson<PackManifest>(`${BUCKET_URL}/manifest.json`);
    if (manifest?.schema === 1) {
      for (const entry of manifest.packs.filter(p => p.language === language)) {
        const have = packs.find(p => p.band === entry.band);
        if (have && have.version >= entry.version) continue;
        const pack = await fetchJson<unknown>(`${BUCKET_URL}/${entry.path}`);
        if (!isValidPack(pack) || pack.language !== language) continue;
        const index = packs.findIndex(p => p.band === pack.band);
        if (index >= 0) packs[index] = pack; else packs.push(pack);
        await writeLocal(`${STORE_PREFIX}${language}:${pack.band}`, JSON.stringify(pack));
      }
      await writeLocal(`${STORE_PREFIX}${language}:index`, JSON.stringify(packs.map(p => p.band)));
    }
    for (const pack of packs) for (const sentence of pack.sentences) if (sentence.audio) registerPackAudio(sentence.text, sentence.audio);
    memory.set(language, packs);
    inflight.delete(language);
    return packs;
  })();
  inflight.set(language, task);
  return task;
}

/** Sentences a pack adds to one lesson: explicit `lesson` matches first, then the best word-overlap matches of the lesson's band. */
export function variationsForLesson(packs: readonly ContentPack[], lesson: { id: string; levelId: number; sentences: ReadonlyArray<{ text: string }> }, limit = 4): PackSentence[] {
  const band = bandOfLevel(lesson.levelId);
  const pool = packs.filter(p => p.band === band).flatMap(p => p.sentences);
  if (!pool.length) return [];
  const explicit = pool.filter(s => s.lesson === lesson.id);
  if (explicit.length >= limit) return explicit.slice(0, limit);
  const lessonWords = new Set(lesson.sentences.flatMap(s => tokenize(s.text)).filter(w => w.length >= 4));
  const scored = pool.filter(s => !s.lesson).map(s => ({ s, score: tokenize(s.text).filter(w => lessonWords.has(w)).length })).filter(x => x.score > 0).sort((a, b) => b.score - a.score);
  return [...explicit, ...scored.map(x => x.s)].slice(0, limit);
}

/** Pack sentences shaped like lesson sentences, so the practice builder can use them unchanged. */
export const asLessonSentences = (items: readonly PackSentence[]) => items.map(s => ({ id: `pack:${s.id}`, text: s.text, fa: s.fa, pronunciation: s.pronunciation ?? '', pattern: s.pattern, vocabulary: [] as Array<{ word: string; meaning: string }> }));
