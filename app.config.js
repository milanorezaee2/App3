const fs = require('node:fs');
const path = require('node:path');

const base = require('./app.json').expo;

// Android push delivery (FCM v1) needs the Firebase client config inside the
// native build. Each APK variant has its own package name, so each one needs
// its own file. The files are optional: while they are missing the build stays
// exactly as before and push registration simply cannot obtain a device token.
const GOOGLE_SERVICES_FILES = {
  learner: 'google-services.learner.json',
  login: 'google-services.login.json',
  admin: 'google-services.admin.json',
  russian: 'google-services.russian.json',
};

const variant = () => {
  const admin = process.env.MILO_ADMIN_APP === 'true' || process.env.EXPO_PUBLIC_MILO_ADMIN_APP === 'true';
  if (admin) return 'admin';
  if (process.env.EXPO_PUBLIC_RUSSIAN_ONLY === 'true') return 'russian';
  if (process.env.EXPO_PUBLIC_LEARNER_LOGIN === 'true') return 'login';
  return 'learner';
};

const withGoogleServices = (config, name) => {
  const file = GOOGLE_SERVICES_FILES[name];
  if (!file || !fs.existsSync(path.join(__dirname, file))) return config;
  return {
    ...config,
    android: { ...config.android, googleServicesFile: `./${file}` },
  };
};

const build = () => {
  const admin = process.env.MILO_ADMIN_APP === 'true' || process.env.EXPO_PUBLIC_MILO_ADMIN_APP === 'true';
  if (process.env.EXPO_PUBLIC_RUSSIAN_ONLY === 'true' && !admin) {
    return {
      ...base,
      name: 'MiloMultiLanguage Russian',
      slug: 'milo-russian',
      scheme: 'milorussian',
      android: {
        ...base.android,
        package: 'com.devicecontrol.milorussian',
      },
      ios: {
        ...base.ios,
        bundleIdentifier: 'com.devicecontrol.milorussian',
      },
    };
  }
  const learnerLogin = process.env.EXPO_PUBLIC_LEARNER_LOGIN === 'true';
  if (!admin && learnerLogin) {
    return {
      ...base,
      name: 'MiloMultiLanguage Login',
      android: { ...base.android, package: 'com.devicecontrol.milomultilang' },
      ios: { ...base.ios, bundleIdentifier: 'com.devicecontrol.milomultilang' },
    };
  }
  if (!admin) return base;
  return {
    ...base,
    name: 'MiloMultiLanguage Admin',
    // All three APK variants share one EAS project; native identifiers keep
    // the admin build isolated from the learner builds.
    slug: base.slug,
    scheme: 'miloadmin',
    android: {
      ...base.android,
      package: 'com.devicecontrol.miloadmin',
      label: 'Milo Admin',
      versionCode: 2,
    },
    ios: {
      ...base.ios,
      bundleIdentifier: 'com.devicecontrol.miloadmin',
    },
    extra: {
      ...base.extra,
      appRole: 'admin',
    },
  };
};

// EAS project id comes from the EAS_PROJECT_ID env (set in CI from a repo variable),
// which Expo push tokens require. Without it, push registration is skipped.
module.exports = () => {
  const config = withGoogleServices(build(), variant());
  const projectId = process.env.EAS_PROJECT_ID || process.env.EXPO_PUBLIC_EAS_PROJECT_ID;
  if (!projectId) return config;
  return {
    ...config,
    extra: { ...config.extra, eas: { ...(config.extra?.eas || {}), projectId } },
  };
};
