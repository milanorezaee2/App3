/** Converts a pipe-delimited draft into a pack file. Usage: npx tsx scripts/content/buildPack.ts <draft.txt> <lang> <band> <version> ["source note"] */
import fs from 'node:fs';
import path from 'node:path';
import type { ContentPack, PackSentence } from '@/lib/content/packs';

const [, , draft, lang, band, versionArg, source = 'factory v1 · automatic gates · 10% sample review'] = process.argv;
if (!draft || !lang || !band || !versionArg) { console.error('usage: buildPack.ts <draft.txt> <lang> <band> <version>'); process.exit(2); }
const lines = fs.readFileSync(draft, 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
const sentences: PackSentence[] = lines.map((line, i) => {
  const [targets, text, fa, pattern, extra = ''] = line.split('|').map(s => s.trim());
  // 5th column: `lesson:<id>` pins the sentence to a lesson; anything else is a pronunciation hint.
  const lesson = extra.startsWith('lesson:') ? extra.slice(7) : '';
  const pronunciation = !extra.startsWith('lesson:') && extra ? extra : undefined;
  return { id: `${lang}-${band.toLowerCase()}-${String(i + 1).padStart(3, '0')}`, text, fa, ...(pronunciation ? { pronunciation } : {}), pattern: pattern || undefined, targetWords: targets.split(',').map(s => s.trim()).filter(Boolean), ...(lesson ? { lesson } : {}) };
});
const pack: ContentPack = { schema: 1, language: lang as ContentPack['language'], band: band as ContentPack['band'], version: Number(versionArg), generatedAt: new Date().toISOString().slice(0, 10), source, sentences };
const out = path.join('content-packs', lang, `${band}.v${versionArg}.json`);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(pack, null, 1));
console.log(`${out}: ${sentences.length} sentences`);
