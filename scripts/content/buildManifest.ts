/** Writes content-packs/manifest.json listing the newest version of every pack. */
import fs from 'node:fs';
import path from 'node:path';
import { isValidPack, type PackManifest } from '@/lib/content/packs';

const root = path.resolve('content-packs');
const packs: PackManifest['packs'] = [];
for (const lang of fs.readdirSync(root)) {
  const dir = path.join(root, lang);
  if (!fs.statSync(dir).isDirectory()) continue;
  const newest = new Map<string, { version: number; file: string; sentences: number }>();
  for (const file of fs.readdirSync(dir)) {
    const m = file.match(/^(pre|A1|A2|B1|B2|C1)\.v(\d+)\.json$/); if (!m) continue;
    const pack = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')) as unknown;
    if (!isValidPack(pack)) { console.error(`skipping invalid pack ${lang}/${file}`); continue; }
    const have = newest.get(m[1]);
    if (!have || have.version < Number(m[2])) newest.set(m[1], { version: Number(m[2]), file, sentences: pack.sentences.length });
  }
  for (const [band, info] of newest) packs.push({ language: lang as PackManifest['packs'][number]['language'], band: band as PackManifest['packs'][number]['band'], version: info.version, path: `${lang}/${info.file}`, sentences: info.sentences });
}
const manifest: PackManifest = { schema: 1, packs };
fs.writeFileSync(path.join(root, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`manifest.json: ${packs.length} pack(s)`); for (const p of packs) console.log(`  ${p.language}/${p.band} v${p.version} · ${p.sentences} sentences`);
