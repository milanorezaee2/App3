import { useEffect, useState } from 'react';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import Constants from 'expo-constants';
import { I18nManager, Image, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { MiloLogoMotion } from '@/components/MiloLogoMotion';
import { KeyboardProvider } from '@/components/KeyboardRuntime';
import { createAudioPlayer } from 'expo-audio';
// Imported from per-weight subpaths on purpose: the package root `require()`s
// every weight at load time, so Metro bundled all 27 font files (7.0 MB) even
// though only these 7 are used. Subpath imports keep only these (1.5 MB).
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_800ExtraBold } from '@expo-google-fonts/inter/800ExtraBold';
import { Beiruti_400Regular } from '@expo-google-fonts/beiruti/400Regular';
import { Beiruti_500Medium } from '@expo-google-fonts/beiruti/500Medium';
import { Beiruti_700Bold } from '@expo-google-fonts/beiruti/700Bold';
import { Beiruti_900Black } from '@expo-google-fonts/beiruti/900Black';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AppLockGate } from '@/components/AppLockGate';
import { WebStatusBarSpacer } from '@/components/WebStatusBarSpacer';
import { ChatNotificationBridge } from '@/components/ChatNotificationBridge';
import { AppResumeGuard } from '@/components/AppResumeGuard';
import { RegistrationGate } from '@/components/RegistrationGate';
import { getPairingState, isOnboardingComplete } from '@/lib/storage';
import { isSupabaseConfigured } from '@/lib/pairing';
import { DesignTokens, RtlDirection } from '@/lib/theme';
import { useRealAgent } from '@/lib/useRealAgent';
import { warmSpeech } from '@/lib/responsiveSpeech';
import { DesignVariantStyles } from '@/components/DesignVariantStyles';

// Android native mirroring is disabled in withStableLayoutDirection. Persian
// and course-language direction are applied explicitly, independent of device locale.
I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

// Keep typography metrics deterministic across OEM Android builds and user font
// scale settings. Accessibility labels remain available to screen readers.
type StableFontDefaults = { defaultProps?: Record<string, unknown> };
const stableText = Text as typeof Text & StableFontDefaults;
const stableInput = TextInput as typeof TextInput & StableFontDefaults;
stableText.defaultProps = {
  ...stableText.defaultProps,
  allowFontScaling: false,
  maxFontSizeMultiplier: 1,
  includeFontPadding: false,
  textBreakStrategy: 'simple',
  android_hyphenationFrequency: 'none',
};
stableInput.defaultProps = {
  ...stableInput.defaultProps,
  allowFontScaling: false,
  maxFontSizeMultiplier: 1,
  includeFontPadding: false,
};

SplashScreen.preventAutoHideAsync();

let startupChimePlayed = false;
const IS_ADMIN_APP = Constants.expoConfig?.extra?.appRole === 'admin'
  || process.env.EXPO_PUBLIC_MILO_ADMIN_APP === 'true';

function RuntimeGate() {
  const pathname = usePathname();
  // The multi-language learning app never mounts the legacy device runtime.
  if (!pathname.startsWith('/agent') && !pathname.startsWith('/permissions')) return null;
  return <CompanionRuntime />;
}

function CompanionRuntime() {
  const pathname = usePathname();
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    Promise.all([getPairingState(), isOnboardingComplete()])
      .then(([pairing, complete]) => {
        setDeviceId(pairing?.deviceId ?? null);
        setEnabled(!!pairing && complete && isSupabaseConfigured());
      })
      .catch(() => {
        setDeviceId(null);
        setEnabled(false);
      });
  }, [pathname]);

  // Runs invisibly while the user studies: heartbeat, device status and
  // supported commands continue without exposing a complicated control UI.
  useRealAgent(deviceId, enabled);
  return null;
}

/**
 * Phone-2 companion only. There is no role chooser and no controller route in
 * this APK; it always boots into the companion connection screen.
 */
export default function RootLayout() {
  useFrameworkReady();
  const [introComplete, setIntroComplete] = useState(Platform.OS === 'web');
  const [fontsLoaded, fontError] = useFonts({
    // Bundle Beiruti locally so Persian typography and numerals stay identical
    // offline and independent of each Android manufacturer's system fonts.
    // The default Persian face is medium for legibility; headings and key
    // actions can still use the separately registered bold/black faces.
    Beiruti: Beiruti_500Medium,
    'Beiruti-Medium': Beiruti_500Medium,
    'Beiruti-Bold': Beiruti_700Bold,
    'Beiruti-Black': Beiruti_900Black,
    // Latin teaching content uses bundled faces too, eliminating Android OEM
    // font and fallback-metric differences between phones.
    Inter: Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-ExtraBold': Inter_800ExtraBold,
    // Legacy aliases resolve to Beiruti, preventing an old screen from
    // silently falling back to an OEM font.
    Lalezar: Beiruti_400Regular,
  });

  useEffect(() => {
    if (!fontsLoaded && !fontError) return;
    void SplashScreen.hideAsync();

    if (Platform.OS === 'web') {
      setIntroComplete(true);
      return;
    }
    if (startupChimePlayed) {
      setIntroComplete(true);
      return;
    }

    // Keep the full MiloMultiLanguage identity visible through its complete
    // animation before revealing the first screen; no startup state is reset.
    startupChimePlayed = true;
    let player: ReturnType<typeof createAudioPlayer> | null = null;
    try {
      player = createAudioPlayer(require('../assets/audio/welcome-chime.wav'));
      player.volume = 0.28;
      const playback = player.play() as unknown;
      if (playback && typeof (playback as Promise<unknown>).catch === 'function') {
        (playback as Promise<unknown>).catch(() => undefined);
      }
    } catch {
      // A device without playback support still receives the same visual intro.
    }
    const finish = setTimeout(() => {
      player?.remove();
      setIntroComplete(true);
      warmSpeech('en-US');
    }, 3400);
    return () => clearTimeout(finish);
  }, [fontsLoaded, fontError]);

  if (Platform.OS !== 'web' && !fontsLoaded && !fontError) return null;
  if (!introComplete) {
    return (
      <View style={introStyles.root}>
        <MiloLogoMotion size="intro" />
        <View style={introStyles.loader}><View style={introStyles.loaderFill} /></View>
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
      <ErrorBoundary>
        <SafeAreaView style={{ flex: 1, backgroundColor: DesignTokens.surface.canvas, ...RtlDirection }} edges={['top', 'bottom']}>
          {/* Web preview/browsers have no top inset: reserve the notch height so
              no header row is ever painted under the camera cut-out. */}
          <WebStatusBarSpacer />
          <DesignVariantStyles />
          <AppLockGate>
            <RegistrationGate>
              {!IS_ADMIN_APP && <RuntimeGate />}
              <Stack screenOptions={{ headerShown: false }} />
              <AppResumeGuard />
              <ChatNotificationBridge />
            </RegistrationGate>
          </AppLockGate>
          <StatusBar style="dark" />
        </SafeAreaView>
      </ErrorBoundary>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}

const introStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFF', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  image: { width: 280, height: 280, marginBottom: -12 },
  brand: { fontFamily: 'Inter-ExtraBold', color: '#211A68', fontSize: 24, lineHeight: 31, fontWeight: '800', letterSpacing: 5, writingDirection: 'ltr' },
  caption: { fontFamily: 'Inter-ExtraBold', color: '#6882A6', fontSize: 7, fontWeight: '800', letterSpacing: 2.1, writingDirection: 'ltr', marginTop: 2 },
  loader: { width: 92, height: 3, borderRadius: 99, overflow: 'hidden', backgroundColor: '#E3E7F3', marginTop: 24 },
  loaderFill: { width: '100%', height: '100%', borderRadius: 99, backgroundColor: '#635BFF' },
});
