#!/usr/bin/env node
/**
 * After `renderAudio.mjs` has written audio URLs into packs, bump their version (the app caches by
 * version, so an unchanged version would never re-download), drop the old file, and rebuild the
 * manifest. Pure Node — no aliases, no dependencies.
 *
 * Usage: node scripts/content/finalizeAudioPacks.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('content-packs');
const NAME = /^(pre|A1|A2|B1|B2|C1)\.v(\d+)\.json$/;
let bumped = 0;

for (const lang of fs.readdirSync(root)) {
  const dir = path.join(root, lang);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const file of fs.readdirSync(dir)) {
    const m = file.match(NAME);
    if (!m) continue;
    const full = path.join(dir, file);
    const pack = JSON.parse(fs.readFileSync(full, 'utf8'));
    if (!pack.sentences?.some(s => s.audio)) continue;
    const next = Number(pack.version) + 1;
    pack.version = next;
    const target = path.join(dir, `${m[1]}.v${next}.json`);
    fs.writeFileSync(target, JSON.stringify(pack, null, 1) + '\n');
    fs.rmSync(full);
    bumped++;
    console.log(`${lang}: ${file} → ${path.basename(target)} (${pack.sentences.length} sentences)`);
  }
}

// Rebuild the manifest from the newest version of each band, exactly like buildManifest.ts.
const packs = [];
for (const lang of fs.readdirSync(root)) {
  const dir = path.join(root, lang);
  if (!fs.statSync(dir).isDirectory()) continue;
  const newest = new Map();
  for (const file of fs.readdirSync(dir)) {
    const m = file.match(NAME);
    if (!m) continue;
    const have = newest.get(m[1]);
    if (!have || Number(m[2]) > Number(have.match(NAME)[2])) newest.set(m[1], file);
  }
  for (const [band, file] of newest) {
    const pack = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    packs.push({ language: lang, band, version: pack.version, path: `${lang}/${file}`, sentences: pack.sentences.length });
  }
}
fs.writeFileSync(path.join(root, 'manifest.json'), JSON.stringify({ schema: 1, packs }, null, 2) + '\n');
console.log(`manifest.json: ${packs.length} pack(s), ${bumped} version bump(s)`);
