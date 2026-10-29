import { StyleSheet } from 'react-native';
import { BookOpen, BookOpenCheck, MessageCircle, RefreshCw, Volume2 } from 'lucide-react-native';
import { CourseBottomNav, type CourseNavItem } from '@/components/course/CourseBottomNav';
import { GERMAN_COURSE } from '@/lib/languages/courseRegistry';

/** German navigation: identical five slots and order to English and Russian. */
export const GERMAN_NAV_ITEMS: CourseNavItem[] = [
  { slot: 'home', path: '/learn/de', label: 'یادگیری', icon: BookOpen },
  { slot: 'library', path: '/learn/de/library', label: 'کتابخانه', icon: BookOpenCheck },
  { slot: 'pronunciation', path: '/learn/de/pronunciation', label: 'تلفظ', icon: Volume2 },
  { slot: 'conversations', path: '/conversations', label: 'مکالمه', icon: MessageCircle },
  { slot: 'review', path: '/learn/de/review', label: 'مرور', icon: RefreshCw },
];

export function GermanBottomNav() {
  return <CourseBottomNav course={GERMAN_COURSE} items={GERMAN_NAV_ITEMS} style={styles.shell} />;
}

const styles = StyleSheet.create({
  shell: { flexDirection: 'row-reverse' },
});
