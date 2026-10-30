import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * A desktop browser reports a `0` top safe-area inset, so the first row of a
 * screen (the Milo header, back buttons, titles) is painted underneath the
 * notch / dynamic island that the phone frame draws over the page. On a real
 * device the same row is pushed down by the hardware inset, so the web build
 * only needs the same reserved space.
 *
 * The spacer is skipped as soon as the runtime reports a real inset (iOS
 * Safari with `viewport-fit=cover`, installed PWA, or native), which makes the
 * device value the single source of truth in every other case.
 *
 * 26px is exactly the height needed to clear the frame's dynamic island
 * (10px offset + 28px height) starting from the shared 12px page padding, so
 * the header ends up flush with the lower edge of the camera without any
 * screen-level padding, margin or content change.
 */
export const WEB_STATUS_BAR_HEIGHT = 26;

export function WebStatusBarSpacer() {
  const insets = useSafeAreaInsets();
  if (Platform.OS !== 'web' || insets.top > 0) return null;
  return (
    <View
      accessible={false}
      pointerEvents="none"
      style={{ height: WEB_STATUS_BAR_HEIGHT, flexShrink: 0 }}
    />
  );
}
