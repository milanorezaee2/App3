import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { C1_READINGS } from '@/lib/englishC1Reading';
import { playResponsiveSpeech, stopResponsiveSpeech } from '@/lib/responsiveSpeech';
import { EnglishB2TopicPractice } from './EnglishB2TopicPractice';
import { supplementStyles as s } from './EnglishSupplementTask';

/** Optional reading questions do not require or verify that the learner heard the audio. */
export function EnglishC1Reading({ lessonId }: { lessonId: string }) {
  const reading = C1_READINGS[lessonId];
  const [showTranslation, setShowTranslation] = useState(false);
  const [audioError, setAudioError] = useState('');
  const practice = useMemo(() => (reading?.questions ?? []).map((task, index) => ({ topic: index + 1, task })), [reading]);

  // Stop a long passage when this stage is left, including navigation away from the lesson.
  useEffect(() => () => { void stopResponsiveSpeech(); }, []);
  if (!reading) return null;

  const play = () => {
    setAudioError('');
    playResponsiveSpeech({ text: reading.passage, locale: 'en-US', rate: 0.9,
      onError: () => setAudioError('پخش ممکن نشد. اجازهٔ پخش و صدای دستگاه را بررسی کنید؛ می‌توانید متن را بخوانید.') });
  };
  return <View style={[s.card, { marginTop: 18 }]}>
    <Text style={s.heading}>متن کوتاه · خواندن و شنیدن</Text>
    <Text style={s.text}>{reading.title} — این موقعیت آموزشی فرضی است. متن را بخوانید یا با صدای دستگاه گوش دهید و سپس به دو پرسش پاسخ دهید.</Text>
    <Text style={s.english}>{reading.passage}</Text>
    <Pressable accessibilityRole="button" accessibilityLabel="پخش متن کامل درس" style={s.secondaryButton} onPress={play}><Text style={s.secondaryButtonText}>پخش متن کامل</Text></Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="توقف پخش متن" style={s.secondaryButton} onPress={() => { void stopResponsiveSpeech(); }}><Text style={s.secondaryButtonText}>توقف پخش</Text></Pressable>
    {!!audioError && <Text accessibilityLiveRegion="polite" style={s.error}>{audioError}</Text>}
    <Pressable accessibilityRole="button" accessibilityState={{ expanded: showTranslation }} aria-expanded={showTranslation} style={s.secondaryButton} onPress={() => setShowTranslation(value => !value)}><Text style={s.secondaryButtonText}>{showTranslation ? 'پنهان‌کردن ترجمهٔ متن' : 'دیدن ترجمهٔ متن'}</Text></Pressable>
    {showTranslation && <Text style={s.text}>{reading.translation}</Text>}
    <EnglishB2TopicPractice key={`${lessonId}-reading`} lessonId={lessonId} topics={['درک پیام', 'تحلیل استدلال یا منظور']} practice={practice}
      heading="دو پرسش دربارهٔ متن · اختیاری" description="پاسخ‌ها ذخیره می‌شوند و قابل تکرارند. شنیدن متن اجباری نیست؛ این پرسش‌ها به‌تنهایی مهارت شنیداری را نمی‌سنجند." />
  </View>;
}
