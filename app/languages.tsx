import { useEffect, useState } from 'react';
import { Alert, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { createAudioPlayer } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowRight, BookOpen, Headphones, LifeBuoy, LockKeyhole, MessageCircle } from 'lucide-react-native';
import { MiloLanguageBrand } from '@/components/MiloLanguageBrand';
import { LANGUAGES } from '@/lib/languages/catalog';
import { ensureSupportConversation } from '@/lib/conversations';
import { readableSupabaseError } from '@/lib/errors';
import { FEATURES, LANGUAGE_SCOPE, RUSSIAN_ONLY_BUILD } from '@/lib/features';
import { LtrDirection } from '@/lib/theme';

const palette = {
  canvas: '#F7F2E8',
  paper: '#FFFCF6',
  ink: '#26382D',
  forest: '#31533B',
  sage: '#E8EBDD',
  sageLine: '#D7DECE',
  muted: '#746E63',
  terracotta: '#B86F51',
  terracottaSoft: '#F4E2D6',
  border: '#E6DDCE',
};

let welcomeVoicePlayed = false;

const languageArtwork: Record<string, number> = {
  en: require('../assets/images/language-en-watercolor.jpg'),
  ru: require('../assets/images/language-ru-watercolor.jpg'),
  tr: require('../assets/images/language-tr-watercolor.jpg'),
  de: require('../assets/images/language-de-watercolor.jpg'),
  fr: require('../assets/images/language-fr-watercolor.jpg'),
  es: require('../assets/images/language-es-watercolor.jpg'),
};

const learningSteps = [
  { icon: Headphones, title: 'گوش بده', detail: 'در موقعیت‌های واقعی' },
  { icon: MessageCircle, title: 'پاسخ بده', detail: 'با جمله‌های کوتاه' },
  { icon: BookOpen, title: 'مرور کن', detail: 'هر روز کمی بیشتر' },
] as const;

export default function LanguagesHome() {
  const router = useRouter();
  const [openingSupport, setOpeningSupport] = useState(false);
  const { width } = useWindowDimensions();
  const compact = width < 680;
  const tiny = width < 370;

  useEffect(() => {
    if (welcomeVoicePlayed) return;
    welcomeVoicePlayed = true;
    const start = setTimeout(() => {
      try {
        const player = createAudioPlayer(require('../assets/audio/welcome-voice.wav'));
        player.volume = 0.9;
        const playback = player.play() as unknown;
        if (playback && typeof (playback as Promise<unknown>).catch === 'function') {
          (playback as Promise<unknown>).catch(() => undefined);
        }
        setTimeout(() => player.remove(), 4000);
      } catch {
        // The screen remains usable when audio playback is unavailable.
      }
    }, 400);
    void start;
  }, []);

  const openSupport = () => {
    if (openingSupport) return;
    setOpeningSupport(true);
    ensureSupportConversation()
      .then((conversationId) => router.push({ pathname: '/conversations/human/[conversationId]', params: { conversationId, name: 'پشتیبانی Milo' } } as never))
      .catch((cause) => Alert.alert('پشتیبانی', readableSupabaseError(cause)))
      .finally(() => setOpeningSupport(false));
  };

  const languages = LANGUAGES.filter(language => LANGUAGE_SCOPE.includes(language.id)
    && (language.id !== 'ru' || FEATURES.russianCourse)
    && (!RUSSIAN_ONLY_BUILD || language.id === 'ru'));

  return (
    <View style={styles.root}>
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <LinearGradient
          colors={['#F7F2E8', '#F4EFE3', '#FBF8F1']}
          start={{ x: 0.95, y: 0 }}
          end={{ x: 0.05, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.backgroundCloudTop} />
        <View style={styles.backgroundCloudLeft} />
        <View style={styles.backgroundCloudBottom} />
        <View style={styles.backgroundArc} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.page, compact && styles.pageCompact]}>
          <View style={styles.header}>
            <View style={styles.headerActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="گفتگو با پشتیبانی"
                accessibilityState={{ disabled: openingSupport }}
                disabled={openingSupport}
                style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
                onPress={openSupport}
              >
                <LifeBuoy size={18} color={palette.forest} strokeWidth={1.9} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="تنظیم قفل برنامه"
                style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
                onPress={() => router.push('/app-lock' as never)}
              >
                <LockKeyhole size={18} color={palette.forest} strokeWidth={1.9} />
              </Pressable>
            </View>
            <MiloLanguageBrand />
          </View>

          <ImageBackground
            source={require('../assets/images/language-hero-journal.jpg')}
            imageStyle={styles.heroImage}
            style={[styles.hero, compact && styles.heroCompact]}
            resizeMode="cover"
          >
            <LinearGradient
              pointerEvents="none"
              colors={['rgba(247,242,232,0.98)', 'rgba(247,242,232,0.90)', 'rgba(247,242,232,0.12)']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.heroCopy}>
              <Text accessibilityRole="header" style={[styles.title, tiny && styles.titleTiny]}>
                زبان را از زندگی یاد بگیر
              </Text>
              <Text style={styles.subtitle}>
                کوتاه، شنیدنی، ماندگار
              </Text>
              <Text style={styles.eyebrow}>LEARN THROUGH LIFE</Text>
            </View>
          </ImageBackground>

          <View style={[styles.languageList, languages.length > 3 && styles.languageListWrap]}>
            {languages.map((language) => {
              const displayName = language.nativeName || language.name;
              const artwork = languageArtwork[language.id] ?? languageArtwork.en;

              return (
                <Pressable
                  key={language.id}
                  accessibilityRole="button"
                  accessibilityLabel={`ورود به زبان ${language.name}`}
                  accessibilityHint="برای بازکردن دورهٔ این زبان انتخاب کنید"
                  onPress={() => router.push(language.home as never)}
                  style={({ pressed }) => [styles.languageCard, languages.length > 3 && styles.languageCardWrap, pressed && styles.pressed]}
                >
                  <ImageBackground
                    source={artwork}
                    imageStyle={styles.languageArtImage}
                    style={styles.languageArt}
                    resizeMode="cover"
                  >
                    <View style={styles.languagePhotoTint} />
                  </ImageBackground>
                  <View style={styles.languageCopy}>
                    <Text numberOfLines={1} style={styles.languageNativeName}>{displayName}</Text>
                    <Text style={styles.languageCode}>{language.id.toUpperCase()}</Text>
                    {(language.id === 'de' || language.id === 'fr' || language.id === 'es') && <Text style={styles.sampleLabel}>شروع از صفر</Text>}
                  </View>
                  <View style={styles.languageArrow}>
                    <ArrowRight size={18} color={palette.forest} strokeWidth={2.1} />
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.pathDivider}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerOrnament}>
              <View style={styles.dividerDot} />
              <View style={styles.dividerDiamond} />
              <View style={styles.dividerDot} />
            </View>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.learningPath}>
            <View pointerEvents="none" style={styles.pathRail} />
            {learningSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <View key={step.title} style={[styles.stepRow, LtrDirection]}>
                  <View style={styles.pathNodeWrap}>
                    <View style={[styles.pathNode, index === 1 && styles.pathNodeAqua]} />
                  </View>
                  <View style={[styles.stepIcon, index === 1 && styles.stepIconAqua]}>
                    <Icon size={24} color={index === 1 ? palette.terracotta : palette.forest} strokeWidth={1.9} />
                  </View>
                  <View style={styles.stepCopy}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDetail}>{step.detail}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.canvas, overflow: 'hidden' },
  scrollContent: { flexGrow: 1, paddingBottom: 32 },
  backgroundCloudTop: { position: 'absolute', width: 250, height: 250, borderRadius: 125, top: -132, left: -125, backgroundColor: 'rgba(185,111,81,0.045)' },
  backgroundCloudLeft: { position: 'absolute', width: 370, height: 370, borderRadius: 185, top: 260, left: -290, backgroundColor: 'rgba(90,117,82,0.045)' },
  backgroundCloudBottom: { position: 'absolute', width: 420, height: 420, borderRadius: 210, bottom: -275, right: -175, backgroundColor: 'rgba(185,111,81,0.035)' },
  backgroundArc: { position: 'absolute', width: 520, height: 520, borderRadius: 260, borderWidth: 22, borderColor: 'rgba(68,91,59,0.025)', top: 230, right: -445 },
  page: { width: '100%', maxWidth: 880, alignSelf: 'center', paddingHorizontal: 24, paddingTop: 24, gap: 24 },
  pageCompact: { paddingHorizontal: 18, paddingTop: 14, gap: 17 },
  header: { minHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerButton: { width: 44, height: 44, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.paper, borderWidth: 1, borderColor: palette.border, shadowColor: '#554C3E', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  hero: { minHeight: 230, justifyContent: 'center', padding: 24, borderRadius: 24, overflow: 'hidden', backgroundColor: '#ECE4D4', shadowColor: '#514433', shadowOpacity: 0.10, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
  heroImage: { borderRadius: 24 },
  heroCompact: { minHeight: 188, padding: 19 },
  heroCopy: { width: '78%', alignItems: 'flex-start', gap: 8 },
  title: { width: '100%', fontFamily: 'Beiruti-Bold', color: palette.ink, fontSize: 30, lineHeight: 46, textAlign: 'left', writingDirection: 'rtl' },
  titleTiny: { fontSize: 25, lineHeight: 38 },
  subtitle: { width: '100%', fontFamily: 'Beiruti', color: '#5B6257', fontSize: 15, lineHeight: 25, textAlign: 'left', writingDirection: 'rtl' },
  eyebrow: { alignSelf: 'flex-start', marginTop: 5, fontFamily: 'Inter-ExtraBold', color: palette.forest, fontSize: 9, lineHeight: 15, letterSpacing: 1.7, writingDirection: 'ltr' },
  languageList: { flexDirection: 'row', alignItems: 'stretch', gap: 12 },
  languageListWrap: { flexWrap: 'wrap' },
  languageCardWrap: { flexBasis: '46%', flexGrow: 1, flexShrink: 0 },
  languageCard: { flex: 1, minWidth: 0, borderRadius: 19, overflow: 'hidden', borderWidth: 1, borderColor: palette.border, paddingBottom: 12, alignItems: 'center', backgroundColor: palette.paper, shadowColor: '#514433', shadowOpacity: 0.07, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  languageArt: { width: '100%', height: 156, justifyContent: 'flex-end', backgroundColor: '#EAE2D4' },
  languageArtImage: { borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  languagePhotoTint: { height: 28, width: '100%', backgroundColor: 'rgba(247,242,232,0.18)' },
  languageCopy: { width: '100%', alignItems: 'center', justifyContent: 'center', gap: 2, paddingHorizontal: 5, paddingTop: 9 },
  languageNativeName: { maxWidth: '100%', fontFamily: 'Inter-SemiBold', color: palette.ink, fontSize: 14, lineHeight: 20, fontWeight: '600', textAlign: 'center', writingDirection: 'ltr' },
  sampleLabel: { fontFamily: 'Beiruti', color: palette.muted, fontSize: 11, textAlign: 'center' },
  languageCode: { fontFamily: 'Inter-ExtraBold', color: palette.muted, fontSize: 10, lineHeight: 14, letterSpacing: 1.2, writingDirection: 'ltr' },
  languageArrow: { width: 32, height: 32, marginTop: 7, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.sage },
  pathDivider: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14, paddingVertical: 1, marginTop: 1 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#DCD5C6' },
  dividerOrnament: { width: 42, height: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, transform: [{ rotate: '-12deg' }] },
  dividerDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#B5BDA7' },
  dividerDiamond: { width: 10, height: 10, borderWidth: 1.5, borderColor: palette.terracotta, transform: [{ rotate: '45deg' }] },
  learningPath: { position: 'relative', gap: 4, padding: 17, borderRadius: 22, backgroundColor: palette.paper, borderWidth: 1, borderColor: palette.border, shadowColor: '#514433', shadowOpacity: 0.045, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  pathRail: { position: 'absolute', left: 18, top: 35, bottom: 35, width: 2, borderRadius: 1, backgroundColor: '#D4DCCB' },
  stepRow: { minHeight: 84, flexDirection: 'row', alignItems: 'center', gap: 14 },
  pathNodeWrap: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  pathNode: { width: 13, height: 13, borderRadius: 7, backgroundColor: palette.forest, borderWidth: 2, borderColor: palette.paper },
  pathNodeAqua: { backgroundColor: palette.terracotta },
  stepIcon: { width: 60, height: 60, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F1E8', borderWidth: 1, borderColor: palette.sageLine, shadowColor: '#514433', shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  stepIconAqua: { backgroundColor: palette.terracottaSoft, borderColor: '#EAD0C1' },
  stepCopy: { flex: 1, minWidth: 0, alignItems: 'flex-end', gap: 3 },
  stepTitle: { fontFamily: 'Beiruti-Bold', color: palette.ink, fontSize: 17, lineHeight: 26, textAlign: 'right', writingDirection: 'rtl' },
  stepDetail: { fontFamily: 'Beiruti', color: palette.muted, fontSize: 12, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  pressed: { opacity: 0.84, transform: [{ scale: 0.985 }] },
});
