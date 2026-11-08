import { LocalizedText as Text } from '@/components/LocalizedText';
import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, StyleSheet, View } from 'react-native';

/** The existing wordmark, accompanied by the globe-and-headphones mark. */
export function MiloLanguageBrand() {
  const entrance = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let mounted = true;
    let animation: Animated.CompositeAnimation | undefined;
    // Keep the logo visible and still unless motion is explicitly allowed.
    AccessibilityInfo.isReduceMotionEnabled().then(reduced => {
      if (!mounted || reduced) return;
      entrance.setValue(0);
      animation = Animated.timing(entrance, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });
      animation.start();
    }).catch(() => {});
    return () => { mounted = false; animation?.stop(); };
  }, [entrance]);

  return (
    <View accessibilityRole="image" accessibilityLabel="Milo multilanguage" style={styles.brand}>
      <Animated.Image
        accessible={false}
        source={require('../assets/images/milo-premium-mark.png')}
        resizeMode="contain"
        testID="milo-brand-mark"
        style={[styles.mark, { opacity: entrance.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }), transform: [
          { translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [5, 0] }) },
          { rotate: entrance.interpolate({ inputRange: [0, 1], outputRange: ['-7deg', '0deg'] }) },
          { scale: entrance.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
        ] }]}
      />
      <View style={styles.lockup}>
        <Text style={styles.wordmark}>Milo</Text>
        <Text style={styles.subtitle}>multilanguage</Text>
      </View>
    </View>
  );
}

const times = Platform.OS === 'web' ? "'Times New Roman', Times, serif" : Platform.OS === 'ios' ? 'Times New Roman' : 'serif';
const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minHeight: 48, gap: 8 },
  mark: { width: 48, height: 48 },
  lockup: { alignItems: 'center', justifyContent: 'center' },
  wordmark: { fontFamily: times, color: '#16443A', fontSize: 35, lineHeight: 38, fontWeight: '700', writingDirection: 'ltr' },
  subtitle: { fontFamily: times, color: '#526A5A', fontSize: 11, lineHeight: 14, letterSpacing: 0.8, writingDirection: 'ltr' },
});
