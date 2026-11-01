import { StyleSheet, Text, View } from 'react-native';

/** Page-specific brand mark for the redesigned language catalogue. */
export function MiloLanguageBrand() {
  return (
    <View accessibilityRole="image" accessibilityLabel="MILO" style={styles.brand}>
      <View style={styles.mark}>
        <View style={styles.pathLine} />
        <View style={styles.pathNodeStart} />
        <View style={styles.pathNodeMiddle} />
        <View style={styles.pathNodeEnd} />
      </View>
      <Text style={styles.wordmark}>MILO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: { width: 42, height: 42, borderRadius: 15, backgroundColor: '#203B31', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  pathLine: { position: 'absolute', width: 2, height: 23, borderRadius: 2, backgroundColor: '#F7F2E8', transform: [{ rotate: '34deg' }] },
  pathNodeStart: { position: 'absolute', width: 7, height: 7, borderRadius: 4, left: 9, bottom: 9, backgroundColor: '#D88A6A' },
  pathNodeMiddle: { position: 'absolute', width: 9, height: 9, borderRadius: 5, left: 17, top: 16, backgroundColor: '#F3E4D9', borderWidth: 2, borderColor: '#203B31' },
  pathNodeEnd: { position: 'absolute', width: 7, height: 7, borderRadius: 4, right: 8, top: 8, backgroundColor: '#D88A6A' },
  wordmark: { fontFamily: 'Inter-ExtraBold', color: '#203B31', fontSize: 19, lineHeight: 24, fontWeight: '800', letterSpacing: 2.2, writingDirection: 'ltr' },
});
