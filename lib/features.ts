import Constants from 'expo-constants';
import { Platform } from 'react-native';
import {
  ADMIN_DEFAULT_SCOPE,
  LANGUAGE_IDS,
  NATIVE_DEFAULT_SCOPE,
  isLanguageId,
  type LanguageId,
} from './languages/registry';

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
  .filter(isLanguageId);
export const LANGUAGE_SCOPE: ReadonlyArray<LanguageId> = Object.freeze(
  configuredLanguageScope.length
    ? Array.from(new Set(configuredLanguageScope)) as LanguageId[]
    : MANAGEMENT_BUILD ? [...ADMIN_DEFAULT_SCOPE] : Platform.OS === 'web' ? [...LANGUAGE_IDS] : [...NATIVE_DEFAULT_SCOPE],
);
export const isLanguageEnabled = (language: string | undefined): boolean =>
  language === 'en' || (isLanguageId(language) && LANGUAGE_SCOPE.includes(language));

export const FEATURES = Object.freeze({
  /**
   * Learner authentication is off by default. An explicit 'true' at build time
   * opts into the existing login flow; server authorization remains separate.
   */
  learnerLogin: process.env.EXPO_PUBLIC_LEARNER_LOGIN === 'true',
  /**
   * Open five-language app: no login wall, but a device profile (e-mail +
   * app-generated code) is registered on the server so the manager sees the
   * learner and cloud sync/chat use the same identity as the login app.
   */
  openLearnerAccount: process.env.EXPO_PUBLIC_LEARNER_LOGIN !== 'true' && process.env.EXPO_PUBLIC_LEARNER_FIVE_NOLOGIN === 'true',
  adminPanel: educationAdminEnabled,
  educationEnrollment: educationAdminEnabled,
  // Roadmap modules are not implemented yet. Enabling a boolean cannot build them.
  contentEditor: false,
  assignments: false,
  announcements: false,
  billing: false,
  /** Subscription infrastructure exists; the live switch lives on the server (admin → اشتراک). */
  subscriptions: true,
  russianCourse: true,
});
