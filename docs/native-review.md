# Linguistic review

Scope: **12779 of 12779 generated lines (100%)** and **252 hand-drafted lines (10% deterministic sample)** in the 6 languages' newest packs. The generated lines come from **72 reviewed frames** (12 per language), so a frame review plus a line-by-line conformance check covers every one of them.

## Corrections made in the reviewed frames (v3)

- **es** — `y` → `e` before a word starting with `i`/`hi` (e.g. «informe»); implemented in `conjFor()` and checked on every line.
- **fr** — adverb placement: «Le professeur explique encore {LIST}» / «… encore une fois {LIST}» instead of the old object-then-`encore` order.
- **de** — added «Das Wort {LIST} steht hier.» and «Die Wörter {LIST} stehen hier.» so the cited word is explicitly a word; `Wörter` is capitalised as a German noun.
- **es (again)** — replaced the gender-mismatched «Estos son …» with the neutral «Aquí están …».
- **tr** — removed the unnatural «Bu {LIST} var.»; frames now say «{LIST} burada var.» / «Bu metinde {LIST} var.» / «{LIST} kelimesi burada.».
- **ru** — removed «Все {LIST} уже знают.» and «Я знаю {LIST} сейчас.»; frames now use «Теперь я знаю {LIST}.» and «Мы уже знаем {LIST}.».
- **en** — frames now name the word/lesson explicitly («The word {LIST} is here.», «In class …» for bundled lessons).
- **fa** — every Persian line mirrors the quoted words in the same order and reads naturally; no transliteration of the target language.
- **All languages** — pack frames and bundled-lesson frames are deliberately different, so no lesson sentence duplicates a pack sentence.

## Mechanical checks applied to every generated line

- The line renders **exactly** from one of the reviewed frames, with the same Persian and the same reusable pattern.
- Every `targetWords` entry stem-matches one of the quoted words in the line.
- Guillemets balanced; Persian mirrors the quoted words in the same order; `<W1>…<Wn>` present; no unresolved placeholders.
- Spanish `y → e`, French adverb placement, and the retired Turkish/Russian frames are explicitly forbidden.
- `validatePack.ts` (length, ceiling, duplicates, Persian, ids, schema) is still mandatory and is run separately.

## Results

| Language | Generated lines reviewed | Hand-drafted sample | Violations |
|---|---:|---:|---:|
| en | 1430 | 0 | 0 |
| de | 2420 | 78 | 0 |
| fr | 2220 | 54 | 0 |
| es | 2170 | 55 | 0 |
| tr | 2139 | 18 | 0 |
| ru | 2400 | 47 | 0 |

**Total: 12779 generated lines, 252 sampled lines, 0 violation(s).**

## Honest limitation

This is a full linguistic review by the authoring model plus mechanical gates. A **human native reviewer’s sign-off is not available in this environment**, so the packs record that fact in their `source` field instead of claiming it. When a native reviewer is available, the existing `source` field and `docs/native-review.md` are the place to record the sign-off.

Regenerate with `npx tsx scripts/content/reviewPacks.ts --write`.
