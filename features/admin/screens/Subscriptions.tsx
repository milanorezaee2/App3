import { LocalizedText as Text, LocalizedTextInput as TextInput } from '@/components/LocalizedText';
import { toPersianDigits as fa } from '@/lib/format';
import { CreditCard, Gift, Plus, Power, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, Switch, View } from 'react-native';
import { cancelSubscription, fetchPlans, fetchSettings, fetchSubscriptions, fetchUsers, grantSubscription, savePlan, saveSetting, type SubscriptionPlan } from '../api';
import { confirmAction, useAdmin, useAdminQuery } from '../store';
import { AdminTheme as T } from '../theme';
import { Avatar, Banner, Button, Card, Chip, EmptyState, ListRow, Loading, Page, SearchBox, StatTile, adminStyles as a, faDate, n } from '../ui';

type PlanDraft = Omit<SubscriptionPlan, 'id' | 'created_at'> & { id?: string | null };
const emptyPlan = (): PlanDraft => ({ id: null, code: '', title: '', description: '', price_amount: 0, currency: 'IRR', duration_days: 30, features: [], active: true, sort_order: 0 });
const money = (amount: number, currency: string) => amount ? `${fa(amount.toLocaleString('en-US'))} ${currency === 'IRR' ? 'ریال' : currency === 'IRT' ? 'تومان' : currency}` : 'رایگان';

export function SubscriptionsScreen() {
  const { run, busy, invalidate } = useAdmin();
  const settings = useAdminQuery('settings', fetchSettings);
  const plans = useAdminQuery('plans', fetchPlans);
  const subs = useAdminQuery('subs', fetchSubscriptions);
  const users = useAdminQuery('users', fetchUsers);
  const [planDraft, setPlanDraft] = useState<PlanDraft | null>(null);
  const [featuresText, setFeaturesText] = useState('');
  const [grantOpen, setGrantOpen] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [grantUser, setGrantUser] = useState<string | null>(null);
  const [grantPlan, setGrantPlan] = useState<string | null>(null);
  const [grantDays, setGrantDays] = useState('');
  const [grantNote, setGrantNote] = useState('');

  const enabled = settings.data?.subscriptions.enabled ?? false;
  const planRows = plans.data || [];
  const subRows = subs.data || [];
  const activeSubs = subRows.filter(s => s.status === 'active');
  const userMatches = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return [];
    return (users.data || []).filter(u => `${u.full_name} ${u.email}`.toLowerCase().includes(q)).slice(0, 6);
  }, [users.data, userSearch]);

  async function toggleEnabled() {
    const next = !enabled;
    if (next && !(await confirmAction('فعال‌سازی اشتراک', 'با فعال‌شدن، اپ‌های زبان‌آموز محدودیت نسخهٔ رایگان را اعمال می‌کنند و بخش اشتراک را نشان می‌دهند. مطمئن هستید؟', 'فعال کن'))) return;
    const ok = await run(() => saveSetting('subscriptions', { ...(settings.data?.subscriptions || { free_lessons: 10 }), enabled: next }), next ? 'سیستم اشتراک فعال شد.' : 'سیستم اشتراک غیرفعال شد.');
    if (ok) invalidate(['settings', 'audit']);
  }
  async function saveFreeLessons(value: string) {
    const count = Number.parseInt(value, 10);
    if (!Number.isFinite(count) || count < 0) return;
    const ok = await run(() => saveSetting('subscriptions', { enabled, free_lessons: count }), 'تعداد درس‌های رایگان ذخیره شد.');
    if (ok) invalidate(['settings']);
  }
  const editPlan = (p?: SubscriptionPlan) => { const d = p ? { ...p } : emptyPlan(); setPlanDraft(d); setFeaturesText(d.features.join('\n')); };
  async function savePlanDraft() {
    if (!planDraft) return;
    const payload = { ...planDraft, features: featuresText.split('\n').map(x => x.trim()).filter(Boolean) };
    const ok = await run(async () => { await savePlan(payload); invalidate(['plans', 'audit']); }, 'پلن ذخیره شد.');
    if (ok) setPlanDraft(null);
  }
  async function grant() {
    if (!grantUser || !grantPlan) return;
    const days = Number.parseInt(grantDays, 10);
    const ok = await run(async () => { await grantSubscription(grantUser, grantPlan, Number.isFinite(days) && days > 0 ? days : null, grantNote.trim()); invalidate(['subs', 'audit']); }, 'اشتراک به کاربر داده شد.');
    if (ok) { setGrantOpen(false); setGrantUser(null); setGrantPlan(null); setGrantDays(''); setGrantNote(''); setUserSearch(''); }
  }
  async function cancel(id: string, name: string) {
    if (!(await confirmAction('لغو اشتراک', `اشتراک «${name}» لغو شود؟`, 'لغو اشتراک'))) return;
    const ok = await run(() => cancelSubscription(id), 'اشتراک لغو شد.');
    if (ok) subs.setData(current => (current || []).map(s => s.id === id ? { ...s, status: 'cancelled' } : s));
  }

  return (
    <Page title="اشتراک" subtitle="زیرساخت اشتراک و پلن‌ها آماده است؛ تا وقتی کلید اصلی خاموش باشد، اپ‌های زبان‌آموز هیچ محدودیتی اعمال نمی‌کنند"
      actions={<Button variant={enabled ? 'solid' : 'ghost'} tone={enabled ? 'success' : 'neutral'} icon={Power} label={enabled ? 'سیستم اشتراک: فعال' : 'سیستم اشتراک: غیرفعال'} onPress={() => void toggleEnabled()} disabled={busy || settings.loading} />}>
      {(settings.error || plans.error) && <Banner kind="error" text={settings.error || plans.error || ''} />}
      {!enabled && <Banner kind="warning" text="حالت آماده‌باش: همهٔ تنظیمات اینجا واقعی ذخیره می‌شوند، ولی زبان‌آموزان چیزی نمی‌بینند و همه‌چیز برایشان رایگان است. هر وقت خواستید، کلید بالا را روشن کنید." />}

      <View style={a.grid}>
        <StatTile label="وضعیت" value={enabled ? 'فعال' : 'غیرفعال'} tone={enabled ? 'success' : 'neutral'} icon={Power} />
        <StatTile label="پلن‌ها" value={planRows.length} hint={`${n(planRows.filter(p => p.active).length)} پلن فعال`} icon={CreditCard} tone="accent" />
        <StatTile label="اشتراک‌های فعال" value={activeSubs.length} hint={`${n(subRows.length)} اشتراک در کل`} icon={Gift} tone="info" />
      </View>

      <Card title="تنظیمات نسخهٔ رایگان">
        <Text style={a.muted}>وقتی اشتراک فعال شود، زبان‌آموزِ بدون اشتراک فقط این تعداد درس اول هر زبان را می‌بیند.</Text>
        <View style={a.actions}>
          <Text style={a.name}>تعداد درس‌های رایگان:</Text>
          <TextInput defaultValue={String(settings.data?.subscriptions.free_lessons ?? 10)} keyboardType="number-pad" onEndEditing={e => void saveFreeLessons(e.nativeEvent.text)} onBlur={undefined} style={[a.input, { width: 90, textAlign: 'center' }]} />
        </View>
      </Card>

      <Card title="پلن‌ها" padded={false} aside={<Button small icon={Plus} label="پلن جدید" onPress={() => editPlan()} disabled={busy} />}>
        {planDraft && (
          <View style={{ padding: 16, gap: 10, borderBottomWidth: 1, borderColor: T.color.border, backgroundColor: T.color.surfaceMuted }}>
            <View style={a.actions}><Text style={a.name}>{planDraft.id ? 'ویرایش پلن' : 'پلن جدید'}</Text><Button small variant="ghost" tone="neutral" icon={X} label="بستن" onPress={() => setPlanDraft(null)} /></View>
            <View style={a.grid}>
              <View style={{ flex: 1, minWidth: 140, gap: 4 }}><Text style={a.muted}>کد (انگلیسی)</Text><TextInput value={planDraft.code} onChangeText={v => setPlanDraft({ ...planDraft, code: v })} autoCapitalize="none" placeholder="monthly" placeholderTextColor={T.color.textFaint} style={[a.input, { textAlign: 'left' }]} /></View>
              <View style={{ flex: 1, minWidth: 160, gap: 4 }}><Text style={a.muted}>عنوان</Text><TextInput value={planDraft.title} onChangeText={v => setPlanDraft({ ...planDraft, title: v })} placeholder="اشتراک یک‌ماهه" placeholderTextColor={T.color.textFaint} style={a.input} /></View>
              <View style={{ flex: 1, minWidth: 120, gap: 4 }}><Text style={a.muted}>مدت (روز)</Text><TextInput value={String(planDraft.duration_days)} onChangeText={v => setPlanDraft({ ...planDraft, duration_days: Number.parseInt(v, 10) || 0 })} keyboardType="number-pad" style={[a.input, { textAlign: 'left' }]} /></View>
              <View style={{ flex: 1, minWidth: 140, gap: 4 }}><Text style={a.muted}>قیمت</Text><TextInput value={String(planDraft.price_amount)} onChangeText={v => setPlanDraft({ ...planDraft, price_amount: Number.parseInt(v.replace(/\D/g, ''), 10) || 0 })} keyboardType="number-pad" style={[a.input, { textAlign: 'left' }]} /></View>
              <View style={{ flex: 1, minWidth: 100, gap: 4 }}><Text style={a.muted}>واحد</Text><TextInput value={planDraft.currency} onChangeText={v => setPlanDraft({ ...planDraft, currency: v.toUpperCase() })} autoCapitalize="characters" placeholder="IRT" placeholderTextColor={T.color.textFaint} style={[a.input, { textAlign: 'left' }]} /></View>
            </View>
            <View style={{ gap: 4 }}><Text style={a.muted}>توضیح</Text><TextInput value={planDraft.description} onChangeText={v => setPlanDraft({ ...planDraft, description: v })} style={a.input} /></View>
            <View style={{ gap: 4 }}><Text style={a.muted}>امکانات (هر خط یک مورد)</Text><TextInput value={featuresText} onChangeText={setFeaturesText} multiline numberOfLines={3} style={[a.input, { minHeight: 70, textAlignVertical: 'top' }]} /></View>
            <View style={a.actions}><Switch value={planDraft.active} onValueChange={v => setPlanDraft({ ...planDraft, active: v })} trackColor={{ true: T.color.accent, false: T.color.border }} /><Text style={a.name}>فعال</Text></View>
            <Button label="ذخیرهٔ پلن" onPress={() => void savePlanDraft()} disabled={busy || !planDraft.code.trim() || !planDraft.title.trim() || planDraft.duration_days <= 0} />
          </View>
        )}
        {plans.loading && !plans.data && <Loading />}
        {plans.data && !planRows.length && <EmptyState icon={CreditCard} title="هنوز پلنی تعریف نشده است" hint="مثلاً: یک‌ماهه، سه‌ماهه، سالانه." />}
        {planRows.map(p => (
          <ListRow key={p.id} onPress={() => editPlan(p)} dimmed={!p.active}>
            <Avatar name={p.title} tone="accent" />
            <View style={{ flex: 1, minWidth: 160 }}>
              <Text style={a.name}>{p.title} <Text style={a.mono}>({p.code})</Text></Text>
              <Text style={a.muted}>{money(p.price_amount, p.currency)} · {fa(p.duration_days)} روز{p.description ? ` · ${p.description}` : ''}</Text>
              {!!p.features.length && <Text numberOfLines={2} style={a.muted}>{p.features.join(' · ')}</Text>}
            </View>
            <Chip label={p.active ? 'فعال' : 'غیرفعال'} tone={p.active ? 'success' : 'neutral'} />
          </ListRow>
        ))}
      </Card>

      <Card title="اشتراک کاربران" padded={false} aside={<Button small icon={Gift} label="اعطای اشتراک" onPress={() => setGrantOpen(v => !v)} disabled={busy || !planRows.length} />}>
        {grantOpen && (
          <View style={{ padding: 16, gap: 10, borderBottomWidth: 1, borderColor: T.color.border, backgroundColor: T.color.surfaceMuted }}>
            <Text style={a.name}>۱) کاربر را پیدا کنید</Text>
            <SearchBox value={userSearch} onChange={v => { setUserSearch(v); setGrantUser(null); }} placeholder="نام یا ایمیل کاربر…" />
            {userMatches.map(u => <Pressable key={u.user_id} accessibilityRole="button" onPress={() => { setGrantUser(u.user_id); setUserSearch(`${u.full_name} — ${u.email}`); }} style={{ paddingVertical: 6 }}><Text style={a.muted}>{u.full_name} — {u.email}</Text></Pressable>)}
            {grantUser && <Chip label="کاربر انتخاب شد" tone="success" />}
            <Text style={a.name}>۲) پلن</Text>
            <View style={a.actions}>{planRows.filter(p => p.active).map(p => <Pressable key={p.id} accessibilityRole="button" onPress={() => setGrantPlan(p.id)} style={{ borderWidth: 1, borderColor: grantPlan === p.id ? T.color.accent : T.color.border, backgroundColor: grantPlan === p.id ? T.color.accentSoft : T.color.surface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}><Text style={a.name}>{p.title} · {fa(p.duration_days)} روز</Text></Pressable>)}</View>
            <View style={a.grid}>
              <View style={{ flex: 1, minWidth: 140, gap: 4 }}><Text style={a.muted}>مدت دلخواه (روز، اختیاری)</Text><TextInput value={grantDays} onChangeText={setGrantDays} keyboardType="number-pad" placeholder="خالی = مدت پلن" placeholderTextColor={T.color.textFaint} style={[a.input, { textAlign: 'left' }]} /></View>
              <View style={{ flex: 2, minWidth: 180, gap: 4 }}><Text style={a.muted}>یادداشت (اختیاری)</Text><TextInput value={grantNote} onChangeText={setGrantNote} placeholder="مثلاً: هدیهٔ شرکت در مسابقه" placeholderTextColor={T.color.textFaint} style={a.input} /></View>
            </View>
            <Button label="اعطای اشتراک" onPress={() => void grant()} disabled={busy || !grantUser || !grantPlan} />
          </View>
        )}
        {subs.loading && !subs.data && <Loading />}
        {subs.data && !subRows.length && <EmptyState icon={Gift} title="هنوز اشتراکی ثبت نشده است" />}
        {subRows.map(s => (
          <ListRow key={s.id} dimmed={s.status !== 'active'}>
            <Avatar name={s.full_name} tone={s.status === 'active' ? 'success' : 'neutral'} />
            <View style={{ flex: 1, minWidth: 160 }}>
              <Text style={a.name}>{s.full_name}</Text>
              <Text style={a.mono}>{s.email || s.user_id}</Text>
              <Text style={a.muted}>{s.plan_title} · {faDate(s.starts_at)} تا {faDate(s.ends_at)}{s.note ? ` · ${s.note}` : ''}</Text>
            </View>
            <Chip label={s.status === 'active' ? 'فعال' : s.status === 'expired' ? 'منقضی' : 'لغوشده'} tone={s.status === 'active' ? 'success' : s.status === 'expired' ? 'warning' : 'neutral'} />
            <Chip label={s.source === 'manual' ? 'دستی' : s.source === 'promo' ? 'هدیه' : 'درگاه'} />
            {s.status === 'active' && <Button small variant="soft" tone="danger" label="لغو" disabled={busy} onPress={() => void cancel(s.id, s.full_name)} />}
          </ListRow>
        ))}
      </Card>
    </Page>
  );
}
