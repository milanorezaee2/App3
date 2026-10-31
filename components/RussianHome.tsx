import { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  BookOpen,
  BookOpenCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock3,
  Compass,
  Flame,
  MessageCircle,
  Play,
  RefreshCw,
  Sparkles,
  Volume2,
} from 'lucide-react-native';
import { PageNavigation } from '@/components/PageNavigation';
import { RussianBottomNav } from '@/components/RussianBottomNav';
import { LearningHomeColors as HomeColors, learningHomeStyles as styles } from '@/components/LearningHomeStyles';
import { EnglishLevelRail, EnglishProgressTrack, displayEnglishModuleLabel } from '@/components/EnglishUI';
import { RUSSIAN_LEVELS, RUSSIAN_LESSONS, russianProgress, type RussianLevelId } from '@/lib/languages/russian';
import { loadRussianLessonSessionWithPresence } from '@/lib/languages/russianStudyState';
import type { CourseProgress } from '@/lib/courseProgress';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';

const russianOnlyStyles = StyleSheet.create({
  sentencePronunciation: {
    fontFamily: Typography.fontFamily,
    color: HomeColors.muted,
    fontSize: 10,
    lineHeight: 18,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  errorCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    padding: 13,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F2D1D8',
    backgroundColor: '#FFF5F6',
  },
  errorText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    color: '#9B263C',
    fontSize: 11,
    lineHeight: 19,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  retryText: {
    fontFamily: Typography.fontFamily,
    color: HomeColors.accent,
    fontSize: 11,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default function RussianHome() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const compact = width < 640;
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [dueCount, setDueCount] = useState(0);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [hasStartedCourse, setHasStartedCourse] = useState(false);

  useFocusEffect(useCallback(() => {
    let alive = true;
    void Promise.all([russianProgress.getCourseProgress(), russianProgress.getDueReviewCards()])
      .then(async ([nextProgress, cards]) => {
        if (!alive) return;
        setProgress(nextProgress);
        setDueCount(cards.length);
        setError('');
        const completed = new Set(nextProgress.completedLessonIds);
        const currentLesson = RUSSIAN_LESSONS.find(lesson => lesson.id === nextProgress.currentLessonId && !completed.has(lesson.id))
          ?? RUSSIAN_LESSONS.find(lesson => !completed.has(lesson.id));
        const savedSession = currentLesson
          ? await loadRussianLessonSessionWithPresence(currentLesson.id).catch(() => null)
          : null;
        if (!alive) return;
        setHasStartedCourse(nextProgress.completedLessonIds.length > 0 || !!savedSession?.hasSavedSession);
      })
      .catch(() => { if (alive) setError('پیشرفت روسی خوانده نشد؛ اطلاعات قبلی تغییر نکرده است. دوباره تلاش کنید.'); });
    return () => { alive = false; };
  }, [retry]));

  const completedIds = progress?.completedLessonIds ?? [];
  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const nextLesson = RUSSIAN_LESSONS.find(lesson => !completedSet.has(lesson.id));
  const savedCurrentLesson = RUSSIAN_LESSONS.find(lesson => lesson.id === progress?.currentLessonId && !completedSet.has(lesson.id));
  const resumeLesson = savedCurrentLesson ?? nextLesson;
  const heroLesson = resumeLesson ?? RUSSIAN_LESSONS[RUSSIAN_LESSONS.length - 1];
  const activeLevel = RUSSIAN_LEVELS.find(level => level.id === (resumeLesson?.levelId ?? heroLesson.levelId)) ?? RUSSIAN_LEVELS[0];
  const completedCount = RUSSIAN_LESSONS.filter(lesson => completedSet.has(lesson.id)).length;
  const levelLessons = RUSSIAN_LESSONS.filter(lesson => lesson.levelId === activeLevel.id);
  const levelCompleted = levelLessons.filter(lesson => completedSet.has(lesson.id)).length;
  const levelProgress = levelLessons.length ? (levelCompleted / levelLessons.length) * 100 : 0;
  const sentenceCount = RUSSIAN_LESSONS.reduce((count, lesson) => count + lesson.sentences.length, 0);
  const uniqueWords = new Set(RUSSIAN_LESSONS.flatMap(lesson => lesson.sentences.flatMap(sentence => sentence.vocabulary.map(item => item.word)))).size;
  const firstSentence = heroLesson.sentences[0];
  const heroLessonOrder = Math.max(1, RUSSIAN_LESSONS.findIndex(lesson => lesson.id === heroLesson.id) + 1);
  const courseProgressPercent = RUSSIAN_LESSONS.length ? (completedCount / RUSSIAN_LESSONS.length) * 100 : 0;
  const levelCounts = {} as Partial<Record<RussianLevelId, { completed: number; total: number }>>;
  RUSSIAN_LEVELS.forEach(level => {
    const lessons = RUSSIAN_LESSONS.filter(lesson => lesson.levelId === level.id);
    levelCounts[level.id] = { completed: lessons.filter(lesson => completedSet.has(lesson.id)).length, total: lessons.length };
  });

  const openLevel = (levelId: RussianLevelId) => router.push(`/learn/ru/library?level=${levelId}` as never);
  const openNextLesson = () => {
    if (resumeLesson) router.push(`/learn/ru/lesson?id=${encodeURIComponent(resumeLesson.id)}` as never);
    else openLevel(2);
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <View style={styles.header}>
            <View style={styles.brandLockup}>
              <LinearGradient colors={['#2878DE', '#1259B5']} start={{ x: .9, y: 0 }} end={{ x: .1, y: 1 }} style={styles.brandMark}>
                <BookOpenCheck size={20} color="#F9E8B9" strokeWidth={2} />
              </LinearGradient>
              <View style={styles.brandCopy}>
                <Text style={styles.brandEyebrow}>LANGUAGE JOURNEY</Text>
                <Text style={styles.headerTitle}>مسیر یادگیری روسی</Text>
              </View>
            </View>
            <PageNavigation backFallback="/languages" />
          </View>

          <LinearGradient
            colors={['#FFFFFF', '#EDF5FF', '#DDEEFF']}
            start={{ x: .95, y: .08 }}
            end={{ x: .04, y: 1 }}
            style={[styles.welcomeBlock, compact && styles.welcomeBlockCompact]}
          >
            <View pointerEvents="none" style={styles.welcomeGlowOne} />
            <View pointerEvents="none" style={styles.welcomeGlowTwo} />
            <View style={styles.welcomeCopy}>
              <View style={styles.welcomeEyebrowRow}>
                <Sparkles size={13} color={HomeColors.gold} />
                <Text style={styles.welcomeEyebrow}>RUSSIAN JOURNEY</Text>
              </View>
              <Text style={styles.welcomeTitle}>سلام! آماده‌ای روسی را ادامه بدهی؟</Text>
              <Text style={styles.welcomeDescription}>یک جملهٔ کاربردی روسی، یک قدم دیگر در مسیر یادگیری.</Text>
              <View style={styles.welcomeTags}>
                <View style={styles.welcomeTag}>
                  <BookOpen size={12} color={HomeColors.gold} />
                  <Text style={styles.welcomeTagText}>یادگیری جمله‌محور</Text>
                </View>
                <View style={styles.welcomeTag}>
                  <Sparkles size={12} color="#168451" />
                  <Text style={styles.welcomeTagText}>تلفظ و تکیهٔ روسی</Text>
                </View>
              </View>
            </View>
            <View style={[styles.welcomeVisual, compact && styles.welcomeVisualCompact]}>
              <Image source={require('../assets/language-learning-hero.jpg')} resizeMode="cover" style={styles.welcomeImage} />
              <LinearGradient colors={['rgba(16,42,86,0.02)', 'rgba(16,42,86,0.36)']} style={styles.welcomeImageShade} />
              <View style={styles.welcomeImageStamp}>
                <Text style={styles.welcomeImageStampMain}>РУ</Text>
                <View style={styles.welcomeImageStampLine} />
                <Text style={styles.welcomeImageStampSub}>RUSSIAN</Text>
              </View>
            </View>
          </LinearGradient>

          {!!error && (
            <View style={russianOnlyStyles.errorCard}>
              <Text accessibilityRole="alert" style={russianOnlyStyles.errorText}>{error}</Text>
              <Pressable accessibilityRole="button" onPress={() => setRetry(value => value + 1)}>
                <Text style={russianOnlyStyles.retryText}>تلاش دوباره</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.lessonCard}>
            <LinearGradient colors={['#4D9AF2', '#21A7C0', '#4D9AF2']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.lessonCardAccent} />
            <View style={styles.lessonMetaRow}>
              <View style={styles.levelTag}>
                <View style={[styles.levelTagDot, { backgroundColor: activeLevel.color }]} />
                <Text style={[styles.levelTagName, { color: activeLevel.color }]}>{activeLevel.title}</Text>
                <Text style={styles.levelTagDivider}>·</Text>
                <Text style={[styles.levelTagText, { color: activeLevel.color, writingDirection: 'ltr' }]}>{activeLevel.cefr}</Text>
              </View>
              <Text style={styles.lessonOrder}>{fa(heroLessonOrder)} از {fa(RUSSIAN_LESSONS.length)}</Text>
            </View>

            <View style={styles.lessonHeading}>
              <Text style={styles.lessonEyebrow}>ادامهٔ یادگیری روسی</Text>
              <Text style={styles.lessonTitle}>{nextLesson ? heroLesson.title : 'مسیر آغازین تکمیل شد'}</Text>
              <Text style={styles.lessonSubtitle}>{nextLesson ? heroLesson.subtitle : 'درس‌های موجود را مرور کن یا نقشهٔ سطح‌ها را ببین.'}</Text>
            </View>

            <View style={styles.sentenceCard}>
              <View style={styles.sentenceTopRow}>
                <View style={styles.sentenceIcon}><BookOpen size={15} color={HomeColors.accent} /></View>
                <Text style={styles.sentenceLabel}>جملهٔ منتخب این درس</Text>
                <Text style={styles.sentenceNumber}>{fa(1)} / {fa(heroLesson.sentences.length)}</Text>
              </View>
              <Text style={styles.sentenceEnglish}>{firstSentence.text}</Text>
              <Text style={styles.sentencePersian}>{firstSentence.fa}</Text>
              <Text style={russianOnlyStyles.sentencePronunciation}>{firstSentence.pronunciation}</Text>
              {!!firstSentence.vocabulary.length && (
                <View style={styles.wordChipRow}>
                  {firstSentence.vocabulary.map(item => (
                    <View key={`${firstSentence.id}-${item.word}`} style={styles.wordChip}>
                      <Text style={styles.wordChipEn}>{item.word}</Text>
                      <Text style={styles.wordChipDivider}>·</Text>
                      <Text style={styles.wordChipFa}>{item.meaning}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.levelProgressBlock}>
              <View style={styles.levelProgressMeta}>
                <Text style={styles.levelProgressLabel}>پیشرفت در {activeLevel.title}</Text>
                <Text style={styles.levelProgressValue}>{fa(levelCompleted)} از {fa(levelLessons.length)} درس</Text>
              </View>
              <EnglishProgressTrack value={levelProgress} color={activeLevel.color} height={7} />
            </View>

            <View style={styles.lessonFooter}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={hasStartedCourse ? 'ادامهٔ آموزش روسی' : 'شروع اولین درس روسی'}
                style={({ pressed }) => [styles.continueButton, pressed && styles.buttonPressed]}
                onPress={openNextLesson}
              >
                <LinearGradient colors={['#2878DE', '#1259B5']} start={{ x: .96, y: 0 }} end={{ x: .04, y: 1 }} style={styles.continueButtonGradient}>
                  <Play size={16} color="#F5E7BC" fill="#F5E7BC" />
                  <Text style={styles.continueButtonText}>{resumeLesson ? hasStartedCourse ? 'ادامهٔ آموزش' : 'شروع اولین درس' : 'مشاهدهٔ سطح‌های بعدی'}</Text>
                  <ChevronLeft size={17} color="#FFFFFF" />
                </LinearGradient>
              </Pressable>
              <View style={styles.lessonCountPill}>
                <Text style={styles.lessonCountValue}>{fa(heroLesson.sentences.length)}</Text>
                <Text style={styles.lessonCountLabel}>جمله</Text>
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="گوش دادن از ابتدای آموزش روسی"
              style={({ pressed }) => [styles.startFromBeginningButton, pressed && styles.buttonPressed]}
              onPress={() => router.push({ pathname: '/learn/ru/lesson', params: { id: RUSSIAN_LESSONS[0].id, fromStart: '1' } } as never)}
            >
              <Volume2 size={17} color={HomeColors.accent} />
              <Text style={styles.startFromBeginningText}>گوش دادن از ابتدا</Text>
            </Pressable>
          </View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleBlock}>
              <Text style={styles.sectionEyebrow}>TODAY AT A GLANCE</Text>
              <Text style={styles.sectionTitle}>برنامهٔ امروز</Text>
            </View>
            <View style={styles.dailyGoalPill}>
              <Flame size={14} color={HomeColors.amber} />
              <Text style={styles.dailyGoalText}>{fa(dueCount)} جمله برای مرور</Text>
            </View>
          </View>

          <LinearGradient colors={['#FFFFFF', '#EDF5FF', '#E1F0FF']} start={{ x: .95, y: .05 }} end={{ x: .04, y: 1 }} style={styles.todayCard}>
            <View pointerEvents="none" style={styles.todayGlow} />
            <View style={styles.todayTopRow}>
              <View style={styles.todayIcon}><Clock3 size={18} color={HomeColors.gold} /></View>
              <View style={styles.todayCopy}>
                <Text style={styles.todayValue}>{fa(completedCount)} <Text style={styles.todayUnit}>درس</Text></Text>
                <Text style={styles.todayLabel}>درس‌های تکمیل‌شده در مسیر روسی</Text>
              </View>
              <View style={styles.todayPercentPill}>
                <Text style={styles.todayPercentText}>{fa(Math.round(courseProgressPercent))}٪</Text>
              </View>
            </View>
            <View style={styles.todayProgressTrack}>
              <EnglishProgressTrack value={courseProgressPercent} color={HomeColors.gold} trackColor="rgba(255,255,255,0.17)" height={7} />
            </View>
            <View style={styles.todayFootnote}>
              <BookOpen size={14} color={HomeColors.gold} />
              <Text style={styles.todayFootnoteText}>{fa(sentenceCount)} جملهٔ آموزشی · {fa(uniqueWords)} واژه/عبارت یکتا</Text>
            </View>
          </LinearGradient>

          <View style={styles.pathPanel}>
            <View style={styles.panelHeadingRow}>
              <View style={styles.panelHeadingText}>
                <Text style={styles.panelEyebrow}>RUSSIAN LEARNING PATH</Text>
                <Text style={styles.panelTitle}>مسیر یادگیری روسی</Text>
              </View>
              <Pressable accessibilityRole="button" style={styles.libraryLink} onPress={() => router.push('/learn/ru/library' as never)}>
                <Text style={styles.libraryLinkText}>کتابخانه</Text>
                <ChevronLeft size={16} color={HomeColors.accent} />
              </Pressable>
            </View>

            <View style={styles.railWrap}>
              <EnglishLevelRail activeLevelId={activeLevel.id} counts={levelCounts} levels={RUSSIAN_LEVELS} accessibilityLabelPrefix="فهرست درس‌های" direction="rtl" onSelect={openLevel} />
            </View>

            <View style={styles.currentLevelCard}>
              <View style={[styles.levelNumber, { backgroundColor: `${activeLevel.color}14` }]}>
                <Text style={[styles.levelNumberText, { color: activeLevel.color }]}>{fa(activeLevel.id)}</Text>
              </View>
              <View style={styles.currentLevelCopy}>
                <Text style={styles.currentLevelName}>{activeLevel.title}</Text>
                <Text style={styles.currentLevelDescription}>{activeLevel.description}</Text>
              </View>
              <View style={styles.currentLevelCount}>
                <Text style={[styles.levelCountValue, { color: activeLevel.color }]}>{fa(levelCompleted)} / {fa(levelLessons.length)}</Text>
                <Text style={styles.levelCountLabel}>درس</Text>
              </View>
            </View>

            <Pressable accessibilityRole="button" accessibilityState={{ expanded: showRoadmap }} style={styles.mapToggle} onPress={() => setShowRoadmap(value => !value)}>
              <View style={styles.mapToggleIcon}><Compass size={16} color={HomeColors.accent} /></View>
              <View style={styles.mapToggleText}>
                <Text style={styles.mapToggleTitle}>{showRoadmap ? 'بستن نقشهٔ کامل سطح‌ها' : 'دیدن جزئیات سطح‌ها'}</Text>
                <Text style={styles.mapToggleMeta}>{activeLevel.modules.slice(0, 3).map(displayEnglishModuleLabel).join(' · ')}</Text>
              </View>
              {showRoadmap ? <ChevronUp size={18} color={HomeColors.accent} /> : <ChevronDown size={18} color={HomeColors.muted} />}
            </Pressable>

            {showRoadmap && (
              <View style={styles.fullRoadmap}>
                {RUSSIAN_LEVELS.map(level => {
                  const count = levelCounts[level.id] ?? { completed: 0, total: 0 };
                  const passed = count.total > 0 && count.completed === count.total;
                  return (
                    <Pressable
                      key={level.id}
                      accessibilityRole="button"
                      accessibilityLabel={`فهرست درس‌های ${level.title}`}
                      style={({ pressed }) => [styles.levelCard, level.id === activeLevel.id && styles.levelCardActive, pressed && styles.buttonPressed]}
                      onPress={() => openLevel(level.id)}
                    >
                      <View style={[styles.levelNumber, { backgroundColor: `${level.color}14` }]}>
                        {passed ? <Check size={17} color={level.color} strokeWidth={2.6} /> : <Text style={[styles.levelNumberText, { color: level.color }]}>{fa(level.id)}</Text>}
                      </View>
                      <View style={styles.levelText}>
                        <View style={styles.levelTitleRow}>
                          <Text style={styles.levelTitle}>{level.title}</Text>
                          <Text style={[styles.levelCefr, { color: level.color }]}>{level.cefr}</Text>
                        </View>
                        <Text style={styles.levelDesc} numberOfLines={1}>{level.description}</Text>
                        <Text style={styles.levelStats}>{fa(count.completed)} از {fa(count.total)} درس · {level.status === 'planned' ? 'در نقشهٔ آینده' : 'محتوای موجود'}</Text>
                      </View>
                      <ChevronLeft size={18} color={HomeColors.muted} />
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles.quickSection}>
            <View style={styles.sectionHeading}>
              <View style={styles.sectionTitleBlock}>
                <Text style={styles.sectionEyebrow}>KEEP GOING</Text>
                <Text style={styles.sectionTitle}>میان‌برهای تو</Text>
              </View>
            </View>
            <View style={[styles.quickRow, compact && styles.quickRowCompact]}>
              <Pressable accessibilityRole="button" style={styles.quickCard} onPress={() => router.push('/learn/ru/review' as never)}>
                <View style={[styles.quickIcon, { backgroundColor: HomeColors.sageSoft }]}><RefreshCw size={18} color={HomeColors.sage} /></View>
                <View style={styles.quickCopy}>
                  <Text style={styles.quickTitle}>مرور جمله‌های روسی</Text>
                  <Text style={styles.quickDesc}>کارت‌های زمان‌بندی‌شدهٔ روسی</Text>
                </View>
                <ChevronLeft size={17} color={HomeColors.muted} />
              </Pressable>
              <Pressable accessibilityRole="button" style={styles.quickCard} onPress={() => router.push('/learn/ru/library' as never)}>
                <View style={[styles.quickIcon, { backgroundColor: HomeColors.accentSoft }]}><MessageCircle size={18} color={HomeColors.accent} /></View>
                <View style={styles.quickCopy}>
                  <Text style={styles.quickTitle}>کتابخانهٔ درس‌های روسی</Text>
                  <Text style={styles.quickDesc}>سطح و درس روسی را انتخاب کن</Text>
                </View>
                <ChevronLeft size={17} color={HomeColors.muted} />
              </Pressable>
            </View>
          </View>

          <LinearGradient colors={['#FFFFFF', '#EDF5FF']} start={{ x: .95, y: .1 }} end={{ x: .05, y: 1 }} style={styles.noteCard}>
            <View style={styles.noteIcon}><Sparkles size={16} color={HomeColors.gold} /></View>
            <View style={styles.noteCopy}>
              <Text style={styles.noteTitle}>یادگیری روسی در بافت</Text>
              <Text style={styles.noteText}>جمله‌های روسی را همراه با معنی فارسی، تلفظ و واژه‌های کاربردی یاد بگیر.</Text>
            </View>
            <View style={styles.noteOrnament} pointerEvents="none"><Sparkles size={30} color="rgba(216,183,110,0.22)" /></View>
          </LinearGradient>
        </View>
      </ScrollView>
      <RussianBottomNav />
    </View>
  );
}
