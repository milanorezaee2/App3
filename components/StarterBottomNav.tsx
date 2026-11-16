import { BookOpen, ClipboardList, Lightbulb, RefreshCw, Volume2 } from 'lucide-react-native';
import { LanguageBottomNav } from './LanguageBottomNav';
import type { StarterCourse } from '@/lib/languages/newCourses';
export function StarterBottomNav({course}: {course: StarterCourse}) {
  return <LanguageBottomNav rootPath={course.home} items={[
    {path:course.home,label:'یادگیری',icon:BookOpen},
    {path:`${course.home}/pronunciation`,label:'تلفظ',icon:Volume2},
    { path: '/feedback', label: 'پیشنهادات', icon: Lightbulb },
    {path:`${course.home}/library`,label:'درس‌ها',icon:ClipboardList},
    {path:`${course.home}/review`,label:'مرور',icon:RefreshCw},
  ]} />;
}
