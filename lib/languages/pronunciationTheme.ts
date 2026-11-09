import { findLanguageEntry, type LanguageId } from './registry';

/**
 * Visual identity of the pronunciation workshop.
 *
 * The palette is derived from the `accent` colour of the language's single
 * registry entry, so a new language never needs a hand-written theme: its
 * accent colour produces the header, progress bar, tinted cards and buttons.
 */
export interface PronunciationTheme {
  accent: string;
  accentDark: string;
  soft: string;
  canvas: string;
  surface: string;
  ink: string;
  text: string;
  muted: string;
  border: string;
  gold: string;
  home: string;
  locale: string;
  languageFa: string;
  brand: string;
}

const toRgb = (hex: string): [number, number, number] => {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.split('').map(char => char + char).join('') : value;
  const parsed = Number.parseInt(full.slice(0, 6), 16);
  if (!Number.isFinite(parsed)) return [99, 86, 217];
  return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255];
};

const toHex = (rgb: readonly [number, number, number]) =>
  `#${rgb.map(channel => Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, '0')).join('')}`;

/** Move `hex` towards `target` by `weight` (0 keeps `hex`, 1 returns `target`). */
const mix = (hex: string, target: string, weight: number) => {
  const from = toRgb(hex);
  const into = toRgb(target);
  return toHex([0, 1, 2].map(index => from[index] + (into[index] - from[index]) * weight) as [number, number, number]);
};

const upperFor = (text: string, locale: string) => {
  try {
    return text.toLocaleUpperCase(locale);
  } catch {
    return text.toUpperCase();
  }
};

export function pronunciationTheme(language: LanguageId): PronunciationTheme {
  const entry = findLanguageEntry(language) ?? findLanguageEntry('en');
  const accent = entry?.accent ?? '#6356d9';
  const locale = entry?.speechLocale ?? 'en-US';
  return {
    accent,
    accentDark: mix(accent, '#0b0c18', 0.52),
    soft: mix(accent, '#ffffff', 0.9),
    canvas: mix(accent, '#ffffff', 0.96),
    surface: '#ffffff',
    ink: '#191a31',
    text: '#56566d',
    muted: '#858398',
    border: mix(accent, '#e7e2ec', 0.75),
    gold: '#d8b76e',
    home: entry?.home ?? '/languages',
    locale,
    languageFa: entry?.name ?? 'انگلیسی',
    brand: `${upperFor(entry?.nativeName ?? 'English', locale)} · PRONUNCIATION`,
  };
}
