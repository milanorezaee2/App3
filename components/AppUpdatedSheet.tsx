import { LocalizedText as Text } from '@/components/LocalizedText';
import { consumeJustUpdated, type InstalledUpdateInfo } from '@/lib/appUpdates';
import { toPersianDigits as fa } from '@/lib/format';
import { BadgeCheck, Sparkles } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';

/** After an update is installed, the first launch shows what changed. */
export function AppUpdatedSheet() {
  const [info, setInfo] = useState<InstalledUpdateInfo | null>(null);
  useEffect(() => {
    if (Platform.OS === 'web') return;
    let mounted = true;
    const timer = setTimeout(() => { void consumeJustUpdated().then(found => { if (mounted && found) setInfo(found); }).catch(() => undefined); }, 1500);
    return () => { mounted = false; clearTimeout(timer); };
  }, []);
  if (!info) return null;
  const notes = info.release_notes.trim();
  const lines = notes ? notes.split(/\r?\n/).map(line => line.replace(/^[-•*]\s*/, '').trim()).filter(Boolean) : [];
  return (
    <Modal transparent animationType="fade" visible onRequestClose={() => setInfo(null)}>
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <View style={s.iconWrap}><BadgeCheck size={28} color="#2F6B45" /></View>
          <Text style={s.title}>برنامه به‌روزرسانی شد</Text>
          <Text style={s.meta}>اکنون نسخهٔ {info.version_name} (ساخت {fa(info.version_code)}) را دارید.</Text>
          {lines.length > 0 ? (
            <View style={s.notesBox}>
              <View style={s.notesHead}><Sparkles size={14} color="#9A4B1E" /><Text style={s.notesTitle}>تغییرات این نسخه</Text></View>
              {lines.map((line, index) => (
                <View key={index} style={s.noteRow}><Text style={s.bullet}>•</Text><Text style={s.noteText}>{line}</Text></View>
              ))}
            </View>
          ) : (
            <Text style={s.metaSmall}>بهبودهای پایداری و عملکرد.</Text>
          )}
          <Pressable accessibilityRole="button" onPress={() => setInfo(null)} style={({ pressed }) => [s.primary, pressed && { opacity: 0.8 }]}>
            <Text keepColor style={s.primaryText}>شروع</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.45)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  sheet: { width: '100%', maxWidth: 420, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 22, gap: 10 },
  iconWrap: { width: 54, height: 54, borderRadius: 17, backgroundColor: '#E3EFE6', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' },
  title: { fontFamily: 'Beiruti-Bold', fontSize: 20, color: '#0F172A', textAlign: 'right' },
  meta: { fontFamily: 'Beiruti-Bold', fontSize: 14, color: '#334155', textAlign: 'right' },
  metaSmall: { fontFamily: 'Beiruti-Bold', fontSize: 13, color: '#64748B', textAlign: 'right' },
  notesBox: { backgroundColor: '#FAF6EE', borderRadius: 12, borderWidth: 1, borderColor: '#EFE7DA', padding: 12, gap: 6 },
  notesHead: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, marginBottom: 2 },
  notesTitle: { fontFamily: 'Beiruti-Bold', fontSize: 13, color: '#9A4B1E' },
  noteRow: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 8 },
  bullet: { fontSize: 14, color: '#31533B', lineHeight: 22 },
  noteText: { flex: 1, fontFamily: 'Beiruti-Bold', fontSize: 14, color: '#334155', textAlign: 'right', lineHeight: 22 },
  primary: { marginTop: 4, minHeight: 48, borderRadius: 14, backgroundColor: '#31533B', alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Beiruti-Bold' },
});
