export type PronunciationLanguage = 'en' | 'ru';

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
export const PRONUNCIATION_COURSES: Record<PronunciationLanguage, readonly PronunciationUnit[]> = {
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
      id: 'ru-vowels-i-y',
      title: 'واکه‌های и و ы',
      focusFa: 'и جلوتر و روشن‌تر است؛ ы عقب‌تر و کشیده‌تر شنیده می‌شود.',
      explanationFa: 'در и زبان بالا و جلو می‌رود و صدا روشن است؛ در ы زبان کمی عقب‌تر می‌آید و تفاوت آن با и را باید از نمونهٔ شنیداری بشنوید، نه از نوشتار فارسی. پس از همخوان سخت معمولاً ы می‌آید.',
      examples: [
        { text: 'мир', meaningFa: 'صلح؛ جهان', focusFa: 'и روشن و جلو' },
        { text: 'сыр', meaningFa: 'پنیر', focusFa: 'ы عقب‌تر' },
        { text: 'бить', meaningFa: 'زدن', focusFa: 'и پس از ب نرم' },
        { text: 'быть', meaningFa: 'بودن', focusFa: 'ы پس از ب سخت' },
      ],
      practiceFa: 'جفت‌ها را با صدای نمونه گوش کنید و سپس هر واژه را جدا و آهسته تکرار کنید.',
      practiceText: 'Мы были в мире.',
      practiceMeaningFa: 'ما در صلح بودیم.',
    },
    {
      id: 'ru-hard-soft-consonants',
      title: 'همخوان نرم با ь و واکه‌های نرم',
      focusFa: 'ь صدا ندارد؛ فقط همخوان پیش از خود را نرم می‌کند.',
      explanationFa: 'در روسی، ь و حروف یوتوتر (я، е، ё، ю، и) همخوان پیش از خود را نرم می‌کنند. نرم‌شدن یعنی بالا آمدن بخش میانی زبان؛ به پایان واژه‌ها گوش دهید تا تفاوت را بشنوید.',
      examples: [
        { text: 'моль', meaningFa: 'شاپرک', focusFa: 'л پایان واژه نرم است' },
        { text: 'мол', meaningFa: 'سدّ؛ موج‌شکن', focusFa: 'л پایان واژه سخت است' },
        { text: 'нос', meaningFa: 'بینی', focusFa: 'ن سخت' },
        { text: 'нёс', meaningFa: 'حمل کرد', focusFa: 'ن نرم' },
      ],
      practiceFa: 'پایان واژهٔ هر جفت را با دقت بشنوید؛ سپس فقط جفت دوم را با زبان کمی بالاتر تکرار کنید.',
      practiceText: 'Он нёс небольшой нос.',
      practiceMeaningFa: 'او یک بینی کوچک حمل می‌کرد.',
    },
    {
      id: 'ru-sibilants',
      title: 'همخوان‌های ш، щ و ж',
      focusFa: 'ш سخت و کوتاه است؛ щ کشیده و نرم‌تر؛ ж صدای وزوزی سخت دارد.',
      explanationFa: 'این سه همخوان فارسی‌زبان را گمراه می‌کنند، چون همه به «ش» و «ژ» نزدیک شنیده می‌شوند. щ کشیده‌تر و نرم‌تر است و ж با ارتعاش تارهای صوتی ادا می‌شود. برای دقت، طول صدا و حالت لب را از نمونه بگیرید.',
      examples: [
        { text: 'шум', meaningFa: 'سر و صدا', focusFa: 'ш کوتاه و سخت' },
        { text: 'щи', meaningFa: 'سوپ کلم', focusFa: 'щ کشیده و نرم' },
        { text: 'жук', meaningFa: 'سوسک', focusFa: 'ж وزوزی' },
      ],
      practiceFa: 'سه واژه را پشت سر هم بشنوید تا طول و ارتعاش هر صدا را تشخیص دهید؛ سپس هر سه را آرام تکرار کنید.',
      practiceText: 'В комнате шум, а на столе щи.',
      practiceMeaningFa: 'در اتاق سر و صداست و روی میز سوپ کلم است.',
    },
    {
      id: 'ru-voiced-devoicing',
      title: 'همخوان‌های بی‌واک در پایان واژه',
      focusFa: 'در پایان واژه، همخوان واک‌دار بی‌واک می‌شود؛ дуб مثل дуп شنیده می‌شود.',
      explanationFa: 'در روسی، همخوان واک‌دار در پایان واژه یا پیش از همخوان بی‌واک، بی‌واک ادا می‌شود. به همین دلیل نوشتار و شنیدن یکسان نیست. برای تمرین، جفت‌های ب/پ، د/ت و ز/س را در پایان واژه مقایسه کنید.',
      examples: [
        { text: 'дуб', meaningFa: 'بلوط', focusFa: 'ب پایانی مثل پ شنیده می‌شود' },
        { text: 'друг', meaningFa: 'دوست', focusFa: 'г پایانی مثل ک شنیده می‌شود' },
        { text: 'город', meaningFa: 'شهر', focusFa: 'د پایانی مثل ت شنیده می‌شود' },
      ],
      practiceFa: 'نوشتار و صدا را با هم مقایسه کنید؛ سپس جملهٔ نمونه را با همان پایان بی‌واک تکرار کنید.',
      practiceText: 'Мой друг живёт в большом городе.',
      practiceMeaningFa: 'دوست من در شهر بزرگی زندگی می‌کند.',
    },
    {
      id: 'ru-unstressed-o',
      title: 'اکانье: o بی‌تکیه در گفتار',
      focusFa: 'o بی‌تکیه معمولاً به آ نزدیک می‌شود؛ نوشتار تغییر نمی‌کند.',
      explanationFa: 'در روسی معیار، o بی‌تکیه پیش از تکیه و در هجای آغازین به آ نزدیک می‌شود؛ این پدیده را اکانье می‌نامند. نوشتار همیشه با o می‌ماند، بنابراین باید شکل شنیداری را از نمونه گرفت، نه از حروف.',
      examples: [
        { text: 'окно', meaningFa: 'پنجره', focusFa: 'o آغازین به آ نزدیک' },
        { text: 'молоко', meaningFa: 'شیر', focusFa: 'دو o بی‌تکیه' },
        { text: 'хорошо', meaningFa: 'خوب', focusFa: 'o نخستین کم‌رنگ' },
      ],
      practiceFa: 'واژه‌ها را با صدای نمونه بشنوید و سپس همان تلفظ را تکرار کنید؛ در نوشتار o را حفظ کنید.',
      practiceText: 'Окно открыто, а молоко на столе.',
      practiceMeaningFa: 'پنجره باز است و شیر روی میز است.',
    },
    {
      id: 'ru-sentence-intonation',
      title: 'آهنگ پرسش و جملهٔ خبری',
      focusFa: 'پرسش بدون واژهٔ پرسشی اغلب با آهنگ رو به بالا و برجسته‌شدن واژهٔ پرسیده‌شده شناخته می‌شود.',
      explanationFa: 'در روسی جای تکیهٔ آهنگ می‌تواند معنی پرسشی جمله را تعیین کند. جملهٔ خبری با آهنگ آرام رو به پایین و پرسش بله/خیر با اوج آهنگ روی واژهٔ پرسیده‌شده ادا می‌شود. نمونه‌ها را یک‌جا گوش کنید تا تفاوت را بگیرید.',
      examples: [
        { text: 'Ты идёшь домой.', meaningFa: 'تو به خانه می‌روی.', focusFa: 'خبری؛ آهنگ رو به پایین' },
        { text: 'Ты идёшь домой?', meaningFa: 'تو به خانه می‌روی؟', focusFa: 'پرسشی؛ اوج روی идёшь' },
        { text: 'Ты идёшь домой?', meaningFa: 'تو به خانه می‌روی؟ (با تأکید بر تو)', focusFa: 'جابه‌جایی اوج آهنگ، معنی تأکید را عوض می‌کند' },
      ],
      practiceFa: 'هر دو جمله را پشت سر هم گوش کنید؛ سپس جملهٔ پرسشی را با همان اوج آهنگ و جملهٔ خبری را آرام‌تر تکرار کنید.',
      practiceText: 'Ты идёшь домой? Да, я иду домой.',
      practiceMeaningFa: 'به خانه می‌روی؟ بله، به خانه می‌روم.',
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
};

export function isPronunciationLanguage(value: string | undefined): value is PronunciationLanguage {
  return value === 'en' || value === 'ru';
}
