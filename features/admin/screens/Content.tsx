import { LocalizedText as Text } from '@/components/LocalizedText';
import { COURSE_LEVELS, SENTENCE_LESSONS } from '@/lib/courseContent';
import { getEssential504Coverage } from '@/lib/essential504';
import { LANGUAGE_REGISTRY } from '@/lib/languages/registry';
import { BookOpen } from 'lucide-react-native';
import { View } from 'react-native';
import { AdminTheme as T } from '../theme';
import { Card, Chip, ListRow, Page, StatTile, adminStyles as a, n } from '../ui';

const coverage = getEssential504Coverage();
const sentenceCount = SENTENCE_LESSONS.reduce((total, lesson) => total + lesson.sentences.length, 0);

export function ContentScreen() {
  return (
    <Page title="محتوای آموزشی" subtitle="نمای فقط‌خواندنی کتابخانهٔ درس‌ها؛ ویرایش محتوا از طریق انتشار نسخهٔ جدید اپ انجام می‌شود">
      <View style={a.grid}>
        <StatTile label="درس‌های دورهٔ انگلیسی" value={SENTENCE_LESSONS.length} icon={BookOpen} tone="accent" />
        <StatTile label="جمله‌های آموزشی" value={sentenceCount} />
        <StatTile label="پوشش واژگان مرجع ۵۰۴" value={`${n(coverage.introducedCount)} / ${n(coverage.totalTarget)}`} />
        <StatTile label="زبان‌های ثبت‌شده" value={LANGUAGE_REGISTRY.length} />
      </View>
      <Card title="سطوح دورهٔ انگلیسی" padded={false}>
        {COURSE_LEVELS.map(level => (
          <ListRow key={level.id}>
            <View style={{ width: 8, height: 30, borderRadius: 4, backgroundColor: level.color }} />
            <View style={{ flex: 1, minWidth: 160 }}>
              <Text style={a.name}>{level.title} · {level.cefr}</Text>
              <Text style={a.muted}>{level.description}</Text>
            </View>
            <Chip label={`${n(SENTENCE_LESSONS.filter(x => x.levelId === level.id).length)} درس`} tone="accent" />
          </ListRow>
        ))}
      </Card>
      <Card title="زبان‌ها" padded={false}>
        {LANGUAGE_REGISTRY.map(lang => (
          <ListRow key={lang.id}>
            <View style={{ width: 8, height: 30, borderRadius: 4, backgroundColor: lang.accent }} />
            <View style={{ flex: 1, minWidth: 160 }}>
              <Text style={a.name}>{lang.name} · {lang.nativeName}</Text>
              <Text style={a.muted}>{lang.description}</Text>
            </View>
            <Chip label={lang.status === 'available' ? 'منتشرشده' : lang.status === 'starter' ? 'مقدماتی' : 'در برنامه'} tone={lang.status === 'available' ? 'success' : lang.status === 'starter' ? 'info' : 'neutral'} />
            <Text style={[a.mono, { color: T.color.textFaint }]}>{lang.id}</Text>
          </ListRow>
        ))}
      </Card>
    </Page>
  );
}
