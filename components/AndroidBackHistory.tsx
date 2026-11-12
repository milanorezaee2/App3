import { useEffect, useRef } from 'react';
import { BackHandler, Platform } from 'react-native';
import { useGlobalSearchParams, usePathname, useRouter } from 'expo-router';
import { MANAGEMENT_BUILD } from '@/lib/features';

const HOME = MANAGEMENT_BUILD ? '/admin' : '/languages';
const EXIT_ROUTES = new Set(['/', HOME, '/index']);

function hrefFor(pathname: string, params: Record<string, string | string[] | undefined>): string {
  const query = Object.entries(params)
    .filter(([key, value]) => typeof value === 'string' && value.length > 0 && !pathname.split('/').includes(value))
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`);
  return pathname + (query.length ? `?${query.join('&')}` : '');
}

/**
 * Android hardware back = the app's own "previous page".
 *
 * Most screens navigate with `router.replace`, so the native stack is often
 * empty and the system back button would close the app. This keeps a visited
 * history of its own and, when the native stack cannot go back, returns to the
 * previously visited screen instead. Only the home screen exits the app.
 */
export function AndroidBackHistory() {
  const pathname = usePathname();
  const params = useGlobalSearchParams() as Record<string, string | string[] | undefined>;
  const router = useRouter();
  const history = useRef<string[]>([]);
  const goingBack = useRef(false);

  useEffect(() => {
    const href = hrefFor(pathname, params);
    const stack = history.current;
    if (goingBack.current) {
      goingBack.current = false;
      // Expected destination already sits on top; drop stale forward entries.
      const index = stack.lastIndexOf(href);
      if (index >= 0) stack.length = index + 1;
      else stack.push(href);
      return;
    }
    if (stack[stack.length - 1] === href) return;
    // Returning to an earlier page (e.g. via the in-app back button) unwinds to it.
    const existing = stack.lastIndexOf(href);
    if (existing >= 0) stack.length = existing + 1;
    else stack.push(href);
    if (stack.length > 60) stack.splice(0, stack.length - 60);
  }, [pathname, params]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (router.canGoBack()) { router.back(); return true; }
      const stack = history.current;
      const current = stack[stack.length - 1];
      const previous = stack.length >= 2 ? stack[stack.length - 2] : null;
      const currentPath = (current ?? pathname).split('?')[0];
      if (EXIT_ROUTES.has(currentPath)) return false; // home screen: let Android close the app
      if (previous && !EXIT_ROUTES.has(previous.split('?')[0]) && previous !== current) {
        stack.pop();
        goingBack.current = true;
        router.replace(previous as never);
        return true;
      }
      goingBack.current = true;
      router.replace(HOME as never);
      return true;
    });
    return () => subscription.remove();
  }, [router, pathname]);

  return null;
}
