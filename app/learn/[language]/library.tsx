import { useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import { CourseLibrary } from '@/components/course/CourseLibrary';
import { FEATURES } from '@/lib/features';
import { courseById } from '@/lib/languages/courseRegistry';

/** German and Russian share one library layout; only their content differs. */
export default function LanguageLibraryRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  if (language === 'ru' && !FEATURES.russianCourse) return <CoursePage title="این مسیر آموزشی پیدا نشد">{null}</CoursePage>;
  const course = language === 'de' || language === 'ru' ? courseById(language) : undefined;
  if (!course) return <CoursePage title="این مسیر آموزشی پیدا نشد">{null}</CoursePage>;
  return <CourseLibrary key={course.id} course={course} />;
}
