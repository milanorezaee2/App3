import { LocalizedText as Text } from '@/components/LocalizedText';
import { useRouter } from 'expo-router';
import { Ban, MessageSquare, MessagesSquare, UserPlus, Users, Activity, ArrowUpLeft } from 'lucide-react-native';
import { View } from 'react-native';
import { fetchConversations, fetchDashboardStats, fetchUsers } from '../api';
import { useAdminQuery } from '../store';
import { AdminTheme as T } from '../theme';
import { Avatar, Banner, Button, Card, Chip, EmptyState, ListRow, Loading, Page, StatTile, adminStyles as a, faAgo, n } from '../ui';

export function DashboardScreen() {
  const router = useRouter();
  const stats = useAdminQuery('stats', fetchDashboardStats);
  const users = useAdminQuery('users', fetchUsers);
  const chats = useAdminQuery('chats', fetchConversations);
  const d = stats.data;
  const recentUsers = (users.data || []).slice(0, 6);
  const openSupport = (chats.data || []).filter(c => c.is_support && c.support_status === 'open' && !c.deleted_at).slice(0, 6);

  return (
    <Page title="داشبورد" subtitle="نمای زندهٔ وضعیت اپ: کاربران، گفتگوها و درخواست‌های پشتیبانی">
      {stats.error && <Banner kind="error" text={stats.error} />}
      {stats.loading && !d && <Loading />}
      {d && (
        <>
          <View style={a.grid}>
            <StatTile label="کاربران ثبت‌شده" value={d.users_total} hint={`${n(d.users_today)} نفر امروز · ${n(d.users_week)} نفر این هفته`} icon={Users} tone="accent" />
            <StatTile label="فعال در ۷ روز اخیر" value={d.users_active_week} hint="بر اساس آخرین فعالیت" icon={Activity} tone="success" />
            <StatTile label="درخواست‌های باز پشتیبانی" value={d.support_open} hint={`${n(d.support_resolved)} درخواست بسته‌شده`} icon={MessageSquare} tone={d.support_open ? 'warning' : 'neutral'} />
            <StatTile label="پیام‌های امروز" value={d.messages_today} hint={`${n(d.messages_total)} پیام در کل`} icon={MessagesSquare} tone="info" />
            <StatTile label="گفتگوها" value={d.conversations_total} hint={`${n(d.conversations_deleted)} گفتگوی پنهان‌شده`} icon={MessagesSquare} />
            <StatTile label="کاربران مسدود" value={d.users_blocked} hint="دسترسی چت بسته است" icon={Ban} tone={d.users_blocked ? 'danger' : 'neutral'} />
          </View>
        </>
      )}
      <View style={[a.grid, { alignItems: 'flex-start' }]}>
        <Card title="درخواست‌های باز پشتیبانی" padded={false} style={{ flex: 1, minWidth: 300 }} aside={<Button small variant="ghost" tone="neutral" label="همه" icon={ArrowUpLeft} onPress={() => router.replace('/admin/support' as never)} />}>
          {chats.loading && !chats.data && <Loading />}
          {chats.data && !openSupport.length && <EmptyState icon={MessageSquare} title="درخواست بازی وجود ندارد" />}
          {openSupport.map(c => {
            const learner = c.members.find(m => !m.is_admin) || c.members[0];
            return (
              <ListRow key={c.conversation_id} onPress={() => router.push({ pathname: '/conversations/human/[conversationId]', params: { conversationId: c.conversation_id, name: learner?.name || 'زبان‌آموز' } } as never)}>
                <Avatar name={learner?.name || '?'} tone="warning" />
                <View style={{ flex: 1, minWidth: 120 }}>
                  <Text style={a.name}>{learner?.name || 'زبان‌آموز'}</Text>
                  <Text numberOfLines={1} style={a.muted}>{c.last_message_preview || 'بدون پیام'}</Text>
                </View>
                <Text style={a.muted}>{faAgo(c.last_message_at || c.created_at)}</Text>
              </ListRow>
            );
          })}
        </Card>
        <Card title="آخرین ثبت‌نام‌ها" padded={false} style={{ flex: 1, minWidth: 300 }} aside={<Button small variant="ghost" tone="neutral" label="همه" icon={ArrowUpLeft} onPress={() => router.replace('/admin/users' as never)} />}>
          {users.loading && !users.data && <Loading />}
          {users.data && !recentUsers.length && <EmptyState icon={UserPlus} title="هنوز کاربری ثبت نشده است" />}
          {recentUsers.map(u => (
            <ListRow key={u.user_id} onPress={() => router.push({ pathname: '/admin/users', params: { focus: u.user_id } } as never)}>
              <Avatar name={u.full_name} />
              <View style={{ flex: 1, minWidth: 120 }}>
                <Text style={a.name}>{u.full_name}</Text>
                <Text style={a.mono}>{u.email}</Text>
              </View>
              {u.chat_blocked && <Chip label="مسدود" tone="danger" />}
              <Text style={a.muted}>{faAgo(u.registered_at)}</Text>
            </ListRow>
          ))}
        </Card>
      </View>
      {d && <Text style={[a.muted, { color: T.color.textFaint }]}>به‌روزرسانی: {faAgo(d.generated_at)}</Text>}
    </Page>
  );
}
