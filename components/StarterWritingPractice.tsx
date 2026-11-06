import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { LearningSentence } from '@/lib/languages/types';
import { Typography } from '@/lib/theme';

// This exercise compares against one lesson example, not all valid translations.
export function normalizeStarterWriting(value: string) {
  return value.normalize('NFC').toLocaleLowerCase().replace(/[’‘`]/g, "'")
    .replace(/[¿¡.,!?;:]/g, '').replace(/\s+/g, ' ').trim();
}

export default function StarterWritingPractice({ sentence }: { sentence: LearningSentence }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);
  const correct = normalizeStarterWriting(value) === normalizeStarterWriting(sentence.text);
  return <View style={s.card}>
    <Pressable accessibilityRole="button" accessibilityState={{expanded:open}} onPress={() => setOpen(v => !v)} style={s.toggle}><Text style={s.title}>{open ? 'بستن تمرین نوشتن' : 'تمرین نوشتن اختیاری'}</Text><Text style={s.icon}>{open ? '−' : '+'}</Text></Pressable>
    {open && <>
      <Text style={s.text}>نمونهٔ همین درس را بر اساس معنی بنویسید. حروف دارای نشانه را رعایت کنید؛ بزرگی حروف و نشانه‌گذاری بررسی نمی‌شود. پاسخ‌های متفاوت ممکن است درست باشند، اما اینجا فقط با نمونهٔ درس مقایسه می‌شوند.</Text>
      <Text style={s.question}>{sentence.fa}</Text>
      <TextInput accessibilityLabel="نوشتن نمونهٔ این درس" value={value} onChangeText={next => {setValue(next); setChecked(false);}} placeholder="…" autoCapitalize="none" autoCorrect={false} multiline style={s.input} />
      <Pressable accessibilityRole="button" accessibilityState={{disabled:!value.trim()}} disabled={!value.trim()} onPress={() => setChecked(true)} style={[s.button, !value.trim() && s.disabled]}><Text style={s.buttonText}>مقایسه با نمونه</Text></Pressable>
      {checked && <Text accessibilityLiveRegion="polite" style={s.feedback}>{correct ? 'نوشته با نمونهٔ درس مطابقت دارد.' : 'نوشته با نمونهٔ ثبت‌شده یکسان نیست؛ دوباره بررسی کنید.'}</Text>}
      <Text style={s.note}>اختیاری است؛ پاسخ ذخیره نمی‌شود و در پایان درس اثری ندارد.</Text>
    </>}
  </View>;
}
const s=StyleSheet.create({
  card:{width:'100%',marginTop:16,padding:16,borderWidth:1,borderColor:'#E1E4F0',backgroundColor:'#fff',borderRadius:18,gap:10},
  toggle:{minHeight:44,flexDirection:'row-reverse',alignItems:'center',justifyContent:'space-between',gap:8},
  title:{fontFamily:Typography.boldFontFamily,fontSize:16,color:'#302880',textAlign:'right',flex:1},
  icon:{fontFamily:Typography.boldFontFamily,fontSize:22,color:'#5148C8'},
  text:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:22,color:'#52566A',textAlign:'right',writingDirection:'rtl'},
  question:{fontFamily:Typography.fontFamily,fontSize:16,lineHeight:24,color:'#202039',textAlign:'right',writingDirection:'rtl'},
  input:{minHeight:55,borderWidth:1,borderColor:'#DCE0EE',borderRadius:12,padding:12,fontSize:16,color:'#202039',textAlign:'left',writingDirection:'ltr'},
  button:{minHeight:46,borderRadius:12,backgroundColor:'#5148C8',alignItems:'center',justifyContent:'center',padding:10},
  buttonText:{fontFamily:Typography.boldFontFamily,fontSize:14,color:'#fff'},
  feedback:{fontFamily:Typography.fontFamily,fontSize:14,lineHeight:23,color:'#176B55',textAlign:'right',writingDirection:'rtl'},
  note:{fontFamily:Typography.fontFamily,fontSize:12,lineHeight:20,color:'#52566A',textAlign:'right',writingDirection:'rtl'},
  disabled:{opacity:.45},
});
