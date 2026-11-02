import { Redirect } from 'expo-router';
import { isLanguageEnabled } from '@/lib/features';
import RussianReview from '@/components/RussianReview';

export default function RussianReviewRoute() {
  return isLanguageEnabled('ru') ? <RussianReview /> : <Redirect href={'/languages' as never} />;
}
