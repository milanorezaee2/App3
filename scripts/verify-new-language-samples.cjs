const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const esbuild = require('esbuild');
const path = require('node:path');

// Snapshot of the 21 lessons shipped before the redesign, excluding presentation
// order. This catches changed sentence IDs/text, translations, checks, dialogue
// and answer order: old saved sessions and review-card IDs depend on them.
const legacyHashes = {
  de:'b2dd94812a9aaa2a388bd096c6556c91e075e76895d4a60025f1204a72573b65',
  fr:'624c83ea5b83a9482437ccfd281e89b7505fecdf4095ada17afae032b7faa0ff',
  es:'7c059ff2f6d3eea542e52ef93da82168d14d3d7beae4a8d59da6639bba7dd823',
};
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
    assert.equal(course.lessons.length,27);
    assert.equal(course.lessons.reduce((sum,lesson)=>sum+lesson.sentences.length,0),216);
    assert.equal(course.levels.length,7);
    assert.equal(course.levels[0].id,-1);
    assert(course.levels.slice(1).every(level=>level.status==='planned'));
    assert.deepEqual(course.lessons.map(l=>l.order),Array.from({length:27},(_,i)=>i+1));
    assert.deepEqual(course.lessons.slice(0,6).map(l=>l.learningMode),['sounds','sounds','words','words','chunks','chunks']);
    for (const lesson of course.lessons) {
      assert(!allIds.has(lesson.id)); allIds.add(lesson.id);
      assert(lesson.id.startsWith(id+'-') && lesson.levelId === -1 && lesson.teachingFa);
      assert.equal(lesson.sentences.length,8);
      if (lesson.learningMode) {
        assert.equal(lesson.dialogue.length,0,`${lesson.id}: no premature dialogue`);
        assert.equal(lesson.checks.length,3);
        assert.equal(new Set(lesson.sentences.map(s=>s.fa)).size,8,`${lesson.id}: distinct answer meanings`);
        assert.equal(new Set(lesson.sentences.map(s=>s.text.toLowerCase())).size,8,`${lesson.id}: distinct options`);
        if (lesson.learningMode !== 'chunks') assert(lesson.sentences.every(s=>!s.text.trim().includes(' ')),`${lesson.id}: independent words only`);
        for (const q of lesson.checks) {
          assert.equal(q.choices.length,4); assert.equal(new Set(q.choices).size,4);
          assert(q.choices[q.correctIndex]);
          const target=lesson.sentences.find(s=>q.explanationFa===`${s.text} یعنی ${s.fa}.`);
          assert(target && (q.choices[q.correctIndex]===target.text || q.choices[q.correctIndex]===target.fa));
        }
      } else {
        assert(lesson.dialogue.length>=3);
        assert(lesson.dialogue.every((line,idx) => line.speaker === (idx % 2 ? 'همراه' : 'زبان‌آموز') && lesson.sentences.some(s => s.text === line.text && s.fa === line.fa)), `${lesson.id}: dialogue turns use this lesson`);
      }
      for (const sentence of lesson.sentences) {
        assert(!allIds.has(sentence.id)); allIds.add(sentence.id);
        assert(sentence.text && sentence.fa && sentence.pronunciation && sentence.vocabulary.every(v=>v.word && v.meaning && sentence.text.toLocaleLowerCase().includes(v.word.toLocaleLowerCase())));
      }
      for (const q of lesson.checks) assert(q.correctIndex>=0 && q.correctIndex<q.choices.length && q.explanationFa);
    }
    const legacy = course.lessons.filter(l=>l.id.startsWith(`${id}-pre-`));
    assert.equal(legacy.length,21);
    const normalized = legacy.map(({order,...rest})=>rest).sort((a,b)=>a.id.localeCompare(b.id));
    assert.equal(crypto.createHash('sha256').update(JSON.stringify(normalized)).digest('hex'), legacyHashes[id],`${id}: all shipped lesson content is unchanged`);
    assert.equal(course.lessons[6].id,`${id}-pre-11`);
    assert.equal(course.lessons.at(-1).id,`${id}-pre-21`);

    const oldLesson=legacy.find(l=>l.id===`${id}-pre-1`);
    const oldCard={id:`${oldLesson.id}:${oldLesson.sentences[0].id}`,lessonId:oldLesson.id,sentenceId:oldLesson.sentences[0].id,dueAt:new Date(0).toISOString(),intervalDays:5,ease:2.4,repetitions:2,lapses:0};
    const completed=legacy.map(l=>l.id);
    memory.set(`sentence_course_progress_${id}_starter_v1`,JSON.stringify({completedLessonIds:completed,currentLessonId:`${id}-pre-20`,reviewCards:[oldCard]}));
    const migrated=await course.progress.getCourseProgress();
    assert.deepEqual(migrated.completedLessonIds,completed);
    assert.equal(migrated.currentLessonId,`${id}-pre-20`);
    assert.equal(migrated.reviewCards.find(c=>c.id===oldCard.id).intervalDays,5);
    assert.equal(migrated.reviewCards.length,168);
    assert.equal(course.lessons.find(item=>!migrated.completedLessonIds.includes(item.id)).id,`${id}-foundation-sounds-1`);
    const oldSession={stage:8,sentenceIndex:3,revealed:false,answers:{'0':0},showCheckAnswers:false};
    await course.sessions.saveStarterLessonSession(oldLesson.id,oldSession);
    assert.deepEqual(await course.sessions.loadStarterLessonSession(oldLesson.id),oldSession);
    const first=course.lessons[0];
    const foundationSession={stage:7,sentenceIndex:2,revealed:false,answers:{},showCheckAnswers:false};
    await course.sessions.saveStarterLessonSession(first.id,foundationSession);
    assert.deepEqual(await course.sessions.loadStarterLessonSession(first.id),foundationSession);
    await assert.rejects(course.sessions.saveStarterLessonSession(first.id,{...foundationSession,stage:9}));
    await course.progress.completeSentenceLesson(first.id,migrated.currentLessonId);
    const after=await course.progress.getCourseProgress();
    assert.equal(after.currentLessonId,`${id}-pre-20`);
    assert(after.completedLessonIds.includes(first.id));
    assert.equal(after.reviewCards.filter(card=>card.lessonId===first.id).length,8);
    assert.equal(after.reviewCards.find(c=>c.id===oldCard.id).intervalDays,5);
    assert.deepEqual(await course.sessions.loadStarterLessonSession(oldLesson.id),oldSession);
    await course.sessions.clearStarterLessonSession(first.id);
    assert.equal((await course.sessions.loadStarterLessonSessionWithPresence(first.id)).hasSavedSession,false);
  }
  assert.equal([...memory.keys()].filter(k=>/^sentence_course_progress_(de|fr|es)_starter_v1$/.test(k)).length,3);
  global.__starterOS='ios'; global.__starterNative = new Map();
  for (const id of ['de','fr','es']) {
    const course=NEW_COURSES[id], first=course.lessons[0];
    const session={stage:2,sentenceIndex:1,revealed:false,answers:{},showCheckAnswers:false};
    await course.sessions.saveStarterLessonSession(first.id,session);
    assert.deepEqual(await course.sessions.loadStarterLessonSession(first.id),session);
    await course.progress.completeSentenceLesson(first.id);
    assert((await course.progress.getCourseProgress()).completedLessonIds.includes(first.id));
    assert.equal((await course.progress.getDueReviewCards()).length,8);
  }
  assert.equal([...global.__starterNative.keys()].filter(k=>k.includes('_starter_v1')).length,3);
  console.log('Three beginner paths: sounds → words → chunks → sentences, 81 lessons / 648 examples, unchanged legacy content, isolated progress/sessions and review migration passed.');
})().catch(e=>{console.error(e);process.exit(1)});
