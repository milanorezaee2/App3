const assert=require('node:assert/strict'),esbuild=require('esbuild'),path=require('node:path'),crypto=require('node:crypto'),fs=require('node:fs');
const before=require('./fixtures/b2-before-workshops.json'),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
(async()=>{
 const out=path.resolve('node_modules/.cache/b2-enrichment.cjs');
 await esbuild.build({stdin:{contents:"export {b2Workshops} from './lib/languages/b2Workshops';export {b2GrammarLab} from './lib/languages/b2GrammarLab';export {b2GrammarLinks,b2WorkshopLinks} from './lib/languages/b2PracticeLinks';export {getB2Curriculum} from './lib/languages/b2Curriculum';",resolveDir:process.cwd(),loader:'ts'},bundle:true,platform:'node',format:'cjs',outfile:out});
 const {b2Workshops,b2GrammarLab,b2GrammarLinks,b2WorkshopLinks,getB2Curriculum}=require(out);
 const baselineBundle=path.resolve('node_modules/.cache/b2-test.cjs');
 assert(fs.existsSync(baselineBundle),'Run node scripts/verify-b2-curriculum.cjs first to build the course test bundle.');
 const {NEW_COURSES,b2UnitSkills,b2GrammarPatterns,B2_CHECKPOINT}=require(baselineBundle);
 for(const id of ['fr','de','es']){
  const workshops=b2Workshops(id),cards=b2GrammarLab(id),map=getB2Curriculum(id);
  assert.equal(workshops.length,10);assert.equal(cards.length,15);assert.equal(new Set(workshops.map(x=>x.id)).size,10);assert.equal(new Set(cards.map(x=>x.id)).size,15);
  assert(workshops.some(w=>w.mode==='reading')&&workshops.some(w=>w.mode==='listening'));const answerPositions=new Set();
  for(const w of workshops){assert(w.title&&w.speaking&&w.writing&&w.speaking!==w.writing&&w.model&&w.spokenModel&&w.spokenModel!==w.model&&w.checklist.length>=3);assert(w.text.split(/\s+/).length>=100,`${id}/${w.id} text too short`);assert(w.model.split(/\s+/).length>=35,`${id}/${w.id} model too short`);assert(w.spokenModel.split(/\s+/).length>=30,`${id}/${w.id} oral model too short`);assert.equal(w.questions.length,4);for(const q of w.questions){assert(q.prompt&&q.explanation&&q.choices[q.correctIndex]);assert.equal(q.choices.length,3);assert.equal(new Set(q.choices).size,3);assert(q.evidence[id].length>=12&&w.text.includes(q.evidence[id]),`${id}/${w.id}: ${q.evidence[id]}`);answerPositions.add(q.correctIndex)}}
  assert.deepEqual([...answerPositions].sort(),[0,1,2]);const dialogue=workshops.find(x=>x.id==='climate-dialogue').text;for(const name of ['Lina','Sara','Malik'])assert(dialogue.includes(`${name}:`)||dialogue.includes(`${name} :`));assert(dialogue.split('\n').length>=6);
  for(const card of cards){assert(card.title&&card.explanation&&card.example&&card.translation&&card.prompt&&card.feedback);assert.equal(card.choices.length,3);assert.equal(new Set(card.choices).size,3);assert(card.choices[card.correctIndex]);}
  const g=new Set(),w=new Set();for(const sec of map)for(const t of sec.topics){for(const ref of b2GrammarLinks(id,sec.id,t.number)){assert(cards.some(c=>c.id===ref),`${id} missing grammar ${ref}`);g.add(ref)}for(const ref of b2WorkshopLinks(sec.id,t.number)){assert(workshops.some(c=>c.id===ref),`${id} missing workshop ${ref}`);w.add(ref)}}
  assert.deepEqual([...g].sort(),cards.map(x=>x.id).sort(),`${id} every grammar card linked`);assert.deepEqual([...w].sort(),workshops.map(x=>x.id).sort(),`${id} every workshop linked`);
  const lessons=NEW_COURSES[id].lessons.filter(x=>x.levelId===4);assert.equal(lessons.length,17);assert.equal(hash(B2_CHECKPOINT[id]),before[id].checkpoint);for(const l of lessons){const comparable=JSON.parse(JSON.stringify(l));
   // Explicit, vocabulary-only correction; keep the original snapshot and all IDs/checks intact.
   if(l.id===`${id}-b2-passive-causative`) {assert.equal(comparable.sentences[7].vocabulary[0].meaning,'تاریخ تحویل');comparable.sentences[7].vocabulary[0].meaning='زمان تحویل';if(id==='es'){assert.equal(comparable.sentences[7].vocabulary[0].word,'la fecha de entrega');comparable.sentences[7].vocabulary[0].word='entrega';}}
   assert.equal(hash(comparable),before[id].lessons[l.id]?.lesson,`${l.id} changed beyond the approved vocabulary correction`);assert.equal(hash(b2UnitSkills(id)[l.id]),before[id].lessons[l.id]?.skills);assert.equal(hash(b2GrammarPatterns(id,l.id)),before[id].lessons[l.id]?.patterns)}
  console.log(id,'15 grammar cards, 10 independent workshops, 40 anchored questions, old B2 lesson/skills/checkpoint snapshots passed');
 }
})().catch(e=>{console.error(e);process.exitCode=1});
