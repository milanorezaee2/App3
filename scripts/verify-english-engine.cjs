const assert = require('node:assert/strict');
const path = require('node:path');
const { createHash } = require('node:crypto');
const esbuild = require('esbuild');

(async () => {
  const output = path.resolve('node_modules/.cache/english-learning-engine-test.cjs');
  await esbuild.build({
    stdin: {
      contents: "export * from './lib/courseContent'; export * from './lib/courseContentB1Independent'; export * from './lib/courseContentB2UpperIntermediate'; export * from './lib/courseContentB2Expansion'; export * from './lib/englishB2Practice'; export * from './lib/englishB2Scenarios'; export * from './lib/courseContentC1Advanced'; export * from './lib/englishC1Practice'; export * from './lib/englishC1Reading'; export * from './lib/englishC1ExtendedModels'; export * from './lib/englishC1AppliedAssessment'; export * from './lib/courseContentA2Foundation'; export * from './lib/englishLearningEngine'; export * from './lib/englishFoundationEvidence'; export { isCorrect } from './lib/englishSupplement/content';",
      resolveDir: process.cwd(),
    },
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: output,
  });
  const app = require(output);
  let checks = 0;
  const check = value => { assert(value); checks += 1; };

  check(app.ENGLISH_ENGINE_BLUEPRINT.length === 6);
  check(app.ENGLISH_ENGINE_STEPS.length === 9);
  check(app.ENGLISH_ENGINE_BLUEPRINT.map(item => item.title).join('|') === app.COURSE_LEVELS.map(item => item.title).join('|'));
  check(app.ENGLISH_ENGINE_BLUEPRINT.every((item, index) => item.levelId === index && item.modules.length > 0));
  check(app.ENGLISH_ENGINE_BLUEPRINT[0].modules.length === 10 && app.COURSE_LEVELS[0].modules.length === 10);
  check(app.SENTENCE_LESSONS.length === 212);
  check(app.EXISTING_SENTENCE_LESSONS.length === 174 && app.EXISTING_SENTENCE_LESSONS.every(lesson => { const actual = app.SENTENCE_LESSONS.find(item => item.id === lesson.id); if (!actual) return false; const { a2Section, ...rest } = actual; return JSON.stringify({ ...rest, order: lesson.order }) === JSON.stringify(lesson); }));
  check(app.B1_INDEPENDENT_UNITS.length === 11 && app.B1_INDEPENDENT_UNITS.reduce((n, unit) => n + unit.topics.length, 0) === 55 && app.B1_INDEPENDENT_UNITS.every(unit => unit.topics.length === unit.rows.length));
  check(app.SENTENCE_LESSONS.reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 4242);
  check(app.ENGLISH_CORE_DATABASE_FLOW.map(item => item.entity).join('|') === 'Situations|Sentence Patterns|Vocabulary|Grammar Through Usage|Dialogues|Exercises|User Progress|Spaced Repetition');

  const foundation = app.SENTENCE_LESSONS.filter(lesson => lesson.levelId === 0);
  const survival = app.SENTENCE_LESSONS.filter(lesson => lesson.levelId === 1);
  const a2Bridge = app.SENTENCE_LESSONS.filter(lesson => lesson.a2Section === 'foundation');
  const everyday = app.EVERYDAY_COURSE_LESSON_IDS.map(id => app.SENTENCE_LESSONS.find(lesson => lesson.id === id));
  check(a2Bridge.length === 5 && a2Bridge.every(lesson => lesson.sentences.length === 10 && lesson.dialogue.length === 6 && lesson.sentences.every(sentence => sentence.en && sentence.fa && sentence.pronunciation && sentence.pattern && sentence.vocabulary.length === 2 && sentence.vocabulary.every(v => sentence.en.toLowerCase().includes(v.word.toLowerCase())))));
  const a2Path = app.SENTENCE_LESSONS.filter(lesson => lesson.levelId === 2);
  check(a2Path.slice(0, 5).every(lesson => lesson.a2Section === 'foundation') && a2Path.slice(5, 20).every(lesson => lesson.a2Section === 'survival') && a2Path.slice(20).every(lesson => lesson.a2Section === 'legacy'));
  const communication = app.SENTENCE_LESSONS.filter(lesson => lesson.levelId === 3 && !lesson.b1Section);
  const advanced = app.SENTENCE_LESSONS.filter(lesson => lesson.levelId === 4 && !lesson.b2Section);
  const b2 = app.SENTENCE_LESSONS.filter(lesson => !!lesson.b2Section);
  check(app.B2_UPPER_INTERMEDIATE_UNITS.length === 11 && app.B2_UPPER_INTERMEDIATE_UNITS.reduce((n, unit) => n + unit.topics.length, 0) === 55 && app.B2_UPPER_INTERMEDIATE_UNITS.every(unit => unit.topics.length === unit.rows.length));
  check(b2.length === 11 && b2.filter(lesson => lesson.b2Section === 'foundation').length === 5 && b2.filter(lesson => lesson.b2Section === 'survival').length === 6);
  check(b2.every(lesson => lesson.sentences.length === 15 && lesson.dialogue.length === 6 && lesson.dialogue.every((turn, index) => turn.speaker === (index % 2 ? 'learner' : 'partner') && turn.text && turn.fa) && lesson.sentences.every(sentence => sentence.en && sentence.fa && sentence.pronunciation && sentence.pattern && sentence.vocabulary.length && sentence.vocabulary.every(v => sentence.en.toLowerCase().includes(v.word.toLowerCase())))));
  check(Object.keys(app.B2_EXPANSION).length === 11 && Object.keys(app.B2_GUIDANCE).length === 11 && Object.keys(app.B2_OPTIONAL_PRACTICE).length === 11 && Object.keys(app.B2_PRODUCTION).length === 11);
  const optionalIds = new Set();
  for (const unit of app.B2_UPPER_INTERMEDIATE_UNITS) {
    const lesson = b2.find(item => item.id === unit.id);
    const extra = app.B2_EXPANSION[unit.id];
    const tasks = app.B2_OPTIONAL_PRACTICE[unit.id];
    const topics = app.B2_TOPIC_PRACTICE[unit.id];
    const scenario = app.B2_SCENARIOS[unit.id];
    check(topics.length === 5 && topics.map(item => item.topic).join('|') === '1|2|3|4|5');
    check(topics.every(({task}) => task.prompt && task.explanation && task.options.length === 3 && new Set(task.options).size === 3 && task.answers.length === 1 && task.options.includes(task.answers[0]) && app.isCorrect(task, task.answers[0]) && task.options.filter(option => option !== task.answers[0]).every(option => !app.isCorrect(task, option))));
    check(tasks.every(task => topics.some(item => item.task === task)));
    check(topics.every(({task}) => { if (optionalIds.has(task.id)) return false; optionalIds.add(task.id); return !app.CORE_LESSON_EVIDENCE[unit.id].some(core => core.id === task.id); }));
    check(!!scenario && !!scenario.situation && !!scenario.task && !!scenario.sample && !!scenario.translation && !!scenario.explanation && scenario.checklist.length === 3 && scenario.checklist.every(Boolean));
    check(extra.length === 10 && !!app.B2_PRODUCTION[unit.id] && app.B2_GUIDANCE[unit.id].length === 5 && app.B2_GUIDANCE[unit.id].every(Boolean));
    check(lesson.sentences.slice(0, 5).every((sentence, i) => sentence.id === `${unit.id}-s${i + 1}` && sentence.en === unit.rows[i][0]));
    check(lesson.sentences.slice(5).every((sentence, i) => sentence.id === `${unit.id}-s${i + 6}` && sentence.en === extra[i][0]));
    check(tasks.length === 2 && tasks.every(task => task.id.startsWith(`${unit.id}-transfer-`) && task.options.length === 3 && new Set(task.options).size === 3 && task.options.includes(task.answers[0]) && app.isCorrect(task, task.answers[0]) && task.explanation));
    check(app.CORE_LESSON_EVIDENCE[unit.id].length === 6 && app.CORE_LESSON_EVIDENCE[unit.id].every(task => !task.id.includes('-transfer-')));
  }
  check(optionalIds.size === 55 && Object.keys(app.B2_TOPIC_PRACTICE).length === 11 && Object.keys(app.B2_SCENARIOS).length === 11);
  const c1Units = app.C1_ADVANCED_UNITS;
  check(c1Units.length === 11 && c1Units.filter(unit => unit.section === 'foundation').length === 5 && c1Units.filter(unit => unit.section === 'survival').length === 6);
  check(c1Units.reduce((n, unit) => n + unit.topics.length, 0) === 55 && c1Units.every(unit => unit.topics.length === 5));
  const c1Ids = new Set();
  for (const unit of c1Units) {
    const lesson = app.SENTENCE_LESSONS.find(item => item.id === unit.id);
    const practices = app.C1_TOPIC_PRACTICE[unit.id];
    const scenario = app.C1_SCENARIOS[unit.id];
    const application = app.C1_APPLICATION_PRACTICE[unit.id]?.[0]?.task;
    check(application && application.source && application.options.length === 3 && new Set(application.options).size === 3 && app.isCorrect(application, application.answers[0]) && application.options.filter(o => o !== application.answers[0]).every(o => !app.isCorrect(application, o)) && application.explanation);
    check(lesson.levelId === 5 && lesson.c1Section === unit.section && lesson.sentences.length === 10 && lesson.dialogue.length === 6);
    check(lesson.sentences.every(sentence => sentence.en && sentence.fa && sentence.pronunciation && sentence.vocabulary.length === 1 && sentence.en.toLowerCase().includes(sentence.vocabulary[0].word.toLowerCase())));
    check(new Set(lesson.sentences.map(sentence => sentence.id)).size === 10 && new Set(lesson.sentences.map(sentence => sentence.en)).size === 10);
    check(unit.topics.every(topic => topic[0] && topic[5]));
    check(practices.length === 5 && practices.every(({topic, task}, index) => topic === index + 1 && task.source && task.options.length === 3 && new Set(task.options).size === 3 && task.options.includes(task.answers[0]) && app.isCorrect(task, task.answers[0]) && task.options.filter(o => o !== task.answers[0]).every(o => !app.isCorrect(task, o)) && task.explanation));
    check(practices.every(({task}) => { if (c1Ids.has(task.id)) return false; c1Ids.add(task.id); return true; }));
    check(scenario.situation && scenario.task && scenario.sample && scenario.translation && scenario.explanation && scenario.checklist.length === 3 && scenario.checklist.every(Boolean));
    const checks = app.CORE_LESSON_EVIDENCE[unit.id];
    check(checks.length === 3 && checks.map(task => task.skill).join('|') === 'listening|reading|writing' && checks.every(task => task.answers.every(answer => app.isCorrect(task, answer))));
  }
  check(c1Ids.size === 55);
  // Existing open scenarios and contextual exercise IDs and wording remain unchanged.
  const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
  check(digest(app.C1_SCENARIOS) === 'dcea833f28a478d30845424807776734e8e024122fb98d7c8b80701a174a9b88');
  check(digest(app.C1_APPLICATION_PRACTICE) === '9e05501bc91a70b65473af6dbbed3c2fbc0da78dbcc40495cecef0a5bae21935');
  check(Object.keys(app.C1_READINGS).length === 11 && Object.keys(app.C1_EXTENDED_MODELS).length === 11);
  const readingIds = new Set();
  const appliedIds = new Set();
  check(Object.keys(app.C1_ADDITIONAL_APPLICATION).length === 11);
  for (const unit of c1Units) {
    const reading = app.C1_READINGS[unit.id];
    const model = app.C1_EXTENDED_MODELS[unit.id];
    const newApplication = app.C1_ADDITIONAL_APPLICATION[unit.id];
    check(newApplication?.length === 1 && newApplication[0].topic === 1);
    const appliedTask = newApplication[0].task;
    check(appliedTask.id === `${unit.id}-application-2-v1` && appliedTask.source && appliedTask.prompt && appliedTask.explanation && appliedTask.options.length === 3 && new Set(appliedTask.options).size === 3 && appliedTask.options.includes(appliedTask.answers[0]) && app.isCorrect(appliedTask, appliedTask.answers[0]) && appliedTask.options.filter(o => o !== appliedTask.answers[0]).every(o => !app.isCorrect(appliedTask, o)));
    check(!appliedIds.has(appliedTask.id) && !c1Ids.has(appliedTask.id) && !app.CORE_LESSON_EVIDENCE[unit.id].some(task => task.id === appliedTask.id) && app.C1_APPLICATION_PRACTICE[unit.id].every(item => item.task.id !== appliedTask.id)); appliedIds.add(appliedTask.id);
    check(!!reading && !!reading.title && !!reading.translation && reading.passage.split(/\s+/).length >= 65 && reading.passage.split(/\s+/).length <= 130);
    check(reading.questions.length === 2 && reading.questions.every((task, index) => task.id === `${unit.id}-reading-passage-${index + 1}-v1` && task.skill === 'reading' && task.prompt && task.explanation && task.options.length === 3 && new Set(task.options).size === 3 && task.options.includes(task.answers[0]) && app.isCorrect(task, task.answers[0]) && task.options.filter(option => option !== task.answers[0]).every(option => !app.isCorrect(task, option))));
    check(reading.questions.every(task => { if (readingIds.has(task.id) || c1Ids.has(task.id) || app.CORE_LESSON_EVIDENCE[unit.id].some(existing => existing.id === task.id) || app.C1_APPLICATION_PRACTICE[unit.id].some(existing => existing.task.id === task.id) || appliedIds.has(task.id)) return false; readingIds.add(task.id); return true; }));
    check(!!model && !!model.format && !!model.translation && !!model.guidance && model.sample.split(/\s+/).length >= 65 && model.criteria.length === 4 && new Set(model.criteria).size === 4 && model.criteria.every(Boolean));
    const mandatory = app.CORE_LESSON_EVIDENCE[unit.id];
    const saved = Object.fromEntries(mandatory.map(task => [task.id, { skill: task.skill, correct: true, heard: true, attempts: 1 }]));
    // New optional exercises must never invalidate an already completed lesson.
    check(app.isCoreLessonEvidenceComplete(unit.id, { ...saved, [reading.questions[0].id]: { skill: 'reading', correct: false, heard: false, attempts: 1 } }));
    check(!app.isCoreLessonEvidenceComplete(unit.id, { ...saved, [mandatory[0].id]: { ...saved[mandatory[0].id], heard: false } }));
  }
  check(readingIds.size === 22 && appliedIds.size === 11);
  check(app.SENTENCE_LESSONS.filter(lesson => lesson.levelId === 4).slice(0, 11).every(lesson => !!lesson.b2Section));
  check(foundation.length === 10 && foundation.reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 500);
  check(foundation.every(lesson => lesson.sentences.length === 50 && lesson.sentences.every(sentence => sentence.fa && sentence.pronunciation && sentence.pattern && sentence.vocabulary.length > 0)));
  check(foundation.every(lesson => new Set(lesson.sentences.map(sentence => sentence.en)).size === 50
    && lesson.sentences.map(sentence => sentence.id).join('|') === Array.from({ length: 50 }, (_, index) => `s${index + 1}`).join('|')));
  check(foundation.map(lesson => lesson.id).join('|') === ['foundation-introducing-yourself', 'foundation-asking-for-help', 'foundation-buying-something', ...app.FOUNDATION_EXPANSION_LESSON_IDS].join('|'));
  check(app.FOUNDATION_EXPANSION_LESSON_IDS.length === 7 && foundation.slice(3).every(lesson => lesson.dialogue.length >= 6));
  // Guard the revised level-one examples and their linked writing checks.
  const example = (lessonId, sentenceId) => foundation.find(lesson => lesson.id === lessonId)?.sentences.find(sentence => sentence.id === sentenceId);
  const routine = 'foundation-everyday-routine';
  const objects = 'foundation-objects-and-places';
  const reading = example(routine, 's44');
  check(reading.en === 'I am reading now.' && reading.fa === 'من الان دارم مطالعه می‌کنم.');
  check(['She is not working now.', 'Are you studying now?', 'I can swim.', 'I cannot swim.']
    .every((text, index) => example(routine, ['s45', 's46', 's47', 's49'][index])?.en === text));
  check(example(routine, 's41').en.includes(' but ') && example(routine, 's43').en.includes(' or '));
  check(example(objects, 's36').en === 'The clock is round.' && example(objects, 's37').en === 'This box is square.');
  check(example('foundation-asking-for-help', 's17').en.startsWith('The numbers are ') && example('foundation-asking-for-help', 's17').fa.includes('این عددها'));
  check(example('foundation-numbers-and-contact', 's47').en === 'My home phone is not working.');
  check(example(routine, 's33').en === 'I wash my clothes on Sunday.');
  const readingTask = app.FOUNDATION_LESSON_EVIDENCE[routine].find(task => task.id.endsWith('action-now-writing'));
  const shapeTask = app.FOUNDATION_LESSON_EVIDENCE[objects].find(task => task.id.endsWith('shape-writing'));
  check(readingTask.prompt.includes(reading.fa) && readingTask.answers.includes(reading.en));
  check(shapeTask.prompt.includes(example(objects, 's36').fa) && shapeTask.answers.includes(example(objects, 's36').en));
  const contactDialogue = foundation.find(lesson => lesson.id === 'foundation-numbers-and-contact').dialogue;
  check(contactDialogue.some(turn => turn.text === 'My phone number is 555-0142.')
    && contactDialogue.some(turn => turn.text === 'Five, five, five, zero, one, four, two.'));
  const weather = survival.find(lesson => lesson.id === 'survival-weather-and-seasons').sentences.find(sentence => sentence.id === 's10');
  check(weather.en === 'The weather will be better tomorrow.' && weather.fa === 'هوا فردا بهتر خواهد بود.');
  // Dialogue practice consumes partner/learner pairs; no line in either first-level section is silently skipped.
  check([...foundation, ...survival].every(lesson => lesson.dialogue.length >= 6 && lesson.dialogue.length % 2 === 0
    && lesson.dialogue.every((turn, index) => turn.speaker === (index % 2 === 0 ? 'partner' : 'learner') && turn.text && turn.fa)));
  const job = survival.find(lesson => lesson.id === 'survival-job-interview');
  check(job.sentences.find(sentence => sentence.id === 'job-qualify').en === 'I want this job.');
  check(app.SENTENCE_LESSONS.filter(lesson => lesson.levelId === 2).every(lesson => lesson.sentences.every(sentence => sentence.vocabulary.every(item => !item.essential504))));
  const removed504 = require('../assets/data/essential504-removed-level2.json');
  const level2Text = a2Path.flatMap(lesson => [...lesson.sentences.map(sentence => sentence.en), ...lesson.dialogue.map(turn => turn.text)]);
  check(removed504.length === 27 && removed504.every(word => level2Text.every(text => !new RegExp(`\\b${word}\\b`, 'i').test(text))));
  check(everyday.slice(0, 5).every(lesson => lesson.dialogue.length >= 6 && lesson.dialogue.every((turn, index) => turn.speaker === (index % 2 ? 'learner' : 'partner'))));
  check([...foundation, ...survival].every(lesson => lesson.sentences.every(sentence => sentence.vocabulary.every(item => !['keen', 'qualify', 'data', 'talent', 'vacant', 'minimum', 'annual'].includes(item.word)))));
  const emergency = survival.find(lesson => lesson.id === 'survival-health-and-pharmacy').sentences.find(sentence => sentence.id === 'health-urgent-care');
  check(emergency.en === 'In an emergency, call emergency services.');


  check(survival.length === 19 && survival.reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 950);
  check(survival.every(lesson => lesson.sentences.length === 50 && lesson.durationMinutes === 35
    && lesson.sentences.every(sentence => !!sentence.fa && !!sentence.pronunciation && sentence.vocabulary.length > 0)
    && new Set(lesson.sentences.map(sentence => sentence.id)).size === 50
    && new Set(lesson.sentences.map(sentence => sentence.en.trim().toLowerCase())).size === 50));
  check(new Set(survival.flatMap(lesson => lesson.sentences.map(sentence => sentence.en.trim().toLowerCase()))).size === 950);
  const survivalVocabulary = new Set(survival.flatMap(lesson => lesson.sentences.flatMap(sentence => sentence.vocabulary.map(item => item.word))));
  check(survivalVocabulary.size === 1303);
  check(everyday.length === 20 && everyday.reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 1000);
  check(everyday.map(lesson => lesson.id).join('|') === app.EVERYDAY_COURSE_LESSON_IDS.join('|')
    && app.EVERYDAY_COURSE_LESSON_IDS.length === 20);
  check(everyday.slice(0, 5).map(lesson => lesson.id).join('|') === [
    'everyday-facing-a-challenge', 'everyday-making-a-plan', 'everyday-handling-a-misunderstanding',
    'everyday-talking-about-weather', 'everyday-handling-an-emergency',
  ].join('|'));
  check(app.EVERYDAY_EXPANSION_LESSON_IDS.length === 15
    && everyday.slice(5).map(lesson => lesson.id).join('|') === app.EVERYDAY_EXPANSION_LESSON_IDS.join('|'));
  check(everyday.every(lesson => lesson.sentences.length === 50 && lesson.durationMinutes === 35
    && new Set(lesson.sentences.map(sentence => sentence.id)).size === 50
    && new Set(lesson.sentences.map(sentence => sentence.en.trim().toLowerCase().replace(/[.!?]+$/g, '').replace(/[’']/g, "'").replace(/\s+/g, ' '))).size === 50));
  check(new Set(everyday.flatMap(lesson => lesson.sentences.map(sentence => sentence.en.trim().toLowerCase()
    .replace(/[.!?]+$/g, '').replace(/[’']/g, "'").replace(/\s+/g, ' ')))).size === 1000);
  check(everyday.every((lesson, index) => {
    const originalCount = index < 5 ? 6 : 10;
    const additions = lesson.sentences.slice(originalCount);
    return additions.length === 50 - originalCount && additions.every(sentence => sentence.fa && sentence.pronunciation
      && sentence.pattern && sentence.vocabulary.length >= 2
      && sentence.vocabulary.every(item => item.word && item.meaning && sentence.en.toLowerCase().includes(item.word.toLowerCase())));
  }));
  check(everyday.slice(5).every(lesson => lesson.dialogue.length >= 6));
  check(foundation.slice(0, 3).map(lesson => lesson.id).join('|') === 'foundation-introducing-yourself|foundation-asking-for-help|foundation-buying-something');
  check(communication.length === 15 && communication.reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 750);
  check(communication.map(lesson => lesson.id).join('|') === app.COMMUNICATION_COURSE_LESSON_IDS.join('|')
    && app.COMMUNICATION_COURSE_LESSON_IDS.length === 15);
  check(communication.every(lesson => lesson.sentences.length === 50 && lesson.durationMinutes === 35
    && new Set(lesson.sentences.map(sentence => sentence.id)).size === 50
    && new Set(lesson.sentences.map(sentence => sentence.en.trim().toLowerCase()
      .replace(/[.!?]+$/g, '').replace(/[’']/g, "'").replace(/\s+/g, ' '))).size === 50
    && lesson.unitId && lesson.unitTitle && lesson.unitTitleEn
    && lesson.sentences.slice(6).length === 44
    && lesson.sentences.slice(6).every(sentence => sentence.fa && sentence.pronunciation && sentence.pattern
      && sentence.vocabulary.length >= 2
      && sentence.vocabulary.every(item => item.word && item.meaning
        && sentence.en.toLowerCase().includes(item.word.toLowerCase())))));
  const communicationUnitIds = app.COMMUNICATION_MODULES.flatMap(unit => unit.lessonIds);
  check(app.COMMUNICATION_MODULES.length === 8
    && new Set(communicationUnitIds).size === 15
    && communicationUnitIds.length === app.COMMUNICATION_COURSE_LESSON_IDS.length
    && app.COMMUNICATION_COURSE_LESSON_IDS.every(id => communicationUnitIds.includes(id))
    && app.ENGLISH_ENGINE_BLUEPRINT[3].modules.join('|') === app.COMMUNICATION_MODULES.map(unit => unit.titleEn).join('|')
    && app.COURSE_LEVELS[3].modules.join('|') === app.COMMUNICATION_MODULES.map(unit => unit.titleFa).join('|'));
  check(advanced.length === 110 && advanced.reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 662);
  const advancedComposition = app.getAdvancedContentComposition();
  assert.deepEqual(advancedComposition, {
    scenarioLessonCount: 52,
    scenarioSentenceCount: advanced.filter(lesson => lesson.contentKind === 'scenario').reduce((sum, lesson) => sum + lesson.sentences.length, 0),
    vocabularyPracticeLessonCount: 58,
    vocabularyPracticeSentenceCount: advanced.filter(lesson => lesson.contentKind === 'vocabulary-practice').reduce((sum, lesson) => sum + lesson.sentences.length, 0),
    totalLessonCount: 121,
    totalSentenceCount: 827,
  }); checks += 1;
  check(advanced.every(lesson => lesson.contentKind === 'scenario' || lesson.contentKind === 'vocabulary-practice'));
  check(advanced.slice(0, 52).every(lesson => lesson.contentKind === 'scenario')
    && advanced.slice(52).every(lesson => lesson.contentKind === 'vocabulary-practice'));
  check(!app.ENGLISH_ENGINE_BLUEPRINT[4].modules.some(module => /IELTS|Academic English|Writing Skills|Professional Speaking/i.test(module)));
  check(app.COURSE_LEVELS[4].cefr.includes('B2'));
  check(survival.map(lesson => lesson.id).join('|') === [
    'survival-job-interview', 'survival-renting-a-home', 'survival-personal-information',
    'survival-directions-and-neighborhood', 'survival-public-transport', 'survival-cafe-and-food',
    'survival-shopping-and-clothing', 'survival-appointments-and-time', 'survival-health-and-pharmacy',
    'survival-hobbies-and-free-time', 'survival-invitations-and-plans', 'survival-weather-and-seasons',
    'survival-travel-and-tickets', 'survival-hotel-and-stay', 'survival-phone-and-messages',
    'survival-services-and-post-office', 'survival-school-and-learning', 'survival-current-activities',
    'survival-past-and-future-plans',
  ].join('|'));
  const topicChecks = [
    ['foundation-introducing-yourself', ['How do you spell your name?', 'This is my friend, Reza.', 'What is her name?', 'How are you?', 'Where do you live?', 'Goodbye. See you later.']],
    ['foundation-asking-for-help', ['What time is it?', 'It is half past seven.', 'My phone number is 555-0142.', 'There are twelve months in a year: January, February, March, April, May, June, July, August, September, October, November, and December.', 'The bus leaves at eight thirty a.m.', 'Turn left at the corner.', 'I need the number five bus.']],
    ['foundation-buying-something', ['I need two apples.', 'These apples cost three dollars.', 'How much is a kilo of rice?', 'I need a loaf of bread.', 'Could I have a sandwich, please?', 'Can I pay in cash?', 'Your change is three dollars.']],
    ['survival-job-interview', ['I take the number five bus to work.', 'I start work at eight.', 'Can we meet on Monday?', 'I have one year of experience in customer service.', 'I can help customers and answer questions.', 'Is this a full-time or part-time job?', 'What is the hourly pay?', 'I can work from Monday to Friday.', 'I can start next Monday.', 'Could you repeat the question, please?', 'The interview is on Tuesday at ten a.m.']],
    ['survival-renting-a-home', ['Turn left at the corner.', 'I need some bread and milk.', 'I need an appointment with a doctor.', 'I am traveling next week.', 'How much is the security deposit?', 'How long is the lease?', 'The lease is for twelve months.', 'Is the apartment furnished?', 'Is internet included in the rent?', 'When is the rent due?', 'I need a quiet apartment near work.', 'The apartment has one bedroom and a kitchen.', 'The sink is broken.', 'Could you fix it, please?']],
  ];
  check(topicChecks.every(([id, sentences]) => sentences.every(text => app.getSentenceLesson(id).sentences.some(sentence => sentence.en === text))));
  const foundationExpansionTopics = [
    ['foundation-alphabet-and-spelling', ['Can you spell your last name?', 'The sign says Open.', 'I can read the label now.']],
    ['foundation-pronouns-and-be', ['I am a student.', 'Are you from this city?', 'Where are they?']],
    ['foundation-numbers-and-contact', ['My email address is sara@example.com.', 'My postal code has five digits.', 'Please send me a text message.']],
    ['foundation-family-and-possessions', ['I have a small family.', 'Whose book is this?', 'We love our family.']],
    ['foundation-time-and-calendar', ['It is eight o’clock in the morning.', 'My appointment is on Wednesday.', 'I write the date on my calendar.']],
    ['foundation-everyday-routine', ['I wake up early.', 'Does he work on Saturdays?', 'Every day, I practice one new sentence.']],
    ['foundation-objects-and-places', ['There is a lamp on the table.', 'The bank is between the café and the shop.', 'The exit is beside the door.']],
  ];
  check(foundationExpansionTopics.every(([id, texts]) => {
    const lesson = app.getSentenceLesson(id);
    return lesson?.levelId === 0 && lesson.sentences.length === 50
      && texts.every(text => lesson.sentences.some(sentence => sentence.en === text));
  }));
  const expandedSurvivalTopics = [
    ['survival-personal-information', ['What is your first name?', 'Could you repeat your email address?']],
    ['survival-directions-and-neighborhood', ['How do I get to the station?', 'Turn left at the traffic light.']],
    ['survival-public-transport', ['Which bus goes to the museum?', 'A one-way ticket, please.']],
    ['survival-cafe-and-food', ['Could I see the menu, please?', 'Is the soup vegetarian?']],
    ['survival-shopping-and-clothing', ['I am looking for a warm jacket.', 'Can I return this if it does not fit?']],
    ['survival-appointments-and-time', ['I have an appointment at three.', 'I am running ten minutes late.']],
    ['survival-health-and-pharmacy', ['I have a headache.', 'Please call an ambulance.']],
    ['survival-hobbies-and-free-time', ['I go swimming once a week.', 'I am interested in photography.']],
    ['survival-invitations-and-plans', ['Would you like to have coffee with me?', 'Can we make it a little later?']],
    ['survival-weather-and-seasons', ['What is the weather like today?', 'The forecast says it will snow tonight.']],
    ['survival-travel-and-tickets', ['I would like a ticket to Kyoto.', 'I need to change trains in Osaka.']],
    ['survival-hotel-and-stay', ['I have a reservation for tonight.', 'My room key does not work.']],
    ['survival-phone-and-messages', ['May I speak to Mr. Lee?', 'I will call you back in ten minutes.']],
    ['survival-services-and-post-office', ['I would like to send this package.', 'How much does it cost to send this package?']],
    ['survival-school-and-learning', ['What page are we on?', 'Could you explain it again?']],
    ['survival-current-activities', ['I am waiting for the bus.', 'The children are playing outside.']],
    ['survival-past-and-future-plans', ['What did you do yesterday?', 'I am going to visit my aunt tomorrow.']],
  ];
  check(expandedSurvivalTopics.length === 17 && expandedSurvivalTopics.every(([id, sentences]) => {
    const lesson = app.getSentenceLesson(id);
    return lesson?.levelId === 1 && lesson.sentences.length === 50 && lesson.dialogue.length >= 6
      && lesson.sentences.every(sentence => !!sentence.fa && !!sentence.pronunciation && sentence.vocabulary.length > 0)
      && sentences.every(text => lesson.sentences.some(sentence => sentence.en === text));
  }));
  check(!app.getSentenceLesson('survival-home-and-facilities'));

  const everydayExpansion = everyday.slice(5);
  const b1 = app.SENTENCE_LESSONS.filter(lesson => !!lesson.b1Section);
  const coreLessons = [...foundation, ...survival, ...everydayExpansion, ...a2Bridge, ...everyday.slice(0, 5), ...b1, ...b2];
  const evidenceByLesson = app.CORE_LESSON_EVIDENCE;
  check(app.FOUNDATION_EVIDENCE_TASKS_PER_LESSON === 6);
  check(app.EVERYDAY_EVIDENCE_TASKS_PER_LESSON === 6);
  const c1 = app.SENTENCE_LESSONS.filter(lesson => lesson.c1Section);
  check(Object.keys(evidenceByLesson).join('|') === [...coreLessons, ...c1].map(lesson => lesson.id).join('|'));
  check(everyday.slice(0, 5).every(lesson => evidenceByLesson[lesson.id]?.length === 6));
  check(everydayExpansion.map(lesson => lesson.id).join('|') === app.EVERYDAY_EXPANSION_LESSON_IDS.join('|'));
  const evidenceTaskIds = new Set();
  for (const lesson of coreLessons) {
    const tasks = evidenceByLesson[lesson.id];
    check(tasks.length === 6);
    check(new Set(tasks.map(task => task.id)).size === tasks.length);
    check(tasks.every(task => !evidenceTaskIds.has(task.id) && task.answers.length > 0));
    check(tasks.every(task => task.answers.every(answer => app.isCorrect(task, answer))));
    tasks.forEach(task => evidenceTaskIds.add(task.id));
    check(['listening', 'reading', 'writing'].every(skill => tasks.some(task => task.skill === skill)));
    check(tasks.every(task => task.skill !== 'listening' || !!task.audio));
    check(tasks.every(task => task.skill !== 'reading' || !!task.source));
    check(tasks.every(task => !task.options || (task.options.includes(task.answers[0]) && new Set(task.options).size === task.options.length)));
    if (lesson.a2Section === 'survival') {
      check(tasks.map(task => task.skill).sort().join('|') === 'grammar|listening|listening|reading|writing|writing');
      check(tasks.every(task => task.id.startsWith(`everyday-core-${lesson.id}-`)));
    } else if (lesson.a2Section === 'foundation') {
      check(tasks.map(task => task.skill).sort().join('|') === 'grammar|listening|reading|writing|writing|writing');
      check(tasks.every(task => task.id.startsWith(`${lesson.id}-`)));
    }
    const allCorrect = Object.fromEntries(tasks.map(task => [task.id, { skill: task.skill, correct: true, heard: true, attempts: 1 }]));
    check(!app.isCoreLessonEvidenceComplete(lesson.id));
    check(app.isCoreLessonEvidenceComplete(lesson.id, allCorrect));
    const missedListening = tasks.find(task => task.skill === 'listening');
    check(!!missedListening);
    check(!app.isCoreLessonEvidenceComplete(lesson.id, {
      ...allCorrect, [missedListening.id]: { ...allCorrect[missedListening.id], heard: false },
    }));
    const missedAnswer = tasks.find(task => task.skill === 'reading');
    check(!!missedAnswer);
    check(!app.isCoreLessonEvidenceComplete(lesson.id, {
      ...allCorrect, [missedAnswer.id]: { ...allCorrect[missedAnswer.id], correct: false },
    }));
  }
  check(evidenceTaskIds.size === 456);
  check(b1.filter(lesson => lesson.b1Section === 'foundation').length === 5
    && b1.filter(lesson => lesson.b1Section === 'survival').length === 6);
  check(b1.every(lesson => lesson.sentences.length === 5 && lesson.dialogue.length === 6
    && lesson.dialogue.every((turn, index) => turn.speaker === (index % 2 ? 'learner' : 'partner') && !!turn.text && !!turn.fa)
    && lesson.sentences.every(sentence => !!sentence.pronunciation && !!sentence.pattern && sentence.vocabulary.length > 0
      && sentence.vocabulary.every(word => sentence.en.toLowerCase().includes(word.word.toLowerCase())))));


  // A2 additions retain stable sentence IDs while filling several essential gaps.
  const a2 = app.SENTENCE_LESSONS.filter(lesson => lesson.levelId === 2).flatMap(lesson => lesson.sentences);
  for (const sentence of ['I am going to visit my friend tomorrow.', 'Are we going to meet on Saturday?', 'How many eggs do we need?', 'How much milk do we need?', 'You must not smoke in the hospital.', 'She said she was tired.']) {
    check(a2.some(item => item.en === sentence && item.fa && item.pronunciation && item.pattern));
  }

  // The first pilot keeps the existing lesson and sentence identifiers stable.
  const firstSentences = app.SENTENCE_LESSONS[0].sentences.slice(0, 10);
  check(firstSentences.map(sentence => sentence.id).join('|') === 's1|s2|s3|s4|s5|s6|s7|s8|s9|s10');
  check(firstSentences.slice(5).map(sentence => sentence.en).join('|') === 'This is my friend, Reza.|What is his name?|His name is Reza.|What is her name?|Her name is Maryam.');
  check(firstSentences.every(sentence => sentence.fa && sentence.pronunciation && sentence.pattern && sentence.vocabulary.length));

  const completed = [app.SENTENCE_LESSONS[0].id];
  const counts = app.COURSE_LEVELS.map(level => app.getEnglishLevelMetrics(level.id, completed));
  check(counts.reduce((sum, item) => sum + item.lessonCount, 0) === 212);
  check(counts.reduce((sum, item) => sum + item.completedLessonCount, 0) === 1);
  check(counts.every(item => item.patternCount <= item.sentenceCount && item.vocabularyCount > 0));
  check(counts.reduce((sum, item) => sum + item.patternCount, 0) === 3407);
  check(counts.find(item => item.levelId === 0).vocabularyCount === 483);
  check(counts.find(item => item.levelId === 2).sentenceCount === 1050
    && counts.find(item => item.levelId === 2).vocabularyCount === 1819);
  check(counts.find(item => item.levelId === 3).lessonCount === 26
    && counts.find(item => item.levelId === 3).sentenceCount === 805
    && counts.find(item => item.levelId === 3).vocabularyCount === 1458);
  check(counts.find(item => item.levelId === 5).vocabularyCount === 110);
  check(counts.filter(item => item.levelId !== 5).reduce((sum, item) => sum + item.vocabularyCount, 0) === 5797);

  for (const lesson of app.SENTENCE_LESSONS) {
    const core = app.buildEnglishLessonCore(lesson);
    check(core.situation.id === lesson.id && core.situation.text === lesson.situation);
    assert.deepEqual(core.coreSentences, lesson.sentences); checks += 1;
    assert.deepEqual(core.dialogues, lesson.dialogue); checks += 1;
    check(core.exerciseSourceSentenceIds.join('|') === lesson.sentences.map(sentence => sentence.id).join('|'));
    check(core.reviewCardIds.join('|') === lesson.sentences.map(sentence => `${lesson.id}:${sentence.id}`).join('|'));
    check(core.vocabulary.every(item => {
      const sentence = lesson.sentences.find(entry => entry.id === item.sentenceId);
      return sentence && sentence.en === item.exampleEn && sentence.fa === item.exampleFa
        && sentence.vocabulary.some(word => word.word === item.word && word.meaning === item.meaning);
    }));
    check(core.sentencePatterns.every(item => {
      const sentence = lesson.sentences.find(entry => entry.id === item.sentenceId);
      return sentence && sentence.pattern === item.pattern && sentence.en === item.exampleEn && sentence.fa === item.exampleFa;
    }));
    const uniqueVocabulary = app.getLessonVocabulary(lesson);
    check(new Set(uniqueVocabulary.map(item => item.word)).size === uniqueVocabulary.length);
    check(uniqueVocabulary.every(item => lesson.sentences.some(sentence => sentence.id === item.sentenceId
      && sentence.en === item.exampleEn && sentence.vocabulary.some(word => word.word === item.word))));
    check(app.getLessonPatterns(lesson).length === lesson.sentences.filter(sentence => !!sentence.pattern).length);
  }

  console.log(`${checks} engine checks passed; 6 levels, 9 ordered lesson stages, 212 lesson records (existing lessons retained), 4242 sentences (500 Foundation with 483 distinct linked words, 950 Survival across 19 fifty-example lessons with ${survivalVocabulary.size} unique vocabulary entries, 1050 A2 sentences across 5 bridge and 20 preserved lessons with 1819 unique linked vocabulary entries, and 750 Communication across 15 original lessons plus 55 B1 examples across 11 new lessons), 489 required checks across Foundation, Survival, Everyday, B1, B2 and C1, plus C1 optional practices and sentence-linked vocabulary/review mappings.`);
})().catch(error => { console.error(error); process.exit(1); });
