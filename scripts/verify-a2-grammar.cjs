const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const esbuild=require('esbuild');
const path=require('node:path');
const baseline=require('./fixtures/a2-pre-pattern-snapshot.json');
// Editorial checks tie each authored structure to concrete evidence in its
// example, instead of treating a nonempty pattern as proof of correctness.
const evidence={
 de:{
  present:[/^Arbeitest/,/heute arbeite ich/,/weil ich krank bin/],
  'routine-now':[/wachst .* auf/,/wache ich .* auf/,/lese gerade/],
  'past-activities':[/habe .* gearbeitet/,/bin .* gegangen/,/hatte/],
  experiences:[/Hast du .* schon besucht/,/habe ich .* gelesen/,/ist sie .* gegangen/],
  'future-arrangements':[/Morgen treffe ich/,/Wir treffen uns vor dem Bahnhof/,/werde .* reisen/],
  'shopping-return':[/wie viel kostet/,/Kann ich .* umtauschen/,/zu klein/],
  'comparison-quantity':[/günstiger als/,/am teuersten/,/genug Geld/],
  'necessity-advice':[/musst .* zurückgeben/,/darf man nicht telefonieren/,/solltest .* kommen/,/musst .* nicht kommen/],
  'hotel-change':[/Kann ich .* ändern/,/möchte ein Zimmer/,/stornieren Sie/],
  'health-symptoms':[/seit gestern/,/kein Fieber/,/habe Kopfschmerzen/],
  'reasons-conditions':[/wenn .* ist, gehe ich/,/deshalb nehme ich/,/weil .* hat/],
  'food-preferences':[/möchte eine/,/lieber Wasser als/,/Kann ich .* haben/],
  'housing-problems':[/es gibt/,/Können Sie .* prüfen/,/funktioniert nicht/],
  'objects-and-place':[/sehe es/,/schicke ihr/,/auf dem Tisch/,/auf den Tisch/],
 },
 es:{
  present:[/hoy trabajo/,/A qué hora terminas/,/porque estoy/],
  'routine-now':[/me despierto/,/Estoy leyendo/,/todos los días/],
  'past-activities':[/ayer trabajé/,/Fui a/,/tuvo una/],
  experiences:[/Has visitado .* alguna vez/,/he leído/,/has hecho/],
  'future-arrangements':[/tengo tiempo/,/voy a ver/,/Nos vemos/],
  'shopping-return':[/cuánto cuesta/,/Puedo cambiarla/,/me queda pequeña/],
  'comparison-quantity':[/más barato que/,/el más caro/,/suficiente dinero/],
  'necessity-advice':[/tienes que devolverlo/,/no se puede hablar/,/Deberías llegar/,/No tienes que venir/],
  'hotel-change':[/Puedo cambiar/,/Quisiera una/,/Cancele la reserva/],
  'health-symptoms':[/Tengo tos desde/,/no tengo fiebre/,/Me duele la cabeza/],
  'reasons-conditions':[/si hace buen tiempo, voy/,/por eso tomo/,/porque mañana tiene/],
  'food-preferences':[/Quisiera una/,/Prefiero el agua al zumo/,/puede traer/],
  'housing-problems':[/hay un problema/,/Puede revisar/,/no funciona/],
  'objects-and-place':[/lo veo/,/le envío/,/está en la mesa/,/Pongo .* en la mesa/],
 },
 fr:{
  present:[/Tu travailles/,/parce que je suis/,/le samedi/],
  'routine-now':[/Je me réveille/,/suis en train de lire/,/tous les jours/],
  'past-activities':[/ai travaillé/,/suis allée/,/a eu/],
  experiences:[/as déjà visité/,/ai lu/,/est allée/],
  'future-arrangements':[/suis libre/,/vais voir/,/J’irai/],
  'shopping-return':[/combien coûte/,/peux l’échanger/,/trop petite/],
  'comparison-quantity':[/moins cher que/,/le plus cher/,/beaucoup de temps/,/plus grande que/],
  'necessity-advice':[/dois le rendre/,/interdit de téléphoner/,/devrais arriver/,/n’as pas besoin de venir/],
  'hotel-change':[/peux changer/,/voudrais une/,/Annulez la réservation/],
  'health-symptoms':[/tousse depuis/,/n’ai pas de fièvre/,/ai mal à la tête/],
  'reasons-conditions':[/s’il fait beau, je vais/,/donc je prends/,/parce qu’elle/],
  'food-preferences':[/voudrais une/,/préfère l’eau au jus/,/peux avoir/],
  'housing-problems':[/il y a un problème/,/Pouvez-vous vérifier/,/ne marche pas/],
  'objects-and-place':[/je le vois/,/je lui envoie/,/est sur la table/,/mets .* sur la table/],
 },
};
(async()=>{
 const outfile=path.resolve('node_modules/.cache/a2-grammar-test.cjs');
 await esbuild.build({stdin:{contents:"export {NEW_COURSES} from './lib/languages/newCourses'; export {a2GrammarPatterns,countA2GrammarPatterns} from './lib/languages/a2Grammar';",resolveDir:process.cwd(),loader:'ts'},bundle:true,platform:'node',format:'cjs',outfile,plugins:[{name:'stubs',setup(build){
  build.onResolve({filter:/^\.\/supabase$/},args=>args.importer.endsWith('createCourseProgressStore.ts')?{path:'supabase',namespace:'stub'}:null);
  build.onResolve({filter:/^@react-native-async-storage\/async-storage$|^react-native$/},args=>({path:args.path,namespace:'stub'}));
  build.onLoad({filter:/.*/,namespace:'stub'},args=>({loader:'js',contents:args.path==='react-native'?'export const Platform={OS:"web"};':args.path==='supabase'?'export const supabase={};':'export default {};'}));
 }}]});
 const {NEW_COURSES,a2GrammarPatterns,countA2GrammarPatterns}=require(outfile);
 for(const id of ['de','es','fr']){
  const lessons=NEW_COURSES[id].lessons.filter(l=>l.levelId===2 && baseline[id][l.id]), ids=lessons.map(l=>l.id), forms=[];
  assert.equal(lessons.length,14);assert.equal(Object.keys(evidence[id]).length,14);
  for(const lesson of lessons){
   const slug=lesson.id.slice(`${id}-a2-`.length), patterns=a2GrammarPatterns(id,lesson.id), checks=evidence[id][slug];
   assert(checks,`Missing evidence for ${lesson.id}`);assert.equal(patterns.length,checks.length);assert(patterns.length>=3 && patterns.length<=4);
   assert.equal(new Set(patterns.map(p=>p.form)).size,patterns.length);assert.equal(new Set(patterns.map(p=>p.example)).size,patterns.length);
   patterns.forEach((p,i)=>{assert(p.form && p.explanationFa.length>25);assert(Number.isInteger(p.example)&&p.example>=1&&p.example<=lesson.sentences.length);assert.match(lesson.sentences[p.example-1].text,checks[i],`${lesson.id}, ${p.form}`);forms.push(p.form)});
   assert.equal(crypto.createHash('sha256').update(JSON.stringify(lesson)).digest('hex'),baseline[id][lesson.id],`${lesson.id} changed: IDs, examples, checks and dialogue must be stable`);
  }
  assert.equal(countA2GrammarPatterns(id,ids),new Set(forms).size);assert(countA2GrammarPatterns(id,ids)<forms.length,'repeated structures must be counted once');
  assert.equal(countA2GrammarPatterns(id,[ids[0],ids[0]]),a2GrammarPatterns(id,ids[0]).length);
  assert.deepEqual(a2GrammarPatterns(id,`${id}-a1-present`),[]);assert.deepEqual(a2GrammarPatterns(id,`${id}-a2-missing`),[]);
  console.log(id,`${forms.length} linked lesson patterns; ${new Set(forms).size} distinct structures; all 14 unchanged lessons verified.`);
 }
})().catch(e=>{console.error(e);process.exitCode=1});
