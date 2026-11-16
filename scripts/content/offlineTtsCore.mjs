#!/usr/bin/env node
/**
 * Shared engine for the offline TTS tools. No key, no network, no system packages.
 * `renderMp3(lang, text)` returns an MP3 Buffer. Piper (optional public ONNX model) is preferred
 * when available; eSpeak NG (WASM) is the guaranteed fallback. WAV → MP3 uses pure-JS lamejs.
 */
import fs from 'node:fs';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ESPEAK_VOICE = { en: 'en-us', de: 'de', fr: 'fr', es: 'es', tr: 'tr', ru: 'ru' };

let lamejs = null;
function encoder() {
  if (lamejs) return lamejs;
  // The bundled lamejs build attaches Mp3Encoder to a global; evaluate it in this context.
  const file = require.resolve('lamejs/lame.min.js');
  vm.runInThisContext(fs.readFileSync(file, 'utf8'));
  lamejs = globalThis.lamejs;
  if (!lamejs?.Mp3Encoder) throw new Error('lamejs failed to initialise');
  return lamejs;
}

export function mp3FromWav(wav) {
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
  const lame = encoder();
  const enc = new lame.Mp3Encoder(fmt.channels, fmt.rate, Number(process.env.TTS_BITRATE || 48));
  const chunks = [];
  for (let i = 0; i < samples.length; i += 1152) {
    const block = enc.encodeBuffer(samples.subarray(i, i + 1152));
    if (block.length) chunks.push(Buffer.from(block));
  }
  const tail = enc.flush();
  if (tail.length) chunks.push(Buffer.from(tail));
  return Buffer.concat(chunks);
}

async function withPiper(lang, text) {
  const model = process.env[`PIPER_MODEL_${lang.toUpperCase()}`] || process.env.PIPER_MODEL || '';
  if (process.env.TTS_ENGINE === 'espeak' || !model || !fs.existsSync(model)) return null;
  const wavPath = `/tmp/offline-tts-${process.pid}.wav`;
  try {
    execFileSync('piper', ['--model', model, '--output_file', wavPath], {
      input: text, encoding: 'utf8', stdio: ['pipe', 'ignore', 'inherit'], timeout: 120000,
    });
    return mp3FromWav(fs.readFileSync(wavPath));
  } catch (error) {
    console.error(`piper unavailable for ${lang}, using eSpeak NG: ${error.message}`);
    return null;
  } finally {
    if (fs.existsSync(wavPath)) fs.rmSync(wavPath);
  }
}

let espeakFactory = null;
async function withEspeak(lang, text) {
  if (!espeakFactory) espeakFactory = (await import('espeak-ng')).default;
  // The Emscripten CLI is one-shot, so each sentence needs a fresh module instance (~120 ms).
  // Keeping the process alive avoids paying Node/WASM startup 15 000 times.
  const espeak = await espeakFactory({ arguments: ['-w', 'out.wav', '-v', ESPEAK_VOICE[lang] || 'en-us', text] });
  return mp3FromWav(Buffer.from(espeak.FS.readFile('out.wav')));
}

export async function renderMp3(lang, text) {
  return (await withPiper(lang, text)) || (await withEspeak(lang, text));
}
