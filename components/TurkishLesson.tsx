import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { ArrowRight, BookOpenCheck, Check, ChevronLeft, Headphones, MessageCircle, RefreshCw, RotateCcw, Sparkles, Volume2 } from 'lucide-react-native';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { clearTurkishLessonSession, loadTurkishLessonSessionWithPresence, saveTurkishLessonSession, type TurkishLessonSession } from '@/lib/languages/turkishStudyState';
import { TURKISH_LESSONS, TURKISH_LEVELS, TURKISH_LESSON_STAGES, turkishProgress, type TurkishCourseLesson } from '@/lib/languages/turkish';
import { nextLessonInOrder, previousSentenceIndex } from '@/lib/englishLessonNavigation';
import { toPersianDigits as fa } from '@/lib/format';
import { playTurkishSpeech, stopTurkishSpeech } from '@/lib/turkishSpeech';
import { Typography } from '@/lib/theme';

const stages = TURKISH_LESSON_STAGES;
const NORMAL_RATE = 0.82;
const SLOW_RATE = 0.5;

function shuffledWords(text: string, salt: number): string[] {
  const words = text.replace(/[.!?]+$/, '').split(/\s+/).filter(Boolean);
  const keyed = words.map((word, index) => ({ word, rank: (index * 37 + salt * 53) % 101 }));
  return keyed.sort((a, b) => a.rank - b.rank).map(item => item.word);
}

export default function TurkishLesson({ lesson, fromStart = false }: { lesson: TurkishCourseLesson; fromStart?: boolean }) {
  const router = useRouter();
  const level = TURKISH_LEVELS.find(item => item.id === lesson.levelId) ?? TURKISH_LEVELS[0];
  const [stage, setStage] = useState(0);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showCheckAnswers, setShowCheckAnswers] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState('');
  const [completionError, setCompletionError] = useState('');
  const [speechError, setSpeechError] = useState('');
  const [loadingRetry, setLoadingRetry] = useState(0);
  const [building, setBuilding] = useState<string[]>([]);
  const [buildMessage, setBuildMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const completing = useRef(false);
  const startFirstLesson = useRef(fromStart);

  const current = lesson.sentences[sentenceIndex];
  const checks = lesson.checks ?? [];
  const allChecksPassed = checks.every((question, index) => answers[String(index)] === question.correctIndex);
  const progressPercent = Math.round(((stage + 1) / stages.length) * 100);
  const vocabulary = useMemo(() => {
    const seen = new Map<string, { word: string; meaning: string; sentenceId: string }>();
    lesson.sentences.forEach(sentence => sentence.vocabulary.forEach(word => {
      if (!seen.has(word.word)) seen.set(word.word, { word: word.word, meaning: word.meaning, sentenceId: sentence.id });
    }));
    return [...seen.values()];
  }, [lesson]);
  const patterns = useMemo(
    () => lesson.sentences.flatMap(sentence => sentence.pattern ? [{ id: sentence.id, sentence: sentence.text, pattern: sentence.pattern }] : []),
    [lesson],
  );
  const buildWords = useMemo(
    () => shuffledWords(current?.text ?? '', sentenceIndex + lesson.order),
    [current?.text, sentenceIndex, lesson.order],
  );

  useEffect(() => { void Speech.getAvailableVoicesAsync().catch(() => undefined); }, []);

  useEffect(() => {
    let alive = true;
    completing.current = false;
    setSessionReady(false);
    setSessionError('');
    setCompletionError('');
    void loadTurkishLessonSessionWithPresence(lesson.id).then(({ session: saved }) => {
      if (!alive) return;
      const replay = startFirstLesson.current && lesson.id === TURKISH_LESSONS[0].id;
      startFirstLesson.current = false;
      if (replay) router.setParams({ fromStart: undefined });
      setStage(replay ? 1 : Math.min(saved.stage, stages.length - 1));
      setSentenceIndex(replay ? 0 : Math.min(saved.sentenceIndex, lesson.sentences.length - 1));
      setRevealed(replay ? false : saved.revealed);
      setAnswers(saved.answers);
      setShowCheckAnswers(saved.showCheckAnswers);
      setSessionReady(true);
    }).catch(() => {
      if (alive) setSessionError('جلسهٔ قبلی خوانده نشد؛ برای حفظ اطلاعات، ذخیره متوقف است. دوباره تلاش کنید.');
    });
    return () => { alive = false; void stopTurkishSpeech(); };
  }, [lesson.id, lesson.sentences.length, loadingRetry, router]);

  useEffect(() => {
    if (!sessionReady || completing.current) return;
    const next: TurkishLessonSession = { stage, sentenceIndex, revealed, answers, showCheckAnswers };
    void saveTurkishLessonSession(lesson.id, next)
      .then(() => setSessionError(''))
      .catch(() => setSessionError('جلسه ذخیره نشد؛ پیشرفت این درس کامل ثبت نشده است.'));
  }, [lesson.id, sessionReady, stage, sentenceIndex, revealed, answers, showCheckAnswers]);

  const speak = useCallback((text: string, rate = NORMAL_RATE) => {
    setSpeechError('');
    void playTurkishSpeech(text, rate, () => setSpeechError('صدای ترکی دستگاه در دسترس نیست؛ متن و تلفظ همچنان دیده می‌شوند.'));
  }, []);

  useEffect(() => {
    if (!sessionReady || stage !== 1 || !current) return;
    speak(current.text, NORMAL_RATE);
  }, [sessionReady, stage, sentenceIndex, current?.text, speak]);

  useEffect(() => {
    setBuilding([]);
    setBuildMessage('');
  }, [stage, sentenceIndex]);

  const goNext = async () => {
    if (!sessionReady || sessionError || completing.current || saving) return;
    setCompletionError('');
    if (stage === 1 && sentenceIndex < lesson.sentences.length - 1) {
      setSentenceIndex(index => index + 1);
      setRevealed(false);
      return;
    }
    if (stage < stages.length - 1) {
      const nextStage = stage + 1;
      setStage(nextStage);
      setSentenceIndex(0);
      setRevealed(false);
      if (nextStage !== 1) void stopTurkishSpeech();
      return;
    }
    if (!allChecksPassed && !showCheckAnswers) return;
    void stopTurkishSpeech();
    completing.current = true;
    setSaving(true);
    try {
      const nextLesson = nextLessonInOrder(TURKISH_LESSONS, lesson.id);
      const progress = await turkishProgress.getCourseProgress();
      const currentIndex = TURKISH_LESSONS.findIndex(item => item.id === progress.currentLessonId);
      const nextIndex = nextLesson ? TURKISH_LESSONS.findIndex(item => item.id === nextLesson.id) : -1;
      const target = currentIndex > nextIndex ? progress.currentLessonId : nextLesson?.id;
      await turkishProgress.completeSentenceLesson(lesson.id, target);
      await clearTurkishLessonSession(lesson.id);
      if (nextLesson) router.replace(`/learn/tr/lesson?id=${encodeURIComponent(nextLesson.id)}` as never);
      else router.replace('/learn/tr' as never);
    } catch {
      completing.current = false;
      setCompletionError('پایان درس ذخیره نشد؛ دوباره تلاش کنید.');
    } finally {
      setSaving(false);
    }
  };

  const goBackStage = () => {
    if (stage === 0) { router.back(); return; }
    setStage(value => Math.max(0, value - 1));
    setSentenceIndex(0);
    setRevealed(false);
    void stopTurkishSpeech();
  };

  const nextLabel = stage === stages.length - 1
    ? (allChecksPassed || showCheckAnswers ? 'پایان درس' : 'پاسخ همهٔ پرسش‌ها را بده')
    : stage === 1 && sentenceIndex < lesson.sentences.length - 1 ? 'جملهٔ بعدی' : 'مرحلهٔ بعد';

  if (!sessionReady) {
    return (
      <View style={styles.root}>
        <View style={styles.loadingCard}>
          <ActivityIndicator color={Palette.primary} />
          <Text accessibilityRole={sessionError ? 'alert' : undefined} style={styles.loadingText}>{sessionError || 'در حال بازیابی جلسهٔ ترکی…'}</Text>
          {!!sessionError && <Pressable accessibilityRole="button" style={styles.loadingButton} onPress={() => setLoadingRetry(value => value + 1)}><Text style={styles.loadingButtonText}>تلاش دوباره</Text></Pressable>}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#D2432F', '#8C1B1F']} start={{ x: 0.95, y: 0 }} end={{ x: 0.05, y: 1 }} style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable accessibilityRole="button" accessibilityLabel="بازگشت" style={styles.headerBack} onPress={goBackStage}><ArrowRight size={19} color="#FFFFFF" /></Pressable>
          <View style={styles.headerText}>
            <Text style={styles.headerEyebrow}>LEVEL {fa(level.id + 1)} · TÜRKÇE</Text>
            <Text style={styles.headerTitle}>{lesson.title}</Text>
            <Text style={styles.headerSub}>{stages[stage].labelFa} · مرحلهٔ {fa(stage + 1)} از {fa(stages.length)}</Text>
          </View>
          <View style={styles.percentBadge}><Text style={styles.percent}>{fa(progressPercent)}٪</Text><Text style={styles.percentLabel}>پیشرفت</Text></View>
        </View>
        <View style={styles.headerBottom}>
          <View style={styles.headerChip}><BookOpenCheck size={13} color="#FFE7CF" /><Text style={styles.headerChipText}>مسیر جمله‌محور</Text></View>
          <Text style={styles.headerInfoText}>{fa(lesson.sentences.length)} جملهٔ اصلی</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!!sessionError && <Text accessibilityRole="alert" style={styles.alert}>{sessionError}</Text>}
        {!!completionError && <Text accessibilityRole="alert" style={styles.alert}>{completionError}</Text>}
        {!!speechError && <Text accessibilityRole="alert" style={styles.alertSoft}>{speechError}</Text>}

        {stage === 0 && (
          <View style={styles.card}>
            <Text style={styles.eyebrow}>SITUATION · موقعیت</Text>
            <Text style={styles.cardTitle}>{lesson.title}</Text>
            <Text style={styles.body}>{lesson.situation}</Text>
            <View style={styles.tipRow}><Sparkles size={14} color={Palette.warning} /><Text style={styles.tipText}>در این درس {fa(lesson.sentences.length)} جملهٔ کلیدی و یک گفت‌وگوی کوتاه تمرین می‌کنید.</Text></View>
            {!!lesson.teachingFa && <Text style={styles.note}>{lesson.teachingFa}</Text>}
          </View>
        )}

        {stage === 1 && current && (
          <View style={styles.sentenceStage}>
            <Text style={styles.counter}>جملهٔ {fa(sentenceIndex + 1)} از {fa(lesson.sentences.length)}</Text>
            <View style={styles.sentenceCard}>
              <Pressable accessibilityRole="button" accessibilityLabel="پخش جمله با صدای ترکی" style={styles.soundButton} onPress={() => speak(current.text, NORMAL_RATE)}>
                <Volume2 size={22} color="#FFFFFF" />
              </Pressable>
              <Text style={styles.turkishSentence}>{current.text}</Text>
              {revealed ? (
                <>
                  <View style={styles.divider} />
                  <Text style={styles.persian}>{current.fa}</Text>
                  <Text style={styles.pronunciation}>{current.pronunciation}</Text>
                  {!!current.pattern && <View style={styles.pattern}><Text style={styles.patternLabel}>الگو</Text><Text style={styles.patternText}>{current.pattern}</Text></View>}
                </>
              ) : (
                <Pressable accessibilityRole="button" style={styles.revealButton} onPress={() => setRevealed(true)}>
                  <Text style={styles.revealButtonText}>نمایش معنی</Text>
                </Pressable>
              )}
            </View>
            <View style={styles.stageActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: sentenceIndex === 0 }}
                disabled={sentenceIndex === 0}
                style={[styles.secondaryButton, sentenceIndex === 0 && styles.disabled]}
                onPress={() => { setSentenceIndex(previousSentenceIndex(sentenceIndex)); setRevealed(false); }}
              >
                <ChevronLeft size={15} color={Palette.primary} style={{ transform: [{ rotate: '180deg' }] }} />
                <Text style={styles.secondaryButtonText}>قبلی</Text>
              </Pressable>
              <Pressable accessibilityRole="button" style={styles.slowButton} onPress={() => speak(current.text, SLOW_RATE)}>
                <Headphones size={15} color={Palette.primaryDark} />
                <Text style={styles.slowButtonText}>آهسته</Text>
              </Pressable>
            </View>
          </View>
        )}

        {stage === 2 && (
          <View style={styles.card}>
            <Text style={styles.eyebrow}>LISTENING · شنیدن</Text>
            <Text style={styles.cardTitle}>گوش کن و تکرار کن</Text>
            <Text style={styles.body}>هر جمله را یک بار گوش کن، سپس با صدای بلند تکرار کن. برای درک بهتر، معنی فارسی را هم ببین.</Text>
            <View style={styles.listenList}>
              {lesson.sentences.map((sentence, index) => (
                <Pressable key={sentence.id} accessibilityRole="button" style={[styles.listenRow, index === sentenceIndex && styles.listenRowActive]} onPress={() => { setSentenceIndex(index); speak(sentence.text, NORMAL_RATE); }}>
                  <View style={styles.listenNumber}><Text style={styles.listenNumberText}>{fa(index + 1)}</Text></View>
                  <View style={styles.listenCopy}>
                    <Text style={styles.listenTurkish}>{sentence.text}</Text>
                    <Text style={styles.listenPersian}>{sentence.fa}</Text>
                  </View>
                  <Volume2 size={16} color={index === sentenceIndex ? Palette.primary : Palette.muted} />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {stage === 3 && current && (
          <View style={styles.card}>
            <Text style={styles.eyebrow}>BUILD THE SENTENCE · ساخت جمله</Text>
            <Text style={styles.cardTitle}>واژه‌ها را درست بچین</Text>
            <Text style={styles.body}>معنی جمله: «{current.fa}»</Text>
            <View style={styles.buildArea}>
              <Text style={[styles.buildPreview, building.length === 0 && styles.buildPlaceholder]}>
                {building.length ? building.join(' ') : 'واژه‌ها را یکی‌یکی انتخاب کن…'}
              </Text>
            </View>
            <View style={styles.wordBank}>
              {buildWords.map((word, index) => {
                const used = building.filter(item => item === word).length;
                const total = buildWords.filter(item => item === word).length;
                const disabled = used >= total;
                return (
                  <Pressable
                    key={`${word}-${index}`}
                    accessibilityRole="button"
                    disabled={disabled}
                    style={[styles.wordChip, disabled && styles.wordChipUsed]}
                    onPress={() => { setBuilding(list => [...list, word]); setBuildMessage(''); }}
                  >
                    <Text style={styles.wordChipText}>{word}</Text>
                  </Pressable>
                );
              })}
            </View>
            {!!buildMessage && <Text accessibilityRole="alert" style={styles.buildMessage}>{buildMessage}</Text>}
            <View style={styles.stageActions}>
              <Pressable accessibilityRole="button" style={styles.secondaryButton} onPress={() => { setBuilding([]); setBuildMessage(''); }}>
                <RotateCcw size={14} color={Palette.primary} />
                <Text style={styles.secondaryButtonText}>از نو</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                style={styles.checkButton}
                onPress={() => {
                  const expected = current.text.replace(/[.!?]+$/, '').trim();
                  if (building.join(' ').trim() === expected) {
                    setBuildMessage('درست است! آفرین.');
                    speak(current.text, NORMAL_RATE);
                  } else {
                    setBuildMessage('هنوز درست نیست؛ دوباره امتحان کن یا معنی را ببین.');
                  }
                }}
              >
                <Check size={15} color="#FFFFFF" />
                <Text style={styles.checkButtonText}>بررسی</Text>
              </Pressable>
            </View>
            <Pressable accessibilityRole="button" style={styles.showAnswerRow} onPress={() => { setBuilding(current.text.replace(/[.!?]+$/, '').trim().split(/\s+/)); setBuildMessage('پاسخ درست: جملهٔ بالا.'); }}>
              <Text style={styles.showAnswerText}>نمایش پاسخ درست</Text>
            </Pressable>
          </View>
        )}

        {stage === 4 && (
          <View style={styles.card}>
            <Text style={styles.eyebrow}>VOCABULARY · واژگان</Text>
            <Text style={styles.cardTitle}>واژه‌ها در دل جمله</Text>
            <Text style={styles.body}>واژه را جدا از جمله حفظ نکن؛ جملهٔ نمونه را با آن تکرار کن.</Text>
            <View style={styles.vocabList}>
              {vocabulary.map(item => {
                const source = lesson.sentences.find(sentence => sentence.id === item.sentenceId)!;
                return (
                  <View key={item.word} style={styles.vocabCard}>
                    <View style={styles.vocabTop}>
                      <Text style={styles.vocabWord}>{item.word}</Text>
                      <Text style={styles.vocabMeaning}>{item.meaning}</Text>
                      <Pressable accessibilityRole="button" accessibilityLabel={`پخش ${item.word}`} style={styles.vocabSound} onPress={() => speak(source.text, NORMAL_RATE)}><Volume2 size={15} color={Palette.primary} /></Pressable>
                    </View>
                    <Text style={styles.vocabExample}>{source.text}</Text>
                    <Text style={styles.vocabExampleFa}>{source.fa}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {stage === 5 && (
          <View style={styles.card}>
            <Text style={styles.eyebrow}>GRAMMAR IN USE · دستور در کاربرد</Text>
            <Text style={styles.cardTitle}>الگو را ببین، قاعده را حدس بزن</Text>
            {!!lesson.teachingFa && <Text style={styles.note}>{lesson.teachingFa}</Text>}
            {patterns.length > 0 ? (
              <View style={styles.patternList}>
                {patterns.map(item => (
                  <Pressable key={item.id} accessibilityRole="button" style={styles.patternCard} onPress={() => speak(item.sentence, NORMAL_RATE)}>
                    <Text style={styles.patternSentence}>{item.sentence}</Text>
                    <Text style={styles.patternHint}>{item.pattern}</Text>
                  </Pressable>
                ))}
              </View>
            ) : (
              <Text style={styles.body}>در این درس الگوی ویژه‌ای جدا نشده است؛ جمله‌های اصلی خودشان الگو را نشان می‌دهند.</Text>
            )}
          </View>
        )}

        {stage === 6 && (
          <View style={styles.card}>
            <Text style={styles.eyebrow}>CONVERSATION · مکالمه</Text>
            <Text style={styles.cardTitle}>گفت‌وگو را دنبال کن</Text>
            <Text style={styles.body}>هر خط را گوش کن و با همان لحن تکرار کن. Speaker را فراموش نکن؛ ترکی در موقعیت معنا پیدا می‌کند.</Text>
            <View style={styles.dialogueList}>
              {lesson.dialogue.map((line, index) => (
                <View key={`${line.speaker}-${index}`} style={[styles.bubble, index % 2 === 0 ? styles.bubbleRight : styles.bubbleLeft]}>
                  <Text style={styles.bubbleSpeaker}>{line.speaker}</Text>
                  <Text style={styles.bubbleText}>{line.text}</Text>
                  <Text style={styles.bubbleFa}>{line.fa}</Text>
                  <Pressable accessibilityRole="button" accessibilityLabel="پخش این خط" style={styles.bubbleSound} onPress={() => speak(line.text, NORMAL_RATE)}><Volume2 size={14} color={Palette.primary} /></Pressable>
                </View>
              ))}
            </View>
            <View style={styles.tipRow}><MessageCircle size={14} color={Palette.teal} /><Text style={styles.tipText}>یک بار نقش یک طرف را بازی کن و جمله‌های او را از حافظه بگو.</Text></View>
          </View>
        )}

        {stage === 7 && (
          <View style={styles.card}>
            <Text style={styles.eyebrow}>REVIEW · مرور</Text>
            <Text style={styles.cardTitle}>خودارزیابی این درس</Text>
            <Text style={styles.body}>بدون نگاه‌کردن به جمله‌ها پاسخ بده. این پرسش‌ها سنجش رسمی نیستند.</Text>
            <View style={styles.questionList}>
              {checks.map((question, index) => {
                const selected = answers[String(index)];
                const answered = selected !== undefined;
                return (
                  <View key={`${lesson.id}-q-${index}`} style={styles.question}>
                    <Text style={styles.questionPrompt}>{fa(index + 1)}. {question.promptFa}</Text>
                    {question.choices.map((choice, choiceIndex) => {
                      const isSelected = selected === choiceIndex;
                      const isCorrect = answered && showCheckAnswers && choiceIndex === question.correctIndex;
                      return (
                        <Pressable
                          key={`${index}-${choiceIndex}`}
                          accessibilityRole="button"
                          style={[styles.choice, isSelected && styles.choiceSelected, isCorrect && styles.choiceCorrect]}
                          onPress={() => setAnswers(prev => ({ ...prev, [String(index)]: choiceIndex }))}
                        >
                          <Text style={styles.choiceText}>{choice}</Text>
                        </Pressable>
                      );
                    })}
                    {answered && (selected === question.correctIndex || showCheckAnswers) && (
                      <View style={styles.feedback}>
                        <Text style={selected === question.correctIndex ? styles.feedbackOk : styles.feedbackBad}>
                          {selected === question.correctIndex ? 'درست است' : 'پاسخ درست را ببین'}
                        </Text>
                        <Text style={styles.feedbackText}>{question.explanationFa}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
            {!showCheckAnswers && (
              <Pressable accessibilityRole="button" style={styles.showAnswerRow} onPress={() => setShowCheckAnswers(true)}>
                <Text style={styles.showAnswerText}>پاسخ درست را نشان بده</Text>
              </Pressable>
            )}
            <View style={styles.tipRow}><RefreshCw size={14} color={Palette.primary} /><Text style={styles.tipText}>جمله‌های این درس به‌طور خودکار وارد مرور فاصله‌دار می‌شوند.</Text></View>
          </View>
        )}

        <View style={styles.progressStages}>
          {stages.map((item, index) => (
            <View key={item.id} style={[styles.stageDot, index < stage && styles.stageDotDone, index === stage && styles.stageDotActive]} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable accessibilityRole="button" style={styles.footerBack} onPress={goBackStage}>
          <Text style={styles.footerBackText}>{stage === 0 ? 'بازگشت' : 'مرحلهٔ قبل'}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={saving || (stage === stages.length - 1 && !allChecksPassed && !showCheckAnswers)}
          style={({ pressed }) => [styles.footerNext, (saving || (stage === stages.length - 1 && !allChecksPassed && !showCheckAnswers)) && styles.disabled, pressed && styles.pressed]}
          onPress={() => void goNext()}
        >
          <Text style={styles.footerNextText}>{saving ? 'در حال ذخیره…' : nextLabel}</Text>
          <ChevronLeft size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.canvas },
  loadingCard: { margin: 20, padding: 20, backgroundColor: Palette.surface, borderRadius: 20, borderWidth: 1, borderColor: Palette.border, gap: 12, alignItems: 'center' },
  loadingText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 12, textAlign: 'center' },
  loadingButton: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 999, backgroundColor: Palette.primarySoft },
  loadingButtonText: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 12 },
  header: { paddingTop: 46, paddingHorizontal: 16, paddingBottom: 14, gap: 12, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 11 },
  headerBack: { width: 38, height: 38, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1, gap: 2 },
  headerEyebrow: { fontFamily: 'Inter-ExtraBold', color: '#FFE0C7', fontSize: 8, letterSpacing: 1.3, writingDirection: 'ltr', textAlign: 'right' },
  headerTitle: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 18, lineHeight: 28, textAlign: 'right', writingDirection: 'rtl' },
  headerSub: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.82)', fontSize: 10, textAlign: 'right' },
  percentBadge: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  percent: { fontFamily: Typography.numberFontFamily, color: '#FFFFFF', fontSize: 13 },
  percentLabel: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.78)', fontSize: 8 },
  headerBottom: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  headerChip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  headerChipText: { fontFamily: Typography.fontFamily, color: '#FFE7CF', fontSize: 9 },
  headerInfoText: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.82)', fontSize: 9 },
  content: { padding: 15, paddingBottom: 28, gap: 12 },
  alert: { fontFamily: Typography.fontFamily, color: '#9B263C', backgroundColor: '#FFF5F6', borderWidth: 1, borderColor: '#F2D1D8', borderRadius: 12, padding: 11, fontSize: 11, lineHeight: 19, textAlign: 'right' },
  alertSoft: { fontFamily: Typography.fontFamily, color: Palette.warning, backgroundColor: Palette.warningSoft, borderRadius: 12, padding: 10, fontSize: 10, lineHeight: 18, textAlign: 'right' },
  card: { backgroundColor: Palette.surface, borderRadius: 22, borderWidth: 1, borderColor: Palette.border, padding: 17, gap: 11, shadowColor: '#20264A', shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  eyebrow: { fontFamily: 'Inter-ExtraBold', color: Palette.primary, fontSize: 8, letterSpacing: 1.4, writingDirection: 'ltr', textAlign: 'right' },
  cardTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 20, lineHeight: 31, textAlign: 'right', writingDirection: 'rtl' },
  body: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 12, lineHeight: 22, textAlign: 'right', writingDirection: 'rtl' },
  note: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, backgroundColor: Palette.primarySoft, borderRadius: 12, padding: 12, fontSize: 11, lineHeight: 21, textAlign: 'right', writingDirection: 'rtl' },
  tipRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7, backgroundColor: Palette.warningSoft, borderRadius: 12, padding: 10 },
  tipText: { flex: 1, fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  sentenceStage: { gap: 12 },
  counter: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, textAlign: 'right' },
  sentenceCard: { backgroundColor: Palette.surface, borderRadius: 24, borderWidth: 1, borderColor: Palette.border, padding: 22, alignItems: 'center', gap: 10, shadowColor: '#20264A', shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  soundButton: { width: 54, height: 54, borderRadius: 27, backgroundColor: Palette.primary, alignItems: 'center', justifyContent: 'center' },
  turkishSentence: { width: '100%', fontFamily: 'Inter-ExtraBold', fontSize: 22, lineHeight: 34, fontWeight: '800', color: Palette.ink, textAlign: 'right', writingDirection: 'ltr' },
  divider: { width: '70%', height: 1, backgroundColor: Palette.border, marginVertical: 4 },
  persian: { alignSelf: 'stretch', fontFamily: Typography.fontFamily, fontSize: 16, color: Palette.text, textAlign: 'right', writingDirection: 'rtl' },
  pronunciation: { alignSelf: 'stretch', fontFamily: Typography.fontFamily, fontSize: 11, color: Palette.primaryDark, textAlign: 'right', writingDirection: 'rtl' },
  pattern: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7, alignSelf: 'flex-end', backgroundColor: Palette.warningSoft, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  patternLabel: { fontFamily: Typography.fontFamily, fontSize: 9, color: Palette.warning },
  patternText: { fontFamily: 'Inter-ExtraBold', fontSize: 10, color: Palette.warning, textAlign: 'right', writingDirection: 'ltr' },
  revealButton: { marginTop: 6, minHeight: 44, paddingHorizontal: 20, borderRadius: 999, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  revealButtonText: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 12 },
  stageActions: { flexDirection: 'row-reverse', gap: 9 },
  secondaryButton: { flex: 1, minHeight: 46, borderRadius: 14, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surface, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 6 },
  secondaryButtonText: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 11 },
  slowButton: { flex: 1, minHeight: 46, borderRadius: 14, backgroundColor: Palette.primarySoft, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 6 },
  slowButtonText: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 11 },
  listenList: { gap: 8 },
  listenRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, minHeight: 60, borderRadius: 16, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border, paddingHorizontal: 12, paddingVertical: 9 },
  listenRowActive: { borderColor: Palette.primary, backgroundColor: Palette.primarySoft },
  listenNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: Palette.surface, alignItems: 'center', justifyContent: 'center' },
  listenNumberText: { fontFamily: Typography.numberFontFamily, color: Palette.primaryDark, fontSize: 10 },
  listenCopy: { flex: 1, gap: 2 },
  listenTurkish: { fontFamily: 'Inter-ExtraBold', color: Palette.ink, fontSize: 13, lineHeight: 21, textAlign: 'right', writingDirection: 'ltr' },
  listenPersian: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  buildArea: { minHeight: 56, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', borderColor: Palette.primary, backgroundColor: Palette.primarySoft, padding: 12, justifyContent: 'center' },
  buildPreview: { fontFamily: 'Inter-ExtraBold', color: Palette.ink, fontSize: 15, lineHeight: 24, textAlign: 'right', writingDirection: 'ltr' },
  buildPlaceholder: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 11, textAlign: 'right', writingDirection: 'rtl' },
  wordBank: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  wordChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  wordChipUsed: { opacity: 0.28 },
  wordChipText: { fontFamily: 'Inter-ExtraBold', color: Palette.ink, fontSize: 12, writingDirection: 'ltr' },
  buildMessage: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 11, textAlign: 'right' },
  checkButton: { flex: 1, minHeight: 46, borderRadius: 14, backgroundColor: Palette.primary, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 6 },
  checkButtonText: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 12 },
  showAnswerRow: { alignSelf: 'flex-start', paddingVertical: 5 },
  showAnswerText: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 11 },
  vocabList: { gap: 9 },
  vocabCard: { borderRadius: 16, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border, padding: 12, gap: 5 },
  vocabTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 9 },
  vocabWord: { fontFamily: 'Inter-ExtraBold', color: Palette.ink, fontSize: 15, writingDirection: 'ltr' },
  vocabMeaning: { flex: 1, fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 11, textAlign: 'right', writingDirection: 'rtl' },
  vocabSound: { padding: 5 },
  vocabExample: { fontFamily: 'Inter-ExtraBold', color: Palette.text, fontSize: 12, lineHeight: 20, textAlign: 'right', writingDirection: 'ltr' },
  vocabExampleFa: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  patternList: { gap: 8 },
  patternCard: { borderRadius: 14, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border, padding: 12, gap: 4 },
  patternSentence: { fontFamily: 'Inter-ExtraBold', color: Palette.ink, fontSize: 13, lineHeight: 21, textAlign: 'right', writingDirection: 'ltr' },
  patternHint: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 10, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  dialogueList: { gap: 9 },
  bubble: { maxWidth: '94%', borderRadius: 16, padding: 12, gap: 3, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border },
  bubbleRight: { alignSelf: 'flex-end' },
  bubbleLeft: { alignSelf: 'flex-start' },
  bubbleSpeaker: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 9 },
  bubbleText: { fontFamily: 'Inter-ExtraBold', color: Palette.ink, fontSize: 13, lineHeight: 21, textAlign: 'right', writingDirection: 'ltr' },
  bubbleFa: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  bubbleSound: { alignSelf: 'flex-end', padding: 4 },
  questionList: { gap: 12 },
  question: { gap: 8 },
  questionPrompt: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 12, lineHeight: 21, textAlign: 'right', writingDirection: 'rtl' },
  choice: { minHeight: 46, borderRadius: 12, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, paddingHorizontal: 12, paddingVertical: 10, justifyContent: 'center' },
  choiceSelected: { borderColor: Palette.primary, backgroundColor: Palette.primarySoft },
  choiceCorrect: { borderColor: Palette.success, backgroundColor: Palette.successSoft },
  choiceText: { fontFamily: 'Inter-ExtraBold', color: Palette.ink, fontSize: 12, lineHeight: 20, textAlign: 'right', writingDirection: 'ltr' },
  feedback: { borderRadius: 12, padding: 11, backgroundColor: Palette.surfaceMuted, gap: 4 },
  feedbackOk: { fontFamily: Typography.fontFamily, color: Palette.success, fontSize: 11, fontWeight: '400', textAlign: 'right' },
  feedbackBad: { fontFamily: Typography.fontFamily, color: Palette.danger, fontSize: 11, fontWeight: '400', textAlign: 'right' },
  feedbackText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  progressStages: { flexDirection: 'row-reverse', gap: 6, justifyContent: 'center', marginTop: 2 },
  stageDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Palette.border },
  stageDotDone: { backgroundColor: Palette.primarySoft },
  stageDotActive: { width: 22, backgroundColor: Palette.primary },
  footer: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingHorizontal: 15, paddingTop: 10, paddingBottom: 22, backgroundColor: Palette.surface, borderTopWidth: 1, borderTopColor: Palette.border },
  footerBack: { minHeight: 50, paddingHorizontal: 16, borderRadius: 15, borderWidth: 1, borderColor: Palette.border, alignItems: 'center', justifyContent: 'center' },
  footerBackText: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 11 },
  footerNext: { flex: 1, minHeight: 50, borderRadius: 15, backgroundColor: Palette.primary, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 7 },
  footerNextText: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 13 },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.88 },
});
