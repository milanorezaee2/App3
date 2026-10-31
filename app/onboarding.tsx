import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight, BookOpenCheck, Check, ChevronLeft, Sparkles } from 'lucide-react-native';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';
import { completeLearningPlacement, type OnboardingFamiliarity, type OnboardingLanguage } from '@/lib/learningOnboarding';

type Stage = 'familiarity' | 'basic' | 'intermediate';
type AnswerQuestion = { sentence: string; choices: readonly string[]; correctIndex: number };

const placementQuestions: Record<OnboardingLanguage, { label: string; basic: AnswerQuestion; intermediate: AnswerQuestion }> = {
  en: {
    label: 'انگلیسی',
    basic: {
      sentence: 'My name is Sara.',
      choices: ['سارا اهل تهران است.', 'اسم من سارا است.', 'من سارا را می‌شناسم.'],
      correctIndex: 1,
    },
    intermediate: {
      sentence: 'I have lived here for two years.',
      choices: ['دو سال پیش اینجا را ترک کردم.', 'دو سال دیگر به اینجا می‌آیم.', 'دو سال است که اینجا زندگی می‌کنم.'],
      correctIndex: 2,
    },
  },
  ru: {
    label: 'روسی',
    basic: {
      sentence: 'Как дела́?',
      choices: ['اسم شما چیست؟', 'خداحافظ!', 'حالت چطور است؟'],
      correctIndex: 2,
    },
    intermediate: {
      sentence: 'Я уже два года живу здесь.',
      choices: ['من دو سال پیش اینجا زندگی کردم.', 'دو سال است که اینجا زندگی می‌کنم.', 'من دو سال دیگر اینجا زندگی خواهم کرد.'],
      correctIndex: 1,
    },
  },
};

export default function LearningOnboardingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ language?: string | string[] }>();
  const rawLanguage = Array.isArray(params.language) ? params.language[0] : params.language;
  const language: OnboardingLanguage | null = rawLanguage === 'en' || rawLanguage === 'ru' ? rawLanguage : null;
  const [stage, setStage] = useState<Stage>('familiarity');
  const [familiarity, setFamiliarity] = useState<OnboardingFamiliarity>('new');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const content = useMemo(() => language ? placementQuestions[language] : null, [language]);

  useEffect(() => {
    if (!language) router.replace('/languages' as never);
  }, [language, router]);

  const finish = async (input: {
    familiarity: OnboardingFamiliarity;
    questionCount: number;
    correctAnswers: number;
    recommendedLevelId: 0 | 1 | 2;
  }) => {
    if (!language || busy) return;
    setBusy(true);
    setError('');
    try {
      await completeLearningPlacement({ language, ...input });
      router.replace((language === 'en' ? '/lang' : '/learn/ru') as never);
    } catch {
      setError('پاسخ‌ها ذخیره نشد. اتصال اینترنت را بررسی کن و دوباره بزن.');
      setBusy(false);
    }
  };

  const chooseFamiliarity = (answer: OnboardingFamiliarity) => {
    setFamiliarity(answer);
    if (answer === 'new') {
      void finish({ familiarity: 'new', questionCount: 0, correctAnswers: 0, recommendedLevelId: 0 });
      return;
    }
    setStage('basic');
  };

  const chooseAnswer = (index: number) => {
    if (!content || busy) return;
    if (stage === 'basic') {
      const correct = index === content.basic.correctIndex;
      if (!correct) {
        void finish({ familiarity, questionCount: 1, correctAnswers: 0, recommendedLevelId: 0 });
        return;
      }
      setCorrectAnswers(1);
      setStage('intermediate');
      return;
    }
    if (stage === 'intermediate') {
      const nextCorrectAnswers = correctAnswers + (index === content.intermediate.correctIndex ? 1 : 0);
      void finish({
        familiarity,
        questionCount: 2,
        correctAnswers: nextCorrectAnswers,
        recommendedLevelId: nextCorrectAnswers === 2 ? 2 : 1,
      });
    }
  };

  if (!language || !content) return <View style={styles.root} />;

  const questionNumber = stage === 'familiarity' ? 1 : stage === 'basic' ? 2 : 3;
  const question = stage === 'basic' ? content.basic : stage === 'intermediate' ? content.intermediate : null;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <Pressable accessibilityRole="button" accessibilityLabel="بازگشت به انتخاب زبان" accessibilityState={{ disabled: busy }} disabled={busy} onPress={() => router.replace('/languages' as never)} style={styles.backButton}>
          <ArrowRight size={18} color="#1769D2" />
          <Text style={styles.backText}>انتخاب زبان</Text>
        </Pressable>

        <LinearGradient colors={['#FFFFFF', '#EDF5FF', '#E2F0FF']} start={{ x: .95, y: 0 }} end={{ x: .05, y: 1 }} style={styles.card}>
          <View style={styles.brandIcon}><BookOpenCheck size={20} color="#FFFFFF" /></View>
          <View style={styles.eyebrowRow}><Sparkles size={14} color="#2878DE" /><Text style={styles.eyebrow}>شروع شخصی‌سازی‌شده · {content.label}</Text></View>
          <Text accessibilityRole="header" style={styles.title}>چند پرسش کوتاه برای شروع درست</Text>
          <Text style={styles.description}>انتخاب زبان به‌علاوهٔ حداکثر سه پاسخ کوتاه؛ حدود ۳۰ ثانیه.</Text>

          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>پرسش {fa(questionNumber)} از {fa(3)}</Text>
            <Text style={styles.progressPercent}>{fa(Math.round((questionNumber / 3) * 100))}٪</Text>
          </View>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${(questionNumber / 3) * 100}%` }]} /></View>

          {stage === 'familiarity' ? (
            <View style={styles.questionBlock}>
              <Text style={styles.question}>قبلاً کمی با زبان {content.label} آشنا بوده‌ای؟</Text>
              <View style={styles.answers}>
                <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy }} disabled={busy} onPress={() => chooseFamiliarity('new')} style={({ pressed }) => [styles.answer, pressed && styles.answerPressed]}>
                  <View style={styles.answerIcon}><Text style={styles.answerNumber}>۱</Text></View>
                  <Text style={styles.answerText}>نه، می‌خواهم از پایه شروع کنم</Text>
                  <ChevronLeft size={18} color="#7186A3" />
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy }} disabled={busy} onPress={() => chooseFamiliarity('familiar')} style={({ pressed }) => [styles.answer, pressed && styles.answerPressed]}>
                  <View style={styles.answerIcon}><Text style={styles.answerNumber}>۲</Text></View>
                  <Text style={styles.answerText}>بله، کمی آشنایی دارم</Text>
                  <ChevronLeft size={18} color="#7186A3" />
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.questionBlock}>
              <Text style={styles.question}>معنی این جمله کدام است؟</Text>
              <Text style={styles.sentence} accessibilityLabel={`جمله به زبان ${content.label}`}>{question?.sentence}</Text>
              <View style={styles.answers}>
                {question?.choices.map((choice, index) => (
                  <Pressable key={`${stage}-${index}`} accessibilityRole="button" accessibilityLabel={`پاسخ ${fa(index + 1)}: ${choice}`} accessibilityState={{ disabled: busy }} disabled={busy} onPress={() => chooseAnswer(index)} style={({ pressed }) => [styles.answer, pressed && styles.answerPressed]}>
                    <View style={styles.answerIcon}><Text style={styles.answerNumber}>{fa(index + 1)}</Text></View>
                    <Text style={styles.answerText}>{choice}</Text>
                    <ChevronLeft size={18} color="#7186A3" />
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          {busy ? <View style={styles.saving}><ActivityIndicator size="small" color="#1769D2" /><Text style={styles.savingText}>در حال آماده‌کردن مسیر یادگیری…</Text></View> : null}
          <View style={styles.noteRow}><Check size={14} color="#168451" /><Text style={styles.note}>این سنجش فقط نقطهٔ شروع پیشنهادی است، نه مدرک رسمی سطح زبان؛ بعداً می‌توانی مسیر دیگری انتخاب کنی.</Text></View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F9FF', justifyContent: 'center', paddingHorizontal: 18, paddingVertical: 18 },
  page: { flexGrow: 1, width: '100%', maxWidth: 560, alignSelf: 'center', justifyContent: 'center', gap: 12 },
  backButton: { minHeight: 40, alignSelf: 'flex-start', flexDirection: 'row-reverse', alignItems: 'center', gap: 7, paddingHorizontal: 10 },
  backText: { fontFamily: Typography.fontFamily, color: '#1769D2', fontSize: 13, writingDirection: 'rtl' },
  card: { borderRadius: 26, borderWidth: 1, borderColor: '#D8E7F8', padding: 24, gap: 14, shadowColor: '#173C68', shadowOpacity: .07, shadowRadius: 20, shadowOffset: { width: 0, height: 9 }, elevation: 3 },
  brandIcon: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#1769D2', alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  eyebrowRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  eyebrow: { fontFamily: Typography.fontFamily, color: '#2878DE', fontSize: 11, fontWeight: '700', writingDirection: 'rtl' },
  title: { fontFamily: Typography.fontFamily, color: '#102A56', fontSize: 23, fontWeight: '700', lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' },
  description: { fontFamily: Typography.fontFamily, color: '#5F7694', fontSize: 13, lineHeight: 22, textAlign: 'right', writingDirection: 'rtl' },
  progressHeader: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  progressLabel: { fontFamily: Typography.fontFamily, color: '#405B7C', fontSize: 12, fontWeight: '600', writingDirection: 'rtl' },
  progressPercent: { fontFamily: Typography.fontFamily, color: '#7086A2', fontSize: 11, writingDirection: 'rtl' },
  progressTrack: { height: 7, borderRadius: 99, backgroundColor: '#DCE9F8', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99, backgroundColor: '#2878DE' },
  questionBlock: { gap: 13, marginTop: 4 },
  question: { fontFamily: Typography.fontFamily, color: '#102A56', fontSize: 17, fontWeight: '700', lineHeight: 27, textAlign: 'right', writingDirection: 'rtl' },
  sentence: { fontFamily: Typography.fontFamily, color: '#173D6B', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE8F7', borderRadius: 15, paddingVertical: 14, paddingHorizontal: 16, fontSize: 19, fontWeight: '600', lineHeight: 28, textAlign: 'center', writingDirection: 'ltr' },
  answers: { gap: 9 },
  answer: { minHeight: 55, flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#D8E6F6', borderRadius: 15, backgroundColor: '#FFFFFF' },
  answerPressed: { borderColor: '#7EADE7', backgroundColor: '#F3F8FF' },
  answerIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EAF3FF' },
  answerNumber: { fontFamily: Typography.fontFamily, color: '#1769D2', fontSize: 12, fontWeight: '700', writingDirection: 'rtl' },
  answerText: { flex: 1, fontFamily: Typography.fontFamily, color: '#294564', fontSize: 13, lineHeight: 21, textAlign: 'right', writingDirection: 'rtl' },
  noteRow: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 7, borderTopWidth: 1, borderTopColor: '#DCE8F7', paddingTop: 12, marginTop: 3 },
  note: { flex: 1, fontFamily: Typography.fontFamily, color: '#617894', fontSize: 11, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  saving: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, paddingVertical: 5 },
  savingText: { fontFamily: Typography.fontFamily, color: '#1769D2', fontSize: 12, writingDirection: 'rtl' },
  error: { fontFamily: Typography.fontFamily, color: '#B42318', backgroundColor: '#FEF3F2', borderRadius: 12, padding: 10, fontSize: 12, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
});
