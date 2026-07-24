# Stage 1A exit-gate review

Date: 2026-07-16. Scope: verifies `docs/ROADMAP.md`'s Stage 1A ("ÆTERNA
Foundation & Rebranding — Protocol Core") exit gate against the actual
`aeterna-os` codebase as of commit `6b2dd592` on
`overnight/aeterna-product-integration`. This is a status review, not a
decision — it produces the evidence the owner needs to approve or hold
Stage 1B entry; it does not itself approve anything (`docs/ROADMAP.md`'s
own exit-gate line: "Owner approves Stage 1B entry").

Every finding below was checked against the current repository (code,
migrations, or test output), not against docs or memory of earlier
sessions. Where a claim required deeper verification, a dedicated research
pass is cited inline.

> **Re-verification 2026-07-17 supersedes the per-leg findings in §1–§11
> below.** Sections §1–§11 were written at commit `6b2dd592`, *before* the
> S1A-16 through S1A-26 completion work existed. They are preserved
> unedited as the historical baseline. Read the re-verification section
> immediately below for the current state; where the two disagree, the
> re-verification is authoritative because it reflects later commits.

## 0. Re-verification — 2026-07-17

Scope: re-checks every Stage 1A exit-gate criterion against
`overnight/aeterna-product-integration` at HEAD `332e7e4b` (was `6b2dd592`
when §1–§11 were written). The 25 commits `215375b1..332e7e4b` implement
S1A-16 through S1A-26 plus a hardening pass. Every row below was verified
against a file, migration, or test run in this session, cited inline.

### 0.1 The eight-leg end-to-end chain

| Leg | 2026-07-16 (§1) | 2026-07-17 (now) | Evidence |
|---|---|---|---|
| Baseline | Not implemented | **Data + API + read UI built** | `db/migrations/20260716130000_add_protocol_baseline_schema.sql`; `protocolRepository`/`protocolRoutes`; mobile `useProtocolBaseline` + ProtocolScreen "Baseline assessment" row reads real `completed_at` state |
| Eligibility | Not implemented | **Data + API + read UI built** | `20260716140000_...eligibility_assessment_schema.sql`; `protocolEligibilityRepository.ts`; mobile `EligibilityStatus` renders the latest real assessment's `state`/`basis` |
| Protocol activation | Not implemented | **Built, with immutable versions** | S1A-19 `1212c8b8`; `protocolRepository.ts` submit/activate/reject; `ImmutableVersionError` thrown on editing a non-draft version; ProtocolScreen Submit/Activate/Reject buttons |
| Schedule | Real | **Real + protocol-linked** | `20260716150000_...protocol_item_link.sql` adds `protocol_item_id` to `medication_schedules`; mobile `doseSourceLabel` shows "Protocol" provenance |
| Dose log | Real write | **Real write + idempotent** | `20260716160000_...idempotency_key.sql` partial unique index on `(user_id, idempotency_key)`; mobile sends deterministic `dose:<med>:<sched>:<date>` key |
| Inventory update | Real write | **Real write + constrained** | `20260716170000_...inventory_constraints.sql` CHECK on `doses_used`/`doses_total`; `injectionRepository` `PenExhaustedError`/`PenNotFoundError` with `FOR UPDATE` lock |
| Symptom | Real write | **Real write** (unchanged) | `POST /api/v2/symptoms/entries` |
| Safety event | Not implemented | **First-class workflow built** | `20260716180000_add_safety_event_schema.sql` (`safety_events` + append-only `safety_event_updates`); `/api/v2/safety-events`; mobile "Flag as safety concern" on each symptom row |
| Weekly review | Real | **Real + lab results + open safety events** | S1A-26 `fbab0cdf`; `useWeeklyReview` aggregates adherence, symptoms, `observations`, `unresolvedSafetyEvents` — no score, no causal claim |

Every previously-missing leg (Baseline, Eligibility, Protocol activation,
Safety event) now exists at the database, API, and — except the two
creation gaps in §0.3 — the mobile layer. **BiomarkerResult** (also flagged
absent in §6) is likewise built: `20260716190000_add_biomarker_result_schema.sql`,
`/api/v2/biomarker-results`, and the BiomarkersScreen "Laboratory results"
section with manual entry.

### 0.2 The other exit-gate criteria

- **"Protocol edits create immutable versions; historical logs retain their
  version."** — **Now enforceable and enforced.** `protocolRepository.ts`
  throws `ImmutableVersionError` when a non-`draft` version is edited;
  activation supersedes the prior active version in one transaction and
  repoints `protocols.current_version_id`. (Was "not applicable" in §1
  because no version existed.)
- **"Duplicate dose submissions are idempotent."** — **Now met at the
  server.** The §1 finding (client-only protection) is closed: a real
  partial unique index rejects a duplicate `(user_id, idempotency_key)`,
  and `medicationEntryRepository.createEntry` pre-checks then catches the
  unique-violation and refetches the original. Concurrency-simulation test
  included.
- **"Timezone, unit conversion, offline/retry, permission denial, and
  safety-event error paths are covered by tests."** — **Now fully met.**
  The four pre-existing coverages remain; the previously-impossible
  safety-event error paths are covered by `tests/safetyEventRoutes.test.ts`
  (invalid severity → 400, missing description → 400, etc.).
- **"Data export and account deletion cover all Stage 1A entities."** —
  **Now met.** Export: `models/stage1aExportRepository.ts` selects all 14
  Stage 1A tables (verified by `FROM` enumeration), mounted at
  `GET /api/v2/protocols/export` *before* the `/:protocolId` wildcard (a
  dedicated test guards the ordering). Deletion: every new table declares
  `user_id ... ON DELETE CASCADE` (verified in all six new-table
  migrations), so account deletion's existing cascade reaches them.
- **"Today remains usable with manual data and does not depend on health
  sync."** — **Still met** (unchanged from §1; `TodayScreen.test.tsx`).
- **"Owner approves Stage 1B entry."** — **Still the owner's to make.**

### 0.3 Honest gaps that remain (why the gate is *substantially*, not
*fully*, closed)

1. ~~**No in-app UI to *create* canonical Protocol Core objects.**~~
   **RESOLVED by S1A-27 (`14a87450`).** ProtocolScreen now has a progressive
   "Set up your protocol" section that wires the create hooks to real UI:
   `CreateProtocolForm` (creates the protocol + its draft v1),
   "Start baseline"/"Mark baseline complete" buttons, and
   `RecordEligibilityForm` (state + required basis). Combined with the
   pre-existing submit-for-review/activate/reject controls, a user can now
   drive the whole baseline → eligibility → activation chain in-app. Focused
   tests: CreateProtocolForm + RecordEligibilityForm 9/9. (The owner chose
   this "build in-app creation UI first" path over closing the gate at the
   data layer.) Remaining nuance: ProtocolItem authoring (linking specific
   medications into a version) still has no dedicated form — the schedule
   leg works via the existing S1A-20 linkage, so this is a refinement, not a
   chain blocker.
2. **No single end-to-end integration test** drives baseline → eligibility
   → activation → schedule → dose → inventory → symptom/safety → weekly
   review as one flow. Each leg is unit-tested in isolation (server
   route/repo + mobile hook/component). Evidence this session: **server
   118/118** across `protocolRoutes`, `safetyEventRoutes`,
   `biomarkerResultRoutes`, `medicationEntryRepository`, `medicationRoutes`;
   mobile hook/form/screen suites green for every touched surface.
3. **Migrations have never been applied to a live database in this
   environment.** No Postgres is reachable here and the server was never
   booted, so migration-checklist steps 3–5 are outstanding:
   `db_schema_backup.sql` does **not** yet contain the new tables (verified:
   0 matches), and **no shared `@workspace/shared` Zod schemas** exist for
   `Protocol`, `SafetyEvent`, `BiomarkerResult`, or the eligibility/baseline
   tables (verified: none in `shared/src/schemas/database/`). All server
   tests run against mocked clients / isolated test apps, so this gap is
   invisible to them. A real boot + `DB Backup.cmd` + shared-schema pass is
   required before this counts as production-applied.
4. **No on-device verification** (unchanged): no physical iOS/Android device
   access this cycle. §7–§8's manual and device checklists remain
   outstanding, now extended by the S1A-16..26 write paths.

### 0.4 Updated recommendation

The exit gate has moved from **"three legs missing, one with no backend"**
to **"all eight legs implemented at the data + API layer, four exit-gate
criteria newly met, with four honest gaps concentrated in (a) in-app
creation UI, (b) end-to-end/integration + on-device testing, and (c)
live-DB application of the migrations."** Whether that clears the gate is
the owner's call and turns on one question: **does "passes end to end"
require a user to complete the chain inside the app, or is
data-layer + API completeness sufficient with creation performed
administratively?** If the former, §0.3(1) is a required follow-up slice
before the gate closes. If the latter, the gate is substantially met and
the remaining work is verification (§0.3 2–4), not new features. The
§10 three-option framing still applies, but option 2's scope has now
largely been *built* — what is left of it is the in-app creation UI and the
verification passes, not the whole of Baseline/Eligibility/Activation/Safety.

## 1. Exit-gate criteria, checked one by one

`docs/ROADMAP.md`'s exact Stage 1A exit gate:

### "Baseline → eligibility → protocol activation → schedule → dose log → inventory update → symptom/safety event → weekly review passes end to end."

**Not met — and not currently testable, because three of the eight legs
don't exist as features yet:**

| Leg | Status |
|---|---|
| Baseline | **Not implemented.** `ProtocolScreen.tsx`'s "Baseline assessment" row is hardcoded `met={false}` with the literal text "No baseline evaluation has been recorded for a governed protocol" — there is no Baseline entity, form, or record anywhere in the codebase. |
| Eligibility | **Not implemented.** `EligibilityStatus` on Protocol is hardcoded `state="not_assessed"` with basis "No canonical Protocol version exists yet, so eligibility cannot be assessed against defined criteria." `ProtocolEligibilityAssessment` (canonical in `docs/DATA_MODEL.md`) has no backend table or route. |
| Protocol activation | **Not implemented.** `docs/DECISIONS.md`'s 2026-07-16 entry records this as a deliberate, approved deferral: "No canonical Protocol create/draft flow yet... manual protocol creation remains a later, separately approved slice." `Protocol`/`ProtocolVersion` have no backend table or route. |
| Schedule | **Real.** Read from `medication_schedules` via the existing Sparky medication domain. |
| Dose log | **Real, real write.** UX-08 — `createMedicationEntry`/`updateMedicationEntry` against the confirmed, unmodified `POST/PUT /api/v2/medications/entries` endpoints. |
| Inventory update | **Real, real write.** UX-09 completion — vial/pen creation against the confirmed `POST /api/v2/medications/:medicationId/pens` endpoint. |
| Symptom | **Real, real write.** UX-10 completion — symptom entries against the confirmed `POST /api/v2/symptoms/entries` endpoint. |
| Safety event | **Not implemented.** `SafetyEvent` (canonical in `docs/DATA_MODEL.md` — "first-class escalation record") has zero backend implementation: no migration, route, or model file matches `safety_event`/`SafetyEvent` anywhere in `SparkyFitnessServer`. |
| Weekly review | **Real.** UX-15 — real adherence numerator/denominator from actual schedule + dose-log data. |

**What actually exists today is a substitute chain**: *read existing
medication records as "tracked interventions" → schedule → dose log →
inventory → symptom → weekly review*, explicitly labeled in-product as "not
yet a governed Protocol" (`ProtocolScreen.tsx`'s limitations footnote). That
chain does work end-to-end at the UI/API layer (see §3, "what does pass").
The *canonical* Protocol Core chain the exit-gate criterion describes —
with a real Baseline, Eligibility assessment, and Protocol
activation — has three missing legs, none of which were in scope for any
UX-01–UX-15 slice (they were explicitly deferred, not overlooked).

### "Protocol edits create immutable versions; historical logs retain their version."

**Not applicable / not testable.** No `Protocol`/`ProtocolVersion` exists to
edit. This criterion cannot pass or fail until protocol activation (above)
is built.

### "Duplicate dose submissions are idempotent."

**Partially met, with a real gap.** The server has no unique constraint on
`medication_entries` for anything resembling `(schedule_id, entry_date)` —
confirmed by reading the migration's `CREATE TABLE medication_entries`
definition. The only protection against a duplicate submission is
client-side: `useLogDoseAction`'s mutation and the dose-action buttons
disable while `isPending`. This is the same standard every other mutation
in this codebase uses (e.g. `ServingAdjustSheet`'s Done button) — it is not
an isolated gap introduced by UX-08, but it also does not amount to true
idempotency: a network retry, a killed-and-relaunched app mid-submission, or
two devices signed into the same account could each independently create a
duplicate dose-log entry with no server-side rejection. Fixing this
properly needs either a server-side unique constraint (schema change, out
of this session's scope) or a client-generated idempotency key threaded
through the existing endpoint (`DoseLog.idempotency_key` is already named
in `docs/DATA_MODEL.md`, suggesting this was anticipated but not wired up).

### "Timezone, unit conversion, offline/retry, permission denial, and safety-event error paths are covered by tests."

**Partially met.** Timezone, unit conversion, offline/retry, and permission
denial are all covered by the pre-existing Sparky health-sync test suites
(`__tests__/services/healthconnect/`, `__tests__/services/healthkit/`,
`__tests__/services/shared/healthPermissionMigration.test.ts`, and related
files) — this coverage predates and is unrelated to this session's work,
and remains intact. **Safety-event error paths cannot be tested because
Safety Event Workflow does not exist** (see above).

### "Data export and account deletion cover all Stage 1A entities."

**Deletion passes; export fails**, verified by direct inspection of
`SparkyFitnessServer`:

- **Deletion**: `medications`, `medication_entries`, `medication_pens`, and
  `symptom_entries` (all four created by the same migration,
  `20260624000000_add_medication_glp1_schema.sql`) each declare
  `user_id ... ON DELETE CASCADE`. Account deletion
  (`routes/adminRoutes.ts` `DELETE /users/:userId` →
  `models/userRepository.ts` `deleteUser()`) deletes the `user` row and
  relies entirely on these cascades — which correctly removes all four
  tables' rows. This leg of the criterion is met.
- **Export**: **not met.** The only implemented user-facing data export is
  the nutrition/food diary CSV
  (`routes/foodEntryRoutes.ts` → `services/foodEntryService.ts`
  `exportAllDiaryEntriesToCSVStream()`), whose columns are nutrition-only.
  `routes/v2/medicationRoutes.ts` and `routes/v2/symptomRoutes.ts` have no
  `/export` route at all. Notably, the **cycle-tracking domain already has
  a working per-domain export pattern**
  (`routes/v2/cycleRoutes.ts` `GET /export`) that the medication/symptom
  domains could follow — this is a real, scoped, precedented gap, not a
  new pattern that would need to be invented from nothing. Implementing it
  is a backend change and therefore out of this session's standing
  "never touch backend" constraint; it is reported here, not fixed.

### "Today remains usable with manual data and does not depend on health sync."

**Met.** Verified directly: `TodayScreen.tsx` renders its full protocol
agenda, dose actions, and "Connection & freshness" state correctly with
`useServerConnection` connected but health-sync data absent or errored —
the offline/disconnected and read-error states are handled explicitly
(`AttentionBanner` for disconnected, inline error copy for health-read
failure), and none of the Protocol/dose-logging functionality depends on
`healthQuery` succeeding. Covered by this session's new
`__tests__/screens/TodayScreen.test.tsx`.

### "Owner approves Stage 1B entry."

**Not yet done** — this document exists to give the owner the basis for
that decision, not to make it.

## 2. Additional risks found during this review (not named directly in the
exit-gate text, but relevant to whether Stage 1A is production-ready)

- **The Health Connect "not initialized" read-spam bug** (fixed this
  session, commit `6b2dd592`) was a real production defect that would have
  affected every Android user whose background sync ran before the
  foreground app had ever called `initHealthConnect()` — plausible on a
  fresh install or after certain OS process-lifecycle events. Fixed and
  tested; flagged here because it's exactly the class of defect a "does
  the exit-gate flow actually work end-to-end" review is meant to catch,
  and it was caught by usage, not by this review.
- **The `ScheduledActionRow` accessibility bug** (fixed this session): dose
  action buttons ("Mark taken"/"Skip") were unreachable by VoiceOver/
  TalkBack because they were nested inside a single `accessible={true}`
  container with the row's summary text. This directly affects the "dose
  log" leg's actual completability for screen-reader users, and no
  automated test could have caught it (RN's testing library does not model
  native `accessible` subtree collapsing) — it needed the kind of manual
  device-based screen-reader pass listed in §6.
- **`TodayScreen.tsx` had zero dedicated test coverage** before this
  session, despite being the app's primary destination. Added this session
  (`__tests__/screens/TodayScreen.test.tsx`, 6 tests) but it is new and has
  not had the scrutiny of the rest of the test suite.

## 3. What does pass, to be clear about the baseline this review starts
from

UX-01 through UX-15 (including the UX-09/UX-10 real-write completions) are
implemented, tested, and were each individually verified with typecheck,
eslint, and focused + regression test passes before commit. The substitute
"tracked interventions" chain described in §1 does work end-to-end at the
UI/API layer: a user can see today's schedule, mark a dose taken or
skipped (writing a real, timestamped entry), log a vial/pen, log a
symptom, and see a real weekly adherence rollup — all against confirmed,
unmodified, already-existing backend endpoints, with honest state language
throughout and no fabricated data at any point. This is a materially
complete "manage your existing medication regimen" experience; it is not
yet a materially complete "governed Protocol Core" per the exit gate's own
definition of that term.

## 4. Technical debt

- Duplicate-dose-submission protection is client-only (§1). Root cause:
  no `idempotency_key` threading despite the field being named in
  `docs/DATA_MODEL.md`.
- No export route for the three new medication/symptom tables (§1),
  despite an existing precedent pattern in the cycle-tracking domain.
- `TodayScreen.tsx`'s `metricRows` array structure (five near-identical
  object literals differing mainly in loading/error derivation) could be
  extracted into a small builder function if a sixth metric is ever added —
  not urgent at five, flagged for the next person who adds one.

## 5. Health Connect readiness

Read/aggregate paths, fallback windowing, quota handling, and the
not-initialized short-circuit (this session's fix) are implemented and
unit-tested (77/77 in `__tests__/services/healthconnect/index.test.ts`).
**Not verified**: on-device behavior. This review, like every prior session
this cycle, had no physical Android device access. The specific scenario
to confirm on a real device: force a background sync before ever opening
the app's Sync/connect screen in that process lifetime, and confirm the
fix produces one calm warning instead of the previously reported hundreds
of repeated error logs.

## 6. Backend readiness

Confirmed real and unmodified this session: `medication_entries` (create/
update), `medication_pens` (create), `symptom_entries` (create), all under
`/api/v2/`. Confirmed **not** implemented anywhere in the backend:
`Protocol`, `ProtocolVersion`, `ProtocolEligibilityAssessment`,
`SafetyEvent`, `Compound`, `CompoundMonograph`, `EvidenceReference`,
`BiomarkerResult` — all canonical in `docs/DATA_MODEL.md`, none built. No
export route exists for the three new medication/symptom tables (§1).

## 7. Manual testing checklist (for the owner, not run by this review)

- [ ] Mark a dose taken, then skipped, then taken again on the same
      scheduled dose — confirm each write lands as a new, real, correctly
      timestamped entry with no data loss.
- [ ] Log a vial/pen with only one field filled (this session's fix
      requires at least one) and confirm the Save button's disabled state
      matches expectation.
- [ ] Log a symptom with severity ≥ 7 and confirm the high-severity
      attention banner appears with the "not a diagnosis" disclaimer.
- [ ] Disconnect the server mid-session on Today, Protocol, and
      Biomarkers — confirm each screen's disconnected/retry state (the
      Biomarkers Retry buttons are new this session).
- [ ] Double-tap "Mark taken" as fast as physically possible and check the
      server for a duplicate `medication_entries` row (§1's idempotency
      gap — this is the manual check standing in for the missing
      automated/server-side guarantee).

## 8. Device testing checklist

- [ ] VoiceOver (iOS) and TalkBack (Android): reach and activate "Mark
      taken"/"Skip" on a due dose (verifies this session's accessibility
      fix under real assistive technology, not just the structural test).
- [ ] Android background sync: reproduce the original Health Connect
      "not initialized" log spam scenario per §5, confirm the fix.
- [ ] iOS and Android: confirm Today, Protocol, Biomarkers, Track, and
      Library all open without the native-tabs-context crash (the very
      first fix of this multi-session cycle, commit `74a79ed5` — still
      never confirmed on-device per every prior handoff).

## 9. Release readiness

**Not release-ready as a "Protocol Core" product** in the sense
`docs/ROADMAP.md` defines it — see §1's Baseline/Eligibility/Protocol-
activation/Safety-event gaps. **Is release-ready as a "manage your existing
medication regimen" feature set** (§3) for a build that is explicit about
not yet being a governed protocol system, which is exactly what the
in-product copy already says today (`ProtocolScreen.tsx`'s limitations
footnote, `LibraryShellScreen.tsx`'s "not built yet" states). Whether that
distinction is acceptable to ship is a product decision, not a technical
one — this review surfaces it rather than deciding it.

## 10. Stage 1B prerequisites

Per `docs/ROADMAP.md`, Stage 1B (Health Sync experience) requires Stage 1A's
exit gate to formally pass, which requires the owner to decide how to
treat §1's three gaps:

1. Accept the current "tracked interventions" substitute as sufficient for
   Stage 1A's spirit and formally close the gate as-is, or
2. Authorize the Baseline/Eligibility/Protocol-activation/Safety-event work
   as additional Stage 1A scope before closing the gate, or
3. Split the difference — close Stage 1A on the substitute chain now, and
   schedule Baseline/Eligibility/Protocol-activation/Safety-event as a
   named Stage 1A.5 or early-Stage-1B-adjacent slice.

None of these is this review's call to make.

## 11. Explicit recommendation

**Stage 1B is not yet ready to start**, not because of any defect in the
Health Sync groundwork itself, but because Stage 1A's own exit gate has not
formally passed — three of its eight named legs (Baseline, Eligibility,
Protocol activation) don't exist as implemented features, one more
(Safety Event Workflow) has zero backend support, and one exit-gate item
(data export) has a concrete, scoped, unmet gap. Recommend the owner choose
one of §10's three options before Stage 1B implementation work begins,
rather than proceeding on the assumption that Stage 1A is complete because
UX-01–UX-15 are.
