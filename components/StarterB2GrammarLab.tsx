import { LocalizedText as Text } from '@/components/LocalizedText';
import {useEffect,useState} from 'react';
import {Pressable,StyleSheet,View} from 'react-native';
import {b2GrammarLab,type B2GrammarCard} from '@/lib/languages/b2GrammarLab';
import type {NewLanguageId} from '@/lib/languages/newCourses';
import {playStarterSpeech,stopStarterSpeech} from '@/lib/starterSpeech';
import {Typography} from '@/lib/theme';

type Request={id:string;serial:number};
function Card({card,locale}:{card:B2GrammarCard;locale:string}){
 const [answer,setAnswer]=useState<number|null>(null),[error,setError]=useState('');
 const speak=(text:string)=>{setError('');void playStarterSpeech(locale,text,0.85,()=>setError('پخش صدا در دسترس نیست؛ تنظیمات دستگاه را بررسی کنید.'),()=>setError('صدای منطقه‌ای تأیید نشد؛ تلفظ ممکن است متفاوت باشد.'));};
 return <View style={s.detail}><Text style={s.heading}>{card.title}</Text><Text style={s.body}>{card.explanation}</Text><Text style={s.target}>{card.example}</Text><Text style={s.body}>{card.translation}</Text>
  <Pressable accessibilityRole="button" accessibilityLabel={`شنیدن مثال ${card.title}`} onPress={()=>speak(card.example)} style={s.action}><Text style={s.actionText}>شنیدن مثال</Text></Pressable>{!!error&&<Text accessibilityRole="alert" style={s.error}>{error}</Text>}
  <Text style={s.prompt}>{card.prompt}</Text>{card.choices.map((choice,i)=><Pressable key={choice} accessibilityRole="radio" accessibilityState={{checked:answer===i}} onPress={()=>setAnswer(i)} style={[s.choice,answer===i&&s.selected]}><Text style={s.target}>{choice}</Text></Pressable>)}
  {answer!==null&&<Text accessibilityLiveRegion="polite" style={answer===card.correctIndex?s.feedback:s.error}>{answer===card.correctIndex?`درست است. ${card.feedback}`:'این گزینه در موقعیت خواسته‌شده مناسب نیست؛ دوباره تلاش کنید.'}</Text>}
 </View>;
}
export default function StarterB2GrammarLab({language,locale,request}:{language:NewLanguageId;locale:string;request:Request|null}){
 const [open,setOpen]=useState(false),[active,setActive]=useState<string|null>(null);const cards=b2GrammarLab(language);
 useEffect(()=>{if(request&&cards.some(card=>card.id===request.id)){setOpen(true);setActive(request.id);void stopStarterSpeech();}},[request,language]);
 useEffect(()=>()=>{void stopStarterSpeech();},[language]);
 const card=cards.find(item=>item.id===active);
 return <View style={s.card}><Pressable accessibilityRole="button" accessibilityState={{expanded:open}} onPress={()=>{if(open)void stopStarterSpeech();setOpen(v=>!v);}} style={s.toggle}><Text style={s.title}>آزمایشگاه دستور B2</Text><Text style={s.symbol}>{open?'−':'+'}</Text></Pressable>
 {open&&<View style={s.content}><Text style={s.body}>پانزده نکتهٔ زبان‌ویژه با مثال، توضیح و انتخاب کاربرد مناسب. پاسخ‌ها اختیاری‌اند و با بستن یا تغییر نکته ذخیره نمی‌شوند؛ پخش صدا به دستگاه وابسته است.</Text><View style={s.list}>{cards.map(item=><Pressable key={item.id} accessibilityRole="button" accessibilityState={{selected:active===item.id}} accessibilityLabel={`انتخاب نکتهٔ دستور ${item.title}`} onPress={()=>{void stopStarterSpeech();setActive(item.id);}} style={[s.tab,active===item.id&&s.selected]}><Text style={s.tabText}>{item.title}</Text></Pressable>)}</View>{card&&<Card key={`${language}-${card.id}`} card={card} locale={locale}/>}</View>}</View>;
}
const s=StyleSheet.create({card:{width:'100%',borderRadius:18,borderWidth:1,borderColor:'#DDD9F6',backgroundColor:'#FFF',padding:16,gap:12},toggle:{minHeight:44,flexDirection:'row-reverse',alignItems:'center',justifyContent:'space-between',gap:8},title:{flex:1,fontFamily:Typography.boldFontFamily,fontSize:16,lineHeight:26,color:'#302880',textAlign:'right'},symbol:{fontSize:22,color:'#5148C8'},content:{gap:12},list:{flexDirection:'row-reverse',flexWrap:'wrap',gap:8},tab:{minHeight:44,maxWidth:'100%',borderWidth:1,borderColor:'#DDD9F6',backgroundColor:'#FAFAFE',borderRadius:10,paddingHorizontal:10,paddingVertical:8,justifyContent:'center'},tabText:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:21,color:'#302880',textAlign:'right'},detail:{borderWidth:1,borderColor:'#E1E4F0',borderRadius:14,padding:12,gap:10,backgroundColor:'#FAFAFE'},heading:{fontFamily:Typography.boldFontFamily,fontSize:15,lineHeight:24,color:'#5148C8',textAlign:'right'},body:{fontFamily:Typography.fontFamily,fontSize:14,lineHeight:23,color:'#292A3D',textAlign:'right',writingDirection:'rtl'},target:{fontSize:15,lineHeight:25,color:'#202039',textAlign:'left',writingDirection:'ltr'},prompt:{fontFamily:Typography.boldFontFamily,fontSize:14,lineHeight:24,color:'#202039',textAlign:'right',writingDirection:'rtl'},choice:{minHeight:44,borderRadius:10,borderWidth:1,borderColor:'#DFE1EC',padding:10,justifyContent:'center',backgroundColor:'#FFF'},selected:{backgroundColor:'#F0EFFF',borderColor:'#5148C8'},feedback:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:22,color:'#176B55',textAlign:'right',writingDirection:'rtl'},error:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:22,color:'#AC3030',textAlign:'right',writingDirection:'rtl'},action:{minHeight:44,justifyContent:'center',alignItems:'flex-end'},actionText:{fontFamily:Typography.boldFontFamily,fontSize:13,lineHeight:22,color:'#5148C8',textAlign:'right'}});
