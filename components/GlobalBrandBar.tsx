import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';
import { usePathname } from 'expo-router';
import { Colors } from '@/lib/theme';

/** Routes that already show the main-page brand; the bar is hidden there. */
const HIDDEN_ROUTES = new Set(['/', '/languages', '/index']);
const DARK_PREFIXES = ['/conversations', '/agent'];
const MARK_SIZE = 48; // Same size as the mark on the main (language selection) page.

/**
 * Globe-and-headphones motion mark shown at the top right of every screen
 * except the main page, whose own logo stays untouched.
 */
export function GlobalBrandBar() {
  const pathname = usePathname();
  const entrance = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let mounted = true;
    let animation: Animated.CompositeAnimation | undefined;
    AccessibilityInfo.isReduceMotionEnabled().then(reduced => {
      if (!mounted || reduced) return;
      entrance.setValue(0);
      animation = Animated.timing(entrance, { toValue: 1, duration: 1200, easing: Easing.out(Easing.cubic), useNativeDriver: true });
      animation.start();
    }).catch(() => {});
    return () => { mounted = false; animation?.stop(); };
    // Replays the entrance whenever the route changes.
  }, [entrance, pathname]);

  if (!pathname || HIDDEN_ROUTES.has(pathname)) return null;
  const dark = DARK_PREFIXES.some(prefix => pathname.startsWith(prefix));

  return (
    <View pointerEvents="none" style={[styles.bar, dark && styles.barDark]}>
      <Animated.Image
        accessibilityRole="image"
        accessibilityLabel="لوگوی میلو؛ هدفون و کرهٔ زمین"
        source={require('../assets/images/milo-premium-mark.png')}
        resizeMode="contain"
        style={[styles.mark, {
          opacity: entrance.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }),
          transform: [
            { translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [5, 0] }) },
            { rotate: entrance.interpolate({ inputRange: [0, 1], outputRange: ['-7deg', '0deg'] }) },
            { scale: entrance.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
          ],
        }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Physical `right` keeps the mark at the top right regardless of RTL flipping.
  bar: { width: '100%', height: MARK_SIZE + 8, backgroundColor: 'transparent' },
  barDark: { backgroundColor: Colors.neutral[900] },
  mark: { position: 'absolute', top: 6, right: 16, width: MARK_SIZE, height: MARK_SIZE },
});
