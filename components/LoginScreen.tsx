import { MiloGlobeHeadphoneMark } from '@/components/MiloBrandMark';
import { LocalizedText as Text, LocalizedTextInput as TextInput } from '@/components/LocalizedText';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ImageBackground, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react-native';
import { KeyboardAwareScrollView, KeyboardAvoidingView } from '@/components/KeyboardRuntime';
import { Typography } from '@/lib/theme';

/**
 * Login / registration entry screen.
 *
 * Presentation only: RegistrationGate owns OTP requests, verification,
 * session state and profile completion.
 */

const HERO_STEPS = ['گوش بده', 'پاسخ بده', 'مرور کن'] as const;
const BRAND_GRADIENT: [string, string, string] = ['#31533B', '#4C6947', '#A9664C'];

export type LoginMode = 'login' | 'register';

type LoginScreenProps = {
  mode: LoginMode;
  onChangeMode: (mode: LoginMode) => void;
  fullName: string;
  onChangeFullName: (value: string) => void;
  email: string;
  onChangeEmail: (value: string) => void;
  onSubmit: () => void;
  busy: boolean;
  error: string;
  notice: string;
};

type LoginCodeScreenProps = {
  email: string;
  code: string;
  onChangeCode: (value: string) => void;
  onSubmit: () => void;
  onResend: () => void;
  onEditEmail: () => void;
  busy: boolean;
  error: string;
  notice: string;
};

type LoginProfileScreenProps = {
  email: string;
  fullName: string;
  onChangeFullName: (value: string) => void;
  onSubmit: () => void;
  busy: boolean;
  error: string;
  notice: string;
};

/* ------------------------------------------------------------------ hero */

function LoginHero({ wide }: { wide: boolean }) {
  return (
    <ImageBackground
      source={require('../assets/images/language-hero-journal.jpg')}
      imageStyle={styles.heroImage}
      resizeMode="cover"
      style={[styles.hero, wide && styles.heroWide]}
    >
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(247,242,232,0.94)', 'rgba(247,242,232,0.90)', 'rgba(247,242,232,0.70)']}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.heroGlow} pointerEvents="none" />
      <View style={styles.heroColumn}>
        <View style={styles.brand}>
          <View style={styles.brandMark}>
            <MiloGlobeHeadphoneMark size={48} />
          </View>
          <View style={styles.brandCopy}>
            <Text style={styles.brandName}>Milo</Text>
            <Text style={styles.brandCaption}>MULTILANGUAGE</Text>
          </View>
        </View>

        <Text accessibilityRole="header" style={styles.heroTitle}>
          هر روز، یک قدم{`\n`}به مکالمه نزدیک‌تر
        </Text>

        <View style={styles.heroSteps}>
          {HERO_STEPS.map(step => (
            <View key={step} style={styles.heroStep}>
              <Text style={styles.heroStepText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

/* --------------------------------------------------------------- scaffold */

function LoginScaffold({ children }: { children: ReactNode }) {
  const { width: windowWidth } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(0);
  const frameRef = useRef<View>(null);
  const layoutWidth = containerWidth || windowWidth;
  const wide = layoutWidth >= 900;
  const compact = layoutWidth < 390;

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const frame = frameRef.current as unknown as HTMLElement | null;
    if (!frame || typeof frame.getBoundingClientRect !== 'function') return;
    const measure = () => {
      const width = frame.getBoundingClientRect().width;
      if (width > 0) setContainerWidth(current => current === width ? current : width);
    };
    measure();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    observer?.observe(frame);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <KeyboardAvoidingView style={styles.page} behavior="height" enabled>
      <View ref={frameRef} style={styles.layoutFrame}>
        <KeyboardAwareScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, wide && styles.scrollContentWide]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          bottomOffset={24}
          extraKeyboardSpace={12}
        >
          <LoginHero wide={wide} />
          <View style={[styles.sheet, wide && styles.sheetWide, compact && styles.sheetCompact]}>
            <View style={[styles.sheetColumn, wide && styles.sheetColumnWide]}>{children}</View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ------------------------------------------------------------------ form */

export function LoginScreen({
  mode,
  onChangeMode,
  fullName,
  onChangeFullName,
  email,
  onChangeEmail,
  onSubmit,
  busy,
  error,
  notice,
}: LoginScreenProps) {
  const [focus, setFocus] = useState<'name' | 'email' | null>(null);
  const registering = mode === 'register';

  return (
    <LoginScaffold>
      <Text accessibilityRole="header" style={styles.title}>
        {registering ? 'ساخت حساب زبان‌آموز' : 'ورود به حساب'}
      </Text>
      <Text style={styles.subtitle}>
        {registering
          ? 'نام و ایمیل خود را وارد کنید؛ کد یک‌بارمصرف برای تأیید به ایمیل شما ارسال می‌شود.'
          : 'نشانی Gmail، Outlook/Microsoft یا ایمیل معتبر دیگری را وارد کنید تا کد ورود برایتان ارسال شود.'}
      </Text>

      <View style={styles.switcher}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: registering }}
          onPress={() => onChangeMode('register')}
          style={[styles.switchButton, registering && styles.switchActive]}
        >
          <Text style={[styles.switchText, registering && styles.switchTextActive]}>ثبت‌نام</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: !registering }}
          onPress={() => onChangeMode('login')}
          style={[styles.switchButton, !registering && styles.switchActive]}
        >
          <Text style={[styles.switchText, !registering && styles.switchTextActive]}>ورود</Text>
        </Pressable>
      </View>

      {registering ? (
        <>
          <Text style={styles.label}>نام و نام خانوادگی</Text>
          <View style={[styles.fieldRing, focus === 'name' && styles.fieldRingActive]}>
            <View style={styles.field}>
              <TextInput
                accessibilityLabel="نام و نام خانوادگی"
                value={fullName}
                onChangeText={onChangeFullName}
                onFocus={() => setFocus('name')}
                onBlur={() => setFocus(null)}
                style={styles.input}
                placeholder="مثلاً سارا احمدی"
                placeholderTextColor="#81796D"
                textAlign="right"
              />
              <View pointerEvents="none" style={styles.fieldIcon}>
                <UserRound size={16} color="#81796D" />
              </View>
            </View>
          </View>
        </>
      ) : null}

      <Text style={styles.label}>ایمیل</Text>
      <View style={[styles.fieldRing, focus === 'email' && styles.fieldRingActive]}>
        <View style={styles.field}>
          <TextInput
            accessibilityLabel="ایمیل حساب"
            value={email}
            onChangeText={onChangeEmail}
            onFocus={() => setFocus('email')}
            onBlur={() => setFocus(null)}
            style={[styles.input, styles.ltr]}
            placeholder="name@example.com"
            placeholderTextColor="#81796D"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <View pointerEvents="none" style={styles.fieldIcon}>
            <Mail size={16} color="#81796D" />
          </View>
        </View>
      </View>

      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      {notice ? <Text style={styles.notice}>{notice}</Text> : null}

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: busy, busy }}
        disabled={busy}
        onPress={onSubmit}
        style={({ pressed }) => [styles.cta, pressed && !busy && styles.ctaPressed, busy && styles.disabled]}
      >
        <LinearGradient
          colors={BRAND_GRADIENT}
          locations={[0, 0.5, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View pointerEvents="none" style={styles.ctaArrow}>
          <ArrowLeft size={17} color="#FFFFFF" strokeWidth={2.4} />
        </View>
        {busy
          ? <ActivityIndicator color="#FFFFFF" />
          : <Text style={styles.ctaText}>{registering ? 'ساخت حساب و ارسال کد' : 'ارسال کد ورود به ایمیل'}</Text>}
      </Pressable>

      <View style={styles.privacy}>
        <ShieldCheck size={16} color="#31533B" />
        <Text style={styles.privacyText}>
          مدیریت فقط اطلاعات حساب، وضعیت فعالیت و پیشرفت آموزشی را می‌بیند؛ پیام‌های خصوصی نمایش داده نمی‌شوند.
        </Text>
      </View>
    </LoginScaffold>
  );
}

/* ------------------------------------------------------------ email OTP */

export function LoginCodeScreen({ email, code, onChangeCode, onSubmit, onResend, onEditEmail, busy, error, notice }: LoginCodeScreenProps) {
  const [focus, setFocus] = useState(false);
  return (
    <LoginScaffold>
      <Text accessibilityRole="header" style={styles.title}>کد ایمیل را وارد کنید</Text>
      <Text style={styles.subtitle}>کد ۶ رقمی یک‌بارمصرف به {email} ارسال شد. پوشهٔ هرزنامه را هم بررسی کنید.</Text>
      <Text style={styles.label}>کد یک‌بارمصرف</Text>
      <View style={[styles.fieldRing, focus && styles.fieldRingActive]}>
        <View style={styles.field}>
          <TextInput
            accessibilityLabel="کد یک‌بارمصرف ایمیل"
            value={code}
            onChangeText={onChangeCode}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            style={[styles.input, styles.codeInput, styles.otpInput]}
            placeholder="کد ۶ رقمی"
            placeholderTextColor="#81796D"
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            maxLength={6}
            onSubmitEditing={onSubmit}
          />
          <View pointerEvents="none" style={styles.fieldIcon}>
            <LockKeyhole size={16} color="#81796D" />
          </View>
        </View>
      </View>

      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      {notice ? <Text style={styles.notice}>{notice}</Text> : null}

      <Pressable
        accessibilityRole="button"
        disabled={busy}
        onPress={onSubmit}
        style={({ pressed }) => [styles.cta, pressed && !busy && styles.ctaPressed, busy && styles.disabled]}
      >
        <LinearGradient
          colors={BRAND_GRADIENT}
          locations={[0, 0.5, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View pointerEvents="none" style={styles.ctaArrow}>
          <ArrowLeft size={17} color="#FFFFFF" strokeWidth={2.4} />
        </View>
        {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.ctaText}>تأیید کد و ورود</Text>}
      </Pressable>

      <View style={styles.otpActions}>
        <Pressable accessibilityRole="button" disabled={busy} onPress={onResend} style={styles.otpLinkButton}>
          <Text style={styles.otpLinkText}>ارسال دوبارهٔ کد</Text>
        </Pressable>
        <Pressable accessibilityRole="button" disabled={busy} onPress={onEditEmail} style={styles.otpLinkButton}>
          <Text style={styles.otpLinkText}>ویرایش ایمیل</Text>
        </Pressable>
      </View>
    </LoginScaffold>
  );
}

export function LoginProfileScreen({ email, fullName, onChangeFullName, onSubmit, busy, error, notice }: LoginProfileScreenProps) {
  const [focus, setFocus] = useState(false);
  return (
    <LoginScaffold>
      <Text accessibilityRole="header" style={styles.title}>تکمیل حساب</Text>
      <Text style={styles.subtitle}>ایمیل {email} تأیید شد. برای ساخت پروفایل آموزشی، نام خود را وارد کنید.</Text>
      <Text style={styles.label}>نام و نام خانوادگی</Text>
      <View style={[styles.fieldRing, focus && styles.fieldRingActive]}>
        <View style={styles.field}>
          <TextInput
            accessibilityLabel="نام و نام خانوادگی"
            value={fullName}
            onChangeText={onChangeFullName}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            style={styles.input}
            placeholder="مثلاً سارا احمدی"
            placeholderTextColor="#81796D"
            textAlign="right"
            autoComplete="name"
          />
          <View pointerEvents="none" style={styles.fieldIcon}><UserRound size={16} color="#81796D" /></View>
        </View>
      </View>
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      {notice ? <Text style={styles.notice}>{notice}</Text> : null}
      <Pressable accessibilityRole="button" disabled={busy} onPress={onSubmit} style={({ pressed }) => [styles.cta, pressed && !busy && styles.ctaPressed, busy && styles.disabled]}>
        <LinearGradient colors={BRAND_GRADIENT} locations={[0, 0.5, 1]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={StyleSheet.absoluteFill} />
        {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.ctaText}>تکمیل پروفایل و ورود</Text>}
      </Pressable>
    </LoginScaffold>
  );
}

/* ---------------------------------------------------------------- styles */

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F7F2E8' },
  layoutFrame: { flex: 1, width: '100%', minWidth: 0 },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  scrollContentWide: { flexDirection: 'row', alignItems: 'stretch', width: '100%', minHeight: '100%' },

  hero: { paddingTop: 22, paddingBottom: 30, overflow: 'hidden', backgroundColor: '#EAE2D4' },
  heroImage: { opacity: 0.96 },
  heroWide: { flex: 0.9, justifyContent: 'center', minHeight: '100%', paddingVertical: 48 },
  heroGlow: {
    position: 'absolute',
    top: -70,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(184,111,81,0.12)',
  },
  heroColumn: { width: '100%', maxWidth: 430, alignSelf: 'center', paddingHorizontal: 22 },
  brand: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  brandMark: { width: 48, height: 48, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  brandCopy: { gap: 1 },
  brandName: {
    fontFamily: Typography.latinFontFamily,
    color: '#31533B',
    fontSize: 23,
    lineHeight: 27,
    letterSpacing: 1.7,
    writingDirection: 'ltr',
  },
  brandCaption: {
    fontFamily: Typography.latinFontFamily,
    color: '#746E63',
    fontSize: 6,
    lineHeight: 9,
    letterSpacing: 1.1,
    writingDirection: 'ltr',
  },
  heroTitle: {
    marginTop: 24,
    fontFamily: Typography.boldFontFamily,
    color: '#26382D',
    fontSize: 25,
    lineHeight: 37,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  heroSteps: { marginTop: 18, flexDirection: 'row-reverse', justifyContent: 'center', flexWrap: 'wrap', gap: 7 },
  heroStep: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(49,83,59,0.20)',
    backgroundColor: 'rgba(255,252,246,0.78)',
  },
  heroStepText: {
    fontFamily: Typography.mediumFontFamily,
    color: '#31533B',
    fontSize: 9.2,
    writingDirection: 'rtl',
  },

  sheet: {
    flexGrow: 1,
    backgroundColor: '#FFFCF6',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 26,
    shadowColor: '#514433',
    shadowOpacity: 0.12,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: -6 },
  },
  sheetWide: {
    flex: 1.1,
    flexGrow: 1,
    justifyContent: 'center',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: 36,
    paddingVertical: 40,
    shadowOffset: { width: -6, height: 0 },
  },
  sheetCompact: { paddingTop: 23, paddingHorizontal: 18, paddingBottom: 20 },
  sheetColumn: { width: '100%', maxWidth: 430, alignSelf: 'center' },
  sheetColumnWide: { maxWidth: 470 },

  title: {
    fontFamily: Typography.boldFontFamily,
    color: '#26382D',
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subtitle: {
    marginTop: 3,
    fontFamily: Typography.fontFamily,
    color: '#746E63',
    fontSize: 11.4,
    lineHeight: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  switcher: {
    marginTop: 15,
    flexDirection: 'row-reverse',
    backgroundColor: '#F1ECE1',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  switchButton: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 11 },
  switchActive: {
    backgroundColor: '#FFFCF6',
    shadowColor: '#514433',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  switchText: {
    fontFamily: Typography.fontFamily,
    color: '#81796D',
    fontSize: 12,
    writingDirection: 'rtl',
  },
  switchTextActive: { fontFamily: Typography.mediumFontFamily, color: '#31533B' },

  label: {
    marginTop: 16,
    marginBottom: 6,
    fontFamily: Typography.mediumFontFamily,
    color: '#4C5C49',
    fontSize: 10.4,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  fieldRing: { borderRadius: 18, padding: 3, backgroundColor: 'transparent' },
  fieldRingActive: { backgroundColor: 'rgba(49,83,59,0.10)' },
  field: {
    minHeight: 52,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#D9D1C2',
    backgroundColor: '#FBF8F1',
    justifyContent: 'center',
  },
  input: {
    minHeight: 50,
    paddingHorizontal: 46,
    paddingVertical: 0,
    fontFamily: Typography.mediumFontFamily,
    fontSize: 13.5,
    color: '#26382D',
    writingDirection: 'rtl',
  },
  ltr: { fontFamily: Typography.latinFontFamily, textAlign: 'right', writingDirection: 'ltr', fontSize: 12.6 },
  codeInput: { fontFamily: Typography.numberFontFamily, letterSpacing: 3, fontSize: 14.5 },
  otpInput: { textAlign: 'center', writingDirection: 'ltr' },
  fieldIcon: { position: 'absolute', left: 16, top: 0, bottom: 0, justifyContent: 'center' },
  otpActions: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  otpLinkButton: { paddingHorizontal: 6, paddingVertical: 8 },
  otpLinkText: { fontFamily: Typography.mediumFontFamily, color: '#31533B', fontSize: 11, writingDirection: 'rtl' },

  error: {
    marginTop: 12,
    fontFamily: Typography.fontFamily,
    color: '#A34E3B',
    backgroundColor: '#FAE9E3',
    borderRadius: 12,
    padding: 10,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  notice: {
    marginTop: 12,
    fontFamily: Typography.fontFamily,
    color: '#31533B',
    backgroundColor: '#E9EFE1',
    borderRadius: 12,
    padding: 10,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  cta: {
    marginTop: 18,
    minHeight: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#31533B',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 9 },
    elevation: 5,
  },
  ctaPressed: { opacity: 0.92, transform: [{ scale: 0.995 }] },
  ctaText: {
    fontFamily: Typography.boldFontFamily,
    color: '#FFFFFF',
    fontSize: 14,
    writingDirection: 'rtl',
  },
  ctaArrow: { position: 'absolute', left: 22, top: 0, bottom: 0, justifyContent: 'center' },
  disabled: { opacity: 0.55 },

  privacy: {
    marginTop: 8,
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#EEF0E5',
    borderRadius: 14,
    padding: 10,
  },
  privacyText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    color: '#4D5B47',
    fontSize: 9.5,
    lineHeight: 17,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  code: {
    marginTop: 18,
    fontFamily: Typography.numberFontFamily,
    fontSize: 34,
    lineHeight: 50,
    letterSpacing: 8,
    color: '#111111',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#718365',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 18,
    textAlign: 'center',
    writingDirection: 'ltr',
  },
});
