# ÆTERNA data model

This is the canonical domain vocabulary. It defines boundaries and states, not
physical SQL tables. Storage design must preserve these semantics.

## Shared record rules

User-owned health records use UUIDs and include `createdAt`, `updatedAt`,
`deletedAt` where applicable, actor/owner identifiers, source/provenance,
observed and recorded timestamps, timezone, unit metadata, and audit links.

- Raw imported data is immutable. Corrections create revisions.
- Calendar dates and instants are distinct types.
- Normalized values never replace source values.
- Protocol plans and observed actions are separate.
- Definitions and user results are separate.
- Safety and consent records are retained according to policy, not casually
  soft-deleted.

## Identity and governance

### User

Account owner and subject of personal data.

### Profile

User context required for display, units, timezone, goals, and explicitly
consented eligibility evaluation.

### Goal

A user-defined outcome with baseline, target, timeframe, and status.

Status: `draft`, `active`, `achieved`, `paused`, `abandoned`, `archived`.

### Consent

Versioned grant for a specific purpose, data scope, actor, regulatory mode, and
retention policy.

Status: `proposed`, `granted`, `declined`, `revoked`, `expired`.

### AuditEvent

Append-only record of actor, subject, action, purpose, object, timestamp,
before/after references, and consent or authorization basis.

### RegulatoryModePolicy

Versioned policy controlling features, content, review, retention, and escalation.

Mode: `wellness`, `research`, `clinical_support`.

## Evidence and compounds

### Compound

Version-independent compound identity and normalized name. It is not a protocol,
dose recommendation, inventory item, or product listing.

Clinical status: `approved`, `investigational`, `unapproved`, `withdrawn`,
`unknown`.

### CompoundMonograph

Versioned description, mechanism, routes, safety information, monitoring,
review date, and governed publication state.

Evidence level: `strong`, `moderate`, `early`, `preclinical`, `insufficient`.

Publication status: `draft`, `evidence_review`, `clinical_review`, `published`,
`superseded`, `withdrawn`.

### EvidenceReference

Study or guidance reference with study type, population, identifiers, source,
publication date, and review status. Human, animal, and in-vitro evidence remain
distinguishable.

## Protocol Core

### Protocol

Stable identity, owner, goal, current version reference, lifecycle state, and
review cadence. Mutable content does not live directly on this record.

Status: `draft`, `active`, `paused`, `completed`, `archived`.

### ProtocolVersion

Immutable snapshot of protocol content, rationale, evidence, expected outcomes,
monitoring requirements, change reason, author, approval, and effective period.

Status: `draft`, `proposed`, `under_review`, `approved`, `rejected`,
`superseded`, `withdrawn`.

### ProtocolItem

An intervention inside one ProtocolVersion: compound, supplement, medication,
habit, nutrition, training, or sleep action. It contains schedule intent and
monitoring requirements, not observed completion.

Type: `compound`, `supplement`, `medication`, `habit`, `nutrition`, `training`,
`sleep`, `other`.

### ProtocolEligibilityAssessment

Time-bound evaluation of a specific user context against a specific
ProtocolVersion and rule version. It never activates a protocol automatically.

State: `unknown`, `ineligible`, `needs_review`, `eligible_with_monitoring`,
`eligible`.

### ScheduledDose

Planned administration generated from a ProtocolItem and ProtocolVersion. It
preserves scheduled instant/day, timezone, dose, unit, route, and reminder state.

Status: `scheduled`, `completed`, `skipped`, `missed`, `cancelled`.

### DoseLog

Observed administration event. It references the ScheduledDose when applicable
and records actual time, amount, unit, route, site, vial, reconstitution,
idempotency key, notes, and correction history.

Status: `recorded`, `corrected`, `voided`.

### Vial

Physical inventory unit tied to a compound and owner. Records initial/remaining
quantity, unit, lot/batch, expiry, storage, opened date, and inventory state.

Status: `sealed`, `opened`, `depleted`, `expired`, `discarded`, `quarantined`.

### Reconstitution

Immutable preparation event linking a vial to diluent, quantities, resulting
concentration, preparation time, preparer, beyond-use date, and correction link.

Status: `recorded`, `corrected`, `voided`.

### InjectionSite

Normalized anatomical site and laterality available for administration logs.
User-specific availability or restriction is modeled separately from the site
definition.

Availability: `available`, `resting`, `restricted`, `inactive`.

### Adherence

Derived record for a defined user, ProtocolVersion, ProtocolItem, metric window,
and calculation version. It stores numerator, denominator, coverage, exclusions,
and source events; it is not a manually editable score.

State: `insufficient_data`, `calculated`, `stale`, `recalculation_required`.

## Symptoms, side effects, and safety

### Symptom

User-observed experience independent of assumed cause. Records onset, severity,
duration, recurrence, context, and resolution.

Status: `active`, `improving`, `resolved`, `unknown`.

### SideEffect

A user- or practitioner-attributed relationship between a Symptom and a
compound, DoseLog, or ProtocolVersion. Attribution records confidence and must
not overwrite the underlying symptom.

Attribution: `suspected`, `possible`, `probable`, `confirmed`, `ruled_out`,
`unknown`.

### SafetyEvent

First-class escalation record linked to one or more symptoms, side effects,
doses, biomarkers, wearable signals, or user reports. It includes severity,
confidence, red-flag state, triage history, owner, and outcome.

Status: `open`, `triaged`, `monitoring`, `escalated`, `resolved`, `dismissed`.

Severity: `informational`, `low`, `moderate`, `high`, `critical`.

## Biomarkers and device data

### Biomarker

Canonical analyte or measurement definition with category, compatible units,
formula metadata for derived markers, and versioned reference-range policies.
It contains no user measurement.

### BiomarkerResult

Observed user value linked to Biomarker, source, specimen/context, laboratory
range, observed time, raw/normalized units, confidence, and correction history.

Verification: `unverified`, `user_confirmed`, `source_verified`,
`practitioner_verified`, `rejected`.

### WearableMetric

Atomic or aggregated device-derived metric with metric type, raw and normalized
values, source device/provider, source record identifier, interval, coverage,
aggregation method, confidence, sync batch, and correction state.

State: `raw`, `normalized`, `aggregated`, `corrected`, `voided`.

### DailyMetric

Derived daily summary for manual and wearable inputs. It records source coverage,
calculation version, timezone, conflicts, and freshness; it never hides missing
or contradictory inputs.

State: `partial`, `complete`, `conflicted`, `stale`.

## Data ingestion and conflict resolution

### DataSource

Manual, device, laboratory, document, EHR, or practitioner source with ownership,
authorization, capabilities, and sync state.

Sync state: `disconnected`, `permission_required`, `ready`, `syncing`,
`partial`, `error`, `revoked`.

### SyncBatch

One bounded ingestion attempt with cursor/window, counts, permission snapshot,
errors, retry state, and idempotency boundary.

Status: `queued`, `running`, `partial`, `completed`, `failed`, `cancelled`.

### DataConflict

Contradiction or near-duplicate linking all candidate records without deleting
them. Resolution records canonical selection or merge, actor, reason, and time.

Status: `open`, `auto_resolved`, `user_resolved`, `practitioner_resolved`,
`dismissed`.

## Recommendations

### Recommendation

Governed, versioned content with rationale, evidence, uncertainty, expected
measurement, regulatory mode, review owner, expiry, and supersession link.
It cannot mutate a protocol directly.

Content status: `draft`, `evidence_review`, `clinical_review`, `published`,
`superseded`, `withdrawn`.

### RecommendationResponse

User-specific interaction with a published Recommendation.

Status: `unseen`, `viewed`, `accepted`, `snoozed`, `dismissed`, `completed`.

An accepted recommendation may create a `ProtocolChangeProposal`; approval
creates a new ProtocolVersion.

### ProtocolChangeProposal

Proposed diff against a ProtocolVersion with rationale, evidence, proposer,
required reviewer, regulatory mode, and disposition.

Status: `draft`, `submitted`, `under_review`, `approved`, `rejected`,
`withdrawn`, `applied`.

## Key relationships

```text
User ──< Protocol ──< ProtocolVersion ──< ProtocolItem ──< ScheduledDose
                                      └──< ProtocolEligibilityAssessment
ScheduledDose ──0..1 DoseLog >── Vial ──< Reconstitution
DoseLog ──0..1 InjectionSite
User ──< Symptom ──< SideEffect
SafetyEvent >── Symptom | SideEffect | DoseLog | BiomarkerResult | WearableMetric
Biomarker ──< BiomarkerResult
DataSource ──< SyncBatch ──< WearableMetric
DataConflict >── BiomarkerResult | WearableMetric | DailyMetric
Recommendation ──< RecommendationResponse ──0..1 ProtocolChangeProposal
ProtocolChangeProposal ──0..1 ProtocolVersion
ProtocolVersion ──< Adherence
```

## Invariants

1. Activating or changing a protocol never edits an approved version in place.
2. A DoseLog cannot silently replace its ScheduledDose or alter its version.
3. Inventory changes are traceable to a dose, correction, disposal, or explicit
   adjustment event.
4. Symptom existence does not imply side-effect causality.
5. Imported raw health data remains recoverable after normalization/correction.
6. Unresolved conflicts reduce coverage/confidence and remain visible.
7. Recommendations require a proposal and approval path before protocol change.
8. Regulatory mode, consent, actor, and evidence state are auditable for every
   material health interpretation or action.
