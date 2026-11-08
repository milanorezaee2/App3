#!/usr/bin/env node
// Temporary test fixtures are not human reviews, recordings, rights or quality assurance.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{createHash}=require('node:crypto');
const {buildFull,exportFull}=require('./export-c1-full-human-review.cjs');
const {checkFull}=require('./check-c1-full-human-review.cjs');
const {sha256}=require('./export-c1-foundation-human-review.cjs');
(async()=>{
 const {lessons,assessments}=await buildFull(),all=[...lessons,...assessments];assert.equal(lessons.length,165);assert.equal(assessments.length,3);assert.equal(all.flatMap(r=>r.segments).length,1374);
 for(const language of ['fr','de','es']){
  assert.equal(lessons.filter(r=>r.content.language===language&&r.content.section==='foundation').length,25);
  assert.equal(lessons.filter(r=>r.content.language===language&&r.content.section==='survival').length,30);
  assert.equal(assessments.filter(r=>r.content.language===language).length,1);
 }
 for(const r of all){assert.equal(r.contentSha256,sha256(JSON.stringify(r.content)));for(const s of r.segments){assert.equal(s.textSha256,sha256(s.text));assert.notEqual(s.textSha256,sha256(s.text+'x'));}}
 for(const r of lessons.filter(r=>r.content.section==='survival')){const c=r.content;assert(c.reading.questions.every(q=>c.reading.text.includes(q.evidence)));assert(c.listening.text.includes(c.listening.evidence));assert.equal(c.conversation.turns.length,2);assert(c.conversation.turns.every(t=>t.choices.length===2&&t.correctIndex===0&&t.explanation));assert.equal(r.segments.length,10);}
 for(const r of assessments){assert.equal(r.content.sources.length,4);assert.equal(r.content.production.length,4);assert.equal(r.segments.length,2);for(const source of r.content.sources)assert(source.questions.every(q=>source.text.includes(q.evidence)));}
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'app3-c1-full-review-'));
 try{
  const dir=path.join(tmp,'pack');await exportFull(dir);assert.deepEqual(await checkFull(dir),{lessons:165,assessments:3,segments:1374,reportedApproved:0,reportedRecorded:0,reportedQaPassed:0});
  for(const language of ['fr','de','es']){const transcript=fs.readFileSync(path.join(dir,`recording-scripts-${language}.md`),'utf8');assert.equal((transcript.match(/^## /gm)||[]).length,458);for(const r of all.filter(r=>r.content.language===language))for(const seg of r.segments){assert(transcript.includes(seg.text));assert(transcript.includes(seg.textSha256));}}
  const scriptFile=path.join(dir,'recording-scripts-fr.md'),scriptOriginal=fs.readFileSync(scriptFile,'utf8');fs.writeFileSync(scriptFile,scriptOriginal.replace('Unreviewed.','Changed.')); // A robust check must detect a changed script, not just a hash field.
  await assert.rejects(checkFull(dir),/Changed or stale recording script/);fs.writeFileSync(scriptFile,scriptOriginal);
  const contentFile=path.join(dir,'content-tracking.tsv'),contentOriginal=fs.readFileSync(contentFile,'utf8');let rows=contentOriginal.split('\n'),head=rows[0].split('\t'),cells=rows[1].split('\t');cells[head.indexOf('language_review')]='approved';rows[1]=cells.join('\t');fs.writeFileSync(contentFile,rows.join('\n'));await assert.rejects(checkFull(dir),/Missing language reference or date/);fs.writeFileSync(contentFile,contentOriginal);
  const audioFile=path.join(dir,'audio-tracking.tsv'),audioOriginal=fs.readFileSync(audioFile,'utf8');rows=audioOriginal.split('\n');head=rows[0].split('\t');cells=rows[1].split('\t');cells[head.indexOf('recording_status')]='recorded';rows[1]=cells.join('\t');fs.writeFileSync(audioFile,rows.join('\n'));await assert.rejects(checkFull(dir),/Invalid voice locale|Missing recording metadata/);
  const fake=Buffer.alloc(44);fake.write('RIFF',0);fake.write('WAVE',8);cells[head.indexOf('voice_locale')]='fr-FR';cells[head.indexOf('recording_reference')]='fixture';cells[head.indexOf('consent_reference')]='fixture';cells[head.indexOf('rights_reference')]='fixture';cells[head.indexOf('audio_sha256')]=createHash('sha256').update(fake).digest('hex');rows[1]=cells.join('\t');fs.writeFileSync(audioFile,rows.join('\n'));fs.mkdirSync(path.join(dir,'audio'));fs.writeFileSync(path.join(dir,'audio',cells[head.indexOf('suggested_filename')]),fake);assert.equal((await checkFull(dir)).reportedRecorded,1);fake[20]=1;fs.writeFileSync(path.join(dir,'audio',cells[head.indexOf('suggested_filename')]),fake);await assert.rejects(checkFull(dir),/Audio hash mismatch/);fs.writeFileSync(audioFile,audioOriginal);
  const file=path.join(dir,'assessments.json'),original=fs.readFileSync(file,'utf8'),data=JSON.parse(original);data.records[0].content.sources[0].text+='changed';fs.writeFileSync(file,JSON.stringify(data));await assert.rejects(checkFull(dir),/Stale or changed content/);fs.writeFileSync(file,original);
  fs.writeFileSync(path.join(dir,'keep.txt'),'do not overwrite');await assert.rejects(exportFull(dir),/not empty/);assert.equal(fs.readFileSync(path.join(dir,'keep.txt'),'utf8'),'do not overwrite');
  console.log('C1 full handoff: 165 lessons, 3 assessments, 1374 per-context segments, pending records, hashes, tamper detection, metadata gates and overwrite protection passed. Test audio is a dummy fixture, not human speech.');
 }finally{fs.rmSync(tmp,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1});
