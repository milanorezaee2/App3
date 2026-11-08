const assert=require('node:assert/strict'),esbuild=require('esbuild'),path=require('node:path');
(async()=>{
 const outfile=path.resolve('node_modules/.cache/b1-b2-studio.cjs');
 await esbuild.build({stdin:{contents:"export {learningStudio,studioLinks} from './lib/languages/learningStudio';export {independentSkills} from './lib/languages/independentSkills';",resolveDir:process.cwd(),loader:'ts'},bundle:true,platform:'node',format:'cjs',outfile});
 const {learningStudio,studioLinks,independentSkills}=require(outfile),{NEW_COURSES}=require(path.resolve('node_modules/.cache/b2-test.cjs')),{b2Workshops}=require(path.resolve('node_modules/.cache/b2-enrichment.cjs')),{b1Intensive}=require(path.resolve('node_modules/.cache/b1-b2-upgrade.cjs'));
 const words=t=>t.trim().split(/\s+/).length;
 for(const level of ['b1','b2']){
  const all=learningStudio(level);assert.equal(all.length,2);assert.equal(new Set(all.map(t=>t.id)).size,all.length);
  for(const task of all){assert(task.speaking&&task.writing&&task.steps.length>=4);assert.equal(task.questions.length,4);for(const lang of ['fr','de','es']){assert(words(task.text[lang])>=90,`${lang} ${task.id}: passage too short`);assert(words(task.model[lang])>=30);assert.equal(task.phrases[lang].length,3);assert(task.grammar[lang].form&&task.grammar[lang].example&&task.grammar[lang].alternative&&task.grammar[lang].contrast&&task.grammar[lang].question&&[0,1].includes(task.grammar[lang].correctIndex)&&task.grammar[lang].example!==task.grammar[lang].alternative);for(const p of task.phrases[lang])assert(p.text&&p.meaning&&p.note);for(const q of task.questions){assert.equal(q.choices.length,3);assert.equal(new Set(q.choices).size,3);assert(q.choices[q.correctIndex]&&q.explanation);assert(task.text[lang].includes(q.evidence[lang]),`${lang} ${task.id}: missing evidence ${q.evidence[lang]}`);}}}
  for(const section of ['foundation','survival'])for(let i=1;i<=(section==='foundation'?25:30);i++)for(const id of studioLinks(level,section,i))assert(all.some(t=>t.id===id),`${level} broken studio link`);
  for(const lang of ['fr','de','es']){
   const fresh=independentSkills(lang,level),seen=new Set([...NEW_COURSES[lang].lessons.flatMap(l=>l.sentences.map(s=>s.text)),...b1Intensive(lang).map(t=>t.text),...b2Workshops(lang).map(t=>t.text),...all.map(t=>t.text[lang])]);
   assert.equal(fresh.length,4);assert.equal(fresh.filter(x=>x.mode==='listening').length,2);assert.equal(fresh.filter(x=>x.mode==='reading').length,2);assert.equal(new Set(fresh.map(t=>t.id)).size,4);assert.equal(new Set(fresh.map(t=>t.text)).size,4);
   for(const task of fresh){assert(!seen.has(task.text),`${lang} ${level} assessment reused text`);assert(task.speaking&&task.writing&&task.model&&task.spokenModel);assert.equal(task.questions.length,2);for(const q of task.questions){assert(q.choices[q.correctIndex]&&q.explanation);assert.equal(new Set(q.choices).size,3);assert(task.text.includes(q.evidence[lang]),`${lang} ${task.id}: ${q.evidence[lang]}`);}}
   console.log(lang,level,'two studio units, 8 evidence questions, phrase/grammar/writing, four independent assessment passages passed');
  }
 }
})().catch(e=>{console.error(e);process.exitCode=1});
