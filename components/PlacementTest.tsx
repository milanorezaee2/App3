import { LocalizedText as Text } from '@/components/LocalizedText';
import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowRight, Compass, Flag, Play, SkipForward } from 'lucide-react-native';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { MiloGlobeHeadphoneMark } from '@/components/MiloBrandMark';
import LessonPracticeBlock from '@/components/LessonPracticeBlock';
import type { LevelStudioConfig } from '@/components/LanguageLevelStudio';
import { levelPool } from '@/lib/levelAssessment';
import { ROUND_PASS, ROUND_SIZE, buildPlacementRound, firstLessonOf, placementLevels, savePlacement } from '@/lib/placement';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';
import type { PracticeStats } from '@/lib/lessonPractice';

export interface PlacementConfig extends LevelStudioConfig {
  /** Makes the placed lesson the course's current lesson. */
  setCurrentLesson: (lessonId: string) => Promise<unknown>;
  /** Route of the course home, e.g. '/learn/ru'. */
  homeHref: string;
}

type Phase = { kind: 'intro' } | { kind: 'round'; index: number } | { kind: 'done'; levelIndex: number; passed: boolean; answered: number; correct: number };

/** «تعیین سطح ورودی» — short adaptive test that picks the starting lesson of a course. */
export default function PlacementTest({ config }: { config: PlacementConfig }): ReactElement {
  const { courseId, nameFa, levels: allLevels, lessons, speak, stopSpeech, setCurrentLesson, homeHref, foreignFontFamily } = config;
  const router = useRouter();
  const levels = useMemo(() => placementLevels(allLevels, lessons), [allLevels, lessons]);
  const [phase, setPhase] = useState<Phase>({ kind: 'intro' });
  const [tally, setTally] = useState({ answered: 0, correct: 0 });
  const [attempt] = useState(() => Date.now() % 1000);
  const [saved, setSaved] = useState(false);

  useEffect(() => () => stopSpeech(), [stopSpeech]);

  const round = phase.kind === 'round' ? phase.index : -1;
  const level = round >= 0 ? levels[round] : null;
  const pool = useMemo(() => level ? levelPool(courseId, lessons, level.id) : null, [courseId, lessons, level]);
  const items = useMemo(() => level ? buildPlacementRound(courseId, lessons, level.id, attempt + round) : [], [courseId, lessons, level, attempt, round]);

  const finishRound = useCallback((stats: PracticeStats) => {
    const answered = tally.answered + stats.total;
    const correct = tally.correct + stats.firstTryCorrect;
    setTally({ answered, correct });
    const passed = stats.firstTryCorrect >= ROUND_PASS;
    if (passed && round < levels.length - 1) { setPhase({ kind: 'round', index: round + 1 }); return; }
    // Failed this level → start here; passed the last one → start at the last level.
    setPhase({ kind: 'done', levelIndex: round, passed, answered, correct });
  }, [tally, round, levels.length]);

  // Failed the very first round → start from the course's first lesson (which may be Pre-A1).
  const startFromBeginning = phase.kind === 'done' && phase.levelIndex === 0 && !phase.passed;
  const placedLesson = phase.kind === 'done' ? (startFromBeginning ? lessons[0] : firstLessonOf(lessons, levels[phase.levelIndex].id)) : undefined;
  const placedLevel = placedLesson ? allLevels.find(item => item.id === placedLesson.levelId) ?? null : null;

  useEffect(() => {
    if (phase.kind !== 'done' || !placedLevel || !placedLesson || saved) return;
    setSaved(true);
    void Promise.all([
      savePlacement(courseId, { status: 'placed', levelId: placedLevel.id, lessonId: placedLesson.id, answered: phase.answered, correct: phase.correct }),
      setCurrentLesson(placedLesson.id).catch(() => undefined),
    ]);
  }, [phase, placedLevel, placedLesson, saved, courseId, setCurrentLesson]);

  const skip = () => { void savePlacement(courseId, { status: 'skipped' }).then(() => router.replace(homeHref as never)); };
  const foreignStyle = [styles.foreign, foreignFontFamily ? { fontFamily: foreignFontFamily } : null];

  return (
    <View style={styles.root}>
      <View style={styles.brandRow}>
        <MiloGlobeHeadphoneMark size={48} />
        <Pressable accessibilityRole="button" accessibilityLabel="بازگشت" style={styles.back} onPress={() => { stopSpeech(); router.replace(homeHref as never); }}><ArrowRight size={20} color={Palette.ink} /></Pressable>
      </View>
      <LinearGradient colors={['#635BFF', '#4338CA']} start={{ x: .95, y: 0 }} end={{ x: .05, y: 1 }} style={styles.header}>
        <Text style={styles.headerTitle}>تعیین سطح {nameFa}</Text>
        <Text style={styles.headerSub}>{phase.kind === 'round' && level ? `مرحلهٔ ${fa(round + 1)} از ${fa(levels.length)} · ${level.title} · ${level.cefr}` : `حداکثر ${fa(levels.length * ROUND_SIZE)} سؤال · حدود ${fa(3)} دقیقه`}</Text>
        {phase.kind === 'round' ? <View style={styles.steps}>{levels.map((item, index) => <View key={item.id} style={[styles.step, index < round && styles.stepDone, index === round && styles.stepNow]} />)}</View> : null}
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {phase.kind === 'intro' ? (
          <View style={styles.card}>
            <View style={styles.row}><Compass size={20} color={Palette.primaryDark} /><Text style={styles.cardTitle}>از کجا شروع کنیم؟</Text></View>
            <Text style={styles.cardText}>چند سؤال کوتاه از هر سطح، از آسان به سخت. هر سطح {fa(ROUND_SIZE)} سؤال دارد؛ با {fa(ROUND_PASS)} پاسخ درست به سطح بعد می‌روید و اولین سطحی که در آن بلغزید، نقطهٔ شروع شماست.</Text>
            <Text style={styles.cardText}>هیچ درسی قفل یا رد نمی‌شود؛ فقط «درس فعلی» شما جابه‌جا می‌شود و هر وقت بخواهید می‌توانید از ابتدا شروع کنید.</Text>
            <Pressable accessibilityRole="button" style={({ pressed }) => [styles.primary, pressed && styles.pressed]} onPress={() => setPhase({ kind: 'round', index: 0 })}>
              <Play size={16} color="#FFFFFF" fill="#FFFFFF" /><Text style={styles.primaryText}>شروع آزمون</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={({ pressed }) => [styles.secondary, pressed && styles.pressed]} onPress={skip}>
              <SkipForward size={16} color={Palette.text} /><Text style={styles.secondaryText}>از اولین درس شروع می‌کنم</Text>
            </Pressable>
          </View>
        ) : null}

        {phase.kind === 'round' && pool && level ? (
          <LessonPracticeBlock key={`${level.id}-${round}`} title={`سطح ${level.cefr}`} intro={`${fa(items.length)} سؤال؛ بدون فرصت دوباره.`} items={items} source={pool} exam onSpeak={speak} onComplete={finishRound} foreignStyle={foreignStyle} accent={Palette.primary} />
        ) : null}

        {phase.kind === 'done' && placedLevel ? (
          <View style={[styles.card, styles.cardResult]}>
            <View style={styles.row}><Flag size={20} color={Palette.success} /><Text style={styles.cardTitle}>نقطهٔ شروع شما: {placedLevel.title} · {placedLevel.cefr}</Text></View>
            <Text style={styles.cardText}>{fa(phase.correct)} پاسخ درست از {fa(phase.answered)} سؤال.{phase.passed ? ' همهٔ مراحل را گذراندید؛ از بالاترین سطح موجود شروع می‌کنید.' : startFromBeginning ? ' از ابتدای دوره شروع می‌کنید؛ پایه را محکم می‌سازیم.' : ''}</Text>
            {placedLesson ? <Text style={styles.cardText}>درس فعلی: «{placedLesson.title}». درس‌های قبلی همچنان باز هستند.</Text> : null}
            <Pressable accessibilityRole="button" style={({ pressed }) => [styles.primary, pressed && styles.pressed]} onPress={() => { stopSpeech(); router.replace(homeHref as never); }}>
              <Play size={16} color="#FFFFFF" fill="#FFFFFF" /><Text style={styles.primaryText}>رفتن به درس</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.canvas },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 10 },
  back: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  header: { marginHorizontal: 16, marginTop: 8, borderRadius: 22, padding: 18, gap: 6 },
  headerTitle: { fontFamily: Typography.fontFamily, fontSize: 20, color: '#FFFFFF', textAlign: 'right', writingDirection: 'rtl' },
  headerSub: { fontFamily: Typography.fontFamily, fontSize: 12, color: 'rgba(255,255,255,0.88)', textAlign: 'right', writingDirection: 'rtl' },
  steps: { flexDirection: 'row-reverse', gap: 6, marginTop: 6 },
  step: { flex: 1, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)' },
  stepDone: { backgroundColor: '#A7F3D0' },
  stepNow: { backgroundColor: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 60, gap: 12 },
  card: { borderRadius: 20, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, padding: 18, gap: 12 },
  cardResult: { borderColor: Palette.success, backgroundColor: Palette.successSoft },
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  cardTitle: { flex: 1, fontFamily: Typography.fontFamily, fontSize: 16, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  cardText: { fontFamily: Typography.fontFamily, fontSize: 13, lineHeight: 22, color: Palette.text, textAlign: 'right', writingDirection: 'rtl' },
  primary: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 13, backgroundColor: Palette.primary },
  primaryText: { fontFamily: Typography.fontFamily, fontSize: 14, color: '#FFFFFF' },
  secondary: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 12, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border },
  secondaryText: { fontFamily: Typography.fontFamily, fontSize: 13, color: Palette.text },
  pressed: { opacity: 0.85 },
  foreign: { fontFamily: 'Times New Roman', fontWeight: '800' },
});
