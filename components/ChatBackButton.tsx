import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { LocalizedText as Text } from '@/components/LocalizedText';
import { Colors, Typography } from '@/lib/theme';

/** Clearly visible "back" control for chat headers (dark tone). */
export function ChatBackButton({ fallback = '/conversations' }: { fallback?: string }) {
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="بازگشت"
      hitSlop={8}
      onPress={() => (router.canGoBack() ? router.back() : router.replace(fallback as never))}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <ArrowRight size={20} color={Colors.neutral[50]} strokeWidth={2.4} />
      <Text style={styles.label}>بازگشت</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 40, paddingHorizontal: 12, borderRadius: 20, flexDirection: 'row-reverse', alignItems: 'center', gap: 6, backgroundColor: Colors.primary[500] + '33', borderWidth: 1, borderColor: Colors.primary[400] + '66' },
  label: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, fontWeight: Typography.weights.bold, color: Colors.neutral[50] },
  pressed: { opacity: .7 },
});
