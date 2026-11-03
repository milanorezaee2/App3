import { type PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Platform, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { LoginCodeScreen, LoginProfileScreen, LoginScreen, type LoginMode } from '@/components/LoginScreen';
import { completeLearnerProfile, getRegisteredSession, normalizeOtpDigits, registrationError, requestLearnerOtp, touchLearnerActivity, verifyLearnerOtp, type LearnerOtpType } from '@/lib/userRegistration';
import { writeResumeSnapshot } from '@/lib/appResume';
import { Typography } from '@/lib/theme';
import { FEATURES } from '@/lib/features';

const IS_ADMIN_APP = Constants.expoConfig?.extra?.appRole === 'admin'
  || process.env.EXPO_PUBLIC_MILO_ADMIN_APP === 'true';
// When the learner login screen is disabled in lib/features.ts, skip the gate entirely.
const BYPASS_GATE: boolean = IS_ADMIN_APP || !FEATURES.learnerLogin;
const SESSION_INSPECT_TIMEOUT_MS = 5000;

function isWebPreviewHost(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === '1') return false;
    const host = window.location.hostname.toLowerCase();
    return host === 'localhost'
      || host === '127.0.0.1'
      || host.endsWith('.e2b.app')
      || host.endsWith('.e2b.dev');
  } catch {
    return false;
  }
}

type Mode = LoginMode;
type AuthStep = 'request' | 'verify' | 'profile';

export function RegistrationGate({ children }: PropsWithChildren) {
  const router = useRouter();
  const routingAfterAuth = useRef(false);
  const [checking, setChecking] = useState(!BYPASS_GATE);
  const [ready, setReady] = useState(BYPASS_GATE);
  const [step, setStep] = useState<AuthStep>('request');
  const [mode, setMode] = useState<Mode>('login');
  const [otpType, setOtpType] = useState<LearnerOtpType>('email');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const routeToLanguageSelection = useCallback(async () => {
    try {
      await writeResumeSnapshot({ version: 1, href: '/languages', language: null, backgroundAt: null, updatedAt: Date.now() });
    } catch {
      // Keep login usable even when local resume storage is unavailable.
    }
    router.replace('/languages' as never);
    setReady(true);
    routingAfterAuth.current = false;
  }, [router]);

  const inspect = useCallback(async () => {
    if (BYPASS_GATE || routingAfterAuth.current) return;
    if (isWebPreviewHost()) {
      setReady(true);
      setChecking(false);
      return;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const state = await Promise.race([
        getRegisteredSession(),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error('SESSION_INSPECT_TIMEOUT')), SESSION_INSPECT_TIMEOUT_MS);
        }),
      ]);
      const complete = !!state.session && !!state.profile;
      if (complete) {
        setReady(true);
        void touchLearnerActivity();
      } else {
        setReady(false);
      }
      if (!complete && state.session) {
        setEmail(state.session.user.email ?? '');
        setFullName(String(state.session.user.user_metadata?.full_name ?? ''));
        setStep('profile');
        setNotice('ایمیل تأیید شده است؛ برای تکمیل ورود، نام خود را ثبت کنید.');
      }
    } catch {
      setReady(false);
    } finally {
      if (timer) clearTimeout(timer);
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    if (BYPASS_GATE) return;
    void inspect();
    const { data } = supabase.auth.onAuthStateChange(() => { void inspect(); });
    const appState = AppState.addEventListener('change', state => {
      if (state === 'active') void inspect();
    });
    return () => { data.subscription.unsubscribe(); appState.remove(); };
  }, [inspect]);

  const requestCode = async () => {
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const cleanEmail = email.trim().toLowerCase();
      const requestedType = await requestLearnerOtp(cleanEmail, mode, mode === 'register' ? fullName : '');
      setEmail(cleanEmail);
      setCode('');
      setOtpType(requestedType);
      setStep('verify');
      setNotice(`کد یک‌بارمصرف به ${cleanEmail} ارسال شد. پوشهٔ هرزنامه را هم بررسی کنید.`);
    } catch (reason) {
      setError(registrationError(reason));
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async () => {
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    routingAfterAuth.current = true;
    try {
      await verifyLearnerOtp(email, code, mode === 'register' ? fullName : '', otpType);
      const state = await getRegisteredSession();
      if (state.session && state.profile) {
        await routeToLanguageSelection();
        void touchLearnerActivity();
      } else if (state.session) {
        routingAfterAuth.current = false;
        setStep('profile');
        setNotice('ایمیل تأیید شد؛ برای تکمیل پروفایل نام خود را ثبت کنید.');
      } else {
        throw new Error('PROFILE_INCOMPLETE');
      }
    } catch (reason) {
      routingAfterAuth.current = false;
      setError(registrationError(reason));
    } finally {
      setBusy(false);
    }
  };

  const resendCode = async () => {
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const requestedType = await requestLearnerOtp(email, mode, mode === 'register' ? fullName : '');
      setCode('');
      setOtpType(requestedType);
      setNotice(`کد تازه به ${email} ارسال شد. کد قبلی ممکن است دیگر معتبر نباشد.`);
    } catch (reason) {
      setError(registrationError(reason));
    } finally {
      setBusy(false);
    }
  };

  const finishProfile = async () => {
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    routingAfterAuth.current = true;
    try {
      await completeLearnerProfile(fullName);
      const state = await getRegisteredSession();
      if (!state.session || !state.profile) throw new Error('PROFILE_INCOMPLETE');
      await routeToLanguageSelection();
      void touchLearnerActivity();
    } catch (reason) {
      routingAfterAuth.current = false;
      setError(registrationError(reason));
    } finally {
      setBusy(false);
    }
  };

  if (BYPASS_GATE || ready) return <>{children}</>;
  if (checking) return <View style={styles.loading}><ActivityIndicator size="large" color="#728D75" /><Text style={styles.loadingText}>در حال بررسی حساب…</Text></View>;

  if (step === 'verify') {
    return (
      <LoginCodeScreen
        email={email}
        code={code}
        onChangeCode={value => setCode(normalizeOtpDigits(value))}
        onSubmit={() => void verifyCode()}
        onResend={() => void resendCode()}
        onEditEmail={() => { setStep('request'); setCode(''); setOtpType('email'); setError(''); setNotice(''); }}
        busy={busy}
        error={error}
        notice={notice}
      />
    );
  }

  if (step === 'profile') {
    return (
      <LoginProfileScreen
        email={email}
        fullName={fullName}
        onChangeFullName={setFullName}
        onSubmit={() => void finishProfile()}
        busy={busy}
        error={error}
        notice={notice}
      />
    );
  }

  return (
    <LoginScreen
      mode={mode}
      onChangeMode={next => { setMode(next); setError(''); setNotice(''); }}
      fullName={fullName}
      onChangeFullName={setFullName}
      email={email}
      onChangeEmail={setEmail}
      onSubmit={() => void requestCode()}
      busy={busy}
      error={error}
      notice={notice}
    />
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: '#F5F4EF' },
  loadingText: { fontFamily: Typography.fontFamily, color: '#778179', fontSize: 13 },
});
