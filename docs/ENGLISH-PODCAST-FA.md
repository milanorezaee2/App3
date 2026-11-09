# پادکست انگلیسی — راهنمای راه‌اندازی

پادکست فقط برای مسیر انگلیسی است و از همان درس‌های موجود ساخته می‌شود؛ هیچ محتوای درسی تغییر نمی‌کند.

- فهرست: `/lang/podcast` — پخش‌کننده: `/lang/podcast/[id]` — آزمون: `/lang/podcast/quiz?id=...`
- شناسهٔ هر اپیزود برابر شناسهٔ همان درس (`lesson.id`) است.

## فاز ۱ — TTS (پیش‌فرض، بدون تنظیمات)
هر جمله با سرعت عادی و سپس یک‌بار آهسته با موتور گفتار دستگاه خوانده می‌شود. آفلاین و بدون لاگین کار می‌کند.

## فاز ۲ — اپیزودهای ضبط‌شده (MP3) + دانلود آفلاین
۱. فایل‌ها را روی هر هاست استاتیک یا یک bucket عمومی Supabase Storage قرار دهید.
۲. در `.env` (یا متغیرهای بیلد) مقدار زیر را تنظیم کنید:

```env
EXPO_PUBLIC_PODCAST_AUDIO_URL=https://YOUR_PROJECT.supabase.co/storage/v1/object/public/podcast
```

۳. ساختار فایل‌ها:

```
<base>/manifest.json
<base>/<lessonId>.mp3
```

نمونهٔ `manifest.json`:

```json
{
  "episodes": {
    "foundation-01": { "durationSec": 312, "cues": [0, 6.5, 14.2, 22.8] },
    "foundation-02": { "durationSec": 290 }
  }
}
```

- `durationSec` اختیاری است (برای هایلایت تقریبی متن).
- `cues` اختیاری است: زمان شروع هر «بخش» (به ترتیب بخش‌های نمایش‌داده‌شده در پخش‌کننده: مقدمه، جمله‌ها، گفت‌وگو، پایان). با وجود `cues`، هایلایت متن و پرش با لمس هر خط دقیق می‌شود.
- اپیزودی که در manifest نباشد خودکار با TTS پخش می‌شود.
- دانلود آفلاین فقط در اپ موبایل (اندروید/iOS) در دسترس است و در `documentDirectory/podcast/` ذخیره می‌شود؛ روی وب فقط پخش آنلاین انجام می‌شود.

## فاز ۳ — سؤالات درک مطلب
پس از پایان هر اپیزود، ۵ سؤال از جمله‌های همان درس ساخته می‌شود (معنی جمله، جملهٔ انگلیسی شنیده‌شده، معنی واژه).
پاسخ‌های اشتباه با `addSentenceToReview` به کارت‌های مرور فاصله‌دار (`/review`) اضافه می‌شوند و بهترین نمره به‌صورت محلی ذخیره می‌شود.

## تولید خودکار MP3 (`scripts/generate-podcast-audio.mjs`)

از همان مدل اپیزودهای اپ، برای هر اپیزود یک MP3 و `manifest.json` (با `durationSec` و `cues` دقیق) می‌سازد.
هر جمله یک‌بار عادی و یک‌بار آهسته (۰٫۷×) خوانده می‌شود؛ بین بخش‌ها سکوت کوتاه قرار می‌گیرد.

پیش‌نیاز: `ffmpeg` و `ffprobe` روی PATH، و کلید یکی از سرویس‌ها (هرگز در Git قرار نگیرد):

```bash
# OpenAI TTS (پیش‌فرض)
export OPENAI_API_KEY=sk-...            # اختیاری: OPENAI_TTS_MODEL=gpt-4o-mini-tts  OPENAI_TTS_VOICE=alloy
# یا ElevenLabs
export PODCAST_TTS_PROVIDER=elevenlabs ELEVENLABS_API_KEY=... ELEVENLABS_VOICE_ID=...

npm run podcast:audio -- --dry-run                 # فقط برآورد حجم متن، بدون هزینه
npm run podcast:audio -- --level 0 --limit 3       # آزمایش روی ۳ اپیزود Foundation
npm run podcast:audio                              # همهٔ ۲۱۲ اپیزود → dist-podcast/
```

گزینه‌ها: `--out DIR`، `--level N`، `--ids id1,id2`، `--limit N`، `--provider`، `--voice`، `--concurrency 3`، `--force` (بازسازی)، `--upload`.
کلیپ‌های هر بخش در `dist-podcast/.cache` ذخیره می‌شوند تا اجرای دوباره هزینهٔ اضافه نداشته باشد.

آپلود مستقیم به Supabase Storage (bucket عمومی):

```bash
export SUPABASE_URL=https://YOUR_PROJECT.supabase.co SUPABASE_SERVICE_ROLE_KEY=... PODCAST_BUCKET=podcast
npm run podcast:audio -- --upload
# سپس در .env:
# EXPO_PUBLIC_PODCAST_AUDIO_URL=https://YOUR_PROJECT.supabase.co/storage/v1/object/public/podcast
```

`dist-podcast/` در `.gitignore` است؛ فایل‌های صوتی را در Git قرار ندهید.
