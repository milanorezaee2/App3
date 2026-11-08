#!/usr/bin/env node
// Produce an unreviewed, version-bound handoff; this is not a certification.
const {build} = require('esbuild');
const {createHash} = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const sha256 = value => createHash('sha256').update(value, 'utf8').digest('hex');

async function buildRecords() {
  const result = await build({
    stdin: {
      contents: "export {topicDeepeningModules} from './lib/languages/topicDeepening'; export {getB1Curriculum} from './lib/languages/b1Curriculum'; export {getB2Curriculum} from './lib/languages/b2Curriculum';",
      resolveDir: root, loader: 'ts',
    }, bundle: true, platform: 'node', format: 'cjs', write: false,
  });
  const module = {exports: {}};
  vm.runInNewContext(result.outputFiles[0].text, {module, exports: module.exports, require, console}, {filename: 'review-bundle.cjs'});
  const {topicDeepeningModules, getB1Curriculum, getB2Curriculum} = module.exports;
  const records = [];
  for (const item of topicDeepeningModules) for (const language of ['fr', 'de', 'es']) {
    const sections = (item.level === 'b1' ? getB1Curriculum : getB2Curriculum)(language);
    const curriculumTitle = sections.find(s => s.id === item.section)?.topics.find(t => t.number === item.number)?.title;
    if (!curriculumTitle) throw new Error(`Missing syllabus: ${item.id}/${language}`);
    // Hash exactly what the reviewer sees, including the answer and evidence for this language.
    const content = {
      level: item.level, section: item.section, number: item.number, id: item.id,
      language, curriculumTitle, title: item.title, passage: item.passage[language],
      questions: item.questions.map(q => ({prompt: q.prompt, choices: q.choices, correctIndex: q.correctIndex, explanation: q.explanation, evidence: q.evidence[language]})),
      notes: item.notes[language], speaking: item.speaking, writing: item.writing,
      steps: item.steps, model: item.model[language],
    };
    records.push({key: `${language}:${item.level}:${item.section}:${item.number}:${item.id}`,
      contentSha256: sha256(JSON.stringify(content)), passageSha256: sha256(content.passage), content});
  }
  records.sort((a,b) => a.key.localeCompare(b.key, 'en'));
  if (records.length !== 330 || new Set(records.map(r => r.key)).size !== 330) throw new Error('Expected 330 unique localized lessons');
  return records;
}

const tsv = value => String(value).replace(/[\t\r\n]/g, ' ');
async function main() {
  const output = process.argv[2];
  if (!output) throw new Error('Usage: node scripts/export-b1-b2-human-review.cjs OUTPUT_DIRECTORY (must be new or empty)');
  const dir = path.resolve(output);
  if (dir === root || dir === path.parse(dir).root) throw new Error('Choose a dedicated output directory');
  if (fs.existsSync(dir) && fs.readdirSync(dir).length) throw new Error('Output directory is not empty; refusing to overwrite review work');
  const records = await buildRecords();
  fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(path.join(dir, 'lessons.json'), JSON.stringify({schema: 'b1-b2-human-review-v1', notice: 'Unreviewed; hashes identify a content snapshot, not an approval.', records}, null, 2) + '\n');
  const header = ['key','content_sha256','passage_sha256','content_review','review_reference','recording_status','recording_reference','rights_reference','audio_sha256','notes'];
  const rows = records.map(r => [r.key,r.contentSha256,r.passageSha256,'pending','','pending','','','',''].map(tsv).join('\t'));
  fs.writeFileSync(path.join(dir, 'tracking.tsv'), header.join('\t') + '\n' + rows.join('\n') + '\n');
  for (const language of ['fr', 'de', 'es']) {
    const items = records.filter(r => r.content.language === language);
    const lines = [`# Recording scripts: ${language.toUpperCase()}`, '', '> Drafts, not approved transcripts. Obtain an independent review before recording. Each passage is read as written; a hash identifies the exact UTF-8 text.', ''];
    for (const r of items) lines.push(`## ${r.key}`, '', `Passage SHA-256: ${r.passageSha256}`, '', r.content.passage, '');
    fs.writeFileSync(path.join(dir, `recording-scripts-${language}.md`), lines.join('\n'));
  }
  console.log(`Exported ${records.length} unreviewed records and recording scripts to ${dir}`);
}
if (require.main === module) main().catch(error => {console.error(error.message); process.exitCode = 1;});
module.exports = {buildRecords, sha256};
