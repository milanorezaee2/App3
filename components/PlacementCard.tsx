import { LocalizedText as Text } from '@/components/LocalizedText';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ChevronLeft, Compass } from 'lucide-react-native';
import { loadPlacement, savePlacement } from '@/lib/placement';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';

/**
 * Home-screen invitation to the entry placement test. Shown only until the learner has either taken
 * the test, dismissed it, or already finished a lesson (then there is nothing to place).
 */
export default function PlacementCard({ courseId, href, hasProgress, color = '#4338CA' }: { courseId: string; href: string; hasProgress: boolean; color?: string }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  useFocusEffect(useCallback(() => {
    let alive = true;
    void loadPlacement(courseId).then(record => { if (alive) setVisible(!record); });
    return () => { alive = false; };
  }, [courseId]));
  if (!visible || hasProgress) return null;
  return (
    <View style={[styles.card, { borderColor: `${color}33` }]}>
      <View style={[styles.icon, { backgroundColor: `${color}1A` }]}><Compass size={20} color={color} /></View>
      <View style={styles.copy}>
        <Text style={styles.title}>قبلاً این زبان را خوانده‌اید؟</Text>
        <Text style={styles.text}>با حداکثر {fa(15)} سؤال کوتاه، درس مناسب شما پیدا می‌شود.</Text>
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" style={({ pressed }) => [styles.primary, { backgroundColor: color }, pressed && styles.pressed]} onPress={() => router.push(href as never)}>
            <Text style={styles.primaryText}>تعیین سطح</Text><ChevronLeft size={15} color="#FFFFFF" />
          </Pressable>
          <Pressable accessibilityRole="button" style={({ pressed }) => [styles.ghost, pressed && styles.pressed]} onPress={() => { setVisible(false); void savePlacement(courseId, { status: 'skipped' }); }}>
            <Text style={styles.ghostText}>از اول شروع می‌کنم</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1 },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: 4 },
  title: { fontFamily: Typography.fontFamily, fontSize: 14, color: '#0F172A', textAlign: 'right', writingDirection: 'rtl' },
  text: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 19, color: '#475569', textAlign: 'right', writingDirection: 'rtl' },
  actions: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, marginTop: 6 },
  primary: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  primaryText: { fontFamily: Typography.fontFamily, fontSize: 12, color: '#FFFFFF' },
  ghost: { paddingHorizontal: 8, paddingVertical: 8 },
  ghostText: { fontFamily: Typography.fontFamily, fontSize: 12, color: '#64748B' },
  pressed: { opacity: 0.85 },
});
