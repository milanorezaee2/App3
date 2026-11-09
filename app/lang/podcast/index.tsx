import { LocalizedText as Text } from '@/components/LocalizedText';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2, ChevronLeft, Headphones, Play, Podcast } from 'lucide-react-native';
import { MiloGlobeHeadphoneMark } from '@/components/MiloBrandMark';
import { PageNavigation } from '@/components/PageNavigation';
import { Typography } from '@/lib/theme';
import { toPersianDigits as fa } from '@/lib/format';
import { PODCAST_EPISODES, PODCAST_LEVELS, loadPodcastProgress, type PodcastProgress } from '@/lib/englishPodcast';

const P = { ink: '#191919', muted: '#6B675F', soft: '#F4F1EA', border: '#E8E3DA', accent: '#5146E5', accentSoft: '#E9E7FF', success: '#2E8B57', successSoft: '#E6F4EC', white: '#FFFFFF' };

export default function EnglishPodcastList() {
  const router = useRouter();
  const [progress, setProgress] = useState<PodcastProgress>({ episodes: {} });
  const [openLevel, setOpenLevel] = useState<number | null>(null);

  useFocusEffect(useCallback(() => {
    let active = true;
    loadPodcastProgress().then(state => {
      if (!active) return;
      setProgress(state);
      if (openLevel === null) {
        const last = state.lastEpisodeId ? PODCAST_EPISODES.find(episode => episode.id === state.lastEpisodeId) : undefined;
        setOpenLevel(last ? last.levelId : PODCAST_LEVELS[0]?.level.id ?? 0);
      }
    }).catch(() => undefined);
    return () => { active = false; };
  }, [openLevel]));

  const completedCount = Object.values(progress.episodes).filter(item => item.completed).length;
  const lastEpisode = progress.lastEpisodeId ? PODCAST_EPISODES.find(episode => episode.id === progress.lastEpisodeId) : undefined;
  const continueEpisode = lastEpisode && !progress.episodes[lastEpisode.id]?.completed ? lastEpisode : PODCAST_EPISODES.find(episode => !progress.episodes[episode.id]?.completed);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <View style={styles.brandRow}>
            <MiloGlobeHeadphoneMark size={48} />
            <PageNavigation backFallback="/lang" />
          </View>

          <LinearGradient colors={['#1E1B4B', '#312E81', '#4338CA']} start={{ x: .95, y: 0 }} end={{ x: .05, y: 1 }} style={styles.hero}>
            <View style={styles.heroIconWrap}><Podcast size={26} color={P.white} /></View>
            <Text style={styles.heroEyebrow}>MILO ENGLISH PODCAST</Text>
            <Text style={styles.heroTitle}>پادکست انگلیسی</Text>
            <Text style={styles.heroDesc}>هر درس یک اپیزود: ابتدا گوش کنید، سپس هر جمله یک‌بار آهسته تکرار می‌شود. متن انگلیسی و ترجمهٔ فارسی هم‌زمان نمایش داده می‌شود.</Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStat}><Text style={styles.heroStatValue}>{fa(PODCAST_EPISODES.length)}</Text><Text style={styles.heroStatLabel}>اپیزود</Text></View>
              <View style={styles.heroStat}><Text style={styles.heroStatValue}>{fa(completedCount)}</Text><Text style={styles.heroStatLabel}>شنیده‌شده</Text></View>
              <View style={styles.heroStat}><Text style={styles.heroStatValue}>{fa(PODCAST_LEVELS.length)}</Text><Text style={styles.heroStatLabel}>فصل</Text></View>
            </View>
            {continueEpisode ? (
              <Pressable accessibilityRole="button" accessibilityLabel={`ادامهٔ اپیزود ${continueEpisode.title}`} style={({ pressed }) => [styles.continueButton, pressed && styles.pressed]} onPress={() => router.push({ pathname: '/lang/podcast/[id]', params: { id: continueEpisode.id } } as never)}>
                <Play size={16} color={P.accent} fill={P.accent} />
                <Text style={styles.continueText} numberOfLines={1}>{progress.episodes[continueEpisode.id] ? 'ادامهٔ' : 'شروع'} اپیزود {fa(continueEpisode.number)} · {continueEpisode.title}</Text>
              </Pressable>
            ) : null}
          </LinearGradient>

          {PODCAST_LEVELS.map(({ level, episodes }) => {
            const done = episodes.filter(episode => progress.episodes[episode.id]?.completed).length;
            const open = openLevel === level.id;
            return (
              <View key={level.id} style={styles.levelCard}>
                <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} style={styles.levelHeader} onPress={() => setOpenLevel(open ? null : level.id)}>
                  <View style={[styles.levelDot, { backgroundColor: level.color }]} />
                  <View style={styles.levelCopy}>
                    <Text style={styles.levelEyebrow}>{level.id === -1 ? 'PRE-A1' : `LEVEL ${level.id}`} · {level.title.toUpperCase()}</Text>
                    <Text style={styles.levelTitle}>{level.cefr}</Text>
                    <Text style={styles.levelMeta}>{fa(episodes.length)} اپیزود · {fa(done)} شنیده‌شده</Text>
                  </View>
                  <ChevronLeft size={18} color={P.muted} style={{ transform: [{ rotate: open ? '-90deg' : '0deg' }] }} />
                </Pressable>
                {open ? episodes.map(episode => {
                  const state = progress.episodes[episode.id];
                  const percent = state ? Math.min(100, Math.round(((state.completed ? episode.segments.length : state.segmentIndex) / episode.segments.length) * 100)) : 0;
                  return (
                    <Pressable key={episode.id} accessibilityRole="button" accessibilityLabel={`اپیزود ${fa(episode.number)}: ${episode.title}`} style={({ pressed }) => [styles.episodeRow, pressed && styles.pressed]} onPress={() => router.push({ pathname: '/lang/podcast/[id]', params: { id: episode.id } } as never)}>
                      <View style={[styles.episodeIcon, state?.completed && { backgroundColor: P.successSoft }]}>
                        {state?.completed ? <CheckCircle2 size={18} color={P.success} /> : <Headphones size={18} color={P.accent} />}
                      </View>
                      <View style={styles.episodeCopy}>
                        <Text style={styles.episodeNumber}>EPISODE {episode.number}</Text>
                        <Text style={styles.episodeTitle}>{episode.title}</Text>
                        <Text style={styles.episodeMeta}>{fa(episode.estimatedMinutes)} دقیقه · {fa(episode.segments.filter(segment => segment.kind === 'sentence').length)} جمله{percent > 0 && !state?.completed ? ` · ${fa(percent)}٪ شنیده‌شده` : ''}</Text>
                        <View style={styles.bar}><View style={[styles.barFill, { width: `${percent}%` }, state?.completed && { backgroundColor: P.success }]} /></View>
                      </View>
                      <Play size={16} color={P.muted} />
                    </Pressable>
                  );
                }) : null}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: P.white },
  scroll: { flexGrow: 1 },
  page: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 28, gap: 14 },
  brandRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 3 },
  hero: { borderRadius: 26, padding: 20, gap: 8, overflow: 'hidden' },
  heroIconWrap: { alignSelf: 'flex-start', width: 46, height: 46, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  heroEyebrow: { fontFamily: 'Times New Roman', color: 'rgba(255,255,255,0.72)', fontSize: 9, letterSpacing: 1.6, textAlign: 'left', writingDirection: 'ltr' },
  heroTitle: { fontFamily: Typography.fontFamily, color: P.white, fontSize: 24, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' },
  heroDesc: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.84)', fontSize: 12, lineHeight: 21, textAlign: 'right', writingDirection: 'rtl' },
  heroStats: { flexDirection: 'row-reverse', gap: 8, marginTop: 6 },
  heroStat: { flex: 1, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.12)', paddingVertical: 8, alignItems: 'center' },
  heroStatValue: { fontFamily: Typography.fontFamily, color: P.white, fontSize: 18 },
  heroStatLabel: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.72)', fontSize: 10 },
  continueButton: { marginTop: 6, minHeight: 46, borderRadius: 16, backgroundColor: P.white, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 14 },
  continueText: { flexShrink: 1, fontFamily: Typography.fontFamily, color: P.accent, fontSize: 13, writingDirection: 'rtl' },
  levelCard: { borderRadius: 22, borderWidth: 1, borderColor: P.border, backgroundColor: P.white, overflow: 'hidden' },
  levelHeader: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12, padding: 14 },
  levelDot: { width: 12, height: 12, borderRadius: 6 },
  levelCopy: { flex: 1, gap: 2 },
  levelEyebrow: { fontFamily: 'Times New Roman', color: P.muted, fontSize: 8, letterSpacing: 1.4, textAlign: 'left', writingDirection: 'ltr' },
  levelTitle: { fontFamily: Typography.fontFamily, color: P.ink, fontSize: 15, textAlign: 'right', writingDirection: 'rtl' },
  levelMeta: { fontFamily: Typography.fontFamily, color: P.muted, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  episodeRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: P.soft },
  episodeIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: P.accentSoft, alignItems: 'center', justifyContent: 'center' },
  episodeCopy: { flex: 1, gap: 3 },
  episodeNumber: { fontFamily: 'Times New Roman', color: P.muted, fontSize: 8, letterSpacing: 1.3, textAlign: 'left', writingDirection: 'ltr' },
  episodeTitle: { fontFamily: Typography.fontFamily, color: P.ink, fontSize: 14, lineHeight: 22, textAlign: 'right', writingDirection: 'rtl' },
  episodeMeta: { fontFamily: Typography.fontFamily, color: P.muted, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  bar: { height: 4, borderRadius: 2, backgroundColor: P.soft, overflow: 'hidden', marginTop: 3 },
  barFill: { height: 4, borderRadius: 2, backgroundColor: P.accent },
  pressed: { opacity: .75 },
});
