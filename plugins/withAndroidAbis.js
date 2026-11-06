const { withGradleProperties } = require('@expo/config-plugins');

/**
 * Limits which CPU architectures are packaged into the Android build.
 *
 * By default React Native packages four ABIs (armeabi-v7a, arm64-v8a, x86,
 * x86_64). x86 and x86_64 only matter for emulators; without them the release
 * APK loses roughly half of its native libraries. Measured on this project, the
 * universal APK is ~100 MB and the library folder is ~70% of it.
 *
 * This stays opt-in because the CI smoke test runs on an x86_64 emulator and
 * would not be able to install an arm-only APK.
 *
 *   MILO_ANDROID_ABIS=arm64-v8a,armeabi-v7a npx expo prebuild --platform android
 *
 * With the variable unset nothing changes: Expo's default list is preserved.
 */

const DEFAULT_ABIS = 'armeabi-v7a,arm64-v8a,x86,x86_64';
const KNOWN_ABIS = new Set(['armeabi-v7a', 'arm64-v8a', 'x86', 'x86_64']);

function resolveAbis(raw) {
  if (!raw) return null;
  const requested = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (!requested.length) {
    throw new Error('[withAndroidAbis] MILO_ANDROID_ABIS is set but empty.');
  }

  const unknown = requested.filter((abi) => !KNOWN_ABIS.has(abi));
  if (unknown.length) {
    throw new Error(
      `[withAndroidAbis] Unknown ABI(s): ${unknown.join(', ')}. ` +
      `Expected any of: ${[...KNOWN_ABIS].join(', ')}.`,
    );
  }

  return requested;
}

module.exports = function withAndroidAbis(config) {
  const requested = resolveAbis(process.env.MILO_ANDROID_ABIS);
  if (!requested) return config;

  const value = [...new Set(requested)].join(',');

  return withGradleProperties(config, (cfg) => {
    const withoutExisting = cfg.modResults.filter(
      (item) => !(item.type === 'property' && item.key === 'reactNativeArchitectures'),
    );

    // Keep the surrounding comments and ordering intact, and only replace the
    // single property we own.
    const index = cfg.modResults.findIndex(
      (item) => item.type === 'property' && item.key === 'reactNativeArchitectures',
    );

    if (index === -1) {
      withoutExisting.push({ type: 'property', key: 'reactNativeArchitectures', value });
      cfg.modResults = withoutExisting;
    } else {
      cfg.modResults[index] = { ...cfg.modResults[index], value };
    }

    console.log(`[withAndroidAbis] reactNativeArchitectures=${value}`);
    return cfg;
  });
};

module.exports.DEFAULT_ABIS = DEFAULT_ABIS;
module.exports.resolveAbis = resolveAbis;
