# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

---

# ÆTERNA — Project Context

## What this is

A personal-first, peptide/longevity/biohacking tracking app for iOS and Android.
Owner uses it personally first (tracks his own 12-compound stack), with the
intent to eventually open it to ÆTERNA's audience (Turkish-language peptide/
longevity content brand, Instagram @trpeptit).

## Product scope — READ THIS FIRST

There was an earlier, much larger product brief floating around (AI Coach,
genetics integration, photo progress engine, population heatmaps, wearable
integrations, bloodwork PDF AI extraction, biological age engine, etc).
**That brief was explicitly rejected as overscoped for a solo-built personal
app.** Do not build toward it. If the user asks for something from that list,
treat it as a deliberate, scoped-down decision, not an oversight.

Current real scope (in priority order):

1. **Stack & dose tracking** — active compounds, dosing schedule, dose logging,
   injection site rotation, vial/inventory tracking.
2. **Compound knowledge library** ("Peptide Vault") — mechanism, evidence tier,
   dosing reference, sources. Seed data already written for 12 compounds.
3. **Daily journal / metrics** — weight, sleep, WHOOP recovery/deep sleep,
   mood, energy. Manual entry only for now — no wearable SDK integration yet.
4. **Blood panel tracking** — manual entry of lab markers with lab-range vs
   longevity-optimal-range display. No PDF/AI extraction yet — manual form only.

Explicitly OUT OF SCOPE until the above is solid and the user asks:
AI coach / chat, wearable integrations (WHOOP/Oura/Apple Health APIs),
genetics, photo progress, population benchmarking/heatmaps, community features,
protocol simulator, biological age engine, voice journal, PDF lab upload + AI
extraction. These are real Phase 2/3 ideas, not Phase 1.

## Critical constraint: not a medical device

Do not build features that diagnose, predict, or give personalized medical
recommendations (e.g. "your optimal dose is X", AI-generated health
predictions, biological age scoring presented as fact). Reference ranges and
educational content only, always with an implicit "informational, not
medical advice" framing. This matters for regulatory exposure once the app
is opened beyond personal use.

## Brand voice (carries into UI copy)

Turkish-language UI copy should be: sentence case, direct, no hedging words
(bence, sanki, gibi), no filler, short declarative sentences. Numbers written
as "yüzde 24" not "%24" in body copy (but numeric stats/badges in the UI can
use compact "%24" / "28.3%" formatting — that's a data-display convention,
not prose). The brand draws a hard line between three evidence tiers and
never blurs them: proven (Phase 3 / clinical), mechanistic (mechanism-based
reasoning), speculative (animal/preclinical) — see `evidenceTier` in
`src/types/models.ts` and `src/theme/tokens.ts`. Never present speculative
compound claims as proven. This tiering is the brand's core differentiator
vs. competitors (Gary Brecka-style accounts) — do not weaken it for UI
simplicity.

## Design language — already decided, do not default to AI clichés

The Instagram marketing brand (CrimsonPro serif headlines + gold gradient
text + black background) is intentionally NOT what the app UI should look
like. That treatment is unreadable at app information density. App design
direction already implemented in `src/theme/tokens.ts`:

- Neutral charcoal surfaces (`#121212` / `#1A1A1A` / `#1E1E1E`), not pure
  black, not the marketing gold-on-black sheet.
- Gold (`#C9A24B`) reserved for accents only: active tab, key data points,
  evidence-tier-proven indicators, CTAs. Not headline text fills, not gradients.
- System/UI font stack for density (no Crimson Pro serif in the app UI —
  that font is print/marketing-only). Type scale in `src/theme/tokens.ts`
  under `type`.
- Reference feel: WHOOP / Oura / a Bloomberg terminal for human biology —
  clinical, data-forward, lots of whitespace, no fitness-bro or
  wellness-influencer visual tropes.

If asked to redesign visuals, push back on reverting to the marketing serif/
gold-gradient look for in-app screens — it was already tried and rejected
once for being "obviously AI-generated."

## Architecture decisions already made

- **Expo Router** (file-based routing) — `app/` directory, route groups under
  `app/(tabs)/`.
- **expo-sqlite** with manual SQL migrations in `src/db/client.ts` — no ORM.
  Local-first by design: sensitive health/compound data should stay on-device
  for now. Don't introduce a backend/cloud sync without discussing it first.
- **Repository pattern** — all DB access goes through `src/db/*Repository.ts`
  files (`stackRepository.ts`, `metricsRepository.ts`, `bloodRepository.ts`).
  Screens should never call `getDb()` directly.
- **Compound data is static/seeded** (`src/data/compounds.ts`), not
  user-editable yet. It's a TS array, not a DB table — by design, so the
  knowledge base ships with app updates rather than needing a backend.
- **TypeScript strict mode is on.** Whole project currently type-checks clean
  (`npx tsc --noEmit` → zero errors). Keep it that way.

## Current state (as of handoff)

Already built and type-checking clean:

- `app.json` — dark theme, expo-router/expo-sqlite/expo-notifications plugins
  configured, bundle IDs set to `com.aeterna.app`.
- `src/theme/tokens.ts` — full design token system (colors, spacing, type
  scale, evidence-tier and category color maps).
- `src/types/models.ts` — core domain types: `Compound`, `StackItem`,
  `DoseLog`, `DailyMetric`, `BloodPanel`/`BloodMarker`, `Article`.
- `src/data/compounds.ts` — seed library of 12 compounds (retatrutide,
  cagrilintide, BPC-157, TB-500, GHK-Cu, NAD+ precursors, MOTS-c, SS-31,
  epitalon, CJC-1295+ipamorelin, semax, selank) with real evidence-tier
  classification and sourced figures.
- `src/data/markerDefinitions.ts` — reference blood marker definitions
  (lab range vs longevity-optimal range) for ~18 common markers.
- `src/db/client.ts` — SQLite schema + migrations (stack_items, dose_logs,
  daily_metrics, blood_panels, blood_markers tables).
- `src/db/stackRepository.ts` — full CRUD for stack items + dose logging,
  including injection-site-rotation lookup (`getLastInjectionSiteForItem`)
  and auto-decrementing vial inventory on dose log.
- `src/db/metricsRepository.ts` — daily metric upsert-by-date + range queries.
- `src/db/bloodRepository.ts` — blood panel + marker CRUD, per-marker
  history query for trend charts.
- `app/_layout.tsx` — root layout, DB init on boot, dark status bar.
- `app/(tabs)/_layout.tsx` — 4-tab bottom nav (Stack / Günlük / Kütüphane /
  Profil) using Ionicons.
- `app/(tabs)/index.tsx` — **Stack tab**: wired to `listStackItems`, renders
  real data, has empty state. Card UI is intentionally minimal — needs the
  real `StackItemCard` component (see TODO comment in file).
- `app/(tabs)/library.tsx` — **Library tab**: full compound list from seed
  data, category dot + evidence tier badge, navigates to detail on tap.
  Functional, not just a stub.
- `app/(tabs)/log.tsx`, `app/(tabs)/profile.tsx` — **bare placeholders**,
  title only. These need real implementation.
- `app/compound/[id].tsx` — **Compound detail screen**: fully built out
  (mechanism, evidence summary, dose stats grid, caution box, sources list).
  Missing only the "Add to Stack" CTA wiring (noted in TODO comment).

## Immediate next steps (suggested priority)

1. Run `npx expo start` and verify the app actually boots on a simulator —
   this has NOT been runtime-tested yet, only type-checked. Fix whatever
   breaks at runtime (Metro bundler issues, native module linking, etc).
2. Build "Add to Stack" flow: a form (compound picker from library → dose,
   unit, frequency, route, reminder times) that calls `createStackItem`.
   This is the single highest-value missing piece — right now you can browse
   the library but can't actually populate your stack.
3. Build out the Stack tab card UI properly (see TODO in `index.tsx`):
   next-dose-due indicator, quick-log button, swipe actions.
4. Build the dose logging flow (tap a stack item → log dose taken, optionally
   pick injection site from a body map — even a simple 8-button grid is fine
   for v1, doesn't need to be a literal SVG body diagram yet).
5. Build out `log.tsx`: today's metric entry form + today's dose timeline.
6. Build out `profile.tsx`: at minimum, settings + blood panel history list
   + an "Evidence Tier Framework" explainer screen (this is good for trust
   if the app is ever shown to others).
7. Notifications: wire `expo-notifications` to actually schedule reminders
   based on `StackItem.reminderTimes` — currently the data model supports
   this but nothing schedules real OS notifications yet.

## Known gaps / things to watch

- No icon/splash assets beyond Expo's defaults — `assets/icon.png` etc. are
  placeholder. Will need real ÆTERNA app icon at some point (NOT the
  Instagram gold-gradient logo as-is — that won't read well at icon size;
  may need a simplified glyph-only version).
- No tests written yet.
- No auth/backend — fully local. If multi-device sync or the "open to
  ÆTERNA's audience" phase becomes real, that's a deliberate architecture
  conversation (likely Supabase or similar), not a default to reach for.
- Turkish character handling: make sure any new UI text uses correct Turkish
  characters (ş, ğ, ı, İ, ö, ü, ç) — the system font stack should cover this
  fine but double-check on both platforms.

