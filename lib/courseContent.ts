import { EXPANDED_SENTENCE_LESSONS } from './courseContentExpansion';
import { ADVANCED_SENTENCE_LESSONS } from './courseContentExpansion2';
import { ADVANCED_SENTENCE_LESSONS_2 } from './courseContentExpansion3';
import { ADVANCED_SENTENCE_LESSONS_3 } from './courseContentExpansion4';
import { ADVANCED_SENTENCE_LESSONS_4 } from './courseContentExpansion5';
import { ADVANCED_SENTENCE_LESSONS_5 } from './courseContentExpansion6';
import { ADVANCED_SENTENCE_LESSONS_6 } from './courseContentExpansion7';
import { ADVANCED_SENTENCE_LESSONS_7 } from './courseContentExpansion8';
import { FINAL_SENTENCE_LESSONS } from './courseContentFinal';
import { FOUNDATION_SURVIVAL_EXTENSIONS } from './courseContentFoundationSurvival';
import { FOUNDATION_COMPLETION_SENTENCES } from './courseContentFoundationCompletion';
import { FOUNDATION_SURVIVAL_EXPANSION_LESSONS } from './courseContentFoundationSurvivalExpansion';
import { EVERYDAY_EXPANSION_LESSONS } from './courseContentEverydayExpansion';
import { EVERYDAY_COMPLETION_SENTENCES } from './courseContentEverydayCompletion';
import { SURVIVAL_COMPLETION_SENTENCES } from './courseContentSurvivalCompletion';
import {
  COMMUNICATION_COMPLETION_SENTENCES,
  COMMUNICATION_COURSE_LESSON_IDS,
} from './courseContentCommunicationCompletion';
import { COMMUNICATION_NEW_LESSONS } from './courseContentCommunicationNewLessons';
import { B1_INDEPENDENT_LESSONS } from './courseContentB1Independent';
import { A2_FOUNDATION_LESSONS } from './courseContentA2Foundation';
import { B2_UPPER_INTERMEDIATE_LESSONS } from './courseContentB2UpperIntermediate';
import { C1_ADVANCED_LESSONS } from './courseContentC1Advanced';
import {
  COMMUNICATION_LESSON_UNIT,
  COMMUNICATION_MODULES,
} from './courseContentCommunicationStructure';

export { COMMUNICATION_COURSE_LESSON_IDS, COMMUNICATION_LESSON_UNIT, COMMUNICATION_MODULES };

export type CourseLevelId = 0 | 1 | 2 | 3 | 4 | 5;

export interface CourseSentence {
  id: string;
  en: string;
  fa: string;
  pronunciation: string;
  pattern?: string;
  vocabulary: Array<{
    word: string;
    meaning: string;
    /** Tracked internally; the lesson UI and sentence-first flow stay unchanged. */
    essential504?: true;
  }>;
}

export interface SentenceLesson {
  id: string;
  levelId: CourseLevelId;
  order: number;
  /** Honest distinction between the contextual Advanced lessons and legacy vocabulary sets. */
  contentKind?: 'scenario' | 'vocabulary-practice';
  /** Additive B1 curriculum section; absent for pre-existing lessons. */
  b1Section?: 'foundation' | 'survival';
  a2Section?: 'foundation' | 'survival' | 'legacy';
  /** Additive B2 course; older advanced material remains separately labelled. */
  b2Section?: 'foundation' | 'survival';
  c1Section?: 'foundation' | 'survival';
  title: string;
  subtitle: string;
  situation: string;
  durationMinutes: number;
  sentences: CourseSentence[];
  dialogue: Array<{ speaker: 'learner' | 'partner'; text: string; fa: string }>;
  /** Thematic unit metadata is currently populated for Communication English. */
  unitId?: string;
  unitTitle?: string;
  unitTitleEn?: string;
}

export interface CourseLevel {
  id: CourseLevelId;
  title: string;
  cefr: string;
  description: string;
  color: string;
  modules: string[];
}

export const COURSE_LEVELS: CourseLevel[] = [
  {
    id: 0,
    title: 'Foundation',
    cefr: 'شروع از صفر',
    description: 'صداها، الفبا و جمله‌های روزمره برای آغاز از صفر',
    color: '#6366f1',
    modules: ['معرفی و احوال‌پرسی', 'درخواست کمک', 'خرید و قیمت‌ها', 'الفبا و هجی‌کردن', 'ضمیرها و فعل be', 'عددها و اطلاعات تماس', 'خانواده و مالکیت', 'زمان و تقویم', 'کارهای روزمره', 'وسایل و مکان‌ها'],
  },
  {
    id: 1,
    title: 'Survival English',
    cefr: 'A1',
    description: 'مکالمه در موقعیت‌های ضروری روزمره',
    color: '#0ea5e9',
    modules: ['موقعیت‌های اصلی', 'الگوهای جمله', 'شنیدن و صحبت‌کردن'],
  },
  {
    id: 2,
    title: 'Everyday English',
    cefr: 'A2–B1',
    description: 'انگلیسی طبیعی برای زندگی روزمره',
    color: '#10b981',
    modules: ['موقعیت‌های واقعی', 'گفتگوها', 'خواندن و نوشتن'],
  },
  {
    id: 3,
    title: 'Communication English',
    cefr: 'B1–B2',
    description: 'روانی در گفتگو، نظر دادن و داستان‌گویی',
    color: '#f59e0b',
    modules: COMMUNICATION_MODULES.map(unit => unit.titleFa),
  },
  {
    id: 4,
    title: 'B2 — Upper-Intermediate Communication',
    cefr: 'B2 · سطح ۴',
    description: 'ارتباط پیشرفته‌تر، گفت‌وگو و استدلال؛ همراه با درس‌های پیشین پیشرفته',
    color: '#8b5cf6',
    modules: ['روایت و زمان‌های پیشرفته', 'فرضیه و شرط ترکیبی', 'بازگویی، مجهول و سببی', 'استدلال و نگارش', 'ارتباط حرفه‌ای و اجتماعی', 'درس‌های پیشین پیشرفته'],
  },
  {
    id: 5, title: 'C1 — Advanced Communication', cefr: 'C1 · سطح ۵',
    description: 'ارتباط دقیق، تحلیل و استدلال در موقعیت‌های تخصصی و حرفه‌ای', color: '#b55369',
    modules: ['مفاهیم انتزاعی و روایت', 'ساختارهای پیشرفته و دقت بیان', 'تحلیل و ترکیب منابع', 'مذاکره، ارائه و حل تعارض', 'رسانه، پژوهش و ارتباط بین‌فرهنگی'],
  },
];

const CORE_SENTENCE_LESSONS: SentenceLesson[] = [
  {
    id: 'foundation-introducing-yourself',
    levelId: 0,
    order: 1,
    title: 'معرفی خود',
    subtitle: 'اولین گفتگوی ساده و واقعی',
    situation: 'برای اولین بار با یک نفر آشنا شده‌اید و می‌خواهید خودتان را معرفی کنید.',
    durationMinutes: 8,
    sentences: [
      {
        id: 's1',
        en: 'Hello, my name is Sara.',
        fa: 'سلام، اسم من سارا است.',
        pronunciation: 'هِلو، مای نِیم ایز سارا',
        pattern: 'My name is + name',
        vocabulary: [{ word: 'name', meaning: 'اسم' }],
      },
      {
        id: 's2',
        en: 'What is your name?',
        fa: 'اسم شما چیست؟',
        pronunciation: 'وات ایز یور نِیم؟',
        pattern: 'What is your + noun?',
        vocabulary: [{ word: 'your', meaning: 'مال شما / ـتان' }],
      },
      {
        id: 's3',
        en: 'Nice to meet you.',
        fa: 'از آشنایی با شما خوشحالم.',
        pronunciation: 'نایس تو میت یو',
        vocabulary: [
          { word: 'nice', meaning: 'خوب / خوشایند' },
          { word: 'meet', meaning: 'ملاقات کردن' },
        ],
      },
      {
        id: 's4',
        en: 'I am from Iran.',
        fa: 'من اهل ایران هستم.',
        pronunciation: 'آی اَم فرام ایران',
        pattern: 'I am from + place',
        vocabulary: [{ word: 'from', meaning: 'از / اهل' }],
      },
      {
        id: 's5',
        en: 'Where are you from?',
        fa: 'شما اهل کجا هستید؟',
        pronunciation: 'وِر آر یو فرام؟',
        pattern: 'Where are you from?',
        vocabulary: [{ word: 'where', meaning: 'کجا' }],
      },
    ],
    dialogue: [
      { speaker: 'partner', text: 'Hello! My name is Emma. What is your name?', fa: 'سلام! اسم من اِما است. اسم شما چیست؟' },
      { speaker: 'learner', text: 'Hello, my name is Sara.', fa: 'سلام، اسم من سارا است.' },
      { speaker: 'partner', text: 'Nice to meet you. Where are you from?', fa: 'از آشنایی خوشحالم. اهل کجا هستید؟' },
      { speaker: 'learner', text: 'Nice to meet you too. I am from Iran.', fa: 'من هم از آشنایی خوشحالم. اهل ایران هستم.' },
    ],
  },
  {
    id: 'foundation-asking-for-help',
    levelId: 0,
    order: 2,
    title: 'درخواست کمک',
    subtitle: 'جمله‌های ضروری وقتی کمک می‌خواهید',
    situation: 'در یک مکان جدید هستید و برای پیدا کردن مسیر یا فهمیدن صحبت دیگران کمک می‌خواهید.',
    durationMinutes: 9,
    sentences: [
      { id: 's1', en: 'Can you help me?', fa: 'می‌توانید به من کمک کنید؟', pronunciation: 'کَن یو هِلپ می؟', pattern: 'Can you + verb?', vocabulary: [{ word: 'help', meaning: 'کمک کردن' }] },
      { id: 's2', en: 'I do not understand.', fa: 'متوجه نمی‌شوم.', pronunciation: 'آی دو نات آندِراِستَند', vocabulary: [{ word: 'understand', meaning: 'متوجه شدن' }] },
      { id: 's3', en: 'Please speak slowly.', fa: 'لطفاً آهسته صحبت کنید.', pronunciation: 'پلیز اسپیک اِسلولی', vocabulary: [{ word: 'slowly', meaning: 'به‌آرامی' }] },
      { id: 's4', en: 'Could you say that again?', fa: 'می‌شود دوباره بگویید؟', pronunciation: 'کود یو سِی ذَت اَگِن؟', vocabulary: [{ word: 'again', meaning: 'دوباره' }] },
      { id: 's5', en: 'Thank you for your help.', fa: 'برای کمکتان ممنونم.', pronunciation: 'تَنک یو فُر یور هِلپ', vocabulary: [{ word: 'thank you', meaning: 'متشکرم' }] },
    ],
    dialogue: [
      { speaker: 'partner', text: 'Hello. How can I help you?', fa: 'سلام. چطور می‌توانم کمکتان کنم؟' },
      { speaker: 'learner', text: 'Excuse me. Where is the station?', fa: 'ببخشید. ایستگاه کجاست؟' },
      { speaker: 'partner', text: 'It is next to the bank.', fa: 'کنار بانک است.' },
      { speaker: 'learner', text: 'Is it far from here?', fa: 'از اینجا دور است؟' },
      { speaker: 'partner', text: 'No. It is a short walk.', fa: 'نه. کمی پیاده‌روی دارد.' },
      { speaker: 'learner', text: 'Could you show me on the map?', fa: 'ممکن است روی نقشه به من نشان دهید؟' },
      { speaker: 'partner', text: 'Of course. Here is the station.', fa: 'حتماً. ایستگاه اینجاست.' },
      { speaker: 'learner', text: 'Thank you. What time is it?', fa: 'ممنون. ساعت چند است؟' },
      { speaker: 'partner', text: 'It is half past seven.', fa: 'ساعت هفت‌ونیم است.' },
      { speaker: 'learner', text: 'What time does the bus leave?', fa: 'اتوبوس چه ساعتی حرکت می‌کند؟' },
      { speaker: 'partner', text: 'The bus leaves at eight.', fa: 'اتوبوس ساعت هشت حرکت می‌کند.' },
      { speaker: 'learner', text: 'Thank you for your help.', fa: 'برای کمکتان ممنونم.' },
    ],
  },
  {
    id: 'foundation-buying-something',
    levelId: 0,
    order: 3,
    title: 'خرید ساده',
    subtitle: 'پرسیدن قیمت و خرید یک کالا',
    situation: 'وارد فروشگاه شده‌اید و می‌خواهید قیمت یک کالا را بپرسید و آن را بخرید.',
    durationMinutes: 10,
    sentences: [
      { id: 's1', en: 'How much is this?', fa: 'این چقدر است؟', pronunciation: 'هاو ماچ ایز ذیس؟', vocabulary: [{ word: 'how much', meaning: 'چقدر / چه قیمتی' }] },
      { id: 's2', en: 'I would like this one.', fa: 'من این یکی را می‌خواهم.', pronunciation: 'آی وود لایک ذیس وان', pattern: 'I would like + noun', vocabulary: [{ word: 'would like', meaning: 'مایل بودن / خواستن' }] },
      { id: 's3', en: 'Do you have a smaller size?', fa: 'اندازه کوچک‌تر دارید؟', pronunciation: 'دو یو هَو اَ اِسمالِر سایز؟', vocabulary: [{ word: 'size', meaning: 'اندازه' }] },
      { id: 's4', en: 'Can I pay by card?', fa: 'می‌توانم با کارت پرداخت کنم؟', pronunciation: 'کَن آی پِی بای کارد؟', vocabulary: [{ word: 'pay', meaning: 'پرداخت کردن' }] },
      { id: 's5', en: 'That is all, thank you.', fa: 'همین است، متشکرم.', pronunciation: 'ذَت ایز آل، تَنک یو', vocabulary: [{ word: 'all', meaning: 'همه / تمام' }] },
    ],
    dialogue: [
      { speaker: 'partner', text: 'Hello. Can I help you?', fa: 'سلام. می‌توانم کمکتان کنم؟' },
      { speaker: 'learner', text: 'Yes, please. How much is this shirt?', fa: 'بله، لطفاً. این پیراهن چقدر است؟' },
      { speaker: 'partner', text: 'It is ten dollars.', fa: 'ده دلار است.' },
      { speaker: 'learner', text: 'Do you have it in blue?', fa: 'آن را به رنگ آبی دارید؟' },
      { speaker: 'partner', text: 'Yes, here is a blue one.', fa: 'بله، این هم یک پیراهن آبی.' },
      { speaker: 'learner', text: 'Can I try it on?', fa: 'می‌توانم آن را پرو کنم؟' },
      { speaker: 'partner', text: 'Of course. Does it fit?', fa: 'حتماً. اندازه‌تان است؟' },
      { speaker: 'learner', text: 'Yes. I would like this one.', fa: 'بله. این یکی را می‌خواهم.' },
      { speaker: 'partner', text: 'How would you like to pay?', fa: 'چطور می‌خواهید پرداخت کنید؟' },
      { speaker: 'learner', text: 'Can I pay by card?', fa: 'می‌توانم با کارت پرداخت کنم؟' },
      { speaker: 'partner', text: 'Yes. Here is your receipt.', fa: 'بله. این هم رسید شما.' },
      { speaker: 'learner', text: 'Thank you. Goodbye.', fa: 'ممنون. خداحافظ.' },
    ],
  },
  {
    id: 'survival-job-interview',
    levelId: 1,
    order: 4,
    title: 'معرفی توانایی‌های کاری',
    subtitle: 'صحبت ساده و طبیعی در یک مصاحبه',
    situation: 'در یک مصاحبه کوتاه می‌خواهید درباره علاقه، تجربه و توانایی‌های خود صحبت کنید.',
    durationMinutes: 11,
    sentences: [
      { id: 'job-keen', en: 'I want to learn.', fa: 'من می‌خواهم یاد بگیرم.', pronunciation: 'آی وانت تو لِرن', pattern: 'I want to + verb', vocabulary: [{ word: 'learn', meaning: 'یاد گرفتن' }] },
      { id: 'job-qualify', en: 'I want this job.', fa: 'من این کار را می‌خواهم.', pronunciation: 'آی وانت ذیس جاب', vocabulary: [{ word: 'job', meaning: 'کار / شغل' }] },
      { id: 'job-data', en: 'I use a phone at work.', fa: 'من در محل کار از تلفن استفاده می‌کنم.', pronunciation: 'آی یوز اَ فون اَت وِرک', vocabulary: [{ word: 'phone', meaning: 'تلفن' }] },
      { id: 'job-talent', en: 'I can cook well.', fa: 'من می‌توانم خوب آشپزی کنم.', pronunciation: 'آی کَن کوک وِل', vocabulary: [{ word: 'cook', meaning: 'آشپزی کردن' }] },
      { id: 'job-team', en: 'I work well with a team.', fa: 'من با یک تیم به‌خوبی کار می‌کنم.', pronunciation: 'آی وِرک وِل ویذ اَ تیم', vocabulary: [{ word: 'team', meaning: 'تیم' }] },
      { id: 'job-ready', en: 'I am ready to start.', fa: 'من آماده شروع هستم.', pronunciation: 'آی اَم رِدی تو اِستارت', vocabulary: [{ word: 'ready', meaning: 'آماده' }] },
    ],
    dialogue: [
      { speaker: 'partner', text: 'Hello. Please tell me your name.', fa: 'سلام. لطفاً نامتان را بگویید.' },
      { speaker: 'learner', text: 'My name is Sara.', fa: 'اسم من سارا است.' },
      { speaker: 'partner', text: 'Can you use a computer?', fa: 'می‌توانید از رایانه استفاده کنید؟' },
      { speaker: 'learner', text: 'Yes, I can use a computer.', fa: 'بله، می‌توانم از رایانه استفاده کنم.' },
      { speaker: 'partner', text: 'Can you work with a team?', fa: 'می‌توانید با یک تیم کار کنید؟' },
      { speaker: 'learner', text: 'Yes, I work well with a team.', fa: 'بله، من با تیم خوب کار می‌کنم.' },
      { speaker: 'partner', text: 'Do you have work experience?', fa: 'تجربهٔ کاری دارید؟' },
      { speaker: 'learner', text: 'Yes. I have one year of experience.', fa: 'بله. یک سال تجربه دارم.' },
      { speaker: 'partner', text: 'Can you work on weekends?', fa: 'می‌توانید آخر هفته‌ها کار کنید؟' },
      { speaker: 'learner', text: 'Yes, I can work on weekends.', fa: 'بله، می‌توانم آخر هفته‌ها کار کنم.' },
      { speaker: 'partner', text: 'When can you start?', fa: 'چه زمانی می‌توانید شروع کنید؟' },
      { speaker: 'learner', text: 'I can start next Monday.', fa: 'می‌توانم دوشنبهٔ آینده شروع کنم.' },
      { speaker: 'partner', text: 'Do you have a question?', fa: 'سؤالی دارید؟' },
      { speaker: 'learner', text: 'What are the working hours?', fa: 'ساعت‌های کاری چگونه است؟' },
      { speaker: 'partner', text: 'We work from nine to five.', fa: 'از نه تا پنج کار می‌کنیم.' },
      { speaker: 'learner', text: 'Thank you for your time.', fa: 'از وقتی که گذاشتید ممنونم.' },
    ],
  },
  {
    id: 'survival-renting-a-home',
    levelId: 1,
    order: 5,
    title: 'پیدا کردن خانه',
    subtitle: 'پرسش‌های لازم برای اجاره خانه',
    situation: 'برای دیدن یک خانه رفته‌اید و می‌خواهید درباره قیمت، مدت قرارداد و شرایط آن سؤال کنید.',
    durationMinutes: 11,
    sentences: [
      { id: 'home-vacant', en: 'Is this apartment empty?', fa: 'آیا این آپارتمان خالی است؟', pronunciation: 'ایز ذیس اَپارت‌مِنت اِمپتی؟', vocabulary: [{ word: 'empty', meaning: 'خالی' }] },
      { id: 'home-expensive', en: 'The apartment is too expensive for me.', fa: 'این آپارتمان برای من خیلی گران است.', pronunciation: 'ذی اَپارت‌مِنت ایز تو اِکسپِنسیو فُر می', vocabulary: [{ word: 'expensive', meaning: 'گران', essential504: true }] },
      { id: 'home-minimum', en: 'I can stay for six months.', fa: 'می‌توانم شش ماه بمانم.', pronunciation: 'آی کَن اِستِی فُر سیکس مانتس', vocabulary: [{ word: 'stay', meaning: 'ماندن' }] },
      { id: 'home-annual', en: 'Do I pay every year?', fa: 'آیا هر سال پرداخت می‌کنم؟', pronunciation: 'دو آی پِی اِوری ییر؟', vocabulary: [{ word: 'year', meaning: 'سال' }] },
      { id: 'home-bills', en: 'Are the bills included?', fa: 'آیا هزینه قبض‌ها حساب شده است؟', pronunciation: 'آر ذِ بیلز اینکلودِد؟', vocabulary: [{ word: 'included', meaning: 'شامل‌شده' }] },
      { id: 'home-see', en: 'I would like to see the rooms.', fa: 'می‌خواهم اتاق‌ها را ببینم.', pronunciation: 'آی وود لایک تو سی ذِ رومز', vocabulary: [{ word: 'room', meaning: 'اتاق' }] },
    ],
    dialogue: [
      { speaker: 'partner', text: 'Hello. How can I help you?', fa: 'سلام. چطور می‌توانم کمکتان کنم؟' },
      { speaker: 'learner', text: 'I would like to see the apartment.', fa: 'می‌خواهم آپارتمان را ببینم.' },
      { speaker: 'partner', text: 'Of course. What would you like to know?', fa: 'حتماً. دوست دارید چه چیزی بدانید؟' },
      { speaker: 'learner', text: 'How much is the rent?', fa: 'اجاره چقدر است؟' },
      { speaker: 'partner', text: 'It is eight hundred dollars a month.', fa: 'ماهی هشتصد دلار است.' },
      { speaker: 'learner', text: 'Are the bills included?', fa: 'آیا هزینهٔ قبض‌ها حساب شده است؟' },
      { speaker: 'partner', text: 'Water is included, but electricity is not.', fa: 'هزینهٔ آب حساب شده، اما برق نه.' },
      { speaker: 'learner', text: 'How long is the lease?', fa: 'مدت قرارداد اجاره چقدر است؟' },
      { speaker: 'partner', text: 'The lease is for twelve months.', fa: 'مدت قرارداد دوازده ماه است.' },
      { speaker: 'learner', text: 'Is the apartment furnished?', fa: 'آپارتمان مبله است؟' },
      { speaker: 'partner', text: 'Yes, it is furnished.', fa: 'بله، مبله است.' },
      { speaker: 'learner', text: 'Is there a bus stop nearby?', fa: 'نزدیک اینجا ایستگاه اتوبوس هست؟' },
      { speaker: 'partner', text: 'Yes. The bus stop is near the apartment.', fa: 'بله. ایستگاه اتوبوس نزدیک آپارتمان است.' },
      { speaker: 'learner', text: 'Can I see the rooms, please?', fa: 'ممکن است لطفاً اتاق‌ها را ببینم؟' },
      { speaker: 'partner', text: 'Yes. Please come in.', fa: 'بله. لطفاً داخل بیایید.' },
      { speaker: 'learner', text: 'Thank you.', fa: 'ممنون.' },
    ],
  },
  {
    id: 'everyday-facing-a-challenge',
    levelId: 2,
    order: 6,
    title: 'روبه‌رو شدن با یک مشکل',
    subtitle: 'توضیح یک شرایط سخت و درخواست راه‌حل',
    situation: 'در سفر با شرایط سختی روبه‌رو شده‌اید و باید مشکل را واضح توضیح دهید و برای ادامه تصمیم بگیرید.',
    durationMinutes: 12,
    sentences: [
      { id: "challenge-hardship", en: "The bad weather made our trip hard.", fa: "هوای بد سفرمان را سخت کرد.", pronunciation: "ذِ بَد وِذِر مِید آور تریپ هارد.", pattern: "The + noun + made + object + adjective.", vocabulary: [{ word: "bad weather", meaning: "هوای بد" }, { word: "trip", meaning: "سفر" }] },
      { id: "challenge-abandon", en: "We may need to change our plan.", fa: "شاید لازم باشد برنامه‌مان را عوض کنیم.", pronunciation: "وی مِی نید تو چِینج آور پِلَن.", pattern: "We may need to + verb.", vocabulary: [{ word: "change", meaning: "عوض کردن" }, { word: "plan", meaning: "برنامه" }] },
      { id: "challenge-unaccustomed", en: "I am not used to cold weather.", fa: "من به هوای سرد عادت ندارم.", pronunciation: "آی اَم نات یوست تو کُلد وِذِر.", pattern: "I am not used to + noun.", vocabulary: [{ word: "not used to", meaning: "عادت نداشتن به" }, { word: "cold weather", meaning: "هوای سرد" }] },
      { id: "challenge-scarce", en: "There is not much clean water here.", fa: "اینجا آب تمیز زیادی وجود ندارد.", pronunciation: "ذِر ایز نات ماچ کلین واتِر هیر.", pattern: "There is not much + uncountable noun.", vocabulary: [{ word: "clean water", meaning: "آب تمیز" }, { word: "not much", meaning: "نه‌چندان زیاد" }] },
      { id: 'challenge-safe', en: 'We need to find a safe place.', fa: 'باید یک مکان امن پیدا کنیم.', pronunciation: 'وی نید تو فایند اَ سِیف پِلِیس', vocabulary: [{ word: 'safe', meaning: 'امن' }] },
      { id: 'challenge-together', en: 'We can solve this problem together.', fa: 'می‌توانیم این مشکل را با هم حل کنیم.', pronunciation: 'وی کَن سالو ذیس پرابلِم توگِذِر', vocabulary: [{ word: 'together', meaning: 'با هم' }] },
    ],
    dialogue: [
      { speaker: "partner", text: "Do we have enough water?", fa: "آیا آب کافی داریم؟" },
      { speaker: "learner", text: "No, we need more water.", fa: "نه، به آب بیشتری نیاز داریم." },
      { speaker: "partner", text: "Should we change our plan?", fa: "آیا بهتر است برنامه‌مان را عوض کنیم؟" },
      { speaker: "learner", text: "Yes. Let us find a safe place.", fa: "بله. بیایید جای امنی پیدا کنیم." },
      { speaker: "partner", text: "Can I help you?", fa: "می‌توانم کمکت کنم؟" },
      { speaker: "learner", text: "Yes, let us work together.", fa: "بله، بیایید با هم کار کنیم." },
    ],
  },
  {
    id: 'everyday-making-a-plan',
    levelId: 2,
    order: 7,
    title: 'ساختن یک برنامه بهتر',
    subtitle: 'پیشنهاد دادن و قانع‌کردن دیگران',
    situation: 'با دوستان یا همکاران خود درباره یک برنامه صحبت می‌کنید و می‌خواهید یک راه‌حل خوب پیشنهاد دهید.',
    durationMinutes: 12,
    sentences: [
      { id: "plan-essential", en: "A clear plan is very important.", fa: "یک برنامهٔ روشن خیلی مهم است.", pronunciation: "اَ کلیر پِلَن ایز وِری ایمپورتِنت.", pattern: "A + noun + is very + adjective.", vocabulary: [{ word: "clear plan", meaning: "برنامهٔ روشن" }, { word: "important", meaning: "مهم" }] },
      { id: "plan-devise", en: "We need to make a better plan.", fa: "باید برنامهٔ بهتری درست کنیم.", pronunciation: "وی نید تو مِیک اَ بِتِر پِلَن.", pattern: "We need to + verb + object.", vocabulary: [{ word: "make a plan", meaning: "برنامه درست کردن" }, { word: "better", meaning: "بهتر" }] },
      { id: "plan-persuade", en: "I will try to get the team to agree.", fa: "سعی می‌کنم تیم را به موافقت برسانم.", pronunciation: "آی ویل تِرای تو گِت ذِ تیم تو اَگری.", pattern: "I will try to get + person + to + verb.", vocabulary: [{ word: "team", meaning: "تیم" }, { word: "agree", meaning: "موافقت کردن" }] },
      { id: "plan-typical", en: "New teams often have this problem.", fa: "تیم‌های تازه اغلب این مشکل را دارند.", pronunciation: "نیو تیمز آفِن هَو ذیس پرابْلِم.", pattern: "People often have + noun.", vocabulary: [{ word: "new teams", meaning: "تیم‌های تازه" }, { word: "problem", meaning: "مشکل" }] },
      { id: 'plan-share', en: 'Let me share my idea.', fa: 'اجازه دهید ایده‌ام را مطرح کنم.', pronunciation: 'لِت می شِر مای آیدیا', vocabulary: [{ word: 'idea', meaning: 'ایده' }] },
      { id: 'plan-agree', en: 'Do you agree with this plan?', fa: 'آیا با این برنامه موافقید؟', pronunciation: 'دو یو اَگری ویذ ذیس پِلَن؟', vocabulary: [{ word: 'agree', meaning: 'موافق بودن' }] },
    ],
    dialogue: [
      { speaker: "partner", text: "What is your idea?", fa: "ایدهٔ تو چیست؟" },
      { speaker: "learner", text: "We can make a new plan.", fa: "می‌توانیم برنامهٔ تازه‌ای درست کنیم." },
      { speaker: "partner", text: "Why do we need a new plan?", fa: "چرا به برنامهٔ تازه نیاز داریم؟" },
      { speaker: "learner", text: "The old plan did not work.", fa: "برنامهٔ قبلی جواب نداد." },
      { speaker: "partner", text: "Can we talk to the team?", fa: "می‌توانیم با تیم صحبت کنیم؟" },
      { speaker: "learner", text: "Yes, let us talk to them.", fa: "بله، بیایید با آن‌ها صحبت کنیم." },
    ],
  },
];

const ENRICHED_CORE_SENTENCE_LESSONS: SentenceLesson[] = CORE_SENTENCE_LESSONS.map((lesson) => {
  const extension = FOUNDATION_SURVIVAL_EXTENSIONS[lesson.id];
  const completionSentences = FOUNDATION_COMPLETION_SENTENCES[lesson.id] ?? [];
  if (!extension && completionSentences.length === 0) return lesson;

  return {
    ...lesson,
    durationMinutes: extension?.durationMinutes ?? lesson.durationMinutes,
    sentences: [
      ...lesson.sentences.map((sentence) => {
        const pattern = extension?.patterns[sentence.id];
        return sentence.pattern || !pattern ? sentence : { ...sentence, pattern };
      }),
      ...(extension?.sentences ?? []),
      ...completionSentences,
    ],
    dialogue: extension ? [...lesson.dialogue, ...extension.dialogue] : lesson.dialogue,
  };
});

const COMMUNICATION_ORDER_INSERTION_COUNT = COMMUNICATION_NEW_LESSONS.length;

const ORIGINAL_SENTENCE_LESSONS: SentenceLesson[] = [
  ...ENRICHED_CORE_SENTENCE_LESSONS,
  ...EXPANDED_SENTENCE_LESSONS,
  ...ADVANCED_SENTENCE_LESSONS,
  ...ADVANCED_SENTENCE_LESSONS_2,
  ...ADVANCED_SENTENCE_LESSONS_3,
  ...ADVANCED_SENTENCE_LESSONS_4,
  ...ADVANCED_SENTENCE_LESSONS_5,
  ...ADVANCED_SENTENCE_LESSONS_6,
  ...ADVANCED_SENTENCE_LESSONS_7,
  ...FINAL_SENTENCE_LESSONS,
].map(lesson => {
  if (lesson.levelId !== 4) return lesson;
  const contentKind: NonNullable<SentenceLesson['contentKind']> = lesson.id.startsWith('advanced-canonical-practice-')
    ? 'vocabulary-practice'
    : 'scenario';
  return {
    ...lesson,
    contentKind,
    order: lesson.order + COMMUNICATION_ORDER_INSERTION_COUNT,
  };
})
  .concat(COMMUNICATION_NEW_LESSONS)
  .sort((a, b) => a.order - b.order);

/**
 * Foundation remains a ten-lesson, sentence-first course. The seven curated
 * additions follow its original IDs; 17 selected Survival lessons follow the
 * original Survival pair. A separate completion source brings every one of the
 * 19 stable Survival lesson records to exactly fifty linked sentence examples.
 */
export const FOUNDATION_EXPANSION_LESSON_IDS = [
  'foundation-alphabet-and-spelling',
  'foundation-pronouns-and-be',
  'foundation-numbers-and-contact',
  'foundation-family-and-possessions',
  'foundation-time-and-calendar',
  'foundation-everyday-routine',
  'foundation-objects-and-places',
] as const;

const foundationExpansionIds = new Set<string>(FOUNDATION_EXPANSION_LESSON_IDS);
const selectedFoundationLessons = FOUNDATION_SURVIVAL_EXPANSION_LESSONS
  .filter(lesson => foundationExpansionIds.has(lesson.id));
if (selectedFoundationLessons.length !== FOUNDATION_EXPANSION_LESSON_IDS.length) {
  throw new Error('A selected Foundation lesson is missing from its source.');
}

const FOUNDATION_EXPANSION_INSERTION_ORDER = 3;
const FOUNDATION_EXPANSION_LESSONS = selectedFoundationLessons.map((lesson, index) => {
  const completionSentences = FOUNDATION_COMPLETION_SENTENCES[lesson.id] ?? [];
  if (lesson.sentences.length !== 10 || completionSentences.length !== 40) {
    throw new Error(`Foundation lesson ${lesson.id} must have ten prepared and forty completion sentences.`);
  }
  return {
    ...lesson,
    order: FOUNDATION_EXPANSION_INSERTION_ORDER + index + 1,
    durationMinutes: 30,
    sentences: [...lesson.sentences, ...completionSentences],
  };
});

const LESSONS_WITH_FOUNDATION_EXPANSION: SentenceLesson[] = [
  ...ORIGINAL_SENTENCE_LESSONS.map(lesson => lesson.order > FOUNDATION_EXPANSION_INSERTION_ORDER
    ? { ...lesson, order: lesson.order + FOUNDATION_EXPANSION_LESSONS.length }
    : lesson),
  ...FOUNDATION_EXPANSION_LESSONS,
].sort((a, b) => a.order - b.order);

export const SURVIVAL_EXPANSION_LESSON_IDS = [
  'survival-personal-information',
  'survival-directions-and-neighborhood',
  'survival-public-transport',
  'survival-cafe-and-food',
  'survival-shopping-and-clothing',
  'survival-appointments-and-time',
  'survival-health-and-pharmacy',
  'survival-hobbies-and-free-time',
  'survival-invitations-and-plans',
  'survival-weather-and-seasons',
  'survival-travel-and-tickets',
  'survival-hotel-and-stay',
  'survival-phone-and-messages',
  'survival-services-and-post-office',
  'survival-school-and-learning',
  'survival-current-activities',
  'survival-past-and-future-plans',
] as const;

/** Stable lesson order for the fully developed A1/Survival block. */
export const SURVIVAL_COURSE_LESSON_IDS = [
  'survival-job-interview',
  'survival-renting-a-home',
  ...SURVIVAL_EXPANSION_LESSON_IDS,
] as const;

const survivalExpansionIds = new Set<string>(SURVIVAL_EXPANSION_LESSON_IDS);
const selectedSurvivalLessons = FOUNDATION_SURVIVAL_EXPANSION_LESSONS
  .filter(lesson => survivalExpansionIds.has(lesson.id));
if (selectedSurvivalLessons.length !== SURVIVAL_EXPANSION_LESSON_IDS.length) {
  throw new Error('A selected Survival expansion lesson is missing from its source.');
}

const SURVIVAL_EXPANSION_INSERTION_ORDER = 12;
const SURVIVAL_EXPANSION_LESSONS = selectedSurvivalLessons.map((lesson, index) => ({
  ...lesson,
  order: SURVIVAL_EXPANSION_INSERTION_ORDER + index + 1,
  durationMinutes: 20,
}));

const LESSONS_WITH_SURVIVAL_EXPANSION: SentenceLesson[] = [
  ...LESSONS_WITH_FOUNDATION_EXPANSION.map(lesson => lesson.order > SURVIVAL_EXPANSION_INSERTION_ORDER
    ? { ...lesson, order: lesson.order + SURVIVAL_EXPANSION_LESSONS.length }
    : lesson),
  ...SURVIVAL_EXPANSION_LESSONS,
].sort((a, b) => a.order - b.order);

/** Fifteen new A2–B1 Everyday English lessons follow the five previously published lessons. */
export const EVERYDAY_EXPANSION_LESSON_IDS = [
  'everyday-managing-a-busy-day',
  'everyday-keeping-in-touch',
  'everyday-sharing-an-experience',
  'everyday-comparing-choices',
  'everyday-cooking-at-home',
  'everyday-shopping-returns',
  'everyday-money-and-budget',
  'everyday-teamwork-at-work',
  'everyday-study-and-projects',
  'everyday-healthy-habits',
  'everyday-travel-changes',
  'everyday-email-and-messages',
  'everyday-sharing-a-home',
  'everyday-making-a-complaint',
  'everyday-sharing-opinions',
] as const;

/** Stable sequence of all twenty published Everyday English lessons. */
export const EVERYDAY_COURSE_LESSON_IDS = [
  'everyday-facing-a-challenge',
  'everyday-making-a-plan',
  'everyday-handling-a-misunderstanding',
  'everyday-talking-about-weather',
  'everyday-handling-an-emergency',
  ...EVERYDAY_EXPANSION_LESSON_IDS,
] as const;

const everydayExpansionIds = new Set<string>(EVERYDAY_EXPANSION_LESSON_IDS);
const selectedEverydayLessons = EVERYDAY_EXPANSION_LESSONS
  .filter(lesson => everydayExpansionIds.has(lesson.id));
if (selectedEverydayLessons.length !== EVERYDAY_EXPANSION_LESSON_IDS.length) {
  throw new Error('A selected Everyday English expansion lesson is missing from its source.');
}

const EVERYDAY_EXPANSION_INSERTION_ORDER = 34;
const EVERYDAY_EXPANSION_INSERTION_LESSONS = selectedEverydayLessons.map((lesson, index) => ({
  ...lesson,
  order: EVERYDAY_EXPANSION_INSERTION_ORDER + index + 1,
  durationMinutes: 20,
}));

const COURSE_LESSONS_BEFORE_SURVIVAL_COMPLETION: SentenceLesson[] = [
  ...LESSONS_WITH_SURVIVAL_EXPANSION.map(lesson => lesson.order > EVERYDAY_EXPANSION_INSERTION_ORDER
    ? { ...lesson, order: lesson.order + EVERYDAY_EXPANSION_INSERTION_LESSONS.length }
    : lesson),
  ...EVERYDAY_EXPANSION_INSERTION_LESSONS,
].sort((a, b) => a.order - b.order);

const survivalLessonIds = new Set<string>(SURVIVAL_COURSE_LESSON_IDS);
const survivalLessonsBeforeCompletion = COURSE_LESSONS_BEFORE_SURVIVAL_COMPLETION.filter(lesson => lesson.levelId === 1);
const survivalCompletionIds = Object.keys(SURVIVAL_COMPLETION_SENTENCES);
if (survivalLessonsBeforeCompletion.map(lesson => lesson.id).join('|') !== SURVIVAL_COURSE_LESSON_IDS.join('|')
  || survivalCompletionIds.length !== SURVIVAL_COURSE_LESSON_IDS.length
  || survivalCompletionIds.some(id => !survivalLessonIds.has(id))) {
  throw new Error('The Survival completion data must match the stable 19-lesson A1 course order.');
}

const communicationLessonsBeforeCompletion = COURSE_LESSONS_BEFORE_SURVIVAL_COMPLETION.filter(lesson => lesson.levelId === 3);
const communicationCompletionIds = Object.keys(COMMUNICATION_COMPLETION_SENTENCES);
if (communicationLessonsBeforeCompletion.map(lesson => lesson.id).join('|') !== COMMUNICATION_COURSE_LESSON_IDS.join('|')
  || communicationCompletionIds.length !== COMMUNICATION_COURSE_LESSON_IDS.length
  || communicationCompletionIds.some(id => !COMMUNICATION_COURSE_LESSON_IDS.includes(id as typeof COMMUNICATION_COURSE_LESSON_IDS[number]))) {
  throw new Error('The Communication completion data must match the stable fifteen-lesson course order.');
}

const everydayLessonsBeforeCompletion = COURSE_LESSONS_BEFORE_SURVIVAL_COMPLETION.filter(lesson => lesson.levelId === 2);
const everydayCompletionIds = Object.keys(EVERYDAY_COMPLETION_SENTENCES);
if (everydayLessonsBeforeCompletion.map(lesson => lesson.id).join('|') !== EVERYDAY_COURSE_LESSON_IDS.join('|')
  || everydayCompletionIds.length !== EVERYDAY_COURSE_LESSON_IDS.length
  || everydayCompletionIds.some(id => !EVERYDAY_COURSE_LESSON_IDS.includes(id as typeof EVERYDAY_COURSE_LESSON_IDS[number]))) {
  throw new Error('The Everyday completion data must match the stable 20-lesson course order.');
}
const originalEverydayLessonIds = new Set<string>(EVERYDAY_COURSE_LESSON_IDS.slice(0, 5));

export const EXISTING_SENTENCE_LESSONS: SentenceLesson[] = COURSE_LESSONS_BEFORE_SURVIVAL_COMPLETION.map(lesson => {
  if (lesson.levelId === 3) {
    const additions = COMMUNICATION_COMPLETION_SENTENCES[lesson.id as keyof typeof COMMUNICATION_COMPLETION_SENTENCES];
    if (!additions || lesson.sentences.length !== 6 || additions.length !== 44) {
      throw new Error(`Communication lesson ${lesson.id} must preserve its six prepared examples and add forty-four.`);
    }
    if (additions.some(sentence => !sentence.en || !sentence.fa || !sentence.pronunciation
      || !sentence.pattern || sentence.vocabulary.length < 2
      || sentence.vocabulary.some(({ word, meaning }) => !word || !meaning || !sentence.en.toLowerCase().includes(word.toLowerCase())))) {
      throw new Error(`Communication completion sentences for ${lesson.id} must include translations, pronunciation, patterns, and sentence-linked vocabulary.`);
    }

    const sentences = [...lesson.sentences, ...additions];
    const normalizedExamples = sentences.map(sentence => sentence.en.trim().toLowerCase()
      .replace(/[.!?]+$/g, '').replace(/[’']/g, "'").replace(/\s+/g, ' '));
    if (sentences.length !== 50
      || new Set(sentences.map(sentence => sentence.id)).size !== 50
      || new Set(normalizedExamples).size !== 50) {
      throw new Error(`Communication lesson ${lesson.id} must have fifty unique sentence IDs and examples.`);
    }

    const unit = COMMUNICATION_LESSON_UNIT[lesson.id];
    if (!unit) throw new Error(`Communication lesson ${lesson.id} is missing its thematic unit.`);
    return {
      ...lesson,
      durationMinutes: 35,
      unitId: unit.unitId,
      unitTitle: unit.unitTitleFa,
      unitTitleEn: unit.unitTitleEn,
      sentences,
    };
  }

  if (lesson.levelId === 2) {
    const additions = EVERYDAY_COMPLETION_SENTENCES[lesson.id as keyof typeof EVERYDAY_COMPLETION_SENTENCES];
    const expectedBaseCount = originalEverydayLessonIds.has(lesson.id) ? 6 : 10;
    if (!additions || lesson.sentences.length !== expectedBaseCount || additions.length !== 50 - expectedBaseCount) {
      throw new Error(`Everyday lesson ${lesson.id} must preserve its prepared examples and add enough to reach fifty.`);
    }
    if (additions.some(sentence => !sentence.en || !sentence.fa || !sentence.pronunciation
      || !sentence.pattern || sentence.vocabulary.length < 2
      || sentence.vocabulary.some(({ word, meaning }) => !word || !meaning || !sentence.en.toLowerCase().includes(word.toLowerCase())))) {
      throw new Error(`Everyday completion sentences for ${lesson.id} must include translations, pronunciation, patterns, and sentence-linked vocabulary.`);
    }

    const sentences = [...lesson.sentences, ...additions];
    const normalizedExamples = sentences.map(sentence => sentence.en.trim().toLowerCase()
      .replace(/[.!?]+$/g, '').replace(/[’']/g, "'").replace(/\s+/g, ' '));
    if (new Set(sentences.map(sentence => sentence.id)).size !== 50
      || new Set(normalizedExamples).size !== 50) {
      throw new Error(`Everyday lesson ${lesson.id} must have fifty unique sentence IDs and examples.`);
    }

    return { ...lesson, durationMinutes: 35, sentences };
  }

  if (lesson.levelId !== 1) return lesson;

  const additions = SURVIVAL_COMPLETION_SENTENCES[lesson.id];
  if (!additions || lesson.sentences.length + additions.length !== 50) {
    throw new Error(`Survival lesson ${lesson.id} must contain exactly fifty sentence examples.`);
  }
  if (additions.some(sentence => !sentence.en || !sentence.fa || !sentence.pronunciation
    || !sentence.pattern || sentence.vocabulary.length === 0)) {
    throw new Error(`Survival completion sentences for ${lesson.id} must include translation, pronunciation, pattern, and linked vocabulary.`);
  }

  const sentences = [...lesson.sentences, ...additions];
  if (new Set(sentences.map(sentence => sentence.id)).size !== 50
    || new Set(sentences.map(sentence => sentence.en.trim().toLowerCase())).size !== 50) {
    throw new Error(`Survival lesson ${lesson.id} must have fifty unique sentence IDs and examples.`);
  }

  return { ...lesson, durationMinutes: 35, sentences };
});

// Keep the old IDs and examples while placing the A2 bridge first. The five
// original situation lessons remain accessible after the everyday scenarios.
const previousA2Lessons = EXISTING_SENTENCE_LESSONS.filter(lesson => lesson.levelId === 2);
const arrangedBeforeB1 = [
  ...EXISTING_SENTENCE_LESSONS.filter(lesson => lesson.levelId < 2),
  ...A2_FOUNDATION_LESSONS,
  ...previousA2Lessons.slice(5).map(lesson => ({ ...lesson, a2Section: 'survival' as const })),
  ...previousA2Lessons.slice(0, 5).map(lesson => ({ ...lesson, a2Section: 'legacy' as const })),
  ...EXISTING_SENTENCE_LESSONS.filter(lesson => lesson.levelId > 2),
];
const advancedStart = arrangedBeforeB1.findIndex(lesson => lesson.levelId === 4);
if (advancedStart < 0) throw new Error('Advanced lesson boundary is missing.');
export const SENTENCE_LESSONS: SentenceLesson[] = [
  ...arrangedBeforeB1.slice(0, advancedStart),
  ...B1_INDEPENDENT_LESSONS,
  ...B2_UPPER_INTERMEDIATE_LESSONS,
  ...arrangedBeforeB1.slice(advancedStart),
  ...C1_ADVANCED_LESSONS,
].map((lesson, index) => ({ ...lesson, order: index + 1 }));

export const getSentenceLesson = (id: string) => SENTENCE_LESSONS.find((lesson) => lesson.id === id);
