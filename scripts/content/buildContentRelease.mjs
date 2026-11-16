#!/usr/bin/env node
/** Build the single JSON asset the app uses when the public Supabase bucket is unavailable. */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('content-packs');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const packs = manifest.packs.map(entry => JSON.parse(fs.readFileSync(path.join(root, entry.path), 'utf8')));
const out = path.join(root, 'packs-all.json');
fs.writeFileSync(out, JSON.stringify({ schema: 1, packs }, null, 1) + '\n');
console.log(`packs-all.json: ${packs.length} packs · ${(fs.statSync(out).size / 1048576).toFixed(2)} MB`);
