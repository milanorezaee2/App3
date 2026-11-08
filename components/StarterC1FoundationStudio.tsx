import {useState} from 'react';
import {Pressable,StyleSheet,Text,View} from 'react-native';
import type {C1FoundationStudio} from '@/lib/languages/c1FoundationStudio';
import type {NewLanguageId} from '@/lib/languages/newCourses';
import {c1FoundationDiagnostics} from '@/lib/languages/c1FoundationDiagnostics';
import {c1FoundationRoleReview} from '@/lib/languages/c1FoundationRoleReview';
import {c1FoundationRoleModels} from '@/lib/languages/c1FoundationRoleModels';
import {practiceDraftKey} from '@/lib/languages/localPracticeDraft';
import StarterPracticeDraft from '@/components/StarterPracticeDraft';
import {Typography} from '@/lib/theme';

type Props={item:C1FoundationStudio;language:NewLanguageId;lessonId:string;onSpeak:(text:string,rate?:number)=>void};
/** Supplemental practice; no speech recording, grading of open responses, or completion credit. */
export default function StarterC1FoundationStudio({item,language,lessonId,onSpeak}:Props){
 const [showTranscript,setShowTranscript]=useState(false),[listeningAnswer,setListeningAnswer]=useState<number|null>(null),[formAnswer,setFormAnswer]=useState<'right'|'wrong'|null>(null),[diagnosticAnswer,setDiagnosticAnswer]=useState<number|null>(null),[showExample,setShowExample]=useState(false),[showRoleModel,setShowRoleModel]=useState(false);
 // Rotate correct choices by topic rather than teaching a fixed answer position.
 const answerPosition=(item.number-1)%3;
 const options=[...item.listening.choices.slice(1)]; options.splice(answerPosition,0,item.listening.choices[0]);
 const forms:(('right'|'wrong'))[]=item.number%2?['wrong','right']:['right','wrong'];
 const label=`پاسخ موقعیتی C1 ${item.number}`;
 const diagnostic=c1FoundationDiagnostics[item.number-1];
 const diagnosticPosition=(item.number+1)%3;
 const diagnosticChoices=[...diagnostic.choices.slice(1)];diagnosticChoices.splice(diagnosticPosition,0,diagnostic.choices[0]);
 return <View style={s.root}>
  <Text style={s.heading}>شنیداری مستقل</Text>
  <Text style={s.body}>این متن جدا از متن خواندنی درس است. ابتدا به صدای دستگاه گوش کنید، سپس پاسخ دهید. صدا ضبط انسانی نیست.</Text>
  <Pressable accessibilityRole="button" accessibilityLabel={`شنیدن شنیداری مستقل ${item.number}`} style={s.action} onPress={()=>onSpeak(item.audio[language],.85)}><Text style={s.link}>پخش شنیداری مستقل</Text></Pressable>
  <Pressable accessibilityRole="button" accessibilityState={{expanded:showTranscript}} style={s.action} onPress={()=>setShowTranscript(v=>!v)}><Text style={s.link}>{showTranscript?'پنهان کردن متن شنیداری':'نمایش متن شنیداری'}</Text></Pressable>
  {showTranscript&&<Text style={s.target}>{item.audio[language]}</Text>}
  <Text style={s.prompt}>{item.listening.prompt}</Text>
  {options.map((option,i)=><Pressable key={i} accessibilityRole="radio" accessibilityLabel={`شنیداری مستقل ${item.listening.prompt} ${option}`} accessibilityState={{checked:listeningAnswer===i}} style={[s.choice,listeningAnswer===i&&s.selected]} onPress={()=>setListeningAnswer(i)}><Text style={s.body}>{option}</Text></Pressable>)}
  {listeningAnswer!==null&&<Text accessibilityLiveRegion="polite" style={listeningAnswer===answerPosition?s.good:s.error}>{listeningAnswer===answerPosition?`درست است. ${item.listening.explanation} شاهد: ${item.evidence[language]}`:'این پاسخ مناسب نیست؛ دوباره به متن گوش کنید.'}</Text>}
  <Text style={s.heading}>گفت‌وگوی موقعیتی و ایفای نقش</Text>
  <Text style={s.body}>این گفت‌وگو یک نمونهٔ ساختگی است؛ نقش خود را با زبان دوره پاسخ دهید.</Text>
  <Text style={s.target}>{item.dialogue[language]}</Text>
  <Pressable accessibilityRole="button" accessibilityLabel={`شنیدن گفت‌وگوی موقعیتی ${item.number}`} style={s.action} onPress={()=>onSpeak(item.dialogue[language],.85)}><Text style={s.link}>شنیدن گفت‌وگو با صدای دستگاه</Text></Pressable>
  <Text style={s.body}>{item.roleTask}</Text>
  <Text style={s.body}>گفتار ضبط یا ارزیابی نمی‌شود. در صورت تمایل پاسخ خود را اینجا بنویسید؛ فقط با دکمهٔ ذخیره روی همین دستگاه نگهداری می‌شود.</Text>
  <Text style={s.body}>برای بازبینی شخصی گفتار یا پاسخ نوشته‌شده:</Text>
  {c1FoundationRoleReview[item.number-1].map((check,i)=><Text key={i} style={s.body}>□ {check}</Text>)}
  <StarterPracticeDraft label={label} storageKey={practiceDraftKey(language,'c1','workshop',`studio-${lessonId}`)}/>
  <Pressable accessibilityRole="button" accessibilityState={{expanded:showRoleModel}} style={s.action} onPress={()=>setShowRoleModel(v=>!v)}><Text style={s.link}>{showRoleModel?'پنهان کردن نمونهٔ ایفای نقش':'نمایش نمونهٔ ایفای نقش'}</Text></Pressable>
  {showRoleModel&&<><Text style={s.body}>یک پاسخ ممکن است؛ پاسخ‌های متناسب دیگر نیز می‌توانند درست باشند.</Text><Text style={s.target}>{c1FoundationRoleModels[item.number-1][language]}</Text></>}
  <Text style={s.heading}>انتخاب ساختار و تشخیص خطا در بافت</Text>
  <Text style={s.prompt}>{item.form.prompt}</Text>
  {forms.map(key=><Pressable key={key} accessibilityRole="radio" accessibilityLabel={`ساختار C1 ${item.number} ${item.form[key][language]}`} accessibilityState={{checked:formAnswer===key}} style={[s.choice,formAnswer===key&&s.selected]} onPress={()=>setFormAnswer(key)}><Text style={s.target}>{item.form[key][language]}</Text></Pressable>)}
  {formAnswer!==null&&<Text accessibilityLiveRegion="polite" style={formAnswer==='right'?s.good:s.error}>{formAnswer==='right'?`درست است. ${item.form.explanation}`:`این گزینه در این بافت مناسب نیست. ${item.form.explanation} دوباره انتخاب کنید.`}</Text>}
  <Text style={s.heading}>تشخیص خطا و دلیل آن</Text>
  <Text style={s.prompt}>{diagnostic.prompt}</Text>
  {diagnosticChoices.map((choice,i)=><Pressable key={i} accessibilityRole="radio" accessibilityLabel={`تشخیص خطا C1 ${item.number} ${choice}`} accessibilityState={{checked:diagnosticAnswer===i}} style={[s.choice,diagnosticAnswer===i&&s.selected]} onPress={()=>setDiagnosticAnswer(i)}><Text style={s.body}>{choice}</Text></Pressable>)}
  {diagnosticAnswer!==null&&<Text accessibilityLiveRegion="polite" style={diagnosticAnswer===diagnosticPosition?s.good:s.error}>{diagnosticAnswer===diagnosticPosition?`درست است. ${diagnostic.explanation}`:'این گزینه خطای مورد نظر نیست؛ دوباره تلاش کنید.'}</Text>}
  <Pressable accessibilityRole="button" accessibilityState={{expanded:showExample}} style={s.action} onPress={()=>setShowExample(v=>!v)}><Text style={s.link}>{showExample?'پنهان کردن نمونهٔ بازنویسی':'نمایش نمونهٔ بازنویسی'}</Text></Pressable>
  {showExample&&<><Text style={s.body}>یک نمونهٔ مناسب برای همین بافت؛ پاسخ آزاد شما به‌صورت خودکار تصحیح نمی‌شود.</Text><Text style={s.target}>{item.form.right[language]}</Text></>}
 </View>;
}
const s=StyleSheet.create({root:{borderTopWidth:1,borderTopColor:'#DADCF0',paddingTop:12,gap:9},heading:{fontFamily:Typography.boldFontFamily,fontSize:14,lineHeight:24,color:'#5148C8',textAlign:'right',writingDirection:'rtl'},body:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:23,color:'#292A3D',textAlign:'right',writingDirection:'rtl'},prompt:{fontFamily:Typography.boldFontFamily,fontSize:14,lineHeight:24,color:'#202039',textAlign:'right',writingDirection:'rtl'},target:{fontSize:15,lineHeight:25,color:'#202039',textAlign:'left',writingDirection:'ltr'},choice:{minHeight:44,borderWidth:1,borderColor:'#DFE1EC',borderRadius:10,padding:10,justifyContent:'center',backgroundColor:'#fff'},selected:{backgroundColor:'#F0EFFF',borderColor:'#5148C8'},good:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:23,color:'#176B55',textAlign:'right',writingDirection:'rtl'},error:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:23,color:'#A32C36',textAlign:'right',writingDirection:'rtl'},action:{minHeight:44,alignItems:'flex-end',justifyContent:'center'},link:{fontFamily:Typography.boldFontFamily,fontSize:13,color:'#5148C8',textAlign:'right'}});
