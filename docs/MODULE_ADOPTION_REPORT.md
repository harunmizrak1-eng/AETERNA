# ÆTERNA module adoption report

Sprint 0 foundation-validation deliverable. Covers the application-foundation
audit (SparkyFitness) and the donor-module audit (Medplum, Fasten Health,
openScale, Gadgetbridge), per `docs/ROADMAP.md` Stage 0 and
`docs/open-source-adoption-strategy.md`.

This is a research and planning document. No code was copied, no dependency
was added, no application UI was changed, and no migration has begun.

## Method

- SparkyFitness was audited directly from the local read-only reference clone
  at `C:\Users\harun\Documents\New project\references\SparkyFitness`.
- Medplum, Fasten Health, openScale, and Gadgetbridge are not present in the
  references directory. Each was audited via public repository, license file,
  and documentation research (no local clone), since only a module-adoption
  decision — not a foundation decision — is in scope for them.
- Adoption boundaries follow `docs/open-source-adoption-strategy.md`: copy
  domains/services/tests/interaction behavior, never UI; keep provenance;
  import the smallest coherent module with tests; do not run three
  implementations of the same feature side by side.

## 1. SparkyFitness — application foundation audit

**Role:** platform base (already decided in `AGENTS.md`; this audit verifies
the decision still holds and surfaces risks, it does not reopen the choice).

### Runtime match

Confirmed exact: `SparkyFitnessMobile/package.json` pins `expo: ~56.0.13`,
matching ÆTERNA's Expo SDK 56 / React Native 0.85 pin. This is the strongest
argument for the foundation choice — no runtime migration is needed to build
on top of it.

### Architecture

- `SparkyFitnessMobile/` — Expo Router-free, React Navigation (bottom-tabs +
  native-stack), Expo SDK 56, TypeScript, Jest (205 test files under
  `__tests__/`).
- `SparkyFitnessServer/` — Express 5 + PostgreSQL backend, Better Auth
  (OIDC/TOTP/passkey/MFA), Row-Level Security policies per table
  (`db/rls_policies.sql`), migration checklist workflow
  (`agent-docs/new-migration-checklist.md`).
- `shared/` — `@workspace/shared` TypeScript workspace package: Zod schemas
  for both database tables and API contracts, timezone/day-string helpers.
- Health sync is a real, tested subsystem, not a stub:
  `src/services/healthkit/`, `src/services/healthconnect/`,
  `src/services/shared/healthSyncEngine.ts`,
  `src/services/backgroundSyncService.ts`,
  `src/services/shared/healthPermissionMigration.ts`,
  `src/hooks/useSyncHealthData.ts`, plus UI
  (`src/screens/SyncScreen.tsx`, `src/components/HealthDataSync.tsx`,
  `src/components/HealthDataWriteback.tsx`).

**Architectural consequence for ÆTERNA:** SparkyFitness is a self-hosted
client/server product (Postgres + Express backend required), not a local-only
app. Building on it means ÆTERNA's Stage 1A/1B work inherits a real backend
and RLS/migration discipline — a bigger infrastructure surface than
ÆTERNA's current local-SQLite prototype. This is a known, accepted
consequence of the foundation decision, not a new risk, but it should be
priced into Stage 0's "supported iOS and Android builds are reproducible"
and "architecture... documented" exit-gate items when that work starts.

### License

- Repo-root `LICENSE`: **non-commercial-use-only**, custom text, not an OSI
  SPDX license. Verbatim restriction: the software "may not be used, directly
  or indirectly, in any product, service, or project primarily intended for
  or resulting in commercial advantage or monetary compensation, without
  prior written permission from the author." Derivative works must carry the
  same non-commercial terms unless the author approves otherwise in writing.
  Contribution assignment clause: contributions are assigned to the author
  and grant the contributor no commercial rights.
- `SparkyFitnessServer/package.json` lists `"license": "ISC"` — this is
  inert npm metadata left over from scaffolding; it does not override the
  repo-root LICENSE, which governs the actual terms.
- **Resolution:** per `docs/DECISIONS.md` (2026-07-15), the project owner has
  obtained commercial-use permission directly from the copyright holder,
  superseding the default non-commercial restriction for ÆTERNA. Written
  evidence is retained privately by the owner, not in this repository.
  Original SparkyFitness copyright notices must be preserved. This is
  recorded as resolved and is not re-audited unless the upstream license
  changes.

### Verdict

**Adopt (confirmed).** No change to the standing foundation decision. Two
follow-ups for whenever Stage 0 build-evidence work begins (not this audit):
reconcile the `ISC` npm-metadata mismatch if it's ever surfaced externally
(e.g. a license scanner), and price in the Postgres/Express backend as
real infrastructure scope, not an incidental detail.

## 2. Medplum — module donor

**medplum/medplum** — FHIR-native healthcare developer platform.

- **License:** Apache-2.0. Permissive, no copyleft, commercial use and
  proprietary derivatives explicitly allowed. Only attribution/NOTICE
  obligations. No barrier to direct code reuse if the stack matched.
- **Stack/compatibility:** ~88% TypeScript monorepo. `packages/fhirtypes`
  (pure TS FHIR type definitions, no runtime dependency) and `packages/core`
  are inspectable/portable. `packages/react` is web React, not React Native.
  `packages/server` is Node/Express/Postgres/Redis with full FHIR-server
  machinery — architecturally irrelevant to ÆTERNA's on-device model.
- **Reusable concepts:**
  - `AuditEvent` (`packages/fhirtypes/AuditEvent.d.ts`) — `type`/`subtype`/
    `action`, `agent[]` (who + role + network), `source`, `entity[]`,
    `outcome`. Directly maps onto ÆTERNA's own `AuditEvent` entity in
    `docs/DATA_MODEL.md`.
  - `Provenance` (`packages/fhirtypes/Provenance.d.ts`) — separates
    *generation* (author/performer/enterer/attester) from *usage*
    (AuditEvent). Useful vocabulary for distinguishing "user entered" vs.
    "wearable sync" vs. "AI-suggested, human-approved" in ÆTERNA's
    provenance model.
  - Resource-history pattern (docs: `/docs/fhir-datastore/resource-history`)
    — corrections create a new version; a "revert" appends a new history
    entry rather than mutating or deleting. Matches ÆTERNA's own invariant
    ("imported raw health data remains recoverable after
    normalization/correction").
  - `Consent` (`packages/fhirtypes/Consent.d.ts`) — `status`, `scope`,
    `provision` (permit/deny with actor/action/period/data, base-policy-plus-
    exceptions). Useful shape for ÆTERNA's `Consent` entity.
  - Project-level policy gating (`/docs/compliance/hipaa`,
    `/docs/self-hosting/project-settings`) — weaker match, but the
    "policy object that gates behavior" pattern parallels
    `RegulatoryModePolicy`.
- **Duplication risk vs. SparkyFitness:** low. SparkyFitness has no
  clinical-data/consent/audit/provenance vocabulary at all.
- **Difficulty to adapt:** low-medium. The field lists are small, stable,
  and don't require FHIR-server compliance (HL7 parsing, full R4 generality,
  `CodeableConcept`/reference resolution) since ÆTERNA needs the modeling
  discipline, not FHIR interop.
- **Decision: Adapt.** Do not import `fhirtypes` or any Medplum code —
  RN/Expo + local SQLite is architecturally incompatible with a
  Postgres/FHIR-server model, and full FHIR generality is more than ÆTERNA
  needs. Deliberately mirror (simplified) the `AuditEvent`/`Provenance`/
  `Consent` field taxonomy and the append-only-correction pattern when
  ÆTERNA's own `AuditEvent`, `Provenance`-equivalent, and `Consent` types and
  SQLite schema are designed in Stage 0/1A. This is free, mature reference
  vocabulary regardless of the license (Apache-2.0 has no barrier, but
  nothing here is worth copying verbatim given the stack mismatch).

## 3. Fasten Health — module donor

**fastenhealth/fasten-onprem** — personal health record aggregator.

- **License:** GPL-3.0 (confirmed from `LICENSE.md` and the GitHub API
  `spdx_id`; not AGPL-3.0 as initially suspected). Copyleft: distributing a
  derivative (a mobile app binary counts) requires the derivative to be
  GPL-licensed and source-available. Copying/adapting this code into
  ÆTERNA is not viable without either GPL-licensing the resulting module or
  reimplementing independently and clean-room (not reading the source
  line-by-line while writing the equivalent).
- **Stack/compatibility:** Go backend (~47%), Angular/TypeScript frontend
  (~35%). No React Native. Nothing directly portable; only high-level data
  shapes are transferable.
- **Reusable concepts (with paths):**
  - `backend/pkg/models/source_credential.go` — `SourceCredential`: OAuth2/
    SMART-on-FHIR connection record (endpoint, patient ref, tokens,
    `LatestBackgroundJob` link, `PlatformType`). Reference shape for
    ÆTERNA's `DataSource` entity.
  - `backend/pkg/models/resource_association.go` +
    `backend/pkg/database/gorm_repository_related.go` — a **manual**
    cross-source record-linking mechanism (user says "this record from
    Source A is the same as that one from Source B"). Not automated
    dedup/fuzzy-matching.
  - `backend/pkg/models/resource_composition.go` — reuses FHIR's native
    `Composition.relatesTo`.
  - `background_job.go`, `background_job_sync.go`,
    `background_job_scheduled_sync.go`, `event_bus/event_source_sync.go`,
    `event_bus/event_source_complete.go` — async per-source sync job and
    lifecycle-event pattern.
- **Critical caveat:** the actual multi-provider SMART-on-FHIR connector
  logic lives in a separate module (`fasten-sources`, imported as
  `github.com/fastenhealth/fasten-sources/...`) that **returns 404 on
  GitHub — it is not public**. The project's own README states Fasten
  Onprem "is not able to import data from healthcare providers directly...
  you can only manually enter data, or upload FHIR Bundles." Live
  multi-provider aggregation now lives in a separate closed commercial
  product ("Fasten Connect"). The actual hard problem ÆTERNA would want to
  learn from — real conflict/dedup logic across sources — is not visible in
  the open-source code at all.
- **Duplication risk vs. SparkyFitness:** low (Fasten targets clinical/EHR
  data via FHIR; SparkyFitness targets wearable/device sync — distinct
  domains), but moot given the finding below.
- **Difficulty to adapt:** medium-high effort for low payoff — the visible
  parts are simple to reimplement independently, but the one thing worth
  learning (source-conflict resolution) isn't in the public repo to study.
- **Decision: Reject.** Do not treat this repo as a donor for
  conflict-resolution/dedup design — that logic is proprietary and absent
  from the public code; the only visible artifact (manual "mark these as
  related") is shallower than ÆTERNA's own planned `DataConflict` model. If
  a `DataSource`-style shape is wanted for reference, re-derive it from the
  public FHIR/SMART-on-FHIR specification directly, not from this GPL-3.0
  codebase.

## 4. openScale — module donor

**oliexdev/openScale** — Android body-weight/body-composition tracker with
Bluetooth smart-scale integrations.

- **License:** GPL-3.0. Copyleft: copying/adapting Kotlin/Java code obligates
  releasing the derivative under GPL-3.0-compatible terms. The underlying
  body-composition *formulas* (BMI, Deurenberg, Jackson-Pollock-family
  equations) are published science and not copyrightable — only openScale's
  specific code expression of them is GPL-protected. Reimplementing a
  formula from its cited paper, not from openScale's code, avoids the
  copyleft issue entirely.
- **Stack/compatibility:** Kotlin (~95%), some C++ (~4.5%, likely
  MCU/Arduino-adjacent for custom BLE hardware). Android-only; zero
  cross-platform or React Native relevance for direct code reuse.
- **Reusable concepts (study, do not copy):**
  - Body-fat % formulas: Deurenberg et al. 1991 (BMI+age+sex), Deurenberg
    1992 (age-split variant), Eddy et al. 1976 (BMI-based), Gallagher et al.
    2000 (Asian vs. non-Asian population-specific).
  - Body-water % formulas: Behnke et al. 1963, Delwaide-Crenier et al. 1973,
    Hume & Weyers 1971, Lee et al. 2001.
  - Lean body mass: Boer 1984, Hume 1966, plus direct weight-minus-fat.
    (Documented on the project wiki's "Body metric estimations" page.)
  - Bluetooth scale protocol breadth as a **feature-scope reference list
    only** — roughly 30+ supported models across Xiaomi (Mi Scale v1/v2,
    Body Composition Scale S400), the Beurer/Sanitas/Silvercrest shared
    protocol family, Medisana, Yunmai, Renpho, Trisa, and long-tail brands.
    The BLE GATT implementations themselves are exactly the copyrightable,
    GPL-encumbered part — not for reuse.
- **Duplication risk vs. SparkyFitness:** SparkyFitness already covers
  general weight/measurement logging with charts. It's unlikely to already
  implement multiple competing published body-composition formulas, and
  Bluetooth smart-scale integration is a distinct, nontrivial engineering
  surface most fitness trackers don't ship at all — so openScale's real
  marginal value is narrowly in those two things, not generic weight UI.
- **Difficulty to adapt:** formulas — low (a handful of algebraic equations,
  cheap to port to TypeScript directly from the source papers). Bluetooth
  scale protocol support — high (each vendor is its own reverse-engineered
  BLE GATT protocol; building even 3-4 brands from scratch is a multi-week
  effort per family, and copying openScale's implementation would trigger
  GPL copyleft).
- **Decision: Adapt (formulas only), reject wholesale reuse.** Reimplement
  2-3 body-fat/water/lean-mass formulas as small pure TypeScript functions,
  citing the original papers (not openScale) — cheap, and adds
  differentiated value beyond SparkyFitness's raw measurement charts.
  Bluetooth smart-scale integration is a separate, much lower-priority
  later-phase item given its high cost and GPL exposure on the only public
  reference implementation — not worth pursuing before ÆTERNA's actual
  Phase 1 scope (Stack/Journal/Blood panel, per `AGENTS.md`) is solid.

## 5. Gadgetbridge — module donor

**Freeyourgadget/Gadgetbridge** — Android app that talks directly to fitness
trackers/smartwatches over Bluetooth via reverse-engineered vendor protocols,
bypassing the vendor's own cloud/app.

ÆTERNA's own `docs/ROADMAP.md` Stage 1B already excludes this integration
model by name ("third-party wearable clouds, Gadgetbridge integration,
Bluetooth scales... direct devices"). This audit's job was to confirm that
exclusion is correctly scoped and check for any narrow exception — it is,
and there is none.

- **License:** AGPL-3.0 (confirmed from the repo-root LICENSE), stricter than
  plain GPL-3.0 — the Affero clause extends copyleft to network use, though
  the more relevant clause for a mobile client is the standard
  copyleft-on-derivative-works requirement. Any code-level reuse would
  obligate open-sourcing the incorporating module under AGPL — incompatible
  with a closed-source app.
- **Legal/ToS risk:**
  - Reverse-engineering vendor BLE protocols risks violating wearable
    vendors' EULA no-reverse-engineering clauses. DMCA §1201(f) provides an
    interoperability exception, but it is a fair-use-style defense, not a
    guarantee, and its boundaries are murky across jurisdictions (the EU has
    a similar but not identical carve-out).
  - Gadgetbridge is distributed via F-Droid, not Google Play or the Apple
    App Store, deliberately. Its own GitHub repo was taken down once via a
    DMCA request from a competing app's developer, documented in the
    project's own "Gadgetbridge Github DMCA Takedown" post, which triggered
    a migration to Codeberg. The project treats Play Store distribution as
    exposed to "seemingly gratuitous takedowns."
  - iOS has no equivalent path at all: Apple's Core Bluetooth permits
    generic BLE central-role connections but not the system-level
    notification injection, background classic-Bluetooth/BLE, and
    vendor-protocol GATT manipulation Gadgetbridge relies on. An app whose
    purpose is bypassing a third-party vendor's official protocol is
    squarely the kind of thing Apple has rejected on IP-infringement and
    "duplicating system functionality" grounds. There is no iOS build of
    Gadgetbridge and no comparable open-source project fills that gap.
- **Stack/compatibility:** Java (~99.6%), Android-only. Zero relevance to
  ÆTERNA's Expo/RN/TypeScript stack, and structurally impossible to bring to
  iOS — would create a permanent Android-only feature, breaking ÆTERNA's
  cross-platform parity even if legal risk were set aside.
- **Narrow reusable concept (UX only, not code):** the device
  list/pairing-management screen (per-device connection status, last-synced
  timestamp, per-device settings) and Bluetooth-permission rationale prompts
  are reasonable prior art for a Stage 1B HealthKit/Health Connect
  sync-status screen. This is a generic permission/sync-status list pattern
  common to many apps — not something that requires studying Gadgetbridge
  specifically.
- **Duplication/relevance:** none under ÆTERNA's actual roadmap. Gadgetbridge
  solves a different problem (bypassing OS health stores to talk to hardware
  directly) than ÆTERNA needs (reading from OS health stores that already
  did that aggregation). No narrow legitimate carve-out was found.
- **Decision: Reject**, for any code, protocol, or architecture adoption —
  confirmed by AGPL-3.0 copyleft, documented DMCA/takedown history, EULA
  reverse-engineering exposure, and a hard iOS platform wall. The existing
  roadmap exclusion is correctly scoped; no exception is worth carving out.

## Summary table

| Project | License | Copyleft risk | Stack match | Duplication vs. Sparky | Difficulty | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| SparkyFitness | Non-commercial (custom); commercial permission obtained, see `docs/DECISIONS.md` | Resolved | Exact (Expo 56/RN 0.85) | — (is the foundation) | — | **Adopt** (confirmed) |
| Medplum | Apache-2.0 | None | Types/docs only; server irrelevant | Low | Low-medium | **Adapt** (vocabulary, not code) |
| Fasten Health | GPL-3.0 | High | None (Go/Angular) | Low, but moot | Medium-high, low payoff | **Reject** |
| openScale | GPL-3.0 | High (code); formulas are public-domain science | None (Android-only) | Medium (formulas), high (BLE) | Low (formulas) / High (BLE) | **Adapt** formulas only, **reject** BLE |
| Gadgetbridge | AGPL-3.0 | High | None (Android-only, no iOS path) | None under current roadmap | N/A | **Reject** |

## Recommendations / next steps

1. No dependency, code import, or migration follows from this report by
   itself — per `docs/ROADMAP.md` Stage 0 non-goals, this is inspection only.
2. When ÆTERNA's own `AuditEvent`, `Provenance`, and `Consent` types are
   designed (Stage 0/1A), draft them with the Medplum FHIR field taxonomy
   open as a reference, simplified to ÆTERNA's own flat vocabulary — no
   Medplum code or package import.
3. When body-composition metrics are scoped (Track domain, after Phase 1
   Stack/Journal/Blood panel is solid per `AGENTS.md`), reimplement 2-3
   body-fat/water/lean-mass formulas directly from their cited academic
   sources, not from openScale's code.
4. Bluetooth smart-scale and direct-wearable-BLE integration (openScale's
   device breadth, Gadgetbridge's approach) remain out of scope; no roadmap
   change is recommended.
5. Fasten Health is not a useful reference for ÆTERNA's `DataConflict`
   design — its real conflict-handling logic is closed-source. No follow-up
   needed.
