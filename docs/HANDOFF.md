# ÆTERNA handoff

## State

- Status: `IN PROGRESS` — owner has made the Stage 1A exit-gate decision
  (`docs/DECISIONS.md` 2026-07-16): keep Stage 1A open and implement
  canonical Protocol Core completion work (S1A-16 through S1A-26) before
  Stage 1B. This session is mid-execution; this HANDOFF.md section will be
  rewritten with final state when this pass ends.
- Active stage: **Stage 1A — ÆTERNA Foundation & Rebranding (Protocol Core)**, `IN PROGRESS`; exit gate reviewed and **not yet formally passed** — see `docs/STAGE_1A_EXIT_GATE_REVIEW.md`
- Application repo: `AETERNA/aeterna-os`, branch `overnight/aeterna-product-integration`, HEAD `15b03c36` (verified 2026-07-16; superseded by further commits in this session — see the in-progress Stage 1A completion work below)
- Last agent: Claude
- Updated: 2026-07-16, Europe/Istanbul

## Approved task

1. Continue `docs/UX_TRANSFORMATION_REVIEW.md`'s UX-01–UX-18 slice sequence
   autonomously (UX-01–UX-15 complete as of this handoff).
2. Diagnose and fix live bugs on request (Health Connect fix, below).
3. Owner-directed Stage 1A hardening/product-alignment pass: (a) fix real
   bugs across already-built UX-01–UX-15 surfaces, no new roadmap scope;
   (b) produce a compound-content governance design document (no
   implementation); (c) produce a Stage 1A exit-gate readiness review with
   an explicit Stage 1B recommendation.

## Work completed since HEAD `6b2dd592` (prior handoff)

### Health Connect fix — `6b2dd592`

Fixed repeated "Failed reading OxygenSaturation: Health Connect client is
not initialized" log spam (up to hundreds of lines per sync, ending in
"Failed reading 159 fallback OxygenSaturation window(s)"). Root cause:
nothing in the sync path guaranteed `initHealthConnect()` had run before
reads started, especially in the `expo-background-task` headless JS
context — every metric read then failed identically, and the existing
fallback-window retry logic (built for transient per-window failures) kept
splitting and retrying a failure that could never succeed. Fix caches the
"not initialized" state after first detection and short-circuits every
further native call (raw reads and cumulative aggregation, all record
types) until the next successful `initHealthConnect()`, with exactly one
calm `WARNING` log for the whole outage. Scoped entirely to
`SparkyFitnessMobile/src/services/healthconnect/index.ts`. 7 new tests;
full suite 77/77 (was 70); broader sync regression 92/92.

### Stage 1A hardening pass — `f0d34301`

Audited TodayScreen, ProtocolScreen, BiomarkersScreen, DiaryScreen/Track,
the write forms (CreatePenForm, CreateSymptomForm), and every shared
`components/aeterna/` component for state consistency, accessibility,
duplicated queries, and reuse gaps. Fixed 5 real, verified defects:

1. **TodayScreen**: Sleep/HRV/resting-heart-rate rows permanently showed
   "Calibrating" (implying incomplete data) even with a complete, real,
   current value, because `hasTrend` was derived from `points.length >= 2`
   and these three rows always pass `points: []`. Decoupled the state
   label from sparkline availability.
2. **ScheduledActionRow**: dose-logging rows wrapped the entire row
   (summary text + "Mark taken"/"Skip" buttons) in one `accessible={true}`
   container — VoiceOver/TalkBack collapse that into a single stop,
   making the buttons unreachable by screen reader. Dose logging was not
   actually completable with assistive technology. Fixed: the info row is
   now its own accessible summary; the buttons stay independently
   focusable.
3. **BiomarkersScreen**: "Measurements/Trend unavailable" states had no
   Retry action, unlike the identical pattern already on ProtocolScreen.
   Added matching Retry buttons.
4. **CreatePenForm**: Save had no guard, allowing a fully blank submission
   that would write an unidentifiable, empty vial/pen record — inconsistent
   with CreateSymptomForm's required-field gate. Now requires at least one
   field.
5. **TodayScreen + BiomarkersScreen**: both called
   `fetchHealthDisplayData('7d')` under two different ad-hoc query keys,
   doubling the native health read on every tab switch between them and
   risking inconsistent values between the two screens. Added a shared
   `healthDisplayQueryKey()` builder in `queryKeys.ts` (this codebase's
   established convention, which these two screens had bypassed).

Also closed a real coverage gap: `TodayScreen.tsx` — the app's primary
destination — had zero dedicated tests before this pass. Added
`__tests__/screens/TodayScreen.test.tsx` (6 tests), including a regression
test for finding #1 above. Full touched-surface + regression suite:
184/184 passing. typecheck and eslint clean on every touched file.

### Compound content governance — `docs/COMPOUND_CONTENT_GOVERNANCE.md` (new, uncommitted in outer repo — see below)

Product-design-only document (no code, no content, no migration) defining:
compound/intervention taxonomy, monograph content fields, editorial roles,
evidence-tier assignment criteria, the editorial/review workflow mapped
onto `docs/DATA_MODEL.md`'s already-canonical `publication_status` states,
versioning rules, regulatory-status handling (including the still-open
per-country question), AI-assisted-content boundaries, canonical source
strategy, reference policy, body-system and biomarker relationship rules,
and content ownership. Directly answers the "compound-content governance"
question `docs/DECISIONS.md`'s 2026-07-16 entry left open — the owner can
approve or amend it before UX-16 work is authorized.

### Stage 1A exit-gate review — `docs/STAGE_1A_EXIT_GATE_REVIEW.md` (new, uncommitted in outer repo — see below)

Checked every named criterion in `docs/ROADMAP.md`'s Stage 1A exit gate
against the actual codebase (not memory, not docs). Headline finding:
**three of the exit gate's eight "baseline → ... → weekly review" legs
don't exist as implemented features** — Baseline, Eligibility assessment,
and Protocol activation are all explicitly deferred (matches
`docs/DECISIONS.md`'s recorded decision, not an oversight), and a fourth,
Safety Event Workflow, has zero backend implementation. Also found and
verified: duplicate-dose-submission protection is client-only (no server
constraint); data export does not cover the three new medication/symptom
tables (deletion does, via cascade — verified table-by-table); Today
correctly works without health sync. Full detail, evidence, and an
explicit checklist for manual/device testing are in the document itself.
**Recommendation: Stage 1B is not yet ready to start** — not due to any
defect in Health Sync groundwork, but because Stage 1A's own exit gate has
not formally passed. Three options are laid out for the owner in the
document's §10.

## Changed/dirty files and ownership

**`aeterna-os`** — clean. The previously-flagged pre-existing
`SparkyFitnessMobile/package.json` / `pnpm-lock.yaml` `@expo/ngrok` diff
noted in every prior handoff is **no longer present** in the working tree
(`git diff HEAD` on both files is empty) — nothing needed excluding from
this session's commits.

**Outer AETERNA repo (this repo)** — `docs/HANDOFF.md` (this file),
`docs/COMPOUND_CONTENT_GOVERNANCE.md`, and
`docs/STAGE_1A_EXIT_GATE_REVIEW.md` are new/updated by this session and
**not committed** — per this project's established pattern, outer-repo
`docs/` commits are left for the owner given several files already show as
modified/untracked from sessions whose ownership was never resolved (see
every prior handoff's note on `docs/COMPETITIVE_UX_REPORT.md` and others).
This session did not touch or resolve any of those pre-existing files.

## Verification

- Health Connect fix: 77/77 (`healthconnect/index.test.ts`), 92/92 broader
  regression, typecheck + eslint clean.
- Hardening pass: 184/184 across the full touched-surface + regression
  suite, typecheck + eslint clean.
- **No on-device verification was performed this session** (no physical
  device access from this environment) — see
  `docs/STAGE_1A_EXIT_GATE_REVIEW.md` §7–8 for the specific manual and
  device testing checklists this leaves outstanding, most notably:
  VoiceOver/TalkBack reachability of the dose-action buttons (this
  session's fix should be confirmed under real assistive technology, not
  just the structural test), and reproducing the original Health Connect
  log-spam scenario to confirm the fix on a real Android device.

## Decisions and open risks

- No new `docs/DECISIONS.md` entry was added this session — none of this
  session's changes required a scope or architecture decision beyond what
  the owner already directed (bug fix, bug fixes to existing surfaces,
  and two new reference documents that make no unilateral product calls).
- **Open risk, elevated by this session's review:** Stage 1A's exit gate
  requires an owner decision among `docs/STAGE_1A_EXIT_GATE_REVIEW.md`
  §10's three options before Stage 1B (or any further roadmap slice) can
  proceed with a clear mandate. Proceeding as if Stage 1A were complete
  because UX-01–UX-15 are would misrepresent what the exit gate actually
  requires.
- **Open risk, unchanged from every prior handoff:** the outer-repo
  `docs/` changes flagged as uncommitted remain uncommitted and unreviewed
  by any session since they first appeared.
- **Open risk, unchanged:** `docs/ROADMAP.md`'s Stage 0 exit-gate items
  (reproducible builds, automated-test baseline, live HealthKit/Health
  Connect evidence) remain formally unresolved per
  `docs/STAGE_0_COMPLETION_SUMMARY.md`.

## Next task

Owner decision required — see `docs/STAGE_1A_EXIT_GATE_REVIEW.md` §10 and
§11 for the full basis. In order of what needs the owner first:

1. Choose how to treat the three missing exit-gate legs (accept the
   current "tracked interventions" substitute as sufficient, authorize
   Baseline/Eligibility/Protocol-activation/Safety-event as additional
   Stage 1A scope, or split the difference with a named follow-up slice).
2. Review `docs/COMPOUND_CONTENT_GOVERNANCE.md` and approve or amend it if
   UX-16 is to be unblocked.
3. Decide whether to commit the three new/updated outer-repo docs
   (`HANDOFF.md`, `COMPOUND_CONTENT_GOVERNANCE.md`,
   `STAGE_1A_EXIT_GATE_REVIEW.md`) alongside the other long-uncommitted
   `docs/` changes, or handle them separately.

No further roadmap-slice implementation should start until (1) is decided
— the next agent should not assume Stage 1A is closed.
