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
- Verified HEAD: `5b152eea`
- Remote state: local branch ahead of origin by 8 commits
- Working tree: clean

Recent accepted commits:

- `c0a2a9fd` licensed Pepty catalog: 74 compounds and 150 PubMed references
- `d871866f` shared canonical AETERNA Zod contracts
- `c5a1cf30` real server-side Discourse adapter
- `73c87f5e` authenticated Stage 1A account export
- `032064b2` canonical top-level compound pharmacokinetics in mobile
- `17b91501` mobile Interaction Checker connected to server
- `8508bd42` protocol reminder lifecycle hardening
- `5b152eea` real Discourse category slug in topic detail

## Current phase and gates

Faz B is closing. Code covers peptide tools, account export, reminders, and the
core Discourse adapter. Claude is expected to finish the minimum Study Club
interaction layer: replies, pagination, search, validation, and final Faz B
verification. A deployed Discourse instance, credentials, categories,
per-user identity/SSO, and live smoke testing remain external release work and
must not be fabricated.

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

### Claude, final current pass

- Faz B Study Club completion and verification
- Owns community mobile/server files for that pass
- Must not edit donor files or Faz C Body Atlas files

### HY3

- Next: Faz C evidence relationship backend foundation
- Owns new server migration/repository/routes/tests and shared contracts only
- Does not seed donor content or edit mobile screens

### DeepSeek V4 Flash

- Starts only after HY3's accepted commit is integrated
- Next: connect Body Atlas mobile to the evidence relationship API
- Does not edit server migrations, donor data, Compound Detail, navigation, or
  canonical documentation

## File collision boundaries

Codex-only while donor adoption is active:

- `SparkyFitnessServer/db/migrations/20260718150000_seed_licensed_pepty_catalog.sql`
- `SparkyFitnessServer/tests/licensedPeptySeed.test.ts`
- `SparkyFitnessMobile/src/utils/compoundResearch.ts`
- `SparkyFitnessMobile/src/screens/CompoundDetailScreen.tsx`
- `C:\Users\harun\Documents\New project\references\**`

Claude-only until Faz B handoff:

- Community screens/API/routes and current Discourse client
- Study Club reply/search/pagination work

HY3-only for its assigned task:

- New evidence/relationship migration, repository, route, service, tests
- New shared evidence/relationship schemas

DeepSeek-only after HY3 integration:

- `SparkyFitnessMobile/src/screens/atlas/BodyAtlasScreen.tsx`
- New mobile relationship API/hook/types/tests listed in its task

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

1. Claude closes Faz B Study Club code and reports external blockers.
2. Codex reviews/integrates Claude and closes or holds Faz B.
3. HY3 implements the bounded Faz C relationship backend.
4. Codex reviews/integrates HY3.
5. DeepSeek connects Body Atlas mobile to the accepted API.
6. Codex continues licensed donor adoption where ownership does not overlap.
