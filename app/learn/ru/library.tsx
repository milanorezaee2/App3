import { Redirect } from 'expo-router';
import { CourseLibrary } from '@/components/course/CourseLibrary';
import { FEATURES } from '@/lib/features';
import { RUSSIAN_COURSE } from '@/lib/languages/courseRegistry';

export default function RussianLibraryRoute() {
  return FEATURES.russianCourse ? <CourseLibrary course={RUSSIAN_COURSE} /> : <Redirect href={'/languages' as never} />;
}
