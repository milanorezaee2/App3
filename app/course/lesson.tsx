import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { Check, ChevronLeft, Mic2, Square, Volume2 } from 'lucide-react-native';
import { COURSE_LEVELS, getSentenceLesson, SENTENCE_LESSONS } from '@/lib/courseContent';
import { completeSentenceLesson } from '@/lib/courseProgress';
import { evaluateSpokenSentence, type SpeechEvaluation } from '@/lib/speechPractice';
import { Colors } from '@/lib/theme';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { toPersianDigits } from '@/lib/format';

import { EnglishLessonEvidence } from '@/components/EnglishLessonEvidence';
import { EnglishSentenceBuilder } from '@/components/EnglishSentenceBuilder';
import { ENGLISH_ENGINE_STEPS } from '@/lib/englishLearningEngine';
import { PageNavigation } from '@/components/PageNavigation';
import { ENGLISH_COURSE, findFormatLesson } from '@/lib/languages/courseRegistry';
import {
  LessonFooter,
  LessonHeader,
  LessonPage,
  LessonStepper,
  StageBuilder,
  StageConversation,
  StageGrammar,
  StageListening,
  StageReview,
  StageSentence,
  StageShadowing,
  StageSituation,
  StageVocabulary,
  lessonStyles,
} from '@/components/course/LessonFormat';
import { DialoguePractice } from '@/components/course/DialoguePractice';

import { loadStudy, saveLessonSession, freshSession } from '@/lib/englishStudyState';
import { loadSupplement } from '@/lib/englishSupplement/progress';
import { CORE_LESSON_EVIDENCE, isCoreLessonEvidenceComplete } from '@/lib/englishFoundationEvidence';
import { useEnglishStudyTimer } from '@/components/useEnglishStudyTimer';
import { PAID_AI_ENABLED, PAID_AI_DISABLED_MESSAGE } from '@/lib/paidAI';
import { playResponsiveSpeech, warmSpeech } from '@/lib/responsiveSpeech';
import { noteManualSpeech, useAutoNarration } from '@/lib/autoNarration';

const stages = ENGLISH_ENGINE_STEPS;

export default function SentenceLessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getSentenceLesson(id || '') ?? SENTENCE_LESSONS[0];
  const courseLevel = COURSE_LEVELS.find(item => item.id === lesson.levelId) ?? COURSE_LEVELS[0];
  const formatLesson = findFormatLesson(ENGLISH_COURSE, lesson.id) ?? ENGLISH_COURSE.lessons[0];
  const gradient = ENGLISH_COURSE.theme.gradients[courseLevel.id] ?? ENGLISH_COURSE.theme.gradients[0];
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
  const timer=useEnglishStudyTimer(sessionReady && !!getSentenceLesson(id || ''));
  useEffect(() => {
    let alive = true;
    loadedLesson.current = null;
    setSessionReady(false);
    setInvalidLesson(!!id && !getSentenceLesson(id));
    if (id && !getSentenceLesson(id)) return;

    void loadStudy().then(async state => {
      if (!alive) return;
      const saved = state.sessions[lesson.id] ?? freshSession();
      setStage(saved.stage);
      setSentenceIndex(Math.min(saved.sentenceIndex, lesson.sentences.length - 1));
      setRevealed(saved.revealed);

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
    return () => { alive = false; void Speech.stop(); };
  }, [lesson.id, lesson.levelId, lesson.sentences.length, id]);
  useEffect(()=>{if(sessionReady&&loadedLesson.current===lesson.id&&!completing.current)void saveLessonSession(lesson.id,{stage,sentenceIndex,revealed,evidencePassed}).then(()=>setSessionError('')).catch(()=>setSessionError('جلسه ذخیره نشد؛ دوباره یکی از کنترل‌های درس را بزنید تا ذخیره تکرار شود.'));},[lesson.id,sessionReady,stage,sentenceIndex,revealed,evidencePassed]);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 250);
  const [evaluatingSpeech, setEvaluatingSpeech] = useState(false);
  const [speechResult, setSpeechResult] = useState<SpeechEvaluation | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const current = lesson.sentences[sentenceIndex];
  const wordCount = new Set(formatLesson.sentences.flatMap(item => item.vocabulary.map(word => `${word.word}::${word.meaning}`))).size;

  useEffect(() => warmSpeech('en-US'), []);

  // The narrator reads the visible phrase automatically: the lesson's key
  // sentence on the situation stage, then whatever sentence is on screen.
  useAutoNarration({
    text: stage === 0 ? lesson.sentences[0]?.en : current.en,
    locale: 'en-US',
    enabled: sessionReady && !recorderState.isRecording && !evaluatingSpeech,
    identity: `${lesson.id}:${stage === 0 ? 'intro' : 'study'}`,
  });

  const speak = (text: string, rate?: number) => {
    noteManualSpeech(text, 'en-US');
    playResponsiveSpeech({ text, locale: 'en-US', rate });
  };

  const startSpeechPractice = async () => {
    if (!PAID_AI_ENABLED) { setSpeechError(PAID_AI_DISABLED_MESSAGE); return; }
    try {
      setSpeechError(null);
      setSpeechResult(null);
      Speech.stop();
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
    speak(lesson.sentences[index].en);
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
    const index = SENTENCE_LESSONS.findIndex((item) => item.id === lesson.id);
    const nextLesson = SENTENCE_LESSONS[index + 1];
    await completeSentenceLesson(lesson.id, nextLesson?.id);
    await saveLessonSession(lesson.id,freshSession());
    router.replace('/lang' as never);
    } catch { setCompletionError('پایان درس ذخیره نشد؛ دوباره تلاش کنید.'); }
    finally { completing.current=false; setSaving(false); }
  };

  if (invalidLesson) return <View style={styles.root}><PageNavigation backFallback="/lang/library" /><Text style={lessonStyles.stageDesc}>درس پیدا نشد.</Text><Pressable accessibilityRole="button" onPress={() => router.replace('/lang/library' as never)}><Text style={lessonStyles.stageTitle}>فهرست درس‌ها</Text></Pressable></View>;
  if (!sessionReady) return <View style={styles.root}><PageNavigation backFallback="/lang" /><Text style={lessonStyles.stageDesc}>{sessionError || 'در حال بازیابی جلسه…'}</Text></View>;

  const lastStage = stage === stages.length - 1;
  const footerLabel = lastStage ? 'پایان درس' : stage === 1 && sentenceIndex < lesson.sentences.length - 1 ? 'جمله بعدی' : 'ادامه';

  return (
    <View style={styles.root} onTouchStart={timer.interact}>
      <LessonPage
        header={<LessonHeader
          levelLabel={`LEVEL ${courseLevel.id} · ${courseLevel.title.toUpperCase()}`}
          title={lesson.title}
          stageIndex={stage}
          infoLabel={ENGLISH_COURSE.brand.courseLabel === 'CORE PATH' ? 'مسیر اصلی جمله‌محور' : ENGLISH_COURSE.brand.courseLabel}
          sentenceCount={lesson.sentences.length}
          gradient={gradient}
        />}
        stepper={<LessonStepper stageIndex={stage} />}
        footer={<LessonFooter
          label={footerLabel}
          saving={saving}
          lastStage={lastStage}
          disabled={!!sessionError || (lastStage && !evidencePassed)}
          onPress={() => void next()}
        />}
      >
        {!!(sessionError || timer.error) ? <Text accessibilityRole="alert" style={lessonStyles.error}>{sessionError || timer.error}</Text> : null}

        {stage === 0 ? <StageSituation lesson={formatLesson} noteTitle="نکتهٔ انگلیسی به فارسی" /> : null}

        {stage === 1 ? (
          <StageSentence
            sentence={formatLesson.sentences[sentenceIndex]}
            index={sentenceIndex}
            total={lesson.sentences.length}
            onSpeak={() => speak(current.en)}
            pronunciationLtr={current.pronunciation.startsWith('/ ')}
            note={lesson.order >= 89 ? 'راهنمای واجی آمریکایی از واژه‌نامه؛ بدون تکیه و پیوند گفتار. واژه داخل کروشه آوانویسی نشده است. برای آهنگ جمله به صدا گوش دهید.' : undefined}
          />
        ) : null}

        {stage === 2 ? (
          <StageListening lesson={formatLesson} activeIndex={sentenceIndex} onSelect={selectListeningSentence} />
        ) : null}

        {stage === 3 ? (
          <StageShadowing
            sentence={formatLesson.sentences[sentenceIndex]}
            onSpeakSlow={() => speak(current.en, 0.5)}
            hint={recorderState.isRecording ? `در حال ضبط · ${toPersianDigits(Math.max(1, Math.round(recorderState.durationMillis / 1000)))} ثانیه` : evaluatingSpeech ? 'در حال بررسی…' : PAID_AI_ENABLED ? 'در صورت فعال‌بودن سرویس، می‌توانید ضبط و بررسی آنلاین را هم انتخاب کنید.' : 'میکروفن و ارسال آنلاین در حالت بدون هزینه غیرفعال‌اند؛ جمله را با صدای بلند تکرار کنید.'}
            mic={<>
              <Pressable accessibilityRole="button"
                accessibilityLabel={PAID_AI_ENABLED ? recorderState.isRecording ? 'توقف ضبط و بررسی آنلاین جمله' : 'شروع ضبط اختیاری جمله' : 'ضبط و بررسی آنلاین گفتار غیرفعال است'}
                accessibilityHint={!PAID_AI_ENABLED ? PAID_AI_DISABLED_MESSAGE : 'در صورت فعال‌سازی و رضایت جداگانه، صدا برای بررسی فرستاده می‌شود.'}
                accessibilityState={{ disabled: !PAID_AI_ENABLED || evaluatingSpeech }}
                disabled={!PAID_AI_ENABLED || evaluatingSpeech}
                style={[lessonStyles.recordButton, recorderState.isRecording && lessonStyles.recordButtonActive, (!PAID_AI_ENABLED || evaluatingSpeech) && lessonStyles.recordButtonDisabled]}
                onPress={() => recorderState.isRecording ? void stopAndEvaluateSpeech() : void startSpeechPractice()}
              >
                {evaluatingSpeech ? <Text style={lessonStyles.recordButtonText}>در حال بررسی…</Text> : recorderState.isRecording ? <><Square size={17} color={Colors.onColor} fill={Colors.onColor} /><Text style={lessonStyles.recordButtonText}>توقف و بررسی</Text></> : <><Mic2 size={19} color={Colors.onColor} /><Text style={lessonStyles.recordButtonText}>{PAID_AI_ENABLED ? 'شروع ضبط اختیاری' : 'ضبط آنلاین غیرفعال'}</Text></>}
              </Pressable>
              {speechResult ? (
                <View style={lessonStyles.evidenceCard}>
                  <View style={lessonStyles.vocabTop}><Text style={lessonStyles.evidenceTitle}>شباهت متن تشخیص‌داده‌شده</Text><Text style={lessonStyles.feedbackTitle}>{toPersianDigits(speechResult.score)}٪</Text></View>
                  <Text style={lessonStyles.evidenceIntro}>آنچه شنیده شد:</Text>
                  <Text style={lessonStyles.choiceTarget}>{speechResult.recognized || 'صدای قابل‌تشخیصی دریافت نشد.'}</Text>
                  <Text style={lessonStyles.feedbackText}>{speechResult.feedbackFa}</Text>
                  {speechResult.missingWords.length ? <Text style={lessonStyles.notice}>دوباره تمرین کنید: {speechResult.missingWords.join(' · ')}</Text> : null}
                </View>
              ) : null}
              {speechError ? <Text accessibilityRole="alert" style={lessonStyles.error}>{speechError}</Text> : null}
            </>}
          />
        ) : null}

        {stage === 4 ? (
          <StageBuilder>
            <EnglishSentenceBuilder sentence={current} />
            <View style={lessonStyles.dots}>
              {lesson.sentences.map((sentence, index) => (
                <Pressable key={sentence.id} accessibilityRole="button" accessibilityLabel={`جمله ${index + 1}`} onPress={() => setSentenceIndex(index)} style={[lessonStyles.dot, index === sentenceIndex && lessonStyles.dotActive]} />
              ))}
            </View>
          </StageBuilder>
        ) : null}

        {stage === 5 ? <StageVocabulary lesson={formatLesson} onSpeak={text => speak(text)} note={ENGLISH_COURSE.vocabularyNote} /> : null}

        {stage === 6 ? <StageGrammar lesson={formatLesson} onSpeak={text => speak(text)} /> : null}

        {stage === 7 ? (
          <StageConversation>
            <DialoguePractice dialogue={formatLesson.dialogue} onSpeak={text => speak(text)} />
          </StageConversation>
        ) : null}

        {stage === 8 ? (
          <StageReview
            lesson={formatLesson}
            wordCount={wordCount}
            note="محتوا همان محتوای اصلی درس است."
            evidence={evidencePassed
              ? CORE_LESSON_EVIDENCE[lesson.id]
                ? <Text style={lessonStyles.evidenceNote}>همهٔ {toPersianDigits(CORE_LESSON_EVIDENCE[lesson.id].length)} سنجشِ این درس با پاسخ درست ثبت شد ✓</Text>
                : <Text style={lessonStyles.evidenceNote}>شنیداری: ثبت شد ✓  نوشتاری: ثبت شد ✓</Text>
              : <EnglishLessonEvidence key={lesson.id} lesson={lesson} onPassed={() => setEvidencePassed(true)} />}
          />
        ) : null}

        {!!completionError ? <Text accessibilityRole="alert" style={lessonStyles.error}>{completionError}</Text> : null}
      </LessonPage>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.canvas },
});
