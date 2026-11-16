#!/usr/bin/env node
/**
 * Batch offline renderer — no API key, no network, no payment.
 *
 *   node scripts/content/renderOfflineAudio.mjs --scope all --workers 8
 *   node scripts/content/renderOfflineAudio.mjs --scope pilot --workers 8
 *
 * Reads the published packs, renders one MP3 per sentence into content-packs/audio/<lang>/, then
 * writes the public URL into each sentence's `audio` field. A pool of warm Node workers keeps the
 * WASM engine loaded, so 15 000 sentences take minutes rather than hours. Existing MP3s are reused.
 * Run `finalizeAudioPacks.mjs` afterwards to bump versions and rebuild the manifest.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve('content-packs');
const argv = process.argv.slice(2);
const arg = (name, fallback) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : fallback; };
const scope = arg('--scope', 'pilot');
const workers = Number(arg('--workers', Math.max(2, Math.min(8, os.cpus().length))));
const base = (arg('--base', '') || 'https://doagwkssxtxseuavrxnr.supabase.co/storage/v1/object/public/content-packs/audio').replace(/\/$/, '');
const bands = scope === 'all' ? ['pre', 'A1', 'A2', 'B1', 'B2', 'C1'] : ['pre', 'A1'];

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const packs = manifest.packs.filter(p => bands.includes(p.band));
const tasks = [];
for (const entry of packs) {
  const file = path.join(root, entry.path);
  const pack = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const sentence of pack.sentences) {
    tasks.push({
      file, id: sentence.id, lang: pack.language, text: sentence.text,
      out: path.join(root, 'audio', pack.language, `${sentence.id}.mp3`),
    });
  }
}
console.log(`scope=${scope} · ${packs.length} packs · ${tasks.length} sentences · ${workers} workers`);
if (!tasks.length) process.exit(0);

// Round-robin chunks keep every worker busy and avoid one huge language blocking the pool.
const chunks = Array.from({ length: workers }, () => []);
tasks.forEach((task, i) => chunks[i % workers].push(task));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'milo-tts-'));
const chunkFiles = chunks.map((chunk, i) => {
  const file = path.join(tmp, `chunk-${i}.json`);
  fs.writeFileSync(file, JSON.stringify(chunk));
  return file;
});
const results = await Promise.all(chunkFiles.map(file => new Promise(resolve => {
  const child = spawn(process.execPath, [path.join(here, 'offlineTtsWorker.mjs'), file], { stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout.on('data', d => process.stdout.write(d));
  child.stderr.on('data', d => process.stderr.write(d));
  child.on('exit', code => resolve(code ?? 1));
})));
fs.rmSync(tmp, { recursive: true, force: true });

// Link the recordings that actually exist (a failed synthesis must not get a broken URL).
const byFile = new Map();
for (const task of tasks) {
  if (!fs.existsSync(task.out)) continue;
  if (!byFile.has(task.file)) byFile.set(task.file, new Map());
  byFile.get(task.file).set(task.id, `${base}/${task.lang}/${task.id}.mp3`);
}
let linked = 0;
for (const [file, urls] of byFile) {
  const pack = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const sentence of pack.sentences) {
    const url = urls.get(sentence.id);
    if (url) { sentence.audio = url; linked++; }
  }
  fs.writeFileSync(file, JSON.stringify(pack, null, 1) + '\n');
}
const failedWorkers = results.filter(code => code !== 0).length;
console.log(`linked ${linked}/${tasks.length} recordings · ${failedWorkers} worker(s) reported failures`);
if (linked < tasks.length) { console.error('some recordings are missing; do not publish'); process.exit(1); }
