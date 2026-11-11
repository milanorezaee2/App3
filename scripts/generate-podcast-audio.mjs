#!/usr/bin/env node
/**
 * Generate recorded English podcast episodes (MP3) + manifest.json from the
 * same episode model the app uses (lib/englishPodcastEpisodes.ts).
 *
 * Each segment is synthesized separately (normal speed, and a slow repeat for
 * sentences), padded with silence, concatenated with ffmpeg, and the segment
 * start times are written as `cues` so the app can highlight the transcript.
 *
 * Usage:
 *   node scripts/generate-podcast-audio.mjs [--out dist-podcast] [--level 0] [--ids a,b] [--limit 5]
 *                                           [--provider openai|elevenlabs] [--voice NAME]
 *                                           [--concurrency 3] [--force] [--upload] [--dry-run]
 * Env (provider):
 *   PODCAST_TTS_PROVIDER=openai        OPENAI_API_KEY=...        [OPENAI_TTS_MODEL=gpt-4o-mini-tts|tts-1-hd] [OPENAI_TTS_VOICE=alloy]
 *   PODCAST_TTS_PROVIDER=elevenlabs    ELEVENLABS_API_KEY=...    ELEVENLABS_VOICE_ID=...  [ELEVENLABS_MODEL=eleven_multilingual_v2]
 * Env (optional upload to Supabase Storage, public bucket):
 *   SUPABASE_URL=https://xxx.supabase.co  SUPABASE_SERVICE_ROLE_KEY=...  [PODCAST_BUCKET=podcast]
 * Requires: ffmpeg + ffprobe on PATH, `npm i -D esbuild` (already a devDependency).
 * Never commit API keys; per-segment clips are cached in <out>/.cache to avoid re-billing.
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile, rm, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';

const exec = promisify(execFile);
const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---------- CLI ----------
const args = process.argv.slice(2);
const flag = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback; };
const has = (name) => args.includes(`--${name}`);
const OUT = path.resolve(flag('out', 'dist-podcast'));
const CACHE = path.join(OUT, '.cache');
const LEVEL = flag('level');
const IDS = flag('ids')?.split(',').map(s => s.trim()).filter(Boolean);
const LIMIT = Number(flag('limit', '0')) || 0;
const CONCURRENCY = Math.max(1, Number(flag('concurrency', '3')) || 3);
const PROVIDER = (flag('provider', process.env.PODCAST_TTS_PROVIDER || 'openai')).toLowerCase();
const FORCE = has('force');
const UPLOAD = has('upload');
const DRY = has('dry-run');
const PAUSE_MS = 700;         // between segments
const SLOW_GAP_MS = 350;      // between normal and slow reading
const SLOW_SPEED = 0.7;

// ---------- load the episode model from TypeScript ----------
async function loadEpisodes() {
  const esbuild = await import('esbuild');
  const result = await esbuild.build({
    entryPoints: [path.join(APP, 'lib/englishPodcastEpisodes.ts')],
    bundle: true, write: false, format: 'esm', platform: 'node', target: 'node20', logLevel: 'silent', absWorkingDir: APP,
  });
  const tmp = path.join(os.tmpdir(), `podcast-episodes-${Date.now()}.mjs`);
  await writeFile(tmp, result.outputFiles[0].text);
  try {
    const mod = await import(pathToFileURL(tmp).href);
    return mod.PODCAST_EPISODES;
  } finally {
    await rm(tmp, { force: true });
  }
}

// ---------- TTS providers ----------
async function synthOpenAI(text, speed) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY is missing');
  const body = {
    model: process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts',
    voice: flag('voice', process.env.OPENAI_TTS_VOICE || 'alloy'),
    input: text,
    response_format: 'mp3',
    speed,
  };
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`OpenAI TTS ${response.status}: ${(await response.text()).slice(0, 200)}`);
  return Buffer.from(await response.arrayBuffer());
}

async function synthElevenLabs(text, speed) {
  const key = process.env.ELEVENLABS_API_KEY;
  const voice = flag('voice', process.env.ELEVENLABS_VOICE_ID);
  if (!key || !voice) throw new Error('ELEVENLABS_API_KEY / ELEVENLABS_VOICE_ID are missing');
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      model_id: process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75, speed },
    }),
  });
  if (!response.ok) throw new Error(`ElevenLabs ${response.status}: ${(await response.text()).slice(0, 200)}`);
  return Buffer.from(await response.arrayBuffer());
}

const PROVIDERS = { openai: synthOpenAI, elevenlabs: synthElevenLabs };

async function withRetry(fn, attempts = 4) {
  let delay = 1500;
  for (let i = 1; ; i += 1) {
    try { return await fn(); } catch (error) {
      if (i >= attempts) throw error;
      await new Promise(r => setTimeout(r, delay)); delay *= 2;
    }
  }
}

async function synthCached(text, speed) {
  const voiceKey = flag('voice', process.env.OPENAI_TTS_VOICE || process.env.ELEVENLABS_VOICE_ID || 'default');
  const hash = createHash('sha1').update(`${PROVIDER}|${voiceKey}|${speed}|${text}`).digest('hex');
  const file = path.join(CACHE, `${hash}.mp3`);
  if (existsSync(file)) return file;
  if (DRY) return file;
  const synth = PROVIDERS[PROVIDER];
  if (!synth) throw new Error(`Unknown provider "${PROVIDER}". Use openai or elevenlabs.`);
  const buffer = await withRetry(() => synth(text, speed));
  await writeFile(file, buffer);
  return file;
}

// ---------- ffmpeg helpers ----------
async function ensureTools() {
  try { await exec('ffmpeg', ['-version']); await exec('ffprobe', ['-version']); }
  catch { throw new Error('ffmpeg and ffprobe must be installed and on PATH.'); }
}

async function durationOf(file) {
  const { stdout } = await exec('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file]);
  return Number.parseFloat(stdout.trim()) || 0;
}

async function silenceFile(ms) {
  const file = path.join(CACHE, `silence-${ms}.mp3`);
  if (!existsSync(file) && !DRY) {
    await exec('ffmpeg', ['-y', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', String(ms / 1000), '-q:a', '9', '-acodec', 'libmp3lame', file]);
  }
  return file;
}

async function concat(parts, output) {
  const list = path.join(CACHE, `${path.basename(output, '.mp3')}.txt`);
  await writeFile(list, parts.map(p => `file '${p.replace(/'/g, "'\\''")}'`).join('\n'));
  // Re-encode so mixed bitrates/sample rates from the provider never break seeking.
  await exec('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', list, '-ar', '44100', '-ac', '1', '-b:a', '96k', '-acodec', 'libmp3lame', output]);
  await rm(list, { force: true });
}

// ---------- episode build ----------
async function buildEpisode(episode) {
  const output = path.join(OUT, `${episode.id}.mp3`);
  if (!FORCE && existsSync(output)) {
    return { id: episode.id, skipped: true, durationSec: await durationOf(output) };
  }
  const pause = await silenceFile(PAUSE_MS);
  const slowGap = await silenceFile(SLOW_GAP_MS);
  const parts = [];
  const cues = [];
  let cursor = 0;
  const push = async (file) => { parts.push(file); cursor += DRY ? 0 : await durationOf(file); };

  for (const segment of episode.segments) {
    cues.push(Number(cursor.toFixed(2)));
    if (segment.en) {
      await push(await synthCached(segment.en, 1));
      if (segment.slowRepeat) {
        await push(slowGap);
        await push(await synthCached(segment.en, SLOW_SPEED));
      }
    }
    await push(pause);
  }
  if (!DRY) await concat(parts, output);
  return { id: episode.id, skipped: false, durationSec: Number(cursor.toFixed(2)), cues };
}

// ---------- optional upload ----------
async function upload(file, objectName, contentType) {
  const url = process.env.SUPABASE_URL; const key = process.env.SUPABASE_SERVICE_ROLE_KEY; const bucket = process.env.PODCAST_BUCKET || 'podcast';
  if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for --upload');
  const body = await readFile(file);
  const response = await fetch(`${url.replace(/\/$/, '')}/storage/v1/object/${bucket}/${encodeURIComponent(objectName)}`, {
    method: 'POST', headers: { Authorization: `Bearer ${key}`, apikey: key, 'Content-Type': contentType, 'x-upsert': 'true', 'Cache-Control': 'public, max-age=31536000' }, body,
  });
  if (!response.ok) throw new Error(`Upload ${objectName} failed ${response.status}: ${(await response.text()).slice(0, 200)}`);
}

// ---------- main ----------
async function main() {
  await mkdir(CACHE, { recursive: true });
  if (!DRY) await ensureTools();
  let episodes = await loadEpisodes();
  if (LEVEL !== undefined) episodes = episodes.filter(e => String(e.levelId) === String(LEVEL));
  if (IDS?.length) episodes = episodes.filter(e => IDS.includes(e.id));
  if (LIMIT) episodes = episodes.slice(0, LIMIT);
  if (!episodes.length) { console.error('No episodes matched the filters.'); process.exit(1); }

  const totalChars = episodes.reduce((sum, e) => sum + e.segments.reduce((s, seg) => s + seg.en.length * (seg.slowRepeat ? 2 : 1), 0), 0);
  console.log(`Episodes: ${episodes.length} · provider: ${PROVIDER} · ~${totalChars.toLocaleString()} characters to synthesize${DRY ? ' (dry run)' : ''}`);

  const manifestPath = path.join(OUT, 'manifest.json');
  const manifest = existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, 'utf8')) : { episodes: {} };
  manifest.episodes ||= {};

  let done = 0; const failures = [];
  const queue = [...episodes];
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const episode = queue.shift();
      try {
        const result = await buildEpisode(episode);
        if (!result.skipped || !manifest.episodes[episode.id]) {
          manifest.episodes[episode.id] = { durationSec: result.durationSec, ...(result.cues ? { cues: result.cues } : {}) };
        }
        done += 1;
        console.log(`[${done}/${episodes.length}] ${result.skipped ? 'kept   ' : 'built  '} ${episode.id}  ${Math.round(result.durationSec)}s`);
        if (!DRY) await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
      } catch (error) {
        failures.push(episode.id);
        console.error(`FAILED ${episode.id}: ${error.message}`);
      }
    }
  }));

  if (!DRY) await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  if (UPLOAD && !DRY) {
    console.log('Uploading to Supabase Storage…');
    for (const episode of episodes) {
      if (failures.includes(episode.id)) continue;
      await upload(path.join(OUT, `${episode.id}.mp3`), `${episode.id}.mp3`, 'audio/mpeg');
    }
    await upload(manifestPath, 'manifest.json', 'application/json');
    console.log(`Done. Set EXPO_PUBLIC_PODCAST_AUDIO_URL=${process.env.SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/${process.env.PODCAST_BUCKET || 'podcast'}`);
  }
  const size = DRY ? 0 : (await Promise.all(episodes.map(e => stat(path.join(OUT, `${e.id}.mp3`)).then(s => s.size).catch(() => 0)))).reduce((a, b) => a + b, 0);
  console.log(`\nOutput: ${OUT}  (${(size / 1024 / 1024).toFixed(1)} MB)  failures: ${failures.length}`);
  if (failures.length) process.exit(1);
}

main().catch(error => { console.error(error.message || error); process.exit(1); });
