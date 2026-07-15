# ÆTERNA decision log

## 2026-07-15 — SparkyFitness is the only application foundation

Decision:
Use SparkyFitness as the sole technical application foundation. Other projects
are read-only architecture references or module donors.

Why:
It matches the target Expo/React Native runtime and contains the health-sync
capabilities required for the planned product.

Rejected:
OpenNutriTracker or any other second application foundation.

Consequences:
Migration begins only after the Stage 0 license, build, health-sync, architecture,
and test report is approved.

## 2026-07-15 — Split Stage 1 into Protocol Core and Health Sync

Decision:
Stage 1A delivers the complete manual Protocol Core loop. Stage 1B adds
HealthKit and Health Connect only after the Stage 1A gate passes.

Why:
Today and protocol management must remain functional without device permissions,
background sync, or imported data.

Rejected:
Building protocol and health-sync migrations simultaneously.

Consequences:
Stage 1B cannot be used to fill gaps in the Stage 1A domain or user flow.

## 2026-07-15 — SparkyFitness commercial-use permission obtained

Decision:
SparkyFitness's default LICENSE is non-commercial-use-only (permission required
from the copyright holder for any commercial product). The project owner
states that commercial-use permission has been obtained directly from the
copyright holder, superseding that default restriction for ÆTERNA.

Why:
ÆTERNA intends to eventually open the app to a paying/monetized audience, which
the default SparkyFitness license would otherwise block without the author's
written consent.

Evidence:
Per owner statement, 2026-07-15. The owner retains a copy of the written
permission in private project records (not committed to this repository).
This satisfies `docs/ROADMAP.md`'s Stage 0 exit-gate requirement that "written
commercial rights are sufficient for the intended distribution" — the written
record itself is held privately rather than in-repo.

Rejected:
Treating the default non-commercial LICENSE text as still blocking; seeking a
different application foundation due to licensing.

Consequences:
- Original SparkyFitness copyright notices must be preserved where required.
- This decision is not re-audited unless the upstream repository's license
  changes or new information surfaces.

## 2026-07-15 — Sequential Codex and Claude Code workflow

Decision:
Codex and Claude Code work sequentially in the same Git repository and exchange
state through canonical documents, focused commits, and `docs/HANDOFF.md`.

Why:
Chat sessions and token windows are temporary. The repository must remain the
single durable source of truth.

Rejected:
Simultaneous editing, separate application copies, or relying on pasted chat
history as the handoff mechanism.

Consequences:
Each agent inspects the working tree before editing and updates the handoff before
yielding. Ambiguous dirty changes block continuation until reconciled.
