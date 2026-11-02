import Constants from 'expo-constants';

/** Deployment switches, not authorization. Server roles/RLS remain mandatory. */
const privateAdminBuild = Constants.expoConfig?.extra?.appRole === 'admin';
const educationAdminEnabled = privateAdminBuild || process.env.EXPO_PUBLIC_ENABLE_EDUCATION_ADMIN === 'true';
/** True in the private manager APK. Chat and user tools then run as the manager. */
export const MANAGEMENT_BUILD = privateAdminBuild || process.env.EXPO_PUBLIC_MILO_ADMIN_APP === 'true';
/** Legacy Russian-only build switch, retained for existing deployments. */
export const RUSSIAN_ONLY_BUILD = process.env.EXPO_PUBLIC_RUSSIAN_ONLY === 'true';

export type LearnerAuthMode = 'required' | 'optional' | 'none';
const configuredAuthMode = process.env.EXPO_PUBLIC_LEARNER_AUTH_MODE;
export const LEARNER_AUTH_MODE: LearnerAuthMode = configuredAuthMode === 'optional' || configuredAuthMode === 'none'
  ? configuredAuthMode
  : 'required';
const configuredLanguageIds = (process.env.EXPO_PUBLIC_ENABLED_LANGUAGES || 'en,ru,tr')
  .split(',')
  .map(language => language.trim().toLowerCase())
  .filter(Boolean);

/** Course visibility is a build-time product choice, never an access-control boundary. */
export function isLanguageEnabled(languageId: string | undefined): boolean {
  if (!languageId) return false;
  if (RUSSIAN_ONLY_BUILD) return languageId === 'ru';
  return configuredLanguageIds.includes(languageId);
}

export const FEATURES = Object.freeze({
  /**
   * Required in the Turkish APK; optional in the Russian guest APK. Authenticated
   * backend operations remain protected by Supabase RLS in either build.
   */
  learnerLogin: LEARNER_AUTH_MODE === 'required',
  learnerLoginEntry: LEARNER_AUTH_MODE === 'optional',
  adminPanel: educationAdminEnabled,
  educationEnrollment: educationAdminEnabled,
  // Roadmap modules are not implemented yet. Enabling a boolean cannot build them.
  contentEditor: false,
  assignments: false,
  announcements: false,
  billing: false,
  russianCourse: true,
});
