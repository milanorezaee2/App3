import { LocalizedText as Text } from '@/components/LocalizedText';
import { ADMIN_NAV, PRIMARY_NAV_COUNT, SignOutButton } from '@/features/admin/Shell';
import { AdminTheme as T } from '@/features/admin/theme';
import { Card, ListRow, Page, adminStyles as a } from '@/features/admin/ui';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { View } from 'react-native';

/** Phone layout: everything that is not in the bottom bar. */
export default function MoreRoute() {
  const router = useRouter();
  return (
    <Page title="بیشتر" subtitle="بخش‌های دیگر پنل">
      <Card padded={false}>
        {ADMIN_NAV.slice(PRIMARY_NAV_COUNT).map(item => (
          <ListRow key={item.href} onPress={() => router.replace(item.href as never)}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: T.color.accentSoft, alignItems: 'center', justifyContent: 'center' }}><item.icon size={18} color={T.color.accentText} /></View>
            <Text style={[a.name, { flex: 1 }]}>{item.label}</Text>
            <ChevronLeft size={18} color={T.color.textFaint} />
          </ListRow>
        ))}
      </Card>
      <SignOutButton />
    </Page>
  );
}
