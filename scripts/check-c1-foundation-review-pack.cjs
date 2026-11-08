#!/usr/bin/env node
// Validate handoff integrity and metadata. This does not certify review, rights, speaker or audio quality.
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const {buildRecords,sha256}=require('./export-c1-foundation-human-review.cjs');
const contentHeader=['key','content_sha256','language_review','language_review_ref','language_review_date','pedagogy_review','pedagogy_review_ref','pedagogy_review_date','persian_review','persian_review_ref','persian_review_date','notes'];
const audioHeader=['segment_key','content_sha256','text_sha256','suggested_filename','recording_status','voice_locale','recording_reference','consent_reference','rights_reference','audio_sha256','independent_qa_status','qa_reference','notes'];
function fail(message){throw new Error(message)}
function table(file,expected){
 const raw=fs.readFileSync(file,'utf8').replace(/\r?\n$/,'');
 const lines=raw.split(/\r?\n/);if(lines[0]!==expected.join('\t'))fail(`Unexpected header: ${file}`);
 return lines.slice(1).map((line,i)=>{const cells=line.split('\t');if(cells.length!==expected.length)fail(`Malformed TSV row ${i+2}: ${file}`);return Object.fromEntries(expected.map((k,j)=>[k,cells[j]]));});
}
function dateValid(value){return /^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value+'T00:00:00Z'))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;}
async function checkPack(dir){
 if(!dir)fail('Usage: node scripts/check-c1-foundation-review-pack.cjs PACK_DIRECTORY');
 dir=path.resolve(dir);
 const data=JSON.parse(fs.readFileSync(path.join(dir,'lessons.json'),'utf8'));
 const current=await buildRecords();
 if(data.schema!=='c1-foundation-human-review-v2'||!Array.isArray(data.records)||data.records.length!==75)fail('Invalid lesson schema or count');
 const expected=new Map(current.map(r=>[r.key,r]));
 const found=new Set();
 for(const r of data.records){
  const source=expected.get(r.key);if(!source||found.has(r.key))fail(`Unknown or duplicate lesson ${r.key}`);found.add(r.key);
  if(r.contentSha256!==sha256(JSON.stringify(r.content))||r.contentSha256!==source.contentSha256)fail(`Changed or stale lesson ${r.key}`);
  if(!Array.isArray(r.segments)||r.segments.length!==source.segments.length)fail(`Invalid segments for ${r.key}`);
  for(let i=0;i<source.segments.length;i++){
   const segment=r.segments[i],real=source.segments[i];
   if(JSON.stringify(segment)!==JSON.stringify(real)||segment.textSha256!==sha256(segment.text))fail(`Changed or stale segment ${segment.key}`);
  }
 }
 const rows=table(path.join(dir,'content-tracking.tsv'),contentHeader),seen=new Set();
 if(rows.length!==75)fail('Content tracking must contain exactly 75 rows');
 let reviewed=0;
 for(const row of rows){
  const record=expected.get(row.key);if(!record||seen.has(row.key))fail(`Unknown or duplicate review ${row.key}`);seen.add(row.key);
  if(row.content_sha256!==record.contentSha256)fail(`Stale content review ${row.key}`);
  for(const role of ['language','pedagogy','persian']){
   const status=row[`${role}_review`],ref=row[`${role}_review_ref`],date=row[`${role}_review_date`];
   if(!['pending','approved','changes_requested'].includes(status))fail(`Invalid ${role} review status ${row.key}`);
   if(status!=='pending'&&(!ref.trim()||!dateValid(date)))fail(`Missing ${role} review reference or ISO date ${row.key}`);
   if(status==='changes_requested'&&!row.notes.trim())fail(`Missing change notes ${row.key}`);
  }
  if(['language','pedagogy','persian'].every(role=>row[`${role}_review`]==='approved'))reviewed++;
 }
 const segments=new Map(current.flatMap(r=>r.segments.map(s=>[s.key,{record:r,segment:s}]))),audios=table(path.join(dir,'audio-tracking.tsv'),audioHeader),audioSeen=new Set();
 if(audios.length!==segments.size||segments.size!==243)fail('Audio tracking must contain exactly 243 rows');
 let recorded=0,qa=0;
 for(const row of audios){
  const entry=segments.get(row.segment_key);if(!entry||audioSeen.has(row.segment_key))fail(`Unknown or duplicate audio ${row.segment_key}`);audioSeen.add(row.segment_key);
  if(row.content_sha256!==entry.record.contentSha256||row.text_sha256!==entry.segment.textSha256||row.suggested_filename!==entry.segment.suggestedFilename)fail(`Stale audio metadata ${row.segment_key}`);
  if(!['pending','recorded'].includes(row.recording_status)||!['pending','passed','failed'].includes(row.independent_qa_status))fail(`Invalid audio status ${row.segment_key}`);
  if(row.recording_status==='pending'&&row.independent_qa_status!=='pending')fail(`QA without recording ${row.segment_key}`);
  if(row.recording_status==='recorded'){
   let locale;try{locale=new Intl.Locale(row.voice_locale)}catch{fail(`Invalid voice locale ${row.segment_key}`)}
   if(locale.language!==entry.record.content.language||!row.recording_reference.trim()||!row.consent_reference.trim()||!row.rights_reference.trim()||!/^[a-f0-9]{64}$/.test(row.audio_sha256))fail(`Missing recording/rights metadata ${row.segment_key}`);
   const file=path.join(dir,'audio',entry.segment.suggestedFilename),data=fs.readFileSync(file);
   if(data.length<44||data.toString('ascii',0,4)!=='RIFF'||data.toString('ascii',8,12)!=='WAVE')fail(`Not a basic WAV container ${row.segment_key}`);
   if(createHash('sha256').update(data).digest('hex')!==row.audio_sha256)fail(`Audio hash mismatch ${row.segment_key}`);recorded++;
  }
  if(row.independent_qa_status!=='pending'&&!row.qa_reference.trim())fail(`Missing audio QA reference ${row.segment_key}`);
  if(row.independent_qa_status==='passed')qa++;
 }
 return {lessons:rows.length,reviewed,segments:audios.length,recorded,qa};
}
if(require.main===module)checkPack(process.argv[2]).then(r=>console.log(`Integrity check passed: ${r.lessons} lessons (${r.reviewed} with three reported approvals), ${r.segments} segments (${r.recorded} files reported, ${r.qa} reported QA passed). Metadata and hashes do not prove human review, authenticity, rights or quality.`)).catch(e=>{console.error(e.message);process.exitCode=1});
module.exports={checkPack};
