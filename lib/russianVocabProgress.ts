import { createVocabProgressStore, NEW_VOCAB_PER_SESSION, DUE_VOCAB_PER_SESSION } from './vocabProgress';
import type { VocabCard, VocabProgress, VocabSession, VocabStats } from './vocabProgress';
import type { RussianVocabWord } from './languages/russianVocab';

export { NEW_VOCAB_PER_SESSION, DUE_VOCAB_PER_SESSION };
export type { VocabCard, VocabStats };
export type RussianVocabCard = VocabCard;
export type RussianVocabProgress = VocabProgress;
export type RussianVocabSession = VocabSession<RussianVocabWord>;

/** Russian keeps its own local store; the German lab uses `milo.de.vocab.v1` and never reads this one. */
export const RUSSIAN_VOCAB_STORAGE_KEY = 'milo.ru.vocab.v1';

const store = createVocabProgressStore<RussianVocabWord>(RUSSIAN_VOCAB_STORAGE_KEY);

export const loadVocabProgress = store.load;
export const saveVocabProgress = store.save;
export const introduceVocabWords = store.introduce;
export const dueVocabWords = store.due;
export const newVocabWords = store.fresh;
export const buildVocabSession = store.buildSession;
export const rateVocabCard = store.rate;
export const isVocabMastered = store.mastered;
export const vocabStats = store.stats;
export const vocabReason = store.reason;
