import { useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import RussianReview from '@/components/RussianReview';

/** `/learn/ru/review` opens the shared review frame with the Russian store. */
export default function ReviewRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  if (language === 'ru') return <RussianReview />;
  return <CoursePage title="مرور پیدا نشد">{null}</CoursePage>;
}
