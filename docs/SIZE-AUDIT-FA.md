# گزارش تحلیل حجم و فایل‌های بدون استفاده — App3

**تاریخ:** ۶ نوامبر ۲۰۲۶
**روش:** تحلیل گراف وابستگی (import graph) از نقاط ورود واقعی اپ، مقایسهٔ هش فایل‌ها، بررسی مراجع هر دارایی (asset)، بررسی ابعاد تصاویر، و تطبیق وابستگی‌های `package.json` با کد.

---

## ۱. جمع‌بندی یک‌خطی

حجم مخزن **۲۶ مگابایت** است که ۷.۸ مگابایت آن `.git` و **۱۶.۹ مگابایت** آن فایل‌های کاری است.
از این ۱۶.۹ مگابایت، **۸.۲۵ مگابایت (حدود ۴۹٪)** بدون هیچ آسیبی به اپ قابل حذف است — و از آن ۸.۲۵ مگابایت، **۶.۹ مگابایت فقط یک تصویر تکراری است که هیچ‌جای کد به آن ارجاع نمی‌دهد.**

نکتهٔ مهم: **تعداد فایل‌ها مشکل نیست.** فقط ۳۷۳ فایل وجود دارد. حجم در چند نقطهٔ مشخص متمرکز شده، نه در «فایل‌های زیاد».

---

## ۲. توزیع حجم (واقعیت سنجیده‌شده، نه حدس)

| مسیر | حجم | سهم | وضعیت |
|---|---:|---:|---|
| `lib/` | 4.7 MB | 28% | محتوای درسی واقعی — لازم |
| `assets/` | 6.1 MB | 36% | بخش بزرگش مرده |
| `public/` | 3.5 MB | 21% | **۱۰۰٪ مرده** |
| `transfer/` | 860 KB | 5% | **۱۰۰٪ مرده** |
| `components/` | 608 KB | 4% | تکرار زیاد |
| `app/` | 488 KB | 3% | سالم |
| `scripts/` | 444 KB | 3% | نیمه‌مرده |
| `docs/` | 380 KB | 2% | گزارش‌های یک‌بارمصرف |
| `supabase/` | 352 KB | 2% | لازم |

---

## ۳. دلایل اصلی حجم زیاد — به ترتیب اهمیت

### 🔴 دلیل ۱ — یک تصویر تکراری ۶.۹ مگابایتی که هیچ‌جا استفاده نمی‌شود

این بزرگ‌ترین عامل است و ۴۱٪ کل حجم مخزن را می‌سازد:

```
assets/language-hero-background.jpg         3,612,475 بایت
public/assets/language-hero-background.jpg  3,612,475 بایت   ← کپی بایت‌به‌بایت (MD5 یکسان)
```

یافته‌های دقیق:

- جست‌وجوی کامل در کل مخزن (به‌جز `.git` و `package-lock.json`): **صفر ارجاع**. نه در کد، نه در `app.json`، نه در استایل‌ها، نه در HTML.
- پسوندش `.jpg` است اما **واقعاً PNG است** (امضای فایل: `89 50 4E 47`). یعنی با فرمت اشتباه ذخیره شده — همان دلیلی که ۳.۵ مگابایت شده.
- ابعاد: **۲۵۶۰ × ۱۴۴۰** پیکسل.
- حاوی بلوک متادیتای **C2PA / JUMBF** (امضای محتوای تولیدشده با هوش مصنوعی) — یعنی یک خروجی خام از یک ابزار تولید تصویر است که بدون بهینه‌سازی داخل مخزن رها شده.

حتی اگر این تصویر لازم بود، به‌صورت JPEG واقعی با عرض ۱۶۰۰ پیکسل حدود **۲۵۰ کیلوبایت** می‌شد. یعنی حذف/جایگزینی این مورد **۶.۷ مگابایت** صرفه‌جویی است.

### 🔴 دلیل ۲ — پوشهٔ `transfer/` (۸۶۰ کیلوبایت) خروجی یک‌بارمصرف است

```
transfer/curriculum.json            621,889 بایت
transfer/educational-content.zip    246,742 بایت
transfer/TRANSFER-FA.md
```

این پوشه یک «بستهٔ تحویل به پروژهٔ دیگر» است. محتوای ZIP بررسی شد: شامل **کپی فایل‌های همین مخزن** (`source/lib/courseContent*.ts`) به‌همراه یک `curriculum.json` مشتق‌شده است.

- فایل‌ها **کهنه** هستند: تاریخ ۷ اکتبر ۲۰۲۶، در حالی که نسخهٔ فعلی `courseContent.ts` از ۲۰٬۶۲۳ بایت به ۴۳٬۲۶۵ بایت رسیده. یعنی این بسته دیگر با کد فعلی هم‌خوان نیست.
- هیچ کدی در اپ به آن ارجاع نمی‌دهد. کد برنامه هرگز این پوشه را import نمی‌کند.

### 🟠 دلیل ۳ — هر سه زبان در هر سه نسخهٔ اپ بسته‌بندی می‌شوند (۲.۲ مگابایت اضافه در باندل)

این مورد در حجم مخزن دیده نمی‌شود، اما **حجم APK و باندل وب** را مستقیم بالا می‌برد و مهم‌ترین مشکل مهندسی اینجاست.

`lib/features.ts` یک `LANGUAGE_SCOPE` تعریف می‌کند و اسکریپت‌های ساخت این‌طور تنظیم شده‌اند:

- `build:web:learner` → `en,ru`
- `build:web:admin` → `en,tr`

اما `lib/languages/catalog.ts` به‌صورت **import استاتیک** هر سه زبان را می‌کشد:

```ts
import { RUSSIAN_LESSONS, russianProgress } from './russian';
import { TURKISH_LESSONS, turkishProgress } from './turkish';
```

و `app/languages.tsx` که همیشه بارگذاری می‌شود، `LANGUAGES` را از همین فایل می‌گیرد. نتیجه:

| زبان | حجم سورس |
|---|---:|
| انگلیسی (`courseContent*` + `english*`) | 2.3 MB |
| ترکی (`lib/languages/turkish*` — ۲۲ فایل) | 1.6 MB |
| روسی (`lib/languages/russian*`) | 604 KB |

یعنی نسخهٔ **learner با اسکوپ `en,ru`** هنوز ۱.۶ مگابایت محتوای ترکی را داخل باندل دارد، و نسخهٔ **admin با اسکوپ `en,tr`** ۶۰۴ کیلوبایت روسی را. فیلتر `LANGUAGE_SCOPE` فقط در لایهٔ UI عمل می‌کند؛ Metro درخت را هرس نمی‌کند.

### 🟠 دلیل ۴ — کلون‌شدن کامپوننت‌های روسی و ترکی (حدود ۲۰۰ کیلوبایت کد تکراری)

مقایسهٔ خط‌به‌خط پس از یکسان‌سازی نام زبان‌ها:

| فایل روسی | فایل ترکی | حجم هرکدام | خطوط متفاوت |
|---|---|---:|---:|
| `RussianDialoguePractice.tsx` | `TurkishDialoguePractice.tsx` | 7,506 B | **۲** |
| `RussianSentenceBuilder.tsx` | `TurkishSentenceBuilder.tsx` | ~6,500 B | **۲** |
| `RussianBottomNav.tsx` | `TurkishBottomNav.tsx` | 2,452 B | ۱۰ |
| `RussianReview.tsx` | `TurkishReview.tsx` | ~18,700 B | ۴۴ از ۲۰۱ |
| `RussianLibrary.tsx` | `TurkishLibrary.tsx` | ~36,000 B | ۹۹ از ۳۳۶ |
| `RussianLesson.tsx` | `TurkishLesson.tsx` | ~45,000 B | ۱۰۸ از ۴۳۹ |
| `RussianHome.tsx` | `TurkishHome.tsx` | ~24,000 B | ۱۱۸ از ۴۲۸ |

مجموع `components/Russian*.tsx` = ۱۴۴ KB و `components/Turkish*.tsx` = ۱۵۲ KB. دو فایل اول **عملاً فایل یکسان با نام متفاوت** هستند. با یک کامپوننت پارامتری‌شده، حدود **۲۰۰ کیلوبایت** کد و — مهم‌تر — دو برابر شدن هزینهٔ نگهداری حذف می‌شود.

### 🟠 دلیل ۵ — ۸ وابستگی نصب‌شده که هیچ‌جا استفاده نمی‌شوند (مستقیماً روی حجم APK)

جست‌وجوی کامل در کد، `app.json`، `app.config.js`، `eas.json`، `scripts/`، `.github/` و `supabase/`: **صفر ارجاع**.

| پکیج | تأثیر |
|---|---|
| `react-native-webview` | **کد نیتیو سنگین — بزرگ‌ترین اثر روی APK** |
| `expo-blur` | ماژول نیتیو |
| `expo-haptics` | ماژول نیتیو |
| `expo-symbols` | ماژول نیتیو iOS |
| `@lucide/lab` | پکیج آیکون دوم، پروژه از `lucide-react-native` استفاده می‌کند |
| `iransans` | فونت استفاده‌نشده (فونت‌ها از `@expo-google-fonts/vazirmatn` می‌آیند) |
| `react-native-url-polyfill` | بدون استفاده |

> **تصحیح (پس از اندازه‌گیری واقعی باندل):** ادعای اولیهٔ من دربارهٔ `@expo/vector-icons` نادرست بود. این پکیج یک وابستگی **اجباری خودِ `expo`** است (`expo/package.json` → `"@expo/vector-icons": "^15.0.2"`)، پس از `package.json` ما حذف‌شدنی نیست. مهم‌تر اینکه چون هیچ کدی آن را import نمی‌کند، فونت‌هایش هم بسته‌بندی نمی‌شوند. ارجاع `expo-router` به آن فقط داخل یک **کامنت JSDoc** است. پس حذفش هیچ سودی برای APK نداشت.

نکتهٔ متناقض: فایل `mocks/react-native-reanimated.js` در توضیحاتش می‌گوید «reanimated حذف شد تا حجم کد نیتیو کم شود»، اما `package.json` هنوز `react-native-reanimated@3.19.1` را دارد و `babel.config.js` هنوز پلاگین آن را بارگذاری می‌کند. هیچ کدی reanimated را import نمی‌کند. این یک **تناقض پیکربندی کهنه** است و باید بررسی شود.

> توجه: `@electric-sql/pglite` و `esbuild` واقعاً در `scripts/` استفاده می‌شوند — این‌ها را حذف نکنید.

### 🟡 دلیل ۶ — تصاویر استفاده‌نشده

| فایل | حجم | وضعیت |
|---|---:|---|
| `assets/images/splash-learning.png` | 419,770 B | مرده — فقط `splash-learning-light.png` استفاده می‌شود |
| `assets/images/hero-background.jpg` | 53,303 B | صفر ارجاع |

### 🟡 دلیل ۷ — کد مردهٔ واقعی (۳۳ کیلوبایت)

پس از وارد کردن importهای داینامیک (`import()` و `lazy()`) در گراف، تنها زنجیرهٔ کاملاً قطع‌شدهٔ اپ این است:

```
lib/languages/russianLearningEvidence.ts   (8,935 B)   ← هیچ‌کس import نمی‌کند
   └── lib/languages/russianLearningEngine.ts   (9,386 B)   ← فقط از فایل بالا
        └── lib/languages/russianCurriculum.ts  (13,573 B)  ← فقط از دو فایل بالا
```

یک زیرسیستم کامل «موتور یادگیری روسی» که از هیچ مسیر برنامه‌ای قابل دسترسی نیست.

### 🟡 دلیل ۸ — ۳۰ سند گزارش یک‌بارمصرف + اسکریپت‌های یتیم

- `docs/` شامل **۳۰ فایل مارک‌داون** با ۲٬۱۶۲ خط (۳۸۰ KB) است که بیشترشان گزارش‌های پایان‌کار هستند (`...-REPORT-FA.md`، `...-AUDIT-FA.md`). این‌ها **بخشی از اپ نیستند** و در باندل نمی‌روند، اما حجم مخزن و شلوغی را زیاد می‌کنند.
- از ۳۷ اسکریپت، **۶ مورد** هیچ ارجاعی در `package.json` یا workflowها ندارند:
  `check-russian-sentences.cjs`، `verify-app-resume.cjs`، `verify-english-four-browser.cjs`، `verify-english-supplement-browser.cjs`، `verify-russian-speech-flow.cjs`، و `scripts/data/english-dialogue-repairs.tsv` (۱۷.۷ KB دادهٔ یک‌بارمصرف).
- `mocks/react-native-reanimated.js` — مرده، چون پروژه **هیچ `metro.config.js` ندارد** که این مسیر را alias کند.
- `public/manus-routes.json` — فقط در `TODO.md` به آن اشاره شده است.

### 🟡 دلیل ۹ — تصاویر بدون بهینه‌سازی (چگالی غیرعادی)

| فایل | ابعاد | حجم | چگالی | بهینه‌سازی معقول |
|---|---|---:|---:|---|
| `icon.png` | 1024×1024 | 383 KB | 366 KB/MP | ≈ 120 KB |
| `splash-learning-light.png` | 640×640 | 357 KB | **872 KB/MP** | ≈ 60 KB |
| `language-ru-watercolor.jpg` | 800×1000 | 242 KB | 303 KB/MP | ≈ 90 KB |
| `language-tr-watercolor.jpg` | 800×1000 | 230 KB | 287 KB/MP | ≈ 90 KB |
| `language-en-watercolor.jpg` | 800×1000 | 228 KB | 284 KB/MP | ≈ 90 KB |
| `language-hero-journal.jpg` | 1600×1067 | 340 KB | 199 KB/MP | ≈ 200 KB |

چگالی ۸۷۲ کیلوبایت بر مگاپیکسل برای یک PNG 640×640 نشانهٔ PNG کاملاً غیربهینه است. بهینه‌سازی این‌ها **حدود ۱.۱ مگابایت** صرفه‌جویی می‌دهد **بدون هیچ افت کیفیت محسوس**.

### 🔴 دلیل ۱۰ (کشف‌شده در اندازه‌گیری واقعی) — ۵.۵ مگابایت فونت مرده داخل باندل

این مورد فقط با ساختن واقعی باندل پیدا شد، نه با خواندن کد.

`app/_layout.tsx` فقط **۷ فونت** لازم دارد، اما باندل ساخته‌شده **۲۷ فایل فونت = ۷.۰۲ مگابایت** داشت.

علت: فایل `index.js` در پکیج‌های `@expo-google-fonts/*` **همهٔ وزن‌ها را با `require()`** صدا می‌زند:

```js
export const Inter_100Thin = require('./100Thin/Inter_100Thin.ttf');
export const Inter_200ExtraLight = require('./200ExtraLight/Inter_200ExtraLight.ttf');
// ... ۱۸ مورد برای Inter و ۹ مورد برای Vazirmatn
```

Metro فراخوانی `require` را حذف نمی‌کند، پس هر ۲۷ فونت داخل باندل می‌رفتند.

**راه‌حل:** import از مسیر تکی هر وزن:

```ts
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
```

**نتیجهٔ اندازه‌گیری‌شده:** ۲۷ فایل / ۷.۰۲ مگابایت → ۷ فایل / ۱.۴۷ مگابایت. صرفه‌جویی **۵.۵۵ مگابایت**.



برای اینکه تحلیل منصفانه باشد:

- **۴۶ فایل `lib/courseContent*.ts`** (۱.۹ MB) اضافی نیستند. بررسی کردم: از ۶۰۸ جملهٔ انگلیسی یکتا، فقط **۱ جمله** در دو فایل تکرار شده. این‌ها محتوای واقعی و بی‌هم‌پوشانِ درس هستند؛ حجمشان از ترجمهٔ فارسی + تلفظ نوشتاری + واژگان + گفتگو می‌آید.
- **`migrations/` و `functions/` در `supabase/`** — بک‌اند واقعی اپ.
- **`docs/licenses/CMUdict.txt`** — تعهد حقوقی مجوز. **حذف نکنید.**
- **`assets/data/essential504.json`** — واقعاً از `lib/educationAdmin.ts` و اسکریپت‌های اعتبارسنجی خوانده می‌شود.
- **`@electric-sql/pglite`، `esbuild`، `typescript`، `@babel/core`** — استفادهٔ واقعی در ابزارها.
- **مسیرهای `app/learn/ru/*`** (۱.۶ KB) کپی نازک از مسیر داینامیک `app/learn/[language]/*` هستند. حجمشان ناچیز است، اما **سطح نگهداری را دو برابر می‌کنند** و ارزش ادغام دارند.

---

## ۴. وضعیت آزمون‌های پروژه (یافتهٔ مهم)

قبل از هر تغییری، ۵ آزمون از ۲۳ آزمون پروژه **از قبل قرمز بودند**. با کنار گذاشتن تغییرات و اجرای مجدد روی کد دست‌نخورده، تأیید شد که این‌ها ربطی به پاک‌سازی ندارند:

| آزمون | علت |
|---|---|
| `validate:english-four` | `git: invalid object name 'a57bf26'` — تاریخچه به یک کامیت squash شده و آزمون به یک کامیت قدیمی ارجاع می‌دهد |
| `validate:turkish-structure` | انتظار «پرچم ترکی» در صفحهٔ انتخاب زبان را دارد |
| `validate:speech-policy` | انتظار ترتیب قدیمی «قفل قبل از اجازهٔ میکروفن» را دارد |
| `validate:typography` | ناسازگاری با وضعیت فعلی استایل‌ها |
| `validate:english-lesson-flow` | انتظار ترتیب قدیمی ذخیرهٔ پیشرفت را دارد |

یعنی مجموعهٔ آزمون این پروژه ۷۸٪ سبز است و کسی متوجه ۵ مورد قرمز نشده — چون هیچ workflow‌ای همهٔ آن‌ها را با هم اجرا نمی‌کند.

---

## ۵. برنامهٔ پیشنهادی، به ترتیب اولویت

### مرحلهٔ ۱ — برداشت سریع (۹۹٪ سود، صفر ریسک) — حدود ۷.۹ مگابایت

```bash
# ۱) تصویر تکراری و مرده (۶.۹ MB)
git rm assets/language-hero-background.jpg public/assets/language-hero-background.jpg

# ۲) بستهٔ تحویل کهنه (۸۶۰ KB)
git rm -r transfer/

# ۳) تصاویر استفاده‌نشده (۴۷۳ KB)
git rm assets/images/splash-learning.png assets/images/hero-background.jpg

# ۴) کد مردهٔ موتور یادگیری روسی (۳۲ KB)
git rm lib/languages/russianLearningEvidence.ts \
       lib/languages/russianLearningEngine.ts \
       lib/languages/russianCurriculum.ts

# ۵) فایل‌های مردهٔ کوچک
git rm mocks/react-native-reanimated.js \
       public/manus-routes.json \
       scripts/data/english-dialogue-repairs.tsv \
       scripts/check-russian-sentences.cjs \
       scripts/verify-app-resume.cjs \
       scripts/verify-english-four-browser.cjs \
       scripts/verify-english-supplement-browser.cjs \
       scripts/verify-russian-speech-flow.cjs
```

### مرحلهٔ ۲ — کاهش حجم APK (اثر مستقیم روی خروجی) — چند مگابایت کد نیتیو

```bash
npm uninstall react-native-webview expo-blur expo-haptics expo-symbols \
              @expo/vector-icons @lucide/lab iransans react-native-url-polyfill
```

سپس بررسی کنید آیا `react-native-reanimated` واقعاً لازم است یا نه (کد هیچ importی ندارد، ولی mock ادعا می‌کند حذف شده — یکی از این دو نادرست است).

### مرحلهٔ ۳ — هرس باندل بر اساس اسکوپ زبان (۲.۲ مگابایت در باندل)

`catalog.ts` را به importهای شرطی/داینامیک تبدیل کنید تا نسخهٔ `en,ru` محتوای ترکی را حمل نکند و برعکس. مثلاً:

```ts
const loaders = {
  en: () => import('./courseContentIndex'),
  ru: () => import('./russian'),
  tr: () => import('./turkish'),
};
```

نیاز به تغییر در `app/languages.tsx` و `app/learn/[language]/*` دارد (چون `lessonsCount` هم از همین‌جا می‌آید).

### مرحلهٔ ۴ — حذف تکرار کد

`RussianDialoguePractice` ↔ `TurkishDialoguePractice` و `RussianSentenceBuilder` ↔ `TurkishSentenceBuilder` با فقط **۲ خط تفاوت** عملاً فایل یکسان هستند. آن‌ها را به یک کامپوننت با پارامتر زبان تبدیل کنید. همین کار برای `Home` / `Lesson` / `Library` / `Review` حدود **۲۰۰ کیلوبایت** صرفه‌جویی و نصف‌شدن سطح تست دارد.

### مرحلهٔ ۵ — بهینه‌سازی تصاویر (۱.۱ مگابایت، بدون افت کیفیت)

```bash
# PNGها
pngquant --quality=70-90 --strip assets/images/icon.png assets/images/splash-learning-light.png
# JPEGها
jpegoptim --strip-all --max=82 assets/images/language-*.jpg
```

---

## ۶. جمع‌بندی عددی

| اقدام | صرفه‌جویی |
|---|---:|
| تصویر تکراری مرده (`language-hero-background`) | 6.90 MB |
| `transfer/` | 0.84 MB |
| تصاویر استفاده‌نشده | 0.45 MB |
| اسکریپت‌ها/فایل‌های یتیم + کد مرده | 0.06 MB |
| **جمع بدون ریسک** | **۸.۲۵ MB ≈ ۴۹٪ مخزن** |
| بهینه‌سازی تصاویر (اختیاری) | ۱.۱ MB |
| کاهش باندل با هرس اسکوپ زبان | ۲.۲ MB در باندل |
| حذف وابستگی‌های بلااستفاده | چند MB در APK |

**نتیجه:** حجم زیاد این اپ تقریباً هیچ ربطی به «فایل‌های زیاد» ندارد. یک تصویر PNG ۲۵۶۰×۱۴۴۰ که با پسوند غلط ذخیره و دو بار کامیت شده، به‌تنهایی ۴۱٪ مخزن را می‌سازد. بعد از آن، دو عامل ساختاری مهم‌ترند: بسته‌بندی هر سه زبان در همهٔ نسخه‌ها، و کلون‌شدن کامل جفت‌کامپوننت‌های روسی/ترکی.
