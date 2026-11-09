const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks += 1; };

const code = ts.transpileModule(read('lib/languages/registry.ts'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText;
const registryModule = { exports: {} };
vm.runInNewContext(code, { exports: registryModule.exports, module: registryModule, require: () => ({}), process: { env: {} } });
const { LANGUAGE_REGISTRY, LANGUAGE_IDS, NATIVE_DEFAULT_SCOPE, ADMIN_DEFAULT_SCOPE, STATIC_ROUTE_LANGUAGES } = registryModule.exports;

check(Array.isArray(LANGUAGE_REGISTRY) && LANGUAGE_REGISTRY.length >= 6, 'the registry lists every shipped language');
check(LANGUAGE_IDS.length === LANGUAGE_REGISTRY.length && new Set(LANGUAGE_IDS).size === LANGUAGE_IDS.length, 'every language id is unique');
for (const entry of LANGUAGE_REGISTRY) {
  const label = entry.id || '<missing id>';
  check(/^[a-z]{2,3}$/.test(entry.id), `language id ${label} uses lowercase letters only`);
  check(typeof entry.name === 'string' && entry.name.length > 0, `language ${label} has a display name`);
  check(typeof entry.nativeName === 'string' && entry.nativeName.length > 0, `language ${label} has a native name`);
  check(/^[a-z]{2,3}(-[A-Za-z0-9]+)*$/.test(entry.speechLocale), `language ${label} has a valid speech locale`);
  check(typeof entry.accent === 'string' && entry.accent.length > 0, `language ${label} has an accent description`);
  check(typeof entry.description === 'string' && entry.description.length > 0, `language ${label} has a picker description`);
  check(['available', 'starter', 'planned'].includes(entry.status), `language ${label} has a known status`);
  check(entry.home === '/lang' || /^\/learn\/[a-z]{2,3}$/.test(entry.home), `language ${label} points at a real course route`);
}
check(registryModule.exports.isLanguageId('en') === true && registryModule.exports.isLanguageId('zz') === false, 'unknown codes are rejected before they reach routing');
check(NATIVE_DEFAULT_SCOPE.every(id => LANGUAGE_IDS.includes(id)) && LANGUAGE_IDS.every(id => NATIVE_DEFAULT_SCOPE.includes(id)), 'native learner builds include all registered languages');
check(ADMIN_DEFAULT_SCOPE.includes('en') && ADMIN_DEFAULT_SCOPE.includes('tr'), 'the admin build still ships English and Turkish');
check(STATIC_ROUTE_LANGUAGES.length >= 1 && STATIC_ROUTE_LANGUAGES.every(id => LANGUAGE_IDS.includes(id)), 'static web routes are generated from the registry');

const catalog = read('lib/languages/catalog.ts');
check(/LANGUAGE_REGISTRY\.map/.test(catalog), 'the picker catalog is generated from the registry');
const lessonTotalsBlock = catalog.split('LESSON_TOTALS')[1] || '';
const starterIds = (read('lib/languages/newCourses.ts').match(/NEW_COURSES\s*=\s*\{([^}]*)\}/) || [, ''])[1]
  .split(',').map(part => part.split(':')[0].trim()).filter(Boolean);
for (const id of LANGUAGE_IDS) {
  const covered = new RegExp(`\\b${id}:`).test(lessonTotalsBlock) || (/\.\.\.STARTER_COURSE_TOTALS/.test(lessonTotalsBlock) && starterIds.includes(id));
  check(covered, `lesson totals in the catalog cover language ${id}`);
}
check(starterIds.length >= 1, 'starter courses still report their own lesson counts');
check(!/id:\s*'ru',\s*\n\s*name:/.test(catalog), 'the catalog no longer hard-codes language entries');
const features = read('lib/features.ts');
check(/from '\.\/languages\/registry'/.test(features), 'scope filtering reads the registry');
const resume = read('lib/appResume.ts');
check(/from '\.\/languages\/registry'/.test(resume) && /LANGUAGE_IDS/.test(resume), 'resume routing reads the registry');
const layout = read('app/learn/[language]/_layout.tsx');
check(/STATIC_ROUTE_LANGUAGES/.test(layout), 'static web routes come from the registry');
const picker = read('app/languages.tsx');
check(/startsFromZero/.test(picker) && !/=== 'de'/.test(picker), 'picker badges use registry flags instead of inline id lists');

console.log(`${checks} language-registry checks passed (single-entry language configuration).`);
