import { LocalizedText as Text } from '@/components/LocalizedText';
import { useEffect, useState, type ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { CheckCircle2, ClipboardCheck, Mic2, X, Zap } from 'lucide-react-native';
import { Typography } from '@/lib/theme';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';

export type FinalSectionId = 'blitz' | 'speak' | 'checks';

export interface FinalSection {
  id: FinalSectionId;
  title: string;
  /** One short line under the title; keep it to a single sentence. */
  subtitle: string;
  done?: boolean;
  render: () => ReactNode;
}

const ICONS: Record<FinalSectionId, typeof Zap> = { blitz: Zap, speak: Mic2, checks: ClipboardCheck };

/**
 * Frame for the three closing stages (blitz, speaking check, short assessment).
 * Deliberately identical to every other stage of the lesson: round icon, stage title,
 * one short line, then the content — no extra hero, panel or second heading.
 */
export default function LessonFinalHub({ sections, only }: { sections: FinalSection[]; only: FinalSectionId }) {
  const current = sections.find(section => section.id === only) ?? sections[0];
  const Icon = ICONS[current.id];
  // The blitz round runs inside a full-screen modal so the timer and choices never fight with the page scroll.
  const modal = current.id === 'blitz';
  const [open, setOpen] = useState(modal && !current.done);
  useEffect(() => { if (modal && current.done) setOpen(false); }, [modal, current.done]);
  if (modal) {
    return (
      <View style={styles.wrap}>
        <View style={styles.bigIcon}><Icon size={33} color={Palette.primary} /></View>
        <View style={styles.titleRow}>
          <Text style={styles.stageTitle}>{current.title}</Text>
          {current.done ? <CheckCircle2 size={20} color={Palette.success} /> : null}
        </View>
        <Text style={styles.stageDesc}>{current.subtitle}</Text>
        {current.done
          ? current.render()
          : <Pressable accessibilityRole="button" style={styles.openButton} onPress={() => setOpen(true)}><Zap size={18} color="#FFFFFF" /><Text style={styles.openText}>شروع دور سریع</Text></Pressable>}
        <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)} presentationStyle="pageSheet">
          <View style={styles.modalRoot}>
            <View style={styles.modalHead}>
              <Pressable accessibilityRole="button" accessibilityLabel="بستن" hitSlop={10} onPress={() => setOpen(false)} style={styles.modalClose}><X size={20} color={Palette.ink} /></Pressable>
              <View style={styles.modalTitleRow}><Zap size={18} color={Palette.primary} /><Text style={styles.modalTitle}>{current.title}</Text></View>
            </View>
            <ScrollView contentContainerStyle={styles.modalBody} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              {current.render()}
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }
  return (
    <View style={styles.wrap}>
      <View style={styles.bigIcon}><Icon size={33} color={Palette.primary} /></View>
      <View style={styles.titleRow}>
        <Text style={styles.stageTitle}>{current.title}</Text>
        {current.done ? <CheckCircle2 size={20} color={Palette.success} /> : null}
      </View>
      <Text style={styles.stageDesc}>{current.subtitle}</Text>
      {current.render()}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', alignItems: 'center' },
  bigIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: Palette.primarySoft, borderWidth: 1, borderColor: '#DDE2FF', alignItems: 'center', justifyContent: 'center', marginVertical: 18 },
  titleRow: { width: '100%', flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  stageTitle: { flex: 1, fontFamily: Typography.fontFamily, fontSize: 25, lineHeight: 36, fontWeight: '400', color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  openButton: { marginTop: 18, minHeight: 54, alignSelf: 'stretch', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 16, backgroundColor: Palette.primary },
  openText: { fontFamily: Typography.fontFamily, fontSize: 15, color: '#FFFFFF', writingDirection: 'rtl' },
  modalRoot: { flex: 1, backgroundColor: '#F7F7FB' },
  modalHead: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 18, paddingBottom: 10 },
  modalTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  modalTitle: { fontFamily: Typography.fontFamily, fontSize: 18, color: Palette.ink, writingDirection: 'rtl' },
  modalClose: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Palette.border, alignItems: 'center', justifyContent: 'center' },
  modalBody: { paddingHorizontal: 16, paddingBottom: 32, maxWidth: 820, width: '100%', alignSelf: 'center' },
  stageDesc: { fontFamily: Typography.fontFamily, fontSize: 13, color: Palette.text, textAlign: 'right', writingDirection: 'rtl', alignSelf: 'stretch', lineHeight: 23, marginTop: 8 },
});
