import { LocalizedText as Text } from '@/components/LocalizedText';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import type { A1SkillTask } from '@/lib/languages/a1Skills';
import { Typography } from '@/lib/theme';

/** Optional practice is deliberately separate from saved lesson completion. */
export default function StarterA1Skill({task, onSpeak}: {task: A1SkillTask; onSpeak: (text: string, rate?: number) => void}) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const listening = task.kind === 'listening';
  return <View style={s.card}>
    <Pressable accessibilityRole="button" accessibilityState={{expanded:open}} onPress={() => setOpen(value => !value)} style={s.toggle}>
      <Text style={s.title}>تمرین اختیاری {listening ? 'درک شنیداری' : 'درک مطلب'}</Text><Text style={s.icon}>{open ? '−' : '+'}</Text>
    </Pressable>
    {open && <>
      <Text style={s.description}>{listening ? 'به پیام کوتاه گوش کنید و پاسخ را انتخاب کنید. اگر صدا در دسترس نیست، این تمرین را رد کنید.' : 'پیام کوتاه را بخوانید و بر اساس آن پاسخ دهید.'}</Text>
      {listening ? <Pressable accessibilityRole="button" accessibilityLabel="پخش پیام تمرین شنیداری" style={s.audio} onPress={() => onSpeak(task.passage, 0.8)}><Volume2 size={19} color="#5148C8"/><Text style={s.audioText}>پخش پیام</Text></Pressable> : <Text style={s.passage}>{task.passage}</Text>}
      <Text style={s.prompt}>{task.promptFa}</Text>
      {task.choices.map((choice, index) => <Pressable key={choice} accessibilityRole="radio" accessibilityState={{checked: answer === index}} onPress={() => setAnswer(index)} style={[s.choice, answer === index && s.selected]}><Text style={s.choiceText}>{choice}</Text></Pressable>)}
      {answer !== null && <View accessibilityLiveRegion="polite" style={s.feedback}><Text style={s.feedbackText}>{answer === task.correctIndex ? `درست است. ${task.explanationFa}` : 'این گزینه درست نیست؛ دوباره تلاش کنید.'}</Text>{listening && answer === task.correctIndex ? <Text style={s.passage}>{task.passage}</Text> : null}</View>}
      <Text style={s.note}>این تمرین اختیاری است؛ پاسخ آن ذخیره نمی‌شود و شرط پایان درس نیست.</Text>
    </>}
  </View>;
}
const s = StyleSheet.create({
  card:{width:'100%',marginTop:16,padding:16,borderWidth:1,borderColor:'#E1E4F0',backgroundColor:'#FFF',borderRadius:18,gap:10},
  toggle:{minHeight:44,flexDirection:'row-reverse',alignItems:'center',justifyContent:'space-between',gap:8},
  title:{fontFamily:Typography.boldFontFamily,fontSize:16,color:'#302880',textAlign:'right',flex:1},
  icon:{fontFamily:Typography.boldFontFamily,fontSize:22,color:'#5148C8'},
  description:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:22,color:'#52566A',textAlign:'right',writingDirection:'rtl'},
  audio:{minHeight:46,alignSelf:'flex-start',flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:14,borderRadius:12,backgroundColor:'#F1F0FF'},
  audioText:{fontFamily:Typography.boldFontFamily,fontSize:14,color:'#5148C8'},
  passage:{fontFamily:Typography.fontFamily,fontSize:16,lineHeight:25,color:'#202039',textAlign:'left',writingDirection:'ltr'},
  prompt:{fontFamily:Typography.boldFontFamily,fontSize:15,lineHeight:24,color:'#202039',textAlign:'right',writingDirection:'rtl'},
  choice:{minHeight:44,borderRadius:12,borderWidth:1,borderColor:'#DFE1EC',padding:10,justifyContent:'center'},
  selected:{backgroundColor:'#F0EFFF',borderColor:'#5148C8'},
  choiceText:{fontFamily:Typography.fontFamily,fontSize:14,lineHeight:23,color:'#292A3D',textAlign:'right',writingDirection:'rtl'},
  feedback:{padding:10,borderRadius:12,backgroundColor:'#F2F6F4',gap:8},
  feedbackText:{fontFamily:Typography.fontFamily,fontSize:14,lineHeight:23,color:'#176B55',textAlign:'right',writingDirection:'rtl'},
  note:{fontFamily:Typography.fontFamily,fontSize:12,lineHeight:20,color:'#52566A',textAlign:'right',writingDirection:'rtl'},
});
