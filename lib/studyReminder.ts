import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

/**
 * One quiet daily study reminder.
 *
 * The rules are deliberately conservative: a single repeating local notification, no server, no
 * push token, and it is skipped when the learner has already studied today. Nothing here touches
 * the chat notification channel or the background chat service.
 */
export const STUDY_REMINDER_KEY = 'milo_study_reminder_v1';
export const STUDY_REMINDER_CHANNEL = 'milo-study';
const IDENTIFIER = 'milo-study-reminder';
const PERMISSION_PROMPTED_KEY = 'milo_study_reminder_prompted_v1';

export interface StudyReminderSettings {
  enabled: boolean;
  /** Local hour (0–23) of the daily nudge. */
  hour: number;
  minute: number;
  /** Last calendar day (YYYY-MM-DD) the learner completed a lesson, used to skip pointless nudges. */
  lastStudiedDay: string;
}

export type StudyReminderStatus = 'scheduled' | 'disabled' | 'unsupported' | 'permission-denied' | 'error';

export const DEFAULT_REMINDER_HOUR = 20;

export const REMINDER_OPTIONS: ReadonlyArray<{ hour: number; label: string }> = [
  { hour: 8, label: '۸ صبح' },
  { hour: 12, label: '۱۲ ظهر' },
  { hour: 17, label: '۵ عصر' },
  { hour: 20, label: '۸ شب' },
  { hour: 22, label: '۱۰ شب' },
];

const defaults = (): StudyReminderSettings => ({ enabled: false, hour: DEFAULT_REMINDER_HOUR, minute: 0, lastStudiedDay: '' });

export function localDayKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export async function loadStudyReminder(): Promise<StudyReminderSettings> {
  try {
    const raw = await AsyncStorage.getItem(STUDY_REMINDER_KEY);
    if (!raw) return defaults();
    const parsed = JSON.parse(raw) as Partial<StudyReminderSettings>;
    return {
      enabled: parsed.enabled === true,
      hour: Number.isInteger(parsed.hour) && parsed.hour! >= 0 && parsed.hour! <= 23 ? parsed.hour! : DEFAULT_REMINDER_HOUR,
      minute: Number.isInteger(parsed.minute) && parsed.minute! >= 0 && parsed.minute! <= 59 ? parsed.minute! : 0,
      lastStudiedDay: typeof parsed.lastStudiedDay === 'string' ? parsed.lastStudiedDay : '',
    };
  } catch {
    return defaults();
  }
}

async function save(settings: StudyReminderSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(STUDY_REMINDER_KEY, JSON.stringify(settings));
  } catch {
    /* Local preference only; a storage failure must never break study. */
  }
}

async function ensureChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(STUDY_REMINDER_CHANNEL, {
    name: 'یادآور مطالعه',
    description: 'یک یادآوری روزانهٔ آرام برای ادامهٔ درس',
    // Quiet: no heads-up pop-up, no sound battle with chat.
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 90],
    lightColor: '#4338CA',
    enableVibrate: true,
    showBadge: true,
  }).catch(() => undefined);
}

/** The single reminder is always replaced, never duplicated. */
async function cancelScheduled(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(IDENTIFIER);
  } catch {
    /* Not scheduled: nothing to cancel. */
  }
}

function bodyFor(hour: number): { title: string; body: string } {
  if (hour < 12) return { title: 'صبحِ یک درس کوتاه', body: 'یک درس ۵ دقیقه‌ای، قبل از شلوغی روز. آماده‌ای؟' };
  if (hour < 18) return { title: 'یک استراحت یادگیری', body: 'چند دقیقه تمرین، جای بهتری برای امروزت می‌سازد.' };
  return { title: 'درس امروز مانده', body: 'فقط یک درس کوتاه؛ زنجیرهٔ روزهایت را نگه دار.' };
}

export async function scheduleStudyReminder(settings: StudyReminderSettings): Promise<StudyReminderStatus> {
  if (Platform.OS === 'web') return 'unsupported';
  if (!settings.enabled) {
    await cancelScheduled();
    await save({ ...settings, enabled: false });
    return 'disabled';
  }
  await ensureChannel();
  try {
    let granted = (await Notifications.getPermissionsAsync()).granted;
    if (!granted) {
      const asked = await Notifications.requestPermissionsAsync();
      granted = asked.granted;
      try { await AsyncStorage.setItem(PERMISSION_PROMPTED_KEY, '1'); } catch { /* ignore */ }
    }
    if (!granted) {
      await save({ ...settings, enabled: false });
      return 'permission-denied';
    }
    await cancelScheduled();
    const copy = bodyFor(settings.hour);
    await Notifications.scheduleNotificationAsync({
      identifier: IDENTIFIER,
      content: {
        title: copy.title,
        body: copy.body,
        sound: 'default',
        data: { eventId: 'study-reminder', route: '/lang', kind: 'study' },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: settings.hour, minute: settings.minute },
    });
    await save({ ...settings, enabled: true });
    return 'scheduled';
  } catch {
    return 'error';
  }
}

/** Called after a lesson is completed: marks today so the app can tell the reminder is unnecessary. */
export async function noteStudyToday(date = new Date()): Promise<void> {
  const settings = await loadStudyReminder();
  await save({ ...settings, lastStudiedDay: localDayKey(date) });
}

/** True when the learner already finished a lesson today, so a nudge would be noise. */
export async function studiedToday(date = new Date()): Promise<boolean> {
  const settings = await loadStudyReminder();
  return settings.lastStudiedDay === localDayKey(date);
}

/** Human summary used by the settings card. */
export async function studyReminderSummary(): Promise<string> {
  const settings = await loadStudyReminder();
  if (!settings.enabled) return 'خاموش — هیچ یادآوری‌ای نمی‌فرستیم.';
  if (Platform.OS === 'web') return 'در این پیش‌نمایش وب اعلان زمان‌بندی نمی‌شود؛ روی گوشی کار می‌کند.';
  const label = REMINDER_OPTIONS.find(item => item.hour === settings.hour)?.label ?? `${settings.hour}:00`;
  return `هر روز ${label} — و اگر امروز درسی کامل نکرده باشی.`;
}
