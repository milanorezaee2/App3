const assert = require('node:assert/strict');
const esbuild = require('esbuild');
const path = require('node:path');
(async () => {
  const outfile=path.resolve('node_modules/.cache/a2-pilot.cjs');
  await esbuild.build({stdin:{contents:"export {NEW_COURSES} from './lib/languages/newCourses'; export {getA2Curriculum} from './lib/languages/a2Curriculum'; export {A2_FIRST_SKILLS} from './lib/languages/a2FirstLessons'; export {a2UnitSkills} from './lib/languages/a2Units'; export {a2ExpansionSkills} from './lib/languages/a2Expansion';",resolveDir:process.cwd(),loader:'ts'},bundle:true,platform:'node',format:'cjs',outfile,plugins:[{name:'stubs',setup(build){
    build.onResolve({filter:/^\.\/supabase$/},args=>args.importer.endsWith('createCourseProgressStore.ts') ? {path:'supabase',namespace:'stub'} : null);
    build.onResolve({filter:/^@react-native-async-storage\/async-storage$|^react-native$/},args=>({path:args.path,namespace:'stub'}));
    build.onLoad({filter:/.*/,namespace:'stub'},args=>({loader:'js',contents:args.path==='react-native'?'export const Platform={OS:"web"};':args.path==='supabase'?'export const supabase={};':'export default {};'}));
  }}]});
  const memory=new Map();
  global.window={localStorage:{getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)}};
  const {NEW_COURSES,getA2Curriculum,A2_FIRST_SKILLS,a2UnitSkills,a2ExpansionSkills}=require(outfile);
  const allIds=new Set();
  for(const id of ['fr','de','es']) {
    const sections=getA2Curriculum(id), course=NEW_COURSES[id], lesson=course.lessons.find(x=>x.id===`${id}-a2-present`);
    assert.deepEqual(sections.map(x=>x.id),['foundation','survival']);
    assert.deepEqual(sections.map(x=>x.topics.length),[22,30]);
    for(const section of sections) {
      assert.deepEqual(section.topics.map(x=>x.number), Array.from({length:section.topics.length},(_,i)=>i+1));
      assert(section.topics.every(x=>x.title));
    }
    assert.deepEqual(sections[0].topics[0].relatedLessonIds,[lesson.id]);
    const lessons=course.lessons.filter(x=>x.levelId===2);
    assert.equal(lessons.length,27);
    assert.equal(lessons[0].id,lesson.id);
    for(const topic of sections.flatMap(x=>x.topics)) for(const linkedId of topic.relatedLessonIds) assert(lessons.some(x=>x.id===linkedId));
    const additionalSkills={...a2UnitSkills(id),...a2ExpansionSkills(id)};
    for(const unit of lessons.slice(1)) {
      assert.equal(unit.sentences.length,8);
      assert.equal(unit.dialogue.length,4);
      assert.equal(unit.checks.length,4);
      assert.equal(new Set(unit.sentences.map(x=>x.text)).size,8);
      assert.equal(new Set(unit.sentences.map(x=>x.fa)).size,8);
      unit.sentences.forEach(sentence=>{assert(!allIds.has(sentence.id));allIds.add(sentence.id);assert(sentence.pronunciation && sentence.vocabulary.every(v=>v.word && v.meaning && sentence.text.toLowerCase().includes(v.word.toLowerCase())));});
      unit.checks.forEach((q,i)=>{assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);assert(q.promptFa.includes(unit.sentences[2*i].fa));assert.equal(q.choices[q.correctIndex],unit.sentences[2*i].text)});
      const unitSession={stage:8,sentenceIndex:3,revealed:false,answers:{'0':0,'1':1},showCheckAnswers:false};
      await course.sessions.saveStarterLessonSession(unit.id,unitSession);
      assert.deepEqual(await course.sessions.loadStarterLessonSession(unit.id),unitSession);
      await course.sessions.clearStarterLessonSession(unit.id);
      assert.deepEqual(additionalSkills[unit.id].map(t=>t.kind),['listening','reading']);
      for(const task of additionalSkills[unit.id]) {assert.equal(task.choices.length,3);assert.equal(new Set(task.choices).size,3);assert(task.explanationFa.includes(task.choices[task.correctIndex]));assert(!unit.sentences.some(x=>x.text===task.passage), `${unit.id}: ${task.passage}`);}
    }
    assert.equal(lesson.sentences.length,12);
    assert.equal(new Set(lesson.sentences.map(x=>x.text)).size,12);
    assert.equal(new Set(lesson.sentences.map(x=>x.fa)).size,12);
    for (const sentence of lesson.sentences) {
      assert(!allIds.has(sentence.id)); allIds.add(sentence.id);
      assert(sentence.text && sentence.fa && sentence.pronunciation && sentence.vocabulary.every(v=>v.word && v.meaning && sentence.text.toLowerCase().includes(v.word.toLowerCase())));
    }
    assert.deepEqual(lesson.dialogue.map(x=>x.text), lesson.sentences.slice(0,4).map(x=>x.text));
    assert.equal(lesson.checks.length,4);
    lesson.checks.forEach((q,index)=>{
      const target=lesson.sentences[index*2];
      assert.equal(q.choices.length,4); assert.equal(new Set(q.choices).size,4);
      assert(q.promptFa.includes(target.fa)); assert.equal(q.choices[q.correctIndex],target.text);
    });
    const tasks=A2_FIRST_SKILLS[id]; assert.deepEqual(tasks.map(x=>x.kind),['listening','reading']);
    for(const task of tasks) {
      assert(task.passage && task.promptFa && task.explanationFa && task.choices.length===3);
      assert.equal(new Set(task.choices).size,3);
      assert(task.correctIndex>=0 && task.correctIndex<3);
      assert(!lesson.sentences.some(x=>x.text===task.passage));
    }
    const old=course.lessons.find(x=>x.id===`${id}-a1-cafe`), key=`sentence_course_progress_${id}_starter_v1`;
    const card={id:`${old.id}:${old.sentences[0].id}`,lessonId:old.id,sentenceId:old.sentences[0].id,dueAt:new Date(0).toISOString(),intervalDays:7,ease:2.3,repetitions:2,lapses:0};
    memory.set(key,JSON.stringify({completedLessonIds:[old.id],currentLessonId:old.id,reviewCards:[card]}));
    const session={stage:8,sentenceIndex:1,revealed:false,answers:{'0':0,'1':1},showCheckAnswers:false};
    await course.sessions.saveStarterLessonSession(lesson.id,session);
    assert.deepEqual(await course.sessions.loadStarterLessonSession(lesson.id),session);
    await course.progress.completeSentenceLesson(lesson.id,old.id);
    const progress=await course.progress.getCourseProgress();
    assert.equal(progress.currentLessonId,old.id);
    assert(progress.completedLessonIds.includes(old.id) && progress.completedLessonIds.includes(lesson.id));
    assert.equal(progress.reviewCards.find(x=>x.id===card.id).intervalDays,7);
    assert.equal(progress.reviewCards.filter(x=>x.lessonId===lesson.id).length,12);
  }
  console.log('A2: 52 requested topics per language; 81 lessons, independent skills, answer mappings and existing progress passed.');
})().catch(error=>{console.error(error);process.exitCode=1});
