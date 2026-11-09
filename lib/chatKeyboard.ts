import { Platform } from 'react-native';

/**
 * On Android the composer ended up ~60dp above the keyboard (see the field
 * screenshot): the keyboard height reported to KeyboardStickyView is larger
 * than the visible keyboard by the system bars. This correction, together with
 * the bottom safe-area inset, pins the composer to the keyboard's top edge.
 */
export const ANDROID_KEYBOARD_GAP_FIX = 60;

export function composerKeyboardOffset(bottomInset: number) {
  if (Platform.OS === 'web') return { closed: 0, opened: 0 };
  if (Platform.OS === 'android') return { closed: 0, opened: -(bottomInset + ANDROID_KEYBOARD_GAP_FIX) };
  return { closed: 0, opened: -bottomInset };
}
