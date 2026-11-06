#!/usr/bin/env node
/**
 * APK composition report.
 *
 * An APK is a zip, so this reads the central directory directly and groups
 * entries by what they actually are, which is the only reliable way to see
 * where the megabytes went:
 *
 *   lib/arm64-v8a         native libraries for one CPU architecture
 *   classes*.dex          compiled Java/Kotlin
 *   assets/               bundled JS, fonts, images
 *   res/                  Android resources
 *
 * Usage:
 *   node scripts/apk-report.mjs app-release.apk
 *   node scripts/apk-report.mjs app-release.apk --limit-mb 45
 */

import fs from 'node:fs';

const EOCD_SIG = 0x06054b50;
const EOCD64_LOCATOR_SIG = 0x07064b50;
const EOCD64_SIG = 0x06064b50;
const CD_SIG = 0x02014b50;

function readCentralDirectory(buf) {
  let eocd = -1;
  const start = Math.max(0, buf.length - 22 - 0xffff);
  for (let i = buf.length - 22; i >= start; i -= 1) {
    if (buf.readUInt32LE(i) === EOCD_SIG) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('Not a zip/APK: end-of-central-directory record not found.');

  let count = buf.readUInt16LE(eocd + 10);
  let cdOffset = buf.readUInt32LE(eocd + 16);

  // ZIP64: used when the entry count or the offset exceeds 16/32 bits.
  if (count === 0xffff || cdOffset === 0xffffffff) {
    const locator = eocd - 20;
    if (locator >= 0 && buf.readUInt32LE(locator) === EOCD64_LOCATOR_SIG) {
      const eocd64 = Number(buf.readBigUInt64LE(locator + 8));
      if (buf.readUInt32LE(eocd64) === EOCD64_SIG) {
        count = Number(buf.readBigUInt64LE(eocd64 + 32));
        cdOffset = Number(buf.readBigUInt64LE(eocd64 + 48));
      }
    }
  }

  const entries = [];
  let p = cdOffset;
  for (let i = 0; i < count; i += 1) {
    if (p + 46 > buf.length || buf.readUInt32LE(p) !== CD_SIG) break;
    const compressed = buf.readUInt32LE(p + 20);
    const uncompressed = buf.readUInt32LE(p + 24);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    entries.push({ name, compressed, uncompressed });
    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

/** Maps an entry path to the bucket a human cares about. */
function bucketFor(name) {
  if (name.startsWith('lib/')) {
    const abi = name.split('/')[1] || 'unknown';
    return `lib/${abi}`;
  }
  if (/^classes\d*\.dex$/.test(name)) return 'classes.dex (Java/Kotlin)';
  if (name.startsWith('assets/')) return 'assets (JS bundle, fonts, images)';
  if (name.startsWith('res/')) return 'res (Android resources)';
  if (name.startsWith('META-INF/')) return 'META-INF (signatures)';
  if (name === 'AndroidManifest.xml') return 'AndroidManifest.xml';
  if (name === 'resources.arsc') return 'resources.arsc';
  return 'other';
}

const args = process.argv.slice(2);
const apkPath = args.find((a) => !a.startsWith('--'));
const limitIndex = args.indexOf('--limit-mb');
const limitMb = limitIndex >= 0 ? Number(args[limitIndex + 1]) : null;

if (!apkPath) {
  console.error('Usage: node scripts/apk-report.mjs <path-to.apk> [--limit-mb N]');
  process.exit(2);
}

const buf = fs.readFileSync(apkPath);
const entries = readCentralDirectory(buf);

const buckets = new Map();
let total = 0;
for (const entry of entries) {
  const key = bucketFor(entry.name);
  const current = buckets.get(key) || { compressed: 0, count: 0, largest: 0 };
  current.compressed += entry.compressed;
  current.count += 1;
  current.largest = Math.max(current.largest, entry.compressed);
  buckets.set(key, current);
  total += entry.compressed;
}

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(2).padStart(7);
const rows = [...buckets.entries()].sort((a, b) => b[1].compressed - a[1].compressed);

console.log(`\nAPK: ${apkPath}`);
console.log(`File size on disk : ${mb(buf.length)} MB`);
console.log(`Sum of entries    : ${mb(total)} MB across ${entries.length} entries\n`);
console.log('  share   size(MB)  entries  bucket');
console.log('  ------  --------  -------  ------------------------------------');
for (const [name, stats] of rows) {
  const share = ((stats.compressed / total) * 100).toFixed(1).padStart(5);
  console.log(`  ${share}%  ${mb(stats.compressed)}  ${String(stats.count).padStart(7)}  ${name}`);
}

const abis = rows.filter(([name]) => name.startsWith('lib/'));
if (abis.length > 1) {
  const abiTotal = abis.reduce((sum, [, s]) => sum + s.compressed, 0);
  console.log(
    `\nNote: ${abis.length} CPU architectures are packaged ` +
    `(${mb(abiTotal)} MB). Each device needs exactly one.`,
  );
}

console.log('');
if (limitMb !== null) {
  const actual = buf.length / 1024 / 1024;
  if (actual > limitMb) {
    console.error(`✗ APK is ${actual.toFixed(2)} MB, over the ${limitMb} MB budget.`);
    console.error('  See docs/PROPOSAL-SIZE-AND-BUILD-REDUCTION-FA.md for the levers.');
    process.exit(1);
  }
  console.log(`✓ APK is ${actual.toFixed(2)} MB, within the ${limitMb} MB budget.`);
}
