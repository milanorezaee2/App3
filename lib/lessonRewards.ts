import { claimMedals, loadMedalProgress, loadSeenMedals, medalsEarnedNow, type Medal } from './lessonMedals';
import { noteStudyToday } from './studyReminder';
import { markPlanStep } from './dailyPlan';

/**
 * The single end-of-lesson hook shared by all four lesson engines.
 *
 * It does two cheap things at the one moment the learner is paying attention:
 *  - surfaces medals that this lesson just unlocked (instead of burying them in the profile),
 *  - records that today has been studied, so the daily reminder does not nag someone who already did.
 */
export interface LessonRewards {
  medals: Medal[];
  /** Sentence position inside a long lesson, for the home card («۵ از ۵۰»). */
  studiedDay: string;
}

export async function finishLessonRewards(): Promise<LessonRewards> {
  const [progress, seen] = await Promise.all([loadMedalProgress(), loadSeenMedals()]);
  const medals = progress.length ? medalsEarnedNow(seen, progress) : [];
  await Promise.all([claimMedals(medals, seen), noteStudyToday(), markPlanStep('lesson')]);
  const today = new Date();
  const studiedDay = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return { medals, studiedDay };
}
