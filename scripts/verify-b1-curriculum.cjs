const normalizeB1Vocabulary=require('./b1-snapshot-compat.cjs');
const assert=require('node:assert/strict'), esbuild=require('esbuild'), path=require('node:path'), crypto=require('node:crypto');
const oldA2=require('./fixtures/b1-previous-a2-snapshot.json'), oldB1=require('./fixtures/b1-before-expansion.json');
const evidence={
 fr:{
  'past-story':[/avons mangé/i,/j’étais/i], 'past-contrast':[/j’habitais/i,/j’ai déménagé/i],
  'future-plans':[/travaillerai probablement/i,/mon objectif/i], 'real-conditions':[/s’il y a du soleil/i,/pourrons changer/i],
  hypothetical:[/si j’avais .* voyagerais/i,/pourrais-tu/i],opinions:[/à mon avis/i,/pourtant/i],
  'compare-options':[/plus calme que/i,/meilleur choix/i], 'work-interview':[/j’ai travaillé/i,/j’aidais/i],
  'study-goals':[/pour trouver/i,/afin de mieux/i], 'travel-problem':[/pourriez-vous/i,/à cause d’un/i],
  'health-advice':[/depuis trois jours/i,/si les symptômes changent, contactez/i], 'digital-life':[/à mon avis/i,/même si/i],
  'report-summary':[/a dit que/i,/en résumé/i], 'relative-clauses':[/quartier où/i,/femme qui/i,/bâtiment que/i],
  'process-passive':[/est envoyée/i,/remplissez/i], 'inference-past-modals':[/je devais/i,/doit être/i],
  'news-events':[/selon l’article/i,/j’aimerais/i], 'culture-exchange':[/dépend de/i,/certaines familles/i],
  'complaint-followup':[/pourriez-vous envoyer/i,/si je n’ai pas.*recontacterai/i], 'work-coordination':[/chargée de préparer/i,/avant la réunion/i], negotiating:[/pourrions-nous/i,/plus importants/i], 'purpose-consequences':[/pour que.*connaisse/i,/puisque.*devons/i], 'relatives-prepositions':[/livre dont nous avons besoin/i,/pensé à/i], 'sequence-incident':[/pendant que.*allais/i,/après avoir acheté/i], 'short-presentation':[/par exemple/i,/pour conclure/i], 'conversation-repair':[/pourriez-vous répéter/i,/si j’ai bien compris/i], 'emotions-reactions':[/j’étais contente/i,/m’ont aidée.*sentie/i], 'advice-rules':[/il faut.*inscrire/i,/il vaut mieux porter/i],
 },
 de:{
  'past-story':[/haben .* gegessen/i,/war .* nervös/i], 'past-contrast':[/wohnte .* ging/i,/bin .* gezogen/i],
  'future-plans':[/werde wahrscheinlich .* arbeiten/i,/informieren/i], 'real-conditions':[/wenn .* ist, fahren wir/i,/können wir .* ändern/i],
  hypothetical:[/wenn .* hätte, würde ich/i,/könntest du/i],opinions:[/weil .* ist/i,/trotzdem bevorzuge ich/i],
  'compare-options':[/ruhiger als/i,/beste Wahl/i], 'work-interview':[/habe .* gearbeitet/i,/half .* bereitete/i],
  'study-goals':[/um .* zu finden/i,/bereiten Sie sich auf/i], 'travel-problem':[/könnten Sie/i,/wegen .* Problems/i],
  'health-advice':[/seit drei Tagen/i,/wenn .* ändern, rufen Sie/i], 'digital-life':[/weil .* kann/i,/obwohl .* hat/i],
  'report-summary':[/sagte, dass .* beginnt/i,/zusammenfassend stehen/i], 'relative-clauses':[/in dem ich wohne/i,/die am Empfang arbeitet/i],
  'process-passive':[/wird .* geschickt/i,/füllen Sie/i], 'inference-past-modals':[/musste .* gehen/i,/muss .* sein/i,/konnte .* teilnehmen/i],
  'news-events':[/laut dem Artikel/i,/würde gern .* teilnehmen/i], 'culture-exchange':[/hängt von .* ab/i,/in manchen Familien/i],
  'complaint-followup':[/könnten sie.*schicken/i,/wenn.*höre.*melde ich/i], 'work-coordination':[/für den bericht verantwortlich/i,/vor dem treffen/i], negotiating:[/könnten wir/i,/wichtigsten themen/i], 'purpose-consequences':[/damit.*kennen/i,/da.*haben.*müssen/i], 'relatives-prepositions':[/warte auf/i,/an den neuen vorschlag gedacht/i], 'sequence-incident':[/während.*ging/i,/nachdem.*gekauft hatte/i], 'short-presentation':[/zum beispiel.*höre ich/i,/zum schluss empfehle ich/i], 'conversation-repair':[/könnten sie.*wiederholen/i,/verstanden, dass/i], 'emotions-reactions':[/weil.*wusste/i,/mit meiner entscheidung zufrieden/i], 'advice-rules':[/müssen sich.*anmelden/i,/sollten.*tragen/i],
 },
 es:{
  'past-story':[/después vi .* comimos/i,/estaba .* nerviosa/i], 'past-contrast':[/vivía .* caminaba/i,/me mudé/i,/esta mañana he hablado/i],
  'future-plans':[/probablemente trabajaré/i,/mi objetivo/i], 'real-conditions':[/si hace sol, iremos/i,/podremos cambiar/i],
  hypothetical:[/si tuviera .* viajaría/i,/podrías/i],opinions:[/en mi opinión/i,/sin embargo/i],
  'compare-options':[/más tranquila que/i,/mejor opción/i], 'work-interview':[/he trabajado/i,/ayudaba .* preparaba/i],
  'study-goals':[/para encontrar/i,/se prepara para/i], 'travel-problem':[/podría decirme/i,/por un problema técnico/i],
  'health-advice':[/desde hace tres días/i,/si cambian .* llame/i], 'digital-life':[/en mi opinión/i,/aunque/i],
  'report-summary':[/dijo que/i,/en resumen/i], 'relative-clauses':[/barrio donde/i,/mujer que trabaja/i],
  'process-passive':[/se envía la confirmación/i,/rellene/i], 'inference-past-modals':[/tenía que ir/i,/debe de estar/i],
  'news-events':[/según la noticia/i,/me gustaría participar/i], 'culture-exchange':[/depende de/i,/algunas familias/i],
  'complaint-followup':[/podría enviar/i,/si no recibo.*volveré/i], 'work-coordination':[/me encargo de preparar/i,/antes de la reunión/i], negotiating:[/podríamos/i,/más importantes/i], 'purpose-consequences':[/para que.*conozcan/i,/ya que.*debemos/i], 'relatives-prepositions':[/hablar de los costes/i,/pensado en/i], 'sequence-incident':[/mientras iba.*empezó/i,/después de comprar/i], 'short-presentation':[/por ejemplo/i,/para concluir/i], 'conversation-repair':[/podría repetir/i,/si he entendido bien/i], 'emotions-reactions':[/estaba contenta/i,/ayudaron.*sentí/i], 'advice-rules':[/tiene que inscribirse/i,/es mejor llevar/i],
 },
};
(async()=>{
 const outfile=path.resolve('node_modules/.cache/b1-audit.cjs');
 await esbuild.build({stdin:{contents:"export {NEW_COURSES} from './lib/languages/newCourses'; export {getB1Curriculum} from './lib/languages/b1Curriculum'; export {b1UnitSkills,b1GrammarPatterns,countB1GrammarPatterns,B1_UNIT_SLUGS} from './lib/languages/b1Units'; export {B1_CHECKPOINT} from './lib/languages/b1Checkpoint'; export {b1Scenarios} from './lib/languages/b1Scenarios'; export {b1Production,B1_PRODUCTION_SLUGS} from './lib/languages/b1Production';",resolveDir:process.cwd(),loader:'ts'},bundle:true,platform:'node',format:'cjs',outfile,plugins:[{name:'stub',setup(b){b.onResolve({filter:/^\.\/supabase$/},a=>a.importer.endsWith('createCourseProgressStore.ts')?{path:'supabase',namespace:'stub'}:null);b.onResolve({filter:/^@react-native-async-storage\/async-storage$|^react-native$/},a=>({path:a.path,namespace:'stub'}));b.onLoad({filter:/.*/,namespace:'stub'},a=>({loader:'js',contents:a.path==='react-native'?'export const Platform={OS:"web"};':a.path==='supabase'?'export const supabase={};':'export default {};'}));}}]});
 const mem=new Map();global.window={localStorage:{getItem:k=>mem.get(k)??null,setItem:(k,v)=>mem.set(k,String(v)),removeItem:k=>mem.delete(k)}};
 const {NEW_COURSES,getB1Curriculum,b1UnitSkills,b1GrammarPatterns,countB1GrammarPatterns,B1_UNIT_SLUGS,B1_CHECKPOINT,b1Production,B1_PRODUCTION_SLUGS,b1Scenarios}=require(outfile);
 assert.equal(B1_UNIT_SLUGS.length,28);assert.equal(new Set(B1_UNIT_SLUGS).size,28);assert.deepEqual([...B1_PRODUCTION_SLUGS].sort(),[...B1_UNIT_SLUGS].sort());
 for(const id of ['fr','de','es']){
  const course=NEW_COURSES[id],lessons=course.lessons.filter(l=>l.levelId===3),skills=b1UnitSkills(id),map=getB1Curriculum(id);
  assert.equal(course.levels.find(l=>l.id===3).status,'available');assert.equal(course.levels.find(l=>l.id===3).title, {fr:'B1 · Communication autonome',de:'B1 · Selbstständige Kommunikation',es:'B1 · Comunicación independiente'}[id]);assert.equal(lessons.length,28);assert.equal(lessons.reduce((n,l)=>n+l.sentences.length,0),224);
  assert.deepEqual(map.map(s=>s.id),['foundation','survival']);assert.deepEqual(map.map(s=>s.topics.length),[25,30]);
  for(const section of map){assert.deepEqual(section.topics.map(t=>t.number),Array.from({length:section.topics.length},(_,i)=>i+1));for(const topic of section.topics){assert(topic.title);assert.equal(new Set(topic.relatedLessonIds).size,topic.relatedLessonIds.length);for(const ref of topic.relatedLessonIds)assert(lessons.some(l=>l.id===ref),`${id} has dangling link ${ref}`)}}
  for(const lesson of lessons){
   const slug=lesson.id.slice(`${id}-b1-`.length);assert(B1_UNIT_SLUGS.includes(slug));const task=b1Production(id,lesson.id);assert(task?.speaking&&task?.writing&&task.checklist.length>=2);assert(task.speaking!==task.writing);assert(lesson.situation&&lesson.teachingFa);assert.equal(lesson.sentences.length,8);
   assert.equal(new Set(lesson.sentences.map(s=>s.text)).size,8);assert.equal(new Set(lesson.sentences.map(s=>s.fa)).size,8);
   for(const s of lesson.sentences)assert(s.id&&s.pronunciation&&s.vocabulary.every(v=>v.word&&v.meaning&&s.text.toLocaleLowerCase().includes(v.word.toLocaleLowerCase())),`${lesson.id}: ${s.text}`);
   assert.deepEqual(lesson.dialogue.map(x=>x.text),lesson.sentences.slice(0,4).map(x=>x.text));assert.equal(lesson.checks.length,4);
   lesson.checks.forEach((q,i)=>{assert.equal(q.choices[q.correctIndex],lesson.sentences[2*i].text);assert.equal(new Set(q.choices).size,4)});
   assert.deepEqual(skills[lesson.id].map(t=>t.kind),['listening','reading']);
   for(const task of skills[lesson.id]){assert(task.passage&&task.promptFa&&task.explanationFa);assert.equal(new Set(task.choices).size,3);assert(task.choices[task.correctIndex]);assert(!lesson.sentences.some(s=>s.text===task.passage),`${lesson.id} skill repeats sentence`);}
   const patterns=b1GrammarPatterns(id,lesson.id);assert(patterns.length>=2);assert.equal(patterns.length,evidence[id][slug].length,`${lesson.id} evidence count`);assert.equal(new Set(patterns.map(p=>p.form)).size,patterns.length);assert.equal(new Set(patterns.map(p=>p.example)).size,patterns.length);
   patterns.forEach((p,i)=>{assert(p.form&&p.explanationFa&&p.example>=1&&p.example<=8);assert.match(lesson.sentences[p.example-1].text,evidence[id][slug][i],`${lesson.id}: ${p.form}`)});
  }
  for(const lesson of lessons.filter(l=>oldB1[id][l.id])){const old=oldB1[id][lesson.id],hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');assert.equal(hash(normalizeB1Vocabulary(lesson)),old.lesson,`${lesson.id} changed beyond approved vocabulary corrections`);assert.equal(hash(skills[lesson.id]),old.skills,`${lesson.id} skills changed`);assert.equal(hash(b1GrammarPatterns(id,lesson.id)),old.patterns,`${lesson.id} patterns changed`)}
  assert.equal(Object.keys(oldB1[id]).length,18);for(const oldId of Object.keys(oldB1[id]))assert(lessons.some(l=>l.id===oldId),`missing pre-expansion B1 lesson ${oldId}`);
  const pat=lessons.flatMap(l=>b1GrammarPatterns(id,l.id));assert.equal(countB1GrammarPatterns(id,lessons.map(l=>l.id)),new Set(pat.map(p=>p.form)).size);
  assert.equal(b1Production(id,`${id}-a2-present`),undefined);assert.equal(b1Production(id,`${id}-b1-missing`),undefined);assert.deepEqual(b1GrammarPatterns(id,`${id}-a2-present`),[]);assert.deepEqual(b1GrammarPatterns(id,`${id}-b1-missing`),[]);
  const scenarios=b1Scenarios(id);assert.deepEqual(scenarios.map(x=>x.id),['order','meeting','transport']);assert.deepEqual(scenarios.map(x=>x.mode),['listening','reading','reading']);
  const scenarioEvidence={
   fr:[[/poignée est cassée/i,/appareil de remplacement/i,/répondre par courriel/i],[/fermée lundi pour des travaux/i,/vérifier le prix et la connexion Internet/i,/personne ne doit réserver/i],[/premier départ plus tôt/i,/plus fréquents le soir/i,/coût .* pas encore été confirmé/i]],
   de:[[/Griff ist gebrochen/i,/Ersatzgerät/i,/per E-Mail/i],[/am Montag wegen Arbeiten geschlossen/i,/Preis und die Internetverbindung/i,/niemand den Raum buchen/i],[/frühere erste Fahrt/i,/häufigere Fahrten am Abend/i,/Kosten .* noch nicht bestätigt/i]],
   es:[[/asa está rota/i,/aparato de sustitución/i,/por correo electrónico/i],[/cerrada el lunes por obras/i,/precio y la conexión a Internet/i,/nadie debe reservar/i],[/primer servicio salga más temprano/i,/más autobuses por la tarde/i,/coste .* no se ha confirmado/i]],
  };
  for(const [i,scenario] of scenarios.entries()){assert(scenario.title&&scenario.production);assert(scenario.text.split(/\s+/).length>=60);assert.equal(scenario.questions.length,3);scenarioEvidence[id][i].forEach(re=>assert.match(scenario.text,re));for(const q of scenario.questions){assert(q.prompt&&q.explanation&&q.choices[q.correctIndex]);assert.equal(new Set(q.choices).size,3)}}
  const check=B1_CHECKPOINT[id];assert.deepEqual(check.questions.map(q=>q.kind),['listening','listening','listening','reading','reading','reading']);
  for(const q of check.questions){assert(q.text&&q.question&&q.explanation&&q.choices[q.correctIndex]);assert.equal(new Set(q.choices).size,3);}assert.equal(check.speaking.length,2);assert.equal(check.writing.length,2);for(const p of [...check.speaking,...check.writing])assert(p.prompt&&p.model);for(const p of check.speaking)assert(p.stimulus&&p.stimulusFa);
  const a2=course.lessons.filter(l=>l.levelId===2);assert.equal(a2.length,27);for(const lesson of a2)assert.equal(crypto.createHash('sha256').update(JSON.stringify(lesson)).digest('hex'),oldA2[id][lesson.id],`old A2 lesson changed ${lesson.id}`);
  const old=a2[26],oldSession={stage:8,sentenceIndex:1,revealed:false,answers:{'0':0,'1':1},showCheckAnswers:false};await course.sessions.saveStarterLessonSession(old.id,oldSession);assert.deepEqual(await course.sessions.loadStarterLessonSession(old.id),oldSession);
  const key=`sentence_course_progress_${id}_starter_v1`,card={id:`${old.id}:${old.sentences[0].id}`,lessonId:old.id,sentenceId:old.sentences[0].id,dueAt:new Date(0).toISOString(),intervalDays:12,ease:2.3,repetitions:2,lapses:0};
  mem.set(key,JSON.stringify({completedLessonIds:[old.id],currentLessonId:old.id,reviewCards:[card]}));const progress=await course.progress.getCourseProgress();assert.equal(progress.currentLessonId,old.id);assert(progress.completedLessonIds.includes(old.id));assert.equal(progress.reviewCards.find(c=>c.id===card.id).intervalDays,12);
  const prior=lessons[17],next=lessons[18];assert(oldB1[id][prior.id]);assert(!oldB1[id][next.id]);
  await course.sessions.saveStarterLessonSession(prior.id,oldSession);assert.deepEqual(await course.sessions.loadStarterLessonSession(prior.id),oldSession);
  const b1Card={...card,id:`${prior.id}:${prior.sentences[0].id}`,lessonId:prior.id,sentenceId:prior.sentences[0].id};
  mem.set(key,JSON.stringify({completedLessonIds:[prior.id],currentLessonId:prior.id,reviewCards:[b1Card]}));
  const b1Progress=await course.progress.getCourseProgress();assert.equal(b1Progress.currentLessonId,prior.id);assert(b1Progress.completedLessonIds.includes(prior.id));assert.equal(b1Progress.reviewCards.find(c=>c.id===b1Card.id).intervalDays,12);
  const advanced=await course.progress.completeSentenceLesson(prior.id,next.id);assert.equal(advanced.currentLessonId,next.id);assert.equal(advanced.reviewCards.find(c=>c.id===b1Card.id).intervalDays,12);
  const unlinked=map.flatMap(s=>s.topics).filter(t=>!t.relatedLessonIds.length).length;
  console.log(id,`28 B1 lessons, 224 sentences, ${55-unlinked}/55 topics linked partially, ${pat.length} lesson patterns, ${countB1GrammarPatterns(id,lessons.map(l=>l.id))} distinct; A2 unchanged and checkpoint checked.`);
 }
})().catch(e=>{console.error(e);process.exitCode=1});
