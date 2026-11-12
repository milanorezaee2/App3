import { LocalizedText as Text } from '@/components/LocalizedText';
import { markPopupSeen, nextPopupToShow, type LearnerPopup } from '@/lib/appPopups';
import { AlertTriangle, Info, PartyPopper, Sparkles } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Linking, Modal, Pressable, StyleSheet, View } from 'react-native';

const KIND = {
  info: { icon: Info, fg: '#1D4ED8', bg: '#DBEAFE' },
  success: { icon: PartyPopper, fg: '#15803D', bg: '#DCFCE7' },
  warning: { icon: AlertTriangle, fg: '#B45309', bg: '#FEF3C7' },
  promo: { icon: Sparkles, fg: '#155E75', bg: '#E0F2F7' },
} as const;

/** Shows the next admin pop-up a few seconds after launch (after the update prompt). */
export function AppPopupPrompt() {
  const [popup, setPopup] = useState<LearnerPopup | null>(null);
  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => { void nextPopupToShow().then(found => { if (mounted && found) setPopup(found); }); }, 7000);
    return () => { mounted = false; clearTimeout(timer); };
  }, []);
  if (!popup) return null;
  const kind = KIND[popup.kind] || KIND.info;
  const Icon = kind.icon;
  const close = () => { void markPopupSeen(popup); setPopup(null); };
  const open = () => { if (popup.button_url) void Linking.openURL(popup.button_url).catch(() => undefined); close(); };
  return (
    <Modal transparent animationType="fade" visible onRequestClose={close}>
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <View style={[s.iconWrap, { backgroundColor: kind.bg }]}><Icon size={26} color={kind.fg} /></View>
          <Text style={s.title}>{popup.title}</Text>
          <Text style={s.body}>{popup.body}</Text>
          <View style={s.actions}>
            {popup.button_label && <Pressable accessibilityRole="button" onPress={open} style={[s.primary, { backgroundColor: kind.fg }]}><Text keepColor style={s.primaryText}>{popup.button_label}</Text></Pressable>}
            <Pressable accessibilityRole="button" onPress={close} style={s.secondary}><Text style={s.secondaryText}>{popup.button_label ? 'بستن' : 'متوجه شدم'}</Text></Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.45)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  sheet: { width: '100%', maxWidth: 420, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 22, gap: 10 },
  iconWrap: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' },
  title: { fontFamily: 'Beiruti-Bold', fontSize: 20, color: '#0F172A', textAlign: 'right' },
  body: { fontFamily: 'Beiruti-Bold', fontSize: 15, color: '#334155', textAlign: 'right', lineHeight: 24 },
  actions: { flexDirection: 'row-reverse', gap: 10, marginTop: 6 },
  primary: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 12, minHeight: 46 },
  primaryText: { fontFamily: 'Beiruti-Bold', fontSize: 15, color: '#FFFFFF' },
  secondary: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#D5DBE3', minHeight: 46 },
  secondaryText: { fontFamily: 'Beiruti-Bold', fontSize: 14, color: '#475569' },
});
