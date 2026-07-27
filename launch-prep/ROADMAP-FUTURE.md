# ÆTERNA — Future Roadmap (master plan)

**Compiled:** 26 July 2026
**Scope:** everything not yet in the active 5-phase roadmap
(`docs/DECISIONS.md` 2026-07-25 "Vision re-anchored") — deferred vision
pillars, product maturity, and candidate new features. All in one place so
the owner can prioritize without me (or any agent) re-planning each time.

This document is **deliberately honest about what exists** (per the 2026-07-26
surface audit) so we don't propose building things that are already built.

---

## Where we are today (verified 2026-07-26)

### Already built (don't rebuild)
- **6 tabs, ~60 screens**: Today, Protocol, Biomarkers, Track, Library,
  Community — full surface, not a stub.
- **7 peptide calculators**: Reconstitution, Half-life, Interactions,
  Dose/Unit, Accumulation, Blend/Stack, Cost.
- **Compound library**: 174 compounds + monographs + Body Atlas.
- **Protocol builder + 6 templates** (Wolverine, healing, GLP-1, anti-aging,
  cognitive, sleep).
- **Dose/injection tracking** with site rotation + vial inventory.
- **Labs**: PDF/CSV import, longitudinal biomarker trends.
- **Discourse-backed Community** (Study Club) — real, not mock.
- **HealthKit / Health Connect** sync (sleep, HRV, RHR, steps, workouts,
  weight) — verified working.
- **5 wearable OAuth integrations**: Withings, Fitbit, Garmin, Polar, Strava
  (+ Google Health, Hevy).
- **Auth**: email/pass, MFA (TOTP+email), Passkey, API key, OIDC SSO.
- **Offline-first**: bundled content + SQLite primary writes (Faz 1.2 done).
- **AEON AI** (BYOK or admin-configured, self-hostable).
- **Protocol→Response** for weight/waist (Faz 1 widens to sleep/HRV/lab).
- **Shared design system**: `components/aeterna/*` + `theme/aeternaTokens`
  + `PurposefulState` (empty/loading/error used in 23 screens) + per-screen
  error boundaries.

### Already planned (active 5-phase roadmap — not re-planned here)
- Faz 1: Protocol→Response engine (sleep/HRV/lab deltas).
- Faz 2: Today interpretation + Stack pathway intelligence.
- Faz 3: AEON correlation AI (server-side user-context).
- Faz 4: N=1 experiment scoring + biological events.
- Faz 5 (optional): WHOOP/Oura OAuth + Lab PDF OCR.

---

## Part A — Deferred vision pillars (extend the 5-phase roadmap)

These are owner-named pillars currently sitting in Phase 4+ or out-of-scope.
Each has clear scope so an agent can pick it up.

### A1. LEGO Protocol Builder (vision pillar #8)
**Today:** `ProtocolBuilderScreen.tsx` is a 4-step wizard (Goal → Items →
Monitoring → Review). Functional but linear, not modular.
**Vision:** drag-and-drop protocol assembly. Pick "fat loss" module, drop
"recovery" module, ÆTERNA shows the combined focus profile
(metabolic + recovery) and flags pathway overlap in real time.
**Build:**
- New `ProtocolBuilderLegoScreen.tsx` (or upgrade existing) using
  `react-native-draggable-flatlist` or `@shopify/reorder-list`.
- Module library = the existing 6 templates decomposed into stackable
  sub-protocols (extract from `protocolTemplates.json`).
- Live stack preview reuses Faz 2's `useStackIntelligence` pathway bars.
- Conflict detection reuses Faz 2's duplicate-pathway alert.
**Depends on:** Faz 2 (pathway model) for the live preview.
**Effort:** Medium (~3-4 days).

### A2. Biological Events timeline (vision pillar #9)
**Today:** `ResponseTimelineScreen.tsx` joins biomarkers + protocol changes
+ symptoms + safety events. No "life context" events (illness, injury,
travel, stress, program change, lab test).
**Vision:** user logs "got sick 14-17 July" / "travel to altitude" /
"started new training program" — these overlay on every chart so the
"what changed" interpretation accounts for confounders.
**Build:**
- New table `biological_event` (id, user_id, type, label, start_date,
  end_date, notes, source). Types: `illness | injury | travel | stress |
  protocol_change | dose_change | lab_test | sleep_disruption | other`.
- New `EventFormScreen` + list/edit on a Timeline entry point.
- Extend `utils/responseTimeline.ts` `deriveResponseTimeline` to include
  `biological_event` rows.
- Faz 1's protocol-response delta grid shows events as vertical bands on
  the before/after chart, with a "events during window" disclosure.
**Depends on:** nothing (independent). Pairs well with Faz 4.
**Effort:** Small-Medium (~2-3 days).

### A3. Lab OCR Scanner (vision pillar #10)
**Today:** `LabImportScreen.tsx` accepts PDF/CSV upload + manual entry. PDF
path extracts via server-side text layer (when present); scanned image PDFs
fail. `tesseract.js` and `pdfjs-dist` are already server deps (Apache-2.0).
**Vision:** photograph a paper lab report → OCR → structured biomarker rows
→ user confirms → saved to biomarker_results.
**Build:**
- Mobile: new `LabScanScreen.tsx` using `expo-camera` + `expo-image-picker`.
- Server: extend `importLabPdf` route to accept JPEG/PNG, run
  `tesseract.js` (Turkish + English traineddata), pass the extracted text
  to the LLM provider (when configured) with a structured-output prompt to
  extract `{biomarker_name, value, unit, reference_range, observed_at}`.
- Critical safety: every extracted row lands as `import_state='draft'` and
  requires explicit user confirmation before becoming a confirmed result.
  No silent OCR confidence → confirmed status.
**Depends on:** AEON provider configured (or a generic OCR + regex fallback
when no LLM).
**Effort:** Medium (~4-5 days; OCR accuracy tuning is the long pole).

### A4. Community Protocol Logs (vision pillar #12)
**Today:** Community = Discourse forum (topic/reply/like/report) + per-
compound `PeptideCommunity`/`SubmitFindings`. It's a forum, not a
structured experience log.
**Vision:** anonymous structured logs — "compound / goal / duration /
baseline / response / subjective" — searchable, filterable. The owner
explicitly does NOT want an Instagram-style social feed.
**Build:**
- New Discourse category `protocol-logs` with a structured topic template
  (title format + body JSON in a code block).
- New `ProtocolLogComposerScreen` that fills the template, posts via the
  existing Discourse proxy.
- New `ProtocolLogLibraryScreen` that lists/filters logs by compound / goal
  / outcome. Server-side parsing of the JSON code block.
- Anonymity: posting uses the existing community identity (already
  shared/pseudonymous modes in `TopicListScreen`).
**Depends on:** nothing.
**Effort:** Medium (~3 days).

### A5. Wearable: WHOOP and Oura (vision, deferred to Phase 5)
**Today:** zero code. HealthKit/Health Connect covers sleep + HRV + RHR +
workouts, which is the actual data we need.
**Vision:** native WHOOP recovery/strain/cycle and Oura readiness/sleep
stages, for users on those devices.
**Build:**
- New `integrations/whoop/` + `integrations/oura/` (OAuth2, mirroring
  Withings/Fitbit services).
- WHOOP API: `/v1/recovery`, `/v1/cycle`, `/v1/profile`.
- Oura API v2: `/v2/usercollection/daily_activity`, `.../sleep`,
  `.../readiness`, `.../sleep/{id}`.
- Normalize into existing `sleep_entries` (sleep) + `custom_measurements`
  (HRV/recovery) with a new `recovery_score` column on sleep_entries for
  WHOOP/Oura composite.
- Cron-driven periodic sync, gated by `is_active` (matches existing
  wearable pattern).
**Decision point:** only build if a meaningful user base actually has these
devices. Until then, HealthKit/HC + our own recovery computation (Faz 2)
covers the same need. **Recommend defer until post-launch signal.**
**Effort:** Large (~5-7 days per provider; OAuth + token refresh +
re-auth flows + data-shape quirks).

---

## Part B — Product maturity (make the existing app excellent)

These don't add features — they make what exists feel premium and reliable.
A user notices their absence more than they notice a new feature.

### B1. Onboarding wizard (HIGH user impact)
**Today:** `OnboardingScreen.tsx` is 2 pages of auth (or skip to
local-only). New users land cold into a dense Protocol/Today surface with
no goals captured.
**Build:** optional 4-step wizard after first launch:
1. **What brings you here?** (recovery / fat loss / cognitive / longevity /
   athletic / general → seeds initial compound recommendations and Today
   focus).
2. **What are you currently tracking?** (peptides / TRT / supplements /
   labs / sleep / training → seeds empty Today modules).
3. **Connect a health source** (Apple Health / Health Connect now or
   later).
4. **(Optional) Start from a template** (the 6 templates as quick-start).
All skippable; result stored as `onboarding_profile` JSON in storage. No
account required.
**Effort:** Medium (~3 days).

### B2. Full account data export (privacy compliance)
**Today:** only a diagnostic report (no health data) is exportable.
**Build:** `GET /api/v2/account/export` (mentioned as still-open in
DECISIONS 2026-07-18) returns a ZIP of all the user's records as JSON+CSV,
plus a `POST /api/v2/account/export/run` for async generation. Mobile
"Export my data" in Settings → share sheet.
**Required by:** Privacy Policy §6 "Portability" promise + KVKK/GDPR.
**Effort:** Small-Medium (~2 days).

### B3. Internationalization (Turkish + English)
**Today:** all strings hardcoded English. Owner is Turkish; TR is a real
market.
**Build:**
- Add `i18next` + `react-i18next` (MIT).
- Extract strings into `src/locales/en.json` + `src/locales/tr.json` (use
  `i18n-scanner` for the extraction).
- Wrap with `useTranslation` — one pass per screen.
- Device-locale detection on first launch; manual override in Settings.
- The Privacy Policy, Terms, and store listing already have TR summaries.
**Effort:** Medium-Large (~5-7 days; mostly extraction + translation, not
the framework).

### B4. Accessibility hardening (WCAG 2.1 AA)
**Today:** 355 `accessibilityLabel` / 184 `accessibilityRole` but only 3
`accessibilityHint`. Charts and data viz have no spoken summaries.
**Build:**
- Sweep: add `accessibilityHint` to interactive rows.
- Chart spoken-summary: every trend chart gets a hidden
  `accessibilityLabel` like "HRV trend, 30 days, rose from 42 to 51".
- VoiceOver/TalkBack pass on the 5 core flows (Today, log dose, log lab,
  view biomarker trend, AEON chat).
- Color contrast audit against `aeternaTokens`.
**Effort:** Medium (~3-4 days).

### B5. Crash-free + performance budget
**Today:** no crash reporting (consistent with no-tracking), no perf budget.
**Build:**
- Optional, **opt-in**, self-hosted crash reporting (e.g. self-hosted
  Sentry or a minimal in-app log dump the user can email). Must respect
  the no-tracking promise — opt-in only, no PII, no auto-upload.
- Performance budget: TTI < 2s on cold start on mid-range Android; flat
  list recycling on long logs; React Query `select` to minimize re-renders.
- E2E smoke test (Maestro or Detox) covering the 5 core flows on iOS+
  Android.
**Effort:** Medium (~4 days).

### B6. Conflict resolution UI
**Today:** server `dataConflictsApi` + `useDataConflict` hook exist and are
wired to no screen. Conflicts get detected server-side but the user can't
see/resolve them.
**Build:** `DataConflictScreen.tsx` listing open conflicts per entity, with
"keep local / keep server / keep both" actions. Reuse `PurposefulState`
for empty/error.
**Required by:** SQLite outbox sync will eventually produce conflicts; users
need a way to resolve.
**Effort:** Small-Medium (~2 days).

### B7. SQLite encryption at rest
**Today:** `aeterna.db` is plaintext (SECURITY-AUDIT §1, Medium).
**Build:** enable SQLCipher via `expo-sqlite` with a per-user encryption
key stored in SecureStore. Migration path for existing plaintext DBs
(one-time re-key on first launch post-upgrade).
**Required by:** closes a SECURITY-AUDIT finding.
**Effort:** Medium (~3 days, including migration testing).

---

## Part C — Candidate new features (only if aligned with the vision)

Each evaluated against the "free, private, no ads, understand-more-not-
track-more" product identity. **Recommendations are conservative** — most
of these are NOT recommended; included so the owner can decide with eyes
open.

### C1. Personal insights digest (weekly)
**Recommended.** Aligns with the vision.
- Once a week, AEON (or a deterministic rules engine when no AI configured)
  generates a 3-line digest: "this week's strongest change", "what to
  watch", "one nudge".
- Push notification (opt-in) + read in Today.
- Deterministic fallback (no AI) keeps it private and free.
**Effort:** Small (~2 days).

### C2. Compound re-order reminders + auto-cycle detection
**Recommended.** Already half-built (`MedicationSchedule` has
days_of_week/interval/cycle fields).
- Surface "your BPC-157 vial runs out in ~5 days at current dose".
- Auto-detect cycle end and prompt re-order/log.
**Effort:** Small (~2 days).

### C3. Compound lot tracking + reconstitution date
**Neutral.** Useful for serious self-experimenters.
- Extend `MedicationPen` with `lot_number`, `reconstituted_at`,
  `expires_at`.
- Warn when a reconstituted vial passes its stability window (real
  reference data, not fabricated).
**Effort:** Small (~1-2 days).

### C4. Caregiver / delegate dashboard (already-built server-side)
**Neutral.** Server has full caregiver/delegate infra (delegate perms,
`onBehalfOfMiddleware`). Mobile doesn't surface it.
- Mobile: switch-active-user flow for parents/coaches.
- Only build if there's actual demand.
**Effort:** Small (~2 days).

### C5. Editorial content feed
**NOT recommended.** Conflicts with the "no tracking, no engagement
farming" identity. The Guides are already source-grounded reference pages;
that's enough.
**If pursued anyway:** self-hosted markdown, no recommendations algorithm,
no personalization signals, opt-in.

### C6. Gamification (streaks, badges, XP)
**NOT recommended.** Will push users to log for the wrong reasons; corrupts
the "honest n=1 science" stance. Hard no from a product-identity view.

### C7. Premium / subscription tier
**NOT recommended.** Violates the explicit "free, forever, no paywall"
promise. The owner has stated this repeatedly. If ever reconsidered, it
must be a transparent "support the project" donation, never gated
features.

### C8. Compound / supplier marketplace
**NOT recommended.** Legal exposure (prescription compounds vary by
jurisdiction), conflicts with the "informational, not a store" stance.

### C9. Telehealth / coach booking
**NOT recommended.** Different business, different liability, different
app. The protocol-response engine can print a "share with your physician"
summary instead — that's the right scope.

### C10. Social feed / follow graph / DMs
**NOT recommended.** Owner explicitly does not want Instagram-style social.
The Study Club protocol logs (A4) cover the legitimate community need.

### C11. AI image analysis (meal photo → macros, physique photo → change)
**Maybe.** `FoodPhotoEstimateReviewScreen` already exists for meals; could
extend to periodic physique photos with privacy-preserving on-device or
BYOK analysis. Useful but only if the AI provider is configured.
**Effort:** Medium (~3-4 days).

---

## Recommended priority order (next 3-6 months)

### Tier 0 — close before public release
(already in `RELEASE-BLOCKERS.md` — uploads auth, CC BY attribution,
SparkyFitness permission, license choice)

### Tier 1 — pair with the active 5-phase roadmap
These amplify the 5-phase work or fill promises already made:
1. **B2 Full data export** — Privacy Policy promises it; close the gap.
2. **A2 Biological events** — multiplies the value of Faz 1's
   protocol-response (accounts for confounders).
3. **B6 Conflict UI** — Faz 1.2's outbox will eventually conflict;
   resolve surface needed.
4. **A1 LEGO Protocol Builder** — depends on Faz 2; schedule after.

### Tier 2 — maturity sprint (after Faz 2-3 land)
5. **B1 Onboarding wizard** — biggest user-facing gap.
6. **B3 i18n (TR+EN)** — opens the Turkish market.
7. **B4 Accessibility** — premium feel + legal coverage.
8. **B7 SQLite encryption** — closes SECURITY-AUDIT finding.

### Tier 3 — engagement + correctness (after Faz 4)
9. **C1 Weekly insights digest** — natural extension of Faz 3 AEON.
10. **C2 Re-order reminders** — practical, half-built.
11. **A3 Lab OCR scanner** — high perceived value, real effort.
12. **A4 Community protocol logs** — fills out Community.

### Tier 4 — opportunistic
13. **C3 Lot tracking**, **C4 Caregiver mobile**, **C11 Photo analysis** —
    build only when real users ask.
14. **A5 WHOOP/Oura** — only with post-launch device-ownership signal.

### Explicitly not on the roadmap
C5 editorial feed · C6 gamification · C7 premium tier · C8 marketplace ·
C9 telehealth · C10 social feed.

---

## How to use this document

- When the active 5-phase roadmap finishes, the next agent reads this file
  and picks up from Tier 1.
- New feature ideas should be evaluated against the "Recommended / Not
  recommended" criteria here — don't re-debate what's already been decided.
- Material changes get recorded in `docs/DECISIONS.md` (per AGENTS.md
  constitution), not edited silently here.
