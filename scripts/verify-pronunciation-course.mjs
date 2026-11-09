#!/usr/bin/env node
import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cache = path.join(root, 'node_modules', '.cache', 'pronunciation-course-test');
mkdirSync(cache, { recursive: true });
const entry = path.join(cache, 'entry.ts');
writeFileSync(entry, `
export * as course from '${path.join(root, 'lib/languages/pronunciationCourse.ts')}';
export * as progress from '${path.join(root, 'lib/languages/pronunciationProgress.ts')}';
export * as registry from '${path.join(root, 'lib/languages/registry.ts')}';
export { default as mockAsyncStorage } from '@react-native-async-storage/async-storage';
`);
const esbuild = await import('esbuild');
const stubs = path.join(root, 'scripts', 'test-stubs');
const bundle = await esbuild.build({
  entryPoints: [entry], bundle: true, write: false, format: 'esm', platform: 'node', target: 'node22', logLevel: 'silent',
  plugins: [{ name: 'local-pronunciation-storage-stubs', setup(build) {
    build.onResolve({ filter: /^react-native$/ }, () => ({ path: path.join(stubs, 'react-native.js') }));
    build.onResolve({ filter: /^@react-native-async-storage\/async-storage$/ }, () => ({ path: path.join(stubs, 'async-storage.js') }));
    build.onResolve({ filter: /^\.\.\/personalLearningSync$/ }, () => ({ path: 'personal-learning-sync', namespace: 'local-stub' }));
    build.onLoad({ filter: /.*/, namespace: 'local-stub' }, () => ({ contents: 'export function schedulePersonalLearningSync() {}', loader: 'js' }));
  } }],
});
const outfile = path.join(cache, 'bundle.mjs');
writeFileSync(outfile, bundle.outputFiles[0].text);
globalThis.__RN_OS__ = 'ios';
const app = await import(`${outfile}?run=${Date.now()}`);
const check = (condition, message) => assert.ok(condition, message);
let checks = 0;
const verify = (condition, message) => { check(condition, message); checks += 1; };

const { pronunciationUnits, PRONUNCIATION_LANGUAGES } = app.course;
const { LANGUAGE_IDS } = app.registry;
const persian = /[\u0600-\u06FF]/;
const targetLanguages = LANGUAGE_IDS;

verify(targetLanguages.every(language => pronunciationUnits(language).length >= 4), 'every registered language ships a multi-unit pronunciation workshop (no language is an exception)');
verify(PRONUNCIATION_LANGUAGES.length === targetLanguages.length, 'the workshop list is derived from the content, so no language is left behind');
for (const language of targetLanguages) {
  const units = pronunciationUnits(language);
  verify(new Set(units.map(unit => unit.id)).size === units.length, `${language} unit IDs are unique`);
  verify(units.every(unit => unit.id.startsWith(`${language}-`)), `${language} unit IDs are namespaced by language`);
  verify(units.every(unit => unit.title && unit.explanationFa && unit.focusFa && unit.practiceFa && unit.practiceText && unit.practiceMeaningFa), `${language} units include title, focus, instruction and practice sentence`);
  verify(units.every(unit => unit.examples.length >= 3), `${language} units carry at least three listening examples`);
  verify(units.every(unit => unit.examples.every(example => example.text && example.meaningFa && example.focusFa)), `${language} examples carry text, meaning and listening focus`);
  verify(units.every(unit => unit.examples.every(example => !persian.test(example.text)) && !persian.test(unit.practiceText)), `${language} sample sentences stay in the target language`);
  verify(units.every(unit => persian.test(unit.explanationFa) && persian.test(unit.practiceFa)), `${language} guidance is still written in Persian`);
  verify(units.every(unit => unit.practiceText.length <= 120), `${language} practice sentences stay short enough for slow speech`);
}
const allUnitIds = targetLanguages.flatMap(language => pronunciationUnits(language).map(unit => unit.id));
verify(new Set(allUnitIds).size === allUnitIds.length, 'no pronunciation unit is shared between languages');
verify(pronunciationUnits('en').length >= 8, 'English has a structured multi-lesson pronunciation course');
verify(pronunciationUnits('ru').length >= 3, 'Russian has a focused pronunciation course without altering its core lesson catalog');
verify(pronunciationUnits('tr').length === 4, 'Turkish keeps its four Istanbul Turkish units');
verify(pronunciationUnits('de').length === 4 && pronunciationUnits('fr').length === 4 && pronunciationUnits('es').length === 4, 'German, French and Spanish each ship four units');
verify(pronunciationUnits('en').some(unit => /thin و this/.test(unit.title)), 'English course teaches the two TH sounds');
verify(pronunciationUnits('en').some(unit => /s و ed/.test(unit.title)), 'English course teaches common suffix pronunciations');
verify(pronunciationUnits('de').some(unit => /ü و ö/.test(unit.title)) && pronunciationUnits('de').some(unit => /ch/.test(unit.title)), 'German course covers umlauts and the two ch sounds');
verify(pronunciationUnits('fr').some(unit => /خیشومی/.test(unit.title)) && pronunciationUnits('fr').some(unit => /liaison|پیوند/.test(unit.title)), 'French course covers nasal vowels and liaison');
verify(pronunciationUnits('es').some(unit => /rr/.test(unit.title)) && pronunciationUnits('es').some(unit => /c و z/.test(unit.title)), 'Spanish course covers r/rr and Spain c/z');
verify(pronunciationUnits('zz').length === 0 && !app.course.isPronunciationLanguage('zz'), 'unknown languages never open the workshop');

const storage = app.mockAsyncStorage;
await storage.clear();
const englishKey = app.progress.PRONUNCIATION_PROGRESS_KEYS.en;
const enUnit = pronunciationUnits('en')[0];
verify(targetLanguages.every(language => app.progress.PRONUNCIATION_PROGRESS_KEYS[language] === `pronunciation_practice_${language}_v1`), 'every language gets its own storage key from the registry');
verify(Object.keys(await app.progress.loadPronunciationMarks('en')).length === 0, 'missing English local marks start empty');
for (const language of targetLanguages) {
  await app.progress.savePronunciationMark(language, pronunciationUnits(language)[0].id, 'practiced');
  verify((await app.progress.loadPronunciationMarks(language))[pronunciationUnits(language)[0].id]?.mark === 'practiced', `${language} pronunciation progress persists locally`);
}
verify(Object.keys(await app.progress.loadPronunciationMarks('en')).length === 1, 'each language keeps its own separate progress');
await assert.rejects(app.progress.savePronunciationMark('de', pronunciationUnits('en')[0].id, 'practiced')); checks += 1;
await app.progress.savePronunciationMark('en', enUnit.id, null);
verify((await app.progress.loadPronunciationMarks('en'))[enUnit.id]?.mark === null, 'cleared marks persist as cross-device tombstones');

await storage.setItem(englishKey, JSON.stringify({ schemaVersion: 1, language: 'en', marks: { [enUnit.id]: 'review' } }));
verify((await app.progress.loadPronunciationMarks('en'))[enUnit.id]?.mark === 'review', 'existing v1 local marks migrate in memory without data loss');
await assert.rejects(app.progress.savePronunciationMark('en', 'unknown-unit', 'practiced')); checks += 1;

const corrupt = '{not-json';
await storage.setItem(englishKey, corrupt);
await assert.rejects(app.progress.loadPronunciationMarks('en')); checks += 1;
verify(await storage.getItem(englishKey) === corrupt, 'corrupt local data is preserved, never silently replaced');

const ui = readFileSync(path.join(root, 'components/PronunciationCourse.tsx'), 'utf8');
verify(/Speech\.speak/.test(ui), 'sample speech is played by the platform TTS engine');
verify(!/getUserMedia|Speech\.requestPermissions|Speech\.Recording|navigator\.mediaDevices|fetch\s*\(/.test(ui), 'pronunciation course does not request a microphone, record audio or call a network endpoint');
verify(readFileSync(path.join(root, 'app/lang/index.tsx'), 'utf8').includes("'/learn/en/pronunciation'"), 'English home links to its pronunciation course');
verify(readFileSync(path.join(root, 'components/AppBottomNav.tsx'), 'utf8').includes("'/learn/en/pronunciation'"), 'English navigation includes the pronunciation course');
verify(readFileSync(path.join(root, 'components/RussianBottomNav.tsx'), 'utf8').includes("'/learn/ru/pronunciation'"), 'Russian navigation includes pronunciation');
verify(readFileSync(path.join(root, 'components/RussianBottomNav.tsx'), 'utf8').includes("'/conversations'"), 'Russian navigation opens real contact conversations');
const route = readFileSync(path.join(root, 'app/learn/[language]/pronunciation.tsx'), 'utf8');
verify(!/StarterPronunciation/.test(route) && /isPronunciationLanguage/.test(route), 'one shared workshop serves every language, including the starter courses');
const nav = readFileSync(path.join(root, 'components/StarterBottomNav.tsx'), 'utf8');
verify(/'تلفظ'/.test(nav), 'starter course navigation keeps its pronunciation tab');

const synced = app.progress.SYNCED_PRONUNCIATION_LANGUAGES;
const syncModule = readFileSync(path.join(root, 'lib/personalLearningSync.ts'), 'utf8');
verify(synced.every(language => syncModule.includes(`mergeRemotePronunciationMarks('${language}'`)), 'every language flagged for account sync really merges in the sync module');
verify(targetLanguages.filter(language => !synced.includes(language)).length > 0 && /syncsToAccount/.test(ui), 'languages without account sync say their marks stay on this device');

console.log(`${checks} checks passed; every language now has a pronunciation workshop with durable per-language self-review storage, navigation and speech privacy verified.`);
