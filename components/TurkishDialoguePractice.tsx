import type { LearningLesson } from '@/lib/languages/types';
import LanguageDialoguePractice, { type DialogueMode } from '@/components/LanguageDialoguePractice';

/** Turkish guided dialogue. Layout is shared; only the recall hint names the language. */
export default function TurkishDialoguePractice({ dialogue, onSpeak, locale, branchPool, defaultMode }: {
  dialogue: LearningLesson['dialogue'];
  onSpeak: (text: string) => void;
  locale?: string;
  branchPool?: ReadonlyArray<{ text: string; fa: string }>;
  defaultMode?: DialogueMode;
}) {
  return <LanguageDialoguePractice dialogue={dialogue} onSpeak={onSpeak} languageLabel="ترکی" locale={locale} branchPool={branchPool} productive defaultMode={defaultMode} />;
}
