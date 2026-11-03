import { Platform, type TextStyle, type ViewStyle } from 'react-native';

export const DESIGN_VARIANT = process.env.EXPO_PUBLIC_DESIGN_VARIANT || 'learner-v2';

/** Calm, editorial palette shared across the learner app and its native builds. */
const calmColors = {
  primary: {
    50: '#EFF3EE',
    100: '#E4ECE4',
    200: '#CFDDCE',
    300: '#AFC3B0',
    400: '#8FA893',
    500: '#728D75',
    600: '#5D765F',
    700: '#4B614D',
    800: '#394B3B',
    900: '#29372D',
  },
  accent: {
    50: '#F8F4EA',
    100: '#F0E9D7',
    200: '#E6D9B7',
    300: '#CBB98A',
    400: '#B59D6A',
    500: '#A08756',
    600: '#866E46',
    700: '#725B3B',
    800: '#604C33',
  },
  success: {
    50: '#EFF4EE',
    100: '#DFE9DE',
    300: '#78937A',
    400: '#6F896F',
    500: '#5D765F',
    600: '#4B614D',
    700: '#3F5442',
    800: '#334638',
  },
  warning: {
    50: '#F8F4EA',
    100: '#F0E7D2',
    300: '#927444',
    400: '#A08756',
    500: '#B49A70',
    600: '#92774D',
    700: '#775F3C',
    800: '#614B30',
  },
  error: {
    50: '#FAF0ED',
    100: '#F1DED8',
    300: '#B66D60',
    400: '#AA6256',
    500: '#9B554B',
    600: '#884840',
    700: '#713C36',
    800: '#5C312D',
  },
  neutral: {
    0: '#29362F',
    50: '#3B473F',
    100: '#4E5A51',
    200: '#657066',
    300: '#778179',
    400: '#899189',
    500: '#A2A89F',
    600: '#BEC2BA',
    700: '#D9DBD4',
    800: '#E7E8E1',
    850: '#FFFEFB',
    900: '#F1F0E9',
    950: '#F5F4EF',
  },
  onColor: '#FFFFFF',
  onColorSoft: 'rgba(255,255,255,0.9)',
} as const;

/** Kept as aliases so existing feature-variant imports remain source-compatible. */
const legacyColors = calmColors;
const learnerColors = calmColors;
export const Colors = DESIGN_VARIANT === 'learner-v2' ? learnerColors : legacyColors;

export const Shadows = {
  card: {
    shadowColor: '#35443A',
    shadowOpacity: 0.055,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  full: 9999,
};

export const Typography = {
  // Persian UI and Persian numerals use bundled Vazir; explicit LTR teaching
  // copy uses bundled Inter, so neither path depends on an OEM font.
  fontFamily: 'Vazir',
  mediumFontFamily: 'Vazir-Medium',
  boldFontFamily: 'Vazir-Bold',
  numberFontFamily: 'Vazir-Black',
  latinFontFamily: 'Inter-ExtraBold',
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
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
  social: '#9A7077',
  communication: '#758C97',
  productivity: '#738A77',
  entertainment: '#B47F68',
  system: '#77837B',
  finance: '#7D8B70',
  game: '#8A7B93',
  other: '#8E937F',
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

/** Shared surfaces for the language selector and the learner experience. */
export const DesignTokens = {
  surface: {
    canvas: '#F5F4EF',
    card: '#FFFEFB',
  },
  brand: {
    primarySoft: '#E4ECE4',
    primaryStrong: '#728D75',
  },
  border: {
    default: '#E5E6DF',
  },
  text: {
    primary: '#29362F',
    secondary: '#778179',
  },
} as const;
