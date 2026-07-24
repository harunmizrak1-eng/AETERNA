# ÆTERNA Product Specification v1.0

**Status:** Canonical product specification  
**Owner:** Harun Mızrak  
**Foundation:** SparkyFitness monorepo  
**Canonical application repository:** `C:\Users\harun\Documents\New project\AETERNA\aeterna-os`  
**Mobile application:** `C:\Users\harun\Documents\New project\AETERNA\aeterna-os\SparkyFitnessMobile`  
**GitHub:** `harunmizrak1-eng/AETERNA-OS`  
**Upstream:** `CodeWithCJ/SparkyFitness`

This specification defines the approved product model, navigation, design language, feature boundaries, implementation order, and non-goals for ÆTERNA. It does not replace the detailed data model, roadmap, safety rules, or decision log. Explicit later owner decisions in `docs/DECISIONS.md` take precedence where documents conflict.

## 1. Product definition

ÆTERNA is a **longevity, health-tracking, and protocol operating system**.

It is not:

- a forked fitness tracker;
- a gym app with peptide features;
- a supplement store;
- a public social network;
- a diagnostic system;
- an autonomous prescribing system;
- a generalized health-score dashboard.

SparkyFitness remains the permanent technical foundation, but its fitness-first product ontology must not define the visible user experience.

The user-facing product loop is:

> **Protocol → Action → Observation → Review → Informed adjustment**

Every major screen and workflow must support one or more stages of this loop.

## 2. Foundation strategy

### 2.1 Preserve SparkyFitness infrastructure

Preserve and refine rather than rebuild without cause:

- Expo / React Native platform;
- authentication and security;
- Express API and PostgreSQL data layer;
- nutrition;
- workouts and exercise catalogues;
- measurements;
- medication and injection foundations;
- health integrations and connected-device handling;
- notifications;
- reports and chart infrastructure;
- settings;
- family and multi-user infrastructure;
- existing tests, utilities, hooks, and shared packages.

### 2.2 Replace the visible product model

Existing screens may be hidden, restructured, or superseded when they communicate the wrong product.

“Delete” means remove from normal navigation or supersede the visible experience. Reusable services, hooks, calculations, and domain logic remain until migration is proven complete.

The original Sparky dashboard stays available through a development-only route until its reusable dependencies have been migrated safely.

## 3. Product principles

### 3.1 Protocol-first

Protocol is the central object in ÆTERNA. Today, Biomarkers, Track, Library, notifications, and reviews must connect back to the active protocol or explicitly state that no protocol exists.

### 3.2 Agenda before dashboard

Today begins with attention, action, and review—not a carpet of metrics.

### 3.3 Real data only

Never fabricate scores, sample values, trends, interpretations, classifications, evidence, references, protocol states, or adherence percentages.

### 3.4 Provenance is visible

Material observations expose source, timestamp, freshness, unit, coverage, confidence or verification state, and user corrections where applicable.

### 3.5 No opaque score

Do not introduce Health Score, Longevity Score, Readiness Score, or Recovery Score. Use current observation, trend, source, freshness, coverage, confidence, protocol relevance, and next review.

### 3.6 Non-prescriptive wellness mode

Stage 1 may organize user-entered and imported information, track adherence, present evidence and provenance, show monitoring requirements, and support owner- or clinician-authored plans.

It must not diagnose, prescribe, autonomously change dosages, claim causation without evidence, present hidden clinical decisions, or fabricate medical guidance.

## 4. Canonical navigation

Approved primary navigation:

1. **Today**
2. **Protocol**
3. **Biomarkers**
4. **Track**
5. **Library**

Profile and Settings remain outside the primary tab bar. A global quick-log composer may exist, but it complements Track rather than replacing it.

### Tab meanings

- **Today:** What needs my attention, and what should I do now?
- **Protocol:** What am I following, why, and when is it reviewed?
- **Biomarkers:** How is my body responding across labs, wearables, symptoms, and measurements?
- **Track:** What did I log, experience, complete, or observe?
- **Library:** What is the evidence and context behind this?

### Tab visibility (revised 2026-07-16 — see `docs/DECISIONS.md`)

All five primary destinations are visible from the five-tab shell onward. A destination without a working flow yet uses an honest, purposeful pre-release/empty state (§6 state language) rather than being hidden from the tab bar or showing fabricated content. This supersedes the earlier progressive-exposure rule (hide a tab until its flow is real-data-complete); see `docs/UX_TRANSFORMATION_REVIEW.md` §3 and §9 (UX-03) for the adopted execution detail.

## 5. Information architecture

### 5.1 Today

Approved hierarchy:

1. safety or monitoring attention;
2. next protocol action;
3. due and overdue actions;
4. requested check-in;
5. meaningful change;
6. review or retest timing;
7. source freshness and coverage;
8. health metrics;
9. recent history.

May include greeting, connection state, last sync, protocol action, medication or peptide schedule, symptoms requiring attention, stock or expiry alerts, requested measurements, upcoming review, compact metric rows, connected-device state, quick log, and recent history.

Must not include generalized scores, macro/calorie rings as the main composition, a complete metric dashboard, irrelevant promotional content, or fabricated deltas.

### 5.2 Protocol

Contains active protocol, purpose, status, current version, phase/week, goals, baseline, eligibility, interventions, schedule, adherence coverage, monitoring requirements, inventory, safety information, review date, version history, change reasons, and completion summary.

Interventions may include peptides, medications, supplements, nutrition, training, sleep, caffeine, hydration, fasting, habits, recovery, and biomarker monitoring.

Every meaningful edit must eventually create an immutable `ProtocolVersion`. Historical logs retain the version active at the time of the event.

### 5.3 Biomarkers

The visible tab remains **Biomarkers**. It functions as the broader longitudinal record and may include labs, wearable signals, measurements, blood pressure, symptoms, side effects, provenance, documents, corrections, conflicts, response timeline, and manual observations.

Each result exposes name, value, unit, date, previous value, valid delta, history, source, range provenance, verification/confidence, protocol relation, and retest timing.

### 5.4 Track

Contains logbook, measurements, symptoms, side effects, journal, sleep, mood, energy, stress, focus, pain, libido, appetite, digestion, caffeine, hydration, fasting, nutrition, workouts, habits, photos, custom signals, history, and trends.

Supports contextual quick log, detailed entry, corrections, tags, protocol association, dose association, source, timestamps, and timeline integration.

### 5.5 Library

The primary Library contains peptides, compounds, biomarkers, monographs, evidence references, guides, protocol templates, saved research, journal/editorial content, FAQs, citations, and evidence updates.

Food, meal, exercise, and workout-preset catalogues remain module-specific tools and must not define the primary Library tab.

## 6. State language

Do not collapse distinguishable states into “No data.” Approved vocabulary includes:

- Never recorded
- Waiting for observation
- Not enough data
- Calibrating
- Source disconnected
- Permission denied
- Syncing
- Partial coverage
- Stale
- Offline
- Temporarily unavailable
- Conflicting data
- Queued
- Failed
- Corrected
- Unverified
- Not scheduled
- Not created
- Not applicable

## 7. Visual system

### Brand character

Warm, rigorous, quiet, editorial, clinical without hospital-software harshness, and premium through proportion and restraint.

### Color direction

- warm ivory canvas;
- warm white surfaces;
- charcoal text;
- muted gold or bronze accents;
- subtle warm dividers.

Red is reserved for safety/destructive actions. Green means confirmed completion or system success, not “healthy.” Amber means attention or incomplete information, not severity. No interpretation relies on color alone.

### Typography

- editorial serif for display and selected section titles;
- platform sans-serif for body, controls, and navigation;
- tabular numerals for health values;
- monospace only for identifiers and technical logs.

### Layout

- 4-point spacing grid;
- 20-point default screen margin;
- 16–20-point card insets;
- 32–40-point major section spacing;
- minimum 44×44 touch targets;
- generous whitespace;
- subtle borders and restrained shadows.

## 8. Canonical Stage 1 domains

- `Protocol`
- `ProtocolVersion`
- `ProtocolItem`
- `ProtocolEligibilityAssessment`
- `ScheduledDose`
- `DoseLog`
- `Vial`
- `Reconstitution`
- `InjectionSite`
- `Symptom`
- `SideEffect`
- `SafetyEvent`
- `BiomarkerResult`
- `DataSource`
- `AuditEvent`
- `Consent`
- `DataConflict`

Existing Sparky medication records must not be silently treated as canonical Protocol records. They may serve as read-only tracked interventions until canonical persistence exists.

## 9. Approved implementation status

### v0.1 — Sparky foundation — Complete

Full monorepo cloned, history preserved, private GitHub configured, mobile dependencies installed, typecheck passing, EAS development-build flow initiated.

### v0.2 — ÆTERNA visual foundation — Complete

Warm editorial theme, tokens, typography primitives, semantic icons, `AeternaText`, `AeternaMetricRow`, simplified navigation, and development-only legacy dashboard route.

### v0.3 — Today foundation — Complete

Real connection state, last sync, sleep, HRV, resting heart rate, activity, weight, explicit data states, no fabricated values, focused tests, and typecheck.

### v0.4 — Read-only Protocol shell — Complete

Separate canonical Protocol types, read-only medication mapping, schedules, today’s entries, injection feed, schedule matching, Today/Protocol/Track/Library navigation, no writes or migrations, focused tests and typecheck.

Known limitation: canonical Protocol persistence does not yet exist; `Protocol`, `ProtocolVersion`, and eligibility remain null. The current screen is a truthful compatibility shell.

## 10. Versioned roadmap

**Sequencing revised 2026-07-16 — see `docs/DECISIONS.md` and `docs/UX_TRANSFORMATION_REVIEW.md` §8-9.** The version numbers below stay as stable identifiers, but their *order of execution* is superseded by `docs/UX_TRANSFORMATION_REVIEW.md`'s priority table (P0-P8, slices UX-01–UX-18): the Today agenda-first transformation described at v0.12 now executes immediately after v0.5, alongside Protocol Core (v0.6-v0.7), instead of last. The Biomarkers tab (v0.10) is now visible from the five-tab shell onward with an honest pre-release state rather than being hidden until its flow is complete — see the tab-visibility note in §4 above.

### v0.5 — Protocol shell completion and device review

Finish read-only Protocol presentation and verify Today/Protocol on physical device. No editing, activation, dose recommendation, canonical persistence, or vial calculations.

### v0.6 — Canonical Protocol persistence

Implement real `Protocol`, `ProtocolVersion`, `ProtocolItem`, goals, baseline, review date, monitoring requirements, status transitions, and immutable version history.

### v0.7 — ScheduledDose and DoseLog

Implement scheduled/completed/skipped/missed/cancelled states, idempotency, timezone-safe boundaries, missed reasons, correction history, protocol-version association, and offline/retry awareness.

### v0.8 — Vial, reconstitution, and injection site

Implement strength, diluent, concentration, administration volume, remaining quantity, estimated doses, lot/batch, expiration, storage, and site rotation. Calculations expose all inputs.

### v0.9 — Compound and peptide Library

Implement compound list, monograph, evidence tier, mechanism, pathways, half-life, route, storage, adverse effects, contraindications, monitoring, references, and protocol association. Do not populate unverified medical content.

### v0.10 — Manual Biomarkers

Implement manual entry, categories, units, source, date, history, trends, valid deltas, provenance, verification, and retest date. The Biomarkers tab itself is already visible (added as part of the five-tab shell, per the 2026-07-16 tab-visibility decision); this slice makes its flow real rather than a pre-release state.

### v0.11 — Track transformation

Transform the existing diary into ÆTERNA Track with measurements, symptoms, side effects, journal, sleep, mood, energy, caffeine, hydration, fasting, nutrition, workouts, habits, logbook, and correction history.

### v0.12 — Today agenda-first transformation

Reorder Today to safety/attention, next action, due/overdue, requested check-in, meaningful change, review/retest, freshness, metrics, and history. **Execution order note:** this slice now runs immediately after v0.5, alongside Protocol Core (v0.6-v0.7) — see the sequencing note at the top of this section — so Today is rebuilt once, in step with real protocol data landing, rather than a second time after v0.11.

### v0.13 — Knowledge Library transformation

Replace the primary fitness catalogue with compounds, biomarkers, evidence, monographs, guides, references, templates, and saved research. Preserve food/exercise catalogues inside their modules.

### v1.0 — Stage 1A complete

Acceptance loop:

> baseline → eligibility → protocol activation → schedule → dose log → inventory update → symptom or safety event → weekly review

Requires immutable versions, idempotent logging, timezone/unit correctness, offline/retry handling, export/deletion coverage, and no dependency on health sync for Protocol Core.

## 11. Donor strategy

- **SparkyFitness:** sole application foundation; KEEP infrastructure, REFINE presentation.
- **Existing ÆTERNA concepts:** protocols, peptide vocabulary, evidence tiers, dose/admin extensions, vial/reconstitution, biomarkers, safety/governance. Do not revive the obsolete prototype.
- **OpenNutriTracker:** nutrition and micronutrient UX reference; no Flutter UI import.
- **FitBook:** offline diary and trend behavior where Sparky is insufficient.
- **Loop Habit Tracker:** independently reimplement frequency, streak, strength, missed reasons, reminders, history.
- **wger:** exercise catalogue and metadata where licensing permits; do not replace backend.
- **openScale:** body-composition formulas from primary science and adapter-pattern ideas; no GPL protocol translation.
- **Medplum:** AuditEvent, Provenance, Consent semantics.
- **Fasten Health:** generic source-sync lifecycle.
- **Gadgetbridge:** coverage-gap and device/permission-status UX only.
- **Commercial products:** behavior and UX references only; no branding, proprietary content, hidden formulas, layouts, or assets.

## 12. Stage 1A explicit non-goals

Unless separately approved:

- HealthKit/Health Connect migration work;
- third-party wearable clouds;
- CGM;
- lab PDF/CSV extraction;
- autonomous recommendations;
- advanced AI;
- practitioner portal;
- cohort analytics;
- community;
- genetics;
- imaging;
- biological-age models;
- gamification;
- public leaderboards;
- commerce;
- diagnosis;
- prescribing.

Existing Sparky capabilities may remain dormant and preserved even when absent from Stage 1 navigation.

## 13. AI-agent operating rules

Every implementation session must:

1. inspect current Git status;
2. work from `aeterna-os`;
3. avoid the obsolete outer prototype;
4. use one approved version slice at a time;
5. avoid unrelated dependency, native, EAS, or build changes;
6. run focused tests and typecheck;
7. show the exact diff before commit;
8. use focused commits;
9. never merge to `main` without owner approval;
10. never fabricate product, medical, or scientific data.

> **One version → one purpose → focused tests → one review → one commit group → device verification.**

## 14. Outstanding owner decisions

Resolve only when the relevant version begins:

- safety and escalation copy policy;
- whether protocol creation is owner-only, clinician-reviewed, or both;
- source and governance of initial compound monographs;
- whether self-hosted connection details remain normal onboarding or move to advanced deployment;
- final dark-mode typography/font dependency;
- Stage 3 reintegration order for nutrition, workouts, fasting, and recovery;
- future Study Club moderation and consent model.

Settled decisions that must not be reopened without new evidence:

- SparkyFitness is the sole foundation;
- five primary destinations remain;
- Track remains a tab;
- Biomarkers remains the visible tab label;
- no generalized health score;
- Protocol is the central product object;
- Today is agenda-first;
- Library is the knowledge destination;
- reusable legacy code is preserved until migration is proven complete.
