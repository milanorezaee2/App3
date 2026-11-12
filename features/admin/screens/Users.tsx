import { LocalizedText as Text } from '@/components/LocalizedText';
import { downloadRegisteredUsers } from '@/lib/userExport';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ban, Download, MessageSquare, ShieldCheck, Trash2, Users, X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { fetchUsers, removeUserPermanently, setUserBlocked, type AdminUser } from '../api';
import { confirmAction, useAdmin, useAdminQuery } from '../store';
import { Avatar, Banner, Button, Card, Chip, EmptyState, Field, ListRow, Loading, Page, SearchBox, Segmented, adminStyles as a, faAgo, faDateTime, n } from '../ui';

type Filter = 'all' | 'active' | 'blocked' | 'device' | 'email';

export function UsersScreen() {
  const router = useRouter();
  const { focus } = useLocalSearchParams<{ focus?: string }>();
  const { run, busy, fail } = useAdmin();
  const users = useAdminQuery('users', fetchUsers);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => { if (typeof focus === 'string') setSelectedId(focus); }, [focus]);

  const rows = users.data || [];
  const weekAgo = Date.now() - 7 * 86400000;
  const counts = {
    all: rows.length,
    active: rows.filter(u => Date.parse(u.last_seen_at) >= weekAgo).length,
    blocked: rows.filter(u => u.chat_blocked).length,
    device: rows.filter(u => u.account_kind === 'device').length,
    email: rows.filter(u => u.account_kind !== 'device').length,
  };
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(u => {
      if (q && !`${u.full_name} ${u.email}`.toLowerCase().includes(q)) return false;
      if (filter === 'active') return Date.parse(u.last_seen_at) >= weekAgo;
      if (filter === 'blocked') return u.chat_blocked;
      if (filter === 'device') return u.account_kind === 'device';
      if (filter === 'email') return u.account_kind !== 'device';
      return true;
    });
  }, [rows, search, filter, weekAgo]);
  const selected = rows.find(u => u.user_id === selectedId) || null;

  async function toggleBlock(user: AdminUser) {
    const blocking = !user.chat_blocked;
    if (blocking && !(await confirmAction('مسدودکردن کاربر', `دسترسی چت «${user.full_name}» بسته شود؟ کاربر دیگر نمی‌تواند پیام بفرستد یا گفتگوها را ببیند؛ هر زمان قابل بازگشت است.`, 'مسدود کن'))) return;
    const ok = await run(() => setUserBlocked(user.user_id, blocking), blocking ? 'کاربر مسدود شد.' : 'مسدودیت کاربر برداشته شد.');
    if (ok) users.setData(current => (current || []).map(u => u.user_id === user.user_id ? { ...u, chat_blocked: blocking, block_reason: blocking ? 'مسدود توسط مدیر' : null } : u));
  }
  async function deleteUser(user: AdminUser) {
    if (!(await confirmAction('حذف دائمی حساب', `حساب «${user.full_name}» (${user.email}) برای همیشه حذف شود؟ پیشرفت، پروفایل و گفتگوهای این کاربر پاک می‌شود و قابل بازگشت نیست.`, 'حذف دائمی'))) return;
    const ok = await run(() => removeUserPermanently(user.user_id), 'حساب کاربر برای همیشه حذف شد.');
    if (ok) { users.setData(current => (current || []).filter(u => u.user_id !== user.user_id)); setSelectedId(null); }
  }

  return (
    <Page title="کاربران" subtitle={`${n(rows.length)} حساب ثبت‌شده در اپ‌های زبان`}
      actions={<Button variant="ghost" tone="neutral" icon={Download} label="خروجی CSV" disabled={!rows.length} onPress={() => downloadRegisteredUsers(rows).catch(fail)} />}>
      {users.error && <Banner kind="error" text={users.error} />}
      <View style={a.actions}>
        <SearchBox value={search} onChange={setSearch} placeholder="جست‌وجوی نام یا ایمیل…" />
        <Segmented value={filter} onChange={setFilter} options={[
          { id: 'all', label: 'همه', count: counts.all }, { id: 'active', label: 'فعال هفته', count: counts.active },
          { id: 'blocked', label: 'مسدود', count: counts.blocked }, { id: 'email', label: 'حساب ایمیلی', count: counts.email }, { id: 'device', label: 'حساب دستگاهی', count: counts.device },
        ]} />
      </View>
      {selected && (
        <Card title={`پروندهٔ ${selected.full_name}`} aside={<Button small variant="ghost" tone="neutral" icon={X} label="بستن" onPress={() => setSelectedId(null)} />}>
          <View style={a.grid}>
            <Field label="ایمیل" value={selected.email} />
            <Field label="نوع حساب" value={selected.account_kind === 'device' ? 'دستگاهی (بدون ورود)' : 'ایمیلی (با ورود)'} />
            <Field label="پلتفرم / نسخه" value={`${selected.platform || 'نامشخص'} · ${selected.app_version || '—'}`} />
            <Field label="ثبت‌نام" value={faDateTime(selected.registered_at)} />
            <Field label="آخرین فعالیت" value={`${faAgo(selected.last_seen_at)} (${faDateTime(selected.last_seen_at)})`} />
            <Field label="گفتگوها / پیام‌های ارسالی" value={`${n(selected.conversation_count)} / ${n(selected.message_count)}`} />
            <Field label="وضعیت چت" value={selected.chat_blocked ? `مسدود${selected.block_reason ? ` — ${selected.block_reason}` : ''}` : 'آزاد'} />
            <Field label="درخواست پشتیبانی" value={selected.support_conversation_id ? (selected.support_status === 'open' ? 'باز' : 'بسته‌شده') : 'ندارد'} />
            <Field label="شناسهٔ کاربر" value={selected.user_id} />
          </View>
          <View style={a.actions}>
            {selected.support_conversation_id && <Button variant="soft" tone="accent" icon={MessageSquare} label="باز کردن گفتگوی پشتیبانی" onPress={() => router.push({ pathname: '/conversations/human/[conversationId]', params: { conversationId: selected.support_conversation_id, name: selected.full_name } } as never)} />}
            <Button variant="soft" tone={selected.chat_blocked ? 'success' : 'warning'} icon={selected.chat_blocked ? ShieldCheck : Ban} label={selected.chat_blocked ? 'رفع مسدودیت چت' : 'مسدودکردن چت'} disabled={busy} onPress={() => void toggleBlock(selected)} />
            <Button variant="solid" tone="danger" icon={Trash2} label="حذف دائمی حساب" disabled={busy} onPress={() => void deleteUser(selected)} />
          </View>
        </Card>
      )}
      <Card title="فهرست کاربران" padded={false} aside={<Text style={a.muted}>{n(visible.length)} مورد</Text>}>
        {users.loading && !users.data && <Loading />}
        {users.data && !visible.length && <EmptyState icon={Users} title={rows.length ? 'نتیجه‌ای پیدا نشد' : 'هنوز کاربری ثبت‌نام نکرده است'} />}
        {visible.map(u => (
          <ListRow key={u.user_id} onPress={() => setSelectedId(u.user_id === selectedId ? null : u.user_id)} dimmed={u.chat_blocked}>
            <Avatar name={u.full_name} tone={u.chat_blocked ? 'danger' : u.account_kind === 'device' ? 'info' : 'accent'} />
            <View style={{ flex: 1, minWidth: 140 }}>
              <Text style={a.name}>{u.full_name}</Text>
              <Text style={a.mono}>{u.email}</Text>
            </View>
            <View style={{ minWidth: 120 }}>
              <Text style={a.muted}>ثبت: {faAgo(u.registered_at)}</Text>
              <Text style={a.muted}>فعالیت: {faAgo(u.last_seen_at)}</Text>
            </View>
            <View style={{ flexDirection: 'row-reverse', gap: 4, flexWrap: 'wrap' }}>
              <Chip label={u.account_kind === 'device' ? 'دستگاهی' : 'ایمیلی'} tone={u.account_kind === 'device' ? 'info' : 'neutral'} />
              <Chip label={`${u.platform || '؟'} ${u.app_version || ''}`.trim()} />
              {u.chat_blocked && <Chip label="مسدود" tone="danger" />}
              {u.support_status === 'open' && <Chip label="پشتیبانی باز" tone="warning" />}
            </View>
            <View style={a.actions}>
              <Button small variant="soft" tone={u.chat_blocked ? 'success' : 'warning'} icon={u.chat_blocked ? ShieldCheck : Ban} label={u.chat_blocked ? 'رفع مسدودیت' : 'مسدود'} disabled={busy} onPress={() => void toggleBlock(u)} />
              <Button small variant="soft" tone="danger" icon={Trash2} label="حذف" disabled={busy} onPress={() => void deleteUser(u)} />
            </View>
          </ListRow>
        ))}
      </Card>
    </Page>
  );
}
