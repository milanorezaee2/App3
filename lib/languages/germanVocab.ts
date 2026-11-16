import { NEW_COURSES } from './newCourses';
import deFrequency from '@/lib/content/frequency/de.json';

/**
 * «آزمایشگاه واژهٔ آلمانی» — the German twin of the Russian vocabulary lab.
 *
 * Same pilot size, same phases and the same local spaced repetition; only the content is German.
 * Words come exclusively from the shipped German course (`NEW_COURSES.de`), so a learner never meets
 * a word here that is missing from their lessons, and the Persian gloss stays the one they already saw.
 *
 * German needs two edits the Russian pilot did not:
 *   • articles and bare function words from the frequency list must never become cards,
 *   • sentence-initial capitals of non-nouns («Drei», «Was») are folded to the correct lowercase
 *     headword, while nouns («Morgen») keep their capital because German capitalises nouns.
 */
export interface GermanVocabWord {
  id: string;
  de: string;
  fa: string;
  exampleDe: string;
  exampleFa: string;
  note: string;
  order: number;
  frequencyRank: number | null;
}

export const GERMAN_VOCAB_PILOT_SIZE = 100;

const GENERIC_GLOSS = /واژهٔ پرتکرار|کلمهٔ پرتکار|پرتکرار/;
const STRIP = /[!?.,;:«»„“”"'’`´‚‘]/g;

/** Fold case, ß and punctuation so «Straße»/«STRASSE» and «Drei»/«drei» share one card. */
export function normalizeGermanWord(word: string): string {
  return word
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(STRIP, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The course is the only source; a missing frequency entry just means "not in the top 8000". */
const FREQUENCY_RANK = new Map<string, number>(
  (deFrequency as readonly string[]).map((word, index) => [normalizeGermanWord(word), index]),
);

/**
 * Articles and bare particles never make a good card: they carry no meaning on their own and the
 * frequency list is full of them. Everything else stays, including useful pronouns and numbers.
 */
const SKIP_KEYS = new Set([
  'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'einer', 'eines',
  'zu', 'in', 'im', 'an', 'am', 'auf', 'von', 'vom', 'mit', 'für', 'ist', 'sind', 'es', 'sie', 'er',
  'leid',
]);

/** Correct headword spelling where the course only offers a sentence-initial capital. */
const HEADWORD_OVERRIDES: Record<string, string> = {
  hier: 'hier',
  was: 'was',
  wer: 'wer',
  woher: 'woher',
  wie: 'wie',
  gut: 'gut',
  neun: 'neun',
  zehn: 'zehn',
  dreizehn: 'dreizehn',
  fünfzehn: 'fünfzehn',
  neunzehn: 'neunzehn',
  zwanzig: 'zwanzig',
  verstehst: 'verstehst',
  'sehr gut': 'sehr gut',
  'bis bald': 'bis bald',
  'bis morgen': 'bis morgen',
  'nein, danke': 'Nein, danke',
  'wasser, bitte': 'Wasser, bitte',
  'vielen dank': 'Vielen Dank',
  'guten morgen': 'Guten Morgen',
  'guten tag': 'Guten Tag',
  'guten abend': 'Guten Abend',
  'auf wiedersehen': 'Auf Wiedersehen',
  'gern geschehen': 'Gern geschehen',
  'ein buch': 'ein Buch',
  'ein stift': 'ein Stift',
  'mein name': 'mein Name',
  'meine mutter': 'meine Mutter',
  'mein vater': 'mein Vater',
};

/** Short, unambiguous Persian glosses where the course lists alternatives separated by «/». */
const GLOSS_OVERRIDES: Record<string, string> = {
  hallo: 'سلام',
  ja: 'بله',
  nein: 'نه',
  danke: 'ممنون',
  bitte: 'لطفاً',
  schön: 'زیبا',
  tschüss: 'خداحافظ (دوستانه)',
  hier: 'اینجا',
  wie: 'چطور',
  freund: 'دوست (مرد)',
  freundin: 'دوست (زن)',
  zusammen: 'با هم',
  'bis bald': 'به‌زودی می‌بینمت',
  'heisst': 'نام داری',
  verstehe: 'می‌فهمم',
  lerne: 'یاد می‌گیرم',
  danach: 'بعد از آن',
};

const NOTE_OVERRIDES: Record<string, string> = {
  hallo: 'سلام غیررسمی؛ برای دوست و همکار روزمره. رسمی‌اش «Guten Tag» است.',
  ja: '«یا» خوانده می‌شود، نه «جا»؛ j در آلمانی مثل «ی» است.',
  nein: '«ناین»؛ با «kein» فرق دارد: nein جواب «نه» است، kein صفت منفی‌ساز.',
  danke: '«دانکه»؛ تشکر کوتاه. مؤدبانه‌ترش «Vielen Dank» است.',
  bitte: 'هم «لطفاً» است هم جواب تشکر («خواهش می‌کنم»)؛ لحن جمله تعیینش می‌کند.',
  auto: '«آئوتو»؛ حرف a در آغاز واژه صدای «آ» می‌دهد. جمع: die Autos.',
  wasser: '«واسِر»؛ w = و و ss = س کشیده. در رستوران «Wasser, bitte!» کافی است.',
  haus: '«هاوس»؛ au صدای «آو» می‌دهد. جمع: die Häuser.',
  tür: 'ü با لب‌های گرد خوانده می‌شود، چیزی بین «او» و «ای»؛ جمع: die Türen.',
  schön: 'sch = ش و ö لب‌های گرد؛ «شُن» نزدیک‌ترین تلفظ فارسی است.',
  fünf: 'ü گِرد؛ «فونف». عددها را با شمردن بلند تمرین کن.',
  buch: 'ch در Buch مثل «خ» نرم است؛ جمعش «Bücher» با ü و ch نرم‌تر.',
  tschüss: '«چوس»؛ خداحافظی دوستانه و کوتاه، فقط با آشناها.',
  milch: 'ch بعد از i و e نرم و نزدیک «ش» است: «میلش».',
  schule: 'sch = ش؛ «شوله». der Schule, in der Schule: حرف اضافه را با هم یاد بگیر.',
  'guten morgen': 'از صبح تا حدود ساعت ۱۱؛ بعد از آن «Guten Tag».',
  'guten tag': 'سلام رسمی روز؛ در فروشگاه و اداره همین را بگو.',
  'guten abend': 'بعد از غروب؛ پیش از خواب «Gute Nacht» می‌گویند.',
  'bis bald': '«تا زودی»؛ bis = تا. برای خداحافظی کوتاه و دوستانه.',
  'bis morgen': '«تا فردا»؛ همان الگوی «bis + زمان» را با Montag و Dienstag هم بساز.',
  'auf wiedersehen': 'رسمی؛ در فروشگاه و مطب همین را می‌شنوی. «Wieder» یعنی دوباره.',
  'nein danke': 'رد کردن مؤدبانه؛ هرگز فقط «nein» نگو، با danke نرم می‌شود.',
  'wasser bitte': 'الگوی سفارش: اسم + bitte. با «Kaffee, bitte» هم تمرین کن.',
  'vielen dank': 'تشکر قوی‌تر از danke؛ «vielen» یعنی «بسیار».',
  'mein name': 'mein برای مذکر/خنثی و meine برای مؤنث است: mein Name, meine Mutter.',
  'meine mutter': 'meine چون Mutter مؤنث است؛ Vater می‌گیرد mein.',
  'mein vater': 'mein برای مذکر؛ برای مادر meine Mutter.',
  'sehr gut': '«خیلی خوب»؛ sehr قید تشدید است و صرف نمی‌شود.',
  entschuldigung: '«اِنتشولدیگونگ»؛ هم عذرخواهی است هم برای جلب توجه («ببخشید!»).',
  'gern geschehen': 'جواب تشکر، «خواهش می‌کنم»؛ gern یعنی «با میل».',
  zwei: '«تسوای»؛ z همیشه «تس» خوانده می‌شود.',
  drei: '«درای»؛ ei صدای «آی» می‌دهد.',
  vier: '«فیر»؛ v در واژه‌های آلمانی معمولاً «ف» است.',
  sieben: '«زیبن»؛ حرف s پیش از صدادار مثل «ز» خوانده می‌شود.',
  zehn: '«تسن»؛ h بعد از صدادار کشش می‌دهد و خودش شنیده نمی‌شود.',
  müde: 'ü گِرد؛ «موده». «Ich bin müde» = خسته‌ام.',
  studentin: 'مؤنث Student؛ پسوند ‑in جنسیت مؤنث می‌سازد.',
  deutschland: 'نام کشور؛ «Deutsch» = آلمانی. حرف eu صدای «اوی» می‌دهد.',
  stadt: 'st در آغاز واژه «شت» خوانده می‌شود: «شتات». جمع: die Städte.',
  natürlich: '«ناتورلیش»؛ یعنی «طبیعی است / البته».',
  langsam: '«لانگزام»؛ قید سرعت. «Sprechen Sie langsam, bitte!»',
  nummer: '«نومر»؛ در آلمانی برای شماره تلفن هم به کار می‌رود.',
  freund: 'دوست مذکر؛ Freundin برای دوست زن. پسوند ‑in جمع‌بند مؤنث است.',
  freundin: 'دوست مؤنث؛ «eine Freundin» با حرف تعریف مؤنث می‌آید.',
  mutter: 'مادر؛ جمع: die Mütter با ü.',
  vater: 'پدر؛ جمع: die Väter با ä.',
  bruder: 'برادر؛ جمع: die Brüder.',
  schwester: 'خواهر؛ جمع: die Schwestern.',
  montag: 'روزهای هفته با «Tag» ساخته می‌شوند؛ «am Montag» = دوشنبه.',
  dienstag: '«دینستاگ»؛ ie صدای «ای» کشیده می‌دهد.',
  mittwoch: '«میتوُخ»؛ یعنی «میانهٔ هفته».',
  freitag: '«فرایتاگ»؛ ei = آی.',
  blau: '«بلاو»؛ au = آو. رنگ‌ها صفت‌اند و پیش از اسم صرف می‌شوند.',
  rot: '«روت»؛ برای رنگ قرمز. جمع صفت‌ها را بعداً با اسم تمرین کن.',
  schwarz: '«شوارتس»؛ sch = ش و z = تس.',
  grün: 'ü گِرد؛ «گرون».',
  telefon: '«تلفون»؛ «die Telefonnummer» = شماره تلفن.',
  stift: 'خودکار/مداد؛ «ein Stift» با حرف تعریف نامعین خنثی.',
  name: '«نامه»؛ «Wie ist Ihr Name?» رسمی و «Wie heißt du?» دوستانه است.',
  kind: 'کودک؛ حرف آخر d کمی به «ت» نزدیک می‌شود: «کینت».',
  ich: '«اِش»؛ ch بعد از e و i نرم است، مثل «ش» کوتاه. پرکاربردترین ضمیر آلمانی.',
  du: '«دو»؛ «تو»ی دوستانه. برای غریبه و بزرگ‌تر «Sie» به کار می‌رود.',
  wir: '«ویر»؛ «ما». فعل بعد از آن همیشه «‑en» می‌گیرد: wir lernen.',
  hilfe: '«هیلفه»؛ برای کمک خواستن همین یک واژه کافی است: «Hilfe!».',
  dir: '«دیر»؛ شکل وابستهٔ du («به تو»). «Wie geht es dir?» = حالت چطور است؟',
  gut: '«گوت»؛ d در پایان واژه مثل «ت» خوانده می‌شود.',
  bald: '«بالد»؛ قید زمان. با «bis bald» خداحافظی کوتاه بساز.',
  froh: '«فرو»؛ h پایانی فقط کشش می‌دهد و شنیده نمی‌شود.',
  und: '«اونت»؛ d آخر مثل «ت». پیوند سادهٔ دو جمله.',
  hast: '«هاست»؛ دوم‌شخص haben: du hast. اول‌شخصش «habe» است.',
  habe: '«هابه»؛ اول‌شخص haben: ich habe. با «Ich habe eine Frage» شروع کن.',
  komme: '«کومه»؛ از kommen. «Ich komme aus dem Iran» = اهل ایرانم.',
  wohnst: '«وونست»؛ از wohnen («زندگی کردن»). «Wo wohnst du?»',
  wohne: '«وونه»؛ h فقط کشش می‌دهد. «Ich wohne in Tokio».',
  verstehst: '«فراشتست»؛ دوم‌شخص verstehen. «Verstehst du mich?» = متوجهم می‌شوی؟',
  verstehe: '«فراشته»؛ اول‌شخص verstehen. «Ich verstehe nicht» جملهٔ نجات‌بخش سفر است.',
  lerne: '«لرنه»؛ از lernen. «Ich lerne Deutsch» = آلمانی یاد می‌گیرم.',
  bedeutet: '«بدویتد»؛ از bedeuten. «Was bedeutet das?» = این چه معنایی دارد؟',
  viele: '«فیله»؛ «چند تا / بسیاری». ie کشیده خوانده می‌شود.',
  heiße: 'از heißen («نامیده شدن»)؛ ß = س. «Ich heiße …» = نام من … است.',
  heißt: 'سوم‌شخص heißen؛ ß = س. «Wie heißt du?» دوستانه و «Wie heißen Sie?» رسمی است.',
  was: '«واس»؛ w = و. «Was ist das?» = این چیست؟',
  wer: '«وِر»؛ «چه کسی». با was اشتباه نشود: wer برای شخص است.',
  woher: '«ووهیر»؛ «از کجا». «Woher kommst du?»',
  neun: '«نوین»؛ eu صدای «اوی» می‌دهد. ۹ و ۱۹ (neunzehn) را با هم تمرین کن.',
  achtzehn: '«آختسن»؛ ch اینجا سخت و نزدیک «خ» است. حرف z = تس.',
  fünfzehn: '«فونفتسن»؛ ü گِرد و z = تس. ۱۵ و ۵۰ (fünfzig) را قاطی نکن.',
  neunzehn: '«نوینتسن»؛ eu = اوی و z = تس. ۱۹ در آلمانی از «۹ + ۱۰» ساخته می‌شود.',
  zwölf: '«تسوُلف»؛ ö گِرد. عدد ۱۲ و ۱۱ (elf) را با هم حفظ کن.',
  heute: '«هویته»؛ eu صدای «اوی» می‌دهد. «Heute ist Montag».',
}

function noteFor(word: string, meaning: string): string {
  const key = normalizeGermanWord(word);
  const override = NOTE_OVERRIDES[key];
  if (override) return override;
  if (/sch/.test(key)) return '«sch» مثل «ش» خوانده می‌شود؛ یک صدا، نه «س» + «خ».';
  if (/[äöü]/.test(key)) return 'حرف‌های ä/ö/ü با لب‌های گرد خوانده می‌شوند؛ صدا را بشنو و بعد بگو.';
  if (/ß/.test(word)) return '«ß» مثل «س» است؛ هیچ وقت «ب» خوانده نمی‌شود.';
  if (/^sp|^st/.test(key)) return 'در آغاز واژه «sp/‌st» مثل «شپ/شت» خوانده می‌شود.';
  if (/ch/.test(key)) return '«ch» دو تلفظ دارد: نرم (نزدیک «ش/ه») یا سخت (نزدیک «خ»). با گوش انتخاب کن.';
  if (/ei/.test(key)) return '«ei» صدای «آی» می‌دهد، برخلاف انگلیسی که «ای» خوانده می‌شود.';
  if (/ie/.test(key)) return '«ie» صدای «ای» کشیده می‌دهد؛ جای «آی» نگذار.';
  if (/eu|äu/.test(key)) return '«eu/äu» صدای «اوی» می‌دهد.';
  if (/z/.test(key)) return '«z» همیشه مثل «تس» خوانده می‌شود.';
  if (/w/.test(key)) return '«w» مثل «و» است؛ «v» جای آن نیست.';
  if (/^[A-ZÄÖÜ]/.test(word)) return 'اسم‌های آلمانی با حرف بزرگ نوشته می‌شوند؛ همین شکل را در جمله حفظ کن.';
  return `واژهٔ «${meaning}» را اول بشنو، سپس بدون نگاه کردن به آلمانی، از فارسی به آلمانی بگو.`;
}

/** Pick the form learners should see: lowercase headword when the course has one, else the noun. */
function headwordFor(key: string, forms: { word: string; meaning: string }[], meaning: string): string {
  const override = HEADWORD_OVERRIDES[key];
  if (override) return override;
  const sameMeaning = forms.filter(item => item.meaning === meaning);
  const lower = sameMeaning.find(item => item.word === item.word.toLowerCase());
  return (lower ?? sameMeaning[0] ?? forms[0]).word;
}

function buildPilot(): readonly GermanVocabWord[] {
  const forms = new Map<string, { word: string; meaning: string; text: string; fa: string }[]>();
  for (const lesson of NEW_COURSES.de.lessons) {
    for (const sentence of lesson.sentences) {
      for (const item of sentence.vocabulary ?? []) {
        if (!item?.word || !item?.meaning) continue;
        const key = normalizeGermanWord(item.word);
        if (!key || key.length < 2) continue;
        if (GENERIC_GLOSS.test(item.meaning)) continue;
        const list = forms.get(key) ?? [];
        list.push({ word: item.word, meaning: item.meaning, text: sentence.text, fa: sentence.fa });
        forms.set(key, list);
      }
    }
  }

  const words: GermanVocabWord[] = [];
  for (const [key, entries] of forms) {
    if (SKIP_KEYS.has(key)) continue;
    const first = entries[0];
    const headword = headwordFor(key, entries, first.meaning);
    // Keep the example that contains the word in the chosen form, so the sentence and the card agree.
    const example = entries.find(entry => entry.word === headword) ?? first;
    const order = words.length + 1;
    words.push({
      id: `de-vocab-${key.replace(/\s+/g, '-')}`,
      de: headword,
      fa: GLOSS_OVERRIDES[key] ?? first.meaning,
      exampleDe: example.text,
      exampleFa: example.fa,
      note: noteFor(headword, GLOSS_OVERRIDES[key] ?? first.meaning),
      order,
      frequencyRank: FREQUENCY_RANK.get(key) ?? null,
    });
    if (words.length >= GERMAN_VOCAB_PILOT_SIZE) break;
  }
  return words;
}

export const GERMAN_VOCAB_WORDS = buildPilot();

/** The exact string passed to the speech recogniser; trailing punctuation would only confuse it. */
export function spokenGermanTarget(word: GermanVocabWord): string {
  return word.de.replace(/[«»„“”!?.;:]/g, '').trim();
}

/** A small cue after a weak attempt — never the whole answer. */
export function firstGermanLetterHint(word: GermanVocabWord): string {
  const clean = spokenGermanTarget(word);
  return clean ? `${clean.slice(0, 1)}…` : '…';
}
