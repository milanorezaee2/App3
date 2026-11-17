import { BookOpen, ClipboardList, Lightbulb, RefreshCw, Sparkles, Volume2 } from 'lucide-react-native';
import { LanguageBottomNav } from './LanguageBottomNav';
import type { StarterCourse } from '@/lib/languages/newCourses';
export function StarterBottomNav({course}: {course: StarterCourse}) {
  // German carries the same «واژه‌ها» lab as Russian; French and Spanish keep their lesson flow only.
  const words = course.id === 'de' ? [{path:`${course.home}/vocabulary`,label:'واژه‌ها',icon:Sparkles}] : [];
  return <LanguageBottomNav rootPath={course.home} items={[
    {path:course.home,label:'یادگیری',icon:BookOpen},
    {path:`${course.home}/pronunciation`,label:'تلفظ',icon:Volume2},
    ...words,
    { path: '/feedback', label: 'پیشنهادات', icon: Lightbulb },
    {path:`${course.home}/library`,label:'درس‌ها',icon:ClipboardList},
    {path:`${course.home}/review`,label:'مرور',icon:RefreshCw},
  ]} />;
}
