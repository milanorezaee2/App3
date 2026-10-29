import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, BookOpenCheck, Check, ChevronDown, ChevronLeft, ChevronUp, Play, Sparkles, Volume2 } from 'lucide-react-native';
import { EnglishLevelRail, EnglishProgressTrack, EnglishSectionHeading, displayEnglishModuleLabel } from '@/components/EnglishUI';
import { CourseBottomNav } from '@/components/course/CourseBottomNav';
import { PageNavigation } from '@/components/PageNavigation';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import type { CourseLevelId } from '@/lib/courseContent';
import {
  findFormatLesson,
  formatCourseLevel,
  lessonLevelRows,
  levelShortLabel,
  resumeFormatLesson,
  type FormatCourse,
  type FormatLesson,
  type FormatLevel,
} from '@/lib/languages/courseFormat';
import type { CourseProgress } from '@/lib/courseProgress';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';

const GROUP_SIZE = 5;

function resolveLevel(course: FormatCourse, value?: string): FormatLevel | undefined {
  if (value === undefined) return undefined;
  const byLabel = course.levels.find(level => level.cefr === value || level.title === value);
  if (byLabel) return byLabel;
  const number = Number(value);
  return course.levels.find(level => level.id === number);
}

/**
 * The library of every language: same overview, same level cards, same lesson
 * groups of five, same lesson preview. Only the course content differs.
 */
export function CourseLibrary({ course, bottomNote }: { course: FormatCourse; bottomNote?: ReactNode }) {
  const router = useRouter();
  const { level: levelParam } = useLocalSearchParams<{ level?: string }>();
  const selectedLevel = resolveLevel(course, levelParam);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [expandedGroup, setExpandedGroup] = useState(0);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useFocusEffect(useCallback(() => {
    let alive = true;
    void course.progress.get().then(value => {
      if (alive) { setProgress(value); setError(''); }
    }).catch(() => {
      if (alive) setError('پیشرفت ذخیره‌شده خوانده نشد؛ فهرست درس‌ها همچنان قابل استفاده است.');
    });
    return () => { alive = false; };
  }, [course, retry]));

  useEffect(() => setExpandedGroup(0), [selectedLevel?.id]);

  const completedIds = progress?.completedLessonIds ?? [];
  const rows = useMemo(() => lessonLevelRows(course, completedIds), [course, completedIds]);
  const activeLesson = resumeFormatLesson(course, progress?.currentLessonId, completedIds);
  const activeLevel = formatCourseLevel(course, activeLesson.levelId);
  const totalSentences = course.lessons.reduce((total, lesson) => total + lesson.sentences.length, 0);
  const totalWords = useMemo(
    () => new Set(course.lessons.flatMap(lesson => lesson.sentences.flatMap(sentence => sentence.vocabulary.map(word => word.word)))).size,
    [course],
  );
  const railCounts = Object.fromEntries(rows.map(row => [row.level.id, { completed: row.completed, total: row.lessons.length }])) as Partial<Record<CourseLevelId, { completed: number; total: number }>>;

  const selectedRow = selectedLevel ? rows.find(row => row.level.id === selectedLevel.id) : undefined;
  const selectedLessons = selectedRow?.lessons ?? [];
  const groups = useMemo(() => {
    const output: FormatLesson[][] = [];
    for (let index = 0; index < selectedLessons.length; index += GROUP_SIZE) output.push(selectedLessons.slice(index, index + GROUP_SIZE));
    return output;
  }, [selectedLessons]);
  const selectedPercent = selectedRow && selectedRow.lessons.length ? (selectedRow.completed / selectedRow.lessons.length) * 100 : 0;

  const openLevel = (id: number) => router.push(`${course.routes.library}?level=${id}` as never);
  const openLesson = (lessonId: string) => router.push(course.routes.lesson(lessonId) as never);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          {!selectedLevel ? (
            <>
              <View style={styles.topBar}>
                <PageNavigation backFallback={course.routes.home} accentColor={Palette.primary} borderColor={Palette.border} />
                <Text style={styles.brandEyebrow}>{course.brand.eyebrow}</Text>
                <Text style={styles.pageTitle}>مسیر جمله‌محور {course.brand.nameFa}</Text>
                <Text style={styles.pageIntro}>هر درس از جمله‌های واقعی، معنی، تلفظ، الگوی جمله و واژگان همان بافت ساخته شده است.</Text>
              </View>

              <LinearGradient colors={course.theme.gradients[activeLevel.id] ?? course.theme.gradients[0]} start={{ x: .95, y: .1 }} end={{ x: .05, y: .95 }} style={styles.overviewHero}>
                <View pointerEvents="none" style={styles.heroOrb} />
                <View style={styles.overviewTopRow}>
                  <View style={styles.overviewIcon}><BookOpenCheck size={18} color="#FFFFFF" /></View>
                  <View style={styles.heroPill}><Sparkles size={13} color="#FFFFFF" /><Text style={styles.heroPillText}>{fa(course.levels.length)} سطح آموزشی</Text></View>
                </View>
                <Text style={styles.overviewEyebrow}>{course.brand.nativeName.toUpperCase()} · {course.brand.courseLabel}</Text>
                <Text style={styles.overviewTitle}>جمله بسازید؛{'\n'}واژه را در بافت یاد بگیرید</Text>
                <Text style={styles.overviewText}>از عبارت‌های کوتاه آغاز کنید و قدم‌به‌قدم به روایت تجربه، بیان نظر و ساخت جمله‌های پیوسته برسید.</Text>
                <View style={styles.overviewMetrics}>
                  <View style={styles.overviewMetric}><Text style={styles.overviewMetricValue}>{fa(course.lessons.length)}</Text><Text style={styles.overviewMetricLabel}>درس جمله‌محور</Text></View>
                  <View style={styles.overviewMetricDivider} />
                  <View style={styles.overviewMetric}><Text style={styles.overviewMetricValue}>{fa(totalSentences)}</Text><Text style={styles.overviewMetricLabel}>جملهٔ نمونه</Text></View>
                  <View style={styles.overviewMetricDivider} />
                  <View style={styles.overviewMetric}><Text style={styles.overviewMetricValue}>{fa(totalWords)}</Text><Text style={styles.overviewMetricLabel}>مدخل واژگانی یکتا</Text></View>
                </View>
              </LinearGradient>

              <View style={styles.levelRailCard}>
                <EnglishSectionHeading eyebrow="YOUR LEARNING PATH" title={`پیشرفت در ${fa(course.levels.length)} مرحله`} detail="مسیر بر اساس درس‌های همین دوره محاسبه می‌شود؛ می‌توانید هر سطحی را مستقیم باز کنید." accentColor={Palette.primary} />
                <View style={styles.railWrap}>
                  <EnglishLevelRail
                    activeLevelId={activeLevel.id as CourseLevelId}
                    counts={railCounts}
                    levels={course.levels.map(item => ({ id: item.id, title: item.title, cefr: levelShortLabel(item) })) as ReadonlyArray<{ id: CourseLevelId; title: string; cefr: string }>}
                    startLabel="شروع"
                    accessibilityLabelPrefix="فهرست درس‌های"
                    direction="rtl"
                    accentColor={Palette.primary}
                    successColor={Palette.success}
                    activeLabelColor={Palette.primaryDark}
                    onSelect={openLevel}
                  />
                </View>
                <Text style={styles.railCurrent}>اکنون در {activeLevel.title}</Text>
              </View>

              <EnglishSectionHeading eyebrow="CHOOSE A LEVEL" title="انتخاب سطح" detail="درس‌ها، جمله‌ها و واژگان هر کارت از محتوای همین دوره محاسبه می‌شود." accentColor={Palette.primary} />
              <View style={styles.levelList}>
                {rows.map(row => {
                  const percent = row.lessons.length ? (row.completed / row.lessons.length) * 100 : 0;
                  return (
                    <Pressable
                      key={row.level.id}
                      accessibilityRole="button"
                      accessibilityLabel={`فهرست درس‌های ${row.level.title}`}
                      style={({ pressed }) => [styles.levelOption, pressed && styles.pressed]}
                      onPress={() => openLevel(row.level.id)}
                    >
                      <LinearGradient colors={course.theme.gradients[row.level.id] ?? course.theme.gradients[0]} style={styles.levelOptionMark}>
                        <Text style={styles.levelOptionNumber}>{fa(row.level.id + 1)}</Text>
                      </LinearGradient>
                      <View style={styles.levelOptionContent}>
                        <View style={styles.levelOptionTitleRow}>
                          <Text style={styles.levelOptionTitle}>{row.level.title}</Text>
                          <Text style={[styles.levelOptionBand, { color: row.level.color }]}>{levelShortLabel(row.level)}</Text>
                        </View>
                        <Text style={styles.levelOptionDescription}>{row.level.description}</Text>
                        <View style={styles.levelOptionMeta}>
                          <Text style={styles.levelOptionStatus}>{fa(row.lessons.length)} درس</Text>
                          <View style={styles.metaDot} />
                          <Text style={styles.levelOptionMetaText}>{fa(row.sentenceCount)} جمله</Text>
                          <View style={styles.metaDot} />
                          <Text style={styles.levelOptionMetaText}>{fa(row.vocabularyCount)} واژهٔ یکتا</Text>
                        </View>
                        <EnglishProgressTrack value={percent} color={row.level.color} trackColor={Palette.border} height={5} />
                      </View>
                      <ChevronLeft size={19} color={Palette.muted} />
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.disclaimer}>این سطح‌بندی، نقشهٔ آموزشی داخلی برنامه است و گواهی یا اعتبارسنجی رسمی CEFR نیست.</Text>
            </>
          ) : (
            <>
              <View style={styles.selectedTopBar}>
                <PageNavigation backFallback={course.routes.library} accentColor={Palette.primary} borderColor={Palette.border} />
                <Text style={styles.brandEyebrow}>{course.brand.eyebrow} · LEVEL {fa(selectedLevel.id + 1)}</Text>
              </View>

              <LinearGradient colors={course.theme.gradients[selectedLevel.id] ?? course.theme.gradients[0]} start={{ x: .95, y: 0 }} end={{ x: .05, y: 1 }} style={styles.levelHero}>
                <View pointerEvents="none" style={styles.levelHeroOrb} />
                <View style={styles.levelHeroTop}>
                  <View style={styles.levelHeroTag}><Text style={styles.levelHeroTagText}>{selectedLevel.title.toUpperCase()}</Text></View>
                  <Text style={styles.levelHeroBand}>{selectedLevel.cefr}</Text>
                </View>
                <Text style={styles.selectedTitle}>{selectedLevel.title}</Text>
                <Text style={styles.selectedDescription}>{selectedLevel.description}</Text>
                <View style={styles.selectedProgressHeading}>
                  <Text style={styles.selectedProgressLabel}>پیشرفت این سطح</Text>
                  <Text style={styles.selectedProgressValue}>{fa(selectedRow?.completed ?? 0)} از {fa(selectedLessons.length)} درس</Text>
                </View>
                <View style={styles.selectedProgressTrack}><View style={[styles.selectedProgressFill, { width: `${Math.min(100, selectedPercent)}%` }]} /></View>
                <View style={styles.metricGrid}>
                  <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>{fa(selectedLessons.length)}</Text><Text style={styles.heroMetricLabel}>درس</Text></View>
                  <View style={styles.heroMetricDivider} />
                  <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>{fa(selectedRow?.sentenceCount ?? 0)} جمله</Text><Text style={styles.heroMetricLabel}>جملهٔ نمونه</Text></View>
                  <View style={styles.heroMetricDivider} />
                  <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>{fa(selectedRow?.vocabularyCount ?? 0)}</Text><Text style={styles.heroMetricLabel}>مدخل واژگانی یکتا</Text></View>
                </View>
              </LinearGradient>

              <View style={styles.focusCard}>
                <View style={styles.focusHeadingRow}>
                  <View style={styles.focusIcon}><Sparkles size={17} color={Palette.primary} /></View>
                  <View style={styles.focusHeadingCopy}>
                    <Text style={styles.focusEyebrow}>TOPICS OF THIS LEVEL</Text>
                    <Text style={styles.focusTitle}>موضوع‌های این مرحله</Text>
                  </View>
                </View>
                <Text style={styles.focusDescription}>{selectedLevel.description}</Text>
                <View style={styles.moduleGrid}>
                  {selectedLevel.modules.map((module, index) => (
                    <View key={`${selectedLevel.id}-${index}-${module}`} style={styles.moduleChip}>
                      <View style={[styles.moduleDot, { backgroundColor: selectedLevel.color }]} />
                      <Text style={styles.moduleText}>{displayEnglishModuleLabel(module)}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.focusFootnote}>هر موضوع از جمله‌های ثبت‌شده در همین مرحله می‌آید؛ نمونه‌ها و واژه‌های هر درس کنار هم می‌مانند.</Text>
              </View>

              <View style={styles.lessonSectionHeading}>
                <View>
                  <Text style={styles.brandEyebrow}>LESSONS · SENTENCE BY SENTENCE</Text>
                  <Text style={styles.lessonSectionTitle}>درس‌ها، به ترتیب</Text>
                </View>
                <View style={styles.lessonCountPill}><BookOpen size={13} color={Palette.primary} /><Text style={styles.lessonCountText}>{fa(selectedLessons.length)} درس</Text></View>
              </View>

              {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
              {!selectedLessons.length ? <Text style={styles.disclaimer}>این سطح در نقشهٔ آینده است و هنوز درس منتشرشده ندارد.</Text> : null}
              <View style={styles.groupList}>
                {groups.map((group, groupIndex) => {
                  const first = group[0];
                  const last = group[group.length - 1];
                  if (!first || !last) return null;
                  const completedInGroup = group.filter(lesson => completedIds.includes(lesson.id)).length;
                  const sentenceCount = group.reduce((count, lesson) => count + lesson.sentences.length, 0);
                  const expanded = expandedGroup === groupIndex;
                  return (
                    <View key={`${first.id}-${last.id}`} style={styles.group}>
                      <Pressable accessibilityRole="button" accessibilityState={{ expanded }} style={styles.groupHeader} onPress={() => setExpandedGroup(expanded ? -1 : groupIndex)}>
                        <View style={[styles.groupNumber, expanded && { backgroundColor: selectedLevel.color }]}>
                          <Text style={[styles.groupNumberText, expanded && styles.groupNumberTextActive]}>{fa(groupIndex + 1)}</Text>
                        </View>
                        <View style={styles.groupHeaderCopy}>
                          <Text style={styles.groupTitle}>بخش {fa(groupIndex + 1)} · درس‌های {fa(first.order)} تا {fa(last.order)}</Text>
                          <Text style={styles.groupMeta}>{fa(group.length)} درس · {fa(completedInGroup)} تکمیل‌شده · {fa(sentenceCount)} جمله</Text>
                        </View>
                        {expanded ? <ChevronUp size={18} color={Palette.primary} /> : <ChevronDown size={18} color={Palette.muted} />}
                      </Pressable>
                      {expanded ? (
                        <View style={styles.lessonList}>
                          {group.map(lesson => {
                            const complete = completedIds.includes(lesson.id);
                            const preview = lesson.sentences[0];
                            return (
                              <Pressable key={lesson.id} accessibilityRole="button" accessibilityLabel={`${lesson.order}. ${lesson.title}`} style={({ pressed }) => [styles.lessonCard, pressed && styles.pressed]} onPress={() => openLesson(lesson.id)}>
                                <View style={[styles.lessonOrder, complete && styles.lessonOrderComplete]}>
                                  {complete ? <Check size={15} color="#FFFFFF" strokeWidth={3} /> : <Text style={styles.lessonOrderText}>{fa(lesson.order)}</Text>}
                                </View>
                                <View style={styles.lessonCopy}>
                                  <View style={styles.lessonTitleLine}>
                                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                                    <View style={[styles.lessonStatus, complete && styles.lessonStatusDone]}>
                                      <Text style={[styles.lessonStatusText, complete && styles.lessonStatusTextDone]}>{complete ? 'تکمیل‌شده · قابل مرور' : 'شروع درس'}</Text>
                                    </View>
                                  </View>
                                  <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text>
                                  {preview ? (
                                    <View style={styles.lessonSentencePreview}>
                                      <View style={styles.lessonSentenceHeader}><Volume2 size={13} color={Palette.primary} /><Text style={styles.lessonSentenceEyebrow}>جملهٔ نمونه</Text></View>
                                      <Text style={styles.lessonSentenceTarget}>{preview.text}</Text>
                                      <Text style={styles.lessonSentenceFa}>{preview.fa}</Text>
                                      <View style={styles.vocabularyRow}>
                                        {preview.vocabulary.slice(0, 3).map(item => <Text key={`${preview.id}-${item.word}`} style={styles.vocabularyChip}>{item.word} · {item.meaning}</Text>)}
                                      </View>
                                    </View>
                                  ) : null}
                                  {preview?.pattern ? <Text style={styles.lessonPattern}>الگو: {preview.pattern}</Text> : null}
                                </View>
                                <View style={styles.lessonPlayIcon}><Play size={12} color={Palette.primary} fill={Palette.primary} /></View>
                              </Pressable>
                            );
                          })}
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </View>
              <Text style={styles.disclaimer}>این سطح‌بندی نقشهٔ آموزشی داخلی برنامه است؛ گواهی یا اعتبارسنجی رسمی CEFR نیست.</Text>
            </>
          )}
          {error && !selectedLevel ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          {progress === null && !error ? <Text style={styles.loading}>در حال خواندن پیشرفت {course.brand.nameFa}…</Text> : null}
          {error ? <Pressable accessibilityRole="button" style={styles.retryButton} onPress={() => setRetry(value => value + 1)}><Text style={styles.retryText}>تلاش دوباره</Text></Pressable> : null}
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
  topBar: { alignItems: 'flex-end', gap: 5 },
  selectedTopBar: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  brandEyebrow: { fontFamily: 'Inter-ExtraBold', color: Palette.primary, fontSize: 6, fontWeight: '800', letterSpacing: 1.2, writingDirection: 'ltr', textAlign: 'right' },
  pageTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 26, lineHeight: 37, fontWeight: '400', writingDirection: 'rtl', textAlign: 'right' },
  pageIntro: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 12, lineHeight: 21, writingDirection: 'rtl', textAlign: 'right' },
  overviewHero: { position: 'relative', overflow: 'hidden', padding: 20, borderRadius: 25, gap: 9, shadowColor: '#20264A', shadowOpacity: .2, shadowRadius: 20, shadowOffset: { width: 0, height: 9 }, elevation: 5 },
  heroOrb: { position: 'absolute', top: -60, right: -30, width: 190, height: 190, borderRadius: 95, backgroundColor: 'rgba(255,255,255,0.12)' },
  overviewTopRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  overviewIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  heroPill: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.14)' },
  heroPillText: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 9, fontWeight: '400', writingDirection: 'rtl' },
  overviewEyebrow: { fontFamily: 'Inter-ExtraBold', color: 'rgba(255,255,255,0.82)', fontSize: 6, fontWeight: '800', letterSpacing: 1.15, writingDirection: 'ltr', marginTop: 5 },
  overviewTitle: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 22, lineHeight: 34, fontWeight: '400', writingDirection: 'rtl', textAlign: 'right' },
  overviewText: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.82)', fontSize: 11, lineHeight: 20, writingDirection: 'rtl', textAlign: 'right' },
  overviewMetrics: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, marginTop: 5, paddingTop: 11, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.18)' },
  overviewMetric: { flex: 1, alignItems: 'flex-end', gap: 1 },
  overviewMetricValue: { fontFamily: Typography.numberFontFamily, color: '#FFFFFF', fontSize: 15, fontWeight: '800', writingDirection: 'rtl' },
  overviewMetricLabel: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.7)', fontSize: 8, textAlign: 'right', writingDirection: 'rtl' },
  overviewMetricDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.2)' },
  levelRailCard: { borderRadius: 22, padding: 16, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: 13 },
  railWrap: { paddingVertical: 2 },
  railCurrent: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  levelList: { gap: 10 },
  levelOption: { flexDirection: 'row-reverse', alignItems: 'center', gap: 11, padding: 13, borderRadius: 19, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  levelOptionMark: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  levelOptionNumber: { fontFamily: Typography.numberFontFamily, color: '#FFFFFF', fontSize: 15, fontWeight: '800', writingDirection: 'rtl' },
  levelOptionContent: { flex: 1, gap: 5 },
  levelOptionTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7 },
  levelOptionTitle: { fontFamily: Typography.fontFamily, flexShrink: 1, color: Palette.ink, fontSize: 14, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  levelOptionBand: { fontFamily: Typography.fontFamily, fontSize: 9, fontWeight: '400', writingDirection: 'rtl' },
  levelOptionDescription: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  levelOptionMeta: { flexDirection: 'row-reverse', alignItems: 'center', flexWrap: 'wrap', gap: 5 },
  levelOptionStatus: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 9, writingDirection: 'rtl' },
  levelOptionMetaText: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, writingDirection: 'rtl' },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Palette.border },
  disclaimer: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, lineHeight: 17, textAlign: 'right', writingDirection: 'rtl' },
  levelHero: { position: 'relative', overflow: 'hidden', padding: 19, borderRadius: 24, gap: 9, shadowColor: '#20264A', shadowOpacity: .18, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  levelHeroOrb: { position: 'absolute', top: -50, left: -30, width: 170, height: 170, borderRadius: 85, backgroundColor: 'rgba(255,255,255,0.12)' },
  levelHeroTop: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  levelHeroTag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.16)' },
  levelHeroTagText: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 8, writingDirection: 'rtl' },
  levelHeroBand: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 9, fontWeight: '400', writingDirection: 'rtl' },
  selectedTitle: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 24, lineHeight: 34, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  selectedDescription: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.82)', fontSize: 11, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  selectedProgressHeading: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  selectedProgressLabel: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.8)', fontSize: 9, writingDirection: 'rtl' },
  selectedProgressValue: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 9, writingDirection: 'rtl' },
  selectedProgressTrack: { width: '100%', height: 6, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' },
  selectedProgressFill: { height: '100%', borderRadius: 99, backgroundColor: '#FFFFFF' },
  metricGrid: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, marginTop: 5, paddingTop: 11, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.18)' },
  heroMetric: { flex: 1, alignItems: 'flex-end', gap: 1 },
  heroMetricValue: { fontFamily: Typography.numberFontFamily, color: '#FFFFFF', fontSize: 14, fontWeight: '800', writingDirection: 'rtl' },
  heroMetricLabel: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.7)', fontSize: 8, textAlign: 'right', writingDirection: 'rtl' },
  heroMetricDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.2)' },
  focusCard: { borderRadius: 21, padding: 16, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: 11 },
  focusHeadingRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 9 },
  focusIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  focusHeadingCopy: { flex: 1, gap: 1 },
  focusEyebrow: { fontFamily: 'Inter-ExtraBold', color: Palette.primary, fontSize: 6, fontWeight: '800', letterSpacing: 1.1, textAlign: 'right', writingDirection: 'ltr' },
  focusTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 15, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  focusDescription: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  moduleGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6 },
  moduleChip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 999, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border },
  moduleDot: { width: 5, height: 5, borderRadius: 3 },
  moduleText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 9, writingDirection: 'rtl' },
  focusFootnote: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 8, lineHeight: 15, textAlign: 'right', writingDirection: 'rtl' },
  lessonSectionHeading: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  lessonSectionTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 19, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  lessonCountPill: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 999, backgroundColor: Palette.primarySoft },
  lessonCountText: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 9, writingDirection: 'rtl' },
  groupList: { gap: 10 },
  group: { borderRadius: 19, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, overflow: 'hidden' },
  groupHeader: { minHeight: 62, flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10 },
  groupNumber: { width: 32, height: 32, borderRadius: 11, backgroundColor: Palette.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  groupNumberText: { fontFamily: Typography.numberFontFamily, color: Palette.muted, fontSize: 12, fontWeight: '800', writingDirection: 'rtl' },
  groupNumberTextActive: { color: '#FFFFFF' },
  groupHeaderCopy: { flex: 1, gap: 2 },
  groupTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 12, textAlign: 'right', writingDirection: 'rtl' },
  groupMeta: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
  lessonList: { borderTopWidth: 1, borderTopColor: Palette.border, padding: 9, gap: 8 },
  lessonCard: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 10, padding: 11, borderRadius: 15, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border },
  lessonOrder: { width: 28, height: 28, borderRadius: 10, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, alignItems: 'center', justifyContent: 'center' },
  lessonOrderComplete: { backgroundColor: Palette.success, borderColor: Palette.success },
  lessonOrderText: { fontFamily: Typography.numberFontFamily, color: Palette.primaryDark, fontSize: 11, fontWeight: '800', writingDirection: 'rtl' },
  lessonCopy: { flex: 1, gap: 3 },
  lessonTitleLine: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 7 },
  lessonTitle: { fontFamily: Typography.fontFamily, flex: 1, color: Palette.ink, fontSize: 12, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  lessonStatus: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 999, backgroundColor: Palette.primarySoft },
  lessonStatusDone: { backgroundColor: Palette.successSoft },
  lessonStatusText: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 8, writingDirection: 'rtl' },
  lessonStatusTextDone: { color: Palette.success },
  lessonSubtitle: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, lineHeight: 16, textAlign: 'right', writingDirection: 'rtl' },
  lessonSentencePreview: { marginTop: 5, padding: 9, borderRadius: 12, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: 4 },
  lessonSentenceHeader: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5 },
  lessonSentenceEyebrow: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 8, writingDirection: 'rtl' },
  lessonSentenceTarget: { fontFamily: 'Inter-ExtraBold', color: Palette.ink, fontSize: 12, fontWeight: '800', textAlign: 'right', writingDirection: 'ltr' },
  lessonSentenceFa: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
  vocabularyRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 5, marginTop: 2 },
  vocabularyChip: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 8, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 999, backgroundColor: Palette.surfaceMuted, writingDirection: 'rtl' },
  lessonPattern: { fontFamily: Typography.fontFamily, color: Palette.warning, fontSize: 8, textAlign: 'right', writingDirection: 'rtl' },
  lessonPlayIcon: { width: 24, height: 24, borderRadius: 8, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: .8 },
  error: { fontFamily: Typography.fontFamily, color: Palette.danger, fontSize: 10, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  loading: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  retryButton: { alignSelf: 'flex-end', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 11, backgroundColor: Palette.primarySoft },
  retryText: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 10, writingDirection: 'rtl' },
});
