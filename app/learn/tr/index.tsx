import { Redirect } from 'expo-router';
import { FEATURES } from '@/lib/features';
import TurkishHome from '@/components/TurkishHome';

export default function TurkishHomeRoute() {
  return FEATURES.turkishCourse ? <TurkishHome /> : <Redirect href={'/languages' as never} />;
}
