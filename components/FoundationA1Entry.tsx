import { Pressable, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import type { FoundationLanguage } from '@/lib/languages/foundationA1';
import { Typography } from '@/lib/theme';

/** Additive route; it does not alter the legacy course or its progress. */
export default function FoundationA1Entry({language}: {language:FoundationLanguage}) {
  const router = useRouter();
  return <Pressable accessibilityRole="button" accessibilityLabel="نقشهٔ جدید Foundation A1" style={s.card} onPress={()=>router.push({pathname:'/foundation/[language]',params:{language}} as never)}>
    <Text style={s.title}>Foundation A1 · مسیر جمله‌محور</Text>
    <Text style={s.description}>آغاز تدوین ۱۲ سرفصل هماهنگ؛ محتوای قبلی و پیشرفت آن محفوظ است.</Text>
    <Text style={s.action}>دیدن سرفصل‌ها ←</Text>
  </Pressable>;
}
const s=StyleSheet.create({
  card:{padding:16,borderRadius:18,borderWidth:1,borderColor:'#DDD9F6',backgroundColor:'#FFF',gap:7},
  title:{fontFamily:Typography.boldFontFamily,fontSize:15,lineHeight:24,color:'#302880',textAlign:'right',writingDirection:'rtl'},
  description:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:22,color:'#475569',textAlign:'right',writingDirection:'rtl'},
  action:{fontFamily:Typography.boldFontFamily,fontSize:13,color:'#5148C8',textAlign:'right',writingDirection:'rtl'},
});
