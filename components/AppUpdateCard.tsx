import { LocalizedText as Text } from '@/components/LocalizedText';
import type { AppRelease } from '@/lib/appReleases';
import { downloadAndInstall, fetchAvailableUpdate, formatSize, installedVersion, isUpdateSupported } from '@/lib/appUpdates';
import { toPersianDigits as fa } from '@/lib/format';
import { ArrowDownToLine, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

type Status = 'idle' | 'checking' | 'current' | 'available' | 'error';

/**
 * Profile → «حساب» → «دستگاه و نسخه»: shows the installed version, checks the
 * server for a newer published release of *this* package and installs it.
 * Package-agnostic, so every current and future learner APK gets it for free.
 */
export function AppUpdateCard() {
  const installed = installedVersion();
  const supported = isUpdateSupported();
  const [status, setStatus] = useState<Status>('idle');
  const [release, setRelease] = useState<AppRelease | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');

  async function check() {
    if (!supported || status === 'checking') return;
    setStatus('checking'); setError('');
    try {
      const found = await fetchAvailableUpdate();
      setRelease(found);
      setStatus(found ? 'available' : 'current');
    } catch (cause) {
      setStatus('error');
      setError(cause instanceof Error ? cause.message : 'بررسی به‌روزرسانی انجام نشد.');
    }
  }

  async function install() {
    if (!release || progress !== null) return;
    setError(''); setProgress(0);
    try { await downloadAndInstall(release, setProgress); setProgress(null); }
    catch (cause) { setProgress(null); setError(cause instanceof Error ? cause.message : 'نصب انجام نشد.'); }
  }

  // Quiet check when the tab opens so the badge is already right.
  useEffect(() => { void check(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const busy = progress !== null;
  const versionLabel = installed.code ? `${installed.name} (ساخت ${fa(installed.code)})` : installed.name;

  return (
    <View style={s.card}>
      <View style={s.head}>
        <View style={s.copy}>
          <Text style={s.label}>نسخهٔ نصب‌شده</Text>
          <Text keepColor style={s.version}>{versionLabel}</Text>
        </View>
        {status === 'available' ? (
          <View style={[s.pill, s.pillNew]}><Sparkles size={12} color="#9A4B1E" /><Text keepColor style={[s.pillText, { color: '#9A4B1E' }]}>نسخهٔ جدید</Text></View>
        ) : status === 'current' ? (
          <View style={[s.pill, s.pillOk]}><CheckCircle2 size={12} color="#2F6B45" /><Text keepColor style={[s.pillText, { color: '#2F6B45' }]}>به‌روز</Text></View>
        ) : null}
      </View>

      {!supported && <Text style={s.hint}>به‌روزرسانی درون‌برنامه‌ای فقط در نسخهٔ اندروید در دسترس است.</Text>}

      {supported && status === 'available' && release && (
        <View style={s.releaseBox}>
          <Text style={s.releaseTitle}>نسخهٔ {release.version_name} (ساخت {fa(release.version_code)}){release.file_size ? ` · ${formatSize(release.file_size)}` : ''}</Text>
          {!!release.release_notes && <Text style={s.notes}>{release.release_notes}</Text>}
          {release.mandatory && <Text style={s.mandatory}>این به‌روزرسانی ضروری است.</Text>}
          {busy && (
            <View style={s.progressWrap}>
              <View style={s.track}><View style={[s.fill, { width: `${Math.round((progress || 0) * 100)}%` }]} /></View>
              <Text style={s.hint}>{progress && progress >= 1 ? 'باز کردن نصب‌کننده…' : `در حال دانلود… ${fa(Math.round((progress || 0) * 100))}٪`}</Text>
            </View>
          )}
          <Pressable accessibilityRole="button" disabled={busy} onPress={() => void install()} style={({ pressed }) => [s.primary, (pressed || busy) && { opacity: 0.75 }]}>
            {busy ? <ActivityIndicator size="small" color="#FFFFFF" /> : <ArrowDownToLine size={16} color="#FFFFFF" />}
            <Text keepColor style={s.primaryText}>{error ? 'تلاش دوباره' : 'دانلود و نصب به‌روزرسانی'}</Text>
          </Pressable>
          <Text style={s.hint}>پس از دانلود، اندروید صفحهٔ نصب را باز می‌کند؛ اگر پرسید، اجازهٔ «نصب از این منبع» را بدهید.</Text>
        </View>
      )}

      {supported && status !== 'available' && (
        <Pressable accessibilityRole="button" disabled={status === 'checking'} onPress={() => void check()} style={({ pressed }) => [s.secondary, pressed && { opacity: 0.75 }]}>
          {status === 'checking' ? <ActivityIndicator size="small" color="#31533B" /> : <RefreshCw size={15} color="#31533B" />}
          <Text style={s.secondaryText}>{status === 'checking' ? 'در حال بررسی…' : status === 'current' ? 'بررسی دوباره' : 'بررسی به‌روزرسانی'}</Text>
        </Pressable>
      )}

      {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, borderColor: '#E6DDCE', backgroundColor: '#FAF6EE', padding: 12, gap: 10 },
  head: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  copy: { flex: 1, alignItems: 'flex-end', gap: 2 },
  label: { fontSize: 11, color: '#746E63', textAlign: 'right' },
  version: { fontFamily: 'Times New Roman', fontWeight: '700', fontSize: 15, color: '#26382D', writingDirection: 'ltr', textAlign: 'right' },
  pill: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  pillNew: { backgroundColor: '#FBE9DC', borderColor: '#F0CDB7' },
  pillOk: { backgroundColor: '#E3EFE6', borderColor: '#C9DFD0' },
  pillText: { fontSize: 11, fontFamily: 'Beiruti-Bold' },
  releaseBox: { gap: 8, borderTopWidth: 1, borderTopColor: '#EADFCF', paddingTop: 10 },
  releaseTitle: { fontSize: 13, color: '#26382D', textAlign: 'right' },
  notes: { fontSize: 13, color: '#4B5563', textAlign: 'right', lineHeight: 22, backgroundColor: '#FFFCF6', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#EFE7DA' },
  mandatory: { fontSize: 12, color: '#B45309', textAlign: 'right' },
  progressWrap: { gap: 4 },
  track: { height: 6, borderRadius: 3, backgroundColor: '#E6DDCE', overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#31533B' },
  primary: { minHeight: 46, borderRadius: 14, backgroundColor: '#31533B', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryText: { color: '#FFFFFF', fontSize: 14, fontFamily: 'Beiruti-Bold' },
  secondary: { minHeight: 42, borderRadius: 12, borderWidth: 1, borderColor: '#D7DECE', backgroundColor: '#FFFFFF', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 7 },
  secondaryText: { fontSize: 13, color: '#31533B' },
  hint: { fontSize: 11, color: '#746E63', textAlign: 'right', lineHeight: 18 },
  error: { fontSize: 12, color: '#B42318', textAlign: 'right' },
});
