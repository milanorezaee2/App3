import { LocalizedText as Text } from '@/components/LocalizedText';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight, Award, CheckCircle2, ClipboardCheck, Dumbbell, Lock, RotateCcw } from 'lucide-react-native';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { ENGLISH_LEVEL_GRADIENTS } from '@/components/EnglishUI';
import { MiloGlobeHeadphoneMark } from '@/components/MiloBrandMark';
import { RussianBottomNav } from '@/components/RussianBottomNav';
import LessonPracticeBlock from '@/components/LessonPracticeBlock';
import { RUSSIAN_LESSONS, RUSSIAN_LEVELS, russianProgress, type RussianLevelId } from '@/lib/languages/russian';
import { ASSESSMENT_PASS_PERCENT, ASSESSMENT_QUESTIONS, SUPPLEMENT_QUESTIONS, buildLevelExam, buildLevelSupplement, levelPool, loadLevelAssessments, saveLevelAssessment, type LevelAssessmentState } from '@/lib/languages/russianLevelAssessment';
import { playRussianSpeech, stopRussianSpeech } from '@/lib/russianSpeech';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';
import type { PracticeStats } from '@/lib/lessonPractice';

type Mode = 'exam' | 'practice';

/**
 * «مسیر تکمیلی» for Russian — parallel to the English supplement/final-assessment pair:
 * per level, an end-of-level exam (scored, pass mark) and a daily supplementary round.
 */
export default function RussianLevelStudio() {
  const router = useRouter();
  const { level, mode } = useLocalSearchParams<{ level?: string; mode?: Mode }>();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [records, setRecords] = useState<LevelAssessmentState>({});
  const [running, setRunning] = useState<{ levelId: RussianLevelId; mode: Mode; attempt: number } | null>(null);
  const [result, setResult] = useState<{ levelId: RussianLevelId; mode: Mode; stats: PracticeStats; percent: number } | null>(null);

  useFocusEffect(useCallback(() => {
    let alive = true;
    void Promise.all([russianProgress.getCourseProgress(), loadLevelAssessments()]).then(([progress, state]) => {
      if (!alive) return;
      setCompleted(new Set(progress.completedLessonIds));
      setRecords(state);
    });
    return () => { alive = false; void stopRussianSpeech(); };
  }, []));

  useEffect(() => {
    const levelId = Number(level) as RussianLevelId;
    if (level !== undefined && mode && RUSSIAN_LEVELS.some(item => item.id === levelId)) {
      setRunning({ levelId, mode, attempt: (records[levelId]?.attempts ?? 0) + 1 });
    }
    // run only when the route params change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, mode]);

  const items = useMemo(() => running ? (running.mode === 'exam' ? buildLevelExam(running.levelId, running.attempt) : buildLevelSupplement(running.levelId)) : [], [running]);
  const pool = useMemo(() => running ? levelPool(running.levelId) : null, [running]);
  const speak = useCallback((text: string) => { void playRussianSpeech(text, 0.85, () => undefined); }, []);

  const finish = useCallback(async (stats: PracticeStats) => {
    if (!running) return;
    const percent = stats.total > 0 ? Math.round((stats.firstTryCorrect / stats.total) * 100) : 0;
    if (running.mode === 'exam') {
      const record = await saveLevelAssessment(running.levelId, percent);
      setRecords(value => ({ ...value, [running.levelId]: record }));
    }
    setResult({ levelId: running.levelId, mode: running.mode, stats, percent });
    setRunning(null);
  }, [running]);

  const start = (levelId: RussianLevelId, nextMode: Mode) => {
    setResult(null);
    setRunning({ levelId, mode: nextMode, attempt: (records[levelId]?.attempts ?? 0) + 1 });
  };

  if (running && pool) {
    const levelMeta = RUSSIAN_LEVELS.find(item => item.id === running.levelId)!;
    return (
      <View style={styles.root}>
        <View style={styles.brandRow}><MiloGlobeHeadphoneMark size={48} /><Pressable accessibilityRole="button" accessibilityLabel="بازگشت" style={styles.back} onPress={() => { setRunning(null); }}><ArrowRight size={19} color={Palette.ink} /></Pressable></View>
        <LinearGradient colors={ENGLISH_LEVEL_GRADIENTS[running.levelId]} start={{ x: .95, y: 0 }} end={{ x: .05, y: 1 }} style={styles.header}>
          <Text style={styles.headerTitle}>{running.mode === 'exam' ? 'آزمون پایان سطح' : 'تمرین تکمیلی امروز'}</Text>
          <Text style={styles.headerSub}>{levelMeta.title} · {levelMeta.cefr}</Text>
        </LinearGradient>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {running.mode === 'exam' ? <View style={styles.rulesCard}><Text style={styles.rulesTitle}>قانون آزمون</Text><Text style={styles.rulesText}>{fa(ASSESSMENT_QUESTIONS)} سؤال از همهٔ درس‌های این سطح، در قالب‌های مختلف. هر سؤال یک بار پرسیده می‌شود و فرصت دوباره ندارد. حد قبولی {fa(ASSESSMENT_PASS_PERCENT)}٪ است؛ هر بار آزمون، سؤال‌های تازه دارد.</Text></View> : null}
          <LessonPracticeBlock title={running.mode === 'exam' ? `آزمون سطح` : 'تمرین تکمیلی'} intro={running.mode === 'exam' ? `${fa(items.length)} سؤال؛ بدون فرصت دوباره.` : `${fa(SUPPLEMENT_QUESTIONS)} ضربه از جمله‌های این سطح؛ هر روز تازه می‌شود.`} items={items} source={pool} exam={running.mode === 'exam'} onSpeak={speak} onComplete={finish} foreignStyle={styles.foreign} accent={running.mode === 'exam' ? Palette.primary : Palette.success} />
        </ScrollView>
        <RussianBottomNav />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.brandRow}><MiloGlobeHeadphoneMark size={48} /><Pressable accessibilityRole="button" accessibilityLabel="بازگشت" style={styles.back} onPress={() => router.back()}><ArrowRight size={19} color={Palette.ink} /></Pressable></View>
      <View style={styles.pageHead}><Text style={styles.pageTitle}>مسیر تکمیلی روسی</Text><Text style={styles.pageSub}>آزمون پایان هر سطح + تمرین تکمیلی روزانه از جمله‌های همان سطح</Text></View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {result ? <View style={[styles.resultCard, result.mode === 'exam' && result.percent >= ASSESSMENT_PASS_PERCENT && styles.resultPass]}>
          <View style={styles.resultRow}>{result.mode === 'exam' && result.percent >= ASSESSMENT_PASS_PERCENT ? <Award size={26} color={Palette.success} /> : <CheckCircle2 size={26} color={Palette.primaryDark} />}<Text style={styles.resultTitle}>{result.mode === 'exam' ? (result.percent >= ASSESSMENT_PASS_PERCENT ? 'قبول شدید!' : 'این بار قبول نشدید') : 'تمرین امروز تمام شد'}</Text></View>
          <Text style={styles.resultText}>{fa(result.stats.firstTryCorrect)} از {fa(result.stats.total)} درست · {fa(result.percent)}٪{result.stats.seconds ? ` · ${fa(result.stats.seconds)} ثانیه` : ''}</Text>
          {result.mode === 'exam' && result.percent < ASSESSMENT_PASS_PERCENT ? <Text style={styles.resultHint}>درس‌های این سطح را مرور کنید و دوباره امتحان دهید؛ سؤال‌ها هر بار تازه‌اند.</Text> : null}
        </View> : null}
        {RUSSIAN_LEVELS.map(levelMeta => {
          const lessons = RUSSIAN_LESSONS.filter(lesson => lesson.levelId === levelMeta.id);
          const done = lessons.filter(lesson => completed.has(lesson.id)).length;
          const record = records[levelMeta.id];
          const passed = !!record?.passedAt;
          const ready = done >= Math.ceil(lessons.length * 0.5);
          return (
            <View key={levelMeta.id} style={styles.levelCard}>
              <LinearGradient colors={ENGLISH_LEVEL_GRADIENTS[levelMeta.id]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={styles.levelStripe} />
              <View style={styles.levelHead}>
                <View style={styles.levelCopy}><Text style={styles.levelTitle}>{levelMeta.title}</Text><Text style={styles.levelMeta}>{levelMeta.cefr} · {fa(done)} از {fa(lessons.length)} درس</Text></View>
                {passed ? <View style={styles.badge}><Award size={14} color="#92400E" /><Text style={styles.badgeText}>قبول · {fa(record!.bestPercent)}٪</Text></View> : record ? <View style={[styles.badge, styles.badgeMuted]}><Text style={styles.badgeMutedText}>آخرین: {fa(record.lastPercent)}٪</Text></View> : null}
              </View>
              <View style={styles.actions}>
                <Pressable accessibilityRole="button" disabled={!ready} onPress={() => start(levelMeta.id, 'exam')} style={[styles.action, styles.actionExam, !ready && styles.actionDisabled]}>
                  {ready ? (passed ? <RotateCcw size={16} color="#FFFFFF" /> : <ClipboardCheck size={16} color="#FFFFFF" />) : <Lock size={16} color="#FFFFFF" />}
                  <Text style={styles.actionText}>{passed ? 'آزمون دوباره' : 'آزمون پایان سطح'}</Text>
                </Pressable>
                <Pressable accessibilityRole="button" disabled={done === 0} onPress={() => start(levelMeta.id, 'practice')} style={[styles.action, styles.actionPractice, done === 0 && styles.actionDisabled]}>
                  <Dumbbell size={16} color={Palette.success} />
                  <Text style={[styles.actionText, { color: Palette.success }]}>تمرین تکمیلی امروز</Text>
                </Pressable>
              </View>
              {!ready ? <Text style={styles.lockHint}>آزمون بعد از تکمیل نیمی از درس‌های سطح باز می‌شود.</Text> : null}
            </View>
          );
        })}
      </ScrollView>
      <RussianBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.canvas },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 10 },
  back: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  header: { marginHorizontal: 16, marginTop: 8, borderRadius: 22, padding: 18, gap: 4 },
  headerTitle: { fontFamily: Typography.fontFamily, fontSize: 20, color: '#FFFFFF', textAlign: 'right', writingDirection: 'rtl' },
  headerSub: { fontFamily: 'Times New Roman', fontWeight: '800', fontSize: 12, color: 'rgba(255,255,255,0.85)', textAlign: 'right' },
  pageHead: { paddingHorizontal: 20, paddingTop: 10, gap: 4 },
  pageTitle: { fontFamily: Typography.fontFamily, fontSize: 22, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  pageSub: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: Palette.text, textAlign: 'right', writingDirection: 'rtl' },
  content: { padding: 16, paddingBottom: 110, gap: 12 },
  rulesCard: { borderRadius: 18, backgroundColor: Palette.primarySoft, borderWidth: 1, borderColor: '#DDE2FF', padding: 16, gap: 6 },
  rulesTitle: { fontFamily: Typography.fontFamily, fontSize: 14, color: Palette.primaryDark, textAlign: 'right', writingDirection: 'rtl' },
  rulesText: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 21, color: Palette.text, textAlign: 'right', writingDirection: 'rtl' },
  foreign: { fontFamily: 'Times New Roman', fontWeight: '800' },
  resultCard: { borderRadius: 20, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, padding: 18, gap: 6 },
  resultPass: { borderColor: Palette.success, backgroundColor: Palette.successSoft },
  resultRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  resultTitle: { fontFamily: Typography.fontFamily, fontSize: 18, color: Palette.ink },
  resultText: { fontFamily: Typography.fontFamily, fontSize: 14, color: Palette.primaryDark, textAlign: 'right', writingDirection: 'rtl' },
  resultHint: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: Palette.text, textAlign: 'right', writingDirection: 'rtl' },
  levelCard: { borderRadius: 20, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, padding: 16, gap: 12, overflow: 'hidden' },
  levelStripe: { position: 'absolute', top: 0, right: 0, left: 0, height: 5 },
  levelHead: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  levelCopy: { flex: 1, gap: 3 },
  levelTitle: { fontFamily: 'Times New Roman', fontWeight: '800', fontSize: 15, color: Palette.ink, textAlign: 'right' },
  levelMeta: { fontFamily: Typography.fontFamily, fontSize: 12, color: Palette.text, textAlign: 'right', writingDirection: 'rtl' },
  badge: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FCD34D' },
  badgeText: { fontFamily: Typography.fontFamily, fontSize: 11, color: '#92400E' },
  badgeMuted: { backgroundColor: Palette.surfaceMuted, borderColor: Palette.border },
  badgeMutedText: { fontFamily: Typography.fontFamily, fontSize: 11, color: Palette.text },
  actions: { flexDirection: 'row-reverse', gap: 10 },
  action: { flex: 1, minHeight: 46, borderRadius: 14, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 10 },
  actionExam: { backgroundColor: Palette.primary },
  actionPractice: { backgroundColor: Palette.successSoft, borderWidth: 1, borderColor: '#BBF7D0' },
  actionDisabled: { opacity: 0.45 },
  actionText: { fontFamily: Typography.fontFamily, fontSize: 13, color: '#FFFFFF' },
  lockHint: { fontFamily: Typography.fontFamily, fontSize: 11, color: '#8A929E', textAlign: 'right', writingDirection: 'rtl' },
});
