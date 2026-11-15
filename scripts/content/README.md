# Content factory

Turns the course spec into content, with measurable quality, without touching the lesson engine.

```
spec (lib/content/courseSpec.ts) ──┐
frequency lists (curated) ─────────┤
shipped lessons ──────────────────┴─► 1. gap report ─► 2. draft / coverage generator ─► 3. quality gates ─► 4. pack + manifest ─► 5. audio ─► Supabase Storage
```

All commands run from the repo root with the lesson-data shim:

```
export NODE_OPTIONS="--require ./scripts/content/shim.cjs"
npx tsx scripts/content/curateFrequency.ts --write    # 0. remove corpus artefacts from the frequency lists
npx tsx scripts/content/gapReport.ts de A2 --with-packs                 # 1. missing words, including downloaded packs
npx tsx scripts/content/genLabLessons.ts --write                          # 2a. real bundled lessons (structure half)
npx tsx scripts/content/genCoveragePacks.ts --write --target 92         # 2b. close all six bands' gaps (hybrid generator)
npx tsx scripts/content/validatePack.ts content-packs/de/A2.v6.json   # 3. quality gates (fails on any violation)
npx tsx scripts/content/reviewPacks.ts --write                            # 3b. 100% linguistic review of generated lines
npx tsx scripts/content/buildManifest.ts               # 4. content-packs/manifest.json from the pack files
npx tsx scripts/content/genPackCoverage.ts --write                       # 4b. bundle the packs' vocabulary index for the UI
npx tsx scripts/content/reportReadiness.ts --write --target 90            # 4c. acceptance report (min readiness)
# 5. optional pre-rendered recordings (needs a TTS key as a GitHub Secret — see docs/prerendered-audio.md)
TTS_API_KEY=... node scripts/content/renderAudio.mjs content-packs/de/A2.v6.json \
  --provider "node scripts/content/ttsProvider.mjs {lang} {text} {out}" \
  --base https://doagwkssxtxseuavrxnr.supabase.co/storage/v1/object/public/content-packs/audio
```

## 0. Frequency curation
`curateFrequency.ts` moves corpus artefacts — apostrophe forms the tokenizer cannot match, punctuation,
stray English stop-words and initials — to the tail of each top-8000 list. Teachable words keep their
original relative rank, so a word already inside a band's ceiling stays inside it. See
`docs/frequency-curation.md`.

## 1. Gap report
Prints, for a language and band, the frequency words (≤ band ceiling) that no shipped sentence
covers yet, most frequent first, plus the band's structure numbers. This list is the order sheet for
step 2.

## 2. Draft
Drafts are written (by a person or a language model) **against the gap list**: each sentence names the
`targetWords` it covers. Draft file = a `ContentPack` (see `lib/content/packs.ts`). Guidance for the
drafter is in `DRAFTING.md`.

## 2b. Hybrid coverage generator
`genCoveragePacks.ts` preserves every hand-drafted sentence, computes the exact remaining gaps with
`computeReadiness`, groups inflected forms by the same 5-letter stem rule, and closes the gaps with
rotated, band-filtered «word-study» frames from `coverageTemplates.ts`. Frames are honest vocabulary
practice (meeting / writing / revising words), not random words forced into unrelated sentences. The
generator applies the same length, ceiling, duplicate and target-word gates as `validatePack.ts`, then
writes v2 for existing packs (v1 for new bands) and `docs/coverage-uplift.md`. Native review is still
pending and is recorded in each pack's `source`.

## 3. Quality gates (`validatePack.ts`)
A pack is rejected if any sentence fails:
- **level vocabulary** — every word must be within the band's frequency ceiling, except at most ONE
  word above it (a name / topic noun). Proper nouns (capitalised, not sentence-initial) are exempt.
- **length** — 3–14 words (pre/A1: 3–9).
- **duplicates** — no sentence already in the shipped course or elsewhere in the pack (case/punctuation
  insensitive).
- **target words present** — each `targetWords` entry actually appears in the sentence (stem match).
- **Persian present** — `fa` non-empty and not identical to `text`.
- **ids unique**, `schema === 1`, language/band match the file name.
It also prints how much the pack raises the band's coverage, so a reviewer sees the value before approving.

## 4. Pack & manifest
Packs are immutable files `content-packs/<lang>/<band>.v<N>.json`; `buildManifest.ts` lists the newest
version of each. Upload the `content-packs/` folder to the public bucket `content-packs` in Supabase
Storage (keep the same paths). The app checks `manifest.json`, downloads only changed packs, and caches
them for offline use. Bump `version` for any change — the app never re-downloads an unchanged version.

## 5. Audio (optional, recommended)
`renderAudio.mjs` calls any TTS CLI/provider you configure (`--provider` receives text, lang, output path),
writes `audio/<lang>/<sentenceId>.mp3`, and fills each sentence's `audio` URL. The app plays these
recordings instead of the device voice whenever present.

## Structure (real lessons)
`genLabLessons.ts` writes `lib/content/labLessons.generated.ts` — ordinary lessons (sentences, dialogue,
comprehension check, teaching note) inserted next to the other lessons of their level in all six courses.
Downloaded packs add sentences but never add lessons, so this is the only way to raise the `structure`
half of readiness. See `docs/readiness-uplift.md`.

## Readiness in the UI
`courseReadiness()` unions the vocabulary index of the published packs (`packCoverage.generated.json`)
with the bundled lessons, so the number a learner sees matches the whole course. Scripts can pass
`false` to audit bundled lessons only. `reportReadiness.ts` is the acceptance gate.

## Review policy
- Automated gates (`validatePack.ts`) are mandatory for every pack.
- **Generated lines: 100% reviewed** — all 72 reviewed frames plus a line-by-line conformance check
  in `reviewPacks.ts`; see `docs/native-review.md`.
- **Hand-drafted lines: 10% deterministic sample** (basic linguistic hygiene).
- A human native reviewer's sign-off is not available in this environment; packs record that in
  `source` rather than claiming it. Any rejected sample ⇒ the whole pack goes back to drafting.
