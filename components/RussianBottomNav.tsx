import { StyleSheet } from 'react-native';
import { BookOpen, BookOpenCheck, MessageCircle, RefreshCw, Volume2 } from 'lucide-react-native';
import { CourseBottomNav, type CourseNavItem } from '@/components/course/CourseBottomNav';
import { RUSSIAN_COURSE } from '@/lib/languages/courseRegistry';

/** Russian navigation: identical five slots and order to English and German. */
export const RUSSIAN_NAV_ITEMS: CourseNavItem[] = [
  { slot: 'home', path: '/learn/ru', label: 'یادگیری', icon: BookOpen },
  { slot: 'library', path: '/learn/ru/library', label: 'کتابخانه', icon: BookOpenCheck },
  { slot: 'pronunciation', path: '/learn/ru/pronunciation', label: 'تلفظ', icon: Volume2 },
  { slot: 'conversations', path: '/conversations', label: 'مکالمه', icon: MessageCircle },
  { slot: 'review', path: '/learn/ru/review', label: 'مرور', icon: RefreshCw },
];

export function RussianBottomNav() {
  return <CourseBottomNav course={RUSSIAN_COURSE} items={RUSSIAN_NAV_ITEMS} style={styles.shell} />;
}

const styles = StyleSheet.create({
  shell: { flexDirection: 'row-reverse' },
});
