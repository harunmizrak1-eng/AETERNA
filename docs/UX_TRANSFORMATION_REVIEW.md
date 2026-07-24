# ÆTERNA UX transformation review (revised)

Status: canonical, granular execution plan for Stage 1A. Adopted
2026-07-16 — see `docs/DECISIONS.md` for the adoption decision and the two
points where this revision changes previously recorded behavior (tab
visibility, Today sequencing). This document extends
`docs/PRODUCT_SPECIFICATION_V1.md` (product principles, canonical
navigation, information architecture) and supersedes
`docs/SPARKY_TRANSFORMATION_PLAN.md`'s module-level table with a
screen-by-screen classification and an 18-slice (UX-01–UX-18)
implementation sequence. `docs/ROADMAP.md`'s stage gates remain
authoritative and unchanged; this document sequences slices inside Stage 1A,
it does not reopen or skip a stage gate.

No repository files were modified by writing this document itself. This
revision treats the five-tab navigation, Track destination, Biomarkers
label, legacy-code preservation, agenda-first Today, and score prohibition
as settled product decisions (already recorded in
`docs/PRODUCT_SPECIFICATION_V1.md` and `docs/DECISIONS.md`).

---

## 1. Revised executive verdict

ÆTERNA OS should preserve SparkyFitness as a functional platform while
replacing its visible fitness-product identity through staged navigation,
presentation, and information-architecture changes.

The approved product structure is:

> Protocol → Action → Observation → Review → Informed adjustment

The five primary destinations each own a distinct part of that loop:

- Today prioritizes immediate attention and action.
- Protocol explains the active plan and its review logic.
- Biomarkers shows longitudinal response across health sources.
- Track captures and reviews what happened.
- Library provides evidence and context.

The transformation is therefore not a removal of Sparky functionality. It is
a controlled reorganization:

- Working domains remain available in the codebase.
- Deferred domains are hidden from normal Stage 1 navigation.
- Legacy screens may remain accessible through development-only routes.
- Services, hooks, calculations, charts, APIs, and reusable components
  remain until migration evidence proves them redundant.
- Visible SparkyFitness compositions are progressively superseded by
  ÆTERNA screens.

Today remains the product's operational center, but it must not become a
dashboard. Health data supports protocol decisions; it does not become the
product's organizing principle.

No generalized health, longevity, readiness, or recovery score should be
introduced.

---

## 2. Core UX principle

Every screen should answer one question in the approved product loop.

| Product step | User question | Primary destination |
| --- | --- | --- |
| Protocol | What am I following, why, and when is it reviewed? | Protocol |
| Action | What should I do now? | Today |
| Observation | What did I log, experience, or complete? | Track |
| Review | How is my body responding? | Biomarkers |
| Informed adjustment | What evidence and context support the next decision? | Protocol, Biomarkers, Library |

Three rules govern the experience:

1. Action precedes passive data on Today.
2. Observations remain attributable, correctable, and source-aware.
3. Interpretation must be transparent and bounded.

The system may display: current observation, trend, source, freshness,
coverage, confidence, protocol relevance, next review.

It must not compress these into an opaque score.

---

## 3. Approved navigation and rationale

Primary navigation:

1. Today
2. Protocol
3. Biomarkers
4. Track
5. Library

Profile and Settings remain outside the tab bar.

A global quick-log composer may be accessible from Today, Protocol,
Biomarkers, and Track. It complements Track; it does not replace it.

**Tab visibility (revised 2026-07-16, see `docs/DECISIONS.md`):** all five
tabs exist from the five-tab shell onward. A destination without a working
flow yet uses an honest, purposeful pre-release/empty state — one of the
approved state-language values in §6 below — never fabricated content.

### Why five destinations are appropriate

**Today** — "What needs my attention and what should I do now?" Today is the
agenda and prioritization surface. It composes information from Protocol,
Track, Biomarkers, review state, and health-source freshness without
duplicating their full experiences.

**Protocol** — "What am I currently following, why, and when is it
reviewed?" Protocol owns the active plan, version history, schedule,
eligibility, monitoring requirements, inventory relationships, and review
lifecycle.

**Biomarkers** — "How is my body responding across labs, wearables, and
measurements?" Biomarkers is the premium user-facing label. Its internal
scope can be broader than laboratory biomarkers and may use a subtitle such
as "Longitudinal health record."

**Track** — "What did I log, experience, or complete?" Track is both a
capture destination and a historical/analytical destination. It supports
deliberate logging, recurring habits, corrections, journaling, trends, and
domain-specific histories.

**Library** — "What is the evidence and context behind this?" Library
provides the knowledge layer behind protocols, biomarkers, compounds, and
informed review. It is not a food or workout catalog.

### Navigation behavior

- The selected tab remains stable when opening and closing detail routes.
- Today deep-links into the relevant Protocol, Biomarker, or Track record.
- The global quick-log action opens a focused composer without changing
  tabs.
- Completing a quick log returns the user to their original context.
- Track exposes the resulting entry and correction history.
- Settings opens from a profile control in screen headers.
- Development-only legacy routes must not appear in production navigation,
  search, or deep-link suggestions.

---

## 4. Revised information architecture

### Today

**Contains**, in approved priority order:

1. Attention and safety.
2. Next protocol action.
3. Due and overdue items.
4. Requested monitoring or check-in.
5. Meaningful change.
6. Review or retest.
7. Source freshness and coverage.
8. Selected protocol-relevant health metrics.
9. Recent history.

**Does not contain:** generalized scores; a complete metric grid; calories,
macros, or fitness rings as permanent hero content; a generic content feed;
full logbook history; full biomarker exploration; Health Sync configuration
controls; unqualified medical recommendations.

Metrics appear only when relevant to the current protocol, requested
monitoring, or a meaningful change.

### Protocol

**Contains:** active protocol, protocol purpose, current immutable version,
author and review responsibility, eligibility status, monitoring
requirements, schedule, protocol items, administration instructions, dose
and action history links, inventory dependencies, safety information,
adherence with coverage, review and retest dates, change history, previous
versions.

**Does not contain:** silent automatic modifications; generated dosing
recommendations; unverified "optimal" targets; raw wearable dashboards;
general knowledge content that belongs in Library; logbook history unrelated
to the protocol.

### Biomarkers

The tab remains **Biomarkers**. The screen may use "Longitudinal health
record" as explanatory text.

**Contains:** laboratory results, biomarker categories, wearable signals,
measurements, blood pressure, symptoms and selected side effects, manual
observations, documents, result provenance, source priority and conflicts,
freshness and coverage, trend detail, protocol and event annotations,
Response Timeline when Stage 2 is authorized, search and filtering, links to
relevant monographs and evidence.

**Does not contain:** generalized health scores; unsupported causality;
reference ranges without provenance; "good"/"bad" judgments based only on
color; automatic protocol adjustments; logging controls so extensive that
Biomarkers becomes a duplicate of Track.

Biomarkers explains longitudinal response; Track owns capture and history.

### Track

**Primary structure** (recommended initial sections): Quick Log, Today's
entries, Logbook, Measurements, Symptoms and side effects, Journal, Habits,
History and trends.

**Progressively reintroduced modules:** nutrition/meals/foods/hydration/
caffeine; workouts and exercise; sleep; fasting; medication and injection
events; other manually recorded health events.

**Entry model** — every entry should expose: type, value or outcome,
timestamp, source, protocol relationship when applicable, notes, sync state,
correction state, original value and correction history where required.

**Does not contain:** protocol definitions; evidence monographs; a
generalized wellness dashboard; unattributed imported observations;
destructive editing that removes audit history.

### Library

**Primary content:** compounds, peptides, biomarkers, monographs, evidence,
references, guides, protocol templates, saved research, FAQs, journal and
editorial content.

**Information requirements** — knowledge entries should identify: content
type, author or source, evidence level where approved, publication or
review date, last editorial review, references, relevant compounds/
biomarkers/protocol concepts, wellness and clinical boundaries.

**Module-specific catalogs:** food, meal, exercise, and workout-preset
catalogs may continue to exist, but are entered through their corresponding
Track module, do not appear as the primary Library home, and do not compete
with scientific knowledge in search unless clearly scoped.

### Settings

Profile and account; units, locale, and timezone; appearance; accessibility;
notifications and reminders; privacy; export and deletion; security and
passkeys; server or deployment connection; health sources; sync settings;
diagnostics and logs; about and acknowledgements; stage-specific module
settings only after those modules are exposed.

### Onboarding

Recommended sequence: (1) ÆTERNA purpose and product boundary, (2) privacy
and ownership, (3) consent, (4) sign in or connect, (5) timezone/locale/
units, (6) goals and baseline context, (7) notification preferences, (8)
optional health-source setup, (9) protocol start, invitation, or honest
empty state.

Technical server configuration should be progressively disclosed rather than
presented as ÆTERNA's first value proposition.

### Health Sync

Connected sources; permission state; last successful synchronization;
data-category coverage; partial and stale coverage; conflicts; sync history;
actionable errors; queued changes; advanced writeback controls in a separate
section.

Manual Protocol Core must remain functional without Health Sync.

### State language

The shared state model must distinguish: never recorded; waiting for
observation; not enough data; calibrating; source disconnected; permission
denied; syncing; partial coverage; stale; offline; temporarily unavailable;
conflicting data; queued.

Each state needs distinct copy, iconography, accessibility text, and
available action.

---

## 5. Revised component inventory

**Preserve and reuse:** authentication and account services; query/caching
infrastructure; Health Sync orchestration; notifications and scheduling
foundations; existing reports and chart calculations; food/meal/activity/
workout/fasting/measurement/medication/injection services; bottom sheets;
date/calendar utilities; error boundaries; navigation guards; screen-header
adapters; safe image handling; semantic icon mapping; existing data
normalization and unit conversion; existing logging and mutation hooks where
domain-compatible; legacy dashboard composition under a development-only
route.

**Refine:** `AeternaText`, `AeternaMetricRow`, `Button`, `StatusView`,
`SettingsRow`, `FormInput`, `SegmentedControl`, `CustomTabBar`, `TabsLayout`,
`DateNavigator`, `AddSheet`, chart wrappers, toasts, form sections, list
rows, source/sync labels.

**New shared components:** `AppScaffold`, `EditorialHeader`,
`SectionHeader`, `AttentionBanner`, `SafetyBanner`, `ProtocolAgenda`,
`ScheduledActionRow`, `VersionBadge`, `EligibilityStatus`,
`MonitoringRequirementRow`, `EvidenceBadge`, `MetricValue`, `ProvenanceRow`,
`CoverageStrip`, `ConfidenceLabel`, `TrendChart`, `EventAnnotation`,
`ConflictCallout`, `SyncSourceCard`, `QuickLogComposer`, `TrackCategoryRow`,
`LogbookRow`, `CorrectionHistory`, `InventoryCard`, `ReviewSummary`,
`KnowledgeCard`, `ReferenceList`, and dedicated state components for all
approved data states.

**Removed from normal Stage 1 composition** (hidden/reorganized, not deleted
from the codebase): calorie rings, macro dashboard cards, hydration gauges,
exercise progress cards, fasting hero cards, Ask Sparky launcher, legacy
dashboard layout, fitness-first Library layout.

---

## 6. Revised existing-screen classification

Classification meanings:

- **KEEP** — retain the visible screen substantially as-is.
- **REFINE** — preserve the domain and useful implementation, but change
  presentation, placement, or hierarchy.
- **DELETE** — supersede the visible screen or remove it from normal
  navigation. Retain reusable code and development access until migration
  evidence supports physical deletion.
- **BUILD NEW** — no suitable existing screen provides the required product
  experience.

No existing screen is a complete KEEP as-is.

### Core screens

| Screen | Classification | Revised treatment |
| --- | --- | --- |
| TodayScreen | REFINE | Preserve editorial styling and provenance work; rebuild around the approved agenda hierarchy. |
| DashboardScreen | DELETE | Remove from normal navigation. Preserve code, hooks, calculations, charts, and development-only route until migration is proven. |
| DashboardSettingsScreen | DELETE | Remove from user navigation while legacy dashboard is superseded; preserve settings logic that remains useful. |
| DiaryScreen | REFINE | Evolve into or contribute to Track and Logbook rather than remaining food-first. |
| LibraryScreen | DELETE | Supersede its visible fitness-catalog composition with the ÆTERNA knowledge destination. Preserve catalog routes for module use. |
| ChatScreen | DELETE | Remove from normal Stage 1 navigation. Retain code if needed for future explicitly approved AI scope. |
| OnboardingScreen | DELETE | Supersede visible SparkyFitness/server-first onboarding; reuse authentication and connection logic. |

### Settings and operational screens

| Screen | Classification | Revised treatment |
| --- | --- | --- |
| SettingsScreen | REFINE | Reorganize around user control, privacy, appearance, sources, security, and stage-visible modules. |
| AppSettingsScreen | REFINE | Align with ÆTERNA appearance, accessibility, privacy, and notification language. |
| ServerSettingsScreen | REFINE | Preserve deployment support; progressively disclose technical configuration. |
| PasskeySettingsScreen | REFINE | Preserve security functionality and align the presentation. |
| SyncScreen | REFINE | Redesign around sources, permission, coverage, freshness, conflicts, and recovery actions. |
| MeasurementsAddScreen | REFINE | Integrate with Track and the global quick-log composer. |
| LogScreen | REFINE | Preserve as diagnostics; keep outside primary product navigation. |
| AboutScreen | REFINE | Replace product positioning, branding, privacy language, and acknowledgements. |
| WhatsNewScreen | REFINE | Present staged ÆTERNA changes without reviving fitness-first navigation. |

### Nutrition and fasting

These domains are preserved and progressively reintroduced through Track.

| Screen | Classification | Revised treatment |
| --- | --- | --- |
| CalorieSettingsScreen | REFINE | Preserve for Stage 3 nutrition configuration; avoid weight-loss-default language. |
| FastingDetailScreen | REFINE | Reintroduce through Track with protocol and observation context. |
| FoodDetailScreen | REFINE | Preserve as Stage 3 nutrition-record detail. |
| FoodEntryAddScreen | REFINE | Integrate into Track and quick log during Stage 3. |
| FoodEntryViewScreen | REFINE | Align with the shared observation and provenance model. |
| FoodFormScreen | REFINE | Migrate to shared forms without removing domain behavior. |
| FoodSearchScreen | REFINE | Retain as a module-specific catalog search. |
| FoodScanScreen | REFINE | Retain as a Stage 3 capture tool. |
| EditBarcodeScreen | REFINE | Preserve as a module utility. |
| EditLoggedMealScreen | REFINE | Add correction-history behavior where applicable. |
| FoodPhotoIntroScreen | REFINE | Preserve for Stage 3 with bounded estimation language. |
| FoodPhotoEstimateReviewScreen | REFINE | Make uncertainty and manual correction explicit. |
| FoodPhotoImproveScreen | REFINE | Preserve the correction workflow. |
| FoodPhotoLogEntryScreen | REFINE | Integrate with Track history. |
| FoodSettingsScreen | REFINE | Keep hidden until the nutrition module is exposed. |
| FoodsLibraryScreen | REFINE | Preserve as the nutrition catalog, not the primary Library tab. |
| MealAddScreen | REFINE | Reintroduce through Track. |
| MealDetailScreen | REFINE | Align with shared observation detail. |
| MealsLibraryScreen | REFINE | Preserve as a module-specific saved-meal catalog. |
| MealTypeDetailScreen | REFINE | Preserve as nutrition history and classification detail. |

### Activity and workouts

These domains are preserved and progressively reintroduced through Track.

| Screen | Classification | Revised treatment |
| --- | --- | --- |
| ActiveWorkoutScreen | REFINE | Preserve session functionality for Stage 3; adopt calm, protocol-aware presentation. |
| ActivityAddScreen | REFINE | Integrate with Track capture. |
| ActivityDetailScreen | REFINE | Align with provenance and longitudinal observation patterns. |
| ExerciseDetailScreen | REFINE | Preserve exercise detail as a module-specific screen. |
| ExerciseFormScreen | REFINE | Migrate to shared form primitives. |
| ExerciseSearchScreen | REFINE | Retain as a Track-module catalog search. |
| ExercisesLibraryScreen | REFINE | Preserve as an exercise catalog, separate from the primary Library tab. |
| PresetSearchScreen | REFINE | Retain for Stage 3 workout configuration. |
| WorkoutAddScreen | REFINE | Integrate into Track. |
| WorkoutDetailScreen | REFINE | Align with shared history and observation presentation. |
| WorkoutPresetDetailScreen | REFINE | Preserve as a module detail screen. |
| WorkoutPresetFormScreen | REFINE | Migrate to shared forms. |
| WorkoutPresetsLibraryScreen | REFINE | Preserve as a module catalog, not the knowledge Library. |

### Build-new screen inventory

Five-tab application shell; Protocol Overview; Protocol Version Detail;
Eligibility and Monitoring; Schedule; Dose/Action Log; Vial Inventory;
Reconstitution; Injection Site; Symptom and Side-Effect Log; Safety Event;
Biomarkers Home; Biomarker Manual Result Flow; Biomarker Detail;
Longitudinal Record; Response Timeline (Stage 2); Track Home; Global Quick
Log; Logbook; Correction History; Weekly Review; Knowledge Library; Compound
and Peptide Monograph; Biomarker Monograph; Evidence Reference; Revised
onboarding journey.

---

## 7. Revised migration strategy

Use a staged route-and-composition migration:

1. **Protect existing functionality.** Do not remove services, hooks, APIs,
   calculations, charts, catalogs, or domain screens merely because they are
   absent from Stage 1 navigation.
2. **Retain the legacy dashboard as a migration reference.** Remove it from
   normal navigation while keeping a development-only route.
3. **Build semantic foundations first.** Tokens, typography, state language,
   accessibility, shared presentation primitives.
4. **Introduce the approved five-tab shell.** Tabs exist from the
   beginning; unavailable destinations use honest, purposeful pre-release or
   empty states rather than fake content.
5. **Recompose Today.** Replace metric-first presentation with attention,
   safety, protocol action, monitoring, review, then selected metrics.
6. **Build Protocol Core.** Versions, eligibility, schedule, actions,
   monitoring, inventory, review.
7. **Unify action logging.** Dose and protocol-action logs become part of
   Track history even when initiated from Today or Protocol.
8. **Build Biomarkers in two layers.** First manual results and a useful
   home; then detail, provenance, conflicts, documents, longitudinal
   response.
9. **Build Track as a destination.** Category-based home, capture paths,
   history, trends, global quick-log integration.
10. **Build the new Library.** Preserve food and exercise catalogs as
    domain utilities while replacing the primary Library tab.
11. **Redesign Health Sync in Stage 1B.** Manual Protocol Core continues to
    operate independently.
12. **Reintegrate deferred domains.** Nutrition, workouts, fasting, sleep,
    hydration, caffeine, recovery return through Track per the stage
    roadmap.
13. **Remove code only after evidence.** Physical deletion requires proof
    the code is unreachable, unimported, behaviorally replaced, and not
    providing reusable business logic.

---

## 8. Revised priority roadmap

| Priority | Slices | Outcome |
| --- | --- | --- |
| P0 | UX-01–UX-04 | Design foundation, state language, five-tab shell, and brand separation. |
| P1 | UX-05–UX-07 | Agenda-first Today and Protocol Core. |
| P2 | UX-08–UX-10 | Auditable actions, inventory, symptoms, side effects, and safety. |
| P3 | UX-11–UX-12 | Biomarkers home, manual results, and longitudinal record. |
| P4 | UX-13–UX-14 | Track destination, quick logging, Logbook, and correction history. |
| P5 | UX-15 | Weekly review and coverage-aware adherence. |
| P6 | UX-16 | ÆTERNA knowledge Library. |
| P7 | UX-17 | Stage 1B Health Sync experience. |
| P8 | UX-18 | Stage 3 reintegration of preserved Sparky domains. |

The sequence does not authorize later stages early. Each slice remains
subject to the canonical stage gate in `docs/ROADMAP.md`.

---

## 9. Revised implementation slices

### UX-01 — Semantic foundation

- **Scope:** light/dark tokens, typography, spacing, grid, depth, motion,
  icon rules, chart colors, accessibility constants.
- **Preserve/reuse:** existing `aeternaTokens`, Uniwind theme infrastructure,
  icon mapping, current warm light-theme work, platform accessibility APIs.
- **New requirements:** semantic token catalog, warm dark palette,
  typography roles, metric-number style, focus/disabled/safety/state tokens.
- **Acceptance boundary:** all shared tokens render in both themes, support
  large text, avoid color-only meaning.
- **Non-goals:** no navigation change, screen redesign, backend change, or
  domain migration.
- **Dependencies:** none. *(Status: substantially complete — v0.2 in
  `docs/PRODUCT_SPECIFICATION_V1.md` §9.)*

### UX-02 — State language

- **Scope:** implement the approved data-state taxonomy and shared
  presentation rules.
- **Preserve/reuse:** `StatusView`, loading indicators, error boundaries,
  sync state, existing empty/error components.
- **New requirements:** purpose-specific state components, action mapping,
  accessibility labels, queued/conflict/coverage representations.
- **Acceptance boundary:** every approved state is visually and
  semantically distinct; generic "No data" is not used when a more precise
  state is known.
- **Non-goals:** no new sync engine, medical interpretation, or protocol
  logic.
- **Dependencies:** UX-01.

### UX-03 — Five-tab application shell

- **Scope:** Today, Protocol, Biomarkers, Track, Library; profile-to-
  Settings; global quick-log entry point; development-only legacy routes.
- **Preserve/reuse:** existing navigation framework, `CustomTabBar`,
  `TabsLayout`, screen-header adapters, guards, deep-link infrastructure.
- **New requirements:** five-tab configuration, tab icons/labels, quick-log
  trigger, profile control, development-only dashboard route.
- **Acceptance boundary:** all five tabs are stable primary destinations;
  legacy dashboard is absent from normal navigation but development-
  accessible.
- **Non-goals:** no full destination content, route deletion, or
  business-logic removal.
- **Dependencies:** UX-01 and UX-02. *(Status: in progress — Today,
  Protocol, Track, Library live; Biomarkers tab addition is the immediate
  next step per the 2026-07-16 tab-visibility decision.)*

### UX-04 — Brand hygiene

- **Scope:** remove visible SparkyFitness identity from normal ÆTERNA
  flows.
- **Preserve/reuse:** authentication, settings, server connection, About
  structure, diagnostics, existing assets where brand-neutral.
- **New requirements:** ÆTERNA copy, empty/error language, revised About
  presentation, terminology inventory.
- **Acceptance boundary:** normal navigation and user-facing states contain
  no unintended Sparky or fitness-first branding.
- **Non-goals:** no removal of legacy code, domain behavior, APIs, or
  development references.
- **Dependencies:** UX-01–UX-03.

### UX-05 — Today agenda

- **Scope:** attention, safety, next action, due/overdue, monitoring,
  meaningful change, review/retest, freshness, selected metrics, recent
  history.
- **Preserve/reuse:** current `TodayScreen`, `AeternaMetricRow`,
  health-source freshness, sync provenance, existing query hooks and chart
  logic.
- **New requirements:** `AttentionBanner`, `SafetyBanner`, `ProtocolAgenda`,
  `ScheduledActionRow`, review row, compact freshness/coverage summary.
- **Acceptance boundary:** Today remains useful with no protocol or health
  source; no fake actions, values, changes, or scores appear.
- **Non-goals:** no protocol editing, full biomarker exploration, Track
  history, or generalized dashboard.
- **Dependencies:** UX-01–UX-04. Protocol-driven sections may remain honest
  empty states until UX-06.

### UX-06 — Protocol overview

- **Scope:** active protocol, purpose, immutable version, items, schedule,
  author context, review date, and past versions.
- **Preserve/reuse:** existing medication/injection foundations, scheduling
  utilities, date components, service/query patterns.
- **New requirements:** Protocol Overview, Version Detail, `VersionBadge`,
  protocol item rows, schedule sections.
- **Acceptance boundary:** only real protocol state is rendered; version
  history is clearly immutable and attributable.
- **Non-goals:** no automatic protocol generation, dose recommendation,
  biomarkers analysis, or AI adjustment.
- **Dependencies:** UX-01–UX-05.

### UX-07 — Eligibility and monitoring

- **Scope:** eligibility state, monitoring requirements, unresolved
  observations, reasons, and next review.
- **Preserve/reuse:** measurement and health-observation services, status
  components, notification foundations.
- **New requirements:** Eligibility screen, `EligibilityStatus`,
  `MonitoringRequirementRow`, reason/source detail.
- **Acceptance boundary:** every state explains its basis; the system does
  not diagnose or silently approve treatment.
- **Non-goals:** no clinician replacement, automatic prescribing, or opaque
  eligibility score.
- **Dependencies:** UX-02, UX-05, UX-06.

### UX-08 — Dose/action logging

- **Scope:** log scheduled actions as completed, skipped, deferred, or
  corrected.
- **Preserve/reuse:** existing medication/injection logging foundations,
  mutation hooks, timestamps, notification scheduling.
- **New requirements:** Dose/Action detail, completion sheet, reason
  capture, protocol link, audit-friendly correction entry.
- **Acceptance boundary:** every event is timestamped and attributable;
  correction does not silently erase original history.
- **Non-goals:** no dosing recommendation, inventory calculation beyond
  existing verified behavior, or health-score impact.
- **Dependencies:** UX-05–UX-07.

### UX-09 — Vial, reconstitution and inventory

- **Scope:** inventory, vial state, reconstitution records, expiry,
  remaining quantity, and injection-site context.
- **Preserve/reuse:** medication/injection foundations, measurement units,
  forms, calculations that can be verified and reused.
- **New requirements:** Inventory screen, vial detail, reconstitution flow,
  `InventoryCard`, unit-aware validation.
- **Acceptance boundary:** units and source values are explicit; invalid or
  ambiguous combinations fail safely.
- **Non-goals:** no clinical instruction generation, dose optimization,
  purchasing, or prescribing.
- **Dependencies:** UX-06 and UX-08.

### UX-10 — Symptoms, side effects and safety

- **Scope:** capture symptoms and side effects, associate them with
  time/protocol context, present approved safety actions.
- **Preserve/reuse:** measurement logging patterns, forms, notifications,
  timestamps, history infrastructure.
- **New requirements:** Symptom/Side-Effect Log, Safety Event, severity
  vocabulary, safety banner, escalation content slots.
- **Acceptance boundary:** events enter Track and relevant Protocol context;
  safety language is bounded and policy-approved.
- **Non-goals:** no diagnosis, causal determination, emergency triage
  engine, or autonomous protocol modification.
- **Dependencies:** UX-02, UX-06, UX-08.

### UX-11 — Biomarkers home and manual result flow

- **Scope:** Biomarkers landing experience, categories, recent results,
  manual result/panel entry, honest empty states.
- **Preserve/reuse:** measurement models, health data hooks, forms, unit
  conversion, existing chart and source logic.
- **New requirements:** Biomarkers Home, manual result flow, category rows,
  result cards, provenance inputs.
- **Acceptance boundary:** manual entries require observation date, unit,
  and source context where applicable; no invented reference range or
  interpretation.
- **Non-goals:** no generalized score, automated diagnosis, full Response
  Timeline, or Health Sync redesign.
- **Dependencies:** UX-01–UX-04 and UX-10 for shared observation
  conventions.

### UX-12 — Biomarker detail and longitudinal record

- **Scope:** result history, trends, source provenance, coverage,
  conflicts, documents, measurements, wearables, protocol annotations.
- **Preserve/reuse:** existing reports, charts, Health Sync data, metric
  queries, source metadata, date-range components.
- **New requirements:** Biomarker Detail, longitudinal record sections,
  `TrendChart`, `CoverageStrip`, `ProvenanceRow`, `ConflictCallout`, event
  annotations.
- **Acceptance boundary:** charts expose units, period, source, and
  coverage; insufficient data does not produce a fabricated trend.
- **Non-goals:** no opaque score, unsupported causality, or Stage 2
  automated adjustment.
- **Dependencies:** UX-02, UX-06, UX-08, UX-10, UX-11.

### UX-13 — Track and global quick-log composer

- **Scope:** Track home, category navigation, today's entries, manual
  health logging, cross-screen quick log.
- **Preserve/reuse:** `AddSheet`, Diary routes, measurement capture, food/
  activity/workout/fasting entry infrastructure, bottom sheets.
- **New requirements:** Track Home, `QuickLogComposer`, `TrackCategoryRow`,
  context-aware action selection.
- **Acceptance boundary:** Track exists as a complete destination; quick log
  returns users to their original screen and creates a visible Track entry.
- **Non-goals:** no immediate Stage 3 exposure of every preserved module, no
  replacement of Track with a floating button.
- **Dependencies:** UX-03, UX-08, UX-10, UX-11.

### UX-14 — Logbook and correction history

- **Scope:** chronological history, filtering, entry detail, correction,
  queued state, original-value preservation.
- **Preserve/reuse:** `DiaryScreen`, existing entry detail/edit flows,
  timestamps, mutation services, sync status.
- **New requirements:** Logbook, `LogbookRow`, entry detail shell,
  `CorrectionHistory`, filters and source labels.
- **Acceptance boundary:** supported entries are traceable from creation
  through correction and sync; destructive silent overwrite is unavailable.
- **Non-goals:** no clinical audit certification, generalized dashboard, or
  new analytics engine.
- **Dependencies:** UX-02, UX-08, UX-10, UX-11, UX-13.

### UX-15 — Weekly review and adherence

- **Scope:** scheduled-versus-observed coverage, unresolved items,
  meaningful changes, review summary, next review.
- **Preserve/reuse:** schedule calculations, history, charts, notification
  dates, action logs.
- **New requirements:** Weekly Review, `ReviewSummary`, adherence coverage
  representation, unresolved-item list.
- **Acceptance boundary:** no adherence percentage appears without an
  explicit denominator and date window; missing data remains distinguishable
  from non-adherence.
- **Non-goals:** no health score, automatic protocol change, or causal
  claim.
- **Dependencies:** UX-06–UX-14.

### UX-16 — Knowledge Library

- **Scope:** compounds, peptides, biomarkers, monographs, evidence,
  references, guides, templates, saved research, FAQs, editorial content.
- **Preserve/reuse:** existing Library navigation patterns, search
  infrastructure, safe images, list/detail primitives, module-specific
  catalog routes.
- **New requirements:** Knowledge Library Home, monograph screens, evidence/
  reference detail, saved research, content-type filters.
- **Acceptance boundary:** primary Library contains knowledge content; food
  and workout catalogs remain accessible only within their modules.
- **Non-goals:** no commerce, social feed, unreviewed medical advice, or
  automatic application of a template.
- **Dependencies:** UX-01–UX-04. Cross-links benefit from UX-06 and UX-11.

### UX-17 — Health Sync experience

- **Scope:** source overview, permissions, freshness, coverage, conflicts,
  sync history, errors, offline behavior, advanced settings.
- **Preserve/reuse:** existing `SyncScreen`, health integrations, permission
  handling, background sync, writeback settings, diagnostics.
- **New requirements:** source cards, coverage detail, permission education,
  conflict flow, queued/offline presentation.
- **Acceptance boundary:** users can distinguish disconnected, denied,
  syncing, partial, stale, unavailable, conflicting, and queued states;
  manual Protocol Core still works without sync.
- **Non-goals:** no infrastructure replacement, new provider integration,
  generalized score, or mandatory health-source connection.
- **Dependencies:** UX-02, UX-03, UX-11, UX-12, UX-14.

### UX-18 — Stage 3 nutrition/workout/fasting/recovery reintegration

- **Scope:** reintroduce preserved domains through Track using the ÆTERNA
  shell and observation model.
- **Preserve/reuse:** food, meal, barcode, photo logging, workouts,
  exercise catalogs, presets, fasting, hydration, measurements, reports,
  charts, services, APIs, settings.
- **New requirements:** Track category integrations, revised domain landing
  pages, shared provenance/history, module-specific catalog entry points.
- **Acceptance boundary:** domains work without redefining Today, Protocol,
  Biomarkers, or Library; existing functionality is preserved or migration
  gaps are documented.
- **Non-goals:** no premature Stage 1 exposure, fitness-dashboard
  restoration, or deletion-and-rebuild of working services.
- **Dependencies:** UX-01–UX-17 and explicit Stage 3 authorization.

---

## 10. Remaining owner decisions

The following remain genuinely unresolved; the approved navigation and
naming decisions (§3) and the two 2026-07-16 sequencing/visibility decisions
are not reopened.

1. **Safety-content governance.** Who approves symptom severity language,
   escalation copy, and emergency disclaimers?
2. **Evidence and editorial governance.** Who may publish or revise
   monographs, protocol templates, FAQs, and editorial content, and how is
   review status represented?
3. **Protocol-template boundary.** Are templates educational examples only,
   owner-created starting points, or user-applicable structures requiring an
   explicit review step?
4. **Onboarding deployment paths.** Should self-hosted server configuration
   remain a standard onboarding branch or move behind an advanced deployment
   option?
5. **Exact typeface selection.** The serif-plus-sans direction is approved,
   but the final families require licensing, multilingual coverage,
   performance, and accessibility confirmation.
6. **Stage 1 Track exposure.** Recommendation: show only functioning Stage 1
   categories and hide deferred categories rather than presenting multiple
   "coming soon" modules. Owner confirmation is still needed.
7. **Document handling in Biomarkers.** The product needs a decision on
   whether Stage 1 supports document metadata only, local attachments, or
   uploaded clinical documents with extraction deferred.

Implementation should wait until the owner approves this revised
recommendation and resolves only the decisions necessary for the first
authorized slice.
