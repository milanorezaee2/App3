import { Image, StyleSheet, Text, View } from 'react-native';

/** Compact, accessible wordmark and playful book-and-globe emblem. */
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
  wordmark: { fontFamily: 'Inter-SemiBold', color: '#164D46', fontSize: 29, lineHeight: 38, fontWeight: '600', letterSpacing: -0.7, writingDirection: 'ltr' },
});
