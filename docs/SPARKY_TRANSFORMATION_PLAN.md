# Sparky transformation plan

Final Stage 0 deliverable. Module-by-module action, using the KEEP / REFINE
/ BUILD NEW / DELETE vocabulary from `docs/DECISIONS.md`, derived from
`docs/SPARKYFITNESS_FEATURE_COVERAGE.md` and `docs/MODULE_ADOPTION_REPORT.md`.
No further planning documents follow this one unless a specific
implementation task requires one — see `docs/STAGE_0_COMPLETION_SUMMARY.md`.

| Existing module | Action |
| --- | --- |
| Dashboard (`DailyProgress.tsx`, CheckIn home, `RecentActivity.tsx`) | Delete |
| Nutrition | Refine |
| Workout | Keep |
| Medication (dose logging + vial/inventory + supplements) | Refine |
| Measurements / Progress tracking | Keep |
| Recovery | Refine |
| Reports (charts) | Refine |
| Reports (export/share) | Build New |
| Authentication (Better Auth: OIDC/TOTP/passkey) | Keep |
| Settings | Keep |
| Notifications | Keep |
| Health Sync (Apple Health, Health Connect, Fitbit, Garmin, Withings, Polar, Strava) | Keep |
| Data layer (Postgres/Express backend) | Keep |
| API (Express REST routes) | Keep |
| AI chat infrastructure | Keep (dormant — AI coach stays out of scope) |
| Multi-user/family backend (`family_access` + RLS) | Keep (infra only — no Practitioner UI yet) |
| Habits | Build New |
| Library/content | Build New |
| Community (social UI) | Not in scope (V1 non-goal) |
| Protocol | Build New |
| Peptide / Compound Engine | Build New |
| Biomarkers | Build New |
| Response Timeline | Build New |
| Today | Build New |
| AI Layer (longevity-coaching, not the dormant chat infra above) | Build New (stays out of scope until AI coach non-goal is revisited) |

## Notes

- **"SQLite" is not listed as Keep.** SparkyFitness's confirmed backend is
  PostgreSQL via `SparkyFitnessServer` (Express 5 + Postgres), not SQLite —
  see `docs/MODULE_ADOPTION_REPORT.md`'s architecture section. Whether
  `SparkyFitnessMobile` uses any local SQLite/offline cache alongside that
  backend has not been verified; if that turns out to matter, confirm it
  during Stage 1A build work rather than assuming it here.
- **Dashboard vs. Today are listed separately on purpose.** SparkyFitness's
  existing dashboard-ish screens are fully superseded by ÆTERNA's new Today
  screen (Delete), not refined into it (Build New) — they don't share
  enough structure to refine, per `docs/SPARKYFITNESS_FEATURE_COVERAGE.md`.
- **Medication is one Refine effort serving three ÆTERNA feature groups**
  (Dose Logging, Vial/Inventory, Supplements) — they share the same
  underlying tables (`injection_entries`, `medication_pens`,
  `medication_schedules`).
- Rows not mentioned in `docs/SPARKYFITNESS_FEATURE_COVERAGE.md`'s audit
  (e.g. Whoop/Oura/CGM health-sync providers, Practitioner UI, imaging/
  genetics) are Stage 2+ scope and intentionally omitted here — this table
  covers Stage 1A-relevant modules only.
