/** Usage: npx tsx scripts/content/gapReport.ts <lang|all> [band] [--limit N] */
import { CEFR_BANDS, COURSE_SPEC, type CefrBand } from '@/lib/content/courseSpec';
import { FREQUENCY, courseReadiness } from '@/lib/content/courseAudit';
import { computeReadiness, type CourseLanguage } from '@/lib/content/readiness';
import { LANGUAGES, lessonsOf } from './courses';

const [, , langArg = 'all', bandArg, ...rest] = process.argv;
const limit = Number(rest[rest.indexOf('--limit') + 1]) || 120;
const langs = langArg === 'all' ? LANGUAGES : [langArg as CourseLanguage];
for (const lang of langs) {
  const lessons = lessonsOf(lang);
  const full = computeReadiness(lang, lessons, FREQUENCY[lang], limit);
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
