import { requireNativeModule } from 'expo';
import { Platform } from 'react-native';

export type ChatForegroundServiceConfig = {
  supabaseUrl: string;
  anonKey: string;
  userId: string;
  storageKey: string;
  session: Record<string, unknown>;
  appScheme: string;
  isAdmin: boolean;
  appForeground: boolean;
};

type NativeChatForegroundModule = {
  start(configJson: string): Promise<boolean>;
  stop(storageKey: string): Promise<boolean>;
  setAppForegrounded(foreground: boolean): Promise<boolean>;
  getStoredSession(storageKey: string): Promise<string | null>;
  getStatus(): Promise<string>;
  isConfigured(storageKey: string): Promise<boolean>;
};

let cachedModule: NativeChatForegroundModule | null = null;

function getNativeModule(): NativeChatForegroundModule | null {
  if (Platform.OS !== 'android') return null;
  if (!cachedModule) cachedModule = requireNativeModule<NativeChatForegroundModule>('MiloChatForeground');
  return cachedModule;
}

export async function startChatForegroundService(config: ChatForegroundServiceConfig): Promise<boolean> {
  const module = getNativeModule();
  return module ? module.start(JSON.stringify(config)) : false;
}

export async function stopChatForegroundService(storageKey: string): Promise<boolean> {
  const module = getNativeModule();
  return module ? module.stop(storageKey) : false;
}

export async function setChatServiceAppForegrounded(foreground: boolean): Promise<void> {
  const module = getNativeModule();
  if (module) await module.setAppForegrounded(foreground);
}

export async function getStoredChatServiceSession(storageKey: string): Promise<string | null> {
  const module = getNativeModule();
  return module ? module.getStoredSession(storageKey) : null;
}

export async function getChatForegroundServiceStatus(): Promise<string> {
  const module = getNativeModule();
  return module ? module.getStatus() : 'unsupported';
}

export async function isChatForegroundServiceConfigured(storageKey: string): Promise<boolean> {
  const module = getNativeModule();
  return module ? module.isConfigured(storageKey) : false;
}
