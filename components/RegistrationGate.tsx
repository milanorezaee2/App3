import { type PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { supabase } from '@/lib/supabase';
import { LoginCodeScreen, LoginScreen, type LoginMode } from '@/components/LoginScreen';
import { generateLoginCode, getRegisteredSession, loginLearner, registerLearner, registrationError, touchLearnerActivity } from '@/lib/userRegistration';
import { Colors, Typography } from '@/lib/theme';
import { FEATURES } from '@/lib/features';

const IS_ADMIN_APP = Constants.expoConfig?.extra?.appRole === 'admin'
  || process.env.EXPO_PUBLIC_MILO_ADMIN_APP === 'true';
// When the learner login screen is disabled in lib/features.ts, skip the gate entirely.
const BYPASS_GATE: boolean = IS_ADMIN_APP || !FEATURES.learnerLogin;

type Mode = LoginMode;

export function RegistrationGate({ children }: PropsWithChildren) {
  const [checking, setChecking] = useState(!BYPASS_GATE);
  const [ready, setReady] = useState(BYPASS_GATE);
  const [mode, setMode] = useState<Mode>('register');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [registrationReady, setRegistrationReady] = useState(false);
  const [guest, setGuest] = useState(false);
  const holdForCode = useRef(false);

  const inspect = useCallback(async () => {
    if (BYPASS_GATE) return;
    try {
      const state = await getRegisteredSession();
      const complete = !!state.session && !!state.profile;
      setReady(complete && !holdForCode.current);
      if (complete) void touchLearnerActivity();
    } catch {
      setReady(false);
    } finally {
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

  async function submit() {
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    try {
      if (mode === 'register') {
        const code = await generateLoginCode();
        holdForCode.current = true;
        await registerLearner(fullName, email, code);
        setPassword(code);
        setGeneratedCode(code);
        setRegistrationReady(true);
        setNotice('حساب شما ساخته شد. هیچ تأیید ایمیلی لازم نیست؛ کد را وارد کنید و مستقیم وارد اپ شوید.');
      } else {
        await loginLearner(email, password);
        await inspect();
      }
    } catch (reason) {
      holdForCode.current = false;
      setError(registrationError(reason));
    } finally {
      setBusy(false);
    }
  }

  if (BYPASS_GATE || ready || guest) return <>{children}</>;
  if (checking) return <View style={styles.loading}><ActivityIndicator size="large" color={Colors.primary[600]} /><Text style={styles.loadingText}>در حال بررسی حساب…</Text></View>;

  if (generatedCode) {
    return (
      <LoginCodeScreen
        code={generatedCode}
        actionLabel={registrationReady ? 'ورود مستقیم به اپ' : 'رفتن به صفحه ورود'}
        error={error}
        notice={notice}
        onAction={() => {
          if (!registrationReady) {
            holdForCode.current = false;
            setGeneratedCode('');
            setMode('login');
            return;
          }
          holdForCode.current = false;
          setGeneratedCode('');
          void inspect();
        }}
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
      code={password}
      onChangeCode={setPassword}
      onSubmit={() => void submit()}
      onGuest={() => setGuest(true)}
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
