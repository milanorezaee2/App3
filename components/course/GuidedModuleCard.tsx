import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { Typography } from '@/lib/theme';

/** Small guided-module card used by every course home in the same slot. */
export function GuidedModuleCard({
  eyebrow, title, description, actionLabel, onPress,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} style={styles.card} onPress={onPress}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.action}>{actionLabel}</Text>
      </View>
      <View style={styles.icon}><ChevronLeft size={17} color={Palette.primary} /></View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 84, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 18, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  copy: { flex: 1, alignItems: 'stretch', gap: 2 },
  eyebrow: { fontFamily: 'Inter-ExtraBold', color: Palette.primary, fontSize: 6, fontWeight: '800', letterSpacing: 1.1, textAlign: 'right', writingDirection: 'ltr' },
  title: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 12, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  description: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  action: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 9, textAlign: 'right', writingDirection: 'rtl', marginTop: 3 },
  icon: { width: 30, height: 30, borderRadius: 10, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
});
