import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { createAudioPlayer } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Headphones, LifeBuoy, LockKeyhole, Mic2, Sparkles, Target } from 'lucide-react-native';
import { MiloLanguageBrand } from '@/components/MiloLanguageBrand';
import { LANGUAGES } from '@/lib/languages/catalog';
import { ensureSupportConversation } from '@/lib/conversations';
import { readableSupabaseError } from '@/lib/errors';
import { FEATURES, RUSSIAN_ONLY_BUILD } from '@/lib/features';
import { toPersianDigits as fa } from '@/lib/format';

// The welcome voice plays once per app session, when the main language screen appears.
let welcomeVoicePlayed = false;

const languageTones = [
  { soft: '#E4EBE2', ink: '#315843', border: '#D4DED1' },
  { soft: '#F3E2D9', ink: '#A75D47', border: '#E8D0C5' },
  { soft: '#E6E5F0', ink: '#5B5B83', border: '#D7D5E6' },
  { soft: '#E8E8D9', ink: '#666B3D', border: '#DADCCB' },
] as const;

const learningSteps = [
  { number: '01', icon: Headphones, title: 'گوش بده', detail: 'جمله‌ها را با صدای طبیعی دنبال کن.' },
  { number: '02', icon: Mic2, title: 'تمرین کن', detail: 'با تکرار کوتاه، زبان را به‌کار بگیر.' },
  { number: '03', icon: Target, title: 'ادامه بده', detail: 'قدم‌به‌قدم مسیرت را جلو ببر.' },
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
    // Start after the intro chime has fully finished, so the two never overlap.
    const start = setTimeout(() => {
      try {
        const player = createAudioPlayer(require('../assets/audio/welcome-voice.wav'));
        player.volume = 0.9;
        player.play();
        setTimeout(() => player.remove(), 4000);
      } catch {
        // Devices without audio playback still show the screen normally.
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
          colors={['#F5F1E8', '#ECEDE4', '#F8F5ED']}
          start={{ x: 0.95, y: 0 }}
          end={{ x: 0.05, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.backgroundOrbTop} />
        <View style={styles.backgroundOrbBottom} />
        <View style={styles.backgroundArc} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.page, compact && styles.pageCompact]}>
          <View style={styles.header}>
            <MiloLanguageBrand />
            <View style={styles.headerActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="گفتگو با پشتیبانی"
                accessibilityState={{ disabled: openingSupport }}
                disabled={openingSupport}
                style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
                onPress={openSupport}
              >
                <LifeBuoy size={18} color="#315843" strokeWidth={1.9} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="تنظیم قفل برنامه"
                style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
                onPress={() => router.push('/app-lock' as never)}
              >
                <LockKeyhole size={18} color="#315843" strokeWidth={1.9} />
              </Pressable>
            </View>
          </View>

          <View style={[styles.intro, compact && styles.introCompact]}>
            <View style={styles.introKicker}>
              <View style={styles.introKickerLine} />
              <Text style={styles.introKickerText}>شروع یک مسیر تازه</Text>
            </View>
            <Text accessibilityRole="header" style={[styles.title, tiny && styles.titleTiny]}>
              زبان تازه‌ات را انتخاب کن
            </Text>
            <Text style={styles.subtitle}>
              یک انتخاب ساده؛ آغاز مسیری پیوسته برای یادگیری.
            </Text>
          </View>

          <View style={styles.languageSection}>
            <View style={styles.sectionHeading}>
              <View style={styles.sectionHeadingCopy}>
                <Text style={styles.sectionTitle}>زبان‌های موجود</Text>
                <Text style={styles.sectionDetail}>برای ادامه، یک زبان را انتخاب کن.</Text>
              </View>
              <View style={styles.sectionMark}>
                <Sparkles size={16} color="#B86C50" strokeWidth={1.8} />
              </View>
            </View>

            <View style={styles.languageList}>
              {languages.map((language, index) => {
                const tone = languageTones[index % languageTones.length];
                const displayName = language.nativeName || language.name;
                const glyph = [...displayName.trim()][0] ?? language.id[0]?.toUpperCase() ?? '•';
                const code = language.id.slice(0, 2).toUpperCase();

                return (
                  <Pressable
                    key={language.id}
                    accessibilityRole="button"
                    accessibilityLabel={`ورود به زبان ${language.name}`}
                    accessibilityHint="برای بازکردن دورهٔ این زبان انتخاب کنید"
                    onPress={() => router.push(language.home as never)}
                    style={({ pressed }) => [
                      styles.languageCard,
                      { borderColor: tone.border },
                      pressed && styles.pressed,
                    ]}
                  >
                    <View style={styles.languageCardIdentity}>
                      <View style={[styles.languageGlyph, { backgroundColor: tone.soft }]}>
                        <Text style={[styles.languageGlyphText, { color: tone.ink }]}>{glyph}</Text>
                      </View>
                      <View style={styles.languageCopy}>
                        <Text numberOfLines={1} style={styles.languageNativeName}>{displayName}</Text>
                        <Text numberOfLines={1} style={styles.languageLocalName}>{language.name}</Text>
                      </View>
                    </View>
                    <View style={styles.languageCardAction}>
                      <Text style={styles.languageCode}>{code}</Text>
                      <ArrowLeft size={19} color="#315843" strokeWidth={2.1} />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.pathCard}>
            <View style={styles.pathHeader}>
              <View style={styles.pathHeaderIcon}>
                <Sparkles size={17} color="#A75D47" strokeWidth={1.8} />
              </View>
              <View style={styles.pathHeaderCopy}>
                <Text style={styles.pathEyebrow}>بعد از انتخاب زبان</Text>
                <Text style={styles.pathTitle}>مسیر یادگیری تو</Text>
              </View>
            </View>

            <View style={styles.stepsList}>
              {learningSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <View key={step.number} style={styles.stepRow}>
                    <View style={styles.timelineColumn}>
                      <View style={styles.stepNumberBadge}>
                        <Text style={styles.stepNumber}>{fa(step.number)}</Text>
                      </View>
                      {index < learningSteps.length - 1 ? <View style={styles.timelineConnector} /> : null}
                    </View>
                    <View style={styles.stepIcon}>
                      <Icon size={18} color="#315843" strokeWidth={1.8} />
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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F1E8' },
  scrollContent: { flexGrow: 1, paddingBottom: 34 },
  backgroundOrbTop: { position: 'absolute', width: 300, height: 300, borderRadius: 150, top: -150, right: -105, backgroundColor: 'rgba(185,108,80,0.10)' },
  backgroundOrbBottom: { position: 'absolute', width: 340, height: 340, borderRadius: 170, bottom: -205, left: -145, backgroundColor: 'rgba(49,88,67,0.08)' },
  backgroundArc: { position: 'absolute', width: 410, height: 410, borderRadius: 205, borderWidth: 1, borderColor: 'rgba(49,88,67,0.09)', top: 270, left: -330 },
  page: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 28, paddingTop: 20, gap: 26 },
  pageCompact: { paddingHorizontal: 18, paddingTop: 14, gap: 22 },
  header: { minHeight: 48, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  headerActions: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  headerButton: { width: 40, height: 40, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,253,248,0.86)', borderWidth: 1, borderColor: '#E1DED3', shadowColor: '#293C32', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  intro: { alignItems: 'flex-end', gap: 10, paddingTop: 12, paddingBottom: 2 },
  introCompact: { paddingTop: 5, gap: 8 },
  introKicker: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  introKickerLine: { width: 28, height: 2, borderRadius: 1, backgroundColor: '#B86C50' },
  introKickerText: { fontFamily: 'Vazir-Medium', color: '#A75D47', fontSize: 12, writingDirection: 'rtl' },
  title: { fontFamily: 'Vazir-Bold', color: '#203B31', fontSize: 31, lineHeight: 46, textAlign: 'right', writingDirection: 'rtl' },
  titleTiny: { fontSize: 27, lineHeight: 40 },
  subtitle: { maxWidth: 600, fontFamily: 'Vazir', color: '#68746A', fontSize: 14, lineHeight: 25, textAlign: 'right', writingDirection: 'rtl' },
  languageSection: { gap: 14 },
  sectionHeading: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingHorizontal: 2 },
  sectionHeadingCopy: { alignItems: 'flex-end', gap: 2 },
  sectionTitle: { fontFamily: 'Vazir-Bold', color: '#203B31', fontSize: 17, lineHeight: 26, writingDirection: 'rtl' },
  sectionDetail: { fontFamily: 'Vazir', color: '#7B837A', fontSize: 11, lineHeight: 18, writingDirection: 'rtl' },
  sectionMark: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3E3DB' },
  languageList: { gap: 11 },
  languageCard: { width: '100%', minHeight: 88, borderRadius: 21, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 13, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,253,248,0.92)', shadowColor: '#263D32', shadowOpacity: 0.055, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  languageCardIdentity: { flex: 1, minWidth: 0, flexDirection: 'row-reverse', alignItems: 'center', gap: 13 },
  languageGlyph: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  languageGlyphText: { fontFamily: 'Inter-ExtraBold', fontSize: 24, lineHeight: 30, fontWeight: '800', writingDirection: 'ltr' },
  languageCopy: { flex: 1, minWidth: 0, alignItems: 'flex-end', gap: 2 },
  languageNativeName: { maxWidth: '100%', fontFamily: 'Inter-ExtraBold', color: '#203B31', fontSize: 17, lineHeight: 24, fontWeight: '800', textAlign: 'right', writingDirection: 'ltr' },
  languageLocalName: { fontFamily: 'Vazir', color: '#7B837A', fontSize: 11, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  languageCardAction: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, marginLeft: 9 },
  languageCode: { minWidth: 34, borderRadius: 9, overflow: 'hidden', paddingHorizontal: 7, paddingVertical: 4, backgroundColor: '#F1EEE5', color: '#6C756A', fontFamily: 'Inter-ExtraBold', fontSize: 9, lineHeight: 13, fontWeight: '800', letterSpacing: 0.7, textAlign: 'center', writingDirection: 'ltr' },
  pathCard: { borderRadius: 24, paddingHorizontal: 21, paddingVertical: 21, gap: 20, backgroundColor: 'rgba(255,253,248,0.74)', borderWidth: 1, borderColor: '#E4E0D5', shadowColor: '#263D32', shadowOpacity: 0.045, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 1 },
  pathHeader: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  pathHeaderIcon: { width: 39, height: 39, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3E3DB' },
  pathHeaderCopy: { alignItems: 'flex-end', gap: 1 },
  pathEyebrow: { fontFamily: 'Vazir', color: '#A75D47', fontSize: 10, lineHeight: 16, writingDirection: 'rtl' },
  pathTitle: { fontFamily: 'Vazir-Bold', color: '#203B31', fontSize: 18, lineHeight: 27, writingDirection: 'rtl' },
  stepsList: { gap: 0 },
  stepRow: { minHeight: 78, flexDirection: 'row-reverse', alignItems: 'stretch', gap: 12 },
  timelineColumn: { width: 25, alignItems: 'center' },
  stepNumberBadge: { width: 23, height: 23, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E4EBE2', zIndex: 1 },
  stepNumber: { fontFamily: 'Vazir-Black', color: '#315843', fontSize: 9, lineHeight: 13, writingDirection: 'rtl' },
  timelineConnector: { flex: 1, width: 2, minHeight: 42, marginTop: 4, marginBottom: 2, borderRadius: 1, backgroundColor: '#D9DFD4' },
  stepIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1EEE5', borderWidth: 1, borderColor: '#E5E0D5' },
  stepCopy: { flex: 1, minWidth: 0, alignItems: 'flex-end', justifyContent: 'flex-start', paddingTop: 1, paddingBottom: 15, gap: 2 },
  stepTitle: { fontFamily: 'Vazir-Bold', color: '#203B31', fontSize: 14, lineHeight: 22, textAlign: 'right', writingDirection: 'rtl' },
  stepDetail: { fontFamily: 'Vazir', color: '#737C72', fontSize: 11, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
});
