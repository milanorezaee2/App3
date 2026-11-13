/** Learner-side pop-ups published from the admin panel. */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import type { PopupKind } from '@/features/admin/api';
import { isSupabaseConfigured } from './pairing';
import { supabase } from './supabase';

export interface LearnerPopup { id: string; title: string; body: string; button_label: string | null; button_url: string | null; kind: PopupKind; show_once: boolean; priority: number; updated_at: string }
const SEEN_KEY = 'milo_popups_seen_v1';
const LAST_CHECK_KEY = 'milo_popups_last_check_v1';
// A fresh pop-up published in the admin panel must reach learners on their next
// launch or return to the app, so the server is asked again after a short pause.
const CHECK_INTERVAL_MS = 60 * 1000;
// Pop-ups that are not "show once" appear at most once per app session.
const shownThisSession = new Set<string>();

async function seenMap(): Promise<Record<string, string>> {
  try { return JSON.parse((await AsyncStorage.getItem(SEEN_KEY)) || '{}'); } catch { return {}; }
}

/** Next pop-up to show, or null. "show once" pop-ups reappear only after being edited. */
export async function nextPopupToShow(force = false): Promise<LearnerPopup | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const last = Number(await AsyncStorage.getItem(LAST_CHECK_KEY)) || 0;
    if (!force && Date.now() - last < CHECK_INTERVAL_MS) return null;
    const pkg = Application.applicationId || 'web';
    const { data, error } = await supabase.rpc('active_app_popups', { p_package_name: pkg });
    // A failed request must not start the quiet period; try again on the next check.
    if (error || !Array.isArray(data)) return null;
    await AsyncStorage.setItem(LAST_CHECK_KEY, String(Date.now()));
    const seen = await seenMap();
    for (const popup of data as LearnerPopup[]) {
      if (popup.show_once && seen[popup.id] === popup.updated_at) continue;
      if (!popup.show_once && shownThisSession.has(`${popup.id}:${popup.updated_at}`)) continue;
      return popup;
    }
    return null;
  } catch { return null; }
}

export async function markPopupSeen(popup: LearnerPopup): Promise<void> {
  shownThisSession.add(`${popup.id}:${popup.updated_at}`);
  const seen = await seenMap();
  seen[popup.id] = popup.updated_at;
  const entries = Object.entries(seen).slice(-100);
  await AsyncStorage.setItem(SEEN_KEY, JSON.stringify(Object.fromEntries(entries))).catch(() => undefined);
}
