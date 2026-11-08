const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const esbuild = require('esbuild');
const React = require('react');
const source = esbuild.transformSync(fs.readFileSync('components/LocalizedText.tsx', 'utf8'), {loader:'tsx',format:'cjs',target:'es2020'}).code;
const moduleStub = {exports:{}};
vm.runInNewContext(source, {module:moduleStub,exports:moduleStub.exports,require: name => name === 'react' ? React : name === 'react-native' ? {Text:'Text',TextInput:'TextInput'} : require(name)});
const {textScript,LocalizedText} = moduleStub.exports;
for (const text of ['سلام دنیا','C1 · پیشرفته','راهنمای français']) assert.equal(textScript(text),'persian');
for (const text of ['English','Русский','İstanbul Türkçesi','Deutsch','Français','Español']) assert.equal(textScript(text),'left-to-right');
for (const text of ['۱۲۳','12:30','—','']) assert.equal(textScript(text),undefined);
const fixedSize={fontSize:13,color:'red'};
for (const [text,align,dir,weight] of [['فارسی','right','rtl','700'],['Français','left','ltr',undefined]]) {
 const rendered=LocalizedText.render({children:text,style:fixedSize},null);
 assert.equal(rendered.props.children,text);assert.equal(rendered.props.style[0],fixedSize);
 assert.equal(rendered.props.style[1].textAlign,align);assert.equal(rendered.props.style[1].writingDirection,dir);assert.equal(rendered.props.style[1].fontWeight,weight);assert(!('fontSize' in rendered.props.style[1]));
}
const nested=React.createElement('Text',null,'دقیقه');
assert.equal(LocalizedText.render({children:['۱ ',nested],style:fixedSize},null).props.style[1].writingDirection,'rtl');
console.log('Persian bold and RTL, six LTR languages, mixed content, neutral numbers, nested text and original size passed.');
const path = require('node:path');
function walk(dir) { return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):e.name.endsWith('.tsx')?[path.join(dir,e.name)]:[]); }
for (const file of [...walk('app'),...walk('components')]) {
 if (file==='components/LocalizedText.tsx') continue;
 const contents=fs.readFileSync(file,'utf8');
 if (/<Text(?:\s|>)/.test(contents)) assert(contents.includes('LocalizedText as Text'), `${file} must apply the text policy`);
 if (/<TextInput(?:\s|>)/.test(contents)) assert(contents.includes('LocalizedTextInput as TextInput'), `${file} must apply the input policy`);
}
console.log('Every app-owned Text and TextInput JSX instance uses the shared presentation policy.');
