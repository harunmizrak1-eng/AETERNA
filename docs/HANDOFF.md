# ÆTERNA handoff

## State

- Status: **Faz A — Peptide-First UI** started 2026-07-17 (see
  `docs/DECISIONS.md`, `docs/ROADMAP.md` "Faz A" section). Strategic
  re-centering on the product heart: peptide protocol, vial, today,
  dose logging, compound library. Health Sync UI deprioritized; backend
  kept.
- Active stage: **Stage 1A** remains the single active stage; Faz A is an
  in-stage reordering inside it (not a new stage, not a gate change).
  Stage 1B is code-complete (S1B-01..07 + S2-01 DataConflict foundation
  `89687f4c`); device verification and live-Postgres application remain
  open external blockers.
- **Agent division (Faz A) — UPDATED 2026-07-17 evening:**
  - **ZCode (GLM-5.2)** — owned UI through Paket 6; now **completes Paket 7
    (docs/validation) then transitions to AUDIT/QA role**: runs
    typecheck/lint/test across the repo, reviews hy3/Claude output for
    honesty/scope/quality, keeps HANDOFF/ROADMAP/DECISIONS consistent.
    No new feature ownership after Faz A UI wraps.
  - **hy3 (strong model)** — **newly added** as backend partner. Picks up
    Faz A backend + Stage 2 bounded work: compound library backend
    (`compounds` migration + RLS + Open Peptide Dataset seed +
    `routes/v2/compoundLibraryRoutes.ts` + repo + tests), reconstitution
    pure functions, S2-02 conflict-indicator standalone component
    (`src/components/aeterna/ConflictIndicator.tsx`, NOT wired into
    BiomarkersScreen), S2-03 biomarker normalization. hy3 must NOT edit
    screen/layout files (`src/screens/*.tsx`, `App.tsx`, `TabsLayout.tsx`,
    `AddSheet.tsx`, `OnboardingScreen.tsx`) — ZCode owns those.
  - **Claude ("hy3" in this handoff's own text — same agent, see note
    below)** — membership ends 2026-07-18. Completed S2-01 DataConflict
    (`89687f4c`), the three honesty closures (C1/C2/C3), the full
    Faz A backend slice (compound library backend, reconstitution pure
    functions), the Stage 2 bounded pair (S2-02 conflict-indicator
    component, S2-03 biomarker ingestion hardening) — see "hy3/Claude
    backend pass — completed" below. **Then, with ZCode's token
    exhausted and explicit owner authorization to cross into
    screen/layout files temporarily, also committed ZCode's own
    already-authored but uncommitted Paket 2/3/4/6 UI work and built
    Paket 5 (Compound Library mobile) end-to-end** — see "Paket 5 —
    Compound Library mobile (hy3/Claude, filling in for ZCode)" below.
    No further work; this was the final pass before access ends.
- Application repo: `AETERNA/aeterna-os`, branch
  `overnight/aeterna-product-integration`, HEAD `ba220562`. Since Paket 5,
  ZCode landed the injection-logging flow (`59437235`..`655e78e8`) and
  hy3/Claude landed the Paket 7 wire-up (`8cc1d772`, `ba220562`). ZCode
  has uncommitted/untracked server work in flight (compound-seed
  expansion: `20260718000000_seed_open_peptide_dataset.sql`,
  `tests/compoundSeed.test.ts`) — left untouched by hy3/Claude.
- Last agent: hy3/Claude (Paket 7 section below). **Repo `tsc` is red
  only because of ZCode's `useLogDoseAction.ts` `vars` bug — see the
  Paket 7 blocker note; ZCode to fix.**
- Updated: 2026-07-18 early morning, Europe/Istanbul

## Approved direction (2026-07-17)

- Same Expo project (`SparkyFitnessMobile`) — no second app foundation.
  New `aeterna-v2` UI layer over the existing Sparky backend (auth, RLS,
  protocol, medication/pens, biomarker, safety, sync, export all kept).
  Sparky screens reachable behind `__DEV__` routes, per the existing
  legacy pattern in `SparkyFitnessMobile/AGENTS.md`.
- Track tab repurposed to Logbook (dose/injection/symptom/lab timeline);
  Sparky nutrition diary behind `__DEV__`.
- Reference apps (Pepty, PeptIQ, Protocol, Peppedia, Lifehackr, Longevity
  Labs) and data sources (Open Peptide Dataset CC BY 4.0, peptidepedia.org,
  pepmod.com) carry written owner permission — UX/data may be freely copied
  and adapted (see `docs/DECISIONS.md`, 2026-07-17 rights entry; the
  `AGENTS.md` competitor-reuse clause was replaced by an explicit
  licensed-sources carve-in).
- Fixed product rules: completely free, no subscription, no ads, no user
  tracking. Open-source license choice deferred.

## Next tasks

- GLM/ZCode (when token renews): **Paket 7 — Docs + validation.**
  Paket 2/3/4/5/6 are all now done and committed (see below) — review
  hy3/Claude's Paket 5 UI work (`CompoundLibraryScreen.tsx`,
  `CompoundDetailScreen.tsx`, `LibraryShellScreen.tsx`'s Compounds row)
  for visual/UX fit against the Apple Health theme reset, then run full
  `pnpm run validate` + `test:run` (mobile) and finish AGENTS.md/
  DECISIONS.md/ROADMAP.md/HANDOFF.md consistency pass.
- Claude: done — see "Paket 5 — Compound Library mobile" below. No
  further work this session.

## Faz A progress (ZCode/GLM pass — 2026-07-17 evening)

### Done this pass (mobile UI, all typecheck-clean, all now COMMITTED):

- **Paket 2 — AddSheet peptide-first** — commit `85b84cb6`
  (`src/components/AddSheet.tsx`, `src/components/Icon.tsx`,
  `__tests__/components/AddSheet.test.tsx`; App.tsx's handler half is in
  `9ac5f457` alongside Paket 5, see note there): main grid now Log Dose
  / Lab Result / Safety / Measurements; legacy Sparky actions (Food /
  Exercise / Scan Food / Ask Sparky) behind a "More" submenu. New
  `syringe` icon. 3 new handlers in App.tsx route to Today / Biomarkers
  / Track. Tests updated + 3 new tests.
- **Paket 3 — Track → Logbook** — commit `38fc2b5a`
  (`src/screens/DiaryScreen.tsx`): Dose/Medication pinned+grid
  categories now route to Today (dose-log center) instead of Protocol;
  use `syringe` icon. Track tab was already peptide-first
  (`STAGE_3_LIFESTYLE_VISIBLE = false`, nutrition hidden); only
  navigation targets corrected.
- **Paket 4 — Onboarding ÆTERNA** — commit `08c1a4e1`
  (`src/screens/OnboardingScreen.tsx` +
  `__tests__/screens/OnboardingScreen.test.tsx`): welcome rebranded
  SparkyFitness→ÆTERNA, "self-hosted fitness tracker"→"Your longevity
  operating system", one-line value prop + "Free, forever — no
  subscription, no ads, no tracking". Trust-verification copy added to
  "Learn more": research/educational only, consult a clinician. Server
  URL label + placeholder + error message rebranded. Page 2 header
  "Connect to SparkyFitness"→"Connect to your ÆTERNA server". Auth
  mechanics (authService, MfaForm, saveServerConfig) untouched.
- **Paket 6 — Theme reset** — commit `ab7a785b`
  (`global.css`, `src/theme/aeternaTokens.ts`): light palette
  ivory/gold → Apple Health style white/indigo (cooler, more saturated
  blue accent); serif display → system sans-serif; tighter radii
  (10/16/22 → 8/12/16); shadow opacity 0.05→0.08. Visual direction now
  matches "~55% Apple Health clarity" target.
- **Paket 7 — Docs**: this HANDOFF.md update is part of it; AGENTS.md/
  DECISIONS.md/ROADMAP.md consistency pass and full `pnpm run
  validate`/`test:run` still need ZCode's review pass (see "Next
  tasks").

These four commits were ZCode/GLM's own already-finished work, left
uncommitted in the working tree when GLM's token ran out mid-session.
hy3/Claude found them still dirty, verified they were typecheck/lint
clean (they were — no changes made to their content), and committed
each as its own commit under the same Paket description ZCode's own
handoff text above already used, so authorship/scope stays traceable
to ZCode's actual work rather than being folded into hy3/Claude's own
commits.

### hy3/Claude backend pass — COMPLETED 2026-07-17 late evening

Everything ZCode observed as "untracked/modified, not yet reviewed" in
the paragraph below is now committed cleanly, typecheck/lint/test-green,
each as its own commit on `overnight/aeterna-product-integration`:

- `dacb4053` — **C2**: `useSyncHealthData.ts` foreground sync now also
  calls `saveLastSyncOutcome` (was only advancing `lastSyncedTime`),
  matching `backgroundSyncService.ts`'s own pattern.
- `3f6ab97e` — **C3**: `CreatePenForm.tsx` now shows a visible error
  ("Doses must be a whole number 0 or greater") instead of silently
  dropping an invalid total-doses entry to `null`.
- **C1** (no commit — a decision, not a code change): confirmed
  `docs/STAGE_1B_DEVICE_VERIFICATION.md` is already correctly placed in
  the OUTER `AETERNA/docs/` (this repo's own `aeterna-os/AGENTS.md`
  states `docs/` there is the Nuxt/Docus docs site, and every other
  ÆTERNA planning doc already lives outer-repo) — no `git mv` needed.
- `40f7c751` — **B1, compound library backend**: new `compounds` table
  (migration `20260717160000_add_compound_library_schema.sql`) with a
  nullable `user_id` — NULL rows are seeded/system reference compounds,
  readable by every authenticated user and immutable through the API;
  non-NULL rows are user-authored custom compounds, owner-read/write
  only. RLS is a bespoke policy (NOT `create_medication_policy`, which
  has no NULL-owner branch) mirroring `meal_types`' own
  system-row/owner-row split, scoped to the `has_medication_*` functions.
  Full CRUD at `/api/v2/compounds` (`compoundLibraryRoutes.ts` +
  `compoundLibraryRepository.ts` + `compoundLibrarySchemas.ts`), a
  **10-compound Open Peptide Dataset (CC BY 4.0) starter seed** (BPC-157,
  TB-500, Tesamorelin, Ipamorelin, CJC-1295, Semaglutide, Tirzepatide,
  MOTS-c, Epitalon, GHK-Cu — real `source_url`s, `evidence_tier`
  per-compound), export coverage in `stage1aExportRepository.ts`, RLS-
  matrix classification (`custom` domain, matching `meal_types`'
  precedent), 13 route tests. **No `shared/src/schemas/database/
  Compounds.zod.ts`** — matches the existing, pre-existing gap that
  `biomarker_results`/`data_conflicts` also lack one (a real, documented
  inconsistency in this codebase, not new).
- `ac38c849` — **B2, reconstitution pure functions**:
  `shared/src/utils/reconstitution.ts` — `calculateConcentration`,
  `calculateDoseVolume`, `calculateRemainingDoses`. Pure, mg/mL and mL
  math matching `medication_pens`' own columns; null-over-garbage-value
  on invalid input, same convention `CreatePenForm.tsx` already uses.
  **Not wired into any screen** — ZCode/GLM decides where reconstitution
  math should surface in the vial/pen UI.
- `2d7779cd` — **A1 / S2-02, conflict-indicator component**:
  `src/components/aeterna/ConflictIndicator.tsx` (+ `useDataConflict.ts`
  hook + `dataConflictsApi.ts` client + `types/dataConflicts.ts`).
  Compact "N conflicts" badge for a metric's open DataConflicts, renders
  nothing for 0. **Deliberately standalone — NOT imported into
  BiomarkersScreen or any screen.** ZCode/GLM decides placement and what
  `onPress` opens.
- `02d0d8bb` — **A2 / S2-03, biomarker ingestion hardening**: two
  additive, non-clinical pieces on top of S2-01's existing detection —
  (a) `dataConflictDetection.ts`'s `normalizeUnit()` now also collapses
  notation-only unit variants (µg/mcg/ug, whitespace around `/`) so
  identical units written differently stop spuriously triggering
  `unit_mismatch` — genuine cross-system differences (mg/dL vs mmol/L)
  still correctly flag; (b) new `biomarkerNormalization.ts`'s
  `parseReferenceRangeText()`, a pure parser for printed reference
  ranges ("70-100", "<40", ">=3.5", "70 to 100") — never guesses, not
  yet wired into any route (a foundation for a future auto-fill-on-entry
  enhancement).

**Verification**: server `pnpm run typecheck`/`pnpm exec eslint` clean;
61 server tests green across the touched/new suites (`vitest`). Mobile
`pnpm run typecheck` clean, `pnpm run lint` (`--max-warnings 0`) clean,
`ConflictIndicator.test.tsx` (7 tests) and `reconstitution.test.ts` (14
tests) green. **No live-Postgres verification of the new `compounds`
migration or RLS policy** — same standing blocker as every prior pass
(no docker/.env/psql in this environment); code-reviewed correct against
the exact `meal_types` precedent, not DB-executed.

### Injection logging flow (hy3 — NEW, this pass)

The "Log injection" action previously stubbed by Claude/ZCode now works
end-to-end. AddSheet's "Log Dose" CTA routes to a new `InjectionLogScreen`
instead of Today.

- `src/screens/InjectionLogScreen.tsx` (NEW): pick a scheduled dose
  (from `useProtocolShell(activeDate).scheduledToday`), pick a pen/vial
  (`useMedicationPens`), shows the drawn volume from
  `calculateDoseVolume(doseMg, pen.concentration_mg_ml)` (shared
  reconstitution math), pick a body site (`InjectionSitePicker`), then
  logs via `createInjection({ medication_id, pen_id, site, dose_mg,
  deduct_pen: true })`.
- `src/components/aeterna/InjectionSitePicker.tsx` (NEW): 8 rotation
  sites — abdomen L/R, thigh L/R, deltoid L/R, glute L/R — with a
  rotation hint. Pure UI, no navigation of its own.
- `src/services/api/medicationsApi.ts`: new `CreateInjectionInput` +
  `createInjection()` → `POST /api/v2/medications/injections`;
  `CreateMedicationEntryInput` gained optional `site` + `entry_type`.
- `src/hooks/useLogDoseAction.ts`: `LogDoseActionVars` gained optional
  `site` + `entryType` ('injection' marks parenteral entries); passed
  through to `createMedicationEntry`.
- `src/types/navigation.ts`: `RootStackParamList` gained
  `InjectionLog: { date?: string }`.
- `App.tsx`: `InjectionLogScreen` mounted as a `Stack.Screen`;
  `handleLogDose` now navigates to `InjectionLog` (was `Tabs → Today`).
- Backend already supported this: `POST /api/v2/medications/injections`
  (SparkyFitnessServer `injectionRepository.createInjection`) increments
  the pen's `doses_used` and flips status to `finished`/`reorder` when
  `deduct_pen` is true. `medication_entries.site` column already exists.
- Minimal screen touch: only `App.tsx` (mount + handler) and the new
  screen/component; no changes to TodayScreen layout or other screens.

**Verification (this pass)**: mobile `tsc --noEmit` clean; `eslint`
clean on touched files. (Full `pnpm run test` not run — Jest/babel-jest
dependency gap noted in prior passes; typecheck/lint green.)

### Compound library bulk seed — Open Peptide Dataset (CC BY 4.0) (hy3, this pass)

The `compounds` reference catalog was expanded from the 10-row starter set
to a ~47-compound bulk seed of the Open Peptide Dataset (Peptides Institute,
CC BY 4.0, commercial use with attribution).

- `SparkyFitnessServer/db/migrations/20260718000000_seed_open_peptide_dataset.sql`
  (NEW): inserts ~47 reference compounds across GLP-1/incretin, GH
  secretagogues, tissue-repair, melanocortin, cognitive, metabolic,
  hormone, cosmetic, and other research categories. Every row: `source =
  'open_peptide_dataset'`, `source_url` → verified licensed reference
  (https://peptidepedia.org or https://pepmod.com, both with owner written
  permission per DECISIONS.md 2026-07-17), short source-attributed
  `mechanism_summary` / `monitoring_guidance` (never medical advice,
  AGENTS.md "Evidence Before Protocol"), `evidence_tier` per regulatory
  status. `cas_number`/`pubchem_id` only where publicly established, else
  NULL (no fabricated data). Ends with `ON CONFLICT DO NOTHING` keyed on
  `idx_compounds_seeded_name_unique` → idempotent re-apply, safe to
  co-exist with the starter seed and later custom compounds.
- `SparkyFitnessServer/tests/compoundSeed.test.ts` (NEW): DB-free structural
  test — asserts the seed declares `ON CONFLICT DO NOTHING`, inserts ≥45
  rows, attributes every row to a verified licensed source, uses the
  `open_peptide_dataset` tag, and contains no invented clinical claim.
  **5/5 passed.** (Live-Postgres application of the migration remains the
  standing blocker — no docker/.env/psql in agent environment.)
- `docs/COMPOUND_SEED_ATTRIBUTION.md` (NEW): CC BY 4.0 attribution record,
  honesty/scope rules, idempotency note, and verification pointer.

**Verification (this pass)**: server `tsc --noEmit --incremental` clean;
`eslint tests/compoundSeed.test.ts` clean; `vitest run tests/compoundSeed
.test.ts` → 5/5 passed.

### Paket 5 — Compound Library mobile (hy3/Claude, filling in for ZCode)

Owner explicitly authorized crossing into screen/layout files for this
one task, since ZCode's token was exhausted and the owner asked for
Paket 5 to proceed rather than wait ~2 hours. Two commits:

- `6d9e5d17` — foundation: `src/types/compounds.ts`,
  `src/services/api/compoundLibraryApi.ts` (`fetchCompounds(search?,
  category?)`, `fetchCompound(id)`), `src/hooks/useCompounds.ts`
  (`useCompounds` list with a 300ms debounced search, `useCompound`
  detail). Mirrors the existing `biomarkerResultsApi.ts`/
  `useBiomarkerResults.ts` pattern exactly.
- `9ac5f457` — UI: `src/screens/CompoundLibraryScreen.tsx` (search bar
  + horizontal category-chip row — All/Peptide/Hormone/GLP-1 &
  Metabolic/Supplement/Other — + evidence-tier-badged compound cards,
  root-stack library drill-in) and `src/screens/CompoundDetailScreen.tsx`
  (full monograph: mechanism, bulleted monitoring guidance, tappable
  source link + attribution, CAS/PubChem/DrugBank identifiers when
  present). Both carry a persistent "Education and reference only — not
  medical advice, diagnosis, or a prescription" disclaimer (AGENTS.md
  "Evidence Before Protocol") — every displayed field is either a
  literal value from the compound record or a fixed, generic
  evidence-tier description, nothing computed or inferred.
  `LibraryShellScreen.tsx`'s Compounds row now navigates to
  `CompoundLibrary` instead of showing "Preparing"; the other five
  Browse sections (Evidence, Biomarkers, Guides, Saved, Protocol
  templates) are untouched and still honestly say "Preparing" — no
  real backend exists for them yet. Added `CompoundLibrary: undefined`
  and `CompoundDetail: { id: string }` to `RootStackParamList`, two
  `<Stack.Screen>` entries in `App.tsx` (`createStackScreenOptions`,
  `headerBackTitle` set on both per the existing pattern), and both
  routes to `NATIVE_TABS_ROUTE_EXCLUSIONS` in
  `__tests__/navigation/nativeHeaderContract.test.ts` (same
  root-stack-drill-in classification as `FoodsLibrary`/`FoodDetail`).

**Not done in this pass** (read-focused V1, matching what was actually
asked): no create/edit UI for user-authored custom compounds (the
backend supports POST/PUT/DELETE at `/api/v2/compounds`, but no mobile
form calls them yet); seed data is still the 10-compound Open Peptide
Dataset starter set from the backend pass, not further expanded —
pulling and vetting real additional compound content from the other
licensed sources named in `docs/DECISIONS.md` (peptidepedia.org,
pepmod.com, Pepty/PeptIQ/Protocol/Peppedia/Lifehackr/Longevity Labs)
needs either live web access this session didn't reliably have, or a
dedicated follow-up pass — each new compound's mechanism/evidence-tier/
monitoring-guidance must be a real, sourced fact, never invented, per
AGENTS.md's "Evidence Before Protocol", so this was deliberately left
as a flagged gap rather than rushed.

**Verification**: mobile `pnpm run typecheck` and `pnpm run lint`
(`--max-warnings 0`) clean across the whole repo (not just touched
files). Targeted tests green: `nativeHeaderContract.test.ts` (7),
`LibraryShellScreen.test.tsx` (5, updated — the "Preparing" count
assertion now expects 5, not 6, plus a new navigation test),
`CompoundLibraryScreen.test.tsx` (7 new), `CompoundDetailScreen.test.tsx`
(7 new) — 26 tests, all passing. The full `pnpm run test:run` /
`pnpm run validate` suite was **not** run end-to-end this pass (single
Jest files were already taking several minutes each in this
environment); this is the one item Paket 7's validation pass should
still cover.

### Paket 7 — Conflict wire-up + Reconstitution UI (hy3/Claude, 2026-07-18)

Owner-directed Paket 7 wire-up pass (mobile only; screen edits limited to
BiomarkersScreen + CreatePenForm/new sheet, per the directive). Two
commits on top of ZCode's injection-flow commits:

- `8cc1d772` — **ConflictIndicator + resolution wired into
  BiomarkersScreen** (S2-02). `useDataConflicts('open')` surfaces open
  DataConflicts about lab results: a `ConflictIndicator` badge on each
  affected lab-result row, plus a new
  `src/components/aeterna/ConflictResolutionCard.tsx` in a "Data
  conflicts" subsection that resolves a conflict by selecting a canonical
  candidate (`useResolveDataConflict`) or dismissing it
  (`useDismissDataConflict`). Row↔conflict matching uses the same
  trim+lowercase `metric_key` normalization the server applies. Copy is
  strictly data-management — never interprets which value is medically
  correct; server contract is selection-not-merge, nothing deleted. 4 new
  BiomarkersScreen tests.
- `ba220562` — **ReconstitutionSheet in the vial/pen form**. New
  `src/components/ReconstitutionSheet.tsx` (bottom sheet) driving the
  shared `calculateConcentration` / `calculateDoseVolume` helpers: peptide
  mass + diluent volume + optional desired dose → concentration, volume to
  draw, whole doses per vial. Opened from a "Reconstitution calculator"
  entry point in `CreatePenForm`; "Use concentration" prefills the form's
  concentration field. Shows "—" for missing/invalid input (never
  guesses); "calculation aid only — not medical advice" disclaimer.
  `jest.setup.js`'s global `@gorhom/bottom-sheet` mock gained
  `BottomSheetTextInput`. 6 ReconstitutionSheet + 1 CreatePenForm tests.
- **S2-02/S2-03 review** (no code change): both correctly scoped and
  honest. ConflictIndicator is a pure count badge (nothing for 0, no
  medical claim); normalizeUnit is notation-only (not conversion);
  parseReferenceRangeText never guesses and remains unwired (foundation).
  Medical-advice framing present where user-facing.

**Verification (this pass's slice):** mobile typecheck clean *for these
files* (see the tsc blocker below); targeted eslint clean after fixing a
React Compiler `preserve-manual-memoization` rule in ReconstitutionSheet
(dropped an unneeded `useCallback`); 37 tests green across the 4 affected
suites (BiomarkersScreen, ReconstitutionSheet, CreatePenForm,
ConflictIndicator).

**⚠ Repo-wide `tsc` BLOCKER owned by ZCode, NOT fixed by this pass:**
`src/hooks/useLogDoseAction.ts` lines 56-57 reference an undefined `vars`
(`vars.site` / `vars.entryType`) — a bug committed in ZCode's injection
flow (around `655e78e8`). It is the *only* typecheck error in the repo and
breaks the whole-repo `tsc --noEmit`. Left untouched deliberately:
useLogDoseAction.ts is ZCode's actively-owned dose-logging file and the
intended variable shape is theirs to define — a two-agents-one-file edit
risked a worse collision. **ZCode: fix these two references (likely the
mutation-variable param name) to green the repo typecheck.**

**Reconstitution overlap to reconcile:** ZCode's new `InjectionLogScreen`
(`09bcf50a`) also performs reconstitution in its dose→pen→reconstitution
→site→log flow. This pass's `ReconstitutionSheet` is the vial/pen-creation
aid (the assigned scope). Two reconstitution surfaces now exist; the owner
should decide whether to unify them (e.g. have InjectionLogScreen reuse
`ReconstitutionSheet`, or keep them as distinct create-time vs log-time
aids).

### Still open (handoff to ZCode/GLM):

- **Compound create/edit UI** (POST/PUT/DELETE) — backend-ready,
  mobile-deferred (see above).
- **Expand the compound seed set** beyond the 10-compound starter using
  the licensed reference sources — flagged gap, not started.
- **Paket 7 — Full validation**: end-to-end `pnpm run validate` +
  `test:run` (mobile), `validate` + `test` (server). Mobile Jest
  environment note from ZCode's own earlier pass (`babel-jest` missing)
  did not reproduce in hy3/Claude's own Jest runs this session (dozens
  of test files ran normally) — likely stale or session-specific; worth
  a quick re-check before treating it as still blocking, but not
  re-verified end-to-end here.


## Unchanged blockers

- Live-Postgres application of Stage 1A migrations (incl. S2-01
  DataConflict tables and this pass's `compounds` table) — no
  docker/.env/psql in agent environments. `db_schema_backup.sql` and
  `@workspace/shared` Zod schemas for all Stage 1A + S2-01 + `compounds`
  tables remain unsynchronized (the `compounds` table intentionally has
  no `Compounds.zod.ts` yet, matching the pre-existing gap for
  `biomarker_results`/`data_conflicts` — not a new inconsistency).
- Stage 1B device verification — no physical iOS/Android device access.
- `metro.config.js` diff: RESOLVED — committed as `e3f9fd40` (Windows
  Metro DependencyGraph crash fix, scoped `watchFolders`).



## Approved task

Owner-directed sequence: (1) verify and integrate the HY3 RLS-matrix fix
prepared on a sibling worktree, (2) fix two Android bugs reported from a
real device run (ElevationGained permission/log-storm, JSON/HTML response
parsing), with regression tests and honest Stage 1B doc updates, (3) read
canonical Stage 2A scope and proceed autonomously through non-device Stage
2A slices — explicitly forbidding inventing Stage 2A scope if it isn't
canonically defined.

## Work completed this pass

### HY3 RLS-matrix fix — cherry-picked as `059140c0`

Located on worktree `AETERNA/aeterna-os-rls-fix` (branch
`fix/rls-matrix-stage1a-tables`, a linked git worktree of this same repo —
shares object storage, so its commit was visible without a fetch). Commit
`fa6b0629` ("classify Stage 1A Protocol Core/Safety/Biomarker tables in RLS
permission matrix") adds exactly 10 lines to
`SparkyFitnessServer/tests/rlsPermissionMatrix.integration.test.ts`,
classifying the 8 new Stage 1A tables (`biomarker_results`,
`protocol_baselines`, `protocol_eligibility_assessments`, `protocol_items`,
`protocol_versions`, `protocols`, `safety_event_updates`, `safety_events`)
into the existing `'medication'` RLS bucket. Verified: not already an
ancestor of canonical HEAD; touches only the intended file; canonical
HEAD's own divergent commits (S1B-03 through S1B-07) never touch this
file, so no overlap risk. Cherry-picked clean, no conflicts.
`SparkyFitnessMobile/metro.config.js` was untouched by this operation
(confirmed before and after).

Non-DB server validation: `pnpm run typecheck` passed. The RLS matrix
integration test itself is gated behind a live-DB `runIf` and could not be
executed (same Postgres-unavailability blocker as every prior pass — see
"Stage 1A production-application chores," unchanged, re-confirmed not
re-litigated this pass).

### Android fix A — ElevationGained permission log storm

See `docs/STAGE_1B_DEVICE_VERIFICATION.md` §6.A for the full root-cause
writeup. Summary: Health Connect's fallback read-retry cascade
(`readHealthRecordsFallback` in
`SparkyFitnessMobile/src/services/healthconnect/index.ts`) had no
short-circuit for a deterministic permission-denied `SecurityException`,
so one stable failure cascaded into 2 day-windows × 24 hourly windows = 48
redundant native calls and `ERROR` logs. Separately,
`requestHealthPermissions` trusted `requestPermission()`'s own response
without cross-checking the authoritative `getGrantedPermissions()` query,
so the app could report "All 35 metric permissions granted" while a
record type was still genuinely unreadable.

Fixed: new `isPermissionDeniedError` classifier short-circuits the
fallback cascade after one call, logs one `WARNING` per metric per sync
run; `requestHealthPermissions` now cross-checks `getGrantedPermissions()`
before reporting a full grant. Manifest/permission declarations were
**not** changed (both `app.config.ts` and the compiled AndroidManifest
already declared `READ_ELEVATION_GAINED`, pre-existing, not new this
pass) — this is a pure JS/TS fix, no native rebuild required for the fix
itself to take effect (Metro/JS reload is sufficient). Whether the
device's actual Health Connect grant state for this permission is
currently correct is a separate, device-side fact this session cannot
verify; if the honest re-check still shows it denied after a fresh
"Enable All" or per-metric toggle, the next step is Android Settings →
Health Connect → App permissions (not a rebuild).

### Android fix B — JSON Parse error ("Unexpected character: <")

See `docs/STAGE_1B_DEVICE_VERIFICATION.md` §6.B for the full root-cause
writeup. Summary: `apiFetch` (`apiClient.ts`) and `healthDataApi.ts`'s
upload path both called `response.json()` unconditionally on any 2xx
response. Any 2xx response with an HTML body (wrong server URL landing on
Metro's dev server, a proxy/login page, a captive portal) crashed with an
opaque SyntaxError instead of a diagnosable error — reproducing across
every endpoint routed through these two shared clients, matching the
reported spread exactly (Preferences, timezone bootstrap, Health Sync
upload, Medications, Daily Summary, Measurements, Symptoms).

No hardcoded wrong URL exists anywhere in the repository (confirmed by
grep across `app.config.ts`, onboarding, storage) — this is not a
repo-config bug. The correct backend port is **3010**
(`docker/.env.example`); this session observed a live Expo/Metro dev
server on port **8083** during investigation, which is the most likely
candidate for what the device's configured server URL is actually
pointing at, but this session has no device access to confirm the
device's actual saved URL.

Fixed: new `parseJsonResponse<T>()` (`src/services/api/errors.ts`)
replaces every bare `response.json()` call in `apiClient.ts` and
`healthDataApi.ts`. Parses the body as text and attempts `JSON.parse`
regardless of Content-Type (so a real success with a missing/mislabeled
header is never rejected); on genuine failure throws one structured,
secret-free `ApiError` (endpoint, status, content-type, HTML/empty/
non-JSON classification, ≤200-char body preview) marked
`nonJsonResponse: true`. `queryClient.ts`'s retry predicate treats that
marker as non-retryable regardless of status code, so a misrouted request
fails once per query, not 3×. Test doubles that only implement `.json()`
(not the full `Response` shape) transparently fall back to the plain
`.json()` path, so this required zero test-mock-shape migration for files
whose tests use that pattern — only files with real, fetch-mock-based
tests exercising the affected code paths needed their mocks completed
with a `.text()` method (see "Changed/dirty files").

### Stage 1B verification doc

`docs/STAGE_1B_DEVICE_VERIFICATION.md` gained §6, a dated addendum
recording both bugs, their root causes, fixes, and — explicitly — that
neither fix was re-verified on the physical device that reported them
(no device access in this environment). S1B-05's DataConflict scope
question (flagged to the owner earlier this session, before this
directive) is not re-litigated or silently resolved here; it remains an
open, explicitly-flagged gap.

### Stage 2A scope check — stopped, not invented

`docs/ROADMAP.md` defines Stage 2 as a single undivided stage ("Lab and
action intelligence") with a large deliverable set (confirmed PDF/CSV lab
import, laboratory provenance, reference ranges, derived marker formulas,
longitudinal comparison, Response Timeline, Action Plans, Recommendation
Lifecycle) and its own entry gate: **"S1B passed and biomarker provenance/
conflict behavior is stable."** Grepped `docs/ROADMAP.md`,
`docs/DECISIONS.md`, `docs/HANDOFF.md`, `docs/MASTER_PRODUCT_BRIEF.md`,
and `docs/PRODUCT_SPECIFICATION_V1.md` for any "Stage 2A"/"Stage 2B" split
— none exists. Only Stage 1 has an owner-approved A/B split
(`docs/DECISIONS.md`, 2026-07-15, "Split Stage 1 into Protocol Core and
Health Sync"); no equivalent decision exists for Stage 2.

Given `AGENTS.md`'s explicit instruction not to invent scope, and that
Stage 2's own entry gate is arguably not cleanly met (S1B-05 ships a
narrow, tested weight-conflict note rather than the `DataConflict` domain
`docs/ROADMAP.md`'s Stage 1B Deliverables names by that exact term — see
`docs/DATA_MODEL.md`'s `DataConflict` entity and this session's earlier
three-part assessment to the owner), implementation work did not proceed
into Stage 2. See "Next task."

## Changed/dirty files and ownership

**`aeterna-os`**, all committed this pass (`1ed457e1`, `acfc86d7`):

- `SparkyFitnessMobile/src/services/healthconnect/index.ts` — permission-
  denied classifier + fallback short-circuit; `requestHealthPermissions`
  cross-check.
- `SparkyFitnessMobile/src/services/api/errors.ts` — `parseJsonResponse`,
  `ApiError.nonJsonResponse`.
- `SparkyFitnessMobile/src/services/api/apiClient.ts`,
  `src/services/api/healthDataApi.ts` — use `parseJsonResponse`.
- `SparkyFitnessMobile/src/hooks/queryClient.ts` — retry predicate skips
  `nonJsonResponse` errors.
- `SparkyFitnessMobile/jest.setup.js` — global `react-native-health-connect`
  mock gained `getGrantedPermissions`.
- Test files: `__tests__/services/healthconnect/index.test.ts`,
  `__tests__/services/api/errors.test.ts`, `__tests__/hooks/queryClient.test.ts`,
  `__tests__/services/api/apiClient.test.ts`, `__tests__/services/apiClient.test.ts`,
  `__tests__/services/healthDataApi.test.ts`, `__tests__/services/preferencesApi.test.ts`,
  `__tests__/services/measurementsApi.test.ts`, `__tests__/services/foodEntriesApi.test.ts`,
  `__tests__/services/foodEntryMealsApi.test.ts`, `__tests__/services/foodsApi.test.ts`,
  `__tests__/services/goalsApi.test.ts`, `__tests__/services/mealsApi.test.ts`,
  `__tests__/services/profileApi.test.ts`, `__tests__/services/exerciseApi.test.ts`,
  `__tests__/services/externalFoodSearchApi.test.ts`,
  `__tests__/services/api/exerciseApi.test.ts`,
  `__tests__/services/api/externalExerciseSearchApi.test.ts`,
  `__tests__/services/api/workoutPresetsApi.test.ts` — completed hand-written
  fetch-response mocks (added `.text()` alongside/instead of `.json()`) for
  files whose tests exercise real `apiFetch`-routed code. Two files
  (`authService.test.ts`, `aiSettingsApi.test.ts`) were initially touched by
  a batch script, found to test raw-fetch code that does **not** route
  through `apiFetch`, and reverted via `git checkout --` before verification
  — confirmed clean.

**Server**: `SparkyFitnessServer/tests/rlsPermissionMatrix.integration.test.ts`
via the `059140c0` cherry-pick (committed).

**`SparkyFitnessMobile/metro.config.js`** — still has the same pre-existing,
unexplained `config.watchFolders` diff from before this pass. Confirmed
untouched by every operation this pass (diffed before/after the RLS
cherry-pick and again at the end). Still needs owner review before it is
committed or discarded — unchanged from every prior handoff's note.

**Outer AETERNA repo** — `docs/HANDOFF.md` (this file) and
`docs/STAGE_1B_DEVICE_VERIFICATION.md` (§6 added) updated, left
uncommitted for the owner per the established pattern.

## Verification

- Server: `pnpm run typecheck` passed (SparkyFitnessServer). Full
  `pnpm run validate`/`pnpm test` not run (would include the live-DB-gated
  RLS integration test, blocked — see below).
- Mobile: `pnpm run typecheck` clean. `pnpm run lint` (`expo lint src
  App.tsx index.js __tests__ --max-warnings 0`) clean, zero errors/
  warnings. Consolidated regression run across all 24 touched/adjacent
  test suites: **574/574 tests passed**. Committed as `1ed457e1` (Health
  Connect fix, 3 files) and `acfc86d7` (API hardening fix, 22 files).
- Two real scripting mistakes were made and caught by running tests, not
  assumed: (1) a batch `json:`→`text:` mock conversion incorrectly touched
  3 DELETE-endpoint tests in `api/exerciseApi.test.ts` where
  `JSON.stringify(undefined)` evaluates to `undefined` (not a string),
  crashing `parseJsonResponse`'s length check — fixed to `Promise.resolve('')`;
  (2) the same batch script touched `estimateFoodPhoto`'s 3 success-path
  mocks in `externalFoodSearchApi.test.ts`, a function that calls
  `response.json()` directly (not via `apiFetch`) — reverted those 3 back
  to `.json()`. Both caught by the actual test run failing, not by
  inspection alone.
- **No on-device verification of either Android fix** — see
  `docs/STAGE_1B_DEVICE_VERIFICATION.md` §6. Requires an owner rebuild
  (native permission state) and manual retest.
- **No live-database verification** — unchanged blocker, re-confirmed not
  re-attempted (see below).

## Stage 1A production-application chores (still blocked, not re-attempted with new evidence this pass)

Unchanged from every prior handoff. No docker, no `.env`, no local
Postgres service, no `psql`, port 5432 unreachable — this pass relied on
the prior pass's evidence rather than re-running the checks, since nothing
in this pass's scope touches server infrastructure. Still blocks: applying
the 8 Stage 1A migrations, `DB Backup.cmd`, booting the server, exercising
real API flows, and the RLS integration test's live-DB path (including the
newly cherry-picked classification rows — code-reviewed correct, not
DB-executed).

Also still outstanding: the shared `@workspace/shared` Zod schemas for the
8 new Stage 1A tables were never added (needs a live schema to
generate/validate against).

## Decisions and open risks

- **Stage 2 entry gate is not cleanly met.** `docs/ROADMAP.md`: "S1B
  passed and biomarker provenance/conflict behavior is stable." S1B-05
  ships a narrow, honest, tested weight-only conflict *note* — not the
  `DataConflict` domain (persisted entity, status lifecycle, user
  resolution) `docs/ROADMAP.md`'s own Stage 1B Deliverables name by that
  exact term. This gap was already surfaced to the owner earlier this
  session (a dedicated three-part assessment); it is not re-litigated or
  silently closed here. Proceeding into Stage 2 implementation without an
  owner decision on this point would risk building on an unstable
  foundation the exit gate itself warns about.
- **"Stage 2A" is not a canonical scope.** Only "Stage 2" (undivided)
  exists in `docs/ROADMAP.md`. Inventing a sub-scope was explicitly
  forbidden by this pass's own instructions and by `AGENTS.md`'s general
  scope-control rules. No Stage 2 implementation work was attempted.
- **`metro.config.js`'s uncommitted diff** remains unexplained and
  unresolved — same open item as every prior handoff.
- **Live-DB application of Stage 1A migrations remains blocked** — hard
  external constraint, unchanged.
- **Unchanged from every prior handoff:** the iOS HealthKit read-permission
  limitation is real and permanent (not a gap to fix); S1B-08 on-device
  checklist has still not been run on any physical device by any agent
  session; Stage 0 exit-gate evidence items remain formally unresolved.

## Next task

Two independent next tasks, in priority order:

1. **Owner decision needed before Stage 2 work begins:** does the
   Stage 2 entry gate's "biomarker provenance/conflict behavior is
   stable" language require building the full `DataConflict` domain
   (persisted entity + resolution workflow) before Stage 2 starts, or is
   the current narrow conflict-note sufficient with an explicit,
   recorded scope-reduction decision in `docs/DECISIONS.md`? Once
   resolved, and once the owner names what "Stage 2A" (or the first Stage
   2 slice) should concretely cover, implementation can proceed
   autonomously the same way S1B-01–S1B-07 did.
2. **Rebuild and retest both Android fixes on the physical device that
   reported them** — ElevationGained should no longer log-storm and
   should honestly report partial (not full) permission coverage; API
   calls hitting a non-JSON response should surface one clear, structured
   error instead of crashing on `response.json()`. If the device's
   configured server URL turns out to be pointing at Metro's port (8083)
   rather than the Express server's port (3010), correct it in
   Settings → Server.

Unchanged, lower-priority background items: run the full
`docs/STAGE_1B_DEVICE_VERIFICATION.md` checklist; apply Stage 1A
migrations to a live Postgres instance once reachable; resolve
`metro.config.js`'s diff with the owner.
