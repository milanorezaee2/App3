import { LocalizedText as Text, LocalizedTextInput as TextInput } from '@/components/LocalizedText';
import { usePathname, useRouter } from 'expo-router';
import { BookOpen, GraduationCap, LayoutDashboard, LogOut, MessageSquare, MessagesSquare, RefreshCw, Settings, ShieldCheck, Users } from 'lucide-react-native';
import { useState, type ComponentType, type ReactNode } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAdmin } from './store';
import { AdminTheme as T } from './theme';
import { Banner, Button, Loading } from './ui';

interface NavItem { href: string; label: string; short: string; icon: ComponentType<{ size?: number; color?: string }> }
export const ADMIN_NAV: NavItem[] = [
  { href: '/admin', label: 'داشبورد', short: 'داشبورد', icon: LayoutDashboard },
  { href: '/admin/users', label: 'کاربران', short: 'کاربران', icon: Users },
  { href: '/admin/support', label: 'پشتیبانی', short: 'پشتیبانی', icon: MessageSquare },
  { href: '/admin/chats', label: 'گفتگوها', short: 'گفتگوها', icon: MessagesSquare },
  { href: '/admin/learners', label: 'زبان‌آموزان و دعوت‌ها', short: 'زبان‌آموزان', icon: GraduationCap },
  { href: '/admin/content', label: 'محتوای آموزشی', short: 'محتوا', icon: BookOpen },
  { href: '/admin/settings', label: 'تنظیمات', short: 'تنظیمات', icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { session } = useAdmin();
  if (session === 'checking') return <View style={s.center}><Loading label="بررسی نشست مدیر…" /></View>;
  if (session === 'signed-out') return <SignIn />;
  return <Frame>{children}</Frame>;
}

function Frame({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const wide = width >= 900;
  const pathname = usePathname();
  const router = useRouter();
  const { feedback, clearFeedback, busy, invalidate, adminEmail } = useAdmin();
  const isActive = (href: string) => href === '/admin' ? pathname === '/admin' || pathname === '/admin/' : pathname.startsWith(href);
  const current = ADMIN_NAV.find(item => isActive(item.href)) ?? ADMIN_NAV[0];

  return (
    <View style={[s.root, { flexDirection: wide ? 'row-reverse' : 'column' }]}>
      {wide && (
        <View style={[s.sidebar, { paddingTop: insets.top + 18 }]}>
          <View style={s.brand}>
            <View style={s.brandMark}><ShieldCheck size={20} color="#FFFFFF" /></View>
            <View>
              <Text keepColor style={s.brandTitle}>پنل مدیریت Milo</Text>
              <Text keepColor numberOfLines={1} style={s.brandSub}>{adminEmail || 'مدیر'}</Text>
            </View>
          </View>
          <View style={{ gap: 2 }}>
            {ADMIN_NAV.map(item => {
              const active = isActive(item.href);
              return (
                <Pressable key={item.href} accessibilityRole="button" onPress={() => router.replace(item.href as never)} style={[s.navItem, active && s.navItemActive]}>
                  <item.icon size={18} color={active ? '#FFFFFF' : T.color.sidebarMuted} />
                  <Text keepColor style={[s.navText, active && s.navTextActive]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={{ flex: 1 }} />
          <Text keepColor style={s.sidebarFoot}>فقط مدیر • همهٔ اقدامات ثبت می‌شوند</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <View style={[s.topbar, { paddingTop: (wide ? 10 : insets.top + 8) }]}>
          <Text style={s.topTitle}>{current.label}</Text>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 8 }}>
            {busy && <ActivityIndicator size="small" color={T.color.accent} />}
            <Button small variant="ghost" tone="neutral" icon={RefreshCw} label="تازه‌سازی" onPress={() => invalidate()} />
          </View>
        </View>
        {feedback && <View style={{ paddingHorizontal: 16, paddingTop: 10 }}><Banner kind={feedback.kind} text={feedback.text} onClose={clearFeedback} /></View>}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: wide ? 24 : 90 + insets.bottom }} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
        {!wide && (
          <View style={[s.bottomNav, { paddingBottom: Math.max(insets.bottom, 6) }]}>
            {ADMIN_NAV.map(item => {
              const active = isActive(item.href);
              return (
                <Pressable key={item.href} accessibilityRole="button" onPress={() => router.replace(item.href as never)} style={s.bottomItem}>
                  <item.icon size={20} color={active ? T.color.accent : T.color.textFaint} />
                  <Text keepColor numberOfLines={1} style={[s.bottomText, active && { color: T.color.accent, fontFamily: T.font.faStrong }]}>{item.short}</Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}

function SignIn() {
  const { signIn, busy, feedback, clearFeedback } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <ScrollView contentContainerStyle={s.signInPage} keyboardShouldPersistTaps="handled">
      <View style={s.signInCard}>
        <View style={[s.brandMark, { alignSelf: 'flex-end', width: 48, height: 48, borderRadius: 14 }]}><ShieldCheck size={26} color="#FFFFFF" /></View>
        <Text style={s.signInTitle}>اتصال یک‌بارهٔ پنل مدیریت</Text>
        <Text style={s.signInHint}>این صفحه فقط یک‌بار روی هر دستگاه نمایش داده می‌شود؛ پس از اتصال، حفاظت با قفل خود دستگاه انجام می‌شود.</Text>
        {feedback && <Banner kind={feedback.kind} text={feedback.text} onClose={clearFeedback} />}
        <Text style={s.label}>ایمیل مدیر</Text>
        <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" style={[s.input, { textAlign: 'left' }]} placeholder="admin@example.com" placeholderTextColor={T.color.textFaint} />
        <Text style={s.label}>رمز عبور</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" style={[s.input, { textAlign: 'left' }]} placeholder="••••••••" placeholderTextColor={T.color.textFaint} onSubmitEditing={() => void signIn(email, password)} />
        <Button label={busy ? 'در حال اتصال…' : 'اتصال'} onPress={() => void signIn(email, password)} disabled={busy || !email.trim() || !password} />
        {Platform.OS === 'web' && <Text style={s.signInHint}>نسخهٔ وب: نشست در همین مرورگر ذخیره می‌شود.</Text>}
      </View>
    </ScrollView>
  );
}

export function SignOutButton() {
  const { signOut, busy } = useAdmin();
  return <Button variant="soft" tone="danger" icon={LogOut} label="قطع اتصال این دستگاه" onPress={() => void signOut()} disabled={busy} />;
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.color.canvas },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: T.color.canvas },
  sidebar: { width: 250, backgroundColor: T.color.sidebar, paddingHorizontal: 14, paddingBottom: 18, gap: 18 },
  brand: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingHorizontal: 6 },
  brandMark: { width: 38, height: 38, borderRadius: 11, backgroundColor: T.color.accent, alignItems: 'center', justifyContent: 'center' },
  brandTitle: { fontFamily: T.font.faStrong, fontSize: T.size.md, color: '#FFFFFF', textAlign: 'right' },
  brandSub: { fontFamily: T.font.fa, fontSize: T.size.xs, color: T.color.sidebarMuted, textAlign: 'right', maxWidth: 170 },
  navItem: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  navItemActive: { backgroundColor: T.color.sidebarActive },
  navText: { fontFamily: T.font.fa, fontSize: T.size.md, color: T.color.sidebarText, textAlign: 'right' },
  navTextActive: { fontFamily: T.font.faStrong, color: '#FFFFFF' },
  sidebarFoot: { fontFamily: T.font.fa, fontSize: T.size.xs, color: T.color.sidebarMuted, textAlign: 'right', paddingHorizontal: 6 },
  topbar: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 10, backgroundColor: T.color.surface, borderBottomWidth: 1, borderColor: T.color.border },
  topTitle: { fontFamily: T.font.faStrong, fontSize: T.size.lg, color: T.color.text, textAlign: 'right' },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row-reverse', backgroundColor: T.color.surface, borderTopWidth: 1, borderColor: T.color.border, paddingTop: 6, paddingHorizontal: 2 },
  bottomItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, paddingVertical: 4 },
  bottomText: { fontFamily: T.font.fa, fontSize: 10, color: T.color.textFaint },
  signInPage: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: T.color.canvas },
  signInCard: { width: '100%', maxWidth: 440, backgroundColor: T.color.surface, borderWidth: 1, borderColor: T.color.border, borderRadius: 16, padding: 24, gap: 10 },
  signInTitle: { fontFamily: T.font.faStrong, fontSize: T.size.xl, color: T.color.text, textAlign: 'right' },
  signInHint: { fontFamily: T.font.fa, fontSize: T.size.sm, color: T.color.textMuted, textAlign: 'right', lineHeight: 20 },
  label: { fontFamily: T.font.faStrong, fontSize: T.size.sm, color: T.color.textMuted, textAlign: 'right', marginTop: 6 },
  input: { fontFamily: T.font.fa, fontSize: T.size.md, color: T.color.text, backgroundColor: T.color.surfaceMuted, borderWidth: 1, borderColor: T.color.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
});
