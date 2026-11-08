import { A1_CORE_SKILLS } from './a1CoreSkills';
import { A1_EXTRA_SKILLS } from './a1ExtraSkills';
import { A1_TOPIC_INTROS } from './a1TopicIntroductions';
import { independentTopicSkills } from './a1IndependentSkills';
import { A1_SCENARIO_INTROS } from './a1ScenarioIntroductions';
import { A1_GRAMMAR_INTROS } from './a1GrammarIntroductions';
import { A1_EVERYDAY_INTROS } from './a1EverydayIntroductions';
import { A1_SOCIAL_INTROS } from './a1SocialIntroductions';
import { A1_TIME_FEELINGS_INTROS } from './a1TimeFeelingsIntroductions';
import { A1_PRACTICAL_INTROS } from './a1PracticalIntroductions';
import { A1_REMAINING_INTROS } from './a1RemainingIntroductions';

/** Original, lesson-specific practice. IDs include the language to prevent cross-course lookup. */
export type A1SkillTask = {
  kind: 'listening' | 'reading';
  passage: string;
  promptFa: string;
  choices: readonly string[];
  correctIndex: number;
  explanationFa: string;
};

export const A1_SKILLS: Readonly<Record<string, readonly A1SkillTask[]>> = {
  ...A1_CORE_SKILLS,
  ...A1_EXTRA_SKILLS,
  ...Object.fromEntries((['fr','de','es'] as const).flatMap(id => [...A1_TOPIC_INTROS[id], ...A1_GRAMMAR_INTROS[id], ...A1_EVERYDAY_INTROS[id], ...A1_SOCIAL_INTROS[id], ...A1_TIME_FEELINGS_INTROS[id], ...A1_PRACTICAL_INTROS[id], ...A1_REMAINING_INTROS[id], ...A1_SCENARIO_INTROS[id]].map(intro => [`${id}-a1-${intro.slug}`, independentTopicSkills(id, intro.slug)]))),
  'de-a1-room-search': [
    {kind:'listening', passage:'Das Zimmer kostet fünfhundert Euro im Monat. Das Internet ist im Preis.', promptFa:'اجارهٔ ماهانهٔ اتاق چقدر است؟', choices:['۴۰۰ یورو','۵۰۰ یورو','۶۰۰ یورو'], correctIndex:1, explanationFa:'fünfhundert Euro im Monat یعنی ماهی ۵۰۰ یورو.'},
    {kind:'reading', passage:'Zimmer frei ab 1. Mai. Das Haus ist in der Nähe vom Bahnhof. Kein Balkon.', promptFa:'طبق آگهی، کدام امکان وجود ندارد؟', choices:['ایستگاه قطار در نزدیکی','اتاق آزاد','بالکن'], correctIndex:2, explanationFa:'Kein Balkon یعنی بالکن وجود ندارد.'},
  ],
  'fr-a1-appointment-time': [
    {kind:'listening', passage:'Votre rendez-vous est mardi à dix heures. Merci et à mardi !', promptFa:'قرار چه زمانی است؟', choices:['سه‌شنبه ساعت ده','دوشنبه ساعت ده','سه‌شنبه ساعت یازده'], correctIndex:0, explanationFa:'mardi à dix heures یعنی سه‌شنبه ساعت ده.'},
    {kind:'reading', passage:'Rendez-vous : vendredi à onze heures. Vous pouvez changer le rendez-vous par téléphone.', promptFa:'طبق پیام، قرار چه ساعتی است؟', choices:['ساعت نه','ساعت یازده','ساعت یک'], correctIndex:1, explanationFa:'vendredi à onze heures یعنی جمعه ساعت یازده.'},
  ],
  'es-a1-metro-directions': [
    {kind:'listening', passage:'Siga recto y gire a la izquierda. La estación está cerca de la plaza.', promptFa:'پس از مستقیم رفتن، به کدام سمت بپیچید؟', choices:['به راست','به سمت میدان، بدون پیچیدن','به چپ'], correctIndex:2, explanationFa:'gire a la izquierda یعنی به چپ بپیچید.'},
    {kind:'reading', passage:'Metro: un billete cuesta dos euros. Puede pagar con tarjeta.', promptFa:'طبق متن، یک بلیت چقدر است؟', choices:['دو یورو','پنج یورو','ده یورو'], correctIndex:0, explanationFa:'un billete cuesta dos euros یعنی قیمت یک بلیت دو یورو است.'},
  ],
};
