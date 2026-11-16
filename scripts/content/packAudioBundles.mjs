#!/usr/bin/env node
/**
 * Bundle the one-MP3-per-sentence render into one MP3 per content pack (36 files instead of 15 243).
 * Each sentence then gets a `milo-segment:` URI with its exact offset/duration inside the bundle.
 * This keeps public hosting on a normal GitHub release (no Supabase secret, no 1000-asset limit).
 *
 *   node scripts/content/packAudioBundles.mjs
 *
 * Run AFTER renderOfflineAudio.mjs and BEFORE finalizeAudioPacks.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('content-packs');
const outDir = path.join(root, 'audio-bundles');
fs.mkdirSync(outDir, { recursive: true });

import { mp3DurationMs } from './mp3Duration.mjs';

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
let totalBytes = 0, totalMs = 0, sentences = 0, bundles = 0;
for (const entry of manifest.packs) {
  const file = path.join(root, entry.path);
  const pack = JSON.parse(fs.readFileSync(file, 'utf8'));
  const bundleName = `${pack.language}-${pack.band}.mp3`;
  if (!pack.sentences.length) { console.log(`${bundleName}: empty pack, skipped`); continue; }
  const chunks = [];
  let offset = 0;
  for (const sentence of pack.sentences) {
    const mp3Path = path.join(root, 'audio', pack.language, `${sentence.id}.mp3`);
    if (!fs.existsSync(mp3Path)) throw new Error(`missing render: ${mp3Path}`);
    const mp3 = fs.readFileSync(mp3Path);
    const ms = Math.max(120, Math.round(mp3DurationMs(mp3)));
    sentence.audio = `milo-segment:${bundleName}?start=${offset}&dur=${ms}`;
    chunks.push(mp3);
    offset += ms;
    sentences++;
  }
  const bundle = Buffer.concat(chunks);
  fs.writeFileSync(path.join(outDir, bundleName), bundle);
  fs.writeFileSync(file, JSON.stringify(pack, null, 1) + '\n');
  totalBytes += bundle.length;
  totalMs += offset;
  bundles++;
  console.log(`${bundleName}: ${pack.sentences.length} sentences · ${(bundle.length / 1048576).toFixed(2)} MB · ${(offset / 1000).toFixed(1)} s`);
}
console.log(`bundles: ${bundles} files · ${sentences} sentences · ${(totalBytes / 1048576).toFixed(1)} MB · ${(totalMs / 60000).toFixed(1)} min speech`);
