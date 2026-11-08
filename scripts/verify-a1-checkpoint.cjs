const assert=require('node:assert/strict');
const esbuild=require('esbuild');
const path=require('node:path');
(async()=>{
 const outfile=path.resolve('node_modules/.cache/a1-checkpoint-test.cjs');
 await esbuild.build({stdin:{contents:"export {A1_CHECKPOINT} from './lib/languages/a1Checkpoint'; export {independentTopicSkills} from './lib/languages/a1IndependentSkills';",resolveDir:process.cwd(),loader:'ts'},bundle:true,platform:'node',format:'cjs',outfile});
 const {A1_CHECKPOINT,independentTopicSkills}=require(outfile);
 for(const id of ['de','fr','es']){
  const x=A1_CHECKPOINT[id]; assert.equal(x.questions.length,6); assert.deepEqual(x.questions.map(q=>q.kind),['listening','listening','listening','reading','reading','reading']);
  for(const q of x.questions){assert(q.text && q.question && q.explanation);assert.equal(q.choices.length,3);assert.equal(new Set(q.choices).size,3);assert(q.correctIndex>=0 && q.correctIndex<q.choices.length);}
  assert.equal(x.speaking.length,2);assert.equal(x.writing.length,2);
  for(const p of [...x.speaking,...x.writing]) assert(p.prompt && p.model);
  for(const p of x.speaking) assert(p.stimulus && p.stimulusFa);
  const ability=independentTopicSkills(id,'ability')[0];assert.equal(ability.choices[ability.correctIndex],{fr:'لئا',de:'لنا',es:'لوسیا'}[id]);
  const verbs=independentTopicSkills(id,'verb-conjugation')[0];assert.equal(verbs.choices[verbs.correctIndex],id==='es'?'مارکوس':'مارک');
  const simple=independentTopicSkills(id,'simple-verbs')[0];if(id==='es')assert(simple.promptFa.includes('ماریا'));
 }
 console.log('A1 checkpoint: 18 comprehension, 6 speaking and 6 writing tasks; localized names and answer indexes verified.');
})().catch(error=>{console.error(error);process.exit(1)});
