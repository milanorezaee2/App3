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
const workflowFiles = [
  '.github/workflows/deploy.yml',
  '.github/workflows/apk-learner.yml',
  '.github/workflows/android-build.yml',
];

check(/onPress=\{\(\) => router\.push\(language\.home as never\)\}/.test(languageScreen), 'language cards navigate directly to their existing home route');
check(/home: '\/lang'/.test(catalog) && /home: '\/learn\/ru'/.test(catalog), 'English and Russian cards keep the original course destinations');
check(/زبان را از زندگی یاد بگیر/.test(languageScreen) && /کوتاه، شنیدنی، ماندگار/.test(languageScreen), 'language chooser follows the approved warm-journal copy');
check(/MiloLanguageBrand/.test(languageScreen) && !/MiloLogoMotion/.test(languageScreen) && /splash-learning-light\.png/.test(read('components/MiloLanguageBrand.tsx')), 'language chooser uses the selected book-and-globe brand mark');
check(/languages\.map\(\(language\)/.test(languageScreen) && /styles\.languageCard/.test(languageScreen) && /languageList: \{ flexDirection: 'row-reverse'/.test(languageScreen), 'language choices remain catalog-driven cards in one RTL selection row');
check(/learningSteps\.map/.test(languageScreen) && /styles\.stepRow/.test(languageScreen), 'language chooser contains the selected step-by-step path');
check(!/\/placement|PlacementLanguage|PlacementRecommendation|سنجش همان لحظه|شروع پرسش‌های سنجش/.test(languageScreen), 'language chooser contains no assessment route, bank, or CTA');
check(!/\/placement|سنجش آغازین انگلیسی برای انتخاب نقطهٔ شروع|پیداکردن نقطهٔ شروع/.test(englishHome), 'English home contains no remaining placement-assessment shortcut');
check(!fs.existsSync(path.join(root, 'app/placement.tsx'))
  && !fs.existsSync(path.join(root, 'lib/placement.ts'))
  && !fs.existsSync(path.join(root, 'lib/placementProfile.ts'))
  && !fs.existsSync(path.join(root, 'scripts/verify-placement.cjs')), 'assessment screen, question bank, profile logic, and its former test are removed');
check(/routeToLanguageSelection/.test(gate) && /router\.replace\('\/languages'/.test(gate)
  && !/PLACEMENT|AssessmentEntry/.test(gate), 'successful OTP login still proceeds to language selection without an assessment marker');
check(/signInWithOtp\(/.test(auth) && /verifyOtp\(/.test(auth), 'Supabase email OTP request and verification remain enabled');
check(!/placement/.test(resume), 'resume routing no longer recognizes an assessment route');
for (const file of workflowFiles) {
  check(/npm run validate:language-entry/.test(read(file)), `${file} verifies the new language-entry behavior`);
  check(!/npm run validate:placement/.test(read(file)), `${file} no longer runs the removed quiz test`);
}

console.log(`${checks} language-entry removal and OTP-preservation checks passed.`);
