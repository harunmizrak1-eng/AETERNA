# AETERNA active context

Last verified: 2026-07-24, Europe/Istanbul

This is the compact operational source for new AI sessions. It records current
state only, not project history. Claude owns this file as of 2026-07-24 (see
"Active ownership" below and `docs/CONTINUATION_BRIEF.md` for the full story).

**Read `docs/CONTINUATION_BRIEF.md` first if you are a new session.** It
explains the 2026-07-24 consolidation (multi-agent worktrees merged and
retired, cloud-session branch merged in, `.env` location, open items) that
this file's "Active ownership" section below only summarizes.

## Product in one paragraph

AETERNA is a peptide-first longevity operating system built on the canonical
SparkyFitness monorepo. Its loop is Protocol -> Action -> Observation -> Review
-> Informed adjustment. It combines peptide knowledge, protocols, dose and vial
tracking, biomarkers, a logbook, Body Atlas, Study Club, and later AEON,
nutrition, and training. It never uses a generalized health/readiness/longevity
score.

## Settled product decisions

- Primary navigation: Today, Protocol, Biomarkers, Track, Library.
- Track remains a real logbook; global quick log only complements it.
- Biomarkers remains the visible tab label.
- Profile and Settings stay outside primary tabs.
- Today is agenda-first, not a metric carpet.
- Library is the knowledge destination. Study Club and Body Atlas live in its
  ecosystem without adding primary tabs.
- Operational surfaces favor Apple Health clarity; editorial character is
  concentrated in Library, monographs, rationale, and review.
- No opaque health, readiness, recovery, or longevity score.
- Existing Sparky auth, API, nutrition, training, medication, notification,
  reporting, and health-sync foundations are preserved.
- Owner-licensed Pepty/PeptIQ/Peppedia/related donor material may be copied and
  adapted. Codex owns donor extraction and integration.

Canonical product definition: `docs/PRODUCT_SPECIFICATION_V1.md`.

## Canonical application state

- Repository: `C:\Users\harun\Documents\New project\AETERNA\aeterna-os`
- Branch: `overnight/aeterna-product-integration`
- Verified HEAD: `7f140bfa` (merge of the cloud-session branch
  `origin/claude/peptid-app-screen-issue-0c0gxg`, ~83 commits, into the prior
  canonical HEAD `821597a4`/`e99a3166`; see `docs/CONTINUATION_BRIEF.md` §3)
- Remote state: pushed and verified current (`git push` succeeded,
  `e99a3166..7f140bfa`)
- Working tree: clean; mobile and server `tsc --noEmit` both pass with 0
  errors after `pnpm install` picked up the merge's new dependencies
- 13 agent-worktree branches with real unmerged commits (HY3, DeepSeek ×3,
  GLM-5.2, OpenRouter, Codex donor/ux, aeon-readonly, rls-fix, plus 5
  `wip:`-committed dirty-worktree snapshots) were pushed to origin as their
  own branches and are **not yet reviewed or integrated** — see
  `docs/CONTINUATION_BRIEF.md` §3.3 and §6 for the exact branch list and
  next-step framing. Do not assume these are duplicates of the merge above
  without checking `git merge-base --is-ancestor` yourself.

Recent accepted commits (pre-2026-07-24 merge; still accurate context for
the golden-path/Faz B state described below):

- `c0a2a9fd` licensed Pepty catalog: 74 compounds and 150 PubMed references
- `d871866f` shared canonical AETERNA Zod contracts
- `c5a1cf30` real server-side Discourse adapter
- `73c87f5e` authenticated Stage 1A account export
- `032064b2` canonical top-level compound pharmacokinetics in mobile
- `17b91501` mobile Interaction Checker connected to server
- `8508bd42` protocol reminder lifecycle hardening
- `5b152eea` real Discourse category slug in topic detail
- `b458bb7b` touched-file Faz B lint cleanup
- `882ddca1` reminder payload type correction from clean typecheck
- `52282f02` real Compound-to-ProtocolItem link and prefilled protocol draft
- `51669b3e` protocol schedules bridged to reminders/daily actions with Today
  deduplication and Protocol Detail stack/logbook navigation
- `821597a4` Track symptoms can be explicitly linked to real scheduled
  interventions and display that relationship in history

2026-07-24 merge brought in (non-exhaustive; see `git log
1ca6da18..7f140bfa` for the full list): PDF/CSV lab import + OCR fallback,
biomarker provenance/retest/annotation backend, recommendations engine
scaffolding, protocol experiments, Discourse identity/SSO groundwork, AI
usage quota, a full ÆTERNA branding sweep (web + mobile + email templates),
sign-up flow, and App Store submission prep (iOS privacy manifests, icon
alpha fix).

## Current phase and gates

Faz B core tooling is complete, but Study Club is not yet interaction-complete.
The Discourse adapter and category/topic/detail/create/like/report foundation
exist. Replies, bounded pagination, search, capability/identity honesty, and
final moderation validation are the closing pass. A deployed Discourse
instance, credentials, categories, per-user identity/SSO, and live smoke
testing remain external release work and must not be fabricated.

The peptide golden path is the product gate before Labs: Compound -> Protocol
-> schedule/dose -> reminder -> Today -> taken/skipped/injection -> vial and
inventory -> symptom -> Weekly Review. Compound-to-Protocol, representable
daily/alternate-day/weekday schedule bridging, activation lifecycle, Today
deduplication, Protocol Detail navigation, and symptom-to-intervention links
are now implemented. Remaining work is end-to-end verification and making
injection/vial/review relationships visible without inventing unsupported
medical meaning.

Faz C has started with the existing 2D Body Atlas. Its compound-effect mode is
currently derived heuristically from `mechanism_summary`. Faz C replaces that
heuristic with an evidence-linked server contract, then connects mobile Body
Atlas to it.

Faz D is not active. Planned direction after Faz C: AEON plus meaningful
nutrition/training/community engagement integrated into Today rather than new
primary tabs.

## Active ownership

**As of 2026-07-24, the multi-agent parallel-worktree model below is
retired by explicit owner decision** ("şimdi tüm herşeyi sadece sen
yapacaksın" — "from now on, only you will do everything"). Claude is the
sole active development agent. The sections immediately below describe the
*prior* structure for historical/reference purposes — the worktrees no
longer exist locally (removed after their branches were pushed to origin
for safekeeping; see `docs/CONTINUATION_BRIEF.md` §3.3 for the exact branch
list). None of their unmerged work has been reviewed or integrated yet —
that review is open work for the current sole agent, not assigned to
anyone else.

### Claude

- Active. Sole development agent as of 2026-07-24. Owns integration,
  product/UX decisions, and canonical docs the way Codex previously did.
- Final HEAD before this handoff: `7f140bfa` (see "Canonical application
  state" above).

### Retired (prior parallel structure — kept for reference only)

- **Codex** — was product/UX lead and canonical integrator, maintained
  context/task cards, reviewed and cherry-picked agent commits, owned
  licensed donor extraction. That integrator role is now Claude's.
- **HY3** — was doing Study Club server completion
  (`agent/hy3-faz-b-community-server`, pushed to origin, unmerged; also
  `agent/claude-product-coherence-backend`, unmerged).
- **DeepSeek V4 Flash** — was doing Study Club mobile completion
  (`agent/deepseek-faz-b-community-mobile`, pushed to origin, unmerged).
- **DeepSeek V4 Flash #2** — was doing peptide golden-path closure
  (`agent/deepseek-golden-path-closure`, pushed to origin, unmerged; also
  `agent/deepseek-lab-pdf-import`, `agent/deepseek-nutrition-core-v2`).
- **GLM-5.2** — was doing Labs/Response Intelligence
  (`agent/glm-labs-response-intelligence`, pushed to origin, unmerged; also
  `agent/glm-product-coherence-mobile`, WIP-committed and pushed).
- **OpenRouter agent** — was doing Training Core prep
  (`agent/openrouter-training-core`, pushed to origin, unmerged).
- Also preserved, unmerged: `codex/donor-adoption`, `codex/ux-hardening`,
  `agent/aeon-readonly`, `fix/rls-matrix-stage1a-tables`,
  `agent/laguna-community-integration`, `agent/laguna-release-integration`
  (WIP-committed), `agent/stepfun-integrated-ux` (WIP-committed),
  `agent/stepfun-library-ux` (WIP-committed — its non-WIP history was
  already an ancestor of the current merge).

## File collision boundaries

**Retired alongside the ownership structure above.** These boundaries only
made sense when multiple agents edited the same repo concurrently in
separate worktrees. With a single active agent there is nothing to collide
with; kept here only so the historical record of who owned what during the
Faz B push is legible if you're reviewing the preserved branches in §"Active
ownership" above.

Former Codex-only paths while donor adoption was active:

- `SparkyFitnessServer/db/migrations/20260718150000_seed_licensed_pepty_catalog.sql`
- `SparkyFitnessServer/tests/licensedPeptySeed.test.ts`
- `SparkyFitnessMobile/src/utils/compoundResearch.ts`
- `SparkyFitnessMobile/src/screens/CompoundDetailScreen.tsx`
- `C:\Users\harun\Documents\New project\references\**`

Former HY3-only paths during Study Club closure:

- `SparkyFitnessServer/routes/v2/communityRoutes.ts`
- `SparkyFitnessServer/services/discourseClient.ts`
- Their focused server tests and an existing rate-limit integration point

Former DeepSeek-only paths during Study Club closure:

- Community mobile screens and focused tests
- `SparkyFitnessMobile/src/services/api/communityApi.ts`
- New Community hooks/types/utilities

Former Codex-only paths during Golden Path work:

- Compound Detail, Protocol Detail, Today/Track product linkage, and primary
  Library transformation files
- Canonical integration and task/context documentation

## Known external requirements

- Live Study Club needs deployed Discourse and owner-managed
  `DISCOURSE_BASE_URL` and `DISCOURSE_API_KEY`.
- Per-user Discourse identity is incomplete while writes use a shared username.
- Physical-device and live-service checks are separate from unit-tested code
  completeness.
- Never commit or paste secrets, `.env`, database dumps, or real health data.

## Verification discipline

Run commands from the affected package directory.

Mobile:

```powershell
corepack pnpm run typecheck -- --incremental
corepack pnpm exec eslint <touched-files> --max-warnings 0
corepack pnpm exec jest <focused-tests> --runInBand
```

Server:

```powershell
corepack pnpm run typecheck -- --incremental
corepack pnpm exec eslint <touched-files> --max-warnings 0
corepack pnpm exec vitest run <focused-tests> --no-file-parallelism
```

Shared changes require relevant server/mobile consumers to be typechecked.

## Next execution order

**Updated 2026-07-25 — Biology Operating System roadmap (5 phases).**

See `docs/DECISIONS.md` (2026-07-25, "Vision re-anchored") for the 9
approved decisions and the full vision→phase map. Summary:

Completed foundation (Claude, sole agent):
- Bundled read-only content (174 compounds, 872 wger exercises, 7083
  USDA foods, protocol templates/guides/comparisons, interaction
  checker) — zero server dependency.
- Login made optional (`localOnlyMode`, "Enter ÆTERNA without an
  account").
- Three UX bug fixes: water button tappable + haptic, injection-log
  loading-state, PDF/CSV real error message.
- **Render → Fly.io server migration DONE and live**
  (`https://aeterna-os.fly.dev/api/health` → 200 UP, 2 machines fra,
  never-sleep, DB still on Neon).
- SQLite Phase 1.0 + 1.1 done (8 tables + outbox + sync engine, commit
  `6f868b21`).

Active / next:
- **Phase 0 (blocker): SQLite Phase 1.2** — api seam swap + optimistic
  update (Claude in progress). Owner: rotate Fly deploy token + suspend
  Render.
- **Phase 1: Protocol→Response Engine** — 1 service + 1 route + 1
  helper + mobile ProtocolScreen delta grid + unhide
  ResponseTimelineScreen. ~75% scaffolded per audit. Lowest effort /
  highest value; this is the product's identity-changing feature.
- Phase 2: Today interpretation + Stack pathway intelligence.
- Phase 3: AEON correlation AI (server user-context endpoint).
- Phase 4: N=1 experiment scoring + biological events.
- Phase 5 (optional): WHOOP/Oura OAuth + Lab PDF OCR.

Then: physical-device build test (EAS), conflict-resolution UI,
server pull endpoints for entities missing `GET all`.

**Earlier plan (superseded 2026-07-24)** — kept for reference. The
numbered list below assumed the 5-agent parallel structure retired
above; what each retired branch in "Active ownership" was working
toward. Earlier real next steps for the then-sole agent were in
`docs/CONTINUATION_BRIEF.md` §6, starting with reviewing/integrating
the preserved branches.

1. ~~HY3 implements Study Club server completion from `882ddca1`.~~
2. ~~DeepSeek implements Study Club mobile completion from the same fixed API
   contract without touching HY3 files.~~
3. ~~Codex audits and repairs the peptide golden path in parallel.~~
4. ~~DeepSeek #2 closes and proves the remaining golden path.~~
5. ~~GLM builds Labs/Response on an isolated branch while OpenRouter prepares
   Training Core without shell integration.~~
6. ~~Codex integrates HY3 first, Community DeepSeek second, and runs cross-layer
   checks; Golden Path is integrated before Labs, Labs before Training.~~
7. Faz B still closes as CODE COMPLETE only once Study Club, golden path, and
   the items above are actually integrated and verified — that bar hasn't
   moved, only who does the integration has. Live Discourse provisioning
   remains a release blocker until real-instance smoke testing passes.
8. Evidence relationships and later AEON/Clinic work resume after these gates.
