import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { RegistrationGate } from '@/components/RegistrationGate';

function LoginReturnScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>حساب شما فعال است</Text>
      <Text style={styles.detail}>برای ادامهٔ یادگیری به انتخاب زبان برگردید.</Text>
      <Pressable accessibilityRole="button" onPress={() => router.replace('/languages' as never)} style={styles.button}>
        <Text style={styles.buttonText}>بازگشت به زبان‌ها</Text>
      </Pressable>
    </View>
  );
}

/** Optional guest builds expose this route without forcing account creation at startup. */
export default function OptionalLoginRoute() {
  return <RegistrationGate forceAuth><LoginReturnScreen /></RegistrationGate>;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14, backgroundColor: '#F6FAFF' },
  title: { fontFamily: 'Vazir-Bold', fontSize: 20, color: '#102A56', textAlign: 'center' },
  detail: { fontFamily: 'Vazir', fontSize: 14, color: '#52657D', textAlign: 'center' },
  button: { minHeight: 46, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 18, borderRadius: 14, backgroundColor: '#1769D2' },
  buttonText: { fontFamily: 'Vazir-Bold', color: '#FFFFFF', fontSize: 14 },
});
