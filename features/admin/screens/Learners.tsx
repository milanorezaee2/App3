import { LocalizedText as Text, LocalizedTextInput as TextInput } from '@/components/LocalizedText';
import { progressMetrics } from '@/lib/educationAdmin';
import { SENTENCE_LESSONS } from '@/lib/courseContent';
import { GraduationCap, Ticket, X } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { createInvite, fetchLearners, revokeInvite, setEnrollmentStatus } from '../api';
import { useAdmin, useAdminQuery } from '../store';
import { AdminTheme as T } from '../theme';
import { Avatar, Banner, Button, Card, Chip, EmptyState, Field, ListRow, Loading, Page, SearchBox, Segmented, StatTile, adminStyles as a, faDate, n } from '../ui';

export function LearnersScreen() {
  const { run, busy, invalidate } = useAdmin();
  const data = useAdminQuery('learners', fetchLearners);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [label, setLabel] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const students = data.data?.students || [];
  const invites = data.data?.invites || [];
  const visible = students.filter(r => r.display_name.includes(search.trim()) && (filter === 'all' || r.status === filter));
  const selected = students.find(r => r.student_id === selectedId) || null;
  const synced = students.filter(r => r.status === 'active' && r.summary);
  const avg = synced.length ? Math.round(synced.reduce((sum, r) => sum + progressMetrics(r.summary).percent, 0) / synced.length) : 0;

  return (
    <Page title="زبان‌آموزان و دعوت‌ها" subtitle="اشتراک پیشرفت با رضایت زبان‌آموز؛ گزارش‌ها از دستگاه او همگام می‌شوند">
      {data.error && <Banner kind="error" text={data.error} />}
      <View style={a.grid}>
        <StatTile label="زبان‌آموزان عضو" value={students.length} icon={GraduationCap} tone="accent" />
        <StatTile label="اشتراک فعال" value={students.filter(r => r.status === 'active').length} tone="success" />
        <StatTile label="میانگین پیشرفت" value={`${n(avg)}٪`} hint={`${n(synced.length)} نفر با گزارش همگام‌شده`} />
        <StatTile label="دعوت‌های آمادهٔ استفاده" value={invites.filter(i => !i.claimed_at && Date.parse(i.expires_at) > Date.now()).length} icon={Ticket} tone="info" />
      </View>

      <Card title="دعوت جدید">
        <Text style={a.muted}>زبان‌آموز کد را در صفحهٔ «مدیریت اشتراک آموزشی» وارد می‌کند و پیش از عضویت، نام مدیر و نوع اطلاعات قابل اشتراک را می‌بیند.</Text>
        <View style={a.actions}>
          <TextInput value={label} onChangeText={setLabel} placeholder="برچسب دعوت (مثلاً: کلاس سه‌شنبه)" placeholderTextColor={T.color.textFaint} style={[a.input, { flex: 1, minWidth: 200 }]} />
          <Button label="ساخت دعوت" disabled={busy || !label.trim()} onPress={() => void run(async () => { await createInvite(label); setLabel(''); invalidate(['learners']); }, 'دعوت ساخته شد؛ کد را فقط به فرد موردنظر بدهید.')} />
        </View>
      </Card>

      <View style={[a.grid, { alignItems: 'flex-start' }]}>
        <Card title="زبان‌آموزان" padded={false} style={{ flex: 2, minWidth: 320 }} aside={<Text style={a.muted}>{n(visible.length)} نفر</Text>}>
          <View style={[a.actions, { padding: 12 }]}>
            <SearchBox value={search} onChange={setSearch} placeholder="جست‌وجوی نام زبان‌آموز…" />
            <Segmented value={filter} onChange={setFilter} options={[{ id: 'all', label: 'همه' }, { id: 'active', label: 'فعال' }, { id: 'paused', label: 'متوقف' }]} />
          </View>
          {data.loading && !data.data && <Loading />}
          {data.data && !visible.length && <EmptyState icon={GraduationCap} title={students.length ? 'نتیجه‌ای پیدا نشد' : 'هنوز زبان‌آموزی دعوت شما را نپذیرفته است'} />}
          {visible.map(r => {
            const m = progressMetrics(r.summary);
            return (
              <ListRow key={r.student_id} onPress={() => setSelectedId(r.student_id === selectedId ? null : r.student_id)}>
                <Avatar name={r.display_name} tone={r.status === 'active' ? 'accent' : 'warning'} />
                <View style={{ flex: 1, minWidth: 130 }}>
                  <Text style={a.name}>{r.display_name}</Text>
                  <Text style={a.muted}>{r.status === 'paused' ? 'گزارش متوقف است' : r.synced_at ? `همگام‌سازی: ${faDate(r.synced_at)}` : 'هنوز همگام نشده'}</Text>
                </View>
                <View style={{ width: 140 }}>
                  <Text style={a.muted}>{r.summary ? `${n(m.lessons)} از ${n(SENTENCE_LESSONS.length)} درس · ${n(m.percent)}٪` : 'بدون گزارش'}</Text>
                  <View style={{ height: 5, backgroundColor: T.color.surfaceMuted, borderRadius: 4, overflow: 'hidden', alignItems: 'flex-end', marginTop: 4 }}><View style={{ height: 5, width: `${m.percent}%`, backgroundColor: T.color.accent }} /></View>
                </View>
                <Chip label={r.status === 'active' ? 'فعال' : 'متوقف'} tone={r.status === 'active' ? 'success' : 'warning'} />
              </ListRow>
            );
          })}
          {selected && (
            <View style={{ padding: 16, gap: 10, borderTopWidth: 1, borderColor: T.color.border, backgroundColor: T.color.surfaceMuted }}>
              <View style={a.actions}><Text style={a.name}>گزارش {selected.display_name}</Text><Button small variant="ghost" tone="neutral" icon={X} label="بستن" onPress={() => setSelectedId(null)} /></View>
              <View style={a.grid}>
                <Field label="عضویت" value={faDate(selected.consent_at)} />
                <Field label="آخرین همگام‌سازی" value={faDate(selected.synced_at)} />
                <Field label="درس‌های تکمیل‌شده" value={progressMetrics(selected.summary).lessons} />
                <Field label="واژه‌های معرفی‌شده" value={progressMetrics(selected.summary).words} />
                <Field label="دقیقه‌های ثبت‌شده" value={progressMetrics(selected.summary).minutes} />
                <Field label="زنجیرهٔ روزانه" value={progressMetrics(selected.summary).streak} />
              </View>
              <Button variant="soft" tone={selected.status === 'active' ? 'warning' : 'success'} label={selected.status === 'active' ? 'توقف دریافت گزارش' : 'فعال‌کردن دوبارهٔ گزارش'} disabled={busy}
                onPress={() => void run(async () => { await setEnrollmentStatus(selected.student_id, selected.status === 'active' ? 'paused' : 'active'); invalidate(['learners']); }, 'وضعیت گزارش به‌روزرسانی شد.')} />
            </View>
          )}
        </Card>

        <Card title="دعوت‌نامه‌ها" padded={false} style={{ flex: 1, minWidth: 280 }} aside={<Text style={a.muted}>{n(invites.length)} دعوت</Text>}>
          {data.data && !invites.length && <EmptyState icon={Ticket} title="هنوز دعوتی ساخته نشده است" />}
          {invites.map(inv => {
            const state = inv.claimed_at ? 'مصرف‌شده' : Date.parse(inv.expires_at) < Date.now() ? 'منقضی‌شده' : 'آماده';
            return (
              <ListRow key={inv.id}>
                <View style={{ flex: 1, minWidth: 140, gap: 2 }}>
                  <Text style={a.name}>{inv.label}</Text>
                  <Text selectable style={a.mono}>{inv.code}</Text>
                  <Text style={a.muted}>پایان اعتبار: {faDate(inv.expires_at)}</Text>
                </View>
                <Chip label={state} tone={state === 'آماده' ? 'success' : state === 'مصرف‌شده' ? 'neutral' : 'warning'} />
                {!inv.claimed_at && <Button small variant="soft" tone="danger" label="لغو" disabled={busy} onPress={() => void run(async () => { await revokeInvite(inv.id); invalidate(['learners']); }, 'دعوت لغو شد.')} />}
              </ListRow>
            );
          })}
        </Card>
      </View>
    </Page>
  );
}
