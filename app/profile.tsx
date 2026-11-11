import { LocalizedText as Text, LocalizedTextInput as TextInput } from '@/components/LocalizedText';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useFocusEffect, useRouter } from 'expo-router';
import { BadgeCheck, BookOpenCheck, CalendarDays, ChevronLeft, Clock3, Cloud, Flame, Languages, LogOut, Mail, Pencil, RefreshCw, ShieldCheck, Sparkles, Trophy, X } from 'lucide-react-native';
import { PageNavigation } from '@/components/PageNavigation';
import { FEATURES } from '@/lib/features';
import { supabase } from '@/lib/supabase';
import { completeLearnerProfile, getRegisteredSession, registrationError, type RegistrationProfile } from '@/lib/userRegistration';
import { syncPersonalLearningData } from '@/lib/personalLearningSync';
import { loadLearnerProfileSummary, nameInitials, type LearnerProfileSummary } from '@/lib/learnerProfile';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';

const palette = {
  canvas: '#F7F2E8',
  paper: '#FFFCF6',
  ink: '#26382D',
  forest: '#31533B',
  sage: '#E8EBDD',
  muted: '#746E63',
  terracotta: '#B86F51',
  terracottaSoft: '#F4E2D6',
  border: '#E6DDCE',
  success: '#2F7D4F',
  danger: '#B3261E',
};

export default function ProfileScreen() {
  // The profile belongs to a registered learner; open builds have no account to show.
  if (!FEATURES.learnerLogin) return <Redirect href={'/languages' as never} />;
  return <ProfileEnabledScreen />;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  try {
    return date.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return fa(date.toISOString().slice(0, 10));
  }
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${fa(minutes)} دقیقه`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${fa(hours)} ساعت و ${fa(rest)} دقیقه` : `${fa(hours)} ساعت`;
}

function daysSince(value: string | null | undefined): number | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 86_400_000));
}

function ProfileEnabledScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<RegistrationProfile | null>(null);
  const [summary, setSummary] = useState<LearnerProfileSummary | null>(null);
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [{ profile: registered }, stats] = await Promise.all([getRegisteredSession(), loadLearnerProfileSummary()]);
      setProfile(registered);
      setSummary(stats);
      setError('');
    } catch (cause) {
      setError(registrationError(cause));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { void load(); }, [load]));
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(() => { void load(); });
    return () => data.subscription.unsubscribe();
  }, [load]);

  const startEditing = () => { setNameDraft(profile?.full_name ?? ''); setEditing(true); setNotice(''); setError(''); };

  const saveName = async () => {
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      await completeLearnerProfile(nameDraft);
      setEditing(false);
      setNotice('نام نمایشی به‌روزرسانی شد.');
      await load();
    } catch (cause) {
      setError(registrationError(cause));
    } finally {
      setSaving(false);
    }
  };

  const syncNow = async () => {
    if (syncing) return;
    setSyncing(true);
    setNotice('');
    setError('');
    try {
      const result = await syncPersonalLearningData();
      if (result.status === 'synced') {
        setLastSynced(result.updatedAt);
        setNotice('پیشرفت شما با حساب همگام شد.');
      } else {
        setNotice('برای همگام‌سازی ابتدا وارد حساب شوید.');
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'همگام‌سازی انجام نشد.');
    } finally {
      setSyncing(false);
    }
  };

  const confirmSignOut = () => {
    const run = async () => {
      setError('');
      const { error: authError } = await supabase.auth.signOut();
      if (authError) { setError('خروج از حساب انجام نشد. اتصال شبکه را بررسی کنید.'); return; }
      router.replace('/languages' as never);
    };
    if (Platform.OS === 'web') { if (typeof window === 'undefined' || window.confirm('از حساب خارج می‌شوید؟ پیشرفت محلی روی این دستگاه پاک نمی‌شود.')) void run(); return; }
    Alert.alert('خروج از حساب', 'از حساب خارج می‌شوید؟ پیشرفت محلی روی این دستگاه پاک نمی‌شود.', [
      { text: 'انصراف', style: 'cancel' },
      { text: 'خروج', style: 'destructive', onPress: () => void run() },
    ]);
  };

  const fullName = profile?.full_name?.trim() || '';
  const email = profile?.email || '';
  const initials = nameInitials(fullName, email);
  const memberDays = daysSince(profile?.registered_at);
  const level = summary?.level;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <LinearGradient colors={['#F7F2E8', '#F4EFE3', '#FBF8F1']} start={{ x: 0.95, y: 0 }} end={{ x: 0.05, y: 1 }} style={StyleSheet.absoluteFillObject} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.page}>
          <View style={styles.header}>
            <PageNavigation tone="light" backFallback="/languages" />
            <Text accessibilityRole="header" style={styles.pageTitle}>پروفایل من</Text>
          </View>

          {loading ? (
            <View style={styles.loading}><ActivityIndicator color={palette.forest} /><Text style={styles.loadingText}>در حال بارگذاری پروفایل…</Text></View>
          ) : !profile ? (
            <View style={styles.card}>
              <View style={styles.emptyIcon}><ShieldCheck size={26} color={palette.forest} /></View>
              <Text style={styles.cardTitle}>هنوز وارد حساب نشده‌اید</Text>
              <Text style={styles.cardText}>برای نمایش پروفایل، ثبت‌نام یا ورود با ایمیل را انجام دهید.</Text>
              <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={() => router.push('/personal-sync' as never)}>
                <Mail size={16} color="#FFFFFF" /><Text keepColor style={styles.primaryButtonText}>ورود یا ثبت‌نام</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* Identity */}
              <View style={styles.heroCard}>
                <LinearGradient colors={['#31533B', '#3F6A4B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
                <View style={styles.heroTop}>
                  <View style={styles.avatar}><Text keepColor style={styles.avatarText}>{initials}</Text></View>
                  <View style={styles.heroCopy}>
                    {editing ? (
                      <View style={styles.editRow}>
                        <TextInput
                          value={nameDraft}
                          onChangeText={setNameDraft}
                          placeholder="نام و نام خانوادگی"
                          placeholderTextColor="rgba(255,255,255,0.6)"
                          autoFocus
                          maxLength={80}
                          style={styles.nameInput}
                          onSubmitEditing={() => void saveName()}
                        />
                        <Pressable accessibilityRole="button" accessibilityLabel="ذخیرهٔ نام" disabled={saving} onPress={() => void saveName()} style={styles.editAction}>{saving ? <ActivityIndicator size="small" color="#FFFFFF" /> : <BadgeCheck size={18} color="#FFFFFF" />}</Pressable>
                        <Pressable accessibilityRole="button" accessibilityLabel="انصراف" disabled={saving} onPress={() => setEditing(false)} style={styles.editAction}><X size={18} color="#FFFFFF" /></Pressable>
                      </View>
                    ) : (
                      <Pressable accessibilityRole="button" accessibilityLabel="ویرایش نام" onPress={startEditing} style={styles.nameRow}>
                        <Text keepColor style={styles.heroName}>{fullName || 'زبان‌آموز'}</Text>
                        <Pencil size={14} color="rgba(255,255,255,0.85)" />
                      </Pressable>
                    )}
                    <View style={styles.emailRow}><Mail size={13} color="rgba(255,255,255,0.8)" /><Text keepColor style={styles.heroEmail}>{email}</Text></View>
                    <View style={styles.verifiedPill}><BadgeCheck size={13} color="#DDF3E4" /><Text keepColor style={styles.verifiedText}>حساب تأییدشده</Text></View>
                  </View>
                </View>
                <View style={styles.heroMeta}>
                  <View style={styles.heroMetaItem}><CalendarDays size={14} color="rgba(255,255,255,0.85)" /><Text keepColor style={styles.heroMetaText}>عضو از {formatDate(profile.registered_at)}</Text></View>
                  {memberDays !== null && <Text keepColor style={styles.heroMetaText}>{fa(memberDays)} روز همراه Milo</Text>}
                </View>
              </View>

              {!!notice && <Text style={styles.notice}>{notice}</Text>}
              {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}

              {/* Level */}
              {level && (
                <View style={styles.card}>
                  <View style={styles.cardHead}><Trophy size={18} color={palette.terracotta} /><Text style={styles.cardTitle}>سطح زبان‌آموز: {level.title}</Text></View>
                  <View style={styles.levelTrack}><View style={[styles.levelFill, { width: `${Math.round(level.progress * 100)}%` }]} /></View>
                  <Text style={styles.cardText}>{level.next ? `با تکمیل درس‌های بیشتر به سطح «${level.next}» می‌رسید.` : 'به بالاترین سطح رسیده‌اید؛ آفرین!'}</Text>
                </View>
              )}

              {/* Overview */}
              {summary && (
                <View style={styles.statsGrid}>
                  <StatTile icon={<BookOpenCheck size={18} color={palette.forest} />} value={fa(summary.completedLessons)} label="درس تکمیل‌شده" />
                  <StatTile icon={<Flame size={18} color={palette.terracotta} />} value={fa(summary.currentStreak)} label="روز پیاپی" hint={summary.longestStreak ? `رکورد: ${fa(summary.longestStreak)} روز` : undefined} />
                  <StatTile icon={<Clock3 size={18} color={palette.forest} />} value={formatMinutes(summary.totalMinutes)} label="زمان یادگیری" compact />
                  <StatTile icon={<Languages size={18} color={palette.forest} />} value={fa(summary.activeLanguages)} label="زبان فعال" hint={summary.reviewCards ? `${fa(summary.reviewCards)} کارت مرور` : undefined} />
                </View>
              )}

              {/* Per language */}
              {summary && summary.languages.length > 0 && (
                <View style={styles.card}>
                  <View style={styles.cardHead}><Sparkles size={18} color={palette.forest} /><Text style={styles.cardTitle}>مسیرهای یادگیری</Text></View>
                  {summary.languages.map(language => (
                    <Pressable key={language.id} accessibilityRole="button" accessibilityLabel={`ادامهٔ ${language.name}`} onPress={() => router.push(language.home as never)} style={({ pressed }) => [styles.languageRow, pressed && styles.pressed]}>
                      <View style={[styles.languageDot, { backgroundColor: language.accent }]} />
                      <View style={styles.languageCopy}>
                        <View style={styles.languageTitleRow}>
                          <Text style={styles.languageName}>{language.name}</Text>
                          <Text style={styles.languageNative}>{language.nativeName}</Text>
                        </View>
                        <View style={styles.languageTrack}><View style={[styles.languageFill, { width: `${language.percent}%`, backgroundColor: language.accent }]} /></View>
                        <Text style={styles.languageMeta}>{fa(language.completedLessons)} از {fa(language.totalLessons)} درس · {fa(language.percent)}٪{language.currentStreak ? ` · ${fa(language.currentStreak)} روز پیاپی` : ''}{language.totalMinutes ? ` · ${formatMinutes(language.totalMinutes)}` : ''}</Text>
                      </View>
                      <ChevronLeft size={18} color={palette.muted} />
                    </Pressable>
                  ))}
                </View>
              )}

              {/* Account */}
              <View style={styles.card}>
                <View style={styles.cardHead}><Cloud size={18} color={palette.forest} /><Text style={styles.cardTitle}>حساب و همگام‌سازی</Text></View>
                <Text style={styles.cardText}>پیشرفت شما به حساب ایمیلی‌تان وصل است و روی هر دستگاهی که وارد شوید ادامه پیدا می‌کند.</Text>
                <Pressable accessibilityRole="button" accessibilityState={{ disabled: syncing }} disabled={syncing} onPress={() => void syncNow()} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
                  {syncing ? <ActivityIndicator size="small" color="#FFFFFF" /> : <RefreshCw size={16} color="#FFFFFF" />}
                  <Text keepColor style={styles.primaryButtonText}>{syncing ? 'در حال همگام‌سازی…' : 'همگام‌سازی اکنون'}</Text>
                </Pressable>
                {!!lastSynced && <Text style={styles.cardHint}>آخرین تأیید سرور: {new Date(lastSynced).toLocaleString('fa-IR')}</Text>}
                <Pressable accessibilityRole="button" onPress={() => router.push('/personal-sync' as never)} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
                  <Mail size={16} color={palette.forest} /><Text style={styles.secondaryButtonText}>مدیریت ایمیل و ورود</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={confirmSignOut} style={({ pressed }) => [styles.dangerButton, pressed && styles.pressed]}>
                  <LogOut size={16} color={palette.danger} /><Text keepColor style={styles.dangerButtonText}>خروج از حساب</Text>
                </Pressable>
              </View>

              <View style={styles.privacyRow}>
                <ShieldCheck size={15} color={palette.muted} />
                <Text style={styles.privacyText}>فقط نام و ایمیل شما ذخیره می‌شود؛ محتوای تمرین‌ها خصوصی می‌ماند.</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function StatTile({ icon, value, label, hint, compact }: { icon: React.ReactNode; value: string; label: string; hint?: string; compact?: boolean }) {
  return (
    <View style={styles.statTile}>
      <View style={styles.statIcon}>{icon}</View>
      <Text style={[styles.statValue, compact && styles.statValueCompact]} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {hint ? <Text style={styles.statHint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.canvas },
  scroll: { paddingBottom: 48 },
  page: { width: '100%', maxWidth: 720, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 18, gap: 14 },
  header: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 4 },
  pageTitle: { fontFamily: Typography.fontFamily, fontSize: 24, lineHeight: 36, color: palette.ink, writingDirection: 'rtl' },
  loading: { paddingVertical: 60, alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 13, color: palette.muted },
  heroCard: { borderRadius: 24, padding: 18, overflow: 'hidden', gap: 14, shadowColor: '#1F3324', shadowOpacity: 0.18, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  heroTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 14 },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.55)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Typography.fontFamily, fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  heroCopy: { flex: 1, gap: 6, alignItems: 'flex-end' },
  nameRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  heroName: { fontFamily: Typography.fontFamily, fontSize: 21, lineHeight: 30, fontWeight: '800', color: '#FFFFFF', textAlign: 'right', writingDirection: 'rtl' },
  editRow: { width: '100%', flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  nameInput: { flex: 1, minHeight: 40, borderRadius: 12, paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.16)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', color: '#FFFFFF', fontFamily: Typography.fontFamily, fontSize: 15, textAlign: 'right', writingDirection: 'rtl' },
  editAction: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.18)' },
  emailRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  heroEmail: { fontFamily: Typography.latinFontFamily, fontSize: 13, color: 'rgba(255,255,255,0.9)', writingDirection: 'ltr' },
  verifiedPill: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.16)' },
  verifiedText: { fontFamily: Typography.fontFamily, fontSize: 11, color: '#DDF3E4' },
  heroMeta: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.22)', paddingTop: 12 },
  heroMetaItem: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  heroMetaText: { fontFamily: Typography.fontFamily, fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  notice: { fontSize: 13, color: palette.success, textAlign: 'center' },
  error: { fontSize: 13, color: palette.danger, textAlign: 'center' },
  card: { borderRadius: 20, padding: 16, gap: 10, backgroundColor: palette.paper, borderWidth: 1, borderColor: palette.border, shadowColor: '#514433', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  cardHead: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  cardTitle: { fontFamily: Typography.fontFamily, fontSize: 16, lineHeight: 26, fontWeight: '800', color: palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  cardText: { fontFamily: Typography.fontFamily, fontSize: 13, lineHeight: 22, color: palette.muted, textAlign: 'right', writingDirection: 'rtl' },
  cardHint: { fontSize: 11, color: palette.muted, textAlign: 'center' },
  emptyIcon: { alignSelf: 'center', width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.sage },
  levelTrack: { height: 10, borderRadius: 5, backgroundColor: palette.sage, overflow: 'hidden' },
  levelFill: { height: '100%', borderRadius: 5, backgroundColor: palette.terracotta },
  statsGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 10 },
  statTile: { flexBasis: '47%', flexGrow: 1, borderRadius: 18, padding: 14, gap: 4, alignItems: 'flex-end', backgroundColor: palette.paper, borderWidth: 1, borderColor: palette.border },
  statIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.sage, marginBottom: 4 },
  statValue: { fontFamily: Typography.fontFamily, fontSize: 24, lineHeight: 32, fontWeight: '800', color: palette.ink },
  statValueCompact: { fontSize: 17, lineHeight: 28 },
  statLabel: { fontFamily: Typography.fontFamily, fontSize: 12, color: palette.muted },
  statHint: { fontFamily: Typography.fontFamily, fontSize: 11, color: palette.terracotta },
  languageRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: palette.border },
  languageDot: { width: 12, height: 12, borderRadius: 6 },
  languageCopy: { flex: 1, gap: 6 },
  languageTitleRow: { flexDirection: 'row-reverse', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 },
  languageName: { fontFamily: Typography.fontFamily, fontSize: 15, fontWeight: '800', color: palette.ink },
  languageNative: { fontFamily: Typography.latinFontFamily, fontSize: 12, color: palette.muted, writingDirection: 'ltr' },
  languageTrack: { height: 6, borderRadius: 3, backgroundColor: palette.sage, overflow: 'hidden' },
  languageFill: { height: '100%', borderRadius: 3 },
  languageMeta: { fontFamily: Typography.fontFamily, fontSize: 11.5, color: palette.muted, textAlign: 'right', writingDirection: 'rtl' },
  primaryButton: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 46, borderRadius: 14, backgroundColor: palette.forest },
  primaryButtonText: { fontFamily: Typography.fontFamily, fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  secondaryButton: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, borderRadius: 14, backgroundColor: palette.sage },
  secondaryButtonText: { fontFamily: Typography.fontFamily, fontSize: 14, fontWeight: '700', color: palette.forest },
  dangerButton: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, borderRadius: 14, borderWidth: 1, borderColor: '#EAC7C3', backgroundColor: '#FFF7F6' },
  dangerButtonText: { fontFamily: Typography.fontFamily, fontSize: 14, fontWeight: '700', color: palette.danger },
  privacyRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, paddingHorizontal: 6 },
  privacyText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: 11.5, lineHeight: 19, color: palette.muted, textAlign: 'right', writingDirection: 'rtl' },
  pressed: { opacity: 0.85 },
});
