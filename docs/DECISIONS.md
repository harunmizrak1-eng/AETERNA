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

## 2026-07-15 — ÆTERNA is an operating system, not a forked fitness app

Decision:
SparkyFitness is infrastructure only. The user must never experience ÆTERNA
as a fitness-tracking app with a longevity layer bolted on — every screen,
label, and flow must read as a purpose-built Longevity Operating System. The
user should forget a fitness app exists underneath.

Why:
Owner directive: "En önemli karar — Ben Sparky'yi fork edilmiş fitness app
olarak görmek istemiyorum. Ben onu ÆTERNA OS olarak görmek istiyorum. Yani
kullanıcı fitness uygulaması kullandığını unutacak." (The most important
decision — I don't want to see Sparky as a forked fitness app. I want to see
it as ÆTERNA OS. The user will forget they're using a fitness app.) This
reinforces, and takes precedence in spirit over, the existing
`open-source-adoption-strategy.md` boundary that Sparky's UI, fitness-first
navigation, and branding are never adopted.

Rejected:
Any framing of ÆTERNA internally or externally as "SparkyFitness with a
longevity skin," a fork, or a fitness app. Reusing Sparky terminology
(workouts-first navigation, gym/fitness copy, fitness-app visual tropes) even
where the underlying feature is reused.

Consequences:
- Every reused SparkyFitness service/domain must be re-presented through
  ÆTERNA's own vocabulary, navigation (Today/Protocol/Biomarkers/Track/
  Library), and visual system before it reaches a user-facing screen —
  infrastructure reuse never implies UI or copy reuse.
- Product and design review should explicitly check new screens against this
  standard: would a user describe this as "a longevity operating system," or
  would they describe it as "a fitness app that also does peptides"? The
  latter is a failed screen regardless of feature completeness.

## 2026-07-15 — Community is a topic-based Study Club, not a social feed

Decision:
If/when Community re-enters scope (it remains a non-goal for V1 per
`docs/ROADMAP.md`), its shape is a topic-based "Study Club," not a
Discord-style chat/social feed. Structure discussion around fixed topic
areas (e.g. Hair, Longevity, Recovery, Performance, Peptides, Nutrition)
rather than open-ended channels, DMs, or a chronological social feed.

Why:
Owner directive: "Community — Ben olsam Discord gibi değil. Study Club gibi.
Mesela Hair / Longevity / Recovery / Performance / Peptides / Nutrition." (If
it were me, not like Discord. Like a Study Club. For example: Hair,
Longevity, Recovery, Performance, Peptides, Nutrition.) This refines, and
does not override, the existing Community capability already described in
`docs/COMPETITIVE_PARITY_BLUEPRINT.md` capability #13 (case studies,
protocol/research discussions, no follower counts or vanity metrics) and the
Phase-1-Community note in the sibling `C:\Users\harun\AETERNA` checkout's
`AGENTS.md`, which this document's Community non-goal currently supersedes
for V1 scope purposes.

Rejected:
Real-time chat, DM-first design, follower/like-count-driven social mechanics,
or an undifferentiated single feed.

Consequences:
- When Community is scoped for implementation, it organizes around a fixed
  set of topic areas (curriculum-like, consistent with the study-club framing
  and with `aeternamethod.com`'s own "Pillar" structure — metabolic,
  cognitive, recovery, tissue/joint, sleep, hormonal — which may be a natural
  starting topic taxonomy to reconcile against the Hair/Longevity/Recovery/
  Performance/Peptides/Nutrition list above).
- This is a scope refinement for a future stage, not a V1 authorization;
  `docs/ROADMAP.md`'s non-goals for Community remain in force until an
  explicit stage-entry decision is recorded.

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
