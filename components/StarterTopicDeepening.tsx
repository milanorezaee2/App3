import {useState} from 'react';
import {Pressable,StyleSheet,Text,View} from 'react-native';
import type {TopicDeepening} from '@/lib/languages/topicDeepening';
import type {NewLanguageId} from '@/lib/languages/newCourses';
import {practiceDraftKey} from '@/lib/languages/localPracticeDraft';
import {Typography} from '@/lib/theme';
import StarterOralSelfReview from '@/components/StarterOralSelfReview';
import StarterPracticeDraft from '@/components/StarterPracticeDraft';
import {toPersianDigits as fa} from '@/lib/format';
import {c1FoundationTransfer} from '@/lib/languages/c1FoundationTransfer';
import {c1FoundationStudio} from '@/lib/languages/c1FoundationStudio';
import {getC1RhetoricPractice} from '@/lib/languages/c1RhetoricPractice';
import StarterC1RhetoricPractice from '@/components/StarterC1RhetoricPractice';
import {getC1SurvivalListening} from '@/lib/languages/c1SurvivalListening';
import StarterC1SurvivalListening from '@/components/StarterC1SurvivalListening';
import StarterC1FoundationStudio from '@/components/StarterC1FoundationStudio';

/** Independent topic material, deliberately not lesson progress or a CEFR test. */
export default function StarterTopicDeepening({item,language,onSpeak}:{item:TopicDeepening;language:NewLanguageId;onSpeak:(text:string,rate?:number)=>void}){
 const transfer=item.level==='c1'&&item.section==='foundation'?c1FoundationTransfer[item.number-1]:undefined;
 const studio=item.level==='c1'&&item.section==='foundation'?c1FoundationStudio[item.number-1]:undefined;
 const rhetoric=item.level==='c1'&&item.section==='foundation'?getC1RhetoricPractice(item.number):undefined;
 const survival=item.level==='c1'&&item.section==='survival'?getC1SurvivalListening(item.number):undefined;
 const [answers,setAnswers]=useState<Record<number,number>>({}),[showModel,setShowModel]=useState(false),[showText,setShowText]=useState(false);const notes=item.notes[language];
 return <View style={s.card}><Text style={s.title}>درس تکمیلی موضوعی · {item.title}</Text>
 <Text style={s.body}>ابتدا پیام ساختگی را با صدای دستگاه بشنوید و به سؤال‌ها پاسخ دهید؛ سپس متن را ببینید. این صدا ضبط انسانی نیست.</Text>
 <Pressable accessibilityRole="button" accessibilityLabel={`شنیدن متن موضوعی ${item.title}`} style={s.action} onPress={()=>onSpeak(item.passage[language],.85)}><Text style={s.link}>شنیدن متن موضوعی</Text></Pressable>
 <Pressable accessibilityRole="button" accessibilityState={{expanded:showText}} style={s.action} onPress={()=>setShowText(v=>!v)}><Text style={s.link}>{showText?'پنهان کردن متن موضوعی':'نمایش متن موضوعی'}</Text></Pressable>{showText&&<Text style={s.target}>{item.passage[language]}</Text>}
 {item.questions.map((question,i)=><View style={s.question} key={i}><Text style={s.prompt}>{fa(i+1)}. {question.prompt}</Text>{question.choices.map((choice,j)=><Pressable key={j} accessibilityRole="radio" accessibilityLabel={`${question.prompt} ${choice}`} accessibilityState={{checked:answers[i]===j}} style={[s.choice,answers[i]===j&&s.selected]} onPress={()=>setAnswers(prev=>({...prev,[i]:j}))}><Text style={s.body}>{choice}</Text></Pressable>)}{answers[i]!==undefined&&<Text accessibilityLiveRegion="polite" style={answers[i]===question.correctIndex?s.good:s.error}>{answers[i]===question.correctIndex?`درست است. ${question.explanation} شاهد: ${question.evidence[language]}`:'این پاسخ مناسب نیست؛ دوباره امتحان کنید.'}</Text>}</View>)}
 <Text style={s.heading}>عبارت و نکتهٔ زبان</Text>{notes.phrases.map(phrase=><View key={phrase.text} style={s.example}><Text style={s.target}>{phrase.text}</Text><Text style={s.body}>{phrase.meaning}</Text><Pressable accessibilityRole="button" accessibilityLabel={`شنیدن عبارت موضوعی ${phrase.text}`} style={s.action} onPress={()=>onSpeak(phrase.text)}><Text style={s.link}>شنیدن عبارت</Text></Pressable></View>)}
 <Text style={s.body}>{notes.explanation}</Text><Text style={s.target}>{notes.first}</Text><Text style={s.target}>{notes.second}</Text><Text style={s.body}>{notes.difference}</Text>
 <Text style={s.heading}>گفتار در موقعیت تازه</Text><Text style={s.body}>{item.speaking}</Text><Text style={s.body}>پاسخ را به زبان دوره بگویید؛ برنامه صدا را ضبط یا ارزیابی نمی‌کند.</Text><StarterOralSelfReview title="ارزیابی شخصی درس موضوعی"/>
 <Text style={s.heading}>نوشتار مرحله‌ای</Text><Text style={s.body}>{item.writing}</Text>{item.steps.map((step,i)=><Text key={i} style={s.body}>{fa(i+1)}. {step}</Text>)}<StarterPracticeDraft label={`نوشتار درس موضوعی ${item.title}`} storageKey={practiceDraftKey(language,item.level,'workshop',`deep-${item.id}`)}/>
 <Pressable accessibilityRole="button" accessibilityState={{expanded:showModel}} style={s.action} onPress={()=>setShowModel(v=>!v)}><Text style={s.link}>{showModel?'پنهان کردن نمونهٔ پاسخ موضوعی':'نمایش نمونهٔ پاسخ موضوعی'}</Text></Pressable>{showModel&&<><Text style={s.body}>یک پاسخ ممکن؛ پاسخ شما خودکار تصحیح نمی‌شود.</Text><Text style={s.target}>{item.model[language]}</Text></>}
 {survival&&<StarterC1SurvivalListening item={survival} language={language} lessonId={item.id} onSpeak={onSpeak}/>}
 {studio&&<StarterC1FoundationStudio item={studio} language={language} lessonId={item.id} onSpeak={onSpeak}/>}
 {rhetoric&&<StarterC1RhetoricPractice item={rhetoric} language={language} lessonId={item.id} onSpeak={onSpeak}/>}
 {transfer&&<><Text style={s.heading}>انتقال به موقعیت تازه و خودبازبینی</Text><Text style={s.body}>{transfer.scenario} پاسخ را به زبان دوره بگویید یا بنویسید.</Text>{transfer.checks.map((check,i)=><Text key={i} style={s.body}>□ {check}</Text>)}<Text style={s.body}>این موارد راهنمای بازبینی شخصی‌اند و به‌صورت خودکار ارزیابی نمی‌شوند.</Text></>}
 <Text style={s.note}>این درس تمرین تکمیلی است، نه آزمون رسمی یا تأیید تسلط؛ بازخورد مدرس و بازبینی تخصصی زبانی را جایگزین نمی‌کند.</Text></View>;
}
const s=StyleSheet.create({card:{borderWidth:1,borderColor:'#C9C6EF',borderRadius:12,padding:12,backgroundColor:'#FAFAFE',gap:10},title:{fontFamily:Typography.boldFontFamily,fontSize:15,lineHeight:25,color:'#302880',textAlign:'right',writingDirection:'rtl'},heading:{fontFamily:Typography.boldFontFamily,fontSize:14,lineHeight:24,color:'#5148C8',textAlign:'right',writingDirection:'rtl'},body:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:23,color:'#292A3D',textAlign:'right',writingDirection:'rtl'},prompt:{fontFamily:Typography.boldFontFamily,fontSize:14,lineHeight:24,color:'#202039',textAlign:'right',writingDirection:'rtl'},target:{fontSize:15,lineHeight:25,color:'#202039',textAlign:'left',writingDirection:'ltr'},question:{gap:6},example:{gap:4},choice:{minHeight:44,borderWidth:1,borderColor:'#DFE1EC',borderRadius:10,padding:10,justifyContent:'center',backgroundColor:'#fff'},selected:{backgroundColor:'#F0EFFF',borderColor:'#5148C8'},good:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:23,color:'#176B55',textAlign:'right',writingDirection:'rtl'},error:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:23,color:'#A32C36',textAlign:'right',writingDirection:'rtl'},action:{minHeight:44,alignItems:'flex-end',justifyContent:'center'},link:{fontFamily:Typography.boldFontFamily,fontSize:13,color:'#5148C8',textAlign:'right'},note:{fontFamily:Typography.fontFamily,fontSize:12,lineHeight:21,color:'#475569',textAlign:'right',writingDirection:'rtl'}});
