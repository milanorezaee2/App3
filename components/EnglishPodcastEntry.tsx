import { LocalizedText as Text } from '@/components/LocalizedText';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Headphones, Play, Podcast } from 'lucide-react-native';
import { Typography } from '@/lib/theme';
import { toPersianDigits as fa } from '@/lib/format';
import { PODCAST_EPISODES, PODCAST_LEVELS, loadPodcastProgress, type PodcastProgress } from '@/lib/englishPodcast';

const C = { ink: '#191919', muted: '#6B675F', border: '#DDD9F6', accent: '#5146E5', accentSoft: '#E9E7FF', white: '#FFFFFF', track: '#EEEBFF' };

/** Dashboard showcase for the English podcast: continue where you left off, plus library stats. */
export default function EnglishPodcastEntry() {
  const router = useRouter();
  const [progress, setProgress] = useState<PodcastProgress>({ episodes: {} });

  useFocusEffect(useCallback(() => {
    let active = true;
    loadPodcastProgress().then(state => { if (active) setProgress(state); }).catch(() => undefined);
    return () => { active = false; };
  }, []));

  const completed = Object.values(progress.episodes).filter(item => item.completed).length;
  const last = progress.lastEpisodeId ? PODCAST_EPISODES.find(episode => episode.id === progress.lastEpisodeId) : undefined;
  const episode = last && !progress.episodes[last.id]?.completed ? last : PODCAST_EPISODES.find(item => !progress.episodes[item.id]?.completed) ?? PODCAST_EPISODES[0];
  const state = episode ? progress.episodes[episode.id] : undefined;
  const percent = episode && state ? Math.min(100, Math.round(((state.completed ? episode.segments.length : state.segmentIndex) / episode.segments.length) * 100)) : 0;
  const started = !!state && !state.completed && state.segmentIndex > 0;
  const level = episode ? PODCAST_LEVELS.find(group => group.level.id === episode.levelId)?.level : undefined;

  const openEpisode = () => { if (episode) router.push({ pathname: '/lang/podcast/[id]', params: { id: episode.id } } as never); };

  return (
    <View style={s.card}>
      <View style={s.headRow}>
        <View style={s.badge}><Podcast size={15} color={C.accent} /><Text style={s.badgeText}>پادکست انگلیسی</Text></View>
        <Text style={s.eyebrow}>MILO ENGLISH PODCAST</Text>
      </View>
      <Text style={s.description}>هر درس یک اپیزود شنیداری: جمله‌ها با سرعت عادی و تکرار آهسته، همراه با متن انگلیسی و ترجمهٔ هم‌زمان؛ در پایان، سؤالات درک مطلب.</Text>

      {episode ? (
        <Pressable accessibilityRole="button" accessibilityLabel={`${started ? 'ادامهٔ' : 'پخش'} اپیزود ${fa(episode.number)}: ${episode.title}`} style={({ pressed }) => [s.player, pressed && s.pressed]} onPress={openEpisode}>
          <LinearGradient colors={['#1E1B4B', '#312E81', '#4338CA']} start={{ x: .95, y: 0 }} end={{ x: .05, y: 1 }} style={StyleSheet.absoluteFillObject} />
          <View style={s.playButton}><Play size={20} color={C.accent} fill={C.accent} /></View>
          <View style={s.playerCopy}>
            <Text style={s.playerEyebrow}>EPISODE {episode.number}{level ? ` · ${level.id === -1 ? 'PRE-A1' : `LEVEL ${level.id}`}` : ''}</Text>
            <Text style={s.playerTitle} numberOfLines={1}>{episode.title}</Text>
            <Text style={s.playerMeta}>{started ? `ادامه از ${fa(percent)}٪` : 'شروع اپیزود'} · حدود {fa(episode.estimatedMinutes)} دقیقه</Text>
            <View style={s.track}><View style={[s.fill, { width: `${percent}%` }]} /></View>
          </View>
        </Pressable>
      ) : null}

      <View style={s.statsRow}>
        <View style={s.stat}><Headphones size={13} color={C.accent} /><Text style={s.statText}>{fa(PODCAST_EPISODES.length)} اپیزود</Text></View>
        <View style={s.stat}><Text style={s.statText}>{fa(PODCAST_LEVELS.length)} فصل</Text></View>
        <View style={s.stat}><Text style={s.statText}>{fa(completed)} شنیده‌شده</Text></View>
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel="دیدن همهٔ اپیزودهای پادکست" style={({ pressed }) => [s.actionRow, pressed && s.pressed]} onPress={() => router.push('/lang/podcast' as never)}>
        <Text style={s.action}>دیدن همهٔ اپیزودها</Text>
        <ChevronLeft size={15} color={C.accent} />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  card: { padding: 16, borderRadius: 18, borderWidth: 1, borderColor: C.border, backgroundColor: C.white, gap: 10 },
  headRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  badge: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, borderRadius: 999, backgroundColor: C.accentSoft, paddingHorizontal: 10, paddingVertical: 5 },
  badgeText: { fontFamily: Typography.boldFontFamily, fontSize: 13, color: '#302880', writingDirection: 'rtl' },
  eyebrow: { fontFamily: 'Times New Roman', fontSize: 8, letterSpacing: 1.4, color: C.muted, writingDirection: 'ltr' },
  description: { fontFamily: Typography.fontFamily, fontSize: 13, lineHeight: 22, color: '#475569', textAlign: 'right', writingDirection: 'rtl' },
  player: { borderRadius: 16, overflow: 'hidden', padding: 12, flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  playButton: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  playerCopy: { flex: 1, minWidth: 0, gap: 3 },
  playerEyebrow: { fontFamily: 'Times New Roman', fontSize: 8, letterSpacing: 1.3, color: 'rgba(255,255,255,0.72)', textAlign: 'left', writingDirection: 'ltr' },
  playerTitle: { fontFamily: Typography.boldFontFamily, fontSize: 15, lineHeight: 22, color: C.white, textAlign: 'right', writingDirection: 'rtl' },
  playerMeta: { fontFamily: Typography.fontFamily, fontSize: 11, color: 'rgba(255,255,255,0.82)', textAlign: 'right', writingDirection: 'rtl' },
  track: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.22)', overflow: 'hidden', marginTop: 3 },
  fill: { height: 4, borderRadius: 2, backgroundColor: C.white },
  statsRow: { flexDirection: 'row-reverse', gap: 8, flexWrap: 'wrap' },
  stat: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, borderRadius: 999, backgroundColor: C.track, paddingHorizontal: 10, paddingVertical: 5 },
  statText: { fontFamily: Typography.fontFamily, fontSize: 11, color: '#302880', writingDirection: 'rtl' },
  actionRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, alignSelf: 'flex-end' },
  action: { fontFamily: Typography.boldFontFamily, fontSize: 13, color: C.accent, textAlign: 'right', writingDirection: 'rtl' },
  pressed: { opacity: .8 },
});
