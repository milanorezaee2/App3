import { Redirect } from 'expo-router';

/**
 * The Emma AI coach is switched off in every language for now (no API tokens available).
 * The route stays registered so old links and resume snapshots land on the conversation hub.
 */
export default function EmmaDisabled() {
  return <Redirect href={'/conversations' as never} />;
}
