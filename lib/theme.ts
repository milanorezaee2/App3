import { Platform, type TextStyle, type ViewStyle } from 'react-native';

export const DESIGN_VARIANT = process.env.EXPO_PUBLIC_DESIGN_VARIANT || 'learner-v2';

const legacyColors = {
  primary: {
    50: '#F1F7FF',
    100: '#E9E7FF',
    200: '#D8D5FF',
    300: '#8D86FF',
    400: '#635BFF',
    500: '#5146E5',
    600: '#4338CA',
    700: '#3730A3',
    800: '#211A68',
    900: '#211A68',
  },
  accent: {
    50: '#EDFCFF',
    100: '#D7F7FC',
    200: '#B3EEF7',
    300: '#46BCD0',
    400: '#20C49A',
    500: '#0EAA83',
    600: '#0E748E',
    700: '#115E73',
    800: '#154E5E',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    300: '#15803d',
    400: '#16a34a',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    300: '#b45309',
    400: '#d97706',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    300: '#b91c1c',
    400: '#dc2626',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
  },
  neutral: {
    0: '#0f172a',
    50: '#1e293b',
    100: '#334155',
    200: '#475569',
    300: '#475569',
    400: '#64748b',
    500: '#94a3b8',
    600: '#b4bfcd',
    700: '#dde3ea',
    800: '#e6eaf0',
    850: '#ffffff',
    900: '#f4f6fa',
    950: '#f6f8fb',
  },
  onColor: '#ffffff',
  onColorSoft: 'rgba(255,255,255,0.85)',
} as const;

/** Learner-first palette; opt-in so current APKs remain unchanged. */
const learnerColors = {
  primary: { 50: '#F3F2FF', 100: '#E9E7FF', 200: '#D8D5FF', 300: '#8D86FF', 400: '#635BFF', 500: '#5146E5', 600: '#4338CA', 700: '#3730A3', 800: '#312E81', 900: '#211A68' },
  accent: { 50: '#ECFDF8', 100: '#D5FAEF', 200: '#AEF3DF', 300: '#5ED8BC', 400: '#20C49A', 500: '#0EAA83', 600: '#07886A', 700: '#08705B', 800: '#0B5A4B' },
  success: legacyColors.success,
  warning: legacyColors.warning,
  error: legacyColors.error,
  neutral: { 0: '#111827', 50: '#1F2937', 100: '#334155', 200: '#475569', 300: '#64748B', 400: '#7C8AA5', 500: '#A8B2C4', 600: '#C7CFDB', 700: '#E0E6EF', 800: '#E8EDF4', 850: '#FFFFFF', 900: '#F5F7FB', 950: '#F8FAFF' },
  onColor: '#FFFFFF',
  onColorSoft: 'rgba(255,255,255,0.86)',
} as const;

export const Colors = DESIGN_VARIANT === 'learner-v2' ? learnerColors : legacyColors;

export const Shadows = {
  card: {
    shadowColor: DESIGN_VARIANT === 'learner-v2' ? '#211A68' : '#0f172a',
    shadowOpacity: DESIGN_VARIANT === 'learner-v2' ? 0.10 : 0.06,
    shadowRadius: DESIGN_VARIANT === 'learner-v2' ? 18 : 12,
    shadowOffset: { width: 0, height: DESIGN_VARIANT === 'learner-v2' ? 8 : 4 },
    elevation: DESIGN_VARIANT === 'learner-v2' ? 4 : 2,
  },
};

export const Spacing = {
  xs: 4,
  sm: 7,
  md: 13,
  lg: 18,
  xl: 24,
  xxl: 36,
};

export const Radius = {
  sm: DESIGN_VARIANT === 'learner-v2' ? 9 : 7,
  md: DESIGN_VARIANT === 'learner-v2' ? 13 : 10,
  lg: DESIGN_VARIANT === 'learner-v2' ? 18 : 14,
  xl: DESIGN_VARIANT === 'learner-v2' ? 26 : 19,
  full: 9999,
};

export const Typography = {
  // Persian UI and Persian numerals use bundled Beiruti; explicit LTR teaching
  // copy uses bundled Inter, so neither path depends on an OEM font.
  fontFamily: 'Beiruti',
  mediumFontFamily: 'Beiruti-Medium',
  boldFontFamily: 'Beiruti-Bold',
  numberFontFamily: 'Beiruti-Black',
  latinFontFamily: 'Times New Roman',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 36,
  },
  weights: {
    regular: '400' as const,
    medium: '400' as const,
    bold: '400' as const,
  },
};

export const CategoryColors: Record<string, string> = {
  social: '#E1306C',
  communication: '#2AABEE',
  productivity: '#4285F4',
  entertainment: '#FF6B35',
  system: '#6B7280',
  finance: '#00A651',
  game: '#7C4DFF',
  other: '#6366f1',
};

export const CategoryLabels: Record<string, string> = {
  social: 'شبکه اجتماعی',
  communication: 'ارتباطات',
  productivity: 'بهره‌وری',
  entertainment: 'سرگرمی',
  system: 'سیستمی',
  finance: 'مالی',
  game: 'بازی',
  other: 'سایر',
};

/**
 * Text/layout direction helpers.
 *
 * On native (the shipping Android APK) `direction: 'rtl' | 'ltr'` is a real
 * Yoga style property that flips the layout of every child view.
 * `react-native-web` does not support `direction` — it logs
 * `Invalid style property of "direction"` and strips it on every render — so on
 * web we use `writingDirection`, which react-native-web compiles to the CSS
 * `direction` property. The RTL case is already covered globally by
 * `document.documentElement.dir = 'rtl'` (see index.js), so it stays empty there.
 */
type DirectionStyle = ViewStyle & TextStyle;

export const RtlDirection: DirectionStyle =
  Platform.OS === 'web' ? { writingDirection: 'rtl' } : { direction: 'rtl', writingDirection: 'rtl' };

export const LtrDirection: DirectionStyle =
  Platform.OS === 'web' ? { writingDirection: 'ltr' } : { direction: 'ltr' };

/**
 * DesignTokens used by the language selector (app/languages.tsx).
 * Added to fix the broken 1a4c40a commit that imported DesignTokens without defining it.
 * Values are aligned with existing Colors + LearningHomeColors so the UI stays consistent.
 */
export const DesignTokens = {
  surface: {
    canvas: DESIGN_VARIANT === 'learner-v2' ? '#F8FAFF' : '#F8FAFF',
    card: '#FFFFFF',
  },
  brand: {
    primarySoft: DESIGN_VARIANT === 'learner-v2' ? '#E9E7FF' : '#E9E7FF',
    primaryStrong: DESIGN_VARIANT === 'learner-v2' ? '#635BFF' : '#635BFF',
  },
  border: {
    default: DESIGN_VARIANT === 'learner-v2' ? '#E3E7F3' : '#E3E7F3',
  },
  text: {
    primary: DESIGN_VARIANT === 'learner-v2' ? '#211A68' : '#211A68',
    secondary: DESIGN_VARIANT === 'learner-v2' ? '#64748B' : '#64748B',
  },
} as const;
