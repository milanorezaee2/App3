/**
 * Lessons whose items are single words rather than sentences. Their counters
 * read «واژه» instead of «جمله». Extend the set as more word-only lessons are
 * confirmed; the teaching content itself is untouched.
 */
const WORD_LESSON_IDS = new Set<string>(['prea1-01-hello']);

export const isWordLesson = (lessonId: string | undefined | null): boolean => !!lessonId && WORD_LESSON_IDS.has(lessonId);

/** «جمله» / «واژه» (singular, used in counters like «واژهٔ اصلی», «واژه ۱ از ۸»). */
export const lessonUnit = (lessonId: string | undefined | null): string => (isWordLesson(lessonId) ? 'واژه' : 'جمله');
