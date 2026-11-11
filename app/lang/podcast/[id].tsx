import { LocalizedText as Text } from '@/components/LocalizedText';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, CheckCircle2, Download, Eye, EyeOff, FileAudio, Mic2, Pause, Play, Podcast, SkipBack, SkipForward, Snail, Trash2, Volume2 } from 'lucide-react-native';
import { MiloGlobeHeadphoneMark } from '@/components/MiloBrandMark';
import { PageNavigation } from '@/components/PageNavigation';
import { Typography } from '@/lib/theme';
import { toPersianDigits as fa } from '@/lib/format';
import {
  PODCAST_SPEEDS,
  adjacentEpisode,
  getPodcastEpisode,
  loadPodcastProgress,
  savePodcastProgress,
  slowRateFor,
  speakPodcastLine,
  stopPodcastSpeech,
  type PodcastSpeed,
} from '@/lib/englishPodcast';
import {
  OFFLINE_DOWNLOADS_SUPPORTED,
  deleteDownloadedEpisode,
  downloadEpisode,
  resolveRecordedSource,
  segmentIndexForTime,
  type RecordedEpisodeInfo,
} from '@/lib/englishPodcastAudio';

const P = { ink: '#191919', muted: '#6B675F', soft: '#F4F1EA', border: '#E8E3DA', accent: '#5146E5', accentSoft: '#E9E7FF', success: '#2E8B57', white: '#FFFFFF' };
const PAUSE_BETWEEN_MS = 700;

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export default function EnglishPodcastPlayer() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const episode = useMemo(() => getPodcastEpisode(String(params.id ?? '')), [params.id]);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState<'normal' | 'slow' | null>(null);
  const [speed, setSpeed] = useState<PodcastSpeed>(1);
  const [slowRepeat, setSlowRepeat] = useState(true);
  const [showFa, setShowFa] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [ready, setReady] = useState(false);
  const [recorded, setRecorded] = useState<{ uri: string; offline: boolean; info: RecordedEpisodeInfo } | null>(null);
  const [mode, setMode] = useState<'tts' | 'recorded'>('tts');
  const [downloading, setDownloading] = useState<number | null>(null);

  // Phase 2: recorded MP3 (downloaded or online); falls back to TTS when absent.
  const recordedActive = mode === 'recorded' && !!recorded;
  const player = useAudioPlayer(recordedActive ? { uri: recorded!.uri } : null, { updateInterval: 400 });
  const playerStatus = useAudioPlayerStatus(player);

  const scrollRef = useRef<ScrollView>(null);
  const rowOffsets = useRef<Record<number, number>>({});
  const runId = useRef(0);
  const indexRef = useRef(0);
  const speedRef = useRef<PodcastSpeed>(1);
  const slowRef = useRef(true);
  indexRef.current = index; speedRef.current = speed; slowRef.current = slowRepeat;

  // Restore saved position.
  useEffect(() => {
    if (!episode) return;
    let active = true;
    loadPodcastProgress().then(state => {
      if (!active) return;
      const saved = state.episodes[episode.id];
      if (saved && !saved.completed) setIndex(Math.min(saved.segmentIndex, episode.segments.length - 1));
      setCompleted(!!saved?.completed);
      setReady(true);
    }).catch(() => setReady(true));
    resolveRecordedSource(episode.id).then(source => {
      if (!active) return;
      setRecorded(source);
      if (source) setMode('recorded');
    }).catch(() => undefined);
    return () => { active = false; runId.current += 1; void stopPodcastSpeech(); };
  }, [episode]);

  // Recorded playback: keep rate, transcript position and completion in sync.
  useEffect(() => { if (recordedActive) { try { player.setPlaybackRate(speed, 'high'); } catch { /* not loaded yet */ } } }, [recordedActive, player, speed]);
  useEffect(() => {
    if (!recordedActive || !episode) return;
    if (playerStatus.playing) {
      const next = segmentIndexForTime(playerStatus.currentTime, recorded?.info.cues, episode.segments.length, recorded?.info.durationSec || playerStatus.duration);
      if (next !== indexRef.current) { setIndex(next); persistRef.current(next); }
    }
    if (playerStatus.didJustFinish) {
      setPlaying(false);
      setCompleted(true);
      persistRef.current(episode.segments.length - 1, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordedActive, playerStatus.playing, playerStatus.currentTime, playerStatus.didJustFinish]);

  // Keep the current line in view.
  useEffect(() => {
    const y = rowOffsets.current[index];
    if (y !== undefined) scrollRef.current?.scrollTo({ y: Math.max(0, y - 120), animated: true });
  }, [index]);

  const persist = useCallback((segmentIndex: number, done = false) => {
    if (!episode) return;
    void savePodcastProgress(episode.id, { segmentIndex, completed: done || undefined }).catch(() => undefined);
  }, [episode]);
  const persistRef = useRef(persist);
  persistRef.current = persist;

  const stop = useCallback(() => {
    runId.current += 1;
    setPlaying(false);
    setPhase(null);
    void stopPodcastSpeech();
    if (recordedActive) { try { player.pause(); } catch { /* ignore */ } }
  }, [recordedActive, player]);

  const playFrom = useCallback(async (start: number) => {
    if (!episode) return;
    const current = ++runId.current;
    setPlaying(true);
    for (let i = start; i < episode.segments.length; i += 1) {
      if (runId.current !== current) return;
      setIndex(i);
      persist(i);
      const segment = episode.segments[i];
      if (segment.en) {
        setPhase('normal');
        const finished = await speakPodcastLine(segment.en, speedRef.current);
        if (!finished || runId.current !== current) return;
        if (segment.slowRepeat && slowRef.current) {
          await wait(PAUSE_BETWEEN_MS / 2);
          if (runId.current !== current) return;
          setPhase('slow');
          const finishedSlow = await speakPodcastLine(segment.en, slowRateFor(speedRef.current));
          if (!finishedSlow || runId.current !== current) return;
        }
      }
      await wait(PAUSE_BETWEEN_MS);
    }
    if (runId.current !== current) return;
    setPlaying(false);
    setPhase(null);
    setCompleted(true);
    persist(episode.segments.length - 1, true);
  }, [episode, persist]);

  const togglePlay = () => {
    if (recordedActive) {
      if (playerStatus.playing) { player.pause(); setPlaying(false); persist(indexRef.current); return; }
      void (async () => {
        if (completed && playerStatus.didJustFinish) await player.seekTo(0);
        player.play();
        setPlaying(true);
      })();
      return;
    }
    if (playing) { stop(); persist(indexRef.current); return; }
    const start = completed && indexRef.current >= (episode?.segments.length ?? 1) - 1 ? 0 : indexRef.current;
    void playFrom(start);
  };

  const jump = (target: number) => {
    if (!episode) return;
    const clamped = Math.max(0, Math.min(episode.segments.length - 1, target));
    if (recordedActive) {
      const cues = recorded?.info.cues;
      const total = recorded?.info.durationSec || playerStatus.duration || 0;
      const seconds = cues && cues[clamped] !== undefined ? cues[clamped] : total ? (clamped / episode.segments.length) * total : 0;
      setIndex(clamped);
      persist(clamped);
      void player.seekTo(seconds).catch(() => undefined);
      return;
    }
    const wasPlaying = playing;
    stop();
    setIndex(clamped);
    persist(clamped);
    if (wasPlaying) void playFrom(clamped);
  };

  const switchMode = (next: 'tts' | 'recorded') => {
    if (next === mode) return;
    stop();
    setMode(next);
  };

  const startDownload = () => {
    if (!episode) return;
    setDownloading(0);
    downloadEpisode(episode.id, fraction => setDownloading(fraction))
      .then(uri => { setRecorded(current => ({ uri, offline: true, info: current?.info ?? {} })); setMode('recorded'); })
      .catch(cause => Alert.alert('دانلود پادکست', cause instanceof Error ? cause.message : 'دانلود انجام نشد.'))
      .finally(() => setDownloading(null));
  };

  const removeDownload = () => {
    if (!episode) return;
    Alert.alert('حذف فایل آفلاین', 'فایل دانلودشدهٔ این اپیزود از دستگاه حذف شود؟', [
      { text: 'انصراف', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => { stop(); void deleteDownloadedEpisode(episode.id).then(() => resolveRecordedSource(episode.id)).then(source => { setRecorded(source); if (!source) setMode('tts'); }); } },
    ]);
  };

  const cycleSpeed = () => {
    const next = PODCAST_SPEEDS[(PODCAST_SPEEDS.indexOf(speed) + 1) % PODCAST_SPEEDS.length];
    setSpeed(next);
  };

  if (!episode) {
    return (
      <View style={styles.root}>
        <View style={styles.page}>
          <View style={styles.brandRow}><MiloGlobeHeadphoneMark size={48} /><PageNavigation backFallback="/lang/podcast" /></View>
          <Text style={styles.lineFa}>اپیزود پیدا نشد.</Text>
        </View>
      </View>
    );
  }

  const previous = adjacentEpisode(episode.id, -1);
  const next = adjacentEpisode(episode.id, 1);
  const percent = Math.round(((index + (completed ? 1 : 0)) / episode.segments.length) * 100);
  const sentenceCount = episode.segments.filter(segment => segment.kind === 'sentence').length;

  return (
    <View style={styles.root}>
      <View style={styles.page}>
        <View style={styles.brandRow}>
          <MiloGlobeHeadphoneMark size={48} />
          <PageNavigation backFallback="/lang/podcast" onBack={() => { stop(); persist(indexRef.current); if (router.canGoBack()) router.back(); else router.replace('/lang/podcast' as never); }} />
        </View>

        <LinearGradient colors={['#1E1B4B', '#312E81', '#4338CA']} start={{ x: .95, y: 0 }} end={{ x: .05, y: 1 }} style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerIcon}><Podcast size={22} color={P.white} /></View>
            <View style={styles.headerCopy}>
              <Text style={styles.headerEyebrow}>EPISODE {episode.number} · {episode.levelId === -1 ? 'PRE-A1' : `LEVEL ${episode.levelId}`}</Text>
              <Text style={styles.headerTitle}>{episode.title}</Text>
              <Text style={styles.headerSub}>{fa(sentenceCount)} جمله · حدود {fa(episode.estimatedMinutes)} دقیقه{completed ? ' · شنیده‌شده' : ''}</Text>
            </View>
          </View>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.min(100, percent)}%` }]} /></View>
          <View style={styles.headerMetaRow}>
            <Text style={styles.progressLabel}>بخش {fa(index + 1)} از {fa(episode.segments.length)}</Text>
            <View style={styles.sourceChip}>
              {recordedActive ? <FileAudio size={12} color={P.white} /> : <Mic2 size={12} color={P.white} />}
              <Text style={styles.sourceChipText}>{recordedActive ? (recorded?.offline ? 'صدای ضبط‌شده · آفلاین' : 'صدای ضبط‌شده · آنلاین') : 'صدای دستگاه (TTS)'}</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView ref={scrollRef} style={styles.transcript} contentContainerStyle={styles.transcriptContent} showsVerticalScrollIndicator={false}>
          {episode.segments.map((segment, i) => {
            const active = i === index;
            const isMeta = segment.kind === 'intro' || segment.kind === 'outro';
            return (
              <Pressable
                key={segment.id}
                accessibilityRole="button"
                accessibilityLabel={`پخش از بخش ${fa(i + 1)}`}
                onLayout={event => { rowOffsets.current[i] = event.nativeEvent.layout.y; }}
                style={[styles.line, active && styles.lineActive, isMeta && styles.lineMeta]}
                onPress={() => jump(i)}
              >
                {segment.kind === 'dialogue' ? <Text style={styles.speaker}>{segment.speaker === 'learner' ? 'You' : 'Partner'}</Text> : null}
                <Text style={[styles.lineEn, active && styles.lineEnActive, isMeta && styles.lineEnMeta]}>{segment.en}</Text>
                {showFa ? <Text style={[styles.lineFa, active && styles.lineFaActive]}>{segment.fa}</Text> : null}
                {active && playing && phase ? (
                  <View style={styles.phaseRow}>
                    {phase === 'slow' ? <Snail size={13} color={P.accent} /> : <Volume2 size={13} color={P.accent} />}
                    <Text style={styles.phaseText}>{phase === 'slow' ? 'تکرار آهسته' : 'سرعت عادی'}</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
          {completed ? (
            <View style={styles.doneCard}>
              <CheckCircle2 size={20} color={P.success} />
              <Text style={styles.doneText}>این اپیزود را کامل شنیدید.</Text>
              <View style={styles.doneActions}>
                <Pressable accessibilityRole="button" style={[styles.doneAction, styles.doneActionPrimary]} onPress={() => { stop(); router.push({ pathname: '/lang/podcast/quiz', params: { id: episode.id } } as never); }}><Brain size={14} color={P.white} /><Text style={[styles.doneActionText, styles.doneActionTextPrimary]}>سؤالات درک مطلب</Text></Pressable>
                <Pressable accessibilityRole="button" style={styles.doneAction} onPress={() => router.push('/learn/en/pronunciation' as never)}><Text style={styles.doneActionText}>کارگاه تلفظ</Text></Pressable>
                {next ? <Pressable accessibilityRole="button" style={styles.doneAction} onPress={() => { stop(); router.replace({ pathname: '/lang/podcast/[id]', params: { id: next.id } } as never); }}><Text style={styles.doneActionText}>اپیزود بعدی</Text></Pressable> : null}
              </View>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.controls}>
          {(recorded || OFFLINE_DOWNLOADS_SUPPORTED || completed) ? (
            <View style={styles.sourceRow}>
              {recorded ? (
                <>
                  <Pressable accessibilityRole="button" accessibilityState={{ selected: mode === 'recorded' }} style={[styles.sourceButton, mode === 'recorded' && styles.optionOn]} onPress={() => switchMode('recorded')}><FileAudio size={14} color={mode === 'recorded' ? P.white : P.ink} /><Text style={[styles.optionText, mode === 'recorded' && styles.optionTextOn]}>ضبط‌شده</Text></Pressable>
                  <Pressable accessibilityRole="button" accessibilityState={{ selected: mode === 'tts' }} style={[styles.sourceButton, mode === 'tts' && styles.optionOn]} onPress={() => switchMode('tts')}><Mic2 size={14} color={mode === 'tts' ? P.white : P.ink} /><Text style={[styles.optionText, mode === 'tts' && styles.optionTextOn]}>TTS</Text></Pressable>
                </>
              ) : null}
              {OFFLINE_DOWNLOADS_SUPPORTED ? (
                recorded?.offline ? (
                  <Pressable accessibilityRole="button" accessibilityLabel="حذف فایل آفلاین" style={styles.sourceButton} onPress={removeDownload}><Trash2 size={14} color={P.ink} /><Text style={styles.optionText}>حذف آفلاین</Text></Pressable>
                ) : (
                  <Pressable accessibilityRole="button" accessibilityLabel="دانلود برای شنیدن آفلاین" disabled={downloading !== null} style={[styles.sourceButton, downloading !== null && styles.disabled]} onPress={startDownload}>
                    {downloading !== null ? <ActivityIndicator size="small" color={P.accent} /> : <Download size={14} color={P.ink} />}
                    <Text style={styles.optionText}>{downloading !== null ? `${fa(Math.round(downloading * 100))}٪` : 'دانلود آفلاین'}</Text>
                  </Pressable>
                )
              ) : null}
              {completed ? (
                <Pressable accessibilityRole="button" accessibilityLabel="سؤالات درک مطلب" style={[styles.sourceButton, styles.quizButton]} onPress={() => { stop(); router.push({ pathname: '/lang/podcast/quiz', params: { id: episode.id } } as never); }}><Brain size={14} color={P.white} /><Text style={[styles.optionText, styles.optionTextOn]}>سؤالات</Text></Pressable>
              ) : null}
            </View>
          ) : null}
          <View style={styles.optionRow}>
            <Pressable accessibilityRole="button" accessibilityLabel="تغییر سرعت پخش" style={styles.option} onPress={cycleSpeed}><Text style={styles.optionText}>{speed}×</Text></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="تکرار آهستهٔ هر جمله" accessibilityState={{ checked: slowRepeat }} style={[styles.option, slowRepeat && styles.optionOn]} onPress={() => setSlowRepeat(value => !value)}><Snail size={15} color={slowRepeat ? P.white : P.ink} /><Text style={[styles.optionText, slowRepeat && styles.optionTextOn]}>تکرار آهسته</Text></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="نمایش یا مخفی کردن ترجمه" accessibilityState={{ checked: showFa }} style={[styles.option, showFa && styles.optionOn]} onPress={() => setShowFa(value => !value)}>{showFa ? <Eye size={15} color={P.white} /> : <EyeOff size={15} color={P.ink} />}<Text style={[styles.optionText, showFa && styles.optionTextOn]}>ترجمه</Text></Pressable>
          </View>
          <View style={styles.transportRow}>
            <Pressable accessibilityRole="button" accessibilityLabel="اپیزود قبلی" disabled={!previous} style={[styles.episodeNav, !previous && styles.disabled]} onPress={() => { if (previous) { stop(); router.replace({ pathname: '/lang/podcast/[id]', params: { id: previous.id } } as never); } }}><Text style={styles.episodeNavText}>قبلی</Text></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="بخش قبلی" style={styles.skip} onPress={() => jump(index - 1)}><SkipForward size={20} color={P.ink} /></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={playing ? 'توقف' : 'پخش'} style={styles.playButton} disabled={!ready} onPress={togglePlay}>{(recordedActive ? playerStatus.playing : playing) ? <Pause size={28} color={P.white} fill={P.white} /> : <Play size={28} color={P.white} fill={P.white} />}</Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="بخش بعدی" style={styles.skip} onPress={() => jump(index + 1)}><SkipBack size={20} color={P.ink} /></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="اپیزود بعدی" disabled={!next} style={[styles.episodeNav, !next && styles.disabled]} onPress={() => { if (next) { stop(); router.replace({ pathname: '/lang/podcast/[id]', params: { id: next.id } } as never); } }}><Text style={styles.episodeNavText}>بعدی</Text></Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: P.white },
  page: { flex: 1, width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 12, gap: 12 },
  brandRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 3 },
  header: { borderRadius: 22, padding: 16, gap: 10 },
  headerTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  headerIcon: { width: 44, height: 44, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  headerCopy: { flex: 1, gap: 2 },
  headerEyebrow: { fontFamily: 'Times New Roman', color: 'rgba(255,255,255,0.72)', fontSize: 9, letterSpacing: 1.5, textAlign: 'left', writingDirection: 'ltr' },
  headerTitle: { fontFamily: Typography.fontFamily, color: P.white, fontSize: 18, lineHeight: 27, textAlign: 'right', writingDirection: 'rtl' },
  headerSub: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.8)', fontSize: 11, textAlign: 'right', writingDirection: 'rtl' },
  progressTrack: { height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' },
  progressFill: { height: 5, borderRadius: 3, backgroundColor: P.white },
  headerMetaRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  sourceChip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.14)', paddingHorizontal: 9, paddingVertical: 4 },
  sourceChipText: { fontFamily: Typography.fontFamily, color: P.white, fontSize: 9 },
  sourceRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  sourceButton: { minHeight: 34, borderRadius: 12, borderWidth: 1, borderColor: P.border, backgroundColor: P.soft, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 5, paddingHorizontal: 10 },
  quizButton: { backgroundColor: P.success, borderColor: P.success },
  progressLabel: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.8)', fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  transcript: { flex: 1, minHeight: 0 },
  transcriptContent: { gap: 8, paddingBottom: 12 },
  line: { borderRadius: 16, borderWidth: 1, borderColor: P.border, backgroundColor: P.white, padding: 12, gap: 4 },
  lineActive: { borderColor: P.accent, backgroundColor: P.accentSoft },
  lineMeta: { backgroundColor: P.soft, borderColor: P.soft },
  speaker: { fontFamily: 'Times New Roman', color: P.muted, fontSize: 9, letterSpacing: 1.2, textAlign: 'left', writingDirection: 'ltr' },
  lineEn: { fontFamily: Typography.latinFontFamily, color: P.ink, fontSize: 16, lineHeight: 24, fontWeight: '700', textAlign: 'left', writingDirection: 'ltr' },
  lineEnActive: { color: P.accent },
  lineEnMeta: { fontSize: 13, fontWeight: '500', color: P.muted },
  lineFa: { fontFamily: Typography.fontFamily, color: P.muted, fontSize: 12, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  lineFaActive: { color: P.ink },
  phaseRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, marginTop: 2 },
  phaseText: { fontFamily: Typography.fontFamily, color: P.accent, fontSize: 10 },
  doneCard: { marginTop: 6, borderRadius: 18, backgroundColor: '#E6F4EC', padding: 14, alignItems: 'center', gap: 8 },
  doneText: { fontFamily: Typography.fontFamily, color: P.success, fontSize: 13 },
  doneActions: { flexDirection: 'row-reverse', gap: 8 },
  doneAction: { minHeight: 38, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: P.success, alignItems: 'center', justifyContent: 'center' },
  doneActionPrimary: { backgroundColor: P.success },
  doneActionText: { fontFamily: Typography.fontFamily, color: P.success, fontSize: 12 },
  doneActionTextPrimary: { color: P.white },
  controls: { borderRadius: 22, borderWidth: 1, borderColor: P.border, backgroundColor: P.white, padding: 12, gap: 10 },
  optionRow: { flexDirection: 'row-reverse', gap: 8 },
  option: { flex: 1, minHeight: 36, borderRadius: 12, borderWidth: 1, borderColor: P.border, backgroundColor: P.soft, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 5, paddingHorizontal: 8 },
  optionOn: { backgroundColor: P.accent, borderColor: P.accent },
  optionText: { fontFamily: Typography.fontFamily, color: P.ink, fontSize: 11 },
  optionTextOn: { color: P.white },
  transportRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  playButton: { width: 64, height: 64, borderRadius: 32, backgroundColor: P.accent, alignItems: 'center', justifyContent: 'center' },
  skip: { width: 46, height: 46, borderRadius: 23, backgroundColor: P.soft, alignItems: 'center', justifyContent: 'center' },
  episodeNav: { minHeight: 36, paddingHorizontal: 10, borderRadius: 12, borderWidth: 1, borderColor: P.border, alignItems: 'center', justifyContent: 'center' },
  episodeNavText: { fontFamily: Typography.fontFamily, color: P.ink, fontSize: 11 },
  disabled: { opacity: .35 },
});
