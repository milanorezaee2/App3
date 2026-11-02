import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const root = new URL('../', import.meta.url).pathname;
const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const configFor = extraEnv => JSON.parse(execFileSync(process.execPath, ['-e', "process.stdout.write(JSON.stringify(require('./app.config')()))"], {
  cwd: root,
  env: { ...process.env, ...extraEnv },
  encoding: 'utf8',
}));

const variants = [
  {
    env: { EXPO_PUBLIC_ENABLED_LANGUAGES: 'en,tr', EXPO_PUBLIC_LEARNER_AUTH_MODE: 'required' },
    name: 'Milo English Turkish',
    packageId: 'com.devicecontrol.miloenglishturkish',
  },
  {
    env: { EXPO_PUBLIC_ENABLED_LANGUAGES: 'en,ru', EXPO_PUBLIC_LEARNER_AUTH_MODE: 'optional' },
    name: 'Milo English Russian',
    packageId: 'com.devicecontrol.miloenglishrussian',
  },
  {
    env: { MILO_ADMIN_APP: 'true', EXPO_PUBLIC_MILO_ADMIN_APP: 'true', EXPO_PUBLIC_ENABLE_EDUCATION_ADMIN: 'true' },
    name: 'MiloMultiLanguage Admin',
    packageId: 'com.devicecontrol.miloadmin',
  },
];

for (const variant of variants) {
  const config = configFor(variant.env);
  assert.equal(config.name, variant.name, `${variant.name} should have the right display name`);
  assert.equal(config.android.package, variant.packageId, `${variant.name} should install as a separate Android app`);
}

const features = read('lib/features.ts');
const languages = read('app/languages.tsx');
const gate = read('components/RegistrationGate.tsx');
const loginRoute = read('app/login.tsx');
const routeGuard = read('app/learn/[language]/_layout.tsx');
const workflow = read('.github/workflows/android-build.yml');
const catalog = read('lib/languages/catalog.ts');
assert.doesNotMatch(catalog, /from ['\"](?:\.\.\/courseContent|\.\/russian|\.\/turkish)/, 'the first screen must not eagerly import every curriculum');
assert.match(gate, /Supabase invokes auth listeners while its auth lock is held/);
assert.match(gate, /authInspectionTimer = setTimeout/);
assert.match(features, /LEARNER_AUTH_MODE/);
assert.match(features, /configuredLanguageIds/);
assert.match(languages, /isLanguageEnabled\(language\.id\)/);
assert.match(languages, /FEATURES\.learnerLoginEntry/);
assert.match(languages, /router\.push\('\/login'/);
assert.match(gate, /forceAuth\?: boolean/);
assert.match(loginRoute, /<RegistrationGate forceAuth>/);
assert.match(routeGuard, /isLanguageEnabled\(language\)/);
assert.match(workflow, /EXPO_PUBLIC_ENABLED_LANGUAGES=en,ru EXPO_PUBLIC_LEARNER_AUTH_MODE=optional/);
assert.match(workflow, /Milo-English-Turkish-Login\.apk/);
assert.match(workflow, /Milo-English-Russian-Optional-Login\.apk/);
assert.match(workflow, /MiloAdmin\.apk/);

console.log('Three APK variants, exact language pairs, required/optional login modes, and route visibility passed.');
