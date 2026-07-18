# AETERNA active agent tasks

Only read the task assigned to your agent. Codex updates this file.

## HY3 — FAZ-C1 evidence relationship backend

```text
AGENT: HY3
TASK ID: FAZ-C1-EVIDENCE-RELATIONSHIPS
BASE SHA: 5b152eea or a later Codex-confirmed integration HEAD
WORKTREE: C:\Users\harun\Documents\New project\AETERNA\aeterna-os-hy3-integration
BRANCH: agent/hy3-faz-c-evidence

OBJECTIVE
Build the smallest source-linked compound relationship backend that can replace
Body Atlas's mechanism-summary keyword heuristic. Do not add content seeds or
mobile UI.

START CONDITION
Run git status --short --branch. The worktree must be clean. It may be stale.
Fast-forward it to overnight/aeterna-product-integration only if clean and the
update is a true fast-forward. Do not reset or discard files. Do not edit until
HEAD is 5b152eea or later.

READ FIRST
1. C:\Users\harun\Documents\New project\AETERNA\AGENTS.md
2. C:\Users\harun\Documents\New project\AETERNA\docs\PRODUCT_SPECIFICATION_V1.md
3. C:\Users\harun\Documents\New project\AETERNA\docs\ACTIVE_CONTEXT.md
4. This task only
Then inspect only existing compound migration/repository/routes, shared compound
schema, RLS patterns, and Body Atlas response needs.

ALLOWED FILES
- New uniquely timestamped server migration
- New server repository/service/route and focused tests
- Server route mount if required
- New shared evidence/relationship schemas and exports
- RLS policy/matrix files required by the new tables

FORBIDDEN FILES
- All mobile screen/component/navigation files
- CompoundDetailScreen.tsx and compoundResearch.ts
- 20260718150000_seed_licensed_pepty_catalog.sql
- Donor seeds and references directory
- Community/Discourse files and account export
- Canonical docs

AUTHORIZED MINIMAL MODEL
1. evidence_references: stable id, source type, URL, optional PMID/DOI/title,
   study type/publication year, review status, ownership, timestamps.
2. compound_relationships: compound_id, target_kind, target_key, direction,
   evidence_reference_id, review status, timestamps.
3. target_kind: body_system, biomarker, or muscle_group.
4. direction: affects, may_increase, may_decrease, monitor, or unknown.
5. Every relationship references an evidence row; no unsourced relationships.
6. review status: draft, unverified, reviewed, superseded, or withdrawn.
7. Body-system/muscle keys are controlled strings in shared code. Do not create
   full BodySystem or Biomarker master tables in this slice.

SCOPE
1. Add idempotent migration, indexes, foreign keys, timestamps, RLS, grants,
   and RLS-matrix classification using existing patterns.
2. Add typed repository/service access.
3. Add authenticated read endpoint:
   GET /api/v2/compounds/:compoundId/relationships
4. Response includes relationships with evidence and review status. Missing
   rows return an honest empty array, not inferred data.
5. No public write endpoints. Codex owns later editorial/donor ingestion.
6. Add shared request/response schemas and enforce them at the boundary.
7. Add focused repository/route/schema/RLS tests.

ACCEPTANCE
- Unknown compound follows the existing not-found contract.
- Known compound without rows returns an empty relationships array.
- Every relationship includes evidence and review status.
- Access follows existing reference/owner RLS conventions.
- No keyword inference, generated relationship, or donor content is added.
- Migration reapplication is safe.

NON-GOALS
- No relationship seed data, AI extraction, or mobile work
- No physical Biomarker/BodySystem master tables
- No protocol recommendation, score, Discourse, export, nutrition, workout,
  Android, Gradle, or Expo work

VERIFICATION
Shared: typecheck and focused schema tests.
Server: incremental typecheck, touched-file ESLint, focused Vitest suites, and
RLS matrix tests if a database is reachable. Report live DB tests separately.

COMMITS
1. feat(server): add evidence-linked compound relationship schema
2. feat(server): expose compound relationship read API
3. test(server): verify relationship contracts and access controls

FINAL REPORT
Use docs/AGENT_TASK_TEMPLATE.md exactly. Do not push or update docs.
```

## DeepSeek V4 Flash — FAZ-C2 Body Atlas mobile integration

```text
AGENT: DeepSeek V4 Flash
TASK ID: FAZ-C2-BODY-ATLAS-MOBILE
BASE SHA: <HY3_COMMIT_AFTER_CODEX_INTEGRATION>
WORKTREE: C:\Users\harun\Documents\New project\AETERNA\aeterna-os-deepseek-atlas
BRANCH: agent/deepseek-faz-c-atlas

OBJECTIVE
Connect the existing 2D Body Atlas compound-effects mode to HY3's accepted
evidence relationship endpoint and stop using mechanism-summary keyword
matching as the primary source.

START CONDITION
Do not implement until Codex replaces the BASE SHA placeholder with the
integration commit containing FAZ-C1. Create a fresh worktree from that exact
SHA. If the placeholder remains, report BLOCKED and do not edit.

READ FIRST
1. C:\Users\harun\Documents\New project\AETERNA\AGENTS.md
2. C:\Users\harun\Documents\New project\AETERNA\docs\PRODUCT_SPECIFICATION_V1.md
3. C:\Users\harun\Documents\New project\AETERNA\docs\ACTIVE_CONTEXT.md
4. This task only
Then inspect only BodyAtlasScreen, BodyOutline, compound API/hook patterns, the
accepted shared relationship schema, and relevant tests.

ALLOWED FILES
- SparkyFitnessMobile/src/screens/atlas/BodyAtlasScreen.tsx
- Established compound API module additions
- New focused hook, types, utilities, and tests
- Body Atlas mapping utility only if required for controlled target keys

FORBIDDEN FILES
- Server migrations/routes/repositories and shared schemas
- CompoundDetailScreen.tsx and Library/navigation/App/Tabs files
- Donor seed/references/compoundResearch.ts
- Community, protocol, and reminder files
- Canonical docs, Android, Gradle, Expo native configuration, dependencies

SCOPE
1. Add typed API call and React Query hook for
   GET /api/v2/compounds/:compoundId/relationships.
2. Selecting a compound loads relationships without losing search/selection.
3. Map body_system and muscle_group keys to existing BodyOutline regions.
   Biomarker relationships render as a monitoring list and do not color an
   unrelated body region.
4. Show direction, review status, evidence title/source, and safe external link.
5. Distinguish loading, no recorded relationships, unavailable, retry, stale,
   and partial/unverified coverage.
6. Remove mechanism-summary inference as primary behavior. Any compatibility
   fallback is development-only and never presented as sourced evidence.
7. Preserve the 30-day injection-site heatmap unchanged.
8. Add accessibility labels and focused state/mapping tests.

ACCEPTANCE
- Only returned body relationships highlight regions.
- Biomarker-only results do not highlight arbitrary anatomy.
- Empty means no relationships recorded, not no effect.
- API failure preserves selection and offers Retry.
- Unverified and reviewed relationships are visibly distinct.
- No score, causal certainty, or recommendation appears.
- Injection-site behavior remains unchanged.

NON-GOALS
- No 3D model, new navigation, Compound Detail deep link, content seed, AI
  relationship generation, broad redesign, backend, or infrastructure work

VERIFICATION
Mobile: focused Jest with --runInBand, incremental typecheck, touched-file
ESLint with --max-warnings 0, plus existing Body Atlas regressions.

COMMITS
1. feat(mobile): add compound relationship client and hook
2. feat(mobile): render sourced relationships in Body Atlas
3. test(mobile): cover Body Atlas relationship states

FINAL REPORT
Use docs/AGENT_TASK_TEMPLATE.md exactly. Do not push or update docs.
```
