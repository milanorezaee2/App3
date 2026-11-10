import { LocalizedText as Text } from '@/components/LocalizedText';
import {useState} from 'react';
import {Pressable,StyleSheet,View} from 'react-native';
import {Typography} from '@/lib/theme';
const metrics=['پیام و پاسخ به موقعیت را کامل رساندم','ایده‌ها را به هم وصل کردم و منظورم روشن بود','تلفظ من برای شنونده قابل فهم بود'] as const;
const choices=['نیاز به تمرین','تا حدی','برای این تمرین مناسب'] as const;
/** A learner reflection, not speech recognition or a level test. */
export default function StarterOralSelfReview({title='خودبازبینی گفتار'}:{title?:string}={}){
 const [open,setOpen]=useState(false),[ratings,setRatings]=useState<Record<number,number>>({});
 return <View style={s.root}><Pressable accessibilityRole="button" accessibilityState={{expanded:open}} onPress={()=>setOpen(v=>!v)} style={s.toggle}><Text style={s.heading}>{title}</Text><Text style={s.heading}>{open?'−':'+'}</Text></Pressable>{open&&<>{metrics.map((metric,i)=><View key={metric} style={s.item}><Text style={s.note}>{metric}</Text><View style={s.row}>{choices.map((choice,j)=><Pressable key={choice} accessibilityRole="radio" accessibilityLabel={`${metric}: ${choice}`} accessibilityState={{checked:ratings[i]===j}} onPress={()=>setRatings(r=>({...r,[i]:j}))} style={[s.choice,ratings[i]===j&&s.selected]}><Text style={s.label}>{choice}</Text></Pressable>)}</View></View>)}</>}</View>;
}
const s=StyleSheet.create({root:{width:'100%',borderWidth:1,borderColor:'#E1E4F0',borderRadius:10,padding:10,gap:8},toggle:{minHeight:44,flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center'},heading:{fontFamily:Typography.boldFontFamily,fontSize:13,color:'#5148C8',textAlign:'right'},note:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:22,color:'#475569',textAlign:'right',writingDirection:'rtl'},item:{gap:6},row:{flexDirection:'row-reverse',flexWrap:'wrap',gap:6},choice:{minHeight:44,borderWidth:1,borderColor:'#DFE1EC',borderRadius:9,paddingHorizontal:10,justifyContent:'center'},selected:{borderColor:'#5148C8',backgroundColor:'#F0EFFF'},label:{fontFamily:Typography.fontFamily,fontSize:12,color:'#302880',textAlign:'right'}});
