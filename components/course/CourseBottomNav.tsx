import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { BookOpen, BookOpenCheck, LucideIcon, MessageCircle, RefreshCw, Volume2 } from 'lucide-react-native';
import { Radius, Typography } from '@/lib/theme';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { getChatUnreadCount, subscribeToChatUnreadCount } from '@/lib/chatNotificationState';
import type { FormatCourse } from '@/lib/languages/courseFormat';

/**
 * The single bottom navigation used by every language: the same five
 * destinations in the same right-to-left order. Courses only supply their own
 * route strings and labels.
 */
export interface CourseNavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  slot?: 'home' | 'library' | 'pronunciation' | 'conversations' | 'review';
}

export const COURSE_NAV_SLOTS = ['home', 'library', 'pronunciation', 'conversations', 'review'] as const;

export function courseNavTargets(course: FormatCourse) {
  return {
    home: course.routes.home,
    library: course.routes.library,
    pronunciation: course.routes.pronunciation,
    conversations: '/conversations',
    review: course.routes.review,
  } as const;
}

export function courseNavItems(course: FormatCourse): CourseNavItem[] {
  const targets = courseNavTargets(course);
  return [
    { slot: 'home', path: targets.home, label: 'یادگیری', icon: BookOpen },
    { slot: 'library', path: targets.library, label: 'کتابخانه', icon: BookOpenCheck },
    { slot: 'pronunciation', path: targets.pronunciation, label: 'تلفظ', icon: Volume2 },
    { slot: 'conversations', path: targets.conversations, label: 'مکالمه', icon: MessageCircle },
    { slot: 'review', path: targets.review, label: 'مرور', icon: RefreshCw },
  ];
}

export function CourseBottomNav({ course, items, style }: { course: FormatCourse; items?: CourseNavItem[]; style?: StyleProp<ViewStyle> }) {
  const pathname = usePathname();
  const router = useRouter();
  const [chatUnreadCount, setChatUnreadCount] = useState(getChatUnreadCount());
  const entries = items ?? courseNavItems(course);

  useEffect(() => subscribeToChatUnreadCount(setChatUnreadCount), []);

  const isActive = (item: CourseNavItem) => {
    if (pathname === item.path) return true;
    if (item.slot === 'home') return false;
    return pathname.startsWith(`${item.path}/`);
  };

  return (
    <View style={[styles.shell, style]}>
      {entries.map(item => {
        const active = isActive(item);
        const Icon = item.icon;
        return (
          <Pressable
            key={item.path}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: active }}
            style={styles.item}
            onPress={() => router.replace(item.path as never)}
          >
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
              <Icon size={19} color={active ? Palette.primary : Palette.muted} strokeWidth={active ? 2.4 : 2} />
              {item.slot === 'conversations' && chatUnreadCount > 0 ? (
                <View accessibilityLabel={`${chatUnreadCount} پیام خوانده‌نشده`} style={styles.badge}>
                  <Text style={styles.badgeText}>{chatUnreadCount > 9 ? '۹+' : chatUnreadCount.toLocaleString('fa-IR')}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    minHeight: 60,
    marginHorizontal: 12,
    marginBottom: 8,
    paddingTop: 5,
    paddingBottom: 6,
    paddingHorizontal: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 22,
    shadowColor: '#1D2345',
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  item: { flex: 1, minWidth: 52, alignItems: 'center', gap: 2 },
  iconWrap: { width: 42, height: 32, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  iconWrapActive: { backgroundColor: Palette.primarySoft },
  badge: { position: 'absolute', top: -4, right: 1, minWidth: 16, height: 16, paddingHorizontal: 3, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D63F52', borderWidth: 1, borderColor: Palette.surface },
  badgeText: { color: '#FFFFFF', fontFamily: Typography.boldFontFamily, fontSize: 8, lineHeight: 11, textAlign: 'center' },
  label: { fontFamily: Typography.fontFamily, fontSize: 12, color: Palette.muted },
  labelActive: { color: Palette.primaryDark, fontWeight: Typography.weights.bold },
});
