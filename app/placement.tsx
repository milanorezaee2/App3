import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, BookOpenCheck, Check, ChevronLeft, RotateCcw, Sparkles } from 'lucide-react-native';
import { COURSE_LEVELS } from '@/lib/courseContent';
import { RUSSIAN_ONLY_BUILD } from '@/lib/features';
import { evaluatePlacementLevel, getPlacementLevelIds, getPlacementQuestionForLevel, getPlacementQuestions, placementTransition, scorePlacement, type PlacementDirection, type PlacementLanguage } from '@/lib/placement';
import { savePlacementRecommendation } from '@/lib/placementProfile';
import { PageNavigation } from '@/components/PageNavigation';
import { Typography } from '@/lib/theme';
import { toPersianDigits } from '@/lib/format';

const colors = {
  ink: '#24213A',
  text: '#514D64',
  muted: '#817D91',
  canvas: '#F7F6FB',
  surface: '#FFFFFF',
  border: '#E7E4EF',
  violet: '#7558D8',
  violetSoft: '#F0ECFC',
  green: '#4E8063',
  greenSoft: '#EAF5ED',
  gold: '#A16C20',
  goldSoft: '#FFF4DF',
};

const ENGLISH_LEVEL_LABELS = ['شروع از صفر', 'موقعیت‌های ضروری', 'انگلیسی روزمره', 'ارتباط روان', 'پیشرفته (B2)', 'ارتباط تحلیلی (C1)'] as const;
const RUSSIAN_LEVEL_LABELS = ['شروع از صفر', 'روسی کاربردی', 'روسی روزمره (A2)', 'ارتباط روسی (B1)', 'روسی پیشرفته (B2)', 'ارتباط پیشرفته (C1)'] as const;
const LEVEL_SELF_DESCRIPTIONS = [
  'تازه شروع می‌کنم یا فقط چند واژهٔ پراکنده می‌دانم.',
  'سلام‌واحوال‌پرسی و چند نیاز ساده را می‌فهمم.',
  'از پس گفت‌وگوهای معمول و موقعیت‌های روزمره برمی‌آیم.',
  'می‌توانم تجربه و نظر خودم را در گفت‌وگوی معمول توضیح بدهم.',
  'متن‌های نسبتاً پیشرفته و گفت‌وگوهای چندمرحله‌ای را دنبال می‌کنم.',
  'موضوع‌های تخصصی را تحلیل می‌کنم و دقیق و حرفه‌ای بحث می‌کنم.',
] as const;

function getLevelLabel(language: PlacementLanguage, levelId: number) {
  const labels = language === 'ru' ? RUSSIAN_LEVEL_LABELS : ENGLISH_LEVEL_LABELS;
  return labels[levelId] ?? COURSE_LEVELS.find(level => level.id === levelId)?.title ?? 'سطح آموزشی';
}

function getStartingLevelId(language: PlacementLanguage) {
  const ids = getPlacementLevelIds(language);
  return ids[Math.floor((ids.length - 1) / 2)] ?? ids[0] ?? 0;
}

function getLevelDescription(language: PlacementLanguage, levelId: number) {
  if (levelId === 0) return language === 'ru' ? 'شناخت جمله‌های بسیار ساده و واژه‌های پایهٔ روسی.' : 'شناخت عبارت‌های بسیار ساده و واژه‌های پایهٔ انگلیسی.';
  return LEVEL_SELF_DESCRIPTIONS[levelId] ?? 'می‌خواهم سطح مناسب خودم را پیدا کنم.';
}

function getLevelRoute(language: PlacementLanguage, levelId: number) {
  return language === 'ru'
    ? { pathname: '/learn/ru/library', params: { level: String(levelId) } }
    : { pathname: '/lang/library', params: { level: String(levelId) } };
}

function getLevelListRoute(language: PlacementLanguage) {
  return language === 'ru' ? '/learn/ru/library' : '/lang/library';
}

export default function PlacementScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ language?: string | string[] }>();
  const routeLanguage = Array.isArray(params.language) ? params.language[0] : params.language;
  const language: PlacementLanguage = routeLanguage === 'ru' || (!routeLanguage && RUSSIAN_ONLY_BUILD) ? 'ru' : 'en';
  const { width } = useWindowDimensions();
  const compact = width < 620;
  const questions = getPlacementQuestions(language);
  const levelIds = getPlacementLevelIds(language);
  const startingLevelId = getStartingLevelId(language);
  const initialQuestion = getPlacementQuestionForLevel(language, startingLevelId, {});
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(startingLevelId);
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(startingLevelId);
  const [direction, setDirection] = useState<PlacementDirection>('initial');
  const [questionDirections, setQuestionDirections] = useState<Record<string, PlacementDirection>>(initialQuestion ? { [initialQuestion.id]: 'initial' } : {});
  const [questionIds, setQuestionIds] = useState<string[]>(initialQuestion ? [initialQuestion.id] : []);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const [recommendedLevelId, setRecommendedLevelId] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'local'>('idle');
  const autoRouteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const startLevelId = getStartingLevelId(language);
    const firstQuestion = getPlacementQuestionForLevel(language, startLevelId, {});
    setSelectedLevelId(startLevelId);
    setCurrentLevelId(startLevelId);
    setDirection('initial');
    setQuestionDirections(firstQuestion ? { [firstQuestion.id]: 'initial' } : {});
    setQuestionIds(firstQuestion ? [firstQuestion.id] : []);
    setQuestionIndex(0);
    setAnswers({});
    setFinished(false);
    setRecommendedLevelId(null);
    setSaveStatus('idle');
  }, [language]);

  const currentQuestionId = questionIds[questionIndex] ?? null;
  const question = currentQuestionId ? questions.find(item => item.id === currentQuestionId) ?? null : null;
  const activeLevelId = question?.levelId ?? currentLevelId;
  const activeDirection = question ? questionDirections[question.id] ?? direction : direction;
  const result = useMemo(
    () => finished && recommendedLevelId !== null ? scorePlacement(language, answers, recommendedLevelId) : null,
    [answers, finished, language, recommendedLevelId],
  );
  const languageName = language === 'ru' ? 'روسی' : 'انگلیسی';
  const hasAnswer = !!question && Object.prototype.hasOwnProperty.call(answers, question.id);
  const selectedAnswer = question ? answers[question.id] : undefined;
  const currentLevelQuestions = activeLevelId === null ? [] : questions.filter(item => item.levelId === activeLevelId);
  const currentBandQuestionNumber = question ? Math.max(1, currentLevelQuestions.findIndex(item => item.id === question.id) + 1) : 1;
  const queuedQuestion = activeLevelId === null ? null : getPlacementQuestionForLevel(language, activeLevelId, answers);
  const bandOutcome = activeLevelId === null ? 'incomplete' : evaluatePlacementLevel(language, activeLevelId, answers);
  const transition = bandOutcome === 'pass' || bandOutcome === 'fail'
    ? placementTransition(language, activeLevelId!, activeDirection, bandOutcome)
    : null;
  const nextButtonLabel = queuedQuestion
    ? 'پرسش بعدی'
    : bandOutcome === 'incomplete'
      ? 'ادامهٔ سنجش'
      : transition && transition.nextLevelId !== null
        ? 'بررسی سطح دیگر'
        : 'دیدن پیشنهاد';

  useEffect(() => {
    if (!result) return;
    let mounted = true;
    setSaveStatus('saving');
    void savePlacementRecommendation(language, result)
      .then(({ synced }) => { if (mounted) setSaveStatus(synced ? 'saved' : 'local'); })
      .catch(() => { if (mounted) setSaveStatus('local'); });
    autoRouteTimer.current = setTimeout(() => {
      router.replace(getLevelRoute(language, result.recommendedLevelId) as never);
    }, 4500);
    return () => {
      mounted = false;
      if (autoRouteTimer.current) clearTimeout(autoRouteTimer.current);
    };
  }, [language, result, router]);

  const startAtLevel = (levelId: number) => {
    const firstQuestion = getPlacementQuestionForLevel(language, levelId, {});
    if (!firstQuestion) return;
    setSelectedLevelId(levelId);
    setCurrentLevelId(levelId);
    setDirection('initial');
    setQuestionDirections({ [firstQuestion.id]: 'initial' });
    setQuestionIds([firstQuestion.id]);
    setQuestionIndex(0);
    setAnswers({});
    setRecommendedLevelId(null);
    setFinished(false);
  };

  const choose = (answerIndex: number) => {
    if (!question) return;
    const futureIds = questionIds.slice(questionIndex + 1);
    setAnswers(current => {
      const nextAnswers = { ...current, [question.id]: answerIndex };
      futureIds.forEach(id => { delete nextAnswers[id]; });
      return nextAnswers;
    });
    setQuestionIds(current => current.slice(0, questionIndex + 1));
  };

  const next = () => {
    if (!hasAnswer || !question || activeLevelId === null) return;
    if (questionIndex + 1 < questionIds.length) {
      setQuestionIndex(index => index + 1);
      return;
    }

    const nextInLevel = getPlacementQuestionForLevel(language, activeLevelId, answers);
    if (nextInLevel) {
      setQuestionIds(ids => [...ids.slice(0, questionIndex + 1), nextInLevel.id]);
      setQuestionDirections(current => ({ ...current, [nextInLevel.id]: activeDirection }));
      setQuestionIndex(index => index + 1);
      return;
    }

    const outcome = evaluatePlacementLevel(language, activeLevelId, answers);
    if (outcome === 'incomplete') return;
    const move = placementTransition(language, activeLevelId, activeDirection, outcome);
    if (move.nextLevelId !== null) {
      const firstQuestion = getPlacementQuestionForLevel(language, move.nextLevelId, answers);
      if (!firstQuestion) {
        setRecommendedLevelId(move.recommendedLevelId ?? move.nextLevelId);
        setFinished(true);
        return;
      }
      setCurrentLevelId(move.nextLevelId);
      setDirection(move.nextDirection);
      setQuestionIds(ids => [...ids.slice(0, questionIndex + 1), firstQuestion.id]);
      setQuestionDirections(current => ({ ...current, [firstQuestion.id]: move.nextDirection }));
      setQuestionIndex(index => index + 1);
      return;
    }
    setRecommendedLevelId(move.recommendedLevelId ?? 0);
    setFinished(true);
  };

  const previous = () => setQuestionIndex(index => Math.max(0, index - 1));
  const restart = () => {
    if (autoRouteTimer.current) clearTimeout(autoRouteTimer.current);
    startAtLevel(getStartingLevelId(language));
    setSaveStatus('idle');
  };
  const openSuggestedLevel = () => {
    if (autoRouteTimer.current) clearTimeout(autoRouteTimer.current);
    if (result) router.replace(getLevelRoute(language, result.recommendedLevelId) as never);
  };
  const openLanguageHome = () => {
    if (autoRouteTimer.current) clearTimeout(autoRouteTimer.current);
    router.replace(getLevelListRoute(language) as never);
  };
  const introStage = selectedLevelId === null && !finished;
  const totalLevelCount = levelIds.length;
  const startingLevelIndex = Math.max(0, levelIds.indexOf(startingLevelId));
  const maxQuestionCount = Math.max(levelIds.length - startingLevelIndex, startingLevelIndex + 1) * 3;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.page, compact && styles.pageCompact]}>
          <View style={styles.topbar}>
            <PageNavigation backFallback="/languages" />
            <View style={styles.brandMark}><BookOpenCheck size={17} color={colors.violet} /><Text style={styles.brandText}>شروع پیشنهادی · {languageName}</Text></View>
          </View>

          <LinearGradient colors={['#26204F', '#51458B', '#7558D8']} start={{ x: .96, y: .05 }} end={{ x: .08, y: 1 }} style={[styles.hero, compact && styles.heroCompact]}>
            <View pointerEvents="none" style={styles.heroOrb} />
            <View style={styles.heroIcon}><Sparkles size={17} color="#FFF1B9" /></View>
            <Text style={styles.heroTitle}>{finished ? 'نقشهٔ شروع تو آماده است' : introStage ? 'از نقطهٔ آشنای خودت شروع کنیم' : 'چند پرسش کوتاه از دوره'}</Text>
            <Text style={styles.heroDescription}>
              {finished
                ? 'پیشنهاد بر پایهٔ پاسخ‌های واقعی به جمله‌های همین دوره آماده شده؛ پس از چند ثانیه خودکار وارد سطح پیشنهادی می‌شوی.'
                : `سنجش ${languageName} از سطح میانی شروع شده است. نمونه‌های کوتاه را بخوان و پاسخ بده؛ آزمون با توجه به پاسخ‌ها به سطح بالاتر یا پایین‌تر می‌رود.`}
            </Text>
            {!finished ? (
              <View style={styles.heroMetaRow}>
                <Text style={styles.heroMeta}>حداکثر {toPersianDigits(maxQuestionCount)} پرسش</Text>
                <View style={styles.heroMetaDot} />
                <Text style={styles.heroMeta}>{introStage ? '۲ تا ۸ پرسش معمولاً' : 'سؤال سوم فقط برای پاسخ مرزی'}</Text>
                <View style={styles.heroMetaDot} />
                <Text style={styles.heroMeta}>پاسخ خام ذخیره نمی‌شود</Text>
              </View>
            ) : null}
          </LinearGradient>

          {introStage ? (
            <View style={styles.questionCard}>
              <Text style={styles.questionPrompt}>کدام توصیف به آشنایی امروزت با {languageName} نزدیک‌تر است؟</Text>
              <Text style={styles.introExplanation}>این انتخاب فقط نقطهٔ شروع آزمون است؛ اگر پاسخ‌های محتوایی نشان دهند سطح دیگری مناسب‌تر است، پیشنهاد تغییر می‌کند.</Text>
              <View style={styles.options}>
                {levelIds.map(levelId => (
                  <Pressable
                    key={levelId}
                    accessibilityRole="button"
                    accessibilityLabel={`${getLevelLabel(language, levelId)}. ${getLevelDescription(language, levelId)}`}
                    onPress={() => startAtLevel(levelId)}
                    style={({ pressed }) => [styles.levelChoice, pressed && styles.pressed]}
                  >
                    <View style={styles.optionNumber}><Text style={styles.optionNumberText}>{toPersianDigits(levelId + 1)}</Text></View>
                    <View style={styles.levelChoiceCopy}>
                      <Text style={styles.levelChoiceTitle}>{getLevelLabel(language, levelId)}</Text>
                      <Text style={styles.levelChoiceDescription}>{getLevelDescription(language, levelId)}</Text>
                    </View>
                    <ChevronLeft size={16} color={colors.violet} />
                  </Pressable>
                ))}
              </View>
              <Text style={styles.introHint}>اگر مطمئن نیستی، «شروع از صفر» را انتخاب کن؛ آزمون در صورت نیاز سطح را بالاتر می‌برد.</Text>
            </View>
          ) : !finished && question ? (
            <View style={styles.questionCard}>
              <View style={styles.questionTop}>
                <View style={styles.questionCounter}>
                  <Text style={styles.questionCounterText}>پرسش {toPersianDigits(questionIndex + 1)} · سطح {toPersianDigits((activeLevelId ?? 0) + 1)} از {toPersianDigits(totalLevelCount)}</Text>
                </View>
                <Text style={styles.questionLevel}>{getLevelLabel(language, question.levelId)}</Text>
              </View>
              <View
                accessibilityRole="progressbar"
                accessibilityLabel="پیشرفت در سنجش سطح جاری"
                accessibilityValue={{ min: 1, max: 3, now: currentBandQuestionNumber }}
                style={styles.progressTrack}
              >
                <View style={[styles.progressFill, { width: `${(currentBandQuestionNumber / 3) * 100}%` }]} />
              </View>

              <Text style={styles.questionPrompt}>{question.prompt}</Text>
              {language === 'en' ? (
                <View style={styles.passageCard}>
                  <Text style={styles.passageLabel}>ENGLISH EXAMPLE</Text>
                  <Text style={styles.passageText}>{question.passage}</Text>
                </View>
              ) : null}

              <View style={styles.options}>
                {question.choices.map((choice, index) => {
                  const selected = selectedAnswer === index;
                  const ltrChoice = /[A-Za-zА-Яа-яЁё]/.test(choice) && !/[آ-ی]/.test(choice);
                  return (
                    <Pressable
                      key={`${question.id}-${index}`}
                      accessibilityRole="button"
                      accessibilityLabel={`گزینهٔ ${toPersianDigits(index + 1)}: ${choice}`}
                      accessibilityState={{ selected }}
                      onPress={() => choose(index)}
                      style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && styles.pressed]}
                    >
                      <View style={[styles.optionNumber, selected && styles.optionNumberSelected]}>
                        {selected ? <Check size={14} color="#FFFFFF" strokeWidth={3} /> : <Text style={styles.optionNumberText}>{toPersianDigits(index + 1)}</Text>}
                      </View>
                      <Text style={[styles.optionText, ltrChoice && styles.optionTextLtr, selected && styles.optionTextSelected]}>{choice}</Text>
                    </Pressable>
                  );
                })}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="نمی‌دانم یا هنوز یاد نگرفته‌ام"
                  accessibilityState={{ selected: selectedAnswer === -1 }}
                  onPress={() => choose(-1)}
                  style={({ pressed }) => [styles.unknownOption, selectedAnswer === -1 && styles.unknownOptionSelected, pressed && styles.pressed]}
                >
                  <Text style={styles.unknownText}>نمی‌دانم / هنوز یاد نگرفته‌ام</Text>
                  {selectedAnswer === -1 ? <Check size={15} color={colors.gold} /> : null}
                </Pressable>
              </View>

              <View style={styles.questionFooter}>
                <Pressable accessibilityRole="button" accessibilityLabel="پرسش قبلی" accessibilityState={{ disabled: questionIndex === 0 }} disabled={questionIndex === 0} onPress={previous} style={({ pressed }) => [styles.backButton, questionIndex === 0 && styles.buttonDisabled, pressed && styles.pressed]}>
                  <ChevronLeft size={17} color={questionIndex === 0 ? '#B9B6C4' : colors.text} />
                  <Text style={[styles.backButtonText, questionIndex === 0 && styles.disabledText]}>قبلی</Text>
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityState={{ disabled: !hasAnswer }} disabled={!hasAnswer} onPress={next} style={({ pressed }) => [styles.nextButton, !hasAnswer && styles.nextButtonDisabled, pressed && styles.pressed]}>
                  <Text style={[styles.nextButtonText, !hasAnswer && styles.nextButtonTextDisabled]}>{nextButtonLabel}</Text>
                  <ArrowLeft size={16} color={hasAnswer ? '#FFFFFF' : '#AAA7B8'} />
                </Pressable>
              </View>
            </View>
          ) : result ? (
            <View style={styles.resultCard}>
              <View style={styles.resultIcon}><Sparkles size={21} color={colors.green} /></View>
              <Text style={styles.resultEyebrow}>پیشنهاد آغاز</Text>
              <Text style={styles.resultTitle}>{getLevelLabel(language, result.recommendedLevelId)}</Text>
              <Text style={styles.resultSummary}>
                {toPersianDigits(result.correctCount)} پاسخ درست از {toPersianDigits(result.questionCount)} پرسش
                {result.unknownCount ? ` · ${toPersianDigits(result.unknownCount)} مورد «نمی‌دانم»` : ''}
              </Text>

              <View style={styles.bandResults}>
                <Text style={styles.bandHeading}>نمای کلی پاسخ‌ها در سطح‌های بررسی‌شده</Text>
                {result.perLevel.map(level => (
                  <View key={level.levelId} style={styles.bandRow}>
                    <Text style={styles.bandName}>{getLevelLabel(language, level.levelId)}</Text>
                    <View style={styles.bandTrack}><View style={[styles.bandFill, { width: `${(level.correct / level.total) * 100}%`, backgroundColor: level.meetsScreeningThreshold ? colors.green : colors.gold }]} /></View>
                    <Text style={styles.bandScore}>{toPersianDigits(level.correct)} از {toPersianDigits(level.total)}</Text>
                  </View>
                ))}
              </View>

              {result.nonMonotonicPattern ? (
                <View style={styles.cautionBox}>
                  <Text style={styles.cautionText}>الگوی پاسخ‌ها یکدست نیست؛ پیشنهاد را راهنما بدان و در صورت نیاز از فهرست، سطح دیگری را انتخاب کن.</Text>
                </View>
              ) : null}

              <View style={styles.methodNote}>
                <Text style={styles.methodNoteText}>قاعدهٔ تطبیقی: سنجش از سطح میانی آغاز می‌شود؛ هر سطح با ۲ پرسش بررسی می‌شود و در صورت نتیجهٔ مرزی یک پرسش سوم می‌آید. این غربال فقط خواندن و درک معنا را نمونه‌گیری می‌کند؛ آزمون رسمی، ارزیابی گفتار/شنیدن/نوشتن یا گواهی CEFR نیست.</Text>
                <Text style={styles.methodNoteText}>{saveStatus === 'saving' ? 'در حال ذخیرهٔ پیشنهاد برای همین حساب…' : saveStatus === 'saved' ? 'پیشنهاد برای ورود بعدی ذخیره شد؛ پاسخ‌های خام ذخیره نمی‌شوند.' : 'پاسخ‌های خام ذخیره نمی‌شوند؛ اگر همگام‌سازی در دسترس نباشد، پیشنهاد تا زمانی که روی همین دستگاه بمانی حفظ می‌شود.'}</Text>
              </View>
              <View style={styles.resultActions}>
                <Pressable accessibilityRole="button" onPress={openSuggestedLevel} style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}>
                  <Text style={styles.primaryActionText}>ورود به «{getLevelLabel(language, result.recommendedLevelId)}»</Text>
                  <ChevronLeft size={17} color="#FFFFFF" />
                </Pressable>
                <View style={styles.secondaryActions}>
                  <Pressable accessibilityRole="button" onPress={openLanguageHome} style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}>
                    <Text style={styles.secondaryActionText}>دیدن همهٔ سطح‌ها</Text>
                  </Pressable>
                  <Pressable accessibilityRole="button" accessibilityLabel="شروع دوبارهٔ سنجش آغازین" onPress={restart} style={({ pressed }) => [styles.restartAction, pressed && styles.pressed]}>
                    <RotateCcw size={15} color={colors.violet} /><Text style={styles.restartText}>آزمون دوباره</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : null}

          <View style={styles.privacyNote}>
            <Text style={styles.privacyText}>پاسخ خام آزمون به سرور ارسال نمی‌شود. فقط سطح پیشنهادی، زمان سنجش و خلاصهٔ امتیاز برای همین زبان در فرادادهٔ حساب ذخیره می‌شود تا ورود بعدی مستقیم به همان سطح هدایت شوی؛ هیچ جدول، محتوای درس یا روند پیشرفت تغییر نمی‌کند.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  scrollContent: { flexGrow: 1 },
  page: { width: '100%', maxWidth: 780, alignSelf: 'center', paddingHorizontal: 22, paddingTop: 20, paddingBottom: 45, gap: 15 },
  pageCompact: { paddingHorizontal: 14, paddingTop: 13, gap: 12 },
  topbar: { minHeight: 40, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  brandMark: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7, paddingHorizontal: 11, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.violetSoft },
  brandText: { fontFamily: Typography.fontFamily, color: colors.violet, fontSize: 10, fontWeight: '400', writingDirection: 'rtl' },
  hero: { position: 'relative', overflow: 'hidden', marginTop: 60, padding: 23, borderRadius: 25, gap: 8 },
  heroCompact: { padding: 19, borderRadius: 21 },
  heroOrb: { position: 'absolute', top: -75, right: '9%', width: 230, height: 230, borderRadius: 115, backgroundColor: 'rgba(255,255,255,0.08)' },
  heroIcon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.14)' },
  heroTitle: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 22, lineHeight: 32, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  heroDescription: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,.86)', fontSize: 12, lineHeight: 21, textAlign: 'right', writingDirection: 'rtl' },
  heroMetaRow: { flexDirection: 'row-reverse', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 5 },
  heroMeta: { fontFamily: Typography.fontFamily, color: '#E3DFFF', fontSize: 9, writingDirection: 'rtl' },
  heroMetaDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#C7B9FA' },
  questionCard: { padding: 20, borderRadius: 23, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, gap: 15, shadowColor: '#261A53', shadowOpacity: .05, shadowRadius: 16, shadowOffset: { width: 0, height: 7 }, elevation: 2 },
  questionTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  questionCounter: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: colors.violetSoft },
  questionCounterText: { fontFamily: Typography.numberFontFamily, color: colors.violet, fontSize: 10, fontWeight: '400', writingDirection: 'rtl' },
  questionLevel: { fontFamily: Typography.fontFamily, color: colors.muted, fontSize: 10, writingDirection: 'rtl' },
  progressTrack: { height: 6, overflow: 'hidden', borderRadius: 999, backgroundColor: '#EFEDF4' },
  progressFill: { height: '100%', alignSelf: 'flex-end', borderRadius: 999, backgroundColor: colors.violet },
  questionPrompt: { fontFamily: Typography.fontFamily, color: colors.ink, fontSize: 17, lineHeight: 28, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  introExplanation: { fontFamily: Typography.fontFamily, color: colors.text, fontSize: 11, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  levelChoice: { minHeight: 62, flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: '#FFFFFF' },
  levelChoiceCopy: { flex: 1, gap: 3 },
  levelChoiceTitle: { fontFamily: Typography.fontFamily, color: colors.ink, fontSize: 12, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  levelChoiceDescription: { fontFamily: Typography.fontFamily, color: colors.muted, fontSize: 9, lineHeight: 16, textAlign: 'right', writingDirection: 'rtl' },
  introHint: { fontFamily: Typography.fontFamily, color: colors.muted, fontSize: 9, lineHeight: 17, textAlign: 'right', writingDirection: 'rtl' },
  passageCard: { padding: 14, borderRadius: 15, backgroundColor: '#F8F7FC', borderWidth: 1, borderColor: '#EBE8F4', gap: 6 },
  passageLabel: { fontFamily: 'Inter-ExtraBold', color: colors.violet, fontSize: 6, letterSpacing: 1.1, fontWeight: '800', textAlign: 'left', writingDirection: 'ltr' },
  passageText: { fontFamily: 'Inter-ExtraBold', color: colors.ink, fontSize: 14, lineHeight: 25, fontWeight: '800', textAlign: 'left', writingDirection: 'ltr' },
  options: { gap: 8 },
  option: { minHeight: 52, flexDirection: 'row-reverse', alignItems: 'center', gap: 11, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: '#FFFFFF' },
  optionSelected: { backgroundColor: '#F3F0FE', borderColor: colors.violet },
  optionNumber: { width: 27, height: 27, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: '#F2F0F7' },
  optionNumberSelected: { backgroundColor: colors.violet },
  optionNumberText: { fontFamily: Typography.numberFontFamily, color: colors.muted, fontSize: 10, fontWeight: '800', writingDirection: 'rtl' },
  optionText: { flex: 1, fontFamily: Typography.fontFamily, color: colors.text, fontSize: 12, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  optionTextLtr: { fontFamily: 'Inter-ExtraBold', textAlign: 'left', writingDirection: 'ltr' },
  optionTextSelected: { color: colors.violet, fontWeight: '800' },
  unknownOption: { minHeight: 41, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 11, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: '#E8D7B5', backgroundColor: '#FFFCF6' },
  unknownOptionSelected: { borderStyle: 'solid', borderColor: '#C58B35', backgroundColor: colors.goldSoft },
  unknownText: { fontFamily: Typography.fontFamily, color: colors.gold, fontSize: 10, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  questionFooter: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', gap: 10, paddingTop: 3 },
  backButton: { minHeight: 43, flexDirection: 'row-reverse', alignItems: 'center', gap: 5, paddingHorizontal: 11, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  backButtonText: { fontFamily: Typography.fontFamily, color: colors.text, fontSize: 11, fontWeight: '400', writingDirection: 'rtl' },
  buttonDisabled: { opacity: .65 },
  disabledText: { color: '#B9B6C4' },
  nextButton: { minHeight: 44, flexDirection: 'row-reverse', alignItems: 'center', gap: 8, paddingHorizontal: 14, borderRadius: 13, backgroundColor: colors.violet, transform: [{ translateY: -30 }] },
  nextButtonDisabled: { backgroundColor: '#ECEAF1' },
  nextButtonText: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 11, fontWeight: '400', writingDirection: 'rtl' },
  nextButtonTextDisabled: { color: '#AAA7B8' },
  pressed: { opacity: .78, transform: [{ scale: .99 }] },
  resultCard: { padding: 21, borderRadius: 23, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, gap: 11 },
  resultIcon: { width: 43, height: 43, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: colors.greenSoft },
  resultEyebrow: { fontFamily: Typography.fontFamily, color: colors.green, fontSize: 10, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  resultTitle: { fontFamily: Typography.fontFamily, color: colors.ink, fontSize: 24, lineHeight: 34, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  resultSummary: { fontFamily: Typography.fontFamily, color: colors.text, fontSize: 12, textAlign: 'right', writingDirection: 'rtl' },
  bandResults: { marginTop: 5, padding: 14, borderRadius: 16, backgroundColor: '#F8F7FC', gap: 11 },
  bandHeading: { fontFamily: Typography.fontFamily, color: colors.ink, fontSize: 11, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  bandRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  bandName: { width: 105, fontFamily: Typography.fontFamily, color: colors.text, fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
  bandTrack: { flex: 1, height: 7, overflow: 'hidden', borderRadius: 999, backgroundColor: '#E9E6F0' },
  bandFill: { height: '100%', alignSelf: 'flex-end', borderRadius: 999 },
  bandScore: { width: 45, fontFamily: Typography.fontFamily, color: colors.muted, fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
  cautionBox: { padding: 12, borderRadius: 13, backgroundColor: colors.goldSoft, borderWidth: 1, borderColor: '#F0D7A8' },
  cautionText: { fontFamily: Typography.fontFamily, color: '#7B581E', fontSize: 10, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  methodNote: { padding: 12, borderRadius: 13, backgroundColor: '#F2F0FA' },
  methodNoteText: { fontFamily: Typography.fontFamily, color: colors.text, fontSize: 10, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  resultActions: { gap: 10, marginTop: 3 },
  primaryAction: { minHeight: 49, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingHorizontal: 14, borderRadius: 14, backgroundColor: colors.violet },
  primaryActionText: { flex: 1, fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 11, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  secondaryActions: { flexDirection: 'row-reverse', gap: 8 },
  secondaryAction: { minHeight: 42, flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  secondaryActionText: { fontFamily: Typography.fontFamily, color: colors.text, fontSize: 10, fontWeight: '400', writingDirection: 'rtl' },
  restartAction: { minHeight: 42, flex: 1, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 8, borderRadius: 12, borderWidth: 1, borderColor: '#DDD6F4', backgroundColor: colors.violetSoft },
  restartText: { fontFamily: Typography.fontFamily, color: colors.violet, fontSize: 10, fontWeight: '400', writingDirection: 'rtl' },
  privacyNote: { paddingHorizontal: 5, paddingVertical: 4 },
  privacyText: { fontFamily: Typography.fontFamily, color: colors.muted, fontSize: 9, lineHeight: 17, textAlign: 'right', writingDirection: 'rtl' },
});
