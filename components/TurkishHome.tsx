import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { ArrowRight, BookOpen, BookOpenCheck, Check, ChevronLeft, Flame, Play, RefreshCw, Sparkles, Volume2 } from 'lucide-react-native';
import { PageNavigation } from '@/components/PageNavigation';
import { TurkishBottomNav } from '@/components/TurkishBottomNav';
import { EnglishProgressTrack } from '@/components/EnglishUI';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { TURKISH_LEVELS, TURKISH_LESSONS, turkishProgress, type TurkishLevelId } from '@/lib/languages/turkish';
import { loadTurkishLessonSessionWithPresence } from '@/lib/languages/turkishStudyState';
import type { CourseProgress } from '@/lib/courseProgress';
import { toPersianDigits as fa } from '@/lib/format';
import { playTurkishSpeech, stopTurkishSpeech } from '@/lib/turkishSpeech';
import { Typography } from '@/lib/theme';

export default function TurkishHome() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const compact = width < 640;
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [dueCount, setDueCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [error, setError] = useState('');
  const [speechError, setSpeechError] = useState('');
  const [retry, setRetry] = useState(0);

  useFocusEffect(useCallback(() => {
    let alive = true;
    void Promise.all([turkishProgress.getCourseProgress(), turkishProgress.getDueReviewCards()])
      .then(async ([nextProgress, cards]) => {
        if (!alive) return;
        setProgress(nextProgress);
        setDueCount(cards.length);
        setError('');
        const completed = new Set(nextProgress.completedLessonIds);
        const current = TURKISH_LESSONS.find(lesson => lesson.id === nextProgress.currentLessonId && !completed.has(lesson.id))
          ?? TURKISH_LESSONS.find(lesson => !completed.has(lesson.id));
        const saved = current ? await loadTurkishLessonSessionWithPresence(current.id).catch(() => null) : null;
        if (!alive) return;
        setHasStarted(nextProgress.completedLessonIds.length > 0 || !!saved?.hasSavedSession);
      })
      .catch(() => { if (alive) setError('پیشرفت ترکی خوانده نشد؛ اطلاعات قبلی تغییر نکرده است. دوباره تلاش کنید.'); });
    return () => { alive = false; void stopTurkishSpeech(); };
  }, [retry]));

  const completedIds = progress?.completedLessonIds ?? [];
  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const nextLesson = TURKISH_LESSONS.find(lesson => !completedSet.has(lesson.id));
  const savedCurrent = TURKISH_LESSONS.find(lesson => lesson.id === progress?.currentLessonId && !completedSet.has(lesson.id));
  const resumeLesson = savedCurrent ?? nextLesson;
  const heroLesson = resumeLesson ?? TURKISH_LESSONS[TURKISH_LESSONS.length - 1];
  const activeLevel = TURKISH_LEVELS.find(level => level.id === heroLesson.levelId) ?? TURKISH_LEVELS[0];
  const levelLessons = TURKISH_LESSONS.filter(lesson => lesson.levelId === activeLevel.id);
  const levelCompleted = levelLessons.filter(lesson => completedSet.has(lesson.id)).length;
  const levelProgress = levelLessons.length ? (levelCompleted / levelLessons.length) * 100 : 0;
  const coursePercent = TURKISH_LESSONS.length ? (completedSet.size / TURKISH_LESSONS.length) * 100 : 0;
  const firstSentence = heroLesson.sentences[0];
  const levelCounts = {} as Partial<Record<TurkishLevelId, { completed: number; total: number }>>;
  TURKISH_LEVELS.forEach(level => {
    const lessons = TURKISH_LESSONS.filter(lesson => lesson.levelId === level.id);
    levelCounts[level.id] = { completed: lessons.filter(lesson => completedSet.has(lesson.id)).length, total: lessons.length };
  });

  const openLesson = () => {
    if (resumeLesson) router.push(`/learn/tr/lesson?id=${encodeURIComponent(resumeLesson.id)}` as never);
    else router.push('/learn/tr/library' as never);
  };
  const openLevel = (levelId: TurkishLevelId) => router.push(`/learn/tr/library?level=${levelId}` as never);
  const speak = () => {
    setSpeechError('');
    void playTurkishSpeech(firstSentence.text, 0.82, () => setSpeechError('صدای ترکی دستگاه در دسترس نیست؛ متن و تلفظ همچنان دیده می‌شوند.'));
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <View style={styles.header}>
            <View style={styles.brandLockup}>
              <LinearGradient colors={['#D2432F', '#8C1B1F']} start={{ x: 0.9, y: 0 }} end={{ x: 0.1, y: 1 }} style={styles.brandMark}>
                <BookOpenCheck size={20} color="#FFF3E6" strokeWidth={2} />
              </LinearGradient>
              <View style={styles.brandCopy}>
                <Text style={styles.brandEyebrow}>LANGUAGE JOURNEY · TÜRKÇE</Text>
                <Text style={styles.headerTitle}>مسیر یادگیری ترکی استانبولی</Text>
              </View>
            </View>
            <PageNavigation backFallback="/languages" />
          </View>

          <LinearGradient colors={['#FFFFFF', '#FFF2EC', '#FDE2D8']} start={{ x: 0.95, y: 0.08 }} end={{ x: 0.04, y: 1 }} style={[styles.welcome, compact && styles.welcomeCompact]}>
            <View style={styles.welcomeCopy}>
              <View style={styles.welcomeEyebrowRow}>
                <Sparkles size={13} color="#C8452C" />
                <Text style={styles.welcomeEyebrow}>TÜRKÇE ÖĞRENİYORUM</Text>
              </View>
              <Text style={styles.welcomeTitle}>سلام! آماده‌ای ترکی استانبولی را شروع کنی؟</Text>
              <Text style={styles.welcomeDescription}>یک جملهٔ کاربردی ترکی، یک قدم دیگر در مسیر یادگیری.</Text>
              <View style={styles.welcomeTags}>
                <View style={styles.welcomeTag}><BookOpen size={12} color="#C8452C" /><Text style={styles.welcomeTagText}>یادگیری جمله‌محور</Text></View>
                <View style={styles.welcomeTag}><Volume2 size={12} color="#1D7FA6" /><Text style={styles.welcomeTagText}>تلفظ و شنیدن ترکی</Text></View>
              </View>
            </View>
            <View style={[styles.welcomeStamp, compact && styles.welcomeStampCompact]}>
              <Text style={styles.welcomeStampMain}>TR</Text>
              <View style={styles.welcomeStampLine} />
              <Text style={styles.welcomeStampSub}>TÜRKÇE</Text>
            </View>
          </LinearGradient>

          {!!error && (
            <View style={styles.errorCard}>
              <Text accessibilityRole="alert" style={styles.errorText}>{error}</Text>
              <Pressable accessibilityRole="button" onPress={() => setRetry(value => value + 1)}><Text style={styles.retryText}>تلاش دوباره</Text></Pressable>
            </View>
          )}

          <View style={styles.lessonCard}>
            <LinearGradient colors={['#E2573F', '#D2432F', '#B93A2D']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.lessonAccent} />
            <View style={styles.lessonMetaRow}>
              <View style={styles.levelTag}>
                <View style={[styles.levelTagDot, { backgroundColor: activeLevel.color }]} />
                <Text style={[styles.levelTagName, { color: activeLevel.color }]}>{activeLevel.title}</Text>
                <Text style={styles.levelTagDivider}>·</Text>
                <Text style={[styles.levelTagText, { color: activeLevel.color }]}>{activeLevel.cefr}</Text>
              </View>
              <Text style={styles.lessonOrder}>{fa(heroLesson.order)} از {fa(TURKISH_LESSONS.length)}</Text>
            </View>

            <View style={styles.lessonHeading}>
              <Text style={styles.lessonEyebrow}>{hasStarted ? 'ادامهٔ یادگیری ترکی' : 'نخستین درس ترکی'}</Text>
              <Text style={styles.lessonTitle}>{resumeLesson ? heroLesson.title : 'مسیر آغازین تکمیل شد'}</Text>
              <Text style={styles.lessonSubtitle}>{resumeLesson ? heroLesson.subtitle : 'درس‌های موجود را مرور کن یا کتابخانه را ببین.'}</Text>
            </View>

            <View style={styles.sentenceCard}>
              <View style={styles.sentenceTopRow}>
                <View style={styles.sentenceIcon}><BookOpen size={15} color={Palette.primary} /></View>
                <Text style={styles.sentenceLabel}>جملهٔ منتخب این درس</Text>
                <Text style={styles.sentenceNumber}>{fa(1)} / {fa(heroLesson.sentences.length)}</Text>
              </View>
              <Text style={styles.sentenceTurkish}>{firstSentence.text}</Text>
              <Text style={styles.sentencePersian}>{firstSentence.fa}</Text>
              <Text style={styles.sentencePronunciation}>{firstSentence.pronunciation}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="پخش جملهٔ ترکی" style={styles.listenRow} onPress={speak}>
                <Volume2 size={15} color={Palette.primary} />
                <Text style={styles.listenText}>گوش کن</Text>
              </Pressable>
              {!!speechError && <Text accessibilityRole="alert" style={styles.speechError}>{speechError}</Text>}
            </View>

            <View style={styles.levelProgressBlock}>
              <View style={styles.levelProgressMeta}>
                <Text style={styles.levelProgressLabel}>پیشرفت در {activeLevel.title}</Text>
                <Text style={styles.levelProgressValue}>{fa(levelCompleted)} از {fa(levelLessons.length)} درس</Text>
              </View>
              <EnglishProgressTrack value={levelProgress} color={activeLevel.color} height={7} />
            </View>

            <View style={styles.lessonFooter}>
              <Pressable accessibilityRole="button" accessibilityLabel={hasStarted ? 'ادامهٔ آموزش ترکی' : 'شروع اولین درس ترکی'} style={({ pressed }) => [styles.continueButton, pressed && styles.pressed]} onPress={openLesson}>
                <LinearGradient colors={['#D2432F', '#972319']} start={{ x: 0.96, y: 0 }} end={{ x: 0.04, y: 1 }} style={styles.continueGradient}>
                  <Play size={16} color="#FFF3E6" fill="#FFF3E6" />
                  <Text style={styles.continueText}>{resumeLesson ? (hasStarted ? 'ادامهٔ آموزش' : 'شروع اولین درس') : 'مشاهدهٔ درس‌ها'}</Text>
                  <ChevronLeft size={17} color="#FFFFFF" />
                </LinearGradient>
              </Pressable>
              <View style={styles.lessonCountPill}>
                <Text style={styles.lessonCountValue}>{fa(heroLesson.sentences.length)}</Text>
                <Text style={styles.lessonCountLabel}>جمله</Text>
              </View>
            </View>
          </View>

          <View style={styles.quickRow}>
            <Pressable accessibilityRole="button" style={styles.quickCard} onPress={() => router.push('/learn/tr/review' as never)}>
              <View style={styles.quickIcon}><RefreshCw size={17} color={Palette.primary} /></View>
              <View style={styles.quickCopy}>
                <Text style={styles.quickTitle}>مرور فاصله‌دار</Text>
                <Text style={styles.quickDetail}>{dueCount ? `${fa(dueCount)} جمله آمادهٔ مرور` : 'اکنون چیزی برای مرور نیست'}</Text>
              </View>
              <ArrowRight size={16} color={Palette.muted} />
            </Pressable>
            <Pressable accessibilityRole="button" style={styles.quickCard} onPress={() => router.push('/learn/tr/library' as never)}>
              <View style={styles.quickIcon}><BookOpen size={17} color={Palette.primary} /></View>
              <View style={styles.quickCopy}>
                <Text style={styles.quickTitle}>کتابخانهٔ درس‌ها</Text>
                <Text style={styles.quickDetail}>دسترسی به همهٔ سطح‌ها و جمله‌ها</Text>
              </View>
              <ArrowRight size={16} color={Palette.muted} />
            </Pressable>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>سطح‌های دوره</Text>
            <View style={styles.sectionBadge}><Flame size={13} color="#C8452C" /><Text style={styles.sectionBadgeText}>{fa(Math.round(coursePercent))}٪ کامل</Text></View>
          </View>

          <View style={styles.levelList}>
            {TURKISH_LEVELS.map(level => {
              const counts = levelCounts[level.id] ?? { completed: 0, total: 0 };
              const percent = counts.total ? (counts.completed / counts.total) * 100 : 0;
              const planned = level.status === 'planned';
              return (
                <Pressable
                  key={level.id}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: planned }}
                  disabled={planned}
                  onPress={() => openLevel(level.id)}
                  style={({ pressed }) => [styles.levelCard, planned && styles.levelCardPlanned, pressed && styles.pressed]}
                >
                  <View style={[styles.levelThumb, { backgroundColor: `${level.color}18`, borderColor: `${level.color}44` }]}>
                    {counts.total > 0 && counts.completed === counts.total
                      ? <Check size={18} color={level.color} />
                      : <Text style={[styles.levelThumbText, { color: level.color }]}>{fa(level.id + 1)}</Text>}
                  </View>
                  <View style={styles.levelCopy}>
                    <View style={styles.levelTitleRow}>
                      <Text style={styles.levelTitle}>{level.title}</Text>
                      <Text style={[styles.levelCefr, { color: level.color }]}>{level.cefr}</Text>
                    </View>
                    <Text style={styles.levelDescription} numberOfLines={2}>{planned ? 'این سطح در نقشهٔ راه است و هنوز درس تأییدشده ندارد.' : level.description}</Text>
                    {planned ? (
                      <View style={styles.plannedPill}><Text style={styles.plannedPillText}>به‌زودی</Text></View>
                    ) : (
                      <>
                        <EnglishProgressTrack value={percent} color={level.color} height={6} />
                        <Text style={styles.levelMeta}>{fa(counts.completed)} از {fa(counts.total)} درس</Text>
                      </>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.footnote}>سطح‌بندی این دوره داخلی است و گواهی رسمی CEFR صادر نمی‌کند.</Text>
        </View>
      </ScrollView>
      <TurkishBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.canvas },
  scrollContent: { flexGrow: 1, paddingBottom: 12 },
  page: { width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: 15, paddingTop: 12, paddingBottom: 96, gap: 14 },
  header: { minHeight: 58, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  brandLockup: { flexDirection: 'row-reverse', alignItems: 'center', gap: 11 },
  brandMark: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#7A1B1B', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  brandCopy: { gap: 2 },
  brandEyebrow: { fontFamily: 'Inter-ExtraBold', color: '#A9665A', fontSize: 7, letterSpacing: 1.2, writingDirection: 'ltr', textAlign: 'right' },
  headerTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 16, textAlign: 'right', writingDirection: 'rtl' },
  welcome: { borderRadius: 22, padding: 16, gap: 12, flexDirection: 'row-reverse', alignItems: 'center', borderWidth: 1, borderColor: '#F7D8CC' },
  welcomeCompact: { flexDirection: 'column-reverse', alignItems: 'stretch' },
  welcomeCopy: { flex: 1, gap: 6 },
  welcomeEyebrowRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5 },
  welcomeEyebrow: { fontFamily: 'Inter-ExtraBold', color: '#C8452C', fontSize: 8, letterSpacing: 1.4, writingDirection: 'ltr' },
  welcomeTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 19, lineHeight: 31, textAlign: 'right', writingDirection: 'rtl' },
  welcomeDescription: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 12, lineHeight: 21, textAlign: 'right', writingDirection: 'rtl' },
  welcomeTags: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 7, marginTop: 4 },
  welcomeTag: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.8)', borderWidth: 1, borderColor: '#F6DACF', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5 },
  welcomeTagText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10 },
  welcomeStamp: { width: 98, height: 98, borderRadius: 24, backgroundColor: '#C8452C', alignItems: 'center', justifyContent: 'center', gap: 4, shadowColor: '#8C1B1F', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  welcomeStampCompact: { width: 108, height: 74, alignSelf: 'flex-end' },
  welcomeStampMain: { fontFamily: 'Inter-ExtraBold', color: '#FFF6EA', fontSize: 30, letterSpacing: 2, writingDirection: 'ltr' },
  welcomeStampLine: { width: 40, height: 1, backgroundColor: 'rgba(255,246,234,0.6)' },
  welcomeStampSub: { fontFamily: 'Inter-ExtraBold', color: '#FFE7CF', fontSize: 9, letterSpacing: 2, writingDirection: 'ltr' },
  errorCard: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, padding: 13, borderRadius: 16, borderWidth: 1, borderColor: '#F2D1D8', backgroundColor: '#FFF5F6' },
  errorText: { flex: 1, fontFamily: Typography.fontFamily, color: '#9B263C', fontSize: 11, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  retryText: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 11 },
  lessonCard: { backgroundColor: Palette.surface, borderRadius: 24, borderWidth: 1, borderColor: Palette.border, padding: 16, gap: 14, overflow: 'hidden', shadowColor: '#20264A', shadowOpacity: 0.05, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 2 },
  lessonAccent: { position: 'absolute', top: 0, right: 0, left: 0, height: 4 },
  lessonMetaRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 4 },
  levelTag: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, backgroundColor: Palette.surfaceMuted, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  levelTagDot: { width: 7, height: 7, borderRadius: 4 },
  levelTagName: { fontFamily: Typography.fontFamily, fontSize: 10, writingDirection: 'ltr' },
  levelTagDivider: { color: Palette.muted, fontSize: 10 },
  levelTagText: { fontFamily: Typography.fontFamily, fontSize: 9, writingDirection: 'rtl' },
  lessonOrder: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10 },
  lessonHeading: { gap: 3 },
  lessonEyebrow: { fontFamily: Typography.fontFamily, color: '#C8452C', fontSize: 10 },
  lessonTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 21, lineHeight: 32, textAlign: 'right', writingDirection: 'rtl' },
  lessonSubtitle: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 11, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  sentenceCard: { backgroundColor: Palette.surfaceMuted, borderRadius: 18, borderWidth: 1, borderColor: Palette.border, padding: 14, gap: 6 },
  sentenceTopRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7 },
  sentenceIcon: { width: 26, height: 26, borderRadius: 9, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  sentenceLabel: { flex: 1, fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, textAlign: 'right' },
  sentenceNumber: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9 },
  sentenceTurkish: { fontFamily: 'Inter-ExtraBold', color: Palette.ink, fontSize: 20, lineHeight: 30, textAlign: 'right', writingDirection: 'ltr' },
  sentencePersian: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 12, lineHeight: 21, textAlign: 'right', writingDirection: 'rtl' },
  sentencePronunciation: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  listenRow: { flexDirection: 'row-reverse', alignItems: 'center', alignSelf: 'flex-end', gap: 5, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, marginTop: 4 },
  listenText: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 10 },
  speechError: { fontFamily: Typography.fontFamily, color: '#9B263C', fontSize: 10, textAlign: 'right' },
  levelProgressBlock: { gap: 7 },
  levelProgressMeta: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  levelProgressLabel: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10 },
  levelProgressValue: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10 },
  lessonFooter: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  continueButton: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  continueGradient: { minHeight: 52, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 14 },
  continueText: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 14 },
  lessonCountPill: { minWidth: 62, borderRadius: 14, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border, paddingVertical: 8, alignItems: 'center' },
  lessonCountValue: { fontFamily: Typography.numberFontFamily, color: Palette.ink, fontSize: 16 },
  lessonCountLabel: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  quickRow: { flexDirection: 'row-reverse', gap: 10, flexWrap: 'wrap' },
  quickCard: { flex: 1, minWidth: 230, flexDirection: 'row-reverse', alignItems: 'center', gap: 10, backgroundColor: Palette.surface, borderRadius: 18, borderWidth: 1, borderColor: Palette.border, padding: 13 },
  quickIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  quickCopy: { flex: 1, gap: 2 },
  quickTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 12, textAlign: 'right' },
  quickDetail: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, textAlign: 'right' },
  sectionHeader: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  sectionTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 17 },
  sectionBadge: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, backgroundColor: '#FFF1EA', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  sectionBadgeText: { fontFamily: Typography.fontFamily, color: '#C8452C', fontSize: 10 },
  levelList: { gap: 10 },
  levelCard: { flexDirection: 'row-reverse', gap: 12, alignItems: 'center', backgroundColor: Palette.surface, borderRadius: 18, borderWidth: 1, borderColor: Palette.border, padding: 13 },
  levelCardPlanned: { opacity: 0.72 },
  levelThumb: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  levelThumbText: { fontFamily: Typography.numberFontFamily, fontSize: 16 },
  levelCopy: { flex: 1, gap: 5 },
  levelTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  levelTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 14, writingDirection: 'ltr' },
  levelCefr: { fontFamily: Typography.fontFamily, fontSize: 9 },
  levelDescription: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  levelMeta: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, textAlign: 'right' },
  plannedPill: { alignSelf: 'flex-end', backgroundColor: Palette.surfaceMuted, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3 },
  plannedPillText: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9 },
  footnote: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, textAlign: 'center', writingDirection: 'rtl', marginTop: 4 },
});
