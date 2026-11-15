import { LocalizedText as Text } from '@/components/LocalizedText';
import { Pressable, StyleSheet, View } from 'react-native';
import { Mic2 } from 'lucide-react-native';
import SpeakCheck, { type SpeakCheckResult } from '@/components/SpeakCheck';
import type { ReviewRating, SentenceReviewCard } from '@/lib/courseProgress';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';

/**
 * Shared pieces of the four review screens (English / Russian / Turkish / starter courses).
 *
 * The review card used to be self-reported only («how did recall go?»). Now the learner can say the
 * sentence into the microphone first; the word-by-word score (same scorer as the lessons) reveals the
 * answer and PRE-SELECTS one of the four ratings with the reason written out. The learner can still
 * pick any rating — the suggestion is advice, not a verdict — and «نمایش پاسخ» remains as the no-mic path.
 */

export const RATING_OPTIONS: Array<{ id: ReviewRating; label: string; hint: string; color: string }> = [
  { id: 'again', label: 'فراموش کردم', hint: '۱۰ دقیقه', color: '#DC2626' },
  { id: 'hard', label: 'سخت بود', hint: 'فردا', color: '#D97706' },
  { id: 'good', label: 'خوب بود', hint: 'زمان مناسب', color: '#4F46E5' },
  { id: 'easy', label: 'آسان بود', hint: 'فاصلهٔ بیشتر', color: '#16A34A' },
];

/** Score → rating, mirroring the lesson thresholds (70 = «good» in SpeakCheck's feedback, 40 = partial). */
export function suggestedRating(score: number): ReviewRating {
  if (score < 40) return 'again';
  if (score < 70) return 'hard';
  if (score < 90) return 'good';
  return 'easy';
}

/** Plain-language explanation of why this card is in today's session. */
export function reviewReason(card: SentenceReviewCard, lessonTitle: string): string {
  if (card.repetitions === 0 && card.lapses === 0) return `اولین مرور این جمله از درس «${lessonTitle}».`;
  if (card.lapses > 0 && card.intervalDays < 1) return 'دفعهٔ قبل فراموش شده بود؛ برای همین زود برگشته.';
  if (card.intervalDays >= 1) return `موعدش رسیده: ${fa(card.intervalDays)} روز از مرور قبلی گذشته.`;
  return 'برای تثبیت، امروز دوباره آمده.';
}

export function ReviewSpeakGate({ text, locale, accent, onResult }: { text: string; locale: string; accent?: string; onResult: (result: SpeakCheckResult) => void }) {
  return <SpeakCheck text={text} locale={locale} accent={accent} title="از حافظه بگو · پاسخ بعد از گفتن ظاهر می‌شود" onResult={onResult} />;
}

export function ReviewRatingGrid({ saving, onRate, score, title = 'یادآوری این جمله چطور بود؟' }: { saving: boolean; onRate: (rating: ReviewRating) => void; score: number | null; title?: string }) {
  const suggestion = score === null ? null : suggestedRating(score);
  return (
    <View style={styles.area}>
      <Text style={styles.title}>{title}</Text>
      {suggestion !== null && score !== null ? <View style={styles.suggestionRow}><Mic2 size={13} color="#4F46E5" /><Text style={styles.suggestion}>امتیاز گفتنت {fa(score)}٪ بود → پیشنهاد: «{RATING_OPTIONS.find(o => o.id === suggestion)?.label}». تصمیم نهایی با توست.</Text></View> : null}
      <View style={styles.grid}>
        {RATING_OPTIONS.map(option => {
          const highlighted = option.id === suggestion;
          return <Pressable key={option.id} accessibilityRole="button" accessibilityState={{ selected: highlighted }} disabled={saving} style={[styles.button, { borderColor: `${option.color}55` }, highlighted && { borderColor: option.color, borderWidth: 2, backgroundColor: `${option.color}12` }]} onPress={() => onRate(option.id)}>
            <Text keepColor style={[styles.label, { color: option.color }]}>{saving ? 'در حال ذخیره…' : option.label}</Text>
            <Text style={styles.hint}>{highlighted ? 'پیشنهاد' : option.hint}</Text>
          </Pressable>;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  area: { width: '100%', gap: 10, marginTop: 14 },
  title: { fontFamily: Typography.fontFamily, fontSize: 14, color: '#1E293B', textAlign: 'right', writingDirection: 'rtl' },
  suggestionRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, backgroundColor: '#EEF2FF', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 },
  suggestion: { flex: 1, fontFamily: Typography.fontFamily, fontSize: 12.5, lineHeight: 20, color: '#3730A3', textAlign: 'right', writingDirection: 'rtl' },
  grid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  button: { flexGrow: 1, flexBasis: '45%', minHeight: 56, borderRadius: 14, borderWidth: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', gap: 2, paddingHorizontal: 8 },
  label: { fontFamily: Typography.fontFamily, fontSize: 13.5, fontWeight: '800', writingDirection: 'rtl' },
  hint: { fontFamily: Typography.fontFamily, fontSize: 11, color: '#64748B', writingDirection: 'rtl' },
});
