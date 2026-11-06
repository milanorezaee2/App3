#!/usr/bin/env node
/**
 * Repo hygiene gate.
 *
 * This exists because the repository once carried two byte-identical copies of
 * a 3.4 MB image that no code referenced, plus a stale `transfer/` bundle and
 * six native packages nothing imported. Nothing in CI noticed for months.
 *
 * Four checks:
 *   1. no unreferenced binary asset above the size budget
 *   2. no throwaway bundles/dumps at the repo root
 *   3. every declared dependency is actually imported somewhere
 *   4. image file extension matches its magic bytes
 *
 * Run: npm run validate:hygiene
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

/** Assets above this size must be referenced from code or config. */
const ASSET_SIZE_LIMIT = 200 * 1024;

/**
 * Dependencies that are legitimately never imported by name.
 * Each entry needs a reason; do not add to this list without one.
 */
const DEPENDENCY_ALLOWLIST = new Map([
  ['typescript', 'CLI tool (tsc), never imported'],
  ['@types/react', 'type-only package'],
  ['@babel/core', 'used by babel-preset-expo'],
  ['react-dom', 'web renderer, resolved by react-native-web'],
  ['react-native-web', 'web renderer, resolved by bundler, not imported'],
  ['react-native-screens', 'native side effect, wired by expo-router'],
  ['react-native-gesture-handler', 'native side effect, wired by react-navigation'],
  ['@expo/vector-icons', 'dependency of expo itself; remove only if expo drops it'],
  ['babel-plugin-module-resolver', 'CANDIDATE FOR REMOVAL: no babel config uses it'],
]);

const SKIP_DIRS = new Set([
  '.git', 'node_modules', '.expo', 'dist', 'android', 'ios',
  'web-build', '.next', 'coverage', 'build',
]);

const CODE_EXT = /\.(ts|tsx|js|jsx|mjs|cjs)$/;
/** Binary/document assets that are worth guarding by size. */
const ASSET_EXT = /\.(jpg|jpeg|png|gif|webp|bmp|ico|ttf|otf|woff2?|wav|mp3|m4a|mp4|zip|pdf)$/i;
/** Extensions whose first bytes can be checked. */
const MAGIC = [
  { ext: ['.png'], bytes: [0x89, 0x50, 0x4e, 0x47], name: 'PNG' },
  { ext: ['.jpg', '.jpeg'], bytes: [0xff, 0xd8, 0xff], name: 'JPEG' },
  { ext: ['.gif'], bytes: [0x47, 0x49, 0x46, 0x38], name: 'GIF' },
  { ext: ['.wav'], bytes: [0x52, 0x49, 0x46, 0x46], name: 'WAV' },
  { ext: ['.pdf'], bytes: [0x25, 0x50, 0x44, 0x46], name: 'PDF' },
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const allFiles = walk(ROOT);
const rel = (p) => path.relative(ROOT, p);

const failures = [];
const notes = [];
const fail = (message) => failures.push(message);
const note = (message) => notes.push(message);

// ---------------------------------------------------------------- check 1 & 4
// Corpus used to decide whether an asset is referenced anywhere meaningful.
const referenceCorpus = allFiles
  .filter((f) => CODE_EXT.test(f) || /\.(json|yml|yaml|sql)$/.test(f))
  .filter((f) => !ASSET_EXT.test(f))
  .map((f) => {
    try { return fs.readFileSync(f, 'utf8'); } catch { return ''; }
  })
  .join('\n');

for (const file of allFiles) {
  if (!ASSET_EXT.test(file)) continue;
  const stat = fs.statSync(file);
  const base = path.basename(file);
  const stem = base.replace(/\.[^.]+$/, '');

  // check 4 — extension must match real content
  const expected = MAGIC.find((m) => m.ext.includes(path.extname(file).toLowerCase()));
  if (expected) {
    const head = fs.readFileSync(file).subarray(0, expected.bytes.length);
    const matches = expected.bytes.every((b, i) => head[i] === b);
    if (!matches) {
      fail(
        `${rel(file)} has a ${path.extname(file)} extension but its content is not ${expected.name} ` +
        `(magic bytes were ${[...head].map((b) => b.toString(16).padStart(2, '0')).join(' ')}). ` +
        'Re-encode it in the format the extension claims.',
      );
    }
  }

  // check 1 — big assets must be referenced
  if (stat.size > ASSET_SIZE_LIMIT && stem.length > 3) {
    const referenced = referenceCorpus.includes(stem);
    if (!referenced) {
      fail(
        `${rel(file)} is ${(stat.size / 1024).toFixed(0)} KB and no code or config references "${stem}". ` +
        'Delete it, or move it to external storage.',
      );
    }
  }
}

// ------------------------------------------------------------------- check 2
const ROOT_JUNK = [
  { test: (n) => n === 'transfer', why: 'one-off handoff bundles do not belong in the repo' },
  { test: (n) => /\.(zip|tar|gz|7z)$/i.test(n), why: 'archives are build artifacts, not sources' },
  { test: (n) => /^(dist|web-build|build)-/.test(n), why: 'export output does not belong in the repo' },
];
for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
  for (const rule of ROOT_JUNK) {
    if (rule.test(entry.name)) fail(`"${entry.name}" at repo root: ${rule.why}.`);
  }
}

// ------------------------------------------------------------------- check 3
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const declared = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
];

const configCorpus = ['app.json', 'app.config.js', 'eas.json', 'babel.config.js', 'tsconfig.json']
  .map((f) => {
    try { return fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch { return ''; }
  })
  .join('\n');

for (const dep of declared) {
  if (DEPENDENCY_ALLOWLIST.has(dep)) continue;
  // Any quoted occurrence of the package name (or a deep path into it).
  const pattern = new RegExp(`['"]${dep.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}(?:/[^'"]*)?['"]`);
  const imported = pattern.test(referenceCorpus) || pattern.test(configCorpus);
  if (!imported) {
    fail(
      `"${dep}" is in package.json but nothing imports it. ` +
      'Remove it, or add it to DEPENDENCY_ALLOWLIST in this script with a reason.',
    );
  }
}

// ------------------------------------------------------------------- report
const staleAllowlist = [...DEPENDENCY_ALLOWLIST.keys()].filter(
  (dep) => !declared.includes(dep),
);
for (const dep of staleAllowlist) {
  note(`allowlist entry "${dep}" is no longer a declared dependency — drop it from this script.`);
}

if (notes.length) {
  console.log('Notes:');
  for (const n of notes) console.log(`  · ${n}`);
  console.log('');
}

if (failures.length) {
  console.error(`Repo hygiene: ${failures.length} problem(s)\n`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  console.error('');
  process.exit(1);
}

console.log(
  `Repo hygiene OK — ${allFiles.length} files scanned, ` +
  `${declared.length} dependencies verified, no oversized unreferenced assets.`,
);
