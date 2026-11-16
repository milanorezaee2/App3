import type { CourseLanguage } from '@/lib/content/readiness';

/**
 * Reviewed «word-study» frames for the coverage generator (revision 3).
 *
 * Every frame treats the gap words as words a learner meets, reads, writes, hears or revises.
 * That is grammatical for nouns, verbs, adjectives, names and abbreviations alike — unlike
 * stuffing unrelated gap words into a sentence. All 72 frames below were reviewed line by line
 * in Persian and in the target language; see `docs/native-review.md` for the corrections.
 *
 * Frames are rotated and filtered by the band's vocabulary ceiling before a pack is written.
 */
export interface CoverageTemplate {
  slots: 1 | 2 | 3;
  text: string;    // {LIST} = «word»، «word» و «word»
  fa: string;      // Persian translation, with the same quoted words
  pattern: string; // {PATTERN} = <W1>, <W2> und <W3>
}

/** Provenance string written into every generated pack. */
export const REVIEW_NOTE = 'factory v3 · hand-drafted lines: 10% sample review · generated lines: 100% linguistic review (72 reviewed frames + every line) · automatic gates · human native sign-off unavailable in this environment';

const CONJ: Record<CourseLanguage, string> = {
  en: 'and', de: 'und', fr: 'et', es: 'y', tr: 've', ru: 'и',
};

/** Spanish `y` becomes `e` before an /i/ (or /hi/) sound; the same rule applies inside the list. */
export function conjFor(lang: CourseLanguage, nextWord: string): string {
  if (lang === 'es' && /^(i|hi)/.test(nextWord.toLocaleLowerCase())) return 'e';
  return CONJ[lang];
}

export function listText(lang: CourseLanguage, words: readonly string[]): string {
  const q = words.map(w => `«${w}»`);
  if (q.length === 1) return q[0];
  if (q.length === 2) return `${q[0]} ${conjFor(lang, words[1])} ${q[1]}`;
  return `${q.slice(0, -1).join(', ')} ${conjFor(lang, words[words.length - 1])} ${q[q.length - 1]}`;
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
    T(1, 'The word {LIST} is here.', 'واژهٔ {LIST} اینجاست.', 'The word {PATTERN} is here.'),
    T(1, 'I can read {LIST} now.', 'حالا میتوانم {LIST} را بخوانم.', 'I can read {PATTERN} now.'),
    T(1, 'We need {LIST} today.', 'امروز به {LIST} نیاز داریم.', 'We need {PATTERN} today.'),
    T(2, 'The words {LIST} are here.', 'واژههای {LIST} اینجا هستند.', 'The words {PATTERN} are here.'),
    T(2, 'I saw {LIST} in the text.', '{LIST} را در متن دیدم.', 'I saw {PATTERN} in the text.'),
    T(2, 'My friend asks about {LIST}.', 'دوستم دربارهٔ {LIST} میپرسد.', 'My friend asks about {PATTERN}.'),
    T(2, 'The teacher explains {LIST} again.', 'معلم دوباره {LIST} را توضیح میدهد.', 'The teacher explains {PATTERN} again.'),
    T(3, 'I can understand {LIST} better now.', 'اکنون {LIST} را بهتر میفهمم.', 'I can understand {PATTERN} better now.'),
    T(3, 'We saw {LIST} in the text today.', 'امروز {LIST} را در متن دیدیم.', 'We saw {PATTERN} in the text today.'),
    T(3, 'The teacher explains {LIST} once again.', 'معلم یک بار دیگر {LIST} را توضیح میدهد.', 'The teacher explains {PATTERN} once again.'),
    T(3, 'I wrote {LIST} in my review.', '{LIST} را در مرورم نوشتم.', 'I wrote {PATTERN} in my review.'),
  ],
  de: [
    T(1, 'Das ist {LIST}.', 'این {LIST} است.', 'Das ist {PATTERN}.'),
    T(1, 'Das Wort {LIST} steht hier.', 'واژهٔ {LIST} اینجا نوشته شده است.', 'Das Wort {PATTERN} steht hier.'),
    T(1, 'Ich lese {LIST} heute.', 'امروز {LIST} را میخوانم.', 'Ich lese {PATTERN} heute.'),
    T(1, 'Ich verstehe {LIST} jetzt besser.', 'اکنون {LIST} را بهتر میفهمم.', 'Ich verstehe {PATTERN} jetzt besser.'),
    T(2, 'Die Wörter {LIST} stehen hier.', 'واژههای {LIST} اینجا نوشته شدهاند.', 'Die Wörter {PATTERN} stehen hier.'),
    T(2, 'Der Lehrer erklärt {LIST} noch einmal.', 'معلم دوباره {LIST} را توضیح میدهد.', 'Der Lehrer erklärt {PATTERN} noch einmal.'),
    T(2, 'Im Text stehen {LIST}.', 'در متن {LIST} آمده است.', 'Im Text stehen {PATTERN}.'),
    T(2, 'Wir haben {LIST} hier.', 'ما {LIST} را اینجا داریم.', 'Wir haben {PATTERN} hier.'),
    T(3, 'Der Lehrer erklärt {LIST} noch einmal.', 'معلم دوباره {LIST} را توضیح میدهد.', 'Der Lehrer erklärt {PATTERN} noch einmal.'),
    T(3, 'Ich habe {LIST} geschrieben.', 'من {LIST} را نوشتم.', 'Ich habe {PATTERN} geschrieben.'),
    T(3, 'Wir haben {LIST} im Text gelesen.', 'ما {LIST} را در متن خواندیم.', 'Wir haben {PATTERN} im Text gelesen.'),
    T(3, 'Ich kann {LIST} jetzt besser verstehen.', 'اکنون {LIST} را بهتر میفهمم.', 'Ich kann {PATTERN} jetzt besser verstehen.'),
  ],
  fr: [
    T(1, "C'est {LIST}.", 'این {LIST} است.', "C'est {PATTERN}."),
    T(1, "J'ai {LIST} ici.", '{LIST} را اینجا دارم.', "J'ai {PATTERN} ici."),
    T(1, 'Je vois le mot {LIST}.', 'واژهٔ {LIST} را میبینم.', 'Je vois le mot {PATTERN}.'),
    T(1, 'Je peux mieux comprendre {LIST}.', 'میتوانم {LIST} را بهتر بفهمم.', 'Je peux mieux comprendre {PATTERN}.'),
    T(2, 'Ce sont {LIST}.', 'اینها {LIST} هستند.', 'Ce sont {PATTERN}.'),
    T(2, 'Le professeur explique encore {LIST}.', 'معلم باز هم {LIST} را توضیح میدهد.', 'Le professeur explique encore {PATTERN}.'),
    T(2, 'Dans le texte, on voit {LIST}.', 'در متن {LIST} دیده میشود.', 'Dans le texte, on voit {PATTERN}.'),
    T(2, 'Nous avons {LIST} ici.', 'ما {LIST} را اینجا داریم.', 'Nous avons {PATTERN} ici.'),
    T(3, "J'ai vu {LIST} dans le texte.", '{LIST} را در متن دیدم.', "J'ai vu {PATTERN} dans le texte."),
    T(3, 'Le professeur explique encore une fois {LIST}.', 'معلم یک بار دیگر {LIST} را توضیح میدهد.', 'Le professeur explique encore une fois {PATTERN}.'),
    T(3, 'Je peux maintenant mieux comprendre {LIST}.', 'اکنون میتوانم {LIST} را بهتر بفهمم.', 'Je peux maintenant mieux comprendre {PATTERN}.'),
    T(3, 'Nous avons lu {LIST} dans le texte.', 'ما {LIST} را در متن خواندیم.', 'Nous avons lu {PATTERN} dans le texte.'),
  ],
  es: [
    T(1, 'Esto es {LIST}.', 'این {LIST} است.', 'Esto es {PATTERN}.'),
    T(1, 'Aquí está {LIST}.', '{LIST} اینجاست.', 'Aquí está {PATTERN}.'),
    T(1, 'Veo la palabra {LIST}.', 'واژهٔ {LIST} را میبینم.', 'Veo la palabra {PATTERN}.'),
    T(1, 'Puedo entender mejor {LIST}.', 'میتوانم {LIST} را بهتر بفهمم.', 'Puedo entender mejor {PATTERN}.'),
    T(2, 'Aquí están {LIST}.', '{LIST} اینجا هستند.', 'Aquí están {PATTERN}.'),
    T(2, 'El profesor explica {LIST} otra vez.', 'معلم دوباره {LIST} را توضیح میدهد.', 'El profesor explica {PATTERN} otra vez.'),
    T(2, 'En el texto veo {LIST}.', 'در متن {LIST} را میبینم.', 'En el texto veo {PATTERN}.'),
    T(2, 'Hoy vemos {LIST}.', 'امروز {LIST} را میبینیم.', 'Hoy vemos {PATTERN}.'),
    T(3, 'He visto {LIST} en el texto.', '{LIST} را در متن دیدم.', 'He visto {PATTERN} en el texto.'),
    T(3, 'El profesor explica {LIST} otra vez.', 'معلم دوباره {LIST} را توضیح میدهد.', 'El profesor explica {PATTERN} otra vez.'),
    T(3, 'Puedo ahora entender mejor {LIST}.', 'اکنون میتوانم {LIST} را بهتر بفهمم.', 'Puedo ahora entender mejor {PATTERN}.'),
    T(3, 'Hemos visto {LIST} en el texto.', 'ما {LIST} را در متن دیدیم.', 'Hemos visto {PATTERN} en el texto.'),
  ],
  tr: [
    T(1, '{LIST} burada var.', '{LIST} اینجا هست.', '{PATTERN} burada var.'),
    T(1, 'Bugün {LIST} var.', 'امروز {LIST} هست.', 'Bugün {PATTERN} var.'),
    T(1, '{LIST} kelimesi burada.', 'واژهٔ {LIST} اینجاست.', '{PATTERN} kelimesi burada.'),
    T(1, 'Ben {LIST} anlıyorum.', 'من {LIST} را میفهمم.', 'Ben {PATTERN} anlıyorum.'),
    T(2, 'Bu metinde {LIST} var.', 'در این متن {LIST} هست.', 'Bu metinde {PATTERN} var.'),
    T(2, 'Bugün {LIST} önemli.', 'امروز {LIST} مهماند.', 'Bugün {PATTERN} önemli.'),
    T(2, 'Şimdi {LIST} daha iyi.', 'اکنون {LIST} بهتراند.', 'Şimdi {PATTERN} daha iyi.'),
    T(2, 'Yarın {LIST} tekrar var.', 'فردا دوباره {LIST} هست.', 'Yarın {PATTERN} tekrar var.'),
    T(3, 'Bugün {LIST} yazdım.', 'امروز {LIST} را نوشتم.', 'Bugün {PATTERN} yazdım.'),
    T(3, 'Bu metinde {LIST} var.', 'در این متن {LIST} هست.', 'Bu metinde {PATTERN} var.'),
    T(3, 'Şimdi {LIST} daha iyi anlıyorum.', 'اکنون {LIST} را بهتر میفهمم.', 'Şimdi {PATTERN} daha iyi anlıyorum.'),
    T(3, 'Yarın {LIST} tekrar var.', 'فردا دوباره {LIST} هست.', 'Yarın {PATTERN} tekrar var.'),
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
    T(3, 'Теперь я знаю {LIST}.', 'اکنون {LIST} را میدانم.', 'Теперь я знаю {PATTERN}.'),
    T(3, 'Он говорит {LIST} ещё раз.', 'او دوباره {LIST} را میگوید.', 'Он говорит {PATTERN} ещё раз.'),
    T(3, 'Мы уже знаем {LIST}.', 'ما از پیش {LIST} را میدانیم.', 'Мы уже знаем {PATTERN}.'),
  ],
};

/** Render a reviewed frame with real gap words. */
export function renderFrame(t: CoverageTemplate, lang: CourseLanguage, words: readonly string[]) {
  return {
    text: t.text.replace('{LIST}', listText(lang, words)),
    fa: t.fa.replace('{LIST}', listFa(words)),
    pattern: t.pattern.replace('{PATTERN}', patternList(lang, words.length)),
  };
}
