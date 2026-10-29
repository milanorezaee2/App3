const assert = require('node:assert/strict');
const path = require('node:path');
const esbuild = require('esbuild');

(async () => {
  const output = path.resolve('node_modules/.cache/english-learning-engine-test.cjs');
  await esbuild.build({
    stdin: {
      contents: "export * from './lib/courseContent'; export * from './lib/englishLearningEngine'; export * from './lib/englishFoundationEvidence'; export { isCorrect } from './lib/englishSupplement/content';",
      resolveDir: process.cwd(),
    },
    bundle: true, platform: 'node', format: 'cjs', outfile: output,
  });
  const app = require(output);
  let checks = 0;
  const check = value => { assert(value); checks += 1; };
  const normalize = text => text.trim().toLowerCase().replace(/[.!?]+$/g, '').replace(/\s+/g, ' ');

  // Six CEFR levels, one blueprint row per level.
  check(app.ENGLISH_ENGINE_BLUEPRINT.length === 6);
  check(app.ENGLISH_ENGINE_STEPS.length === 9);
  check(app.COURSE_LEVELS.length === 6);
  check(app.COURSE_LEVELS.map(l => l.cefr).join('|') === 'A1|A2|B1|B2|C1|C2');
  check(app.ENGLISH_ENGINE_BLUEPRINT.map(item => item.title).join('|') === app.COURSE_LEVELS.map(item => item.title).join('|'));
  check(app.ENGLISH_ENGINE_BLUEPRINT.every((item, index) => item.levelId === index && item.modules.length > 0));
  check(app.ENGLISH_CORE_DATABASE_FLOW.map(item => item.entity).join('|') === 'Situations|Sentence Patterns|Vocabulary|Grammar Through Usage|Dialogues|Exercises|User Progress|Spaced Repetition');

  // Stable course shape: ids, orders and per-lesson counts are inherited.
  check(app.SENTENCE_LESSONS.length === 174);
  check(app.SENTENCE_LESSONS.reduce((sum, l) => sum + l.sentences.length, 0) === 3862);
  check(JSON.stringify(app.SENTENCE_LESSONS.map(l => l.order).sort((a, b) => a - b)) === JSON.stringify(Array.from({ length: 174 }, (_, i) => i + 1)));
  check(new Set(app.SENTENCE_LESSONS.map(l => l.id)).size === 174);
  check(app.SENTENCE_LESSONS[0].id === 'foundation-introducing-yourself');
  check(app.SENTENCE_LESSONS.some(l => l.id === 'survival-past-and-future-plans'));
  check(app.SENTENCE_LESSONS.some(l => l.id === 'everyday-sharing-opinions'));
  check(app.SENTENCE_LESSONS.some(l => l.id === 'communication-writing-a-professional-email'));

  const expected = [
    { id: 0, cefr: 'A1', lessons: 29, sentences: 1450 },
    { id: 1, cefr: 'A2', lessons: 20, sentences: 1000 },
    { id: 2, cefr: 'B1', lessons: 15, sentences: 750 },
    { id: 3, cefr: 'B2', lessons: 37, sentences: 222 },
    { id: 4, cefr: 'C1', lessons: 37, sentences: 223 },
    { id: 5, cefr: 'C2', lessons: 36, sentences: 217 },
  ];
  for (const exp of expected) {
    const lessons = app.SENTENCE_LESSONS.filter(l => l.levelId === exp.id);
    check(lessons.length === exp.lessons);
    check(lessons.reduce((s, l) => s + l.sentences.length, 0) === exp.sentences);
    check(app.COURSE_LEVELS[exp.id].modules.length === exp.lessons);
    check(lessons.every(l => l.title && l.subtitle.includes(exp.cefr) && l.situation));
    check(lessons.every(l => new Set(l.sentences.map(s => normalize(s.en))).size === l.sentences.length));
    check(lessons.every(l => l.sentences.every(s => s.en && s.fa && s.pronunciation && s.pattern && s.vocabulary.length > 0
      && s.vocabulary.every(v => v.word && v.meaning && s.en.toLowerCase().includes(v.word.toLowerCase())))));
    const metrics = app.getEnglishLevelMetrics(exp.id, lessons.slice(0, 2).map(l => l.id));
    check(metrics.lessonCount === exp.lessons && metrics.sentenceCount === exp.sentences && metrics.completedLessonCount === 2);
    check(metrics.patternCount === exp.sentences && metrics.vocabularyCount > 0);
    check(app.getEnglishLevelBlueprint(exp.id).levelId === exp.id);
  }

  // Global uniqueness and the canonical 504 set survive the rewrite.
  const allEn = app.SENTENCE_LESSONS.flatMap(l => l.sentences.map(s => normalize(s.en)));
  check(new Set(allEn).size === allEn.length);
  const tagged = app.SENTENCE_LESSONS.flatMap(l => l.sentences.flatMap(s => s.vocabulary.filter(v => v.essential504).map(v => v.word)));
  check(tagged.length === 504 && new Set(tagged).size === 504);

  // First three CEFR levels keep the fifty-example lesson shape.
  for (const id of [0, 1, 2]) {
    check(app.SENTENCE_LESSONS.filter(l => l.levelId === id).every(l => l.sentences.length === 50));
  }
  // Advanced composition now spans C1 + C2.
  const comp = app.getAdvancedContentComposition();
  check(comp.totalLessonCount === 73 && comp.totalSentenceCount === 440);
  check(comp.scenarioLessonCount + comp.vocabularyPracticeLessonCount === 73);

  // Lesson core projections stay sentence-linked.
  for (const lesson of app.SENTENCE_LESSONS) {
    const core = app.buildEnglishLessonCore(lesson);
    check(core.coreSentences.length === lesson.sentences.length);
    check(core.sentencePatterns.length === lesson.sentences.length);
    check(core.exerciseSourceSentenceIds.join('|') === lesson.sentences.map(s => s.id).join('|'));
    check(core.vocabulary.every(v => v.exampleEn && v.exampleFa && v.sentenceId));
    check(app.getLessonVocabulary(lesson).every(v => lesson.sentences.some(s => s.id === v.sentenceId && s.en === v.exampleEn)));
    check(app.getLessonPatterns(lesson).length === lesson.sentences.length);
  }

  console.log(`${checks} engine checks passed; 6 CEFR levels (A1-C2), 174 lessons, 3862 unique sentences, 504 canonical words retained.`);
})().catch(error => { console.error(error); process.exit(1); });
