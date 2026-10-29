import fs from 'node:fs';
import path from 'node:path';
import { buildSync } from 'esbuild';
import { createRequire } from 'node:module';

const root = process.cwd();
const canonical = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/essential504.json'), 'utf8'));
const bundle = path.join(root, 'node_modules/.cache/course-validation.cjs');
buildSync({ entryPoints: [path.join(root, 'lib/courseContent.ts')], bundle: true, platform: 'node', format: 'cjs', outfile: bundle });
const { SENTENCE_LESSONS, COURSE_LEVELS, COMMUNICATION_COURSE_LESSON_IDS, COMMUNICATION_MODULES } = createRequire(import.meta.url)(bundle);

const normalizeEnglish = text => text.trim().toLowerCase().replace(/[.!?]+$/g, '').replace(/[’']/g, "'").replace(/\s+/g, ' ');
const problems = [];
const tagged = SENTENCE_LESSONS.flatMap(l => l.sentences.flatMap(s => s.vocabulary.filter(v => v.essential504).map(v => v.word)));
const canonicalSet = new Set(canonical);
if (tagged.length !== 504 || new Set(tagged).size !== 504) problems.push(`Canonical 504 coverage must be exactly 504 unique tagged words, found ${tagged.length}/${new Set(tagged).size}.`);
if (tagged.some(w => !canonicalSet.has(w))) problems.push('Tagged words outside canonical 504 list.');
if (canonical.some(w => !tagged.includes(w))) problems.push('Missing canonical 504 words.');

if (SENTENCE_LESSONS.length !== 174) problems.push(`Expected 174 lessons, found ${SENTENCE_LESSONS.length}.`);
const totalSentences = SENTENCE_LESSONS.reduce((a, l) => a + l.sentences.length, 0);
if (totalSentences !== 3862) problems.push(`Expected 3862 sentences, found ${totalSentences}.`);
const orders = SENTENCE_LESSONS.map(l => l.order).sort((a, b) => a - b);
if (JSON.stringify(orders) !== JSON.stringify(Array.from({ length: 174 }, (_, i) => i + 1))) problems.push('Lesson orders must be exactly 1..174.');
if (new Set(SENTENCE_LESSONS.map(l => l.id)).size !== 174) problems.push('Lesson ids must be unique.');

const expectedLevels = [
  { id: 0, cefr: 'A1', lessons: 29, sentences: 1450 },
  { id: 1, cefr: 'A2', lessons: 20, sentences: 1000 },
  { id: 2, cefr: 'B1', lessons: 15, sentences: 750 },
  { id: 3, cefr: 'B2', lessons: 37, sentences: 222 },
  { id: 4, cefr: 'C1', lessons: 37, sentences: 223 },
  { id: 5, cefr: 'C2', lessons: 36, sentences: 217 },
];
if (COURSE_LEVELS.length !== 6) problems.push(`Expected 6 CEFR levels, found ${COURSE_LEVELS.length}.`);
for (const expected of expectedLevels) {
  const level = COURSE_LEVELS.find(l => l.id === expected.id);
  const lessons = SENTENCE_LESSONS.filter(l => l.levelId === expected.id);
  const sentences = lessons.reduce((a, l) => a + l.sentences.length, 0);
  console.log(`${expected.cefr}: ${lessons.length}/${expected.lessons} lessons; ${sentences}/${expected.sentences} sentences; modules=${level?.modules.length}`);
  if (!level || level.cefr !== expected.cefr) problems.push(`Level ${expected.id} must be ${expected.cefr}.`);
  if (lessons.length !== expected.lessons || sentences !== expected.sentences) problems.push(`${expected.cefr} must contain ${expected.lessons} lessons and ${expected.sentences} sentences.`);
  if (!level || level.modules.length !== expected.lessons) problems.push(`${expected.cefr} modules must list one syllabus topic per lesson.`);
}

const allEn = SENTENCE_LESSONS.flatMap(l => l.sentences.map(s => normalizeEnglish(s.en)));
if (new Set(allEn).size !== allEn.length) problems.push('All English sentences must be globally unique.');
for (const lesson of SENTENCE_LESSONS) {
  if (!lesson.title || !lesson.subtitle || !lesson.situation) problems.push(`Lesson ${lesson.id} is missing title/subtitle/situation.`);
  if (new Set(lesson.sentences.map(s => s.id)).size !== lesson.sentences.length) problems.push(`Lesson ${lesson.id} has duplicate sentence ids.`);
  if (new Set(lesson.sentences.map(s => normalizeEnglish(s.en))).size !== lesson.sentences.length) problems.push(`Lesson ${lesson.id} has duplicate sentences.`);
  if (new Set(lesson.dialogue.map(d => d.text.trim().toLowerCase())).size !== lesson.dialogue.length) problems.push(`Lesson ${lesson.id} has duplicate dialogue lines.`);
  for (const s of lesson.sentences) {
    if (!s.en?.trim() || !s.fa?.trim() || !s.pronunciation?.trim() || !s.pattern?.trim()) problems.push(`Sentence ${lesson.id}:${s.id} must have en/fa/pronunciation/pattern.`);
    if (!s.vocabulary.length) problems.push(`Sentence ${lesson.id}:${s.id} must have linked vocabulary.`);
    for (const v of s.vocabulary) if (!v.word || !v.meaning || !s.en.toLowerCase().includes(v.word.toLowerCase())) problems.push(`Vocabulary ${v.word} in ${lesson.id}:${s.id} is not linked to its sentence.`);
  }
}
// Communication lessons keep their stable ids and thematic-unit metadata.
const commIds = new Set(COMMUNICATION_COURSE_LESSON_IDS);
const commLessons = SENTENCE_LESSONS.filter(l => commIds.has(l.id));
if (commLessons.length !== 15 || commLessons.some(l => !l.unitId || !l.unitTitle || !l.unitTitleEn)) problems.push('Communication lessons must retain their ids and unit metadata.');
if (COMMUNICATION_MODULES.length !== 8) problems.push('Communication structure must retain 8 thematic units.');

console.log(`Lessons: ${SENTENCE_LESSONS.length}/174; sentences: ${totalSentences}/3862`);
console.log(`Canonical 504 coverage: ${tagged.length}/504`);
if (problems.length) { problems.forEach(p => console.error(p)); process.exit(1); }
console.log('Curriculum integrity: PASS');
