#!/usr/bin/env node
/* Exercise real non-English stores on native and web, plus screen entry wiring. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const esbuild = require('esbuild');

(async () => {
  const root = path.resolve(__dirname, '..');
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'nonenglish-restart-'));
  const output = path.join(temp, 'stores.cjs');
  await esbuild.build({
    stdin: {
      contents: `export { NEW_COURSES } from './lib/languages/newCourses';
        export { TURKISH_LESSONS } from './lib/languages/turkish';
        export { RUSSIAN_LESSONS } from './lib/languages/russian';
        export * from './lib/languages/turkishStudyState';
        export * from './lib/languages/russianStudyState';`,
      resolveDir: root,
    },
    outfile: output, bundle: true, platform: 'node', format: 'cjs', logLevel: 'silent',
    plugins: [{ name: 'storage-stubs', setup(build) {
      build.onResolve({ filter: /^@react-native-async-storage\/async-storage$/ }, () => ({ path: 'storage', namespace: 'stub' }));
      build.onResolve({ filter: /^react-native$/ }, () => ({ path: 'native', namespace: 'stub' }));
      build.onResolve({ filter: /^\.{1,2}\/supabase$/ }, () => ({ path: 'supabase', namespace: 'stub' }));
      build.onLoad({ filter: /.*/, namespace: 'stub' }, ({ path: name }) => ({ loader: 'js', contents: name === 'storage' ? `
        export default {
          async getItem(key) { return globalThis.__restartData.get(key) ?? null; },
          async setItem(key, value) {
            const hold = globalThis.__restartHold;
            if (hold && hold.key === key) { globalThis.__restartHold = null; hold.started(); await hold.wait; }
            if (globalThis.__restartFailKey === key) { globalThis.__restartFailKey = null; throw Error('write failed'); }
            globalThis.__restartData.set(key, value);
          },
          async removeItem(key) { globalThis.__restartData.delete(key); }
        };` : name === 'native' ? `export const Platform = { get OS() { return globalThis.__restartPlatform; } };`
        : `export const supabase = {};` }));
    } }],
  });
  const app = require(output);
  const data = globalThis.__restartData = new Map();
  globalThis.window = { localStorage: {
    getItem(key) { return data.get(key) ?? null; },
    setItem(key, value) {
      if (globalThis.__restartFailKey === key) { globalThis.__restartFailKey = null; throw Error('write failed'); }
      data.set(key, value);
    },
    removeItem(key) { data.delete(key); },
  } };
  const suites = [
    ...['de', 'fr', 'es'].map(id => ({
      id, key: `${id}_starter_lesson_sessions_v1`, lessons: app.NEW_COURSES[id].lessons,
      save: app.NEW_COURSES[id].sessions.saveStarterLessonSession,
      reset: app.NEW_COURSES[id].sessions.resetStarterLessonSession,
      load: app.NEW_COURSES[id].sessions.loadStarterLessonSessionWithPresence,
    })),
    { id: 'tr', key: app.TURKISH_STUDY_STORAGE_KEY, lessons: app.TURKISH_LESSONS, save: app.saveTurkishLessonSession, reset: app.resetTurkishLessonSession, load: app.loadTurkishLessonSessionWithPresence },
    { id: 'ru', key: app.RUSSIAN_STUDY_STORAGE_KEY, lessons: app.RUSSIAN_LESSONS, save: app.saveRussianLessonSession, reset: app.resetRussianLessonSession, load: app.loadRussianLessonSessionWithPresence },
  ];
  const fresh = { stage: 0, sentenceIndex: 0, revealed: false, answers: {}, showCheckAnswers: false };
  let checks = 0;
  const check = (value, message) => { assert.ok(value, message); checks++; };
  for (const platform of ['ios', 'web']) {
    globalThis.__restartPlatform = platform;
    for (const suite of suites) {
      data.clear();
      const target = suite.lessons.find((item, index) => index > 0 && item.sentences.length > 1 && item.checks?.[0]?.choices?.length);
      const other = suite.lessons.find(item => item.id !== target.id && item.sentences.length > 1);
      assert.ok(target && other, `${suite.id} test lessons exist`);
      const absent = suite.lessons.find(item => item.id !== target.id && item.id !== other.id);
      assert.ok(absent, `${suite.id} has a separate absent lesson`);
      const old = { stage: 8, sentenceIndex: 1, revealed: true, answers: { '0': 0 }, showCheckAnswers: true };
      const otherSession = { stage: 3, sentenceIndex: 1, revealed: true, answers: {}, showCheckAnswers: false };
      data.set('progress-history-reviews-streaks', '{"completion":[1],"reviews":[2],"streak":7}');
      data.set('unrelated-draft', 'draft must survive');
      await suite.save(target.id, old);
      await suite.save(other.id, otherSession);
      check(!(await suite.load(absent.id)).hasSavedSession, `${platform}/${suite.id}: absent session is distinct from fresh`);
      if (platform === 'ios') {
        let started, release;
        const startedPromise = new Promise(resolve => { started = resolve; });
        const wait = new Promise(resolve => { release = resolve; });
        globalThis.__restartHold = { key: suite.key, started, wait };
        const previousSave = suite.save(target.id, old);
        await startedPromise;
        const reset = suite.reset(target.id);
        const resume = suite.load(target.id);
        release();
        await previousSave;
        assert.deepEqual(await reset, fresh);
        assert.deepEqual(await resume, { session: fresh, hasSavedSession: true });
        checks += 2;
      } else {
        const previousSave = suite.save(target.id, old);
        const reset = suite.reset(target.id);
        const resume = suite.load(target.id);
        await previousSave;
        assert.deepEqual(await reset, fresh);
        assert.deepEqual(await resume, { session: fresh, hasSavedSession: true });
        checks += 2;
      }
      assert.deepEqual((await suite.load(other.id)).session, otherSession); checks++;
      check(data.get('unrelated-draft') === 'draft must survive' && data.get('progress-history-reviews-streaks') === '{"completion":[1],"reviews":[2],"streak":7}', `${platform}/${suite.id}: unrelated history and drafts survive`);
      await suite.save(target.id, old);
      const beforeFailure = data.get(suite.key);
      globalThis.__restartFailKey = suite.key;
      await assert.rejects(suite.reset(target.id), /write failed/); checks++;
      check(data.get(suite.key) === beforeFailure, `${platform}/${suite.id}: failed write does not claim or persist reset`);
      assert.deepEqual((await suite.load(target.id)).session, old); checks++;
      await suite.reset(target.id);
      assert.deepEqual((await suite.load(target.id)).session, fresh); checks++;
      await suite.save(target.id, old);
      assert.deepEqual((await suite.load(target.id)).session, old); checks++;
      await assert.rejects(suite.reset('not-a-lesson')); checks++;
      data.set(suite.key, '{bad json');
      await assert.rejects(suite.reset(target.id)); checks++;
      check(data.get(suite.key) === '{bad json', `${platform}/${suite.id}: corrupt store is not overwritten`);
    }
  }
  // Static integration checks complement the runtime store checks; they do not replace device UI testing.
  for (const lang of ['Starter', 'Turkish', 'Russian']) {
    const lesson = fs.readFileSync(path.join(root, 'components', `${lang}Lesson.tsx`), 'utf8');
    const home = fs.readFileSync(path.join(root, 'components', `${lang}Home.tsx`), 'utf8');
    const library = fs.readFileSync(path.join(root, 'components', `${lang}Library.tsx`), 'utf8');
    const handler = lesson.slice(lesson.indexOf('const startCurrentLessonFromBeginning'), lesson.indexOf('const selectSentence'));
    check(handler.includes(`reset${lang}LessonSession(lesson.id)`) && handler.includes(`stop${lang}Speech()`), `${lang}: header immediately queues same-lesson reset and stops speech`);
    check(lesson.includes(`? (restartPromise.current ??= reset${lang}LessonSession(lesson.id))`) && lesson.includes('replayingLevel && result.hasSavedSession') && !lesson.includes('lesson.id === lessons[0].id'), `${lang}: fromStart resets any lesson rather than using the separate level-replay mode`);
    check(lesson.includes('setStage(saved.stage)') && lesson.includes('setAnswers(saved.answers)') && lesson.includes('شروع مجدد ذخیره نشد'), `${lang}: successful reset hydrates fresh state and failure is visible`);
    check(home.includes("id: heroLesson.id, fromStart: '1'") && home.includes('onPress={replayBeginnerLevel}') && home.includes("levelReplay: '1'"), `${lang}: current-lesson reset differs from non-destructive level replay`);
    check(library.includes('hasSavedSession ? saved.session : null') && library.includes('openLesson(item.id)'), `${lang}: library distinguishes absent sessions and resumes selected lesson`);
  }
  const dynamicRoute = fs.readFileSync(path.join(root, 'app/learn/[language]/lesson.tsx'), 'utf8');
  const ruRoute = fs.readFileSync(path.join(root, 'app/learn/ru/lesson.tsx'), 'utf8');
  check(dynamicRoute.includes("fromStart === '1' ? 'listen'") && dynamicRoute.includes("fromStart={fromStart === '1'}") && ruRoute.includes("fromStart={fromStart === '1'}"), 'all route variants pass the home reset signal');
  fs.rmSync(temp, { recursive: true, force: true });
  console.log(`${checks} non-English restart checks passed (native + web; DE/FR/ES/TR/RU).`);
})().catch(error => { console.error(error); process.exitCode = 1; });
