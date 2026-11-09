const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const esbuild = require('esbuild');
const React = require('react');

function loadTsx(file, requireModule, globals = {}) {
  const code = esbuild.transformSync(fs.readFileSync(file, 'utf8'), { loader: file.endsWith('.tsx') ? 'tsx' : 'ts', format: 'cjs', target: 'es2020' }).code;
  const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, require: requireModule, process, ...globals }, { filename: file });
  return module.exports;
}
function themeFor(os) {
  return loadTsx('lib/theme.ts', name => name === 'react-native' ? { Platform: { OS: os } } : require(name)).Typography;
}
const webFont = themeFor('web').latinFontFamily;
assert.match(webFont, /Times New Roman.*serif/);
assert.equal(themeFor('ios').latinFontFamily, 'Times New Roman');
assert.equal(themeFor('android').latinFontFamily, 'serif');
assert.equal(themeFor('android').fontFamily, 'Beiruti');

let state;
const fakeReact = { ...React, useState: initial => [state === undefined ? (state = initial) : state, next => { state = next; }] };
const native = { Text: 'NativeText', TextInput: 'NativeTextInput' };
const { textScript, LocalizedText, LocalizedTextInput } = loadTsx('components/LocalizedText.tsx', name => {
  if (name === 'react') return fakeReact;
  if (name === 'react-native') return native;
  if (name === '@/lib/theme') return { Typography: themeFor('web') };
  return require(name);
});

for (const text of ['سلام دنیا', 'C1 · پیشرفته', 'راهنمای français', 'English فارسی']) assert.equal(textScript(text), 'persian', text);
for (const text of ['English', 'Русский', 'İstanbul Türkçesi', 'Deutsch', 'Français', 'Español', '/həˈloʊ/', 'e\u0301']) assert.equal(textScript(text), 'left-to-right', text);
for (const text of ['۱۲۳', '12:30', '—', '1️⃣', 'ℹ️', '\uE001', '😀', '']) assert.equal(textScript(text), undefined, text);

const fixedSize = { fontSize: 13, color: 'red', fontWeight: '700' };
const fa = LocalizedText.render({ children: 'فارسی', style: fixedSize, accessibilityLabel: 'برچسب', selectable: true }, null);
assert.equal(fa.props.children, 'فارسی');
assert.equal(fa.props.style[0], fixedSize);
assert.equal(fa.props.style[1].fontFamily, 'Beiruti');
assert.equal(fa.props.style[1].fontWeight, '400');
assert.equal(fa.props.style[1].textAlign, 'right');
assert.equal(fa.props.style[1].writingDirection, 'rtl');
assert.equal(fa.props.accessibilityLabel, 'برچسب');
assert.equal(fa.props.selectable, true);
for (const word of ['English', 'Русский', 'İstanbul', 'Français', 'Español', 'Deutsch', 'ʊ']) {
  const result = LocalizedText.render({ children: word, style: fixedSize }, null);
  assert.equal(result.props.children, word);
  assert.equal(result.props.style[1].fontFamily, webFont);
  assert.equal(result.props.style[1].writingDirection, 'ltr');
  assert.equal(result.props.style[1].textAlign, 'left');
  assert.equal(result.props.style[1].fontWeight, undefined);
  assert.equal(result.props.style[1].fontSize, undefined);
}
for (const symbol of ['—', '😀', '1️⃣', 'ℹ️', '\uE001', '۱۲۳', '']) {
  const result = LocalizedText.render({ children: symbol, style: fixedSize }, null);
  assert.equal(result.props.children, symbol);
  assert.equal(result.props.style[1], undefined, symbol);
}
const numeric = LocalizedText.render({ children: '12:30', style: fixedSize }, null);
assert.equal(numeric.props.style[1].fontFamily, webFont);
assert.equal(numeric.props.style[1].writingDirection, undefined);

function visit(node, fn) {
  if (Array.isArray(node)) { node.forEach(child => visit(child, fn)); return; }
  if (React.isValidElement(node)) { fn(node); visit(node.props.children, fn); }
}
function rawText(node) {
  if (Array.isArray(node)) return node.map(rawText).join('');
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  return React.isValidElement(node) ? rawText(node.props.children) : '';
}
const mixedValue = 'سلام ((/həˈloʊ/!)) C1 и d’ici Français 🌍 1️⃣ ℹ️ \uE001، دنیا';
const mixed = LocalizedText.render({ children: mixedValue, style: fixedSize, accessibilityRole: 'header', accessibilityLabel: 'عنوان' }, null);
assert.equal(mixed.props.style[1].fontFamily, 'Beiruti');
assert.equal(mixed.props.style[1].writingDirection, 'rtl');
assert.equal(mixed.props.accessibilityRole, 'header');
assert.equal(mixed.props.accessibilityLabel, 'عنوان');
assert.equal(rawText(mixed.props.children), mixedValue);
const spans = [];
visit(mixed.props.children, element => { if (element.type === native.Text && element.props.style === mixed.props.style[0]) throw Error('wrong inherited style'); if (element.type === native.Text && element.props.style?.fontFamily === webFont) spans.push(element); });
assert(spans.length >= 4);
for (const expected of ['((/həˈloʊ/!))', 'C1', 'и', 'd’ici', 'Français']) assert(spans.some(span => rawText(span) === expected), expected);
for (const span of spans) {
  assert(!/[🌍\uE001]|1️⃣|ℹ️/.test(rawText(span)), 'emoji and icon glyphs must not be styled as letters');
  assert.equal(span.props.style.writingDirection, undefined, 'inline spans must not force bidi');
}
const onPress = () => {};
const inner = React.createElement(native.Text, { style: { color: 'red' }, onPress, accessibilityLabel: 'inner' }, 'English');
const Icon = () => null;
const icon = React.createElement(Icon, { name: 'test', onPress });
const nested = LocalizedText.render({ children: ['فارسی ', React.createElement(React.Fragment, { key: 'fragment' }, inner), icon], style: fixedSize }, null);
assert.equal(nested.props.style[1].writingDirection, 'rtl');
const elements = []; visit(nested.props.children, node => elements.push(node));
const innerAfter = elements.find(element => element.type === native.Text && element.props.accessibilityLabel === 'inner');
assert(innerAfter);
assert.equal(innerAfter.props.onPress, onPress);
assert.equal(innerAfter.props.style.color, 'red');
assert(elements.some(element => element.type === Icon && element.props.onPress === onPress));
assert(elements.some(element => element.type === native.Text && element.props.style?.fontFamily === webFont && rawText(element) === 'English'));

const inputProps = { placeholder: 'فارسی', style: fixedSize, accessibilityLabel: 'نام', onChangeText: onPress };
state = undefined;
let input = LocalizedTextInput.render(inputProps, null);
assert.equal(input.props.style[1].fontFamily, 'Beiruti');
assert.equal(input.props.accessibilityLabel, 'نام');
input.props.onChangeText('Français');
input = LocalizedTextInput.render(inputProps, null);
assert.equal(input.props.style[1].fontFamily, webFont);
assert.equal(input.props.style[1].writingDirection, 'ltr');
input.props.onChangeText('متن English');
input = LocalizedTextInput.render(inputProps, null);
assert.equal(input.props.style[1].fontFamily, 'Beiruti');
assert.equal(input.props.style[1].writingDirection, 'rtl');
input = LocalizedTextInput.render({ ...inputProps, value: 'Русский' }, null);
assert.equal(input.props.value, 'Русский');
assert.equal(input.props.style[1].fontFamily, webFont);

function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.tsx') ? [path.join(dir, e.name)] : []); }
for (const file of [...walk('app'), ...walk('components')]) {
  if (file === 'components/LocalizedText.tsx') continue;
  const contents = fs.readFileSync(file, 'utf8');
  if (/<Text(?:\s|>)/.test(contents)) assert(contents.includes('LocalizedText as Text'), `${file} must apply the text policy`);
  if (/<TextInput(?:\s|>)/.test(contents)) assert(contents.includes('LocalizedTextInput as TextInput'), `${file} must apply the input policy`);
}
const motion = fs.readFileSync('components/MiloLogoMotion.tsx', 'utf8');
assert(/letter:\s*\{\s*fontFamily:\s*Typography\.latinFontFamily/.test(motion), 'animated native wordmark must use the shared family');
console.log('Localized typography: Persian, six languages, IPA, mixed/nested runs, punctuation, emoji/icons, accessibility, inputs, platform fallbacks and shared usage passed.');
