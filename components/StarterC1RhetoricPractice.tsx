import { LocalizedText as Text } from '@/components/LocalizedText';
import {useState} from 'react';
import {Pressable,StyleSheet,View} from 'react-native';
import type {C1RhetoricPractice} from '@/lib/languages/c1RhetoricPractice';
import type {NewLanguageId} from '@/lib/languages/newCourses';
import {practiceDraftKey} from '@/lib/languages/localPracticeDraft';
import StarterPracticeDraft from '@/components/StarterPracticeDraft';
import {Typography} from '@/lib/theme';

export default function StarterC1RhetoricPractice({item,language,lessonId,onSpeak}:{item:C1RhetoricPractice;language:NewLanguageId;lessonId:string;onSpeak:(text:string,rate?:number)=>void}){
 const [answer,setAnswer]=useState<number|null>(null),[showModel,setShowModel]=useState(false);
 const correctPosition=item.number%3;
 const options=[...item.choices[language].slice(1)];options.splice(correctPosition,0,item.choices[language][0]);
 const label=`تمرین تحلیلی C1 ${item.number}`;
 return <View style={s.root}>
  <Text style={s.title}>{item.title}</Text>
  <Text style={s.body}>{item.concept}</Text>
  <Text style={s.heading}>موقعیت تازه</Text>
  <Text style={s.target}>{item.context[language]}</Text>
  <Pressable accessibilityRole="button" accessibilityLabel={`شنیدن موقعیت تحلیلی C1 ${item.number}`} style={s.action} onPress={()=>onSpeak(item.context[language],.85)}><Text style={s.link}>شنیدن موقعیت با صدای دستگاه</Text></Pressable>
  <Text style={s.prompt}>{item.question}</Text>
  {options.map((option,i)=><Pressable key={i} accessibilityRole="radio" accessibilityLabel={`تحلیل C1 ${item.number} ${option}`} accessibilityState={{checked:answer===i}} style={[s.choice,answer===i&&s.selected]} onPress={()=>setAnswer(i)}><Text style={s.target}>{option}</Text></Pressable>)}
  {answer!==null&&<Text accessibilityLiveRegion="polite" style={answer===correctPosition?s.good:s.error}>{answer===correctPosition?`درست است. ${item.explanation} شاهد: ${item.evidence[language]}`:'این گزینه در این موقعیت مناسب نیست؛ دوباره بررسی کنید.'}</Text>}
  <Text style={s.heading}>کاربرد در گفتار یا نوشتار</Text>
  <Text style={s.body}>{item.assignment} پاسخ را به زبان دوره بیان کنید یا بنویسید.</Text>
  <Text style={s.body}>خودبازبینی:</Text>
  {item.criteria.map((criterion,i)=><Text key={i} style={s.body}>□ {criterion}</Text>)}
  <StarterPracticeDraft label={label} storageKey={practiceDraftKey(language,'c1','workshop',`rhetoric-${lessonId}`)}/>
  <Pressable accessibilityRole="button" accessibilityState={{expanded:showModel}} style={s.action} onPress={()=>setShowModel(v=>!v)}><Text style={s.link}>{showModel?'پنهان کردن نمونهٔ پاسخ تحلیلی':'نمایش نمونهٔ پاسخ تحلیلی'}</Text></Pressable>
  {showModel&&<><Text style={s.body}>یک پاسخ ممکن.</Text><Text style={s.target}>{item.model[language]}</Text></>}
 </View>;
}
const s=StyleSheet.create({root:{borderTopWidth:1,borderTopColor:'#DADCF0',paddingTop:12,gap:9},title:{fontFamily:Typography.boldFontFamily,fontSize:15,lineHeight:25,color:'#302880',textAlign:'right',writingDirection:'rtl'},heading:{fontFamily:Typography.boldFontFamily,fontSize:14,lineHeight:24,color:'#5148C8',textAlign:'right',writingDirection:'rtl'},body:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:23,color:'#292A3D',textAlign:'right',writingDirection:'rtl'},prompt:{fontFamily:Typography.boldFontFamily,fontSize:14,lineHeight:24,color:'#202039',textAlign:'right',writingDirection:'rtl'},target:{fontSize:15,lineHeight:25,color:'#202039',textAlign:'left',writingDirection:'ltr'},choice:{minHeight:44,borderWidth:1,borderColor:'#DFE1EC',borderRadius:10,padding:10,justifyContent:'center',backgroundColor:'#fff'},selected:{backgroundColor:'#F0EFFF',borderColor:'#5148C8'},good:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:23,color:'#176B55',textAlign:'right',writingDirection:'rtl'},error:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:23,color:'#A32C36',textAlign:'right',writingDirection:'rtl'},action:{minHeight:44,alignItems:'flex-end',justifyContent:'center'},link:{fontFamily:Typography.boldFontFamily,fontSize:13,color:'#5148C8',textAlign:'right'}});
