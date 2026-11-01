import { Redirect } from 'expo-router';
import { FEATURES } from '@/lib/features';
import TurkishReview from '@/components/TurkishReview';

export default function TurkishReviewRoute() {
  return FEATURES.turkishCourse ? <TurkishReview /> : <Redirect href={'/languages' as never} />;
}
