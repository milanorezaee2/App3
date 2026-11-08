#!/usr/bin/env node
// Exercise the exporter and validator using only temporary dummy files, not actual review/audio.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const {createHash}=require('node:crypto');
const {buildRecords,exportPack,sha256}=require('./export-c1-foundation-human-review.cjs');
const {checkPack}=require('./check-c1-foundation-review-pack.cjs');
(async()=>{
 const records=await buildRecords();assert.equal(records.length,75);assert.equal(new Set(records.map(r=>r.key)).size,75);
 for(const lang of ['fr','de','es'])assert.equal(records.filter(r=>r.content.language===lang).length,25);
 for(const r of records){
  assert.equal(r.contentSha256,sha256(JSON.stringify(r.content)));assert.equal(r.segments.length,r.content.rhetoric?4:3);if(r.content.rhetoric)assert(r.content.rhetoric.text.includes(r.content.rhetoric.evidence));
  for(const s of r.segments){assert.equal(s.textSha256,sha256(s.text));assert.notEqual(s.textSha256,sha256(s.text+'x'));}
  for(const q of r.content.reading.questions){assert(r.content.reading.text.includes(q.evidence));assert(q.choices[q.correctIndex]);}
  assert(r.content.listening.text.includes(r.content.listening.evidence));
  assert.notEqual(r.content.reading.text,r.content.listening.text);assert(r.content.dialogue.roleModel&&r.content.dialogue.roleReview.length===2);
 }
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'app3-c1-handoff-test-'));
 try{
  const dir=path.join(temp,'pack');await exportPack(dir);
  assert.deepEqual(await checkPack(dir),{lessons:75,reviewed:0,segments:243,recorded:0,qa:0});
  for(const lang of ['fr','de','es']){
   const script=fs.readFileSync(path.join(dir,`recording-scripts-${lang}.md`),'utf8');assert.equal((script.match(/^## /gm)||[]).length,81);
   for(const r of records.filter(r=>r.content.language===lang))for(const segment of r.segments){assert(script.includes(segment.text));assert(script.includes(segment.textSha256));}
  }
  const contentFile=path.join(dir,'content-tracking.tsv'),contentOriginal=fs.readFileSync(contentFile,'utf8');
  let rows=contentOriginal.split('\n'),header=rows[0].split('\t'),row=rows[1].split('\t');row[header.indexOf('language_review')]='approved';rows[1]=row.join('\t');fs.writeFileSync(contentFile,rows.join('\n'));
  await assert.rejects(checkPack(dir),/Missing language review reference or ISO date/);fs.writeFileSync(contentFile,contentOriginal);
  rows=contentOriginal.split('\n');header=rows[0].split('\t');row=rows[1].split('\t');
  for(const role of ['language','pedagogy','persian']){row[header.indexOf(`${role}_review`)]='approved';row[header.indexOf(`${role}_review_ref`)]=`fixture-${role}`;row[header.indexOf(`${role}_review_date`)]='2026-11-08';}
  rows[1]=row.join('\t');fs.writeFileSync(contentFile,rows.join('\n'));assert.equal((await checkPack(dir)).reviewed,1);
  row[header.indexOf('language_review')]='changes_requested';rows[1]=row.join('\t');fs.writeFileSync(contentFile,rows.join('\n'));await assert.rejects(checkPack(dir),/Missing change notes/);fs.writeFileSync(contentFile,contentOriginal);
  const audioFile=path.join(dir,'audio-tracking.tsv'),audioOriginal=fs.readFileSync(audioFile,'utf8');
  rows=audioOriginal.split('\n');header=rows[0].split('\t');row=rows[1].split('\t');row[header.indexOf('recording_status')]='recorded';rows[1]=row.join('\t');fs.writeFileSync(audioFile,rows.join('\n'));
  await assert.rejects(checkPack(dir),/Invalid voice locale|Missing recording/);
  // A tiny test container exercises metadata + digest logic, not proof of valid audio or a human voice.
  const wav=Buffer.alloc(44);wav.write('RIFF',0);wav.write('WAVE',8);const wavHash=createHash('sha256').update(wav).digest('hex');
  row[header.indexOf('voice_locale')]='fr-FR';row[header.indexOf('recording_reference')]='fixture-recording';row[header.indexOf('consent_reference')]='fixture-consent';row[header.indexOf('rights_reference')]='fixture-rights';row[header.indexOf('audio_sha256')]=wavHash;
  rows[1]=row.join('\t');fs.writeFileSync(audioFile,rows.join('\n'));fs.mkdirSync(path.join(dir,'audio'));
  fs.writeFileSync(path.join(dir,'audio',row[header.indexOf('suggested_filename')]),wav);let result=await checkPack(dir);assert.equal(result.recorded,1);assert.equal(result.qa,0);
  row[header.indexOf('independent_qa_status')]='passed';rows[1]=row.join('\t');fs.writeFileSync(audioFile,rows.join('\n'));await assert.rejects(checkPack(dir),/Missing audio QA reference/);
  row[header.indexOf('qa_reference')]='fixture-independent-qa';rows[1]=row.join('\t');fs.writeFileSync(audioFile,rows.join('\n'));result=await checkPack(dir);assert.equal(result.qa,1);
  wav[20]=1;fs.writeFileSync(path.join(dir,'audio',row[header.indexOf('suggested_filename')]),wav);await assert.rejects(checkPack(dir),/Audio hash mismatch/);fs.writeFileSync(audioFile,audioOriginal);
  const lessonFile=path.join(dir,'lessons.json'),lessonOriginal=fs.readFileSync(lessonFile,'utf8'),lesson=JSON.parse(lessonOriginal);lesson.records[0].content.reading.text+=' changed';fs.writeFileSync(lessonFile,JSON.stringify(lesson));await assert.rejects(checkPack(dir),/Changed or stale lesson/);fs.writeFileSync(lessonFile,lessonOriginal);
  fs.writeFileSync(path.join(dir,'keep.txt'),'do not overwrite');await assert.rejects(exportPack(dir),/not empty/);assert.equal(fs.readFileSync(path.join(dir,'keep.txt'),'utf8'),'do not overwrite');
  const cli=spawnSync(process.execPath,[path.join(__dirname,'check-c1-foundation-review-pack.cjs'),dir],{encoding:'utf8'});assert.equal(cli.status,0,cli.stderr);assert.match(cli.stdout,/0 with three reported approvals/);
  console.log('C1 handoff: 75 records, 243 draft segments, exact hashes, pending status, stale/tampered detection, metadata gates and overwrite protection passed. Dummy fixture does not demonstrate human review or audio.');
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1});
