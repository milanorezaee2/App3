import { LocalizedText as Text } from '@/components/LocalizedText';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { Mic2, RefreshCw, Square, Volume2 } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { toPersianDigits as fa } from '@/lib/format';
import { scoreSpeech, tokens, type SpeakCheckResult, type SpeakWordState } from '@/lib/speechScore';
export { scoreSpeech, type SpeakCheckResult, type SpeakWordState };

function feedbackFor(score: number, nearCount = 0) {
  if (score >= 90) return 'عالی! همهٔ واژه‌ها واضح شنیده شد.';
  if (score >= 70) return 'خوب بود؛ قرمزها را دوباره بگویید.';
  if (score >= 40) return 'بخشی شنیده شد؛ آهسته‌تر و نزدیک‌تر به میکروفن تکرار کنید.';
  return 'واضح شنیده نشد؛ ابتدا نمونه را گوش دهید و دوباره بگویید.';
}

type Props = {
  text: string;
  locale: string;
  accent?: string;
  compact?: boolean;
  title?: string;
  onResult?: (result: SpeakCheckResult) => void;
  /** Opens the microphone by itself once (used right after the app pronounced the word). */
  autoStart?: boolean;
};

/**
 * «بگو» — the learner says the sentence aloud; the device speech recogniser transcribes it and
 * each expected word is shown green (heard) or red (missed) together with a percentage.
 * Works on Android/iOS through the native recogniser and on web through the browser's Web Speech API.
 */
export default function SpeakCheck({ text, locale, accent = '#2563EB', compact = false, title, onResult, autoStart = false }: Props) {
  const [listening, setListening] = useState(false);
  const [partial, setPartial] = useState('');
  const [result, setResult] = useState<SpeakCheckResult | null>(null);
  const [error, setError] = useState('');
  const finalRef = useRef('');
  /** Last transcript of any kind; some Android recognisers end without ever flagging a result as final. */
  const lastHeardRef = useRef('');
  const targetRef = useRef(text);
  targetRef.current = text;

  useEffect(() => { setResult(null); setPartial(''); setError(''); finalRef.current = ''; lastHeardRef.current = ''; }, [text]);
  useEffect(() => () => { void ExpoSpeechRecognitionModule.abort?.(); }, []);
  /** One-tap flow: the word was just spoken, so the mic may open by itself (still cancellable). */
  const autoStartedFor = useRef('');
  const startRef = useRef<null | (() => Promise<void>)>(null);
  useEffect(() => {
    if (!autoStart || !text || autoStartedFor.current === text) return;
    autoStartedFor.current = text;
    const handle = setTimeout(() => { void startRef.current?.(); }, 420);
    return () => clearTimeout(handle);
  }, [autoStart, text]);

  const finish = useCallback((heard: string) => {
    const scored = scoreSpeech(targetRef.current, heard);
    setResult(scored);
    onResult?.(scored);
  }, [onResult]);

  const listeningRef = useRef(false);
  useEffect(() => { listeningRef.current = listening; }, [listening]);
  useSpeechRecognitionEvent('start', () => { setListening(true); setError(''); });
  useSpeechRecognitionEvent('result', event => {
    const alternatives = (event.results ?? []).map(item => item.transcript).filter(Boolean);
    const transcript = alternatives[0] ?? '';
    // Pick the alternative that matches the target best; recognisers rank homophones arbitrarily.
    const ranked = [...alternatives].sort((a, b) => scoreSpeech(targetRef.current, b).score - scoreSpeech(targetRef.current, a).score);
    const bestTranscript = ranked[0] ?? transcript;
    if (bestTranscript) lastHeardRef.current = bestTranscript;
    if (event.isFinal) {
      finalRef.current = bestTranscript;
      // On some devices the final result arrives after «end»; score it now so the attempt is not lost.
      if (!listeningRef.current) finish(bestTranscript);
    } else setPartial(transcript);
  });
  useSpeechRecognitionEvent('end', () => {
    setListening(false);
    setPartial('');
    finish(finalRef.current || lastHeardRef.current);
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
    lastHeardRef.current = '';
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

  startRef.current = start;
  const stop = useCallback(() => { ExpoSpeechRecognitionModule.stop(); }, []);
  const sayWord = useCallback((word: string) => { try { Speech.stop(); Speech.speak(word, { language: locale, rate: 0.6 }); } catch { /* no tts */ } }, [locale]);
  const missed = result ? result.words.filter(w => w.state !== 'ok' && tokens(w.word).length) : [];
  const sayMissed = useCallback(() => { if (!missed.length) return; try { Speech.stop(); Speech.speak(missed.map(w => w.word).join(', '), { language: locale, rate: 0.6 }); } catch { /* no tts */ } }, [missed, locale]);

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      {!compact && <Text style={styles.title}>{title ?? 'بگو · Speak'}</Text>}
      {(listening || result) ? <Text style={styles.hint}>{listening ? 'در حال شنیدن…' : result ? feedbackFor(result.score, result.words.filter(w => w.state === 'near').length) : ''}</Text> : null}
      {result ? (
        <View style={styles.wordsRow}>
          {result.words.map((item, index) => <Pressable key={`${item.word}-${index}`} accessibilityRole="button" accessibilityLabel={`شنیدن آهستهٔ ${item.word}`} onPress={() => sayWord(item.word)}><Text keepColor style={[styles.word, item.state === 'ok' ? styles.wordOk : item.state === 'near' ? styles.wordNear : styles.wordMiss]}>{item.word}</Text></Pressable>)}
        </View>
      ) : null}
      {listening && partial ? <Text keepColor style={styles.partial}>{partial}</Text> : null}
      {result ? <View style={styles.scoreRow}><Text style={styles.scoreLabel}>امتیاز</Text><Text keepColor style={[styles.scoreValue, { color: result.score >= 70 ? '#15803D' : result.score >= 40 ? '#B45309' : '#B91C1C' }]}>{fa(result.score)}٪</Text></View> : null}
      {/* When the recogniser heard nothing, a percentage would be a fake zero. Say it plainly instead. */}
      {result && !result.heard ? <Text style={styles.hint}>چیزی شنیده نشد. ابتدا نمونه را گوش بده و یک بار دیگر بگو.</Text> : null}
      {result && result.heard ? <Text style={styles.heard}>شنیده شد: <Text keepColor style={styles.heardText}>{result.heard}</Text></Text> : null}
      {result && missed.length ? <View style={styles.legendRow}>
        <Pressable accessibilityRole="button" onPress={sayMissed} style={styles.missedButton}><Volume2 size={14} color="#B91C1C" /><Text keepColor style={styles.missedText}>{missed.length === 1 ? 'همین یک واژه را بشنو و دوباره بگو' : `این ${fa(missed.length)} واژه را بشنو و دوباره بگو`}</Text></Pressable>

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
  wordsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 2, width: '100%' },
  // «Thank» and «you.» must each stay whole: the chip may move to the next line, its letters may not.
  word: { fontSize: 17, lineHeight: 24, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, overflow: 'hidden', writingDirection: 'ltr', textAlign: 'left', flexShrink: 0 },
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
  scoreValue: { fontSize: 22, lineHeight: 30, fontWeight: '800', color: '#B91C1C', textAlign: 'right', writingDirection: 'rtl' },
  heard: { fontSize: 12, color: '#64748B', textAlign: 'center' },
  heardText: { color: '#334155', fontWeight: '700' },
  error: { fontSize: 12, lineHeight: 19, color: '#B91C1C', textAlign: 'center' },
  button: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 22, paddingVertical: 11, borderRadius: 999, marginTop: 4 },
  buttonPressed: { opacity: 0.85 },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
