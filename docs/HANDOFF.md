# ÆTERNA handoff

## State

- Status: `AWAITING_APPROVAL`
- Active stage: Stage 0 planning; execution has not started
- Active branch: `claude/add-to-stack-workflow-pedznt`
- Last agent: Claude Code
- Updated: 2026-07-15, Europe/Istanbul

## Approved task

No implementation task is currently approved. The latest completed work was a
documentation refactor, a targeted project assessment, and archiving the
rejected dashboard attempt off the main branch.

## Current decisions

- SparkyFitness is the only application foundation.
- Stage 1 is split into Stage 1A Protocol Core and Stage 1B Health Sync.
- Stage 1B cannot start before the Stage 1A gate passes.
- The existing Sparky dashboard and rejected ÆTERNA dashboard are not reused.
- Nutrition, community, advanced AI, clinical portal, CGM, genetics, imaging,
  and cohort analytics remain outside V1.

## Completed

- Added the canonical competitive parity blueprint.
- Added roadmap stage gates and explicit non-goals.
- Added the canonical domain model and status vocabulary.
- Reduced `AGENTS.md` to permanent project and scope-control rules.
- Performed a targeted inspection of the current Expo/SQLite prototype.
- Preserved the rejected dashboard attempt on branch `rejected-dashboard-wip`
  (commit `990a4d1`); the main branch working tree no longer carries those
  changes.
- Made the SparkyFitness/docs refactor official on the main branch (commit
  `aef28e7`): `AGENTS.md`, `CLAUDE.md`, and `docs/` are now committed.
- Resolved the SparkyFitness commercial-license open risk; recorded in
  `docs/DECISIONS.md` and `AGENTS.md`.
- Completed the Sprint 0 module-adoption audit: SparkyFitness foundation
  audit plus donor audits of Medplum, Fasten Health, openScale, and
  Gadgetbridge. Full findings, licenses, reusable concepts, files worth
  studying, duplication risk, and adopt/adapt/reject decisions are in
  `docs/MODULE_ADOPTION_REPORT.md`. Summary: SparkyFitness adopt (confirmed);
  Medplum adapt (AuditEvent/Provenance/Consent vocabulary only, no code);
  openScale adapt (body-composition formulas only, reimplemented from source
  papers, not code) and reject its Bluetooth-scale integration; Fasten
  Health reject (its real conflict-resolution logic is closed-source, not in
  the public repo); Gadgetbridge reject (AGPL-3.0, DMCA history, no iOS
  path, and ÆTERNA's roadmap already excludes this integration model by
  name).

## Known working-tree state

Working tree has four changed files, all documentation, no application code:
`AGENTS.md` (modified), `docs/DECISIONS.md` (modified), `docs/HANDOFF.md`
(modified, this file), `docs/MODULE_ADOPTION_REPORT.md` (new, untracked).
None of these are committed yet.

## Verification

- Documentation paths and required headings were checked.
- No application build, typecheck, lint, or test was run for the documentation
  and planning tasks.
- Claude Code `2.1.210` is installed globally. Interactive authentication is
  still pending and must be completed by the owner in a new terminal.
- Module-adoption research (Medplum, Fasten Health, openScale, Gadgetbridge)
  was performed via public repository/license/documentation research, not a
  local clone (none exist in the references directory); each finding cites
  its source. SparkyFitness was audited directly from the local reference
  clone. No code was copied, no dependency was added, no application UI was
  changed.

## Open risks

- ~~SparkyFitness commercial rights have not been evidenced in the repository.~~
  Resolved 2026-07-15: owner states commercial-use permission was obtained
  directly from the copyright holder; written evidence is retained privately.
  See `docs/DECISIONS.md`.
- iOS native build requires a supported macOS/Xcode environment or an explicitly
  approved remote build path.
- The current app is still an Expo/SQLite prototype, not the validated Sparky
  foundation.
- Existing local domain types conflate StackItem, protocol schedule, vial, and
  dose concepts and must not become the target model.

## Next task

The module-adoption audit is complete (`docs/MODULE_ADOPTION_REPORT.md`).
Remaining Sprint 0 / Stage 0 deliverables are still open: SparkyFitness
license evidence is resolved, but iOS and Android build/run evidence,
HealthKit/Health Connect technical validation, and the coupling/
migration-risk report have not been produced. Do not begin migration or
any implementation work. Owner should review this audit and the resolved
license decision, then explicitly approve which remaining Stage 0
deliverable to tackle next.
