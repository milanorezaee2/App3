const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const ts = require('typescript');
const source = read('lib/features.ts');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
const libCache = new Map();
function loadLibModule(name, parentRequire) {
  const file = path.join(__dirname, '..', 'lib', `${name.replace(/^\.\//, '')}.ts`);
  if (libCache.has(file)) return libCache.get(file).exports;
  const code = ts.transpileModule(read(path.relative(path.join(__dirname, '..'), file)), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const module = { exports: {} };
  libCache.set(file, module);
  vm.runInNewContext(code, { exports: module.exports, module, process: { env: {} }, require: parentRequire });
  return module.exports;
}
function load(platform, env = {}, admin = false) {
  const exports = {};
  const localRequire = name => {
    if (name === 'expo-constants') return { __esModule: true, default: { expoConfig: { extra: { appRole: admin ? 'admin' : 'learner' } } } };
    if (name === 'react-native') return { Platform: { OS: platform } };
    if (/^\.\/languages\/[a-z]+$/.test(name)) return loadLibModule(name, localRequire);
    throw new Error(`Unexpected dependency ${name}`);
  };
  const module = { exports };
  vm.runInNewContext(js, { exports, module, process: { env }, require: localRequire });
  return exports;
}
const six = ['en', 'ru', 'tr', 'de', 'fr', 'es'];
const values = scope => Array.from(scope.LANGUAGE_SCOPE);
assert.deepEqual(values(load('web')), six);
assert.equal(load('web').isLanguageEnabled('tr'), true);
assert.deepEqual(values(load('android')), ['en', 'ru', 'de', 'fr', 'es']);
assert.deepEqual(values(load('web', {}, true)), ['en', 'tr']);
assert.deepEqual(values(load('web', { EXPO_PUBLIC_LANGUAGE_SCOPE: ' en,fr, en ' })), ['en', 'fr']);
assert.equal(load('web', { EXPO_PUBLIC_LANGUAGE_SCOPE: 'en,fr' }).isLanguageEnabled('tr'), false);
const learnerScript = require('../package.json').scripts['build:web:learner'];
assert(learnerScript.includes('EXPO_PUBLIC_LANGUAGE_SCOPE=en,ru,tr,de,fr,es'));
assert(read('app/languages.tsx').includes('LANGUAGE_SCOPE.includes(language.id)'));
assert(read('app/learn/[language]/_layout.tsx').includes('!isLanguageEnabled(language)'));
console.log('Web default and explicit learner scope include Turkish; explicit scope, admin and native defaults remain isolated.');
