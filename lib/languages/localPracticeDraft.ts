import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';

/** Manual, device-local drafts only; never uploaded by the course progress store. */
const prefix='language_practice_draft_v1:';
export function practiceDraftKey(language:string,level:'b1'|'b2'|'c1',kind:'lesson'|'workshop',id:string):string {
 if(!/^(fr|de|es)$/.test(language)||!/^[a-z0-9-]+$/.test(id))throw new Error('شناسهٔ پیش‌نویس معتبر نیست.');
 return `${prefix}${language}:${level}:${kind}:${id}`;
}
async function read(key:string):Promise<string|null>{
 if(Platform.OS==='web')return typeof window==='undefined'?null:window.localStorage.getItem(key);
 return AsyncStorage.getItem(key);
}
async function write(key:string,value:string|null):Promise<void>{
 if(Platform.OS==='web'){
  if(typeof window==='undefined')throw new Error('ذخیره‌سازی در دسترس نیست.');
  if(value===null)window.localStorage.removeItem(key);else window.localStorage.setItem(key,value);
 }else if(value===null)await AsyncStorage.removeItem(key);else await AsyncStorage.setItem(key,value);
}
export async function loadPracticeDraft(key:string):Promise<string|null>{
 const raw=await read(key);if(raw===null)return null;
 let parsed:unknown;try{parsed=JSON.parse(raw);}catch{throw new Error('پیش‌نویس ذخیره‌شده خوانده نشد؛ دادهٔ اصلی دست‌نخورده است.');}
 if(!parsed||typeof parsed!=='object'||Array.isArray(parsed)||(parsed as {schema?:unknown}).schema!==1||typeof (parsed as {text?:unknown}).text!=='string')throw new Error('ساختار پیش‌نویس شناخته نشد؛ دادهٔ اصلی دست‌نخورده است.');
 return (parsed as {text:string}).text;
}
export async function savePracticeDraft(key:string,text:string):Promise<void>{
 if(text.length>30000)throw new Error('متن برای ذخیره بیش از حد طولانی است.');
 // Refuse to overwrite data with an unrecognized schema.
 await loadPracticeDraft(key);
 await write(key,JSON.stringify({schema:1,text}));
}
export async function removePracticeDraft(key:string):Promise<void>{await loadPracticeDraft(key);await write(key,null);}
