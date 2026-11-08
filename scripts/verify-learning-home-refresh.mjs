#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(path, 'utf8');
for (const file of ['app/lang/index.tsx', 'components/RussianHome.tsx', 'components/TurkishHome.tsx']) {
  const source = read(file);
  assert(source.indexOf('style={[styles.welcomeBlock') < source.indexOf('style={styles.pathPanel}'), `${file}: welcome must precede level selector`);
  assert(source.includes('از هر سطحی که درس دارد شروع کن.'), `${file}: level selection hint`);
  assert(source.includes('onSelect={openLevel}'), `${file}: level selector navigation`);
  assert(source.includes('هر روز، یک قدم کوچک.'), `${file}: short closing note`);
  assert(!source.includes("colors={['#211A68', '#4338CA', '#0EAA83']}"), `${file}: no dark welcome`);
}
const theme = read('lib/theme.ts');
const layout = read('app/_layout.tsx');
const pkg = JSON.parse(read('package.json'));
assert(pkg.dependencies['@expo-google-fonts/beiruti'] && !pkg.dependencies['@expo-google-fonts/vazirmatn']);
assert(theme.includes("fontFamily: 'Beiruti'") && theme.includes("numberFontFamily: 'Beiruti-Black'"));
assert(layout.includes('Beiruti_400Regular') && layout.includes('Beiruti_900Black'));
assert(read('components/LearningHomeStyles.ts').includes("root: { flex: 1, backgroundColor: '#FFFFFF' }"));
console.log('Learning home refresh checks passed for all three languages.');
