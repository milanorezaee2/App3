# Content factory

Turns the course spec into content, with measurable quality, without touching the lesson engine.

```
spec (lib/content/courseSpec.ts) ──┐
frequency lists (lib/content/frequency/*.json) ──┤
shipped lessons ──────────────────┴─► 1. gap report ─► 2. draft ─► 3. quality gates ─► 4. pack + manifest ─► 5. audio ─► Supabase Storage
```

All commands run from the repo root with the lesson-data shim:

```
export NODE_OPTIONS="--require ./scripts/content/shim.cjs"
npx tsx scripts/content/gapReport.ts de A2            # 1. which frequency words are missing, per band
npx tsx scripts/content/validatePack.ts content-packs/de/A2.v1.json   # 3. quality gates (fails on any violation)
npx tsx scripts/content/buildManifest.ts               # 4. content-packs/manifest.json from the pack files
node scripts/content/renderAudio.mjs content-packs/de/A2.v1.json --provider <cmd>   # 5. optional recordings
```

## 1. Gap report
Prints, for a language and band, the frequency words (≤ band ceiling) that no shipped sentence
covers yet, most frequent first, plus the band's structure numbers. This list is the order sheet for
step 2.

## 2. Draft
Drafts are written (by a person or a language model) **against the gap list**: each sentence names the
`targetWords` it covers. Draft file = a `ContentPack` (see `lib/content/packs.ts`). Guidance for the
drafter is in `DRAFTING.md`.

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

## Review policy
- Automated gates are mandatory.
- Human review: full review when a native reviewer is available; otherwise a random 10% sample per pack
  (the manifest `source` field records which). Any rejected sample ⇒ the whole pack goes back to drafting.
