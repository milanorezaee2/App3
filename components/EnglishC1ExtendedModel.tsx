import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { C1_EXTENDED_MODELS } from '@/lib/englishC1ExtendedModels';
import { supplementStyles as s } from './EnglishSupplementTask';

/** The existing open response remains unchanged; this is an optional comparison aid. */
export function EnglishC1ExtendedModel({ lessonId, speak }: { lessonId: string; speak: (text: string) => void }) {
  const model = C1_EXTENDED_MODELS[lessonId];
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState<boolean[]>([false, false, false, false]);
  if (!model) return null;
  return <View style={[s.card, { marginTop: 18 }]}>
    <Text style={s.heading}>پاسخ نمونهٔ کامل‌تر · {model.format}</Text>
    <Text style={s.text}>پاسخ خود را در موقعیت بالا بنویسید یا بگویید و سپس با نمونه مقایسه کنید. این فقط یک پاسخ ممکن است، نه متنی که باید عیناً تکرار شود.</Text>
    <Pressable accessibilityRole="button" accessibilityState={{ expanded: show }} aria-expanded={show} style={s.secondaryButton} onPress={() => setShow(value => !value)}><Text style={s.secondaryButtonText}>{show ? 'پنهان‌کردن پاسخ کامل‌تر' : 'دیدن پاسخ کامل‌تر و ترجمه'}</Text></Pressable>
    {show && <View style={s.sentenceCard}>
      <Text style={s.english}>{model.sample}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="شنیدن پاسخ کامل‌تر" style={s.secondaryButton} onPress={() => speak(model.sample)}><Text style={s.secondaryButtonText}>شنیدن پاسخ کامل‌تر</Text></Pressable>
      <Text style={s.text}>{model.translation}</Text>
      <Text style={s.text}>{model.guidance}</Text>
    </View>}
    <Text style={s.heading}>معیارهای مقایسهٔ پاسخ</Text>
    <Text style={s.text}>هر معیار را جداگانه بررسی کنید؛ علامت‌ها فقط در همین صفحه می‌مانند و نمرهٔ خودکار یا تأیید تسلط نیستند.</Text>
    {model.criteria.map((item, index) => <Pressable key={item} accessibilityRole="checkbox" accessibilityLabel={item} accessibilityState={{ checked: checked[index] }} aria-checked={checked[index]} style={s.secondaryButton} onPress={() => setChecked(previous => previous.map((value, i) => i === index ? !value : value))}>
      <Text style={s.secondaryButtonText}>{checked[index] ? '☑' : '☐'} {item}</Text>
    </Pressable>)}
  </View>;
}
