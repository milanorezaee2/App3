import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Alert, Platform } from 'react-native';
import { adminErrorText, assertAdmin, currentAdminSession, signInAdmin, signOutAdmin } from './api';
import { registerAdminPushToken } from '@/lib/adminPush';

type SessionState = 'checking' | 'signed-out' | 'ready';

interface Feedback { kind: 'error' | 'notice'; text: string } 

interface AdminStore {
  session: SessionState;
  adminEmail: string | null;
  busy: boolean;
  feedback: Feedback | null;
  clearFeedback(): void;
  notify(text: string): void;
  fail(error: unknown): void;
  /** Runs a mutation with shared busy/feedback handling. Returns true on success. */
  run(action: () => Promise<void>, successText?: string): Promise<boolean>;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  /** Bumps the cache generation so every open query refetches. */
  invalidate(keys?: string[]): void;
  generation: Record<string, number>;
}

const Ctx = createContext<AdminStore | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>('checking');
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [generation, setGeneration] = useState<Record<string, number>>({});
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((next: Feedback | null) => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setFeedback(next);
    if (next?.kind === 'notice') feedbackTimer.current = setTimeout(() => setFeedback(null), 5000);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const current = await currentAdminSession();
        if (!current) { if (mounted) setSession('signed-out'); return; }
        await assertAdmin();
        void registerAdminPushToken();
        if (mounted) { setAdminEmail(current.user.email ?? null); setSession('ready'); }
      } catch (error) {
        if (mounted) { setSession('signed-out'); show({ kind: 'error', text: adminErrorText(error) }); }
      }
    })();
    return () => { mounted = false; };
  }, [show]);

  const invalidate = useCallback((keys?: string[]) => {
    setGeneration(current => {
      const next = { ...current };
      for (const key of keys?.length ? keys : ['*']) next[key] = (next[key] || 0) + 1;
      return next;
    });
  }, []);

  const value = useMemo<AdminStore>(() => ({
    session, adminEmail, busy, feedback, generation,
    clearFeedback: () => show(null),
    notify: text => show({ kind: 'notice', text }),
    fail: error => show({ kind: 'error', text: adminErrorText(error) }),
    async run(action, successText) {
      if (busy) return false;
      setBusy(true); show(null);
      try { await action(); if (successText) show({ kind: 'notice', text: successText }); return true; }
      catch (error) { show({ kind: 'error', text: adminErrorText(error) }); return false; }
      finally { setBusy(false); }
    },
    async signIn(email, password) {
      setBusy(true); show(null);
      try { await signInAdmin(email, password); setAdminEmail(email.trim()); setSession('ready'); invalidate(); }
      catch (error) { show({ kind: 'error', text: adminErrorText(error) }); }
      finally { setBusy(false); }
    },
    async signOut() {
      setBusy(true);
      try { await signOutAdmin(); setSession('signed-out'); setAdminEmail(null); }
      catch (error) { show({ kind: 'error', text: adminErrorText(error) }); }
      finally { setBusy(false); }
    },
    invalidate,
  }), [session, adminEmail, busy, feedback, generation, show, invalidate]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdmin(): AdminStore {
  const store = useContext(Ctx);
  if (!store) throw new Error('useAdmin must be used inside AdminProvider');
  return store;
}

interface QueryState<T> { data: T | null; loading: boolean; error: string | null; refresh(): void; setData(updater: (current: T | null) => T | null): void }

/** Tiny cached query hook: refetches on mount, on manual refresh and on invalidate(). */
export function useAdminQuery<T>(key: string, fetcher: () => Promise<T>, enabled = true): QueryState<T> {
  const { generation, session } = useAdmin();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const gen = (generation[key] || 0) + (generation['*'] || 0);

  useEffect(() => {
    if (!enabled || session !== 'ready') return;
    let active = true;
    setLoading(true); setError(null);
    fetcherRef.current()
      .then(result => { if (active) setData(result); })
      .catch(cause => { if (active) setError(adminErrorText(cause)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [key, enabled, session, gen, tick]);

  return { data, loading, error, refresh: () => setTick(t => t + 1), setData: updater => setData(current => updater(current)) };
}

/** Cross-platform destructive confirmation. */
export function confirmAction(title: string, message: string, confirmLabel: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Promise.resolve(typeof window !== 'undefined' && window.confirm(`${title}\n\n${message}`));
  }
  return new Promise(resolve => {
    Alert.alert(title, message, [
      { text: 'انصراف', style: 'cancel', onPress: () => resolve(false) },
      { text: confirmLabel, style: 'destructive', onPress: () => resolve(true) },
    ], { cancelable: true, onDismiss: () => resolve(false) });
  });
}
