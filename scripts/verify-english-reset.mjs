#!/usr/bin/env node
import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
import { build } from 'esbuild';

const root = process.cwd();
const cache = path.join(root, 'node_modules/.cache/english-reset-test');
mkdirSync(cache, { recursive: true });
const result = await build({
  stdin: { contents: "export * as study from './lib/englishStudyState'; export * as backup from './lib/englishBackup'; export * as supplement from './lib/englishSupplement/progress';", resolveDir: root },
  bundle: true, write: false, platform: 'node', format: 'esm', logLevel: 'silent',
  plugins: [{ name: 'isolated-storage', setup(build) {
    build.onResolve({ filter: /^(react-native|@react-native-async-storage\/async-storage)$/ }, args => ({ path: args.path, namespace: 'test' }));
    build.onResolve({ filter: /^\.\/personalLearningSync$/ }, () => ({ path: 'sync', namespace: 'test' }));
    build.onResolve({ filter: /^\.\/supabase$/ }, () => ({ path: 'supabase', namespace: 'test' }));
    build.onLoad({ filter: /.*/, namespace: 'test' }, args => ({ loader: 'js', contents: args.path === 'react-native'
      ? "export const Platform = { get OS(){ return globalThis.__resetPlatform || 'web'; } };"
      : args.path === 'sync'
      ? 'export function schedulePersonalLearningSync(){ globalThis.__syncScheduled = (globalThis.__syncScheduled || 0) + 1; }'
      : args.path === 'supabase'
      ? 'export const supabase = {}; export function isSupabaseConfigured(){ return false; }'
      : 'export default { async getItem(k){return globalThis.__resetNative.get(k) ?? null}, async setItem(k,v){globalThis.__resetNative.set(k,v)} };' }));
  } }],
});
const bundle = path.join(cache, 'bundle.mjs');
writeFileSync(bundle, result.outputFiles[0].text);
const app = await import(`${bundle}?run=${Date.now()}`);
const { study, backup, supplement } = app;
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks++; };
const store = new Map();
let failNextWrite = false;
globalThis.window = { localStorage: {
  getItem: key => store.get(key) ?? null,
  setItem: (key, value) => {
    if (failNextWrite && key === study.STUDY_KEY) { failNextWrite = false; throw Error('quota'); }
    store.set(key, String(value));
  },
  removeItem: key => store.delete(key),
} };
const storage = {
  async getItem(key) { return store.get(key) ?? null; },
  async setItem(key, value) { store.set(key, String(value)); },
  async removeItem(key) { store.delete(key); },
};
const initial = {
  version: 1,
  sessions: {
    first: { stage: 8, sentenceIndex: 4, revealed: true, evidencePassed: true },
    second: { stage: 4, sentenceIndex: 3, revealed: true, evidencePassed: false },
  },
  days: { '2026-10-01': 4500 },
  lessonEvidence: { first: { check: { skill: 'reading', correct: true, attempts: 3, heard: false } } },
};
const legacy = JSON.parse(JSON.stringify(initial));
store.set(study.STUDY_KEY, JSON.stringify(initial));
store.set('sentence_course_progress_v1', 'completion and review history');
store.set('another_language', 'other course');
const beforeRestart = await study.loadStudy();
const restarted = await study.resetLessonSession('first');
const session = restarted.sessions.first;
check(session.stage === 0 && session.sentenceIndex === 0 && !session.revealed && !session.evidencePassed, 'restart persists a fresh position and flags');
check(session.attempt.generation === 1 && !!session.attempt.id && Object.keys(session.attemptEvidence).length === 0, 'restart creates a fresh attempt and no attempt answers');
check(JSON.stringify(restarted.sessions.second) === JSON.stringify(initial.sessions.second), 'another lesson survives');
check(JSON.stringify(restarted.lessonEvidence) === JSON.stringify(initial.lessonEvidence) && restarted.days['2026-10-01'] === 4500, 'historical evidence and study time survive');
check(store.get('sentence_course_progress_v1') === 'completion and review history' && store.get('another_language') === 'other course', 'completion, review, and other languages are untouched');
check(JSON.stringify((await study.loadStudy()).sessions.first) === JSON.stringify(session), 'reload sees the persisted fresh attempt');
await assert.rejects(study.saveLessonSession('first', beforeRestart.sessions.first)); checks++;
check((await study.loadStudy()).sessions.first.stage === 0, 'a stale pre-reset autosave is rejected');
await study.saveLessonSession('first', { ...session, stage: 1, sentenceIndex: 2, attemptEvidence: { check: true } });
check((await study.loadStudy()).sessions.first.sentenceIndex === 2 && (await study.loadStudy()).sessions.first.attemptEvidence.check, 'normal resume saves new-attempt progress and checks');
const progressed = await study.loadStudy();
const oldStorage = store.get(study.STUDY_KEY);
failNextWrite = true;
await assert.rejects(study.resetLessonSession('first')); checks++;
check(store.get(study.STUDY_KEY) === oldStorage, 'failed persistence leaves the previous attempt unchanged');
store.set(study.STUDY_KEY, '{bad json');
await assert.rejects(study.resetLessonSession('first')); checks++;
check(store.get(study.STUDY_KEY) === '{bad json', 'corrupt state is not overwritten');
store.set(study.STUDY_KEY, oldStorage);
const restartedAgain = await study.resetLessonSession('first');
check(restartedAgain.sessions.first.attempt.generation === 2, 'a second restart supersedes a first restart');
await assert.rejects(study.saveLessonSession('first', progressed.sessions.first)); checks++;
check((await study.loadStudy()).sessions.first.stage === 0, 'old generated attempts cannot overwrite a later restart');
const laterSession = restartedAgain.sessions.first;
const emptySupplement = supplement.parseProgress(null);
const incomingLegacy = { study: legacy, supplement: emptySupplement };
const syncResult = await backup.mergeEnglishSyncExtras(incomingLegacy, storage);
check(syncResult.study.sessions.first.attempt.generation === 2 && syncResult.study.sessions.first.stage === 0 && !syncResult.study.sessions.first.revealed && !syncResult.study.sessions.first.evidencePassed, 'stale cloud data cannot resurrect progress or flags');
check(syncResult.study.sessions.second.stage === 4 && syncResult.study.lessonEvidence.first.check.attempts === 3, 'cloud merge preserves unrelated lessons and historical evidence');
function memoryStorage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return {
    values,
    async getItem(key) { return values.get(key) ?? null; },
    async setItem(key, value) { values.set(key, String(value)); },
    async removeItem(key) { values.delete(key); },
  };
}
const oldBackup = await backup.exportEnglishBackup(memoryStorage({ [study.STUDY_KEY]: JSON.stringify(legacy) }));
const restoreTarget = memoryStorage({ [study.STUDY_KEY]: JSON.stringify(restartedAgain), unrelated: 'keep' });
await backup.restoreEnglishBackup(oldBackup, restoreTarget);
const restoredStudy = JSON.parse(restoreTarget.values.get(study.STUDY_KEY));
check(restoredStudy.sessions.first.stage === 0 && restoredStudy.sessions.first.attempt.generation === 2, 'restoring an old backup does not undo the restart');
check(restoredStudy.lessonEvidence.first.check.attempts === 3 && restoreTarget.values.get('unrelated') === 'keep', 'backup restore keeps historical evidence and unrelated data');
const reverse = await backup.mergeEnglishSyncExtras({ study: restartedAgain, supplement: emptySupplement }, {
  values: new Map([[study.STUDY_KEY, JSON.stringify(legacy)]]),
  async getItem(key) { return this.values.get(key) ?? null; },
  async setItem(key, value) { this.values.set(key, String(value)); },
  async removeItem(key) { this.values.delete(key); },
});
check(reverse.study.sessions.first.stage === 0 && reverse.study.sessions.first.attempt.generation === 2, 'new attempt wins even when received from the cloud');
check(study.compareLessonAttempts({ generation: 2, id: 'z' }, { generation: 2, id: 'a' }) > 0
  && study.compareLessonAttempts({ generation: 2, id: 'a' }, { generation: 2, id: 'z' }) < 0, 'concurrent restarts at the same generation converge on a deterministic winner');
const sameAttempt = structuredClone(restartedAgain);
sameAttempt.sessions.first = { ...laterSession, stage: 2, sentenceIndex: 1, attemptEvidence: { other: true } };
const sameMerged = await backup.mergeEnglishSyncExtras({ study: sameAttempt, supplement: emptySupplement }, storage);
check(sameMerged.study.sessions.first.stage === 2 && sameMerged.study.sessions.first.attemptEvidence.other, 'normal progress within the same attempt is merged');
const localBeforeRace = await study.loadStudy();
let release;
let entered;
const enteredPromise = new Promise(resolve => { entered = resolve; });
const gate = new Promise(resolve => { release = resolve; });
let waited = false;
const delayed = {
  ...storage,
  async getItem(key) {
    if (key === study.STUDY_KEY && !waited) { waited = true; entered(); await gate; }
    return storage.getItem(key);
  },
};
const cloudMerge = backup.mergeEnglishSyncExtras(incomingLegacy, delayed);
await enteredPromise;
const queuedReset = study.resetLessonSession('first');
release();
await cloudMerge;
await queuedReset;
const afterRace = await study.loadStudy();
check(afterRace.sessions.first.attempt.generation === localBeforeRace.sessions.first.attempt.generation + 1 && afterRace.sessions.first.stage === 0, 'reset serializes after an in-flight cloud merge');
check(afterRace.sessions.second.stage === 4 && afterRace.lessonEvidence.first.check.attempts === 3, 'serialized race retains unrelated history');
await assert.rejects(async () => study.parseStudy(JSON.stringify({ ...legacy, sessions: { first: { ...legacy.sessions.first, attempt: { generation: -1, id: 'bad' } } } }))); checks++;
check(study.parseStudy(JSON.stringify({ version: 1, sessions: {}, days: {} })).lessonEvidence !== undefined, 'old v1 records remain readable');
globalThis.__resetPlatform = 'ios';
globalThis.__resetNative = new Map([[study.STUDY_KEY, JSON.stringify(legacy)]]);
await study.resetLessonSession('first');
check((await study.loadStudy()).sessions.first.stage === 0 && (await study.loadStudy()).sessions.first.attempt.generation === 1, 'native AsyncStorage reset is durable');
console.log(`${checks} English restart, stale-save, merge, failure, history and native-storage checks passed.`);
