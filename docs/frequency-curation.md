# Frequency-list curation

The bundled wordfreq exports are filtered for tokens the course tokenizer can actually teach. Artefacts are compacted to the tail; teachable words keep a rank no later than their original one, so existing packs stay inside their band ceilings.

- **en**: 135 artefact(s) moved to the tail; examples: it's, don't, i'm, you're, s, that's, can't, i've, didn't, he's, there's, doesn't, they're, d. Top-2000 tail: creating, debt, domestic, expensive, grew, historical, homes, honestly.
- **de**: 142 artefact(s) moved to the tail; examples: a, s, d, the, m, i, e, u, b, of, c, n, usa, h. Top-2000 tail: rechnung, sammlung, service, standard, streit, städten, teams, theorie.
- **fr**: 103 artefact(s) moved to the tail; examples: aujourd'hui, jusqu'à, quelqu'un, the, etc, in, of, ii, oh, new, ok, and, jusqu'au, 1er. Top-2000 tail: devenue, disparu, donnent, douleur, décès, démocratie, emplois, espagnol.
- **es**: 107 artefact(s) moved to the tail; examples: d, the, c, i, s, m, etc, p, vi, has, q, x, b, n. Top-2000 tail: representación, requiere, resumen, roma, seas, seguido, sueños, titular.
- **tr**: 167 artefact(s) moved to the tail; examples: d, b, s, m, dr, türkiye'de, c, the, k, türkiye'nin, t, tv, n, new. Top-2000 tail: gezi, geçerli, gitme, gücünü, günden, günlerde, haberleri, insana.
- **ru**: 97 artefact(s) moved to the tail; examples: the, i, a, ii, of, c, d, http, v, x, iii, to, b, s. Top-2000 tail: изд, имеется, имена, количества, комнате, моё, неожиданно, обучения.

Run `npx tsx scripts/content/curateFrequency.ts --write` to regenerate. This script is idempotent (kept words keep their relative order).
