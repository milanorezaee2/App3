import { buildTurkishLessons, type TurkishLessonSeed } from './turkishSeed';

const C1_FOUNDATION_PART_B_SEEDS: readonly TurkishLessonSeed[] = [
 {
 id: 'tr-c1-f-27-discourse-connectives',
 title: 'پیونددهنده‌های گفتمانی پیشرفته',
 subtitle: 'Foundation · پیونددهنده‌های گفتمان',
 situation: 'ایده‌ها را با پیونددهنده‌های گفتمانی پیشرفته در گفتار و نوشتار منتقل می‌کنید.',
 teachingFa: 'پیونددهنده‌های C1: «bununla birlikte», «buna karşın», «nitekim», «kısacası», «öte yandan», «aksine».',
 rows: [
 ['Bununla birlikte, dezavantajlar da var.', 'با این حال، معایبی هم هست.', 'بونونلا بیرلیکته, دهزاوانتاژلار دا وار.', 'bununla birlikte', 'با این حال', 'الگوی نحوی: ساختار جملهٔ ترکی استانبولی'],
 ['Buna karşın, plupart ', 'بونا کارشین, پلوپارت', 'بونا کارشین, پلوپارت', 'buna karşın', 'در مقابل'],
 ['Nitekim sonuçlar bunu doğruladı.', 'همان‌طور که انتظار می‌رفت نتایج این را تأیید کرد.', 'نیتهکیم سونوچلار بونو دوغرولادی.', 'nitekim', 'همان‌طور که انتظار می‌رفت'],
 ['Kısacası, özetlersek', 'خلاصه، اگر جمع‌بندی کنیم', 'کیساجاسی, اوزهتلهرسهک', 'kısacası', 'خلاصه'],
 ['Öte yandan, başka bir açı da var.', 'از طرف دیگر زاویهٔ دیگری هم هست.', 'اوته یاندان, باشکا بیر اچی دا وار.', 'öte yandan', 'از طرف دیگر'],
 ['Aksine, tam tersi oldu.', 'برعکس، کاملاً برعکس شد.', 'اکسینه, تام تهرسی ولدو.', 'aksine', 'برعکس'],
 ['Bu geçişler metni akıcı kılar.', 'این گذارها متن را روان می‌کنند.', 'بو گهچیشلهر مهتنی اکیجی کیلار.', 'akıcı kılar', 'گذارها روان می‌کنند'],
 ['Bağlaçlar anlam ilişkisini gösterir.', 'حروف ربط رابطهٔ معنا را نشان می‌دهند.', 'باغلاچلار انلام یلیشکیسینی گاوستهریر.', 'anlam ilişkisi', 'رابطهٔ معنا'],
 ],
 dialogue: [
 ['ege', 'Metinde geçişleri nasıl yapıyorsun?', 'گذارها را در متن چطور انجام می‌دهی؟'],
 ['nil', 'Bununla birlikte dezavantajları, buna karşın avantajları yazıyorum.', 'معایب را با «با این حال»،' ],
 ['ege', 'Sonuç?', 'نتیجه؟'],
 ['nil', 'Nitekim sonuçlar doğruladı; kısacası özetlersek bu doğru yol.', 'نتایج تأیید کرد؛ خلاصه این راه درست است.'],
 ],
 checks: [
 { promptFa: '«nitekim» یعنی چه؟', choices: ['همان‌طور که انتظار می‌رفت', 'ناگهان', 'شاید'], correctIndex: 0, explanationFa: 'معنی =  همان‌طور که انتظار می‌رفت.' },
 { promptFa: '«aksine» یعنی چه؟', choices: ['برعکس', 'مانند', 'مشابه'], correctIndex: 0, explanationFa: 'معنی =  برعکس.' },
 ],
 },
 {
 id: 'tr-c1-f-28-stylistic-word-differences',
 title: 'تفاوت‌های سبکی و کاربردی واژگان',
 subtitle: 'Foundation · تفاوت واژگان',
 situation: 'تفاوت‌های سبکی، معنایی و کاربردی واژگان هم‌معنی را تحلیل می‌کنید.',
 teachingFa: 'برای : «başlamak» «girişmek», «büyük» «iri», «güzel» «şahane».',
 rows: [
 ['«Başlamak» ile «girişmek» aynı değil; ikincisi daha cesurane.', '«شروع کردن» و «وارد شدن» یکی نیستند؛ دومی جسورانه‌تر است.', '«باشلاماک» یله «گیریشمهک» اینی دهغیل; یکینجیسی داها جهسورانه.', 'aynı değil', 'یکی نیستند', 'الگوی نحوی: ساختار جملهٔ ترکی استانبولی'],
 ['«Büyük» ile «iri» arasındaki fark incedir.', 'تفاوت «بزرگ» و «کلان» ظریف است.', '«باویاوک» یله «یری» اراسینداکی فارک ینجهدیر.', 'fark incedir', 'تفاوت ظریف'],
 ['«Güzel» ile «şahane» farklı tonlarda.', '«خوب» و «عالی» لحن‌های متفاوتی دارند.', '«گاوزهل» یله «شاهانه» فارکلی تونلاردا.', 'farklı ton', 'لحن متفاوت'],
 ['Eş anlamlı sözcükler bağlama göre seçilir.', 'واژگان هم‌معنی با توجه به زمینه انتخاب می‌شوند.', 'هش انلاملی ساوزجاوکلهر باغلاما گاوره سهچیلیر.', 'eş anlamlı', 'هم‌معنی'],
 ['Bu sözcük daha resmi duyuluyor.', 'این واژه رسمی‌تر به گوش می‌رسد.', 'بو ساوزجاوک داها رهسمی دویولویور.', 'daha resmi', 'رسمی‌تر'],
 ['Günlük dilde bu ifade kullanılır.', 'در زبان روزمره این عبارت به کار می‌رود.', 'گاونلاوک دیلده بو یفاده کوللانیلیر.', 'günlük dil', 'زبان روزمره'],
 ['Sözcük seçimi anlamı değiştirir.', 'انتخاب واژه معنا را تغییر می‌دهد.', 'ساوزجاوک سهچیمی انلامی دهغیشتیریر.', 'sözcük seçimi', 'انتخاب واژه'],
 ['Bu karşılaştırma dil duyarlılığını artırır.', 'این مقایسه حساسیت زبانی را بالا می‌برد.', 'بو کارشیلاشتیرما دیل دویارلیلیغینی ارتیریر.', 'dil duyarlılığı', 'حساسیت زبانی'],
 ],
 dialogue: [
 ['melis', 'Bu iki kelime farkı nedir?', 'فرق این دو واژه چیست؟'],
 ['arda', '«Başlamak» ile «girişmek» aynı değil; ikincisi daha cesurane.', '«شروع» و «وارد شدن» یکی نیست؛ دومی جسورانه‌تر است.'],
 ['melis', 'Başka örnek?', 'مثال دیگر؟'],
 ['arda', '«Güzel» ile «şahane» farklı tonlarda; sözcük seçimi anlamı değiştirir.', '«خوب» و «عالی» لحن متفاوت؛ انتخاب واژه معنا را عوض می‌کند.'],
 ],
 checks: [
 { promptFa: '«eş anlamlı» یعنی چه؟', choices: ['هم‌معنی', 'متضاد', 'م'], correctIndex: 0, explanationFa: 'معنی =  هم‌معنی.' },
 { promptFa: '«ton» یعنی چه؟', choices: ['لحن/سبک', 'صدا', 'سرعت'], correctIndex: 0, explanationFa: 'معنی =  لحن.' },
 ],
 },
 {
 id: 'tr-c1-f-29-standard-language-structures',
 title: 'ساختارهای زبان معیار',
 subtitle: 'Foundation · زبان معیار',
 situation: 'ساختارهای دستوری متناسب با زبان معیار را به‌کار می‌برید.',
 teachingFa: 'زبان معیار: «-Diğembles», «-AcAKken», «-mAktansa», «-DIr ki».',
 rows: [
 ['Yazarken dilbilgisi kurallarına uymalıyız.', 'هنگام نوشتن باید از قواعد ữ پیروی کنیم.', 'یازارکهن دیلبیلگیسی کوراللارینا ویمالیییز.', 'dilbilgisi kuralları', 'قواعد ữ', 'الگوی نحوی: ساختار جملهٔ ترکی استانبولی'],
 ['Konuşma dili ile yazı dili farklıdır.', 'زبان گفتار با زبان نوشتار متفاوت است.', 'کونوشما دیلی یله یازی دیلی فارکلیدیر.', 'yazı dili', 'زبان نوشتاری'],
 ['Standart dil her bağlamda aynı değildir.', 'زبان معیار در همهٔ زمینه‌ها یکی نیست.', 'ستاندارت دیل ههر باغلامدا اینی دهغیلدیر.', 'standart dil', 'زبان معیار'],
 ['Bu yapı yazıda daha doğaldır.', 'این ساختار در نوشتار طبیعی‌تر است.', 'بو یاپی یازیدا داها دوغالدیر.', 'yapı', 'ساختار'],
 ['Kural dışı ifadeler bilerek kullanılabilir.', 'عبارات خلاف قاعده را می‌توان آگاهانه به کار برد.', 'کورال دیشی یفادهلهر بیلهرهک کوللانیلابیلیر.', 'kural dışı', 'خلاف قاعده'],
 ['Dil normlarına uymak güven verir.', 'پیروی از هنجارهای زبانی اعتماد ایجاد می‌کند.', 'دیل نورملارینا ویماک گاووهن وهریر.', 'dil normları', 'هنجارهای زبانی'],
 ['Bu ifade standart dışıdır.', 'این عبارت خارج از معیار است.', 'بو یفاده ستاندارت دیشیدیر.', 'standart dışı', 'خارج از معیار'],
 ['Yazım kuralları da dilin parçasıdır.', 'قواعد' , 'یازیم کوراللاری دا دیلین پارچاسیدیر.', 'yazım kuralları', 'قواعد املایی'],
 ],
 dialogue: [
 ['kaan', 'Bu cümle hangi dilde?', 'این جمله به کدام زبان است؟'],
 ['seda', 'Konuşma dili ile yazı dili farklıdır; bu yapı yazıda daha doğaldır.', 'زبان گفتار و نوشتار فرق دارد؛ این ساختار در نوشتار طبیعی‌تر است.'],
 ['kaan', 'Standart?', 'معیار؟'],
 ['seda', 'Standart dil her bağlamda aynı değil; dil normlarına uymak güven verir.', 'معیار همه‌جا یکی نیست؛ پیروی از هنجارها اعتماد می‌آورد.'],
 ],
 checks: [
 { promptFa: '«standart dil» یعنی چه؟', choices: ['زبان معیار', 'لهجهٔ محلی', 'زبان عامیانهٔ'], correctIndex: 0, explanationFa: 'معنی =  معیار.' },
 { promptFa: '«dilbilgisi» یعنی چه؟', choices: ['دستور زبان', 'واژگان', 'املاء'], correctIndex: 0, explanationFa: 'معنی =  دستور زبان.' },
 ],
 },
 {
 id: 'tr-c1-f-30-integrated-advanced-structures',
 title: 'به‌کارگیری ترکیبی ساختارهای پیشرفته',
 subtitle: 'Foundation · ترکیب ساختارها',
 situation: 'ساختارهای پیشرفتهٔ C1 را به‌صورت ترکیبی در جمله‌های واقعی به‌کار می‌برید.',
 teachingFa: 'ترکیب: «-mış gibi davrandı», «-AcAKken», «-DIğından beri», «-sA bile».',
 rows: [
 ['Sanki her şeyi biliyormuş gibi davrandı.', 'طوری رفتار کرد انگار همه‌چیز را می‌داند.', 'سانکی ههر شهیی بیلییورموش گیبی داوراندی.', 'gibi davrandı', 'انگار', 'الگوی نحوی: ساختار جملهٔ ترکی استانبولی'],
 ['Çıkarken kapıyı kilitlediğinden emin oldu.', 'موقع بیرون رفتن مطمئن شد در را قفل کرده.', 'چیکارکهن کاپییی کیلیتلهدیغیندهن همین ولدو.', 'emin oldu', 'مطمئن شد که'],
 ['Geldiğinden beri nothing ', 'گهلدیغیندهن بهری نوتهینگ', 'گهلدیغیندهن بهری نوتهینگ', 'geldiğinden beri', 'از وقتی آمده'],
 ['Yağmur yağsa bile gideceğiz.', 'حتی اگر باران ببارد می‌رویم.', 'یاغمور یاغسا بیله گیدهجهغیز.', 'yağsa bile', 'حتی اگر'],
 ['Ne kadar söylesem de anlamıyor.', 'هرقدر بگویم نمی‌فهمد.', 'نه کادار ساویلهسهم ده انلامییور.', 'de anlamıyor', 'هرقدر هم'],
      ['Ne kadar çok olursa o kadar iyi.', 'هرچه بیشتر باشد همان‌قدر بهتر است.', 'نه کادار چوک ولورسا و کادار ییی.', 'kadar', 'به اندازهٔ'],
 ['Bu yapılar C1 seviyesinin alametidir.', 'این ساختارها نشانهٔ سطح C1 هستند.', 'بو یاپیلار ج۱ سهوییهسینین الامهتیدیر.', 'C1 seviyesi', 'سطح C1'],
 ['Pratikle bu yapılar doğallaşır.', 'با تمرین این ساختارها طبیعی می‌شوند.', 'پراتیکله بو یاپیلار دوغاللاشیر.', 'doğallaşır', 'طبیعی می‌شوند'],
 ],
 dialogue: [
 ['ege', 'Bu cümlelerin yapısı nedir?', 'ساختار این جمله‌ها چیست؟'],
 ['nil', 'Sanki her şeyi biliyormuş gibi davrandı; yağmur yağsa bile gideceğiz.', 'انگار همه‌چیز را می‌داند؛' ],
 ['ege', 'Başka?', 'دیگری؟'],
 ['nil', 'Ne kadar söylesem de anlamıyor; bu yapılar C1 seviyesinin alametidir.', 'هرقدر بگویم نمی‌فهمد؛ این‌ها نشانهٔ C1 هستند.'],
 ],
 checks: [
 { promptFa: '«-se bile» یعنی چه؟', choices: ['حتی اگر', 'چون', 'تا'], correctIndex: 0, explanationFa: 'معنی =  حتی اگر.' },
 { promptFa: '«-miş gibi» یعنی چه؟', choices: ['انگار', 'چون', 'تا وقتی'], correctIndex: 0, explanationFa: 'معنی =  انگار.' },
 ],
 },
];

export const TURKISH_C1_FOUNDATION_PART_B = buildTurkishLessons(C1_FOUNDATION_PART_B_SEEDS, 'tr6', 209);
