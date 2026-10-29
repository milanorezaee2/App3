import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { B2_SCENARIOS, type B2Scenario } from '@/lib/englishB2Scenarios';
import { supplementStyles as s } from './EnglishSupplementTask';

/** A response model is a comparison aid, not the only correct answer. */
export function EnglishB2Scenario({ lessonId, speak, scenario: supplied }: { lessonId: string; speak: (text: string) => void; scenario?: B2Scenario }) {
  const scenario = supplied ?? B2_SCENARIOS[lessonId];
  const [showSample, setShowSample] = useState(false);
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);
  if (!scenario) return null;
  return <View style={[s.card, { marginTop: 18 }]}>
    <Text style={s.heading}>موقعیت واقعی · تمرین اختیاری</Text>
    <Text style={s.text}>{scenario.situation}</Text>
    <Text style={s.text}>{scenario.task}</Text>
    <Text style={s.text}>ابتدا پاسخ خود را با صدای بلند بگویید یا اینجا بنویسید؛ سپس با نمونه مقایسه کنید. پاسخ نمونه تنها پاسخ ممکن نیست.</Text>
    <TextInput accessibilityLabel="پاسخ آزاد به موقعیت" style={[s.input, { minHeight: 100, textAlignVertical: 'top' }]} multiline value={answer} onChangeText={setAnswer} maxLength={2000} placeholder="Write your response here…" placeholderTextColor="#7086A2" />
    <Text style={s.text}>متن و علامت‌های خودارزیابی فقط تا خروج از این مرحله نگه‌داری می‌شوند؛ تصحیح خودکار یا ذخیره نمی‌شوند و شرط پایان درس نیستند.</Text>
    <Pressable accessibilityRole="button" accessibilityState={{ expanded: showSample }} aria-expanded={showSample} style={s.secondaryButton} onPress={() => setShowSample(value => !value)}>
      <Text style={s.secondaryButtonText}>{showSample ? 'پنهان‌کردن پاسخ نمونه' : 'دیدن پاسخ نمونه و توضیح'}</Text>
    </Pressable>
    {showSample && <View style={s.sentenceCard}>
      <Text style={s.english}>{scenario.sample}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="شنیدن پاسخ نمونهٔ موقعیت" style={s.secondaryButton} onPress={() => speak(scenario.sample)}><Text style={s.secondaryButtonText}>شنیدن پاسخ نمونه</Text></Pressable>
      <Text style={s.text}>{scenario.translation}</Text>
      <Text style={s.text}>{scenario.explanation}</Text>
    </View>}
    <Text style={s.heading}>خودارزیابی پاسخ</Text>
    <Text style={s.text}>هر موردی را که در پاسخ خود رعایت کرده‌اید علامت بزنید. این علامت‌ها نمره یا تأیید تسلط نیستند.</Text>
    {scenario.checklist.map((item, index) => <Pressable key={item} accessibilityRole="checkbox" accessibilityLabel={item} accessibilityState={{ checked: checked[index] }} aria-checked={checked[index]} style={s.secondaryButton}
      onPress={() => setChecked(previous => previous.map((value, i) => i === index ? !value : value))}>
      <Text style={s.secondaryButtonText}>{checked[index] ? '☑' : '☐'} {item}</Text>
    </Pressable>)}
    <Text style={s.text}>برای ارزیابی مستقل دقت، روانی و تناسب پاسخ، از مدرس یا هم‌صحبت بازخورد بگیرید.</Text>
  </View>;
}
