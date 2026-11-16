import { RussianBottomNav } from '@/components/RussianBottomNav';
import VocabLab, { type VocabLabConfig } from '@/components/VocabLab';
import { RUSSIAN_VOCAB_WORDS, firstLetterHint, spokenTarget, type RussianVocabWord } from '@/lib/languages/russianVocab';
import { playRussianSpeech, stopRussianSpeech, warmRussianSpeech } from '@/lib/russianSpeech';
import {
  RUSSIAN_VOCAB_STORAGE_KEY,
  buildVocabSession,
  dueVocabWords,
  introduceVocabWords,
  isVocabMastered,
  loadVocabProgress,
  newVocabWords,
  rateVocabCard,
  saveVocabProgress,
  vocabReason,
  vocabStats,
} from '@/lib/russianVocabProgress';
import type { VocabProgressStore } from '@/lib/vocabProgress';

/** The Russian course's configuration of the shared lab (content, `ru-RU` speech, `milo.ru.vocab.v1`). */
const store: VocabProgressStore<RussianVocabWord> = {
  storageKey: RUSSIAN_VOCAB_STORAGE_KEY,
  load: loadVocabProgress,
  save: saveVocabProgress,
  introduce: introduceVocabWords,
  due: dueVocabWords,
  fresh: newVocabWords,
  buildSession: buildVocabSession,
  rate: rateVocabCard,
  mastered: isVocabMastered,
  stats: vocabStats,
  reason: vocabReason,
};

/** Module scope, so the lab's effects see a stable config and never restart on a re-render. */
const CONFIG: VocabLabConfig<RussianVocabWord> = {
  title: 'واژه‌خانهٔ روسی',
  languageName: 'روسی',
  locale: 'ru-RU',
  words: RUSSIAN_VOCAB_WORDS,
  target: spokenTarget,
  gloss: word => word.fa,
  note: word => word.note,
  hint: firstLetterHint,
  speech: { play: playRussianSpeech, stop: stopRussianSpeech, warm: warmRussianSpeech },
  store,
  homeRoute: '/learn/ru',
  BottomNav: RussianBottomNav,
};

export default function RussianVocabLab() {
  return <VocabLab config={CONFIG} />;
}
