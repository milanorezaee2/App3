const assert = require('node:assert/strict');
const esbuild = require('esbuild');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const expected = require('./fixtures/a1-requested-titles.json');
(async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'a1-syllabus-'));
 try {
  const outfile=path.join(dir,'test.cjs');
  await esbuild.build({stdin:{contents:"export {getA1Curriculum} from './lib/languages/a1Curriculum'; export {NEW_COURSES} from './lib/languages/newCourses'; export {starterDisplayDialogue} from './lib/languages/starterEditorial';",resolveDir:process.cwd(),loader:'ts'},bundle:true,platform:'node',format:'cjs',outfile,plugins:[{name:'stub',setup(b){
   b.onResolve({filter:/^\.\/supabase$/},a=>a.importer.endsWith('createCourseProgressStore.ts')?{path:'supabase',namespace:'stub'}:null);
   b.onResolve({filter:/^@react-native-async-storage\/async-storage$|^react-native$/},a=>({path:a.path,namespace:'stub'}));
   b.onLoad({filter:/.*/,namespace:'stub'},a=>({loader:'js',contents:a.path==='react-native'?'export const Platform={OS:"web"}':a.path==='supabase'?'export const supabase={}':'export default {}'}));
  }}]});
  const {getA1Curriculum,NEW_COURSES,starterDisplayDialogue}=require(outfile);
  for(const id of ['fr','de','es']) {
   const sections=getA1Curriculum(id); assert.deepEqual(sections.map(s=>s.topics.length),[25,30]);
   assert.deepEqual(sections[0].topics.map(t=>t.title),expected.foundation[id],`${id}: Foundation titles match the user's wording and order`);
   const survival=expected.survivalCommon.map((commonTitle,i)=>{ const title=expected.survivalOverride[id]?.[i+1] ?? commonTitle; return expected.survivalSuffix[id][i+1] ? `${title} (${expected.survivalSuffix[id][i+1]})` : title; });
   assert.deepEqual(sections[1].topics.map(t=>t.title),survival,`${id}: Survival titles match the user's wording and order`);
   const course=NEW_COURSES[id]; const all=[];
   for(const section of sections) {
    assert.deepEqual(section.topics.map(t=>t.number),Array.from({length:section.topics.length},(_,i)=>i+1));
    for(const topic of section.topics) { assert(topic.title); for(const lessonId of topic.relatedLessonIds){ assert(lessonId.startsWith(id+'-')); assert(course.lessons.some(l=>l.id===lessonId && l.levelId===1)); all.push(lessonId); } }
   }
   assert(sections.every(s=>s.topics.every(t=>t.relatedLessonIds.length>0)),`${id}: every topic has a related lesson`);
   assert.equal(new Set(all).size,all.length); assert.equal(all.length,56);
   assert.deepEqual(all,course.lessons.filter(l=>l.levelId===1).map(l=>l.id),`${id}: lesson navigation follows topic order`);
   const cafe=course.lessons.find(l=>l.id===`${id}-a1-cafe`), before=JSON.stringify(cafe);
   assert.deepEqual(starterDisplayDialogue(cafe).map(l=>l.speaker),['کارمند کافه','مشتری','کارمند کافه','مشتری','کارمند کافه','مشتری']);
   assert.equal(JSON.stringify(cafe),before);
   for (const n of [7,13,20]) {
    const lesson=course.lessons.find(l=>l.id===`${id}-pre-${n}`), snapshot=JSON.stringify(lesson);
    assert.deepEqual(starterDisplayDialogue(lesson).map(l=>l.speaker),['زبان‌آموز','همراه','همراه','زبان‌آموز']);
    assert.equal(JSON.stringify(lesson),snapshot);
   }
   const oldCafe=course.lessons.find(l=>l.id===`${id}-pre-18`);
   assert.deepEqual(starterDisplayDialogue(oldCafe).map(l=>l.speaker),['کارمند کافه','مشتری','کارمند کافه','مشتری']);
   const greeting=course.lessons.find(l=>l.id===`${id}-a1-greetings`); assert.equal(greeting.sentences.length,12); assert.equal(greeting.checks.length,4);
   const greetingBefore=JSON.stringify(greeting), greetingRoles=starterDisplayDialogue(greeting).map(l=>l.speaker);
   assert.deepEqual(greetingRoles,['زبان‌آموز','همراه','زبان‌آموز','همراه','زبان‌آموز','زبان‌آموز']);
   assert.equal(JSON.stringify(greeting),greetingBefore);
   const age=course.lessons.find(l=>l.id===`${id}-a1-numbers-age`), ageBefore=JSON.stringify(age);
   assert.deepEqual(starterDisplayDialogue(age).map(l=>l.speaker),['زبان‌آموز','همراه','همراه','زبان‌آموز','زبان‌آموز','همراه']);
   assert.equal(JSON.stringify(age),ageBefore);
   const conversation=course.lessons.find(l=>l.id===`${id}-a1-connected-conversation`);
   assert.equal(conversation.dialogue.length,8);
  }
  console.log('Three A1 syllabuses: 25 + 30 topics, 56 partial related lessons each; café display roles and course isolation passed.');
 } finally {fs.rmSync(dir,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exit(1)});
