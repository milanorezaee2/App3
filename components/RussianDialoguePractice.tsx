import type { LearningLesson } from '@/lib/languages/types';
import LanguageDialoguePractice from '@/components/LanguageDialoguePractice';

/** Russian guided dialogue. Layout is shared; only the recall hint names the language. */
export default function RussianDialoguePractice({ dialogue, onSpeak }: {
  dialogue: LearningLesson['dialogue'];
  onSpeak: (text: string) => void;
}) {
  return <LanguageDialoguePractice dialogue={dialogue} onSpeak={onSpeak} languageLabel="روسی" />;
}
