/**
 * Lessons whose items are single words rather than sentences. Their counters
 * read «واژه» instead of «جمله». Extend the set as more word-only lessons are
 * confirmed; the teaching content itself is untouched.
 *
 * Pre-A1 no longer opens with isolated words: every sentence there is a usable
 * phrase or a complete sentence, so the old word-only exemption was dropped.
 */
const WORD_LESSON_IDS = new Set<string>();

export const isWordLesson = (lessonId: string | undefined | null): boolean => !!lessonId && WORD_LESSON_IDS.has(lessonId);

/** «جمله» / «واژه» (singular, used in counters like «واژهٔ اصلی», «واژه ۱ از ۸»). */
export const lessonUnit = (lessonId: string | undefined | null): string => (isWordLesson(lessonId) ? 'واژه' : 'جمله');
