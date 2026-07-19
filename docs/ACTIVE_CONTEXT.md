# AETERNA active context

Last verified: 2026-07-18, Europe/Istanbul

This is the compact operational source for new AI sessions. It records current
state only, not project history. Codex owns this file.

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
- Verified HEAD: `51669b3e`
- Remote state: not re-verified after the final Claude commits
- Working tree: Golden Path commit clean; external `metro.config.js` and backup
  changes remain unowned and were deliberately not staged

Recent accepted commits:

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
deduplication, and Protocol Detail navigation are now implemented. Remaining
work is end-to-end verification and making injection/vial/symptom/review
relationships visible without inventing unsupported medical meaning.

Faz C has started with the existing 2D Body Atlas. Its compound-effect mode is
currently derived heuristically from `mechanism_summary`. Faz C replaces that
heuristic with an evidence-linked server contract, then connects mobile Body
Atlas to it.

Faz D is not active. Planned direction after Faz C: AEON plus meaningful
nutrition/training/community engagement integrated into Today rather than new
primary tabs.

## Active ownership

### Codex

- Product/UX lead and canonical integrator
- Maintains context and task cards
- Reviews and cherry-picks agent commits
- Owns licensed donor extraction and adoption

### Claude

- No longer active. Final accepted HEAD from Claude: `882ddca1`.

### HY3

- Immediate: minimum Study Club server completion
- Owns Community/Discourse server routes, client, validation, capability
  contract, rate-limit integration, and focused tests only
- Does not edit mobile, donor, Protocol, Library, Labs, or Body Atlas files

### DeepSeek V4 Flash

- Immediate: minimum Study Club mobile completion against the fixed contract in
  `docs/AGENT_TASKS.md`
- Owns Community screens/API/hooks/tests only
- Does not edit server, donor, Protocol, Library, navigation, or Body Atlas

## File collision boundaries

Codex-only while donor adoption is active:

- `SparkyFitnessServer/db/migrations/20260718150000_seed_licensed_pepty_catalog.sql`
- `SparkyFitnessServer/tests/licensedPeptySeed.test.ts`
- `SparkyFitnessMobile/src/utils/compoundResearch.ts`
- `SparkyFitnessMobile/src/screens/CompoundDetailScreen.tsx`
- `C:\Users\harun\Documents\New project\references\**`

HY3-only during Study Club closure:

- `SparkyFitnessServer/routes/v2/communityRoutes.ts`
- `SparkyFitnessServer/services/discourseClient.ts`
- Their focused server tests and an existing rate-limit integration point

DeepSeek-only during Study Club closure:

- Community mobile screens and focused tests
- `SparkyFitnessMobile/src/services/api/communityApi.ts`
- New Community hooks/types/utilities

Codex-only during Golden Path work:

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

1. HY3 implements Study Club server completion from `882ddca1`.
2. DeepSeek implements Study Club mobile completion from the same fixed API
   contract without touching HY3 files.
3. Codex audits and repairs the peptide golden path in parallel.
4. Codex integrates HY3 first, DeepSeek second, and runs cross-layer checks.
5. Faz B closes as CODE COMPLETE; live Discourse provisioning remains a release
   blocker until real-instance smoke testing passes.
6. Faz C evidence relationships resume only after the golden-path gate passes.
