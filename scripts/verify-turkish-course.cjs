const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const esbuild = require('esbuild');

/*
 * بررسی ایستا و اجراییِ دورهٔ ترکی استانبولی.
 * محتوا، تفکیک ذخیره‌سازی از دورهٔ روسی و انگلیسی، ثبت در فهرست زبان‌ها
 * و مسیرهای جدید را بدون نیاز به سرور بررسی می‌کند.
 */
(async () => {
  const output = path.resolve('node_modules/.cache/turkish-course-test.cjs');
  await esbuild.build({
    stdin: {
      contents: [
        "export * from './lib/languages/turkish';",
        "export * from './lib/languages/turkishStudyState';",
        "export * from './lib/languages/catalog';",
      ].join('\n'),
      resolveDir: process.cwd(),
    },
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: output,
    plugins: [{
      name: 'turkish-course-test-stubs',
      setup(build) {
        build.onResolve({ filter: /^\.\/supabase$/ }, args => args.importer.endsWith('/lib/createCourseProgressStore.ts')
          ? { path: 'supabase', namespace: 'turkish-supabase-stub' }
          : null);
        build.onLoad({ filter: /.*/, namespace: 'turkish-supabase-stub' }, () => ({
          contents: 'export const supabase = { auth: { async getSession() { return { data: { session: null } }; } }, from() { return { upsert: async () => ({ data: null, error: null }) }; } };',
          loader: 'js',
        }));
        build.onResolve({ filter: /^@react-native-async-storage\/async-storage$/ }, () => ({ path: 'async-storage', namespace: 'turkish-storage-stub' }));
        build.onLoad({ filter: /.*/, namespace: 'turkish-storage-stub' }, () => ({ contents: 'export default { async getItem() { return null; }, async setItem() {}, async removeItem() {} };', loader: 'js' }));
        build.onResolve({ filter: /^react-native$/ }, () => ({ path: 'react-native', namespace: 'turkish-platform-stub' }));
        build.onLoad({ filter: /.*/, namespace: 'turkish-platform-stub' }, () => ({ contents: 'export const Platform = { OS: "web" };', loader: 'js' }));
      },
    }],
  });

  const app = require(output);
  const read = file => fs.readFileSync(path.resolve(file), 'utf8');
  const checks = [];
  const check = (label, value) => { assert(value, label); checks.push(label); };

  const lessons = app.TURKISH_LESSONS;
  const sentences = lessons.flatMap(lesson => lesson.sentences);
  const sentenceIds = sentences.map(sentence => sentence.id);

  check('Turkish starter course ships 18 lessons in ordered level bands',
    lessons.length === 18
    && lessons.filter(lesson => lesson.levelId === 0).length === 10
    && lessons.filter(lesson => lesson.levelId === 1).length === 8
    && lessons.every((lesson, index) => lesson.order === index + 1));

  check('every Turkish lesson has a title, situation, sentences, dialogue and two checks',
    lessons.every(lesson => lesson.title && lesson.situation && lesson.durationMinutes === 8
      && lesson.sentences.length >= 6
      && lesson.dialogue.length >= 3
      && lesson.checks.length === 2
      && typeof lesson.teachingFa === 'string' && lesson.teachingFa.length > 40));

  check('lesson ids and sentence ids are unique',
    new Set(lessons.map(lesson => lesson.id)).size === lessons.length
    && new Set(sentenceIds).size === sentenceIds.length);

  check('each Turkish sentence carries text, Persian meaning, pronunciation and vocabulary',
    sentences.every(sentence => sentence.text.trim() && sentence.fa.trim() && sentence.pronunciation.trim()
      && sentence.vocabulary.length > 0 && sentence.vocabulary.every(word => word.word.trim() && word.meaning.trim())));

  check('Turkish-specific letters are present in the target-language text',
    /[çşğıöüÇŞĞİÖÜ]/.test(sentences.map(sentence => sentence.text).join(' ')));

  check('Persian translations and pronunciation are not empty placeholders',
    sentences.every(sentence => /[\u0600-\u06FF]/.test(sentence.fa) && !/TODO|TBD|placeholder/i.test(`${sentence.fa} ${sentence.pronunciation}`)));

  check('quiz answers point at a real choice and include an explanation',
    lessons.every(lesson => lesson.checks.every(question => question.choices.length === 3
      && question.correctIndex >= 0 && question.correctIndex < question.choices.length
      && question.promptFa.trim() && question.explanationFa.trim())));

  check('levels 0 and 1 are available and planned levels contain no invented lessons',
    app.TURKISH_LEVELS.filter(level => level.status === 'available').map(level => level.id).join('|') === '0|1'
    && app.TURKISH_LEVELS.filter(level => level.status === 'planned').length === 4
    && app.TURKISH_LEVELS.filter(level => level.status === 'planned')
      .every(level => !lessons.some(lesson => lesson.levelId === level.id)));

  check('every lesson id is assigned to a declared level',
    lessons.every(lesson => app.TURKISH_LEVELS.some(level => level.id === lesson.levelId)));

  check('the Turkish course has its own lesson flow and alphabet declaration',
    app.TURKISH_LESSON_STAGES.length === 8
    && app.TURKISH_LESSON_STAGES.map(stage => stage.id).join('|') === 'situation|core-sentences|listening|sentence-building|vocabulary|grammar-through-usage|conversation|review'
    && app.TURKISH_ALPHABET.length === 29);

  check('Turkish progress, sessions and phrase storage use separate namespaces',
    app.turkishProgress && typeof app.turkishProgress.completeSentenceLesson === 'function'
    && app.TURKISH_STUDY_STORAGE_KEY === 'turkish_lesson_sessions_v1'
    && app.TURKISH_STUDY_STORAGE_KEY !== 'russian_lesson_sessions_v1');

  check('Turkish is registered in the shared language catalog without replacing other languages',
    app.LANGUAGES.map(language => language.id).join('|') === 'en|ru|tr'
    && app.LANGUAGES.find(language => language.id === 'tr').home === '/learn/tr'
    && app.LANGUAGES.find(language => language.id === 'tr').speechLocale === 'tr-TR'
    && app.LANGUAGES.find(language => language.id === 'tr').lessonsCount === lessons.length
    && app.LANGUAGES.find(language => language.id === 'ru').home === '/learn/ru'
    && app.LANGUAGES.find(language => language.id === 'en').home === '/lang');

  check('Turkish speech and routes are wired to the tr-TR engine and the Turkish screens',
    /tr-TR/.test(read('lib/turkishSpeech.ts'))
    && ['app/learn/tr/index.tsx', 'app/learn/tr/lesson.tsx', 'app/learn/tr/library.tsx', 'app/learn/tr/review.tsx']
      .every(file => fs.existsSync(path.resolve(file)))
    && /TurkishLesson/.test(read('app/learn/[language]/lesson.tsx'))
    && /TurkishLibrary/.test(read('app/learn/[language]/library.tsx'))
    && /TurkishReview/.test(read('app/learn/[language]/review.tsx'))
    && /TurkishHome/.test(read('app/learn/[language]/index.tsx')));

  check('the language chooser exposes the Turkish flag without removing existing flags',
    /tr: '🇹🇷'/.test(read('app/languages.tsx'))
    && /en: '🇬🇧'/.test(read('app/languages.tsx'))
    && /ru: '🇷🇺'/.test(read('app/languages.tsx')));

  console.log(`${checks.length} Turkish course, catalog, storage-isolation and route checks passed (${lessons.length} lessons, ${sentences.length} sentences).`);
})();
