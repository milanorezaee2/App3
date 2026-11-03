import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { BookOpenCheck, Check, ChevronLeft, Headphones, MessageCircle, Mic2, RefreshCw, RotateCcw, Sparkles, Square, Volume2 } from 'lucide-react-native';
import { COURSE_LEVELS, getSentenceLesson, SENTENCE_LESSONS } from '@/lib/courseContent';
import { completeSentenceLesson } from '@/lib/courseProgress';
import { evaluateSpokenSentence, type SpeechEvaluation } from '@/lib/speechPractice';
import { Colors, Radius, Spacing, Typography } from '@/lib/theme';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { toPersianDigits } from '@/lib/format';

import { EnglishLessonEvidence } from '@/components/EnglishLessonEvidence';
import { EnglishSentenceBuilder } from '@/components/EnglishSentenceBuilder';
import { EnglishDialoguePractice } from '@/components/EnglishDialoguePractice';
import { EnglishB2TopicPractice } from '@/components/EnglishB2TopicPractice';
import { EnglishB2Scenario } from '@/components/EnglishB2Scenario';
import { EnglishC1Reading } from '@/components/EnglishC1Reading';
import { EnglishC1ExtendedModel } from '@/components/EnglishC1ExtendedModel';
import { ENGLISH_ENGINE_STEPS, getLessonPatterns, getLessonVocabulary } from '@/lib/englishLearningEngine';
import { ENGLISH_LEVEL_GRADIENTS } from '@/components/EnglishUI';
import { PageNavigation } from '@/components/PageNavigation';

import { loadStudy, saveLessonSession, freshSession } from '@/lib/englishStudyState';
import { loadSupplement } from '@/lib/englishSupplement/progress';
import { CORE_LESSON_EVIDENCE, isCoreLessonEvidenceComplete } from '@/lib/englishFoundationEvidence';
import { useEnglishStudyTimer } from '@/components/useEnglishStudyTimer';
import { PAID_AI_ENABLED, PAID_AI_DISABLED_MESSAGE } from '@/lib/paidAI';
import { playResponsiveSpeech, stopResponsiveSpeech, warmSpeech } from '@/lib/responsiveSpeech';
import { nextLessonInOrder, previousSentenceIndex } from '@/lib/englishLessonNavigation';
import { B1_INDEPENDENT_UNITS } from '@/lib/courseContentB1Independent';
import { B2_UPPER_INTERMEDIATE_UNITS } from '@/lib/courseContentB2UpperIntermediate';
import { C1_ADVANCED_UNITS } from '@/lib/courseContentC1Advanced';
import { C1_TOPIC_PRACTICE, C1_SCENARIOS, C1_APPLICATION_PRACTICE } from '@/lib/englishC1Practice';
import { C1_ADDITIONAL_APPLICATION } from '@/lib/englishC1AppliedAssessment';
import { B2_GUIDANCE, B2_PRODUCTION, B2_PRODUCTION_CHECKLIST } from '@/lib/englishB2Practice';
import { A2_FOUNDATION_LESSONS } from '@/lib/courseContentA2Foundation';

const stages = ENGLISH_ENGINE_STEPS;

export default function SentenceLessonScreen() {
  const router = useRouter();
  const { id, fromStart } = useLocalSearchParams<{ id: string; fromStart?: string }>();
  const lesson = getSentenceLesson(id || '') ?? SENTENCE_LESSONS[0];
  const courseLevel = COURSE_LEVELS.find(item => item.id === lesson.levelId) ?? COURSE_LEVELS[0];
  const [evidencePassed, setEvidencePassed] = useState(false);
  const [completionError, setCompletionError] = useState('');
  const [saving, setSaving] = useState(false);
  const [stage, setStage] = useState(0);
  const progressPercent = Math.round(((stage + 1) / stages.length) * 100);

  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionReady,setSessionReady]=useState(false);
  const [invalidLesson,setInvalidLesson]=useState(false);
  const [sessionError,setSessionError]=useState('');
  const completing=useRef(false);
  const loadedLesson=useRef<string|null>(null);
  const startFirstLesson = useRef(fromStart === '1');
  const preserveExistingSession = useRef(false);
  const [audioNotice, setAudioNotice] = useState('');
  const timer=useEnglishStudyTimer(sessionReady && !!getSentenceLesson(id || ''));
  useEffect(() => {
    let alive = true;
    loadedLesson.current = null;
    preserveExistingSession.current = false;
    setAudioNotice('');
    setSessionError('');
    setSessionReady(false);
    setInvalidLesson(!!id && !getSentenceLesson(id));
    if (id && !getSentenceLesson(id)) return;

    void loadStudy().then(async state => {
      if (!alive) return;
      const saved = state.sessions[lesson.id] ?? freshSession();
      const startAtFirstSentence = startFirstLesson.current && lesson.id === SENTENCE_LESSONS[0].id;
      // Replay without overwriting a saved position or any completed evidence.
      preserveExistingSession.current = startAtFirstSentence && !!state.sessions[lesson.id];
      startFirstLesson.current = false;
      if (startAtFirstSentence) router.setParams({ fromStart: undefined });
      setStage(startAtFirstSentence ? 1 : saved.stage);
      setSentenceIndex(startAtFirstSentence ? 0 : Math.min(saved.sentenceIndex, lesson.sentences.length - 1));
      setRevealed(startAtFirstSentence ? false : saved.revealed);

      if (CORE_LESSON_EVIDENCE[lesson.id]) {
        setEvidencePassed(isCoreLessonEvidenceComplete(lesson.id, state.lessonEvidence[lesson.id] ?? {}));
      } else {
        const proof = await loadSupplement();
        if (!alive) return;
        setEvidencePassed(saved.evidencePassed
          && !!proof.evidence[`legacy-${lesson.id}-listening`]?.correct
          && !!proof.evidence[`legacy-${lesson.id}-listening`]?.heard
          && !!proof.evidence[`legacy-${lesson.id}-writing`]?.correct);
      }

      loadedLesson.current = lesson.id;
      setSessionReady(true);
    }).catch(() => {
      if (alive) setSessionError('جلسه قبلی خوانده نشد؛ برای حفظ اطلاعات، ذخیره متوقف است. صفحه را دوباره باز کنید.');
    });
    return () => { alive = false; void stopResponsiveSpeech(); };
  }, [lesson.id, lesson.levelId, lesson.sentences.length, id]);
  useEffect(() => {
    let currentSave = true;
    if (sessionReady && loadedLesson.current === lesson.id && !completing.current && !preserveExistingSession.current) {
      void saveLessonSession(lesson.id, { stage, sentenceIndex, revealed, evidencePassed })
        .then(() => { if (currentSave) setSessionError(''); })
        .catch(() => { if (currentSave) setSessionError('جلسه ذخیره نشد؛ دوباره یکی از کنترل‌های درس را بزنید تا ذخیره تکرار شود.'); });
    }
    return () => { currentSave = false; };
  }, [lesson.id, sessionReady, stage, sentenceIndex, revealed, evidencePassed]);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 250);
  const [evaluatingSpeech, setEvaluatingSpeech] = useState(false);
  const [speechResult, setSpeechResult] = useState<SpeechEvaluation | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const current = lesson.sentences[sentenceIndex];
  const vocabulary = getLessonVocabulary(lesson);
  const grammarPatterns = getLessonPatterns(lesson);
  const lessonTopics = B1_INDEPENDENT_UNITS.find(unit => unit.id === lesson.id)?.topics
    ?? B2_UPPER_INTERMEDIATE_UNITS.find(unit => unit.id === lesson.id)?.topics
    ?? C1_ADVANCED_UNITS.find(unit => unit.id === lesson.id)?.topics.map(topic => topic[0]);
  const c1Unit = C1_ADVANCED_UNITS.find(unit => unit.id === lesson.id);

  useEffect(() => warmSpeech('en-US'), []);

  useFocusEffect(useCallback(() => () => { void stopResponsiveSpeech(); }, []));

  // Read the sentence currently visible, without advancing the lesson automatically.
  useEffect(() => {
    if (!sessionReady || loadedLesson.current !== lesson.id || !current) return;
    if (stage !== 1 && stage !== 3) {
      if (stage !== 7) void stopResponsiveSpeech();
      return;
    }
    setAudioNotice('');
    playResponsiveSpeech({
      text: current.en, locale: 'en-US', rate: 0.85,
      onError: () => setAudioNotice('پخش خودکار ممکن نشد. برای شروع صدا، دکمهٔ بلندگو را بزنید و صدای دستگاه را بررسی کنید.'),
    });
  }, [lesson.id, sessionReady, stage, sentenceIndex, current?.en]);

  const speak = (text: string, rate?: number) => {
    playResponsiveSpeech({ text, locale: 'en-US', rate, onError: () => setAudioNotice('پخش صدا ممکن نشد. صدای دستگاه و اجازهٔ پخش مرورگر را بررسی کنید.') });
  };

  const startSpeechPractice = async () => {
    if (!PAID_AI_ENABLED) { setSpeechError(PAID_AI_DISABLED_MESSAGE); return; }
    try {
      setSpeechError(null);
      setSpeechResult(null);
      await stopResponsiveSpeech();
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) {
        setSpeechError('برای تمرین گفتاری، اجازه استفاده از میکروفن را فعال کنید.');
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch {
      setSpeechError('ضبط صدا شروع نشد. دوباره تلاش کنید.');
    }
  };

  const stopAndEvaluateSpeech = async () => {
    if (!PAID_AI_ENABLED) { setSpeechError(PAID_AI_DISABLED_MESSAGE); return; }
    if (!recorderState.isRecording || evaluatingSpeech) return;
    try {
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      if (!recorder.uri) throw new Error('Recording URI is missing');
      setEvaluatingSpeech(true);
      setSpeechError(null);
      setSpeechResult(await evaluateSpokenSentence(recorder.uri, current.en));
    } catch (cause) {
      setSpeechError(cause instanceof Error && cause.message !== 'Recording URI is missing' ? cause.message : 'صدای شما بررسی نشد. دوباره تلاش کنید.');
    } finally {
      setEvaluatingSpeech(false);
    }
  };

  const selectListeningSentence = (index: number) => {
    if (recorderState.isRecording || evaluatingSpeech) return;
    setSentenceIndex(index);
    setSpeechResult(null);
    setSpeechError(null);
    if (stage === 2 || index === sentenceIndex) speak(lesson.sentences[index].en);
  };

  const next = async () => {
    if (!sessionReady || sessionError || completing.current) return;
    if (stage === 1 && sentenceIndex < lesson.sentences.length - 1) {
      setSentenceIndex((value) => value + 1);
      setRevealed(false);
      return;
    }
    if (stage < stages.length - 1) {
      setStage((value) => value + 1);
      setSentenceIndex(0);
      setRevealed(false);
      return;
    }
    if (!evidencePassed || saving) return;
    completing.current=true;
    setSaving(true);
    setCompletionError('');
    try {
    const nextLesson = nextLessonInOrder(SENTENCE_LESSONS, lesson.id);
    // Persist both the completed path and its final session before navigating.
    await completeSentenceLesson(lesson.id, nextLesson?.id);
    await saveLessonSession(lesson.id, { stage, sentenceIndex, revealed, evidencePassed });
    void stopResponsiveSpeech();
    if (nextLesson) router.replace({ pathname: '/course/lesson', params: { id: nextLesson.id } } as never);
    else router.replace('/lang' as never);
    } catch { setCompletionError('پایان درس ذخیره نشد؛ دوباره تلاش کنید.'); }
    finally { completing.current=false; setSaving(false); }
  };

  const goToPreviousSentence = () => {
    if (!sessionReady || saving || !!sessionError || stage !== 1) return;
    setSentenceIndex(previousSentenceIndex(sentenceIndex));
    setRevealed(false);
    setSpeechResult(null);
    setSpeechError(null);
  };

  if (invalidLesson) return <View style={styles.root}><PageNavigation backFallback="/lang/library" /><Text style={styles.stageDesc}>درس پیدا نشد.</Text><Pressable accessibilityRole="button" onPress={()=>router.replace('/lang/library' as never)}><Text style={styles.stageTitle}>فهرست درس‌ها</Text></Pressable></View>;
  if (!sessionReady) return <View style={styles.root}><PageNavigation backFallback="/lang" /><Text style={styles.stageDesc}>{sessionError || 'در حال بازیابی جلسه…'}</Text></View>;
  return (
    <View style={styles.root} onTouchStart={timer.interact}>
      <LinearGradient colors={ENGLISH_LEVEL_GRADIENTS[courseLevel.id]} start={{ x: .95, y: 0 }} end={{ x: .05, y: 1 }} style={styles.header}>
        <View style={styles.headerTop}>
          <PageNavigation tone="dark" backFallback="/lang" />
          <View style={styles.headerText}>
            <Text style={styles.headerEyebrow}>LEVEL {courseLevel.id} · {courseLevel.title.toUpperCase()}</Text>
            <Text style={styles.headerTitle}>{lesson.title}</Text>
            <Text style={styles.headerSub}>{stages[stage].labelFa} · مرحله {toPersianDigits(stage + 1)} از {toPersianDigits(stages.length)}</Text>
          </View>
          <View style={styles.percentBadge}>
            <Text style={styles.percent}>{toPersianDigits(progressPercent)}٪</Text>
            <Text style={styles.percentLabel}>پیشرفت</Text>
          </View>
        </View>
        <View style={styles.headerBottom}>
          <View style={styles.headerInfoChip}><BookOpenCheck size={13} color="#D9DBFF" /><Text style={styles.headerInfoText}>مسیر اصلی جمله‌محور</Text></View>
          <Text style={styles.headerInfoText}>{toPersianDigits(lesson.sentences.length)} جملهٔ اصلی</Text>
        </View>
      </LinearGradient>
      <View style={styles.stepperCard}>
        <View style={styles.stepperHeading}>
          <View>
            <Text style={styles.stepperEyebrow}>LESSON FLOW · 09 STAGES</Text>
            <Text style={styles.stepperTitle}>جریان این درس</Text>
          </View>
          <View style={styles.stepperNow}>
            <Text style={styles.stepperNowEn}>{stages[stage].labelEn}</Text>
            <Text style={styles.stepperNowFa}>{stages[stage].labelFa}</Text>
          </View>
        </View>
        <View style={styles.stepSegments}>
          {stages.map((item, index) => <View key={item.id} accessibilityLabel={`${item.labelEn} ${index + 1} از ${stages.length}`} style={[styles.stepSegment, index <= stage && styles.stepSegmentDone, index === stage && styles.stepSegmentCurrent]} />)}
        </View>
        <View style={styles.stepperEnds}><Text style={styles.stepperEndText}>Situation</Text><Text style={styles.stepperEndText}>Spaced Review</Text></View>
      </View>

      {!!(sessionError || timer.error) && <Text style={styles.speechError}>{sessionError || timer.error}</Text>}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {stage === 0 && (
          <View style={styles.centerStage}>
            <View style={styles.bigIcon}><Sparkles size={34} color={Colors.accent[400]} /></View>
            <Text style={styles.stageEyebrow}>موقعیت واقعی</Text>
            <Text style={styles.stageTitle}>{lesson.title}</Text>
            <Text style={styles.situation}>{lesson.situation}</Text>
            <View style={styles.promiseCard}>
              <Text style={styles.promiseTitle}>{lesson.c1Section ? 'در این درس تمرین می‌کنید:' : 'در پایان این درس می‌توانید:'}</Text>
              <Text style={styles.promiseText}>{lesson.c1Section ? `کاربرد ${toPersianDigits(lesson.sentences.length)} جمله و گفت‌وگو در این موقعیت؛ پایان درس به‌تنهایی تسلط را تأیید نمی‌کند.` : `با ${toPersianDigits(lesson.sentences.length)} جمله کوتاه، این موقعیت را مدیریت کنید.`}</Text>
            </View>
            {lessonTopics && <View style={styles.promiseCard}>
              <Text style={styles.promiseTitle}>موضوع‌های این درس</Text>
              {lessonTopics.map(topic => <Text key={topic} style={styles.promiseText}>• {topic}</Text>)}
            </View>}
          </View>
        )}

        {stage === 1 && (
          <View style={styles.sentenceStage}>
            <Text style={styles.counter}>جمله {toPersianDigits(sentenceIndex + 1)} از {toPersianDigits(lesson.sentences.length)}</Text>
            <View style={styles.sentenceCard}>
              <Pressable accessibilityRole="button" accessibilityLabel={`پخش نمونهٔ صوتی جمله: ${current.en}`} accessibilityHint="فقط نمونهٔ گفتاری پخش می‌شود؛ میکروفن فعال نیست." style={styles.soundButton} onPress={() => speak(current.en)}>
                <Volume2 size={25} color={Colors.onColor} />
              </Pressable>
              <Text style={styles.english}>{current.en}</Text>
              <Text style={[styles.pronunciation,current.pronunciation.startsWith('/ ')&&{fontFamily:'Inter-ExtraBold',textAlign:'left',writingDirection:'ltr'}]}>{current.pronunciation}</Text>
              {!lesson.b2Section && !lesson.c1Section && lesson.order >= 89 + B1_INDEPENDENT_UNITS.length + A2_FOUNDATION_LESSONS.length && <Text style={styles.hint}>راهنمای واجی آمریکایی از واژه‌نامه؛ بدون تکیه و پیوند گفتار. واژه داخل کروشه آوانویسی نشده است. برای آهنگ جمله به صدا گوش دهید.</Text>}
              <View style={styles.divider} />
              <Text style={styles.persian}>{current.fa}</Text>
              {current.pattern ? <View style={styles.pattern}><Text style={styles.patternLabel}>الگو</Text><Text style={styles.patternEnglish}>{current.pattern}</Text></View> : null}
            </View>
            <Text style={styles.hint}>جمله به‌صورت خودکار پخش می‌شود. اگر مرورگر صدا را متوقف کرد، دکمهٔ بلندگو را بزنید.</Text>
            {!!audioNotice && <Text accessibilityLiveRegion="polite" style={styles.speechError}>{audioNotice}</Text>}
          </View>
        )}

        {stage === 2 && (
          <View style={styles.centerStage}>
            <View style={styles.bigIcon}><Headphones size={34} color={Colors.primary[400]} /></View>
            <Text style={styles.stageTitle}>شنیدن جمله‌ها</Text>
            <Text style={styles.stageDesc}>هر جمله را جداگانه گوش دهید و معنی همان جمله را به یاد بیاورید. واژه‌ها همیشه کنار جملهٔ اصلی می‌مانند.</Text>
            <View style={styles.listenList}>
              {lesson.sentences.map((sentence, index) => (
                <Pressable
                  key={sentence.id}
                  accessibilityRole="button"
                  accessibilityLabel={`پخش جملهٔ ${toPersianDigits(index + 1)} از ${toPersianDigits(lesson.sentences.length)}: ${sentence.en}`}
                  style={[styles.listenRow, index === sentenceIndex && styles.listenRowActive]}
                  onPress={() => selectListeningSentence(index)}
                >
                  <View style={styles.listenNumber}><Text style={styles.listenNumberText}>{toPersianDigits(index + 1)}</Text></View>
                  <Text style={styles.listenEnglish}>{sentence.en}</Text>
                  <Volume2 size={19} color={Colors.primary[400]} />
                </Pressable>
              ))}
            </View>
            <View style={styles.shadowTip}>
              <Headphones size={18} color={Colors.primary[400]} />
              <Text style={styles.shadowText}>فعلاً فقط به صدا گوش دهید؛ مرحلهٔ بعد برای تکرار و سایه‌خوانی است.</Text>
            </View>
            {lesson.c1Section && <EnglishC1Reading key={lesson.id} lessonId={lesson.id} />}
          </View>
        )}

        {stage === 3 && (
          <View style={styles.centerStage}>
            <View style={styles.bigIcon}><Mic2 size={34} color={Colors.success[400]} /></View>
            <Text style={styles.stageTitle}>سایه‌خوانی · Shadowing</Text>
            <Text style={styles.stageDesc}>یک جمله را پخش کنید، مکث کنید و با همان آهنگ تکرار کنید. این تمرین بدون ضبط صدا هم کامل است.</Text>
            <View style={styles.speechPractice}>
              <Text style={styles.speechTitle}>جملهٔ انتخاب‌شده</Text>
              <Text style={styles.speechSentence}>{current.en}</Text>
              <Pressable accessibilityRole="button" style={styles.recordButton} onPress={() => speak(current.en, 0.5)}>
                <Volume2 size={18} color={Colors.onColor} /><Text style={styles.recordButtonText}>پخش آهستهٔ نمونه</Text>
              </Pressable>
              <Text style={styles.speechHint}>{recorderState.isRecording ? `در حال ضبط · ${toPersianDigits(Math.max(1, Math.round(recorderState.durationMillis / 1000)))} ثانیه` : evaluatingSpeech ? 'در حال بررسی…' : PAID_AI_ENABLED ? 'در صورت فعال‌بودن سرویس، می‌توانید ضبط و بررسی آنلاین را هم انتخاب کنید.' : 'میکروفن و ارسال آنلاین در حالت بدون هزینه غیرفعال‌اند؛ جمله را با صدای بلند تکرار کنید.'}</Text>
              <Pressable accessibilityRole="button"
                accessibilityLabel={PAID_AI_ENABLED ? recorderState.isRecording ? 'توقف ضبط و بررسی آنلاین جمله' : 'شروع ضبط اختیاری جمله' : 'ضبط و بررسی آنلاین گفتار غیرفعال است'}
                accessibilityHint={!PAID_AI_ENABLED ? PAID_AI_DISABLED_MESSAGE : 'در صورت فعال‌سازی و رضایت جداگانه، صدا برای بررسی فرستاده می‌شود.'}
                accessibilityState={{ disabled: !PAID_AI_ENABLED || evaluatingSpeech }}
                disabled={!PAID_AI_ENABLED || evaluatingSpeech}
                style={[styles.recordButton, recorderState.isRecording && styles.recordButtonActive, (!PAID_AI_ENABLED || evaluatingSpeech) && styles.recordButtonDisabled]}
                onPress={() => recorderState.isRecording ? void stopAndEvaluateSpeech() : void startSpeechPractice()}
              >
                {evaluatingSpeech ? <Text style={styles.recordButtonText}>در حال بررسی…</Text> : recorderState.isRecording ? <><Square size={17} color={Colors.onColor} fill={Colors.onColor} /><Text style={styles.recordButtonText}>توقف و بررسی</Text></> : <><Mic2 size={19} color={Colors.onColor} /><Text style={styles.recordButtonText}>{PAID_AI_ENABLED ? 'شروع ضبط اختیاری' : 'ضبط آنلاین غیرفعال'}</Text></>}
              </Pressable>
              {speechResult ? (
                <View style={styles.speechResult}>
                  <View style={styles.scoreRow}><Text style={styles.scoreLabel}>شباهت متن تشخیص‌داده‌شده</Text><Text style={styles.scoreValue}>{toPersianDigits(speechResult.score)}٪</Text></View>
                  <Text style={styles.recognizedLabel}>آنچه شنیده شد:</Text>
                  <Text style={styles.recognizedText}>{speechResult.recognized || 'صدای قابل‌تشخیصی دریافت نشد.'}</Text>
                  <Text style={styles.feedbackText}>{speechResult.feedbackFa}</Text>
                  {speechResult.missingWords.length ? <Text style={styles.missingWords}>دوباره تمرین کنید: {speechResult.missingWords.join(' · ')}</Text> : null}
                </View>
              ) : null}
              {speechError ? <Text style={styles.speechError}>{speechError}</Text> : null}
            </View>
            <View style={styles.dots}>
              {lesson.sentences.map((sentence, index) => (
                <Pressable key={sentence.id} accessibilityRole="button" accessibilityLabel={`جمله ${index + 1}`} onPress={() => selectListeningSentence(index)} style={[styles.dot, index === sentenceIndex && styles.dotActive]} />
              ))}
            </View>
          </View>
        )}

        {stage === 4 && (
          <View style={styles.centerStage}>
            <View style={styles.bigIcon}><RotateCcw size={33} color={Colors.success[400]} /></View>
            <Text style={styles.stageTitle}>ساخت جمله</Text>
            <Text style={styles.stageDesc}>معنی جمله را بخوانید و واژه‌های همان جمله را به ترتیب بچینید.</Text>
            <EnglishSentenceBuilder sentence={current} />
            <View style={styles.dots}>
              {lesson.sentences.map((sentence, index) => (
                <Pressable key={sentence.id} accessibilityRole="button" accessibilityLabel={`جمله ${index + 1}`} onPress={() => setSentenceIndex(index)} style={[styles.dot, index === sentenceIndex && styles.dotActive]} />
              ))}
            </View>
          </View>
        )}

        {stage === 5 && (
          <View style={styles.centerStage}>
            <View style={styles.bigIcon}><Sparkles size={34} color={Colors.warning[400]} /></View>
            <Text style={styles.stageTitle}>واژگان از دل جمله‌ها</Text>
            <Text style={styles.stageDesc}>هر واژه در کنار معنی و همان جمله‌ای دیده می‌شود که از آن آمده است.</Text>
            <View style={styles.vocabList}>
              {vocabulary.map(item => (
                <View key={item.word} style={styles.vocabCard}>
                  <View style={styles.vocabTop}>
                    <Text style={styles.vocabWord}>{item.word}</Text>
                    <Text style={styles.vocabMeaning}>{item.meaning}</Text>
                  </View>
                  <Text style={styles.vocabExample}>{item.exampleEn}</Text>
                  <Text style={styles.bubbleFa}>{item.exampleFa}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {stage === 6 && (
          <View style={styles.centerStage}>
            <View style={styles.bigIcon}><BookOpenCheck size={33} color={Colors.primary[400]} /></View>
            <Text style={styles.stageTitle}>Grammar Through Usage · دستور در کاربرد</Text>
            <Text style={styles.stageDesc}>{(lesson.b2Section || lesson.c1Section) ? 'نکته‌های کاربردی را بخوانید و سپس الگوها و مثال‌ها را مرور کنید.' : 'الگوها فقط از جمله‌های ثبت‌شدهٔ همین درس نمایش داده می‌شوند؛ قاعده یا مثال تازه‌ای به محتوا اضافه نشده است.'}</Text>
            {B2_GUIDANCE[lesson.id]?.map((note, index) => (
              <View key={`${lesson.id}-guide-${index}`} style={styles.vocabCard}>
                <Text style={styles.promiseTitle}>{lessonTopics?.[index]}</Text>
                <Text style={styles.promiseText}>{note}</Text>
              </View>
            ))}
            {c1Unit?.topics.map((topic, index) => <View key={`${lesson.id}-c1-guide-${index}`} style={styles.vocabCard}>
              <Text style={styles.promiseTitle}>{topic[0]}</Text>
              <Text style={styles.promiseText}>{topic[5]}</Text>
            </View>)}
            {grammarPatterns.length ? grammarPatterns.map(item => (
              <View key={item.sentenceId} style={styles.vocabCard}>
                <Text style={styles.patternEnglish}>{item.pattern}</Text>
                <Text style={styles.vocabExample}>{item.exampleEn}</Text>
                <Text style={styles.bubbleFa}>{item.exampleFa}</Text>
                <Pressable accessibilityRole="button" accessibilityLabel={`شنیدن جمله: ${item.exampleEn}`} onPress={() => speak(item.exampleEn)} style={styles.bubbleSound}>
                  <Volume2 size={16} color={Colors.primary[400]} />
                </Pressable>
              </View>
            )) : <View style={styles.promiseCard}>
              <Text style={styles.promiseTitle}>یادگیری در بافت جمله</Text>
              <Text style={styles.promiseText}>برای این درس الگوی دستوری جداگانه‌ای ثبت نشده است؛ جملهٔ اصلی را بشنوید و ساختارش را در کاربرد واقعی ببینید.</Text>
            </View>}
            {lesson.c1Section && lessonTopics && <EnglishB2TopicPractice key={lesson.id} lessonId={lesson.id} topics={lessonTopics} practice={C1_TOPIC_PRACTICE[lesson.id]} />}
            {lesson.c1Section && <EnglishB2TopicPractice key={`${lesson.id}-application`} lessonId={lesson.id} topics={['تحلیل موقعیت']} practice={C1_APPLICATION_PRACTICE[lesson.id]} heading="کاربرد در موقعیت تازه · اختیاری" description="با توجه به موقعیت تازه بهترین پاسخ را انتخاب کنید؛ این تمرین شرط پایان درس نیست." />}
            {lesson.c1Section && <EnglishB2TopicPractice key={`${lesson.id}-application-extra`} lessonId={lesson.id} topics={['سنجش کاربرد در بافت جدید']} practice={C1_ADDITIONAL_APPLICATION[lesson.id]} heading="سنجش کاربردی تکمیلی · اختیاری" description="به موقعیت تازه پاسخ دهید. نتیجه با بازخورد ثبت می‌شود؛ برای حفظ پیشرفت قبلی شرط تازه‌ای برای پایان درس ایجاد نمی‌کند." />}
            {lesson.b2Section && lessonTopics && <EnglishB2TopicPractice key={lesson.id} lessonId={lesson.id} topics={lessonTopics} />}
          </View>
        )}

        {stage === 7 && (
          <View style={styles.centerStage}>
            <View style={styles.bigIcon}><MessageCircle size={34} color={Colors.accent[400]} /></View>
            <Text style={styles.stageTitle}>Conversation Practice · مکالمهٔ هدایت‌شده</Text>
            <Text style={styles.stageDesc}>فعلاً به‌جای سرویس AI آنلاین، از گفت‌وگوی همین درس به شکل تمرین نقش‌آفرینی رایگان استفاده کنید.</Text>
            <EnglishDialoguePractice key={lesson.id} dialogue={lesson.dialogue} />
            {lesson.c1Section && <EnglishB2Scenario key={lesson.id} lessonId={lesson.id} speak={speak} scenario={C1_SCENARIOS[lesson.id]} />}
            {lesson.c1Section && <EnglishC1ExtendedModel key={`${lesson.id}-extended`} lessonId={lesson.id} speak={speak} />}
            {lesson.b2Section && <EnglishB2Scenario key={lesson.id} lessonId={lesson.id} speak={speak} />}
            {!!B2_PRODUCTION[lesson.id] && <View style={styles.promiseCard}>
              <Text style={styles.promiseTitle}>تمرین تولید آزاد · اختیاری</Text>
              <Text style={styles.promiseText}>{B2_PRODUCTION[lesson.id]}</Text>
              <Text style={styles.promiseText}>{B2_PRODUCTION_CHECKLIST}</Text>
              <Text style={styles.promiseText}>این فعالیت خودکار تصحیح یا ذخیره نمی‌شود و شرط پایان درس نیست.</Text>
            </View>}
          </View>
        )}

        {stage === 8 && (
          <View style={styles.centerStage}>
            <View style={styles.bigIcon}><RefreshCw size={33} color={Colors.success[400]} /></View>
            <Text style={styles.stageTitle}>مرور فاصله‌دار</Text>
            <Text style={styles.stageDesc}>با ثبت پایان درس، جمله‌ها و واژه‌های وابسته به آن وارد برنامهٔ مرور می‌شوند؛ مرور بر اساس پاسخ شما فاصله‌گذاری می‌شود.</Text>
            <View style={styles.promiseCard}>
              <Text style={styles.promiseTitle}>خلاصهٔ همین درس</Text>
              <Text style={styles.promiseText}>{toPersianDigits(lesson.sentences.length)} جمله و {toPersianDigits(vocabulary.length)} واژهٔ یکتا؛ محتوا همان محتوای اصلی درس است.</Text>
            </View>
            {evidencePassed
              ? CORE_LESSON_EVIDENCE[lesson.id]
                ? <Text style={styles.stageDesc}>همهٔ {toPersianDigits(CORE_LESSON_EVIDENCE[lesson.id].length)} سنجشِ این درس با پاسخ درست ثبت شد ✓</Text>
                : <View><Text style={styles.stageDesc}>شنیداری: ثبت شد ✓</Text><Text style={styles.stageDesc}>نوشتاری: ثبت شد ✓</Text></View>
              : <EnglishLessonEvidence key={lesson.id} lesson={lesson} onPassed={() => setEvidencePassed(true)} />}
          </View>
        )}
        {!!completionError && <Text style={styles.stageDesc}>{completionError}</Text>}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          {stage === 1 && <Pressable accessibilityRole="button" accessibilityLabel="جملهٔ قبلی" accessibilityState={{ disabled: saving || !!sessionError || sentenceIndex === 0 }} disabled={saving || !!sessionError || sentenceIndex === 0} onPress={goToPreviousSentence} style={[styles.previousButton, (saving || !!sessionError || sentenceIndex === 0) && { opacity: .45 }]}>
            <Text style={styles.secondaryControlText}>جمله قبلی</Text>
          </Pressable>}
          <Pressable accessibilityRole="button" accessibilityState={{ disabled: saving || !!sessionError || (stage === stages.length - 1 && !evidencePassed) }} disabled={saving || !!sessionError || (stage === stages.length - 1 && !evidencePassed)} style={[styles.nextButton, stage === 1 && styles.nextButtonBesidePrevious, (saving || (stage === stages.length - 1 && !evidencePassed)) && { opacity: .45 }]} onPress={() => void next()}>
            <Text style={styles.nextText}>{stage === stages.length - 1 ? 'پایان درس' : stage === 1 && sentenceIndex < lesson.sentences.length - 1 ? 'جمله بعدی' : 'ادامه'}</Text>
            {stage === stages.length - 1 ? <Check size={20} color={Colors.onColor} /> : <ChevronLeft size={20} color={Colors.onColor} />}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.canvas },
  // Keep the lesson canvas and vertical safe area consistent.
  header: { width: '100%', maxWidth: 900, minHeight: 64, alignSelf: 'center', paddingTop: 12, paddingHorizontal: 15, paddingBottom: 7, gap: 8, borderBottomLeftRadius: 22, borderBottomRightRadius: 22 },
  headerTop: { width: '100%', maxWidth: 900, alignSelf: 'center', flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  headerText: { flex: 1, alignItems: 'flex-end', gap: 2 },
  headerEyebrow: { fontFamily: 'Inter-ExtraBold', color: 'rgba(255,255,255,0.72)', fontSize: 8, fontWeight: '800', letterSpacing: 1, writingDirection: 'ltr' },
  headerTitle: { fontFamily: Typography.fontFamily, fontSize: 20, lineHeight: 27, fontWeight: '400', color: '#FFFFFF', textAlign: 'right', writingDirection: 'rtl' },
  headerSub: { fontFamily: Typography.fontFamily, fontSize: 12, fontWeight: '400', color: 'rgba(255,255,255,0.78)', textAlign: 'right', writingDirection: 'rtl' },
  percentBadge: { minWidth: 50, height: 50, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.14)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  percent: { fontFamily: Typography.fontFamily, fontSize: 16, lineHeight: 18, fontWeight: '400', color: '#FFFFFF', writingDirection: 'rtl' },
  percentLabel: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.72)', fontSize: 9, fontWeight: '400', writingDirection: 'rtl' },
  headerBottom: { width: '100%', maxWidth: 900, alignSelf: 'center', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingTop: 9, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.18)' },
  headerInfoChip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5 },
  headerInfoText: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.78)', fontSize: 11, fontWeight: '400', writingDirection: 'rtl' },
  stepperCard: { width: '100%', maxWidth: 900, alignSelf: 'center', marginTop: 12, paddingHorizontal: 20, paddingVertical: 13, borderRadius: 18, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: 10, shadowColor: '#20264A', shadowOpacity: .04, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  stepperHeading: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  stepperEyebrow: { fontFamily: 'Inter-ExtraBold', color: Palette.primary, fontSize: 8, fontWeight: '800', letterSpacing: 1, writingDirection: 'ltr' },
  stepperTitle: { fontFamily: Typography.fontFamily, fontSize: 14, lineHeight: 18, fontWeight: '400', color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  stepperNow: { alignItems: 'flex-end', gap: 1 },
  stepperNowEn: { fontFamily: 'Inter-ExtraBold', color: Palette.primaryDark, fontSize: 9, fontWeight: '800', writingDirection: 'ltr' },
  stepperNowFa: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, fontWeight: '400', writingDirection: 'rtl' },
  stepSegments: { flexDirection: 'row-reverse', gap: 4 },
  stepSegment: { flex: 1, height: 5, borderRadius: 999, backgroundColor: Palette.border },
  stepSegmentDone: { backgroundColor: Palette.primary },
  stepSegmentCurrent: { height: 8, marginTop: -1.5, backgroundColor: Palette.teal },
  stepperEnds: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
  stepperEndText: { fontFamily: 'Inter-ExtraBold', color: Palette.muted, fontSize: 8, fontWeight: '800', writingDirection: 'ltr' },
  content: { width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: 15, paddingTop: 9, paddingBottom: 22, gap: 11 },
  centerStage: { alignItems: 'center', width: '100%' },
  bigIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: Palette.primarySoft, borderWidth: 1, borderColor: '#DDE2FF', alignItems: 'center', justifyContent: 'center', marginVertical: Spacing.lg },
  stageEyebrow: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, fontWeight: '400', color: Palette.primary, marginBottom: 4, textAlign: 'right', writingDirection: 'rtl', alignSelf: 'stretch' },
  stageTitle: { fontFamily: Typography.fontFamily, fontSize: 27, lineHeight: 36, fontWeight: '400', color: Palette.ink, textAlign: 'right', writingDirection: 'rtl', alignSelf: 'stretch' },
  stageDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm + 2, fontWeight: '400', color: Palette.text, textAlign: 'right', writingDirection: 'rtl', alignSelf: 'stretch', lineHeight: 23, marginTop: Spacing.sm },
  situation: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md + 2, fontWeight: '400', color: Palette.text, textAlign: 'right', writingDirection: 'rtl', alignSelf: 'stretch', lineHeight: 27, marginTop: Spacing.md },
  promiseCard: { width: '100%', borderRadius: Radius.xl, backgroundColor: Palette.primarySoft, borderWidth: 1, borderColor: '#DDE2FF', padding: Spacing.lg, marginTop: Spacing.xl },
  promiseTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm + 2, fontWeight: '400', color: Palette.primaryDark, textAlign: 'right', writingDirection: 'rtl' },
  promiseText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm + 2, fontWeight: '400', color: Palette.text, textAlign: 'right', writingDirection: 'rtl', lineHeight: 23, marginTop: 5 },
  sentenceStage: { alignItems: 'center', paddingTop: Spacing.lg, width: '100%' },
  counter: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, fontWeight: '400', color: Palette.muted, marginBottom: Spacing.md, alignSelf: 'flex-end', textAlign: 'right', writingDirection: 'rtl' },
  sentenceCard: { width: '100%', borderRadius: Radius.xl, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, padding: Spacing.xl, alignItems: 'center', shadowColor: '#172033', shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  soundButton: { width: 54, height: 54, borderRadius: 27, backgroundColor: Palette.primary, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  english: { fontFamily: 'Inter-ExtraBold', width: '100%', fontSize: 25, lineHeight: 36, fontWeight: '800', color: Palette.ink, textAlign: 'left', writingDirection: 'ltr' },
  pronunciation: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm + 2, fontWeight: '400', color: Palette.primaryDark, textAlign: 'center', writingDirection: 'rtl', marginTop: 8 },
  divider: { width: '70%', height: 1, backgroundColor: Palette.border, marginVertical: Spacing.lg },
  persian: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.lg + 2, fontWeight: '400', color: Palette.text, textAlign: 'right', writingDirection: 'rtl', alignSelf: 'stretch' },
  pattern: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'flex-start', gap: 8, alignSelf: 'flex-end', backgroundColor: Palette.warningSoft, paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.full, marginTop: Spacing.md },
  patternLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, fontWeight: '400', color: Palette.warning, writingDirection: 'rtl' },
  patternEnglish: { fontFamily: 'Inter-ExtraBold', fontSize: Typography.sizes.xs + 2, fontWeight: '800', color: Palette.warning, textAlign: 'left', writingDirection: 'ltr' },
  hint: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, fontWeight: '400', color: Palette.muted, textAlign: 'right', writingDirection: 'rtl', lineHeight: 19, marginTop: Spacing.md },
  listenList: { width: '100%', gap: Spacing.sm, marginTop: Spacing.xl },
  listenRow: { minHeight: 62, borderRadius: Radius.lg, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, paddingHorizontal: Spacing.md, flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.sm },
  listenRowActive: { borderColor: Palette.primary, backgroundColor: Palette.primarySoft },
  listenNumber: { width: 30, height: 30, borderRadius: 15, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  listenNumberText: { fontFamily: Typography.numberFontFamily, fontSize: Typography.sizes.xs + 2, fontWeight: '400', color: Palette.primaryDark, writingDirection: 'rtl' },
  listenEnglish: { fontFamily: 'Inter-ExtraBold', flex: 1, fontSize: 15, fontWeight: '800', color: Palette.ink, textAlign: 'left', writingDirection: 'ltr' },
  speechPractice: { width: '100%', borderRadius: Radius.xl, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, padding: Spacing.lg, alignItems: 'center', marginTop: Spacing.lg, shadowColor: '#172033', shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  speechTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md + 2, fontWeight: '400', color: Palette.ink, textAlign: 'right', writingDirection: 'rtl', alignSelf: 'stretch' },
  speechSentence: { fontFamily: 'Inter-ExtraBold', width: '100%', fontSize: 19, lineHeight: 28, fontWeight: '800', color: Palette.ink, textAlign: 'left', writingDirection: 'ltr', marginTop: Spacing.sm },
  speechHint: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, fontWeight: '400', color: Palette.muted, textAlign: 'right', writingDirection: 'rtl', alignSelf: 'stretch', lineHeight: 19, marginTop: 6 },
  recordButton: { minHeight: 48, minWidth: 155, borderRadius: Radius.full, paddingHorizontal: Spacing.lg, backgroundColor: Palette.primary, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: Spacing.md },
  recordButtonActive: { backgroundColor: Palette.danger },
  recordButtonDisabled: { opacity: .55 },
  recordButtonText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm + 2, fontWeight: '400', color: Colors.onColor, writingDirection: 'rtl' },
  speechResult: { width: '100%', borderRadius: Radius.lg, backgroundColor: Palette.successSoft, borderWidth: 1, borderColor: '#BBF7D0', padding: Spacing.md, marginTop: Spacing.md },
  scoreRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  scoreLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, fontWeight: '400', color: Palette.muted, textAlign: 'right', writingDirection: 'rtl' },
  scoreValue: { fontFamily: Typography.numberFontFamily, fontSize: Typography.sizes.lg + 2, fontWeight: '400', color: Palette.success, writingDirection: 'rtl' },
  recognizedLabel: { fontFamily: Typography.fontFamily, fontSize: 12, fontWeight: '400', color: Palette.muted, textAlign: 'right', writingDirection: 'rtl', marginTop: Spacing.sm },
  recognizedText: { fontFamily: 'Inter-ExtraBold', fontSize: 15, fontWeight: '800', color: Palette.ink, textAlign: 'left', writingDirection: 'ltr', marginTop: 3 },
  feedbackText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, fontWeight: '400', color: Palette.success, textAlign: 'right', writingDirection: 'rtl', lineHeight: 19, marginTop: Spacing.sm },
  missingWords: { fontFamily: 'Inter-ExtraBold', fontSize: 12, fontWeight: '800', color: Palette.warning, textAlign: 'left', writingDirection: 'ltr', marginTop: Spacing.sm },
  speechError: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, fontWeight: '400', color: Palette.danger, textAlign: 'right', writingDirection: 'rtl', lineHeight: 19, marginTop: Spacing.sm },
  shadowTip: { width: '100%', marginTop: Spacing.md, borderRadius: Radius.lg, backgroundColor: Palette.warningSoft, padding: Spacing.md, flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  shadowText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, fontWeight: '400', color: Palette.text, textAlign: 'right', writingDirection: 'rtl', lineHeight: 19 },
  practiceCard: { width: '100%', minHeight: 230, borderRadius: Radius.xl, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, padding: Spacing.xl, marginTop: Spacing.xl, alignItems: 'center', justifyContent: 'center', shadowColor: '#172033', shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  practiceFa: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xl + 2, fontWeight: '400', color: Palette.ink, textAlign: 'right', writingDirection: 'rtl', alignSelf: 'stretch', lineHeight: 32 },
  revealButton: { marginTop: Spacing.xl, minHeight: 44, paddingHorizontal: Spacing.xl, borderRadius: Radius.full, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  revealText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm + 2, fontWeight: '400', color: Palette.primaryDark, writingDirection: 'rtl' },
  answerBox: { marginTop: Spacing.xl, padding: Spacing.md, borderRadius: Radius.lg, backgroundColor: Palette.successSoft, flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  answerText: { fontFamily: 'Inter-ExtraBold', flex: 1, fontSize: 18, fontWeight: '800', color: Palette.success, textAlign: 'left', writingDirection: 'ltr' },
  dots: { flexDirection: 'row', gap: 8, marginTop: Spacing.lg },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: Palette.border },
  dotActive: { width: 24, backgroundColor: Palette.primary },
  dialogue: { width: '100%', gap: Spacing.sm, marginTop: Spacing.xl },
  bubble: { maxWidth: '88%', borderRadius: Radius.xl, padding: Spacing.md, borderWidth: 1 },
  bubblePartner: { alignSelf: 'flex-start', backgroundColor: Palette.surface, borderColor: Palette.border, borderBottomLeftRadius: 5 },
  bubbleLearner: { alignSelf: 'flex-end', backgroundColor: Palette.primarySoft, borderColor: '#DDE2FF', borderBottomRightRadius: 5 },
  bubbleSpeaker: { fontFamily: Typography.fontFamily, fontSize: 12, fontWeight: '400', color: Palette.primaryDark, marginBottom: 4, textAlign: 'right', writingDirection: 'rtl' },
  bubbleEn: { fontFamily: 'Inter-ExtraBold', fontSize: 16, fontWeight: '800', color: Palette.ink, lineHeight: 23, textAlign: 'left', writingDirection: 'ltr' },
  bubbleFa: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, fontWeight: '400', color: Palette.muted, textAlign: 'right', writingDirection: 'rtl', marginTop: 5 },
  bubbleSound: { alignSelf: 'flex-end', marginTop: 6 },
  vocabList: { width: '100%', gap: Spacing.sm, marginTop: Spacing.xl },
  vocabCard: { borderRadius: Radius.lg, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, padding: Spacing.md },
  vocabTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vocabWord: { fontFamily: 'Inter-ExtraBold', fontSize: 18, fontWeight: '800', color: Palette.ink, textAlign: 'left', writingDirection: 'ltr' },
  vocabMeaning: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm + 2, fontWeight: '400', color: Palette.primaryDark, textAlign: 'right', writingDirection: 'rtl' },
  vocabExample: { fontFamily: 'Inter-ExtraBold', fontSize: 13, fontWeight: '800', color: Palette.text, textAlign: 'left', writingDirection: 'ltr', marginTop: 8 },
  footer: { width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: 15, paddingTop: 7, paddingBottom: 30, backgroundColor: Palette.canvas, borderTopWidth: 1, borderTopColor: Palette.border, shadowColor: '#20264A', shadowOpacity: .07, shadowRadius: 12, shadowOffset: { width: 0, height: -4 }, elevation: 5 },
  footerButtons: { width: '100%', flexDirection: 'row', gap: 8, alignItems: 'center' },
  previousButton: { flex: 1, minHeight: 54, borderRadius: 17, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surface, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  secondaryControlText: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 13, textAlign: 'center', writingDirection: 'rtl' },
  nextButton: { width: '100%', maxWidth: 900, alignSelf: 'center', minHeight: 54, borderRadius: 17, backgroundColor: Palette.primary, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: Palette.primary, shadowOpacity: .2, shadowRadius: 9, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  nextButtonBesidePrevious: { flex: 1, width: undefined },
  nextText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md + 2, fontWeight: '400', color: Colors.onColor, writingDirection: 'rtl' },
});
