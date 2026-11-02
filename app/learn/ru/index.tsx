import { Redirect } from 'expo-router';
import { isLanguageEnabled } from '@/lib/features';
import RussianHome from '@/components/RussianHome';

export default function RussianHomeRoute() {
  return isLanguageEnabled('ru') ? <RussianHome /> : <Redirect href={'/languages' as never} />;
}
