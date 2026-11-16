/**
 * Final acceptance report: readiness of the bundled course + every published pack.
 *
 * Usage: npx tsx scripts/content/reportReadiness.ts [--target 90] [--write]
 * Exits non-zero if any band's readiness is below the target.
 */
import fs from 'node:fs';
import path from 'node:path';
import { CEFR_BANDS, bandOfLevel, type CefrBand } from '@/lib/content/courseSpec';
import { courseReadiness } from '@/lib/content/courseAudit';
import { computeReadiness, type AuditLesson, type CourseLanguage } from '@/lib/content/readiness';
import { lessonsOf } from './courses';

const argv = process.argv.slice(2);
const targetArg = argv.indexOf('--target');
const TARGET = targetArg >= 0 ? Number(argv[targetArg + 1]) || 90 : 90;
const write = argv.includes('--write');
const LANGS: CourseLanguage[] = ['en', 'de', 'fr', 'es', 'tr', 'ru'];
const levelIdFor: Record<CefrBand, number> = { pre: -1, A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };

function publishedPacks(lang: CourseLanguage): AuditLesson[] {
  const dir = path.join('content-packs', lang);
  const out: AuditLesson[] = [];
  if (!fs.existsSync(dir)) return out;
  const newest = new Map<string, string>();
  for (const file of fs.readdirSync(dir)) {
    const m = file.match(/^(pre|A1|A2|B1|B2|C1)\.v(\d+)\.json$/);
    if (!m) continue;
    const have = newest.get(m[1]);
    if (!have || Number(m[2]) > Number(have.match(/v(\d+)/)![1])) newest.set(m[1], file);
  }
  for (const file of newest.values()) {
    const pack = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (!pack.sentences?.length) continue;
    out.push({
      id: `pack:${pack.band}`, levelId: levelIdFor[pack.band as CefrBand], title: 'pack',
      sentences: pack.sentences.map((s: { text: string; pattern?: string }) => ({ text: s.text, pattern: s.pattern })),
      hasDialogue: false, checks: 0,
    });
  }
  return out;
}

interface Row { lang: CourseLanguage; band: CefrBand; lessons: number; structure: number; coverage: number; readiness: number }
const rows: Row[] = [];
for (const lang of LANGS) {
  const shipped = lessonsOf(lang);
  // Exactly the same computation the app's readiness UI performs: bundled lessons + the bundled
  // vocabulary index of the published packs. No synthetic pack lessons inflate `structure`.
  const after = courseReadiness(lang, shipped, true);
  for (const band of CEFR_BANDS) {
    const b = after.bands.find(x => x.band === band)!;
    const own = shipped.filter(l => bandOfLevel(l.levelId) === band).length;
    rows.push({ lang, band, lessons: own, structure: b.structure, coverage: b.coverage, readiness: b.readiness });
  }
  void publishedPacks;
}
const min = Math.min(...rows.map(r => r.readiness));
const lines: string[] = [
  '', '## Final readiness (bundled lessons + published packs)', '',
  `Computed by \`scripts/content/reportReadiness.ts\` with the **same \`courseReadiness()\` call the app's UI uses** (bundled lessons + the bundled vocabulary index of the published packs). Readiness is \`min(structure, coverage)\`; target **≥${TARGET}%** for every band of every language.`, '',
  '| Language | Band | Lessons | Structure | Coverage | Readiness |', '|---|---|---:|---:|---:|---:|',
  ...rows.map(r => `| ${r.lang} | ${r.band} | ${r.lessons} | ${r.structure}% | ${r.coverage}% | **${r.readiness}%** |`),
  '', `**Minimum readiness: ${min}% (${rows.length} bands).** ${min >= TARGET ? '✓ target met' : '✗ target missed'}`, '',
];
if (write) {
  const doc = path.resolve('docs/readiness-uplift.md');
  const previous = fs.readFileSync(doc, 'utf8');
  const marker = '## Final readiness';
  const head = previous.includes(marker) ? previous.slice(0, previous.indexOf(marker)) : previous + '\n';
  fs.writeFileSync(doc, head + lines.join('\n'));
}
console.log(`minimum readiness ${min}% across ${rows.length} bands (target ${TARGET}%)`);
for (const r of rows.filter(r => r.readiness < TARGET)) console.error(`below target: ${r.lang}/${r.band} ${r.readiness}%`);
if (min < TARGET) process.exit(1);
