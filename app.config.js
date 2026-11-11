const fs = require('node:fs');
const path = require('node:path');

const originalBase = require('./app.json').expo;
// GitHub Pages keeps /App3; managed root-domain builds opt into a root URL.
const base = process.env.EXPO_PUBLIC_WEB_ROOT === 'true'
  ? { ...originalBase, experiments: { ...originalBase.experiments, baseUrl: '' } }
  : originalBase;

// Optional legacy Expo remote push on Android uses FCM v1 and needs the matching
// google-services file. The no-FCM foreground WebSocket/local-notification path
// does not use these files. Each APK variant has its own Android package name.
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
  if (!admin && process.env.EXPO_PUBLIC_LEARNER_FIVE_NOLOGIN === 'true') {
    return {
      ...base,
      name: 'MiloMultiLanguage 5',
      scheme: 'milofive',
      android: { ...base.android, package: 'com.devicecontrol.milofive' },
      ios: { ...base.ios, bundleIdentifier: 'com.devicecontrol.milofive' },
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

module.exports = () => {
  const config = withGoogleServices(build(), variant());
  // app.json already contains the project id; environment values only override it.
  // Android's native WebSocket service does not require an EAS or FCM project id.
  const projectId = process.env.EAS_PROJECT_ID
    || process.env.EXPO_PUBLIC_EAS_PROJECT_ID
    || config.extra?.eas?.projectId;
  if (!projectId) return config;
  return {
    ...config,
    extra: { ...config.extra, eas: { ...(config.extra?.eas || {}), projectId } },
  };
};
