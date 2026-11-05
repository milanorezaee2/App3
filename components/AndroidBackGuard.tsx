import { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
import Constants from 'expo-constants';

// Learner apps only: consume the Android hardware back button so learners can
// only navigate with the app's own back/home buttons. This keeps learners from
// leaving the app (or breaking out of a lesson flow) by accident. Admin builds
// keep the default system behavior.
export function AndroidBackGuard() {
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    if (Constants.expoConfig?.extra?.appRole === 'admin') return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => subscription.remove();
  }, []);
  return null;
}
