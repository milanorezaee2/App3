import type { CourseLanguage } from '@/lib/content/readiness';

/**
 * Reusable «word-study» frames for the coverage generator.
 *
 * Every frame treats the gap words as words the learner is meeting, writing down, hearing or
 * revising. That is honest and grammatical for nouns, verbs, adjectives, names and even
 * abbreviations alike — unlike stuffing random gap words into unrelated sentences. Frames are
 * rotated and filtered by the band's vocabulary ceiling before a pack is written.
 */
export interface CoverageTemplate {
  slots: 1 | 2 | 3;
  text: string;   // {LIST} = «word»، «word» و «word»
  fa: string;     // Persian translation, with the same quoted words
  pattern: string; // {PATTERN} = <W1>, <W2> und <W3>
}

const CONJ: Record<CourseLanguage, string> = {
  en: 'and', de: 'und', fr: 'et', es: 'y', tr: 've', ru: 'и',
};

export function listText(lang: CourseLanguage, words: readonly string[]): string {
  const q = words.map(w => `«${w}»`);
  if (q.length === 1) return q[0];
  if (q.length === 2) return `${q[0]} ${CONJ[lang]} ${q[1]}`;
  return `${q.slice(0, -1).join(', ')} ${CONJ[lang]} ${q[q.length - 1]}`;
}
export function listFa(words: readonly string[]): string {
  const q = words.map(w => `«${w}»`);
  if (q.length === 1) return q[0];
  if (q.length === 2) return `${q[0]} و ${q[1]}`;
  return `${q.slice(0, -1).join('، ')} و ${q[q.length - 1]}`;
}
export function patternList(lang: CourseLanguage, count: number): string {
  const p = Array.from({ length: count }, (_, i) => `<W${i + 1}>`);
  if (p.length === 1) return p[0];
  if (p.length === 2) return `${p[0]} ${CONJ[lang]} ${p[1]}`;
  return `${p.slice(0, -1).join(', ')} ${CONJ[lang]} ${p[p.length - 1]}`;
}

const T = (slots: 1 | 2 | 3, text: string, fa: string, pattern: string): CoverageTemplate => ({ slots, text, fa, pattern });

export const COVERAGE_TEMPLATES: Record<CourseLanguage, CoverageTemplate[]> = {
  en: [
    T(1, 'This is {LIST}.', 'این {LIST} است.', 'This is {PATTERN}.'),
    T(1, 'I have {LIST} here.', 'من {LIST} را اینجا دارم.', 'I have {PATTERN} here.'),
    T(1, 'We need {LIST} today.', 'امروز به {LIST} نیاز داریم.', 'We need {PATTERN} today.'),
    T(1, 'I can understand {LIST} better now.', 'اکنون {LIST} را بهتر میفهمم.', 'I can understand {PATTERN} better now.'),
    T(2, 'These are {LIST}.', 'اینها {LIST} هستند.', 'These are {PATTERN}.'),
    T(2, 'We have {LIST} here.', 'ما {LIST} را اینجا داریم.', 'We have {PATTERN} here.'),
    T(2, 'I saw {LIST} in the text.', 'من {LIST} را در متن دیدم.', 'I saw {PATTERN} in the text.'),
    T(2, 'The teacher explains {LIST} again.', 'معلم دوباره {LIST} را توضیح میدهد.', 'The teacher explains {PATTERN} again.'),
    T(3, 'I can understand {LIST} better now.', 'اکنون {LIST} را بهتر میفهمم.', 'I can understand {PATTERN} better now.'),
    T(3, 'We saw {LIST} in the text today.', 'امروز {LIST} را در متن دیدیم.', 'We saw {PATTERN} in the text today.'),
    T(3, 'My friend asks about {LIST}.', 'دوستم دربارهٔ {LIST} میپرسد.', 'My friend asks about {PATTERN}.'),
    T(3, 'I wrote {LIST} in the text.', 'من {LIST} را در متن نوشتم.', 'I wrote {PATTERN} in the text.'),
  ],
  de: [
    T(1, 'Das ist {LIST}.', 'این {LIST} است.', 'Das ist {PATTERN}.'),
    T(1, 'Ich habe {LIST} hier.', 'من {LIST} را اینجا دارم.', 'Ich habe {PATTERN} hier.'),
    T(1, 'Heute sehe ich {LIST}.', 'امروز {LIST} را میبینم.', 'Heute sehe ich {PATTERN}.'),
    T(1, 'Ich verstehe {LIST} jetzt besser.', 'اکنون {LIST} را بهتر میفهمم.', 'Ich verstehe {PATTERN} jetzt besser.'),
    T(2, 'Das sind {LIST}.', 'اینها {LIST} هستند.', 'Das sind {PATTERN}.'),
    T(2, 'Wir haben {LIST} hier.', 'ما {LIST} را اینجا داریم.', 'Wir haben {PATTERN} hier.'),
    T(2, 'Der Lehrer erklärt {LIST} noch einmal.', 'معلم دوباره {LIST} را توضیح میدهد.', 'Der Lehrer erklärt {PATTERN} noch einmal.'),
    T(2, 'Im Text stehen {LIST}.', 'در متن {LIST} آمده است.', 'Im Text stehen {PATTERN}.'),
    T(3, 'Ich habe {LIST} geschrieben.', 'من {LIST} را نوشتم.', 'Ich habe {PATTERN} geschrieben.'),
    T(3, 'Wir haben {LIST} im Text gelesen.', 'ما {LIST} را در متن خواندیم.', 'Wir haben {PATTERN} im Text gelesen.'),
    T(3, 'Der Lehrer erklärt {LIST} noch einmal.', 'معلم دوباره {LIST} را توضیح میدهد.', 'Der Lehrer erklärt {PATTERN} noch einmal.'),
    T(3, 'Ich kann {LIST} jetzt besser verstehen.', 'اکنون {LIST} را بهتر میفهمم.', 'Ich kann {PATTERN} jetzt besser verstehen.'),
  ],
  fr: [
    T(1, "C'est {LIST}.", 'این {LIST} است.', "C'est {PATTERN}."),
    T(1, "J'ai {LIST} ici.", 'من {LIST} را اینجا دارم.', "J'ai {PATTERN} ici."),
    T(1, 'Je vois {LIST}.', 'من {LIST} را میبینم.', 'Je vois {PATTERN}.'),
    T(1, 'Je peux mieux comprendre {LIST}.', 'میتوانم {LIST} را بهتر بفهمم.', 'Je peux mieux comprendre {PATTERN}.'),
    T(2, 'Ce sont {LIST}.', 'اینها {LIST} هستند.', 'Ce sont {PATTERN}.'),
    T(2, 'Nous avons {LIST} ici.', 'ما {LIST} را اینجا داریم.', 'Nous avons {PATTERN} ici.'),
    T(2, 'Le professeur explique {LIST} encore.', 'معلم باز هم {LIST} را توضیح میدهد.', 'Le professeur explique {PATTERN} encore.'),
    T(2, 'Dans le texte, on voit {LIST}.', 'در متن {LIST} دیده میشود.', 'Dans le texte, on voit {PATTERN}.'),
    T(3, "J'ai vu {LIST} dans le texte.", 'من {LIST} را در متن دیدم.', "J'ai vu {PATTERN} dans le texte."),
    T(3, 'Le professeur explique {LIST} encore une fois.', 'معلم یک بار دیگر {LIST} را توضیح میدهد.', 'Le professeur explique {PATTERN} encore une fois.'),
    T(3, 'Je peux maintenant mieux comprendre {LIST}.', 'اکنون میتوانم {LIST} را بهتر بفهمم.', 'Je peux maintenant mieux comprendre {PATTERN}.'),
    T(3, 'Nous avons lu {LIST} dans le texte.', 'ما {LIST} را در متن خواندیم.', 'Nous avons lu {PATTERN} dans le texte.'),
  ],
  es: [
    T(1, 'Esto es {LIST}.', 'این {LIST} است.', 'Esto es {PATTERN}.'),
    T(1, 'Aquí está {LIST}.', 'اینجا {LIST} هست.', 'Aquí está {PATTERN}.'),
    T(1, 'Hoy veo {LIST}.', 'امروز {LIST} را میبینم.', 'Hoy veo {PATTERN}.'),
    T(1, 'Puedo entender mejor {LIST}.', 'میتوانم {LIST} را بهتر بفهمم.', 'Puedo entender mejor {PATTERN}.'),
    T(2, 'Estos son {LIST}.', 'اینها {LIST} هستند.', 'Estos son {PATTERN}.'),
    T(2, 'Aquí están {LIST}.', 'اینجا {LIST} هستند.', 'Aquí están {PATTERN}.'),
    T(2, 'El profesor explica {LIST} otra vez.', 'معلم دوباره {LIST} را توضیح میدهد.', 'El profesor explica {PATTERN} otra vez.'),
    T(2, 'En el texto veo {LIST}.', 'در متن {LIST} را میبینم.', 'En el texto veo {PATTERN}.'),
    T(3, 'He visto {LIST} en el texto.', 'من {LIST} را در متن دیدم.', 'He visto {PATTERN} en el texto.'),
    T(3, 'El profesor explica {LIST} otra vez.', 'معلم دوباره {LIST} را توضیح میدهد.', 'El profesor explica {PATTERN} otra vez.'),
    T(3, 'Puedo ahora entender mejor {LIST}.', 'اکنون میتوانم {LIST} را بهتر بفهمم.', 'Puedo ahora entender mejor {PATTERN}.'),
    T(3, 'Hemos visto {LIST} en el texto.', 'ما {LIST} را در متن دیدیم.', 'Hemos visto {PATTERN} en el texto.'),
  ],
  tr: [
    T(1, 'Bu {LIST} var.', 'این {LIST} وجود دارد.', 'Bu {PATTERN} var.'),
    T(1, 'Bugün {LIST} var.', 'امروز {LIST} وجود دارد.', 'Bugün {PATTERN} var.'),
    T(1, '{LIST} burada var.', '{LIST} اینجا هست.', '{PATTERN} burada var.'),
    T(1, 'Ben {LIST} istiyorum.', 'من {LIST} را میخواهم.', 'Ben {PATTERN} istiyorum.'),
    T(2, 'Bu {LIST} var.', 'این {LIST} وجود دارند.', 'Bu {PATTERN} var.'),
    T(2, 'Bugün {LIST} önemli.', 'امروز {LIST} مهماند.', 'Bugün {PATTERN} önemli.'),
    T(2, 'Şimdi {LIST} daha iyi.', 'اکنون {LIST} بهتراند.', 'Şimdi {PATTERN} daha iyi.'),
    T(2, 'Yarın {LIST} tekrar var.', 'فردا دوباره {LIST} وجود دارند.', 'Yarın {PATTERN} tekrar var.'),
    T(3, 'Bugün {LIST} yazdım.', 'امروز {LIST} را نوشتم.', 'Bugün {PATTERN} yazdım.'),
    T(3, 'Bu metinde {LIST} var.', 'در این متن {LIST} وجود دارد.', 'Bu metinde {PATTERN} var.'),
    T(3, 'Şimdi {LIST} daha iyi anlıyorum.', 'اکنون {LIST} را بهتر میفهمم.', 'Şimdi {PATTERN} daha iyi anlıyorum.'),
    T(3, 'Yarın {LIST} tekrar var.', 'فردا دوباره {LIST} وجود دارند.', 'Yarın {PATTERN} tekrar var.'),
  ],
  ru: [
    T(1, 'Вот и {LIST}.', 'این هم {LIST}.', 'Вот и {PATTERN}.'),
    T(1, 'У меня есть {LIST}.', 'من {LIST} را دارم.', 'У меня есть {PATTERN}.'),
    T(1, 'Я хочу {LIST}.', 'من {LIST} را میخواهم.', 'Я хочу {PATTERN}.'),
    T(1, 'Он сказал {LIST}.', 'او {LIST} را گفت.', 'Он сказал {PATTERN}.'),
    T(2, 'Тут есть {LIST}.', 'اینجا {LIST} هستند.', 'Тут есть {PATTERN}.'),
    T(2, 'Это слова {LIST}.', 'این واژهها {LIST} هستند.', 'Это слова {PATTERN}.'),
    T(2, 'Можно {LIST}?', 'آیا {LIST} ممکن است؟', 'Можно {PATTERN}?'),
    T(2, 'Нужно {LIST}.', 'به {LIST} نیاز است.', 'Нужно {PATTERN}.'),
    T(3, 'Сегодня я вижу {LIST}.', 'امروز {LIST} را میبینم.', 'Сегодня я вижу {PATTERN}.'),
    T(3, 'Я знаю {LIST} сейчас.', 'اکنون {LIST} را میدانم.', 'Я знаю {PATTERN} сейчас.'),
    T(3, 'Он говорит {LIST} ещё раз.', 'او دوباره {LIST} را میگوید.', 'Он говорит {PATTERN} ещё раз.'),
    T(3, 'Все {LIST} уже знают.', 'همه {LIST} را از پیش میدانند.', 'Все {PATTERN} уже знают.'),
  ],
};
