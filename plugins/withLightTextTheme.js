const { withAndroidStyles } = require('@expo/config-plugins');

/**
 * Pin the native Android theme to light with black default text, and refuse
 * the system "force dark" override. Without this, a phone in dark mode (or
 * with force-dark enabled) can render native text white on the app's light
 * surfaces in some build flavours.
 */
module.exports = function withLightTextTheme(config) {
  return withAndroidStyles(config, androidConfig => {
    const styles = androidConfig.modResults;
    const appTheme = styles.resources.style?.find(style => style.$.name === 'AppTheme');
    if (appTheme) {
      appTheme.$.parent = 'Theme.AppCompat.Light.NoActionBar';
      const set = (name, value) => {
        appTheme.item = appTheme.item || [];
        const existing = appTheme.item.find(item => item.$.name === name);
        if (existing) existing._ = value;
        else appTheme.item.push({ $: { name }, _: value });
      };
      set('android:textColor', '#000000');
      set('android:textColorPrimary', '#000000');
      set('android:textColorSecondary', '#000000');
      set('android:editTextColor', '#000000');
      set('android:forceDarkAllowed', 'false');
    }
    return androidConfig;
  });
};
