import { LocalizedText as Text } from '@/components/LocalizedText';
import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CheckCircle2, ClipboardCheck, Mic2 } from 'lucide-react-native';
import { Typography } from '@/lib/theme';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';

/**
 * The closing stages of a lesson: «سنجش کوتاه» and then «آزمون گفتاری».
 * The timed «دور سریع» round that used to sit before them is gone, so there is no
 * modal, no timer and no extra entry button left anywhere in the lesson flow.
 */
export type FinalSectionId = 'speak' | 'checks';

export interface FinalSection {
  id: FinalSectionId;
  title: string;
  /** One short line under the title; keep it to a single sentence. */
  subtitle: string;
  done?: boolean;
  render: () => ReactNode;
}

const ICONS: Record<FinalSectionId, typeof Mic2> = { speak: Mic2, checks: ClipboardCheck };

/** Deliberately identical to every other stage of the lesson: round icon, stage title, one short line, then the content. */
export default function LessonFinalHub({ sections, only }: { sections: FinalSection[]; only: FinalSectionId }) {
  const current = sections.find(section => section.id === only) ?? sections[0];
  if (!current) return null;
  const Icon = ICONS[current.id];
  return (
    <View style={styles.wrap}>
      <View style={styles.bigIcon}><Icon size={33} color={Palette.primary} /></View>
      <View style={styles.titleRow}>
        <Text style={styles.stageTitle}>{current.title}</Text>
        {current.done ? <CheckCircle2 size={20} color={Palette.success} /> : null}
      </View>
      <Text style={styles.stageDesc}>{current.subtitle}</Text>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {current.render()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', alignItems: 'center' },
  bigIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: Palette.primarySoft, borderWidth: 1, borderColor: '#DDE2FF', alignItems: 'center', justifyContent: 'center', marginVertical: 18 },
  titleRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, alignSelf: 'stretch' },
  stageTitle: { fontFamily: Typography.boldFontFamily, fontSize: 25, lineHeight: 36, fontWeight: '400', color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  stageDesc: { fontFamily: Typography.fontFamily, fontSize: 13, color: Palette.text, textAlign: 'right', writingDirection: 'rtl', alignSelf: 'stretch', lineHeight: 23, marginTop: 8 },
  body: { width: '100%', paddingTop: 12, paddingBottom: 8 },
});
