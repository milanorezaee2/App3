const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');

(async () => {
  const output = path.resolve('node_modules/.cache/english-lesson-flow-test.cjs');
  await esbuild.build({
    stdin: { contents: "export * from './lib/englishLessonNavigation'; export * from './lib/responsiveSpeech'; export * from './lib/speechLanguage'; export * from './lib/courseContent';", resolveDir: process.cwd() },
    outfile: output, bundle: true, platform: 'node',
    plugins: [{ name: 'speech-stub', setup(build) {
      build.onResolve({ filter: /^expo-speech$/ }, () => ({ path: 'speech', namespace: 'stub' }));
      build.onResolve({ filter: /^react-native$/ }, () => ({ path: 'react-native', namespace: 'stub' }));
      build.onLoad({ filter: /.*/, namespace: 'stub' }, args => ({ contents: args.path === 'react-native'
        ? 'export const Platform = { get OS(){ return globalThis.__speechPlatform || "web"; } };'
        : 'export function speak(text,options){globalThis.__utterances.push({text,options})} export function stop(){globalThis.__stops++;return Promise.resolve()}', loader: 'js' }));
    } }],
  });
  const { previousSentenceIndex: prev, nextLessonInOrder: next, SENTENCE_LESSONS: lessons, playResponsiveSpeech: play, stopResponsiveSpeech: stop, speechTagFor } = require(output);
  let checks = 0;
  const check = (condition, message) => { assert.ok(condition, message); checks++; };
  check(next(lessons, lessons[0].id).id === lessons[1].id, 'first lesson advances to the next course lesson');
  check(next(lessons, lessons[lessons.length - 1].id) === undefined, 'end of course has no phantom lesson');
  check(next(lessons, 'missing') === undefined, 'an invalid lesson cannot jump to the first lesson');
  check(next(lessons, 'survival-past-and-future-plans').id === 'a2-foundation-past', 'level one enters the new A2 bridge');
  check(next(lessons, 'a2-foundation-past').id === 'a2-foundation-future', 'A2 bridge lessons are consecutive');
  check(next(lessons, 'a2-foundation-advice').id === 'everyday-managing-a-busy-day', 'A2 bridge leads to the first existing situation');
  check(next(lessons, 'everyday-sharing-opinions').id === 'everyday-facing-a-challenge', 'existing legacy lessons follow the situation block');
  check(next(lessons, 'everyday-handling-an-emergency').levelId === 3, 'the final A2 lesson leads to the preserved next level');
  check(next(lessons, 'b1-survival-culture-digital').id === 'b2-foundation-time-hypotheses', 'the final B1 addition leads into B2');
  check(next(lessons, 'b2-foundation-synthesis-writing').id === 'b2-survival-society-negotiation', 'B2 foundation leads to B2 survival');
  check(next(lessons, 'b2-survival-audience-feedback').id === lessons.find(lesson => lesson.levelId === 4 && lesson.contentKind === 'scenario').id, 'B2 additions lead to preserved advanced lessons');
  check(next(lessons, lessons.filter(lesson => lesson.levelId === 4).at(-1).id).id === 'c1-foundation-abstract-time', 'preserved advanced material leads to C1');
  check(next(lessons, 'c1-foundation-synthesis-precision').id === 'c1-survival-debate-negotiation', 'C1 foundation leads to C1 survival');
  check(prev(5) === 4, 'previous button returns to preceding sentence');
  check(prev(0) === 0, 'previous button stops at the first sentence');
  global.__utterances = []; global.__stops = 0;
  let oldDone = 0, oldError = 0, newDone = 0;
  play({ text: 'First sentence.', locale: 'en-US', rate: .85, onDone: () => oldDone++, onError: () => oldError++ });
  const first = global.__utterances[0];
  check(first.text === 'First sentence.' && first.options.rate === .85, 'visible sentence and speaking rate match');
  play({ text: 'Second sentence.', locale: 'en-US', rate: .85, onDone: () => newDone++ });
  first.options.onDone(); first.options.onError();
  check(oldDone === 0 && oldError === 0, 'cancelled speech cannot advance or report errors');
  await new Promise(resolve => setImmediate(resolve));
  const second = global.__utterances[1];
  check(second.text === 'Second sentence.' && global.__stops > 0, 'new sentence replaces old audio');
  second.options.onDone();
  check(newDone === 1, 'current utterance delivers its completion callback');
  await stop();
  second.options.onDone();
  check(newDone === 1, 'stopping invalidates callbacks');
  global.__speechPlatform = 'android';
  play({ text: 'English on Android.', locale: 'en-US' });
  check(global.__utterances.at(-1).options.language === 'en', 'Android English uses a supported bare language tag');
  check(speechTagFor('ru-RU') === 'ru', 'Android Russian keeps its bare language tag');
  await stop();
  global.__speechPlatform = 'ios';
  play({ text: 'English on iOS.', locale: 'en-US' });
  check(global.__utterances.at(-1).options.language === 'en-US' && speechTagFor('ru-RU') === 'ru-RU', 'iOS retains full locale tags');
  await stop();
  global.__speechPlatform = 'web';
  play({ text: 'English on web.', locale: 'en-US' });
  check(global.__utterances.at(-1).options.language === 'en-US' && speechTagFor('ru-RU') === 'ru-RU', 'web retains full locale tags');
  await stop();
  const screen = fs.readFileSync('app/course/lesson.tsx', 'utf8');
  check(screen.includes("params: { id: nextLesson.id }") && screen.includes('await completeSentenceLesson') && screen.includes('await saveLessonSession'), 'navigation occurs after durable progress and session saves');
  check(!screen.includes('saveLessonSession(lesson.id,freshSession())'), 'completion does not erase the saved session');
  const home = fs.readFileSync('app/lang/index.tsx', 'utf8');
  check(home.includes('گوش دادن از ابتدا') && home.includes("fromStart: '1'") && home.includes('SENTENCE_LESSONS[0].id'), 'home button opens the first lesson');
  check(screen.includes('جمله قبلی') && screen.includes('stage === 1') && !screen.includes('گوش‌دادن از ابتدا'), 'previous sentence is beside next, and old replay control is removed');
  check(screen.includes('preserveExistingSession.current') && screen.includes('!preserveExistingSession.current'), 'replay does not overwrite an existing saved session');
  console.log(`${checks} lesson navigation and speech lifecycle checks passed.`);
})().catch(error => { console.error(error); process.exit(1); });
