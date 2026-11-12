import { LocalizedText as Text } from '@/components/LocalizedText';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Switch, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Bell, BellOff } from 'lucide-react-native';
import {
  backgroundChatChecksStatus,
  disableBackgroundChatChecks,
  enableBackgroundChatChecks,
  lastBackgroundChatFailure,
  reconcileBackgroundChatChecks,
  type BackgroundChatStatus,
} from '@/lib/backgroundChatChecks';
import { Colors, Radius, Spacing, Typography } from '@/lib/theme';

/** Only problems are surfaced; the normal on/off states speak for themselves through the switch. */
const STATUS_TEXT: Partial<Record<BackgroundChatStatus, string>> = {
  'permission-denied': 'برای دریافت اعلان، اجازهٔ اعلان‌ها را در تنظیمات گوشی فعال کنید.',
  restricted: 'گوشی اجازهٔ اجرای پس‌زمینه به برنامه نداده است؛ از تنظیمات باتری اجازه بدهید.',
  unsupported: 'اعلان پیام فقط در برنامهٔ گوشی در دسترس است.',
};

/**
 * Firebase-free alert switch. Android opts into a native foreground service;
 * Doze and device power policies can still defer network delivery.
 */
export function ChatAlertSettingsCard() {
  const [status, setStatus] = useState<BackgroundChatStatus | 'loading'>('loading');
  const [busy, setBusy] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'unknown'>('unknown');
  const [reason, setReason] = useState('');

  useEffect(() => {
    let active = true;
    void Notifications.getPermissionsAsync()
      .then(next => { if (active) setPermission(next.granted ? 'granted' : 'denied'); })
      .catch(() => { if (active) setPermission('unknown'); });
    void reconcileBackgroundChatChecks()
      .then(() => backgroundChatChecksStatus())
      .then(next => { if (active) setStatus(next); })
      .catch(() => { if (active) setStatus('disabled'); });
    return () => { active = false; };
  }, []);

  const toggle = async () => {
    if (busy || status === 'loading' || status === 'unsupported') return;
    setBusy(true);
    try {
      const next = status === 'enabled'
        ? await disableBackgroundChatChecks()
        : await enableBackgroundChatChecks();
      setStatus(next);
      setReason(next === 'enabled' || next === 'disabled' ? '' : lastBackgroundChatFailure());
    } catch {
      setStatus(await backgroundChatChecksStatus().catch(() => 'disabled'));
    } finally {
      setBusy(false);
    }
  };

  const on = status === 'enabled';

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          {on ? <Bell size={18} color={Colors.primary[400]} /> : <BellOff size={18} color={Colors.neutral[400]} />}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>اعلان پیام‌های تازه</Text>
          <Text style={styles.subtitle}>وقتی پیام جدیدی برایت می‌رسد، باخبر شو</Text>
        </View>
        {status === 'loading' || busy ? (
          <ActivityIndicator color={Colors.primary[400]} />
        ) : (
          <Switch
            accessibilityLabel="اعلان پیام‌های تازه در پس‌زمینه"
            value={on}
            onValueChange={() => void toggle()}
            disabled={status === 'unsupported'}
            trackColor={{ false: Colors.neutral[700], true: Colors.primary[400] }}
            thumbColor={Colors.neutral[850]}
          />
        )}
      </View>

      {status !== 'loading' && (STATUS_TEXT[status] || permission === 'denied') ? <Text style={styles.status}>{reason || STATUS_TEXT[status] || STATUS_TEXT['permission-denied']}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.neutral[850],
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.primary[500] + '30',
    padding: Spacing.md,
    gap: 10,
    marginBottom: Spacing.md,
  },
  headerRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[500] + '14',
  },
  headerText: { flex: 1 },
  title: {
    fontFamily: Typography.fontFamily,
    writingDirection: 'rtl',
    textAlign: 'right',
    color: Colors.neutral[100],
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    writingDirection: 'rtl',
    textAlign: 'right',
    color: Colors.neutral[600],
    fontSize: 10,
    marginTop: 2,
  },
  status: {
    fontFamily: Typography.fontFamily,
    writingDirection: 'rtl',
    textAlign: 'right',
    color: Colors.neutral[300],
    fontSize: Typography.sizes.xs,
    lineHeight: 20,
  },
  diagnostic: { fontFamily: Typography.fontFamily, writingDirection: 'rtl', textAlign: 'right', color: Colors.primary[300], fontSize: 10 },
  testButton: { minHeight: 38, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.primary[500] + '50', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 7 },
  testButtonText: { fontFamily: Typography.fontFamily, fontSize: 11, color: Colors.primary[300] },
  factRow: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 8 },
  fact: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    writingDirection: 'rtl',
    textAlign: 'right',
    color: Colors.neutral[500],
    fontSize: 10,
    lineHeight: 18,
  },
});
