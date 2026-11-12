import { LocalizedText as Text } from '@/components/LocalizedText';
import type { AppRelease } from '@/lib/appReleases';
import { checkForUpdateOnLaunch, downloadAndInstall, formatSize, installedVersion, skipUpdate } from '@/lib/appUpdates';
import { toPersianDigits as fa } from '@/lib/format';
import { Download, RefreshCw } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';

/**
 * Shows the "new version available" sheet once per launch (throttled in
 * lib/appUpdates). Android only; no-op elsewhere.
 */
export function AppUpdatePrompt() {
  const [release, setRelease] = useState<AppRelease | null>(null);
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    let mounted = true;
    const timer = setTimeout(() => { void checkForUpdateOnLaunch().then(found => { if (mounted && found) setRelease(found); }); }, 4000);
    return () => { mounted = false; clearTimeout(timer); };
  }, []);
  if (!release) return null;
  return <UpdateSheet release={release} onClose={() => setRelease(null)} />;
}

export function UpdateSheet({ release, onClose }: { release: AppRelease; onClose: () => void }) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');
  const installed = installedVersion();
  const busy = progress !== null;

  async function install() {
    setError(''); setProgress(0);
    try { await downloadAndInstall(release, setProgress); setProgress(null); }
    catch (cause) { setProgress(null); setError(cause instanceof Error ? cause.message : 'نصب انجام نشد.'); }
  }
  async function later() { await skipUpdate(release).catch(() => undefined); onClose(); }

  return (
    <Modal transparent animationType="fade" visible onRequestClose={() => { if (!release.mandatory && !busy) void later(); }}>
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <View style={s.iconWrap}><RefreshCw size={26} color="#0E7490" /></View>
          <Text style={s.title}>نسخهٔ جدید آماده است</Text>
          <Text style={s.meta}>نسخهٔ {release.version_name} (ساخت {fa(release.version_code)}){release.file_size ? ` · ${formatSize(release.file_size)}` : ''}</Text>
          <Text style={s.metaSmall}>نسخهٔ فعلی شما: {installed.name} (ساخت {fa(installed.code)})</Text>
          {!!release.release_notes && <Text style={s.notes}>{release.release_notes}</Text>}
          {release.mandatory && <Text style={s.mandatory}>این به‌روزرسانی ضروری است.</Text>}
          {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
          {busy && (
            <View style={s.progressWrap}>
              <View style={s.track}><View style={[s.fill, { width: `${Math.round((progress || 0) * 100)}%` }]} /></View>
              <Text style={s.metaSmall}>{progress && progress >= 1 ? 'باز کردن نصب‌کننده…' : `در حال دانلود… ${fa(Math.round((progress || 0) * 100))}٪`}</Text>
            </View>
          )}
          <View style={s.actions}>
            <Pressable accessibilityRole="button" disabled={busy} onPress={() => void install()} style={[s.primary, busy && { opacity: 0.6 }]}>
              {busy ? <ActivityIndicator color="#fff" /> : <Download size={18} color="#fff" />}
              <Text keepColor style={s.primaryText}>{error ? 'تلاش دوباره' : 'دانلود و نصب'}</Text>
            </Pressable>
            {!release.mandatory && (
              <Pressable accessibilityRole="button" disabled={busy} onPress={() => void later()} style={s.secondary}>
                <Text style={s.secondaryText}>بعداً</Text>
              </Pressable>
            )}
          </View>
          <Text style={s.hint}>پس از دانلود، اندروید صفحهٔ نصب را باز می‌کند؛ اگر پرسید، اجازهٔ «نصب از این منبع» را بدهید.</Text>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.45)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  sheet: { width: '100%', maxWidth: 420, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 22, gap: 8 },
  iconWrap: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#E0F2F7', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' },
  title: { fontFamily: 'Beiruti-Bold', fontSize: 20, color: '#0F172A', textAlign: 'right' },
  meta: { fontFamily: 'Beiruti-Bold', fontSize: 14, color: '#334155', textAlign: 'right' },
  metaSmall: { fontFamily: 'Beiruti-Bold', fontSize: 12, color: '#64748B', textAlign: 'right' },
  notes: { fontFamily: 'Beiruti-Bold', fontSize: 14, color: '#334155', textAlign: 'right', lineHeight: 22, backgroundColor: '#F6F8FA', borderRadius: 10, padding: 10 },
  mandatory: { fontFamily: 'Beiruti-Bold', fontSize: 13, color: '#B45309', textAlign: 'right' },
  error: { fontFamily: 'Beiruti-Bold', fontSize: 13, color: '#B91C1C', backgroundColor: '#FEE2E2', padding: 10, borderRadius: 10, textAlign: 'right' },
  progressWrap: { gap: 6 },
  track: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 6, overflow: 'hidden', alignItems: 'flex-end' },
  fill: { height: 8, backgroundColor: '#0E7490', borderRadius: 6 },
  actions: { flexDirection: 'row-reverse', gap: 10, marginTop: 6 },
  primary: { flex: 1, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#0E7490', borderRadius: 12, minHeight: 46 },
  primaryText: { fontFamily: 'Beiruti-Bold', fontSize: 15, color: '#FFFFFF' },
  secondary: { paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#D5DBE3', minHeight: 46 },
  secondaryText: { fontFamily: 'Beiruti-Bold', fontSize: 14, color: '#475569' },
  hint: { fontFamily: 'Beiruti-Bold', fontSize: 11, color: '#64748B', textAlign: 'right', lineHeight: 17 },
});
