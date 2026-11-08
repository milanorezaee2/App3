import React, { forwardRef, useState } from 'react';
import { Text as NativeText, TextInput as NativeTextInput, type TextProps, type TextInputProps, type TextStyle } from 'react-native';

// Digits and punctuation alone have no language; retain their existing styles.
const persianLetters = /[\u0620-\u063F\u0641-\u064A\u066E-\u06D3\u06FA-\u06FF\u0750-\u077F\u08A0-\u08C9\uFB50-\uFDFF\uFE70-\uFEFC]/;
const otherLetters = /[A-Za-z\u00C0-\u024F\u1E00-\u1EFF\u0400-\u052F]/;
export function textScript(value: string): 'persian' | 'left-to-right' | undefined {
  if (persianLetters.test(value)) return 'persian';
  if (otherLetters.test(value)) return 'left-to-right';
  return undefined;
}

function childrenText(children: React.ReactNode): string {
  let direct = '', nested = '';
  React.Children.forEach(children, child => {
    if (typeof child === 'string' || typeof child === 'number') direct += String(child);
    else if (React.isValidElement<{children?: React.ReactNode}>(child)) nested += childrenText(child.props.children);
  });
  return textScript(direct) ? direct : nested;
}

const persian: TextStyle = { fontFamily: 'Beiruti-Bold', fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' };
const leftToRight: TextStyle = { textAlign: 'left', writingDirection: 'ltr' };
function scriptStyle(text: string): TextStyle | undefined {
  const script = textScript(text);
  return script === 'persian' ? persian : script === 'left-to-right' ? leftToRight : undefined;
}

/** Adds only text presentation; original children, dimensions and interaction are unchanged. */
export const LocalizedText = forwardRef<NativeText, TextProps>(function LocalizedText({ style, children, ...props }, ref) {
  return <NativeText ref={ref} {...props} style={[style, scriptStyle(childrenText(children))]}>{children}</NativeText>;
});

/** Controlled and uncontrolled inputs update direction as the learner types. */
export const LocalizedTextInput = forwardRef<NativeTextInput, TextInputProps>(function LocalizedTextInput({ style, value, defaultValue, placeholder, onChangeText, ...props }, ref) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? '');
  const content = value ?? uncontrolled;
  return <NativeTextInput ref={ref} {...props} value={value} defaultValue={defaultValue} placeholder={placeholder}
    onChangeText={text => { if (value === undefined) setUncontrolled(text); onChangeText?.(text); }}
    style={[style, scriptStyle(content || placeholder || '')]} />;
});
