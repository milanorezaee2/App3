import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { LocalizedText as Text, PERSIAN_TRANSLATION_COLOR } from '@/components/LocalizedText';
import { MiloGlobeHeadphoneMark } from '@/components/MiloBrandMark';
import { toPersianDigits } from '@/lib/format';

const INK = '#1B1F3B';
const PRIMARY = '#5146E5';
const PRIMARY_SOFT = '#EEF0FF';
const BORDER = '#E3E6F2';
const SURFACE = '#FFFFFF';

/** Tidy, right-aligned header for the "Grammar Through Usage" stage. */
export function GrammarStageHeader({ title, subtitle, description }: { title: string; subtitle?: string; description?: string }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerIcon}><MiloGlobeHeadphoneMark size={26} /></View>
      <View style={styles.headerCopy}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
        {description ? <Text style={styles.headerDescription}>{description}</Text> : null}
      </View>
    </View>
  );
}

/** One numbered pattern card: pattern pill + optional explanation + example + translation, all aligned to the right edge. */
export function GrammarPatternCard({ index, pattern, explanation, example, translation, onSpeak }: {
  index: number;
  pattern: string;
  explanation?: string;
  example: string;
  translation?: string;
  onSpeak?: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.number}><Text style={styles.numberText}>{toPersianDigits(String(index))}</Text></View>
        <View style={styles.patternPill}><Text style={styles.patternText}>{pattern}</Text></View>
        <View style={{ flex: 1 }} />
        {onSpeak ? (
          <Pressable accessibilityRole="button" accessibilityLabel={`شنیدن جمله: ${example}`} hitSlop={6} onPress={onSpeak} style={({ pressed }) => [styles.sound, pressed && { opacity: .7 }]}>
            <Volume2 size={16} color={PRIMARY} />
          </Pressable>
        ) : null}
      </View>
      {explanation ? <Text style={styles.explanation}>{explanation}</Text> : null}
      <View style={styles.exampleBlock}>
        <Text style={styles.example}>{example}</Text>
        {translation ? <Text keepColor style={styles.translation}>{translation}</Text> : null}
      </View>
    </View>
  );
}

/** Simple note card (teaching note / reminder) in the same visual language. */
export function GrammarNoteCard({ title, text }: { title: string; text: string }) {
  return (
    <View style={[styles.card, styles.noteCard]}>
      <Text style={styles.noteTitle}>{title}</Text>
      <Text style={styles.noteText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { width: '100%', flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 12, paddingTop: 14, paddingBottom: 6 },
  headerIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: PRIMARY_SOFT, borderWidth: 1, borderColor: '#DDE2FF', alignItems: 'center', justifyContent: 'center' },
  headerCopy: { flex: 1, gap: 2 },
  headerTitle: { fontFamily: 'Beiruti-Bold', fontSize: 20, lineHeight: 30, color: INK, textAlign: 'right', writingDirection: 'rtl' },
  headerSubtitle: { fontFamily: 'Times New Roman', fontSize: 12, fontWeight: '700', letterSpacing: 1.2, color: PRIMARY, textAlign: 'right', writingDirection: 'ltr', textTransform: 'uppercase' },
  headerDescription: { fontFamily: 'Beiruti', fontSize: 12.5, lineHeight: 21, color: '#5B6472', textAlign: 'right', writingDirection: 'rtl', marginTop: 4 },

  card: { width: '100%', borderRadius: 18, backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, paddingVertical: 12, paddingHorizontal: 14, gap: 9, marginTop: 10, shadowColor: '#211A68', shadowOpacity: .04, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  cardTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  number: { width: 24, height: 24, borderRadius: 8, backgroundColor: INK, alignItems: 'center', justifyContent: 'center' },
  numberText: { fontFamily: 'Beiruti-Bold', fontSize: 12, color: '#FFFFFF', lineHeight: 16 },
  patternPill: { flexShrink: 1, backgroundColor: PRIMARY_SOFT, borderRadius: 999, paddingHorizontal: 11, paddingVertical: 4 },
  patternText: { fontFamily: 'Times New Roman', fontSize: 12, fontWeight: '700', color: PRIMARY, textAlign: 'right', writingDirection: 'ltr' },
  sound: { width: 34, height: 34, borderRadius: 12, borderWidth: 1, borderColor: '#DDE2FF', backgroundColor: PRIMARY_SOFT, alignItems: 'center', justifyContent: 'center' },
  explanation: { fontFamily: 'Beiruti', fontSize: 12.5, lineHeight: 21, color: '#3F4756', textAlign: 'right', writingDirection: 'rtl' },
  exampleBlock: { borderRightWidth: 2, borderRightColor: '#DDE2FF', paddingRight: 10, gap: 3 },
  example: { fontFamily: 'Times New Roman', fontSize: 15, fontWeight: '800', lineHeight: 23, color: INK, textAlign: 'right', writingDirection: 'ltr' },
  translation: { fontFamily: 'Beiruti', fontSize: 11.5, lineHeight: 19, color: PERSIAN_TRANSLATION_COLOR, textAlign: 'right', writingDirection: 'rtl' },

  noteCard: { backgroundColor: '#FBFBFF' },
  noteTitle: { fontFamily: 'Beiruti-Bold', fontSize: 13, color: PRIMARY, textAlign: 'right', writingDirection: 'rtl' },
  noteText: { fontFamily: 'Beiruti', fontSize: 12.5, lineHeight: 22, color: '#3F4756', textAlign: 'right', writingDirection: 'rtl' },
});
