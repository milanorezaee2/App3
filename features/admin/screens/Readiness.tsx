import { LocalizedText as Text } from '@/components/LocalizedText';
import { useEffect, useMemo, useState } from 'react';
import { loadPacks, type ContentPack } from '@/lib/content/packs';
import { Pressable, View } from 'react-native';
import { Gauge } from 'lucide-react-native';
import { COURSE_LANGUAGES, COURSE_NAMES_FA, allCourseReadiness } from '@/lib/content/allCourses';
import { CEFR_LABEL, COURSE_SPEC, READY_THRESHOLD } from '@/lib/content/courseSpec';
import type { CourseLanguage } from '@/lib/content/readiness';
import { AdminTheme as T } from '../theme';
import { Card, Chip, ListRow, Page, StatTile, adminStyles as a, n } from '../ui';

const tone = (value: number) => value >= 70 ? 'success' : value >= READY_THRESHOLD ? 'warning' : 'danger';
const color = (value: number) => value >= 70 ? '#16A34A' : value >= READY_THRESHOLD ? '#D97706' : '#DC2626';

/**
 * Course readiness against the course spec: per language and CEFR band, structure (lessons present vs
 * required) and coverage (frequency words met vs the band ceiling), with the uncovered words listed as
 * the content order for that band. Computed from bundled lesson data — always matches the shipped app.
 */
export function ReadinessScreen() {
  const all = useMemo(() => allCourseReadiness(), []);
  // Published content packs (Supabase Storage) — shown next to the shipped-content numbers.
  const [packs, setPacks] = useState<Record<string, ContentPack[]>>({});
  useEffect(() => { let alive = true; Promise.all(COURSE_LANGUAGES.map(lang => loadPacks(lang).then(list => [lang, list] as const).catch(() => [lang, []] as const))).then(entries => { if (alive) setPacks(Object.fromEntries(entries)); }); return () => { alive = false; }; }, []);
  const [selected, setSelected] = useState<CourseLanguage>('de');
  const course = all[selected];
  const overall = Math.round(COURSE_LANGUAGES.reduce((sum, lang) => sum + all[lang].bands.reduce((s, b) => s + b.readiness, 0) / all[lang].bands.length, 0) / COURSE_LANGUAGES.length);
  return (
    <Page title="آمادگی دوره‌ها" subtitle={`سنجش هر زبان در برابر مشخصات دوره: ساختار (درس‌های موجود ÷ لازم) و پوشش واژگان پرکاربرد (تا سقف هر سطح). عدد هر سطح = کمینهٔ این دو. زیر ${n(READY_THRESHOLD)}٪ «در حال تکمیل» است.`}>
      <View style={a.grid}>
        <StatTile label="میانگین آمادگی همهٔ زبان‌ها" value={`${n(overall)}٪`} icon={Gauge} tone="accent" />
        {COURSE_LANGUAGES.map(lang => { const bands = all[lang].bands; const avg = Math.round(bands.reduce((s, b) => s + b.readiness, 0) / bands.length); return <StatTile key={lang} label={COURSE_NAMES_FA[lang]} value={`${n(avg)}٪`} />; })}
      </View>
      <Card title="جدول آمادگی (درصد)" padded={false}>
        <ListRow>
          <Text style={[a.name, { width: 80 }]}>زبان</Text>
          {course.bands.map(b => <Text key={b.band} style={[a.muted, { flex: 1, textAlign: 'center' }]}>{CEFR_LABEL[b.band]}</Text>)}
        </ListRow>
        {COURSE_LANGUAGES.map(lang => (
          <Pressable key={lang} onPress={() => setSelected(lang)} accessibilityRole="button" accessibilityState={{ selected: lang === selected }}>
            <ListRow>
              <Text style={[a.name, { width: 80 }, lang === selected && { color: T.color.accent }]}>{COURSE_NAMES_FA[lang]}</Text>
              {all[lang].bands.map(b => <Text key={b.band} keepColor style={{ flex: 1, textAlign: 'center', fontWeight: '800', color: color(b.readiness) }}>{n(b.readiness)}</Text>)}
            </ListRow>
          </Pressable>
        ))}
      </Card>
      <Card title={`جزئیات ${COURSE_NAMES_FA[selected]} · ${n(course.uniqueWords)} واژهٔ یکتا در جمله‌ها`} padded={false}>
        {course.bands.map(b => (
          <ListRow key={b.band}>
            <View style={{ width: 8, height: 44, borderRadius: 4, backgroundColor: color(b.readiness) }} />
            <View style={{ flex: 1, minWidth: 200 }}>
              <Text style={a.name}>{CEFR_LABEL[b.band]} · آمادگی {n(b.readiness)}٪ {b.readiness < READY_THRESHOLD ? '· در حال تکمیل' : ''}</Text>
              <Text style={a.muted}>ساختار {n(b.structure)}٪: {n(b.lessons)} از {n(b.lessonsTarget)} درس · {n(b.sentences)} از {n(b.sentencesTarget)} جمله · الگو {n(b.patterns)} از {n(b.patternsTarget)} · گفت‌وگو {n(b.lessonsWithDialogue)}/{n(b.lessons)} · سنجش {n(b.lessonsWithChecks)}/{n(b.lessons)}</Text>
              <Text style={a.muted}>پوشش {n(b.coverage)}٪: {n(b.coveredWords)} از {n(b.vocabularyCeiling)} واژهٔ پرکاربرد (تجمعی) · هدف هر درس {n(COURSE_SPEC[b.band].sentencesPerLesson)} جمله</Text>
              {(() => { const pack = (packs[selected] ?? []).find(p => p.band === b.band); return pack ? <Text style={a.muted}>بستهٔ محتوا v{n(pack.version)}: {n(pack.sentences.length)} جمله · {n(pack.sentences.filter(x => x.audio).length)} با صدای ضبط‌شده · {pack.source}</Text> : null; })()}
              {b.gaps.length ? <Text style={[a.mono, { color: T.color.textFaint, writingDirection: 'ltr', textAlign: 'left' }]} numberOfLines={3}>شکاف: {b.gaps.slice(0, 30).join(' · ')}</Text> : null}
            </View>
            <Chip label={`${n(b.readiness)}٪`} tone={tone(b.readiness)} />
          </ListRow>
        ))}
      </Card>
    </Page>
  );
}
