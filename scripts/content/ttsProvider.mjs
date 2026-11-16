#!/usr/bin/env node
/**
 * Provider-agnostic TTS command for `renderAudio.mjs`. No key is baked in: CI passes it from a
 * GitHub Secret. Usage (normally called by renderAudio.mjs, not by hand):
 *
 *   TTS_PROVIDER=openai TTS_API_KEY=... node scripts/content/ttsProvider.mjs de "Guten Morgen" out.mp3
 *
 * Providers: `openai` (default), `google`, `elevenlabs`.
 * Optional: TTS_MODEL, TTS_VOICES_JSON='{"de":"voice-id","fr":"voice-id",...}' (ElevenLabs).
 */
import fs from 'node:fs';

const [, , lang, text, out] = process.argv;
if (!lang || !text || !out) { console.error('usage: ttsProvider.mjs <lang> <text> <out.mp3>'); process.exit(2); }
const key = process.env.TTS_API_KEY;
if (!key) { console.error('TTS_API_KEY is not set; add it as a GitHub Secret (never paste it in chat).'); process.exit(3); }
const provider = process.env.TTS_PROVIDER || 'openai';
const model = process.env.TTS_MODEL || '';
const voices = (() => { try { return JSON.parse(process.env.TTS_VOICES_JSON || '{}'); } catch { return {}; } })();
const locales = { en: 'en-US', de: 'de-DE', fr: 'fr-FR', es: 'es-ES', tr: 'tr-TR', ru: 'ru-RU' };
const locale = locales[lang] || 'en-US';

async function writeResponse(response, label) {
  if (!response.ok) throw new Error(`${label} ${response.status}: ${(await response.text()).slice(0, 300)}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(out, buffer);
}

async function openai() {
  const r = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini-tts',
      voice: voices[lang] || 'alloy',
      input: text,
      response_format: 'mp3',
    }),
  });
  await writeResponse(r, 'openai');
}
async function google() {
  const r = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: locale, ...(voices[lang] ? { name: voices[lang] } : {}) },
      audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0 },
    }),
  });
  if (!r.ok) throw new Error(`google ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const data = await r.json();
  fs.writeFileSync(out, Buffer.from(data.audioContent, 'base64'));
}
async function elevenlabs() {
  const voiceId = voices[lang];
  if (!voiceId) throw new Error(`TTS_VOICES_JSON has no voice for "${lang}"`);
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({
      text,
      model_id: model || 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });
  await writeResponse(r, 'elevenlabs');
}

const run = { openai, google, elevenlabs }[provider];
if (!run) { console.error(`unknown TTS_PROVIDER "${provider}"`); process.exit(2); }
await run();
console.log(`${provider} ${lang} → ${out}`);
