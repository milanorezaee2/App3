import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { Radius, Typography } from '@/lib/theme';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';

/**
 * Bottom navigation shell shared by the Russian and Turkish courses.
 *
 * The two course files were identical apart from the route prefix, so the
 * shell lives here and each course passes its own items and root path.
 */
export interface LanguageNavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

export function LanguageBottomNav({ items, rootPath }: {
  items: readonly LanguageNavItem[];
  /** The course home path; only this route must match exactly to be "active". */
  rootPath: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.shell}>
      {items.map(item => {
        const active = item.path === rootPath ? pathname === rootPath : pathname.startsWith(item.path);
        const Icon = item.icon;
        return (
          <Pressable key={item.path} accessibilityRole="button" accessibilityState={{ selected: active }} style={styles.item} onPress={() => router.replace(item.path as never)}>
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}><Icon size={19} color={active ? Palette.primary : Palette.muted} strokeWidth={active ? 2.4 : 2} /></View>
            <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** RTL navigation bar: the first item is rendered on the right. */
const styles = StyleSheet.create({
  shell: { minHeight: 72, marginHorizontal: 12, marginBottom: 10, paddingTop: 9, paddingBottom: 11, paddingHorizontal: 12, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-around', backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, borderRadius: 26, shadowColor: '#211A68', shadowOpacity: 0.14, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
  item: { flex: 1, minWidth: 0, alignItems: 'center', gap: 2 },
  iconWrap: { width: 42, height: 32, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  iconWrapActive: { backgroundColor: Palette.primarySoft },
  label: { fontFamily: Typography.fontFamily, fontSize: 12, color: Palette.muted },
  labelActive: { color: Palette.primaryDark, fontWeight: Typography.weights.bold },
});
