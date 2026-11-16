/**
 * Bundles a compact vocabulary index of the published content packs.
 *
 * The app computes readiness synchronously from its bundled lesson data, while pack sentences are
 * downloaded asynchronously. Without an index the readiness UI would under-report the course by
 * ignoring the packs. This file lists, per language and band, the words the published packs add;
 * `courseReadiness` unions them into the same `seen` set as lesson words.
 *
 * Usage: npx tsx scripts/content/genPackCoverage.ts [--write]
 */
import fs from 'node:fs';
import path from 'node:path';
import { CEFR_BANDS, type CefrBand } from '@/lib/content/courseSpec';
import { FREQUENCY } from '@/lib/content/courseAudit';
import { tokenize, type CourseLanguage } from '@/lib/content/readiness';

const LANGS: CourseLanguage[] = ['en', 'de', 'fr', 'es', 'tr', 'ru'];
const write = process.argv.includes('--write');
const root = path.resolve('content-packs');
const index: Record<string, Record<string, string[]>> = {};

for (const lang of LANGS) {
  const rank = new Set(FREQUENCY[lang]);
  const dir = path.join(root, lang);
  const newest = new Map<string, string>();
  if (fs.existsSync(dir)) for (const file of fs.readdirSync(dir)) {
    const m = file.match(/^(pre|A1|A2|B1|B2|C1)\.v(\d+)\.json$/);
    if (!m) continue;
    const have = newest.get(m[1]);
    if (!have || Number(m[2]) > Number(have.match(/v(\d+)/)![1])) newest.set(m[1], file);
  }
  index[lang] = {};
  for (const band of CEFR_BANDS) {
    const words = new Set<string>();
    const file = newest.get(band);
    if (file) {
      const pack = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
      for (const sentence of pack.sentences ?? []) {
        for (const token of tokenize(sentence.text)) if (rank.has(token)) words.add(token);
      }
    }
    index[lang][band] = [...words].sort();
  }
  console.log(`${lang}: ${CEFR_BANDS.map(b => `${b}=${index[lang][b].length}`).join(' ')}`);
}

const out = path.resolve('lib/content/packCoverage.generated.json');
if (write) fs.writeFileSync(out, JSON.stringify(index) + '\n');
console.log(`${write ? 'wrote' : 'preview'} ${out}`);
