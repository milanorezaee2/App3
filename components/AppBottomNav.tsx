import { StyleSheet } from 'react-native';
import { BookOpen, BookOpenCheck, MessageCircle, RefreshCw, Volume2 } from 'lucide-react-native';
import { CourseBottomNav, type CourseNavItem } from '@/components/course/CourseBottomNav';
import { ENGLISH_COURSE } from '@/lib/languages/courseRegistry';

/**
 * English navigation: the same five destinations, in the same RTL order, as the
 * the English course and the Russian course.
 */
export const ENGLISH_NAV_ITEMS: CourseNavItem[] = [
  { slot: 'home', path: '/lang', label: 'یادگیری', icon: BookOpen },
  { slot: 'library', path: '/lang/library', label: 'کتابخانه', icon: BookOpenCheck },
  { slot: 'pronunciation', path: '/learn/en/pronunciation', label: 'تلفظ', icon: Volume2 },
  { slot: 'conversations', path: '/conversations', label: 'مکالمه', icon: MessageCircle },
  { slot: 'review', path: '/review', label: 'مرور', icon: RefreshCw },
];

export function AppBottomNav() {
  return <CourseBottomNav course={ENGLISH_COURSE} items={ENGLISH_NAV_ITEMS} style={styles.shell} />;
}

const styles = StyleSheet.create({
  shell: { flexDirection: 'row-reverse' },
});
