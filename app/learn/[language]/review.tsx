import { useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import RussianReview from '@/components/RussianReview';

export default function LanguageReviewRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  return language === 'ru' ? <RussianReview /> : <CoursePage title="مرور پیدا نشد">{null}</CoursePage>;
}
