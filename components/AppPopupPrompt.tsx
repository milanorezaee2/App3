import { LocalizedText as Text } from '@/components/LocalizedText';
import { invalidatePopupCache, markPopupSeen, popupsForPage, type LearnerPopup } from '@/lib/appPopups';
import { LinearGradient } from 'expo-linear-gradient';
import { usePathname } from 'expo-router';
import { AlertTriangle, ArrowUpRight, BellRing, Gift, PartyPopper, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, AppState, Easing, Linking, Modal, Pressable, StyleSheet, View } from 'react-native';

const KIND = {
  info: { icon: BellRing, label: 'اطلاع‌رسانی', gradient: ['#1E3A8A', '#2563EB', '#38BDF8'] as const, accent: '#2563EB', soft: '#EFF6FF' },
  success: { icon: PartyPopper, label: 'خبر خوب', gradient: ['#14532D', '#16A34A', '#86EFAC'] as const, accent: '#16A34A', soft: '#F0FDF4' },
  warning: { icon: AlertTriangle, label: 'توجه', gradient: ['#7C2D12', '#EA580C', '#FDBA74'] as const, accent: '#EA580C', soft: '#FFF7ED' },
  promo: { icon: Gift, label: 'پیشنهاد ویژه', gradient: ['#4C1D95', '#7C3AED', '#F0ABFC'] as const, accent: '#7C3AED', soft: '#FAF5FF' },
} as const;

/**
 * Shows admin pop-ups: page-wide ones a few seconds after launch and on return
 * to the app, page-pinned ones when the learner opens that page. Several
 * pop-ups for the same page are shown one after another.
 */
export function AppPopupPrompt() {
  const pathname = usePathname();
  const [queue, setQueue] = useState<LearnerPopup[]>([]);
  const queueRef = useRef<LearnerPopup[]>([]);
  queueRef.current = queue;
  const pathRef = useRef(pathname);
  pathRef.current = pathname;
  const launchedAt = useRef(Date.now());

  useEffect(() => {
    let mounted = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const check = (delayMs: number, force = false) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (!mounted || queueRef.current.length) return;
        const path = pathRef.current;
        void popupsForPage(path, force).then(found => {
          if (!mounted || queueRef.current.length || pathRef.current !== path || !found.length) return;
          setQueue(found);
        });
      }, delayMs);
    };
    // First launch: let the update prompt go first. Later pages: show promptly.
    check(Date.now() - launchedAt.current < 8000 ? 7000 : 900);
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') { invalidatePopupCache(); check(2500, true); }
    });
    return () => { mounted = false; if (timer) clearTimeout(timer); subscription.remove(); };
  }, [pathname]);

  const popup = queue[0] ?? null;
  const close = () => {
    if (!popup) return;
    void markPopupSeen(popup, pathRef.current);
    setQueue(current => current.slice(1));
  };
  const open = () => { if (popup?.button_url) void Linking.openURL(popup.button_url).catch(() => undefined); close(); };
  if (!popup) return null;
  return <PopupCard key={`${popup.id}:${popup.updated_at}`} popup={popup} remaining={queue.length - 1} onClose={close} onOpen={open} />;
}

function PopupCard({ popup, remaining, onClose, onOpen }: { popup: LearnerPopup; remaining: number; onClose: () => void; onOpen: () => void }) {
  const kind = KIND[popup.kind] || KIND.info;
  const Icon = kind.icon;
  const entrance = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    entrance.setValue(0);
    Animated.timing(entrance, { toValue: 1, duration: 420, easing: Easing.out(Easing.back(1.4)), useNativeDriver: true }).start();
  }, [entrance, popup.id]);
  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose} statusBarTranslucent>
      <View style={s.backdrop}>
        <Animated.View style={[s.sheet, { opacity: entrance, transform: [{ scale: entrance.interpolate({ inputRange: [0, 1], outputRange: [0.86, 1] }) }, { translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }] }]}>
          <LinearGradient colors={[...kind.gradient]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.hero}>
            <View style={s.heroGlowLarge} />
            <View style={s.heroGlowSmall} />
            <Pressable accessibilityRole="button" accessibilityLabel="بستن" onPress={onClose} hitSlop={10} style={s.closeButton}><X size={16} color="#FFFFFF" /></Pressable>
            <View style={s.iconRing}><View style={s.iconDisc}><Icon size={30} color={kind.accent} strokeWidth={2.2} /></View></View>
            <View style={s.kindPill}><Text keepColor style={s.kindText}>{kind.label}</Text></View>
          </LinearGradient>
          <View style={s.content}>
            <Text style={s.title}>{popup.title}</Text>
            <Text style={s.body}>{popup.body}</Text>
            <View style={s.actions}>
              {popup.button_label ? (
                <Pressable accessibilityRole="button" onPress={onOpen} style={({ pressed }) => [s.primary, { backgroundColor: kind.accent, shadowColor: kind.accent }, pressed && s.pressed]}>
                  <ArrowUpRight size={17} color="#FFFFFF" />
                  <Text keepColor style={s.primaryText}>{popup.button_label}</Text>
                </Pressable>
              ) : null}
              <Pressable accessibilityRole="button" onPress={onClose} style={({ pressed }) => [s.secondary, { backgroundColor: kind.soft }, popup.button_label ? null : s.secondaryWide, pressed && s.pressed]}>
                <Text keepColor style={[s.secondaryText, { color: kind.accent }]}>{popup.button_label ? 'بعداً' : 'متوجه شدم'}</Text>
              </Pressable>
            </View>
            {remaining > 0 ? <Text style={s.remaining}>{remaining === 1 ? 'یک پیام دیگر' : `${remaining.toLocaleString('fa-IR')} پیام دیگر`}</Text> : null}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(2,6,23,0.58)', alignItems: 'center', justifyContent: 'center', padding: 22 },
  sheet: { width: '100%', maxWidth: 400, backgroundColor: '#FFFFFF', borderRadius: 28, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 30, shadowOffset: { width: 0, height: 18 }, elevation: 18 },
  hero: { minHeight: 150, alignItems: 'center', justifyContent: 'center', paddingTop: 26, paddingBottom: 22, overflow: 'hidden' },
  heroGlowLarge: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.14)', top: -90, right: -60 },
  heroGlowSmall: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.12)', bottom: -50, left: -20 },
  closeButton: { position: 'absolute', top: 12, left: 12, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' },
  iconRing: { width: 84, height: 84, borderRadius: 42, backgroundColor: 'rgba(255,255,255,0.28)', alignItems: 'center', justifyContent: 'center' },
  iconDisc: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  kindPill: { marginTop: 12, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.22)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.45)' },
  kindText: { fontFamily: 'Beiruti-Bold', fontSize: 12, color: '#FFFFFF', letterSpacing: 0.3 },
  content: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 20, gap: 10 },
  title: { fontFamily: 'Beiruti-Bold', fontSize: 22, lineHeight: 30, color: '#0F172A', textAlign: 'center' },
  body: { fontFamily: 'Beiruti-Bold', fontSize: 15, color: '#475569', textAlign: 'center', lineHeight: 25 },
  actions: { flexDirection: 'row-reverse', gap: 10, marginTop: 10 },
  primary: { flex: 1.3, flexDirection: 'row-reverse', gap: 6, alignItems: 'center', justifyContent: 'center', borderRadius: 16, minHeight: 50, shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 5 },
  primaryText: { fontFamily: 'Beiruti-Bold', fontSize: 15, color: '#FFFFFF' },
  secondary: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 16, minHeight: 50 },
  secondaryWide: { flex: 1 },
  secondaryText: { fontFamily: 'Beiruti-Bold', fontSize: 15 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  remaining: { fontFamily: 'Beiruti-Bold', fontSize: 12, color: '#94A3B8', textAlign: 'center', marginTop: 2 },
});
