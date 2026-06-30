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
genetics, photo progress, population benchmarking/heatmaps,
protocol simulator, biological age engine, voice journal, PDF lab upload + AI
extraction. These are real Phase 2/3 ideas, not Phase 1.

## Phase 1 — Community

Community (a social feed for ÆTERNA's audience) was originally scoped out and
explicitly rejected — see the "Product scope" note above. **That decision was
later and deliberately reversed by the owner**: community is now in Phase 1.
This is not scope creep to be second-guessed; treat it as settled.

What changed and what didn't:

- The owner has knowingly accepted the legal/regulatory exposure of running a
  user-generated-content feed (moderation liability, data handling for
  third-party content) and owns moderation responsibility personally — there
  is no moderation team or automated moderation pipeline. Don't add one
  unprompted.
- This is the first feature that breaks the local-first architecture (see
  Architecture below). That break is scoped tightly to the community module
  only — `StackItem`, `DoseLog`, `DailyMetric`, and blood panel data stay
  on-device. Do not move other domains to the backend "while we're at it."
- Community ships with baseline safety primitives only: per-post/comment
  reporting and user-level blocking. There is no admin moderation UI in the
  app yet — reports are reviewed directly in the Supabase dashboard. If that
  needs to change (admin queue, auto-hide on report threshold, etc.), that's
  a separate, explicit ask, not an assumption to build ahead of.

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
  Local-first by design: sensitive health/compound data should stay on-device.
  This still holds for `StackItem`, `DoseLog`, `DailyMetric`, and blood panel
  data — don't move those to a backend without discussing it first.
- **Supabase** (Postgres + Auth + Storage) backs the Community module only
  (`src/lib/supabaseClient.ts`, `supabase/migrations/`). It is a deliberate,
  scoped exception to local-first — see "Phase 1 — Community" above. Don't
  use Supabase as a default for other domains.
- **Repository pattern** — all DB access goes through `src/db/*Repository.ts`
  files (`stackRepository.ts`, `metricsRepository.ts`, `bloodRepository.ts`).
  Screens should never call `getDb()` directly.
- **Compound data is static/seeded** (`src/data/compounds.ts`), not
  user-editable yet. It's a TS array, not a DB table — by design, so the
  knowledge base ships with app updates rather than needing a backend.
- **TypeScript strict mode is on.** Whole project currently type-checks clean
  (`npx tsc --noEmit` → zero errors). Keep it that way.

## Current state (as of handoff)

Already built and type-checking clean (`npx tsc --noEmit` → zero errors), and
runtime-verified by actually driving the app (headless Chromium against the
Expo web target — see "Running/testing this app" below):

- `app.json` / `metro.config.js` — dark theme, expo-router/expo-sqlite/
  expo-notifications plugins configured, bundle IDs `com.aeterna.app`. Metro
  is configured to resolve expo-sqlite's wasm asset on web.
- `src/theme/tokens.ts` — full design token system (colors, spacing, type
  scale, evidence-tier and category color maps).
- `src/types/models.ts` — core domain types: `Compound`, `StackItem`,
  `DoseLog`, `DailyMetric` (now includes `caloriesConsumed`,
  `caloriesBurned`, `waterMl`), `BloodPanel`/`BloodMarker`, `Article`.
- `src/types/community.ts` — Community domain types (`CommunityPost`,
  `CommunityComment`, `Profile`), separate from the local-first models above.
- `src/data/compounds.ts` — seed library of 12 compounds with real
  evidence-tier classification and sourced figures.
- `src/data/markerDefinitions.ts` — reference blood marker definitions for
  ~18 common markers.
- `src/db/client.ts` + `src/db/*Repository.ts` — local-first SQLite layer:
  stack items + dose logging (incl. injection-site rotation and vial
  inventory decrement), daily metrics upsert-by-date, blood panel/marker CRUD.
- `src/lib/supabaseClient.ts`, `src/lib/communityRepository.ts`,
  `src/lib/useSession.ts` — Community's Supabase layer (auth, posts,
  comments, reports, blocking, image upload). Degrades gracefully to a
  "not configured" state when `EXPO_PUBLIC_SUPABASE_*` env vars are absent —
  see "Running/testing this app".
- `supabase/migrations/0001_community.sql` — full schema for
  `profiles`/`community_posts`/`comments`/`reports`/`blocked_users` + RLS
  policies + the `community-images` storage bucket. **Applied and verified**
  against the real project (`ymypzrqidcaadrpgarxk`) — tables, RLS (post/
  comment visibility filtered by `blocked_users`, insert-spoofing blocked,
  reports write-only, anon denied), the `handle_new_user` trigger, and
  storage path-scoped upload policies were all exercised end-to-end with
  real auth sessions, then the test data was deleted. `EXPO_PUBLIC_SUPABASE_*`
  still needs to go in your own local `.env` (gitignored, never committed)
  to actually run the app against it.
- `app/_layout.tsx` — root layout, DB init on boot, dark status bar, modal
  routes for add-to-stack and community create/post-detail.
- `app/(tabs)/_layout.tsx` — 5-tab bottom nav (Stack / Günlük / Kütüphane /
  Topluluk / Profil).
- `app/(tabs)/index.tsx` — **Stack tab**: real data, empty state, "+" button
  to Library. Card UI is intentionally minimal — still needs the real
  `StackItemCard` component (see TODO comment in file).
- `app/(tabs)/library.tsx` — **Library tab**: full compound list, navigates
  to detail on tap.
- `app/(tabs)/log.tsx` — **Log tab**: today's calorie-in/calorie-out/water
  entry form (upsert by date). Dose timeline and the rest of `DailyMetric`
  (weight/sleep/mood/energy) still need a form — see next steps.
- `app/(tabs)/community.tsx`, `app/community/post/[id].tsx`,
  `app/community/create.tsx` — **Topluluk**: email/password auth, feed,
  post detail + comments, create-post (gallery image → Storage upload),
  report and block actions. No admin moderation UI by design (see
  "Phase 1 — Community").
- `app/(tabs)/profile.tsx` — **bare placeholder**, title only.
- `app/compound/[id].tsx` — compound detail, including the "Stack'e ekle"
  CTA that opens `app/stack/add/[compoundId].tsx`.
- `app/stack/add/[compoundId].tsx` — Add to Stack form (dose, unit,
  frequency, route, reminder times).

## Running/testing this app in a sandboxed/headless environment

There's no iOS/Android simulator in CI-style sandboxes. The verified path:
`npx expo start --localhost`, then drive the **web** target
(`http://localhost:8081`) with headless Chromium — `expo-sqlite` and
`react-native-web` both work there, so this exercises real rendering and
local-DB writes, not just Metro bundling. Community's Supabase calls will
fail without live credentials in `.env`; expect "Bağlantı kurulamadı"
rather than a crash — that's `toTurkishErrorMessage()` in
`src/lib/communityRepository.ts` working as intended, not a bug. Even with
real credentials, headless Chromium in this sandbox can't reach the public
internet through the environment's proxy (server-side tools like curl can —
see Known gaps), so browser-driven Community testing here is limited to the
"not configured" / graceful-error paths. Use curl with a real user's
session JWT (`/auth/v1/token?grant_type=password`) to exercise the actual
Supabase calls instead.

## Immediate next steps (suggested priority)

1. Build out the Stack tab card UI properly (see TODO in `index.tsx`):
   next-dose-due indicator, quick-log button, swipe actions.
2. Build the dose logging flow (tap a stack item → log dose taken, optionally
   pick injection site from a body map — even a simple 8-button grid is fine
   for v1).
3. Build out the rest of `log.tsx`: weight/sleep/mood/energy entry, today's
   dose timeline, link to blood panel entry.
4. Build out `profile.tsx`: settings, blood panel history list, an
   "Evidence Tier Framework" explainer screen.
5. Notifications: wire `expo-notifications` to actually schedule reminders
   based on `StackItem.reminderTimes` — the data model supports this but
   nothing schedules real OS notifications yet.

## Known gaps / things to watch

- No icon/splash assets beyond Expo's defaults — `assets/icon.png` etc. are
  placeholder.
- No tests written yet.
- The Supabase project is live and the schema is applied and verified (see
  above) — but only at the protocol level (curl + real auth sessions). A
  full UI-driven (headless-browser) end-to-end run against the live project
  hasn't happened: in this sandboxed setup, headless Chromium can't reach
  the public internet through the environment's outbound proxy at all (a
  bare `fetch('https://example.com')` from the page fails too — confirmed
  not Supabase- or app-specific), while server-side tools (curl, Node
  fetch) go through it fine. Worth a real on-device/simulator pass.
- Auth/backend exists only for the Community module (Supabase email/password
  auth + Postgres + Storage). Stack/dose/metrics/blood data has no sync and
  no account system — still fully local, still single-device.
- Magic-link auth was considered and dropped in favor of email/password —
  magic link needs deep-link redirect URL configuration that's hard to
  verify without a live project; revisit if the owner prefers passwordless.
- Community feed shows no avatars/profile photos, just `display_name` set at
  sign-up — there's no profile-editing screen yet.
- Turkish character handling: make sure any new UI text uses correct Turkish
  characters (ş, ğ, ı, İ, ö, ü, ç) — the system font stack should cover this
  fine but double-check on both platforms.

