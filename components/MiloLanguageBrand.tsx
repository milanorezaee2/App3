import { Image, StyleSheet, Text, View } from 'react-native';

/** Compact wordmark and illustration used by the selected language-home mockup. */
export function MiloLanguageBrand() {
  return (
    <View accessibilityRole="image" accessibilityLabel="Milo" style={styles.brand}>
      <Image
        source={require('../assets/images/splash-learning-light.png')}
        resizeMode="contain"
        style={styles.mark}
      />
      <Text style={styles.wordmark}>Milo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  mark: { width: 64, height: 64 },
  wordmark: { fontFamily: 'Inter-ExtraBold', color: '#102A56', fontSize: 25, lineHeight: 32, fontWeight: '800', letterSpacing: 0.8, writingDirection: 'ltr' },
});
