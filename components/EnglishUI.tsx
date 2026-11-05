import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { COURSE_LEVELS, type CourseLevelId } from '@/lib/courseContent';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { toPersianDigits } from '@/lib/format';
import { Typography } from '@/lib/theme';

/**
 * Light, professional level tints. Each level keeps its hue identity in a soft pastel form;
 * all consumers (library heroes, level chips, lesson headers) render dark-ink content on top.
 */
export const ENGLISH_LEVEL_GRADIENTS: Record<CourseLevelId, [string, string]> = {
  [-1]: ['#F7F9FC', '#E5EAF1'],
  0: ['#EFF0FE', '#DADFFA'],
  1: ['#EAF5FD', '#D1E8F8'],
  2: ['#E9FAF1', '#CFF1DE'],
  3: ['#FFF7E5', '#FAEAC4'],
  4: ['#F2EDFE', '#E1D5FA'],
  5: ['#FDEEF2', '#F7D6DF'],
};

export function displayEnglishModuleLabel(label: string) {
  return label.replace(/^(?:first\s+)?[0-9۰-۹٠-٩]+\+?\s+/i, '').trim();
}

export function EnglishProgressTrack({ value, color = Palette.primary, height = 8, trackColor = '#E7EAF2' }: { value: number; color?: string; height?: number; trackColor?: string }) {
  const percentage = Math.max(0, Math.min(100, value));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percentage }}
      style={[styles.progressTrack, { height, backgroundColor: trackColor }]}
    >
      <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: color }]} />
    </View>
  );
}

export function EnglishLevelRail<T extends CourseLevelId = CourseLevelId>({
  activeLevelId,
  counts,
  onSelect,
  levels,
  startLabel = 'START',
  accessibilityLabelPrefix,
  direction = 'ltr',
  accentColor = Palette.primary,
  successColor = Palette.success,
  activeLabelColor = Palette.primaryDark,
  numberOffset = 0,
}: {
  activeLevelId: T;
  counts?: Partial<Record<T, { completed: number; total: number }>>;
  onSelect: (levelId: T) => void;
  levels?: ReadonlyArray<{ id: T; title: string; cefr: string }>;
  startLabel?: string;
  accessibilityLabelPrefix?: string;
  direction?: 'ltr' | 'rtl';
  accentColor?: string;
  successColor?: string;
  activeLabelColor?: string;
  numberOffset?: number;
}) {
  const resolvedLevels = levels ?? COURSE_LEVELS as unknown as ReadonlyArray<{ id: T; title: string; cefr: string }>;
  const activeIndex = resolvedLevels.findIndex(level => level.id === activeLevelId);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.railScroll} contentContainerStyle={styles.rail}>
      {resolvedLevels.map((level, index, allLevels) => {
        const count = counts?.[level.id];
        const done = !!count && count.total > 0 && count.completed === count.total;
        const active = level.id === activeLevelId;
        const reached = activeIndex >= 0 && index < activeIndex;
        const label = level.id === 0 ? startLabel : level.cefr;
        const labelHasPersian = /[\u0600-\u06FF]/.test(label);
        return (
          <View key={level.id} style={[styles.railItem, direction === 'rtl' && styles.railItemRtl, index === allLevels.length - 1 && styles.railItemLast]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={accessibilityLabelPrefix ? `${accessibilityLabelPrefix} ${level.title}` : `${level.title}, ${count ? `${count.completed} از ${count.total} درس` : level.cefr}`}
              accessibilityState={{ selected: active }}
              accessibilityHint="انتخاب این سطح برای شروع"
              hitSlop={5}
              onPress={() => onSelect(level.id)}
              style={({ pressed }) => [styles.railPressable, pressed && styles.railPressed]}
            >
              <View style={[styles.railNode, active && styles.railNodeActive, done && !active && styles.railNodeDone, (active || done) && { backgroundColor: active ? accentColor : successColor, borderColor: active ? accentColor : successColor, ...(active ? { shadowColor: accentColor } : {}) }]}>
                {done && !active
                  ? <Check size={15} color="#FFFFFF" strokeWidth={3} />
                  : <Text style={[styles.railNodeText, active && styles.railNodeTextActive]}>{toPersianDigits(level.id + numberOffset)}</Text>}
              </View>
              <Text style={[styles.railLabel, labelHasPersian && styles.railLabelFa, active && styles.railLabelActive, active && { color: activeLabelColor }]} numberOfLines={3}>
                {label}
              </Text>
            </Pressable>
            {index < allLevels.length - 1 ? <View style={[styles.railConnector, reached && styles.railConnectorActive, reached && { backgroundColor: successColor }]} /> : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

export function EnglishSectionHeading({
  eyebrow,
  title,
  detail,
  accentColor = Palette.primary,
}: {
  eyebrow?: string;
  title: string;
  detail?: string;
  accentColor?: string;
}) {
  return (
    <View style={styles.sectionHeading}>
      {eyebrow ? <Text style={[styles.sectionEyebrow, { color: accentColor }]}>{eyebrow}</Text> : null}
      <Text style={styles.sectionTitle}>{title}</Text>
      {detail ? <Text style={styles.sectionDetail}>{detail}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  progressTrack: { width: '100%', borderRadius: 999, overflow: 'hidden', backgroundColor: '#E7EAF2' },
  progressFill: { height: '100%', borderRadius: 999, alignSelf: 'flex-start' },
  railScroll: { width: '100%' },
  rail: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 2, paddingVertical: 4 },
  railItem: { width: 82, flexShrink: 0, flexDirection: 'row', alignItems: 'flex-start' },
  railItemLast: { width: 70 },
  railItemRtl: { flexDirection: 'row-reverse' },
  railPressable: { width: 70, minHeight: 86, alignItems: 'center', justifyContent: 'flex-start', gap: 4, paddingTop: 2, paddingHorizontal: 2, borderRadius: 12 },
  railPressed: { opacity: .72, transform: [{ scale: .96 }] },
  railNode: { width: 38, height: 38, borderRadius: 19, borderWidth: 1.5, borderColor: '#B9B3E9', backgroundColor: Palette.surface, alignItems: 'center', justifyContent: 'center', shadowColor: '#211A68', shadowOpacity: .08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  railNodeActive: { backgroundColor: Palette.primary, borderColor: Palette.primary, shadowColor: Palette.primary, shadowOpacity: 0.24, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  railNodeDone: { backgroundColor: Palette.success, borderColor: Palette.success },
  railNodeText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 12, fontWeight: '800', writingDirection: 'rtl' },
  railNodeTextActive: { color: '#FFFFFF' },
  railLabel: { fontFamily: 'Inter-ExtraBold', maxWidth: 70, color: Palette.text, fontSize: 9, lineHeight: 12, fontWeight: '800', textAlign: 'center', writingDirection: 'ltr' },
  railLabelFa: { fontFamily: Typography.fontFamily, maxWidth: 70, fontSize: 9, lineHeight: 12, textAlign: 'center', writingDirection: 'rtl' },
  railLabelActive: { color: Palette.primaryDark },
  railConnector: { width: 12, height: 3, flex: 0, borderRadius: 99, backgroundColor: Palette.border, marginTop: 21 },
  railConnectorActive: { backgroundColor: Palette.success },
  sectionHeading: { gap: 3, alignItems: 'flex-end' },
  sectionEyebrow: { fontFamily: 'Inter-ExtraBold', color: Palette.primary, fontSize: 8, fontWeight: '800', letterSpacing: 1, textAlign: 'left', writingDirection: 'ltr' },
  sectionTitle: { fontFamily: 'Beiruti_700Bold', color: Palette.ink, fontSize: 19, lineHeight: 28, fontWeight: '400', textAlign: 'right', writingDirection: 'rtl' },
  sectionDetail: { fontFamily: 'Beiruti_700Bold', color: Palette.muted, fontSize: 12, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
});
