import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * One app-wide "days in a row" counter shared by all six languages.
 * A day counts when any lesson is completed. Missing a full day resets it.
 */
const KEY = 'milo.studyStreak.v1';
interface StreakRecord { count: number; lastDate: string; best: number }

function dateKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function yesterdayKey(): string { const d = new Date(); d.setDate(d.getDate() - 1); return dateKey(d); }

async function read(): Promise<StreakRecord> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const value = raw ? JSON.parse(raw) as Partial<StreakRecord> : null;
    if (!value || typeof value.lastDate !== 'string') return { count: 0, lastDate: '', best: 0 };
    return { count: Math.max(0, Number(value.count) || 0), lastDate: value.lastDate, best: Math.max(0, Number(value.best) || 0) };
  } catch { return { count: 0, lastDate: '', best: 0 }; }
}

/** Current streak as the user should see it today (0 once a day has been missed). */
export async function getStudyStreak(): Promise<number> {
  const record = await read();
  const today = dateKey();
  return record.lastDate === today || record.lastDate === yesterdayKey() ? record.count : 0;
}

/** Call after a lesson is completed. Returns the streak after today is counted. */
export async function recordStudyDay(): Promise<{ count: number; extendedToday: boolean }> {
  const record = await read();
  const today = dateKey();
  if (record.lastDate === today) return { count: record.count, extendedToday: false };
  const count = record.lastDate === yesterdayKey() ? record.count + 1 : 1;
  const next: StreakRecord = { count, lastDate: today, best: Math.max(record.best, count) };
  try { await AsyncStorage.setItem(KEY, JSON.stringify(next)); } catch { /* local only */ }
  return { count, extendedToday: true };
}
