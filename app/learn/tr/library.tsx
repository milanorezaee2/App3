import { Redirect } from 'expo-router';
import { FEATURES } from '@/lib/features';
import TurkishLibrary from '@/components/TurkishLibrary';

export default function TurkishLibraryRoute() {
  return FEATURES.turkishCourse ? <TurkishLibrary /> : <Redirect href={'/languages' as never} />;
}
