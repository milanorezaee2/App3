import { LocalizedText as Text } from '@/components/LocalizedText';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { Mic2, RefreshCw, Square } from 'lucide-react-native';
import { toPersianDigits as fa } from '@/lib/format';

/** Normalise a token for comparison: lower-case, strip punctuation and diacritics that recognisers often drop. */
function tokens(text: string) {
  return text
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[’'`´]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function similarity(a: string, b: string) {
  if (a === b) return 1;
  const m = a.length, n = b.length;
  if (!m || !n) return 0;
  const d: number[][] = Array.from({ length: m + 1 }, (_, i) => [i, ...new Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return 1 - d[m][n] / Math.max(m, n);
}

export type SpeakCheckResult = { score: number; words: { word: string; ok: boolean }[]; heard: string };

/** Compare the recognised transcript with the target sentence; marks each expected word as matched or missed. */
export function scoreSpeech(target: string, heard: string): SpeakCheckResult {
  const expected = target.trim().split(/\s+/).filter(Boolean);
  const pool = tokens(heard);
  const used = new Set<number>();
  const words = expected.map(raw => {
    const want = tokens(raw)[0] ?? '';
    if (!want) return { word: raw, ok: true };
    let best = -1, bestScore = 0;
    pool.forEach((got, index) => {
      if (used.has(index)) return;
      const s = similarity(want, got);
      if (s > bestScore) { bestScore = s; best = index; }
    });
    const ok = bestScore >= (want.length <= 3 ? 0.67 : 0.75);
    if (ok) used.add(best);
    return { word: raw, ok };
  });
  const scored = words.filter(w => tokens(w.word).length);
  const score = scored.length ? Math.round((scored.filter(w => w.ok).length / scored.length) * 100) : 0;
  return { score, words, heard: heard.trim() };
}

function feedbackFor(score: number) {
  if (score >= 90) return 'عالی! همهٔ واژه‌ها واضح شنیده شد.';
  if (score >= 70) return 'خوب بود؛ واژه‌های قرمز را یک‌بار دیگر بگویید.';
  if (score >= 40) return 'بخشی شنیده شد؛ آهسته‌تر و نزدیک‌تر به میکروفن تکرار کنید.';
  return 'واضح شنیده نشد؛ ابتدا نمونه را گوش دهید و دوباره بگویید.';
}

type Props = { text: string; locale: string; accent?: string; onResult?: (result: SpeakCheckResult) => void };

/**
 * «بگو» — the learner says the sentence aloud; the device speech recogniser transcribes it and
 * each expected word is shown green (heard) or red (missed) together with a percentage.
 * Works on Android/iOS through the native recogniser and on web through the browser's Web Speech API.
 */
export default function SpeakCheck({ text, locale, accent = '#2563EB', onResult }: Props) {
  const [listening, setListening] = useState(false);
  const [partial, setPartial] = useState('');
  const [result, setResult] = useState<SpeakCheckResult | null>(null);
  const [error, setError] = useState('');
  const finalRef = useRef('');
  const targetRef = useRef(text);
  targetRef.current = text;

  useEffect(() => { setResult(null); setPartial(''); setError(''); finalRef.current = ''; }, [text]);
  useEffect(() => () => { void ExpoSpeechRecognitionModule.abort?.(); }, []);

  const finish = useCallback((heard: string) => {
    const scored = scoreSpeech(targetRef.current, heard);
    setResult(scored);
    onResult?.(scored);
  }, [onResult]);

  useSpeechRecognitionEvent('start', () => { setListening(true); setError(''); });
  useSpeechRecognitionEvent('result', event => {
    const transcript = event.results?.[0]?.transcript ?? '';
    if (event.isFinal) finalRef.current = transcript; else setPartial(transcript);
  });
  useSpeechRecognitionEvent('end', () => {
    setListening(false);
    setPartial('');
    finish(finalRef.current);
  });
  useSpeechRecognitionEvent('error', event => {
    setListening(false);
    setPartial('');
    const code = event.error;
    if (code === 'no-speech') { finish(''); return; }
    if (code === 'aborted') return;
    setError(code === 'not-allowed' || code === 'service-not-allowed'
      ? 'اجازهٔ میکروفن یا تشخیص گفتار داده نشده است؛ از تنظیمات دستگاه فعالش کنید.'
      : code === 'language-not-supported'
        ? 'تشخیص گفتار این زبان روی دستگاه شما در دسترس نیست.'
        : code === 'network'
          ? 'برای تشخیص گفتار این زبان، اتصال اینترنت لازم است.'
          : 'تشخیص گفتار در دسترس نیست؛ سرویس گفتار گوگل را روی دستگاه بررسی کنید.');
  });

  const start = useCallback(async () => {
    setError('');
    setResult(null);
    finalRef.current = '';
    try {
      if (Platform.OS === 'web' && !ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
        setError('مرورگر شما از تشخیص گفتار پشتیبانی نمی‌کند.');
        return;
      }
      const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!permission.granted) { setError('برای تمرین گفتاری، اجازهٔ میکروفن لازم است.'); return; }
      ExpoSpeechRecognitionModule.start({ lang: locale, interimResults: true, continuous: false, maxAlternatives: 1, requiresOnDeviceRecognition: false, addsPunctuation: false });
    } catch {
      setError('تشخیص گفتار در دسترس نیست؛ سرویس گفتار گوگل را روی دستگاه بررسی کنید.');
    }
  }, [locale]);

  const stop = useCallback(() => { ExpoSpeechRecognitionModule.stop(); }, []);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>بگو · Speak</Text>
      <Text style={styles.hint}>{listening ? 'در حال شنیدن… جمله را با صدای واضح بگویید.' : result ? feedbackFor(result.score) : 'میکروفن را بزنید و همین جمله را با صدای بلند بگویید.'}</Text>
      {result ? (
        <View style={styles.wordsRow}>
          {result.words.map((item, index) => <Text key={`${item.word}-${index}`} keepColor style={[styles.word, item.ok ? styles.wordOk : styles.wordMiss]}>{item.word}</Text>)}
        </View>
      ) : null}
      {listening && partial ? <Text keepColor style={styles.partial}>{partial}</Text> : null}
      {result ? <View style={styles.scoreRow}><Text style={styles.scoreLabel}>امتیاز</Text><Text keepColor style={[styles.scoreValue, { color: result.score >= 70 ? '#15803D' : result.score >= 40 ? '#B45309' : '#B91C1C' }]}>{fa(result.score)}٪</Text></View> : null}
      {result && result.heard ? <Text style={styles.heard}>شنیده شد: <Text keepColor style={styles.heardText}>{result.heard}</Text></Text> : null}
      {!!error && <Text accessibilityRole="alert" keepColor style={styles.error}>{error}</Text>}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={listening ? 'پایان گفتن' : result ? 'دوباره بگو' : 'شروع گفتن'}
        onPress={() => listening ? stop() : void start()}
        style={({ pressed }) => [styles.button, { backgroundColor: listening ? '#B91C1C' : accent }, pressed && styles.buttonPressed]}
      >
        {listening ? <Square size={16} color="#FFFFFF" fill="#FFFFFF" /> : result ? <RefreshCw size={18} color="#FFFFFF" /> : <Mic2 size={19} color="#FFFFFF" />}
        <Text keepColor style={styles.buttonText}>{listening ? 'تمام شد' : result ? 'دوباره بگو' : 'بگو'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', marginTop: 10, padding: 12, borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', gap: 6 },
  title: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  hint: { fontSize: 12.5, lineHeight: 20, color: '#475569', textAlign: 'center' },
  wordsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 2 },
  word: { fontSize: 17, fontWeight: '700', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8, overflow: 'hidden', writingDirection: 'ltr' },
  wordOk: { color: '#15803D', backgroundColor: '#DCFCE7' },
  wordMiss: { color: '#B91C1C', backgroundColor: '#FEE2E2' },
  partial: { fontSize: 14, color: '#64748B', fontStyle: 'italic', textAlign: 'center' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scoreLabel: { fontSize: 13, color: '#475569' },
  scoreValue: { fontSize: 22, fontWeight: '800' },
  heard: { fontSize: 12, color: '#64748B', textAlign: 'center' },
  heardText: { color: '#334155', fontWeight: '700' },
  error: { fontSize: 12, lineHeight: 19, color: '#B91C1C', textAlign: 'center' },
  button: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 22, paddingVertical: 11, borderRadius: 999, marginTop: 4 },
  buttonPressed: { opacity: 0.85 },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
