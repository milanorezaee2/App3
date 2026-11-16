import { LocalizedText as Text, LocalizedTextInput as TextInput } from '@/components/LocalizedText';
import { APP_TARGETS, findAppTarget } from '@/lib/appReleases';
import { formatSize, installedVersion } from '@/lib/appUpdates';
import { toPersianDigits as fa } from '@/lib/format';
import * as DocumentPicker from 'expo-document-picker';
import { withAppLockSuspended } from '@/lib/appLock';
import { Eye, EyeOff, FileUp, Layers, PackageOpen, Trash2, UploadCloud } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Platform, Pressable, Switch, View } from 'react-native';
import { deleteRelease, fetchReleases, publishRelease, setReleasePublished, uploadApk, type AdminRelease, type PickedApk } from '../api';
import { confirmAction, useAdmin, useAdminQuery } from '../store';
import { AdminTheme as T } from '../theme';
import { Avatar, Banner, Button, Card, Chip, EmptyState, Field, ListRow, Loading, Page, Segmented, adminStyles as a, faDateTime, n } from '../ui';

type Source = 'upload' | 'link';

/** GitHub repository that CI publishes every `milo-requested-N` release to. */
const RELEASE_REPO = 'https://github.com/milanorezaee2/App3';
/** CI versionCode = 100 + run number, and the tag is `milo-requested-<run number>`. */
const codeFromTag = (tag: string): number | null => { const m = /^milo-requested-(\d+)$/.exec(tag.trim()); return m ? 100 + Number(m[1]) : null; };
const LEARNER_PACKAGES = APP_TARGETS.filter(t => t.package !== 'com.devicecontrol.miloadmin').map(t => t.package);

export function UpdatesScreen() {
  const { run, busy, invalidate, fail } = useAdmin();
  const releases = useAdminQuery('releases', fetchReleases);
  const [packageName, setPackageName] = useState(APP_TARGETS[0].package);
  const [source, setSource] = useState<Source>('upload');
  const [picked, setPicked] = useState<PickedApk | null>(null);
  const [link, setLink] = useState('');
  const [versionName, setVersionName] = useState('');
  const [versionCode, setVersionCode] = useState('');
  const [notes, setNotes] = useState('');
  const [mandatory, setMandatory] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  // Bulk publish from one GitHub release tag.
  const [bulkTag, setBulkTag] = useState('');
  const [bulkNotes, setBulkNotes] = useState('');
  const [bulkMandatory, setBulkMandatory] = useState(false);
  const [bulkPackages, setBulkPackages] = useState<string[]>(LEARNER_PACKAGES);
  const [bulkDone, setBulkDone] = useState<{ ok: string[]; failed: { pkg: string; error: string }[] } | null>(null);

  const rows = releases.data || [];
  const latestByPackage = useMemo(() => {
    const map = new Map<string, AdminRelease>();
    for (const r of rows) if (r.published && (!map.has(r.package_name) || map.get(r.package_name)!.version_code < r.version_code)) map.set(r.package_name, r);
    return map;
  }, [rows]);
  const currentLatest = latestByPackage.get(packageName);
  const suggestedCode = (currentLatest?.version_code || 0) + 1;
  const code = Number.parseInt(versionCode, 10);
  const codeValid = Number.isFinite(code) && code > 0;
  const canPublish = !busy && progress === null && versionName.trim().length > 0 && codeValid && (source === 'link' ? /^https:\/\//.test(link.trim()) : Boolean(picked));

  async function pickFile() {
    try {
      const result = await withAppLockSuspended(() => DocumentPicker.getDocumentAsync({ type: ['application/vnd.android.package-archive', 'application/octet-stream', '*/*'], copyToCacheDirectory: true, multiple: false }));
      if (result.canceled || !result.assets?.length) return;
      const asset = result.assets[0];
      if (!/\.apk$/i.test(asset.name)) { fail(new Error('فقط فایل APK قابل انتشار است.')); return; }
      setPicked({ name: asset.name, size: asset.size || 0, uri: asset.uri, file: asset.file as File | undefined });
    } catch (cause) { fail(cause); }
  }

  async function publish() {
    if (!canPublish) return;
    setProgress(source === 'upload' ? 0 : null);
    const ok = await run(async () => {
      let downloadUrl = link.trim(); let storagePath: string | null = null; let fileSize: number | null = null;
      if (source === 'upload' && picked) {
        const uploaded = await uploadApk(packageName, code, picked, setProgress);
        downloadUrl = uploaded.url; storagePath = uploaded.path; fileSize = uploaded.size;
      }
      await publishRelease({ packageName, versionName: versionName.trim(), versionCode: code, downloadUrl, notes: notes.trim(), mandatory, storagePath, fileSize });
      invalidate(['releases', 'audit']);
    }, 'نسخهٔ جدید منتشر شد؛ اپ‌های زبان‌آموز در باز شدن بعدی آن را می‌بینند.');
    setProgress(null);
    if (ok) { setPicked(null); setLink(''); setVersionName(''); setVersionCode(''); setNotes(''); setMandatory(false); }
  }

  async function togglePublished(r: AdminRelease) {
    const ok = await run(() => setReleasePublished(r.id, !r.published), r.published ? 'نسخه از دسترس خارج شد.' : 'نسخه دوباره منتشر شد.');
    if (ok) releases.setData(current => (current || []).map(x => x.id === r.id ? { ...x, published: !r.published } : x));
  }
  async function remove(r: AdminRelease) {
    if (!(await confirmAction('حذف نسخه', `نسخهٔ ${r.version_name} (ساخت ${fa(r.version_code)}) برای «${findAppTarget(r.package_name)?.title || r.package_name}» حذف شود؟ فایل آپلودشده هم پاک می‌شود.`, 'حذف'))) return;
    const ok = await run(() => deleteRelease(r), 'نسخه حذف شد.');
    if (ok) releases.setData(current => (current || []).filter(x => x.id !== r.id));
  }

  const bulkCode = codeFromTag(bulkTag);
  const bulkVersionName = bulkCode ? `1.0.${bulkCode}` : '';
  const bulkStale = bulkCode ? bulkPackages.filter(pkg => (latestByPackage.get(pkg)?.version_code || 0) >= bulkCode) : [];
  const canBulk = !busy && !!bulkCode && bulkPackages.length > 0 && bulkStale.length === 0;

  async function publishBulk() {
    if (!canBulk || !bulkCode) return;
    const tag = bulkTag.trim();
    const targets = APP_TARGETS.filter(t => bulkPackages.includes(t.package));
    if (!(await confirmAction('انتشار گروهی', `${fa(targets.length)} اپ با نسخهٔ ${bulkVersionName} (ساخت ${fa(bulkCode)}) از Release «${tag}» منتشر شود؟`, 'انتشار'))) return;
    const ok: string[] = []; const failed: { pkg: string; error: string }[] = [];
    await run(async () => {
      for (const target of targets) {
        try {
          await publishRelease({ packageName: target.package, versionName: bulkVersionName, versionCode: bulkCode, downloadUrl: `${RELEASE_REPO}/releases/download/${tag}/${target.apk}`, notes: bulkNotes.trim(), mandatory: bulkMandatory });
          ok.push(target.package);
        } catch (cause) { failed.push({ pkg: target.package, error: cause instanceof Error ? cause.message : String(cause) }); }
      }
      invalidate(['releases', 'audit']);
      if (failed.length && !ok.length) throw new Error(failed[0].error);
    }, failed.length ? `${fa(ok.length)} اپ منتشر شد؛ ${fa(failed.length)} مورد ناموفق.` : `${fa(ok.length)} اپ با یک کلیک منتشر شد.`);
    setBulkDone({ ok, failed });
    if (!failed.length) { setBulkTag(''); setBulkNotes(''); setBulkMandatory(false); }
  }

  const me = installedVersion();

  return (
    <Page title="به‌روزرسانی اپ‌ها" subtitle="نسخهٔ جدید هر اپ را اینجا منتشر کنید؛ زبان‌آموزان داخل اپ پیام «نسخهٔ جدید» می‌بینند و با یک دکمه دانلود و نصب می‌کنند">
      {releases.error && <Banner kind="error" text={releases.error} />}

      <Card title="انتشار گروهی از Release گیت‌هاب" aside={<Layers size={16} color={T.color.textFaint} />}>
        <Text style={a.muted}>برچسب Release را بنویسید (مثلاً milo-requested-97)؛ شمارهٔ ساخت و نام نسخه خودکار از آن ساخته می‌شود و همهٔ اپ‌های انتخاب‌شده با لینک مستقیم همان Release منتشر می‌شوند.</Text>
        <View style={a.grid}>
          <View style={{ flex: 2, minWidth: 200, gap: 4 }}>
            <Text style={a.name}>برچسب Release</Text>
            <TextInput value={bulkTag} onChangeText={v => { setBulkTag(v); setBulkDone(null); }} autoCapitalize="none" autoCorrect={false} placeholder="milo-requested-97" placeholderTextColor={T.color.textFaint} style={[a.input, { textAlign: 'left' }]} />
          </View>
          <View style={{ flex: 1, minWidth: 140 }}><Field label="شمارهٔ ساخت" value={bulkCode ? fa(bulkCode) : '—'} /></View>
          <View style={{ flex: 1, minWidth: 140 }}><Field label="نام نسخه" value={bulkVersionName || '—'} /></View>
        </View>
        <View style={{ gap: 6 }}>
          <Text style={a.name}>کدام اپ‌ها؟</Text>
          <View style={a.actions}>
            {APP_TARGETS.map(t => {
              const active = bulkPackages.includes(t.package);
              const latest = latestByPackage.get(t.package);
              const stale = !!bulkCode && (latest?.version_code || 0) >= bulkCode;
              return (
                <Pressable key={t.package} accessibilityRole="button" accessibilityState={{ selected: active }} onPress={() => setBulkPackages(current => active ? current.filter(p => p !== t.package) : [...current, t.package])} style={{ borderWidth: 1, borderColor: active ? (stale ? T.color.danger : T.color.accent) : T.color.border, backgroundColor: active ? T.color.accentSoft : T.color.surface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, minWidth: 180, gap: 2 }}>
                  <Text style={a.name}>{t.title}</Text>
                  <Text style={a.muted}>{t.apk} · {latest ? `آخرین: ${latest.version_name} (${fa(latest.version_code)})` : 'هنوز نسخه‌ای منتشر نشده'}{stale ? ' · این نسخه قدیمی‌تر یا برابر است' : ''}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={{ gap: 4 }}>
          <Text style={a.name}>چه چیزی تغییر کرده؟ (برای همهٔ اپ‌ها)</Text>
          <TextInput value={bulkNotes} onChangeText={setBulkNotes} multiline numberOfLines={3} placeholder="مثلاً: دیالوگ شاخه‌دار، پل فارسی ترکی…" placeholderTextColor={T.color.textFaint} style={[a.input, { minHeight: 70, textAlignVertical: 'top' }]} />
        </View>
        {bulkStale.length > 0 && <Banner kind="warning" text={`برای ${fa(bulkStale.length)} اپ، نسخهٔ منتشرشده از این Release جدیدتر یا برابر است؛ آن‌ها را از انتخاب خارج کنید یا برچسب جدیدتر بدهید.`} />}
        {bulkDone && bulkDone.failed.length > 0 && <Banner kind="error" text={bulkDone.failed.map(f => `${findAppTarget(f.pkg)?.title || f.pkg}: ${f.error}`).join('\n')} />}
        <View style={[a.actions, { justifyContent: 'space-between' }]}>
          <View style={a.actions}>
            <Switch value={bulkMandatory} onValueChange={setBulkMandatory} trackColor={{ true: T.color.accent, false: T.color.border }} />
            <Text style={a.name}>به‌روزرسانی ضروری</Text>
          </View>
          <Button icon={Layers} label={`انتشار ${fa(bulkPackages.length)} اپ`} onPress={() => void publishBulk()} disabled={!canBulk} />
        </View>
      </Card>

      <Card title="انتشار نسخهٔ جدید (تکی)">
        <Text style={a.muted}>۱) اپ را انتخاب کنید · ۲) فایل APK را آپلود کنید یا لینک مستقیم بدهید · ۳) شمارهٔ نسخه و توضیح بنویسید · ۴) انتشار.</Text>
        <View style={{ gap: 6 }}>
          <Text style={a.name}>اپ هدف</Text>
          <View style={a.actions}>
            {APP_TARGETS.map(t => {
              const active = t.package === packageName;
              const latest = latestByPackage.get(t.package);
              return (
                <Pressable key={t.package} accessibilityRole="button" onPress={() => setPackageName(t.package)} style={{ borderWidth: 1, borderColor: active ? T.color.accent : T.color.border, backgroundColor: active ? T.color.accentSoft : T.color.surface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, minWidth: 180, gap: 2 }}>
                  <Text style={a.name}>{t.title}</Text>
                  <Text style={a.muted}>{t.hint} · {latest ? `آخرین: ${latest.version_name} (${fa(latest.version_code)})` : 'هنوز نسخه‌ای منتشر نشده'}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <Text style={a.name}>منبع فایل</Text>
          <Segmented value={source} onChange={setSource} options={[{ id: 'upload', label: 'آپلود فایل APK' }, { id: 'link', label: 'لینک مستقیم' }]} />
          {source === 'upload' ? (
            <View style={a.actions}>
              <Button variant="soft" tone="accent" icon={FileUp} label={picked ? 'تغییر فایل' : 'انتخاب فایل APK'} onPress={() => void pickFile()} disabled={busy} />
              {picked && <Chip label={`${picked.name} · ${formatSize(picked.size)}`} tone="accent" />}
              <Text style={a.muted}>فایل در فضای ذخیره‌سازی پروژه نگه داشته می‌شود. اگر حجم فایل از سقف پلن Supabase بیشتر بود، از «لینک مستقیم» استفاده کنید.</Text>
            </View>
          ) : (
            <View style={{ gap: 6 }}>
              <TextInput value={link} onChangeText={setLink} autoCapitalize="none" keyboardType="url" placeholder="https://github.com/…/5update.apk" placeholderTextColor={T.color.textFaint} style={[a.input, { textAlign: 'left' }]} />
              <Text style={a.muted}>لینک باید مستقیم به فایل APK باشد (مثل لینک دانلود در صفحهٔ Release گیت‌هاب).</Text>
            </View>
          )}
        </View>

        <View style={a.grid}>
          <View style={{ flex: 1, minWidth: 160, gap: 4 }}>
            <Text style={a.name}>نام نسخه</Text>
            <TextInput value={versionName} onChangeText={setVersionName} placeholder={`مثلاً 1.0.${suggestedCode}`} placeholderTextColor={T.color.textFaint} style={[a.input, { textAlign: 'left' }]} />
          </View>
          <View style={{ flex: 1, minWidth: 160, gap: 4 }}>
            <Text style={a.name}>شمارهٔ ساخت (versionCode)</Text>
            <TextInput value={versionCode} onChangeText={setVersionCode} keyboardType="number-pad" placeholder={`پیشنهاد: ${suggestedCode}`} placeholderTextColor={T.color.textFaint} style={[a.input, { textAlign: 'left' }]} />
            <Text style={a.muted}>باید از شمارهٔ نصب‌شده روی گوشی‌ها بزرگ‌تر باشد؛ این عدد در توضیحات هر Release گیت‌هاب نوشته شده است.</Text>
          </View>
        </View>
        <View style={{ gap: 4 }}>
          <Text style={a.name}>چه چیزی تغییر کرده؟ (به زبان‌آموز نشان داده می‌شود)</Text>
          <TextInput value={notes} onChangeText={setNotes} multiline numberOfLines={3} placeholder="مثلاً: رفع مشکل اعلان‌ها، درس‌های جدید آلمانی…" placeholderTextColor={T.color.textFaint} style={[a.input, { minHeight: 80, textAlignVertical: 'top' }]} />
        </View>
        <View style={[a.actions, { justifyContent: 'space-between' }]}>
          <View style={a.actions}>
            <Switch value={mandatory} onValueChange={setMandatory} trackColor={{ true: T.color.accent, false: T.color.border }} />
            <Text style={a.name}>به‌روزرسانی ضروری (دکمهٔ «بعداً» حذف می‌شود)</Text>
          </View>
          <Button icon={UploadCloud} label={progress !== null ? `در حال آپلود… ${fa(Math.round(progress * 100))}٪` : 'انتشار نسخه'} onPress={() => void publish()} disabled={!canPublish} />
        </View>
        {progress !== null && <View style={{ height: 8, backgroundColor: T.color.surfaceMuted, borderRadius: 6, overflow: 'hidden', alignItems: 'flex-end' }}><View style={{ height: 8, width: `${Math.round(progress * 100)}%`, backgroundColor: T.color.accent }} /></View>}
      </Card>

      <Card title="نسخه‌های منتشرشده" padded={false} aside={<Text style={a.muted}>{n(rows.length)} نسخه</Text>}>
        {releases.loading && !releases.data && <Loading />}
        {releases.data && !rows.length && <EmptyState icon={PackageOpen} title="هنوز نسخه‌ای منتشر نشده است" hint="اولین نسخه را از فرم بالا منتشر کنید." />}
        {rows.map(r => {
          const target = findAppTarget(r.package_name);
          const isLatest = latestByPackage.get(r.package_name)?.id === r.id;
          return (
            <ListRow key={r.id} dimmed={!r.published}>
              <Avatar name={target?.title || r.package_name} tone={isLatest ? 'success' : r.published ? 'accent' : 'neutral'} />
              <View style={{ flex: 1, minWidth: 170 }}>
                <Text style={a.name}>{target?.title || r.package_name} · {r.version_name}</Text>
                <Text style={a.muted}>ساخت {fa(r.version_code)}{r.file_size ? ` · ${formatSize(r.file_size)}` : ''} · {faDateTime(r.created_at)}</Text>
                {!!r.release_notes && <Text numberOfLines={2} style={a.muted}>{r.release_notes}</Text>}
              </View>
              <View style={{ flexDirection: 'row-reverse', gap: 4, flexWrap: 'wrap' }}>
                {isLatest && <Chip label="آخرین نسخه" tone="success" />}
                {!r.published && <Chip label="غیرفعال" tone="warning" />}
                {r.mandatory && <Chip label="ضروری" tone="danger" />}
                <Chip label={r.storage_path ? 'آپلودشده' : 'لینک خارجی'} tone={r.storage_path ? 'accent' : 'info'} />
              </View>
              <View style={a.actions}>
                <Button small variant="soft" tone={r.published ? 'warning' : 'success'} icon={r.published ? EyeOff : Eye} label={r.published ? 'غیرفعال' : 'انتشار دوباره'} disabled={busy} onPress={() => void togglePublished(r)} />
                <Button small variant="soft" tone="danger" icon={Trash2} label="حذف" disabled={busy} onPress={() => void remove(r)} />
              </View>
            </ListRow>
          );
        })}
      </Card>

      {Platform.OS === 'android' && <Text style={a.muted}>این دستگاه: {me.package} · نسخهٔ {me.name} (ساخت {fa(me.code)})</Text>}
    </Page>
  );
}
