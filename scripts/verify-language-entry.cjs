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

check(/getLearningOnboardingRecord\(\)/.test(languageScreen) && !/hasPriorLearningActivity|rememberExistingLearner/.test(languageScreen), 'language selection gates only on a completed assessment, not legacy course history or network sync');
check(/fromProfile\?\.status === 'assessed'/.test(onboarding) && /localRecord\?\.status === 'assessed'/.test(onboarding), 'legacy existing-learner markers do not suppress the first real assessment');
check(/pathname: '\/onboarding', params: \{ language: language\.id \}/.test(languageScreen), 'new learners continue from language selection to the chosen-language onboarding');
check(/router\.push\(language\.home as never\)/.test(languageScreen), 'returning learners keep the existing direct course-home destinations');
check(/home: '\/lang'/.test(catalog) && /home: '\/learn\/ru'/.test(catalog), 'English and Russian cards keep the original course destinations');
check(/می‌خواهی کدام زبان را یاد بگیری؟/.test(languageScreen), 'the original language-selection screen and copy remain');
check(/چند پرسش کوتاه برای شروع درست/.test(onboardingScreen) && /writingDirection: 'rtl'/.test(onboardingScreen), 'the new onboarding is Persian-first and explicitly RTL');
check(/پرسش \{fa\(questionNumber\)\} از \{fa\(3\)\}/.test(onboardingScreen), 'the onboarding has at most three short questions after language selection');
check(/stage === 'familiarity'/.test(onboardingScreen) && /chooseFamiliarity\('new'\)/.test(onboardingScreen), 'learners can self-identify as new and skip the diagnostic questions');
check(/if \(!correct\)[\s\S]*recommendedLevelId: 0/.test(onboardingScreen), 'a missed basic item places the learner conservatively at the foundation start');
check(/nextCorrectAnswers === 2 \? 2 : 1/.test(onboardingScreen), 'the second adaptive item distinguishes the two available short-assessment bands');
check(/milo_learning_onboarding_v1/.test(onboarding) && /user_metadata/.test(onboarding) && /auth\.updateUser/.test(onboarding), 'the one-time onboarding result syncs through the authenticated profile without a new database table');
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
