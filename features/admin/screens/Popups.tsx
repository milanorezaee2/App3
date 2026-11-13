import { LocalizedText as Text, LocalizedTextInput as TextInput } from '@/components/LocalizedText';
import { APP_TARGETS, findAppTarget } from '@/lib/appReleases';
import { POPUP_PAGES, popupPageTitle } from '@/lib/popupPages';
import { Megaphone, Pencil, Plus, Trash2, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, Switch, View } from 'react-native';
import { deletePopup, fetchPopups, popupPagesMigrated, savePopup, type AdminPopup, type PopupInput, type PopupKind } from '../api';
import { confirmAction, useAdmin, useAdminQuery } from '../store';
import { AdminTheme as T } from '../theme';
import { Avatar, Banner, Button, Card, Chip, EmptyState, ListRow, Loading, Page, Segmented, adminStyles as a, faDateTime, n } from '../ui';

const KINDS: { id: PopupKind; label: string }[] = [{ id: 'info', label: 'اطلاع‌رسانی' }, { id: 'success', label: 'خبر خوب' }, { id: 'warning', label: 'هشدار' }, { id: 'promo', label: 'تبلیغ / پیشنهاد' }];
const kindTone = (k: PopupKind) => k === 'success' ? 'success' : k === 'warning' ? 'warning' : k === 'promo' ? 'accent' : 'info';
const empty = (): PopupInput => ({ id: null, title: '', body: '', button_label: '', button_url: '', package_name: null, kind: 'info', show_once: true, active: true, starts_at: new Date().toISOString(), ends_at: null, priority: 0, target_routes: null });

function toDateInput(iso: string | null): string { return iso ? iso.slice(0, 10) : ''; }
function fromDateInput(value: string, endOfDay: boolean): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) return null;
  return `${value.trim()}T${endOfDay ? '23:59:59' : '00:00:00'}.000Z`;
}

export function PopupsScreen() {
  const { run, busy, invalidate } = useAdmin();
  const popups = useAdminQuery('popups', fetchPopups);
  const [draft, setDraft] = useState<PopupInput | null>(null);
  const [startsText, setStartsText] = useState('');
  const [endsText, setEndsText] = useState('');
  const rows = popups.data || [];
  const now = Date.now();
  const isLive = (p: AdminPopup) => p.active && Date.parse(p.starts_at) <= now && (!p.ends_at || Date.parse(p.ends_at) > now);

  const edit = (p?: AdminPopup) => {
    const next: PopupInput = p ? { ...p } : empty();
    setDraft(next); setStartsText(toDateInput(next.starts_at)); setEndsText(toDateInput(next.ends_at));
  };
  // The setup reminder is shown only while the database still lacks the page column.
  const [migrated, setMigrated] = useState<boolean | null>(null);
  useEffect(() => { let active = true; void popupPagesMigrated().then(ok => { if (active) setMigrated(ok); }); return () => { active = false; }; }, [popups.data]);
  const canSave = Boolean(draft && draft.title.trim() && draft.body.trim() && (!draft.button_url || /^https?:\/\//.test(draft.button_url)));

  async function save() {
    if (!draft || !canSave) return;
    const payload: PopupInput = { ...draft, starts_at: fromDateInput(startsText, false) || draft.starts_at, ends_at: fromDateInput(endsText, true), button_label: draft.button_label?.trim() || null, button_url: draft.button_url?.trim() || null };
    const ok = await run(async () => { await savePopup(payload); invalidate(['popups', 'audit']); }, 'پاپ‌آپ ذخیره شد.');
    if (ok) setDraft(null);
  }
  async function toggleActive(p: AdminPopup) {
    const ok = await run(() => savePopup({ ...p, active: !p.active }).then(() => undefined), p.active ? 'پاپ‌آپ خاموش شد.' : 'پاپ‌آپ روشن شد.');
    if (ok) popups.setData(current => (current || []).map(x => x.id === p.id ? { ...x, active: !p.active } : x));
  }
  async function remove(p: AdminPopup) {
    if (!(await confirmAction('حذف پاپ‌آپ', `پاپ‌آپ «${p.title}» حذف شود؟`, 'حذف'))) return;
    const ok = await run(() => deletePopup(p.id), 'پاپ‌آپ حذف شد.');
    if (ok) popups.setData(current => (current || []).filter(x => x.id !== p.id));
  }

  return (
    <Page title="پاپ‌آپ‌ها" subtitle="پیام‌هایی که هنگام باز شدن اپ یا ورود به صفحه‌های انتخابی به زبان‌آموز نشان داده می‌شود (اطلاع‌رسانی، خبر، هشدار یا پیشنهاد)"
      actions={<Button icon={Plus} label="پاپ‌آپ جدید" onPress={() => edit()} disabled={busy} />}>
      {popups.error && <Banner kind="error" text={popups.error} />}
      {migrated === false && <Banner kind="warning" text="انتخاب صفحه برای پاپ‌آپ به فایل supabase/SETUP-POPUP-PAGES-ONCE.sql نیاز دارد (یک بار در Supabase اجرا شود). تا پیش از آن، ذخیرهٔ پاپ‌آپ با خطا روبه‌رو می‌شود." />}

      {draft && (
        <Card title={draft.id ? 'ویرایش پاپ‌آپ' : 'پاپ‌آپ جدید'} aside={<Button small variant="ghost" tone="neutral" icon={X} label="بستن" onPress={() => setDraft(null)} />}>
          <View style={{ gap: 4 }}><Text style={a.name}>عنوان</Text><TextInput value={draft.title} onChangeText={v => setDraft({ ...draft, title: v })} placeholder="مثلاً: درس‌های جدید آلمانی اضافه شد" placeholderTextColor={T.color.textFaint} style={a.input} /></View>
          <View style={{ gap: 4 }}><Text style={a.name}>متن</Text><TextInput value={draft.body} onChangeText={v => setDraft({ ...draft, body: v })} multiline numberOfLines={4} placeholder="متن کامل پیام…" placeholderTextColor={T.color.textFaint} style={[a.input, { minHeight: 90, textAlignVertical: 'top' }]} /></View>
          <View style={{ gap: 6 }}><Text style={a.name}>نوع</Text><Segmented value={draft.kind} onChange={k => setDraft({ ...draft, kind: k })} options={KINDS} /></View>
          <View style={{ gap: 6 }}>
            <Text style={a.name}>کدام اپ؟</Text>
            <View style={a.actions}>
              {[{ package: null as string | null, title: 'همهٔ اپ‌ها' }, ...APP_TARGETS.filter(t => t.package !== 'com.devicecontrol.miloadmin').map(t => ({ package: t.package as string | null, title: t.title }))].map(t => {
                const active = draft.package_name === t.package;
                return <Pressable key={t.package || 'all'} accessibilityRole="button" onPress={() => setDraft({ ...draft, package_name: t.package })} style={{ borderWidth: 1, borderColor: active ? T.color.accent : T.color.border, backgroundColor: active ? T.color.accentSoft : T.color.surface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}><Text style={a.name}>{t.title}</Text></Pressable>;
              })}
            </View>
          </View>
          <View style={{ gap: 6 }}>
            <Text style={a.name}>کدام صفحه‌ها؟</Text>
            <Text style={a.muted}>{draft.target_routes?.length ? `${n(draft.target_routes.length)} صفحه انتخاب شده — پاپ‌آپ هنگام ورود به همین صفحه‌ها نشان داده می‌شود` : 'همهٔ صفحه‌ها — هنگام باز شدن اپ نشان داده می‌شود'}</Text>
            <View style={a.actions}>
              <PageChip label="همهٔ صفحه‌ها" active={!draft.target_routes?.length} onPress={() => setDraft({ ...draft, target_routes: null })} />
            </View>
            {Array.from(new Set(POPUP_PAGES.map(p => p.group))).map(group => (
              <View key={group} style={{ gap: 4 }}>
                <Text style={a.muted}>{group}</Text>
                <View style={a.actions}>
                  {POPUP_PAGES.filter(p => p.group === group).map(page => {
                    const selected = Boolean(draft.target_routes?.includes(page.route));
                    return <PageChip key={page.route} label={page.title} active={selected} onPress={() => {
                      const current = draft.target_routes || [];
                      setDraft({ ...draft, target_routes: selected ? current.filter(r => r !== page.route) : [...current, page.route] });
                    }} />;
                  })}
                </View>
              </View>
            ))}
          </View>
          <View style={a.grid}>
            <View style={{ flex: 1, minWidth: 160, gap: 4 }}><Text style={a.name}>متن دکمه (اختیاری)</Text><TextInput value={draft.button_label || ''} onChangeText={v => setDraft({ ...draft, button_label: v })} placeholder="مثلاً: بیشتر بدانید" placeholderTextColor={T.color.textFaint} style={a.input} /></View>
            <View style={{ flex: 1, minWidth: 160, gap: 4 }}><Text style={a.name}>لینک دکمه (اختیاری)</Text><TextInput value={draft.button_url || ''} onChangeText={v => setDraft({ ...draft, button_url: v })} autoCapitalize="none" keyboardType="url" placeholder="https://…" placeholderTextColor={T.color.textFaint} style={[a.input, { textAlign: 'left' }]} /></View>
          </View>
          <View style={a.grid}>
            <View style={{ flex: 1, minWidth: 140, gap: 4 }}><Text style={a.name}>شروع نمایش (YYYY-MM-DD)</Text><TextInput value={startsText} onChangeText={setStartsText} placeholder="2026-11-15" placeholderTextColor={T.color.textFaint} style={[a.input, { textAlign: 'left' }]} /></View>
            <View style={{ flex: 1, minWidth: 140, gap: 4 }}><Text style={a.name}>پایان نمایش (خالی = بدون پایان)</Text><TextInput value={endsText} onChangeText={setEndsText} placeholder="2026-12-01" placeholderTextColor={T.color.textFaint} style={[a.input, { textAlign: 'left' }]} /></View>
            <View style={{ flex: 1, minWidth: 120, gap: 4 }}><Text style={a.name}>اولویت</Text><TextInput value={String(draft.priority)} onChangeText={v => setDraft({ ...draft, priority: Number.parseInt(v, 10) || 0 })} keyboardType="number-pad" style={[a.input, { textAlign: 'left' }]} /></View>
          </View>
          <View style={a.actions}>
            <Switch value={draft.show_once} onValueChange={v => setDraft({ ...draft, show_once: v })} trackColor={{ true: T.color.accent, false: T.color.border }} /><Text style={a.name}>فقط یک‌بار به هر نفر نشان داده شود</Text>
          </View>
          <View style={a.actions}>
            <Switch value={draft.active} onValueChange={v => setDraft({ ...draft, active: v })} trackColor={{ true: T.color.accent, false: T.color.border }} /><Text style={a.name}>روشن (قابل نمایش)</Text>
          </View>
          <Button label="ذخیره" onPress={() => void save()} disabled={!canSave || busy} />
        </Card>
      )}

      <Card title="فهرست پاپ‌آپ‌ها" padded={false} aside={<Text style={a.muted}>{n(rows.length)} مورد</Text>}>
        {popups.loading && !popups.data && <Loading />}
        {popups.data && !rows.length && <EmptyState icon={Megaphone} title="هنوز پاپ‌آپی ساخته نشده است" hint="با دکمهٔ «پاپ‌آپ جدید» شروع کنید." />}
        {rows.map(p => (
          <ListRow key={p.id} dimmed={!isLive(p)} onPress={() => edit(p)}>
            <Avatar name={p.title} tone={kindTone(p.kind)} />
            <View style={{ flex: 1, minWidth: 170 }}>
              <Text style={a.name}>{p.title}</Text>
              <Text numberOfLines={2} style={a.muted}>{p.body}</Text>
              <Text style={a.muted}>{p.package_name ? findAppTarget(p.package_name)?.title || p.package_name : 'همهٔ اپ‌ها'} · {p.target_routes?.length ? p.target_routes.map(popupPageTitle).join('، ') : 'همهٔ صفحه‌ها'} · از {faDateTime(p.starts_at)}{p.ends_at ? ` تا ${faDateTime(p.ends_at)}` : ''}</Text>
            </View>
            <View style={{ flexDirection: 'row-reverse', gap: 4, flexWrap: 'wrap' }}>
              <Chip label={KINDS.find(k => k.id === p.kind)?.label || p.kind} tone={kindTone(p.kind)} />
              <Chip label={isLive(p) ? 'در حال نمایش' : p.active ? 'خارج از بازه' : 'خاموش'} tone={isLive(p) ? 'success' : 'neutral'} />
              {p.show_once && <Chip label="یک‌بار" />}
            </View>
            <View style={a.actions}>
              <Button small variant="soft" tone={p.active ? 'warning' : 'success'} label={p.active ? 'خاموش' : 'روشن'} disabled={busy} onPress={() => void toggleActive(p)} />
              <Button small variant="soft" tone="accent" icon={Pencil} label="ویرایش" onPress={() => edit(p)} />
              <Button small variant="soft" tone="danger" icon={Trash2} label="حذف" disabled={busy} onPress={() => void remove(p)} />
            </View>
          </ListRow>
        ))}
      </Card>
    </Page>
  );
}

function PageChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} style={{ borderWidth: 1, borderColor: active ? T.color.accent : T.color.border, backgroundColor: active ? T.color.accentSoft : T.color.surface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}>
      <Text style={a.name}>{label}</Text>
    </Pressable>
  );
}
