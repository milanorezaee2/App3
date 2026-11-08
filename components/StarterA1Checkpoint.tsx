import { LocalizedText as Text, LocalizedTextInput as TextInput } from '@/components/LocalizedText';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { B2_CHECKPOINT } from '@/lib/languages/b2Checkpoint';
import { B1_CHECKPOINT } from '@/lib/languages/b1Checkpoint';
import { A2_CHECKPOINT } from '@/lib/languages/a2Checkpoint';
import { A1_CHECKPOINT, type A1CheckpointProduction, type A1CheckpointQuestion } from '@/lib/languages/a1Checkpoint';
import type { NewLanguageId } from '@/lib/languages/newCourses';
import { playStarterSpeech, stopStarterSpeech } from '@/lib/starterSpeech';
import { Typography } from '@/lib/theme';
import { toPersianDigits as fa } from '@/lib/format';

function Comprehension({task, index, speak}: {task:A1CheckpointQuestion; index:number; speak:(text:string)=>void}) {
  const [answer,setAnswer] = useState<number|null>(null);
  const [showText,setShowText] = useState(false);
  const listening = task.kind === 'listening';
  return <View style={s.task}>
    <Text style={s.taskHeading}>{fa(index+1)}. {listening ? 'درک شنیداری' : 'درک مطلب'}</Text>
    {listening ? <>
      <Pressable accessibilityRole="button" accessibilityLabel={`پخش پیام شنیداری ${fa(index+1)}`} style={s.action} onPress={()=>speak(task.text)}><Volume2 size={16} color="#5148C8"/><Text style={s.actionText}>پخش پیام</Text></Pressable>
      <Pressable accessibilityRole="button" accessibilityState={{expanded:showText}} onPress={()=>setShowText(v=>!v)} style={s.textAction}><Text style={s.actionText}>{showText ? 'پنهان کردن متن پیام' : 'نمایش متن پیام'}</Text></Pressable>
      {showText && <Text style={s.target}>{task.text}</Text>}
    </> : <Text style={s.target}>{task.text}</Text>}
    <Text style={s.question}>{task.question}</Text>
    {task.choices.map((choice,i)=><Pressable key={choice} accessibilityRole="radio" accessibilityState={{checked:answer===i}} onPress={()=>setAnswer(i)} style={[s.choice,answer===i && s.selected]}><Text style={s.choiceText}>{choice}</Text></Pressable>)}
    {answer!==null && <Text accessibilityLiveRegion="polite" style={s.feedback}>{answer===task.correctIndex ? `درست است. ${task.explanation}` : 'این پاسخ مناسب نیست؛ دوباره امتحان کنید.'}</Text>}
  </View>;
}
function Production({task, kind, index, speak}:{task:A1CheckpointProduction;kind:'speaking'|'writing';index:number;speak:(text:string)=>void}) {
  const [value,setValue]=useState('');
  const [showModel,setShowModel]=useState(false);
  const speaking=kind==='speaking';
  return <View style={s.task}>
    <Text style={s.taskHeading}>{fa(index+1)}. {speaking ? 'تمرین گفتار' : 'تمرین نوشتن'}</Text>
    <Text style={s.question}>{task.prompt}</Text>
    {task.stimulus && <View style={s.stimulus}>
      <Text style={s.target}>{task.stimulus}</Text><Text style={s.choiceText}>{task.stimulusFa}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`شنیدن پرسش گفتار ${fa(index+1)}`} style={s.action} onPress={()=>speak(task.stimulus!)}><Volume2 size={16} color="#5148C8"/><Text style={s.actionText}>شنیدن پرسش</Text></Pressable>
    </View>}
    {!speaking && <TextInput accessibilityLabel={`پاسخ نوشتاری ${fa(index+1)}`} value={value} onChangeText={setValue} multiline autoCorrect={false} autoCapitalize="sentences" placeholder="…" style={s.input}/>}
    <Pressable accessibilityRole="button" accessibilityState={{expanded:showModel}} onPress={()=>setShowModel(v=>!v)} style={s.textAction}><Text style={s.actionText}>{showModel ? 'پنهان کردن نمونه' : 'نمایش یک پاسخ نمونه'}</Text></Pressable>
    {showModel && <><Text style={s.target}>{task.model}</Text><Pressable accessibilityRole="button" accessibilityLabel={`شنیدن پاسخ نمونه ${fa(index+1)} ${speaking ? 'گفتار' : 'نوشتن'}`} style={s.action} onPress={()=>speak(task.model)}><Volume2 size={16} color="#5148C8"/><Text style={s.actionText}>شنیدن نمونه</Text></Pressable></>}
  </View>;
}
export default function StarterA1Checkpoint({language,locale,level=1}:{language:NewLanguageId;locale:string;level?:1|2|3|4}) {
  const [open,setOpen]=useState(false);
  const [speechError,setSpeechError]=useState('');
  const data=(level === 4 ? B2_CHECKPOINT : level === 3 ? B1_CHECKPOINT : level === 2 ? A2_CHECKPOINT : A1_CHECKPOINT)[language];
  useEffect(()=>()=>{void stopStarterSpeech();},[language]);
  const speak=(text:string)=>{setSpeechError('');void playStarterSpeech(locale,text,0.7,()=>setSpeechError('پخش صدا در دسترس نیست؛ تنظیمات گفتار دستگاه را بررسی کنید.'),()=>setSpeechError('صدای منطقه‌ای تأیید نشد؛ تلفظ ممکن است با لهجهٔ انتخاب‌شده متفاوت باشد.'));};
  return <View style={s.card}>
    <Pressable accessibilityRole="button" accessibilityState={{expanded:open}} onPress={()=>{if(open) void stopStarterSpeech();setOpen(v=>!v);}} style={s.toggle}><Text style={s.title}>تمرین جمع‌بندی {level === 4 ? 'B2' : level === 3 ? 'B1' : `A${level}`}</Text><Text style={s.icon}>{open?'−':'+'}</Text></Pressable>
    {open && <>
      <Text style={s.description}>پیام‌های تازه را گوش کنید یا بخوانید، سپس گفتار و نوشتن را تمرین کنید. این تمرین اختیاری و مستقل از پیشرفت درس‌هاست؛ پاسخ‌ها ذخیره نمی‌شوند و آزمون رسمی نیست.</Text>
      {!!speechError && <Text accessibilityRole="alert" style={s.error}>{speechError}</Text>}
      <Text style={s.section}>شنیدن و خواندن</Text>
      {data.questions.map((task,i)=><Comprehension key={`${language}-q${i}`} task={task} index={i} speak={speak}/>)}
      <Text style={s.section}>گفتار</Text>
      <Text style={s.description}>پاسخ را بلند بگویید؛ سپس در صورت نیاز نمونه را بشنوید. گفتار ضبط یا به‌صورت خودکار ارزیابی نمی‌شود.</Text>
      {data.speaking.map((task,i)=><Production key={`${language}-s${i}`} task={task} index={i} kind="speaking" speak={speak}/>)}
      <Text style={s.section}>نوشتن</Text>
      <Text style={s.description}>پاسخ خودتان را بنویسید و با نمونه مقایسه کنید؛ پاسخ‌های دیگری هم می‌توانند درست باشند. این قسمت نمرهٔ خودکار ندارد.</Text>
      {data.writing.map((task,i)=><Production key={`${language}-w${i}`} task={task} index={i} kind="writing" speak={speak}/>)}
    </>}
  </View>;
}
const s=StyleSheet.create({
 card:{width:'100%',borderRadius:18,borderWidth:1,borderColor:'#DDD9F6',backgroundColor:'#FFF',padding:16,gap:12},
 toggle:{minHeight:44,flexDirection:'row-reverse',alignItems:'center',justifyContent:'space-between',gap:8},
 title:{flex:1,fontFamily:Typography.boldFontFamily,fontSize:16,lineHeight:26,color:'#302880',textAlign:'right',writingDirection:'rtl'},
 icon:{fontFamily:Typography.boldFontFamily,fontSize:22,color:'#5148C8'},
 description:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:22,color:'#475569',textAlign:'right',writingDirection:'rtl'},
 section:{fontFamily:Typography.boldFontFamily,fontSize:15,color:'#302880',textAlign:'right',writingDirection:'rtl',marginTop:4},
 task:{borderWidth:1,borderColor:'#E1E4F0',borderRadius:14,padding:12,gap:9,backgroundColor:'#FAFAFE'},
 taskHeading:{fontFamily:Typography.boldFontFamily,fontSize:13,lineHeight:22,color:'#5148C8',textAlign:'right',writingDirection:'rtl'},
 target:{fontFamily:Typography.latinFontFamily,fontSize:16,lineHeight:25,color:'#202039',textAlign:'left',writingDirection:'ltr'},
 question:{fontFamily:Typography.boldFontFamily,fontSize:14,lineHeight:24,color:'#202039',textAlign:'right',writingDirection:'rtl'},
 choice:{minHeight:44,borderRadius:10,borderWidth:1,borderColor:'#DFE1EC',padding:10,justifyContent:'center',backgroundColor:'#FFF'},
 selected:{backgroundColor:'#F0EFFF',borderColor:'#5148C8'},
 choiceText:{fontFamily:Typography.fontFamily,fontSize:14,lineHeight:23,color:'#292A3D',textAlign:'right',writingDirection:'rtl'},
 feedback:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:22,color:'#176B55',textAlign:'right',writingDirection:'rtl'},
 action:{minHeight:44,alignSelf:'flex-start',flexDirection:'row',alignItems:'center',gap:7,paddingHorizontal:10,borderRadius:10,backgroundColor:'#F1F0FF'},
 textAction:{minHeight:44,alignSelf:'flex-end',justifyContent:'center',paddingHorizontal:10},
 actionText:{fontFamily:Typography.boldFontFamily,fontSize:13,color:'#5148C8',writingDirection:'rtl'},
 stimulus:{gap:6},input:{fontFamily:Typography.latinFontFamily,minHeight:55,borderWidth:1,borderColor:'#DCE0EE',borderRadius:10,padding:10,fontSize:16,color:'#202039',backgroundColor:'#FFF',textAlign:'left',writingDirection:'ltr'},
 error:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:22,color:'#9B263C',textAlign:'right',writingDirection:'rtl'},
});
