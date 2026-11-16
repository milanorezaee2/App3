#!/usr/bin/env node
/** Worker for renderOfflineAudio.mjs: renders one chunk of tasks in a single warm process. */
import fs from 'node:fs';
import path from 'node:path';
import { renderMp3 } from './offlineTtsCore.mjs';

const file = process.argv[2];
if (!file) { console.error('usage: offlineTtsWorker.mjs <tasks.json>'); process.exit(2); }
const tasks = JSON.parse(fs.readFileSync(file, 'utf8'));
let done = 0, failed = 0;
for (const task of tasks) {
  if (fs.existsSync(task.out)) { done++; continue; }
  try {
    const mp3 = await renderMp3(task.lang, task.text);
    fs.mkdirSync(path.dirname(task.out), { recursive: true });
    fs.writeFileSync(task.out, mp3);
    done++;
  } catch (error) {
    failed++;
    console.error(`failed ${task.id}: ${error.message}`);
  }
  if (done % 100 === 0) console.log(`worker ${process.pid}: ${done}/${tasks.length}`);
}
console.log(`worker ${process.pid}: done ${done}, failed ${failed}`);
if (failed) process.exitCode = 1;
