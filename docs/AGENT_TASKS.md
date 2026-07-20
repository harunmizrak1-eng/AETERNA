# AETERNA active agent tasks

Only read the task assigned to your agent. Codex updates this file.

## HY3 — Faz B Study Club server closure

```text
AGENT: HY3
TASK ID: FAZ-B-COMMUNITY-SERVER
BASE SHA: 882ddca1
WORKTREE: C:\Users\harun\Documents\New project\AETERNA\aeterna-os-hy3-integration
BRANCH: agent/hy3-faz-b-community-server

OBJECTIVE
Complete the minimum server-side Study Club interaction contract: replies,
bounded pagination, search, honest identity/capabilities, validation,
moderation safety, and focused tests. This is code completeness, not live
Discourse production readiness.

START CONDITION
Run git status --short --branch. The worktree must be clean. Fast-forward or
recreate the task branch from exact SHA 882ddca1 without reset/discard. If the
tree is dirty, stop and classify ownership. Do not merge/cherry-pick old Faz B
commits; they are already in the base.

READ FIRST
1. C:\Users\harun\Documents\New project\AETERNA\AGENTS.md
2. C:\Users\harun\Documents\New project\AETERNA\docs\PRODUCT_SPECIFICATION_V1.md
3. C:\Users\harun\Documents\New project\AETERNA\docs\ACTIVE_CONTEXT.md
4. This assigned section only
Then inspect only communityRoutes, discourseClient, their tests, authentication
middleware, and the project's existing rate-limit pattern.

ALLOWED FILES
- SparkyFitnessServer/routes/v2/communityRoutes.ts
- SparkyFitnessServer/services/discourseClient.ts
- Their focused server tests
- Existing server rate-limit wiring only if required

FORBIDDEN FILES
- All mobile, shared, donor, Protocol, Labs, Library, Body Atlas, export,
  database/migration, native, and canonical documentation files

FIXED API CONTRACT
1. POST /api/v2/community/topics/:topicId/replies body { body: string }.
2. GET /api/v2/community/topics supports category, page and pageSize.
3. GET /api/v2/community/search supports q, page and pageSize.
4. GET /api/v2/community/capabilities returns identityMode:
   'shared_service' | 'per_user' and booleans for reply, pagination, search,
   followedTopics, unreadReplies and mentions.
5. Paginated responses return items plus page, pageSize, hasMore and optional
   nextPage. Keep existing topic fields compatible.
6. Preview mode uses the same response shapes and includes mode: 'preview'.
   Configured Discourse uses mode: 'live'.
7. Optional followed/unread/mention values exist only when authoritative
   upstream data supports them; never invent zero.

SCOPE
1. Implement Discourse POST /posts.json reply using numeric topic_id.
2. Reject empty/whitespace replies and bound body length.
3. Add bounded topic pagination; never scan every category/page indefinitely.
4. Add bounded topic search and normalize Discourse results.
5. Expose honest identity/capabilities. Current live writes are shared_service
   until real per-user identity exists.
6. Validate category allowlist, title/body/reply/report lengths, report reason,
   and numeric topic/post ids.
7. Ensure upstream HTML, API keys, headers, credential-bearing URLs, stack
   traces, and raw upstream bodies never reach mobile.
8. Apply the existing rate-limit pattern to write/search routes when suitable.
9. Preserve preview contract parity. Never silently fall back to preview after
   a configured live upstream failure.
10. Add focused route/client/security/error-normalization tests.

ACCEPTANCE
- Authenticated reply works in live and preview contracts.
- Invalid ids and empty/oversized content fail before upstream calls.
- Search/pagination are bounded and expose honest end state.
- Configured upstream failures return sanitized 502/429-style responses.
- shared_service identity is explicit; no fake per-user identity.
- Tests cover live mapping, preview parity, validation, rate-limit seam, HTML
  upstream failure, and secret redaction.

NON-GOALS
- No mobile UI, SSO implementation, push notifications, deployment, secrets,
  new database tables, Labs, Protocol, nutrition, AI, or Body Atlas

VERIFICATION
Server incremental typecheck, touched-file ESLint --max-warnings 0, focused
Vitest --no-file-parallelism. Live Discourse must be reported separately and
must not be claimed tested without a real instance.

COMMITS
1. feat(server): complete Study Club interaction API
2. test(server): verify Study Club validation and upstream safety

FINAL REPORT
Use docs/AGENT_TASK_TEMPLATE.md exactly. Do not push or update docs.
```

## DeepSeek V4 Flash — Faz B Study Club mobile closure

```text
AGENT: DeepSeek V4 Flash
TASK ID: FAZ-B-COMMUNITY-MOBILE
BASE SHA: 882ddca1
WORKTREE: C:\Users\harun\Documents\New project\AETERNA\aeterna-os-deepseek-community
BRANCH: agent/deepseek-faz-b-community-mobile

OBJECTIVE
Complete the minimum mobile Study Club interaction layer against HY3's fixed
API contract: reply composer, stable pagination, debounced search, honest
preview/identity states, and focused tests.

START CONDITION
Create a fresh worktree from exact SHA 882ddca1. Do not use or modify another
agent's worktree. Do not merge HY3. Both agents implement opposite sides of the
fixed contract; Codex integrates server first and mobile second.

READ FIRST
1. C:\Users\harun\Documents\New project\AETERNA\AGENTS.md
2. C:\Users\harun\Documents\New project\AETERNA\docs\PRODUCT_SPECIFICATION_V1.md
3. C:\Users\harun\Documents\New project\AETERNA\docs\ACTIVE_CONTEXT.md
4. This assigned section only
Then inspect only Community screens, communityApi, Community query hooks and
focused tests.

ALLOWED FILES
- Existing Community mobile screens
- SparkyFitnessMobile/src/services/api/communityApi.ts
- New Community hooks/types/utilities and focused tests

FORBIDDEN FILES
- All server/shared files
- LibraryScreen, LibraryShellScreen, App.tsx, TabsLayout, navigation types
- Protocol, Today, Track, Compound Detail, donor, Labs, Body Atlas, native,
  dependencies, and canonical docs

FIXED API CONTRACT
Use the endpoint and response contract stated in HY3's task above. Define the
matching mobile types locally without editing shared files.

SCOPE
1. Add typed calls for replies, pagination, search and capabilities.
2. Add reply composer to topic detail. Reject empty locally, show remaining
   length, preserve draft on failure, clear only on confirmed success, and
   refresh detail after success.
3. Topic list: initial loading, pull refresh, load more, end reached, retry
   while preserving loaded items, and stable-id deduplication.
4. Add debounced search. Distinguish initial empty, no matches,
   unavailable/upstream failure, and retry. Stale responses must not replace a
   newer query.
5. Fetch capabilities. When identityMode is shared_service, never present a
   personal Discourse profile or imply the write uses the user's identity.
6. Show an explicit Preview label when mode is preview. Never call preview data
   live or persistent.
7. Render followed/unread/mention state only when capability and authoritative
   values exist. Never display invented zeros.
8. Add accessibility labels, keyboard behavior, and focused state tests.

ACCEPTANCE
- Failed reply preserves the exact draft and offers retry.
- Successful reply refreshes detail once and clears the draft.
- Load-more failure preserves existing topics.
- Search is debounced and race-safe.
- Preview and shared-service identity are unmistakable.
- No fabricated profile, notification count, persistence, or live state.

NON-GOALS
- No server, SSO, push notifications, Library redesign, navigation changes,
  profile system, Labs, Protocol, nutrition, AI, Body Atlas, or infrastructure

VERIFICATION
Mobile focused Jest --runInBand, incremental typecheck, touched-file ESLint
--max-warnings 0, plus existing Community regressions.

COMMITS
1. feat(mobile): complete Study Club interaction experience
2. test(mobile): cover Study Club pagination search and replies

FINAL REPORT
Use docs/AGENT_TASK_TEMPLATE.md exactly. Do not push or update docs.
```

## DeepSeek V4 Flash #2 — Peptide golden path closure

```text
AGENT: DeepSeek V4 Flash (second independent session)
TASK ID: PEPTIDE-GOLDEN-PATH-CLOSURE
BASE SHA: 821597a4
WORKTREE: C:\Users\harun\Documents\New project\AETERNA\aeterna-os-deepseek-golden-path
BRANCH: agent/deepseek-golden-path-closure

OBJECTIVE
Finish and prove the real peptide workflow end to end. This is not a new
dashboard and not a visual redesign. Close the remaining data/action gaps in:
Compound -> Protocol -> schedule/dose -> reminder -> Today -> taken/skipped or
injection -> vial/inventory -> linked symptom -> Weekly Review.

CURRENT VERIFIED BASE
- Compound Detail can prefill a canonical protocol draft.
- ProtocolItem has compound_id and optional legacy_medication_id.
- Representable daily, alternate-day and named-weekday schedules bridge into
  the existing medication/schedule engine.
- Draft-linked medications stay inactive until version activation; superseded
  version medications are deactivated.
- Today deduplicates linked canonical and compatibility schedule rows.
- Track can link a symptom to a real scheduled intervention.
- Known defect: ProtocolBuilder performs several client writes sequentially;
  failure can leave an incomplete protocol or inactive orphan medication.
- Remaining UX gap: injection -> selected vial -> inventory deduction -> review
  relationship is not sufficiently visible or proven end to end.

READ FIRST
1. AGENTS.md and package AGENTS.md files
2. docs/PRODUCT_SPECIFICATION_V1.md
3. docs/ACTIVE_CONTEXT.md
4. docs/DATA_MODEL.md and docs/DECISIONS.md
5. This task only
Then inspect the actual Protocol, medication/injection, inventory, symptom and
Weekly Review server/mobile implementations before editing.

ALLOWED SCOPE
- Protocol Builder/detail and protocol APIs/repository/routes/tests
- Medication schedule, dose/injection and pen/vial APIs/repository/tests
- Today schedule/action derivation and focused components/tests
- InjectionLogScreen, inventory surfaces/hooks and focused tests
- WeeklyReview data derivation/screen and focused tests
- Track relationship rendering required for the golden path
- A narrowly required migration/shared contract only when existing schema
  cannot represent the relationship; explain before adding it

FORBIDDEN
- Community/Discourse files owned by HY3/DeepSeek #1
- Labs/Biomarkers work owned by GLM
- Nutrition/training/Body Atlas work owned by OpenRouter
- Library redesign, AEON, clinic, health sync, native/Expo/Gradle
- Fake medical claims, recommendations, doses, scores or sample patient data
- Canonical docs and canonical branch

REQUIRED WORK
1. Replace or safely compensate the multi-request ProtocolBuilder creation flow
   so failures cannot leave an apparently valid partial protocol or orphan
   compatibility medication. Prefer a server transaction/orchestration endpoint
   when consistent with existing patterns; do not hide partial failure.
2. Preserve immutable version behavior and dose idempotency.
3. Make an actionable scheduled injectable open Injection Log with the relevant
   medication/schedule preselected when unambiguous.
4. Require an explicit real vial/pen selection before inventory deduction.
5. After injection success, invalidate/refetch Today, Track, inventory and
   Weekly Review caches so the same event is visible consistently.
6. Show planned versus actual dose/action, selected vial and remaining inventory
   without claiming clinical interpretation.
7. Ensure taken/skipped/injection cannot render as duplicate actions.
8. Ensure linked symptoms and injections appear in Weekly Review with source and
   timestamps; do not claim causality.
9. Add focused server/mobile tests including rollback/compensation, double tap,
   preselection, inventory deduction, cache refresh and review projection.
10. Produce a manual-device checklist; do not claim device verification.

ACCEPTANCE
- A user can complete the entire chain with real persisted records.
- No partial protocol is presented as successfully created after a failed step.
- A single scheduled occurrence is represented once.
- Injection is tied to the exact medication and selected inventory unit.
- Inventory changes once, not twice, and is visible after success.
- Weekly Review shows action + linked observation honestly.
- Server/mobile typecheck, touched lint zero warnings, focused/regression tests.

COMMITS
Use small independently reviewable commits, ideally:
1. fix(protocol): make protocol creation transactional
2. feat(mobile): connect scheduled injections to vial inventory
3. feat(review): project protocol actions and observations into weekly review
4. test(protocol): verify peptide golden path end to end

Do not push, merge, or update canonical docs. Return exact hashes and a truthful
report using docs/AGENT_TASK_TEMPLATE.md.
```

## GLM-5.2 — Labs and Response Intelligence

```text
AGENT: GLM-5.2
TASK ID: LABS-RESPONSE-INTELLIGENCE
BASE SHA: 821597a4
WORKTREE: C:\Users\harun\Documents\New project\AETERNA\aeterna-os-glm-labs-server
BRANCH: agent/glm-labs-response-server

OBJECTIVE
Build the next major AETERNA product system: source-aware Labs and Response
Intelligence, reusing existing BiomarkerResult/DataConflict foundations. Deliver
a coherent end-to-end implementation in incremental commits, not placeholder
cards. The branch may be built in parallel but will only be merged after the
peptide golden-path gate passes.

PRODUCT BOUNDARY
Manual lab result; CSV/PDF lab import; review/confirmation before canonical
write; reference-range provenance; Biomarker detail; longitudinal chart;
protocol annotations; Response Timeline; retest; SafetyEvent relationship; and
a user/practitioner-authored Recommendation/Action Plan draft. No AI diagnosis,
automatic dose change, opaque score, fabricated range or causal claim.

READ COMPLETELY
- AGENTS.md and package AGENTS.md files
- docs/PRODUCT_SPECIFICATION_V1.md
- docs/ACTIVE_CONTEXT.md
- docs/DATA_MODEL.md
- docs/DECISIONS.md
- docs/ROADMAP.md
- existing BiomarkersScreen, BiomarkerResult/DataConflict migrations, schemas,
  routes, repositories, hooks, tests and health-source provenance utilities

OWNERSHIP
You own Labs/Biomarkers server, shared and mobile files plus focused tests.
Do not edit Community, Protocol/medication golden path, workout/nutrition,
Body Atlas, native/Expo/Gradle, donor seeds, canonical docs or other worktrees.

EXECUTION SLICES
L1. Audit and contract stabilization
- Verify current physical schema and API; reuse instead of duplicating.
- Close shared Zod/type drift for lab entities actually used.
- Define honest states: draft import, needs review, confirmed, corrected,
  conflicting, stale, source unavailable.

L2. Manual result and confirmation
- Real analyte/result/unit/date/source capture.
- Reference low/high/unit plus provenance and applicability metadata.
- Draft -> confirm flow; correction creates revision/history, not silent rewrite.
- Never convert missing to zero or invent a reference range.

L3. CSV and PDF import
- Import creates a staging batch and candidate rows; never writes confirmed
  clinical results directly.
- CSV supports mapping, row errors, duplicates and review.
- PDF extraction must use existing infrastructure where possible. If a minimal
  server dependency is necessary, document license and lockfile change. Never
  add a native mobile dependency. Low-confidence/unparsed fields require review.
- Preserve original document provenance without logging secret/health contents.

L4. Biomarker detail and longitudinal record
- Detail screen with chronological values, units, source, freshness and range
  provenance.
- Chart must distinguish missing, conflict and out-of-range observation without
  diagnosing it.
- Handle unit incompatibility explicitly; do not draw a false continuous trend.

L5. Response Timeline and protocol annotations
- Timeline joins confirmed observations, protocol version/action changes,
  symptoms and SafetyEvents by time/source, not asserted causality.
- Retest request/date/status and next review are real records or clearly scoped
  existing fields, never static copy.

L6. Recommendation/Action Plan draft
- User/practitioner-authored draft with provenance, status and explicit review.
- No autonomous clinical recommendation or protocol mutation.

QUALITY GATES
- Authorization/RLS ownership for every new server path.
- Bounded upload size/type, filename safety, malformed CSV/PDF and HTML error
  sanitization.
- Export/deletion coverage for new persisted entities.
- Server/shared/mobile typecheck; touched lint zero warnings; focused tests and
  regressions after each slice.
- No live-device or clinical validation claims without evidence.

COMMITS
One commit per L1-L6 slice, plus tests when useful. Do not create one giant
commit. Do not push/merge/update docs. Return exact hashes, migrations, test
counts, dependency changes, known gaps and manual verification requirements.
```

## OpenRouter — Training Core / Hevy-style builder

```text
AGENT: OpenRouter coding agent (recommended model: DeepSeek V4 Pro, high or
xhigh reasoning)
TASK ID: TRAINING-CORE-PREP
BASE SHA: 821597a4
WORKTREE: C:\Users\harun\Documents\New project\AETERNA\aeterna-os-openrouter-labs-mobile
BRANCH: agent/openrouter-labs-response-mobile

NOTE
The worktree/branch name was prepared before final allocation and says labs;
the task is Training Core. Do not rename it mid-run. Treat this task text as the
authority. This branch will be integrated only after Golden Path and Labs.

OBJECTIVE
Turn the preserved Sparky workout domain into a modern, fast, Hevy-style
Training Core without rebuilding working backend foundations and without
adding a new primary tab. Deliver route-ready workout creation/logging surfaces
and tests; Codex will perform final Today/Track navigation integration later.

READ FIRST
- AGENTS.md and SparkyFitnessMobile/AGENTS.md
- docs/PRODUCT_SPECIFICATION_V1.md and docs/ACTIVE_CONTEXT.md
- existing workout/exercise/preset/active-workout screens, hooks, stores,
  services, tests and Body Atlas muscle definitions

OWNERSHIP
Workout/exercise/preset/active-workout mobile files and focused tests only.
Narrow existing server workout fixes are allowed only when a verified API bug
blocks the mobile flow. Do not edit Today, Diary/Track, Protocol, Biomarkers,
Community, Compound Library, canonical Body Atlas compound-effect files,
navigation/App shell, native/Expo/Gradle or canonical docs.

REQUIRED PRODUCT
1. Routine builder: name, folders, exercise search, muscle/equipment filters,
   custom exercise, reorder and notes.
2. Exercise prescription: working sets, warm-up sets, reps, weight, RPE/RIR,
   rest timer, supersets and drop-set representation using current schema where
   possible. Unsupported semantics must be explicit, not silently flattened.
3. Active workout: fast set logging, previous performance, timers, edit/undo,
   offline-safe local state and honest sync state.
4. History: completed workout summary, per-exercise progression, personal best
   based only on real data, and weekly volume by muscle where mapping exists.
5. Muscle map: primary/secondary muscles from real exercise metadata; no fake
   anatomy/compound claim. Provide an accessible list alternative.
6. Template save/copy/edit and safe recovery from interrupted workouts.
7. Performance: avoid giant rerendering lists, preserve smooth scrolling and
   current active-workout state architecture.
8. Add focused tests for draft persistence, set operations, supersets, timer,
   history math, empty/offline/error states and accessibility.

NON-GOALS
- No nutrition, Today/Track shell integration, new tab, social sharing,
  Community, Labs, AEON, clinic, compound effects, native dependency or backend
  rewrite.
- No invented exercise data or unlicensed asset copying.

ACCEPTANCE
- A real routine can be created, edited, started, completed and reopened.
- Existing Sparky workout records remain compatible.
- No data loss on interrupted session in supported local persistence flow.
- Mobile typecheck, touched lint zero warnings and focused/regression tests.

Use several small commits. Do not push/merge/update docs. Final report must list
exact hashes, reused assets, schema limitations, test counts and deferred shell
integration.
```
