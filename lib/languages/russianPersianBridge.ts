import type { LearningSentence } from './types';

/**
 * «پل فارسی» — the Russian course's Persian-first teaching layer.
 *
 * Russian textbooks are written for English speakers, so they spend pages on things a Persian
 * speaker already does naturally (no articles, questions by intonation, negation right before the
 * verb) and gloss over the exact places a Persian speaker trips (no verb «است», no verb «داشتن»,
 * dative "to-me" subjects, gendered past tense, counting that changes the noun).
 *
 * This module is pure data + matching: for every existing sentence it derives, without touching the
 * lesson content, (a) one contrastive note aimed at the Persian brain and (b) any words that Persian
 * already knows (loanwords shared between the two languages). The lesson UI shows them under the
 * sentence card.
 */

export type BridgeKind = 'structure' | 'trap' | 'same';

export interface BridgeRule {
  id: string;
  kind: BridgeKind;
  /** Short Persian title shown as the card heading. */
  title: string;
  /** Word-for-word rendering of the trigger, e.g. «نزدِ من هست». */
  literal?: string;
  /** One or two sentences aimed specifically at a Persian speaker. */
  note: string;
  test: RegExp;
}

export interface BridgeLoanword {
  /** Lower-case stem; matched as a word prefix so inflections still hit. */
  stem: string;
  ru: string;
  fa: string;
  /** Why Persian already knows it. */
  note: string;
  /** Max extra letters after the stem (inflection); defaults to 3. */
  maxExtra?: number;
}

export interface SentenceBridge {
  rule: BridgeRule | null;
  loanwords: BridgeLoanword[];
}

/** Strip stress marks, unify ё and lower-case so rules can be written plainly. */
export const normalizeRussian = (text: string): string =>
  text.normalize('NFC').replace(/[\u0300\u0301]/g, '').replace(/ё/g, 'е').replace(/Ё/g, 'Е').toLowerCase();

/** Cyrillic-aware word boundary (JS `\b` only knows ASCII letters). */
const B = '(?:(?<![а-я-])(?=[а-я])|(?<=[а-я])(?![а-я-]))';
const DATIVE = '(мне|тебе|ему|ей|нам|вам|им)';
const POSSESSOR = '(меня|тебя|него|нее|нас|вас|них)';

export const BRIDGE_RULES: readonly BridgeRule[] = [
  { id: 'zovut', kind: 'structure', title: 'اسم من…', literal: '«مرا می‌نامند …»', note: 'روسی نمی‌گوید «اسم من … است». می‌گوید «مرا … صدا می‌زنند». پس «меня» همان «مرا» است و فعل جمعِ بی‌فاعل آمده؛ دنبال «است» نگرد.', test: new RegExp(`${B}${POSSESSOR} зовут${B}`) },
  { id: 'have', kind: 'structure', title: 'روسی «داشتن» ندارد', literal: '«نزدِ من هست …»', note: 'به جای «من … دارم» می‌گویند «у меня есть» = «نزد من هست». چیزی که داری فاعل جمله است و «من» فقط مکان آن است. برای «ندارم» می‌گویند «у меня нет» و اسم بعدش حالت اضافه می‌گیرد.', test: new RegExp(`${B}у ${POSSESSOR} (есть|нет|был|была|было|были|будет)${B}`) },
  { id: 'have-short', kind: 'structure', title: 'روسی «داشتن» ندارد', literal: '«نزدِ من …»', note: '«у меня» یعنی «نزد من / پیش من». وقتی «есть» حذف شده، یعنی داشتنِ چیزی بدیهی است و فقط کیفیتش را می‌گویند؛ باز هم فعل «داشتن» در کار نیست.', test: new RegExp(`${B}у ${POSSESSOR}${B}`) },
  { id: 'age', kind: 'trap', title: 'سن را «به من» می‌گویند', literal: '«به من ۲۰ سال است»', note: 'در روسی سن مثل فارسی «من ۲۰ ساله‌ام» نیست؛ «مне 20 лет» یعنی «به من ۲۰ سال است». خودت در حالت dative می‌آیی، درست مثل «مرا» در فارسی قدیم.', test: new RegExp(`${B}(${DATIVE.slice(1, -1)}) \\d+ (год|года|лет)${B}|${B}сколько (тебе|вам|ему|ей) лет${B}`) },
  { id: 'dative-feel', kind: 'structure', title: 'فاعل «به من»ی', literal: '«به من … است»', note: 'احساس، نیاز و اجازه در روسی فاعل ندارد: «мне холодно» = «به من سرد است»، «мне нравится» = «به من خوش می‌آید»، «мне надо» = «مرا باید». الگویش همان «به من خوش می‌آید» و «سردم است» فارسی است، فقط همیشه با همین ساخت.', test: new RegExp(`${B}${DATIVE} (надо|нужно|нужен|нужна|нужны|можно|нельзя|нравится|нравятся|нравился|нравилась|понравилось|понравился|кажется|холодно|жарко|тепло|плохо|хорошо|скучно|интересно|весело|грустно|страшно|больно|легко|трудно|пора|жаль|все равно|повезло|хочется|удобно|неудобно)${B}`) },
  { id: 'eto', kind: 'trap', title: '«است» وجود ندارد', literal: '«این — …»', note: 'روسی در زمان حال فعل «بودن/است» را نمی‌گوید: «Это дом» = «این خانه [است]». «است» را در ذهنت بگذار ولی به زبان نیاور؛ گاهی به جایش خط تیره می‌نویسند.', test: new RegExp(`^(это|кто это|что это|вот)${B}`) },
  { id: 'copula', kind: 'trap', title: '«هستم / هستی» حذف می‌شود', literal: '«من — دانشجو»', note: '«Я студент» یعنی «من دانشجو [هستم]». روسی در زمان حال «هستم، هستی، است» ندارد؛ هرجا جمله فعل ندارد، این همان جای «است» فارسی است.', test: new RegExp(`^(я|ты|он|она|мы|вы|они) (не )?(студент|студентка|врач|учитель|учительница|инженер|из|дома|здесь|тут|там|русск|иранец|иранка|рад|рада|занят|занята|свободен|свободна|готов|готова|согласен|согласна|уверен|уверена|женат|замужем|болен|больна|прав|права|уже|еще|тоже|очень|сейчас|сегодня)${B}`) },
  { id: 'gender-past', kind: 'trap', title: 'فعلِ گذشته جنسیت دارد', note: 'در روسی فعل گذشته می‌گوید گوینده مرد است یا زن: «я читал» (مرد) / «я читала» (زن). فارسی چنین چیزی ندارد، پس حواست باشد پایان «-л / -ла» را با خودت هماهنگ کنی.', test: /\(گویندهٔ? (مرد|زن)\)/ },
  { id: 'count', kind: 'trap', title: 'بعد از عدد، اسم تغییر می‌کند', literal: '«پنجِ کتاب‌ها»', note: 'در فارسی اسم بعد از عدد همیشه مفرد است («پنج کتاب»). در روسی بعد از ۱ مفرد، بعد از ۲–۴ حالت اضافهٔ مفرد و بعد از ۵ به بالا حالت اضافهٔ جمع می‌آید. همین است که «год / года / лет» هر سه یعنی «سال».', test: new RegExp(`${B}(два|две|три|четыре|пять|шесть|семь|восемь|девять|десять|двадцать|тридцать|сто|[2-9]|\d{2,}) [а-я]+(а|я|ов|ев|ей|ы|и)${B}`) },
  { id: 'kuda-gde', kind: 'trap', title: 'دو تا «کجا»', literal: '«به‌کجا» / «در‌کجا»', note: 'فارسی برای «کجا می‌روی؟» و «کجا هستی؟» یک کلمه دارد؛ روسی دو تا: «куда» = به کجا (حرکت)، «где» = در کجا (جا). جواب هم همین‌طور: «туда / там»، «сюда / здесь».', test: new RegExp(`${B}(куда|откуда)${B}`) },
  { id: 'motion', kind: 'trap', title: '«رفتن» پیاده یا با وسیله؟', note: 'فارسی برای هر دو «می‌روم» می‌گوید؛ روسی اگر پیاده باشد «идти / ходить» و اگر با ماشین و قطار باشد «ехать / ездить» می‌گوید. تا این فرق را نگویی، جمله از نظر روس‌ها ناقص است.', test: new RegExp(`${B}(иду|идешь|идет|идем|идете|идут|шел|шла|шли|пойду|пойдем|пойдешь|пойдете|пошли|еду|едешь|едет|едем|едете|едут|ехал|ехала|ехали|поеду|поедем|поедешь|поедете|поехали|хожу|ходишь|ходит|ходим|ходите|ходят|ходил|ходила|езжу|ездишь|ездит|ездим|ездят|ездил|ездила)${B}`) },
  { id: 'kak-dela', kind: 'same', title: 'عین فارسی', literal: '«کارها چطور؟»', note: '«Как дела?» تحت‌اللفظی یعنی «کارها چطور؟» — دقیقاً همان «اوضاع چطوره؟» خودمان. جوابش «хорошо / нормально / так себе» = «خوب / معمولی / ای بدک نیست».', test: new RegExp(`${B}как (дела|жизнь|ты|вы)${B}`) },
  { id: 'skolko-stoit', kind: 'same', title: 'عین فارسی', literal: '«چقدر می‌ارزد؟»', note: '«Сколько стоит?» = «چقدر می‌ارزد؟» — همان «چنده؟» فارسی با فعل «ارزیدن». برای جمع: «сколько стоят».', test: new RegExp(`${B}сколько (это )?(стоит|стоят)${B}`) },
  { id: 'pozhaluysta', kind: 'trap', title: 'یک کلمه، سه معنی', note: '«пожалуйста» در روسی سه کار می‌کند: «لطفاً» (در خواهش)، «خواهش می‌کنم» (در جواب تشکر) و «بفرمایید» (وقتی چیزی می‌دهی). فارسی برای هر سه کلمهٔ جدا دارد؛ روسی یکی.', test: new RegExp(`${B}пожалуйста${B}`) },
  { id: 'izvinite', kind: 'same', title: 'عین فارسی', literal: '«ببخشید»', note: '«Извините / Простите» مثل «ببخشید» فارسی هم برای عذرخواهی است هم برای صدا زدن غریبه. «извините» کمی رسمی‌تر و «прости» خودمانی است.', test: new RegExp(`${B}(извините|извини|простите|прости)${B}`) },
  { id: 'davay', kind: 'same', title: 'عین فارسی', literal: '«بیا …»', note: '«Давай / Давайте» دقیقاً همان «بیا… / بیایید…» فارسی است: «Давай пойдем» = «بیا بریم». خودمانی «давай»، محترمانه «давайте».', test: new RegExp(`${B}(давай|давайте)${B}`) },
  { id: 'mozhno', kind: 'same', title: 'عین فارسی', literal: '«می‌شود؟»', note: '«Можно?» همان «میشه؟» بی‌فاعل فارسی است: «Можно войти?» = «میشه بیام تو؟». مخالفش «нельзя» = «نمیشه / نباید».', test: new RegExp(`${B}(можно|нельзя)${B}`) },
  { id: 'nado', kind: 'same', title: 'عین فارسی', literal: '«باید / لازم است»', note: '«надо / нужно» بدون فاعل مثل «باید…» فارسی است و بعدش مصدر می‌آید: «надо идти» = «باید رفت». اگر بخواهی بگویی چه کسی باید، او را «به من»ی می‌کنی: «мне надо».', test: new RegExp(`${B}(надо|нужно)${B}`) },
  { id: 'hochu', kind: 'trap', title: 'بعد از «می‌خواهم» مصدر می‌آید', literal: '«می‌خواهم رفتن»', note: 'فارسی می‌گوید «می‌خواهم بروم» (دو فعل صرف‌شده)؛ روسی می‌گوید «хочу пойти» = «می‌خواهم رفتن». فعل دوم همیشه مصدر است و صرف نمی‌شود.', test: new RegExp(`${B}(хочу|хочешь|хочет|хотим|хотите|хотят|хотел|хотела|хотели|могу|можешь|может|можем|можете|могут|люблю|любишь|любит|умею|умеешь|умеет)${B} [а-я]+(ть|ти|чь)${B}`) },
  { id: 'question-intonation', kind: 'same', title: 'پرسش مثل فارسی', note: 'در روسی مثل فارسی برای سؤالی کردن جای کلمه‌ها عوض نمی‌شود (برخلاف انگلیسی). همان جملهٔ خبری را با آهنگ بالا بگو. اگر دیدی «ли» آمده، همان «آیا» است.', test: /^(ты|вы|он|она|они|мы|это|у) [^?]*\?$/ },
  { id: 'li', kind: 'same', title: '«ли» = «آیا»', note: '«ли» همان «آیا» فارسی است، فقط بعد از کلمه‌ای می‌آید که دربارهٔ آن می‌پرسی: «Знаете ли вы…» = «آیا می‌دانید…».', test: new RegExp(`${B}ли${B}`) },
  { id: 'negation', kind: 'same', title: 'نفی مثل فارسی', literal: '«نه می‌دانم»', note: '«не» درست مثل «ن-» فارسی همیشه چسبیده و قبل از فعل است: «не знаю» = «نمی‌دانم». «нет» جداست و یعنی «نه» یا «نیست/ندارم».', test: new RegExp(`${B}не [а-я]+${B}`) },
  { id: 'vy', kind: 'same', title: '«شما»ی احترام', note: '«Вы» دقیقاً مثل «شما» فارسی هم جمع است هم محترمانه. با غریبه و بزرگ‌تر «Вы» و با دوست و بچه «ты». در نامه با حرف بزرگ می‌نویسند.', test: new RegExp(`${B}(вы|вас|вам|вами|ваш|ваша|ваше|ваши)${B}`) },
  { id: 'kotoryi-chas', kind: 'trap', title: 'ساعت پرسیدن', literal: '«کدام ساعت؟»', note: '«Который час?» تحت‌اللفظی «کدام ساعت؟» است و «Сколько времени?» «چقدر وقت؟» — هر دو یعنی «ساعت چنده؟». جواب با عدد و «час / часа / часов» (قانون شمارش).', test: new RegExp(`${B}(который час|сколько времени|во сколько)${B}`) },
  { id: 'uzhe-eshche', kind: 'trap', title: '«دیگر» و «هنوز»', note: '«уже» = «دیگر / حالا دیگر» و «ещё» = «هنوز / باز هم». در جملهٔ منفی: «ещё не» = «هنوز نه»، «уже не» = «دیگر نه». جای این دو را عوض نکن.', test: new RegExp(`${B}(уже|еще)${B}`) },
  { id: 'tozhe', kind: 'same', title: '«هم» فارسی', note: '«тоже» همان «هم / من هم» فارسی است و بعد از فاعل می‌آید: «Я тоже» = «من هم». با صفت و اسم بیشتر «также» می‌گویند.', test: new RegExp(`${B}(тоже|также)${B}`) },
  { id: 'ochen', kind: 'same', title: 'عین فارسی', note: '«очень» = «خیلی» و درست مثل فارسی قبل از صفت می‌آید: «очень хорошо» = «خیلی خوب». برای اسم «очень» نمی‌گویند؛ می‌گویند «много».', test: new RegExp(`${B}очень${B}`) },
  { id: 'spasibo', kind: 'same', title: 'تشکر', note: '«Спасибо» = «ممنون»، «Большое спасибо» = «خیلی ممنون». جواب رایجش «пожалуйста» یا «не за что» (= «قابلی نداشت») است.', test: new RegExp(`${B}спасибо${B}`) },
  { id: 'prep-place', kind: 'trap', title: '«در» اسم را تغییر می‌دهد', literal: '«در مسکو» → «в Москве»', note: 'فارسی «در» را می‌گذارد و اسم همان می‌ماند؛ روسی «в / на» را می‌گذارد و پایان اسم را هم عوض می‌کند (معمولاً «-е»): Москва → в Москве. به همین دلیل اسم در جمله با شکلِ لغت‌نامه فرق دارد.', test: new RegExp(`${B}(в|на|во) [а-я]+(е|ии|у)${B}`) },
  { id: 'articles', kind: 'same', title: 'خبری از a / the نیست', note: 'روسی مثل فارسی حرف تعریف ندارد. «книга» هم «کتاب» است هم «کتابِ مشخص»؛ از جمله می‌فهمی. یکی از جاهایی که فارسی‌زبان از انگلیسی‌زبان جلوتر است.', test: new RegExp(`^(вот|это|где|что|кто|какой|какая|какое|какие) [а-я]+${B}`) },
];

export const BRIDGE_LOANWORDS: readonly BridgeLoanword[] = [
  { stem: 'самовар', ru: 'самовар', fa: 'سماور', note: 'فارسی از روسی گرفته' },
  { stem: 'стакан', ru: 'стакан', fa: 'استکان', note: 'فارسی از روسی گرفته' },
  { stem: 'чемодан', ru: 'чемодан', fa: 'چمدان', note: 'روسی از فارسی گرفته (جامه‌دان)' },
  { stem: 'чай', ru: 'чай', fa: 'چای', note: 'هر دو از چینی', maxExtra: 1 },
  { stem: 'базар', ru: 'базар', fa: 'بازار', note: 'روسی از فارسی گرفته' },
  { stem: 'караван', ru: 'караван', fa: 'کاروان', note: 'روسی از فارسی گرفته' },
  { stem: 'диван', ru: 'диван', fa: 'دیوان', note: 'روسی از فارسی گرفته' },
  { stem: 'тормоз', ru: 'тормоз', fa: 'ترمز', note: 'فارسی از روسی گرفته' },
  { stem: 'пальто', ru: 'пальто', fa: 'پالتو', note: 'فارسی از روسی گرفته' },
  { stem: 'утюг', ru: 'утюг', fa: 'اتو', note: 'فارسی از روسی گرفته' },
  { stem: 'бочк', ru: 'бочка', fa: 'بشکه', note: 'فارسی از روسی گرفته' },
  { stem: 'коляск', ru: 'коляска', fa: 'کالسکه', note: 'فارسی از روسی گرفته' },
  { stem: 'шахмат', ru: 'шахматы', fa: 'شاه‌مات / شطرنج', note: 'روسی از فارسی گرفته' },
  { stem: 'лимон', ru: 'лимон', fa: 'لیمو', note: 'هر دو از فارسی' },
  { stem: 'сахар', ru: 'сахар', fa: 'شکر', note: 'هر دو از سنسکریت/فارسی' },
  { stem: 'киоск', ru: 'киоск', fa: 'کوشک / کیوسک', note: 'روسی از فارسی گرفته' },
  { stem: 'пижам', ru: 'пижама', fa: 'پیژامه', note: 'هر دو از فارسی (پای‌جامه)' },
  { stem: 'арбуз', ru: 'арбуз', fa: 'خربزه (در روسی: هندوانه)', note: 'روسی از فارسی گرفته' },
  { stem: 'баклажан', ru: 'баклажан', fa: 'بادمجان', note: 'روسی از فارسی گرفته' },
  { stem: 'шафран', ru: 'шафран', fa: 'زعفران', note: 'روسی از فارسی گرفته' },
  { stem: 'жасмин', ru: 'жасмин', fa: 'یاسمن', note: 'روسی از فارسی گرفته' },
  { stem: 'фисташк', ru: 'фисташка', fa: 'پسته', note: 'روسی از فارسی گرفته' },
  { stem: 'бирюз', ru: 'бирюза', fa: 'فیروزه', note: 'روسی از فارسی گرفته' },
  { stem: 'шаль', ru: 'шаль', fa: 'شال', note: 'روسی از فارسی گرفته' },
  { stem: 'шах', ru: 'шах', fa: 'شاه', note: 'روسی از فارسی گرفته', maxExtra: 1 },
  { stem: 'такси', ru: 'такси', fa: 'تاکسی', note: 'واژهٔ بین‌المللی' },
  { stem: 'телефон', ru: 'телефон', fa: 'تلفن', note: 'واژهٔ بین‌المللی' },
  { stem: 'банк', ru: 'банк', fa: 'بانک', note: 'واژهٔ بین‌المللی' },
  { stem: 'автобус', ru: 'автобус', fa: 'اتوبوس', note: 'واژهٔ بین‌المللی' },
  { stem: 'метро', ru: 'метро', fa: 'مترو', note: 'واژهٔ بین‌المللی' },
  { stem: 'кафе', ru: 'кафе', fa: 'کافه', note: 'واژهٔ بین‌المللی' },
  { stem: 'ресторан', ru: 'ресторан', fa: 'رستوران', note: 'واژهٔ بین‌المللی' },
  { stem: 'отел', ru: 'отель', fa: 'هتل', note: 'واژهٔ بین‌المللی' },
  { stem: 'музе', ru: 'музей', fa: 'موزه', note: 'واژهٔ بین‌المللی' },
  { stem: 'фильм', ru: 'фильм', fa: 'فیلم', note: 'واژهٔ بین‌المللی' },
  { stem: 'компьютер', ru: 'компьютер', fa: 'کامپیوتر', note: 'واژهٔ بین‌المللی' },
  { stem: 'интернет', ru: 'интернет', fa: 'اینترنت', note: 'واژهٔ بین‌المللی' },
  { stem: 'музык', ru: 'музыка', fa: 'موزیک / موسیقی', note: 'واژهٔ بین‌المللی' },
  { stem: 'спорт', ru: 'спорт', fa: 'اسپرت / ورزش', note: 'واژهٔ بین‌المللی' },
  { stem: 'футбол', ru: 'футбол', fa: 'فوتبال', note: 'واژهٔ بین‌المللی' },
  { stem: 'паспорт', ru: 'паспорт', fa: 'پاسپورت', note: 'واژهٔ بین‌المللی' },
  { stem: 'виз', ru: 'виза', fa: 'ویزا', note: 'واژهٔ بین‌المللی', maxExtra: 2 },
  { stem: 'билет', ru: 'билет', fa: 'بلیت', note: 'فارسی از روسی/فرانسوی گرفته' },
  { stem: 'вагон', ru: 'вагон', fa: 'واگن', note: 'فارسی از روسی گرفته' },
  { stem: 'машин', ru: 'машина', fa: 'ماشین', note: 'واژهٔ بین‌المللی' },
  { stem: 'бензин', ru: 'бензин', fa: 'بنزین', note: 'واژهٔ بین‌المللی' },
  { stem: 'салат', ru: 'салат', fa: 'سالاد', note: 'واژهٔ بین‌المللی' },
  { stem: 'суп', ru: 'суп', fa: 'سوپ', note: 'واژهٔ بین‌المللی', maxExtra: 2 },
  { stem: 'кофе', ru: 'кофе', fa: 'قهوه', note: 'هر دو از عربی/ترکی' },
  { stem: 'шоколад', ru: 'шоколад', fa: 'شکلات', note: 'واژهٔ بین‌المللی' },
  { stem: 'пицц', ru: 'пицца', fa: 'پیتزا', note: 'واژهٔ بین‌المللی' },
  { stem: 'доктор', ru: 'доктор', fa: 'دکتر', note: 'واژهٔ بین‌المللی' },
  { stem: 'полици', ru: 'полиция', fa: 'پلیس', note: 'واژهٔ بین‌المللی' },
  { stem: 'адрес', ru: 'адрес', fa: 'آدرس', note: 'واژهٔ بین‌المللی' },
  { stem: 'номер', ru: 'номер', fa: 'نمره / شماره', note: 'فارسی از روسی/فرانسوی گرفته' },
  { stem: 'аптек', ru: 'аптека', fa: 'آپتک (داروخانه)', note: 'در فارسی گفتاری قدیم' },
  { stem: 'сигарет', ru: 'сигарета', fa: 'سیگار', note: 'واژهٔ بین‌المللی' },
  { stem: 'мам', ru: 'мама', fa: 'مامان', note: 'واژهٔ بین‌المللی', maxExtra: 2 },
  { stem: 'пап', ru: 'папа', fa: 'بابا', note: 'واژهٔ بین‌المللی', maxExtra: 2 },
  { stem: 'студент', ru: 'студент', fa: 'استیودنت (دانشجو)', note: 'واژهٔ بین‌المللی' },
  { stem: 'универ', ru: 'университет', fa: 'یونیورسیتی (دانشگاه)', note: 'واژهٔ بین‌المللی' },
  { stem: 'минут', ru: 'минута', fa: 'مینوت (دقیقه)', note: 'واژهٔ بین‌المللی' },
  { stem: 'секунд', ru: 'секунда', fa: 'سکند (ثانیه)', note: 'واژهٔ بین‌المللی' },
  { stem: 'проблем', ru: 'проблема', fa: 'پرابلم (مشکل)', note: 'واژهٔ بین‌المللی' },
  { stem: 'идея', ru: 'идея', fa: 'ایده', note: 'واژهٔ بین‌المللی' },
  { stem: 'момент', ru: 'момент', fa: 'مومنت (لحظه)', note: 'واژهٔ بین‌المللی' },
  { stem: 'центр', ru: 'центр', fa: 'سنتر (مرکز)', note: 'واژهٔ بین‌المللی' },
  { stem: 'парк', ru: 'парк', fa: 'پارک', note: 'واژهٔ بین‌المللی' },
  { stem: 'офис', ru: 'офис', fa: 'آفیس (دفتر)', note: 'واژهٔ بین‌المللی' },
  { stem: 'менеджер', ru: 'менеджер', fa: 'منیجر (مدیر)', note: 'واژهٔ بین‌المللی' },
  { stem: 'супермаркет', ru: 'супермаркет', fa: 'سوپرمارکت', note: 'واژهٔ بین‌المللی' },
  { stem: 'ресепш', ru: 'ресепшен', fa: 'رسپشن', note: 'واژهٔ بین‌المللی' },
];

/** Tokens of the normalized sentence, letters only. */
const words = (text: string): string[] => normalizeRussian(text).split(/[^а-я-]+/).filter(Boolean);

export function loanwordsIn(text: string): BridgeLoanword[] {
  const seen = new Set<string>();
  const result: BridgeLoanword[] = [];
  for (const word of words(text)) {
    for (const item of BRIDGE_LOANWORDS) {
      if (word.startsWith(item.stem) && word.length <= item.stem.length + (item.maxExtra ?? 3) && !seen.has(item.stem)) { seen.add(item.stem); result.push(item); }
    }
  }
  return result.slice(0, 3);
}

/** First matching rule by priority (rules are ordered from most specific to most general). */
export function bridgeRuleFor(text: string, fa = ''): BridgeRule | null {
  const haystack = normalizeRussian(text);
  for (const rule of BRIDGE_RULES) {
    if (rule.id === 'gender-past' ? rule.test.test(fa) : rule.test.test(haystack)) return rule;
  }
  return null;
}

export function bridgeFor(sentence: Pick<LearningSentence, 'text' | 'fa'>): SentenceBridge {
  return { rule: bridgeRuleFor(sentence.text, sentence.fa), loanwords: loanwordsIn(sentence.text) };
}

/** Rules that appear in a lesson, deduplicated in order of first appearance — for the lesson summary. */
export function bridgeRulesForLesson(sentences: ReadonlyArray<Pick<LearningSentence, 'text' | 'fa'>>): BridgeRule[] {
  const out: BridgeRule[] = [];
  for (const sentence of sentences) {
    const rule = bridgeRuleFor(sentence.text, sentence.fa);
    if (rule && !out.includes(rule)) out.push(rule);
  }
  return out;
}
