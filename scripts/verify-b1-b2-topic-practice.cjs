const assert=require('node:assert/strict'),esbuild=require('esbuild'),path=require('node:path');
(async()=>{
 const outfile=path.resolve('node_modules/.cache/b1-b2-topic-practice.cjs');
 await esbuild.build({stdin:{contents:"export {topicPracticePlan} from './lib/languages/topicPracticePlans';export {getB1Curriculum} from './lib/languages/b1Curriculum';export {getB2Curriculum} from './lib/languages/b2Curriculum';export {b1UnitSkills,b1GrammarPatterns} from './lib/languages/b1Units';export {b2UnitSkills,b2GrammarPatterns} from './lib/languages/b2Units';",resolveDir:process.cwd(),loader:'ts'},bundle:true,platform:'node',format:'cjs',outfile});
 const {topicPracticePlan,getB1Curriculum,getB2Curriculum,b1UnitSkills,b2UnitSkills,b1GrammarPatterns,b2GrammarPatterns}=require(outfile);
 const {NEW_COURSES}=require(path.resolve('node_modules/.cache/b2-test.cjs'));
 const keys=new Set();let total=0;
 for(const lang of ['fr','de','es'])for(const level of ['b1','b2']){
  const sections=(level==='b1'?getB1Curriculum:getB2Curriculum)(lang),allSkills=(level==='b1'?b1UnitSkills:b2UnitSkills)(lang),patterns=level==='b1'?b1GrammarPatterns:b2GrammarPatterns;
  assert.equal(sections.flatMap(s=>s.topics).length,55);const goals=new Set();
  for(const sec of sections)for(const topic of sec.topics){
   const plan=topicPracticePlan(level,sec.id,topic.number,lang);assert(plan,`${lang} ${level} ${sec.id} ${topic.number}`);assert(plan.goal.length>=5);for(const value of [plan.speaking,plan.writing])assert(value.length>=15);
   assert(!goals.has(plan.goal),`duplicate goal ${plan.goal}`);goals.add(plan.goal);
   const key=`language_practice_draft_v1:${lang}:${level}:workshop:topic-${sec.id}-${topic.number}`;assert(!keys.has(key));keys.add(key);
   assert(topic.relatedLessonIds.length>0);for(const id of topic.relatedLessonIds){const lesson=NEW_COURSES[lang].lessons.find(l=>l.id===id);assert(lesson,`missing ${id}`);assert(lesson.sentences.length>=3);assert((allSkills[id]??[]).length>=2,`missing skills ${id}`);for(const p of patterns(lang,id))assert(lesson.sentences[p.example-1],`${id} invalid pattern example`);}
   total++;
  }
  assert.equal(topicPracticePlan(level,'foundation',0,lang),undefined);assert.equal(topicPracticePlan(level,'survival',31,lang),undefined);console.log(lang,level,'55 plans, distinct draft keys and related lessons/skills checked');
 }
 assert.equal(total,330);assert.notEqual(topicPracticePlan('b1','foundation',3,'de').goal,topicPracticePlan('b1','foundation',3,'fr').goal);assert.notEqual(topicPracticePlan('b1','foundation',3,'es').goal,topicPracticePlan('b1','foundation',3,'fr').goal);
})().catch(e=>{console.error(e);process.exitCode=1});
