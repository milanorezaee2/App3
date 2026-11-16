import { LocalizedText as Text } from '@/components/LocalizedText';
import { Pressable, StyleSheet, View } from 'react-native';
import { Check, ChevronLeft, Mic2, RefreshCw, BookOpen } from 'lucide-react-native';
import { Typography } from '@/lib/theme';
import type { DailyPlanStep } from '@/lib/dailyPlan';

const ICONS = { lesson: BookOpen, review: RefreshCw, speak: Mic2 } as const;

/**
 * Today, as three visible wins.
 *
 * The home screens already show a percentage and a streak, but nothing said «what is today's job and
 * is it done?». This card answers that with three rows, each tappable, each with a real done state.
 */
export default function DailyPlanCard({ steps, onOpen, accent = '#4338CA' }: {
  steps: readonly DailyPlanStep[];
  onOpen: (step: DailyPlanStep) => void;
  accent?: string;
}) {
  const doneCount = steps.filter(step => step.done).length;
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.title}>برنامهٔ امروز</Text>
        <View style={styles.counter}><Text style={styles.counterText}>{doneCount} از {steps.length}</Text></View>
      </View>
      {steps.map(step => {
        const Icon = ICONS[step.id] ?? BookOpen;
        return (
          <Pressable
            key={step.id}
            accessibilityRole="button"
            accessibilityState={{ checked: step.done }}
            accessibilityLabel={`${step.title}: ${step.detail}`}
            onPress={() => onOpen(step)}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <View style={[styles.icon, step.done && styles.iconDone]}>{step.done ? <Check size={16} color="#15803D" /> : <Icon size={16} color={accent} />}</View>
            <View style={styles.copy}>
              <Text style={[styles.rowTitle, step.done && styles.rowTitleDone]}>{step.title}</Text>
              <Text style={styles.rowDetail}>{step.detail}</Text>
            </View>
            <ChevronLeft size={16} color="#94A3B8" />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', padding: 14, gap: 8 },
  head: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: Typography.fontFamily, fontSize: 15, color: '#0F172A', writingDirection: 'rtl' },
  counter: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, backgroundColor: '#EEF2FF' },
  counterText: { fontFamily: Typography.fontFamily, fontSize: 11, color: '#3730A3', writingDirection: 'rtl' },
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingVertical: 9, paddingHorizontal: 8, borderRadius: 14, backgroundColor: '#F8FAFC' },
  pressed: { opacity: 0.85 },
  icon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  iconDone: { backgroundColor: '#DCFCE7' },
  copy: { flex: 1, alignItems: 'flex-end', gap: 1 },
  rowTitle: { fontFamily: Typography.fontFamily, fontSize: 13, color: '#0F172A', writingDirection: 'rtl' },
  rowTitleDone: { color: '#64748B', textDecorationLine: 'line-through' },
  rowDetail: { fontFamily: Typography.fontFamily, fontSize: 10, color: '#64748B', textAlign: 'right', writingDirection: 'rtl' },
});
