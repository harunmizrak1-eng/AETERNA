# ÆTERNA competitive feature parity blueprint

## Product decision

ÆTERNA will target the combined capability set of OneTwenty, Heads Up Health,
Ultrahuman, Function Health, InsideTracker, WHOOP, Oura, Cronometer, and
StackNinja, with a proprietary peptide, administration, and protocol-response
layer on top.

This is a feature-parity strategy, not a visual or source-code clone strategy.
The named commercial products are closed-source. Public product behavior can be
benchmarked, but their branding, copy, assets, private APIs, medical content,
and undisclosed algorithms are not imported.

The complete capability set is a destination map, not an implementation
authorization. `docs/ROADMAP.md` controls when each capability may enter work.

## Source map

| Source | Role in ÆTERNA |
| --- | --- |
| SparkyFitness | Expo/React Native platform, health sync, measurements, nutrition, fasting, charts, notifications, widgets, API and tests |
| Existing ÆTERNA | Peptide vault, evidence tiers, protocol records, dose logging, injection sites, vial inventory and blood marker definitions |
| OpenNutriTracker | Nutrition diary, micronutrient, recipe, scanner and trend-flow reference |
| FitBook | Offline diary, local migrations, weight and macro trend reference |
| Loop Habit Tracker | Adherence score, streak, frequency target, reminder and history algorithms |
| wger | Exercise catalogue, workout and body-measurement reference |
| Waistline | Import/export edge-case reference only |
| OneTwenty | Inputs → Picture → Protocol → Re-test product loop and membership experience |
| Heads Up Health | Unified clinical record, practitioner workspace, alerts, pre-visit briefs, protocol and cohort outcomes |
| Ultrahuman | Blood + wearable + CGM correlation, report ingestion and Blood Age presentation |
| Function Health | Biomarker taxonomy, longitudinal testing, clinician explanations and imaging records |
| InsideTracker | Customizable Action Plans, evidence-backed recommendations and retest loop |
| WHOOP | Daily recovery, strain, Healthspan and lab-to-performance context |
| Oura | Quiet anomaly monitoring, Health Radar, symptom context, PDF/EHR import and Advisor context controls |
| Cronometer | Detailed macro/micronutrient tracking and data-quality model |
| StackNinja | Supplement timing, interactions, cycling and adherence |

## Complete capability set

### 1. Unified health record

- Longitudinal timeline across labs, wearables, CGM, body measurements,
  symptoms, journal, protocols, nutrition, medications, supplements, peptides,
  imaging, genetics and clinician notes.
- Source, timestamp, unit, confidence, provenance and user corrections retained
  for every data point.
- User-controlled data sharing with clinicians and AI.

### 2. Today and Health Radar

- Daily recovery/readiness state.
- Important changes only, ranked by severity, confidence and actionability.
- Sleep, HRV, resting heart rate, temperature, respiratory rate, activity,
  blood pressure, glucose and subjective signals.
- Calibration, missing-data and sync-status states.
- Clear escalation from educational insight to clinician review.

### 3. Biomarker and laboratory intelligence

- Manual entry, CSV import, PDF extraction with confirmation, EHR/lab import.
- Category dashboard, longitudinal trends, lab range and separately governed
  optimization targets.
- Plain-language explanations, possible context, evidence and retest timing.
- Critical-result workflow and clinician notes.
- Derived markers only when their formula, units and source inputs are visible.

### 4. Protocol operating system

- Goals, baseline, interventions, tracked outcomes, schedule, version history,
  adherence and review dates.
- Peptides, prescriptions, supplements, nutrition, training, sleep and habits in
  one protocol.
- Every change records who changed it, why, evidence, expected outcome and
  monitoring requirements.
- Protocol comparison and reusable clinician-reviewed templates.

### 5. Peptide and administration intelligence

- Compound monographs with evidence tier and citations.
- Dose event, route, injection site, concentration, reconstitution, volume,
  vial, lot/batch, expiration, storage and inventory.
- Site rotation and schedule reminders.
- Interaction, duplicate-pathway, timing and monitoring checks.
- No autonomous prescription or dosage changes.

### 6. Response Timeline

- Baseline and intervention windows.
- Before/after and interrupted-time-series views.
- Overlay protocol changes with labs, sleep, HRV, weight, glucose, symptoms and
  performance.
- Distinguish association from causation and show sample size/data completeness.
- Individual and clinician cohort outcome reports.

### 7. Action Plan and adherence

- User-selectable actions with difficulty, schedule and expected measurement.
- Habit frequency, streak, strength, completion and reason-for-miss.
- Weekly review: what changed, what was completed, missing data and next review.
- Evidence and clinician-approval status shown for each action.

### 8. Nutrition and metabolic health

- Food diary, barcode, recipes, meal templates, fasting and hydration.
- Calories, macros and detailed micronutrients.
- Food-data provenance and quality level.
- CGM meal response and protocol/nutrition correlations.

### 9. Recovery and performance

- Sleep stages, consistency, HRV, resting heart rate, strain/training load,
  soreness, stress and subjective recovery.
- Workout catalogue and logs.
- Recovery guidance constrained by available evidence and user context.

### 10. AI health intelligence

- Pre-review briefs, change summaries, natural-language data questions and
  citation-backed explanations.
- Retrieval from the user's authorized data, curated compound knowledge and
  scientific sources.
- Uncertainty, provenance and evidence level in every material claim.
- Human review queues for clinical decisions and critical signals.
- No hidden autonomous protocol or medication changes.

### 11. Practitioner and clinic workspace

- Client list ranked by signals requiring attention.
- Unified record, pre-visit brief, protocol editor and change approval.
- Messaging, tasks, lab orders/results, reports and shareable summaries.
- Individual, protocol and cohort outcomes.
- Role-based access, audit trail and consent controls.

### 12. Imaging, genetics and biological-age models

- MRI/CT and other diagnostic-document record support.
- Raw genetics import and explicitly scoped interpretations.
- Biological-age or pace models shown with model name, input coverage,
  confidence and limitations.
- These models remain separate from the core daily score.

### 13. Community and research network

- Optional anonymous experience reports linked to protocol version and data
  completeness.
- No public health leaderboard.
- Research feed, saved citations and evidence updates.
- Population/cohort analysis only with explicit consent and privacy controls.

## Cross-cutting control systems

### Safety Event Workflow

A safety event is a first-class record, not a notification string. It can be
created from a dose log, symptom, side effect, biomarker result, wearable
signal, user report, or practitioner review.

Workflow:

1. Capture source, onset, severity, confidence, related protocol/version/dose,
   user notes, and available measurements without asserting causality.
2. Classify as `open`, `triaged`, `monitoring`, `escalated`, `resolved`, or
   `dismissed` with actor, timestamp, and reason recorded for every transition.
3. Show emergency guidance when predefined red-flag criteria are met; do not
   wait for AI or silently alter a prescription.
4. Allow the user to pause a self-managed protocol action while preserving the
   original schedule and audit history. Practitioner-managed changes require
   the appropriate approval path.
5. Link follow-up observations and outcome; never delete the original event.

### Data Conflict Resolution

Every imported or manually entered health datum retains its immutable raw value,
normalized value, unit, source, source record identifier, observed time, import
time, confidence, and correction history.

- Exact duplicates are idempotently merged by stable source identifiers.
- Near duplicates or contradictory values create a `DataConflict`; the system
  does not silently choose the most convenient value.
- Source priority can propose a preferred record but cannot destroy alternates.
- User or authorized practitioner resolution records the selected value, reason,
  actor, and time; recalculation uses the resolved canonical value.
- Derived insights expose unresolved conflicts and missing coverage.

### Protocol Eligibility State

Eligibility is evaluated against a specific protocol version and user context;
it is not a permanent label on a person or compound.

States: `unknown`, `ineligible`, `needs_review`, `eligible_with_monitoring`, and
`eligible`.

An eligibility assessment records rule version, evidence, contraindication or
missing-data reasons, required monitoring, regulatory mode, reviewer, and expiry.
It never activates a protocol automatically. A material user-data or protocol
change invalidates the assessment and returns it to `needs_review` or `unknown`.

### Recommendation Lifecycle

Recommendation content and user response are separate records.

- Content states: `draft`, `evidence_review`, `clinical_review`, `published`,
  `superseded`, and `withdrawn`.
- User-response states: `unseen`, `viewed`, `accepted`, `snoozed`, `dismissed`,
  and `completed`.
- Each recommendation records evidence, uncertainty, rationale, expected
  measurement, review owner, regulatory mode, expiry, and supersession link.
- Acceptance never edits a protocol directly; it creates a proposed change that
  follows the appropriate approval and versioning workflow.

### Regulatory Mode

Regulatory mode is an explicit deployment and content policy, not a disclaimer.

- `wellness`: self-tracking and educational interpretation; no diagnosis,
  prescribing, or autonomous treatment change.
- `research`: consented research workflows with protocol, cohort, withdrawal,
  and data-use controls; no clinical-care representation.
- `clinical_support`: practitioner-mediated workflows, governed content,
  role-based approvals, auditability, and jurisdiction-specific controls.

The selected mode gates feature availability, copy, reviewer requirements,
retention, consent, and escalation behavior. Mode changes require a recorded
policy decision and cannot be inferred from a user's subscription tier.

### Product Compression Principle

The capability set must compress into a small number of coherent decisions:

- Today answers **what now**, **what changed**, and **why it matters**.
- Protocol answers **what is planned**, **what was done**, and **when to review**.
- Biomarkers answer **what the evidence shows over time**.
- Track captures data without turning every data type into a destination.
- Library provides evidence and reusable knowledge without becoming a store.

New capability does not automatically create a new tab, score, card, or chart.
Use progressive disclosure, rank by actionability, and show uncertainty and
missing data. If a feature does not improve a core decision loop, it remains out
of the product even when a competitor offers it.

## Navigation target

The consumer application uses five primary destinations:

1. **Today** — current state, changes, tasks and next review.
2. **Protocol** — active plan, administrations, inventory and adherence.
3. **Biomarkers** — labs, devices, trends, records and Response Timeline.
4. **Track** — journal, symptoms, nutrition, fasting, workouts and measurements.
5. **Library** — compounds, evidence, research, templates and saved content.

AI is contextual inside these surfaces. It is not a separate destination that
forces users to explain their context again.

## Delivery sequence

All capabilities are accepted into the destination map, but they are not built
simultaneously. Each stage must produce a complete, testable loop.

### Stage 0 — Platform and design foundation

- Establish and validate the Sparky-based monorepo foundation.
- Preserve upstream provenance and tests.
- Define the new light clinical design system.
- Define unified identifiers, units, timestamps, provenance, consent, conflict
  handling, audit events, and regulatory mode.

### Stage 1A — Protocol Core

- Onboarding, Today, compound library, protocol/version management, scheduled
  doses, dose logging, injection-site rotation, vial/reconstitution inventory,
  symptoms, side effects, manual weight/sleep/HRV/steps, manual biomarkers,
  adherence, safety events, and weekly review.
- Validate: baseline → eligible protocol version → scheduled dose → dose event →
  safety/response data → review.
- No wearable integration is required for this loop to work.

### Stage 1B — Health Sync

- Apple Health and Health Connect permissions, reads, aggregation, background
  sync, writeback where justified, provenance, idempotency, conflict resolution,
  offline/retry behavior, and user-visible sync status.
- Validate: permission → import → normalization → conflict handling → daily
  summary → protocol review without duplicate or silent data loss.

### Stage 2 — Lab and action intelligence

- PDF/CSV lab import with confirmation, biomarker explanations, Action Plans,
  evidence, Recommendation Lifecycle, adherence and Response Timeline.

### Stage 3 — Nutrition, recovery and metabolic context

- Complete nutrition/micronutrients, fasting, hydration, CGM, workouts and
  advanced recovery.

### Stage 4 — Practitioner system

- Clinical-support regulatory mode, clinic workspace, alerts, pre-visit briefs,
  protocol approval, reports, messaging, cohort outcomes and audit controls.

### Stage 5 — Advanced longitudinal intelligence

- Imaging, genetics, biological-age models, research feed, optional anonymous
  network and mature AI intelligence.

Stage gates and explicit non-goals are authoritative in `docs/ROADMAP.md`.

## Acceptance rule

A competitor-inspired feature enters implementation only after documenting:

1. the user problem it solves;
2. the public behavior being benchmarked;
3. the original ÆTERNA interaction and data model;
4. required evidence, clinical review and regulatory boundaries;
5. data provenance, privacy and deletion behavior;
6. safety-event and data-conflict behavior where relevant;
7. a testable end-to-end acceptance flow;
8. the roadmap stage and passed entry gate.
