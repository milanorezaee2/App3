import { type PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { LoginCodeScreen, LoginProfileScreen, LoginScreen, type LoginMode } from '@/components/LoginScreen';
import { completeLearnerProfile, getRegisteredSession, normalizeOtpDigits, registrationError, requestLearnerOtp, touchLearnerActivity, verifyLearnerOtp, type LearnerOtpType } from '@/lib/userRegistration';
import { writeResumeSnapshot } from '@/lib/appResume';
import { Colors, Typography } from '@/lib/theme';
import { FEATURES } from '@/lib/features';

const IS_ADMIN_APP = Constants.expoConfig?.extra?.appRole === 'admin'
  || process.env.EXPO_PUBLIC_MILO_ADMIN_APP === 'true';
const PLACEMENT_ENTRY_KEY = 'milo_post_login_assessment_entry_v1:';
// When the learner login screen is disabled in lib/features.ts, skip the gate entirely.
const BYPASS_GATE: boolean = IS_ADMIN_APP || !FEATURES.learnerLogin;

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

  const routeToAssessmentEntry = useCallback(async (userId: string) => {
    try {
      await writeResumeSnapshot({ version: 1, href: '/languages', language: null, backgroundAt: null, updatedAt: Date.now() });
    } catch {
      // Keep login usable even when local resume storage is unavailable.
    }
    try { await AsyncStorage.setItem(`${PLACEMENT_ENTRY_KEY}${userId}`, '1'); } catch { /* route to onboarding anyway */ }
    router.replace('/languages' as never);
    setReady(true);
    routingAfterAuth.current = false;
  }, [router]);

  const inspect = useCallback(async () => {
    if (BYPASS_GATE || routingAfterAuth.current) return;
    try {
      const state = await getRegisteredSession();
      const complete = !!state.session && !!state.profile;
      if (complete) {
        const userId = state.session?.user.id;
        const entrySeen = userId ? await AsyncStorage.getItem(`${PLACEMENT_ENTRY_KEY}${userId}`).catch(() => null) : '1';
        if (userId && entrySeen !== '1') {
          routingAfterAuth.current = true;
          await routeToAssessmentEntry(userId);
        } else {
          setReady(true);
        }
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
      setChecking(false);
    }
  }, [routeToAssessmentEntry]);

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
        await routeToAssessmentEntry(state.session.user.id);
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
      await routeToAssessmentEntry(state.session.user.id);
      void touchLearnerActivity();
    } catch (reason) {
      routingAfterAuth.current = false;
      setError(registrationError(reason));
    } finally {
      setBusy(false);
    }
  };

  if (BYPASS_GATE || ready) return <>{children}</>;
  if (checking) return <View style={styles.loading}><ActivityIndicator size="large" color={Colors.primary[600]} /><Text style={styles.loadingText}>در حال بررسی حساب…</Text></View>;

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
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: '#F6FAFF' },
  loadingText: { fontFamily: Typography.fontFamily, color: '#334155', fontSize: 13 },
});
