import { Image, Platform, StyleSheet, Text, View } from 'react-native';

/** Compact, accessible wordmark and premium book-and-globe emblem. */
export function MiloLanguageBrand() {
  return (
    <View accessibilityRole="image" accessibilityLabel="Milo" style={styles.brand}>
      <Image
        source={require('../assets/images/milo-premium-mark.png')}
        resizeMode="contain"
        style={styles.mark}
      />
      <Text style={styles.wordmark}>Milo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mark: { width: 48, height: 48 },
  wordmark: { fontFamily: Platform.OS === 'web' ? 'Georgia' : 'serif', color: '#123E31', fontSize: 30, lineHeight: 38, fontWeight: '700', letterSpacing: -0.5, writingDirection: 'ltr' },
});
