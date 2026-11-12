import { LocalizedText as Text, LocalizedTextInput as TextInput } from '@/components/LocalizedText';
import { toPersianDigits as fa } from '@/lib/format';
import { Search, X } from 'lucide-react-native';
import type { ComponentType, ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { AdminTheme as T, toneColors, type AdminTone } from './theme';

export const faDate = (value: string | null | undefined): string => {
  if (!value || !Number.isFinite(Date.parse(value))) return '—';
  return new Date(value).toLocaleDateString('fa-IR', { year: 'numeric', month: 'short', day: 'numeric' });
};
export const faDateTime = (value: string | null | undefined): string => {
  if (!value || !Number.isFinite(Date.parse(value))) return '—';
  return new Date(value).toLocaleString('fa-IR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};
export const faAgo = (value: string | null | undefined): string => {
  if (!value || !Number.isFinite(Date.parse(value))) return '—';
  const minutes = Math.max(0, Math.round((Date.now() - Date.parse(value)) / 60000));
  if (minutes < 1) return 'هم‌اکنون';
  if (minutes < 60) return `${fa(minutes)} دقیقه پیش`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${fa(hours)} ساعت پیش`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${fa(days)} روز پیش`;
  return faDate(value);
};
export const n = (value: number | null | undefined) => fa(value ?? 0);

// ------------------------------------------------------------------ layout
export function Page({ title, subtitle, actions, children }: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <View style={s.page}>
      <View style={s.pageHead}>
        <View style={{ flex: 1, minWidth: 180 }}>
          <Text style={s.pageTitle}>{title}</Text>
          {!!subtitle && <Text style={s.pageSubtitle}>{subtitle}</Text>}
        </View>
        {!!actions && <View style={s.pageActions}>{actions}</View>}
      </View>
      {children}
    </View>
  );
}

export function Card({ title, aside, children, style, padded = true }: { title?: string; aside?: ReactNode; children: ReactNode; style?: StyleProp<ViewStyle>; padded?: boolean }) {
  return (
    <View style={[s.card, style]}>
      {(title || aside) && (
        <View style={[s.cardHead, !padded && { paddingHorizontal: T.space.lg }]}>
          <Text style={s.cardTitle}>{title}</Text>
          {aside}
        </View>
      )}
      <View style={padded ? s.cardBody : undefined}>{children}</View>
    </View>
  );
}

export function Row({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.row, style]}>{children}</View>;
}

// --------------------------------------------------------------- elements
export function StatTile({ label, value, hint, tone = 'neutral', icon: Icon }: { label: string; value: string | number; hint?: string; tone?: AdminTone; icon?: ComponentType<{ size?: number; color?: string }> }) {
  const colors = toneColors(tone);
  return (
    <View style={s.stat}>
      <View style={s.statTop}>
        <Text style={s.statLabel}>{label}</Text>
        {Icon && <View style={[s.statIcon, { backgroundColor: colors.bg }]}><Icon size={16} color={colors.fg} /></View>}
      </View>
      <Text keepColor style={[s.statValue, tone !== 'neutral' && { color: colors.fg }]}>{typeof value === 'number' ? fa(value) : value}</Text>
      {!!hint && <Text style={s.statHint}>{hint}</Text>}
    </View>
  );
}

export function Chip({ label, tone = 'neutral' }: { label: string; tone?: AdminTone }) {
  const colors = toneColors(tone);
  return <View style={[s.chip, { backgroundColor: colors.bg }]}><Text keepColor style={[s.chipText, { color: colors.fg }]}>{label}</Text></View>;
}

export function Button({ label, onPress, tone = 'accent', variant = 'solid', disabled, icon: Icon, small }: {
  label: string; onPress: () => void; tone?: AdminTone; variant?: 'solid' | 'soft' | 'ghost'; disabled?: boolean;
  icon?: ComponentType<{ size?: number; color?: string }>; small?: boolean;
}) {
  const colors = toneColors(tone);
  const solidBg = tone === 'accent' ? T.color.accent : tone === 'danger' ? T.color.danger : tone === 'success' ? T.color.success : tone === 'warning' ? T.color.warning : T.color.text;
  const bg = variant === 'solid' ? solidBg : variant === 'soft' ? colors.bg : 'transparent';
  const fg = variant === 'solid' ? '#FFFFFF' : colors.fg;
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
      style={({ pressed }) => [s.button, small && s.buttonSmall, { backgroundColor: bg }, variant === 'ghost' && s.buttonGhost, (disabled || pressed) && { opacity: disabled ? 0.45 : 0.75 }]}>
      {Icon && <Icon size={small ? 14 : 16} color={fg} />}
      <Text keepColor style={[s.buttonText, small && { fontSize: T.size.xs }, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

export function SearchBox({ value, onChange, placeholder = 'جست‌وجو…' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <View style={s.search}>
      <Search size={16} color={T.color.textFaint} />
      <TextInput accessibilityLabel={placeholder} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={T.color.textFaint} style={s.searchInput} />
      {!!value && <Pressable accessibilityRole="button" onPress={() => onChange('')} hitSlop={8}><X size={14} color={T.color.textFaint} /></Pressable>}
    </View>
  );
}

export function Segmented<K extends string>({ value, onChange, options }: { value: K; onChange: (value: K) => void; options: { id: K; label: string; count?: number }[] }) {
  return (
    <View style={s.segmented}>
      {options.map(option => {
        const active = option.id === value;
        return (
          <Pressable key={option.id} accessibilityRole="button" onPress={() => onChange(option.id)} style={[s.segment, active && s.segmentActive]}>
            <Text keepColor style={[s.segmentText, active && s.segmentTextActive]}>{option.label}{option.count !== undefined ? ` (${fa(option.count)})` : ''}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  const text = value === null || value === undefined || value === '' ? '—' : typeof value === 'number' ? fa(value) : value;
  return (
    <View style={s.field}>
      <Text style={s.fieldLabel}>{label}</Text>
      <Text selectable style={s.fieldValue}>{text}</Text>
    </View>
  );
}

export function Banner({ kind, text, onClose }: { kind: 'error' | 'notice' | 'warning'; text: string; onClose?: () => void }) {
  const tone: AdminTone = kind === 'error' ? 'danger' : kind === 'warning' ? 'warning' : 'success';
  const colors = toneColors(tone);
  return (
    <View accessibilityRole={kind === 'error' ? 'alert' : undefined} style={[s.banner, { backgroundColor: colors.bg, borderColor: colors.fg }]}>
      <Text keepColor style={[s.bannerText, { color: colors.fg }]}>{text}</Text>
      {onClose && <Pressable accessibilityRole="button" onPress={onClose} hitSlop={8}><X size={16} color={colors.fg} /></Pressable>}
    </View>
  );
}

export function EmptyState({ icon: Icon, title, hint }: { icon?: ComponentType<{ size?: number; color?: string }>; title: string; hint?: string }) {
  return (
    <View style={s.empty}>
      {Icon && <Icon size={30} color={T.color.textFaint} />}
      <Text style={s.emptyTitle}>{title}</Text>
      {!!hint && <Text style={s.emptyHint}>{hint}</Text>}
    </View>
  );
}

export function Loading({ label = 'در حال بارگذاری…' }: { label?: string }) {
  return <View style={s.loading}><ActivityIndicator color={T.color.accent} /><Text style={s.emptyHint}>{label}</Text></View>;
}

export function Avatar({ name, tone = 'accent' }: { name: string; tone?: AdminTone }) {
  const colors = toneColors(tone);
  return <View style={[s.avatar, { backgroundColor: colors.bg }]}><Text keepColor style={[s.avatarText, { color: colors.fg }]}>{(name || '?').trim().slice(0, 1)}</Text></View>;
}

export function ListRow({ children, onPress, dimmed }: { children: ReactNode; onPress?: () => void; dimmed?: boolean }) {
  const content = <View style={[s.listRow, dimmed && { opacity: 0.6 }]}>{children}</View>;
  if (!onPress) return content;
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => pressed && { backgroundColor: T.color.surfaceMuted }}>{content}</Pressable>;
}

export const adminStyles = StyleSheet.create({
  name: { fontFamily: T.font.faStrong, fontSize: T.size.md, color: T.color.text, textAlign: 'right' },
  muted: { fontFamily: T.font.fa, fontSize: T.size.sm, color: T.color.textMuted, textAlign: 'right', lineHeight: 19 },
  mono: { fontFamily: T.font.mono, fontSize: T.size.sm, color: T.color.textMuted, textAlign: 'left', writingDirection: 'ltr' },
  input: { fontFamily: T.font.fa, fontSize: T.size.md, color: T.color.text, backgroundColor: T.color.surface, borderWidth: 1, borderColor: T.color.border, borderRadius: T.radius.md, paddingHorizontal: 12, paddingVertical: 10, textAlign: 'right' },
  actions: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  grid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 10 },
});

const s = StyleSheet.create({
  page: { gap: T.space.lg, padding: T.space.lg, maxWidth: 1240, width: '100%', alignSelf: 'center' },
  pageHead: { flexDirection: 'row-reverse', alignItems: 'flex-start', justifyContent: 'space-between', gap: T.space.md, flexWrap: 'wrap' },
  pageTitle: { fontFamily: T.font.faStrong, fontSize: T.size.xl, color: T.color.text, textAlign: 'right' },
  pageSubtitle: { fontFamily: T.font.fa, fontSize: T.size.sm, color: T.color.textMuted, textAlign: 'right', marginTop: 2 },
  pageActions: { flexDirection: 'row-reverse', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  card: { backgroundColor: T.color.surface, borderWidth: 1, borderColor: T.color.border, borderRadius: T.radius.lg, overflow: 'hidden' },
  cardHead: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', paddingHorizontal: T.space.lg, paddingTop: T.space.md, paddingBottom: T.space.sm, borderBottomWidth: 1, borderColor: T.color.border, backgroundColor: T.color.surfaceMuted },
  cardTitle: { fontFamily: T.font.faStrong, fontSize: T.size.md, color: T.color.text, textAlign: 'right' },
  cardBody: { padding: T.space.lg, gap: T.space.md },
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: T.space.sm, flexWrap: 'wrap' },
  stat: { flex: 1, minWidth: 150, backgroundColor: T.color.surface, borderWidth: 1, borderColor: T.color.border, borderRadius: T.radius.lg, padding: T.space.md, gap: 4 },
  statTop: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  statIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  statLabel: { fontFamily: T.font.fa, fontSize: T.size.sm, color: T.color.textMuted, textAlign: 'right' },
  statValue: { fontFamily: T.font.faStrong, fontSize: T.size.kpi, lineHeight: 36, color: T.color.text, textAlign: 'right' },
  statHint: { fontFamily: T.font.fa, fontSize: T.size.xs, color: T.color.textFaint, textAlign: 'right' },
  chip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, alignSelf: 'flex-start' },
  chipText: { fontFamily: T.font.faStrong, fontSize: T.size.xs },
  button: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 38, paddingHorizontal: 14, paddingVertical: 8, borderRadius: T.radius.md },
  buttonSmall: { minHeight: 30, paddingHorizontal: 10, paddingVertical: 5 },
  buttonGhost: { borderWidth: 1, borderColor: T.color.border },
  buttonText: { fontFamily: T.font.faStrong, fontSize: T.size.sm },
  search: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, backgroundColor: T.color.surface, borderWidth: 1, borderColor: T.color.border, borderRadius: T.radius.md, paddingHorizontal: 10, minHeight: 38, flex: 1, minWidth: 180 },
  searchInput: { flex: 1, fontFamily: T.font.fa, fontSize: T.size.md, color: T.color.text, textAlign: 'right', paddingVertical: 6 },
  segmented: { flexDirection: 'row-reverse', backgroundColor: T.color.surfaceMuted, borderRadius: T.radius.md, padding: 3, gap: 2, flexWrap: 'wrap' },
  segment: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  segmentActive: { backgroundColor: T.color.surface, borderWidth: 1, borderColor: T.color.border },
  segmentText: { fontFamily: T.font.fa, fontSize: T.size.sm, color: T.color.textMuted },
  segmentTextActive: { fontFamily: T.font.faStrong, color: T.color.text },
  field: { minWidth: 140, flexGrow: 1, gap: 2 },
  fieldLabel: { fontFamily: T.font.fa, fontSize: T.size.xs, color: T.color.textFaint, textAlign: 'right' },
  fieldValue: { fontFamily: T.font.faStrong, fontSize: T.size.sm, color: T.color.text, textAlign: 'right' },
  banner: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: T.radius.md, paddingHorizontal: 12, paddingVertical: 10 },
  bannerText: { flex: 1, fontFamily: T.font.faStrong, fontSize: T.size.sm, textAlign: 'right', lineHeight: 20 },
  empty: { alignItems: 'center', justifyContent: 'center', padding: 28, gap: 6 },
  emptyTitle: { fontFamily: T.font.faStrong, fontSize: T.size.md, color: T.color.textMuted, textAlign: 'center' },
  emptyHint: { fontFamily: T.font.fa, fontSize: T.size.sm, color: T.color.textFaint, textAlign: 'center' },
  loading: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20 },
  avatar: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: T.font.faStrong, fontSize: T.size.lg },
  listRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingHorizontal: T.space.lg, paddingVertical: 10, borderTopWidth: 1, borderColor: T.color.border, flexWrap: 'wrap' },
});
