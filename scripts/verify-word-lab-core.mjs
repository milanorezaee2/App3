#!/usr/bin/env node
/**
 * Word lab content guard (German + Russian).
 *
 * The word lab teaches a word, then a sentence that uses it, then asks the learner to say that
 * sentence. That only works when every curated word actually has (a) a Persian meaning and (b) a
 * course sentence that contains the word as a whole token. This script fails the build when that
 * stops being true, instead of letting the lab silently fall back to a bare word card.
 *
 * It also reports the words that could not be matched to any sentence. Those are intentionally
 * left out of the curated block (they are listed in `UNRESOLVED_CORE_TARGETS`), so the printed
 * list is a to-do, not a failure — unless the resolved count drops below the recorded floor.
 */
import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { readFileSync, statSync } from 'node:fs';
import esbuild from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'node_modules', '.cache', 'word-lab-core-test.cjs');

await esbuild.build({
  stdin: {
    contents: [
      "import { CORE_WORDS, UNRESOLVED_CORE_TARGETS } from './lib/languages/wordLabCore';",
      "import { WORD_LAB_WORDS, WORD_LAB_LOCALE, spokenSentence, hasSpokenSentence } from './lib/languages/wordLab';",
      'export { CORE_WORDS, UNRESOLVED_CORE_TARGETS, WORD_LAB_WORDS, WORD_LAB_LOCALE, spokenSentence, hasSpokenSentence };',
    ].join('\n'),
    resolveDir: root,
  },
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: output,
  logLevel: 'error',
  define: { __DEV__: 'false', 'process.env.NODE_ENV': '"production"' },
  // The lab files only read data, but wordLab.ts reaches the speech helpers, which import React Native
  // modules that cannot be parsed outside the app. Stub them exactly like the other verifiers do.
  plugins: [{
    name: 'word-lab-core-stubs',
    setup(build) {
      const STUB = 'const noop = async () => null;\nexport const Platform = { OS: "web", select: (values) => values.web ?? values.default };\nexport default { getItem: noop, setItem: noop, removeItem: noop };\nexport const supabase = { auth: { getSession: noop }, from: () => ({ upsert: noop }) };\n';
      const namespace = 'word-lab-platform-stub';
      build.onResolve({ filter: /^(react-native|expo|@expo|@react-native|@react-navigation|@react-native-async-storage)/ }, () => ({ path: 'platform', namespace }));
      build.onResolve({ filter: /^\.\/supabase$/ }, args =>
        (args.importer.endsWith('/lib/createCourseProgressStore.ts') ? { path: 'platform', namespace } : null));
      build.onLoad({ filter: /.*/, namespace }, () => ({ contents: STUB, loader: 'js' }));
    },
  }],
});

const app = createRequire(import.meta.url)(output);
const checks = [];
const check = (label, value) => { assert(value, label); checks.push(label); };

/** `fold` mirrors the one in wordLabCore so «Приве́т,» and «привет» compare equal. */
const fold = (value) => value.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
  .replace(/ё/g, 'е').replace(/[«».,!?—–:;"'()]/g, '').replace(/ʹ|’|´/g, '').replace(/\s+/g, ' ').trim();

const FLOOR = { de: 154, ru: 99 };

for (const language of ['de', 'ru']) {
  const core = app.CORE_WORDS[language];
  const cards = app.WORD_LAB_WORDS[language];
  const unresolved = app.UNRESOLVED_CORE_TARGETS[language];

  check(`${language}: curated block does not shrink below the recorded floor (${core.length} >= ${FLOOR[language]})`,
    core.length >= FLOOR[language]);
  check(`${language}: every curated word has a Persian meaning`, core.every(word => word.fa && word.fa.trim().length > 1));
  check(`${language}: every curated word has a sentence and a Persian translation of it`,
    core.every(word => word.sentence && word.sentenceFa && word.sentence.trim().length > word.target.trim().length));
  check(`${language}: the sentence really contains the word as a whole token`,
    core.every(word => new RegExp(`(^|\\s)${fold(word.target).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`)
      .test(` ${fold(word.sentence)} `)));
  check(`${language}: a curated word is never listed as unresolved`, core.every(word => !unresolved.includes(word.target)));
  // Two words may occasionally share one example when the course teaches no other sentence for the
  // second word, but that stays rare and never crowds a sentence with many words.
  const sharedSentences = new Map();
  for (const word of core) sharedSentences.set(fold(word.sentence), (sharedSentences.get(fold(word.sentence)) ?? 0) + 1);
  const crowded = [...sharedSentences.values()].filter(count => count > 2);
  check(`${language}: a sentence is shared by at most two words, and rarely at all`, crowded.length === 0
    && [...sharedSentences.values()].filter(count => count > 1).length <= Math.max(3, Math.round(core.length * 0.06)));

  const curatedCards = cards.filter(card => card.curated);
  check(`${language}: the curated block is placed in front of the frequency tail`,
    cards.slice(0, curatedCards.length).every(card => card.curated) && curatedCards.length === core.length);
  check(`${language}: curated cards keep a meaning and an example`, curatedCards.every(card =>
    card.fa && card.target && card.exampleTarget && card.exampleFa));
  const withoutSentence = curatedCards.filter(card => !app.hasSpokenSentence(card));
  check(`${language}: curated cards without a spoken sentence stay exceptional (${withoutSentence.length})`,
    withoutSentence.length <= Math.max(1, Math.round(curatedCards.length * 0.02)));
  const withSentence = curatedCards.filter(card => app.hasSpokenSentence(card));
  check(`${language}: a spoken sentence is a real sentence, not the bare word`, withSentence.every(card => {
    const spoken = app.spokenSentence(card);
    const tokens = spoken.replace(/[.!?…]/gu, '').split(/\s+/).filter(Boolean);
    return tokens.length >= 2 && fold(spoken) !== fold(card.target);
  }));
  check(`${language}: card ids are unique (${cards.length} cards)`, new Set(cards.map(card => card.id)).size === cards.length);
  check(`${language}: the narrator locale follows the language`, /^(de|ru)-/.test(app.WORD_LAB_LOCALE[language]));

  console.log(`${language}: ${cards.length} cards · ${core.length} curated · ${unresolved.length} unresolved · ` +
    `${withoutSentence.length} curated without sentence · ${withSentence.length} with sentence`);
  if (unresolved.length) console.log(`  UNRESOLVED_CORE_TARGETS.${language}: ${unresolved.join(' ')}`);
  if (withoutSentence.length) console.log(`  no sentence yet: ${withoutSentence.map(card => `${card.target} | ${card.exampleTarget}`).join(' · ')}`);
}

console.log(`${checks.length} word-lab content checks passed.`);
