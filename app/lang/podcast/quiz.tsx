import { LocalizedText as Text } from '@/components/LocalizedText';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, Check, CheckCircle2, RefreshCw, Volume2, X } from 'lucide-react-native';
import { MiloGlobeHeadphoneMark } from '@/components/MiloBrandMark';
import { PageNavigation } from '@/components/PageNavigation';
import { Typography } from '@/lib/theme';
import { toPersianDigits as fa } from '@/lib/format';
import { adjacentEpisode, getPodcastEpisode, savePodcastProgress, speakPodcastLine, stopPodcastSpeech } from '@/lib/englishPodcast';
import { buildEpisodeQuiz, recordQuizAnswer } from '@/lib/englishPodcastQuiz';

const P = { ink: '#191919', muted: '#6B675F', soft: '#F4F1EA', border: '#E8E3DA', accent: '#5146E5', accentSoft: '#E9E7FF', success: '#2E8B57', successSoft: '#E6F4EC', error: '#C0392B', errorSoft: '#FBE9E7', white: '#FFFFFF' };

const isRtl = (value: string) => /[\u0600-\u06FF]/.test(value);

export default function EnglishPodcastQuiz() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const episode = useMemo(() => getPodcastEpisode(String(params.id ?? '')), [params.id]);
  const questions = useMemo(() => (episode ? buildEpisodeQuiz(episode) : []), [episode]);

  const [current, setCurrent] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => () => { void stopPodcastSpeech(); }, []);

  useEffect(() => {
    if (!episode || !finished) return;
    void savePodcastProgress(episode.id, { quizScore: score, quizTotal: questions.length }).catch(() => undefined);
  }, [episode, finished, score, questions.length]);

  if (!episode || !questions.length) {
    return (
      <View style={styles.root}><View style={styles.page}>
        <View style={styles.brandRow}><MiloGlobeHeadphoneMark size={48} /><PageNavigation backFallback="/lang/podcast" /></View>
        <Text style={styles.body}>برای این اپیزود سؤالی در دسترس نیست.</Text>
      </View></View>
    );
  }

  const question = questions[current];
  const answered = picked !== null;

  const choose = (index: number) => {
    if (answered) return;
    setPicked(index);
    const correct = index === question.answerIndex;
    if (correct) setScore(value => value + 1);
    else setMissed(value => [...value, question.sentenceId]);
    void recordQuizAnswer(episode, question, correct);
  };

  const next = () => {
    void stopPodcastSpeech();
    if (current + 1 >= questions.length) { setFinished(true); return; }
    setCurrent(value => value + 1);
    setPicked(null);
  };

  const restart = () => { setCurrent(0); setPicked(null); setScore(0); setMissed([]); setFinished(false); };
  const nextEpisode = adjacentEpisode(episode.id, 1);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <View style={styles.brandRow}><MiloGlobeHeadphoneMark size={48} /><PageNavigation backFallback="/lang/podcast" /></View>

          <LinearGradient colors={['#1E1B4B', '#312E81', '#4338CA']} start={{ x: .95, y: 0 }} end={{ x: .05, y: 1 }} style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerIcon}><Brain size={22} color={P.white} /></View>
              <View style={styles.headerCopy}>
                <Text style={styles.headerEyebrow}>EPISODE {episode.number} · COMPREHENSION CHECK</Text>
                <Text style={styles.headerTitle}>سؤالات درک مطلب</Text>
                <Text style={styles.headerSub}>{episode.title} · {fa(questions.length)} سؤال · پاسخ‌های اشتباه به مرور فاصله‌دار اضافه می‌شوند</Text>
              </View>
            </View>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.round(((finished ? questions.length : current) / questions.length) * 100)}%` }]} /></View>
          </LinearGradient>

          {finished ? (
            <View style={styles.resultCard}>
              <CheckCircle2 size={28} color={P.success} />
              <Text style={styles.resultScore}>{fa(score)} از {fa(questions.length)}</Text>
              <Text style={styles.body}>{score === questions.length ? 'عالی! همهٔ سؤال‌ها را درست پاسخ دادید.' : missed.length ? `${fa(missed.length)} جمله برای مرور به کارت‌های زمان‌بندی‌شدهٔ شما اضافه شد.` : 'خوب بود.'}</Text>
              <View style={styles.resultActions}>
                <Pressable accessibilityRole="button" style={styles.action} onPress={restart}><RefreshCw size={15} color={P.accent} /><Text style={styles.actionText}>دوباره</Text></Pressable>
                {missed.length ? <Pressable accessibilityRole="button" style={styles.action} onPress={() => router.push('/review' as never)}><Text style={styles.actionText}>مرور جمله‌ها</Text></Pressable> : null}
                {nextEpisode ? <Pressable accessibilityRole="button" style={[styles.action, styles.actionPrimary]} onPress={() => router.replace({ pathname: '/lang/podcast/[id]', params: { id: nextEpisode.id } } as never)}><Text style={[styles.actionText, styles.actionTextPrimary]}>اپیزود بعدی</Text></Pressable> : null}
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.counter}>سؤال {fa(current + 1)} از {fa(questions.length)}</Text>
              <Text style={styles.hint}>{question.hintFa}</Text>
              <View style={styles.promptRow}>
                {question.speak ? <Pressable accessibilityRole="button" accessibilityLabel="پخش صدا" style={styles.speak} onPress={() => void speakPodcastLine(question.speak!, 1)}><Volume2 size={18} color={P.accent} /></Pressable> : null}
                <Text style={[styles.prompt, isRtl(question.prompt) ? styles.rtl : styles.ltr]}>{question.prompt}</Text>
              </View>
              <View style={styles.options}>
                {question.options.map((option, index) => {
                  const isAnswer = index === question.answerIndex;
                  const isPicked = index === picked;
                  const state = !answered ? 'idle' : isAnswer ? 'correct' : isPicked ? 'wrong' : 'idle';
                  return (
                    <Pressable key={option + index} accessibilityRole="button" accessibilityState={{ disabled: answered, selected: isPicked }} disabled={answered} style={[styles.option, state === 'correct' && styles.optionCorrect, state === 'wrong' && styles.optionWrong]} onPress={() => choose(index)}>
                      <Text style={[styles.optionText, isRtl(option) ? styles.rtl : styles.ltr, state === 'correct' && { color: P.success }, state === 'wrong' && { color: P.error }]}>{option}</Text>
                      {state === 'correct' ? <Check size={16} color={P.success} /> : state === 'wrong' ? <X size={16} color={P.error} /> : null}
                    </Pressable>
                  );
                })}
              </View>
              {answered ? (
                <Pressable accessibilityRole="button" style={styles.nextButton} onPress={next}><Text style={styles.nextText}>{current + 1 >= questions.length ? 'نتیجه' : 'سؤال بعدی'}</Text></Pressable>
              ) : null}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: P.white },
  scroll: { flexGrow: 1 },
  page: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 28, gap: 14 },
  brandRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 3 },
  header: { borderRadius: 22, padding: 16, gap: 10 },
  headerTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  headerIcon: { width: 44, height: 44, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  headerCopy: { flex: 1, gap: 2 },
  headerEyebrow: { fontFamily: 'Times New Roman', color: 'rgba(255,255,255,0.72)', fontSize: 9, letterSpacing: 1.5, textAlign: 'left', writingDirection: 'ltr' },
  headerTitle: { fontFamily: Typography.fontFamily, color: P.white, fontSize: 18, lineHeight: 27, textAlign: 'right', writingDirection: 'rtl' },
  headerSub: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.8)', fontSize: 11, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  progressTrack: { height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' },
  progressFill: { height: 5, borderRadius: 3, backgroundColor: P.white },
  card: { borderRadius: 22, borderWidth: 1, borderColor: P.border, backgroundColor: P.white, padding: 16, gap: 12 },
  counter: { fontFamily: Typography.fontFamily, color: P.muted, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  hint: { fontFamily: Typography.fontFamily, color: P.ink, fontSize: 13, lineHeight: 22, textAlign: 'right', writingDirection: 'rtl' },
  promptRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, borderRadius: 16, backgroundColor: P.accentSoft, padding: 14 },
  speak: { width: 38, height: 38, borderRadius: 19, backgroundColor: P.white, alignItems: 'center', justifyContent: 'center' },
  prompt: { flex: 1, color: P.ink, fontSize: 17, lineHeight: 26 },
  ltr: { fontFamily: Typography.latinFontFamily, fontWeight: '700', textAlign: 'left', writingDirection: 'ltr' },
  rtl: { fontFamily: Typography.fontFamily, textAlign: 'right', writingDirection: 'rtl' },
  options: { gap: 8 },
  option: { minHeight: 48, borderRadius: 14, borderWidth: 1, borderColor: P.border, backgroundColor: P.soft, paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  optionCorrect: { borderColor: P.success, backgroundColor: P.successSoft },
  optionWrong: { borderColor: P.error, backgroundColor: P.errorSoft },
  optionText: { flex: 1, color: P.ink, fontSize: 14, lineHeight: 22 },
  nextButton: { minHeight: 46, borderRadius: 14, backgroundColor: P.accent, alignItems: 'center', justifyContent: 'center' },
  nextText: { fontFamily: Typography.fontFamily, color: P.white, fontSize: 14 },
  resultCard: { borderRadius: 22, backgroundColor: P.successSoft, padding: 20, alignItems: 'center', gap: 8 },
  resultScore: { fontFamily: Typography.fontFamily, color: P.success, fontSize: 28 },
  body: { fontFamily: Typography.fontFamily, color: P.ink, fontSize: 13, lineHeight: 22, textAlign: 'center', writingDirection: 'rtl' },
  resultActions: { flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 6 },
  action: { minHeight: 40, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: P.accent, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 6 },
  actionPrimary: { backgroundColor: P.accent },
  actionText: { fontFamily: Typography.fontFamily, color: P.accent, fontSize: 12 },
  actionTextPrimary: { color: P.white },
});
