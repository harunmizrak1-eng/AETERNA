# SparkyFitness feature coverage report

Feature-by-feature audit of ÆTERNA's full product-feature list against the
real SparkyFitness codebase (local reference clone at
`C:\Users\harun\Documents\New project\references\SparkyFitness`), per the
instruction: search whether SparkyFitness already implements 60-90% of a
feature before building new; reuse and refactor existing infrastructure
whenever possible; only build new modules when the domain doesn't already
exist.

This is a research document. No code was copied, no dependency was added, no
migration has begun, and no application UI was changed. Verdicts are
**Reuse as-is**, **Refactor** (exists, needs real rework for ÆTERNA), **Build
New** (doesn't exist), or **N/A** (explicit V1 non-goal per
`docs/ROADMAP.md` — Future Features are marked N/A without deep research).

## Headline finding

SparkyFitness's **medication/GLP-1 tracking domain** — built for a different
purpose (semaglutide/tirzepatide users logging injections) — turns out to be
the single biggest, least-expected win in this audit. `injection_entries`,
`medication_pens`, `medication_schedules`, and `medication_titration_steps`
are structurally very close to ÆTERNA's planned DoseLog/Vial/ScheduledDose
domain. This significantly changes the shape of ÆTERNA's own unique-domain
work from "build from scratch" to "refactor and extend an existing,
tested domain" for dose logging and vial/inventory specifically — the two
areas of ÆTERNA's core protocol loop that are NOT actually greenfield.

Everything else in the originally-assumed-unique clinical domain (Protocol
itself, the Peptide/Compound engine, Biomarkers, Response Timeline as a UI)
is confirmed genuinely absent, as expected.

## ÆTERNA's unique clinical/protocol domain

### Today screen

No unified dashboard exists. Closest analogs are split across
`SparkyFitnessFrontend/src/pages/Diary/DailyProgress.tsx` (calorie/macro
progress) and `SparkyFitnessFrontend/src/pages/CheckIn/CheckIn.tsx`
(weight/measurements/mood/photos/steps) plus a `RecentActivity.tsx` widget.
Neither combines recovery score, next-dose-due, tasks, alerts, or a "next
review date." The `user_dashboard_layouts` table and its `WidgetGrid`
mechanism (rearrangeable dashboard widgets) is reusable plumbing even though
no equivalent screen exists.

**Verdict: Build New**, using `user_dashboard_layouts`' widget-grid mechanism
as scaffolding.

### Protocol

No versioned, cross-domain "plan" object exists anywhere in the schema.
Nearest things are single-domain plan/template pairs —
`meal_plan_templates`/`meal_plan_template_assignments` (food only),
`workout_plan_templates`/`workout_plan_template_assignments` (exercise
only) — with no goal/version/review-date/adherence concept and no way to
bundle peptides + supplements + training + sleep targets into one plan.
`medication_titration_steps` gives ordered dose-escalation steps
(start_date, planned_weeks, step_order, status) but scoped to one
medication, not a protocol.

**Verdict: Build New.**

### Peptide/Compound engine

Confirmed absent, as expected. The `medications` table
(`db_schema_backup.sql:2370`) has clinical-adjacent fields (rxnorm_rxcui,
ndc, prescriber, effectiveness_rating) but nothing for mechanism, receptors,
half-life, evidence tier, contraindications/interactions, or monitoring — a
personal medication list, not a compound knowledge base.

**Verdict: Build New** (matches ÆTERNA's own existing static compound-seed
approach, `src/data/compounds.ts` in the sibling project — no reason to
route this through a database at all).

### Dose logging

**Strongest overlap in the audit.** `injection_entries`
(`db_schema_backup.sql:2042`) already has `medication_id`, `pen_id`,
`injected_at`, `entry_date`, `site`, `dose_mg`, `notes`, `source`,
`custom_fields` — structurally close to ÆTERNA's planned DoseLog (missing:
protocol linkage, planned-vs-actual, route/unit variety, side-effect/
response capture). `medication_entries` (`:2225`) covers oral doses with
`status` (taken/skipped) and `scheduled_for` vs. `taken_at`.
`medication_schedules` (`:2303`) covers frequency/day-of-week/interval/
cycle-on-off scheduling. Backend: `routes/v2/medicationRoutes.ts`,
`models/injectionRepository.ts`, `models/medicationEntryRepository.ts`.
**Not yet built on mobile** — SparkyFitness's own
`agent-docs/file-and-domain-reference.md` explicitly notes this domain has
no mobile screens yet.

**Verdict: Refactor** — reuse the injection/medication-entry/schedule shape
and repository pattern; extend for protocol linkage, planned-vs-actual, lot/
expiration, side effects; build the missing mobile UI (which ÆTERNA would
need to build regardless, so this isn't lost work).

### Vial/inventory management

**Also strongly covered.** `medication_pens`
(`db_schema_backup.sql:2249`) already models: `concentration_mg_ml`,
`volume_ml`, `doses_total`, `doses_used`, `status` (sealed/opened/etc.),
`opened_at`, `expiry_date`, `bud_date` (beyond-use date), `reorder_flag`,
`reorder_threshold`, `notes`. This is essentially Vial + Reconstitution +
low-stock-reminder combined, missing only batch/lot number and a distinct
reconstitution-date/dilution-math field.

**Verdict: Refactor.**

### Biomarkers

Confirmed absent. No `biomarker`, `lab_result`, `blood_panel`, or
`lab_marker` table anywhere in the ~120-table index
(`docs/content/8.developer/4.database.md`) or `db_schema_backup.sql`.
Wearable-synced physiological data (HRV, resting HR, SpO2, respiration) lives
in `sleep_entries` but nothing supports manually-entered lab panels or
lab-range-vs-optimal-range display.

**Verdict: Build New.**

### Response Timeline

Partially present as a building block, not a UI. `shared/src/medications/
correlations.ts` implements real Pearson-correlation statistics (with a
minimum-sample-size gate), used by GLP-1 reports to correlate doses against
symptoms/weight. Reports are otherwise per-metric standalone charts
(`MeasurementChartsGrid.tsx`, `SleepAnalyticsCharts.tsx`, `MoodChart.tsx`,
`StressChart.tsx`) — no screen overlays weight+HRV+sleep+symptoms+dose-events
on one annotated timeline.

**Verdict: Refactor** — reuse the correlation math and existing chart
components; build the overlay/annotation timeline UI new.

### Track (manual logging) — table by table

**Present, reuse as-is:** weight/height/body-fat%/neck/waist/hips
(`check_in_measurements`); custom user-defined measurement types
(`custom_measurements`/`custom_categories`); food/meals (`food_entries`,
`meals`); water (`water_intake`, `water_intake_entries`); workouts
(`exercise_entries`, `exercise_entry_sets`); sleep incl. stages/HRV/SpO2/RHR
(`sleep_entries`, `sleep_entry_stages`); mood with tags (`mood_entries`);
symptoms with severity/body-location (`symptom_entries`); progress photos
front/back/side (`check_in_photos`); fasting (`fasting_logs`).

**Missing, build new:** blood pressure (no `systolic`/`diastolic` column
anywhere), a general-purpose journal/notes entity (only per-record `notes`
fields, no standalone journal table), libido (exists only inside
cycle-tracking, `cycle_daily_entries.libido`, not general-purpose), manual
stress/energy logging (a `StressChart.tsx` report exists but is fed by
wearable-synced data, not a manual log table), and a dedicated pain-scale
field (reachable today only via generic `symptom_entries`).

**Verdict: Reuse as-is** for the present list; **Build New** for blood
pressure, journal, libido, and manual stress/energy/pain.

## Infrastructure-adjacent domain

### Nutrition — Reuse as-is

Full domain: `routes/foodRoutes.ts`, `foodEntryRoutes.ts`, `mealRoutes.ts`,
`waterContainerRoutes.ts`, `fastingRoutes.ts`; tables `foods`,
`food_entries`, `meals`, `meal_plans`, `water_intake`, `fasting_logs`.
Barcode/external search via `external_provider_types` (OpenFoodFacts, USDA,
FatSecret). Macros + micronutrients via `user_custom_nutrients`. Meal
templates, meal planning calendars, and a fasting timer are all present. No
dedicated "food quality" scoring found.

### Recovery — Refactor

`sleep_entries`/`sleep_entry_stages` carry `avg_overnight_hrv` and
`resting_heart_rate`; `services/sleepScienceService.ts` computes sleep-need/
goals. No explicit readiness/recovery score, training-load, or respiratory-
rate/temperature fields found. Currently surfaced only inside Reports, no
dedicated Recovery screen.

### Habits — Build New

No generic habit/check-in engine exists anywhere ("habit" appears nowhere in
`docs/content/2.features`). SparkyFitness is exclusively per-domain trackers
— nothing analogous to a customizable daily-habit checklist (meditation,
sunlight, cold exposure, sauna, breathing, reading, etc.).

### Workouts — Reuse as-is

Strong domain: `exercises`, `exercise_entries`, `exercise_entry_sets`,
`exercise_entry_activity_details` (HR/distance), `workout_presets`,
`workout_plan_templates`; frontend `pages/Exercises/`, mobile
`Workout*Screen.tsx`/`Exercise*Screen.tsx`. Covers strength/cardio volume
and history; PR/recovery-impact linkage not confirmed.

### Supplements — Refactor

The same Medications domain audited under Dose Logging/Vial above
(`routes/v2/medicationRoutes.ts`, schedules, entries, pens, injection
entries, titration steps, `shared/src/medications/{schedules,correlations,
glp1}.ts`) is structurally close to ÆTERNA's needs here too — it was built
for GLP-1 tracking, which sits architecturally between "supplement" and
"peptide protocol." No interaction-checker found. Not yet mobile-implemented.
This is the same underlying domain flagged under Dose Logging/Vial — one
refactor effort likely serves both ÆTERNA feature groups.

### Library/content — Build New

No research-article, guide, or saved-content system found anywhere in
`docs/content/2.features` or the route map. ÆTERNA's Peptide Vault has no
analog to reuse here.

### Community — N/A, confirmed not present

"Family & Friends Sharing" (`docs/content/2.features/9.family-friends-
sharing.md`) is multi-tenant delegation/permission-sharing (a `family_access`
table + RLS-gated diary/checkin/medications/reports access), not a social
feed. No posts/comments/likes/bookmarks anywhere. Community remains a V1
non-goal per `docs/ROADMAP.md` regardless.

### AI — Refactor (scope-gated)

A real, working chat assistant exists: `routes/chatRoutes.ts`,
`services/chatService.ts`, `ai/tools/`, `sparky_chat_history` table
(owner-only), mobile `screens/ChatScreen.tsx` using `@assistant-ui/
react-ai-sdk` + `@assistant-ui/react-native`. It does food-photo
recognition, nutrition extraction, and exercise/measurement/water logging
via tool calls, with a bring-your-own-provider model (OpenAI/OpenRouter/
Ollama/etc.). This is nutrition/fitness tool-calling, not a longevity-
coaching layer, but the chat infrastructure (history, tool-calling scaffold,
provider config) is directly reusable plumbing.

**AI coach is explicitly out of scope per ÆTERNA's own `AGENTS.md`** — this
finding is recorded for when that scope decision changes, not as a
recommendation to build it now.

### Practitioner/multi-user mode — Refactor

`family_access` table with 7 granular permissions
(`can_manage_diary`/`checkin`/`medications`, `can_view_reports`/
`food_library`/`exercise_library`, `share_external_providers`), RLS-enforced
least-privilege, a profile-switcher UI, and access-expiry dates. A real
coach/family-review foundation with no built-in "approval" step, but solid
read/write delegation to extend for Stage 4's Practitioner system.

### Health data sync — Refactor

Confirmed integrated: Apple Health (`@kingstinct/react-native-healthkit`),
Google Health Connect (`expo-health-connect`, `react-native-health-connect`),
Fitbit, Garmin Connect, Withings, Polar Flow (partially tested), Strava
(partially tested), Hevy (untested) — backend routes per provider
(`fitbitRoutes.ts`, `garminRoutes.ts`, `stravaRoutes.ts`,
`withingsRoutes.ts`, `polarRoutes.ts`, `googleHealthRoutes.ts`).

**Not present: Whoop, Oura, Dexcom/Libre CGM** — all net-new if ÆTERNA needs
them (Whoop/Oura are Stage 3 scope per `docs/ROADMAP.md`; CGM likewise).

### Progress tracking — Reuse as-is / Refactor

`check_in_measurements` (weight/neck/waist/hips), `check_in_photos`
(progress photos), `custom_measurements`/`custom_categories` for arbitrary
metrics; mobile `MeasurementsAddScreen.tsx`. Strength trends via exercise
entries/sets. No distinctly-modeled body-fat/lean-mass fields confirmed
(may already work as a custom measurement type). "Protocol adherence over
time" depends on the separately-audited medication/dose domain above.

### Reports/export — Refactor / Build New

`services/reportService.ts`, `models/reportRepository.ts`, `pages/
Reports/`, and mobile dashboard/detail screens are confirmed working with
real chart/trend visualization. **No PDF/CSV export or share-link feature
found** — route grepping for pdf/csv only surfaced food/exercise *import*,
not report *export*; the sharing feature doc
(`docs/content/2.features/11.sharing.md`) is an unwritten stub.

**Verdict: Refactor** the chart/report generation; **Build New** for export/
share-link.

### Settings — Reuse as-is

Comprehensive: `pages/Settings/`, `routes/preferenceRoutes.ts`,
`user_preferences` (units), notification preferences, OIDC/TOTP/passkey
auth, connected-device/provider management, nutrient-display and
calculation settings. Data-export/delete-account/subscription/language/
accessibility specifics aren't confirmed in docs (some are stubs) but the
settings architecture (routes/services/repos/RLS-tiered) is solid to extend.

### Future Features — N/A

CGM Intelligence, Biological Age, Genetics, MRI/Imaging Records, Clinic
Portal, Marketplace, Research Cohorts, Protocol Marketplace, Advanced AI —
all explicit non-goals through at least Stage 3-5 per `docs/ROADMAP.md`.
Not researched; no SparkyFitness coverage assessment is useful this far
ahead of the relevant stage gate.

## Summary table

| Feature group | Verdict | Key existing assets |
| --- | --- | --- |
| Today | Build New | `user_dashboard_layouts` widget-grid as scaffolding only |
| Protocol | Build New | none |
| Peptide/Compound engine | Build New | none (matches ÆTERNA's existing static seed-data approach) |
| **Dose logging** | **Refactor** | `injection_entries`, `medication_entries`, `medication_schedules` |
| **Vial/inventory** | **Refactor** | `medication_pens` |
| Biomarkers | Build New | none |
| Response Timeline | Refactor (math) / Build New (UI) | `shared/src/medications/correlations.ts` |
| Track — weight/food/water/workout/sleep/mood/symptoms/photos/fasting | Reuse as-is | `check_in_measurements`, `food_entries`, `exercise_entries`, `sleep_entries`, `mood_entries`, `symptom_entries`, `check_in_photos`, `fasting_logs` |
| Track — blood pressure, journal, libido, manual stress/energy/pain | Build New | none |
| Nutrition | Reuse as-is | full `foods`/`food_entries`/`meals`/`fasting_logs` domain |
| Recovery | Refactor | `sleep_entries` HRV/RHR fields, `sleepScienceService.ts` |
| Habits | Build New | none |
| Workouts | Reuse as-is | `exercises`, `exercise_entries`, `workout_plan_templates` |
| Supplements | Refactor | same medication domain as Dose logging/Vial |
| Library/content | Build New | none |
| Community | N/A | not present (V1 non-goal regardless) |
| AI | Refactor, scope-gated | `chatRoutes.ts`, `sparky_chat_history`, mobile `ChatScreen.tsx` — do not build until AI coach re-enters scope |
| Practitioner/multi-user | Refactor | `family_access` + 7-permission RLS model |
| Health data sync | Refactor | HealthKit/Health Connect/Fitbit/Garmin/Withings/Polar/Strava present; Whoop/Oura/CGM absent |
| Progress tracking | Reuse as-is / Refactor | `check_in_measurements`, `check_in_photos`, custom measurements |
| Reports/export | Refactor (charts) / Build New (export) | `reportService.ts`, `pages/Reports/` |
| Settings | Reuse as-is | `pages/Settings/`, `preferenceRoutes.ts`, `user_preferences` |
| Future Features (CGM, genetics, imaging, clinic portal, marketplace, advanced AI) | N/A | out of scope through Stage 3-5 |

## Recommendations

1. No migration or build work follows from this report by itself — Stage 0
   has not passed its exit gate.
2. When Stage 1A Protocol Core work is eventually approved, prioritize
   Dose Logging and Vial/Inventory first among ÆTERNA's unique domain — they
   are genuinely Refactor, not Build New, and share one underlying
   medication-domain refactor effort with Supplements.
3. Protocol itself, the Peptide/Compound engine, Biomarkers, and Today
   remain real Build New work — no shortcut exists in SparkyFitness for
   these; budget for them as net-new accordingly.
4. Response Timeline gets partial credit — the correlation math
   (`shared/src/medications/correlations.ts`) is a genuine asset worth
   reusing when that screen is built, even though the UI is net-new.
5. AI chat infrastructure exists and works, but stays untouched unless and
   until the AI-coach non-goal in `AGENTS.md` is explicitly revisited — this
   finding should not be read as license to start on it.
