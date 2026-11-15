#!/usr/bin/env node
/**
 * Single-sentence offline TTS (no API key). Usage:
 *   node scripts/content/offlineTts.mjs de "Guten Morgen" out.mp3
 *
 * This is the `--provider` command for renderAudio.mjs. For thousands of sentences use the much
 * faster batch renderer `renderOfflineAudio.mjs` instead — it keeps the WASM module warm in a pool.
 */
import fs from 'node:fs';
import path from 'node:path';
import { renderMp3 } from './offlineTtsCore.mjs';

const [, , lang, text, out] = process.argv;
if (!lang || !text || !out) { console.error('usage: offlineTts.mjs <lang> <text> <out.mp3>'); process.exit(2); }
const mp3 = await renderMp3(lang, text);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, mp3);
console.log(`${lang} → ${out} (${mp3.length} bytes, offline)`);
