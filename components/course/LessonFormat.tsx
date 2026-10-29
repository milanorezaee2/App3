import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BookOpenCheck,
  Check,
  ChevronLeft,
  Headphones,
  MessageCircle,
  Mic2,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Volume2,
} from 'lucide-react-native';
import { PageNavigation } from '@/components/PageNavigation';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { Colors, Radius, Spacing, Typography } from '@/lib/theme';
import { toPersianDigits as fa } from '@/lib/format';
import { COURSE_LESSON_STAGES, type FormatCheck, type FormatLesson, type FormatSentence } from '@/lib/languages/courseFormat';

/**
 * The one lesson player used by every language path.
 *
 * Header, nine-stage stepper, stage frames and footer live here so English,
 * German and Russian cannot drift apart visually or pedagogically. Languages
 * only supply their own sentences, builders, dialogues and self-checks.
 */
export const lessonStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.canvas },
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
  noteCard: { width: '100%', marginTop: Spacing.md, borderRadius: Radius.lg, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, padding: Spacing.md, gap: Spacing.sm },
  noteTitle: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: Typography.sizes.sm + 2, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  noteText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: Typography.sizes.sm + 2, lineHeight: 25, textAlign: 'right', writingDirection: 'rtl' },
  sentenceStage: { alignItems: 'center', paddingTop: Spacing.lg, width: '100%' },
  counter: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, fontWeight: '400', color: Palette.muted, marginBottom: Spacing.md, alignSelf: 'flex-end', textAlign: 'right', writingDirection: 'rtl' },
  sentenceCard: { width: '100%', borderRadius: Radius.xl, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, padding: Spacing.xl, alignItems: 'center', shadowColor: '#172033', shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  soundButton: { width: 54, height: 54, borderRadius: 27, backgroundColor: Palette.primary, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  target: { fontFamily: 'Inter-ExtraBold', width: '100%', fontSize: 25, lineHeight: 36, fontWeight: '800', color: Palette.ink, textAlign: 'right', writingDirection: 'ltr' },
  pronunciation: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm + 2, fontWeight: '400', color: Palette.primaryDark, textAlign: 'center', marginTop: 8 },
  divider: { width: '70%', height: 1, backgroundColor: Palette.border, marginVertical: Spacing.lg },
  persian: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.lg + 2, fontWeight: '400', color: Palette.text, textAlign: 'right', writingDirection: 'rtl', alignSelf: 'stretch' },
  pattern: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'flex-start', gap: 8, alignSelf: 'flex-end', backgroundColor: Palette.warningSoft, paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.full, marginTop: Spacing.md },
  patternLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, fontWeight: '400', color: Palette.warning, writingDirection: 'rtl' },
  patternText: { fontFamily: 'Inter-ExtraBold', fontSize: Typography.sizes.xs + 2, fontWeight: '800', color: Palette.warning, textAlign: 'right', writingDirection: 'ltr' },
  hint: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, fontWeight: '400', color: Palette.muted, textAlign: 'right', writingDirection: 'rtl', lineHeight: 19, marginTop: Spacing.md },
  listenList: { width: '100%', gap: Spacing.sm, marginTop: Spacing.xl },
  listenRow: { minHeight: 62, borderRadius: Radius.lg, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, paddingHorizontal: Spacing.md, flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.sm },
  listenRowActive: { borderColor: Palette.primary, backgroundColor: Palette.primarySoft },
  listenNumber: { width: 30, height: 30, borderRadius: 15, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  listenNumberText: { fontFamily: Typography.numberFontFamily, fontSize: Typography.sizes.xs + 2, fontWeight: '400', color: Palette.primaryDark, writingDirection: 'rtl' },
  listenTarget: { fontFamily: 'Inter-ExtraBold', flex: 1, fontSize: 15, fontWeight: '800', color: Palette.ink, textAlign: 'right', writingDirection: 'ltr' },
  shadowTip: { width: '100%', marginTop: Spacing.md, borderRadius: Radius.lg, backgroundColor: Palette.warningSoft, padding: Spacing.md, flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  shadowText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, fontWeight: '400', color: Palette.text, textAlign: 'right', writingDirection: 'rtl', lineHeight: 19 },
  speechPractice: { width: '100%', borderRadius: Radius.xl, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, padding: Spacing.lg, alignItems: 'center', marginTop: Spacing.lg, shadowColor: '#172033', shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  speechTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md + 2, fontWeight: '400', color: Palette.ink, textAlign: 'right', writingDirection: 'rtl', alignSelf: 'stretch' },
  speechSentence: { fontFamily: 'Inter-ExtraBold', width: '100%', fontSize: 19, lineHeight: 28, fontWeight: '800', color: Palette.ink, textAlign: 'right', writingDirection: 'ltr', marginTop: Spacing.sm },
  speechHint: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, fontWeight: '400', color: Palette.muted, textAlign: 'right', writingDirection: 'rtl', alignSelf: 'stretch', lineHeight: 19, marginTop: 6 },
  recordButton: { minHeight: 48, minWidth: 155, borderRadius: Radius.full, paddingHorizontal: Spacing.lg, backgroundColor: Palette.primary, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: Spacing.md },
  recordButtonActive: { backgroundColor: Palette.danger },
  recordButtonDisabled: { opacity: .55 },
  recordButtonText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm + 2, fontWeight: '400', color: Colors.onColor, writingDirection: 'rtl' },
  dots: { flexDirection: 'row', gap: 8, marginTop: Spacing.lg },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: Palette.border },
  dotActive: { width: 24, backgroundColor: Palette.primary },
  vocabList: { width: '100%', gap: Spacing.sm, marginTop: Spacing.xl },
  vocabCard: { width: '100%', borderRadius: Radius.lg, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, padding: Spacing.md, gap: 6 },
  vocabTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  vocabWord: { fontFamily: 'Inter-ExtraBold', fontSize: 18, fontWeight: '800', color: Palette.ink, textAlign: 'right', writingDirection: 'ltr' },
  vocabMeaning: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm + 2, fontWeight: '400', color: Palette.primaryDark, textAlign: 'right', writingDirection: 'rtl' },
  vocabExample: { fontFamily: 'Inter-ExtraBold', fontSize: 13, fontWeight: '800', color: Palette.text, textAlign: 'right', writingDirection: 'ltr', marginTop: 8 },
  vocabExampleFa: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, lineHeight: 19, color: Palette.muted, textAlign: 'right', writingDirection: 'rtl' },
  bubbleSound: { alignSelf: 'flex-end', marginTop: 4, padding: 5 },
  summaryRow: { flexDirection: 'row-reverse', gap: 8, marginTop: Spacing.md, flexWrap: 'wrap' },
  summaryChip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, borderRadius: Radius.full, backgroundColor: Palette.primarySoft, paddingHorizontal: 10, paddingVertical: 6 },
  summaryChipText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, color: Palette.primaryDark, writingDirection: 'rtl' },
  evidenceCard: { width: '100%', marginTop: Spacing.lg, borderRadius: Radius.xl, padding: Spacing.md, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: Spacing.sm },
  evidenceTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md + 2, fontWeight: '400', color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  evidenceIntro: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, lineHeight: 19, color: Palette.text, textAlign: 'right', writingDirection: 'rtl' },
  question: { gap: 9, marginTop: 5 },
  questionPrompt: { fontFamily: Typography.fontFamily, fontSize: 13, lineHeight: 22, color: Palette.text, textAlign: 'right', writingDirection: 'rtl' },
  choice: { minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, paddingHorizontal: 13, paddingVertical: 11, justifyContent: 'center' },
  choiceSelected: { borderColor: Palette.primary, backgroundColor: Palette.primarySoft },
  choiceCorrect: { borderColor: Palette.success, backgroundColor: Palette.successSoft },
  choiceTarget: { fontFamily: 'Inter-ExtraBold', fontSize: 12, fontWeight: '800', lineHeight: 21, color: Palette.ink, textAlign: 'right', writingDirection: 'ltr' },
  choicePersian: { fontFamily: Typography.fontFamily, fontSize: 13, lineHeight: 21, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  feedbackBox: { borderRadius: 12, padding: 12, backgroundColor: Palette.surfaceMuted, gap: 5 },
  feedbackTitle: { fontFamily: Typography.fontFamily, color: Palette.success, fontSize: 12, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  feedbackError: { fontFamily: Typography.fontFamily, color: Palette.danger, fontSize: 12, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  feedbackText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: Typography.sizes.xs + 2, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  retryAnswer: { alignSelf: 'flex-start', paddingVertical: 6 },
  retryAnswerText: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: Typography.sizes.xs + 2, fontWeight: '400', writingDirection: 'rtl' },
  showAnswersButton: { minHeight: 45, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surface, marginTop: 4 },
  showAnswersText: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 12, fontWeight: '400', writingDirection: 'rtl' },
  evidenceNote: { fontFamily: Typography.fontFamily, color: Palette.success, fontSize: Typography.sizes.xs + 2, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  error: { width: '100%', marginTop: Spacing.sm, padding: 12, borderRadius: 12, backgroundColor: Palette.dangerSoft, color: Palette.danger, fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  notice: { width: '100%', marginTop: Spacing.sm, padding: 11, borderRadius: 12, backgroundColor: Palette.warningSoft, color: Palette.warning, fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  resumeCard: { width: '100%', borderRadius: Radius.lg, backgroundColor: Palette.primarySoft, borderWidth: 1, borderColor: '#DDE2FF', padding: Spacing.md, gap: 6, marginBottom: Spacing.sm },
  resumePill: { alignSelf: 'flex-start', color: Palette.primaryDark, fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, fontWeight: '400', writingDirection: 'rtl' },
  resumeText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs + 2, lineHeight: 19, color: Palette.text, textAlign: 'right', writingDirection: 'rtl' },
  footer: { width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: 15, paddingTop: 7, paddingBottom: 30, backgroundColor: Palette.canvas, borderTopWidth: 1, borderTopColor: Palette.border, shadowColor: '#20264A', shadowOpacity: .07, shadowRadius: 12, shadowOffset: { width: 0, height: -4 }, elevation: 5 },
  nextButton: { width: '100%', maxWidth: 900, alignSelf: 'center', minHeight: 54, borderRadius: 17, backgroundColor: Palette.primary, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: Palette.primary, shadowOpacity: .2, shadowRadius: 9, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  nextButtonDisabled: { opacity: .45 },
  nextText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md + 2, fontWeight: '400', color: Colors.onColor, writingDirection: 'rtl' },
});

export function LessonHeader({
  levelLabel, title, stageIndex, infoLabel, sentenceCount, gradient,
}: {
  levelLabel: string;
  title: string;
  stageIndex: number;
  infoLabel: string;
  sentenceCount: number;
  gradient: readonly [string, string];
}) {
  const percent = Math.round(((stageIndex + 1) / COURSE_LESSON_STAGES.length) * 100);
  return (
    <LinearGradient colors={gradient} start={{ x: .95, y: 0 }} end={{ x: .05, y: 1 }} style={lessonStyles.header}>
      <View style={lessonStyles.headerTop}>
        <PageNavigation tone="dark" backFallback="/languages" />
        <View style={lessonStyles.headerText}>
          <Text style={lessonStyles.headerEyebrow}>{levelLabel}</Text>
          <Text style={lessonStyles.headerTitle}>{title}</Text>
          <Text style={lessonStyles.headerSub}>{COURSE_LESSON_STAGES[stageIndex].labelFa} · مرحله {fa(stageIndex + 1)} از {fa(COURSE_LESSON_STAGES.length)}</Text>
        </View>
        <View style={lessonStyles.percentBadge}>
          <Text style={lessonStyles.percent}>{fa(percent)}٪</Text>
          <Text style={lessonStyles.percentLabel}>پیشرفت</Text>
        </View>
      </View>
      <View style={lessonStyles.headerBottom}>
        <View style={lessonStyles.headerInfoChip}><BookOpenCheck size={13} color="#D9DBFF" /><Text style={lessonStyles.headerInfoText}>{infoLabel}</Text></View>
        <Text style={lessonStyles.headerInfoText}>{fa(sentenceCount)} جملهٔ اصلی</Text>
      </View>
    </LinearGradient>
  );
}

export function LessonStepper({ stageIndex }: { stageIndex: number }) {
  return (
    <View style={lessonStyles.stepperCard}>
      <View style={lessonStyles.stepperHeading}>
        <View>
          <Text style={lessonStyles.stepperEyebrow}>LESSON FLOW · 09 STAGES</Text>
          <Text style={lessonStyles.stepperTitle}>جریان این درس</Text>
        </View>
        <View style={lessonStyles.stepperNow}>
          <Text style={lessonStyles.stepperNowEn}>{COURSE_LESSON_STAGES[stageIndex].labelEn}</Text>
          <Text style={lessonStyles.stepperNowFa}>{COURSE_LESSON_STAGES[stageIndex].labelFa}</Text>
        </View>
      </View>
      <View style={lessonStyles.stepSegments}>
        {COURSE_LESSON_STAGES.map((item, index) => (
          <View
            key={item.id}
            accessibilityLabel={`${item.labelEn} ${index + 1} از ${COURSE_LESSON_STAGES.length}`}
            style={[lessonStyles.stepSegment, index <= stageIndex && lessonStyles.stepSegmentDone, index === stageIndex && lessonStyles.stepSegmentCurrent]}
          />
        ))}
      </View>
      <View style={lessonStyles.stepperEnds}>
        <Text style={lessonStyles.stepperEndText}>Situation</Text>
        <Text style={lessonStyles.stepperEndText}>Spaced Review</Text>
      </View>
    </View>
  );
}

export function LessonFooter({
  label, disabled, saving, lastStage, onPress,
}: {
  label?: string;
  disabled: boolean;
  saving: boolean;
  lastStage: boolean;
  onPress: () => void;
}) {
  const text = saving ? 'در حال ذخیره…' : label ?? (lastStage ? 'پایان درس' : 'ادامه');
  return (
    <View style={lessonStyles.footer}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || saving }}
        disabled={disabled || saving}
        style={[lessonStyles.nextButton, (disabled || saving) && lessonStyles.nextButtonDisabled]}
        onPress={onPress}
      >
        <Text style={lessonStyles.nextText}>{text}</Text>
        {lastStage ? <Check size={20} color={Colors.onColor} /> : <ChevronLeft size={20} color={Colors.onColor} />}
      </Pressable>
    </View>
  );
}

export function LessonPage({ children, footer, header, stepper }: { children: ReactNode; footer: ReactNode; header: ReactNode; stepper: ReactNode }) {
  return (
    <View style={lessonStyles.root}>
      {header}
      {stepper}
      <ScrollView contentContainerStyle={lessonStyles.content} showsVerticalScrollIndicator={false}>{children}</ScrollView>
      {footer}
    </View>
  );
}

/* ------------------------------------------------------------------ stages */

export function StageSituation({
  lesson, noteTitle,
}: {
  lesson: FormatLesson;
  noteTitle: string;
}) {
  return (
    <View style={lessonStyles.centerStage}>
      <View style={lessonStyles.bigIcon}><Sparkles size={34} color={Palette.warning} /></View>
      <Text style={lessonStyles.stageEyebrow}>موقعیت واقعی</Text>
      <Text style={lessonStyles.stageTitle}>{lesson.title}</Text>
      <Text style={lessonStyles.situation}>{lesson.situation}</Text>
      <View style={lessonStyles.promiseCard}>
        <Text style={lessonStyles.promiseTitle}>در پایان این درس می‌توانید:</Text>
        <Text style={lessonStyles.promiseText}>با {fa(lesson.sentences.length)} جملهٔ کوتاه، این موقعیت را مدیریت کنید.</Text>
      </View>
      {lesson.teachingFa ? (
        <View style={lessonStyles.noteCard}>
          <Text style={lessonStyles.noteTitle}>{noteTitle}</Text>
          <Text style={lessonStyles.noteText}>{lesson.teachingFa}</Text>
        </View>
      ) : null}
    </View>
  );
}

export function StageSentence({
  sentence, index, total, onSpeak, pronunciationLtr, note, slowLabel = 'پخش آهسته',
}: {
  sentence: FormatSentence;
  index: number;
  total: number;
  onSpeak: () => void;
  pronunciationLtr: boolean;
  note?: string;
  slowLabel?: string;
}) {
  return (
    <View style={lessonStyles.sentenceStage}>
      <Text style={lessonStyles.counter}>جمله {fa(index + 1)} از {fa(total)}</Text>
      <View style={lessonStyles.sentenceCard}>
        <Pressable accessibilityRole="button" accessibilityLabel={`پخش نمونهٔ صوتی جمله: ${sentence.text}`} accessibilityHint="فقط نمونهٔ گفتاری پخش می‌شود؛ میکروفن فعال نیست." style={lessonStyles.soundButton} onPress={onSpeak}>
          <Volume2 size={25} color={Palette.surface} />
        </Pressable>
        <Text style={lessonStyles.target}>{sentence.text}</Text>
        <Text style={[lessonStyles.pronunciation, pronunciationLtr && { writingDirection: 'ltr', fontFamily: 'Inter-ExtraBold' }]}>{sentence.pronunciation}</Text>
        <View style={lessonStyles.divider} />
        <Text style={lessonStyles.persian}>{sentence.fa}</Text>
        {sentence.pattern ? (
          <View style={lessonStyles.pattern}>
            <Text style={lessonStyles.patternLabel}>الگو</Text>
            <Text style={lessonStyles.patternText}>{sentence.pattern}</Text>
          </View>
        ) : null}
      </View>
      {note ? <Text style={lessonStyles.hint}>{note}</Text> : null}
      <Text style={lessonStyles.hint}>چند بار گوش دهید و جمله را با صدای بلند تکرار کنید؛ {slowLabel} همیشه در دسترس است.</Text>
    </View>
  );
}

export function StageListening({
  lesson, activeIndex, onSelect,
}: {
  lesson: FormatLesson;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <View style={lessonStyles.centerStage}>
      <View style={lessonStyles.bigIcon}><Headphones size={34} color={Palette.primary} /></View>
      <Text style={lessonStyles.stageTitle}>شنیدن جمله‌ها</Text>
      <Text style={lessonStyles.stageDesc}>هر جمله را جداگانه گوش دهید و معنی همان جمله را به یاد بیاورید. واژه‌ها همیشه کنار جملهٔ اصلی می‌مانند.</Text>
      <View style={lessonStyles.listenList}>
        {lesson.sentences.map((sentence, index) => (
          <Pressable
            key={sentence.id}
            accessibilityRole="button"
            accessibilityLabel={`پخش جملهٔ ${fa(index + 1)} از ${fa(lesson.sentences.length)}: ${sentence.text}`}
            accessibilityState={{ selected: index === activeIndex }}
            style={[lessonStyles.listenRow, index === activeIndex && lessonStyles.listenRowActive]}
            onPress={() => onSelect(index)}
          >
            <View style={lessonStyles.listenNumber}><Text style={lessonStyles.listenNumberText}>{fa(index + 1)}</Text></View>
            <Text style={lessonStyles.listenTarget}>{sentence.text}</Text>
            <Volume2 size={19} color={Palette.primary} />
          </Pressable>
        ))}
      </View>
      <View style={lessonStyles.shadowTip}>
        <Headphones size={18} color={Palette.primary} />
        <Text style={lessonStyles.shadowText}>فعلاً فقط به صدا گوش دهید؛ مرحلهٔ بعد برای تکرار و سایه‌خوانی است.</Text>
      </View>
    </View>
  );
}

/** Microphone control shown in the shadowing stage; disabled while paid AI is off. */
export function ShadowingMic({
  disabled, canRecord, recording, evaluating, onPress,
}: {
  disabled: boolean;
  canRecord: boolean;
  recording: boolean;
  evaluating: boolean;
  onPress: () => void;
}) {
  const label = evaluating ? 'در حال بررسی…' : recording ? 'توقف و بررسی' : canRecord ? 'شروع ضبط اختیاری' : 'ضبط آنلاین غیرفعال';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={canRecord ? (recording ? 'توقف ضبط و بررسی آنلاین جمله' : 'شروع ضبط اختیاری جمله') : 'ضبط و بررسی آنلاین گفتار غیرفعال است'}
      accessibilityState={{ disabled }}
      disabled={disabled}
      style={[lessonStyles.recordButton, recording && lessonStyles.recordButtonActive, disabled && lessonStyles.recordButtonDisabled]}
      onPress={onPress}
    >
      {recording ? <><Mic2 size={19} color={Colors.onColor} /><Text style={lessonStyles.recordButtonText}>{label}</Text></> : <><Mic2 size={19} color={Colors.onColor} /><Text style={lessonStyles.recordButtonText}>{label}</Text></>}
    </Pressable>
  );
}

export function StageShadowing({
  sentence, onSpeakSlow, mic, hint,
}: {
  sentence: FormatSentence;
  onSpeakSlow: () => void;
  mic?: ReactNode;
  hint: string;
}) {
  return (
    <View style={lessonStyles.centerStage}>
      <View style={lessonStyles.bigIcon}><Mic2 size={34} color={Palette.success} /></View>
      <Text style={lessonStyles.stageTitle}>سایه‌خوانی · Shadowing</Text>
      <Text style={lessonStyles.stageDesc}>یک جمله را پخش کنید، مکث کنید و با همان آهنگ تکرار کنید. این تمرین بدون ضبط صدا هم کامل است.</Text>
      <View style={lessonStyles.speechPractice}>
        <Text style={lessonStyles.speechTitle}>جملهٔ انتخاب‌شده</Text>
        <Text style={lessonStyles.speechSentence}>{sentence.text}</Text>
        <Pressable accessibilityRole="button" style={lessonStyles.recordButton} onPress={onSpeakSlow}>
          <Volume2 size={18} color={Colors.onColor} /><Text style={lessonStyles.recordButtonText}>پخش آهستهٔ نمونه</Text>
        </Pressable>
        <Text style={lessonStyles.speechHint}>{hint}</Text>
        {mic}
      </View>
    </View>
  );
}

export function StageBuilder({ children }: { children: ReactNode }) {
  return (
    <View style={lessonStyles.centerStage}>
      <View style={lessonStyles.bigIcon}><RotateCcw size={33} color={Palette.success} /></View>
      <Text style={lessonStyles.stageTitle}>ساخت جمله</Text>
      <Text style={lessonStyles.stageDesc}>معنی جمله را بخوانید و واژه‌های همان جمله را به ترتیب بچینید.</Text>
      {children}
    </View>
  );
}

export function StageVocabulary({ lesson, onSpeak, note }: { lesson: FormatLesson; onSpeak: (text: string) => void; note: string }) {
  const entries = new Map<string, { word: { word: string; meaning: string }; sentence: FormatSentence }>();
  lesson.sentences.forEach(sentence => sentence.vocabulary.forEach(word => {
    const key = `${word.word}::${word.meaning}`;
    if (!entries.has(key)) entries.set(key, { word, sentence });
  }));
  return (
    <View style={lessonStyles.centerStage}>
      <View style={lessonStyles.bigIcon}><Sparkles size={34} color={Palette.warning} /></View>
      <Text style={lessonStyles.stageTitle}>واژگان از دل جمله‌ها</Text>
      <Text style={lessonStyles.stageDesc}>هر واژه در کنار معنی و همان جمله‌ای دیده می‌شود که از آن آمده است. {note}</Text>
      <View style={lessonStyles.vocabList}>
        {[...entries.values()].map(({ word, sentence }) => (
          <View key={`${word.word}-${sentence.id}`} style={lessonStyles.vocabCard}>
            <View style={lessonStyles.vocabTop}>
              <Text style={lessonStyles.vocabWord}>{word.word}</Text>
              <Text style={lessonStyles.vocabMeaning}>{word.meaning}</Text>
            </View>
            <Text style={lessonStyles.vocabExample}>{sentence.text}</Text>
            <Text style={lessonStyles.vocabExampleFa}>{sentence.fa}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel={`شنیدن مثال: ${sentence.text}`} style={lessonStyles.bubbleSound} onPress={() => onSpeak(sentence.text)}>
              <Volume2 size={16} color={Palette.primary} />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

export function StageGrammar({ lesson, onSpeak }: { lesson: FormatLesson; onSpeak: (text: string) => void }) {
  const patterns: Array<{ sentence: FormatSentence; pattern: string }> = [];
  const seen = new Set<string>();
  lesson.sentences.forEach(sentence => {
    if (!sentence.pattern || seen.has(sentence.pattern)) return;
    seen.add(sentence.pattern);
    patterns.push({ sentence, pattern: sentence.pattern });
  });
  return (
    <View style={lessonStyles.centerStage}>
      <View style={lessonStyles.bigIcon}><BookOpenCheck size={33} color={Palette.primary} /></View>
      <Text style={lessonStyles.stageTitle}>Grammar Through Usage · دستور در کاربرد</Text>
      <Text style={lessonStyles.stageDesc}>الگوها فقط از جمله‌های ثبت‌شدهٔ همین درس نمایش داده می‌شوند؛ قاعده یا مثال تازه‌ای به محتوا اضافه نشده است.</Text>
      {patterns.length ? patterns.map(({ sentence, pattern }) => (
        <View key={`${sentence.id}-${pattern}`} style={lessonStyles.vocabCard}>
          <Text style={lessonStyles.patternText}>{pattern}</Text>
          <Text style={lessonStyles.vocabExample}>{sentence.text}</Text>
          <Text style={lessonStyles.vocabExampleFa}>{sentence.fa}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={`شنیدن جمله: ${sentence.text}`} onPress={() => onSpeak(sentence.text)} style={lessonStyles.bubbleSound}>
            <Volume2 size={16} color={Palette.primary} />
          </Pressable>
        </View>
      )) : (
        <View style={lessonStyles.promiseCard}>
          <Text style={lessonStyles.promiseTitle}>یادگیری در بافت جمله</Text>
          <Text style={lessonStyles.promiseText}>برای این درس الگوی جداگانه‌ای ثبت نشده است؛ جملهٔ اصلی را بشنوید و ساختارش را در کاربرد واقعی ببینید.</Text>
        </View>
      )}
    </View>
  );
}

export function StageConversation({ children }: { children: ReactNode }) {
  return (
    <View style={lessonStyles.centerStage}>
      <View style={lessonStyles.bigIcon}><MessageCircle size={34} color={Palette.teal} /></View>
      <Text style={lessonStyles.stageTitle}>Conversation Practice · مکالمهٔ هدایت‌شده</Text>
      <Text style={lessonStyles.stageDesc}>از دیالوگ همین درس نقش‌آفرینی کنید؛ جملهٔ خود را بگویید و بعد نمونه را بشنوید.</Text>
      {children}
    </View>
  );
}

export function CheckQuiz({
  checks, answers, onAnswer, onShowAnswers, showAnswers, targetRow,
}: {
  checks: FormatCheck[];
  answers: Record<string, number>;
  onAnswer: (index: number, choice: number) => void;
  onShowAnswers: () => void;
  showAnswers: boolean;
  /** True when a choice is written in the target language (LTR) rather than Persian. */
  targetRow?: (choice: string) => boolean;
}) {
  const isTarget = targetRow ?? (choice => !/[\u0600-\u06FF]/.test(choice));
  return (
    <View style={lessonStyles.evidenceCard}>
      <Text style={lessonStyles.evidenceTitle}>حالا خودت امتحان کن</Text>
      <Text style={lessonStyles.evidenceIntro}>پرسش‌ها به جمله‌های همین درس وصل‌اند. پاسخ نادرست را می‌توانید دوباره امتحان کنید یا توضیح پاسخ نمونه را ببینید.</Text>
      {checks.map((question, index) => {
        const selected = answers[String(index)];
        const answered = selected !== undefined;
        const locked = selected === question.correctIndex || showAnswers;
        return (
          <View key={index} style={lessonStyles.question}>
            <Text style={lessonStyles.questionPrompt}>{fa(index + 1)}. {question.promptFa}</Text>
            {question.choices.map((choice, choiceIndex) => {
              const isSelected = selected === choiceIndex;
              const shownCorrect = showAnswers && choiceIndex === question.correctIndex;
              return (
                <Pressable
                  key={`${index}-${choiceIndex}`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected || shownCorrect, disabled: locked }}
                  disabled={locked}
                  onPress={() => onAnswer(index, choiceIndex)}
                  style={[lessonStyles.choice, (isSelected || shownCorrect) && lessonStyles.choiceSelected, shownCorrect && lessonStyles.choiceCorrect]}
                >
                  <Text style={isTarget(choice) ? lessonStyles.choiceTarget : lessonStyles.choicePersian}>{choice}</Text>
                </Pressable>
              );
            })}
            {answered || showAnswers ? (
              <View style={lessonStyles.feedbackBox}>
                <Text style={showAnswers || selected === question.correctIndex ? lessonStyles.feedbackTitle : lessonStyles.feedbackError}>
                  {showAnswers && selected !== question.correctIndex
                    ? `پاسخ نمونه: ${question.choices[question.correctIndex]}`
                    : selected === question.correctIndex ? 'پاسخ مناسب است.' : 'این بار درست نبود؛ دوباره تلاش کنید.'}
                </Text>
                <Text style={lessonStyles.feedbackText}>{question.explanationFa}</Text>
                {answered && selected !== question.correctIndex && !showAnswers ? (
                  <Pressable accessibilityRole="button" style={lessonStyles.retryAnswer} onPress={() => onAnswer(index, -1)}>
                    <Text style={lessonStyles.retryAnswerText}>دوباره امتحان کن</Text>
                  </Pressable>
                ) : null}
              </View>
            ) : null}
          </View>
        );
      })}
      {!showAnswers ? (
        <Pressable accessibilityRole="button" style={lessonStyles.showAnswersButton} onPress={onShowAnswers}>
          <Text style={lessonStyles.showAnswersText}>نمایش توضیح همهٔ پاسخ‌ها</Text>
        </Pressable>
      ) : <Text style={lessonStyles.evidenceNote}>پاسخ‌های نمونه نمایش داده شدند؛ می‌توانید درس را پایان دهید.</Text>}
    </View>
  );
}

export function StageReview({
  lesson, wordCount, evidence, note,
}: {
  lesson: FormatLesson;
  wordCount: number;
  evidence?: ReactNode;
  note: string;
}) {
  return (
    <View style={lessonStyles.centerStage}>
      <View style={lessonStyles.bigIcon}><RefreshCw size={33} color={Palette.success} /></View>
      <Text style={lessonStyles.stageTitle}>مرور فاصله‌دار</Text>
      <Text style={lessonStyles.stageDesc}>با ثبت پایان درس، جمله‌ها و واژه‌های وابسته به آن وارد برنامهٔ مرور می‌شوند؛ مرور بر اساس پاسخ شما فاصله‌گذاری می‌شود.</Text>
      <View style={lessonStyles.promiseCard}>
        <Text style={lessonStyles.promiseTitle}>خلاصهٔ همین درس</Text>
        <Text style={lessonStyles.promiseText}>{fa(lesson.sentences.length)} جمله و {fa(wordCount)} واژه/عبارت یکتا؛ {note}</Text>
        <View style={lessonStyles.summaryRow}>
          <View style={lessonStyles.summaryChip}><BookOpenCheck size={13} color={Palette.primary} /><Text style={lessonStyles.summaryChipText}>{fa(lesson.sentences.length)} جمله</Text></View>
          <View style={lessonStyles.summaryChip}><Sparkles size={13} color={Palette.primary} /><Text style={lessonStyles.summaryChipText}>{fa(wordCount)} واژه</Text></View>
        </View>
      </View>
      {evidence}
    </View>
  );
}

export function LessonCounters({ lesson }: { lesson: FormatLesson }) {
  const words = new Set(lesson.sentences.flatMap(sentence => sentence.vocabulary.map(word => word.word)));
  return (
    <View style={lessonStyles.summaryRow}>
      <View style={lessonStyles.summaryChip}><Text style={lessonStyles.summaryChipText}>{fa(lesson.sentences.length)} جمله</Text></View>
      <View style={lessonStyles.summaryChip}><Text style={lessonStyles.summaryChipText}>{fa(words.size)} واژه</Text></View>
    </View>
  );
}
