import { LocalizedText as Text } from '@/components/LocalizedText';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { LearningSentence } from '@/lib/languages/types';
import { Typography } from '@/lib/theme';

/** Short standalone expressions cannot usefully be scrambled as a single chip. */
export function StarterWordChoice({ sentence, sentences }: { sentence: LearningSentence; sentences: LearningSentence[] }) {
  const options = useMemo(() => {
    const unique = [...new Set(sentences.map(item => item.text))];
    const others = unique.filter(text => text !== sentence.text);
    const index = Math.max(0, sentences.findIndex(item => item.id === sentence.id));
    const choices = [sentence.text, ...others.slice(index % Math.max(others.length, 1)), ...others.slice(0, index % Math.max(others.length, 1))].slice(0, 4);
    // Rotate, rather than always displaying the correct answer first.
    const offset = index % choices.length;
    return [...choices.slice(offset), ...choices.slice(0, offset)];
  }, [sentence.id, sentence.text, sentences]);
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => setSelected(null), [sentence.id]);
  return <View style={s.card}>
    <Text style={s.title}>گزینهٔ این نمونه را انتخاب کن</Text>
    <Text style={s.question}>{sentence.fa}</Text>
    <View style={s.options}>{options.map(option => <Pressable key={option} accessibilityRole="button" accessibilityState={{selected: selected === option}} onPress={() => setSelected(option)} style={[s.option,selected === option && s.selected]}><Text style={s.optionText}>{option}</Text></Pressable>)}</View>
    {selected !== null && <Text accessibilityLiveRegion="polite" style={[s.feedback,{color:selected === sentence.text ? '#13805D' : '#B14F2B'}]}>{selected === sentence.text ? 'درست است!' : 'برای این نمونه گزینهٔ دیگری ثبت شده است؛ دوباره تلاش کنید.'}</Text>}
  </View>;
}
const s=StyleSheet.create({card:{width:'100%',marginTop:18,borderRadius:18,borderWidth:1,borderColor:'#E1E4F0',backgroundColor:'#fff',padding:16,gap:12},title:{fontFamily:'Beiruti-Bold',fontSize:15,color:'#5148C8',textAlign:'right'},question:{fontFamily:Typography.fontFamily,fontSize:19,color:'#202039',textAlign:'right'},options:{flexDirection:'row',flexWrap:'wrap',gap:8},option:{minHeight:46,flexGrow:1,borderRadius:12,borderWidth:1,borderColor:'#DCE0EE',paddingHorizontal:12,paddingVertical:10,justifyContent:'center'},selected:{borderColor:'#5148C8',backgroundColor:'#F1EFFF'},optionText:{fontFamily:'Inter-SemiBold',fontSize:14,color:'#202039',writingDirection:'ltr',textAlign:'center'},feedback:{fontFamily:Typography.fontFamily,fontSize:15,textAlign:'right'}});
