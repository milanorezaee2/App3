import {useEffect, useState} from 'react';
import {Pressable,StyleSheet,Text,View} from 'react-native';
import StarterTopicDeepening from '@/components/StarterTopicDeepening';
import StarterC1Assessment from '@/components/StarterC1Assessment';
import {getC1Curriculum,type C1Section} from '@/lib/languages/c1Curriculum';
import {c1Deepening} from '@/lib/languages/c1Deepening';
import type {NewLanguageId} from '@/lib/languages/newCourses';
import {playStarterSpeech,stopStarterSpeech} from '@/lib/starterSpeech';
import {toPersianDigits as fa} from '@/lib/format';
import {Typography} from '@/lib/theme';

function Topic({language,locale,section,number,title}:{language:NewLanguageId;locale:string;section:C1Section;number:number;title:string}) {
 const [open,setOpen]=useState(false),[error,setError]=useState('');
 const item=c1Deepening(section,number);
 const speak=(text:string,rate=.85)=>{setError('');void playStarterSpeech(locale,text,rate,()=>setError('پخش صدا در دسترس نیست.'),()=>setError('صدای منطقه‌ای تأیید نشد؛ تلفظ ممکن است متفاوت باشد.'));};
 return <View style={s.topic}><Text style={s.topicTitle}>{fa(number)}. {title}</Text>
  {item?<><Pressable accessibilityRole="button" accessibilityLabel={`درس مستقل ${title}`} accessibilityState={{expanded:open}} style={s.toggle} onPress={()=>{if(open)void stopStarterSpeech();setOpen(!open);}}><Text style={s.link}>{open?'بستن درس مستقل':'باز کردن درس مستقل'}</Text><Text style={s.link}>{open?'−':'+'}</Text></Pressable>
   {open&&<><StarterTopicDeepening key={`${language}-${item.id}`} item={item} language={language} onSpeak={speak}/>{!!error&&<Text accessibilityRole="alert" style={s.error}>{error}</Text>}</>}
  </>:<Text style={s.pending}>درس مستقل این سرفصل هنوز تدوین نشده است.</Text>}
 </View>;
}
const sampleTranslation:Record<NewLanguageId,string>={
 fr:'تا زمان جلسه، مسئولان مجوزها را بررسی کرده خواهند بود.',
 de:'تا زمان جلسه، تیم رضایت‌های باقی‌مانده را بررسی کرده خواهد بود.',
 es:'تا زمان جلسه، او مجوزها را بررسی کرده خواهد بود.',
};
export default function StarterC1Curriculum({language,locale}:{language:NewLanguageId;locale:string}){
 const [assessmentOpen,setAssessmentOpen]=useState(false),[assessmentError,setAssessmentError]=useState('');
 const speak=(text:string,rate=.85)=>{setAssessmentError('');void playStarterSpeech(locale,text,rate,()=>setAssessmentError('پخش صدا در دسترس نیست.'),()=>setAssessmentError('صدای منطقه‌ای تأیید نشد؛ تلفظ ممکن است متفاوت باشد.'));};
 useEffect(()=>()=>{void stopStarterSpeech();},[]);
 return <View style={s.root}><Text style={s.description}>در ۲۵ درس Foundation، بیان دقیق، ساختارهای پیشرفته، لحن و استدلال را تمرین می‌کنید. در ۳۰ درس Survival، این مهارت‌ها را در مذاکره، ارائه، تحلیل منابع و مکاتبات حرفه‌ای به کار می‌گیرید. هر درس با متن و تمرین شنیداری، واژگان و نمونه‌هایی برای گفتار و نوشتار همراه است.</Text>
 <View style={s.example}><Text style={s.exampleHeading}>نمونه‌ای از جمله‌های این سطح</Text><Text style={s.exampleTarget}>{c1Deepening('foundation',3)?.notes[language].second}</Text><Text style={s.description}>{sampleTranslation[language]}</Text></View>
 {getC1Curriculum(language).map(section=><View key={section.id} style={s.group}><Text style={s.heading}>{section.title}</Text>{section.topics.map(topic=><Topic key={`${language}-${section.id}-${topic.number}`} language={language} locale={locale} section={section.id} number={topic.number} title={topic.title}/>)}</View>)}
 <Pressable accessibilityRole="button" accessibilityLabel="باز کردن ارزیابی جامع C1" accessibilityState={{expanded:assessmentOpen}} style={s.toggle} onPress={()=>{if(assessmentOpen)void stopStarterSpeech();setAssessmentOpen(!assessmentOpen);}}><Text style={s.link}>{assessmentOpen?'بستن ارزیابی جامع':'باز کردن ارزیابی جامع'}</Text></Pressable>
 {assessmentOpen&&<><StarterC1Assessment key={language} language={language} onSpeak={speak}/>{!!assessmentError&&<Text accessibilityRole="alert" style={s.error}>{assessmentError}</Text>}</>}
 </View>;
}
const s=StyleSheet.create({root:{gap:16},group:{gap:10},heading:{fontFamily:Typography.boldFontFamily,fontSize:17,lineHeight:28,color:'#302880',textAlign:'right',writingDirection:'rtl'},example:{borderWidth:1,borderColor:'#E1E4F0',borderRadius:12,padding:12,gap:6,backgroundColor:'#FAFAFE'},exampleHeading:{fontFamily:Typography.boldFontFamily,fontSize:13,lineHeight:23,color:'#302880',textAlign:'right',writingDirection:'rtl'},exampleTarget:{fontSize:15,lineHeight:24,color:'#202039',textAlign:'left',writingDirection:'ltr'},description:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:24,color:'#475569',textAlign:'right',writingDirection:'rtl'},topic:{borderWidth:1,borderColor:'#E1E4F0',borderRadius:12,padding:12,gap:8,backgroundColor:'#fff'},topicTitle:{fontFamily:Typography.boldFontFamily,fontSize:14,lineHeight:25,color:'#202039',textAlign:'right',writingDirection:'rtl'},pending:{fontFamily:Typography.fontFamily,fontSize:12,lineHeight:22,color:'#64748B',textAlign:'right',writingDirection:'rtl'},toggle:{minHeight:44,flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center'},link:{fontFamily:Typography.boldFontFamily,fontSize:13,color:'#5148C8',textAlign:'right'},error:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:22,color:'#A32C36',textAlign:'right'}});
