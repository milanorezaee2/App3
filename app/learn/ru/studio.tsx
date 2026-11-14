import { Redirect } from 'expo-router';
import { FEATURES } from '@/lib/features';
import RussianLevelStudio from '@/components/RussianLevelStudio';

export default function RussianStudioRoute() {
  return FEATURES.russianCourse ? <RussianLevelStudio /> : <Redirect href={'/languages' as never} />;
}
