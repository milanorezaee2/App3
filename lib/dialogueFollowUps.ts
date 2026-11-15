/**
 * Universal conversational moves for branching dialogues.
 *
 * Every lesson dialogue can branch even when its sentence pool has no spare question: the partner
 * interrupts with one of these natural "repair" moves (asking to repeat, checking they heard right,
 * asking for a slower pace) and the learner must react. Each move offers the learner TWO reactions;
 * the partner acknowledges each one differently before the scripted dialogue resumes.
 *
 * Nothing here is lesson-specific — the learner's own previous line is re-used (`{line}`), so the
 * existing lesson content is never modified. Texts are plain, high-frequency, level-neutral phrases.
 */

export type FollowUpLanguage = 'en' | 'ru' | 'tr' | 'de' | 'fr' | 'es';

export interface FollowUpOption {
  /** Learner reaction; `{line}` is replaced by the learner's previous line (without final punctuation). */
  text: string;
  fa: string;
  /** Partner's short acknowledgement before the scripted dialogue continues. */
  after: { text: string; fa: string };
}
export interface FollowUpMove {
  id: 'repeat' | 'confirm' | 'slow';
  /** Partner's interruption; `{line}` as above. */
  ask: string;
  askFa: string;
  options: readonly [FollowUpOption, FollowUpOption];
}

const MOVES: Record<FollowUpLanguage, readonly FollowUpMove[]> = {
  en: [
    { id: 'repeat', ask: 'Sorry, could you say that again?', askFa: 'ببخشید، می‌شود دوباره بگویید؟', options: [
      { text: 'Of course. {line}', fa: 'حتماً. (جمله‌ات را تکرار کن)', after: { text: 'Thanks, got it.', fa: 'ممنون، متوجه شدم.' } },
      { text: 'Sure, slowly: {line}', fa: 'حتماً، آهسته: (جمله‌ات را تکرار کن)', after: { text: 'Perfect, thank you.', fa: 'عالی، ممنون.' } },
    ] },
    { id: 'confirm', ask: 'Did you say “{line}”?', askFa: 'گفتید «{line}»؟', options: [
      { text: 'Yes, exactly.', fa: 'بله، دقیقاً.', after: { text: 'Okay, great.', fa: 'باشد، عالی.' } },
      { text: 'Yes — {line}', fa: 'بله — (جمله‌ات را تکرار کن)', after: { text: 'All right, thanks.', fa: 'بسیار خب، ممنون.' } },
    ] },
    { id: 'slow', ask: 'A little slower, please.', askFa: 'لطفاً کمی آهسته‌تر.', options: [
      { text: 'Sorry. {line}', fa: 'ببخشید. (آهسته تکرار کن)', after: { text: 'Now I understand, thanks.', fa: 'حالا فهمیدم، ممنون.' } },
      { text: 'No problem: {line}', fa: 'مشکلی نیست: (آهسته تکرار کن)', after: { text: 'Great, thank you.', fa: 'عالی، ممنون.' } },
    ] },
  ],
  ru: [
    { id: 'repeat', ask: 'Извини́те, повтори́те, пожа́луйста.', askFa: 'ببخشید، لطفاً تکرار کنید.', options: [
      { text: 'Коне́чно. {line}', fa: 'حتماً. (جمله‌ات را تکرار کن)', after: { text: 'Спаси́бо, по́нял.', fa: 'ممنون، فهمیدم.' } },
      { text: 'Да, ме́дленно: {line}', fa: 'بله، آهسته: (جمله‌ات را تکرار کن)', after: { text: 'Отли́чно, спаси́бо.', fa: 'عالی، ممنون.' } },
    ] },
    { id: 'confirm', ask: 'Вы сказа́ли «{line}»?', askFa: 'گفتید «{line}»؟', options: [
      { text: 'Да, то́чно.', fa: 'بله، دقیقاً.', after: { text: 'Хорошо́.', fa: 'خوب.' } },
      { text: 'Да — {line}', fa: 'بله — (جمله‌ات را تکرار کن)', after: { text: 'Поня́тно, спаси́бо.', fa: 'روشن شد، ممنون.' } },
    ] },
    { id: 'slow', ask: 'Немно́го ме́дленнее, пожа́луйста.', askFa: 'لطفاً کمی آهسته‌تر.', options: [
      { text: 'Извини́те. {line}', fa: 'ببخشید. (آهسته تکرار کن)', after: { text: 'Тепе́рь поня́тно, спаси́бо.', fa: 'حالا روشن شد، ممنون.' } },
      { text: 'Без пробле́м: {line}', fa: 'مشکلی نیست: (آهسته تکرار کن)', after: { text: 'Отли́чно, спаси́бо.', fa: 'عالی، ممنون.' } },
    ] },
  ],
  tr: [
    { id: 'repeat', ask: 'Pardon, tekrar eder misiniz?', askFa: 'ببخشید، تکرار می‌کنید؟', options: [
      { text: 'Tabii. {line}', fa: 'حتماً. (جمله‌ات را تکرار کن)', after: { text: 'Teşekkürler, anladım.', fa: 'ممنون، فهمیدم.' } },
      { text: 'Tabii, yavaşça: {line}', fa: 'حتماً، آهسته: (جمله‌ات را تکرار کن)', after: { text: 'Harika, teşekkür ederim.', fa: 'عالی، ممنون.' } },
    ] },
    { id: 'confirm', ask: '“{line}” mi dediniz?', askFa: 'گفتید «{line}»؟', options: [
      { text: 'Evet, aynen.', fa: 'بله، دقیقاً.', after: { text: 'Tamam, peki.', fa: 'باشد، خب.' } },
      { text: 'Evet — {line}', fa: 'بله — (جمله‌ات را تکرار کن)', after: { text: 'Anladım, teşekkürler.', fa: 'فهمیدم، ممنون.' } },
    ] },
    { id: 'slow', ask: 'Biraz daha yavaş, lütfen.', askFa: 'لطفاً کمی آهسته‌تر.', options: [
      { text: 'Pardon. {line}', fa: 'ببخشید. (آهسته تکرار کن)', after: { text: 'Şimdi anladım, teşekkürler.', fa: 'حالا فهمیدم، ممنون.' } },
      { text: 'Sorun değil: {line}', fa: 'مشکلی نیست: (آهسته تکرار کن)', after: { text: 'Harika, teşekkürler.', fa: 'عالی، ممنون.' } },
    ] },
  ],
  de: [
    { id: 'repeat', ask: 'Entschuldigung, können Sie das wiederholen?', askFa: 'ببخشید، می‌توانید تکرار کنید؟', options: [
      { text: 'Natürlich. {line}', fa: 'البته. (جمله‌ات را تکرار کن)', after: { text: 'Danke, verstanden.', fa: 'ممنون، فهمیدم.' } },
      { text: 'Gern, langsam: {line}', fa: 'با کمال میل، آهسته: (جمله‌ات را تکرار کن)', after: { text: 'Perfekt, danke.', fa: 'عالی، ممنون.' } },
    ] },
    { id: 'confirm', ask: 'Haben Sie „{line}“ gesagt?', askFa: 'گفتید «{line}»؟', options: [
      { text: 'Ja, genau.', fa: 'بله، دقیقاً.', after: { text: 'Okay, gut.', fa: 'باشد، خوب.' } },
      { text: 'Ja — {line}', fa: 'بله — (جمله‌ات را تکرار کن)', after: { text: 'Alles klar, danke.', fa: 'روشن شد، ممنون.' } },
    ] },
    { id: 'slow', ask: 'Etwas langsamer, bitte.', askFa: 'لطفاً کمی آهسته‌تر.', options: [
      { text: 'Entschuldigung. {line}', fa: 'ببخشید. (آهسته تکرار کن)', after: { text: 'Jetzt verstehe ich, danke.', fa: 'حالا می‌فهمم، ممنون.' } },
      { text: 'Kein Problem: {line}', fa: 'مشکلی نیست: (آهسته تکرار کن)', after: { text: 'Super, danke.', fa: 'عالی، ممنون.' } },
    ] },
  ],
  fr: [
    { id: 'repeat', ask: 'Pardon, vous pouvez répéter ?', askFa: 'ببخشید، می‌توانید تکرار کنید؟', options: [
      { text: 'Bien sûr. {line}', fa: 'البته. (جمله‌ات را تکرار کن)', after: { text: 'Merci, j’ai compris.', fa: 'ممنون، فهمیدم.' } },
      { text: 'Oui, lentement : {line}', fa: 'بله، آهسته: (جمله‌ات را تکرار کن)', after: { text: 'Parfait, merci.', fa: 'عالی، ممنون.' } },
    ] },
    { id: 'confirm', ask: 'Vous avez dit « {line} » ?', askFa: 'گفتید «{line}»؟', options: [
      { text: 'Oui, exactement.', fa: 'بله، دقیقاً.', after: { text: 'D’accord, très bien.', fa: 'باشد، خیلی خوب.' } },
      { text: 'Oui — {line}', fa: 'بله — (جمله‌ات را تکرار کن)', after: { text: 'Très bien, merci.', fa: 'خیلی خوب، ممنون.' } },
    ] },
    { id: 'slow', ask: 'Un peu plus lentement, s’il vous plaît.', askFa: 'لطفاً کمی آهسته‌تر.', options: [
      { text: 'Pardon. {line}', fa: 'ببخشید. (آهسته تکرار کن)', after: { text: 'Maintenant je comprends, merci.', fa: 'حالا می‌فهمم، ممنون.' } },
      { text: 'Pas de problème : {line}', fa: 'مشکلی نیست: (آهسته تکرار کن)', after: { text: 'Super, merci.', fa: 'عالی، ممنون.' } },
    ] },
  ],
  es: [
    { id: 'repeat', ask: 'Perdón, ¿puede repetir?', askFa: 'ببخشید، می‌توانید تکرار کنید؟', options: [
      { text: 'Claro. {line}', fa: 'البته. (جمله‌ات را تکرار کن)', after: { text: 'Gracias, entendido.', fa: 'ممنون، فهمیدم.' } },
      { text: 'Sí, despacio: {line}', fa: 'بله، آهسته: (جمله‌ات را تکرار کن)', after: { text: 'Perfecto, gracias.', fa: 'عالی، ممنون.' } },
    ] },
    { id: 'confirm', ask: '¿Ha dicho «{line}»?', askFa: 'گفتید «{line}»؟', options: [
      { text: 'Sí, exacto.', fa: 'بله، دقیقاً.', after: { text: 'Vale, muy bien.', fa: 'باشد، خیلی خوب.' } },
      { text: 'Sí — {line}', fa: 'بله — (جمله‌ات را تکرار کن)', after: { text: 'Entendido, gracias.', fa: 'فهمیدم، ممنون.' } },
    ] },
    { id: 'slow', ask: 'Un poco más despacio, por favor.', askFa: 'لطفاً کمی آهسته‌تر.', options: [
      { text: 'Perdón. {line}', fa: 'ببخشید. (آهسته تکرار کن)', after: { text: 'Ahora entiendo, gracias.', fa: 'حالا می‌فهمم، ممنون.' } },
      { text: 'Sin problema: {line}', fa: 'مشکلی نیست: (آهسته تکرار کن)', after: { text: 'Genial, gracias.', fa: 'عالی، ممنون.' } },
    ] },
  ],
};

export function followUpLanguageFromLocale(locale: string | undefined): FollowUpLanguage | null {
  const code = (locale ?? '').slice(0, 2).toLowerCase();
  return code in MOVES ? code as FollowUpLanguage : null;
}

export function followUpMoves(language: FollowUpLanguage): readonly FollowUpMove[] {
  return MOVES[language];
}

/** The learner's line without its final punctuation, ready to be quoted or repeated inside a move. */
export function quotable(line: string): string {
  return line.trim().replace(/[.!?。؟!…]+$/u, '').replace(/^[¿¡]+/u, '').trim();
}

/** Fill `{line}` in a move text. */
export const fillLine = (template: string, line: string) => template.replace(/\{line\}/g, quotable(line));
