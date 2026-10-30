import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Platform, StyleSheet, View } from 'react-native';
import { useGlobalSearchParams, useNavigationContainerRef, usePathname, useRouter } from 'expo-router';
import { MANAGEMENT_BUILD } from '@/lib/features';
import { languageForResume, readResumeSnapshot, resumeDestination, resumeHref, writeResumeSnapshot, type ResumeParams, type ResumeSnapshot } from '@/lib/appResume';
import { getSavedPlacementRecommendation } from '@/lib/placementProfile';

/** Keep learner navigation stable across Android/iOS background and process restarts. */
export function AppResumeGuard() {
  const router = useRouter();
  const navigation = useNavigationContainerRef();
  const pathname = usePathname();
  const params = useGlobalSearchParams() as ResumeParams;
  const placementLanguageParam = Array.isArray(params.language) ? params.language[0] : params.language;
  const href = resumeHref(pathname, params);
  const disabled = Platform.OS === 'web' || MANAGEMENT_BUILD;
  const [loaded, setLoaded] = useState(false);
  const [restoring, setRestoring] = useState(!disabled);
  const [revision, setRevision] = useState(0);
  const initial = useRef<ResumeSnapshot | null>(null);
  const snapshot = useRef<ResumeSnapshot | null>(null);
  const ready = useRef(false);
  const active = useRef(AppState.currentState === 'active');
  const currentHref = useRef<string | null>(href);
  const currentPathname = useRef(pathname);
  const pendingHref = useRef<string | null>(null);
  currentHref.current = href;
  currentPathname.current = pathname;

  useEffect(() => {
    if (disabled) return;
    let mounted = true;
    void readResumeSnapshot().then(async savedValue => {
      if (!mounted) return;
      let value = savedValue;
      if (value) {
        const savedPath = value.href.split('?')[0];
        const isLearningPath = savedPath === '/lang' || savedPath.startsWith('/lang/')
          || savedPath.startsWith('/course/') || savedPath === '/review' || savedPath.startsWith('/review/')
          || savedPath === '/learn/ru' || savedPath.startsWith('/learn/ru/')
          || savedPath === '/learn/en' || savedPath.startsWith('/learn/en/');
        const inferredLanguage = value.language ?? (savedPath.startsWith('/learn/ru') ? 'ru'
          : savedPath.startsWith('/lang') || savedPath.startsWith('/course/') ? 'en' : null);
        if (isLearningPath) {
          let hasPlacement = false;
          if (inferredLanguage) {
            try { hasPlacement = !!await getSavedPlacementRecommendation(inferredLanguage); } catch { /* continue to onboarding on lookup errors */ }
          }
          if (!mounted) return;
          if (!hasPlacement) value = { ...value, href: '/languages', language: null, backgroundAt: null, updatedAt: Date.now() };
        }
      }
      if (!mounted) return;
      initial.current = value;
      snapshot.current = value;
      setLoaded(true);
    }).catch(() => { if (mounted) setLoaded(true); });
    return () => { mounted = false; };
  }, [disabled]);

  useEffect(() => {
    if (disabled || !loaded || !active.current) return;
    if (pathname === '/' || !navigation.isReady()) {
      // The root redirect or navigation container may not be ready yet.
      const retry = setTimeout(() => setRevision(value => value + 1), 100);
      return () => clearTimeout(retry);
    }
    if (!href) {
      // A valid saved destination takes priority over an unsupported incoming route.
      const saved = !ready.current ? initial.current : null;
      ready.current = true;
      initial.current = null;
      if (saved) {
        const target = resumeDestination(saved, Date.now());
        pendingHref.current = target;
        router.replace(target as never);
      } else setRestoring(false);
      return;
    }
    if (!ready.current) {
      ready.current = true;
      const saved = initial.current;
      initial.current = null;
      if (saved) {
        const target = resumeDestination(saved, Date.now());
        if (target !== href) {
          pendingHref.current = target;
          router.replace(target as never);
          return;
        }
      }
    }
    if (pendingHref.current) {
      if (pendingHref.current !== href) return;
      pendingHref.current = null;
    }
    const next: ResumeSnapshot = {
      version: 1, href, language: languageForResume(pathname, snapshot.current?.language ?? null, placementLanguageParam),
      backgroundAt: null, updatedAt: Date.now(),
    };
    snapshot.current = next;
    setRestoring(false);
    void writeResumeSnapshot(next).catch(() => undefined);
  }, [disabled, loaded, href, pathname, navigation, router, revision]);

  useEffect(() => {
    if (disabled || !restoring) return;
    // A navigation/storage error must never make the application unusable.
    const timer = setTimeout(() => {
      ready.current = true;
      pendingHref.current = null;
      setRestoring(false);
    }, 10_000);
    return () => clearTimeout(timer);
  }, [disabled, restoring]);

  useEffect(() => {
    if (disabled) return;
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'background') {
        if (!active.current) return;
        active.current = false;
        if (ready.current && snapshot.current) {
          const now = Date.now();
          const visibleHref = pendingHref.current ? snapshot.current.href : currentHref.current ?? snapshot.current.href;
          snapshot.current = {
            ...snapshot.current, href: visibleHref,
            language: pendingHref.current ? snapshot.current.language : languageForResume(currentPathname.current, snapshot.current.language),
            backgroundAt: now, updatedAt: now,
          };
          void writeResumeSnapshot(snapshot.current).catch(() => undefined);
        }
      } else if (state === 'active' && !active.current) {
        active.current = true;
        const saved = snapshot.current;
        if (ready.current && saved) {
          const target = resumeDestination(saved, Date.now());
          if (target !== currentHref.current) {
            setRestoring(true);
            pendingHref.current = target;
            router.replace(target as never);
          }
        }
        setRevision(value => value + 1);
      }
    });
    // Keep a recent fallback timestamp in case Android kills the process before
    // delivering a background event. No learning progress is changed here.
    const timer = setInterval(() => {
      if (active.current && ready.current && snapshot.current && !pendingHref.current) {
        snapshot.current = { ...snapshot.current, updatedAt: Date.now() };
        void writeResumeSnapshot(snapshot.current).catch(() => undefined);
      }
    }, 60_000);
    return () => { subscription.remove(); clearInterval(timer); };
  }, [disabled, router]);
  if (disabled || !restoring) return null;
  return <View accessibilityRole="progressbar" style={styles.loading}><ActivityIndicator size="large" color="#2878DE" /></View>;
}

const styles = StyleSheet.create({
  loading: { ...StyleSheet.absoluteFillObject, zIndex: 2000, elevation: 2000, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5FAFF' },
});
