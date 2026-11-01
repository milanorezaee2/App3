import type { LearningLesson, LearningSentence } from './types';

/*
 * دورهٔ ترکی استانبولی — سطح Foundation (شروع از صفر).
 * همان قالب دورهٔ روسی: هر درس جمله‌محور است، هر جمله ترکی با معنی فارسی،
 * تلفظ تقریبی فارسی، یک واژهٔ کلیدی، یک گفت‌وگوی کوتاه و دو پرسش خودارزیابی.
 * محتوای این سطح برای فارسی‌زبان‌هایی نوشته شده که از صفر شروع می‌کنند.
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

export const TURKISH_FOUNDATION_LESSONS: readonly LearningLesson[] = [
  /* ---------- درس ۱ ---------- */
  lesson(
    'tr-l1-greetings',
    'سلام و خداحافظی',
    'می‌خواهید با یک نفر سلام و احوالپرسی خیلی ساده کنید و سپس مؤدبانه خداحافظی کنید.',
    [
      sentence('tr1-01', 'Merhaba!', 'سلام!', 'مِرهابا', 'merhaba', 'سلام'),
      sentence('tr1-02', 'Selam!', 'سلام! (دوستانه)', 'سِلام', 'selam', 'سلام (دوستانه)'),
      sentence('tr1-03', 'Günaydın!', 'صبح بخیر!', 'گون‌آیدین', 'günaydın', 'صبح بخیر'),
      sentence('tr1-04', 'İyi günler!', 'روز خوش!', 'ای‌یی گون‌لِر', 'gün', 'روز'),
      sentence('tr1-05', 'İyi akşamlar!', 'عصر بخیر!', 'ای‌یی آکشام‌لار', 'akşam', 'عصر'),
      sentence('tr1-06', 'İyi geceler!', 'شب بخیر!', 'ای‌یی گِجه‌لِر', 'gece', 'شب'),
      sentence('tr1-07', 'Hoşça kal!', 'خداحافظ! (به کسی که می‌ماند)', 'هوش‌چا کال', 'hoşça kal', 'خداحافظ (برای ماندن)'),
      sentence('tr1-08', 'Güle güle!', 'خداحافظ! (به کسی که می‌رود)', 'گوله گوله', 'güle güle', 'خداحافظ (برای رفتن)'),
      sentence('tr1-09', 'Görüşürüz!', 'می‌بینمت!', 'گوروشوروز', 'görüşürüz', 'می‌بینیم همدیگر را'),
    ],
    [
      { speaker: 'مریم', text: 'Merhaba!', fa: 'سلام!' },
      { speaker: 'امیر', text: 'Merhaba! Nasılsın?', fa: 'سلام! چطوری؟' },
      { speaker: 'مریم', text: 'İyiyim, teşekkür ederim.', fa: 'خوبم، ممنون.' },
      { speaker: 'امیر', text: 'Güle güle!', fa: 'خداحافظ!' },
    ],
    [
      { promptFa: 'برای سلام کردن در صبح کدام جمله درست است؟', choices: ['Günaydın!', 'İyi geceler!', 'Hoşça kal!'], correctIndex: 0, explanationFa: 'Günaydın یعنی «صبح بخیر»؛ İyi geceler شب بخیر و Hoşça kal خداحافظ است.' },
      { promptFa: 'خودتان می‌روید و طرف مقابل می‌ماند؛ چه می‌گویید؟', choices: ['Hoşça kal!', 'Güle güle!', 'Merhaba!'], correctIndex: 0, explanationFa: 'Hoşça kal را کسی می‌گوید که می‌رود؛ Güle güle را کسی که می‌ماند.' },
    ],
    'ترکی استانبولی با الفبای لاتین نوشته می‌شود؛ چند حرف تازه دارد: ç مانند «چ»، ş مانند «ش»، ğ کشیده و نرم، ı مانند «ای» کوتاه بدون نقطه، ö مانند «اُ» گرد و ü مانند «او» باریک. علامت تشدید در نوشتار ترکی وجود ندارد؛ همهٔ جمله‌ها با حرف اولِ جمله بزرگ نوشته می‌شوند.',
  ),

  /* ---------- درس ۲ ---------- */
  lesson(
    'tr-l1-how-are-you',
    'احوال‌پرسی ساده',
    'بعد از سلام می‌خواهید بپرسید «حالت چطور است؟» و پاسخ کوتاه بدهید.',
    [
      sentence('tr1-10', 'Nasılsın?', 'چطوری؟ (دوستانه)', 'ناصیل‌سین', 'nasıl', 'چطور', 'Nasılsın? = چطوری؟'),
      sentence('tr1-11', 'Nasılsınız?', 'حال شما چطور است؟ (رسمی)', 'ناصیل‌سینیز', 'nasılsınız', 'حال شما چطور است', 'Nasılsın? دوستانه / Nasılsınız? رسمی'),
      sentence('tr1-12', 'İyiyim, teşekkürler.', 'خوبم، ممنون.', 'ای‌یی‌ییم، تشکّورلِر', 'iyi', 'خوب'),
      sentence('tr1-13', 'Çok iyiyim.', 'خیلی خوبم.', 'چوک ای‌یی‌ییم', 'çok', 'خیلی'),
      sentence('tr1-14', 'Fena değil.', 'بد نیست.', 'فِنا دِییل', 'fena', 'بد'),
      sentence('tr1-15', 'Sen nasılsın?', 'تو چطوری؟', 'سِن ناصیل‌سین', 'sen', 'تو'),
      sentence('tr1-16', 'Ben de iyiyim.', 'من هم خوبم.', 'بِن دِ ای‌یی‌ییم', 'ben de', 'من هم'),
      sentence('tr1-17', 'Görüşürüz!', 'می‌بینمت!', 'گوروشوروز', 'görüşürüz', 'می‌بینیم همدیگر را'),
    ],
    [
      { speaker: 'علی', text: 'Merhaba Ayşe! Nasılsın?', fa: 'سلام عایشه! چطوری؟' },
      { speaker: 'عایشه', text: 'İyiyim, teşekkürler. Sen nasılsın?', fa: 'خوبم، ممنون. تو چطوری؟' },
      { speaker: 'علی', text: 'Fena değil, çok iyiyim.', fa: 'بد نیستم، خیلی خوبم.' },
      { speaker: 'عایشه', text: 'Görüşürüz!', fa: 'می‌بینمت!' },
    ],
    [
      { promptFa: 'کدام جمله یعنی «حال شما چطور است؟» (رسمی)؟', choices: ['Nasılsınız?', 'Nasılsın?', 'Ne kadar?'], correctIndex: 0, explanationFa: 'پسوند -sınız جمله را رسمی یا جمع می‌کند.' },
      { promptFa: 'پاسخ «خوبم، ممنون» کدام است؟', choices: ['İyiyim, teşekkürler.', 'Fena değil.', 'Hoşça kal.'], correctIndex: 0, explanationFa: 'İyiyim یعنی خوبم و teşekkürler یعنی ممنون.' },
    ],
    'در ترکی صفت بعد از اسم یا در پایان جمله می‌آید: «Ben iyiyim» یعنی «من خوبم». ضمیر ben (من) و sen (تو) را می‌توان حذف کرد، چون پایانهٔ فعل شخص را نشان می‌دهد: iyiyim = خوبم، iyisin = خوبی. برای رسمی و جمع از siz استفاده می‌شود.',
  ),

  /* ---------- درس ۳ ---------- */
  lesson(
    'tr-l1-introductions',
    'معرفی خود',
    'می‌خواهید نام خودتان را بگویید، نام طرف مقابل را بپرسید و بگویید اهل کجا هستید.',
    [
      sentence('tr1-18', 'Benim adım Ali.', 'اسم من علی است.', 'بِنیم آدیم علی', 'ad', 'اسم', 'Benim adım … = اسم من …'),
      sentence('tr1-19', 'Adım Ayşe.', 'اسمم عایشه است.', 'آدیم عایشه', 'adım', 'اسمم'),
      sentence('tr1-20', 'Sizin adınız ne?', 'اسم شما چیست؟', 'سیزین آدینیز نِه', 'adınız', 'اسم شما'),
      sentence('tr1-21', 'Ben İranlıyım.', 'من ایرانی هستم.', 'بِن ایرانلی‌ییم', 'İranlı', 'ایرانی'),
      sentence('tr1-22', 'Ben Tahran\'dan geliyorum.', 'من از تهران می‌آیم.', 'بِن تَهران‌دان گِلی‌یوروم', 'gelmek', 'آمدن'),
      sentence('tr1-23', 'Memnun oldum.', 'از آشنایی خوشحال شدم.', 'ممنون اولدوم', 'memnun', 'خوشحال'),
      sentence('tr1-24', 'Ben de memnun oldum.', 'من هم خوشحال شدم.', 'بِن دِ ممنون اولدوم', 'ben de', 'من هم'),
      sentence('tr1-25', 'Türkçe öğreniyorum.', 'دارم ترکی یاد می‌گیرم.', 'تورکچه اُورِنی‌یوروم', 'öğrenmek', 'یاد گرفتن'),
    ],
    [
      { speaker: 'علی', text: 'Merhaba, benim adım Ali. Sizin adınız ne?', fa: 'سلام، اسم من علی است. اسم شما چیست؟' },
      { speaker: 'عایشه', text: 'Adım Ayşe. Memnun oldum.', fa: 'اسمم عایشه است. از آشنایی خوشحال شدم.' },
      { speaker: 'علی', text: 'Ben de memnun oldum. Ben İranlıyım.', fa: 'من هم خوشحال شدم. من ایرانی هستم.' },
    ],
    [
      { promptFa: 'چطور بگویید «اسم شما چیست؟»', choices: ['Sizin adınız ne?', 'Benim adım ne?', 'Nasılsınız?'], correctIndex: 0, explanationFa: 'Sizin adınız ne? یعنی اسم شما چیست.' },
      { promptFa: '«من ایرانی هستم» کدام است؟', choices: ['Ben İranlıyım.', 'Ben Tahran.', 'Ben iyiyim.'], correctIndex: 0, explanationFa: 'پسوند -lı/-li ملیت می‌سازد: İranlı = ایرانی.' },
    ],
    'در ترکی مالکیت با پسوند به اسم می‌چسبد: ad + ım = adım (اسمم) و ad + ınız = adınız (اسم شما). ملیت با -lı/-li ساخته می‌شود: İranlı (ایرانی)، Türk (ترکی). «از جایی آمدن» با ablative -dan/-den است: Tahran\'dan = از تهران.',
  ),

  /* ---------- درس ۴ ---------- */
  lesson(
    'tr-l1-polite-words',
    'کلمه‌های مؤدبانه',
    'می‌خواهید مؤدبانه تشکر کنید، عذرخواهی کنید و کمک بخواهید.',
    [
      sentence('tr1-26', 'Lütfen.', 'لطفاً.', 'لوتفِن', 'lütfen', 'لطفاً'),
      sentence('tr1-27', 'Teşekkür ederim.', 'متشکرم.', 'تشکّور اِدِریم', 'teşekkür', 'تشکر'),
      sentence('tr1-28', 'Çok teşekkür ederim.', 'خیلی متشکرم.', 'چوک تشکّور اِدِریم', 'çok', 'خیلی'),
      sentence('tr1-29', 'Özür dilerim.', 'عذر می‌خواهم.', 'اُوزور دیلِریم', 'özür', 'عذر'),
      sentence('tr1-30', 'Affedersiniz.', 'ببخشید. (رسمی)', 'اَففِدِرسینیز', 'affetmek', 'بخشیدن'),
      sentence('tr1-31', 'Bir şey değil.', 'چیزی نیست.', 'بیر شِی دِییل', 'bir şey', 'چیزی'),
      sentence('tr1-32', 'Rica ederim.', 'خواهش می‌کنم.', 'ریجا اِدِریم', 'rica', 'خواهش'),
      sentence('tr1-33', 'Yardım edebilir misiniz?', 'می‌توانید کمک کنید؟', 'یاردیم اِدِبیلیر میسینیز', 'yardım', 'کمک'),
    ],
    [
      { speaker: 'مریم', text: 'Affedersiniz, yardım edebilir misiniz?', fa: 'ببخشید، می‌توانید کمک کنید؟' },
      { speaker: 'امیر', text: 'Tabii, buyurun.', fa: 'البته، بفرمایید.' },
      { speaker: 'مریم', text: 'Çok teşekkür ederim.', fa: 'خیلی متشکرم.' },
      { speaker: 'امیر', text: 'Rica ederim.', fa: 'خواهش می‌کنم.' },
    ],
    [
      { promptFa: 'پاسخ مؤدبانه به تشکر کدام است؟', choices: ['Rica ederim.', 'Lütfen.', 'Özür dilerim.'], correctIndex: 0, explanationFa: 'Rica ederim یعنی «خواهش می‌کنم».' },
      { promptFa: 'برای جلب توجه یک غریبه با ادب چه می‌گویید؟', choices: ['Affedersiniz.', 'Güle güle.', 'Ne kadar?'], correctIndex: 0, explanationFa: 'Affedersiniz یعنی ببخشید (رسمی).' },
    ],
    'Teşekkür ederim صریح و رسمی است؛ بین دوستان «Sağ ol» هم گفته می‌شود. جملهٔ پرسشی «Yardım edebilir misiniz?» با -ebilir (توانستن) و misiniz (پرسش رسمی) ساخته می‌شود. برای درخواست نرم، lütfen را پایان جمله بیاورید.',
  ),

  /* ---------- درس ۵ ---------- */
  lesson(
    'tr-l1-yes-no-understand',
    'بله، نه، متوجه نشدم',
    'می‌خواهید بله یا نه بگویید و بفهمانید که جمله را نفهمیده‌اید.',
    [
      sentence('tr1-34', 'Evet.', 'بله.', 'اِوِت', 'evet', 'بله'),
      sentence('tr1-35', 'Hayır.', 'نه.', 'هاییر', 'hayır', 'نه'),
      sentence('tr1-36', 'Anlamadım.', 'نفهمیدم.', 'آنلامادیم', 'anlamak', 'فهمیدن'),
      sentence('tr1-37', 'Tekrar söyler misiniz?', 'دوباره می‌گویید؟', 'تِكرار سُیلِر میسینیز', 'tekrar', 'دوباره'),
      sentence('tr1-38', 'Türkçe bilmiyorum.', 'ترکی نمی‌دانم.', 'تورکچه بیلمی‌یوروم', 'bilmek', 'دانستن'),
      sentence('tr1-39', 'Biraz Türkçe biliyorum.', 'کمی ترکی می‌دانم.', 'بیراز تورکچه بیلی‌یوروم', 'biraz', 'کمی'),
      sentence('tr1-40', 'Yavaş konuşabilir misiniz?', 'می‌توانید آهسته صحبت کنید؟', 'یاواش کونوشابیلیر میسینیز', 'yavaş', 'آهسته'),
      sentence('tr1-41', 'İngilizce konuşuyor musunuz?', 'انگلیسی صحبت می‌کنید؟', 'اینگیلیزجه کونوشویور موسونوز', 'konuşmak', 'صحبت کردن'),
    ],
    [
      { speaker: 'امیر', text: 'Türkçe biliyor musunuz?', fa: 'ترکی می‌دانید؟' },
      { speaker: 'مریم', text: 'Biraz biliyorum. Yavaş konuşabilir misiniz?', fa: 'کمی می‌دانم. می‌توانید آهسته صحبت کنید؟' },
      { speaker: 'امیر', text: 'Tabii. Şimdi anladınız mı?', fa: 'البته. حالا فهمیدید؟' },
      { speaker: 'مریم', text: 'Evet, anladım. Teşekkürler!', fa: 'بله، فهمیدم. ممنون!' },
    ],
    [
      { promptFa: '«نفهمیدم» کدام است؟', choices: ['Anlamadım.', 'Evet.', 'Hayır.'], correctIndex: 0, explanationFa: 'Anlamadım از فعل anlamak (فهمیدن) می‌آید.' },
      { promptFa: 'برای درخواست صحبت آهسته چه می‌گویید؟', choices: ['Yavaş konuşabilir misiniz?', 'Ne kadar?', 'İyi geceler.'], correctIndex: 0, explanationFa: 'yavaş یعنی آهسته.' },
    ],
    'نفی در ترکی با پسوند -ma/-me ساخته می‌شود: anlıyorum (می‌فهمم) → anlamıyorum (نمی‌فهمم). زمان گذشتهٔ سادهٔ آن anlamadım است. جملهٔ پرسشی با «mi» و پسوند شخص ساخته می‌شود: biliyor musunuz? (می‌دانید؟).',
  ),

  /* ---------- درس ۶ ---------- */
  lesson(
    'tr-l1-numbers',
    'عددها و قیمت',
    'می‌خواهید عددها را بگویید و قیمت چیزی را بپرسید.',
    [
      sentence('tr1-42', 'Bir.', 'یک.', 'بیر', 'bir', 'یک'),
      sentence('tr1-43', 'İki.', 'دو.', 'ایکی', 'iki', 'دو'),
      sentence('tr1-44', 'Üç.', 'سه.', 'اوچ', 'üç', 'سه'),
      sentence('tr1-45', 'Dört, beş.', 'چهار، پنج.', 'دُورت، بِش', 'dört', 'چهار'),
      sentence('tr1-46', 'Altı, yedi.', 'شش، هفت.', 'آلتی، یِدی', 'altı', 'شش'),
      sentence('tr1-47', 'Sekiz, dokuz, on.', 'هشت، نه، ده.', 'سِکیز، دوکوز، اون', 'on', 'ده'),
      sentence('tr1-48', 'Bu kaç lira?', 'این چند لیر است؟', 'بو کاچ لیرا', 'lira', 'لیر'),
      sentence('tr1-49', 'Ne kadar?', 'چقدر است؟', 'نِه کادار', 'ne kadar', 'چقدر'),
    ],
    [
      { speaker: 'مریم', text: 'Bu kitap ne kadar?', fa: 'این کتاب چقدر است؟' },
      { speaker: 'امیر', text: 'Yüz lira.', fa: 'صد لیر.' },
      { speaker: 'مریم', text: 'Tamam, bir tane lütfen.', fa: 'باشه، یک عدد لطفاً.' },
    ],
    [
      { promptFa: 'عدد «سه» در ترکی کدام است؟', choices: ['Üç', 'İki', 'Beş'], correctIndex: 0, explanationFa: 'üç یعنی سه.' },
      { promptFa: 'برای پرسیدن قیمت کدام جمله درست است؟', choices: ['Ne kadar?', 'Nerede?', 'Nasılsın?'], correctIndex: 0, explanationFa: 'Ne kadar? یعنی چقدر.' },
    ],
    'عددها را در ترکی می‌توان بدون اسم هم به کار برد. برای شمارش چیزها عدد پیش از اسم می‌آید: bir çay (یک چای)، iki kitap (دو کتاب). پس از عدد جمع بسته نمی‌شود؛ «iki kitap» درست است و «iki kitaplar» نادرست.',
  ),

  /* ---------- درس ۷ ---------- */
  lesson(
    'tr-l1-objects-this-is',
    'این چیست؟',
    'می‌خواهید به اشیای ساده اشاره کنید و بپرسید آن‌ها چیستند.',
    [
      sentence('tr1-50', 'Bu nedir?', 'این چیست؟', 'بو نِدیر', 'bu', 'این'),
      sentence('tr1-51', 'Bu bir kitap.', 'این یک کتاب است.', 'بو بیر کیتاپ', 'kitap', 'کتاب'),
      sentence('tr1-52', 'Bu bir çay.', 'این یک چای است.', 'بو بیر چای', 'çay', 'چای'),
      sentence('tr1-53', 'Şu bir su.', 'آن یک آب است.', 'شو بیر سو', 'su', 'آب'),
      sentence('tr1-54', 'O bir telefon.', 'آن یک تلفن است.', 'او بیر تِلفون', 'telefon', 'تلفن'),
      sentence('tr1-55', 'Bu ne kadar?', 'این چقدر است؟', 'بو نِه کادار', 'ne kadar', 'چقدر'),
      sentence('tr1-56', 'Bu çok güzel.', 'این خیلی زیباست.', 'بو چوک گوزل', 'güzel', 'زیبا'),
      sentence('tr1-57', 'Bu benim çantam.', 'این کیف من است.', 'بو بِنین چانتام', 'çanta', 'کیف'),
    ],
    [
      { speaker: 'امیر', text: 'Bu nedir?', fa: 'این چیست؟' },
      { speaker: 'مریم', text: 'Bu bir kitap.', fa: 'این یک کتاب است.' },
      { speaker: 'امیر', text: 'Şu ne kadar?', fa: 'آن چقدر است؟' },
      { speaker: 'مریم', text: 'Elli lira.', fa: 'پنجاه لیر.' },
    ],
    [
      { promptFa: 'کدام جمله یعنی «این یک کتاب است»؟', choices: ['Bu bir kitap.', 'Bu ne kadar?', 'O bir su.'], correctIndex: 0, explanationFa: 'bu = این، bir = یک، kitap = کتاب.' },
      { promptFa: 'برای اشاره به چیزی دورتر کدام کلمه را به کار می‌برید؟', choices: ['O', 'Bu', 'Bir'], correctIndex: 0, explanationFa: 'bu نزدیک (این)، şu میانی، o دور (آن).' },
    ],
    'ترکی سه درجهٔ اشاره دارد: bu (این، نزدیک)، şu (آن، کمی دورتر) و o (آن، دور). جملهٔ اسمی نیازی به فعل «است» ندارد: «Bu bir kitap» یعنی «این یک کتاب است». برای مالکیت: benim çantam = کیف من.',
  ),

  /* ---------- درس ۸ ---------- */
  lesson(
    'tr-l1-where-is',
    'پرسیدن کجا',
    'می‌خواهید مکان‌های ضروری را پیدا کنید و جهت‌ها را بفهمید.',
    [
      sentence('tr1-58', 'Tuvalet nerede?', 'توالت کجاست؟', 'توالت نِرِده', 'tuvalet', 'توالت'),
      sentence('tr1-59', 'Metro nerede?', 'مترو کجاست؟', 'مِترو نِرِده', 'metro', 'مترو'),
      sentence('tr1-60', 'Otobüs durağı nerede?', 'ایستگاه اتوبوس کجاست؟', 'اوتوبوس دوراغی نِرِده', 'durak', 'ایستگاه'),
      sentence('tr1-61', 'Sağda.', 'در سمت راست.', 'سادا', 'sağ', 'راست'),
      sentence('tr1-62', 'Solda.', 'در سمت چپ.', 'سولدا', 'sol', 'چپ'),
      sentence('tr1-63', 'Düz gidin.', 'مستقیم بروید.', 'دوز گیدین', 'düz', 'مستقیم'),
      sentence('tr1-64', 'Çok yakın.', 'خیلی نزدیک است.', 'چوک یاکین', 'yakın', 'نزدیک'),
      sentence('tr1-65', 'Beş dakika yürüyün.', 'پنج دقیقه پیاده بروید.', 'بِش داکیکا یورویون', 'yürümek', 'راه رفتن'),
    ],
    [
      { speaker: 'مریم', text: 'Affedersiniz, tuvalet nerede?', fa: 'ببخشید، توالت کجاست؟' },
      { speaker: 'امیر', text: 'Düz gidin, sonra sağda.', fa: 'مستقیم بروید، بعد سمت راست.' },
      { speaker: 'مریم', text: 'Çok yakın mı?', fa: 'خیلی نزدیک است؟' },
      { speaker: 'امیر', text: 'Evet, iki dakika yürüyün.', fa: 'بله، دو دقیقه پیاده بروید.' },
    ],
    [
      { promptFa: '«توالت کجاست؟» کدام است؟', choices: ['Tuvalet nerede?', 'Tuvalet nedir?', 'Tuvalet ne kadar?'], correctIndex: 0, explanationFa: 'nerede یعنی کجا.' },
      { promptFa: '«سمت راست» کدام است؟', choices: ['Sağda', 'Solda', 'Düz'], correctIndex: 0, explanationFa: 'sağ = راست، sol = چپ.' },
    ],
    'پسوند -da/-de معنای «در» می‌دهد: sağda = در سمت راست، solda = در سمت چپ. فعل امر دوم‌شخص جمع با -ın/-in/-un/-ün ساخته می‌شود: gidin (بروید)، yürüyün (پیاده بروید). برای پرسش مؤدبانه‌تر: «Nerede acaba?» هم شنیده می‌شود.',
  ),

  /* ---------- درس ۹ ---------- */
  lesson(
    'tr-l1-wants-needs',
    'خواستن و نیاز داشتن',
    'می‌خواهید چیزی بخواهید و بگویید به چه چیزی نیاز دارید.',
    [
      sentence('tr1-66', 'Bir çay istiyorum.', 'یک چای می‌خواهم.', 'بیر چای ایستی‌یوروم', 'istemek', 'خواستن'),
      sentence('tr1-67', 'Su istiyorum.', 'آب می‌خواهم.', 'سو ایستی‌یوروم', 'su', 'آب'),
      sentence('tr1-68', 'Yardım istiyorum.', 'کمک می‌خواهم.', 'یاردیم ایستی‌یوروم', 'yardım', 'کمک'),
      sentence('tr1-69', 'Yardıma ihtiyacım var.', 'به کمک نیاز دارم.', 'یاردیما ایحتییاجیم وار', 'ihtiyaç', 'نیاز'),
      sentence('tr1-70', 'Bir oda istiyorum.', 'یک اتاق می‌خواهم.', 'بیر اودا ایستی‌یوروم', 'oda', 'اتاق'),
      sentence('tr1-71', 'Ne istiyorsunuz?', 'چه می‌خواهید؟', 'نِه ایستی‌یورسونوز', 'ne', 'چه'),
      sentence('tr1-72', 'Sadece bir kahve, lütfen.', 'فقط یک قهوه، لطفاً.', 'سادِجه بیر کاهوِه', 'sadece', 'فقط'),
      sentence('tr1-73', 'Hesabı istiyorum.', 'صورت‌حساب را می‌خواهم.', 'حِسابی ایستی‌یوروم', 'hesap', 'صورت‌حساب'),
    ],
    [
      { speaker: 'مریم', text: 'Bir çay istiyorum, lütfen.', fa: 'یک چای می‌خواهم، لطفاً.' },
      { speaker: 'امیر', text: 'Şekerli mi, şekersiz mi?', fa: 'با شکر یا بی‌شکر؟' },
      { speaker: 'مریم', text: 'Şekersiz, lütfen.', fa: 'بی‌شکر، لطفاً.' },
      { speaker: 'امیر', text: 'Buyurun!', fa: 'بفرمایید!' },
    ],
    [
      { promptFa: '«یک چای می‌خواهم» کدام است؟', choices: ['Bir çay istiyorum.', 'Bir çay var.', 'Bir çay nerede?'], correctIndex: 0, explanationFa: 'istemek یعنی خواستن؛ istiyorum = می‌خواهم.' },
      { promptFa: '«به کمک نیاز دارم» کدام است؟', choices: ['Yardıma ihtiyacım var.', 'Yardım istiyorum.', 'Yardım edin.'], correctIndex: 0, explanationFa: 'ihtiyacım var یعنی نیاز دارم.' },
    ],
    'فعل در ترکی در پایان جمله می‌آید: Bir çay istiyorum (یک چای می‌خواهم). ریشهٔ istemek با -iyor و پایانهٔ شخص صرف می‌شود: istiyorum (می‌خواهم)، istiyorsunuz (می‌خواهید). «ihtiyacım var» به معنی «نیاز دارم» است و در پایان جمله می‌آید.',
  ),

  /* ---------- درس ۱۰ ---------- */
  lesson(
    'tr-l1-colors',
    'رنگ‌ها و صفت‌های ساده',
    'می‌خواهید رنگ چیزی را بپرسید و با صفت‌های ساده توصیف کنید.',
    [
      sentence('tr1-74', 'Bu ne renk?', 'این چه رنگی است؟', 'بو نِه رِنک', 'renk', 'رنگ'),
      sentence('tr1-75', 'Kırmızı.', 'قرمز.', 'کیرمیزه', 'kırmızı', 'قرمز'),
      sentence('tr1-76', 'Mavi.', 'آبی.', 'ماوی', 'mavi', 'آبی'),
      sentence('tr1-77', 'Yeşil.', 'سبز.', 'یِشیل', 'yeşil', 'سبز'),
      sentence('tr1-78', 'Siyah.', 'سیاه.', 'سیاه', 'siyah', 'سیاه'),
      sentence('tr1-79', 'Beyaz.', 'سفید.', 'بِیاز', 'beyaz', 'سفید'),
      sentence('tr1-80', 'Sarı.', 'زرد.', 'ساری', 'sarı', 'زرد'),
      sentence('tr1-81', 'Bu araba çok büyük.', 'این ماشین خیلی بزرگ است.', 'بو آرابا چوک بویوک', 'büyük', 'بزرگ'),
    ],
    [
      { speaker: 'امیر', text: 'Bu araba ne renk?', fa: 'این ماشین چه رنگی است؟' },
      { speaker: 'مریم', text: 'Kırmızı. Çok güzel!', fa: 'قرمز. خیلی زیبا!' },
      { speaker: 'امیر', text: 'Evet, ama çok büyük.', fa: 'بله، اما خیلی بزرگ است.' },
    ],
    [
      { promptFa: 'کدام کلمه یعنی «سبز»؟', choices: ['Yeşil', 'Mavi', 'Sarı'], correctIndex: 0, explanationFa: 'yeşil = سبز، mavi = آبی، sarı = زرد.' },
      { promptFa: 'صفت در جملهٔ «Bu araba çok büyük» کدام است؟', choices: ['büyük', 'araba', 'çok'], correctIndex: 0, explanationFa: 'büyük یعنی بزرگ و صفت جمله است.' },
    ],
    'صفت پیش از اسم می‌آید و تغییر نمی‌کند: kırmızı araba (ماشین قرمز)، kırmızı ev (خانهٔ قرمز). در جملهٔ اسمی صفت پس از اسم می‌آید: «Araba kırmızı» یعنی «ماشین قرمز است». çok به معنای «خیلی» پیش از صفت می‌آید.',
  ),
];
