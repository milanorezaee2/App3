import { Platform } from 'react-native';
import * as Application from 'expo-application';
import { FEATURES } from './features';
import { ensureChatIdentity } from './conversations';
import { getLocalProfile, markLocalProfileRegistered } from './localProfile';
import { isSupabaseConfigured } from './pairing';
import { supabase } from './supabase';

/**
 * Open five-language app: once the learner activates the device profile, the
 * app signs in anonymously (device identity) and registers name + e-mail on
 * the server so Admin App lists the learner and cloud features work.
 */
export async function registerOpenLearnerOnServer(): Promise<'registered' | 'skipped'> {
  if (!FEATURES.openLearnerAccount || !isSupabaseConfigured()) return 'skipped';
  const profile = await getLocalProfile();
  if (!profile?.verifiedAt) return 'skipped';
  await ensureChatIdentity(profile.fullName);
  const { error } = await supabase.rpc('register_device_learner', {
    p_full_name: profile.fullName,
    p_email: profile.email,
    p_platform: Platform.OS,
    p_app_version: Application.nativeApplicationVersion || '1.0.0',
  });
  if (error) {
    if (/could not find the function|does not exist/i.test(error.message)) {
      throw new Error('ثبت در پنل مدیریت هنوز روی سرور فعال نشده است (supabase/SETUP-DEVICE-LEARNERS-ONCE.sql را اجرا کنید).');
    }
    if (/ACCOUNT_IS_EMAIL/.test(error.message)) throw new Error('این دستگاه قبلاً با حساب ایمیلی ثبت شده است.');
    throw new Error(error.message);
  }
  await markLocalProfileRegistered();
  return 'registered';
}

/** Best-effort: retry registration and refresh last-seen on app open. */
export async function ensureOpenLearnerRegistered(): Promise<void> {
  if (!FEATURES.openLearnerAccount || !isSupabaseConfigured()) return;
  try {
    const profile = await getLocalProfile();
    if (!profile?.verifiedAt) return;
    if (!profile.serverRegisteredAt) {
      await registerOpenLearnerOnServer();
      return;
    }
    await supabase.rpc('touch_device_learner', { p_app_version: Application.nativeApplicationVersion || '1.0.0' });
  } catch {
    // Offline or server not prepared; the profile screen shows the state.
  }
}

/** The device identity that cloud sync and chat use for this learner. */
export async function openLearnerUserId(): Promise<string | null> {
  if (!FEATURES.openLearnerAccount) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}
