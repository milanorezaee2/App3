import { LocalizedText as Text } from '@/components/LocalizedText';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { Mic2, RefreshCw, Square, Volume2 } from 'lucide-react-native';
import * as Speech from 'expo-speech';
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

/**
 * Loose phonetic key: recognisers often return a homophone or a spelling variant for very
 * short words (German «Tee» → "T", "The", "Te"; «Ei» → "Ай"). Collapse doubled letters,
 * drop silent/soft letters and fold umlauts so those variants still match.
 */
function phonetic(word: string) {
  return word
    .replace(/ä/g, 'e').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 's')
    .replace(/ph/g, 'f').replace(/th/g, 't').replace(/ck/g, 'k').replace(/c(?=[eiy])/g, 's').replace(/[cq]/g, 'k')
    .replace(/z/g, 's').replace(/y/g, 'i').replace(/w/g, 'v')
    .replace(/h/g, '')
    .replace(/(.)\1+/g, '$1');
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

export type SpeakWordState = 'ok' | 'near' | 'miss';
export type SpeakCheckResult = { score: number; words: { word: string; ok: boolean; state: SpeakWordState; heard?: string }[]; heard: string };

/** Compare the recognised transcript with the target sentence; marks each expected word as matched or missed. */
export function scoreSpeech(target: string, heard: string): SpeakCheckResult {
  const expected = target.trim().split(/\s+/).filter(Boolean);
  const pool = tokens(heard);
  const used = new Set<number>();
  const joined = pool.join('');
  const words = expected.map(raw => {
    const want = tokens(raw)[0] ?? '';
    if (!want) return { word: raw, ok: true, state: 'ok' as SpeakWordState };
    const wantKey = phonetic(want);
    let best = -1, bestScore = 0;
    pool.forEach((got, index) => {
      if (used.has(index)) return;
      const s = Math.max(similarity(want, got), similarity(wantKey, phonetic(got)));
      if (s > bestScore) { bestScore = s; best = index; }
    });
    // Short words are the hardest for recognisers: accept a close phonetic match, and for a
    // single-word target also accept the whole transcript run together ("te e" → "tee").
    const short = wantKey.length <= 3;
    const gotKey = best >= 0 ? phonetic(pool[best]) : '';
    let ok = bestScore >= (short ? 0.75 : want.length <= 5 ? 0.67 : 0.75)
      || (short && bestScore >= 0.5 && gotKey[0] === wantKey[0] && gotKey.length <= wantKey.length + 1);
    if (!ok && expected.length === 1 && joined) {
      const joinedScore = Math.max(similarity(want, joined), similarity(wantKey, phonetic(joined)));
      ok = joinedScore >= 0.75 || (joinedScore >= 0.6 && phonetic(joined)[0] === wantKey[0]);
    }
    if (ok && best >= 0) used.add(best);
    // «near»: something was said in that slot and it resembles the target (same first sound or ≥ 45% similar) — pronunciation off, not skipped.
    const near = !ok && best >= 0 && (bestScore >= 0.45 || (gotKey[0] === wantKey[0] && bestScore >= 0.3));
    return { word: raw, ok, state: (ok ? 'ok' : near ? 'near' : 'miss') as SpeakWordState, heard: best >= 0 ? pool[best] : undefined };
  });
  const scored = words.filter(w => tokens(w.word).length);
  const score = scored.length ? Math.round((scored.filter(w => w.ok).length / scored.length) * 100) : 0;
  return { score, words, heard: heard.trim() };
}

function feedbackFor(score: number, nearCount = 0) {
  if (score >= 90) return 'عالی! همهٔ واژه‌ها واضح شنیده شد.';
  if (score >= 70) return nearCount ? 'خوب بود؛ واژه‌های زرد نزدیک بود، قرمزها را دوباره بگویید. روی هر واژه بزنید تا آهسته بشنوید.' : 'خوب بود؛ واژه‌های قرمز را یک‌بار دیگر بگویید. روی هر واژه بزنید تا آهسته بشنوید.';
  if (score >= 40) return 'بخشی شنیده شد؛ آهسته‌تر و نزدیک‌تر به میکروفن تکرار کنید.';
  return 'واضح شنیده نشد؛ ابتدا نمونه را گوش دهید و دوباره بگویید.';
}

type Props = { text: string; locale: string; accent?: string; compact?: boolean; title?: string; onResult?: (result: SpeakCheckResult) => void };

/**
 * «بگو» — the learner says the sentence aloud; the device speech recogniser transcribes it and
 * each expected word is shown green (heard) or red (missed) together with a percentage.
 * Works on Android/iOS through the native recogniser and on web through the browser's Web Speech API.
 */
export default function SpeakCheck({ text, locale, accent = '#2563EB', compact = false, title, onResult }: Props) {
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
    const alternatives = (event.results ?? []).map(item => item.transcript).filter(Boolean);
    const transcript = alternatives[0] ?? '';
    if (event.isFinal) {
      // Pick the alternative that matches the target best; recognisers rank homophones arbitrarily.
      const ranked = [...alternatives].sort((a, b) => scoreSpeech(targetRef.current, b).score - scoreSpeech(targetRef.current, a).score);
      finalRef.current = ranked[0] ?? transcript;
    } else setPartial(transcript);
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
      ExpoSpeechRecognitionModule.start({ lang: locale, interimResults: true, continuous: false, maxAlternatives: 5, contextualStrings: [text], requiresOnDeviceRecognition: false, addsPunctuation: false });
    } catch {
      setError('تشخیص گفتار در دسترس نیست؛ سرویس گفتار گوگل را روی دستگاه بررسی کنید.');
    }
  }, [locale, text]);

  const stop = useCallback(() => { ExpoSpeechRecognitionModule.stop(); }, []);
  const sayWord = useCallback((word: string) => { try { Speech.stop(); Speech.speak(word, { language: locale, rate: 0.6 }); } catch { /* no tts */ } }, [locale]);
  const missed = result ? result.words.filter(w => w.state !== 'ok' && tokens(w.word).length) : [];
  const sayMissed = useCallback(() => { if (!missed.length) return; try { Speech.stop(); Speech.speak(missed.map(w => w.word).join(', '), { language: locale, rate: 0.6 }); } catch { /* no tts */ } }, [missed, locale]);

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      {!compact && <Text style={styles.title}>{title ?? 'بگو · Speak'}</Text>}
      {(!compact || listening || result) && <Text style={styles.hint}>{listening ? 'در حال شنیدن… با صدای واضح بگویید.' : result ? feedbackFor(result.score, result.words.filter(w => w.state === 'near').length) : 'میکروفن را بزنید و همین جمله را با صدای بلند بگویید.'}</Text>}
      {result ? (
        <View style={styles.wordsRow}>
          {result.words.map((item, index) => <Pressable key={`${item.word}-${index}`} accessibilityRole="button" accessibilityLabel={`شنیدن آهستهٔ ${item.word}`} onPress={() => sayWord(item.word)}><Text keepColor style={[styles.word, item.state === 'ok' ? styles.wordOk : item.state === 'near' ? styles.wordNear : styles.wordMiss]}>{item.word}</Text></Pressable>)}
        </View>
      ) : null}
      {listening && partial ? <Text keepColor style={styles.partial}>{partial}</Text> : null}
      {result ? <View style={styles.scoreRow}><Text style={styles.scoreLabel}>امتیاز</Text><Text keepColor style={[styles.scoreValue, { color: result.score >= 70 ? '#15803D' : result.score >= 40 ? '#B45309' : '#B91C1C' }]}>{fa(result.score)}٪</Text></View> : null}
      {result && result.heard ? <Text style={styles.heard}>شنیده شد: <Text keepColor style={styles.heardText}>{result.heard}</Text></Text> : null}
      {result && missed.length ? <View style={styles.legendRow}>
        <Pressable accessibilityRole="button" onPress={sayMissed} style={styles.missedButton}><Volume2 size={14} color="#B91C1C" /><Text keepColor style={styles.missedText}>{missed.length === 1 ? 'بشنو و فقط همین یکی را دوباره بگو' : `بشنو و فقط این ${fa(missed.length)} واژه را دوباره بگو`}</Text></Pressable>
        <Text style={styles.legend}>سبز = درست · زرد = نزدیک · قرمز = شنیده نشد</Text>
      </View> : null}
      {!!error && <Text accessibilityRole="alert" keepColor style={styles.error}>{error}</Text>}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={listening ? 'پایان گفتن' : result ? 'دوباره بگو' : 'شروع گفتن'}
        onPress={() => listening ? stop() : void start()}
        style={({ pressed }) => [styles.button, compact && styles.buttonCompact, { backgroundColor: listening ? '#B91C1C' : accent }, pressed && styles.buttonPressed]}
      >
        {listening ? <Square size={compact ? 13 : 16} color="#FFFFFF" fill="#FFFFFF" /> : result ? <RefreshCw size={compact ? 15 : 18} color="#FFFFFF" /> : <Mic2 size={compact ? 16 : 19} color="#FFFFFF" />}
        <Text keepColor style={[styles.buttonText, compact && styles.buttonTextCompact]}>{listening ? 'تمام شد' : result ? 'دوباره بگو' : 'بگو'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', marginTop: 10, padding: 12, borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', gap: 6 },
  wrapCompact: { marginTop: 8, padding: 8, gap: 4, backgroundColor: 'transparent', borderStyle: 'dashed' },
  buttonCompact: { paddingHorizontal: 14, paddingVertical: 7, marginTop: 0 },
  buttonTextCompact: { fontSize: 13 },
  title: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  hint: { fontSize: 12.5, lineHeight: 20, color: '#475569', textAlign: 'center' },
  wordsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 2 },
  word: { fontSize: 17, fontWeight: '700', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8, overflow: 'hidden', writingDirection: 'ltr' },
  wordOk: { color: '#15803D', backgroundColor: '#DCFCE7' },
  wordMiss: { color: '#B91C1C', backgroundColor: '#FEE2E2' },
  wordNear: { color: '#B45309', backgroundColor: '#FEF3C7' },
  legendRow: { alignItems: 'center', gap: 4 },
  legend: { fontSize: 11, color: '#94A3B8', textAlign: 'center' },
  missedButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' },
  missedText: { fontSize: 12, color: '#B91C1C', fontWeight: '700' },
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
