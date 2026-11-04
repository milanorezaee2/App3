import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { RotateCcw } from 'lucide-react-native';
import { Typography } from '@/lib/theme';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  /** Red destructive confirm button for irreversible actions. */
  destructive?: boolean;
  busy?: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Cross-platform confirmation dialog. `Alert.alert` is a silent no-op on web
 * (react-native-web), so destructive actions use this Modal instead: it works
 * identically on web, Android and iOS.
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = 'تأیید',
  cancelText = 'انصراف',
  destructive = false,
  busy = false,
  error = '',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => { if (!busy) onCancel(); }}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={cancelText}
          style={styles.backdrop}
          disabled={busy}
          onPress={onCancel}
        />
        <View
          accessibilityRole="alert"
          accessibilityLabel={title}
          style={styles.card}
        >
          <View style={[styles.iconWrap, destructive && styles.iconWrapDestructive]}>
            <RotateCcw size={22} color={destructive ? '#C81E1E' : '#5146E5'} strokeWidth={2.2} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          {error ? (
            <Text accessibilityRole="alert" style={styles.error}>{error}</Text>
          ) : null}
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={cancelText}
              disabled={busy}
              style={({ pressed }) => [styles.cancelButton, pressed && !busy && styles.pressed]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>{cancelText}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={confirmText}
              disabled={busy}
              style={({ pressed }) => [
                styles.confirmButton,
                destructive && styles.confirmButtonDestructive,
                pressed && !busy && styles.pressed,
                busy && styles.disabled,
              ]}
              onPress={onConfirm}
            >
              {busy
                ? <ActivityIndicator size="small" color={destructive ? '#FFFFFF' : '#F5E7BC'} />
                : <Text style={[styles.confirmText, destructive && styles.confirmTextDestructive]}>{confirmText}</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, backgroundColor: 'rgba(10,14,30,0.55)' },
  backdrop: { ...StyleSheet.absoluteFillObject },
  card: { width: '100%', maxWidth: 380, borderRadius: 24, backgroundColor: '#FFFFFF', padding: 22, gap: 12, borderWidth: 1, borderColor: '#E3E9F5', shadowColor: '#0F172A', shadowOpacity: 0.25, shadowRadius: 28, shadowOffset: { width: 0, height: 12 }, elevation: 12 },
  iconWrap: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', backgroundColor: '#E9E7FF', borderWidth: 1, borderColor: '#D8D5FF' },
  iconWrapDestructive: { backgroundColor: '#FDECEC', borderColor: '#F6C9C9' },
  title: { fontFamily: 'Vazir-Bold', color: '#1E293B', fontSize: 17, lineHeight: 27, textAlign: 'right', writingDirection: 'rtl' },
  message: { fontFamily: Typography.fontFamily, color: '#52667C', fontSize: 13, lineHeight: 24, textAlign: 'right', writingDirection: 'rtl' },
  error: { fontFamily: Typography.fontFamily, color: '#B42318', backgroundColor: '#FFF0F0', padding: 10, borderRadius: 10, fontSize: 12, lineHeight: 21, textAlign: 'right', writingDirection: 'rtl' },
  actions: { flexDirection: 'row-reverse', gap: 10, marginTop: 6 },
  cancelButton: { flex: 1, minHeight: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  cancelText: { fontFamily: 'Vazir-Bold', color: '#334155', fontSize: 14 },
  confirmButton: { flex: 1, minHeight: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#5146E5' },
  confirmButtonDestructive: { backgroundColor: '#C81E1E' },
  confirmText: { fontFamily: 'Vazir-Bold', color: '#F5E7BC', fontSize: 14 },
  confirmTextDestructive: { color: '#FFFFFF' },
  pressed: { opacity: 0.86, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.7 },
});
