import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { PageNavigation } from '@/components/PageNavigation';
import LanguageSentenceBuilder from '@/components/LanguageSentenceBuilder';
import StarterWritingPractice from '@/components/StarterWritingPractice';
import { FOUNDATION_LANGUAGES, FOUNDATION_TOPICS, getFoundationGreetings, isFoundationLanguage } from '@/lib/languages/foundationA1';
import { isNewLanguage } from '@/lib/languages/newCourses';
import { isLanguageEnabled } from '@/lib/features';
import { playStarterSpeech, stopStarterSpeech } from '@/lib/starterSpeech';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';

export default function FoundationA1Route() {
  const {language} = useLocalSearchParams<{language:string}>();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState('');
  useEffect(()=>()=>{void stopStarterSpeech();},[]);
  if (!isFoundationLanguage(language) || !isLanguageEnabled(language)) return <Redirect href={'/languages' as never}/>;
  if (isNewLanguage(language)) return <Redirect href={`/learn/${language}/library?level=1` as never}/>;
  const course = FOUNDATION_LANGUAGES[language];
  const sentences = getFoundationGreetings(language);
  const current = sentences[index];
  const canBuild = current.text.trim().split(/\s+/).length >= 2;
  const speak = (rate:number) => {
    setError('');
    void playStarterSpeech(course.locale,current.text,rate,()=>setError('صدا پخش نشد؛ بستهٔ گفتاری این زبان را در تنظیمات دستگاه بررسی کنید.'),()=>setError('صدای منطقه‌ای تأیید نشد؛ لهجه به تنظیمات دستگاه بستگی دارد.'));
  };
  return <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled">
    <PageNavigation backFallback={language === 'en' ? '/lang' : `/learn/${language}`} />
    <Text style={s.eyebrow}>A1 · FOUNDATION</Text>
    <Text style={s.title}>مسیر جمله‌محور {course.name}</Text>
    <Text style={s.body}>نقشهٔ ۱۲ سرفصل مشترک است، اما تمرین‌های هر زبان از محتوای همان زبان می‌آیند. این مسیر در حال تدوین است؛ پیشرفت دوره‌های قبلی تغییر نمی‌کند.</Text>
    {!open ? <View style={s.list}>
      {FOUNDATION_TOPICS.map((topic,i)=><View key={topic.id} style={s.topic}>
        <View style={s.topicHeader}><Text style={s.topicNumber}>{fa(i+1)}</Text><View style={s.topicText}><Text style={s.topicTitle}>{topic.title}</Text><Text style={s.topicEnglish}>{topic.english}</Text></View><Text style={s.badge}>{i===0?'نمونهٔ آغازین':'در حال تدوین'}</Text></View>
        <Text style={s.hint}>هدف: {topic.goals}</Text>
        {i===0 && <><Text style={s.hint}>۲۵ نمونهٔ انتخاب‌شده از محتوای موجود؛ این نسخه هنوز درس کامل و سنجش چندمهارتی نیست.</Text><Pressable accessibilityRole="button" style={s.primary} onPress={()=>setOpen(true)}><Text style={s.primaryText}>مشاهدهٔ نمونه‌ها</Text></Pressable></>}
      </View>)}
    </View> : <>
      <Pressable accessibilityRole="button" style={s.secondary} onPress={()=>{setOpen(false);void stopStarterSpeech();}}><Text style={s.secondaryText}>بازگشت به سرفصل‌ها</Text></Pressable>
      <Text style={s.section}>سلام و احوال‌پرسی</Text>
      <Text style={s.body}>نمونه‌های این بخش از درس‌های موجود همین زبان انتخاب شده‌اند. سرفصل کامل و تمرین‌های مستقل آن هنوز در حال تهیه است.</Text>
      <View style={s.card}>
        <Text style={s.count}>{index < 15 ? 'نمونهٔ اصلی' : 'نمونهٔ تکمیلی'} · {fa(index+1)} از {fa(sentences.length)}</Text>
        <Text style={s.target}>{current.text}</Text><Text style={s.pronunciation}>{current.pronunciation}</Text><Text style={s.translation}>{current.fa}</Text>
        <View style={s.actions}><Pressable accessibilityRole="button" style={s.secondary} onPress={()=>speak(.5)}><Text style={s.secondaryText}>پخش آهسته</Text></Pressable><Pressable accessibilityRole="button" style={s.secondary} onPress={()=>speak(1)}><Text style={s.secondaryText}>پخش معمولی</Text></Pressable></View>
        {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
        <Text style={s.note}>صدا با موتور گفتار دستگاه ساخته می‌شود، نه فایل گویندهٔ ضبط‌شده. پس از شنیدن، جمله را تکرار کنید؛ صدای شما ارزیابی نمی‌شود.</Text>
        <View style={s.actions}><Pressable accessibilityRole="button" disabled={index===0} accessibilityState={{disabled:index===0}} style={[s.secondary,index===0&&s.disabled]} onPress={()=>{setIndex(index-1);setError('');void stopStarterSpeech();}}><Text style={s.secondaryText}>نمونهٔ قبلی</Text></Pressable><Pressable accessibilityRole="button" disabled={index===sentences.length-1} accessibilityState={{disabled:index===sentences.length-1}} style={[s.secondary,index===sentences.length-1&&s.disabled]} onPress={()=>{setIndex(index+1);setError('');void stopStarterSpeech();}}><Text style={s.secondaryText}>نمونهٔ بعدی</Text></Pressable></View>
      </View>
      <View style={s.card}><Text style={s.section}>تمرین با همین نمونه</Text><Text style={s.body}>کلمه‌ها را مرتب کنید یا نمونه را با تکیه بر ترجمه بنویسید. تمرین‌ها اختیاری‌اند و نتیجه ذخیره نمی‌شود.</Text>
        {canBuild ? <LanguageSentenceBuilder key={current.id} sentence={current} placeholder="واژه‌ها را به ترتیب انتخاب کنید" /> : <Text style={s.note}>برای مرتب‌سازی، یک نمونهٔ چندکلمه‌ای انتخاب کنید.</Text>}
        <StarterWritingPractice key={current.id} sentence={current} />
      </View>
    </>}
  </ScrollView>;
}
const s=StyleSheet.create({
  page:{flexGrow:1,padding:18,paddingBottom:48,gap:13,backgroundColor:'#F8F9FD'},
  eyebrow:{fontFamily:Typography.latinFontFamily,fontSize:11,color:'#5C50C5',textAlign:'right'},
  title:{fontFamily:Typography.boldFontFamily,fontSize:23,lineHeight:36,color:'#18243A',textAlign:'right',writingDirection:'rtl'},
  section:{fontFamily:Typography.boldFontFamily,fontSize:18,lineHeight:28,color:'#242453',textAlign:'right',writingDirection:'rtl'},
  body:{fontFamily:Typography.fontFamily,fontSize:14,lineHeight:24,color:'#475569',textAlign:'right',writingDirection:'rtl'},
  list:{gap:10},topic:{padding:14,borderWidth:1,borderColor:'#E5E8F2',backgroundColor:'#FFF',borderRadius:16,gap:8},
  topicHeader:{flexDirection:'row-reverse',alignItems:'center',gap:9},topicText:{flex:1},
  topicNumber:{fontFamily:Typography.boldFontFamily,fontSize:15,color:'#5148C8'},topicTitle:{fontFamily:Typography.boldFontFamily,fontSize:15,lineHeight:23,color:'#202039',textAlign:'right'},
  topicEnglish:{fontFamily:Typography.latinFontFamily,fontSize:11,color:'#64748B',textAlign:'right'},badge:{fontFamily:Typography.fontFamily,fontSize:11,color:'#6159A3'},
  hint:{fontFamily:Typography.fontFamily,fontSize:12,lineHeight:20,color:'#64748B',textAlign:'right',writingDirection:'rtl'},
  card:{padding:16,borderWidth:1,borderColor:'#E5E8F2',backgroundColor:'#FFF',borderRadius:18,gap:12},
  count:{fontFamily:Typography.fontFamily,fontSize:12,color:'#5148C8',textAlign:'right'},
  target:{fontFamily:Typography.latinFontFamily,fontSize:20,lineHeight:31,color:'#202039',textAlign:'left',writingDirection:'ltr'},
  pronunciation:{fontFamily:Typography.fontFamily,fontSize:14,lineHeight:22,color:'#5B55A4',textAlign:'right',writingDirection:'rtl'},
  translation:{fontFamily:Typography.boldFontFamily,fontSize:16,lineHeight:26,color:'#202039',textAlign:'right',writingDirection:'rtl'},
  actions:{flexDirection:'row',flexWrap:'wrap',gap:9},primary:{minHeight:44,borderRadius:12,backgroundColor:'#5148C8',alignItems:'center',justifyContent:'center',paddingHorizontal:15},primaryText:{fontFamily:Typography.boldFontFamily,color:'#FFF',fontSize:14},
  secondary:{minHeight:44,borderRadius:12,backgroundColor:'#F0EFFF',alignItems:'center',justifyContent:'center',paddingHorizontal:14},secondaryText:{fontFamily:Typography.boldFontFamily,color:'#5148C8',fontSize:13},
  note:{fontFamily:Typography.fontFamily,fontSize:12,lineHeight:20,color:'#64748B',textAlign:'right',writingDirection:'rtl'},error:{fontFamily:Typography.fontFamily,color:'#A32335',fontSize:13,lineHeight:22,textAlign:'right'},disabled:{opacity:.4},
});
