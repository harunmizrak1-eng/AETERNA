# ÆTERNA open-source adoption strategy

## Decision

Use **SparkyFitness as the functional platform base** and migrate ÆTERNA's
unique peptide, protocol, injection, inventory, and biomarker domains into it.

Do not restart the product as an OpenNutriTracker fork. OpenNutriTracker and
FitBook are Flutter applications; using either as the base would discard the
existing Expo/React Native work and make SparkyFitness's ready HealthKit and
Health Connect implementation expensive to reuse.

The existing ÆTERNA visual layer is not carried forward. The new interface is
designed independently in a light, clinical, editorial system inspired by
Marek Health, Ways2Well, and the useful information hierarchy in OneTwenty.

## Project roles

| Project | Role | Adopt | Do not adopt | Priority |
| --- | --- | --- | --- | --- |
| SparkyFitness | Platform base | Expo 56 mobile shell, React Native 0.85 services, HealthKit, Health Connect, background sync, measurements, sleep, nutrition, fasting, charts, notifications, API contracts and tests | Existing visual design, fitness-first navigation, branding, every workout feature | Now |
| Existing ÆTERNA | Unique product domain | Compound library, evidence tiers, stack/protocol records, dose logs, injection-site rotation, vial inventory, blood markers | Rejected dashboard/card UI, current navigation, Community in the first release | Now |
| OpenNutriTracker | Product-flow reference | Meal diary structure, micronutrient hierarchy, onboarding, trend calculations, scanner and recipe flows | Flutter application shell or direct UI copy | Nutrition phase |
| FitBook | Algorithm/reference donor | Offline food diary concepts, local database migrations, weight history, simple macro trend graphs | Flutter shell and current visual design | Nutrition phase |
| Loop Habit Tracker | Algorithm donor | Habit score, streak, frequency targets, reminder rules, history model and tests, reimplemented in TypeScript | Kotlin/Android application shell | Protocol adherence phase |
| wger | Optional service/data source | Exercise catalogue, workout terminology, measurement model or API in a later performance module | Replacing Sparky's backend, gym administration, current UI | Later |
| Waistline | Archive reference | Import/export edge cases only if a missing case is discovered | Cordova/Framework7 shell, food diary duplication | Skip |

## Why SparkyFitness wins

- Exact runtime match: Expo 56, React Native 0.85.3, React 19.2.3.
- Working iOS HealthKit and Android Health Connect providers, transformations,
  aggregation, background delivery, writeback, permissions, and tests.
- Existing food, hydration, fasting, measurements, sleep, workouts, charts,
  notifications, widgets, and AI chat surfaces.
- A matching Express/PostgreSQL backend and shared TypeScript schemas are
  available when local-only storage is no longer sufficient.
- It is active and maintained, so it is a stronger engineering foundation than
  a small clone or an old Cordova application.

## Adoption boundaries

1. Copy domains, services, tests, and interaction behavior; do not copy the UI.
2. Keep provenance for every imported file and record the upstream commit.
3. Import the smallest coherent module with its tests instead of copying
   isolated functions without their assumptions.
4. Do not combine three implementations of the same feature. Sparky owns the
   base implementation; other projects are consulted only for missing behavior.
5. Medical explanations remain educational. User-facing causal claims and
   protocol changes require evidence labels and, where applicable, clinician
   review.

## First migration slice

The first slice proves the new product direction without importing the full
fitness application:

1. Remove the rejected ÆTERNA dashboard implementation.
2. Design one high-fidelity mobile **Today** screen.
3. Define the Today data contract: latest signals, changes, protocol tasks,
   adherence, next review, and sync state.
4. Bring across Sparky's measurement and health-sync service boundaries behind
   the new contract.
5. Migrate ÆTERNA's compound, dose, injection-site, and vial data into the new
   Protocol surface.
6. Validate the Today → log dose → updated protocol state flow before adding
   nutrition, community, or AI.

## Release order

### Release 1

- Today
- Protocol and injection tracking
- Biomarkers with manual entry
- Apple Health and Health Connect sync
- Weekly change summary without autonomous medical recommendations

### Release 2

- Nutrition, micronutrients, fasting, and hydration
- Habit strength and protocol-adherence history
- Lab PDF extraction with explicit user confirmation

### Release 3

- Practitioner review
- Evidence-backed AI explanations
- Response timelines and protocol outcome comparisons
- Optional exercise/performance module

