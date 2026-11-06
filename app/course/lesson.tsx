import { Suspense, lazy } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

const EnglishLessonRoute = lazy(() => import('@/components/EnglishLessonRoute'));

export default function EnglishLessonScreen() {
  return (
    <Suspense fallback={
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: '#F8FAFF' }}>
        <ActivityIndicator color="#635BFF" size="large" />
        <Text style={{ fontFamily: 'Beiruti', color: '#334155', fontSize: 13, textAlign: 'center', writingDirection: 'rtl' }}>
          در حال آماده‌کردن اولین درس…
        </Text>
      </View>
    }>
      <EnglishLessonRoute />
    </Suspense>
  );
}
