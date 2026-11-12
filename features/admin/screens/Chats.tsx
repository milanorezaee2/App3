import { LocalizedText as Text } from '@/components/LocalizedText';
import { useRouter } from 'expo-router';
import { Ban, CheckSquare, Download, Eraser, Eye, EyeOff, MessagesSquare, ShieldCheck, Square, Trash2, X, ArrowUpLeft } from 'lucide-react-native';
import { saveTextFile } from '@/lib/fileExport';
import { Pressable } from 'react-native';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { blockConversationMembers, clearConversation, exportConversations, fetchConversationMessages, fetchConversations, purgeConversation, purgeConversations, setConversationHidden, setSupportStatus, type AdminConversation, type ExportedMessage } from '../api';
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
  const [selectMode, setSelectMode] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());
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

  const toggleChecked = (id: string) => setChecked(current => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const exitSelect = () => { setSelectMode(false); setChecked(new Set()); };
  const checkedIds = () => Array.from(checked);
  async function bulkDelete() {
    const ids = checkedIds(); if (!ids.length) return;
    if (!(await confirmAction('حذف دسته‌جمعی', `${n(ids.length)} گفتگو همراه با همهٔ پیام‌هایشان برای همیشه حذف شوند؟ این کار قابل بازگشت نیست.`, `حذف ${n(ids.length)} گفتگو`))) return;
    const ok = await run(() => purgeConversations(ids).then(() => undefined), `${n(ids.length)} گفتگو حذف شد.`);
    if (ok) { const set = new Set(ids); chats.setData(current => (current || []).filter(x => !set.has(x.conversation_id))); if (selectedId && set.has(selectedId)) setSelectedId(null); exitSelect(); }
  }
  async function bulkHide(hide: boolean) {
    const ids = checkedIds(); if (!ids.length) return;
    const ok = await run(async () => { for (const id of ids) await setConversationHidden(id, hide); }, hide ? `${n(ids.length)} گفتگو پنهان شد.` : `${n(ids.length)} گفتگو بازیابی شد.`);
    if (ok) { const set = new Set(ids); const stamp = new Date().toISOString(); chats.setData(current => (current || []).map(x => set.has(x.conversation_id) ? { ...x, deleted_at: hide ? stamp : null } : x)); exitSelect(); }
  }
  async function download(ids: string[], format: 'txt' | 'json') {
    if (!ids.length) return;
    await run(async () => {
      const rowsById = new Map(rows.map(c => [c.conversation_id, c]));
      const exported = await exportConversations(ids);
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      if (format === 'json') {
        const grouped = ids.map(id => ({ conversation_id: id, title: rowsById.get(id) ? conversationTitle(rowsById.get(id)!) : id, members: rowsById.get(id)?.members || [], messages: exported.filter(m => m.conversation_id === id) }));
        await saveTextFile(`milo-chats-${stamp}.json`, JSON.stringify(grouped, null, 2), 'application/json');
        return;
      }
      const lines: string[] = [];
      for (const id of ids) {
        const c = rowsById.get(id);
        lines.push('='.repeat(60), c ? conversationTitle(c) : id, c ? `اعضا: ${c.members.map(m => `${m.name}${m.email ? ` <${m.email}>` : ''}`).join(' | ')}` : '', '='.repeat(60));
        const list = exported.filter((m: ExportedMessage) => m.conversation_id === id);
        if (!list.length) lines.push('(بدون پیام)');
        for (const m of list) lines.push(`[${new Date(m.created_at).toLocaleString('fa-IR')}] ${m.sender_name}: ${m.message_type === 'voice' ? '🎤 پیام صوتی' : m.body || ''}`);
        lines.push('');
      }
      await saveTextFile(`milo-chats-${stamp}.txt`, '\uFEFF' + lines.join('\n'), 'text/plain');
    }, 'فایل آماده شد.');
  }

  return (
    <Page title={mode === 'support' ? 'صندوق پشتیبانی' : 'گفتگوها'} subtitle={mode === 'support' ? 'درخواست‌های زبان‌آموزان به مدیر؛ از همین‌جا پاسخ دهید یا ببندید' : 'همهٔ گفتگوهای کاربران با هم و با مدیر؛ مشاهده، مسدودسازی و حذف'}
      actions={<Button variant={selectMode ? 'solid' : 'ghost'} tone={selectMode ? 'accent' : 'neutral'} icon={CheckSquare} label={selectMode ? 'پایان انتخاب' : 'انتخاب چندتایی'} onPress={() => selectMode ? exitSelect() : setSelectMode(true)} />}>
      {selectMode && (
        <Card>
          <View style={a.actions}>
            <Chip label={`${n(checked.size)} انتخاب‌شده`} tone="accent" />
            <Button small variant="ghost" tone="neutral" label={checked.size === visible.length ? 'لغو انتخاب همه' : `انتخاب همهٔ ${n(visible.length)} مورد`} onPress={() => setChecked(checked.size === visible.length ? new Set() : new Set(visible.map(c => c.conversation_id)))} />
            <Button small variant="soft" tone="accent" icon={Download} label="دانلود متن" disabled={busy || !checked.size} onPress={() => void download(checkedIds(), 'txt')} />
            <Button small variant="soft" tone="info" icon={Download} label="دانلود JSON" disabled={busy || !checked.size} onPress={() => void download(checkedIds(), 'json')} />
            <Button small variant="soft" tone="warning" icon={EyeOff} label="پنهان‌کردن" disabled={busy || !checked.size} onPress={() => void bulkHide(true)} />
            <Button small variant="soft" tone="success" icon={Eye} label="بازیابی" disabled={busy || !checked.size} onPress={() => void bulkHide(false)} />
            <Button small variant="solid" tone="danger" icon={Trash2} label="حذف دسته‌جمعی" disabled={busy || !checked.size} onPress={() => void bulkDelete()} />
          </View>
        </Card>
      )}
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
            <Button variant="soft" tone="info" icon={Download} label="دانلود گفتگو" disabled={busy} onPress={() => void download([selected.conversation_id], 'txt')} />
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
            <ListRow key={c.conversation_id} onPress={() => selectMode ? toggleChecked(c.conversation_id) : setSelectedId(c.conversation_id === selectedId ? null : c.conversation_id)} dimmed={Boolean(c.deleted_at)}>
              {selectMode && <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: checked.has(c.conversation_id) }} onPress={() => toggleChecked(c.conversation_id)} hitSlop={8}>{checked.has(c.conversation_id) ? <CheckSquare size={22} color={T.color.accent} /> : <Square size={22} color={T.color.textFaint} />}</Pressable>}
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
