#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFileSync(path.join(root, file), 'utf8');
const walk = directory => readdirSync(path.join(root, directory)).flatMap(name => {
  const relative = path.join(directory, name);
  const full = path.join(root, relative);
  return statSync(full).isDirectory() ? walk(relative) : relative.endsWith('.tsx') ? [relative] : [];
});
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks += 1; };

const entry = read('index.js');
const layout = read('app/_layout.tsx');
const theme = read('lib/theme.ts');
const pkg = JSON.parse(read('package.json'));
check(pkg.dependencies['@expo-google-fonts/inter'], 'bundled Inter dependency is declared');
check(pkg.dependencies['@expo-google-fonts/beiruti'], 'bundled Beiruti dependency is declared');
check(!pkg.dependencies['@expo-google-fonts/vazirmatn'] && !pkg.dependencies.iransans, 'legacy Persian font dependencies are removed');
check(/Inter_800ExtraBold/.test(layout) && !/Inter_(?:400Regular|600SemiBold)/.test(layout), 'Latin copy bundles only the extra-bold Inter face');
check(/Beiruti_700Bold/.test(layout) && !/Vazirmatn|IRANSans|Lalezar/.test(layout), 'Beiruti Bold is bundled locally without legacy Persian aliases');
check(/fontFamily:\s*'Beiruti_700Bold'/.test(theme) && /numberFontFamily:\s*'Beiruti_700Bold'/.test(theme), 'Persian copy and numerals use Beiruti Bold');
check(/I18nManager\.allowRTL\(false\)/.test(entry) && /I18nManager\.forceRTL\(false\)/.test(entry)
  && !/I18nManager\.(?:allowRTL|forceRTL)\(true\)/.test(entry + layout),
  'entry point and root layout cannot alternate native direction between launches');
check(/latinFontFamily:\s*'Inter-ExtraBold'/.test(theme), 'shared Latin typography points to the bundled deterministic face');
check(/allowFontScaling:\s*false/.test(layout) && /maxFontSizeMultiplier:\s*1/.test(layout), 'OEM/user font scaling cannot destabilize layouts');
check(/includeFontPadding:\s*false/.test(layout) && /textBreakStrategy:\s*'simple'/.test(layout), 'Android OEM font padding and line-breaking differences are neutralized');

const missing = [];
for (const file of [...walk('app'), ...walk('components')]) {
  const lines = read(file).split('\n');
  lines.forEach((line, index) => {
    if (!line.includes("writingDirection: 'ltr'") && !line.includes("writingDirection:'ltr'")) return;
    const nearby = lines.slice(Math.max(0, index - 14), index + 1).join('\n');
    if (!line.includes('fontFamily') && !nearby.includes('fontFamily: Typography.latinFontFamily')) {
      missing.push(`${file}:${index + 1}`);
    }
  });
}
check(missing.length === 0, `every explicit LTR style has a bundled font (${missing.join(', ')})`);
const legacyFontRefs = [...walk('app'), ...walk('components')].filter(file =>
  /fontFamily:\s*['"](?:Vazir(?:matn)?(?:-Medium|-Bold|-Black)?|IRANSans|Lalezar|Inter|Inter-SemiBold)['"]/.test(read(file)));
check(legacyFontRefs.length === 0, `legacy and non-bold direct font families are absent (${legacyFontRefs.join(', ')})`);
const englishUI = read('components/EnglishUI.tsx');
check(/<ScrollView horizontal showsHorizontalScrollIndicator=\{false\}/.test(englishUI)
  && /railLabel: \{[^\n]*fontSize: 9/.test(englishUI)
  && /numberOfLines=\{3\}/.test(englishUI) && /hitSlop=\{5\}/.test(englishUI),
  'every level remains a readable, scrollable, accessible start control');
const englishLesson = read('components/EnglishLessonRoute.tsx');
const russianLesson = read('components/RussianLesson.tsx');
const turkishLesson = read('components/TurkishLesson.tsx');
const styleLine = (source, name) => source.match(new RegExp(`^  ${name}: \\{.*\\},$`, 'm'))?.[0];
check(['header', 'content', 'sentenceCard', 'soundButton', 'replayRow', 'replayButton', 'replayText', 'footer'].every(name =>
  styleLine(englishLesson, name) === styleLine(turkishLesson, name)
  && styleLine(russianLesson, name) === styleLine(turkishLesson, name)),
  'English and Russian compact lesson metrics match the Turkish reference');

const emma = read('app/conversations/emma.tsx');
const human = read('app/conversations/human/[conversationId].tsx');
const personalSync = read('app/personal-sync.tsx');
const appConfig = read('app.json');
const androidSmoke = read('.github/scripts/android-emulator-smoke-test.sh');
check(/"softwareKeyboardLayoutMode":\s*"resize"/.test(appConfig), 'Android manifest is generated with native keyboard resize');
check(/زبان را از زندگی یاد بگیر/.test(androidSmoke)
  && /ارسال کد ورود به ایمیل/.test(androidSmoke)
  && /mInputShown=true/.test(androidSmoke)
  && /Login input remains fully visible above the software keyboard/.test(androidSmoke),
  'Android release smoke test covers the no-login home, the login gate and the real keyboard');
check(/messages:\s*\{\s*flex:\s*1,\s*minHeight:\s*0/.test(emma) && /messages:\s*\{\s*flex:\s*1,\s*minHeight:\s*0/.test(human), 'message lists yield all resized height to the composer');
check(/<KeyboardStickyView offset=\{\{ closed: 0, opened: 0 \}\}>/.test(emma)
  && /<KeyboardStickyView offset=\{\{ closed: 0, opened: 0 \}\}>/.test(human)
  && /<View style=\{styles\.composer\}>/.test(emma)
  && /<View style=\{styles\.composer\}>/.test(human), 'both complete composers and their side buttons use the shared UI-thread keyboard-sticky root');
check(/composer:\s*\{\s*flexShrink:\s*0,\s*minHeight:\s*64,\s*overflow:\s*'visible'/.test(emma)
  && /composer:\s*\{\s*flexShrink:\s*0,\s*minHeight:\s*64,\s*overflow:\s*'visible'/.test(human), 'chat composers retain their full visible height during resize');
check((human.match(/containsRtlScript/g) || []).length >= 4
  && /rtlText:\s*\{\s*fontFamily:\s*Typography\.fontFamily/.test(human)
  && /ltrText:\s*\{\s*fontFamily:\s*Typography\.latinFontFamily/.test(human),
  'mixed human chat selects a deterministic bundled font per script');
check((personalSync.match(/fontFamily:\s*Typography\.fontFamily/g) || []).length >= 18
  && (personalSync.match(/fontFamily:\s*Typography\.latinFontFamily/g) || []).length >= 3,
  'personal sync Persian UI and Latin account fields both use bundled fonts');
check(!/Platform\.OS === 'android' \? 'height'/.test(emma) && !/Platform\.OS === 'android' \? 'height'/.test(human), 'Android native adjustResize is not double-applied');
check(/automaticallyAdjustKeyboardInsets=\{Platform\.OS === 'ios'\}/.test(emma)
  && /automaticallyAdjustKeyboardInsets=\{Platform\.OS === 'ios'\}/.test(human), 'iOS scroll insets track the keyboard');

console.log(`${checks} typography and keyboard-stability checks passed.`);
