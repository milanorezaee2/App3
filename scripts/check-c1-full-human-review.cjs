#!/usr/bin/env node
// Structural and metadata checks only: never proof of human expertise, rights, audio authenticity or quality.
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const {sha256}=require('./export-c1-foundation-human-review.cjs');
const {buildFull,renderRecordingScript}=require('./export-c1-full-human-review.cjs');
const contentHeader=['key','content_sha256','language_review','language_review_ref','language_review_date','pedagogy_review','pedagogy_review_ref','pedagogy_review_date','persian_review','persian_review_ref','persian_review_date','notes'];
const audioHeader=['segment_key','content_sha256','text_sha256','suggested_filename','recording_status','voice_locale','recording_reference','consent_reference','rights_reference','audio_sha256','independent_qa_status','qa_reference','notes'];
function fail(message){throw new Error(message)}
function table(file,header){const lines=fs.readFileSync(file,'utf8').replace(/\r?\n$/,'').split(/\r?\n/);if(lines[0]!==header.join('\t'))fail(`Unexpected header ${file}`);return lines.slice(1).map((line,i)=>{const fields=line.split('\t');if(fields.length!==header.length)fail(`Malformed row ${i+2} in ${file}`);return Object.fromEntries(header.map((k,j)=>[k,fields[j]]));});}
function dateValid(s){return /^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;}
async function checkFull(directory){
 if(!directory)fail('Usage: node scripts/check-c1-full-human-review.cjs PACK_DIRECTORY');
 const dir=path.resolve(directory),current=await buildFull(),actualLessons=JSON.parse(fs.readFileSync(path.join(dir,'lessons.json'),'utf8')),actualExams=JSON.parse(fs.readFileSync(path.join(dir,'assessments.json'),'utf8'));
 if(actualLessons.schema!=='c1-full-review-v1'||actualExams.schema!=='c1-assessment-review-v1'||actualLessons.records?.length!==165||actualExams.records?.length!==3)fail('Unexpected schema or record count');
 const lessonKeys=new Set(current.lessons.map(r=>r.key)),examKeys=new Set(current.assessments.map(r=>r.key));
 if(actualLessons.records.some(r=>!lessonKeys.has(r.key))||actualExams.records.some(r=>!examKeys.has(r.key)))fail('Record found in wrong file');
 const expected=new Map([...current.lessons,...current.assessments].map(r=>[r.key,r])),seen=new Set();
 for(const r of [...actualLessons.records,...actualExams.records]){
  const src=expected.get(r.key);if(!src||seen.has(r.key))fail(`Unknown or duplicate record: ${r.key}`);seen.add(r.key);
  if(r.contentSha256!==sha256(JSON.stringify(r.content))||r.contentSha256!==src.contentSha256)fail(`Stale or changed content: ${r.key}`);
  if(!Array.isArray(r.segments)||r.segments.length!==src.segments.length)fail(`Bad segment count: ${r.key}`);
  for(let i=0;i<src.segments.length;i++){const segment=r.segments[i];if(JSON.stringify(segment)!==JSON.stringify(src.segments[i])||segment.textSha256!==sha256(segment.text))fail(`Stale or changed segment: ${segment.key}`);}
 }
 for(const language of ['fr','de','es'])if(fs.readFileSync(path.join(dir,`recording-scripts-${language}.md`),'utf8')!==renderRecordingScript(language,[...current.lessons,...current.assessments]))fail(`Changed or stale recording script: ${language}`);
 const reviews=table(path.join(dir,'content-tracking.tsv'),contentHeader);if(reviews.length!==168)fail('Expected 168 content-tracking rows');const seenReviews=new Set();let approved=0;
 for(const row of reviews){const src=expected.get(row.key);if(!src||seenReviews.has(row.key))fail(`Unknown or duplicate review: ${row.key}`);seenReviews.add(row.key);if(row.content_sha256!==src.contentSha256)fail(`Stale review: ${row.key}`);
  for(const role of ['language','pedagogy','persian']){const status=row[`${role}_review`],ref=row[`${role}_review_ref`],date=row[`${role}_review_date`];if(!['pending','approved','changes_requested'].includes(status))fail(`Invalid review status: ${row.key}`);if(status!=='pending'&&(!ref.trim()||!dateValid(date)))fail(`Missing ${role} reference or date: ${row.key}`);if(status==='changes_requested'&&!row.notes.trim())fail(`Missing change notes: ${row.key}`);}
  if(['language','pedagogy','persian'].every(role=>row[`${role}_review`]==='approved'))approved++;
 }
 const expectedAudio=new Map([...expected.values()].flatMap(r=>r.segments.map(s=>[s.key,{parent:r,segment:s}]))),audio=table(path.join(dir,'audio-tracking.tsv'),audioHeader),seenAudio=new Set();
 if(audio.length!==1374||expectedAudio.size!==1374)fail('Expected 1374 audio tracking rows');let recorded=0,qaPassed=0;
 for(const row of audio){const item=expectedAudio.get(row.segment_key);if(!item||seenAudio.has(row.segment_key))fail(`Unknown or duplicate audio: ${row.segment_key}`);seenAudio.add(row.segment_key);
  if(row.content_sha256!==item.parent.contentSha256||row.text_sha256!==item.segment.textSha256||row.suggested_filename!==item.segment.suggestedFilename)fail(`Stale audio metadata: ${row.segment_key}`);
  if(!['pending','recorded'].includes(row.recording_status)||!['pending','passed','failed'].includes(row.independent_qa_status))fail(`Invalid audio status: ${row.segment_key}`);
  if(row.recording_status==='pending'&&row.independent_qa_status!=='pending')fail(`QA without recording: ${row.segment_key}`);
  if(row.recording_status==='recorded'){
   let locale;try{locale=new Intl.Locale(row.voice_locale)}catch{fail(`Invalid voice locale: ${row.segment_key}`)}
   if(locale.language!==item.parent.content.language||!row.recording_reference.trim()||!row.consent_reference.trim()||!row.rights_reference.trim()||!/^[a-f0-9]{64}$/.test(row.audio_sha256))fail(`Missing recording metadata: ${row.segment_key}`);
   const bytes=fs.readFileSync(path.join(dir,'audio',item.segment.suggestedFilename));if(bytes.length<44||bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WAVE')fail(`Invalid basic WAV header: ${row.segment_key}`);
   if(createHash('sha256').update(bytes).digest('hex')!==row.audio_sha256)fail(`Audio hash mismatch: ${row.segment_key}`);recorded++;
  }
  if(row.independent_qa_status!=='pending'&&!row.qa_reference.trim())fail(`Missing audio QA reference: ${row.segment_key}`);if(row.independent_qa_status==='passed')qaPassed++;
 }
 return {lessons:165,assessments:3,segments:1374,reportedApproved:approved,reportedRecorded:recorded,reportedQaPassed:qaPassed};
}
if(require.main===module)checkFull(process.argv[2]).then(r=>console.log(`Integrity OK: ${r.lessons} lessons, ${r.assessments} formative assessments, ${r.segments} recording segments; reported approvals=${r.reportedApproved}, recorded=${r.reportedRecorded}, QA=${r.reportedQaPassed}. This does not verify review, human voice, rights, quality or accreditation.`)).catch(e=>{console.error(e.message);process.exitCode=1});
module.exports={checkFull};
