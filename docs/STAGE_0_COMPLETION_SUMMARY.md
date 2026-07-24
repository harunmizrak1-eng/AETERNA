# Stage 0 completion summary

> **CURRENT STATUS: REOPENED / INCOMPLETE (corrected 2026-07-15).** A later
> filesystem and Git audit proved that no `AETERNA/aeterna-os` working copy,
> dependency installation, build baseline, test run, or live health-sync
> validation existed when Stage 0 was marked complete. The correction pass has
> now created a clean source clone, but it remains uninstalled and unvalidated.
> Stage 1A has not begun. See the newer correction entry at the top of
> `docs/DECISIONS.md`.

**Historical status preserved below:** Stage 0 was previously marked `COMPLETE`
by owner decision on 2026-07-15 and the project was described as moving to
Stage 1A. That closure is superseded; the remaining sections document what was
believed and produced at that time.

## What Stage 0 produced

| Document | Covers |
| --- | --- |
| `docs/COMPETITIVE_PARITY_BLUEPRINT.md` | Destination feature map; 13 capability areas; cross-cutting control systems (Safety Event Workflow, Data Conflict Resolution, Protocol Eligibility, Recommendation Lifecycle, Regulatory Mode); five-destination navigation target |
| `docs/ROADMAP.md` | Stage 0-5 gates and explicit non-goals per stage |
| `docs/DATA_MODEL.md` | Canonical domain vocabulary (Protocol, DoseLog, Vial, Biomarker, SafetyEvent, Consent, AuditEvent, DataConflict, etc.) |
| `AGENTS.md` | Permanent project rules and scope-control constitution |
| `docs/open-source-adoption-strategy.md` | Foundation choice rationale and adoption boundaries |
| `docs/MODULE_ADOPTION_REPORT.md` | SparkyFitness foundation audit + Medplum/Fasten Health/openScale/Gadgetbridge donor audits, with a REJECT-challenge re-analysis |
| `docs/SPARKYFITNESS_FEATURE_COVERAGE.md` | Feature-by-feature reuse/refactor/build-new audit of the full ÆTERNA feature list against the real SparkyFitness codebase |
| `docs/COMPETITIVE_UX_REPORT.md` | UX/onboarding/navigation/premium-feel benchmarking: OneTwenty (incl. real gated-dashboard screenshots), Marek Health, Ways2Well, Ultrahuman, HeadsUp Health, `aeternamethod.com` |
| `docs/DECISIONS.md` | Material decision log, append-only |
| `docs/HANDOFF.md` | Living session-state handoff between agents |

## Key decisions locked in during Stage 0

1. **SparkyFitness is the sole application foundation.** Exact Expo
   SDK 56/React Native 0.85 runtime match confirmed. Self-hosted
   Postgres/Express backend, not local-SQLite — a real infrastructure
   consequence of this choice, priced in, not hidden.
2. **SparkyFitness's commercial license is resolved.** Default license is
   non-commercial-only; owner obtained commercial-use permission directly
   from the copyright holder. Written evidence retained privately.
3. **ÆTERNA is an operating system, not a forked fitness app.** The user
   must never experience or describe it as "a fitness app that also does
   peptides." Every reused SparkyFitness domain gets ÆTERNA's own
   vocabulary, navigation, and visual system before reaching a screen.
4. **Community, if/when it re-enters scope, is a topic-based "Study Club"**
   (Hair, Longevity, Recovery, Performance, Peptides, Nutrition), not a
   Discord-style feed. Remains a non-goal until an explicit stage-entry
   decision.
5. **Donor-module decisions:** Medplum — adapt vocabulary (AuditEvent/
   Provenance/Consent), no code. openScale — adapt body-composition
   formulas from source papers; its Bluetooth-driver interface shape is a
   deferred adapt, not current scope. Fasten Health — reject (its real
   conflict-resolution logic is closed-source). Gadgetbridge — reject
   code/protocol, adapt two UI concepts only (coverage/gap timeline,
   device/permission list).
6. **KEEP / REFINE / BUILD NEW / DELETE** replaces the Reuse/Refactor/
   Build-New vocabulary for planning actual work — see
   `docs/SPARKY_TRANSFORMATION_PLAN.md`.

## Headline technical finding

SparkyFitness's medication/GLP-1 tracking domain (`injection_entries`,
`medication_pens`, `medication_schedules`, `medication_titration_steps`) is
structurally close to ÆTERNA's planned Dose Logging, Vial/Inventory, and
Supplements domains — a genuine REFINE opportunity, not the BUILD NEW effort
originally assumed. Protocol itself, the Peptide/Compound engine,
Biomarkers, and Today remain genuine BUILD NEW — no shortcut exists for
these in SparkyFitness.

## Exit-gate status (honest accounting)

`docs/ROADMAP.md`'s Stage 0 exit gate lists six criteria. Status against
each, as of this closure:

| Criterion | Status |
| --- | --- |
| Written commercial rights sufficient for intended distribution | **Met** — see `docs/DECISIONS.md` |
| Supported iOS and Android builds are reproducible | **Not independently verified** — no build was run |
| Existing automated tests establish a usable baseline | **Not independently verified** — SparkyFitness's 205 test files were counted, not executed |
| Health sync behavior and limitations are evidenced | **Not independently verified** — confirmed present in code (`docs/SPARKYFITNESS_FEATURE_COVERAGE.md`), not exercised on a device |
| Architecture, domain boundaries, migration risks, regulatory mode, consent, provenance, conflict handling, and audit requirements are documented | **Met** — `docs/DATA_MODEL.md`, `docs/MODULE_ADOPTION_REPORT.md` |
| Foundation report records an explicit go/conditional-go/no-go decision, owner approves | **Met** — this document, explicit **go** |

**This closure is a conscious owner decision to proceed without the three
unverified items**, not a claim that they're satisfied. They become
Stage 1A risks to surface during actual build/run/test work, per
`docs/DECISIONS.md`. If any of the three turns up a blocking problem once
real implementation starts, that blocks further work at that point — this
decision defers the check, it does not remove it.

## Historical decision — superseded

**SUPERSEDED: GO.** Stage 0 was declared closed and Stage 1A was described as
active. The repository-correction audit invalidated that operational status.
The transformation plan remains planning input, but implementation is blocked
until the clean `aeterna-os` foundation passes the open Stage 0 installation,
build, test, and health-sync gates.
