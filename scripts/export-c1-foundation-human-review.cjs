#!/usr/bin/env node
// Export a version-bound handoff for independent reviewers and human voice actors.
// Exporting, checksums and automatic checks do not constitute review, consent or audio QA.
const {build}=require('esbuild');
const {createHash}=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const languages=['fr','de','es'];
const sha256=text=>createHash('sha256').update(text,'utf8').digest('hex');
const safe=value=>String(value).replace(/[\t\r\n]/g,' ');

async function buildRecords(){
 const bundle=await build({stdin:{contents:[
  "export {getC1Curriculum} from './lib/languages/c1Curriculum';",
  "export {c1Deepening} from './lib/languages/c1Deepening';",
  "export {c1FoundationStudio} from './lib/languages/c1FoundationStudio';",
  "export {c1FoundationDiagnostics} from './lib/languages/c1FoundationDiagnostics';",
  "export {c1FoundationTransfer} from './lib/languages/c1FoundationTransfer';",
  "export {c1FoundationRoleReview} from './lib/languages/c1FoundationRoleReview';",
  "export {c1FoundationRoleModels} from './lib/languages/c1FoundationRoleModels';",
  "export {getC1RhetoricPractice} from './lib/languages/c1RhetoricPractice';",
 ].join('\n'),resolveDir:root,loader:'ts'},bundle:true,platform:'node',format:'cjs',write:false});
 const mod={exports:{}};
 vm.runInNewContext(bundle.outputFiles[0].text,{module:mod,exports:mod.exports,require,console},{filename:'c1-review-bundle.cjs'});
 const {getC1Curriculum,c1Deepening,c1FoundationStudio,c1FoundationDiagnostics,c1FoundationTransfer,c1FoundationRoleReview,c1FoundationRoleModels,getC1RhetoricPractice}=mod.exports;
 const records=[];
 for(const language of languages)for(let number=1;number<=25;number++){
  const lesson=c1Deepening('foundation',number),studio=c1FoundationStudio[number-1];
  const title=getC1Curriculum(language).find(s=>s.id==='foundation')?.topics.find(t=>t.number===number)?.title;
  if(!lesson||!title||!studio||studio.number!==number)throw new Error(`Missing exact topic: ${language} ${number}`);
  // Include every locally rendered learning item; answer and source evidence are reviewable.
  const rhetoric=getC1RhetoricPractice(number);
  const content={
   level:'c1',section:'foundation',number,id:lesson.id,language,curriculumTitle:title,title:lesson.title,
   reading:{text:lesson.passage[language],questions:lesson.questions.map(q=>({prompt:q.prompt,choices:q.choices,correctIndex:q.correctIndex,explanation:q.explanation,evidence:q.evidence[language]}))},
   notes:lesson.notes[language],speaking:lesson.speaking,writing:lesson.writing,writingSteps:lesson.steps,writingModel:lesson.model[language],
   listening:{text:studio.audio[language],question:studio.listening.prompt,choices:studio.listening.choices,correctIndex:0,explanation:studio.listening.explanation,evidence:studio.evidence[language]},
   dialogue:{text:studio.dialogue[language],roleTask:studio.roleTask,roleModel:c1FoundationRoleModels[number-1][language],roleReview:c1FoundationRoleReview[number-1]},
   structure:{prompt:studio.form.prompt,correct:studio.form.right[language],incorrect:studio.form.wrong[language],explanation:studio.form.explanation},
   diagnostic:{...c1FoundationDiagnostics[number-1],correctIndex:0},transfer:c1FoundationTransfer[number-1],
   ...(rhetoric?{rhetoric:{title:rhetoric.title,concept:rhetoric.concept,text:rhetoric.context[language],question:rhetoric.question,choices:rhetoric.choices[language],correctIndex:0,explanation:rhetoric.explanation,evidence:rhetoric.evidence[language],assignment:rhetoric.assignment,criteria:rhetoric.criteria,model:rhetoric.model[language]}}:{}),
  };
  if(content.reading.questions.some(q=>!content.reading.text.includes(q.evidence))||!content.listening.text.includes(content.listening.evidence))throw new Error(`Missing evidence: ${language} ${number}`);
  const key=`${language}:c1:foundation:${number}:${lesson.id}`;
  if(content.rhetoric&&!content.rhetoric.text.includes(content.rhetoric.evidence))throw new Error(`Missing rhetoric evidence: ${language} ${number}`);
  const segments=['reading','listening','dialogue',...(rhetoric?['rhetoric']:[])].map(kind=>({
   key:`${key}:${kind}`,kind,text:content[kind].text,textSha256:sha256(content[kind].text),
   // Suggested filename only. No audio file, rights or human voice is implied.
   suggestedFilename:`${language}-c1-foundation-${String(number).padStart(2,'0')}-${kind}.wav`,
  }));
  records.push({key,contentSha256:sha256(JSON.stringify(content)),content,segments});
 }
 if(records.length!==75||new Set(records.map(r=>r.key)).size!==75)throw new Error('Expected 75 unique localized lessons');
 return records;
}

async function exportPack(output){
 if(!output)throw new Error('Usage: node scripts/export-c1-foundation-human-review.cjs OUTPUT_DIRECTORY (new or empty)');
 const dir=path.resolve(output);
 if(dir===root||dir===path.parse(dir).root)throw new Error('Choose a dedicated output directory');
 if(fs.existsSync(dir)&&fs.readdirSync(dir).length)throw new Error('Output directory is not empty; refusing to overwrite review work');
 const records=await buildRecords();fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,'lessons.json'),JSON.stringify({schema:'c1-foundation-human-review-v2',notice:'Unreviewed draft. Hashes identify exact content, not approval, authenticity, consent, audio quality or legal rights.',records},null,2)+'\n');
 const contentHeader=['key','content_sha256','language_review','language_review_ref','language_review_date','pedagogy_review','pedagogy_review_ref','pedagogy_review_date','persian_review','persian_review_ref','persian_review_date','notes'];
 const contentRows=records.map(r=>[r.key,r.contentSha256,'pending','','','pending','','','pending','','',''].map(safe).join('\t'));
 fs.writeFileSync(path.join(dir,'content-tracking.tsv'),contentHeader.join('\t')+'\n'+contentRows.join('\n')+'\n');
 const audioHeader=['segment_key','content_sha256','text_sha256','suggested_filename','recording_status','voice_locale','recording_reference','consent_reference','rights_reference','audio_sha256','independent_qa_status','qa_reference','notes'];
 const audioRows=records.flatMap(r=>r.segments.map(s=>[s.key,r.contentSha256,s.textSha256,s.suggestedFilename,'pending','','','','','','pending','',''].map(safe).join('\t')));
 fs.writeFileSync(path.join(dir,'audio-tracking.tsv'),audioHeader.join('\t')+'\n'+audioRows.join('\n')+'\n');
 for(const language of languages){
  const lines=[`# C1 Foundation — ${language.toUpperCase()} — proposed recording scripts`,'',
   '> UNREVIEWED DRAFT. Do not record for release before the final text is independently reviewed. Hashes identify exact UTF-8 text; they do not certify content, speaker, rights, or audio.','',
   '> Dialogue labels are part of the exact text currently displayed/read by the app. Decide the production convention during review; any change requires a new reviewed text/hash and revalidation.',''];
  for(const r of records.filter(r=>r.content.language===language))for(const s of r.segments){
   lines.push(`## ${s.key}`,'',`Content SHA-256: ${r.contentSha256}`,`Text SHA-256: ${s.textSha256}`,`Suggested file: ${s.suggestedFilename}`,'',s.text,'');
  }
  fs.writeFileSync(path.join(dir,`recording-scripts-${language}.md`),lines.join('\n'));
 }
 const readme=`# بستهٔ بازبینی و ضبط انسانی Foundation سطح C1\n\nاین بسته ۷۵ درس (۲۵ درس در هر یک از سه زبان) و ۲۴۳ متن ضبط پیشنهادی (متن خواندن، شنیداری مستقل و گفت‌وگو برای هر درس، و ۱۸ متن موقعیت تحلیلی جدید) را از نسخهٔ فعلی کد استخراج می‌کند. همهٔ موارد پیش‌نویس‌اند؛ هیچ بازبینی انسانی، ضبط، مجوز یا کنترل کیفیت با ساخت این بسته انجام نشده است. برنامه همچنان از صدای دستگاه استفاده می‌کند.\n\n- lessons.json: متن کامل هر درس، پرسش‌ها، پاسخ، شاهد، نکات، موقعیت، تمرین‌ها و نمونه‌ها، همراه هش محتوای هر درس.\n- content-tracking.tsv: وضعیت بازبینی زبانی، آموزشی و فارسی؛ همه pending.\n- audio-tracking.tsv: وضعیت ۲۴۳ قطعهٔ پیشنهادی، لهجه، مرجع حقوق، هش فایل و کنترل شنیداری مستقل؛ همه pending.\n- recording-scripts-fr.md / de.md / es.md: متن دقیق هر قطعه و هش آن؛ برچسب نقش‌ها بخشی از متن فعلی گفت‌وگو است.\n\nبازبینی مستقل باید با مرجع، تاریخ و هش محتوا مستند شود؛ ثبت وضعیت بدون انجام بررسی واقعی مجاز نیست. ابتدا همهٔ متن‌ها و تمرین‌ها بررسی و خطاها اصلاح شوند، سپس بستهٔ جدید با هش جدید تولید و تأیید شود. صدای انسانی تنها پس از تثبیت متن ضبط شود و باید دقیقاً با نسخهٔ تأییدشده، لهجه، رضایت و مجوز روشن و کنترل شنیداری مستقل مطابقت داشته باشد. هش به‌تنهایی اصالت انسانی، صحت، کیفیت، رضایت، حقوق یا انطباق رسمی CEFR را اثبات نمی‌کند. اطلاعات تماس و قراردادهای محرمانه را در مخزن یا این جدول نگذارید؛ از مرجع غیرحساس استفاده کنید.\n\nتغییر متن یا محتوای درس، تأیید مرتبط را بی‌اعتبار می‌کند و باید مجدداً بررسی شود. هیچ قطعه‌ای تا دریافت و اعتبارسنجی واقعی، به برنامه متصل نشده است. دستورالعمل کامل در docs/c1-foundation-human-review-fa.md مخزن قرار دارد.\n`;
 fs.writeFileSync(path.join(dir,'README-fa.md'),readme);
 return {dir,records};
}
if(require.main===module)exportPack(process.argv[2]).then(({dir,records})=>console.log(`Exported ${records.length} unreviewed C1 Foundation lessons and ${records.reduce((n,r)=>n+r.segments.length,0)} pending recording segments to ${dir}`)).catch(error=>{console.error(error.message);process.exitCode=1});
module.exports={buildRecords,exportPack,sha256};
