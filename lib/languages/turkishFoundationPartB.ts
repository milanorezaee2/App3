import { buildTurkishLessons, type TurkishLessonSeed } from './turkishSeed';

const FOUNDATION_PART_B_SEEDS: readonly TurkishLessonSeed[] = [
  /* ۱۸. صرف افعال پرکاربرد در زمان حال استمراری */
  {
    id: 'tr-l1-common-verbs-present',
    title: 'صرف افعال پرکاربرد در زمان حال استمراری',
    subtitle: 'کاربرد روزمرهٔ افعال کلیدی (yapmak, gelmek, almak, vermek, bilmek, çalışmak, sevmek)',
    situation: 'با مهم‌ترین فعل‌های پرتکرار ترکی استانبولی دربارهٔ کار، خرید، دانستن و فعالیت‌های روزانه صحبت می‌کنید.',
    teachingFa: 'تسلط بر افعال پرتکرار، ستون مکالمهٔ روزمره است: yapmak → yapıyorum (انجام می‌دهم)، gelmek → geliyorum (می‌آیم)، almak → alıyorum (می‌خرم / می‌گیرم)، vermek → veriyorum (می‌دهم)، bilmek → biliyorum (می‌دانم / بلدم)، istemek → istiyorum (می‌خواهم)، çalışmak → çalışıyorum (کار می‌کنم / درس می‌خوانم) و sevmek → seviyorum (دوست دارم). توجه کنید که çalışmak هم «کار کردن» است و هم «درس خواندن / مطالعه کردن».',
    rows: [
      ['Hafta içi bir şirkette çalışıyorum.', 'طول هفته در یک شرکت کار می‌کنم.', 'هافتا ایچی بیر شیرکَتّه چالِیشِییوروم', 'çalışıyorum', 'کار می‌کنم', 'çalışmak → çalışıyorum'],
      ['Marketten taze meyve alıyoruz.', 'از سوپرمارکت میوهٔ تازه می‌خریم.', 'مارکَتّه‌ن تازه مِیوه آلِییوروز', 'alıyoruz', 'می‌خریم / می‌گیریم'],
      ['Bu cevabı çok iyi biliyorum.', 'این پاسخ را خیلی خوب می‌دانم.', 'بو جِوابِی چوک ایی بیلییوروم', 'biliyorum', 'می‌دانم'],
      ['Sen kahvaltıda ne yapıyorsun?', 'تو برای صبحانه چه درست می‌کنی؟', 'سَن کاهوالتِیدا نِ یاپِییورسون', 'yapıyorsun', 'انجام می‌دهی / درست می‌کنی'],
      ['Öğretmen öğrencilere ödev veriyor.', 'معلم به دانش‌آموزان تکلیف می‌دهد.', 'اوئْرِتمَن اوئْرَنجیلِره اودَو وِرییور', 'veriyor', 'می‌دهد'],
      ['Biz Türk mutfağını çok seviyoruz.', 'ما غذای ترکی را خیلی دوست داریم.', 'بیز تورک موتفائِینِی چوک سِوییوروز', 'seviyoruz', 'دوست داریم', 'مفعول مشخص + seviyoruz'],
      ['Misafirler birazdan eve geliyor.', 'مهمان‌ها تا کمی دیگر به خانه می‌آیند.', 'میسافیرلَر بیرازدان اِوه گِلییور', 'geliyor', 'می‌آید / می‌آیند'],
      ['Akşam için bir masa ayırtıyoruz.', 'برای شب یک میز رزرو می‌کنیم.', 'آکشام ایچین بیر ماسا آیِیرتِییوروز', 'ayırtıyoruz', 'رزرو می‌کنیم'],
    ],
    dialogue: [
      ['جان', 'Cumartesi günü ne yapıyorsun?', 'روز شنبه چه کار می‌کنی؟'],
      ['مریم', 'Sabah ders çalışıyorum, öğleden sonra alışveriş yapıyorum.', 'صبح درس می‌خوانم، بعدازظهر خرید می‌کنم.'],
      ['جان', 'Akşam bize geliyor musun?', 'شب پیش ما می‌آیی؟'],
      ['مریم', 'Evet, memnuniyetle geliyorum!', 'بله، با کمال میل می‌آیم!'],
    ],
    checks: [
      {
        promptFa: 'فعل «almak» در جملهٔ «Marketten meyve alıyoruz» چه معنایی دارد؟',
        choices: ['فروختن', 'خریدن / گرفتن', 'پختن'],
        correctIndex: 1,
        explanationFa: 'فعل almak هم به معنی «گرفتن» و هم در بافت خرید به معنی «خریدن» بسیار پرکاربرد است.',
      },
      {
        promptFa: 'معنی جملهٔ «Bu cevabı çok iyi biliyorum.» چیست؟',
        choices: ['این پاسخ را خیلی خوب می‌دانم.', 'این پرسش را الان می‌نویسم.', 'این کتاب را خیلی دوست دارم.'],
        correctIndex: 0,
        explanationFa: 'cevabı یعنی «پاسخ را» و biliyorum از فعل bilmek یعنی «می‌دانم».',
      },
    ],
  },

  /* ۱۹. جمله‌های مثبت، منفی و پرسشی */
  {
    id: 'tr-l1-affirmative-negative-interrogative',
    title: 'جمله‌های مثبت، منفی و پرسشی',
    subtitle: 'منفی‌سازی فعل با -m(I)yor و پرسش‌سازی با جزء جداگانهٔ musun / muyuz / mu',
    situation: 'یک خبر یا فعالیت را هم به صورت مثبت، هم منفی و هم پرسشی در گفتگوی روزمره به کار می‌برید.',
    teachingFa: 'در زمان حال استمراری، پسوند منفی -mı / -mi / -mu / -mü مستقیماً پس از ریشه و پیش از -yor می‌آید: gel-mi-yor-um (نمی‌آیم)، bil-mi-yor-um (نمی‌دانم)، konuş-mu-yor (صحبت نمی‌کند)، düşün-mü-yor-uz (فکر نمی‌کنیم). توجه کنید که در منفیِ gitmek، چون پس از t حرف همخوان m می‌آید، t نرم نمی‌شود: gidiyorum اما gitmiyorum! در حالت پرسشی، چون آخرین واکهٔ -yor همیشه «o» است، جزء پرسشی همیشه با u ساخته می‌شود و جدا می‌آید: Geliyor musun?، Geliyor muyuz?، Geliyor musunuz?، O geliyor mu? و در سوم‌شخص جمع: Onlar geliyorlar mı?',
    rows: [
      ['Ben kahveye şeker koyuyorum.', 'من در قهوه شکر می‌ریزم.', 'بَن کاهوِیه شِکَر کویویوروم', 'koyuyorum', 'می‌گذارم / می‌ریزم'],
      ['Ben çaya hiç şeker koymuyorum.', 'من در چای اصلاً شکر نمی‌ریزم.', 'بَن چایا هیچ شِکَر کویمویوروم', 'koymuyorum', 'نمی‌ریزم', 'ریشه + -m(I)yor + شناسه'],
      ['Bu akşam dışarı çıkmıyoruz.', 'امشب بیرون نمی‌رویم.', 'بو آکشام دِیشارِی چِیکمِییوروز', 'çıkmıyoruz', 'بیرون نمی‌رویم'],
      ['Bugün işe gitmiyorum, dinleniyorum.', 'امروز سر کار نمی‌روم، استراحت می‌کنم.', 'بوگون ایشه گیتمییوروم، دینلِنییوروم', 'gitmiyorum', 'نمی‌روم (حفظ t پیش از -mi)'],
      ['Sen Türkçe biliyor musun?', 'آیا تو ترکی بلدی؟', 'سَن تورکچه بیلییور موسون', 'musun', 'آیا (تو) ...؟', '-yor + mu + شناسهٔ شخصی؟'],
      ['Benimle sinemaya geliyor musunuz?', 'آیا با من به سینما می‌آیید؟', 'بِنیمله سینِمایا گِلییور موسونوز', 'geliyor musunuz', 'آیا می‌آیید؟'],
      ['O bugün toplantıya katılmıyor mu?', 'آیا او امروز در جلسه شرکت نمی‌کند؟', 'او بوگون توپلانتِییا کاتِیلمِییور مو', 'katılmıyor', 'شرکت نمی‌کند'],
      ['Onlar burada oturmuyorlar mı?', 'آیا آن‌ها اینجا سکونت ندارند؟', 'اونلار بورادا اوتورمویورلار مِی', 'oturmuyorlar', 'زندگی/سکونت نمی‌کنند'],
    ],
    dialogue: [
      ['سلین', 'Sara, çaya şeker alıyor musun?', 'سارا، با چای شکر برمی‌داری؟'],
      ['سارا', 'Hayır, teşekkürler. Ben şeker kullanmıyorum.', 'نه، ممنون. من شکر مصرف نمی‌کنم.'],
      ['سلین', 'Süt de istemiyor musun?', 'شیر هم نمی‌خواهی؟'],
      ['سارا', 'Hayır, sade çay içiyorum.', 'نه، چای ساده می‌نوشم.'],
    ],
    checks: [
      {
        promptFa: 'شکل منفیِ درستِ «gidiyorum» (می‌روم) کدام است؟',
        choices: ['gidmiyorum', 'gitmiyorum', 'gidemiyorum'],
        correctIndex: 1,
        explanationFa: 'پسوند منفی با همخوان m آغاز می‌شود؛ بنابراین t در ریشهٔ git- نرم نمی‌شود: gitmiyorum (gidemiyorum یعنی «نمی‌توانم بروم»).',
      },
      {
        promptFa: 'پرسشِ درست برای «آیا تو می‌آیی؟» در زمان حال استمراری کدام است؟',
        choices: ['Geliyor misin?', 'Geliyor musun?', 'Geliyorsun mu?'],
        correctIndex: 1,
        explanationFa: 'به دلیل واکهٔ o در پایان geliyor، جزء پرسشی به شکل mu + sun جداگانه می‌آید: Geliyor musun?',
      },
    ],
  },

  /* ۲۰. پرسش‌سازی با کلمات پرسشی */
  {
    id: 'tr-l1-question-words',
    title: 'پرسش‌سازی با کلمات پرسشی (Ne / Nerede / Kim / Ne zaman / Neden / Nasıl / Kaç / Hangi)',
    subtitle: 'هشت کلیدواژهٔ پرسشی اصلی بدون نیاز به جزء mı/mi در جمله',
    situation: 'دربارهٔ زمان، مکان، علت، چگونگی، تعداد و انتخاب گزینه پرسش‌های دقیق مطرح می‌کنید.',
    teachingFa: 'وقتی در جمله کلمهٔ پرسشی وجود دارد، دیگر جزء پرسشی mı / mi / mu / mü نمی‌آید! هشت کلمهٔ پرسشی پایه را با مثال به خاطر بسپارید: Ne? (چه / چه چیزی؟)، Nerede? (کجا؟)، Kim? (چه کسی؟)، Ne zaman? (کِی / چه زمانی؟)، Neden? / Niçin? (چرا؟)، Nasıl? (چطور / چگونه؟)، Kaç? (چند؟ — و Ne kadar? چقدر؟)، Hangi? (کدام؟ — همیشه پیش از یک اسم می‌آید، مثل hangi otobüs).',
    rows: [
      ['Hafta sonu ne yapıyorsunuz?', 'آخر هفته چه کار می‌کنید؟', 'هافتا سونو نِ یاپِییورسونوز', 'ne', 'چه / چه کار', 'کلمهٔ پرسشی بدون mı/mi می‌آید'],
      ['En yakın metro istasyonu nerede?', 'نزدیک‌ترین ایستگاه مترو کجاست؟', 'اَن یاکِین مِترو ایستاسیونو نِرِده', 'nerede', 'کجا / در کجا'],
      ['Kapıda seni kim bekliyor?', 'دم در چه کسی منتظر توست؟', 'کاپِیدا سِنی کیم بِکلییور', 'kim', 'چه کسی'],
      ['Uçağınız ne zaman kalkıyor?', 'هواپیمای شما چه زمانی حرکت می‌کند؟', 'اوچائِینِیز نِ زامان کالکِییور', 'ne zaman', 'چه زمانی / کِی'],
      ['Bugün neden erken çıkıyorsun?', 'امروز چرا زود بیرون می‌روی؟', 'بوگون نِدَن اَرکَن چِیکِییورسون', 'neden', 'چرا'],
      ['İşe her gün nasıl gidiyorsun?', 'هر روز چطور سر کار می‌روی؟', 'ایشه هَر گون ناسِیل گیدییورسون', 'nasıl', 'چطور / چگونه'],
      ['Masada kaç sandalye var?', 'کنار میز چند صندلی هست؟', 'ماسادا کاچ ساندالیه وار', 'kaç', 'چند'],
      ['Taksim\'e hangi otobüs gidiyor?', 'کدام اتوبوس به تکسیم می‌رود؟', 'تاکسیمه هانگی اوتوبوس گیدییور', 'hangi', 'کدام', 'hangi + اسم مفرد'],
    ],
    dialogue: [
      ['مریم', 'Pardon, Kadıköy vapuru ne zaman kalkıyor?', 'ببخشید، کشتی کادیکوی چه زمانی حرکت می‌کند؟'],
      ['کارمند', 'On dakika sonra kalkıyor.', 'ده دقیقهٔ دیگر حرکت می‌کند.'],
      ['مریم', 'Peki hangi iskeleden kalkıyor?', 'خب از کدام اسکله حرکت می‌کند؟'],
      ['کارمند', 'İkinci iskeleden, hemen sağda.', 'از اسکلهٔ دوم، همین سمت راست.'],
    ],
    checks: [
      {
        promptFa: 'کدام کلمهٔ پرسشی همیشه پیش از یک اسم قرار می‌گیرد و معنی «کدام» می‌دهد؟',
        choices: ['neden', 'hangi', 'nerede'],
        correctIndex: 1,
        explanationFa: 'واژهٔ hangi (کدام) پیش از اسم می‌آید؛ مانند hangi otobüs (کدام اتوبوس) یا hangi gün (کدام روز).',
      },
      {
        promptFa: 'کدام جمله از نظر قواعد پرسش‌سازی در ترکی استانبولی درست است؟',
        choices: ['Ne zaman geliyor musun?', 'Ne zaman geliyorsun?', 'Mı ne zaman geliyorsun?'],
        correctIndex: 1,
        explanationFa: 'وقتی کلمهٔ پرسشی مانند ne zaman در جمله هست، جزء پرسشی mı/mu اضافه نمی‌شود.',
      },
    ],
  },

  /* ۲۱. اعداد ترتیبی، ساعت و تاریخ */
  {
    id: 'tr-l1-ordinals-time-date',
    title: 'اعداد ترتیبی، ساعت و تاریخ',
    subtitle: 'پسوند ترتیبی -(I)ncI، پرسیدن و گفتن ساعت، روزهای هفته و تاریخ',
    situation: 'طبقهٔ ساختمان، ساعت دقیق قرار ملاقات و تاریخ روز را می‌پرسید و بیان می‌کنید.',
    teachingFa: 'اعداد ترتیبی با پسوند -(ı)ncı / -(i)nci / -(u)ncu / -(ü)ncü ساخته می‌شوند: bir → birinci (اول)، iki → ikinci (دوم)، üç → üçüncü (سوم)، dört → dördüncü (چهارم، با نرمی t→d)، altı → altıncı (ششم). برای پرسیدن ساعت فعلی Saat kaç? (ساعت چند است؟) و برای زمان رخداد Saat kaçta? (در چه ساعتی؟) می‌گوییم: Saat üç buçuk (ساعت سه و نیم)، Saat dokuzda (در ساعت نه). برای نیم‌ساعت همراه با عدد از buçuk و به‌تنهایی از yarım استفاده می‌شود.',
    rows: [
      ['Ofisimiz binanın üçüncü katında.', 'دفتر ما در طبقهٔ سوم ساختمان است.', 'اوفیسیمیز بینانِین اوچونجو کاتِیندا', 'üçüncü', 'سوم', 'عدد + -(I)ncI = عدد ترتیبی'],
      ['Affedersiniz, şimdi saat kaç?', 'ببخشید، الان ساعت چند است؟', 'آفِّدَرسینیز، شیمدی ساعات کاچ', 'saat kaç', 'ساعت چند است؟'],
      ['Şimdi saat tam dört buçuk.', 'الان ساعت دقیقاً چهار و نیم است.', 'شیمدی ساعات تام دورت بوچوک', 'buçuk', 'و نیم (همراه ساعت)'],
      ['Toplantı saat kaçta başlıyor?', 'جلسه ساعت چند شروع می‌شود؟', 'توپلانتِی ساعات کاچتا باشلِییور', 'saat kaçta', 'در چه ساعتی؟', 'Saat kaç? ≠ Saat kaçta?'],
      ['Film saat sekizde başlıyor.', 'فیلم ساعت هشت شروع می‌شود.', 'فیلم ساعات سِکیزده باشلِییور', 'sekizde', 'در ساعت هشت'],
      ['Bugün günlerden Pazartesi.', 'امروز از روزهای هفته دوشنبه است.', 'بوگون گونلَردَن پازارتِسی', 'Pazartesi', 'دوشنبه'],
      ['Randevum yirmi bir Ekim Çarşamba günü.', 'نوبتم روز چهارشنبه بیست و یکم اکتبر است.', 'راندِووم ییرمی بیر اِکیم چار شامبا گونو', 'Çarşamba', 'چهارشنبه'],
      ['Sırada birinci kişi benim.', 'نفر اول در صف من هستم.', 'سِیرادا بیرینجی کیشی بِنیم', 'birinci', 'اول / یکم'],
    ],
    dialogue: [
      ['سارا', 'Ders yarın saat kaçta başlıyor?', 'درس فردا ساعت چند شروع می‌شود؟'],
      ['امره', 'Saat dokuz buçukta başlıyor.', 'ساعت نه و نیم شروع می‌شود.'],
      ['سارا', 'Sınıf kaçıncı katta?', 'کلاس طبقهٔ چندم است؟'],
      ['امره', 'Dördüncü katta, asansörün karşısında.', 'طبقهٔ چهارم، روبه‌روی آسانسور.'],
    ],
    checks: [
      {
        promptFa: 'کدام گزینه شکل درستِ «چهارم» در ترکی استانبولی است؟',
        choices: ['dörtinci', 'dördüncü', 'dörtüncü'],
        correctIndex: 1,
        explanationFa: 'در واژهٔ dört پیش از پسوند واکه‌دار -(ü)ncü حرف t به d نرم می‌شود: dördüncü.',
      },
      {
        promptFa: 'تفاوت «Saat kaç?» و «Saat kaçta?» چیست؟',
        choices: [
          'اولی «ساعت چند است؟» و دومی «در چه ساعتی؟» است',
          'اولی رسمی و دومی غیررسمی است',
          'هیچ تفاوتی در معنی ندارند',
        ],
        correctIndex: 0,
        explanationFa: 'پسوند -ta در saat kaçta معنی «در چه ساعتی» (زمان وقوع کار) می‌دهد.',
      },
    ],
  },

  /* ۲۲. مکان و موقعیت مکانی */
  {
    id: 'tr-l1-location-position',
    title: 'مکان و موقعیت مکانی',
    subtitle: 'واژه‌های اشارهٔ مکانی (burada / şurada / orada) و نسبت‌های مکانی (بالا، پایین، روبه‌رو، کنار)',
    situation: 'جای دقیق وسایل در اتاق یا مکان ساختمان‌ها در خیابان را توضیح می‌دهید.',
    teachingFa: 'از سه اشارهٔ bu / şu / o، سه قید مکان بسیار پرکاربرد ساخته می‌شود: burada (اینجا)، şurada (همان‌جا / آنجای نزدیک)، orada (آنجا). برای موقعیت دقیق اشیا و مکان‌ها از واژه‌های مکان‌نما در ترکیب ملکی استفاده می‌شود: üstünde (رویِ)، altında (زیرِ)، içinde (داخلِ)، önünde (جلویِ)، arkasında (پشتِ)، yanında (کنارِ)، karşısında (روبه‌رویِ) و arasında (بینِ). مثال: masanın üstünde (رویِ میز)، bankanın karşısında (روبه‌رویِ بانک).',
    rows: [
      ['Anahtarlar masanın üstünde duruyor.', 'کلیدها روی میز قرار دارند.', 'آناهتارلار ماسانِین اوستونده دورویور', 'üstünde', 'رویِ / بالایِ', 'اسم-(n)In + مکان‌نما-ndA'],
      ['Kedi koltuğun altında uyuyor.', 'گربه زیر مبل خوابیده است.', 'کِدی کولتوئون آلتِیندا اویویور', 'altında', 'زیرِ'],
      ['Eczane hastanenin tam karşısında.', 'داروخانه درست روبه‌روی بیمارستان است.', 'اَجزانه هاستانِنین تام کارشِیسِیندا', 'karşısında', 'روبه‌رویِ'],
      ['Otobüs durağı parkın yanında.', 'ایستگاه اتوبوس کنار پارک است.', 'اوتوبوس دورائِی پارکِین یانِیندا', 'yanında', 'کنارِ'],
      ['Pasaportum çantanın içinde.', 'گذرنامه‌ام داخل کیف است.', 'پاساپورتوم چانتانِین ایچینده', 'içinde', 'داخلِ / درونِ'],
      ['Araba binanın önünde bekliyor.', 'خودرو جلوی ساختمان منتظر است.', 'آرابا بینانِین اونونده بِکلییور', 'önünde', 'جلویِ'],
      ['Market, fırın ile bankanın arasında.', 'سوپرمارکت بین نانوایی و بانک است.', 'مارکَت، فِیرِین ایله بانکانِین آراسِیندا', 'arasında', 'بینِ / میانِ'],
      ['Ben buradayım, taksi şurada duruyor.', 'من اینجایم، تاکسی همان‌جا ایستاده است.', 'بَن بورادا‌یِیم، تاکسی شورادا دورویور', 'şurada', 'همان‌جا'],
    ],
    dialogue: [
      ['مریم', 'Gözlüğümü bulamıyorum, nerede acaba?', 'عینکم را پیدا نمی‌کنم، کجاست آیا؟'],
      ['سلین', 'Bilgisayarın yanında değil mi?', 'کنار رایانه نیست؟'],
      ['مریم', 'Hayır, burada yok.', 'نه، اینجا نیست.'],
      ['سلین', 'Bak, defterin üstünde duruyor!', 'ببین، روی دفتر قرار دارد!'],
    ],
    checks: [
      {
        promptFa: 'در جملهٔ «Eczane hastanenin karşısında»، داروخانه کجای بیمارستان است؟',
        choices: ['پشت بیمارستان', 'روبه‌روی بیمارستان', 'داخل بیمارستان'],
        correctIndex: 1,
        explanationFa: 'karşısında یعنی «در مقابل / روبه‌رویِ» و arkasında یعنی «پشتِ».',
      },
      {
        promptFa: 'کدام عبارت یعنی «داخلِ کیف»؟',
        choices: ['çantanın içinde', 'çantanın önünde', 'çantanın altında'],
        correctIndex: 0,
        explanationFa: 'içinde یعنی داخلِ، önünde جلویِ و altında زیرِ.',
      },
    ],
  },

  /* ۲۳. حالت مکانی (Bulunma Hâli) */
  {
    id: 'tr-l1-locative-case',
    title: 'حالت مکانی (Bulunma Hâli)',
    subtitle: 'پسوند -da / -de / -ta / -te به معنی «در / روی / نزدِ» و هماهنگی همخوان‌ها',
    situation: 'می‌گویید افراد یا وسایل در کدام مکان قرار دارند یا چه‌چیزی پیشِ چه کسی است.',
    teachingFa: 'حالت مکانی (Bulunma Hâli) چهار صورت دارد: -da / -de و پس از هشت همخوان بی‌واک «f, s, t, k, ç, ş, h, p» (معروف به Fıstıkçı Şahap) به شکل -ta / -te می‌آید: ev → evde (در خانه)، okul → okulda (در مدرسه)، park → parkta (در پارک)، sınıf → sınıfta (در کلاس)، iş → işte (سرِ کار)، mutfak → mutfakta (در آشپزخانه). روی ضمایر هم معنی «پیشِ / همراهِ» می‌دهد: bende (پیش من)، sende (پیش تو)، onda (پیش او، با میانجی n!). توجه: پسوند مکانی به کلمه می‌چسبد، اما واژهٔ ربطی da / de (هم / نیز) جدا نوشته می‌شود!',
    rows: [
      ['Annem şimdi evde dinleniyor.', 'مادرم الان در خانه استراحت می‌کند.', 'آننَم شیمدی اِوده دینلِنییور', 'evde', 'در خانه', 'واکه/همخوان واک‌دار → -da / -de'],
      ['Öğrenciler şu anda sınıfta.', 'دانش‌آموزان در حال حاضر در کلاس هستند.', 'اوئْرَنجیلَر شو آندا سِینِفتا', 'sınıfta', 'در کلاس (پس از f → -ta)', 'f,s,t,k,ç,ş,h,p → -ta / -te'],
      ['Babam bugün işte çok meşgul.', 'پدرم امروز سر کار خیلی پرمشغله است.', 'بابام بوگون ایشته چوک مَشگول', 'işte', 'در محل کار (پس از ş → -te)'],
      ['Çocuklar sokakta bisiklet sürüyor.', 'بچه‌ها در خیابان دوچرخه‌سواری می‌کنند.', 'چوجوکلار سوکاکتا بیسیکلَت سورویور', 'sokakta', 'در خیابان'],
      ['Yedek anahtar bende duruyor.', 'کلید یدک پیش من است.', 'یِدَک آناهتار بَنده دورویور', 'bende', 'پیش من / نزد من'],
      ['Benim kalemim onda kaldı.', 'خودکار من پیش او جا ماند.', 'بِنیم کالِمیم اوندا کالدِی', 'onda', 'پیش او (o + n + da)'],
      ['Kardeşim Ankara\'da üniversite okuyor.', 'برادرم/خواهرم در آنکارا دانشگاه می‌خواند.', 'کاردِشیم آنکارادا اونیوِرسیته اوکویور', "Ankara'da", 'در آنکارا (با آپوستروف)'],
      ['Toplantı saat ikide salonda.', 'جلسه ساعت دو در سالن است.', 'توپلانتِی ساعات ایکیده سالوندا', 'salonda', 'در سالن'],
    ],
    dialogue: [
      ['امره', 'Selam! Neredesin, evde misin?', 'سلام! کجایی، در خانه‌ای؟'],
      ['سارا', 'Hayır, evde değilim; şimdi kütüphanedeyim.', 'نه، خانه نیستم؛ الان در کتابخانه‌ام.'],
      ['امره', 'Ders notları sende mi?', 'جزوه‌های درس پیش توست؟'],
      ['سارا', 'Evet, hepsi çantamda.', 'بله، همه‌اش در کیفم است.'],
    ],
    checks: [
      {
        promptFa: 'کدام گزینه شکل درستِ «در آشپزخانه» (از واژهٔ mutfak) است؟',
        choices: ['mutfakda', 'mutfakta', 'mutfağda'],
        correctIndex: 1,
        explanationFa: 'چون mutfak به همخوان بی‌واک k ختم می‌شود، پسوند مکانی با t می‌آید: mutfakta.',
      },
      {
        promptFa: 'عبارت «onda» در جملهٔ «Kitap onda» به چه معنی است؟',
        choices: ['ده تا کتاب', 'پیشِ او / نزدِ او', 'از او'],
        correctIndex: 1,
        explanationFa: 'ضمیر o در حالت مکانی با حرف میانجی n شکل onda (پیشِ او / در آن) می‌گیرد.',
      },
    ],
  },

  /* ۲۴. حالت جهتی (Yönelme Hâli) */
  {
    id: 'tr-l1-dative-case',
    title: 'حالت جهتی (Yönelme Hâli)',
    subtitle: 'پسوند -(y)a / -(y)e برای «به / به سویِ» همراه با نرمی همخوان و تغییر ضمیرهای ben و sen',
    situation: 'مقصد حرکت خود یا فردی را که چیزی به او می‌دهید و می‌گویید مشخص می‌کنید.',
    teachingFa: 'حالت جهتی (Yönelme Hâli) با پسوند -a (پسین) و -e (پیشین) ساخته می‌شود و اگر کلمه به واکه ختم شود حرف میانجی y می‌گیرد: ev → eve (به خانه)، okul → okula (به مدرسه)، kafe → kafeye (به کافه)، hastane → hastaneye (به بیمارستان). دو نکتهٔ مهم: ۱) ضمیرهای اول و دوم شخص مفرد تغییر واکه دارند: ben → bana (به من)، sen → sana (به تو)، و در سوم‌شخص حرف میانجی n می‌آید: o → ona (به او). ۲) واژه‌های چندبخشیِ ختم‌شده به p, ç, t, k نرم می‌شوند: sokak → sokağa، mutfak → mutfağa، kitap → kitaba.',
    rows: [
      ['Sabah erkenden okula gidiyorum.', 'صبح زود به مدرسه/دانشگاه می‌روم.', 'ساباه اَرکَندَن اوکولا گیدییوروم', 'okula', 'به مدرسه', 'اسم + -(y)a / -(y)e'],
      ['Akşam birlikte sinemaya gidiyoruz.', 'عصر با هم به سینما می‌رویم.', 'آکشام بیرلیکته سینِمایا گیدییوروز', 'sinemaya', 'به سینما (با حرف میانجی y)'],
      ['Lütfen bana bir bardak su verin.', 'لطفاً به من یک لیوان آب بدهید.', 'لوتفَن بانا بیر بارداک سو وِرین', 'bana', 'به من (از ضمیر ben)', 'ben → bana · sen → sana · o → ona'],
      ['Sana önemli bir haberim var.', 'برای تو (به تو) خبر مهمی دارم.', 'سانا اونَملی بیر هابِریم وار', 'sana', 'به تو / برای تو'],
      ['Doktor hastaya ilaç yazıyor.', 'پزشک برای بیمار دارو می‌نویسد.', 'دوکتور هاستایا ایلاچ یازِییور', 'hastaya', 'به بیمار'],
      ['Annem mutfağa geçiyor.', 'مادرم به آشپزخانه می‌رود.', 'آننَم موتفائا گِچییور', 'mutfağa', 'به آشپزخانه (mutfak → mutfağa)'],
      ['Yarın sabah İzmir\'e uçuyoruz.', 'فردا صبح به ازمیر پرواز می‌کنیم.', 'یارِین ساباه ایزمیره اوچویوروز', "İzmir'e", 'به ازمیر'],
      ['Öğretmen tahtaya örnek cümle yazıyor.', 'معلم روی تخته جملهٔ نمونه می‌نویسد.', 'اوئْرِتمَن تاهتایا اورنَک جومله یازِییور', 'tahtaya', 'به/روی تخته'],
    ],
    dialogue: [
      ['سارا', 'Nereye gidiyorsun Deniz?', 'کجا می‌روی دنیز؟'],
      ['دنیز', 'Kütüphaneye gidiyorum, sonra da markete uğruyorum.', 'به کتابخانه می‌روم و بعد هم سری به سوپرمارکت می‌زنم.'],
      ['سارا', 'Bana da bir defter alır mısın?', 'برای من هم یک دفتر می‌خری؟'],
      ['دنیز', 'Tabii, sana güzel bir defter alırım.', 'البته، برایت یک دفتر خوب می‌خرم.'],
    ],
    checks: [
      {
        promptFa: 'شکل درستِ «به من» در ترکی استانبولی کدام است؟',
        choices: ['bene', 'bana', 'benye'],
        correctIndex: 1,
        explanationFa: 'ضمیر ben در حالت جهتی تغییر واکه می‌دهد و به شکل bana درمی‌آید (و sen → sana).',
      },
      {
        promptFa: 'کدام گزینه شکل درستِ «به بیمارستان» (از واژهٔ hastane) است؟',
        choices: ['hastanea', 'hastaneye', 'hastanede'],
        correctIndex: 1,
        explanationFa: 'hastane به واکهٔ پیشین e ختم می‌شود؛ پس حرف میانجی y و پسوند -e می‌گیرد: hastaneye.',
      },
    ],
  },

  /* ۲. حالت مبدأ (Ayrılma Hâli) */
  {
    id: 'tr-l1-ablative-case',
    title: 'حالت مبدأ (Ayrılma Hâli)',
    subtitle: 'پسوند -dan / -den / -tan / -ten برای «از» (مبدأ مکان، زمان، علت و افعال همراه با از)',
    situation: 'می‌گویید از کجا برمی‌گردید، از چه ساعتی کار می‌کنید یا از چه چیزی خوشتان می‌آید و می‌ترسید.',
    teachingFa: 'حالت مبدأ (Ayrılma Hâli) با پسوند -dan / -den و پس از همخوان‌های بی‌واک «f, s, t, k, ç, ş, h, p» با -tan / -ten ساخته می‌شود: evden (از خانه)، okuldan (از مدرسه)، işten (از سرِ کار)، marketten (از سوپرمارکت)، sınıftan (از کلاس). علاوه بر مکان، برخی افعال مهم هم متمم با -dan/-den می‌گیرند: hoşlanmak (خوش آمدن از)، korkmak (ترسیدن از) و nefret etmek (متنفر بودن از). همچنین الگوی «... -dan ... -a kadar» معنی «از ... تا ...» می‌دهد: sabahtan akşama kadar.',
    rows: [
      ['Saat altıda işten çıkıyorum.', 'ساعت شش از سرِ کار بیرون می‌آیم.', 'ساعات آلتِیدا ایشتَن چِیکِییوروم', 'işten', 'از سر کار (پس از ş → -ten)', 'f,s,t,k,ç,ş,h,p → -tan / -ten'],
      ['Az önce marketten döndüm.', 'کمی پیش از سوپرمارکت برگشتم.', 'آز اونجه مارکَتّه‌ن دوندوم', 'marketten', 'از سوپرمارکت'],
      ['Bu tren Ankara\'dan geliyor.', 'این قطار از آنکارا می‌آید.', 'بو ترَن آنکارادان گِلییور', "Ankara'dan", 'از آنکارا'],
      ['Sabahtan akşama kadar çalışıyoruz.', 'از صبح تا شب کار می‌کنیم.', 'ساباهتان آکشاما کادار چالِیشِییوروز', 'sabahtan', 'از صبح', '-dAn ... -(y)A kadar = از ... تا ...'],
      ['Klasik müzikten çok hoşlanıyorum.', 'از موسیقی کلاسیک خیلی خوشم می‌آید.', 'کلاسیک موزیکتَن چوک هوشلانِییوروم', 'hoşlanıyorum', 'خوشم می‌آید (+ -dan/-den)'],
      ['Küçük çocuk karanlıktan korkuyor.', 'کودک کوچک از تاریکی می‌ترسد.', 'کوچوک چوجوک کارانلِیکتان کورکویور', 'karanlıktan', 'از تاریکی'],
      ['Senden küçük bir ricam var.', 'از تو یک خواهش کوچک دارم.', 'سَندَن کوچوک بیر ریجام وار', 'senden', 'از تو'],
      ['Uçaktan şimdi iniyoruz.', 'الان داریم از هواپیما پیاده می‌شویم.', 'اوچاکتان شیمدی اینییوروز', 'uçaktan', 'از هواپیما'],
    ],
    dialogue: [
      ['علی', 'Nereden geliyorsun Meryem?', 'از کجا می‌آیی مریم؟'],
      ['مریم', 'Üniversiteden geliyorum, şimdi eve gidiyorum.', 'از دانشگاه می‌آیم، الان به خانه می‌روم.'],
      ['علی', 'Yorgun görünüyor musun? Sabahtan beri derste misin?', 'خسته به نظر می‌رسی؛ از صبح سر کلاس بودی؟'],
      ['مریم', 'Evet, saat sekizden beri dersteyim.', 'بله، از ساعت هشت سر کلاس هستم.'],
    ],
    checks: [
      {
        promptFa: 'کدام گزینه شکل درستِ «از کلاس» (واژهٔ sınıf) است؟',
        choices: ['sınıfdan', 'sınıftan', 'sınıften'],
        correctIndex: 1,
        explanationFa: 'آخرین واکهٔ sınıf حرف ı (پسین) و آخرین همخوان f (بی‌واک) است؛ بنابراین پسوند -tan می‌گیرد: sınıftan.',
      },
      {
        promptFa: 'فعل «hoşlanmak» (خوش آمدن از چیزی) متمم خود را با کدام پسوند می‌گیرد؟',
        choices: ['پسوند مبدأ (-dan / -den / -tan / -ten)', 'پسوند مکانی (-da / -de)', 'بدون هیچ پسوندی'],
        correctIndex: 0,
        explanationFa: 'در ترکی همانند فارسی «از چیزی خوشم می‌آید» گفته می‌شود: müzikten hoşlanıyorum.',
      },
    ],
  },

  /* ۲۶. حالت مفعولی (Belirtme Hâli) */
  {
    id: 'tr-l1-accusative-case',
    title: 'حالت مفعولی (Belirtme Hâli)',
    subtitle: 'پسوند -(y)ı / -(y)i / -(y)u / -(y)ü برای مفعول مشخص در برابر مفعول نامشخص («را» در فارسی)',
    situation: 'تفاوت میان «کتاب می‌خوانم» و «این کتاب را می‌خوانم» را در جمله‌های دقیق روزمره به کار می‌برید.',
    teachingFa: 'حالت مفعولی در ترکی شباهت بسیار زیادی به نشانهٔ «را» در فارسی دارد! وقتی مفعول کلی یا نامشخص است پسوند نمی‌گیرد: Kitap okuyorum (کتاب می‌خوانم)؛ Bir elma yiyorum (یک سیب می‌خورم). اما وقتی مفعول مشخص و معین است (با bu/şu/o، ضمیر، نام خاص، پسوند ملکی، یا اشاره‌شده در بافت) پسوند چهارگانهٔ -(y)ı / -(y)i / -(y)u / -(y)ü می‌گیرد: Bu kitabı okuyorum (این کتاب را می‌خوانم)، Kapıyı kapatıyorum (در را می‌بندم)، Seni bekliyorum (منتظر تو هستم = تو را منتظرم)، İstanbul\'u çok seviyorum (استانبول را خیلی دوست دارم).',
    rows: [
      ['Her akşam kitap okuyorum.', 'هر شب کتاب می‌خوانم. (کلی و نامشخص)', 'هَر آکشام کیتاپ اوکویوروم', 'kitap', 'کتاب (مفعول نامشخص بدون پسوند)'],
      ['Şimdi bu kitabı okuyorum.', 'الان این کتاب را می‌خوانم. (مشخص)', 'شیمدی بو کیتابِی اوکویوروم', 'kitabı', 'کتاب را (kitap → kitabı)', 'مفعول مشخص + -(y)I = «را»'],
      ['Lütfen pencereyi açar mısınız?', 'لطفاً پنجره را باز می‌کنید؟', 'لوتفَن پَنجِرِیی آچار مِیسِینِیز', 'pencereyi', 'پنجره را (با میانجی y)'],
      ['Seni istasyonun önünde bekliyorum.', 'جلوی ایستگاه منتظر تو هستم.', 'سِنی ایستاسیونون اونونده بِکلییوروم', 'seni', 'تو را'],
      ['İstanbul\'u çok seviyoruz.', 'ما استانبول را خیلی دوست داریم.', 'ایستانبولو چوک سِوییوروز', "İstanbul'u", 'استانبول را'],
      ['Garson masayı temizliyor.', 'گارسون میز را تمیز می‌کند.', 'گارسون ماسایِی تِمیزلییور', 'masayı', 'میز را'],
      ['Annem akşam yemeğini hazırlıyor.', 'مادرم شام را آماده می‌کند.', 'آننَم آکشام یِمَئینی هازِیرلِییور', 'yemeğini', 'غذایش را (با میانجی n پس از ملکی)'],
      ['Telefonumu hiçbir yerde bulamıyorum.', 'تلفنم را هیچ‌جا پیدا نمی‌کنم.', 'تِلِفونومو هیچ‌بیر یَرده بولامِییوروم', 'telefonumu', 'تلفنم را'],
    ],
    dialogue: [
      ['مریم', 'Ne arıyorsun Emre?', 'دنبال چه می‌گردی امره؟'],
      ['امره', 'Mavi dosyamı arıyorum, gördün mü?', 'دنبال پوشهٔ آبی‌ام می‌گردم، دیدی‌اش؟'],
      ['مریم', 'Evet, dosyayı toplantı masasında gördüm.', 'بله، پوشه را روی میز جلسه دیدم.'],
    ],
    checks: [
      {
        promptFa: 'تفاوت «Kahve içiyorum» و «Kahveyi içiyorum» چیست؟',
        choices: [
          'اولی «قهوه می‌نوشم» (کلی) و دومی «قهوه را می‌نوشم» (قهوهٔ مشخص) است',
          'اولی زمان حال و دومی زمان گذشته است',
          'اولی مفرد و دومی جمع است',
        ],
        correctIndex: 0,
        explanationFa: 'پسوند -(y)i در kahveyi نشان‌دهندهٔ مفعول مشخص (معادل «را» در فارسی) است.',
      },
      {
        promptFa: 'شکل درستِ مفعول مشخص برای واژهٔ «kapı» (در را) کدام است؟',
        choices: ['kapıı', 'kapıyı', 'kapını'],
        correctIndex: 1,
        explanationFa: 'وقتی اسم بدون پسوند ملکی به واکه ختم شود، در حالت مفعولی حرف میانجی y می‌گیرد: kapıyı.',
      },
    ],
  },

  /* ۲۷. علایق، خواسته‌ها و نیازهای ساده */
  {
    id: 'tr-l1-likes-wants-needs',
    title: 'علایق، خواسته‌ها و نیازهای ساده',
    subtitle: 'بیان علاقه با sevmek، خواسته با istemek و نیاز با lazım / ihtiyacım var',
    situation: 'دربارهٔ سرگرمی‌های موردعلاقه، کارهایی که می‌خواهید انجام دهید و چیزهایی که نیاز دارید صحبت می‌کنید.',
    teachingFa: 'سه الگوی بسیار کاربردی برای بیان علاقه، خواسته و نیاز: ۱) علاقه: مصدر با -mak/-mek + seviyorum برای فعالیت‌ها (Yüzmek seviyorum یا رایج‌تر با حالت مفعولیِ اسم‌مصدر: Yüzmeyi seviyorum = شنا کردن را دوست دارم؛ Müziği seviyorum). ۲) خواسته: اسم یا مصدر (-mak/-mek) + istiyorum: Bir çay istiyorum (یک چای می‌خواهم)، Dinlenmek istiyorum (می‌خواهم استراحت کنم). ۳) نیاز: Bana ... lazım (به ... نیاز دارم / برایم لازم است) یا الگوی رسمی‌تر ...-(y)a ihtiyacım var (به ... احتیاج دارم): Yardıma ihtiyacım var.',
    rows: [
      ['Sabahları yürümeyi çok seviyorum.', 'پیاده‌رویِ صبحگاهی را خیلی دوست دارم.', 'ساباهلارِی یورومِیی چوک سِوییوروم', 'yürümeyi', 'راه رفتن / پیاده‌روی را', 'اسم‌مصدر (-mAyI) + seviyorum'],
      ['Kardeşim futbol oynamayı seviyor.', 'برادرم فوتبال بازی کردن را دوست دارد.', 'کاردِشیم فوتبال اوینامایِی سِوییور', 'oynamayı', 'بازی کردن را'],
      ['Şimdi sıcak bir çorba istiyorum.', 'الان یک سوپ داغ می‌خواهم.', 'شیمدی سِیجاک بیر چوربا ایستییوروم', 'istiyorum', 'می‌خواهم'],
      ['Hafta sonu erken uyumak istiyorum.', 'آخر هفته می‌خواهم زود بخوابم.', 'هافتا سونو اَرکَن اویوماک ایستییوروم', 'uyumak', 'خوابیدن', 'مصدر (-mAk) + istiyorum'],
      ['Bana temiz bir kağıt ve kalem lazım.', 'یک کاغذ تمیز و خودکار لازم دارم.', 'بانا تِمیز بیر کائِیت وِ کالَم لازِیم', 'lazım', 'لازم است'],
      ['Şu anda biraz sessizliğe ihtiyacım var.', 'الان به کمی سکوت احتیاج دارم.', 'شو آندا بیراز سَس‌سیزلیئه ایهتییاجِیم وار', 'ihtiyacım var', 'احتیاج دارم', '-(y)A ihtiyacım var'],
      ['Kalabalık yerleri pek sevmiyorum.', 'جاهای شلوغ را چندان دوست ندارم.', 'کالابالِیک یَرلِری پَک سَومییوروم', 'sevmiyorum', 'دوست ندارم'],
      ['Bu konuda senin fikrine ihtiyacımız var.', 'در این موضوع به نظر تو نیاز داریم.', 'بو کونودا سِنین فیکرینه ایهتییاجِیمِیز وار', 'fikrine', 'به نظرت'],
    ],
    dialogue: [
      ['سلین', 'Boş zamanlarında ne yapmayı seviyorsun?', 'در اوقات فراغتت چه کاری را دوست داری؟'],
      ['سارا', 'Fotoğraf çekmeyi ve yeni kafeler keşfetmeyi seviyorum.', 'عکاسی کردن و کشف کافه‌های جدید را دوست دارم.'],
      ['سلین', 'Harika! Şimdi bir kahve içmek istiyor musun?', 'عالیه! الان می‌خواهی یک قهوه بنوشی؟'],
      ['سارا', 'Evet, gerçekten bir kahveye ihtiyacım var!', 'بله، واقعاً به یک قهوه نیاز دارم!'],
    ],
    checks: [
      {
        promptFa: 'کدام جمله یعنی «می‌خواهم استراحت کنم»؟',
        choices: ['Dinlenmek istiyorum.', 'Dinlenmeyi lazım.', 'Dinlenmek var.'],
        correctIndex: 0,
        explanationFa: 'پیش از فعل istiyorum فعلِ قبلی به شکل مصدر کامل (-mak / -mek) می‌آید: Dinlenmek istiyorum.',
      },
      {
        promptFa: 'در الگوی «... ihtiyacım var» واژهٔ پیش از آن چه پسوندی می‌گیرد؟',
        choices: ['پسوند مبدأ (-dan/-den)', 'پسوند جهتی (-(y)a / -(y)e)', 'پسوند جمع (-lar/-ler)'],
        correctIndex: 1,
        explanationFa: 'در ترکی دقیقاً مانند فارسی «به چیزی احتیاج داشتن» با پسوند جهتی بیان می‌شود: yardıma ihtiyacım var.',
      },
    ],
  },

  /* ۲۸. توانایی و ناتوانی (-abil / -ebil) */
  {
    id: 'tr-l1-ability-inability',
    title: 'توانایی و ناتوانی (-abil / -ebil)',
    subtitle: 'ساخت «می‌توانم» با -(y)abil / -(y)ebil و تفاوت حیاتی آن با ناتوانی -(y)amıyor / -(y)emiyor',
    situation: 'دربارهٔ مهارت‌های خود صحبت می‌کنید، امکان انجام کاری را می‌سنجید یا می‌گویید چرا نمی‌توانید کاری را انجام دهید.',
    teachingFa: 'برای بیان توانایی و امکان، پسوند -(y)abil (پس از واکهٔ پسین) یا -(y)ebil (پس از واکهٔ پیشین) به ریشهٔ فعل می‌چسبد؛ توجه کنید که جز bil همیشه ثابت با i است و تغییر واکه نمی‌دهد: yüz-ebil-iyor-um (می‌توانم شنا کنم)، konuş-abil-iyor-um (می‌توانم صحبت کنم)، oku-y-abil-iyor (می‌تواند بخواند). نکتهٔ بسیار مهم در شکل منفی (ناتوانی): در منفی، bil حذف می‌شود و فقط -(y)a / -(y)e پیش از منفی باقی می‌ماند! مقایسه کنید: gelmiyor (نمی‌آید) اما gelemiyor (نمی‌تواند بیاید)؛ açmıyor (باز نمی‌کند) اما açamıyor (نمی‌تواند باز کند)!',
    rows: [
      ['Ben artık Türkçe konuşabiliyorum.', 'من دیگر می‌توانم ترکی صحبت کنم.', 'بَن آرتِیک تورکچه کونوشابیلییوروم', 'konuşabiliyorum', 'می‌توانم صحبت کنم', 'ریشه + -(y)Abil + زمان'],
      ['Kardeşim çok iyi yüzebiliyor.', 'برادرم/خواهرم خیلی خوب می‌تواند شنا کند.', 'کاردِشیم چوک ایی یوزِبیلییور', 'yüzebiliyor', 'می‌تواند شنا کند'],
      ['Bu tabelayı uzaktan okuyabiliyor musun?', 'آیا می‌توانی این تابلو را از دور بخوانی؟', 'بو تابِلایِی اوزاکتان اوکویابیلییور موسون', 'okuyabiliyor', 'می‌تواند بخواند (با میانجی y)'],
      ['Üzgünüm, bu akşam toplantıya gelemiyorum.', 'متأسفم، امشب نمی‌توانم به جلسه بیایم.', 'اوزگونوم، بو آکشام توپلانتِییا گِلِمییوروم', 'gelemiyorum', 'نمی‌توانم بیایم', 'ناتوانی: ریشه + -(y)AmIyor'],
      ['Gürültüden seni hiç duyamıyorum.', 'از سروصدا اصلاً نمی‌توانم صدایت را بشنوم.', 'گورولتودَن سِنی هیچ دویامِییوروم', 'duyamıyorum', 'نمی‌توانم بشنوم'],
      ['Anahtarsız bu kapıyı açamıyoruz.', 'بدون کلید نمی‌توانیم این در را باز کنیم.', 'آناهتارسِیز بو کاپِییِی آچامِییوروز', 'açamıyoruz', 'نمی‌توانیم باز کنیم'],
      ['Yarın bana yardım edebilir misiniz?', 'آیا فردا می‌توانید به من کمک کنید؟', 'یارِین بانا یاردِیم اِدِبیلیر میسینیز', 'edebilir misiniz', 'آیا می‌توانید انجام دهید؟'],
      ['Burada kredi kartıyla ödeyebiliyoruz.', 'اینجا می‌توانیم با کارت بانکی پرداخت کنیم.', 'بورادا کرِدی کارتِییلا اودِیِبیلییوروز', 'ödeyebiliyoruz', 'می‌توانیم پرداخت کنیم'],
    ],
    dialogue: [
      ['امره', 'Alo Sara! Sesim geliyor mu? Seni pek duyamıyorum.', 'الو سارا! صدایم می‌آید؟ چندان نمی‌توانم صدایت را بشنوم.'],
      ['سارا', 'Şimdi metrodayım, o yüzden rahat konuşamıyorum.', 'الان در مترو هستم، به همین خاطر نمی‌توانم راحت صحبت کنم.'],
      ['امره', 'Tamam, on dakika sonra arayabilir misin?', 'باشه، می‌توانی ده دقیقهٔ دیگر زنگ بزنی؟'],
      ['سارا', 'Tabii, inince hemen arıyorum.', 'البته، به‌محض پیاده‌شدن زنگ می‌زنم.'],
    ],
    checks: [
      {
        promptFa: 'تفاوت «gelmiyorum» و «gelemiyorum» چیست؟',
        choices: [
          'gelmiyorum یعنی «نمی‌آیم» و gelemiyorum یعنی «نمی‌توانم بیایم»',
          'هر دو دقیقاً به معنی «نمی‌آیم» هستند',
          'gelemiyorum شکل پرسشی است',
        ],
        correctIndex: 0,
        explanationFa: 'واکهٔ e پیش از -miyor در gelemiyorum نشانهٔ ناتوانی («نمی‌توانم بیایم») است.',
      },
      {
        promptFa: 'کدام گزینه شکل درست برای «می‌توانم صحبت کنم» در زمان حال استمراری است؟',
        choices: ['konuşebiliyorum', 'konuşabiliyorum', 'konuşabülüyorum'],
        correctIndex: 1,
        explanationFa: 'پس از واکهٔ پسین u در konuş-، جزء -abil می‌آید و واکهٔ i در bil همیشه ثابت می‌ماند: konuşabiliyorum.',
      },
    ],
  },

  /* ۲۹. حروف اضافه و ساختارهای مکانی پایه */
  {
    id: 'tr-l1-postpositions-spatial',
    title: 'حروف اضافه و ساختارهای مکانی پایه',
    subtitle: 'پس‌اضافه‌های ترکی (için / ile / kadar / sonra / önce / göre) پس از اسم و ضمیر',
    situation: 'همراهی، ابزار، هدف، محدودهٔ مکانی و ترتیب زمانی کارها را با پس‌اضافه‌های طبیعی ترکی بیان می‌کنید.',
    teachingFa: 'برخلاف فارسی و انگلیسی که «حرف اضافه» پیش از اسم می‌آید، در ترکی «پس‌اضافه» (Edat) پس از اسم قرار می‌گیرد! ۱) بدون پسوند حالت روی اسم عادی: için (برایِ: Ayşe için)، ile یا شکل چسبیدهٔ -(y)la / -(y)le (با / به‌وسیلهٔ: trenle، arkadaşlarımla؛ اما با ضمایر ملکی می‌شود: benim için، seninle، onunla). ۲) همراه با حالت جهتی -(y)a/-(y)e: kadar (تا: eve kadar)، göre (به نظرِ / طبقِ: bana göre). ۳) همراه با حالت مبدأ -dan/-den: önce (قبل از: dersten önce) و sonra (بعد از: yemekten sonra).',
    rows: [
      ['Bu çiçeği annem için alıyorum.', 'این گل را برای مادرم می‌خرم.', 'بو چیچَئی آننَم ایچین آلِییوروم', 'için', 'برایِ', 'اسم + için / ضمیر ملکی + için (benim için)'],
      ['Her gün işe metroyla gidiyorum.', 'هر روز با مترو سر کار می‌روم.', 'هَر گون ایشه مِترویلا گیدییوروم', 'metroyla', 'با مترو (metro + ile)'],
      ['Akşam seninle yürümek istiyorum.', 'عصر می‌خواهم با تو قدم بزنم.', 'آکشام سِنینله یورومَک ایستییوروم', 'seninle', 'با تو'],
      ['İstasyona kadar birlikte yürüyoruz.', 'تا ایستگاه با هم پیاده می‌رویم.', 'ایستاسیونا کادار بیرلیکته یورویوروز', 'kadar', 'تا (همراه با -(y)a / -(y)e)', 'مکان-(y)A kadar = تا ...'],
      ['Dersten sonra kafede buluşuyoruz.', 'بعد از درس در کافه همدیگر را می‌بینیم.', 'دَرستَن سونرا کافِده بولوشویوروز', 'sonra', 'بعد از (همراه با -dan/-den)'],
      ['Yolculuktan önce bavulumu hazırlıyorum.', 'پیش از سفر چمدانم را آماده می‌کنم.', 'یولجولوکتان اونجه باوولومو هازِیرلِییوروم', 'önce', 'قبل از / پیش از'],
      ['Bana göre bu plan çok mantıklı.', 'به نظر من این برنامه خیلی منطقی است.', 'بانا گوره بو پلان چوک مانتِیکلِی', 'bana göre', 'به نظر من'],
      ['Sahil boyunca yavaş yavaş yürüyoruz.', 'در امتداد ساحل آرام‌آرام قدم می‌زنیم.', 'ساهیل بویونجا یاواش یاواش یورویوروز', 'boyunca', 'در طولِ / در امتدادِ'],
    ],
    dialogue: [
      ['دنیز', 'Dersten sonra ne yapıyorsun?', 'بعد از کلاس چه کار می‌کنی؟'],
      ['مریم', 'Sara ile sahile kadar yürüyoruz. Sen de gelir misin?', 'با سارا تا ساحل پیاده می‌رویم. تو هم می‌آیی؟'],
      ['دنیز', 'Benim için harika olur! Saat beşte çıkalım.', 'برای من عالی می‌شود! ساعت پنج راه بیفتیم.'],
    ],
    checks: [
      {
        promptFa: 'کدام عبارت برای گفتن «برای من» در ترکی استانبولی درست است؟',
        choices: ['ben için', 'benim için', 'bana için'],
        correctIndex: 1,
        explanationFa: 'پس‌اضافهٔ için با ضمایر شخصیِ مفرد و اول/دوم جمع، شکل ملکی می‌گیرد: benim için، senin için، bizim için.',
      },
      {
        promptFa: 'پیش از پس‌اضافهٔ «sonra» (به معنی بعد ازِ ...) اسم چه پسوندی می‌گیرد؟',
        choices: ['پسوند مبدأ (-dan / -den / -tan / -ten)', 'پسوند مفعولی (-(y)ı / -(y)i)', 'هیچ پسوندی نمی‌گیرد'],
        correctIndex: 0,
        explanationFa: 'در ترکی پیش از önce و sonra پسوند مبدأ می‌آید: dersten sonra (بعد از درس)، yemekten önce (قبل از غذا).',
      },
    ],
  },

  /* ۳۰. برنامه روزانه و عادت‌ها */
  {
    id: 'tr-l1-daily-routine-habits',
    title: 'برنامه روزانه و عادت‌ها',
    subtitle: 'بیان روتین از صبح تا شب همراه با قیدهای تکرار (her gün / genellikle / bazen / asla)',
    situation: 'برنامهٔ عادی یک روز کاری یا تحصیلی خود را مرحله‌به‌مرحله با قیدهای تکرار شرح می‌دهید.',
    teachingFa: 'برای توصیف برنامهٔ روزانه در سطح A1 از قیدهای تکرار و توالی بهره ببرید: her gün (هر روز)، sabahları (صبح‌ها)، genellikle (معمولاً)، sık sık (اغلب / زیاد)، bazen (گاهی)، nadiren (به‌ندرت) و hiç / asla (هرگز — با فعل منفی!). برای ترتیب کارها نیز önce (اول)، sonra (بعد) و daha sonra / ondan sonra (سپس / بعد از آن) جمله‌ها را روان به هم وصل می‌کنند.',
    rows: [
      ['Hafta içi her gün saat yedide kalkıyorum.', 'روزهای کاری هر روز ساعت هفت بیدار می‌شوم.', 'هافتا ایچی هَر گون ساعات یِدیده کالکِییوروم', 'hafta içi', 'طول هفته / روزهای کاری'],
      ['Önce elimi yüzümü yıkıyorum ve giyiniyorum.', 'اول دست و صورتم را می‌شویم و لباس می‌پوشم.', 'اونجه اِلیمی یوزومو یِیکِییوروم وِ گییینییوروم', 'giyiniyorum', 'لباس می‌پوشم'],
      ['Genellikle evde hafif bir kahvaltı yapıyorum.', 'معمولاً در خانه صبحانهٔ سبکی می‌خورم.', 'گِنَل‌لیکله اِوده هافیف بیر کاهوالتِی یاپِییوروم', 'genellikle', 'معمولاً', 'قید تکرار + مکان + فعل'],
      ['Saat sekiz buçukta evden çıkıyorum.', 'ساعت هشت و نیم از خانه بیرون می‌زنم.', 'ساعات سِکیز بوچوکتا اِودَن چِیکِییوروم', 'çıkıyorum', 'خارج می‌شوم / بیرون می‌روم'],
      ['Öğlen iş arkadaşlarımla yemek yiyorum.', 'ظهر با همکارانم ناهار می‌خورم.', 'اوئلَن ایش آرکاداشلارِیملا یِمَک یییوروم', 'öğlen', 'ظهر / هنگام ناهار'],
      ['Bazen akşamüstü spor salonuna gidiyorum.', 'گاهی عصرها به باشگاه ورزشی می‌روم.', 'بازَن آکشام‌اوستو سپور سالونونا گیدییوروم', 'bazen', 'گاهی'],
      ['Gece geç saatte asla kahve içmiyorum.', 'شب دیروقت هرگز قهوه نمی‌نوشم.', 'گِجه گَچ ساعاتّه آسلا کاهوه ایچمییوروم', 'asla', 'هرگز (همراه فعل منفی)'],
      ['Genellikle saat on birde uyuyorum.', 'معمولاً ساعت یازده می‌خوابم.', 'گِنَل‌لیکله ساعات اون بیرده اویویوروم', 'uyuyorum', 'می‌خوابم'],
    ],
    dialogue: [
      ['جان', 'Sabahları erken mi uyanıyorsun?', 'صبح‌ها زود بیدار می‌شوی؟'],
      ['سارا', 'Evet, genellikle yedi buçukta uyanıyorum. Ya sen?', 'بله، معمولاً هفت و نیم بیدار می‌شوم. تو چطور؟'],
      ['جان', 'Hafta içi erken kalkıyorum ama Pazar günü geç uyanıyorum.', 'طول هفته زود بلند می‌شوم اما یکشنبه‌ها دیر بیدار می‌شوم.'],
    ],
    checks: [
      {
        promptFa: 'کدام واژه به معنی «معمولاً» در توصیف عادت‌های روزانه است؟',
        choices: ['bazen', 'genellikle', 'nadiren'],
        correctIndex: 1,
        explanationFa: 'genellikle یعنی «معمولاً»، bazen یعنی «گاهی» و nadiren یعنی «به‌ندرت».',
      },
      {
        promptFa: 'واژهٔ «asla» (هرگز) در ترکی استانبولی با چه نوع فعلی به کار می‌رود؟',
        choices: ['با فعل منفی (مانند asla içmiyorum)', 'فقط با فعل مثبت', 'فقط در جمله‌های امری'],
        correctIndex: 0,
        explanationFa: 'در ترکی همانند فارسی («هرگز نمی‌نوشم»)، قیدهای هیچ/هرگز (hiç / asla) با فعل منفی می‌آیند.',
      },
    ],
  },

  /* ۳۱. حروف ربط پایه (Ve / Ama / Çünkü / Veya) */
  {
    id: 'tr-l1-conjunctions',
    title: 'حروف ربط پایه (Ve / Ama / Çünkü / Veya)',
    subtitle: 'پیوند دادن واژه‌ها و جمله‌ها با «و، اما، چون، یا» به همراه bu yüzden و hem ... hem ...',
    situation: 'به‌جای جمله‌های بریده و جدا، دو فکر را با رابطهٔ هم‌پایگی، تضاد، علت یا انتخاب به هم وصل می‌کنید.',
    teachingFa: 'چهار حرف ربط اصلی A1 عبارت‌اند از: ve (و)، ama / fakat (اما / ولی)، çünkü (چون / زیرا — دلیل را بیان می‌کند) و veya / ya da (یا — بین گزینه‌ها). در کنار çünkü، عبارت bu yüzden یا o yüzden به معنی «به همین دلیل / بنابراین» نتیجه را بیان می‌کند: Hava yağmurlu, bu yüzden şemsiye alıyorum. همچنین الگوی de / da (جدا از کلمه) معنی «هم» می‌دهد.',
    rows: [
      ['Sabah çay içiyorum ve gazete okuyorum.', 'صبح چای می‌نوشم و روزنامه می‌خوانم.', 'ساباه چای ایچییوروم وِ گازِته اوکویوروم', 've', 'و'],
      ['Bu ev biraz küçük ama çok kullanışlı.', 'این خانه کمی کوچک است اما بسیار کاربردی است.', 'بو اِو بیراز کوچوک آما چوک کوللانِیشلِی', 'ama', 'اما / ولی', 'جملهٔ ۱ + ama + جملهٔ ۲'],
      ['Bugün erken yatıyorum çünkü çok yorgunum.', 'امروز زود می‌خوابم چون خیلی خسته‌ام.', 'بوگون اَرکَن یاتِییوروم چونکو چوک یورگونوم', 'çünkü', 'چون / زیرا', 'نتیجه + çünkü + علت'],
      ['Kahvaltıda çay veya portakal suyu içiyorum.', 'در صبحانه چای یا آب‌پرتقال می‌نوشم.', 'کاهوالتِیدا چای وِیا پورتاکال سویو ایچییوروم', 'veya', 'یا'],
      ['Otobüsle ya da metroyla gidebiliriz.', 'می‌توانیم با اتوبوس یا با مترو برویم.', 'اوتوبوسله یا دا مِترویلا گیدِبیلیریز', 'ya da', 'یا / و یا'],
      ['Dışarıda yağmur yağıyor, bu yüzden taksi çağırıyoruz.', 'بیرون باران می‌بارد، به همین دلیل تاکسی خبر می‌کنیم.', 'دِیشارِیدا یائْمور یائِییور، بو یوزدَن تاکسی چائِیرِییوروز', 'bu yüzden', 'به همین دلیل'],
      ['Selin hem çalışıyor hem üniversitede okuyor.', 'سلین هم کار می‌کند و هم در دانشگاه درس می‌خواند.', 'سِلین هَم چالِیشِییور هَم اونیوِرسیتِده اوکویور', 'hem', 'هم (در الگوی hem ... hem)'],
      ['Türkçe öğrenmek istiyorum ama vaktim az.', 'می‌خواهم ترکی یاد بگیرم اما وقتم کم است.', 'تورکچه اوئْرَنمَک ایستییوروم آما واکتیم آز', 'vaktim az', 'وقتم کم است'],
    ],
    dialogue: [
      ['مریم', 'Akşam konsere geliyor musun?', 'عصر به کنسرت می‌آیی؟'],
      ['امره', 'Çok istiyorum ama bu akşam gelemiyorum çünkü misafirim var.', 'خیلی دلم می‌خواهد اما امشب نمی‌توانم بیایم چون مهمان دارم.'],
      ['مریم', 'Anlıyorum. Cumartesi veya Pazar buluşalım mı?', 'می‌فهمم. شنبه یا یکشنبه همدیگر را ببینیم؟'],
      ['امره', 'Cumartesi harika olur!', 'شنبه عالی می‌شود!'],
    ],
    checks: [
      {
        promptFa: 'در جملهٔ «Erken yatıyorum ... çok yorgunum» کدام حرف ربط مناسب است؟',
        choices: ['veya', 'çünkü', 'ya da'],
        correctIndex: 1,
        explanationFa: 'جملهٔ دوم علتِ زود خوابیدن را می‌گوید؛ پس çünkü (چون / زیرا) درست است.',
      },
      {
        promptFa: 'کدام دو واژه در ترکی هر دو برای بیان انتخاب به معنی «یا» به کار می‌روند؟',
        choices: ['ve / ama', 'veya / ya da', 'çünkü / bu yüzden'],
        correctIndex: 1,
        explanationFa: 'هم veya و هم ya da به معنی «یا» بین دو گزینه به کار می‌روند.',
      },
    ],
  },

  /* ۳۲. ساختارهای ساده درخواست، اجازه و دستور */
  {
    id: 'tr-l1-requests-permission-imperative',
    title: 'ساختارهای ساده درخواست، اجازه و دستور',
    subtitle: 'امری مفرد و رسمی (-ın/-in)، امری منفی (-ma/-me)، درخواست مؤدبانه و اجازه‌گرفتن',
    situation: 'در کلاس، تاکسی یا فروشگاه چیزی را مؤدبانه درخواست می‌کنید، اجازه می‌گیرید یا راهنمایی ساده می‌دهید.',
    teachingFa: 'چهار پله از دستور ساده تا درخواست بسیار مؤدبانه در ترکی: ۱) امر خودمانی (تو): همان ریشهٔ فعل است (Gel! بیا، Bak! ببین). ۲) امر محترمانه/جمع (شما): ریشه + -(y)ın / -(y)in / -(y)un / -(y)ün (Lütfen oturun لطفاً بنشینید، Bekleyin صبر کنید). ۳) نهی (امری منفی): ریشه + -ma / -me (Geç kalma! دیر نکن!، Endişelenmeyin نگران نباشید). ۴) درخواست مؤدبانه و اجازه: با زمان گسترده + پرسش (Bakar mısınız? ببخشید نگاه می‌کنید؟) و با توانایی برای اجازه: Girebilir miyim? (می‌توانم وارد شوم؟ / اجازه هست بیایم تو؟).',
    rows: [
      ['Lütfen içeri buyurun ve oturun.', 'لطفاً بفرمایید داخل و بنشینید.', 'لوتفَن ایچِری بویورون وِ اوتورون', 'oturun', 'بنشینید (امر محترمانه)', 'ریشه + -(y)In = امر محترمانه'],
      ['Lütfen kapıyı açık bırakmayın.', 'لطفاً در را باز نگذارید.', 'لوتفَن کاپِییِی آچِیک بِیراکمایِین', 'bırakmayın', 'نگذارید / رها نکنید (نهی رسمی)'],
      ['Acele etme, daha vaktimiz var.', 'عجله نکن، هنوز وقت داریم.', 'آجِله اَتمه، داها واکتیمیز وار', 'acele etme', 'عجله نکن (نهی مفرد)'],
      ['Pardon, bakar mısınız?', 'ببخشید، توجه می‌فرمایید؟ (خطاب به فروشنده/گارسون)', 'پاردون، باکار مِیسِینِیز', 'bakar mısınız', 'نگاه/توجه می‌کنید؟'],
      ['Tuzu uzatır mısınız, lütfen?', 'ممکن است نمک را بدهید، لطفاً؟', 'توزو اوزاتِیر مِیسِینِیز، لوتفَن', 'uzatır mısınız', 'دراز می‌کنید / می‌دهید؟'],
      ['Affedersiniz, pencereyi açabilir miyim?', 'ببخشید، می‌توانم پنجره را باز کنم؟', 'آفِّدَرسینیز، پَنجِرِیی آچابیلیر میییم', 'açabilir miyim', 'آیا می‌توانم باز کنم؟ (اجازه)', 'ریشه + -(y)Abilir miyim? = اجازه'],
      ['Burada fotoğraf çekebilir miyiz?', 'می‌توانیم اینجا عکس بگیریم؟', 'بورادا فوتوئراف چِکِبیلیر میییز', 'çekebilir miyiz', 'آیا می‌توانیم بگیریم؟'],
      ['Bir dakika bekleyin, hemen geliyorum.', 'یک دقیقه صبر کنید، همین الان می‌آیم.', 'بیر داکیکا بِکلِیین، هِمَن گِلییوروم', 'bekleyin', 'صبر کنید (bekle + y + in)'],
    ],
    dialogue: [
      ['مریم', 'Affedersiniz hocam, içeri girebilir miyim?', 'ببخشید استاد، می‌توانم داخل بیایم؟'],
      ['استاد', 'Tabii Meryem, buyurun girin ve şöyle oturun.', 'البته مریم، بفرمایید داخل شوید و اینجا بنشینید.'],
      ['مریم', 'Çok teşekkür ederim, kusura bakmayın.', 'خیلی ممنونم، ببخشید (خرده نگیرید).'],
    ],
    checks: [
      {
        promptFa: 'برای اجازه گرفتن جهت «آیا می‌توانم بنشینم؟» کدام عبارت طبیعی و مؤدبانه است؟',
        choices: ['Otur!', 'Oturabilir miyim?', 'Oturmuyorum.'],
        correctIndex: 1,
        explanationFa: 'الگوی -(y)abilir miyim? رایج‌ترین ساختار مؤدبانه برای اجازه گرفتن در ترکی است.',
      },
      {
        promptFa: 'در کافه یا فروشگاه، برای صدا زدن مؤدبانهٔ گارسون یا فروشنده چه می‌گوییم؟',
        choices: ['Pardon, bakar mısınız?', 'Buraya gel!', 'Acele etme!'],
        correctIndex: 0,
        explanationFa: 'عبارت Pardon, bakar mısınız? طبیعی‌ترین روش محترمانه برای جلب توجه کارمند یا گارسون در ترکیه است.',
      },
    ],
  },

  /* ۳۳. هماهنگی واکه‌ها و قواعد انتخاب پسوندها */
  {
    id: 'tr-l1-vowel-harmony',
    title: 'هماهنگی واکه‌ها و قواعد انتخاب پسوندها',
    subtitle: 'جمع‌بندی هماهنگی دوگانه (a/e) و چهارگانه (ı/i/u/ü) به همراه همخوان‌های میانجی و نرمی همخوان‌ها',
    situation: 'قواعد پسوندگذاری ترکی استانبولی را یکجا می‌بینید تا هنگام ساخت واژه‌های تازه پسوند درست را بی‌درنگ انتخاب کنید.',
    teachingFa: 'ترکی استانبولی زبانی پسوندی و بسیار منظم است و تقریباً همهٔ پسوندها بر اساس «آخرین واکهٔ واژه» به دو خانواده تقسیم می‌شوند: ۱) هماهنگی دوگانه (نوع A: فقط a یا e): پس از واکه‌های پسین (a, ı, o, u) شکل با a می‌آید (-lar، -da، -dan، -a، -mak) و پس از واکه‌های پیشین (e, i, ö, ü) شکل با e می‌آید (-ler، -de، -den، -e، -mek). ۲) هماهنگی چهارگانه (نوع I: دارای ı, i, u, ü): مانند پسوند مفعولی، ملکی، پرسشی mı/mi/mu/mü و حال استمراری: a/ı → ı، e/i → i، o/u → u، ö/ü → ü! در کنار آن دو قاعدهٔ همخوانی را به یاد بسپارید: پس از f, s, t, k, ç, ş, h, p دالِ پسوند به ت تبدیل می‌شود (parkta، işten) و در پایان واژه p, ç, t, k پیش از واکه اغلب به b, c, d, ğ نرم می‌شوند (kitabım، sokağa).',
    rows: [
      ['Masalar odada, sandalyeler balkonda.', 'میزها در اتاق‌اند، صندلی‌ها در بالکن.', 'ماسالار اودادا، ساندالیِلَر بالکوندا', 'sandalyeler', 'صندلی‌ها (هماهنگی دوگانه با e)', 'دوگانه: a,ı,o,u → a | e,i,ö,ü → e'],
      ['Kızım okulu seviyor, oğlum yüzmeyi seviyor.', 'دخترم مدرسه را دوست دارد، پسرم شنا را.', 'کِیزِیم اوکولو سِوییور، اوئلوم یوزمِیی سِوییور', 'okulu', 'مدرسه را (هماهنگی چهارگانه u→u)', 'چهارگانه: a/ı→ı · e/i→i · o/u→u · ö/ü→ü'],
      ['Bugün hava güneşli mi, bulutlu mu?', 'امروز هوا آفتابی است یا ابری؟', 'بوگون هاوا گونَشلی می، بولوتلو مو', 'bulutlu mu', 'آیا ابری است؟ (u → mu)'],
      ['Gözlüğümü otobüste unuttum.', 'عینکم را در اتوبوس جا گذاشتم.', 'گوزلوئومو اوتوبوسته اونوتّوم', 'otobüste', 'در اتوبوس (ü پیشین + s بی‌واک → -te)'],
      ['Çocuğun kitabı masanın üstünde.', 'کتابِ کودک روی میز است.', 'چوجوئون کیتابِی ماسانِین اوستونده', 'çocuğun', 'مالِ کودک (نرمی k → ğ)'],
      ['Ağaca bak, kuşlar dalda ötüyor.', 'به درخت نگاه کن، پرنده‌ها روی شاخه می‌خوانند.', 'آئاجا باک، کوشلار دالدا اوتویور', 'ağaca', 'به درخت (نرمی ç → c در ağaç)'],
      ['Köprüden karşı yakaya geçiyoruz.', 'از پل به سمت مقابلِ شهر می‌گذریم.', 'کوپرودَن کارشِی یاکایا گِچییوروز', 'köprüden', 'از پل (ü → -den)'],
      ['Sözlüğün içinde yeni kelimeler var.', 'داخل فرهنگ‌لغت واژه‌های تازه‌ای هست.', 'سوزلوئون ایچینده یِنی کِلیمِلَر وار', 'sözlüğün', 'فرهنگ‌لغت (ü → -ün با k→ğ)'],
    ],
    dialogue: [
      ['سارا', '«Otobüs» kelimesinden sonra «-de» mi, «-te» mi geliyor?', 'بعد از واژهٔ «otobüs» پسوند «-de» می‌آید یا «-te»؟'],
      ['استاد', 'Son ses «s» sert ünsüz ve son ünlü «ü» ince; bu yüzden «otobüste» diyoruz.', 'صدای پایانی «s» بی‌واک و آخرین واکه «ü» پیشین است؛ برای همین «otobüste» می‌گوییم.'],
      ['سارا', 'Çok mantıklı, kurallar birbirini tamamlıyor!', 'خیلی منطقی است، قاعده‌ها همدیگر را کامل می‌کنند!'],
    ],
    checks: [
      {
        promptFa: 'بر اساس هماهنگی چهارگانهٔ واکه‌ها، جزء پرسشی پس از واژهٔ «üzgün» (ناراحت) کدام است؟',
        choices: ['üzgün mı', 'üzgün mi', 'üzgün mü'],
        correctIndex: 2,
        explanationFa: 'آخرین واکهٔ üzgün حرف ü (پیشین گرد) است؛ بنابراین جزء پرسشی mü می‌آید: üzgün mü?',
      },
      {
        promptFa: 'وقتی به واژهٔ «ağaç» (درخت) پسوند جهتی «-a» اضافه شود، شکل درست کدام است؟',
        choices: ['ağaça', 'ağaca', 'ağace'],
        correctIndex: 1,
        explanationFa: 'آخرین واکه a پسین است (-a می‌گیرد) و همخوان پایانی ç پیش از واکه به c نرم می‌شود: ağaca.',
      },
    ],
  },

  /* ۳۴. ترتیب کلمات در جمله ترکی استانبولی */
  {
    id: 'tr-l1-word-order',
    title: 'ترتیب کلمات در جمله ترکی استانبولی',
    subtitle: 'الگوی معیار «فاعل + زمان + مکان + متمم/مفعول + فعل» و جایگاه عنصر مورد تأکید پیش از فعل',
    situation: 'اجزای مختلف جمله (زمان، مکان، همراهی و مفعول) را به طبیعی‌ترین ترتیب در جمله‌های کامل کنار هم می‌چینید.',
    teachingFa: 'ترتیب خنثی و معیار در ترکی استانبولی چنین است: فاعل + قید زمان + قید مکان / جهت + مفعول + فعل. برای نمونه: Ben (فاعل) yarın sabah (زمان) kütüphanede (مکان) ders (مفعول) çalışıyorum (فعل). راز مهم روانی گفتار در ترکی «تأکید پیش از فعل» است: هر عنصری (زمان، مکان، فاعل یا پرسش‌واژه) را که درست پیش از فعل بگذارید، تکیه و تأکید پیام روی همان بخش می‌افتد! مقایسه کنید: Yarın Ankara\'ya ben gidiyorum (فردا من هستم که به آنکارا می‌روم) در برابر Ben Ankara\'ya yarın gidiyorum (من فرداست که به آنکارا می‌روم).',
    rows: [
      ['Ben her sabah evde kahvaltı yapıyorum.', 'من هر صبح در خانه صبحانه می‌خورم.', 'بَن هَر ساباه اِوده کاهوالتِی یاپِییوروم', 'her sabah', 'هر صبح', 'فاعل + زمان + مکان + مفعول + فعل'],
      ['Meryem bugün kütüphanede bu kitabı okuyor.', 'مریم امروز در کتابخانه این کتاب را می‌خواند.', 'مَریَم بوگون کوتوپ‌هانِده بو کیتابِی اوکویور', 'kütüphanede', 'در کتابخانه'],
      ['Biz akşam arkadaşlarla restoranda buluşuyoruz.', 'ما عصر با دوستان در رستوران قرار می‌گذاریم.', 'بیز آکشام آرکاداشلارلا رِستوراندا بولوشویوروز', 'arkadaşlarla', 'با دوستان'],
      ['Bu paketi kargoyla yarın gönderiyoruz.', 'این بسته را با پست فردا می‌فرستیم. (تأکید روی فردا)', 'بو پاکِتی کارگویلا یارِین گوندِرییوروز', 'gönderiyoruz', 'می‌فرستیم', 'عنصر بلافاصله پیش از فعل = کانون تأکید'],
      ['Yarın toplantıya müdür de katılıyor.', 'فردا در جلسه مدیر هم شرکت می‌کند.', 'یارِین توپلانتِییا مودور دِ کاتِیلِییور', 'müdür de', 'مدیر هم'],
      ['Annem pazardan her hafta taze sebze alıyor.', 'مادرم از بازارروز هر هفته سبزی تازه می‌خرد.', 'آننَم پازاردان هَر هافتا تازه سَبزه آلِییور', 'taze sebze', 'سبزی تازه'],
      ['Biletleri internetten şimdi alıyorum.', 'بلیت‌ها را از اینترنت همین الان می‌خرم.', 'بیلَتلِری اینتَرنَتّه‌ن شیمدی آلِییوروم', 'internetten', 'از اینترنت'],
      ['Öğretmen konuyu sınıfta çok açık anlatıyor.', 'معلم مبحث را در کلاس بسیار روشن توضیح می‌دهد.', 'اوئْرِتمَن کونویو سِینِفتا چوک آچِیک آنلاتِییور', 'anlatıyor', 'توضیح می‌دهد'],
    ],
    dialogue: [
      ['امره', 'Biletleri gişeden bugün kim alıyor?', 'بلیت‌ها را امروز از باجه چه کسی می‌خرد؟'],
      ['سارا', 'Biletleri internetten şimdi ben alıyorum.', 'بلیت‌ها را الان از اینترنت من دارم می‌خرم.'],
      ['امره', 'Harika! O zaman biz akşam sinemanın önünde buluşuyoruz.', 'عالیه! پس ما عصر جلوی سینما همدیگر را می‌بینیم.'],
    ],
    checks: [
      {
        promptFa: 'در جملهٔ ترکی، کدام جایگاه بیشترین تأکید معنایی را دارد؟',
        choices: ['واژه‌ای که بلافاصله پیش از فعل قرار می‌گیرد', 'همیشه اولین واژهٔ جمله', 'فقط واژه‌های بعد از فعل'],
        correctIndex: 0,
        explanationFa: 'در ترکی استانبولی جایگاهِ درست پیش از فعل (جایگاه پیشافعلی) کانون اصلی تأکید است.',
      },
      {
        promptFa: 'کدام جمله ترتیب معیار و طبیعیِ ترکی استانبولی را رعایت کرده است؟',
        choices: [
          'Yapıyorum ben kahvaltı sabah evde.',
          'Ben her sabah evde kahvaltı yapıyorum.',
          'Ben yapıyorum evde her sabah kahvaltı.',
        ],
        correctIndex: 1,
        explanationFa: 'ترتیب معیار در جملهٔ خبری فاعل (Ben) + زمان (her sabah) + مکان (evde) + مفعول (kahvaltı) + فعل (yapıyorum) است.',
      },
    ],
  },
];

export const TURKISH_FOUNDATION_PART_B = buildTurkishLessons(FOUNDATION_PART_B_SEEDS, 'tr1', 137);
