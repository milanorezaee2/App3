/**
 * Sanitise the bundled frequency lists.
 *
 * The raw wordfreq export contains tokens the course tokenizer can never produce as one word
 * (apostrophes, `z.b`, `1er`, URLs, digits), stray English stop-words in the non-English corpora,
 * and single Latin letters used as initials. Those are corpus artefacts, not vocabulary a learner
 * should meet in the first 500/2000 words. We keep their relative order for every *teachable*
 * token, pull the next useful words up into the low ranks, and push the artefacts to the tail so
 * every list is still 8000 entries long.
 *
 * Usage: npx tsx scripts/content/curateFrequency.ts [--write]
 * Without --write it only prints what would change.
 */
import fs from 'node:fs';
import path from 'node:path';

const LANGS = ['en', 'de', 'fr', 'es', 'tr', 'ru'] as const;
type Lang = typeof LANGS[number];

/** English corpus noise that leaked into the other lists; target-language look-alikes are kept below. */
const FOREIGN = new Set([
  'the', 'of', 'and', 'to', 'is', 'it', 'for', 'you', 'with', 'are', 'be', 'this', 'that',
  'as', 'by', 'he', 'or', 'we', 'my', 'new', 'one', 'not', 'but', 'from', 'they', 'have',
  'has', 'do', 'if', 'what', 'when', 'who', 'how', 'just', 'like', 'about', 'up', 'out',
  'more', 'get', 'been', 'would', 'she', 'people', 'don', 'some', 'also', 'them', 'now',
  'other', 'its', 'our', 'than', 'good', 'only', 'after', 'there', 'here', 'where', 'why',
  'your', 'their', 'him', 'us', 'these', 'those', 'into', 'over', 'under', 'before',
  'because', 'while', 'during', 'against', 'between', 'yeah', 'yes', 'oh', 'hey', 'sorry',
  'wow', 'cool', 'sex', 'http', 'https', 'www', 'com', 'org', 'etc', 'ii', 'iii', 'iv',
  'vi', 'vii', 'viii', 'ix', 'xi', 'xii', 'mr', 'mrs', 'ms', 'dr', 'st', 'nr', 'ca',
  'usa', 'eu', 'spd', 'cdu', 'afd', 'fc', 'km', 'kg', 'mm', 'cm', 'ps', 'pc', 'un',
  'tv', 'wm', 'ddr', 'csu', 'fdp', 'ok', 'sex', 'and', 'the', 'of', 'to', 'in', 'on',
  'at', 'by', 'or', 'an', 'as', 'is', 'it', 'be', 'was', 'so', 'no', 'if', 'we', 'he',
]);

const KEEP: Record<Lang, Set<string>> = {
  en: new Set(FOREIGN), // English stop-words are the target language here
  de: new Set(['was', 'so', 'also', 'will', 'man', 'in', 'an', 'all', 'am', 'hat', 'sind', 'wir', 'du', 'er', 'sie', 'es', 'ein', 'eine', 'nicht', 'zu', 'von', 'mit', 'auf', 'für', 'dem', 'den', 'des', 'als', 'dass', 'bei', 'wie', 'aber', 'aus', 'nach', 'noch', 'wenn', 'oder', 'wird', 'werden', 'einen', 'kann', 'über', 'da', 'dann', 'einem', 'schon', 'habe', 'ja', 'mehr', 'mir', 'sein', 'vor', 'mal', 'zur', 'durch', 'hier', 'mich', 'bis', 'doch', 'ihr', 'immer', 'jetzt', 'diese', 'wurde', 'wieder', 'keine', 'alle', 'sehr', 'her']),
  fr: new Set(['un', 'an', 'ca', 'eu', 'but', 'or', 'on', 'as', 'can', 'so', 'a', 'à', 'y', 'c', 'd', 'j', 'l', 'n', 's', 't', 'm', 'p', 'q', 'r', 'v', 'x', 'b', 'f', 'g', 'h', 'o', 'u', 'e', 'i']),
  es: new Set(['un', 'he', 'no', 'a', 'y', 'o', 'e', 'u', 'me', 'te', 'se', 'si', 'mi', 'tu', 'son', 'nos', 'como', 'para', 'por', 'lo', 'la', 'el', 'en', 'de', 'que', 'más', 'ya', 'ha', 'cuando', 'yo', 'ser', 'sin', 'hay', 'está', 'fue', 'muy', 'sobre', 'también', 'todos', 'eso', 'tiene', 'porque', 'qué', 'así', 'años', 'dos', 'bien', 'entre', 'puede', 'desde', 'hasta', 'hacer', 'ahora', 'era', 'esto', 'vez', 'hace', 'nada', 'ni', 'donde', 'parte', 'solo', 'algo', 'tiempo', 'día', 'uno', 'mejor', 'mucho', 'tan']),
  tr: new Set(['an', 'on', 'in', 'be', 'at', 'o', 'a', 'i', 'ı', 'u', 'ü', 'e', 's', 'm', 'k', 't', 'n', 'g', 'l', 'h', 'r', 'y', 'f', 'p', 'v', 'c', 'b', 'd', 'z', 'ş', 'ç', 'ğ']),
  ru: new Set(), // Latin-script tokens are not Russian vocabulary
};

/** Single-character words that are real function words (or the alphabet lesson), not initials. */
const SINGLE_KEEP: Record<Lang, Set<string>> = {
  en: new Set(['a', 'i']),
  de: new Set(),
  fr: new Set(['a', 'à', 'y', 'c', 'd', 'j', 'l', 'n', 's', 't', 'm', 'p', 'q', 'r', 'v', 'x', 'b', 'f', 'g', 'h', 'o', 'u', 'e', 'i']),
  es: new Set(['a', 'y', 'o', 'e', 'u']),
  tr: new Set(['o', 'a', 'i', 'ı', 'u', 'ü', 'e']),
  ru: new Set('а б в г д е ё ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я'.split(' ')),
};

const SCRIPT = /^\p{L}+$/u;
const RUSSIAN = /^[\u0400-\u04FF]+$/u;
const ROMAN = /^(i|v|x)+$/u;

function teachable(word: string, lang: Lang): boolean {
  if (!SCRIPT.test(word)) return false;                    // apostrophes, dots, digits, hyphens, URLs
  if (word.length === 1 && !SINGLE_KEEP[lang].has(word)) return false;
  if (lang === 'ru' && !RUSSIAN.test(word)) return false; // stray Latin initials
  if (ROMAN.test(word) && word.length > 1) return false;  // ii / iii / iv … corpus artefacts
  if (lang !== 'en' && FOREIGN.has(word) && !KEEP[lang].has(word)) return false;
  return true;
}

const write = process.argv.includes('--write');
const root = path.resolve('lib/content/frequency');
const report: string[] = ['# Frequency-list curation', '', 'The bundled wordfreq exports are filtered for tokens the course tokenizer can actually teach. Artefacts are moved to the tail; the first 2000 ranks are filled with the next useful words.', ''];
for (const lang of LANGS) {
  const file = path.join(root, `${lang}.json`);
  const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as string[];
  // Compact artefacts in place: every teachable word keeps a rank no later than it had before,
  // so existing packs that were inside a band's ceiling stay inside it. Artefacts collect at the tail.
  const teachableUnique: string[] = [];
  const seenTeachable = new Set<string>();
  for (const word of raw) {
    if (teachable(word, lang) && !seenTeachable.has(word)) { seenTeachable.add(word); teachableUnique.push(word); }
  }
  const dropped: string[] = [];
  const firstSeen = new Set<string>();
  for (const word of raw) {
    if (teachable(word, lang) && !firstSeen.has(word)) firstSeen.add(word);
    else dropped.push(word); // corpus artefact or duplicate
  }
  const curated: string[] = [];
  const used = new Set<string>();
  let next = 0;
  for (let i = 0; i < 8000; i++) {
    const word = raw[i];
    if (teachable(word, lang) && !used.has(word)) { curated.push(word); used.add(word); continue; }
    while (next < teachableUnique.length && used.has(teachableUnique[next])) next++;
    if (next < teachableUnique.length) { const fill = teachableUnique[next++]; curated.push(fill); used.add(fill); }
    else curated.push(word); // all useful words have been placed; tail keeps the original artefacts
  }
  const first2000 = curated.slice(0, 2000);
  report.push(`- **${lang}**: ${dropped.length} artefact(s) moved to the tail; examples: ${[...new Set(dropped)].slice(0, 14).join(', ') || '—'}. Top-2000 tail: ${first2000.slice(-8).join(', ')}.`);
  if (write) fs.writeFileSync(file, JSON.stringify(curated, null, 0) + '\n');
  console.log(`${lang}: teachable ${teachableUnique.length}, moved ${dropped.length}, length ${curated.length}`);
}
report.push('', 'Run `npx tsx scripts/content/curateFrequency.ts --write` to regenerate. This script is idempotent (kept words keep their relative order).', '');
if (write) fs.writeFileSync(path.resolve('docs/frequency-curation.md'), report.join('\n'));
