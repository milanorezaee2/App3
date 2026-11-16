/**
 * One command for the whole English Pre-A1 level: content, checks, and the display contract.
 *
 *   npx tsx scripts/content/auditPreA1.ts      (or bundle it with esbuild, as CI does)
 *
 * It fails loudly for every defect the rev-117 review found: foreign scripts, filler repeats,
 * patterns that only echo their own sentence, vocabulary that is absent from its sentence,
 * a beginner being asked to type, a missing listening check, or the level card disagreeing
 * with the engine blueprint. Everything is measured on the real shipped data.
 */
import { SENTENCE_LESSONS, COURSE_LEVELS } from '@/lib/courseContent';
import { ENGLISH_ENGINE_BLUEPRINT } from '@/lib/englishLearningEngine';
import { CORE_LESSON_EVIDENCE } from '@/lib/englishFoundationEvidence';
import { isCorrect } from '@/lib/englishSupplement/content';
import { scoreSpeech } from '@/lib/speechScore';

const pre = (SENTENCE_LESSONS as any[]).filter(l => l.levelId === -1);
const cyr = /[\u0400-\u04ff]/, cjk = /[\u3040-\u30ff\u4e00-\u9fff]/, persian = /[\u0600-\u06FF]/;
const latin = /^[\p{Script=Latin}\p{N}\s.,!?'’\-–:;()]+$/u;
const problems: string[] = [];
const ids = new Set<string>(); const sentences = new Set<string>();

for (const l of pre) {
  if (!l.teachingFa) problems.push(`${l.id}: no teaching note`);
  if (l.dialogue.length !== 4) problems.push(`${l.id}: ${l.dialogue.length} dialogue turns`);
  if (l.sentences.length !== 8) problems.push(`${l.id}: ${l.sentences.length} sentences`);
  const tasks = CORE_LESSON_EVIDENCE[l.id] ?? [];
  if (tasks.length !== 4) problems.push(`${l.id}: ${tasks.length} checks`);
  if (!tasks.some(t => t.skill === 'listening' && t.audio)) problems.push(`${l.id}: no listening check`);
  for (const t of tasks) {
    if (!(t as any).options) problems.push(`${l.id}/${t.id}: typing task at Pre-A1`);
    if (!isCorrect(t as any, t.answers[0])) problems.push(`${l.id}/${t.id}: own answer rejected`);
  }
  for (const s of l.sentences) {
    if (ids.has(s.id)) problems.push(`duplicate id ${s.id}`); ids.add(s.id);
    const key = s.en.toLowerCase().replace(/[.!?]/g, '').trim();
    if (sentences.has(key)) problems.push(`duplicate sentence «${s.en}»`); sentences.add(key);
    if (!latin.test(s.en)) problems.push(`${l.id}: non-Latin «${s.en}»`);
    if (cyr.test(s.pronunciation + s.fa) || cjk.test(s.pronunciation + s.fa)) problems.push(`${l.id}: foreign script`);
    if (!persian.test(s.pronunciation)) problems.push(`${l.id}: respelling not Persian «${s.pronunciation}»`);
    if (s.pattern && s.pattern.replace(/[.!?]/g, '').toLowerCase() === key) problems.push(`${l.id}: pattern repeats sentence`);
    for (const v of s.vocabulary) if (!s.en.toLowerCase().includes(v.word.toLowerCase())) problems.push(`${l.id}: «${v.word}» absent`);
    const heard = scoreSpeech(s.en, s.en).score;
    if (heard !== 100) problems.push(`${l.id}: recogniser cannot score «${s.en}» (${heard}%)`);
  }
}
if (JSON.stringify(COURSE_LEVELS[0].modules) !== JSON.stringify(ENGLISH_ENGINE_BLUEPRINT[0].modules)) problems.push('level card and blueprint disagree');

console.log(`Pre-A1: ${pre.length} lessons · ${pre.reduce((n, l) => n + l.sentences.length, 0)} sentences · ${pre.reduce((n, l) => n + (CORE_LESSON_EVIDENCE[l.id]?.length ?? 0), 0)} checks`);
if (problems.length) {
  console.error(`PROBLEMS:\n${problems.join('\n')}`);
  process.exit(1);
}
console.log('ALL PRE-A1 CHECKS PASS');
