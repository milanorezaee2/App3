#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(path, 'utf8');
for (const file of ['components/EnglishLessonRoute.tsx', 'components/RussianLesson.tsx', 'components/TurkishLesson.tsx']) {
  const source = read(file);
  const scroll = source.indexOf('<ScrollView style={styles.lessonScroll}');
  const header = source.indexOf('style={styles.header}', scroll);
  const content = source.indexOf('<View style={styles.content}>', header);
  const footer = source.indexOf('<View style={styles.footer}>', content);
  assert(scroll >= 0 && header > scroll && content > header && footer > content, `${file}: lesson header and content scroll before the action footer`);
  assert(source.indexOf('</ScrollView>', content) < footer, `${file}: footer remains outside scroll area`);
  assert(source.includes('lessonScroll: { flex: 1, minHeight: 0 }'), `${file}: scroll area can shrink`);
}
const rail = read('components/EnglishUI.tsx');
assert(rail.includes('const narrow = width < 360') && rail.includes("flexBasis: '25%'") && rail.includes("flexWrap: 'wrap'"), 'level choices wrap on narrow phones');
for (const file of ['components/LanguageBottomNav.tsx', 'components/AppBottomNav.tsx']) {
  assert(read(file).includes('item: { flex: 1, minWidth: 0'), `${file}: navigation items can fit narrower screens`);
}
console.log('Responsive learning layout checks passed.');
