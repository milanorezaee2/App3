const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const {buildRecords, sha256} = require('./export-b1-b2-human-review.cjs');

(async () => {
  const records = await buildRecords();
  assert.equal(records.length, 330);
  assert.equal(new Set(records.map(r => r.key)).size, 330);
  for (const lang of ['fr','de','es']) for (const level of ['b1','b2']) {
    assert.equal(records.filter(r => r.content.language === lang && r.content.level === level).length, 55);
  }
  for (const r of records) {
    assert.equal(r.passageSha256, sha256(r.content.passage));
    assert.equal(r.contentSha256, sha256(JSON.stringify(r.content)));
    assert.notEqual(r.passageSha256, sha256(r.content.passage + 'x'));
    assert.equal(r.content.questions.length, 3);
    for (const q of r.content.questions) {
      assert(r.content.passage.includes(q.evidence));
      assert(q.choices[q.correctIndex]);
    }
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'app3-review-test-'));
  try {
    const output = path.join(dir, 'pack');
    const cli = path.join(__dirname, 'export-b1-b2-human-review.cjs');
    let run = spawnSync(process.execPath, [cli,output], {encoding:'utf8'});
    assert.equal(run.status, 0, run.stderr);
    const data = JSON.parse(fs.readFileSync(path.join(output,'lessons.json'),'utf8'));
    assert.equal(data.records.length, 330);
    const lines = fs.readFileSync(path.join(output,'tracking.tsv'),'utf8').trimEnd().split('\n');
    assert.equal(lines.length, 331);
    assert(lines.slice(1).every(row => row.split('\t')[3] === 'pending' && row.split('\t')[5] === 'pending'));
    for (const lang of ['fr','de','es']) {
      const scripts = fs.readFileSync(path.join(output,`recording-scripts-${lang}.md`),'utf8');
      const relevant = records.filter(r => r.content.language === lang);
      assert.equal((scripts.match(/^## /gm)||[]).length,110);
      for (const r of relevant) { assert(scripts.includes(r.passageSha256)); assert(scripts.includes(r.content.passage)); }
    }
    fs.writeFileSync(path.join(output,'keep.txt'),'do not overwrite');
    run = spawnSync(process.execPath, [cli,output], {encoding:'utf8'});
    assert.notEqual(run.status, 0);
    assert.equal(fs.readFileSync(path.join(output,'keep.txt'),'utf8'),'do not overwrite');
    console.log('Review export: 330 unique lessons, 330 exact recording scripts, pending status, hashes and overwrite protection passed.');
  } finally { fs.rmSync(dir,{recursive:true,force:true}); }
})().catch(e => {console.error(e); process.exitCode=1;});
