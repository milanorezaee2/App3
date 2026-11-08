import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { PageNavigation } from '@/components/PageNavigation';
import { StarterBottomNav } from '@/components/StarterBottomNav';
import type { StarterCourse } from '@/lib/languages/newCourses';
import { starterDisplayPronunciation } from '@/lib/languages/starterEditorial';
import { playStarterSpeech, stopStarterSpeech } from '@/lib/starterSpeech';
import { Typography } from '@/lib/theme';

const tips = {
  de:'در Hallo حرف h شنیده می‌شود و در Ich صدای ch را نرم ادا کنید. آوانویسی فارسی جای گوش‌دادن به صدا را نمی‌گیرد.',
  fr:'در Bonjour صدای آغازین مانند «ژ» است. در فرانسوی بعضی حروف پایانی نوشته می‌شوند اما شنیده نمی‌شوند.',
  es:'در اسپانیایی معیار اسپانیا، c پیش از i در gracias اغلب شبیه th انگلیسی در think شنیده می‌شود؛ s صدای س دارد.',
} as const;
export default function StarterPronunciation({course}: {course: StarterCourse}) {
  const [error,setError] = useState('');
  useEffect(() => () => { void stopStarterSpeech(); }, []);
  const play = (text: string, rate: number) => {setError(''); void playStarterSpeech(course.locale,text,rate,()=>setError('پخش صدا ممکن نشد؛ صدای این زبان را در تنظیمات دستگاه بررسی کنید.'),()=>setError('صدای منطقه‌ای تأیید نشد؛ لهجه ممکن است متفاوت باشد.'));};
  return <View style={s.root}><ScrollView contentContainerStyle={s.content}>
    <PageNavigation backFallback={course.home} />
    <Text style={s.title}>کارگاه تلفظ {course.name}</Text>
    <Text style={s.info}>به صدا گوش دهید و با صدای بلند تکرار کنید. صدای دستگاه به تنظیمات آن وابسته است؛ این تمرین صدای شما را ضبط یا ارزیابی نمی‌کند.</Text>
    <View style={s.card}><Text style={s.heading}>نکتهٔ شنیداری</Text><Text style={s.info}>{tips[course.id]}</Text></View>
    {course.lessons[0].sentences.slice(0,3).map(sentence => <View key={sentence.id} style={s.card}><Text style={s.foreign}>{sentence.text}</Text><Text style={s.info}>{sentence.fa} · {starterDisplayPronunciation(sentence)}</Text><View style={s.actions}>{([['آهسته',.5],['معمولی',1]] as const).map(([label,rate])=><Pressable key={label} accessibilityRole="button" accessibilityLabel={`پخش ${label} ${sentence.text}`} onPress={()=>play(sentence.text,rate)} style={s.button}><Volume2 size={17} color="#5148C8"/><Text style={s.buttonText}>{label}</Text></Pressable>)}</View></View>)}
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
  </ScrollView><StarterBottomNav course={course}/></View>;
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:'#F7F8FC'},content:{padding:18,gap:14,width:'100%',maxWidth:820,alignSelf:'center'},title:{fontFamily:'Beiruti-Bold',fontSize:27,lineHeight:39,color:'#191A31',textAlign:'right'},heading:{fontFamily:'Beiruti-Bold',fontSize:18,color:'#191A31',textAlign:'right'},info:{fontFamily:Typography.fontFamily,fontSize:15,lineHeight:26,color:'#4B5563',textAlign:'right',writingDirection:'rtl'},card:{backgroundColor:'#fff',borderWidth:1,borderColor:'#E1E4F0',borderRadius:20,padding:18,gap:8},foreign:{fontFamily:'Inter-SemiBold',fontSize:20,lineHeight:30,color:'#191A31',writingDirection:'ltr'},actions:{flexDirection:'row',gap:10,flexWrap:'wrap'},button:{minHeight:44,borderRadius:14,borderWidth:1,borderColor:'#5148C8',paddingHorizontal:20,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6},buttonText:{fontFamily:Typography.fontFamily,color:'#5148C8',fontSize:15},error:{fontFamily:Typography.fontFamily,color:'#A52639',textAlign:'right'}});
