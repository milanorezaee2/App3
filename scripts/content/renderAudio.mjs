#!/usr/bin/env node
/**
 * Renders one recording per pack sentence with a TTS command of your choice and writes the public URL
 * into the pack. Usage:
 *   node scripts/content/renderAudio.mjs content-packs/de/A2.v1.json --provider "./tts.sh {lang} {text} {out}" --base https://<project>.supabase.co/storage/v1/object/public/content-packs/audio
 * The provider command is a template; {lang} {text} {out} are substituted (text is shell-quoted).
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const [file, ...rest] = process.argv.slice(2);
const arg = (name, fallback) => { const i = rest.indexOf(name); return i >= 0 ? rest[i + 1] : fallback; };
const provider = arg('--provider'); const base = arg('--base', '');
if (!file || !provider) { console.error('usage: renderAudio.mjs <pack.json> --provider "<cmd {lang} {text} {out}>" [--base <public url>]'); process.exit(2); }
const pack = JSON.parse(fs.readFileSync(file, 'utf8'));
const outDir = path.join('content-packs', 'audio', pack.language); fs.mkdirSync(outDir, { recursive: true });
let done = 0;
for (const s of pack.sentences) {
  const out = path.join(outDir, `${s.id}.mp3`);
  if (!fs.existsSync(out)) {
    const cmd = provider.replace('{lang}', pack.language).replace('{text}', JSON.stringify(s.text)).replace('{out}', out);
    try { execSync(cmd, { stdio: 'inherit' }); } catch { console.error(`failed: ${s.id}`); continue; }
  }
  s.audio = `${base.replace(/\/$/, '')}/${pack.language}/${s.id}.mp3`; done++;
}
fs.writeFileSync(file, JSON.stringify(pack, null, 1));
console.log(`${done}/${pack.sentences.length} recordings linked`);
