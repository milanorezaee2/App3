import React, { forwardRef, useState } from 'react';
import { StyleSheet, Text as NativeText, TextInput as NativeTextInput, type TextProps, type TextInputProps, type TextStyle } from 'react-native';
import { Typography } from '@/lib/theme';

// Persian and Arabic letters share the app's existing Persian presentation.
// Unicode letters also cover accented Latin, Cyrillic and IPA, not just ASCII.
const letter = /\p{L}/u;
const arabicScript = /\p{Script=Arabic}/u;
const mark = /\p{M}/u;
const asciiDigit = /^[0-9]$/;
const latinPunctuation = /^[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E\u2010-\u2015\u2018-\u201F\u2026]$/;

type Script = 'persian' | 'left-to-right';
export function textScript(value: string): Script | undefined {
  let other = false;
  for (const cluster of clusters(value)) {
    if (isEmojiPresentation(cluster)) continue;
    const character = Array.from(cluster)[0];
    if (!letter.test(character)) continue;
    if (arabicScript.test(character)) return 'persian';
    other = true;
  }
  return other ? 'left-to-right' : undefined;
}

function childrenText(children: React.ReactNode): string {
  let text = '';
  React.Children.forEach(children, child => {
    if (typeof child === 'string' || typeof child === 'number') text += String(child);
    else if (React.isValidElement<{ children?: React.ReactNode }>(child)) text += childrenText(child.props.children);
  });
  return text;
}

const persian: TextStyle = { fontFamily: 'Beiruti', fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' };
// Non-Persian text (English, German, French, Spanish, Turkish, Russian …) and
// every Times New Roman run render bold; Persian keeps its own weight.
const latinFont: TextStyle = { fontFamily: Typography.latinFontFamily, fontWeight: '700' };
const TIMES_FAMILY = /times/i;

// ---- reading colour: dark/medium text becomes pure black; light text on
// coloured or dark surfaces is left alone so it stays legible.
const BLACK = '#000000';
const LIGHT_THRESHOLD = 0.6;
const colorCache = new Map<string, string>();
function parseColor(value: string): { r: number; g: number; b: number; a: number } | null {
  const hex = value.trim().match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3 || h.length === 4) h = h.split('').map(c => c + c).join('');
    if (h.length !== 6 && h.length !== 8) return null;
    const n = parseInt(h, 16);
    const a = h.length === 8 ? (n & 255) / 255 : 1;
    const rgb = h.length === 8 ? n >>> 8 : n;
    return { r: (rgb >> 16) & 255, g: (rgb >> 8) & 255, b: rgb & 255, a };
  }
  const fn = value.trim().match(/^rgba?\(([^)]+)\)$/i);
  if (fn) {
    const parts = fn[1].split(',').map(part => parseFloat(part));
    if (parts.length < 3 || parts.some(Number.isNaN)) return null;
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
  }
  return null;
}
export function readingColor(color: unknown): string | undefined {
  if (color === undefined || color === null) return BLACK;
  if (typeof color !== 'string') return undefined; // platform colours / animated values stay as they are
  const cached = colorCache.get(color);
  if (cached) return cached;
  const lower = color.trim().toLowerCase();
  let result: string;
  if (lower === 'transparent') result = color;
  else if (lower === 'white' || lower === '#fff' || lower === '#ffffff') result = color;
  else {
    const parsed = parseColor(color);
    if (!parsed) result = BLACK;
    else if (parsed.a === 0) result = color;
    else {
      const luminance = (0.2126 * parsed.r + 0.7152 * parsed.g + 0.0722 * parsed.b) / 255;
      result = luminance >= LIGHT_THRESHOLD ? color : BLACK;
    }
  }
  colorCache.set(color, result);
  return result;
}
function presentationStyle(style: TextProps['style'], extra?: TextStyle): TextStyle | undefined {
  const flat = StyleSheet.flatten([style, extra]) as TextStyle | undefined;
  const out: TextStyle = {};
  const color = readingColor(flat?.color);
  if (color !== undefined && color !== flat?.color) out.color = color;
  if (flat?.fontFamily && TIMES_FAMILY.test(String(flat.fontFamily)) && flat.fontWeight !== '700' && flat.fontWeight !== 'bold') out.fontWeight = '700';
  return Object.keys(out).length ? out : undefined;
}
const leftToRight: TextStyle = { ...latinFont, textAlign: 'left', writingDirection: 'ltr' };

// Keep combining marks with their base character. In particular a keycap such
// as 1️⃣ is an emoji, not a digit to be restyled. PUA icon glyphs are not letters.
function clusters(value: string): string[] {
  const result: string[] = [];
  for (const character of value) {
    if (mark.test(character) && result.length) result[result.length - 1] += character;
    else result.push(character);
  }
  return result;
}
function isEmojiPresentation(cluster: string): boolean {
  return cluster.includes('\u20e3') || cluster.includes('\ufe0f');
}
function isForeignCluster(cluster: string): boolean {
  if (isEmojiPresentation(cluster)) return false;
  const base = Array.from(cluster)[0];
  return asciiDigit.test(base) || (letter.test(base) && !arabicScript.test(base));
}
function hasForeignDigit(value: string): boolean {
  return clusters(value).some(cluster => asciiDigit.test(Array.from(cluster)[0]) && !isEmojiPresentation(cluster));
}
function scriptStyle(text: string): TextStyle | undefined {
  const script = textScript(text);
  if (script === 'persian') return persian;
  if (script === 'left-to-right') return leftToRight;
  // Standalone Western digits use the serif without changing alignment or direction.
  return hasForeignDigit(text) ? latinFont : undefined;
}

/** Style only non-Persian runs. Do not assign a direction to inline spans: the
 * native/browser bidi algorithm remains responsible for mixed-script ordering. */
function foreignRuns(value: string): React.ReactNode {
  const parts = clusters(value);
  const foreign = parts.map(isForeignCluster);
  // Adjacent punctuation, e.g. /həˈloʊ/ or C1, follows its foreign run. Spaces,
  // emoji, Persian punctuation, and private-use icon glyphs remain untouched.
  for (let i = 0; i < parts.length; i++) {
    if (latinPunctuation.test(parts[i]) && (foreign[i - 1] || foreign[i + 1])) foreign[i] = true;
  }
  for (let i = parts.length - 1; i >= 0; i--) {
    if (latinPunctuation.test(parts[i]) && (foreign[i - 1] || foreign[i + 1])) foreign[i] = true;
  }
  if (!foreign.some(Boolean)) return value;
  const runs: { text: string; foreign: boolean }[] = [];
  parts.forEach((part, index) => {
    const kind = foreign[index];
    const last = runs[runs.length - 1];
    if (last && last.foreign === kind) last.text += part;
    else runs.push({ text: part, foreign: kind });
  });
  return runs.map((run, index) => run.foreign
    ? <NativeText key={index} style={latinFont}>{run.text}</NativeText>
    : run.text);
}

// Descend only into native Text and fragments; custom children (including icon
// components) retain their identity, props, fonts, event handlers and semantics.
function styleMixedChildren(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, child => {
    if (typeof child === 'string' || typeof child === 'number') return foreignRuns(String(child));
    if (React.isValidElement<{ children?: React.ReactNode }>(child)
        && (child.type === NativeText || child.type === React.Fragment)) {
      return React.cloneElement(child, undefined, styleMixedChildren(child.props.children));
    }
    return child;
  });
}

/** Preserve the outer Text, all accessibility/interaction props and layout. */
export const LocalizedText = forwardRef<NativeText, TextProps>(function LocalizedText({ style, children, ...props }, ref) {
  const content = childrenText(children);
  const script = scriptStyle(content);
  return <NativeText ref={ref} {...props} style={[style, script, presentationStyle(style, script)]}>
    {textScript(content) === 'persian' && clusters(content).some(isForeignCluster) ? styleMixedChildren(children) : children}
  </NativeText>;
});

/** Controlled and uncontrolled inputs update direction as the learner types.
 * Native editable controls support one font family only; mixed input therefore
 * keeps Beiruti and RTL rather than breaking editing, selection or IME state. */
export const LocalizedTextInput = forwardRef<NativeTextInput, TextInputProps>(function LocalizedTextInput({ style, value, defaultValue, placeholder, onChangeText, ...props }, ref) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? '');
  const content = value ?? uncontrolled;
  return <NativeTextInput ref={ref} {...props} value={value} defaultValue={defaultValue} placeholder={placeholder}
    onChangeText={text => { if (value === undefined) setUncontrolled(text); onChangeText?.(text); }}
    style={[style, scriptStyle(content || placeholder || ''), presentationStyle(style, scriptStyle(content || placeholder || ''))]} />;
});
