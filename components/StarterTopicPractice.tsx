import {useState} from 'react';
import {Pressable,StyleSheet,Text,View} from 'react-native';
import StarterA1Skill from '@/components/StarterA1Skill';
import StarterPracticeDraft from '@/components/StarterPracticeDraft';
import StarterOralSelfReview from '@/components/StarterOralSelfReview';
import StarterTopicDeepening from '@/components/StarterTopicDeepening';
import {topicDeepening} from '@/lib/languages/topicDeepening';
import {topicPracticePlan} from '@/lib/languages/topicPracticePlans';
import {practiceDraftKey} from '@/lib/languages/localPracticeDraft';
import {b1UnitSkills,b1GrammarPatterns} from '@/lib/languages/b1Units';
import {b2UnitSkills,b2GrammarPatterns} from '@/lib/languages/b2Units';
import type {NewLanguageId,StarterLesson} from '@/lib/languages/newCourses';
import {playStarterSpeech,stopStarterSpeech} from '@/lib/starterSpeech';
import {Typography} from '@/lib/theme';

type Props={level:'b1'|'b2';section:'foundation'|'survival';number:number;title:string;language:NewLanguageId;locale:string;lessons:StarterLesson[]};
function Practice({level,section,number,title,language,locale,lessons}:Props){
 const plan=topicPracticePlan(level,section,number,language);
 const [lessonId,setLessonId]=useState(lessons[0]?.id),[error,setError]=useState('');
 if(!plan)return null;
 const lesson=lessons.find(item=>item.id===lessonId);
 const skills=lesson?(level==='b1'?b1UnitSkills(language):b2UnitSkills(language))[lesson.id]??[]:[];
 const patterns=lesson?(level==='b1'?b1GrammarPatterns(language,lesson.id):b2GrammarPatterns(language,lesson.id)):[];
 const speak=(text:string,rate=0.85)=>{setError('');void playStarterSpeech(locale,text,rate,()=>setError('پخش صدا در دسترس نیست.'),()=>setError('صدای منطقه‌ای تأیید نشد؛ تلفظ ممکن است متفاوت باشد.'));};
 const deepening=topicDeepening(level,section,number);
 return <View style={s.detail}>
  {deepening&&<StarterTopicDeepening item={deepening} language={language} onSpeak={speak}/>}
  <Text style={s.heading}>هدف تمرین</Text><Text style={s.body}>{plan.goal}</Text>
  <Text style={s.heading}>۱. مرور محتوای مرتبط</Text><Text style={s.body}>نمونه‌ها، نکات و سؤال‌های زیر از درس‌های موجود بازاستفاده شده‌اند؛ ممکن است فقط به بخشی از این سرفصل مربوط باشند، نه تمام دستور یا مهارت آن. صدا از دستگاه است، نه ضبط انسانی.</Text>
  {lessons.length>0&&<View style={s.row}>{lessons.map(item=><Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`مرور درس مرتبط ${item.title}`} accessibilityState={{selected:item.id===lessonId}} onPress={()=>{void stopStarterSpeech();setLessonId(item.id);}} style={[s.choice,item.id===lessonId&&s.selected]}><Text style={s.body}>{item.title}</Text></Pressable>)}</View>}
  {lesson?<View key={lesson.id} style={s.subcard}><Text style={s.body}>{lesson.situation}</Text>{lesson.teachingFa&&<Text style={s.body}>{lesson.teachingFa}</Text>}{lesson.sentences.slice(0,3).map(sentence=><View key={sentence.id} style={s.sample}><Text style={s.target}>{sentence.text}</Text><Text style={s.body}>{sentence.fa}</Text><Pressable accessibilityRole="button" accessibilityLabel={`شنیدن نمونه ${sentence.text}`} onPress={()=>speak(sentence.text)} style={s.audio}><Text style={s.link}>شنیدن نمونه</Text></Pressable></View>)}{patterns.map((p,i)=><View key={`${p.form}-${i}`} style={s.sample}><Text style={s.target}>{p.form}</Text><Text style={s.body}>{p.explanationFa}</Text></View>)}{skills.map((task,i)=><StarterA1Skill key={`${lesson.id}-${i}`} task={task} onSpeak={speak}/>)}</View>:<Text style={s.body}>برای این موضوع هنوز درس مرتبطی در دسترس نیست.</Text>}
  {!!error&&<Text accessibilityRole="alert" style={s.error}>{error}</Text>}
  <Text style={s.heading}>۲. تمرین گفتار برای همین سرفصل</Text><Text style={s.body}>{plan.speaking}</Text><Text style={s.body}>پاسخ را به زبان دوره بگویید. ابتدا نکات را طرح کنید، پاسخ دهید و سپس از فهرست خودبازبینی استفاده کنید؛ گفتار ضبط یا تصحیح نمی‌شود.</Text><StarterOralSelfReview/>
  <Text style={s.heading}>۳. تمرین نوشتار برای همین سرفصل</Text><Text style={s.body}>{plan.writing}</Text><Text style={s.body}>ابتدا طرح کوتاهی تهیه کنید؛ سپس به زبان دوره بنویسید و بررسی کنید که به همهٔ بخش‌های درخواست پاسخ داده‌اید، رابطهٔ ایده‌ها روشن است و لحن به مخاطب می‌خورد.</Text><StarterPracticeDraft label={`نوشتار موضوع ${title}`} storageKey={practiceDraftKey(language,level,'workshop',`topic-${section}-${number}`)}/>
  <Text style={s.note}>این تمرین افزودهٔ موضوعی است، نه درس جامع یا سنجش سطح. پاسخ تولیدی تصحیح خودکار یا بازخورد مدرس ندارد.</Text>
 </View>;
}
export default function StarterTopicPractice(props:Props){
 const [open,setOpen]=useState(false);
 return <View style={s.root}><Pressable accessibilityRole="button" accessibilityLabel={`تمرین موضوعی ${props.title}`} accessibilityState={{expanded:open}} onPress={()=>{if(open)void stopStarterSpeech();setOpen(value=>!value);}} style={s.toggle}><Text style={s.heading}>تمرین گفتار و نوشتار این موضوع</Text><Text style={s.heading}>{open?'−':'+'}</Text></Pressable>{open&&<Practice {...props}/>}</View>;
}
const s=StyleSheet.create({root:{width:'100%',borderWidth:1,borderColor:'#D7D4F4',borderRadius:12,padding:10,gap:8},toggle:{minHeight:44,flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',gap:8},detail:{gap:10},heading:{fontFamily:Typography.boldFontFamily,fontSize:14,lineHeight:24,color:'#5148C8',textAlign:'right',writingDirection:'rtl'},body:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:23,color:'#292A3D',textAlign:'right',writingDirection:'rtl'},note:{fontFamily:Typography.fontFamily,fontSize:12,lineHeight:21,color:'#475569',textAlign:'right',writingDirection:'rtl'},target:{fontSize:15,lineHeight:25,color:'#202039',textAlign:'left',writingDirection:'ltr'},subcard:{borderWidth:1,borderColor:'#E1E4F0',borderRadius:10,padding:10,gap:9},sample:{gap:4},row:{flexDirection:'row-reverse',flexWrap:'wrap',gap:8},choice:{minHeight:44,borderRadius:10,borderWidth:1,borderColor:'#DFE1EC',padding:10,justifyContent:'center'},selected:{backgroundColor:'#F0EFFF',borderColor:'#5148C8'},audio:{minHeight:44,alignSelf:'flex-start',justifyContent:'center'},link:{fontFamily:Typography.boldFontFamily,fontSize:13,color:'#5148C8'},error:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:22,color:'#A32C36',textAlign:'right'}});
