import { Suspense, lazy } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

const EnglishLessonRoute = lazy(() => import('@/components/EnglishLessonRoute'));

export default function EnglishLessonScreen() {
  return (
    <Suspense fallback={
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: '#F5F4EF' }}>
        <ActivityIndicator color="#728D75" size="large" />
        <Text style={{ fontFamily: 'Vazir', color: '#29362F', fontSize: 13, textAlign: 'center', writingDirection: 'rtl' }}>
          در حال آماده‌کردن اولین درس…
        </Text>
      </View>
    }>
      <EnglishLessonRoute />
    </Suspense>
  );
}
