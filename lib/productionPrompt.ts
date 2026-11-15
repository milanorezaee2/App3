/**
 * B1+ lessons end with real production: a written answer of a given length and
 * a spoken answer to the same situation. Courses with hand-written prompts pass
 * them in; otherwise a prompt is derived from the lesson's situation so every
 * B1/B2/C1 lesson in every language has one.
 */
export interface ProductionPrompt {
  speaking: string;
  writing: string;
  checklist: readonly string[];
  /** Target length of the written answer, in words. */
  minWords: number;
}

export interface ProductionSource {
  id: string;
  title: string;
  situation: string;
  levelId: number;
}

const CHECKLIST: Record<number, readonly string[]> = {
  3: ['موقعیت روشن است و مخاطب معلوم', 'دست‌کم یک دلیل یا مثال آورده‌ام', 'زمان فعل‌ها با هم سازگارند', 'جمله‌ها با پیوند (چون، اما، بعد…) به هم وصل‌اند'],
  4: ['موضع من و دلیل آن روشن است', 'یک دیدگاه مخالف را هم گفته و پاسخ داده‌ام', 'ساختارهای این درس را به‌کار برده‌ام', 'لحن با مخاطب (رسمی/دوستانه) می‌خواند'],
  5: ['استدلال ساختار دارد: ادعا، دلیل، نتیجه', 'از واژگان دقیق و کم‌تکرار استفاده کرده‌ام', 'ظرافت معنایی (قید، وجه، تأکید) درست است', 'متن بدون ترجمهٔ ذهنی از فارسی نوشته شده'],
};

const MIN_WORDS: Record<number, number> = { 3: 30, 4: 50, 5: 80 };

const clean = (text: string) => text.replace(/\s+/g, ' ').replace(/[.。]+$/, '').trim();

export function productionPrompt(
  source: ProductionSource,
  explicit?: { speaking?: string; writing?: string; checklist?: readonly string[] } | string,
): ProductionPrompt {
  const level = Math.min(5, Math.max(3, source.levelId));
  const minWords = MIN_WORDS[level];
  const situation = clean(source.situation || source.title);
  const custom = typeof explicit === 'string' ? { writing: explicit } : explicit ?? {};
  const generic = level === 3
    ? {
      writing: `دربارهٔ این موقعیت بنویس: «${situation}». توضیح بده چه خبر است، چه می‌خواهی یا چه مشکلی هست، و یک پیشنهاد یا نتیجه بیاور.`,
      speaking: `تصور کن الان در این موقعیت هستی: «${situation}». حدود ۴۵ ثانیه بی‌وقفه حرف بزن؛ اول وضعیت، بعد خواسته‌ات، بعد یک دلیل.`,
    }
    : level === 4
      ? {
        writing: `دربارهٔ «${situation}» نظر بده: موضعت را بگو، با دو دلیل پشتیبانی کن، یک دیدگاه مخالف را مطرح و به آن پاسخ بده.`,
        speaking: `یک دقیقه دربارهٔ «${situation}» صحبت کن، طوری که انگار برای همکار یا دوستی توضیح می‌دهی؛ مثال واقعی بیاور.`,
      }
      : {
        writing: `متنی منسجم دربارهٔ «${situation}» بنویس: مسئله را صورت‌بندی کن، دو سمت را بسنج، و با جمع‌بندی استدلالی تمام کن.`,
        speaking: `یک ارائهٔ دو دقیقه‌ای دربارهٔ «${situation}» بده: مقدمه، سه نکتهٔ اصلی با مثال، و نتیجه.`,
      };
  return {
    writing: custom.writing ?? generic.writing,
    speaking: custom.speaking ?? generic.speaking,
    checklist: custom.checklist ?? CHECKLIST[level],
    minWords,
  };
}

export const countWords = (text: string) => text.trim().split(/\s+/).filter(word => /[\p{L}\p{N}]/u.test(word)).length;
