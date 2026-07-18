# ÆTERNA roadmap and stage gates

This document controls implementation order. The parity blueprint is a
destination map; it does not authorize work outside the active stage.

## Global gate rules

- Only one product stage may be active at a time.
- A stage begins only after the previous exit gate is documented as passed.
- A failed safety, privacy, data-integrity, license, build, or test condition
  blocks advancement regardless of visual completeness.
- Deferred features remain non-goals until their entry gate is approved.
- Stage-gate decisions are recorded in `docs/DECISIONS.md`.

## Stage 0 — Platform and design foundation

**Status: EXIT GATE NOT PASSED — open release-blocking debt, not active work
(status label corrected 2026-07-16; see `docs/DECISIONS.md`).** Stage 1A is
the single active implementation stage (per this document's own "only one
product stage may be active at a time" rule); Stage 0's evidence gap was
knowingly carried forward by the 2026-07-15 "Stage 0 closed; move to Stage
1A" decision below and remains open and unresolved, not currently being
worked. The earlier `COMPLETE` label was incorrect and is preserved only as
historical context in `docs/STAGE_0_COMPLETION_SUMMARY.md` and
`docs/DECISIONS.md`. Dependencies, builds, tests, and live HealthKit/Health
Connect behavior remain unvalidated.

### Deliverables

- SparkyFitness license and commercial-distribution decision.
- iOS and Android build/run evidence on supported environments.
- HealthKit/Health Connect technical validation without product migration.
- Mobile, backend, database, authentication, permissions, and sync maps.
- Coupling and migration-risk report.
- ÆTERNA V1 domain model and data-governance rules.
- Static premium Today prototype; no reuse of the Sparky dashboard.
- Donor-repository module-adoption report without copied code or dependencies.

### Exit gate S0

- Written commercial rights are sufficient for the intended distribution.
- Supported iOS and Android builds are reproducible.
- Existing automated tests establish a usable baseline.
- Health sync behavior and limitations are evidenced.
- Architecture, domain boundaries, migration risks, regulatory mode, consent,
  provenance, conflict handling, and audit requirements are documented.
- Foundation report records an explicit go, conditional go, or no-go decision.
- Owner approves the report before migration begins.

### Explicit non-goals

- Full migration or product feature implementation.
- Second application foundation.
- Nutrition, community, AI, clinical portal, or donor-code integration.
- Production schema changes or new dependencies.

## Stage 1A — ÆTERNA Foundation & Rebranding (Protocol Core)

**Status: EXIT GATE PASSED — owner decision 2026-07-18 (see `docs/DECISIONS.md`).**
The canonical work the exit-gate review flagged as missing is now implemented
and committed as S1A-16 through S1A-26 (Protocol Core persistence, Baseline,
Eligibility, review/activation, dose idempotency, vial/inventory, SafetyEvent
backend, BiomarkerResult, export/deletion, Weekly Review), surfaced on the
Faz A peptide-first mobile UI, and the live database is provisioned (Neon,
2026-07-18 — see the "Live Postgres" note in `docs/HANDOFF.md`). Faz A and
Faz B run as in-stage deepening on top of this passed gate.
`docs/UX_TRANSFORMATION_REVIEW.md` (adopted 2026-07-16, see
`docs/DECISIONS.md`) is the canonical, granular execution plan for this
stage — screen-by-screen classification and the UX-01–UX-18 slice sequence
with its P0-P8 priority order. It supersedes
`docs/SPARKY_TRANSFORMATION_PLAN.md`'s coarser module-level KEEP/REFINE/
BUILD NEW/DELETE table (kept for historical reference). This entry reorders
*slices inside* Stage 1A; it does not change the stage gates below.

**UX-01–UX-15 are implemented, but their completion does not by itself
satisfy this stage's exit gate below.** `docs/STAGE_1A_EXIT_GATE_REVIEW.md`
verified the exit gate against the actual codebase and found Baseline,
Eligibility assessment, and Protocol draft/review/activation are not yet
implemented as canonical features (the current "tracked interventions" view
of existing medication records is a real, tested compatibility shell, not
governed Protocol Core), and Safety Event Workflow has no backend support.
`docs/DECISIONS.md` (2026-07-16) records the owner's decision to complete
that missing work — tracked as S1A-16 through S1A-26 — rather than close
the gate against a narrower scope.

**Resolution (2026-07-18):** S1A-16 through S1A-26 are all implemented and
committed; Baseline, Eligibility, Protocol draft/review/activation, and the
SafetyEvent backend now exist as canonical features (no longer only the
"tracked interventions" compatibility shell), the data surfaces on the Faz A
mobile UI, and the schema is applied to a live Postgres (Neon). On that basis
the owner marked the Stage 1A exit gate PASSED (2026-07-18).

### Faz A — Peptide-First UI (added 2026-07-17, see `docs/DECISIONS.md`)

An in-stage reordering of Stage 1A, not a stage gate change. Owner-directed
re-centering on the product heart: peptide protocol, vial/reconstitution,
today's schedule, dose logging. Authorizes the following work inside Stage 1A:

- **Compound Library (Knowledge Engine)** — reclassified Stage 1A scope (not
  Stage 2). Seeded by Open Peptide Dataset (CC BY 4.0). Mobile library screen
  + compound detail/monograph + backend `compounds` table.
- **Track → Logbook** — the accepted UX-13 scope. Track tab repurposed from
  Sparky's nutrition `DiaryScreen` into a dose/injection/symptom/lab timeline;
  nutrition diary reachable behind a `__DEV__` route.
- **Peptide-first Onboarding** — replaces Sparky server-config onboarding;
  trust-verification governance gate; "always free, no paywall" counter-
  positioning.
- **AddSheet peptide-first** — global "+" surfaces Log dose / Log injection /
  Log lab result / Flag safety concern.
- **Visual reset** — new `aeterna-v2` theme variant (Apple Health clarity over
  ivory editorial); serif reduced to Library/headers.

**Status (2026-07-18): COMPLETE.** HEAD `b681caa8` / Faz A tooling extension
HEAD `ea489529`. Mobile surface is peptide-first; backend (compounds,
reconstitution, biomarker normalization, DataConflict) and the injection
logging flow are live; theme is Apple Health white/indigo. Three-agent
split recorded in `docs/DECISIONS.md`.

Non-goals (unchanged): Nutrition and Training Engines remain Stage 3.
Reconstitution calculator and injection-site picker UI are Faz A-followup
(backend pure functions may land during Faz A).

### Faz B — Tool screens, Community, Reminders, Account export (added 2026-07-18)

In-stage deepening of Stage 1A, not a new stage. Fills operational gaps users
hit immediately after Faz A and the social/knowledge backbone of the
seven-engine vision.

- **Peptide tool screens** — `ReconstitutionCalculatorScreen`,
  `HalfLifeChartsScreen`, `InteractionCheckerScreen` (reached from a Tools
  cluster on Library). Educational/reference only; not medical advice.
- **Community (Discourse Study Club)** — Discourse REST proxy on the server +
  mobile `TopicList` / `TopicDetail` / `CreatePost` screens. Topic-based, not
  a social feed. Ships against a Discourse-shaped mock when no live Discourse
  is reachable; flips to real Discourse via `DISCOURSE_BASE_URL` +
  `DISCOURSE_API_KEY`.
- **Protocol dose reminders** — local `expo-notifications` scheduling from
  protocol schedules; settings toggle.
- **General account export** — `/api/v2/account/export` covering every Stage
  1A + compounds entity, not gated behind the medications permission.

Non-goals (unchanged): Nutrition and Training Engines remain Stage 3.
Faz B does not relitigate Stage 1B device verification or Stage 2 lab import.



### Deliverables

- Onboarding and Today.
- Compound and evidence records.
- Protocol, ProtocolVersion, ProtocolItem, and eligibility assessment.
- ScheduledDose and DoseLog with explicit status transitions.
- Vial, Reconstitution, InjectionSite, and inventory updates.
- Symptoms, side effects, Safety Event Workflow, and escalation history.
- Manual weight, sleep, HRV, steps, and biomarker results.
- Adherence and weekly review.
- Wellness regulatory mode only.

### Exit gate S1A

- Baseline → eligibility → protocol activation → schedule → dose log → inventory
  update → symptom/safety event → weekly review passes end to end.
- Protocol edits create immutable versions; historical logs retain their version.
- Duplicate dose submissions are idempotent.
- Timezone, unit conversion, offline/retry, permission denial, and safety-event
  error paths are covered by tests.
- Data export and account deletion cover all Stage 1A entities.
- Today remains usable with manual data and does not depend on health sync.
- Owner approves Stage 1B entry.

### Explicit non-goals

- HealthKit, Health Connect, Oura, WHOOP, Garmin, or direct devices.
- Lab PDF/CSV import, recommendation generation, AI, nutrition, community, CGM,
  biological age, practitioner workflows, cohort analytics, and gamification.

## Stage 1B — Health Sync

**Status: implementation complete (S1B-01..07); device verification PASS —
owner-attested 2026-07-18.** The owner confirmed physical-device testing was
performed this cycle (the Android ElevationGained log-storm and JSON/HTML
response-parse fixes were both found and fixed from real-device runs); the
S1B-08 checklist evidence and any residual per-metric notes live in
`docs/STAGE_1B_DEVICE_VERIFICATION.md`. Production/release sign-off still
depends on that document's device evidence being kept current.

### Deliverables

- Apple Health and Health Connect permission education and revocation handling.
- Read, normalized aggregation, safe background sync, and visible sync status.
- Provenance, stable source identifiers, idempotent ingestion, DataConflict, and
  user resolution.
- Offline queue, bounded retry, partial-failure handling, and observability that
  excludes sensitive payloads.
- Writeback only for explicitly approved metric types with loop prevention.

### Exit gate S1B

- Permission → read → normalize → aggregate → persist → review passes on real
  supported iOS and Android devices.
- Revoked/partial permissions, stale data, missing samples, duplicate imports,
  timezone boundaries, unit conversion, background limits, and conflicts are
  tested.
- Repeated sync produces no duplicate canonical records or writeback loops.
- Users can see source, last sync, coverage, conflicts, and corrections.
- Protocol Core remains functional when sync is unavailable.

### Explicit non-goals

- Third-party wearable clouds, Gadgetbridge integration, Bluetooth scales, CGM,
  nutrition, lab documents, AI recommendations, and practitioner dashboards.

## Stage 2 — Lab and action intelligence

### Entry gate

- S1B passed and biomarker provenance/conflict behavior is stable.

### Deliverables

- Confirmed PDF/CSV lab import, laboratory provenance, reference ranges, derived
  marker formulas, longitudinal comparison, Response Timeline, Action Plans,
  and Recommendation Lifecycle.

### Exit gate S2

- No extracted value becomes canonical without confidence and confirmation.
- Critical results enter Safety Event Workflow.
- Recommendations show evidence, uncertainty, expiry, reviewer state, and do not
  edit protocols without an approved proposal/version transition.

### Explicit non-goals

- Autonomous diagnosis/prescribing, hidden causality claims, clinical-support
  mode, advanced AI chat, nutrition, CGM, genetics, and imaging.

## Stage 3 — Nutrition, recovery, and metabolic context

### Entry gate

- S2 passed and Action Plan/Response Timeline behavior is trustworthy.

### Deliverables

- Nutrition and micronutrients, food provenance, fasting, hydration, workouts,
  third-party wearables, advanced recovery, and CGM context.

### Exit gate S3

- Cross-source metrics retain provenance and conflict handling.
- Recovery and metabolic interpretations expose coverage and uncertainty.
- The added modules compress into the five-destination navigation without a
  dashboard or tab explosion.

### Explicit non-goals

- Clinical portal, cohort analytics, community, genetics, imaging, or autonomous
  protocol optimization.

## Stage 4 — Practitioner system

### Entry gate

- Clinical, privacy, security, and jurisdiction review approves
  `clinical_support` regulatory mode.

### Deliverables

- Practitioner identity and roles, consented access, review queues, protocol
  proposals/approvals, safety escalation, reports, messaging, audit trail, and
  individual/cohort outcomes.

### Exit gate S4

- Least-privilege and revocation tests pass for every practitioner action.
- Actor, subject, purpose, before/after state, and consent basis are auditable.
- Clinical content cannot bypass governed review or regulatory-mode gates.

### Explicit non-goals

- Replacing an EHR, emergency monitoring, autonomous care, insurance decisions,
  or public patient rankings.

## Stage 5 — Advanced longitudinal intelligence

### Entry gate

- Separate approvals exist for each high-risk data class and model.

### Deliverables

- Imaging records, genetics, named biological-age models, mature contextual AI,
  research feed, and optional consented anonymous research network.

### Exit gate S5

- Each model exposes version, inputs, coverage, uncertainty, validation scope,
  and limitations.
- Consent withdrawal and deletion propagate through primary and derived data.
- Population outputs meet privacy thresholds and cannot identify individuals.

### Explicit non-goals

- Black-box health scores, public leaderboards, data sale without explicit
  consent, fabricated evidence, or fully autonomous clinical decisions.
