#!/usr/bin/env node
/**
 * Guards the opt-in, Firebase-free Android chat notification path.
 * Android delivery is a user-started native foreground service using Supabase
 * Realtime over WebSocket; iOS retains its existing scheduled fallback.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFileSync(path.join(root, file), 'utf8');
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks += 1; };

const pkg = JSON.parse(read('package.json'));
const app = JSON.parse(read('app.json')).expo;
const appConfig = read('app.config.js');
const service = read('modules/milo-chat-foreground/android/src/main/java/expo/modules/milochatforeground/MiloChatForegroundService.kt');
const nativeModule = read('modules/milo-chat-foreground/android/src/main/java/expo/modules/milochatforeground/MiloChatForegroundModule.kt');
const encryptedStore = read('modules/milo-chat-foreground/android/src/main/java/expo/modules/milochatforeground/EncryptedChatSessionStore.kt');
const nativeManifest = read('modules/milo-chat-foreground/android/src/main/AndroidManifest.xml');
const jsBridge = read('modules/milo-chat-foreground/index.ts');
const background = read('lib/backgroundChatChecks.ts');
const notifications = read('lib/chatNotifications.ts');
const authStorage = read('lib/chatServiceAuthStorage.ts');
const authLifecycle = read('lib/chatForegroundService.ts');
const card = read('components/ChatAlertSettingsCard.tsx');
const config = read('app.config.js');
const iconPath = path.join(root, app.plugins.find(plugin => Array.isArray(plugin) && plugin[0] === 'expo-notifications')[1].icon.replace('./', ''));

check(pkg.dependencies['expo-notifications'], 'Expo local notifications are installed');
check(pkg.dependencies['expo-modules-core'] || pkg.dependencies.expo, 'Expo native module runtime is available');
check(existsSync(path.join(root, 'modules/milo-chat-foreground/expo-module.config.json')), 'the local Expo module is registered for autolinking');
check(existsSync(iconPath), 'the configured monochrome notification icon exists');
check(/notification-icon\.png/.test(app.plugins.find(plugin => Array.isArray(plugin) && plugin[0] === 'expo-notifications')[1].icon), 'Expo uses the dedicated status-bar icon');
check(/extra\?\.eas\?\.projectId/.test(appConfig), 'app.config.js retains the static EAS project id when CI environment variables are absent');
check(/google-services file/.test(appConfig) && /does not use these files/.test(appConfig), 'Android FCM client files are optional for the no-FCM path');
check(/<Switch/.test(card) && /permission-denied/.test(card) && /restricted/.test(card), 'the target branch keeps the simplified alert switch and surfaces permission or restriction problems');

// Android native module / service contract.
check(/foregroundServiceType="specialUse"/.test(nativeManifest)
  && /FOREGROUND_SERVICE_SPECIAL_USE/.test(nativeManifest)
  && /PROPERTY_SPECIAL_USE_FGS_SUBTYPE/.test(nativeManifest), 'Android 14+ special-use foreground-service permissions and explanation are declared');
check(/MiloChatForegroundService/.test(nativeManifest) && /stopWithTask="false"/.test(nativeManifest), 'the non-exported service survives removal from recents');
check(/AES\/GCM\/NoPadding/.test(encryptedStore) && /AndroidKeyStore/.test(encryptedStore), 'the background session is encrypted with an Android Keystore key');
check(/getStoredSession/.test(nativeModule) && /storageKey/.test(nativeModule), 'native session recovery is scoped to the matching learner or manager auth storage key');
check(/auth\/v1\/token\?grant_type=refresh_token/.test(service) && /refresh_token/.test(service), 'native listener refreshes Supabase sessions while JavaScript is suspended');
check(/realtime\/v1\/websocket/.test(service) && /"vsn", "1\.0\.0"/.test(service), 'native listener uses the Phoenix protocol version of the locked Supabase Realtime client');
check(/phx_join/.test(service) && /postgres_changes/.test(service) && /access_token/.test(service), 'WebSocket joins authenticated message and support-request change subscriptions');
check(/"messages"/.test(service) && /"support_requests"/.test(service), 'incoming chat and support events are handled');
check(/channelJoinRef = ref/.test(service) && /"heartbeat"/.test(service) && /scheduleReconnect/.test(service), 'the client retains its join reference, sends Phoenix heartbeats and reconnects');
const initialServiceStart = service.slice(service.indexOf('ACTION_START ->'), service.indexOf('ACTION_APP_STATE ->'));
check(initialServiceStart.indexOf('startInForeground(') >= 0
  && initialServiceStart.indexOf('startInForeground(') < initialServiceStart.indexOf('EncryptedChatSessionStore.read(this)')
  && initialServiceStart.indexOf('startInForeground(') < initialServiceStart.indexOf('EncryptedChatSessionStore.write(this, incoming)'), 'initial startForeground happens before any potentially slow Keystore/session access');
const stickyServiceRestart = service.slice(service.indexOf('      else -> {', service.indexOf('override fun onStartCommand')), service.indexOf('\n    }\n    return START_STICKY'));
check(stickyServiceRestart.indexOf('startInForeground(') >= 0
  && stickyServiceRestart.indexOf('startInForeground(') < stickyServiceRestart.indexOf('EncryptedChatSessionStore.read(this)'), 'sticky service restarts enter foreground before reading the encrypted session');
check(/private fun startInForeground\(state: String\): Boolean/.test(service)
  && service.indexOf('startForeground(FOREGROUND_ID') < service.indexOf('EncryptedChatSessionStore.setStatus(this, state)'), 'service health is reported only after Android accepts foreground promotion');
check(/EncryptedChatSessionStore\.setStatus\(context, "starting"\)/.test(nativeModule)
  && /catch \((_|error): Exception\)/.test(nativeModule), 'native launch initializes status and converts platform launch exceptions into a controlled failure');
check(/if \(appForeground \|\| stopRequested/.test(service), 'the service suppresses operating-system notifications while the app is foregrounded');
check(/record\.optString\("sender_id"\) == userId/.test(service), 'the user’s own message is not announced back to them');
check(/postMessageNotification\(current, "message:\$messageId"/.test(service)
  && /wasDelivered\(userId, eventKey\)/.test(service)
  && service.indexOf('manager.notify(') < service.indexOf('markDelivered(userId, eventKey)'), 'new messages are deduplicated and only marked delivered after the local alert is posted');
check(/stableHash\("\$userId:\$eventKey"\)/.test(service), 'notification dedupe stores only hashed event identifiers');
check(!/record\.optString\("body"\)|message_text|google-services\.json|FirebaseMessaging|FCM/.test(service), 'native path never persists or displays message bodies and has no FCM dependency');
check(/ic_stat_milo_chat/.test(service), 'native foreground and chat alerts use a monochrome Android status icon');

// Opt-in settings, auth coordination and local diagnostic behavior.
check(/Platform\.OS === 'android'/.test(background) && /startAndroidChatForegroundService/.test(background), 'Android starts the native service only through the user alert switch');
check(/Platform\.OS === 'web' \|\| Platform\.OS === 'android'\) return 0/.test(background), 'legacy background polling cannot create delayed Android duplicates');
check(/stopAndroidChatForegroundServiceForClient/.test(background), 'turning the switch off stops the Android service');
const androidOptIn = background.slice(
  background.indexOf('export async function enableBackgroundChatChecks'),
  background.indexOf('export async function disableBackgroundChatChecks'),
);
check(androidOptIn.indexOf('startAndroidChatForegroundService') < androidOptIn.indexOf("AsyncStorage.setItem(BACKGROUND_CHAT_ENABLED_KEY, '1')"), 'Android opt-in is saved only after native service startup is confirmed');
check(/reconcileInFlight/.test(background) && /BACKGROUND_CHAT_START_ATTEMPT_KEY/.test(background) && /Crash guard/.test(background), 'boot-time recovery is single-flight and uses a start-attempt marker (not the opt-in) as the crash guard');
check(/teardownUserScope\(signedOut\)/.test(notifications) && /stopNativeService && Platform\.OS === 'android'/.test(notifications), 'JS unmounts and transient session restores never stop the user-enabled native service; only an explicit sign-out does');
check(/restoreLatestAndroidChatSession/.test(notifications) && /stopAutoRefresh/.test(notifications) && /startAutoRefresh/.test(notifications), 'JS auth refresh is coordinated across foreground/background transitions');
check(/Platform\.OS !== 'ios' \|\| !Device\.isDevice/.test(notifications), 'Android no longer attempts Expo FCM push-token registration');
check(/getStoredChatServiceSession/.test(authStorage) && /stopChatForegroundService\(key\)/.test(authStorage), 'auth storage restores native-rotated sessions and stops service on sign-out');
check(/shouldShowBanner: !foreground \|\| isLocalTest/.test(notifications)
  && /local-test:/.test(notifications), 'the local test notification is visible in the foreground despite ordinary chat-alert suppression');
check(/<Switch/.test(card) && /permission-denied/.test(card) && /restricted/.test(card), 'the requested branch keeps the simplified alert switch and surfaces permission or restriction problems');

console.log(`${checks} Android foreground chat-notification checks passed.`);
console.log('Coverage: Expo/EAS config; Keystore session storage; Phoenix protocol; auth refresh; message/support events; de-duplication; opt-in; foreground test delivery; FCM-free path.');
