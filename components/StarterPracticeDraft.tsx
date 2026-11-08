import { LocalizedText as Text, LocalizedTextInput as TextInput } from '@/components/LocalizedText';
import {useEffect,useState} from 'react';
import {Pressable,StyleSheet,View} from 'react-native';
import {loadPracticeDraft,removePracticeDraft,savePracticeDraft} from '@/lib/languages/localPracticeDraft';
import {Typography} from '@/lib/theme';

/** Explicit opt-in persistence; typing never writes to storage automatically. */
export default function StarterPracticeDraft({storageKey,label}:{storageKey:string;label:string}){
 const [value,setValue]=useState(''),[ready,setReady]=useState(false),[busy,setBusy]=useState(false),[hasSaved,setHasSaved]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
 useEffect(()=>{let alive=true;setReady(false);setError('');void loadPracticeDraft(storageKey).then(text=>{if(alive){setValue(text??'');setHasSaved(text!==null);setReady(true);}}).catch(()=>{if(alive){setError('پیش‌نویس خوانده نشد؛ دادهٔ ذخیره‌شده تغییر نکرده است.');setReady(true);}});return()=>{alive=false;};},[storageKey]);
 const save=async()=>{setBusy(true);setError('');setMessage('');try{await savePracticeDraft(storageKey,value);setHasSaved(true);setMessage('پیش‌نویس فقط در همین دستگاه ذخیره شد.');}catch{setError('ذخیره انجام نشد؛ متن فعلی در صفحه باقی مانده است.');}finally{setBusy(false);}};
 const remove=async()=>{setBusy(true);setError('');setMessage('');try{await removePracticeDraft(storageKey);setHasSaved(false);setMessage('نسخهٔ ذخیره‌شده حذف شد؛ متن فعلی هنوز در صفحه است.');}catch{setError('نسخهٔ ذخیره‌شده حذف نشد.');}finally{setBusy(false);}};
 return <View style={s.root}>
  <TextInput accessibilityLabel={label} multiline value={value} editable={ready&&!busy} onChangeText={text=>{setValue(text);setMessage('');}} autoCorrect={false} autoCapitalize="sentences" placeholder="…" style={s.input}/>
  <Text style={s.note}>متن خودکار ذخیره یا تصحیح نمی‌شود. برای نگه‌داشتن آن روی همین دستگاه، ذخیره را انتخاب کنید؛ تغییرات ذخیره‌نشده با خروج پاک می‌شوند. این متن رمزگذاری نمی‌شود؛ اطلاعات حساس وارد نکنید.</Text>
  <View style={s.actions}><Pressable accessibilityRole="button" accessibilityLabel={`ذخیرهٔ محلی ${label}`} accessibilityState={{disabled:!ready||busy}} disabled={!ready||busy} onPress={()=>void save()} style={[s.action,(!ready||busy)&&s.disabled]}><Text style={s.actionText}>ذخیرهٔ محلی</Text></Pressable>{hasSaved&&<Pressable accessibilityRole="button" accessibilityLabel={`حذف نسخهٔ ذخیره‌شده ${label}`} accessibilityState={{disabled:busy}} disabled={busy} onPress={()=>void remove()} style={s.action}><Text style={s.actionText}>حذف نسخهٔ ذخیره‌شده</Text></Pressable>}</View>
  {!!message&&<Text accessibilityLiveRegion="polite" style={s.note}>{message}</Text>}{!!error&&<Text accessibilityRole="alert" style={s.error}>{error}</Text>}
 </View>;
}
const s=StyleSheet.create({root:{gap:8,width:'100%'},input:{minHeight:110,borderColor:'#CBD5E1',borderWidth:1,borderRadius:10,padding:10,backgroundColor:'#FAFAFE',textAlign:'left',writingDirection:'ltr',textAlignVertical:'top',fontSize:15,color:'#202039'},note:{fontFamily:Typography.fontFamily,fontSize:12,lineHeight:20,color:'#475569',textAlign:'right',writingDirection:'rtl'},actions:{flexDirection:'row-reverse',flexWrap:'wrap',gap:10},action:{minHeight:44,borderRadius:10,borderWidth:1,borderColor:'#D7D4F4',paddingHorizontal:12,justifyContent:'center'},disabled:{opacity:.5},actionText:{fontFamily:Typography.boldFontFamily,fontSize:13,color:'#5148C8',textAlign:'right'},error:{fontFamily:Typography.fontFamily,fontSize:13,lineHeight:22,color:'#A32C36',textAlign:'right',writingDirection:'rtl'}});
