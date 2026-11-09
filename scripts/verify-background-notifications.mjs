#!/usr/bin/env node
/**
 * Guards the Firebase-free chat alerts.
 *
 * Android push needs Google's FCM, which cannot be provisioned without a
 * billable Google project. Instead the app asks Android's own scheduler to poll
 * for new messages about every 15 minutes and posts a local notification. These
 * checks keep that path honest: it must not silently drift back to FCM, it must
 * never copy message text, and it must not repeat an alert for one message.
 */
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFileSync(path.join(root, file), 'utf8');
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks += 1; };

const pkg = JSON.parse(read('package.json'));
const config = JSON.parse(read('app.json')).expo;
const moduleSource = read('lib/backgroundChatChecks.ts');
const card = read('components/ChatAlertSettingsCard.tsx');
const layout = read('app/_layout.tsx');
const conversations = read('app/conversations/index.tsx');

check(pkg.dependencies['expo-background-task'] && pkg.dependencies['expo-task-manager'], 'the Android background scheduler packages are installed');
check(config.plugins.includes('expo-background-task') && config.plugins.includes('expo-task-manager'), 'both plugins are declared in app.json');
check(/setNotificationChannelAsync/.test(moduleSource) && /BACKGROUND_CHAT_INTERVAL_MINUTES = 15/.test(moduleSource), 'the worker uses the chat channel and the 15-minute Android minimum');
check(!/getExpoPushTokenAsync|googleServicesFile|@react-native-firebase/.test(moduleSource), 'the alert path never asks Google for a push token');
check(!/\.select\([^)]*\bbody\b/.test(moduleSource), 'the worker never fetches the private message text');
check(/scheduleNotificationAsync/.test(moduleSource) && /trigger:\s*null/.test(moduleSource), 'alerts are posted as immediate local notifications');
check(/isTaskRegisteredAsync/.test(moduleSource) && /reconcileBackgroundChatChecks/.test(layout), 'the worker is restored when the app starts after an update or reboot');
check(/ChatAlertSettingsCard/.test(conversations), 'the switch lives where the conversations are, not in a hidden screen');
check(/تأخیر/.test(card) && /۱۵ دقیقه/.test(card) && /متن پیام ذخیره یا ارسال نمی‌شود/.test(card), 'the switch states the delay and the privacy limit plainly');
check(/permission-denied/.test(moduleSource) && /restricted/.test(moduleSource), 'a denied permission or a restricted phone is reported instead of pretending alerts work');

// ---------------------------------------------------------------------------
// Behavioural test with stubbed Expo modules and a fake Supabase client.
const cache = path.join(root, 'node_modules', '.cache', 'background-chat-test');
mkdirSync(cache, { recursive: true });
const entry = path.join(cache, 'entry.ts');
writeFileSync(entry, `export * from '${path.join(root, 'lib/backgroundChatChecks.ts')}';\n`);

const esbuild = await import('esbuild');
const bundle = await esbuild.build({
  entryPoints: [entry], bundle: true, write: false, format: 'esm', platform: 'node', target: 'node22', logLevel: 'silent',
  plugins: [{ name: 'background-chat-stubs', setup(build) {
    const stub = (contents, loader = 'js') => ({ contents, loader });
    build.onResolve({ filter: /^react-native$/ }, () => ({ path: 'rn', namespace: 'stub' }));
    build.onLoad({ filter: /^rn$/, namespace: 'stub' }, () => stub(`export const Platform = { OS: 'android', Version: 34 };`));
    build.onResolve({ filter: /^expo-notifications$/ }, () => ({ path: 'notifications', namespace: 'stub' }));
    build.onLoad({ filter: /^notifications$/, namespace: 'stub' }, () => stub(`
      export const AndroidImportance = { HIGH: 4 };
      export const __state = globalThis.__bgTest;
      export async function setNotificationChannelAsync(id, options) { __state.channels.push({ id, options }); }
      export async function getPermissionsAsync() { return { granted: __state.permissionGranted, canAskAgain: true }; }
      export async function requestPermissionsAsync() { __state.permissionRequests += 1; return { granted: __state.permissionGranted }; }
      export async function scheduleNotificationAsync(request) { __state.notifications.push(request); return 'stub-id'; }
    `));
    build.onResolve({ filter: /^expo-task-manager$/ }, () => ({ path: 'taskmanager', namespace: 'stub' }));
    build.onLoad({ filter: /^taskmanager$/, namespace: 'stub' }, () => stub(`
      export const __state = globalThis.__bgTest;
      export function defineTask(name, executor) { __state.definedTasks[name] = executor; }
      export async function isTaskRegisteredAsync(name) { return __state.registeredTasks.includes(name); }
    `));
    build.onResolve({ filter: /^expo-background-task$/ }, () => ({ path: 'backgroundtask', namespace: 'stub' }));
    build.onLoad({ filter: /^backgroundtask$/, namespace: 'stub' }, () => stub(`
      export const __state = globalThis.__bgTest;
      export const BackgroundTaskStatus = { Restricted: 1, Available: 2 };
      export const BackgroundTaskResult = { Success: 1, Failed: 2 };
      export async function getStatusAsync() { return __state.taskStatus; }
      export async function registerTaskAsync(name, options) { __state.registeredTasks.push(name); __state.registerOptions.push(options); }
      export async function unregisterTaskAsync(name) { __state.registeredTasks = __state.registeredTasks.filter(item => item !== name); __state.unregisterCalls += 1; }
    `));
    build.onResolve({ filter: /^@react-native-async-storage\/async-storage$/ }, () => ({ path: 'storage', namespace: 'stub' }));
    build.onLoad({ filter: /^storage$/, namespace: 'stub' }, () => stub(`
      export default {
        async getItem(key) { return globalThis.__bgTest.storage.has(key) ? globalThis.__bgTest.storage.get(key) : null; },
        async setItem(key, value) { globalThis.__bgTest.storage.set(key, value); },
        async removeItem(key) { globalThis.__bgTest.storage.delete(key); },
      };
    `));
    build.onResolve({ filter: /^\.\/(supabase|educationAdmin|features)$/ }, args => ({ path: args.path, namespace: 'local-stub' }));
    build.onLoad({ filter: /.*/, namespace: 'local-stub' }, args => stub(args.path === './features'
      ? `export const MANAGEMENT_BUILD = false;`
      : `export const supabase = globalThis.__bgTest.client; export function adminClient() { return globalThis.__bgTest.client; }`));
  } }],
});
const outfile = path.join(cache, 'bundle.mjs');
writeFileSync(outfile, bundle.outputFiles[0].text);

const state = {
  storage: new Map(),
  notifications: [],
  channels: [],
  permissionGranted: true,
  permissionRequests: 0,
  taskStatus: 2,
  registeredTasks: [],
  registerOptions: [],
  unregisterCalls: 0,
  definedTasks: {},
  rows: [],
  senderName: 'سارا',
  userId: 'user-1',
  queryError: null,
};
globalThis.__bgTest = state;

const makeBuilder = () => {
  const filters = [];
  const builder = {
    select() { return builder; },
    gt(column, value) { filters.push([column, value]); return builder; },
    neq() { return builder; },
    eq() { return builder; },
    order() { return builder; },
    async limit() {
      const rows = state.rows.filter(row => filters.every(([column, value]) => String(row[column]) > String(value)));
      return { data: rows, error: state.queryError };
    },
    async maybeSingle() { return { data: { display_name: state.senderName }, error: null }; },
  };
  return builder;
};
state.client = {
  auth: { async getSession() { return { data: { session: state.userId ? { user: { id: state.userId } } : null } }; } },
  from() { return makeBuilder(); },
};

const app = await import(`${outfile}?run=${Date.now()}`);

check(state.definedTasks[app.BACKGROUND_CHAT_TASK], 'the periodic worker is defined at module load for the Android scheduler');
check(await app.backgroundChatChecksStatus() === 'disabled', 'alerts start switched off until the user asks for them');
check(await app.runBackgroundChatCheck() === 0 && state.notifications.length === 0, 'a switched-off worker never posts an alert');

const enabled = await app.enableBackgroundChatChecks();
check(enabled === 'enabled', 'turning the switch on registers the worker');
check(state.registeredTasks.includes(app.BACKGROUND_CHAT_TASK), 'the worker is registered with Android');
check(state.registerOptions.every(option => option.minimumInterval === 15), 'registration asks Android for the 15-minute minimum, never a fake instant interval');
check(state.storage.get(app.BACKGROUND_CHAT_ENABLED_KEY) === '1', 'the choice survives an app restart');

const seedKey = `milo_background_chat_last_seen_v1:${state.userId}`;
check(typeof state.storage.get(seedKey) === 'string', 'enabling records a starting point so old history is not announced');

// First run without a stored marker only seeds the marker.
const now = Date.now();
const stamp = offsetSeconds => new Date(now + offsetSeconds * 1000).toISOString();
state.storage.delete(seedKey);
state.rows = [{ id: 'm1', conversation_id: 'c1', sender_id: 'other', message_type: 'text', created_at: stamp(60) }];
check(await app.runBackgroundChatCheck() === 0 && state.notifications.length === 0, 'the very first check seeds silently instead of blasting old messages');
state.storage.set(seedKey, stamp(-60));
check(await app.runBackgroundChatCheck() === 1 && state.notifications.length === 1, 'a real new message produces exactly one local alert');
const alert = state.notifications[0];
check(/پیام تازه/.test(alert.content.title) && /سارا/.test(alert.content.title), 'the alert names the sender without opening the message');
check(alert.content.data.conversationId === 'c1' && /\/conversations\/human\/c1/.test(alert.content.data.route), 'tapping the alert opens the exact conversation');
check(alert.content.body === 'برای خواندن، میلو را باز کنید.' && !JSON.stringify(alert.content).includes('sender_id'), 'the alert body is a fixed hint, never the message text or database identifiers');
check(state.channels.length >= 1 && state.channels.every(channel => channel.id === 'milo-chat'), 'alerts share the existing chat channel instead of inventing a silent one');

// The same message must not be announced twice.
check(await app.runBackgroundChatCheck() === 0 && state.notifications.length === 1, 'the same message is not announced again on the next wake-up');
state.rows = [
  ...state.rows,
  { id: 'm2', conversation_id: 'c1', sender_id: 'other', message_type: 'text', created_at: stamp(120) },
  { id: 'm3', conversation_id: 'c1', sender_id: 'other', message_type: 'voice', created_at: stamp(180) },
];
check(await app.runBackgroundChatCheck() === 2, 'both waiting messages are counted');
check(state.notifications.length === 2 && /2 پیام تازه/.test(state.notifications[1].content.title), 'several waiting messages collapse into one grouped alert');

// Signed-out devices do nothing.
state.userId = null;
const before = state.notifications.length;
check(await app.runBackgroundChatCheck() === 0 && state.notifications.length === before, 'a signed-out device never posts chat alerts');
state.userId = 'user-1';

// A failing query must not crash the worker or lose the marker.
state.queryError = { message: 'network down' };
await assert.rejects(app.runBackgroundChatCheck()); checks += 1;
state.queryError = null;

const disabled = await app.disableBackgroundChatChecks();
check(disabled === 'disabled' && state.unregisterCalls === 1 && !state.registeredTasks.includes(app.BACKGROUND_CHAT_TASK), 'switching off really unregisters the Android worker');
check(await app.runBackgroundChatCheck() === 0, 'the worker stays silent after being switched off');

// Permission and device restrictions are reported, not faked.
state.permissionGranted = false;
check(await app.enableBackgroundChatChecks() === 'permission-denied', 'a denied notification permission is reported honestly');
state.permissionGranted = true;
state.taskStatus = 1;
check(await app.enableBackgroundChatChecks() === 'restricted', 'a phone that blocks background work is reported honestly');

console.log(`${checks} background chat alert checks passed (no Firebase, 15-minute local polling, per-message dedupe).`);
