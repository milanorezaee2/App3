#!/usr/bin/env node
/**
 * Regression test for restart tombstones: a level/course restart deletes English
 * study sessions + evidence locally AND must survive the personal-cloud merge
 * (the cloud holds an older snapshot with the same lessons at their end positions).
 *
 * Uses the same esbuild + stub harness as verify-app-logic.mjs.
 * Run:  npm run validate:restart-sync
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP = path.resolve(HERE, '..');
const STUBS = path.join(HERE, 'test-stubs');
const TMP = path.join(APP, 'node_modules', '.cache', 'restart-sync-test');
mkdirSync(TMP, { recursive: true });

const PATH_NAMES = process.argv[2] ? [process.argv[2]] : ['ios', 'web'];

let esbuild;
try {
  esbuild = await import('esbuild');
} catch {
  console.log('SKIPPED — esbuild is required for this check: npm install -D esbuild');
  process.exit(0);
}

async function bundle(entry, env = {}) {
  const result = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    external: ['@supabase/supabase-js'],
    target: 'node22',
    logLevel: 'silent',
    absWorkingDir: APP,
    define: {
      'process.env.EXPO_PUBLIC_SUPABASE_URL': JSON.stringify(env.url ?? ''),
      'process.env.EXPO_PUBLIC_ENABLE_EDUCATION_ADMIN': JSON.stringify('false'),
      'process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(env.key ?? ''),
    },
    plugins: [
      {
        name: 'stubs',
        setup(b) {
          b.onResolve({ filter: /supabase\.public\.json$/ }, () => ({ path: 'public-config', namespace: 'test-config' }));
          b.onLoad({ filter: /.*/, namespace: 'test-config' }, () => ({ contents: '{}', loader: 'json' }));
          b.onResolve({ filter: /^@\// }, (args) => {
            const base = path.join(APP, args.path.slice(2));
            const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}/index.ts`, `${base}/index.tsx`];
            const hit = candidates.find((candidate) => existsSync(candidate) && !candidate.endsWith('/'));
            return hit ? { path: hit } : { errors: [{ text: `Cannot resolve ${args.path}` }] };
          });
          b.onResolve({ filter: /^@react-native-async-storage\/async-storage$/ }, () => ({ path: path.join(STUBS, 'async-storage.js') }));
          b.onResolve({ filter: /^react-native$/ }, () => ({ path: path.join(STUBS, 'react-native.js') }));
          b.onResolve(
            { filter: /^expo-(speech|audio|camera|fonts|linear-gradient|haptics|device|application|constants|location|network|battery|file-system)\b/ },
            () => ({ path: 'expo-noop.js', namespace: 'noop' }),
          );
          b.onResolve({ filter: /^\.\.?\/supabase$/, namespace: 'file' }, () => ({ path: path.join(STUBS, 'supabase.js') }));
          b.onLoad({ filter: /.*/, namespace: 'noop' }, () => ({ contents: 'export default {};', loader: 'js' }));
        },
      },
    ],
  });
  return result.outputFiles[0].text;
}

async function load(files, name, env = {}) {
  const entryPath = path.join(TMP, 'entry', `${name}.ts`);
  mkdirSync(path.dirname(entryPath), { recursive: true });
  writeFileSync(entryPath, files);
  const code = await bundle(entryPath, env);
  const outFile = path.join(TMP, `${name}.mjs`);
  writeFileSync(outFile, code);
  return import(`${outFile}?v=${Date.now()}`);
}

let pass = 0;
let totalPass = 0;
let totalFail = 0;
const problems = [];

function check(label, condition, detail = '') {
  if (condition) pass += 1;
  else problems.push(label + (detail ? ` — ${detail}` : ''));
  console.log(`  ${condition ? 'PASS' : 'FAIL'}  ${label}${!condition && detail ? ' — ' + detail : ''}`);
}

const section = (title) => console.log(`\n=== ${title} ===`);
const END_SESSION = { stage: 8, sentenceIndex: 4, revealed: false, evidencePassed: true };
const PRISTINE = { stage: 0, sentenceIndex: 0, revealed: false, evidencePassed: false };

async function runPath(OS) {
  globalThis.__RN_OS__ = OS;
  if (OS === 'web') {
    const map = new Map();
    globalThis.window = {
      localStorage: {
        getItem: (k) => (map.has(k) ? map.get(k) : null),
        setItem: (k, v) => map.set(k, String(v)),
        removeItem: (k) => map.delete(k),
      },
    };
  } else {
    delete globalThis.window;
  }

  const app = await load(
    `
export * as study from '@/lib/englishStudyState';
export * as backup from '@/lib/englishBackup';
export * as supplement from '@/lib/englishSupplement/progress';
`,
    `restart-${OS}`,
  );
  const { study, backup, supplement } = app;

  section(`restart tombstones (storage path: ${OS})`);

  // 1. Seed end-position sessions + evidence, then restart lesson A.
  await study.saveLessonSession('lesson-a', { ...END_SESSION });
  await study.recordLessonEvidence('lesson-a', 'task-1', 'reading', true, false);
  await study.saveLessonSession('lesson-b', { stage: 2, sentenceIndex: 1, revealed: false, evidencePassed: false });
  await study.clearLessonStudy(['lesson-a']);
  let state = await study.loadStudy();
  check('restart deletes the session', !state.sessions['lesson-a']);
  check('restart deletes the evidence', !state.lessonEvidence['lesson-a']);
  check('restart stashes a tombstone', state.deletedLessonIds.includes('lesson-a'));
  check('other lessons untouched', !!state.sessions['lesson-b'] && !state.deletedLessonIds.includes('lesson-b'));

  // 2. Cloud merge with an older snapshot must NOT resurrect lesson A.
  const remoteStudy = {
    version: 1,
    sessions: {
      'lesson-a': { ...END_SESSION },
      'lesson-c': { stage: 3, sentenceIndex: 0, revealed: false, evidencePassed: false },
    },
    days: {},
    lessonEvidence: { 'lesson-a': { 'task-1': { skill: 'reading', correct: true, heard: false, attempts: 2 } } },
    deletedLessonIds: ['lesson-b'], // remote tombstones must be ignored (local-only by design)
  };
  const merged = await backup.mergeEnglishSyncExtras({ study: remoteStudy, supplement: supplement.parseProgress(null) });
  check('merge keeps lesson A deleted', !merged.study.sessions['lesson-a'] && !merged.study.lessonEvidence['lesson-a']);
  check('merge keeps local lesson B', !!merged.study.sessions['lesson-b']);
  check('merge unions remote-only lesson C', !!merged.study.sessions['lesson-c']);
  check('merge ignores remote tombstones', !merged.study.deletedLessonIds.includes('lesson-b'));
  check('merge keeps local tombstone until upload', merged.study.deletedLessonIds.includes('lesson-a'));
  state = await study.loadStudy();
  check('merged state persisted locally without lesson A', !state.sessions['lesson-a']);

  // 3. Consuming tombstones after a (simulated) successful upload.
  await study.consumeStudyDeletions();
  state = await study.loadStudy();
  check('tombstones consumed after upload', state.deletedLessonIds.length === 0);
  await study.consumeStudyDeletions(); // idempotent no-op
  check('consume is idempotent', (await study.loadStudy()).deletedLessonIds.length === 0);

  // 4. A pristine auto-save after a restart landing must NOT expire the tombstone...
  await study.clearLessonStudy(['lesson-a']);
  await study.saveLessonSession('lesson-a', { ...PRISTINE });
  state = await study.loadStudy();
  check('pristine auto-save keeps the tombstone', state.deletedLessonIds.includes('lesson-a'));

  // 5. ...but genuine new progress expires it.
  await study.saveLessonSession('lesson-a', { stage: 1, sentenceIndex: 0, revealed: false, evidencePassed: false });
  state = await study.loadStudy();
  check('real progress expires the tombstone', !state.deletedLessonIds.includes('lesson-a'));
  await study.clearLessonStudy(['lesson-b']);
  await study.recordLessonEvidence('lesson-b', 'task-9', 'reading', true, false);
  state = await study.loadStudy();
  check('fresh evidence expires the tombstone', !state.deletedLessonIds.includes('lesson-b'));

  // 6. parseStudy never fails the whole load for the auxiliary field.
  for (const bad of ['"x"', '[1,2]', 'null', '[null,"  "]']) {
    const parsed = study.parseStudy(JSON.stringify({ version: 1, sessions: {}, days: {}, lessonEvidence: {}, deletedLessonIds: JSON.parse(bad) }));
    check(`tombstone coercion for ${bad}`, Array.isArray(parsed.deletedLessonIds) && parsed.deletedLessonIds.length === 0);
  }
  const legacy = study.parseStudy(JSON.stringify({ version: 1, sessions: {}, days: {}, lessonEvidence: {} }));
  check('legacy data without tombstones loads', Array.isArray(legacy.deletedLessonIds));

  // 7. An explicit backup restore cancels pending restarts (it is the newer action).
  await study.saveLessonSession('lesson-r', { stage: 4, sentenceIndex: 1, revealed: false, evidencePassed: false });
  const exported = await backup.exportEnglishBackup();
  await study.clearLessonStudy(['lesson-r']);
  check('tombstone stashed before restore', (await study.loadStudy()).deletedLessonIds.includes('lesson-r'));
  await backup.restoreEnglishBackup(exported);
  state = await study.loadStudy();
  check('restore cancels tombstones', state.deletedLessonIds.length === 0);
  check('restore brings the session back', !!state.sessions['lesson-r']);
}

for (const OS of PATH_NAMES) {
  pass = 0;
  problems.length = 0;
  await runPath(OS);
  totalPass += pass;
  totalFail += problems.length;
  console.log(`\n${'-'.repeat(56)}`);
  console.log(`storage path: ${OS}   PASS: ${pass}   FAIL: ${problems.length}`);
  if (problems.length) {
    console.log('failed checks:');
    problems.forEach((item) => console.log('  - ' + item));
    process.exitCode = 1;
  }
}

console.log(`\nTOTAL: ${totalPass} checks passed, ${totalFail} failed`);
