/**
 * «واژه‌های مهم» — the curated core of the German and Russian word lab.
 *
 * The lab used to be a plain frequency list. Frequency is a good tie-breaker, not a syllabus: it put
 * function words such as «und», «nicht» or «не» first, and a card could show a one-word example that
 * taught nothing. This module names, per language and in teaching order, the words a beginner must own
 * first — greetings, politeness, numbers, family, food, time, places, travel, money, health — and gives
 * each one a real sentence of the shipped course to say back.
 *
 * Nothing here is typed twice by hand:
 *   • the word must be a vocabulary row of the course, so its Persian gloss comes from the course;
 *   • the example must be a sentence of the course that contains the word, so its Persian translation
 *     and its Persian respelling come from the course as well;
 *   • only Pre-A1 and A1 sentences are used, and a sentence that is merely the word itself is rejected —
 *     the learner always has a sentence to repeat.
 * A target that cannot satisfy these rules is dropped rather than shown half-correct, and
 * `scripts/verify-word-lab-core.mjs` prints both the accepted words and the dropped targets.
 */
import { NEW_COURSES } from './newCourses';
import { RUSSIAN_LESSONS } from './russian';

export type WordLabLanguageId = 'de' | 'ru';

export interface CoreWord {
  id: string;
  /** The word as the course writes it (German keeps its capital letter, Russian its stress mark). */
  target: string;
  /** Persian meaning, copied from the course vocabulary row that taught the word. */
  fa: string;
  /** A real sentence of the course that uses the word. */
  sentence: string;
  /** Persian translation of `sentence`, copied from the course. */
  sentenceFa: string;
  /** Persian respelling of `sentence`, copied from the course. */
  sentencePronunciation: string;
  /** The lesson the sentence comes from, shown as «از درس …». */
  lessonTitle: string;
  levelId: number;
  /** Short Persian cue (article, register, irregular form), only where the word needs one. */
  note: string;
  /** 1-based position in the curated order. */
  order: number;
}

/** The teaching order of the German core. Nouns are listed without their article. */
const DE_TARGETS: readonly string[] = [
  // سلام، ادب و پاسخ کوتاه
  'Hallo', 'Guten Tag', 'Guten Morgen', 'Tschüss', 'Auf Wiedersehen', 'Danke', 'bitte', 'Entschuldigung', 'Ja', 'nein',
  // خودم و مخاطبم
  'Ich', 'Du', 'Sie', 'bin', 'ist', 'mein', 'dein', 'Name', 'heiße', 'komme', 'wohne', 'wohnt',
  // عدد
  'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'zehn', 'zwölf',
  // کافه و غذا
  'Wasser', 'Tee', 'Kaffee', 'Milch', 'Brot', 'Kuchen', 'Frühstück', 'essen', 'trinken', 'möchte', 'möchten', 'Rechnung', 'Euro',
  // خانواده و افراد
  'Familie', 'Mutter', 'Vater', 'Schwester', 'Kind', 'Kinder', 'Sohn', 'Eltern', 'Freundin',
  // خانه و وسایل
  'Haus', 'Hause', 'Wohnung', 'Zimmer', 'Küche', 'Bad', 'Tisch', 'Bett', 'Fenster', 'Tür', 'Buch', 'Telefon', 'Handy', 'Tasche', 'Schlüssel',
  // زمان
  'Zeit', 'Tag', 'heute', 'morgen', 'Abend', 'Nacht', 'Woche', 'Wochenende', 'Montag', 'Samstag', 'Sonntag', 'Stunde', 'wann', 'früh', 'spät', 'jetzt', 'gestern',
  // مکان و پرسش
  'wo', 'Wo', 'Woher', 'hier', 'dort', 'weit', 'nah', 'Zentrum', 'Stadt', 'Straße', 'Toilette', 'Platz',
  // رفت‌وآمد
  'Bahnhof', 'Zug', 'Bus', 'Flughafen', 'Auto', 'Fahrkarte', 'gehe', 'gehen',
  // کار، درس و پول
  'arbeiten', 'arbeite', 'Büro', 'Schule', 'Unterricht', 'Lehrer', 'Frage', 'Deutsch', 'sprechen', 'verstehe', 'schreiben', 'lernt', 'Geld', 'kostet', 'teuer', 'bezahlen', 'kaufen',
  // توصیف
  'gut', 'schön', 'neu', 'alt', 'groß', 'klein', 'lang', 'kalt', 'warm', 'müde', 'froh', 'krank', 'frei', 'Farbe', 'rot', 'blau', 'grün', 'gelb', 'schwarz', 'braun', 'hell',
  // پرسش‌های پرکاربرد
  'was', 'Was', 'Wie', 'Warum', 'Welcher', 'Wer', 'viel', 'viele',
  // نیاز و توانایی
  'brauche', 'Hilfe', 'helfen', 'kann', 'können', 'muss', 'mag', 'gern', 'natürlich', 'leider',
  // سلامت
  'Arzt', 'Krankenhaus', 'Apotheke',
];

/** The teaching order of the Russian core, written with the stress marks the course uses. */
const RU_TARGETS: readonly string[] = [
  // سلام، ادب و پاسخ کوتاه
  'приве́т', 'здра́вствуйте', 'пока́', 'до свида́ния', 'спаси́бо', 'пожа́луйста', 'извини́те', 'да', 'нет', 'хорошо́',
  // خودم و مخاطبم
  'я', 'ты', 'вы', 'мы', 'мой', 'и́мя', 'живу́',
  // عدد
  'оди́н', 'два', 'три', 'четы́ре', 'пять', 'шесть', 'семь', 'во́семь', 'де́вять', 'де́сять',
  // کافه و غذا
  'вода́', 'чай', 'ко́фе', 'хлеб', 'молоко́', 'сыр', 'я́блоко', 'есть', 'пить', 'хочу́', 'вку́сно',
  // خانواده
  'семья́', 'мать', 'оте́ц', 'брат', 'сестра́', 'сын', 'дочь', 'друг', 'де́ти',
  // خانه و وسایل
  'дом', 'кварти́ра', 'ко́мната', 'стол', 'стул', 'дверь', 'окно́', 'кни́га', 'телефо́н', 'су́мка', 'ключ',
  // زمان
  'вре́мя', 'день', 'сего́дня', 'за́втра', 'вчера́', 'у́тро', 'ве́чер', 'ночь', 'неде́ля', 'ме́сяц', 'час', 'сейча́с', 'когда́',
  // مکان و پرسش
  'где', 'что', 'кто', 'как', 'почему́', 'ско́лько', 'здесь', 'там', 'далеко́', 'ря́дом', 'го́род', 'у́лица', 'туале́т', 'ме́сто',
  // رفت‌وآمد
  'метро́', 'авто́бус', 'по́езд', 'такси́', 'биле́т', 'вокза́л',
  // کار، درس و پول
  'рабо́та', 'шко́ла', 'уро́к', 'учи́тель', 'вопро́с', 'язы́к', 'говори́ть', 'понима́ть', 'повтори́те', 'чита́ть', 'писа́ть', 'де́ньги', 'сто́ит', 'до́рого', 'плати́ть',
  // توصیف
  'хоро́ший', 'плохо́й', 'но́вый', 'ста́рый', 'большо́й', 'ма́ленький', 'краси́вый', 'вку́сный', 'холо́дно', 'тепло́', 'кра́сный', 'си́ний', 'зелёный', 'жёлтый', 'чёрный', 'бе́лый',
  // نیاز و توانایی
  'ну́жно', 'мо́жно', 'могу́', 'помо́щь', 'помоги́те', 'не́льзя',
  // سلامت
  'врач', 'апте́ка', 'больни́ца', 'бо́льно',
];

/** Short Persian cues; only for words whose form or register needs one. */
const DE_NOTES: Record<string, string> = {
  'guten tag': 'سلام خنثی و رسمی؛ «Hallo» دوستانه‌تر است.',
  'guten morgen': 'فقط صبح‌ها؛ بعدازظهر «Guten Tag» می‌گویید.',
  'auf wiedersehen': 'خداحافظی رسمی؛ «Tschüss» دوستانه است.',
  bitte: 'هم «لطفاً» است هم «خواهش می‌کنم».',
  entschuldigung: 'برای عذرخواهی کوتاه یا جلب توجه.',
  sie: 'با حرف بزرگ یعنی «شما»ی رسمی؛ sie کوچک «او/آن‌ها» است.',
  heiße: 'فعل «heißen» با من: ich heiße.',
  wohne: 'فعل «wohnen» با من: ich wohne.',
  möchte: 'صورت مؤدبانهٔ «خواستن»؛ با من و با Sie به کار می‌رود.',
  rechnung: 'در کافه و رستوران: Die Rechnung bitte.',
  euro: 'جمعش هم Euro است؛ «fünf Euro».',
  hause: 'فقط در عبارت «zu Hause» یعنی در خانه.',
  zimmer: 'اسم خنثی است: das Zimmer.',
  küche: 'اسم مؤنث است: die Küche.',
  tür: 'اسم مؤنث است: die Tür.',
  schlüssel: 'اسم مذکر است: der Schlüssel.',
  wochenende: 'اسم خنثی است: das Wochenende.',
  straße: 'اسم مؤنث است: die Straße.',
  fahrkarte: 'اسم مؤنث است: die Fahrkarte.',
  unterricht: 'اسم مذکر است: der Unterricht.',
  lehrer: 'مؤنثش «die Lehrerin» است.',
  frage: 'اسم مؤنث است: die Frage.',
  arzt: 'مؤنثش «die Ärztin» است.',
  apotheke: 'اسم مؤنث است: die Apotheke.',
  farbe: 'اسم مؤنث است: die Farbe.',
  geld: 'اسم خنثی است: das Geld.',
};

const RU_NOTES: Record<string, string> = {
  'до свидания': 'خداحافظی رسمی؛ «пока» دوستانه است.',
  здравствуйте: 'سلام رسمی؛ «в» میان واژه شنیده نمی‌شود.',
  пожалуйста: 'هم «لطفاً» است هم «خواهش می‌کنم».',
  есть: 'هم «هست» است هم «خوردن»؛ در این جمله اولی.',
  пить: 'مصدر «نوشیدن»؛ با من: я пью.',
  хочу: 'بی‌قاعده است؛ با من: я хочу.',
  живу: 'فعل «жить» با من: я живу.',
  деньги: 'همیشه جمع است.',
  стоит: 'فعل «стоить»: قیمت دارد.',
  нужно: 'با «мне» می‌آید: мне нужно.',
  можно: 'یعنی «می‌شود / اجازه هست».',
  нельзя: 'یعنی «نمی‌شود / اجازه نیست».',
  больно: 'یعنی «درد می‌کند».',
  имя: 'خنثی است؛ در جمله «меня зовут» هم برای نام به کار می‌رود.',
};

const fold = (value: string) => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/\p{M}/gu, '')
  .replace(/ё/g, 'е')
  .replace(/[´`’'!?.,;:«»„“”¿¡…—–]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

type CourseSentence = { text: string; fa: string; pronunciation: string; vocabulary?: Array<{ word: string; meaning: string }> };
type CourseLesson = { id: string; title: string; levelId: number; sentences: CourseSentence[]; learningMode?: string };

function courseLessons(language: WordLabLanguageId): readonly CourseLesson[] {
  return language === 'de'
    ? (NEW_COURSES.de.lessons as unknown as readonly CourseLesson[])
    : (RUSSIAN_LESSONS as unknown as readonly CourseLesson[]);
}

/** Generated review lessons mix quoted frequency words into filler sentences; they teach nothing. */
const isLabLesson = (id: string) => id.startsWith('lab-');
/** Pre-A1 and A1 only: the lab teaches the beginner band. */
const MAX_LEVEL = 1;

/**
 * How well the sentence says the word: 0 = the word stands there as its own token, 1 = only an
 * inflected form of it («Schulen», «во́ду»), `null` = the sentence does not really say it. Matching a
 * prefix without a word boundary is not allowed, so «Küche» never matches «Kuchen» and «Tür» never
 * matches «Türkei».
 */
function matchQuality(sentence: CourseSentence, word: string): 0 | null {
  const text = sentence.text.trim();
  if (/[«»]/.test(text)) return null;
  if (fold(text) === fold(word)) return null;
  const tokens = text.replace(/[!?.,;:]/g, ' ').split(/\s+/).filter(Boolean);
  if (tokens.length < 2) return null;
  const needle = fold(word);
  if (!needle) return null;
  // Exact token (or exact multi-word phrase) only: the target list names the form the course actually
  // writes, so a prefix can never turn «Küche» into «Kuchen» or «Tür» into «Türkei».
  if (needle.includes(' ')) {
    const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|\\s)${escaped}(\\s|$)`, 'u').test(fold(text)) ? 0 : null;
  }
  return tokens.some(token => fold(token) === needle) ? 0 : null;
}

/** Shortest, earliest, clearest sentence wins: it is the one a beginner can repeat. */
function sentenceScore(lesson: CourseLesson, sentence: CourseSentence, teachesHere: boolean): number {
  const words = sentence.text.trim().split(/\s+/).length;
  // A word list card («Guten Tag») is not an example the learner can say back; a real sentence always wins.
  const wordList = lesson.learningMode ? 300 : 0;
  return lesson.levelId * 1000 + wordList + words * 3 + (teachesHere ? 0 : 500);
}

/**
 * The Persian gloss is the meaning the course itself repeats most often for this word (earliest level
 * wins ties), so «Hallo» is 「سلام」 and not the one-off telephone 「الو」.
 */
function glossFor(word: string, rows: Array<{ meaning: string; levelId: number }>): string | null {
  if (!rows.length) return null;
  const tally = new Map<string, { count: number; levelId: number }>();
  for (const row of rows) {
    const entry = tally.get(row.meaning) ?? { count: 0, levelId: row.levelId };
    entry.count += 1;
    entry.levelId = Math.min(entry.levelId, row.levelId);
    tally.set(row.meaning, entry);
  }
  return [...tally.entries()]
    .sort((a, b) => b[1].count - a[1].count || a[1].levelId - b[1].levelId)[0][0];
}

function build(language: WordLabLanguageId, targets: readonly string[], notes: Record<string, string>): readonly CoreWord[] {
  const all = courseLessons(language).filter(lesson => !isLabLesson(lesson.id));
  const beginner = all.filter(lesson => lesson.levelId <= MAX_LEVEL);
  const out: CoreWord[] = [];
  // Each example should teach one word: two cards sharing a sentence make the second one noise. A reused
  // sentence is allowed only when nothing else exists for that word, so it costs the price of a fallback.
  const usedSentences = new Set<string>();

  for (const target of targets) {
    const key = fold(target);
    if (!key) continue;
    // Every meaning the course ever gives this exact word…
    const rows: Array<{ meaning: string; levelId: number }> = [];
    for (const lesson of all) {
      for (const sentence of lesson.sentences) {
        for (const item of sentence.vocabulary ?? []) {
          if (fold(item.word) === key) rows.push({ meaning: item.meaning, levelId: lesson.levelId });
        }
      }
    }
    const fa = glossFor(target, rows);
    if (!fa) continue;
    // …and the simplest beginner sentence that actually says it.
    let best: { lesson: CourseLesson; sentence: CourseSentence; score: number } | null = null;
    for (const lesson of beginner) {
      for (const sentence of lesson.sentences) {
        if (matchQuality(sentence, target) === null) continue;
        const teachesItHere = (sentence.vocabulary ?? []).some(item => fold(item.word) === key);
        const score = sentenceScore(lesson, sentence, teachesItHere)
          + (usedSentences.has(fold(sentence.text)) ? 900 : 0);
        if (!best || score < best.score) best = { lesson, sentence, score };
      }
    }
    if (!best) continue;
    if (out.some(word => fold(word.target) === key)) continue;
    usedSentences.add(fold(best.sentence.text));
    out.push({
      id: `${language}-core-${key.replace(/\s+/g, '-')}`,
      target,
      fa,
      sentence: best.sentence.text,
      sentenceFa: best.sentence.fa,
      sentencePronunciation: best.sentence.pronunciation,
      lessonTitle: best.lesson.title,
      levelId: best.lesson.levelId,
      note: notes[key] ?? '',
      order: out.length + 1,
    });
  }
  // Unresolved targets are reported by the verify script; the order is only for reading.
  return out;
}

export const CORE_WORDS: Record<WordLabLanguageId, readonly CoreWord[]> = {
  de: build('de', DE_TARGETS, DE_NOTES),
  ru: build('ru', RU_TARGETS, RU_NOTES),
};

/** Targets the shipped course could not supply a full sentence for, listed for the verify script. */
export const UNRESOLVED_CORE_TARGETS: Record<WordLabLanguageId, readonly string[]> = {
  de: DE_TARGETS.filter(target => !CORE_WORDS.de.some(word => fold(word.target) === fold(target))),
  ru: RU_TARGETS.filter(target => !CORE_WORDS.ru.some(word => fold(word.target) === fold(target))),
};
