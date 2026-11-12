/**
 * Independent visual language of the management panel: neutral, compact and
 * table-oriented, deliberately different from the warm learner app.
 */
export const AdminTheme = Object.freeze({
  color: {
    canvas: '#EEF1F5',
    surface: '#FFFFFF',
    surfaceMuted: '#F6F8FA',
    border: '#D5DBE3',
    borderStrong: '#B9C2CE',
    text: '#0F172A',
    textMuted: '#475569',
    textFaint: '#64748B',
    sidebar: '#111827',
    sidebarText: '#E5E7EB',
    sidebarMuted: '#9CA3AF',
    sidebarActive: '#1F2937',
    accent: '#0E7490',
    accentSoft: '#E0F2F7',
    accentText: '#155E75',
    success: '#15803D',
    successSoft: '#DCFCE7',
    warning: '#B45309',
    warningSoft: '#FEF3C7',
    danger: '#B91C1C',
    dangerSoft: '#FEE2E2',
    info: '#1D4ED8',
    infoSoft: '#DBEAFE',
  },
  radius: { sm: 6, md: 10, lg: 14 },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  font: {
    fa: 'Beiruti',
    faStrong: 'Beiruti-Bold',
    mono: 'monospace',
  },
  size: { xs: 11, sm: 12, md: 14, lg: 17, xl: 24, kpi: 30 },
});

export type AdminTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export function toneColors(tone: AdminTone): { fg: string; bg: string } {
  const c = AdminTheme.color;
  switch (tone) {
    case 'accent': return { fg: c.accentText, bg: c.accentSoft };
    case 'success': return { fg: c.success, bg: c.successSoft };
    case 'warning': return { fg: c.warning, bg: c.warningSoft };
    case 'danger': return { fg: c.danger, bg: c.dangerSoft };
    case 'info': return { fg: c.info, bg: c.infoSoft };
    default: return { fg: c.textMuted, bg: c.surfaceMuted };
  }
}
