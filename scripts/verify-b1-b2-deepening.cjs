const assert=require('node:assert/strict'),esbuild=require('esbuild'),path=require('node:path');
(async()=>{
 const outfile=path.resolve('node_modules/.cache/b1-b2-deepening.cjs');
 await esbuild.build({stdin:{contents:"export {topicDeepening,topicDeepeningModules} from './lib/languages/topicDeepening';export {getB1Curriculum} from './lib/languages/b1Curriculum';export {getB2Curriculum} from './lib/languages/b2Curriculum';",resolveDir:process.cwd(),loader:'ts'},bundle:true,platform:'node',format:'cjs',outfile});
 const {topicDeepening,topicDeepeningModules,getB1Curriculum,getB2Curriculum}=require(outfile),seen=new Set(),keys=new Set();
 assert.equal(topicDeepeningModules.length,110);const texts={fr:new Set(),de:new Set(),es:new Set()};const ids=new Set();
 for(const item of topicDeepeningModules){assert(!ids.has(item.id),`duplicate id ${item.id}`);ids.add(item.id);const loc=`${item.level}:${item.section}:${item.number}`;assert(!seen.has(loc));seen.add(loc);assert.equal(topicDeepening(item.level,item.section,item.number),item);assert.equal(item.questions.length,3);assert(item.speaking&&item.writing&&item.steps.length>=4);for(const lang of ['fr','de','es']){
  const title=(item.level==='b1'?getB1Curriculum:getB2Curriculum)(lang).find(s=>s.id===item.section)?.topics.find(t=>t.number===item.number)?.title;assert(title,`${lang} ${loc} missing topic`);
  const passage=item.passage[lang],notes=item.notes[lang];assert(!texts[lang].has(passage),`reused passage ${lang} ${item.id}`);texts[lang].add(passage);assert(passage.split(/\s+/).length>=70,`${lang} ${loc} short passage`);assert(item.model[lang].split(/\s+/).length>=30);assert(notes.explanation&&notes.first&&notes.second&&notes.difference);assert.equal(notes.phrases.length,3);for(const p of notes.phrases)assert(p.text&&p.meaning);
  for(const q of item.questions){assert.equal(q.choices.length,3);assert.equal(new Set(q.choices).size,3);assert(q.choices[q.correctIndex]&&q.explanation);assert(passage.includes(q.evidence[lang]),`${lang} ${loc} missing ${q.evidence[lang]}`)}
  const key=`language_practice_draft_v1:${lang}:${item.level}:workshop:deep-${item.id}`;assert(!keys.has(key));keys.add(key);
  console.log(lang,loc,title,'passage, evidence, contrasts, model, independent key checked');
 }}
 for(const lang of ['fr','de','es']) for(const [level,get] of [['b1',getB1Curriculum],['b2',getB2Curriculum]]) for(const section of get(lang)) for(const topic of section.topics) assert(topicDeepening(level,section.id,topic.number),`missing independent module for ${lang} ${level}:${section.id}:${topic.number}`);
 assert.equal(keys.size,330);assert.equal(topicDeepening('b1','survival',31),undefined);
})().catch(e=>{console.error(e);process.exitCode=1});
