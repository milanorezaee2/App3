import * as Speech from 'expo-speech';

/**
 * Voice rotation: when the device has more than one TTS voice for a language, consecutive
 * sentences alternate between them so the ear does not lock onto a single speaker.
 * The choice is deterministic per sentence (same text → same voice), and callers must fall back
 * to the default voice if the chosen one fails to start.
 */
/**
 * Rotation is OFF: learners found alternating speakers confusing. Every sentence now plays with
 * the device's default voice for the language (the previous behaviour). Flip to true to re-enable.
 */
const VOICE_ROTATION_ENABLED = false;

let cache: Promise<Speech.Voice[]> | null = null;
const perLanguage = new Map<string, string[]>();

function loadVoices(): Promise<Speech.Voice[]> {
  if (!cache) cache = Speech.getAvailableVoicesAsync().catch(() => [] as Speech.Voice[]);
  return cache;
}

/** Warm the cache early (call once at lesson start); safe to call repeatedly. */
export function warmVoices(): void { void loadVoices(); }

function hash(text: string): number { let h = 0; for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0; return h; }

/** Return a voice identifier for this locale and text, or undefined when rotation is not possible. */
export async function voiceFor(locale: string, text: string): Promise<string | undefined> {
  if (!VOICE_ROTATION_ENABLED) return undefined;
  const lang = locale.slice(0, 2).toLowerCase();
  let ids = perLanguage.get(lang);
  if (!ids) {
    const voices = await loadVoices();
    const region = locale.toLowerCase().replace('_', '-');
    const exact = voices.filter(v => (v.language ?? '').toLowerCase().replace('_', '-') === region);
    const same = exact.length >= 2 ? exact : voices.filter(v => (v.language ?? '').toLowerCase().startsWith(lang));
    // Prefer non-network, non-"low quality" voices; keep the list stable.
    ids = same
      .filter(v => !/network/i.test(v.identifier) || same.length <= 2)
      .map(v => v.identifier)
      .filter((id, index, all) => all.indexOf(id) === index)
      .slice(0, 4);
    perLanguage.set(lang, ids);
  }
  if (ids.length < 2) return undefined;
  return ids[hash(text) % ids.length];
}
