/**
 * Subscription entitlement (infrastructure only). The server switch
 * `app_settings.subscriptions.enabled` is OFF by default, so every learner is
 * treated as fully entitled until the manager turns it on in the admin panel.
 */
import { FEATURES } from './features';
import { isSupabaseConfigured } from './pairing';
import { supabase } from './supabase';

export interface Entitlement { enabled: boolean; tier: 'free' | 'premium'; planCode: string | null; planTitle: string | null; endsAt: string | null; freeLessons: number }
export const FULL_ACCESS: Entitlement = Object.freeze({ enabled: false, tier: 'premium', planCode: null, planTitle: null, endsAt: null, freeLessons: Number.MAX_SAFE_INTEGER });

let cached: { value: Entitlement; at: number } | null = null;

export async function getEntitlement(force = false): Promise<Entitlement> {
  if (!FEATURES.subscriptions || !isSupabaseConfigured()) return FULL_ACCESS;
  if (!force && cached && Date.now() - cached.at < 10 * 60 * 1000) return cached.value;
  try {
    const [{ data: settings }, { data: mine }] = await Promise.all([supabase.rpc('public_app_settings'), supabase.rpc('my_entitlement')]);
    const subs = (settings as { subscriptions?: { enabled?: boolean; free_lessons?: number } } | null)?.subscriptions || {};
    const me = (mine || {}) as { tier?: string; plan_code?: string | null; plan_title?: string | null; ends_at?: string | null };
    const enabled = Boolean(subs.enabled);
    const value: Entitlement = enabled
      ? { enabled: true, tier: me.tier === 'premium' ? 'premium' : 'free', planCode: me.plan_code ?? null, planTitle: me.plan_title ?? null, endsAt: me.ends_at ?? null, freeLessons: Number(subs.free_lessons ?? 10) }
      : FULL_ACCESS;
    cached = { value, at: Date.now() };
    return value;
  } catch { return FULL_ACCESS; }
}

/** True when the learner may open the lesson at `index` (0-based) of a course. */
export function canOpenLesson(entitlement: Entitlement, index: number): boolean {
  return !entitlement.enabled || entitlement.tier === 'premium' || index < entitlement.freeLessons;
}
