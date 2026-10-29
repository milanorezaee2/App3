import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { SentenceBuilder } from '@/components/course/SentenceBuilder';
import { DialoguePractice } from '@/components/course/DialoguePractice';
import {
  CheckQuiz,
  LessonFooter,
  LessonHeader,
  LessonPage,
  LessonStepper,
  ShadowingMic,
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
import {
  COURSE_LESSON_STAGES,
  formatLevelTag,
  type FormatCourse,
  type FormatLesson,
  type FormatCourseSession,
  type FormatSession,
} from '@/lib/languages/courseFormat';
import { toPersianDigits as fa } from '@/lib/format';
import { noteManualSpeech, useAutoNarration } from '@/lib/autoNarration';

const PAGE_SIZE = 5;

/**
 * German and Russian share this player with English: same nine stages, same
 * frames, same footer. Only the sentences, builders and dialogues differ.
 */
export function CourseLessonPlayer({
  course, lesson, session: sessionAdapter, resumeLabel,
}: {
  course: FormatCourse;
  lesson: FormatLesson;
  session?: FormatCourseSession;
  resumeLabel?: string;
}) {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showCheckAnswers, setShowCheckAnswers] = useState(false);
  const [session, setSession] = useState<'loading' | 'ready' | 'error'>('loading');
  const [resumeMessage, setResumeMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [retry, setRetry] = useState(0);
  const completed = useRef(false);
  const store = sessionAdapter ?? course.session;
  const checks = useMemo(() => course.checksFor(lesson), [course, lesson]);
  const allChecksPassed = checks.length > 0 && checks.every((question, index) => answers[String(index)] === question.correctIndex);
  const level = course.levels.find(item => item.id === lesson.levelId) ?? course.levels[0];
  const gradient = course.theme.gradients[level.id] ?? course.theme.gradients[0];
  const sentence = lesson.sentences[Math.min(sentenceIndex, lesson.sentences.length - 1)];
  const wordCount = useMemo(
    () => new Set(lesson.sentences.flatMap(item => item.vocabulary.map(word => `${word.word}::${word.meaning}`))).size,
    [lesson],
  );

  useEffect(() => {
    let alive = true;
    completed.current = false;
    setSession('loading');
    setError('');
    void store.load(lesson.id).then(saved => {
      if (!alive) return;
      setStage(Math.min(saved.stage, COURSE_LESSON_STAGES.length - 1));
      setSentenceIndex(Math.min(saved.sentenceIndex, lesson.sentences.length - 1));
      setAnswers(saved.answers ?? {});
      setShowCheckAnswers(saved.showCheckAnswers);
      setResumeMessage(saved.stage > 0 || saved.sentenceIndex > 0 ? resumeLabel ?? 'جلسهٔ ذخیره‌شده بازیابی شد' : '');
      setSession('ready');
    }).catch(() => {
      if (!alive) return;
      setSession('error');
      setError('جلسهٔ قبلی خوانده نشد؛ برای حفظ اطلاعات، ذخیره متوقف است. دوباره تلاش کنید.');
    });
    return () => { alive = false; void Speech.stop(); };
  }, [course, lesson, store, retry, resumeLabel]);

  useEffect(() => {
    if (session !== 'ready' || completed.current) return;
    let alive = true;
    const payload: FormatSession = {
      stage,
      sentenceIndex,
      revealed: false,
      answers,
      showCheckAnswers,
    };
    void store.save(lesson.id, payload).catch(() => {
      if (alive) setError('محل توقف درس ذخیره نشد؛ اگر از صفحه خارج شوید، ممکن است از بخش قبلی ادامه دهید.');
    });
    return () => { alive = false; };
  }, [course, lesson, store, session, stage, sentenceIndex, answers, showCheckAnswers]);

  /**
   * The narrator reads the phrase that is on screen. Stage one shows the whole
   * situation, so the lesson's key sentence is read there; every other stage
   * reads the sentence the learner is currently on.
   */
  useAutoNarration({
    text: stage === 0 ? lesson.sentences[0]?.text : sentence?.text,
    locale: course.speechLocale,
    enabled: session === 'ready',
    identity: `${course.id}:${lesson.id}:${stage === 0 ? 'intro' : 'study'}`,
  });

  const speak = (text: string, rate = 0.85) => {
    noteManualSpeech(text, course.speechLocale);
    setError('');
    void Speech.stop();
    Speech.speak(text, {
      language: course.speechLocale,
      rate,
      onError: () => setError('پخش صدا انجام نشد؛ تنظیمات گفتار دستگاه یا مرورگر را بررسی کنید. متن درس همچنان در دسترس است.'),
    });
  };

  const goNext = async () => {
    if (saving || session !== 'ready') return;
    void Speech.stop();
    setError('');
    // Only the "core sentences" stage walks the whole sentence list; every other
    // stage moves on, so a fifty-sentence lesson never traps the learner.
    if (stage === 1 && sentenceIndex < lesson.sentences.length - 1) {
      setSentenceIndex(value => value + 1);
      return;
    }
    if (stage < COURSE_LESSON_STAGES.length - 1) {
      setStage(value => value + 1);
      setSentenceIndex(0);
      return;
    }
    if (checks.length > 0 && !allChecksPassed && !showCheckAnswers) return;
    completed.current = true;
    setSaving(true);
    try {
      await course.progress.complete(lesson.id);
      await store.clear(lesson.id).catch(() => undefined);
      router.replace(course.routes.home as never);
    } catch {
      completed.current = false;
      setError('پیشرفت درس ذخیره نشد؛ دوباره تلاش کنید.');
    } finally {
      setSaving(false);
    }
  };

  if (!sentence || !level) {
    return <View style={lessonStyles.root}><Text style={lessonStyles.stageDesc}>محتوای این درس کامل نیست.</Text></View>;
  }

  if (session === 'loading') {
    return (
      <View style={[lessonStyles.root, { alignItems: 'center', justifyContent: 'center', gap: 12 }]}>
        <ActivityIndicator color={Palette.primary} />
        <Text style={lessonStyles.stageDesc}>در حال بازیابی جلسه…</Text>
      </View>
    );
  }

  if (session === 'error') {
    return (
      <View style={[lessonStyles.root, { padding: 20, gap: 12, justifyContent: 'center' }]}>
        <Text accessibilityRole="alert" style={lessonStyles.error}>{error}</Text>
        <Pressable accessibilityRole="button" style={lessonStyles.nextButton} onPress={() => setRetry(value => value + 1)}>
          <Text style={lessonStyles.nextText}>تلاش دوباره</Text>
        </Pressable>
        <Pressable accessibilityRole="button" style={lessonStyles.showAnswersButton} onPress={() => { setStage(0); setSentenceIndex(0); setSession('ready'); }}>
          <Text style={lessonStyles.showAnswersText}>شروع از ابتدا بدون بازنویسی پیش‌نویس قبلی</Text>
        </Pressable>
      </View>
    );
  }

  const footerLabel = stage === 1 && sentenceIndex < lesson.sentences.length - 1
    ? 'جملهٔ بعدی'
    : stage === COURSE_LESSON_STAGES.length - 1
      ? 'پایان درس'
      : 'ادامه';

  const mic = course.id === 'en' ? undefined : (
    <ShadowingMic
      disabled
      canRecord={false}
      recording={false}
      evaluating={false}
      onPress={() => undefined}
    />
  );

  return (
    <LessonPage
      header={<LessonHeader
        levelLabel={formatLevelTag(level)}
        title={lesson.title}
        stageIndex={stage}
        infoLabel={course.brand.courseLabel}
        sentenceCount={lesson.sentences.length}
        gradient={gradient}
      />}
      stepper={<LessonStepper stageIndex={stage} />}
      footer={<LessonFooter
        label={footerLabel}
        saving={saving}
        lastStage={stage === COURSE_LESSON_STAGES.length - 1}
        disabled={checks.length > 0 && stage === COURSE_LESSON_STAGES.length - 1 && !allChecksPassed && !showCheckAnswers}
        onPress={() => void goNext()}
      />}
    >
      {resumeMessage ? (
        <View style={lessonStyles.resumeCard}>
          <Text style={lessonStyles.resumePill}>{resumeMessage}</Text>
          <Text style={lessonStyles.resumeText}>از «{COURSE_LESSON_STAGES[stage].labelFa}»، مرحلهٔ {fa(stage + 1)} و بخش ذخیره‌شده ادامه می‌دهید.</Text>
        </View>
      ) : null}
      {!!error ? <Text accessibilityRole="alert" style={lessonStyles.error}>{error}</Text> : null}

      {stage === 0 ? <StageSituation lesson={lesson} noteTitle={`نکتهٔ ${course.brand.nameFa} به فارسی`} /> : null}

      {stage === 1 ? (
        <StageSentence
          sentence={sentence}
          index={sentenceIndex}
          total={lesson.sentences.length}
          onSpeak={() => speak(sentence.text)}
          pronunciationLtr={course.id === 'en'}
        />
      ) : null}

      {stage === 2 ? (
        <StageListening
          lesson={lesson}
          activeIndex={sentenceIndex}
          onSelect={index => { setSentenceIndex(index); speak(lesson.sentences[index].text); }}
        />
      ) : null}

      {stage === 3 ? (
        <StageShadowing
          sentence={sentence}
          onSpeakSlow={() => speak(sentence.text, 0.5)}
          mic={mic}
          hint="نمونه را آهسته پخش کنید، مکث کنید و با همان آهنگ تکرار کنید. ضبط صدا یا ارزیابی گفتار لازم نیست."
        />
      ) : null}

      {stage === 4 ? (
        <StageBuilder>
          <SentenceBuilder seed={sentence.id} text={sentence.text} fa={sentence.fa} />
          <View style={lessonStyles.dots}>
            {lesson.sentences.map((item, index) => (
              <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`جمله ${fa(index + 1)}`} onPress={() => setSentenceIndex(index)} style={[lessonStyles.dot, index === sentenceIndex && lessonStyles.dotActive]} />
            ))}
          </View>
        </StageBuilder>
      ) : null}

      {stage === 5 ? <StageVocabulary lesson={lesson} onSpeak={text => speak(text)} note={course.vocabularyNote} /> : null}

      {stage === 6 ? <StageGrammar lesson={lesson} onSpeak={text => speak(text)} /> : null}

      {stage === 7 ? (
        <StageConversation>
          <DialoguePractice dialogue={lesson.dialogue} onSpeak={text => speak(text)} />
        </StageConversation>
      ) : null}

      {stage === 8 ? (
        <StageReview
          lesson={lesson}
          wordCount={wordCount}
          note="پاسخ‌ها خودآموزند و گواهی سطح ایجاد نمی‌کنند."
          evidence={checks.length ? (
            <CheckQuiz
              checks={checks}
              answers={answers}
              showAnswers={showCheckAnswers}
              onShowAnswers={() => setShowCheckAnswers(true)}
              onAnswer={(index, choice) => setAnswers(value => {
                const next = { ...value };
                if (choice < 0) delete next[String(index)];
                else next[String(index)] = choice;
                return next;
              })}
            />
          ) : null}
        />
      ) : null}
    </LessonPage>
  );
}
