import { RUSSIAN_LESSONS } from './russian';
import ruFrequency from '@/lib/content/frequency/ru.json';

/**
 * «آزمایشگاه واژهٔ روسی» — a 100-word pilot drawn only from the shipped Russian course.
 *
 * The words keep the course's stress marks («´») and the exact Persian glosses that learners already
 * see inside lessons. Generated frequency-lab placeholders with the generic gloss «واژهٔ پرتکرار»
 * are deliberately excluded: they teach a citation form, not a usable meaning.
 */
export interface RussianVocabWord {
  id: string;
  ru: string;
  fa: string;
  exampleRu: string;
  exampleFa: string;
  note: string;
  order: number;
  frequencyRank: number | null;
}

export const RUSSIAN_VOCAB_PILOT_SIZE = 100;

const GENERIC_GLOSS = /واژهٔ پرتکرار|کلمهٔ پرتکار|پرتکرار/;
const STRIP = /[´`’'!?.,;:«»„“”]/g;

/** Fold stress, ё, case and punctuation so «э́то» and «это» become one card. */
export function normalizeRussianWord(word: string): string {
  return word
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/ё/g, 'е')
    .replace(STRIP, '')
    .replace(/[^a-zа-я0-9\s-]/gi, '')
    .trim();
}

const FREQUENCY_RANK = new Map<string, number>(
  (ruFrequency as readonly string[]).map((word, index) => [normalizeRussianWord(word), index]),
);

const NOTE_OVERRIDES: Record<string, string> = {
  'привет': 'دوستانه است؛ در موقعیت رسمی بهجای آن «Здра́вствуйте» بگو. تکیه روی «е» است.',
  'здравствуйте': 'سلام رسمی؛ «в» میان واژه شنیده نمیشود. تکیه روی «а» است.',
  'спасибо': 'تکیه روی «и»؛ «ب» آخر نرم خوانده میشود. تشکر روزمرهٔ روسی.',
  'пожалуйста': 'هم «لطفاً» است هم «خواهش میکنم»؛ تکیه روی «а»ی دوم.',
  'да': 'بلهٔ کوتاه؛ با «нет» جفتش کن.',
  'нет': 'نهٔ کوتاه؛ با «не» فرق دارد، چون «не» فقط فعل را منفی میکند.',
  'не': 'منفیساز است و پیش از فعل میآید: «Я не зна́ю» = نمی دانم.',
  'я': 'ضمیر «من»؛ حرف «я» مثل «یا» خوانده میشود.',
  'ты': '«تو»ی دوستانه؛ رسمیاش «вы» است.',
  'вы': 'هم «شما»ی جمع است هم «شما»ی محترمانه.',
  'хорошо': 'هم «خوب» است هم «باشه»؛ تکیه روی «о»ی آخر.',
  'студент': 'مذکر؛ برای گویندهٔ زن «студе́нтка» میآید.',
  'студентка': 'مؤنث «студе́нт»؛ پسوند «‑ка» جنسیت را نشان میدهد.',
  'кофе': 'در روسی معیار مذکر است: «ко́фе»، نه «кофе́» روی آخر.',
  'рубль': 'واحد پول روسیه؛ نشان نرم «ь» تلفظ را کمی نرم میکند.',
  'до свидания': '«خداحافظ» رسمی و دوبخشی؛ «до» یعنی «تا»، «свида́ния» یعنی «دیدار».',
  'пока': 'خداحافظ دوستانه؛ همان واژه در جای دیگر یعنی «فعلاً / تا بعد».',
  'утро': 'صبح؛ علامت تکیه روی «у» است: «у́тро».',
  'день': 'روز؛ «ь» نشان نرمی «ن» است، صدای جداگانهای ندارد.',
  'вечер': 'عصر/شب زود؛ «До́брый ве́чер!» سلام عصر است.',
  'ночь': 'شب؛ «Споко́йной но́чи!» یعنی شب بخیر.',
  'завтра': 'فردا؛ «До за́втра!» یعنی تا فردا / فعلاً خداحافظ.',
  'сегодня': '«امروز»؛ «г» در این واژه مثل «و» شنیده میشود: «سیوُدنیا».',
  'сколько': 'چند / چقدر؛ معمولاً پیش از اسم یا قیمت میآید.',
  'из': 'از / اهلِ؛ «Я из Ира́на» = من اهل ایرانم.',
  'в': 'حرف اضافهٔ کوتاه «در / به»؛ بهتنهایی تکیه ندارد.',
  'на': 'حرف اضافهٔ کوتاه «روی / به»؛ همراه اسم میآید.',
  'с': 'حرف اضافهٔ کوتاه «با / از»؛ صدای «س» دارد.',
  'о': 'حرف اضافهٔ «دربارهٔ»؛ تکیه نمیگیرد.',
  'к': 'حرف اضافهٔ «به سوی / پیشِ»؛ کوتاه و بیتکیه.',
  'у': 'حرف اضافهٔ «پیشِ / نزدِ»؛ در «А у тебя́?» یعنی «و تو چطور؟».',
};

function noteFor(word: string, meaning: string): string {
  const key = normalizeRussianWord(word);
  const override = NOTE_OVERRIDES[key];
  if (override) return override;
  if (/[´]/.test(word)) return '«´» علامت تکیه است؛ اول صدا را بشنو، بعد همان واژه را بلند و با همان تکیه تکرار کن.';
  if (/[ьъ]/.test(word)) return '«ь/ъ» نشانهای سیریلیکاند، نه حرف صدادار؛ صدا را بشنو و شکل نوشتاری را هم ببین.';
  if (/[ё]/.test(word)) return '«ё» همیشه تکیه دارد و مثل «یو» خوانده میشود؛ گاهی در متنها «е» مینویسند.';
  return `واژهٔ "${meaning}" را اول بشنو، سپس بدون نگاه کردن به روسی، از فارسی به روسی بگو.`;
}

function buildPilot(): readonly RussianVocabWord[] {
  const seen = new Set<string>();
  const words: RussianVocabWord[] = [];
  for (const lesson of RUSSIAN_LESSONS) {
    for (const sentence of lesson.sentences) {
      for (const item of sentence.vocabulary ?? []) {
        const key = normalizeRussianWord(item.word);
        if (!key || key.length < 2 || seen.has(key)) continue;
        if (GENERIC_GLOSS.test(item.meaning)) continue;
        seen.add(key);
        const order = words.length + 1;
        words.push({
          id: `ru-vocab-${key.replace(/\s+/g, '-')}`,
          ru: item.word,
          fa: item.meaning,
          exampleRu: sentence.text,
          exampleFa: sentence.fa,
          note: noteFor(item.word, item.meaning),
          order,
          frequencyRank: FREQUENCY_RANK.get(key) ?? null,
        });
        if (words.length >= RUSSIAN_VOCAB_PILOT_SIZE) return words;
      }
    }
  }
  return words;
}

export const RUSSIAN_VOCAB_WORDS = buildPilot();

/** The exact string passed to the speech recogniser; punctuation is ignored by the scorer anyway. */
export function spokenTarget(word: RussianVocabWord): string {
  return word.ru.replace(/[«»„“”!?.,;:]/g, '').trim();
}

/** A small cue after a weak attempt — never the whole answer. */
export function firstLetterHint(word: RussianVocabWord): string {
  const clean = spokenTarget(word).replace(/[´`’']/g, '');
  return clean ? `${clean.slice(0, 1)}…` : '…';
}
