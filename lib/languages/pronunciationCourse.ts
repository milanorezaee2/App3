import { LANGUAGE_IDS, type LanguageId } from './registry';

/**
 * Every registered language can carry a pronunciation workshop. The type is the
 * registry union, so a new language needs no edit here: add its units below (or
 * none, and the route simply stays closed) and the rest follows automatically.
 */
export type PronunciationLanguage = LanguageId;

export interface PronunciationExample {
  text: string;
  meaningFa: string;
  focusFa: string;
}

export interface PronunciationUnit {
  id: string;
  title: string;
  focusFa: string;
  explanationFa: string;
  examples: readonly PronunciationExample[];
  practiceFa: string;
  practiceText: string;
  practiceMeaningFa: string;
}

/**
 * Short, self-guided pronunciation workshops for Persian-speaking learners.
 * Persian descriptions explain mouth movement and listening focus; they are not
 * phonetic transcriptions or claims that a single accent is the only valid one.
 */
const PRONUNCIATION_UNITS: Partial<Record<PronunciationLanguage, readonly PronunciationUnit[]>> = {
  tr: [
    {
      id: 'tr-vowels-i-dotless',
      title: 'واکهٔ نقطه‌دار i و بی‌نقطه ı',
      focusFa: 'در ı لب‌ها کشیده نمی‌شوند و زبان کمی عقب‌تر از «ای» فارسی قرار می‌گیرد.',
      explanationFa: 'در ترکی استانبولی İ / i دقیقاً صدای «ای» روشن و جلویی دارد، اما I / ı (حرف بی‌نقطه در هر دو شکل بزرگ و کوچک!) واکه‌ای پسین و بدون گرد شدن لب‌هاست. به تفاوت جفت‌ها گوش دهید و لب‌ها را هنگام ادای ı کاملاً آزاد نگه دارید.',
      examples: [
        { text: 'iyi', meaningFa: 'خوب', focusFa: 'هر دو i روشن و جلویی' },
        { text: 'ılık', meaningFa: 'ولرم / معتدل', focusFa: 'ı پسین؛ لب‌ها گرد نشوند' },
        { text: 'kış', meaningFa: 'زمستان', focusFa: 'ı کوتاه در میان دو همخوان' },
        { text: 'diş · dış', meaningFa: 'دندان · بیرون', focusFa: 'تغییر معنی فقط با تفاوت i و ı' },
      ],
      practiceFa: 'ابتدا نمونهٔ صوتی را با سرعت آرام بشنوید و بدون گرد کردن لب‌ها تفاوت diş و dış را تکرار کنید.',
      practiceText: 'Bugün hava ılık ve çok iyi.',
      practiceMeaningFa: 'امروز هوا معتدل و خیلی خوب است.',
    },
    {
      id: 'tr-rounded-vowels',
      title: 'واکه‌های گردِ جلویی: ö و ü در برابر o و u',
      focusFa: 'لب‌ها را گرد نگه دارید، اما زبان را به جایگاه e و i جلو بیاورید.',
      explanationFa: 'برای ساختن ö لب‌ها را مثل «او» گرد کنید و هم‌زمان بخواهید صدای «اِ» بگویید؛ برای ü نیز لب‌ها گرد می‌مانند ولی زبان در جایگاه «ای» قرار می‌گیرد. جایگزین کردن آن‌ها با o و u معنی بسیاری از واژه‌ها را تغییر می‌دهد.',
      examples: [
        { text: 'ol · öl', meaningFa: 'باش · بمیر', focusFa: 'تفاوت حیاتی o پسین و ö جلویی' },
        { text: 'un · ün', meaningFa: 'آرد · شهرت', focusFa: 'تفاوت u پسین و ü جلویی' },
        { text: 'göz', meaningFa: 'چشم', focusFa: 'ö کوتاه و گرد در تک‌هجا' },
        { text: 'günaydın', meaningFa: 'صبح بخیر', focusFa: 'شروع با ü جلویی و پایان با ı پسین' },
      ],
      practiceFa: 'جفت‌ها را پشت سر هم گوش کنید و با حفظ گردی لب‌ها، جلو آمدن زبان در ö و ü را تمرین کنید.',
      practiceText: 'Üç güzel gül gördüm.',
      practiceMeaningFa: 'سه گل سرخ زیبا دیدم.',
    },
    {
      id: 'tr-special-consonants',
      title: 'حروف ویژه: c، ç، ş و ğ (یوموشاک گ)',
      focusFa: 'حرف c صدای «ج» دارد و ğ در استانبول صدای «غ» ندارد بلکه واکهٔ پیشین را می‌کشد.',
      explanationFa: 'در خط ترکی هر حرف همیشه یک ارزش آوایی ثابت دارد: c = ج، ç = چ، ş = ش. حرف ğ (yumuşak g) هرگز در آغاز واژه نمی‌آید؛ با واکه‌های پسین (a, ı, o, u) فقط واکهٔ قبل را کمی می‌کشد و با واکه‌های پیشین (e, i, ö, ü) نرمش خفیفی شبیه «ی» ایجاد می‌کند.',
      examples: [
        { text: 'cam · çam', meaningFa: 'شیشه · درخت کاج', focusFa: 'c (ج) در برابر ç (چ)' },
        { text: 'şeker', meaningFa: 'شکر', focusFa: 'ş روشن در آغاز واژه' },
        { text: 'dağ · yağmur', meaningFa: 'کوه · باران', focusFa: 'ğ بدون تلفظ حلقی؛ کشش ملایم a' },
        { text: 'değil · öğrenci', meaningFa: 'نیست · دانش‌آموز', focusFa: 'نرمش لطیف میان دو واکه' },
      ],
      practiceFa: 'هنگام گفتن yağmur و öğrenci گلو را منقبض نکنید؛ اجازه دهید واکهٔ پیش از ğ نرم و پیوسته ادا شود.',
      practiceText: 'Öğrenci cam kenarında çay içiyor.',
      practiceMeaningFa: 'دانشجو کنار پنجره چای می‌نوشد.',
    },
    {
      id: 'tr-vowel-harmony-stress',
      title: 'هماهنگی واکه‌ها و تکیهٔ جمله',
      focusFa: 'پسوندها با آخرین واکهٔ ریشه هم‌نوا می‌شوند و جزء پرسشی بی‌تکیه است.',
      explanationFa: 'در ترکی استانبولی تکیهٔ بیشتر واژه‌ها به‌نرمی روی هجای پایانی می‌نشیند، اما پسوند منفی (-ma/-me) و جزء پرسشی (mı/mi/mu/mü) تکیه را به هجای دقیقاً پیش از خود می‌سپارند. به جریان پیوستهٔ پسوندها گوش کنید.',
      examples: [
        { text: 'evde · okulda', meaningFa: 'در خانه · در مدرسه', focusFa: 'هم‌نوایی پسوند مکانی با واکهٔ ریشه' },
        { text: 'geliyor musunuz?', meaningFa: 'آیا می‌آیید؟', focusFa: 'برجستگی ملایم پیش از جزء پرسشی mu' },
        { text: 'İstanbul\'dayım', meaningFa: 'در استانبول هستم', focusFa: 'تکیه روی نام مکان در آغاز' },
      ],
      practiceFa: 'جمله را یک‌تکه بشنوید و بدون مکث مصنوعی بین ریشه و پسوند، آهنگ طبیعی پرسش را تقلید کنید.',
      practiceText: 'Yarın bizimle İstanbul\'a geliyor musunuz?',
      practiceMeaningFa: 'آیا فردا با ما به استانبول می‌آیید؟',
    },
  ],
  ru: [
    {
      id: 'ru-vowels-a-o',
      title: 'واکه‌های а و о',
      focusFa: 'تکیه می‌تواند کیفیت واکهٔ ناآکسان را تغییر دهد.',
      explanationFa: 'در روسی، واکهٔ بی‌تکیه ممکن است کوتاه‌تر و کم‌رنگ‌تر شنیده شود. نمونه‌ها را با صدای دستگاه گوش کنید و به جای حدس از روی نوشتار، شکل شنیداری واژه را تمرین کنید.',
      examples: [
        { text: 'мама', meaningFa: 'مادر', focusFa: 'دو а را روشن و جدا ادا کنید' },
        { text: 'вода', meaningFa: 'آب', focusFa: 'تکیهٔ پایانی را بشنوید' },
        { text: 'молоко', meaningFa: 'شیر', focusFa: 'تکیه روی واکهٔ پایانی است' },
      ],
      practiceFa: 'ابتدا واژه را گوش کنید، سپس با سرعت آرام و عادی تکرار کنید.',
      practiceText: 'Мама пьёт воду.',
      practiceMeaningFa: 'مامان آب می‌نوشد.',
    },
    {
      id: 'ru-soft-hard',
      title: 'همخوان نرم و سخت',
      focusFa: 'در بسیاری از جفت‌ها، نرم‌شدن همخوان معنی را عوض می‌کند.',
      explanationFa: 'در روسی، جایگاه زبان و واکهٔ پس از همخوان بر نرم یا سخت شنیده‌شدن آن اثر می‌گذارد. به تفاوت جفت‌ها گوش کنید؛ این تمرین فقط نمونهٔ شنیداری است، نه ارزیابی تلفظ.',
      examples: [
        { text: 'брат', meaningFa: 'برادر', focusFa: 'б سخت' },
        { text: 'брать', meaningFa: 'گرفتن', focusFa: 'т پایانی نرم' },
        { text: 'угол', meaningFa: 'گوشه', focusFa: 'л سخت' },
        { text: 'уголь', meaningFa: 'زغال‌سنگ', focusFa: 'л نرم' },
      ],
      practiceFa: 'به پایان واژه گوش دهید و تفاوت جفت را آرام تکرار کنید.',
      practiceText: 'Мой брат хочет брать книгу.',
      practiceMeaningFa: 'برادرم می‌خواهد کتاب را بردارد.',
    },
    {
      id: 'ru-stress-rhythm',
      title: 'تکیه و آهنگ جمله',
      focusFa: 'جای تکیه را از نمونهٔ صوتی یاد بگیرید؛ آن را با حروف فارسی حدس نزنید.',
      explanationFa: 'تکیه در روسی واژگانی است و می‌تواند روی بخش‌های متفاوت قرار بگیرد. جمله را به‌صورت یک عبارت طبیعی گوش کنید و واژهٔ پرسشی را روشن‌تر ادا کنید.',
      examples: [
        { text: 'спасибо', meaningFa: 'ممنون', focusFa: 'تکیه روی بخش دوم' },
        { text: 'хорошо', meaningFa: 'خوب', focusFa: 'تکیه روی بخش پایانی' },
        { text: 'Как дела?', meaningFa: 'حالت چطور است؟', focusFa: 'پرسش کوتاه و روان' },
      ],
      practiceFa: 'یک‌بار گوش کنید، سپس جمله را با مکث طبیعی و آهنگ پرسشی تکرار کنید.',
      practiceText: 'Как дела? Спасибо, хорошо.',
      practiceMeaningFa: 'حالت چطور است؟ ممنون، خوبم.',
    },
    {
      id: 'ru-vowels-y-i',
      title: 'واکهٔ ы در برابر и',
      focusFa: 'ы واکهٔ عقب‌تر و کم‌رنگ‌تری است؛ در فارسی معادل دقیقی ندارد و نباید با «ای» یکی شود.',
      explanationFa: 'در روسی، и واکهٔ جلو و روشن است و ы واکه‌ای عقب‌تر که زبان در آن کمی جمع می‌شود. پس از همخوان‌های همیشه‌سخت مثل ж و ш معمولاً ы شنیده می‌شود. نمونه‌ها را با صدای دستگاه گوش کنید و تفاوت جفت‌ها را بشنوید؛ این تمرین فقط شنیداری است.',
      examples: [
        { text: 'мы · ми', meaningFa: 'ما · حرف می (نام نت)', focusFa: 'ы عقب‌تر در برابر и جلویی' },
        { text: 'быть', meaningFa: 'بودن', focusFa: 'ы پس از ب سخت' },
        { text: 'машина', meaningFa: 'ماشین', focusFa: 'ши با ы شنیده می‌شود' },
        { text: 'спасибо', meaningFa: 'ممنون', focusFa: 'и روشن و جلویی' },
      ],
      practiceFa: 'جفت мы و ми را چند بار پشت سر هم گوش کنید؛ سپس بدون کشیدن «ای» در ы، آهسته تکرار کنید.',
      practiceText: 'Мы были в машине.',
      practiceMeaningFa: 'ما در ماشین بودیم.',
    },
  ],
  en: [
    {
      id: 'en-vowels-ship-sheep',
      title: 'واکهٔ کوتاه و بلند: ship و sheep',
      focusFa: 'فرق کیفیت صدا را هم بشنو؛ فقط آن را نکش.',
      explanationFa: 'در ship صدای i کوتاه‌تر و کمی بازتر است. در sheep زبان بالاتر و جلوتر می‌رود و واکه کشیده‌تر می‌شود. این دو صدا را با یک «ای» یکسان نخوان.',
      examples: [
        { text: 'ship', meaningFa: 'کشتی', focusFa: 'i کوتاه' },
        { text: 'sheep', meaningFa: 'گوسفند', focusFa: 'ee کشیده' },
        { text: 'sit', meaningFa: 'نشستن', focusFa: 'i کوتاه' },
        { text: 'seat', meaningFa: 'صندلی', focusFa: 'ea کشیده' },
      ],
      practiceFa: 'دو واژهٔ هر جفت را پشت سر هم گوش کنید؛ سپس بدون نگاه‌کردن به ترجمه، تفاوتشان را با صدای خودتان تکرار کنید.',
      practiceText: 'The sheep is on the ship.',
      practiceMeaningFa: 'گوسفند روی کشتی است.',
    },
    {
      id: 'en-vowels-cap-cup',
      title: 'فرق صدای a در cap و cup',
      focusFa: 'دهانِ cap بازتر است؛ cup صدایی مرکزی‌تر دارد.',
      explanationFa: 'در انگلیسی آمریکایی، واکهٔ cap با دهان بازتر و زبان جلوتر ساخته می‌شود. در cup زبان راحت‌تر و نزدیک مرکز دهان است. این دو را با «اَ» و «آ» فارسی جایگزین نکن؛ به نمونهٔ صوتی گوش بده.',
      examples: [
        { text: 'cap', meaningFa: 'کلاه لبه‌دار', focusFa: 'دهان بازتر؛ واکهٔ جلویی' },
        { text: 'cup', meaningFa: 'فنجان', focusFa: 'واکهٔ مرکزی‌تر' },
        { text: 'bat', meaningFa: 'خفاش', focusFa: 'همان واکهٔ cap' },
        { text: 'but', meaningFa: 'اما', focusFa: 'همان واکهٔ cup' },
      ],
      practiceFa: 'لب‌ها را رها نگه دارید و جفت cap/cup را آهسته، سپس در سرعت عادی تکرار کنید؛ حروف را با هم عوض نکنید.',
      practiceText: 'Put the cap beside the cup.',
      practiceMeaningFa: 'کلاه را کنار فنجان بگذار.',
    },
    {
      id: 'en-th-thin-this',
      title: 'دو صدای th در thin و this',
      focusFa: 'نوک زبان را آرام میان دندان‌ها بگذار.',
      explanationFa: 'برای هر دو صدا، نوک زبان کمی میان دندان‌ها می‌آید و هوا از کنارش می‌گذرد. در thin صدا بی‌واک است؛ در this تارهای صوتی هم می‌لرزند. آن را با s، z یا d عوض نکن.',
      examples: [
        { text: 'thin', meaningFa: 'نازک', focusFa: 'هوا جاری است؛ گلو نمی‌لرزد' },
        { text: 'this', meaningFa: 'این', focusFa: 'همان جای زبان؛ گلو می‌لرزد' },
        { text: 'think', meaningFa: 'فکرکردن', focusFa: 'th بی‌واک' },
        { text: 'they', meaningFa: 'آن‌ها', focusFa: 'th واک‌دار' },
      ],
      practiceFa: 'آینه کمک می‌کند جای زبان را ببینید. لازم نیست زبان را زیاد بیرون بیاورید؛ تنها نوکش را به لبهٔ دندان‌ها نزدیک کنید.',
      practiceText: 'I think this is theirs.',
      practiceMeaningFa: 'فکر می‌کنم این مال آن‌هاست.',
    },
    {
      id: 'en-v-w',
      title: 'فرق v و w در vest و west',
      focusFa: 'برای v دندان و لب نزدیک می‌شوند؛ برای w لب‌ها گرد می‌شوند.',
      explanationFa: 'در v دندان‌های بالایی آرام به لب پایین می‌رسند و صدا می‌لرزد. برای w دندان‌ها به لب نمی‌خورند؛ لب‌ها گرد می‌شوند و بعد باز می‌شوند. این دو را با هم جابه‌جا نکن.',
      examples: [
        { text: 'vest', meaningFa: 'جلیقه', focusFa: 'v با تماس آرام دندان و لب' },
        { text: 'west', meaningFa: 'غرب', focusFa: 'w با لب‌های گرد، بدون تماس دندان' },
        { text: 'vet', meaningFa: 'دامپزشک', focusFa: 'v' },
        { text: 'wet', meaningFa: 'خیس', focusFa: 'w' },
      ],
      practiceFa: 'لب پایین را هنگام v لمس کنید؛ برای w تماس را بردارید. هر جفت را گوش کنید و سپس از روی شکل دهان تقلید کنید.',
      practiceText: 'We left the vest by the west door.',
      practiceMeaningFa: 'جلیقه را کنار درِ غربی گذاشتیم.',
    },
    {
      id: 'en-r-l',
      title: 'فرق r و l در right و light',
      focusFa: 'جای نوک زبان در این دو صدا یکی نیست.',
      explanationFa: 'در r آمریکایی زبان به سقف دهان نمی‌چسبد و کمی عقب می‌رود؛ در l نوک زبان به برجستگی پشت دندان‌های بالایی می‌رسد. صدای r انگلیسی را با رِ لرزشی فارسی یکی نکن.',
      examples: [
        { text: 'right', meaningFa: 'راست؛ درست', focusFa: 'r بدون ضربهٔ نوک زبان' },
        { text: 'light', meaningFa: 'نور؛ سبک', focusFa: 'l با تماس نوک زبان' },
        { text: 'grass', meaningFa: 'چمن', focusFa: 'r آمریکایی' },
        { text: 'glass', meaningFa: 'لیوان', focusFa: 'l' },
      ],
      practiceFa: 'کلمه‌ها را آهسته شروع کنید؛ برای r زبان را نلرزانید و برای l تماس نوک زبان را کوتاه و روشن نگه دارید.',
      practiceText: 'Turn right at the light.',
      practiceMeaningFa: 'کنار چراغ به راست بپیچ.',
    },
    {
      id: 'en-word-endings',
      title: 'پایان واژه را کامل بگویید',
      focusFa: 'صدای پایانی را نگه دار؛ میان همخوان‌ها واکه اضافه نکن.',
      explanationFa: 'در rice صدای پایانی s بی‌واک است؛ در rise همان جایگاه با z واک‌دار می‌شود و معنی کلمه عوض می‌شود. در asked نیز خوشهٔ پایانی را حفظ کن؛ بعد از آن یک «ـِ» اضافه نکن.',
      examples: [
        { text: 'rice', meaningFa: 'برنج', focusFa: 'پایان s بی‌واک' },
        { text: 'rise', meaningFa: 'بالارفتن؛ برخاستن', focusFa: 'پایان z واک‌دار' },
        { text: 'asked', meaningFa: 'پرسید', focusFa: 'پایان خوشه‌ای؛ بدون واکهٔ اضافه' },
      ],
      practiceFa: 'پایان کلمه را رها نکنید؛ rice و rise را مقایسه کنید و asked را یک‌تکه بگویید، نه «اَسکِد».',
      practiceText: 'I asked for rice.',
      practiceMeaningFa: 'برنج خواستم.',
    },
    {
      id: 'en-s-ed-endings',
      title: 'پایان‌های s و ed',
      focusFa: 'پسوند نوشته‌شده یکسان است، اما صدایش با صدای پیش از آن هماهنگ می‌شود.',
      explanationFa: 'پایان جمع یا سوم‌شخص s معمولاً بعد از صدای بی‌واک /s/، بعد از صدای واک‌دار /z/ و پس از صداهای شبیه s/sh/ch به صورت هجای کوتاه /ɪz/ شنیده می‌شود. ed هم پس از صدای بی‌واک معمولاً /t/، پس از صدای واک‌دار /d/ و پس از t یا d به صورت /ɪd/ ادا می‌شود.',
      examples: [
        { text: 'cats', meaningFa: 'گربه‌ها', focusFa: 'پایان s بی‌واک' },
        { text: 'bags', meaningFa: 'کیف‌ها', focusFa: 'پایان z واک‌دار' },
        { text: 'watches', meaningFa: 'تماشا می‌کند', focusFa: 'پایان یک هجای کوتاه /ɪz/' },
        { text: 'watched · cleaned · wanted', meaningFa: 'تماشا کرد · تمیز کرد · خواست', focusFa: 'به‌ترتیب: t · d · یک هجای کوتاه /ɪd/' },
      ],
      practiceFa: 'واژه‌ها را دسته‌بندی و گوش کنید؛ در watched یک هجای تازه نسازید، اما wanted را با هجای پایانیِ کوتاه کامل بگویید.',
      practiceText: 'He watched, cleaned, and wanted to play.',
      practiceMeaningFa: 'او تماشا کرد، تمیز کرد و خواست بازی کند.',
    },
    {
      id: 'en-word-stress',
      title: 'تکیهٔ واژه: a present و to present',
      focusFa: 'در بسیاری از واژه‌ها تکیه، معنی یا نقش دستوری را روشن می‌کند.',
      explanationFa: 'هجای تکیه‌دار معمولاً برجسته‌تر و روشن‌تر شنیده می‌شود؛ همهٔ هجاها را با فشار یکسان نگویید. در این دو جمله، جای تکیهٔ present عوض می‌شود: اسم روی هجای اول و فعل روی هجای دوم تکیه دارد.',
      examples: [
        { text: 'I got a present.', meaningFa: 'یک هدیه گرفتم.', focusFa: 'تکیهٔ اسم: PRE-sent' },
        { text: 'I present the award.', meaningFa: 'جایزه را اهدا می‌کنم.', focusFa: 'تکیهٔ فعل: pre-SENT' },
        { text: 'a record', meaningFa: 'یک سابقه؛ یک صفحهٔ موسیقی', focusFa: 'اسم؛ معمولاً تکیهٔ آغازین' },
        { text: 'to record', meaningFa: 'ضبط‌کردن؛ ثبت‌کردن', focusFa: 'فعل؛ معمولاً تکیهٔ هجای دوم' },
      ],
      practiceFa: 'جمله را کامل گوش کنید، هجای برجسته را پیدا کنید و همان بخش را کمی واضح‌تر بگویید؛ لازم نیست آن را فریاد بزنید.',
      practiceText: 'They record the program today.',
      practiceMeaningFa: 'آن‌ها امروز برنامه را ضبط می‌کنند.',
    },
    {
      id: 'en-sentence-rhythm',
      title: 'تکیه و آهنگ جمله',
      focusFa: 'واژه‌های اصلی را برجسته کن؛ سؤال بله/خیر معمولاً آهنگ رو به بالا دارد.',
      explanationFa: 'در گفتار طبیعی، واژه‌های مهم‌تر مثل اسم و فعل برجسته‌ترند و واژه‌های دستوری کوتاه‌تر می‌شوند. سؤال بله/خیر اغلب با آهنگ رو به بالا پایان می‌یابد؛ پرسش‌های واژه‌پرسشی معمولاً آهنگ رو به پایین دارند. آهنگ با توجه به منظور می‌تواند تغییر کند.',
      examples: [
        { text: 'I need a cup of tea, please.', meaningFa: 'لطفاً یک فنجان چای می‌خواهم.', focusFa: 'need، cup و tea را برجسته‌تر بگویید' },
        { text: 'Do you need a cup of tea?', meaningFa: 'یک فنجان چای می‌خواهید؟', focusFa: 'پرسش بله/خیر؛ پایان معمولاً رو به بالا' },
        { text: 'Where is the bus stop?', meaningFa: 'ایستگاه اتوبوس کجاست؟', focusFa: 'پرسش واژه‌پرسشی؛ پایان معمولاً رو به پایین' },
      ],
      practiceFa: 'یک بار جمله‌ها را با صدای نمونه گوش کنید؛ بار دوم فقط واژهٔ مهم را کمی برجسته کنید و آهنگ را با منظور جمله هماهنگ نگه دارید.',
      practiceText: 'Could you help me, please?',
      practiceMeaningFa: 'ممکن است لطفاً به من کمک کنید؟',
    },
  ],

  de: [
    {
      id: 'de-umlauts-round-front',
      title: 'واکه‌های ü و ö در برابر u و o',
      focusFa: 'لب‌ها گرد می‌مانند، اما زبان جلو می‌آید؛ جایگزینی آن‌ها با u و o معنی را عوض می‌کند.',
      explanationFa: 'برای ü لب‌ها مثل «او» گرد می‌شوند و هم‌زمان زبان در جایگاه «ای» قرار می‌گیرد؛ در ö لب‌ها گرد می‌مانند و زبان به جایگاه «اِ» می‌آید. نمونه‌ها را با صدای دستگاه گوش کنید و جفت‌ها را پشت سر هم مقایسه کنید. این تمرین نمونهٔ شنیداری است و تلفظ شما را نمره نمی‌دهد.',
      examples: [
        { text: 'schon · schön', meaningFa: 'قبلاً · زیبا', focusFa: 'یک جفت با تفاوت o و ö' },
        { text: 'Bruder · Brüder', meaningFa: 'برادر · برادران', focusFa: 'u پسین در برابر ü جلویی' },
        { text: 'müde', meaningFa: 'خسته', focusFa: 'ü در تک‌هجا' },
        { text: 'König', meaningFa: 'پادشاه', focusFa: 'ö در آغاز واژه' },
      ],
      practiceFa: 'هر جفت را نخست آهسته گوش کنید؛ سپس فقط ö و ü را با لبِ گرد و زبانِ جلو تکرار کنید.',
      practiceText: 'Schöne Grüße von meinem Bruder.',
      practiceMeaningFa: 'سلام گرم از طرف برادرم.',
    },
    {
      id: 'de-ch-soft-hard',
      title: 'صدای ch: نرمِ ich و سختِ ach',
      focusFa: 'ch پس از واکه‌های پیشین نرم و پس از a، o، u سخت‌تر و عقب‌تر شنیده می‌شود.',
      explanationFa: 'در آلمانی معیار، ch دو چهره دارد: پس از i، e، ä، ö، ü نرم و بی‌لرزش در جلوی دهان ادا می‌شود (نه «ش»)، و پس از a، o، u در عقب دهان کمی خشن‌تر. در آغاز چند واژهٔ وام‌گرفته ch مانند «ک» خوانده می‌شود، مثل Christ. به جای صدا در دهان گوش کنید.',
      examples: [
        { text: 'ich', meaningFa: 'من', focusFa: 'ch نرم؛ به «ش» تبدیل نشود' },
        { text: 'Buch', meaningFa: 'کتاب', focusFa: 'ch سخت پس از u' },
        { text: 'Kirche', meaningFa: 'کلیسا', focusFa: 'k سخت در آغاز، ch نرم در پایان' },
        { text: 'Christ', meaningFa: 'مسیح', focusFa: 'ch آغازین مانند k' },
      ],
      practiceFa: 'دوست و Buch را پشت سر هم گوش کنید؛ تفاوت جای صدا را حس کنید و ch را با «ش» عوض نکنید.',
      practiceText: 'Ich möchte das Buch in der Kirche lesen.',
      practiceMeaningFa: 'می‌خواهم کتاب را در کلیسا بخوانم.',
    },
    {
      id: 'de-consonant-surprises',
      title: 'حروف فریب‌دهنده: z، v، w، s و ß',
      focusFa: 'z همیشه «تس» است، w «و»، v در بیشتر واژه‌ها «ف» و s پیش از واکه «ز».',
      explanationFa: 'این حروف در آلمانی با انگلیسی فرق دارند: z «تس»، w «و»، v در بسیاری از واژه‌ها «ف»، و s پیش از واکه «ز» شنیده می‌شود؛ s در پایان هجا «س» می‌ماند. حرف ß همان «س» بی‌لرزش است. نمونه‌ها را بشنوید تا نوشتار گمراهتان نکند.',
      examples: [
        { text: 'Zeit', meaningFa: 'زمان', focusFa: 'z = تس در آغاز واژه' },
        { text: 'Vater · Wasser', meaningFa: 'پدر · آب', focusFa: 'v = ف و w = و' },
        { text: 'Haus · sagen', meaningFa: 'خانه · گفتن', focusFa: 's پایانی «س»، s پیش از واکه «ز»' },
        { text: 'Straße', meaningFa: 'خیابان', focusFa: 'ß صدای «س» بی‌لرزش' },
      ],
      practiceFa: 'هر واژه را یک بار آهسته و یک بار عادی بشنوید؛ سپس حرف‌های z و w و v را جدا تمرین کنید.',
      practiceText: 'Wir sagen: Zeit ist Geld.',
      practiceMeaningFa: 'می‌گوییم: زمان پول است.',
    },
    {
      id: 'de-r-endings-stress',
      title: 'r، پایانه‌ها و تکیهٔ واژه',
      focusFa: 'r در عقب دهان ساخته می‌شود، پایانهٔ -er کم‌رنگ است و تکیه معمولاً روی بخش نخست می‌نشیند.',
      explanationFa: 'r آلمانی در آغاز واژه لرزش ملایمی در عقب دهان دارد و پس از واکه‌های بلند و در پایانه‌های -er بسیار کم‌رنگ می‌شود. همخوان‌های b، d، g در پایان هجا سخت‌تر شنیده می‌شوند؛ مثلاً Tag نزدیک به «تاک». واژه‌های چندبخشی معمولاً تکیه را روی بخش نخست دارند.',
      examples: [
        { text: 'rot', meaningFa: 'قرمز', focusFa: 'r آغازین در عقب دهان' },
        { text: 'Lehrer', meaningFa: 'معلم', focusFa: 'پایانهٔ -er کوتاه و بی‌تکیه' },
        { text: 'Tag · Tage', meaningFa: 'روز · روزها', focusFa: 'g پایانی سخت، g میان واکه‌ها نرم' },
        { text: 'Arbeit', meaningFa: 'کار', focusFa: 'تکیه روی بخش نخست' },
      ],
      practiceFa: 'جمله را یک‌تکه گوش کنید؛ سپس با همان آهنگ و بدون تکیهٔ اضافه روی بخش‌های دیگر تکرار کنید.',
      practiceText: 'Der Lehrer kommt am Tag zurück.',
      practiceMeaningFa: 'معلم روز برمی‌گردد.',
    },
  ],
  fr: [
    {
      id: 'fr-nasal-vowels',
      title: 'واکه‌های خیشومی: on، an، in، un',
      focusFa: 'هوا در این واکه‌ها از بینی می‌گذرد و n پایانی به‌صورت همخوان جدا شنیده نمی‌شود.',
      explanationFa: 'در فرانسوی حروف on، an، in و un یک واکهٔ خیشومی می‌سازند: بخش اصلی صدا از بینی می‌آید و همخوان n در پایان ادا نمی‌شود. نمونه‌ها را بشنوید و جفت‌ها را مقایسه کنید؛ این کارگاه تلفظ را ارزیابی نمی‌کند و فقط گوش شما را راه می‌اندازد.',
      examples: [
        { text: 'bon', meaningFa: 'خوب', focusFa: 'on خیشومی، بدون n پایانی' },
        { text: 'vin', meaningFa: 'شراب', focusFa: 'in خیشومی' },
        { text: 'grand', meaningFa: 'بزرگ', focusFa: 'an خیشومی؛ d پایانی خاموش' },
        { text: 'un · une', meaningFa: 'یک (مذکر) · یک (مؤنث)', focusFa: 'خیشومی در un، واکهٔ کامل در une' },
      ],
      practiceFa: 'نخست واژه‌های تک‌هجایی را آهسته گوش کنید؛ سپس همان جمله را با بینیِ آزاد و بدون افزودن n جدا تکرار کنید.',
      practiceText: 'Mon grand frère a un bon pain.',
      practiceMeaningFa: 'برادر بزرگم یک نان خوب دارد.',
    },
    {
      id: 'fr-u-versus-ou',
      title: 'واکهٔ u در برابر ou',
      focusFa: 'برای u لب‌ها گرد می‌شوند و زبان در جلوی دهان می‌ماند؛ در ou زبان به عقب می‌رود.',
      explanationFa: 'u فرانسوی صدایی است میان «ای» و «او»: لب‌ها گرد، زبان جلو. اگر زبان عقب برود، شنونده آن را ou می‌شنود و در واژه‌هایی مثل tu و tout معنی عوض می‌شود. جفت‌ها را پس از گوش‌دادن تکرار کنید.',
      examples: [
        { text: 'tu · tout', meaningFa: 'تو · همه', focusFa: 'u جلویی در برابر ou پسین' },
        { text: 'rue', meaningFa: 'خیابان', focusFa: 'u پس از r' },
        { text: 'vous', meaningFa: 'شما', focusFa: 'ou گرد و پسین' },
        { text: 'lune', meaningFa: 'ماه', focusFa: 'u در تک‌هجا' },
      ],
      practiceFa: 'جفت‌ها را پشت سر هم بشنوید؛ برای u لب را گرد نگه دارید اما زبان را عقب نبرید.',
      practiceText: 'Tu vas tout voir dans la rue.',
      practiceMeaningFa: 'همه‌چیز را در خیابان خواهی دید.',
    },
    {
      id: 'fr-silent-endings-liaison',
      title: 'حروف خاموش پایانی و پیوند (liaison)',
      focusFa: 'بسیاری از حروف پایانی نوشته می‌شوند اما شنیده نمی‌شوند؛ در پیوند برخی دوباره زنده می‌شوند.',
      explanationFa: 'در فرانسوی حروفی مانند e، s، t، d و x در پایان واژه‌ها معمولاً خاموش‌اند. وقتی واژهٔ بعد با واکه آغاز شود، برخی از همین حروف در گفتار پیوسته دوباره شنیده می‌شوند (مثلاً les amis). این پیوند در همهٔ جایگاه‌ها اجباری نیست؛ نمونه را بشنوید و همان را تکرار کنید.',
      examples: [
        { text: 'petit', meaningFa: 'کوچک', focusFa: 't پایانی خاموش' },
        { text: 'les amis', meaningFa: 'دوستان', focusFa: 's در les معمولاً خاموش، در پیوند «ز»' },
        { text: 'vous avez', meaningFa: 'شما دارید', focusFa: 'پیوند با صدای «ز»' },
        { text: 'beaucoup', meaningFa: 'خیلی', focusFa: 'p پایانی خاموش' },
      ],
      practiceFa: 'جمله را یک بار با پیوند و یک بار بدون پیوند گوش دهید؛ تفاوت شنیده‌شدن s را در همان نمونه پیدا کنید.',
      practiceText: 'Les amis ont un petit chat.',
      practiceMeaningFa: 'دوستان یک گربهٔ کوچک دارند.',
    },
    {
      id: 'fr-r-and-rhythm',
      title: 'r و آهنگ جمله',
      focusFa: 'r در عقب دهان ساخته می‌شود و تکیه روی واکهٔ پایانی هر گروه واژه می‌نشیند.',
      explanationFa: 'r فرانسوی در عقب دهان و با لرزش ملایم ساخته می‌شود، نه با نوک زبان. در جمله، تکیه روی آخرین واکهٔ هر گروه واژه می‌نشیند و واکه‌های دیگر کوتاه و یکنواخت می‌مانند. به جریان پیوستهٔ جمله گوش کنید و واژه‌ها را جدا از هم قطع نکنید.',
      examples: [
        { text: 'Paris', meaningFa: 'پاریس', focusFa: 'r عقبی و s پایانی خاموش' },
        { text: 'merci', meaningFa: 'متشکرم', focusFa: 'r پس از e' },
        { text: 'au revoir', meaningFa: 'خداحافظ', focusFa: 'دو گروه کوتاه با تکیهٔ پایانی' },
        { text: 'ordinateur', meaningFa: 'کامپیوتر', focusFa: 'تکیهٔ واژه روی بخش پایانی' },
      ],
      practiceFa: 'جمله را آهسته گوش کنید و همان آهنگ پایانی را در تکرار حفظ کنید؛ تکیهٔ اضافه روی واژه‌های میانی نگذارید.',
      practiceText: 'Merci, au revoir, à demain.',
      practiceMeaningFa: 'متشکرم، خداحافظ، تا فردا.',
    },
  ],
  es: [
    {
      id: 'es-r-versus-rr',
      title: 'r ساده در برابر rr',
      focusFa: 'r یک ضربهٔ کوتاه زبان است و rr چند ضربهٔ پشت‌سرهم؛ جابه‌جایی‌شان معنی را عوض می‌کند.',
      explanationFa: 'در اسپانیایی r میان دو واکه یک ضربهٔ کوتاه است، اما rr و r در آغاز واژه با چند ضربه ساخته می‌شوند. نمونه‌ها را نخست با صدای دستگاه بشنوید و بعد آهسته تکرار کنید. این تمرین نمره‌ای برای تلفظ نمی‌دهد.',
      examples: [
        { text: 'pero · perro', meaningFa: 'اما · سگ', focusFa: 'یک ضربه در برابر چند ضربه' },
        { text: 'caro · carro', meaningFa: 'گران · گاری', focusFa: 'r در برابر rr' },
        { text: 'rosa', meaningFa: 'گل سرخ', focusFa: 'r آغازین چندضربه' },
        { text: 'arroz', meaningFa: 'برنج', focusFa: 'rr میان دو واکه' },
      ],
      practiceFa: 'هر جفت را سه بار پشت سر هم گوش کنید؛ سپس آهسته و بدون فشار دادن زبان تکرار کنید.',
      practiceText: 'El perro come arroz, pero el carro es caro.',
      practiceMeaningFa: 'سگ برنج می‌خورد، اما گاری گران است.',
    },
    {
      id: 'es-c-z-spain',
      title: 'c و z در گونهٔ اسپانیا',
      focusFa: 'در اسپانیای معیار ce/ci و z نزدیک به th انگلیسی در think شنیده می‌شوند و s صدای «س» دارد.',
      explanationFa: 'در بیشتر مناطق اسپانیا ce، ci و z با نوک زبان میان دندان‌ها ادا می‌شوند، اما در آمریکای لاتین و بخشی از اندلس مانند «س» شنیده می‌شوند. هیچ‌کدام غلط نیست؛ این دوره گونهٔ اسپانیا را نمونه می‌گیرد. به تفاوت gracias و casa گوش کنید.',
      examples: [
        { text: 'gracias', meaningFa: 'متشکرم', focusFa: 'ci نزدیک به th در think' },
        { text: 'cena', meaningFa: 'شام', focusFa: 'ce در آغاز واژه' },
        { text: 'zapato', meaningFa: 'کفش', focusFa: 'z نزدیک به th' },
        { text: 'casa', meaningFa: 'خانه', focusFa: 'ca صدای «ک» دارد، نه th' },
      ],
      practiceFa: 'سه واژهٔ gracias و cena و zapato را آهسته گوش کنید؛ سپس casa را برای مقایسه بشنوید.',
      practiceText: 'Gracias por la cena y los zapatos.',
      practiceMeaningFa: 'متشکرم برای شام و کفش‌ها.',
    },
    {
      id: 'es-j-g-b-v',
      title: 'j و g نرم، و b/v',
      focusFa: 'j و g پیش از e/i صدای خشن عقب دهان دارند و b و v در اسپانیایی یک صدا هستند.',
      explanationFa: 'حرف j و همچنین g پیش از e یا i صدایی خشن در عقب دهان می‌سازند (نزدیک به «خ»). حرف‌های b و v یک واج‌اند و تفاوتشان شنیده نمی‌شود. میان دو واکه، b و v و d نرم و کشیده ادا می‌شوند. نمونه‌ها را بشنوید و همان شکل پیوسته را تکرار کنید.',
      examples: [
        { text: 'trabajo', meaningFa: 'کار', focusFa: 'j در پایان واژه' },
        { text: 'gente', meaningFa: 'مردم', focusFa: 'g پیش از e' },
        { text: 'vivir · beber', meaningFa: 'زندگی کردن · نوشیدن', focusFa: 'b و v یک صدا' },
        { text: 'nada', meaningFa: 'هیچ‌چیز', focusFa: 'd میان دو واکه نرم' },
      ],
      practiceFa: 'واژه‌ها را آهسته گوش کنید؛ سپس جمله را یک‌تکه و بدون قطع کردن میان واکه‌ها تکرار کنید.',
      practiceText: 'La gente trabaja para vivir y beber agua.',
      practiceMeaningFa: 'مردم برای زندگی کردن و نوشیدن آب کار می‌کنند.',
    },
    {
      id: 'es-open-vowels-stress',
      title: 'پنج واکهٔ روشن و جای تکیه',
      focusFa: 'واکه‌ها کوتاه و روشن‌اند و محو نمی‌شوند؛ علامت ´ جای تکیه را مشخص می‌کند.',
      explanationFa: 'اسپانیایی پنج واکهٔ ساده دارد و هر واکه روشن ادا می‌شود، حتی وقتی تکیه ندارد. اگر واژه علامت ´ داشته باشد تکیه روی همان بخش است؛ واژهٔ بدون علامت که به واکه یا n یا s پایان یابد، تکیه را روی بخش یکی‌مانده از آخر می‌گیرد. آهنگ پرسش هم در نمونه شنیدنی است.',
      examples: [
        { text: 'casa', meaningFa: 'خانه', focusFa: 'تکیه روی بخش نخست' },
        { text: 'café', meaningFa: 'قهوه', focusFa: 'علامت تکیه روی é' },
        { text: 'teléfono', meaningFa: 'تلفن', focusFa: 'تکیه روی بخش دوم' },
        { text: '¿Cómo estás?', meaningFa: 'چطوری؟', focusFa: 'آهنگ پرسشی روشن' },
      ],
      practiceFa: 'واژه‌های تک‌تکیه را گوش کنید و همان جای تکیه را در تکرار نگه دارید؛ واکه‌های بی‌تکیه را کوتاه نکنید.',
      practiceText: 'Mi teléfono está en casa, ¿cómo estás?',
      practiceMeaningFa: 'تلفنم در خانه است، چطوری؟',
    },
  ],
};

/** Units for one language; an unknown or content-less language returns an empty list. */
export function pronunciationUnits(language: string | undefined): readonly PronunciationUnit[] {
  if (!language) return [];
  return PRONUNCIATION_UNITS[language as PronunciationLanguage] ?? [];
}

/** Languages that currently ship a workshop, derived from the content itself. */
export const PRONUNCIATION_LANGUAGES: readonly PronunciationLanguage[] =
  LANGUAGE_IDS.filter(language => pronunciationUnits(language).length > 0);

/** Backwards-compatible view of the same content. */
export const PRONUNCIATION_COURSES: Readonly<Partial<Record<PronunciationLanguage, readonly PronunciationUnit[]>>> = PRONUNCIATION_UNITS;

export function isPronunciationLanguage(value: string | undefined): value is PronunciationLanguage {
  return pronunciationUnits(value).length > 0;
}
