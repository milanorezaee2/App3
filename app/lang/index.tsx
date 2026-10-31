import { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  ArrowLeft,
  BookOpen,
  BookOpenCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock3,
  Compass,
  Cloud,
  Download,
  Flame,
  MessageCircle,
  Play,
  RefreshCw,
  Sparkles,
  Volume2,
} from 'lucide-react-native';
import { AppBottomNav } from '@/components/AppBottomNav';
import { PageNavigation } from '@/components/PageNavigation';
import { COURSE_LEVELS, SENTENCE_LESSONS } from '@/lib/courseContent';
import { getCourseProgress, type CourseProgress } from '@/lib/courseProgress';
import { syncPersonalLearningData } from '@/lib/personalLearningSync';
import { LearningHomeColors as HomeColors, learningHomeStyles as styles } from '@/components/LearningHomeStyles';
import { toPersianDigits } from '@/lib/format';
import { loadStudy, studyDay } from '@/lib/englishStudyState';
import { ENGLISH_ENGINE_BLUEPRINT, getEnglishLevelMetrics } from '@/lib/englishLearningEngine';
import { EnglishLevelRail, EnglishProgressTrack, displayEnglishModuleLabel } from '@/components/EnglishUI';



export default function LearningHome() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const compact = width < 640;
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [measuredMinutes, setMeasuredMinutes] = useState(0);
  const [timeError, setTimeError] = useState(false);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [hasStartedCourse, setHasStartedCourse] = useState(false);

  useFocusEffect(useCallback(() => {
    let alive = true;
    void loadStudy().then(state => {
      if (alive) {
        setMeasuredMinutes(Math.floor((state.days[studyDay()] ?? 0) / 6000) / 10);
        setTimeError(false);
      }
    }).catch(() => { if (alive) setTimeError(true); });
    return () => { alive = false; };
  }, []));

  useFocusEffect(useCallback(() => {
    let alive = true;
    const refreshCourse = async () => {
      const next = await getCourseProgress();
      if (!alive) return;
      setProgress(next);
      try {
        const study = await loadStudy();
        if (alive) setHasStartedCourse(next.completedLessonIds.length > 0 || !!study.sessions[next.currentLessonId]);
      } catch {
        if (alive) setHasStartedCourse(next.completedLessonIds.length > 0);
      }
    };
    void refreshCourse();
    void syncPersonalLearningData().then(result => {
      if (result.status === 'synced') return refreshCourse();
      return undefined;
    }).catch(() => undefined); // Local progress remains available if cloud setup or connectivity is unavailable.
    return () => { alive = false; };
  }, []));

  const currentLesson = SENTENCE_LESSONS.find(lesson => lesson.id === progress?.currentLessonId) ?? SENTENCE_LESSONS[0];
  const currentLevel = COURSE_LEVELS.find(level => level.id === currentLesson.levelId) ?? COURSE_LEVELS[0];
  const currentSentence = currentLesson.sentences[0];
  const completedIds = progress?.completedLessonIds ?? [];
  const completed = completedIds.length;
  const levelMetrics = getEnglishLevelMetrics(currentLevel.id, completedIds);
  const currentBlueprint = ENGLISH_ENGINE_BLUEPRINT.find(level => level.levelId === currentLevel.id);
  const dailyGoal = progress?.dailyGoalMinutes ?? 10;
  const dailyPct = Math.min(100, dailyGoal ? (measuredMinutes / dailyGoal) * 100 : 0);
  const levelCounts = Object.fromEntries(COURSE_LEVELS.map(level => {
    const metrics = getEnglishLevelMetrics(level.id, completedIds);
    return [level.id, { completed: metrics.completedLessonCount, total: metrics.lessonCount }];
  }));
  const levelProgress = levelMetrics.lessonCount
    ? (levelMetrics.completedLessonCount / levelMetrics.lessonCount) * 100
    : 0;

  const openLevel = (levelId: number) => router.push({ pathname: '/lang/library', params: { level: String(levelId) } } as never);
  const openCurrentLesson = () => router.push({ pathname: '/course/lesson', params: { id: currentLesson.id } } as never);

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
                <Text style={styles.headerTitle}>مسیر یادگیری انگلیسی</Text>
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
                <Text style={styles.welcomeEyebrow}>YOUR NEXT STEP</Text>
              </View>
              <Text style={styles.welcomeTitle}>سلام! آماده‌ای ادامه بدی؟</Text>
              <Text style={styles.welcomeDescription}>یک جملهٔ کاربردی، یک قدم دیگر در مسیر یادگیری.</Text>
              <View style={styles.welcomeTags}>
                <View style={styles.welcomeTag}>
                  <BookOpen size={12} color={HomeColors.gold} />
                  <Text style={styles.welcomeTagText}>یادگیری جمله‌محور</Text>
                </View>
                <View style={styles.welcomeTag}>
                  <Sparkles size={12} color="#B8E3D5" />
                  <Text style={styles.welcomeTagText}>تمرین کوتاه روزانه</Text>
                </View>
              </View>
            </View>
            <View style={[styles.welcomeVisual, compact && styles.welcomeVisualCompact]}>
              <Image source={require('../../assets/english-learning-hero.jpg')} resizeMode="cover" style={styles.welcomeImage} />
              <LinearGradient colors={['rgba(16,42,86,0.00)', 'rgba(16,42,86,0.12)']} style={styles.welcomeImageShade} />
              <View style={styles.welcomeImageStamp}>
                <Text style={styles.welcomeImageStampMain}>EN</Text>
                <View style={styles.welcomeImageStampLine} />
                <Text style={styles.welcomeImageStampSub}>LEARN</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.lessonCard}>
            <LinearGradient colors={['#4D9AF2', '#21A7C0', '#4D9AF2']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.lessonCardAccent} />
            <View style={styles.lessonMetaRow}>
              <View style={styles.levelTag}>
                <View style={[styles.levelTagDot, { backgroundColor: currentLevel.color }]} />
                <Text style={[styles.levelTagName, { color: currentLevel.color }]}>{currentLevel.title}</Text>
                <Text style={styles.levelTagDivider}>·</Text>
                <Text style={[styles.levelTagText, { color: currentLevel.color, writingDirection: currentLevel.id === 0 ? 'rtl' : 'ltr' }]}>{currentLevel.cefr}</Text>
              </View>
              <Text style={styles.lessonOrder}>{toPersianDigits(currentLesson.order)} از {toPersianDigits(SENTENCE_LESSONS.length)}</Text>
            </View>

            <View style={styles.lessonHeading}>
              <Text style={styles.lessonEyebrow}>ادامهٔ یادگیری</Text>
              <Text style={styles.lessonTitle}>{currentLesson.title}</Text>
              <Text style={styles.lessonSubtitle}>{currentLesson.subtitle}</Text>
            </View>

            {currentSentence ? (
              <View style={styles.sentenceCard}>
                <View style={styles.sentenceTopRow}>
                  <View style={styles.sentenceIcon}><BookOpen size={15} color={HomeColors.accent} /></View>
                  <Text style={styles.sentenceLabel}>جملهٔ منتخب این درس</Text>
                  <Text style={styles.sentenceNumber}>{toPersianDigits(1)} / {toPersianDigits(currentLesson.sentences.length)}</Text>
                </View>
                <Text style={styles.sentenceEnglish}>{currentSentence.en}</Text>
                <Text style={styles.sentencePersian}>{currentSentence.fa}</Text>
                {!!currentSentence.vocabulary.length && (
                  <View style={styles.wordChipRow}>
                    {currentSentence.vocabulary.map(item => (
                      <View key={`${currentSentence.id}-${item.word}`} style={styles.wordChip}>
                        <Text style={styles.wordChipEn}>{item.word}</Text>
                        <Text style={styles.wordChipDivider}>·</Text>
                        <Text style={styles.wordChipFa}>{item.meaning}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ) : null}

            <View style={styles.levelProgressBlock}>
              <View style={styles.levelProgressMeta}>
                <Text style={styles.levelProgressLabel}>پیشرفت در {currentLevel.title}</Text>
                <Text style={styles.levelProgressValue}>{toPersianDigits(levelMetrics.completedLessonCount)} از {toPersianDigits(levelMetrics.lessonCount)} درس</Text>
              </View>
              <EnglishProgressTrack value={levelProgress} color={currentLevel.color} height={7} />
            </View>

            <View style={styles.lessonFooter}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={hasStartedCourse ? 'ادامهٔ آموزش انگلیسی' : 'شروع اولین درس انگلیسی'}
                style={({ pressed }) => [styles.continueButton, pressed && styles.buttonPressed]}
                onPress={openCurrentLesson}
              >
                <LinearGradient colors={['#2878DE', '#1259B5']} start={{ x: .96, y: 0 }} end={{ x: .04, y: 1 }} style={styles.continueButtonGradient}>
                  <Play size={16} color="#F5E7BC" fill="#F5E7BC" />
                  <Text style={styles.continueButtonText}>{hasStartedCourse ? 'ادامهٔ آموزش' : 'شروع اولین درس'}</Text>
                  <ArrowLeft size={17} color="#FFFFFF" />
                </LinearGradient>
              </Pressable>
              <View style={styles.lessonCountPill}>
                <Text style={styles.lessonCountValue}>{toPersianDigits(currentLesson.sentences.length)}</Text>
                <Text style={styles.lessonCountLabel}>جمله</Text>
              </View>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="گوش دادن از ابتدای آموزش انگلیسی" style={styles.startFromBeginningButton} onPress={() => router.push({ pathname: '/course/lesson', params: { id: SENTENCE_LESSONS[0].id, fromStart: '1' } } as never)}>
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
              <Text style={styles.dailyGoalText}>{toPersianDigits(dailyGoal)} دقیقه هدف روزانه</Text>
            </View>
          </View>

          <LinearGradient colors={['#FFFFFF', '#EDF5FF', '#E1F0FF']} start={{ x: .95, y: .05 }} end={{ x: .04, y: 1 }} style={styles.todayCard}>
            <View pointerEvents="none" style={styles.todayGlow} />
            <View style={styles.todayTopRow}>
              <View style={styles.todayIcon}><Clock3 size={18} color={HomeColors.gold} /></View>
              <View style={styles.todayCopy}>
                <Text style={styles.todayValue}>{toPersianDigits(measuredMinutes)} <Text style={styles.todayUnit}>دقیقه</Text></Text>
                <Text style={styles.todayLabel}>{timeError ? 'زمان ثبت‌شده خوانده نشد' : 'زمان یادگیری ثبت‌شده امروز'}</Text>
              </View>
              <View style={styles.todayPercentPill}>
                <Text style={styles.todayPercentText}>{toPersianDigits(Math.round(dailyPct))}٪</Text>
              </View>
            </View>
            <View style={styles.todayProgressTrack}>
              <EnglishProgressTrack value={dailyPct} color={HomeColors.gold} trackColor="rgba(255,255,255,0.17)" height={7} />
            </View>
            <View style={styles.todayFootnote}>
              <BookOpen size={14} color={HomeColors.gold} />
              <Text style={styles.todayFootnoteText}>{toPersianDigits(completed)} از {toPersianDigits(SENTENCE_LESSONS.length)} درس اصلی تکمیل‌شده</Text>
              {progress?.currentStreak ? (
                <View style={styles.streakPill}>
                  <Flame size={12} color="#C4E8D8" />
                  <Text style={styles.streakText}>{toPersianDigits(progress.currentStreak)} روز پیاپی</Text>
                </View>
              ) : null}
            </View>
          </LinearGradient>

          <View style={styles.pathPanel}>
            <View style={styles.panelHeadingRow}>
              <View style={styles.panelHeadingText}>
                <Text style={styles.panelEyebrow}>YOUR LEARNING PATH</Text>
                <Text style={styles.panelTitle}>مسیر پنج‌سطحی</Text>
              </View>
              <Pressable accessibilityRole="button" style={styles.libraryLink} onPress={() => router.push('/lang/library' as never)}>
                <Text style={styles.libraryLinkText}>کتابخانه</Text>
                <ChevronLeft size={16} color={HomeColors.accent} />
              </Pressable>
            </View>

            <View style={styles.railWrap}>
              <EnglishLevelRail activeLevelId={currentLevel.id} counts={levelCounts} direction="rtl" onSelect={openLevel} />
            </View>

            <View style={styles.currentLevelCard}>
              <View style={[styles.levelNumber, { backgroundColor: `${currentLevel.color}14` }]}>
                <Text style={[styles.levelNumberText, { color: currentLevel.color }]}>{toPersianDigits(currentLevel.id)}</Text>
              </View>
              <View style={styles.currentLevelCopy}>
                <Text style={styles.currentLevelName}>{currentLevel.title}</Text>
                <Text style={styles.currentLevelDescription}>{currentLevel.description}</Text>
              </View>
              <View style={styles.currentLevelCount}>
                <Text style={[styles.levelCountValue, { color: currentLevel.color }]}>{toPersianDigits(levelMetrics.completedLessonCount)} / {toPersianDigits(levelMetrics.lessonCount)}</Text>
                <Text style={styles.levelCountLabel}>درس</Text>
              </View>
            </View>

            <Pressable accessibilityRole="button" accessibilityState={{ expanded: showRoadmap }} style={styles.mapToggle} onPress={() => setShowRoadmap(value => !value)}>
              <View style={styles.mapToggleIcon}><Compass size={16} color={HomeColors.accent} /></View>
              <View style={styles.mapToggleText}>
                <Text style={styles.mapToggleTitle}>{showRoadmap ? 'بستن نقشهٔ کامل' : 'دیدن جزئیات سطح‌ها'}</Text>
                <Text style={styles.mapToggleMeta}>{currentBlueprint?.modules.slice(0, 3).map(displayEnglishModuleLabel).join(' · ')}</Text>
              </View>
              {showRoadmap ? <ChevronUp size={18} color={HomeColors.accent} /> : <ChevronDown size={18} color={HomeColors.muted} />}
            </Pressable>

            {showRoadmap && (
              <View style={styles.fullRoadmap}>
                {COURSE_LEVELS.map(level => {
                  const metrics = getEnglishLevelMetrics(level.id, completedIds);
                  const passed = metrics.lessonCount > 0 && metrics.completedLessonCount === metrics.lessonCount;
                  return (
                    <Pressable
                      key={level.id}
                      accessibilityRole="button"
                      accessibilityLabel={`فهرست درس‌های ${level.title}`}
                      style={({ pressed }) => [styles.levelCard, level.id === currentLevel.id && styles.levelCardActive, pressed && styles.buttonPressed]}
                      onPress={() => openLevel(level.id)}
                    >
                      <View style={[styles.levelNumber, { backgroundColor: `${level.color}14` }]}>
                        {passed ? <Check size={17} color={level.color} strokeWidth={2.6} /> : <Text style={[styles.levelNumberText, { color: level.color }]}>{toPersianDigits(level.id)}</Text>}
                      </View>
                      <View style={styles.levelText}>
                        <View style={styles.levelTitleRow}>
                          <Text style={styles.levelTitle}>{level.title}</Text>
                          <Text style={[styles.levelCefr, { color: level.color }]}>{level.cefr}</Text>
                        </View>
                        <Text style={styles.levelDesc} numberOfLines={1}>{level.description}</Text>
                        <Text style={styles.levelStats}>{toPersianDigits(metrics.completedLessonCount)} از {toPersianDigits(metrics.lessonCount)} درس · {toPersianDigits(metrics.sentenceCount)} جمله · {toPersianDigits(metrics.vocabularyCount)} واژهٔ یکتا</Text>
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
              <Pressable accessibilityRole="button" style={styles.quickCard} onPress={() => router.push('/review' as never)}>
                <View style={[styles.quickIcon, { backgroundColor: HomeColors.sageSoft }]}><RefreshCw size={18} color={HomeColors.sage} /></View>
                <View style={styles.quickCopy}>
                  <Text style={styles.quickTitle}>مرور جمله‌ها</Text>
                  <Text style={styles.quickDesc}>کارت‌های زمان‌بندی‌شدهٔ تو</Text>
                </View>
                <ChevronLeft size={17} color={HomeColors.muted} />
              </Pressable>
              <Pressable accessibilityRole="button" style={styles.quickCard} onPress={openCurrentLesson}>
                <View style={[styles.quickIcon, { backgroundColor: HomeColors.accentSoft }]}><MessageCircle size={18} color={HomeColors.accent} /></View>
                <View style={styles.quickCopy}>
                  <Text style={styles.quickTitle}>تمرین مکالمه</Text>
                  <Text style={styles.quickDesc}>گفت‌وگوی همین درس</Text>
                </View>
                <ChevronLeft size={17} color={HomeColors.muted} />
              </Pressable>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="باز کردن کارگاه تلفظ انگلیسی"
              accessibilityHint="تمرین صداهای انگلیسی، تکیه و آهنگ جمله؛ بدون ضبط میکروفن"
              style={({ pressed }) => [styles.quickCard, pressed && styles.buttonPressed]}
              onPress={() => router.push('/learn/en/pronunciation' as never)}
            >
              <View style={[styles.quickIcon, { backgroundColor: HomeColors.accentSoft }]}><Volume2 size={18} color={HomeColors.accent} /></View>
              <View style={styles.quickCopy}>
                <Text style={styles.quickTitle}>کارگاه تلفظ انگلیسی</Text>
                <Text style={styles.quickDesc}>تمرین صداها، تکیه و آهنگ جمله؛ خودارزیابی و همگام‌سازی حساب</Text>
              </View>
              <ChevronLeft size={17} color={HomeColors.muted} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="پشتیبان‌گیری محلی از پیشرفت انگلیسی" style={({ pressed }) => [styles.quickCard, pressed && styles.buttonPressed]} onPress={() => router.push('/lang/backup' as never)}>
              <View style={[styles.quickIcon, { backgroundColor: HomeColors.sageSoft }]}><Download size={18} color={HomeColors.sage} /></View>
              <View style={styles.quickCopy}>
                <Text style={styles.quickTitle}>پشتیبان پیشرفت</Text>
                <Text style={styles.quickDesc}>ذخیره و بازیابی امن سابقهٔ محلی انگلیسی</Text>
              </View>
              <ChevronLeft size={17} color={HomeColors.muted} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="ورود ایمیلی و همگام‌سازی شخصی" style={({ pressed }) => [styles.quickCard, pressed && styles.buttonPressed]} onPress={() => router.push('/personal-sync' as never)}>
              <View style={[styles.quickIcon, { backgroundColor: HomeColors.accentSoft }]}><Cloud size={18} color={HomeColors.accent} /></View>
              <View style={styles.quickCopy}>
                <Text style={styles.quickTitle}>حساب و همگام‌سازی</Text>
                <Text style={styles.quickDesc}>پیشرفت و تلفظ هر دو زبان میان دستگاه‌ها</Text>
              </View>
              <ChevronLeft size={17} color={HomeColors.muted} />
            </Pressable>
          </View>

          <LinearGradient colors={['#FFFFFF', '#EDF5FF']} start={{ x: .95, y: .1 }} end={{ x: .05, y: 1 }} style={styles.noteCard}>
            <View style={styles.noteIcon}><Sparkles size={16} color={HomeColors.gold} /></View>
            <View style={styles.noteCopy}>
              <Text style={styles.noteTitle}>یادگیری در بافت</Text>
              <Text style={styles.noteText}>هر واژه را در جمله و موقعیت خودش می‌آموزی؛ نه جدا از کاربردش.</Text>
            </View>
            <View style={styles.noteOrnament} pointerEvents="none"><Sparkles size={30} color="rgba(216,183,110,0.22)" /></View>
          </LinearGradient>
        </View>
      </ScrollView>
      <AppBottomNav />
    </View>
  );
}
