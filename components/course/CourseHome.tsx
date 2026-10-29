import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BookOpenCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock3,
  Cloud,
  Compass,
  Download,
  Flame,
  MessageCircle,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Volume2,
} from 'lucide-react-native';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { EnglishLevelRail, EnglishProgressTrack } from '@/components/EnglishUI';
import { CourseBottomNav } from '@/components/course/CourseBottomNav';
import { PageNavigation } from '@/components/PageNavigation';
import { narrateOnce } from '@/lib/autoNarration';
import type { CourseProgress } from '@/lib/courseProgress';
import type { CourseLevelId } from '@/lib/courseContent';
import {
  formatCourseLevel,
  lessonLevelRows,
  levelShortLabel,
  resumeFormatLesson,
  type FormatCourse,
} from '@/lib/languages/courseFormat';
import { courseNavTargets } from '@/components/course/CourseBottomNav';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';

/**
 * The one home screen every language shares: same sections, same order, same
 * calls to action. Only the course content, colours and routes differ.
 */
export function CourseHome({
  course, extras,
}: {
  course: FormatCourse;
  /** Language-specific guided modules, rendered in the same slot for every course. */
  extras?: ReactNode;
}) {
  const router = useRouter();
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [dueCount, setDueCount] = useState(0);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const targets = courseNavTargets(course);

  useFocusEffect(useCallback(() => {
    let alive = true;
    void Promise.all([course.progress.get(), course.progress.due()])
      .then(([nextProgress, cards]) => {
        if (!alive) return;
        setProgress(nextProgress);
        setDueCount(cards.length);
        setError('');
      })
      .catch(() => { if (alive) setError(`پیشرفت ${course.brand.nameFa} خوانده نشد؛ اطلاعات قبلی تغییر نکرده است.`); });
    return () => { alive = false; };
  }, [course, retry]));

  const completedIds = progress?.completedLessonIds ?? [];
  const completed = useMemo(() => course.lessons.filter(lesson => completedIds.includes(lesson.id)).length, [course, completedIds]);
  const lesson = resumeFormatLesson(course, progress?.currentLessonId, completedIds);
  const level = formatCourseLevel(course, lesson.levelId);
  const gradient = course.theme.gradients[level.id] ?? course.theme.gradients[0];
  const levelRows = lessonLevelRows(course, completedIds);
  const currentRow = levelRows.find(row => row.level.id === level.id) ?? levelRows[0];
  const lessonCount = course.lessons.length;
  const percent = lessonCount ? Math.round((completed / lessonCount) * 100) : 0;
  const isComplete = lessonCount > 0 && completed === lessonCount;
  const firstSentence = lesson.sentences[0];
  const counts = Object.fromEntries(levelRows.map(row => [row.level.id, { completed: row.completed, total: row.lessons.length }])) as Partial<Record<CourseLevelId, { completed: number; total: number }>>;

  /**
   * Opening a language reads its key sentence once, so the narrator starts the
   * moment the learner picks a course — not only inside a lesson.
   */
  useEffect(() => {
    if (!progress) return;
    return narrateOnce({ text: lesson.sentences[0]?.text, locale: course.speechLocale });
  }, [course.speechLocale, lesson.id, lesson.sentences, progress]);

  const openLevel = (levelId: number) => router.push(`${course.routes.library}?level=${levelId}` as never);
  const openLesson = (lessonId: string) => router.push(course.routes.lesson(lessonId) as never);

  const quickActions = [
    { key: 'review', icon: RefreshCw, title: 'مرور امروز', desc: 'جمله‌های موعدرسیدهٔ همین دوره', route: targets.review },
    { key: 'library', icon: BookOpenCheck, title: 'کتابخانهٔ درس‌ها', desc: 'سطح و درس را انتخاب کنید', route: targets.library },
    { key: 'pronunciation', icon: Volume2, title: `کارگاه تلفظ ${course.brand.nameFa}`, desc: 'صداها، تکیه و آهنگ جمله با تمرین محلی', route: targets.pronunciation },
    { key: 'conversations', icon: MessageCircle, title: 'کارگاه مکالمه', desc: 'گفت‌وگوی متنی و صوتی با مخاطبان واقعی', route: targets.conversations },
    { key: 'backup', icon: Download, title: 'پشتیبان پیشرفت', desc: 'ذخیره و بازیابی سابقهٔ همین دستگاه', route: course.routes.backup },
    { key: 'account', icon: Cloud, title: 'حساب و همگام‌سازی', desc: 'پیشرفت و تلفظ میان دستگاه‌ها', route: '/personal-sync' },
  ];

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <View style={styles.header}>
            <View style={styles.brandLockup}>
              <LinearGradient colors={gradient} style={styles.brandMark}>
                <BookOpenCheck size={20} color="#FFFFFF" strokeWidth={2.2} />
              </LinearGradient>
              <View>
                <Text style={styles.brandEyebrow}>{course.brand.eyebrow}</Text>
                <Text style={styles.headerTitle}>{course.brand.title}</Text>
              </View>
            </View>
            <PageNavigation backFallback="/languages" accentColor={Palette.primary} borderColor={Palette.border} />
          </View>

          <LinearGradient colors={gradient} start={{ x: .95, y: 0 }} end={{ x: .05, y: 1 }} style={styles.heroCard}>
            <View pointerEvents="none" style={styles.heroOrbLarge} />
            <View pointerEvents="none" style={styles.heroOrbSmall} />
            <View style={styles.heroTopRow}>
              <View style={styles.heroLevelBadge}>
                <View style={styles.heroBadgeDot} />
                <Text style={styles.heroLevelText}>LEVEL {fa(level.id + 1)}</Text>
              </View>
              <Text style={styles.heroCourseLabel}>{course.brand.nativeName.toUpperCase()}</Text>
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.heroEyebrow}>{isComplete ? 'همهٔ درس‌های این مسیر تکمیل شده‌اند' : completed ? 'درس بعدی شما' : 'شروع مسیر جمله‌محور'}</Text>
              <Text style={styles.heroTitle}>{lesson.title}</Text>
              <Text style={styles.heroDescription}>{lesson.subtitle || lesson.situation}</Text>
            </View>

            {firstSentence ? (
              <View style={styles.sentenceShowcase}>
                <View style={styles.sentenceShowcaseTop}>
                  <View style={styles.sentenceLabelIcon}><Volume2 size={14} color="#D9DBFF" /></View>
                  <Text style={styles.sentenceLabel}>جملهٔ کلیدی این درس</Text>
                  <Text style={styles.sentenceLabelEn}>KEY SENTENCE</Text>
                </View>
                <Text style={styles.sentenceTarget}>{firstSentence.text}</Text>
                <Text style={styles.sentencePersian}>{firstSentence.fa}</Text>
                <Text style={styles.sentencePronunciation}>{firstSentence.pronunciation}</Text>
                {firstSentence.vocabulary.length ? (
                  <View style={styles.wordChipRow}>
                    {firstSentence.vocabulary.map(item => (
                      <View key={`${firstSentence.id}-${item.word}`} style={styles.wordChip}>
                        <Text style={styles.wordChipTarget}>{item.word}</Text>
                        <Text style={styles.wordChipDivider}>·</Text>
                        <Text style={styles.wordChipFa}>{item.meaning}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            ) : null}

            <View style={styles.heroActions}>
              <Pressable
                accessibilityRole="button"
                style={styles.continueButton}
                onPress={() => isComplete ? router.push(course.routes.library as never) : openLesson(lesson.id)}
              >
                <Play size={16} color={Palette.primaryDark} fill={Palette.primaryDark} />
                <Text style={styles.continueButtonText}>{isComplete ? 'بازکردن کتابخانه و مرور' : completed ? 'ادامه یادگیری' : 'شروع اولین درس'}</Text>
                <ChevronLeft size={17} color={Palette.primaryDark} />
              </Pressable>
              <View style={styles.sentenceCount}>
                <Text style={styles.sentenceCountValue}>{fa(lesson.sentences.length)}</Text>
                <Text style={styles.sentenceCountLabel}>جملهٔ همین درس</Text>
              </View>
            </View>
          </LinearGradient>

          {!!error ? (
            <View style={styles.errorCard}>
              <Text accessibilityRole="alert" style={styles.errorText}>{error}</Text>
              <Pressable accessibilityRole="button" onPress={() => setRetry(value => value + 1)}>
                <Text style={styles.retryText}>تلاش دوباره</Text>
              </Pressable>
            </View>
          ) : null}

          <View style={styles.pathPanel}>
            <View style={styles.panelHeadingRow}>
              <View style={styles.panelHeadingText}>
                <Text style={styles.panelEyebrow}>THE LEARNING PATH</Text>
                <Text style={styles.panelTitle}>مسیر یادگیری {course.brand.nameFa}</Text>
              </View>
              <Pressable accessibilityRole="button" style={styles.libraryLink} onPress={() => router.push(course.routes.library as never)}>
                <Text style={styles.libraryLinkText}>کتابخانه</Text>
                <ChevronLeft size={16} color={Palette.primary} />
              </Pressable>
            </View>

            <View style={styles.railWrap}>
              <EnglishLevelRail
                activeLevelId={level.id as CourseLevelId}
                counts={counts}
                levels={course.levels.map(item => ({ id: item.id, title: item.title, cefr: levelShortLabel(item) })) as ReadonlyArray<{ id: CourseLevelId; title: string; cefr: string }>}
                startLabel="شروع"
                accessibilityLabelPrefix="فهرست درس‌های"
                direction="rtl"
                onSelect={openLevel}
              />
            </View>

            <View style={styles.currentLevelRow}>
              <View style={styles.currentLevelCopy}>
                <Text style={styles.currentLevelEyebrow}>اکنون · {levelShortLabel(level)}</Text>
                <Text style={styles.currentLevelName}>{level.title}</Text>
                <Text style={styles.currentLevelDescription}>{level.description}</Text>
              </View>
              <View style={[styles.levelCountBadge, { backgroundColor: `${level.color}12`, borderColor: `${level.color}38` }]}>
                <Text style={[styles.levelCountValue, { color: level.color }]}>{fa(currentRow.completed)} از {fa(currentRow.lessons.length)}</Text>
                <View style={styles.levelCountMeta}>
                  <View style={[styles.levelCountDot, { backgroundColor: level.color }]} />
                  <Text style={styles.levelCountLabel}>درس تکمیل‌شده</Text>
                </View>
              </View>
            </View>

            <EnglishProgressTrack
              value={currentRow.lessons.length ? (currentRow.completed / currentRow.lessons.length) * 100 : 0}
              color={level.color}
              trackColor={Palette.border}
            />

            <Pressable accessibilityRole="button" accessibilityState={{ expanded: showRoadmap }} style={styles.mapToggle} onPress={() => setShowRoadmap(value => !value)}>
              <View style={styles.mapToggleIcon}><Compass size={16} color={Palette.primary} /></View>
              <View style={styles.mapToggleText}>
                <Text style={styles.mapToggleTitle}>{showRoadmap ? 'بستن نقشهٔ کامل' : `نمایش نقشهٔ کامل ${fa(course.levels.length)} سطح`}</Text>
                <Text style={styles.mapToggleMeta}>{level.modules.slice(0, 3).join(' · ')}</Text>
              </View>
              {showRoadmap ? <ChevronUp size={18} color={Palette.primary} /> : <ChevronDown size={18} color={Palette.primary} />}
            </Pressable>

            {showRoadmap ? (
              <View style={styles.fullRoadmap}>
                {levelRows.map(row => {
                  const done = row.lessons.length > 0 && row.completed === row.lessons.length;
                  return (
                    <Pressable key={row.level.id} accessibilityRole="button" accessibilityLabel={`نقشهٔ سطح ${row.level.title}`} style={[styles.levelCard, row.level.id === level.id && styles.levelCardActive]} onPress={() => openLevel(row.level.id)}>
                      <View style={[styles.levelNumber, { backgroundColor: `${row.level.color}18` }]}>
                        {done ? <Check size={18} color={row.level.color} strokeWidth={2.6} /> : <Text style={[styles.levelNumberText, { color: row.level.color }]}>{fa(row.level.id + 1)}</Text>}
                      </View>
                      <View style={styles.levelText}>
                        <View style={styles.levelTitleRow}>
                          <Text style={styles.levelTitle}>{row.level.title}</Text>
                          <Text style={[styles.levelBand, { color: row.level.color }]}>{levelShortLabel(row.level)}</Text>
                        </View>
                        <Text style={styles.levelDesc} numberOfLines={2}>{row.level.description}</Text>
                        <Text style={styles.levelStats}>{fa(row.completed)} از {fa(row.lessons.length)} درس · {fa(row.sentenceCount)} جمله · {fa(row.vocabularyCount)} واژه</Text>
                      </View>
                      <ChevronLeft size={18} color={Palette.muted} />
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderCopy}>
              <Text style={styles.sectionEyebrow}>TODAY AT A GLANCE</Text>
              <Text style={styles.sectionTitle}>برنامهٔ امروز</Text>
            </View>
            <View style={styles.todayPill}>
              <Flame size={14} color={Palette.warning} />
              <Text style={styles.todayPillText}>{fa(dueCount)} جمله آماده مرور</Text>
            </View>
          </View>

          <View style={styles.todayCard}>
            <View style={styles.todayCardTop}>
              <View style={styles.todayMetricCopy}>
                <Text style={styles.todayValue}>{fa(completed)} از {fa(lessonCount)}</Text>
                <Text style={styles.todayLabel}>درس تکمیل‌شده؛ تکمیل یک فعالیت به‌تنهایی به معنی تسلط نیست.</Text>
              </View>
              <View style={styles.todayIcon}><Clock3 size={20} color={Palette.primary} /></View>
            </View>
            <View style={styles.todayProgressRow}>
              <Text style={styles.todayProgressText}>{fa(percent)}٪</Text>
              <View style={styles.todayProgressTrack}>
                <EnglishProgressTrack value={percent} color={Palette.primary} trackColor={Palette.border} height={9} />
              </View>
            </View>
            <View style={styles.levelRows}>
              {levelRows.filter(row => row.lessons.length > 0).map(row => {
                const latin = !/[\u0600-\u06FF]/.test(row.level.title);
                return (
                  <View key={row.level.id} style={styles.levelRow}>
                    <View style={[styles.levelDot, { backgroundColor: row.level.color }]} />
                    <Text style={[styles.levelName, latin ? styles.levelNameLatin : styles.levelNameFa]}>{row.level.title}</Text>
                    <Text style={styles.levelMeta}>{fa(row.completed)} از {fa(row.lessons.length)} درس</Text>
                    <Text style={styles.levelVocab}>{fa(row.vocabularyCount)} واژهٔ یکتا</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {extras}

          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderCopy}>
              <Text style={styles.sectionEyebrow}>PRACTICE &amp; TOOLS</Text>
              <Text style={styles.sectionTitle}>آموزش و تمرین تکمیلی</Text>
            </View>
            <View style={styles.headerChip}><ShieldCheck size={14} color={Palette.teal} /><Text style={styles.headerChipText}>بدون هزینه</Text></View>
          </View>

          <View style={styles.quickList}>
            {quickActions.map(item => {
              const Icon = item.icon;
              return (
                <Pressable key={item.key} accessibilityRole="button" accessibilityLabel={item.title} style={styles.quickCard} onPress={() => router.push(item.route as never)}>
                  <View style={styles.quickIcon}><Icon size={19} color={Palette.primary} /></View>
                  <View style={styles.quickCopy}>
                    <Text style={styles.quickTitle}>{item.title}</Text>
                    <Text style={styles.quickDesc}>{item.desc}</Text>
                  </View>
                  <ChevronLeft size={17} color={Palette.muted} />
                </Pressable>
              );
            })}
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipIcon}><Sparkles size={17} color={Palette.warning} /></View>
            <View style={styles.tipCopy}>
              <Text style={styles.tipTitle}>جمله‌محور، در هر دو زبان</Text>
              <Text style={styles.tipText}>English و Русский هر دو با همان نُه مرحله پیش می‌روند: موقعیت، جمله‌های اصلی، شنیدن، سایه‌خوانی، ساخت جمله، واژگان، دستور در کاربرد، مکالمه و مرور هوشمند.</Text>
            </View>
          </View>

          <Text style={styles.footnote}>نام‌گذاری سطح‌ها، نقشهٔ داخلی دوره است و گواهی رسمی CEFR نیست.</Text>
          {!progress && !error ? <Text style={styles.loading}>در حال آماده‌کردن مسیر…</Text> : null}
        </View>
      </ScrollView>
      <CourseBottomNav course={course} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.canvas },
  scrollContent: { flexGrow: 1 },
  page: { width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 26, gap: 18 },
  header: { minHeight: 56, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  brandLockup: { flexDirection: 'row-reverse', alignItems: 'center', gap: 11 },
  brandMark: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  brandEyebrow: { fontFamily: 'Inter-ExtraBold', color: Palette.primary, fontSize: 7, fontWeight: '800', letterSpacing: 1.2, textAlign: 'right', writingDirection: 'ltr' },
  headerTitle: { fontFamily: Typography.latinFontFamily, fontSize: 18, lineHeight: 27, fontWeight: '800', color: Palette.ink, textAlign: 'right', writingDirection: 'ltr' },
  headerChip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, borderRadius: 999, borderWidth: 1, borderColor: '#CFEEE6', backgroundColor: Palette.tealSoft, paddingHorizontal: 9, paddingVertical: 6 },
  headerChipText: { fontFamily: Typography.fontFamily, color: Palette.teal, fontSize: 9, fontWeight: '400', writingDirection: 'rtl' },
  heroCard: { position: 'relative', overflow: 'hidden', borderRadius: 27, padding: 20, gap: 14, shadowColor: '#20264A', shadowOpacity: 0.18, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 6 },
  heroOrbLarge: { position: 'absolute', top: -76, left: -42, width: 210, height: 210, borderRadius: 105, backgroundColor: 'rgba(255,255,255,0.12)' },
  heroOrbSmall: { position: 'absolute', top: 128, left: 92, width: 76, height: 76, borderRadius: 38, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  heroTopRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  heroLevelBadge: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.13)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 11, paddingVertical: 7 },
  heroBadgeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#A4F3D5' },
  heroLevelText: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 9, fontWeight: '400', letterSpacing: .2, writingDirection: 'rtl' },
  heroCourseLabel: { fontFamily: 'Inter-ExtraBold', color: '#D9DBFF', fontSize: 8, fontWeight: '800', letterSpacing: 1.3, writingDirection: 'ltr' },
  heroCopy: { gap: 2, paddingTop: 2 },
  heroEyebrow: { fontFamily: Typography.fontFamily, color: '#E3E5FF', fontSize: 12, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  heroTitle: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 27, lineHeight: 39, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  heroDescription: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.80)', fontSize: 12, lineHeight: 21, textAlign: 'right', writingDirection: 'rtl' },
  sentenceShowcase: { borderRadius: 19, padding: 15, gap: 7, backgroundColor: 'rgba(255,255,255,0.10)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' },
  sentenceShowcaseTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7 },
  sentenceLabelIcon: { width: 25, height: 25, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  sentenceLabel: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 11, fontWeight: '400', writingDirection: 'rtl' },
  sentenceLabelEn: { fontFamily: 'Inter-ExtraBold', marginLeft: 'auto', color: '#E3E5FF', fontSize: 6, fontWeight: '800', letterSpacing: 1, writingDirection: 'ltr' },
  sentenceTarget: { fontFamily: 'Inter-ExtraBold', color: '#FFFFFF', fontSize: 18, lineHeight: 30, fontWeight: '800', textAlign: 'right', writingDirection: 'ltr' },
  sentencePersian: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.78)', fontSize: 12, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  sentencePronunciation: { fontFamily: Typography.fontFamily, color: '#E3E5FF', fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  wordChipRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  wordChip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)', paddingHorizontal: 9, paddingVertical: 5 },
  wordChipTarget: { fontFamily: 'Inter-ExtraBold', color: '#FFFFFF', fontSize: 8, fontWeight: '800', writingDirection: 'ltr' },
  wordChipDivider: { color: '#E3E5FF', fontSize: 10 },
  wordChipFa: { fontFamily: Typography.fontFamily, color: '#F0F1FF', fontSize: 10, writingDirection: 'rtl' },
  heroActions: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  continueButton: { minHeight: 48, flex: 1, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 15, backgroundColor: '#FFFFFF', paddingHorizontal: 13 },
  continueButtonText: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 12, fontWeight: '400', writingDirection: 'rtl' },
  sentenceCount: { alignItems: 'flex-end', minWidth: 76 },
  sentenceCountValue: { fontFamily: Typography.numberFontFamily, color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  sentenceCountLabel: { fontFamily: Typography.fontFamily, color: '#E3E5FF', fontSize: 9, writingDirection: 'rtl' },
  errorCard: { padding: 14, flexDirection: 'row-reverse', alignItems: 'center', gap: 10, borderRadius: 16, backgroundColor: Palette.dangerSoft, borderWidth: 1, borderColor: '#F5CDD3' },
  errorText: { flex: 1, fontFamily: Typography.fontFamily, color: Palette.danger, fontSize: 11, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  retryText: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 11, fontWeight: '400', writingDirection: 'rtl' },
  pathPanel: { borderRadius: 23, padding: 17, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: 14, shadowColor: '#21264A', shadowOpacity: .045, shadowRadius: 13, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  panelHeadingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  panelHeadingText: { flex: 1, alignItems: 'stretch' },
  panelEyebrow: { fontFamily: 'Inter-ExtraBold', color: Palette.primary, fontSize: 6, fontWeight: '800', letterSpacing: 1.3, textAlign: 'right', writingDirection: 'ltr' },
  panelTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 20, lineHeight: 29, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  libraryLink: { minHeight: 37, flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 9, borderRadius: 12, backgroundColor: Palette.primarySoft },
  libraryLinkText: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 11, fontWeight: '400', writingDirection: 'rtl' },
  railWrap: { paddingVertical: 2 },
  currentLevelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: 12, borderRadius: 17, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border },
  currentLevelCopy: { flex: 1, alignItems: 'stretch', gap: 2 },
  currentLevelEyebrow: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 9, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  currentLevelName: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 13, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  currentLevelDescription: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  levelCountBadge: { alignItems: 'stretch', justifyContent: 'center', minWidth: 92, minHeight: 58, borderRadius: 18, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 6, gap: 3 },
  levelCountValue: { width: '100%', fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 19, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  levelCountMeta: { flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center', gap: 4 },
  levelCountDot: { width: 5, height: 5, borderRadius: 3 },
  levelCountLabel: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 8, textAlign: 'right', writingDirection: 'rtl' },
  mapToggle: { minHeight: 51, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 11, borderRadius: 15, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border },
  mapToggleIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.primarySoft },
  mapToggleText: { flex: 1, gap: 2 },
  mapToggleTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 11, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  mapToggleMeta: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 8, textAlign: 'right', writingDirection: 'rtl' },
  fullRoadmap: { gap: 8 },
  levelCard: { minHeight: 76, flexDirection: 'row-reverse', alignItems: 'center', gap: 11, padding: 12, borderRadius: 17, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  levelCardActive: { borderColor: Palette.primary, backgroundColor: '#F9F8FF' },
  levelNumber: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  levelNumberText: { fontFamily: Typography.numberFontFamily, fontSize: 15, fontWeight: '800', writingDirection: 'rtl' },
  levelText: { flex: 1, gap: 3 },
  levelTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7 },
  levelTitle: { fontFamily: Typography.fontFamily, flexShrink: 1, color: Palette.ink, fontSize: 11, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  levelBand: { fontFamily: Typography.fontFamily, fontSize: 8, fontWeight: '400', writingDirection: 'rtl' },
  levelDesc: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  levelStats: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 2 },
  sectionHeaderCopy: { alignItems: 'stretch' },
  sectionEyebrow: { fontFamily: 'Inter-ExtraBold', color: Palette.primary, fontSize: 6, fontWeight: '800', letterSpacing: 1.3, textAlign: 'right', writingDirection: 'ltr' },
  sectionTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 19, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  todayPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Palette.warningSoft, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 999 },
  todayPillText: { fontFamily: Typography.fontFamily, color: Palette.warning, fontSize: 9, fontWeight: '400', writingDirection: 'rtl' },
  todayCard: { borderRadius: 20, padding: 16, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: 13, shadowColor: '#20264A', shadowOpacity: .035, shadowRadius: 11, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  todayCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  todayMetricCopy: { flex: 1, alignItems: 'stretch' },
  todayValue: { fontFamily: Typography.numberFontFamily, color: Palette.ink, fontSize: 23, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  todayLabel: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  todayIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  todayProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  todayProgressText: { width: 34, fontFamily: Typography.numberFontFamily, color: Palette.primaryDark, fontSize: 11, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  todayProgressTrack: { flex: 1 },
  levelRows: { gap: 7, paddingTop: 10, borderTopWidth: 1, borderTopColor: Palette.border },
  levelRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7 },
  levelDot: { width: 6, height: 6, borderRadius: 3 },
  levelName: { flex: 1, color: Palette.ink, fontSize: 10, fontWeight: '400', textAlign: 'right' },
  levelNameLatin: { fontFamily: 'Inter-ExtraBold', fontWeight: '800', writingDirection: 'ltr' },
  levelNameFa: { fontFamily: Typography.fontFamily, writingDirection: 'rtl' },
  levelMeta: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, writingDirection: 'rtl' },
  levelVocab: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 9, writingDirection: 'rtl' },
  quickList: { gap: 10 },
  quickCard: { minHeight: 70, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 13, paddingVertical: 10, borderRadius: 18, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  quickIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.primarySoft },
  quickCopy: { flex: 1, alignItems: 'stretch', gap: 2 },
  quickTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 12, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  quickDesc: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  tipCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 17, borderWidth: 1, borderColor: '#F4DFC5', backgroundColor: '#FFF8EF' },
  tipIcon: { width: 33, height: 33, borderRadius: 11, backgroundColor: '#FFEDD4', alignItems: 'center', justifyContent: 'center' },
  tipCopy: { flex: 1, alignItems: 'stretch', gap: 2 },
  tipTitle: { fontFamily: Typography.fontFamily, color: Palette.warning, fontSize: 10, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  tipText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  footnote: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, lineHeight: 17, textAlign: 'right', writingDirection: 'rtl' },
  loading: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
});
