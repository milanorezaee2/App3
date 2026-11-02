import { buildTurkishLessons, type TurkishLessonSeed } from './turkishSeed';

const A2_SURVIVAL_PART_B_SEEDS: readonly TurkishLessonSeed[] = [
  /* ۱۷. صحبت درباره خانه، اجاره و امکانات */
  {
    id: 'tr-a2-s-17-housing-rent-amenities',
    title: 'صحبت درباره خانه، اجاره و امکانات',
    subtitle: 'Survival · اجارهٔ آپارتمان، شارژ ساختمان (aidat)، ودیعه (depozito)، گرمایش و موقعیت محله',
    situation: 'هنگام بازدید از یک آپارتمان در ترکیه با مشاور املاک یا صاحب‌خانه دربارهٔ اجاره، امکانات و هزینه‌ها صحبت می‌کنید.',
    teachingFa: 'واژگان ضروری اجارهٔ مسکن در ترکیه: kiralık daire (واحد اجاره‌ای)، iki artı bir / 2+1 (دو خوابه و یک پذیرایی)، eşyalı / boş (مبله / بدون اثاثیه)، kira bedeli (مبلغ اجاره)، depozito (ودیعه)، aidat (شارژ ماهانهٔ ساختمان)، doğalgaz / kombi (گاز شهری / پکیج گرمایشی) و emlakçı (مشاور املاک).',
    rows: [
      ['Metroya yürüme mesafesinde, aydınlık iki artı bir kiralık daire arıyoruz.', 'دنبال یک آپارتمان اجاره‌ای دوخوابهٔ نورگیر در فاصلهٔ پیاده‌روی تا مترو می‌گردیم.', 'مِترویا یورومه مِسافِسینده، آیدِینلِیک ایکی آرتِی بیر کیرالِیک دایره آرِییوروز', 'kiralık daire', 'واحد آپارتمانی اجاره‌ای', 'iki artı bir = دو اتاق خواب + یک سالن'],
      ['Aylık kira bedeli ne kadar ve apartman aidatı bu fiyata dahil mi?', 'مبلغ اجارهٔ ماهانه چقدر است و آیا شارژ ساختمان در این قیمت لحاظ شده است؟', 'آیلِیک کیرا بِدِلی نِ کادار وِ آپارتمان آییداتِی بو فییاتا داهیل می', 'apartman aidatı', 'شارژ ساختمان'],
      ['Ev eşyalı mı kiralanıyor yoksa beyaz eşyaları bizim mi almamız gerekiyor?', 'خانه مبله اجاره داده می‌شود یا لوازم خانگی برقی را خودمان باید بخریم؟', 'اَو اَشیالِی مِی کیرالانِییور یوکسا بِیاز اَشیالارِی بیزیم می آلمامِیز گِرِکییور', 'beyaz eşyaları', 'لوازم برقی بزرگ خانه را'],
      ['Dairenin ısınma sistemi merkezi mi yoksa doğalgaz kombili mi?', 'سیستم گرمایش واحد مرکزی است یا پکیج گاز شهری دارد؟', 'دایرِنین ایسِینما سیستِمی مَرکِزی می یوکسا دوئال‌گاز کومبیلی می', 'doğalgaz kombili', 'دارای پکیج گاز شهری'],
      ['Sözleşme imzalarken kaç aylık kira tutarında depozito isteniyor?', 'هنگام امضای قرارداد معادل چند ماه اجاره ودیعه خواسته می‌شود؟', 'سوزلَشمه ایمزالارکَن کاچ آیلِیک کیرا توتارِیندا دِپوزیتو ایستِنییور', 'depozito', 'ودیعه / پول پیش'],
      ['Binada asansör, kapalı otopark ve yirmi dört saat güvenlik var.', 'در ساختمان آسانسور، پارکینگ سرپوشیده و نگهبانی بیست‌وچهارساعته هست.', 'بینادا آسانسور، کاپالِی اوتوپارک وِ ییرمی دورت ساعات گووَنلیک وار', 'kapalı otopark', 'پارکینگ سرپوشیده'],
      ['Güney cepheli olduğu için salon gün boyu güneş alıyor.', 'چون رو به جنوب است پذیرایی در تمام طول روز آفتاب می‌گیرد.', 'گونَی جَپهِلی اولدوئو ایچین سالون گون بویو گونَش آلِییور', 'güneş alıyor', 'آفتاب‌گیر است / نور می‌گیرد'],
      ['Taşınmadan önce dairenin boya ve temizlik işleri tamamlanacak.', 'پیش از اسباب‌کشی، کارهای نقاشی و نظافت واحد کامل خواهد شد.', 'تاشِینمادان اونجه دایرِنین بویا وِ تِمیزلیک ایشلَری تاماملاناجاک', 'taşınmadan önce', 'پیش از اسباب‌کشی'],
    ],
    dialogue: [
      ['مستأجر', 'Merhaba, ilandaki Kadıköy’deki daireyi görmek için aramıştım; daire hâlâ uygun mu?', 'سلام، برای دیدن آپارتمانِ کادیکوی که در آگهی بود تماس گرفتم؛ واحد هنوز موجود است؟'],
      ['مشاور املاک', 'Evet uygun; üçüncü katta, asansörlü, balkonlu ve mutfağı yeni yenilendi.', 'بله موجود است؛ طبقهٔ سوم، آسانسوردار، بالکن‌دار است و آشپزخانه‌اش تازه بازسازی شده است.'],
      ['مستأجر', 'Harika; aylık aidatı ne kadar ve depozito şartları nasıl?', 'عالی؛ شارژ ماهانه‌اش چقدر است و شرایط ودیعه چطور است؟'],
      ['مشاور املاک', 'Aidat bin lira, depozito ise bir kira bedeli; isterseniz bugün saat beşte daireyi gezdirebilirim.', 'شارژ هزار لیر و ودیعه معادل یک ماه اجاره است؛ اگر بخواهید امروز ساعت پنج می‌توانم واحد را نشانتان بدهم.'],
    ],
    checks: [
      {
        promptFa: 'در آگهی‌های مسکن ترکیه «apartman aidatı» به چه معناست؟',
        choices: ['شارژ ماهانهٔ ساختمان', 'سند مالکیت زمین', 'کمیسیون مشاور املاک'],
        correctIndex: 0,
        explanationFa: 'aidat هزینهٔ ماهانهٔ خدمات مشترک ساختمان (نظافت، آسانسور، نگهبانی) است.',
      },
      {
        promptFa: 'منظور از «beyaz eşya» در اجاره و خرید خانه چیست؟',
        choices: ['لوازم خانگی بزرگ (یخچال، ماشین لباس‌شویی، ظرف‌شویی)', 'پرده و فرش سفید', 'رنگ دیوار اتاق‌ها'],
        correctIndex: 0,
        explanationFa: 'در ترکی استانبولی به یخچال، لباس‌شویی، ظرف‌شویی و اجاق گاز «beyaz eşya» می‌گویند.',
      },
    ],
  },

  /* ۱۸. توضیح اتفاق‌ها و مشکلات روزمره */
  {
    id: 'tr-a2-s-18-everyday-mishaps-problems',
    title: 'توضیح اتفاق‌ها و مشکلات روزمره',
    subtitle: 'Survival · شرح خرابی‌های خانه، جا گذاشتن کلید، قطع برق و درخواست تعمیرکار',
    situation: 'اتفاق‌های غیرمنتظرهٔ روزمره مانند نشتی لوله، ماندن پشت در یا تمام شدن شارژ را توضیح می‌دهید و کمک می‌گیرید.',
    teachingFa: 'در بیان اتفاق‌های ناگهانی روزمره، فعل‌های مجهول/لازم و ساختار «از دستم افتاد / خراب شد» پرکاربردند: anahtarımı içeride unuttum (کلیدم را داخل جا گذاشتم)، elektrikler kesildi (برق رفت)، su sızdırıyor (آب نشت می‌کند)، bozuldu (خراب شد)، çilingir / tesisatçı çağırmak (قفل‌ساز / لوله‌کش خبر کردن).',
    rows: [
      ['Aceleyle evden çıkarken anahtarımı içeride unuttum ve kapıda kaldım.', 'وقتی با عجله از خانه بیرون می‌رفتم کلیدم را داخل جا گذاشتم و پشت در ماندم.', 'آجِلَیله اِودَن چِیکارکَن آناهتارِیمِی ایچَریده اونوتتوم وِ کاپِیدا کالدِیم', 'kapıda kaldım', 'پشت در ماندم', 'اصطلاح رایج kapıda kalmak'],
      ['Mutfak lavabosunun altındaki boru su sızdırıyor; acil tesisatçı çağırmalıyız.', 'لولهٔ زیر سینک آشپزخانه آب نشت می‌دهد؛ باید فوری لوله‌کش خبر کنیم.', 'موتفاک لاوابوسونون آلتِینداکی بورو سو سِیزدِیرِییور؛ آجیل تِسیساتچِی چائِیرمالِییِیز', 'tesisatçı', 'لوله‌کش / تأسیساتی'],
      ['Fırtına yüzünden mahallede elektrikler kesildi ve internet kapandı.', 'به خاطر طوفان در محله برق قطع شد و اینترنت خاموش شد.', 'فِیرتِینا یوزوندَن ماهاللِده اِلَکتریک‌لَر کِسیلدی وِ اینتَرنَت کاپاندِی', 'elektrikler kesildi', 'برق قطع شد / برق رفت'],
      ['Çamaşır makinesi çalışırken tuhaf bir ses çıkarıyor; sanırım motoru bozuldu.', 'ماشین لباس‌شویی هنگام کار صدای عجیبی درمی‌آورد؛ گمان کنم موتورش خراب شد.', 'چاماشِیر ماکینِسی چالِیشِیرکَن توهاف بیر سَس چِیکارِییور؛ سانِیرِیم موتورو بوزولدو', 'bozuldu', 'خراب شد'],
      ['Merdivenden inerken ayağım kaydı ama neyse ki düşmedim.', 'موقع پایین آمدن از پله پایم سر خورد اما خوشبختانه نیفتادم.', 'مَردیوَندَن اینَرکَن آیائِیم کایدِی آما نَیسه کی دوشمِدیم', 'neyse ki', 'خوشبختانه / خوب شد که'],
      ['Gömleğime yanlışlıkla kahve döküldü; hemen kuru temizlemeye verdim.', 'اشتباهی روی پیراهنم قهوه ریخت؛ فوراً به خشک‌شویی دادم.', 'گوملَییمه یانلِیشلِیکلا کاهوه دوکولدو؛ هِمَن کورو تِمیزلِمِیه وَردیم', 'kuru temizlemeye', 'به خشک‌شویی'],
      ['Yolda telefonumun şarjı tamamen bittiği için haritaya bakamadım.', 'چون در راه شارژ تلفنم کاملاً تمام شد نتوانستم به نقشه نگاه کنم.', 'یولدا تِلِفونومون شارژِی تامامَن بیتتییی ایچین هاریتایا باکامادِیم', 'şarjı', 'شارژِ آن'],
      ['Mahalledeki çilingir on dakikada gelip kapıyı zarar vermeden açtı.', 'قفل‌ساز محله ده‌دقیقه‌ای آمد و در را بدون آسیب زدن باز کرد.', 'ماهاللِدِکی چیلینگیر اون داکیکادا گِلیپ کاپِییِی زارار وَرمِدَن آچتِی', 'çilingir', 'قفل‌ساز / کلیدساز'],
    ],
    dialogue: [
      ['فرهاد', 'Alo Selim, buralarda tanıdığın güvenilir bir elektrikçi var mı?', 'الو سلیم، در این حوالی برق‌کار مطمئنی می‌شناسی؟'],
      ['سلیم', 'Hayrola, evde bir sorun mu oldu?', 'خیر باشد، در خانه مشکلی پیش آمده؟'],
      ['فرهاد', 'Fırını çalıştırınca sigorta attı ve mutfaktaki prizlerin hiçbiri çalışmıyor.', 'وقتی فر را روشن کردم فیوز پرید و هیچ‌کدام از پریزهای آشپزخانه کار نمی‌کند.'],
      ['سلیم', 'Alt sokakta çok iyi bir usta var; numarasını sana hemen mesajla gönderiyorum.', 'در کوچهٔ پایین یک استادکار خیلی خوب هست؛ شماره‌اش را همین الان با پیام برایت می‌فرستم.'],
    ],
    checks: [
      {
        promptFa: 'وقتی کلید را جا بگذارید و پشت در بمانید در ترکی استانبولی چه می‌گویید؟',
        choices: ['Kapıda kaldım ve çilingir çağırdım.', 'Balkonu boyadım.', 'Faturayı ödedim.'],
        correctIndex: 0,
        explanationFa: 'kapıda kalmak یعنی پشت در ماندن و çilingir یعنی کلیدساز/قفل‌ساز.',
      },
      {
        promptFa: 'عبارت «neyse ki» در روایت یک اتفاق روزمره چه معنایی دارد؟',
        choices: ['متأسفانه', 'خوشبختانه / خوب شد که', 'به دلیل اینکه'],
        correctIndex: 1,
        explanationFa: 'neyse ki برای بیان آسودگی خاطر پس از یک خطر یا مشکل («خوشبختانه») به کار می‌رود.',
      },
    ],
  },

  /* ۱۹. صحبت درباره سرگرمی‌ها و تجربه‌های جدید */
  {
    id: 'tr-a2-s-19-hobbies-new-experiences',
    title: 'صحبت درباره سرگرمی‌ها و تجربه‌های جدید',
    subtitle: 'Survival · گفتگو دربارهٔ علایق هنری و ورزشی، امتحان کردن مهارت تازه و اوقات فراغت',
    situation: 'در یک جمع دوستانه از سرگرمی‌های مورد علاقه‌تان و مهارت یا تجربهٔ جدیدی که به‌تازگی شروع کرده‌اید صحبت می‌کنید.',
    teachingFa: 'برای صحبت از سرگرمی‌ها و تجربه‌های نو از عبارت‌های «Boş zamanlarımda ... ile ilgileniyorum» (در اوقات فراغتم به ... می‌پردازم)، «İlk kez ... denedim» (برای اولین بار ... را امتحان کردم)، «Bana çok iyi geliyor» (حال خیلی خوبی به من می‌دهد) و «yetenek geliştirmek» استفاده می‌کنیم.',
    rows: [
      ['Son birkaç aydır hafta sonları sulu boya resim kursuna gidiyorum.', 'چند ماه اخیر آخر هفته‌ها به کلاس نقاشی آبرنگ می‌روم.', 'سون بیرکاچ آیدِیر هافتا سونلارِی سولو بویا رِسیم کورسونا گیدییوروم', 'sulu boya', 'آبرنگ'],
      ['Geçen hafta arkadaşlarımla ilk kez kano yapmayı denedim.', 'هفتهٔ گذشته با دوستانم برای اولین بار قایق‌سواری با کانو را امتحان کردم.', 'گِچَن هافتا آرکاداشلارِیملا ایلک کِز کانو یاپمایِی دِنِدیم', 'denedim', 'امتحان کردم'],
      ['Doğada kamp yapmak şehir stresinden uzaklaşmama yardımcı oluyor.', 'کمپ زدن در طبیعت کمک می‌کند از استرس شهر دور شوم.', 'دوئادا کامپ یاپماک شِهیر استرِسیندَن اوزاکلاشماما یاردِیمجِی اولویور', 'uzaklaşmama', 'به دور شدنم'],
      ['Akşamları evde yeni kahve demleme yöntemleriyle ilgileniyorum.', 'عصرها در خانه سرگرم روش‌های جدید دم‌آوری قهوه هستم.', 'آکشاملارِی اِوده یِنی کاهوه دَملِمه یونتَملَرییله ایلگیلِنییوروم', 'ilgileniyorum', 'مشغولم / علاقه نشان می‌دهم', '-la/-le ilgilenmek = علاقه‌مند بودن و پرداختن به'],
      ['Başlangıçta zorlandım ama pratik yaptıkça el becerim gelişti.', 'در ابتدا به زحمت افتادم اما هرچه بیشتر تمرین کردم مهارت دستی‌ام بهتر شد.', 'باشلانگِیچتا زورلاندِیم آما پراتیک یاپتِیکچا اَل بِجِریم گِلیشتی', 'yaptıkça', 'هرچه بیشتر انجام دادم', '-dıkça/-dikçe = هرچه بیشتر...'],
      ['Fotoğraf çekmek çevremdeki küçük güzellikleri fark etmemi sağlıyor.', 'عکاسی کردن باعث می‌شود زیبایی‌های کوچک اطرافم را ببینم.', 'فوتوئراف چَکمَک چَورَمدِکی کوچوک گوزَللیکلَری فارک اِتمَمی سائلِییور', 'sağlıyor', 'فراهم می‌کند / باعث می‌شود'],
      ['Mahalledeki amatör tiyatro topluluğuna katılmak bana çok iyi geldi.', 'پیوستن به گروه تئاتر آماتور محله حال بسیار خوبی به من داد.', 'ماهاللِدِکی آماتور تییاترو توپلولوئونا کاتِیلماک بانا چوک اییی گَلدی', 'iyi geldi', 'حال خوبی داد / سازگار افتاد', 'birine iyi gelmek = به کسی ساختن / حال خوب دادن'],
      ['Bu yaz dalış eğitimi alıp su altı dünyasını yakından görmek istiyorum.', 'می‌خواهم تابستان امسال آموزش غواصی ببینم و دنیای زیر آب را از نزدیک ببینم.', 'بو یاز دالِیش اَییتیمی آلِیپ سو آلتِی دونیاسِینِی یاکِیندان گورمَک ایستییوروم', 'dalış eğitimi', 'آموزش غواصی'],
    ],
    dialogue: [
      ['نیلوفر', 'Son zamanlarda iş dışında neler yapıyorsun, yeni bir uğraşın var mı?', 'اواخر خارج از کار چه‌کارها می‌کنی، سرگرمی تازه‌ای داری؟'],
      ['بوراک', 'Evet, iki ay önce okçuluk kulübüne yazıldım; haftada iki akşam antrenmana gidiyorum.', 'بله، دو ماه پیش در باشگاه تیراندازی با کمان ثبت‌نام کردم؛ هفته‌ای دو عصر به تمرین می‌روم.'],
      ['نیلوفر', 'Ne kadar ilginç! Alışmak zor oldu mu?', 'چقدر جالب! عادت کردن به آن سخت بود؟'],
      ['بوراک', 'İlk haftalar kollarım biraz ağrıdı ama odaklanmayı öğrendikçe bana çok iyi geldi.', 'هفته‌های اول بازوهایم کمی درد گرفت اما هرچه تمرکز کردن را یاد گرفتم حال خیلی خوبی به من داد.'],
    ],
    checks: [
      {
        promptFa: 'عبارت بسیار طبیعی «Bana çok iyi geldi» یعنی چه؟',
        choices: ['برایم بسیار مفید بود و حال خوبی به من داد', 'خیلی دیر به دستم رسید', 'برایم خیلی گران تمام شد'],
        correctIndex: 0,
        explanationFa: 'در ترکی روزمره «iyi gelmek» برای هوا، سفر، استراحت یا سرگرمی یعنی «حالِ آدم را جا آوردن».',
      },
      {
        promptFa: 'پسوند «-dıkça / -tıkça» در «pratik yaptıkça» چه مفهومی دارد؟',
        choices: ['هرچه بیشتر تمرین کردم / به نسبت تمرین کردن', 'بدون هیچ تمرینی', 'قبل از شروع تمرین'],
        correctIndex: 0,
        explanationFa: 'پسوند -dıkça/-dikçe تناسب و تدریج («هرچه بیشتر ... همان‌قدر ...») را بیان می‌کند.',
      },
    ],
  },

  /* ۲۰. بیان نظر شخصی و توضیح دلیل آن */
  {
    id: 'tr-a2-s-20-personal-opinions-reasons',
    title: 'بیان نظر شخصی و توضیح دلیل آن',
    subtitle: 'Survival · ابراز دیدگاه با bence، bana göre، açıkçası و پشتیبانی نظر با دلیل روشن',
    situation: 'در گفتگو دربارهٔ کار، شهر، فیلم یا سبک زندگی نظر شخصی‌تان را محترمانه می‌گویید و دلیلش را توضیح می‌دهید.',
    teachingFa: 'عبارت‌های استاندارد بیان دیدگاه در ترکی استانبولی: «Bence...» (به نظر من)، «Bana göre...» (به دیدِ من)، «Benim fikrimce / Kanaatimce...» (به عقیدهٔ من)، «Açıkçası...» (راستش را بخواهید). پس از بیان نظر، دلیل خود را با «çünkü...» یا «bunun en önemli sebebi...» (مهم‌ترین دلیلش این است که...) مستدل می‌کنیم.',
    rows: [
      ['Bence yabancı dil öğrenmenin en etkili yolu her gün kısa da olsa pratik yapmaktır.', 'به نظر من مؤثرترین راه یادگیری زبان خارجی، هر روز تمرین کردن است هرچند کوتاه باشد.', 'بَنجه یابانجِی دیل اوئرَنمِنین اَن اَتکیلی یولو هَر گون کِیسا دا اولسا پراتیک یاپماکتِیر', 'bence', 'به نظر من', 'پرکاربردترین قید بیان نظر شخصی'],
      ['Bana göre büyük şehirde toplu taşıma kullanmak araba kullanmaktan daha mantıklı.', 'از دید من در شهر بزرگ استفاده از حمل‌ونقل عمومی منطقی‌تر از رانندگی با خودرو است.', 'بانا گوره بویوک شِهیرده توپلو تاشِیما کوللانماک آرابا کوللانماکتان داها مانتِیکلِی', 'bana göre', 'از دید من / به نظر من'],
      ['Açıkçası filmin oyunculuklarını çok beğendim; çünkü karakterler son derece doğaldı.', 'راستش بازیگری‌های فیلم را خیلی پسندیدم؛ چون شخصیت‌ها بی‌نهایت طبیعی بودند.', 'آچِیکچاسِی فیلمین اویونجولوکلارِینِی چوک بَیَندیم؛ چونکو کاراکتَرلَر سون دَرِجه دوئالدِی', 'açıkçası', 'راستش را بخواهید / صراحتاً'],
      ['Bu projenin başarılı olacağını düşünüyorum; çünkü ekip çok uyumlu çalışıyor.', 'فکر می‌کنم این پروژه موفق خواهد شد؛ چون تیم بسیار هماهنگ کار می‌کند.', 'بو پروژِنین باشارِیلِی اولاجائِینِی دوشونویوروم؛ چونکو اِکیپ چوک اویوملو چالِیشِییور', 'düşünüyorum', 'فکر می‌کنم / معتقدم'],
      ['Benim açımdan uzaktan çalışmanın en büyük avantajı yolda vakit kaybetmemektir.', 'از نظر من بزرگ‌ترین مزیت دورکاری، تلف نکردن وقت در مسیر است.', 'بِنیم آچِیمدان اوزاکتان چالِیشمانِین اَن بویوک آوانتاژِی یولدا واکیت کایبَتمِمَکتیر', 'benim açımdan', 'از دیدگاه من / از نظر من'],
      ['Bu konudaki fikrimi sorarsan acele karar vermemek daha doğru olur.', 'اگر نظر من را در این زمینه بپرسی، عجولانه تصمیم نگرفتن درست‌تر است.', 'بو کونوداکی فیکریمی سورارسان آجِله کارار وَرمِمَک داها دوئرو اولور', 'fikrimi sorarsan', 'اگر نظر من را بپرسی'],
      ['Böyle düşünmemin temel sebebi geçen yıl benzer bir durumu yaşamış olmamızdır.', 'دلیل اصلی اینکه چنین فکری می‌کنم این است که پارسال وضعیت مشابهی را تجربه کردیم.', 'بویله دوشونمَمین تِمَل سِبِبی گِچَن یِیل بَنزَر بیر دورومو یاشامِیش اولمامِیزدِیر', 'temel sebebi', 'دلیل اصلیِ آن'],
      ['Sence yeni açılan kültür merkezi mahallemize canlılık kattı mı?', 'به نظر تو مرکز فرهنگی تازه‌تأسیس به محلهٔ ما سرزندگی بخشید؟', 'سَنجه یِنی آچِیلان کولتور مَرکِزی ماهاللِمیزه جانلِیلِیک کاتتِی مِی', 'sence', 'به نظر تو؟'],
    ],
    dialogue: [
      ['پریسا', 'Sence tatil için küçük bir sahil kasabası mı yoksa büyük bir turistik tesis mi daha iyi?', 'به نظر تو برای تعطیلات یک شهرک ساحلی کوچک بهتر است یا یک مجموعهٔ گردشگری بزرگ؟'],
      ['کرم', 'Bana göre küçük sahil kasabaları çok daha keyifli; çünkü yerel kültürü yakından tanıyabiliyorsun.', 'از دید من شهرک‌های ساحلی کوچک خیلی لذت‌بخش‌ترند؛ چون می‌توانی فرهنگ محلی را از نزدیک بشناسی.'],
      ['پریسا', 'Açıkçası ben de aynı fikirdeyim; kalabalık otellerde insan yeterince dinlenemiyor.', 'راستش من هم هم‌عقیده‌ام؛ در هتل‌های شلوغ آدم به اندازهٔ کافی نمی‌تواند استراحت کند.'],
      ['کرم', 'Kesinlikle, üstelik küçük pansiyonların kahvaltıları çok daha doğal oluyor.', 'قطعاً، علاوه بر آن صبحانه‌های مهمان‌پذیرهای کوچک خیلی طبیعی‌تر است.'],
    ],
    checks: [
      {
        promptFa: 'کدام واژه برای پرسیدن نظر طرف مقابل («به نظر تو؟») به کار می‌رود؟',
        choices: ['Sence', 'Bence', 'Önce'],
        correctIndex: 0,
        explanationFa: 'پسوند -ce/-ca روی ضمیرها معنای «به نظرِ...» می‌سازد: bence (به نظر من)، sence (به نظر تو)، sizce (به نظر شما).',
      },
      {
        promptFa: 'واژهٔ «Açıkçası» در آغاز جمله چه نقشی دارد؟',
        choices: ['بیان صادقانه و صریح دیدگاه («راستش را بخواهید»)', 'پرسش دربارهٔ آدرس', 'خداحافظی رسمی'],
        correctIndex: 0,
        explanationFa: 'açıkçası قید گفتمانی پرکاربرد برای ابراز صریح و صمیمانهٔ نظر شخصی است.',
      },
    ],
  },

  /* ۲۱. موافقت و مخالفت با نظر دیگران */
  {
    id: 'tr-a2-s-21-agreeing-disagreeing',
    title: 'موافقت و مخالفت با نظر دیگران',
    subtitle: 'Survival · هم‌نظری کامل، موافقت نسبی و مخالفت محترمانه در بحث‌های روزمره و کاری',
    situation: 'در گفتگو با دوستان یا همکاران موافقت کامل، موافقت مشروط یا مخالفت مؤدبانهٔ خود را ابراز می‌کنید.',
    teachingFa: 'در ترکی استانبولی طیفی از عبارت‌های دقیق برای واکنش به نظر دیگران وجود دارد: ۱) موافقت کامل: «Sana tamamen katılıyorum» (کاملاً با تو موافقم)، «Çok haklısın» (کاملاً حق با توست)، «Aynı fikirdeyim»؛ ۲) موافقت نسبی: «Bir bakıma haklısın ama...» (از جهتی حق با توست اما...)؛ ۳) مخالفت محترمانه: «Bu konuda sana katılmıyorum» (در این مورد با تو موافق نیستم) یا «Ben biraz farklı düşünüyorum».',
    rows: [
      ['Bu konuda sana tamamen katılıyorum; çok yerinde bir tespit yaptın.', 'در این زمینه کاملاً با تو موافقم؛ نکتهٔ بسیار به‌جایی را مطرح کردی.', 'بو کونودا سانا تامامَن کاتِیلِییوروم؛ چوک یِرینده بیر تَسپیت یاپتِین', 'katılıyorum', 'موافقم / هم‌عقیده‌ام', 'birine katılmak = با کسی هم‌نظر بودن'],
      ['Kesinlikle haklısın, planı uygulamadan önce bütçeyi netleştirmeliyiz.', 'قطعاً حق با توست، پیش از اجرای طرح باید بودجه را شفاف کنیم.', 'کِسینلیکله هاکلِیسِین، پلانِی اویگولامادان اونجه بوتچِیی نَتلَشتیرمِلیییز', 'haklısın', 'حق با توست'],
      ['Ben de seninle aynı fikirdeyim; toplantıyı sabah yapmak daha verimli olur.', 'من هم با تو هم‌عقیده‌ام؛ برگزار کردن جلسه در صبح پربازده‌تر خواهد بود.', 'بَن دِ سِنینله آینِی فیکیردِییم؛ توپلانتِییِی ساباه یاپماک داها وِریملی اولور', 'aynı fikirdeyim', 'هم‌عقیده هستم'],
      ['Bir bakıma haklısın; ancak zamanımızın kısıtlı olduğunu da unutmamalıyız.', 'از یک جهت حق با توست؛ با این حال نباید محدود بودن زمانمان را هم فراموش کنیم.', 'بیر باکِیما هاکلِیسِین؛ آنجاک زامانِیمِیزِین کِیسِیتلِی اولدوئونو دا اونوتمامالِییِیز', 'bir bakıma', 'از یک نظر / تا حدی', 'تأیید نسبی پیش از نقد محترمانه'],
      ['Kusura bakma ama bu noktada sana pek katılmıyorum.', 'ببخشید اما در این نکته چندان با تو موافق نیستم.', 'کوسورا باکما آما بو نوکتادا سانا پَک کاتِیلمِییوروم', 'katılmıyorum', 'موافق نیستم'],
      ['Söylediklerini anlıyorum, fakat ben bu konuya biraz farklı yaklaşıyorum.', 'حرف‌هایت را درک می‌کنم، اما من به این موضوع کمی متفاوت نگاه می‌کنم.', 'سویلِدیکلَرینی آنلِییوروم، فاکات بَن بو کونویا بیراز فارکلِی یاکلاشِییوروم', 'farklı yaklaşıyorum', 'متفاوت برخورد/نگاه می‌کنم'],
      ['Bu fikre karşı değilim ama detayları biraz daha tartışmamız gerekiyor.', 'مخالف این ایده نیستم اما لازم است جزئیات را کمی بیشتر بررسی کنیم.', 'بو فیکره کارشِی دِئیلیم آما دِتایلارِی بیراز داها تارتِیشمامِیز گِرِکییور', 'karşı değilim', 'مخالف نیستم'],
      ['Ne yazık ki aynı görüşte değiliz; yine de önerini dikkate alacağım.', 'متأسفانه هم‌نظر نیستیم؛ با وجود این پیشنهادت را مد نظر قرار خواهم داد.', 'نِ یازِیک کی آینِی گوروشته دِئیلیز؛ یینه دِ اونَرینی دیککاته آلاجائِیم', 'aynı görüşte değiliz', 'هم‌نظر نیستیم'],
    ],
    dialogue: [
      ['کاوه', 'Bence yeni mağazamızı alışveriş merkezinin içinde açmalıyız; orada müşteri trafiği yüksek.', 'به نظرم فروشگاه جدیدمان را باید داخل مرکز خرید باز کنیم؛ تردد مشتری آنجا بالاست.'],
      ['ایپک', 'Bir bakıma haklısın, fakat ben bu konuda biraz farklı düşünüyorum.', 'از جهتی حق با توست، اما من در این مورد کمی متفاوت فکر می‌کنم.'],
      ['کاوه', 'Neden öyle düşünüyorsun, sence cadde mağazası daha mı avantajlı?', 'چرا این‌طور فکر می‌کنی، به نظرت مغازهٔ خیابانی مزیت بیشتری دارد؟'],
      ['ایپک', 'Evet, çünkü alışveriş merkezlerinde kira ve aidat çok yüksek; cadde mağazasında saatlerimiz de esnek olur.', 'بله، چون در مراکز خرید اجاره و شارژ بسیار بالاست؛ در مغازهٔ خیابانی ساعت کاری‌مان هم منعطف می‌شود.'],
    ],
    checks: [
      {
        promptFa: 'جملهٔ «Sana tamamen katılıyorum» یعنی چه؟',
        choices: ['کاملاً با تو موافقم', 'در مسابقه شرکت نمی‌کنم', 'حرفت را نشنیدم'],
        correctIndex: 0,
        explanationFa: 'فعل katılmak با متمم جهتی (sana / bu fikre) معنای «هم‌عقیده و موافق بودن» می‌دهد.',
      },
      {
        promptFa: 'کدام عبارت برای مخالفت نرم و مؤدبانه در گفتگو مناسب‌تر است؟',
        choices: ['Bir bakıma haklısın, fakat ben biraz farklı düşünüyorum.', 'Hiçbir şey bilmiyorsun!', 'Hemen susmalısın!'],
        correctIndex: 0,
        explanationFa: 'تأیید بخشی از سخن طرف مقابل با «Bir bakıma haklısın» و سپس بیان دیدگاه متفاوت، محترمانه‌ترین شیوهٔ مخالفت است.',
      },
    ],
  },

  /* ۲۲. مقایسه گزینه‌ها و انتخاب گزینه مناسب‌تر */
  {
    id: 'tr-a2-s-22-comparing-choosing-options',
    title: 'مقایسه گزینه‌ها و انتخاب گزینه مناسب‌تر',
    subtitle: 'Survival · سنجش مزایا و معایب (artılar ve eksiler) و اعلام تصمیم نهایی میان چند گزینه',
    situation: 'میان دو پیشنهاد شغلی، دو کلاس آموزشی یا دو مسیر سفر سبک‌سنگین می‌کنید و گزینهٔ بهتر را برمی‌گزینید.',
    teachingFa: 'هنگام سبک‌سنگین کردن گزینه‌ها از عبارت‌های «artılarını ve eksilerini değerlendirmek» (سنجیدن مزایا و معایب)، «bir yandan ... diğer yandan ...» (از یک سو ... از سوی دیگر ...)، «... ile karşılaştırıldığında» (در مقایسه با...) و برای اعلام انتخاب نهایی از «Sonuç olarak ... seçmeye karar verdik» استفاده می‌کنیم.',
    rows: [
      ['Karar vermeden önce her iki seçeneğin artılarını ve eksilerini karşılaştıralım.', 'پیش از تصمیم‌گیری، مزایا و معایب هر دو گزینه را با هم مقایسه کنیم.', 'کارار وَرمِدَن اونجه هَر ایکی سِچِنَیین آرتِیلارِینِی وِ اَکسیلَرینی کارشِیلاشتِیرالِیم', 'artılarını ve eksilerini', 'مزایا و معایبش را'],
      ['Birinci kurs eve daha yakın; diğer yandan ikinci kursun eğitmenleri daha deneyimli.', 'دورهٔ اول به خانه نزدیک‌تر است؛ از سوی دیگر مدرسان دورهٔ دوم باتجربه‌ترند.', 'بیرینجی کورس اِوه داها یاکِین؛ دییَر یاندان ایکینجی کورسون اَییتمَنلَری داها دِنِییملی', 'diğer yandan', 'از سوی دیگر'],
      ['Uçak bileti otobüse göre daha pahalı ama zamandan büyük tasarruf sağlıyor.', 'بلیت هواپیما نسبت به اتوبوس گران‌تر است اما صرفه‌جویی بزرگی در زمان ایجاد می‌کند.', 'اوچاک بیلِتی اوتوبوسه گوره داها پاهالِی آما زاماندان بویوک تاسارروف سائلِییور', 'göre', 'نسبت به / در مقایسه با', '-a/-e göre = در مقایسه با'],
      ['Fiyat, konum ve temizlik açısından ikinci otel bizim için çok daha uygun.', 'از نظر قیمت، موقعیت و تمیزی، هتل دوم برای ما بسیار مناسب‌تر است.', 'فییات، کونوم وِ تِمیزلیک آچِیسِیندان ایکینجی اوتَل بیزیم ایچین چوک داها اویگون', 'daha uygun', 'مناسب‌تر'],
      ['Uzun vadede düşündüğümüzde kaliteli bir bilgisayar almak daha hesaplı olur.', 'وقتی در بلندمدت فکر کنیم خریدن یک رایانهٔ باکیفیت به‌صرفه‌تر می‌شود.', 'اوزون وادِده دوشوندویوموزده کالیتِلی بیر بیلگیسایار آلماک داها هِساپلِی اولور', 'uzun vadede', 'در بلندمدت'],
      ['İki teklif arasında kaldım ama çalışma saatleri nedeniyle ilkini seçeceğim.', 'بین دو پیشنهاد مردد ماندم اما به علت ساعات کاری اولی را انتخاب خواهم کرد.', 'ایکی تَکلیف آراسِیندا کالدِیم آما چالِیشما ساعاتلَری نِدِنییله ایلکینی سِچِجَییم', 'arasında kaldım', 'بینِ ... مردد ماندم'],
      ['Sonuç olarak hem bütçemize hem programımıza en iyi uyan paketi tercih ettik.', 'در نتیجه بسته‌ای را ترجیح دادیم که هم با بودجه و هم با برنامه‌مان بهترین هماهنگی را دارد.', 'سونوچ اولاراک هَم بوتچِمیزه هَم پروگرامِیمِیزا اَن اییی اویان پاکِتی تَرجیه اِتتیک', 'sonuç olarak', 'در نتیجه / در جمع‌بندی'],
      ['Sen olsaydın bu iki güzergâhtan hangisini seçerdin?', 'اگر جای من بودی کدام‌یک از این دو مسیر را انتخاب می‌کردی؟', 'سَن اولسایدِین بو ایکی گوزَرگاهتان هانگیسینی سِچَردین', 'sen olsaydın', 'اگر تو جای من بودی'],
    ],
    dialogue: [
      ['بهرام', 'Hafta sonu gezisi için trenle Eskişehir’e mi gidelim yoksa arabayla Sapanca’ya mı?', 'برای گردش آخر هفته با قطار به اسکی‌شهیر برویم یا با خودرو به ساپانجا؟'],
      ['سودا', 'Arabayla gidersek yolda istediğimiz yerde durabiliriz; diğer yandan hızlı tren çok daha rahat.', 'اگر با خودرو برویم در راه هر جا بخواهیم می‌توانیم بایستیم؛ از سوی دیگر قطار سریع‌السیر خیلی راحت‌تر است.'],
      ['بهرام', 'Doğru, üstelik pazar akşamı dönüş trafiği çok yoğun oluyor.', 'درست است، تازه یکشنبه شب ترافیک برگشت خیلی سنگین می‌شود.'],
      ['سودا', 'O zaman sonuç olarak hızlı tren seçeneği daha mantıklı; biletleri hemen alalım.', 'پس در نتیجه گزینهٔ قطار سریع‌السیر منطقی‌تر است؛ بلیت‌ها را همین الان بخریم.'],
    ],
    checks: [
      {
        promptFa: 'اصطلاح «artıları ve eksileri» در مقایسهٔ گزینه‌ها یعنی چه؟',
        choices: ['نکات مثبت و منفی (مزایا و معایب)', 'فاصلهٔ شرق و غرب', 'روزهای تعطیل سال'],
        correctIndex: 0,
        explanationFa: 'artı (مثبت) و eksi (منفی) در جمع به معنی مزایا و معایب یک انتخاب هستند.',
      },
      {
        promptFa: 'عبارت «İki teklif arasında kaldım» چه وضعیتی را بیان می‌کند؟',
        choices: ['هر دو پیشنهاد را رد کردم', 'میان دو پیشنهاد دودل / مردد ماندم', 'پیشنهاد سوم را نوشتم'],
        correctIndex: 1,
        explanationFa: 'arasında kalmak اصطلاح رایج برای تردید داشتن در انتخاب میان دو گزینه است.',
      },
    ],
  },

  /* ۲۳. صحبت درباره تغییرات زندگی و عادت‌ها */
  {
    id: 'tr-a2-s-23-life-changes-habits',
    title: 'صحبت درباره تغییرات زندگی و عادت‌ها',
    subtitle: 'Survival · مقایسهٔ گذشته و اکنون با eskiden… ama şimdi/artık… و عادت کردن با alışmak',
    situation: 'دربارهٔ تغییر شهر، شغل، سبک تغذیه یا عادت‌های روزانه‌تان نسبت به سال‌های گذشته صحبت می‌کنید.',
    teachingFa: 'الگوی طلایی بیان تغییر در ترکی استانبولی تقابل «Eskiden ... -(ı)rdım, ama artık / şimdi ... -ıyorum» است: Eskiden geç yatardım, ama artık erken uyuyorum (قبلاً دیر می‌خوابیدم اما دیگر زود می‌خوابم). همچنین فعل «-a/-e alışmak» (عادت کردن به) و «bırakmak» (ترک کردن عادت) در این موضوع کلیدی هستند.',
    rows: [
      ['Eskiden günde dört fincan kahve içerdim, ama artık bitki çayı tercih ediyorum.', 'قبلاً روزی چهار فنجان قهوه می‌نوشیدم، اما حالا دیگر چای گیاهی ترجیح می‌دهم.', 'اِسکیدَن گونده دورت فینجان کاهوه ایچَردیم، آما آرتِیک بیتکی چایِی تَرجیه اِدییوروم', 'eskiden', 'قبلاً / در گذشته', 'الگوی تغییر: eskiden ... ama artık ...'],
      ['Yeni bir şehre taşındıktan sonra günlük düzenim tamamen değişti.', 'پس از نقل مکان به یک شهر جدید نظم روزانه‌ام کاملاً تغییر کرد.', 'یِنی بیر شِهره تاشِیندِیکتان سونرا گونلوک دوزِنیم تامامَن دِییشتی', 'düzenim', 'نظم و روال زندگی‌ام'],
      ['Başlangıçta sabah erken kalkmak zordu ama kısa sürede alıştım.', 'در ابتدا صبح زود بیدار شدن سخت بود اما در مدت کوتاهی عادت کردم.', 'باشلانگِیچتا ساباه اَرکَن کالکماک زوردو آما کِیسا سورِده آلِیشتِیم', 'alıştım', 'عادت کردم', '-a/-e alışmak = عادت کردن به'],
      ['Son bir yıldır paketli gıdaları bırakıp evde yemek pişirmeye özen gösteriyorum.', 'یک سال اخیر خوراکی‌های بسته‌بندی‌شده را کنار گذاشته‌ام و به آشپزی در خانه توجه می‌کنم.', 'سون بیر یِیلدِیر پاکَتلی گِیدالارِی بِیراکِیپ اِوده یِمَک پیشیرمِیه اوزَن گوستِرییوروم', 'özen gösteriyorum', 'دقت و توجه نشان می‌دهم'],
      ['İş değiştirdiğimden beri kendime ve aileme daha çok vakit ayırabiliyorum.', 'از وقتی شغلم را عوض کرده‌ام می‌توانم وقت بیشتری برای خودم و خانواده‌ام بگذارم.', 'ایش دِییشتیردیییمدَن بِری کَندیمه وِ آیلَمه داها چوک واکیت آیِیرابیلییوروم', 'vakit ayırabiliyorum', 'می‌توانم وقت اختصاص بدهم'],
      ['Artık hafta sonları sosyal medyada daha az vakit geçiriyorum.', 'دیگر آخر هفته‌ها زمان کمتری در شبکه‌های اجتماعی می‌گذرانم.', 'آرتِیک هافتا سونلارِی سوسیال مَدیادا داها آز واکیت گِچیرییوروم', 'artık', 'دیگر / از این پس'],
      ['İstanbul’un temposuna alışmak ilk aylarda biraz zaman aldı.', 'عادت کردن به ریتم تند استانبول در ماه‌های اول کمی زمان برد.', 'ایستانبولون تَمپوسونا آلِیشماک ایلک آیلاردا بیراز زامان آلدِی', 'zaman aldı', 'زمان برد'],
      ['Düzenli yürüyüş alışkanlığı kazanınca enerjim gözle görülür biçimde arttı.', 'وقتی عادت پیاده‌روی منظم پیدا کردم انرژی‌ام به‌شکل چشمگیری افزایش یافت.', 'دوزَنلی یورویوش آلِیشکانلِیئِی کازانِینجا اِنَرژیم گوزله گورولور بیچیمده آرتتِی', 'alışkanlığı', 'عادتِ...'],
    ],
    dialogue: [
      ['روشنک', 'Seni çok dinç gördüm; hayatında bir değişiklik mi yaptın?', 'تو را خیلی سرحال می‌بینم؛ تغییری در زندگی‌ات داده‌ای؟'],
      ['مراد', 'Evet! Eskiden akşamları çok geç yemek yerdim ve hiç spor yapmazdım.', 'بله! قبلاً شب‌ها خیلی دیر شام می‌خوردم و اصلاً ورزش نمی‌کردم.'],
      ['روشنک', 'Peki şimdi nasıl bir düzenin var?', 'خب الان چه روالی داری؟'],
      ['مراد', 'Artık akşam yediden sonra bir şey yemiyorum ve haftada dört gün yüzmeye gidiyorum; bu düzene çok alıştım.', 'دیگر بعد از هفت شب چیزی نمی‌خورم و هفته‌ای چهار روز به شنا می‌روم؛ به این روال خیلی عادت کرده‌ام.'],
    ],
    checks: [
      {
        promptFa: 'واژهٔ «artık» در جملهٔ «Artık erken uyuyorum» چه مفهومی دارد؟',
        choices: ['از این به بعد / دیگر (برخلاف گذشته)', 'فقط یک بار در سال گذشته', 'شاید در کودکی'],
        correctIndex: 0,
        explanationFa: 'artık نقطهٔ چرخش از وضعیت قدیم به وضعیت جدید («دیگر / حالا دیگر») را نشان می‌دهد.',
      },
      {
        promptFa: 'فعل «alışmak» با چه پسوند حالتی روی متمم خود می‌آید؟',
        choices: ['پسوند جهتی (-a / -e): bu düzene alıştım', 'پسوند مبدأ (-dan / -den)', 'پسوند جمع (-lar / -ler)'],
        correctIndex: 0,
        explanationFa: 'در ترکی «به چیزی عادت کردن» با حالت جهتی ساخته می‌شود: İstanbul’a alıştım.',
      },
    ],
  },

  /* ۲۴. بیان احساسات، نگرانی‌ها و امیدها */
  {
    id: 'tr-a2-s-24-feelings-worries-hopes',
    title: 'بیان احساسات، نگرانی‌ها و امیدها',
    subtitle: 'Survival · ابراز خوشحالی، دلتنگی، نگرانی، آرامش خاطر و امیدواری با umarım و merak etme',
    situation: 'احساس درونی خود را دربارهٔ یک خبر، آزمون یا آینده بیان می‌کنید و به دوستتان دلگرمی می‌دهید.',
    teachingFa: 'عبارت‌های کلیدی عاطفی در سطح A2: «çok sevindim» (خیلی خوشحال شدم)، «üzüldüm» (ناراحت شدم)، «endişeleniyorum / merak ediyorum» (نگرانم)، «heyecanlıyım» (هیجان‌زده‌ام)، «özledim» (دلم تنگ شده)، و برای ابراز امید: «Umarım her şey yolunda gider» (امیدوارم همه‌چیز خوب پیش برود) و «İçin rahat olsun» (خیالت راحت باشد).',
    rows: [
      ['Yeni işe kabul edildiğini duyunca senin adına çok sevindim!', 'وقتی شنیدم در کار جدید پذیرفته شدی از طرف تو خیلی خوشحال شدم!', 'یِنی ایشه کابول اِدیلدییینی دویونجا سِنین آدِینا چوک سِویندیم', 'çok sevindim', 'خیلی خوشحال شدم', 'senin adına sevindim = برایت خوشحال شدم'],
      ['Yarınki mülakat öncesi biraz gergin ve heyecanlı hissediyorum.', 'پیش از مصاحبهٔ فردا کمی احساس تنش و هیجان دارم.', 'یارِینکِی مولاکات اونجِسی بیراز گَرگین وِ هِیِجانلِی هیسسِدییوروم', 'heyecanlı', 'هیجان‌زده'],
      ['Sınav sonuçları geciktiği için açıkçası biraz endişeleniyorum.', 'چون نتایج آزمون دیر شده راستش کمی نگران هستم.', 'سِیناو سونوچلارِی گِجیکتییی ایچین آچِیکچاسِی بیراز اَندیشِلِنییوروم', 'endişeleniyorum', 'نگرانم / دلواپسم'],
      ['Hiç merak etme, çok iyi hazırlandın; için rahat olsun.', 'اصلاً نگران نباش، خیلی خوب آماده شدی؛ خیالت راحت باشد.', 'هیچ مِراک اِتمه، چوک اییی هازِیرلاندِین؛ ایچین راهات اولسون', 'için rahat olsun', 'خیالت راحت باشد', 'عبارت گرم دلگرمی دادن'],
      ['Umarım önümüzdeki yıl hepimiz için huzurlu ve verimli geçer.', 'امیدوارم سال پیشِ رو برای همهٔ ما آرام و پربار بگذرد.', 'اومارِیم اونوموزدِکی یِیل هِپیمیز ایچین هوزورلو وِ وِریملی گِچَر', 'umarım', 'امیدوارم', 'umarım + Geniş Zaman / Gelecek Zaman'],
      ['Ailemden uzakta yaşadığım için bazen ev yemeklerini çok özlüyorum.', 'چون دور از خانواده‌ام زندگی می‌کنم گاهی خیلی دلتنگ غذاهای خانگی می‌شوم.', 'آیلَمدَن اوزاکتا یاشادِیئِیم ایچین بازَن اَو یِمَکلَرینی چوک اوزلویوروم', 'özlüyorum', 'دلتنگ می‌شوم'],
      ['Sorunun kısa sürede çözüldüğünü öğrenince derin bir nefes aldım.', 'وقتی فهمیدم مشکل در مدت کوتاهی حل شده نفس عمیقی کشیدم (آرام شدم).', 'سورونون کِیسا سورِده چوزولدویونو اوئرِنینجه دِرین بیر نِفَس آلدِیم', 'derin bir nefes aldım', 'نفس عمیقی کشیدم'],
      ['Gelecekten umutluyum; emeklerimizin karşılığını alacağımıza inanıyorum.', 'به آینده امیدوارم؛ باور دارم نتیجهٔ زحماتمان را خواهیم گرفت.', 'گِلِجَکتَن اوموتلویوم؛ اِمَکلَریمیزین کارشِیلِیئِینِی آلاجائِیمِیزا اینانِییوروم', 'umutluyum', 'امیدوار هستم'],
    ],
    dialogue: [
      ['یاسمین', 'Yarın ilk kez Türkçe sunum yapacağım; hata yapmaktan biraz korkuyorum.', 'فردا برای اولین بار به ترکی ارائه خواهم داد؛ کمی از اشتباه کردن می‌ترسم.'],
      ['تایفن', 'Hiç endişelenme, konuya çok hakimsin ve telaffuzun gayet anlaşılır.', 'اصلاً نگران نباش، به موضوع کاملاً مسلطی و تلفظت کاملاً قابل فهم است.'],
      ['یاسمین', 'Teşekkür ederim, desteğin beni gerçekten rahatlattı.', 'متشکرم، حمایتت واقعاً آرامم کرد.'],
      ['تایفن', 'İçin rahat olsun; umarım sunumun harika geçer, sonucu bana mutlaka haber ver!', 'خیالت راحت باشد؛ امیدوارم ارائه‌ات عالی پیش برود، نتیجه‌اش را حتماً به من خبر بده!'],
    ],
    checks: [
      {
        promptFa: 'عبارت دلگرم‌کنندهٔ «İçin rahat olsun» یعنی چه؟',
        choices: ['خیالت راحت باشد', 'داخل اتاق سرد است', 'سفر به خیر باشد'],
        correctIndex: 0,
        explanationFa: 'için rahat olsun اصطلاح بسیار صمیمی و رایج ترکی استانبولی برای رفع نگرانی مخاطب است.',
      },
      {
        promptFa: 'واژهٔ «Umarım» در آغاز جمله چه معنایی دارد؟',
        choices: ['امیدوارم', 'می‌ترسم', 'فراموش کردم'],
        correctIndex: 0,
        explanationFa: 'umarım از ریشهٔ ummak یعنی «امیدوارم».',
      },
    ],
  },

  /* ۲۵. توضیح قوانین و دستورالعمل‌های ساده */
  {
    id: 'tr-a2-s-25-explaining-rules-instructions',
    title: 'توضیح قوانین و دستورالعمل‌های ساده',
    subtitle: 'Survival · شرح مقررات ساختمان، کتابخانه، مترو و دستورالعمل گام‌به‌گام استفاده از دستگاه‌ها',
    situation: 'قوانین یک مکان عمومی یا مراحل کار با یک دستگاه و سامانهٔ ثبت‌نام را به زبان روشن توضیح می‌دهید.',
    teachingFa: 'در بیان قوانین عمومی در ترکیه ساخت‌های غیرشخصی و مجهول بسیار رایج‌اند: «... yasaktır» (ممنوع است)، «... zorunludur» (اجباری است)، «lütfen ... -mayınız/-meyiniz» (لطفاً ... نکنید)، و در دستورالعمل گام‌به‌گام: «Önce kartınızı okutun, ardından şifrenizi girin ve onay tuşuna basın.»',
    rows: [
      ['Kütüphane salonunda telefonla sesli konuşmak ve yiyecek getirmek yasaktır.', 'در سالن کتابخانه بلند صحبت کردن با تلفن و آوردن خوراکی ممنوع است.', 'کوتوپهانه سالونوندا تِلِفونلا سَسلی کونوشماک وِ یییِجَک گِتیرمَک یاساکتِیر', 'yasaktır', 'ممنوع است'],
      ['Binaya girerken ziyaretçi kartını danışmadan almak zorunludur.', 'هنگام ورود به ساختمان گرفتن کارت بازدیدکننده از اطلاعات الزامی است.', 'بینایا گیرَرکَن زییارَتچی کارتِینِی دانِیشمادان آلماک زورونلودور', 'zorunludur', 'الزامی / اجباری است'],
      ['Cihazı çalıştırmak için önce güç düğmesine üç saniye basılı tutun.', 'برای روشن کردن دستگاه، ابتدا دکمهٔ پاور را سه ثانیه نگه دارید.', 'جیهازِی چالِیشـتِیرماک ایچین اونجه گوچ دویمِسینه اوچ سانییه باسِیلِی توتون', 'basılı tutun', 'فشرده نگه دارید'],
      ['Apartman kurallarına göre akşam saat ondan sonra yüksek sesle müzik açılamaz.', 'طبق قوانین آپارتمان، بعد از ساعت ده شب نمی‌توان با صدای بلند موسیقی گذاشت.', 'آپارتمان کوراللارِینا گوره آکشام ساعات اوندان سونرا یوکسَک سَسله موزیک آچِیلاماز', 'kurallarına göre', 'بر اساس قوانینِ...'],
      ['Turnikeden geçerken kartınızı sarı ekranın üzerine yaklaştırın.', 'هنگام عبور از گیت، کارتتان را به روی صفحهٔ زرد نزدیک کنید.', 'تورنیکِدَن گِچَرکَن کارتِینِیزِی سارِی اِکرانِین اوزَرینه یاکلاشتِیرِین', 'yaklaştırın', 'نزدیک کنید'],
      ['Lütfen acil çıkış kapısının önüne bisiklet veya koli bırakmayınız.', 'لطفاً جلوی درِ خروج اضطراری دوچرخه یا بسته نگذارید.', 'لوتفَن آجیل چِیکِیش کاپِیسِینِین اونونه بیسیکلَت وِیا کولی بِیراکمایِینِیز', 'bırakmayınız', 'نگذارید (نهی رسمی اعلانات)', '-mayınız/-meyiniz برای تابلوها و دستورالعمل‌های رسمی'],
      ['Formu doldurduktan sonra imzalayıp iki numaralı gişeye teslim edin.', 'پس از پر کردن فرم، امضا کنید و به باجهٔ شمارهٔ دو تحویل بدهید.', 'فورمو دولدوردوکتان سونرا ایمزالایِیپ ایکی نومارالِی گیشِیه تِسلیم اِدین', 'gişeye', 'به باجه'],
      ['Havuzu kullanmadan önce duş almak ve bone takmak gerekmektedir.', 'پیش از استفاده از استخر، دوش گرفتن و گذاشتن کلاه شنا لازم است.', 'هاووزو کوللانمادان اونجه دوش آلماک وِ بونه تاکماک گِرَکمَکتِدیر', 'gerekmektedir', 'لازم است (لحن رسمی مقررات)'],
    ],
    dialogue: [
      ['کاربر جدید', 'Affedersiniz, ortak çalışma alanını ilk kez kullanıyorum; temel kurallar nelerdir?', 'ببخشید، برای اولین بار از فضای کار اشتراکی استفاده می‌کنم؛ قوانین اصلی چیست؟'],
      ['مسئول سالن', 'Hoş geldiniz! Sessiz alanda telefon görüşmesi yapılmıyor; görüşmeler için yan kabinleri kullanabilirsiniz.', 'خوش آمدید! در بخش سکوت مکالمهٔ تلفنی انجام نمی‌شود؛ برای تماس‌ها می‌توانید از کابین‌های کناری استفاده کنید.'],
      ['کاربر جدید', 'Peki yazıcıyı nasıl kullanabilirim?', 'خب چطور می‌توانم از چاپگر استفاده کنم؟'],
      ['مسئول سالن', 'Önce üye kartınızı yazıcıya okutun, sonra bilgisayarınızdan belgeyi seçip yazdır tuşuna basın.', 'اول کارت عضویتتان را به چاپگر نشان بدهید، بعد از رایانه‌تان فایل را انتخاب کنید و دکمهٔ چاپ را بزنید.'],
    ],
    checks: [
      {
        promptFa: 'شکل «bırakmayınız» روی تابلوها و اطلاعیه‌ها چه نوع فعلی است؟',
        choices: ['نهی محترمانه و رسمی («لطفاً قرار ندهید»)', 'گذشتهٔ نقلی مثبت', 'پرسش آینده'],
        correctIndex: 0,
        explanationFa: 'پسوند -ınız/-iniz در پایان فعل امری/نهی رسمی‌ترین شیوهٔ خطاب در قوانین و تابلوهای عمومی است.',
      },
      {
        promptFa: 'عبارت «basılı tutun» در راهنمای دستگاه یعنی چه؟',
        choices: ['دکمه را فشرده نگه دارید', 'دستگاه را از برق بکشید', 'صفحه را پاک کنید'],
        correctIndex: 0,
        explanationFa: 'basılı tutmak اصطلاح دقیق کار با دکمه‌های دیجیتال («نگه داشتن دکمه») است.',
      },
    ],
  },

  /* ۲۶. پرسیدن و پاسخ‌دادن به پرسش‌های چندبخشی */
  {
    id: 'tr-a2-s-26-multipart-questions-answers',
    title: 'پرسیدن و پاسخ‌دادن به پرسش‌های چندبخشی',
    subtitle: 'Survival · طرح دو یا سه پرسش به هم پیوسته در موقعیت‌های خدماتی و دادن پاسخ منظم و کامل',
    situation: 'در ثبت‌نام کلاس، خرید بلیت یا مصاحبه، پرسش‌های چندبخشی می‌پرسید و به همهٔ اجزای سؤال طرف مقابل روشن پاسخ می‌دهید.',
    teachingFa: 'در مکالمهٔ واقعی غالباً دو سؤال در یک جمله پرسیده می‌شود: «Kurs ne zaman başlıyor ve haftada kaç saat sürüyor?» هنگام پاسخ دادن حرفه‌ای، با نشانگرهایی مانند «İlk olarak...» (نخست اینکه...) و «Ayrıca / İkinci sorunuz için...» (همچنین / دربارهٔ سؤال دومتان...) به هر دو بخش روشن جواب می‌دهیم.',
    rows: [
      ['Bu eğitim programı ne zaman başlıyor ve dersler hangi günler yapılıyor?', 'این برنامهٔ آموزشی کی شروع می‌شود و کلاس‌ها چه روزهایی برگزار می‌شود؟', 'بو اَییتیم پروگرامِی نِ زامان باشلِییور وِ دَرسلَر هانگی گونلَر یاپِیلِییور', 'hangi günler', 'چه روزهایی'],
      ['Dersler bir kasımda başlıyor; salı ve perşembe akşamları ikişer saat sürüyor.', 'کلاس‌ها اول نوامبر شروع می‌شود؛ عصرهای سه‌شنبه و پنج‌شنبه هر جلسه دو ساعت طول می‌کشد.', 'دَرسلَر بیر کاسِیمدا باشلِییور؛ سالِی وِ پَرشَمبه آکشاملارِی ایکیشَر ساعات سورویور', 'ikişer saat', 'هر بار دو ساعت', 'عدد توزیعی با -(ş)ar/-(ş)er'],
      ['Kayıt için hangi belgeler gerekiyor ve ödemeyi taksitle yapabiliyor muyuz?', 'برای ثبت‌نام چه مدارکی لازم است و آیا می‌توانیم پرداخت را اقساطی انجام دهیم؟', 'کایِیت ایچین هانگی بَلگِلَر گِرِکییور وِ اودِمِیی تاکسیتله یاپابیلییور مویوز', 'hangi belgeler', 'چه مدارکی'],
      ['Kimlik fotokopisi yeterli; ayrıca kredi kartına iki taksit imkânımız var.', 'کپی کارت شناسایی کافی است؛ همچنین امکان دو قسط روی کارت اعتباری داریم.', 'کیملیک فوتوکوپیسی یِتَرلی؛ آیرِیجا کرِدی کارتِینا ایکی تاکسیت ایمکانِیمِیز وار', 'ayrıca', 'علاوه بر این / همچنین'],
      ['Otobüs nereden kalkıyor, yolculuk kaç saat sürüyor ve yolda mola veriyor mu?', 'اتوبوس از کجا حرکت می‌کند، سفر چند ساعت طول می‌کشد و آیا در راه توقف دارد؟', 'اوتوبوس نِرِدَن کالکِییور، یولجولوک کاچ ساعات سورویور وِ یولدا مولا وِرییور مو', 'mola veriyor mu', 'آیا استراحت/توقف می‌کند؟'],
      ['Otogardan saat dokuzda kalkıyor, beş saat sürüyor ve yarı yolda bir kez mola veriyor.', 'ساعت نه از پایانه حرکت می‌کند، پنج ساعت طول می‌کشد و نیمه‌راه یک‌بار توقف می‌کند.', 'اوتوگاردان ساعات دوکوزدا کالکِییور، بَش ساعات سورویور وِ یارِی یولدا بیر کِز مولا وِرییور', 'yarı yolda', 'در نیمهٔ راه'],
      ['Siparişim ne zaman kargoya verilecek ve takip numarasını nereden görebilirim?', 'سفارشم چه زمانی تحویل پست داده خواهد شد و کد رهگیری را از کجا می‌توانم ببینم؟', 'سیپاریشیم نِ زامان کارگویا وِریلِجَک وِ تاکیپ نوماراسِینِی نِرِدَن گورِبیلیریم', 'takip numarasını', 'شمارهٔ پیگیری را'],
      ['Ürününüz bugün kargoya veriliyor; takip kodu telefonunuza kısa mesajla gelecek.', 'محصول شما امروز تحویل پست می‌شود؛ کد رهگیری با پیامک به تلفنتان خواهد آمد.', 'اورونونوز بوگون کارگویا وِریلییور؛ تاکیپ کودو تِلِفونونوزا کِیسا مِساژلا گِلِجَک', 'kısa mesajla', 'با پیامک'],
    ],
    dialogue: [
      ['متقاضی', 'Merhaba, yüzme havuzuna üye olmak istiyorum; aylık ücreti ne kadar ve havuz saat kaça kadar açık?', 'سلام، می‌خواهم عضو استخر شنا شوم؛ شهریهٔ ماهانه چقدر است و استخر تا ساعت چند باز است؟'],
      ['کارمند پذیرش', 'Merhaba! Aylık üyelik ücreti bin beş yüz lira ve havuzumuz her gün akşam ona kadar açık.', 'سلام! هزینهٔ عضویت ماهانه هزار و پانصد لیر است و استخر ما هر روز تا ده شب باز است.'],
      ['متقاضی', 'Peki kayıt için sağlık raporu gerekiyor mu yoksa buradaki form yeterli mi?', 'خب برای ثبت‌نام گواهی سلامت لازم است یا فرمِ اینجا کافی است؟'],
      ['کارمند پذیرش', 'Buradaki sağlık beyan formunu doldurmanız ve bir fotoğraf getirmeniz yeterli.', 'پر کردن فرم اظهارنامهٔ سلامت در اینجا و آوردن یک قطعه عکس کافی است.'],
    ],
    checks: [
      {
        promptFa: 'واژهٔ «ikişer saat» در پاسخ به برنامهٔ کلاس‌ها به چه معناست؟',
        choices: ['هر جلسه دو ساعت (دوساعته)', 'ساعت دو بامداد', 'فقط دو دقیقه'],
        correctIndex: 0,
        explanationFa: 'پسوند توزیعی -(ş)ar/-(ş)er روی اعداد معنای «هر کدام ... تا» می‌دهد: ikişer saat = هر کدام دو ساعت.',
      },
      {
        promptFa: 'واژهٔ «ayrıca» در پاسخ دادن به پرسش چندبخشی چه نقشی ایفا می‌کند؟',
        choices: ['بخش دوم پاسخ را منظم و روشن به بخش اول اضافه می‌کند («علاوه بر این / همچنین»)', 'پاسخ اول را نفی می‌کند', 'مکالمه را قطع می‌کند'],
        correctIndex: 0,
        explanationFa: 'ayrıca بهترین پیونددهنده برای پاسخ‌گویی شفاف به بخش دوم یک سؤال چندبخشی است.',
      },
    ],
  },

  /* ۲۷. بازگویی گفته‌های دیگران به زبان ساده */
  {
    id: 'tr-a2-s-27-reporting-others-words',
    title: 'بازگویی گفته‌های دیگران به زبان ساده',
    subtitle: 'Survival · رساندن پیغام تلفنی، خلاصه کردن صحبت همکار و انتقال سفارش یا خبر به نفر سوم',
    situation: 'وقتی کسی در دسترس نبوده پیغام تلفنی یا صحبت یک دوست و همکار را به زبان ساده و دقیق به او منتقل می‌کنید.',
    teachingFa: 'در زندگی روزمره برای رساندن پیغام از الگوهای روان «Az önce X aradı; ... söyledi» (چند لحظه پیش X زنگ زد؛ گفت که...)، «Sana selam söyledi» (به تو سلام رساند)، «Beni görünce ... dememi istedi» (خواست وقتی دیدمت بگویم که...) و «... diye not bıraktı» (یادداشت گذاشت که...) بهره می‌بریم.',
    rows: [
      ['Sen toplantıdayken kargo görevlisi aradı; paketi danışmaya bıraktığını söyledi.', 'وقتی تو در جلسه بودی مأمور پست زنگ زد؛ گفت که بسته را پیش اطلاعات گذاشته است.', 'سَن توپلانتِیدایکَن کارگو گورَولیسی آرادِی؛ پاکِتی دانِیشمایا بِیراکتِیئِینِی سویلِدی', 'bıraktığını söyledi', 'گفت که گذاشته است', '-dığını/-diğini + söylemek (بازگویی پیغام)'],
      ['Zeynep sana çok selam söyledi ve akşamki davete mutlaka geleceğini belirtti.', 'زینب خیلی به تو سلام رساند و گفت که حتماً به مهمانی امشب خواهد آمد.', 'زَینَپ سانا چوک سِلام سویلِدی وِ آکشامکی داوِته موتلاکا گِلِجَیینی بِلیرتتی', 'selam söyledi', 'سلام رساند', 'birine selam söylemek = به کسی سلام رساندن'],
      ['Ev sahibi mesaj atmış; bu ay kombi bakımının yapılacağını haber veriyor.', 'صاحب‌خانه پیام داده است؛ خبر می‌دهد که این ماه سرویس پکیج انجام خواهد شد.', 'اَو ساهیبی مِساژ آتمِیش؛ بو آی کومبی باکِیمِینِین یاپِیلاجائِینِی هابَر وِرییور', 'haber veriyor', 'اطلاع می‌دهد / خبر می‌دهد'],
      ['Müdürümüz, raporu yarın öğlene kadar kendisine göndermemizi istedi.', 'مدیرمان خواست که گزارش را تا فردا ظهر برای خودش بفرستیم.', 'مودوروموز، راپورو یارِین اوئلِنه کادار کَندیسینه گوندَرمِمیزی ایستِدی', 'göndermemizi istedi', 'خواست که بفرستیم'],
      ['Diş kliniğinden aradılar; randevu saatinin on bire alındığını söylediler.', 'از کلینیک دندان‌پزشکی زنگ زدند؛ گفتند که ساعت نوبت به یازده منتقل شده است.', 'دیش کلینیییندَن آرادِیلار؛ راندِوو ساعاتینین اون بیره آلِیندِیئِینِی سویلِدیلَر', 'alındığını söylediler', 'گفتند که منتقل شده است'],
      ['Kerem, trafikte kaldığı için on beş dakika gecikeceğini yazdı.', 'کرم نوشت که چون در ترافیک مانده پانزده دقیقه دیر خواهد رسید.', 'کِرَم، ترافیکته کالدِیئِی ایچین اون بَش داکیکا گِجیکِجَیینی یازدِی', 'gecikeceğini yazdı', 'نوشت که دیر خواهد کرد'],
      ['Komşumuz tatile çıkarken çiçeklerini haftada iki kez sulamamızı rica etti.', 'همسایه‌مان هنگام رفتن به سفر خواهش کرد گل‌هایش را هفته‌ای دو بار آب بدهیم.', 'کومشوموز تاتیله چِیکارکَن چیچَکلَرینی هافتادا ایکی کِز سولامامِیزِی ریجا اِتتی', 'sulamamızı rica etti', 'خواهش کرد آب بدهیم'],
      ['Banka görevlisi eksik imza olduğu için şubeye tekrar uğramam gerektiğini söyledi.', 'کارمند بانک گفت چون امضا کم است لازم است دوباره به شعبه سر بزنم.', 'بانکا گورَولیسی اَکسیک ایمزا اولدوئو ایچین شوبِیه تِکرار اوئرامام گِرَکتییینی سویلِدی', 'gerektiğini söyledi', 'گفت که لازم است'],
    ],
    dialogue: [
      ['آیدین', 'Ben dışarıdayken beni arayan ya da soran oldu mu?', 'وقتی من بیرون بودم کسی به من زنگ زد یا سراغم را گرفت؟'],
      ['لیلا', 'Evet, muhasebeden Ebru Hanım uğradı; faturaları imzalaman gerektiğini söyledi.', 'بله، خانم ابرو از حسابداری سر زد؛ گفت که لازم است فاکتورها را امضا کنی.'],
      ['آیدین', 'Ne zamana kadar imzalamamı istedi, bir şey dedi mi?', 'تا چه زمانی خواست امضا کنم، چیزی گفت؟'],
      ['لیلا', 'Saat dörde kadar odasına bırakabileceğini, sonrasında toplantıya gireceğini söyledi.', 'گفت که تا ساعت چهار می‌توانی در اتاقش بگذاری و بعدش وارد جلسه خواهد شد.'],
    ],
    checks: [
      {
        promptFa: 'در ترکی روزمره «Zeynep sana selam söyledi» یعنی چه؟',
        choices: ['زینب به تو سلام رساند', 'زینب از تو آدرس پرسید', 'زینب با تو مخالفت کرد'],
        correctIndex: 0,
        explanationFa: 'birine selam söylemek اصطلاح دقیق «به کسی سلام رساندن» است.',
      },
      {
        promptFa: 'عبارت «sulamamızı rica etti» چه درخواستی را بازگو می‌کند؟',
        choices: ['خواهش کرد که ما آب بدهیم', 'گفت که خودش آب داده است', 'گفت که آب قطع شده است'],
        correctIndex: 0,
        explanationFa: 'sula-ma-mız-ı rica etti با پسوند ملکی -mız بازگویی درخواست محترمانه از «ما» است.',
      },
    ],
  },

  /* ۲۸. تعریف داستان با ترتیب زمانی مشخص */
  {
    id: 'tr-a2-s-28-storytelling-chronological-order',
    title: 'تعریف داستان با ترتیب زمانی مشخص',
    subtitle: 'Survival · روایت منسجم یک ماجرای واقعی از شروع و نقطهٔ اوج تا پایان و نتیجه‌گیری',
    situation: 'یک اتفاق جالب یا ماجرای سفر را با پیونددهنده‌های زمانی از ابتدا تا پایان مانند یک داستان کوتاه تعریف می‌کنید.',
    teachingFa: 'یک روایت خوب در سطح A2 چهار مرحله دارد: ۱) صحنه‌پردازی آغازین: «Geçen cuma sabahı her şey normal başladı...»؛ ۲) پیشبرد زنجیرهٔ اتفاق‌ها: «Önce..., hemen ardından...»؛ ۳) نقطهٔ چرخش یا غافلگیری: «Tam o sırada / Birdenbire...» (درست در همان لحظه / ناگهان)؛ ۴) گره‌گشایی پایانی: «Sonunda / Neyse ki her şey tatlıya bağlandı».',
    rows: [
      ['Geçen pazar sabahı erkenden uyanıp vapurla Büyükada’ya gitmeye karar verdik.', 'یکشنبهٔ گذشته صبح زود بیدار شدیم و تصمیم گرفتیم با کشتی به بویوک‌آدا برویم.', 'گِچَن پازار ساباهِی اَرکَندَن اویانِیپ واپورلا بویوک‌آدایا گیتمِیه کارار وَردیک', 'karar verdik', 'تصمیم گرفتیم', '-maya/-meye karar vermek = تصمیم گرفتن به'],
      ['İskeleye vardığımızda hava güneşliydi ve deniz çarşaf gibi sakindi.', 'وقتی به اسکله رسیدیم هوا آفتابی بود و دریا مثل آینه آرام بود.', 'ایسکِلِیه واردِیئِیمِیزدا هاوا گونَشلییدی وِ دِنیز چارشاف گیبی ساکیندی', 'çarşaf gibi', 'بسیار آرام و صاف (اصطلاح دریا)'],
      ['Önce sahilde bisiklet kiraladık, daha sonra çam ağaçlarının arasındaki yoldan tepeye çıktık.', 'ابتدا در ساحل دوچرخه کرایه کردیم، پس از آن از جادهٔ میان درختان کاج به بالای تپه رفتیم.', 'اونجه ساهیلده بیسیکلَت کیرالادِیک، داها سونرا چام آئاچلارِینِین آراسِینداکی یولدان تِپِیه چِیکتِیک', 'kiraladık', 'کرایه کردیم'],
      ['Tam fotoğraf çektiğimiz sırada çantamın bankta kaldığını fark ettim.', 'درست در همان لحظه‌ای که داشتیم عکس می‌گرفتیم متوجه شدم کیفم روی نیمکت جا مانده است.', 'تام فوتوئراف چَکتیییمیز سِیرادا چانتامِین بانکتا کالدِیئِینِی فارک اِتتیم', 'tam fotoğraf çektiğimiz sırada', 'درست همان موقع که عکس می‌گرفتیم', 'tam ... sırada = درست در لحظه‌ای که'],
      ['Hemen geri döndük; kalbim heyecandan hızla çarpıyordu.', 'فوراً برگشتیم؛ قلبم از هیجان و استرس تند می‌زد.', 'هِمَن گِری دوندوک؛ کالبیم هِیِجاندان هِیزلا چارپِییوردو', 'hızla çarpıyordu', 'تند می‌تپید'],
      ['Oraya ulaştığımızda yaşlı bir beyefendi çantayı koruyup bizi bekliyordu.', 'وقتی به آنجا رسیدیم آقای مسنی مراقب کیف بود و منتظر ما می‌ماند.', 'اورایا اولاشتِیئِیمِیزدا یاشلِی بیر بَی‌آفَندی چانتایِی کورویوپ بیزی بَکلییوردو', 'bekliyordu', 'منتظر بود'],
      ['Kendisine defalarca teşekkür edip birlikte sıcak bir çay içtik.', 'چندین بار از ایشان تشکر کردیم و با هم یک چای گرم نوشیدیم.', 'کَندیسینه دِفالارجا تِشَککور اِدیپ بیرلیکته سِیجاک بیر چای ایچتیک', 'defalarca', 'چندین بار / بارها'],
      ['Sonunda o küçük aksilik bize çok güzel bir dostluk kazandırdı.', 'سرانجام آن دردسر کوچک یک دوستی بسیار زیبا نصیب ما کرد.', 'سونوندا او کوچوک آکسیلیک بیزه چوک گوزَل بیر دوستلوک کازاندِیردِی', 'sonunda', 'سرانجام / در پایان'],
    ],
    dialogue: [
      ['لاله', 'Dün akşamki yolculuğun nasıl geçti, tren saatinde kalktı mı?', 'سفر دیشبت چطور گذشت، قطار سر ساعت حرکت کرد؟'],
      ['کامیار', 'Başta her şey yolundaydı; önce koltuğuma yerleştim, sonra kitabımı açtım.', 'اولش همه‌چیز روبه‌راه بود؛ اول سر جایم نشستم، بعد کتابم را باز کردم.'],
      ['لاله', 'Peki sonra ne oldu, sesinden ilginç bir şey olmuş gibi anlaşılıyor!', 'خب بعدش چه شد، از صدایت پیداست اتفاق جالبی افتاده است!'],
      ['کامیار', 'Tam tren hareket ederken yan koltuğa lisedeki en yakın arkadaşım oturdu; yol boyunca sohbet ettik!', 'درست وقتی قطار داشت حرکت می‌کرد صمیمی‌ترین دوست دوران دبیرستانم روی صندلی کناری نشست؛ تمام مسیر گپ زدیم!'],
    ],
    checks: [
      {
        promptFa: 'عبارت «Tam o sırada» در تعریف داستان چه نقشی دارد؟',
        choices: ['نقطهٔ هم‌زمانی و چرخش ناگهانی داستان («درست در همان لحظه») را نشان می‌دهد', 'داستان را به آیندهٔ دور می‌برد', 'جمله را شرطی می‌کند'],
        correctIndex: 0,
        explanationFa: '«Tam o sırada» یا «Tam ... sırada» نقطهٔ اوج یا رویداد هم‌زمان را وارد روایت می‌کند.',
      },
      {
        promptFa: 'واژهٔ «defalarca» یعنی چه؟',
        choices: ['فقط یک بار', 'چندین بار / بارها', 'بدون تشکر'],
        correctIndex: 1,
        explanationFa: 'پسوند -larca/-lerce روی defa معنای «بارها و بارها» می‌سازد.',
      },
    ],
  },

  /* ۲۹. صحبت درباره اتفاق‌های شنیده‌شده یا تجربه‌های نقل‌شده */
  {
    id: 'tr-a2-s-29-heard-events-reported-experiences',
    title: 'صحبت درباره اتفاق‌های شنیده‌شده یا تجربه‌های نقل‌شده',
    subtitle: 'Survival · انتقال اخبار روزمره، نظرات کاربران و شنیده‌ها با -mış و duyduğuma göre',
    situation: 'دربارهٔ رستوران جدید، خبر شهری یا تجربهٔ سفری که از دیگران شنیده‌اید یا در اینترنت خوانده‌اید صحبت می‌کنید.',
    teachingFa: 'هنگام گفتگو دربارهٔ رویدادهایی که شخصاً شاهدشان نبوده‌ایم، ترکی استانبولی از گذشتهٔ نقلی (-mış/-miş/-muş/-müş) و پسوند ترکیبی «-(y)mış» همراه با عبارت‌های «Duyduğuma göre...» (طبق شنیده‌هایم)، «Söylendiğine göre...» (بنا بر آنچه گفته می‌شود) و «Yorumlara bakılırsa...» (اگر به نظرات نگاه کنیم) استفاده می‌کند.',
    rows: [
      ['Duyduğuma göre mahallemize önümüzdeki ay yeni bir metro durağı açılıyormuş.', 'طبق شنیده‌هایم ماه آینده در محلهٔ ما ایستگاه متروی جدیدی افتتاح می‌شود.', 'دویدوئوما گوره ماهاللِمیزه اونوموزدِکی آی یِنی بیر مِترو دورائِی آچِیلِییورموش', 'açılıyormuş', 'گویا دارد افتتاح می‌شود', 'duyduğuma göre + -ıyormuş'],
      ['İnternetteki yorumlara bakılırsa bu otelin kahvaltısı ve manzarası harikaymış.', 'اگر به نظرات اینترنتی نگاه کنیم صبحانه و منظرهٔ این هتل گویا فوق‌العاده است.', 'اینتَرنَتتِکی یوروملارا باکِیلِیرسا بو اوتِلین کاهوالتِیسِی وِ مانزاراسِی هاریکایمِیش', 'harikaymış', 'گویا عالی است', 'صفت + -(y)mış برای توصیف شنیده‌شده'],
      ['Arkadaşım geçen kış Kars’a gitmiş; Doğu Ekspresi yolculuğu masal gibiymiş.', 'دوستم زمستان گذشته به قارص رفته است؛ سفر با قطار دوغو اکسپرس گویا مثل افسانه بوده است.', 'آرکاداشِیم گِچَن کِیش کارسا گیتمیش؛ دوئو اَکسپرِسی یولجولوئو ماسال گیبییمیش', 'gibiymiş', 'گویا مانندِ ... بوده است'],
      ['Haberlerde okudum; hafta sonu hava sıcaklığı on derece birden düşecekmiş.', 'در خبرها خواندم؛ گویا آخر هفته دمای هوا یک‌باره ده درجه پایین خواهد آمد.', 'هابَرلَرده اوکودوم؛ هافتا سونو هاوا سِیجاکلِیئِی اون دَرِجه بیردَن دوشِجَکمیش', 'düşecekmiş', 'گویا کاهش خواهد یافت', 'Gelecek Zaman + -miş = آیندهٔ نقل‌شده'],
      ['Komşuların söylediğine göre üst kattaki daire geçen hafta satılmış.', 'بنا بر گفتهٔ همسایه‌ها واحدِ طبقهٔ بالا هفتهٔ گذشته فروخته شده است.', 'کومشولارِین سویلِدییینه گوره اوست کاتتاکی دایره گِچَن هافتا ساتِیلمِیش', 'satılmış', 'فروخته شده است (شنیده‌شده)'],
      ['Kuzenim bu kursa katılmış ve üç ayda akıcı konuşmaya başlamış.', 'پسرعمویم در این دوره شرکت کرده و ظرف سه ماه شروع به صحبت روان کرده است.', 'کوزِنیم بو کورسا کاتِیلمِیش وِ اوچ آیدا آکِیجِی کونوشمایا باشلامِیش', 'akıcı', 'روان / سلیس'],
      ['Müze görevlisinden öğrendik; bu tarihi köşk iki yüz yıl önce inşa edilmiş.', 'از کارمند موزه یاد گرفتیم؛ این عمارت تاریخی دویست سال پیش ساخته شده است.', 'موزه گورَولیسیندَن اوئرَندیک؛ بو تاریهی کوشک ایکی یوز یِیل اونجه اینشا اِدیلمیش', 'inşa edilmiş', 'ساخته شده است'],
      ['Söylentiye göre ünlü yönetmen yeni filmini İstanbul sokaklarında çekecekmiş.', 'طبق شنیده‌ها کارگردان مشهور فیلم جدیدش را در خیابان‌های استانبول فیلم‌برداری خواهد کرد.', 'سویلَنتییه گوره اونلو یونَتمَن یِنی فیلمینی ایستانبول سوکاکلارِیندا چِکِجَکمیش', 'çekecekmiş', 'گویا فیلم‌برداری خواهد کرد'],
    ],
    dialogue: [
      ['شادی', 'Köşede yeni açılan fırını denedin mi? Önünde hep kuyruk var.', 'نانوایی تازه‌تأسیس سر نبش را امتحان کرده‌ای؟ جلویش همیشه صف است.'],
      ['اوزان', 'Henüz denemedim ama iş arkadaşlarım gitmiş; ekşi mayalı ekmekleri çok lezzetliymiş.', 'هنوز امتحان نکرده‌ام اما همکارانم رفته‌اند؛ گویا نان‌های خمیرترشش خیلی خوش‌مزه است.'],
      ['شادی', 'Fiyatları nasılmış, bilgin var mı?', 'قیمت‌هایش چطور بوده، اطلاعی داری؟'],
      ['اوزان', 'Duyduğuma göre porsiyonları büyük ve fiyatları mahalledeki diğer kafelere göre makulmüş.', 'طبق شنیده‌هایم پرس‌هایش بزرگ و قیمت‌هایش نسبت به کافه‌های دیگر محله منطقی است.'],
    ],
    checks: [
      {
        promptFa: 'در جملهٔ «Hava sıcaklığı düşecekmiş»، ترکیب «-ecekmiş» چه معنایی می‌سازد؟',
        choices: ['پیش‌بینی آینده که از منبع دیگری (مانند اخبار) شنیده یا خوانده شده است', 'اتفاقی که خودم دیروز دیدم', 'دستور مستقیم به مخاطب'],
        correctIndex: 0,
        explanationFa: 'افزودن -miş به پایهٔ آینده (-ecek) نشان می‌دهد که خبرِ آینده نقل‌شده از منبع دیگر است («گویا کاهش خواهد یافت»).',
      },
      {
        promptFa: 'عبارت «Yorumlara bakılırsa» به چه معناست؟',
        choices: ['اگر به نظرات کاربران توجه کنیم / بر اساس دیدگاه‌ها', 'لطفاً نظر ننویسید', 'نظرات حذف شده‌اند'],
        correctIndex: 0,
        explanationFa: 'bakılırsa (مجهول شرطی از bakmak) در گفتار طبیعی یعنی «اگر نگاه شود / از قرارِ معلوم در نظرات».',
      },
    ],
  },

  /* ۳۰. شرکت در مکالمه‌های طولانی‌تر با چند جمله مرتبط */
  {
    id: 'tr-a2-s-30-extended-connected-conversations',
    title: 'شرکت در مکالمه‌های طولانی‌تر با چند جمله مرتبط',
    subtitle: 'Survival · حفظ رشتهٔ کلام، پرسیدن سؤال پیگیرانه، دادن بازخورد فعال و بسط دادن پاسخ‌ها',
    situation: 'در یک گفتگوی چنددقیقه‌ای فقط پاسخ تک‌کلمه‌ای نمی‌دهید؛ نظر طرف مقابل را بسط می‌دهید و گفتگو را جلو می‌برید.',
    teachingFa: 'برای مشارکت فعال در مکالمهٔ طولانی‌تر سه مهارت به کار می‌آید: ۱) نشان دادن گوش دادن فعال: «Gerçekten mi? Çok ilginç!» (واقعاً؟ خیلی جالب است!)، «Seni çok iyi anlıyorum»؛ ۲) بسط پاسخ در دو یا سه جملهٔ مرتبط (علت + مثال + نتیجه)؛ ۳) برگرداندن توپ گفتگو به طرف مقابل با پرسش پیگیرانه: «Peki sen bu konuda ne yaşadın? / Senin izlenimin nasıl oldu?».',
    rows: [
      ['Söylediğin nokta çok ilginç; ben daha önce bu açıdan hiç düşünmemiştim.', 'نکته‌ای که گفتی خیلی جالب است؛ من قبلاً اصلاً از این زاویه فکر نکرده بودم.', 'سویلِدییین نوکتا چوک ایلگینچ؛ بَن داها اونجه بو آچِیدان هیچ دوشونمِمیشـتیم', 'bu açıdan', 'از این زاویه / از این دیدگاه'],
      ['Başka bir deyişle, düzenli plan yapmak hem stresi azaltıyor hem zaman kazandırıyor.', 'به عبارت دیگر، برنامه‌ریزی منظم هم استرس را کم می‌کند و هم زمان ذخیره می‌کند.', 'باشکا بیر دِییشله، دوزَنلی پلان یاپماک هَم استرِسی آزالتِییور هَم زامان کازاندِیرِییور', 'başka bir deyişle', 'به عبارت دیگر'],
      ['Örneğin geçen hafta listeyle alışverişe çıktım ve gereksiz hiçbir şey almadım.', 'مثلاً هفتهٔ گذشته با فهرست به خرید رفتم و هیچ چیز غیرضروری نخریدم.', 'اورنَیین گِچَن هافتا لیستَیله آلِیش‌وِریشه چِیکتِیم وِ گِرَکسیز هیچ‌بیر شَی آلمادِیم', 'örneğin', 'برای مثال / مثلاً', 'آوردن نمونهٔ عینی برای بسط مکالمه'],
      ['Bunun yanı sıra mahalledeki küçük esnaftan alışveriş yapmak da hoşuma gidiyor.', 'در کنار این، خرید کردن از کسبهٔ کوچک محله هم خوشایندم است.', 'بونون یانِی سِیرا ماهاللِدِکی کوچوک اَسنافتان آلِیش‌وِریش یاپماک دا هوشوما گیدییور', 'bunun yanı sıra', 'در کنارِ این / افزون بر این'],
      ['Konu açılmışken, geçen ay başladığın dil kursu nasıl gidiyor?', 'حالا که صحبتش باز شد، کلاس زبانی که ماه پیش شروع کردی چطور پیش می‌رود؟', 'کونو آچِیلمِیشکَن، گِچَن آی باشلادِیئِین دیل کورسو ناسِیل گیدییور', 'konu açılmışken', 'تا صحبتش هست / حالا که حرفش شد', 'عبارت طبیعی برای پیوند موضوع جدید مرتبط'],
      ['Seni çok iyi anlıyorum; benzer bir durumu ilk taşındığımda ben de yaşamıştım.', 'کاملاً درکت می‌کنم؛ وضعیت مشابهی را من هم وقتی تازه اسباب‌کشی کرده بودم تجربه کرده بودم.', 'سِنی چوک اییی آنلِییوروم؛ بَنزَر بیر دورومو ایلک تاشِیندِیئِیمدا بَن دِ یاشامِیشتِیم', 'anlıyorum', 'درک می‌کنم'],
      ['Kısacası hem iş hem sosyal hayat arasında denge kurmak bizim elimizde.', 'خلاصه اینکه برقرار کردن تعادل میان کار و زندگی اجتماعی در دست خودمان است.', 'کِیساجاسِی هَم ایش هَم سوسیال هایات آراسِیندا دَنگه کورماک بیزیم اِلیمیزده', 'kısacası', 'خلاصه اینکه / به طور خلاصه'],
      ['Peki senin bu konudaki deneyimin nasıl oldu, biraz anlatır mısın?', 'خب تجربهٔ تو در این زمینه چطور بود، کمی تعریف می‌کنی؟', 'پِکی سِنین بو کونوداکی دِنِییمین ناسِیل اولدو، بیراز آنلاتِیر مِیسِین', 'anlatır mısın', 'تعریف می‌کنی؟ (دعوت به ادامهٔ گفتگو)'],
    ],
    dialogue: [
      ['مهتاب', 'Son zamanlarda hafta sonları telefonu bir kenara bırakıp doğada vakit geçirmeye çalışıyorum.', 'اواخر سعی می‌کنم آخر هفته‌ها تلفن را کنار بگذارم و در طبیعت وقت بگذرانم.'],
      ['سینان', 'Seni çok iyi anlıyorum! Sürekli ekrana bakmak insanı farkında olmadan yoruyor; örneğin ben de pazar günleri bildirimleri kapatıyorum.', 'کاملاً درکت می‌کنم! مدام به صفحه نگاه کردن آدم را ناخودآگاه خسته می‌کند؛ مثلاً من هم یکشنبه‌ها اعلان‌ها را خاموش می‌کنم.'],
      ['مهتاب', 'Gerçekten mi? Bildirimleri kapatınca günlük rutininde nasıl bir fark hissettin?', 'واقعاً؟ وقتی اعلان‌ها را بستی چه تفاوتی در روال روزانه‌ات حس کردی؟'],
      ['سینان', 'Zihnim çok daha sakinleşti; bunun yanı sıra yarım kalan kitaplarımı bitirmeye başladım. Kısacası küçük bir adım büyük fark yarattı.', 'ذهنم خیلی آرام‌تر شد؛ در کنار آن شروع به تمام کردن کتاب‌های نیمه‌تمامم کردم. خلاصه یک قدم کوچک تفاوت بزرگی ایجاد کرد.'],
    ],
    checks: [
      {
        promptFa: 'عبارت گفتمانی «Konu açılmışken» چه کاربردی در مکالمه دارد؟',
        choices: ['پیوند زدن طبیعی یک پرسش یا نکتهٔ مرتبط («حالا که صحبتش باز شد»)', 'پایان دادن ناگهانی به تماس', 'معذرت‌خواهی در فروشگاه'],
        correctIndex: 0,
        explanationFa: 'konu açılmışken پل بسیار طبیعی برای بردن گفتگو به یک زیرموضوع مرتبط است.',
      },
      {
        promptFa: 'کدام واژه برای جمع‌بندی چند جملهٔ قبلی («خلاصه اینکه») به کار می‌رود؟',
        choices: ['Kısacası', 'Örneğin', 'Henüz'],
        correctIndex: 0,
        explanationFa: 'kısacası یعنی «خلاصه اینکه» و örneğin یعنی «برای مثال».',
      },
    ],
  },

  /* ۳۱. مدیریت یک گفت‌وگوی روزمره از شروع تا پایان */
  {
    id: 'tr-a2-s-31-managing-conversation-start-to-finish',
    title: 'مدیریت یک گفت‌وگوی روزمره از شروع تا پایان',
    subtitle: 'Survival · سر صحبت را باز کردن، نگه داشتن جریان گفتگو، جمع‌بندی محترمانه و خداحافظی گرم',
    situation: 'از لحظهٔ سلام و گشودن سر صحبت تا تغییر نرم موضوع و خداحافظی محترمانه، یک گفتگوی کامل روزمره را مدیریت می‌کنید.',
    teachingFa: 'چارچوب کامل مدیریت مکالمه در ترکی استانبولی: ۱) شروع گرم: «Merhaba, nasılsın? Görüşmeyeli neler yapıyorsun?» (از وقتی همدیگر را ندیده‌ایم چه‌کارها می‌کنی؟)؛ ۲) شفاف‌سازی در میانهٔ بحث: «Tam anlayamadım, tekrar eder misin?» یا «Yani demek istiyorsun ki...»؛ ۳) آماده‌سازی محترمانه برای پایان مکالمه: «Sohbet çok keyifliydi ama şimdi gitmem gerekiyor»؛ ۴) خداحافظی گرم: «Kendine çok iyi bak, en kısa zamanda tekrar görüşelim!».',
    rows: [
      ['Merhaba! Ne güzel bir tesadüf; görüşmeyeli neler yapıyorsun, her şey yolunda mı?', 'سلام! چه تصادف خوبی؛ از وقتی همدیگر را ندیده‌ایم چه‌کارها می‌کنی، همه‌چیز روبه‌راه است؟', 'مَرحابا! نِ گوزَل بیر تِسادوف؛ گوروشمِیِلی نِلَر یاپِییورسون، هَر شَی یولوندا مِی', 'görüşmeyeli', 'از وقتی همدیگر را ندیده‌ایم', 'شروع صمیمانهٔ گفت‌وگو'],
      ['Teşekkür ederim, her şey yolunda; yoğun ama keyifli bir dönem geçiriyorum.', 'متشکرم، همه‌چیز روبه‌راه است؛ دورهٔ شلوغ اما لذت‌بخشی را می‌گذرانم.', 'تِشَککور اِدَریم، هَر شَی یولوندا؛ یوئون آما کِییفلی بیر دونَم گِچیرییوروم', 'her şey yolunda', 'همه‌چیز روبه‌راه است'],
      ['Son cümleni gürültüden dolayı tam duyamadım; rica etsem tekrar eder misin?', 'جملهٔ آخرت را به خاطر سر‌و‌صدا کامل نشنیدم؛ اگر خواهش کنم تکرار می‌کنی؟', 'سون جوملَنی گورولتودَن دولایِی تام دویامادِیم؛ ریجا اَتسَم تِکرار اِدَر میسین', 'tekrar eder misin', 'تکرار می‌کنی؟', 'مدیریت سوءتفاهم یا نشنیدن در گفتگو'],
      ['Yanlış anlamadıysam önümüzdeki ay yeni şubeye geçiyorsunuz, değil mi?', 'اگر اشتباه متوجه نشده باشم ماه آینده به شعبهٔ جدید می‌روید، درست است؟', 'یانلِیش آنلامادِییسام اونوموزدِکی آی یِنی شوبِیه گِچییورسونوز، دِئیل می', 'yanlış anlamadıysam', 'اگر اشتباه نفهمیده باشم'],
      ['Bu arada lafını balla kesiyorum ama önemli bir detayı sormak istiyorum.', 'راستی حرفت را با عسل می‌بُرم (ببخشید میان کلامت)، اما می‌خواهم جزئیات مهمی را بپرسم.', 'بو آرادا لافِینِی باللا کِسییوروم آما اونَملی بیر دِتایِی سورماک ایستییوروم', 'bu arada', 'راستی / در ضمن', 'lafını balla kesmek = اصطلاح مودبانهٔ ورود به سخن'],
      ['Seninle sohbet etmek gerçekten çok güzeldi ama saat ilerledi, artık kalkmam lazım.', 'گپ زدن با تو واقعاً خیلی خوب بود اما دیروقت شده، دیگر باید بروم.', 'سِنینله سوهبَت اِتمَک گَرچَکتَن چوک گوزَلدی آما ساعات ایلَرلِدی، آرتِیک کالکمام لازِیم', 'kalkmam lazım', 'لازم است بلند شوم / بروم', 'جمع‌بندی محترمانه برای پایان مکالمه'],
      ['Numaralarımızı kaydettiğimize göre bu hafta bir kahve için mutlaka haberleşelim.', 'حالا که شماره‌هایمان را ذخیره کردیم این هفته برای یک قهوه حتماً با هم هماهنگ کنیم.', 'نومارالارِیمِیزِی کایدَتتیییمیزه گوره بو هافتا بیر کاهوه ایچین موتلاکا هابَرلَشِلیم', 'haberleşelim', 'با هم در تماس باشیم / هماهنگ کنیم'],
      ['Kendine çok iyi bak, ailene de benden selam söyle; yakında görüşmek üzere!', 'خیلی مراقب خودت باش، به خانواده‌ات هم از طرف من سلام برسان؛ به امید دیدار نزدیک!', 'کَندینه چوک اییی باک، آیلَنه دِ بَندَن سِلام سویله؛ یاکِیندا گوروشمَک اوزِره', 'kendine çok iyi bak', 'خیلی مراقب خودت باش'],
    ],
    dialogue: [
      ['آرزو', 'Merhaba Deniz! Ne güzel bir sürpriz, görüşmeyeli nasılsın?', 'سلام دنیز! چه غافلگیری خوبی، از وقتی همدیگر را ندیده‌ایم چطوری؟'],
      ['دنیز', 'Merhaba Arzu! Çok iyiyim, teşekkürler; yeni projemiz başladığı için bu aralar biraz koşturuyorum. Sen neler yapıyorsun?', 'سلام آرزو! خیلی خوبم، ممنون؛ چون پروژهٔ جدیدمان شروع شده این روزها کمی در تکاپو هستم. تو چه‌کارها می‌کنی؟'],
      ['آرزو', 'Ben de Türkçe kursunda ikinci seviyeyi bitirmek üzereyim; artık günlük sohbetleri rahatça sürdürebiliyorum.', 'من هم در کلاس ترکی در شرف تمام کردن سطح دوم هستم؛ دیگر می‌توانم گفتگوهای روزمره را راحت ادامه بدهم.'],
      ['دنیز', 'Ne kadar sevindim! Sohbetin çok keyifliydi ama şimdi derse yetişmem gerekiyor; bu hafta mutlaka haberleşip kahve içelim, kendine çok iyi bak!', 'چقدر خوشحال شدم! هم‌صحبتی‌ات خیلی دلچسب بود اما الان باید به کلاس برسم؛ این هفته حتماً هماهنگ کنیم و قهوه بخوریم، خیلی مراقب خودت باش!'],
    ],
    checks: [
      {
        promptFa: 'وقتی در میانهٔ گفتگو می‌خواهید مطمئن شوید حرف مخاطب را درست فهمیده‌اید چه می‌گویید؟',
        choices: ['Yanlış anlamadıysam...', 'Kapıda kaldım...', 'Aç karnına içtim...'],
        correctIndex: 0,
        explanationFa: '«Yanlış anlamadıysam...» (اگر اشتباه متوجه نشده باشم...) بهترین راه کنترل درک مطلب در مکالمه است.',
      },
      {
        promptFa: 'کدام جمله بهترین روش محترمانه برای جمع‌بندی و پایان دادن به یک گفتگوی دوستانه است؟',
        choices: ['Seninle sohbet etmek çok güzeldi ama artık kalkmam lazım; yakında haberleşelim!', 'Hiçbir şey söylemeden gidiyorum.', 'Burada sigara içmek yasaktır.'],
        correctIndex: 0,
        explanationFa: 'ابراز خرسندی از هم‌صحبتی + بیان محترمانهٔ ضرورت رفتن + وعدهٔ تماس مجدد (haberleşelim) طبیعی‌ترین پایان گفتگوی ترکی است.',
      },
    ],
  },
];

export const TURKISH_A2_SURVIVAL_PART_B = buildTurkishLessons(A2_SURVIVAL_PART_B_SEEDS, 'tr3', 337);
