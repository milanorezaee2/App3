import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { EnglishSupplementTask, supplementStyles as s } from './EnglishSupplementTask';
import { B2_TOPIC_PRACTICE, type B2TopicPractice } from '@/lib/englishB2Practice';
import { loadStudy, recordLessonEvidence } from '@/lib/englishStudyState';
import type { Task } from '@/lib/englishSupplement/content';
import { toPersianDigits } from '@/lib/format';

/** Optional practice has separate stable task IDs and never changes lesson completion. */
export function EnglishB2TopicPractice({ lessonId, topics, practice, heading, description }: { lessonId: string; topics: readonly string[]; practice?: readonly B2TopicPractice[]; heading?: string; description?: string }) {
  const tasks = practice ?? B2_TOPIC_PRACTICE[lessonId] ?? [];
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    void loadStudy().then(state => {
      if (!active) return;
      const results = state.lessonEvidence[lessonId] ?? {};
      setSaved(Object.fromEntries(tasks.map(({ task }) => [task.id, !!results[task.id]?.correct])));
      setLoading(false);
    }).catch(() => {
      if (!active) return;
      setError('پاسخ‌های ذخیره‌شده خوانده نشدند؛ برای جلوگیری از تغییر اطلاعات، دوباره وارد درس شوید.');
      setLoading(false);
    });
    return () => { active = false; };
  }, [lessonId, tasks]);

  async function save(task: Task, correct: boolean, heard: boolean) {
    // A later practice mistake should not erase an earlier successful result.
    const passed = correct || !!saved[task.id];
    await recordLessonEvidence(lessonId, task.id, task.skill, passed, heard);
    setSaved(previous => ({ ...previous, [task.id]: previous[task.id] || correct }));
  }

  if (!tasks.length) return null;
  return <View style={{ width: '100%', gap: 12, marginTop: 20 }}>
    <Text style={s.heading}>{heading ?? 'تمرین کاربردی هر محور · اختیاری'}</Text>
    <Text style={s.text}>{description ?? 'برای هر محور یک موقعیت کوتاه را پاسخ دهید. تمرین‌ها شرط پایان درس نیستند و گفتار یا نوشتار آزاد را خودکار نمی‌سنجند؛ پاسخ‌ها قابل تکرارند.'}</Text>
    {loading ? <Text style={s.text}>در حال بازیابی پاسخ‌ها…</Text> : null}
    {!!error && <Text style={s.error}>{error}</Text>}
    {!loading && !error && tasks.map(({ topic, task }) => <View key={task.id} style={{ gap: 5 }}>
      <Text style={s.heading}>{toPersianDigits(topic)}. {topics[topic - 1]}</Text>
      {saved[task.id] && <Text style={s.success}>پاسخ درست این تمرین پیش‌تر ثبت شده است؛ می‌توانید دوباره تمرین کنید.</Text>}
      <EnglishSupplementTask task={task} onSave={save} showExplanationOnCorrect />
    </View>)}
  </View>;
}
