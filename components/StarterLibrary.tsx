import { MiloGlobeHeadphoneMark } from '@/components/MiloBrandMark';
import { LocalizedText as Text } from '@/components/LocalizedText';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Check, ChevronDown, ChevronLeft, ChevronUp, Clock3, Play, Sparkles, Volume2 } from 'lucide-react-native';
import { EnglishLevelRail, EnglishProgressTrack, EnglishSectionHeading, displayEnglishModuleLabel, ENGLISH_LEVEL_GRADIENTS } from '@/components/EnglishUI';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { getA1Curriculum } from '@/lib/languages/a1Curriculum';
import StarterA1Checkpoint from '@/components/StarterA1Checkpoint';
import { getA2Curriculum } from '@/lib/languages/a2Curriculum';
import { countA2GrammarPatterns } from '@/lib/languages/a2Grammar';
import { getB1Curriculum } from '@/lib/languages/b1Curriculum';
import { countB1GrammarPatterns } from '@/lib/languages/b1Units';
import {getB2Curriculum} from '@/lib/languages/b2Curriculum';
import {countB2GrammarPatterns} from '@/lib/languages/b2Units';
import StarterB1Scenarios from '@/components/StarterB1Scenarios';
import StarterB2Workshops from '@/components/StarterB2Workshops';
import StarterB2GrammarLab from '@/components/StarterB2GrammarLab';
import StarterBranchConversations from '@/components/StarterBranchConversations';
import StarterSkillsAssessment from '@/components/StarterSkillsAssessment';
import StarterLearningStudio from '@/components/StarterLearningStudio';
import StarterTopicPractice from '@/components/StarterTopicPractice';
import StarterC1Curriculum from '@/components/StarterC1Curriculum';
import {c1DeepeningModules} from '@/lib/languages/c1Deepening';
import {independentSkills} from '@/lib/languages/independentSkills';
import {learningStudio,studioLinks} from '@/lib/languages/learningStudio';
import {b1Intensive} from '@/lib/languages/b1Intensive';
import {b2Workshops} from '@/lib/languages/b2Workshops';
import {b2GrammarLab} from '@/lib/languages/b2GrammarLab';
import {b2GrammarLinks,b2WorkshopLinks} from '@/lib/languages/b2PracticeLinks';
import type { StarterCourse, StarterLesson } from '@/lib/languages/newCourses';
import type { CourseLevelId as StarterLevelId } from '@/lib/courseContent';
import type { CourseProgress } from '@/lib/courseProgress';
import type { StarterLessonSession } from '@/lib/languages/starterSessions';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';

const LESSONS_PER_GROUP = 10;
const groupLabels = { sounds:'صدا و نوشتار', words:'واژه‌های مستقل', chunks:'عبارت‌های کوتاه', sentences:'جمله، گفت‌وگو و مرور' } as const;

function lessonStatus(lesson: StarterLesson, progress: CourseProgress | null, sessions: Record<string, StarterLessonSession | null>) {
  const lessonId = lesson.id;
  const session = sessions[lessonId];
  if (progress?.completedLessonIds.includes(lessonId)) return session ? 'تکمیل‌شده · ادامهٔ مرور' : 'تکمیل‌شده · قابل مرور';
  if (session) {
    return `ادامه از مرحله ${fa(session.stage + 1)}، ${lesson.learningMode === 'chunks' ? 'عبارت' : lesson.learningMode ? 'واژه' : 'جمله'} ${fa(session.sentenceIndex + 1)}`;
  }
  return 'شروع درس';
}

export default function StarterLibrary({course}: {course: StarterCourse}) {
  const {lessons, levels, progress: courseProgress} = course;
  const {loadStarterLessonSessionWithPresence} = course.sessions;
  const router = useRouter();
  const { level } = useLocalSearchParams<{ level?: string }>();
  const [hydrated, setHydrated] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(0);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [sessions, setSessions] = useState<Record<string, StarterLessonSession | null>>({});
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const pageRef = useRef<View>(null), workshopRef = useRef<View>(null), grammarRef = useRef<View>(null), studioRef = useRef<View>(null), serial = useRef(0);
  const [workshopRequest, setWorkshopRequest] = useState<{id:string;serial:number}|null>(null);
  const [grammarRequest, setGrammarRequest] = useState<{id:string;serial:number}|null>(null);
  const [studioRequest, setStudioRequest] = useState<{id:string;serial:number}|null>(null);
  const openPractice = (kind:'workshop'|'grammar'|'studio', id:string) => {
    const request={id,serial:++serial.current};
    if(kind==='workshop')setWorkshopRequest(request); else if(kind==='grammar')setGrammarRequest(request); else setStudioRequest(request);
    const target = kind==='workshop' ? workshopRef.current : kind==='grammar' ? grammarRef.current : studioRef.current;
    if (target && pageRef.current) target.measureLayout(pageRef.current, (_x, y) => scrollRef.current?.scrollTo({y:Math.max(0,y-16),animated:false}), () => {});
  };

  useEffect(() => setHydrated(true), []);
  // Retired empty placeholder: old bookmarks open the course overview instead.
  useEffect(() => { if (hydrated && level === '0') router.replace(`${course.home}/library` as never); }, [hydrated, level, router, course.home]);
  const selected = hydrated ? levels.find(item => String(item.id) === String(level)) : undefined;
  const selectedLessons = useMemo(() => selected ? lessons.filter(item => item.levelId === selected.id) : [], [selected?.id]);
  const lessonGroups = useMemo(() => {
    const groups: Array<{kind: keyof typeof groupLabels; lessons: typeof selectedLessons}> = [];
    for (const lesson of selectedLessons) {
      const kind = lesson.learningMode ?? 'sentences';
      const last = groups[groups.length - 1];
      if (!last || last.kind !== kind || last.lessons.length >= LESSONS_PER_GROUP) groups.push({kind, lessons:[lesson]});
      else last.lessons.push(lesson);
    }
    return groups;
  }, [selectedLessons]);

  useFocusEffect(useCallback(() => {
    let alive = true;
    void Promise.all([
      courseProgress.getCourseProgress(),
      Promise.all(lessons.map(async lesson => {
        const saved = await loadStarterLessonSessionWithPresence(lesson.id);
        return [lesson.id, saved.hasSavedSession ? saved.session : null] as const;
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
  const levelStartLabel = levelFullyCompleted ? (selected?.id === 1 || selected?.id === 2 || selected?.id === 3 || selected?.id === 4 ? 'بازبینی درس‌های موجود' : 'بازبینی این سطح') : levelStartLesson && sessions[levelStartLesson.id] ? 'ادامهٔ درس این سطح' : 'شروع یادگیری از این سطح';
  const firstUnfinished = lessons.find(item => !completedIds.includes(item.id)) ?? lessons[lessons.length - 1];
  const activeLevelId = firstUnfinished.levelId;
  const countFor = (levelId: StarterLevelId) => {
    const inLevel = lessons.filter(item => item.levelId === levelId);
    return { total: inLevel.length, completed: inLevel.filter(item => completedIds.includes(item.id)).length };
  };
  const sentenceCount = selectedLessons.reduce((count, lesson) => count + lesson.sentences.length, 0);
  const words = new Set(selectedLessons.flatMap(lesson => lesson.sentences.flatMap(sentence => sentence.vocabulary.map(item => item.word))));
  const patternCount = selected?.id === 2
    ? countA2GrammarPatterns(course.id, selectedLessons.map(lesson => lesson.id))
    : selected?.id === 3 ? countB1GrammarPatterns(course.id, selectedLessons.map(lesson => lesson.id))
    : selected?.id === 4 ? countB2GrammarPatterns(course.id, selectedLessons.map(lesson => lesson.id))
    : selectedLessons.reduce((count, lesson) => count + lesson.sentences.filter(sentence => !!sentence.pattern).length, 0);
  const allWords = new Set(lessons.flatMap(lesson => lesson.sentences.flatMap(sentence => sentence.vocabulary.map(item => item.word))));
  const totalSentences = lessons.reduce((count, lesson) => count + lesson.sentences.length, 0);

  const openLevel = (levelId: StarterLevelId) => router.push(`${course.home}/library?level=${levelId}` as never);
  const openLesson = (id: string) => router.push(`${course.home}/lesson?id=${encodeURIComponent(id)}` as never);

  return (
    <View style={styles.root}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View ref={pageRef} collapsable={false} style={styles.page}>
          {!selected ? <>
            <View style={styles.topBar}>
              <Pressable accessibilityRole="button" style={styles.backButton} onPress={() => router.replace(course.home as never)}><ChevronLeft size={18} color={Palette.ink} /><Text style={styles.backText}>بازگشت به آموزش این زبان</Text></Pressable>
              <Text style={styles.brandEyebrow}>LEARNING PATH · MAIN COURSE</Text>
              <Text style={styles.pageTitle}>مسیر یادگیری {course.name}</Text>
              <Text style={styles.pageIntro}>یک سطح را انتخاب کنید؛ از صداها و واژه‌های نخستین شروع می‌کنیم و مرحله‌به‌مرحله به موقعیت‌های روزمره می‌رسیم.</Text>
            </View>

            <LinearGradient colors={['#19204C', '#343B8A', '#5148C8']} start={{ x: .95, y: .1 }} end={{ x: .05, y: .95 }} style={styles.overviewHero}>
              <View pointerEvents="none" style={styles.heroOrb} />
              <View style={styles.heroTopRow}><View style={styles.heroIcon}><MiloGlobeHeadphoneMark size={48} /></View><View style={styles.heroPill}><Sparkles size={13} color="#C8C9FF" /><Text style={styles.heroPillText}>{fa(levels.length)} سطح در نقشهٔ این زبان</Text></View></View>
              <Text style={styles.overviewEyebrow}>FROM THE FIRST SENTENCE ONWARD</Text>
              <Text style={styles.overviewTitle}>از صداهای اول؛{ '\n' }گام به گام</Text>
              <Text style={styles.overviewText}>محتوای موجود از پایه آغاز می‌شود. آمار فقط درس‌ها و نمونه‌های منتشرشده را می‌شمارد؛ سطح‌های آینده محتوای ساختگی ندارند.</Text>
              <View style={styles.overviewMetrics}>
                <View style={styles.overviewMetric}><Text style={styles.overviewMetricValue}>{fa(lessons.length)}</Text><Text style={styles.overviewMetricLabel}>درس موجود</Text></View><View style={styles.overviewMetricDivider} />
                <View style={styles.overviewMetric}><Text style={styles.overviewMetricValue}>{fa(totalSentences)}</Text><Text style={styles.overviewMetricLabel}>نمونهٔ آموزشی</Text></View><View style={styles.overviewMetricDivider} />
                <View style={styles.overviewMetric}><Text style={styles.overviewMetricValue}>{fa(allWords.size)}</Text><Text style={styles.overviewMetricLabel}>واژهٔ یکتا</Text></View>
              </View>
            </LinearGradient>

            <View style={styles.levelRailCard}>
              <EnglishSectionHeading eyebrow="YOUR CURRENT STEP" title="پیشرفت در سطح‌ها" detail="این برچسب‌ها نقشهٔ آموزشی داخلی‌اند و گواهی یا ارزیابی رسمی سطح نیستند." />
              <View style={styles.railWrap}>
                <EnglishLevelRail activeLevelId={activeLevelId} counts={Object.fromEntries(levels.filter(item => item.id !== 2 && item.id !== 3 && item.id !== 4 && item.id !== 5).map(item => [item.id, countFor(item.id)]))} levels={levels} displayNumber={id => Math.max(0, id)} onSelect={openLevel} />
              </View>
              <Text style={styles.railCurrent}>اکنون · {levels.find(item => item.id === activeLevelId)?.title} · سطح {fa(Math.max(0, activeLevelId))}</Text>
            </View>

            <EnglishSectionHeading eyebrow="CHOOSE A LEVEL" title="انتخاب سطح" detail="شمار درس و نمونه از محتوای واقعی هر سطح محاسبه می‌شود." />
            <View style={styles.levelList}>
              {levels.map(item => {
                const stats = countFor(item.id);
                const sentenceTotal = lessons.filter(lesson => lesson.levelId === item.id).reduce((count, lesson) => count + lesson.sentences.length, 0);
                const pct = stats.total ? stats.completed / stats.total * 100 : 0;
                return <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`فهرست درس‌های ${item.title}`} style={styles.levelOption} onPress={() => openLevel(item.id)}>
                  <LinearGradient colors={ENGLISH_LEVEL_GRADIENTS[item.id]} style={styles.levelOptionMark}><Text style={styles.levelOptionNumber}>{fa(Math.max(0, item.id))}</Text></LinearGradient>
                  <View style={styles.levelOptionContent}>
                    <View style={styles.levelOptionTitleRow}><Text style={styles.levelOptionTitle}>{item.title}</Text><Text style={[styles.levelOptionBand, { color: item.color }]}>{item.cefr}</Text></View>
                    <Text style={styles.levelOptionDescription}>{item.description}</Text>
                    <View style={styles.levelOptionMeta}><Text style={styles.levelOptionMetaText}>{item.id === 5 ? `${fa(c1DeepeningModules.length)} درس موضوعی مستقل` : `${fa(stats.total)} درس`}</Text><View style={styles.metaDot} /><Text style={styles.levelOptionMetaText}>{item.id === 5 ? '۵۵ سرفصل' : `${fa(sentenceTotal)} نمونه`}</Text><View style={styles.metaDot} /><Text style={styles.levelOptionMetaText}>{item.id === 5 ? 'تمرین چهار مهارت' : item.status === 'planned' ? 'در نقشهٔ آینده' : `${fa(stats.completed)} تکمیل`}</Text></View>
                    {item.id !== 5 && <EnglishProgressTrack value={pct} color={item.color} height={5} />}
                  </View>
                  <ChevronLeft size={19} color={Palette.muted} />
                </Pressable>;
              })}
            </View>
          </> : <>
            <View style={styles.selectedTopBar}>
              <View style={styles.selectedBrandRow}><MiloGlobeHeadphoneMark size={48} /><Pressable accessibilityRole="button" style={styles.backButton} onPress={() => router.replace(`${course.home}/library` as never)}><ChevronLeft size={18} color={Palette.ink} /><Text style={styles.backText}>همهٔ سطح‌ها</Text></Pressable></View>
              <Text style={styles.brandEyebrow}>{selected.id === -1 ? 'PRE-A1' : `LEVEL ${selected.id}`}  · COURSE MAP</Text>
            </View>

            <LinearGradient colors={ENGLISH_LEVEL_GRADIENTS[selected.id]} start={{ x: .95, y: 0 }} end={{ x: .05, y: 1 }} style={styles.levelHero}>
              <View pointerEvents="none" style={styles.levelHeroOrb} />
              <View style={styles.levelHeroTop}><View style={styles.levelHeroTag}><Text style={styles.levelHeroTagText}>{selected.id === -1 ? 'PRE-A1' : `LEVEL ${selected.id}`} </Text></View><Text style={styles.levelHeroBand}>{selected.cefr}</Text></View>
              <Text style={styles.selectedTitle}>{selected.title}</Text>
              <Text style={styles.selectedDescription}>{selected.description}</Text>
              {selected.id !== 5 && <><View style={styles.selectedProgressHeading}><Text style={styles.selectedProgressLabel}>{selected.id === 1 || selected.id === 2 || selected.id === 3 || selected.id === 4 ? 'پیشرفت درس‌های موجود' : 'پیشرفت این سطح'}</Text><Text style={styles.selectedProgressValue}>{fa(countFor(selected.id).completed)} از {fa(selectedLessons.length)} درس</Text></View>
              <View style={styles.selectedProgressTrack}><View style={[styles.selectedProgressFill, { width: `${selectedLessons.length ? countFor(selected.id).completed / selectedLessons.length * 100 : 0}%` }]} /></View>
              <View style={styles.metricGrid}>
                <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>{fa(sentenceCount)}</Text><Text style={styles.heroMetricLabel}>نمونه</Text></View><View style={styles.heroMetricDivider} />
                <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>{fa(patternCount)}</Text><Text style={styles.heroMetricLabel}>{selected.id === 2 || selected.id === 3 || selected.id === 4 ? 'الگوی متمایز' : 'جمله با الگو'}</Text></View><View style={styles.heroMetricDivider} />
                <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>{fa(words.size)}</Text><Text style={styles.heroMetricLabel}>واژهٔ یکتا</Text></View>
              </View>
              {(selected.id === 2 || selected.id === 3 || selected.id === 4) && <Text style={styles.patternCountNote}>هر ساختار ثبت‌شده در درس‌های موجود یک بار شمرده می‌شود.</Text>}
              <Pressable accessibilityRole="button" accessibilityLabel={`${levelStartLabel}: ${selected.title}`} accessibilityState={{ disabled: !levelStartLesson }} disabled={!levelStartLesson} style={({ pressed }) => [styles.levelStartButton, pressed && { opacity: .85 }, !levelStartLesson && styles.levelStartButtonDisabled]} onPress={() => { if (levelStartLesson) openLesson(levelStartLesson.id); }}>
                <Play size={16} color={selected.color} fill={selected.color} />
                <Text style={styles.levelStartButtonText}>{levelStartLabel}</Text>
                <ChevronLeft size={18} color={selected.color} />
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel={`شروع از ابتدای سطح: ${selected.title}`} accessibilityState={{ disabled: !selectedLessons[0] }} disabled={!selectedLessons[0]} style={({ pressed }) => [styles.levelStartBeginningButton, pressed && { opacity: .85 }, !selectedLessons[0] && styles.levelStartButtonDisabled]} onPress={() => { if (selectedLessons[0]) openLesson(selectedLessons[0].id); }}>
                <Play size={16} color={selected.color} fill={selected.color} />
                <Text style={styles.levelStartButtonText}>شروع از ابتدا</Text>
                <ChevronLeft size={18} color={selected.color} />
              </Pressable>
              </>}
            </LinearGradient>

            {selected.id === 5 ? <StarterC1Curriculum key={course.id} language={course.id} locale={course.locale}/> : selected.id === 1 || selected.id === 2 || selected.id === 3 || selected.id === 4 ? <View style={styles.groupList}>
              {selected.id === 4 && <>
                <View ref={grammarRef} collapsable={false}><StarterB2GrammarLab key={`${course.id}-b2-grammar`} language={course.id} locale={course.locale} request={grammarRequest}/></View>
                <View ref={workshopRef} collapsable={false}><StarterB2Workshops key={`${course.id}-b2-workshops`} language={course.id} locale={course.locale} request={workshopRequest}/></View>
              </>}
              {(selected.id === 3 || selected.id === 4) && <>
                <View ref={studioRef} collapsable={false}><StarterLearningStudio key={`${course.id}-${selected.id}-studio`} level={selected.id === 3 ? 'b1' : 'b2'} language={course.id} locale={course.locale} request={studioRequest}/></View>
                <StarterBranchConversations key={`${course.id}-${selected.id}-branch`} level={selected.id === 3 ? 'b1' : 'b2'} language={course.id} locale={course.locale}/>
                <StarterSkillsAssessment key={`${course.id}-${selected.id}-skills`} level={selected.id === 3 ? 'b1' : 'b2'} language={course.id} locale={course.locale} items={selected.id === 3 ? b1Intensive(course.id) : b2Workshops(course.id)}/>
                <StarterSkillsAssessment key={`${course.id}-${selected.id}-independent`} level={selected.id === 3 ? 'b1' : 'b2'} language={course.id} locale={course.locale} items={independentSkills(course.id, selected.id === 3 ? 'b1' : 'b2')} independent/>
              </>}
              <StarterA1Checkpoint key={`${course.id}-${selected.id}`} language={course.id} locale={course.locale} level={selected.id} />
              {selected.id === 3 && <StarterB1Scenarios key={`${course.id}-b1-scenarios`} language={course.id} locale={course.locale} />}
              {selected.id === 3 && <StarterB2Workshops key={`${course.id}-b1-intensives`} language={course.id} locale={course.locale} request={null} level="b1" items={b1Intensive(course.id)}/>}
              <Text style={styles.focusDescription}>{selected.id === 1 ? 'نقشهٔ اختصاصی A1 این زبان دو بخش دارد. درس‌های موجود فقط پوشش بخشی از موضوع هستند؛ تکمیل یک درس به معنای تکمیل کل سرفصل یا سطح نیست.' : selected.id === 2 ? 'نقشهٔ اختصاصی A2 بر اساس سرفصل‌های درخواستی است؛ ارتباط یک درس با سرفصل به معنی پوشش کامل آن یا احراز سطح نیست.' : selected.id === 3 ? 'نقشهٔ B1 بر اساس سرفصل‌های درخواستی است؛ درس‌های موجود فقط بخشی از هر موضوع مرتبط را تمرین می‌دهند.' : 'نقشهٔ B2 بر اساس سرفصل‌های درخواستی است؛ پیوندها فقط تمرین مرتبط و جزئی را نشان می‌دهند و موضوع‌های بدون درس در حال تدوین‌اند.'}</Text>
              {(selected.id === 1 ? getA1Curriculum(course.id) : selected.id === 2 ? getA2Curriculum(course.id) : selected.id === 3 ? getB1Curriculum(course.id) : getB2Curriculum(course.id)).map(section => <View key={section.id} style={styles.groupList}>
                <Text style={styles.lessonSectionTitle}>{section.title} · {fa(section.topics.length)} موضوع</Text>
                {section.topics.map(topic => <View key={`${section.id}-${topic.number}`} style={styles.focusCard}>
                  <Text style={styles.topicTitle}>{fa(topic.number)}. {topic.title}</Text>
                  {selected.id === 2 && course.id === 'es' && section.id === 'foundation' && topic.number === 8 ? <Text style={styles.focusDescription}>در فهرست دستور مؤسسهٔ سروانتس، این زمان در ستون A2 ارائه نشده است؛ سطح‌بندی آن نیازمند بررسی تخصصی است.</Text> : null}
                  {selected.id === 3 && course.id === 'es' && section.id === 'foundation' && topic.number === 8 ? <Text style={styles.focusDescription}>شرط غیرواقعی با imperfecto de subjuntivo در برخی برنامه‌ها، از جمله دورهٔ B2 سروانتس، قرار دارد و اینجا به درخواست شما معرفی شده است.</Text> : null}
                  {(selected.id===3 || selected.id===4) && (section.id==='foundation' || section.id==='survival') && <StarterTopicPractice key={`${course.id}-${selected.id}-${section.id}-${topic.number}`} level={selected.id===3?'b1':'b2'} section={section.id} number={topic.number} title={topic.title} language={course.id} locale={course.locale} lessons={topic.relatedLessonIds.flatMap(id=>{const lesson=selectedLessons.find(item=>item.id===id);return lesson?[lesson]:[];})}/>}
                  {!topic.relatedLessonIds.length && <Text style={styles.focusDescription}>در حال تدوین</Text>}
                  {selected.id === 4 && b2GrammarLinks(course.id,section.id,topic.number).map(id=>{const item=b2GrammarLab(course.id).find(card=>card.id===id);return item?<Pressable key={`grammar-${id}`} accessibilityRole="button" accessibilityLabel={`باز کردن نکتهٔ دستور ${item.title}`} style={styles.topicButton} onPress={()=>openPractice('grammar',id)}><Text style={styles.topicButtonText}>دستور تکمیلی · {item.title}</Text><ChevronLeft size={16} color={Palette.primary}/></Pressable>:null;})}
                  {selected.id === 4 && b2WorkshopLinks(section.id,topic.number).map(id=>{const item=b2Workshops(course.id).find(task=>task.id===id);return item?<Pressable key={`workshop-${id}`} accessibilityRole="button" accessibilityLabel={`باز کردن کارگاه ${item.title}`} style={styles.topicButton} onPress={()=>openPractice('workshop',id)}><Text style={styles.topicButtonText}>کارگاه مرتبط · {item.title}</Text><ChevronLeft size={16} color={Palette.primary}/></Pressable>:null;})}
                  {(selected.id===3 || selected.id===4) && studioLinks(selected.id===3?'b1':'b2',section.id,topic.number).map(id=>{const item=learningStudio(selected.id===3?'b1':'b2').find(task=>task.id===id);return item?<Pressable key={`studio-${id}`} accessibilityRole="button" accessibilityLabel={`باز کردن استودیو ${item.title}`} style={styles.topicButton} onPress={()=>openPractice('studio',id)}><Text style={styles.topicButtonText}>استودیوی مرتبط · {item.title}</Text><ChevronLeft size={16} color={Palette.primary}/></Pressable>:null;})}
                  {topic.relatedLessonIds.map(id => {
                    const item = selectedLessons.find(lesson => lesson.id === id);
                    if (!item) return null;
                    return <View key={id} style={styles.topicRelated}>
                      <Text style={styles.focusDescription}>درس مرتبط · پوشش جزئی</Text>
                      <Pressable accessibilityRole="button" accessibilityLabel={`باز کردن درس ${item.title}`} style={styles.topicButton} onPress={() => openLesson(item.id)}>
                        <Text style={styles.topicButtonText}>{item.title} · {lessonStatus(item, progress, sessions)}</Text><ChevronLeft size={16} color={Palette.primary}/>
                      </Pressable>
                    </View>;
                  })}
                </View>)}
              </View>)}
            </View> : <>
            <View style={styles.focusCard}>
              <View style={styles.focusHeadingRow}><View style={styles.focusIcon}><Sparkles size={17} color={Palette.primary} /></View><View style={styles.focusHeadingCopy}><Text style={styles.focusEyebrow}>LEVEL FOCUS</Text><Text style={styles.focusTitle}>موضوعات این سطح</Text></View></View>
              <Text style={styles.focusDescription}>{selected.description}</Text>
              <View style={styles.moduleGrid}>{selected.modules.map((module, index) => <View key={`${index}-${module}`} style={styles.moduleChip}><View style={[styles.moduleDot, { backgroundColor: selected.color }]} /><Text style={styles.moduleText}>{displayEnglishModuleLabel(module)}</Text></View>)}</View>
              <Text style={styles.focusFootnote}>{selected.status === 'planned' ? 'این سطح بخشی از نقشهٔ آینده است؛ تا زمان تدوین، درس یا جمله‌ای به شمار محتوای موجود اضافه نمی‌شود.' : `این سطح شامل ${fa(selected.modules.length)} درس است؛ این نقشه سنجش رسمی CEFR نیست.`}</Text>
            </View>

            <View style={styles.lessonSectionHeading}><View><Text style={styles.brandEyebrow}>SENTENCE-BASED LESSONS</Text><Text style={styles.lessonSectionTitle}>درس‌ها، به ترتیب</Text></View><View style={styles.lessonCountPill}><BookOpen size={13} color={Palette.primary} /><Text style={styles.lessonCountText}>{fa(selectedLessons.length)} درس</Text></View></View>

            {selectedLessons.length ? <View style={styles.groupList}>{lessonGroups.map((group, index) => {
              const first = group.lessons[0];
              const last = group.lessons[group.lessons.length - 1];
              const groupCompleted = group.lessons.filter(item => completedIds.includes(item.id)).length;
              const open = expandedGroup === index;
              return <View key={`${first.id}-${last.id}`} style={styles.group}>
                <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} style={styles.groupHeader} onPress={() => setExpandedGroup(open ? -1 : index)}>
                  <View style={[styles.groupNumber, open && styles.groupNumberActive]}><Text style={[styles.groupNumberText, open && styles.groupNumberTextActive]}>{fa(index + 1)}</Text></View>
                  <View style={styles.groupHeaderCopy}><Text style={styles.groupTitle}>{groupLabels[group.kind]} · درس‌های {fa(selectedLessons.indexOf(first) + 1)} تا {fa(selectedLessons.indexOf(last) + 1)}</Text><Text style={styles.groupMeta}>{fa(group.lessons.length)} درس · {fa(groupCompleted)} تکمیل‌شده</Text></View>
                  {open ? <ChevronUp size={18} color={Palette.primary} /> : <ChevronDown size={18} color={Palette.muted} />}
                </Pressable>
                {open && <View style={styles.lessonList}>{group.lessons.map(item => {
                  const status = lessonStatus(item, progress, sessions);
                  const complete = progress?.completedLessonIds.includes(item.id) ?? false;
                  const resumable = !complete && status.startsWith('ادامه');
                  const sentence = item.sentences[0];
                  return <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`${selectedLessons.indexOf(item) + 1}. ${item.title}`} style={styles.lessonCard} onPress={() => openLesson(item.id)}>
                    <View style={[styles.lessonOrder, complete && styles.lessonOrderComplete]}>{complete ? <Check size={16} color="#FFFFFF" strokeWidth={3} /> : <Text style={styles.lessonOrderText}>{fa(selectedLessons.indexOf(item) + 1)}</Text>}</View>
                    <View style={styles.lessonCopy}>
                      <View style={styles.lessonTitleLine}><Text style={styles.lessonTitle}>{item.title}</Text><View style={[styles.lessonStatus, complete && styles.lessonStatusDone, resumable && styles.lessonStatusResume]}><Text style={[styles.lessonStatusText, complete && styles.lessonStatusTextDone, resumable && styles.lessonStatusTextResume]}>{status}</Text></View></View>
                      <Text style={styles.lessonSubtitle}>{item.subtitle}</Text>
                      <View style={styles.lessonSentencePreview}>
                        <View style={styles.lessonSentenceHeader}><Volume2 size={12} color={Palette.primary} /><Text style={styles.lessonSentenceEyebrow}>{item.learningMode === 'chunks' ? 'عبارت آغازین' : item.learningMode ? 'واژهٔ آغازین' : 'جملهٔ آغازین'}</Text></View>
                        <Text style={styles.lessonSentenceRussian}>{sentence.text}</Text>
                        <Text style={styles.lessonSentenceFa}>{sentence.fa}</Text>
                        {!!sentence.vocabulary.length && <View style={styles.lessonVocabRow}>{sentence.vocabulary.slice(0, 3).map(word => <Text key={word.word} style={styles.lessonVocabChip}>{word.word} · {word.meaning}</Text>)}</View>}
                      </View>
                      <View style={styles.lessonFooter}><View style={styles.lessonFooterItem}><Clock3 size={12} color={Palette.muted} /><Text style={styles.lessonFooterText}>{fa(item.durationMinutes)} دقیقه</Text></View><Text style={styles.lessonFooterDot}>·</Text><Text style={styles.lessonFooterText}>{fa(item.sentences.length)} {item.learningMode === 'chunks' ? 'عبارت' : item.learningMode ? 'واژه' : 'جمله'} اصلی</Text></View>
                    </View>
                    <View style={styles.lessonPlayIcon}><Play size={13} color={Palette.primary} fill={Palette.primary} /></View>
                  </Pressable>;
                })}</View>}
              </View>;
            })}</View> : <View style={styles.emptyLevel}>
              <View style={styles.emptyIcon}><Sparkles size={24} color={Palette.primary} /></View>
              <Text style={styles.emptyTitle}>درس‌های این سطح هنوز تدوین نشده‌اند</Text>
              <Text style={styles.emptyDescription}>موضوع‌های سطح در نقشه ثبت شده‌اند، اما جمله یا درس ساختگی نمایش داده نمی‌شود. مسیر موجود فعلاً از الفبا تا موقعیت‌های مقدماتی ادامه دارد.</Text>
            </View>}
            </>}
          </>}
          {!!error && <View style={styles.errorCard}><Text accessibilityRole="alert" style={styles.errorText}>{error}</Text><Pressable accessibilityRole="button" onPress={() => setRetry(value => value + 1)}><Text style={styles.retryText}>تلاش دوباره</Text></Pressable></View>}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  patternCountNote: { fontFamily: Typography.fontFamily, fontSize: 11, lineHeight: 19, color: '#E5E7FF', textAlign: 'right', writingDirection: 'rtl' },
  topicTitle: { fontFamily: Typography.boldFontFamily, color: Palette.ink, fontSize: 15, lineHeight: 25, textAlign: 'right', writingDirection: 'rtl' },
  topicRelated: { gap: 6 },
  topicButton: { minHeight: 44, padding: 10, borderRadius: 12, backgroundColor: Palette.primarySoft, flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  topicButtonText: { flex: 1, fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 13, lineHeight: 22, textAlign: 'right', writingDirection: 'rtl' },
  root: { flex: 1, backgroundColor: Palette.canvas },
  scrollContent: { flexGrow: 1 },
  page: { width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 50, gap: 17 },
  topBar: { gap: 4 },
  selectedBrandRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  selectedTopBar: { gap: 5 },
  backButton: { alignSelf: 'flex-start', minHeight: 38, flexDirection: 'row-reverse', alignItems: 'center', gap: 5, paddingHorizontal: 10, borderRadius: 12, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, marginBottom: 7 },
  backText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 11, fontWeight: '400', writingDirection: 'rtl' },
  brandEyebrow: { fontFamily: 'Times New Roman', color: Palette.primary, fontSize: 7, fontWeight: '800', letterSpacing: 1.2, writingDirection: 'ltr' },
  pageTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 29, lineHeight: 39, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  pageIntro: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 13, lineHeight: 23, textAlign: 'right', writingDirection: 'rtl' },
  overviewHero: { position: 'relative', overflow: 'hidden', marginTop: 60, borderRadius: 25, padding: 20, gap: 10, shadowColor: '#282671', shadowOpacity: .16, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
  heroOrb: { position: 'absolute', top: -50, left: -42, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.09)' },
  heroTopRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  heroIcon: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  heroPill: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 10, paddingVertical: 6 },
  heroPillText: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 10, fontWeight: '400', writingDirection: 'rtl' },
  overviewEyebrow: { fontFamily: 'Times New Roman', color: '#C6C9FF', fontSize: 6, fontWeight: '800', letterSpacing: 1.4, writingDirection: 'ltr', marginTop: 4 },
  overviewTitle: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 26, lineHeight: 38, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  overviewText: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.78)', fontSize: 12, lineHeight: 21, textAlign: 'right', writingDirection: 'rtl' },
  overviewMetrics: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-around', marginTop: 5, paddingTop: 13, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.18)' },
  overviewMetric: { flex: 1, alignItems: 'center', gap: 2 },
  overviewMetricValue: { fontFamily: Typography.numberFontFamily, color: '#FFFFFF', fontSize: 18, fontWeight: '400', writingDirection: 'rtl' },
  overviewMetricLabel: { fontFamily: Typography.fontFamily, color: '#CFD2FF', fontSize: 9, writingDirection: 'rtl' },
  overviewMetricDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.18)' },
  levelRailCard: { padding: 16, gap: 12, borderRadius: 21, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  railWrap: { paddingVertical: 5 },
  railCurrent: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 12, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  levelList: { gap: 9 },
  levelOption: { minHeight: 96, flexDirection: 'row-reverse', alignItems: 'center', gap: 12, padding: 14, borderRadius: 20, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, shadowColor: '#211A68', shadowOpacity: .035, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  levelOptionMark: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  levelOptionNumber: { fontFamily: 'Beiruti', color: '#FFFFFF', fontSize: 17, fontWeight: '400', writingDirection: 'rtl' },
  levelOptionContent: { flex: 1, gap: 5 },
  levelOptionTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  levelOptionTitle: { flexShrink: 1, fontFamily: Typography.latinFontFamily, color: Palette.ink, fontSize: 12, fontWeight: '800', textAlign: 'right', writingDirection: 'ltr' },
  levelOptionBand: { fontFamily: Typography.fontFamily, fontSize: 9, fontWeight: '400', writingDirection: 'rtl' },
  levelOptionDescription: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 11, textAlign: 'right', writingDirection: 'rtl' },
  levelOptionMeta: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  levelOptionMetaText: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, writingDirection: 'rtl' },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Palette.border },
  levelHero: { position: 'relative', overflow: 'hidden', padding: 20, borderRadius: 25, gap: 9, shadowColor: '#24245C', shadowOpacity: .16, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
  levelHeroOrb: { position: 'absolute', top: -60, right: -30, width: 190, height: 190, borderRadius: 95, backgroundColor: 'rgba(255,255,255,0.10)' },
  levelHeroTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  levelHeroTag: { borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.16)', paddingHorizontal: 10, paddingVertical: 5 },
  levelHeroTagText: { fontFamily: 'Times New Roman', color: '#FFFFFF', fontSize: 7, fontWeight: '800', letterSpacing: 1, writingDirection: 'ltr' },
  levelHeroBand: { fontFamily: 'Times New Roman', color: 'rgba(255,255,255,0.85)', fontSize: 8, fontWeight: '800', writingDirection: 'ltr' },
  selectedTitle: { fontFamily: Typography.latinFontFamily, color: '#FFFFFF', fontSize: 25, lineHeight: 37, fontWeight: '800', textAlign: 'right', writingDirection: 'ltr', marginTop: 4 },
  selectedDescription: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.8)', fontSize: 12, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  selectedProgressHeading: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  selectedProgressLabel: { fontFamily: Typography.fontFamily, color: '#DCE0FF', fontSize: 10, writingDirection: 'rtl' },
  selectedProgressValue: { fontFamily: Typography.numberFontFamily, color: '#FFFFFF', fontSize: 10, fontWeight: '400', writingDirection: 'rtl' },
  selectedProgressTrack: { height: 7, borderRadius: 999, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.22)' },
  selectedProgressFill: { height: '100%', alignSelf: 'flex-end', borderRadius: 999, backgroundColor: '#B8F28F' },
  levelStartButton: { minHeight: 48, marginTop: 5, paddingHorizontal: 15, borderRadius: 15, backgroundColor: '#FFFFFF', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 9 },
  levelStartBeginningButton: { minHeight: 48, marginTop: 8, paddingHorizontal: 15, borderRadius: 15, backgroundColor: '#F5F2FF', borderWidth: 1, borderColor: '#D8D2FF', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 9 },
  levelStartButtonDisabled: { opacity: 0.55 },
  levelStartButtonText: { flex: 1, fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 12, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  metricGrid: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-around', paddingTop: 12, marginTop: 2, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.18)' },
  heroMetric: { flex: 1, alignItems: 'center', gap: 1 },
  heroMetricValue: { fontFamily: Typography.numberFontFamily, color: '#FFFFFF', fontSize: 17, fontWeight: '400', writingDirection: 'rtl' },
  heroMetricLabel: { fontFamily: Typography.fontFamily, color: '#D6D9FF', fontSize: 9, writingDirection: 'rtl' },
  heroMetricDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.18)' },
  focusCard: { padding: 17, borderRadius: 21, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: 10 },
  focusHeadingRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 9 },
  focusIcon: { width: 36, height: 36, borderRadius: 13, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  focusHeadingCopy: { flex: 1, alignItems: 'flex-end', gap: 1 },
  focusEyebrow: { fontFamily: 'Times New Roman', color: Palette.primary, fontSize: 6, fontWeight: '800', letterSpacing: 1.2, writingDirection: 'ltr' },
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
  groupList: { gap: 10 },
  group: { gap: 8 },
  groupHeader: { minHeight: 68, flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingHorizontal: 13, paddingVertical: 10, borderRadius: 17, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  groupNumber: { width: 36, height: 36, borderRadius: 12, backgroundColor: Palette.surfaceMuted, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Palette.border },
  groupNumberActive: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  groupNumberText: { fontFamily: Typography.numberFontFamily, color: Palette.muted, fontSize: 12, fontWeight: '400', writingDirection: 'rtl' },
  groupNumberTextActive: { color: '#FFFFFF' },
  groupHeaderCopy: { flex: 1, alignItems: 'flex-end', gap: 2 },
  groupTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 12, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  groupMeta: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
  lessonList: { gap: 8 },
  lessonCard: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 18, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  lessonOrder: { width: 33, height: 33, borderRadius: 11, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  lessonOrderComplete: { backgroundColor: Palette.success },
  lessonOrderText: { fontFamily: 'Beiruti', color: Palette.primaryDark, fontSize: 11, fontWeight: '400', writingDirection: 'rtl' },
  lessonCopy: { flex: 1, gap: 4 },
  lessonTitleLine: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  lessonTitle: { fontFamily: Typography.fontFamily, flexShrink: 1, color: Palette.ink, fontSize: 13, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  lessonSubtitle: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  lessonStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, backgroundColor: Palette.surfaceMuted },
  lessonStatusDone: { backgroundColor: Palette.successSoft },
  lessonStatusResume: { backgroundColor: Palette.warningSoft },
  lessonStatusText: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 8, fontWeight: '400', writingDirection: 'rtl' },
  lessonStatusTextDone: { color: Palette.success },
  lessonStatusTextResume: { color: Palette.warning },
  lessonSentencePreview: { marginTop: 5, padding: 10, borderRadius: 14, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border, gap: 4 },
  lessonSentenceHeader: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5 },
  lessonSentenceEyebrow: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 8, fontWeight: '400', writingDirection: 'rtl' },
  lessonSentenceRussian: { fontFamily: 'Times New Roman', color: Palette.ink, fontSize: 12, lineHeight: 21, fontWeight: '800', textAlign: 'right', writingDirection: 'ltr' },
  lessonSentenceFa: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  lessonVocabRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 5, marginTop: 2 },
  lessonVocabChip: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, backgroundColor: Palette.primarySoft, fontSize: 8, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 8, writingDirection: 'rtl' },
  lessonFooter: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, marginTop: 3 },
  lessonFooterItem: { flexDirection: 'row-reverse', alignItems: 'center', gap: 3 },
  lessonFooterText: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 8, writingDirection: 'rtl' },
  lessonFooterDot: { color: Palette.border, fontSize: 11 },
  lessonPlayIcon: { width: 27, height: 27, borderRadius: 9, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  emptyLevel: { padding: 24, gap: 11, alignItems: 'center', borderRadius: 21, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surface },
  emptyIcon: { width: 50, height: 50, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.primarySoft },
  emptyTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 17, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  emptyDescription: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 12, lineHeight: 21, textAlign: 'right', writingDirection: 'rtl' },
  errorCard: { padding: 14, flexDirection: 'row-reverse', alignItems: 'center', gap: 10, borderRadius: 16, backgroundColor: Palette.dangerSoft, borderWidth: 1, borderColor: '#F5CDD3' },
  errorText: { flex: 1, fontFamily: Typography.fontFamily, color: Palette.danger, fontSize: 11, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  retryText: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 11, fontWeight: '400', writingDirection: 'rtl' },
});
