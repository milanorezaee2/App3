const base = require('./app.json').expo;

const build = () => {
  const admin = process.env.MILO_ADMIN_APP === 'true' || process.env.EXPO_PUBLIC_MILO_ADMIN_APP === 'true';
  const russianOnly = process.env.EXPO_PUBLIC_RUSSIAN_ONLY === 'true';
  const learnerAuthMode = process.env.EXPO_PUBLIC_LEARNER_AUTH_MODE === 'optional'
    ? 'optional'
    : process.env.EXPO_PUBLIC_LEARNER_AUTH_MODE === 'none'
      ? 'none'
      : 'required';
  const enabledLanguages = (process.env.EXPO_PUBLIC_ENABLED_LANGUAGES || (russianOnly ? 'ru' : 'en,ru,tr'))
    .split(',')
    .map(language => language.trim().toLowerCase())
    .filter(Boolean)
    .sort()
    .join(',');

  if (russianOnly && !admin) {
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

  if (!admin && enabledLanguages === 'en,tr' && learnerAuthMode === 'required') {
    return {
      ...base,
      name: 'Milo English Turkish',
      slug: 'milo-english-turkish',
      scheme: 'miloenglishturkish',
      android: { ...base.android, package: 'com.devicecontrol.miloenglishturkish' },
      ios: { ...base.ios, bundleIdentifier: 'com.devicecontrol.miloenglishturkish' },
    };
  }

  if (!admin && enabledLanguages === 'en,ru' && learnerAuthMode === 'optional') {
    return {
      ...base,
      name: 'Milo English Russian',
      slug: 'milo-english-russian',
      scheme: 'miloenglishrussian',
      android: { ...base.android, package: 'com.devicecontrol.miloenglishrussian' },
      ios: { ...base.ios, bundleIdentifier: 'com.devicecontrol.miloenglishrussian' },
    };
  }

  if (!admin) return base;
  return {
    ...base,
    name: 'MiloMultiLanguage Admin',
    slug: 'milo-language-admin',
    scheme: 'miloadmin',
    android: {
      ...base.android,
      package: 'com.devicecontrol.miloadmin',
      versionCode: 1,
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
  const config = build();
  const projectId = process.env.EAS_PROJECT_ID || process.env.EXPO_PUBLIC_EAS_PROJECT_ID;
  if (!projectId) return config;
  return {
    ...config,
    extra: { ...config.extra, eas: { ...(config.extra?.eas || {}), projectId } },
  };
};
