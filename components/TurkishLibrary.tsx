import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, BookOpenCheck, Check, ChevronDown, ChevronLeft, ChevronUp, Clock3, Play, Sparkles, Volume2 } from 'lucide-react-native';
import { EnglishLevelRail, EnglishProgressTrack, EnglishSectionHeading, displayEnglishModuleLabel, ENGLISH_LEVEL_GRADIENTS } from '@/components/EnglishUI';
const Palette = { canvas: '#F5F4EF', surface: '#FFFEFB', surfaceMuted: '#E4ECE4', ink: '#29362F', text: '#29362F', muted: '#778179', border: '#E5E6DF', primary: '#728D75', primaryDark: '#4B614D', primarySoft: '#E4ECE4', teal: '#728D75', tealSoft: '#E4ECE4', success: '#5D765F', successSoft: '#E4ECE4', warning: '#A08756', warningSoft: '#F8F4EA', danger: '#9B554B', dangerSoft: '#FAF0ED' };
import { TURKISH_LEVELS, TURKISH_LESSONS, turkishProgress, type TurkishLevelId } from '@/lib/languages/turkish';
import type { CourseProgress } from '@/lib/courseProgress';
import { loadTurkishLessonSession, type TurkishLessonSession } from '@/lib/languages/turkishStudyState';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';

const LESSONS_PER_GROUP = 10;

function lessonUnitLabel(mode: 'words' | 'chunks' | 'sentences') {
  return mode === 'words' ? 'واژه' : mode === 'chunks' ? 'ترکیب' : 'جمله';
}

function lessonStatus(lessonId: string, progress: CourseProgress | null, sessions: Record<string, TurkishLessonSession | null>) {
  if (progress?.completedLessonIds.includes(lessonId)) return 'تکمیل‌شده · قابل مرور';
  const session = sessions[lessonId];
  if (session && (session.stage > 0 || session.sentenceIndex > 0)) {
    return `ادامه از مرحله ${fa(session.stage + 1)}، واحد ${fa(session.sentenceIndex + 1)}`;
  }
  return 'شروع درس';
}

export default function TurkishLibrary() {
  const router = useRouter();
  const { level } = useLocalSearchParams<{ level?: string }>();
  const [hydrated, setHydrated] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(0);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [sessions, setSessions] = useState<Record<string, TurkishLessonSession | null>>({});
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => setHydrated(true), []);
  const selected = hydrated ? TURKISH_LEVELS.find(item => String(item.id) === String(level)) : undefined;
  const selectedLessons = useMemo(() => selected ? TURKISH_LESSONS.filter(item => item.levelId === selected.id) : [], [selected?.id]);
  const lessonGroups = useMemo(() => {
    const groups: typeof selectedLessons[] = [];
    for (let index = 0; index < selectedLessons.length; index += LESSONS_PER_GROUP) groups.push(selectedLessons.slice(index, index + LESSONS_PER_GROUP));
    return groups;
  }, [selectedLessons]);

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
    return () => { alive = false; };
  }, [retry]));

  useEffect(() => { setExpandedGroup(0); }, [selected?.id]);

  const completedIds = progress?.completedLessonIds ?? [];
  const levelStartLesson = selectedLessons.find(item => !completedIds.includes(item.id) && !!sessions[item.id])
    ?? selectedLessons.find(item => !completedIds.includes(item.id))
    ?? selectedLessons[0];
  const levelFullyCompleted = selectedLessons.length > 0 && selectedLessons.every(item => completedIds.includes(item.id));
  const levelStartLabel = levelFullyCompleted ? 'بازبینی این سطح' : levelStartLesson && sessions[levelStartLesson.id] ? 'ادامهٔ درس این سطح' : 'شروع یادگیری از این سطح';
  const firstUnfinished = TURKISH_LESSONS.find(item => !completedIds.includes(item.id)) ?? TURKISH_LESSONS[TURKISH_LESSONS.length - 1];
  const activeLevelId = firstUnfinished.levelId;
  const countFor = (levelId: TurkishLevelId) => {
    const lessons = TURKISH_LESSONS.filter(item => item.levelId === levelId);
    return { total: lessons.length, completed: lessons.filter(item => completedIds.includes(item.id)).length };
  };
  const sentenceCount = selectedLessons.reduce((count, lesson) => count + lesson.sentences.length, 0);
  const selectedUnitLabel = selected?.id === -1 ? 'واحد آموزشی' : 'جمله';
  const words = new Set(selectedLessons.flatMap(lesson => lesson.sentences.flatMap(sentence => sentence.vocabulary.map(item => item.word))));
  const patternCount = selectedLessons.reduce((count, lesson) => count + lesson.sentences.filter(sentence => !!sentence.pattern).length, 0);
  const allWords = new Set(TURKISH_LESSONS.flatMap(lesson => lesson.sentences.flatMap(sentence => sentence.vocabulary.map(item => item.word))));
  const totalSentences = TURKISH_LESSONS.reduce((count, lesson) => count + lesson.sentences.length, 0);

  const openLevel = (levelId: TurkishLevelId) => router.push(`/learn/tr/library?level=${levelId}` as never);
  const openLesson = (id: string) => router.push(`/learn/tr/lesson?id=${encodeURIComponent(id)}` as never);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          {!selected ? <>
            <View style={styles.topBar}>
              <Pressable accessibilityRole="button" style={styles.backButton} onPress={() => router.replace('/learn/tr' as never)}><ChevronLeft size={18} color={Palette.ink} /><Text style={styles.backText}>بازگشت به آموزش ترکی استانبولی</Text></Pressable>
              <Text style={styles.brandEyebrow}>TURKISH PATH · MAIN COURSE</Text>
              <Text style={styles.pageTitle}>مسیر یادگیری ترکی استانبولی</Text>
              <Text style={styles.pageIntro}>یک سطح را انتخاب کنید؛ در بخش Foundation ساختار زبان و جمله‌سازی را گام‌به‌گام می‌آموزید و در Survival مکالمهٔ موقعیت‌های واقعی روزمره را تمرین می‌کنید.</Text>
            </View>

            <LinearGradient colors={['#EFF3EE', '#E4ECE4', '#F0E9D7']} start={{ x: .95, y: .1 }} end={{ x: .05, y: .95 }} style={styles.overviewHero}>
              <View pointerEvents="none" style={styles.heroOrb} />
              <View style={styles.heroTopRow}><View style={styles.heroArtWrap}><Image accessibilityLabel="تصویر آبرنگی استانبول برای مسیر ترکی استانبولی" source={require('../assets/images/language-tr-watercolor.jpg')} resizeMode="cover" style={styles.heroArt} /><View style={styles.heroArtMark}><BookOpenCheck size={13} color="#F8F4EA" /></View></View><View style={styles.heroPill}><Sparkles size={13} color={Palette.primary} /><Text style={styles.heroPillText}>۷ گام در نقشهٔ ترکی استانبولی</Text></View></View>
              <Text style={styles.overviewEyebrow}>FROM THE FIRST SENTENCE ONWARD</Text>
              <Text style={styles.overviewTitle}>از واژهٔ نخست تا جمله؛{'\n'}گام‌به‌گام</Text>
              <Text style={styles.overviewText}>در Pre-A1 از واژه‌های مستقل می‌آغازید، بعد ترکیب کوتاه و جمله می‌سازید؛ آموزش الفبا و دستور به‌تدریج در A1 Foundation ادامه می‌یابد. آمار از محتوای واقعی دوره می‌آید.</Text>
              <View style={styles.overviewMetrics}>
                <View style={styles.overviewMetric}><Text style={styles.overviewMetricValue}>{fa(TURKISH_LESSONS.length)}</Text><Text style={styles.overviewMetricLabel}>درس موجود</Text></View><View style={styles.overviewMetricDivider} />
                <View style={styles.overviewMetric}><Text style={styles.overviewMetricValue}>{fa(totalSentences)}</Text><Text style={styles.overviewMetricLabel}>مورد آموزشی</Text></View><View style={styles.overviewMetricDivider} />
                <View style={styles.overviewMetric}><Text style={styles.overviewMetricValue}>{fa(allWords.size)}</Text><Text style={styles.overviewMetricLabel}>واژهٔ یکتا</Text></View>
              </View>
            </LinearGradient>

            <View style={styles.levelRailCard}>
              <EnglishSectionHeading eyebrow="YOUR CURRENT STEP" title="پیشرفت در مسیر Pre-A1 تا C1" detail="این برچسب‌ها نقشهٔ آموزشی داخلی‌اند و گواهی یا ارزیابی رسمی سطح نیستند." />
              <View style={styles.railWrap}>
                <EnglishLevelRail activeLevelId={activeLevelId} counts={Object.fromEntries(TURKISH_LEVELS.map(item => [item.id, countFor(item.id)]))} levels={TURKISH_LEVELS} onSelect={openLevel} />
              </View>
              <Text style={styles.railCurrent}>اکنون · {TURKISH_LEVELS.find(item => item.id === activeLevelId)?.title} · سطح {fa(activeLevelId)}</Text>
            </View>

            <EnglishSectionHeading eyebrow="CHOOSE A LEVEL" title="انتخاب سطح" detail="شمار درس و واحدهای آموزشی از محتوای واقعی هر سطح محاسبه می‌شود." />
            <View style={styles.levelList}>
              {TURKISH_LEVELS.map(item => {
                const stats = countFor(item.id);
                const sentenceTotal = TURKISH_LESSONS.filter(lesson => lesson.levelId === item.id).reduce((count, lesson) => count + lesson.sentences.length, 0);
                const pct = stats.total ? stats.completed / stats.total * 100 : 0;
                return <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`فهرست درس‌های ${item.title}`} style={styles.levelOption} onPress={() => openLevel(item.id)}>
                  <LinearGradient colors={ENGLISH_LEVEL_GRADIENTS[item.id]} style={styles.levelOptionMark}><Text style={styles.levelOptionNumber}>{fa(item.id)}</Text></LinearGradient>
                  <View style={styles.levelOptionContent}>
                    <View style={styles.levelOptionTitleRow}><Text style={styles.levelOptionTitle}>{item.title}</Text><Text style={[styles.levelOptionBand, { color: Palette.primaryDark }]}>{item.cefr}</Text></View>
                    <Text style={styles.levelOptionDescription}>{item.description || 'در نقشهٔ آیندهٔ دوره'}</Text>
                    <View style={styles.levelOptionMeta}><Text style={styles.levelOptionMetaText}>{fa(stats.total)} درس</Text><View style={styles.metaDot} /><Text style={styles.levelOptionMetaText}>{fa(sentenceTotal)} {item.id === -1 ? 'مورد آموزشی' : 'جمله'}</Text><View style={styles.metaDot} /><Text style={styles.levelOptionMetaText}>{item.status === 'planned' ? 'در نقشهٔ آینده' : `${fa(stats.completed)} تکمیل`}</Text></View>
                    <EnglishProgressTrack value={pct} color={Palette.primary} trackColor="#E7E8E1" height={5} />
                  </View>
                  <ChevronLeft size={19} color={Palette.muted} />
                </Pressable>;
              })}
            </View>
          </> : <>
            <View style={styles.selectedTopBar}>
              <Pressable accessibilityRole="button" style={styles.backButton} onPress={() => router.replace('/learn/tr/library' as never)}><ChevronLeft size={18} color={Palette.ink} /><Text style={styles.backText}>همهٔ سطح‌ها</Text></Pressable>
              <Text style={styles.brandEyebrow}>LEVEL {selected.id} · TURKISH COURSE MAP</Text>
            </View>

            <LinearGradient colors={ENGLISH_LEVEL_GRADIENTS[selected.id]} start={{ x: .95, y: 0 }} end={{ x: .05, y: 1 }} style={styles.levelHero}>
              <View pointerEvents="none" style={styles.levelHeroOrb} />
              <View style={styles.levelHeroTop}><View style={styles.levelHeroTag}><Text style={styles.levelHeroTagText}>LEVEL {selected.id}</Text></View><Text style={styles.levelHeroBand}>{selected.cefr}</Text></View>
              <Text style={styles.selectedTitle}>{selected.title}</Text>
              <Text style={styles.selectedDescription}>{selected.description || 'درس‌های این سطح در آینده اضافه می‌شوند.'}</Text>
              <View style={styles.selectedProgressHeading}><Text style={styles.selectedProgressLabel}>پیشرفت این سطح</Text><Text style={styles.selectedProgressValue}>{fa(countFor(selected.id).completed)} از {fa(selectedLessons.length)} درس</Text></View>
              <View style={styles.selectedProgressTrack}><View style={[styles.selectedProgressFill, { width: `${selectedLessons.length ? countFor(selected.id).completed / selectedLessons.length * 100 : 0}%` }]} /></View>
              <View style={styles.metricGrid}>
                <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>{fa(sentenceCount)}</Text><Text style={styles.heroMetricLabel}>{selectedUnitLabel}</Text></View><View style={styles.heroMetricDivider} />
                <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>{fa(patternCount)}</Text><Text style={styles.heroMetricLabel}>الگوی ثبت‌شده</Text></View><View style={styles.heroMetricDivider} />
                <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>{fa(words.size)}</Text><Text style={styles.heroMetricLabel}>واژهٔ یکتا</Text></View>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel={`${levelStartLabel}: ${selected.title}`} accessibilityState={{ disabled: !levelStartLesson }} disabled={!levelStartLesson} style={({ pressed }) => [styles.levelStartButton, pressed && { opacity: .85 }, !levelStartLesson && styles.levelStartButtonDisabled]} onPress={() => { if (levelStartLesson) openLesson(levelStartLesson.id); }}>
                <Play size={16} color={Palette.primary} fill={Palette.primary} />
                <Text style={styles.levelStartButtonText}>{levelStartLabel}</Text>
                <ChevronLeft size={18} color={Palette.primary} />
              </Pressable>
            </LinearGradient>

            <View style={styles.focusCard}>
              <View style={styles.focusHeadingRow}><View style={styles.focusIcon}><Sparkles size={17} color={Palette.primary} /></View><View style={styles.focusHeadingCopy}><Text style={styles.focusEyebrow}>LEVEL FOCUS</Text><Text style={styles.focusTitle}>موضوعات این سطح</Text></View></View>
              <Text style={styles.focusDescription}>{selected.description || 'برای این سطح هنوز سرفصلی منتشر نشده است.'}</Text>
              {selected.modules.length > 0 ? <View style={styles.moduleGrid}>{selected.modules.map((module, index) => <View key={`${index}-${module}`} style={styles.moduleChip}><View style={[styles.moduleDot, { backgroundColor: Palette.primary }]} /><Text style={styles.moduleText}>{displayEnglishModuleLabel(module)}</Text></View>)}</View> : null}
              <Text style={styles.focusFootnote}>{selected.status === 'planned' ? 'این سطح بخشی از نقشهٔ آینده است؛ تا زمان تدوین، درس یا محتوای آموزشی به شمار محتوای موجود اضافه نمی‌شود.' : selected.id === -1 ? 'Pre-A1 از واژه‌های مستقل به ترکیب‌ها و جمله‌ها می‌رسد؛ این نقشه سنجش رسمی CEFR نیست.' : 'محتوای منتشرشده بر پایهٔ جمله‌های ترکی استانبولی و راهنمای فارسی است؛ این نقشه سنجش رسمی CEFR نیست.'}</Text>
            </View>

            <View style={styles.lessonSectionHeading}><View><Text style={styles.brandEyebrow}>{selected?.id === -1 ? 'WORDS · CHUNKS · SENTENCES' : 'SENTENCE-BASED LESSONS'}</Text><Text style={styles.lessonSectionTitle}>درس‌ها، به ترتیب</Text></View><View style={styles.lessonCountPill}><BookOpen size={13} color={Palette.primary} /><Text style={styles.lessonCountText}>{fa(selectedLessons.length)} درس</Text></View></View>

            {selectedLessons.length ? <View style={styles.groupList}>{lessonGroups.map((group, index) => {
              const first = group[0];
              const last = group[group.length - 1];
              const groupCompleted = group.filter(item => completedIds.includes(item.id)).length;
              const open = expandedGroup === index;
              return <View key={`${first.id}-${last.id}`} style={styles.group}>
                <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} style={styles.groupHeader} onPress={() => setExpandedGroup(open ? -1 : index)}>
                  <View style={[styles.groupNumber, open && styles.groupNumberActive]}><Text style={[styles.groupNumberText, open && styles.groupNumberTextActive]}>{fa(index + 1)}</Text></View>
                  <View style={styles.groupHeaderCopy}><Text style={styles.groupTitle}>بخش {fa(index + 1)} · درس‌های {fa(first.order)} تا {fa(last.order)}</Text><Text style={styles.groupMeta}>{fa(group.length)} درس · {fa(groupCompleted)} تکمیل‌شده</Text></View>
                  {open ? <ChevronUp size={18} color={Palette.primary} /> : <ChevronDown size={18} color={Palette.muted} />}
                </Pressable>
                {open && <View style={styles.lessonList}>{group.map(item => {
                  const status = lessonStatus(item.id, progress, sessions);
                  const complete = progress?.completedLessonIds.includes(item.id) ?? false;
                  const resumable = !complete && status.startsWith('ادامه');
                  const sentence = item.sentences[0];
                  return <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`${item.order}. ${item.title}`} style={styles.lessonCard} onPress={() => openLesson(item.id)}>
                    <View style={[styles.lessonOrder, complete && styles.lessonOrderComplete]}>{complete ? <Check size={16} color="#FFFFFF" strokeWidth={3} /> : <Text style={styles.lessonOrderText}>{fa(item.order)}</Text>}</View>
                    <View style={styles.lessonCopy}>
                      <View style={styles.lessonTitleLine}><Text style={styles.lessonTitle}>{item.title}</Text><View style={[styles.lessonStatus, complete && styles.lessonStatusDone, resumable && styles.lessonStatusResume]}><Text style={[styles.lessonStatusText, complete && styles.lessonStatusTextDone, resumable && styles.lessonStatusTextResume]}>{status}</Text></View></View>
                      <Text style={styles.lessonSubtitle}>{item.subtitle}</Text>
                      <View style={styles.lessonSentencePreview}>
                        <View style={styles.lessonSentenceHeader}><Volume2 size={12} color={Palette.primary} /><Text style={styles.lessonSentenceEyebrow}>{lessonUnitLabel(item.learningMode)} آغازین</Text></View>
                        <Text style={styles.lessonSentenceTurkish}>{sentence.text}</Text>
                        <Text style={styles.lessonSentenceFa}>{sentence.fa}</Text>
                        {!!sentence.vocabulary.length && <View style={styles.lessonVocabRow}>{sentence.vocabulary.slice(0, 3).map(word => <Text key={word.word} style={styles.lessonVocabChip}>{word.word} · {word.meaning}</Text>)}</View>}
                      </View>
                      <View style={styles.lessonFooter}><View style={styles.lessonFooterItem}><Clock3 size={12} color={Palette.muted} /><Text style={styles.lessonFooterText}>{fa(item.durationMinutes)} دقیقه</Text></View><Text style={styles.lessonFooterDot}>·</Text><Text style={styles.lessonFooterText}>{fa(item.sentences.length)} {lessonUnitLabel(item.learningMode)} اصلی</Text></View>
                    </View>
                    <View style={styles.lessonPlayIcon}><Play size={13} color={Palette.primary} fill={Palette.primary} /></View>
                  </Pressable>;
                })}</View>}
              </View>;
            })}</View> : <View style={styles.emptyLevel}>
              <View style={styles.emptyIcon}><Sparkles size={24} color={Palette.primary} /></View>
              <Text style={styles.emptyTitle}>درس‌های این سطح هنوز تدوین نشده‌اند</Text>
              <Text style={styles.emptyDescription}>این سطح در نقشهٔ دوره ثبت شده است، اما جمله یا درس ساختگی نمایش داده نمی‌شود. مسیر کامل سطح‌های A1 و A2 در دسترس شماست.</Text>
            </View>}
          </>}
          {!!error && <View style={styles.errorCard}><Text accessibilityRole="alert" style={styles.errorText}>{error}</Text><Pressable accessibilityRole="button" onPress={() => setRetry(value => value + 1)}><Text style={styles.retryText}>تلاش دوباره</Text></Pressable></View>}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.canvas },
  scrollContent: { flexGrow: 1 },
  page: { width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 50, gap: 17 },
  topBar: { gap: 4 },
  selectedTopBar: { gap: 5 },
  backButton: { alignSelf: 'flex-start', minHeight: 38, flexDirection: 'row-reverse', alignItems: 'center', gap: 5, paddingHorizontal: 10, borderRadius: 12, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, marginBottom: 7 },
  backText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 11, fontWeight: '400', writingDirection: 'rtl' },
  brandEyebrow: { fontFamily: 'Inter-ExtraBold', color: Palette.primary, fontSize: 7, fontWeight: '800', letterSpacing: 1.2, writingDirection: 'ltr' },
  pageTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 29, lineHeight: 39, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  pageIntro: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 13, lineHeight: 23, textAlign: 'right', writingDirection: 'rtl' },
  overviewHero: { position: 'relative', overflow: 'hidden', marginTop: 8, borderRadius: 25, padding: 20, gap: 10, shadowColor: '#35443A', shadowOpacity: .055, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
  heroOrb: { position: 'absolute', top: -50, left: -42, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(114,141,117,0.08)' },
  heroTopRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  heroArtWrap: { position: 'relative', width: 58, height: 58, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surface },
  heroArt: { width: '100%', height: '100%' },
  heroArtMark: { position: 'absolute', bottom: 4, left: 4, width: 23, height: 23, borderRadius: 8, backgroundColor: Palette.primaryDark, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E6D9B7' },
  heroPill: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, borderRadius: 999, backgroundColor: Palette.primarySoft, paddingHorizontal: 10, paddingVertical: 6 },
  heroPillText: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 10, fontWeight: '400', writingDirection: 'rtl' },
  overviewEyebrow: { fontFamily: 'Inter-ExtraBold', color: Palette.primaryDark, fontSize: 6, fontWeight: '800', letterSpacing: 1.4, writingDirection: 'ltr', marginTop: 4 },
  overviewTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 26, lineHeight: 38, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  overviewText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 12, lineHeight: 21, textAlign: 'right', writingDirection: 'rtl' },
  overviewMetrics: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-around', marginTop: 5, paddingTop: 13, borderTopWidth: 1, borderTopColor: Palette.border },
  overviewMetric: { flex: 1, alignItems: 'center', gap: 2 },
  overviewMetricValue: { fontFamily: Typography.numberFontFamily, color: Palette.ink, fontSize: 18, fontWeight: '800', writingDirection: 'rtl' },
  overviewMetricLabel: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, writingDirection: 'rtl' },
  overviewMetricDivider: { width: 1, height: 30, backgroundColor: Palette.border },
  levelRailCard: { padding: 16, gap: 12, borderRadius: 21, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  railWrap: { paddingVertical: 5 },
  railCurrent: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 12, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  levelList: { gap: 9 },
  levelOption: { minHeight: 96, flexDirection: 'row-reverse', alignItems: 'center', gap: 12, padding: 14, borderRadius: 20, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, shadowColor: '#35443A', shadowOpacity: .025, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  levelOptionMark: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  levelOptionNumber: { fontFamily: 'Vazir', color: Palette.ink, fontSize: 17, fontWeight: '800', writingDirection: 'rtl' },
  levelOptionContent: { flex: 1, gap: 5 },
  levelOptionTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  levelOptionTitle: { flexShrink: 1, fontFamily: Typography.latinFontFamily, color: Palette.ink, fontSize: 12, fontWeight: '800', textAlign: 'right', writingDirection: 'ltr' },
  levelOptionBand: { fontFamily: Typography.fontFamily, fontSize: 9, fontWeight: '400', writingDirection: 'rtl' },
  levelOptionDescription: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 11, textAlign: 'right', writingDirection: 'rtl' },
  levelOptionMeta: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  levelOptionMetaText: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, writingDirection: 'rtl' },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Palette.border },
  levelHero: { position: 'relative', overflow: 'hidden', padding: 20, borderRadius: 25, gap: 9, shadowColor: '#35443A', shadowOpacity: .055, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
  levelHeroOrb: { position: 'absolute', top: -60, right: -30, width: 190, height: 190, borderRadius: 95, backgroundColor: 'rgba(114,141,117,0.08)' },
  levelHeroTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  levelHeroTag: { borderRadius: 999, backgroundColor: Palette.primarySoft, paddingHorizontal: 10, paddingVertical: 5 },
  levelHeroTagText: { fontFamily: 'Inter-ExtraBold', color: Palette.ink, fontSize: 7, fontWeight: '800', letterSpacing: 1, writingDirection: 'ltr' },
  levelHeroBand: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, fontWeight: '400', writingDirection: 'rtl' },
  selectedTitle: { fontFamily: Typography.latinFontFamily, color: Palette.ink, fontSize: 25, lineHeight: 37, fontWeight: '800', textAlign: 'right', writingDirection: 'ltr', marginTop: 4 },
  selectedDescription: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 12, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  selectedProgressHeading: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  selectedProgressLabel: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, writingDirection: 'rtl' },
  selectedProgressValue: { fontFamily: Typography.numberFontFamily, color: Palette.ink, fontSize: 10, fontWeight: '400', writingDirection: 'rtl' },
  selectedProgressTrack: { height: 7, borderRadius: 999, overflow: 'hidden', backgroundColor: Palette.primarySoft },
  selectedProgressFill: { height: '100%', alignSelf: 'flex-end', borderRadius: 999, backgroundColor: Palette.primary },
  levelStartButton: { minHeight: 48, marginTop: 5, paddingHorizontal: 15, borderRadius: 15, backgroundColor: Palette.surface, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 9 },
  levelStartButtonDisabled: { opacity: 0.55 },
  levelStartButtonText: { flex: 1, fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 12, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  metricGrid: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-around', paddingTop: 12, marginTop: 2, borderTopWidth: 1, borderTopColor: Palette.border },
  heroMetric: { flex: 1, alignItems: 'center', gap: 1 },
  heroMetricValue: { fontFamily: Typography.numberFontFamily, color: Palette.ink, fontSize: 17, fontWeight: '800', writingDirection: 'rtl' },
  heroMetricLabel: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, writingDirection: 'rtl' },
  heroMetricDivider: { width: 1, height: 28, backgroundColor: Palette.border },
  focusCard: { padding: 17, borderRadius: 21, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: 10 },
  focusHeadingRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 9 },
  focusIcon: { width: 36, height: 36, borderRadius: 13, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  focusHeadingCopy: { flex: 1, alignItems: 'flex-end', gap: 1 },
  focusEyebrow: { fontFamily: 'Inter-ExtraBold', color: Palette.primary, fontSize: 6, fontWeight: '800', letterSpacing: 1.2, writingDirection: 'ltr' },
  focusTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 17, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  focusDescription: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 12, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  moduleGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 7 },
  moduleChip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, maxWidth: '100%', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border },
  moduleDot: { width: 6, height: 6, borderRadius: 3 },
  moduleText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  focusFootnote: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, lineHeight: 16, textAlign: 'right', writingDirection: 'rtl' },
  lessonSectionHeading: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 2 },
  lessonSectionTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 20, lineHeight: 29, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  lessonCountPill: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, backgroundColor: Palette.primarySoft },
  lessonCountText: { fontFamily: Typography.numberFontFamily, color: Palette.primaryDark, fontSize: 10, fontWeight: '400', writingDirection: 'rtl' },
  groupList: { gap: 12 },
  group: { gap: 8, padding: 7, borderRadius: 22, backgroundColor: '#EEEFE9', borderWidth: 1, borderColor: Palette.border },
  groupHeader: { minHeight: 64, flexDirection: 'row-reverse', alignItems: 'center', gap: 11, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 16, backgroundColor: Palette.surface, borderWidth: 1, borderColor: '#E7E5DC' },
  groupNumber: { width: 36, height: 36, borderRadius: 12, backgroundColor: Palette.surfaceMuted, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Palette.border },
  groupNumberActive: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  groupNumberText: { fontFamily: Typography.numberFontFamily, color: Palette.muted, fontSize: 12, fontWeight: '800', writingDirection: 'rtl' },
  groupNumberTextActive: { color: Palette.surface },
  groupHeaderCopy: { flex: 1, alignItems: 'flex-end', gap: 2 },
  groupTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 12, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  groupMeta: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
  lessonList: { gap: 8, paddingHorizontal: 1, paddingBottom: 1 },
  lessonCard: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 17, backgroundColor: Palette.surface, borderWidth: 1, borderColor: '#E8E5DC', shadowColor: '#35443A', shadowOpacity: .035, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  lessonOrder: { width: 34, height: 34, borderRadius: 12, backgroundColor: '#E8EDE6', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#DDE5DA' },
  lessonOrderComplete: { backgroundColor: Palette.success },
  lessonOrderText: { fontFamily: 'Vazir', color: Palette.primaryDark, fontSize: 11, fontWeight: '800', writingDirection: 'rtl' },
  lessonCopy: { flex: 1, gap: 5 },
  lessonTitleLine: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', gap: 7, flexWrap: 'wrap' },
  lessonTitle: { fontFamily: Typography.fontFamily, flexShrink: 1, color: Palette.ink, fontSize: 13, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  lessonSubtitle: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  lessonStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, backgroundColor: '#ECEDE7', borderWidth: 1, borderColor: Palette.border },
  lessonStatusDone: { backgroundColor: Palette.successSoft },
  lessonStatusResume: { backgroundColor: Palette.warningSoft },
  lessonStatusText: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 8, fontWeight: '400', writingDirection: 'rtl' },
  lessonStatusTextDone: { color: Palette.success },
  lessonStatusTextResume: { color: Palette.warning },
  lessonSentencePreview: { marginTop: 5, padding: 10, borderRadius: 13, backgroundColor: '#F2F3EE', borderWidth: 1, borderColor: '#E6E8E0', gap: 4 },
  lessonSentenceHeader: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5 },
  lessonSentenceEyebrow: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 8, fontWeight: '400', writingDirection: 'rtl' },
  lessonSentenceTurkish: { fontFamily: 'Inter-ExtraBold', color: Palette.ink, fontSize: 12, lineHeight: 21, fontWeight: '800', textAlign: 'right', writingDirection: 'ltr' },
  lessonSentenceFa: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  lessonVocabRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 5, marginTop: 2 },
  lessonVocabChip: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, backgroundColor: Palette.primarySoft, fontSize: 8, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 8, writingDirection: 'rtl' },
  lessonFooter: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, marginTop: 3 },
  lessonFooterItem: { flexDirection: 'row-reverse', alignItems: 'center', gap: 3 },
  lessonFooterText: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 8, writingDirection: 'rtl' },
  lessonFooterDot: { color: Palette.border, fontSize: 11 },
  lessonPlayIcon: { width: 30, height: 30, borderRadius: 10, backgroundColor: '#E8EDE6', borderWidth: 1, borderColor: '#DDE5DA', alignItems: 'center', justifyContent: 'center' },
  emptyLevel: { padding: 24, gap: 11, alignItems: 'center', borderRadius: 21, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surface },
  emptyIcon: { width: 50, height: 50, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.primarySoft },
  emptyTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 17, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  emptyDescription: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 12, lineHeight: 21, textAlign: 'right', writingDirection: 'rtl' },
  errorCard: { padding: 14, flexDirection: 'row-reverse', alignItems: 'center', gap: 10, borderRadius: 16, backgroundColor: Palette.dangerSoft, borderWidth: 1, borderColor: Palette.border },
  errorText: { flex: 1, fontFamily: Typography.fontFamily, color: Palette.danger, fontSize: 11, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  retryText: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 11, fontWeight: '400', writingDirection: 'rtl' },
});
