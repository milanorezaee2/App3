import { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, CheckCircle2, Flame, RefreshCw, Trophy } from 'lucide-react-native';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { Typography } from '@/lib/theme';
import { toPersianDigits as fa } from '@/lib/format';
import { hapticTap } from '@/lib/haptics';

export interface CelebrationStats {
  sentences: number;
  practiceTotal: number;
  practiceFirstTry: number;
  practiceSeconds: number;
  /** Average speaking-check score (0–100) when the learner did it. */
  speakingAverage?: number;
  /** Short-assessment result when the learner answered it. */
  assessmentCorrect?: number;
  assessmentTotal?: number;
  streak: number;
  /** True when this lesson is the one that extended the streak today. */
  streakExtendedToday: boolean;
}

interface Props {
  visible: boolean;
  lessonTitle: string;
  stats: CelebrationStats;
  hasNextLesson: boolean;
  onContinue: () => void;
  /** Spaced-repetition cards that are due right now; shows a short review suggestion when > 0. */
  dueReviews?: number;
  onReview?: () => void;
  /** Set when this lesson was the last one of its level: offers the full level warm-up. */
  levelFinished?: { title: string; lessons: number; onStart: () => void };
}

/** Shown once a lesson is saved as complete; the next lesson opens only when the learner taps. */
export default function LessonCelebration({ visible, lessonTitle, stats, hasNextLesson, onContinue, dueReviews = 0, onReview, levelFinished }: Props) {
  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!visible) { scale.setValue(0.7); opacity.setValue(0); return; }
    hapticTap();
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 260, useNativeDriver: true }),
    ]).start();
  }, [visible, scale, opacity]);


  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onContinue}>
      <View style={styles.backdrop}>
        <Animated.View style={[styles.card, { opacity, transform: [{ scale }] }]}>
          <View style={styles.icon}><CheckCircle2 size={44} color={Palette.success} /></View>
          <Text style={styles.title}>آفرین!</Text>
          <Text style={styles.subtitle}>درس «{lessonTitle}» تمام شد.</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}><Text style={styles.statValue}>{fa(stats.sentences)}</Text><Text style={styles.statLabel}>جمله</Text></View>
            {stats.practiceTotal > 0 ? <View style={styles.stat}><Text style={styles.statValue}>{fa(stats.practiceFirstTry)}/{fa(stats.practiceTotal)}</Text><Text style={styles.statLabel}>چالش</Text></View> : null}
            {stats.practiceSeconds > 0 ? <View style={styles.stat}><Text style={styles.statValue}>{fa(stats.practiceSeconds)}</Text><Text style={styles.statLabel}>ثانیه</Text></View> : null}
            {typeof stats.speakingAverage === 'number' ? <View style={styles.stat}><Text style={styles.statValue}>{fa(stats.speakingAverage)}٪</Text><Text style={styles.statLabel}>گفتاری</Text></View> : null}
            {stats.assessmentTotal ? <View style={styles.stat}><Text style={styles.statValue}>{fa(stats.assessmentCorrect ?? 0)}/{fa(stats.assessmentTotal)}</Text><Text style={styles.statLabel}>سنجش</Text></View> : null}
          </View>
          <View style={styles.streakPill}>
            <Flame size={16} color="#D97706" />
            <Text style={styles.streakText}>{stats.streak > 0 ? `روز ${fa(stats.streak)} پیاپی ✓` : 'روز اول ✓'}</Text>
          </View>
          <Text style={styles.streakHint}>{stats.streakExtendedToday ? 'فردا هم یک درس بخوان تا شمارنده ادامه پیدا کند.' : 'امروز قبلاً حساب شده؛ ادامه بده.'}</Text>
          {levelFinished ? <View style={styles.levelBox}>
            <View style={styles.levelHead}><Trophy size={18} color="#B45309" /><Text style={styles.levelTitle}>سطح «{levelFinished.title}» تمام شد!</Text></View>
            <Text style={styles.levelText}>قبل از رفتن به سطح بعد، یک گرم‌کردن کامل: از هر {fa(levelFinished.lessons)} درس این سطح یک ضربه، به ترتیب.</Text>
            <Pressable accessibilityRole="button" onPress={levelFinished.onStart} style={styles.levelButton}><Flame size={16} color="#FFFFFF" /><Text style={styles.levelButtonText}>گرم‌کردن کامل سطح</Text></Pressable>
          </View> : null}
          {dueReviews > 0 && onReview ? <Pressable accessibilityRole="button" onPress={onReview} style={styles.reviewButton}>
            <RefreshCw size={16} color={Palette.primaryDark} />
            <Text style={styles.reviewText}>{`مرور ${fa(dueReviews)} کارت سررسید · حدود ${fa(Math.max(1, Math.ceil(dueReviews / 4)))} دقیقه`}</Text>
          </Pressable> : null}
          <Pressable accessibilityRole="button" onPress={onContinue} style={styles.button}>
            <Text style={styles.buttonText}>{hasNextLesson ? 'درس بعدی' : 'بازگشت به سطح‌ها'}</Text>
            <ArrowLeft size={18} color="#FFFFFF" />
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 380, maxHeight: '90%', borderRadius: 24, backgroundColor: '#FFFFFF', padding: 24, alignItems: 'center', gap: 10 },
  icon: { width: 76, height: 76, borderRadius: 38, backgroundColor: Palette.successSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  title: { fontFamily: Typography.fontFamily, fontSize: 26, color: Palette.ink, textAlign: 'center' },
  subtitle: { fontFamily: Typography.fontFamily, fontSize: 13, lineHeight: 22, color: Palette.text, textAlign: 'center', writingDirection: 'rtl' },
  statsRow: { flexDirection: 'row-reverse', gap: 10, marginTop: 8, width: '100%', justifyContent: 'center' },
  stat: { minWidth: 86, borderRadius: 16, backgroundColor: Palette.surfaceMuted, paddingVertical: 12, paddingHorizontal: 10, alignItems: 'center', gap: 2 },
  statValue: { fontFamily: Typography.fontFamily, fontSize: 22, color: Palette.primaryDark },
  statLabel: { fontFamily: Typography.fontFamily, fontSize: 12, color: Palette.text },
  streakPill: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, marginTop: 10, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 999, backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FCD34D' },
  streakText: { fontFamily: Typography.fontFamily, fontSize: 14, color: '#92400E' },
  levelBox: { marginTop: 12, width: '100%', borderRadius: 16, backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FCD34D', padding: 12, gap: 8 },
  levelHead: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  levelTitle: { fontFamily: Typography.fontFamily, fontSize: 14, color: '#92400E', writingDirection: 'rtl' },
  levelText: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: '#78350F', textAlign: 'right', writingDirection: 'rtl' },
  levelButton: { minHeight: 44, borderRadius: 12, backgroundColor: '#D97706', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8 },
  levelButtonText: { fontFamily: Typography.fontFamily, fontSize: 14, color: '#FFFFFF' },
  reviewButton: { marginTop: 12, width: '100%', minHeight: 46, borderRadius: 14, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Palette.primarySoft, borderWidth: 1, borderColor: '#DDE2FF' },
  reviewText: { fontFamily: Typography.fontFamily, fontSize: 13, color: Palette.primaryDark, writingDirection: 'rtl' },
  streakHint: { fontFamily: Typography.fontFamily, fontSize: 11, lineHeight: 18, color: '#8A929E', textAlign: 'center', writingDirection: 'rtl' },
  button: { marginTop: 14, width: '100%', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Palette.primary, borderRadius: 16, paddingVertical: 14 },
  buttonText: { fontFamily: Typography.fontFamily, fontSize: 15, color: '#FFFFFF' },
});
