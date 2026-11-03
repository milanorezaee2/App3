import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { BookOpen, ClipboardList, MessageCircle, RefreshCw, Volume2 } from 'lucide-react-native';
import { Radius, Typography } from '@/lib/theme';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';

const items = [
  { path: '/learn/tr', label: 'یادگیری', icon: BookOpen },
  { path: '/learn/tr/pronunciation', label: 'تلفظ', icon: Volume2 },
  { path: '/conversations', label: 'مکالمه', icon: MessageCircle },
  { path: '/learn/tr/library', label: 'درس‌ها', icon: ClipboardList },
  { path: '/learn/tr/review', label: 'مرور', icon: RefreshCw },
] as const;

export function TurkishBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.shell}>
      {items.map(item => {
        const active = item.path === '/learn/tr' ? pathname === '/learn/tr' : pathname.startsWith(item.path);
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

const styles = StyleSheet.create({
  shell: { minHeight: 72, marginHorizontal: 18, marginBottom: 22, paddingTop: 9, paddingBottom: 11, paddingHorizontal: 12, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-around', backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, borderRadius: 26, shadowColor: '#211A68', shadowOpacity: 0.14, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
  item: { flex: 1, minWidth: 48, alignItems: 'center', gap: 2 },
  iconWrap: { width: 42, height: 32, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  iconWrapActive: { backgroundColor: Palette.primarySoft },
  label: { fontFamily: Typography.fontFamily, fontSize: 12, color: Palette.muted },
  labelActive: { color: Palette.primaryDark, fontWeight: Typography.weights.bold },
});
