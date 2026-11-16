import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { localDayKey } from './studyReminder';

/**
 * The three-step «برنامهٔ امروز» shown on every course home.
 *
 * One lesson, the reviews that are actually due, and one optional bit of speaking practice — each
 * with a done/not-done state, so the learner can see the shape of today instead of guessing.
 */
export interface DailyPlanStep {
  id: 'lesson' | 'review' | 'speak';
  title: string;
  detail: string;
  done: boolean;
  route: string;
}

const KEY = 'milo_daily_plan_v1';

interface PlanDayRecord {
  day: string;
  lesson: boolean;
  review: boolean;
  speak: boolean;
}

async function readRaw(): Promise<PlanDayRecord | null> {
  try {
    const raw = Platform.OS === 'web'
      ? window.localStorage.getItem(KEY)
      : await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PlanDayRecord>;
    if (typeof parsed.day !== 'string') return null;
    return { day: parsed.day, lesson: parsed.lesson === true, review: parsed.review === true, speak: parsed.speak === true };
  } catch {
    return null;
  }
}

async function writeRaw(record: PlanDayRecord): Promise<void> {
  try {
    const raw = JSON.stringify(record);
    if (Platform.OS === 'web') window.localStorage.setItem(KEY, raw);
    else await AsyncStorage.setItem(KEY, raw);
  } catch {
    /* Local checklist only. */
  }
}

export type PlanStepId = DailyPlanStep['id'];

export async function markPlanStep(id: PlanStepId, done = true, now = new Date()): Promise<void> {
  const today = localDayKey(now);
  const current = await readRaw();
  const base: PlanDayRecord = current?.day === today ? current : { day: today, lesson: false, review: false, speak: false };
  await writeRaw({ ...base, [id]: done });
}

/**
 * Builds today's card. `lessonDone` and `reviewsDue` come from the course's own progress, so the plan
 * never claims something the rest of the app disagrees with.
 */
export async function buildDailyPlan(input: {
  lessonDone: boolean;
  reviewsDue: number;
  lessonRoute: string;
  reviewRoute: string;
  speakRoute: string;
  now?: Date;
}): Promise<DailyPlanStep[]> {
  const today = localDayKey(input.now ?? new Date());
  const stored = await readRaw();
  const record: PlanDayRecord = stored?.day === today ? stored : { day: today, lesson: false, review: false, speak: false };
  return [
    {
      id: 'lesson',
      title: 'یک درس',
      detail: input.lessonDone ? 'امروز درس را کامل کردی' : 'یک درس کوتاه، حدود ۵ تا ۱۰ دقیقه',
      done: input.lessonDone || record.lesson,
      route: input.lessonRoute,
    },
    {
      id: 'review',
      title: 'مرور',
      detail: input.reviewsDue > 0 ? `${input.reviewsDue} کارت سررسید` : 'مروری سررسید نشده',
      done: input.reviewsDue === 0 || record.review,
      route: input.reviewRoute,
    },
    {
      id: 'speak',
      title: 'گفتار',
      detail: record.speak ? 'امروز بلند تمرین کردی' : 'یک تمرین تلفظ یا واژهٔ گفتاری',
      done: record.speak,
      route: input.speakRoute,
    },
  ];
}
