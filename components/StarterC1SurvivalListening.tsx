import { LocalizedText as Text } from '@/components/LocalizedText';
import {useState} from 'react';
import {Pressable,StyleSheet,View} from 'react-native';
import type {SurvivalListening} from '@/lib/languages/c1SurvivalListening';
import {c1SurvivalDecisions} from '@/lib/languages/c1SurvivalDecisions';
import {c1SurvivalConversations,c1SurvivalPartnerLines} from '@/lib/languages/c1SurvivalConversation';
import type {NewLanguageId} from '@/lib/languages/newCourses';
import {practiceDraftKey} from '@/lib/languages/localPracticeDraft';
import StarterPracticeDraft from '@/components/StarterPracticeDraft';
import {Typography} from '@/lib/theme';
export default function StarterC1SurvivalListening({item,language,lessonId,onSpeak}:{item:SurvivalListening;language:NewLanguageId;lessonId:string;onSpeak:(text:string,rate?:number)=>void}){
 const [transcript,setTranscript]=useState(false),[answer,setAnswer]=useState<number|null>(null),[model,setModel]=useState(false),[decisions,setDecisions]=useState<Record<number,boolean|undefined>>({});
 const correctPosition=item.number%3,options=[...item.choices.slice(1)];options.splice(correctPosition,0,item.choices[0]);
 const label=`تمرین موقعیتی Survival ${item.number}`;
 const partner=c1SurvivalPartnerLines[language];
 const replies=c1SurvivalConversations[item.number-1][language];
 const partnerLine=(turn:number)=>turn===0?partner.opening:decisions[0]?partner.nextGood:partner.nextBad;
 const outcome=(turn:number)=>turn===0?null:decisions[1]?partner.endGood:partner.endBad;
 return <View style={s.root}>
  <Text style={s.heading}>شنیداری مستقل و تمرین نقش</Text><Text style={s.body}>این موقعیت ساختگی با متن خواندن درس متفاوت است. ابتدا صدای دستگاه را بشنوید؛ این صدا ضبط انسانی نیست.</Text>
  <Pressable accessibilityRole="button" accessibilityLabel={`شنیدن شنیداری Survival ${item.number}`} style={s.action} onPress={()=>onSpeak(item.text[language],.85)}><Text style={s.link}>پخش موقعیت شنیداری</Text></Pressable>
  <Pressable accessibilityRole="button" accessibilityState={{expanded:transcript}} aria-expanded={transcript} accessibilityLabel={`متن شنیداری Survival ${item.number}`} style={s.action} onPress={()=>setTranscript(v=>!v)}><Text style={s.link}>{transcript?'پنهان کردن متن':'نمایش متن شنیداری'}</Text></Pressable>{transcript&&<Text style={s.target}>{item.text[language]}</Text>}
  <Text style={s.prompt}>{item.prompt}</Text>{options.map((option,i)=><Pressable key={i} accessibilityRole="radio" accessibilityLabel={`شنیداری Survival ${item.number} ${option}`} accessibilityState={{checked:answer===i}} aria-checked={answer===i} style={[s.choice,answer===i&&s.selected]} onPress={()=>setAnswer(i)}><Text style={s.body}>{option}</Text></Pressable>)}
  {answer!==null&&<Text accessibilityLiveRegion="polite" style={answer===correctPosition?s.good:s.error}>{answer===correctPosition?`درست است. ${item.explanation} شاهد: ${item.evidence[language]}`:'این پاسخ مناسب نیست؛ دوباره گوش کنید.'}</Text>}
  <Text style={s.heading}>گفت‌وگوی موقعیتی دو مرحله‌ای</Text><Text style={s.body}>در این گفت‌وگوی از پیش نوشته‌شده، پاسخ‌ها به زبان دوره‌اند. واکنش هم‌گفت‌وگو به انتخاب شما بستگی دارد؛ مسیر را می‌توانید تغییر دهید.</Text>
  {c1SurvivalDecisions[item.number-1].map((decision,i)=>i===1&&decisions[0]===undefined?null:<View key={i} style={s.group}>
   <Text style={s.body}>هم‌گفت‌وگو:</Text><Text style={s.target}>{partnerLine(i)}</Text>
   <Pressable accessibilityRole="button" accessibilityLabel={`شنیدن هم‌گفت‌وگو Survival ${item.number} ${i+1}`} style={s.action} onPress={()=>onSpeak(partnerLine(i))}><Text style={s.link}>شنیدن هم‌گفت‌وگو</Text></Pressable>
   <Text style={s.prompt}>{i+1}. {decision.prompt}</Text>
   {(item.number%2?[false,true]:[true,false]).map(isBest=>{const option=replies[i][isBest?0:1];return <Pressable key={String(isBest)} accessibilityRole="radio" accessibilityLabel={`پاسخ گفتگو Survival ${item.number} ${i+1} ${option}`} accessibilityState={{checked:decisions[i]===isBest}} aria-checked={decisions[i]===isBest} style={[s.choice,decisions[i]===isBest&&s.selected]} onPress={()=>setDecisions(prev=>({...prev,[i]:isBest,...(i===0?{1:undefined}:{})}))}><Text style={s.target}>{option}</Text></Pressable>})}
   {decisions[i]!==undefined&&<><Text accessibilityLiveRegion="polite" style={decisions[i]?s.good:s.error}>{decisions[i]?`انتخاب مناسب است. ${decision.reason}`:`این واکنش مناسب نیست. ${decision.reason} می‌توانید انتخاب را تغییر دهید.`}</Text>{outcome(i)&&<><Text style={s.body}>هم‌گفت‌وگو:</Text><Text style={s.target}>{outcome(i)}</Text><Pressable accessibilityRole="button" accessibilityLabel={`شنیدن نتیجهٔ گفتگو Survival ${item.number}`} style={s.action} onPress={()=>onSpeak(outcome(i)!)}><Text style={s.link}>شنیدن واکنش</Text></Pressable></>}</>}
  </View>)}
  <Text style={s.heading}>پاسخ در موقعیت</Text><Text style={s.body}>{item.task} به زبان دوره پاسخ دهید؛ گفتار ضبط یا خودکار ارزیابی نمی‌شود.</Text><Text style={s.body}>برای خودبازبینی: آیا پاسخ به نیاز موقعیت مرتبط است؟ آیا واقعیت، میزان قطعیت و لحن مناسب را حفظ کرده‌اید؟</Text>
  <StarterPracticeDraft label={label} storageKey={practiceDraftKey(language,'c1','workshop',`survival-role-${lessonId}`)}/>
  <Pressable accessibilityRole="button" accessibilityLabel={`نمونهٔ نقش Survival ${item.number}`} accessibilityState={{expanded:model}} aria-expanded={model} style={s.action} onPress={()=>setModel(v=>!v)}><Text style={s.link}>{model?'پنهان کردن نمونهٔ نقش':'نمایش نمونهٔ نقش'}</Text></Pressable>{model&&<><Text style={s.body}>یک پاسخ ممکن؛ پاسخ آزاد به‌صورت خودکار تصحیح نمی‌شود.</Text><Text style={s.target}>{item.model[language]}</Text></>}
 </View>;
}
const s=StyleSheet.create({root:{borderTopWidth:1,borderTopColor:'#DADCF0',paddingTop:12,gap:9},group:{gap:6},heading:{fontFamily:Typography.boldFontFamily,fontSize:14,lineHeight:24,color:'#5148C8',textAlign:'right',writingDirection:'rtl'},body:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:23,color:'#292A3D',textAlign:'right',writingDirection:'rtl'},prompt:{fontFamily:Typography.boldFontFamily,fontSize:14,lineHeight:24,color:'#202039',textAlign:'right',writingDirection:'rtl'},target:{fontSize:15,lineHeight:25,color:'#202039',textAlign:'left',writingDirection:'ltr'},choice:{minHeight:44,borderWidth:1,borderColor:'#DFE1EC',borderRadius:10,padding:10,justifyContent:'center',backgroundColor:'#fff'},selected:{backgroundColor:'#F0EFFF',borderColor:'#5148C8'},good:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:23,color:'#176B55',textAlign:'right',writingDirection:'rtl'},error:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:23,color:'#A32C36',textAlign:'right',writingDirection:'rtl'},action:{minHeight:44,alignItems:'flex-end',justifyContent:'center'},link:{fontFamily:Typography.boldFontFamily,fontSize:13,color:'#5148C8',textAlign:'right'}});
