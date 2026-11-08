const assert=require('node:assert/strict'), esbuild=require('esbuild'),path=require('node:path');
const evidence={
 fr:{'belonging-relations':[/mon cahier/,/Son frère/],'story-sequence':[/D’abord/,/Ensuite/],'inviting-arranging':[/veux aller/,/peut se retrouver/],'tourism-directions':[/Allez .* tournez/,/près de/],'work-duties':[/dois répondre/,/après la réunion/],'study-plans':[/pour mieux parler/,/Il faut lire/],'opinions-agreement':[/parce qu’elle/,/suis d’accord/],'leisure-new-experiences':[/as déjà essayé/,/aime me promener/],'life-changes':[/Avant, j’habitais/,/Maintenant, j’habite/],'feelings-worries':[/suis .* fatiguée/,/espère réussir/],'reporting-messages':[/dit qu’il/,/n’ai pas compris/],'ability-permission':[/peux parler/,/sais nager/],'future-simple-extension':[/voyagerai/,/viendra/]},
 de:{'belonging-relations':[/mein Heft/,/mit meinem Bruder/],'story-sequence':[/Zuerst bin ich/,/Danach habe ich/],'inviting-arranging':[/Möchtest du .* gehen/,/Können wir .* treffen/],'tourism-directions':[/Gehen Sie .* biegen Sie/,/in der Nähe vom/],'work-duties':[/muss .* beantworten/,/bereitet .* vor/],'study-plans':[/um .* zu sprechen/,/müssen .* lesen/],'opinions-agreement':[/weil sie ruhig ist/,/bin einverstanden/],'leisure-new-experiences':[/Hast du schon .* gekocht/,/gehe gern/],'life-changes':[/Früher wohnte ich/,/Jetzt wohne ich/],'feelings-worries':[/bin .* müde/,/hoffe, dass .* bestehe/],'reporting-messages':[/sagt, dass .* arbeitet/,/habe es nicht verstanden/],'ability-permission':[/Kannst du .* sprechen/,/Darf ich .* benutzen/],'future-simple-extension':[/werde .* reisen/,/Morgen kaufe ich/]},
 es:{'belonging-relations':[/Mis amigos/,/Su hermano/],'story-sequence':[/Primero fui/,/Después comí/],'inviting-arranging':[/Quieres ir/,/Podemos vernos/],'tourism-directions':[/Siga .* gire/,/cerca de/],'work-duties':[/Tengo que responder/,/después de la reunión/],'study-plans':[/para hablar/,/Hay que leer/],'opinions-agreement':[/porque es tranquila/,/estoy de acuerdo/],'leisure-new-experiences':[/Has probado .* alguna vez/,/gusta pasear/],'life-changes':[/Antes vivía/,/Ahora vivo/],'feelings-worries':[/Estoy .* cansada/,/Espero aprobar/],'reporting-messages':[/dice que .* trabaja/,/No he entendido/],'ability-permission':[/Puedes hablar/,/Sé nadar/],'future-simple-extension':[/Viajaré/,/vendrá/]},
};
(async()=>{
 const outfile=path.resolve('node_modules/.cache/a2-expansion-test.cjs');
 await esbuild.build({stdin:{contents:"export {NEW_COURSES} from './lib/languages/newCourses'; export {getA2Curriculum} from './lib/languages/a2Curriculum'; export {a2ExpansionSkills,A2_EXPANSION_SLUGS} from './lib/languages/a2Expansion'; export {a2GrammarPatterns,countA2GrammarPatterns} from './lib/languages/a2Grammar'; export {A2_CHECKPOINT} from './lib/languages/a2Checkpoint';",resolveDir:process.cwd(),loader:'ts'},bundle:true,platform:'node',format:'cjs',outfile,plugins:[{name:'stub',setup(b){b.onResolve({filter:/^\.\/supabase$/},a=>a.importer.endsWith('createCourseProgressStore.ts')?{path:'supabase',namespace:'stub'}:null);b.onResolve({filter:/^@react-native-async-storage\/async-storage$|^react-native$/},a=>({path:a.path,namespace:'stub'}));b.onLoad({filter:/.*/,namespace:'stub'},a=>({loader:'js',contents:a.path==='react-native'?'export const Platform={OS:"web"};':a.path==='supabase'?'export const supabase={};':'export default {};'}));}}]});
 const mem=new Map();global.window={localStorage:{getItem:k=>mem.get(k)??null,setItem:(k,v)=>mem.set(k,String(v)),removeItem:k=>mem.delete(k)}};
 const {NEW_COURSES,getA2Curriculum,a2ExpansionSkills,A2_EXPANSION_SLUGS,a2GrammarPatterns,countA2GrammarPatterns,A2_CHECKPOINT}=require(outfile);
 assert.equal(A2_EXPANSION_SLUGS.length,13);assert.equal(new Set(A2_EXPANSION_SLUGS).size,13);
 for(const id of ['fr','de','es']){
  const course=NEW_COURSES[id],lessons=course.lessons.filter(l=>l.levelId===2), skills=a2ExpansionSkills(id);
  assert.equal(lessons.length,27);assert.equal(lessons.reduce((n,l)=>n+l.sentences.length,0),220);
  const map=getA2Curriculum(id);assert.deepEqual(map.map(s=>s.topics.length),[22,30]);
  for(const topic of map.flatMap(x=>x.topics)){assert(topic.relatedLessonIds.length>0);assert.equal(new Set(topic.relatedLessonIds).size,topic.relatedLessonIds.length);for(const ref of topic.relatedLessonIds)assert(lessons.some(l=>l.id===ref));}
  for(const slug of A2_EXPANSION_SLUGS){
   const lesson=lessons.find(l=>l.id===`${id}-a2-${slug}`);assert(lesson && lesson.sentences.length===8);assert(lesson.teachingFa && lesson.situation);
   assert.equal(new Set(lesson.sentences.map(s=>s.text)).size,8);assert.equal(new Set(lesson.sentences.map(s=>s.fa)).size,8);
   for(const s of lesson.sentences) assert(s.pronunciation && s.vocabulary.every(v=>v.word&&v.meaning&&s.text.toLocaleLowerCase().includes(v.word.toLocaleLowerCase())));
   assert.deepEqual(lesson.dialogue.map(x=>x.text),lesson.sentences.slice(0,4).map(x=>x.text));
   lesson.checks.forEach((q,i)=>{assert.equal(q.choices[q.correctIndex],lesson.sentences[i*2].text);assert.equal(new Set(q.choices).size,4)});
   assert.deepEqual(skills[lesson.id].map(t=>t.kind),['listening','reading']);for(const task of skills[lesson.id]){assert(task.passage&&task.promptFa&&task.explanationFa);assert.equal(new Set(task.choices).size,3);assert(task.choices[task.correctIndex]);assert(!lesson.sentences.some(s=>s.text===task.passage));}
   const pats=a2GrammarPatterns(id,lesson.id);assert.equal(pats.length,2);assert.equal(new Set(pats.map(p=>p.example)).size,2);
   pats.forEach((p,i)=>{assert(p.form&&p.explanationFa&&p.example>=1&&p.example<=8);assert.match(lesson.sentences[p.example-1].text,evidence[id][slug][i])});
  }
  const patterns=lessons.flatMap(l=>a2GrammarPatterns(id,l.id));assert.equal(countA2GrammarPatterns(id,lessons.map(l=>l.id)),new Set(patterns.map(p=>p.form)).size);
  const checkpoint=A2_CHECKPOINT[id];assert.deepEqual(checkpoint.questions.map(x=>x.kind),['listening','listening','listening','reading','reading','reading']);
  for(const q of checkpoint.questions){assert(q.text&&q.question&&q.explanation);assert.equal(new Set(q.choices).size,3);assert(q.choices[q.correctIndex]);}
  assert.equal(checkpoint.speaking.length,2);assert.equal(checkpoint.writing.length,2);for(const x of [...checkpoint.speaking,...checkpoint.writing])assert(x.prompt&&x.model);for(const x of checkpoint.speaking)assert(x.stimulus&&x.stimulusFa);
  const old=lessons[13], oldSession={stage:8,sentenceIndex:1,revealed:false,answers:{'0':0,'1':1},showCheckAnswers:false};
  await course.sessions.saveStarterLessonSession(old.id,oldSession);assert.deepEqual(await course.sessions.loadStarterLessonSession(old.id),oldSession);
  const key=`sentence_course_progress_${id}_starter_v1`, card={id:`${old.id}:${old.sentences[0].id}`,lessonId:old.id,sentenceId:old.sentences[0].id,dueAt:new Date(0).toISOString(),intervalDays:12,ease:2.3,repetitions:2,lapses:0};
  mem.set(key,JSON.stringify({completedLessonIds:[old.id],currentLessonId:old.id,reviewCards:[card]}));const progress=await course.progress.getCourseProgress();assert.equal(progress.currentLessonId,old.id);assert(progress.completedLessonIds.includes(old.id));assert.equal(progress.reviewCards.find(c=>c.id===card.id).intervalDays,12);
  console.log(id,`27 A2 lessons, 220 examples, 52 partially linked topics, ${patterns.length} pattern links, ${countA2GrammarPatterns(id,lessons.map(l=>l.id))} distinct patterns; checkpoint and legacy progress passed.`);
 }
})().catch(e=>{console.error(e);process.exitCode=1});
