/** Quality gates for a content pack. Usage: npx tsx scripts/content/validatePack.ts <pack.json> */
import fs from 'node:fs';
import path from 'node:path';
import { COURSE_SPEC, CEFR_BANDS, type CefrBand } from '@/lib/content/courseSpec';
import { FREQUENCY } from '@/lib/content/courseAudit';
import { computeReadiness, tokenize } from '@/lib/content/readiness';
import { isValidPack, type ContentPack } from '@/lib/content/packs';
import { lessonsOf } from './courses';

const file = process.argv[2];
if (!file) { console.error('pack path required'); process.exit(2); }
const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as unknown;
if (!isValidPack(raw)) { console.error('✗ not a valid ContentPack (schema/fields)'); process.exit(1); }
const pack = raw as ContentPack;
const errors: string[] = [];
const name = path.basename(file);
const m = name.match(/^(pre|A1|A2|B1|B2|C1)\.v(\d+)\.json$/);
if (!m) errors.push(`file name must be <band>.v<N>.json, got ${name}`);
else { if (m[1] !== pack.band) errors.push(`band in file name (${m[1]}) ≠ pack.band (${pack.band})`); if (Number(m[2]) !== pack.version) errors.push(`version in file name ≠ pack.version`); }
if (path.basename(path.dirname(file)) !== pack.language) errors.push(`folder (${path.basename(path.dirname(file))}) ≠ pack.language (${pack.language})`);
if (!CEFR_BANDS.includes(pack.band)) errors.push(`unknown band ${pack.band}`);

const spec = COURSE_SPEC[pack.band as CefrBand];
const frequency = FREQUENCY[pack.language];
const rank = new Map<string, number>(); frequency.forEach((w, i) => { if (!rank.has(w)) rank.set(w, i + 1); });
const shipped = lessonsOf(pack.language);
const shippedTexts = new Set(shipped.flatMap(l => l.sentences.map(s => norm(s.text))));
const shippedIds = new Set(shipped.map(l => l.id));
const seenTexts = new Set<string>(); const seenIds = new Set<string>();
const [minLen, maxLen] = pack.band === 'pre' || pack.band === 'A1' ? [3, 9] : [3, 14];
const taughtStems = new Set(shipped.filter(l => CEFR_BANDS.indexOf(bandOf(l.levelId)) <= CEFR_BANDS.indexOf(pack.band)).flatMap(l => l.sentences.flatMap(s => tokenize(s.text))));

const fold = (w: string) => w.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
function norm(t: string) { return tokenize(t).join(' '); }
function bandOf(levelId: number): CefrBand { return levelId <= -1 ? 'pre' : levelId <= 1 ? 'A1' : levelId === 2 ? 'A2' : levelId === 3 ? 'B1' : levelId === 4 ? 'B2' : 'C1'; }
function stemEq(a: string, b: string) { return a === b || (a.length >= 5 && b.length >= 5 && a.slice(0, 5) === b.slice(0, 5) && Math.abs(a.length - b.length) <= 3); }

for (const s of pack.sentences) {
  const where = `[${s.id}] "${s.text}"`;
  if (seenIds.has(s.id)) errors.push(`${where}: duplicate id`); seenIds.add(s.id);
  const words = tokenize(s.text);
  if (words.length < minLen || words.length > maxLen) errors.push(`${where}: ${words.length} words (allowed ${minLen}–${maxLen})`);
  const n = norm(s.text);
  if (shippedTexts.has(n)) errors.push(`${where}: already in the shipped course`);
  if (seenTexts.has(n)) errors.push(`${where}: duplicate inside the pack`); seenTexts.add(n);
  if (!s.fa.trim() || norm(s.fa) === n) errors.push(`${where}: Persian missing`);
  const rawWords = s.text.split(/\s+/);
  const above = words.filter((w, i) => {
    const r = rank.get(w);
    const original = rawWords.find(x => tokenize(x)[0] === w) ?? '';
    const proper = i > 0 && /^\p{Lu}/u.test(original) && pack.language !== 'de';
    const taught = taughtStems.has(w) || [...taughtStems].some(t => stemEq(t, w));
    return !proper && !taught && (r === undefined || r > spec.vocabularyCeiling);
  });
  if (above.length > 1) errors.push(`${where}: ${above.length} words above the ${pack.band} ceiling / not taught yet: ${above.join(', ')} (max 1)`);
  if (!Array.isArray(s.targetWords) || !s.targetWords.length) errors.push(`${where}: targetWords missing`);
  else for (const t of s.targetWords) { const parts = tokenize(t); if (!parts.every(part => words.some(w => stemEq(fold(w), fold(part))))) errors.push(`${where}: target word "${t}" not in sentence`); }
  if (s.lesson && !shippedIds.has(s.lesson)) errors.push(`${where}: lesson "${s.lesson}" does not exist`);
}

// Value: how much coverage this pack adds to its band.
const before = computeReadiness(pack.language, shipped, frequency).bands.find(b => b.band === pack.band)!;
const levelIdFor: Record<CefrBand, number> = { pre: -1, A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };
const after = computeReadiness(pack.language, [...shipped, { id: `pack:${pack.band}`, levelId: levelIdFor[pack.band], title: 'pack', sentences: pack.sentences.map(s => ({ text: s.text, pattern: s.pattern })), hasDialogue: false, checks: 0 }], frequency).bands.find(b => b.band === pack.band)!;

console.log(`${pack.language}/${pack.band} v${pack.version}: ${pack.sentences.length} sentences · coverage ${before.coverage}% → ${after.coverage}% (${before.coveredWords} → ${after.coveredWords} of ${before.vocabularyCeiling})`);
if (errors.length) { console.error(`✗ ${errors.length} violation(s):\n- ${errors.join('\n- ')}`); process.exit(1); }
console.log('✓ all quality gates passed');
