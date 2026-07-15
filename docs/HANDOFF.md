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
  name). Committed as `61f2601`.
- Re-challenged all three REJECT donor decisions (Fasten Health, openScale's
  Bluetooth-scale piece, Gadgetbridge) against six questions (most valuable
  idea, independent-reimplementability, UI, database model, algorithm,
  keep-or-flip). Fasten Health stays REJECT (the one reusable pattern —
  sync-job/event lifecycle — is too generic to credit to Fasten). openScale's
  Bluetooth piece moves to a deferred, pattern-only ADAPT (abstract
  per-vendor driver interface only, still no protocol code, still not
  in current scope). Gadgetbridge stays REJECT for code/protocol but gains a
  named ADAPT for two pure UI concepts (coverage/gap timeline, device/
  permission-status list). Folded into `docs/MODULE_ADOPTION_REPORT.md`
  (per-project notes, summary table, and recommendations updated).
- Recorded two product-positioning decisions in `docs/DECISIONS.md`: ÆTERNA
  must read as an operating system, never a forked fitness app (user should
  forget SparkyFitness is underneath); Community, if/when it re-enters
  scope, is a topic-based "Study Club" (Hair/Longevity/Recovery/Performance/
  Peptides/Nutrition), not a Discord-style social feed.
- Produced `docs/COMPETITIVE_UX_REPORT.md`: UX/onboarding/navigation/
  premium-feel benchmarking of OneTwenty, Marek Health, Ways2Well,
  Ultrahuman, HeadsUp Health, and ÆTERNA's own `aeternamethod.com`.
- Produced `docs/SPARKYFITNESS_FEATURE_COVERAGE.md`: feature-by-feature
  reuse/refactor/build-new audit of ÆTERNA's full product-feature list
  against the real SparkyFitness codebase. Headline finding: SparkyFitness's
  medication/GLP-1 domain (`injection_entries`, `medication_pens`,
  `medication_schedules`) is a strong Refactor candidate for ÆTERNA's Dose
  Logging, Vial/Inventory, and Supplements — not the Build New work
  originally assumed. Protocol, the Peptide/Compound engine, Biomarkers, and
  Today remain genuine Build New.

## Known working-tree state

Working tree has four changed files, all documentation, no application
code: `docs/DECISIONS.md` (modified, two new decision entries),
`docs/MODULE_ADOPTION_REPORT.md` (modified, REJECT-challenge notes folded
in), `docs/COMPETITIVE_UX_REPORT.md` (new, untracked),
`docs/SPARKYFITNESS_FEATURE_COVERAGE.md` (new, untracked). None of these are
committed yet.

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
- Competitive UX research (OneTwenty, Ways2Well, Ultrahuman, HeadsUp Health)
  used live browsing where accessible and WebFetch/WebSearch/third-party
  reviews as fallback; each is noted per-site. Marek Health blocks non-US
  server IPs — its findings are reconstructed from secondary sources and
  explicitly flagged lower-confidence. No site copy was reproduced verbatim
  beyond short attributed quotes.
- The SparkyFitness feature-coverage audit was performed against the local
  reference clone using its own navigation docs (`agent-docs/file-and-domain-
  reference.md`, `docs/content/8.developer/4.database.md`) rather than a
  blind full-repo search; findings cite specific tables/files. No code was
  copied, no dependency was added, no application UI was changed.

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

Four documentation files are ready for owner review but not yet committed
(see Known working-tree state): the updated module-adoption report, the two
new positioning decisions, the competitive UX report, and the SparkyFitness
feature-coverage report.

Remaining Sprint 0 / Stage 0 deliverables are still open regardless: iOS and
Android build/run evidence, HealthKit/Health Connect technical validation,
and the coupling/migration-risk report have not been produced. Do not begin
migration or any implementation work. Owner should review the new reports,
then explicitly approve which remaining Stage 0 deliverable — or which
Today/Biomarkers screen design informed by the UX report — to tackle next.
