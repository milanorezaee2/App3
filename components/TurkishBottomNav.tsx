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
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}><Icon size={19} color={active ? '#728D75' : '#778179'} strokeWidth={active ? 2.4 : 2} /></View>
            <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { minHeight: 62, marginHorizontal: 18, marginBottom: 10, paddingTop: 9, paddingBottom: 11, paddingHorizontal: 12, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#FFFEFB', borderWidth: 1, borderColor: '#E5E6DF', borderRadius: 22, shadowColor: '#29362F', shadowOpacity: 0.07, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  item: { flex: 1, minWidth: 48, alignItems: 'center', gap: 2 },
  iconWrap: { width: 42, height: 32, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  iconWrapActive: { backgroundColor: '#E4ECE4' },
  label: { fontFamily: Typography.fontFamily, fontSize: 12, color: '#778179' },
  labelActive: { color: '#5D765F', fontWeight: Typography.weights.bold },
});
