const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const esbuild = require('esbuild');

(async () => {
  const output = path.resolve('node_modules/.cache/russian-speech-test.cjs');
  await esbuild.build({
    entryPoints: ['lib/russianSpeech.ts'], outfile: output, bundle: true, platform: 'node',
    plugins: [{ name: 'speech-mock', setup(build) {
      build.onResolve({ filter: /^expo-speech$/ }, () => ({ path: 'speech', namespace: 'stub' }));
      build.onResolve({ filter: /^react-native$/ }, () => ({ path: 'native', namespace: 'stub' }));
      build.onLoad({ filter: /.*/, namespace: 'stub' }, args => ({ contents: args.path === 'native'
        ? 'export const Platform={get OS(){return globalThis.__platform}};'
        : 'export function stop(){return globalThis.__stop()} export function speak(text,options){globalThis.__utterances.push({text,options})}', loader: 'js' }));
    } }],
  });
  const { playRussianSpeech: play, stopRussianSpeech: stop } = require(output);
  const flush = () => new Promise(resolve => setImmediate(resolve));
  const stops = [];
  global.__platform = 'android'; global.__utterances = [];
  global.__stop = () => new Promise(resolve => stops.push(resolve));
  let staleErrors = 0, currentErrors = 0;
  const first = play('Первое', .85, () => staleErrors++);
  await flush();
  assert.equal(stops.length, 1);
  const second = play('Второе', .85, () => currentErrors++);
  stops.shift()(); await first; await flush();
  assert.equal(global.__utterances.length, 0, 'a stale request must not speak after stop completes');
  assert.equal(stops.length, 1);
  stops.shift()(); await second;
  assert.equal(global.__utterances.length, 1);
  assert.equal(global.__utterances[0].text, 'Второе');
  assert.equal(global.__utterances[0].options.language, 'ru');
  assert.equal(global.__utterances[0].options.rate, .85);
  const onError = global.__utterances[0].options.onError;
  const stopped = stop(); await flush(); stops.shift()(); await stopped;
  onError(); assert.equal(currentErrors, 0, 'obsolete callbacks must not report errors');
  assert.equal(staleErrors, 0);
  global.__platform = 'ios';
  const third = play('Третье', .5); await flush(); stops.shift()(); await third;
  assert.equal(global.__utterances[1].options.language, 'ru-RU');
  assert.equal(global.__utterances[1].options.rate, .5);
  const screen = fs.readFileSync('components/RussianLesson.tsx', 'utf8');
  assert(screen.includes('sessionReady || stage !== 1 || !current') && screen.includes('speak(current.text, NORMAL_SPEECH_RATE)'));
  assert(screen.includes('lesson.id, sessionReady, stage, sentenceIndex, current?.text, speak'));
  console.log('Russian speech: automatic main-sentence hook, serialized stop, latest-request cancellation and Android/iOS language checks passed.');
})().catch(error => { console.error(error); process.exit(1); });
