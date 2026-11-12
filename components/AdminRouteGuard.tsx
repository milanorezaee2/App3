import { useEffect } from 'react';
import { usePathname, useRouter } from 'expo-router';

// Everything the management APK is allowed to show. Any other route (learner
// home, lessons, profile, learner chat list, ...) is bounced back to the panel.
const ALLOWED_PREFIXES = ['/admin', '/conversations/human/'];
const ALLOWED_EXACT = new Set(['/', '/index']);

/** Mounted only in the admin build: keeps the app inside the management panel. */
export function AdminRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (ALLOWED_EXACT.has(pathname) || ALLOWED_PREFIXES.some(prefix => pathname.startsWith(prefix))) return;
    router.replace('/admin' as never);
  }, [pathname, router]);
  return null;
}
