# Compound content governance

Status: **Product design only.** This document defines taxonomy, workflow,
and relationship rules for compound/intervention knowledge content. It does
not implement UX-16, does not create or populate any monograph, does not add
a database migration, and does not scrape or import content. It exists so
that when the owner is ready to unblock UX-16 (per `docs/HANDOFF.md`'s
option 2), the governance question ("compound-content governance — who
authors/reviews compound monographs, how evidence tiers are assigned",
`docs/DECISIONS.md` 2026-07-16) has a concrete answer to approve or amend,
instead of starting from a blank page.

This document extends `docs/DATA_MODEL.md`'s `Compound`, `CompoundMonograph`,
and `EvidenceReference` entities with the process layer those entity
definitions deliberately leave out ("canonical domain vocabulary... not
physical SQL tables"). It does not redefine any status enum `DATA_MODEL.md`
already declares — it defines who moves content between those states and
under what criteria. Where this document proposes a field or role that
`DATA_MODEL.md` does not yet name, it is marked **(proposed)** and requires
a `docs/DECISIONS.md` entry before implementation, per `AGENTS.md`'s "record
material scope decisions" rule.

## 1. Why this exists

`docs/MASTER_PRODUCT_BRIEF.md`'s own non-negotiable rules include: no fake
score, no fake reference range, **no fake compound claim**, and no confusing
"zero" with "no data." A Knowledge Library cannot honor that constraint
without a real answer to two questions: who is allowed to assert a clinical
claim inside this product, and how does the product know a given claim is
still trustworthy. Everything below answers those two questions.

## 2. Compound taxonomy

Per `docs/MASTER_PRODUCT_BRIEF.md` §Knowledge: "not every intervention is a
peptide." `Compound.category` **(proposed field)** takes one of:

| Category | Scope |
|---|---|
| `peptide` | Peptide therapeutics (e.g. GLP-1 analogues classified as peptides, growth-hormone secretagogues). |
| `hormone_therapy` | Exogenous hormones and hormone-modulating compounds. |
| `glp1_metabolic_medication` | GLP-1/GIP metabolic medications not classified as peptides for this taxonomy's purposes. |
| `other_medication` | Prescription or OTC medication outside the above. |
| `supplement` | Regulated or lightly-regulated supplement products. |
| `nutraceutical` | Bioactive food-derived compounds marketed for a physiological effect. |
| `nutrition_intervention` | A dietary pattern or nutrition protocol, not a discrete compound (e.g. time-restricted eating). |
| `training_intervention` | An exercise/training protocol, not a discrete compound. |

This taxonomy classifies what a `Compound`/`CompoundMonograph` *is*. It is
distinct from `ProtocolItem.type` (`compound`, `supplement`, `medication`,
`habit`, `nutrition`, `training`, `sleep`, `other` — already canonical in
`DATA_MODEL.md`), which classifies what a *user's protocol item* is doing.
A `ProtocolItem` of type `compound` or `medication` may link to a `Compound`
whose `category` is any of the finer-grained values above; `nutrition` and
`training` `ProtocolItem`s may link to a `Compound` of category
`nutrition_intervention` or `training_intervention` when a monograph exists
for that intervention, or to no `Compound` at all when it is purely a
user-defined habit with no Knowledge content behind it.

## 3. Monograph content fields

Per `docs/MASTER_PRODUCT_BRIEF.md` §Knowledge, a `CompoundMonograph`
**(proposed fields, extending the existing versioned-record shell)** carries:

- `name`, `synonyms` — display name and known aliases.
- `category` — from §2.
- `mechanism` — mechanism of action, in evidence-graded language (see §5).
- `investigated_uses` — conditions/goals under investigation or approved use, never phrased as a personal recommendation.
- `regulatory_status` — see §8.
- `evidence_tier` — the `CompoundMonograph.evidence_level` enum already in `DATA_MODEL.md` (`strong`, `moderate`, `early`, `preclinical`, `insufficient`); see §5 for assignment.
- `administration_routes` — routes with any known regimen sourcing distinguished from personal-report sourcing.
- `monitoring_requirements` — labs, symptoms, or intervals a reasonable protocol would track.
- `contraindications`, `warnings`, `side_effects` — always sourced, never inferred.
- `related_biomarkers`, `related_body_systems` — see §11–12.
- `references` — one or more `EvidenceReference` records; a monograph with zero references cannot leave `draft` (see §6).
- `last_reviewed_at` — date of the most recent completed review cycle (§7).

None of these fields may contain a personalized dosing instruction, a
promise of outcome, or an assertion the linked `EvidenceReference` set does
not support. This is the same rule already enforced for Protocol/Today
content in `AGENTS.md`'s "Evidence Before Protocol" clause, applied to
Knowledge content instead of protocol content.

## 4. Roles

These are role definitions the owner must staff or assign before UX-16
content work starts — this document does not assume anyone is already
appointed to them.

- **Content author** — drafts a `CompoundMonograph` from source material. May be staff, a contracted medical writer, or (later) an AI-assisted draft explicitly marked `draft` and never auto-published (see §9).
- **Clinical reviewer** — a qualified reviewer (defined by the owner's regulatory posture; at minimum, someone with the domain competence to evaluate the cited evidence) who checks mechanism, evidence-tier assignment, contraindications, and interactions for accuracy.
- **Compliance/editorial reviewer** — checks tone, honest-state language compliance, absence of promissory claims, and regulatory-status accuracy per jurisdiction (§8).
- **Publisher** — the role authorized to move a monograph into `published` state. May be the same person as the compliance reviewer, but the action is logged separately (§6).

A single person may hold multiple roles on a small team, but the workflow
below still requires the *actions* to happen in order — self-review does not
skip a gate.

## 5. Evidence tier model

`CompoundMonograph.evidence_level` (`strong`, `moderate`, `early`,
`preclinical`, `insufficient`) is already canonical. Assignment criteria:

| Tier | Minimum bar |
|---|---|
| `strong` | Multiple independent human RCTs or a systematic review/meta-analysis with consistent direction of effect, and no major contradicting human trial. |
| `moderate` | At least one adequately powered human RCT, or consistent observational human evidence without an RCT. |
| `early` | Human evidence exists but is limited to small trials, case series, or early-phase studies. |
| `preclinical` | Evidence is animal or in-vitro only — no human data yet. |
| `insufficient` | Evidence does not meet the bar for `preclinical` (e.g. mechanistic plausibility only, or conflicting/withdrawn studies) — the monograph must say so explicitly rather than omit a tier. |

`EvidenceReference.study_type` (already in `DATA_MODEL.md`: "human, animal,
and in-vitro evidence remain distinguishable") is the input; evidence tier
is a *derived* editorial judgment the clinical reviewer makes from the full
reference set, not a per-reference field. A tier can only be *downgraded*
by a single new contradicting reference; an *upgrade* requires the full
review cycle (§7), preventing a single favorable preprint from silently
raising a compound's tier.

## 6. Editorial and review workflow

Maps directly onto `CompoundMonograph.publication_status`, already
canonical in `DATA_MODEL.md`: `draft → evidence_review → clinical_review →
published → superseded | withdrawn`.

1. **`draft`** — content author writes the monograph against §3's fields, attaches every `EvidenceReference` used. Not visible to end users under any circumstance.
2. **`evidence_review`** — clinical reviewer verifies each claim traces to an attached reference, assigns/confirms `evidence_tier` per §5, and checks `related_biomarkers`/`related_body_systems` links (§11–12) are reference-backed, not inferred.
3. **`clinical_review`** — compliance/editorial reviewer checks §8's regulatory-status accuracy, honest-state language, and absence of promissory or personalized claims.
4. **`published`** — publisher moves the monograph live. This is a distinct, logged action from passing `clinical_review` — passing review is necessary but not sufficient; the publisher confirms the release itself (e.g. checking a batch of related monographs are ready together, or holding for a scheduled content release).
5. **`superseded`** — a newer `CompoundMonograph` version supersedes this one. The old version remains readable in its original state (immutability rule, §7) but the UI must not present it as current.
6. **`withdrawn`** — content is pulled (e.g. a compound's regulatory status changed, or new evidence invalidates the monograph). A `withdrawn` monograph is never silently deleted — `DATA_MODEL.md`'s "raw imported data is immutable; corrections create revisions" rule applies to editorial content too.

A monograph may only move forward one stage at a time and may be sent
backward (e.g. `clinical_review → draft`) with a required reason, mirroring
`ProtocolVersion`'s existing `rejected`/`withdrawn` pattern.

## 7. Versioning

- A `CompoundMonograph` version is immutable once `published`. A correction
  or evidence update creates a new version in `draft`, following the same
  workflow (§6) — it does not edit the published record in place.
- `last_reviewed_at` is set on entry to `published` and is the trigger for
  a scheduled re-review (cadence is a business decision the owner sets
  separately, e.g. annually for `strong`/`moderate` tier content, more
  frequently for `early`/`preclinical`).
- Any published monograph may be force-reopened into a new `draft` outside
  the schedule if a safety signal emerges (e.g. a regulatory withdrawal) —
  this bypasses the cadence but not the workflow stages.

## 8. Regulatory status model

Builds on `Compound.clinical_status` (already canonical: `approved`,
`investigational`, `unapproved`, `withdrawn`, `unknown`).

`clinical_status` is deliberately jurisdiction-agnostic at the `Compound`
level — a single global status per compound is not sufficient once
per-country approval differs (a compound can be `approved` in one
jurisdiction and `unapproved` in another). This document does **not**
resolve that gap; `docs/MASTER_PRODUCT_BRIEF.md` §10 lists "ülkeye göre
regulatory status" (regulatory status by country) as an explicitly open
question, and it stays open here too. Until it is resolved, `clinical_status`
should be read as "status in the jurisdiction(s) the cited references cover,"
and the monograph text must say which jurisdiction(s) that is — never imply
a global approval state that hasn't been verified per-market.

## 9. AI-assisted content (explicit boundary)

`docs/MASTER_PRODUCT_BRIEF.md` names AI drafting as a future assistant
capability ("kaynaklı compound bilgisi vermek" — providing sourced compound
information). If AI-assisted drafting is used:

- Output enters exactly at `draft` and only as a content-author action — an
  AI draft is never auto-advanced through §6's stages.
- An AI draft must cite specific `EvidenceReference` records it was given,
  not general training knowledge — it summarizes provided sources, it does
  not originate unsourced clinical claims. This is the same
  no-fabrication discipline already applied to health data throughout this
  codebase, extended to editorial content.

## 10. Canonical source strategy and reference policy

Acceptable `EvidenceReference` sources, in descending preference:

1. Peer-reviewed human RCTs and systematic reviews/meta-analyses.
2. Regulatory filings and agency guidance (e.g. approval labels, agency
   safety communications).
3. Peer-reviewed observational human studies.
4. Peer-reviewed animal/in-vitro studies (feeds `preclinical` tier only).
5. Clinical practice guidelines from recognized professional bodies.

Not acceptable as a monograph's evidentiary basis: forum posts, anecdotal
reports, influencer claims, manufacturer marketing material, or another
Knowledge product's monograph text copied without independent verification
of its underlying sources (`AGENTS.md`: "never treat a competitor's...
content... as directly reusable without an explicit decision and rights").
User-submitted anecdotes belong in Community content (§ below), never
merged into a monograph's evidence set.

`EvidenceReference.study_type` must be set for every reference (human,
animal, in-vitro) so the UI can render the same established/investigational/
preclinical visual distinction `docs/MASTER_PRODUCT_BRIEF.md` §Body Atlas
describes (solid emphasis vs. dashed border vs. distinguishable preclinical
treatment) consistently between Knowledge and Body Atlas surfaces.

## 11. Body-system relationship rules

A `Compound`/`CompoundMonograph` may declare a relationship to a body
system only when at least one attached `EvidenceReference` supports the
mechanism connecting them. `docs/MASTER_PRODUCT_BRIEF.md` §Body Atlas is
explicit: "when a compound is selected, the body map must show only systems
that can be linked back to a source" — this document makes that the
authoring-time rule, not just a rendering-time filter. A system link
without a supporting reference is not stored at all, rather than stored
and hidden — the two states ("no relationship" and "relationship exists but
unreviewed") must never be conflatable, matching the project's "never
confuse zero with missing" rule.

## 12. Biomarker relationship rules

Same rule as §11, applied to `related_biomarkers`: a monograph may link to
a `Biomarker` (the canonical analyte definition in `DATA_MODEL.md`) only
with reference-backed support, and the relationship records a direction
(e.g. "may increase," "may decrease," "monitor for change") rather than an
unqualified association. This is what §3's `monitoring_requirements` field
draws from — a monograph that recommends monitoring a biomarker must
declare that relationship here first, not invent it ad hoc in the
monitoring text.

## 13. Content ownership

Each published `CompoundMonograph` has exactly one accountable owner role
(§4's "Publisher" for the specific monograph, or a named editorial lead)
responsible for its re-review cadence (§7) and for responding when a
`withdrawn`/`superseded` transition is needed. Ownership is a property of
the role assignment, not of the original content author — authorship and
long-term accountability are allowed to diverge (an author may leave the
project; the monograph's owner does not change without an explicit
handoff).

## 14. Explicit non-goals of this document

- Does not implement any UX-16 screen, component, or navigation.
- Does not create a database migration, table, or schema change.
- Does not populate a single real monograph, compound, or evidence record.
- Does not resolve the still-open per-country regulatory-status question
  (§8) or the AI-naming/Community-scope questions from
  `docs/DECISIONS.md`'s 2026-07-16 entry — those remain the owner's calls.
- Does not authorize Stage 1B, UX-16, or any other roadmap slice to begin;
  `docs/ROADMAP.md`'s stage gates and `docs/UX_TRANSFORMATION_REVIEW.md`'s
  slice sequencing remain authoritative and unchanged.
