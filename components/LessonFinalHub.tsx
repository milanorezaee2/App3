import { LocalizedText as Text } from '@/components/LocalizedText';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2, ClipboardCheck, Mic2, Zap } from 'lucide-react-native';
import { Typography } from '@/lib/theme';

export type FinalSectionId = 'blitz' | 'speak' | 'checks';

export interface FinalSection {
  id: FinalSectionId;
  title: string;
  subtitle: string;
  /** True when the learner has finished this part (shows a check on the tab). */
  done?: boolean;
  render: () => ReactNode;
}

const ICONS: Record<FinalSectionId, typeof Zap> = { blitz: Zap, speak: Mic2, checks: ClipboardCheck };
const COLORS: Record<FinalSectionId, string> = { blitz: '#4F46E5', speak: '#047857', checks: '#B45309' };

/**
 * The lesson's last stage as three separate, focused pages instead of one long scroll:
 * the blitz round, the speaking check and the short assessment. Nothing here is forced —
 * the hero explains why the speaking and assessment pages matter, and the learner picks.
 */
const HERO_TEXT: Record<FinalSectionId, string> = {
  blitz: '«دور سریع» حافظه را قفل می‌کند: هر جملهٔ درس یک بار، هر بار به شکلی دیگر. کوتاه است؛ اگر عجله داری، رد کن.',
  speak: '«آزمون گفتاری» تنها جایی است که دهان و گوشِ تو واقعاً زبان را تمرین می‌کنند — بدون آن، جمله‌ها فقط خوانده می‌شوند، نه گفته. اجباری نیست؛ ولی کسانی که این صفحه را رد نمی‌کنند، چند برابر سریع‌تر به حرف می‌آیند.',
  checks: '«سنجش کوتاه» نشان می‌دهد از این درس چه چیزی واقعاً مانده است؛ بدون نمره، با توضیح هر پاسخ. اجباری نیست؛ دو دقیقه وقت می‌گیرد و جلوی فراموشیِ بی‌صدا را می‌گیرد.',
};

export default function LessonFinalHub({ sections, initial = 'blitz', only }: { sections: FinalSection[]; initial?: FinalSectionId; only?: FinalSectionId }) {
  const [active, setActive] = useState<FinalSectionId>(initial);
  const current = sections.find(section => section.id === (only ?? active)) ?? sections[0];
  const color = COLORS[current.id];
  if (only) {
    const Icon = ICONS[current.id];
    return (
      <View style={styles.wrap}>
        <LinearGradient colors={['#1E1B4B', '#312E81', color]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={styles.hero}>
          <View style={styles.heroRow}><Icon size={22} color="#FFFFFF" strokeWidth={2.4} /><Text style={styles.heroTitle}>{current.title}</Text>{current.done ? <CheckCircle2 size={18} color="#FFFFFF" /> : null}</View>
          <Text style={styles.heroText}>{HERO_TEXT[current.id]}</Text>
        </LinearGradient>
        <View style={[styles.panel, { borderColor: color }]}>
          <View style={[styles.panelStripe, { backgroundColor: color }]} />
          <Text style={styles.panelSubtitle}>{current.subtitle}</Text>
          {current.render()}
        </View>
      </View>
    );
  }
  return (
    <View style={styles.wrap}>
      <LinearGradient colors={['#1E1B4B', '#312E81', '#4338CA']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={styles.hero}>
        <Text style={styles.heroKicker}>ایستگاه پایانی درس</Text>
        <Text style={styles.heroTitle}>سه صفحهٔ جدا؛ خودت انتخاب کن</Text>
        <Text style={styles.heroText}>
          «دور سریع» حافظه را قفل می‌کند. «آزمون گفتاری» تنها جایی است که دهان و گوشِ تو واقعاً زبان را تمرین می‌کنند — بدون آن، جمله‌ها فقط خوانده می‌شوند، نه گفته. «سنجش کوتاه» نشان می‌دهد چه چیزی واقعاً مانده است. هیچ‌کدام اجباری نیست؛ ولی کسانی که این دو صفحه را رد نمی‌کنند، چند برابر سریع‌تر به حرف می‌آیند.
        </Text>
      </LinearGradient>

      <View style={styles.tabs}>
        {sections.map(section => {
          const Icon = ICONS[section.id];
          const selected = section.id === current.id;
          const tint = COLORS[section.id];
          return (
            <Pressable key={section.id} accessibilityRole="tab" accessibilityState={{ selected }} onPress={() => setActive(section.id)} style={({ pressed }) => [styles.tab, { borderColor: tint }, selected && { backgroundColor: tint }, pressed && styles.pressed]}>
              <View style={styles.tabHead}>
                <Icon size={20} color={selected ? '#FFFFFF' : tint} strokeWidth={2.4} />
                {section.done ? <CheckCircle2 size={16} color={selected ? '#FFFFFF' : '#15803D'} /> : null}
              </View>
              <Text style={[styles.tabTitle, { color: selected ? '#FFFFFF' : tint }]}>{section.title}</Text>
              <Text style={[styles.tabSubtitle, { color: selected ? 'rgba(255,255,255,0.85)' : '#64748B' }]}>{section.subtitle}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.panel, { borderColor: color }]}>
        <View style={[styles.panelStripe, { backgroundColor: color }]} />
        <Text style={[styles.panelTitle, { color }]}>{current.title}</Text>
        <Text style={styles.panelSubtitle}>{current.subtitle}</Text>
        {current.render()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', gap: 14 },
  hero: { borderRadius: 22, padding: 18, gap: 8 },
  heroKicker: { fontFamily: Typography.fontFamily, fontSize: 12, color: 'rgba(255,255,255,0.75)', textAlign: 'right', writingDirection: 'rtl' },
  heroRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  heroTitle: { fontFamily: Typography.fontFamily, fontSize: 21, color: '#FFFFFF', textAlign: 'right', writingDirection: 'rtl' },
  heroText: { fontFamily: Typography.fontFamily, fontSize: 13, lineHeight: 23, color: 'rgba(255,255,255,0.92)', textAlign: 'right', writingDirection: 'rtl' },
  tabs: { flexDirection: 'row-reverse', gap: 8 },
  tab: { flex: 1, borderRadius: 16, borderWidth: 2, backgroundColor: '#FFFFFF', padding: 10, gap: 4, minHeight: 92 },
  tabHead: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  tabTitle: { fontFamily: Typography.fontFamily, fontSize: 14, textAlign: 'right', writingDirection: 'rtl' },
  tabSubtitle: { fontFamily: Typography.fontFamily, fontSize: 10.5, lineHeight: 16, textAlign: 'right', writingDirection: 'rtl' },
  pressed: { opacity: 0.85 },
  panel: { width: '100%', borderRadius: 20, borderWidth: 2, backgroundColor: '#FFFFFF', padding: 14, gap: 8, overflow: 'hidden' },
  panelStripe: { position: 'absolute', top: 0, left: 0, right: 0, height: 6 },
  panelTitle: { fontFamily: Typography.fontFamily, fontSize: 18, textAlign: 'right', writingDirection: 'rtl', marginTop: 4 },
  panelSubtitle: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: '#475569', textAlign: 'right', writingDirection: 'rtl' },
});
