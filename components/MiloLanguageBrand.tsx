import { Platform, StyleSheet, Text, View } from 'react-native';

/** Text-only brand lockup for the language selector. */
export function MiloLanguageBrand() {
  return (
    <View accessibilityRole="image" accessibilityLabel="Milo multilanguage" style={styles.brand}>
      <Text style={styles.wordmark}>Milo</Text>
      <Text style={styles.subtitle}>multilanguage</Text>
    </View>
  );
}

const times = Platform.OS === 'web' ? "'Times New Roman', Times, serif" : Platform.OS === 'ios' ? 'Times New Roman' : 'serif';
const styles = StyleSheet.create({
  brand: { alignItems: 'center', justifyContent: 'center', minHeight: 48 },
  wordmark: { fontFamily: times, color: '#16443A', fontSize: 35, lineHeight: 38, fontWeight: '700', writingDirection: 'ltr' },
  subtitle: { fontFamily: times, color: '#526A5A', fontSize: 11, lineHeight: 14, letterSpacing: 0.8, writingDirection: 'ltr' },
});
