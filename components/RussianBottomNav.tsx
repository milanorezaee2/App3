import { BookOpen, ClipboardList, MessageCircle, RefreshCw, Volume2 } from 'lucide-react-native';
import { LanguageBottomNav, type LanguageNavItem } from '@/components/LanguageBottomNav';

const items: readonly LanguageNavItem[] = [
  { path: '/learn/ru', label: 'یادگیری', icon: BookOpen },
  { path: '/learn/ru/pronunciation', label: 'تلفظ', icon: Volume2 },
  { path: '/conversations', label: 'مکالمه', icon: MessageCircle },
  { path: '/learn/ru/library', label: 'درس‌ها', icon: ClipboardList },
  { path: '/learn/ru/review', label: 'مرور', icon: RefreshCw },
];

export function RussianBottomNav() {
  return <LanguageBottomNav items={items} rootPath="/learn/ru" />;
}
