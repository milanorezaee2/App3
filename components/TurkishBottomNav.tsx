import { BookOpen, ClipboardList, MessageCircle, RefreshCw, Volume2 } from 'lucide-react-native';
import { LanguageBottomNav, type LanguageNavItem } from '@/components/LanguageBottomNav';

const items: readonly LanguageNavItem[] = [
  { path: '/learn/tr', label: 'یادگیری', icon: BookOpen },
  { path: '/learn/tr/pronunciation', label: 'تلفظ', icon: Volume2 },
  { path: '/conversations', label: 'مکالمه', icon: MessageCircle },
  { path: '/learn/tr/library', label: 'درس‌ها', icon: ClipboardList },
  { path: '/learn/tr/review', label: 'مرور', icon: RefreshCw },
];

export function TurkishBottomNav() {
  return <LanguageBottomNav items={items} rootPath="/learn/tr" />;
}
