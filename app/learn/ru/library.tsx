import { Redirect } from 'expo-router';
import { isLanguageEnabled } from '@/lib/features';
import RussianLibrary from '@/components/RussianLibrary';

export default function RussianLibraryRoute() {
  return isLanguageEnabled('ru') ? <RussianLibrary /> : <Redirect href={'/languages' as never} />;
}
