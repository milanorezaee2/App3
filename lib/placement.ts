export type PlacementLanguage = 'en';

export type PlacementQuestion = {
  id: string;
  language: PlacementLanguage;
  levelId: number;
  sourceLessonId: string;
  dimension: 'meaning' | 'detail' | 'inference';
  passage: string;
  prompt: string;
  choices: readonly string[];
  answerIndex: number;
};

export type PlacementLevelScore = {
  levelId: number;
  correct: number;
  total: number;
  meetsScreeningThreshold: boolean;
};

export type PlacementResult = {
  language: PlacementLanguage;
  questionCount: number;
  correctCount: number;
  answeredCount: number;
  unknownCount: number;
  recommendedLevelId: number;
  perLevel: PlacementLevelScore[];
  nonMonotonicPattern: boolean;
};

/**
 * Short, offline reading-and-meaning screen built from lessons already in the
 * course. It does not claim CEFR certification or test listening/speaking/writing.
 */
export const PLACEMENT_QUESTION_BANK: Record<PlacementLanguage, readonly PlacementQuestion[]> = {
  en: [
    {
      id: 'en-a1-introducing', language: 'en', levelId: 0, sourceLessonId: 'foundation-introducing-yourself', dimension: 'meaning',
      passage: 'Tom can talk about introducing people and saying who they are in a group discussion.', prompt: 'این جمله دربارهٔ چیست؟',
      choices: ['خرید و پرداخت در فروشگاه', 'معرفی افراد و گفتن اینکه چه کسی هستند', 'توصیف آب‌وهوای امروز'], answerIndex: 1,
    },
    {
      id: 'en-a1-greetings', language: 'en', levelId: 0, sourceLessonId: 'foundation-asking-for-help', dimension: 'meaning',
      passage: 'This sentence is about saying hello, asking how people are, and saying goodbye.', prompt: 'موضوع این جمله کدام است؟',
      choices: ['پرسیدن قیمت یک کالا', 'گفتن شمارهٔ تلفن', 'سلام، احوال‌پرسی و خداحافظی'], answerIndex: 2,
    },
    {
      id: 'en-a1-naming', language: 'en', levelId: 0, sourceLessonId: 'foundation-buying-something', dimension: 'detail',
      passage: 'We practice naming people and things around us at school today.', prompt: 'آن‌ها امروز در مدرسه چه تمرین می‌کنند؟',
      choices: ['نام بردن و شناسایی اشخاص و اشیا', 'خرید بلیت قطار', 'نوشتن یک ایمیل رسمی'], answerIndex: 0,
    },
    {
      id: 'en-a2-hardship', language: 'en', levelId: 1, sourceLessonId: 'everyday-facing-a-challenge', dimension: 'meaning',
      passage: 'While we were talking about describing daily habits and routines in detail in the evening, Mia used the word "hardship" in a clear and natural example.', prompt: 'واژهٔ hardship چه معنایی دارد؟',
      choices: ['رها کردن', 'سختی و دشواری', 'منحصربه‌فرد بودن'], answerIndex: 1,
    },
    {
      id: 'en-a2-essential', language: 'en', levelId: 1, sourceLessonId: 'everyday-making-a-plan', dimension: 'meaning',
      passage: 'While we were talking about describing temporary activities and current projects on Monday, David used the word "essential" in a clear and natural example.', prompt: 'واژهٔ essential چه معنایی دارد؟',
      choices: ['طراحی کردن', 'دچار حسادت', 'ضروری'], answerIndex: 2,
    },
    {
      id: 'en-a2-jealous', language: 'en', levelId: 1, sourceLessonId: 'everyday-handling-a-misunderstanding', dimension: 'meaning',
      passage: 'While we were talking about homes, cities, and neighbourhoods after lunch, Emma used the word "jealous" in a clear and natural example.', prompt: 'واژهٔ jealous چه معنایی دارد؟',
      choices: ['حسود / دچار حسادت', 'محوطهٔ دانشگاه', 'ملاحظه در برخورد'], answerIndex: 0,
    },
    {
      id: 'en-b1-campus', language: 'en', levelId: 2, sourceLessonId: 'communication-university-discussion', dimension: 'meaning',
      passage: 'While we were talking about narrating past events in a clear sequence every morning, Lena used the word "campus" in a clear and natural example.', prompt: 'واژهٔ campus چه معنایی دارد؟',
      choices: ['اکثریت', 'رویکرد', 'محوطهٔ دانشگاه'], answerIndex: 2,
    },
    {
      id: 'en-b1-approach', language: 'en', levelId: 2, sourceLessonId: 'communication-working-with-a-client', dimension: 'meaning',
      passage: 'While we were talking about sharing memories and personal experiences in detail today, Ali used the word "approach" in a clear and natural example.', prompt: 'واژهٔ approach چه معنایی دارد؟',
      choices: ['رویکرد / روش برخورد', 'کارمند', 'غفلت'], answerIndex: 0,
    },
    {
      id: 'en-b1-detect', language: 'en', levelId: 2, sourceLessonId: 'communication-health-checkup', dimension: 'meaning',
      passage: 'While we were talking about telling a true or imaginary story right now, Anna used the word "detect" in a clear and natural example.', prompt: 'واژهٔ detect چه معنایی دارد؟',
      choices: ['نادیده گرفتن', 'تشخیص دادن / کشف کردن', 'ساکن شدن'], answerIndex: 1,
    },
    {
      id: 'en-b2-massive', language: 'en', levelId: 3, sourceLessonId: 'advanced-planning-an-outdoor-event', dimension: 'meaning',
      passage: 'While we were talking about building a clear, step-by-step argument this week, Tom used the word "massive" in a clear and natural example.', prompt: 'واژهٔ massive چه معنایی دارد؟',
      choices: ['تازه‌کار', 'بسیار بزرگ / عظیم', 'متوسط'], answerIndex: 1,
    },
    {
      id: 'en-b2-mediocre', language: 'en', levelId: 3, sourceLessonId: 'advanced-developing-a-skill', dimension: 'meaning',
      passage: 'While we were talking about defending a position with reasons and evidence at the weekend, Sara used the word "mediocre" in a clear and natural example.', prompt: 'واژهٔ mediocre چه معنایی دارد؟',
      choices: ['پخش و منتشر شدن', 'بسیار بزرگ', 'متوسط / نه‌چندان خوب'], answerIndex: 2,
    },
    {
      id: 'en-b2-circulate', language: 'en', levelId: 3, sourceLessonId: 'advanced-discussing-a-rumor', dimension: 'meaning',
      passage: 'While we were talking about analysing advantages, disadvantages, and consequences today, Ali used the word "circulate" in a clear and natural example.', prompt: 'واژهٔ circulate چه معنایی دارد؟',
      choices: ['پخش و منتشر شدن', 'اغراق کردن', 'منصوب کردن'], answerIndex: 0,
    },
    {
      id: 'en-c1-adolescent', language: 'en', levelId: 4, sourceLessonId: 'advanced-building-healthy-digital-habits', dimension: 'meaning',
      passage: 'While we were talking about expressing complex and abstract ideas with precision this week, Tom used the word "adolescent" in a clear and natural example.', prompt: 'واژهٔ adolescent چه معنایی دارد؟',
      choices: ['طعمه', 'نوجوان', 'نامزد'], answerIndex: 1,
    },
    {
      id: 'en-c1-candidate', language: 'en', levelId: 4, sourceLessonId: 'advanced-selecting-a-team-leader', dimension: 'meaning',
      passage: 'While we were talking about building multi-layered arguments and critical analysis every morning, Lena used the word "candidate" in a clear and natural example.', prompt: 'واژهٔ candidate چه معنایی دارد؟',
      choices: ['منصوب کردن', 'طعمه', 'نامزد'], answerIndex: 2,
    },
    {
      id: 'en-c1-bait', language: 'en', levelId: 4, sourceLessonId: 'advanced-preparing-for-a-fishing-trip', dimension: 'meaning',
      passage: 'While we were talking about evaluating the credibility of claims and evidence after lunch, Emma used the word "bait" in a clear and natural example.', prompt: 'واژهٔ bait چه معنایی دارد؟',
      choices: ['طعمه', 'با اشاره فراخواندن', 'نوجوان'], answerIndex: 0,
    },
    {
      id: 'en-c2-depict', language: 'en', levelId: 5, sourceLessonId: 'advanced-canonical-practice-94', dimension: 'meaning',
      passage: 'While we were talking about expressing highly complex and abstract ideas exactly in the evening, Mia used the word "depict" in a clear and natural example.', prompt: 'واژهٔ depict چه معنایی دارد؟',
      choices: ['تکرار', 'ساکن', 'تصویر کردن / شرح دادن'], answerIndex: 2,
    },
    {
      id: 'en-c2-occupant', language: 'en', levelId: 5, sourceLessonId: 'advanced-canonical-practice-95', dimension: 'meaning',
      passage: 'While we were talking about analysing contradictions and paradoxes right now, Anna used the word "occupant" in a clear and natural example.', prompt: 'واژهٔ occupant چه معنایی دارد؟',
      choices: ['ساکن / مقیم', 'بیت شعر', 'اخلاقیات'], answerIndex: 0,
    },
    {
      id: 'en-c2-verse', language: 'en', levelId: 5, sourceLessonId: 'advanced-canonical-practice-96', dimension: 'meaning',
      passage: 'While we were talking about conveying fine nuances of meaning and rhetoric at the weekend, Sara used the word "verse" in a clear and natural example.', prompt: 'واژهٔ verse چه معنایی دارد؟',
      choices: ['اخلاقیات', 'بیت / شعر', 'تکرار'], answerIndex: 1,
    },
  ],
};

export function getPlacementQuestions(language: PlacementLanguage): readonly PlacementQuestion[] {
  return PLACEMENT_QUESTION_BANK[language];
}

export function scorePlacement(language: PlacementLanguage, answers: Readonly<Record<string, number>>): PlacementResult {
  const questions = getPlacementQuestions(language);
  const questionIds = new Set(questions.map(question => question.id));
  for (const [questionId, choiceIndex] of Object.entries(answers)) {
    if (!questionIds.has(questionId)) throw new Error(`Unknown placement question: ${questionId}`);
    if (!Number.isInteger(choiceIndex) || choiceIndex < -1 || choiceIndex >= questions.find(question => question.id === questionId)!.choices.length) {
      throw new Error(`Invalid placement answer for: ${questionId}`);
    }
  }

  const levelIds = [...new Set(questions.map(question => question.levelId))].sort((left, right) => left - right);
  const perLevel = levelIds.map(levelId => {
    const levelQuestions = questions.filter(question => question.levelId === levelId);
    const correct = levelQuestions.filter(question => answers[question.id] === question.answerIndex).length;
    return { levelId, correct, total: levelQuestions.length, meetsScreeningThreshold: correct >= Math.ceil(levelQuestions.length * (2 / 3)) };
  });
  const maxLevelId = levelIds[levelIds.length - 1] ?? 0;
  let recommendedLevelId = levelIds[0] ?? 0;
  for (const level of perLevel) {
    if (!level.meetsScreeningThreshold) {
      recommendedLevelId = level.levelId;
      break;
    }
    recommendedLevelId = Math.min(level.levelId + 1, maxLevelId);
  }

  return {
    language,
    questionCount: questions.length,
    correctCount: questions.filter(question => answers[question.id] === question.answerIndex).length,
    answeredCount: questions.filter(question => Object.prototype.hasOwnProperty.call(answers, question.id) && answers[question.id] !== -1).length,
    unknownCount: questions.filter(question => answers[question.id] === -1).length,
    recommendedLevelId,
    perLevel,
    nonMonotonicPattern: perLevel.some((level, index) => !level.meetsScreeningThreshold && perLevel.slice(index + 1).some(later => later.meetsScreeningThreshold)),
  };
}
