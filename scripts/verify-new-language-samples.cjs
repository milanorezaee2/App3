const assert = require('node:assert/strict');
const esbuild = require('esbuild');
const path = require('node:path');
(async () => {
  const outfile = path.resolve('node_modules/.cache/new-language-samples.cjs');
  await esbuild.build({entryPoints:['lib/languages/newCourses.ts'],bundle:true,platform:'node',format:'cjs',outfile,plugins:[{name:'stubs',setup(build){
    build.onResolve({filter:/^\.\/supabase$/},args=>args.importer.endsWith('createCourseProgressStore.ts') ? {path:'supabase',namespace:'stub'} : null);
    build.onResolve({filter:/^@react-native-async-storage\/async-storage$/},()=>({path:'storage',namespace:'stub'}));
    build.onResolve({filter:/^react-native$/},()=>({path:'platform',namespace:'stub'}));
    build.onLoad({filter:/.*/,namespace:'stub'},args=>({loader:'js',contents:args.path==='platform'?'export const Platform={get OS(){return globalThis.__starterOS || "web"}};':args.path==='storage'?'export default {async getItem(k){return globalThis.__starterNative.get(k) ?? null},async setItem(k,v){globalThis.__starterNative.set(k,String(v))},async removeItem(k){globalThis.__starterNative.delete(k)}}':'export const supabase={};'}));
  }}]});
  const memory = new Map();
  global.window = {localStorage:{getItem:k=>memory.get(k) ?? null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)}};
  const {NEW_COURSES} = require(outfile);
  const allIds = new Set();
  for (const id of ['de','fr','es']) {
    const course = NEW_COURSES[id];
    assert.equal(course.lessons.length,10);
    assert.equal(course.lessons.reduce((sum,lesson)=>sum+lesson.sentences.length,0),80);
    assert.equal(course.levels.length,7);
    assert.equal(course.levels[0].id,-1);
    assert(course.levels.slice(1).every(level=>level.status==='planned'));
    for (const lesson of course.lessons) {
      assert(!allIds.has(lesson.id)); allIds.add(lesson.id);
      assert(lesson.id.startsWith(id+'-') && lesson.levelId === -1 && lesson.teachingFa && lesson.dialogue.length >= 3);
      assert.equal(lesson.sentences.length,8);
      assert(lesson.dialogue.every((line,idx) => line.speaker === (idx % 2 ? 'همراه' : 'زبان‌آموز') && lesson.sentences.some(s => s.text === line.text && s.fa === line.fa)), `${lesson.id}: dialogue turns use this lesson`);
      for(const sentence of lesson.sentences) {
        assert(!allIds.has(sentence.id)); allIds.add(sentence.id);
        assert(sentence.text && sentence.fa && sentence.pronunciation && sentence.vocabulary.every(v=>v.word && v.meaning && sentence.text.toLocaleLowerCase().includes(v.word.toLocaleLowerCase())));
      }
      for(const q of lesson.checks) assert(q.correctIndex>=0 && q.correctIndex<q.choices.length && q.choices[q.correctIndex] && q.explanationFa);
    }
    assert.deepEqual(course.lessons.slice(0,2).map(x=>x.id), [`${id}-pre-1`,`${id}-pre-2`]);
    assert.deepEqual(course.lessons.slice(0,2).flatMap((l,n)=>l.sentences.slice(0,6).map((x,i)=>x.id)), Array.from({length:12},(_,i)=>`${id}-pre${Math.floor(i/6)+1}-s${i%6+1}`));
    const lesson = course.lessons[0];
    const session={stage:3,sentenceIndex:2,revealed:false,answers:{},showCheckAnswers:false};
    await course.sessions.saveStarterLessonSession(lesson.id,session);
    assert.deepEqual((await course.sessions.loadStarterLessonSession(lesson.id)),session);
    await assert.rejects(course.sessions.saveStarterLessonSession(lesson.id,{...session,stage:9}));
    // Simulate a completed six-sentence pilot: old card scheduling survives and
    // expansion adds review cards for the two newly appended sentence IDs.
    const oldCard={id:`${lesson.id}:${lesson.sentences[0].id}`,lessonId:lesson.id,sentenceId:lesson.sentences[0].id,dueAt:new Date(0).toISOString(),intervalDays:5,ease:2.4,repetitions:2,lapses:0};
    memory.set(`sentence_course_progress_${id}_starter_v1`,JSON.stringify({completedLessonIds:[lesson.id],currentLessonId:course.lessons[1].id,reviewCards:[oldCard]}));
    const migrated=await course.progress.getCourseProgress();
    assert.equal(migrated.reviewCards.find(c=>c.id===oldCard.id).intervalDays,5);
    assert.equal(migrated.reviewCards.length,8);
    await course.progress.completeSentenceLesson(lesson.id,course.lessons[1].id);
    const progress=await course.progress.getCourseProgress();
    assert(progress.completedLessonIds.includes(lesson.id));
    assert.equal((await course.progress.getDueReviewCards()).length,lesson.sentences.length);
    await course.sessions.clearStarterLessonSession(lesson.id);
    assert.equal((await course.sessions.loadStarterLessonSessionWithPresence(lesson.id)).hasSavedSession,false);
  }
  assert.equal([...memory.keys()].filter(k=>/^sentence_course_progress_(de|fr|es)_starter_v1$/.test(k)).length,3);
  for(const id of ['de','fr','es']) assert((await NEW_COURSES[id].progress.getCourseProgress()).completedLessonIds.every(key=>key.startsWith(id+'-')));
  global.__starterOS='ios'; global.__starterNative = new Map();
  for (const id of ['de','fr','es']) {
    const course=NEW_COURSES[id], lesson=course.lessons[0];
    const session={stage:2,sentenceIndex:1,revealed:false,answers:{},showCheckAnswers:false};
    await course.sessions.saveStarterLessonSession(lesson.id,session);
    assert.deepEqual(await course.sessions.loadStarterLessonSession(lesson.id),session);
    await course.progress.completeSentenceLesson(lesson.id);
    assert((await course.progress.getCourseProgress()).completedLessonIds.includes(lesson.id));
    assert.equal((await course.progress.getDueReviewCards()).length,lesson.sentences.length);
  }
  assert.equal([...global.__starterNative.keys()].filter(k=>k.includes('_starter_v1')).length,3);
  console.log('Three Pre-A1 curricula: 30 lessons / 240 examples, stable IDs, isolated sessions, progress migration and review passed.');
})().catch(e=>{console.error(e);process.exit(1)});
