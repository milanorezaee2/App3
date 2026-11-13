/** Learner pages a pop-up can be pinned to. Shared by the admin panel and the learner app. */
export interface PopupPage { route: string; title: string; group: string }

export const POPUP_PAGES: readonly PopupPage[] = Object.freeze([
  { route: '/languages', title: 'صفحهٔ اصلی (انتخاب زبان)', group: 'عمومی' },
  { route: '/profile', title: 'پروفایل', group: 'عمومی' },
  { route: '/conversations', title: 'مکالمه (فهرست)', group: 'عمومی' },
  { route: '/conversations/human', title: 'صفحهٔ چت', group: 'عمومی' },
  { route: '/conversations/invite', title: 'دعوت مخاطب', group: 'عمومی' },
  { route: '/lang', title: 'خانهٔ انگلیسی', group: 'انگلیسی' },
  { route: '/lang/library', title: 'فهرست درس‌های انگلیسی', group: 'انگلیسی' },
  { route: '/course/lesson', title: 'صفحهٔ درس انگلیسی', group: 'انگلیسی' },
  { route: '/lang/quiz', title: 'آزمون انگلیسی', group: 'انگلیسی' },
  { route: '/lang/podcast', title: 'پادکست', group: 'انگلیسی' },
  { route: '/review', title: 'مرور', group: 'انگلیسی' },
  { route: '/learn/en/pronunciation', title: 'تلفظ', group: 'انگلیسی' },
  { route: '/learn/de', title: 'خانهٔ آلمانی', group: 'زبان‌های دیگر' },
  { route: '/learn/fr', title: 'خانهٔ فرانسوی', group: 'زبان‌های دیگر' },
  { route: '/learn/tr', title: 'خانهٔ ترکی', group: 'زبان‌های دیگر' },
  { route: '/learn/es', title: 'خانهٔ اسپانیایی', group: 'زبان‌های دیگر' },
  { route: '/learn/ru', title: 'خانهٔ روسی', group: 'زبان‌های دیگر' },
  { route: '/learn/de/lesson', title: 'درس آلمانی', group: 'زبان‌های دیگر' },
  { route: '/learn/fr/lesson', title: 'درس فرانسوی', group: 'زبان‌های دیگر' },
  { route: '/learn/tr/lesson', title: 'درس ترکی', group: 'زبان‌های دیگر' },
  { route: '/learn/es/lesson', title: 'درس اسپانیایی', group: 'زبان‌های دیگر' },
  { route: '/learn/ru/lesson', title: 'درس روسی', group: 'زبان‌های دیگر' },
]);

export const popupPageTitle = (route: string): string => POPUP_PAGES.find(p => p.route === route)?.title || route;

/** `/learn/de/lesson` matches `/learn/de/lesson?id=…`; `/learn/de` does NOT match `/learn/de/lesson`. */
export function popupMatchesPath(targetRoutes: readonly string[] | null | undefined, pathname: string): boolean {
  if (!targetRoutes || targetRoutes.length === 0) return true;
  const path = pathname.split('?')[0];
  return targetRoutes.some(route => {
    if (path === route) return true;
    // Dynamic children (e.g. /conversations/human/<id>, /lang/podcast/<id>) belong to their listed parent.
    if (route === '/conversations/human' || route === '/lang/podcast') return path.startsWith(`${route}/`);
    // English lessons open from two routes.
    if (route === '/course/lesson') return path === '/lang/lesson';
    return false;
  });
}
