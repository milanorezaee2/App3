/** Catalogue of the distributed Android apps (package ids match app.config.js). */
export interface AppTarget { package: string; title: string; apk: string; hint: string }
export const APP_TARGETS: readonly AppTarget[] = Object.freeze([
  { package: 'com.devicecontrol.milofive', title: 'MiloMultiLanguage.5 — بدون ورود', apk: 'MiloMultiLanguage.5-NoLogin.apk', hint: 'پنج زبان، بدون صفحهٔ ورود' },
  { package: 'com.devicecontrol.milomultilang', title: 'MiloMultiLanguage.5 — با ورود', apk: 'MiloMultiLanguage.5-Login.apk', hint: 'پنج زبان، با ورود' },
  { package: 'com.devicecontrol.companion', title: 'MiloMultiLanguage — انگلیسی/روسی', apk: 'MiloMultiLanguage-NoLogin.apk', hint: 'انگلیسی و روسی، بدون ورود' },
  { package: 'com.devicecontrol.miloadmin', title: 'Admin App', apk: 'AdminApp.apk', hint: 'پنل مدیریت' },
]);
export const findAppTarget = (pkg: string | null | undefined) => APP_TARGETS.find(t => t.package === pkg) || null;

export interface AppRelease {
  id: string; version_name: string; version_code: number; download_url: string;
  file_size: number | null; sha256: string | null; release_notes: string; mandatory: boolean; created_at: string;
}
