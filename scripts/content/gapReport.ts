/** Usage: npx tsx scripts/content/gapReport.ts <lang|all> [band] [--limit N] [--with-packs] [--words-only] */
import fs from 'node:fs';
import path from 'node:path';
import { CEFR_BANDS, COURSE_SPEC, type CefrBand } from '@/lib/content/courseSpec';
import { FREQUENCY, courseReadiness } from '@/lib/content/courseAudit';
import { computeReadiness, type CourseLanguage } from '@/lib/content/readiness';
import { LANGUAGES, lessonsOf } from './courses';

const [, , langArg = 'all', bandMaybe, ...restArg] = process.argv;
const bandArg = CEFR_BANDS.includes(bandMaybe as CefrBand) ? bandMaybe as CefrBand : undefined;
const rest = bandArg ? restArg : (bandMaybe ? [bandMaybe, ...restArg] : restArg);
const limit = Number(rest[rest.indexOf('--limit') + 1]) || 120;
const withPacks = rest.includes('--with-packs');
const wordsOnly = rest.includes('--words-only');
const levelIdFor: Record<string, number> = { pre: -1, A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };
function packLessons(lang: string) {
  const dir = path.join('content-packs', lang);
  if (!withPacks || !fs.existsSync(dir)) return [];
  const newest = new Map<string, string>();
  for (const f of fs.readdirSync(dir)) {
    const m = f.match(/^(pre|A1|A2|B1|B2|C1)\.v(\d+)\.json$/);
    if (!m) continue;
    const have = newest.get(m[1]);
    if (!have || Number(m[2]) > Number(have.match(/v(\d+)/)![1])) newest.set(m[1], f);
  }
  return [...newest.values()].map(f => {
    const p = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    return { id: `pack:${p.band}`, levelId: levelIdFor[p.band], title: 'pack', sentences: p.sentences.map((x: any) => ({ text: x.text, pattern: x.pattern })), hasDialogue: false, checks: 0 };
  });
}
const langs = langArg === 'all' ? LANGUAGES : [langArg as CourseLanguage];
for (const lang of langs) {
  const lessons = [...lessonsOf(lang), ...packLessons(lang)] as ReturnType<typeof lessonsOf>;
  const full = computeReadiness(lang, lessons, FREQUENCY[lang], limit);
  if (wordsOnly) { for (const band of (bandArg ? [bandArg as CefrBand] : CEFR_BANDS)) { const b = full.bands.find(x => x.band === band)!; console.log(b.gaps.join('\n')); } continue; }
  console.log(`\n=== ${lang} · ${full.uniqueWords} unique words in ${lessons.length} lessons`);
  const bands = bandArg ? [bandArg as CefrBand] : CEFR_BANDS;
  for (const band of bands) {
    const b = full.bands.find(x => x.band === band)!;
    const spec = COURSE_SPEC[band];
    console.log(`\n[${band}] readiness ${b.readiness}% · structure ${b.structure}% (${b.lessons}/${b.lessonsTarget} lessons, ${b.sentences}/${b.sentencesTarget} sentences, patterns ${b.patterns}/${b.patternsTarget}, dialogue ${b.lessonsWithDialogue}/${b.lessons}, checks ${b.lessonsWithChecks}/${b.lessons}) · coverage ${b.coverage}% (${b.coveredWords}/${b.vocabularyCeiling}, ${spec.sentencesPerLesson} sentences/lesson target)`);
    if (b.gaps.length) console.log(`gaps (${b.gaps.length} shown, most frequent first):\n${b.gaps.join(' ')}`);
  }
}
void courseReadiness;
