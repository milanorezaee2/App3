import { buildTurkishLessons, type TurkishLessonSeed } from './turkishSeed';

const B1_SURVIVAL_PART_A_SEEDS: readonly TurkishLessonSeed[] = [
  /* ۱. تعریف خاطرات و تجربه‌های مهم زندگی */
  {
    id: 'tr-b1-s-01-life-memories-milestones',
    title: 'تعریف خاطرات و تجربه‌های مهم زندگی',
    subtitle: 'Survival · روایت نقاط عطف زندگی (dönüm noktası)، مهاجرت، شروع حرفه و درس‌هایی که آموخته‌اید',
    situation: 'در گفتگویی صمیمی یک خاطرهٔ اثرگذار یا نقطهٔ عطف زندگی‌تان و درسی را که از آن گرفته‌اید تعریف می‌کنید.',
    teachingFa: 'برای روایت تجربه‌های مهم در سطح B1 از ترکیب حادثه + احساس درونی + برداشت امروزی استفاده می‌کنیم: «Hayatımın en önemli dönüm noktası... oldu» (مهم‌ترین نقطهٔ عطف زندگی‌ام ... شد)، «O gün yaşadıklarım bana ... öğretti» (آنچه آن روز تجربه کردم به من ... آموخت) و «Geriye dönüp baktığımda...» (وقتی به گذشته برمی‌گردم و نگاه می‌کنم...).',
    rows: [
      ['Tek başıma başka bir şehre taşınmak hayatımın en önemli dönüm noktası oldu.', 'تنهایی نقل مکان کردن به یک شهر دیگر مهم‌ترین نقطهٔ عطف زندگی‌ام شد.', 'تَک باشِیما باشکا بیر شِهره تاشِینماک هایاتِیمِین اَن اونَملی دونوم نوکتاسِی اولدو', 'dönüm noktası', 'نقطهٔ عطف', 'dönüm noktası olmak = نقطهٔ عطف شدن'],
      ['İlk iş günümde yaşadığım heyecanı aradan yıllar geçse de dün gibi hatırlıyorum.', 'هیجانی را که در اولین روز کاری‌ام تجربه کردم هرچند سال‌ها از آن گذشته مثل دیروز به یاد دارم.', 'ایلک ایش گونومده یاشادِیئِیم هِیِجانِی آرادان یِیللار گِچسه دِ دون گیبی هاتِیرلِییوروم', 'dün gibi hatırlıyorum', 'مثل دیروز به یاد می‌آورم', '-sa/-se da/de + dün gibi hatırlamak'],
      ['Geriye dönüp baktığımda o zorlu dönemin beni ne kadar güçlendirdiğini görüyorum.', 'وقتی به عقب برمی‌گردم و نگاه می‌کنم می‌بینم آن دوران دشوار چقدر مرا قوی‌تر کرده است.', 'گِرییه دونوپ باکتِیئِیمدا او زورلو دونَمین بِنی نِ کادار گوچلَندیردییینی گورویوروم', 'geriye dönüp baktığımda', 'وقتی به گذشته نگاه می‌کنم'],
      ['Üniversiteyi kazandığım haberi geldiğinde ailemin gözlerindeki gururu hiç unutamam.', 'وقتی خبر قبولی‌ام در دانشگاه رسید غرورِ توی چشم‌های خانواده‌ام را هرگز نمی‌توانم فراموش کنم.', 'اونیوَرسیتِیی کازاندِیئِیم هابِری گَلدییینده آیلَمین گوزلَریندِکی گورورو هیچ اونوتامام', 'gururu', 'غرور و افتخار را'],
      ['Yurt dışında katıldığım gönüllülük projesi bana sabırlı ve esnek olmayı öğretti.', 'پروژهٔ داوطلبانه‌ای که خارج از کشور در آن شرکت کردم به من صبور و منعطف بودن را آموخت.', 'یورت دِیشِیندا کاتِیلدِیئِیم گونوللولوک پروژِسی بانا سابِیرلِی وِ اَسنَک اولمایِی اوئرَتتی', 'gönüllülük projesi', 'پروژهٔ داوطلبانه'],
      ['Başlangıçta kimseyi tanımıyordum; ancak kısa sürede ömür boyu sürecek dostluklar kurdum.', 'در ابتدا هیچ‌کس را نمی‌شناختم؛ اما در مدت کوتاهی دوستی‌هایی برای تمام عمر ساختم.', 'باشلانگِیچتا کیمسِیی تانِیمِییوردوم؛ آنجاک کِیسا سورِده اومور بویو سورِجَک دوستلوکلار کوردوم', 'ömür boyu', 'در تمام طول عمر'],
      ['Sahneye ilk çıktığım akşam dizlerimin bağı çözülmüştü ama alkışlar başlayınca rahatladım.', 'شبی که اولین بار به روی صحنه رفتم زانوهایم سست شده بود اما با شروع تشویق‌ها آرام شدم.', 'ساهنِیه ایلک چِیکتِیئِیم آکشام دیزلَریمین بائِی چوزولموشتو آما آلکِیشلار باشلایِینجا راهاتلادِیم', 'alkışlar', 'تشویق‌ها / دست زدن‌ها'],
      ['Bu deneyim sayesinde konfor alanımdan çıkmanın ne kadar değerli olduğunu anladım.', 'به لطف این تجربه فهمیدم بیرون آمدن از حاشیهٔ امنم چقدر ارزشمند است.', 'بو دِنِییم سایِسینده کونفور آلانِیمدان چِیکمانِین نِ کادار دَیَرلی اولدوئونو آنلادِیم', 'konfor alanımdan', 'از حاشیهٔ امنم'],
    ],
    dialogue: [
      ['پریسا', 'Hayatında seni en çok değiştiren deneyim neydi?', 'تجربه‌ای که در زندگی بیش از همه تو را تغییر داد چه بود؟'],
      ['امره', 'Yirmi iki yaşındayken altı aylığına değişim öğrencisi olarak yurt dışına gitmem en büyük dönüm noktamdı.', 'وقتی بیست‌ودو ساله بودم رفتنم به عنوان دانشجوی تبادلی برای شش ماه به خارج، بزرگ‌ترین نقطهٔ عطفم بود.'],
      ['پریسا', 'İlk haftalarda uyum sağlamak zor olmadı mı?', 'در هفته‌های اول وفق پیدا کردن دشوار نبود؟'],
      ['امره', 'Elbette zorlandım; ancak geriye dönüp baktığımda kendi ayakları üzerinde durmayı tam da orada öğrendiğimi görüyorum.', 'البته که به زحمت افتادم؛ اما وقتی به گذشته نگاه می‌کنم می‌بینم روی پای خود ایستادن را دقیقاً همان‌جا یاد گرفتم.'],
    ],
    checks: [
      {
        promptFa: 'اصطلاح «dönüm noktası» در روایت تجربه‌های زندگی یعنی چه؟',
        choices: ['نقطهٔ عطف و دگرگونی مهم زندگی', 'ایستگاه پایانی اتوبوس', 'تعطیلات آخر هفته'],
        correctIndex: 0,
        explanationFa: 'dönüm noktası اصطلاح دقیق برای رویدادهایی است که مسیر زندگی انسان را تغییر می‌دهند.',
      },
      {
        promptFa: 'عبارت «kendi ayakları üzerinde durmak» به چه معناست؟',
        choices: ['روی پای خود ایستادن و مستقل بودن', 'پیاده‌روی طولانی کردن', 'منتظر کمک دیگران ماندن'],
        correctIndex: 0,
        explanationFa: 'این کنایه در ترکی استانبولی دقیقاً مانند فارسی به معنای استقلال فردی و مالی است.',
      },
    ],
  },

  /* ۲. شرح مشکلات و ارائه راه‌حل */
  {
    id: 'tr-b1-s-02-describing-problems-offering-solutions',
    title: 'شرح مشکلات و ارائه راه‌حل',
    subtitle: 'Survival · ریشه‌یابی مشکل (sorunun kaynağı)، ارائهٔ راهکار عملی و پیشگیری از تکرار آن',
    situation: 'در محیط کار یا زندگی شهری ریشهٔ یک مشکل را تحلیل می‌کنید و چند راهکار عملی و مرحله‌ای پیشنهاد می‌دهید.',
    teachingFa: 'چارچوب حرفه‌ای حل مسئله در سطح B1: ۱) تشخیص ریشه: «Sorunun temel kaynağı...» (منشأ اصلی مشکل...)؛ ۲) پیشنهاد راهکار موقت و دائمی: «Geçici bir önlem olarak..., kalıcı çözüm için ise...»؛ ۳) ارزیابی کارایی: «Bu adım darboğazı ortadan kaldıracaktır» (این گام گلوگاه را برطرف خواهد کرد).',
    rows: [
      ['Teslimatlardaki gecikmenin temel kaynağı depo ile kargo birimi arasındaki iletişim kopukluğudur.', 'منشأ اصلی تأخیر در تحویل‌ها ناهماهنگی ارتباطی میان انبار و واحد ارسال است.', 'تِسلیماتلارداکی گِجیکمِنین تِمَل کاینائِی دِپو ایله کارگو بیریمی آراسِینداکی ایلِتیشیم کوپوکلوئودور', 'iletişim kopukluğudur', 'گسست / ناهماهنگی ارتباطی است', 'sorunun temel kaynağı ... -dır'],
      ['Kalıcı bir çözüm üretmek için öncelikle hata kayıtlarını ayrıntılı biçimde incelemeliyiz.', 'برای تولید یک راه‌حل ماندگار نخست باید گزارش‌های خطا را با جزئیات بررسی کنیم.', 'کالِیجِی بیر چوزوم اورَتمَک ایچین اونجِلیکله هاتا کایِیتلارِینِی آیرِینتِیلِی بیچیمده اینجِلِمِلیییز', 'kalıcı bir çözüm', 'یک راه‌حل ماندگار / ریشه‌ای', 'kalıcı çözüm در برابر geçici önlem'],
      ['Geçici bir önlem olarak yoğun saatlerde gişeye iki destek personeli yönlendirebiliriz.', 'به عنوان یک اقدام موقت می‌توانیم در ساعات شلوغ دو نیروی پشتیبان به باجه بفرستیم.', 'گِچیجی بیر اونلَم اولاراک یوئون ساعاتلَرده گیشِیه ایکی دَستَک پَرسونِلی یونلَندیرِبیلیریز', 'geçici bir önlem', 'یک تدبیر / اقدام موقت'],
      ['Ortak bir takip tablosu oluşturursak görev tekrarlarını tamamen ortadan kaldırırız.', 'اگر یک جدول پیگیری مشترک بسازیم دوباره‌کاری‌ها را کاملاً از میان برمی‌داریم.', 'اورتاک بیر تاکیپ تابلوسو اولوشتورورساک گورَو تِکرارلارِینِی تامامَن اورتادان کالدِیرِیرِیز', 'ortadan kaldırırız', 'از میان برمی‌داریم / برطرف می‌کنیم'],
      ['Aynı aksaklığın tekrar yaşanmaması adına haftalık kontrol listesi hazırlamayı öneriyorum.', 'به منظور تکرار نشدن همین اختلال، تهیهٔ فهرست بازبینی هفتگی را پیشنهاد می‌کنم.', 'آینِی آکساکلِیئِین تِکرار یاشانماماسِی آدِینا هافتالِیک کونترول لیستِسی هازِیرلامایِی اونَرییوروم', 'yaşanmaması adına', 'به منظور رخ ندادنِ مجدد'],
      ['Bütçeyi aşmadan uygulanabilecek en pratik alternatif mevcut yazılımı güncellemektir.', 'عملی‌ترین جایگزینی که بدون عبور از بودجه قابل اجراست به‌روزرسانی نرم‌افزار موجود است.', 'بوتچِیی آشمادان اویگولانابیلِجَک اَن پراتیک آلتَرناتیف مَوجوت یازِیلِیمِی گونجَللِمَکتیر', 'uygulanabilecek', 'قابل اجرا / که بتوان اجرا کرد'],
      ['Müşterilerin yaşadığı mağduriyeti gidermek için ücretsiz uzatma paketi tanımladık.', 'برای جبران خسارت/نارضایتی مشتریان، بستهٔ تمدید رایگان تعریف کردیم.', 'موشتَریلَرین یاشادِیئِی مائدورییِتی گیدَرمَک ایچین اوجرَتسیز اوزاتما پاکِتی تانِیملادِیک', 'gidermek için', 'برای برطرف کردن / جبران کردن'],
      ['Önerdiğimiz yöntem devreye alındığında işlem süresi yarı yarıya kısalacaktır.', 'وقتی روش پیشنهادی ما وارد مدار شود زمان انجام کار به نصف کاهش خواهد یافت.', 'اونَردیییمیز یونتَم دَورِیه آلِیندِیئِیندا ایشلَم سورِسی یارِی یارِییا کِیسالاجاکتِیر', 'devreye alındığında', 'وقتی به کار گرفته شود / فعال شود'],
    ],
    dialogue: [
      ['سامان', 'Son haftalarda çağrı merkezimizde bekleme süreleri çok uzadı; sence bu durumu nasıl aşabiliriz?', 'در هفته‌های اخیر زمان انتظار در مرکز تماس ما خیلی طولانی شده؛ به نظرت چطور می‌توانیم از این وضعیت عبور کنیم؟'],
      ['پینار', 'İncelediğimde aramaların yarısının şifre yenileme gibi basit işlemler için yapıldığını gördüm.', 'وقتی بررسی کردم دیدم نیمی از تماس‌ها برای کارهای ساده‌ای مثل بازیابی رمز انجام می‌شود.'],
      ['سامان', 'O halde sorunun kaynağı sesli yanıt menüsünün yeterince yönlendirici olmaması, değil mi?', 'پس ریشهٔ مشکل این است که منوی پاسخ صوتی به اندازهٔ کافی راهنما نیست، درست است؟'],
      ['پینار', 'Kesinlikle! Kalıcı bir çözüm olarak mobil uygulamaya tek tuşla şifre sıfırlama özelliği eklersek çağrı yükü hızla düşer.', 'دقیقاً! به عنوان یک راه‌حل ماندگار اگر قابلیت بازنشانی رمز با یک دکمه را به اپ موبایل اضافه کنیم بار تماس‌ها سریع پایین می‌آید.'],
    ],
    checks: [
      {
        promptFa: 'تفاوت «geçici önlem» و «kalıcı çözüm» در حل مسئله چیست؟',
        choices: ['اولی اقدام موقت مسکّن است و دومی راه‌حل ریشه‌ای و ماندگار', 'هر دو به معنی نادیده گرفتن مشکل هستند', 'اولی برای آینده و دومی فقط برای گذشته است'],
        correctIndex: 0,
        explanationFa: 'geçici یعنی گذرا و موقت، در حالی که kalıcı یعنی ماندگار و پایدار.',
      },
      {
        promptFa: 'عبارت «iletişim kopukluğu» چه مشکلی را توصیف می‌کند؟',
        choices: ['ناهماهنگی و گسست ارتباطی میان افراد یا واحدها', 'سرعت بالای اینترنت', 'امضای قرارداد جدید'],
        correctIndex: 0,
        explanationFa: 'kopukluk یعنی گسست؛ iletişim kopukluğu اصطلاح رایج برای نبودِ هماهنگی و اطلاع‌رسانی درست است.',
      },
    ],
  },

  /* ۳. بیان نظر درباره مسائل اجتماعی و روزمره */
  {
    id: 'tr-b1-s-03-opinions-social-everyday-issues',
    title: 'بیان نظر درباره مسائل اجتماعی و روزمره',
    subtitle: 'Survival · گفتگو دربارهٔ محیط‌زیست، ترافیک شهری، آموزش، تعادل کار و زندگی و مسئولیت شهروندی',
    situation: 'دربارهٔ موضوعات روز جامعه مانند بازیافت، حمل‌ونقل عمومی، گرانی مسکن یا فرهنگ مطالعه دیدگاه مستدل بیان می‌کنید.',
    teachingFa: 'واژگان کلیدی گفتگوهای اجتماعی در سطح B1: toplumsal farkındalık (آگاهی اجتماعی)، çevre kirliliği (آلودگی محیط‌زیست)، geri dönüşüm (بازیافت)، fırsat eşitliği (برابری فرصت‌ها)، yaşam kalitesi (کیفیت زندگی) و iş-yaşam dengesi (تعادل کار و زندگی). برای طرح نظر معتدل از «Bana göre bu sorunun hem bireysel hem kurumsal boyutu var» بهره می‌گیریم.',
    rows: [
      ['Geri dönüşüm konusunda toplumsal farkındalık artmadıkça atık sorununu çözmek zordur.', 'تا زمانی که آگاهی اجتماعی دربارهٔ بازیافت بالا نرود حل کردن مشکل پسماند دشوار است.', 'گِری دونوشوم کونوسوندا توپلومسال فارکِیندالِیک آرتمادِیکچا آتِیک سورونونو چوزمَک زوردور', 'toplumsal farkındalık', 'آگاهی اجتماعی', '-madıkça/-medikçe = تا وقتی که ... نشود'],
      ['Toplu taşıma ağının güçlendirilmesi hem hava kirliliğini azaltır hem zaman kazandırır.', 'تقویت شبکهٔ حمل‌ونقل عمومی هم آلودگی هوا را کم می‌کند و هم در زمان صرفه‌جویی می‌کند.', 'توپلو تاشِیما آئِینِین گوچلَندیریلمِسی هَم هاوا کیرلیلییینی آزالتِیر هَم زامان کازاندِیرِیر', 'hava kirliliğini', 'آلودگی هوا را'],
      ['Modern çalışma hayatında iş-yaşam dengesini korumak ruh sağlığı açısından hayati önem taşıyor.', 'در زندگی کاری مدرن حفظ تعادل کار و زندگی از نظر سلامت روان اهمیت حیاتی دارد.', 'مودَرن چالِیشما هایاتِیندا ایش یاشام دَنگِسینی کوروماک روه سائلِیئِی آچِیسِیندان هایاتی اونَم تاشِییور', 'hayati önem taşıyor', 'اهمیت حیاتی دارد', 'önem taşımak = دارای اهمیت بودن'],
      ['Eğitimde fırsat eşitliği sağlandığında gençlerin yetenekleri çok daha erken ortaya çıkar.', 'وقتی برابری فرصت‌ها در آموزش فراهم شود استعدادهای جوانان بسیار زودتر شکوفا می‌شود.', 'اَییتیمده فِیرسات اِشیتلییی سائلاندِیئِیندا گَنچلَرین یِتِنَکلَری چوک داها اَرکَن اورتایا چِیکار', 'fırsat eşitliği', 'برابری فرصت‌ها'],
      ['Tek kullanımlık plastiklerin sınırlandırılması doğayı korumak için atılmış olumlu bir adımdır.', 'محدود شدن پلاستیک‌های یک‌بارمصرف گام مثبتی است که برای حفاظت از طبیعت برداشته شده است.', 'تَک کوللانِیملِیک پلاستیکلَرین سِینِیرلاندِیرِیلماسِی دوئایِی کوروماک ایچین آتِیلمِیش اولوملو بیر آدِیمدِیر', 'tek kullanımlık', 'یک‌بارمصرف'],
      ['Mahalle kültürünün yaşatılması büyük şehirlerdeki yalnızlık hissini önemli ölçüde azaltıyor.', 'زنده نگه داشتن فرهنگ محله احساس تنهایی در کلان‌شهرها را تا حد قابل توجهی کم می‌کند.', 'ماهالله کولتورونون یاشاتِیلماسِی بویوک شِهیرلَردِکی یالنِیزلِیک هیسسینی اونَملی اولچوده آزالتِییور', 'yalnızlık hissini', 'احساس تنهایی را'],
      ['Ücretsiz halk kütüphanelerinin yaygınlaşması her yaştan insanın bilgiye erişimini kolaylaştırır.', 'گسترش کتابخانه‌های عمومی رایگان دسترسی انسان‌ها از هر سن را به دانش آسان‌تر می‌کند.', 'اوجرَتسیز هالک کوتوپهانِلَرینین یایگِینلاشماسِی هَر یاشتان اینسانِین بیلگییه اِریشیمینی کولایلاشتِیرِیر', 'bilgiye erişimini', 'دسترسی به دانش را'],
      ['Bana göre şehir planlamasında yayaların ve engelli bireylerin ihtiyaçları ilk sırada yer almalıdır.', 'از دید من در شهرسازی نیازهای عابران پیاده و افراد دارای معلولیت باید در ردیف نخست جای بگیرد.', 'بانا گوره شِهیر پلانلاماسِیندا یایالارِین وِ اَنگَللی بیرَیلَرین ایهتییاچلارِی ایلک سِیرادا یَر آلمالِیدِیر', 'ilk sırada yer almalıdır', 'باید در جایگاه نخست قرار گیرد'],
    ],
    dialogue: [
      ['پری', 'Büyük şehirlerde yaşam kalitesini artırmak için sence en öncelikli adım ne olmalı?', 'به نظر تو برای بالا بردن کیفیت زندگی در شهرهای بزرگ اولویت‌دارترین گام چه باید باشد؟'],
      ['تولگا', 'Bence raylı sistemlerin yaygınlaştırılması ve yaya alanlarının genişletilmesi ilk sırada yer almalı.', 'به نظر من گسترش خطوط ریلی و وسیع‌تر کردن فضاهای پیاده باید در ردیف اول قرار گیرد.'],
      ['پری', 'Kesinlikle katılıyorum; peki çevre temizliği konusunda bireylere ne düşüyor?', 'کاملاً موافقم؛ خب دربارهٔ پاکیزگی محیط‌زیست چه وظیفه‌ای بر عهدهٔ تک‌تک افراد است؟'],
      ['تولگا', 'Tek kullanımlık ürünleri azaltmak ve atıkları kaynağında ayrıştırmak herkesin günlük alışkanlığı hâline gelmeli.', 'کاهش محصولات یک‌بارمصرف و تفکیک زباله از مبدأ باید به عادت روزانهٔ همه تبدیل شود.'],
    ],
    checks: [
      {
        promptFa: 'پسوند قیدی منفی «-madıkça / -medikçe» در «farkındalık artmadıkça» چه معنایی دارد؟',
        choices: ['تا زمانی که (آگاهی) افزایش نیابد / مگر اینکه افزایش یابد', 'به محض اینکه افزایش یافت', 'چون قبلاً افزایش یافته بود'],
        correctIndex: 0,
        explanationFa: 'ساختار منفی -madıkça/-medikçe شرط لازمِ منفی («تا وقتی که ... نشود») را بیان می‌کند.',
      },
      {
        promptFa: 'عبارت «fırsat eşitliği» در مباحث اجتماعی یعنی چه؟',
        choices: ['برابری فرصت‌ها', 'افزایش مالیات', 'تعطیلات تابستانی'],
        correctIndex: 0,
        explanationFa: 'fırsat (فرصت) + eşitlik (برابری) = برابری فرصت‌ها.',
      },
    ],
  },

  /* ۴. شرکت در بحث و دفاع از دیدگاه شخصی */
  {
    id: 'tr-b1-s-04-participating-debates-defending-views',
    title: 'شرکت در بحث و دفاع از دیدگاه شخصی',
    subtitle: 'Survival · نوبت‌گیری محترمانه در بحث، استناد به شواهد، پاسخ به پرسش چالشی و حفظ آرامش گفتگو',
    situation: 'در یک میزگرد کلاسی یا جلسهٔ کاری وارد بحث می‌شوید، رشتهٔ کلام را محترمانه می‌گیرید و از موضع خود دفاع می‌کنید.',
    teachingFa: 'عبارت‌های کلیدی مشارکت در بحث گروهی: ۱) ورود محترمانه به بحث: «Müsaadenizle bu noktada bir ekleme yapmak istiyorum» (با اجازه‌تان در این نقطه می‌خواهم نکته‌ای اضافه کنم)؛ ۲) برگرداندن بحث به محور اصلی: «Asıl konumuza dönecek olursak...»؛ ۳) دفاع در برابر ایراد: «Bu eleştiriyi haklı bulmakla birlikte şunu unutmamalıyız ki...».',
    rows: [
      ['Müsaadenizle bu noktada tartışmaya farklı bir pencereden katkıda bulunmak istiyorum.', 'با اجازه‌تان می‌خواهم در این نقطه از دریچهٔ متفاوتی به بحث کمک کنم.', 'موساآدِنیزله بو نوکتادا تارتِیشمایا فارکلِی بیر پَنجِرِدَن کاتکِیدا بولونماک ایستییوروم', 'müsaadenizle', 'با اجازهٔ شما (ورود محترمانه به بحث)', 'نوبت‌گیری مؤدبانه در جلسه'],
      ['İddiamı somut bir örnekle desteklemek gerekirse geçen yılki pilot uygulamaya bakabiliriz.', 'اگر بخواهم ادعایم را با یک مثال ملموس پشتیبانی کنم می‌توانیم به اجرای آزمایشی پارسال نگاه کنیم.', 'ایددیامِی سوموت بیر اورنَکله دَستَکلِمَک گِرِکیرسه گِچَن یِیلکی پیلوت اویگولامایا باکابیلیریز', 'somut bir örnekle', 'با یک مثال ملموس / عینی'],
      ['Sözünüzü kesmek istemem ama paylaştığınız rakamlar bir önceki döneme ait.', 'نمی‌خواهم حرفتان را قطع کنم اما ارقامی که به اشتراک گذاشتید متعلق به دورهٔ قبلی است.', 'سوزونوزو کَسمَک ایستِمَم آما پایلاشتِیئِینِیز راکاملار بیر اونجِکی دونِمه آییت', 'sözünüzü kesmek istemem', 'نمی‌خواهم کلامتان را قطع کنم'],
      ['Kaygınızı anlıyorum; ne var ki hiçbir yenilik risk almadan hayata geçirilemez.', 'نگرانی شما را درک می‌کنم؛ منتها هیچ نوآوری‌ای بدون پذیرش ریسک عملی نمی‌شود.', 'کایگِینِیزِی آنلِییوروم؛ نِ وار کی هیچ‌بیر یِنیلیک ریسک آلمادان هایاتا گِچیریلِمَز', 'hayata geçirilemez', 'نمی‌تواند به مرحلهٔ اجرا درآید', 'hayata geçirmek = جامهٔ عمل پوشاندن'],
      ['Asıl konumuza dönecek olursak önceliğimiz kalite standartlarını korumaktır.', 'اگر بخواهیم به موضوع اصلی‌مان برگردیم اولویت ما حفظ استانداردهای کیفیت است.', 'آسِیل کونوموزا دونِجَک اولورساک اونجِلیییمیز کالیته استاندارتلارِینِی کوروماکتِیر', 'dönecek olursak', 'اگر بخواهیم برگردیم', '-acak/-ecek olursak برای انتقال گفتمانی'],
      ['Karşıt görüşleri dinlemek, kendi planımızdaki eksikleri görmemiz açısından çok değerlidir.', 'شنیدن دیدگاه‌های مخالف از نظر دیدن کاستی‌های طرح خودمان بسیار ارزشمند است.', 'کارشِیت گوروشلَری دینلِمَک، کَندی پلانِیمِیزداکی اَکسیکلَری گورمَمیز آچِیسِیندان چوک دَیَرلیدیر', 'karşıt görüşleri', 'دیدگاه‌های مخالف را'],
      ['Bu konuda tek bir doğru olmadığını, koşullara göre esnek davranmak gerektiğini savunuyorum.', 'از این ایده دفاع می‌کنم که در این زمینه یک پاسخ واحد وجود ندارد و باید متناسب با شرایط منعطف عمل کرد.', 'بو کونودا تَک بیر دوئرو اولمادِیئِینِی، کوشوللارا گوره اَسنَک داورانماک گِرَکتییینی ساوونویوروم', 'savunuyorum', 'دفاع می‌کنم / معتقدم'],
      ['Tartışmayı verimli bir noktada toparlamak adına ortak ilkelerimizi yazılı hâle getirelim.', 'به منظور جمع‌بندی بحث در یک نقطهٔ سازنده، اصول مشترکمان را مکتوب کنیم.', 'تارتِیشمایِی وِریملی بیر نوکتادا توپارلاماک آدِینا اورتاک ایلکِلَریمیزی یازِیلِی هاله گِتیرِلیم', 'ortak ilkelerimizi', 'اصول مشترکمان را'],
    ],
    dialogue: [
      ['مدیر نشست', 'Eğitim bütçesinin dağılımı konusunda farklı görüşler var; söz almak isteyen var mı?', 'دربارهٔ توزیع بودجهٔ آموزش دیدگاه‌های متفاوتی هست؛ کسی مایل است صحبت کند؟'],
      ['آرمین', 'Müsaadenizle bir ekleme yapmak istiyorum; bence bütçenin yarısı uygulamalı atölyelere ayrılmalıdır.', 'با اجازه‌تان می‌خواهم نکته‌ای اضافه کنم؛ به نظرم نیمی از بودجه باید به کارگاه‌های عملی اختصاص یابد.'],
      ['ایپک', 'Sözünüzü kesmek istemem ama teorik kaynaklarımız da güncellenmeyi bekliyor.', 'نمی‌خواهم حرفتان را قطع کنم اما منابع تئوری ما هم چشم‌به‌راه به‌روزرسانی است.'],
      ['آرمین', 'Bu ihtiyacı kabul ediyorum; ancak dijital kütüphane aboneliğiyle teorik kaynak sorununu çok düşük maliyetle çözebiliriz.', 'این نیاز را می‌پذیرم؛ اما با اشتراک کتابخانهٔ دیجیتال می‌توانیم مشکل منابع تئوری را با هزینهٔ بسیار پایینی حل کنیم.'],
    ],
    checks: [
      {
        promptFa: 'در یک نشست رسمی برای گرفتن نوبت صحبت کدام عبارت مؤدبانه‌تر و طبیعی‌تر است؟',
        choices: ['Müsaadenizle bu noktada bir ekleme yapmak istiyorum.', 'Herkes sussun ben konuşacağım!', 'Hiçbir fikrim yok ama...'],
        correctIndex: 0,
        explanationFa: 'عبارت «Müsaadenizle bir ekleme yapmak istiyorum» محترمانه‌ترین شکل ورود به بحث گروهی در ترکی است.',
      },
      {
        promptFa: 'اصطلاح «bir projeyi hayata geçirmek» به چه معناست؟',
        choices: ['طرحی را عملی و اجرایی کردن', 'طرحی را بایگانی کردن', 'از طرحی انصراف دادن'],
        correctIndex: 0,
        explanationFa: 'hayata geçirmek یعنی «به مرحلهٔ اجرا درآوردن / جامهٔ عمل پوشاندن».',
      },
    ],
  },

  /* ۵. صحبت درباره اخبار و رویدادهای روز */
  {
    id: 'tr-b1-s-05-news-current-events',
    title: 'صحبت درباره اخبار و رویدادهای روز',
    subtitle: 'Survival · گفتگو دربارهٔ تیتر خبرها (gündem)، تحولات اقتصادی و علمی و سنجش اعتبار منابع خبری',
    situation: 'دربارهٔ خبرهای مهم هفته در حوزه‌های علم، فرهنگ یا اقتصاد با دوستان و همکاران گفتگو و تبادل نظر می‌کنید.',
    teachingFa: 'واژگان پرکاربرد گفتگو دربارهٔ اخبار در ترکیه: gündem (دستور روز / سرخط خبرها)، manşet (تیتر اول)، son dakika gelişmesi (خبر فوری)، kaynak doğrulama (راستی‌آزمایی منبع)، kamuoyu (افکار عمومی) و yankı uyandırmak (بازتاب گسترده داشتن).',
    rows: [
      ['Bu hafta ülke gündeminde en çok konuşulan konu yeni kültür ve teknoloji festivaliydi.', 'این هفته پرحرف‌ترین موضوع در صدر خبرهای کشور، جشنوارهٔ جدید فرهنگ و فناوری بود.', 'بو هافتا اولکه گوندِمینده اَن چوک کونوشولان کونو یِنی کولتور وِ تَکنولوژی فَستیوالییدی', 'ülke gündeminde', 'در صدر خبرهای / دستور روز کشور'],
      ['Sosyal medyada hızla yayılan bir haberi paylaşmadan önce kaynağını mutlaka doğrularım.', 'پیش از بازنشر خبری که در شبکه‌های اجتماعی به‌سرعت پخش می‌شود حتماً منبعش را راستی‌آزمایی می‌کنم.', 'سوسیال مَدیادا هِیزلا یایِیلان بیر هابِری پایلاشمادان اونجه کاینائِینِی موتلاکا دوئرولارِیم', 'doğrularım', 'راستی‌آزمایی / تأیید می‌کنم'],
      ['Türk bilim insanlarının geliştirdiği erken tanı cihazı uluslararası basında geniş yankı uyandırdı.', 'دستگاه تشخیص زودهنگامی که دانشمندان ترک توسعه دادند در مطبوعات بین‌المللی بازتاب گسترده‌ای داشت.', 'تورک بیلیم اینسانلارِینِین گِلیشتیردییی اَرکَن تانِی جیهازِی اولوسلارآراسِی باسِیندا گِنیش یانکِی اویاندِیردِی', 'geniş yankı uyandırdı', 'بازتاب گسترده‌ای برانگیخت', 'yankı uyandırmak = بازتاب داشتن در رسانه'],
      ['Merkez bankasının açıkladığı son veriler piyasalarda iyimser bir hava estirdi.', 'آخرین داده‌هایی که بانک مرکزی اعلام کرد فضای خوش‌بینانه‌ای در بازارها ایجاد کرد.', 'مَرکَز بانکاسِینِین آچِیکلادِیئِی سون وِریلَر پییاسالاردا ایییمسَر بیر هاوا اَستیردی', 'iyimser', 'خوش‌بینانه', 'iyimser (خوش‌بین) در برابر kötümser (بدبین)'],
      ['Sabah gazetelere göz atarken arkeolojik kazıyla ilgili çok ilginç bir röportaja rastladım.', 'صبح هنگام ورق زدن روزنامه‌ها به مصاحبهٔ بسیار جالبی دربارهٔ کاوش باستان‌شناسی برخوردم.', 'ساباه گازِتِلَره گوز آتارکَن آرکِئولوژیک کازِییلا ایلگیلی چوک ایلگینچ بیر روپورتاژا راستلادِیم', 'göz atarken', 'هنگام نگاهی اجمالی انداختن'],
      ['Son dakika gelişmesine göre fırtına nedeniyle Boğaz trafiği çift yönlü olarak askıya alındı.', 'طبق خبر فوری، به علت طوفان تردد دریایی تنگهٔ بسفر در هر دو جهت موقتاً متوقف شد.', 'سون داکیکا گِلیشمِسینه گوره فِیرتِینا نِدِنییله بوئاز ترافییی چیفت یونلو اولاراک آسکِییا آلِیندِی', 'askıya alındı', 'به حالت تعلیق درآمد', 'askıya almak = موقتاً متوقف/معلق کردن'],
      ['Kamuoyu araştırmaları vatandaşların çevre dostu projelere büyük destek verdiğini gösteriyor.', 'نظرسنجی‌های افکار عمومی نشان می‌دهد شهروندان از پروژه‌های دوستدار محیط‌زیست حمایت زیادی می‌کنند.', 'کامواویو آراشتِیرمالارِی واتانداشلارِین چَوره دوستو پروژِلَره بویوک دَستَک وَردییینی گوستِرییور', 'kamuoyu', 'افکار عمومی'],
      ['Farklı haber kanallarını takip etmek olayları tek taraflı değerlendirmemizi önler.', 'دنبال کردن شبکه‌های خبری گوناگون از ارزیابی یک‌طرفهٔ رویدادها جلوگیری می‌کند.', 'فارکلِی هابَر کاناللارِینِی تاکیپ اِتمَک اولایلارِی تَک تارافلِی دَیَرلَندیرمَمیزی اونلَر', 'tek taraflı', 'یک‌جانبه / یک‌طرفه'],
    ],
    dialogue: [
      ['بهزاد', 'Bugünkü haberlere bakabildin mi? Göbeklitepe yakınlarında yeni buluntular ortaya çıkarılmış.', 'توانستی به خبرهای امروز نگاهی بیندازی؟ در نزدیکی گوبکلی‌تپه یافته‌های جدیدی کشف شده است.'],
      ['دنیز', 'Evet, sabah bültende izledim; keşif dünya basınında da büyük yankı uyandırmış.', 'بله، صبح در بخش خبری تماشا کردم؛ این کشف در مطبوعات جهان هم بازتاب بزرگی داشته است.'],
      ['بهزاد', 'Bölgenin ziyarete ne zaman açılacağı konusunda resmi bir açıklama var mı?', 'آیا دربارهٔ اینکه آن بخش کی برای بازدید باز می‌شود توضیح رسمی وجود دارد؟'],
      ['دنیز', 'Kültür Bakanlığı, koruma çatısı tamamlandıktan sonra gelecek baharda ziyarete açılacağını duyurdu.', 'وزارت فرهنگ اعلام کرد که پس از تکمیل سقف حفاظتی، بهار آینده به روی بازدیدکنندگان گشوده خواهد شد.'],
    ],
    checks: [
      {
        promptFa: 'اصطلاح رسانه‌ای «geniş yankı uyandırmak» یعنی چه؟',
        choices: ['بازتاب و واکنش گسترده‌ای برانگیختن', 'بی‌سر‌و‌صدا فراموش شدن', 'پخش رادیویی را قطع کردن'],
        correctIndex: 0,
        explanationFa: 'yankı یعنی پژواک و بازتاب؛ geniş yankı uyandırmak اصطلاح معیار برای خبرهای پربازتاب است.',
      },
      {
        promptFa: 'عبارت «askıya alındı» در خبر تردد کشتی‌ها چه معنایی دارد؟',
        choices: ['موقتاً متوقف / به حالت تعلیق درآورده شد', 'برای همیشه دو برابر شد', 'رایگان اعلام شد'],
        correctIndex: 0,
        explanationFa: 'askıya almak در زبان اداری و خبری یعنی «موقتاً معلق کردن».',
      },
    ],
  },

  /* ۶. توصیف دقیق افراد، مکان‌ها و موقعیت‌ها */
  {
    id: 'tr-b1-s-06-detailed-descriptions-people-places',
    title: 'توصیف دقیق افراد، مکان‌ها و موقعیت‌ها',
    subtitle: 'Survival · ترسیم ویژگی‌های شخصیتی، فضای معماری و حال‌وهوای یک مکان با صفات ترکیبی',
    situation: 'شخصیت یک همکار، فضای یک محلهٔ تاریخی یا جوّ حاکم بر یک رویداد را با جزئیات زنده توصیف می‌کنید.',
    teachingFa: 'در سطح B1 برای توصیف دقیق از صفات مرکب ملکی و پسوندهای سازندهٔ صفت بهره می‌گیریم: ۱) صفات شخصیتی دقیق: «özgüvenli» (بااعتمادبه‌نفس)، «anlayışlı» (باگذشت/فهمیده)، «çözüm odaklı» (راه‌حل‌محور)، «sıcakkanlı» (خون‌گرم)؛ ۲) توصیف مکان با گروه صفتی: «yüksek tavanlı tarihi bina» (ساختمان تاریخی بلندسقف)، «cana yakın atmosfer» (فضای صمیمی).',
    rows: [
      ['Yeni ekip arkadaşımız kriz anlarında bile sakinliğini koruyan, çözüm odaklı bir insan.', 'هم‌تیمی جدید ما انسانی راه‌حل‌محور است که حتی در لحظات بحرانی آرامش خود را حفظ می‌کند.', 'یِنی اِکیپ آرکاداشِیمِیز کریز آنلارِیندا بیله ساکینلییینی کورویان، چوزوم اوداکلِی بیر اینسان', 'çözüm odaklı', 'راه‌حل‌محور', 'اسم + odaklı برای ساخت صفت مرکب'],
      ['Kaldığımız butik otel, yüksek tavanlı odaları ve taş avlusuyla huzur verici bir mekândı.', 'هتل بوتیکی که در آن اقامت داشتیم با اتاق‌های بلندسقف و حیاط سنگی‌اش مکانی آرامش‌بخش بود.', 'کالدِیئِیمِیز بوتیک اوتَل، یوکسَک تاوانلِی اودالارِی وِ تاش آولوسویلا هوزور وِریجی بیر مِکاندِی', 'yüksek tavanlı', 'دارای سقف بلند', 'صفت + اسم + -lı برای توصیف معماری'],
      ['İlk bakışta biraz mesafeli görünse de tanıdıkça ne kadar sıcakkanlı biri olduğunu anlıyorsun.', 'هرچند در نگاه اول کمی رسمی و کم‌حرف به نظر می‌رسد، هرچه بیشتر می‌شناسی‌اش می‌فهمی چقدر خون‌گرم است.', 'ایلک باکِیشتا بیراز مِسافِلی گورونسه دِ تانِیدِیکچا نِ کادار سِیجاک‌کانلِی بیری اولدوئونو آنلِییورسون', 'sıcakkanlı', 'خون‌گرم و صمیمی'],
      ['Balat’ın dar Arnavut kaldırımlı sokakları ve renkli cumbalı evleri fotoğrafçıları büyülüyor.', 'کوچه‌های باریک سنگ‌فرش و خانه‌های شاه‌نشین‌دار رنگارنگ محلهٔ بالات عکاسان را مسحور می‌کند.', 'بالاتِین دار آرناووت کالدِیرِیملِی سوکاکلارِی وِ رَنکلی جومبالِی اَولَری فوتوئرافچِیلارِی بویولویور', 'büyülüyor', 'مسحور / مجذوب می‌کند'],
      ['Toplantıda oldukça samimi ve yapıcı bir atmosfer hâkimdi; herkes fikrini özgürce paylaştı.', 'در جلسه جوی کاملاً صمیمی و سازنده حاکم بود؛ همه نظرشان را آزادانه مطرح کردند.', 'توپلانتِیدا اولدوکچا سامیمی وِ یاپِیجِی بیر آتموسفَر هاکیمدی؛ هَرکَس فیکرینی اوزگورجه پایلاشتِی', 'yapıcı', 'سازنده'],
      ['Detaylara önem veren, sorumluluk sahibi ve sözünün eri bir ustayla çalıştık.', 'با استادکاری کار کردیم که به جزئیات اهمیت می‌دهد، مسئولیت‌پذیر و خوش‌قول است.', 'دِتایلارا اونَم وِرَن، سوروملولوک ساهیبی وِ سوزونون اِری بیر اوستایلا چالِیشتِیک', 'sözünün eri', 'خوش‌قول / پایبند به حرف خود'],
      ['Kuzey kıyısındaki bu sakin koy, el değmemiş doğası ve berrak deniziyle öne çıkıyor.', 'این خلیج آرام در ساحل شمالی با طبیعت بکر و دریای زلالش متمایز می‌شود.', 'کوزَی کِییِیسِینداکی بو ساکین کوی، اَل دَیمِمیش دوئاسِی وِ بَرراک دِنیزییله اونه چِیکِییور', 'el değmemiş', 'بکر / دست‌نخورده'],
      ['Salondaki loş aydınlatma ve hafif klasik müzik dinleyicilerde dingin bir etki bıraktı.', 'نورپردازی ملایم سالن و موسیقی کلاسیک آرام اثری دل‌نشین و آرام بر شنوندگان گذاشت.', 'سالونداکی لوش آیدِینلاتما وِ هافیف کلاسیک موزیک دینلِییجیلَرده دینگین بیر اَتکی بِیراکتِی', 'loş aydınlatma', 'نورپردازی ملایم و کم‌نور'],
    ],
    dialogue: [
      ['مهسا', 'Yeni atanan bölüm yöneticisiyle tanıştın mı; nasıl bir izlenim edindin?', 'با مدیر بخش جدیدی که منصوب شده آشنا شدی؛ چه برداشتی پیدا کردی؟'],
      ['سرکان', 'Evet, dün kısa bir toplantı yaptık; son derece özgüvenli, iletişime açık ve yapıcı biri.', 'بله، دیروز جلسهٔ کوتاهی داشتیم؛ فردی بسیار بااعتمادبه‌نفس، پذیرای گفتگو و سازنده است.'],
      ['مهسا', 'Yeni çalışma ofisimiz nasıl olmuş peki?', 'خب دفتر کار جدیدمان چطور شده است؟'],
      ['سرکان', 'Geniş pencereli, ferah ve bol ışık alan bir kat seçilmiş; eski ofise kıyasla çok daha iç açıcı.', 'طبقه‌ای با پنجره‌های بزرگ، دلباز و پرنور انتخاب شده؛ در مقایسه با دفتر قبلی بسیار دل‌گشاتر است.'],
    ],
    checks: [
      {
        promptFa: 'صفت ترکیبی «el değmemiş doğa» به چه معناست؟',
        choices: ['طبیعت بکر و دست‌نخورده', 'پارک مصنوعی شهری', 'جادهٔ شلوغ'],
        correctIndex: 0,
        explanationFa: 'el değmemiş (که دست به آن نخورده است) اصطلاح رایج برای توصیف طبیعت بکر است.',
      },
      {
        promptFa: 'در توصیف شخصیت افراد، تفاوت «mesafeli» و «sıcakkanlı» چیست؟',
        choices: ['mesafeli یعنی تودار و رسمی، اما sıcakkanlı یعنی خون‌گرم و صمیمی', 'هر دو به معنی عصبانی هستند', 'اولی مکان و دومی زمان است'],
        correctIndex: 0,
        explanationFa: 'mesafeli حفظ‌کنندهٔ فاصلهٔ رسمی در برخورد اول است و sıcakkanlı فرد صمیمی و خون‌گرم.',
      },
    ],
  },

  /* ۷. شرح اهداف تحصیلی و شغلی */
  {
    id: 'tr-b1-s-07-academic-career-goals',
    title: 'شرح اهداف تحصیلی و شغلی',
    subtitle: 'Survival · ترسیم مسیر شغلی (kariyer yolu)، تخصص‌گرایی، ارتقای مهارت و اهداف پژوهشی',
    situation: 'در گفتگو با استاد راهنما، مدیر یا شبکهٔ حرفه‌ای‌تان اهداف کوتاه‌مدت و بلندمدت تحصیلی و شغلی خود را شرح می‌دهید.',
    teachingFa: 'واژگان کلیدی مسیر پیشرفت حرفه‌ای و دانشگاهی: uzmanlaşmak (متخصص شدن در حوزه‌ای)، mesleki gelişim (رشد حرفه‌ای)، akademik çalışma (پژوهش دانشگاهی)، terfi almak (ارتقای شغلی گرفتن)، uluslararası deneyim (تجربهٔ بین‌المللی) و yetkinlik kazanmak (کسب صلاحیت و مهارت).',
    rows: [
      ['Kısa vadeli hedefim veri bilimi alanında uzmanlaşıp uluslararası projelerde görev almaktır.', 'هدف کوتاه‌مدت من متخصص شدن در حوزهٔ علم داده و گرفتن مسئولیت در پروژه‌های بین‌المللی است.', 'کِیسا وادِلی هِدَفیم وِری بیلیمی آلانِیندا اوزمانلاشِیپ اولوسلارآراسِی پروژِلَرده گورَو آلماکتِیر', 'uzmanlaşıp', 'متخصص شدن و...', '-da/-de uzmanlaşmak = تخصص یافتن در'],
      ['Mesleki gelişimimi sürdürmek amacıyla her yıl en az iki sertifika programını tamamlıyorum.', 'با هدف ادامهٔ رشد حرفه‌ای‌ام هر سال دست‌کم دو دورهٔ گواهی‌نامه‌دار را به پایان می‌رسانم.', 'مَسلِکی گِلیشیمیمی سوردورمَک آماجِییلا هَر یِیل اَن آز ایکی سَرتیفیکا پروگرامِینِی تاماملِییوروم', 'mesleki gelişimimi', 'توسعه / رشد حرفه‌ای‌ام را'],
      ['Yüksek lisans eğitimim sırasında yenilenebilir enerji politikaları üzerine tez yazmak istiyorum.', 'در دورهٔ کارشناسی ارشدم می‌خواهم دربارهٔ سیاست‌های انرژی تجدیدپذیر پایان‌نامه بنویسم.', 'یوکسَک لیسانس اَییتیمیم سِیراسِیندا یِنیلِنِبیلیر اِنَرژی پولیتیکالارِی اوزَرینه تَز یازماک ایستییوروم', 'üzerine tez yazmak', 'پایان‌نامه نوشتن دربارهٔ...'],
      ['Önümüzdeki üç yıl içinde ekip liderliği pozisyonuna yükselmek için yönetim becerilerimi geliştiriyorum.', 'برای ارتقا به جایگاه سرپرستی تیم ظرف سه سال آینده، مهارت‌های مدیریتی‌ام را تقویت می‌کنم.', 'اونوموزدِکی اوچ یِیل ایچینده اِکیپ لیدَرلییی پوزیسیونونا یوکسَلمَک ایچین یونِتیم بِجِریلَریمی گِلیشتیرییوروم', 'yükselmek için', 'برای ارتقا یافتن'],
      ['Farklı sektörlerde saha tecrübesi edinmek kariyer planlamamda önemli bir yer tutuyor.', 'کسب تجربهٔ میدانی در صنایع گوناگون جایگاه مهمی در برنامه‌ریزی شغلی من دارد.', 'فارکلِی سَکتورلَرده ساها تَجرُبِسی اِدینمَک کارییَر پلانلامامدا اونَملی بیر یَر توتویور', 'yer tutuyor', 'جایگاه دارد / جا به خود اختصاص می‌دهد'],
      ['Akademik kariyer düşünen öğrencilerin yabancı dil sınavından yüksek puan alması şarttır.', 'برای دانشجویانی که به مسیر دانشگاهی فکر می‌کنند گرفتن نمرهٔ بالا در آزمون زبان الزامی است.', 'آکادِمیک کارییَر دوشونَن اوئرَنجیلَرین یابانجِی دیل سِیناوِیندان یوکسَک پوآن آلماسِی شارتتِیر', 'akademik kariyer', 'مسیر شغلی دانشگاهی / هیئت علمی'],
      ['Mevcut görevimde edindiğim deneyimi ileride kendi danışmanlık şirketimi kurmak için kullanacağım.', 'تجربه‌ای را که در سمت فعلی‌ام کسب کرده‌ام در آینده برای تأسیس شرکت مشاورهٔ خودم به کار خواهم گرفت.', 'مَوجوت گورَویمده اِدیندیییم دِنِییمی ایلَریده کَندی دانِیشمانلِیک شیرکِتیمی کورماک ایچین کوللاناجائِیم', 'edindiğim deneyimi', 'تجربه‌ای را که کسب کرده‌ام'],
      ['Hem teorik bilgiyi hem pratik uygulamayı birleştiren bir çalışma ortamı arıyorum.', 'به دنبال محیط کاری‌ای هستم که هم دانش نظری و هم کاربرد عملی را با هم تلفیق کند.', 'هَم تِئوریک بیلگییی هَم پراتیک اویگولامایِی بیرلَشتیرَن بیر چالِیشما اورتامِی آرِییوروم', 'birleştiren', 'تلفیق‌کننده / پیونددهنده'],
    ],
    dialogue: [
      ['استاد مشاور', 'Lisans eğitimini bu dönem tamamlıyorsun; bundan sonrası için nasıl bir yol haritası çizdin?', 'دورهٔ کارشناسی را این ترم تمام می‌کنی؛ برای بعد از این چه نقشهٔ راهی ترسیم کرده‌ای؟'],
      ['آرش', 'Öncelikle bir yıl sektörde çalışarak pratik yetkinlik kazanmayı, ardından yüksek lisansa başvurmayı planlıyorum.', 'برنامه دارم ابتدا با یک سال کار در صنعت مهارت عملی کسب کنم و پس از آن برای کارشناسی ارشد اقدام کنم.'],
      ['استاد مشاور', 'Hangi alanda uzmanlaşmak istiyorsun?', 'می‌خواهی در چه حوزه‌ای متخصص شوی؟'],
      ['آرش', 'Akıllı şehir teknolojileri alanında uzmanlaşıp hem akademik araştırmalara hem saha projelerine katkıda bulunmak istiyorum.', 'می‌خواهم در حوزهٔ فناوری‌های شهر هوشمند متخصص شوم و هم به پژوهش‌های دانشگاهی و هم به پروژه‌های میدانی کمک کنم.'],
    ],
    checks: [
      {
        promptFa: 'فعل «uzmanlaşmak» در بیان اهداف شغلی و تحصیلی به چه معناست؟',
        choices: ['متخصص شدن و مهارت عمیق یافتن در یک رشته', 'انصراف دادن از تحصیل', 'مرخصی گرفتن از کار'],
        correctIndex: 0,
        explanationFa: 'uzman (متخصص) + پسوند -laşmak = متخصص شدن در یک حوزه.',
      },
      {
        promptFa: 'ترکیب «deneyim edinmek» یعنی چه؟',
        choices: ['کسب تجربه کردن', 'فراموش کردن تجربه', 'رد کردن مصاحبه'],
        correctIndex: 0,
        explanationFa: 'فعل edinmek (کسب کردن / به دست آوردن) با واژه‌های deneyim، bilgi و meslek هم‌نشین رسمی سطح B1 است.',
      },
    ],
  },

  /* ۸. شرکت در مصاحبه شغلی و معرفی توانایی‌ها */
  {
    id: 'tr-b1-s-08-job-interview-presenting-skills',
    title: 'شرکت در مصاحبه شغلی و معرفی توانایی‌ها',
    subtitle: 'Survival · معرفی سوابق کاری، نقاط قوت، مدیریت فشار کاری و پاسخ حرفه‌ای به پرسش‌های مصاحبه‌گر',
    situation: 'در یک مصاحبهٔ شغلی به زبان ترکی استانبولی توانمندی‌ها، دستاوردها و انگیزهٔ پیوستن به شرکت را حرفه‌ای معرفی می‌کنید.',
    teachingFa: 'عبارت‌های کلیدی موفقیت در مصاحبهٔ شغلی (İş Görüşmesi / Mülakat): «... alanında dört yıllık deneyime sahibim» (دارای چهار سال تجربه در حوزهٔ ... هستم)، «takım çalışmasına yatkınım» (مستعد کار تیمی‌ام)، «baskı altında soğukkanlı çalışabilirim» (زیر فشار می‌توانم خونسرد کار کنم) و «şirketinize değer katacağıma inanıyorum» (معتقدم به شرکت شما ارزش افزوده خواهم داد).',
    rows: [
      ['Yazılım geliştirme alanında dört yıllık deneyime sahibim ve üç büyük projede görev aldım.', 'در حوزهٔ توسعهٔ نرم‌افزار دارای چهار سال تجربه هستم و در سه پروژهٔ بزرگ فعالیت کرده‌ام.', 'یازِیلِیم گِلیشتیرمه آلانِیندا دورت یِیللِیک دِنِییمه ساهیبیم وِ اوچ بویوک پروژِده گورَو آلدِیم', 'deneyime sahibim', 'دارای تجربه هستم', '-a/-e sahip olmak = برخوردار بودن از'],
      ['Takım çalışmasına yatkın, yeniliklere açık ve analitik düşünebilen bir çalışanım.', 'کارمندی مستعدِ کار تیمی، پذیرای نوآوری و دارای توان تفکر تحلیلی هستم.', 'تاکِیم چالِیشماسِینا یاتکِین، یِنیلیکلَره آچِیک وِ آنالیتیک دوشونِبیلَن بیر چالِیشانِیم', 'yatkın', 'مستعد / سازگار با', '-a/-e yatkın olmak'],
      ['Önceki iş yerimde yürüttüğüm süreç iyileştirme çalışmasıyla maliyetleri yüzde on iki düşürdük.', 'با پروژهٔ بهبود فرایندی که در محل کار قبلی‌ام پیش بردم هزینه‌ها را دوازده درصد کاهش دادیم.', 'اونجِکی ایش یِریمده یوروتتویوم سورَچ ایییلَشتیرمه چالِیشماسِییلا مالییَتلَری یوزده اون ایکی دوشوردوک', 'süreç iyileştirme', 'بهبود فرایند'],
      ['Yoğun iş temposunda önceliklerimi doğru belirleyerek zamanı verimli yönetebilirim.', 'در ریتم کاری فشرده با تعیین درست اولویت‌هایم می‌توانم زمان را پربازده مدیریت کنم.', 'یوئون ایش تَمپوسوندا اونجِلیکلَریمی دوئرو بِلیرلِیِرَک زامانِی وِریملی یونِتِبیلیریم', 'önceliklerimi', 'اولویت‌هایم را'],
      ['Eksik olduğumu fark ettiğim alanlarda hızla yeni araçlar öğrenmeye hevesliyim.', 'در حوزه‌هایی که متوجه کمبودم شوم مشتاق یادگیری سریع ابزارهای جدید هستم.', 'اَکسیک اولدوئومو فارک اِتتیییم آلانلاردا هِیزلا یِنی آراچلار اوئرَنمِیه هِوَسلیییم', 'hevesliyim', 'مشتاق و علاقه‌مند هستم'],
      ['Şirketinizin yenilikçi vizyonu kariyer hedeflerimle birebir örtüşüyor.', 'چشم‌انداز نوآورانهٔ شرکت شما مو‌به‌مو با اهداف شغلی من هم‌خوانی دارد.', 'شیرکِتینیزین یِنیلیکچی ویزیونو کارییَر هِدَفلَریمله بیرِبیر اورتوشویور', 'birebir örtüşüyor', 'دقیقاً هم‌پوشانی / هم‌خوانی دارد'],
      ['Edindiğim teknik birikimle ekibinize kısa sürede değer katacağıma inanıyorum.', 'باور دارم با اندوختهٔ فنی‌ای که کسب کرده‌ام در مدت کوتاهی به تیمتان ارزش خواهم افزود.', 'اِدیندیییم تَکنیک بیریکیمله اِکیبینیزه کِیسا سورِده دَیَر کاتاجائِیما اینانِییوروم', 'değer katacağıma', 'اینکه ارزش خواهم افزود'],
      ['Pozisyonun gerektirdiği sorumluluklar ve beklentiler hakkında biraz daha bilgi alabilir miyim?', 'آیا می‌توانم دربارهٔ مسئولیت‌ها و انتظاراتی که این سمت ایجاب می‌کند کمی اطلاعات بیشتر بگیرم؟', 'پوزیسیونون گِرَکتیردییی سوروملولوکلار وِ بَکلَنتیلَر هاککِیندا بیراز داها بیلگی آلابیلیر میییم', 'gerektirdiği', 'که ایجاب می‌کند / می‌طلبد'],
    ],
    dialogue: [
      ['مصاحبه‌گر', 'Bize kısaca kendinizden ve bu pozisyona neden başvurduğunuzdan bahseder misiniz?', 'ممکن است کوتاه از خودتان و دلیل اقدامتان برای این جایگاه شغلی برایمان بگویید؟'],
      ['متقاضی', 'Memnuniyetle; endüstri mühendisiyim ve tedarik zinciri yönetiminde üç yıllık deneyime sahibim.', 'با کمال میل؛ مهندس صنایع هستم و سه سال سابقهٔ کار در مدیریت زنجیرهٔ تأمین دارم.'],
      ['مصاحبه‌گر', 'En güçlü yönünüz olarak hangi özelliğinizi öne çıkarırsınız?', 'به عنوان قوی‌ترین نقطهٔ قوت خود کدام ویژگی‌تان را برجسته می‌کنید؟'],
      ['متقاضی', 'Kriz anlarında soğukkanlı kalıp veriye dayalı hızlı çözümler üretebilmem en güçlü yönümdür.', 'خونسرد ماندن در لحظات بحران و تولید راه‌حل‌های سریع مبتنی بر داده قوی‌ترین نقطهٔ قوت من است.'],
    ],
    checks: [
      {
        promptFa: 'در مصاحبهٔ شغلی عبارت «takım çalışmasına yatkınım» به چه معناست؟',
        choices: ['روحیه و استعداد بالایی در کار تیمی دارم', 'فقط به تنهایی کار می‌کنم', 'تجربهٔ کاری ندارم'],
        correctIndex: 0,
        explanationFa: 'yatkın olmak یعنی مستعد و هماهنگ بودن با یک مهارت یا محیط کاری.',
      },
      {
        promptFa: 'عبارت حرفه‌ای «ekibinize değer katmak» یعنی چه؟',
        choices: ['ایجاد ارزش افزوده و اثر مثبت برای تیم شما', 'افزایش هزینه‌های تیم', 'ترک کردن جلسه'],
        correctIndex: 0,
        explanationFa: 'değer katmak یکی از کلیدی‌ترین اصطلاحات مصاحبه‌های شغلی در ترکیه به معنای «ارزش آفریدن» است.',
      },
    ],
  },

  /* ۹. مکالمات کاری و توضیح مسئولیت‌ها */
  {
    id: 'tr-b1-s-09-workplace-discussions-responsibilities',
    title: 'مکالمات کاری و توضیح مسئولیت‌ها',
    subtitle: 'Survival · تفویض اختیار، هماهنگی بین‌واحدی، پیگیری شاخص‌های عملکرد و مدیریت بار کاری',
    situation: 'در جلسات هفتگی شرکت حدود مسئولیت‌ها را شفاف می‌کنید، وظایف را تقسیم می‌کنید و وضعیت پروژه‌ها را گزارش می‌دهید.',
    teachingFa: 'واژگان ارتباطات درون‌سازمانی در سطح B1: görev dağılımı (تقسیم وظایف)، yetki devretmek (تفویض اختیار)، eş güdüm / koordinasyon (هماهنگی)، iş yükü (بار کاری)، geri bildirim (بازخورد) و aksamadan yürütmek (پیش بردنِ بی‌وقفهٔ کار).',
    rows: [
      ['Yeni projede bütçe takibi ve tedarikçi sözleşmelerinin denetimi benim sorumluluk alanımda.', 'در پروژهٔ جدید پیگیری بودجه و نظارت بر قراردادهای تأمین‌کنندگان در حیطهٔ مسئولیت من است.', 'یِنی پروژِده بوتچه تاکیبی وِ تِداریکچی سوزلَشمِلَرینین دِنِتیمی بِنیم سوروملولوک آلانِیمدا', 'sorumluluk alanımda', 'در حیطهٔ مسئولیت من', 'sorumluluk alanı = قلمرو مسئولیت'],
      ['İş yükünü dengeli dağıtmak amacıyla raporlama görevini iki uzman arasında paylaştırdık.', 'با هدف توزیع متعادل بار کاری، وظیفهٔ گزارش‌دهی را میان دو کارشناس تقسیم کردیم.', 'ایش یوکونو دَنگِلی دائِیتماک آماجِییلا راپورلاما گورَوینی ایکی اوزمان آراسِیندا پایلاشتِیردِیک', 'iş yükünü', 'بار کاری را'],
      ['Pazarlama ve satış birimleriyle tam bir eş güdüm içinde çalışmamız büyük önem taşıyor.', 'کار کردن ما در هماهنگی کامل با واحدهای بازاریابی و فروش اهمیت زیادی دارد.', 'پازارلاما وِ ساتِیش بیریملَرییله تام بیر اَش گودوم ایچینده چالِیشمامِیز بویوک اونَم تاشِییور', 'eş güdüm', 'هماهنگی / هم‌آهنگی سازمانی'],
      ['Yıllık izne çıkmadan önce devam eden dosyalarımı ekip arkadaşıma ayrıntılı biçimde devrettim.', 'پیش از رفتن به مرخصی سالانه پرونده‌های در جریانم را با جزئیات به هم‌تیمی‌ام تحویل دادم.', 'یِیللِیک ایزنه چِیکمادان اونجه دِوام اِدَن دوسیالارِیمِی اِکیپ آرکاداشِیما آیرِینتِیلِی بیچیمده دَورَتتیم', 'devrettim', 'واگذار کردم / تحویل دادم', 'görevi / dosyayı devretmek'],
      ['Süreçlerin aksamadan yürümesi için her çarşamba on beş dakikalık durum değerlendirmesi yapıyoruz.', 'برای اینکه فرایندها بی‌وقفه پیش برود هر چهارشنبه ارزیابی وضعیت پانزده‌دقیقه‌ای برگزار می‌کنیم.', 'سورَچلَرین آکسامادان یورومِسی ایچین هَر چارشامبا اون بَش داکیکالِیک دوروم دَیَرلَندیرمِسی یاپِییوروز', 'aksamadan', 'بدون اختلال / بی‌وقفه'],
      ['Teknik onay süreci tamamlanır tamamlanmaz test ortamını kullanıma açacağız.', 'به محض اینکه روند تأیید فنی کامل شود محیط تست را فعال خواهیم کرد.', 'تَکنیک اونای سورِجی تاماملانِیر تاماملانماز تَست اورتامِینِی کوللانِیما آچاجائِیز', 'tamamlanır tamamlanmaz', 'به محض کامل شدن'],
      ['Müşteri taleplerindeki artış nedeniyle bu hafta destek ekibine öncelik vermemiz gerekiyor.', 'به علت افزایش درخواست‌های مشتریان لازم است این هفته به تیم پشتیبانی اولویت بدهیم.', 'موشتَری تالَپلَریندِکی آرتِیش نِدِنییله بو هافتا دَستَک اِکیبینه اونجِلیک وَرمَمیز گِرِکییور', 'öncelik vermemiz', 'اولویت دادنِ ما'],
      ['Hazırladığım taslak hakkındaki yapıcı geri bildirimleriniz metni çok daha güçlü kıldı.', 'بازخوردهای سازندهٔ شما دربارهٔ پیش‌نویسی که آماده کردم متن را بسیار قوی‌تر ساخت.', 'هازِیرلادِیئِیم تاسلاک هاککِینداکی یاپِیجِی گِری بیلدیریملَرینیز مَتنی چوک داها گوچلو کِیلدِی', 'güçlü kıldı', 'قوی ساخت / نیرومند کرد'],
    ],
    dialogue: [
      ['سرپرست تیم', 'Bu çeyrekte ürün lansmanı yaklaşırken görev dağılımını netleştirelim; tasarım onayı kimde?', 'حالا که در این فصل عرضهٔ محصول نزدیک می‌شود تقسیم کار را شفاف کنیم؛ تأیید طراحی دست چه کسی است؟'],
      ['لیلا', 'Görsel tasarım ve baskı takibi benim sorumluluk alanımda; cuma gününe kadar son taslakları paylaşacağım.', 'طراحی بصری و پیگیری چاپ در حیطهٔ مسئولیت من است؛ تا روز جمعه طرح‌های نهایی را به اشتراک خواهم گذاشت.'],
      ['سرپرست تیم', 'Harika; peki sosyal medya metinleriyle eş güdümü nasıl sağlayacağız?', 'عالی؛ خب هماهنگی با متن‌های شبکه‌های اجتماعی را چطور برقرار خواهیم کرد؟'],
      ['لیلا', 'İçerik ekibiyle ortak bir çalışma dosyası açtık; böylece tüm güncellemeler aksamadan eş zamanlı ilerliyor.', 'با تیم محتوا یک فایل کاری مشترک باز کردیم؛ به این ترتیب همهٔ به‌روزرسانی‌ها بی‌وقفه و هم‌زمان پیش می‌رود.'],
    ],
    checks: [
      {
        promptFa: 'اصطلاح اداری «dosyaları devretmek» پیش از رفتن به مرخصی یعنی چه؟',
        choices: ['پرونده‌ها و مسئولیت آن‌ها را به همکار دیگر تحویل و واگذار کردن', 'پرونده‌ها را پاک کردن', 'پرونده‌ها را محرمانه نگه داشتن'],
        correctIndex: 0,
        explanationFa: 'devretmek فعل رسمی برای واگذاری و تحویل کار، سمت یا پرونده به نفر جایگزین است.',
      },
      {
        promptFa: 'واژهٔ «eş güdüm» هم‌معنی کدام واژه است؟',
        choices: ['koordinasyon (هماهنگی)', 'şikayet (شکایت)', 'tatil (تعطیلات)'],
        correctIndex: 0,
        explanationFa: 'eş güdüm برابر نهادهٔ اصیل و پرکاربرد ترکی برای واژهٔ koordinasyon (هماهنگی) است.',
      },
    ],
  },

  /* ۱۰. ارائه پیشنهاد و مذاکره برای رسیدن به توافق */
  {
    id: 'tr-b1-s-10-proposing-negotiating-agreement',
    title: 'ارائه پیشنهاد و مذاکره برای رسیدن به توافق',
    subtitle: 'Survival · طرح پیشنهاد متقابل (karşı teklif)، چانه‌زنی حرفه‌ای، امتیاز متقابل و رسیدن به نقطهٔ مشترک',
    situation: 'در مذاکرهٔ قرارداد، خرید عمده یا توافق کاری شرایط را سبک‌سنگین می‌کنید و پیشنهاد برد-برد ارائه می‌دهید.',
    teachingFa: 'عبارت‌های کلیدی مذاکره در ترکی استانبولی: «Orta yolu bulmak» (پیدا کردن راه میانه)، «karşı teklif sunmak» (ارائهٔ پیشنهاد متقابل)، «iki taraf için de kazan-kazan durumu» (موقعیت برد-برد برای هر دو طرف)، «... koşuluyla kabul edebiliriz» (به شرطِ ... می‌توانیم بپذیریم) و «mutabık kalmak / uzlaşmak» (به توافق رسیدن).',
    rows: [
      ['Her iki tarafın da beklentilerini karşılayacak bir orta yol bulabileceğimize inanıyorum.', 'معتقدم می‌توانیم راه میانه‌ای پیدا کنیم که انتظارات هر دو طرف را برآورده سازد.', 'هَر ایکی تارافِین دا بَکلَنتیلَرینی کارشِیلایاجاک بیر اورتا یول بولابیلِجَییمیزه اینانِییوروم', 'orta yol', 'راه میانه / حد وسط', 'orta yolu bulmak = به توافق میانه رسیدن'],
      ['Sipariş miktarını iki katına çıkarmamız koşuluyla birim fiyatta yüzde on beş indirim yapabilir misiniz?', 'به شرط اینکه حجم سفارش را دو برابر کنیم می‌توانید در قیمت واحد پانزده درصد تخفیف بدهید؟', 'سیپاریش میکتارِینِی ایکی کاتِینا چِیکارمامِیز کوشولویلا بیریم فییاتتا یوزده اون بَش ایندیریم یاپابیلیر میسینیز', 'koşuluyla', 'به شرطِ اینکه', '-ması/-mesi koşuluyla / şartıyla'],
      ['Teklifinizi dikkatle inceledik; bütçemize uyum sağlaması için size bir karşı teklif sunmak istiyoruz.', 'پیشنهاد شما را با دقت بررسی کردیم؛ برای سازگاری با بودجه‌مان می‌خواهیم پیشنهاد متقابلی تقدیمتان کنیم.', 'تَکلیفینیزی دیککاتله اینجِلِدیک؛ بوتچِمیزه اویوم سائلاماسِی ایچین سیزه بیر کارشِی تَکلیف سونماک ایستییوروز', 'karşı teklif', 'پیشنهاد متقابل'],
      ['Teslim süresini iki haftaya çekerseniz ödeme planında esneklik sağlamaya hazırız.', 'اگر زمان تحویل را به دو هفته کاهش دهید آماده‌ایم در برنامهٔ پرداخت انعطاف نشان دهیم.', 'تِسلیم سورِسینی ایکی هافتایا چِکَرسِنیز اودِمه پلانِیندا اَسنَکلیک سائلامایا هازِیرِیز', 'esneklik sağlamaya', 'به فراهم کردن انعطاف'],
      ['Ücretsiz teknik destek süresinin bir yıla çıkarılması bizim için vazgeçilmez bir maddedir.', 'افزایش مدت پشتیبانی فنی رایگان به یک سال برای ما یک بند غیرقابل چشم‌پوشی است.', 'اوجرَتسیز تَکنیک دَستَک سورِسینین بیر یِیلا چِیکارِیلماسِی بیزیم ایچین وازگِچیلمَز بیر ماددِدیر', 'vazgeçilmez', 'غیرقابل چشم‌پوشی / ضروری'],
      ['Uzun vadeli iş birliğimizi göz önünde bulundurarak fiyat artışını sınırlı tuttuk.', 'با در نظر گرفتن همکاری بلندمدتمان، افزایش قیمت را محدود نگه داشتیم.', 'اوزون وادِلی ایش بیرلیییمیزی گوز اونونده بولوندوراراک فییات آرتِیشِینِی سِینِیرلِی توتتوک', 'göz önünde bulundurarak', 'با مد نظر قرار دادن'],
      ['Tüm ana maddelerde mutabık kaldığımıza göre sözleşme metnini son hâline getirebiliriz.', 'از آنجا که بر سر همهٔ بندهای اصلی هم‌نظر شدیم می‌توانیم متن قرارداد را نهایی کنیم.', 'توم آنا ماددِلَرده موتابِیک کالدِیئِیمِیزا گوره سوزلَشمه مَتنینی سون هالینه گِتیرِبیلیریز', 'mutabık kaldığımıza göre', 'حالا که توافق کردیم'],
      ['Bu anlaşmanın her iki kurum için de verimli ve sürdürülebilir olmasını diliyorum.', 'آرزو می‌کنم این توافق برای هر دو نهاد پربار و پایدار باشد.', 'بو آنلاشمانِین هَر ایکی کوروم ایچین دِ وِریملی وِ سوردورولِبیلیر اولماسِینِی دیلییوروم', 'anlaşmanın', 'توافق / قرارداد'],
    ],
    dialogue: [
      ['خریدار', 'Teklif ettiğiniz yıllık bakım paketi kapsamlı görünüyor; ancak toplam tutar bütçemizin biraz üzerinde.', 'بستهٔ نگهداری سالانه‌ای که پیشنهاد دادید جامع به نظر می‌رسد؛ اما مبلغ کل کمی بالاتر از بودجهٔ ماست.'],
      ['نمایندهٔ فروش', 'Anlıyorum; iki yıllık sözleşme imzalamanız koşuluyla yıllık ücrette yüzde on iki indirim uygulayabiliriz.', 'درک می‌کنم؛ به شرط امضای قرارداد دوساله می‌توانیم دوازده درصد تخفیف در هزینهٔ سالانه اعمال کنیم.'],
      ['خریدار', 'İndirim oranı makul; buna ek olarak ödemeyi üç eşit taksitte yapabilirsek bugün onaylayabiliriz.', 'درصد تخفیف منطقی است؛ افزون بر این اگر بتوانیم پرداخت را در سه قسط مساوی انجام دهیم امروز می‌توانیم تأیید کنیم.'],
      ['نمایندهٔ فروش', 'Memnuniyetle kabul ediyoruz; böylece her iki taraf için de dengeli bir anlaşmaya varmış olduk.', 'با کمال میل می‌پذیریم؛ به این ترتیب به توافق متعادلی برای هر دو طرف رسیدیم.'],
    ],
    checks: [
      {
        promptFa: 'عبارت مذاکره‌ای «... koşuluyla» به چه معناست؟',
        choices: ['به شرطِ اینکه...', 'با وجود اینکه...', 'بدونِ اینکه...'],
        correctIndex: 0,
        explanationFa: 'koşuluyla / şartıyla پس از اسم‌فعل ملکی (-manız koşuluyla) شرط معامله و توافق را مشخص می‌کند.',
      },
      {
        promptFa: 'اصطلاح «mutabık kalmak» در پایان مذاکره یعنی چه؟',
        choices: ['بر سر موضوعی به توافق و هم‌نظری رسیدن', 'مذاکره را نیمه‌کاره رها کردن', 'درخواست خسارت کردن'],
        correctIndex: 0,
        explanationFa: 'mutabık kalmak و uzlaşmak عبارات رسمی رسیدن به توافق در مذاکرات ترکی هستند.',
      },
    ],
  },

  /* ۱۱. بیان شکایت و پیگیری مشکلات */
  {
    id: 'tr-b1-s-11-complaints-following-up-issues',
    title: 'بیان شکایت و پیگیری مشکلات',
    subtitle: 'Survival · ثبت شکایت مکتوب و تلفنی، اشاره به حقوق مصرف‌کننده، پیگیری شمارهٔ پرونده و مطالبهٔ جبران',
    situation: 'وقتی مشکل خرید، خدمات اینترنت یا پرواز پس از اولین تماس حل نشده، قاطعانه و رسمی پیگیری می‌کنید.',
    teachingFa: 'در پیگیری شکایات سطح B1 از واژگان حقوقی و خدماتی دقیق اما محترمانه استفاده می‌شود: «kayıt / başvuru numarası» (شمارهٔ ثبت پیگیری)، «taahhüt edilen süre» (مهلت تعهدشده)، «mağduriyet» (تضییع حق / خسارت)، «tüketici hakları» (حقوق مصرف‌کننده) و «ivedilikle çözülmesini talep ediyorum» (درخواست حل فوری دارم).',
    rows: [
      ['Geçen hafta oluşturduğum arıza kaydına rağmen sorunum hâlâ çözüme kavuşmadı.', 'با وجود ثبت خرابی‌ای که هفتهٔ گذشته ایجاد کردم مشکلم هنوز به راه‌حل نرسیده است.', 'گِچَن هافتا اولوشتوردوئوم آرِیزا کایدِینا رائمَن سورونوم هالا چوزومه کاووشمادِی', 'çözüme kavuşmadı', 'به نتیجه / راه‌حل نرسید', 'çözüme kavuşmak = حل و فصل شدن'],
      ['Sözleşmede taahhüt edilen internet hızının yarısını bile alamıyorum.', 'حتی نیمی از سرعت اینترنتی را که در قرارداد تعهد شده است دریافت نمی‌کنم.', 'سوزلَشمِده تاآههوت اِدیلَن اینتَرنَت هِیزِینِین یارِیسِینِی بیله آلامِییوروم', 'taahhüt edilen', 'تعهدشده / وعده داده‌شده'],
      ['Üç kez müşteri hizmetlerini aramama karşın tarafıma herhangi bir geri dönüş yapılmadı.', 'علی‌رغم اینکه سه بار با خدمات مشتریان تماس گرفتم هیچ بازگشتی (پاسخی) به من داده نشد.', 'اوچ کِز موشتَری هیزمَتلَرینی آراماما کارشِین تارافِیما هَرهانگی بیر گِری دونوش یاپِیلمادِی', 'geri dönüş yapılmadı', 'پاسخ / پیگیری برگشتی داده نشد'],
      ['Başvuru numaram sisteminizde kayıtlıdır; dosyamın hangi aşamada olduğunu öğrenebilir miyim?', 'شمارهٔ درخواست من در سامانهٔ شما ثبت است؛ می‌توانم بفهمم پرونده‌ام در چه مرحله‌ای است؟', 'باشوورو نومارام سیستِمینیزده کایِیتلِیدِیر؛ دوسیامِین هانگی آشامادا اولدوئونو اوئرِنِبیلیر میییم', 'hangi aşamada', 'در کدام مرحله'],
      ['Garanti kapsamındaki cihazım yirmi iş günü geçmesine rağmen servisten teslim edilmedi.', 'دستگاه من که تحت پوشش گارانتی است با وجود گذشت بیست روز کاری از تعمیرگاه تحویل داده نشده است.', 'گارانتی کاپسامِینداکی جیهازِیم ییرمی ایش گونو گِچمِسینه رائمَن سَرویستَن تِسلیم اِدیلمِدی', 'garanti kapsamındaki', 'تحت پوشش ضمانت'],
      ['Yaşadığım mağduriyetin giderilmesini ve kullanamadığım günlerin faturadan düşülmesini talep ediyorum.', 'درخواست دارم خسارت وارده برطرف شود و روزهایی که نتوانستم استفاده کنم از قبض کسر گردد.', 'یاشادِیئِیم مائدورییِتین گیدِریلمِسینی وِ کوللانامادِیئِیم گونلَرین فاتورادان دوشولمِسینی تالَپ اِدییوروم', 'faturadan düşülmesini', 'کسر شدن از قبض را'],
      ['Konuyu ilgili üst birime iletip yazılı olarak tarafıma bilgi vermenizi rica ederim.', 'خواهشمندم موضوع را به واحد مافوق مربوطه ارجاع دهید و کتباً به من اطلاع رسانی کنید.', 'کونویو ایلگیلی اوست بیریمه ایلِتیپ یازِیلِی اولاراک تارافِیما بیلگی وَرمِنیزی ریجا اِدَریم', 'yazılı olarak', 'به‌صورت مکتوب / کتباً'],
      ['Sorun bu hafta içinde çözülmediği takdirde Tüketici Hakem Heyeti’ne başvurmak durumunda kalacağım.', 'در صورتی که مشکل ظرف این هفته حل نشود ناگزیر به مراجعه به هیئت داوری حقوق مصرف‌کننده خواهم شد.', 'سورون بو هافتا ایچینده چوزولمِدییی تاکدیرده توکِتیجی هاکَم هِیِتینه باشوورماک دوروموندا کالاجائِیم', 'başvurmak durumunda kalacağım', 'ناچار به مراجعه خواهم شد'],
    ],
    dialogue: [
      ['مشترک', 'İyi günler, on gün önce internet nakil başvurusu yapmıştım; taahhüt edilen yedi günlük süre doldu ama bağlantı hâlâ yok.', 'روز بخیر، ده روز پیش درخواست انتقال خط اینترنت داده بودم؛ مهلت هفت‌روزهٔ تعهدشده تمام شده اما هنوز اتصال برقرار نیست.'],
      ['مسئول پیگیری', 'Yaşadığınız aksaklık için özür dileriz; başvuru numaranızı paylaşırsanız dosyanızı hemen inceleyeyim.', 'بابت اختلال پیش‌آمده پوزش می‌خواهیم؛ اگر شمارهٔ پیگیری‌تان را بفرمایید پرونده‌تان را فوراً بررسی کنم.'],
      ['مشترک', 'Numaram dört yüz seksen iki; daha önce de aradım fakat kimse geri dönüş yapmadı.', 'شماره‌ام چهارصد و هشتاد و دو است؛ قبلاً هم تماس گرفتم اما کسی نتیجه را اطلاع نداد.'],
      ['مسئول پیگیری', 'Kaydınızı acil öncelikli duruma aldım; saha ekibimiz yarın öğleden önce kurulumu tamamlayacak ve kullanamadığınız günler faturanızdan düşülecek.', 'پروندهٔ شما را در وضعیت اولویت فوری قرار دادم؛ تیم میدانی ما فردا پیش از ظهر نصب را کامل می‌کند و روزهای بدون استفاده از قبضتان کسر خواهد شد.'],
    ],
    checks: [
      {
        promptFa: 'در پیگیری شکایات عبارت «geri dönüş yapılmadı» به چه معناست؟',
        choices: ['از طرف شرکت تماسی یا پاسخی برای اطلاع‌رسانی برگردانده نشد', 'کالا مرجوع نشد', 'آدرس پیدا نشد'],
        correctIndex: 0,
        explanationFa: 'geri dönüş yapmak در مکالمات خدماتی و اداری ترکی یعنی «پاسخ دادن و خبرِ پیگیری را برگرداندن».',
      },
      {
        promptFa: 'واژهٔ «taahhüt edilen süre» یعنی چه؟',
        choices: ['مدت‌زمان تعهدشده در قرارداد', 'ساعت تعطیلی فروشگاه', 'زمان استراحت کارکنان'],
        correctIndex: 0,
        explanationFa: 'taahhüt etmek یعنی تعهد دادن؛ taahhüt edilen süre مهلت رسمی قول‌داده‌شده توسط شرکت است.',
      },
    ],
  },

  /* ۱۲. مدیریت اختلاف‌نظر در مکالمه */
  {
    id: 'tr-b1-s-12-managing-disagreements-in-conversation',
    title: 'مدیریت اختلاف‌نظر در مکالمه',
    subtitle: 'Survival · کاهش تنش، رفع سوءتفاهم (yanlış anlaşılma)، همدلی بدون عقب‌نشینی و حفظ احترام متقابل',
    situation: 'وقتی در مکالمهٔ کاری یا دوستانه سوءتفاهم یا اختلاف‌نظر تندی پیش می‌آید، فضا را آرام و گفتگو را سازنده نگه می‌دارید.',
    teachingFa: 'عبارت‌های کلیدی مدیریت تنش در ترکی استانبولی: «Sanırım küçük bir yanlış anlaşılma oldu» (گمان کنم یک سوءتفاهم کوچک پیش آمد)، «Amacım kesinlikle seni eleştirmek değildi» (قصدم اصلاً انتقاد از تو نبود)، «Konuyu kişiselleştirmeden çözüm aramalıyız» (بدون شخصی کردن موضوع باید دنبال راه‌حل بگردیم) و «Ortak noktalarımıza odaklanalım».',
    rows: [
      ['Sanırım aramızda küçük bir yanlış anlaşılma oldu; ne demek istediğimi daha açık ifade edeyim.', 'گمان کنم میان ما یک سوءتفاهم کوچک پیش آمد؛ اجازه بده منظورم را شفاف‌تر بیان کنم.', 'سانِیرِیم آرامِیزدا کوچوک بیر یانلِیش آنلاشِیلما اولدو؛ نِ دِمَک ایستِدیییمی داها آچِیک ایفاده اِدَییم', 'yanlış anlaşılma', 'سوءتفاهم', 'yanlış anlaşılma olmak = پیش آمدن سوءتفاهم'],
      ['Sözlerim biraz sert anlaşıldıysa kusura bakma; amacım kesinlikle seni kırmak değildi.', 'اگر حرف‌هایم کمی تند برداشت شد ببخش؛ قصدم اصلاً رنجاندن تو نبود.', 'سوزلَریم بیراز سَرت آنلاشِیلدِییسا کوسورا باکما؛ آماجِیم کِسینلیکله سِنی کِیرماک دِئیلدی', 'kırmak değildi', 'رنجاندن / دل شکستن نبود', 'birini kırmak = رنجاندن کسی'],
      ['Hangi noktada ayrıştığımızı netleştirirsek çözümü çok daha kolay buluruz.', 'اگر شفاف کنیم دقیقاً در چه نقطه‌ای اختلاف‌نظر داریم راه‌حل را بسیار راحت‌تر پیدا می‌کنیم.', 'هانگی نوکتادا آیرِیشتِیئِیمِیزِی نَتلَشتیریرسَک چوزومو چوک داها کولای بولوروز', 'ayrıştığımızı', 'اینکه در کجا متفاوت فکر می‌کنیم را'],
      ['Farklı düşünmemiz gayet doğal; önemli olan birbirimizi dinleyip ortak zeminde buluşabilmektir.', 'متفاوت فکر کردن ما کاملاً طبیعی است؛ مهم این است که به هم گوش بدهیم و در نقطهٔ مشترک به هم برسیم.', 'فارکلِی دوشونمَمیز گایَت دوئال؛ اونَملی اولان بیربیریمیزی دینلِییپ اورتاک زِمینده بولوشابیلمَکتیر', 'ortak zeminde', 'در بستر / نقطهٔ مشترک'],
      ['Tartışmanın hararetiyle aceleci bir karar vermektense konuyu yarın sakin kafayla değerlendirelim.', 'به جای گرفتن تصمیم عجولانه در گرماگرم بحث، موضوع را فردا با سرِ آرام (فکر آسوده) بررسی کنیم.', 'تارتِیشمانِین هارارِتییله آجِلِجی بیر کارار وَرمَکتَنسه کونویو یارِین ساکین کافایلا دَیَرلَندیرِلیم', 'sakin kafayla', 'با ذهن آرام و بدون تنش'],
      ['Senin hassasiyetini çok iyi anlıyorum; gel bu meseleyi kimseyi suçlamadan çözelim.', 'حساسیت و دغدغهٔ تو را خیلی خوب درک می‌کنم؛ بیا این مسئله را بدون مقصر کردن کسی حل کنیم.', 'سِنین هاسساسییِتینی چوک اییی آنلِییوروم؛ گَل بو مَسِلِیی کیمسِیی سوچلامادان چوزِلیم', 'suçlamadan', 'بدون متهم / مقصر کردن'],
      ['Beni sonuna kadar dinlediğin ve yapıcı yaklaştığın için gerçekten teşekkür ederim.', 'از اینکه تا پایان به حرفم گوش دادی و سازنده برخورد کردی واقعاً سپاسگزارم.', 'بِنی سونونا کادار دینلِدییین وِ یاپِیجِی یاکلاشتِیئِین ایچین گَرچَکتَن تِشَککور اِدَریم', 'yapıcı yaklaştığın', 'اینکه سازنده برخورد کردی'],
      ['Geçmişteki aksaklıkları tekrar gündeme getirmek yerine bundan sonra ne yapacağımıza odaklanalım.', 'به جای دوباره پیش کشیدن مشکلات گذشته، روی کاری که از این به بعد انجام خواهیم داد تمرکز کنیم.', 'گِچمیشتِکی آکساکلِیکلارِی تِکرار گوندِمه گِتیرمَک یِرینه بوندان سونرا نِ یاپاجائِیمِیزا اوداکلانالِیم', 'odaklanalım', 'تمرکز کنیم'],
    ],
    dialogue: [
      ['امیر', 'Dünkü toplantıda raporumdaki eksikleri herkesin önünde söylemen açıkçası beni biraz rahatsız etti.', 'اینکه دیروز در جلسه کاستی‌های گزارشم را جلوی همه گفتی راستش کمی ناراحتم کرد.'],
      ['تولین', 'Haklısın, sözlerim yanlış anlaşıldıysa özür dilerim; amacım seni eleştirmek değil teslim tarihine yetişmemizi sağlamaktı.', 'حق با توست، اگر حرف‌هایم بد برداشت شد عذر می‌خواهم؛ قصدم انتقاد از تو نبود بلکه رساندن کار به تاریخ تحویل بود.'],
      ['امیر', 'Niyetini şimdi daha iyi anlıyorum; bundan sonra toplantıdan önce notlarımızı baş başa gözden geçirebilir miyiz?', 'الان نیتت را بهتر درک می‌کنم؛ از این به بعد می‌توانیم پیش از جلسه یادداشت‌هایمان را دونفره مرور کنیم؟'],
      ['تولین', 'Harika bir fikir! Ortak zeminde buluştuğumuza çok sevindim; bundan sonra tam olarak böyle yapalım.', 'فکر فوق‌العاده‌ای است! خیلی خوشحالم که به نقطهٔ مشترک رسیدیم؛ از این پس دقیقاً همین کار را بکنیم.'],
    ],
    checks: [
      {
        promptFa: 'اصطلاح «sakin kafayla değerlendirmek» هنگام بروز اختلاف‌نظر یعنی چه؟',
        choices: ['با ذهن آرام و دور از هیجان موضوع را بررسی کردن', 'بحث را با صدای بلند ادامه دادن', 'موضوع را کاملاً فراموش کردن'],
        correctIndex: 0,
        explanationFa: 'sakin kafayla کنایهٔ بسیار طبیعی ترکی برای تصمیم‌گیری در آرامش فکری است.',
      },
      {
        promptFa: 'در جملهٔ «Amacım seni kırmak değildi»، فعل «kırmak» چه معنایی دارد؟',
        choices: ['دل شکستن و رنجاندن مخاطب', 'شکستن شیشهٔ پنجره', 'کم کردن قیمت'],
        correctIndex: 0,
        explanationFa: 'birini kırmak / kalbini kırmak یعنی «کسی را رنجاندن و دلخور کردن».',
      },
    ],
  },

  /* ۱۳. برنامه‌ریزی سفر و حل مشکلات پیش‌بینی‌نشده */
  {
    id: 'tr-b1-s-13-travel-planning-unexpected-issues',
    title: 'برنامه‌ریزی سفر و حل مشکلات پیش‌بینی‌نشده',
    subtitle: 'Survival · مدیریت لغو پرواز، جا ماندن از قطار ارتباطی، گم شدن مدارک و تغییر اضطراری مسیر',
    situation: 'در جریان سفر با تأخیر سنگین پرواز، گم شدن چمدان یا اشتباه در رزرو روبه‌رو می‌شوید و خونسرد مشکل را حل می‌کنید.',
    teachingFa: 'اصطلاحات ضروری بحران‌های سفر در سطح B1: «aktarmalı uçuşu kaçırmak» (جا ماندن از پرواز ارتباطی)، «alternatif sefer talep etmek» (درخواست پرواز/سرویس جایگزین)، «konaklama ve yemek hakkı» (حق اسکان و غذا در تأخیر طولانی)، «kayıp bagaj tutanağı» (صورت‌جلسهٔ چمدان گمشده) و «konsoloslukla iletişime geçmek».',
    rows: [
      ['İlk uçuşumuz iki saat rötar yaptığı için İstanbul’daki aktarma uçağını maalesef kaçırdık.', 'چون پرواز اولمان دو ساعت تأخیر داشت متأسفانه از هواپیمای ارتباطی در استانبول جا ماندیم.', 'ایلک اوچوشوموز ایکی ساعات روتار یاپتِیئِی ایچین ایستانبولداکی آکتارما اوچائِینِی ماآلِسَف کاچِیردِیک', 'aktarma uçağını', 'هواپیمای ارتباطی (ترانزیت) را', 'rötar yapmak = تأخیر داشتن پرواز'],
      ['Havayolu şirketinin kontuarına başvurup bir sonraki uçuşa ücretsiz bilet talep ettik.', 'به پیشخوان شرکت هواپیمایی مراجعه کردیم و برای پرواز بعدی بلیت رایگان درخواست کردیم.', 'هاوایولو شیرکِتینین کونتوآرِینا باشووروپ بیر سونراکی اوچوشا اوجرَتسیز بیلَت تالَپ اِتتیک', 'kontuarına', 'به پیشخوان / کانترِ آن'],
      ['Yedi saati aşan gecikmelerde yolcuların ücretsiz otel konaklaması talep etme hakkı vardır.', 'در تأخیرهای بیش از هفت ساعت، مسافران حق درخواست اسکان رایگان در هتل را دارند.', 'یِدی ساعاتی آشان گِجیکمِلَرده یولجولارِین اوجرَتسیز اوتَل کوناکلاماسِی تالَپ اِتمه هاککِی واردِیر', 'konaklaması', 'اقامت / اسکان'],
      ['Valizim banttan çıkmayınca kayıp eşya ofisinde bagaj takip formu doldurdum.', 'وقتی چمدانم از نوار نقاله بیرون نیامد در دفتر اشیای گمشده فرم رهگیری بار پر کردم.', 'والیزیم بانتتان چِیکمایِینجا کایِیپ اَشیا اوفیسینده باگاژ تاکیپ فورمو دولدوردوم', 'bagaj takip formu', 'فرم رهگیری چمدان'],
      ['Otele vardığımızda sistem hatası yüzünden çift rezervasyon yapıldığını öğrendik.', 'وقتی به هتل رسیدیم متوجه شدیم به خاطر خطای سامانه رزرو مضاعف انجام شده است.', 'اوتِله واردِیئِیمِیزدا سیستَم هاتاسِی یوزوندَن چیفت رِزَرواسیون یاپِیلدِیئِینِی اوئرَندیک', 'çift rezervasyon', 'رزرو مضاعف / تکراری'],
      ['Otel yönetimi özür dileyerek bizi hiçbir ek ücret almadan üst sınıf bir odaya yerleştirdi.', 'مدیریت هتل با عذرخواهی ما را بدون دریافت هیچ هزینهٔ اضافی در اتاقی با ردهٔ بالاتر اسکان داد.', 'اوتَل یونِتیمی اوزور دیلِیِرَک بیزی هیچ‌بیر اَک اوجرَت آلمادان اوست سِینِیف بیر اودایا یَرلَشتیردی', 'yerleştirdi', 'مستقر کرد / جا داد'],
      ['Pasaportunu kaybeden bir gezginin öncelikle polis merkezinden kayıp tutanağı alması gerekir.', 'گردشگری که گذرنامه‌اش را گم می‌کند نخست باید از مرکز پلیس گزارش مفقودی بگیرد.', 'پاساپورتونو کایبِدَن بیر گَزگینین اونجِلیکله پولیس مَرکِزیندَن کایِیپ توتانائِی آلماسِی گِرِکیر', 'kayıp tutanağı', 'صورت‌جلسهٔ مفقودی'],
      ['Her ihtimale karşı seyahat sigortası yaptırmak beklenmedik sağlık ve iptal masraflarını karşılar.', 'بیمهٔ مسافرتی گرفتن برای هر احتمالی، هزینه‌های غیرمنتظرهٔ درمانی و لغو سفر را پوشش می‌دهد.', 'هَر ایهتیماله کارشِی سِیاهات سیگورتاسِی یاپتِیرماک بَکلَنمِدیک سائلِیک وِ ایپتال ماسرافلارِینِی کارشِیلار', 'seyahat sigortası', 'بیمهٔ مسافرتی', 'her ihtimale karşı = محض احتیاط'],
    ],
    dialogue: [
      ['مسافر', 'Affedersiniz, Ankara’dan gelen uçağımız geç indiği için İzmir aktarmamızı kaçırdık; nasıl yardımcı olabilirsiniz?', 'ببخشید، چون هواپیمای ما که از آنکارا می‌آمد دیر نشست پرواز ارتباطی ازمیر را از دست دادیم؛ چطور می‌توانید کمک کنید؟'],
      ['مسئول پرواز', 'Biniş kartlarınızı kontrol edeyim; evet, gecikme havayolu kaynaklı olduğu için sizi saat altıda kalkan sefere ücretsiz aktarıyorum.', 'کارت‌های پروازتان را بررسی کنم؛ بله، چون تأخیر از طرف شرکت هواپیمایی بوده شما را رایگان به پرواز ساعت شش منتقل می‌کنم.'],
      ['مسافر', 'Peki teslim ettiğimiz valizlerimiz de otomatik olarak yeni uçağa yüklenecek mi?', 'خب چمدان‌هایی هم که تحویل داده‌ایم خودکار در هواپیمای جدید بارگیری خواهند شد؟'],
      ['مسئول پرواز', 'Evet, bagaj etiketlerinizi güncelledim; ayrıca bekleme süresince kullanabileceğiniz yemek kuponlarınızı da buyurun.', 'بله، برچسب بارتان را به‌روز کردم؛ همچنین بفرمایید کوپن‌های غذایی که در مدت انتظار می‌توانید استفاده کنید.'],
    ],
    checks: [
      {
        promptFa: 'اصطلاح «aktarma uçağını kaçırmak» در فرودگاه به چه معناست؟',
        choices: ['جا ماندن از پرواز ارتباطی (ترانزیت)', 'تغییر صندلی کنار پنجره', 'تحویل دادن چمدان اضافه'],
        correctIndex: 0,
        explanationFa: 'aktarma uçağı پرواز ارتباطی میان دو مسیر است و kaçırmak یعنی از دست دادن / جا ماندن.',
      },
      {
        promptFa: 'عبارت بسیار پرکاربرد «her ihtimale karşı» یعنی چه؟',
        choices: ['محض احتیاط / برای هر پیشامد احتمالی', 'برخلاف تمام احتمالات', 'بدون هیچ احتمالی'],
        correctIndex: 0,
        explanationFa: 'her ihtimale karşı معادل دقیق «محض احتیاط» در برنامه‌ریزی سفر و کار است.',
      },
    ],
  },

  /* ۱۴. شرح تجربه‌های پزشکی و توضیح علائم با جزئیات بیشتر */
  {
    id: 'tr-b1-s-14-detailed-medical-experiences-symptoms',
    title: 'شرح تجربه‌های پزشکی و توضیح علائم با جزئیات بیشتر',
    subtitle: 'Survival · توصیف نوع درد، سوابق پزشکی، آزمایش‌های تشخیصی (tahlil / röntgen) و روند درمان',
    situation: 'نزد پزشک متخصص الگوی درد، عوامل تشدیدکننده، سوابق درمانی و نتیجهٔ آزمایش‌های قبلی‌تان را دقیق شرح می‌دهید.',
    teachingFa: 'در سطح B1 برای توصیف دقیق علائم پزشکی از صفات و افعال تخصصی‌تر اما رایج استفاده می‌شود: «zonklayıcı ağrı» (درد ضربان‌دار)، «batma hissi» (حس تیر کشیدن/سوزش)، «nefes alırken artıyor» (هنگام نفس کشیدن بیشتر می‌شود)، «kan tahlili yaptırmak» (آزمایش خون دادن)، «muayene bulguları» (یافته‌های معاینه) و «yan etki» (عارضهٔ جانبی).',
    rows: [
      ['Son bir haftadır şakaklarımda özellikle akşam saatlerinde şiddetlenen zonklayıcı bir ağrı var.', 'یک هفتهٔ اخیر در شقیقه‌هایم درد ضربان‌داری دارم که به‌ویژه در ساعات عصر شدیدتر می‌شود.', 'سون بیر هافتادِیر شاکاکلارِیمدا اوزَللیکله آکشام ساعاتلَرینده شیددَتلِنَن زونکلایِیجِی بیر آئرِی وار', 'zonklayıcı', 'ضربان‌دار (توصیف درد)', 'توصیف دقیق نوع و زمان تشدید درد'],
      ['Derin nefes aldığımda veya merdiven çıktığımda göğsümde hafif bir sıkışma hissediyorum.', 'وقتی نفس عمیق می‌کشم یا از پله بالا می‌روم در قفسهٔ سینه‌ام گرفتگی خفیفی حس می‌کنم.', 'دِرین نِفَس آلدِیئِیمدا وِیا مَردیوَن چِیکتِیئِیمدا گویسومده هافیف بیر سِیکِیشما هیسسِدییوروم', 'sıkışma', 'گرفتگی / فشار'],
      ['Geçen yıl benzer bir şikayetle gittiğim doktor kan tahlili ve ultrason istemişti.', 'پارسال که با علامت مشابهی مراجعه کردم پزشک آزمایش خون و سونوگرافی درخواست کرده بود.', 'گِچَن یِیل بَنزَر بیر شیکایَتله گیتتیییم دوکتور کان تاهلیلی وِ اولتراسون ایستِمیشتی', 'kan tahlili', 'آزمایش خون'],
      ['Kullandığım bu yeni ilaç uyku hali ve ağız kuruluğu gibi bazı yan etkilere yol açtı.', 'این داروی جدیدی که مصرف می‌کنم به عوارض جانبی‌ای مثل خواب‌آلودگی و خشکی دهان منجر شد.', 'کوللاندِیئِیم بو یِنی ایلاچ اویکو هالی وِ آئِیز کورولوئو گیبی بازِی یان اَتکیلَره یول آچتِی', 'yan etkilere', 'به عوارض جانبی', 'yan etki = عارضهٔ جانبی دارو'],
      ['Ailemde şeker hastalığı öyküsü bulunduğu için yılda bir kez düzenli kontrolden geçiyorum.', 'چون در خانواده‌ام سابقهٔ بیماری دیابت وجود دارد سالی یک‌بار چکاپ منظم می‌دهم.', 'آیلَمده شِکَر هاستالِیئِی اویکوسو بولوندوئو ایچین یِیلدا بیر کِز دوزَنلی کونترولدَن گِچییوروم', 'kontrolden geçiyorum', 'معاینه / چکاپ می‌شوم'],
      ['Fizik tedavi seanslarına başladıktan sonra omuz hareketlerimdeki kısıtlılık büyük ölçüde azaldı.', 'پس از شروع جلسات فیزیوتراپی محدودیت حرکتی شانه‌ام تا حد زیادی کاهش یافت.', 'فیزیک تِداوی سِآنسلارِینا باشلادِیکتان سونرا اوموز هارِکَتلَریمدِکی کِیسِیتلِیلِیک بویوک اولچوده آزالدِی', 'fizik tedavi', 'فیزیوتراپی'],
      ['Tahlil sonuçlarınız genel olarak temiz görünüyor; sadece demir değeriniz sınırın biraz altında.', 'نتایج آزمایش شما به طور کلی سالم به نظر می‌رسد؛ فقط عدد آهن خونتان کمی پایین‌تر از حد مجاز است.', 'تاهلیل سونوچلارِینِیز گِنَل اولاراک تِمیز گورونویور؛ سادِجه دِمیر دَیَرینیز سِینِیرِین بیراز آلتِیندا', 'tahlil sonuçlarınız', 'نتایج آزمایش شما'],
      ['Tedavi sürecini aksatmamak ve ilaçları doktorun önerdiği dozda kullanmak iyileşmeyi hızlandırır.', 'مختل نکردن روند درمان و مصرف داروها با دوز پیشنهادی پزشک بهبودی را سرعت می‌بخشد.', 'تِداوی سورِجینی آکساتماماک وِ ایلاچلارِی دوکتورون اونَردییی دوزدا کوللانماک ایییلَشمِیی هِیزلاندِیرِیر', 'iyileşmeyi', 'بهبودی را'],
    ],
    dialogue: [
      ['متخصص داخلی', 'Şikayetlerinizi dinledim; bu mide yanması yemeklerden hemen sonra mı başlıyor yoksa açken mi artıyor?', 'علائمتان را شنیدم؛ آیا این سوزش معده بلافاصله بعد از غذا شروع می‌شود یا موقع گرسنگی بیشتر می‌شود؟'],
      ['بیمار', 'Genellikle baharatlı yemeklerden yarım saat sonra başlıyor ve uzandığımda daha da şiddetleniyor.', 'معمولاً نیم ساعت بعد از غذاهای ادویه‌دار شروع می‌شود و وقتی دراز می‌کشم شدیدتر هم می‌شود.'],
      ['متخصص داخلی', 'Daha önce bu şikayetle ilgili bir ilaç kullandınız mı?', 'آیا پیش‌تر برای این مشکل دارویی مصرف کرده‌اید؟'],
      ['بیمار', 'Geçen ay kısa süre mide koruyucu kullandım; o dönemde rahatlattı ama ilacı bırakınca şikayetlerim tekrarladı.', 'ماه پیش مدت کوتاهی محافظ معده مصرف کردم؛ در آن دوره آرام کرد اما وقتی دارو را قطع کردم علائمم برگشت.'],
    ],
    checks: [
      {
        promptFa: 'در گفتگو با پزشک عبارت «yan etki» به چه معناست؟',
        choices: ['عارضهٔ جانبی دارو', 'نسخهٔ الکترونیکی', 'نوبت معاینهٔ بعدی'],
        correctIndex: 0,
        explanationFa: 'yan etki معادل دقیق «عارضهٔ جانبی» (Side effect) در پزشکی و داروسازی است.',
      },
      {
        promptFa: 'منظور از «kan tahlili» چیست؟',
        choices: ['آزمایش خون', 'فشارسنج دستی', 'بخش اورژانس'],
        correctIndex: 0,
        explanationFa: 'kan (خون) + tahlil (آزمایش/تحلیل) = آزمایش خون.',
      },
    ],
  },

  /* ۱۵. توضیح قوانین، فرایندها و روش انجام کارها */
  {
    id: 'tr-b1-s-15-explaining-rules-procedures-methods',
    title: 'توضیح قوانین، فرایندها و روش انجام کارها',
    subtitle: 'Survival · شرح تشریفات اداری ترکیه (اقامت، بانک، مالیات، ثبت‌نام دانشگاه) و ضوابط سازمانی',
    situation: 'به یک دوست یا همکار تازه‌وارد مراحل دقیق انجام یک کار اداری و ضوابط قانونی آن را به ترکی توضیح می‌دهید.',
    teachingFa: 'واژگان کاربردی امور اداری و قانونی در ترکیه: ikamet izni (مجوز اقامت)، noter onaylı tercüme (ترجمهٔ رسمی تأییدشده در دفترخانه)، randevu sistemi (سامانهٔ نوبت‌دهی)، vergi numarası (شمارهٔ مالیاتی)، yürürlükteki mevzuat (مقررات جاری) و eksiksiz ibraz etmek (ارائهٔ کامل مدارک).',
    rows: [
      ['İkamet izni uzatma başvurusu mevcut sürenin dolmasına altmış gün kala sistem üzerinden yapılabilir.', 'درخواست تمدید مجوز اقامت از شصت روز مانده به پایان مهلت فعلی از طریق سامانه قابل انجام است.', 'ایکامَت ایزنی اوزاتما باشووروسو مَوجوت سورِنین دولماسِینا آلتمِیش گون کالا سیستَم اوزَریندَن یاپِیلابیلیر', 'ikamet izni', 'مجوز اقامت', 'مدت + kala = ... مانده به'],
      ['Yurt dışından alınan diplomaların geçerli sayılması için noter onaylı tercümesi istenmektedir.', 'برای معتبر شمرده شدن مدارک تحصیلی اخذشده از خارج، ترجمهٔ رسمی محضری آن‌ها خواسته می‌شود.', 'یورت دِیشِیندان آلِینان دیپلومالارِین گِچَرلی سایِیلماسِی ایچین نوتَر اونایلِی تَرجومِسی ایستَنمَکتِدیر', 'noter onaylı', 'تأییدشده در دفترخانهٔ اسناد رسمی'],
      ['Banka hesabı açtırırken kimlik belgenizin yanı sıra adres kayıt belgesi de ibraz etmeniz gerekir.', 'هنگام افتتاح حساب بانکی در کنار مدرک شناسایی لازم است گواهی ثبت نشانی هم ارائه دهید.', 'بانکا هِسابِی آچتِیرِیرکَن کیملیک بَلگِنیزین یانِی سِیرا آدرَس کایِیت بَلگِسی دِ ایبراز اِتمِنیز گِرِکیر', 'ibraz etmeniz', 'ارائه دادنِ شما (مدرک رسمی)'],
      ['Yürürlükteki yönetmeliğe göre kiralık konut ödemelerinin banka aracılığıyla yapılması zorunludur.', 'بر اساس آیین‌نامهٔ جاری، انجام پرداخت‌های مسکن اجاره‌ای از طریق بانک الزامی است.', 'یورورلوکتِکی یونَتمِلییه گوره کیرالِیک کونوت اودِمِلَرینین بانکا آراجِیلِیئِییلا یاپِیلماسِی زورونلودور', 'aracılığıyla', 'از طریقِ / به واسطهٔ', 'اسم + aracılığıyla'],
      ['E-Devlet kapısına giriş yaptıktan sonra arama çubuğuna belge adını yazarak çıktıyı alabilirsiniz.', 'پس از ورود به درگاه دولت الکترونیک با نوشتن نام مدرک در نوار جست‌وجو می‌توانید نسخهٔ چاپی را بگیرید.', 'اِ دَولَت کاپِیسِینا گیریش یاپتِیکتان سونرا آراما چوبوئونا بَلگه آدِینِی یازاراک چِیکتِییِی آلابیلیرسینیز', 'arama çubuğuna', 'در نوار جست‌وجو'],
      ['Başvuru harcını yatırdığınıza dair dekontu dosyanıza eklemeyi kesinlikle unutmayın.', 'اضافه کردن رسیدِ مبنی بر واریز هزینهٔ ثبت‌نام را به پرونده‌تان به هیچ وجه فراموش نکنید.', 'باشوورو هارجِینِی یاتِیردِیئِینِیزا دایر دِکونتو دوسیانِیزا اَکلِمِیی کِسینلیکله اونوتمایِین', 'yatırdığınıza dair', 'مبنی بر اینکه واریز کرده‌اید', '-dığına dair = دال بر / مبنی بر'],
      ['Belirlenen süre içinde eksik evrak tamamlanmazsa başvuru kendiliğinden geçersiz sayılır.', 'اگر ظرف مهلت تعیین‌شده کسری مدارک تکمیل نشود درخواست خودبه‌خود بی‌اعتبار تلقی می‌شود.', 'بِلیرلِنَن سوره ایچینده اَکسیک اَوراک تاماملانمازسا باشوورو کَندیلیییندَن گِچَرسیز سایِیلِیر', 'geçersiz sayılır', 'بی‌اعتبار شمرده می‌شود'],
      ['Her adımda yapılan işlemler kayıt altına alındığı için süreci şeffaf biçimde takip edebilirsiniz.', 'از آنجا که عملیات انجام‌شده در هر گام ثبت می‌شود می‌توانید فرایند را به‌صورت شفاف پیگیری کنید.', 'هَر آدِیمدا یاپِیلان ایشلَملَر کایِیت آلتِینا آلِیندِیئِی ایچین سورِجی شَففاف بیچیمده تاکیپ اِدِبیلیرسینیز', 'kayıt altına alındığı', 'ثبت و ضبط شدن'],
    ],
    dialogue: [
      ['دانشجوی جدید', 'Merhaba, öğrenci ikamet izni için belgeleri nasıl hazırlamam gerektiğini kısaca anlatabilir misin?', 'سلام، می‌توانی کوتاه برایم توضیح دهی مدارک مجوز اقامت دانشجویی را چطور باید آماده کنم؟'],
      ['کارشناس امور دانشجویان', 'Öncelikle çevrim içi başvuru formunu doldurup randevu almalısın; ardından öğrenci belgeni E-Devlet üzerinden çıkarabilirsin.', 'ابتدا باید فرم آنلاین درخواست را پر کنی و نوبت بگیری؛ پس از آن می‌توانی گواهی اشتغال به تحصیلت را از درگاه دولت الکترونیک بگیری.'],
      ['دانشجوی جدید', 'Sağlık sigortası ve harç ödemesi nasıl yapılıyor?', 'بیمهٔ سلامت و پرداخت هزینهٔ دولتی چطور انجام می‌شود؟'],
      ['کارشناس امور دانشجویان', 'Geçerli bir sağlık sigortası yaptırdıktan sonra harcı vergi dairesine veya anlaşmalı bankalara yatırıp dekontunu dosyana ekliyorsun.', 'پس از تهیهٔ بیمهٔ سلامت معتبر، هزینه را به ادارهٔ مالیات یا بانک‌های طرف قرارداد واریز می‌کنی و رسیدش را در پرونده‌ات می‌گذاری.'],
    ],
    checks: [
      {
        promptFa: 'در تشریفات اداری ترکیه منظور از «noter onaylı tercüme» چیست؟',
        choices: ['ترجمهٔ رسمی تأییدشده توسط دفترخانهٔ اسناد رسمی', 'ترجمهٔ ماشینی اینترنتی', 'فتوکپی سیاه‌وسفید'],
        correctIndex: 0,
        explanationFa: 'noter در ترکیه دفترخانهٔ اسناد رسمی است و noter onaylı یعنی ممهور به تأیید رسمی محضر.',
      },
      {
        promptFa: 'عبارت «altmış gün kala» یعنی چه؟',
        choices: ['شصت روز مانده به (پایان مهلت)', 'شصت روز پس از پایان', 'به مدت شصت سال'],
        correctIndex: 0,
        explanationFa: 'ساختار «-a/-e + مدت + kala» زمان باقی‌مانده تا یک موعد مشخص را بیان می‌کند.',
      },
    ],
  },

  /* ۱۶. صحبت درباره فناوری و ابزارهای دیجیتال */
  {
    id: 'tr-b1-s-16-technology-digital-tools',
    title: 'صحبت درباره فناوری و ابزارهای دیجیتال',
    subtitle: 'Survival · گفتگو دربارهٔ هوش مصنوعی، امنیت داده‌ها، ابزارهای ابری و کارایی اپلیکیشن‌ها',
    situation: 'دربارهٔ مزایا و چالش‌های ابزارهای دیجیتال روزمره، امنیت حریم خصوصی و فناوری‌های نوین گفتگو می‌کنید.',
    teachingFa: 'واژگان کلیدی دنیای دیجیتال در ترکی استانبولی: yapay zekâ (هوش مصنوعی)، bulut depolama (فضای ذخیره‌سازی ابری)، veri güvenliği / kişisel verilerin korunması (امنیت داده‌ها / حفاظت از داده‌های شخصی)، kullanıcı arayüzü (رابط کاربری)، çift aşamalı doğrulama (تأیید دو مرحله‌ای) و güncelleme (به‌روزرسانی).',
    rows: [
      ['Bulut depolama servisleri sayesinde çalışma dosyalarıma her cihazdan anında erişebiliyorum.', 'به لطف سرویس‌های ذخیره‌سازی ابری می‌توانم از هر دستگاهی در لحظه به فایل‌های کاری‌ام دسترسی داشته باشم.', 'بولوت دِپولاما سَرویسلَری سایِسینده چالِیشما دوسیالارِیما هَر جیهازدان آنِیندا اِریشِبیلییوروم', 'bulut depolama', 'ذخیره‌سازی ابری', '-a/-e erişebilmek = توان دسترسی یافتن به'],
      ['Hesap güvenliğini artırmak için tüm uygulamalarda çift aşamalı doğrulama özelliğini etkinleştirdim.', 'برای افزایش امنیت حساب، قابلیت تأیید دومرحله‌ای را در تمام برنامه‌ها فعال کردم.', 'هِساپ گووَنلییینی آرتِیرماک ایچین توم اویگولامالاردا چیفت آشامالِی دوئرولاما اوزَللییینی اَتکینلَشتیردیم', 'çift aşamalı doğrulama', 'تأیید هویت دومرحله‌ای'],
      ['Bu uygulamanın kullanıcı arayüzü son derece sade; aradığınız menüyü saniyeler içinde bulabiliyorsunuz.', 'رابط کاربری این اپلیکیشن بسیار ساده است؛ منوی مورد نظرتان را در چند ثانیه پیدا می‌کنید.', 'بو اویگولامانِین کوللانِیجِی آرایوزو سون دَرِجه ساده؛ آرادِیئِینِیز مِنویو سانییِلَر ایچینده بولابیلییورسونوز', 'kullanıcı arayüzü', 'رابط کاربری (UI)'],
      ['Yapay zekâ destekli çeviri araçları hız kazandırsa da metinlerin son kontrolünü insan yapmalıdır.', 'هرچند ابزارهای ترجمهٔ مبتنی بر هوش مصنوعی سرعت می‌دهند، بازبینی نهایی متن‌ها را باید انسان انجام دهد.', 'یاپای زِکا دَستَکلی چِویری آراچلارِی هِیز کازاندِیرسا دا مَتینلَرین سون کونترولونو اینسان یاپمالِیدِیر', 'yapay zekâ destekli', 'مبتنی بر / پشتیبان‌دار هوش مصنوعی', 'اسم + destekli = مجهز به پشتیبانیِ'],
      ['Kişisel verilerin korunması konusunda kullanıcıların gizlilik ayarlarını dikkatle incelemesi gerekir.', 'دربارهٔ حفاظت از داده‌های شخصی لازم است کاربران تنظیمات حریم خصوصی را با دقت بررسی کنند.', 'کیشیسَل وِریلَرین کورونماسِی کونوسوندا کوللانِیجِیلارِین گیزلیلیک آیارلارِینِی دیککاتله اینجِلِمِسی گِرِکیر', 'gizlilik ayarlarını', 'تنظیمات حریم خصوصی را'],
      ['Son yazılım güncellemesinden sonra telefonun pil ömrü gözle görülür biçimde uzadı.', 'پس از آخرین به‌روزرسانی نرم‌افزاری، عمر باتری تلفن به‌شکل محسوسی طولانی‌تر شد.', 'سون یازِیلِیم گونجَللِمِسیندَن سونرا تِلِفونون پیل اومرو گوزله گورولور بیچیمده اوزادِی', 'pil ömrü', 'عمر باتری'],
      ['Çevrim içi proje yönetim araçları uzaktan çalışan ekiplerin iş takibini büyük ölçüde kolaylaştırıyor.', 'ابزارهای آنلاین مدیریت پروژه، پیگیری کار تیم‌های دورکار را تا حد زیادی آسان می‌کنند.', 'چَوریم ایچی پروژه یونِتیم آراچلارِی اوزاکتان چالِیشان اِکیپلَرین ایش تاکیبینی بویوک اولچوده کولایلاشتِیرِییور', 'kolaylaştırıyor', 'آسان می‌سازد'],
      ['Teknolojiyi bilinçli ve ölçülü kullanmak dijital yorgunluğun önüne geçmenin en etkili yoludur.', 'استفادهٔ آگاهانه و متعادل از فناوری مؤثرترین راه پیشگیری از خستگی دیجیتال است.', 'تَکنولوژییی بیلینچلی وِ اولچولو کوللانماک دیجیتال یورگونلوئون اونونه گِچمِنین اَن اَتکیلی یولودور', 'önüne geçmenin', 'جلوگیری کردن / پیشگیری کردن'],
    ],
    dialogue: [
      ['کیان', 'Ekip içi görev takibi için yeni bir dijital araç arıyoruz; senin kullandığın ve memnun kaldığın bir platform var mı?', 'برای پیگیری وظایف درون‌تیمی دنبال یک ابزار دیجیتال جدید می‌گردیم؛ پلتفرمی هست که استفاده کرده باشی و از آن راضی باشی؟'],
      ['ازگی', 'Son altı aydır bulut tabanlı bir proje panosu kullanıyoruz; kullanıcı arayüzü çok anlaşılır ve mobil bildirimi anlık çalışıyor.', 'شش ماه اخیر از یک تابلوی پروژهٔ مبتنی بر ابر استفاده می‌کنیم؛ رابط کاربری‌اش بسیار گویاست و اعلان موبایلش لحظه‌ای کار می‌کند.'],
      ['کیان', 'Veri güvenliği ve yedekleme açısından güvenilir mi peki?', 'خب از نظر امنیت داده و پشتیبان‌گیری قابل اعتماد است؟'],
      ['ازگی', 'Evet, uçtan uca şifreleme ve çift aşamalı doğrulama sunuyor; ayrıca her akşam otomatik yedek alıyor.', 'بله، رمزنگاری سرتاسری و تأیید دومرحله‌ای ارائه می‌دهد؛ علاوه بر آن هر شب خودکار نسخهٔ پشتیبان می‌گیرد.'],
    ],
    checks: [
      {
        promptFa: 'اصطلاح «kullanıcı arayüzü» در دنیای نرم‌افزار و اپلیکیشن یعنی چه؟',
        choices: ['رابط کاربری (User Interface)', 'باتری اضافی دستگاه', 'کابل شارژ سریع'],
        correctIndex: 0,
        explanationFa: 'kullanıcı (کاربر) + arayüz (رابط) برابر رسمی و رایج User Interface در ترکی استانبولی است.',
      },
      {
        promptFa: 'عبارت «bir sorunun önüne geçmek» به چه معناست؟',
        choices: ['پیشگیری و جلوگیری کردن از بروز یک مشکل', 'بزرگ‌تر کردن مشکل', 'پشت سر گذاشتن ساختمان'],
        correctIndex: 0,
        explanationFa: 'önüne geçmek کنایهٔ پرکاربرد به معنای «سد راه شدن / پیشگیری کردن از امر ناخواسته» است.',
      },
    ],
  },
];

export const TURKISH_B1_SURVIVAL_PART_A = buildTurkishLessons(B1_SURVIVAL_PART_A_SEEDS, 'tr4', 241);
