import { buildTurkishLessons, type TurkishLessonSeed } from './turkishSeed';

const A2_FOUNDATION_PART_B_SEEDS: readonly TurkishLessonSeed[] = [
  /* ۱۴. بیان خواسته‌ها، ترجیحات و علاقه‌ها (İstemek, Tercih Etmek, Sevmek) */
  {
    id: 'tr-a2-f-14-wishes-preferences-likes',
    title: 'بیان خواسته‌ها، ترجیحات و علاقه‌ها (İstemek, Tercih Etmek, Sevmek)',
    subtitle: 'Foundation · تفاوت -mak istemek با -mayı sevmek و ساختار tercih etmek',
    situation: 'خواستهٔ دقیق، علاقه‌مندی‌ها و ترجیح خود را میان دو فعالیت یا دو گزینه بیان می‌کنید.',
    teachingFa: 'توجه به پسوند پیش از این سه فعل در ترکی بسیار مهم است: ۱) پیش از istemek مصدر کامل بدون پسوند حالت می‌آید (gitmek istiyorum = می‌خواهم بروم)؛ ۲) پیش از sevmek و tercih etmek مصدر با پسوند مفعولی -mayı/-meyi می‌آید (yürümeyi seviyorum، okumayı tercih ederim)؛ ۳) هنگام ترجیح یک گزینه بر گزینهٔ دیگر، گزینهٔ رهاشده پسوند -a/-e (به جایِ...) و گزینهٔ برگزیده پسوند مفعولی می‌گیرد: Çayı kahveye tercih ederim (چای را به قهوه ترجیح می‌دهم).',
    rows: [
      ['Hafta sonu sessiz bir yerde dinlenmek istiyorum.', 'می‌خواهم آخر هفته در جایی آرام استراحت کنم.', 'هافتا سونو سَس‌سیز بیر یَرده دینلَنمَک ایستییوروم', 'dinlenmek istiyorum', 'می‌خواهم استراحت کنم', 'مصدر -mak/-mek + istemek'],
      ['Sabahları sahilde yürümeyi çok seviyorum.', 'صبح‌ها پیاده‌روی در ساحل را خیلی دوست دارم.', 'ساباهلارِی ساهیلده یورومِیی چوک سِوییوروم', 'yürümeyi', 'پیاده‌روی کردن را', '-mayı/-meyi + sevmek'],
      ['Uzun yolculuklarda trenle gitmeyi uçağa tercih ederim.', 'در سفرهای طولانی رفتن با قطار را به هواپیما ترجیح می‌دهم.', 'اوزون یولجولوکلاردا ترَنله گیتمِیی اوچائا تَرجیه اِدَریم', 'tercih ederim', 'ترجیح می‌دهم', 'برگزیده (-mayı/-ı) + رهاشده (-a/-e) + tercih etmek'],
      ['Akşam yemeğinde kızartma yerine ızgara sebze yemek isterim.', 'در وعدهٔ شام به جای سرخ‌کردنی مایل هستم سبزیجات کبابی بخورم.', 'آکشام یِمَیینده کِیزارتما یِرینه ایزگارا سَبزه یِمَک ایستَریم', 'isterim', 'مایل هستم / می‌خواهم', 'درخواست مؤدبانه با isterim'],
      ['Kalabalık alışveriş merkezlerinde dolaşmayı pek sevmiyorum.', 'گشتن در مراکز خرید شلوغ را چندان دوست ندارم.', 'کالابالِیک آلِیش‌وِریش مَرکَزلَرینده دولاشمایِی پَک سَومییوروم', 'sevmiyorum', 'دوست ندارم'],
      ['Yazın denize girmektense yaylada kalmayı tercih ediyoruz.', 'تابستان به جای رفتن به دریا، ماندن در ییلاق را ترجیح می‌دهیم.', 'یازِین دِنیزه گیرمَکتَنسه یایلادا کالمایِی تَرجیه اِدییوروز', 'kalmayı', 'ماندن را', '-maktansa/-mektense = به جای اینکه'],
      ['Çocuklar evde oturmaktansa parkta oynamak istiyorlar.', 'بچه‌ها به جای نشستن در خانه می‌خواهند در پارک بازی کنند.', 'چوجوکلار اِوده اوتورماکتانسا پارکتا اویناماک ایستییورلار', 'oynamak istiyorlar', 'می‌خواهند بازی کنند'],
      ['Boş vakitlerimde tarihi romanlar okumaktan hoşlanırım.', 'در اوقات فراغتم از خواندن رمان‌های تاریخی خوشم می‌آید.', 'بوش واکیتلَریمده تاریهی رومانلار اوکوماکتان هوشلانِیرِیم', 'hoşlanırım', 'خوشم می‌آید', '-maktan/-mekten hoşlanmak'],
    ],
    dialogue: [
      ['پری', 'Bu akşam dışarıda yemek yemek ister misin?', 'مایل هستی امشب بیرون غذا بخوریم؟'],
      ['سینا', 'Olur, ama gürültülü mekanları pek sevmiyorum; sakin bir yer seçelim.', 'می‌شود، اما جاهای پرسر‌و‌صدا را چندان دوست ندارم؛ یک جای آرام انتخاب کنیم.'],
      ['پری', 'İtalyan mutfağını mı yoksa ev yemeklerini mi tercih edersin?', 'غذای ایتالیایی را ترجیح می‌دهی یا غذاهای خانگی را؟'],
      ['سینا', 'Sıcak çorba ve zeytinyağlı yemekleri pizzaya tercih ederim.', 'سوپ گرم و غذاهای روغن‌زیتونی را به پیتزا ترجیح می‌دهم.'],
    ],
    checks: [
      {
        promptFa: 'کدام شکل پیش از فعل «sevmek» و «tercih etmek» درست است؟',
        choices: ['yürümek seviyorum', 'yürümeyi seviyorum', 'yürüdüm seviyorum'],
        correctIndex: 1,
        explanationFa: 'فعل‌های sevmek و tercih etmek مفعول مشخص می‌گیرند، بنابراین مصدر با -mayı/-meyi می‌آید.',
      },
      {
        promptFa: 'جملهٔ «Çayı kahveye tercih ederim» یعنی چه؟',
        choices: ['قهوه را به چای ترجیح می‌دهم', 'چای را به قهوه ترجیح می‌دهم', 'نه چای می‌خورم نه قهوه'],
        correctIndex: 1,
        explanationFa: 'واژهٔ دارای پسوند مفعولی (çayı) گزینهٔ برگزیده است و واژهٔ دارای پسوند جهتی (kahveye) گزینهٔ کنارگذاشته‌شده.',
      },
    ],
  },

  /* ۱۵. بیان دلیل و نتیجه (Çünkü, Bu Yüzden, Bu Sebeple) */
  {
    id: 'tr-a2-f-15-cause-and-effect',
    title: 'بیان دلیل و نتیجه (Çünkü, Bu Yüzden, Bu Sebeple)',
    subtitle: 'Foundation · پیوند علت و معلول با çünkü، bu yüzden، bu sebeple، -dığı için و yüzünden',
    situation: 'علت رخ‌دادن یک اتفاق و نتیجهٔ آن را در گفتار روزمره و محیط کار روشن و منطقی توضیح می‌دهید.',
    teachingFa: 'در ترکی استانبولی ترتیب دلیل و نتیجه با نوع پیونددهنده مشخص می‌شود: ۱) اگر ابتدا نتیجه و سپس دلیل بیاید، از çünkü (زیرا / چون‌که) استفاده می‌کنیم؛ ۲) اگر ابتدا دلیل و سپس نتیجه بیاید، از bu yüzden، bu sebeple یا bu nedenle (به همین دلیل / از این رو) بهره می‌بریم؛ ۳) در جملهٔ یکپارچه نیز ساختار «فعل + -dığı/-diği için» پیش از جملهٔ اصلی می‌آید: Yağmur yağdığı için çıkmadık.',
    rows: [
      ['Toplantıya biraz geç kaldım; çünkü köprüde kaza olmuştu.', 'کمی دیر به جلسه رسیدم؛ چون‌که روی پل تصادف شده بود.', 'توپلانتِییا بیراز گِچ کالدِیم؛ چونکو کوپروده کازا اولموشتو', 'çünkü', 'زیرا / چون‌که', 'نتیجه + çünkü + دلیل'],
      ['Gece çok geç uyudum, bu yüzden sabah alarmı duymadım.', 'شب خیلی دیر خوابیدم، به همین دلیل صبح صدای زنگ را نشنیدم.', 'گِجه چوک گِچ اویودوم، بو یوزدَن ساباه آلارمِی دویمادِیم', 'bu yüzden', 'به همین دلیل', 'دلیل + bu yüzden + نتیجه'],
      ['İnternet bağlantısı kesildi; bu sebeple dosyayı gönderemedim.', 'اتصال اینترنت قطع شد؛ به همین سبب نتوانستم فایل را بفرستم.', 'اینتَرنَت بائلانتِیسِی کِسیلدی؛ بو سِبَپله دوسیایِی گوندَرِمِدیم', 'bu sebeple', 'به همین سبب'],
      ['Hava çok rüzgârlı olduğu için vapur seferleri iptal edildi.', 'از آنجا که هوا بسیار بادخیز بود، سرویس‌های کشتی لغو شد.', 'هاوا چوک روزگارلِی اولدوئو ایچین واپور سِفَرلَری ایپتال اِدیلدی', 'olduğu için', 'به دلیل اینکه بود', '-dığı/-diği için پیش از جملهٔ نتیجه'],
      ['Yoğun sis yüzünden uçuşumuz iki saat ertelendi.', 'به علت مه غلیظ پروازمان دو ساعت به تعویق افتاد.', 'یوئون سیس یوزوندَن اوچوشوموز ایکی ساعات اَرتِلَندی', 'yüzünden', 'به خاطرِ (علت نامطلوب)', 'اسم + yüzünden برای علت منفی'],
      ['Düzenli çalışman sayesinde sınavdan yüksek puan aldın.', 'به لطفِ مطالعهٔ منظمت نمرهٔ بالایی از آزمون گرفتی.', 'دوزَنلی چالِیشمان سایِسینده سِیناودان یوکسَک پوآن آلدِین', 'sayesinde', 'به لطفِ (علت مثبت)', 'اسم + sayesinde برای نتیجهٔ مثبت'],
      ['Telefonum sessizdeydi; bu nedenle çağrını görmemişim.', 'تلفنم روی بی‌صدا بود؛ از این رو تماست را ندیده‌ام.', 'تِلِفونوم سَس‌سیزدِیدی؛ بو نِدَنله چائرِینِی گورمِمیشیم', 'bu nedenle', 'از این رو / به این علت'],
      ['Bugün izinliyim, çünkü dün fazla mesai yaptım.', 'امروز مرخصی هستم، چون دیروز اضافه‌کاری کردم.', 'بوگون ایزینلیییم، چونکو دون فازلا مِسایی یاپتِیم', 'fazla mesai', 'اضافه‌کاری'],
    ],
    dialogue: [
      ['نرگس', 'Dün akşamki konsere neden gelemedin?', 'چرا دیشب نتوانستی به کنسرت بیایی؟'],
      ['آردا', 'Gelemedim, çünkü öğleden sonra aniden başım ağrımaya başladı.', 'نتوانستم بیایم، چون بعدازظهر ناگهان سرم شروع به درد گرفتن کرد.'],
      ['نرگس', 'Çok geçmiş olsun! Bu yüzden mi telefonun kapalıydı?', 'خیلی بلا به دور! به همین خاطر تلفنت خاموش بود؟'],
      ['آردا', 'Evet, ilaç içip erken uyudum; bu sebeple mesajlara sabah bakabildim.', 'بله، دارو خوردم و زود خوابیدم؛ به همین سبب صبح توانستم پیام‌ها را ببینم.'],
    ],
    checks: [
      {
        promptFa: 'در جملهٔ «دلیل + ... + نتیجه»، کدام پیونددهنده در جای خالی قرار می‌گیرد؟',
        choices: ['bu yüzden / bu sebeple', 'çünkü', 'keşke'],
        correctIndex: 0,
        explanationFa: 'وقتی نخست علت و سپس نتیجه بیان می‌شود، از bu yüzden، bu sebeple یا bu nedenle استفاده می‌کنیم.',
      },
      {
        promptFa: 'تفاوت «yüzünden» و «sayesinde» چیست؟',
        choices: ['yüzünden معمولاً برای علت نامطلوب و sayesinde برای نتیجهٔ مثبت به کار می‌رود', 'هر دو فقط برای آینده می‌آیند', 'تفاوتی ندارند و حرف ربط پرسشی‌اند'],
        correctIndex: 0,
        explanationFa: 'sis yüzünden یعنی «از دستِ مه / به تقصیر مه»، اما çalışman sayesinde یعنی «به لطفِ تلاشت».',
      },
    ],
  },

  /* ۱۶. بیان شرط‌های ساده (Şart Kipi — -sa/-se) */
  {
    id: 'tr-a2-f-16-simple-conditionals',
    title: 'بیان شرط‌های ساده (Şart Kipi — -sa/-se)',
    subtitle: 'Foundation · شرط واقعی با -(y)sa/-(y)se روی زمان‌ها و جمله‌های اسمی با eğer',
    situation: 'شرط‌های واقعی روزمره («اگر وقت داشته باشم»، «اگر باران ببارد»، «اگر آماده باشی») را می‌سازید.',
    teachingFa: 'برای شرط‌های واقعی و ممکن در ترکی استانبولی (Gerçek Şart)، پسوند -(y)sa / -(y)se معمولاً پس از پایهٔ زمان حال ساده، حال استمراری یا آینده قرار می‌گیرد: gelirsen (اگر بیایی)، istiyorsan (اگر می‌خواهی)، yağmur yağarsa (اگر باران ببارد). در جمله‌های اسمی نیز به اسم یا صفت یا var/yok می‌چسبد: hazırsan (اگر آماده‌ای)، vaktin varsa (اگر وقت داری)، uygun değilse (اگر مناسب نیست). واژهٔ eğer در ابتدای جمله اختیاری است و برای تأکید می‌آید.',
    rows: [
      ['Eğer yarın hava güneşli olursa sahilde kahvaltı yapacağız.', 'اگر فردا هوا آفتابی شود در ساحل صبحانه خواهیم خورد.', 'اَیَر یارِین هاوا گونَشلی اولورسا ساهیلده کاهوالتِی یاپاجائِیز', 'olursa', 'اگر بشود', 'ol-ur-sa (Geniş Zaman + -sa) = شرط واقعی'],
      ['Boş vaktin varsa bana bu raporu kontrol etmede yardım eder misin?', 'اگر وقت خالی داری، در بررسی این گزارش به من کمک می‌کنی؟', 'بوش واکتین وارسا بانا بو راپورو کونترول اِتمِده یاردِیم اِدَر میسین', 'varsa', 'اگر هست / اگر داری', 'var + -sa → varsa'],
      ['Şimdi evden çıkarsak uçağa rahatça yetişiriz.', 'اگر همین الان از خانه راه بیفتیم راحت به هواپیما می‌رسیم.', 'شیمدی اِودَن چِیکارساک اوچائا راهاتچا یِتیشیریز', 'çıkarsak', 'اگر راه بیفتیم', 'çık-ar-sa-k (اول‌شخص جمع شرطی)'],
      ['Fiyatı bütçemize uygun değilse başka modellere bakarız.', 'اگر قیمتش متناسب با بودجهٔ ما نباشد به مدل‌های دیگر نگاه می‌کنیم.', 'فییاتِی بوتچِمیزه اویگون دِئیلسه باشکا مودَللَره باکارِیز', 'değilse', 'اگر نباشد', 'منفی جملهٔ اسمی شرطی: değil + -se'],
      ['Kendini yorgun hissediyorsan biraz uzanıp dinlen.', 'اگر احساس خستگی می‌کنی کمی دراز بکش و استراحت کن.', 'کَندینی یورگون هیسسِدییورسان بیراز اوزانِیپ دینلَن', 'hissediyorsan', 'اگر احساس می‌کنی', 'Şimdiki Zaman + -san'],
      ['Erken rezervasyon yapmazsanız otelde boş oda bulamazsınız.', 'اگر زود رزرو نکنید در هتل اتاق خالی پیدا نمی‌کنید.', 'اَرکَن رِزَرواسیون یاپمازسانِیز اوتَلده بوش اودا بولامازسِینِیز', 'yapmazsanız', 'اگر انجام ندهید', 'منفی شرط در Geniş Zaman: -mazsa / -mezse'],
      ['Kütüphaneye gidiyorsan benim aldığım kitabı da teslim eder misin?', 'اگر داری به کتابخانه می‌روی، کتابی را هم که من گرفته‌ام تحویل می‌دهی؟', 'کوتوپهانِیه گیدییورسان بِنیم آلدِیئِیم کیتابِی دا تِسلیم اِدَر میسین', 'gidiyorsan', 'اگر داری می‌روی'],
      ['Herhangi bir sorunuz olursa bana her zaman yazabilirsiniz.', 'اگر هرگونه پرسشی برایتان پیش بیاید همیشه می‌توانید به من پیام بدهید.', 'هَرهانگی بیر سورونوز اولورسا بانا هَر زامان یازابیلیرسینیز', 'sorunuz olursa', 'اگر سؤالی داشته باشید'],
    ],
    dialogue: [
      ['شیما', 'Akşam işin erken biterse sinemaya gidelim mi?', 'اگر عصر کارت زود تمام شود به سینما برویم؟'],
      ['کیان', 'Saat altıya kadar biterse kesinlikle gelirim.', 'اگر تا ساعت شش تمام شود حتماً می‌آیم.'],
      ['شیما', 'Biletleri şimdiden alayım mı yoksa bekleyelim mi?', 'بلیت‌ها را از الان بخرم یا صبر کنیم؟'],
      ['کیان', 'İnternetten iptal hakkı varsa şimdiden alabilirsin.', 'اگر از اینترنت امکان لغو دارد می‌توانی از همین الان بخری.'],
    ],
    checks: [
      {
        promptFa: 'در ترکی استانبولی «اگر وقت داری» چگونه بیان می‌شود؟',
        choices: ['vaktin varsa', 'vaktin vardı', 'vaktin varmış'],
        correctIndex: 0,
        explanationFa: 'پسوند شرطی -sa روی var می‌آید و عبارت بسیار پرکاربرد «vaktin varsa» را می‌سازد.',
      },
      {
        promptFa: 'شکل منفی شرطی «اگر رزرو نکنید» در زمان حال ساده کدام است؟',
        choices: ['rezervasyon yaparsanız', 'rezervasyon yapmazsanız', 'rezervasyon yaptınız'],
        correctIndex: 1,
        explanationFa: 'منفی Geniş Zaman (-maz/-mez) همراه با پسوند شرط (-sanız/-seniz) شکل «yapmazsanız» را می‌سازد.',
      },
    ],
  },

  /* ۱۷. بیان ترتیب و توالی رویدادها (Önce, Sonra, Daha Sonra, Önce… Sonra…) */
  {
    id: 'tr-a2-f-17-sequence-of-events',
    title: 'بیان ترتیب و توالی رویدادها (Önce, Sonra, Daha Sonra, Önce… Sonra…)',
    subtitle: 'Foundation · نشانگرهای توالی önce، sonra، daha sonra، ardından، sonunda و -dıktan sonra',
    situation: 'مراحل انجام یک کار، برنامهٔ سفر یا اتفاق‌های روزتان را به ترتیب زمانی دقیق روایت می‌کنید.',
    teachingFa: 'برای بیان زنجیرهٔ رویدادها، قیدهای مستقل önce / ilk önce (نخست / اول)، sonra (سپس / بعد)، daha sonra / ardından (پس از آن) و en sonunda (در نهایت) می‌آیند. همچنین وقتی «قبل از X» یا «بعد از X» به اسم یا فعل می‌چسبد، پیش از önce و sonra پسوند مبدأ (-dan/-den) لازم است: kahvaltıdan sonra (بعد از صبحانه)، çıkmadan önce (قبل از بیرون رفتن)، bitirdikten sonra (پس از تمام کردن).',
    rows: [
      ['Sabah önce ılık su içtim, sonra kahvaltı hazırladım.', 'صبح اول آب ولرم نوشیدم، بعد صبحانه آماده کردم.', 'ساباه اونجه ایْلِیک سو ایچتیم، سونرا کاهوالتِی هازِیرلادِیم', 'önce', 'اول / نخست', 'الگوی پایه: önce ... sonra ...'],
      ['Önce biletleri aldık, daha sonra pasaport kontrolüne geçtik.', 'ابتدا بلیت‌ها را گرفتیم، پس از آن به بخش کنترل گذرنامه رفتیم.', 'اونجه بیلَتلَری آلدِیک، داها سونرا پاساپورت کونترولونه گِچتیک', 'daha sonra', 'پس از آن / بعدتر'],
      ['Evden çıkmadan önce tüm pencereleri kontrol ettim.', 'پیش از بیرون رفتن از خانه همهٔ پنجره‌ها را بررسی کردم.', 'اِودَن چِیکمادان اونجه توم پَنجِرِلَری کونترول اِتتیم', 'çıkmadan önce', 'قبل از بیرون رفتن', 'ریشه + -madan/-meden önce = قبل از اینکه'],
      ['Ödevi bitirdikten sonra arkadaşlarımla yürüyüşe çıktım.', 'پس از تمام کردن تکلیف با دوستانم به پیاده‌روی رفتم.', 'اودِوی بیتیردیکتَن سونرا آرکاداشلارِیملا یورویوشه چِیکتِیم', 'bitirdikten sonra', 'بعد از تمام کردن', 'ریشه + -dıktan/-dikten sonra = بعد از اینکه'],
      ['İlk olarak malzemeleri yıkayın, ardından küçük küçük doğrayın.', 'در گام اول مواد را بشویید، متعاقباً ریزریز خرد کنید.', 'ایلک اولاراک مالزِمِلَری یِیکایِین، آردِیندان کوچوک کوچوک دوئرایِین', 'ardından', 'در پیِ آن / سپس'],
      ['Toplantıdan sonra kısa bir kahve molası verdik.', 'بعد از جلسه یک استراحت کوتاه برای قهوه داشتیم.', 'توپلانتِیدان سونرا کِیسا بیر کاهوه مولاسِی وَردیک', 'toplantıdan sonra', 'بعد از جلسه', 'اسم + -dan/-den sonra'],
      ['Uzun bir aramadan sonra en sonunda aradığımız kitabı bulduk.', 'پس از جست‌وجویی طولانی سرانجام کتابی را که دنبالش بودیم پیدا کردیم.', 'اوزون بیر آرامادان سونرا اَن سونوندا آرادِیئِیمِیز کیتابِی بولدوک', 'en sonunda', 'در نهایت / سرانجام'],
      ['Yemekten önce elleri yıkamak sağlık için çok önemlidir.', 'شستن دست‌ها پیش از غذا برای سلامتی بسیار مهم است.', 'یِمَکتَن اونجه اَللَری یِیکاماک سائلِیک ایچین چوک اونَملیدیر', 'yemekten önce', 'قبل از غذا', 'اسم + -dan/-den/-tan/-ten önce'],
    ],
    dialogue: [
      ['مهسا', 'Bugün şehir merkezinde işlerini nasıl hallettin?', 'امروز کارهایت را در مرکز شهر چطور انجام دادی؟'],
      ['تولگا', 'Önce bankaya uğradım, sonra postaneden kargomu teslim aldım.', 'اول به بانک سر زدم، بعد از ادارهٔ پست بسته‌ام را تحویل گرفتم.'],
      ['مهسا', 'Daha sonra nereye gittin?', 'بعد از آن کجا رفتی؟'],
      ['تولگا', 'Postaneden çıktıktan sonra sahafları gezdim ve en sonunda eve döndüm.', 'بعد از بیرون آمدن از پست، کتاب‌فروشی‌های دست‌دوم را گشتم و در نهایت به خانه برگشتم.'],
    ],
    checks: [
      {
        promptFa: 'کدام ساختار به معنی «پیش از بیرون رفتن» است؟',
        choices: ['çıktıktan sonra', 'çıkmadan önce', 'çıkacak kadar'],
        correctIndex: 1,
        explanationFa: 'ساختار «ریشهٔ فعل + -madan/-meden önce» معادل دقیق «قبل از انجامِ کار» است.',
      },
      {
        promptFa: 'پیش از واژه‌های «önce» و «sonra» وقتی به اسم می‌چسبند چه پسوندی لازم است؟',
        choices: ['پسوند مبدأ (-dan/-den/-tan/-ten)', 'پسوند جمع (-lar/-ler)', 'پسوند پرسشی (mı/mi)'],
        correctIndex: 0,
        explanationFa: 'اسم پیش از önce و sonra پسوند حالت مبدأ می‌گیرد: yemekten önce، toplantıdan sonra.',
      },
    ],
  },

  /* ۱۸. استفاده از قیدهای تکرار، زمان و مقدار */
  {
    id: 'tr-a2-f-18-adverbs-frequency-time-degree',
    title: 'استفاده از قیدهای تکرار، زمان و مقدار',
    subtitle: 'Foundation · قیدهای her zaman، sık sık، bazen، nadiren، oldukça، yeterince و henüz',
    situation: 'تکرار عادت‌ها، زمان دقیق رویدادها و شدت صفت‌ها یا فعل‌ها را با قیدهای طبیعی بیان می‌کنید.',
    teachingFa: 'قیدها در ترکی استانبولی معمولاً پیش از فعل یا پیش از صفتی قرار می‌گیرند که آن را توصیف می‌کنند: ۱) قیدهای تکرار (Sıklık Zarfları): her zaman / daima (همیشه)، genellikle (معمولاً)، sık sık (اغلب/مرتب)، bazen / ara sıra (گاهی)، nadiren (به‌ندرت)، hiç (هرگز — با فعل منفی)؛ ۲) قیدهای زمان: az önce (چند لحظه پیش)، birazdan (به‌زودی)، henüz / hâlâ (هنوز)؛ ۳) قیدهای مقدار و درجه: oldukça / gayet (نسبتاً زیاد / کاملاً)، yeterince (به اندازهٔ کافی)، neredeyse (تقریباً).',
    rows: [
      ['Hafta sonları ailemi sık sık ziyaret ederim.', 'آخر هفته‌ها اغلب به خانواده‌ام سر می‌زنم.', 'هافتا سونلارِی آیلَمی سِیک سِیک زییارَت اِدَریم', 'sık sık', 'اغلب / مرتب', 'قید تکرار پیش از فعل'],
      ['İş yoğunluğundan dolayı dışarıda nadiren yemek yiyoruz.', 'به خاطر شلوغی کار به‌ندرت بیرون غذا می‌خوریم.', 'ایش یوئونلوئوندان دولایِی دِیشارِیدا نادیرَن یِمَک یییوروز', 'nadiren', 'به‌ندرت'],
      ['Kargo görevlisi az önce kapıyı çaldı ve paketi bıraktı.', 'مأمور پست همین چند لحظه پیش زنگ در را زد و بسته را گذاشت.', 'کارگو گورَولیسی آز اونجه کاپِییِی چالدِی وِ پاکِتی بِیراکتِی', 'az önce', 'چند لحظه پیش', 'قید زمان نزدیک در گذشته'],
      ['Misafirler henüz gelmedi ama masa tamamen hazır.', 'مهمان‌ها هنوز نیامده‌اند اما میز کاملاً آماده است.', 'میسافیرلَر هِنوز گَلمِدی آما ماسا تامامَن هازِیر', 'henüz', 'هنوز (با فعل منفی)', 'henüz + فعل منفی = هنوز نه'],
      ['Bugünkü sınav soruları beklediğimden oldukça kolaydı.', 'سؤال‌های آزمون امروز خیلی آسان‌تر از انتظارم (کاملاً آسان) بود.', 'بوگونکو سِیناو سورولارِی بَکلِدیییمدَن اولدوکچا کولایدِی', 'oldukça', 'نسبتاً زیاد / کاملاً', 'قید درجه پیش از صفت'],
      ['Bu odayı ısıtmak için küçük ısıtıcı yeterince güçlü değil.', 'برای گرم کردن این اتاق، بخاری کوچک به اندازهٔ کافی قوی نیست.', 'بو اودایِی ایسِیتماک ایچین کوچوک ایسِیتِیجِی یِتِرینجه گوچلو دِئیل', 'yeterince', 'به اندازهٔ کافی'],
      ['Ara sıra sahilde tek başıma yürüyüp müzik dinlerim.', 'هر از گاهی تنهایی در ساحل قدم می‌زنم و موسیقی گوش می‌دهم.', 'آرا سِیرا ساهیلده تَک باشِیما یورویوپ موزیک دینلَریم', 'ara sıra', 'هر از گاهی / گاهی'],
      ['Raporu neredeyse bitirdim, birazdan sana göndereceğim.', 'گزارش را تقریباً تمام کردم، کمی دیگر برایت خواهم فرستاد.', 'راپورو نِرِدَیسه بیتیردیم، بیرازدان سانا گوندَرِجَییم', 'neredeyse', 'تقریباً / نزدیک است که'],
    ],
    dialogue: [
      ['الهام', 'Yeni açılan kütüphaneye sık sık gidiyor musun?', 'به کتابخانهٔ تازه‌تأسیس زیاد می‌روی؟'],
      ['هاکان', 'Evet, salonu oldukça sessiz ve aydınlık; haftada üç gün oradayım.', 'بله، سالنش کاملاً آرام و روشن است؛ هفته‌ای سه روز آنجایم.'],
      ['الهام', 'Ben henüz gidemedim, hafta sonu yeterince boş yer oluyor mu?', 'من هنوز نتوانسته‌ام بروم، آخر هفته به اندازهٔ کافی جای خالی پیدا می‌شود؟'],
      ['هاکان', 'Öğleden sonra bazen doluyor ama sabahları her zaman yer bulursun.', 'بعدازظهر گاهی پر می‌شود اما صبح‌ها همیشه جا پیدا می‌کنی.'],
    ],
    checks: [
      {
        promptFa: 'واژهٔ «henüz» در جملهٔ «Misafirler henüz gelmedi» چه نقشی دارد؟',
        choices: ['بیان اینکه کاری تا این لحظه هنوز انجام نشده است', 'بیان تکرار همیشگی', 'بیان مقدار زیاد'],
        correctIndex: 0,
        explanationFa: 'henüz همراه با فعل منفی یعنی «هنوز انجام نشده است» (هنوز نیامده‌اند).',
      },
      {
        promptFa: 'کدام گزینه قید تکرار به معنی «به‌ندرت» است؟',
        choices: ['her zaman', 'sık sık', 'nadiren'],
        correctIndex: 2,
        explanationFa: 'nadiren یعنی «به‌ندرت»، در حالی که her zaman همیشه و sık sık اغلب است.',
      },
    ],
  },

  /* ۱۹. استفاده از مصدر و ساختارهای فعلی پایه (-mak/-mek، -mayı/-meyi) */
  {
    id: 'tr-a2-f-19-infinitives-verbal-nouns',
    title: 'استفاده از مصدر و ساختارهای فعلی پایه (-mak/-mek، -mayı/-meyi)',
    subtitle: 'Foundation · مصدر کامل (-mak/-mek)، اسم مصدر (-ma/-me) و حالت‌های -mayı، -maya و -maktan',
    situation: 'فعل‌ها را به اسم تبدیل می‌کنید تا دربارهٔ یادگیری، شروع یک کار، فراموش نکردن یا لذت بردن از فعالیت‌ها صحبت کنید.',
    teachingFa: 'در ترکی استانبولی مصدر کامل با -mak/-mek ساخته می‌شود و در جایگاه نهاد یا پیش از istemek / zorunda می‌آید: Yüzmek sağlıklıdır (شنا کردن سالم است). اما هرگاه مصدر پسوند حالت یا ملکی بگیرد، k پایانی می‌افتد و به شکل اسم‌فعل -ma/-me درمی‌آید: ۱) مفعولی: -mayı/-meyi (با sevmek، unutmak، düşünmek، öğrenmek)؛ ۲) جهتی: -maya/-meye (با başlamak، çalışmak = تلاش کردن، karar vermek)؛ ۳) مبدأ: -maktan/-mekten (با hoşlanmak، vazgeçmek، korkmak).',
    rows: [
      ['Her gün yirmi dakika kitap okumak kelime hazinesini geliştirir.', 'هر روز بیست دقیقه کتاب خواندن دایرهٔ واژگان را گسترش می‌دهد.', 'هَر گون ییرمی داکیکا کیتاپ اوکوماک کِلیمه هازینِسینی گِلیشتیریر', 'okumak', 'خواندن (نهاد جمله)', 'مصدر -mak/-mek در نقش نهاد'],
      ['Evden çıkarken ışıkları kapatmayı sakın unutma.', 'هنگام بیرون رفتن از خانه خاموش کردن چراغ‌ها را مبادا فراموش کنی.', 'اِودَن چِیکارکَن ایشِیکلارِی کاپاتمایِی ساکِین اونوتما', 'kapatmayı', 'خاموش کردن را', '-mayı/-meyi + unutmak'],
      ['Geçen ay düzenli olarak gitar çalmaya başladım.', 'ماه گذشته به‌طور منظم شروع به نواختن گیتار کردم.', 'گِچَن آی دوزَنلی اولاراک گیتار چالمایا باشلادِیم', 'çalmaya başladım', 'شروع به نواختن کردم', '-maya/-meye + başlamak'],
      ['Sorunu çözmek için farklı bir yöntem denemeye çalışıyoruz.', 'برای حل مشکل تلاش می‌کنیم روش متفاوتی را امتحان کنیم.', 'سورونو چوزمَک ایچین فارکلِی بیر یونتَم دِنِمِیه چالِیشِییوروز', 'denemeye çalışıyoruz', 'تلاش می‌کنیم امتحان کنیم', '-maya/-meye + çalışmak = کوشش کردن'],
      ['Yağmur şiddetlenince dışarı çıkmaktan vazgeçtik.', 'وقتی باران شدید شد از بیرون رفتن منصرف شدیم.', 'یائْمور شیددَتلِنینجه دِیشارِی چِیکماکتان وازگِچتیک', 'çıkmaktan vazgeçtik', 'از بیرون رفتن منصرف شدیم', '-maktan/-mekten + vazgeçmek'],
      ['Yeni insanlarla tanışmaktan ve sohbet etmekten keyif alırım.', 'از آشنا شدن با آدم‌های جدید و گپ زدن لذت می‌برم.', 'یِنی اینسانلارلا تانِیشماکتان وِ سوهبَت اِتمَکتَن کِییف آلِیرِیم', 'tanışmaktan', 'از آشنا شدن'],
      ['Türkçe yemek tariflerini tek başıma yapmayı öğrendim.', 'یاد گرفتم دستورهای آشپزی ترکی را به تنهایی درست کنم.', 'تورکچه یِمَک تاریفلَرینی تَک باشِیما یاپمایِی اوئرَندیم', 'yapmayı öğrendim', 'درست کردن را یاد گرفتم', '-mayı/-meyi + öğrenmek'],
      ['Gürültülü ortamlarda ders çalışmak benim için çok zor.', 'درس خواندن در محیط‌های پرسر‌و‌صدا برای من خیلی دشوار است.', 'گورولتولو اورتاملاردا دَرس چالِیشماک بِنیم ایچین چوک زور', 'ders çalışmak', 'درس خواندن'],
    ],
    dialogue: [
      ['سپیده', 'Yeni bir hobi edinmeyi düşünüyor musun?', 'به یاد گرفتن یک سرگرمی جدید فکر می‌کنی؟'],
      ['امیر', 'Evet, bu hafta seramik kursuna gitmeye başladım.', 'بله، این هفته رفتن به کلاس سفالگری را شروع کردم.'],
      ['سپیده', 'Ne güzel! İlk derste bir şey yapmayı öğrendin mi?', 'چه خوب! در جلسهٔ اول درست کردن چیزی را یاد گرفتی؟'],
      ['امیر', 'Küçük bir kupa şekillendirmeye çalıştım; çamurla uğraşmak çok rahatlatıcı.', 'تلاش کردم یک لیوان کوچک شکل بدهم؛ کار کردن با گِل خیلی آرامش‌بخش است.'],
    ],
    checks: [
      {
        promptFa: 'پیش از فعل «başlamak» (شروع کردن)، مصدر چه پسوندی می‌گیرد؟',
        choices: ['-maya / -meye', '-mak / -mek بدون پسوند', '-maktan / -mekten'],
        correctIndex: 0,
        explanationFa: 'فعل başlamak در ترکی متمم جهتی می‌گیرد، پس مصدر به شکل «چالمایا / okumaya + başlamak» می‌آید.',
      },
      {
        promptFa: 'در جملهٔ «ışıkları kapatmayı unutma»، چرا kapatmak به شکل kapatmayı درآمده است؟',
        choices: ['چون مفعول مشخصِ فعل unutma است', 'چون زمان آینده است', 'چون صفت عالی است'],
        correctIndex: 0,
        explanationFa: 'فعل unutmak مفعول مستقیم می‌طلبد و مصدر در حالت مفعولی به -mayı/-meyi تبدیل می‌شود.',
      },
    ],
  },

  /* ۲۰. ساخت جمله‌های مرکب و پیوند چند ایده */
  {
    id: 'tr-a2-f-20-compound-sentences',
    title: 'ساخت جمله‌های مرکب و پیوند چند ایده',
    subtitle: 'Foundation · هم‌پایه‌سازهای قیدی -(y)ıp، -(y)arak، -ken و پیوند هم‌زمان چند عمل',
    situation: 'به جای پشت‌سرهم چیدن جمله‌های کوتاه و بریده، دو یا سه عمل مرتبط را در یک جملهٔ روان ترکی به هم پیوند می‌زنید.',
    teachingFa: 'در ترکی استانبولی به جای تکرار چندبارهٔ زمان و شناسه و حرف «ve»، از وجوه قیدی فعل (Zarf-Fiiller) استفاده می‌شود: ۱) پسوند -(y)ıp/-(y)ip/-(y)up/-(y)üp دو فعل هم‌فاعل را پشت سر هم پیوند می‌دهد و زمان و شخص فعل آخر بر اولی هم حاکم است (gidip aldım = رفتم و خریدم)؛ ۲) پسوند -(y)arak/-(y)erek چگونگی انجام کار را بیان می‌کند (dinleyerek öğreniyorum = با گوش دادن یاد می‌گیرم)؛ ۳) پسوند -ken (در حالی که / هنگامِ) روی پایهٔ Geniş Zaman هم‌زمانی را نشان می‌دهد: giderken (هنگام رفتن).',
    rows: [
      ['Markete uğrayıp akşam yemeği için taze ekmek aldım.', 'به سوپرمارکت سر زدم و برای شام نان تازه خریدم.', 'مارکِته اوئرایِیپ آکشام یِمَیی ایچین تازه اَکمَک آلدِیم', 'uğrayıp', 'سر زدم و...', 'ریشه + -(y)ıp برای پیوند دو فعل هم‌فاعل'],
      ['Kısa hikayeler okuyarak yeni kelimeleri bağlam içinde öğreniyorum.', 'با خواندن داستان‌های کوتاه واژه‌های جدید را در بافت یاد می‌گیرم.', 'کِیسا هیکایِلَر اوکویاراک یِنی کِلیمِلَری بائلام ایچینده اوئرَنییوروم', 'okuyarak', 'با خواندنِ...', 'ریشه + -(y)arak / -(y)erek = با انجامِ...'],
      ['İşe giderken trende her sabah podcast dinlerim.', 'هنگام رفتن به سر کار هر صبح در قطار پادکست گوش می‌دهم.', 'ایشه گیدَرکَن ترَنده هَر ساباه پودکَست دینلَریم', 'giderken', 'هنگام رفتن / در راه رفتن', 'Geniş Zaman + -ken = در حینِ'],
      ['Hem tam zamanlı çalışıyor hem de akşamları dil kursuna gidiyor.', 'هم تمام‌وقت کار می‌کند و هم عصرها به کلاس زبان می‌رود.', 'هَم تام زامانلِی چالِیشِییور هَم دِ آکشاملارِی دیل کورسونا گیدییور', 'hem de', 'و هم', 'الگوی هم‌پایگی: hem ... hem (de) ...'],
      ['Ne aradı ne de geleceğine dair kısa bir mesaj gönderdi.', 'نه زنگ زد و نه پیام کوتاهی دربارهٔ آمدنش فرستاد.', 'نِ آرادِی نِ دِ گِلِجَیینه دایر کِیسا بیر مِساژ گوندَردی', 'ne de', 'و نه (با فعل مثبت)', 'ne ... ne (de) با فعل از نظر ظاهری مثبت معنای منفی می‌دهد'],
      ['Çayımızı içip balkonda uzun uzun sohbet ettik.', 'چایمان را نوشیدیم و در بالکن مفصل گپ زدیم.', 'چایِیمِیزِی ایچیپ بالکوندا اوزون اوزون سوهبَت اِتتیک', 'içip', 'نوشیدیم و...'],
      ['Yağmur başlarken biz çoktan eve varmıştık.', 'وقتی باران داشت شروع می‌شد ما خیلی وقت بود به خانه رسیده بودیم.', 'یائْمور باشلارکَن بیز چوکتان اِوه وارمِیشتِیک', 'başlarken', 'هنگام شروع شدن'],
      ['Ya bu akşam yola çıkacağız ya da yarın sabah ilk otobüse bineceğiz.', 'یا امشب راه می‌افتیم یا فردا صبح سوار اولین اتوبوس خواهیم شد.', 'یا بو آکشام یولا چِیکاجائِیز یا دا یارِین ساباه ایلک اوتوبوسه بینِجَییز', 'ya da', 'و یا / یا اینکه', 'الگوی انتخاب: ya ... ya (da) ...'],
    ],
    dialogue: [
      ['رویا', 'Türkçe dinleme becerini bu kadar hızlı nasıl geliştirdin?', 'مهارت شنیداری ترکی‌ات را چطور این‌قدر سریع تقویت کردی؟'],
      ['کان', 'Her gün yürüyüş yaparken Türkçe radyo dinleyerek kulağımı alıştırdım.', 'هر روز هنگام پیاده‌روی با گوش دادن به رادیوی ترکی گوشم را عادت دادم.'],
      ['رویا', 'Bilmediğin kelimeleri duyunca ne yapıyorsun?', 'وقتی واژه‌های ناآشنا می‌شنوی چه می‌کنی؟'],
      ['کان', 'Kısa not alıp akşam evde örnek cümlelerle tekrar ediyorum.', 'یادداشت کوتاهی برمی‌دارم و شب در خانه با جمله‌های نمونه مرور می‌کنم.'],
    ],
    checks: [
      {
        promptFa: 'در جملهٔ «Markete uğrayıp ekmek aldım»، پسوند «-yıp» چه کاری انجام می‌دهد؟',
        choices: ['دو فعل هم‌فاعل را بدون تکرار زمان گذشته به هم پیوند می‌دهد', 'جمله را منفی می‌کند', 'پرسش می‌سازد'],
        correctIndex: 0,
        explanationFa: 'پسوند -(y)ıp زمان و شخص را از فعل پایانی (aldım) می‌گیرد و معنای «سر زدم و خریدم» می‌سازد.',
      },
      {
        promptFa: 'معنای «İşe giderken» چیست؟',
        choices: ['بعد از برگشتن از کار', 'هنگام رفتن به سر کار', 'بدون رفتن به کار'],
        correctIndex: 1,
        explanationFa: 'پسوند -ken روی پایهٔ زمان حال ساده هم‌زمانی («در حینِ / هنگامِ») را بیان می‌کند.',
      },
    ],
  },

  /* ۲۱. بیان هدف و علت در ساختارهای ساده */
  {
    id: 'tr-a2-f-21-purpose-and-reason',
    title: 'بیان هدف و علت در ساختارهای ساده',
    subtitle: 'Foundation · تفاوت هدف (-mak için / diye) با علت (-dığı için / -dan dolayı)',
    situation: 'هدف خود از انجام یک کار («برای اینکه یاد بگیرم») را از علت یک رخداد («به دلیل اینکه دیر شد») متمایز می‌کنید.',
    teachingFa: 'واژهٔ «için» دو ساختار بسیار متفاوت می‌سازد که زبان‌آموز سطح A2 باید دقیق تفکیک کند: ۱) هدف (Amaç): «مصدر کامل -mak/-mek + için» یعنی «برایِ انجامِ کار / به قصدِ» (öğrenmek için = برای یاد گرفتن)؛ و اگر فاعل دو جمله متفاوت باشد از «فعل امری/التزامی + diye» استفاده می‌شود (geç kalmayayım diye = تا دیر نکنم). ۲) علت (Neden): «ریشه + -dığı/-diği için» یا «اسم + -dan/-den dolayı» یعنی «به علت اینکه» (geç kaldığım için = چون دیر رسیدم).',
    rows: [
      ['Telaffuzumu düzeltmek için her gün sesli okuma yapıyorum.', 'برای اصلاح تلفظم هر روز بلندخوانی انجام می‌دهم.', 'تِلافّوزومو دوزَلتمَک ایچین هَر گون سَسلی اوکوما یاپِییوروم', 'düzeltmek için', 'برای اصلاح کردن (هدف)', '-mak/-mek için = بیان هدف'],
      ['Para biriktirmek için gereksiz harcamaları azalttık.', 'برای پس‌انداز کردن پول هزینه‌های غیرضروری را کم کردیم.', 'پارا بیریکتیرمَک ایچین گِرَکسیز هارجامالارِی آزالتتِیک', 'biriktirmek için', 'برای پس‌انداز کردن'],
      ['Üşütmemek için dışarı çıkarken kalın atkımı taktım.', 'برای اینکه سرما نخورم هنگام بیرون رفتن شال‌گردن ضخیمم را بستم.', 'اوشوتمِمَک ایچین دِیشارِی چِیکارکَن کالِین آتکِیمِی تاکتِیم', 'üşütmemek için', 'برای سرما نخوردن', 'هدف منفی: -mamak/-memek için'],
      ['Sen rahat çalışasın diye televizyonun sesini kıstım.', 'تا تو راحت کار کنی صدای تلویزیون را کم کردم.', 'سَن راهات چالِیشاسِین دییه تِلِویزیونون سِسینی کِیستِیم', 'diye', 'برای اینکه / تا', 'التزامی + diye وقتی فاعل دو بخش متفاوت است'],
      ['Yol çalışması olduğundan dolayı otobüs güzergâh değiştirdi.', 'به دلیل وجود تعمیرات جاده، اتوبوس مسیرش را تغییر داد.', 'یول چالِیشماسِی اولدوئوندان دولایِی اوتوبوس گوزَرگاه دِییشتیردی', 'dolayı', 'به علتِ / از بابتِ', '-dan/-den dolayı = بیان علت'],
      ['Sabah erken uyandığım için bütün işlerimi öğlene kadar bitirdim.', 'چون صبح زود بیدار شدم همهٔ کارهایم را تا ظهر تمام کردم.', 'ساباه اَرکَن اویاندِیئِیم ایچین بوتون ایشلَریمی اوئلِنه کادار بیتیردیم', 'uyandığım için', 'چون بیدار شدم (علت)', '-dığım/-diğim için = علت اول‌شخص'],
      ['Vize işlemlerini tamamlamak amacıyla konsolosluktan randevu aldı.', 'با هدف تکمیل کارهای ویزا از کنسولگری وقت گرفت.', 'ویزه ایشلَملَرینی تاماملاماک آماجِییلا کونسولوسلوکتان راندِوو آلدِی', 'amacıyla', 'با هدفِ', '-mak/-mek amacıyla = بیان رسمی‌تر هدف'],
      ['Adres bilgisini eksik yazdığın için kargo geri dönmüş.', 'چون اطلاعات نشانی را ناقص نوشتی بسته برگشت خورده است.', 'آدرَس بیلگیسینی اَکسیک یازدِیئِین ایچین کارگو گِری دونموش', 'yazdığın için', 'چون نوشتی (علت دوم‌شخص)'],
    ],
    dialogue: [
      ['نگار', 'Bu sabah neden bu kadar erken evden çıktın?', 'امروز صبح چرا این‌قدر زود از خانه بیرون زدی؟'],
      ['تونا', 'Trafiğe kalmamak için saat yedide yola çıktım.', 'برای اینکه به ترافیک نخورم ساعت هفت راه افتادم.'],
      ['نگار', 'İyi yapmışsın; yağmur yağdığı için ana cadde çok kalabalıktı.', 'کار خوبی کرده‌ای؛ چون باران می‌بارید خیابان اصلی خیلی شلوغ بود.'],
      ['تونا', 'Evet, erken çıktığım için toplantıya tam vaktinde yetiştim.', 'بله، چون زود راه افتادم دقیقاً به‌موقع به جلسه رسیدم.'],
    ],
    checks: [
      {
        promptFa: 'کدام گزینه بیانگر «هدف» (برای اینکه سرما نخورم) است؟',
        choices: ['üşütmemek için', 'üşüttüğüm için', 'üşütmekten sonra'],
        correctIndex: 0,
        explanationFa: 'مصدر کامل منفی (-mamak/-memek) همراه با için هدف را بیان می‌کند، اما -dığım için علت رخ‌داده است.',
      },
      {
        promptFa: 'عبارت «uyandığım için» چه معنایی دارد؟',
        choices: ['برای اینکه بیدار شوم', 'چون بیدار شدم', 'پیش از بیدار شدن'],
        correctIndex: 1,
        explanationFa: 'ساختار صفت‌فعلی «-dığım için» علت تحقق‌یافته («چون بیدار شدم») را نشان می‌دهد.',
      },
    ],
  },

  /* ۲۲. استفاده از حروف ربط و پیونددهنده‌های پرکاربرد (Ve, Ama, Fakat, Çünkü, Bu yüzden) */
  {
    id: 'tr-a2-f-22-common-conjunctions',
    title: 'استفاده از حروف ربط و پیونددهنده‌های پرکاربرد (Ve, Ama, Fakat, Çünkü, Bu yüzden)',
    subtitle: 'Foundation · انسجام گفتار با ve، ama، fakat، ancak، üstelik، yoksa و oysa',
    situation: 'در گفتگو و نوشتار، جمله‌ها را با حروف ربط افزودن، تضاد، سبب، نتیجه و جایگزینی به‌نرمی به هم وصل می‌کنید.',
    teachingFa: 'حروف ربط پرکاربرد ترکی استانبولی به کلام انسجام می‌دهند: ۱) هم‌پایگی و افزودن: ve (و)، ayrıca / üstelik (علاوه بر این / تازه)؛ ۲) تضاد و استدراک: ama، fakat، ancak (اما / ولی — fakat و ancak کمی رسمی‌ترند) و oysa (در حالی که)؛ ۳) انتخاب و هشدار: veya / ya da (یا) و yoksa (وگرنه / یا در پرسش دوگزینه‌ای)؛ ۴) علت و نتیجه: çünkü (چون) و bu yüzden (به همین دلیل).',
    rows: [
      ['Otel merkeze çok yakın ve odaları tertemiz.', 'هتل به مرکز شهر خیلی نزدیک است و اتاق‌هایش بسیار تمیز است.', 'اوتَل مَرکِزه چوک یاکِین وِ اودالارِی تَرتِمیز', 've', 'و'],
      ['Bu ceketi çok beğendim ama bedeni bana biraz küçük geldi.', 'از این کت خیلی خوشم آمد اما سایزش برایم کمی کوچک بود.', 'بو جِکِتی چوک بَیَندیم آما بِدِنی بانا بیراز کوچوک گَلدی', 'ama', 'اما / ولی', 'بیان تقابل با ama'],
      ['Seni aramak istedim, fakat telefonumun şarjı bitmişti.', 'خواستم به تو زنگ بزنم، منتها شارژ تلفنم تمام شده بود.', 'سِنی آراماک ایستِدیم، فاکات تِلِفونومون شارژِی بیتمیشتی', 'fakat', 'منتها / اما'],
      ['Bu lokantanın yemekleri çok lezzetli; üstelik fiyatları da makul.', 'غذاهای این رستوران خیلی خوش‌مزه است؛ علاوه بر آن قیمت‌هایش هم منطقی است.', 'بو لوکانتانِین یِمَکلَری چوک لِزّتلی؛ اوستِلیک فییاتلارِی دا ماکول', 'üstelik', 'علاوه بر این / تازه', 'افزودن نکتهٔ تقویت‌کننده با üstelik'],
      ['Acele etmeliyiz, yoksa son vapuru kaçıracağız.', 'باید عجله کنیم، وگرنه آخرین کشتی را از دست خواهیم داد.', 'آجِله اِتمِلیییز، یوکسا سون واپورو کاچِیراجائِیز', 'yoksa', 'وگرنه / در غیر این صورت'],
      ['Dışarıda kar yağıyor, bu yüzden kalın botlarımı giydim.', 'بیرون برف می‌بارد، به همین دلیل پوتین‌های ضخیمم را پوشیدم.', 'دِیشارِیدا کار یائِییور، بو یوزدَن کالِین بوتلارِیمِی گییدیم', 'bu yüzden', 'به همین دلیل'],
      ['Erken yattım, çünkü yarın sabah önemli bir sunumum var.', 'زود خوابیدم، چون فردا صبح ارائهٔ مهمی دارم.', 'اَرکَن یاتتِیم، چونکو یارِین ساباه اونَملی بیر سونوموم وار', 'çünkü', 'چون / زیرا'],
      ['Teklifiniz güzel; ancak bütçe konusunu tekrar değerlendirmeliyiz.', 'پیشنهادتان خوب است؛ با این حال موضوع بودجه را باید دوباره ارزیابی کنیم.', 'تَکلیفینیز گوزَل؛ آنجاک بوتچه کونوسونو تِکرار دَیَرلَندیرمِلیییز', 'ancak', 'با این حال / اما (کمی رسمی)'],
    ],
    dialogue: [
      ['سعید', 'Hafta sonu için doğa yürüyüşü planladık; sen de gelir misin?', 'برای آخر هفته پیاده‌روی در طبیعت برنامه‌ریزی کردیم؛ تو هم می‌آیی؟'],
      ['ملتم', 'Çok gelmek isterim, fakat cumartesi sabahı dişçi randevum var.', 'خیلی دلم می‌خواهد بیایم، اما شنبه صبح نوبت دندان‌پزشکی دارم.'],
      ['سعید', 'Hiç sorun değil! Biz pazar günü gideceğiz, çünkü cumartesi yağmur bekleniyor.', 'اصلاً مشکلی نیست! ما روز یکشنبه خواهیم رفت، چون شنبه باران پیش‌بینی می‌شود.'],
      ['ملتم', 'Harika, bu yüzden ben de rahatça katılabilirim; üstelik fotoğraf makinemi de getiririm.', 'عالی، به همین خاطر من هم راحت می‌توانم شرکت کنم؛ تازه دوربین عکاسی‌ام را هم می‌آورم.'],
    ],
    checks: [
      {
        promptFa: 'در جملهٔ «Acele etmeliyiz, yoksa son vapuru kaçıracağız»، واژهٔ «yoksa» چه معنایی دارد؟',
        choices: ['وگرنه / در غیر این صورت', 'به لطفِ آن', 'همیشه'],
        correctIndex: 0,
        explanationFa: 'yoksa در پیوند دو جمله معنای «وگرنه / در غیر این صورت» می‌دهد.',
      },
      {
        promptFa: 'کدام پیونددهنده برای افزودن یک ویژگی مثبت دیگر («علاوه بر این / تازه») به کار می‌رود؟',
        choices: ['fakat', 'üstelik', 'çünkü'],
        correctIndex: 1,
        explanationFa: 'üstelik (علاوه بر این / تازه) یک استدلال یا ویژگی هم‌جهت را به جملهٔ قبل اضافه می‌کند.',
      },
    ],
  },

  /* ۲۳. بیان غیرمستقیم و بازگویی ساده گفته‌های دیگران */
  {
    id: 'tr-a2-f-23-indirect-speech-basics',
    title: 'بیان غیرمستقیم و بازگویی ساده گفته‌های دیگران',
    subtitle: 'Foundation · نقل قول مستقیم با «... dedi» و بازگویی غیرمستقیم با -dığını / -acağını söylemek',
    situation: 'پیام یک همکار، دستور پزشک یا حرف دوستتان را برای نفر سوم بازگو می‌کنید.',
    teachingFa: 'در سطح A2 دو راه روشن برای بازگویی گفته‌ها وجود دارد: ۱) نقل مستقیم با حفظ جمله و گذاشتن «dedi / söyledi» در پایان: Ali, "Yarın geleceğim," dedi؛ ۲) نقل غیرمستقیم (Dolaylı Anlatım): برای جملهٔ خبری در حال یا گذشته از «ریشه + -dığını/-diğini + söyledi» و برای آینده از «ریشه + -acağını/-eceğini + söyledi» استفاده می‌کنیم؛ و برای بازگویی جملهٔ امری از «مصدر کوتاه + ملکی + مفعولی + söyledi/istedi» بهره می‌گیریم: Doktor dinlenmemi söyledi (پزشک گفت که استراحت کنم).',
    rows: [
      ['Merve bana bugün biraz geç geleceğini söyledi.', 'مروه به من گفت که امروز کمی دیر خواهد آمد.', 'مَروه بانا بوگون بیراز گِچ گِلِجَیینی سویلِدی', 'geleceğini söyledi', 'گفت که خواهد آمد', '-acağını/-eceğini + söylemek (نقل آینده)'],
      ['Doktor birkaç gün evde dinlenmemi söyledi.', 'پزشک گفت که چند روز در خانه استراحت کنم.', 'دوکتور بیرکاچ گون اِوده دینلَنمَمی سویلِدی', 'dinlenmemi söyledi', 'گفت که استراحت کنم', 'بازگویی جملهٔ امری با -mamı/-memi söyledi'],
      ['Müdür, toplantının saat ikiye alındığını duyurdu.', 'مدیر اعلام کرد که جلسه به ساعت دو منتقل شده است.', 'مودور، توپلانتِینِین ساعات ایکییه آلِیندِیئِینِی دویوردو', 'alındığını', 'اینکه منتقل شده را', '-dığını/-diğini + duyurmak/söylemek'],
      ['Emre, "Bu akşam raporu kesinlikle bitireceğim," dedi.', 'امره گفت: «امشب گزارش را حتماً تمام خواهم کرد.»', 'اَمره، بو آکشام راپورو کِسینلیکله بیتیرِجَییم، دِدی', 'dedi', 'گفت (پس از نقل مستقیم)', 'نقل مستقیم + dedi'],
      ['Öğretmenimiz her gün yüksek sesle pratik yapmamızı önerdi.', 'معلممان پیشنهاد داد که هر روز با صدای بلند تمرین کنیم.', 'اوئرَتمِنیمیز هَر گون یوکسَک سَسله پراتیک یاپمامِیزِی اونَردی', 'yapmamızı önerdi', 'پیشنهاد داد که انجام دهیم'],
      ['Komşumuz kargoyu bizim yerimize teslim aldığını haber verdi.', 'همسایه‌مان خبر داد که بسته را به جای ما تحویل گرفته است.', 'کومشوموز کارگویو بیزیم یِریمیزه تِسلیم آلدِیئِینِی هابَر وَردی', 'aldığını', 'اینکه تحویل گرفته است را'],
      ['Rehber, müzenin pazartesi günleri kapalı olduğunu belirtti.', 'راهنما خاطرنشان کرد که موزه روزهای دوشنبه بسته است.', 'رَهبَر، موزِنین پازارتِسی گونلَری کاپالِی اولدوئونو بِلیرتتی', 'olduğunu belirtti', 'بیان کرد که هست', 'بازگویی جملهٔ اسمی با olduğunu'],
      ['Annem telefonda akşam yemeğine erken gelmemi istedi.', 'مادرم پشت تلفن از من خواست برای شام زود بیایم.', 'آننَم تِلِفوندا آکشام یِمَیینه اَرکَن گَلمَمی ایستِدی', 'gelmemi istedi', 'خواست که بیایم'],
    ],
    dialogue: [
      ['پیمان', 'Selim’le konuştun mu, akşamki maça geliyor mu?', 'با سلیم صحبت کردی، به مسابقهٔ امشب می‌آید؟'],
      ['دنیز', 'Az önce konuştum; işinin uzadığını ve maça gelemeyeceğini söyledi.', 'چند لحظه پیش صحبت کردم؛ گفت که کارش طولانی شده و نخواهد توانست به مسابقه بیاید.'],
      ['پیمان', 'Peki bileti ne yapmamızı istedi?', 'خب خواست بلیت را چه کار کنیم؟'],
      ['دنیز', 'Bileti başka bir arkadaşımıza verebileceğimizi söyledi.', 'گفت که می‌توانیم بلیت را به یکی دیگر از دوستانمان بدهیم.'],
    ],
    checks: [
      {
        promptFa: 'جملهٔ «Doktor dinlenmemi söyledi» به چه معناست؟',
        choices: ['پزشک گفت که خودش استراحت می‌کند', 'پزشک گفت که من استراحت کنم', 'من به پزشک گفتم استراحت کند'],
        correctIndex: 1,
        explanationFa: 'پسوند ملکی اول‌شخص در dinlen-me-m-i نشان می‌دهد که مخاطبِ دستورِ پزشک «من» هستم.',
      },
      {
        promptFa: 'برای بازگویی غیرمستقیمِ رویداد آینده («گفت که دیر خواهد آمد») کدام شکل درست است؟',
        choices: ['geç geleceğini söyledi', 'geç gelmek dedi', 'geç gelsin konuştu'],
        correctIndex: 0,
        explanationFa: 'پایهٔ آینده (-ecek) با پسوند ملکی و مفعولی به شکل «geleceğini söyledi» بازگویی غیرمستقیم آینده را می‌سازد.',
      },
    ],
  },

  /* ۲۴. تقویت پسوندهای حالت اسم (İsmin Hâlleri) و پسوندهای ملکی */
  {
    id: 'tr-a2-f-24-cases-and-possessives',
    title: 'تقویت پسوندهای حالت اسم (İsmin Hâlleri) و پسوندهای ملکی',
    subtitle: 'Foundation · ترکیب پسوند ملکی با حالت‌های اسم و همخوان میانجی «n» در سوم‌شخص',
    situation: 'پسوندهای ملکی و حالت‌های چهارگانهٔ اسم را با هم ترکیب می‌کنید («درِ خانه‌اش»، «به دوستت»، «از اتاقمان»).',
    teachingFa: 'هنگامی که اسم نخست پسوند ملکی بگیرد و سپس پسوند حالت (مفعولی، جهتی، مکانی، مبدأ) به آن اضافه شود، یک نکتهٔ بسیار مهم رخ می‌دهد: در سوم‌شخص مفرد و جمع (پسوند ملکی -(s)ı/-(s)i/-(s)u/-(s)ü و -ları/-leri) پیش از هر پسوند حالت، حرف میانجی «n» الزامی است! مقایسه کنید: senin ev-in-de (در خانهٔ تو) در برابر onun ev-i-n-de (در خانهٔ او)، arkadaşına (به دوستش)، kitabını (کتابش را)، odasından (از اتاقش).',
    rows: [
      ['Arkadaşımın evinde küçük ama çok güzel bir kütüphane var.', 'در خانهٔ دوستم یک کتابخانهٔ کوچک اما بسیار زیبا هست.', 'آرکاداشِیمِین اِوینده کوچوک آما چوک گوزَل بیر کوتوپهانه وار', 'evinde', 'در خانه‌اش', 'ev + i (ملکی سوم‌شخص) + n (میانجی) + de'],
      ['Mesajımı görür görmez bana hemen cevap yazdı.', 'به محض دیدن پیامم فوراً برایم پاسخ نوشت.', 'مِساژِیمِی گورور گورمَز بانا هِمَن جِواپ یازدِی', 'mesajımı', 'پیامم را', 'mesaj + ım (ملکی اول‌شخص) + ı (مفعولی)'],
      ['Kardeşine doğum günü için güzel bir kol saati aldık.', 'برای تولد به برادرت/خواهرت (یا برادرش/خواهرش) یک ساعت مچی زیبا خریدیم.', 'کاردِشینه دوئوم گونو ایچین گوزَل بیر کول ساعاتی آلدِیک', 'kardeşine', 'به برادرش / به برادرت'],
      ['Ofisimizden metro istasyonuna yürüyerek beş dakikada gidiyoruz.', 'از دفترمان تا ایستگاه مترو پیاده پنج‌دقیقه‌ای می‌رویم.', 'اوفیسیمیزدَن مِترو ایستاسیونونا یورویِرَک بَش داکیکادا گیدییوروز', 'ofisimizden', 'از دفترمان', 'ofis + imiz (ملکی ما) + den (مبدأ)'],
      ['Komşumuzun bahçesinden taze erik topladık.', 'از باغچهٔ همسایه‌مان گوجه‌سبز تازه چیدیم.', 'کومشوموزون باهچِسیندَن تازه اِریک توپلادِیک', 'bahçesinden', 'از باغچه‌اش', 'bahçe + si + n (میانجی) + den'],
      ['Çantasını masanın üstüne koyup pencerenin yanına oturdu.', 'کیفش را روی میز گذاشت و کنار پنجره نشست.', 'چانتاسِینِی ماسانِین اوستونه کویوپ پَنجِرِنین یانِینا اوتوردو', 'çantasını', 'کیفش را', 'çanta + sı + n (میانجی) + ı (مفعولی)'],
      ['Bilgisayarının ekranını yumuşak bir bezle sildi.', 'صفحهٔ رایانه‌اش را با دستمالی نرم پاک کرد.', 'بیلگیسایارِینِین اِکرانِینِی یوموشاک بیر بَزله سیلدی', 'ekranını', 'صفحه‌اش را'],
      ['Ailemizin yeni adresini kargo formuna dikkatle yazdım.', 'نشانی جدید خانواده‌مان را با دقت در فرم پست نوشتم.', 'آیلِمیزین یِنی آدرِسینی کارگو فورمونا دیکّاتله یازدِیم', 'adresini', 'نشانی‌اش را'],
    ],
    dialogue: [
      ['سمیرا', 'Gözlüğümü bulamıyorum, masamın üstüne baktın mı?', 'عینکم را پیدا نمی‌کنم، روی میزم را نگاه کردی؟'],
      ['یوسف', 'Masana baktım ama orada yok; ceketinin cebinde olabilir mi?', 'به میزت نگاه کردم اما آنجا نیست؛ ممکن است در جیب کتت باشد؟'],
      ['سمیرا', 'Haklısın, sabah toplantı odasından çıkarken cebime koymuştum!', 'حق با توست، صبح موقع بیرون آمدن از اتاق جلسه در جیبم گذاشته بودم!'],
      ['یوسف', 'Harika, ben de şimdi arabanın anahtarını vestiyerden alıyorum.', 'عالی، من هم الان کلید خودرو را از رخت‌آویز برمی‌دارم.'],
    ],
    checks: [
      {
        promptFa: 'چرا در «bahçesinden» (از باغچه‌اش) پیش از پسوند «-den» حرف «n» آمده است؟',
        choices: ['پس از پسوند ملکی سوم‌شخص (-ı/-i/-sı/-si) پیش از پسوند حالت، همخوان میانجی n الزامی است', 'چون جمع است', 'چون فعل امری است'],
        correctIndex: 0,
        explanationFa: 'پس از پسوند ملکی سوم‌شخص، پیش از تمام پسوندهای حالت (-ı، -a، -da، -dan) حرف میانجی n قرار می‌گیرد: bahçe-si-n-den.',
      },
      {
        promptFa: 'کدام گزینه به معنی «از دفترمان» است؟',
        choices: ['ofisimizden', 'ofisimizde', 'ofisimize'],
        correctIndex: 0,
        explanationFa: 'ofis + imiz (ملکی اول‌شخص جمع) + den (حالت مبدأ «از») = ofisimizden.',
      },
    ],
  },

  /* ۲۵. ساخت پرسش‌های چندبخشی و جمله‌های منفی پیچیده‌تر */
  {
    id: 'tr-a2-f-25-multipart-questions-negation',
    title: 'ساخت پرسش‌های چندبخشی و جمله‌های منفی پیچیده‌تر',
    subtitle: 'Foundation · پرسش‌های دوگزینه‌ای با mı… yoksa… mı، تأیید با değil mi و نفی ترکیبی',
    situation: 'پرسش‌های دقیق دوگزینه‌ای، پرسش‌های تأییدی و جمله‌های منفی چندبخشی را روان و درست می‌سازید.',
    teachingFa: 'در پرسش دوگزینه‌ای ترکی استانبولی، ادات پرسش «mı/mi/mu/mü» بلافاصله پس از هر گزینه تکرار می‌شود و میان دو گزینه واژهٔ «yoksa» می‌آید: Çay mı içersin yoksa kahve mi? (چای می‌نوشی یا قهوه؟). برای پرسش تأییدی در پایان جمله (مگر نه؟ / درست است؟) عبارت ثابت «değil mi?» قرار می‌گیرد. همچنین در نفی تأکیدی، «hiçbir» (هیچ‌یک) و «kimse» (هیچ‌کس) در ترکی همیشه با فعل منفی به کار می‌روند: Kimse gelmedi (هیچ‌کس نیامد).',
    rows: [
      ['Havaalanına metroyla mı gideceksin yoksa servis otobüsüne mi bineceksin?', 'به فرودگاه با مترو خواهی رفت یا سوار اتوبوس سرویس خواهی شد؟', 'هاواآلانِینا مِترویلا مِی گیدِجَکسین یوکسا سَرویس اوتوبوسونه مو بینِجَکسین', 'yoksa', 'یا (در پرسش دوگزینه‌ای)', 'گزینهٔ ۱ + mı ... yoksa + گزینهٔ ۲ + mi'],
      ['Yarınki toplantı saat onda başlıyor, değil mi?', 'جلسهٔ فردا ساعت ده شروع می‌شود، مگر نه؟', 'یارِینکِی توپلانتِی ساعات اوندا باشلِییور، دِئیل می', 'değil mi', 'مگر نه؟ / این‌طور نیست؟', 'پرسش تأییدی در پایان جمله'],
      ['Bugün ofiste kimseyi göremedim; herkes uzaktan mı çalışıyor?', 'امروز در دفتر نتوانستم هیچ‌کس را ببینم؛ همه دورکاری می‌کنند؟', 'بوگون اوفیسته کیمسِیی گورِمِدیم؛ هَرکَس اوزاکتان مِی چالِیشِییور', 'kimseyi', 'هیچ‌کس را (با فعل منفی)', 'kimse + فعل منفی'],
      ['Bu konuda hiçbir açıklama yapılmadı ve kimse bilgi vermedi.', 'در این باره هیچ توضیحی داده نشد و هیچ‌کس اطلاع نداد.', 'بو کونودا هیچ‌بیر آچِیکلاما یاپِیلمادِی وِ کیمسه بیلگی وَرمِدی', 'hiçbir', 'هیچ / هیچ‌گونه (با فعل منفی)'],
      ['Ödemeyi nakit mi yapacaksınız yoksa kredi kartıyla mı?', 'پرداخت را نقدی انجام خواهید داد یا با کارت اعتباری؟', 'اودِمِیی ناکیت می یاپاجاکسِینِیز یوکسا کرِدی کارتِییلا مِی', 'nakit mi', 'نقدی؟ (تمرکز پرسش روی قید)'],
      ['Seni rahatsız etmiyorum, değil mi; müsait misin?', 'مزاحمت نمی‌شوم، مگر نه؛ وقتت آزاد است؟', 'سِنی راهاتسِیز اِتمییوروم، دِئیل می؛ موساییت میسین', 'müsait misin', 'آزاد / در دسترس هستی؟'],
      ['Sadece hafta içi değil, hafta sonu da kütüphane açık oluyor.', 'نه تنها طول هفته، بلکه آخر هفته هم کتابخانه باز است.', 'سادِجه هافتا ایچی دِئیل، هافتا سونو دا کوتوپهانه آچِیک اولویور', 'sadece hafta içi değil', 'نه فقط طول هفته', 'الگوی sadece ... değil, ... da/de'],
      ['Neden beni aramadığını ve mesajlarıma dönmediğini anlayamadım.', 'نتوانستم بفهمم چرا به من زنگ نزدی و به پیام‌هایم برنگشتی.', 'نِدَن بِنی آرامادِیئِینِی وِ مِساژلارِیما دونمِدییینی آنلایامادِیم', 'aramadığını', 'اینکه زنگ نزدی را', 'پرسش غیرمستقیم منفی با -madığını'],
    ],
    dialogue: [
      ['پژمان', 'Kursa sabah grubunda mı kayıt oldun yoksa akşam grubunda mı?', 'در کلاس در گروه صبح ثبت‌نام کردی یا در گروه عصر؟'],
      ['گولشن', 'Akşam grubunu seçtim; senin dersin de salı ve perşembe günleri, değil mi?', 'گروه عصر را انتخاب کردم؛ کلاس تو هم روزهای سه‌شنبه و پنج‌شنبه است، مگر نه؟'],
      ['پژمان', 'Evet! Hiçbir dersi kaçırmak istemiyorum, kitapları da dün aldım.', 'بله! نمی‌خواهم هیچ جلسه‌ای را از دست بدهم، کتاب‌ها را هم دیروز خریدم.'],
      ['گولشن', 'Harika, o zaman salı akşamı sınıfın önünde buluşuruz.', 'عالی، پس عصر سه‌شنبه جلوی کلاس همدیگر را می‌بینیم.'],
    ],
    checks: [
      {
        promptFa: 'در ترکی استانبولی واژه‌های «kimse» و «hiçbir» با چه نوع فعلی به کار می‌روند؟',
        choices: ['در جمله‌های خبری منفی با فعل منفی به کار می‌روند', 'فقط با فعل امری مثبت', 'هرگز با فعل نمی‌آیند'],
        correctIndex: 0,
        explanationFa: 'در ترکی برخلاف انگلیسی هم‌نشینی kimse / hiçbir با فعل منفی الزامی است: Kimse bilgi vermedi.',
      },
      {
        promptFa: 'کدام گزینه پرسش دوگزینه‌ای استاندارد ترکی است؟',
        choices: ['Nakit mi yoksa kartıyla mı?', 'Nakit veya kart mı yoksa?', 'Mı nakit kart yoksa?'],
        correctIndex: 0,
        explanationFa: 'در پرسش دوگزینه‌ای ادات پرسش پس از گزینهٔ اول، سپس yoksa و دوباره ادات پرسش پس از گزینهٔ دوم می‌آید.',
      },
    ],
  },

  /* ۲۶. تقویت هماهنگی واکه‌ها و انتخاب صحیح پسوندها */
  {
    id: 'tr-a2-f-26-vowel-harmony-suffix-mastery',
    title: 'تقویت هماهنگی واکه‌ها و انتخاب صحیح پسوندها',
    subtitle: 'Foundation · هماهنگی دوگانه و چهارگانه، نرم‌شدن همخوان‌ها، همگونی بی‌واک و استثناهای پرکاربرد',
    situation: 'زنجیرهٔ پسوندها را روی واژه‌های بومی و وام‌واژه‌های استثنایی (مانند saat، kalp، seyahat) بی‌غلط انتخاب می‌کنید.',
    teachingFa: 'جمع‌بندی طلایی انتخاب پسوند در سطح A2: ۱) هماهنگی دوگانه (-a/-e برای جمع، حالت‌های مکانی/جهتی/مبدأ، آینده، شرط، وجوبی) و هماهنگی چهارگانه (-ı/-i/-u/-ü برای مفعولی، ملکی، گذشته و حال استمراری) همیشه به آخرین واکهٔ واژه نگاه می‌کند. ۲) نرم‌شدن p/ç/t/k پیش از واکه به b/c/d/ğ: kitap→kitabı، ağaç→ağacı، sokak→sokağa. ۳) همگونی همخوان پس از «f s t k ç ş h p»: mutfak+da → mutfakta، iş+den → işten. ۴) چند وام‌واژهٔ بسیار پرکاربرد با وجود واکهٔ پسین a، پسوند پیشین می‌گیرند: saat → saatler / saatte، seyahat → seyahate، kalp → kalbi، dikkat → dikkatli.',
    rows: [
      ['Saatler ileri alındığı için bu sabah saat yedide uyandık.', 'چون ساعت‌ها جلو کشیده شد امروز صبح ساعت هفت بیدار شدیم.', 'ساعاتلَر ایلِری آلِیندِیئِی ایچین بو ساباه ساعات یِدیده اویاندِیک', 'saatler', 'ساعت‌ها (استثنای هماهنگی)', 'استثنای saat: واکهٔ a ظریف است → saatler / saatte'],
      ['Uzun iş seyahatlerinde yanımıza sadece el bagajı alıyoruz.', 'در سفرهای کاری طولانی فقط ساک دستی با خود برمی‌داریم.', 'اوزون ایش سِیاهاتلَرینده یانِیمِیزا سادِجه اَل باگاژِی آلِییوروز', 'seyahatlerinde', 'در سفرهایِ آن (استثنای پیشین)', 'seyahat + ler + i + n + de'],
      ['Ağacın altındaki ahşap bankta oturup denizi seyrettik.', 'روی نیمکت چوبیِ زیرِ درخت نشستیم و دریا را تماشا کردیم.', 'آئاجِین آلتِینداکی آهشاپ بانکتا اوتوروپ دِنیزی سَیرَتتیک', 'ağacın', 'درختِ (ağaç → ağacın)', 'نرم‌شدن ç→c در ağacın و سخت‌شدن d→t در bankta'],
      ['Mutfaktan gelen taze kurabiye kokusu bütün evi sardı.', 'بوی شیرینی تازه‌ای که از آشپزخانه می‌آمد تمام خانه را پر کرد.', 'موتفاکتان گِلَن تازه کورابییه کوکوسو بوتون اِوی ساردِی', 'mutfaktan', 'از آشپزخانه', 'mutfak (ختم به k) + -dan → mutfaktan'],
      ['Kalbi çok temiz bir insan; herkese içtenlikle yardım eder.', 'انسانی بسیار پاک‌دل است؛ به همه صمیمانه کمک می‌کند.', 'کالبی چوک تِمیز بیر اینسان؛ هَرکِسه ایچتَنلیکله یاردِیم اِدَر', 'kalbi', 'قلبش (استثنای p→b + پیشین)', 'kalp → kalb-i (هم نرم‌شدن p→b و هم پسوند پیشین -i)'],
      ['Sokağın sonundaki fırından sıcak simit ve poğaça aldım.', 'از نانواییِ تهِ کوچه سیمیت و پوآچای داغ خریدم.', 'سوکائِین سونونداکی فِیرِیندان سِیجاک سیمیت وِ پوئاچا آلدِیم', 'sokağın', 'کوچه (sokak → sokağın)'],
      ['Gözlüklerimi çalışma masasının çekmecesinde unutmuşum.', 'عینکم را در کشوی میز کار جا گذاشته‌ام.', 'گوزلوکلَریمی چالِیشما ماساسِینِین چَکمِجِسینده اونوتموشوم', 'gözlüklerimi', 'عینک‌هایم را', 'هماهنگی پیشین گرد و غیرگرد: gözlük-ler-im-i'],
      ['Çiçekçiden aldığım buketi salonun ortasındaki vazoya koydum.', 'دسته‌گلی را که از گل‌فروشی خریدم در گلدانِ وسطِ پذیرایی گذاشتم.', 'چیچَکچیدَن آلدِیئِیم بوکِتی سالونون اورتاسِینداکی وازویا کویدوم', 'çiçekçiden', 'از گل‌فروشی', 'çiçek + çi (شغل پس از k) + den'],
    ],
    dialogue: [
      ['فرزانه', 'Türkçede "saatlar" mı demeliyim yoksa "saatler" mi?', 'در ترکی باید «saatlar» بگویم یا «saatler»؟'],
      ['استاد باریش', '"Saatler" demelisin; "saat", "seyahat" ve "kalp" gibi bazı kelimeler ince ek alır.', 'باید «saatler» بگویی؛ برخی واژه‌ها مانند saat، seyahat و kalp پسوند پیشین (ظریف) می‌گیرند.'],
      ['فرزانه', 'Peki "mutfakdan" neden yanlış sayılıyor?', 'خب چرا «mutfakdan» نادرست شمرده می‌شود؟'],
      ['استاد باریش', 'Çünkü "mutfak" kelimesi sert "k" sesiyle biter; bu yüzden ek "-tan" olur: mutfaktan.', 'چون واژهٔ mutfak به صدای بی‌واک «k» ختم می‌شود؛ به همین دلیل پسوند به «-tan» تبدیل می‌شود: mutfaktan.'],
    ],
    checks: [
      {
        promptFa: 'کدام گزینه جمع و حالت مکانی درست برای واژهٔ استثنایی «saat» است؟',
        choices: ['saatlar / saatda', 'saatler / saatte', 'saatlar / saatta'],
        correctIndex: 1,
        explanationFa: 'واژهٔ saat از استثناهای هماهنگی واکه‌هاست و پسوند پیشین می‌گیرد؛ همچنین پس از t بی‌واک، -de به -te تبدیل می‌شود: saatler / saatte.',
      },
      {
        promptFa: 'وقتی به واژهٔ «sokak» پسوند واکه‌دار اضافه شود، چه تغییری رخ می‌دهد؟',
        choices: ['k پایانی به ğ نرم می‌شود: sokağın / sokağa', 'هیچ تغییری نمی‌کند: sokakın', 'حرف s حذف می‌شود'],
        correctIndex: 0,
        explanationFa: 'در واژه‌های چندسیلابی مختوم به k، پیش از پسوند واکه‌دار حرف k به ğ تبدیل می‌شود: sokak → sokağın.',
      },
    ],
  },
];

export const TURKISH_A2_FOUNDATION_PART_B = buildTurkishLessons(A2_FOUNDATION_PART_B_SEEDS, 'tr3', 105);
