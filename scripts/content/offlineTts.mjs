#!/usr/bin/env node
/**
 * Fully OFFLINE text-to-speech. No account, no API key, no payment, no sanctioned endpoint.
 *
 *   node scripts/content/offlineTts.mjs de "Guten Morgen" out.mp3
 *
 * Engines (auto-selected, best available first):
 *   1. Piper  — neural ONNX voice, natural sounding. Needs `piper` on PATH and a public voice model;
 *              set PIPER_MODEL_<LANG> (e.g. PIPER_MODEL_DE=/tmp/voices/de.onnx) or TTS_ENGINE=piper.
 *              Models are open/public and need NO token to download.
 *   2. eSpeak NG (WASM) — deterministic, tiny, six languages, always available. Robotic but
 *              intelligible, and identical on every device.
 *
 * WAV → MP3 is done in pure JS (lamejs), so no ffmpeg/system packages are needed. Dependencies are
 * installed with `npm i --no-save espeak-ng@1.0.2 lamejs@1.2.1` (the CI workflow does this).
 *
 * This file is the `--provider` command for renderAudio.mjs:
 *   --provider "node scripts/content/offlineTts.mjs {lang} {text} {out}"
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const [, , lang, text, out] = process.argv;
if (!lang || !text || !out) { console.error('usage: offlineTts.mjs <lang> <text> <out.mp3>'); process.exit(2); }

const require = createRequire(import.meta.url);
const ESPEAK_VOICE = { en: 'en-us', de: 'de', fr: 'fr', es: 'es', tr: 'tr', ru: 'ru' };
const modelPath = process.env[`PIPER_MODEL_${lang.toUpperCase()}`] || process.env.PIPER_MODEL || '';
const forceEspeak = process.env.TTS_ENGINE === 'espeak';

function mp3FromWav(wav) {
  // Parse RIFF chunks rather than assuming a 44-byte header (Piper adds extra chunks).
  let pos = 12, fmt = null, data = null;
  while (pos + 8 <= wav.length) {
    const id = wav.toString('ascii', pos, pos + 4);
    const size = wav.readUInt32LE(pos + 4);
    if (id === 'fmt ') fmt = { channels: wav.readUInt16LE(pos + 10), rate: wav.readUInt32LE(pos + 12), bits: wav.readUInt16LE(pos + 22) };
    if (id === 'data') { data = { offset: pos + 8, length: size }; break; }
    pos += 8 + size + (size % 2);
  }
  if (!fmt || !data || fmt.bits !== 16) throw new Error('unsupported WAV (expected 16-bit PCM)');
  const count = Math.floor(data.length / 2);
  const samples = (data.offset % 2 === 0)
    ? new Int16Array(wav.buffer, wav.byteOffset + data.offset, count)
    : Int16Array.from({ length: count }, (_, i) => wav.readInt16LE(data.offset + i * 2));

  // lamejs's bundled build attaches Mp3Encoder to a global; run it in the current context.
  const lameFile = require.resolve('lamejs/lame.min.js');
  vm.runInThisContext(fs.readFileSync(lameFile, 'utf8'));
  const lamejs = globalThis.lamejs;
  if (!lamejs?.Mp3Encoder) throw new Error('lamejs failed to initialise');
  const encoder = new lamejs.Mp3Encoder(fmt.channels, fmt.rate, Number(process.env.TTS_BITRATE || 48));
  const chunks = [];
  for (let i = 0; i < samples.length; i += 1152) {
    const block = encoder.encodeBuffer(samples.subarray(i, i + 1152));
    if (block.length) chunks.push(Buffer.from(block));
  }
  const tail = encoder.flush();
  if (tail.length) chunks.push(Buffer.from(tail));
  return Buffer.concat(chunks);
}

async function withPiper() {
  if (forceEspeak || !modelPath || !fs.existsSync(modelPath)) return null;
  const wavPath = `${out}.wav`;
  try {
    execFileSync('piper', ['--model', modelPath, '--output_file', wavPath], {
      input: text, encoding: 'utf8', stdio: ['pipe', 'ignore', 'inherit'], timeout: 120000,
    });
    const wav = fs.readFileSync(wavPath);
    return mp3FromWav(wav);
  } catch (error) {
    console.error(`piper unavailable for ${lang}, falling back to eSpeak NG: ${error.message}`);
    return null;
  } finally {
    if (fs.existsSync(wavPath)) fs.rmSync(wavPath);
  }
}

async function withEspeak() {
  const { default: ESpeakNG } = await import('espeak-ng');
  const espeak = await ESpeakNG({ arguments: ['-w', 'out.wav', '-v', ESPEAK_VOICE[lang] || 'en-us', text] });
  const wav = Buffer.from(espeak.FS.readFile('out.wav'));
  return mp3FromWav(wav);
}

const mp3 = (await withPiper()) || (await withEspeak());
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, mp3);
console.log(`${lang} → ${out} (${mp3.length} bytes, offline)`);
