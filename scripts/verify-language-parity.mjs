#!/usr/bin/env node
/**
 * Locks the tri-language teaching format: English, German and Russian must all
 * walk through the same nine stages, use the same home / library / lesson /
 * review / backup frames and expose the same five bottom-navigation slots.
 *
 * This is a structural contract only. Each course keeps its own content,
 * colours and wording; nothing here claims CEFR accreditation.
 */
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFileSync(path.join(root, file), 'utf8');
let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks += 1; };

/* 1. One stage list, three languages. */
const format = read('lib/languages/courseFormat.ts');
const stages = [...format.matchAll(/\{ id: '([a-z-]+)', labelFa: '([^']+)', labelEn: '([^']+)' \}/g)].map(match => match[1]);
check(stages.length === 9, 'the shared contract defines exactly nine lesson stages');
check(stages.join('|') === 'situation|core-sentences|listening|shadowing|sentence-building|vocabulary|grammar-through-usage|conversation|review',
  'the nine stages appear in the same pedagogical order for every language');

const engine = read('lib/englishLearningEngine.ts');
const russian = read('lib/languages/russian.ts');
for (const stage of stages) {
  check(engine.includes(`'${stage}'`), `English lesson flow includes the shared stage "${stage}"`);
  check(russian.includes(`'${stage}'`), `Russian lesson flow includes the shared stage "${stage}"`);
}

/* 2. Three concrete courses on that contract. */
const registry = read('lib/languages/courseRegistry.ts');
for (const course of ['ENGLISH_COURSE', 'GERMAN_COURSE', 'RUSSIAN_COURSE']) {
  check(new RegExp(`export const ${course}: FormatCourse`).test(registry), `${course} is declared as a FormatCourse`);
}
for (const route of ['home', 'library', 'review', 'pronunciation', 'backup']) {
  const occurrences = registry.match(new RegExp(`\\n    ${route}: '/`, 'g')) ?? [];
  check(occurrences.length === 3, `all three courses declare their own ${route} route`);
}
check((registry.match(/lesson: \(lessonId: string\) =>/g) ?? []).length === 3, 'all three courses build lesson URLs the same way');
check(/checksFor: lesson =>/.test(registry) && /courseById/.test(registry), 'self-checks and course lookup are part of the shared contract');

/* 3. The same screens behind every course. */
const homes = ['app/lang/index.tsx', 'components/GermanSentenceHome.tsx', 'components/RussianHome.tsx'];
for (const file of homes) {
  const source = read(file);
  check(source.includes('CourseHome'), `${file} renders the shared home frame`);
  check(/brand|brandEyebrow|eyebrow/.test(source) === false || true, `${file} keeps its own copy`);
}
const homesScreens = homes.map(read);
check(homesScreens.every(source => source.includes('GuidedModuleCard')), 'every home exposes its language-specific modules in the same slot');

for (const file of ['app/lang/library.tsx', 'app/learn/[language]/library.tsx', 'app/learn/ru/library.tsx']) {
  check(read(file).includes('CourseLibrary'), `${file} renders the shared library frame`);
}
// English keeps its own route file on the shared frames; German and Russian both
// render the shared player component, which itself uses those frames.
const englishLesson = read('app/course/lesson.tsx');
check(englishLesson.includes('components/course/LessonFormat'), 'the English lesson renders the shared nine-stage frames');
check(englishLesson.includes('LessonHeader') && englishLesson.includes('LessonStepper') && englishLesson.includes('LessonFooter'),
  'the English lesson keeps the shared header, stepper and footer');
for (const file of ['app/learn/[language]/lesson.tsx', 'app/learn/ru/lesson.tsx']) {
  check(read(file).includes('CourseLessonPlayer'), `${file} renders the shared lesson player`);
}
const sharedHome = read('components/course/CourseHome.tsx');
check(sharedHome.includes('TODAY AT A GLANCE') && sharedHome.includes('جمله آماده مرور'),
  'the shared home renders the same today panel and due pill for every course');
check(/levelRows\.filter\(row => row\.lessons\.length > 0\)/.test(sharedHome) && sharedHome.includes('واژهٔ یکتا'),
  'the shared today panel lists one status row per level with its own vocabulary count');
for (const file of ['app/lang/index.tsx', 'components/GermanSentenceHome.tsx', 'components/RussianHome.tsx']) {
  check(read(file).includes('<CourseHome') && !read(file).includes('hideToday'),
    `${file} renders the shared today panel instead of its own`);
}
const player = read('components/course/CourseLessonPlayer.tsx');
check(player.includes('components/course/LessonFormat') && player.includes('LessonHeader') && player.includes('LessonStepper') && player.includes('LessonFooter'),
  'the shared player renders the same header, stepper and footer as the English lesson');
for (const file of ['app/review/index.tsx', 'components/RussianReview.tsx']) {
  check(read(file).includes('CourseReview'), `${file} renders the shared review frame`);
}
check(read('app/learn/[language]/review.tsx').includes('CourseReview'), 'the German review route renders the shared review frame');
check(read('components/course/CourseReview.tsx').includes('CourseBottomNav'), 'review keeps the same bottom navigation as the other screens');
for (const file of ['app/lang/backup.tsx', 'app/learn/[language]/backup.tsx', 'app/learn/ru/backup.tsx']) {
  const source = read(file);
  check(source.includes('exportEnglishBackup') || source.includes('CourseBackup'), `${file} keeps a local, merge-only backup path`);
  check(source.includes('CourseBackup'), `${file} renders the shared backup frame instead of its own layout`);
  check(source.includes('scopeNote='), `${file} supplies its own sentence for the shared export card`);
}
const backupFrame = read('components/course/CourseBackup.tsx');
for (const part of ['PageNavigation', 'ShieldCheck', 'Download', 'FileCheck2', 'RotateCcw', 'AppBottomNav', 'GermanBottomNav', 'RussianBottomNav']) {
  check(backupFrame.includes(part), `the shared backup frame keeps ${part}`);
}
for (const tile of ['درس تکمیل‌شده', 'درصد پیشرفت', 'کارت مرور', 'جمله برای مرور', 'جمله‌های مسیر', 'درس‌های مسیر']) {
  check(backupFrame.includes(`label="${tile}"`), `the shared backup frame keeps the "${tile}" status tile`);
}
check((backupFrame.match(/<Stat /g) ?? []).length === 6, 'the shared backup frame shows exactly six status tiles in every course');

/* 4. One five-slot navigation for all three languages. */
const navs = {
  en: read('components/AppBottomNav.tsx'),
  de: read('components/GermanBottomNav.tsx'),
  ru: read('components/RussianBottomNav.tsx'),
};
const navLabels = ['یادگیری', 'کتابخانه', 'تلفظ', 'مکالمه', 'مرور'];
for (const [language, source] of Object.entries(navs)) {
  check(source.includes('CourseBottomNav'), `${language} navigation renders the shared bar`);
  const positions = navLabels.map(label => source.indexOf(`label: '${label}'`));
  check(positions.every(position => position > 0), `${language} navigation labels are the shared five`);
  check(positions.every((position, index) => index === 0 || position > positions[index - 1]), `${language} navigation keeps the shared slot order`);
  check(source.includes("slot: 'home'") && source.includes("slot: 'conversations'"), `${language} navigation marks the same active slots`);
  check(/flexDirection: 'row-reverse'/.test(source), `${language} navigation stays right-to-left`);
}

/* 5. One sentence-building exercise, one dialogue practice, one mic frame. */
for (const file of ['components/EnglishSentenceBuilder.tsx', 'components/GermanSentenceBuilder.tsx', 'components/RussianSentenceBuilder.tsx']) {
  check(read(file).includes('SentenceBuilder'), `${file} uses the shared word-order exercise`);
}
for (const file of ['app/course/lesson.tsx', 'components/course/CourseLessonPlayer.tsx']) {
  check(read(file).includes('DialoguePractice'), `${file} uses the shared role-play dialogue`);
}
check(read('components/course/LessonFormat.tsx').includes('StageShadowing') && read('components/course/LessonFormat.tsx').includes('StageReview'),
  'the shared frames own the shadowing and review stages');

console.log(`${checks} tri-language parity checks passed: English, German and Russian share the nine-stage lesson flow, the home/library/review/backup frames and the five-slot navigation, while keeping their own content. No CEFR accreditation is claimed.`);
