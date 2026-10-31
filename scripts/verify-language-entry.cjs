const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks += 1; };

const languageScreen = read('app/languages.tsx');
const englishHome = read('app/lang/index.tsx');
const catalog = read('lib/languages/catalog.ts');
const gate = read('components/RegistrationGate.tsx');
const auth = read('lib/userRegistration.ts');
const resume = read('lib/appResume.ts');
const onboardingScreen = read('app/onboarding.tsx');
const onboarding = read('lib/learningOnboarding.ts');
const englishProgress = read('lib/courseProgress.ts');
const sharedProgress = read('lib/createCourseProgressStore.ts');
const workflowFiles = [
  '.github/workflows/deploy.yml',
  '.github/workflows/apk-learner.yml',
  '.github/workflows/android-build.yml',
];

check(/getLearningOnboardingRecord\(language\.id\)/.test(languageScreen) && !/hasPriorLearningActivity|rememberExistingLearner/.test(languageScreen), 'language selection checks completion for the selected course, not course history or network sync');
check(/parseOnboardingRecords\(user\?\.user_metadata/.test(onboarding) && /parseOnboardingRecords\(JSON\.parse\(raw\)\)\[language\]/.test(onboarding), 'assessment completion is stored and read independently for each language');
check(/Как дела́\?/.test(onboardingScreen) && /Я уже два года живу здесь\./.test(onboardingScreen), 'Russian placement has its own Cyrillic basic and intermediate questions');
check(/pathname: '\/onboarding', params: \{ language: language\.id \}/.test(languageScreen), 'new learners continue from language selection to the chosen-language onboarding');
check(/router\.push\(language\.home as never\)/.test(languageScreen), 'returning learners keep the existing direct course-home destinations');
check(/home: '\/lang'/.test(catalog) && /home: '\/learn\/ru'/.test(catalog), 'English and Russian cards keep the original course destinations');
check(/می‌خواهی کدام زبان را یاد بگیری؟/.test(languageScreen), 'the original language-selection screen and copy remain');
check(/چند پرسش کوتاه برای شروع درست/.test(onboardingScreen) && /writingDirection: 'rtl'/.test(onboardingScreen), 'the new onboarding is Persian-first and explicitly RTL');
check(/پرسش \{fa\(questionNumber\)\} از \{fa\(3\)\}/.test(onboardingScreen), 'the onboarding has at most three short questions after language selection');
check(/stage === 'familiarity'/.test(onboardingScreen) && /chooseFamiliarity\('new'\)/.test(onboardingScreen) && /if \(answer === 'new'\) \{\s*setStage\('basic'\)/.test(onboardingScreen), 'new learners still see one question specific to their selected language');
check(/if \(!correct\)[\s\S]*recommendedLevelId: 0/.test(onboardingScreen), 'a missed basic item places the learner conservatively at the foundation start');
check(/nextCorrectAnswers === 2 \? 2 : 1/.test(onboardingScreen), 'the second adaptive item distinguishes the two available short-assessment bands');
check(/milo_learning_onboarding_by_language_v2/.test(onboarding) && /user_metadata/.test(onboarding) && /auth\.updateUser/.test(onboarding), 'per-language onboarding results sync through the authenticated profile without a new database table');
check(/hasPriorLearningActivity/.test(onboarding) && /hasAnyRussianLessonSession/.test(onboarding), 'existing course progress and saved lesson sessions are protected from repositioning');
check(/setInitialCourseLesson/.test(onboarding) && /setInitialLesson/.test(onboarding), 'new learners use existing course lesson IDs as their suggested starting point');
check(/completedLessonIds\.length > 0/.test(englishProgress) && /completedLessonIds\.length > 0/.test(sharedProgress), 'starting-point helpers refuse to move learners with completed progress');
check(/router\.replace\(\(language === 'en' \? '\/lang' : '\/learn\/ru'\)/.test(onboardingScreen), 'completing onboarding opens the existing home for the selected language');
check(/routeToLanguageSelection/.test(gate) && /router\.replace\('\/languages'/.test(gate)
  && !/PLACEMENT|AssessmentEntry/.test(gate), 'successful OTP login still reaches language selection before the new questions');
check(/signInWithOtp\(/.test(auth) && /verifyOtp\(/.test(auth), 'Supabase email OTP request and verification remain enabled');
check(/onboarding/.test(resume) && /snapshot\.href\.startsWith\('\/onboarding'\)/.test(resume), 'mobile resume safely restores an unfinished onboarding flow');
for (const file of workflowFiles) {
  check(/npm run validate:language-entry/.test(read(file)), `${file} verifies the new language-entry behavior`);
}

console.log(`${checks} language-entry onboarding and OTP-preservation checks passed.`);
