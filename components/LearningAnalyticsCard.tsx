import { LocalizedText as Text } from '@/components/LocalizedText';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { Activity, EyeOff, Trash2 } from 'lucide-react-native';
import { Typography } from '@/lib/theme';
import { toPersianDigits as fa } from '@/lib/format';
import {
  clearAnalytics,
  funnelLine,
  isAnalyticsEnabled,
  loadAnalyticsSummary,
  setAnalyticsEnabled,
  type AnalyticsSummary,
} from '@/lib/learningAnalytics';

const C = {
  ink: '#0F172A', text: '#475569', muted: '#64748B', primary: '#4338CA',
  primarySoft: '#EEF2FF', border: '#E2E8F0', surface: '#FFFFFF', warning: '#B45309',
};

/**
 * The honest counterweight to the experience audit: six local events, visible to the learner,
 * switchable off, deletable. Nothing is uploaded anywhere.
 */
export default function LearningAnalyticsCard() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const [next, on] = await Promise.all([loadAnalyticsSummary(), isAnalyticsEnabled()]);
    setSummary(next);
    setEnabled(on);
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const toggle = useCallback(async (value: boolean) => {
    setBusy(true);
    setEnabled(value);
    await setAnalyticsEnabled(value);
    setBusy(false);
  }, []);

  const clear = useCallback(async () => {
    setBusy(true);
    await clearAnalytics();
    await refresh();
    setBusy(false);
  }, [refresh]);

  const rows = summary ? Object.entries(summary.funnel) : [];

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={styles.icon}><Activity size={17} color={C.primary} /></View>
        <View style={styles.headCopy}>
          <Text style={styles.title}>اندازه‌گیری یادگیری</Text>
          <Text style={styles.hint}>شش رویداد ساده، فقط روی همین گوشی. هیچ‌جا فرستاده نمی‌شود.</Text>
        </View>
        <Switch
          value={enabled}
          disabled={busy}
          onValueChange={value => void toggle(value)}
          trackColor={{ false: '#CBD5E1', true: C.primary }}
          thumbColor="#FFFFFF"
          accessibilityLabel="روشن و خاموش کردن اندازه‌گیری یادگیری"
        />
      </View>

      {summary && summary.total > 0 ? (
        <>
          <View style={styles.grid}>
            <Stat value={fa(summary.funnel.en?.started ?? 0)} label="درس شروع‌شده" />
            <Stat value={fa(summary.funnel.en?.completed ?? 0)} label="درس تمام‌شده" />
            <Stat value={fa(summary.activeDays)} label="روز فعال" />
            <Stat value={fa(summary.returns)} label="برگشت روز بعد" />
          </View>
          {rows.map(([course, row]) => (
            <View key={course} style={styles.row}>
              <Text style={styles.rowCourse}>{course.toUpperCase()}</Text>
              <Text style={styles.rowText}>{funnelLine(row)}</Text>
            </View>
          ))}
          <Text style={styles.small}>دورترین مرحله: {Object.entries(summary.furthestStage).map(([course, stage]) => `${course} ${fa(stage + 1)}`).join(' · ') || '—'}</Text>
          <Text style={styles.small}>تلاش دوباره در تمرین: {fa(summary.counts.practice_retry)} · جلسهٔ نیمه‌کاره: {fa(summary.counts.session_abandoned)}</Text>
        </>
      ) : (
        <Text style={styles.small}>هنوز رویدادی ثبت نشده. یک درس برو و برگرد؛ همین‌جا پر می‌شود.</Text>
      )}

      <View style={styles.actions}>
        <Pressable accessibilityRole="button" disabled={busy} onPress={() => void clear()} style={({ pressed }) => [styles.ghost, pressed && styles.pressed]}>
          <Trash2 size={14} color={C.warning} /><Text style={styles.ghostText}>پاک کردن داده</Text>
        </Pressable>
        {!enabled ? <View style={styles.offPill}><EyeOff size={12} color={C.muted} /><Text style={styles.offText}>خاموش</Text></View> : null}
      </View>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, padding: 14, gap: 10 },
  head: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  icon: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  headCopy: { flex: 1, alignItems: 'flex-end', gap: 2 },
  title: { fontFamily: Typography.fontFamily, fontSize: 14, color: C.ink, writingDirection: 'rtl' },
  hint: { fontFamily: Typography.fontFamily, fontSize: 10, lineHeight: 16, color: C.muted, textAlign: 'right', writingDirection: 'rtl' },
  grid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  stat: { flexGrow: 1, minWidth: '22%', borderRadius: 12, backgroundColor: '#F8FAFC', paddingVertical: 9, alignItems: 'center', gap: 2 },
  statValue: { fontFamily: Typography.fontFamily, fontSize: 17, color: C.primary, writingDirection: 'rtl' },
  statLabel: { fontFamily: Typography.fontFamily, fontSize: 9, color: C.muted, writingDirection: 'rtl' },
  row: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  rowCourse: { fontFamily: Typography.fontFamily, fontSize: 11, color: C.primary, writingDirection: 'ltr' },
  rowText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: 11, color: C.text, textAlign: 'right', writingDirection: 'rtl' },
  small: { fontFamily: Typography.fontFamily, fontSize: 10, lineHeight: 17, color: C.muted, textAlign: 'right', writingDirection: 'rtl' },
  actions: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  ghost: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: C.border },
  ghostText: { fontFamily: Typography.fontFamily, fontSize: 11, color: C.warning, writingDirection: 'rtl' },
  offPill: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, backgroundColor: '#F1F5F9' },
  offText: { fontFamily: Typography.fontFamily, fontSize: 10, color: C.muted, writingDirection: 'rtl' },
  pressed: { opacity: 0.82 },
});
