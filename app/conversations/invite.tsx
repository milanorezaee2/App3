import type { ReactElement } from 'react';
import { Redirect } from 'expo-router';

/**
 * Chat is a manager-only tool. `EXPO_PUBLIC_MILO_ADMIN_APP` is inlined at build time, so learner
 * bundles never include the chat screen; learners land on «انتقادات و پیشنهادات».
 */
const Screen: () => ReactElement = process.env.EXPO_PUBLIC_MILO_ADMIN_APP === 'true'
  ? (require('@/features/chat/screens/InviteContact').default as () => ReactElement)
  : function ChatUnavailable() { return <Redirect href={'/feedback' as never} />; };
export default Screen;
