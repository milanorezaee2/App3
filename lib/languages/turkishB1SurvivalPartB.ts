import { buildTurkishLessons, type TurkishLessonSeed } from './turkishSeed';

const B1_SURVIVAL_PART_B_SEEDS: readonly TurkishLessonSeed[] = [
  /* ۱۷. بیان دیدگاه درباره فیلم، کتاب و رسانه */
  {
    id: 'tr-b1-s-17-media-arts-opinions',
    title: 'بیان دیدگاه درباره فیلم، کتاب و رسانه',
    subtitle: 'Survival · نقد فیلم و کتاب، تحلیل داستان و بررسی سوگیری رسانه‌ای',
    situation: 'پس از تماشای یک فیلم یا خواندن یک کتاب، دربارهٔ محتوا، پیام و کیفیت آن با دوستان تبادل نظر می‌کنید.',
    teachingFa: 'واژگان نقد محتوا: senaryo (داستان/فیلم‌نامه)، karakter gelişimi (رشد شخصیت)، kurgu (تدوین)، eleştiri (نقد)، önyargı (پیش-daوری) و izleyici kitlesi (مخاطبان).',
    rows: [
      ['Son izlediğim filmin görselleri çok etkileyiciydi ama senaryonun sonu bana yapay geldi.', 'تصاویر آخرین فیلمی که دیدم بسیار چشمگیر بود اما پایان فیلم‌نامه‌اش مصنوع به نظر رسید.', 'سن ایزلهدایغایم فایلماین گاورسهللهرای چک هتکایلهیایجاییدای اما سهنارینن سن بانا یاپای گهلدای٫', 'senaryonun sonu', 'پایان فیلم‌نامه', 'الگوی نقد محتوا: senaryo + eleştiri yumuşak + önyargıdan kaçınma'],
      ['Bu roman karakterlerinin psikolojik gelişimini ustalıkla anlatıyor.', 'این رمان رشد روان‌شناختی شخصیت‌هایش را با استادی روایت می‌کند.', 'ب رمان کاراکتهرلهرایناین پسایکلژایک گهلایشایماینای ستالیکلا انلاتییر٫', 'karakterlerinin', 'شخصیت‌هایش را', 'الگوی نقد محتوا: senaryo + eleştiri yumuşak + önyargıdan kaçınma'],
      ['Dizinin kurgusu izleyiciyi bölümler arasında merak içinde tutmayı başarmış.', 'تدوین این سریال در نگه داشتن مخاطب در مراق بین قسمت‌ها موفق بوده است.', 'دایزایناین کرگس ایزلهیایجاییای باولاوملهر اراسیندا مهراک ایچاینده تتمایی باشارمیش٫', 'kurgusu', 'تدوین آن', 'الگوی نقد محتوا: senaryo + eleştiri yumuşak + önyargıdan kaçınma'],
      ['Eleştirmenlerin övgüyle bahsettiği sahneler bence biraz abartılıydı.', 'صحنه‌هایی که منتقدان درباره‌شان ستایشگرانه صحبت کردند به نظرم کمی اغراق‌آمیز بود.', 'هلهشتایرمهنلهراین اووگاویله باهسهتتایغای ساهنهلهر بهنجه بایراز ابارتیلییدی٫', 'abartılıydı', 'اغراق‌آمیز بود', 'الگوی نقد محتوا: senaryo + eleştiri yumuşak + önyargıdan kaçınma'],
      ['Gazete manşetlerindeki önyargılı başlıklar okuyucunun algısını yönlendirebilir.', 'تیترهای جانب‌دارانهٔ روزنامه‌ها می‌تواند ادراک خواننده را هدایت کند.', 'گازهته مانشهتلهرایندهکای اونیارگیلی باشلیکلار کیجنن الگیسینی یاونلهندایرهبایلایر٫', 'önyargılı başlıklar', 'تیترهای جانب‌دارانه', 'الگوی نقد محتوا: senaryo + eleştiri yumuşak + önyargıdan kaçınma'],
      ['Belgeselin anlatımı tarafsız kaldığı için izleyici kendi yorumunu yapabiliyor.', 'چون روایت مستند بی‌طرفانه بود بیننده می‌تواند تفسیر خودش را داشته باشد.', 'بهلگهسهلاین انلاتیمی تارافسیز کالدیغی ایچاین ایزلهیایجای کهندای یرمن یاپابایلاییر٫', 'tarafsız kaldığı', 'بی‌طرفانه باقی ماند', 'الگوی نقد محتوا: senaryo + eleştiri yumuşak + önyargıdan kaçınma'],
      ['Sosyal medya algoritmaları izleyici kitlesinin ilgisini çeken içerikleri öne çıkarıyor.', 'الگوریتم‌های شبکه‌های اجتماعی محتواهایی را برجسته می‌کنند که توجه مخاطبان را جلب می‌کند.', 'سسیال مهدیا الگرایتمالاری ایزلهیایجای کایتلهسایناین ایلگایساینای چهکهن ایچهرایکلهرای اونه چیکارییر٫', 'izleyici kitlesinin', 'مخاطبان را', 'الگوی نقد محتوا: senaryo + eleştiri yumuşak + önyargıdan kaçınma'],
      ['Bu kitabın yarattığı etki haftalarca zihnimden çıkmadı.', 'تأثیری که این کتاب ایجاد کرد هفته‌ها از ذهنم پاک نشد.', 'ب کایتابین یاراتتیغی هتکای هافتالارجا زایهنایمدهن چیکمادی٫', 'yarattığı etki', 'تأثیری که ایجاد کرد', 'الگوی نقد محتوا: senaryo + eleştiri yumuşak + önyargıdan kaçınma'],
    ],
    dialogue: [
      ['ruhe', 'Geçen hafta izlediğin bilim kurgu filmi nasıldı?', 'فیلم علمی-تخیلی‌ای که هفتهٔ پیش دیدی چطور بود؟'],
      ['sina', 'Görüntü efektleri güçlüydü ama karakterler yüzeysel kalmıştı.', 'جلوه‌های بصری قوی بود اما شخصیت‌ها سطحی مانده بودند.'],
      ['ruhe', 'Haklısın; ben de senaryonun akışının beklenmedik olduğunu düşünüyorum.', 'حق با توست؛ من هم فکر می‌کنم روند داستان غیرمنتظره بود.'],
      ['sina', 'Evet, son on dakika ters köşeyle bitiyor; bu da izleyicide güçlü bir etki bırakıyor.', 'بله، ده دقیقهٔ آخر با غافل‌گیرکننده تمام می‌شود؛ این هم تأثیری قوی روی بیننده می‌گذارد.'],
    ],
    checks: [
      {
        promptFa: 'در نقد فیلم، «senaryo» به چه معناست؟',
        choices: ['داستان یا فیلم‌نامهٔ فیلم', 'موسیقی متن', ' concatenated'],
        correctIndex: 0,
        explanationFa: 'senaryo یعنی فیلم‌نامه/داستان؛ kurgu же تدوین و چیدمان صحنه‌هاست.',
      },
      {
        promptFa: 'واژهٔ «önyargılı» در «önyargılı başlıklar» یعنی چه؟',
        choices: ['جانب‌دارانه / با پیش-daوری', 'دقیق و بی‌طرفانه', 'رنگارنگ'],
        correctIndex: 0,
        explanationFa: 'önyargı یعنی پیش-daوری؛ önyargılı başlıklar یعنی تیترهای جانب‌دارانه.',
      },
    ],
  },

  /* ۱۸. تعریف داستان و بازگویی اتفاق‌های پیچیده‌تر */
  {
    id: 'tr-b1-s-18-complex-story-retelling',
    title: 'تعریف داستان و بازگویی اتفاق‌های پیچیده‌تر',
    subtitle: 'Survival · توالی چندرویدادی، روابط علی و شفاف‌سازی پیچش‌ها',
    situation: 'یک ماجرای چندمرحله‌ای را که چند نفر در آن درگیر بوده‌اند با حفظ ترتیب زمانی و روابط علی منسجم تعریف می‌کنید.',
    teachingFa: 'برای поряд in داستان‌های پیچیده: «Önce... sonra... arkasından... en sonunda...» و «bu sırada» برای هم‌زمانی؛ «çünkü» برای علیت و «ancak» برای پیچش.',
    rows: [
      ['Önce hastaneye gittik, ardından kan tahlili sonuçlarını bekledik, arkasından doktorumuzla görüştük.', 'اول به بیمارستان رفتیم، بعد منتظر نتایج آزمایش خون ماندیم، بعد با پزشکمان صحبت کردیم.', 'اونجه هاستانهیه گایتتایک، اردیندان کان تاهلایلای سنچلارینی بهکلهدایک، ارکاسیندان دکترمزلا گاوراوشتاوک٫', 'ardından', 'سپس / بعد از آن', 'الگوی بازگویی: önce… sonra… arkasından… + bu sırada + bu yüzden'],
      ['Olaylar bu sırayla geliştiği için kimin ne zaman harekete geçtiğini net görebiliyoruz.', 'چون رویدادها به این ترتیب رخ دادند می‌توانیم清楚 ببینیم چه کسی چه‌وقت وارد عمل شد.', 'لایلار ب سیرایلا گهلایشتایغای ایچاین کایماین نه زامان هارهکهته گهچتایغاینای نهت گاورهبایلاییرز٫', 'bu sırayla', 'به این ترتیب', 'الگوی بازگویی: önce… sonra… arkasından… + bu sırada + bu yüzden'],
      ['Bu sırada arka sokakta bir kaza olmuş; bu yüzden yolumuzu değiştirmek zorunda kaldık.', 'در همان حال در کوچهٔ پشتی تصادفی رخ داده بود؛ به همین خاطر مجبور شدیم مسیرمان را تغییر دهیم.', 'ب سیرادا ارکا سکاکتا بایر کازا لمش؛ ب یاوزدهن یلمز دهغایشتایرمهک زرندا کالدیک٫', 'bu sırada', 'در همان حال', 'الگوی بازگویی: önce… sonra… arkasından… + bu sırada + bu yüzden'],
      ['Ancak sonradan öğrendik ki bildiri yanlışmış; bu yüzden gereksiz yere telaşlandık.', 'اما بعداً فهمیدیم اطلاعیه اشتباه بوده است؛ به همین دلیل بی‌جهت دست‌پاچه شدیم.', 'آنجاک سنرادان اوغرهندایک کای بایلدایرای یانلیشمیش؛ ب یاوزدهن گهرهکسایز یهره تهلاشلاندیک٫', 'gereksiz yere', 'بی‌جهت', 'الگوی بازگویی: önce… sonra… arkasından… + bu sırada + bu yüzden'],
      ['Hikâyenin en kritik dönemeci kahramanın beklenmedik bir itirafta bulunmasıydı.', 'مهم‌ترین نقطهٔ عطف داستان اعتراف غیرمنتظرهٔ قهرمان بود.', 'هایکâیهناین هن کرایتایک داونهمهجای کاهرامانین بهکلهنمهدایک بایر ایتایرافتا بلنماسییدی٫', 'itirafta bulunmasıydı', 'اعتراف کردن بود', 'الگوی بازگویی: önce… sonra… arkasından… + bu sırada + bu yüzden'],
      ['Geriye dönüp baktığımda tüm ipuçlarının en baştan orada olduğunu fark ediyorum.', 'وقتی به گذشته نگاه می‌کنم می‌بینم همهٔ سرنخ‌ها از همان ابتدا وجود داشته‌اند.', 'گهراییه داوناوپ باکتیغیمدا تاوم ایپچلارینین هن باشتان رادا لدغن فارک هداییرم٫', 'ipuçlarının', 'سرنخ‌ها را', 'الگوی بازگویی: önce… sonra… arkasından… + bu sırada + bu yüzden'],
      ['Anlatının akışı okuyucuyu yavaş yavaş gerçeğe yönlendiriyor.', 'جریان روایت خواننده را به‌آرامی به سمت واقعیت هدایت می‌کند.', 'آنلاتینین اکیشی کیجی یاواش یاواش گهرچهغه یاونلهندایراییر٫', 'akışı', 'جریان آن را', 'الگوی بازگویی: önce… sonra… arkasından… + bu sırada + bu yüzden'],
      ['Bu karmaşık olayı özetlemek gerekirse iki tarafın yanlış anlaşılmasından kaynaklanıyordu.', 'اگر بخواهیم این ماجرای پیچیده را خلاصه کنیم ناشی از سوءتفاهم دو طرف بود.', 'ب کارماشیک لایی اوزهتلهمهک گهرهکایرسه ایکای تارافین یانلیش انلاشیلماسیندان کایناکلانییرد٫', 'kaynaklanıyordu', 'ناشی می‌شد', 'الگوی بازگویی: önce… sonra… arkasından… + bu sırada + bu yüzden'],
    ],
    dialogue: [
      ['roya', 'Dün akşam tanık olduğun olayı sırasıyla anlatır mısın?', 'می‌توانی ماجرای دیشب را که شاهدش بودی به ترتیب برایم تعریف کنی؟'],
      ['behnam', 'Önce marketten çıktık, sonra park yerinde kaza olduğunu gördük; bu sırada polis geldi.', 'اول از مغازه بیرون آمدیم، بعد دیدیم در پارکینگ تصادف شده؛ همان موقع پلیس آمد.'],
      ['roya', 'Peki sonrasında ne oldu?', 'خب بعدش چه شد؟'],
      ['behnam', 'Arkasından herkes arabadan indi ve olayı telefonla kaydetti; en sonunda polis tutanak tuttu.', 'بعد همه از ماشین پیاده شدند و صحنه را با تلفن ضبط کردند؛ در نهایت پلیس صورت‌جلسه نوشت.'],
    ],
    checks: [
      {
        promptFa: 'در openings-roza داستان «ardından» چه نقشی دارد؟',
        choices: ['«سپس / بعد از آن» برای ادامهٔ توالی رویدادها', '«به شرط اینکه»', '«در حالی که»'],
        correctIndex: 0,
        explanationFa: 'ardından و sonra هر دو ترتیب زمانی را نشان می‌دهند.',
      },
      {
        promptFa: 'عبارت «gereksiz yere» یعنی چه؟',
        choices: ['بی‌جهت / بدون دلیل موجه', 'با عجله و بی‌نظم', 'فوراً'],
        correctIndex: 0,
        explanationFa: 'gereksiz یعنی غیرضروری؛ gereksiz yere telaşlanmak یعنی بی‌جهت دست‌پاچه شدن.',
      },
    ],
  },

  /* ۱۹. ارائه پیشنهاد و توصیه بر اساس تجربه */
  {
    id: 'tr-b1-s-19-advice-based-on-experience',
    title: 'ارائه پیشنهاد و توصیه بر اساس تجربه',
    subtitle: 'Survival · توصیهٔ مبتنی بر تجربهٔ شخصی و پیشگیری از اشتباهات',
    situation: 'با توجه به تجربهٔ خودتان بهدوست یا collègue توصیهٔ عملی می‌کنید تا از تکرار اشتباهات مشابه جلوگیری شود.',
    teachingFa: 'برای توصیهٔ مبتنی بر تجربه: «Benim başımdan geçenlerden yola çıkarak size şunu öneririm» (با تکیه بر آنچه بر من گذشته...).',
    rows: [
      ['Benim başımdan geçenlerden yola çıkarak erken yola çıkmanızı içtenlikle öneririm.', 'با تکیه بر آنچه بر سر من آمده، شدیداً توصیه می‌کنم زودتر راه بیفتید.', 'بهنایم باشیمدان گهچهنلهردهن یلا چیکاراک هرکهن یلا چیکمانیزی ایچتهنلایکله اونهرایرایم٫', 'yola çıkmanızı', 'راه افتادنتان را', 'الگوی توصیهٔ مبتنی بر تجربه: başımdan geçenlerden yola çıkarak + -manızı öneririm'],
      ['Yaşadığım benzer bir durumda aceleci kararlar pahalıya mal oluyor.', 'تجربهٔ مشابهی که داشتم نشان می‌دهد تصمیم‌های عجولانه پرهزینه تمام می‌شوند.', 'یاشادیغیم بهنزهر بایر درمدا اجهلهجای کارارلار پاهالییا مال لیر٫', 'pahalıya mal oluyor', 'پرهزینه تمام می‌شود', 'الگوی توصیهٔ مبتنی بر تجربه: başımdan geçenlerden yola çıkarak + -manızı öneririm'],
      ['Deneyimlerime dayanarak belgelerinizi önceden yedeklemenizi tavsiye ederim.', 'بر اساس تجربه‌ام توصیه می‌کنم از قبل مدارکتان را ذخیره کنید.', 'دهنهیایملهرایمه دایاناراک بهلگهلهراینایزای اونجهدهن یهدهکلهمهنایزای تاوساییه هدهرایم٫', 'yedeklemenizi', 'پشتیبان گرفتن‌تان را', 'الگوی توصیهٔ مبتنی بر تجربه: başımdan geçenlerden yola çıkarak + -manızı öneririm'],
      ['Bu konuda bir ders aldım; o yüzden kimseye körü körüne güvenmemeyi öğrendim.', 'در این مورد درس گرفتم؛ به همین خاطر آموختم به هیچ‌کس بی‌چشم‌بسته اعتماد نکنم.', 'ب کندا بایر دهرس الدیم؛ یاوزدهن کایمسهیه کاوراو کاوراونه گاووهنمهمهیای اوغرهندایم٫', 'körüne güvenmemeyi', 'بی‌thinking اعتماد نکردن را', 'الگوی توصیهٔ مبتنی بر تجربه: başımdan geçenlerden yola çıkarak + -manızı öneririm'],
      ['Geçmişteki hatalarımdan ders çıkararak her adımı yazılı hâle getirmeyi alışkanlık yaptım.', 'با درس گرفتن از اشتباهات گذشته‌ام، مکتوب کردن هر مرحله را عادت کردم.', 'گهچمایشتهکای هاتالاریمدان دهرس چیکاراراک ههر ادیمی یازیلی هâله گهتایرمهیای الیشکانلیک یاپتیم٫', 'hâle getirmeyi', 'به habit درآوردن را', 'الگوی توصیهٔ مبتنی بر تجربه: başımdan geçenlerden yola çıkarak + -manızı öneririm'],
      ['Tecrübelerim gösteriyor ki sabırlı olmak uzun vadede her zaman kazandırır.', 'تجربه‌ام نشان می‌دهد صبر کردن در بلندمدت همیشه برنده است.', 'تهجراوبهلهرایم گاوستهراییر کای سابیرلی لماک زن وادهده ههر زامان کازاندیریر٫', 'uzun vadede', 'در بلندمدت', 'الگوی توصیهٔ مبتنی بر تجربه: başımdan geçenlerden yola çıkarak + -manızı öneririm'],
      ['Benzer bir projede çalıştığım için zorlukların nereden kaynaklanacağını tahmin edebiliyorum.', 'چون در پروژهٔ مشابهی کار کرده‌ام می‌توانم حدس بزنم دشواری‌ها از کجا ناشی می‌شوند.', 'بهنزهر بایر پرژهده چالیشتیغیم ایچاین زرلکلارین نهرهدهن کایناکلاناجاغینی تاهماین هدهبایلاییرم٫', 'tahmin edebiliyorum', 'می‌توانم حدس بزنم', 'الگوی توصیهٔ مبتنی بر تجربه: başımdan geçenlerden yola çıkarak + -manızı öneririm'],
      ['Kendi deneyimlerimden yola çıkarak bu kararı vermeden önce iki kez düşünmenizi öneririm.', 'با تکیه بر تجربهٔ خودم توصیه می‌کنم پیش از گرفتن این تصمیم دو بار فکر کنید.', 'کهندای دهنهیایملهرایمدهن یلا چیکاراک ب کاراری وهرمهدهن اونجه ایکای کهز داوشاونمهنایزای اونهرایرایم٫', 'iki kez düşünmenizi', 'دو بار فکر کردن‌تان را', 'الگوی توصیهٔ مبتنی بر تجربه: başımdan geçenlerden yola çıkarak + -manızı öneririm'],
    ],
    dialogue: [
      ['parisa', 'Yeni eve taşınırken nelere dikkat etmem gerektiğini söylersen sevinirim.', 'اگر بگویی هنگام اسباب‌کشی به چه نکاتی باید توجه کنم خوشحال می‌شوم.'],
      ['arman', 'Benim başımdan geçenlerden yola çıkarak nakliye şirketini önceden arayıp yazılı fiyat almanı öneririm.', 'با تکیه بر آنچه بر من گذشته توصیه می‌کنم شرکت باربری را از قبل تلفنی arayıp قیمت مکتوب بگیری.'],
      ['parisa', 'Çok iyi bir nokta! Başka bir önerin var mı?', 'نکتهٔ خیلی خوبی است! پیشنهاد دیگری داری؟'],
      ['arman', 'Evet, kutuları oda oda etiketle; böylece yeni evde aradığını kolayca bulursun.', 'بله، جعبه‌ها را اتاق‌به‌اتاق برچسب بزن؛ این‌طوری در خانهٔ جدید پیدا می‌کنی.'],
    ],
    checks: [
      {
        promptFa: 'ساختار «... yola çıkarak» در توصیه‌دادن یعنی چه؟',
        choices: ['با تکیه بر / بر اساسِ تجربهٔ...', 'با وجودِ', 'بدونِ'],
        correctIndex: 0,
        explanationFa: 'yola çıkmak یعنی «راه افتادن»؛ با پسوند -arak می‌شود «با تکیه بر...» (yola çıkarak).',
      },
      {
        promptFa: 'عبارت «uzun vadede kazandırır» به چه معناست؟',
        choices: ['در بلندمدت سود/فایده به همراه دارد', 'فوراً ضرر می‌رساند', 'فقط در کوتاه‌مدت'],
        correctIndex: 0,
        explanationFa: 'uzun vade یعنی بلندمدت؛ kazandırmak یعنی سود رساندن.',
      },
    ],
  },

  /* ۲۰. توضیح علت و پیامد تصمیم‌ها */
  {
    id: 'tr-b1-s-20-decision-causes-consequences',
    title: 'توضیح علت و پیامد تصمیم‌ها',
    subtitle: 'Survival · تحلیل منطقی تصمیم، причин и پیامدها و bài học',
    situation: 'یک تصمیم مهم را توضیح می‌دهید: چرا گرفته شد، چه نتایجی داشت و چه bài‌آموزی‌هایی به جا گذاشت.',
    teachingFa: 'برای تحلیل تصمیم: «Bu kararı ... nedeniyle aldım»، «bunun sonucunda ... oldu» و «bu deneyim bana ... öğretti».',
    rows: [
      ['Bu kararı veri yetersizliğinden dolayı ertelemek zorunda kaldık.', 'ناگزیر شدیم به علت کمبود داده این تصمیم را به تعویق بیندازیم.', 'ب کاراری وهرای یهتهرسایزلایغایندهن دلایی هرتهلهمهک زرندا کالدیک٫', 'veri yetersizliğinden', 'به علت کمبود داده', 'الگوی تحلیل تصمیم: ... nedeniyle + ... sonucunda + ... öğretti'],
      ['Şehir değiştirme kararımın arkasında ailevi nedenler vardı; bu yüzden taşındık.', 'پشت تصمیم من برای تغییر شهر دلایل خانوادگی بود؛ به همین خاطر نقل مکان کردیم.', 'شههایر دهغایشتایرمه کاراریمین ارکاسیندا اایلهوای نهدهنلهر واردی؛ ب یاوزدهن تاشیندیک٫', 'ailevi nedenler', 'دلایل خانوادگی', 'الگوی تحلیل تصمیم: ... nedeniyle + ... sonucunda + ... öğretti'],
      ['Bu kararı verirken uzun vadeli maliyetleri de hesaba kattık.', 'ما هنگام گرفتن این تصمیم هزینه‌های بلندمدت را هم در نظر گرفتیم.', 'ب کاراری وهرایرکهن زن وادهلای مالاییهتلهرای ده ههسابا کاتتیک٫', 'hesaba kattık', 'به حساب آوردیم', 'الگوی تحلیل تصمیم: ... nedeniyle + ... sonucunda + ... öğretti'],
      ['Kararın bir sonucu olarak ekip içindeki rollerimiz yeniden şekillendi.', 'به عنوان یکی از پیامدهای تصمیم، نقش‌هایمان در تیم دوباره شکل گرفت.', 'کارارین بایر سنج لاراک هکایپ ایچایندهکای رللهرایمایز یهنایدهن شهکایللهندای٫', 'yeniden şekillendi', 'دوباره شکل گرفت', 'الگوی تحلیل تصمیم: ... nedeniyle + ... sonucunda + ... öğretti'],
      ['Bu deneyim bana acele etmeden önce tüm seçenekleri değerlendirmem gerektiğini öğretti.', 'این تجربه به من آموخت که پیش از عجله کردن باید همهٔ گزینه‌ها را ارزیابی کنم.', 'ب دهنهیایم بانا اجهله هتمهدهن اونجه تاوم سهچهنهکلهرای دهغهرلهندایرمهم گهرهکتایغاینای اوغرهتتای٫', 'değerlendirmem gerektiğini', 'اینکه باید ارزیابی کنم را', 'الگوی تحلیل تصمیم: ... nedeniyle + ... sonucunda + ... öğretti'],
      ['Sonuç olarak bu karar beklediğimizden daha olumlu bir etki yarattı.', 'در نتیجه این تصمیم اثری مثبت‌تر از انتظار ما داشت.', 'سنچ لاراک ب کارار بهکلهدایغایمایزدهن داها لمل بایر هتکای یاراتتی٫', 'beklediğimizden daha', 'بیش از آنچه انتظار داشتیم', 'الگوی تحلیل تصمیم: ... nedeniyle + ... sonucunda + ... öğretti'],
      ['Alınan kararın dolaylı etkileri haftalar sonra ortaya çıktı.', 'اثرات غیرمستقیم تصمیم گرفته‌شده هفته‌ها بعد خودش را نشان داد.', 'آلینان کارارین دلایلی هتکایلهرای هافتالار سنرا رتایا چیکتی٫', 'dolaylı etkileri', 'اثرات غیرمستقیم', 'الگوی تحلیل تصمیم: ... nedeniyle + ... sonucunda + ... öğretti'],
      ['Geriye dönüp baktığımda bu kararın zamanlama açısından doğru olduğunu görüyorum.', 'وقتی به گذشته نگاه می‌کنم می‌بینم این تصمیم از نظر زمان‌بندی درست بوده است.', 'گهراییه داوناوپ باکتیغیمدا ب کارارین زامانلاما اچیسیندان دغر لدغن گاوراویرم٫', 'zamanlama açısından', 'از نظر زمان‌بندی', 'الگوی تحلیل تصمیم: ... nedeniyle + ... sonucunda + ... öğretti'],
    ],
    dialogue: [
      ['sara', 'Geçen ay verdiğin iş değiştirme kararı arkasında ne vardı?', 'پشت تصمیم ماه گذشته‌ات برای تغییر کار چه چیزی بود؟'],
      ['murtaza', 'Maaşın yetersiz kaldığı için bu kararı aldım; ancak yeni işte gelişim olanakları çok daha fazlaydı.', 'حقوق کافی نبود به همین تصمیم گرفتم؛ اما در کار جدید فرصت‌های پیشرفت خیلی بیشتر بود.'],
      ['sara', 'Peki bu kararın sonuçları nasıldı?', 'خب پیامدهای این تصمیم چه بود؟'],
      ['murtaza', 'Sonuç olarak hem gelirim arttı hem de daha dengeli bir tempoya kavuştum.', 'در نتیجه هم درآمدم افزایش یافت هم به ریتم متعادل‌تری رسیدم.'],
    ],
    checks: [
      {
        promptFa: 'در تحلیل یک تصمیم «... arkasında» یعنی چه؟',
        choices: ['پشتِ آن، یعنی علت اصلیِ آن', 'روبروی آن', 'پیش از آن در صف'],
        correctIndex: 0,
        explanationFa: '«kararın arkasında ... vardı» یعنی «پشت این تصمیم ... وجود داشت».',
      },
      {
        promptFa: 'تفاوت «sonuç olarak» و «dolaylı etkiler» چیست؟',
        choices: ['اولی نتیجهٔ مستقیم و دومی پیامد غیرمستقیم است', 'هر دو فقط در آینده‌اند', 'هیچ‌کدام به تصمیم ربطی ندارند'],
        correctIndex: 0,
        explanationFa: 'dolaylı یعنی غیرمستقیم؛ dolaylı etkiler همان پیامدهای غیرمستقیم تصمیم هستند.',
      },
    ],
  },

  /* ۲۱. مقایسه راهکارها و ارزیابی مزایا و معایب */
  {
    id: 'tr-b1-s-21-comparing-solutions-pros-cons',
    title: 'مقایسه راهکارها و ارزیابی مزایا و معایب',
    subtitle: 'Survival · مقایسهٔ گزینه‌ها، بده‌بستان، تحلیل ریسک و انتخاب بهینه',
    situation: 'برای حل یک چالش کاری چند راهکار را می‌سنجید و مزایا، معایب و ریسک هر کدام را مقایسه می‌کنید.',
    teachingFa: 'واژگان مقایسهٔ راهکار: avantaj / dezavantaj، trade-off (بده‌بستان)، risk analizi و en uygun seçenek (مناسب‌ترین گزینه).',
    rows: [
      ['Her iki seçeneğin de avantajları ve dezavantajları var; bu yüzden dikkatli tartmamız gerekir.', 'هر دو گزینه هم مزایا دارند هم معایب؛ به همین خاطر باید با دقت بسنجیم.', 'ههر ایکای سهچهنهغاین ده اوانتاژلاری وه دهزاوانتاژلاری وار؛ ب یاوزدهن دایککاتلای تارتمامیز گهرهکایر٫', 'avantajları ve dezavantajları', 'مزایا و معایب آن', 'الگوی مقایسهٔ گزینه: avantaj/dezavantaj + trade-off + ağır basıyor'],
      ['Hızlı çözüm maliyet açısından cazip ama kalıcı bir fayda sağlamıyor.', 'راه‌حل سریع از نظر هزینه وسوسه‌کننده است اما فایدهٔ ماندگاری ندارد.', 'هیزلی چاوزاوم مالاییهت اچیسیندان جازایپ اما کالیجی بایر فایدا ساغلامییر٫', 'kalıcı bir fayda', 'فایدهٔ ماندگار', 'الگوی مقایسهٔ گزینه: avantaj/dezavantaj + trade-off + ağır basıyor'],
      ['Uzun vadede en uygun seçenek kaliteyi koruyan ama ilk maliyeti yüksek olan seçenektir.', 'در بلندمدت مناسب‌ترین گزینه همان است که کیفیت را حفظ می‌کند هرچند هزینهٔ اولیه‌اش بالاست.', 'زن وادهده هن یگن سهچهنهک کالایتهیای کریان اما ایلک مالاییهتای یاوکسهک لان سهچهنهکتایر٫', 'en uygun seçenek', 'مناسب‌ترین گزینه', 'الگوی مقایسهٔ گزینه: avantaj/dezavantaj + trade-off + ağır basıyor'],
      ['Bu iki yaklaşım arasındaki temel fark riskin kim tarafından üstlenildiğidir.', 'تفاوت اصلی این دو رویکرد در این است که ریسک را چه کسی به دوش می‌کشد.', 'ب ایکای یاکلاشیم اراسینداکای تهمهل فارک رایسکاین کایم تارافیندان اوستلهنایلدایغایدایر٫', 'kim tarafından', 'توسط چه کسی', 'الگوی مقایسهٔ گزینه: avantaj/dezavantaj + trade-off + ağır basıyor'],
      ['Maliyet-fayda dengesini hesaplarken yalnızca parasal girdileri değil zaman maliyetini de ekledik.', 'هنگام محاسبهٔ تعادل هزینه‌فایده فقط ورودی‌های مالی را در نظر نگرفتیم، هزینهٔ زمانی را هم اضافه کردیم.', 'مالاییهت‌فایدا دهنگهساینای ههساپلارکهن یالنیزجا پاراسال گایردایلهرای دهغایل زامان مالاییهتاینای ده هکلهدایک٫', 'zaman maliyetini', 'هزینهٔ زمانی را', 'الگوی مقایسهٔ گزینه: avantaj/dezavantaj + trade-off + ağır basıyor'],
      ['Senaryo analizine göre en kötü durumda bile zararı sınırlı tutabiliyoruz.', 'طبق تحلیل سناریو حتی در بدترین حالت هم می‌توانیم ضرر را محدود نگه داریم.', 'سهناری انالایزاینه گاوره هن کاوتاو درمدا بایله زاراری سینیرلی تتابایلاییرز٫', 'en kötü durumda', 'در بدترین حالت', 'الگوی مقایسهٔ گزینه: avantaj/dezavantaj + trade-off + ağır basıyor'],
      ['Bu iki yöntem arasındaki trade-off bellidir: biri hız, diğeri kalite.', 'بده‌بستان میان این دو روش مشخص است: یکی سرعت، دیگری کیفیت.', 'ب ایکای یاونتهم اراسینداکای تراده‌فف بهللایدایر: بایرای هیز، دایغهرای کالایته٫', 'trade-off', 'بده‌بستان', 'الگوی مقایسهٔ گزینه: avantaj/dezavantaj + trade-off + ağır basıyor'],
      ['Tüm faktörleri göz önünde bulundurduğumuzda ikinci seçenek ağır basıyor.', 'با در نظر گرفتن همهٔ عوامل گزینهٔ دوم می‌چربد.', 'تاوم فاکتاورلهرای گاوز اوناونده بلندردغمزدا ایکاینجای سهچهنهک اغیر باسییر٫', 'ağır basıyor', 'سنگین‌تر است / می‌چربد', 'الگوی مقایسهٔ گزینه: avantaj/dezavantaj + trade-off + ağır basıyor'],
    ],
    dialogue: [
      ['hamid', 'Bu sorunu çözmek için iki yol var: hızlı ama yüzeysel mi yoksa yavaş ama kalıcı mı?', 'برای حل این مشکل دو راه هست: سریع اما سطحی، یا کند اما ماندگار؟'],
      ['leila', 'Bence uzun vadede kalıcı çözüm daha mantıklı; çünkü tekrar eden maliyetleri ortadan kaldırıyor.', 'به نظرم در بلندمدت راه‌حل ماندگار منطقی‌تر است؛ چون هزینه‌های تکرارشونده را حذف می‌کند.'],
      ['hamid', 'Ancak hızlı çözüm bu çeyrek raporun teslimini kurtarabilir, değil mi?', 'اما راه‌حل سریع می‌تواند گزارش این فصل را نجات دهد، مگر نه؟'],
      ['leila', 'Evet, o noktada trade-off devreye giriyor; kısa vadeli baskı kazansa da uzun vadede kalite ağır basıyor.', 'بله، آنجاست که بده‌بستان وارد عمل می‌شود؛ هرچند فشار کوتاه‌مدت برنده شود در بلندمدت کیفیت می‌چربد.'],
    ],
    checks: [
      {
        promptFa: 'در مقایسهٔ گزینه‌ها «ağır basıyor» یعنی چه؟',
        choices: ['کفهٔ آن سنگین‌تر است / می‌چربد / برتری دارد', 'کاملاً رد می‌شود', 'مساوی است'],
        correctIndex: 0,
        explanationFa: 'ağır basmak کنایهٔ ترازو است؛ یعنی آن گزینه در مقایسه برتری دارد.',
      },
      {
        promptFa: 'واژهٔ «trade-off» در ترکی استانبولی چه مفهومی دارد؟',
        choices: ['بده‌بستان؛ از دست دادن چیزی برای به دست آوردن چیز دیگر', 'قرارداد.element', 'گزارش مالی سالانه'],
        correctIndex: 0,
        explanationFa: 'trade-off یعنی بده‌بستان (ödünleşim).',
      },
    ],
  },

  /* ۲۲. صحبت درباره فرهنگ‌ها و تفاوت‌های اجتماعی */
  {
    id: 'tr-b1-s-22-cultures-social-differences',
    title: 'صحبت درباره فرهنگ‌ها و تفاوت‌های اجتماعی',
    subtitle: 'Survival · مقایسهٔ culturelles، آداب معاشرت، پیش-daوری‌ها و احترام متقابل',
    situation: 'دربارهٔ تفاوت‌های فرهنگی میان کشورها درagio milit주,endige, официальность و پوشش با احترام صحبت می‌کنید.',
    teachingFa: 'واژگان comparatif فرهنگی: kültürel farklar (تفاوت‌های فرهنگی)، gelenek-görenek (آداب و رسوم)، önyargı (پیش-daوری)، hoşgörü (بردباری) و saygı (احترام).',
    rows: [
      ['Farklı kültürlerde selamlaşma biçimleri birbirinden oldukça farklı olabiliyor.', 'شیوه‌های سلام و احوال‌پرسی در فرهنگ‌های مختلف می‌تواند کاملاً متفاوت باشد.', 'فارکلی کاولتاورلهرده سهلاملاشما بایچایملهرای بایربایرایندهن لدکچا فارکلی لابایلاییر٫', 'selamlaşma biçimleri', 'شیوه‌های سلام و احوال‌پرسی', 'الگوی مقایسهٔ فرهنگی: ...-de farklı + birey olarak + saygı duymak'],
      ['Bazı toplumlarda doğrudan soru sormak saygısızlık olarak algılanabilir.', 'در برخی جوامع پرسیدن سؤال مستقیم ممکن است بی‌احترامی تلقی شود.', 'بازی تپلملاردا دغردان سر سرماک سایگیسیزلیک لاراک الگیلانابایلایر٫', 'doğrudan soru sormak', 'پرسش مستقیم', 'الگوی مقایسهٔ فرهنگی: ...-de farklı + birey olarak + saygı duymak'],
      ['Geleneksel yemek kültürü aile bağlarını güçlendiren önemli bir unsurdur.', 'فرهنگ سنتی غذا عاملی مهم در تقویت پیوندهای خانوادگی است.', 'گهلهنهکسهل یهمهک کاولتاوراو اایله باغلارینی گاوچلهندایرهن اونهملای بایر نسردر٫', 'aile bağlarını', 'پیوندهای خانوادگی را', 'الگوی مقایسهٔ فرهنگی: ...-de farklı + birey olarak + saygı duymak'],
      ['Başka bir ülkeye taşınınca en çok zorlandığım şey farklı resmiyet kuralları oldu.', 'وقتی به کشور دیگری نقل مکان کردم سخت‌ترین چیز برایم قواعد متفاوت تشریفات بود.', 'باشکا بایر اولکهیه تاشینینجا هن چک زرلاندیغیم شهی فارکلی رهسماییهت کراللاری لد٫', 'resmiyet kuralları', 'قواعد تشریفات', 'الگوی مقایسهٔ فرهنگی: ...-de farklı + birey olarak + saygı duymak'],
      ['Kültürel önyargılara kapılmadan insanları birey olarak tanımak gerekir.', 'باید بدون پیش-daوری‌های فرهنگی، افراد را به‌عنوان فرد بشناسیم.', 'کاولتاورهل اونیارگیلارا کاپیلمادان اینسانلاری بایرهی لاراک تانیماک گهرهکایر٫', 'birey olarak', 'به‌عنوان فرد', 'الگوی مقایسهٔ فرهنگی: ...-de farklı + birey olarak + saygı duymak'],
      ['Yurt dışında yaşadığım süre bana hoşgörülü olmayı öğretti.', 'مدتی که خارج از کشور زندگی کردم به من بردباری آموخت.', 'یرت دیشیندا یاشادیغیم ساوره بانا هشگاوراولاو لمایی اوغرهتتای٫', 'hoşgörülü olmayı', 'بردباری را', 'الگوی مقایسهٔ فرهنگی: ...-de farklı + birey olarak + saygı duymak'],
      ['Her kültürün kendine özgü değerleri vardır; bunlara saygı duymalıyız.', 'هر فرهنگ ارزش‌های خاص خودش را دارد؛ باید به آن‌ها احترام بگذاریم.', 'ههر کاولتاوراون کهنداینه اوزگاو دهغهرلهرای واردیر؛ بنلارا سایگی دیمالیییز٫', 'saygı duymalıyız', 'باید احترام بگذاریم', 'الگوی مقایسهٔ فرهنگی: ...-de farklı + birey olarak + saygı duymak'],
      ['Farklı sosyal normlar ilk başta garip görünse de zamanla normalleşiyor.', 'هنجارهای اجتماعی متفاوت در ابتدا عجیب به نظر می‌رسد اما به مرور عادی می‌شود.', 'فارکلی سسیال نرملار ایلک باشتا گارایپ گاوراونسه ده زامانلا نرماللهشاییر٫', 'sosyal normlar', 'هنجارهای اجتماعی', 'الگوی مقایسهٔ فرهنگی: ...-de farklı + birey olarak + saygı duymak'],
    ],
    dialogue: [
      ['hoca', 'Yurt dışında ilk karşılaştığın kültürel fark neydi?', 'اولین تفاوت فرهنگی که خارج از کشور با آن روبه‌رو شدی چه بود؟'],
      ['elmas', 'İnsanlar doğrudan soru sormadığında önce nazikçe dinlemeyi öğrendim.', 'وقتی آدم‌ها مستقیم سؤال نمی‌پرسیدند ابتدا با ملایمت گوش دادم.'],
      ['hoca', 'Peki bu farklara nasıl uyum sağladın?', 'خب چطور با این تفاوت‌ها سازگار شدی؟'],
      ['elmas', 'Önce gözlemleyip sonra saygılı sorular sordum; böylece hem kendimi hem karşımdakini rahatlattım.', 'اول مشاهده کردم و بعد سؤال‌های مؤدبانه پرسیدم؛ این‌طوری هم خودم و هم طرف مقابلم راحت بودم.'],
    ],
    checks: [
      {
        promptFa: 'عبارت «birey olarak tanımak» یعنی چه؟',
        choices: ['شناختن افراد به‌عنوان فرد (نه کلیشه)', 'شناختن فقط باイス', 'تحلیل travelers'],
        correctIndex: 0,
        explanationFa: 'birey یعنی فرد؛ یعنی هرکس را مستقل از کلیشه‌ها بشناسیم.',
      },
      {
        promptFa: 'واژهٔ «hozgörülü» به چه معناست؟',
        choices: ['بردبار / با سعهٔ صدر', 'بی‌تفاوت', 'عجول'],
        correctIndex: 0,
        explanationFa: 'hozgörülü یعنی بردBar/صبور و با سعهٔ صدر.',
      },
    ],
  },

  /* ۲۳. بیان احساسات و واکنش‌ها با جزئیات بیشتر */
  {
    id: 'tr-b1-s-23-detailed-emotions-reactions',
    title: 'بیان احساسات و واکنش‌ها با جزئیات بیشتر',
    subtitle: 'Survival · توصیف احساسات آمیخته، واکنش‌های ناگهانی و همدلی',
    situation: 'احساسات پیچیده‌تان را در برابر یک خبر یا رویداد — مثلاً Minerals happiness با استرس — با جزئیات بیان می‌کنید.',
    teachingFa: 'برای بیان احساسات B1: son derece (بی‌نهایت)، içtenlikle (صمیمانه)، bir hayli (به Snackbar قابل توجه)، karışık (آمیخته/مغشوش) و relieved (آسوده).',
    rows: [
      ['Haberi duyunca bir an şaşkınlıktan donakaldım, sonra içtenlikle sevindim.', 'وقتی خبر را شنیدم یک لحظه از تعجب сухой شدم، بعد صمیمانه خوشحال شدم.', 'هابهرای دینجا بایر ان شاشکینلیکتان دناکالدیم، سنرا ایچتهنلایکله سهوایندایم٫', 'donakaldım', 'یخ بستم / از تعجب dry شدم', 'الگوی بیان احساس: karışık duygular + son derece + anlıyorum'],
      ['Bu haber karşısında karışık duygular yaşıyorum; hem seviniyor hem endişeleniyorum.', 'در برابر این خبر احساسات متناقضی دارم؛ هم خوشحالم هم نگران.', 'ب هابهر کارشیسیندا کاریشیک دیگلار یاشییرم؛ ههم سهوایناییر ههم هندایشهلهناییرم٫', 'karışık duygular', 'احساسات متناقض', 'الگوی بیان احساس: karışık duygular + son derece + anlıyorum'],
      ['Sonuçları görünce içim bir hayli rahatladı; haftalardır bekliyordum.', 'وقتی نتایج را دیدم خیالم حسابی راحت شد؛ هفته‌ها بود انتظارش را می‌کشیدم.', 'سنچلاری گاوراونجه ایچایم بایر هایلای راهاتلادی؛ هافتالاردیر بهکلاییردم٫', 'rahatladı', 'راحت شد', 'الگوی بیان احساس: karışık duygular + son derece + anlıyorum'],
      ['Bu durum karşısında kendini nasıl hissettiğini anlıyorum; benzer bir durum yaşamıştım.', 'می‌فهمم در این وضعیت چه حسی داری؛ من هم وضع مشابهی را تجربه کرده بودم.', 'ب درم کارشیسیندا کهنداینای ناسیل هایسسهتتایغاینای انلییرم؛ بهنزهر بایر درم یاشامیشتیم٫', 'nasıl hissettiğini', 'چه حسی داری را', 'الگوی بیان احساس: karışık duygular + son derece + anlıyorum'],
      ['Seni bu kadar üzgün görmek beni de derinden etkiliyor.', 'اینکه تو را این‌قدر غمگین می‌بینم مرا هم عمیقاً تحت تأثیر قرار می‌دهد.', 'سهنای ب کادار اوزگاون گاورمهک بهنای ده دهرایندهن هتکایلاییر٫', 'derinden etkiliyor', 'عمیقاً تحت تأثیر قرار می‌دهد', 'الگوی بیان احساس: karışık duygular + son derece + anlıyorum'],
      ['Beklenmedik bu tepkiyi görünce ne diyeceğimi bilemedim.', 'وقتی این واکنش غیرمنتظره را دیدم نمی‌دانستم چه بگویم.', 'بهکلهنمهدایک ب تهپکاییای گاوراونجه نه داییهجهغایمای بایلهمهدایم٫', 'ne diyeceğimi', 'چه بگویم را', 'الگوی بیان احساس: karışık duygular + son derece + anlıyorum'],
      ['Zamanla bu duygunun geçeceğine eminim; sabırlı olmalısın.', 'مطمئنم با گذشت زمان این احساس از بین می‌رود؛ باید صبور باشی.', 'زامانلا ب دیگنن گهچهجهغاینه هماینایم؛ سابیرلی لمالیسین٫', 'sabırlı olmalısın', 'باید صبور باشی', 'الگوی بیان احساس: karışık duygular + son derece + anlıyorum'],
      ['Tepkin son derece anlaşılabilir; ben de senin yerinde olsam aynı şekilde tepki verirdim.', 'واکنشت کاملاً قابل درک است؛ من هم اگر جای تو بودم همان‌طور واکنش نشان می‌دادم.', 'تهپکاین سن دهرهجه انلاشیلابایلایر؛ بهن ده سهناین یهراینده لسام اینی شهکایلده تهپکای وهرایردایم٫', 'anlaşılabilir', 'قابل درک', 'الگوی بیان احساس: karışık duygular + son derece + anlıyorum'],
    ],
    dialogue: [
      ['kız kardeş', 'Sınav sonuçlarını aldın mı? Nasıl hissediyorsun?', 'نتایج امتحان را گرفتی؟ چه حسی داری؟'],
      ['erkek kardeş', 'Bir yandan seviniyorum ama bir yandan gelecek kaygısı yaşıyorum; karışık duygular içindeyim.', 'از یک طرف خوشحالم اما از طرف دیگر استرس آینده دارم؛ در احساسات متناقض‌ام.'],
      ['kız kardeş', 'Seni anlıyorum; ben de senin yerinde olsam aynısını hissederdim.', 'درکت می‌کنم؛ من هم اگر جای تو بودم دقیقاً همین حس را داشتم.'],
      ['erkek kardeş', 'Teşekkür ederim; bu destek gerçekten moralimi yerine getirdi.', 'ممنون؛ این حمایت واقعاً روحیه‌ام را بالا برد.'],
    ],
    checks: [
      {
        promptFa: 'در توصیف احساسات «karışık duygular» یعنی چه؟',
        choices: ['احساسات متناقض یا آمیخته (مثلاً هم خوشحالی هم نگرانی)', 'فقط buitsuzluk', 'تنها نشاط'],
        correctIndex: 0,
        explanationFa: 'karışık یعنی آمیخته؛ karışık duygular یعنی ترکیبی از احساسات مختلف.',
      },
      {
        promptFa: 'واژهٔ «anlaşılabilir» در «tepkin anlaşılabilir» به چه معناست؟',
        choices: ['قابل درک', 'عجیب و غیرقابل پیش‌بینی', 'نادر'],
        correctIndex: 0,
        explanationFa: 'anlaşılabilir یعنی قابل درک؛ tepkin anlaşılabilir یعنی واکنش قابل درک است.',
      },
    ],
  },

  /* ۲۴. شرکت در گفت‌وگوهای طولانی با موضوع مشخص */
  {
    id: 'tr-b1-s-24-long-focused-conversations',
    title: 'شرکت در گفت‌وگوهای طولانی با موضوع مشخص',
    subtitle: 'Survival · حفظ موضوع، углубление با مثال و گذارهای سازنده در گفتگوی طولانی',
    situation: 'در یک گفتگوی طولانی با موضوع مشخص (مثلاً آموزش یا سلامت) موضوع را حفظ می‌کنید و با مثال پیش می‌برید.',
    teachingFa: 'برای گفتگوی طولانی: «Konumuza dönersek...»، «Bu örneği somutlaştırırsak...»، «Başka bir açıdan bakarsak...» و «Özetle...».',
    rows: [
      ['Konumuza dönersek asıl meselemiz zaman yönetiminin verimsiz olması.', 'اگر به موضوع اصلی‌مان برگردیم مسئلهٔ اصلی ما بی‌کفایتی مدیریت زمان است.', 'کنمزا داونهرسهک اسیل مهسهلهمایز زامان یاونهتایمایناین وهرایمسایز لماسی٫', 'zaman yönetiminin', 'مدیریت زمان را', 'الگوی گفتگوی طولانی: konuya dönersek + somut örnek + başka bir açıdan'],
      ['Bu örneği somutlaştırırsak daha iyi anlaşılır.', 'اگر این مثال را ملموس کنیم بهتر قابل درک می‌شود.', 'ب اورنهغای سمتلاشتیریرساک داها اییای انلاشیلیر٫', 'somutlaştırırsak', 'ملموس کنیم', 'الگوی گفتگوی طولانی: konuya dönersek + somut örnek + başka bir açıdan'],
      ['Başka bir açıdan bakarsak maliyet unsurunu da göz ardı etmemeliyiz.', 'اگر از زاویهٔ دیگری نگاه کنیم نباید عامل هزینه را نادیده بگیریم.', 'باشکا بایر اچیدان باکارساک مالاییهت نسرن دا گاوز اردی هتمهمهلاییایز٫', 'göz ardı etmemeliyiz', 'نباید نادیده بگیریم', 'الگوی گفتگوی طولانی: konuya dönersek + somut örnek + başka bir açıdan'],
      ['Konuşmamız uzasa da ana fikri kaybetmemek için ara ara özet geçelim.', 'حتی اگر گفتگویمان طولانی شود برای از دست ندادن ایدهٔ اصلی هر از گاهی خلاصه کنیم.', 'کنشمامیز زاسا دا انا فایکرای کایبهتمهمهک ایچاین ارا ارا اوزهت گهچهلایم٫', 'ana fikri', 'ایدهٔ اصلی را', 'الگوی گفتگوی طولانی: konuya dönersek + somut örnek + başka bir açıdan'],
      ['Bu konuda uzun uzun konuşabiliriz çünkü her boyutunda farklı bir deneyim var.', 'دربارهٔ این موضوع می‌توانیم طولانی صحبت کنیم چون هر بعدش تجربهٔ متفاوتی دارد.', 'ب کندا زن زن کنشابایلایرایز چاونکاو ههر بیتندا فارکلی بایر دهنهیایم وار٫', 'her boyutunda', 'در هر بعدش', 'الگوی گفتگوی طولانی: konuya dönersek + somut örnek + başka bir açıdan'],
      ['Detaylara inerken ana konudan sapmamaya özen gösteriyorum.', 'وقتی وارد جزئیات می‌شوم دقت می‌کنم از موضوع اصلی منحرف نشوم.', 'دهتایلارا اینهرکهن انا کندان ساپمامایا اوزهن گاوستهراییرم٫', 'sapmamaya', 'منحرف نشدن را', 'الگوی گفتگوی طولانی: konuya dönersek + somut örnek + başka bir açıdan'],
      ['Bu uzun görüşme sonunda her iki taraf da uzlaştı.', 'در پایان این گفتگوی طولانی هر دو طرف به توافق رسیدند.', 'ب زن گاوراوشمه سنندا ههر ایکای تاراف دا زلاشتی٫', 'uzlaştı', 'به توافق رسید', 'الگوی گفتگوی طولانی: konuya dönersek + somut örnek + başka bir açıdan'],
      ['Konuyu tüm yönleriyle ele aldığımız için artık karara varabiliriz.', 'چون موضوع را از همهٔ جنبه‌ها بررسی کردیم حالا می‌توانیم تصمیم بگیریم.', 'کنی تاوم یاونلهراییله هله الدیغیمیز ایچاین ارتیک کارارا وارابایلایرایز٫', 'tüm yönleriyle', 'از همهٔ جنبه‌ها', 'الگوی گفتگوی طولانی: konuya dönersek + somut örnek + başka bir açıdan'],
    ],
    dialogue: [
      ['hoca', 'Bu konuyu biraz daha açalım; temel sorun sizce nerede?', 'بیا این موضوع را بیشتر باز کنیم؛ به نظرت ریشهٔ اصلی مشکل کجاست؟'],
      ['öğrenci', 'Konumuza dönersek bence temel sorun planlamanın yetersiz olması.', 'اگر به موضوع اصلی برگردیم به نظرم مشکل اصلی کافی نبودن برنامه‌ریزی است.'],
      ['hoca', 'Bu örneği somutlaştırırsak hangi adımda aksaklık yaşandığını görürüz?', 'اگر این مثال را ملموس کنیم می‌بینیم در کدام مرحله اختلال وجود داشته است؟'],
      ['öğrenci', 'Raporlama aşamasında veri kaybı olmuş; bu yüzden sonuçlar yanıltıcı çıkmış.', 'در مرحلهٔ گزارش‌دهی داده از بین رفته؛ به همین خاطر نتایج گمراه‌کننده بوده است.'],
    ],
    checks: [
      {
        promptFa: 'در گفتگوی طولانی عبارت «konumuza dönersek» یعنی چه؟',
        choices: ['اگر به موضوع اصلی‌مان برگردیم', 'اگر موضوع را کاملاً عوض کنیم', 'اگر پرونده را ببندیم'],
        correctIndex: 0,
        explanationFa: 'konumuza dönmek یعنی «به موضوع خودمان برگردیم».',
      },
      {
        promptFa: 'فعل «sapmak» در «ana konudan sapmamak» یعنی چه؟',
        choices: ['منحرف شدن / از مسیر اصلی دور شدن', 'متصل شدن', 'تمام کردن'],
        correctIndex: 0,
        explanationFa: 'sapmak یعنی منحرف شدن؛ sapmamak یعنی منحرف نشدن.',
      },
    ],
  },

  /* ۲۵. خلاصه‌کردن یک متن یا گفت‌وگو و بیان نظر دربارهٔ آن */
  {
    id: 'tr-b1-s-25-summarizing-text-conversation',
    title: 'خلاصه‌ کردن یک متن یا گفت‌وگو و بیان نظر دربارهٔ آن',
    subtitle: 'Survival · استخراج پیام اصلی، استدلال‌ها و بیان قضاوت شخصی',
    situation: 'پس از خواندن یک مقالهٔ بلند یا شنیدن یک گفتگوی طولانی نکات کلیدی آن را خلاصه می‌کنید و نظر شخصی‌تان را می‌گویید.',
    teachingFa: 'ساختارهای خلاصه + نظر: «Metnin ana fikri...»، «Yazarın temel iddiası...»، «Benim bu konudaki kanaatim ise...» و «Bu çıkarımdan şunu anlıyoruz ki...».',
    rows: [
      ['Metnin ana fikri dijital okuryazarlığın artık temel bir yaşam becerisi olduğudur.', 'ایدهٔ اصلی متن این است که سواد دیجیتال حالا یک مهارت پایهٔ زندگی است.', 'مهتناین انا فایکرای دایژایتال کریازارلیغین ارتیک تهمهل بایر یاشام بهجهرایسای لدغدر٫', 'ana fikri', 'ایدهٔ اصلی آن', 'الگوی خلاصه‌سازی: ana fikir + temel iddia + kanaatim + çıkarımdan anlıyoruz'],
      ['Konuşmacının temel iddiası erken planlamanın krizleri önlediğiydi.', 'ادعای اصلی سخنران این بود که برنامه‌ریزی زودهنگام از بحران جلوگیری می‌کند.', 'کنشماجینین تهمهل ایددایاسی هرکهن پلانلامانین کرایزلهرای اونلهدایغاییدای٫', 'temel iddiası', 'ادعای اصلی او', 'الگوی خلاصه‌سازی: ana fikir + temel iddia + kanaatim + çıkarımdan anlıyoruz'],
      ['Bu metinden çıkarılacak en önemli sonuç bireysel çabanın yeterli olmadığıdır.', 'مهم‌ترین نتیجه‌ای که از این متن گرفته می‌شود این است که تلاش فردی به‌تنهایی کافی نیست.', 'ب مهتایندهن چیکاریلاجاک هن اونهملای سنچ بایرهیسهل چابانین یهتهرلای لمادیغیدیر٫', 'en önemli sonuç', 'نتیجهٔ قابل استخراج', 'الگوی خلاصه‌سازی: ana fikir + temel iddia + kanaatim + çıkarımdan anlıyoruz'],
      ['Konuşmayı özetlemek gerekirse iki temel öneri sunuyordu.', 'اگر بخواهیم گفتگو را خلاصه کنیم گوینده دو پیشنهاد اصلی مطرح می‌کرد.', 'کنشمایی اوزهتلهمهک گهرهکایرسه ایکای تهمهل اونهرای سنیرد٫', 'özetlemek gerekirse', 'اگر بخواهیم خلاصه کنیم', 'الگوی خلاصه‌سازی: ana fikir + temel iddia + kanaatim + çıkarımdan anlıyoruz'],
      ['Benim bu konudaki kanaatim de pratikte ele alınması gerektiğidir.', 'نظر من دربارهٔ این موضوع هم این است که باید در عمل هم بررسی شود.', 'بهنایم ب کنداکای کانااتایم ده پراتایکته هله الینماسی گهرهکتایغایدایر٫', 'kanaatim', 'نظر/اعتقاد من', 'الگوی خلاصه‌سازی: ana fikir + temel iddia + kanaatim + çıkarımdan anlıyoruz'],
      ['Bu çıkarımdan şunu anlıyoruz ki teknoloji tek başına yeterli değil.', 'از این استنتاج می‌فهمیم که فناوری به‌تنهایی کافی نیست.', 'ب چیکاریمدان شن انلییرز کای تهکنلژای تهک باشینا یهتهرلای دهغایل٫', 'çıkarımdan', 'از استنتاج', 'الگوی خلاصه‌سازی: ana fikir + temel iddia + kanaatim + çıkarımdan anlıyoruz'],
      ['Metinde öne çıkan argümanlardan biri veri güvenliğiydi.', 'یکی از استدلال‌های برجستهٔ متن امنیت داده‌ها بود.', 'مهتاینده اونه چیکان ارگاومانلاردان بایرای وهرای گاووهنلایغاییدای٫', 'öne çıkan argümanlardan', 'از استدلال‌های برجسته', 'الگوی خلاصه‌سازی: ana fikir + temel iddia + kanaatim + çıkarımdan anlıyoruz'],
      ['Sonuç olarak metnin genel mesajı toplumsal dayanışmanın önemiydi.', 'خلاصه اینکه پیام کلی متن اهمیت همبستگی اجتماعی بود.', 'سنچ لاراک مهتناین گهنهل مهساژی تپلمسال دایانیشمانین اونهماییدای٫', 'genel mesajı', 'پیام کلی آن', 'الگوی خلاصه‌سازی: ana fikir + temel iddia + kanaatim + çıkarımdan anlıyoruz'],
    ],
    dialogue: [
      ['iş arkadaşı', 'Dünkü uzun makaleyi okudun mu? Ana mesajını kısaca özetler misin?', 'مقالهٔ طولانی دیروز را خواندی؟ پیام اصلی‌اش را کوتاه خلاصه می‌کنی؟'],
      ['negar', 'Evet metnin ana fikri dijital dönüşümün artık kaçınılmaz olduğuydu.', 'بله ایدهٔ اصلی متن این بود که تحول دیجیتال دیگر اجتناب‌ناپذیر است.'],
      ['iş arkadaşı', 'Peki sen bu konuda ne düşünüyorsun?', 'خب نظر خودت دربارهٔ این موضوع چیست؟'],
      ['negar', 'Benim kanaatim de bu yönde; ancak teknoloji kadar insan faktörüne de odaklanmalıyız.', 'نظر من هم همین است؛ اما باید به اندازهٔ فناوری به عامل انسانی هم توجه کنیم.'],
    ],
    checks: [
      {
        promptFa: 'در خلاصه‌سازی «metnin ana fikri» یعنی چه؟',
        choices: ['ایدهٔ اصلی / پیام مرکزی متن', 'آخرین پاراگراف متن', 'عنوان روی جلد'],
        correctIndex: 0,
        explanationFa: 'ana fikir یعنی ایدهٔ اصلی / پیام مرکزی.',
      },
      {
        promptFa: 'ساختار «...dan şunu anlıyoruz ki...» چه کاربردی دارد؟',
        choices: ['برای بیان استنتاجی که از چیزی گرفته می‌شود', 'برای رد کامل متن', 'برای پرسش مستقیم'],
        correctIndex: 0,
        explanationFa: '«bu ...-dan şunu anlıyoruz ki...» یعنی «از این نتیجه می‌گیریم که...».',
      },
    ],
  },

  /* ۲۶. ارائه کوتاه درباره یک موضوع آشنا */
  {
    id: 'tr-b1-s-26-short-presentation-familiar-topic',
    title: 'ارائه کوتاه درباره یک موضوع familiar',
    subtitle: 'Survival · ساختار ارائهٔ کوتاه (مقدمه-بخش اصلی-نتیجه)، مثال و پرسش مخاطبان',
    situation: 'یک ارائهٔ کوتاه دربارهٔ یک موضوع آشنا (مثلاً شهر خودتان یا شغل‌تان) به ترکی استانبولی ارائه می‌دهید.',
    teachingFa: 'ساختار ارائهٔ کوتاه: giriş (مقدمه)، gelişme (بخش اصلی با ۲-۳ نکته) و sonuç (جمع‌بندی).',
    rows: [
      ['Sunumuma İstanbul’un tarihi dokusundan bahsederek başlamak istiyorum.', 'می‌خواهم ارائه‌ام را با گفتن دربارهٔ بافت تاریخی استانبول شروع کنم.', 'سنمما ایستانبل’ن تارایهای دکسندان باهسهدهرهک باشلاماک ایستاییرم٫', 'sunumuma', 'ارائهٔ من را', 'الگوی ارائهٔ کوتاه: giriş + gelişme + sonuç + örnek + sorularınızı bekliyorum'],
      ['Öncelikle konunun ana hatlarını özetleyeyim: tarih, kültür ve ekonomi.', 'ابتدا خطوط کلی موضوع را خلاصه کنم: تاریخ، فرهنگ و اقتصاد.', 'اونجهلایکله کننن انا هاتلارینی اوزهتلهیهیایم: تارایه، کاولتاور وه هکنمای٫', 'ana hatlarını', 'خطوط اصلی را', 'الگوی ارائهٔ کوتاه: giriş + gelişme + sonuç + örnek + sorularınızı bekliyorum'],
      ['Birinci bölümde tarihsel yapıdan ikinci bölümde günlük yaşamdan söz edeceğim.', 'در بخش اول از ساختار تاریخی و در بخش دوم از زندگی روزمره صحبت خواهم کرد.', 'بایراینجای باولاومده تارایهسهل یاپیدان ایکاینجای باولاومده گاونلاوک یاشامدان ساوز هدهجهغایم٫', 'günlük yaşamdan', 'از زندگی روزمره', 'الگوی ارائهٔ کوتاه: giriş + gelişme + sonuç + örnek + sorularınızı bekliyorum'],
      ['Örneğin Sultanahmet bölgesi hem tarihi hem ticari açıdan canlı bir merkezdir.', 'مثلاً منطقهٔ سلطان احمد هم از نظر تاریخی و هم تجاری مرکزی زنده است.', 'اورنهغاین سلتاناهمهت باولگهسای ههم تارایهای ههم تایجارای اچیدان جانلی بایر مهرکهزدایر٫', 'canlı bir merkezdir', 'مرکز زنده/فعالی است', 'الگوی ارائهٔ کوتاه: giriş + gelişme + sonuç + örnek + sorularınızı bekliyorum'],
      ['İkinci olarak Boğaz köprüleri ulaşımda kritik bir rol oynuyor.', 'ثانیاً پل‌های بسفر نقش حیاتی در حمل‌ونقل دارند.', 'ایکاینجای لاراک بغاز کاوپراولهرای لاشیمدا کرایتایک بایر رل ینیر٫', 'kritik bir rol', 'نقش حیاتی', 'الگوی ارائهٔ کوتاه: giriş + gelişme + sonuç + örnek + sorularınızı bekliyorum'],
      ['Sonuç olarak İstanbul farklı katmanların bir arada yaşadığı benzersiz bir şehirdir.', 'در نتیجه استانبول شهری منحصربه‌فرد است که لایه‌های مختلف در کنار هم در آن زندگی می‌کنند.', 'سنچ لاراک ایستانبل فارکلی کاتمانلارین بایر ارادا یاشادیغی بهنزهرسایز بایر شههایردایر٫', 'benzersiz bir şehirdir', 'شهر منحصربه‌فرد است', 'الگوی ارائهٔ کوتاه: giriş + gelişme + sonuç + örnek + sorularınızı bekliyorum'],
      ['Sunumumu burada bitiriyorum; sorularınızı bekliyorum.', 'ارائه‌ام را اینجا تمام می‌کنم؛ منتظر پرسش‌های شما هستم.', 'سنمم برادا بایتایراییرم؛ سرلارینیزی بهکلاییرم٫', 'sorularınızı', 'پرسش‌هایتان را', 'الگوی ارائهٔ کوتاه: giriş + gelişme + sonuç + örnek + sorularınızı bekliyorum'],
      ['Açıklamam gereken bir nokta varsa lütfen çekinmeden sorun.', 'اگر نکته‌ای هست که باید توضیح دهم لطفاً بدون رودربایستی بپرسید.', 'آچیکلامام گهرهکهن بایر نکتا وارسا لاوتفهن چهکاینمهدهن سرن٫', 'çekinmeden', 'بدون رودربایستی', 'الگوی ارائهٔ کوتاه: giriş + gelişme + sonuç + örnek + sorularınızı bekliyorum'],
    ],
    dialogue: [
      ['sunucu', 'Şimdi kısa sunumunu dinleyelim; konun nedir?', 'حالا ارائهٔ کوتاهت را می‌شنویم؛ موضوعت چیست؟'],
      ['konuşmacı', 'Konum İstanbul’un mahalle kültürü; önce ana hatlarıyla özetleyeyim.', 'موضوعم فرهنگ محله‌ای استانبول است؛ اول خطوط کلی‌اش را خلاصه کنم.'],
      ['sunucu', 'Peki somut bir örnek verir misin?', 'خب یک مثال ملموس می‌دهی؟'],
      ['konuşmacı', 'Örneğin Kadıköy çarşısı her gün binlerce sakini bir araya getiriyor; sonuç olarak sunumumu burada bitiriyorum.', 'مثلاً بازار کادیکوی هر روز هزاران نفر از اهالی را گرد هم می‌آورد؛ در نتیجه ارائه‌ام را اینجا تمام می‌کنم.'],
    ],
    checks: [
      {
        promptFa: 'در ارائهٔ کوتاه «ana hatlarıyla» یعنی چه؟',
        choices: ['در خطوط کلی / به‌صورت خلاصه و کلی', 'با تمام جزئیات ریز', 'حاشیه‌نویسی'],
        correctIndex: 0,
        explanationFa: 'ana hatlarıyla یعنی «در خطوط اصلی»، یعنی خلاصهٔ کلی.',
      },
      {
        promptFa: 'فعل «çekinmeden» در «lütfen çekinmeden sorun» یعنی چه؟',
        choices: ['بدون رودmundo/رودربایستی', 'با ترس و احتیاط', 'با تأخیر زیاد'],
        correctIndex: 0,
        explanationFa: 'çekinmek یعنی خجالت کشیدن؛ çekinmeden یعنی بدون رودربایستی.',
      },
    ],
  },

  /* ۲۷. پاسخ‌گویی به پرسش‌های پیوسته و توضیح بیشتر */
  {
    id: 'tr-b1-s-27-follow-up-questions-elaboration',
    title: 'پاسخ‌گویی به پرسش‌های پیوسته و توضیح بیشتر',
    subtitle: 'Survival · پاسخ به follow-up questions، توضیح با détail و مثال',
    situation: 'پس از ارائه یا در جلسهٔ پرسش‌وپاسخ به پرسش‌های پیاپی با آرامش و مثال پاسخ می‌دهید.',
    teachingFa: 'عبارت‌های useful برای توضیح بیشتر: «Bunu biraz açarsam...»، «Somut bir örnek verirsek...»، «Yani kastettiğim şu ki...».',
    rows: [
      ['Bunu biraz açarsam kastettiğim şey şu: süreç tek aşamadan oluşmuyor.', 'اگر بازش کنم منظورم این است: فرایند از یک مرحله تشکیل نمی‌شود.', 'بن بایراز اچارسام کاستهتتایغایم شهی ش: ساورهچ تهک اشامادان لشمیر٫', 'kastettiğim şey', 'منظورم', 'الگوی توضیح بیشتر: bunu biraz açarsam + somut örnek + başka bir deyişle'],
      ['Somut bir örnek verirsek geçen yılın proje verileri bu durumu doğruluyor.', 'اگر مثال ملموسی بزنم داده‌های پروژهٔ پارسال این وضعیت را تأیید می‌کند.', 'سمت بایر اورنهک وهرایرسهک گهچهن ییلین پرژه وهرایلهرای ب درم دغرلیر٫', 'somut bir örnek', 'یک مثال ملموس', 'الگوی توضیح بیشتر: bunu biraz açarsam + somut örnek + başka bir deyişle'],
      ['Yani kastettiğim şu ki bu yöntem her koşulda işe yaramayabilir.', 'یعنی منظورم این است که این روش در همهٔ شرایط کاربرد ندارد.', 'یانای کاستهتتایغایم ش کای ب یاونتهم ههر کشلدا ایشه یارامایابایلایر٫', 'her koşulda', 'در همهٔ شرایط', 'الگوی توضیح بیشتر: bunu biraz açarsam + somut örnek + başka bir deyişle'],
      ['Bu soruyu detaylandırırsak üç temel faktör ortaya çıkıyor.', 'اگر این سؤال را با جزئیات بیشتری بررسی کنیم سه عامل اصلی پدیدار می‌شود.', 'ب سری دهتایلاندیریرساک اوچ تهمهل فاکتاور رتایا چیکییر٫', 'detaylandırırsak', 'اگر با جزئیات بررسی کنیم', 'الگوی توضیح بیشتر: bunu biraz açarsam + somut örnek + başka bir deyişle'],
      ['Başka bir deyişle olayların sırası sandığımızdan daha karmaşık.', 'به عبارت دیگر ترتیب رویدادها پیچیده‌تر از آن چیزی است که فکر می‌کردیم.', 'باشکا بایر دهیایشله لایلارین سیراسی ساندیغیمیزدان داها کارماشیک٫', 'başka bir deyişle', 'به عبارت دیگر', 'الگوی توضیح بیشتر: bunu biraz açarsam + somut örnek + başka bir deyişle'],
      ['Bu konuyu iki açıdan ele almakta fayda var: teknik ve insani boyut.', 'بررسی این موضوع از دو زاویهمفید است: بعد فنی و بعد انسانی.', 'ب کنی ایکای اچیدان هله الماکتا فایدا وار: تهکنایک وه اینسانای بیت٫', 'iki açıdan', 'از دو زاویه', 'الگوی توضیح بیشتر: bunu biraz açarsam + somut örnek + başka bir deyişle'],
      ['Ek bir açıklama gerekirse bu kuralın istisnaları da var.', 'اگر توضیح بیشتری لازم باشد این قانون استثناهایی هم دارد.', 'هک بایر اچیکلاما گهرهکایرسه ب کرالین ایستایسنالاری دا وار٫', 'istisnaları', 'استثناهایش', 'الگوی توضیح بیشتر: bunu biraz açarsam + somut örnek + başka bir deyişle'],
      ['Sorularınızı tek tek yanıtlamaktan memnuniyet duyarım.', 'با کمال میل به پرسش‌هایتان یکی‌یکی پاسخ می‌دهم.', 'سرلارینیزی تهک تهک یانیتلاماکتان مهمنناییهت دیاریم٫', 'tek tek', 'یکی‌یکی', 'الگوی توضیح بیشتر: bunu biraz açarsam + somut örnek + başka bir deyişle'],
    ],
    dialogue: [
      ['soru soran', 'Bu süreci biraz açar mısın? Tam olarak nasıl işliyor?', 'این فرایند را کمی باز می‌کنی؟ دقیقاً چطور کار می‌کند؟'],
      ['cevap veren', 'Bunu biraz açarsam önce veri toplanıyor sonra analiz ediliyor en sonunda rapor hazırlanıyor.', 'اگر بازش کنم اول داده جمع‌آوری می‌شود بعد تحلیل می‌شود در نهایت گزارش آماده می‌شود.'],
      ['soru soran', 'Peki bu yöntemin dezavantajı var mı?', 'خب آیا این روش معایبی هم دارد؟'],
      ['cevap veren', 'Somut bir örnek verirsek veri hacmi büyük olduğunda analiz süresi uzuyor; bu da önemli bir dezavantaj.', 'اگر مثال ملموسی بزنم وقتی حجم داده زیاد باشد زمان تحلیل طولانی می‌شود؛ این هم یک عیب مهم است.'],
    ],
    checks: [
      {
        promptFa: 'در توضیح بیشتر عبارت «bunu biraz açarsam» یعنی چه؟',
        choices: ['«اگر این را کمی باز کنم / توضیح بیشتری بدهم»', '«اگر این را ببندم»', '«اگر این را فراموش کنم»'],
        correctIndex: 0,
        explanationFa: 'açmak اینجا یعنی توضیح دادن؛ biraz açarsam یعنی «کمی بیشتر توضیح بدهم».',
      },
      {
        promptFa: 'عبارت «başka bir deyişle» هم‌معنی چیست؟',
        choices: ['به عبارت دیگر', 'برعکس', 'بدون جملهٔ قبلی'],
        correctIndex: 0,
        explanationFa: 'başka bir deyişle دقیقاً معادل «به عبارت دیگر» است.',
      },
    ],
  },

  /* ۲۸. بیان فرضیه‌ها و سناریوهای احتمالی */
  {
    id: 'tr-b1-s-28-hypotheses-probable-scenarios',
    title: 'بیان فرضیه‌ها و سناریوهای احتمالی',
    subtitle: 'Survival · فرضیه‌ها، سناریوهای محتمل، varsayım‌ها و درجهٔ احتمال',
    situation: 'برای یک پروژه سناریوهای مختلف را با درجهٔ احتمال بیان می‌کنید.',
    teachingFa: 'واژگان فرضیه: varsayım (فرض)، hipotez (فرضیه)، senaryo (سناریو)، olasılık (احتمال)، öngörü (پیش‌بینی) و makul (منطقی).',
    rows: [
      ['En olası senaryoya göre proje gelecek çeyrekte tamamlanacak.', 'طبق محتمل‌ترین سناریو پروژه در فصل آینده کامل خواهد شد.', 'هن لاسی سهنارییا گاوره پرژه گهلهجهک چهیرهکته تاماملاناجاک٫', 'en olası senaryoya göre', 'طبق محتمل‌ترین سناریو', 'الگوی فرضیه: en olası senaryo + hipotez + varsayım + olasılık'],
      ['Bu hipotezi destekleyen güçlü kanıtlar elimizde mevcut.', 'شواهد قوی‌ای در دست داریم که از این فرضیه پشتیبانی می‌کند.', 'ب هایپتهزای دهستهکلهیهن گاوچلاو کانیتلار هلایمایزده مهوجت٫', 'hipotezi destekleyen', 'پشتیبان‌کنندهٔ فرضیه', 'الگوی فرضیه: en olası senaryo + hipotez + varsayım + olasılık'],
      ['Makul varsayımlarla ilerlersek riski önemli ölçüde azaltırız.', 'اگر با فرض‌های منطقی پیش برویم ریسک را تا حد زیادی کاهش می‌دهیم.', 'ماکل وارساییملارلا ایلهرلهرسهک رایسکای اونهملای اولچاوده ازالتیریز٫', 'makul varsayımlarla', 'با فرض‌های منطقی', 'الگوی فرضیه: en olası senaryo + hipotez + varsayım + olasılık'],
      ['Alternatif senaryoda talep düşerse bütçeyi yeniden gözden geçirmemiz gerekir.', 'در سناریوی جایگزین اگر تقاضا کاهش یابد باید بودجه را دوباره بررسی کنیم.', 'آلتهرناتایف سهناریدا تالهپ داوشهرسه باوتچهیای یهنایدهن گاوزدهن گهچایرمهمایز گهرهکایر٫', 'alternatif senaryoda', 'در سناریوی جایگزین', 'الگوی فرضیه: en olası senaryo + hipotez + varsayım + olasılık'],
      ['Bu varsayımın gerçekleşme olasılığı bence düşük görünüyor.', 'به نظرم احتمال تحقق این فرض کم است.', 'ب وارساییمین گهرچهکلهشمه لاسیلیغی بهنجه داوشاوک گاوراوناویر٫', 'gerçekleşme olasılığı', 'احتمال تحقق', 'الگوی فرضیه: en olası senaryo + hipotez + varsayım + olasılık'],
      ['İyimser senaryoda tüm hedeflere ulaşırız.', 'در سناریوی خوش‌بینانه به همهٔ اهداف می‌رسیم.', 'اییایمسهر سهناریدا تاوم ههدهفلهره لاشیریز٫', 'iyimser senaryoda', 'در سناریوی خوش‌بینانه', 'الگوی فرضیه: en olası senaryo + hipotez + varsayım + olasılık'],
      ['Kötümser senaryoyu da unutmamalıyız; ona göre de önlem almalıyız.', 'سناریوی بدبینانه را هم نباید فراموش کنیم؛ باید طبق آن هم تدبیر بگیریم.', 'کاوتاومسهر سهناریی دا نتمامالیییز؛ نا گاوره ده اونلهم المالیییز٫', 'kötümser senaryoyu', 'سناریوی بدبینانه را', 'الگوی فرضیه: en olası senaryo + hipotez + varsayım + olasılık'],
      ['Tüm bu olasılıkları tarttığımızda en dengeli yol ara senaryodur.', 'وقتی همهٔ این احتمالات را می‌سنجیم متعادل‌ترین راه سناریوی میانه است.', 'تاوم ب لاسیلیکلاری تارتتیغیمیزدا هن دهنگهلای یل ارا سهناریدر٫', 'ara senaryodur', 'سناریوی میانه است', 'الگوی فرضیه: en olası senaryo + hipotez + varsayım + olasılık'],
    ],
    dialogue: [
      ['proje sorumlusu', 'Proje için kaç farklı senaryo öngörüyorsunuz?', 'برای پروژه چند سناریوی مختلف پیش‌بینی می‌کنید؟'],
      ['yonetici', 'Üç senaryomuz var: iyimser kötümser ve ara senaryo; en olası olanı ara senaryodur.', 'سه سناریو داریم: خوش‌بینانه بدبینانه و میانه؛ محتمل‌ترین‌شان میانه است.'],
      ['proje sorumlusu', 'Peki bu varsayımların gerçekleşme olasılıkları nedir?', 'احتمال تحقق این فرض‌ها چقدر است؟'],
      ['yonetici', 'Ara senaryonun olasılığı yüksek iyimserinki düşük; kötümser senaryoyu önlem planıyla yönetiyoruz.', 'احتمال سناریوی میانه بالاست خوش‌بینانه پایین؛ سناریوی بدبینانه را با برنامهٔ پیشگیری کنترل می‌کنیم.'],
    ],
    checks: [
      {
        promptFa: 'واژهٔ «varsayım» در کار speculatif به چه معناست؟',
        choices: ['فرض / انگارهٔ اولیه', 'حقیقت اثبات‌شده', 'گزارش نهایی'],
        correctIndex: 0,
        explanationFa: 'varsayım یعنی فرض؛ فرضیه‌ای که هنوز اثبات نشده است.',
      },
      {
        promptFa: 'تفاوت «iyimser senaryo» و «kötümser senaryo» چیست؟',
        choices: ['اولی سناریوی خوش‌بینانه و دومی بدبینانه است', 'هر دو یکسان‌اند', 'اولی گذشته و دومی آینده است'],
        correctIndex: 0,
        explanationFa: 'iyimser خوش‌بینانه و kötümser بدبینانه است.',
      },
    ],
  },

  /* ۲۹. بازگویی گفته‌ها و اطلاعات دریافت‌شده از دیگران */
  {
    id: 'tr-b1-s-29-retelling-others-information',
    title: 'بازگویی گفته‌ها و اطلاعات دریافت‌شده از دیگران',
    subtitle: 'Survival · نقل‌قول غیرمستقیم، ذکر منبع و انتقال اطلاعات',
    situation: 'گفته‌ها و اطلاعات دریافت‌شده از会议 یا đồng nghiệp را به‌صورت غیرمستقیم و دقیق به دیگران منتقل می‌کنید.',
    teachingFa: 'ساختارهای بازگویی: «... dedi ki...»، «...-e göre...» (طبقِ...) و «... aktardığına göre» (طبق گزارشِ...).',
    rows: [
      ['Müdüre göre toplantı yarın saat onda başlayacak.', 'طبق گفتهٔ مدیر جلسه فردا ساعت ده شروع می‌شود.', 'ماوداوره گاوره تپلانتی یارین ساات ندا باشلایاجاک٫', 'müdüre göre', 'طبق گفتهٔ مدیر', 'الگوی بازگویی: dedi ki + -e göre + aktardığına göre'],
      ['Arkadaşım dedi ki bu belgeyi yarın getirecek.', 'دوستم گفت که این مدرک را فردا می‌آورد.', 'آرکاداشیم دهدای کای ب بهلگهیای یارین گهتایرهجهک٫', 'dedi ki', 'گفت که', 'الگوی بازگویی: dedi ki + -e göre + aktardığına göre'],
      ['Bakanın açıklamasına göre yasa taslağı bu ay içinde oylanacak.', 'طبق اظهارات وزیر لایحهٔ قانونی در همین ماه به رأی گذاشته خواهد شد.', 'باکانین اچیکلاماسینا گاوره یاسا تاسلاغی ب ای ایچاینده یلاناجاک٫', 'açıklamasına göre', 'طبق اظهارات او', 'الگوی بازگویی: dedi ki + -e göre + aktardığına göre'],
      ['Haber ajansının aktardığına göre kapasite bu yıl iki katına çıkacak.', 'طبق گزارش خبرگزاری ظرفیت امسال دو برابر خواهد شد.', 'هابهر اژانسینین اکتاردیغینا گاوره کاپاسایته ب ییل ایکای کاتینا چیکاجاک٫', 'aktardığına göre', 'طبق گزارشِ', 'الگوی بازگویی: dedi ki + -e göre + aktardığına göre'],
      ['Konsolosluk memuru dedi ki başvuru sonuçları iki hafta içinde açıklanır.', 'کارمند کنسولگری گفت نتایج درخواست ظرف دو هفته اعلام می‌شود.', 'کنسلسلک مهمر دهدای کای باشور سنچلاری ایکای هافتا ایچاینده اچیکلانیر٫', 'açıklanır', 'اعلام می‌شود', 'الگوی بازگویی: dedi ki + -e göre + aktardığına göre'],
      ['Söylentilere göre yeni müdür haftaya göreve başlayacak.', 'طبق شایع مدیر جدید هفتهٔ آینده کارش را شروع می‌کند.', 'ساویلهنتایلهره گاوره یهنای ماوداور هافتایا گاورهوه باشلایاجاک٫', 'söylentilere göre', 'طبق شایع', 'الگوی بازگویی: dedi ki + -e göre + aktardığına göre'],
      ['Uzmanlar iklim değişikliğinin etkilerinin sandığımızdan hızlı ilerlediğini belirtiyor.', 'کارشناسان می‌گویند تأثیرات تغییر اقلیم سریع‌تر از آنچه فکر می‌کردیم پیش می‌رود.', 'زمانلار ایکلایم دهغایشایکلایغایناین هتکایلهرایناین ساندیغیمیزدان هیزلی ایلهرلهدایغاینای بهلایرتاییر٫', 'belirtiyor', 'بیان می‌کنند', 'الگوی بازگویی: dedi ki + -e göre + aktardığına göre'],
      ['Elde ettiğimiz bilgilere göre bu mekan her gün binlerce ziyaretçi ağırlıyor.', 'طبق اطلاعات به‌دست‌آمدهٔ ما این مکان هر روز هزاران بازدیدکننده دارد.', 'هلده هتتایغایمایز بایلگایلهره گاوره ب مهکان ههر گاون باینلهرجه زاییارهتچای اغیرلییر٫', 'elde ettiğimiz bilgilere göre', 'طبق اطلاعات به‌دست‌آمدهٔ ما', 'الگوی بازگویی: dedi ki + -e göre + aktardığına göre'],
    ],
    dialogue: [
      ['iş arkadaşı', 'Toplantı saatiyle ilgili bir şey duydun mu?', 'دربارهٔ ساعت جلسه چیزی شنیدی؟'],
      ['sen', 'Evet müdüre göre yarın saat onda başlayacak; ancak henüz resmi bildiri gelmedi.', 'بله طبق گفتهٔ مدیر فردا ساعت ده شروع می‌شود؛ اما هنوز اطلاعیهٔ رسمی نیامده است.'],
      ['iş arkadaşı', 'Başka kimden bilgi aldın mı?', 'از کس دیگری هم خبری شنیدی؟'],
      ['sen', 'Bakanın açıklamasına göre takvim bu hafta netleşecek; ben öyle aktardım.', 'طبق اظهارات وزیر تقویم این هفته نهایی می‌شود؛ من این را منتقل کردم.'],
    ],
    checks: [
      {
        promptFa: 'در بازگویی statements «-e göre» یعنی چه؟',
        choices: ['طبقِ / بنا برِ گفتهٔ...', 'برایِ', 'ازِ'],
        correctIndex: 0,
        explanationFa: 'müdüre göre یعنی «طبق گفتهٔ مدیر».',
      },
      {
        promptFa: 'ساختار «dedi ki» در نقل‌قول غیرمستقیم یعنی چه؟',
        choices: ['«او گفت که...»', '«بگو که...» (دستور)', '«بپرس که...»'],
        correctIndex: 0,
        explanationFa: 'dedi ki ساختار استاندارد نقل‌قول غیرمستقیم است.',
      },
    ],
  },

  /* ۳۰. برقراری ارتباط مؤثر در موقعیت‌های ناآشنا */
  {
    id: 'tr-b1-s-30-effective-communication-unfamiliar-situations',
    title: 'برقراری ارتباط مؤثر در موقعیت‌های ناآشنا',
    subtitle: 'Survival · شروع گفتگو با غریبه‌ها، درخواست توضیح و مدیریت différences فرهنگی',
    situation: 'در موقعیتی ناآشنا (مثلاً همایش یا سفر) با یک غریبه به ترکی استانبولی گفتگو را شروع و با احترام ادامه می‌دهید.',
    teachingFa: 'عبارت‌های شروع گفتگو با غریبه: «Özür dilerim, bu konuda fikrinizi alabilir miyim?»، «Rahatsız ediyor muyum acaba?» و «Tanıştığımıza memnun oldum».',
    rows: [
      ['Özür dilerim bu konuda fikrinizi alabilir miyim?', 'ببخشید می‌توانم نظر شما را دربارهٔ این موضوع بپرسم؟', 'اوزاور دایلهرایم ب کندا فایکراینایزای الابایلایر ماییایم؟', 'fikrinizi', 'نظر شما را', 'الگوی شروع مؤدبانه: özür dilerim + fikrinizi alabilir miyim + çekinmeden sorun'],
      ['Rahatsız ediyor muyum acaba yoksa uygun bir zamanda mı görüşsek?', 'آیا الان مزاحم شدم یا بهتر است زمان دیگری دیدار کنیم؟', 'راهاتسیز هداییر میم اجابا یکسا یگن بایر زاماندا می گاوراوشسهک؟', 'rahatsız ediyor muyum', 'آیا مزاحم شدم', 'الگوی شروع مؤدبانه: özür dilerim + fikrinizi alabilir miyim + çekinmeden sorun'],
      ['Tanıştığımıza memnun oldum; ben bu bölgede yeniyim.', 'از آشنایی با شما خوشحالم؛ من در این منطقه تازه‌واردم.', 'تانیشتیغیمیزا مهمنن لدم؛ بهن ب باولگهده یهناییایم٫', 'tanıştığımıza', 'از آشنایی با هم', 'الگوی شروع مؤدبانه: özür dilerim + fikrinizi alabilir miyim + çekinmeden sorun'],
      ['Biraz kafanızı mı rahatsız ediyorum yoksa sorumu sorabilir miyim?', 'آیا الان打扰 می‌کنم یا می‌توانم سؤالم را بپرسم؟', 'بایراز کافانیزی می راهاتسیز هداییرم یکسا سرم سرابایلایر ماییایم؟', 'sorumu sorabilir miyim', 'می‌توانم سؤالم را بپرسم', 'الگوی شروع مؤدبانه: özür dilerim + fikrinizi alabilir miyim + çekinmeden sorun'],
      ['Türkçem henüz çok iyi değil; yavaş konuşursanız sevinirim.', 'ترکی‌ام هنوز خیلی خوب نیست؛ اگر آهسته صحبت کنید خوشحال می‌شوم.', 'تاورکچهم ههناوز چک اییای دهغایل؛ یاواش کنشرسانیز سهواینایرایم٫', 'yavaş konuşursanız', 'اگر آهسته صحبت کنید', 'الگوی شروع مؤدبانه: özür dilerim + fikrinizi alabilir miyim + çekinmeden sorun'],
      ['Anlamadığım bir yer olursa lütfen durdurup açıklayın.', 'اگر جایی را متوجه نشدم لطفاً توقف کنید و توضیح دهید.', 'آنلامادیغیم بایر یهر لرسا لاوتفهن دردرپ اچیکلایین٫', 'anlamadığım bir yer', 'جایی که متوجه نشدم', 'الگوی شروع مؤدبانه: özür dilerim + fikrinizi alabilir miyim + çekinmeden sorun'],
      ['Bu konuyu yanlış anladıysam lütfen düzeltin.', 'اگر این موضوع را اشتباه متوجه شده باشم لطفاً اصلاح کنید.', 'ب کنی یانلیش انلادییسام لاوتفهن داوزهلتاین٫', 'yanlış anladıysam', 'اگر اشتباه متوجه شده باشم', 'الگوی شروع مؤدبانه: özür dilerim + fikrinizi alabilir miyim + çekinmeden sorun'],
      ['Yeni bir ortama girerken ilk adımı atmak bazen zor oluyor ama bu sefer işe yaradı.', 'وقتی وارد محیط تازه‌ای می‌شوی برداشتن قدم اول گاهی سخت است اما این بار نتیجه داد.', 'یهنای بایر رتاما گایرهرکهن ایلک ادیمی اتماک بازهن زر لیر اما ب سهفهر ایشه یارادی٫', 'işe yaradı', 'نتیجه داد / مؤثر بود', 'الگوی شروع مؤدبانه: özür dilerim + fikrinizi alabilir miyim + çekinmeden sorun'],
    ],
    dialogue: [
      ['sen', 'Özür dilerim bir dakikanızı alabilir miyim?', 'ببخشید می‌توانم یک دقیقه وقتتان را بگیرم؟'],
      ['yabancı', 'Tabii buyurun.', 'البته بفرمایید.'],
      ['sen', 'Tanıştığımıza memnun oldum; ben bu kongrede yeniyim siz de mi katılımcısınız?', 'از آشنایی خوشحالم؛ من در این همایش تازه‌ام شما هم شرکت‌کننده‌اید؟'],
      ['yabancı', 'Evet ben de konuşmacıyım; Türkçeniz gayet iyi nereden öğrendiniz?', 'بله من هم سخنران هستم؛ ترکی‌تان خیلی خوب است کجا یاد گرفتید؟'],
    ],
    checks: [
      {
        promptFa: 'در شروع گفتگو با غریبه عبارت «özür dilerim» چه نقشی دارد؟',
        choices: ['عذرخواهی مؤدبانه برای گرفتن وقت یا توجه', 'خداحافظی رسمی', 'رد کردن پیشنهاد'],
        correctIndex: 0,
        explanationFa: 'Özür dilerim عبارت مؤدبانه‌ای برای قطع کردن یا گرفتن وقت است.',
      },
      {
        promptFa: 'واژهٔ «yeni» در «bu bölgede yeniyim» یعنی چه؟',
        choices: ['تازه‌وارد / جدید', 'زشت', 'مشتری'],
        correctIndex: 0,
        explanationFa: 'yeni یعنی تازه/جدید؛ yeniyim یعنی «من تازه‌ام».',
      },
    ],
  },

  /* ³¹. مدیریت مکالمه از شروع تا پایان با استقلال بیشتر */
  {
    id: 'tr-b1-s-31-managing-conversation-independently',
    title: 'مدیریت مکالمه از شروع تا پایان با استقلال بیشتر',
    subtitle: 'Survival · شروع و جمع‌بندی مستقل، حفظ موضوع، نتیجه‌گیری و خداحافظی مؤدبانه',
    situation: 'یک گفتگوی کامل را به‌تنهایی مدیریت می‌کنید: شروع مؤدبانه، حفظ موضوع، جمع‌بندی و پایان Reset.',
    teachingFa: 'برای مدیریت کامل مکالمه: «Başlarken şunu söylemek istiyorum...»، «Sözün kısası...»، «Sonuç olarak...» و «Görüşmek üzere, kendinize iyi bakın!».',
    rows: [
      ['Başlarken şunu söylemek istiyorum: bu konuyu birlikte değerlendirelim.', 'در شروع می‌خواهم بگویم بیا با هم این موضوع را بررسی کنیم.', 'باشلارکهن شن ساویلهمهک ایستاییرم: ب کنی بایرلایکته دهغهرلهندایرهلایم٫', 'başlarken', 'در شروع', 'الگوی مدیریت کامل گفت‌وگو: başlarken + sözün kısası + sonuç olarak + görüşmek üzere'],
      ['Konuşmamızın ortasında konudan sapmamak için ara ara özet geçelim.', 'در میانهٔ گفتگویمان برای منحرف نشدن از موضوع هر از گاهی خلاصه کنیم.', 'کنشمامیزین رتاسیندا کندان ساپماماک ایچاین ارا ارا اوزهت گهچهلایم٫', 'konudan sapmamak', 'از موضوع منحرف نشدن', 'الگوی مدیریت کامل گفت‌وگو: başlarken + sözün kısası + sonuç olarak + görüşmek üzere'],
      ['Sözün kısası vardığımız nokta her iki taraf için de makuldür.', 'خلاصهٔ کلام اینکه به نقطه‌ای رسیدیم که برای هر دو طرف منطقی است.', 'ساوزاون کیساسی واردیغیمیز نکتا ههر ایکای تاراف ایچاین ده ماکلداور٫', 'sözün kısası', 'خلاصهٔ کلام', 'الگوی مدیریت کامل گفت‌وگو: başlarken + sözün kısası + sonuç olarak + görüşmek üzere'],
      ['Sonuç olarak bu görüşmeden somut bir eylem planı çıkardık.', 'در نتیجه از این گفتگو یک برنامهٔ عملی ملموس استخراج کردیم.', 'سنچ لاراک ب گاوراوشمهدهن سمت بایر هیلهم پلانی چیکاردیک٫', 'eylem planı', 'برنامهٔ عملی', 'الگوی مدیریت کامل گفت‌وگو: başlarken + sözün kısası + sonuç olarak + görüşmek üzere'],
      ['Görüşmemizi burada noktalıyor ve bir sonraki adımı netleştiriyorum.', 'گفتگویمان را اینجا تمام می‌کنم و گام بعدی را مشخص می‌کنم.', 'گاوراوشمهمایزای برادا نکتالییر وه بایر سنراکای ادیمی نهتلهشتایراییرم٫', 'bir sonraki adımı', 'گام بعدی را', 'الگوی مدیریت کامل گفت‌وگو: başlarken + sözün kısası + sonuç olarak + görüşmek üzere'],
      ['Bu aşamada vardığımız uzlaşma taraflar için tatmin edici görünüyor.', 'توافق به‌دست‌آمده در این مرحله برای طرفین رضایت‌بخش به نظر می‌رسد.', 'ب اشامادا واردیغیمیز زلاشما تارافلار ایچاین تاتماین هدایجای گاوراوناویر٫', 'uzlaşma', 'توافق', 'الگوی مدیریت کامل گفت‌وگو: başlarken + sözün kısası + sonuç olarak + görüşmek üzere'],
      ['Konuyu kapatmadan önce son bir kez özetlemem gerekirse...', 'پیش از بستن موضوع اگر لازم باشد یک بار دیگر خلاصه می‌کنم...', 'کنی کاپاتمادان اونجه سن بایر کهز اوزهتلهمهم گهرهکایرسه٫٫٫', 'konuyu kapatmadan önce', 'پیش از بستن موضوع', 'الگوی مدیریت کامل گفت‌وگو: başlarken + sözün kısası + sonuç olarak + görüşmek üzere'],
      ['Görüşmek üzere kendinize iyi bakın ve yarın saat onda tekrar görüşelim.', 'تا دیدار از خودتان خوب مراقبت کنید و فردا ساعت ده دوباره دیدار کنیم.', 'گاوراوشمهک اوزهره کهنداینایزه اییای باکین وه یارین ساات ندا تهکرار گاوراوشهلایم٫', 'görüşmek üzere', 'تا دیدار', 'الگوی مدیریت کامل گفت‌وگو: başlarken + sözün kısası + sonuç olarak + görüşmek üzere'],
    ],
    dialogue: [
      ['sen', 'Başlarken şunu söylemek istiyorum: bu konuyu birlikte değerlendirelim olur mu?', 'در شروع می‌خواهم بگویم بیا با هم این موضوع را بررسی کنیم باشد؟'],
      ['karşı taraf', 'Elbette senin önerin nedir?', 'البته پیشنهاد تو چیست؟'],
      ['sen', 'Sözün kısası vardığımız nokta her iki taraf için de makul; sonuç olarak somut bir eylem planı çıkardık.', 'خلاصهٔ کلام نقطه‌ای که رسیدیم برای هر دو طرف منطقی است؛ در نتیجه یک برنامهٔ عملی استخراج کردیم.'],
      ['karşı taraf', 'Görüşmek üzere yarın saat onda tekrar görüşelim; kendinize iyi bakın!', 'تا دیدار فردا ساعت ده دوبارهدیدار می‌کنیم؛ از خودتان خوب مراقبت کنید!'],
    ],
    checks: [
      {
        promptFa: 'در مدیریت گفت‌وگو «sözün kısası» یعنی چه؟',
        choices: ['خلاصهٔ کلام / در یک كلام', 'شروع رسمی', 'سؤال konsul'],
        correctIndex: 0,
        explanationFa: 'sözün kısası یعنی خلاصهٔ كلام.',
      },
      {
        promptFa: 'عبارت خداحافظی «görüşmek üzere» به چه معناست؟',
        choices: ['تا دیدار / به امید دیدار', 'بدرود', 'سلام'],
        correctIndex: 0,
        explanationFa: 'görüşmek üzere یعنی «تا دیدار».',
      },
    ],
  },
];

export const TURKISH_B1_SURVIVAL_PART_B = buildTurkishLessons(B1_SURVIVAL_PART_B_SEEDS, 'tr4', 369);
