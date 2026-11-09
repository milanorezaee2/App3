import { LocalizedText as Text } from '@/components/LocalizedText';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
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
  RotateCcw,
  Volume2,
} from 'lucide-react-native';
import { PageNavigation } from '@/components/PageNavigation';
import { StarterBottomNav } from '@/components/StarterBottomNav';
import { LearningHomeColors as HomeColors, learningHomeStyles as styles } from '@/components/LearningHomeStyles';
import { EnglishLevelRail, EnglishProgressTrack, displayEnglishModuleLabel } from '@/components/EnglishUI';
import { starterDisplayPronunciation } from '@/lib/languages/starterEditorial';
import type { StarterCourse, StarterLesson } from '@/lib/languages/newCourses';
import type { CourseLevelId as StarterLevelId } from '@/lib/courseContent';
import type { CourseProgress } from '@/lib/courseProgress';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';

const starterOnlyStyles = StyleSheet.create({
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
  foundationCard: { padding: 16, borderRadius: 18, borderWidth: 1, borderColor: '#D8D5FF', backgroundColor: '#F5F3FF', gap: 8 },
  foundationTitle: { fontFamily: Typography.boldFontFamily, fontSize: 16, lineHeight: 26, color: '#312E81', textAlign: 'right', writingDirection: 'rtl' },
  foundationText: { fontFamily: Typography.fontFamily, fontSize: 13, lineHeight: 22, color: '#334155', textAlign: 'right', writingDirection: 'rtl' },
  foundationButton: { alignSelf: 'flex-end', minHeight: 44, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 12, backgroundColor: '#5146E5' },
  foundationButtonText: { fontFamily: Typography.boldFontFamily, color: '#FFFFFF', fontSize: 13, writingDirection: 'rtl' },
  retryText: {
    fontFamily: Typography.fontFamily,
    color: HomeColors.accent,
    fontSize: 11,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default function StarterHome({course}: {course: StarterCourse}) {
  const {lessons, levels, progress: courseProgress} = course;
  const {loadStarterLessonSessionWithPresence} = course.sessions;
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
    void Promise.all([courseProgress.getCourseProgress(), courseProgress.getDueReviewCards()])
      .then(async ([nextProgress, cards]) => {
        if (!alive) return;
        setProgress(nextProgress);
        setDueCount(cards.length);
        setError('');
        const completed = new Set(nextProgress.completedLessonIds);
        const currentLesson = lessons.find(lesson => lesson.id === nextProgress.currentLessonId && !completed.has(lesson.id))
          ?? lessons.find(lesson => !completed.has(lesson.id));
        const savedSession = currentLesson
          ? await loadStarterLessonSessionWithPresence(currentLesson.id).catch(() => null)
          : null;
        if (!alive) return;
        setHasStartedCourse(nextProgress.completedLessonIds.length > 0 || !!savedSession?.hasSavedSession);
      })
      .catch(() => { if (alive) setError('پیشرفت این زبان خوانده نشد؛ اطلاعات قبلی تغییر نکرده است. دوباره تلاش کنید.'); });
    return () => { alive = false; };
  }, [retry]));

  const completedIds = progress?.completedLessonIds ?? [];
  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const nextLesson = lessons.find(lesson => !completedSet.has(lesson.id));
  const savedCurrentLesson = lessons.find(lesson => lesson.id === progress?.currentLessonId && !completedSet.has(lesson.id));
  const resumeLesson = savedCurrentLesson ?? nextLesson;
  const unfinishedFoundation = lessons.find(lesson => !!lesson.learningMode && !completedSet.has(lesson.id));
  const hasLegacyProgress = !!progress && (progress.completedLessonIds.some(id => id.startsWith(`${course.id}-pre-`)) || progress.currentLessonId.startsWith(`${course.id}-pre-`));
  const heroLesson = resumeLesson ?? lessons[lessons.length - 1];
  const activeLevel = levels.find(level => level.id === (resumeLesson?.levelId ?? heroLesson.levelId)) ?? levels[0];
  const completedCount = lessons.filter(lesson => completedSet.has(lesson.id)).length;
  const levelLessons = lessons.filter(lesson => lesson.levelId === activeLevel.id);
  const levelCompleted = levelLessons.filter(lesson => completedSet.has(lesson.id)).length;
  const levelProgress = levelLessons.length ? (levelCompleted / levelLessons.length) * 100 : 0;
  const sentenceCount = lessons.reduce((count, lesson) => count + lesson.sentences.length, 0);
  const uniqueWords = new Set(lessons.flatMap(lesson => lesson.sentences.flatMap(sentence => sentence.vocabulary.map(item => item.word)))).size;
  const firstSentence = heroLesson.sentences[0];
  const heroLessonOrder = Math.max(1, lessons.findIndex(lesson => lesson.id === heroLesson.id) + 1);
  const courseProgressPercent = lessons.length ? (completedCount / lessons.length) * 100 : 0;
  const levelCounts = {} as Partial<Record<StarterLevelId, { completed: number; total: number }>>;
  levels.forEach(level => {
    const inLevel = lessons.filter(lesson => lesson.levelId === level.id);
    levelCounts[level.id] = { completed: inLevel.filter(lesson => completedSet.has(lesson.id)).length, total: inLevel.length };
  });

  const openLevel = (levelId: StarterLevelId) => router.push(`${course.home}/library?level=${levelId}` as never);

  const restartFromBeginnerLevel = () => {
    Alert.alert('شروع مجدد از سطح ابتدایی', 'می‌خواهید دوباره از اولین درسِ سطح ابتداییِ این زبان شروع کنید؟ پیشرفت و جلسهٔ قبلی شما محفوظ می‌ماند.', [
      { text: 'انصراف', style: 'cancel' },
      { text: 'شروع مجدد', onPress: () => router.push({ pathname: `${course.home}/lesson`, params: { id: lessons[0].id, fromStart: 'restart' } } as never) },
    ]);
  };
  const openNextLesson = () => {
    if (resumeLesson) router.push(`${course.home}/lesson?id=${encodeURIComponent(resumeLesson.id)}` as never);
    else openLevel(-1);
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <View style={styles.header}>
            <View style={styles.brandLockup}>
              <LinearGradient colors={['#635BFF', '#4338CA']} start={{ x: .9, y: 0 }} end={{ x: .1, y: 1 }} style={styles.brandMark}>
                <BookOpenCheck size={20} color="#F9E8B9" strokeWidth={2} />
              </LinearGradient>
              <View style={styles.brandCopy}>
                <Text style={styles.brandEyebrow}>LANGUAGE JOURNEY</Text>
                <Text style={styles.headerTitle}>مسیر یادگیری {course.name}</Text>
              </View>
            </View>
            <PageNavigation backFallback="/languages" />
          </View>

          <LinearGradient
            colors={['#FFFFFF', '#FAF9F5', '#F4F1EA']}
            start={{ x: .95, y: .08 }}
            end={{ x: .04, y: 1 }}
            style={[styles.welcomeBlock, compact && styles.welcomeBlockCompact]}
          >
            <View pointerEvents="none" style={styles.welcomeGlowOne} />
            <View pointerEvents="none" style={styles.welcomeGlowTwo} />
            <View style={styles.welcomeCopy}>
              <View style={styles.welcomeEyebrowRow}>
                <Sparkles size={13} color={HomeColors.gold} />
                <Text style={styles.welcomeEyebrow}>LANGUAGE JOURNEY</Text>
              </View>
              <Text style={styles.welcomeTitle}>سلام! آماده‌ای {course.name} را ادامه بدهی؟</Text>
              <Text style={styles.welcomeDescription}>یک واژه یا عبارت کاربردی {course.name}، یک قدم دیگر در مسیر یادگیری.</Text>
              <View style={styles.welcomeTags}>
                <View style={styles.welcomeTag}>
                  <BookOpen size={12} color={HomeColors.gold} />
                  <Text style={styles.welcomeTagText}>یادگیری گام‌به‌گام</Text>
                </View>
                <View style={styles.welcomeTag}>
                  <Sparkles size={12} color="#07886A" />
                  <Text style={styles.welcomeTagText}>تلفظ و شنیدن</Text>
                </View>
              </View>
            </View>
            <View style={[styles.welcomeVisual, compact && styles.welcomeVisualCompact]}>
              <Image source={require('../assets/language-learning-hero.jpg')} resizeMode="cover" style={styles.welcomeImage} />
              <LinearGradient colors={['rgba(16,42,86,0.02)', 'rgba(16,42,86,0.36)']} style={styles.welcomeImageShade} />
              <View style={styles.welcomeImageStamp}>
                <Text style={styles.welcomeImageStampMain}>✦</Text>
                <View style={styles.welcomeImageStampLine} />
                <Text style={styles.welcomeImageStampSub}>{course.brand}</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.pathPanel}>
            <Text style={styles.panelHint}>درس‌های Pre-A1، A1، A2 و درس‌های مقدماتی B1 و B2 در دسترس‌اند؛ درس‌های مرتبط لزوماً همهٔ بخش‌های هر سرفصل را پوشش نمی‌دهند.{course.id === 'es' ? ' گونهٔ اسپانیای اسپانیا مبناست.' : ''}</Text>
            <View style={styles.panelHeadingRow}>
              <View style={styles.panelHeadingText}>
                <Text style={styles.panelEyebrow}>LEARNING PATH</Text>
                <Text style={styles.panelTitle}>سطح {course.name} خودت را انتخاب کن</Text>
                <Text style={styles.panelHint}>از هر سطحی که درس دارد شروع کن.</Text>
              </View>
              <Pressable accessibilityRole="button" style={styles.libraryLink} onPress={() => router.push(`${course.home}/library` as never)}>
                <Text style={styles.libraryLinkText}>کتابخانه</Text>
                <ChevronLeft size={16} color={HomeColors.accent} />
              </Pressable>
            </View>

            <View style={styles.railWrap}>
              <EnglishLevelRail activeLevelId={activeLevel.id} counts={{...levelCounts, 2: undefined}} levels={levels} accessibilityLabelPrefix="فهرست درس‌های" direction="rtl" displayNumber={id => Math.max(0, id)} onSelect={openLevel} />
            </View>

            <View style={styles.currentLevelCard}>
              <View style={[styles.levelNumber, { backgroundColor: `${activeLevel.color}14` }]}>
                <Text style={[styles.levelNumberText, { color: activeLevel.color }]}>{fa(Math.max(0, activeLevel.id))}</Text>
              </View>
              <View style={styles.currentLevelCopy}>
                <Text style={styles.currentLevelName}>{activeLevel.title}</Text>
                <Text style={styles.currentLevelDescription} numberOfLines={2}>{activeLevel.description}</Text>
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
                {levels.map(level => {
                  const count = levelCounts[level.id] ?? { completed: 0, total: 0 };
                  const passed = level.id !== 2 && level.id !== 3 && level.id !== 4 && count.total > 0 && count.completed === count.total;
                  return (
                    <Pressable
                      key={level.id}
                      accessibilityRole="button"
                      accessibilityLabel={`فهرست درس‌های ${level.title}`}
                      style={({ pressed }) => [styles.levelCard, level.id === activeLevel.id && styles.levelCardActive, pressed && styles.buttonPressed]}
                      onPress={() => openLevel(level.id)}
                    >
                      <View style={[styles.levelNumber, { backgroundColor: `${level.color}14` }]}>
                        {passed ? <Check size={17} color={level.color} strokeWidth={2.6} /> : <Text style={[styles.levelNumberText, { color: level.color }]}>{fa(Math.max(0, level.id))}</Text>}
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

          {!!error && (
            <View style={starterOnlyStyles.errorCard}>
              <Text accessibilityRole="alert" style={starterOnlyStyles.errorText}>{error}</Text>
              <Pressable accessibilityRole="button" onPress={() => setRetry(value => value + 1)}>
                <Text style={starterOnlyStyles.retryText}>تلاش دوباره</Text>
              </Pressable>
            </View>
          )}

          {hasLegacyProgress && unfinishedFoundation ? <View style={starterOnlyStyles.foundationCard}>
            <Text style={starterOnlyStyles.foundationTitle}>درس‌های پایهٔ تازه اضافه شده‌اند</Text>
            <Text style={starterOnlyStyles.foundationText}>برای مرور صداها، واژه‌ها و عبارت‌های کوتاه می‌توانید از اینجا شروع کنید. درس و پیشرفت قبلی شما محفوظ است.</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="شروع درس‌های پایهٔ جدید" style={starterOnlyStyles.foundationButton} onPress={() => router.push(`${course.home}/lesson?id=${encodeURIComponent(unfinishedFoundation.id)}` as never)}><Text style={starterOnlyStyles.foundationButtonText}>دیدن درس‌های پایه</Text></Pressable>
          </View> : null}

          <Pressable accessibilityRole="button" accessibilityLabel="نقشهٔ A1 این زبان" style={starterOnlyStyles.foundationCard} onPress={() => router.push(`${course.home}/library?level=1` as never)}>
            <Text style={starterOnlyStyles.foundationTitle}>نقشهٔ A1 · Foundation و Survival</Text>
            <Text style={starterOnlyStyles.foundationText}>۲۵ موضوع پایه و ۳۰ موضوع کاربردی؛ درس‌های مرتبط موجود و موضوعات در حال تدوین را ببینید.</Text>
          </Pressable>

          <Pressable accessibilityRole="button" accessibilityLabel="نقشهٔ B1 این زبان" style={starterOnlyStyles.foundationCard} onPress={() => router.push(`${course.home}/library?level=3` as never)}>
            <Text style={starterOnlyStyles.foundationTitle}>نقشهٔ B1 · Foundation و Survival</Text>
            <Text style={starterOnlyStyles.foundationText}>۲۵ موضوع پایه و ۳۰ موقعیت کاربردی؛ ارتباط درس‌ها با موضوع‌ها جزئی است و به معنی پوشش کامل نیست.</Text>
          </Pressable>

          <Pressable accessibilityRole="button" accessibilityLabel="نقشهٔ B2 این زبان" style={starterOnlyStyles.foundationCard} onPress={() => router.push(`${course.home}/library?level=4` as never)}>
            <Text style={starterOnlyStyles.foundationTitle}>نقشهٔ B2 · Foundation و Survival</Text>
            <Text style={starterOnlyStyles.foundationText}>۲۵ موضوع پایه و ۳۰ موقعیت پیشرفته؛ درس‌های مرتبط و سرفصل‌های در حال تدوین را ببینید.</Text>
          </Pressable>

          <View style={styles.lessonCard}>
            <LinearGradient colors={['#4D9AF2', '#20C49A', '#4D9AF2']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.lessonCardAccent} />
            <View style={styles.lessonMetaRow}>
              <View style={styles.levelTag}>
                <View style={[styles.levelTagDot, { backgroundColor: activeLevel.color }]} />
                <Text style={[styles.levelTagName, { color: activeLevel.color }]}>{activeLevel.title}</Text>
                <Text style={styles.levelTagDivider}>·</Text>
                <Text style={[styles.levelTagText, { fontFamily: 'Times New Roman', color: activeLevel.color, writingDirection: 'ltr' }]}>{activeLevel.cefr}</Text>
              </View>
              <Text style={styles.lessonOrder}>{fa(heroLessonOrder)} از {fa(lessons.length)}</Text>
            </View>

            <View style={styles.lessonHeading}>
              <Text style={styles.lessonEyebrow}>ادامهٔ یادگیری این زبان</Text>
              <Text style={styles.lessonTitle}>{nextLesson ? heroLesson.title : 'درس‌های موجود تکمیل شد'}</Text>
              <Text style={styles.lessonSubtitle}>{nextLesson ? heroLesson.subtitle : 'درس‌های موجود را مرور کن یا نقشهٔ سطح‌ها را ببین.'}</Text>
            </View>

            <View style={styles.sentenceCard}>
              <View style={styles.sentenceTopRow}>
                <View style={styles.sentenceIcon}><BookOpen size={15} color={HomeColors.accent} /></View>
                <Text style={styles.sentenceLabel}>{heroLesson.learningMode === 'chunks' ? 'عبارت منتخب این درس' : heroLesson.learningMode ? 'واژهٔ منتخب این درس' : 'جملهٔ منتخب این درس'}</Text>
                <Text style={styles.sentenceNumber}>{fa(1)} / {fa(heroLesson.sentences.length)}</Text>
              </View>
              <Text style={styles.sentenceEnglish}>{firstSentence.text}</Text>
              <Text style={styles.sentencePersian}>{firstSentence.fa}</Text>
              <Text style={starterOnlyStyles.sentencePronunciation}>{starterDisplayPronunciation(firstSentence)}</Text>
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
                <Text style={styles.levelProgressLabel}>پیشرفت درس‌های موجود در {activeLevel.title}</Text>
                <Text style={styles.levelProgressValue}>{fa(levelCompleted)} از {fa(levelLessons.length)} درس</Text>
              </View>
              <EnglishProgressTrack value={levelProgress} color={activeLevel.color} height={7} />
            </View>

            <View style={styles.lessonFooter}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={hasStartedCourse ? 'ادامهٔ آموزش این زبان' : 'شروع اولین درس این زبان'}
                style={({ pressed }) => [styles.continueButton, pressed && styles.buttonPressed]}
                onPress={openNextLesson}
              >
                <LinearGradient colors={['#635BFF', '#4338CA']} start={{ x: .96, y: 0 }} end={{ x: .04, y: 1 }} style={styles.continueButtonGradient}>
                  <Play size={16} color="#F5E7BC" fill="#F5E7BC" />
                  <Text style={styles.continueButtonText}>{resumeLesson ? hasStartedCourse ? 'ادامهٔ آموزش' : 'شروع اولین درس' : 'مشاهدهٔ سطح‌های بعدی'}</Text>
                  <ChevronLeft size={17} color="#FFFFFF" />
                </LinearGradient>
              </Pressable>
              <View style={styles.lessonCountPill}>
                <Text style={styles.lessonCountValue}>{fa(heroLesson.sentences.length)}</Text>
                <Text style={styles.lessonCountLabel}>{heroLesson.learningMode === 'chunks' ? 'عبارت' : heroLesson.learningMode ? 'واژه' : 'جمله'}</Text>
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="شروع از ابتدای این درس"
              style={({ pressed }) => [styles.startFromBeginningButton, pressed && styles.buttonPressed]}
              onPress={() => router.push({ pathname: `${course.home}/lesson`, params: { id: heroLesson.id, fromStart: '1' } } as never)}
            >
              <Volume2 size={17} color={HomeColors.accent} />
              <Text style={styles.startFromBeginningText}>شروع از ابتدا</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="شروع مجدد آموزش این زبان از سطح ابتدایی"
              style={({ pressed }) => [styles.startFromBeginningButton, pressed && styles.buttonPressed]}
              onPress={restartFromBeginnerLevel}
            >
              <RotateCcw size={17} color={HomeColors.accent} />
              <Text style={styles.startFromBeginningText}>شروع مجدد از سطح ابتدایی</Text>
            </Pressable>
          </View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleBlock}>
              <Text style={styles.sectionEyebrow}>TODAY AT A GLANCE</Text>
              <Text style={styles.sectionTitle}>برنامهٔ امروز</Text>
            </View>
            <View style={styles.dailyGoalPill}>
              <Flame size={14} color={HomeColors.amber} />
              <Text style={styles.dailyGoalText}>{fa(dueCount)} نمونه برای مرور</Text>
            </View>
          </View>

          <LinearGradient colors={['#FFFFFF', '#FAF9F5', '#F4F1EA']} start={{ x: .95, y: .05 }} end={{ x: .04, y: 1 }} style={styles.todayCard}>
            <View pointerEvents="none" style={styles.todayGlow} />
            <View style={styles.todayTopRow}>
              <View style={styles.todayIcon}><Clock3 size={18} color={HomeColors.gold} /></View>
              <View style={styles.todayCopy}>
                <Text style={styles.todayValue}>{fa(completedCount)} <Text style={styles.todayUnit}>درس</Text></Text>
                <Text style={styles.todayLabel}>درس‌های تکمیل‌شده در مسیر این زبان</Text>
              </View>
              <View style={styles.todayPercentPill}>
                <Text style={styles.todayPercentText}>{fa(Math.round(courseProgressPercent))}٪</Text>
              </View>
            </View>
            <View style={styles.todayProgressTrack}>
              <EnglishProgressTrack value={courseProgressPercent} color={HomeColors.gold} trackColor="#E7E3DA" height={7} />
            </View>
            <View style={styles.todayFootnote}>
              <BookOpen size={14} color={HomeColors.gold} />
              <Text style={styles.todayFootnoteText}>{fa(sentenceCount)} نمونهٔ آموزشی · {fa(uniqueWords)} واژه/عبارت یکتا</Text>
            </View>
          </LinearGradient>

          <View style={styles.quickSection}>
            <View style={styles.sectionHeading}>
              <View style={styles.sectionTitleBlock}>
                <Text style={styles.sectionEyebrow}>KEEP GOING</Text>
                <Text style={styles.sectionTitle}>میان‌برهای تو</Text>
              </View>
            </View>
            <View style={[styles.quickRow, compact && styles.quickRowCompact]}>
              <Pressable accessibilityRole="button" style={styles.quickCard} onPress={() => router.push(`${course.home}/review` as never)}>
                <View style={[styles.quickIcon, { backgroundColor: HomeColors.sageSoft }]}><RefreshCw size={18} color={HomeColors.sage} /></View>
                <View style={styles.quickCopy}>
                  <Text style={styles.quickTitle}>مرور آموخته‌های این زبان</Text>
                  <Text style={styles.quickDesc}>کارت‌های زمان‌بندی‌شدهٔ این زبان</Text>
                </View>
                <ChevronLeft size={17} color={HomeColors.muted} />
              </Pressable>
              <Pressable accessibilityRole="button" style={styles.quickCard} onPress={() => router.push(`${course.home}/library` as never)}>
                <View style={[styles.quickIcon, { backgroundColor: HomeColors.accentSoft }]}><MessageCircle size={18} color={HomeColors.accent} /></View>
                <View style={styles.quickCopy}>
                  <Text style={styles.quickTitle}>کتابخانهٔ درس‌های این زبان</Text>
                  <Text style={styles.quickDesc}>سطح و درس این زبان را انتخاب کن</Text>
                </View>
                <ChevronLeft size={17} color={HomeColors.muted} />
              </Pressable>
            </View>
          </View>

          <View style={styles.noteCard}>
            <Sparkles size={16} color={HomeColors.accent} />
            <Text style={styles.noteText}>هر روز، یک قدم کوچک.</Text>
          </View>
        </View>
      </ScrollView>
      <StarterBottomNav course={course} />
    </View>
  );
}
