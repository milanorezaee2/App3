import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Brain, CheckCircle2, Clock3, RefreshCw, Volume2 } from 'lucide-react-native';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { TurkishBottomNav } from '@/components/TurkishBottomNav';
import { PageNavigation } from '@/components/PageNavigation';
import { TURKISH_LESSONS, turkishProgress } from '@/lib/languages/turkish';
import type { CourseProgress, ReviewRating, SentenceReviewCard } from '@/lib/courseProgress';
import { toPersianDigits as fa } from '@/lib/format';
import { playTurkishSpeech, stopTurkishSpeech } from '@/lib/turkishSpeech';
import { Typography } from '@/lib/theme';

const ratingOptions: Array<{ id: ReviewRating; label: string; hint: string; color: string }> = [
  { id: 'again', label: 'فراموش کردم', hint: '۱۰ دقیقه', color: Palette.danger },
  { id: 'hard', label: 'سخت بود', hint: 'فردا', color: Palette.warning },
  { id: 'good', label: 'خوب بود', hint: 'زمان مناسب', color: Palette.primary },
  { id: 'easy', label: 'آسان بود', hint: 'فاصلهٔ بیشتر', color: Palette.success },
];

function contentForCard(card: SentenceReviewCard) {
  const lesson = TURKISH_LESSONS.find(item => item.id === card.lessonId);
  const sentence = lesson?.sentences.find(item => item.id === card.sentenceId);
  return lesson && sentence ? { lesson, sentence } : null;
}

export default function TurkishReview() {
  const router = useRouter();
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [dueCards, setDueCards] = useState<SentenceReviewCard[]>([]);
  const [sessionCards, setSessionCards] = useState<SentenceReviewCard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [speechError, setSpeechError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [nextProgress, nextCards] = await Promise.all([turkishProgress.getCourseProgress(), turkishProgress.getDueReviewCards()]);
      setProgress(nextProgress);
      setDueCards(nextCards);
      setError('');
    } catch {
      setError('مرور ترکی بارگذاری نشد؛ پیشرفت محلی شما تغییر نکرده است.');
    } finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => {
    void load();
    return () => { void stopTurkishSpeech(); };
  }, [load]));

  const currentCard = sessionCards[cardIndex];
  const currentContent = useMemo(() => currentCard ? contentForCard(currentCard) : null, [currentCard]);

  const speak = (text: string) => {
    setSpeechError('');
    void playTurkishSpeech(text, 0.8, () => setSpeechError('صدای ترکی دستگاه در دسترس نیست؛ جمله همچنان برای خواندن نمایش داده می‌شود.'));
  };

  const startSession = () => {
    if (!dueCards.length) return;
    setSessionCards(dueCards.slice(0, 20));
    setCardIndex(0);
    setRevealed(false);
    setFinished(false);
    setSessionActive(true);
  };

  const rate = async (rating: ReviewRating) => {
    if (!currentCard || saving) return;
    setSaving(true);
    setError('');
    try {
      await stopTurkishSpeech();
      await turkishProgress.rateReviewCard(currentCard.id, rating);
      if (cardIndex + 1 >= sessionCards.length) {
        setSessionActive(false);
        setFinished(true);
        await load();
      } else {
        setCardIndex(value => value + 1);
        setRevealed(false);
      }
    } catch {
      setError('نتیجهٔ مرور ذخیره نشد؛ دوباره تلاش کنید.');
    } finally { setSaving(false); }
  };

  if (sessionActive && currentContent) {
    const { lesson, sentence } = currentContent;
    return (
      <View style={styles.root}>
        <View style={styles.sessionHeader}>
          <PageNavigation backFallback="/learn/tr" />
          <Text style={styles.sessionTitle}>مرور امروز</Text>
          <Text style={styles.sessionSubtitle}>کارت {fa(cardIndex + 1)} از {fa(sessionCards.length)} · {lesson.title}</Text>
          <View style={styles.sessionTrack}><View style={[styles.sessionFill, { width: `${((cardIndex + 1) / sessionCards.length) * 100}%` }]} /></View>
        </View>
        {!!error && <Text accessibilityRole="alert" style={styles.alert}>{error}</Text>}
        <ScrollView contentContainerStyle={styles.sessionContent}>
          <Text style={styles.recallLabel}>جملهٔ ترکی را به یاد بیاور</Text>
          <View style={styles.reviewCard}>
            <Text style={styles.reviewFa}>{sentence.fa}</Text>
            {!revealed ? (
              <>
                <Text style={styles.sayHint}>پاسخ ترکی را با صدای بلند بگو، سپس مقایسه کن.</Text>
                <Pressable accessibilityRole="button" style={styles.revealButton} onPress={() => setRevealed(true)}><Text style={styles.revealButtonText}>نمایش پاسخ</Text></Pressable>
              </>
            ) : (
              <View style={styles.answerArea}>
                <View style={styles.answerDivider} />
                <Text style={styles.reviewTurkish}>{sentence.text}</Text>
                <Text style={styles.reviewPronunciation}>{sentence.pronunciation}</Text>
                <Pressable accessibilityRole="button" style={styles.soundButton} onPress={() => speak(sentence.text)}>
                  <Volume2 size={17} color={Palette.primary} />
                  <Text style={styles.soundText}>پخش جمله</Text>
                </Pressable>
                {!!speechError && <Text accessibilityRole="alert" style={styles.speechError}>{speechError}</Text>}
              </View>
            )}
          </View>
          {revealed && (
            <View style={styles.ratingArea}>
              <Text style={styles.ratingTitle}>یادآوری این جمله چطور بود؟</Text>
              <View style={styles.ratingGrid}>
                {ratingOptions.map(option => (
                  <Pressable key={option.id} disabled={saving} style={[styles.ratingButton, { borderColor: `${option.color}55` }]} onPress={() => void rate(option.id)}>
                    <Text style={[styles.ratingLabel, { color: option.color }]}>{saving ? 'در حال ذخیره…' : option.label}</Text>
                    <Text style={styles.ratingHint}>{option.hint}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <PageNavigation backFallback="/learn/tr" />
          <Text style={styles.brandEyebrow}>TÜRKÇE · TEKRAR</Text>
        </View>
        <Text style={styles.pageTitle}>مرور فاصله‌دار ترکی</Text>
        <Text style={styles.pageIntro}>جمله‌هایی که تکمیل کرده‌ای بر اساس زمان مناسب دوباره نمایش داده می‌شوند.</Text>

        {!!error && <Text accessibilityRole="alert" style={styles.alert}>{error}</Text>}

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}><Brain size={22} color={Palette.primary} /></View>
          <View style={styles.heroCopy}>
            <Text style={styles.heroValue}>{loading ? '…' : fa(dueCards.length)}</Text>
            <Text style={styles.heroLabel}>جمله آمادهٔ مرور</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroCopy}>
            <Text style={styles.heroValue}>{fa(progress?.completedLessonIds.length ?? 0)}</Text>
            <Text style={styles.heroLabel}>درس تکمیل‌شده</Text>
          </View>
        </View>

        {finished && (
          <View style={styles.successCard}>
            <CheckCircle2 size={20} color={Palette.success} />
            <Text style={styles.successText}>مرور امروز تمام شد. جمله‌های دشوار به‌زودی برمی‌گردند.</Text>
          </View>
        )}

        {dueCards.length === 0 && !loading ? (
          <View style={styles.emptyCard}>
            <Clock3 size={20} color={Palette.muted} />
            <Text style={styles.emptyTitle}>اکنون چیزی برای مرور نیست</Text>
            <Text style={styles.emptyText}>با تکمیل یک درس، جمله‌های آن به‌طور خودکار وارد برنامهٔ مرور می‌شوند.</Text>
            <Pressable accessibilityRole="button" style={styles.emptyButton} onPress={() => router.push('/learn/tr/library' as never)}>
              <Text style={styles.emptyButtonText}>رفتن به کتابخانهٔ درس‌ها</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable accessibilityRole="button" disabled={loading || !dueCards.length} style={[styles.startButton, (loading || !dueCards.length) && styles.disabled]} onPress={startSession}>
            <RefreshCw size={16} color="#FFFFFF" />
            <Text style={styles.startButtonText}>{loading ? 'در حال بارگذاری…' : 'شروع مرور امروز'}</Text>
          </Pressable>
        )}

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>برنامهٔ مرور چطور کار می‌کند؟</Text>
          <Text style={styles.noteText}>هر جمله پس از مرور، فاصلهٔ بعدی خودش را می‌گیرد: «فراموش کردم» زودتر، «آسان بود» دیرتر. این برنامه محلی است و به حساب شما وابسته نیست.</Text>
        </View>
      </ScrollView>
      <TurkishBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.canvas },
  content: { padding: 15, paddingBottom: 96, gap: 12 },
  topBar: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  brandEyebrow: { fontFamily: 'Inter-ExtraBold', color: '#A9665A', fontSize: 8, letterSpacing: 1.3, writingDirection: 'ltr' },
  pageTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 24, lineHeight: 36, textAlign: 'right', writingDirection: 'rtl' },
  pageIntro: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 12, lineHeight: 22, textAlign: 'right', writingDirection: 'rtl' },
  alert: { fontFamily: Typography.fontFamily, color: '#9B263C', backgroundColor: '#FFF5F6', borderWidth: 1, borderColor: '#F2D1D8', borderRadius: 12, padding: 11, fontSize: 11, lineHeight: 19, textAlign: 'right' },
  heroCard: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12, backgroundColor: Palette.surface, borderRadius: 20, borderWidth: 1, borderColor: Palette.border, padding: 15 },
  heroIcon: { width: 46, height: 46, borderRadius: 16, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  heroCopy: { alignItems: 'center', gap: 1, minWidth: 66 },
  heroValue: { fontFamily: Typography.numberFontFamily, color: Palette.ink, fontSize: 20 },
  heroLabel: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9 },
  heroDivider: { width: 1, height: 34, backgroundColor: Palette.border },
  successCard: { flexDirection: 'row-reverse', alignItems: 'center', gap: 9, backgroundColor: Palette.successSoft, borderRadius: 14, padding: 12 },
  successText: { flex: 1, fontFamily: Typography.fontFamily, color: Palette.success, fontSize: 11, lineHeight: 19, textAlign: 'right' },
  emptyCard: { backgroundColor: Palette.surface, borderRadius: 20, borderWidth: 1, borderColor: Palette.border, padding: 18, alignItems: 'center', gap: 8 },
  emptyTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 15, textAlign: 'center' },
  emptyText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 11, lineHeight: 20, textAlign: 'center' },
  emptyButton: { marginTop: 4, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: Palette.primarySoft },
  emptyButtonText: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 11 },
  startButton: { minHeight: 52, borderRadius: 16, backgroundColor: Palette.primary, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8 },
  startButtonText: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 13 },
  disabled: { opacity: 0.5 },
  noteCard: { backgroundColor: Palette.surface, borderRadius: 16, borderWidth: 1, borderColor: Palette.border, padding: 14, gap: 6 },
  noteTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 13, textAlign: 'right' },
  noteText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  sessionHeader: { padding: 15, paddingTop: 40, gap: 6, backgroundColor: Palette.surface, borderBottomWidth: 1, borderBottomColor: Palette.border },
  sessionTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 20, textAlign: 'right' },
  sessionSubtitle: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, textAlign: 'right' },
  sessionTrack: { height: 5, borderRadius: 3, backgroundColor: Palette.surfaceMuted, overflow: 'hidden', marginTop: 4 },
  sessionFill: { height: 5, backgroundColor: Palette.primary },
  sessionContent: { padding: 15, gap: 12 },
  recallLabel: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, textAlign: 'right' },
  reviewCard: { backgroundColor: Palette.surface, borderRadius: 22, borderWidth: 1, borderColor: Palette.border, padding: 18, gap: 10, alignItems: 'center' },
  reviewFa: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 18, lineHeight: 30, textAlign: 'center', writingDirection: 'rtl' },
  sayHint: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, textAlign: 'center' },
  revealButton: { minHeight: 44, paddingHorizontal: 22, borderRadius: 999, backgroundColor: Palette.primary, alignItems: 'center', justifyContent: 'center' },
  revealButtonText: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 12 },
  answerArea: { width: '100%', alignItems: 'center', gap: 7 },
  answerDivider: { width: '60%', height: 1, backgroundColor: Palette.border, marginVertical: 4 },
  reviewTurkish: { fontFamily: 'Inter-ExtraBold', color: Palette.ink, fontSize: 20, lineHeight: 30, textAlign: 'center', writingDirection: 'ltr' },
  reviewPronunciation: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 11, textAlign: 'center', writingDirection: 'rtl' },
  soundButton: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, backgroundColor: Palette.primarySoft },
  soundText: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 11 },
  speechError: { fontFamily: Typography.fontFamily, color: Palette.warning, fontSize: 9, textAlign: 'center' },
  ratingArea: { gap: 8 },
  ratingTitle: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 11, textAlign: 'right' },
  ratingGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  ratingButton: { flex: 1, minWidth: 130, borderRadius: 14, borderWidth: 1, backgroundColor: Palette.surface, paddingVertical: 11, alignItems: 'center', gap: 2 },
  ratingLabel: { fontFamily: Typography.fontFamily, fontSize: 12 },
  ratingHint: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9 },
});
