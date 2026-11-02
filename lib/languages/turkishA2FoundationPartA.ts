import { buildTurkishLessons, type TurkishLessonSeed } from './turkishSeed';

const A2_FOUNDATION_PART_A_SEEDS: readonly TurkishLessonSeed[] = [
  /* ۱. گسترش جمله‌سازی با زمان حال استمراری (Şimdiki Zaman) و زمان حال ساده/عادت‌نما (Geniş Zaman) */
  {
    id: 'tr-a2-f-01-present-vs-aorist',
    title: 'گسترش جمله‌سازی با زمان حال استمراری (Şimdiki Zaman) و زمان حال ساده/عادت‌نما (Geniş Zaman)',
    subtitle: 'Foundation · پسوندهای -ıyor و -ır/-ar در جمله‌های گسترده‌تر، منفی و پرسشی',
    situation: 'در گفتگوهای روزمره میان کارهایی که همیشه انجام می‌دهید (Geniş Zaman) و کارهایی که در همین بازهٔ زمانی در جریان است (Şimdiki Zaman) جمله‌های کامل و دقیق می‌سازید.',
    teachingFa: 'زمان حال استمراری با پسوند چهارگانهٔ -(ı/i/u/ü)yor ساخته می‌شود و برای عمل در حال انجام یا برنامهٔ جاری به کار می‌رود (çalışıyorum، dinliyor). زمان حال ساده یا عادت‌نما (Geniş Zaman) با پسوند -r / -(a/e)r / -(ı/i/u/ü)r به ریشهٔ فعل می‌چسبد و بیانگر عادت، واقعیت کلی یا درخواست مؤدبانه است (yaparım، gideriz، içer misiniz). در منفیِ Geniş Zaman برای اول‌شخص مفرد و جمع از -mam/-mem و -mayız/-meyiz و برای سایر اشخاص از -maz/-mez استفاده می‌شود (içmem، gelmez).',
    rows: [
      ['Sabahları sade kahve içerim ama şu anda bitki çayı içiyorum.', 'صبح‌ها قهوهٔ تلخ می‌نوشم اما همین الان دارم دمنوش می‌نوشم.', 'ساباهلارِی ساده کاهوه ایچِریم آما شو آندا بیتکی چایِی ایچییوروم', 'içerim', 'می‌نوشم (عادت‌نما)', 'Geniş Zaman (-er) در برابر Şimdiki Zaman (-iyor)'],
      ['Kardeşim genellikle otobüsle işe gider.', 'برادرم/خواهرم معمولاً با اتوبوس سر کار می‌رود.', 'کاردِشیم گِنَل‌لیکله اوتوبوسله ایشه گیدَر', 'gider', 'می‌رود (عادت)', 'ریشهٔ git- + -er → gider (نرم‌شدن t به d)'],
      ['Bugün hava yağmurlu olduğu için taksiye biniyoruz.', 'چون امروز هوا بارانی است، سوار تاکسی می‌شویم.', 'بوگون هاوا یائْمورلو اولدوئو ایچین تاکسییه بینییوروز', 'biniyoruz', 'سوار می‌شویم (هم‌اکنون)', 'Şimdiki Zaman برای موقعیت خاص امروز'],
      ['Akşamları geç saatte ağır yemek yemem.', 'شب‌ها دیروقت غذای سنگین نمی‌خورم.', 'آکشاملارِی گِچ ساعات‌ته آئِیر یِمَک یِمَم', 'yemem', 'نمی‌خورم (منفی عادت‌نما)', 'منفی اول‌شخص در Geniş Zaman با -mem'],
      ['Komşumuz hafta sonları bahçede çiçekleri sular.', 'همسایه‌مان آخر هفته‌ها در باغچه به گل‌ها آب می‌دهد.', 'کومشوموز هافتا سونلارِی باهچِده چیچَکلَری سولار', 'sular', 'آب می‌دهد (عادت)', 'ریشهٔ واکه‌پایان sula- + -r → sular'],
      ['Şu an toplantıdayım, seni birazdan ararım.', 'الان در جلسه‌ام، کمی دیگر به تو زنگ می‌زنم.', 'شو آن توپلانتِیدایِیم، سِنی بیرازدان آرارِیم', 'ararım', 'زنگ می‌زنم (قول در حال ساده)', 'کاربرد Geniş Zaman برای قول فوری'],
      ['Pencereyi biraz açar mısınız, içerisi sıcak oldu.', 'ممکن است پنجره را کمی باز کنید؟ داخل گرم شد.', 'پَنجِرِیی بیراز آچار مِیسِینِیز، ایچَریسی سِیجاک اولدو', 'açar mısınız', 'باز می‌کنید؟ (خواهش مؤدبانه)', 'پرسش مؤدبانه با Geniş Zaman'],
      ['Bu dönem yeni bir yazılım projesi üzerinde çalışıyoruz.', 'این ترم روی یک پروژهٔ نرم‌افزاری جدید کار می‌کنیم.', 'بو دونَم یِنی بیر یازِیلِیم پروژِسی اوزَرینده چالِیشِییوروز', 'çalışıyoruz', 'داریم کار می‌کنیم', 'Şimdiki Zaman برای دورهٔ زمانی جاری'],
    ],
    dialogue: [
      ['سلین', 'Normalde öğle yemeğini nerede yersin?', 'معمولاً ناهار را کجا می‌خوری؟'],
      ['آرش', 'Genellikle ofis yemekhanesinde yerim ama bugün dışarıda yiyorum.', 'معمولاً در غذاخوری شرکت می‌خورم اما امروز بیرون می‌خورم.'],
      ['سلین', 'Harika, ben de şimdi çıkıyorum; birlikte gidelim mi?', 'عالی، من هم الان دارم بیرون می‌روم؛ با هم برویم؟'],
      ['آرش', 'Tabii, köşedeki lokanta çok güzel çorba yapar.', 'حتماً، رستوران سر نبش سوپ خیلی خوبی درست می‌کند.'],
    ],
    checks: [
      {
        promptFa: 'شکل منفی «نمی‌نوشم» در زمان حال ساده/عادت‌نما (Geniş Zaman) کدام است؟',
        choices: ['içmem', 'içmiyorum', 'içmedim'],
        correctIndex: 0,
        explanationFa: 'در Geniş Zaman منفیِ اول‌شخص مفرد با -mam/-mem ساخته می‌شود: içmem (به‌طور عادت نمی‌نوشم).',
      },
      {
        promptFa: 'در جملهٔ «Pencereyi biraz açar mısınız?» زمان حال ساده چه کاربردی دارد؟',
        choices: ['بیان اتفاق گذشته', 'درخواست مؤدبانه در زمان حال', 'بیان اجبار قانونی'],
        correctIndex: 1,
        explanationFa: 'ساختار «فعل در Geniş Zaman + mısınız/misiniz» رایج‌ترین شیوهٔ درخواست مؤدبانه در ترکی استانبولی است.',
      },
    ],
  },

  /* ۲. بیان تفاوت عادت‌ها، فعالیت‌های روزمره و فعالیت‌های در حال انجام */
  {
    id: 'tr-a2-f-02-habits-vs-now',
    title: 'بیان تفاوت عادت‌ها، فعالیت‌های روزمره و فعالیت‌های در حال انجام',
    subtitle: 'Foundation · تقابل هرروزه با استثنای امروز با قیدهای her gün، normalde، bugün و şu anda',
    situation: 'توضیح می‌دهید که روال همیشگی زندگی یا کارتان چیست و چرا امروز یا در این لحظه کار متفاوتی انجام می‌دهید.',
    teachingFa: 'برای نشان‌دادن تفاوت عادت با وضعیت لحظه‌ای، قیدهایی مانند her sabah (هر صبح)، normalde (در حالت عادی) و genellikle (معمولاً) کنار Geniş Zaman (یا گاهی Şimdiki Zaman عادت‌نما در گفتار) می‌آیند، و در جملهٔ دوم با ama bugün (اما امروز) یا şu anda (هم‌اکنون) به Şimdiki Zaman سوییچ می‌کنیم: Normalde erken uyurum ama bu gece ders çalışıyorum.',
    rows: [
      ['Normalde saat yedide uyanırım ama bugün tatil olduğu için dinleniyorum.', 'در حالت عادی ساعت هفت بیدار می‌شوم اما امروز چون تعطیل است استراحت می‌کنم.', 'نورمالده ساعات یِدیده اویانِیرِیم آما بوگون تاتیل اولدوئو ایچین دینلَنییوروم', 'uyanırım', 'بیدار می‌شوم', 'normalde + Geniş Zaman / bugün + Şimdiki Zaman'],
      ['Eşim her akşam kitap okur, fakat şu anda mutfakta tatlı yapıyor.', 'همسرم هر شب کتاب می‌خواند، اما همین الان در آشپزخانه شیرینی درست می‌کند.', 'اِشیم هَر آکشام کیتاپ اوکور، فاکات شو آندا موتفاکتا تاتلِی یاپِییور', 'okur', 'می‌خواند (هر شب)', 'تقابل عادت هرشب با عمل لحظه‌ای'],
      ['Hafta içi spor salonuna giderim; bu hafta evde egzersiz yapıyorum.', 'طول هفته به باشگاه می‌روم؛ این هفته در خانه ورزش می‌کنم.', 'هافتا ایچی اسپور سالونونا گیدَریم؛ بو هافتا اِوده اِگزَرسیز یاپِییوروم', 'egzersiz', 'ورزش / تمرین', 'این هفته (موقت) با Şimdiki Zaman'],
      ['Çocuklar genellikle bahçede oynar ama şimdi içeride resim çiziyorlar.', 'بچه‌ها معمولاً در حیاط بازی می‌کنند اما الان داخل خانه نقاشی می‌کشند.', 'چوجوکلار گِنَل‌لیکله باهچِده اوینار آما شیمدی ایچَریده رِسیم چیزییورلار', 'çiziyorlar', 'دارند می‌کشند', 'oynar (عادت) در برابر çiziyorlar (در جریان)'],
      ['Annem çayına hiç şeker atmaz, her zaman şekersiz içer.', 'مادرم هیچ‌وقت در چایش شکر نمی‌ریزد، همیشه بی‌شکر می‌نوشد.', 'آننَم چایِینا هیچ شِکَر آتماز، هَر زامان شِکَرسیز ایچَر', 'atmaz', 'نمی‌ریزد (هرگز)', 'منفی سوم‌شخص Geniş Zaman با -maz'],
      ['Babam normalde gözlük takmaz ama şimdi küçük yazıları okuyor.', 'پدرم معمولاً عینک نمی‌زند اما الان دارد نوشته‌های ریز را می‌خواند.', 'بابام نورمالده گوزلوک تاکماز آما شیمدی کوچوک یازِیلارِی اوکویور', 'takmaz', 'نمی‌زند (عادت منفی)'],
      ['Biz her yaz deniz kenarına gideriz, bu yaz ise yaylada kalıyoruz.', 'ما هر تابستان کنار دریا می‌رویم، اما این تابستان در ییلاق می‌مانیم.', 'بیز هَر یاز دِنیز کِنارِینا گیدَریز، بو یاز ایسه یایلادا کالِییوروز', 'kalıyoruz', 'می‌مانیم (این تابستان)', 'پیوند تقابلی با ise (اما / در مقابل)'],
      ['Sen genellikle sessiz çalışırsın; bugün neden müzik dinliyorsun?', 'تو معمولاً بی‌صدا کار می‌کنی؛ امروز چرا داری موسیقی گوش می‌دهی؟', 'سَن گِنَل‌لیکله سَس‌سیز چالِیشِیرسِین؛ بوگون نِدَن موزیک دینلییورسون', 'çalışırsın', 'کار می‌کنی (عادت)'],
    ],
    dialogue: [
      ['امره', 'Sen normalde işe metroyla gitmez misin?', 'تو معمولاً با مترو سر کار نمی‌روی؟'],
      ['نازنین', 'Evet, her gün metroya binerim ama bugün istasyonda bakım var.', 'بله، هر روز سوار مترو می‌شوم اما امروز در ایستگاه تعمیرات هست.'],
      ['امره', 'O zaman şimdi nasıl gidiyorsun?', 'پس الان چطور داری می‌روی؟'],
      ['نازنین', 'Sahil yolundan vapurla geçiyorum, manzara harika.', 'از جادهٔ ساحلی با کشتی شهری رد می‌شوم، منظره عالی است.'],
    ],
    checks: [
      {
        promptFa: 'در جملهٔ «Normalde erken uyanırım ama bugün dinleniyorum» بخش دوم چه مفهومی دارد؟',
        choices: ['عادت همیشگی سالانه', 'وضعیت موقت و در جریانِ امروز در برابر عادت همیشگی', 'رویداد تمام‌شده در سال گذشته'],
        correctIndex: 1,
        explanationFa: 'uyanırım عادت همیشگی را نشان می‌دهد و dinleniyorum وضعیت موقت و استثنای امروز را بیان می‌کند.',
      },
      {
        promptFa: 'شکل منفی سوم‌شخص مفرد از فعل «atmak» در زمان عادت‌نما چیست؟',
        choices: ['atmıyor', 'atmaz', 'atmadı'],
        correctIndex: 1,
        explanationFa: 'در سوم‌شخص مفرد Geniş Zaman پسوند منفی -maz/-mez است: atmaz.',
      },
    ],
  },

  /* ۳. بیان گذشته با زمان گذشته قطعی (Belirli Geçmiş Zaman — Di’li Geçmiş Zaman) */
  {
    id: 'tr-a2-f-03-definite-past',
    title: 'بیان گذشته با زمان گذشته قطعی (Belirli Geçmiş Zaman — Di’li Geçmiş Zaman)',
    subtitle: 'Foundation · پسوندهای -dı/-di/-du/-dü و -tı/-ti/-tu/-tü برای رویدادهای دیده‌شده و قطعی',
    situation: 'دربارهٔ کارهای تمام‌شده‌ای صحبت می‌کنید که خودتان انجام داده‌اید یا مستقیماً شاهدش بوده‌اید.',
    teachingFa: 'زمان گذشتهٔ قطعی با افزودن پسوند -dı/-di/-du/-dü به ریشهٔ فعل ساخته می‌شود. اگر ریشه به یکی از همخوان‌های بی‌واک «f، s، t، k، ç، ş، h، p» (رمز Fıstıkçı Şahap) ختم شود، d به t تبدیل می‌گردد: git + ti + m → gittim، çalış + tı + k → çalıştık. پسوندهای شخصی این زمان عبارت‌اند از: -m، -n، (—)، -k، -nız/-niz/-nuz/-nüz، -lar/-ler. در جمله‌های اسمی گذشته با واکه، حرف میانجی y می‌آید: yorgundum، evdeydik.',
    rows: [
      ['Dün akşam ailemle sahilde uzun bir yürüyüş yaptık.', 'دیشب با خانواده‌ام در ساحل پیاده‌روی طولانی‌ای کردیم.', 'دون آکشام آیلَمله ساهیلده اوزون بیر یورویوش یاپتِیک', 'yaptık', 'انجام دادیم / کردیم', 'yap- (ختم به p) + -tı + -k → yaptık'],
      ['Sabah erken kalktım ve tüm e-postaları yanıtladım.', 'صبح زود بیدار شدم و به همهٔ ایمیل‌ها پاسخ دادم.', 'ساباه اَرکَن کالکتِیم وِ توم اِپوستالارِی یانِیتلادِیم', 'kalktım', 'بیدار شدم / بلند شدم', 'kalk- (ختم به k) + -tı + -m → kalktım'],
      ['Geçen hafta Kadıköy’de eski bir arkadaşımla buluştum.', 'هفتهٔ پیش در کادیکوی با یکی از دوستان قدیمی‌ام قرار گذاشتم و دیدمش.', 'گِچَن هافتا کادِیکویده اِسکی بیر آرکاداشِیملا بولوشتوم', 'buluştum', 'ملاقات کردم', 'buluş- + -tu + -m → buluştum'],
      ['Otobüs zamanında gelmedi, bu yüzden biraz geciktik.', 'اتوبوس به‌موقع نیامد، به همین دلیل کمی دیر رسیدیم.', 'اوتوبوس زامانِیندا گَلمِدی، بو یوزدَن بیراز گِجیکتیک', 'gelmedi', 'نیامد', 'منفی گذشتهٔ قطعی: ریشه + -ma/-me + -dı/-di'],
      ['Toplantıda yeni bütçe raporunu dikkatle incelediler.', 'در جلسه گزارش بودجهٔ جدید را با دقت بررسی کردند.', 'توپلانتِیدا یِنی بوتچه راپورونو دیکّاتله اینجِلِدیلَر', 'incelediler', 'بررسی کردند'],
      ['Dün gece telefonunun şarjı bitti mi?', 'دیشب شارژ تلفنت تمام شد؟', 'دون گِجه تِلِفونونون شارژِی بیتتی می', 'bitti', 'تمام شد', 'پرسش گذشتهٔ قطعی: فعل گذشته + mı/mi/mu/mü'],
      ['Yolculuktan sonra hepimiz oldukça yorgunduk.', 'بعد از سفر همه‌مان کاملاً خسته بودیم.', 'یولجولوکتان سونرا هِپیمیز اولدوکچا یورگوندوک', 'yorgunduk', 'خسته بودیم', 'گذشتهٔ جملهٔ اسمی: yorgun + -du + -k'],
      ['İki yıl önce İstanbul’a taşındım ve burada işe başladım.', 'دو سال پیش به استانبول اسباب‌کشی کردم و اینجا کار را شروع کردم.', 'ایکی یِیل اونجه ایستانبولا تاشِیندِیم وِ بورادا ایشه باشلادِیم', 'taşındım', 'نقل‌مکان کردم'],
    ],
    dialogue: [
      ['جان', 'Hafta sonu nasıl geçti, dinlenebildin mi?', 'آخر هفته چطور گذشت، توانستی استراحت کنی؟'],
      ['سارا', 'Cumartesi günü evi temizledim, pazar günü ise müzeyi gezdim.', 'روز شنبه خانه را تمیز کردم و یکشنبه موزه را گشتم.'],
      ['جان', 'Müzeyi beğendin mi, kalabalık mıydı?', 'از موزه خوشت آمد، شلوغ بود؟'],
      ['سارا', 'Çok beğendim; sabah erken gittim, hiç kalabalık değildi.', 'خیلی خوشم آمد؛ صبح زود رفتم، اصلاً شلوغ نبود.'],
    ],
    checks: [
      {
        promptFa: 'چرا در «yaptık» و «kalktım» به جای d از حرف t استفاده شده است؟',
        choices: ['چون جمله پرسشی است', 'به دلیل ختم‌شدن ریشه به همخوان‌های بی‌واک p و k', 'چون مربوط به زمان آینده است'],
        correctIndex: 1,
        explanationFa: 'پس از همخوان‌های بی‌واک «f s t k ç ş h p»، پسوند گذشتهٔ قطعی با t آغاز می‌شود (-tı/-ti/-tu/-tü).',
      },
      {
        promptFa: 'کدام گزینه به معنی «اصلاً شلوغ نبود» در گذشتهٔ قطعی است؟',
        choices: ['hiç kalabalık değildi', 'hiç kalabalık olmaz', 'hiç kalabalık değilmiş'],
        correctIndex: 0,
        explanationFa: 'منفیِ جمله‌های اسمی در گذشتهٔ قطعی با «değildi» ساخته می‌شود.',
      },
    ],
  },

  /* ۴. بیان گذشته با زمان گذشته غیرقطعی و نقل‌شده (Belirsiz Geçmiş Zaman — Miş’li Geçmiş Zaman) */
  {
    id: 'tr-a2-f-04-reported-past',
    title: 'بیان گذشته با زمان گذشته غیرقطعی و نقل‌شده (Belirsiz Geçmiş Zaman — Miş’li Geçmiş Zaman)',
    subtitle: 'Foundation · پسوند -mış/-miş/-muş/-müş برای شنیده‌ها، خبرها و متوجه‌شدن ناگهانی',
    situation: 'اتفاقی را که از دیگران شنیده‌اید، در خبرها خوانده‌اید یا تازه از روی نتیجه متوجه شده‌اید بیان می‌کنید.',
    teachingFa: 'در ترکی استانبولی تفاوت مهمی میان گذشتهٔ دیده‌شده (-dı) و گذشتهٔ نقل‌شده یا استنباطی (-mış/-miş/-muş/-müş) وجود دارد. هرگاه گوینده خودش شاهد ماجرا نبوده و از دیگری شنیده باشد (شنیده‌ام که...)، یا همین الان از روی نشانه متوجه شده باشد (عجب، خوابم برده! / باران باریده!)، از پسوند چهارگانهٔ -mış استفاده می‌کند: yağmur yağmış، uyumuşum، gelmemişler.',
    rows: [
      ['Gece çok yağmur yağmış, bütün sokaklar ıslanmış.', 'شب باران زیادی باریده است؛ همهٔ خیابان‌ها خیس شده‌اند (از ظاهر کوچه فهمیدم).', 'گِجه چوک یائْمور یائْمِیش، بوتون سوکاکلار ایسلانمِیش', 'yağmış', 'باریده است (استنباطی)', '-mış برای دیدن نتیجهٔ رویداد'],
      ['Duydum ki kuzenin Ankara’da yeni bir iş bulmuş.', 'شنیدم که پسرعمو/دخترخالهٔ تو در آنکارا کار جدیدی پیدا کرده است.', 'دویدوم کی کوزِنین آنکارادا یِنی بیر ایش بولموش', 'bulmuş', 'پیدا کرده است (شنیده‌شده)', 'نقل خبر شنیده‌شده با -muş'],
      ['Televizyonun karşısında fark etmeden uyumuşum.', 'جلوی تلویزیون بی‌آنکه متوجه شوم خوابم برده است.', 'تِلِویزیونون کارشِیسِیندا فارک اِتمِدَن اویوموشوم', 'uyumuşum', 'خوابم برده است', 'متوجه‌شدن پس از بیداری با -muşum'],
      ['Bu çorba gerçekten çok lezzetli olmuş, ellerine sağlık!', 'این سوپ واقعاً خیلی خوش‌مزه شده است، دستت درد نکند!', 'بو چوربا گَرچَکتَن چوک لِزّتلی اولموش، اَللَرینه سائلِیک', 'olmuş', 'شده است (دریافت پس از چشیدن)'],
      ['Misafirler henüz yola çıkmamış, biraz geç kalacaklarmış.', 'مهمان‌ها هنوز راه نیفتاده‌اند، گویا کمی دیر خواهند رسید.', 'میسافیرلَر هِنوز یولا چِیکمامِیش، بیراز گِچ کالاجاکلارمِیش', 'çıkmamış', 'راه نیفتاده‌اند (منفی نقلی)', 'منفی با -mamış/-memiş'],
      ['Çantamı evde unutmuşum, şimdi fark ettim!', 'کیفم را در خانه جا گذاشته‌ام، همین الان متوجه شدم!', 'چانتامِی اِوده اونوتموشوم، شیمدی فارک اِتتیم', 'unutmuşum', 'فراموش کرده‌ام / جا گذاشته‌ام'],
      ['Komşular geçen ay İzmir’e taşınmışlar.', 'همسایه‌ها گویا ماه گذشته به ازمیر نقل‌مکان کرده‌اند.', 'کومشولار گِچَن آی ایزمیره تاشِینمِیشلار', 'taşınmışlar', 'نقل‌مکان کرده‌اند (نقل قول)'],
      ['Toplantı saat üçe ertelenmiş mi?', 'آیا (شنیده‌ای که) جلسه به ساعت سه موکول شده است؟', 'توپلانتِی ساعات اوچه اَرتِلَنمیش می', 'ertelenmiş', 'به‌تعویق افتاده / موکول شده'],
    ],
    dialogue: [
      ['الیاس', 'Merve bugün neden ofise gelmedi, haberin var mı?', 'مروه امروز چرا به دفتر نیامد، خبر داری؟'],
      ['بهار', 'Sabah müdüre mesaj atmış; biraz üşütmüş ve doktora gitmiş.', 'صبح به مدیر پیام داده؛ گویا کمی سرما خورده و به دکتر رفته است.'],
      ['الیاس', 'Geçmiş olsun, önemli bir şey yokmuş değil mi?', 'بلا به دور، چیز مهمی نبوده، درست است؟'],
      ['بهار', 'Hayır, sadece iki gün istirahat yazmışlar.', 'نه، فقط دو روز استراحت برایش نوشته‌اند.'],
    ],
    checks: [
      {
        promptFa: 'چرا در «Çantamı evde unutmuşum!» از -muşum استفاده شده است؟',
        choices: ['چون مربوط به آینده است', 'چون گوینده همین لحظه متوجه جا ماندن کیف شده است', 'چون جمله امری است'],
        correctIndex: 1,
        explanationFa: 'پسوند -mış/-muş برای متوجه‌شدن ناگهانی از کاری که بدون توجه انجام شده به کار می‌رود.',
      },
      {
        promptFa: 'وقتی خبری را از دیگران شنیده‌ایم و خودمان ندیده‌ایم، کدام شکل درست است؟',
        choices: ['yeni bir iş bulmuş', 'yeni bir iş buluyor', 'yeni bir iş bulsun'],
        correctIndex: 0,
        explanationFa: 'برای بیان رویداد شنیده‌شده از گذشتهٔ نقلی (-mış/-miş/-muş/-müş) استفاده می‌شود.',
      },
    ],
  },

  /* ۵. بیان تجربه‌ها و فعالیت‌های انجام‌شده */
  {
    id: 'tr-a2-f-05-experiences-completed',
    title: 'بیان تجربه‌ها و فعالیت‌های انجام‌شده',
    subtitle: 'Foundation · بیان تجربهٔ زندگی با daha önce، hiç، birkaç kez و زمان گذشته',
    situation: 'دربارهٔ کارهایی که تا به حال در زندگی تجربه کرده‌اید یا کارهایی که قبلاً انجام داده‌اید و تکمیل شده‌اند صحبت می‌کنید.',
    teachingFa: 'برخلاف انگلیسی که زمان حال کامل جداگانه دارد، در ترکی استانبولی تجربه‌های زندگی معمولاً با قیدهای daha önce (قبلاً / پیش‌تر)، hiç (تا به حال / هرگز در جملهٔ پرسشی و منفی) و birkaç kez / iki defa (چند بار / دو بار) همراه با زمان گذشتهٔ قطعی (-dı) بیان می‌شوند: Daha önce Kapadokya’ya gittin mi? — Evet, iki kez gittim / Hayır, hiç gitmedim.',
    rows: [
      ['Daha önce hiç Kapadokya’da balona bindin mi?', 'تا به حال در کاپادوکیا سوار بالن شده‌ای؟', 'داها اونجه هیچ کاپادوکیادا بالونا بیندین می', 'daha önce', 'قبلاً / پیش از این', 'daha önce + hiç + گذشتهٔ پرسشی = تجربهٔ زندگی'],
      ['Evet, geçen bahar bir kez bindim ve çok etkilendim.', 'بله، بهار گذشته یک بار سوار شدم و خیلی تحت تأثیر قرار گرفتم.', 'اِوَت، گِچَن باهار بیر کِز بیندیم وِ چوک اِتکیلَندیم', 'bir kez', 'یک بار'],
      ['Hayır, daha önce hiç Türk kahvesi falına bakmadım.', 'نه، تا به حال هیچ‌وقت فال قهوهٔ ترک نگرفته‌ام.', 'هایِیر، داها اونجه هیچ تورک کاهوِسی فالِینا باکمادِیم', 'bakmadım', 'نگاه نکرده‌ام / نگرفته‌ام', 'hiç + فعل منفی در گذشته = تا به حال نکرده‌ام'],
      ['Bu belgeseli daha önce iki defa izledik.', 'این مستند را قبلاً دو بار تماشا کرده‌ایم.', 'بو بَلگِسِلی داها اونجه ایکی دِفا ایزلِدیک', 'iki defa', 'دو بار'],
      ['Şimdiye kadar üç farklı şehirde yaşadım.', 'تا امروز در سه شهر مختلف زندگی کرده‌ام.', 'شیمدییه کادار اوچ فارکلِی شِهیرده یاشادِیم', 'şimdiye kadar', 'تا به حال / تاکنون', 'şimdiye kadar برای بیان جمع تجربه‌ها تا امروز'],
      ['Tüm başvuru belgelerini hazırladım ve sisteme yükledim.', 'همهٔ مدارک ثبت‌نام را آماده کرده‌ام و در سامانه بارگذاری کردم.', 'توم باشوورو بَلگِلَرینی هازِیرلادِیم وِ سیستِمه یوکلِدیم', 'yükledim', 'بارگذاری کردم', 'بیان فعالیت‌های تکمیل‌شده'],
      ['Bursa’ya birkaç kere gittim ama Uludağ’a çıkmadım.', 'چند بار به بورسا رفته‌ام اما بالای اولوداغ نرفته‌ام.', 'بورسایا بیرکاچ کِره گیتتیم آما اولودائا چِیکمادِیم', 'birkaç kere', 'چند بار'],
      ['Hayatımda ilk kez bu kadar acı bir biber yedim.', 'در زندگی‌ام برای اولین بار فلفلی به این تندی خوردم.', 'هایاتِیمدا ایلک کِز بو کادار آجِی بیر بیبَر یِدیم', 'ilk kez', 'برای اولین بار'],
    ],
    dialogue: [
      ['نیلوفر', 'Daha önce hiç vapurla Boğaz turu yaptın mı?', 'تا به حال با کشتی گشت تنگهٔ بسفر رفته‌ای؟'],
      ['کرم', 'Evet, birkaç kez yaptım; özellikle gün batımında muhteşem oluyor.', 'بله، چند بار رفته‌ام؛ به‌ویژه هنگام غروب آفتاب فوق‌العاده می‌شود.'],
      ['نیلوفر', 'Ben şimdiye kadar hiç denemedim.', 'من تا به حال اصلاً امتحان نکرده‌ام.'],
      ['کرم', 'O zaman bu hafta sonu mutlaka birlikte gidelim.', 'پس این آخر هفته حتماً با هم برویم.'],
    ],
    checks: [
      {
        promptFa: 'کدام عبارت برای پرسیدن «آیا تا به حال ... کرده‌ای؟» به کار می‌رود؟',
        choices: ['Daha önce hiç ... -dın mı?', 'Yarın sabah ... -acak mısın?', 'Her akşam ... -ıyor musun?'],
        correctIndex: 0,
        explanationFa: 'ترکیب «Daha önce hiç» با زمان گذشتهٔ قطعی پرسشی برای پرسیدن تجربهٔ زندگی به کار می‌رود.',
      },
      {
        promptFa: 'معنی عبارت «şimdiye kadar» چیست؟',
        choices: ['از فردا به بعد', 'تا به حال / تاکنون', 'هر روز صبح'],
        correctIndex: 1,
        explanationFa: 'şimdiye kadar یعنی «تا این لحظه / تا به حال» و برای بیان مجموع تجربه‌ها استفاده می‌شود.',
      },
    ],
  },

  /* ۶. بیان برنامه‌ها و قصدهای آینده با زمان آینده (Gelecek Zaman) */
  {
    id: 'tr-a2-f-06-future-tense',
    title: 'بیان برنامه‌ها و قصدهای آینده با زمان آینده (Gelecek Zaman)',
    subtitle: 'Foundation · پسوند -(y)acak / -(y)ecek و نرم‌شدن k به ğ پیش از واکه',
    situation: 'دربارهٔ برنامه‌های مشخص فردا، هفتهٔ آینده و ماه‌های پیش رو صحبت می‌کنید و پرسش و منفی آینده می‌سازید.',
    teachingFa: 'زمان آینده (Gelecek Zaman) با پسوند دونمایهٔ -acak (پس از واکه‌های پسین a, ı, o, u) و -ecek (پس از واکه‌های پیشین e, i, ö, ü) ساخته می‌شود؛ اگر ریشهٔ فعل به واکه ختم شود، میانجی y می‌آید: oku + y + acak → okuyacak. در اول‌شخص مفرد (-ım/-im) و اول‌شخص جمع (-ız/-iz) حرف k پایانی به ğ نرم می‌شود: gideceğim، gideceğiz (در گفتار استانبولی «گیدِجَم / گیدِجَز» شنیده می‌شود اما در نوشتار معیار کامل نوشته می‌شود). دو ریشهٔ git- و et- پیش از واکه به gid- و ed- نرم می‌شوند: gidecek، edecek.',
    rows: [
      ['Yarın sabah erkenden havalimanına gideceğim.', 'فردا صبح زود به فرودگاه خواهم رفت.', 'یارِین ساباه اَرکَندَن هاوالیمانِینا گیدِجَییم', 'gideceğim', 'خواهم رفت', 'git + ecek + im → gideceğim (نرم‌شدن t→d و k→ğ)'],
      ['Önümüzdeki hafta yeni dairemize taşınacağız.', 'هفتهٔ آینده به آپارتمان جدیدمان اسباب‌کشی خواهیم کرد.', 'اونوموزدِکی هافتا یِنی دایرِمیزه تاشِیناجائِیز', 'taşınacağız', 'اسباب‌کشی خواهیم کرد', 'taşın + acak + ız → taşınacağız'],
      ['Bu akşam dışarı çıkmayacağım, evde dinleneceğim.', 'امشب بیرون نخواهم رفت، در خانه استراحت خواهم کرد.', 'بو آکشام دِیشارِی چِیکمایاجائِیم، اِوده دینلَنِجَییم', 'çıkmayacağım', 'بیرون نخواهم رفت', 'منفی آینده: -mayacak / -meyecek'],
      ['Hafta sonu kursa katılacak mısınız?', 'آخر هفته در دوره شرکت خواهید کرد؟', 'هافتا سونو کورسا کاتِیلاجاک مِیسِینِیز', 'katılacak mısınız', 'شرکت خواهید کرد؟', 'پرسش آینده: -acak/-ecek + mıyım / mısınız'],
      ['Arkadaşlarım saat altıda istasyonda beni bekleyecek.', 'دوستانم ساعت شش در ایستگاه منتظر من خواهند ماند.', 'آرکاداشلارِیم ساعات آلتِیدا ایستاسیوندا بِنی بَکلِیِجَک', 'bekleyecek', 'منتظر خواهد ماند', 'ریشهٔ واکه‌پایان bekle- + y + ecek'],
      ['Gelecek ay Türkçe A2 sınavına gireceğiz.', 'ماه آینده در آزمون سطح دو ترکی شرکت خواهیم کرد.', 'گِلِجَک آی تورکچه آ ایکی سِیناوِینا گیرِجَییز', 'gireceğiz', 'وارد خواهیم شد / شرکت خواهیم کرد'],
      ['Toplantıdan sonra müdürle kısa bir görüşme yapacağım.', 'بعد از جلسه گفتگوی کوتاهی با مدیر خواهم داشت.', 'توپلانتِیدان سونرا مودورله کِیسا بیر گوروشمه یاپاجائِیم', 'yapacağım', 'انجام خواهم داد'],
      ['Kargo şirketi paketi yarın öğleden önce teslim edecek.', 'شرکت پست بسته را فردا پیش از ظهر تحویل خواهد داد.', 'کارگو شیرکِتی پاکِتی یارِین اوئلِدَن اونجه تِسلیم اِدِجَک', 'teslim edecek', 'تحویل خواهد داد', 'et- + ecek → edecek'],
    ],
    dialogue: [
      ['دریا', 'Yaz tatilinde nereye gideceksiniz, karar verdiniz mi?', 'تعطیلات تابستان کجا خواهید رفت، تصمیم گرفتید؟'],
      ['پویا', 'Önce Antalya’da üç gün kalacağız, sonra Kaş’a geçeceğiz.', 'اول سه روز در آنتالیا خواهیم ماند، بعد به کاش خواهیم رفت.'],
      ['دریا', 'Uçakla mı gideceksiniz yoksa araba mı kiralayacaksınız?', 'با هواپیما خواهید رفت یا خودرو کرایه خواهید کرد؟'],
      ['پویا', 'Antalya’ya uçacağız, orada küçük bir araba kiralayacağız.', 'به آنتالیا پرواز خواهیم کرد و آنجا یک خودروی کوچک کرایه خواهیم کرد.'],
    ],
    checks: [
      {
        promptFa: 'نوشتار درست اول‌شخص مفرد آینده از فعل «gitmek» کدام است؟',
        choices: ['gitceğim', 'gideceğim', 'gidecekim'],
        correctIndex: 1,
        explanationFa: 'در gitmek پیش از پسوند واکه‌دار -ecek حرف t به d تبدیل می‌شود و پیش از -im حرف k به ğ نرم می‌گردد: gideceğim.',
      },
      {
        promptFa: 'در فعل واکه‌پایان «beklemek»، زمان آینده برای سوم‌شخص مفرد چگونه ساخته می‌شود؟',
        choices: ['bekleecek', 'bekleyecek', 'bekleacak'],
        correctIndex: 1,
        explanationFa: 'پس از واکهٔ e همخوان میانجی y و پسوند هماهنگ -ecek می‌آید: bekleyecek.',
      },
    ],
  },

  /* ۷. بیان تصمیم، قصد و پیش‌بینی درباره آینده */
  {
    id: 'tr-a2-f-07-decisions-predictions',
    title: 'بیان تصمیم، قصد و پیش‌بینی درباره آینده',
    subtitle: 'Foundation · ساختارهای düşünmek، planlamak، niyetinde olmak، sanırım و galiba',
    situation: 'قصد و تصمیم شخصی خود را بیان می‌کنید و دربارهٔ اتفاق‌های احتمالی آینده پیش‌بینی می‌کنید.',
    teachingFa: 'برای بیان قصد و برنامه از «مصدر با -mayı/-meyi + düşünüyorum / planlıyorum» یا «karar verdim» (تصمیم گرفتم) استفاده می‌کنیم: Yeni bir dil öğrenmeyi düşünüyorum. برای پیش‌بینی دربارهٔ آینده نیز قیدهای sanırım (فکر می‌کنم / گمانم)، galiba (گویا / ظاهراً)، bence (به نظرم) و büyük ihtimalle (به احتمال زیاد) همراه با زمان آینده (-acak/-ecek) یا ممکن‌نما (-abilir) می‌آیند.',
    rows: [
      ['Bu yıl düzenli spor yapmaya karar verdim.', 'امسال تصمیم گرفتم منظم ورزش کنم.', 'بو یِیل دوزَنلی اسپور یاپمایا کارار وَردیم', 'karar verdim', 'تصمیم گرفتم', '-maya/-meye karar vermek = تصمیم گرفتن به'],
      ['Sonbaharda yüksek lisans programına başvurmayı düşünüyorum.', 'قصد دارم در پاییز برای دورهٔ کارشناسی ارشد اقدام کنم.', 'سونباهاردا یوکسَک لیسانس پروگرامِینا باشوورمایِی دوشونویوروم', 'düşünüyorum', 'در فکرم است / قصد دارم', '-mayı/-meyi düşünmek = قصد داشتن'],
      ['Hava bulutlandı, galiba birazdan yağmur yağacak.', 'هوا ابری شد، ظاهراً کمی دیگر باران خواهد بارید.', 'هاوا بولوتلاندِی، گالیبا بیرازدان یائْمور یائاجاک', 'galiba', 'ظاهراً / احتمالاً', 'پیش‌بینی آینده با galiba + -acak'],
      ['Sanırım bu toplantı beklenenden uzun sürecek.', 'گمان می‌کنم این جلسه طولانی‌تر از انتظار طول بکشد.', 'سانِیرِیم بو توپلانتِی بَکلِنَندَن اوزون سورِجَک', 'sanırım', 'گمان می‌کنم / فکر کنم'],
      ['Şirketimiz gelecek yıl yeni bir şube açmayı planlıyor.', 'شرکت ما برنامه دارد سال آینده شعبهٔ جدیدی باز کند.', 'شیرکِتیمیز گِلِجَک یِیل یِنی بیر شوبه آچمایِی پلانلِییور', 'planlıyor', 'برنامه‌ریزی می‌کند', '-mayı/-meyi planlamak'],
      ['Büyük ihtimalle tren zamanında kalkacak.', 'به احتمال زیاد قطار به‌موقع حرکت خواهد کرد.', 'بویوک ایهتیمال‌له ترَن زامانِیندا کالکاجاک', 'büyük ihtimalle', 'به احتمال زیاد'],
      ['Çok yoruldum; bu akşam erken yatmaya niyetliyim.', 'خیلی خسته شدم؛ قصد دارم امشب زود بخوابم.', 'چوک یورولدوم؛ بو آکشام اَرکَن یاتمایا نییَتلیییم', 'niyetliyim', 'قصد دارم / مصمم هستم'],
      ['Fiyatlar böyle artarsa yakında herkes toplu taşıma kullanacak.', 'اگر قیمت‌ها همین‌طور بالا برود به زودی همه از حمل‌ونقل عمومی استفاده خواهند کرد.', 'فییاتلار بویله آرتارسا یاکِیندا هَرکَس توپلو تاشِیما کوللاناجاک', 'yakında', 'به‌زودی'],
    ],
    dialogue: [
      ['امید', 'Mezuniyetten sonra ne yapmayı düşünüyorsun?', 'بعد از فارغ‌التحصیلی قصد داری چه کار کنی؟'],
      ['لاله', 'Önce altı ay staj yapmayı planlıyorum, sonra iş arayacağım.', 'اول برنامه دارم شش ماه کارآموزی کنم، بعد دنبال کار خواهم گشت.'],
      ['امید', 'Sence iş bulmak zor olacak mı?', 'به نظرت کار پیدا کردن سخت خواهد بود؟'],
      ['لاله', 'Sanırım ilk başta biraz zaman alacak ama iyi hazırlanıyorum.', 'گمانم در ابتدا کمی زمان ببرد اما دارم خوب آماده می‌شوم.'],
    ],
    checks: [
      {
        promptFa: 'کدام ساختار برای بیان «قصد دارم / به آن فکر می‌کنم» در ترکی طبیعی‌تر است؟',
        choices: ['başvurmayı düşünüyorum', 'başvurmak oldum', 'başvurduğum var'],
        correctIndex: 0,
        explanationFa: 'ساختار «فعل + -mayı/-meyi + düşünmek / planlamak» رایج‌ترین راه بیان قصد و برنامه است.',
      },
      {
        promptFa: 'واژهٔ «galiba» در جملهٔ «Galiba birazdan yağmur yağacak» چه نقشی دارد؟',
        choices: ['بیان قطعیت صددرصد در گذشته', 'بیان پیش‌بینی و احتمال در آینده', 'بیان ممنوعیت'],
        correctIndex: 1,
        explanationFa: 'galiba (ظاهراً / احتمالاً) همراه با زمان آینده برای پیش‌بینی بر پایهٔ شواهد (ابری شدن هوا) به کار می‌رود.',
      },
    ],
  },

  /* ۸. مقایسه اشخاص، اشیا و مکان‌ها (Karşılaştırma ve Üstünlük) */
  {
    id: 'tr-a2-f-08-comparisons-superlatives',
    title: 'مقایسه اشخاص، اشیا و مکان‌ها (Karşılaştırma ve Üstünlük)',
    subtitle: 'Foundation · ساختار تفضیلی با -dan/-den daha و عالی با en و برابری با kadar',
    situation: 'دو شخص، دو کالا یا دو شهر را از نظر ویژگی‌ها مقایسه می‌کنید و برترین گزینه را مشخص می‌سازید.',
    teachingFa: 'در ترکی استانبولی صفت پسوند تفضیلی نمی‌گیرد؛ بلکه مرجع مقایسه پسوند مبدأ (-dan/-den/-tan/-ten) می‌گیرد و پیش از صفت واژهٔ daha (تر) می‌آید: İstanbul Ankara’dan daha kalabalık (استانبول از آنکارا شلوغ‌تر است). برای صفت عالی پیش از صفت واژهٔ en (ترین) قرار می‌گیرد: en güzel şehir. برای بیان برابری نیز از ساختار «... kadar + صفت» استفاده می‌شود: senin kadar hızlı (به سرعتِ تو).',
    rows: [
      ['İstanbul, Ankara’dan daha kalabalık ve hareketli bir şehirdir.', 'استانبول شهری شلوغ‌تر و پرجنب‌وجوش‌تر از آنکارا است.', 'ایستانبول، آنکارادان داها کالابالِیک وِ هارِکَتلی بیر شِهیردیر', 'daha kalabalık', 'شلوغ‌تر', '-dan/-den + daha + صفت = مقایسهٔ برتری'],
      ['Bu dizüstü bilgisayar eski modelden çok daha hızlı çalışıyor.', 'این لپ‌تاپ خیلی سریع‌تر از مدل قدیمی کار می‌کند.', 'بو دیزوستو بیلگیسایار اِسکی مودَلدَن چوک داها هِیزلِی چالِیشِییور', 'çok daha hızlı', 'خیلی سریع‌تر', 'تشدید مقایسه با çok daha'],
      ['Mahallemizdeki en sakin kafe sahil caddesindedir.', 'آرام‌ترین کافهٔ محلهٔ ما در خیابان ساحلی است.', 'ماهاللِمیزدِکی اَن ساکین کافه ساهیل جاددِسیندِدیر', 'en sakin', 'آرام‌ترین', 'en + صفت = صفت عالی (ترین)'],
      ['Kardeşim de en az benim kadar düzenli çalışır.', 'برادرم/خواهرم هم دست‌کم به اندازهٔ من منظم کار می‌کند.', 'کاردِشیم دِ اَن آز بِنیم کادار دوزَنلی چالِیشِیر', 'benim kadar', 'به اندازهٔ من', 'برابری با ضمیر ملکی + kadar'],
      ['Tren yolculuğu otobüs yolculuğundan daha konforludur.', 'سفر با قطار راحت‌تر از سفر با اتوبوس است.', 'ترَن یولجولوئو اوتوبوس یولجولوئوندان داها کونفورلودور', 'daha konforludur', 'راحت‌تر است'],
      ['Bu mağazadaki en uygun fiyatlı mont hangisi?', 'مناسب‌ترین کاپشن از نظر قیمت در این فروشگاه کدام است؟', 'بو مائازاداکی اَن اویگون فییاتلِی مونت هانگیسی', 'en uygun', 'مناسب‌ترین'],
      ['Yeni evimiz metro istasyonuna eskisi kadar yakın değil.', 'خانهٔ جدیدمان به اندازهٔ قبلی به ایستگاه مترو نزدیک نیست.', 'یِنی اِویمیز مِترو ایستاسیونونا اِسکیسی کادار یاکِین دِئیل', 'eskisi kadar', 'به اندازهٔ قبلی', 'منفیِ برابری: ... kadar ... değil'],
      ['Sınıfımızın en çalışkan öğrencisi her soruya dikkatle cevap verir.', 'پرتلاش‌ترین دانش‌آموز کلاسمان به هر پرسشی با دقت پاسخ می‌دهد.', 'سِینِیفِیمِیزِین اَن چالِیشکان اوئرَنجیسی هَر سورویا دیکّاتله جِواپ وِریر', 'en çalışkan', 'پرتلاش‌ترین'],
    ],
    dialogue: [
      ['مینا', 'İki daireyi de gördün; sence hangisi daha kullanışlı?', 'هر دو آپارتمان را دیدی؛ به نظرت کدام کاربردی‌تر است؟'],
      ['کاوه', 'İkinci daire birincisinden daha aydınlık ve balkonu daha geniş.', 'آپارتمان دوم از اولی روشن‌تر است و بالکنش بزرگ‌تر است.'],
      ['مینا', 'Peki kirası diğer daire kadar uygun mu?', 'خب اجاره‌اش به اندازهٔ آپارتمان دیگر مناسب است؟'],
      ['کاوه', 'Evet, üstelik bölgedeki en temiz apartmanlardan biri.', 'بله، تازه یکی از تمیزترین ساختمان‌های منطقه است.'],
    ],
    checks: [
      {
        promptFa: 'در ترکی استانبولی ساختار درست برای «از مدل قدیمی سریع‌تر» کدام است؟',
        choices: ['eski modelde en hızlı', 'eski modelden daha hızlı', 'eski modele kadar hızlı'],
        correctIndex: 1,
        explanationFa: 'در مقایسهٔ دو چیز، مرجع پسوند -dan/-den می‌گیرد و پیش از صفت واژهٔ daha می‌آید.',
      },
      {
        promptFa: 'واژهٔ «en» پیش از صفت چه معنایی می‌سازد؟',
        choices: ['صفت عالی (ترین)', 'نفی صفت', 'تکرار عمل'],
        correctIndex: 0,
        explanationFa: 'en پیش از صفت یا قید معنای برترین (ترین) می‌دهد، مانند en sakin (آرام‌ترین).',
      },
    ],
  },

  /* ۹. بیان مقدار و تعداد (Çok, Az, Biraz, Birkaç, Daha Fazla, En Çok) */
  {
    id: 'tr-a2-f-09-quantifiers',
    title: 'بیان مقدار و تعداد (Çok, Az, Biraz, Birkaç, Daha Fazla, En Çok)',
    subtitle: 'Foundation · کمیت‌نماها با اسم مفرد بدون پسوند جمع و تفاوت biraz با birkaç',
    situation: 'مقدار خوراکی‌ها، زمان، هزینه و تعداد اشیا یا افراد را با کمیت‌نماهای دقیق بیان می‌کنید.',
    teachingFa: 'قاعدهٔ طلایی ترکی استانبولی: پس از اعداد و کمیت‌نماهای شمارشی مانند birkaç (چند)، kaç (چند تا) و çok sayıda اسم به‌صورت مفرد می‌آید و پسوند جمع -lar/-ler نمی‌گیرد: birkaç kitap (چند کتاب — نه birkaç kitaplar!). واژهٔ biraz (کمی / مقداری) برای مفاهیم غیرقابل‌شمارش (biraz su، biraz zaman) و birkaç برای قابل‌شمارش‌ها (birkaç dakika، birkaç öğrenci) به کار می‌رود. برای «بیشتر» از daha fazla / daha çok و برای «بیش از همه» از en çok استفاده می‌کنیم.',
    rows: [
      ['Çorbaya biraz limon ve az tuz ekledim.', 'به سوپ کمی لیمو و مقدار کمی نمک اضافه کردم.', 'چوربایا بیراز لیمون وِ آز توز اِکلِدیم', 'biraz', 'کمی / مقداری', 'biraz + اسم غیرقابل‌شمارش'],
      ['Toplantıya başlamadan önce birkaç önemli konuyu konuşalım.', 'پیش از شروع جلسه دربارهٔ چند موضوع مهم صحبت کنیم.', 'توپلانتِییا باشلامادان اونجه بیرکاچ اونَملی کونویو کونوشالِیم', 'birkaç', 'چند (با اسم مفرد)', 'birkaç + اسم مفرد (konu، بدون -lar)'],
      ['Bu projeyi bitirmek için daha fazla zamana ihtiyacımız var.', 'برای تمام‌کردن این پروژه به زمان بیشتری نیاز داریم.', 'بو پروژِیی بیتیرمَک ایچین داها فازلا زامانا ایهتییاجِیمِیز وار', 'daha fazla', 'بیشتر'],
      ['Boş zamanlarımda en çok belgesel izlemeyi seviyorum.', 'در اوقات فراغتم بیش از همه تماشای مستند را دوست دارم.', 'بوش زامانلارِیمدا اَن چوک بَلگِسَل ایزلِمِیی سِوییوروم', 'en çok', 'بیش از همه / بیشترین'],
      ['Bugün yolda çok trafik vardı, ofise geç vardık.', 'امروز در راه ترافیک زیادی بود، دیر به دفتر رسیدیم.', 'بوگون یولدا چوک ترافیک واردِی، اوفیسه گِچ واردِیک', 'çok', 'زیاد / خیلی'],
      ['Dolapta çok az süt kalmış, marketten alalım.', 'در یخچال شیر خیلی کمی مانده است، از سوپرمارکت بخریم.', 'دولاپتا چوک آز سوت کالمِیش، مارکَتتَن آلالِیم', 'çok az', 'خیلی کم'],
      ['Masada sadece birkaç boş sandalye kaldı.', 'کنار میز فقط چند صندلی خالی باقی ماند.', 'ماسادا سادِجه بیرکاچ بوش ساندالیه کالدِی', 'sandalye', 'صندلی (مفرد پس از birkaç)'],
      ['Kış aylarında daha çok sıcak içecek tüketiyoruz.', 'در ماه‌های زمستان نوشیدنی گرم بیشتری مصرف می‌کنیم.', 'کِیش آیلارِیندا داها چوک سِیجاک ایچِجَک توکِتییوروز', 'daha çok', 'بیشتر'],
    ],
    dialogue: [
      ['زهرا', 'Misafirler için yeterince meyve var mı?', 'برای مهمان‌ها به اندازهٔ کافی میوه هست؟'],
      ['بوراک', 'Biraz elma var ama portakal çok az kalmış.', 'کمی سیب هست اما پرتقال خیلی کم مانده است.'],
      ['زهرا', 'O zaman marketten birkaç kilo meyve ve biraz kuruyemiş alayım.', 'پس از فروشگاه چند کیلو میوه و کمی آجیل بخرم.'],
      ['بوراک', 'Harika olur, misafirlerimiz en çok fıstık ve badem seviyor.', 'عالی می‌شود، مهمان‌هایمان بیش از همه پسته و بادام دوست دارند.'],
    ],
    checks: [
      {
        promptFa: 'کدام عبارت از نظر قواعد جمع و کمیت‌نما در ترکی استانبولی درست است؟',
        choices: ['birkaç önemli konu', 'birkaç önemli konular', 'biraz önemli konular'],
        correctIndex: 0,
        explanationFa: 'پس از birkaç اسم همیشه مفرد می‌آید و پسوند جمع -lar/-ler نمی‌گیرد: birkaç önemli konu.',
      },
      {
        promptFa: 'تفاوت «biraz» و «birkaç» چیست؟',
        choices: ['biraz برای مقدار غیرقابل‌شمارش و birkaç برای تعداد است', 'هر دو فقط برای زمان گذشته به کار می‌روند', 'biraz به معنی بیشترین و birkaç به معنی کمترین است'],
        correctIndex: 0,
        explanationFa: 'biraz یعنی «کمی/مقداری» (biraz su) و birkaç یعنی «چند تا» (birkaç dakika).',
      },
    ],
  },

  /* ۱۰. بیان مالکیت و روابط میان اشخاص و اشیا (İyelik Ekleri) */
  {
    id: 'tr-a2-f-10-possessive-relations',
    title: 'بیان مالکیت و روابط میان اشخاص و اشیا (İyelik Ekleri)',
    subtitle: 'Foundation · ترکیب اضافی معین (Belirtili) و نامعین (Belirtisiz İsim Tamlaması)',
    situation: 'نسبت میان افراد، اجزای خانه، مدارک اداری و مالکیت اشیا را با ترکیب‌های اضافی دقیق بیان می‌کنید.',
    teachingFa: 'در ترکیب اضافی معین (Belirtili İsim Tamlaması) مضاف‌الیه پسوند -(n)ın/-(n)in/-(n)un/-(n)ün و مضاف پسوند ملکی سوم‌شخص -(s)ı/-(s)i/-(s)u/-(s)ü می‌گیرد: evin kapısı (درِ این خانهٔ مشخص)، Ayşe’nin bilgisayarı (رایانهٔ آیشه). در ترکیب اضافی نوعی/نامعین (Belirtisiz) جزء اول بی‌پسوند است و فقط جزء دوم پسوند ملکی می‌گیرد: otobüs durağı (ایستگاه اتوبوس)، Türkçe öğretmeni (معلم زبان ترکی). توجه کنید که پیش از پسوند واکه‌دار، همخوان پایانی p/ç/t/k نرم می‌شود (kitap → kitabım، durak → durağı) و استثنای مهم su → suyu (آبِ او) حرف میانجی y می‌گیرد.',
    rows: [
      ['Evin anahtarını sabah vestiyerin üstünde bıraktım.', 'کلید خانه را صبح روی جاکفشی/رخت‌آویز گذاشتم.', 'اِوین آناهتارِینِی ساباه وِستییِرین اوستونده بِیراکتِیم', 'evin anahtarını', 'کلیدِ خانه را', 'ترکیب اضافی معین: ev-in anahtar-ı-n-ı'],
      ['Otobüs durağı bizim sokağın hemen başındadır.', 'ایستگاه اتوبوس درست سرِ کوچهٔ ماست.', 'اوتوبوس دورائِی بیزیم سوکائِین هِمَن باشِیندادِیر', 'otobüs durağı', 'ایستگاه اتوبوس', 'ترکیب اضافی نوعی: otobüs + durağ-ı (k→ğ)'],
      ['Kardeşimin yeni iş yeri şehir merkezine çok yakın.', 'محل کار جدید برادرم/خواهرم به مرکز شهر خیلی نزدیک است.', 'کاردِشیمین یِنی ایش یِری شِهیر مَرکِزینه چوک یاکِین', 'kardeşimin', 'مالِ برادرم/خواهرم', 'زنجیرهٔ ملکی: kardeş-im-in iş yer-i'],
      ['Bu odanın penceresinden deniz manzarası görünüyor.', 'از پنجرهٔ این اتاق منظرهٔ دریا دیده می‌شود.', 'بو اودانِین پَنجِرِسیندَن دِنیز مانزاراسِی گورونویور', 'deniz manzarası', 'منظرهٔ دریا', 'pencere-s-i-n-den (میانجی s و میانجی n پیش از حالت)'],
      ['Şirket müdürünün odası üçüncü katta bulunuyor.', 'اتاق مدیر شرکت در طبقهٔ سوم قرار دارد.', 'شیرکَت مودورونون اوداسِی اوچونجو کاتتا بولونویور', 'müdürünün odası', 'اتاقِ مدیرش', 'ترکیب اضافی زنجیره‌ای'],
      ['Yemeğin tuzu ve baharatı tam yerinde olmuş.', 'نمک و ادویهٔ غذا کاملاً اندازه شده است.', 'یِمَیین توزو وِ باهاراتِی تام یِرینده اولموش', 'yemeğin tuzu', 'نمکِ غذا', 'yemek → yemeğin (نرم‌شدن k به ğ)'],
      ['Çocuğun ayakkabısı yağmurda biraz ıslanmış.', 'کفش بچه در باران کمی خیس شده است.', 'چوجوئون آیاک‌کابِیسِی یائْموردا بیراز ایسلانمِیش', 'çocuğun', 'مالِ کودک'],
      ['Meyve suyunun tadı çok taze ve doğal.', 'طعم آب‌میوه خیلی تازه و طبیعی است.', 'مِیوه سویونون تادِی چوک تازه وِ دوئال', 'suyunun', 'آبِ آن (ملکی استثنایی su)', 'استثنای su: meyve suyu → meyve suyunun tadı'],
    ],
    dialogue: [
      ['آیلین', 'Toplantı odasının kapısı kilitli, anahtar kimde?', 'درِ اتاق جلسه قفل است، کلید دست کیست؟'],
      ['مراد', 'Sanırım ofis sorumlusunun masasında duruyor.', 'فکر کنم روی میز مسئول دفتر است.'],
      ['آیلین', 'Peki projeksiyon cihazının kablosunu da aldın mı?', 'خب کابل دستگاه ویدئوپروژکتور را هم برداشتی؟'],
      ['مراد', 'Evet, bilgisayar çantamın ön gözünde hazır.', 'بله، در جیب جلویی کیف لپ‌تاپم آماده است.'],
    ],
    checks: [
      {
        promptFa: 'تفاوت «otobüs durağı» و «otobüsün kapısı» در چیست؟',
        choices: ['اولی ترکیب اضافی نوعی (ایستگاه اتوبوس) و دومی معین (درِ یک اتوبوس مشخص) است', 'هر دو غلط هستند', 'اولی جمع و دومی مفرد است'],
        correctIndex: 0,
        explanationFa: 'در otobüs durağı نوع مکان بیان می‌شود (فقط جزء دوم پسوند می‌گیرد)، اما در otobüsün kapısı هر دو جزء پسوند می‌گیرند.',
      },
      {
        promptFa: 'در ترکیب اضافی، واژهٔ «su» (آب) چه حرف میانجی استثنایی می‌گیرد؟',
        choices: ['حرف s (susu)', 'حرف y (meyve suyu)', 'حرف ş (suşu)'],
        correctIndex: 1,
        explanationFa: 'واژهٔ su استثناست و به جای s میانجی، حرف y می‌گیرد: meyve suyu، suyun tadı.',
      },
    ],
  },

  /* ۱۱. بیان ضرورت، اجبار و ممنوعیت (Gerekli Olmak, Zorunda Olmak, -malı/-meli, Yasak) */
  {
    id: 'tr-a2-f-11-necessity-prohibition',
    title: 'بیان ضرورت، اجبار و ممنوعیت (Gerekli Olmak, Zorunda Olmak, -malı/-meli, Yasak)',
    subtitle: 'Foundation · بیان «باید»، «مجبور بودن»، «نیازی نیست» و «ممنوع است»',
    situation: 'قوانین محیط کار یا شهر، کارهای ضروری امروز و ممنوعیت‌ها را با ساختارهای دقیق بیان می‌کنید.',
    teachingFa: 'در ترکی استانبولی سه ساختار اصلی برای «باید» وجود دارد: ۱) پسوند وجوبی -malı/-meli روی ریشهٔ فعل (gitmeliyim = باید بروم)؛ ۲) ساختار «مصدر کوتاه (-ma/-me) + پسوند ملکی + gerekiyor / lazım» (gitmem gerekiyor = لازم است بروم)؛ ۳) برای اجبار بیرونی قوی از «مصدر کامل (-mak/-mek) + zorundayım / zorunda» استفاده می‌شود (kalmak zorundayım = مجبورم بمانم). دقت کنید: «gitmemeli» یعنی «نباید برود» (منع)، اما «gitmesine gerek yok / gitmek zorunda değil» یعنی «لازم نیست برود»؛ و برای ممنوعیت رسمی واژهٔ «yasak» به کار می‌رود.',
    rows: [
      ['Uçağı kaçırmamak için evden erken çıkmalıyız.', 'برای اینکه از هواپیما جا نمانیم باید زود از خانه بیرون بزنیم.', 'اوچائِی کاچِیرماماک ایچین اِودَن اَرکَن چِیکمالِییِیز', 'çıkmalıyız', 'باید بیرون برویم', 'ریشه + -malı/-meli + پسوند شخصی'],
      ['Yarın sabaha kadar bu sözleşmeyi imzalamam gerekiyor.', 'تا فردا صبح لازم است این قرارداد را امضا کنم.', 'یارِین ساباها کادار بو سوزلَشمِیی ایمزالامام گِرِکییور', 'gerekiyor', 'لازم است / ضرورت دارد', 'مصدر -ma/-me + ملکی + gerekiyor'],
      ['Şiddetli kar yüzünden bu gece otelde kalmak zorundayız.', 'به خاطر برف شدید مجبوریم امشب در هتل بمانیم.', 'شیددَتلی کار یوزوندَن بو گِجه اوتَلده کالماک زوروندایِیز', 'zorundayız', 'مجبور هستیم', '-mak/-mek zorunda olmak = اجبار بیرونی'],
      ['Kapalı alanlarda sigara içmek kesinlikle yasaktır.', 'کشیدن سیگار در فضاهای بسته اکیداً ممنوع است.', 'کاپالِی آلانلاردا سیگارا ایچمَک کِسینلیکله یاساکتِیر', 'yasaktır', 'ممنوع است', 'مصدر -mak/-mek + yasak(tır)'],
      ['Hafta sonu ofise gelmene gerek yok, evden çalışabilirsin.', 'آخر هفته نیازی نیست به دفتر بیایی، می‌توانی از خانه کار کنی.', 'هافتا سونو اوفیسه گَلمِنه گِرَک یوک، اِودَن چالِیشابیلیرسین', 'gerek yok', 'نیازی نیست', '-ma/-me + ملکی + -(y)a/-(y)e gerek yok'],
      ['İlaç kullanırken greyfurt suyu içmemelisiniz.', 'هنگام مصرف دارو نباید آب گریپ‌فروت بنوشید.', 'ایلاچ کوللانِیرکَن گرِیفورت سویو ایچمِمِلیسینیز', 'içmemelisiniz', 'نباید بنوشید', 'منفی -malı/-meli با -mamalı/-memeli = نباید'],
      ['Başvuru için pasaport fotokopisi getirmek gerekli.', 'برای ثبت‌نام آوردن کپی گذرنامه ضروری است.', 'باشوورو ایچین پاساپورت فوتوکوپیسی گِتیرمَک گِرَکلی', 'gerekli', 'ضروری / لازم'],
      ['Müze içinde flaşla fotoğraf çekmek yasak.', 'عکاسی با فلاش در داخل موزه ممنوع است.', 'موزه ایچینده فلاشلا فوتوئراف چَکمَک یاساک', 'yasak', 'ممنوع'],
    ],
    dialogue: [
      ['پریسا', 'Kütüphaneye üye olmak için hangi belgeleri getirmeliyim?', 'برای عضویت در کتابخانه چه مدارکی باید بیاورم؟'],
      ['کارمند', 'Kimlik kartınızı göstermeniz gerekiyor ve bir form doldurmalısınız.', 'لازم است کارت شناسایی‌تان را نشان بدهید و باید یک فرم پر کنید.'],
      ['پریسا', 'Kayıt ücreti ödemek zorunda mıyım?', 'آیا مجبورم هزینهٔ ثبت‌نام پرداخت کنم؟'],
      ['کارمند', 'Hayır, öğrenciler için ücret ödemeye gerek yok; sadece salonda yüksek sesle konuşmak yasak.', 'نه، برای دانشجویان نیازی به پرداخت هزینه نیست؛ فقط بلند صحبت کردن در سالن ممنوع است.'],
    ],
    checks: [
      {
        promptFa: 'تفاوت «gelmemelisin» و «gelmene gerek yok» در چیست؟',
        choices: ['اولی یعنی «نباید بیایی» و دومی یعنی «لازم نیست بیایی»', 'هر دو یعنی «حتماً بیا»', 'اولی زمان گذشته و دومی زمان آینده است'],
        correctIndex: 0,
        explanationFa: '-mamalı/-memeli منع و نهی (نباید) را بیان می‌کند، اما gerek yok نبودِ ضرورت (لازم نیست) را نشان می‌دهد.',
      },
      {
        promptFa: 'کدام ساختار برای بیان اجبار قوی بیرونی («مجبوریم بمانیم») به کار می‌رود؟',
        choices: ['kalmak zorundayız', 'kalmayı severiz', 'kalmış oluruz'],
        correctIndex: 0,
        explanationFa: 'ساختار «مصدر کامل + zorunda olmak» معادل دقیق «مجبور بودن» در اثر شرایط بیرونی است.',
      },
    ],
  },

  /* ۱۲. بیان توصیه و پیشنهاد (Gereklilik Kipi، پیشنهاد با -malı/-meli و ساختارهای رایج) */
  {
    id: 'tr-a2-f-12-advice-suggestions',
    title: 'بیان توصیه و پیشنهاد (Gereklilik Kipi، پیشنهاد با -malı/-meli و ساختارهای رایج)',
    subtitle: 'Foundation · توصیهٔ دوستانه با -malı/-meli، پیشنهاد مشترک با -(y)alım/-(y)elim و ne dersin',
    situation: 'به دوست یا همکارتان توصیهٔ مفید می‌دهید یا برای انجام کاری مشترک پیشنهاد مؤدبانه مطرح می‌کنید.',
    teachingFa: 'برای توصیه به مخاطب از وجوه ملایم‌تری مانند «bence ... -malısın/-melisin» (به نظرم بهتر است...)، «... tavsiye ederim / öneririm» (توصیه می‌کنم) یا «... iyi olur» (خوب می‌شود اگر...) استفاده می‌کنیم. برای پیشنهاد دو یا چندنفره («بیا ... کنیم! / چطور است ... کنیم؟») نیز وجه التزامی اول‌شخص جمع -(y)alım / -(y)elim و پرسش «-(y)alım mı?» یا «... yapmaya ne dersin?» بسیار پرکاربرد است: Biraz hava alalım mı?',
    rows: [
      ['Bence bu fırsatı kaçırmamalısın, hemen başvurmalısın.', 'به نظرم نباید این فرصت را از دست بدهی، بهتر است همین حالا اقدام کنی.', 'بَنجه بو فِیرساتِی کاچِیرمامالِیسِین، هِمَن باشوورمالِیسِین', 'başvurmalısın', 'باید / بهتر است اقدام کنی', 'توصیهٔ دوستانه با bence + -malısın'],
      ['Boğaz’ın ağrıyorsa ılık ıhlamur çayı içmeni tavsiye ederim.', 'اگر گلویت درد می‌کند توصیه می‌کنم دمنوش نمدار ولرم بنوشی.', 'بوئازِین آئرِییورسا ایْلِیک ایهلامور چایِی ایچمِنی تاوسییه اِدَریم', 'tavsiye ederim', 'توصیه می‌کنم', '-manı/-meni tavsiye ederim'],
      ['Hava çok güzel; sahilde biraz yürüyelim mi?', 'هوا خیلی خوب است؛ کمی در ساحل قدم بزنیم؟', 'هاوا چوک گوزَل؛ ساهیلده بیراز یورویِلیم می', 'yürüyelim mi', 'قدم بزنیم؟ (پیشنهاد)', 'پیشنهاد مشترک با -(y)alım/-(y)elim mi'],
      ['Akşam yemeğinden sonra sinemaya gitmeye ne dersin?', 'نظرت چیست بعد از شام به سینما برویم؟', 'آکشام یِمَییندَن سونرا سینِمایا گیتمِیه نِ دَرسین', 'ne dersin', 'چه می‌گویی / نظرت چیست؟', '-maya/-meye ne dersin?'],
      ['Sınavdan önce son konuları birlikte tekrar edelim.', 'قبل از امتحان بیا مبحث‌های آخر را با هم مرور کنیم.', 'سِیناودان اونجه سون کونولارِی بیرلیکته تِکرار اِدِلیم', 'tekrar edelim', 'بیایید مرور کنیم'],
      ['İstanbul’a gidersen mutlaka Tarihi Yarımada’yı görmelisin.', 'اگر به استانبول رفتی حتماً باید شبه‌جزیرهٔ تاریخی را ببینی.', 'ایستانبولا گیدَرسَن موتلاکا تاریهی یارِیم‌آدایِی گورمِلیسین', 'görmelisin', 'باید ببینی (پیشنهاد مؤکد)'],
      ['Gözlerin yorulduysa ekran karşısında kısa bir mola versen iyi olur.', 'اگر چشمانت خسته شده خوب است جلوی صفحهٔ نمایش استراحت کوتاهی بکنی.', 'گوزلَرین یورولدویسا اِکران کارشِیسِیندا کِیسا بیر مولا وَرسَن ایی اولور', 'iyi olur', 'خوب می‌شود / بهتر است', '-sa/-se + iyi olur برای توصیهٔ نرم'],
      ['İstersen bu konuyu yarın sakin kafayla tekrar konuşabiliriz.', 'اگر بخواهی می‌توانیم فردا با خیال آسوده دوباره دربارهٔ این موضوع حرف بزنیم.', 'ایستَرسَن بو کونویو یارِین ساکین کافایلا تِکرار کونوشابیلیریز', 'istersen', 'اگر بخواهی (پیشنهاد محترمانه)'],
    ],
    dialogue: [
      ['آرزو', 'Hafta sonu evde sıkılmak istemiyorum, ne yapalım?', 'نمی‌خواهم آخر هفته در خانه حوصله‌ام سر برود، چه کار کنیم؟'],
      ['تایان', 'Sabah vapurla Büyükada’ya geçmeye ne dersin?', 'نظرت چیست صبح با کشتی به جزیرهٔ بویوک‌آدا برویم؟'],
      ['آرزو', 'Çok güzel fikir! Orada bisiklet de kiralayalım mı?', 'فکر خیلی خوبی است! آنجا دوچرخه هم کرایه کنیم؟'],
      ['تایان', 'Evet, ama erken çıkmalıyız; öğleden sonra iskele kalabalık oluyor.', 'بله، اما بهتر است زود راه بیفتیم؛ بعدازظهر اسکله شلوغ می‌شود.'],
    ],
    checks: [
      {
        promptFa: 'کدام جمله یک پیشنهاد مشترک به معنی «کمی در ساحل قدم بزنیم؟» است؟',
        choices: ['Sahilde biraz yürüyelim mi?', 'Sahilde biraz yürüdük mü?', 'Sahilde yürümek yasak mı?'],
        correctIndex: 0,
        explanationFa: 'پسوند -(y)elim همراه با mi پیشنهاد مشترک برای «من و تو / ما» می‌سازد.',
      },
      {
        promptFa: 'عبارت «sinemaya gitmeye ne dersin?» یعنی چه؟',
        choices: ['چرا به سینما نرفتی؟', 'نظرت چیست به سینما برویم؟', 'رفتن به سینما اجباری است.'],
        correctIndex: 1,
        explanationFa: 'ساختار «-maya/-meye ne dersin?» از طبیعی‌ترین راه‌های پیشنهاد دوستانه در ترکی است.',
      },
    ],
  },

  /* ۱۳. بیان توانایی، ناتوانی، امکان و اجازه (-abil/-ebil) */
  {
    id: 'tr-a2-f-13-ability-possibility-permission',
    title: 'بیان توانایی، ناتوانی، امکان و اجازه (-abil/-ebil)',
    subtitle: 'Foundation · چهار کاربرد -abil/-ebil و تفاوت ناتوانی (-ama/-eme) با عدمِ قطعیت (-mayabilir)',
    situation: 'توانایی مهارت‌ها، امکان رخ‌دادن یک رویداد، عدم توانایی و درخواست یا دادن اجازه را دقیق بیان می‌کنید.',
    teachingFa: 'پسوند -(y)abil / -(y)ebil چهار نقش کلیدی در سطح A2 دارد: ۱) توانایی (yüzebiliyorum = بلدم شنا کنم)؛ ۲) امکان و احتمال (yağmur yağabilir = ممکن است باران ببارد)؛ ۳) اجازه گرفتن و اجازه دادن (girebilir miyim? = می‌توانم وارد شوم؟)؛ ۴) درخواست مؤدبانه (yardım edebilir misiniz?). نکتهٔ طلایی منفی: برای «نمی‌توانم / قادر نیستم» فقط مصوت -(y)a/-(y)e پیش از منفی باقی می‌ماند (gelemem / gelemiyorum = نمی‌توانم بیایم)، اما برای «ممکن است نیایم» از -mayabilir/-meyebilir استفاده می‌شود (gelmeyebilirim = شاید نیایم).',
    rows: [
      ['Artık Türkçe günlük konuşmaları rahatça anlayabiliyorum.', 'دیگر می‌توانم مکالمات روزمرهٔ ترکی را به‌راحتی بفهمم.', 'آرتِیک تورکچه گونلوک کونوشمالارِی راهاتچا آنلایابیلییوروم', 'anlayabiliyorum', 'می‌توانم بفهمم', 'anla- + y + abil + iyor + um (توانایی)'],
      ['Kusura bakma, bu akşam toplantıya katılamıyorum.', 'ببخشید، امشب نمی‌توانم در جلسه شرکت کنم.', 'کوسورا باکما، بو آکشام توپلانتِییا کاتِیلامِییوروم', 'katılamıyorum', 'نمی‌توانم شرکت کنم', 'منفی ناتوانی: katıl + a + mıyor + um'],
      ['Trafik yoğun olduğu için biraz geç kalabilirim.', 'چون ترافیک سنگین است ممکن است کمی دیر برسم.', 'ترافیک یوئون اولدوئو ایچین بیراز گِچ کالابیلیریم', 'kalabilirim', 'ممکن است بمانم / دیر برسم', 'بیان احتمال با -abilir'],
      ['Pardon, buradaki boş sandalyeyi alabilir miyim?', 'ببخشید، می‌توانم صندلی خالیِ اینجا را بردارم؟ (اجازه)', 'پاردون، بوراداکی بوش ساندالیِیی آلابیلیر میییم', 'alabilir miyim', 'می‌توانم بردارم؟ (اجازه)', 'پرسش اجازه با -abilir miyim'],
      ['Şifreyi hatırlayamıyorum, sisteme giriş yapamadım.', 'رمز عبور را به یاد نمی‌آورم، نتوانستم وارد سامانه شوم.', 'شیفرِیی هاتِیرلایامِییوروم، سیستِمه گیریش یاپامادِیم', 'yapamadım', 'نتوانستم انجام دهم', 'گذشتهٔ ناتوانی: yap + a + ma + dım'],
      ['Yarın hava soğuk olabilir, yanına hırka al.', 'فردا ممکن است هوا سرد باشد، همراهت ژاکت بردار.', 'یارِین هاوا سوئوک اولابیلیر، یانِینا هِیرکا آل', 'olabilir', 'ممکن است باشد'],
      ['Müdür bugün şehir dışında; toplantıya katılmayabilir.', 'مدیر امروز خارج از شهر است؛ ممکن است در جلسه شرکت نکند.', 'مودور بوگون شِهیر دِیشِیندا؛ توپلانتِییا کاتِیلمایابیلیر', 'katılmayabilir', 'ممکن است شرکت نکند', 'احتمال منفی: -mayabilir / -meyebilir'],
      ['Formu doldururken bana biraz yardımcı olabilir misiniz?', 'هنگام پر کردن فرم ممکن است کمی به من کمک کنید؟', 'فورمو دولدورورکَن بانا بیراز یاردِیمجِی اولابیلیر میسینیز', 'olabilir misiniz', 'ممکن است باشید / کمک کنید؟'],
    ],
    dialogue: [
      ['فرهاد', 'Affedersiniz, pencerenin yanındaki prizi kullanabilir miyim?', 'ببخشید، اجازه هست از پریز کنار پنجره استفاده کنم؟'],
      ['کتابدار', 'Tabii, kullanabilirsiniz ama bu masada telefonla konuşamazsınız.', 'البته، می‌توانید استفاده کنید اما پشت این میز نمی‌توانید با تلفن صحبت کنید.'],
      ['فرهاد', 'Anladım, peki dizüstü bilgisayarımla akşama kadar çalışabilir miyim?', 'متوجه شدم، خب می‌توانم تا عصر با لپ‌تاپم کار کنم؟'],
      ['کتابدار', 'Elbette, salon saat dokuza kadar açık; yağmur yağabilir, şemsiyenizi unutmayın.', 'حتماً، سالن تا ساعت نه باز است؛ ممکن است باران ببارد، چترتان را فراموش نکنید.'],
    ],
    checks: [
      {
        promptFa: 'تفاوت «katılamıyorum» و «katılmayabilirim» در چیست؟',
        choices: ['اولی یعنی «قادر نیستم شرکت کنم» و دومی یعنی «ممکن است شرکت نکنم»', 'هر دو دقیقاً یک معنی دارند', 'اولی آینده و دومی امر است'],
        correctIndex: 0,
        explanationFa: 'در katılamıyorum مصوت -a- ناتوانی قطعی را نشان می‌دهد، اما -mayabilir احتمالِ انجام ندادن (شاید شرکت نکنم) است.',
      },
      {
        promptFa: 'کدام گزینه به معنی «نتوانستم وارد شوم» در گذشته است؟',
        choices: ['giriş yapabildim', 'giriş yapamadım', 'giriş yapacağım'],
        correctIndex: 1,
        explanationFa: 'ساختار «ریشه + -(y)a/-(y)e + -madım/-medim» ناتوانی در گذشته (نتوانستم) را می‌سازد.',
      },
    ],
  },
];

export const TURKISH_A2_FOUNDATION_PART_A = buildTurkishLessons(A2_FOUNDATION_PART_A_SEEDS, 'tr3', 1);
