# ÆTERNA decision log

## 2026-07-28 — Branding residue closed; multi-agent working rules reinforced

Two latent leftovers from the Render/SparkyFitness era were caught and
closed after the owner flagged that the EAS-built APK still showed
"SparkyFitness" and tried to reach the dead Render host:

- `DEFAULT_AETERNA_SERVER_URL` was still `onrender.com`. The Fly.io
  migration (2026-07-25) updated the deploy but never this constant, so
  every fresh install resolved to the suspended Render service. Fixed
  to `https://aeterna-os.fly.dev` (commit `8aad97d9`).
- `app.json` `expo.name` was `SparkyFitnessMobile` even though
  `app.config.ts` already set `APP_NAME = 'ÆTERNA OS'`. Because
  `expo prebuild` derives `android/.../strings.xml:app_name` from
  `app.json` at build time, the on-device home-screen label kept
  rendering SparkyFitness. `app.json` name set to `ÆTERNA OS` (slug,
  scheme, and bundle id intentionally unchanged to preserve EAS build
  identity and deep links).

Reinforced multi-agent working rules (after Claude's own honest
end-of-session report flagged three process failures):

- **`git add -A` is prohibited** for any agent working in the shared
  repo. Claude reported sweeping four foreign working-tree files into a
  commit this way; it was caught by a push rejection but the failure
  mode is real. Stage explicit paths only.
- **Read the existing route file before writing a parallel service.**
  Claude wrote an AI-vision lab service, then discovered the project
  already had a local tesseract OCR path that did not need to send the
  user's medical document to a third party. Reading first is already an
  AGENTS.md rule ("Read only the relevant 3–6 files"); reinforced here
  because the cost of not doing so was a privacy regression that was
  only caught by self-review.
- **Parallel sessions must not take work the other owns.** The remote
  type-migration session and the local session both wrote the same lab
  screen, producing a redundant backup branch. When delegating
  "continue", the delegating agent must enumerate what is already
  in-flight.

The three pending Neon migrations (`biological_event`,
`aeon_sharing_control`, `protocol_item_sort_order`) were applied by
restarting the Fly app; boot-time `applyMigrations()` ran them.
Verified live: `/api/health` 200, and the three new-table routes return
401 (auth gate reached) rather than 500 (relation missing).

## 2026-07-25 — Vision re-anchored: Biology Operating System, not a tracker

Decision (owner direction, recorded after full audit of today's app vs the
12-pillar vision). ÆTERNA's product identity is **not** "the most data you
can collect" but "the clearest understanding of what your biology is doing".
Tagline basis: *track less, understand more* / *your biology, decoded*.
Turkish: *vücudunun verdiği sinyalleri anlamlandır*.

The audit (3 parallel Explore agents covering mobile screens, server infra,
and health integrations) found:

- **Protocol→Response engine is ~75% scaffolded** — `effective_from` T=0
  anchor, every metric's date-indexed table + range query, and a mean/
  peak-delta/sample-gate idiom (in `cycleService` / `shared/src/cycle/
  correlations.ts`) already exist. Missing: one assembly service + one
  route + one helper. This is the lowest-effort, highest-value feature and
  becomes the spine everything else builds on.
- **Biological age is deliberately refused** (`deriveBiologicalSignals.ts:
  29-37`) as fabrication. This stance is **kept**. The vision's "biological
  profile" is reinterpreted as independent signals (recovery / metabolic /
  cognitive / cardiovascular) + trend, never a single invented number.
- **WHOOP and Oura have zero code.** HealthKit/Health Connect already
  deliver sleep + HRV + RHR + workouts. Wearable OAuth is days of work and
  adds no unique value over computing a recovery score from HRV + sleep
  debt ourselves (what WHOOP effectively does). Wearables are deferred to
  an optional Phase 5.
- Today screen is a task list + raw signals; `deriveBiologicalSignals`
  already computes the deltas Today doesn't consume.
- AEON is stateless chat today, grounded only by client-side prompt
  injection. Needs a server-side user-context endpoint to answer
  data-grounded ("you're tired because sleep −48min, training +31%").
- N=1 experiments have type + screen + server repo, but no scoring
  (intentionally). The scoring half is the missing value.
- Stack intelligence is a coarse category count (`peptide/hormone/glp1/
  supplement/other`); no pathway dimension ("recovery vs sleep compound").

### Approved decisions (9)

1. **Killer feature first: Protocol→Response engine.** Phase 1. Lowest
   effort, highest value; ~75% scaffolding exists.
2. **Keep the anti-fabrication stance on biological age.** No invented
   single score. Show independent signals + trend instead.
3. **Defer WHOOP/Oura.** Compute a recovery score from HRV + sleep debt
   ourselves; HealthKit/Health Connect is the data source.
4. **Add a pathway dimension to the compound model.** Extend the coarse
   `CompoundCategory` with `recovery/metabolic/cognitive/sleep/longevity`
   tags, sourced from real references (never fabricated).
5. **AEON becomes data-grounded via a server user-context endpoint**, not
   just prompt injection.
6. **Today becomes interpretation, not task list.** Consume
   `deriveBiologicalSignals`; show "current state + what changed this
   week + one AEON sentence".
7. **N=1 experiment scoring added.** `tracked_metric` (free text) → real
   baseline→outcome computation, sample-gated.
8. **Protocol timeline surfaces from hiding.** `ResponseTimelineScreen`
   (BUILT, buried in Biomarkers tab) becomes reachable from Protocol +
   Today.
9. **SQLite Phase 1.2 is a blocker.** Offline writes are required before
   any of the above is meaningful — "what changed" is an empty engine
   without data.

### Roadmap (5 phases, sequential, each a release)

- **Phase 0 (blocker):** SQLite Phase 1.2 (api seam swap + optimistic
  update). Token rotation + Render suspension (owner).
- **Phase 1: Protocol→Response Engine.** 1 service + 1 route + 1 helper
  + mobile ProtocolScreen delta grid + unhide ResponseTimelineScreen.
- **Phase 2: Today interpretation + Stack pathway intelligence.**
  `deriveBiologicalSignals` wired to Today; `CompoundCategory` pathway
  dimension; stack balance + duplicate-pathway alert.
- **Phase 3: AEON correlation AI.** `POST /api/v2/aeon/user-context`;
  data-grounded answers (with cache + rate limit for LLM cost).
- **Phase 4: N=1 experiment scoring + biological events.** Metric
  resolver, automated outcome, event types (illness/injury/travel/stress).
- **Phase 5 (optional):** WHOOP/Oura OAuth + Lab PDF OCR.

### Vision → phase map (the owner's 12 pillars)

| Pillar | Phase | Audit reality |
|---|---|---|
| #1 What changed | Phase 1 | ~75% scaffolded |
| #2 Protocol timeline | Phase 1 | BUILT, hidden |
| #3 Baseline/response | Phase 1 | weight/waist done, rest to add |
| #4 AEON correlation | Phase 3 | stateless → data-grounded |
| #5 N=1 experiment | Phase 4 | type+screen present, no scoring |
| #6 Stack balance | Phase 2 | category count only, no pathway |
| #7 Duplicate pathway alert | Phase 2 | absent |
| #8 Protocol builder (lego) | Phase 4+ | current builder exists, not lego |
| #9 Biological events | Phase 4 | timeline exists, no event types |
| #10 Lab scanner | Phase 5 | PDF/CSV present, no OCR |
| #11 Today interpretation | Phase 2 | task list → interpretation |
| #12 Community logs | out of scope | Study Club already protocol-log focused |
| WHOOP/Oura | Phase 5 (deferred) | zero code; HealthKit/HC sufficient |
| Biological age | refused | fabrication = anti-pattern |

### "Track less, understand more" test
Each phase is measured against: *does the app force the user to enter more
data, or does it derive meaning from data already there?* Phases 1–4 are
meaning-derivation phases. Phase 0 is data-entry plumbing (offline writes) —
necessary but adds no understanding on its own.

Why:
The product's only durable differentiator is connecting signals across
domains (protocol start → sleep/HRV/lab/training response), not collecting
more of them. The audit proved the spine already exists; the work is wiring
and a thin aggregation layer, not a new foundation. Recording this now so
every future feature decision is tested against "does this help the user
understand, or just track?".

## 2026-07-25 — Backend migrated Render → Fly.io (DB stays on Neon)

Decision:
Render free tier's 15-minute idle sleep made the backend unreachable
on cold starts, breaking every server-dependent flow (login, sync, chat,
community). The backend is now deployed to **Fly.io** (`aeterna-os.fly.dev`),
org `personal`, region `fra`.

Scope of the move:
- **Server only.** Express container (`SparkyFitnessServer` via
  `docker/Dockerfile.backend`) now runs on Fly. Stateless — no volumes.
- **DB unchanged.** Postgres stays on Neon
  (`ep-noisy-union-auqe93vv…neon.tech`, db `neondb`). Carry-over. The
  earlier 2026-07-18 decision to abandon Supabase Postgres (its reserved
  `auth` schema is incompatible with our migration chain) stands — Neon
  remains the DB. **Supabase is not used for the DB.**
- **Carry-over secrets (non-negotiable):** `SPARKY_FITNESS_API_ENCRYPTION_KEY`
  and `BETTER_AUTH_SECRET` copied from the Render `.env` exactly, so
  AES-256-GCM-encrypted provider keys / OAuth creds in Neon remain
  decryptable and existing session cookies stay valid.
- **Frontend URL updated** to `https://aeterna-os.fly.dev` (was
  `localhost:8080` in the local `.env`) so CORS and Better-Auth base
  resolve correctly for the new origin.
- **`fly.toml`** sets `auto_stop_machines = false` + `min_machines_running = 1`
  — the machine never sleeps, which is the entire reason for the move.
- **Memory:** 1 GB (`shared-cpu-1x`) to absorb the 215-migration boot
  spike. Can shrink to 512 MB after first boot.
- **Garmin microservice:** not deployed (skipped `GARMIN_MICROSERVICE_URL`).
  Garmin integration is dormant until a sidecar is added.

Mobile impact: **none.** Users point the app at the new URL in
Settings → Server URL (`https://aeterna-os.fly.dev`). `apiClient.ts`
resolves the URL at runtime via `getActiveServerConfig()` — no code change,
no rebuild required for existing installs.

Files: `aeterna-os/fly.toml` (new), `aeterna-os/.dockerignore` (added
`references/` + APK exclusions), `docs/deployment-fly.md` (new runbook).

Token hygiene: the deploy token used for this migration is a credential
in the chat history; rotate at https://fly.io/app/personal-access-tokens.

Why:
Render's free-tier sleep was a release blocker for any flow needing the
server. Fly.io's free shared-VM tier with `min_machines_running = 1`
keeps the server warm without cost. Docker was already authored
(`docker/Dockerfile.backend`) and the build is unchanged from the Render
build — zero code change, infrastructure-only move.

Open:
- Supabase URL/keys the owner supplied on 2026-07-25 are **not** used
  for this deploy. They remain available if a future phase moves the DB
  to Supabase (would require resolving the `auth` schema conflict first)
  or adds Supabase Edge Functions.
- Render's old `aeterna-api` service should be suspended/deleted from
  the Render dashboard once Fly is confirmed stable.

## 2026-07-25 — Offline-first SQLite architecture authorized (user-data layer)

Decision:
With bundled read-only content complete (174 compounds, 872 wger
exercises, 7083 USDA foods, protocol templates/guides/comparisons,
interaction checker — all local JSON, zero server dependency), and
login made optional (`localOnlyMode`), the remaining gap is the
**writable user-data layer**: protocols, dose logs, labs, symptoms,
water, food entries still POST to the server on every write. With the
server offline or unreachable (Render free-tier sleep, or local-only
mode), no user data can be recorded.

Architecture authorized (Claude executing, MVP scope):

- **SQLite = primary, server = secondary.** Every write lands in
  local SQLite first; the server is synced from an outbox queue when
  online. `api/<entity>Api.ts` signatures are preserved so React Query
  hooks and screens need no changes — only the implementation body
  swaps from `apiFetch` to a SQLite repository + outbox queue.
- **Library**: `expo-sqlite` (native — requires `expo prebuild`).
- **Migration runner**: `system.schema_migrations` pattern mirrored
  from the server, so migration names stay portable.
- **Outbox table**: `{id, entity_type, entity_id, operation,
  payload JSON, idempotency_key, status, attempts, last_error,
  created_at, synced_at}`. `idempotency_key` extends the dedup
  primitive already present on `createMedicationEntry` to every entity.
- **Sync engine**: mirrors the existing health-data sync engine
  (`backgroundSyncService.ts` / `autoSyncCoordinator.ts`) but iterates
  the outbox. Server-side conflict detection (`dataConflictRoutes`,
  already built but unused on mobile) is leaned on rather than
  reinvented.
- **Optimistic update**: `onMutate` writes SQLite + updates the React
  Query cache; `onError` rolls back. Currently absent everywhere —
  greenfield.
- **MVP entities (6)**: Protocol (+ version + item), MedicationEntry
  (dose log + injection), BiomarkerResult, SymptomEntry, WaterIntake,
  FoodEntry. CheckInMeasurement and ExerciseEntry are deferred to
  Phase 2.

Why:
The product direction (offline-first, free, no server dependency for
core use) is incompatible with server-only writes. Users in local-only
mode (the explicit onboarding path added 2026-07-24) currently cannot
record anything. SQLite primary + optional sync closes the gap without
abandoning the server (sync, conflict resolution, and AEON AI still
need it).

Risks recorded:
- `expo-sqlite` is native → managed-workflow builds need `expo
  prebuild`; build pipeline changes. Must be noted in AGENTS.md.
- Cross-device: if the app is reinstalled, SQLite is lost; server pull
  (Phase 1.3, per-entity `updated_at` cursor) is the recovery path.
- Some entities may lack a server `GET all` endpoint; pull may require
  new server routes in Phase 2.
- Outbox growth during long offline periods needs batch sync + rate
  limiting.
- Conflict resolution UI is unbuilt; `useDataConflict` is wired but
  attached to no screen — Phase 2.

## 2026-07-18 — Faz B started: tool screens, Community (Discourse), reminders, account export

Decision:
With Faz A code-complete (HEAD `ba220562` → `b681caa8`), owner directed
the three-agent team into Faz B (product deepening) in parallel:

- **ZCode (GLM-5.2)** — three Pepty/PeptIQ-inspired tool screens:
  `ReconstitutionCalculatorScreen`, `HalfLifeChartsScreen`,
  `InteractionCheckerScreen` (commit `ea489529`), reached from a new
  Tools cluster on the Library shell. Educational/reference only; not
  medical advice.
- **Claude** (final day, membership ended 2026-07-18) — (1) **live
  Postgres blocker RESOLVED on Neon**, not Supabase: Supabase permanently
  reserves the `auth` schema for GoTrue and silently refuses `postgres`
  the CREATE privilege there, but `InitialDB.sql` and 32 migrations must
  own `auth`, so Supabase is unusable as-is; the owner supplied a Neon
  Postgres (PG 18.4) and all 199 + the new PK migration applied cleanly,
  RLS + grants issued, cross-user isolation verified. Also found and fixed
  a real defect — `rls_policies.sql`'s ENABLE-RLS list omitted 11 ÆTERNA
  tables, leaving their policies inert (no row isolation) on every
  deployment (source fix left uncommitted for review; enabled live on
  Neon). (2) `compounds` half-life / interactions backend committed
  (`37e5a849`: `20260718120000_add_compound_pharmacokinetics.sql`,
  `compoundInteractions` rules service, `GET /v2/compounds/interactions`)
  feeding ZCode's tool screens. (3) `/api/v2/account/export` endpoint —
  NOT done (still open, see below).
- **hy3** — Discourse community integration (proxy + mobile screens,
  mock-REST fallback when no live Discourse is installable in agent envs)
  and protocol dose reminder notifications.

Faz B is **in-stage deepening of Stage 1A**, not a new stage. Roadmap
stage gates (1A → 1B → 2 → 3) unchanged.

Open in Faz B (after this entry):
- **Live DB: RESOLVED on Neon** (2026-07-18). Supabase (`db.oodkaoqqthatbxdmtfni`)
  was abandoned — its reserved `auth` schema is incompatible with the
  SparkyFitness migration chain (confirmed: `GRANT CREATE ON SCHEMA auth`
  is silently refused). Neon (`ep-noisy-union-auqe93vv…neon.tech`, db
  `neondb`) has the full schema + RLS applied. Remaining: `db_schema_backup.sql`
  sync needs `pg_dump` (not installed in the agent env — owner runs
  `./db_backup.sh` against the Neon `.env`); `/api/v2/account/export`
  endpoint still to build.
- Live Discourse: hy3 ships a Discourse-shaped mock proxy; flipping
  `DISCOURSE_BASE_URL` + `DISCOURSE_API_KEY` later wires it to a real
  self-hosted instance.

Why:
Faz A delivered the peptide-first surface; Faz B fills the operational
gaps users immediately hit (reconstitution math, half-life intuition,
stack-interaction advisory) and the social/knowledge backbone
(Discourse Study Club) named in `docs/MASTER_PRODUCT_BRIEF.md`'s
seven-engine vision.

## 2026-07-18 — Faz A — Peptide-First UI complete; three-agent division recorded

Decision:
Faz A — Peptide-First UI is **code-complete and committed** at HEAD
`ba220562` on `overnight/aeterna-product-integration`. The ÆTERNA mobile
app is now peptide-first across its full surface, no longer a Sparky
retfit. Three-agent division (recorded for future context):

- **ZCode (GLM-5.2)** — UI through Paket 6 (AddSheet peptide-first,
  Track→Logbook navigation, Onboarding ÆTERNA rebrand + trust-verification,
  Apple Health theme reset), plus all governance docs (AGENTS.md
  constitution rights/typecheck/lint discipline, DECISIONS, ROADMAP,
  HANDOFF, mobile AGENTS.md Source Map).
- **Claude** — Paket 5 Compound Library mobile (CompoundLibraryScreen,
  CompoundDetailScreen, compoundLibraryApi, useCompounds, tests) and the
  injection logging flow (InjectionLogScreen, InjectionSitePicker,
  injection API + dose-log site/entry_type params). Membership ended
  2026-07-18 after delivering S2-01 DataConflict (`89687f4c`) and Faz A
  mobile slices.
- **hy3** — Faz A backend (compounds migration + RLS + CRUD routes,
  reconstitution pure functions, biomarker normalization hardening,
  ConflictIndicator + useDataConflict standalone), Paket 7 wire-up
  (ReconstitutionSheet in vial/pen form, DataConflict resolution wired
  into BiomarkersScreen), Open Peptide Dataset CC BY 4.0 bulk seed
  (~47 compounds, idempotent `ON CONFLICT DO NOTHING`, attribution to
  peptidepedia.org/pepmod.com), and the typecheck-clean verification
  pass.

What is now in users' hands (peptide-first):
- `AddSheet` main grid: Log Dose / Lab Result / Safety / Measurements /
  Sync; Sparky actions behind "More".
- `Today` / `Protocol` / `Biomarkers` already peptide-aware (unchanged,
  verified).
- `Track` tab = Logbook (nutrition hidden behind `STAGE_3_LIFESTYLE_VISIBLE
  = false`), peptide-first category routing.
- `LibraryShellScreen` Compounds section live, with ~47 seeded compounds
  (Open Peptide Dataset CC BY 4.0), evidence tier badges, "education/
  reference only - not medical advice" labels, drill-in monograph.
- `InjectionLogScreen`: dose → pen/vial → reconstitution (`calculateDoseVolume`)
  → site (8-site rotation picker) → log with `entry_type:'injection'` +
  `site`; reached from AddSheet "Log Dose".
- Onboarding: ÆTERNA welcome + "always free, no paywall/ads/tracking"
  counter-positioning + trust-verification copy.
- Theme: Apple Health white/indigo light palette (ivory/gold retired);
  serif display → system sans-serif; tighter radii.
- DataConflict resolution surfaced in BiomarkersScreen.

Open / carried forward (unchanged from prior handoffs):
- Live-Postgres application of every migration (Stage 1A + S2-01 + compounds
  + Open Peptide Dataset seed) — no docker/.env/psql in agent envs.
  `db_schema_backup.sql` and `@workspace/shared` Zod schemas for all new
  tables remain unsynchronized.
- Stage 1B device verification — no physical iOS/Android access.
- Stage 1A exit gate formally still open (Baseline/Eligibility/SafetyEvent
  backend land; Faz A did not relitigate it).

Why:
Owner's strategic re-centering (2026-07-17) was to ship a working, peptide-
first, free app instead of finishing Health Sync infrastructure first.
Faz A delivers that. Three parallel agents (ZCode UI, Claude mobile feature
work, hy3 backend + wire-up) collapsed ~7 days of sequential work into
~24 hours by enforcing a strict file-ownership split (ZCode/Claude owned
`src/screens/*` and `src/components/*`; hy3 owned backend + standalone
components; no concurrent edits to the same file).

## 2026-07-17 — Reference apps and data sources: written permission obtained; copy-freely authorized

Decision:
The owner has obtained written permission to use, copy, and adapt material from
the following reference applications and data sources:

- **Reference apps** (decompiled for study; owner has direct permission):
  Pepty, PeptIQ, Protocol (PeptideTracker), Peppedia, Lifehackr (Lifehack),
  Longevity Labs.
- **Open Peptide Dataset** (Peptides Institute) — CC BY 4.0, commercially
  usable with attribution, two-stage verification, primary-source URLs per
  fact. This is the seed source for the compound registry.
- **peptidepedia.org** and **pepmod.com** — owner obtained written email
  permission (not scraping); content may be referenced and adapted.

Consequence: feature designs, UX flows, screen layouts, onboarding copy
patterns, compound data, and editorial content from these licensed sources may
be freely copied and adapted into ÆTERNA. Closed-source competitors' private
APIs, undisclosed algorithms, or non-public internal content remain off-limits
as before.

Why:
ÆTERNA's strategy is a peptide-first longevity OS that is completely free, has
no subscription, no ads, and no user tracking — a direct counter-positioning to
the paywall/ad/tracking model of Pepty, PeptIQ, and Longevity Labs (all of which
embed RevenueCat/Facebook SDK/AppsFlyer/`AD_ID`). Borrowing their UX patterns
while stripping the monetization layer is the core differentiator. Speed
matters (owner time-constrained), and reusing licensed reference material beats
reinventing commodity tracker UX.

`AGENTS.md`'s prior "Never treat a competitor feature, design, private API,
algorithm, content, or source code as directly reusable" clause is replaced by
the explicit licensed-sources carve-in above.

Open item: ÆTERNA's own open-source license choice (GPL/AGPL/MIT) is deferred.
SparkyFitness retains its existing commercial-use permission (2026-07-15). The
"free, no-subscription, no-ads" product stance is fixed; the code-license
selection is not.

## 2026-07-17 — Peptide-first Faz A: ROADMAP in-stage reordering authorized

Decision:
The owner directed a strategic re-centering of ÆTERNA on its product heart —
peptide protocol, vial/reconstitution, today's schedule, dose logging — ahead
of further Health Sync UI work. This is an **in-stage reordering**, not a stage
gate change or a Roadmap rewrite:

- **Compound Library (Knowledge/Body Atlas Engine)** is reclassified as a
  Stage 1A Protocol Core extension (the canonical spec's seven-engine vision
  names Knowledge Engine alongside Protocol Engine), not Stage 2 scope. It
  proceeds inside Stage 1A. Open Peptide Dataset seeds the compound registry.
- **Track → Logbook transformation** is the accepted UX-13 scope (Track Home /
  Global quick log / Logbook) the 2026-07-16 Master Product Brief decision
  already authorized. The current Track tab points at Sparky's nutrition
  `DiaryScreen`; Faz A repurposes it into a dose/injection/symptom/lab
  timeline (Logbook), with the Sparky nutrition diary reachable behind a
  `__DEV__` route, matching the existing legacy-route pattern.
- **Stage 1B Health Sync backend and services are frozen-but-kept**, not
  deleted. S2-01 (DataConflict foundation, commit `89687f4c`) is accepted as
  Stage 1B closure. The agent (Claude) proceeds with bounded, non-UI Stage 2
  hardening (S2-02 conflict-indicator component, S2-03 biomarker
  normalization) and Faz A backend support (compound library backend,
  reconstitution pure functions), explicitly NOT touching screen/layout files
  that the GLM agent is rebuilding peptide-first.
- **Nutrition/Training remain Stage 3** (unchanged from 2026-07-16). This
  decision does not pull Lifestyle Core forward.
- **No paywall, no ads, no tracking** is a fixed product rule.

Why:
Three days were spent on Health Sync infrastructure while the product's heart
(peptide protocol + vial + dose + today) had no visible mobile experience. The
owner's priority is a working, peptide-first, free app that does not look like
a Sparky retrofit. Reordering inside Stage 1A (rather than declaring a new
stage) keeps the gate discipline while unblocking the user-visible work.

Consequences:
- "Faz A — Peptide-First UI" is added under Stage 1A in `docs/ROADMAP.md`.
- The GLM agent owns all `src/screens/*` and `src/components/*` UI work
  (onboarding, AddSheet, Track→Logbook, compound library mobile, theme).
- The Claude agent owns backend + new standalone components only; it does not
  edit screen/layout files during Faz A.
- Stage 1B device verification and live-Postgres application remain open
  external blockers, unchanged.

## 2026-07-16 — Stage status reconciled to one active stage; Stage 1A exit gate held open; canonical Protocol Core completion work authorized

Decision:
`docs/ROADMAP.md` labeled both Stage 0 ("ACTIVE — validation incomplete")
and Stage 1A ("IN PROGRESS") simultaneously, contradicting its own global
gate rule ("only one product stage may be active at a time"). This is
corrected: **Stage 1A is the single active implementation stage.** Stage 0's
exit gate has still never been formally passed — that evidence gap is not
resolved by this entry and is not silently dropped; it is carried forward
as open release-blocking debt (see Consequences), exactly as the 2026-07-15
"Stage 0 closed; move to Stage 1A" entry already, explicitly, and
consciously chose to do. Nothing in this entry reopens Stage 0 as active
work — it removes an inaccurate "ACTIVE" label from a stage nobody is
currently doing anything on.

Separately and more substantively, the owner has reviewed
`docs/STAGE_1A_EXIT_GATE_REVIEW.md` (2026-07-16) and made the Stage 1A exit
option decision that document's §10 left open:

**Stage 1A is not complete merely because UX-01–UX-15 surfaces exist, and
the current "read existing medication records as tracked interventions"
compatibility shell is explicitly NOT accepted as sufficient for the Stage
1A exit gate.** The missing canonical Protocol Core work — Baseline,
Eligibility assessment, Protocol draft/review/activation with immutable
versioning, canonical schedule linkage, server-side dose idempotency,
inventory hardening, SafetyEvent as a first-class record, Stage 1A data
export completeness, a real manual BiomarkerResult flow, and a completed
Weekly Review — is now authorized as Stage 1A completion scope (tracked as
S1A-16 through S1A-26 in this session's task list), to be implemented
before Stage 1B Health Sync work begins. Stage 1B code-level work (S1B-01
onward) may proceed immediately after Stage 1A's *code-testable* exit
criteria pass; physical-device verification remains a separate, explicitly
tracked release blocker and does not itself gate Stage 1B *development*.

Why:
Owner judgment, recorded directly in this session: the exit-gate review's
finding that three of the exit gate's eight named legs (Baseline,
Eligibility, Protocol activation) do not exist as implemented features, and
a fourth (Safety Event Workflow) has no backend support at all, means the
"tracked interventions" shell — while real, tested, and honestly labeled in
the product itself — is not the governed Protocol Core the Stage 1A
deliverables and exit gate actually describe. Closing the gate on the shell
alone would misrepresent what Stage 1A promises. This is a deliberate
choice to do more implementation work now rather than formally lower the
bar for Stage 1A completion.

Rejected:
- Declaring Stage 1A complete on the strength of UX-01–UX-15 alone.
- Formally closing the Stage 1A exit gate against a redefined, narrower
  scope that excludes Baseline/Eligibility/Activation/SafetyEvent.
- Leaving Stage 0 and Stage 1A both labeled "active" simultaneously.
- Waiting for physical-device evidence before starting Stage 1B
  *development* work (device evidence blocks *release*, not development).

Consequences:
- `docs/ROADMAP.md`'s Stage 0 entry is reworded to remove the "ACTIVE"
  label and state plainly that its exit gate has not passed and its
  evidence gap is carried-forward, unresolved release-blocking debt — its
  deliverables/exit-gate/non-goals content is unchanged, only the status
  line.
- `docs/ROADMAP.md`'s Stage 1A entry keeps "IN PROGRESS" and gains a note
  that UX-01–UX-15 completion does not by itself satisfy the exit gate;
  see `docs/STAGE_1A_EXIT_GATE_REVIEW.md` for the maturity matrix.
- This session's task list (S1A-16 through S1A-26, a UX-hardening pass, and
  a re-verification pass) is the authorized Stage 1A completion scope.
  Additive database migrations are explicitly authorized as part of this
  scope, following `agent-docs/new-migration-checklist.md`'s existing safe
  procedure (migration file → RLS policy update → server restart → backup
  script → Zod schema → documentation) — this is a narrower, scoped
  exception to the general "documentation/audit/prototype tasks must not
  add migrations" rule in `AGENTS.md`, not a blanket lift of that rule.
- No historical entry below is edited or removed. The 2026-07-15 "Stage 0
  closed; move to Stage 1A" entry's own accepted evidence gap remains the
  operative record of why Stage 0's gap was knowingly carried forward in
  the first place; this entry only updates the current-status label to stop
  contradicting it.

## 2026-07-16 — Master Product Brief adopted as long-term reference; Product Alignment Gate resolved (4 of 10 questions)

Decision:
The owner-provided "ÆTERNA OS — Master Product Brief ve Yol Planı" is adopted
as a long-term reference document (saved as `docs/MASTER_PRODUCT_BRIEF.md`)
describing the eventual seven-engine product (Protocol, Nutrition, Training,
Biomarker, Tracking, Knowledge/Body Atlas, AI, Community). Per the brief's
own instruction, it does not by itself authorize implementation, does not
retroactively rewrite UX-01–UX-10, and does not change `docs/ROADMAP.md`'s
stage gates. It is planning input, the same status as
`docs/UX_TRANSFORMATION_REVIEW.md` and `docs/COMPETITIVE_PARITY_BLUEPRINT.md`.

The brief itself named a "Product Alignment Gate" of ~10 owner decisions
required before UX-11 or broad new screens begin. Four were resolved
directly with the owner this session; the rest remain open (see below).

Resolved:
1. **Library keeps its name** — no rename to "Explore." Internal
   segmentation (Knowledge/Community/Atlas) may still be added later inside
   the existing `Library` tab without a navigation-level rename.
2. **Lifestyle Core (Nutrition/Training) is not pulled forward.** The
   existing `docs/ROADMAP.md` stage order (1A → 1B → 2 → 3) is unchanged;
   Nutrition and Training remain Stage 3 scope. The brief's "Faz B" does not
   start early.
3. **Continue with the brief's "Faz A" items that don't depend on any open
   gate question**: Track Home, Global quick log, Logbook/Correction
   history, Weekly review, Adherence, and Biomarkers detail/longitudinal
   record. These extend already-adopted `docs/UX_TRANSFORMATION_REVIEW.md`
   slices (UX-11 Biomarker detail, UX-13 Track/quick-log, UX-14 Logbook/
   correction history, UX-15 Weekly review) rather than introducing new
   scope, so they proceed without waiting on the remaining gate questions.
4. **No canonical Protocol create/draft flow yet.** UX-06's read-only shell
   scope is unchanged; manual protocol creation remains a later, separately
   approved slice (matches the existing "canonical Protocol persistence does
   not yet exist" limitation already recorded for UX-06).

Still open (owner has not yet decided; do not assume an answer):
- ÆON as the AI feature's working name (needs trademark/name check first).
- Compound-content governance (who authors/reviews compound monographs,
  how evidence tiers are assigned).
- Safety/escalation copy approval ownership.
- Community's launch scope and moderation model.
- Whether self-directed-wellness and practitioner-guided modes split.
- Whether Body Atlas starts 2D-only (brief recommends yes, not yet
  confirmed as a formal decision).

Why:
Owner reviewed the brief's own "Product Alignment Gate" section directly
and answered the four questions that were blocking or shaping immediate
next work; the remaining questions only matter once their respective phases
(AI naming, Community, Body Atlas, governance) actually start.

Rejected:
Treating the brief as an implementation order, rewriting UX-01–UX-10,
renaming Library, or pulling Nutrition/Training Core earlier than Stage 3.

Consequences:
- `docs/MASTER_PRODUCT_BRIEF.md` is the canonical long-term reference for
  the seven-engine vision (Protocol, Nutrition, Training, Biomarker,
  Tracking, Knowledge/Body Atlas, AI, Community) and the Today/Track
  layouts, visual-formula (Apple Health/Huawei Health/OneTwenty/editorial
  blend), and state-language rules it describes — consult it when those
  areas are eventually scoped for implementation.
- The next implementation slices are the four Faz-A items named above,
  continuing the existing UX-01–UX-10 codebase without any rename or
  re-architecture.
- Every remaining open gate question blocks only its own specific phase
  (AI, Community, Body Atlas, governance) — it does not block Faz A.

## 2026-07-16 — Adopt revised UX/IA plan; show all 5 tabs from the start; move Today's agenda-first redesign earlier

Decision:
The owner-provided revised UX/IA document is adopted as the canonical,
granular execution plan and saved as `docs/UX_TRANSFORMATION_REVIEW.md`. It
extends, rather than replaces, `docs/PRODUCT_SPECIFICATION_V1.md` (product
principles, canonical navigation, information architecture) and supersedes
`docs/SPARKY_TRANSFORMATION_PLAN.md`'s module-level KEEP/REFINE/BUILD
NEW/DELETE table with a screen-by-screen classification and an 18-slice
(UX-01–UX-18) implementation sequence.

Two points where the revised document changes previously recorded behavior
are resolved explicitly here, on the owner's confirmation:

1. **Tab visibility.** `docs/PRODUCT_SPECIFICATION_V1.md` §4 previously read
   "Do not expose empty primary tabs in production. A destination enters the
   visible tab bar only when it provides a useful real-data flow." This is
   superseded: all five primary destinations (Today, Protocol, Biomarkers,
   Track, Library) are visible from the five-tab shell onward. A destination
   with no working flow yet shows an honest, purposeful pre-release/empty
   state (one of the approved state-language values) rather than being
   hidden from the tab bar or showing fabricated content.
2. **Today sequencing.** `docs/PRODUCT_SPECIFICATION_V1.md` §10 previously
   scheduled Today's agenda-first transformation at v0.12, after Protocol,
   Biomarkers, and Track were built. This is superseded: Today's agenda-first
   redesign moves to priority P1, immediately after the five-tab shell and
   alongside Protocol Core (UX-05, bundled with UX-06/UX-07 in
   `docs/UX_TRANSFORMATION_REVIEW.md`), so Today is rebuilt once, in step
   with Protocol Core landing, rather than twice.

Why:
Owner reviewed both options for each point and explicitly chose the revised
document's approach over the previously recorded one. Rebuilding Today twice
(once now, once at v0.12) is wasted work; building it alongside Protocol Core
means each Today agenda row lands with real backing data instead of a second
pass. Showing all five tabs immediately, gated by honest state language
instead of visibility, keeps the destination map visible to the user
throughout Stage 1A rather than surprising them with tabs appearing over
many versions — as long as no tab ever shows fabricated content, this does
not conflict with `docs/PRODUCT_SPECIFICATION_V1.md` §3.3 ("Real data only").

Rejected:
Keeping the original progressive tab-exposure rule (hide a tab until its
flow is real-data-complete) and keeping Today's redesign scheduled last
(v0.12) after Protocol/Biomarkers/Track.

Consequences:
- `docs/PRODUCT_SPECIFICATION_V1.md` §4 and §10 are amended to match (see
  same-day edit).
- Every tab shown before its domain is real must use the approved state
  vocabulary (`docs/PRODUCT_SPECIFICATION_V1.md` §6) for its empty state —
  "Not yet available" / "Not created" style copy, never sample data.
- `docs/UX_TRANSFORMATION_REVIEW.md`'s UX-01–UX-18 slice sequence, priority
  table (P0–P8), screen classification, and component inventory become the
  operative execution plan for Stage 1A; `docs/ROADMAP.md`'s stage gates
  remain authoritative and unchanged — this decision reorders *slices inside*
  Stage 1A, it does not reopen or skip a stage gate.
- The pre-existing v0.5 "Protocol shell completion and device review" step
  (fixing the on-device `TabsLayout.tsx` native-tabs-context crash, commit
  `74a79ed5`) still had to land first, since none of UX-05 onward can be
  verified on a device that crashes opening Today/Protocol. That fix is
  landed as of this entry; UX-05/UX-06 work follows the same day.

## 2026-07-15 — Correction: reopen Stage 0; Stage 1A has not begun

Decision:
The earlier decision titled "Stage 0 closed; move to Stage 1A" is superseded.
A filesystem and Git handoff audit proved that the expected SparkyFitness
working copy at `AETERNA/aeterna-os` did not exist, no Sparky dependencies had
been installed, and no Sparky build, automated-test baseline, or live health
sync validation had occurred. The repository-correction pass created a clean,
independent SparkyFitness clone, but cloning alone does not satisfy Stage 0.
Stage 0 is active and Stage 1A implementation has not begun.

Why:
The uncommitted Rebranding/Today work was implemented against the old
Expo/SQLite prototype, not the selected SparkyFitness foundation. Treating it
as Stage 1A would continue the explicitly rejected application foundation and
would hide the unmet build/test/health-sync gates.

Rejected:
Counting old-prototype UI changes as Stage 1A progress or treating a source
clone as a validated foundation.

Consequences:
- The old-prototype implementation is preserved on archive branch
  `archive/claude-prototype-stage1a-20260715` at commit `0a16ba0` and removed
  from the active working tree.
- `AETERNA/aeterna-os` is the only future implementation target.
- No rebranding or feature implementation begins until a separate approval
  covers dependency installation and lightweight foundation validation.
- The superseded closure entry below remains unchanged as historical context.

## 2026-07-15 — Stage 0 closed; move to Stage 1A

Decision:
Stage 0 is marked COMPLETE on the owner's explicit instruction. The project
moves to Stage 1A — ÆTERNA Foundation & Rebranding (the existing
`docs/ROADMAP.md` "Protocol Core" stage, reframed under this name).
Documentation output stops after `docs/SPARKY_TRANSFORMATION_PLAN.md`;
implementation becomes the priority.

Why:
Owner judgment: `docs/COMPETITIVE_PARITY_BLUEPRINT.md`, `docs/ROADMAP.md`,
`docs/DATA_MODEL.md`, `AGENTS.md`, `docs/MODULE_ADOPTION_REPORT.md`,
`docs/COMPETITIVE_UX_REPORT.md`, and `docs/SPARKYFITNESS_FEATURE_COVERAGE.md`
are sufficient planning depth for Stage 0; further research has diminishing
returns and further delays building.

Evidence gap, recorded honestly:
`docs/ROADMAP.md`'s Stage 0 exit gate also lists "supported iOS and Android
builds are reproducible," "existing automated tests establish a usable
baseline," and "health sync behavior and limitations are evidenced" as
requirements. None of these three were independently produced — the health-
sync and test-coverage claims in `docs/SPARKYFITNESS_FEATURE_COVERAGE.md`
are static-code-reading findings, not a build/run/test execution. The owner
is knowingly closing Stage 0 without them, accepting that risk consciously
rather than blocking on it. This is not silently waived — it is carried
forward explicitly below.

Rejected:
Continuing to gate Stage 1A start on independently producing iOS/Android
build evidence, a run test baseline, and live health-sync validation before
any implementation begins.

Consequences:
- iOS/Android build reproducibility, an automated-test baseline, and live
  HealthKit/Health Connect validation remain open risks, now to be
  discovered/resolved *during* Stage 1A implementation rather than before it,
  since they require an actual build to verify. If a build/run/test attempt
  during Stage 1A surfaces a blocking problem, that blocks further Stage 1A
  work at that point — this decision defers the check, it does not remove it.
- No further planning/audit documents are created unless a specific
  implementation task requires one.

## 2026-07-15 — KEEP / REFINE / BUILD NEW replaces Reuse/Refactor/Build New

Decision:
Existing-module classification uses three categories going forward: **KEEP**
(use as-is, no rework), **REFINE** (exists, needs real rework for ÆTERNA),
**BUILD NEW** (doesn't exist in SparkyFitness). A fourth action, **DELETE**,
applies to existing SparkyFitness UI/screens that are fully superseded by a
new ÆTERNA screen covering the same ground (e.g. its dashboard-ish screens
once ÆTERNA's own Today is built) — distinct from BUILD NEW, which is for
domains with no existing analog at all.

Why:
Owner judgment: this is more practical for planning actual work than the
previous Reuse-as-is/Refactor/Build-New/N/A vocabulary used in
`docs/MODULE_ADOPTION_REPORT.md` and `docs/SPARKYFITNESS_FEATURE_COVERAGE.md`.

Rejected:
Rewriting the existing Module Adoption Report or Feature Coverage report to
the new vocabulary — they remain valid under their original terms (Reuse
as-is ≈ KEEP, Refactor ≈ REFINE, Build New ≈ BUILD NEW) and are not
retroactively edited, to avoid unnecessary doc churn now that documentation
output is winding down.

Consequences:
`docs/SPARKY_TRANSFORMATION_PLAN.md` is the first and canonical user of this
four-action vocabulary (KEEP/REFINE/BUILD NEW/DELETE).

## 2026-07-15 — SparkyFitness is the only application foundation

Decision:
Use SparkyFitness as the sole technical application foundation. Other projects
are read-only architecture references or module donors.

Why:
It matches the target Expo/React Native runtime and contains the health-sync
capabilities required for the planned product.

Rejected:
OpenNutriTracker or any other second application foundation.

Consequences:
Migration begins only after the Stage 0 license, build, health-sync, architecture,
and test report is approved.

## 2026-07-15 — Split Stage 1 into Protocol Core and Health Sync

Decision:
Stage 1A delivers the complete manual Protocol Core loop. Stage 1B adds
HealthKit and Health Connect only after the Stage 1A gate passes.

Why:
Today and protocol management must remain functional without device permissions,
background sync, or imported data.

Rejected:
Building protocol and health-sync migrations simultaneously.

Consequences:
Stage 1B cannot be used to fill gaps in the Stage 1A domain or user flow.

## 2026-07-15 — SparkyFitness commercial-use permission obtained

Decision:
SparkyFitness's default LICENSE is non-commercial-use-only (permission required
from the copyright holder for any commercial product). The project owner
states that commercial-use permission has been obtained directly from the
copyright holder, superseding that default restriction for ÆTERNA.

Why:
ÆTERNA intends to eventually open the app to a paying/monetized audience, which
the default SparkyFitness license would otherwise block without the author's
written consent.

Evidence:
Per owner statement, 2026-07-15. The owner retains a copy of the written
permission in private project records (not committed to this repository).
This satisfies `docs/ROADMAP.md`'s Stage 0 exit-gate requirement that "written
commercial rights are sufficient for the intended distribution" — the written
record itself is held privately rather than in-repo.

Rejected:
Treating the default non-commercial LICENSE text as still blocking; seeking a
different application foundation due to licensing.

Consequences:
- Original SparkyFitness copyright notices must be preserved where required.
- This decision is not re-audited unless the upstream repository's license
  changes or new information surfaces.

## 2026-07-15 — ÆTERNA is an operating system, not a forked fitness app

Decision:
SparkyFitness is infrastructure only. The user must never experience ÆTERNA
as a fitness-tracking app with a longevity layer bolted on — every screen,
label, and flow must read as a purpose-built Longevity Operating System. The
user should forget a fitness app exists underneath.

Why:
Owner directive: "En önemli karar — Ben Sparky'yi fork edilmiş fitness app
olarak görmek istemiyorum. Ben onu ÆTERNA OS olarak görmek istiyorum. Yani
kullanıcı fitness uygulaması kullandığını unutacak." (The most important
decision — I don't want to see Sparky as a forked fitness app. I want to see
it as ÆTERNA OS. The user will forget they're using a fitness app.) This
reinforces, and takes precedence in spirit over, the existing
`open-source-adoption-strategy.md` boundary that Sparky's UI, fitness-first
navigation, and branding are never adopted.

Rejected:
Any framing of ÆTERNA internally or externally as "SparkyFitness with a
longevity skin," a fork, or a fitness app. Reusing Sparky terminology
(workouts-first navigation, gym/fitness copy, fitness-app visual tropes) even
where the underlying feature is reused.

Consequences:
- Every reused SparkyFitness service/domain must be re-presented through
  ÆTERNA's own vocabulary, navigation (Today/Protocol/Biomarkers/Track/
  Library), and visual system before it reaches a user-facing screen —
  infrastructure reuse never implies UI or copy reuse.
- Product and design review should explicitly check new screens against this
  standard: would a user describe this as "a longevity operating system," or
  would they describe it as "a fitness app that also does peptides"? The
  latter is a failed screen regardless of feature completeness.

## 2026-07-15 — Community is a topic-based Study Club, not a social feed

Decision:
If/when Community re-enters scope (it remains a non-goal for V1 per
`docs/ROADMAP.md`), its shape is a topic-based "Study Club," not a
Discord-style chat/social feed. Structure discussion around fixed topic
areas (e.g. Hair, Longevity, Recovery, Performance, Peptides, Nutrition)
rather than open-ended channels, DMs, or a chronological social feed.

Why:
Owner directive: "Community — Ben olsam Discord gibi değil. Study Club gibi.
Mesela Hair / Longevity / Recovery / Performance / Peptides / Nutrition." (If
it were me, not like Discord. Like a Study Club. For example: Hair,
Longevity, Recovery, Performance, Peptides, Nutrition.) This refines, and
does not override, the existing Community capability already described in
`docs/COMPETITIVE_PARITY_BLUEPRINT.md` capability #13 (case studies,
protocol/research discussions, no follower counts or vanity metrics) and the
Phase-1-Community note in the sibling `C:\Users\harun\AETERNA` checkout's
`AGENTS.md`, which this document's Community non-goal currently supersedes
for V1 scope purposes.

Rejected:
Real-time chat, DM-first design, follower/like-count-driven social mechanics,
or an undifferentiated single feed.

Consequences:
- When Community is scoped for implementation, it organizes around a fixed
  set of topic areas (curriculum-like, consistent with the study-club framing
  and with `aeternamethod.com`'s own "Pillar" structure — metabolic,
  cognitive, recovery, tissue/joint, sleep, hormonal — which may be a natural
  starting topic taxonomy to reconcile against the Hair/Longevity/Recovery/
  Performance/Peptides/Nutrition list above).
- This is a scope refinement for a future stage, not a V1 authorization;
  `docs/ROADMAP.md`'s non-goals for Community remain in force until an
  explicit stage-entry decision is recorded.

## 2026-07-15 — Sequential Codex and Claude Code workflow

Decision:
Codex and Claude Code work sequentially in the same Git repository and exchange
state through canonical documents, focused commits, and `docs/HANDOFF.md`.

Why:
Chat sessions and token windows are temporary. The repository must remain the
single durable source of truth.

Rejected:
Simultaneous editing, separate application copies, or relying on pasted chat
history as the handoff mechanism.

Consequences:
Each agent inspects the working tree before editing and updates the handoff before
yielding. Ambiguous dirty changes block continuation until reconciled.
