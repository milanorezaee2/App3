import Constants from 'expo-constants';

/** Deployment switches, not authorization. Server roles/RLS remain mandatory. */
const privateAdminBuild = Constants.expoConfig?.extra?.appRole === 'admin';
const educationAdminEnabled = privateAdminBuild || process.env.EXPO_PUBLIC_ENABLE_EDUCATION_ADMIN === 'true';
/** True in the private manager APK. Chat and user tools then run as the manager. */
export const MANAGEMENT_BUILD = privateAdminBuild || process.env.EXPO_PUBLIC_MILO_ADMIN_APP === 'true';
/** Build-time switch: a learner APK that contains only the Russian course. */
export const RUSSIAN_ONLY_BUILD = process.env.EXPO_PUBLIC_RUSSIAN_ONLY === 'true';

/** Each distributed app has an explicit course scope. */
const configuredLanguageScope = (process.env.EXPO_PUBLIC_LANGUAGE_SCOPE || '')
  .split(',')
  .map(value => value.trim().toLowerCase())
  .filter(value => value === 'en' || value === 'ru' || value === 'tr');
export const LANGUAGE_SCOPE: ReadonlyArray<'en' | 'ru' | 'tr'> = Object.freeze(
  configuredLanguageScope.length
    ? Array.from(new Set(configuredLanguageScope)) as Array<'en' | 'ru' | 'tr'>
    : MANAGEMENT_BUILD ? ['en', 'tr'] : ['en', 'ru'],
);
export const isLanguageEnabled = (language: string | undefined): boolean =>
  language === 'en' || LANGUAGE_SCOPE.includes(language as 'en' | 'ru' | 'tr');

export const FEATURES = Object.freeze({
  /**
   * Learner builds must authenticate before entering the app. The private
   * management build is bypassed separately above.
   */
  learnerLogin: process.env.EXPO_PUBLIC_LEARNER_LOGIN === 'true',
  adminPanel: educationAdminEnabled,
  educationEnrollment: educationAdminEnabled,
  // Roadmap modules are not implemented yet. Enabling a boolean cannot build them.
  contentEditor: false,
  assignments: false,
  announcements: false,
  billing: false,
  russianCourse: true,
});
