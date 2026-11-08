const assert = require('node:assert/strict');
const esbuild = require('esbuild');
const path = require('node:path');
const tick = () => new Promise(resolve => setImmediate(resolve));
(async () => {
  const output = path.resolve('node_modules/.cache/starter-speech.cjs');
  await esbuild.build({entryPoints:['lib/starterSpeech.ts'], bundle:true, platform:'node', format:'cjs', outfile:output, plugins:[{name:'speech-test-stubs', setup(b) {
    b.onResolve({filter:/^expo-speech$/}, () => ({path:'speech', namespace:'stub'}));
    b.onResolve({filter:/^react-native$/}, () => ({path:'platform', namespace:'stub'}));
    b.onLoad({filter:/.*/, namespace:'stub'}, args => ({loader:'js', contents:args.path === 'platform' ? 'export const Platform={get OS(){return globalThis.__os}};' : `export const getAvailableVoicesAsync=()=>globalThis.__getVoices(); export const stop=async()=>{globalThis.__stops++}; export const speak=(text,options)=>globalThis.__spoken.push({text,...options});`}));
  }}]});
  const {playStarterSpeech, stopStarterSpeech} = require(output);
  global.__os = 'android'; global.__stops = 0; global.__spoken = [];
  let voices = [
    {identifier:'es-mx', language:'es-MX', quality:'Enhanced'},
    {identifier:'es-es-x-network', language:'es-ES', quality:'Enhanced'},
    {identifier:'es-spain-default', language:'es-ES', quality:'Default'},
    {identifier:'german', language:'de-DE', quality:'Default'},
  ];
  global.__getVoices = async () => voices;
  let fallbacks = 0, errors = 0;
  const onError = () => errors++;
  const onFallback = () => fallbacks++;
  await playStarterSpeech('es-ES','¡Hola!',.5,onError,onFallback);
  assert.equal(__spoken.at(-1).voice,'es-spain-default'); // known network voice is not preferred
  assert.equal(__spoken.at(-1).language,'es'); assert.equal(__spoken.at(-1).rate,.5);
  __spoken.at(-1).onStart(); assert.equal(fallbacks,0);
  await playStarterSpeech('de-DE','Hallo!',1,onError,onFallback);
  assert.equal(__spoken.at(-1).voice,'german'); assert.equal(__spoken.at(-1).language,'de');

  // The first voice fails: retry another exact regional voice before reporting an error.
  await playStarterSpeech('es-ES','¡Buenas noches!',1,onError,onFallback);
  __spoken.at(-1).onError(); await tick();
  assert.equal(__spoken.at(-1).voice,'es-es-x-network'); assert.equal(errors,0);
  __spoken.at(-1).onError(); await tick();
  assert.equal(__spoken.at(-1).voice,undefined); assert.equal(__spoken.at(-1).language,'es');
  __spoken.at(-1).onStart(); assert.equal(fallbacks,1);
  __spoken.at(-1).onError(); await tick();
  assert.equal(__spoken.at(-1).voice,'es-mx'); __spoken.at(-1).onStart(); assert.equal(fallbacks,2);
  __spoken.at(-1).onError(); await tick(); assert.equal(errors,1);

  // Repeated sentences in all three new courses, including intermittent
  // failures, do not poison the queue or replay a previous sentence.
  for (const locale of ['de-DE', 'fr-FR', 'es-ES']) {
    voices = [{identifier:`${locale}-local`, language:locale, quality:'Default'}];
    for (let i=0; i<8; i++) {
      const text = `${locale} sentence ${i}`;
      await playStarterSpeech(locale,text,i % 2 ? .5 : 1,onError,onFallback);
      assert.equal(__spoken.at(-1).text,text);
      if (i % 2) { __spoken.at(-1).onError(); await tick(); assert.equal(__spoken.at(-1).text,text); assert.equal(__spoken.at(-1).voice,undefined); }
      __spoken.at(-1).onStart();
    }
  }
  assert.equal(errors,1);

  voices=[{identifier:'fr-ca',language:'fr-CA',quality:'Default'}];
  await playStarterSpeech('fr-FR','Bonjour !',1,onError,onFallback);
  assert.equal(__spoken.at(-1).voice,undefined); __spoken.at(-1).onError(); await tick();
  assert.equal(__spoken.at(-1).voice,'fr-ca');
  const previousFallbacks = fallbacks; __spoken.at(-1).onStart(); assert.equal(fallbacks, previousFallbacks + 1);
  voices=[{identifier:'en',language:'en-US',quality:'Default'}]; const count=__spoken.length;
  await playStarterSpeech('de-DE','Hallo!',1,onError,onFallback); assert.equal(errors,2); assert.equal(__spoken.length,count);
  voices=[]; await playStarterSpeech('es-ES','Hola',1,onError,onFallback); assert.equal(__spoken.at(-1).voice,undefined);
  global.__os='web'; voices=[{identifier:'france',language:'fr-FR',quality:'Default'}];
  await playStarterSpeech('fr-FR','Bonjour',.5); assert.equal(__spoken.at(-1).language,'fr-FR'); assert.equal(__spoken.at(-1).voice,'france');

  // A late error from an interrupted utterance must not replay it or show an error.
  const old = __spoken.at(-1);
  await playStarterSpeech('fr-FR','Nouveau',1,onError,onFallback);
  const beforeOldError = __spoken.length;
  old.onError(); await tick(); assert.equal(__spoken.length,beforeOldError); assert.equal(errors,2);
  const interrupted = __spoken.at(-1); await stopStarterSpeech();
  interrupted.onError(); await tick(); assert.equal(__spoken.length,beforeOldError); assert.equal(errors,2);

  let release; __getVoices=()=>new Promise(r=>release=r); const before=__spoken.length;
  const first=playStarterSpeech('de-DE','old',1); await new Promise(r=>setTimeout(r,10));
  const next=playStarterSpeech('de-DE','new',1); release([{identifier:'german',language:'de-DE',quality:'Default'}]);
  await new Promise(r=>setTimeout(r,10)); release([{identifier:'german',language:'de-DE',quality:'Default'}]);
  await Promise.all([first,next]); assert.equal(__spoken.length,before+1); assert.equal(__spoken.at(-1).text,'new');
  console.log('Starter speech: regional preference, voice retries, repeated sentences, rates, exhaustion and cancellation passed.');
})().catch(e => { console.error(e); process.exit(1); });
