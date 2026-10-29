import { Redirect } from 'expo-router';
import RussianReview from '@/components/RussianReview';
import { FEATURES } from '@/lib/features';

export default function RussianReviewRoute() {
  return FEATURES.russianCourse ? <RussianReview /> : <Redirect href={'/languages' as never} />;
}
