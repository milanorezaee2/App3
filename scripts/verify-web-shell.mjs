import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../app/+html.tsx', import.meta.url), 'utf8');
const layout = await readFile(new URL('../app/_layout.tsx', import.meta.url), 'utf8');

assert.match(html, /<html\s+lang="fa"\s+dir="rtl">/, 'The web document must declare Persian RTL direction.');
assert.match(html, /name="viewport"[^>]*viewport-fit=cover/, 'The mobile viewport must allow safe-area insets.');
assert.match(html, /#root\s*\{[^}]*direction:\s*rtl\s*;/s, 'The application root must inherit RTL layout.');
assert.match(html, /#root\s*\[dir="auto"\]/, 'Mixed-script text must retain per-element direction handling.');
assert.match(layout, /<SafeAreaView[^>]*edges=\{\['top',\s*'bottom'\]\}/, 'The shared layout must apply top and bottom safe-area edges.');
assert.match(
  layout,
  /<SafeAreaView[^>]*>[\s\S]{0,400}?<WebStatusBarSpacer\s*\/>/,
  'The shared layout must reserve the web status-bar/notch height above the header row.',
);
assert.match(
  await readFile(new URL('../components/WebStatusBarSpacer.tsx', import.meta.url), 'utf8'),
  /Platform\.OS !== 'web' \|\| insets\.top > 0/,
  'The web notch spacer must stand aside when a real device inset exists.',
);

console.log('Web shell checks passed: Persian RTL, mixed-script handling, viewport-fit, safe-area edges and the web notch spacer.');
