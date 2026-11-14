import type { LearningSentence } from './types';
import type { BridgeLoanword, BridgeRule, SentenceBridge } from './russianPersianBridge';

/**
 * «پل فارسی» for Turkish — the Persian-first teaching layer of the Turkish course.
 *
 * Turkish is unusually close to Persian for a Persian speaker: verb-final order, no articles, no
 * grammatical gender, the copula glued to the noun («dانشجو-ام» ↔ «öğrenci-yim»), «var/yok» ↔
 * «هست/نیست», and thousands of shared Persian/Arabic words. The traps are specific: suffixes do
 * the work of Persian prepositions, vowel harmony reshapes every suffix, negation sits *inside*
 * the verb, the question particle «mı» follows the word, and a dozen shared words changed meaning
 * («hasta» is sick, not tired). Pure data + matching; lesson content is never touched.
 */

/** Lower-case with Turkish-aware dotted/dotless i. */
export const normalizeTurkish = (text: string): string =>
  text.normalize('NFC').replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase();

const L = 'a-zçğıöşüâîû';
/** Turkish-aware word boundary (JS `\b` does not know ç ğ ı ö ş ü). */
const B = `(?:(?<![${L}])(?=[${L}])|(?<=[${L}])(?![${L}]))`;
const W = `[${L}]`;
const PERSON = '(yım|yim|yum|yüm|ım|im|um|üm|sın|sin|sun|sün|yız|yiz|yuz|yüz|ız|iz|uz|üz|sınız|siniz|sunuz|sünüz|dır|dir|dur|dür|tır|tir|tur|tür)';

export const TURKISH_BRIDGE_RULES: readonly BridgeRule[] = [
  { id: 'var-yok', kind: 'same', title: 'داشتن = «هست / نیست»', literal: '«پولم هست»', note: 'ترکی هم مثل فارسیِ محاوره «داشتن» را با «هست/نیست» می‌گوید: «Param var» = «پولم هست»، «Vaktim yok» = «وقتم نیست». پسوند مالکیت (-m، -n، -si) روی اسم می‌نشیند و «var/yok» آخر می‌آید.', test: new RegExp(`${B}(var|yok)( mı| mi| mu| mü)?${B}`) },
  { id: 'copula', kind: 'same', title: '«هستم» می‌چسبد، مثل فارسی', literal: '«دانشجو-ام»', note: '«Öğrenciyim» دقیقاً «دانشجوام» است: اسم + پسوند شخص. -(y)ım = «-ام»، -sın = «-ای»، -(y)ız = «-ایم»، -sınız = «-اید». سوم شخص (-dır) معمولاً حذف می‌شود، همان‌طور که در محاوره «است» را می‌اندازیم.', test: new RegExp(`${B}(iyi|nasıl|öğrenci|öğretmen|doktor|hasta|mutlu|yorgun|hazır|meşgul|evli|bekâr|bekar|burada|orada|evde|işte|okulda|türk|iranlı|memnun|aç|tok|üzgün|emin|yabancı|mühendis|avukat|hemşire|garson|şoför|müdür|memur|arkadaş|komşu|yalnız|geç|erken|haklı|rahat|yaşında|hoş|güzel|küçük|büyük|genç|yeni|eski|kimsiniz|kim|nerede|nereli|burdа|hangi)(y?${PERSON})${B}`) },
  { id: 'degil', kind: 'trap', title: 'سه جور «نه»', literal: '«değil / yok / -me»', note: 'فارسی با «نـ / نیست» همه‌چیز را منفی می‌کند؛ ترکی سه ابزار جدا دارد: «değil» برای اسم و صفت («hasta değilim» = بیمار نیستم)، «yok» برای نداشتن/نبودن، و «-me/-ma» داخل فعل. اشتباهِ رایجِ فارسی‌زبان: «değil» با فعل.', test: new RegExp(`${B}değil${B}`) },
  { id: 'neg-infix', kind: 'trap', title: '«نـ» وسط فعل می‌نشیند', literal: '«gel-mi-yor-um» = نمی‌آیم', note: 'در فارسی «نـ» اول فعل است («نمی‌آیم»)؛ در ترکی منفی‌ساز «-me/-ma» بین ریشه و زمان می‌آید: gel-mi-yor-um، git-me-di-m، yap-ma-yacağ-ım. پس اول فعل را بساز، بعد «نه» را داخلش بگذار.', test: new RegExp(`${B}${W}+(mı|mi|mu|mü)yor${W}*${B}|${B}${W}+(ma|me)(dı|di|du|dü|yacak|yecek|yacağ|yeceğ|malı|meli|z|m|yın|yin)${W}*${B}`) },
  { id: 'question-particle', kind: 'same', title: '«mı» همان «آیا» است', literal: '«… مگه؟»', note: '«mı / mi / mu / mü» همان «آیا» است، فقط بعد از کلمه‌ای می‌آید که دربارهٔ آن می‌پرسی و جدا نوشته می‌شود: «Geliyor musun?» = «می‌آیی؟». وقتی کلمهٔ پرسشی (ne، nerede، kim) هست، «mı» نمی‌آید — عین فارسی که «آیا» را با «چی/کجا» نمی‌آوریم.', test: new RegExp(`${B}(mı|mi|mu|mü)(yım|yim|yum|yüm|sın|sin|sun|sun|sün|yız|yiz|yuz|yüz|sınız|siniz|sunuz|sünüz|dır|dir|dur|dür|ydı|ydi|ydu|ydü)?${B}`) },
  { id: 'possessive', kind: 'same', title: 'پسوند مالکیت مثل فارسی', literal: '«ev-im» = خانه‌ام', note: '«evim، evin، evi» = «خانه‌ام، خانه‌ات، خانه‌اش» — همان پسوندهای فارسی. فرقش این‌که ترکی مالک را هم می‌تواند جلو بیاورد: «benim evim» = «خانهٔ منِ من»؛ در محاوره «benim» را می‌اندازند، درست مثل ما.', test: new RegExp(`${B}(benim|senin|onun|bizim|sizin|onların)${B}`) },
  { id: 'plural', kind: 'same', title: '«-lar» همان «-ها» است', note: '«kitaplar» = «کتاب‌ها». مثل فارسی بعد از عدد جمع نمی‌بندند: «üç kitap» = «سه کتاب» (نه kitaplar). فقط حواست به هماهنگی واکه باشد: -lar بعد از a/ı/o/u و -ler بعد از e/i/ö/ü.', test: new RegExp(`${B}${W}{3,}(lar|ler)(ı|i|ım|im|ımız|imiz|ınız|iniz|da|de|dan|den|a|e)?${B}`) },
  { id: 'vowel-harmony', kind: 'trap', title: 'هر پسوند، رنگِ کلمه را می‌گیرد', literal: '«-de / -da / -te / -ta»', note: 'ترکی یک پسوند را با چهار شکل می‌نویسد تا با واکهٔ آخر کلمه هماهنگ باشد: evde / okulda / işte / parkta. فارسی چنین چیزی ندارد؛ قاعده ساده است: a-ı-o-u → شکل با a/ı، e-i-ö-ü → شکل با e/i. بی‌صداهای k-p-t-ç-s-ş-h-f پسوند را سخت می‌کنند (d→t).', test: new RegExp(`${B}${W}{2,}(ta|te|tan|ten|tı|ti|tu|tü)(m|n|k|nız|niz)?${B}`) },
  { id: 'yor', kind: 'structure', title: '«-yor» = «دارم می‌…»', literal: '«gel-iyor-um» = دارم می‌آیم / می‌آیم', note: '«-yor» زمان حال ترکی است و هم «می‌آیم» و هم «دارم می‌آیم» را می‌پوشاند. برای کارهای همیشگی ترکی زمان دیگری دارد (-r/-ir: «gelirim» = می‌آیم به‌طور معمول). در مکالمهٔ روزمره «-yor» تقریباً همه‌جا جواب می‌دهد.', test: new RegExp(`${B}${W}+yor(um|sun|uz|sunuz|lar|du|dum|dun|duk|muş)?${B}`) },
  { id: 'past-di', kind: 'same', title: 'گذشته با «-دی» مثل فارسی', literal: '«gel-di-m» = آمد-م', note: '«geldim، geldin، geldi» ↔ «آمدم، آمدی، آمد». حتی صدای پسوند شبیه «-د» فارسی است. «-mış» گذشتهٔ نقلی است: «gelmiş» = «آمده (گویا)» وقتی خودت ندیده‌ای.', test: new RegExp(`${B}(?!günaydın|kadın|yakın|yardım|adım|aydın|altı|yedi|katı|tatlı|hadi|şimdi|kendi|gibi|iki|yirmi|dakika|tadı|adı|odun|kötü|dördü|sütü|gitti)${W}{2,}(dı|di|du|dü|tı|ti|tu|tü)(m|n|k|nız|niz|lar|ler)?${B}`) },
  { id: 'future', kind: 'same', title: 'آینده با «خواهم» ندارد؛ پسوند دارد', literal: '«gel-eceğ-im» = خواهم آمد', note: '«-ecek/-acak» = «خواهم …». در محاوره فارسی هم «می‌آیم» برای آینده کافی است، ولی ترکی برای آینده معمولاً همین پسوند را می‌گوید. قبل از پسوند شخصی k → ğ می‌شود: geleceğim.', test: new RegExp(`${B}${W}+(ecek|acak|eceğ|acağ)${W}*${B}`) },
  { id: 'sov', kind: 'same', title: 'فعل آخر جمله، مثل فارسی', note: 'ترکی هم مثل فارسی فاعل–مفعول–فعل است: «Ben çay içiyorum» = «من چای می‌نوشم». انگلیسی‌خوان‌ها اینجا گیج می‌شوند؛ تو نه. فقط صفت و مضاف‌الیه قبل از اسم می‌آیند: «büyük ev» = «خانهٔ بزرگ»، «Ali’nin evi» = «خانهٔ علی».', test: new RegExp(`^(ben|sen|o|biz|siz|onlar)${B}`) },
  { id: 'istemek', kind: 'trap', title: 'بعد از «می‌خواهم» مصدر می‌آید', literal: '«gitmek istiyorum» = می‌خواهم رفتن', note: 'فارسی «می‌خواهم بروم» (دو فعل صرف‌شده)؛ ترکی «gitmek istiyorum» = مصدر + می‌خواهم. فعل اول همیشه مصدر (-mek/-mak) است و صرف نمی‌شود. همین قاعده برای «می‌توانم»: «gidebilirim» (-ebil داخل فعل).', test: new RegExp(`${B}${W}+(mek|mak) (istiyor|ister|isted|istiyorum|lazım|gerek|zorunda)${W}*${B}`) },
  { id: 'abil', kind: 'structure', title: '«می‌توانم» داخل فعل است', literal: '«gid-ebil-ir-im» = می‌توانم بروم', note: 'ترکی فعل جدا برای «توانستن» ندارد؛ «-ebil/-abil» را داخل فعل می‌گذارد: «yapabilirim» = «می‌توانم انجام بدهم». منفی‌اش «-eme/-ama»: «yapamam» = «نمی‌توانم». یک کلمهٔ ترکی = یک جملهٔ فارسی.', test: new RegExp(`${B}${W}+(ebil|abil)${W}*${B}|${B}${W}+(amam|emem|amaz|emez|amıyor|emiyor|amadı|emedi)${W}*${B}`) },
  { id: 'case-suffix', kind: 'structure', title: 'حرف اضافه، پسوند می‌شود', literal: '«ev-de» = در خانه · «ev-e» = به خانه · «ev-den» = از خانه', note: 'فارسی «در، به، از» را قبل از اسم می‌گوید؛ ترکی همان‌ها را به تهِ اسم می‌چسباند: -de/-da = «در»، -e/-a = «به»، -den/-dan = «از»، -i/-ı = «را». ترتیب ذهنی: اول اسم، بعد حرف اضافه.', test: new RegExp(`${B}${W}{3,}(dan|den|tan|ten|ndan|nden)${B}|${B}(?!ne|de|da|ya|ve|ta|te)${W}{3,}(?<!zaman|kadar|sonra|bura|şura|ora|nere)(da|de|ta|te|nda|nde)${B}`) },
  { id: 'ne-zaman', kind: 'same', title: 'کلمهٔ پرسشی سر جای خودش می‌ماند', note: 'در ترکی مثل فارسی کلمهٔ پرسشی به اول جمله نمی‌رود؛ همان‌جا که جواب می‌نشیند می‌آید: «Nereye gidiyorsun?» = «کجا می‌روی؟»، «Saat kaçta geliyorsun?» = «ساعت چند می‌آیی؟».', test: new RegExp(`${B}(ne|neden|niçin|nasıl|nerede|nereye|nereden|kim|kimin|kime|kaç|kaçta|hangi|ne zaman|niye)${B}`) },
  { id: 'kadar-kind', kind: 'same', title: 'عین فارسی', literal: '«تا … / به‌اندازهٔ …»', note: '«kadar» هم «تا» است هم «به اندازهٔ»: «saat beşe kadar» = «تا ساعت پنج»، «senin kadar» = «به اندازهٔ تو». «için» = «برای» (بعد از اسم می‌آید: «senin için» = برای تو).', test: new RegExp(`${B}(kadar|için|gibi|ile)${B}`) },
  { id: 'honorific', kind: 'same', title: '«شما»ی احترام', note: '«siz» مثل «شما» فارسی هم جمع است هم محترمانه؛ با غریبه و بزرگ‌تر «siz»، با دوست «sen». «Bey / Hanım» بعد از اسم کوچک = «آقا / خانم»: «Ali Bey»، «Ayşe Hanım».', test: new RegExp(`${B}(siz|sizin|size|sizi|bey|hanım|efendim)${B}`) },
];

/**
 * Words a Persian speaker already owns. Most came from Persian or Arabic into Turkish; some changed
 * meaning on the way (flagged in `fa` with «≠» so the chip itself warns).
 */
export const TURKISH_BRIDGE_LOANWORDS: readonly BridgeLoanword[] = [
  { stem: 'merhaba', ru: 'merhaba', fa: 'مرحبا (سلام)', note: 'از عربی' },
  { stem: 'teşekkür', ru: 'teşekkür', fa: 'تشکر', note: 'از عربی' },
  { stem: 'lütfen', ru: 'lütfen', fa: 'لطفاً', note: 'از عربی «لطف»' },
  { stem: 'tamam', ru: 'tamam', fa: 'تمام (باشه)', note: 'از عربی' },
  { stem: 'hoş', ru: 'hoş', fa: 'خوش', note: 'از فارسی' },
  { stem: 'dost', ru: 'dost', fa: 'دوست', note: 'از فارسی' },
  { stem: 'can', ru: 'can', fa: 'جان', note: 'از فارسی', maxExtra: 3 },
  { stem: 'hafta', ru: 'hafta', fa: 'هفته', note: 'از فارسی' },
  { stem: 'zaman', ru: 'zaman', fa: 'زمان', note: 'از عربی' },
  { stem: 'saat', ru: 'saat', fa: 'ساعت', note: 'از عربی' },
  { stem: 'dakika', ru: 'dakika', fa: 'دقیقه', note: 'از عربی' },
  { stem: 'sabah', ru: 'sabah', fa: 'صباح (صبح)', note: 'از عربی' },
  { stem: 'akşam', ru: 'akşam', fa: 'شام ≠ عصر/غروب', note: 'از فارسی، معنی عوض شده' },
  { stem: 'şehir', ru: 'şehir', fa: 'شهر', note: 'از فارسی' },
  { stem: 'şehr', ru: 'şehir', fa: 'شهر', note: 'از فارسی' },
  { stem: 'pazar', ru: 'pazar', fa: 'بازار (و یکشنبه)', note: 'از فارسی' },
  { stem: 'çarşı', ru: 'çarşı', fa: 'چهارسو (بازار)', note: 'از فارسی' },
  { stem: 'bahçe', ru: 'bahçe', fa: 'باغچه (باغ)', note: 'از فارسی' },
  { stem: 'pencere', ru: 'pencere', fa: 'پنجره', note: 'از فارسی' },
  { stem: 'duvar', ru: 'duvar', fa: 'دیوار', note: 'از فارسی' },
  { stem: 'perde', ru: 'perde', fa: 'پرده', note: 'از فارسی' },
  { stem: 'ayna', ru: 'ayna', fa: 'آینه', note: 'از فارسی' },
  { stem: 'kitap', ru: 'kitap', fa: 'کتاب', note: 'از عربی' },
  { stem: 'kitab', ru: 'kitap', fa: 'کتاب', note: 'از عربی' },
  { stem: 'kalem', ru: 'kalem', fa: 'قلم', note: 'از عربی' },
  { stem: 'defter', ru: 'defter', fa: 'دفتر', note: 'از عربی/فارسی' },
  { stem: 'kağıt', ru: 'kağıt', fa: 'کاغذ', note: 'از فارسی' },
  { stem: 'ders', ru: 'ders', fa: 'درس', note: 'از عربی' },
  { stem: 'sınıf', ru: 'sınıf', fa: 'صنف (کلاس)', note: 'از عربی' },
  { stem: 'harf', ru: 'harf', fa: 'حرف', note: 'از عربی' },
  { stem: 'kelime', ru: 'kelime', fa: 'کلمه', note: 'از عربی' },
  { stem: 'cümle', ru: 'cümle', fa: 'جمله', note: 'از عربی' },
  { stem: 'cevap', ru: 'cevap', fa: 'جواب', note: 'از عربی' },
  { stem: 'cevab', ru: 'cevap', fa: 'جواب', note: 'از عربی' },
  { stem: 'sual', ru: 'sual', fa: 'سؤال', note: 'از عربی' },
  { stem: 'haber', ru: 'haber', fa: 'خبر', note: 'از عربی' },
  { stem: 'mektup', ru: 'mektup', fa: 'مکتوب (نامه)', note: 'از عربی' },
  { stem: 'resim', ru: 'resim', fa: 'رسم (عکس/نقاشی)', note: 'از عربی' },
  { stem: 'hikaye', ru: 'hikaye', fa: 'حکایت', note: 'از عربی' },
  { stem: 'hikâye', ru: 'hikâye', fa: 'حکایت', note: 'از عربی' },
  { stem: 'tercüme', ru: 'tercüme', fa: 'ترجمه', note: 'از عربی' },
  { stem: 'çay', ru: 'çay', fa: 'چای', note: 'مشترک' },
  { stem: 'kahve', ru: 'kahve', fa: 'قهوه', note: 'از عربی' },
  { stem: 'şeker', ru: 'şeker', fa: 'شکر', note: 'از فارسی' },
  { stem: 'peynir', ru: 'peynir', fa: 'پنیر', note: 'از فارسی' },
  { stem: 'meyve', ru: 'meyve', fa: 'میوه', note: 'از فارسی' },
  { stem: 'sebze', ru: 'sebze', fa: 'سبزه (سبزیجات)', note: 'از فارسی' },
  { stem: 'pilav', ru: 'pilav', fa: 'پلو', note: 'از فارسی' },
  { stem: 'nar', ru: 'nar', fa: 'انار', note: 'از فارسی', maxExtra: 2 },
  { stem: 'badem', ru: 'badem', fa: 'بادام', note: 'از فارسی' },
  { stem: 'tava', ru: 'tava', fa: 'تابه', note: 'از فارسی' },
  { stem: 'hasta', ru: 'hasta', fa: 'خسته ≠ بیمار', note: 'از فارسی، معنی عوض شده' },
  { stem: 'hastane', ru: 'hastane', fa: 'خسته‌خانه = بیمارستان', note: 'از فارسی' },
  { stem: 'eczane', ru: 'eczane', fa: 'اجزاخانه = داروخانه', note: 'از عربی/فارسی' },
  { stem: 'ilaç', ru: 'ilaç', fa: 'علاج (دارو)', note: 'از عربی' },
  { stem: 'ilac', ru: 'ilaç', fa: 'علاج (دارو)', note: 'از عربی' },
  { stem: 'doktor', ru: 'doktor', fa: 'دکتر', note: 'واژهٔ بین‌المللی' },
  { stem: 'dert', ru: 'dert', fa: 'درد (غم)', note: 'از فارسی' },
  { stem: 'rahat', ru: 'rahat', fa: 'راحت', note: 'از عربی' },
  { stem: 'hazır', ru: 'hazır', fa: 'حاضر (آماده)', note: 'از عربی' },
  { stem: 'lazım', ru: 'lazım', fa: 'لازم', note: 'از عربی' },
  { stem: 'mümkün', ru: 'mümkün', fa: 'ممکن', note: 'از عربی' },
  { stem: 'meşgul', ru: 'meşgul', fa: 'مشغول', note: 'از عربی' },
  { stem: 'yavaş', ru: 'yavaş', fa: 'یواش', note: 'از فارسی' },
  { stem: 'çabuk', ru: 'çabuk', fa: 'چابک (سریع)', note: 'از فارسی' },
  { stem: 'tembel', ru: 'tembel', fa: 'تنبل', note: 'از فارسی' },
  { stem: 'zengin', ru: 'zengin', fa: 'سنگین ≠ ثروتمند', note: 'از فارسی، معنی عوض شده' },
  { stem: 'fakir', ru: 'fakir', fa: 'فقیر', note: 'از عربی' },
  { stem: 'bedava', ru: 'bedava', fa: 'بادِهوا (مجانی)', note: 'از فارسی' },
  { stem: 'peşin', ru: 'peşin', fa: 'پیشین (نقد)', note: 'از فارسی' },
  { stem: 'pahalı', ru: 'pahalı', fa: 'بها (گران)', note: 'از فارسی' },
  { stem: 'para', ru: 'para', fa: 'پاره (پول)', note: 'از فارسی', maxExtra: 4 },
  { stem: 'hesap', ru: 'hesap', fa: 'حساب', note: 'از عربی' },
  { stem: 'hesab', ru: 'hesap', fa: 'حساب', note: 'از عربی' },
  { stem: 'kira', ru: 'kira', fa: 'کرایه', note: 'از عربی' },
  { stem: 'misafir', ru: 'misafir', fa: 'مسافر ≠ مهمان', note: 'از عربی، معنی عوض شده' },
  { stem: 'ziyaret', ru: 'ziyaret', fa: 'زیارت (دیدار)', note: 'از عربی' },
  { stem: 'seyahat', ru: 'seyahat', fa: 'سیاحت (سفر)', note: 'از عربی' },
  { stem: 'serbest', ru: 'serbest', fa: 'سربست ≠ آزاد', note: 'از فارسی، معنی عوض شده' },
  { stem: 'rüzgar', ru: 'rüzgâr', fa: 'روزگار ≠ باد', note: 'از فارسی، معنی عوض شده' },
  { stem: 'rüzgâr', ru: 'rüzgâr', fa: 'روزگار ≠ باد', note: 'از فارسی، معنی عوض شده' },
  { stem: 'hava', ru: 'hava', fa: 'هوا', note: 'از عربی' },
  { stem: 'bahar', ru: 'bahar', fa: 'بهار', note: 'از فارسی' },
  { stem: 'dünya', ru: 'dünya', fa: 'دنیا', note: 'از عربی' },
  { stem: 'insan', ru: 'insan', fa: 'انسان', note: 'از عربی' },
  { stem: 'hanım', ru: 'hanım', fa: 'خانم', note: 'مشترک' },
  { stem: 'aile', ru: 'aile', fa: 'عائله (خانواده)', note: 'از عربی' },
  { stem: 'kalp', ru: 'kalp', fa: 'قلب', note: 'از عربی' },
  { stem: 'kalb', ru: 'kalp', fa: 'قلب', note: 'از عربی' },
  { stem: 'aşk', ru: 'aşk', fa: 'عشق', note: 'از عربی' },
  { stem: 'beraber', ru: 'beraber', fa: 'برابر = با هم', note: 'از فارسی، معنی عوض شده' },
  { stem: 'taraf', ru: 'taraf', fa: 'طرف', note: 'از عربی' },
  { stem: 'şey', ru: 'şey', fa: 'شیء (چیز)', note: 'از عربی', maxExtra: 4 },
  { stem: 'mesele', ru: 'mesele', fa: 'مسئله', note: 'از عربی' },
  { stem: 'vakit', ru: 'vakit', fa: 'وقت', note: 'از عربی' },
  { stem: 'vakt', ru: 'vakit', fa: 'وقت', note: 'از عربی' },
  { stem: 'sene', ru: 'sene', fa: 'سنه (سال)', note: 'از عربی' },
  { stem: 'köşe', ru: 'köşe', fa: 'گوشه', note: 'از فارسی' },
  { stem: 'kenar', ru: 'kenar', fa: 'کنار', note: 'از فارسی' },
  { stem: 'memleket', ru: 'memleket', fa: 'مملکت', note: 'از عربی' },
  { stem: 'vatan', ru: 'vatan', fa: 'وطن', note: 'از عربی' },
  { stem: 'millet', ru: 'millet', fa: 'ملت', note: 'از عربی' },
  { stem: 'devlet', ru: 'devlet', fa: 'دولت', note: 'از عربی' },
  { stem: 'tarih', ru: 'tarih', fa: 'تاریخ', note: 'از عربی' },
  { stem: 'edebiyat', ru: 'edebiyat', fa: 'ادبیات', note: 'از عربی' },
  { stem: 'sanat', ru: 'sanat', fa: 'صنعت ≠ هنر', note: 'از عربی، معنی عوض شده' },
  { stem: 'hüner', ru: 'hüner', fa: 'هنر (مهارت)', note: 'از فارسی' },
  { stem: 'meslek', ru: 'meslek', fa: 'مسلک (شغل)', note: 'از عربی' },
  { stem: 'memur', ru: 'memur', fa: 'مأمور (کارمند)', note: 'از عربی' },
  { stem: 'müdür', ru: 'müdür', fa: 'مدیر', note: 'از عربی' },
  { stem: 'hoca', ru: 'hoca', fa: 'خواجه (استاد)', note: 'از فارسی' },
  { stem: 'talebe', ru: 'talebe', fa: 'طلبه (دانشجو)', note: 'از عربی' },
  { stem: 'çünkü', ru: 'çünkü', fa: 'چونکه', note: 'از فارسی' },
  { stem: 'eğer', ru: 'eğer', fa: 'اگر', note: 'از فارسی' },
  { stem: 'her', ru: 'her', fa: 'هر', note: 'از فارسی', maxExtra: 3 },
  { stem: 'hiç', ru: 'hiç', fa: 'هیچ', note: 'از فارسی' },
  { stem: 'ama', ru: 'ama', fa: 'اما', note: 'از عربی', maxExtra: 0 },
  { stem: 'ya', ru: 'ya', fa: 'یا', note: 'از فارسی', maxExtra: 0 },
  { stem: 'belki', ru: 'belki', fa: 'بلکه (شاید)', note: 'از فارسی' },
  { stem: 'hemen', ru: 'hemen', fa: 'همان (فوراً)', note: 'از فارسی' },
  { stem: 'maalesef', ru: 'maalesef', fa: 'مع‌الأسف', note: 'از عربی' },
  { stem: 'inşallah', ru: 'inşallah', fa: 'ان‌شاءالله', note: 'از عربی' },
  { stem: 'tabii', ru: 'tabii', fa: 'طبعاً (البته)', note: 'از عربی' },
  { stem: 'tabi', ru: 'tabii', fa: 'طبعاً (البته)', note: 'از عربی' },
  { stem: 'acaba', ru: 'acaba', fa: 'عجبا (آیا/یعنی)', note: 'از عربی' },
  { stem: 'mesela', ru: 'mesela', fa: 'مثلاً', note: 'از عربی' },
  { stem: 'galiba', ru: 'galiba', fa: 'غالباً (گویا)', note: 'از عربی' },
  { stem: 'kısmet', ru: 'kısmet', fa: 'قسمت', note: 'از عربی' },
  { stem: 'şans', ru: 'şans', fa: 'شانس', note: 'واژهٔ بین‌المللی' },
  { stem: 'otobüs', ru: 'otobüs', fa: 'اتوبوس', note: 'واژهٔ بین‌المللی' },
  { stem: 'taksi', ru: 'taksi', fa: 'تاکسی', note: 'واژهٔ بین‌المللی' },
  { stem: 'metro', ru: 'metro', fa: 'مترو', note: 'واژهٔ بین‌المللی' },
  { stem: 'tren', ru: 'tren', fa: 'ترن (قطار)', note: 'واژهٔ بین‌المللی' },
  { stem: 'bilet', ru: 'bilet', fa: 'بلیت', note: 'واژهٔ بین‌المللی' },
  { stem: 'otel', ru: 'otel', fa: 'هتل', note: 'واژهٔ بین‌المللی' },
  { stem: 'restoran', ru: 'restoran', fa: 'رستوران', note: 'واژهٔ بین‌المللی' },
  { stem: 'market', ru: 'market', fa: 'مارکت', note: 'واژهٔ بین‌المللی' },
  { stem: 'telefon', ru: 'telefon', fa: 'تلفن', note: 'واژهٔ بین‌المللی' },
  { stem: 'internet', ru: 'internet', fa: 'اینترنت', note: 'واژهٔ بین‌المللی' },
  { stem: 'müzik', ru: 'müzik', fa: 'موزیک', note: 'واژهٔ بین‌المللی' },
  { stem: 'sinema', ru: 'sinema', fa: 'سینما', note: 'واژهٔ بین‌المللی' },
  { stem: 'banka', ru: 'banka', fa: 'بانک', note: 'واژهٔ بین‌المللی' },
  { stem: 'pasaport', ru: 'pasaport', fa: 'پاسپورت', note: 'واژهٔ بین‌المللی' },
  { stem: 'adres', ru: 'adres', fa: 'آدرس', note: 'واژهٔ بین‌المللی' },
  { stem: 'numara', ru: 'numara', fa: 'نمره (شماره)', note: 'واژهٔ بین‌المللی' },
  { stem: 'program', ru: 'program', fa: 'برنامه', note: 'واژهٔ بین‌المللی' },
  { stem: 'proje', ru: 'proje', fa: 'پروژه', note: 'واژهٔ بین‌المللی' },
  { stem: 'ofis', ru: 'ofis', fa: 'آفیس (دفتر)', note: 'واژهٔ بین‌المللی' },
  { stem: 'sistem', ru: 'sistem', fa: 'سیستم', note: 'واژهٔ بین‌المللی' },
  { stem: 'problem', ru: 'problem', fa: 'پرابلم (مشکل)', note: 'واژهٔ بین‌المللی' },
  { stem: 'fikir', ru: 'fikir', fa: 'فکر', note: 'از عربی' },
  { stem: 'fikr', ru: 'fikir', fa: 'فکر', note: 'از عربی' },
  { stem: 'merak', ru: 'merak', fa: 'مراق ≠ کنجکاوی/نگرانی', note: 'از عربی، معنی عوض شده' },
  { stem: 'sohbet', ru: 'sohbet', fa: 'صحبت', note: 'از عربی' },
  { stem: 'selam', ru: 'selam', fa: 'سلام', note: 'از عربی' },
  { stem: 'afiyet', ru: 'afiyet', fa: 'عافیت', note: 'از عربی' },
  { stem: 'sıhhat', ru: 'sıhhat', fa: 'صحت', note: 'از عربی' },
  { stem: 'sağlık', ru: 'sağlık', fa: 'سلامتی (ترکی اصیل)', note: '«sağ ol» = زنده باشی' },
];

const words = (text: string): string[] => normalizeTurkish(text).replace(/'/g, ' ').split(new RegExp(`[^${L}]+`)).filter(Boolean);

export function turkishLoanwordsIn(text: string): BridgeLoanword[] {
  const seen = new Set<string>();
  const result: BridgeLoanword[] = [];
  for (const word of words(text)) {
    for (const item of TURKISH_BRIDGE_LOANWORDS) {
      const extra = item.maxExtra ?? 5;
      if (word.startsWith(item.stem) && word.length <= item.stem.length + extra && !seen.has(item.ru)) { seen.add(item.ru); result.push(item); }
    }
  }
  return result.slice(0, 3);
}

/** First matching rule by priority (rules are ordered from most specific to most general). */
export function turkishBridgeRuleFor(text: string): BridgeRule | null {
  const haystack = normalizeTurkish(text).replace(/[’']/g, '');
  for (const rule of TURKISH_BRIDGE_RULES) if (rule.test.test(haystack)) return rule;
  return null;
}

export function turkishBridgeFor(sentence: Pick<LearningSentence, 'text' | 'fa'>): SentenceBridge {
  return { rule: turkishBridgeRuleFor(sentence.text), loanwords: turkishLoanwordsIn(sentence.text) };
}

/** Rules that appear in a lesson, deduplicated in order of first appearance — for the lesson summary. */
export function turkishBridgeRulesForLesson(sentences: ReadonlyArray<Pick<LearningSentence, 'text' | 'fa'>>): BridgeRule[] {
  const out: BridgeRule[] = [];
  for (const sentence of sentences) {
    const rule = turkishBridgeRuleFor(sentence.text);
    if (rule && !out.includes(rule)) out.push(rule);
  }
  return out;
}
