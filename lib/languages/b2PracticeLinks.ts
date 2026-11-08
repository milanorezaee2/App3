import type {NewLanguageId} from './newCourses';
/** Explicit relevance, not a claim that a single activity completes a topic. */
const grammar:Partial<Record<number,readonly string[]>>={1:['sequence'],2:['sequence'],3:['sequence'],4:['mixed'],5:['mixed'],7:['certainty'],8:['reported'],9:['passive'],10:['passive'],11:['relative'],12:['gerund'],13:['concession','purpose'],20:['register'],24:['concession']};
const workshop:Partial<Record<number,readonly string[]>>={1:['transport'],2:['transport'],3:['media'],4:['meeting'],5:['meeting'],6:['meeting'],7:['interview'],8:['meeting'],9:['service'],10:['feedback'],11:['transport','meeting'],12:['meeting'],13:['housing-policy'],14:['media','meeting'],15:['media'],16:['research'],17:['interview','research'],18:['transport','media'],19:['research'],20:['service','feedback'],21:['media'],22:['feedback'],23:['unexpected'],24:['meeting','housing-policy'],25:['climate-dialogue'],26:['service','feedback'],27:['unexpected','service'],28:['feedback'],29:['interview','media'],30:['climate-dialogue','meeting']};
export function b2GrammarLinks(language:NewLanguageId, section:string, number:number):readonly string[]{
 if(section!=='foundation')return [];
 const base=language==='de'&&number===12?['infinitive','participle']:language==='de'&&number===13?['concession']:grammar[number]??[];
 const extras:Record<NewLanguageId,Partial<Record<number,readonly string[]>>>={
  fr:{3:['future-prior'],6:['past-regret'],8:['reported-request'],12:['infinitive-past'],13:['cause-result']},
  de:{8:['reported-plural','reported-request'],9:['passive-modal'],12:['participle-active'],13:['purpose']},
  es:{3:['future-time'],6:['wish-past','past-regret'],7:['doubt'],9:['passive-se']},
 };
 return [...base,...(extras[language][number]??[])];
}
const foundationWorkshop:Partial<Record<number,readonly string[]>>={1:['unexpected'],2:['unexpected'],3:['unexpected'],4:['unexpected'],5:['unexpected'],6:['unexpected'],7:['research'],8:['meeting'],13:['housing-policy'],14:['climate-dialogue','feedback'],15:['media'],16:['housing-policy'],17:['feedback'],18:['research'],20:['service'],21:['transport','media'],22:['meeting'],23:['research'],24:['media'],25:['media','transport']};
export function b2WorkshopLinks(section:string, number:number):readonly string[]{return section==='survival'?(workshop[number]??[]):section==='foundation'?(foundationWorkshop[number]??[]):[];}
