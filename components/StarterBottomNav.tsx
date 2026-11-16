import { BookOpen, ClipboardList, Lightbulb, RefreshCw, Sparkles, Volume2 } from 'lucide-react-native';
import { LanguageBottomNav, type LanguageNavItem } from './LanguageBottomNav';
import type { StarterCourse } from '@/lib/languages/newCourses';
export function StarterBottomNav({course}: {course: StarterCourse}) {
  const items: readonly LanguageNavItem[] = [
    {path:course.home,label:'یادگیری',icon:BookOpen},
    {path:`${course.home}/pronunciation`,label:'تلفظ',icon:Volume2},
    /** The word lab ships with German today; other starter courses gain it when their pilot lands. */
    ...(course.id === 'de' ? [{ path: `${course.home}/vocabulary`, label: 'واژه‌ها', icon: Sparkles }] : []),
    { path: '/feedback', label: 'پیشنهادات', icon: Lightbulb },
    {path:`${course.home}/library`,label:'درس‌ها',icon:ClipboardList},
    {path:`${course.home}/review`,label:'مرور',icon:RefreshCw},
  ];
  return <LanguageBottomNav rootPath={course.home} items={items} />;
}
