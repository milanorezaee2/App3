import type { LearningLesson } from '@/lib/languages/types';
import LanguageDialoguePractice, { type DialogueMode } from '@/components/LanguageDialoguePractice';

/** Russian guided dialogue. Layout is shared; only the recall hint names the language. */
export default function RussianDialoguePractice({ dialogue, onSpeak, locale, defaultMode, branchPool }: {
  dialogue: LearningLesson['dialogue'];
  onSpeak: (text: string) => void;
  locale?: string;
  branchPool?: ReadonlyArray<{ text: string; fa: string }>;
  defaultMode?: DialogueMode;
}) {
  return <LanguageDialoguePractice dialogue={dialogue} onSpeak={onSpeak} languageLabel="روسی" locale={locale} branchPool={branchPool} productive defaultMode={defaultMode} />;
}
