import SpeakCheck, { type SpeakCheckResult } from '@/components/SpeakCheck';
import { LocalizedText as Text } from '@/components/LocalizedText';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { CheckCircle2, ChevronLeft, GitBranch, Volume2, XCircle } from 'lucide-react-native';
import type { LearningLesson } from '@/lib/languages/types';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { Typography } from '@/lib/theme';
import { toPersianDigits as fa } from '@/lib/format';
import { fillLine, followUpLanguageFromLocale, followUpMoves, type FollowUpOption } from '@/lib/dialogueFollowUps';

/**
 * Guided dialogue practice shared by every non-English course.
 *
 * The Russian and Turkish versions of this screen were byte-identical apart
 * from one hint sentence, so the layout lives here once and each course passes
 * its own `languageLabel` (used only in that hint).
 */

export type DialogueMode = 'guide' | 'cloze' | 'free';
/** Default productive mode by course level: beginners see the guided mode, A2–B1 cloze, higher free. */
export const modeForLevel = (levelId: number): DialogueMode => levelId <= 0 ? 'guide' : levelId <= 2 ? 'cloze' : 'free';
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

type ChoiceOption = { text: string; fa: string; after: { text: string; fa: string } };
type DialogueLine = LearningLesson['dialogue'][number] & { branch?: 'partner' | 'reply' | 'choice' | 'after'; options?: readonly [ChoiceOption, ChoiceOption] };
type PoolSentence = { text: string; fa: string };

const contentWords = (text: string) => new Set(text.split(/\s+/).map(clean).filter(w => w.length >= 4).map(w => w.toLowerCase()));
const overlap = (a: string, b: string) => { const A = contentWords(a); let n = 0; for (const w of contentWords(b)) if (A.has(w)) n++; return n; };

/**
 * Branching: at up to two partner lines, insert an unexpected follow-up question drawn from the
 * lesson's own sentences (topic-matched by shared content words) plus the lesson sentence that best
 * answers it as the learner's expected reaction. No new content is written; when nothing matches,
 * the dialogue stays linear. `variant` alternates the path on every restart.
 */
function branchDialogue(base: readonly DialogueLine[], pool: readonly PoolSentence[], myRole: string, variant: number): DialogueLine[] {
  if (variant % 2 === 0 || pool.length < 4) return [...base];
  const inDialogue = new Set(base.map(line => plain(line.text)));
  const questions = pool.filter(item => /\?\s*$/.test(item.text) && !inDialogue.has(plain(item.text)));
  const answers = pool.filter(item => !/\?\s*$/.test(item.text) && !inDialogue.has(plain(item.text)));
  if (!questions.length || !answers.length) return [...base];
  const out: DialogueLine[] = [];
  const used = new Set<string>();
  let inserted = 0;
  base.forEach((line, index) => {
    out.push(line);
    const isPartner = line.speaker !== myRole;
    const nextIsMine = base[index + 1]?.speaker === myRole;
    if (!isPartner || !nextIsMine || inserted >= 1) return;
    const topic = `${line.text} ${base[index + 1]?.text ?? ''} ${base[index - 1]?.text ?? ''}`;
    // Every pool sentence is on the lesson's topic; shared words only decide the order.
    const ranked = questions.filter(q => !used.has(q.text)).map(q => ({ q, score: overlap(topic, q.text) })).sort((a, b) => b.score - a.score);
    const pick = ranked[(variant >> 1) % Math.max(1, ranked.length)]?.q;
    if (!pick) return;
    const byOverlap = answers.filter(a => !used.has(a.text)).map(a => ({ a, score: overlap(pick.text, a.text) })).sort((x, y) => y.score - x.score)[0];
    // Lessons usually list the answer right after its question; use that when words do not overlap.
    const following = pool[pool.findIndex(item => item.text === pick.text) + 1];
    const reply = byOverlap && byOverlap.score > 0 ? byOverlap.a : following && !/\?\s*$/.test(following.text) && !used.has(following.text) ? following : undefined;
    if (!reply) return;
    used.add(pick.text); used.add(reply.text);
    out.push({ speaker: line.speaker, text: pick.text, fa: pick.fa, branch: 'partner' });
    out.push({ speaker: myRole, text: reply.text, fa: reply.fa, branch: 'reply' });
    inserted++;
  });
  return out;
}

/**
 * Choice branch available in every language: right after one of the learner's lines the partner asks
 * for a repeat / confirmation / slower pace. The learner picks one of two reactions and the partner
 * acknowledges each one differently, then the scripted dialogue resumes. `chosen` (per restart) turns
 * the placeholder choice line into the picked reaction followed by the partner's acknowledgement.
 */
function choiceBranch(lines: readonly DialogueLine[], myRole: string, locale: string | undefined, variant: number, chosen: number | null): DialogueLine[] {
  const language = followUpLanguageFromLocale(locale);
  if (variant % 2 === 0 || !language) return [...lines];
  const partner = lines.find(line => line.speaker !== myRole)?.speaker;
  const spots = lines.map((line, i) => i).filter(i => lines[i].speaker === myRole && !lines[i].branch && i < lines.length - 1 && lines[i + 1].speaker !== myRole);
  if (!partner || !spots.length) return [...lines];
  const turn = variant >> 1;
  const at = spots[turn % spots.length];
  const moves = followUpMoves(language);
  const move = moves[(turn + at) % moves.length];
  const line = lines[at].text;
  const options = move.options.map(option => ({ text: fillLine(option.text, line), fa: option.fa.replace('{line}', line), after: option.after })) as unknown as [ChoiceOption, ChoiceOption];
  const picked = chosen === null ? null : options[chosen];
  const out = [...lines];
  out.splice(at + 1, 0,
    { speaker: partner, text: fillLine(move.ask, line), fa: move.askFa.replace('{line}', line), branch: 'partner' },
    picked ? { speaker: myRole, text: picked.text, fa: picked.fa, branch: 'reply' } : { speaker: myRole, text: '', fa: '', branch: 'choice', options },
    ...(picked ? [{ speaker: partner, text: picked.after.text, fa: picked.after.fa, branch: 'after' as const }] : []));
  return out;
}

export default function LanguageDialoguePractice({ dialogue, onSpeak, languageLabel, locale, productive = false, defaultMode = 'guide', branchPool, fixedRole, autoPlayPartner = false }: {
  dialogue: LearningLesson['dialogue'];
  onSpeak: (text: string) => void;
  /** Course name in Persian, e.g. "روسی" or "ترکی". Used in the recall hint. */
  languageLabel: string;
  /** BCP-47 locale for the speech recogniser; when set, the learner's lines get a «بگو» check. */
  locale?: string;
  /** Enables the productive modes (cloze / free) on top of the guided one. Needs `locale`. */
  productive?: boolean;
  defaultMode?: DialogueMode;
  /** Lesson sentences used to build unexpected branches; omit for a strictly linear dialogue. */
  branchPool?: readonly PoolSentence[];
  /** When set, the learner always plays this speaker and the role switcher is hidden (English). */
  fixedRole?: string;
  /** Speak the partner's line automatically when it appears (English behaviour). */
  autoPlayPartner?: boolean;
}) {
  const [variant, setVariant] = useState(0);
  const [mode, setMode] = useState<DialogueMode>(productive && locale ? defaultMode : 'guide');
  const [verdict, setVerdict] = useState<null | boolean>(null);
  const [attempted, setAttempted] = useState(false);
  const speakers = [...new Set(dialogue.map(line => line.speaker))];
  const [myRole, setMyRole] = useState(fixedRole ?? speakers[0]);
  const baseDialogue = dialogue;
  const [chosen, setChosen] = useState<number | null>(null);
  const lines = useMemo(() => choiceBranch(branchPool ? branchDialogue(baseDialogue as DialogueLine[], branchPool, myRole, variant) : [...(baseDialogue as DialogueLine[])], myRole, locale, variant, chosen), [baseDialogue, branchPool, myRole, variant, locale, chosen]);
  const hasBranch = lines.some(line => line.branch);
  const canBranch = (!!branchPool && branchDialogue(baseDialogue as DialogueLine[], branchPool, myRole, 1).some(line => line.branch)) || choiceBranch(baseDialogue as DialogueLine[], myRole, locale, 1, null).some(line => line.branch);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const current = lines[index];
  const isMyLine = current?.speaker === myRole;

  const keywords = current ? keywordsOf(current.text) : [];
  const resetLine = () => { setRevealed(false); setVerdict(null); setAttempted(false); };
  const restart = () => { setIndex(0); setChosen(null); resetLine(); };
  const restartOtherPath = () => { setVariant(value => value + 1); setIndex(0); setChosen(null); resetLine(); };
  const isChoice = current?.branch === 'choice';
  const choose = (option: number) => { setChosen(option); setRevealed(true); };
  const advance = () => { resetLine(); setIndex(value => Math.min(value + 1, lines.length - 1)); };
  const changeMode = (next: DialogueMode) => { setMode(next); resetLine(); };
  const onResult = (result: SpeakCheckResult) => { setAttempted(true); setVerdict(judge(mode, result, keywords)); setRevealed(true); };
  const productiveMode = productive && !!locale && mode !== 'guide';
  const changeRole = (role: string) => { setMyRole(role); restart(); };
  useEffect(() => { if (autoPlayPartner && current && !isMyLine) onSpeak(current.text); }, [autoPlayPartner, current, isMyLine]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={styles.card}>
      <View style={styles.metaRow}>
        <Text style={styles.counter}>{fa(index + 1)} / {fa(lines.length)}</Text>
        {canBranch ? <View style={styles.pathRow}>
          <Pressable accessibilityRole="button" accessibilityState={{ selected: !hasBranch }} onPress={() => { if (hasBranch) restartOtherPath(); }} style={[styles.pathButton, !hasBranch && styles.pathButtonActive]}><Text style={[styles.pathText, !hasBranch && styles.pathTextActive]}>مسیر اصلی</Text></Pressable>
          <Pressable accessibilityRole="button" accessibilityState={{ selected: hasBranch }} onPress={() => { if (!hasBranch) restartOtherPath(); }} style={[styles.pathButton, hasBranch && styles.pathButtonBranch]}><GitBranch size={12} color={hasBranch ? '#FFFFFF' : '#7C3AED'} /><Text style={[styles.pathText, { color: hasBranch ? '#FFFFFF' : '#7C3AED' }]}>با سؤال غیرمنتظره</Text></Pressable>
        </View> : null}
      </View>
      {canBranch && hasBranch ? <Text style={styles.branchIntro}>در این مسیر، طرف مقابل وسط گفت‌وگو چیزی می‌گوید که در متن اصلی نیست؛ تو از بین دو واکنش یکی را انتخاب می‌کنی و طرف مقابل به همان جواب می‌دهد. خط‌های تازه با رنگ بنفش مشخص‌اند.</Text> : null}
      {productive && locale ? <View style={styles.modeRow}>{(['guide', 'cloze', 'free'] as DialogueMode[]).map(item => <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected: mode === item }} onPress={() => changeMode(item)} style={[styles.modeButton, mode === item && styles.modeButtonActive]}><Text style={[styles.modeText, mode === item && styles.modeTextActive]}>{MODE_META[item].label}</Text></Pressable>)}</View> : null}
      <Text style={styles.instruction}>{productive && locale ? MODE_META[mode].hint : 'نقش خود را انتخاب کنید و پاسخ را بلند بگویید.'}</Text>
      {fixedRole ? null : <View style={styles.roleRow}>{speakers.map(speaker => <Pressable key={speaker} accessibilityRole="button" accessibilityState={{ selected: myRole === speaker }} onPress={() => changeRole(speaker)} style={[styles.roleButton, myRole === speaker && styles.roleButtonActive]}><Text style={[styles.roleText, myRole === speaker && styles.roleTextActive]}>{speaker}</Text></Pressable>)}</View>}
      {current && <View style={[styles.bubble, isMyLine ? styles.bubbleLearner : styles.bubblePartner, current.branch ? styles.bubbleBranch : null]}>
        <Text style={styles.speaker}>{isMyLine ? 'نوبت شما' : current.speaker}</Text>
        {current.branch === 'partner' ? <View style={styles.branchNote}><GitBranch size={13} color="#7C3AED" /><Text style={styles.branchNoteText}>سؤال غیرمنتظره — این خط در متن اصلی نبود.</Text></View> : null}
        {current.branch === 'reply' ? <View style={styles.branchNote}><GitBranch size={13} color="#7C3AED" /><Text style={styles.branchNoteText}>{chosen !== null ? 'واکنشی که انتخاب کردی؛ حالا بلند بگو.' : 'جوابِ پیشنهادی از جمله‌های همین درس است.'}</Text></View> : null}
        {current.branch === 'after' ? <View style={styles.branchNote}><GitBranch size={13} color="#7C3AED" /><Text style={styles.branchNoteText}>واکنش طرف مقابل به انتخاب تو.</Text></View> : null}
        {isChoice
          ? <>
              <Text style={styles.persian}>چطور جواب می‌دهی؟ یکی را انتخاب کن:</Text>
              {current.options?.map((option, i) => <Pressable key={i} accessibilityRole="button" style={styles.choiceButton} onPress={() => choose(i)}><Text style={styles.choiceText}>{option.text}</Text><Text style={styles.choiceFa}>{option.fa}</Text></Pressable>)}
            </>
          : isMyLine
          ? <>
              <Text style={styles.persian}>{mode === 'free' && productiveMode ? `بگو: ${current.fa}` : current.fa}</Text>
              {revealed ? <Text style={styles.target}>{current.text}</Text>
                : productiveMode && mode === 'cloze' ? <Text style={styles.target}>{clozeOf(current.text, keywords)}</Text>
                : productiveMode && mode === 'free' ? <Text style={styles.hint}>متن پنهان است. با واژه‌های خودت بگو؛ بعد از گفتن، نمونه ظاهر می‌شود.</Text>
                : <Text style={styles.hint}>اول جملهٔ {languageLabel} را از حافظه بگویید، سپس نمونه را ببینید.</Text>}
            </>
          : <><Text style={styles.target}>{current.text}</Text><Text style={styles.persian}>{current.fa}</Text></>}
        {isChoice ? null : <>
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
        </>}
      </View>}
      {isChoice || (isMyLine && !revealed && !(productiveMode && attempted)) ? null : index < lines.length - 1
        ? <Pressable accessibilityRole="button" style={styles.nextButton} onPress={advance}><Text style={styles.nextText}>{isMyLine ? 'گفتم؛ ادامه' : 'ادامهٔ گفت‌وگو'}</Text><ChevronLeft size={18} color="#FFFFFF" /></Pressable>
        : <>
            {canBranch ? <Pressable accessibilityRole="button" style={styles.branchButton} onPress={restartOtherPath}><GitBranch size={16} color="#FFFFFF" /><Text style={styles.branchButtonText}>{hasBranch ? 'دوباره، مسیر اصلی' : 'دوباره، با سؤال غیرمنتظره'}</Text></Pressable> : null}
            <Pressable accessibilityRole="button" style={styles.restartButton} onPress={restart}><Text style={styles.restartText}>تمرین دوباره از آغاز</Text></Pressable>
          </>}
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
  choiceButton: { borderWidth: 1, borderColor: '#C4B5FD', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 11, gap: 3 },
  choiceText: { fontFamily: 'Times New Roman', fontSize: 15, fontWeight: '800', lineHeight: 24, color: Palette.ink, textAlign: 'right', writingDirection: 'ltr' },
  choiceFa: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: Palette.muted, textAlign: 'right', writingDirection: 'rtl' },
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
  pathRow: { flexDirection: 'row-reverse', gap: 6 },
  pathButton: { minHeight: 30, flexDirection: 'row-reverse', alignItems: 'center', gap: 4, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surface },
  pathButtonActive: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  pathButtonBranch: { backgroundColor: '#7C3AED', borderColor: '#7C3AED' },
  pathText: { fontFamily: Typography.fontFamily, fontSize: 11, color: Palette.text, writingDirection: 'rtl' },
  pathTextActive: { color: '#FFFFFF' },
  branchIntro: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: '#5B21B6', textAlign: 'right', writingDirection: 'rtl', backgroundColor: '#F5F3FF', borderRadius: 10, padding: 10 },
  bubbleBranch: { borderColor: '#7C3AED', borderWidth: 2 },
  branchPill: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: '#F5F3FF', borderWidth: 1, borderColor: '#DDD6FE' },
  branchPillText: { fontFamily: Typography.fontFamily, fontSize: 10, color: '#6D28D9' },
  branchNote: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, borderRadius: 8, backgroundColor: '#F5F3FF', paddingHorizontal: 8, paddingVertical: 5 },
  branchNoteText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: 11, lineHeight: 17, color: '#5B21B6', textAlign: 'right', writingDirection: 'rtl' },
  branchButton: { minHeight: 46, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, backgroundColor: '#7C3AED' },
  branchButtonText: { fontFamily: Typography.fontFamily, fontSize: 14, color: '#FFFFFF', writingDirection: 'rtl' },
  note: { fontFamily: Typography.fontFamily, fontSize: 11, lineHeight: 18, color: Palette.muted, textAlign: 'right', writingDirection: 'rtl' },
});
