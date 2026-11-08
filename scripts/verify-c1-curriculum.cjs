const assert=require('node:assert/strict'),esbuild=require('esbuild'),path=require('node:path');
(async()=>{
 const outfile=path.resolve('node_modules/.cache/c1-curriculum-test.cjs');
 await esbuild.build({stdin:{contents:"export {getC1Curriculum} from './lib/languages/c1Curriculum'; export {c1Deepening,c1DeepeningModules} from './lib/languages/c1Deepening'; export {NEW_COURSES} from './lib/languages/newCourses'; export {c1FoundationTransfer} from './lib/languages/c1FoundationTransfer'; export {c1FoundationStudio} from './lib/languages/c1FoundationStudio'; export {c1FoundationDiagnostics} from './lib/languages/c1FoundationDiagnostics'; export {c1FoundationRoleReview} from './lib/languages/c1FoundationRoleReview'; export {c1FoundationRoleModels} from './lib/languages/c1FoundationRoleModels'; export {c1RhetoricPractice,getC1RhetoricPractice} from './lib/languages/c1RhetoricPractice'; export {c1ExamSources,c1ExamProduction} from './lib/languages/c1ComprehensiveAssessment'; export {c1SurvivalListening,getC1SurvivalListening} from './lib/languages/c1SurvivalListening'; export {c1SurvivalDecisions} from './lib/languages/c1SurvivalDecisions'; export {c1SurvivalLanguageNotes} from './lib/languages/c1SurvivalLanguageNotes'; export {c1SurvivalConversations,c1SurvivalPartnerLines} from './lib/languages/c1SurvivalConversation';",resolveDir:process.cwd(),loader:'ts'},bundle:true,platform:'node',format:'cjs',outfile,plugins:[{name:'stub',setup(b){b.onResolve({filter:/^\.\/supabase$/},a=>a.importer.endsWith('createCourseProgressStore.ts')?{path:'supabase',namespace:'stub'}:null);b.onResolve({filter:/^@react-native-async-storage\/async-storage$|^react-native$/},a=>({path:a.path,namespace:'stub'}));b.onLoad({filter:/.*/,namespace:'stub'},a=>({loader:'js',contents:a.path==='react-native'?'export const Platform={OS:"web"};':a.path==='supabase'?'export const supabase={};':'export default {};'}))}}]});
 const {getC1Curriculum,c1Deepening,c1DeepeningModules,NEW_COURSES,c1FoundationTransfer,c1FoundationStudio,c1FoundationDiagnostics,c1FoundationRoleReview,c1FoundationRoleModels,c1RhetoricPractice,getC1RhetoricPractice,c1ExamSources,c1ExamProduction,c1SurvivalListening,getC1SurvivalListening,c1SurvivalDecisions,c1SurvivalLanguageNotes,c1SurvivalConversations,c1SurvivalPartnerLines}=require(outfile),ids=new Set(),locations=new Set(),passages={fr:new Set(),de:new Set(),es:new Set()};
 assert.equal(c1DeepeningModules.length,55);
 for(const language of ['fr','de','es']){
  const sections=getC1Curriculum(language);assert.deepEqual(sections.map(s=>s.id),['foundation','survival']);assert.deepEqual(sections.map(s=>s.topics.length),[25,30]);
  for(const section of sections) section.topics.forEach((topic,i)=>{assert.equal(topic.number,i+1);assert(topic.title);});
  assert.equal(NEW_COURSES[language].levels.find(l=>l.id===5).status,'available');
 }
 for(const item of c1DeepeningModules){
  assert.equal(item.level,'c1');assert(!ids.has(item.id));ids.add(item.id);const loc=`${item.section}:${item.number}`;assert(!locations.has(loc));locations.add(loc);assert.equal(c1Deepening(item.section,item.number),item);assert.equal(item.questions.length,3);assert(item.speaking&&item.writing&&item.steps.length>=4);
  for(const lang of ['fr','de','es']){
   assert(getC1Curriculum(lang).find(s=>s.id===item.section)?.topics.find(t=>t.number===item.number));
   const text=item.passage[lang],notes=item.notes[lang];assert(!passages[lang].has(text));passages[lang].add(text);assert(text.split(/\s+/).length>=70,`${item.id} ${lang} passage`);assert(item.model[lang].split(/\s+/).length>=35);assert(notes.explanation&&notes.first&&notes.second&&notes.difference);assert.equal(notes.phrases.length,3);assert(notes.phrases.every(p=>p.text&&p.meaning));
   for(const q of item.questions){assert.equal(q.choices.length,3);assert.equal(new Set(q.choices).size,3);assert(q.choices[q.correctIndex]&&q.explanation);assert(text.includes(q.evidence[lang]),`${item.id} ${lang} missing evidence: ${q.evidence[lang]}`);}
  }
 }
 for(let i=1;i<=25;i++)assert(c1Deepening('foundation',i),`missing C1 foundation ${i}`);
 assert.equal(c1FoundationTransfer.length,25);assert.equal(new Set(c1FoundationTransfer.map(x=>x.scenario)).size,25);assert(c1FoundationTransfer.every(x=>x.scenario&&x.checks.length===2&&x.checks.every(Boolean)));
 assert.equal(c1FoundationStudio.length,25);assert.equal(c1FoundationDiagnostics.length,25);assert.equal(c1FoundationRoleReview.length,25);assert.equal(c1FoundationRoleModels.length,25);assert(c1FoundationRoleModels.every(model=>['fr','de','es'].every(lang=>model[lang]&&model[lang].split(/\s+/).length>=8)));assert(c1FoundationRoleReview.every(checks=>checks.length===2&&checks.every(Boolean)));
 const newAudio={fr:new Set(),de:new Set(),es:new Set()},newDialogues={fr:new Set(),de:new Set(),es:new Set()};
 for(let i=0;i<25;i++){
  const studio=c1FoundationStudio[i],diagnostic=c1FoundationDiagnostics[i],lesson=c1Deepening('foundation',i+1);
  assert.equal(studio.number,i+1);assert(studio.listening.prompt&&studio.listening.explanation&&studio.roleTask&&studio.form.prompt&&studio.form.explanation);
  assert.equal(new Set(studio.listening.choices).size,3);assert.equal(new Set(diagnostic.choices).size,3);assert(diagnostic.prompt&&diagnostic.explanation);
  for(const lang of ['fr','de','es']){
   assert(studio.audio[lang].split(/\s+/).length>=30,`audio too short: ${i+1} ${lang}`);assert(studio.audio[lang].includes(studio.evidence[lang]),`audio evidence: ${i+1} ${lang} ${studio.evidence[lang]}`);
   assert.notEqual(studio.audio[lang],lesson.passage[lang]);assert(!newAudio[lang].has(studio.audio[lang]));newAudio[lang].add(studio.audio[lang]);
   assert(studio.dialogue[lang].split(/\n/).length>=3);assert(!newDialogues[lang].has(studio.dialogue[lang]));newDialogues[lang].add(studio.dialogue[lang]);
   assert(studio.form.right[lang]&&studio.form.wrong[lang]);assert.notEqual(studio.form.right[lang],studio.form.wrong[lang]);
  }
 }
 assert.deepEqual(c1RhetoricPractice.map(x=>x.number),[14,15,16,20,23,24]);
 for(const lesson of c1RhetoricPractice){
  assert.equal(getC1RhetoricPractice(lesson.number),lesson);assert(lesson.title&&lesson.concept&&lesson.question&&lesson.explanation&&lesson.assignment);assert.equal(lesson.criteria.length,3);assert(lesson.criteria.every(Boolean));
  for(const lang of ['fr','de','es']){assert(lesson.context[lang].split(/\s+/).length>=30);assert(lesson.context[lang].includes(lesson.evidence[lang]),`${lesson.number} ${lang} missing rhetoric evidence`);assert.equal(new Set(lesson.choices[lang]).size,3);assert(lesson.model[lang].split(/\s+/).length>=25);}
 }
 assert.equal(getC1RhetoricPractice(13),undefined);
 assert.equal(c1ExamSources.length,4);assert.equal(c1ExamProduction.length,4);
 for(const kind of ['reading','listening'])assert.equal(c1ExamSources.filter(x=>x.kind===kind).length,2);
 for(const kind of ['speaking','writing'])assert.equal(c1ExamProduction.filter(x=>x.kind===kind).length,2);
 for(const source of c1ExamSources){assert.equal(source.questions.length,4);for(const q of source.questions){assert.equal(new Set(q.choices).size,3);assert.equal(q.correctIndex,0);for(const lang of ['fr','de','es'])assert(source.text[lang].includes(q.evidence[lang]),`assessment missing evidence: ${source.id} ${lang} ${q.evidence[lang]}`);}}
 for(const task of c1ExamProduction){assert.equal(task.criteria.length,3);for(const lang of ['fr','de','es'])assert(task.model[lang].split(/\s+/).length>=30);}

 for(let i=1;i<=30;i++)assert(c1Deepening('survival',i),`missing C1 survival ${i}`);
 assert.equal(c1SurvivalLanguageNotes.length,26);assert.equal(new Set(c1SurvivalLanguageNotes.map(x=>x.number)).size,26);
 for(const item of c1SurvivalLanguageNotes){assert(c1Deepening('survival',item.number));assert(item.explanation&&item.difference);for(const lang of ['fr','de','es']){assert.equal(item.examples[lang].length,2);assert.notEqual(item.examples[lang][0],item.examples[lang][1]);assert(item.examples[lang].every(Boolean));}}
 assert.equal(c1SurvivalConversations.length,30);for(const dialogue of c1SurvivalConversations)for(const lang of ['fr','de','es']){assert.equal(dialogue[lang].length,2);for(const options of dialogue[lang]){assert.equal(options.length,2);assert(options.every(Boolean));assert.notEqual(options[0],options[1]);}}
 for(const lang of ['fr','de','es'])assert(Object.values(c1SurvivalPartnerLines[lang]).every(Boolean));
 assert.equal(c1SurvivalListening.length,30);assert.equal(c1SurvivalDecisions.length,30);for(const turns of c1SurvivalDecisions){assert.equal(turns.length,2);for(const turn of turns){assert(turn.prompt&&turn.best&&turn.alternative&&turn.reason);assert.notEqual(turn.best,turn.alternative);}}
 const survivalTexts={fr:new Set(),de:new Set(),es:new Set()};
 for(let i=1;i<=30;i++){const task=getC1SurvivalListening(i),lesson=c1Deepening('survival',i);assert(task&&task.number===i&&task.prompt&&task.explanation&&task.task);assert.equal(new Set(task.choices).size,3);for(const lang of ['fr','de','es']){assert(task.text[lang].split(/\s+/).length>=25,`survival listening ${i} ${lang} too short`);assert(task.text[lang].includes(task.evidence[lang]),`survival listening evidence ${i} ${lang}: ${task.evidence[lang]}`);assert.notEqual(task.text[lang],lesson.passage[lang]);assert(!survivalTexts[lang].has(task.text[lang]));survivalTexts[lang].add(task.text[lang]);assert(task.model[lang].split(/\s+/).length>=8);}}
 assert.equal(c1Deepening('survival',31),undefined);assert.equal(c1Deepening('foundation',26),undefined);
 console.log('C1: 165 exact syllabus entries, 55 authored modules / 165 localized lessons, 165 independent listening texts, 90 localized two-turn branching dialogues, 18 rhetoric practices, 3 four-skill formative assessments, evidence and distinct keys passed. All 165 syllabus entries have authored material.');
})().catch(e=>{console.error(e);process.exitCode=1});
