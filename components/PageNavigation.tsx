import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Home } from 'lucide-react-native';

export type PageNavigationTone = 'light' | 'dark';

/** Compact RTL page controls: previous screen plus the language-selection home. */
export function PageNavigation({
  backFallback = '/languages',
  tone = 'light',
  style,
  onBack,
  accentColor,
  borderColor,
}: {
  backFallback?: string;
  tone?: PageNavigationTone;
  style?: ViewStyle;
  onBack?: () => void;
  accentColor?: string;
  borderColor?: string;
}) {
  const router = useRouter();
  const dark = tone === 'dark';
  const iconColor = dark ? '#FFFEFB' : accentColor ?? '#5D765F';

  return (
    <View style={[styles.row, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="بازگشت به صفحهٔ قبل"
        hitSlop={6}
        onPress={() => onBack ? onBack() : router.canGoBack() ? router.back() : router.replace(backFallback as never)}
        style={({ pressed }) => [styles.button, dark ? styles.buttonDark : styles.buttonLight, !dark && borderColor ? { borderColor } : null, pressed && styles.pressed]}
      >
        <ArrowRight size={19} color={iconColor} strokeWidth={2.4} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="بازگشت به صفحهٔ انتخاب زبان"
        hitSlop={6}
        onPress={() => router.replace('/languages' as never)}
        style={({ pressed }) => [styles.button, dark ? styles.buttonDark : styles.buttonLight, !dark && borderColor ? { borderColor } : null, pressed && styles.pressed]}
      >
        <Home size={18} color={iconColor} strokeWidth={2.2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7 },
  button: { width: 44, height: 44, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  buttonLight: { backgroundColor: '#FFFEFB', borderColor: '#E5E6DF', shadowColor: '#29362F', shadowOpacity: 0.07, shadowRadius: 9, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  buttonDark: { backgroundColor: 'rgba(41,54,47,0.12)', borderColor: 'rgba(255,254,251,0.24)' },
  pressed: { opacity: .72, transform: [{ scale: .96 }] },
});
