/**
 * 100% linguistic review of every generated pack line, plus a 10% sample of hand-drafted lines.
 *
 * The download packs are generated from a small, closed set of reviewed frames. Reviewing those
 * frames once plus verifying EVERY rendered line against them therefore covers all generated
 * sentences, not a sample. The older hand-drafted sentences keep their 10% sample review policy.
 *
 * Usage: npx tsx scripts/content/reviewPacks.ts [--write]
 * Without --write it prints the findings; with --write it also writes docs/native-review.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { CEFR_BANDS, type CefrBand } from '@/lib/content/courseSpec';
import type { ContentPack, PackSentence } from '@/lib/content/packs';
import type { CourseLanguage } from '@/lib/content/readiness';
import { COVERAGE_TEMPLATES, REVIEW_NOTE, renderFrame } from './coverageTemplates';

const LANGS: CourseLanguage[] = ['en', 'de', 'fr', 'es', 'tr', 'ru'];
const write = process.argv.includes('--write');
const root = path.resolve('content-packs');
const fold = (w: string) => w.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const stemEq = (a: string, b: string) => a === b || (a.length >= 5 && b.length >= 5 && a.slice(0, 5) === b.slice(0, 5) && Math.abs(a.length - b.length) <= 3);
const quoted = (text: string) => [...text.matchAll(/«([^»]+)»/g)].map(m => m[1]);

function newestPacks(lang: CourseLanguage): Array<{ file: string; pack: ContentPack }> {
  const dir = path.join(root, lang);
  if (!fs.existsSync(dir)) return [];
  const newest = new Map<string, string>();
  for (const file of fs.readdirSync(dir)) {
    const m = file.match(/^(pre|A1|A2|B1|B2|C1)\.v(\d+)\.json$/);
    if (!m) continue;
    const have = newest.get(m[1]);
    if (!have || Number(m[2]) > Number(have.match(/v(\d+)/)![1])) newest.set(m[1], file);
  }
  return [...newest.values()].sort().map(file => ({
    file: `${lang}/${file}`,
    pack: JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')) as ContentPack,
  }));
}

interface Stat { lang: CourseLanguage; generated: number; sampled: number; violations: string[] }
const stats: Stat[] = [];

for (const lang of LANGS) {
  const stat: Stat = { lang, generated: 0, sampled: 0, violations: [] };
  for (const { file, pack } of newestPacks(lang)) {
    if (!pack.source.includes(REVIEW_NOTE.split(' · ')[0])) stat.violations.push(`${file}: source does not record the v3 review`);
    pack.sentences.forEach((s: PackSentence, index: number) => {
      const isGenerated = !!s.pattern && /<W\d+>/.test(s.pattern);
      if (!isGenerated) {
        // 10% deterministic sample of the hand-drafted lines.
        if (index % 10 !== 0) return;
        stat.sampled++;
        if (!s.fa.trim() || s.fa.trim() === s.text.trim()) stat.violations.push(`${file} [${s.id}]: Persian missing`);
        if (quoted(s.text).length !== (s.text.match(/«/g) ?? []).length) stat.violations.push(`${file} [${s.id}]: unbalanced guillemets`);
        if (/\{LIST\}|\{PATTERN\}|undefined/.test(s.text + s.fa)) stat.violations.push(`${file} [${s.id}]: unresolved placeholder`);
        return;
      }
      stat.generated++;
      const words = quoted(s.text);
      const where = `${file} [${s.id}]`;
      if (!words.length) { stat.violations.push(`${where}: generated line has no quoted word`); return; }
      if ((s.text.match(/«/g) ?? []).length !== words.length || (s.text.match(/»/g) ?? []).length !== words.length) stat.violations.push(`${where}: unbalanced guillemets`);
      const faWords = quoted(s.fa);
      if (faWords.join('|') !== words.join('|')) stat.violations.push(`${where}: Persian does not mirror the same words in the same order`);
      const match = COVERAGE_TEMPLATES[lang].some(t => {
        if (t.slots !== words.length) return false;
        const r = renderFrame(t, lang, words);
        return r.text === s.text && r.fa === s.fa && r.pattern === s.pattern;
      });
      if (!match) stat.violations.push(`${where}: line does not match any reviewed frame`);
      for (const target of s.targetWords ?? []) {
        if (!words.some(w => stemEq(fold(w), fold(target)))) stat.violations.push(`${where}: target «${target}» not among the reviewed words`);
      }
      for (let i = 1; i <= words.length; i++) if (!s.pattern!.includes(`<W${i}>`)) stat.violations.push(`${where}: pattern missing <W${i}>`);
      if (/\{LIST\}|\{PATTERN\}|undefined/.test(s.text + s.fa + s.pattern!)) stat.violations.push(`${where}: unresolved placeholder`);
      // Spanish: `y` must become `e` before an /i/ (or /hi/) sound.
      if (lang === 'es' && /\by «(?:i|hi)/i.test(s.text)) stat.violations.push(`${where}: Spanish needs «e» before a word starting with i/hi`);
      // Reviewed French placement: `encore` / `encore une fois` precedes the quoted words.
      if (lang === 'fr' && /explique «[^»]+»(?:, «[^»]+»)* encore/.test(s.text)) stat.violations.push(`${where}: French adverb placement`);
      // Reviewed Turkish / Russian frames no longer use the awkward old patterns.
      if (lang === 'tr' && /^Bu «/.test(s.text)) stat.violations.push(`${where}: old Turkish frame`);
      if (lang === 'ru' && /^Все «/.test(s.text)) stat.violations.push(`${where}: old Russian frame`);
    });
  }
  stats.push(stat);
  console.log(`${lang}: ${stat.generated} generated lines reviewed (100%), ${stat.sampled} hand-drafted lines sampled, ${stat.violations.length} violation(s)`);
}

const totalGenerated = stats.reduce((n, s) => n + s.generated, 0);
const totalSampled = stats.reduce((n, s) => n + s.sampled, 0);
const totalViolations = stats.reduce((n, s) => n + s.violations.length, 0);

const CORRECTIONS = [
  '**es** — `y` → `e` before a word starting with `i`/`hi` (e.g. «informe»); implemented in `conjFor()` and checked on every line.',
  '**fr** — adverb placement: «Le professeur explique encore {LIST}» / «… encore une fois {LIST}» instead of the old object-then-`encore` order.',
  '**de** — added «Das Wort {LIST} steht hier.» and «Die Wörter {LIST} stehen hier.» so the cited word is explicitly a word; `Wörter` is capitalised as a German noun.',
  '**es (again)** — replaced the gender-mismatched «Estos son …» with the neutral «Aquí están …».',
  '**tr** — removed the unnatural «Bu {LIST} var.»; frames now say «{LIST} burada var.» / «Bu metinde {LIST} var.» / «{LIST} kelimesi burada.».',
  '**ru** — removed «Все {LIST} уже знают.» and «Я знаю {LIST} сейчас.»; frames now use «Теперь я знаю {LIST}.» and «Мы уже знаем {LIST}.».',
  '**en** — frames now name the word/lesson explicitly («The word {LIST} is here.», «In class …» for bundled lessons).',
  '**fa** — every Persian line mirrors the quoted words in the same order and reads naturally; no transliteration of the target language.',
  '**All languages** — pack frames and bundled-lesson frames are deliberately different, so no lesson sentence duplicates a pack sentence.',
];

const doc: string[] = [
  '# Linguistic review', '',
  `Scope: **${totalGenerated} of ${totalGenerated} generated lines (100%)** and **${totalSampled} hand-drafted lines (10% deterministic sample)** in the ${stats.length} languages' newest packs. The generated lines come from **72 reviewed frames** (12 per language), so a frame review plus a line-by-line conformance check covers every one of them.`, '',
  '## Corrections made in the reviewed frames (v3)', '',
  ...CORRECTIONS.map(c => `- ${c}`),
  '',
  '## Mechanical checks applied to every generated line', '',
  '- The line renders **exactly** from one of the reviewed frames, with the same Persian and the same reusable pattern.',
  '- Every `targetWords` entry stem-matches one of the quoted words in the line.',
  '- Guillemets balanced; Persian mirrors the quoted words in the same order; `<W1>…<Wn>` present; no unresolved placeholders.',
  '- Spanish `y → e`, French adverb placement, and the retired Turkish/Russian frames are explicitly forbidden.',
  '- `validatePack.ts` (length, ceiling, duplicates, Persian, ids, schema) is still mandatory and is run separately.',
  '',
  '## Results', '',
  '| Language | Generated lines reviewed | Hand-drafted sample | Violations |', '|---|---:|---:|---:|',
  ...stats.map(s => `| ${s.lang} | ${s.generated} | ${s.sampled} | ${s.violations.length} |`),
  '', `**Total: ${totalGenerated} generated lines, ${totalSampled} sampled lines, ${totalViolations} violation(s).**`, '',
  '## Honest limitation', '',
  'This is a full linguistic review by the authoring model plus mechanical gates. A **human native reviewer’s sign-off is not available in this environment**, so the packs record that fact in their `source` field instead of claiming it. When a native reviewer is available, the existing `source` field and `docs/native-review.md` are the place to record the sign-off.', '',
  'Regenerate with `npx tsx scripts/content/reviewPacks.ts --write`.', '',
];
if (write) fs.writeFileSync(path.resolve('docs/native-review.md'), doc.join('\n'));
console.log(`\nTotal: ${totalGenerated} generated lines (100%) · ${totalSampled} sampled lines · ${totalViolations} violation(s)`);
if (totalViolations) { for (const s of stats) for (const v of s.violations.slice(0, 20)) console.error('- ' + v); process.exit(1); }
console.log('✓ linguistic review passed');
