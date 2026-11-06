import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * Classic paper backdrop for the learning home screens.
 *
 * The three home screens used to sit on a dark navy canvas. They now sit on
 * white, and this component supplies the quiet detail that keeps a white page
 * from looking empty: a warm ivory wash, a hairline gilt frame inset from the
 * screen edge, and two very soft vignettes that read as paper texture rather
 * than as colour.
 *
 * Everything here is decorative and sits behind the scroll view, so it takes no
 * touches (`pointerEvents="none"`) and never affects layout or reading order.
 */
export function ClassicPaperFrame() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {/* Warm ivory wash: pure white at the top, faint parchment at the foot. */}
      <LinearGradient
        colors={['#FFFFFF', '#FEFDFB', '#FBF8F1']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Two wide, almost invisible vignettes give the page a lit centre. */}
      <View style={styles.vignetteTop} />
      <View style={styles.vignetteBottom} />

      {/* The gilt frame: classic books are framed, not bordered. */}
      <View style={styles.frame}>
        <View style={styles.frameInner} />
      </View>

      {/* Hairline rules top and bottom, the way a title page is ruled off. */}
      <View style={styles.ruleTop} />
      <View style={styles.ruleBottom} />
    </View>
  );
}

const GILT = 'rgba(176,141,87,0.22)';
const GILT_SOFT = 'rgba(176,141,87,0.12)';

const styles = StyleSheet.create({
  vignetteTop: {
    position: 'absolute',
    top: -180,
    alignSelf: 'center',
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  vignetteBottom: {
    position: 'absolute',
    bottom: -220,
    right: -120,
    width: 460,
    height: 460,
    borderRadius: 230,
    backgroundColor: 'rgba(246,241,229,0.55)',
  },
  frame: {
    position: 'absolute',
    top: 8,
    right: 8,
    bottom: 8,
    left: 8,
    borderWidth: 1,
    borderColor: GILT_SOFT,
    borderRadius: 22,
  },
  frameInner: {
    flex: 1,
    margin: 5,
    borderWidth: 1,
    borderColor: 'rgba(176,141,87,0.10)',
    borderRadius: 17,
  },
  ruleTop: {
    position: 'absolute',
    top: 26,
    alignSelf: 'center',
    width: 64,
    height: 1,
    backgroundColor: GILT,
  },
  ruleBottom: {
    position: 'absolute',
    bottom: 26,
    alignSelf: 'center',
    width: 64,
    height: 1,
    backgroundColor: GILT,
  },
});
