const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const esbuild = require('esbuild');

(async () => {
  const output = path.resolve('node_modules/.cache/russian-course-test.cjs');
  await esbuild.build({
    stdin: {
      contents: [
        "export * from './lib/languages/russian';",
        "export * from './lib/languages/catalog';",
        "export * from './lib/languages/russianStudyState';",
        "export * from './lib/englishLessonNavigation';",
        "export * from './lib/courseContent';",
        "export * from './lib/englishLearningEngine';",
      ].join('\n'),
      resolveDir: process.cwd(),
    },
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: output,
    plugins: [{
      name: 'local-course-test-stubs',
      setup(build) {
        build.onResolve({ filter: /^\.\/supabase$/ }, args => args.importer.endsWith('/lib/createCourseProgressStore.ts')
          ? { path: 'supabase', namespace: 'russian-supabase-stub' }
          : null);
        build.onLoad({ filter: /.*/, namespace: 'russian-supabase-stub' }, () => ({
          contents: 'export const supabase = { auth: { async getSession() { globalThis.__russianSupabaseCalls = (globalThis.__russianSupabaseCalls || 0) + 1; return { data: { session: null } }; }, async signInAnonymously() { globalThis.__russianSupabaseCalls = (globalThis.__russianSupabaseCalls || 0) + 1; return { data: { user: null }, error: null }; } }, from() { globalThis.__russianSupabaseCalls = (globalThis.__russianSupabaseCalls || 0) + 1; return { upsert: async () => ({ data: null, error: null }) }; } };',
          loader: 'js',
        }));
        build.onResolve({ filter: /^@react-native-async-storage\/async-storage$/ }, () => ({ path: 'async-storage', namespace: 'russian-storage-stub' }));
        build.onLoad({ filter: /.*/, namespace: 'russian-storage-stub' }, () => ({ contents: 'export default { async getItem() { return null; }, async setItem() {}, async removeItem() {} };', loader: 'js' }));
        build.onResolve({ filter: /^react-native$/ }, () => ({ path: 'react-native', namespace: 'russian-platform-stub' }));
        build.onLoad({ filter: /.*/, namespace: 'russian-platform-stub' }, () => ({ contents: 'export const Platform = { OS: "web" };', loader: 'js' }));
      },
    }],
  });

  const app = require(output);
  const checks = [];
  const check = (label, value) => { assert(value, label); checks.push(label); };
  const sentenceCount = app.RUSSIAN_LESSONS.reduce((sum, lesson) => sum + lesson.sentences.length, 0);
  const expectedLessonIds = ['ru-l1-greetings','ru-l1-how-are-you','ru-l1-introductions','ru-l1-polite-words','ru-l1-yes-no-understand','ru-l1-numbers-1-10','ru-l1-numbers-family','ru-l1-objects-this-is','ru-l1-where-is','ru-l1-basic-wants-needs','ru-l1-colors','ru-l1-food','ru-l1-drinks','ru-l1-likes','ru-l1-weather','ru-l1-time-words','ru-l1-adjectives','ru-l1-numbers-20-100','ru-l1-prices','ru-l1-body-parts','ru-l1-clothes','ru-l1-places','ru-l1-transport','ru-l1-jobs','ru-l1-everyday-verbs','ru-l1-question-words','ru-l1-my-your','ru-l1-we-they','ru-l2-cafe','ru-l2-shopping','ru-l2-directions','ru-l2-time','ru-l2-days','ru-l2-daily-routine','ru-l2-emergency','ru-l2-restaurant-order','ru-l2-paying-bill','ru-l2-clothes-sizes','ru-l2-groceries','ru-l2-taxi','ru-l2-bus-tickets','ru-l2-hotel','ru-l2-phone-calls','ru-l2-appointments','ru-l2-pharmacy','ru-l2-lost-property','ru-l2-weekend-plans','ru-l2-invitations','ru-l2-months-dates','ru-l3-past-simple','ru-l3-future-simple','ru-l3-plans','ru-l3-appearance','ru-l3-comparisons','ru-l3-advice','ru-l3-likes-opinions','ru-l3-work-study','ru-l3-home','ru-l3-hobbies-sport','ru-l3-travel','ru-l3-conditions','ru-l3-daily-sequence','ru-l3-shopping-return','ru-l3-health-doctor','ru-l3-phone-internet','ru-l3-public-service','ru-l3-weather-seasons','ru-l3-cooking-food','ru-l3-conversation-tools'];

  check('Cyrillic alphabet has 33 unique letters', app.RUSSIAN_ALPHABET.length === 33 && new Set(app.RUSSIAN_ALPHABET).size === 33);
  const b1Ids = ['cases-genitive', 'cases-in-context', 'aspect-and-future', 'narration-sequence', 'movement-prefixes',
    'reflexive-imperative', 'conditions-reasons', 'relative-and-reported', 'words-and-degree', 'coherent-opinions',
    'life-experience', 'relationships-and-repair', 'travel-problems', 'home-repairs', 'work-study-interview',
    'health-lifestyle', 'services-complaints', 'phone-email-tech', 'culture-media', 'planning-and-instructions'].map(id => `ru-b1-${id}`);
  const b2Ids = ['case-government','aspect-reporting','motion-meaning','conditional-counterfactual','logical-links','relative-clauses','reported-speech','modality-register','passive-nominal','vocabulary-style','society-policy','technology-ai','environment-energy','education-health','work-negotiation','employment-contracts','formal-complaint-tech','travel-disruption','culture-critique','presentation-summary'].map(id => `ru-b2-${id}`);
  const c1Ids = ['case-relations','aspect-argument','motion-metaphor','time-counterfactual','complex-clauses','impersonal-passive','nominal-information','certainty-evidence','lexical-precision','style-cohesion','social-evidence','debate-critique','sensitive-negotiation','meeting-presentation','formal-writing','critical-media','culture-literature','intercultural-tone','professional-interview','analytical-report'].map(id => `ru-c1-${id}`);
  check('Russian course retains 109 earlier lessons and appends 20 ordered C1 lessons', app.RUSSIAN_LESSONS.length === 129
    && app.RUSSIAN_LESSONS.map(lesson => lesson.id).join('|') === [...expectedLessonIds, ...b1Ids, ...b2Ids, ...c1Ids].join('|')
    && app.RUSSIAN_LESSONS.every(lesson => lesson.id.startsWith('ru-') && lesson.title && lesson.situation));
  check('Russian course has 1032 eight-sentence records', sentenceCount === 1032 && app.RUSSIAN_LESSONS.every(lesson => lesson.sentences.length === 8));
  check('Russian roadmap now has six levels', app.RUSSIAN_LEVELS.map(level => level.id).join('|') === '0|1|2|3|4|5'
    && app.RUSSIAN_LEVELS.length === 6
    && app.RUSSIAN_LEVELS.every((level, index) => level.title && level.description && level.modules.length > 0 && level.id === app.COURSE_LEVELS[index].id));
  check('Russian Foundation has twenty-eight lessons, Survival twenty-one and Everyday twenty (levels 1-3)', app.RUSSIAN_LESSONS.every((lesson, index) => lesson.order === index + 1 && lesson.subtitle)
    && app.RUSSIAN_LESSONS.slice(0, 28).every(lesson => lesson.levelId === 0)
    && app.RUSSIAN_LESSONS.slice(28, 49).every(lesson => lesson.levelId === 1)
    && app.RUSSIAN_LESSONS.slice(49, 69).every(lesson => lesson.levelId === 2)
    && app.RUSSIAN_LESSONS.slice(69, 89).every(lesson => lesson.levelId === 3)
    && app.RUSSIAN_LESSONS.slice(89, 109).every(lesson => lesson.levelId === 4)
    && app.RUSSIAN_LESSONS.slice(109).every(lesson => lesson.levelId === 5)
    && app.RUSSIAN_LESSONS.slice(0, 28).reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 224
    && app.RUSSIAN_LESSONS.slice(28, 49).reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 168
    && app.RUSSIAN_LESSONS.slice(49, 69).reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 160
    && app.RUSSIAN_LESSONS.slice(69, 89).reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 160);
  check('B1 and B2 are available', app.RUSSIAN_LEVELS[3].status === 'available'
    && app.RUSSIAN_LEVELS[4].status === 'available'
    && app.RUSSIAN_LEVELS[2].status === 'available');
  const b1 = app.RUSSIAN_LESSONS.filter(lesson => lesson.levelId === 3);
  check('B1 has two ordered thematic blocks without changing the lesson flow', b1.length === 20
    && b1.slice(0, 10).every(lesson => lesson.subtitle.startsWith('Foundation ·'))
    && b1.slice(10).every(lesson => lesson.subtitle.startsWith('Survival ·')));
  const normalizeRussian = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('ru-RU');
  check('B1 sentence ids are stable within each named lesson and all examples have attached vocabulary', b1.every(lesson =>
    lesson.sentences.every((sentence, index) => sentence.id === `${lesson.id}-${String(index + 1).padStart(2, '0')}`
      && sentence.text && sentence.fa && sentence.pronunciation && sentence.vocabulary.every(item => item.word && item.meaning
        && normalizeRussian(sentence.text).includes(normalizeRussian(item.word))))));
  check('B1 offers contextual notes, formative checks and guided dialogues', b1.every(lesson => lesson.teachingFa && lesson.dialogue.length >= 3
    && lesson.checks.length === 2 && lesson.sentences.some(sentence => sentence.pattern)));
  check('B1 has contextual reading, discussion and self-guided writing without claiming independent assessment', b1.filter(lesson => lesson.teachingFa.includes('خواندن:')).length >= 3
    && b1.filter(lesson => lesson.teachingFa.includes('نوشتن:') || lesson.teachingFa.includes('در دفتر')).length >= 3
    && b1.filter(lesson => lesson.teachingFa.includes('تمرین گفتاری:')).length >= 2);
  const b1Lesson = id => b1.find(lesson => lesson.id === `ru-b1-${id}`);
  const travelDialogue = b1Lesson('travel-problems').dialogue;
  const jobDialogue = b1Lesson('work-study-interview').dialogue;
  check('B1 travel and job dialogues include five paired turns with a practical follow-up', travelDialogue.length === 5
    && travelDialogue[2].text.includes('Ско́лько вре́мени') && travelDialogue[3].text.includes('полчаса́')
    && travelDialogue[4].text.includes('подожду́') && jobDialogue.length === 5
    && jobDialogue[3].text.includes('Как вы помога́ете') && jobDialogue[4].text.includes('отвеча́ем на вопро́сы'));
  const workNote = b1Lesson('work-study-interview').teachingFa;
  const repairNote = b1Lesson('home-repairs').teachingFa;
  check('B1 work and housing readings include five-sentence texts, questions and answer guidance', workNote.includes('Мари́я рабо́тала в магази́не два го́да.')
    && workNote.includes('Она́ хо́чет развива́ться и учи́ться но́вому.') && workNote.includes('О своём о́пыте')
    && repairNote.includes('У А́нны в кварти́ре протека́ет кран.') && repairNote.includes('ма́стер придёт по́сле обе́да.')
    && [workNote, repairNote].every(note => note.includes('پرسش‌ها:') && note.includes('پاسخ برای بررسی:') && note.includes('معنی متن:')));
  const lifeWriting = b1Lesson('life-experience').teachingFa;
  const complaintWriting = b1Lesson('services-complaints').teachingFa;
  check('B1 experience and complaint writing provide a model, criteria and self-review guidance', lifeWriting.includes('пото́му что я учу́сь но́вому')
    && lifeWriting.includes('переехал برای مرد و переехала برای زن') && complaintWriting.includes('Мо́жно верну́ть де́ньги?')
    && complaintWriting.includes('купила برای زن و купил برای مرد') && [lifeWriting, complaintWriting].every(note =>
      note.includes('نمونه:') && note.includes('۱)') && note.includes('۲)') && note.includes('۳)') && note.includes('خودتان آن را با نمونه مقایسه کنید')));
  check('B1 checks have varied answer positions and coherent answer explanations', new Set(b1.flatMap(lesson => lesson.checks.map(q => q.correctIndex))).size === 3
    && b1.every(lesson => lesson.checks.every(q => q.explanationFa && q.choices[q.correctIndex])));
  check('B1 has no mixed Latin in Russian examples and uses Cyrillic stress marks on vowels only', b1.every(lesson => [...lesson.sentences, ...lesson.dialogue].every(item =>
    !/[A-Za-zÀ-ÿ]/.test(item.text) && !/[^аеёиоуыэюяАЕЁИОУЫЭЮЯ]\u0301/.test(item.text))));
  const b2 = app.RUSSIAN_LESSONS.filter(lesson => lesson.levelId === 4);
  check('B2 has 20 lessons in two ordered blocks with contextual examples, notes and dialogue', b2.length === 20
    && b2.slice(0, 10).every(lesson => lesson.subtitle.startsWith('Foundation ·'))
    && b2.slice(10).every(lesson => lesson.subtitle.startsWith('Survival ·'))
    && b2.every(lesson => lesson.sentences.length === 8 && lesson.checks.length === 2 && lesson.teachingFa && lesson.dialogue.length >= 3
      && lesson.sentences.some(sentence => sentence.pattern)));
  check('B2 ids and vocabulary correspond to stable lesson examples', b2.every(lesson => lesson.sentences.every((sentence, index) =>
    sentence.id === `${lesson.id}-${String(index + 1).padStart(2, '0')}` && sentence.vocabulary.every(item => item.word && item.meaning
      && normalizeRussian(sentence.text).includes(normalizeRussian(item.word))))));
  check('B2 checks vary answer positions and have explanations', new Set(b2.flatMap(lesson => lesson.checks.map(q => q.correctIndex))).size === 3
    && b2.every(lesson => lesson.checks.every(q => q.explanationFa && q.choices[q.correctIndex])));
  check('B2 Russian examples use Cyrillic and valid stress marks', b2.every(lesson => [...lesson.sentences, ...lesson.dialogue].every(item =>
    !/[A-Za-zÀ-ÿʒ]/.test(item.text) && !/[^аеёиоуыэюяАЕЁИОУЫЭЮЯ]\u0301/.test(item.text))));
  check('B2 includes four fictional reading examples with questions and two modelled self-review writing tasks',
    ['society-policy','technology-ai','employment-contracts','culture-critique'].every(id => {
      const note = b2.find(lesson => lesson.id === `ru-b2-${id}`).teachingFa;
      return note.includes('پرسش‌ها:') && note.includes('پاسخ:');
    }) && ['formal-complaint-tech','presentation-summary'].every(id => {
      const note = b2.find(lesson => lesson.id === `ru-b2-${id}`).teachingFa;
      return note.includes('خودارزیابی') && note.includes('نمونهٔ فرضی:') && note.includes('معنی:');
    }));
  const b2Lesson = id => b2.find(lesson => lesson.id === `ru-b2-${id}`);
  const cultureDialogue = b2Lesson('culture-critique').dialogue;
  const negotiationDialogue = b2Lesson('work-negotiation').dialogue;
  check('B2 respectful debate and professional negotiation include complete extended dialogue turns',
    cultureDialogue.length === 8 && cultureDialogue[4].text.includes('Я понима́ю ва́шу то́чку зре́ния')
    && cultureDialogue[7].text.includes('Наприме́р') && negotiationDialogue.length === 7
    && negotiationDialogue[5].text.includes('к пя́тнице') && negotiationDialogue[6].text.includes('пересмо́трим срок')
    && [...cultureDialogue, ...negotiationDialogue].every(turn => turn.speaker && turn.text && turn.fa));
  check('B2 supplementary social and media readings include fictional passages, inference questions, supported answers and translations',
    ['society-policy', 'culture-critique'].every(id => {
      const note = b2Lesson(id).teachingFa;
      return note.includes('خواندن تکمیلی') && note.includes('متن فرضی') && note.includes('ایدهٔ اصلی')
        && note.includes('پاسخ برای بررسی:') && note.includes('معنی متن:') && note.includes('واژه‌های راهنما:');
    }) && b2Lesson('society-policy').teachingFa.includes('обе позиции заслуживают внимания')
      && b2Lesson('culture-critique').teachingFa.includes('проверка не менее необходима'));
  check('B2 argument and report writing provide guided tasks, Russian models, Persian translations and self-review criteria',
    ['environment-energy', 'presentation-summary'].every(id => {
      const note = b2Lesson(id).teachingFa;
      return note.includes('نوشتن هدایت‌شده') && note.includes('تکلیف:') && note.includes('نمونهٔ فرضی:')
        && note.includes('معنی نمونه:') && note.includes('معیار خودارزیابی:') && note.includes('برنامه')
        && note.includes('تصحیح نمی‌کند');
    }) && b2Lesson('environment-energy').teachingFa.includes('обоснованное решение')
      && b2Lesson('presentation-summary').teachingFa.includes('выводы остаются предварительными'));
  const c1 = app.RUSSIAN_LESSONS.filter(lesson => lesson.levelId === 5);
  check('C1 contains 20 lessons in two thematic blocks with eight examples and two checks each', c1.length === 20
    && c1.slice(0, 10).every(lesson => lesson.subtitle.startsWith('Foundation ·'))
    && c1.slice(10).every(lesson => lesson.subtitle.startsWith('Survival ·'))
    && c1.every(lesson => lesson.sentences.length === 8 && lesson.checks.length === 2 && lesson.teachingFa && lesson.dialogue.length >= 3
      && lesson.sentences.some(sentence => sentence.pattern)));
  check('C1 has stable ids, sentence-linked vocabulary, clean Russian and varied question positions', c1.every(lesson =>
    lesson.sentences.every((sentence, index) => sentence.id === `${lesson.id}-${String(index + 1).padStart(2, '0')}`
      && sentence.vocabulary.every(item => item.word && item.meaning && normalizeRussian(sentence.text).includes(normalizeRussian(item.word))))
    && [...lesson.sentences, ...lesson.dialogue].every(item => !/[A-Za-zÀ-ÿʒ]/.test(item.text) && !/[^аеёиоуыэюяАЕЁИОУЫЭЮЯ]\u0301/.test(item.text))
    && lesson.checks.every(q => q.explanationFa && q.choices[q.correctIndex]))
    && new Set(c1.flatMap(lesson => lesson.checks.map(q => q.correctIndex))).size === 3);
  check('C1 includes contextual fictional analytical readings and modelled self-review writing',
    ['social-evidence', 'critical-media', 'culture-literature'].every(id => {
      const note = c1.find(lesson => lesson.id === `ru-c1-${id}`).teachingFa;
      return note.includes('فرضی') && note.includes('پرسش') && note.includes('پاسخ:') && note.includes('معنی:');
    }) && c1.find(lesson => lesson.id === 'ru-c1-social-evidence').teachingFa.includes('تمرین نوشتن استدلالی خودارزیابی')
    && ['formal-writing', 'analytical-report'].every(id => {
      const note = c1.find(lesson => lesson.id === `ru-c1-${id}`).teachingFa;
      return note.includes('خودارزیابی') && note.includes('نمونهٔ فرضی:') && note.includes('معیار') && note.includes('تصحیح نمی');
    }));
  const c1Lesson = id => c1.find(lesson => lesson.id === `ru-c1-${id}`);
  const c1Debate = c1Lesson('social-evidence').dialogue;
  const c1Negotiation = c1Lesson('sensitive-negotiation').dialogue;
  check('C1 respectful debate and tentative professional negotiation each have eight complete turns',
    c1Debate.length === 8 && c1Debate[6].text.includes('ра́зные сезо́ны')
    && c1Debate[7].text.includes('недоста́точно') && c1Debate[7].text.includes('ра́зные пери́оды')
    && c1Negotiation.length === 8 && c1Negotiation[6].text.includes('резе́рвный срок')
    && c1Negotiation[7].text.includes('по́сле согласова́ния')
    && [...c1Debate, ...c1Negotiation].every(turn => turn.speaker && turn.text && turn.fa)
    && c1Lesson('sensitive-negotiation').checks.some(q => q.explanationFa.includes('پس از تأیید')));
  const c1Reading = c1Lesson('critical-media').teachingFa;
  check('C1 additional analytical reading presents evidence, inference questions, answers and translation',
    c1Reading.includes('خواندن تکمیلی C1') && c1Reading.includes('متن فرضی')
    && c1Reading.includes('Из 120 посетителей, добровольно ответивших на вопросы, 80')
    && c1Reading.includes('استدلال اصلی') && c1Reading.includes('به‌طور ضمنی')
    && c1Reading.includes('پاسخ برای بررسی:') && c1Reading.includes('معنی متن:')
    && c1Reading.includes('رابطهٔ علّی نیست'));
  check('C1 summary and paraphrase task use the same text, with models, translation and self-assessment',
    c1Reading.includes('تمرین خلاصه‌نویسی و بازنویسی · خودارزیابی')
    && c1Reading.includes('متن بالا را بیرون از برنامه') && c1Reading.includes('نمونهٔ خلاصه:')
    && c1Reading.includes('معنی نمونهٔ خلاصه:') && c1Reading.includes('نمونهٔ بازنویسی:')
    && c1Reading.includes('пока они не доказывают') && c1Reading.includes('معیار خودارزیابی:')
    && c1Reading.includes('پاسخ آزاد به‌طور خودکار ذخیره یا تصحیح نمی‌شود'));
  const allRussianIds = app.RUSSIAN_LESSONS.flatMap(lesson => [lesson.id, ...lesson.sentences.map(sentence => sentence.id)]);
  check('Russian lesson and sentence IDs are unique', new Set(allRussianIds).size === allRussianIds.length);
  check('Russian target sentences are Cyrillic and linked to Persian, pronunciation and vocabulary', app.RUSSIAN_LESSONS.every(lesson => lesson.sentences.every(sentence => /[А-Яа-яЁё]/.test(sentence.text)
    && !!sentence.fa && !!sentence.pronunciation && !/[А-Яа-яЁё]/.test(sentence.pronunciation) && sentence.vocabulary.length > 0)));
  check('every lesson has a short dialogue and two valid self-study checks', app.RUSSIAN_LESSONS.every(lesson => lesson.dialogue.length >= 3
    && lesson.dialogue.every(line => /[А-Яа-яЁё]/.test(line.text) && !!line.fa)
    && lesson.checks.length === 2 && lesson.checks.every(question => question.choices.length === 3
      && new Set(question.choices).size === 3 && question.correctIndex >= 0 && question.correctIndex < question.choices.length)));
  check('sentence-builder grammar notes stay attached to original Russian examples', app.RUSSIAN_LESSONS.every(lesson => lesson.sentences.filter(sentence => sentence.pattern)
    .every(sentence => sentence.text && sentence.fa)));
  // Keep the A1 examples in their original slots so sessions and review cards still resolve.
  const a1 = app.RUSSIAN_LESSONS.slice(0, 49);
  const expectedA1SentenceIds = [
    ...Array.from({ length: 224 }, (_, i) => `ru1-${String(i + 1).padStart(2, '0')}`),
    ...Array.from({ length: 168 }, (_, i) => `ru2-${String(i + 1).padStart(2, '0')}`),
  ];
  check('A1 sentence IDs and sequence remain stable', a1.flatMap(lesson => lesson.sentences.map(sentence => sentence.id)).join('|') === expectedA1SentenceIds.join('|'));
  const a1Sentence = id => a1.flatMap(lesson => lesson.sentences).find(sentence => sentence.id === id);
  const examples = {
    'ru1-14': 'Я рад', 'ru1-17': 'Мери́м', 'ru1-23': 'иране́ц', 'ru1-59': 'кни́гу', 'ru1-61': 'столе́', 'ru1-63': 'ко́мнате', 'ru1-171': 'шко́ле', 'ru1-131': 'но́вое окно́', 'ru1-132': 'но́вые столы́',
    'ru1-199': 'тебя́', 'ru1-214': 'но́мер телефо́на', 'ru1-174': 'по́чта',
    'ru2-52': 'температу́ра', 'ru2-98': 'регистра́ция', 'ru2-103': 'поса́дку', 'ru2-110': 'заброни́рован', 'ru2-123': 'врачу́', 'ru2-142': 'но́мер телефо́на',
    'ru2-146': 'бу́ду гуля́ть', 'ru2-152': 'гуля́ла', 'ru2-161': 'Како́е',
  };
  check('edited A1 includes representative identity, grammar and survival examples', Object.entries(examples).every(([id, fragment]) => a1Sentence(id)?.text.includes(fragment)));
  check('edited A1 pronunciation, vocabulary and Persian translations remain present', Object.keys(examples).every(id => {
    const item = a1Sentence(id);
    return item?.fa && item.pronunciation && item.vocabulary.every(word => word.word && word.meaning);
  }));
  const alphabetNotes = a1.slice(0, 4).map(lesson => lesson.teachingFa);
  const alphabetGroups = [app.RUSSIAN_ALPHABET.slice(0, 8), app.RUSSIAN_ALPHABET.slice(8, 16), app.RUSSIAN_ALPHABET.slice(16, 24), app.RUSSIAN_ALPHABET.slice(24)];
  check('Cyrillic uppercase and lowercase are introduced in four ordered groups', alphabetGroups.every((group, i) => group.every(letter => alphabetNotes[i].includes(`${letter} ${letter.toLocaleLowerCase('ru-RU')}`))));
  check('pronunciation notes introduce stress, soft sign and ё in context', alphabetNotes[0].includes('تکیه') && alphabetNotes[3].includes('день')
    && a1.find(lesson => lesson.id === 'ru-l1-colors').teachingFa.includes('ё') && a1Sentence('ru1-84').text.includes('ё'));
  const noteFor = id => a1.find(lesson => lesson.id === id).teachingFa;
  check('A1 case contrasts use short contextual examples', noteFor('ru-l1-objects-this-is').includes('книга به книгу')
    && noteFor('ru-l1-numbers-family').includes('есть брат') && noteFor('ru-l1-numbers-family').includes('нет брата')
    && noteFor('ru-l1-places').includes('в школе') && noteFor('ru-l1-places').includes('в школу'));
  // In-place A2 revisions must keep the review-card and session addresses stable.
  const a2 = app.RUSSIAN_LESSONS.filter(lesson => lesson.levelId === 2);
  const a2Sentences = a2.flatMap(lesson => lesson.sentences);
  const a2Sentence = id => a2Sentences.find(sentence => sentence.id === id);
  const a2Note = id => a2.find(lesson => lesson.id === id)?.teachingFa || '';
  check('A2 retains twenty lessons and its ordered 160 review sentence IDs', a2.length === 20
    && a2.every(lesson => lesson.sentences.length === 8)
    && a2Sentences.map(sentence => sentence.id).join('|') === Array.from({ length: 160 }, (_, i) => `ru3-${String(i + 1).padStart(2, '0')}`).join('|'));
  const a2Examples = {
    'ru3-19': 'начнётся', 'ru3-30': 'мою́ сестру́', 'ru3-37': 'така́я же тяжёлая',
    'ru3-54': 'предпочита́ю чай ко́фе', 'ru3-59': 'экза́мен', 'ru3-61': 'пе́рвого ма́я',
    'ru3-66': 'аре́нда', 'ru3-87': 'регистра́ция на рейс', 'ru3-95': 'что́бы найти́ рабо́ту',
    'ru3-110': 'приме́рить', 'ru3-111': 'со ски́дкой', 'ru3-115': 'сдать ана́лиз',
    'ru3-119': 'температу́ра и ка́шель', 'ru3-126': 'сообще́ние', 'ru3-139': 'стано́вятся',
    'ru3-146': 'Два килогра́мма', 'ru3-150': 'без лу́ка', 'ru3-155': 'поняла́',
  };
  check('A2 grammar and practical examples remain in their original slots', Object.entries(a2Examples).every(([id, text]) => a2Sentence(id)?.text.includes(text)));
  check('A2 spoken sentences do not contain gender-choice parentheses', a2Sentences.every(sentence => !/[()]/.test(sentence.text)));
  check('A2 notes distinguish grammar, pronunciation and practical message writing', a2Note('ru-l3-past-simple').includes('книга → книгу')
    && a2Note('ru-l3-past-simple').includes('تکیه') && a2Note('ru-l3-appearance').includes('حالت فاعلی')
    && a2Note('ru-l3-work-study').includes('داتیو') && a2Note('ru-l3-travel').includes('Иду / еду')
    && a2Note('ru-l3-daily-sequence').includes('перед сном با حالت ابزاری')
    && a2Note('ru-l3-phone-internet').includes('تمرین نوشتن'));
  const travelReading = a2Note('ru-l3-travel');
  const phoneReading = a2Note('ru-l3-phone-internet');
  check('A2 has two short contextual readings with questions and answer guidance', travelReading.includes('За́втра мы е́дем в Каза́нь на по́езде.')
    && travelReading.includes('پرسش: هتل کجاست؟') && travelReading.includes('Ря́дом с вокза́лом')
    && phoneReading.includes('Я не могу́ отве́тить.') && phoneReading.includes('پرسش: فرستنده چه زمانی دوباره تماس می‌گیرد؟')
    && phoneReading.includes('پاسخ برای بررسی: Че́рез час'));
  check('A2 message writing remains a self-guided activity with concrete substitution and comparison', phoneReading.includes('در دفتر یا بیرون از برنامه')
    && phoneReading.includes('за́втра یا в три ча́са') && phoneReading.includes('با نمونه مقایسه کنید'));
  const shoppingDialogue = a2.find(lesson => lesson.id === 'ru-l3-shopping-return').dialogue;
  const doctorDialogue = a2.find(lesson => lesson.id === 'ru-l3-health-doctor').dialogue;
  check('A2 shopping and doctor dialogues keep three turns and pair a follow-up with its response', shoppingDialogue.length === 3
    && shoppingDialogue[1].text.includes('Вам ну́жен друго́й цвет?') && shoppingDialogue[2].text.includes('си́ний цвет')
    && doctorDialogue.length === 3 && doctorDialogue[1].text.includes('Мне ну́жен ана́лиз?')
    && doctorDialogue[2].text.includes('осмотрю́ го́рло') && doctorDialogue[2].text.includes('пото́м реши́м'));
  const shoppingCheck = a2.find(lesson => lesson.id === 'ru-l3-shopping-return').checks[1];
  check('A2 shopping spelling correction preserves the saved answer slot', shoppingCheck.correctIndex === 0
    && shoppingCheck.choices[0] === 'чек' && shoppingCheck.choices[2] === 'ски́дка');
  const datesCheck = app.RUSSIAN_LESSONS.find(lesson => lesson.id === 'ru-l2-months-dates').checks[0];
  check('date-question spelling fix preserves the original answer slot', datesCheck.correctIndex === 0 && datesCheck.choices[0] === 'Како́е сего́дня число́?');
  check('Russian stage IDs, order and labels exactly match English nine-stage flow', app.RUSSIAN_LESSON_STAGES.length === 9
    && app.RUSSIAN_LESSON_STAGES.every((stage, index) => stage.id === app.ENGLISH_ENGINE_STEPS[index].id
      && stage.labelFa === app.ENGLISH_ENGINE_STEPS[index].labelFa
      && stage.labelEn === app.ENGLISH_ENGINE_STEPS[index].labelEn));
  check('English lesson scope includes the original material and the new A2, B1 and B2 lessons', app.SENTENCE_LESSONS.length === 212
    && app.SENTENCE_LESSONS.reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 4242
    && app.SENTENCE_LESSONS.filter(lesson => lesson.levelId === 0).length === 10
    && app.SENTENCE_LESSONS.filter(lesson => lesson.levelId === 0).reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 500
    && app.SENTENCE_LESSONS.filter(lesson => lesson.levelId === 2).length === 25
    && app.SENTENCE_LESSONS.filter(lesson => lesson.levelId === 2).reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 1050
    && app.SENTENCE_LESSONS.filter(lesson => lesson.levelId === 3 && !lesson.b1Section).length === 15
    && app.SENTENCE_LESSONS.filter(lesson => lesson.levelId === 3 && !lesson.b1Section).reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 750);
  check('language picker registers en/ru without changing existing locales', app.LANGUAGES.map(language => language.id).join('|') === 'en|ru'
    && app.LANGUAGES.find(language => language.id === 'en').speechLocale === 'en-US'
    && app.LANGUAGES.find(language => language.id === 'ru').speechLocale === 'ru-RU');
  check('Russian lesson count and home route are registered', app.LANGUAGES.find(language => language.id === 'ru').lessonsCount === 129
    && app.LANGUAGES.find(language => language.id === 'ru').home === '/learn/ru'
    && app.russianProgress && typeof app.russianProgress.completeSentenceLesson === 'function');
  check('Russian has independent progress and draft/session storage namespaces', app.RUSSIAN_STUDY_STORAGE_KEY === 'russian_lesson_sessions_v1'
    && app.RUSSIAN_STUDY_STORAGE_KEY !== 'sentence_course_progress_ru_v2');
  check('Russian lesson navigation follows all course boundaries and stops at the end', app.RUSSIAN_LESSONS.every((lesson, index) =>
    app.nextLessonInOrder(app.RUSSIAN_LESSONS, lesson.id)?.id === app.RUSSIAN_LESSONS[index + 1]?.id)
    && app.nextLessonInOrder(app.RUSSIAN_LESSONS, 'unknown') === undefined);
  check('previous sentence is bounded at the start', app.previousSentenceIndex(0) === 0 && app.previousSentenceIndex(4) === 3);
  const russianHome = fs.readFileSync('components/RussianHome.tsx', 'utf8');
  const russianLesson = fs.readFileSync('components/RussianLesson.tsx', 'utf8');
  const russianRoute = fs.readFileSync('app/learn/ru/lesson.tsx', 'utf8');
  check('Russian home opens the first lesson in replay mode through the actual route', russianHome.includes("fromStart: '1'")
    && russianHome.includes('RUSSIAN_LESSONS[0].id') && russianRoute.includes("fromStart === '1'"));
  check('Russian replay protects saved sessions and completion navigates after saving', russianLesson.includes('preserveExistingSession.current')
    && russianLesson.includes('await russianProgress.completeSentenceLesson') && russianLesson.includes('params: { id: nextLesson.id }')
    && russianLesson.includes('currentProgressIndex > nextIndex') && russianLesson.includes('جملهٔ قبلی'));

  const memory = new Map();
  global.__russianSupabaseCalls = 0;
  global.window = { localStorage: {
    getItem(key) { return memory.has(key) ? memory.get(key) : null; },
    setItem(key, value) { memory.set(key, String(value)); },
    removeItem(key) { memory.delete(key); },
  } };
  const firstLesson = app.RUSSIAN_LESSONS[0];
  const firstLoad = await app.loadRussianLessonSessionWithPresence(firstLesson.id);
  check('new Russian session reports no saved session', !firstLoad.hasSavedSession && firstLoad.session.stage === 0);
  const fresh = await app.loadRussianLessonSession(firstLesson.id);
  check('new Russian session starts at stage one without writing another language key', fresh.stage === 0 && memory.size === 0);
  const saved = { stage: 4, sentenceIndex: 2, revealed: true, answers: { '0': 1 }, showCheckAnswers: false };
  await app.saveRussianLessonSession(firstLesson.id, saved);
  const restored = await app.loadRussianLessonSession(firstLesson.id);
  const savedLoad = await app.loadRussianLessonSessionWithPresence(firstLesson.id);
  check('saved Russian session presence is detected without changing stored data', savedLoad.hasSavedSession && JSON.stringify(savedLoad.session) === JSON.stringify(saved));
  check('Russian session resumes its stage, sentence and local check answer', JSON.stringify(restored) === JSON.stringify(saved));
  check('session data is stored only under the Russian session key', memory.size === 1 && memory.has(app.RUSSIAN_STUDY_STORAGE_KEY));
  const invalid = { ...saved, stage: 9 };
  await assert.rejects(() => app.saveRussianLessonSession(firstLesson.id, invalid));
  check('invalid Russian session cannot overwrite stored progress', memory.get(app.RUSSIAN_STUDY_STORAGE_KEY) === JSON.stringify({ schema: 1, sessions: { [firstLesson.id]: saved } }));
  await app.clearRussianLessonSession(firstLesson.id);
  check('clearing the Russian session does not touch course-progress storage', memory.size === 0);
  await app.russianProgress.completeSentenceLesson(firstLesson.id, app.RUSSIAN_LESSONS[1].id);
  const savedProgress = await app.russianProgress.getCourseProgress();
  check('Russian lesson completion persists under its own progress key and advances', savedProgress.completedLessonIds.includes(firstLesson.id)
    && savedProgress.currentLessonId === app.RUSSIAN_LESSONS[1].id
    && memory.has('sentence_course_progress_ru_v2')
    && !memory.has('sentence_course_progress_v1')
    && !memory.has('sentence_course_progress_de_v1'));
  check('Russian completion enrolls only its eight sentences in local spaced review', (await app.russianProgress.getDueReviewCards()).length === 8
    && (await app.russianProgress.getDueReviewCards()).every(card => card.lessonId === firstLesson.id));
  check('Russian completion does not invent study minutes or English vocabulary mastery', savedProgress.totalMinutes === 0
    && savedProgress.learnedEssential504Words.length === 0);
  check('Russian progress never calls the Supabase cloud client', global.__russianSupabaseCalls === 0);

  console.log(`${checks.length} Russian curriculum, nine-stage flow, registry, session-resume and language-isolation checks passed (${sentenceCount} Russian sentences).`);
})().catch(error => { console.error(error); process.exit(1); });
