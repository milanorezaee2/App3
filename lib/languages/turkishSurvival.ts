import type { LearningLesson, LearningSentence } from './types';

/*
 * دورهٔ ترکی استانبولی — سطح Survival (کاربرد روزمره).
 * موقعیت‌های واقعی سفر و زندگی روزمره در ترکیه؛ همان قالب جمله‌محور سطح Foundation.
 */

const sentence = (
  id: string,
  text: string,
  fa: string,
  pronunciation: string,
  word: string,
  meaning: string,
  pattern?: string,
): LearningSentence => ({ id, text, fa, pronunciation, ...(pattern ? { pattern } : {}), vocabulary: [{ word, meaning }] });

const lesson = (
  id: string,
  title: string,
  situation: string,
  sentences: LearningSentence[],
  dialogue: LearningLesson['dialogue'],
  checks: NonNullable<LearningLesson['checks']>,
  teachingFa?: string,
): LearningLesson => ({ id, title, situation, durationMinutes: 8, sentences, dialogue, checks, ...(teachingFa ? { teachingFa } : {}) });

export const TURKISH_SURVIVAL_LESSONS: readonly LearningLesson[] = [
  /* ---------- درس ۱ ---------- */
  lesson(
    'tr-l2-cafe',
    'کافه و رستوران',
    'می‌خواهید در کافه منو ببینید، سفارش بدهید و صورت‌حساب بگیرید.',
    [
      sentence('tr2-01', 'Menüyü görebilir miyim?', 'می‌توانم منو را ببینم؟', 'مِنیویو گُره‌بیلیر می‌ییم', 'menü', 'منو'),
      sentence('tr2-02', 'Bir çay ve bir kahve, lütfen.', 'یک چای و یک قهوه، لطفاً.', 'بیر چای وِ بیر کاهوِه', 've', 'و'),
      sentence('tr2-03', 'Hesap, lütfen.', 'صورت‌حساب، لطفاً.', 'حِساپ، لوتفِن', 'hesap', 'صورت‌حساب'),
      sentence('tr2-04', 'Afiyet olsun!', 'نوش جان!', 'آفی‌یِت اولسون', 'afiyet olsun', 'نوش جان'),
      sentence('tr2-05', 'Çok lezzetli!', 'خیلی خوشمزه است!', 'چوک لِززِتلی', 'lezzetli', 'خوشمزه'),
      sentence('tr2-06', 'Kartla ödeyebilir miyim?', 'می‌توانم با کارت پرداخت کنم؟', 'کارتلا اُدِیه‌بیلیر می‌ییم', 'ödemek', 'پرداختن'),
      sentence('tr2-07', 'Şekersiz, lütfen.', 'بی‌شکر، لطفاً.', 'شِکِرسیر، لوتفِن', 'şekersiz', 'بی‌شکر'),
    ],
    [
      { speaker: 'مریم', text: 'Menüyü görebilir miyim?', fa: 'می‌توانم منو را ببینم؟' },
      { speaker: 'گارسون', text: 'Tabii, buyurun.', fa: 'البته، بفرمایید.' },
      { speaker: 'مریم', text: 'Bir çay ve bir tost, lütfen.', fa: 'یک چای و یک تست، لطفاً.' },
      { speaker: 'گارسون', text: 'Afiyet olsun!', fa: 'نوش جان!' },
    ],
    [
      { promptFa: 'برای گرفتن صورت‌حساب چه می‌گویید؟', choices: ['Hesap, lütfen.', 'Menü, lütfen.', 'Su, lütfen.'], correctIndex: 0, explanationFa: 'hesap یعنی صورت‌حساب.' },
      { promptFa: 'گارسون پس از آوردن غذا چه می‌گوید؟', choices: ['Afiyet olsun!', 'Hoşça kal!', 'Ne kadar?'], correctIndex: 0, explanationFa: 'Afiyet olsun یعنی «نوش جان».' },
    ],
    'در ترکی مفعول معرفه پسوند -ı/-i/-u/-ü می‌گیرد: menü → menüyü (منو را). جملهٔ پرسشی توانایی با -ebilir/-abilir ساخته می‌شود: ödeyebilir miyim? (می‌توانم پرداخت کنم؟). واژهٔ «ve» یعنی «و» و میان دو اسم می‌آید.',
  ),

  /* ---------- درس ۲ ---------- */
  lesson(
    'tr-l2-shopping',
    'خرید کردن',
    'می‌خواهید قیمت بپرسید، چانه بزنید و با کارت پرداخت کنید.',
    [
      sentence('tr2-08', 'Bu ne kadar?', 'این چقدر است؟', 'بو نِه کادار', 'ne kadar', 'چقدر'),
      sentence('tr2-09', 'Çok pahalı.', 'خیلی گران است.', 'چوک پاهالی', 'pahalı', 'گران'),
      sentence('tr2-10', 'Daha ucuzu var mı?', 'ارزان‌ترش هم هست؟', 'داها اوجوزو وار می', 'ucuz', 'ارزان'),
      sentence('tr2-11', 'Bunu alıyorum.', 'این را می‌خرم.', 'بونو آلی‌یوروم', 'almak', 'خریدن'),
      sentence('tr2-12', 'Kartla ödeyebilir miyim?', 'می‌توانم با کارت پرداخت کنم؟', 'کارتلا اُدِیه‌بیلیر می‌ییم', 'kart', 'کارت'),
      sentence('tr2-13', 'Poşet ister misiniz?', 'کیسه می‌خواهید؟', 'پُشِت ایستِر میسینیز', 'poşet', 'کیسه'),
      sentence('tr2-14', 'İndirim var mı?', 'تخفیف دارید؟', 'ایندیریم وار می', 'indirim', 'تخفیف'),
    ],
    [
      { speaker: 'مریم', text: 'Bu gömlek ne kadar?', fa: 'این پیراهن چقدر است؟' },
      { speaker: 'فروشنده', text: 'Üç yüz lira.', fa: 'سیصد لیر.' },
      { speaker: 'مریم', text: 'Çok pahalı. Daha ucuzu var mı?', fa: 'خیلی گران است. ارزان‌ترش هم هست؟' },
      { speaker: 'فروشنده', text: 'İki yüz elli lira olur.', fa: 'دویست و پنجاه لیر می‌شود.' },
    ],
    [
      { promptFa: '«خیلی گران است» کدام است؟', choices: ['Çok pahalı.', 'Çok ucuz.', 'Çok güzel.'], correctIndex: 0, explanationFa: 'pahalı یعنی گران؛ ucuz یعنی ارزان.' },
      { promptFa: '«این را می‌خرم» کدام جمله است؟', choices: ['Bunu alıyorum.', 'Bunu istemiyorum.', 'Bu nerede?'], correctIndex: 0, explanationFa: 'bunu = این را، alıyorum = می‌خرم.' },
    ],
    'در خرید، «Bu ne kadar?» کوتاه و رایج است. ضمیر اشاره با پسوند مفعول تغییر می‌کند: bu → bunu (این را)، şu → şunu، o → onu. برای مقایسه، «daha» پیش از صفت می‌آید: daha ucuz (ارزان‌تر)، daha büyük (بزرگ‌تر).',
  ),

  /* ---------- درس ۳ ---------- */
  lesson(
    'tr-l2-directions',
    'مسیر، تاکسی و فرودگاه',
    'می‌خواهید مقصد را به راننده بگویید و جهت‌ها را بفهمید.',
    [
      sentence('tr2-15', 'Otelim nerede?', 'هتلم کجاست؟', 'اوتِلیم نِرِده', 'otel', 'هتل'),
      sentence('tr2-16', 'Havalimanına gitmek istiyorum.', 'می‌خواهم به فرودگاه بروم.', 'هاوالیمانینا گیت‌مِک ایستی‌یوروم', 'havalimanı', 'فرودگاه'),
      sentence('tr2-17', 'Sağa dönün.', 'به راست بپیچید.', 'ساا دُنون', 'dönmek', 'پیچیدن'),
      sentence('tr2-18', 'Sola dönün.', 'به چپ بپیچید.', 'سولا دُنون', 'sol', 'چپ'),
      sentence('tr2-19', 'Düz gidin.', 'مستقیم بروید.', 'دوز گیدین', 'düz', 'مستقیم'),
      sentence('tr2-20', 'Burada durun.', 'همین‌جا بایستید.', 'بورادا دورون', 'durmak', 'ایستادن'),
      sentence('tr2-21', 'Ne kadar sürer?', 'چقدر طول می‌کشد؟', 'نِه کادار سورِر', 'sürmek', 'طول کشیدن'),
      sentence('tr2-22', 'Ne kadar tutar?', 'چقدر هزینه دارد؟', 'نِه کادار توتار', 'tutmak', 'هزینه داشتن'),
    ],
    [
      { speaker: 'مریم', text: 'Havalimanına gitmek istiyorum.', fa: 'می‌خواهم به فرودگاه بروم.' },
      { speaker: 'راننده', text: 'Tamam. Oteliniz nerede?', fa: 'باشه. هتل شما کجاست؟' },
      { speaker: 'مریم', text: 'Merkezde. Ne kadar sürer?', fa: 'در مرکز شهر. چقدر طول می‌کشد؟' },
      { speaker: 'راننده', text: 'Yaklaşık otuz dakika.', fa: 'حدود سی دقیقه.' },
    ],
    [
      { promptFa: '«به راست بپیچید» کدام است؟', choices: ['Sağa dönün.', 'Sola dönün.', 'Düz gidin.'], correctIndex: 0, explanationFa: 'sağ = راست و dönmek = پیچیدن.' },
      { promptFa: '«چقدر طول می‌کشد؟» کدام است؟', choices: ['Ne kadar sürer?', 'Ne kadar tutar?', 'Nerede?'], correctIndex: 0, explanationFa: 'sürmek برای مدت زمان و tutmak برای هزینه است.' },
    ],
    'پسوند -a/-e معنای «به» می‌دهد: havalimanına = به فرودگاه، otele = به هتل. برای گفتن مقصد با تاکسی، «… gitmek istiyorum» کافی است. فعل‌های «sürer» (طول می‌کشد) و «tutar» (هزینه می‌شود) را با هم اشتباه نگیرید.',
  ),

  /* ---------- درس ۴ ---------- */
  lesson(
    'tr-l2-time-days',
    'ساعت و روزهای هفته',
    'می‌خواهید ساعت و روز را بپرسید و قرار کوتاهی بگذارید.',
    [
      sentence('tr2-23', 'Saat kaç?', 'ساعت چند است؟', 'ساآت کاچ', 'saat', 'ساعت'),
      sentence('tr2-24', 'Saat üç.', 'ساعت سه است.', 'ساآت اوچ', 'üç', 'سه'),
      sentence('tr2-25', 'Bugün günlerden ne?', 'امروز چه روزی است؟', 'بوگون گونلِردِن نِه', 'bugün', 'امروز'),
      sentence('tr2-26', 'Bugün pazartesi.', 'امروز دوشنبه است.', 'بوگون پازارتِسی', 'pazartesi', 'دوشنبه'),
      sentence('tr2-27', 'Yarın görüşürüz.', 'فردا می‌بینیمتان.', 'یارین گوروشوروز', 'yarın', 'فردا'),
      sentence('tr2-28', 'Dün çok yorgundum.', 'دیروز خیلی خسته بودم.', 'دون چوک یورگوندوم', 'dün', 'دیروز'),
      sentence('tr2-29', 'Saat kaçta buluşalım?', 'ساعت چند قرار بگذاریم؟', 'ساآت کاچتا بولوشالیم', 'buluşmak', 'دیدار کردن'),
      sentence('tr2-30', 'Saat yedide.', 'ساعت هفت.', 'ساآت یِدیدِه', 'yedi', 'هفت'),
    ],
    [
      { speaker: 'امیر', text: 'Bugün günlerden ne?', fa: 'امروز چه روزی است؟' },
      { speaker: 'مریم', text: 'Bugün çarşamba.', fa: 'امروز چهارشنبه است.' },
      { speaker: 'امیر', text: 'Yarın saat kaçta buluşalım?', fa: 'فردا ساعت چند قرار بگذاریم؟' },
      { speaker: 'مریم', text: 'Saat altıda, kafede.', fa: 'ساعت شش، در کافه.' },
    ],
    [
      { promptFa: '«ساعت چند است؟» کدام است؟', choices: ['Saat kaç?', 'Ne kadar?', 'Bugün ne?'], correctIndex: 0, explanationFa: 'Saat kaç? یعنی ساعت چند است.' },
      { promptFa: '«دیروز» کدام کلمه است؟', choices: ['Dün', 'Bugün', 'Yarın'], correctIndex: 0, explanationFa: 'dün = دیروز، bugün = امروز، yarın = فردا.' },
    ],
    'روزهای هفته: pazartesi (دوشنبه)، salı (سه‌شنبه)، çarşamba (چهارشنبه)، perşembe (پنجشنبه)، cuma (جمعه)، cumartesi (شنبه)، pazar (یکشنبه). برای ساعتِ قرار، پسوند -da/-de به عدد می‌چسبد: yedide = ساعت هفت.',
  ),

  /* ---------- درس ۵ ---------- */
  lesson(
    'tr-l2-hotel',
    'هتل و اتاق',
    'می‌خواهید اتاق رزرو کنید، کلید بگیرید و مشکل اتاق را بگویید.',
    [
      sentence('tr2-31', 'Rezervasyonum var.', 'رزرو دارم.', 'رِزِرواسیونوم وار', 'rezervasyon', 'رزرو'),
      sentence('tr2-32', 'Boş oda var mı?', 'اتاق خالی دارید؟', 'بوش اودا وار می', 'boş', 'خالی'),
      sentence('tr2-33', 'Bir gece kalacağım.', 'یک شب می‌مانم.', 'بیر گِجه کالاجاغیم', 'gece', 'شب'),
      sentence('tr2-34', 'Kahvaltı dahil mi?', 'صبحانه شامل است؟', 'کاهوالتِی داهیل می', 'kahvaltı', 'صبحانه'),
      sentence('tr2-35', 'Anahtar, lütfen.', 'کلید، لطفاً.', 'آناهتار، لوتفِن', 'anahtar', 'کلید'),
      sentence('tr2-36', 'İnternet şifresi ne?', 'رمز اینترنت چیست؟', 'اینتِرنِت شیفرِسی نِه', 'şifre', 'رمز'),
      sentence('tr2-37', 'Odam çok sıcak.', 'اتاقم خیلی گرم است.', 'اودام چوک سیجاک', 'sıcak', 'گرم'),
      sentence('tr2-38', 'Çıkış saati kaç?', 'ساعت خروج چند است؟', 'چیکیش ساآتی کاچ', 'çıkış', 'خروج'),
    ],
    [
      { speaker: 'مریم', text: 'Rezervasyonum var. Adım Ayşe.', fa: 'رزرو دارم. اسمم عایشه است.' },
      { speaker: 'پذیرش', text: 'Hoş geldiniz. Kahvaltı dahil mi?', fa: 'خوش آمدید. صبحانه شامل است؟' },
      { speaker: 'مریم', text: 'Evet, dahil. Anahtarı alabilir miyim?', fa: 'بله، شامل است. می‌توانم کلید را بگیرم؟' },
      { speaker: 'پذیرش', text: 'Tabii, buyurun.', fa: 'البته، بفرمایید.' },
    ],
    [
      { promptFa: 'برای پرسیدن «اتاق خالی دارید؟» چه می‌گویید؟', choices: ['Boş oda var mı?', 'Oda nerede?', 'Oda ne kadar?'], correctIndex: 0, explanationFa: 'boş یعنی خالی؛ var mı یعنی آیا هست؟' },
      { promptFa: '«صبحانه شامل است؟» کدام است؟', choices: ['Kahvaltı dahil mi?', 'Kahvaltı nerede?', 'Kahvaltı istiyorum.'], correctIndex: 0, explanationFa: 'dahil یعنی شامل.' },
    ],
    'پسوند -ım/-im مالکیت اول‌شخص را می‌سازد: rezervasyonum = رزرو من. جملهٔ پرسشی «var mı?» یعنی «آیا هست؟». آیندهٔ نزدیک با -acağım/-eceğim ساخته می‌شود: kalacağım = خواهم ماند. «Çıkış saati» یعنی ساعت خروج.',
  ),

  /* ---------- درس ۶ ---------- */
  lesson(
    'tr-l2-food-order',
    'سفارش غذا',
    'می‌خواهید غذا سفارش دهید و دربارهٔ مواد، تندی و رژیم غذایی بپرسید.',
    [
      sentence('tr2-39', 'Bir porsiyon tavuk, lütfen.', 'یک پرس مرغ، لطفاً.', 'بیر پورسیون تاووک', 'porsiyon', 'پرس'),
      sentence('tr2-40', 'Etli mi?', 'گوشت دارد؟', 'اِتلی می', 'et', 'گوشت'),
      sentence('tr2-41', 'Acı mı?', 'تند است؟', 'آجی می', 'acı', 'تند'),
      sentence('tr2-42', 'Acı değil, lütfen.', 'تند نباشد، لطفاً.', 'آجی دِییل', 'değil', 'نیست'),
      sentence('tr2-43', 'Tuz ve ekmek, lütfen.', 'نمک و نان، لطفاً.', 'توز و اِکمِک', 'ekmek', 'نان'),
      sentence('tr2-44', 'Vejetaryen yemek var mı?', 'غذای گیاهی دارید؟', 'وِجِتاریِن یِمِک وار می', 'yemek', 'غذا'),
      sentence('tr2-45', 'Su, lütfen.', 'آب، لطفاً.', 'سو، لوتفِن', 'su', 'آب'),
      sentence('tr2-46', 'Hesabı alabilir miyim?', 'می‌توانم صورت‌حساب بگیرم؟', 'حِسابی آلابیلیر می‌ییم', 'almak', 'گرفتن'),
    ],
    [
      { speaker: 'مریم', text: 'Bir porsiyon tavuk, lütfen. Acı mı?', fa: 'یک پرس مرغ، لطفاً. تند است؟' },
      { speaker: 'گارسون', text: 'Biraz acı. Acı istemiyor musunuz?', fa: 'کمی تند است. تند نمی‌خواهید؟' },
      { speaker: 'مریم', text: 'Hayır, acı değil lütfen.', fa: 'نه، لطفاً تند نباشد.' },
      { speaker: 'گارسون', text: 'Tamam, afiyet olsun!', fa: 'باشه، نوش جان!' },
    ],
    [
      { promptFa: '«تند است؟» کدام است؟', choices: ['Acı mı?', 'Etli mi?', 'Sıcak mı?'], correctIndex: 0, explanationFa: 'acı یعنی تند.' },
      { promptFa: '«غذای گیاهی دارید؟» کدام است؟', choices: ['Vejetaryen yemek var mı?', 'Yemek nerede?', 'Tuz var mı?'], correctIndex: 0, explanationFa: 'vejetaryen = گیاه‌خوار، yemek = غذا.' },
    ],
    'صفت‌ساز -lı/-li معنای «دارای» می‌دهد: etli = گوشت‌دار، sütlü = شیردار. منفی «değil» پس از اسم یا صفت می‌آید: acı değil = تند نیست. برای سفارش، «Bir porsiyon … lütfen» ساختار ثابت و مؤدبانه‌ای است.',
  ),

  /* ---------- درس ۷ ---------- */
  lesson(
    'tr-l2-emergency',
    'کمک و سلامت',
    'می‌خواهید در وضعیت بیماری یا مشکل، کمک بخواهید و علائم را بگویید.',
    [
      sentence('tr2-47', 'İmdat!', 'کمک! (فوری)', 'ایمدات', 'imdat', 'کمک فوری'),
      sentence('tr2-48', 'Yardım edin, lütfen.', 'لطفاً کمک کنید.', 'یاردیم اِدین، لوتفِن', 'yardım etmek', 'کمک کردن'),
      sentence('tr2-49', 'Hastayım.', 'مریضم.', 'هاستاییم', 'hasta', 'بیمار'),
      sentence('tr2-50', 'Başım ağrıyor.', 'سرم درد می‌کند.', 'باشیم آغری‌یور', 'ağrımak', 'درد کردن'),
      sentence('tr2-51', 'Eczane nerede?', 'داروخانه کجاست؟', 'اِجزانه نِرِده', 'eczane', 'داروخانه'),
      sentence('tr2-52', 'Doktora gitmem lazım.', 'باید به دکتر بروم.', 'دوکتورا گیت‌مِم لازم', 'doktor', 'دکتر'),
      sentence('tr2-53', 'Alerjim var.', 'حساسیت دارم.', 'آلِرجیم وار', 'alerji', 'حساسیت'),
      sentence('tr2-54', 'Kendimi iyi hissetmiyorum.', 'حالم خوب نیست.', 'کِندیمی ای‌یی هیسِتمی‌یوروم', 'hissetmek', 'احساس کردن'),
    ],
    [
      { speaker: 'مریم', text: 'Affedersiniz, eczane nerede?', fa: 'ببخشید، داروخانه کجاست؟' },
      { speaker: 'رهگذر', text: 'Sağda, çok yakın.', fa: 'سمت راست، خیلی نزدیک.' },
      { speaker: 'مریم', text: 'Teşekkürler. Başım ağrıyor.', fa: 'ممنون. سرم درد می‌کند.' },
      { speaker: 'داروساز', text: 'Bu ilacı günde iki kez alın.', fa: 'این دارو را روزی دو بار مصرف کنید.' },
    ],
    [
      { promptFa: '«مریضم» کدام است؟', choices: ['Hastayım.', 'İyiyim.', 'Yorgunum.'], correctIndex: 0, explanationFa: 'hasta یعنی بیمار؛ hastayım یعنی مریضم.' },
      { promptFa: '«داروخانه کجاست؟» کدام است؟', choices: ['Eczane nerede?', 'Doktor nerede?', 'İlaç ne kadar?'], correctIndex: 0, explanationFa: 'eczane = داروخانه.' },
    ],
    'درد اعضای بدن با «… ağrıyor» گفته می‌شود: başım ağrıyor (سرم درد می‌کند)، karnım ağrıyor (شکمم درد می‌کند). «lazım» یعنی لازم است و فعل پیش از آن مصدر با -a/-e می‌آید: gitmem lazım (باید بروم). برای کمک فوری «İmdat!» و برای درخواست مؤدبانه «Yardım edin, lütfen» به کار می‌رود.',
  ),

  /* ---------- درس ۸ ---------- */
  lesson(
    'tr-l2-social',
    'آشنایی، دعوت و قرار',
    'می‌خواهید با کسی آشنا شوید، او را به قهوه دعوت کنید و قرار بگذارید.',
    [
      sentence('tr2-55', 'Nereden geliyorsunuz?', 'از کجا می‌آیید؟', 'نِرِدِن گِلی‌یورسونوز', 'gelmek', 'آمدن'),
      sentence('tr2-56', 'Türkiye\'ye hoş geldiniz!', 'به ترکیه خوش آمدید!', 'تورکی‌یِه هوش گِلدینیز', 'hoş geldiniz', 'خوش آمدید'),
      sentence('tr2-57', 'Türkçeniz çok iyi.', 'ترکی شما خیلی خوب است.', 'تورکچِنیز چوک ای‌یی', 'Türkçe', 'ترکی'),
      sentence('tr2-58', 'Kahve içmek ister misiniz?', 'میل دارید قهوه بنوشید؟', 'کاهوِه ایچ‌مِک ایستِر میسینیز', 'içmek', 'نوشیدن'),
      sentence('tr2-59', 'Çok memnun oldum.', 'خیلی خوشحال شدم.', 'چوک ممنون اولدوم', 'memnun', 'خوشحال'),
      sentence('tr2-60', 'Yarın buluşalım.', 'فردا قرار بگذاریم.', 'یارین بولوشالیم', 'buluşmak', 'دیدار کردن'),
      sentence('tr2-61', 'Saat kaçta?', 'ساعت چند؟', 'ساآت کاچتا', 'saat', 'ساعت'),
      sentence('tr2-62', 'Saat yedide.', 'ساعت هفت.', 'ساآت یِدیدِه', 'yedi', 'هفت'),
    ],
    [
      { speaker: 'امیر', text: 'Nereden geliyorsunuz?', fa: 'از کجا می‌آیید؟' },
      { speaker: 'مریم', text: 'İran\'dan geliyorum. Ben Tahranlıyım.', fa: 'از ایران می‌آیم. من اهل تهرانم.' },
      { speaker: 'امیر', text: 'Türkiye\'ye hoş geldiniz! Kahve içmek ister misiniz?', fa: 'به ترکیه خوش آمدید! میل دارید قهوه بنوشید؟' },
      { speaker: 'مریم', text: 'Çok memnun oldum. Yarın buluşalım!', fa: 'خیلی خوشحال شدم. فردا قرار بگذاریم!' },
    ],
    [
      { promptFa: '«به ترکیه خوش آمدید» کدام است؟', choices: ['Türkiye\'ye hoş geldiniz!', 'Türkiye nerede?', 'Türkçe biliyorum.'], correctIndex: 0, explanationFa: 'hoş geldiniz یعنی خوش آمدید.' },
      { promptFa: '«فردا قرار بگذاریم» کدام است؟', choices: ['Yarın buluşalım.', 'Yarın görüşürüz.', 'Yarın gidiyorum.'], correctIndex: 0, explanationFa: 'buluşalım یعنی قرار بگذاریم.' },
    ],
    'ترکی پیشنهاد جمعی با -alım/-elim ساخته می‌شود: buluşalım (قرار بگذاریم)، gidelim (برویم). برای دعوت مؤدبانه «… ister misiniz?» (میل دارید؟) بسیار رایج است. نام کشور با پسوند -lı/-li با «اهل کجا بودن» می‌آید: Tahranlıyım (اهل تهرانم).',
  ),
];
