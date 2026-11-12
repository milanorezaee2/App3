import { LocalizedText as Text } from '@/components/LocalizedText';
import { useRouter } from 'expo-router';
import { Ban, Eraser, Eye, EyeOff, MessagesSquare, ShieldCheck, Trash2, X, ArrowUpLeft } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { blockConversationMembers, clearConversation, fetchConversationMessages, fetchConversations, purgeConversation, setConversationHidden, setSupportStatus, type AdminConversation } from '../api';
import { confirmAction, useAdmin, useAdminQuery } from '../store';
import { AdminTheme as T } from '../theme';
import { Avatar, Banner, Button, Card, Chip, EmptyState, ListRow, Loading, Page, SearchBox, Segmented, adminStyles as a, faAgo, faDateTime, n } from '../ui';

type Filter = 'all' | 'support' | 'open' | 'direct' | 'hidden';

function conversationTitle(c: AdminConversation): string {
  const names = c.members.filter(m => !m.is_admin).map(m => m.name);
  if (c.is_support) return names[0] ? `پشتیبانی · ${names[0]}` : 'پشتیبانی';
  return names.length ? names.join(' ↔ ') : 'گفتگو';
}

export function ChatsScreen({ mode }: { mode: 'all' | 'support' }) {
  const router = useRouter();
  const { run, busy } = useAdmin();
  const chats = useAdminQuery('chats', fetchConversations);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>(mode === 'support' ? 'open' : 'all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const messages = useAdminQuery(`messages:${selectedId}`, () => fetchConversationMessages(selectedId!), Boolean(selectedId));

  const rows = useMemo(() => (chats.data || []).filter(c => mode === 'all' || c.is_support), [chats.data, mode]);
  const counts = {
    all: rows.length,
    support: rows.filter(c => c.is_support).length,
    open: rows.filter(c => c.is_support && c.support_status === 'open').length,
    direct: rows.filter(c => !c.is_support).length,
    hidden: rows.filter(c => c.deleted_at).length,
  };
  const visible = rows.filter(c => {
    const q = search.trim().toLowerCase();
    if (q && !`${conversationTitle(c)} ${c.members.map(m => m.email || '').join(' ')} ${c.last_message_preview || ''}`.toLowerCase().includes(q)) return false;
    if (filter === 'support') return c.is_support;
    if (filter === 'open') return c.is_support && c.support_status === 'open';
    if (filter === 'direct') return !c.is_support;
    if (filter === 'hidden') return Boolean(c.deleted_at);
    return true;
  });
  const selected = rows.find(c => c.conversation_id === selectedId) || null;
  const patch = (id: string, change: Partial<AdminConversation>) => chats.setData(current => (current || []).map(c => c.conversation_id === id ? { ...c, ...change } : c));

  async function toggleHidden(c: AdminConversation) {
    const hide = !c.deleted_at;
    if (hide && !(await confirmAction('پنهان‌کردن گفتگو', `گفتگوی «${conversationTitle(c)}» برای همهٔ اعضا پنهان شود؟ پیام‌ها حفظ می‌شوند و مدیر می‌تواند آن را بازگرداند.`, 'پنهان کن'))) return;
    const ok = await run(() => setConversationHidden(c.conversation_id, hide), hide ? 'گفتگو پنهان شد.' : 'گفتگو بازیابی شد.');
    if (ok) patch(c.conversation_id, { deleted_at: hide ? new Date().toISOString() : null });
  }
  async function clear(c: AdminConversation) {
    if (!(await confirmAction('حذف پیام‌ها', `همهٔ ${n(c.message_count)} پیام گفتگوی «${conversationTitle(c)}» برای همیشه حذف شود؟ خود گفتگو باقی می‌ماند.`, 'حذف پیام‌ها'))) return;
    const ok = await run(() => clearConversation(c.conversation_id).then(() => undefined), 'پیام‌های گفتگو حذف شدند.');
    if (ok) { patch(c.conversation_id, { message_count: 0, last_message_preview: null, last_message_at: null }); messages.refresh(); }
  }
  async function purge(c: AdminConversation) {
    if (!(await confirmAction('حذف کامل گفتگو', `گفتگوی «${conversationTitle(c)}» همراه با همهٔ پیام‌ها برای همیشه حذف شود؟ این کار قابل بازگشت نیست.`, 'حذف کامل'))) return;
    const ok = await run(() => purgeConversation(c.conversation_id), 'گفتگو به‌طور کامل حذف شد.');
    if (ok) { chats.setData(current => (current || []).filter(x => x.conversation_id !== c.conversation_id)); setSelectedId(null); }
  }
  async function blockMembers(c: AdminConversation, blocked: boolean) {
    if (blocked && !(await confirmAction('مسدودکردن اعضای گفتگو', `دسترسی چت همهٔ اعضای غیرمدیر گفتگوی «${conversationTitle(c)}» بسته شود؟`, 'مسدود کن'))) return;
    const ok = await run(() => blockConversationMembers(c.conversation_id, blocked).then(() => undefined), blocked ? 'اعضای گفتگو مسدود شدند.' : 'مسدودیت اعضا برداشته شد.');
    if (ok) { patch(c.conversation_id, { members: c.members.map(m => m.is_admin ? m : { ...m, blocked }) }); }
  }
  async function toggleSupport(c: AdminConversation) {
    const next = c.support_status === 'open' ? 'resolved' : 'open';
    const ok = await run(() => setSupportStatus(c.conversation_id, next), next === 'resolved' ? 'درخواست بسته شد.' : 'درخواست دوباره باز شد.');
    if (ok) patch(c.conversation_id, { support_status: next });
  }
  const openChat = (c: AdminConversation) => router.push({ pathname: '/conversations/human/[conversationId]', params: { conversationId: c.conversation_id, name: conversationTitle(c) } } as never);

  const anyBlocked = (c: AdminConversation) => c.members.some(m => !m.is_admin && m.blocked);

  return (
    <Page title={mode === 'support' ? 'صندوق پشتیبانی' : 'گفتگوها'} subtitle={mode === 'support' ? 'درخواست‌های زبان‌آموزان به مدیر؛ از همین‌جا پاسخ دهید یا ببندید' : 'همهٔ گفتگوهای کاربران با هم و با مدیر؛ مشاهده، مسدودسازی و حذف'}>
      {chats.error && <Banner kind="error" text={chats.error} />}
      <View style={a.actions}>
        <SearchBox value={search} onChange={setSearch} placeholder="جست‌وجوی نام، ایمیل یا متن آخرین پیام…" />
        <Segmented value={filter} onChange={setFilter} options={mode === 'support'
          ? [{ id: 'open', label: 'باز', count: counts.open }, { id: 'all', label: 'همه', count: counts.all }, { id: 'hidden', label: 'پنهان', count: counts.hidden }]
          : [{ id: 'all', label: 'همه', count: counts.all }, { id: 'direct', label: 'کاربر ↔ کاربر', count: counts.direct }, { id: 'support', label: 'پشتیبانی', count: counts.support }, { id: 'open', label: 'پشتیبانی باز', count: counts.open }, { id: 'hidden', label: 'پنهان', count: counts.hidden }]} />
      </View>

      {selected && (
        <Card title={conversationTitle(selected)} aside={<Button small variant="ghost" tone="neutral" icon={X} label="بستن" onPress={() => setSelectedId(null)} />}>
          <View style={a.actions}>
            {selected.members.map(m => <Chip key={m.user_id} label={`${m.name}${m.is_admin ? ' (مدیر)' : ''}${m.blocked ? ' · مسدود' : ''}${m.email ? ` · ${m.email}` : ''}`} tone={m.blocked ? 'danger' : m.is_admin ? 'accent' : 'neutral'} />)}
            <Chip label={`${n(selected.message_count)} پیام`} />
            <Chip label={`ایجاد: ${faDateTime(selected.created_at)}`} />
            {selected.deleted_at && <Chip label="پنهان‌شده" tone="warning" />}
            {selected.is_support && <Chip label={selected.support_status === 'open' ? 'درخواست باز' : 'درخواست بسته'} tone={selected.support_status === 'open' ? 'warning' : 'success'} />}
          </View>
          <View style={a.actions}>
            {!selected.deleted_at && selected.is_support && <Button variant="solid" tone="accent" icon={ArrowUpLeft} label="پاسخ در گفتگو" onPress={() => openChat(selected)} />}
            {selected.is_support && <Button variant="soft" tone={selected.support_status === 'open' ? 'success' : 'neutral'} label={selected.support_status === 'open' ? 'بستن درخواست' : 'بازکردن دوباره'} disabled={busy} onPress={() => void toggleSupport(selected)} />}
            <Button variant="soft" tone={selected.deleted_at ? 'success' : 'warning'} icon={selected.deleted_at ? Eye : EyeOff} label={selected.deleted_at ? 'بازیابی گفتگو' : 'پنهان‌کردن گفتگو'} disabled={busy} onPress={() => void toggleHidden(selected)} />
            <Button variant="soft" tone={anyBlocked(selected) ? 'success' : 'warning'} icon={anyBlocked(selected) ? ShieldCheck : Ban} label={anyBlocked(selected) ? 'رفع مسدودیت اعضا' : 'مسدودکردن اعضا'} disabled={busy} onPress={() => void blockMembers(selected, !anyBlocked(selected))} />
            <Button variant="soft" tone="danger" icon={Eraser} label="حذف همهٔ پیام‌ها" disabled={busy || !selected.message_count} onPress={() => void clear(selected)} />
            <Button variant="solid" tone="danger" icon={Trash2} label="حذف کامل گفتگو" disabled={busy} onPress={() => void purge(selected)} />
          </View>
          <View style={{ borderTopWidth: 1, borderColor: T.color.border, paddingTop: 10, gap: 6 }}>
            <Text style={a.name}>آخرین پیام‌ها</Text>
            {messages.loading && !messages.data && <Loading />}
            {messages.error && <Banner kind="error" text={messages.error} />}
            {messages.data && !messages.data.length && <Text style={a.muted}>پیامی وجود ندارد.</Text>}
            {(messages.data || []).slice(0, 60).map(m => (
              <View key={m.id} style={{ flexDirection: 'row-reverse', gap: 8, alignItems: 'flex-start' }}>
                <Text style={[a.muted, { minWidth: 90, color: T.color.textFaint }]}>{faAgo(m.created_at)}</Text>
                <Text style={[a.name, { fontSize: T.size.sm }]}>{m.sender_name}:</Text>
                <Text selectable style={[a.muted, { flex: 1, color: T.color.text }]}>{m.message_type === 'voice' ? '🎤 پیام صوتی' : m.body || '—'}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      <Card title={mode === 'support' ? 'درخواست‌ها' : 'فهرست گفتگوها'} padded={false} aside={<Text style={a.muted}>{n(visible.length)} مورد</Text>}>
        {chats.loading && !chats.data && <Loading />}
        {chats.data && !visible.length && <EmptyState icon={MessagesSquare} title={rows.length ? 'نتیجه‌ای پیدا نشد' : mode === 'support' ? 'هنوز درخواستی ثبت نشده است' : 'هنوز گفتگویی وجود ندارد'} />}
        {visible.map(c => {
          const learner = c.members.find(m => !m.is_admin) || c.members[0];
          return (
            <ListRow key={c.conversation_id} onPress={() => setSelectedId(c.conversation_id === selectedId ? null : c.conversation_id)} dimmed={Boolean(c.deleted_at)}>
              <Avatar name={learner?.name || '؟'} tone={c.deleted_at ? 'neutral' : c.is_support ? (c.support_status === 'open' ? 'warning' : 'success') : 'info'} />
              <View style={{ flex: 1, minWidth: 150 }}>
                <Text style={a.name}>{conversationTitle(c)}</Text>
                <Text numberOfLines={1} style={a.muted}>{c.last_message_preview || 'بدون پیام'}</Text>
              </View>
              <View style={{ minWidth: 110 }}>
                <Text style={a.muted}>{faAgo(c.last_message_at || c.created_at)}</Text>
                <Text style={a.muted}>{n(c.message_count)} پیام</Text>
              </View>
              <View style={{ flexDirection: 'row-reverse', gap: 4, flexWrap: 'wrap' }}>
                {c.is_support ? <Chip label={c.support_status === 'open' ? 'باز' : 'بسته'} tone={c.support_status === 'open' ? 'warning' : 'success'} /> : <Chip label="کاربر ↔ کاربر" tone="info" />}
                {c.deleted_at && <Chip label="پنهان" tone="warning" />}
                {anyBlocked(c) && <Chip label="عضو مسدود" tone="danger" />}
              </View>
              <View style={a.actions}>
                {c.is_support && !c.deleted_at && <Button small variant="soft" tone="accent" icon={ArrowUpLeft} label="پاسخ" onPress={() => openChat(c)} />}
                {c.is_support && <Button small variant="soft" tone={c.support_status === 'open' ? 'success' : 'neutral'} label={c.support_status === 'open' ? 'بستن' : 'بازکردن'} disabled={busy} onPress={() => void toggleSupport(c)} />}
                <Button small variant="soft" tone={c.deleted_at ? 'success' : 'warning'} icon={c.deleted_at ? Eye : EyeOff} label={c.deleted_at ? 'بازیابی' : 'پنهان'} disabled={busy} onPress={() => void toggleHidden(c)} />
                <Button small variant="soft" tone="danger" icon={Trash2} label="حذف" disabled={busy} onPress={() => void purge(c)} />
              </View>
            </ListRow>
          );
        })}
      </Card>
    </Page>
  );
}
