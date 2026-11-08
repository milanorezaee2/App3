const assert = require('node:assert/strict');
const esbuild = require('esbuild');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'foundation-a1-'));
  try {
    const outfile = path.join(dir,'course.cjs');
    await esbuild.build({entryPoints:['lib/languages/foundationA1.ts'],bundle:true,platform:'node',format:'cjs',outfile,plugins:[{name:'stubs',setup(build){
      build.onResolve({filter:/^\.\/supabase$/},args=>args.importer.endsWith('createCourseProgressStore.ts') ? {path:'supabase',namespace:'stub'} : null);
      build.onResolve({filter:/^@react-native-async-storage\/async-storage$|^react-native$/},args=>({path:args.path,namespace:'stub'}));
      build.onLoad({filter:/.*/,namespace:'stub'},args=>({loader:'js',contents:args.path==='react-native'?'export const Platform={OS:"web"};':args.path==='supabase'?'export const supabase={};':'export default {};'}));
    }}]});
    const {FOUNDATION_TOPICS,FOUNDATION_LANGUAGES,getFoundationGreetings,isFoundationLanguage}=require(outfile);
    assert.equal(FOUNDATION_TOPICS.length,12);
    assert.equal(new Set(FOUNDATION_TOPICS.map(t=>t.id)).size,12);
    assert(FOUNDATION_TOPICS.every(topic=>topic.title && topic.english && topic.goals));
    assert.deepEqual(Object.keys(FOUNDATION_LANGUAGES).sort(),['de','en','es','fr','tr']);
    assert.equal(isFoundationLanguage('ru'),false);
    const seen = new Set();
    for (const id of ['en','fr','tr','de','es']) {
      const items = getFoundationGreetings(id);
      assert.equal(items.length,25,`${id}: 15 main and 10 additional examples`);
      assert.equal(new Set(items.map(x=>x.text.normalize('NFC').toLowerCase().replace(/[.!?¡¿\s]/g,''))).size,25,`${id}: no identical examples`);
      for (const item of items) {
        assert(item.id.startsWith(`foundation-a1-${id}-greetings-`) && item.text && item.fa && item.pronunciation);
        assert(item.sourceLessonId && item.sourceSentenceId);
        assert(id==='en' ? item.sourceLessonId.startsWith('foundation-') : item.sourceLessonId.startsWith(`${id}-`),`${id}: sources stay within the language`);
        assert(!seen.has(item.id),item.id); seen.add(item.id);
      }
    }
    console.log('Foundation A1 pilot: 12 topic labels, five isolated source sets and 125 linked examples passed. Remaining lessons are not declared complete.');
  } finally { fs.rmSync(dir,{recursive:true,force:true}); }
})().catch(error=>{console.error(error);process.exit(1)});
