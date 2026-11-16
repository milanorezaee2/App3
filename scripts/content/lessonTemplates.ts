import type { CoverageTemplate } from './coverageTemplates';

/**
 * Reviewed frames for the real bundled «vocabulary review» lessons.
 *
 * These are deliberately DIFFERENT from the download-pack frames (`coverageTemplates.ts`):
 * a learner meets the same high-frequency words in a classroom context inside the APK, and
 * later meets them again in the downloaded pack with different wording. No sentence is copied
 * between the two, so the pack's «not already in the shipped course» gate stays meaningful.
 */
export const LESSON_TEMPLATES: Record<'en' | 'de' | 'fr' | 'es' | 'tr' | 'ru', CoverageTemplate[]> = {
  en: [
    { slots: 1, text: 'In class we read {LIST} today.', fa: 'امروز در کلاس {LIST} را خواندیم.', pattern: 'In class we read {PATTERN} today.' },
    { slots: 1, text: 'Our teacher repeats {LIST} slowly.', fa: 'معلممان {LIST} را آهسته تکرار میکند.', pattern: 'Our teacher repeats {PATTERN} slowly.' },
    { slots: 1, text: 'I hear {LIST} in the lesson.', fa: 'در این درس {LIST} را میشنوم.', pattern: 'I hear {PATTERN} in the lesson.' },
    { slots: 2, text: 'We wrote {LIST} in our notebooks.', fa: '{LIST} را در دفترمان نوشتیم.', pattern: 'We wrote {PATTERN} in our notebooks.' },
    { slots: 2, text: 'The lesson explains {LIST} clearly.', fa: 'درس، {LIST} را روشن توضیح میدهد.', pattern: 'The lesson explains {PATTERN} clearly.' },
    { slots: 3, text: 'Today our class reviewed {LIST} together.', fa: 'امروز کلاس ما {LIST} را با هم مرور کرد.', pattern: 'Today our class reviewed {PATTERN} together.' },
    { slots: 3, text: 'After the lesson we wrote {LIST} again.', fa: 'پس از درس دوباره {LIST} را نوشتیم.', pattern: 'After the lesson we wrote {PATTERN} again.' },
    { slots: 3, text: 'My teacher asked about {LIST} in class.', fa: 'معلمم در کلاس دربارهٔ {LIST} پرسید.', pattern: 'My teacher asked about {PATTERN} in class.' },
  ],
  de: [
    { slots: 1, text: 'In der Klasse lesen wir {LIST} heute.', fa: 'امروز در کلاس {LIST} را میخوانیم.', pattern: 'In der Klasse lesen wir {PATTERN} heute.' },
    { slots: 1, text: 'Der Lehrer wiederholt {LIST} langsam.', fa: 'معلم {LIST} را آهسته تکرار میکند.', pattern: 'Der Lehrer wiederholt {PATTERN} langsam.' },
    { slots: 1, text: 'Ich höre {LIST} im Unterricht.', fa: 'در کلاس {LIST} را میشنوم.', pattern: 'Ich höre {PATTERN} im Unterricht.' },
    { slots: 2, text: 'Wir schreiben {LIST} in unser Heft.', fa: '{LIST} را در دفترمان مینویسیم.', pattern: 'Wir schreiben {PATTERN} in unser Heft.' },
    { slots: 2, text: 'Die Klasse bespricht {LIST} heute.', fa: 'کلاس امروز {LIST} را بررسی میکند.', pattern: 'Die Klasse bespricht {PATTERN} heute.' },
    { slots: 3, text: 'Heute wiederholen wir {LIST} gemeinsam.', fa: 'امروز {LIST} را با هم مرور میکنیم.', pattern: 'Heute wiederholen wir {PATTERN} gemeinsam.' },
    { slots: 3, text: 'Nach dem Unterricht lesen wir {LIST} noch einmal.', fa: 'پس از کلاس یک بار دیگر {LIST} را میخوانیم.', pattern: 'Nach dem Unterricht lesen wir {PATTERN} noch einmal.' },
    { slots: 3, text: 'Der Lehrer fragt nach {LIST} in der Klasse.', fa: 'معلم در کلاس دربارهٔ {LIST} میپرسد.', pattern: 'Der Lehrer fragt nach {PATTERN} in der Klasse.' },
  ],
  fr: [
    { slots: 1, text: 'En classe, nous lisons {LIST}.', fa: 'در کلاس {LIST} را میخوانیم.', pattern: 'En classe, nous lisons {PATTERN}.' },
    { slots: 1, text: 'Le professeur répète {LIST} lentement.', fa: 'معلم {LIST} را آهسته تکرار میکند.', pattern: 'Le professeur répète {PATTERN} lentement.' },
    { slots: 1, text: 'J’entends {LIST} pendant le cours.', fa: 'در طول درس {LIST} را میشنوم.', pattern: 'J’entends {PATTERN} pendant le cours.' },
    { slots: 2, text: 'Nous écrivons {LIST} dans nos cahiers.', fa: '{LIST} را در دفترهایمان مینویسیم.', pattern: 'Nous écrivons {PATTERN} dans nos cahiers.' },
    { slots: 2, text: 'Le cours explique {LIST} clairement.', fa: 'درس {LIST} را روشن توضیح میدهد.', pattern: 'Le cours explique {PATTERN} clairement.' },
    { slots: 3, text: 'Aujourd’hui, la classe revoit {LIST} ensemble.', fa: 'امروز کلاس {LIST} را با هم مرور میکند.', pattern: 'Aujourd’hui, la classe revoit {PATTERN} ensemble.' },
    { slots: 3, text: 'Après le cours, nous écrivons {LIST} encore.', fa: 'پس از درس دوباره {LIST} را مینویسیم.', pattern: 'Après le cours, nous écrivons {PATTERN} encore.' },
    { slots: 3, text: 'Le professeur demande {LIST} en classe.', fa: 'معلم در کلاس {LIST} را میپرسد.', pattern: 'Le professeur demande {PATTERN} en classe.' },
  ],
  es: [
    { slots: 1, text: 'En clase leemos {LIST} hoy.', fa: 'امروز در کلاس {LIST} را میخوانیم.', pattern: 'En clase leemos {PATTERN} hoy.' },
    { slots: 1, text: 'La profesora repite {LIST} despacio.', fa: 'معلم {LIST} را آهسته تکرار میکند.', pattern: 'La profesora repite {PATTERN} despacio.' },
    { slots: 1, text: 'Escucho {LIST} en la lección.', fa: 'در درس {LIST} را میشنوم.', pattern: 'Escucho {PATTERN} en la lección.' },
    { slots: 2, text: 'Escribimos {LIST} en nuestros cuadernos.', fa: '{LIST} را در دفترهایمان مینویسیم.', pattern: 'Escribimos {PATTERN} en nuestros cuadernos.' },
    { slots: 2, text: 'La lección explica {LIST} con claridad.', fa: 'درس {LIST} را روشن توضیح میدهد.', pattern: 'La lección explica {PATTERN} con claridad.' },
    { slots: 3, text: 'Hoy la clase repasa {LIST} junta.', fa: 'امروز کلاس {LIST} را با هم مرور میکند.', pattern: 'Hoy la clase repasa {PATTERN} junta.' },
    { slots: 3, text: 'Después de la clase escribimos {LIST} otra vez.', fa: 'پس از کلاس دوباره {LIST} را مینویسیم.', pattern: 'Después de la clase escribimos {PATTERN} otra vez.' },
    { slots: 3, text: 'La profesora pregunta por {LIST} en clase.', fa: 'معلم در کلاس دربارهٔ {LIST} میپرسد.', pattern: 'La profesora pregunta por {PATTERN} en clase.' },
  ],
  tr: [
    { slots: 1, text: 'Derste {LIST} okuduk.', fa: 'در کلاس {LIST} را خواندیم.', pattern: 'Derste {PATTERN} okuduk.' },
    { slots: 1, text: 'Öğretmen {LIST} yavaşça tekrar ediyor.', fa: 'معلم {LIST} را آهسته تکرار میکند.', pattern: 'Öğretmen {PATTERN} yavaşça tekrar ediyor.' },
    { slots: 1, text: 'Derste {LIST} duyuyorum.', fa: 'در کلاس {LIST} را میشنوم.', pattern: 'Derste {PATTERN} duyuyorum.' },
    { slots: 2, text: 'Defterimize {LIST} yazdık.', fa: '{LIST} را در دفترمان نوشتیم.', pattern: 'Defterimize {PATTERN} yazdık.' },
    { slots: 2, text: 'Bu derste {LIST} açıkça anlatılıyor.', fa: 'در این درس {LIST} روشن توضیح داده میشود.', pattern: 'Bu derste {PATTERN} açıkça anlatılıyor.' },
    { slots: 3, text: 'Bugün sınıfta {LIST} birlikte çalıştık.', fa: 'امروز در کلاس {LIST} را با هم کار کردیم.', pattern: 'Bugün sınıfta {PATTERN} birlikte çalıştık.' },
    { slots: 3, text: 'Dersten sonra {LIST} tekrar yazdık.', fa: 'پس از درس دوباره {LIST} را نوشتیم.', pattern: 'Dersten sonra {PATTERN} tekrar yazdık.' },
    { slots: 3, text: 'Öğretmen derste {LIST} sordu.', fa: 'معلم در کلاس {LIST} را پرسید.', pattern: 'Öğretmen derste {PATTERN} sordu.' },
  ],
  ru: [
    { slots: 1, text: 'На уроке мы читаем {LIST}.', fa: 'در کلاس {LIST} را میخوانیم.', pattern: 'На уроке мы читаем {PATTERN}.' },
    { slots: 1, text: 'Учитель повторяет {LIST} медленно.', fa: 'معلم {LIST} را آهسته تکرار میکند.', pattern: 'Учитель повторяет {PATTERN} медленно.' },
    { slots: 1, text: 'Я слышу {LIST} на уроке.', fa: 'در کلاس {LIST} را میشنوم.', pattern: 'Я слышу {PATTERN} на уроке.' },
    { slots: 2, text: 'Мы пишем {LIST} в тетради.', fa: '{LIST} را در دفترمان مینویسیم.', pattern: 'Мы пишем {PATTERN} в тетради.' },
    { slots: 2, text: 'Урок объясняет {LIST} понятно.', fa: 'درس {LIST} را روشن توضیح میدهد.', pattern: 'Урок объясняет {PATTERN} понятно.' },
    { slots: 3, text: 'Сегодня класс повторил {LIST} вместе.', fa: 'امروز کلاس {LIST} را با هم مرور کرد.', pattern: 'Сегодня класс повторил {PATTERN} вместе.' },
    { slots: 3, text: 'После урока мы написали {LIST} ещё раз.', fa: 'پس از درس دوباره {LIST} را نوشتیم.', pattern: 'После урока мы написали {PATTERN} ещё раз.' },
    { slots: 3, text: 'Учитель спросил про {LIST} на уроке.', fa: 'معلم در کلاس دربارهٔ {LIST} پرسید.', pattern: 'Учитель спросил про {PATTERN} на уроке.' },
  ],
};
