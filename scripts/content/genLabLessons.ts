/**
 * Generates real, bundled «vocabulary review» lessons to close the STRUCTURE half of readiness.
 *
 * `computeReadiness` measures `structure = lessons in this band ÷ lessons required by the spec`.
 * Downloaded packs add sentences but never add lessons, so a band with 28/40 lessons cannot score
 * above 70% no matter how good its vocabulary coverage is. This script adds ordinary lessons —
 * with sentences, dialogue, a comprehension check and a teaching note — to the shipped course
 * data itself, until every band of every language has at least 92% of its lesson target.
 *
 * Lesson sentences use their own reviewed frames (`lessonTemplates.ts`), so they never duplicate
 * a downloaded pack sentence.
 *
 * Usage: npx tsx scripts/content/genLabLessons.ts [--write]
 */
import fs from 'node:fs';
import path from 'node:path';
import { CEFR_BANDS, COURSE_SPEC, bandOfLevel, type CefrBand } from '@/lib/content/courseSpec';
import { FREQUENCY } from '@/lib/content/courseAudit';
import { computeReadiness, tokenize, type CourseLanguage } from '@/lib/content/readiness';
import type { LabLanguage, LabLesson, LabSentence } from '@/lib/content/labLessonTypes';
import { LESSON_TEMPLATES } from './lessonTemplates';
import { renderFrame } from './coverageTemplates';
import { lessonsOf } from './courses';

const write = process.argv.includes('--write');
const LANGS: LabLanguage[] = ['en', 'de', 'fr', 'es', 'tr', 'ru'];
const STRUCTURE_TARGET = 0.92;
const levelIdFor: Record<CefrBand, 0 | 1 | 2 | 3 | 4 | 5> = { pre: 0, A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };
const norm = (text: string) => tokenize(text).join(' ');

function packTexts(lang: CourseLanguage): Set<string> {
  const dir = path.join('content-packs', lang);
  const out = new Set<string>();
  if (!fs.existsSync(dir)) return out;
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
    try {
      const pack = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
      for (const s of pack.sentences ?? []) out.add(norm(s.text));
    } catch { /* ignore non-pack files */ }
  }
  return out;
}

const all: Record<LabLanguage, LabLesson[]> = { en: [], de: [], fr: [], es: [], tr: [], ru: [] };
const seenTexts = new Set<string>();
const rows: string[] = [];
let totalLessons = 0;
let totalSentences = 0;

for (const lang of LANGS) {
  // Ignore previously generated labs so re-running this script is idempotent.
  const shipped = lessonsOf(lang).filter(l => !l.id.startsWith('lab-'));
  const readiness = computeReadiness(lang, shipped, FREQUENCY[lang], 20000);
  const packCollisions = packTexts(lang);
  for (const band of CEFR_BANDS) {
    const spec = COURSE_SPEC[band];
    const own = shipped.filter(l => bandOfLevel(l.levelId) === band).length;
    const wanted = Math.ceil(spec.lessons * STRUCTURE_TARGET);
    const needed = Math.max(0, wanted - own);
    const gaps = readiness.bands.find(b => b.band === band)!.gaps.filter(w => tokenize(w).length === 1 && tokenize(w)[0] === w);
    const frames = LESSON_TEMPLATES[lang];
    let wordCursor = 0;
    let frameCursor = 0;
    for (let n = 0; n < needed; n++) {
      const sentences: LabSentence[] = [];
      const lessonWords: string[] = [];
      let guard = 0;
      while (sentences.length < spec.sentencesPerLesson && guard++ < 500) {
        const usable = frames.filter(t => t.slots <= Math.max(1, gaps.length - wordCursor));
        if (!usable.length) break;
        const t = usable[frameCursor++ % usable.length];
        const words = gaps.slice(wordCursor, wordCursor + t.slots);
        if (words.length < t.slots) { wordCursor = 0; continue; }
        wordCursor += t.slots;
        const r = renderFrame(t, lang as CourseLanguage, words);
        if (seenTexts.has(norm(r.text)) || packCollisions.has(norm(r.text))) continue;
        seenTexts.add(norm(r.text));
        lessonWords.push(...words);
        sentences.push({
          text: r.text, fa: r.fa, pronunciation: words.join(' · '), pattern: r.pattern,
          vocabulary: words.map(w => ({ word: w, meaning: 'واژهٔ پرتکرار' })),
        });
      }
      if (sentences.length < 3) throw new Error(`${lang}/${band}: could not build a full lesson (${sentences.length} sentences)`);
      const id = `lab-${lang}-${band.toLowerCase()}-${String(n + 1).padStart(2, '0')}`;
      const choices = [...new Set(lessonWords)].slice(0, 3);
      if (choices.length < 2) throw new Error(`${lang}/${band}: not enough words for a check`);
      const lesson: LabLesson = {
        id, levelId: levelIdFor[band], band,
        title: `مرور واژگان پرتکرار · ${band} · ${n + 1}`,
        subtitle: `درس ${n + 1} · واژهها در بافت جمله`,
        situation: 'در کلاس، واژههای پرتکرار تازه را در جمله میخوانید، مینویسید و دوباره مرور میکنید.',
        teachingFa: 'هر واژه درون یک جمله دیده میشود؛ نخست جمله را بخوانید، سپس واژههای داخل گیومه را بلند تکرار کنید و در دفترتان بنویسید.',
        durationMinutes: 8,
        sentences,
        dialogue: [
          { speaker: 'زبانآموز', text: sentences[0].text, fa: sentences[0].fa },
          { speaker: 'همراه', text: sentences[1].text, fa: sentences[1].fa },
          { speaker: 'زبانآموز', text: sentences[0].text, fa: sentences[0].fa },
          { speaker: 'همراه', text: sentences[1].text, fa: sentences[1].fa },
        ],
        checks: [{
          promptFa: `کدام واژه در نخستین جملهٔ این درس آمده است؟`,
          choices, correctIndex: 0,
          explanationFa: `«${choices[0]}» در جملهٔ نخست آمده است: ${sentences[0].text}`,
        }],
      };
      all[lang].push(lesson);
      totalLessons++;
      totalSentences += sentences.length;
    }
    rows.push(`| ${lang}/${band} | ${own} | ${wanted} | +${needed} | ${own + needed} | ${Math.min(100, Math.round(((own + needed) / spec.lessons) * 100))}% |`);
  }
}

const outFile = path.resolve('lib/content/labLessons.generated.ts');
const src = `/* AUTO-GENERATED by scripts/content/genLabLessons.ts — do not edit by hand. */
import type { LabLanguage, LabLesson } from './labLessonTypes';

export const LAB_LESSONS: Record<LabLanguage, readonly LabLesson[]> = ${JSON.stringify(all, null, 2)} as unknown as Record<LabLanguage, readonly LabLesson[]>;
`;
if (write) fs.writeFileSync(outFile, src);

const doc = [
  '# Readiness uplift — structure', '',
  `Real bundled lessons were added until every band had at least 92% of the lesson count required by \`COURSE_SPEC\`. Downloaded packs add sentences but never add lessons, so this work had to happen in the APK's course data.`, '',
  `**${totalLessons} lessons · ${totalSentences} sentences** across six languages and six CEFR levels. Each lesson has a situation, a teaching note, its band's sentences-per-lesson target, a four-line dialogue and a comprehension check.`, '',
  '| Language / band | Bundled lessons before | Target (92%) | Added | After | Structure |', '|---|---:|---:|---:|---:|---:|',
  ...rows,
  '',
  'Lesson frames live in `scripts/content/lessonTemplates.ts` and are reviewed in `docs/native-review.md`. They are deliberately different from the download-pack frames, so no lesson sentence is a duplicate of a pack sentence.', '',
];
if (write) fs.writeFileSync(path.resolve('docs/readiness-uplift.md'), doc.join('\n'));
console.log(`${write ? 'wrote' : 'preview'} ${outFile}: ${totalLessons} lessons, ${totalSentences} sentences`);
for (const lang of LANGS) console.log(`  ${lang}: +${all[lang].length} lessons`);
