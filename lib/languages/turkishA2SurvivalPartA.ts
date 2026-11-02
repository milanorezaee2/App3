import { buildTurkishLessons, type TurkishLessonSeed } from './turkishSeed';

const A2_SURVIVAL_PART_A_SEEDS: readonly TurkishLessonSeed[] = [
  /* ۱. شرح تجربه‌ها و اتفاق‌های گذشته */
  {
    id: 'tr-a2-s-01-past-experiences-events',
    title: 'شرح تجربه‌ها و اتفاق‌های گذشته',
    subtitle: 'Survival · تعریف اتفاق‌های اخیر، سفرها و موقعیت‌هایی که از سر گذرانده‌اید',
    situation: 'در گفتگو با دوستان یا همکاران توضیح می‌دهید هفتهٔ گذشته چه اتفاقی افتاد و چه تجربه‌ای کسب کردید.',
    teachingFa: 'هنگام شرح اتفاق‌های گذشته، زمان و مکان در آغاز جمله قرار می‌گیرد (Geçen hafta sonu İzmir’de...) و رویدادهای اصلی با گذشتهٔ قطعی (-dı/-di) به هم وصل می‌شوند. عبارات واکنشی مانند Gerçekten mi? (واقعاً؟)، Ne güzel bir deneyim! (چه تجربهٔ خوبی!) و Sonra ne oldu? (بعدش چه شد؟) مکالمه را زنده نگه می‌دارند.',
    rows: [
      ['Geçen hafta sonu ilk kez feribotla Bursa’ya geçtik.', 'آخر هفتهٔ گذشته برای اولین بار با کشتی مسافربری به بورسا رفتیم.', 'گِچَن هافتا سونو ایلک کِز فِریبوتلا بورسایا گِچتیک', 'feribotla', 'با کشتی مسافربری', 'قید زمان در آغاز + گذشتهٔ قطعی'],
      ['Yolculuk boyunca güvertede oturup martılara simit attık.', 'در طول سفر روی عرشه نشستیم و برای مرغ‌های دریایی سیمیت انداختیم.', 'یولجولوک بویونجا گووَرتِده اوتوروپ مارتِیلارا سیمیت آتتِیک', 'boyunca', 'در طولِ / در سراسرِ'],
      ['Şehre vardığımızda tarihi çarşıyı baştan sona gezdik.', 'وقتی به شهر رسیدیم بازار تاریخی را از سر تا ته گشتیم.', 'شِهره واردِیئِیمِیزدا تاریهی چارشِییِی باشتان سونا گَزدیک', 'vardığımızda', 'وقتی رسیدیم', '-dığımızda = هنگامی که ما...'],
      ['Dönüş yolunda aniden sağanak yağmur başladı ama ıslanmadık.', 'در راه بازگشت ناگهان باران رگباری شروع شد اما خیس نشدیم.', 'دونوش یولوندا آنیدَن سائاناک یائْمور باشلادِی آما ایسلانمادِیک', 'sağanak', 'رگبار / باران تند'],
      ['Geçen ay katıldığım fotoğrafçılık atölyesi çok verimli geçti.', 'کارگاه عکاسی‌ای که ماه گذشته در آن شرکت کردم بسیار پربار گذشت.', 'گِچَن آی کاتِیلدِیئِیم فوتوئرافچِیلِیک آتولیِسی چوک وِریملی گِچتی', 'verimli', 'پربار / مفید'],
      ['Orada farklı şehirlerden gelen birçok insanla tanıştım.', 'آنجا با افراد زیادی که از شهرهای مختلف آمده بودند آشنا شدم.', 'اورادا فارکلِی شِهیرلَردَن گِلَن بیرچوک اینسانلا تانِیشتِیم', 'tanıştım', 'آشنا شدم'],
      ['Akşamüstü sahilde beklenmedik bir sokak konserine denk geldik.', 'دمِ غروب در ساحل به‌طور غیرمنتظره به یک کنسرت خیابانی برخوردیم.', 'آکشام‌اوستو ساهیلده بَکلَنمِدیک بیر سوکاک کونسِرینه دَنک گَلدیک', 'denk geldik', 'برخوردیم / تصادفاً رسیدیم', '-a/-e denk gelmek = اتفاقی برخوردن به'],
      ['Bu gezi bizim için unutulmaz bir deneyim oldu.', 'این گردش برای ما تبدیل به تجربه‌ای فراموش‌نشدنی شد.', 'بو گِزی بیزیم ایچین اونوتولماز بیر دِنِییم اولدو', 'deneyim', 'تجربه'],
    ],
    dialogue: [
      ['ترانه', 'Duyduğuma göre geçen hafta Kapadokya’daymışsın; yolculuk nasıl geçti?', 'شنیدم هفتهٔ پیش کاپادوکیا بوده‌ای؛ سفر چطور گذشت؟'],
      ['امره', 'Harika geçti! Sabah gün doğumunda vadide yürüyüş yaptık ve yer altı şehrini gezdik.', 'عالی گذشت! صبح هنگام طلوع آفتاب در دره پیاده‌روی کردیم و شهر زیرزمینی را گشتیم.'],
      ['ترانه', 'Çok etkileyici! Peki orada yerel yemekleri de denediniz mi?', 'خیلی چشمگیر است! خب غذاهای محلی آنجا را هم امتحان کردید؟'],
      ['امره', 'Evet, küçük bir aile lokantasında testi kebabı yedik; tadı gerçekten nefisti.', 'بله، در یک رستوران خانوادگی کوچک کباب کوزه‌ای خوردیم؛ طعمش واقعاً بی‌نظیر بود.'],
    ],
    checks: [
      {
        promptFa: 'عبارت «sokak konserine denk geldik» یعنی چه؟',
        choices: ['کنسرت خیابانی را لغو کردیم', 'اتفاقی به یک کنسرت خیابانی برخوردیم', 'در کنسرت خیابانی ساز زدیم'],
        correctIndex: 1,
        explanationFa: 'فعل مرکب «-a/-e denk gelmek» در ترکی استانبولی یعنی «به‌طور تصادفی با چیزی روبه‌رو شدن».',
      },
      {
        promptFa: 'واژهٔ «vardığımızda» چه مفهومی را می‌رساند؟',
        choices: ['وقتی که رسیدیم', 'پیش از راه افتادن', 'اگر نرسیم'],
        correctIndex: 0,
        explanationFa: 'ساختار «-dığımızda» قید زمان گذشته/حال به معنای «وقتی که ما ... کردیم» است.',
      },
    ],
  },

  /* ۲. تعریف خاطرات و رویدادهای شخصی */
  {
    id: 'tr-a2-s-02-memories-personal-events',
    title: 'تعریف خاطرات و رویدادهای شخصی',
    subtitle: 'Survival · بازگویی خاطرات کودکی، جشن‌ها و عادت‌های گذشته با پسوند -ırdı / -ıyordu',
    situation: 'خاطرات دوران کودکی، مدرسه یا یک رویداد به‌یادماندنی شخصی را با لحن صمیمی تعریف می‌کنید.',
    teachingFa: 'برای بیان عادت‌های گذشته («در کودکی همیشه... می‌کردیم») ترکی استانبولی پایهٔ Geniş Zaman را با پسوند گذشته ترکیب می‌کند: oynardık (بازی می‌کردیم)، giderdik (می‌رفتیم). برای توصیف صحنهٔ در جریان در گذشته نیز «Şimdiki Zaman + گذشته» می‌آید: gülüyorduk (داشتیم می‌خندیدیم). واژه‌هایی مانند çocukluğumda (در کودکی‌ام)، o gün (آن روز) و hiç unutmam (هرگز فراموش نمی‌کنم) آغازگر طبیعی خاطرات هستند.',
    rows: [
      ['Çocukluğumda yaz tatillerini dedemin köy evinde geçirirdik.', 'در کودکی‌ام تعطیلات تابستان را در خانهٔ روستایی پدربزرگم می‌گذراندیم.', 'چوجوکلوئومدا یاز تاتیللَرینی دِدَمین کوی اِوینده گِچیریردیک', 'geçirirdik', 'می‌گذراندیم (عادت گذشته)', 'Geniş Zaman + -di + k = عادت در گذشته'],
      ['Üniversiteden mezun olduğum günü hiç unutmam.', 'روزی را که از دانشگاه فارغ‌التحصیل شدم هرگز فراموش نمی‌کنم.', 'اونیوَرسیتِدَن مِزون اولدوئوم گونو هیچ اونوتمام', 'mezun olduğum', 'فارغ‌التحصیل شدنم', 'hiç unutmam برای شروع خاطره'],
      ['Akşamları bütün aile bahçede toplanır, çay içip sohbet ederdik.', 'عصرها همهٔ خانواده در باغچه جمع می‌شدیم، چای می‌نوشیدیم و گپ می‌زدیم.', 'آکشاملارِی بوتون آیله باهچِده توپلانِیر، چای ایچیپ سوهبَت اِدَردیک', 'sohbet ederdik', 'گپ می‌زدیم (گذشتهٔ استمراری عادتی)'],
      ['İlk iş görüşmeme giderken heyecandan ellerim titriyordu.', 'وقتی به اولین مصاحبهٔ کاری‌ام می‌رفتم از هیجان دستانم می‌لرزید.', 'ایلک ایش گوروشمَمه گیدَرکَن هِیِجاندان اَللَریم تیترییوردو', 'titriyordu', 'داشت می‌لرزید', '-ıyordu برای توصیف صحنه در گذشته'],
      ['Doğum günümde arkadaşlarım bana çok güzel bir sürpriz hazırladı.', 'در روز تولدم دوستانم سورپرایز بسیار زیبایی برایم تدارک دیدند.', 'دوئوم گونومده آرکاداشلارِیم بانا چوک گوزَل بیر سورپریز هازِیرلادِی', 'sürpriz', 'غافلگیری / سورپرایز'],
      ['O eski fotoğraf albümüne her baktığımda yüzümde tebessüm oluşur.', 'هر بار که به آن آلبوم عکس قدیمی نگاه می‌کنم لبخندی روی صورتم می‌نشیند.', 'او اِسکی فوتوئراف آلبومونه هَر باکتِیئِیمدا یوزومده تِبَسّوم اولوشور', 'baktığımda', 'هر وقت نگاه می‌کنم'],
      ['Lise yıllarında hafta sonları sahaf dükkanlarını dolaşırdım.', 'در سال‌های دبیرستان آخر هفته‌ها در کتاب‌فروشی‌های قدیمی می‌گشتم.', 'لیسه یِیللارِیندا هافتا سونلارِی ساهاف دوککانلارِینِی دولاشِیردِیم', 'dolaşırdım', 'می‌گشتم (عادت سال‌های گذشته)'],
      ['Düğün töreninde uzun zamandır görmediğim akrabalarımı gördüm.', 'در مراسم عروسی بستگانی را که مدت‌ها ندیده بودم دیدم.', 'دویون تورِنینده اوزون زاماندِیر گورمِدیییم آکرابالارِیمِی گوردوم', 'akrabalarımı', 'بستگانم را'],
    ],
    dialogue: [
      ['یلدا', 'Bu fotoğraftaki küçük sahil kasabası neresi?', 'این شهرک ساحلیِ کوچک توی عکس کجاست؟'],
      ['جم', 'Orası Ayvalık; çocukluğumda her ağustos ayında ailemle oraya giderdik.', 'آنجا آیوالیک است؛ در کودکی‌ام هر ماه اوت با خانواده‌ام به آنجا می‌رفتیم.'],
      ['یلدا', 'Orada en çok ne yapmaktan hoşlanırdın?', 'آنجا بیش از همه از چه کاری خوشت می‌آمد؟'],
      ['جم', 'Sabah erkenden babamla balığa çıkardık; o sabahları hâlâ özlüyorum.', 'صبح زود با پدرم به ماهی‌گیری می‌رفتیم؛ هنوز هم دلتنگ آن صبح‌ها هستم.'],
    ],
    checks: [
      {
        promptFa: 'ساختار «giderdik» در «Her yaz oraya giderdik» چه زمانی را بیان می‌کند؟',
        choices: ['عادت همیشگی در گذشته (می‌رفتیم)', 'برنامهٔ قطعی فردا', 'دستور در زمان حال'],
        correctIndex: 0,
        explanationFa: 'ترکیب Geniş Zaman با گذشته (gider-di-k) عادت‌های تکرارشوندهٔ گذشته را نشان می‌دهد.',
      },
      {
        promptFa: 'در جملهٔ «Heyecandan ellerim titriyordu»، چرا از «-iyordu» استفاده شده است؟',
        choices: ['برای توصیف وضعیتی که در آن لحظهٔ گذشته در جریان بوده است', 'برای بیان شرط آینده', 'برای نفی جمله'],
        correctIndex: 0,
        explanationFa: 'پسوند ترکیبی -ıyordu معادل ماضی استمراری فارسی (داشت می‌لرزید / می‌لرزید) در روایت خاطره است.',
      },
    ],
  },

  /* ۳. صحبت درباره برنامه‌های آینده و قرارها */
  {
    id: 'tr-a2-s-03-future-plans-appointments',
    title: 'صحبت درباره برنامه‌های آینده و قرارها',
    subtitle: 'Survival · تنظیم قرار ملاقات، تغییر ساعت و هماهنگی تقویم کاری و شخصی',
    situation: 'با دوست، پزشک یا همکارتان زمان و مکان دقیق قرار را هماهنگ می‌کنید یا در صورت لزوم تغییر می‌دهید.',
    teachingFa: 'در هماهنگی قرارها واژه‌های randevu (نوبت رسمی: پزشک، بانک، اداره) و buluşma (قرار دوستانه) از هم تفکیک می‌شوند: randevu almak (نوبت گرفتن)، randevuyu ertelemek (به‌تعویق انداختن نوبت)، müsait olmak (آزاد/در دسترس بودن). برای پرسیدن زمان مناسب از عبارت طبیعی «Sana hangi gün uyar?» یا «Saat kaçta müsait olursun?» استفاده می‌کنیم.',
    rows: [
      ['Cuma günü öğleden sonra saat üçte boş vaktin var mı?', 'روز جمعه بعدازظهر ساعت سه وقت آزاد داری؟', 'جوما گونو اوئلِدَن سونرا ساعات اوچته بوش واکتین وار مِی', 'öğleden sonra', 'بعدازظهر', 'پرسش زمان آزاد برای قرار'],
      ['Çarşamba sabahı diş hekimiyle kontrol randevum var.', 'چهارشنبه صبح با دندان‌پزشک نوبت معاینه دارم.', 'چارشامبا ساباهِی دیش هِکیمییله کونترول راندِووم وار', 'randevum', 'نوبتم / قرارم'],
      ['Acil bir toplantı çıktı; buluşmamızı yarına erteleyebilir miyiz?', 'یک جلسهٔ فوری پیش آمد؛ می‌توانیم قرارمان را به فردا موکول کنیم؟', 'آجیل بیر توپلانتِی چِیکتِی؛ بولوشمامِیزِی یارِینا اَرتِلِیِبیلیر میییز', 'erteleyebilir miyiz', 'می‌توانیم موکول کنیم؟', 'درخواست تغییر زمان قرار با ertelemek'],
      ['Salı günü bütün gün yoğunum ama perşembe akşamı tamamen müsaitim.', 'روز سه‌شنبه تمام روز سرم شلوغ است اما پنج‌شنبه عصر کاملاً آزادم.', 'سالِی گونو بوتون گون یوئونوم آما پَرشَمبه آکشامِی تامامَن موساییتیم', 'müsaitim', 'آزاد هستم / وقت دارم'],
      ['Önümüzdeki ay İzmir’deki teknoloji fuarına katılacağız.', 'ماه آینده در نمایشگاه فناوری در ازمیر شرکت خواهیم کرد.', 'اونوموزدِکی آی ایزمیردِکی تَکنولوژی فوآرِینا کاتِیلاجائِیز', 'katılacağız', 'شرکت خواهیم کرد'],
      ['Saat altıda Beşiktaş iskelesinin önünde buluşuyoruz, tamam mı?', 'ساعت شش جلوی اسکلهٔ بشیکتاش همدیگر را می‌بینیم، باشد؟', 'ساعات آلتِیدا بِشیکتاش ایسکِلِسینین اونونده بولوشویوروز، تامام مِی', 'buluşuyoruz', 'قرار می‌گذاریم / می‌بینیم', 'کاربرد Şimdiki Zaman برای قرار قطعی نزدیک'],
      ['Sana hangi saat daha uygun olur, sabah on mu yoksa öğlen bir mi?', 'کدام ساعت برایت مناسب‌تر است، ده صبح یا یک ظهر؟', 'سانا هانگی ساعات داها اویگون اولور، ساباه اون مو یوکسا اوئلَن بیر می', 'uygun olur', 'مناسب می‌شود'],
      ['Takvimime not aldım; pazartesi sabahı saat dokuzda görüşmek üzere!', 'در تقویمم یادداشت کردم؛ به امید دیدار در ساعت نه صبح دوشنبه!', 'تاکویمیمه نوت آلدِیم؛ پازارتِسی ساباهِی ساعات دوکوزدا گوروشمَک اوزِره', 'görüşmek üzere', 'به امید دیدار'],
    ],
    dialogue: [
      ['آرش', 'Selin, bu hafta proje taslağını konuşmak için ne zaman buluşabiliriz?', 'سلین، این هفته کی می‌توانیم برای صحبت دربارهٔ پیش‌نویس پروژه همدیگر را ببینیم؟'],
      ['سلین', 'Çarşamba günü öğleden sonra müsaitim; saat iki sana uyar mı?', 'چهارشنبه بعدازظهر آزادم؛ ساعت دو به برنامه‌ات می‌خورد؟'],
      ['آرش', 'Saat ikide kısa bir görüşmem var ama üç buçukta gelebilirim.', 'ساعت دو یک جلسهٔ کوتاه دارم اما سه‌ونیم می‌توانم بیایم.'],
      ['سلین', 'Anlaştık, üç buçukta ofisin altındaki kafede görüşürüz.', 'توافق کردیم، سه‌ونیم در کافهٔ پایین دفتر می‌بینمت.'],
    ],
    checks: [
      {
        promptFa: 'برای درخواست مؤدبانهٔ «آیا می‌توانیم قرارمان را به فردا موکول کنیم؟» کدام جمله درست است؟',
        choices: ['Buluşmamızı yarına erteleyebilir miyiz?', 'Buluşmamızı dün iptal ettik mi?', 'Buluşmamız yasak oldu mu?'],
        correctIndex: 0,
        explanationFa: 'فعل ertelemek (به‌تعویق انداختن) با -ebilir miyiz درخواست مؤدبانهٔ جابه‌جایی زمان قرار را می‌سازد.',
      },
      {
        promptFa: 'معنای واژهٔ «müsaitim» در هماهنگی قرار چیست؟',
        choices: ['مسافر هستم', 'وقتم آزاد است / در دسترسم', 'خسته شده‌ام'],
        correctIndex: 1,
        explanationFa: 'در ترکی استانبولی müsait olmak در مکالمهٔ قرارها یعنی «وقت آزاد داشتن / مناسب بودن».',
      },
    ],
  },

  /* ۴. دعوت‌کردن، پیشنهاد دادن و هماهنگی برنامه‌ها */
  {
    id: 'tr-a2-s-04-inviting-coordinating-plans',
    title: 'دعوت‌کردن، پیشنهاد دادن و هماهنگی برنامه‌ها',
    subtitle: 'Survival · دعوت صمیمانه، پذیرفتن با کمال میل، عذرخواهی محترمانه و تعیین جزئیات برنامه',
    situation: 'دوستان را به شام یا برنامهٔ تفریحی دعوت می‌کنید، پاسخ مؤدبانه می‌دهید و جزئیات رفت‌وآمد را هماهنگ می‌کنید.',
    teachingFa: 'برای دعوت از ساختارهای محترمانهٔ «... ister misiniz?» یا «Sizi akşam yemeğine davet etmek istiyoruz» و در جمع دوستان از «Bize gelsene / Birlikte ... yapalım mı?» استفاده می‌شود. هنگام پذیرفتن عبارت‌های «Memnuniyetle!» (با کمال میل) و «Çok sevinirim!» (خیلی خوشحال می‌شوم) و هنگام رد مؤدبانه «Çok isterdim ama...» (خیلی دلم می‌خواست اما...) بسیار طبیعی است.',
    rows: [
      ['Cumartesi akşamı yeni evimizde küçük bir yemek veriyoruz; sen de gelir misin?', 'شنبه شب در خانهٔ جدیدمان یک شام کوچک می‌دهیم؛ تو هم می‌آیی؟', 'جومارتِسی آکشامِی یِنی اِویمیزده کوچوک بیر یِمَک وِرییوروز؛ سَن دِ گِلیر میسین', 'gelir misin', 'می‌آیی؟ (دعوت دوستانه)', 'دعوت با Geniş Zaman پرسشی'],
      ['Davetin için çok teşekkür ederim, memnuniyetle katılırım!', 'بابت دعوتت خیلی متشکرم، با کمال میل شرکت می‌کنم!', 'داوِتین ایچین چوک تِشَککور اِدَریم، مَمنونییَتله کاتِیلِیرِیم', 'memnuniyetle', 'با کمال میل'],
      ['Çok gelmek isterdim ama o akşam şehir dışında olacağım.', 'خیلی دلم می‌خواست بیایم اما آن شب خارج از شهر خواهم بود.', 'چوک گَلمَک ایستَردیم آما او آکشام شِهیر دِیشِیندا اولاجائِیم', 'isterdim', 'دلم می‌خواست (رد مؤدبانه)', 'Çok isterdim ama... = رد محترمانهٔ دعوت'],
      ['Gelirken tatlı ya da içecek bir şey getirmemi ister misin?', 'دوست داری موقع آمدن شیرینی یا نوشیدنی‌ای با خودم بیاورم؟', 'گِلیرکَن تاتلِی یا دا ایچِجَک بیر شَی گِتیرمَمی ایستَر میسین', 'getirmemi', 'اینکه بیاورم را'],
      ['Hiç zahmet etme, her şey hazır; sadece senin gelmen yeterli.', 'اصلاً به زحمت نیفت، همه‌چیز آماده است؛ فقط آمدنِ تو کافی است.', 'هیچ زاهمَت اِتمه، هَر شَی هازِیر؛ سادِجه سِنین گَلمَن یِتَرلی', 'zahmet etme', 'زحمت نکش'],
      ['Pazar sabahı Belgrad Ormanı’nda kahvaltı yapmaya ne dersiniz?', 'نظرتان چیست یکشنبه صبح در جنگل بلگراد صبحانه بخوریم؟', 'پازار ساباهِی بَلگراد اورمانِیندا کاهوالتِی یاپمایا نِ دَرسینیز', 'ne dersiniz', 'نظرتان چیست؟'],
      ['İstersen seni saat yedi buçukta metro çıkışından arabayla alabilirim.', 'اگر بخواهی می‌توانم ساعت هفت‌ونیم با خودرو از خروجی مترو دنبالت بیایم.', 'ایستَرسَن سِنی ساعات یِدی بوچوکتا مِترو چِیکِیشِیندان آرابایلا آلابیلیریم', 'alabilirim', 'می‌توانم سوارت کنم / دنبالت بیایم'],
      ['Saat sekizde giriş kapısında buluşup içeri birlikte girelim.', 'ساعت هشت جلوی درِ ورودی همدیگر را ببینیم و با هم وارد شویم.', 'ساعات سِکیزده گیریش کاپِیسِیندا بولوشوپ ایچَری بیرلیکته گیرِلیم', 'birlikte girelim', 'با هم وارد شویم'],
    ],
    dialogue: [
      ['نازلی', 'Bu cuma akşamı açık hava sinemasında güzel bir film var; birlikte gidelim mi?', 'این جمعه شب در سینمای روباز فیلم خوبی هست؛ با هم برویم؟'],
      ['امید', 'Harika bir fikir, memnuniyetle gelirim! Biletleri internetten mi alacağız?', 'فکر فوق‌العاده‌ای است، با کمال میل می‌آیم! بلیت‌ها را اینترنتی خواهیم خرید؟'],
      ['نازلی', 'Evet, ben ikimiz için şimdi alıyorum; film saat dokuzda başlıyor.', 'بله، من همین الان برای هر دویمان می‌گیرم؛ فیلم ساعت نه شروع می‌شود.'],
      ['امید', 'O zaman sekiz çeyrekte parkın girişinde buluşalım; ben de atıştırmalık bir şeyler getiririm.', 'پس هشت و ربع در ورودی پارک همدیگر را ببینیم؛ من هم خوراکی سبکی می‌آورم.'],
    ],
    checks: [
      {
        promptFa: 'کدام عبارت برای رد کردن مؤدبانهٔ یک دعوت به کار می‌رود؟',
        choices: ['Çok gelmek isterdim ama...', 'Kesinlikle yasaktır...', 'Hiç zahmet etme...'],
        correctIndex: 0,
        explanationFa: 'عبارت «Çok gelmek isterdim ama...» (خیلی دلم می‌خواست بیایم اما...) مؤدبانه‌ترین شکل عذرخواهی از پذیرش دعوت است.',
      },
      {
        promptFa: 'میزبان در پاسخ به مهمانی که می‌گوید «چیزی بیاورم؟» معمولاً چه می‌گوید؟',
        choices: ['Hiç zahmet etme, her şey hazır.', 'Randevuyu erteleyelim.', 'Biletler tükenmiş.'],
        correctIndex: 0,
        explanationFa: '«Hiç zahmet etme» یعنی «اصلاً به زحمت نیفت» که تعارف رایج و گرم ترکی استانبولی است.',
      },
    ],
  },

  /* ۵. خرید و مقایسه قیمت، کیفیت و ویژگی کالاها */
  {
    id: 'tr-a2-s-05-shopping-comparing-goods',
    title: 'خرید و مقایسه قیمت، کیفیت و ویژگی کالاها',
    subtitle: 'Survival · بررسی جنس، دوام، ضمانت، تخفیف و مقایسهٔ دو مدل در فروشگاه',
    situation: 'در فروشگاه پوشاک یا لوازم الکترونیکی کیفیت، قیمت، جنس و گارانتی دو کالا را با فروشنده بررسی و مقایسه می‌کنید.',
    teachingFa: 'واژگان کلیدی خرید آگاهانه در سطح A2 عبارت‌اند از: kalite (کیفیت)، kumaş (پارچه)، pamuklu (نخی)، dayanıklı (بادوام)، garanti süresi (مدت گارانتی)، indirim (تخفیف) و taksit (اقساط). برای مقایسهٔ دو کالا در مغازه می‌گوییم: «Bu model diğerinden daha hafif ama fiyatı biraz daha yüksek.»',
    rows: [
      ['Bu iki kulaklık arasında ses kalitesi açısından ne fark var?', 'میان این دو هدفون از نظر کیفیت صدا چه تفاوتی وجود دارد؟', 'بو ایکی کولاکلِیک آراسِیندا سَس کالیتِسی آچِیسِیندان نِ فارک وار', 'açısından', 'از نظرِ / از لحاظِ', 'اسم + açısından = از لحاظِ'],
      ['Lacivert ceket siyah olandan daha kaliteli ve kumaşı yüzde yüz pamuklu.', 'کت سرمه‌ای از مشکی باکیفیت‌تر است و پارچه‌اش صددرصد نخی است.', 'لاجیوَرت جِکَت سییاه اولاندان داها کالیتِلی وِ کوماشِی یوزده یوز پاموکلو', 'pamuklu', 'نخی / پنبه‌ای'],
      ['Bu ürünün garanti süresi kaç yıl ve servis ağı yaygın mı?', 'مدت گارانتی این محصول چند سال است و شبکهٔ خدماتش گسترده است؟', 'بو اورونون گارانتی سورِسی کاچ یِیل وِ سَرویس آئِی یایگِین مِی', 'garanti süresi', 'مدت ضمانت / گارانتی'],
      ['Nakit ödemede ekstra bir indirim yapıyor musunuz?', 'در پرداخت نقدی تخفیف اضافی می‌دهید؟', 'ناکیت اودِمِده اَکسترا بیر ایندیریم یاپِییور موسونوز', 'indirim', 'تخفیف'],
      ['Bu çanta daha uygun fiyatlı; ancak derisi diğeri kadar dayanıklı görünmüyor.', 'این کیف قیمت مناسب‌تری دارد؛ با این حال چرمش به اندازهٔ دیگری بادوام به نظر نمی‌رسد.', 'بو چانتا داها اویگون فییاتلِی؛ آنجاک دِریسی دییِری کادار دایانِیکلِی گورونمویور', 'dayanıklı', 'بادوام / مقاوم'],
      ['Bu ayakkabının bir numara büyüğünü denemem mümkün mü?', 'امکانش هست یک سایز بزرگ‌ترِ این کفش را امتحان کنم؟', 'بو آیاک‌کابِینِین بیر نومارا بویویونو دِنِمَم مومکون مو', 'denemem', 'امتحان کردنم'],
      ['Kredi kartına vade farksız üç taksit yapabiliyoruz.', 'روی کارت اعتباری بدون کارمزد سه قسط انجام می‌دهیم.', 'کرِدی کارتِینا واده فارکسِیز اوچ تاکسیت یاپابیلییوروز', 'taksit', 'قسط'],
      ['Fiyat ve performans bakımından en mantıklı seçenek bu model.', 'از نظر قیمت و کارایی منطقی‌ترین گزینه همین مدل است.', 'فییات وِ پَرفورمانس باکِیمِیندان اَن مانتِیکلِی سِچِنَک بو مودَل', 'seçenek', 'گزینه / انتخاب'],
    ],
    dialogue: [
      ['مشتری', 'Merhaba, günlük kullanım için hafif bir sırt çantası arıyorum; hangisini önerirsiniz?', 'سلام، برای استفادهٔ روزمره دنبال یک کوله‌پشتی سبک می‌گردم؛ کدام را پیشنهاد می‌کنید؟'],
      ['فروشنده', 'Bu gri model çok tercih ediliyor; su geçirmez kumaştan yapıldı ve diğerinden daha hafif.', 'این مدل خاکستری خیلی طرفدار دارد؛ از پارچهٔ ضدآب ساخته شده و از دیگری سبک‌تر است.'],
      ['مشتری', 'Fermuarları sağlam görünüyor; peki fiyatı ne kadar ve indirim var mı?', 'زیپ‌هایش محکم به نظر می‌رسد؛ خب قیمتش چقدر است و تخفیف دارد؟'],
      ['فروشنده', 'Etiket fiyatı bin lira ama bugün yüzde yirmi indirimle sekiz yüz liraya alabilirsiniz.', 'قیمت روی برچسب هزار لیر است اما امروز با بیست درصد تخفیف می‌توانید هشتصد لیر بخرید.'],
    ],
    checks: [
      {
        promptFa: 'واژهٔ «dayanıklı» در خرید کالا به چه معناست؟',
        choices: ['بادوام و مقاوم', 'بسیار گران‌قیمت', 'دست‌دوم'],
        correctIndex: 0,
        explanationFa: 'dayanıklı صفت بسیار پرکاربرد برای توصیف دوام و استحکام پارچه، چرم یا وسایل برقی است.',
      },
      {
        promptFa: 'عبارت «ses kalitesi açısından» یعنی چه؟',
        choices: ['از نظر کیفیت صدا', 'بدون هیچ صدایی', 'پس از ضبط صدا'],
        correctIndex: 0,
        explanationFa: 'واژهٔ açısından پس از اسم یا ترکیب اضافی معنای «از نظرِ / از دیدگاهِ» می‌دهد.',
      },
    ],
  },

  /* ۶. بازگرداندن کالا و بیان مشکل خرید */
  {
    id: 'tr-a2-s-06-returning-items-shopping-issues',
    title: 'بازگرداندن کالا و بیان مشکل خرید',
    subtitle: 'Survival · مرجوع کردن (iade)، تعویض کالا (değişim)، ارائهٔ رسید و توضیح نقص محصول',
    situation: 'کالایی که خریده‌اید ایراد دارد یا اندازه‌اش مناسب نیست؛ با رسید خرید به فروشگاه برمی‌گردید و درخواست تعویض یا بازگشت وجه می‌کنید.',
    teachingFa: 'واژگان کلیدی خدمات پس از فروش در ترکیه: fiş / fatura (رسید / فاکتور)، iade etmek (پس دادن و دریافت پول)، değiştirmek / değişim (تعویض کردن)، defolu / arızalı (معیوب / خراب)، beden (سایز لباس). برای بیان مشکل به‌شکل مؤدبانه ابتدا زمان خرید را می‌گویید و سپس ایراد را شرح می‌دهید: «Dün aldığım gömleğin kolunda küçük bir yırtık fark ettim.»',
    rows: [
      ['Dün buradan aldığım kazağı iade etmek istiyorum; fişim yanımda.', 'می‌خواهم پلیوری را که دیروز از اینجا خریدم پس بدهم؛ رسیدم همراهم است.', 'دون بورادان آلدِیئِیم کازائِی اییاده اِتمَک ایستییوروم؛ فیشیم یانِیمدا', 'iade etmek', 'مرجوع کردن / پس دادن', 'iade etmek در برابر değiştirmek'],
      ['Eve gidince paketi açtım ve ürünün çizik olduğunu gördüm.', 'وقتی به خانه رفتم بسته را باز کردم و دیدم محصول خط‌وخش دارد.', 'اِوه گیدینجه پاکِتی آچتِیم وِ اورونون چیزیک اولدوئونو گوردوم', 'çizik', 'خط‌دار / خراشیده'],
      ['Bu pantolonun bedeni bana dar geldi; bir büyük bedenle değiştirebilir miyim?', 'سایز این شلوار برایم تنگ بود؛ می‌توانم با یک سایز بزرگ‌تر تعویض کنم؟', 'بو پانتولونون بِدِنی بانا دار گَلدی؛ بیر بویوک بِدَنله دِییشتیرِبیلیر میییم', 'değiştirebilir miyim', 'می‌توانم تعویض کنم؟'],
      ['Su ısıtıcısı çalışmıyor, sanırım rezistansı arızalı.', 'کتری برقی کار نمی‌کند، گمان کنم المنتش خراب است.', 'سو ایسِیتِیجِیسِی چالِیشمِییور، سانِیرِیم رِزیستانسِی آرِیزالِی', 'arızalı', 'خراب / دارای نقص فنی'],
      ['İade süresi kaç gün ve ücret kredi kartıma ne zaman yansır?', 'مهلت مرجوعی چند روز است و مبلغ کی به کارت اعتباری‌ام برمی‌گردد؟', 'اییاده سورِسی کاچ گون وِ اوجرَت کرِدی کارتِیما نِ زامان یانسِیر', 'iade süresi', 'مهلت بازگشت کالا'],
      ['Ürünü hiç kullanmadım ve etiketi hâlâ üzerinde duruyor.', 'از محصول اصلاً استفاده نکرده‌ام و برچسبش هنوز رویش است.', 'اورونو هیچ کوللانمادِیم وِ اِتیکِتی هالا اوزَرینده دورویور', 'etiketi', 'برچسبِ آن'],
      ['Kargo kutusu hasarlı geldiği için tutanak tutturdum.', 'چون جعبهٔ پستی آسیب‌دیده رسید صورت‌جلسه تنظیم کردم.', 'کارگو کوتوسو هاسارلِی گَلدییی ایچین توتاناک توتتوردوم', 'hasarlı', 'آسیب‌دیده'],
      ['Aynı model stokta yoksa ücret iadesi talep ediyorum.', 'اگر همین مدل در موجودی انبار نباشد درخواست بازگشت وجه دارم.', 'آینِی مودَل استوکتا یوکسا اوجرَت اییادِسی تالَپ اِدییوروم', 'ücret iadesi', 'بازگشت وجه / استرداد مبلغ'],
    ],
    dialogue: [
      ['مشتری', 'Merhaba, iki gün önce aldığım bu masa lambası açılmıyor; sanırım düğmesi bozuk.', 'سلام، این چراغ مطالعه‌ای که دو روز پیش خریدم روشن نمی‌شود؛ گمان کنم دکمه‌اش خراب است.'],
      ['مسئول خدمات', 'Hemen kontrol edelim; alışveriş fişiniz yanınızda mı?', 'فوراً بررسی می‌کنیم؛ رسید خریدتان همراهتان است؟'],
      ['مشتری', 'Evet, buyurun fişi ve kutusu; yenisiyle değiştirebilir misiniz?', 'بله، بفرمایید رسید و جعبه‌اش؛ می‌توانید با یک نمونهٔ نو تعویض کنید؟'],
      ['مسئول خدمات', 'Elbette, depoda aynı modelden var; size hemen yeni ve sağlam bir ürün veriyorum.', 'البته، در انبار از همین مدل هست؛ همین الان یک محصول نو و سالم تقدیمتان می‌کنم.'],
    ],
    checks: [
      {
        promptFa: 'تفاوت «iade etmek» و «değiştirmek» در خرید چیست؟',
        choices: ['iade etmek پس دادن کالا و گرفتن پول است و değiştirmek تعویض با کالای دیگر', 'هر دو به معنی خرید اقساطی هستند', 'اولی به معنی تخفیف و دومی به معنی فاکتور است'],
        correctIndex: 0,
        explanationFa: 'در فروشگاه‌های ترکیه iade بازگرداندن کامل کالا و değişim / değiştirmek تعویض سایز یا مدل است.',
      },
      {
        promptFa: 'واژهٔ «arızalı» برای کدام مورد به کار می‌رود؟',
        choices: ['وسیله‌ای که نقص فنی دارد و درست کار نمی‌کند', 'لباسی که رنگش روشن است', 'کالایی که تخفیف خورده است'],
        correctIndex: 0,
        explanationFa: 'arızalı یعنی «دارای خرابی یا نقص فنی» (به‌ویژه برای لوازم برقی و دستگاه‌ها).',
      },
    ],
  },

  /* ۷. سفارش غذا و بیان ترجیحات غذایی */
  {
    id: 'tr-a2-s-07-ordering-food-dietary-preferences',
    title: 'سفارش غذا و بیان ترجیحات غذایی',
    subtitle: 'Survival · پرسیدن مواد تشکیل‌دهنده، حساسیت غذایی، میزان پخت و سفارش اختصاصی در رستوران',
    situation: 'در رستوران مواد داخل غذا را می‌پرسید، رژیم یا حساسیت غذایی‌تان را توضیح می‌دهید و سفارش دقیق ثبت می‌کنید.',
    teachingFa: 'در رستوران‌های ترکیه برای پرسیدن محتویات غذا می‌گوییم: «Bunun içinde ne var?» و برای بیان محدودیت یا ترجیح غذایی از عبارت‌های «... alerjim var» (به ... حساسیت دارم)، «vejetaryenim» (گیاه‌خوارم)، «acısız / az acılı olsun lütfen» (لطفاً بدون تندی / کم‌تند باشد) و «sosunu ayrı getirebilir misiniz?» استفاده می‌کنیم.',
    rows: [
      ['Affedersiniz, bu çorbanın içinde krema veya süt var mı?', 'ببخشید، داخل این سوپ خامه یا شیر هست؟', 'آففِدَرسینیز، بو چوربانِین ایچینده کرِما وِیا سوت وار مِی', 'içinde', 'در داخلِ آن', 'پرسش ترکیبات غذا با içinde ... var mı'],
      ['Cevize karşı alerjim var; tatlıda kuruyemiş kullanılmıyor, değil mi?', 'به گردو حساسیت دارم؛ در شیرینی آجیل به کار نمی‌رود، درست است؟', 'جِویزه کارشِی آلَرژیم وار؛ تاتلِیدا کورویِمیش کوللانِیلمِییور، دِئیل می', 'alerjim var', 'آلرژی / حساسیت دارم'],
      ['Et yemiyorum; menüde önerebileceğiniz zeytinyağlı sebze yemekleri nelerdir?', 'گوشت نمی‌خورم؛ غذاهای گیاهی با روغن زیتون که در منو پیشنهاد بدهید کدام‌ها هستند؟', 'اَت یِمییوروم؛ مِنوده اونَرِبیلِجَیینیز زَیتین‌یائلِی سَبزه یِمَکلَری نِلَردیر', 'zeytinyağlı', 'پخته‌شده با روغن زیتون'],
      ['Izgara tavuk alayım, ama baharatı az ve acısız olsun lütfen.', 'مرغ کبابی می‌گیرم، اما لطفاً ادویه‌اش کم و بدون تندی باشد.', 'ایزگارا تاووک آلایِیم، آما باهاراتِی آز وِ آجِیسِیز اولسون لوتفَن', 'acısız olsun', 'بدون تندی باشد', 'سفارش سفارشی با ... olsun lütfen'],
      ['Salatanın sosunu üzerine dökmeyip ayrı bir kapta getirebilir misiniz?', 'ممکن است سس سالاد را رویش نریزید و در ظرف جداگانه بیاورید؟', 'سالاتانِین سوسونو اوزَرینه دوکمِییپ آیرِی بیر کاپتا گِتیرِبیلیر میسینیز', 'ayrı bir kapta', 'در ظرفی جداگانه'],
      ['Pilav yerine haşlanmış sebze tercih ediyorum, değiştirmek mümkün mü?', 'به جای پلو سبزیجات آب‌پز ترجیح می‌دهم، امکان تغییرش هست؟', 'پیلاو یِرینه هاشلانمِیش سَبزه تَرجیه اِدییوروم، دِییشتیرمَک مومکون مو', 'yerine', 'به جایِ'],
      ['Yemekle birlikte soğuk olmayan bir şişe su rica ediyorum.', 'همراه غذا خواهشمندم یک بطری آبِ بدون سرما بیاورید.', 'یِمَکله بیرلیکته سوئوک اولمایان بیر شیشه سو ریجا اِدییوروم', 'rica ediyorum', 'خواهش می‌کنم (درخواست مؤدبانه)'],
      ['Yemekler çok lezzetliydi; hesabı masaya alabilir miyiz?', 'غذاها بسیار خوش‌مزه بود؛ ممکن است صورت‌حساب را سر میز بگیریم؟', 'یِمَکلَر چوک لِزّتلییدی؛ هِسابِی ماسایا آلابیلیر میییز', 'hesabı', 'صورت‌حساب را'],
    ],
    dialogue: [
      ['پروانه', 'Merhaba, mercimek çorbası ve ızgara köfte sipariş etmek istiyorum ama acı sevmiyorum.', 'سلام، می‌خواهم سوپ عدس و کوفتهٔ کبابی سفارش بدهم اما تند دوست ندارم.'],
      ['گارسون', 'Hiç merak etmeyin, köftemiz acısızdır; yanına pilav mı yoksa patates püresi mi istersiniz?', 'اصلاً نگران نباشید، کوفتهٔ ما بدون فلفل تند است؛ کنارش پلو میل دارید یا پورهٔ سیب‌زمینی؟'],
      ['پروانه', 'Patates püresi tercih ederim; ayrıca salataya soğan koymazsanız sevinirim.', 'پورهٔ سیب‌زمینی ترجیح می‌دهم؛ همچنین اگر در سالاد پیاز نریزید خوشحال می‌شوم.'],
      ['گارسون', 'Tabii, siparişinizi soğansız salata ve acısız olarak hemen mutfağa iletiyorum.', 'البته، سفارشتان را با سالاد بدون پیاز و بدون تندی فوراً به آشپزخانه اطلاع می‌دهم.'],
    ],
    checks: [
      {
        promptFa: 'در رستوران برای گفتن «لطفاً بدون فلفل تند باشد» چه می‌گوییم؟',
        choices: ['Acısız olsun lütfen.', 'Tuzlu olmuş galiba.', 'Hesabı ödedik mi?'],
        correctIndex: 0,
        explanationFa: 'پسوند -sız معنی «بدون» می‌دهد و «Acısız olsun lütfen» درخواست رایج برای غذای غیرتند است.',
      },
      {
        promptFa: 'عبارت «Pilav yerine haşlanmış sebze» به چه معناست؟',
        choices: ['پلو به همراه سبزیجات سرخ‌شده', 'سبزیجات آب‌پز به جای پلو', 'فقط پلو بدون سبزیجات'],
        correctIndex: 1,
        explanationFa: 'واژهٔ yerine پس از اسم یعنی «به جایِ آن»: pilav yerine = به جای پلو.',
      },
    ],
  },

  /* ۸. رزرو هتل و تغییر یا لغو رزرو */
  {
    id: 'tr-a2-s-08-hotel-booking-changes',
    title: 'رزرو هتل و تغییر یا لغو رزرو',
    subtitle: 'Survival · ثبت رزرو اتاق، تغییر تاریخ ورود و خروج، پرسیدن شرایط لغو رایگان و امکانات هتل',
    situation: 'تلفنی یا حضوری با پذیرش هتل دربارهٔ رزرو اتاق، جابه‌جایی تاریخ اقامت یا لغو رزرو گفتگو می‌کنید.',
    teachingFa: 'اصطلاحات پرکاربرد اقامت در هتل: çift kişilik oda (اتاق دونفره)، tek kişilik oda (تک‌نفره)، kahvaltı dahil (همراه با صبحانه)، giriş tarihi (تاریخ ورود / چک‌این)، çıkış tarihi (تاریخ خروج / چک‌اوت)، ücretsiz iptal (لغو رایگان)، rezervasyonu güncellemek / değiştirmek (به‌روزرسانی یا تغییر رزرو).',
    rows: [
      ['On beş kasım girişli, üç gecelik çift kişilik bir oda ayırtmak istiyorum.', 'می‌خواهم با ورود پانزدهم نوامبر، یک اتاق دونفره به مدت سه شب رزرو کنم.', 'اون بَش کاسِیم گیریشلی، اوچ گِجِلیک چیفت کیشیلیک بیر اودا آیِیرتماک ایستییوروم', 'ayırtmak istiyorum', 'می‌خواهم رزرو کنم', 'oda ayırtmak = رزرو کردن اتاق'],
      ['Oda fiyatına açık büfe sabah kahvaltısı dahil mi?', 'آیا صبحانهٔ سلف‌سرویس در قیمت اتاق لحاظ شده است؟', 'اودا فییاتِینا آچِیک بوفه ساباه کاهوالتِیسِی داهیل می', 'dahil mi', 'شامل می‌شود؟ / لحاظ است؟'],
      ['Uçuş saatim değiştiği için giriş tarihini bir gün ileri alabilir miyiz?', 'چون ساعت پروازم تغییر کرده، می‌توانیم تاریخ ورود را یک روز جلوتر (به روز بعد) ببریم؟', 'اوچوش ساعاتیم دِییشتییی ایچین گیریش تاریهینی بیر گون ایلِری آلابیلیر میییز', 'giriş tarihini', 'تاریخ ورود را'],
      ['Rezervasyonumu ücretsiz olarak iptal etmek için son tarih nedir?', 'آخرین مهلت برای لغو رایگان رزرو من چه زمانی است؟', 'رِزَرواسیونومو اوجرَتسیز اولاراک ایپتال اِتمَک ایچین سون تاریه نِدیر', 'ücretsiz', 'رایگان / بدون هزینه'],
      ['Üst katlarda, cadde gürültüsünden uzak sessiz bir oda rica edebilir miyim?', 'می‌توانم در طبقات بالا، اتاقی آرام و دور از سر‌و‌صدای خیابان درخواست کنم؟', 'اوست کاتلاردا، جادده گورولتوسوندَن اوزاک سَس‌سیز بیر اودا ریجا اِدِبیلیر میییم', 'sessiz bir oda', 'یک اتاق آرام'],
      ['Çıkış saatimiz öğlen on iki ama valizlerimizi akşama kadar emanete bırakabilir miyiz?', 'ساعت تخلیهٔ ما دوازده ظهر است اما می‌توانیم چمدان‌هایمان را تا عصر به امانات بسپاریم؟', 'چِیکِیش ساعاتیمیز اوئلَن اون ایکی آما والیزلَریمیزی آکشاما کادار اِمانِته بِیراکابیلیر میییز', 'emanete', 'به بخش امانات'],
      ['Beklenmedik bir iş çıktığı için rezervasyonumu maalesef iptal etmem gerekiyor.', 'چون کار غیرمنتظره‌ای پیش آمد متأسفانه لازم است رزرو خود را لغو کنم.', 'بَکلَنمِدیک بیر ایش چِیکتِیئِی ایچین رِزَرواسیونومو ماآلِسَف ایپتال اِتمَم گِرِکییور', 'iptal etmem', 'لغو کردنم'],
      ['Değişiklik onay mesajını e-posta adresime gönderebilir misiniz?', 'ممکن است پیام تأیید تغییر را به نشانی ایمیلم بفرستید؟', 'دِییشیکلیک اونای مِساژِینِی اِپوستا آدرِسیمه گوندَرِبیلیر میسینیز', 'onay mesajını', 'پیام تأیید را'],
    ],
    dialogue: [
      ['مسافر', 'İyi günler, Yılmaz adına cuma günü için iki gecelik bir rezervasyonum vardı.', 'روز بخیر، به نام ییلماز برای روز جمعه یک رزرو دوشبه داشتم.'],
      ['پذیرش هتل', 'Hoş geldiniz, sistemde görüyorum; size nasıl yardımcı olabilirim?', 'خوش آمدید، در سیستم می‌بینم؛ چطور می‌توانم کمکتان کنم؟'],
      ['مسافر', 'Programım değişti; giriş gününü cumartesiye alıp yine iki gece kalabilir miyim?', 'برنامه‌ام تغییر کرد؛ می‌توانم روز ورود را به شنبه منتقل کنم و باز هم دو شب بمانم؟'],
      ['پذیرش هتل', 'Kontrol ettim, cumartesi ve pazar için müsait odamız var; hiçbir ek ücret olmadan güncelledim.', 'بررسی کردم، برای شنبه و یکشنبه اتاق خالی داریم؛ بدون هیچ هزینهٔ اضافی به‌روزرسانی کردم.'],
    ],
    checks: [
      {
        promptFa: 'عبارت «kahvaltı dahil mi?» هنگام رزرو هتل چه می‌پرسد؟',
        choices: ['آیا صبحانه در هزینهٔ اتاق شامل می‌شود؟', 'ساعت شام چه موقع است؟', 'آیا استخر هتل باز است؟'],
        correctIndex: 0,
        explanationFa: 'dahil یعنی «شامل / همراه با» و «kahvaltı dahil mi?» می‌پرسد آیا صبحانه روی اتاق هست یا خیر.',
      },
      {
        promptFa: 'برای سپردن چمدان‌ها پس از تحویل اتاق چه واژه‌ای به کار می‌رود؟',
        choices: ['emanete bırakmak', 'fatura kesmek', 'taksit yapmak'],
        correctIndex: 0,
        explanationFa: 'در هتل‌ها و پایانه‌های ترکیه emanet / bagaj emaneti بخش نگهداری امانت چمدان است.',
      },
    ],
  },

  /* ۹. برنامه‌ریزی سفر و پرسیدن اطلاعات گردشگری */
  {
    id: 'tr-a2-s-09-travel-planning-tourist-info',
    title: 'برنامه‌ریزی سفر و پرسیدن اطلاعات گردشگری',
    subtitle: 'Survival · پرسیدن ساعات بازدید، کارت موزه، تورهای محلی و بهترین زمان رفت‌وآمد',
    situation: 'در دفتر اطلاعات گردشگری یا هنگام برنامه‌ریزی سفر، دربارهٔ جاهای دیدنی، بلیت‌ها و حمل‌ونقل سؤال می‌پرسید.',
    teachingFa: 'هنگام گردشگری در استانبول و شهرهای ترکیه واژه‌های Müzekart / giriş bileti (کارت موزه / بلیت ورودی)، ziyaret saatleri (ساعات بازدید)، rehberli tur (تور با راهنما)، iskele (اسکله) و aktarma (تعویض خط مترو/اتوبوس) بسیار کاربردی‌اند. برای خواستن پیشنهاد محلی می‌پرسیم: «Bir günde nereleri gezmemizi önerirsiniz?»',
    rows: [
      ['Topkapı Sarayı’nın ziyaret saatleri nedir ve hangi gün kapalıdır?', 'ساعات بازدید کاخ توپکاپی کی است و چه روزی بسته است؟', 'توپکاپِی سارایِینِین زییارَت ساعاتلَری نِدیر وِ هانگی گون کاپالِیدِیر', 'ziyaret saatleri', 'ساعات بازدید'],
      ['Bir günde Tarihi Yarımada’da nereleri gezmemizi önerirsiniz?', 'پیشنهاد می‌کنید در یک روز کدام بخش‌های شبه‌جزیرهٔ تاریخی را بگردیم؟', 'بیر گونده تاریهی یارِیم‌آدادا نِرِلَری گَزمِمیزی اونَریرسینیز', 'gezmemizi', 'گشتنِ ما را'],
      ['Sıra beklememek için müze biletlerini internetten önceden alabilir miyiz?', 'برای اینکه در صف نمانیم می‌توانیم بلیت‌های موزه را از قبل اینترنتی بخریم؟', 'سِیرا بَکلِمِمَک ایچین موزه بیلَتلَرینی اینتَرنَتتَن اونجِدَن آلابیلیر میییز', 'sıra beklememek', 'در صف نماندن'],
      ['Adalar’a giden vapurlar hangi iskeleden ve kaç dakikada bir kalkıyor?', 'کشتی‌هایی که به جزایر می‌روند از کدام اسکله و هر چند دقیقه یک‌بار حرکت می‌کنند؟', 'آدالارا گیدَن واپورلار هانگی ایسکِلِدَن وِ کاچ داکیکادا بیر کالکِییور', 'kaç dakikada bir', 'هر چند دقیقه یک‌بار', 'واحد زمان + -da/-de bir = هر ... یک‌بار'],
      ['Şehir içi ulaşımda İstanbulkart nereden satın alıp doldurabiliriz?', 'برای حمل‌ونقل درون‌شهری از کجا می‌توانیم استانبول‌کارت بخریم و شارژ کنیم؟', 'شِهیر ایچی اولاشِیمدا ایستانبول‌کارت نِرِدَن ساتِین آلِیپ دولدورابیلیریز', 'doldurabiliriz', 'می‌توانیم شارژ/پر کنیم'],
      ['Bu kuleye çıktığımızda Boğaz’ı panoramik olarak görebilir miyiz?', 'وقتی بالای این برج برویم می‌توانیم تنگهٔ بسفر را به‌صورت پانوراما ببینیم؟', 'بو کولِیه چِیکتِیئِیمِیزدا بوئازِی پانورامیک اولاراک گورِبیلیر میییز', 'görebilir miyiz', 'می‌توانیم ببینیم؟'],
      ['Rehberli yürüyüş turu yaklaşık kaç saat sürüyor?', 'تور پیاده‌روی همراه با راهنما تقریباً چند ساعت طول می‌کشد؟', 'رَهبَرلی یورویوش تورو یاکلاشِیک کاچ ساعات سورویور', 'rehberli', 'همراه با راهنما'],
      ['Turistik yerlerin haritasını ve vapur tarifesini buradan alabilir miyim?', 'می‌توانم نقشهٔ جاهای دیدنی و برنامهٔ حرکت کشتی‌ها را از اینجا بردارم؟', 'توریستیک یَرلَرین هاریتاسِینِی وِ واپور تاریفِسینی بورادان آلابیلیر میییم', 'haritasını', 'نقشه‌اش را'],
    ],
    dialogue: [
      ['گردشگر', 'Merhaba, İstanbul’da sadece iki günümüz var; ilk gün için nasıl bir rota önerirsiniz?', 'سلام، ما در استانبول فقط دو روز وقت داریم؛ برای روز اول چه مسیری پیشنهاد می‌کنید؟'],
      ['راهنمای گردشگری', 'Sabah Sultanahmet Meydanı ve Ayasofya’dan başlayıp öğleden sonra Kapalıçarşı’ya geçebilirsiniz.', 'می‌توانید صبح از میدان سلطان احمد و ایاصوفیه شروع کنید و بعدازظهر به بازار بزرگ بروید.'],
      ['گردشگر', 'Akşamüstü için güzel bir öneriniz var mı?', 'برای دمِ غروب پیشنهاد خوبی دارید؟'],
      ['راهنمای گردشگری', 'Eminönü iskelesinden Üsküdar vapuruna binerseniz gün batımını denizden izleyebilirsiniz.', 'اگر از اسکلهٔ امینونو سوار کشتی اوسکودار شوید می‌توانید غروب آفتاب را از روی دریا تماشا کنید.'],
    ],
    checks: [
      {
        promptFa: 'عبارت «kaç dakikada bir» هنگام پرسیدن برنامهٔ حرکت کشتی یعنی چه؟',
        choices: ['در دقیقهٔ اول', 'هر چند دقیقه یک‌بار', 'فقط یک دقیقه'],
        correctIndex: 1,
        explanationFa: 'ساختار «زمان + -da/-de bir» دورهٔ تکرار را می‌سازد: on beş dakikada bir = هر پانزده دقیقه یک‌بار.',
      },
      {
        promptFa: '«sıra beklememek için» چه هدفی را بیان می‌کند؟',
        choices: ['برای اینکه در صف منتظر نمانیم', 'برای اینکه بلیت گران‌تر بخریم', 'چون موزه بسته بود'],
        correctIndex: 0,
        explanationFa: 'sıra beklemek یعنی «در صف ایستادن» و شکل منفی آن با için یعنی «برای نایستادن در صف».',
      },
    ],
  },

  /* ۱۰. شرح مسیر و راهنمایی دیگران */
  {
    id: 'tr-a2-s-10-giving-directions',
    title: 'شرح مسیر و راهنمایی دیگران',
    subtitle: 'Survival · نشانی دادن گام‌به‌گام با چهارراه‌ها، چراغ راهنما، پل عابر و تعویض خط مترو',
    situation: 'وقتی رهگذری از شما آدرس می‌پرسد یا به دوستی تلفنی نشانی می‌دهید، مسیر را دقیق و مرحله‌به‌مرحله شرح می‌دهید.',
    teachingFa: 'در راهنمایی مسیر، فعل‌های امری محترمانه (-ın/-in یا -ınız/-iniz) همراه با نشانه‌های شهری به کار می‌روند: düz devam edin (مستقیم ادامه دهید)، trafik ışıklarından sağa dönün (از چراغ راهنمایی به راست بپیچید)، karşıya geçin (به آن‌طرف خیابان بروید)، ikinci sokaktan sola sapın (از کوچهٔ دوم به چپ بپیچید)، bir durak sonra inin (یک ایستگاه بعد پیاده شوید).',
    rows: [
      ['Bu cadde boyunca yaklaşık iki yüz metre düz devam edin.', 'در امتداد این خیابان حدود دویست متر مستقیم ادامه بدهید.', 'بو جادده بویونجا یاکلاشِیک ایکی یوز مِتره دوز دِوام اِدین', 'düz devam edin', 'مستقیم ادامه دهید', 'فعل امری محترمانه با -in'],
      ['İlerideki trafik ışıklarından sola dönünce eczaneyi karşınızda göreceksiniz.', 'وقتی از چراغ راهنمای جلوتر به چپ بپیچید داروخانه را روبه‌رویتان خواهید دید.', 'ایلَریدِکی ترافیک ایشِیکلارِیندان سولا دونونجه اَجزانِیی کارشِینِیزدا گورِجَکسینیز', 'dönünce', 'وقتی بپیچید', 'ریشه + -(y)ınca/-(y)ince = به محض/وقتی که'],
      ['Üst geçidi kullanarak caddenin karşı tarafına geçin.', 'با استفاده از پل عابر پیاده به سمت دیگر خیابان بروید.', 'اوست گِچیدی کوللاناراک جاددِنین کارشِی تارافِینا گِچین', 'üst geçidi', 'پل عابر پیاده را'],
      ['Metroya binip üç durak gidin ve Mecidiyeköy istasyonunda aktarma yapın.', 'سوار مترو شوید، سه ایستگاه بروید و در ایستگاه مجیدیه‌کوی خط عوض کنید.', 'مِترویا بینیپ اوچ دوراک گیدین وِ مِجیدییه‌کوی ایستاسیونوندا آکتارما یاپِین', 'aktarma yapın', 'خط عوض کنید (تقاطع حمل‌ونقل)'],
      ['Fırını geçtikten hemen sonra sağdaki ilk sokağa girin.', 'درست بعد از رد کردن نانوایی وارد اولین کوچه در سمت راست شوید.', 'فِیرِینِی گِچتیکتَن هِمَن سونرا سائداکی ایلک سوکائا گیرین', 'geçtikten hemen sonra', 'بلافاصله پس از رد کردن'],
      ['Belediye binası köşedeki büyük bankanın tam yanındadır.', 'ساختمان شهرداری درست کنارِ بانک بزرگِ سر نبش است.', 'بِلِدییه بیناسِی کوشِدِکی بویوک بانکانِین تام یانِیندادِیر', 'tam yanındadır', 'درست در کنارش است'],
      ['Buradan yürüyerek gitmek biraz uzun sürer; otobüse binmeniz daha kolay olur.', 'پیاده رفتن از اینجا کمی طولانی می‌شود؛ سوار اتوبوس شدن برایتان راحت‌تر است.', 'بورادان یورویِرَک گیتمَک بیراز اوزون سورَر؛ اوتوبوسه بینمِنیز داها کولای اولور', 'yürüyerek', 'با پای پیاده / پیاده'],
      ['Yanlış yöne gitmişsiniz; geri dönüp ana meydana çıkmanız gerekiyor.', 'مسیر اشتباهی رفته‌اید؛ لازم است برگردید و به میدان اصلی بروید.', 'یانلِیش یونه گیتمیشسینیز؛ گِری دونوپ آنا مَیدانا چِیکمانِیز گِرِکییور', 'yanlış yöne', 'به جهت اشتباه'],
    ],
    dialogue: [
      ['رهگذر', 'Affedersiniz, Şehir Kütüphanesi’ne nasıl gidebilirim; buralara yabancıyım.', 'ببخشید، چطور می‌توانم به کتابخانهٔ شهر بروم؛ با این حوالی آشنا نیستم.'],
      ['شهروند', 'Çok yakın! Önce bu caddeden trafik ışıklarına kadar düz yürüyün.', 'خیلی نزدیک است! اول از این خیابان تا چراغ راهنمایی مستقیم پیاده بروید.'],
      ['رهگذر', 'Işıklara gelince hangi tarafa dönmeliyim?', 'وقتی به چراغ‌ها رسیدم به کدام طرف باید بپیچم؟'],
      ['شهروند', 'Sağa dönün ve parkı geçin; kütüphane ikinci binadır, yürüyerek beş dakika sürer.', 'به راست بپیچید و از پارک رد شوید؛ کتابخانه ساختمان دوم است، پیاده پنج دقیقه طول می‌کشد.'],
    ],
    checks: [
      {
        promptFa: 'در مترو و اتوبوس‌های استانبول عبارت «aktarma yapın» یعنی چه؟',
        choices: ['خط عوض کنید (از یک خط به خط دیگر بروید)', 'بلیت را پس بدهید', 'در ایستگاه اول برگردید'],
        correctIndex: 0,
        explanationFa: 'aktarma yapmak اصطلاح رسمی تعویض خط در شبکهٔ مترو، متروبوس، تراموا و کشتی است.',
      },
      {
        promptFa: 'معنای «üst geçit» در راهنمایی مسیر چیست؟',
        choices: ['زیرگذر خودرو', 'پل هوایی عابر پیاده', 'چراغ قرمز'],
        correctIndex: 1,
        explanationFa: 'üst geçit یعنی پل هوایی عابر پیاده و alt geçit یعنی زیرگذر.',
      },
    ],
  },

  /* ۱۱. بیان مشکلات جسمی و توضیح علائم */
  {
    id: 'tr-a2-s-11-health-problems-symptoms',
    title: 'بیان مشکلات جسمی و توضیح علائم',
    subtitle: 'Survival · شرح دقیق درد، تب، سرگیجه، سرفه و مدت زمان شروع علائم نزد پزشک',
    situation: 'در درمانگاه یا داروخانه علائم بیماری، شدت آن و زمان شروع مشکل را دقیق برای پزشک توضیح می‌دهید.',
    teachingFa: 'ساختارهای پرکاربرد شرح علائم در ترکی استانبولی: «... ağrıyor» (درد می‌کند: boğazım ağrıyor، midem ağrıyor)، «ateşim var» (تب دارم)، «başım dönüyor» (سرم گیج می‌رود)، «öksürüyorum» (سرفه می‌کنم)، «halsizim» (بی‌حالم). برای بیان مدت شروع علائم نیز الگوی «مدت + -dır/-dir/-dur/-dür» به کار می‌رود: Dünden beri / İki gündür boğazım ağrıyor.',
    rows: [
      ['İki gündür boğazım çok ağrıyor ve yutkunmakta zorlanıyorum.', 'دو روز است گلویم خیلی درد می‌کند و در قورت دادن به زحمت می‌افتم.', 'ایکی گوندور بوئازِیم چوک آئرِییور وِ یوتکونماکتا زورلانِییوروم', 'iki gündür', 'دو روز است که', 'مدت + -dır/-dir/-dur/-dür = از ... پیش تا کنون'],
      ['Dün akşamdan beri hafif ateşim var ve kendimi çok halsiz hissediyorum.', 'از دیشب تب خفیفی دارم و احساس بی‌حالی زیادی می‌کنم.', 'دون آکشامدان بِری هافیف آتِشیم وار وِ کَندیمی چوک هالسیز هیسسِدییوروم', 'dün akşamdan beri', 'از دیشب تا حالا', '-dan/-den beri = از زمانِ...'],
      ['Sabah ayağa kalktığımda başım döndü ve midem bulandı.', 'صبح وقتی از جایم بلند شدم سرم گیج رفت و حالت تهوع گرفتم.', 'ساباه آیائا کالکتِیئِیمدا باشِیم دوندو وِ میدَم بولاندِی', 'midem bulandı', 'دلم آشوب شد / حالت تهوع گرفتم'],
      ['Geceleri kuru öksürük yüzünden rahat uyuyamıyorum.', 'شب‌ها به خاطر سرفهٔ خشک نمی‌توانم راحت بخوابم.', 'گِجِلَری کورو اوکسوروک یوزوندَن راهات اویویامِییوروم', 'öksürük', 'سرفه'],
      ['Merdiven çıkarken sağ dizimde keskin bir ağrı hissediyorum.', 'هنگام بالا رفتن از پله در زانوی راستم درد تیزی حس می‌کنم.', 'مَردیوَن چِیکارکَن سائ دیزیمده کَسکین بیر آئرِی هیسسِدییوروم', 'dizimde', 'در زانویم'],
      ['Bahar aylarında polen alerjim olduğu için gözlerim sulanıyor.', 'در ماه‌های بهار چون حساسیت به گردهٔ گل دارم چشم‌هایم اشک می‌کند.', 'باهار آیلارِیندا پولَن آلَرژیم اولدوئو ایچین گوزلَریم سولانِییور', 'sulanıyor', 'اشک می‌کند / آب می‌افتد'],
      ['Herhangi bir ilaca alerjim yok ama düzenli tansiyon ilacı kullanıyorum.', 'به هیچ دارویی حساسیت ندارم اما منظم داروی فشار خون مصرف می‌کنم.', 'هَرهانگی بیر ایلاجا آلَرژیم یوک آما دوزَنلی تانسییون ایلاجِی کوللانِییوروم', 'tansiyon ilacı', 'داروی فشار خون'],
      ['Ağrı kesici içtim ama baş ağrım henüz geçmedi.', 'مسکن خوردم اما سردردم هنوز برطرف نشده است.', 'آئرِی کِسیجی ایچتیم آما باش آئرِیم هِنوز گِچمِدی', 'ağrı kesici', 'مسکن درد'],
    ],
    dialogue: [
      ['پزشک', 'Hoş geldiniz, şikayetiniz nedir ve ne zamandır devam ediyor?', 'خوش آمدید، مشکلتان چیست و از چه زمانی ادامه دارد؟'],
      ['بیمار', 'Üç gündür şiddetli baş ağrım ve burun tıkanıklığım var; dün gece ateşim de çıktı.', 'سه روز است سردرد شدید و گرفتگی بینی دارم؛ دیشب تبم هم بالا رفت.'],
      ['پزشک', 'Öksürük ya da nefes darlığı hissediyor musunuz?', 'سرفه یا تنگی نفس احساس می‌کنید؟'],
      ['بیمار', 'Nefes darlığım yok ama geceleri kuru öksürüğüm oluyor ve çok halsizim.', 'تنگی نفس ندارم اما شب‌ها سرفهٔ خشک دارم و خیلی بی‌حالم.'],
    ],
    checks: [
      {
        promptFa: 'در مطب پزشک واژهٔ «şikayetiniz nedir?» چه معنایی دارد؟',
        choices: ['مشکل / علامت بیماری شما چیست؟', 'چرا دیر آمدید؟', 'کدام بیمارستان بهتر است؟'],
        correctIndex: 0,
        explanationFa: 'در بافت پزشکی ترکیه، şikayet به معنی «علامت و مشکل سلامتی بیمار» است.',
      },
      {
        promptFa: 'عبارت «midem bulandı» کدام علامت جسمی را بیان می‌کند؟',
        choices: ['سردرد خفیف', 'حالت تهوع داشتن', 'درد مفاصل پا'],
        correctIndex: 1,
        explanationFa: 'mide bulanması / midem bulandı اصطلاح دقیق حالت تهوع در ترکی استانبولی است.',
      },
    ],
  },

  /* ۱۲. صحبت درباره سلامت و توصیه‌های ساده */
  {
    id: 'tr-a2-s-12-health-simple-advice',
    title: 'صحبت درباره سلامت و توصیه‌های ساده',
    subtitle: 'Survival · دستور مصرف دارو، عادت‌های سالم روزانه، خواب کافی و احوال‌پرسی از بیمار',
    situation: 'توصیه‌های پزشک یا داروساز دربارهٔ نحوهٔ مصرف دارو و سبک زندگی سالم را می‌فهمید و به دیگران منتقل می‌کنید.',
    teachingFa: 'در داروخانه و گفتگوهای سلامت دو اصطلاح طلایی بسیار مهم‌اند: «aç karnına» (با معدهٔ خالی / ناشتا) و «tok karnına» (با شکم پر / بعد از غذا). همچنین عبارت دعایی «Geçmiş olsun!» هنگام بیماری و «Acil şifalar dilerim» برای آرزوی بهبودی سریع به کار می‌رود.',
    rows: [
      ['Bu antibiyotiği sabah akşam tok karnına birer tablet içmelisiniz.', 'این آنتی‌بیوتیک را باید صبح و شب بعد از غذا (با شکم پر) هر بار یک قرص بخورید.', 'بو آنتی‌بییوتییی ساباه آکشام توک کارنِینا بیرَر تابلَت ایچمِلیسینیز', 'tok karnına', 'با شکم پر / پس از غذا', 'tok karnına در برابر aç karnına'],
      ['Mide ilacını kahvaltıdan yarım saat önce aç karnına almanız gerekiyor.', 'لازم است داروی معده را نیم ساعت قبل از صبحانه ناشتا مصرف کنید.', 'میده ایلاجِینِی کاهوالتِیدان یارِیم ساعات اونجه آچ کارنِینا آلمانِیز گِرِکییور', 'aç karnına', 'ناشتا / با معدهٔ خالی'],
      ['İyileşene kadar bol su içmeli ve birkaç gün evde dinlenmelisiniz.', 'تا زمان بهبودی باید آب فراوان بنوشید و چند روز در خانه استراحت کنید.', 'ایییلِشِنه کادار بول سو ایچمِلی وِ بیرکاچ گون اِوده دینلَنمِلیسینیز', 'iyileşene kadar', 'تا زمان خوب شدن'],
      ['Bağışıklık sistemini güçlendirmek için mevsim sebzeleri tüketmek faydalıdır.', 'برای تقویت سیستم ایمنی مصرف سبزیجات فصل مفید است.', 'بائِیشِیکلِیک سیستِمینی گوچلَندیرمَک ایچین مَوسیم سَبزِلَری توکَتمَک فایدالِیدِیر', 'faydalıdır', 'مفید است'],
      ['Uzun süre bilgisayar başında çalışıyorsanız her saat başı ayağa kalkın.', 'اگر مدت طولانی پشت رایانه کار می‌کنید سرِ هر ساعت از جایتان بلند شوید.', 'اوزون سوره بیلگیسایار باشِیندا چالِیشِییورسانِیز هَر ساعات باشِی آیائا کالکِین', 'her saat başı', 'سرِ هر ساعت'],
      ['Günde en az yedi saat düzenli uyku hem zihni hem bedeni dinlendirir.', 'دست‌کم هفت ساعت خواب منظم در روز هم ذهن و هم بدن را آرام می‌کند.', 'گونده اَن آز یِدی ساعات دوزَنلی اویکو هَم زیهنی هَم بِدِنی دینلَندیریر', 'düzenli uyku', 'خواب منظم'],
      ['Soğuk algınlığı geçirdiğini duydum; çok geçmiş olsun, kendinizi yormayın.', 'شنیدم سرما خورده‌ای؛ خیلی بلا به دور باشد، خودتان را خسته نکنید.', 'سوئوک آلگِینلِیئِی گِچیردییینی دویدوم؛ چوک گِچمیش اولسون، کَندینیزی یورمایِین', 'geçmiş olsun', 'بلا به دور / کسالتتان برطرف شود'],
      ['Şurubu kullanmadan önce şişeyi iyice çalkalamayı unutmayın.', 'پیش از مصرف شربت فراموش نکنید بطری را خوب تکان بدهید.', 'شوروبو کوللانمادان اونجه شیشِیی ایییجه چالکالامایِی اونوتمایِین', 'çalkalamayı', 'تکان دادن را'],
    ],
    dialogue: [
      ['بیمار', 'Reçetemi alabilir miyim; bu ilaçları günde kaç kez kullanacağım?', 'می‌توانم داروهای نسخه‌ام را بگیرم؛ این داروها را روزی چند بار مصرف خواهم کرد؟'],
      ['داروساز', 'Bu kapsülü günde iki kez, on iki saat arayla tok karnına içeceksiniz.', 'این کپسول را روزی دو بار، با فاصلهٔ دوازده ساعت و با شکم پر خواهید خورد.'],
      ['بیمار', 'Peki boğaz spreyini nasıl kullanmamı önerirsiniz?', 'خب اسپری گلو را چطور پیشنهاد می‌کنید استفاده کنم؟'],
      ['داروساز', 'Günde üç defa kullanabilirsiniz; sonrasında yarım saat bir şey yiyip içmeyin. Geçmiş olsun!', 'می‌توانید روزی سه بار استفاده کنید؛ بعدش تا نیم ساعت چیزی نخورید و ننوشید. سلامت باشید!'],
    ],
    checks: [
      {
        promptFa: 'در دستور داروساز، «tok karnına» به چه معناست؟',
        choices: ['بعد از غذا (با شکم پر)', 'ناشتا پیش از صبحانه', 'فقط پیش از خواب'],
        correctIndex: 0,
        explanationFa: 'tok یعنی سیر؛ tok karnına یعنی با شکم پر (پس از وعدهٔ غذایی) و aç karnına یعنی با معدهٔ خالی.',
      },
      {
        promptFa: 'به دوستی که بیمار شده است در ترکی استانبولی چه می‌گوییم؟',
        choices: ['Ellerine sağlık!', 'Çok geçmiş olsun!', 'Afiyet olsun!'],
        correctIndex: 1,
        explanationFa: '«Çok geçmiş olsun!» عبارت معیار همدردی و آرزوی سلامتی برای فرد بیمار است.',
      },
    ],
  },

  /* ۱۳. مکالمات کاری و شرح وظایف */
  {
    id: 'tr-a2-s-13-workplace-conversations-duties',
    title: 'مکالمات کاری و شرح وظایف',
    subtitle: 'Survival · توضیح مسئولیت‌های شغلی، هماهنگی تیمی، مهلت تحویل و گزارش پیشرفت کار',
    situation: 'در محیط کار یا مصاحبهٔ شغلی وظایف خود را شرح می‌دهید، با همکاران هماهنگ می‌شوید و گزارش تحویل کار می‌دهید.',
    teachingFa: 'برای بیان حوزهٔ مسئولیت شغلی در ترکی از ساختار «... -dan/-den sorumluyum» (مسئولِ ... هستم) و «görevim ... -mak/-mek» (وظیفه‌ام ... است) استفاده می‌شود. واژگان کلیدی اداری: teslim tarihi (مهلت تحویل)، sunum (ارائه)، müşteri ilişkileri (ارتباط با مشتریان)، ekip çalışması (کار تیمی) و onaylamak (تأیید کردن).',
    rows: [
      ['Şirkette dijital pazarlama kampanyalarını yürütmekten sorumluyum.', 'در شرکت مسئول اجرای کمپین‌های بازاریابی دیجیتال هستم.', 'شیرکَتته دیجیتال پازارلاما کامپانیالارِینِی یوروتمَکتَن سوروملویوم', 'sorumluyum', 'مسئول هستم', '-dan/-den sorumlu olmak = مسئولِ چیزی بودن'],
      ['Her pazartesi sabahı ekiple haftalık iş planını gözden geçiriyoruz.', 'هر دوشنبه صبح با تیم برنامهٔ کاری هفتگی را مرور می‌کنیم.', 'هَر پازارتِسی ساباهِی اِکیپله هافتالِیک ایش پلانِینِی گوزدَن گِچیرییوروز', 'gözden geçiriyoruz', 'مرور / بازبینی می‌کنیم'],
      ['Bu projenin son teslim tarihi cuma günü mesai bitimidir.', 'آخرین مهلت تحویل این پروژه روز جمعه پایان ساعت اداری است.', 'بو پروژِنین سون تِسلیم تاریهی جوما گونو مِسایی بیتیمیدیر', 'teslim tarihi', 'تاریخ تحویل'],
      ['Müşterilerden gelen soruları yanıtlamak ve rapor hazırlamak benim görevim.', 'پاسخ دادن به پرسش‌های مشتریان و آماده کردن گزارش وظیفهٔ من است.', 'موشتَریلَردَن گِلَن سورولارِی یانِیتلاماک وِ راپور هازِیرلاماک بِنیم گورَویم', 'görevim', 'وظیفهٔ من'],
      ['Sunum dosyasını güncelledim; kontrol edip onaylayabilir misiniz?', 'فایل ارائه را به‌روزرسانی کردم؛ ممکن است بررسی و تأیید کنید؟', 'سونوم دوسیاسِینِی گونجَللِدیم؛ کونترول اِدیپ اونایلایابیلیر میسینیز', 'onaylayabilir misiniz', 'می‌توانید تأیید کنید؟'],
      ['Teknik ekiple iş birliği yaparak sistemdeki hatayı kısa sürede çözdük.', 'با همکاری با تیم فنی خطای سامانه را در مدت کوتاهی برطرف کردیم.', 'تَکنیک اِکیپله ایش بیرلییی یاپاراک سیستَمدِکی هاتایِی کِیسا سورِده چوزدوک', 'iş birliği', 'همکاری'],
      ['Bugün evden çalışıyorum ama çevrim içi toplantıların hepsine katılacağım.', 'امروز از خانه کار می‌کنم اما در تمام جلسات آنلاین شرکت خواهم کرد.', 'بوگون اِودَن چالِیشِییوروم آما چَوریم ایچی توپلانتِیلارِین هَپسینه کاتِیلاجائِیم', 'çevrim içi', 'آنلاین / برخط'],
      ['Yoğun dönemlerde görevleri ekip arkadaşlarımızla dengeli biçimde paylaşıyoruz.', 'در دوره‌های پرکار، وظایف را متعادل با هم‌تیمی‌هایمان تقسیم می‌کنیم.', 'یوئون دونَملَرده گورَولَری اِکیپ آرکاداشلارِیمِیزلا دَنگِلی بیچیمده پایلاشِییوروز', 'paylaşıyoruz', 'تقسیم می‌کنیم / به اشتراک می‌گذاریم'],
    ],
    dialogue: [
      ['مدیر پروژه', 'Hoş geldin Derya; yeni görev dağılımında hangi bölümden sorumlu olacaksın?', 'خوش آمدی دریا؛ در تقسیم کار جدید مسئول کدام بخش خواهی بود؟'],
      ['دریا', 'Kullanıcı geri bildirimlerini toplamak ve haftalık analiz raporunu hazırlamaktan sorumluyum.', 'مسئول گردآوری بازخوردهای کاربران و تهیهٔ گزارش تحلیلی هفتگی هستم.'],
      ['مدیر پروژه', 'İlk raporu ne zaman paylaşabilirsin?', 'اولین گزارش را چه زمانی می‌توانی به اشتراک بگذاری؟'],
      ['دریا', 'Verileri yarın tamamlayıp perşembe öğleden önce sunuma hazır edeceğim.', 'داده‌ها را فردا کامل می‌کنم و پنج‌شنبه پیش از ظهر برای ارائه آماده خواهم کرد.'],
    ],
    checks: [
      {
        promptFa: 'در محیط کار برای گفتن «مسئولِ ... هستم» از چه ساختاری استفاده می‌شود؟',
        choices: ['... -dan/-den sorumluyum', '... -a/-e yasaktır', '... kadar yorgunum'],
        correctIndex: 0,
        explanationFa: 'صفت sorumlu (مسئول) همراه با پسوند مبدأ (-dan/-den/-tan/-ten) حوزهٔ مسئولیت را مشخص می‌کند.',
      },
      {
        promptFa: 'معنای عبارت «son teslim tarihi» چیست؟',
        choices: ['تاریخ استخدام', 'آخرین مهلت تحویل (ددلاین)', 'ساعت ناهار کارکنان'],
        correctIndex: 1,
        explanationFa: 'son teslim tarihi معادل دقیق ددلاین یا آخرین مهلت تحویل کار و پروژه است.',
      },
    ],
  },

  /* ۱۴. صحبت درباره تحصیل و برنامه‌های آموزشی */
  {
    id: 'tr-a2-s-14-study-educational-programs',
    title: 'صحبت درباره تحصیل و برنامه‌های آموزشی',
    subtitle: 'Survival · رشتهٔ دانشگاهی، انتخاب واحد، دوره‌های مهارتی، بورسیه و برنامهٔ امتحانات',
    situation: 'دربارهٔ رشتهٔ تحصیلی، کلاس‌های زبان یا مهارتی، تکالیف و برنامهٔ آزمون‌هایتان گفتگو می‌کنید.',
    teachingFa: 'واژگان کلیدی آموزش و دانشگاه در ترکیه: bölüm (رشته/گروه آموزشی)، dönem / yarıyıl (نیم‌سال تحصیلی)، ders seçimi (انتخاب واحد)، burs (بورسیه)، vize ve final sınavları (امتحانات میان‌ترم و پایان‌ترم)، sertifika programı (دورهٔ گواهی‌نامه‌دار) و devam zorunluluğu (شرط حضور و غیاب).',
    rows: [
      ['Üniversitede mimarlık bölümünde okuyorum ve bu yıl üçüncü sınıftayım.', 'در دانشگاه در رشتهٔ معماری تحصیل می‌کنم و امسال سال سومی هستم.', 'اونیوَرسیتِده میمارلِیک بولومونده اوکویوروم وِ بو یِیل اوچونجو سِینِیفتایِیم', 'bölümünde', 'در رشتهٔ / در بخشِ', 'bölüm + ü (ملکی) + n + de = در رشتهٔ...'],
      ['Bu dönem seçmeli ders olarak kültür tarihi dersini aldım.', 'این ترم به عنوان درس اختیاری، درس تاریخ فرهنگ را برداشتم.', 'بو دونَم سَچمِلی دَرس اولاراک کولتور تاریهی دَرسینی آلدِیم', 'seçmeli ders', 'درس اختیاری', 'ders almak = برداشتن واحد درسی'],
      ['Kursa düzenli katılmak gerekiyor; çünkü yüzde seksen devam zorunluluğu var.', 'شرکت منظم در دوره لازم است؛ چون هشتاد درصد شرط حضور و غیاب دارد.', 'کورسا دوزَنلی کاتِیلماک گِرِکییور؛ چونکو یوزده سَکسَن دِوام زورونلولوئو وار', 'devam zorunluluğu', 'الزام حضور در کلاس'],
      ['Vize sınavları gelecek hafta başlıyor, bu yüzden kütüphanede çalışıyoruz.', 'امتحانات میان‌ترم هفتهٔ آینده شروع می‌شود، به همین دلیل در کتابخانه درس می‌خوانیم.', 'ویزه سِیناولارِی گِلِجَک هافتا باشلِییور، بو یوزدَن کوتوپهانِده چالِیشِییوروز', 'vize sınavları', 'امتحانات میان‌ترم'],
      ['Yüksek lisans bursu için başvuru süresini kaçırmamak çok önemli.', 'از دست ندادن مهلت ثبت‌نام برای بورسیهٔ کارشناسی ارشد بسیار مهم است.', 'یوکسَک لیسانس بورسو ایچین باشوورو سورِسینی کاچِیرماماک چوک اونَملی', 'başvuru süresini', 'مهلت ثبت‌نام را'],
      ['Akşamları çevrim içi veri analizi sertifika programına devam ediyorum.', 'عصرها دورهٔ گواهی‌نامهٔ آنلاین تحلیل داده را ادامه می‌دهم.', 'آکشاملارِی چَوریم ایچی وِری آنالیزی سَرتیفیکا پروگرامِینا دِوام اِدییوروم', 'sertifika programına', 'به دورهٔ گواهی‌نامه'],
      ['Danışman hocamla tez konum hakkında verimli bir görüşme yaptım.', 'با استاد راهنمایم دربارهٔ موضوع پایان‌نامه‌ام گفتگوی مفیدی انجام دادم.', 'دانِیشمان هوجاملا تَز کونوم هاککِیندا وِریملی بیر گوروشمه یاپتِیم', 'danışman hocamla', 'با استاد راهنمایم'],
      ['Dönem sonunda grup projemizi jüri önünde sunacağız.', 'در پایان ترم پروژهٔ گروهی‌مان را در برابر هیئت داوران ارائه خواهیم کرد.', 'دونَم سونوندا گروپ پروژِمیزی ژوری اونونده سوناجائِیز', 'sunacağız', 'ارائه خواهیم داد'],
    ],
    dialogue: [
      ['آرمان', 'Yeni dönem ders programın belli oldu mu, haftada kaç gün dersin var?', 'برنامهٔ کلاسی ترم جدیدت مشخص شد، هفته‌ای چند روز کلاس داری؟'],
      ['سوینچ', 'Evet, dört gün fakültede dersim var; cuma günleri ise dil kursuna gideceğim.', 'بله، چهار روز در دانشکده کلاس دارم و روزهای جمعه به کلاس زبان خواهم رفت.'],
      ['آرمان', 'Harika! Dil kursunu bitirince sertifika veriliyor mu?', 'عالی! وقتی دورهٔ زبان را تمام کنی گواهی‌نامه داده می‌شود؟'],
      ['سوینچ', 'Evet, dönem sonu sınavında başarılı olursak resmi katılım belgesi alacağız.', 'بله، اگر در آزمون پایان دوره موفق شویم گواهی رسمی شرکت دریافت خواهیم کرد.'],
    ],
    checks: [
      {
        promptFa: 'در دانشگاه‌های ترکیه منظور از «vize sınavları» چیست؟',
        choices: ['مصاحبهٔ سفارت برای سفر', 'امتحانات میان‌ترم دانشگاه', 'جشن فارغ‌التحصیلی'],
        correctIndex: 1,
        explanationFa: 'در نظام دانشگاهی ترکیه، vize به آزمون میان‌ترم و final به آزمون پایان‌ترم گفته می‌شود.',
      },
      {
        promptFa: 'عبارت «seçmeli ders» به چه معناست؟',
        choices: ['درس اختیاری', 'درس حذف‌شده', 'کلاس جبرانی شبانه'],
        correctIndex: 0,
        explanationFa: 'seçmeli ders درس اختیاری و zorunlu ders درس اجباری رشته است.',
      },
    ],
  },

  /* ۱۵. بیان مشکل و درخواست راه‌حل */
  {
    id: 'tr-a2-s-15-stating-problems-asking-solutions',
    title: 'بیان مشکل و درخواست راه‌حل',
    subtitle: 'Survival · توضیح روشن یک مشکل فنی یا اداری و پرسیدن گزینه‌های حل مسئله',
    situation: 'در بانک، سامانهٔ اینترنتی یا محل اقامت با مشکلی روبه‌رو شده‌اید؛ مشکل را شرح می‌دهید و راه‌حل عملی می‌خواهید.',
    teachingFa: 'الگوی کاربردی بیان مشکل و خواستن راه‌حل در ترکی استانبولی سه بخش دارد: ۱) معرفی مودبانهٔ مشکل: «Bir sorunum var / Küçük bir aksaklık yaşadım»؛ ۲) شرح دقیق اتفاق: «Şifremi girdim ama hesabım kilitlendi»؛ ۳) درخواست راه‌حل: «Bu sorunu nasıl çözebiliriz? / Ne yapmam gerekiyor?».',
    rows: [
      ['Mobil bankacılık uygulamasına giremiyorum; hesabım bloke olmuş görünüyor.', 'نمی‌توانم وارد اپلیکیشن همراه بانک شوم؛ به نظر می‌رسد حسابم مسدود شده است.', 'موبیل بانکاجِیلِیک اویگولاماسِینا گیرِمییوروم؛ هِسابِیم بلوکه اولموش گورونویور', 'giremiyorum', 'نمی‌توانم وارد شوم'],
      ['Bu sorunu en hızlı şekilde nasıl çözebiliriz, ne önerirsiniz?', 'چطور می‌توانیم این مشکل را در سریع‌ترین شکل حل کنیم، چه پیشنهاد می‌دهید؟', 'بو سورونو اَن هِیزلِی شِکیلده ناسِیل چوزِبیلیریز، نِ اونَریرسینیز', 'çözebiliriz', 'می‌توانیم حل کنیم', 'پرسش راه‌حل با nasıl çözebiliriz'],
      ['İnternet bağlantımız sabahtan beri sürekli kopuyor; teknik ekip bakabilir mi?', 'اتصال اینترنت ما از صبح مدام قطع می‌شود؛ تیم فنی می‌تواند بررسی کند؟', 'اینتَرنَت بائلانتِیمِیز ساباهتان بِری سورَکلی کوپویور؛ تَکنیک اِکیپ باکابیلیر می', 'kopuyor', 'قطع می‌شود'],
      ['Ödeme yaptım fakat sistemde faturam hâlâ ödenmemiş görünüyor.', 'پرداخت را انجام دادم اما در سامانه قبضم هنوز پرداخت‌نشده دیده می‌شود.', 'اودِمه یاپتِیم فاکات سیستَمده فاتورام هالا اودَنمِمیش گورونویور', 'ödenmemiş', 'پرداخت‌نشده'],
      ['Bavulum bagaj bandından çıkmadı; kayıp eşya bürosuna mı başvurmalıyım?', 'چمدانم از نوار بار بیرون نیامد؛ باید به دفتر اشیای گمشده مراجعه کنم؟', 'باوولوم باگاژ باندِیندان چِیکمادِی؛ کایِیپ اَشیا بوروسونا مِی باشوورمالِییِیم', 'kayıp eşya', 'اشیای گمشده'],
      ['Kartımı bankamatikte unuttum; hemen iptal edip yenisini çıkarabilir miyiz?', 'کارتم را در خودپرداز جا گذاشتم؛ می‌توانیم فوراً باطلش کنیم و کارت جدید صادر کنیم؟', 'کارتِیمِی بانکاماتیکته اونوتتوم؛ هِمَن ایپتال اِدیپ یِنیسینی چِیکارابیلیر میییز', 'bankamatikte', 'در دستگاه خودپرداز'],
      ['Sistem hata veriyor; başvurumu başka bir yoldan tamamlamam mümkün mü?', 'سامانه خطا می‌دهد؛ امکانش هست ثبت‌نامم را از راه دیگری تکمیل کنم؟', 'سیستَم هاتا وِرییور؛ باشوورومو باشکا بیر یولدان تاماملامام مومکون مو', 'hata veriyor', 'خطا می‌دهد / ارور می‌دهد'],
      ['Dekontu e-postayla göndersem işlemi bugün sonuçlandırabilir misiniz?', 'اگر رسید پرداخت را با ایمیل بفرستم می‌توانید کار را امروز به نتیجه برسانید؟', 'دِکونتو اِپوستایلا گوندَرسَم ایشلِمی بوگون سونوچلاندِیرابیلیر میسینیز', 'sonuçlandırabilir misiniz', 'می‌توانید به نتیجه برسانید؟'],
    ],
    dialogue: [
      ['کاربر', 'Merhaba, online bilet aldım ama telefonuma onay kodu gelmedi; ne yapmam gerekiyor?', 'سلام، بلیت آنلاین خریدم اما کد تأیید به تلفنم نیامد؛ لازم است چه کار کنم؟'],
      ['پشتیبان', 'Hemen bakalım; rezervasyon sırasında yazdığınız e-posta adresini söyleyebilir misiniz?', 'فوراً بررسی می‌کنیم؛ ممکن است نشانی ایمیلی را که هنگام رزرو نوشتید بگویید؟'],
      ['کاربر', 'Sanırım e-posta adresimde bir harfi yanlış yazmışım; düzeltebilir miyiz?', 'گمان کنم در نشانی ایمیلم یک حرف را اشتباه نوشته‌ام؛ می‌توانیم اصلاحش کنیم؟'],
      ['پشتیبان', 'Evet, sistemden şimdi düzelttim ve biletinizi hem e-postaya hem telefonunuza yeniden gönderdim.', 'بله، الان از داخل سامانه اصلاحش کردم و بلیتتان را هم به ایمیل و هم به تلفنتان دوباره فرستادم.'],
    ],
    checks: [
      {
        promptFa: 'در ترکی استانبولی «Sistem hata veriyor» به چه معناست؟',
        choices: ['سامانه خطا (ارور) می‌دهد', 'سامانه بسیار سریع است', 'سامانه به‌روزرسانی شد'],
        correctIndex: 0,
        explanationFa: 'hata vermek اصطلاح رایج برای ارور دادن نرم‌افزار، وب‌سایت یا دستگاه است.',
      },
      {
        promptFa: 'برای پرسیدن راه‌حل در موقعیت اداری کدام جمله مناسب‌تر است؟',
        choices: ['Bu sorunu nasıl çözebiliriz?', 'Geçen yıl nereye gittiniz?', 'Hava çok sıcak oldu mu?'],
        correctIndex: 0,
        explanationFa: '«Bu sorunu nasıl çözebiliriz?» مستقیماً و محترمانه راهکار حل مشکل را جویا می‌شود.',
      },
    ],
  },

  /* ۱۶. شکایت مؤدبانه و درخواست رسیدگی */
  {
    id: 'tr-a2-s-16-polite-complaints-follow-up',
    title: 'شکایت مؤدبانه و درخواست رسیدگی',
    subtitle: 'Survival · بیان نارضایتی بدون تندی با kusura bakmayın ama و درخواست پیگیری محترمانه',
    situation: 'سفارش دیر رسیده، اتاق هتل مشکل دارد یا خدمات مطابق وعده نبوده است؛ محترمانه اما قاطع درخواست رسیدگی می‌کنید.',
    teachingFa: 'برای شکایت مؤدبانه در فرهنگ گفتاری استانبول، کلام را با «Affedersiniz / Kusura bakmayın ama...» (ببخشید اما...) آغاز می‌کنیم، واقعیت را بدون توهین شرح می‌دهیم و سپس با «Bu konuyla ilgilenebilir misiniz?» (ممکن است به این موضوع رسیدگی کنید؟) یا «Yardımcı olmanızı rica ediyorum» خواهان اقدام فوری می‌شویم.',
    rows: [
      ['Kusura bakmayın ama sipariş vereli kırk dakika oldu ve yemeğimiz hâlâ gelmedi.', 'ببخشید اما چهل دقیقه از سفارش دادن ما گذشته و غذایمان هنوز نیامده است.', 'کوسورا باکمایِین آما سیپاریش وِرِلی کِیرک داکیکا اولدو وِ یِمَییمیز هالا گَلمِدی', 'kusura bakmayın ama', 'ببخشید اما...', 'شروع مؤدبانهٔ شکایت؛ -(y)alı/-(y)eli = از وقتی که'],
      ['Odamızdaki klima çalışmıyor; lütfen bu konuyla ilgilenebilir misiniz?', 'کولر اتاقمان کار نمی‌کند؛ لطفاً ممکن است به این موضوع رسیدگی کنید؟', 'اودامِیزداکی کلیما چالِیشمِییور؛ لوتفَن بو کونویلا ایلگیلَنِبیلیر میسینیز', 'ilgilenebilir misiniz', 'می‌توانید رسیدگی کنید؟', '-la/-le ilgilenmek = رسیدگی کردن به'],
      ['Banyoda sıcak su akmıyor; teknik servisin bugün kontrol etmesini rica ediyorum.', 'در حمام آب گرم نمی‌آید؛ خواهشمندم سرویس فنی امروز بررسی کند.', 'بانیودا سِیجاک سو آکمِییور؛ تَکنیک سَرویسین بوگون کونترول اِتمِسینی ریجا اِدییوروم', 'rica ediyorum', 'خواهشمندم / تقاضا دارم'],
      ['Bize deniz manzaralı oda sözü verilmişti, fakat bu oda otoparka bakıyor.', 'به ما قول اتاق رو به دریا داده شده بود، اما این اتاق رو به پارکینگ است.', 'بیزه دِنیز مانزارالِی اودا سوزو وِریلمیشتی، فاکات بو اودا اوتوپارکا باکِییور', 'bakıyor', 'رو به ... است / مشرف است'],
      ['Yan masada çok yüksek ses var; daha sakin bir masaya geçebilir miyiz?', 'در میز کناری صدای خیلی بلندی هست؛ می‌توانیم به میز آرام‌تری برویم؟', 'یان ماسادا چوک یوکسَک سَس وار؛ داها ساکین بیر ماسایا گِچِبیلیر میییز', 'sakin bir masaya', 'به یک میز آرام‌تر'],
      ['Kargom üç gündür şubede bekliyor; teslimatın hızlandırılmasını talep ediyorum.', 'بستهٔ من سه روز است در شعبه مانده؛ درخواست تسریع تحویل را دارم.', 'کارگوم اوچ گوندور شوبِده بَکلییور؛ تِسلیماتِین هِیزلاندِیرِیلماسِینِی تالَپ اِدییوروم', 'talep ediyorum', 'درخواست می‌کنم (رسمی)'],
      ['Faturada iki kez servis ücreti yazılmış; tekrar kontrol eder misiniz?', 'در صورت‌حساب دو بار حق سرویس نوشته شده است؛ ممکن است دوباره بررسی کنید؟', 'فاتورادا ایکی کِز سَرویس اوجرِتی یازِیلمِیش؛ تِکرار کونترول اِدَر میسینیز', 'yazılmış', 'نوشته شده است'],
      ['Üst kattaki tadilat gürültüsü geç saatlere kadar sürdü; yönetime bildirmek istedim.', 'سر‌و‌صدای تعمیرات طبقهٔ بالا تا دیروقت ادامه داشت؛ خواستم به مدیریت اطلاع بدهم.', 'اوست کاتتاکی تادیلات گورولتوسو گِچ ساعاتلَره کادار سوردو؛ یونِتیمه بیلدیرمَک ایستِدیم', 'bildirmek istedim', 'خواستم اطلاع بدهم'],
    ],
    dialogue: [
      ['مهمان هتل', 'Affedersiniz, az önce odaya çıktık ama çarşaflar değiştirilmemiş ve havlu eksik.', 'ببخشید، چند لحظه پیش به اتاق رفتیم اما ملحفه‌ها عوض نشده و حوله کم است.'],
      ['مسئول پذیرش', 'Çok özür dileriz efendim, hemen kat hizmetlerine haber veriyorum.', 'بسیار پوزش می‌خواهیم، همین الان به بخش خانه‌داری اطلاع می‌دهم.'],
      ['مهمان هتل', 'Teşekkür ederim; ayrıca banyonun lambası da yanıp sönüyor, ona da bakabilirler mi?', 'متشکرم؛ همچنین لامپ حمام هم چشمک می‌زند، می‌توانند به آن هم رسیدگی کنند؟'],
      ['مسئول پذیرش', 'Elbette, on beş dakika içinde hem oda takımını yenileyeceğiz hem de lambayı değiştireceğiz.', 'حتماً، ظرف پانزده دقیقه هم سرویس اتاق را نو خواهیم کرد و هم لامپ را عوض خواهیم کرد.'],
    ],
    checks: [
      {
        promptFa: 'کدام جمله مؤدبانه‌ترین راه برای درخواست رسیدگی به یک مشکل است؟',
        choices: ['Lütfen bu konuyla ilgilenebilir misiniz?', 'Hemen buradan çıkın!', 'Hiçbir şey söylemem!'],
        correctIndex: 0,
        explanationFa: 'فعل «ilgilenmek» همراه با «lütfen ... -ebilir misiniz» استانداردترین عبارت درخواست پیگیری محترمانه است.',
      },
      {
        promptFa: 'در جملهٔ «Bu oda otoparka bakıyor»، فعل «bakıyor» چه معنایی می‌دهد؟',
        choices: ['پنجرهٔ اتاق رو به پارکینگ باز می‌شود / مشرف به پارکینگ است', 'در پارکینگ خودرویی نیست', 'پارکینگ بسته است'],
        correctIndex: 0,
        explanationFa: 'برای ساختمان و اتاق، «bir yere bakmak» یعنی «رو به جایی بودن / مشرف بودن».',
      },
    ],
  },
];

export const TURKISH_A2_SURVIVAL_PART_A = buildTurkishLessons(A2_SURVIVAL_PART_A_SEEDS, 'tr3', 209);
