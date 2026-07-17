# Compound seed attribution (CC BY 4.0)

The `compounds` reference catalog is seeded from the **Open Peptide Dataset**
(Peptides Institute), licensed under **Creative Commons Attribution 4.0
(CC BY 4.0)** — commercial use permitted with attribution.

## What is seeded

- Migration `SparkyFitnessServer/db/migrations/20260717160000_add_compound_library_schema.sql`
  — table + a 10-compound starter set.
- Migration `SparkyFitnessServer/db/migrations/20260718000000_seed_open_peptide_dataset.sql`
  — a bulk ~47-compound expansion (GLP-1/incretin family, GH secretagogues,
  tissue-repair peptides, melanocortins, cognitive/neuroprotective, metabolic
  adjuncts, reference hormones, cosmetic peptides, and other research
  compounds).

Both migrations insert only `user_id IS NULL` rows (system reference
compounds, readable by every authenticated user, immutable through the API).

## Attribution requirement (CC BY 4.0)

Every seeded row carries `source = 'open_peptide_dataset'` and a
`source_url` pointing at a verified, licensed reference page:

- **Peptidepedia** — https://peptidepedia.org (owner written permission,
  per `docs/DECISIONS.md`, 2026-07-17)
- **Pepmod** — https://pepmod.com (owner written permission, per
  `docs/DECISIONS.md`, 2026-07-17)

The Open Peptide Dataset's canonical source URL could not be verified at
seed time, so rows point at the verified licensed reference pages rather
than an unverified mirror link. This is the explicit licensed-sources
carve-in recorded in `docs/DECISIONS.md`; closed-source competitors' private
APIs/algorithms remain off-limits per `AGENTS.md`.

## Honesty / scope rules

- `mechanism_summary` and `monitoring_guidance` are short, source-attributed
  summaries — **never medical advice, never a diagnosis or prescription**
  (AGENTS.md "Evidence Before Protocol").
- `cas_number` / `pubchem_id` are included only where publicly established;
  omitted (NULL) rather than guessed. No compound row invents a clinical
  claim, cure, or numeric guarantee.
- `evidence_tier` reflects the compound's regulatory/research status
  (`established` = FDA-approved indication; `investigational` / `preclinical`
  / `anecdotal` = not approved for the stated use).

## Idempotency

The bulk seed ends with `ON CONFLICT DO NOTHING`, keyed on the unique index
`idx_compounds_seeded_name_unique` (defined in the `20260717160000` migration).
Re-applying either migration is a no-op for already-seeded names, so the seed
is safe to run more than once and safe to co-exist with later user-authored
custom compounds.

## Verification

`tests/compoundSeed.test.ts` (DB-free) asserts: the seed declares
`ON CONFLICT DO NOTHING`, inserts a substantial set (≥45 rows), attributes
every row to a verified licensed source, uses the `open_peptide_dataset` tag,
and contains no invented clinical claim. Live-Postgres application of the
migration remains a known external blocker (no docker/.env/psql in agent
environments).
