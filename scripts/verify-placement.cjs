const assert = require('node:assert/strict');
const path = require('node:path');
const esbuild = require('esbuild');

(async () => {
  const output = path.resolve('node_modules/.cache/placement-test.cjs');
  await esbuild.build({
    stdin: {
      contents: "export * from './lib/placement'; export { SENTENCE_LESSONS } from './lib/courseContent'; export { RUSSIAN_LESSONS } from './lib/languages/russian';",
      resolveDir: process.cwd(),
    },
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: output,
    plugins: [{
      name: 'course-progress-store-mock',
      setup(build) {
        build.onResolve({ filter: /createCourseProgressStore$/ }, () => ({ path: 'course-progress-store', namespace: 'placement-test' }));
        build.onLoad({ filter: /.*/, namespace: 'placement-test' }, () => ({
          contents: 'export function createCourseProgressStore(){ return {}; }',
          loader: 'js',
        }));
      },
    }],
  });

  const app = require(output);
  let checks = 0;
  const check = (condition, message = 'placement invariant failed') => { assert.ok(condition, message); checks += 1; };
  const normalize = value => value.normalize('NFC').replace(/\s+/g, ' ').trim();
  const englishLessons = new Map(app.SENTENCE_LESSONS.map(lesson => [lesson.id, lesson]));
  const russianLessons = new Map(app.RUSSIAN_LESSONS.map(lesson => [lesson.id, lesson]));

  for (const language of ['en', 'ru']) {
    const questions = app.getPlacementQuestions(language);
    const levelIds = app.getPlacementLevelIds(language);
    check(questions.length === 18, `${language}: expected 18 bank items`);
    check(levelIds.length === 6 && levelIds.every((levelId, index) => levelId === index), `${language}: six ordered internal levels`);
    check(levelIds.every(levelId => questions.filter(question => question.levelId === levelId).length === 3), `${language}: three items per band`);
    check(questions.every(question => question.language === language && question.choices.length === 3
      && question.answerIndex >= 0 && question.answerIndex < question.choices.length
      && new Set(question.choices).size === question.choices.length
      && ['meaning', 'detail', 'inference'].includes(question.dimension)), `${language}: well-formed choices and dimensions`);
    check(new Set(questions.map(question => question.answerIndex)).size >= 2, `${language}: answer positions are not uniform`);

    for (const question of questions) {
      if (language === 'en') {
        const source = englishLessons.get(question.sourceLessonId);
        check(!!source, `English source lesson exists: ${question.sourceLessonId}`);
        check(source.levelId === question.levelId, `English source lesson is in matched level: ${question.id}`);
        const sourceText = [
          ...source.sentences.map(sentence => sentence.en ?? sentence.text),
          ...(source.dialogue ?? []).map(turn => turn.text),
        ].filter(Boolean).map(normalize);
        const passageParts = question.passage.match(/[^.!?]+[.!?]?/g)?.map(normalize) ?? [];
        check(passageParts.length > 0 && passageParts.every(part => sourceText.some(line => line === part || line.includes(part) || part.includes(line))), `English excerpt exists in lesson: ${question.id}`);
      } else {
        const source = russianLessons.get(question.sourceLessonId);
        check(!!source, `Russian source lesson exists: ${question.sourceLessonId}`);
        check(source.levelId === question.levelId, `Russian source lesson is in matched level: ${question.id}`);
        check(normalize(question.passage) === normalize(source.sentences[0].text), `Russian excerpt is from course: ${question.id}`);
        const checkItem = source.checks[question.sourceCheckIndex];
        check(!!checkItem && checkItem.promptFa === question.prompt, `Russian question uses the lesson's check: ${question.id}`);
        check(question.choices[question.answerIndex] === checkItem.choices[checkItem.correctIndex], `Russian correct choice is preserved: ${question.id}`);
      }
    }

    const correctAnswers = Object.fromEntries(questions.map(question => [question.id, question.answerIndex]));
    const allCorrect = app.scorePlacement(language, correctAnswers);
    check(allCorrect.questionCount === 18 && allCorrect.correctCount === 18);
    check(allCorrect.answeredCount === 18 && allCorrect.unknownCount === 0);
    check(allCorrect.recommendedLevelId === 5 && allCorrect.perLevel.every(level => level.meetsScreeningThreshold));
    check(!allCorrect.nonMonotonicPattern);

    const allUnknown = Object.fromEntries(questions.map(question => [question.id, -1]));
    const unknownResult = app.scorePlacement(language, allUnknown);
    check(unknownResult.correctCount === 0 && unknownResult.answeredCount === 0 && unknownResult.unknownCount === 18);
    check(unknownResult.recommendedLevelId === 0 && unknownResult.perLevel.every(level => !level.meetsScreeningThreshold));

    const inconsistentAnswers = Object.fromEntries(questions.map(question => [
      question.id,
      question.levelId === 0 ? -1 : question.levelId === 1 ? question.answerIndex : -1,
    ]));
    check(app.scorePlacement(language, inconsistentAnswers).nonMonotonicPattern);
    assert.throws(() => app.scorePlacement(language, { 'not-a-question': 0 }), /Unknown placement question/); checks += 1;
    assert.throws(() => app.scorePlacement(language, { [questions[0].id]: 99 }), /Invalid placement answer/); checks += 1;

    const mixed = {};
    const firstBand = questions.filter(question => question.levelId === 2);
    mixed[firstBand[0].id] = firstBand[0].answerIndex;
    check(app.evaluatePlacementLevel(language, 2, mixed) === 'incomplete');
    let nextItem = app.getPlacementQuestionForLevel(language, 2, mixed);
    check(nextItem?.id === firstBand[1].id, `${language}: first two questions presented before scoring`);
    mixed[firstBand[1].id] = (firstBand[1].answerIndex + 1) % firstBand[1].choices.length;
    check(app.evaluatePlacementLevel(language, 2, mixed) === 'incomplete');
    nextItem = app.getPlacementQuestionForLevel(language, 2, mixed);
    check(nextItem?.id === firstBand[2].id, `${language}: mixed first pair gets one tie-breaker`);
    mixed[firstBand[2].id] = firstBand[2].answerIndex;
    check(app.evaluatePlacementLevel(language, 2, mixed) === 'pass', `${language}: two of three passes`);
    mixed[firstBand[2].id] = (firstBand[2].answerIndex + 1) % firstBand[2].choices.length;
    check(app.evaluatePlacementLevel(language, 2, mixed) === 'fail', `${language}: one of three fails`);

    let move = app.placementTransition(language, 0, 'initial', 'fail');
    check(move.nextLevelId === null && move.recommendedLevelId === 0, `${language}: lowest-band failure recommends foundation`);
    move = app.placementTransition(language, 2, 'initial', 'fail');
    check(move.nextLevelId === 1 && move.nextDirection === 'down');
    move = app.placementTransition(language, 1, 'down', 'pass');
    check(move.nextLevelId === null && move.recommendedLevelId === 2, `${language}: lower-band pass corrects a high self-rating`);
    move = app.placementTransition(language, 2, 'initial', 'pass');
    check(move.nextLevelId === 3 && move.nextDirection === 'up');
    move = app.placementTransition(language, 3, 'up', 'fail');
    check(move.nextLevelId === null && move.recommendedLevelId === 3, `${language}: upper-band failure sets the recommended entry point`);
    move = app.placementTransition(language, 5, 'initial', 'pass');
    check(move.nextLevelId === null && move.recommendedLevelId === 5, `${language}: top level is a valid recommendation`);
  }

  const partial = app.scorePlacement('en', {});
  check(partial.questionCount === 0 && partial.answeredCount === 0 && partial.unknownCount === 0 && partial.recommendedLevelId === 0);
  const attemptedOnly = app.scorePlacement('en', { 'en-foundation-name': 1, 'en-foundation-help': 2 });
  check(attemptedOnly.questionCount === 2 && attemptedOnly.perLevel.length === 1 && attemptedOnly.perLevel[0].total === 2);
  console.log(`${checks} placement checks passed; adaptive English/Russian source-backed items cover six internal bands and route recommendations up/down.`);
})().catch(error => { console.error(error); process.exit(1); });
