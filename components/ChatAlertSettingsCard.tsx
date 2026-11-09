import { LocalizedText as Text } from '@/components/LocalizedText';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Switch, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Bell, BellOff, Clock3, ShieldCheck } from 'lucide-react-native';
import {
  BACKGROUND_CHAT_INTERVAL_MINUTES,
  backgroundChatChecksStatus,
  disableBackgroundChatChecks,
  enableBackgroundChatChecks,
  reconcileBackgroundChatChecks,
  type BackgroundChatStatus,
} from '@/lib/backgroundChatChecks';
import { Colors, Radius, Spacing, Typography } from '@/lib/theme';

const STATUS_TEXT: Record<BackgroundChatStatus, string> = {
  enabled: 'روشن است: گوشی هر ۱۵ دقیقه یک بار پیام‌های تازه را بررسی می‌کند.',
  disabled: 'خاموش است: تا وقتی خودت برنامه را باز نکنی، اعلانی نمی‌آید.',
  'permission-denied': 'اجازهٔ اعلان‌ها در گوشی داده نشده است، پس اعلان نمایش داده نمی‌شود.',
  restricted: 'اندروید به این برنامه اجازهٔ بررسی پس‌زمینه نداده است (محدودیت باتری یا تنظیمات گوشی).',
  unsupported: 'این صفحه در مرورگر باز شده است؛ بررسی پس‌زمینه فقط در برنامهٔ گوشی کار می‌کند.',
};

/**
 * Honest control for the Firebase-free chat alerts. It never promises instant
 * delivery: Android runs background work at 15-minute granularity at best.
 */
export function ChatAlertSettingsCard() {
  const [status, setStatus] = useState<BackgroundChatStatus | 'loading'>('loading');
  const [busy, setBusy] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'unknown'>('unknown');
  const [testing, setTesting] = useState(false);

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

  const testLocalNotification = async () => {
    if (Platform.OS !== 'android' || testing) return;
    setTesting(true);
    try {
      const current = await Notifications.getPermissionsAsync();
      const next = current.granted ? current : await Notifications.requestPermissionsAsync();
      setPermission(next.granted ? 'granted' : 'denied');
      if (!next.granted) return;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'تست اعلان Milo',
          body: 'اعلان‌های این گوشی فعال هستند.',
          data: { eventId: `local-test:${Date.now()}` },
          sound: 'default',
        },
        trigger: null,
      });
    } finally {
      setTesting(false);
    }
  };

  const toggle = async () => {
    if (busy || status === 'loading' || status === 'unsupported') return;
    setBusy(true);
    try {
      const next = status === 'enabled'
        ? await disableBackgroundChatChecks()
        : await enableBackgroundChatChecks();
      setStatus(next);
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
          <Text style={styles.subtitle}>بدون سرویس گوگل؛ بررسی دوره‌ای خودِ گوشی</Text>
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

      {status !== 'loading' ? <Text style={styles.status}>{STATUS_TEXT[status]}</Text> : null}
      <Text style={styles.diagnostic}>وضعیت اعلان Android: {permission === 'granted' ? 'مجاز' : permission === 'denied' ? 'غیرفعال' : 'در حال بررسی'}</Text>
      {Platform.OS === 'android' ? (
        <Pressable accessibilityRole="button" accessibilityLabel="آزمایش اعلان این گوشی" style={styles.testButton} onPress={() => void testLocalNotification()} disabled={testing}>
          {testing ? <ActivityIndicator size="small" color={Colors.primary[300]} /> : <Bell size={15} color={Colors.primary[300]} />}
          <Text style={styles.testButtonText}>{testing ? 'در حال آزمایش…' : 'آزمایش اعلان روی همین گوشی'}</Text>
        </Pressable>
      ) : null}

      <View style={styles.factRow}>
        <Clock3 size={15} color={Colors.neutral[500]} />
        <Text style={styles.fact}>
          اندروید اجازه نمی‌دهد بیشتر از هر {BACKGROUND_CHAT_INTERVAL_MINUTES} دقیقه یک بار بررسی شود؛ پس اعلان ممکن است با تأخیر برسد و در حالت ذخیرهٔ باتری دیرتر هم بشود.
        </Text>
      </View>
      <View style={styles.factRow}>
        <ShieldCheck size={15} color={Colors.neutral[500]} />
        <Text style={styles.fact}>
          متن پیام ذخیره یا ارسال نمی‌شود؛ فقط «پیام تازه داری» و نام فرستنده نشان داده می‌شود.
        </Text>
      </View>
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
