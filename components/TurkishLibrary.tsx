import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { BookOpen, Check, ChevronLeft, ChevronUp, Clock3, Play, Volume2 } from 'lucide-react-native';
import { EnglishProgressTrack } from '@/components/EnglishUI';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { TurkishBottomNav } from '@/components/TurkishBottomNav';
import { PageNavigation } from '@/components/PageNavigation';
import { TURKISH_LEVELS, TURKISH_LESSONS, turkishProgress, type TurkishLevelId } from '@/lib/languages/turkish';
import { loadTurkishLessonSession, type TurkishLessonSession } from '@/lib/languages/turkishStudyState';
import type { CourseProgress } from '@/lib/courseProgress';
import { toPersianDigits as fa } from '@/lib/format';
import { playTurkishSpeech, stopTurkishSpeech } from '@/lib/turkishSpeech';
import { Typography } from '@/lib/theme';

function lessonState(lessonId: string, progress: CourseProgress | null, sessions: Record<string, TurkishLessonSession | null>) {
  if (progress?.completedLessonIds.includes(lessonId)) return 'تکمیل‌شده · قابل مرور';
  const session = sessions[lessonId];
  if (session && (session.stage > 0 || session.sentenceIndex > 0)) {
    return `ادامه از مرحله ${fa(session.stage + 1)}، جمله ${fa(session.sentenceIndex + 1)}`;
  }
  return 'شروع درس';
}

export default function TurkishLibrary() {
  const router = useRouter();
  const { level } = useLocalSearchParams<{ level?: string }>();
  const [hydrated, setHydrated] = useState(false);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [sessions, setSessions] = useState<Record<string, TurkishLessonSession | null>>({});
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => setHydrated(true), []);

  const selected = hydrated ? TURKISH_LEVELS.find(item => String(item.id) === String(level)) : undefined;
  const selectedLessons = useMemo(() => selected ? TURKISH_LESSONS.filter(item => item.levelId === selected.id) : [], [selected?.id]);

  useFocusEffect(useCallback(() => {
    let alive = true;
    void Promise.all([
      turkishProgress.getCourseProgress(),
      Promise.all(TURKISH_LESSONS.map(async lesson => {
        try { return [lesson.id, await loadTurkishLessonSession(lesson.id)] as const; }
        catch { return [lesson.id, null] as const; }
      })),
    ]).then(([nextProgress, nextSessions]) => {
      if (!alive) return;
      setProgress(nextProgress);
      setSessions(Object.fromEntries(nextSessions));
      setError('');
    }).catch(() => { if (alive) setError('وضعیت ذخیره‌شده خوانده نشد؛ فهرست درس‌ها همچنان در دسترس است.'); });
    return () => { alive = false; void stopTurkishSpeech(); };
  }, [retry]));

  const completedIds = progress?.completedLessonIds ?? [];
  const totalSentences = TURKISH_LESSONS.reduce((count, lesson) => count + lesson.sentences.length, 0);
  const openLevel = (levelId: TurkishLevelId) => router.push(`/learn/tr/library?level=${levelId}` as never);
  const openLesson = (id: string) => router.push(`/learn/tr/lesson?id=${encodeURIComponent(id)}` as never);

  if (selected) {
    const completed = selectedLessons.filter(lesson => completedIds.includes(lesson.id)).length;
    const percent = selectedLessons.length ? (completed / selectedLessons.length) * 100 : 0;
    return (
      <View style={styles.root}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.topBar}>
            <PageNavigation backFallback="/learn/tr/library" />
            <Text style={styles.brandEyebrow}>TÜRKÇE · LEVEL {fa(selected.id + 1)}</Text>
          </View>
          <LinearGradient colors={[selected.color, '#8C1B1F']} start={{ x: 0.95, y: 0 }} end={{ x: 0.05, y: 1 }} style={styles.levelHero}>
            <Text style={styles.levelHeroTitle}>{selected.title}</Text>
            <Text style={styles.levelHeroCefr}>{selected.cefr}</Text>
            <Text style={styles.levelHeroDescription}>{selected.description}</Text>
            <View style={styles.levelHeroMeta}>
              <Text style={styles.levelHeroMetaText}>{fa(selectedLessons.length)} درس</Text>
              <Text style={styles.levelHeroMetaText}>{fa(selectedLessons.reduce((count, lesson) => count + lesson.sentences.length, 0))} جمله</Text>
              <Text style={styles.levelHeroMetaText}>{fa(completed)} تکمیل‌شده</Text>
            </View>
            <View style={styles.levelHeroTrack}><EnglishProgressTrack value={percent} color="#FFFFFF" height={6} trackColor="rgba(255,255,255,0.25)" /></View>
          </LinearGradient>

          {!!error && <Text accessibilityRole="alert" style={styles.alert}>{error}</Text>}

          <View style={styles.lessonList}>
            {selectedLessons.map(lesson => {
              const done = completedIds.includes(lesson.id);
              return (
                <Pressable key={lesson.id} accessibilityRole="button" style={({ pressed }) => [styles.lessonCard, pressed && styles.pressed]} onPress={() => openLesson(lesson.id)}>
                  <View style={[styles.lessonNumber, done && styles.lessonNumberDone]}>
                    {done ? <Check size={16} color="#FFFFFF" /> : <Text style={styles.lessonNumberText}>{fa(lesson.order)}</Text>}
                  </View>
                  <View style={styles.lessonCopy}>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text>
                    <View style={styles.lessonMetaRow}>
                      <Clock3 size={11} color={Palette.muted} />
                      <Text style={styles.lessonMeta}>{fa(lesson.durationMinutes)} دقیقه · {fa(lesson.sentences.length)} جمله</Text>
                      <Text style={[styles.lessonState, done && styles.lessonStateDone]}>{lessonState(lesson.id, progress, sessions)}</Text>
                    </View>
                  </View>
                  <ChevronLeft size={17} color={Palette.muted} />
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        <TurkishBottomNav />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <PageNavigation backFallback="/languages" />
          <Text style={styles.brandEyebrow}>TÜRKÇE · KÜTÜPHANE</Text>
        </View>
        <Text style={styles.pageTitle}>کتابخانهٔ درس‌های ترکی</Text>
        <Text style={styles.pageIntro}>یک سطح را انتخاب کن؛ هر درس از یک موقعیت واقعی شروع می‌شود و به جمله‌های کاربردی می‌رسد.</Text>

        {!!error && <Text accessibilityRole="alert" style={styles.alert}>{error}</Text>}

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}><Text style={styles.summaryValue}>{fa(TURKISH_LESSONS.length)}</Text><Text style={styles.summaryLabel}>درس</Text></View>
          <View style={styles.summaryCard}><Text style={styles.summaryValue}>{fa(totalSentences)}</Text><Text style={styles.summaryLabel}>جمله</Text></View>
          <View style={styles.summaryCard}><Text style={styles.summaryValue}>{fa(completedIds.length)}</Text><Text style={styles.summaryLabel}>تکمیل‌شده</Text></View>
        </View>

        <View style={styles.levelList}>
          {TURKISH_LEVELS.map(levelItem => {
            const lessons = TURKISH_LESSONS.filter(lesson => lesson.levelId === levelItem.id);
            const completed = lessons.filter(lesson => completedIds.includes(lesson.id)).length;
            const percent = lessons.length ? (completed / lessons.length) * 100 : 0;
            const planned = levelItem.status === 'planned';
            return (
              <Pressable
                key={levelItem.id}
                accessibilityRole="button"
                accessibilityState={{ disabled: planned }}
                disabled={planned}
                onPress={() => openLevel(levelItem.id)}
                style={({ pressed }) => [styles.levelCard, planned && styles.levelCardPlanned, pressed && styles.pressed]}
              >
                <View style={styles.levelHeaderRow}>
                  <View style={[styles.levelDot, { backgroundColor: levelItem.color }]} />
                  <Text style={styles.levelTitle}>{levelItem.title}</Text>
                  <Text style={[styles.levelCefr, { color: levelItem.color }]}>{levelItem.cefr}</Text>
                </View>
                <Text style={styles.levelDescription}>{planned ? 'در نقشهٔ راه؛ هنوز درس تأییدشده ندارد.' : levelItem.description}</Text>
                {!planned && (
                  <>
                    <EnglishProgressTrack value={percent} color={levelItem.color} height={6} />
                    <View style={styles.levelFooter}>
                      <Text style={styles.levelMeta}>{fa(completed)} از {fa(lessons.length)} درس</Text>
                      <ChevronUp size={14} color={Palette.muted} style={{ transform: [{ rotate: '90deg' }] }} />
                    </View>
                  </>
                )}
                {planned && <View style={styles.plannedPill}><Text style={styles.plannedPillText}>به‌زودی</Text></View>}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.listenPreview}>
          <BookOpen size={16} color={Palette.primary} />
          <Text style={styles.listenPreviewText}>جمله‌ها با صدای دستگاه به ترکی استانبولی خوانده می‌شوند.</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="نمونهٔ صدا" style={styles.listenPreviewButton} onPress={() => void playTurkishSpeech('Merhaba, nasılsınız?', 0.8)}>
            <Volume2 size={15} color={Palette.primary} />
            <Play size={11} color={Palette.primary} />
          </Pressable>
        </View>
      </ScrollView>
      <TurkishBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.canvas },
  content: { padding: 15, paddingBottom: 96, gap: 12 },
  topBar: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  brandEyebrow: { fontFamily: 'Inter-ExtraBold', color: '#A9665A', fontSize: 8, letterSpacing: 1.3, writingDirection: 'ltr' },
  pageTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 24, lineHeight: 36, textAlign: 'right', writingDirection: 'rtl' },
  pageIntro: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 12, lineHeight: 22, textAlign: 'right', writingDirection: 'rtl' },
  alert: { fontFamily: Typography.fontFamily, color: '#9B263C', backgroundColor: '#FFF5F6', borderWidth: 1, borderColor: '#F2D1D8', borderRadius: 12, padding: 11, fontSize: 11, lineHeight: 19, textAlign: 'right' },
  summaryRow: { flexDirection: 'row-reverse', gap: 9 },
  summaryCard: { flex: 1, backgroundColor: Palette.surface, borderRadius: 16, borderWidth: 1, borderColor: Palette.border, paddingVertical: 12, alignItems: 'center', gap: 2 },
  summaryValue: { fontFamily: Typography.numberFontFamily, color: Palette.ink, fontSize: 18 },
  summaryLabel: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9 },
  levelList: { gap: 10 },
  levelCard: { backgroundColor: Palette.surface, borderRadius: 18, borderWidth: 1, borderColor: Palette.border, padding: 14, gap: 8 },
  levelCardPlanned: { opacity: 0.72 },
  levelHeaderRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  levelDot: { width: 9, height: 9, borderRadius: 5 },
  levelTitle: { flex: 1, fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 14, writingDirection: 'ltr', textAlign: 'right' },
  levelCefr: { fontFamily: Typography.fontFamily, fontSize: 9 },
  levelDescription: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  levelFooter: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  levelMeta: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9 },
  plannedPill: { alignSelf: 'flex-end', backgroundColor: Palette.surfaceMuted, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3 },
  plannedPillText: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9 },
  levelHero: { borderRadius: 22, padding: 17, gap: 7 },
  levelHeroTitle: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 20, writingDirection: 'ltr', textAlign: 'right' },
  levelHeroCefr: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.85)', fontSize: 10, textAlign: 'right' },
  levelHeroDescription: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.9)', fontSize: 11, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  levelHeroMeta: { flexDirection: 'row-reverse', gap: 12, marginTop: 2 },
  levelHeroMetaText: { fontFamily: Typography.fontFamily, color: '#FFE7CF', fontSize: 9 },
  levelHeroTrack: { marginTop: 6 },
  lessonList: { gap: 9 },
  lessonCard: { flexDirection: 'row-reverse', alignItems: 'center', gap: 11, backgroundColor: Palette.surface, borderRadius: 16, borderWidth: 1, borderColor: Palette.border, padding: 12 },
  lessonNumber: { width: 36, height: 36, borderRadius: 12, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  lessonNumberDone: { backgroundColor: Palette.success },
  lessonNumberText: { fontFamily: Typography.numberFontFamily, color: Palette.primaryDark, fontSize: 13 },
  lessonCopy: { flex: 1, gap: 3 },
  lessonTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 13, textAlign: 'right', writingDirection: 'rtl' },
  lessonSubtitle: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, lineHeight: 17, textAlign: 'right', writingDirection: 'rtl' },
  lessonMetaRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, flexWrap: 'wrap' },
  lessonMeta: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9 },
  lessonState: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 9 },
  lessonStateDone: { color: Palette.success },
  listenPreview: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, backgroundColor: Palette.surface, borderRadius: 16, borderWidth: 1, borderColor: Palette.border, padding: 12 },
  listenPreviewText: { flex: 1, fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  listenPreviewButton: { flexDirection: 'row-reverse', alignItems: 'center', gap: 3, padding: 6 },
  pressed: { opacity: 0.86 },
});
