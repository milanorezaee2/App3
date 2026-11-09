import { LocalizedText as Text } from '@/components/LocalizedText';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { StarterLesson } from '@/lib/languages/newCourses';
import { buildExtraPractice } from '@/lib/languages/starterExtraPractice';
import { Typography } from '@/lib/theme';
import { toPersianDigits as fa } from '@/lib/format';

/** A low-stakes practice, intentionally separate from persisted review answers. */
export default function StarterExtraPractice({ lesson }: { lesson: StarterLesson }) {
  const questions = useMemo(() => buildExtraPractice(lesson), [lesson]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  if (!questions.length) return null;
  const question = questions[index];
  const advance = () => {
    if (index + 1 === questions.length) setFinished(true);
    else { setIndex(index + 1); setSelected(null); }
  };
  const restart = () => { setIndex(0); setSelected(null); setFinished(false); };
  return <View style={s.card}>
    <Pressable accessibilityRole="button" accessibilityState={{expanded:open}} onPress={() => setOpen(!open)} style={s.toggle}>
      <Text style={s.title}>{open ? 'بستن تمرین تکمیلی' : 'تمرین تکمیلی اختیاری'}</Text>
      <Text style={s.toggleIcon}>{open ? '−' : '+'}</Text>
    </Pressable>
    {open && <>
      <Text style={s.hint}>{fa(questions.length)} پرسش از نمونه‌های همین درس؛ این تمرین اختیاری است و نتیجهٔ آن ذخیره یا نمره‌گذاری نمی‌شود.</Text>
      {finished ? <>
        <Text accessibilityLiveRegion="polite" style={s.feedback}>تمرین تکمیلی تمام شد. می‌توانید دوباره تمرین کنید.</Text>
        <Pressable accessibilityRole="button" onPress={restart} style={s.action}><Text style={s.actionText}>تمرین دوباره</Text></Pressable>
      </> : <>
        <Text style={s.counter}>پرسش {fa(index + 1)} از {fa(questions.length)}</Text>
        <Text style={s.prompt}>در این درس، کدام معنی برای این نمونه نوشته شده است؟</Text>
        <Text style={s.target}>{question.target}</Text>
        {question.choices.map((choice, i) => <Pressable key={`${i}-${choice}`} accessibilityRole="button" accessibilityState={{selected:selected === i}} onPress={() => setSelected(i)} style={[s.choice, selected === i && s.choiceSelected]}><Text style={s.choiceText}>{choice}</Text></Pressable>)}
        {selected !== null && <>
          <Text accessibilityLiveRegion="polite" style={s.feedback}>{selected === question.correctIndex ? 'درست است.' : 'در این درس این معنی آمده است:'} {question.choices[question.correctIndex]}</Text>
          <Pressable accessibilityRole="button" onPress={advance} style={s.action}><Text style={s.actionText}>{index + 1 === questions.length ? 'پایان تمرین تکمیلی' : 'پرسش بعدی'}</Text></Pressable>
        </>}
      </>}
    </>}
  </View>;
}
const s = StyleSheet.create({
  card:{width:'100%',backgroundColor:'#fff',borderColor:'#E1E4F0',borderWidth:1,borderRadius:18,marginTop:16,padding:16,gap:10},
  toggle:{minHeight:44,flexDirection:'row-reverse',alignItems:'center',justifyContent:'space-between',gap:8},
  title:{fontFamily:Typography.boldFontFamily,fontSize:16,color:'#302880',textAlign:'right',flex:1},
  toggleIcon:{fontFamily:Typography.boldFontFamily,fontSize:22,color:'#5148C8'},
  hint:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:22,color:'#52566A',textAlign:'right',writingDirection:'rtl'},
  counter:{fontFamily:Typography.fontFamily,fontSize:13,color:'#5148C8',textAlign:'right'},
  prompt:{fontFamily:Typography.fontFamily,fontSize:15,lineHeight:24,color:'#202039',textAlign:'right',writingDirection:'rtl'},
  target:{fontFamily: 'Times New Roman',fontSize:16,lineHeight:25,color:'#202039',textAlign:'left',writingDirection:'ltr'},
  choice:{minHeight:46,borderColor:'#DCE0EE',borderWidth:1,borderRadius:12,paddingHorizontal:12,paddingVertical:9,justifyContent:'center'},
  choiceSelected:{borderColor:'#5148C8',backgroundColor:'#F1EFFF'},
  choiceText:{fontFamily:Typography.fontFamily,fontSize:15,lineHeight:23,color:'#202039',textAlign:'right',writingDirection:'rtl'},
  feedback:{fontFamily:Typography.fontFamily,fontSize:14,lineHeight:24,color:'#176B55',textAlign:'right',writingDirection:'rtl'},
  action:{minHeight:46,borderRadius:12,backgroundColor:'#5148C8',alignItems:'center',justifyContent:'center',paddingHorizontal:12},
  actionText:{fontFamily:Typography.boldFontFamily,fontSize:14,color:'#fff',textAlign:'center'},
});
