# Language Journey — آموزش چندزبان

ورودی فعلی اپ، انتخاب انگلیسی یا روسی است. مسیر انگلیسی ۱۷۴ درس و ۳٬۸۶۲ جملهٔ نمونه دارد و مسیر روسی یک مسیر جمله‌محور مستقل با نقشهٔ پنج‌سطحی است؛ هر دو با همان ساختار نُه‌مرحله‌ای و همان صفحه‌های خانه/کتابخانه/درس/مرور/پشتیبان پیش می‌روند. سطح‌بندی داخلی گواهی یا اعتبارسنجی رسمی CEFR نیست. جزئیات انگلیسی در `docs/ENGLISH-CURRICULUM-REBUILD-REPORT-FA.md` و `docs/ENGLISH-BEGINNER-A1-COMPLETION-FA.md` آمده است.


- جداسازی پیشرفت زبان‌ها و پنل پیش‌فرض مخفی: `docs/MULTILINGUAL-STATUS.md`
- طرح و محدودیت‌های مسیر آغازین روسی: `docs/RUSSIAN-STARTER-PLAN-FA.md`
- داشبورد روسی: `/learn/ru`؛ کتابخانهٔ روسی: `/learn/ru/library`

بخش گوشی دوم برای جفت‌سازی و گزارش وضعیت دستگاه در مخزن باقی است و در مسیرهای آموزشی اجرا نمی‌شود. کنترل لمسی، اشتراک زنده صفحه و تماس صوتی زنده از APK حذف شده‌اند؛ گفت‌وگوی متنی، پیام‌های صوتی، اعلان‌ها، موقعیت و سایر قابلیت‌های آموزشی حفظ شده‌اند. برنامه مستقل کنترل‌کننده گوشی اول در این مخزن وجود ندارد.

## امکانات اصلی

- مسیر اصلی انگلیسی: ۱۷۴ درس/۳٬۸۶۲ جمله؛ Foundation: ۱۰/۵۰۰، Survival: ۱۹/۹۵۰، Everyday English: ۲۰/۱٬۰۰۰، Communication English: ۱۵/۷۵۰ (هر درس ۵۰ نمونه)، و Advanced English: ۱۱۰/۶۶۲. واژگان یکتای Survival برابر ۱٬۳۱۲، Everyday برابر ۱٬۷۷۴ و Communication برابر ۱٬۴۱۰ مدخل/عبارت پیوندخورده است. این مرحله شش درس Communication و ۳۰۰ جمله افزود و ۹ درس قبلی را با شناسه و ترتیب نسبی حفظ کرد؛ Foundation، Survival، Everyday و Advanced تغییر نکردند. گزارش فارسی بازبینی دوره و برنامهٔ مرحله‌ای: `docs/ENGLISH-CURRICULUM-REBUILD-REPORT-FA.md`؛ گزارش جزئی Communication: `docs/COMMUNICATION-ENGLISH-50-EXAMPLES-REPORT-FA.md`. جزئیات Everyday: `docs/EVERYDAY-ENGLISH-EXPANSION-REPORT-FA.md` و Survival: `docs/ENGLISH-SURVIVAL-50-EXAMPLES-REPORT-FA.md`. پوشش مرجع ۵۰۴ واژه حفظ شده است.
- مرور فاصله‌دار، تمرین تلفظ و Emma متنی/صوتی
- مخاطبان واقعی، پیام متنی و پیام صوتی خصوصی
- ترجمه، اصلاح و پیشنهاد پاسخ خصوصی قبل از ارسال
- حساب شخصی ایمیلی OTP و همگام‌سازی پیشرفت آموزشیِ انگلیسی و خودارزیابی تلفظ، با RLS مالک‌محور؛ دامنهٔ دقیق و داده‌های عمداً محلی در `docs/PERSONAL-CLOUD-SYNC-SETUP-FA.md`
- پیشرفت ابری، زنجیره روزانه و محدودیت مصرف AI

## اجرای محلی

```bash
npm install
npm run typecheck
npm run validate:content   # ۱۷۴ درس، ۳٬۸۶۲ جمله و پوشش ۵۰۴ واژه
npm run validate:logic     # تست منطق درس‌ها، مرور فاصله‌دار و ذخیره پیشرفت
npm run validate:russian   # محتوای آغازین روسی، جریان ۹مرحله‌ای و جداسازی
npm run validate:russian-architecture  # نقشهٔ A1–B2، چرخهٔ جمله‌محور و شواهد محلی
npm run validate:english-supplement  # ۲۴ واحد، پاسخ‌ها و نگهداشت سابقه
npm run validate:backup            # ادغام ایمن بکاپ انگلیسی و حفظ پیش‌نویس محلی
npm run validate:personal-sync     # OTP/RLS و ادغام پیشرفت ابری
npm run dev -- --web
```

`validate:logic` ماژول‌های واقعی اپ را در Node اجرا می‌کند (با stub کردن حافظه و Supabase)
و هم مسیر بومی (AsyncStorage) و هم مسیر وب (localStorage) را بررسی می‌کند؛ اگر از .env
قالب استفاده شده باشد یا کلیدها خالی باشند، همان‌جا هشدار می‌دهد. `validate:english-supplement`
ساختار دوره، پاسخ‌ها، ذخیرهٔ قبلی و دو سنجش پایانی را بررسی می‌کند.

## راه‌اندازی Backend با یک دستور

> اگر به ترمینال دسترسی ندارید، کل همین کار را می‌توانید فقط با مرورگر انجام دهید:
> راهنمای کامل در `docs/RAH-ANDAZI-BEDOON-TERMINAL.md` و فایل آماده برای
> کپی/پیست در SQL Editor در `supabase/SETUP-COPY-PASTE-ONCE.sql` است.
> هر دو مسیر (اسکریپت و داشبورد) بک‌اند یکسانی می‌سازند.

نیازی به نصب سراسری Supabase CLI نیست. ابتدا (فقط بار اول) وارد حساب شوید و پروژه را Link کنید:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

`YOUR_PROJECT_REF` همان بخش اول آدرس پروژه است: `https://YOUR_PROJECT_REF.supabase.co`.
سپس راه‌اندازی کامل با یک دستور انجام می‌شود:

```bash
./scripts/setup-production.sh
```

اسکریپت از `npx supabase` استفاده می‌کند، migration را اجرا و چهار Edge Function موردنیاز را منتشر می‌کند.

## ساخت APK مستقل

شناسه Android این برنامه `com.devicecontrol.companion` است و با برنامه‌های دیگر تداخل ندارد.

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile production
```

پروفایل production در `eas.json` خروجی APK می‌سازد، onboarding واقعی را فعال نگه می‌دارد و از امضای مدیریت‌شده EAS استفاده می‌کند.

## نکات رضایت و امنیت

- پیام‌های متنی، فایل‌های صوتی و پیشرفت آموزشی با دسترسی احراز هویت‌شده استفاده می‌شوند.
- ضبط و پخش پیام‌های صوتی و محتوای صوتی آموزشی مستقل از تماس زنده هستند و حفظ شده‌اند.
- هیچ Secret خصوصی نباید در Git یا چت قرار گیرد.
