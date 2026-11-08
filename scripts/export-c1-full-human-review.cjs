#!/usr/bin/env node
// Version-bound handoff for independent C1 content review and future human recordings.
// No export, checksum, metadata, or fixture is evidence of human review or recorded speech.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {build}=require('esbuild');
const {buildRecords:buildFoundation,sha256}=require('./export-c1-foundation-human-review.cjs');
const root=path.resolve(__dirname,'..'),languages=['fr','de','es'];
const clean=value=>String(value).replace(/[\t\r\n]/g,' ');
async function load(){
 const bundle=await build({stdin:{contents:[
  "export {getC1Curriculum} from './lib/languages/c1Curriculum';",
  "export {c1Deepening} from './lib/languages/c1Deepening';",
  "export {getC1SurvivalListening} from './lib/languages/c1SurvivalListening';",
  "export {c1SurvivalDecisions} from './lib/languages/c1SurvivalDecisions';",
  "export {c1SurvivalConversations,c1SurvivalPartnerLines} from './lib/languages/c1SurvivalConversation';",
  "export {c1ExamSources,c1ExamProduction} from './lib/languages/c1ComprehensiveAssessment';",
 ].join('\n'),resolveDir:root,loader:'ts'},bundle:true,platform:'node',format:'cjs',write:false});
 const mod={exports:{}};vm.runInNewContext(bundle.outputFiles[0].text,{module:mod,exports:mod.exports,require,console},{filename:'c1-full-review.cjs'});return mod.exports;
}
function segment(key,language,section,number,kind,text){
 if(!text||typeof text!=='string')throw new Error(`Missing recording text ${key}/${kind}`);
 return {key:`${key}:${kind}`,kind,text,textSha256:sha256(text),suggestedFilename:`${language}-c1-${section}-${String(number).padStart(2,'0')}-${kind}.wav`};
}
async function buildFull(){
 const {getC1Curriculum,c1Deepening,getC1SurvivalListening,c1SurvivalDecisions,c1SurvivalConversations,c1SurvivalPartnerLines,c1ExamSources,c1ExamProduction}=await load();
 const foundation=await buildFoundation();
 const lessons=foundation.map(r=>({...r,segments:[...r.segments,...r.content.notes.phrases.map((phrase,i)=>segment(r.key,r.content.language,'foundation',r.content.number,`phrase-${i+1}`,phrase.text))]}));
 for(const language of languages)for(let number=1;number<=30;number++){
  const lesson=c1Deepening('survival',number),listening=getC1SurvivalListening(number),turns=c1SurvivalDecisions[number-1],responses=c1SurvivalConversations[number-1]?.[language],partner=c1SurvivalPartnerLines[language];
  const curriculumTitle=getC1Curriculum(language).find(s=>s.id==='survival')?.topics.find(t=>t.number===number)?.title;
  if(!lesson||!listening||!turns||!responses||!partner||!curriculumTitle)throw new Error(`Missing survival ${language} ${number}`);
  const content={level:'c1',section:'survival',number,id:lesson.id,language,curriculumTitle,title:lesson.title,
   reading:{text:lesson.passage[language],questions:lesson.questions.map(q=>({prompt:q.prompt,choices:q.choices,correctIndex:q.correctIndex,explanation:q.explanation,evidence:q.evidence[language]}))},
   notes:lesson.notes[language],speaking:lesson.speaking,writing:lesson.writing,writingSteps:lesson.steps,writingModel:lesson.model[language],
   listening:{text:listening.text[language],question:listening.prompt,choices:listening.choices,correctIndex:0,explanation:listening.explanation,evidence:listening.evidence[language]},
   conversation:{partner,turns:turns.map((turn,i)=>({prompt:turn.prompt,choices:responses[i],correctIndex:0,explanation:turn.reason})),roleTask:listening.task,roleModel:listening.model[language]},
  };
  if(!content.listening.text.includes(content.listening.evidence)||content.reading.questions.some(q=>!content.reading.text.includes(q.evidence)))throw new Error(`Missing evidence ${language}/${number}`);
  const key=`${language}:c1:survival:${number}:${lesson.id}`;
  const segments=[segment(key,language,'survival',number,'reading',content.reading.text),segment(key,language,'survival',number,'listening',content.listening.text),
   ...content.notes.phrases.map((phrase,i)=>segment(key,language,'survival',number,`phrase-${i+1}`,phrase.text)),
   ...Object.entries(partner).map(([kind,text])=>segment(key,language,'survival',number,`partner-${kind}`,text)),
  ];
  lessons.push({key,contentSha256:sha256(JSON.stringify(content)),content,segments});
 }
 const assessments=languages.map(language=>{
  const content={level:'c1',language,kind:'formative',sources:c1ExamSources.map(source=>({id:source.id,kind:source.kind,text:source.text[language],questions:source.questions.map(q=>({prompt:q.prompt,choices:q.choices,correctIndex:q.correctIndex,explanation:q.explanation,evidence:q.evidence[language]}))})),production:c1ExamProduction.map(task=>({id:task.id,kind:task.kind,prompt:task.prompt,criteria:task.criteria,model:task.model[language]}))};
  for(const source of content.sources)if(source.questions.some(q=>!source.text.includes(q.evidence)))throw new Error(`Missing assessment evidence ${language}/${source.id}`);
  const key=`${language}:c1:assessment:formative`,segments=content.sources.filter(s=>s.kind==='listening').map((source,i)=>segment(key,language,'assessment',i+1,`listening-${i+1}`,source.text));
  return {key,contentSha256:sha256(JSON.stringify(content)),content,segments};
 });
 if(lessons.length!==165||assessments.length!==3||new Set([...lessons,...assessments].map(r=>r.key)).size!==168)throw new Error('Expected 165 unique lessons and 3 assessments');
 const assets=[...lessons,...assessments].flatMap(r=>r.segments);
 if(assets.length!==1374||new Set(assets.map(s=>s.key)).size!==1374||new Set(assets.map(s=>s.suggestedFilename)).size!==1374)throw new Error(`Expected 1374 unique per-context recording segments, got ${assets.length}; keys=${new Set(assets.map(s=>s.key)).size}, files=${new Set(assets.map(s=>s.suggestedFilename)).size}; duplicate=${assets.find((s,i)=>assets.findIndex(t=>t.suggestedFilename===s.suggestedFilename)!==i)?.suggestedFilename}`);
 return {lessons,assessments};
}
function renderRecordingScript(language,records){
 const lines=[`# C1 ${language.toUpperCase()} — draft recording scripts`,'','> Unreviewed. Obtain independent content review, human speaker consent and distribution rights before recording. A hash identifies text, not authenticity or approval.','',
  '> Dialogue labels in Foundation transcripts are part of the current text. Partner prompts are listed per context even when identical so that a production can record appropriate delivery.',''];
 for(const r of records.filter(x=>x.content.language===language))for(const s of r.segments)lines.push(`## ${s.key}`,'',`Content SHA-256: ${r.contentSha256}`,`Text SHA-256: ${s.textSha256}`,`Suggested file: ${s.suggestedFilename}`,'',s.text,'');
 return lines.join('\n');
}
async function exportFull(output){
 if(!output)throw new Error('Usage: node scripts/export-c1-full-human-review.cjs NEW_EMPTY_DIRECTORY');
 const dir=path.resolve(output);if(dir===root||dir===path.parse(dir).root)throw new Error('Choose a dedicated directory');
 if(fs.existsSync(dir)&&fs.readdirSync(dir).length)throw new Error('Output directory is not empty; refusing to overwrite review work');
 const {lessons,assessments}=await buildFull(),all=[...lessons,...assessments];fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,'lessons.json'),JSON.stringify({schema:'c1-full-review-v1',notice:'Unreviewed; checksums identify content, not approval or rights.',records:lessons},null,2)+'\n');
 fs.writeFileSync(path.join(dir,'assessments.json'),JSON.stringify({schema:'c1-assessment-review-v1',notice:'Formative drafts; not accredited examinations.',records:assessments},null,2)+'\n');
 const contentHeader=['key','content_sha256','language_review','language_review_ref','language_review_date','pedagogy_review','pedagogy_review_ref','pedagogy_review_date','persian_review','persian_review_ref','persian_review_date','notes'];
 fs.writeFileSync(path.join(dir,'content-tracking.tsv'),contentHeader.join('\t')+'\n'+all.map(r=>[r.key,r.contentSha256,'pending','','','pending','','','pending','','',''].map(clean).join('\t')).join('\n')+'\n');
 const audioHeader=['segment_key','content_sha256','text_sha256','suggested_filename','recording_status','voice_locale','recording_reference','consent_reference','rights_reference','audio_sha256','independent_qa_status','qa_reference','notes'];
 fs.writeFileSync(path.join(dir,'audio-tracking.tsv'),audioHeader.join('\t')+'\n'+all.flatMap(r=>r.segments.map(s=>[s.key,r.contentSha256,s.textSha256,s.suggestedFilename,'pending','','','','','','pending','',''].map(clean).join('\t'))).join('\n')+'\n');
 for(const language of languages)fs.writeFileSync(path.join(dir,`recording-scripts-${language}.md`),renderRecordingScript(language,all));
 fs.writeFileSync(path.join(dir,'README-fa.md'),`# بستهٔ کامل بازبینی C1\n\nاین بسته شامل ۱۶۵ درس و سه ارزیابی تمرینی و ۱۳۷۴ متن ضبط پیشنهادی برای هر بافت است. محتوای Foundation، Survival و ارزیابی‌ها همگی پیش‌نویس‌اند. ساخت این بسته به معنی تأیید متخصص، اعتبارسنجی آزمون، صدای انسانی، رضایت، مجوز یا کنترل کیفیت نیست. همهٔ وضعیت‌ها pending هستند و برنامه از TTS دستگاه استفاده می‌کند.\n\nlessons.json محتوای ۱۶۵ درس، از جمله گزینه‌های گفت‌وگو و بازخورد هر زبان را دارد. assessments.json سه ارزیابی چهارمهارته را دارد. content-tracking.tsv دارای وضعیت‌های زبانی، آموزشی و فارسی برای ۱۶۸ رکورد است. audio-tracking.tsv دارای شناسه و هش متن، وضعیت ضبط و کنترل، مرجع رضایت و حقوق برای هر قطعه است. فایل‌های recording-scripts برای سه زبان، متن و هش هر قطعه را فراهم می‌کنند. برای بازتولید دقیق تصمیم‌ها، پاسخ صحیح در داده‌ها index صفر دارد، هرچند برنامه ترتیب گزینه‌ها را تغییر می‌دهد.\n\nدر شمار ضبط: ۴۲۹ متن اصلی خواندن، شنیداری، گفت‌وگو، موقعیت تحلیلی و شنیداری ارزیابی؛ ۴۹۵ عبارت قابل پخش؛ و ۴۵۰ جملهٔ هم‌گفت‌وگوی شاخه‌ای به تفکیک بافت آمده‌اند. عبارات تکراری ممکن است دارای متن یکسان باشند اما شناسهٔ بافت متفاوت دارند؛ تعیین استفادهٔ مشترک یا ضبط جداگانه با گروه تولید است. گفت‌وگوهای Foundation نقش‌نما را در متن فعلی دارند.\n\nابتدا بازبین مستقل هر زبان، متخصص آموزشی و بازبین فارسی محتوا و تمام پاسخ‌ها و شواهد را با مرجع و تاریخ ارزیابی کنند. پس از اصلاح و تثبیت نسخه، گوینده با رضایت و مجوز روشن متن دقیق را ضبط کند و شنوندهٔ مستقل کل فایل را با متن منطبق سازد. هش اصالت انسانی، حقوق، کیفیت یا صحت علمی را اثبات نمی‌کند. اطلاعات تماس و قراردادهای محرمانه را در این جدول یا Git نگذارید. تغییر متن یا محتوا مستلزم ساخت بستهٔ جدید و بازبینی دوبارهٔ مورد تغییرکرده است. هیچ صدای ضبط‌شده‌ای در این بسته وجود ندارد و هیچ فایلی خودکار به برنامه متصل نمی‌شود.\n`);
 return {dir,lessons,assessments};
}
if(require.main===module)exportFull(process.argv[2]).then(({dir,lessons,assessments})=>console.log(`Exported ${lessons.length} lessons, ${assessments.length} formative assessments and ${[...lessons,...assessments].reduce((n,r)=>n+r.segments.length,0)} pending recording segments to ${dir}`)).catch(error=>{console.error(error.message);process.exitCode=1});
module.exports={buildFull,exportFull,renderRecordingScript};
