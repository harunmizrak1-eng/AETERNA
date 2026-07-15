# ÆTERNA — Project Constitution

Read this file before every task. Detailed rules live in the canonical documents:

- Product destination and parity: `docs/COMPETITIVE_PARITY_BLUEPRINT.md`
- Delivery order, stage gates, and non-goals: `docs/ROADMAP.md`
- Domain entities, relationships, and statuses: `docs/DATA_MODEL.md`
- Material decisions: `docs/DECISIONS.md`

ÆTERNA is a premium longevity operating system built around:

**Data → Analysis → Protocol → Action → Tracking → Re-evaluation**

**Evidence Before Protocol.** Do not diagnose, prescribe, promise outcomes,
invent evidence, or silently change a protocol.

## Permanent decisions

- SparkyFitness is the only application foundation.
- SparkyFitness has explicit commercial-use permission for this project, obtained
  directly from the copyright holder (see `docs/DECISIONS.md`, 2026-07-15).
  Treat this as resolved; do not re-audit or question it unless the upstream
  repository's license changes or new information surfaces.
- Expo SDK 56, React Native 0.85, React 19, and strict TypeScript remain pinned
  until an explicit, tested upgrade decision is recorded.
- Other repositories are references or module donors only. Never add a second
  application foundation.
- Do not reuse the Sparky dashboard UI or the rejected ÆTERNA dashboard.
- Today is the product center; it must answer what to do, what changed, and why.
- The visual direction is light, calm, editorial, scientific, and premium—not a
  generic SaaS, clinic template, supplement store, or black-and-gold dashboard.

## Scope control

- The parity blueprint is a destination map, not implementation permission.
- `docs/ROADMAP.md` is authoritative for active scope.
- Stage 1A Protocol Core must pass its gate before Stage 1B Health Sync begins.
- V1 excludes nutrition, community, advanced AI, clinical portal, CGM, genetics,
  imaging, cohort analytics, and autonomous recommendations.
- Documentation, audit, and prototype tasks must not add product features,
  dependencies, migrations, or infrastructure.
- Risky or cross-domain work follows: audit → smallest safe plan → approval →
  implementation.
- Read only the relevant 3–6 files. Do not run a broad audit unless requested.
- Prefer existing patterns and the smallest coherent change; do not create a new
  abstraction before checking the current architecture.
- Record material scope or architecture decisions in `docs/DECISIONS.md`.
- Never treat a competitor feature, design, private API, algorithm, content, or
  source code as directly reusable without an explicit decision and rights.

## Completion rule

A task is incomplete while relevant build, typecheck, lint, tests, security,
privacy, accessibility, mobile layout, or documentation checks fail. Report only
changed files, work completed, test result, and known risk or gap.
