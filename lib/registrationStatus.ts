import { FEATURES } from './features';
import { getLocalProfile } from './localProfile';
import { getRegisteredSession } from './userRegistration';

/**
 * True once the learner has completed sign-up on this device: a verified local
 * profile (no-login builds) or a registered account session (login builds).
 */
export async function isLearnerRegistered(): Promise<boolean> {
  try {
    if (!FEATURES.learnerLogin) {
      const stored = await getLocalProfile();
      return !!stored?.verifiedAt;
    }
    const { profile } = await getRegisteredSession();
    return !!profile;
  } catch {
    return false;
  }
}
