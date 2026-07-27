# ÆTERNA — Attributions & Licenses

This document credits every third-party work, dataset, and library that
ÆTERNA incorporates or interoperates with, and the license under which each
is used. Verified by an internal audit on 2026-07-26.

A user-visible "About / Credits" screen in the app should mirror the
"User-facing attributions" section below (this is required to satisfy CC BY
4.0 and is currently a release blocker — see `SECURITY-AUDIT.md` and
`RELEASE-BLOCKERS.md`).

---

## User-facing attributions (must appear in the app's About screen)

### Compound reference data
- **Open Peptide Dataset** — © Peptides Institute, licensed under
  [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
  Used as the seed for compound monographs. Modifications: structured into
  per-compound database rows; fields normalized.
- **Peptidepedia** — https://peptidepedia.org — referenced as a compound
  source (owner-written permission on file, 2026-07-17).
- **Pepmod** — https://pepmod.com — referenced as a compound source
  (owner-written permission on file, 2026-07-17).
- **peptide-db.com** — owner-published catalog (101 peptides), used with the
  owner's permission (the owner is also the ÆTERNA publisher).

### Exercise catalog
- **wger** — https://wger.de — exercise data is fetched from the wger public
  REST API at runtime (AGPL-3.0 licensed source; only the *API is consumed*,
  no wger source code or data is bundled, so AGPL copyleft does not attach
  to ÆTERNA). Lead author: Roland Geider.

### Nutrition catalog
- **USDA FoodData Central** via the FitBook `food-data.json` snapshot —
  USDA nutrient data is U.S. public domain; the FitBook snapshot
  representation is MIT-licensed (© 2024 Flexify).

### Application foundation
- **SparkyFitness** — © 2025–present codewithcj. The application foundation
  (mobile, server, shared package, health-sync subsystem) is built on
  SparkyFitness under its custom non-commercial license, with **written
  commercial-use permission** obtained directly from the author (recorded in
  `docs/DECISIONS.md`, 2026-07-15; evidence held privately by the owner).
  The SparkyFitness copyright notice and license text are preserved in this
  repository's `LICENSE` file as required.

### Concept & UX references (with written permission, no code copied)
The following granted written permission (2026-07-17, recorded in
`docs/DECISIONS.md`) to adapt their features, UX flows, and content. ÆTERNA
references their product flows; their **source code is not copied**:
- **Pepty**, **PeptIQ**, **Protocol (PeptideTracker)**, **Peppedia**,
  **Lifehackr**, **Longevity Labs**.

---

## Reference repositories (NOT shipped in the app)

The following are local study references only. **None of their code or data
is bundled into the published ÆTERNA app.** They live outside the
git-tracked `aeterna-os/` tree and must not be committed to any public
repository (decompiled/scraped artifacts may carry provenance or license
obligations).

| Reference | License | Use |
|---|---|---|
| wger (`references/wger`) | AGPL-3.0 | API client only — no code/data copied |
| FitBook (`references/FitBook`) | MIT | Concept/algorithm donor (offline food diary, weight history) |
| OpenNutriTracker (`references/OpenNutriTracker`) | GPL-3.0 | UX/flow reference; no code copied |
| LoopHabitTracker (`references/LoopHabitTracker`) | GPL-3.0 | Algorithm reference; re-implemented in TypeScript, not ported |
| Waistline (`references/Waistline`) | GPL-3.0 | Archive reference — not adopted |
| peptidlib (`references/peptidlib`) | n/a | HTTrack mirror of the owner's own peptide-db.com |

**Copyleft trigger avoided**: GPL/AGPL attach only if their *source code or
data* is copied into ÆTERNA. The current architecture (API client for wger;
TypeScript re-implementation for LoopHabitTracker algorithms; flow reference
for the rest) deliberately stays below that threshold. Future contributors:
do **not** copy source from these repos into `aeterna-os/` without first
recording a license-compatibility decision in `docs/DECISIONS.md`.

---

## Open-source dependencies (mobile + server)

ÆTERNA's runtime dependencies are predominantly MIT, ISC, BSD, or Apache-2.0
licensed. Notable permissive dependencies:

- React Native 0.85 / Expo SDK 56 / React 19 (MIT)
- Express 5, `pg`, `better-auth`/`@better-auth/*`, `zod`, `multer`,
  `swagger-ui-express`, `bcryptjs`, `nodemailer` (MIT)
- `@tanstack/react-query`, `zustand`, `date-fns` (MIT)
- `@ai-sdk/*`, `ai`, `jose`, `tesseract.js`, `pdfjs-dist` (Apache-2.0)

**To verify before public release** (run `pnpm licenses ls` / `license-checker`
against the full transitive `node_modules` graph):
- `heic-convert` (LGPL-3.0 — typically fine as a dynamic dependency, confirm)
- `@garmin/fitsdk` (Garmin's own license — confirm redistribution terms)
- Full transitive closure (~hundreds of packages) — the audit found no
  obvious GPL/AGPL/BUSL/Commons-Clause direct dependency, but a complete
  transitive scan is the only way to be certain.

---

## Data sources the app calls at runtime (user-initiated)

These services are contacted only when you take an action (search, scan,
link an account):

- **Open Food Facts** — barcode lookup (openfoodfacts.org)
- **USDA FoodData Central** — food nutrient lookup (api.nal.usda.gov)
- **FatSecret / Nutritionix** — food lookup (when configured)
- **wger** — exercise lookup (wger.de)
- **free-exercise-db** — exercise lookup (GitHub-hosted)
- **Swiss Food BLV** — Swiss food composition (when configured)
- **Withings / Fitbit / Garmin / Polar / Strava / Google Health / Hevy** —
  wearable/activity sync (only when you link the provider via OAuth)
- **Apple Health / Health Connect** — on-device health store reads
- **AI providers** (OpenAI, Anthropic, Google, Mistral, Groq, OpenRouter,
  xAI, Meta, or self-hosted Ollama/compatible) — only when AEON is
  configured with your key

---

## Imagery & icons

- App icon and brand marks: original work by the ÆTERNA publisher.
- Compound/peptide reference images: none currently bundled.
- Exercise images: served by wger at runtime (attribution above).
- If third-party iconography is added later, this section must be updated.

---

## Acknowledgements

ÆTERNA would not exist without the open-source health, nutrition, and
fitness communities — especially the maintainers of SparkyFitness, wger,
FitBook, OpenNutriTracker, and LoopHabitTracker. Their work made a
free, private, biology-first operating system possible.
