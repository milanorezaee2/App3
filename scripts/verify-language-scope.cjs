#!/usr/bin/env node
/**
 * German-removal lock.
 *
 * The app now teaches English and Russian only. This check fails the build if a
 * German course file, route, component, asset, document, copy string, storage
 * key or speech locale ever comes back.
 *
 * Usage: node scripts/verify-language-scope.cjs
 */
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { existsSync, readFileSync, statSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks += 1; };

/* 1. No file name may mention the removed course. */
const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' })
  .split('\0')
  .filter(Boolean);
const germanFiles = tracked.filter(file => /german|deutsch/i.test(file));
check(germanFiles.length === 0, `no tracked file name mentions German: ${germanFiles.slice(0, 5).join(', ')}`);

/* 2. No removed course module, route or component may exist on disk. */
const removedPaths = [
  'lib/languages/german.ts',
  'lib/languages/germanSentenceCourse.ts',
  'lib/languages/germanSentenceSession.ts',
  'lib/languages/germanUnits.ts',
  'lib/languages/unitProgress.ts',
  'lib/languages/unitReview.ts',
  'lib/languages/firstMeetingReview.ts',
  'lib/languages/a1Workshop.ts',
  'lib/languages/a1Coverage.ts',
  'lib/languages/a1Checkpoint.ts',
  'lib/languages/sessionStore.ts',
  'lib/languages/coursePlanner.ts',
  'lib/languages/learningPlanner.ts',
  'lib/languages/guidedCourses.ts',
  'components/GermanBottomNav.tsx',
  'components/GermanCourseLibrary.tsx',
  'components/GermanCourseUI.tsx',
  'components/GermanLearningDetails.tsx',
  'components/GermanSentenceBuilder.tsx',
  'components/GermanSentenceHome.tsx',
  'app/learn/[language]/practice.tsx',
  'app/learn/[language]/reviews.tsx',
  'app/learn/[language]/unit.tsx',
  'app/learn/[language]/workshop.tsx',
  'app/learn/[language]/audio-check.tsx',
  'app/learn/[language]/backup.tsx',
];
for (const file of removedPaths) {
  check(!existsSync(path.join(root, file)), `${file} stays deleted`);
}

/* 3. Source, copy, docs and CI may not mention the course or its locale. */
const scannable = [
  'app', 'components', 'lib', 'scripts', 'docs', 'assets', 'supabase', '.github',
  'README-FA.md', 'package.json', 'app.json', 'index.js',
];
const pattern = /german|deutsch|آلمانی|learn\/de\b|\bde-DE\b|GERMAN_/i;
// This scanner necessarily names the removed course in its own rules.
const skip = new Set([path.join(root, 'scripts/verify-language-scope.cjs')]);

const walk = target => {
  const absolute = path.join(root, target);
  if (!existsSync(absolute)) return [];
  if (statSync(absolute).isFile()) return [absolute];
  return execFileSync('git', ['ls-files', '-z', '--', target], { cwd: root, encoding: 'utf8' })
    .split('\0')
    .filter(Boolean)
    .map(file => path.join(root, file));
};

const offenders = [];
for (const target of scannable) {
  for (const file of walk(target)) {
    if (skip.has(file)) continue;
    if (/\.(png|jpg|jpeg|webp|ttf|otf|woff2?|keystore|jks|apk|ico)$/i.test(file)) continue;
    if (/package-lock\.json$/.test(file)) continue;
    let text;
    try {
      text = readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    const line = text.split('\n').find(entry => pattern.test(entry));
    if (line) offenders.push(`${path.relative(root, file)}: ${line.trim().slice(0, 80)}`);
  }
}
check(offenders.length === 0, `no German content anywhere in the app, docs or CI: ${offenders.slice(0, 3).join(' | ')}`);

/* 4. The two supported languages are the only ones the app offers. */
const catalog = readFileSync(path.join(root, 'lib/languages/catalog.ts'), 'utf8');
check(/LANGUAGES[^=]*=\s*\[/.test(catalog), 'the catalog still exposes its language list');
const ids = [...catalog.matchAll(/\{ id: '([a-z]{2})',/g)].map(match => match[1]);
check(ids.join('|') === 'en|ru', `the language picker offers exactly English and Russian (found ${ids.join('|')})`);
check(catalog.includes("speechLocale: 'en-US'") && catalog.includes("speechLocale: 'ru-RU'"), 'both remaining courses keep their own speech locale');

const types = readFileSync(path.join(root, 'lib/languages/types.ts'), 'utf8');
check(/LanguageId\s*=\s*'en'\s*\|\s*'ru'/.test(types), 'the language identifier union is English or Russian only');

const registry = readFileSync(path.join(root, 'lib/languages/courseRegistry.ts'), 'utf8');
check(/COURSES:\s*Record<'en'\s*\|\s*'ru'/.test(registry), 'only the English and Russian courses are registered');
check(!/\bde\b/.test(registry.replace(/[A-Za-z]de[A-Za-z]/g, '')), 'the course registry has no German lookup');

const pronunciation = readFileSync(path.join(root, 'lib/languages/pronunciationCourse.ts'), 'utf8');
check(/PronunciationLanguage\s*=\s*'en'\s*\|\s*'ru'/.test(pronunciation), 'pronunciation offers English and Russian only');

const placement = readFileSync(path.join(root, 'lib/placement.ts'), 'utf8');
check(/PlacementLanguage\s*=\s*'en'/.test(placement), 'the placement test is English-only');

console.log(`${checks} language-scope checks passed: no German file, route, copy, doc, storage key or speech locale remains, and the app offers English and Russian only.`);
