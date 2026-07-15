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

## Known working-tree state

The rejected dashboard UI changes (`app/(tabs)/index.tsx`, `app/_layout.tsx`,
`app/stack/log/`, `src/components/`) have been moved to branch
`rejected-dashboard-wip` at commit `990a4d1` and are no longer present in this
branch's working tree. The remaining working-tree changes on this branch are
the documentation refactor (`AGENTS.md`, `CLAUDE.md`, `docs/`).

## Verification

- Documentation paths and required headings were checked.
- No application build, typecheck, lint, or test was run for the documentation
  and planning tasks.
- Claude Code `2.1.210` is installed globally. Interactive authentication is
  still pending and must be completed by the owner in a new terminal.

## Open risks

- SparkyFitness commercial rights have not been evidenced in the repository.
- iOS native build requires a supported macOS/Xcode environment or an explicitly
  approved remote build path.
- The current app is still an Expo/SQLite prototype, not the validated Sparky
  foundation.
- Existing local domain types conflate StackItem, protocol schedule, vial, and
  dose concepts and must not become the target model.

## Next task

Begin Sprint 0 foundation validation only; do not begin migration. This
requires explicit owner approval before any implementation work starts.
