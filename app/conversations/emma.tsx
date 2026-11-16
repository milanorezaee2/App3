import { Redirect } from 'expo-router';
import { MANAGEMENT_BUILD } from '@/lib/features';

/** The Emma AI coach is switched off; learners land on feedback, managers on the chat hub. */
export default function EmmaDisabled() {
  return <Redirect href={(MANAGEMENT_BUILD ? '/conversations' : '/feedback') as never} />;
}
