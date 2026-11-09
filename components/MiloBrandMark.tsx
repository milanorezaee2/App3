import { Image, StyleSheet } from 'react-native';

type Props = {
  size?: number;
};

/** The canonical Milo globe-and-headphones mark used by the first screen. */
export function MiloGlobeHeadphoneMark({ size = 24 }: Props) {
  return (
    <Image
      accessibilityRole="image"
      accessibilityLabel="لوگوی میلو؛ هدفون و کرهٔ زمین"
      source={require('../assets/images/milo-premium-mark.png')}
      resizeMode="contain"
      style={[styles.mark, { width: size, height: size }]}
    />
  );
}

const styles = StyleSheet.create({
  mark: { flexShrink: 0 },
});
