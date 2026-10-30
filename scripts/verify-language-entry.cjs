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
check(/می‌خواهی کدام زبان را یاد بگیری؟/.test(languageScreen) && /برای ورود، یکی از زبان‌ها را انتخاب کن/.test(languageScreen), 'language chooser shows the original non-assessment copy');
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
