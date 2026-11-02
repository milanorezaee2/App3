import { buildTurkishLessons, type TurkishLessonSeed } from './turkishSeed';

const B2_FOUNDATION_PART_B_SEEDS: readonly TurkishLessonSeed[] = [
 {
 id: 'tr-b2-f-27-complex-compound-long-sentences',
 title: 'ساخت جمله‌های مرکب و طولانی با انسجام بالا',
    subtitle: 'Foundation · جملات طولانی منسجم',
 situation: 'ایده‌های چندلایه را در جمله‌های طولانی اما روان و منسجم بیان می‌کنید.',
 teachingFa: 'جملهٔ B2 می‌تواند چند بند وابسته داشته باشد: « iken -ken -dığı için -sa bile».',
 rows: [
 ['Hava kötü olmasına rağmen ve trafik yoğun olduğu için yine de yola çıktık.', 'هرچند هوا بد بود و ترافیک سنگین بود، باز هم راه افتاد.', 'هاوا کاوتاو ولماسینا راغمهن وه ترافیک یوغون ولدوغو یچین یینه ده یولا چیکتیک.', 'yine de yola çıktık', 'باز هم راه افتاد', 'الگوی نحوی: ساختار جملهٔ ترکی استانبولی'],
 ['Raporu bitirdiğimde ve yöneticiye gönderdiğimde proje başlayacak.', 'وقتی گزارش را تمام کنم و برای مدیر بفرستم پروژه شروع می‌شود.', 'راپورو بیتیردیغیمده وه یاونهتیجییه گاوندهردیغیمده پروژه باشلایاجاک.', 'proje başlayacak', 'پروژه شروع می‌شود'],
 ['Eğer bu veriler doğruysa hipotez değişir; aksi takdirde aynı kalır.', 'اگر داده‌ها درست باشد فرضیه تغییر می‌کند؛ در غیر این صورت همان می‌ماند.', 'هغهر بو وهریلهر دوغرویسا هیپوتهز دهغیشیر; اکسی تاکدیرده اینی کالیر.', 'aksi takdirde', 'در غیر این صورت'],
 ['Toplantı uzun sürse de verimli geçti; çünkü herkes ödevini yapmıştı.', 'جلسه هرچند طولانی شد اما پربازده بود؛ چون همه آماده بودند.', 'توپلانتی وزون ساورسه ده وهریملی گهچتی; چاونکاو ههرکهس هازیرلیکلییدی.', 'verimli geçti', 'پربازده بود'],
 ['Hem maliyet düştü hem kalite arttı; bu nadir görülen bir durumdur.', 'هم هزینه پایین آمد هم کیفیت بالا رفت؛ این پدیدهٔ نادری است.', 'ههم مالییهت داوشتاو ههم کالیته ارتتی; بو نادیر گاوراولهن بیر دورومدور.', 'nadir görülen', 'نادر'],
 ['Karar verirken tüm tarafları dinlediğim için kimse itiraz etmedi.', 'چون همهٔ طرف‌ها را شنیدم کسی اعتراض نکرد.', 'کارار وهریرکهن تاوم تارافلاری دینلهدیغیم یچین کیمسه یتیراز هتمهدی.', 'itiraz etmedi', 'اعتراض نکرد'],
 ['Süreç karmaşık görünse de adımlar izlenince sorun kalmıyor.', 'هرچند فرایند پیچیده به نظر می‌رسد با دنبال کردن گام‌ها مشکلی نمی‌ماند.', 'ساورهچ کارماشیک گاوراونسه ده ادیملار یزلهنینجه سورون کالمییور.', 'sorun kalmıyor', 'مشکلی نمی‌ماند'],
 ['Bu cümle uzun olsa da anlamı nettir; bağlaçlar doğru seçilmiştir.', 'این جمله هرچند طولانی است اما معنایش روشن است؛ لاçها درست انتخاب شده‌اند.', 'بو جاومله وزون ولسا دا انلامی نهتتیر; باغلاچلار دوغرو سهچیلمیشتیر.', 'bağlaçlar doğru', 'ها درست'],
 ],
 dialogue: [
 ['mert', 'Neden yine de yola çıktınız?', 'چرا باز هم راه افتادید؟'],
 ['aylin', 'Hava kötü olmasına rağmen ve trafik yoğun olduğu için yine de yola çıktık.', 'هرچند هوا بد بود و ترافیک سنگین بود، باز هم راه افتادیم.'],
 ['mert', 'Sonuç nasıldı?', 'نتیجه چه بود؟'],
 ['aylin', 'Toplantı uzun sürse de verimli geçti; çünkü herkes ödevini yapmıştı.', 'جلسه طولانی شد اما پربازده بود؛ چون همه آماده بودند.'],
 ],
 checks: [
 { promptFa: '«aksi takdirde» یعنی چه؟', choices: ['در غیر این صورت', 'چون', 'هرچند'], correctIndex: 0, explanationFa: 'معنی =  در غیر این صورت.' },
 { promptFa: '«yine de» یعنی چه؟', choices: ['باز هم / با وجود این', 'فقط', 'هرگز'], correctIndex: 0, explanationFa: 'معنی =  باز هم.' },
 ],
 },
 {
 id: 'tr-b2-f-28-discourse-connectors-precise',
 title: 'استفاده دقیق از حروف ربط و پیونددهنده‌های گفتمانی',
    subtitle: 'Foundation · خلاصه‌سازی دقیق',
 situation: 'ایده‌ها را با پیونددهنده‌های گف دقیق — فراتر از / — به هم متصل می‌کنید.',
    teachingFa: 'پیونددهنده‌های B2: «öncelikle», «bununla birlikte», «buna karşın», «nitekim», «kısacası».',
 rows: [
 ['Öncelikle konunun bağlamını iyice anlamak gerekir.', 'اول باید زمینهٔ موضوع را بفهمیم.', 'اونجهلیکله کونونون باغلامینی انلاماک گهرهکیر.', 'anlamak gerekir', 'باید زمینه را بفهمیم', 'الگوی نحوی: ساختار جملهٔ ترکی استانبولی'],
 ['İkincisi, veriler bu iddiayı destekliyor.', 'دوم اینکه داده‌ها این ادعا را می‌کنند.', 'یکینجیسی, وهریلهر بو یددیایی دهستهکلییور.', 'iddiayı destekliyor', 'ادعا را می‌کند'],
 ['Öte yandan bazı belirsizlikler hâlâ var.', 'از طرف دیگر برخی ابهام‌ها هنوز هست.', 'اوته یاندان بازی بهلیرسیزلیکلهر هâلâ وار.', 'belirsizlikler hâlâ var', 'ابهام‌ها هنوز هست'],
 ['Nitekim son rapor da bunu doğruladı.', 'همان‌طور که انتظار می‌رفت گزارش آخر هم این را تأیید کرد.', 'نیتهکیم سون راپور دا بونو دوغرولادی.', 'doğruladı', 'تأیید کرد'],
 ['Dolayısıyla bu yöntem makul görünüyor.', 'بنابراین این روش منطقی به نظر می‌رسد.', 'دولاییسییلا بو یاونتهم ماکول گاوراوناویور.', 'makul görünüyor', 'منطقی به نظر می‌رسد'],
 ['Kısacası üç ana noktaya dayanıyoruz.', 'خلاصه اینکه بر سه نکتهٔ اصلی استواریم.', 'کیساجاسی اوچ انا نوکتایا دایانییوروز.', 'üç ana noktaya', 'سه نکتهٔ اصلی'],
 ['Bu bağlaçlar metni akıcı hâle getirir.', 'این لاçها متن را روان می‌کنند.', 'بو باغلاچلار مهتنی اکیجی هâله گهتیریر.', 'metni akıcı hâle getirir', 'متن را روان می‌کند'],
 ['Yanlış bağlaç seçimi anlamı bozabilir.', 'انتخاب نادرست لاچ می‌تواند معنا را خراب کند.', 'یانلیش باغلاچ سهچیمی انلامی بوزابیلیر.', 'anlamı bozabilir', 'معنا را خراب می‌کند'],
 ],
 dialogue: [
 ['irem', 'Metni nasıl daha akıcı yazayım?', 'متن را چطور روان‌تر بنویسم؟'],
 ['bartu', 'Öncelikle bağlamı anla; ikincisi verileri kullan; öte yandan belirsizlikleri de söyle.', 'اول زمینه را بفهم؛ دوم داده‌ها را به کار ببر؛ از طرف دیگر ابهام‌ها را هم بگو.'],
 ['irem', 'Sonuçta?', 'در نهایت؟'],
 ['bartu', 'Kısacası üç ana noktaya dayan; bu bağlaçlar metni akıcı hâle getirir.', 'خلاصه بر سه نکته استوار باش؛ این لا متن را روان می‌کنند.'],
 ],
 checks: [
 { promptFa: '«nitekim» یعنی چه؟', choices: ['همان‌طور که انتظار می‌رفت', 'ناگهان', 'شاید'], correctIndex: 0, explanationFa: 'معنی =  همان‌طور که انتظار می‌رفت.' },
 { promptFa: '«kısacası» یعنی چه؟', choices: ['خلاصه اینکه', 'در ابتدا', 'در پایان'], correctIndex: 0, explanationFa: 'معنی =  خلاصه.' },
 ],
 },
 {
 id: 'tr-b2-f-29-coherent-argumentative-paragraphs',
 title: 'نگارش پاراگراف‌ها و متون استدلالی منسجم',
    subtitle: 'Foundation · استدلال منسجم',
 situation: 'پاراگراف‌های است می‌نویسید که در آن هر جمله به جملهٔ قبل متصل است و در پایان جمع‌بندی دارد.',
 teachingFa: 'ساختار پاراگراف B2: جملهٔ موضوعی + بسط با مثال + + جملهٔ نتیجه‌گیری.',
 rows: [
 ['Bu paragraflarda fikirler birbirine bağlıdır.', 'در این پاراگراف‌ها ایده‌ها به هم مرتبط‌اند.', 'بو پاراگرافلاردا فیکیرلهر بیربیرینه باغلیدیر.', 'fikirler birbirine bağlıdır', 'ایده‌ها به هم مرتبط‌اند', 'الگوی نحوی: ساختار جملهٔ ترکی استانبولی'],
 ['Örneğin bir tez cümlesi yazıp onu destekleyelim.', 'مثلاً یک جملهٔ بنویسیم و آن را کنیم.', 'اورنهغین بیر تهز جاوملهسی یازیپ ونو دهستهکلهیهلیم.', 'tez cümlesi', 'جملهٔ'],
 ['Sonuç bölümünde tüm önemli noktaları özetlemeliyiz.', 'در بخش نتیجه باید همهٔ نکات را خلاصه کنیم.', 'سونوچ باولاوماونده تاوم نوکتالاری اوزهتلهمهلیییز.', 'özetlemeliyiz', 'باید خلاصه کنیم'],
 ['İyi bir metin okuyucuyu adım ikna eder.', 'متن خوب خواننده را گام‌به‌گام متقاعد می‌کند.', 'ییی بیر مهتین وکویوجویو ادیم یکنا هدهر.', 'ikna eder', 'خواننده را متقاعد می‌کند'],
 ['Giriş, gelişme ve sonuç bölümleri dengeli olmalı.', 'بخش‌های مقدمه، بدنه و نتیجه باید متعادل باشند.', 'گیریش, گهلیشمه وه سونوچ باولاوملهری دهنگهلی ولمالی.', 'dengeli olmalı', 'باید متعادل باشند'],
 ['Her paragraf tek bir ana fikre odaklanmalıdır.', 'هر پاراگراف باید فقط به یک ایدهٔ اصلی کند.', 'ههر پاراگراف تهک بیر انا فیکره وداکلانمالیدیر.', 'tek bir ana fikre', 'یک ایدهٔ اصلی'],
 ['Geçiş cümleleri paragraflar arası bağı güçlendirir.', 'جمله‌های انتقالی پیوند بین پاراگراف‌ها را قوی می‌کنند.', 'گهچیش جاوملهلهری پاراگرافلار اراسی باغی گاوچلهندیریر.', 'paragraflar arası bağı', 'پیوند بین پاراگراف‌ها'],
 ['Sonuç olarak metin bir bütünlük kazanır.', 'در نتیجه متن به یک می‌رسد.', 'سونوچ ولاراک مهتین بیر باوتاونلاوک کازانیر.', 'bütünlük kazanır', 'انسجام پیدا می‌کند'],
 ],
 dialogue: [
 ['lara', 'Paragraf nasıl yazılır?', 'پاراگراف را چطور بنویسم؟'],
 ['ege', 'Giriş, gelişme ve sonuç bölümleri dengeli olmalı; her paragraf tek bir ana fikre odaklanmalıdır.', 'بخش‌ها متعادل باشند؛ هر پاراگراف یک ایدهٔ اصلی.'],
 ['lara', 'Geçişler呢? geçişler?', 'انتقال‌ها? ?'],
 ['ege', 'Geçiş cümleleri paragraflar arası bağı güçlendirir; sonuç olarak metin bir bütünlük kazanır.', 'جمله‌های انتقالی پیوند را قوی می‌کنند؛ در نتیجه متن منسجم می‌شود.'],
 ],
 checks: [
 { promptFa: '«bütünlük kazanır» یعنی چه؟', choices: ['انسجام/یکپارچگی پیدا می‌کند', 'تکه‌تکه می‌شود', 'گم می‌شود'], correctIndex: 0, explanationFa: 'معنی =  انسجام.' },
 { promptFa: '«odaklanmalıdır» یعنی چه؟', choices: ['باید تمرکز کند', 'باید پخش شود', 'باید حذف شود'], correctIndex: 0, explanationFa: 'معنی =  تمرکز کردن.' },
 ],
 },
 {
 id: 'tr-b2-f-30-suffix-precision-complex-syntax',
 title: 'تقویت انتخاب پسوندها، ترتیب اجزای جمله و ساختارهای پیچیده نحوی',
    subtitle: 'Foundation · نحو پیچیده',
 situation: 'جمله‌های پیچیده را با زنجیرهٔ دقیق پسوندها و ترتیب انعطاف‌پذیر — با تأکید درست — می‌سازید.',
 teachingFa: 'در B2 با عنصر عنصر بلافاصله قبل از فعل: «Bu kararı dün ben aldım» (تأکید: ).',
 rows: [
 ['Bu kararı dün ben aldım, bir başkası değil.', 'این تصمیم را دیروز من گرفتم، نه کس دیگر.', 'بو کاراری داون بهن الدیم, باشکاسی دهغیل.', 'ben aldım', 'من گرفتم', 'الگوی نحوی: ساختار جملهٔ ترکی استانبولی'],
 ['Raporu dün gönderdim ama henüz cevap gelmedi.', 'گزارش را دیروز فرستادم اما هنوز جواب نیامده.', 'راپورو داون گاوندهردیم اما ههناوز جهواپ گهلمهدی.', 'cevap gelmedi', 'جواب نیامده'],
 ['Hangi dosyada bu bilgi var, biliyor musun?', 'می‌دانی این اطلاعات در کدام پرونده است؟', 'دوسیالارین هانگیسینده بو بیلگی وار, بیلییور موسون?', 'biliyor musun', 'در کدام‌یک این اطلاعات هست'],
 ['Sözleşme imzalandığı gün hava oldukça sıcaktı.', 'روز امضای قرارداد هوا خیلی گرم بود.', 'ساوزلهشمهنین یمزالاندیغی گاون هاوا چوک سیجاکتی.', 'imzalandığı gün', 'روز امضا'],
 ['Bu konuyu kimin ele alacağını bir an önce netleştirmeliyiz.', 'باید مشخص کنیم چه کسی این موضوع را بررسی می‌کند.', 'بو کونویو کیمین هله الاجاغینی نهتلهشتیرمهلیییز.', 'kimin ele alacağını', 'چه کسی بررسی می‌کند'],
 ['Ne kadar erken başlarsak o kadar iyi olur bu.', 'هرچه زودتر شروع کنیم بهتر است.', 'نه کادار هرکهن باشلارساک و کادار ییی ولور.', 'o kadar iyi olur', 'همان‌قدر بهتر است'],
 ['Ne kadar çaba gösterirse göstersin sonuç değişmez.', 'هرقدر تلاش کند نتیجه تغییر نمی‌کند.', 'نه کادار چابا گاوستهریرسه گاوستهرسین سونوچ دهغیشمهز.', 'sonuç değişmez', 'نتیجه تغییر نمی‌کند'],
 ['Bu yapı hem uzun hem karmaşık görünüyor ama doğrudur.', 'این ساختار هم طولانی و هم پیچیده به نظر می‌رسد اما درست است.', 'بو یاپی ههم وزون ههم کارماشیک گاوراوناویور اما دوغرودور.', 'hem uzun hem karmaşık', 'هم طولانی هم پیچیده'],
 ],
 dialogue: [
 ['özlem', 'Bu kararı kim verdi?', 'این تصمیم را چه کسی گرفت؟'],
 ['hasan', 'Bu kararı dün ben aldım, bir başkası değil.', 'این تصمیم را دیروز من گرفتم، نه کس دیگر.'],
 ['özlem', 'Rapor呢? rapor ne oldu?', 'گزارش? گزارش چه شد؟'],
 ['hasan', 'Raporu dün gönderdim ama henüz cevap gelmedi.', 'گزارش را دیروز فرستادم اما هنوز جواب نیامده.'],
 ],
 checks: [
 { promptFa: 'در «Bu kararı dün ben aldım» روی کیست؟', choices: ['ben', 'dün', 'kararı'], correctIndex: 0, explanationFa: 'عنصر قبل از فعل دارد.' },
 { promptFa: '«ne kadar o kadar» یعنی چه؟', choices: ['هرقدر همان‌قدر', 'هیچ', 'فقط یک‌بار'], correctIndex: 0, explanationFa: 'ne kadar erken başlarsak o kadar iyi olur.' },
 ],
 },
];

export const TURKISH_B2_FOUNDATION_PART_B = buildTurkishLessons(B2_FOUNDATION_PART_B_SEEDS, 'tr5', 209);
