import { RUSSIAN_LESSONS } from './russian';
import { NEW_COURSES } from './newCourses';
import { CORE_WORDS } from './wordLabCore';
import ruFrequency from '@/lib/content/frequency/ru.json';
import deFrequency from '@/lib/content/frequency/de.json';

/**
 * «واژه‌ها» — the word library behind the word lab, for Russian and German.
 *
 * Words come only from the shipped courses, so every card teaches something the learner has already
 * met in a lesson and keeps the course's own Persian gloss. Cards are ordered by real frequency
 * (`lib/content/frequency/*.json`, wordfreq) and by where the word first appears in the course;
 * generated frequency placeholders with the generic gloss «واژهٔ پرتکرار» are excluded, because
 * they teach a citation form instead of a usable meaning.
 */
export type WordLabLanguage = 'ru' | 'de';

export interface WordLabWord {
  id: string;
  /** The word exactly as it is written in the target language (Russian keeps its stress mark). */
  target: string;
  /** Persian meaning, taken from the lesson that taught the word. */
  fa: string;
  /** Short example from the course, with its own Persian translation. */
  exampleTarget: string;
  exampleFa: string;
  /** One line of help, in Persian only. */
  note: string;
  /** 1-based order inside the lab. */
  order: number;
  /** Rank in the language's open frequency list, when the word is in it. */
  frequencyRank: number | null;
  levelId: number;
  /** Persian respelling of the example sentence, when the card has one (curated core words). */
  examplePronunciation?: string;
  /** True for the curated «واژه‌های مهم» cards that open the lab. */
  curated?: boolean;
}

export const WORD_LAB_SESSION_SIZE = 12;

const GENERIC_GLOSS = /واژهٔ پرتکرار|کلمهٔ پرتکار|پرتکرار/;

/** Words that carry no meaning on their own are skipped: the learner needs a gloss to recall. */
function usableWord(word: string, fa: string): boolean {
  const clean = word.replace(/[^\p{L}\p{N} ]/gu, '').trim();
  return clean.length >= 2 && !GENERIC_GLOSS.test(fa);
}

/** Fold stress marks, case and punctuation so «э́то» and «это» are one card. */
export function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/ё/g, 'е')
    .replace(/[´`’'!?.,;:«»„“”¿¡]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim();
}

const RU_RANK = new Map<string, number>(
  (ruFrequency as readonly string[]).map((word, index) => [normalizeWord(word), index + 1]),
);
const DE_RANK = new Map<string, number>(
  (deFrequency as readonly string[]).map((word, index) => [normalizeWord(word), index + 1]),
);

const RU_NOTES: Record<string, string> = {
  привет: 'دوستانه است؛ در موقعیت رسمی به‌جایش «Здра́вствуйте» بگو.',
  здравствуйте: 'سلام رسمی؛ «в» میان واژه شنیده نمی‌شود.',
  спасибо: 'تشکر روزمرهٔ روسی؛ «б» آخر نرم خوانده می‌شود.',
  пожалуйста: 'هم «لطفاً» است هم «خواهش می‌کنم».',
  да: 'بلهٔ کوتاه؛ با «нет» جفتش کن.',
  нет: 'نهٔ کوتاه؛ با «не» فرق دارد.',
  не: 'منفی‌ساز است و پیش از فعل می‌آید.',
  я: 'ضمیر «من»؛ حرف «я» مثل «یا» خوانده می‌شود.',
  ты: '«تو»ی دوستانه؛ رسمی‌اش «вы» است.',
  вы: 'هم «شما»ی جمع است هم «شما»ی محترمانه.',
  хорошо: 'هم «خوب» است هم «باشه».',
  кофе: 'در روسی معیار مذکر است.',
  пока: 'خداحافظ دوستانه؛ در جای دیگر یعنی «فعلاً».',
};

const DE_NOTES: Record<string, string> = {
  hallo: 'دوستانه و عمومی؛ رسمی‌اش «Guten Tag» است.',
  tschüss: 'خداحافظی دوستانه؛ رسمی‌اش «Auf Wiedersehen» است.',
  danke: '«ممنون»؛ کوتاه و روزمره.',
  bitte: 'هم «لطفاً» است هم «خواهش می‌کنم».',
  ja: 'بلهٔ کوتاه.',
  nein: 'نهٔ کوتاه؛ در گفتار «nein danke» مؤدبانه‌تر است.',
  ich: '«من»؛ در جمله فعل با آن صرف می‌شود.',
  du: '«تو»ی دوستانه؛ رسمی‌اش «Sie» است.',
  sie: 'هم «او (مؤنث)» است هم «آن‌ها»؛ با «Sie»ی رسمی فرق دارد.',
  wasser: 'اسم خنثی است: «das Wasser».',
  buch: 'اسم خنثی است: «das Buch»؛ جمعش «Bücher».',
  haus: 'اسم خنثی است: «das Haus»؛ جمعش «Häuser».',
  schule: 'اسم مؤنث است: «die Schule».',
  mutter: 'اسم مؤنث است: «die Mutter».',
  vater: 'اسم مذکر است: «der Vater».',
  freund: '«دوست (مرد)»؛ مؤنثش «Freundin» است.',
  arbeit: 'اسم مؤنث است: «die Arbeit»؛ یعنی «کار».',
  heute: '«امروز»؛ فردا «morgen» است.',
  morgen: 'هم «فردا» است هم «صبح».',
  deutsch: 'نام زبان با حرف بزرگ نوشته می‌شود: «Deutsch».',
};

/** German nouns that carry a useful article hint in the shipped course; everything else stays a plain gloss. */
const NOUNS = new Set(['wasser', 'buch', 'haus', 'schule', 'mutter', 'vater', 'bruder', 'schwester', 'freund', 'freundin', 'arbeit', 'stadt', 'tag', 'morgen', 'abend', 'nacht', 'jahr', 'zeit', 'kind', 'name', 'stift', 'telefon', 'tisch', 'geld', 'uhr', 'frage', 'wort', 'satz', 'sprache', 'rechnung', 'kaffee', 'tee', 'milch', 'brot']);

function noteFor(language: WordLabLanguage, target: string, fa: string): string {
  const key = normalizeWord(target);
  const notes = language === 'ru' ? RU_NOTES : DE_NOTES;
  const override = notes[key];
  if (override) return override;
  if (language === 'ru' && /[´]/.test(target)) return '«´» علامت تکیه است؛ همان واژه را با همین تکیه بگو.';
  if (language === 'ru' && /[ьъ]/.test(target)) return '«ь/ъ» نشانهٔ سیریلیک است، نه صدای جدا.';
  if (language === 'de' && NOUNS.has(key)) return `اسم است و حرف تعریف می‌گیرد: «${fa}».`;
  return `یعنی «${fa}»؛ یک بار در ${language === 'ru' ? 'روسی' : 'آلمانی'} شنیده می‌شود، بعد معنی فارسی‌اش.`;
}

interface Candidate {
  target: string;
  fa: string;
  exampleTarget: string;
  exampleFa: string;
  levelId: number;
}

function collect(language: WordLabLanguage): Candidate[] {
  const rank = language === 'ru' ? RU_RANK : DE_RANK;
  const out: Candidate[] = [];
  if (language === 'ru') {
    for (const lesson of RUSSIAN_LESSONS) {
      for (const sentence of lesson.sentences) {
        for (const item of sentence.vocabulary ?? []) {
          if (!usableWord(item.word, item.meaning)) continue;
          out.push({ target: item.word, fa: item.meaning, exampleTarget: sentence.text, exampleFa: sentence.fa, levelId: lesson.levelId });
        }
      }
    }
  } else {
    for (const lesson of NEW_COURSES.de.lessons) {
      for (const sentence of lesson.sentences) {
        for (const item of sentence.vocabulary ?? []) {
          if (!usableWord(item.word, item.meaning)) continue;
          out.push({ target: item.word, fa: item.meaning, exampleTarget: sentence.text, exampleFa: sentence.fa, levelId: lesson.levelId });
        }
      }
    }
  }
  // Best example for each word: the first sentence where the word is not the whole sentence.
  const byKey = new Map<string, Candidate>();
  for (const candidate of out) {
    const key = normalizeWord(candidate.target);
    if (!key) continue;
    const existing = byKey.get(key);
    const better = !existing
      || (normalizeWord(existing.exampleTarget) === normalizeWord(existing.target) && normalizeWord(candidate.exampleTarget) !== key)
      || (existing.levelId > candidate.levelId && normalizeWord(existing.exampleTarget) === normalizeWord(existing.target));
    if (better) byKey.set(key, candidate);
  }
  return [...byKey.values()].sort((a, b) => {
    const ra = rank.get(normalizeWord(a.target)) ?? Number.MAX_SAFE_INTEGER;
    const rb = rank.get(normalizeWord(b.target)) ?? Number.MAX_SAFE_INTEGER;
    return ra - rb || a.target.length - b.target.length || a.target.localeCompare(b.target);
  });
}

function buildLab(language: WordLabLanguage): readonly WordLabWord[] {
  const rank = language === 'ru' ? RU_RANK : DE_RANK;
  return collect(language).map((candidate, index) => {
    const key = normalizeWord(candidate.target);
    return {
      id: `${language}-word-${key.replace(/\s+/g, '-')}`,
      target: candidate.target,
      fa: candidate.fa,
      exampleTarget: candidate.exampleTarget,
      exampleFa: candidate.exampleFa,
      note: noteFor(language, candidate.target, candidate.fa),
      order: index + 1,
      frequencyRank: rank.get(key) ?? null,
      levelId: candidate.levelId,
    };
  });
}

/**
 * The curated core comes first, in teaching order, then the rest of the course vocabulary by frequency.
 * A word that is in both lists appears once, with the curated sentence — that is the sentence the lab
 * asks the learner to say back, so it must be a real one.
 */
function withCore(language: WordLabLanguage, words: readonly WordLabWord[]): readonly WordLabWord[] {
  const core = CORE_WORDS[language];
  if (!core.length) return words;
  const curated = new Set(core.map(word => normalizeWord(word.target)));
  const coreCards: WordLabWord[] = core.map((word, index) => ({
    // Same id shape the frequency list used, so a learner who already knows «Hallo» keeps that card.
    id: `${language}-word-${normalizeWord(word.target).replace(/\s+/g, '-')}`,
    target: word.target,
    fa: word.fa,
    exampleTarget: word.sentence,
    exampleFa: word.sentenceFa,
    note: word.note || `از درس «${word.lessonTitle}»`,
    order: index + 1,
    frequencyRank: null,
    levelId: word.levelId,
    // The curated card always carries the full example sentence and its own Persian respelling.
    examplePronunciation: word.sentencePronunciation,
    curated: true,
  } as WordLabWord));
  const rest = words
    .filter(word => !curated.has(normalizeWord(word.target)))
    .map((word, index) => ({ ...word, order: coreCards.length + index + 1 }));
  return [...coreCards, ...rest];
}

export const WORD_LAB_WORDS: Record<WordLabLanguage, readonly WordLabWord[]> = {
  ru: withCore('ru', buildLab('ru')),
  de: withCore('de', buildLab('de')),
};

export const WORD_LAB_LOCALE: Record<WordLabLanguage, string> = { ru: 'ru-RU', de: 'de-DE' };
export const WORD_LAB_NAME: Record<WordLabLanguage, string> = { ru: 'روسی', de: 'آلمانی' };

/** The exact string passed to the speech recogniser; punctuation is ignored by the scorer anyway. */
export function spokenTarget(word: WordLabWord): string {
  return word.target.replace(/[«»„“”!?.,;:¿¡]/g, '').trim();
}

/** A small cue after a weak attempt — never the whole answer. */
export function firstLetterHint(word: WordLabWord): string {
  const clean = spokenTarget(word).replace(/[´`’']/g, '');
  return clean ? `${clean.slice(0, 1)}…` : '…';
}

/**
 * What the learner says out loud in the lab.
 *
 * A curated card is practised as its *sentence* — the word is heard first, then the sentence, then the
 * learner says the sentence — because a single word with a microphone open teaches pronunciation, not
 * use. Cards outside the curated core keep the word itself.
 */
export function spokenSentence(word: WordLabWord): string {
  const raw = word.curated && word.exampleTarget ? word.exampleTarget : word.target;
  return raw.replace(/[«»„“”]/g, '').replace(/\s+/g, ' ').trim();
}

/** The sentence card is only offered when there is a real sentence to say, not the bare word again. */
export function hasSpokenSentence(word: WordLabWord): boolean {
  return !!word.exampleTarget && normalizeWord(word.exampleTarget) !== normalizeWord(word.target)
    && word.exampleTarget.replace(/[^\p{L}\p{N}]/gu, '').length > word.target.replace(/[^\p{L}\p{N}]/gu, '').length + 2;
}

/** A cue for the sentence itself: its Persian translation and, when available, its respelling. */
export function sentenceHint(word: WordLabWord): { fa: string; pronunciation?: string } {
  return { fa: word.exampleFa, pronunciation: word.examplePronunciation };
}
