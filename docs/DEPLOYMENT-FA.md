# راهنمای استقرار و انتشار اپ

این راهنما با workflowها و تنظیمات فعلی مخزن نوشته شده است. مقصد وب GitHub Pages است؛ ساخت APK نیز از GitHub Actions یا EAS انجام می‌شود. این مراحل به‌خودی‌خود چیزی را منتشر نمی‌کنند؛ هر انتشار واقعی باید از حساب و مخزن صاحب پروژه انجام شود.

## پیش‌نیازهای مشترک

1. تغییرات را در شاخهٔ کاری بررسی و به شاخهٔ `main` ادغام کنید. قبل از انتشار، دستورهای کنترل کیفیت بخش «بررسی محلی» را اجرا کنید.
2. اتصال عمومی Supabase در `config/supabase.public.json` تعریف شده و workflow وب آن را در زمان ساخت می‌خواند. این URL و anon/publishable key برای کلاینت عمومی هستند؛ کلید `service_role`، رمزها و secrets را هرگز در این فایل، کد اپ، Git یا artifact قرار ندهید.
3. اگر از تنظیم جایگزین در GitHub Actions استفاده می‌کنید، فقط از secrets/variables امن GitHub استفاده کنید و نام متغیرهای `EXPO_PUBLIC_SUPABASE_URL` و `EXPO_PUBLIC_SUPABASE_ANON_KEY` را به‌کار ببرید. مقدارهای `EXPO_PUBLIC_*` داخل bundle کلاینت قرار می‌گیرند و محرمانه محسوب نمی‌شوند.

## بررسی محلی پیش از انتشار

از ریشهٔ مخزن:

```bash
npm ci
npm run typecheck
npm run validate:web-shell
npm run validate:content
npm run validate:logic
npm run validate:russian
npm run validate:russian-architecture
npm run validate:personal-sync
npm run validate:backup
npm run build:web
```

`build:web` خروجی ایستا را در `dist/` می‌سازد و پیش از آن اتصال عمومی Supabase را بررسی می‌کند. `validate:web-shell` قرارداد RTL فارسی، مدیریت متن‌های mixed-script، `viewport-fit=cover` و safe-area بالای/پایین layout را نگه می‌دارد. برای انتشار واقعی، فقط پس از عبور بررسی‌ها ادامه دهید؛ اگر آزمون دیگری شکست خورد، ابتدا خطا را بررسی و رفع کنید.

## انتشار وب در GitHub Pages

مخزن در `.github/workflows/deploy.yml` تنظیم شده است تا با push به `main` یا اجرای دستی workflow، سایت را بسازد و منتشر کند.

1. در GitHub به **Settings → Pages → Build and deployment** بروید و **Source** را روی **GitHub Actions** بگذارید.
2. در **Settings → Actions → General → Workflow permissions** اجازهٔ اجرای workflowها را بررسی کنید. workflow برای انتشار Pages به `pages: write` و `id-token: write` نیاز دارد؛ مجوزهای تعریف‌شده در فایل را محدودتر/بیشتر از نیاز نکنید.
3. پس از ادغام تغییر در `main`، **Actions → Deploy web to GitHub Pages** را باز کنید. باید مراحل نصب، `typecheck`، `validate:web-shell`، export و deploy همگی سبز شوند.
4. URL منتشرشده را از لینک **github-pages** در workflow یا از **Settings → Pages** بردارید. مسیر پایهٔ Expo در `app.json` برابر `/App3` است؛ پسوند مسیر را در تنظیمات عوض نکنید مگر آنکه مقصد میزبانی و base path نیز تغییر کند.
5. در مرورگر گوشی، مسیر `/App3/` را باز کنید. نمایش فارسی را از نظر RTL، اسکرول، ناچ/دوربین و safe area بالا و پایین، و ورود/اتصال Supabase را بررسی کنید.

برای انتشار rollback، یک commit سالم قبلی را با روش معمول Git به `main` برگردانید؛ push بعدی همان workflow را اجرا می‌کند. artifact `dist/` خروجی قابل بازسازی است و شامل داده‌های سرور یا secrets نیست.

## انتشار Android APK از GitHub Actions

فایل `.github/workflows/android-build.yml` برای ساخت learner APK و در اجرای کامل، management و learner-login APK نیز تنظیم شده است. ساخت شامل prebuild اندروید و build مستقل Release APK است.

1. در GitHub به **Actions → Build MiloMultilang Android APK → Run workflow** بروید و شاخهٔ تغییرات بررسی‌شده را انتخاب کنید. `workflow_dispatch` مسیر دستیِ قابل‌استفاده است؛ push-triggerهای موجود در فایل به چند شاخهٔ قدیمی `arena/...` محدودند.
2. مطمئن شوید **Settings → Secrets and variables → Actions** متغیر `EAS_PROJECT_ID` را دارد اگر قابلیت Expo Push Token لازم است. شناسهٔ پروژه محرمانه نیست، ولی اگر آن را تعریف می‌کنید از نوع **Repository variable** استفاده کنید. اتصال عمومی Supabase از فایل عمومی مخزن گرفته و قبل از bundle اعتبارسنجی می‌شود.
3. workflow به Java 17، Android SDK 36 و مجوز `contents: write` برای انتشارهای Release نیاز دارد. ابزارها در runner GitHub آماده یا در فایل workflow نصب می‌شوند.
4. برای اجرای معمولی دستی، APKها را از **Actions → همان اجرای موفق → Artifacts** دریافت کنید. اجرای کامل `workflow_dispatch` artifact می‌سازد؛ Release عمومیِ سه APK فقط از مسیر شرط‌دار push انجام می‌شود. استثنا: اگر ورودی `russian_only` را فعال کنید، workflow برای APK روسی Release جداگانه می‌سازد.
5. APK را فقط پس از مرور گزارش build و smoke test نصب/توزیع کنید. اپ مدیریت حاوی دسترسی مدیریتیِ عمومی نیست؛ کاربر مدیر باید در Supabase به‌شکل مجاز ثبت شود. مطابق `ADMIN-APP-SETUP.md`، migrationها و حساب مدیر باید پیش از توزیع APK مربوطه آماده باشند.

برای انتشار مستقیم به GitHub Release، workflow فعلی انتشار را به push دارای متن commit شامل `[apk-release]` و یکی از شاخه‌های push تعریف‌شده محدود کرده است. پیش از اتکا به این مسیر، بررسی کنید branch triggerها با شاخهٔ مورد استفادهٔ تیم هم‌خوان باشند؛ اگر نیستند، ابتدا workflow را با بازبینی کد به شاخه/رویهٔ انتشار واقعی تطبیق دهید. از تغییر خودکار این شرط در زمان انتشار پرهیز کنید.

## ساخت APK با EAS (جایگزین)

برای ساخت دستی، در محیط امن Node.js نصب کنید، با حساب Expo وارد شوید و از ریشهٔ مخزن اجرا کنید:

```bash
npm ci
npx eas-cli login
npx eas-cli build --platform android --profile production
```

پروفایل `production` در `eas.json` خروجی `apk` با توزیع internal می‌سازد و onboarding واقعی را خاموش نمی‌کند. `appVersionSource` روی `remote` است؛ EAS نسخهٔ build را مدیریت می‌کند. فایل خروجی را از صفحهٔ build موفق EAS دریافت کنید. اگر push notifications لازم است، `EAS_PROJECT_ID` را در محیط build به‌صورت متغیر محیطی تعریف کنید. کلید Supabase سرویس یا رمزهای backend را به متغیرهای `EXPO_PUBLIC_*` ندهید.

## Backend و حفاظت از داده‌ها

برای اولین استقرار یا انتشار migration/function جدید، راهنمای `README-FA.md` و `docs/RAH-ANDAZI-BEDOON-TERMINAL.md` را دنبال کنید. اسکریپت `scripts/setup-production.sh` به پروژهٔ درست Supabase link می‌شود، `db push` انجام می‌دهد، سه تابع احرازشده و تابع `chat-push` را deploy می‌کند و برای webhook/Anonymous Sign-Ins یادآوری می‌دهد. قبل از اجرای آن روی production، diff migrationها را بازبینی و از داده‌های مهم نسخهٔ پشتیبان تهیه کنید؛ این عملیات می‌تواند schema واقعی را تغییر دهد.

برای کلید AI، `CHAT_WEBHOOK_SECRET` و سایر رمزها از **Supabase Edge Function Secrets** استفاده کنید. `service_role` را در وب‌اپ، APK، GitHub Pages، log یا GitHub artifact قرار ندهید. پس از استقرار backend، تنظیم provider ورود ناشناس و webhookهای موردنیاز را طبق همان راهنما انجام دهید و فقط سپس مسیرهای مربوط به دعوت/چت/push را آزمایش کنید.

## عیب‌یابی مختصر

| علامت | بررسی |
|---|---|
| Web workflow پیش از export متوقف می‌شود | `config/supabase.public.json`، `EXPO_PUBLIC_*` و خطای `typecheck`/`validate:web-shell` را بازبینی کنید. مقدار نمونه یا placeholder پذیرفته نمی‌شود. |
| صفحه بعد از deploy در ریشه باز نمی‌شود | آدرس `/App3/` و مقدار `experiments.baseUrl` در `app.json` را بررسی کنید. |
| نسخه وب چپ‌چین یا ناچ‌خورده است | نسخهٔ جدید واقعاً deploy شده باشد؛ سپس `dir="rtl"` در HTML، `direction: rtl` ریشه، `viewport-fit=cover` و safe-area گوشی را بررسی کنید. |
| APK در Actions منتشر نشده است | اجرای workflow دستی artifact می‌سازد؛ انتشار GitHub Release فقط طبق شرط‌های push و متن `[apk-release]` فعال می‌شود. |
| push token ثبت نمی‌شود | مقدار `EAS_PROJECT_ID` را در محیط build بررسی و مطمئن شوید `extra.eas.projectId` در config نهایی قرار می‌گیرد. |

## فایل‌ها و workflowهای مرجع

- وب: `.github/workflows/deploy.yml`، `app.json`، `config/supabase.public.json`
- Android: `.github/workflows/android-build.yml`، `eas.json`، `app.config.js`
- Backend: `scripts/setup-production.sh`، `supabase/`، `ADMIN-APP-SETUP.md`
