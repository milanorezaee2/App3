import SpeakCheck, { type SpeakCheckResult } from '@/components/SpeakCheck';
import { LocalizedText as Text } from '@/components/LocalizedText';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { CheckCircle2, ChevronLeft, Volume2, XCircle } from 'lucide-react-native';
import type { LearningLesson } from '@/lib/languages/types';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { Typography } from '@/lib/theme';
import { toPersianDigits as fa } from '@/lib/format';

/**
 * Guided dialogue practice shared by every non-English course.
 *
 * The Russian and Turkish versions of this screen were byte-identical apart
 * from one hint sentence, so the layout lives here once and each course passes
 * its own `languageLabel` (used only in that hint).
 */

export type DialogueMode = 'guide' | 'cloze' | 'free';
const MODE_META: Record<DialogueMode, { label: string; hint: string }> = {
  guide: { label: 'راهنما', hint: 'خط تو پنهان است؛ از روی فارسی بگو، بعد نمونه را ببین.' },
  cloze: { label: 'جای‌خالی', hint: 'واژه‌های کلیدیِ خط تو حذف شده‌اند؛ کل جمله را بگو — فقط کلیدی‌ها باید شنیده شوند.' },
  free: { label: 'آزاد', hint: 'فقط منظور را می‌بینی؛ با هر جمله‌ای که بلدی بگو. اگر بیشتر واژه‌های اصلی را بگویی، قبول است.' },
};

/** Strip combining stress marks (Russian «а́») so words compare and cloze cleanly. */
const plain = (text: string) => text.normalize('NFC').replace(/[\u0300\u0301]/g, '');
const clean = (word: string) => plain(word).replace(/[^\p{L}\p{N}'’-]/gu, '');

/** Content words that carry the line's meaning: the longest 1–2 words with 4+ letters (stress-free form). */
function keywordsOf(text: string): string[] {
  const words = text.split(/\s+/).map(clean).filter(w => w.length >= 4);
  const sorted = [...new Set(words)].sort((a, b) => b.length - a.length);
  return sorted.slice(0, words.length >= 4 ? 2 : 1);
}
function clozeOf(text: string, keywords: string[]): string {
  return plain(text).split(/(\s+)/).map(part => { const word = clean(part); return keywords.includes(word) ? part.replace(word, '_'.repeat(Math.max(3, word.length))) : part; }).join('');
}
function judge(mode: DialogueMode, result: SpeakCheckResult, keywords: string[]): boolean {
  const scored = result.words.filter(w => /[\p{L}]/u.test(w.word));
  const okWords = scored.filter(w => w.ok).map(w => clean(w.word));
  const keywordsOk = keywords.every(k => okWords.includes(k));
  if (mode === 'cloze') return keywordsOk;
  if (mode === 'free') return keywordsOk || (scored.length > 0 && okWords.length / scored.length >= 0.6);
  return result.score >= 70;
}

export default function LanguageDialoguePractice({ dialogue, onSpeak, languageLabel, locale, productive = false, defaultMode = 'guide' }: {
  dialogue: LearningLesson['dialogue'];
  onSpeak: (text: string) => void;
  /** Course name in Persian, e.g. "روسی" or "ترکی". Used in the recall hint. */
  languageLabel: string;
  /** BCP-47 locale for the speech recogniser; when set, the learner's lines get a «بگو» check. */
  locale?: string;
  /** Enables the productive modes (cloze / free) on top of the guided one. Needs `locale`. */
  productive?: boolean;
  defaultMode?: DialogueMode;
}) {
  const [mode, setMode] = useState<DialogueMode>(productive && locale ? defaultMode : 'guide');
  const [verdict, setVerdict] = useState<null | boolean>(null);
  const [attempted, setAttempted] = useState(false);
  const speakers = [...new Set(dialogue.map(line => line.speaker))];
  const [myRole, setMyRole] = useState(speakers[0]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const current = dialogue[index];
  const isMyLine = current?.speaker === myRole;

  const keywords = current ? keywordsOf(current.text) : [];
  const resetLine = () => { setRevealed(false); setVerdict(null); setAttempted(false); };
  const restart = () => { setIndex(0); resetLine(); };
  const advance = () => { resetLine(); setIndex(value => Math.min(value + 1, dialogue.length - 1)); };
  const changeMode = (next: DialogueMode) => { setMode(next); resetLine(); };
  const onResult = (result: SpeakCheckResult) => { setAttempted(true); setVerdict(judge(mode, result, keywords)); setRevealed(true); };
  const productiveMode = productive && !!locale && mode !== 'guide';
  const changeRole = (role: string) => { setMyRole(role); restart(); };

  return (
    <View style={styles.card}>
      <View style={styles.metaRow}><Text style={styles.counter}>{fa(index + 1)} / {fa(dialogue.length)}</Text></View>
      {productive && locale ? <View style={styles.modeRow}>{(['guide', 'cloze', 'free'] as DialogueMode[]).map(item => <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected: mode === item }} onPress={() => changeMode(item)} style={[styles.modeButton, mode === item && styles.modeButtonActive]}><Text style={[styles.modeText, mode === item && styles.modeTextActive]}>{MODE_META[item].label}</Text></Pressable>)}</View> : null}
      <Text style={styles.instruction}>{productive && locale ? MODE_META[mode].hint : 'نقش خود را انتخاب کنید و پاسخ را بلند بگویید.'}</Text>
      <View style={styles.roleRow}>{speakers.map(speaker => <Pressable key={speaker} accessibilityRole="button" accessibilityState={{ selected: myRole === speaker }} onPress={() => changeRole(speaker)} style={[styles.roleButton, myRole === speaker && styles.roleButtonActive]}><Text style={[styles.roleText, myRole === speaker && styles.roleTextActive]}>{speaker}</Text></Pressable>)}</View>
      {current && <View style={[styles.bubble, isMyLine ? styles.bubbleLearner : styles.bubblePartner]}>
        <Text style={styles.speaker}>{isMyLine ? 'نوبت شما' : current.speaker}</Text>
        {isMyLine
          ? <>
              <Text style={styles.persian}>{mode === 'free' && productiveMode ? `بگو: ${current.fa}` : current.fa}</Text>
              {revealed ? <Text style={styles.target}>{current.text}</Text>
                : productiveMode && mode === 'cloze' ? <Text style={styles.target}>{clozeOf(current.text, keywords)}</Text>
                : productiveMode && mode === 'free' ? <Text style={styles.hint}>متن پنهان است. با واژه‌های خودت بگو؛ بعد از گفتن، نمونه ظاهر می‌شود.</Text>
                : <Text style={styles.hint}>اول جملهٔ {languageLabel} را از حافظه بگویید، سپس نمونه را ببینید.</Text>}
            </>
          : <><Text style={styles.target}>{current.text}</Text><Text style={styles.persian}>{current.fa}</Text></>}
        {isMyLine && productiveMode && locale && !attempted ? <SpeakCheck key={`${mode}-${index}-${current.text}`} text={current.text} locale={locale} accent={Palette.success} title={mode === 'cloze' ? 'کل جمله را بگو' : 'منظورت را بگو'} onResult={onResult} /> : null}
        {isMyLine && productiveMode && verdict !== null ? <View style={[styles.verdict, verdict ? styles.verdictOk : styles.verdictMiss]}>
          {verdict ? <CheckCircle2 size={16} color="#15803D" /> : <XCircle size={16} color="#B91C1C" />}
          <Text keepColor style={[styles.verdictText, { color: verdict ? '#15803D' : '#B91C1C' }]}>{verdict ? (mode === 'free' ? 'قبول! منظورت رسید.' : 'قبول! واژه‌های کلیدی شنیده شد.') : (mode === 'free' ? 'هنوز نه؛ نمونه را ببین و دوباره تلاش کن.' : `واژه‌های کلیدی (${keywords.join('، ')}) شنیده نشد؛ دوباره.`)}</Text>
        </View> : null}
        {isMyLine && productiveMode && attempted ? <Pressable accessibilityRole="button" style={styles.revealButton} onPress={resetLine}><Text style={styles.revealText}>دوباره تلاش کن</Text></Pressable> : null}
        {isMyLine && !revealed && !productiveMode
          ? <Pressable accessibilityRole="button" style={styles.revealButton} onPress={() => setRevealed(true)}><Text style={styles.revealText}>نمایش پاسخ نمونه</Text></Pressable>
          : (!isMyLine || revealed) ? <Pressable accessibilityRole="button" accessibilityLabel={`شنیدن: ${current.text}`} style={styles.soundButton} onPress={() => onSpeak(current.text)}><Volume2 size={17} color={Palette.primary} /><Text style={styles.soundText}>{isMyLine ? 'شنیدن پاسخ' : 'شنیدن طرف مقابل'}</Text></Pressable> : null}
        {isMyLine && revealed && locale && !productiveMode ? <SpeakCheck key={`${index}-${current.text}`} text={current.text} locale={locale} accent={Palette.success} /> : null}
      </View>}
      {isMyLine && !revealed && !(productiveMode && attempted) ? null : index < dialogue.length - 1
        ? <Pressable accessibilityRole="button" style={styles.nextButton} onPress={advance}><Text style={styles.nextText}>{isMyLine ? 'گفتم؛ ادامه' : 'ادامهٔ گفت‌وگو'}</Text><ChevronLeft size={18} color="#FFFFFF" /></Pressable>
        : <><Pressable accessibilityRole="button" style={styles.restartButton} onPress={restart}><Text style={styles.restartText}>تمرین دوباره از آغاز</Text></Pressable></>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', backgroundColor: Palette.surface, borderRadius: 18, borderWidth: 1, borderColor: Palette.border, padding: 16, gap: 12, marginTop: 18 },
  metaRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  kicker: { flex: 1, fontFamily: Typography.fontFamily, fontSize: 12, fontWeight: '400', color: Palette.primary, textAlign: 'right', writingDirection: 'rtl' },
  counter: { fontFamily: Typography.fontFamily, fontSize: 11, fontWeight: '400', color: Palette.muted },
  instruction: { fontFamily: Typography.fontFamily, fontSize: 14, lineHeight: 23, color: Palette.text, textAlign: 'right', writingDirection: 'rtl' },
  roleRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 7 },
  roleButton: { minHeight: 38, paddingHorizontal: 12, borderRadius: 11, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  roleButtonActive: { backgroundColor: Palette.primarySoft, borderColor: Palette.primary },
  roleText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 11, writingDirection: 'rtl' },
  roleTextActive: { color: Palette.primaryDark, fontWeight: '800' },
  bubble: { width: '94%', borderRadius: 15, borderWidth: 1, padding: 14, gap: 7 },
  bubblePartner: { alignSelf: 'flex-start', borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, borderBottomLeftRadius: 5 },
  bubbleLearner: { alignSelf: 'flex-end', borderColor: '#DDE2FF', backgroundColor: Palette.primarySoft, borderBottomRightRadius: 5 },
  speaker: { fontFamily: Typography.fontFamily, fontSize: 11, color: Palette.primaryDark, textAlign: 'right', writingDirection: 'rtl' },
  target: { fontFamily: 'Times New Roman', fontSize: 16, fontWeight: '800', lineHeight: 27, color: Palette.ink, textAlign: 'right', writingDirection: 'ltr' },
  persian: { fontFamily: Typography.fontFamily, fontSize: 14, lineHeight: 23, color: Palette.text, textAlign: 'right', writingDirection: 'rtl' },
  hint: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: Palette.muted, textAlign: 'right', writingDirection: 'rtl' },
  soundButton: { alignSelf: 'flex-start', minHeight: 34, flexDirection: 'row-reverse', alignItems: 'center', gap: 5 },
  soundText: { fontFamily: Typography.fontFamily, fontSize: 12, color: Palette.primary, writingDirection: 'rtl' },
  revealButton: { minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, paddingHorizontal: 12, marginTop: 4 },
  revealText: { fontFamily: Typography.fontFamily, fontSize: 13, fontWeight: '400', color: Palette.primaryDark, writingDirection: 'rtl' },
  nextButton: { minHeight: 46, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, backgroundColor: Palette.primary, paddingHorizontal: 14 },
  nextText: { fontFamily: Typography.fontFamily, fontSize: 14, fontWeight: '400', color: '#FFFFFF', writingDirection: 'rtl' },
  restartButton: { minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 11, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted },
  restartText: { fontFamily: Typography.fontFamily, fontSize: 12, fontWeight: '400', color: Palette.primaryDark, writingDirection: 'rtl' },
  modeRow: { flexDirection: 'row-reverse', gap: 8 },
  modeButton: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 2, borderColor: Palette.primary, backgroundColor: Palette.surface },
  modeButtonActive: { backgroundColor: Palette.primary },
  modeText: { fontFamily: Typography.fontFamily, fontSize: 13, color: Palette.primary },
  modeTextActive: { color: '#FFFFFF' },
  verdict: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  verdictOk: { backgroundColor: '#ECFDF5' },
  verdictMiss: { backgroundColor: '#FEF2F2' },
  verdictText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  note: { fontFamily: Typography.fontFamily, fontSize: 11, lineHeight: 18, color: Palette.muted, textAlign: 'right', writingDirection: 'rtl' },
});
