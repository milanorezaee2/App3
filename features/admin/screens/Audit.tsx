import { LocalizedText as Text } from '@/components/LocalizedText';
import { findAppTarget } from '@/lib/appReleases';
import { toPersianDigits as fa } from '@/lib/format';
import { History, ShieldCheck } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { fetchRecentActions, type AuditEntry } from '../api';
import { useAdmin, useAdminQuery } from '../store';
import { AdminTheme as T } from '../theme';
import { Banner, Button, Card, Chip, EmptyState, ListRow, Loading, Page, SearchBox, Segmented, StatTile, adminStyles as a, faDateTime, n } from '../ui';

/** Every server-side manager action, labelled in Persian; unknown actions fall back to their raw name. */
export const ACTION_LABELS: Record<string, string> = {
  purge_conversation: 'حذف کامل گفتگو',
  clear_conversation: 'حذف پیام‌های گفتگو',
  block_conversation_members: 'مسدودکردن اعضای گفتگو',
  unblock_conversation_members: 'رفع مسدودیت اعضای گفتگو',
  purge_conversations: 'حذف دسته‌جمعی گفتگوها',
  set_user_blocked: 'تغییر وضعیت مسدودی کاربر',
  set_conversation_hidden: 'پنهان/آشکارکردن گفتگو',
  set_support_status: 'تغییر وضعیت درخواست پشتیبانی',
  publish_release: 'انتشار نسخهٔ اپ',
  unpublish_release: 'غیرفعال‌کردن نسخهٔ اپ',
  set_release_published: 'تغییر وضعیت انتشار نسخه',
  delete_release: 'حذف نسخهٔ اپ',
  save_popup: 'ذخیرهٔ پاپ‌آپ',
  delete_popup: 'حذف پاپ‌آپ',
  set_setting: 'تغییر تنظیمات',
  save_plan: 'ذخیرهٔ پلن اشتراک',
  grant_subscription: 'اعطای اشتراک',
  cancel_subscription: 'لغو اشتراک',
  create_invite: 'ساخت دعوت‌نامه',
  revoke_invite: 'باطل‌کردن دعوت‌نامه',
  set_enrollment_status: 'تغییر وضعیت ثبت‌نام',
};

type Group = 'all' | 'chat' | 'release' | 'popup' | 'subscription' | 'learner' | 'other';
const GROUPS: { id: Group; label: string; test: (action: string) => boolean }[] = [
  { id: 'all', label: 'همه', test: () => true },
  { id: 'chat', label: 'گفتگو و کاربران', test: action => /conversation|user|support/.test(action) },
  { id: 'release', label: 'نسخه‌ها', test: action => /release/.test(action) },
  { id: 'popup', label: 'پاپ‌آپ', test: action => /popup/.test(action) },
  { id: 'subscription', label: 'اشتراک', test: action => /subscription|plan|setting/.test(action) },
  { id: 'learner', label: 'زبان‌آموزان', test: action => /invite|enrollment/.test(action) },
];
const groupOf = (action: string): Group => GROUPS.find(group => group.id !== 'all' && group.test(action))?.id ?? 'other';
const toneOf = (action: string) => /delete|purge|block(?!_members)|cancel|revoke|unpublish/.test(action) && !/unblock/.test(action) ? 'danger' : /publish|grant|create|save/.test(action) ? 'success' : 'info';

/** Human-readable summary of the details payload, so the manager never has to read JSON. */
function describe(entry: AuditEntry): string {
  const d = entry.details || {};
  const parts: string[] = [];
  const str = (key: string) => (typeof d[key] === 'string' ? (d[key] as string) : typeof d[key] === 'number' || typeof d[key] === 'boolean' ? String(d[key]) : '');
  if (str('package_name')) parts.push(findAppTarget(str('package_name'))?.title || str('package_name'));
  if (str('version_name')) parts.push(`نسخهٔ ${str('version_name')}${str('version_code') ? ` (${fa(str('version_code'))})` : ''}`);
  if (str('title')) parts.push(`«${str('title')}»`);
  if (str('email')) parts.push(str('email'));
  if (str('full_name')) parts.push(str('full_name'));
  if (str('status')) parts.push(`وضعیت: ${str('status')}`);
  if (str('blocked')) parts.push(str('blocked') === 'true' ? 'مسدود شد' : 'رفع مسدودیت');
  if (str('published')) parts.push(str('published') === 'true' ? 'منتشر' : 'غیرفعال');
  if (str('reason')) parts.push(`دلیل: ${str('reason')}`);
  if (str('key')) parts.push(`${str('key')} = ${str('value')}`);
  if (str('days')) parts.push(`${fa(str('days'))} روز`);
  if (!parts.length) {
    const keys = Object.keys(d).slice(0, 3);
    for (const key of keys) { const value = d[key]; if (value !== null && typeof value !== 'object') parts.push(`${key}: ${String(value)}`); }
  }
  return parts.join(' · ');
}

export function AuditScreen() {
  const [limit, setLimit] = useState(200);
  const { invalidate } = useAdmin();
  const actions = useAdminQuery('audit', () => fetchRecentActions(limit));
  const [group, setGroup] = useState<Group>('all');
  const [query, setQuery] = useState('');
  const rows = actions.data || [];

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const entry of rows) { const g = groupOf(entry.action); map[g] = (map[g] || 0) + 1; }
    return map;
  }, [rows]);
  const dayAgo = Date.now() - 24 * 3600 * 1000;
  const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
  const today = rows.filter(entry => Date.parse(entry.created_at) >= dayAgo).length;
  const week = rows.filter(entry => Date.parse(entry.created_at) >= weekAgo).length;
  const destructive = rows.filter(entry => toneOf(entry.action) === 'danger').length;

  const filtered = rows.filter(entry => {
    if (group !== 'all' && groupOf(entry.action) !== group) return false;
    if (!query.trim()) return true;
    const haystack = `${ACTION_LABELS[entry.action] || ''} ${entry.action} ${entry.target_id || ''} ${describe(entry)} ${JSON.stringify(entry.details || {})}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <Page title="ممیزی" subtitle="هر کاری که از پنل مدیریت روی سرور انجام شده، با زمان و جزئیات — برای بازبینی و پیگیری">
      {actions.error && <Banner kind="error" text={actions.error} />}
      <View style={a.grid}>
        <StatTile label="اقدام در ۲۴ ساعت اخیر" value={today} icon={History} tone={today ? 'accent' : 'neutral'} />
        <StatTile label="اقدام در ۷ روز اخیر" value={week} icon={History} tone="info" />
        <StatTile label="اقدام‌های حذفی / مسدودکننده" value={destructive} hint="در فهرست بارگذاری‌شده" icon={ShieldCheck} tone={destructive ? 'warning' : 'success'} />
      </View>
      <Card>
        <Segmented value={group} onChange={setGroup} options={GROUPS.map(item => ({ id: item.id, label: item.label, count: item.id === 'all' ? rows.length : counts[item.id] || 0 }))} />
        <SearchBox value={query} onChange={setQuery} placeholder="جست‌وجو در اقدام، شناسه یا جزئیات…" />
      </Card>
      <Card title="سوابق" padded={false} aside={<Text style={a.muted}>{n(filtered.length)} از {n(rows.length)}</Text>}>
        {actions.loading && !actions.data && <Loading />}
        {actions.data && !filtered.length && <EmptyState icon={History} title={rows.length ? 'موردی با این فیلتر نیست' : 'هنوز اقدامی ثبت نشده است'} />}
        {filtered.map(entry => (
          <ListRow key={entry.id}>
            <View style={{ flex: 1, minWidth: 180, gap: 2 }}>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <Text style={a.name}>{ACTION_LABELS[entry.action] || entry.action}</Text>
                <Chip label={GROUPS.find(g => g.id === groupOf(entry.action))?.label || 'سایر'} tone={toneOf(entry.action)} />
              </View>
              {!!describe(entry) && <Text style={a.muted}>{describe(entry)}</Text>}
              {!!entry.target_id && <Text style={a.mono}>{entry.target_id}</Text>}
            </View>
            <Text style={[a.muted, { color: T.color.textFaint }]}>{faDateTime(entry.created_at)}</Text>
          </ListRow>
        ))}
        {actions.data && rows.length >= limit && (
          <View style={{ padding: 12, alignItems: 'center' }}>
            <Button small variant="soft" tone="neutral" label={`نمایش ${fa(limit + 200)} مورد`} onPress={() => { setLimit(limit + 200); setTimeout(() => invalidate(['audit']), 0); }} />
          </View>
        )}
      </Card>
    </Page>
  );
}
