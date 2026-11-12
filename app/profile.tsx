import { LocalizedText as Text, LocalizedTextInput as TextInput } from '@/components/LocalizedText';
import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from '@/components/KeyboardRuntime';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Application from 'expo-application';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  Activity, Award, BadgeCheck, BookOpenCheck, Brain, CalendarDays, ChevronLeft, Clock3, Cloud, Download, Flame, Fingerprint,
  Languages, Layers, LogOut, Mail, Pencil, RefreshCw, Repeat, ShieldCheck, Smartphone, Sparkles, Target, Trophy, X,
} from 'lucide-react-native';
import { PageNavigation } from '@/components/PageNavigation';
import { FEATURES } from '@/lib/features';
import { supabase } from '@/lib/supabase';
import { completeLearnerProfile, getRegisteredSession, registrationError, type RegistrationProfile } from '@/lib/userRegistration';
import { syncPersonalLearningData } from '@/lib/personalLearningSync';
import { beginLocalProfile, clearLocalProfile, getLocalProfile, localProfileError, normalizeLocalCode, regenerateLocalCode, touchLocalProfile, updateLocalProfileName, verifyLocalProfile, type LocalProfile } from '@/lib/localProfile';
import { ensureOpenLearnerRegistered, registerOpenLearnerOnServer } from '@/lib/openLearnerAccount';
import { loadLearnerProfileSummary, nameInitials, type Achievement, type LanguageProfileStat, type LearnerProfileSummary } from '@/lib/learnerProfile';
import { toPersianDigits as fa, timeAgo } from '@/lib/format';
import { Typography } from '@/lib/theme';

const palette = {
  canvas: '#F7F2E8',
  paper: '#FFFCF6',
  ink: '#26382D',
  forest: '#31533B',
  forestSoft: '#E3ECE3',
  sage: '#E8EBDD',
  muted: '#746E63',
  terracotta: '#B86F51',
  terracottaSoft: '#F4E2D6',
  gold: '#B8892B',
  goldSoft: '#F6EBD2',
  border: '#E6DDCE',
  success: '#2F7D4F',
  danger: '#B3261E',
};

type Tab = 'overview' | 'languages' | 'achievements' | 'account';
const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'overview', label: 'نمای کلی' },
  { id: 'languages', label: 'زبان‌ها' },
  { id: 'achievements', label: 'دستاوردها' },
  { id: 'account', label: 'حساب' },
];

export default function ProfileScreen() {
  // Login builds use the registered Supabase account; open builds use a
  // device-local profile activated with an app-generated access code.
  return <ProfileEnabledScreen local={!FEATURES.learnerLogin} />;
}

function formatDate(value: string | null | undefined, withTime = false): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  try {
    return date.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric', ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}) });
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

function lastActiveLabel(key: string | null): string {
  if (!key) return 'هنوز شروع نشده';
  const [y, m, d] = key.split('-').map(Number);
  if (!y || !m || !d) return '—';
  const date = new Date(y, m - 1, d);
  const diff = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (diff <= 0) return 'امروز';
  if (diff === 1) return 'دیروز';
  return `${fa(diff)} روز پیش`;
}

function ProfileEnabledScreen({ local }: { local: boolean }) {
  const router = useRouter();
  const deviceAccount = local && FEATURES.openLearnerAccount;
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<RegistrationProfile | null>(null);
  const [localProfile, setLocalProfile] = useState<LocalProfile | null>(null);
  const [userId, setUserId] = useState('');
  const [lastSignIn, setLastSignIn] = useState<string | null>(null);
  const [summary, setSummary] = useState<LearnerProfileSummary | null>(null);
  const [tab, setTab] = useState<Tab>('overview');
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      if (local) {
        const [stored, stats] = await Promise.all([getLocalProfile(), loadLearnerProfileSummary()]);
        setLocalProfile(stored);
        if (stored?.verifiedAt) {
          setProfile({ user_id: 'local', full_name: stored.fullName, email: stored.email, registered_at: stored.createdAt, last_seen_at: stored.lastSeenAt });
          setLastSignIn(stored.verifiedAt);
          void touchLocalProfile();
          if (deviceAccount) {
            void ensureOpenLearnerRegistered().then(async () => {
              const { data } = await supabase.auth.getSession();
              setUserId(data.session?.user.id ?? '');
              setLocalProfile(await getLocalProfile());
            });
          }
        } else {
          setProfile(null);
        }
        setSummary(stats);
        setError('');
        return;
      }
      const [{ session, profile: registered }, stats] = await Promise.all([getRegisteredSession(), loadLearnerProfileSummary()]);
      setProfile(registered);
      setUserId(session?.user.id ?? '');
      setLastSignIn(session?.user.last_sign_in_at ?? null);
      setSummary(stats);
      setError('');
    } catch (cause) {
      setError(local ? localProfileError(cause) : registrationError(cause));
    } finally {
      setLoading(false);
    }
  }, [local, deviceAccount]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));
  useEffect(() => {
    if (local) return;
    const { data } = supabase.auth.onAuthStateChange(() => { void load(); });
    return () => data.subscription.unsubscribe();
  }, [load, local]);

  const startEditing = () => { setNameDraft(profile?.full_name ?? ''); setEditing(true); setNotice(''); setError(''); };

  const saveName = async () => {
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      if (local) { await updateLocalProfileName(nameDraft); if (deviceAccount) await registerOpenLearnerOnServer().catch(() => undefined); } else await completeLearnerProfile(nameDraft);
      setEditing(false);
      setNotice('نام نمایشی به‌روزرسانی شد.');
      await load();
    } catch (cause) {
      setError(local ? localProfileError(cause) : registrationError(cause));
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
      if (local) {
        await clearLocalProfile();
        setProfile(null);
        setLocalProfile(null);
        setTab('overview');
        return;
      }
      const { error: authError } = await supabase.auth.signOut();
      if (authError) { setError('خروج از حساب انجام نشد. اتصال شبکه را بررسی کنید.'); return; }
      router.replace('/languages' as never);
    };
    const message = 'از حساب خارج می‌شوید؟ پیشرفت محلی روی این دستگاه پاک نمی‌شود.';
    if (Platform.OS === 'web') { if (typeof window === 'undefined' || window.confirm(message)) void run(); return; }
    Alert.alert('خروج از حساب', message, [
      { text: 'انصراف', style: 'cancel' },
      { text: 'خروج', style: 'destructive', onPress: () => void run() },
    ]);
  };

  const fullName = profile?.full_name?.trim() || '';
  const email = profile?.email || '';
  const initials = nameInitials(fullName, email);
  const memberDays = daysSince(profile?.registered_at);
  const earnedCount = useMemo(() => summary?.achievements.filter(item => item.earned).length ?? 0, [summary]);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <LinearGradient colors={['#F7F2E8', '#F4EFE3', '#FBF8F1']} start={{ x: 0.95, y: 0 }} end={{ x: 0.05, y: 1 }} style={StyleSheet.absoluteFillObject} />
      </View>

      <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" bottomOffset={48}>
        <View style={styles.page}>
          <View style={styles.header}>
            <PageNavigation tone="light" backFallback="/languages" />
            <Text accessibilityRole="header" style={styles.pageTitle}>پروفایل من</Text>
          </View>

          {loading ? (
            <View style={styles.loading}><ActivityIndicator color={palette.forest} /><Text style={styles.loadingText}>در حال بارگذاری پروفایل…</Text></View>
          ) : !profile && local ? (
            <LocalProfileSetup
              pending={localProfile}
              onChanged={() => { setNotice(''); void load(); }}
              onVerified={() => {
                setNotice('پروفایل شما روی این دستگاه فعال شد.');
                if (deviceAccount) {
                  void registerOpenLearnerOnServer()
                    .then(result => { if (result === 'registered') setNotice('پروفایل فعال شد و در پنل مدیریت ثبت گردید.'); })
                    .catch(cause => setError(cause instanceof Error ? cause.message : 'ثبت در پنل مدیریت انجام نشد.'))
                    .finally(() => void load());
                } else {
                  void load();
                }
              }}
            />
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
              {/* ───── Identity ───── */}
              <View style={styles.heroCard}>
                <LinearGradient colors={['#2C4B35', '#3F6A4B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
                <View style={styles.heroTop}>
                  <View style={styles.avatarWrap}>
                    <View style={styles.avatar}><Text keepColor style={styles.avatarText}>{initials}</Text></View>
                    {summary && <View style={styles.avatarBadge}><Text keepColor style={styles.avatarBadgeText}>{summary.level.title}</Text></View>}
                  </View>
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
                        <View style={styles.pencil}><Pencil size={12} color="#FFFFFF" /></View>
                      </Pressable>
                    )}
                    <View style={styles.emailRow}><Mail size={13} color="rgba(255,255,255,0.8)" /><Text keepColor style={styles.heroEmail}>{email}</Text></View>
                    <View style={styles.pillRow}>
                      <View style={styles.verifiedPill}><BadgeCheck size={12} color="#DDF3E4" /><Text keepColor style={styles.verifiedText}>{local ? 'پروفایل فعال روی این دستگاه' : 'حساب تأییدشده'}</Text></View>
                      {memberDays !== null && <View style={styles.verifiedPill}><CalendarDays size={12} color="#DDF3E4" /><Text keepColor style={styles.verifiedText}>{fa(memberDays)} روز عضویت</Text></View>}
                    </View>
                  </View>
                </View>
                {summary && (
                  <View style={styles.heroStats}>
                    <HeroStat value={fa(summary.completedLessons)} label="درس" />
                    <View style={styles.heroDivider} />
                    <HeroStat value={fa(summary.currentStreak)} label="روز پیاپی" />
                    <View style={styles.heroDivider} />
                    <HeroStat value={formatMinutes(summary.totalMinutes)} label="تمرین" small />
                    <View style={styles.heroDivider} />
                    <HeroStat value={`${fa(earnedCount)}/${fa(summary.achievements.length)}`} label="نشان" />
                  </View>
                )}
              </View>

              {!!notice && <Text style={styles.notice}>{notice}</Text>}
              {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}

              {/* ───── Tabs ───── */}
              <View style={styles.tabBar}>
                {TABS.map(item => (
                  <Pressable key={item.id} accessibilityRole="tab" accessibilityState={{ selected: tab === item.id }} onPress={() => setTab(item.id)} style={[styles.tabItem, tab === item.id && styles.tabItemActive]}>
                    <Text keepColor={tab === item.id} style={[styles.tabText, tab === item.id && styles.tabTextActive]}>{item.label}</Text>
                  </Pressable>
                ))}
              </View>

              {summary && tab === 'overview' && <OverviewTab summary={summary} onReview={() => router.push('/languages' as never)} />}
              {summary && tab === 'languages' && <LanguagesTab summary={summary} onOpen={home => router.push(home as never)} />}
              {summary && tab === 'achievements' && <AchievementsTab achievements={summary.achievements} />}
              {tab === 'account' && (
                <AccountTab
                  local={local}
                  deviceAccount={deviceAccount}
                  serverRegisteredAt={localProfile?.serverRegisteredAt ?? null}
                  onRegister={() => {
                    setError(''); setNotice('');
                    void registerOpenLearnerOnServer()
                      .then(() => { setNotice('در پنل مدیریت ثبت شد.'); })
                      .catch(cause => setError(cause instanceof Error ? cause.message : 'ثبت انجام نشد.'))
                      .finally(() => void load());
                  }}
                  localCode={localProfile?.code ?? ''}
                  profile={profile}
                  userId={userId}
                  lastSignIn={lastSignIn}
                  lastSynced={lastSynced}
                  syncing={syncing}
                  onSync={() => void syncNow()}
                  onManage={() => router.push('/personal-sync' as never)}
                  onBackup={() => router.push('/lang/backup' as never)}
                  onSignOut={confirmSignOut}
                />
              )}
            </>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

/* ───────────────────────── Overview ───────────────────────── */

function OverviewTab({ summary, onReview }: { summary: LearnerProfileSummary; onReview: () => void }) {
  const goalPercent = Math.min(100, Math.round((summary.todayMinutes / Math.max(1, summary.dailyGoalMinutes)) * 100));
  const maxMinutes = Math.max(1, ...summary.week.map(day => day.minutes));
  const level = summary.level;
  return (
    <>
      <Section icon={<Target size={17} color={palette.terracotta} />} title="امروز">
        <View style={styles.todayRow}>
          <Ring percent={goalPercent} label={`${fa(goalPercent)}٪`} />
          <View style={styles.todayCopy}>
            <Text style={styles.todayTitle}>{fa(summary.todayMinutes)} از {fa(summary.dailyGoalMinutes)} دقیقهٔ هدف روزانه</Text>
            <Text style={styles.cardText}>{goalPercent >= 100 ? 'هدف امروز را کامل کردید؛ عالی!' : summary.todayMinutes > 0 ? `${fa(Math.max(0, summary.dailyGoalMinutes - summary.todayMinutes))} دقیقهٔ دیگر تا هدف امروز.` : 'هنوز امروز تمرین نکرده‌اید؛ با یک درس کوتاه شروع کنید.'}</Text>
            <View style={styles.inlineChips}>
              <Chip icon={<Repeat size={12} color={palette.forest} />} text={summary.reviewsDueNow ? `${fa(summary.reviewsDueNow)} مرور آماده` : 'مروری سررسید نشده'} tone={summary.reviewsDueNow ? 'warm' : 'calm'} />
              <Chip icon={<Flame size={12} color={palette.terracotta} />} text={summary.currentStreak ? `${fa(summary.currentStreak)} روز پیاپی` : 'زنجیرهٔ جدید از امروز'} tone="calm" />
            </View>
          </View>
        </View>
      </Section>

      <Section icon={<Trophy size={17} color={palette.gold} />} title={`سطح زبان‌آموز: ${level.title}`} subtitle={`مرحلهٔ ${fa(level.index + 1)} از ${fa(level.total)}`}>
        <View style={styles.levelSteps}>
          {Array.from({ length: level.total }).map((_, i) => <View key={i} style={[styles.levelStep, i < level.index && styles.levelStepDone, i === level.index && styles.levelStepActive]} />)}
        </View>
        <View style={styles.levelTrack}><View style={[styles.levelFill, { width: `${Math.round(level.progress * 100)}%` }]} /></View>
        <Text style={styles.cardText}>{level.next ? `${fa(level.remaining)} درس دیگر تا سطح «${level.next}».` : 'به بالاترین سطح رسیده‌اید؛ آفرین!'}</Text>
      </Section>

      <Section icon={<Activity size={17} color={palette.forest} />} title="فعالیت هفتهٔ اخیر" subtitle={`${formatMinutes(summary.weekMinutes)} · ${fa(summary.activeDaysLast30)} روز فعال در ۳۰ روز گذشته`}>
        <View style={styles.chart}>
          {summary.week.map(day => (
            <View key={day.key} style={styles.chartCol}>
              <Text style={styles.chartValue}>{day.minutes ? fa(day.minutes) : ''}</Text>
              <View style={styles.chartBarTrack}>
                <View style={[styles.chartBar, { height: `${Math.max(day.minutes ? 8 : 2, Math.round((day.minutes / maxMinutes) * 100))}%` }, day.isToday && styles.chartBarToday]} />
              </View>
              <Text style={[styles.chartDay, day.isToday && styles.chartDayToday]}>{day.weekdayShort}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.cardHint}>دقیقه‌های اندازه‌گیری‌شدهٔ تمرین در هر روز</Text>
      </Section>

      <View style={styles.statsGrid}>
        <StatTile icon={<BookOpenCheck size={18} color={palette.forest} />} value={fa(summary.completedLessons)} label="درس تکمیل‌شده" hint={`از ${fa(summary.totalLessons)} درس`} />
        <StatTile icon={<Flame size={18} color={palette.terracotta} />} value={fa(summary.currentStreak)} label="روز پیاپی" hint={`رکورد: ${fa(summary.longestStreak)} روز`} />
        <StatTile icon={<Clock3 size={18} color={palette.forest} />} value={formatMinutes(summary.totalMinutes)} label="زمان کل یادگیری" compact />
        <StatTile icon={<Languages size={18} color={palette.forest} />} value={fa(summary.activeLanguages)} label="زبان فعال" hint={`از ${fa(summary.languages.length)} زبان`} />
        <StatTile icon={<Repeat size={18} color={palette.forest} />} value={fa(summary.reviewsTotal)} label="کارت مرور" hint={`${fa(summary.reviewsMastered)} در حافظهٔ بلندمدت`} />
        <StatTile icon={<Brain size={18} color={palette.terracotta} />} value={fa(summary.vocabulary.seen)} label="واژهٔ انگلیسی دیده‌شده" hint={`${fa(summary.vocabulary.mastered)} واژهٔ تثبیت‌شده`} />
      </View>

      {summary.reviewsDueNow > 0 && (
        <Pressable accessibilityRole="button" onPress={onReview} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
          <Repeat size={16} color="#FFFFFF" /><Text keepColor style={styles.primaryButtonText}>شروع {fa(summary.reviewsDueNow)} مرور آماده</Text>
        </Pressable>
      )}
    </>
  );
}

/* ───────────────────────── Languages ───────────────────────── */

function LanguagesTab({ summary, onOpen }: { summary: LearnerProfileSummary; onOpen: (home: string) => void }) {
  const ordered = [...summary.languages].sort((a, b) => Number(b.started) - Number(a.started) || b.completedLessons - a.completedLessons);
  return (
    <>
      {ordered.map(language => <LanguageCard key={language.id} language={language} onOpen={() => onOpen(language.home)} />)}
    </>
  );
}

function LanguageCard({ language, onOpen }: { language: LanguageProfileStat; onOpen: () => void }) {
  const [expanded, setExpanded] = useState(language.started);
  const r = language.reviews;
  return (
    <View style={styles.card}>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded }} onPress={() => setExpanded(v => !v)} style={styles.langHead}>
        <View style={[styles.langBadge, { backgroundColor: language.accent }]}><Text keepColor style={styles.langBadgeText}>{language.nativeName.slice(0, 2)}</Text></View>
        <View style={styles.langHeadCopy}>
          <View style={styles.langTitleRow}>
            <Text style={styles.langName}>{language.name}</Text>
            <Text style={styles.langNative}>{language.nativeName}</Text>
          </View>
          <View style={styles.languageTrack}><View style={[styles.languageFill, { width: `${language.percent}%`, backgroundColor: language.accent }]} /></View>
          <Text style={styles.languageMeta}>{fa(language.completedLessons)} از {fa(language.totalLessons)} درس · {fa(language.percent)}٪ · {language.started ? `آخرین فعالیت: ${lastActiveLabel(language.lastActiveDate)}` : 'هنوز شروع نشده'}</Text>
        </View>
        <ChevronLeft size={18} color={palette.muted} style={expanded ? styles.chevronOpen : undefined} />
      </Pressable>

      {expanded && (
        <View style={styles.langBody}>
          <View style={styles.kvGrid}>
            <KeyValue label="سطح فعلی" value={language.currentLevelCefr ? `${language.currentLevelTitle} · ${language.currentLevelCefr}` : '—'} />
            <KeyValue label="درس جاری" value={language.currentLessonTitle || '—'} />
            <KeyValue label="زنجیرهٔ فعلی" value={`${fa(language.currentStreak)} روز`} />
            <KeyValue label="بهترین زنجیره" value={`${fa(language.longestStreak)} روز`} />
            <KeyValue label="زمان تمرین" value={formatMinutes(language.totalMinutes)} />
            <KeyValue label="امروز" value={`${fa(language.todayMinutes)} از ${fa(language.dailyGoalMinutes)} دقیقه`} />
          </View>

          <Text style={styles.subheading}>پیشرفت بر اساس سطح</Text>
          {language.levels.map(level => (
            <View key={level.id} style={styles.levelRow}>
              <View style={[styles.levelDot, level.state === 'done' && styles.levelDotDone, level.state === 'active' && { backgroundColor: language.accent, borderColor: language.accent }]} />
              <View style={styles.levelCopy}>
                <View style={styles.levelTitleRow}>
                  <Text style={styles.levelTitle}>{level.title}</Text>
                  <Text style={styles.levelCefr}>{level.cefr}</Text>
                </View>
                <View style={styles.levelMiniTrack}><View style={[styles.levelMiniFill, { width: `${level.percent}%`, backgroundColor: level.state === 'done' ? palette.success : language.accent }]} /></View>
              </View>
              <Text style={styles.levelCount}>{fa(level.completed)}/{fa(level.total)}</Text>
            </View>
          ))}

          <Text style={styles.subheading}>وضعیت مرور فاصله‌دار</Text>
          {r.total === 0 ? (
            <Text style={styles.cardText}>هنوز کارتی برای مرور ساخته نشده است؛ با تکمیل درس‌ها، جمله‌ها وارد چرخهٔ مرور می‌شوند.</Text>
          ) : (
            <>
              <View style={styles.reviewBar}>
                {r.learning > 0 && <View style={[styles.reviewSeg, { flex: r.learning, backgroundColor: '#D9A066' }]} />}
                {r.maturing > 0 && <View style={[styles.reviewSeg, { flex: r.maturing, backgroundColor: '#8FB27A' }]} />}
                {r.mastered > 0 && <View style={[styles.reviewSeg, { flex: r.mastered, backgroundColor: palette.success }]} />}
              </View>
              <View style={styles.legendRow}>
                <Legend color="#D9A066" text={`در حال یادگیری ${fa(r.learning)}`} />
                <Legend color="#8FB27A" text={`در حال تثبیت ${fa(r.maturing)}`} />
                <Legend color={palette.success} text={`بلندمدت ${fa(r.mastered)}`} />
              </View>
              <View style={styles.kvGrid}>
                <KeyValue label="آمادهٔ مرور" value={fa(r.dueNow)} highlight={r.dueNow > 0} />
                <KeyValue label="سررسید تا پایان امروز" value={fa(r.dueToday)} />
                <KeyValue label="فراموشی‌های ثبت‌شده" value={fa(r.lapses)} />
                <KeyValue label="آخرین مرور" value={r.lastReviewedAt ? timeAgo(r.lastReviewedAt) : '—'} />
              </View>
            </>
          )}

          <Pressable accessibilityRole="button" onPress={onOpen} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>{language.started ? `ادامهٔ ${language.name}` : `شروع ${language.name}`}</Text>
            <ChevronLeft size={16} color={palette.forest} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

/* ───────────────────────── Achievements ───────────────────────── */

function AchievementsTab({ achievements }: { achievements: Achievement[] }) {
  const earned = achievements.filter(a => a.earned);
  const pending = achievements.filter(a => !a.earned).sort((a, b) => b.progress - a.progress);
  return (
    <>
      <Section icon={<Award size={17} color={palette.gold} />} title={`نشان‌های کسب‌شده (${fa(earned.length)})`}>
        {earned.length === 0 ? <Text style={styles.cardText}>با تکمیل اولین درس، نخستین نشان را می‌گیرید.</Text> : (
          <View style={styles.badgeGrid}>
            {earned.map(a => (
              <View key={a.id} style={[styles.badge, styles.badgeEarned]}>
                <View style={styles.badgeIcon}><Award size={18} color={palette.gold} /></View>
                <Text style={styles.badgeTitle}>{a.title}</Text>
                <Text style={styles.badgeDesc}>{a.description}</Text>
              </View>
            ))}
          </View>
        )}
      </Section>
      <Section icon={<Sparkles size={17} color={palette.forest} />} title={`در مسیر (${fa(pending.length)})`}>
        {pending.map(a => (
          <View key={a.id} style={styles.pendingRow}>
            <View style={styles.pendingCopy}>
              <View style={styles.pendingTitleRow}>
                <Text style={styles.pendingTitle}>{a.title}</Text>
                <Text style={styles.pendingDetail}>{fa(a.detail)}</Text>
              </View>
              <View style={styles.levelMiniTrack}><View style={[styles.levelMiniFill, { width: `${Math.round(a.progress * 100)}%`, backgroundColor: palette.terracotta }]} /></View>
              <Text style={styles.pendingDesc}>{a.description}</Text>
            </View>
          </View>
        ))}
      </Section>
    </>
  );
}

/* ───────────────────────── Account ───────────────────────── */

function AccountTab({ local, deviceAccount, serverRegisteredAt, onRegister, localCode, profile, userId, lastSignIn, lastSynced, syncing, onSync, onManage, onBackup, onSignOut }: {
  local: boolean; deviceAccount: boolean; serverRegisteredAt: string | null; onRegister: () => void; localCode: string; profile: RegistrationProfile; userId: string; lastSignIn: string | null; lastSynced: string; syncing: boolean;
  onSync: () => void; onManage: () => void; onBackup: () => void; onSignOut: () => void;
}) {
  const appVersion = Application.nativeApplicationVersion || '1.0.0';
  const buildVersion = Application.nativeBuildVersion || '';
  return (
    <>
      <Section icon={<Fingerprint size={17} color={palette.forest} />} title="مشخصات حساب">
        <KeyValueList rows={local ? [
          ['نام نمایشی', profile.full_name || '—'],
          ['ایمیل', profile.email, true],
          ['تاریخ ساخت پروفایل', formatDate(profile.registered_at)],
          ['فعال‌سازی', lastSignIn ? formatDate(lastSignIn, true) : '—'],
          ['آخرین فعالیت', profile.last_seen_at ? timeAgo(profile.last_seen_at) : '—'],
          ['کد ورود این دستگاه', localCode ? fa(localCode) : '—', true],
          ...(deviceAccount ? [['شناسهٔ دستگاه', userId ? `${userId.slice(0, 8)}…${userId.slice(-4)}` : 'در انتظار اتصال', true] as [string, string, boolean]] : []),
        ] : [
          ['نام نمایشی', profile.full_name || '—'],
          ['ایمیل', profile.email, true],
          ['تاریخ ثبت‌نام', formatDate(profile.registered_at)],
          ['آخرین ورود', lastSignIn ? formatDate(lastSignIn, true) : '—'],
          ['آخرین فعالیت ثبت‌شده', profile.last_seen_at ? timeAgo(profile.last_seen_at) : '—'],
          ['شناسهٔ کاربر', userId ? `${userId.slice(0, 8)}…${userId.slice(-4)}` : '—', true],
        ]} />
      </Section>

      {deviceAccount && (
        <Section icon={<BadgeCheck size={17} color={palette.forest} />} title="ثبت در پنل مدیریت" subtitle="نام و ایمیل شما برای مدیر برنامه قابل مشاهده است؛ کد ورود هرگز ارسال نمی‌شود.">
          <KeyValueList rows={[
            ['وضعیت', serverRegisteredAt ? 'ثبت‌شده' : 'هنوز ثبت نشده'],
            ['زمان ثبت', serverRegisteredAt ? formatDate(serverRegisteredAt, true) : '—'],
          ]} />
          {!serverRegisteredAt && (
            <Pressable accessibilityRole="button" onPress={onRegister} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
              <RefreshCw size={16} color={palette.forest} /><Text style={styles.secondaryButtonText}>تلاش دوباره برای ثبت</Text>
            </Pressable>
          )}
        </Section>
      )}

      {local && !deviceAccount ? (
        <Section icon={<Smartphone size={17} color={palette.forest} />} title="ذخیرهٔ محلی" subtitle="این پروفایل و پیشرفت شما فقط روی همین دستگاه نگهداری می‌شود و هیچ داده‌ای به سرور فرستاده نمی‌شود.">
          <KeyValueList rows={[
            ['وضعیت', 'فعال روی این دستگاه'],
            ['کد ورود', 'توسط برنامه به‌صورت تصادفی ساخته شده؛ برای ورود دوباره روی همین دستگاه لازم است'],
            ['پشتیبان', 'برای انتقال پیشرفت به دستگاه دیگر از پشتیبان محلی استفاده کنید'],
          ]} />
        </Section>
      ) : (
      <Section icon={<Cloud size={17} color={palette.forest} />} title="همگام‌سازی ابری" subtitle="پیشرفت شما به حساب ایمیلی‌تان وصل است و روی هر دستگاهی که وارد شوید ادامه پیدا می‌کند.">
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: syncing }} disabled={syncing} onPress={onSync} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
          {syncing ? <ActivityIndicator size="small" color="#FFFFFF" /> : <RefreshCw size={16} color="#FFFFFF" />}
          <Text keepColor style={styles.primaryButtonText}>{syncing ? 'در حال همگام‌سازی…' : 'همگام‌سازی اکنون'}</Text>
        </Pressable>
        <KeyValueList rows={[
          ['وضعیت', lastSynced ? 'همگام' : 'آمادهٔ همگام‌سازی'],
          ['آخرین تأیید سرور', lastSynced ? formatDate(lastSynced, true) : 'در این نشست انجام نشده'],
          ['محتوای همگام‌شده', 'پیشرفت درس‌ها، کارت‌های مرور و زمان تمرین انگلیسی'],
          ...(deviceAccount ? [['دامنهٔ همگام‌سازی', 'پشتیبان ابری همین دستگاه؛ برای انتقال به دستگاه دیگر از پشتیبان محلی استفاده کنید'] as [string, string]] : []),
        ]} />
      </Section>
      )}

      <Section icon={<Smartphone size={17} color={palette.forest} />} title="دستگاه و نسخه">
        <KeyValueList rows={[
          ['سیستم‌عامل', Platform.OS === 'android' ? 'Android' : Platform.OS === 'ios' ? 'iOS' : 'Web', true],
          ['نسخهٔ برنامه', buildVersion ? `${appVersion} (${buildVersion})` : appVersion, true],
          ['ذخیرهٔ محلی', 'فعال؛ پیشرفت بدون اینترنت هم ثبت می‌شود'],
        ]} />
      </Section>

      <Section icon={<ShieldCheck size={17} color={palette.forest} />} title="مدیریت و امنیت">
        {!local && <ActionRow icon={<Mail size={16} color={palette.forest} />} title="مدیریت ایمیل و ورود" subtitle="تغییر ایمیل، دریافت کد تازه" onPress={onManage} />}
        <ActionRow icon={<Download size={16} color={palette.forest} />} title="پشتیبان محلی پیشرفت" subtitle="ذخیره و بازیابی فایل پشتیبان" onPress={onBackup} />
        <ActionRow icon={<Layers size={16} color={palette.forest} />} title="حریم خصوصی" subtitle="فقط نام و ایمیل ذخیره می‌شود؛ محتوای تمرین‌ها خصوصی می‌ماند" />
        <Pressable accessibilityRole="button" onPress={onSignOut} style={({ pressed }) => [styles.dangerButton, pressed && styles.pressed]}>
          <LogOut size={16} color={palette.danger} /><Text keepColor style={styles.dangerButtonText}>{local ? 'خروج از پروفایل' : 'خروج از حساب'}</Text>
        </Pressable>
        <Text style={styles.cardHint}>{local ? 'با خروج، پروفایل این دستگاه حذف می‌شود ولی پیشرفت یادگیری می‌ماند.' : 'با خروج، پیشرفت محلی روی این دستگاه پاک نمی‌شود.'}</Text>
      </Section>
    </>
  );
}

/* ───────────────────────── Local profile (no-login builds) ───────────────────────── */

function LocalProfileSetup({ pending, onChanged, onVerified }: { pending: LocalProfile | null; onChanged: () => void; onVerified: () => void }) {
  const [name, setName] = useState(pending?.fullName ?? '');
  const [email, setEmail] = useState(pending?.email ?? '');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState(false);
  const step: 'details' | 'code' = pending && !pending.verifiedAt ? 'code' : 'details';

  const createCode = async () => {
    if (busy) return;
    setBusy(true); setError('');
    try {
      await beginLocalProfile(name, email);
      setCode('');
      setRevealed(true);
      onChanged();
    } catch (cause) {
      setError(localProfileError(cause));
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    if (busy) return;
    setBusy(true); setError('');
    try {
      await verifyLocalProfile(code);
      onVerified();
    } catch (cause) {
      setError(localProfileError(cause));
    } finally {
      setBusy(false);
    }
  };

  const regenerate = async () => {
    if (busy) return;
    setBusy(true); setError('');
    try { await regenerateLocalCode(); setCode(''); setRevealed(true); onChanged(); } finally { setBusy(false); }
  };

  const restart = async () => {
    if (busy) return;
    setBusy(true); setError('');
    try { await clearLocalProfile(); setRevealed(false); onChanged(); } finally { setBusy(false); }
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.stepRow}>
          <StepDot index={1} active={step === 'details'} done={step === 'code'} label="ایمیل" />
          <View style={[styles.stepLine, step === 'code' && styles.stepLineDone]} />
          <StepDot index={2} active={step === 'code'} done={false} label="کد ورود" />
        </View>

        {step === 'details' ? (
          <>
            <View style={styles.emptyIcon}><Fingerprint size={26} color={palette.forest} /></View>
            <Text style={styles.cardTitle}>ساخت پروفایل روی این دستگاه</Text>
            <Text style={styles.cardText}>نام و ایمیل خود را وارد کنید. برنامه همین‌جا یک کد ورود تصادفی برای شما می‌سازد؛ هیچ ایمیلی ارسال نمی‌شود و اطلاعات از دستگاه خارج نمی‌شود.</Text>
            <TextInput value={name} onChangeText={setName} placeholder="نام و نام خانوادگی" placeholderTextColor="#A39C90" maxLength={80} style={styles.fieldInput} />
            <TextInput value={email} onChangeText={setEmail} placeholder="example@email.com" placeholderTextColor="#A39C90" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={[styles.fieldInput, styles.fieldInputLtr]} />
            {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
            <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy }} disabled={busy} onPress={() => void createCode()} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
              {busy ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Sparkles size={16} color="#FFFFFF" />}
              <Text keepColor style={styles.primaryButtonText}>ساخت کد ورود</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.cardTitle}>کد ورود شما</Text>
            <Text style={styles.cardText}>این کد توسط برنامه برای <Text style={styles.cardTextStrong}>{pending?.email}</Text> ساخته شد. آن را یادداشت کنید و برای فعال‌سازی پروفایل در کادر پایین وارد کنید.</Text>
            <Pressable accessibilityRole="button" onPress={() => setRevealed(v => !v)} style={styles.codeBox}>
              <Text keepColor style={styles.codeText}>{revealed ? fa(pending?.code ?? '') : '• • • • • •'}</Text>
              <Text style={styles.codeHint}>{revealed ? 'برای پنهان‌کردن لمس کنید' : 'برای نمایش کد لمس کنید'}</Text>
            </Pressable>
            <TextInput value={code} onChangeText={value => setCode(normalizeLocalCode(value))} placeholder="کد ۶ رقمی" placeholderTextColor="#A39C90" keyboardType="number-pad" maxLength={6} style={[styles.fieldInput, styles.codeInput]} onSubmitEditing={() => void verify()} />
            {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
            <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy || code.length !== 6 }} disabled={busy || code.length !== 6} onPress={() => void verify()} style={({ pressed }) => [styles.primaryButton, (busy || code.length !== 6) && styles.buttonDisabled, pressed && styles.pressed]}>
              {busy ? <ActivityIndicator size="small" color="#FFFFFF" /> : <BadgeCheck size={16} color="#FFFFFF" />}
              <Text keepColor style={styles.primaryButtonText}>فعال‌سازی پروفایل</Text>
            </Pressable>
            <View style={styles.inlineActions}>
              <Pressable accessibilityRole="button" disabled={busy} onPress={() => void regenerate()} style={({ pressed }) => [styles.secondaryButton, styles.inlineAction, pressed && styles.pressed]}>
                <RefreshCw size={15} color={palette.forest} /><Text style={styles.secondaryButtonText}>کد تازه</Text>
              </Pressable>
              <Pressable accessibilityRole="button" disabled={busy} onPress={() => void restart()} style={({ pressed }) => [styles.secondaryButton, styles.inlineAction, pressed && styles.pressed]}>
                <Pencil size={15} color={palette.forest} /><Text style={styles.secondaryButtonText}>ویرایش ایمیل</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
      <View style={styles.privacyRow}>
        <ShieldCheck size={15} color={palette.muted} />
        <Text style={styles.privacyText}>پروفایل محلی است: بدون ثبت‌نام آنلاین، بدون ارسال ایمیل. پیشرفت یادگیری شما مستقل از این پروفایل ذخیره می‌شود.</Text>
      </View>
    </>
  );
}

function StepDot({ index, active, done, label }: { index: number; active: boolean; done: boolean; label: string }) {
  return (
    <View style={styles.stepItem}>
      <View style={[styles.stepDot, active && styles.stepDotActive, done && styles.stepDotDone]}>
        {done ? <BadgeCheck size={14} color="#FFFFFF" /> : <Text keepColor style={[styles.stepDotText, (active || done) && styles.stepDotTextActive]}>{fa(index)}</Text>}
      </View>
      <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
    </View>
  );
}

/* ───────────────────────── Building blocks ───────────────────────── */

function Section({ icon, title, subtitle, children }: { icon: ReactNode; title: string; subtitle?: string; children: ReactNode }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <View style={styles.cardHeadIcon}>{icon}</View>
        <View style={styles.cardHeadCopy}>
          <Text style={styles.cardTitle}>{title}</Text>
          {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {children}
    </View>
  );
}

function HeroStat({ value, label, small }: { value: string; label: string; small?: boolean }) {
  return (
    <View style={styles.heroStat}>
      <Text keepColor style={[styles.heroStatValue, small && styles.heroStatValueSmall]} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text keepColor style={styles.heroStatLabel}>{label}</Text>
    </View>
  );
}

function Ring({ percent, label }: { percent: number; label: string }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <View style={styles.goalMeter}>
      <Text style={styles.ringLabel}>{label}</Text>
      <Text style={styles.ringCaption}>هدف امروز</Text>
      <View style={styles.goalTrack}><View style={[styles.goalFill, { width: `${clamped}%` }, clamped >= 100 && styles.goalFillDone]} /></View>
    </View>
  );
}

function Chip({ icon, text, tone }: { icon: ReactNode; text: string; tone: 'warm' | 'calm' }) {
  return <View style={[styles.chip, tone === 'warm' && styles.chipWarm]}>{icon}<Text style={styles.chipText}>{text}</Text></View>;
}

function Legend({ color, text }: { color: string; text: string }) {
  return <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: color }]} /><Text style={styles.legendText}>{text}</Text></View>;
}

function KeyValue({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.kv}>
      <Text style={styles.kvLabel}>{label}</Text>
      <Text style={[styles.kvValue, highlight && styles.kvValueHighlight]} numberOfLines={2}>{value}</Text>
    </View>
  );
}

function KeyValueList({ rows }: { rows: Array<[string, string, boolean?]> }) {
  return (
    <View style={styles.kvList}>
      {rows.map(([label, value, ltr], index) => (
        <View key={label} style={[styles.kvListRow, index > 0 && styles.kvListRowBorder]}>
          <Text style={styles.kvListLabel}>{label}</Text>
          <Text style={[styles.kvListValue, ltr && styles.kvListValueLtr]} numberOfLines={2}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

function ActionRow({ icon, title, subtitle, onPress }: { icon: ReactNode; title: string; subtitle?: string; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole={onPress ? 'button' : undefined} disabled={!onPress} onPress={onPress} style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}>
      <View style={styles.actionIcon}>{icon}</View>
      <View style={styles.actionCopy}>
        <Text style={styles.actionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.actionSubtitle}>{subtitle}</Text> : null}
      </View>
      {onPress ? <ChevronLeft size={17} color={palette.muted} /> : null}
    </Pressable>
  );
}

function StatTile({ icon, value, label, hint, compact }: { icon: ReactNode; value: string; label: string; hint?: string; compact?: boolean }) {
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
  scroll: { paddingBottom: 56 },
  page: { width: '100%', maxWidth: 720, alignSelf: 'center', paddingHorizontal: 18, paddingTop: 18, gap: 14 },
  header: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 2 },
  pageTitle: { fontFamily: Typography.fontFamily, fontSize: 24, lineHeight: 36, color: palette.ink, writingDirection: 'rtl' },
  loading: { paddingVertical: 60, alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 13, color: palette.muted },

  heroCard: { borderRadius: 24, padding: 18, overflow: 'hidden', gap: 16, shadowColor: '#1F3324', shadowOpacity: 0.2, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  heroTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 14 },
  avatarWrap: { alignItems: 'center', gap: 6 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Typography.fontFamily, fontSize: 26, fontWeight: '800', color: '#FFFFFF' },
  avatarBadge: { paddingHorizontal: 9, paddingVertical: 2, borderRadius: 999, backgroundColor: palette.goldSoft },
  avatarBadgeText: { fontFamily: Typography.fontFamily, fontSize: 10.5, fontWeight: '800', color: '#6F4F10' },
  heroCopy: { flex: 1, gap: 6, alignItems: 'flex-end' },
  nameRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  heroName: { fontFamily: Typography.fontFamily, fontSize: 21, lineHeight: 30, fontWeight: '800', color: '#FFFFFF', textAlign: 'right', writingDirection: 'rtl' },
  pencil: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.18)' },
  editRow: { width: '100%', flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  nameInput: { flex: 1, minHeight: 40, borderRadius: 12, paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.16)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', color: '#FFFFFF', fontFamily: Typography.fontFamily, fontSize: 15, textAlign: 'right', writingDirection: 'rtl' },
  editAction: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.18)' },
  emailRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  heroEmail: { fontFamily: Typography.latinFontFamily, fontSize: 13, color: 'rgba(255,255,255,0.92)', writingDirection: 'ltr' },
  pillRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6 },
  verifiedPill: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.16)' },
  verifiedText: { fontFamily: Typography.fontFamily, fontSize: 11, color: '#DDF3E4' },
  heroStats: { flexDirection: 'row-reverse', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.22)', paddingTop: 12 },
  heroStat: { flex: 1, alignItems: 'center', gap: 2 },
  heroStatValue: { fontFamily: Typography.fontFamily, fontSize: 18, lineHeight: 26, fontWeight: '800', color: '#FFFFFF' },
  heroStatValueSmall: { fontSize: 13 },
  heroStatLabel: { fontFamily: Typography.fontFamily, fontSize: 11, color: 'rgba(255,255,255,0.85)' },
  heroDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.22)' },

  notice: { fontSize: 13, color: palette.success, textAlign: 'center' },
  error: { fontSize: 13, color: palette.danger, textAlign: 'center' },

  tabBar: { flexDirection: 'row-reverse', padding: 4, borderRadius: 16, backgroundColor: '#EEE8DB', borderWidth: 1, borderColor: palette.border },
  tabItem: { flex: 1, minHeight: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tabItemActive: { backgroundColor: palette.forest },
  tabText: { fontFamily: Typography.fontFamily, fontSize: 13, color: palette.muted },
  tabTextActive: { color: '#FFFFFF', fontWeight: '800' },

  card: { borderRadius: 20, padding: 16, gap: 12, backgroundColor: palette.paper, borderWidth: 1, borderColor: palette.border, shadowColor: '#514433', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  cardHead: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  cardHeadIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.sage },
  cardHeadCopy: { flex: 1, gap: 2 },
  cardTitle: { fontFamily: Typography.fontFamily, fontSize: 15.5, lineHeight: 25, fontWeight: '800', color: palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  cardSubtitle: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 19, color: palette.muted, textAlign: 'right', writingDirection: 'rtl' },
  cardText: { fontFamily: Typography.fontFamily, fontSize: 13, lineHeight: 22, color: palette.muted, textAlign: 'right', writingDirection: 'rtl' },
  cardHint: { fontSize: 11, color: palette.muted, textAlign: 'center' },
  subheading: { fontFamily: Typography.fontFamily, fontSize: 13.5, fontWeight: '800', color: palette.ink, textAlign: 'right', writingDirection: 'rtl', marginTop: 4 },
  emptyIcon: { alignSelf: 'center', width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.sage },

  todayRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 16 },
  todayCopy: { flex: 1, gap: 6, alignItems: 'flex-end' },
  todayTitle: { fontFamily: Typography.fontFamily, fontSize: 14.5, lineHeight: 24, fontWeight: '800', color: palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  inlineChips: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  chip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, backgroundColor: palette.sage },
  chipWarm: { backgroundColor: palette.terracottaSoft },
  chipText: { fontFamily: Typography.fontFamily, fontSize: 11.5, color: palette.ink },

  goalMeter: { width: 112, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 10, alignItems: 'center', gap: 4, backgroundColor: palette.terracottaSoft, borderWidth: 1, borderColor: '#EBD2C3' },
  goalTrack: { width: '100%', height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.7)', overflow: 'hidden', marginTop: 4 },
  goalFill: { height: '100%', borderRadius: 4, backgroundColor: palette.terracotta },
  goalFillDone: { backgroundColor: palette.success },
  ringLabel: { fontFamily: Typography.fontFamily, fontSize: 22, lineHeight: 30, fontWeight: '800', color: palette.ink },
  ringCaption: { fontFamily: Typography.fontFamily, fontSize: 10, color: palette.muted },

  levelSteps: { flexDirection: 'row-reverse', gap: 6 },
  levelStep: { flex: 1, height: 6, borderRadius: 3, backgroundColor: palette.sage },
  levelStepDone: { backgroundColor: palette.gold },
  levelStepActive: { backgroundColor: palette.terracotta },
  levelTrack: { height: 10, borderRadius: 5, backgroundColor: palette.sage, overflow: 'hidden' },
  levelFill: { height: '100%', borderRadius: 5, backgroundColor: palette.terracotta },

  chart: { flexDirection: 'row-reverse', alignItems: 'flex-end', justifyContent: 'space-between', height: 132, paddingTop: 4 },
  chartCol: { flex: 1, alignItems: 'center', gap: 4, height: '100%' },
  chartValue: { fontFamily: Typography.fontFamily, fontSize: 10.5, color: palette.muted, height: 16 },
  chartBarTrack: { flex: 1, width: 18, borderRadius: 9, backgroundColor: palette.sage, justifyContent: 'flex-end', overflow: 'hidden' },
  chartBar: { width: '100%', borderRadius: 9, backgroundColor: '#8FB27A' },
  chartBarToday: { backgroundColor: palette.terracotta },
  chartDay: { fontFamily: Typography.fontFamily, fontSize: 11.5, color: palette.muted },
  chartDayToday: { color: palette.terracotta, fontWeight: '800' },

  statsGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 10 },
  statTile: { flexBasis: '47%', flexGrow: 1, borderRadius: 18, padding: 14, gap: 3, alignItems: 'flex-end', backgroundColor: palette.paper, borderWidth: 1, borderColor: palette.border },
  statIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.sage, marginBottom: 4 },
  statValue: { fontFamily: Typography.fontFamily, fontSize: 24, lineHeight: 32, fontWeight: '800', color: palette.ink },
  statValueCompact: { fontSize: 16, lineHeight: 28 },
  statLabel: { fontFamily: Typography.fontFamily, fontSize: 12, color: palette.muted },
  statHint: { fontFamily: Typography.fontFamily, fontSize: 11, color: palette.terracotta },

  langHead: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  langBadge: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  langBadgeText: { fontFamily: Typography.latinFontFamily, fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  langHeadCopy: { flex: 1, gap: 6 },
  langTitleRow: { flexDirection: 'row-reverse', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 },
  langName: { fontFamily: Typography.fontFamily, fontSize: 15.5, fontWeight: '800', color: palette.ink },
  langNative: { fontFamily: Typography.latinFontFamily, fontSize: 12, color: palette.muted, writingDirection: 'ltr' },
  languageTrack: { height: 6, borderRadius: 3, backgroundColor: palette.sage, overflow: 'hidden' },
  languageFill: { height: '100%', borderRadius: 3 },
  languageMeta: { fontFamily: Typography.fontFamily, fontSize: 11.5, color: palette.muted, textAlign: 'right', writingDirection: 'rtl' },
  chevronOpen: { transform: [{ rotate: '-90deg' }] },
  langBody: { gap: 10, borderTopWidth: 1, borderTopColor: palette.border, paddingTop: 12 },

  kvGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  kv: { flexBasis: '47%', flexGrow: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#FAF6EE', borderWidth: 1, borderColor: palette.border, alignItems: 'flex-end', gap: 2 },
  kvLabel: { fontFamily: Typography.fontFamily, fontSize: 11, color: palette.muted },
  kvValue: { fontFamily: Typography.fontFamily, fontSize: 13, fontWeight: '800', color: palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  kvValueHighlight: { color: palette.terracotta },

  levelRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  levelDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: palette.border, backgroundColor: palette.paper },
  levelDotDone: { backgroundColor: palette.success, borderColor: palette.success },
  levelCopy: { flex: 1, gap: 4 },
  levelTitleRow: { flexDirection: 'row-reverse', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 },
  levelTitle: { fontFamily: Typography.latinFontFamily, fontSize: 12.5, fontWeight: '700', color: palette.ink, writingDirection: 'ltr' },
  levelCefr: { fontFamily: Typography.fontFamily, fontSize: 11, color: palette.muted },
  levelMiniTrack: { height: 5, borderRadius: 3, backgroundColor: palette.sage, overflow: 'hidden' },
  levelMiniFill: { height: '100%', borderRadius: 3 },
  levelCount: { fontFamily: Typography.fontFamily, fontSize: 12, fontWeight: '800', color: palette.ink, minWidth: 44, textAlign: 'left' },

  reviewBar: { flexDirection: 'row-reverse', height: 10, borderRadius: 5, overflow: 'hidden', backgroundColor: palette.sage, gap: 2 },
  reviewSeg: { height: '100%' },
  legendRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 10 },
  legendItem: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendText: { fontFamily: Typography.fontFamily, fontSize: 11.5, color: palette.muted },

  badgeGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 10 },
  badge: { flexBasis: '47%', flexGrow: 1, borderRadius: 16, padding: 12, gap: 4, alignItems: 'flex-end', borderWidth: 1, borderColor: palette.border, backgroundColor: '#FAF6EE' },
  badgeEarned: { borderColor: '#E8D7A8', backgroundColor: '#FDF8EA' },
  badgeIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.goldSoft, marginBottom: 2 },
  badgeTitle: { fontFamily: Typography.fontFamily, fontSize: 13.5, fontWeight: '800', color: palette.ink },
  badgeDesc: { fontFamily: Typography.fontFamily, fontSize: 11.5, lineHeight: 18, color: palette.muted, textAlign: 'right', writingDirection: 'rtl' },
  pendingRow: { flexDirection: 'row-reverse', gap: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: palette.border },
  pendingCopy: { flex: 1, gap: 5 },
  pendingTitleRow: { flexDirection: 'row-reverse', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 },
  pendingTitle: { fontFamily: Typography.fontFamily, fontSize: 13.5, fontWeight: '800', color: palette.ink },
  pendingDetail: { fontFamily: Typography.fontFamily, fontSize: 11.5, color: palette.terracotta },
  pendingDesc: { fontFamily: Typography.fontFamily, fontSize: 11.5, lineHeight: 18, color: palette.muted, textAlign: 'right', writingDirection: 'rtl' },

  kvList: { borderRadius: 14, borderWidth: 1, borderColor: palette.border, backgroundColor: '#FAF6EE', overflow: 'hidden' },
  kvListRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingHorizontal: 12, paddingVertical: 10 },
  kvListRowBorder: { borderTopWidth: 1, borderTopColor: palette.border },
  kvListLabel: { fontFamily: Typography.fontFamily, fontSize: 12.5, color: palette.muted },
  kvListValue: { flex: 1, fontFamily: Typography.fontFamily, fontSize: 13, fontWeight: '800', color: palette.ink, textAlign: 'left', writingDirection: 'rtl' },
  kvListValueLtr: { fontFamily: Typography.latinFontFamily, writingDirection: 'ltr' },

  actionRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: palette.border },
  actionIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.sage },
  actionCopy: { flex: 1, gap: 2 },
  actionTitle: { fontFamily: Typography.fontFamily, fontSize: 13.5, fontWeight: '800', color: palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  actionSubtitle: { fontFamily: Typography.fontFamily, fontSize: 11.5, lineHeight: 18, color: palette.muted, textAlign: 'right', writingDirection: 'rtl' },

  primaryButton: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 46, borderRadius: 14, backgroundColor: palette.forest },
  primaryButtonText: { fontFamily: Typography.fontFamily, fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  secondaryButton: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, borderRadius: 14, backgroundColor: palette.sage },
  secondaryButtonText: { fontFamily: Typography.fontFamily, fontSize: 14, fontWeight: '700', color: palette.forest },
  dangerButton: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, borderRadius: 14, borderWidth: 1, borderColor: '#EAC7C3', backgroundColor: '#FFF7F6', marginTop: 4 },
  dangerButtonText: { fontFamily: Typography.fontFamily, fontSize: 14, fontWeight: '700', color: palette.danger },
  pressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.5 },
  cardTextStrong: { fontFamily: Typography.latinFontFamily, color: palette.ink, writingDirection: 'ltr' },
  fieldInput: { minHeight: 48, borderRadius: 14, paddingHorizontal: 14, backgroundColor: '#FAF6EE', borderWidth: 1, borderColor: palette.border, color: palette.ink, fontFamily: Typography.fontFamily, fontSize: 15, textAlign: 'right', writingDirection: 'rtl' },
  fieldInputLtr: { fontFamily: Typography.latinFontFamily, textAlign: 'left', writingDirection: 'ltr' },
  codeBox: { borderRadius: 18, paddingVertical: 18, alignItems: 'center', gap: 6, backgroundColor: palette.forest },
  codeText: { fontFamily: Typography.latinFontFamily, fontSize: 34, letterSpacing: 8, fontWeight: '800', color: '#FFFFFF' },
  codeHint: { fontSize: 11, color: '#DDF3E4' },
  codeInput: { textAlign: 'center', fontSize: 22, letterSpacing: 6 },
  inlineActions: { flexDirection: 'row-reverse', gap: 8 },
  inlineAction: { flex: 1 },
  stepRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 },
  stepItem: { alignItems: 'center', gap: 4 },
  stepDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.sage, borderWidth: 1, borderColor: palette.border },
  stepDotActive: { backgroundColor: palette.terracotta, borderColor: palette.terracotta },
  stepDotDone: { backgroundColor: palette.success, borderColor: palette.success },
  stepDotText: { fontFamily: Typography.fontFamily, fontSize: 12, fontWeight: '800', color: palette.muted },
  stepDotTextActive: { color: '#FFFFFF' },
  stepLabel: { fontFamily: Typography.fontFamily, fontSize: 11, color: palette.muted },
  stepLabelActive: { color: palette.ink, fontWeight: '800' },
  stepLine: { width: 48, height: 2, backgroundColor: palette.border, marginBottom: 18 },
  stepLineDone: { backgroundColor: palette.success },
  privacyRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, paddingHorizontal: 6 },
  privacyText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: 11.5, lineHeight: 19, color: palette.muted, textAlign: 'right', writingDirection: 'rtl' },
});
