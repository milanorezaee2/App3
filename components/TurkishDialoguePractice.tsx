import type { LearningLesson } from '@/lib/languages/types';
import LanguageDialoguePractice from '@/components/LanguageDialoguePractice';

/** Turkish guided dialogue. Layout is shared; only the recall hint names the language. */
export default function TurkishDialoguePractice({ dialogue, onSpeak }: {
  dialogue: LearningLesson['dialogue'];
  onSpeak: (text: string) => void;
}) {
  return <LanguageDialoguePractice dialogue={dialogue} onSpeak={onSpeak} languageLabel="ترکی" />;
}
