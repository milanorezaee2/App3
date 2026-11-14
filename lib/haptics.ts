import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const enabled = Platform.OS !== 'web';
/** Short, quiet feedback for a correct answer. */
export function hapticCorrect(): void { if (enabled) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined); }
/** Slightly firmer feedback for a wrong answer. */
export function hapticWrong(): void { if (enabled) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined); }
/** Light tap for stage transitions / celebration. */
export function hapticTap(): void { if (enabled) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined); }
