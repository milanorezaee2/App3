#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'node_modules', '.cache', 'turkish-structure-test.cjs');

await esbuild.build({
  stdin: {
    contents: [
      "import * as turkish from './lib/languages/turkish';",
      "import * as studyState from './lib/languages/turkishStudyState';",
      "import * as russian from './lib/languages/russian';",
      "import * as english from './lib/courseContent';",
      "import * as catalog from './lib/languages/catalog';",
      "import * as pronunciation from './lib/languages/pronunciationCourse';",
      "import * as resume from './lib/appResume';",
      'export { turkish, studyState, russian, english, catalog, pronunciation, resume };',
    ].join('\n'),
    resolveDir: root,
  },
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: output,
  plugins: [{
    name: 'turkish-structure-test-stubs',
    setup(build) {
      build.onResolve({ filter: /^\.\/supabase$/ }, args => args.importer.endsWith('/lib/createCourseProgressStore.ts')
        ? { path: 'supabase', namespace: 'turkish-supabase-stub' }
        : null);
      build.onLoad({ filter: /.*/, namespace: 'turkish-supabase-stub' }, () => ({
        contents: 'export const supabase = { auth: { async getSession() { globalThis.__turkishSupabaseCalls = (globalThis.__turkishSupabaseCalls || 0) + 1; return { data: { session: null } }; }, async signInAnonymously() { globalThis.__turkishSupabaseCalls = (globalThis.__turkishSupabaseCalls || 0) + 1; return { data: { user: null }, error: null }; } }, from() { globalThis.__turkishSupabaseCalls = (globalThis.__turkishSupabaseCalls || 0) + 1; return { upsert: async () => ({ data: null, error: null }) }; } };',
        loader: 'js',
      }));
      build.onResolve({ filter: /^@react-native-async-storage\/async-storage$/ }, () => ({ path: 'async-storage', namespace: 'turkish-storage-stub' }));
      build.onLoad({ filter: /.*/, namespace: 'turkish-storage-stub' }, () => ({
        contents: 'export default { async getItem(key) { return globalThis.__turkishNativeMemory?.get(key) ?? null; }, async setItem(key, value) { globalThis.__turkishNativeMemory ??= new Map(); globalThis.__turkishNativeMemory.set(key, String(value)); }, async removeItem(key) { globalThis.__turkishNativeMemory?.delete(key); } };',
        loader: 'js',
      }));
      build.onResolve({ filter: /^react-native$/ }, () => ({ path: 'react-native', namespace: 'turkish-platform-stub' }));
      build.onLoad({ filter: /.*/, namespace: 'turkish-platform-stub' }, () => ({ contents: 'export const Platform = { get OS() { return globalThis.__turkishPlatformOS || "web"; } };', loader: 'js' }));
    },
  }],
});

globalThis.__turkishPlatformOS = 'web';
const memory = new Map();
globalThis.window = {
  localStorage: {
    getItem(key) { return memory.has(key) ? memory.get(key) : null; },
    setItem(key, value) { memory.set(key, String(value)); },
    removeItem(key) { memory.delete(key); },
  },
};
globalThis.__turkishSupabaseCalls = 0;

const require = createRequire(import.meta.url);
const { turkish, studyState, russian, english, catalog, pronunciation, resume } = require(output);
let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks += 1; };

const EXPECTED_FOUNDATION_TITLES = [
  'الفبای ترکی استانبولی و تلفظ صحیح حروف',
  'سلام و احوال‌پرسی',
  'معرفی خود و دیگران',
  'ضمایر شخصی در جمله',
  'جمله‌های اسمی مثبت، منفی و پرسشی با پسوندهای شخصی',
  'ملیت، زبان و محل زندگی',
  'اعداد، سن و اطلاعات شخصی',
  'خانواده و روابط خانوادگی',
  'مالکیت و پسوندهای ملکی',
  'اسم‌ها، مفرد و جمع',
  'اشاره به اشخاص و اشیا (Bu / Şu / O)',
  'توصیف اشخاص، اشیا و مکان‌ها',
  'رنگ‌ها، شکل‌ها و ویژگی‌های ظاهری',
  'ساختارهای بیان وجود و عدم وجود (Var / Yok)',
  'جمله‌های فعلی ساده',
  'مصدر افعال و ریشه فعل',
  'زمان حال استمراری (Şimdiki Zaman)',
  'صرف افعال پرکاربرد در زمان حال استمراری',
  'جمله‌های مثبت، منفی و پرسشی',
  'پرسش‌سازی با کلمات پرسشی (Ne / Nerede / Kim / Ne zaman / Neden / Nasıl / Kaç / Hangi)',
  'اعداد ترتیبی، ساعت و تاریخ',
  'مکان و موقعیت مکانی',
  'حالت مکانی (Bulunma Hâli)',
  'حالت جهتی (Yönelme Hâli)',
  'حالت مبدأ (Ayrılma Hâli)',
  'حالت مفعولی (Belirtme Hâli)',
  'علایق، خواسته‌ها و نیازهای ساده',
  'توانایی و ناتوانی (-abil / -ebil)',
  'حروف اضافه و ساختارهای مکانی پایه',
  'برنامه روزانه و عادت‌ها',
  'حروف ربط پایه (Ve / Ama / Çünkü / Veya)',
  'ساختارهای ساده درخواست، اجازه و دستور',
  'هماهنگی واکه‌ها و قواعد انتخاب پسوندها',
  'ترتیب کلمات در جمله ترکی استانبولی',
];

const EXPECTED_SURVIVAL_TITLES = [
  'مکالمه در موقعیت‌های اجتماعی',
  'خرید، قیمت و پرداخت',
  'سفارش غذا و نوشیدنی',
  'صحبت در رستوران و کافه',
  'پرسیدن آدرس و مسیریابی',
  'حمل‌ونقل عمومی و تاکسی',
  'سفر، فرودگاه و خرید بلیت',
  'رزرو هتل و اقامت',
  'درخواست کمک و بیان مشکلات',
  'مراجعه به پزشک و بیان علائم ساده',
  'مکالمات ساده در محل کار و تحصیل',
  'صحبت درباره آب‌وهوا',
  'تماس تلفنی و پیام‌های کوتاه',
  'دعوت‌کردن، پذیرفتن و ردکردن دعوت',
  'درخواست مؤدبانه و اجازه‌گرفتن',
  'بیان دستورها و راهنمایی‌های ساده',
  'بیان پیشنهاد و توصیه ساده',
  'صحبت درباره گذشته و اتفاق‌های اخیر با عبارت‌های پایه',
  'صحبت درباره برنامه‌های آینده نزدیک',
  'بیان احساسات و وضعیت‌های روزمره',
  'پرسیدن اطلاعات و تکمیل فرم‌های ساده',
  'مکالمه در فروشگاه و سوپرمارکت',
  'صحبت درباره لباس و خرید پوشاک',
  'توصیف خانه و وسایل آن',
  'مکالمه درباره تفریح، سرگرمی و اوقات فراغت',
  'صحبت درباره کارهای روزمره و برنامه هفتگی',
  'بیان ترجیحات و انتخاب بین گزینه‌ها',
  'مقایسه‌های ساده',
  'بیان دلیل و نتیجه ساده',
  'شرکت در مکالمه روزمره با چند جمله مرتبط',
];

const EXPECTED_A2_FOUNDATION_TITLES = [
  'گسترش جمله‌سازی با زمان حال استمراری (Şimdiki Zaman) و زمان حال ساده/عادت‌نما (Geniş Zaman)',
  'بیان تفاوت عادت‌ها، فعالیت‌های روزمره و فعالیت‌های در حال انجام',
  'بیان گذشته با زمان گذشته قطعی (Belirli Geçmiş Zaman — Di’li Geçmiş Zaman)',
  'بیان گذشته با زمان گذشته غیرقطعی و نقل‌شده (Belirsiz Geçmiş Zaman — Miş’li Geçmiş Zaman)',
  'بیان تجربه‌ها و فعالیت‌های انجام‌شده',
  'بیان برنامه‌ها و قصدهای آینده با زمان آینده (Gelecek Zaman)',
  'بیان تصمیم، قصد و پیش‌بینی درباره آینده',
  'مقایسه اشخاص، اشیا و مکان‌ها (Karşılaştırma ve Üstünlük)',
  'بیان مقدار و تعداد (Çok, Az, Biraz, Birkaç, Daha Fazla, En Çok)',
  'بیان مالکیت و روابط میان اشخاص و اشیا (İyelik Ekleri)',
  'بیان ضرورت، اجبار و ممنوعیت (Gerekli Olmak, Zorunda Olmak, -malı/-meli, Yasak)',
  'بیان توصیه و پیشنهاد (Gereklilik Kipi، پیشنهاد با -malı/-meli و ساختارهای رایج)',
  'بیان توانایی، ناتوانی، امکان و اجازه (-abil/-ebil)',
  'بیان خواسته‌ها، ترجیحات و علاقه‌ها (İstemek, Tercih Etmek, Sevmek)',
  'بیان دلیل و نتیجه (Çünkü, Bu Yüzden, Bu Sebeple)',
  'بیان شرط‌های ساده (Şart Kipi — -sa/-se)',
  'بیان ترتیب و توالی رویدادها (Önce, Sonra, Daha Sonra, Önce… Sonra…)',
  'استفاده از قیدهای تکرار، زمان و مقدار',
  'استفاده از مصدر و ساختارهای فعلی پایه (-mak/-mek، -mayı/-meyi)',
  'ساخت جمله‌های مرکب و پیوند چند ایده',
  'بیان هدف و علت در ساختارهای ساده',
  'استفاده از حروف ربط و پیونددهنده‌های پرکاربرد (Ve, Ama, Fakat, Çünkü, Bu yüzden)',
  'بیان غیرمستقیم و بازگویی ساده گفته‌های دیگران',
  'تقویت پسوندهای حالت اسم (İsmin Hâlleri) و پسوندهای ملکی',
  'ساخت پرسش‌های چندبخشی و جمله‌های منفی پیچیده‌تر',
  'تقویت هماهنگی واکه‌ها و انتخاب صحیح پسوندها',
];

const EXPECTED_A2_SURVIVAL_TITLES = [
  'شرح تجربه‌ها و اتفاق‌های گذشته',
  'تعریف خاطرات و رویدادهای شخصی',
  'صحبت درباره برنامه‌های آینده و قرارها',
  'دعوت‌کردن، پیشنهاد دادن و هماهنگی برنامه‌ها',
  'خرید و مقایسه قیمت، کیفیت و ویژگی کالاها',
  'بازگرداندن کالا و بیان مشکل خرید',
  'سفارش غذا و بیان ترجیحات غذایی',
  'رزرو هتل و تغییر یا لغو رزرو',
  'برنامه‌ریزی سفر و پرسیدن اطلاعات گردشگری',
  'شرح مسیر و راهنمایی دیگران',
  'بیان مشکلات جسمی و توضیح علائم',
  'صحبت درباره سلامت و توصیه‌های ساده',
  'مکالمات کاری و شرح وظایف',
  'صحبت درباره تحصیل و برنامه‌های آموزشی',
  'بیان مشکل و درخواست راه‌حل',
  'شکایت مؤدبانه و درخواست رسیدگی',
  'صحبت درباره خانه، اجاره و امکانات',
  'توضیح اتفاق‌ها و مشکلات روزمره',
  'صحبت درباره سرگرمی‌ها و تجربه‌های جدید',
  'بیان نظر شخصی و توضیح دلیل آن',
  'موافقت و مخالفت با نظر دیگران',
  'مقایسه گزینه‌ها و انتخاب گزینه مناسب‌تر',
  'صحبت درباره تغییرات زندگی و عادت‌ها',
  'بیان احساسات، نگرانی‌ها و امیدها',
  'توضیح قوانین و دستورالعمل‌های ساده',
  'پرسیدن و پاسخ‌دادن به پرسش‌های چندبخشی',
  'بازگویی گفته‌های دیگران به زبان ساده',
  'تعریف داستان با ترتیب زمانی مشخص',
  'صحبت درباره اتفاق‌های شنیده‌شده یا تجربه‌های نقل‌شده',
  'شرکت در مکالمه‌های طولانی‌تر با چند جمله مرتبط',
  'مدیریت یک گفت‌وگوی روزمره از شروع تا پایان',
];

const EXPECTED_B1_FOUNDATION_TITLES = [
  'روایت کامل اتفاق‌ها و تجربه‌های گذشته با زمان گذشته قطعی (Di’li Geçmiş Zaman)',
  'بیان تجربه‌ها و اطلاعات شنیده‌شده با زمان گذشته غیرقطعی (Miş’li Geçmiş Zaman)',
  'بیان تفاوت کاربردهای زمان‌های گذشته',
  'بیان تجربه‌ها، تغییرات زندگی و اتفاق‌های ادامه‌دار با ساختارهای متناسب',
  'بیان عادت‌های گذشته و تغییرات زندگی',
  'بیان برنامه‌ها، اهداف و تصمیم‌های آینده با زمان آینده (Gelecek Zaman)',
  'بیان پیش‌بینی‌ها، احتمال و سناریوهای آینده',
  'بیان شرط‌های واقعی و احتمالی (Şart Kipi — -sa/-se)',
  'بیان موقعیت‌های فرضی و غیرواقعی با ساختارهای مناسب',
  'بیان علت، نتیجه و پیامد',
  'بیان هدف و دلیل انجام کارها',
  'بیان نظر شخصی و دفاع از دیدگاه',
  'بیان موافقت و مخالفت همراه با استدلال',
  'مقایسه اشخاص، موقعیت‌ها و گزینه‌ها و ارزیابی مزایا و معایب',
  'بیان ضرورت، توصیه و الزام با ساختارهای متنوع (-malı/-meli، Zorunda Olmak، Gerek)',
  'بیان احتمال، قطعیت، حدس و استنباط',
  'استفاده از افعال و ترکیب‌های فعلی پرکاربرد',
  'استفاده از ساختارهای بیان توانایی، اجبار، احتمال و ضرورت',
  'نقل گفته‌های دیگران و بازگویی اطلاعات',
  'استفاده از جمله‌های موصولی و توصیف دقیق‌تر اشخاص و اشیا',
  'آشنایی با ساختار مجهول پایه (Edilgen Çatı)',
  'اتصال ایده‌ها با حروف ربط و پیونددهنده‌های متنوع',
  'بیان روابط زمانی و توالی رویدادها',
  'خلاصه‌سازی و بازگویی اطلاعات',
  'توضیح فرایندها و دستورالعمل‌ها',
  'ساخت پاراگراف‌های منسجم با جمله‌های مرتبط',
  'تبدیل جمله‌های ساده به جمله‌های مرکب',
  'استفاده از ساختارهای فعلی و مصدرها در جمله‌های طولانی‌تر',
  'بیان نقل‌قول، گزارش و اطلاعات غیرمستقیم',
  'تقویت ترتیب اجزای جمله و انتخاب صحیح پسوندها',
];

const EXPECTED_B1_SURVIVAL_TITLES = [
  'تعریف خاطرات و تجربه‌های مهم زندگی',
  'شرح مشکلات و ارائه راه‌حل',
  'بیان نظر درباره مسائل اجتماعی و روزمره',
  'شرکت در بحث و دفاع از دیدگاه شخصی',
  'صحبت درباره اخبار و رویدادهای روز',
  'توصیف دقیق افراد، مکان‌ها و موقعیت‌ها',
  'شرح اهداف تحصیلی و شغلی',
  'شرکت در مصاحبه شغلی و معرفی توانایی‌ها',
  'مکالمات کاری و توضیح مسئولیت‌ها',
  'ارائه پیشنهاد و مذاکره برای رسیدن به توافق',
  'بیان شکایت و پیگیری مشکلات',
  'مدیریت اختلاف‌نظر در مکالمه',
  'برنامه‌ریزی سفر و حل مشکلات پیش‌بینی‌نشده',
  'شرح تجربه‌های پزشکی و توضیح علائم با جزئیات بیشتر',
  'توضیح قوانین، فرایندها و روش انجام کارها',
  'صحبت درباره فناوری و ابزارهای دیجیتال',
  'بیان دیدگاه درباره فیلم، کتاب و رسانه',
  'تعریف داستان و بازگویی اتفاق‌های پیچیده‌تر',
  'ارائه پیشنهاد و توصیه بر اساس تجربه',
  'توضیح علت و پیامد تصمیم‌ها',
  'مقایسه راهکارها و ارزیابی مزایا و معایب',
  'صحبت درباره فرهنگ‌ها و تفاوت‌های اجتماعی',
  'بیان احساسات و واکنش‌ها با جزئیات بیشتر',
  'شرکت در گفت‌وگوهای طولانی با موضوع مشخص',
  'خلاصه‌ کردن یک متن یا گفت‌وگو و بیان نظر دربارهٔ آن',
  'ارائه کوتاه درباره یک موضوع familiar',
  'پاسخ‌گویی به پرسش‌های پیوسته و توضیح بیشتر',
  'بیان فرضیه‌ها و سناریوهای احتمالی',
  'بازگویی گفته‌ها و اطلاعات دریافت‌شده از دیگران',
  'برقراری ارتباط مؤثر در موقعیت‌های ناآشنا',
  'مدیریت مکالمه از شروع تا پایان با استقلال بیشتر',
];

// 1. Preserve English and Russian untouched baselines
check(english.SENTENCE_LESSONS.length === 222, 'English baseline lesson count (222 incl. additive Pre-A1) holds');
check(english.SENTENCE_LESSONS.reduce((n, l) => n + l.sentences.length, 0) === 4322, 'English baseline sentence count (4322 incl. additive Pre-A1) holds');
check(russian.RUSSIAN_LESSONS.length === 129, 'Russian baseline lesson count (129) is untouched');
check(russian.RUSSIAN_LESSONS.reduce((n, l) => n + l.sentences.length, 0) === 1032, 'Russian baseline sentence count (1032) is untouched');

// 2. Alphabet, levels, and A1 + A2 syllabus structure
check(turkish.TURKISH_ALPHABET.join('') === 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ', 'Turkish 29-letter alphabet is exact');
check(turkish.TURKISH_LEVELS.length === 6, 'Turkish has the same six-level course skeleton');
check(turkish.TURKISH_LEVELS.map(level => level.id).join('|') === russian.RUSSIAN_LEVELS.map(level => level.id).join('|'), 'Turkish level ids match the Russian structure');
check(turkish.TURKISH_LEVELS.map(level => level.title).join('|') === russian.RUSSIAN_LEVELS.map(level => level.title.replace('Russian', 'Turkish')).join('|'), 'Turkish level sequence mirrors the Russian course');
check(JSON.stringify(turkish.TURKISH_LESSON_STAGES) === JSON.stringify(russian.RUSSIAN_LESSON_STAGES), 'Turkish preserves all nine sentence-based lesson stages');

const availableLevels = turkish.TURKISH_LEVELS.filter(level => level.status === 'available');
const plannedLevels = turkish.TURKISH_LEVELS.filter(level => level.status === 'planned');
check(availableLevels.map(level => level.id).join('|') === '0|1|2|3|4|5', 'Levels 0..5 (A1, A2, B1, B2, C1) are all available');
check(availableLevels.every(level => level.description.length > 20 && level.modules.length >= 30), 'Available A1, A2, B1, and B2 levels include descriptions and full syllabus modules');
check(plannedLevels.length === 0, 'No level remains planned');
check(turkish.TURKISH_LEVELS[5].modules.length === 61, 'C1 level exposes all 61 modules');
check(turkish.TURKISH_LESSONS.every(lesson => lesson.levelId <= 5), 'All lessons belong to levels 0..5');

// 3. Exact 182 A1 + A2 + B1 lessons & 1456 sentences content quality
const foundationLessons = turkish.TURKISH_LESSONS.filter(lesson => lesson.levelId === 0);
const survivalLessons = turkish.TURKISH_LESSONS.filter(lesson => lesson.levelId === 1);
const everydayA2Lessons = turkish.TURKISH_LESSONS.filter(lesson => lesson.levelId === 2);
const everydayA2Foundation = everydayA2Lessons.slice(0, 26);
const everydayA2Survival = everydayA2Lessons.slice(26);
const communicationB1Lessons = turkish.TURKISH_LESSONS.filter(lesson => lesson.levelId === 3);
const communicationB1Foundation = communicationB1Lessons.slice(0, 30);
const communicationB1Survival = communicationB1Lessons.slice(30);
const upperB2Lessons = turkish.TURKISH_LESSONS.filter(lesson => lesson.levelId === 4);
const upperB2Foundation = upperB2Lessons.slice(0, 30);
const upperB2Survival = upperB2Lessons.slice(30);
const advancedC1Lessons = turkish.TURKISH_LESSONS.filter(lesson => lesson.levelId === 5);
const advancedC1Foundation = advancedC1Lessons.slice(0, 30);
const advancedC1Survival = advancedC1Lessons.slice(30);
check(turkish.TURKISH_LESSONS.length === 304, 'Turkish A1 + A2 + B1 + B2 + C1 contains all 304 lessons');
check(foundationLessons.length === 34, 'A1 Foundation contains all 34 lessons');
check(survivalLessons.length === 30, 'A1 Survival Turkish contains all 30 lessons');
check(everydayA2Lessons.length === 57, 'A2 Everyday Turkish contains all 57 lessons (26 Foundation + 31 Survival)');
check(communicationB1Lessons.length === 61, 'B1 Communication Turkish contains all 61 lessons (30 Foundation + 31 Survival)');
check(upperB2Lessons.length === 61, 'B2 Upper-Intermediate Turkish contains all 61 lessons (30 Foundation + 31 Survival)');
check(advancedC1Lessons.length === 61, 'C1 Advanced Communication Turkish contains all 61 lessons (30 Foundation + 31 Survival)');
check(JSON.stringify(foundationLessons.map(lesson => lesson.title)) === JSON.stringify(EXPECTED_FOUNDATION_TITLES), 'A1 Foundation lesson titles match the 34 syllabus topics 1-to-1');
check(JSON.stringify(survivalLessons.map(lesson => lesson.title)) === JSON.stringify(EXPECTED_SURVIVAL_TITLES), 'A1 Survival lesson titles match the 30 syllabus topics 1-to-1');
check(JSON.stringify(everydayA2Foundation.map(lesson => lesson.title)) === JSON.stringify(EXPECTED_A2_FOUNDATION_TITLES), 'A2 Foundation lesson titles match the 26 syllabus topics 1-to-1');
check(JSON.stringify(everydayA2Survival.map(lesson => lesson.title)) === JSON.stringify(EXPECTED_A2_SURVIVAL_TITLES), 'A2 Survival lesson titles match the 31 syllabus topics 1-to-1');
check(JSON.stringify(communicationB1Foundation.map(lesson => lesson.title)) === JSON.stringify(EXPECTED_B1_FOUNDATION_TITLES), 'B1 Foundation lesson titles match the 30 syllabus topics 1-to-1');
check(JSON.stringify(communicationB1Survival.map(lesson => lesson.title)) === JSON.stringify(EXPECTED_B1_SURVIVAL_TITLES), 'B1 Survival lesson titles match the 31 syllabus topics 1-to-1');
check(everydayA2Foundation.every(lesson => lesson.subtitle.startsWith('Foundation · ')), 'All 26 A2 Foundation lessons carry the Foundation track subtitle');
check(everydayA2Survival.every(lesson => lesson.subtitle.startsWith('Survival · ')), 'All 31 A2 Survival lessons carry the Survival track subtitle');
check(communicationB1Foundation.every(lesson => lesson.subtitle.startsWith('Foundation · ')), 'All 30 B1 Foundation lessons carry the Foundation track subtitle');
check(communicationB1Survival.every(lesson => lesson.subtitle.startsWith('Survival · ')), 'All 31 B1 Survival lessons carry the Survival track subtitle');
check(upperB2Foundation.every(lesson => lesson.subtitle.startsWith('Foundation · ')), 'All 30 B2 Foundation lessons carry the Foundation track subtitle');
check(upperB2Survival.every(lesson => lesson.subtitle.startsWith('Survival · ')), 'All 31 B2 Survival lessons carry the Survival track subtitle');
check(advancedC1Foundation.every(lesson => lesson.subtitle.startsWith('Foundation · ')), 'All 30 C1 Foundation lessons carry the Foundation track subtitle');
check(advancedC1Survival.every(lesson => lesson.subtitle.startsWith('Survival · ')), 'All 31 C1 Survival lessons carry the Survival track subtitle');
check(turkish.TURKISH_LESSONS.every((lesson, index) => lesson.order === index + 1), 'Lesson order numbers run sequentially 1..304');

const lessonIds = new Set(turkish.TURKISH_LESSONS.map(lesson => lesson.id));
check(lessonIds.size === 304, 'All 304 Turkish lesson IDs are unique');
const allSentences = turkish.TURKISH_LESSONS.flatMap(lesson => lesson.sentences);
check(allSentences.length === 2432, 'Turkish A1..C1 contains 2432 core sentences (8 per lesson)');
check(new Set(allSentences.map(sentence => sentence.id)).size === 2432, 'All 2432 Turkish sentence IDs are unique');
check(new Set(allSentences.map(sentence => sentence.text)).size === 2432, 'All 2432 Turkish sentence texts are unique');

for (const lesson of turkish.TURKISH_LESSONS) {
  assert.equal(lesson.sentences.length, 8, `${lesson.id} has 8 sentences`);
  assert.ok(lesson.subtitle && lesson.subtitle.length >= 10, `${lesson.id} has Persian subtitle`);
  assert.ok(lesson.situation && lesson.situation.length >= 15, `${lesson.id} has Persian situation`);
  assert.ok(lesson.teachingFa && lesson.teachingFa.length >= 40, `${lesson.id} has Persian teaching note`);
  assert.ok(lesson.sentences.some(sentence => Boolean(sentence.pattern)), `${lesson.id} includes grammar-through-usage pattern notes`);
  assert.ok(lesson.dialogue.length >= 3, `${lesson.id} includes a multi-turn guided dialogue`);
  assert.ok(lesson.dialogue.every(turn => turn.speaker && turn.text && turn.fa && !/[А-Яа-яЁё]/.test(turn.text)), `${lesson.id} dialogue turns are valid Turkish + Persian`);
  assert.ok((lesson.checks?.length ?? 0) >= 2, `${lesson.id} includes at least 2 self-check questions`);
  for (const question of lesson.checks ?? []) {
    assert.equal(question.choices.length, 3, `${lesson.id} check has 3 choices`);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 3, `${lesson.id} check has valid correctIndex`);
    assert.ok(question.explanationFa && question.explanationFa.length >= 10, `${lesson.id} check has Persian explanation`);
  }
  for (const sentence of lesson.sentences) {
    assert.ok(sentence.text.trim().split(/\s+/).length >= 2, `${sentence.id} has >= 2 words for sentence builder`);
    assert.ok(!/[А-Яа-яЁё]/.test(sentence.text), `${sentence.id} contains no Cyrillic characters`);
    assert.ok(sentence.fa && /[آ-ی]/.test(sentence.fa), `${sentence.id} has Persian translation`);
    assert.ok(sentence.pronunciation && !/[0-9A-Za-zÇçĞğİıÖöŞşÜüА-Яа-яЁё]/.test(sentence.pronunciation), `${sentence.id} pronunciation uses pure Persian script`);
    assert.ok(sentence.vocabulary.length >= 1, `${sentence.id} has linked vocabulary`);
    const loweredSentence = sentence.text.toLocaleLowerCase('tr-TR');
    for (const item of sentence.vocabulary) {
      assert.ok(loweredSentence.includes(item.word.toLocaleLowerCase('tr-TR')), `${sentence.id} vocabulary "${item.word}" appears in "${sentence.text}"`);
      assert.ok(item.meaning && item.meaning.length >= 1, `${sentence.id} vocabulary has Persian meaning`);
    }
  }
}
checks += 10;

// 4. Lookup, progress store, spaced review, and session persistence
check(turkish.findTurkishLesson('missing') === undefined, 'Missing Turkish lookup returns undefined');
check(turkish.findTurkishLesson('tr-l1-alphabet-pronunciation')?.order === 1, 'First A1 Foundation lesson resolves by ID');
check(turkish.findTurkishLesson('tr-l2-connected-conversation')?.order === 64, 'Final A1 Survival lesson resolves by ID');
check(turkish.findTurkishLesson('tr-a2-f-01-present-vs-aorist')?.order === 65, 'First A2 Foundation lesson resolves at order 65');
check(turkish.findTurkishLesson('tr-a2-s-01-past-experiences-events')?.order === 91, 'First A2 Survival lesson resolves at order 91');
check(turkish.findTurkishLesson('tr-a2-s-31-managing-conversation-start-to-finish')?.order === 121, 'Final A2 Survival lesson resolves at order 121');
check(turkish.findTurkishLesson('tr-b1-f-01-narrating-past-events-definite')?.order === 122, 'First B1 Foundation lesson resolves at order 122');
check(turkish.findTurkishLesson('tr-b1-s-31-managing-conversation-independently')?.order === 182, 'Final B1 Survival lesson resolves at order 182');
check(turkish.findTurkishLesson('tr-b2-f-01-analytical-complex-narration')?.order === 183, 'First B2 Foundation lesson resolves at order 183');
check(turkish.findTurkishLesson('tr-b2-s-31-emergencies-asking-help')?.order === 243, 'Final B2 Survival lesson resolves at order 243');
check(turkish.findTurkishLesson('tr-c1-f-01-precise-abstract-concepts')?.order === 244, 'First C1 Foundation lesson resolves at order 244');
check(turkish.findTurkishLesson('tr-c1-s-31-managing-complex-communication')?.order === 304, 'Final C1 Survival lesson resolves at order 304');

const initial = await turkish.turkishProgress.getCourseProgress();
check(initial.currentLessonId === 'tr-l1-alphabet-pronunciation' && initial.completedLessonIds.length === 0 && initial.reviewCards.length === 0, 'Fresh Turkish progress starts at Lesson 1 with 0 completed lessons');
await turkish.turkishProgress.completeSentenceLesson('tr-l1-alphabet-pronunciation', 'tr-l1-greetings');
const afterFirst = await turkish.turkishProgress.getCourseProgress();
check(afterFirst.completedLessonIds.includes('tr-l1-alphabet-pronunciation') && afterFirst.currentLessonId === 'tr-l1-greetings', 'Completing Lesson 1 advances currentLessonId to Lesson 2');
check(afterFirst.reviewCards.length === 8, 'Completing an 8-sentence Turkish lesson schedules 8 local review cards');
const dueCards = await turkish.turkishProgress.getDueReviewCards();
check(dueCards.length === 8, 'Newly created Turkish review cards are due immediately');
await turkish.turkishProgress.rateReviewCard(dueCards[0].id, 'good');
check((await turkish.turkishProgress.getDueReviewCards()).length === 7, 'Rating a Turkish review card updates its next review interval');
await assert.rejects(turkish.turkishProgress.completeSentenceLesson('missing')); checks += 1;
const exported = await turkish.turkishProgress.exportProgress();
const restored = await turkish.turkishProgress.restoreProgress(exported);
check(restored.completedLessonIds.includes('tr-l1-alphabet-pronunciation') && restored.reviewCards.length === 8, 'Turkish progress export and restore preserve completed lessons and review cards');

// Session persistence
const freshLoad = await studyState.loadTurkishLessonSessionWithPresence('tr-l1-greetings');
check(!freshLoad.hasSavedSession && freshLoad.session.stage === 0 && freshLoad.session.sentenceIndex === 0, 'Unsaved Turkish lesson starts with fresh session');
await studyState.saveTurkishLessonSession('tr-l1-greetings', { stage: 4, sentenceIndex: 3, revealed: true, answers: { '0': 1 }, showCheckAnswers: false });
const savedLoad = await studyState.loadTurkishLessonSessionWithPresence('tr-l1-greetings');
check(savedLoad.hasSavedSession && savedLoad.session.stage === 4 && savedLoad.session.sentenceIndex === 3 && savedLoad.session.answers['0'] === 1, 'Saved Turkish lesson session restores stage, sentenceIndex, and check answers');
await assert.rejects(studyState.saveTurkishLessonSession('tr-l1-greetings', { stage: 99, sentenceIndex: 0, revealed: false, answers: {}, showCheckAnswers: false })); checks += 1;
await studyState.clearTurkishLessonSession('tr-l1-greetings');
check(!(await studyState.loadTurkishLessonSessionWithPresence('tr-l1-greetings')).hasSavedSession, 'Cleared Turkish lesson session removes saved state');
check(globalThis.__turkishSupabaseCalls === 0, 'Turkish progress and session storage never call Supabase');

// 5. Pronunciation workshop, catalog, routing, and resume
check(pronunciation.isPronunciationLanguage('tr'), 'Turkish pronunciation route is recognized');
check(pronunciation.PRONUNCIATION_COURSES.tr.length === 4, 'Turkish pronunciation workshop has 4 Istanbul Turkish units');
const trCatalog = catalog.findLanguage('tr');
check(trCatalog?.status === 'starter' && trCatalog?.lessonsCount === 304 && trCatalog?.speechLocale === 'tr-TR', 'Language catalog exposes Turkish course with 304 A1..C1 lessons and tr-TR speech');

const now = Date.UTC(2026, 10, 1);
check(resume.languageForResume('/learn/tr/library', 'en') === 'tr', 'Native resume tracking recognizes Turkish routes');
check(resume.resumeHref('/learn/tr/lesson', { id: 'tr-l1-greetings' }) === '/learn/tr/lesson?id=tr-l1-greetings', 'Turkish lesson route can be restored safely');
check(resume.resumeDestination({ version: 1, href: '/learn/tr/library?level=1', language: 'tr', backgroundAt: now - 25 * 60 * 60 * 1000, updatedAt: now }, now) === '/learn/tr', 'Expired Turkish resume returns to Turkish home');

const read = file => readFileSync(path.join(root, file), 'utf8');
check(/tr: '🇹🇷'/.test(read('app/languages.tsx')), 'Language chooser includes the Turkish flag');
for (const [file, component] of [
  ['app/learn/[language]/index.tsx', 'TurkishHome'],
  ['app/learn/[language]/library.tsx', 'TurkishLibrary'],
  ['app/learn/[language]/lesson.tsx', 'TurkishLesson'],
  ['app/learn/[language]/review.tsx', 'TurkishReview'],
  ['components/TurkishLesson.tsx', 'TurkishSentenceBuilder'],
  ['components/TurkishLesson.tsx', 'TurkishDialoguePractice'],
  ['lib/turkishSpeech.ts', "speechTagFor('tr-TR')"],
]) check(read(file).includes(component), `${file} connects ${component}`);
check(!/courseContent|RUSSIAN_LESSONS|SENTENCE_LESSONS/.test(read('lib/languages/turkish.ts')), 'Turkish curriculum does not reuse English or Russian educational content');

console.log(`${checks} Turkish A1..C1 curriculum, orthography, progress, session resume, pronunciation, routing, and isolation checks passed.`);
