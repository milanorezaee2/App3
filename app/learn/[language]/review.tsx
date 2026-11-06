import StarterReview from '@/components/StarterReview';
import { NEW_COURSES, isNewLanguage } from '@/lib/languages/newCourses';
import { useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import RussianReview from '@/components/RussianReview';
import TurkishReview from '@/components/TurkishReview';

export default function LanguageReviewRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  if (isNewLanguage(language)) return <StarterReview key={language} course={NEW_COURSES[language]} />;
  if (language === 'ru') return <RussianReview />;
  if (language === 'tr') return <TurkishReview />;
  return <CoursePage title="مرور پیدا نشد">{null}</CoursePage>;
}
