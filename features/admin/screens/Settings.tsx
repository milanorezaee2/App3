import { LocalizedText as Text } from '@/components/LocalizedText';
import { ChatAlertSettingsCard } from '@/components/ChatAlertSettingsCard';
import { authenticateWithDeviceLock, getAppLockConfig, setDeviceLockEnabled } from '@/lib/appLock';
import Constants from 'expo-constants';
import { Fingerprint, History } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { ADMIN_SETUP_FILE, fetchRecentActions } from '../api';
import { SignOutButton } from '../Shell';
import { useAdmin, useAdminQuery } from '../store';
import { Banner, Button, Card, Chip, EmptyState, Field, ListRow, Loading, Page, adminStyles as a, faDateTime } from '../ui';

const ACTION_LABELS: Record<string, string> = {
  purge_conversation: 'حذف کامل گفتگو',
  clear_conversation: 'حذف پیام‌های گفتگو',
  block_conversation_members: 'مسدودکردن اعضای گفتگو',
  unblock_conversation_members: 'رفع مسدودیت اعضای گفتگو',
  publish_release: 'انتشار نسخهٔ اپ',
  unpublish_release: 'غیرفعال‌کردن نسخهٔ اپ',
  delete_release: 'حذف نسخهٔ اپ',
  purge_conversations: 'حذف دسته‌جمعی گفتگوها',
  save_popup: 'ذخیرهٔ پاپ‌آپ',
  delete_popup: 'حذف پاپ‌آپ',
  set_setting: 'تغییر تنظیمات',
  save_plan: 'ذخیرهٔ پلن اشتراک',
  grant_subscription: 'اعطای اشتراک',
  cancel_subscription: 'لغو اشتراک',
};

export function SettingsScreen() {
  const { run, busy, adminEmail } = useAdmin();
  const [deviceLock, setDeviceLock] = useState(false);
  useEffect(() => { void getAppLockConfig().then(config => setDeviceLock(config.deviceEnabled)); }, []);
  const actions = useAdminQuery('audit', () => fetchRecentActions(50));

  const toggleDeviceLock = () => run(async () => {
    if (!(await authenticateWithDeviceLock())) throw new Error('قفل گوشی تأیید نشد؛ تغییری انجام نشد.');
    await setDeviceLockEnabled(!deviceLock); setDeviceLock(!deviceLock);
  }, deviceLock ? 'قفل گوشی برای این برنامه غیرفعال شد.' : 'قفل گوشی فعال شد؛ از این پس برای بازکردن برنامه، قفل گوشی خواسته می‌شود.');

  return (
    <Page title="تنظیمات" subtitle="امنیت دستگاه، اعلان‌ها و سوابق اقدامات مدیر">
      <Card title="حساب مدیر">
        <View style={a.grid}>
          <Field label="ایمیل" value={adminEmail} />
          <Field label="نسخهٔ برنامه" value={Constants.expoConfig?.version || '—'} />
          <Field label="پلتفرم" value={Platform.OS} />
        </View>
        <SignOutButton />
      </Card>
      {Platform.OS !== 'web' && (
        <Card title="قفل دستگاه">
          <Text style={a.muted}>به‌جای ورود مکرر، باز شدن پنل با قفل خود گوشی (اثر انگشت، پین یا الگو) محافظت می‌شود.</Text>
          <View style={a.actions}>
            <Chip label={deviceLock ? 'فعال' : 'غیرفعال'} tone={deviceLock ? 'success' : 'neutral'} />
            <Button variant="soft" tone={deviceLock ? 'warning' : 'accent'} icon={Fingerprint} label={deviceLock ? 'غیرفعال‌کردن قفل گوشی' : 'فعال‌کردن قفل گوشی'} disabled={busy} onPress={() => void toggleDeviceLock()} />
          </View>
        </Card>
      )}
      {Platform.OS !== 'web' && <ChatAlertSettingsCard />}
      <Card title="سوابق اقدامات" padded={false} aside={<History size={16} color="#475569" />}>
        {actions.loading && !actions.data && <Loading />}
        {actions.error && <View style={{ padding: 12 }}><Banner kind="error" text={actions.error} /></View>}
        {actions.data && !actions.data.length && <EmptyState icon={History} title="هنوز اقدامی ثبت نشده است" />}
        {(actions.data || []).map(entry => (
          <ListRow key={entry.id}>
            <View style={{ flex: 1, minWidth: 160 }}>
              <Text style={a.name}>{ACTION_LABELS[entry.action] || entry.action}</Text>
              <Text style={a.mono}>{entry.target_id || ''}</Text>
            </View>
            <Text style={a.muted}>{faDateTime(entry.created_at)}</Text>
          </ListRow>
        ))}
      </Card>
      <Card title="راه‌اندازی سرور">
        <Text style={a.muted}>اگر بخشی از پنل پیام «راه‌اندازی کامل نیست» نشان داد، فایل {ADMIN_SETUP_FILE} را یک‌بار در SQL Editor پروژهٔ Supabase اجرا کنید. این فایل فقط تابع‌های مدیریتی و جدول سوابق را اضافه می‌کند و داده‌ای را تغییر نمی‌دهد.</Text>
      </Card>
    </Page>
  );
}
