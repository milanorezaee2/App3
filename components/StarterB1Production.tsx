import {useState} from 'react';
import {Pressable,StyleSheet,Text,View} from 'react-native';
import {Typography} from '@/lib/theme';
import type {B1ProductionPrompt} from '@/lib/languages/b1Production';
import type {StarterLesson} from '@/lib/languages/newCourses';
import StarterPracticeDraft from '@/components/StarterPracticeDraft';
import StarterOralSelfReview from '@/components/StarterOralSelfReview';
import {practiceDraftKey} from '@/lib/languages/localPracticeDraft';

/** Optional open-ended work: local component state only, never graded or recorded. */
function Tasks({prompt,examples,onSpeak,lesson}:{prompt:B1ProductionPrompt;examples:StarterLesson['sentences'];onSpeak:(text:string)=>void;lesson:StarterLesson}){
 const [showGuide,setShowGuide]=useState(false);const language=lesson.id.split('-')[0];const level=lesson.levelId===4?'b2':'b1';
 return <View style={s.content}>
  <Text style={s.note}>این تمرین اختیاری است. گفتار ضبط یا خودکار ارزیابی نمی‌شود؛ متن فقط در صورت انتخاب شما روی همین دستگاه ذخیره می‌شود و تصحیح خودکار ندارد.</Text>
  <Text style={s.heading}>گفتار آزاد</Text><Text style={s.prompt}>{prompt.speaking}</Text><Text style={s.note}>با صدای بلند در چند جمله پاسخ دهید؛ پاسخ‌های متفاوت می‌توانند مناسب باشند.</Text>
  <StarterOralSelfReview/>
  <Text style={s.heading}>نوشتار آزاد</Text><Text style={s.prompt}>{prompt.writing}</Text>
  <StarterPracticeDraft label="پاسخ آزاد نوشتاری این درس" storageKey={practiceDraftKey(language,level,'lesson',lesson.id)}/>
  <Text style={s.heading}>خودبازبینی</Text>{prompt.checklist.map(item=><Text key={item} style={s.note}>• {item}</Text>)}
  <Pressable accessibilityRole="button" accessibilityState={{expanded:showGuide}} onPress={()=>setShowGuide(v=>!v)} style={s.action}><Text style={s.actionText}>{showGuide?'پنهان کردن نمونه‌های درس':'دیدن نمونه‌های راهنما از درس'}</Text></Pressable>
  {showGuide && examples.slice(0,2).map(sentence=><View key={sentence.id} style={s.example}><Text style={s.target}>{sentence.text}</Text><Text style={s.note}>{sentence.fa}</Text><Pressable accessibilityRole="button" accessibilityLabel={`شنیدن راهنما: ${sentence.text}`} onPress={()=>onSpeak(sentence.text)} style={s.action}><Text style={s.actionText}>شنیدن نمونه</Text></Pressable></View>)}
 </View>;
}
export default function StarterB1Production({prompt,lesson,onSpeak}:{prompt:B1ProductionPrompt;lesson:StarterLesson;onSpeak:(text:string)=>void}){
 const [open,setOpen]=useState(false);
 return <View style={s.card}><Pressable accessibilityRole="button" accessibilityState={{expanded:open}} onPress={()=>setOpen(v=>!v)} style={s.toggle}><Text style={s.title}>تمرین آزاد گفتار و نوشتار</Text><Text style={s.symbol}>{open?'−':'+'}</Text></Pressable>{open&&<Tasks prompt={prompt} examples={lesson.sentences} onSpeak={onSpeak} lesson={lesson}/>}</View>;
}
const s=StyleSheet.create({card:{width:'100%',borderRadius:16,borderWidth:1,borderColor:'#D7D4F4',backgroundColor:'#FFF',padding:14,marginTop:12},toggle:{minHeight:44,flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',gap:8},title:{fontFamily:Typography.boldFontFamily,fontSize:15,lineHeight:25,color:'#302880',textAlign:'right',flex:1},symbol:{fontSize:22,color:'#5148C8'},content:{gap:10,marginTop:8},heading:{fontFamily:Typography.boldFontFamily,fontSize:14,lineHeight:23,color:'#5148C8',textAlign:'right',writingDirection:'rtl'},prompt:{fontFamily:Typography.boldFontFamily,fontSize:14,lineHeight:24,color:'#202039',textAlign:'right',writingDirection:'rtl'},note:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:22,color:'#475569',textAlign:'right',writingDirection:'rtl'},input:{minHeight:110,borderColor:'#CBD5E1',borderWidth:1,borderRadius:10,padding:10,backgroundColor:'#FAFAFE',textAlign:'left',writingDirection:'ltr',textAlignVertical:'top',fontSize:15,color:'#202039'},action:{minHeight:44,justifyContent:'center',alignItems:'flex-end'},actionText:{fontFamily:Typography.boldFontFamily,fontSize:13,lineHeight:22,color:'#5148C8',textAlign:'right'},example:{borderWidth:1,borderColor:'#E1E4F0',borderRadius:10,padding:10,gap:6},target:{fontSize:15,lineHeight:24,color:'#202039',textAlign:'left',writingDirection:'ltr'}});
