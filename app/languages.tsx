import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { createAudioPlayer } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowRight, BookOpen, Headphones, LifeBuoy, LockKeyhole, MessageCircle } from 'lucide-react-native';
import { MiloLanguageBrand } from '@/components/MiloLanguageBrand';
import { LANGUAGES } from '@/lib/languages/catalog';
import { ensureSupportConversation } from '@/lib/conversations';
import { readableSupabaseError } from '@/lib/errors';
import { FEATURES, RUSSIAN_ONLY_BUILD } from '@/lib/features';
import { LtrDirection } from '@/lib/theme';

let welcomeVoicePlayed = false;

const languageFlags: Record<string, string> = {
  en: '🇬🇧',
  ru: '🇷🇺',
};

const learningSteps = [
  { icon: Headphones, title: 'بشنو', detail: 'بدون ترجمه، معنای جمله را دریاب.' },
  { icon: MessageCircle, title: 'تکرار کن', detail: 'پیشرفت ذخیره می‌شود.' },
  { icon: BookOpen, title: 'به‌خاطر بسپار', detail: 'آمادهٔ یادگیری.' },
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
        player.play();
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

  const languages = LANGUAGES.filter(language => (language.id === 'ru' ? FEATURES.russianCourse : !RUSSIAN_ONLY_BUILD));

  return (
    <View style={styles.root}>
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <LinearGradient
          colors={['#F5FAFF', '#EAF5FD', '#F8FBFF']}
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
                <LifeBuoy size={18} color="#2878DE" strokeWidth={1.9} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="تنظیم قفل برنامه"
                style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
                onPress={() => router.push('/app-lock' as never)}
              >
                <LockKeyhole size={18} color="#2878DE" strokeWidth={1.9} />
              </Pressable>
            </View>
            <MiloLanguageBrand />
          </View>

          <View style={[styles.hero, compact && styles.heroCompact]}>
            <Text accessibilityRole="header" style={[styles.title, tiny && styles.titleTiny]}>
              می‌خواهی کدام زبان را یاد بگیری؟
            </Text>
            <Text style={styles.subtitle}>
              برای ورود به دورهٔ جدید، یکی از زبان‌ها را انتخاب کن.
            </Text>
            <Text style={styles.eyebrow}>CHOOSE A LANGUAGE</Text>
          </View>

          <View style={styles.languageList}>
            {languages.map((language, index) => {
              const displayName = language.nativeName || language.name;
              const fallbackFlag = [...displayName.trim()][0] ?? language.id[0]?.toUpperCase() ?? '•';
              const flag = languageFlags[language.id] ?? fallbackFlag;
              const tone = index % 2 === 0 ? styles.languageFlagBlue : styles.languageFlagAqua;

              return (
                <Pressable
                  key={language.id}
                  accessibilityRole="button"
                  accessibilityLabel={`ورود به زبان ${language.name}`}
                  accessibilityHint="برای بازکردن دورهٔ این زبان انتخاب کنید"
                  onPress={() => router.push(language.home as never)}
                  style={({ pressed }) => [styles.languageCard, LtrDirection, pressed && styles.pressed]}
                >
                  <View style={[styles.flagCircle, tone]}>
                    <Text style={styles.flagText}>{flag}</Text>
                  </View>
                  <View style={styles.languageCopy}>
                    <Text style={styles.languageCode}>{language.id.toUpperCase()}</Text>
                    <Text numberOfLines={1} style={styles.languageNativeName}>{displayName}</Text>
                  </View>
                  <View style={styles.languageArrow}>
                    <ArrowRight size={20} color="#2878DE" strokeWidth={2.1} />
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
                    <Icon size={24} color={index === 1 ? '#16A9C1' : '#2878DE'} strokeWidth={1.9} />
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
  root: { flex: 1, backgroundColor: '#F5FAFF' },
  scrollContent: { flexGrow: 1, paddingBottom: 32 },
  backgroundCloudTop: { position: 'absolute', width: 250, height: 250, borderRadius: 125, top: -132, left: -125, backgroundColor: 'rgba(93,169,239,0.08)' },
  backgroundCloudLeft: { position: 'absolute', width: 370, height: 370, borderRadius: 185, top: 260, left: -290, backgroundColor: 'rgba(108,194,238,0.09)' },
  backgroundCloudBottom: { position: 'absolute', width: 420, height: 420, borderRadius: 210, bottom: -275, right: -175, backgroundColor: 'rgba(58,131,221,0.07)' },
  backgroundArc: { position: 'absolute', width: 520, height: 520, borderRadius: 260, borderWidth: 22, borderColor: 'rgba(54,132,223,0.035)', top: 230, right: -445 },
  page: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 28, paddingTop: 20, gap: 20 },
  pageCompact: { paddingHorizontal: 18, paddingTop: 14, gap: 17 },
  header: { minHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerButton: { width: 40, height: 40, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.8)', borderWidth: 1, borderColor: '#DCEBFA', shadowColor: '#28609A', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  hero: { alignItems: 'flex-end', gap: 9, paddingTop: 20, paddingBottom: 3 },
  heroCompact: { paddingTop: 8, gap: 8 },
  title: { width: '100%', fontFamily: 'Vazir-Bold', color: '#102A56', fontSize: 30, lineHeight: 46, textAlign: 'right', writingDirection: 'rtl' },
  titleTiny: { fontSize: 26, lineHeight: 40 },
  subtitle: { width: '100%', fontFamily: 'Vazir', color: '#7185A3', fontSize: 14, lineHeight: 24, textAlign: 'right', writingDirection: 'rtl' },
  eyebrow: { alignSelf: 'center', marginTop: 12, fontFamily: 'Inter-ExtraBold', color: '#7290B4', fontSize: 10, lineHeight: 16, letterSpacing: 2.1, writingDirection: 'ltr' },
  languageList: { gap: 13 },
  languageCard: { width: '100%', minHeight: 91, borderRadius: 22, borderWidth: 1, borderColor: '#D4E7F8', paddingHorizontal: 15, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: 'rgba(255,255,255,0.87)', shadowColor: '#2B69A7', shadowOpacity: 0.065, shadowRadius: 13, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  flagCircle: { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.92)' },
  languageFlagBlue: { backgroundColor: '#E7F2FF' },
  languageFlagAqua: { backgroundColor: '#E5F9FC' },
  flagText: { fontSize: 38, lineHeight: 48, textAlign: 'center' },
  languageCopy: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center', gap: 1 },
  languageCode: { fontFamily: 'Inter-ExtraBold', color: '#102A56', fontSize: 17, lineHeight: 22, fontWeight: '800', letterSpacing: 1, writingDirection: 'ltr' },
  languageNativeName: { maxWidth: '100%', fontFamily: 'Inter', color: '#7185A3', fontSize: 14, lineHeight: 21, textAlign: 'center', writingDirection: 'ltr' },
  languageArrow: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(241,248,255,0.92)' },
  pathDivider: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, paddingVertical: 1, marginTop: 1 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#D6E6F5' },
  dividerOrnament: { width: 42, height: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, transform: [{ rotate: '-12deg' }] },
  dividerDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#B9D7F3' },
  dividerDiamond: { width: 10, height: 10, borderWidth: 1.5, borderColor: '#9CCBF0', transform: [{ rotate: '45deg' }] },
  learningPath: { position: 'relative', gap: 4, paddingVertical: 4, paddingHorizontal: 8 },
  pathRail: { position: 'absolute', left: 18, top: 38, bottom: 38, width: 2, borderRadius: 1, backgroundColor: '#9AC8EE' },
  stepRow: { minHeight: 96, flexDirection: 'row', alignItems: 'center', gap: 14 },
  pathNodeWrap: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  pathNode: { width: 13, height: 13, borderRadius: 7, backgroundColor: '#2D83E8', borderWidth: 2, borderColor: '#F7FBFF' },
  pathNodeAqua: { backgroundColor: '#28C1D5' },
  stepIcon: { width: 66, height: 66, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.85)', borderWidth: 1, borderColor: '#DCEBFA', shadowColor: '#2775C4', shadowOpacity: 0.075, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  stepIconAqua: { backgroundColor: '#F0FCFE', borderColor: '#CDEFF4' },
  stepCopy: { flex: 1, minWidth: 0, alignItems: 'flex-end', gap: 3 },
  stepTitle: { fontFamily: 'Vazir-Bold', color: '#102A56', fontSize: 17, lineHeight: 26, textAlign: 'right', writingDirection: 'rtl' },
  stepDetail: { fontFamily: 'Vazir', color: '#7185A3', fontSize: 12, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
});
