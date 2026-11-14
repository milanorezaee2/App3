import { useMemo } from 'react';
import LanguageLevelStudio, { type LevelStudioConfig } from '@/components/LanguageLevelStudio';
import { RussianBottomNav } from '@/components/RussianBottomNav';
import { TurkishBottomNav } from '@/components/TurkishBottomNav';
import { StarterBottomNav } from '@/components/StarterBottomNav';
import { RUSSIAN_LESSONS, RUSSIAN_LEVELS, russianProgress } from '@/lib/languages/russian';
import { TURKISH_LESSONS, TURKISH_LEVELS, turkishProgress } from '@/lib/languages/turkish';
import type { StarterCourse } from '@/lib/languages/newCourses';
import { playRussianSpeech, stopRussianSpeech } from '@/lib/russianSpeech';
import { playTurkishSpeech, stopTurkishSpeech } from '@/lib/turkishSpeech';
import { playStarterSpeech, stopStarterSpeech } from '@/lib/starterSpeech';

/** Per-course wiring for the shared end-of-level exam + daily supplement screen. */
const RUSSIAN: LevelStudioConfig = {
  courseId: 'ru', nameFa: 'روسی', levels: RUSSIAN_LEVELS, lessons: RUSSIAN_LESSONS, progress: russianProgress,
  speak: text => { void playRussianSpeech(text, 0.85, () => undefined); }, stopSpeech: () => { void stopRussianSpeech(); }, BottomNav: RussianBottomNav,
};
const TURKISH: LevelStudioConfig = {
  courseId: 'tr', nameFa: 'ترکی', levels: TURKISH_LEVELS, lessons: TURKISH_LESSONS, progress: turkishProgress,
  speak: text => { void playTurkishSpeech(text, 0.85, () => undefined); }, stopSpeech: () => { void stopTurkishSpeech(); }, BottomNav: TurkishBottomNav,
};

export function RussianLevelStudio() { return <LanguageLevelStudio config={RUSSIAN} />; }
export function TurkishLevelStudio() { return <LanguageLevelStudio config={TURKISH} />; }
export function StarterLevelStudio({ course }: { course: StarterCourse }) {
  const config = useMemo<LevelStudioConfig>(() => ({
    courseId: course.id, nameFa: course.name, levels: course.levels, lessons: course.lessons, progress: course.progress,
    speak: text => { void playStarterSpeech(course.locale, text, 0.85, () => undefined); }, stopSpeech: () => { void stopStarterSpeech(); },
    BottomNav: () => <StarterBottomNav course={course} />,
  }), [course]);
  return <LanguageLevelStudio config={config} />;
}
