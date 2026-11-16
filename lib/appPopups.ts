/** Learner-side pop-ups published from the admin panel. */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import type { PopupKind } from '@/features/admin/api';
import { isSupabaseConfigured } from './pairing';
import { popupMatchesPath } from './popupPages';
import { supabase } from './supabase';

export interface LearnerPopup {
  id: string; title: string; body: string; button_label: string | null; button_url: string | null; kind: PopupKind;
  show_once: boolean; priority: number; updated_at: string; target_routes: string[] | null;
}
const SEEN_KEY = 'milo_popups_seen_v1';
// Server answers are reused for a short while so page changes do not hammer the API,
// while a pop-up published in the admin panel still arrives within a minute.
const CACHE_MS = 60 * 1000;
let cache: { at: number; list: LearnerPopup[] } | null = null;
let inflight: Promise<LearnerPopup[]> | null = null;
// Pop-ups that are not "show once" appear at most once per app session (per page).
const shownThisSession = new Set<string>();

async function seenMap(): Promise<Record<string, string>> {
  try { return JSON.parse((await AsyncStorage.getItem(SEEN_KEY)) || '{}'); } catch { return {}; }
}

async function fetchActivePopups(force: boolean): Promise<LearnerPopup[]> {
  if (!isSupabaseConfigured()) return [];
  if (!force && cache && Date.now() - cache.at < CACHE_MS) return cache.list;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const pkg = Application.applicationId || 'web';
      const { data, error } = await supabase.rpc('active_app_popups', { p_package_name: pkg });
      // A failed request keeps the previous answer (if any) and is retried next time.
      if (error || !Array.isArray(data)) return cache?.list ?? [];
      const list = (data as Partial<LearnerPopup>[]).map(p => ({ ...p, target_routes: Array.isArray(p.target_routes) ? p.target_routes : null }) as LearnerPopup);
      cache = { at: Date.now(), list };
      return list;
    } catch { return cache?.list ?? []; } finally { inflight = null; }
  })();
  return inflight;
}

const sessionKey = (popup: LearnerPopup, pathname: string) =>
  `${popup.id}:${popup.updated_at}:${popup.target_routes?.length ? pathname.split('?')[0] : '*'}`;

/** All pop-ups that should be shown on `pathname` right now, in priority order. */
export async function popupsForPage(pathname: string, force = false): Promise<LearnerPopup[]> {
  const list = await fetchActivePopups(force);
  if (!list.length) return [];
  const seen = await seenMap();
  return list.filter(popup => {
    if (!popupMatchesPath(popup.target_routes, pathname)) return false;
    if (popup.show_once) return seen[popup.id] !== popup.updated_at;
    return !shownThisSession.has(sessionKey(popup, pathname));
  });
}

export async function markPopupSeen(popup: LearnerPopup, pathname: string): Promise<void> {
  shownThisSession.add(sessionKey(popup, pathname));
  if (!popup.show_once) return;
  const seen = await seenMap();
  seen[popup.id] = popup.updated_at;
  const entries = Object.entries(seen).slice(-200);
  await AsyncStorage.setItem(SEEN_KEY, JSON.stringify(Object.fromEntries(entries))).catch(() => undefined);
}

/** Forget the cached server answer (e.g. when the app returns to the foreground). */
export function invalidatePopupCache(): void { cache = null; }
