import { LocalizedText as Text } from '@/components/LocalizedText';
import { StyleSheet, View } from 'react-native';
import { ArrowLeftRight, Link2, ShieldAlert } from 'lucide-react-native';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { bridgeFor, type BridgeKind, type BridgeRule } from '@/lib/languages/russianPersianBridge';
import { turkishBridgeFor } from '@/lib/languages/turkishPersianBridge';
import { starterBridgeFor } from '@/lib/languages/starterPersianBridge';
import type { LearningSentence } from '@/lib/languages/types';
import { Typography } from '@/lib/theme';

const KIND_META: Record<BridgeKind, { label: string; color: string; soft: string; border: string; Icon: typeof Link2 }> = {
  structure: { label: 'ساختار متفاوت', color: '#4338CA', soft: '#EEF2FF', border: '#C7D2FE', Icon: ArrowLeftRight },
  trap: { label: 'تلهٔ فارسی‌زبان', color: '#B45309', soft: '#FFFBEB', border: '#FDE68A', Icon: ShieldAlert },
  same: { label: 'مثل فارسی', color: '#047857', soft: '#ECFDF5', border: '#A7F3D0', Icon: Link2 },
};

/** «پل فارسی» — the contrastive note + shared words for one Russian sentence. */
export function PersianBridgeCard({ sentence, language = 'ru' }: { sentence: Pick<LearningSentence, 'text' | 'fa'>; language?: 'ru' | 'tr' | 'de' | 'fr' | 'es' }) {
  const bridge = language === 'tr' ? turkishBridgeFor(sentence) : language === 'ru' ? bridgeFor(sentence) : starterBridgeFor(language, sentence);
  const foreignFont = language === 'ru' ? styles.loanRu : styles.loanLatin;
  if (!bridge.rule && bridge.loanwords.length === 0) return null;
  return (
    <View style={styles.wrap}>
      {bridge.rule ? <RuleCard rule={bridge.rule} /> : null}
      {bridge.loanwords.length ? <View style={styles.loanRow}>
        <Text style={styles.loanLabel}>فارسی این را می‌شناسد:</Text>
        {bridge.loanwords.map(item => <View key={item.stem} style={styles.loanChip}><Text style={foreignFont}>{item.ru}</Text><Text style={styles.loanFa}>{item.fa}</Text></View>)}
      </View> : null}
    </View>
  );
}

export function RuleCard({ rule, compact }: { rule: BridgeRule; compact?: boolean }) {
  const meta = KIND_META[rule.kind];
  const Icon = meta.Icon;
  return (
    <View style={[styles.card, { backgroundColor: meta.soft, borderColor: meta.border }]}>
      <View style={styles.head}>
        <View style={styles.headRight}>
          <View style={[styles.pill, { borderColor: meta.border }]}><Text style={[styles.pillText, { color: meta.color }]}>پل فارسی</Text></View>
          <Text style={[styles.kind, { color: meta.color }]}>{meta.label}</Text>
        </View>
        <Icon size={16} color={meta.color} />
      </View>
      <Text style={styles.title}>{rule.title}{rule.literal ? <Text style={styles.literal}>  {rule.literal}</Text> : null}</Text>
      {!compact ? <Text style={styles.note}>{rule.note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8, marginTop: 10 },
  card: { borderRadius: 16, borderWidth: 1, padding: 12, gap: 6 },
  head: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  headRight: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  pill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, borderWidth: 1, backgroundColor: '#FFFFFF' },
  pillText: { fontFamily: Typography.fontFamily, fontSize: 10 },
  kind: { fontFamily: Typography.fontFamily, fontSize: 11 },
  title: { fontFamily: Typography.fontFamily, fontSize: 14, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  literal: { fontFamily: Typography.fontFamily, fontSize: 12, color: Palette.text },
  note: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 21, color: Palette.text, textAlign: 'right', writingDirection: 'rtl' },
  loanRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  loanLabel: { fontFamily: Typography.fontFamily, fontSize: 11, color: Palette.text },
  loanChip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Palette.border },
  loanRu: { fontFamily: 'Times New Roman', fontWeight: '800', fontSize: 12, color: Palette.primaryDark },
  loanLatin: { fontFamily: Typography.latinFontFamily, fontWeight: '800', fontSize: 12, color: Palette.primaryDark },
  loanFa: { fontFamily: Typography.fontFamily, fontSize: 11, color: Palette.text },
});
