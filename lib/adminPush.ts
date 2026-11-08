import { adminClient } from './educationAdmin';
import { registerChatPushTokenForUser } from './chatNotifications';

/** Registers the manager's device using the separate manager auth session. */
export async function registerAdminPushToken(): Promise<void> {
  try {
    const client = adminClient();
    const { data: sessionData } = await client.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return;
    for (const delay of [0, 1500, 5000, 15000]) {
      if (delay) await new Promise(resolve => setTimeout(resolve, delay));
      const token = await registerChatPushTokenForUser(userId, client);
      if (token) return;
    }
  } catch {
    // Push is best effort; the management panel remains usable without it.
  }
}
