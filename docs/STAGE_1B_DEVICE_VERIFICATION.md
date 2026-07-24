# Stage 1B device verification (S1B-08)

Date: 2026-07-17. Scope: the manual, physical-device verification checklist
for Stage 1B Health Sync (S1B-01 through S1B-07), matching
`docs/ROADMAP.md`'s Stage 1B exit gate: "Permission → read → normalize →
aggregate → persist → review passes on real supported iOS and Android
devices."

**Status: not run.** No physical iOS or Android device was available in the
environment that implemented S1B-01–S1B-07. Every item below is a checklist
for the next session (or the owner) with real device access — none of it has
been executed, and this document makes no claim that it has. What **is**
verified, and how, is listed in §0.

## 0. What is already verified (automated, no device required)

Every state-derivation, error-classification, and outcome-recording code
path exercised by the scenarios below already has a passing automated test,
run in this environment without a device:

| Area | Test file | Verifies |
|---|---|---|
| Health-store init failure short-circuit | `__tests__/services/backgroundSyncService.test.ts` | No reads begin, one calm warning, retry cursor preserved (S1B-01) |
| Source/permission/sync/freshness/coverage state model | `__tests__/services/shared/healthSourceState.test.ts` | Every `ConnectionStatus` transition, Android observable vs. iOS unobservable permission handling, freshness threshold boundary (S1B-02) |
| Platform permission adapters | `__tests__/services/healthSourceStateAdapter.test.ts` | Android's real `getGrantedPermissions()` query mapping (granted/denied/multi-permission/query-failure), iOS's honest unobservable shape (S1B-03) |
| `useHealthSourceState` hook | `__tests__/hooks/useHealthSourceState.test.ts` | Combines platform facts into the model correctly, live `isSyncing` override, error handling (S1B-03) |
| Health Sync home screen | `__tests__/screens/HealthSyncHomeScreen.test.tsx` | Every state renders the right honest copy and actions (S1B-03/S1B-06) |
| Manual/device measurement provenance | `__tests__/components/MeasurementsSummary.test.tsx` | "Manual entry" caption shown/hidden correctly (S1B-04) |
| Weight conflict detection | `__tests__/utils/measurementConflict.test.ts`, `__tests__/screens/BiomarkersScreen.test.tsx` | Conflict flagged/not flagged at the tolerance boundary, never fabricated from an unparseable value (S1B-05) |
| Network-error classification | `__tests__/utils/networkErrorClassification.test.ts` | Every recognized offline signature, every non-network error correctly *not* classified as offline (S1B-06) |
| Sync outcome recording, including upload failure | `__tests__/services/backgroundSyncService.test.ts` | `completed`/`partial`/`failed` + `isOffline` recorded correctly at every exit path, including the previously-uncaught upload-failure path (S1B-06) |
| Biomarkers → Health Sync navigation | `__tests__/screens/BiomarkersScreen.test.tsx` | Entry row navigates correctly (S1B-07) |

This closes the gap between "the logic is right" and "it behaves correctly
on a real device" — the former is verified; the latter is what remains.

## 1. Device matrix

| Platform | OS version | Health store | Priority |
|---|---|---|---|
| Android | Latest stable (currently Android 15/16) | Health Connect (in-OS on 14+, separate app on 13/below) | Required |
| Android | Minimum supported per `app.config.ts` | Health Connect | Required |
| iOS | Latest stable (currently iOS 18/26) | HealthKit (Apple Health app) | Required |
| iOS | Minimum supported per `app.config.ts` | HealthKit | Required |

Use a real device for both platforms where possible — simulators/emulators
cannot exercise real OS-level health-store permission dialogs, background
task scheduling limits, or genuine network-loss conditions.

## 2. Android scenarios

For each: state the expected `ConnectionStatus`/`lastOutcome` per
`src/services/shared/healthSourceState.ts`, and confirm the Health Sync home
screen (`HealthSyncHomeScreen`) shows it.

1. **Fresh process, background sync before opening the Sync screen.**
   Force-stop the app. Trigger the background task (Android:
   `adb shell cmd jobscheduler run -f <package> <job-id>`, or wait for the
   real scheduler) without ever opening the app in the foreground first.
   Expect: no repeated error log spam (the original `6b2dd592` defect), the
   sync either succeeds (if permissions were already granted from a prior
   session) or short-circuits calmly per S1B-01, and `lastSyncOutcome` is
   `completed` or `failed` — never left stale from a crash.
2. **Health Connect unavailable** (not installed, or device doesn't support
   it). Expect: `connection: 'unsupported'`, the honest "Health Connect is
   not available" state, `Sync now` disabled, and Today/Protocol/Track/
   Biomarkers manual flows remain fully usable.
3. **Health Connect available but not configured** (installed, zero
   permissions ever requested). Expect: `connection: 'disconnected'` (if no
   metrics enabled) or `permission_required` (if metrics are enabled but
   never requested).
4. **Permission not requested.** Enable a metric in Settings → Health Sync
   → toggle a metric on, but cancel the OS permission dialog. Expect: the
   metric preference reverts to off (existing `SyncScreen` behavior) and
   `connection` stays `permission_required`.
5. **Partial permissions.** Grant read access to some metrics, deny others,
   via the real Health Connect permission screen. Expect:
   `connection: 'partial'`, `readableMetricCount < enabledMetricCount`, and
   the denied metric(s) appear in `permission.deniedMetricIds`.
6. **Permission revoked after connection.** With all enabled metrics
   granted (`connection: 'ready'`), revoke one via Android Settings →
   Health Connect → App permissions, without touching the app. Return to
   the app and refresh (pull-to-refresh or refocus). Expect:
   `connection: 'revoked'` — verifies real revocation detection
   (`previouslyGrantedMetricIds`), not just a fresh `partial` read.
7. **Successful read.** Full permissions, real device/manually-entered
   Health Connect data present for the sync window. Expect: `completed`
   outcome, `freshness: 'fresh'`, `coverage: 'complete'`, real values
   visible on Today/Biomarkers with `healthSourceName` provenance.
8. **No samples.** Full permissions, but no data recorded in Health Connect
   for the window (e.g. a fresh Health Connect install with permissions
   granted but no data ever written). Expect: `completed` outcome (a real,
   successful sync of zero records is not a failure), `coverage: 'none'` —
   never interpreted as denied permission or a hidden error.
9. **Background sync.** Enable background sync in Settings, background the
   app for several hours, confirm a sync ran via Logs (`LogScreen`) and
   `lastSyncedTime` advanced, without the user opening the app.
10. **Offline and retry.** Enable airplane mode, trigger a manual sync.
    Expect: `lastOutcome: 'offline_deferred'`, the "Offline — queued for
    retry" label on Health Sync home, `lastSyncedTime` cursor unchanged.
    Disable airplane mode, sync again — expect a normal `completed` outcome
    from the *same* unadvanced cursor (no data gap).
11. **Duplicate prevention.** Trigger two manual syncs back to back (or a
    manual sync immediately after a background sync completed). Confirm no
    duplicate records appear server-side (check the SparkyFitness web/API
    diary or measurement history for the synced day) and no duplicate
    upload logs.
12. **Reinstall / process restart.** Uninstall and reinstall the app (or
    force-stop and cold-start). Confirm `lastSyncedTime`/`lastSyncOutcome`
    correctly reset to "never" (fresh install) or correctly persist (simple
    process restart, not uninstall) — AsyncStorage semantics differ between
    the two; confirm the app doesn't crash or show stale data either way.

## 3. iOS scenarios

1. **HealthKit unavailable** (e.g. unsupported device class, or Health app
   restricted by parental controls). Expect: `connection: 'unsupported'`,
   same honest unavailable state as Android's equivalent.
2. **Permission request.** Enable a metric; confirm the real iOS HealthKit
   permission sheet appears with the correct metric names, and that
   accepting sets `permission.requestedAtLeastOnce: true`.
3. **Partial selection.** In the HealthKit permission sheet, grant some
   requested types and deny others (a real per-type toggle list). Confirm
   the app does **not** claim to know which were denied — `visibility`
   stays `'unobservable'` throughout; only sync outcome/coverage may reflect
   the practical effect (some metrics silently return no data).
4. **No samples, without falsely claiming denial.** Grant permission for a
   metric with no actual data in Apple Health (e.g. a metric type never
   populated by any app or device). Expect: `coverage` reflects
   never-synced/partial as appropriate, but `connection` never reports
   `'revoked'` or any denial-implying state — this is the critical iOS rule
   (`docs/DATA_MODEL.md`-adjacent honesty requirement) under real HealthKit
   behavior, not just the unit-tested model.
5. **Successful read.** Grant permission, ensure real data exists (log a
   manual entry in Apple Health, or use a paired device/simulABLE data
   source). Expect: `completed` outcome, values visible with correct
   provenance.
6. **Permission changes.** Go to iOS Settings → Health → Data Access &
   Devices → [app] and revoke a previously granted permission. Return to
   the app. Expect: since iOS permission state is fundamentally
   unobservable, the app should **not** claim to detect this — confirm it
   does not falsely continue reporting `'ready'`/`'connected'` with stale
   confidence; instead confirm coverage/freshness degrade honestly as
   reads silently stop returning that metric's data. This is the sharpest
   edge of the iOS platform limitation — document exactly what the user
   sees, since it cannot be "fixed" without an OS-level API that doesn't
   exist.
7. **Background/foreground lifecycle.** Background the app during an
   active sync (or trigger a background refresh via Xcode's "Simulate
   Background Fetch" on a real device, if available). Confirm no crash, no
   partial/corrupt write, and the sync either completes or cleanly defers
   to the next cycle.
8. **Offline and retry.** Same as Android scenario 10, using iOS airplane
   mode.
9. **Freshness/coverage behavior.** Let `lastSyncedTime` age past 24h
   (the `FRESHNESS_STALE_AFTER_MS` threshold) without syncing. Confirm
   `freshness: 'stale'` appears correctly on Health Sync home.

## 4. Both platforms

1. **Today remains usable.** With the health store fully disconnected/
   unsupported/erroring, confirm Today's protocol agenda, dose logging,
   and manual observations all work normally — per `docs/ROADMAP.md`'s
   Stage 1B exit gate, "Protocol Core remains functional when sync is
   unavailable."
2. **Biomarkers remains honest.** Confirm Biomarkers never shows a
   fabricated value, never silently hides the "Health Sync" entry row, and
   the conflict note (S1B-05) appears only when both a real manual and a
   real device value exist and genuinely disagree.
3. **Track/manual logging remains usable.** Confirm measurement entry,
   symptom logging, and dose logging all work with the health store fully
   disconnected.
4. **VoiceOver (iOS) / TalkBack (Android).** Navigate Health Sync home and
   the Connection card end to end using only the screen reader. Confirm
   every `FactRow`, action button, and `PurposefulState` card has a correct,
   complete accessible label (all already use `accessibilityLabel`/
   `accessible` in source — confirm it reads naturally aloud, not just that
   it's present).
5. **Light/dark mode.** Toggle the app theme (Light/Dark/AMOLED) while on
   Health Sync home and Biomarkers' new entry row/conflict note; confirm
   contrast and legibility in all three.
6. **Large text.** Enable the largest OS-supported dynamic type / font
   scale setting. Confirm `FactRow` labels/values and `PurposefulState`
   copy wrap without clipping or overlap.
7. **Reduced motion.** Enable "Reduce Motion" (iOS) / "Remove animations"
   (Android). Confirm no reliance on motion-only affordances for the new
   screens (none were added, but confirm as part of the pass).
8. **Error recovery.** From every honest error/unsupported/offline state on
   Health Sync home, confirm the offered action (Retry, Manage permissions,
   Sync now) actually resolves the state when the underlying condition is
   fixed (e.g. re-enabling network, granting permission) — no dead-end
   requiring an app restart.

## 5. Reporting the result

When this checklist is run, record pass/fail per numbered item (not just an
overall verdict) in a dated addendum to this file or in `docs/HANDOFF.md`,
naming the exact device/OS version used for each platform. A partial pass
(e.g. Android complete, iOS blocked by no test device) is a valid, honest
outcome — report it as such rather than waiting for full completion to
report anything.

## 6. Addendum — 2026-07-17, real Android device bug reports (Claude, no device access)

Two real defects were reported from an actual physical Android run (the
owner's device, outside this environment — this session had no device or
emulator access; every fix below is verified by code inspection and
automated regression tests only, **not** by re-running on the device that
surfaced them). Both are now fixed on `overnight/aeterna-product-integration`
and require a rebuild before the owner can confirm on-device.

### A. ElevationGained permission mismatch and log storm — FIXED, not device-reverified

**Root cause (proven in code, `SparkyFitnessMobile/src/services/healthconnect/index.ts`):**
`readHealthRecordsDetailed`'s fallback cascade (`readHealthRecordsFallback`)
was designed to recover from transient/data-volume read failures by
retrying in progressively smaller day/hour windows. It had no special case
for a deterministic Health Connect `SecurityException` ("Caller does not
have permission to read ElevationGainedRecord from other applications"),
unlike the existing `isClientNotInitializedError`/`isQuotaExceededError`
short-circuits. A 2-day sync window split into 2 day-windows, each
re-splitting into 24 hourly windows on the identical permission failure —
48 native calls and 48 `ERROR` log lines for one stable condition, matching
the observed log storm exactly. Separately, `requestHealthPermissions`
computed "all granted" purely from `requestPermission()`'s own response,
never cross-checked against the authoritative `getGrantedPermissions()`
query — so the app could report "All 35 metric permissions granted" while
Health Connect's read-time enforcement still denied one record type.

**Whether the manifest is missing the permission:** No. Both
`app.config.ts` and the compiled `android/app/src/main/AndroidManifest.xml`
already declare `android.permission.health.READ_ELEVATION_GAINED` (has for
some time — `git blame` traces it to a January commit, not something added
this pass). The mismatch is between what the OS reports as granted at
request-time and what it actually enforces at read-time — a real,
observed Health Connect behavior this fix now handles honestly rather than
trusting blindly.

**Fix:** `isPermissionDeniedError` classifier added alongside the existing
not-initialized/quota classifiers; a deterministic permission denial now
short-circuits the fallback cascade after exactly one native call, logs one
`WARNING` (not `ERROR`) per metric per sync run, and never blocks other
metrics' reads. `requestHealthPermissions` now cross-checks
`getGrantedPermissions()` before ever reporting a full grant. 9 new
regression tests in `__tests__/services/healthconnect/index.test.ts` (log
storm elimination, one-warning-not-48, other metrics unaffected, false-grant
regression, empty-read-not-denial). **Not verified on the device that
reported it** — requires a rebuild (native permission/manifest state is
baked into the installed APK, not hot-reloadable) and a fresh manual sync to
confirm the SecurityException and log storm are actually gone in practice.

### B. JSON Parse error: "Unexpected character: <" — FIXED, not device-reverified

**Root cause (proven in code):** `apiFetch` (`apiClient.ts`) and
`healthDataApi.ts`'s `syncHealthData` upload path both called
`response.json()` unconditionally on any 2xx response, with no
Content-Type or body-shape check. Any 2xx response with an HTML body
(wrong server URL, a request landing on Metro's dev server instead of the
Express backend, a reverse proxy's login/fallback page, a captive portal)
threw an opaque `SyntaxError: Unexpected character: <` instead of a
diagnosable error — reproducing across every endpoint that uses these
shared clients, exactly matching the reported spread (Preferences,
timezone bootstrap, Health Sync upload, Medications, Daily Summary,
Measurements, Symptoms all route through one of these two functions).

**Effective API URL / server reachability:** Not determinable from this
environment — the configured server URL is user-entered, persisted on the
device (AsyncStorage/SecureStore), and this session has no device access to
inspect it. No hardcoded wrong URL exists anywhere in the mobile
repository (`app.config.ts`, onboarding defaults, storage helpers) —
confirmed by grep; there is no repository-config bug to fix. The correct
backend port is **3010** (`docker/.env.example`'s
`SPARKY_FITNESS_SERVER_PORT=3010`), not Metro's dev-server port (8083, the
port this session observed a live `expo start` process using). The owner
should confirm, in the app's Settings → Server screen, that the configured
URL points at the SparkyFitness Express server on port 3010 (or its
production/LAN equivalent), not at a Metro/bundler URL.

**Fix:** new `parseJsonResponse<T>()` (`src/services/api/errors.ts`)
replaces every bare `response.json()` call in `apiClient.ts` and
`healthDataApi.ts`. Reads the body as text, attempts `JSON.parse`
regardless of Content-Type (so a real success is never rejected on a
missing/mislabeled header), and on genuine failure throws one structured,
secret-free `ApiError` (endpoint, status, content-type, HTML/empty/non-JSON
classification, ≤200-char body preview) marked `nonJsonResponse: true`.
`queryClient.ts`'s retry predicate now treats that marker as
non-retryable regardless of status code, so a misrouted request fails once
per query instead of 3x. 21 new/updated regression tests across
`errors.test.ts`, `apiClient.test.ts` (both), `healthDataApi.test.ts`, and
`queryClient.test.ts`. **Not verified on the device that reported it** —
this fix makes the failure mode diagnosable and non-repeating; it cannot
fix an actually-wrong URL or an unreachable backend, which remain
device/environment facts only the owner can confirm.
