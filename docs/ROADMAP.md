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

## Stage 1A — Protocol Core

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
