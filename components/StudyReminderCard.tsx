import { LocalizedText as Text } from '@/components/LocalizedText';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { Bell, BellOff, Clock3 } from 'lucide-react-native';
import { Typography } from '@/lib/theme';
import {
  REMINDER_OPTIONS,
  loadStudyReminder,
  scheduleStudyReminder,
  studyReminderSummary,
  type StudyReminderSettings,
  type StudyReminderStatus,
} from '@/lib/studyReminder';

const C = {
  ink: '#0F172A',
  text: '#475569',
  muted: '#64748B',
  primary: '#4338CA',
  primarySoft: '#EEF2FF',
  border: '#E2E8F0',
  surface: '#FFFFFF',
  warning: '#B45309',
  warningSoft: '#FEF3C7',
  danger: '#B91C1C',
};

const STATUS_TEXT: Record<StudyReminderStatus, string> = {
  scheduled: 'یادآور فعال شد.',
  disabled: 'یادآور خاموش شد.',
  unsupported: 'در پیش‌نمایش وب اعلان زمان‌بندی نمی‌شود؛ روی گوشی فعال است.',
  'permission-denied': 'اجازهٔ اعلان داده نشد؛ از تنظیمات گوشی اجازه بده.',
  error: 'زمان‌بندی انجام نشد؛ دوباره تلاش کن.',
};

/**
 * One quiet daily nudge.
 *
 * Nothing is scheduled until the learner turns it on: no permission prompt on first launch,
 * no duplicate reminders (a single identifier is always replaced), and it stays silent on the
 * web preview where a local notification cannot fire.
 */
export default function StudyReminderCard() {
  const [settings, setSettings] = useState<StudyReminderSettings | null>(null);
  const [status, setStatus] = useState<StudyReminderStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState('');

  const refresh = useCallback(async () => {
    const next = await loadStudyReminder();
    setSettings(next);
    setSummary(await studyReminderSummary());
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const apply = useCallback(async (next: StudyReminderSettings) => {
    setBusy(true);
    setSettings(next);
    const result = await scheduleStudyReminder(next);
    setStatus(result);
    await refresh();
    setBusy(false);
  }, [refresh]);

  if (!settings) return null;

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={styles.icon}>{settings.enabled ? <Bell size={17} color={C.primary} /> : <BellOff size={17} color={C.muted} />}</View>
        <View style={styles.headCopy}>
          <Text style={styles.title}>یادآور مطالعه</Text>
          <Text style={styles.hint}>یک اعلان آرام در روز؛ بدون توکن، بدون سرور.</Text>
        </View>
        <Switch
          value={settings.enabled}
          disabled={busy}
          onValueChange={value => void apply({ ...settings, enabled: value })}
          trackColor={{ false: '#CBD5E1', true: C.primary }}
          thumbColor="#FFFFFF"
          accessibilityLabel="روشن و خاموش کردن یادآور مطالعه"
        />
      </View>

      {settings.enabled ? (
        <View style={styles.times}>
          {REMINDER_OPTIONS.map(option => {
            const active = option.hour === settings.hour;
            return (
              <Pressable
                key={option.hour}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                disabled={busy}
                onPress={() => void apply({ ...settings, hour: option.hour })}
                style={({ pressed }) => [styles.timeChip, active && styles.timeChipActive, pressed && styles.pressed]}
              >
                <Clock3 size={12} color={active ? '#FFFFFF' : C.muted} />
                <Text style={[styles.timeText, active && styles.timeTextActive]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      <Text style={styles.summary}>{summary}</Text>
      {status ? <Text style={[styles.status, (status === 'error' || status === 'permission-denied') && styles.statusError]}>{STATUS_TEXT[status]}</Text> : null}
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
  times: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6 },
  timeChip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface },
  timeChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  timeText: { fontFamily: Typography.fontFamily, fontSize: 11, color: C.text, writingDirection: 'rtl' },
  timeTextActive: { color: '#FFFFFF' },
  pressed: { opacity: 0.82 },
  summary: { fontFamily: Typography.fontFamily, fontSize: 11, lineHeight: 18, color: C.text, textAlign: 'right', writingDirection: 'rtl' },
  status: { fontFamily: Typography.fontFamily, fontSize: 11, lineHeight: 18, color: C.warning, backgroundColor: C.warningSoft, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7, textAlign: 'right', writingDirection: 'rtl' },
  statusError: { color: C.danger, backgroundColor: '#FEE2E2' },
});
