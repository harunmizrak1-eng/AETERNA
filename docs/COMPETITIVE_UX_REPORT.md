# ÆTERNA competitive UX report

Scope: UX, onboarding, navigation, and "premium feel" only — not pricing,
business model, or medical-content accuracy. Benchmarks OneTwenty, Marek
Health, Ways2Well, Ultrahuman, and HeadsUp Health against ÆTERNA's own
marketing site, `aeternamethod.com`. This is research to inform design
direction; it does not authorize copying any layout, copy, or asset. Per
`docs/COMPETITIVE_PARITY_BLUEPRINT.md`, public behavior can be benchmarked —
branding, copy, and assets are not imported.

## Method

Five sites were researched in parallel via live browsing where accessible,
falling back to WebFetch/WebSearch/third-party reviews where a site blocked
access (noted per-site below). `aeternamethod.com` was browsed directly.

## aeternamethod.com — ÆTERNA's own marketing site

**Premium feel:** Ivory/cream background (not the app's charcoal dark theme —
a deliberate, different register for the education/marketing brand), serif
display headlines with italic accents ("An education in the *language* your
body already speaks"), a hand-drawn receptor-binding diagram as the hero
visual instead of a product screenshot or lifestyle photo. Tone is
consistently "curriculum," "faculty," "cohort," "monograph" — an academic/
publishing register, not a health-app or e-commerce register anywhere on the
page.

**Onboarding:** Two-tier, education-framed, not "sign up for an app": Guest
reader (free, limited lexicon access) vs. Full member ("complimentary full
access" during the current cohort — twelve modules, seminars, annotated
literature). CTA is "Begin your education" / "Now enrolling · Spring cohort
2026," not "Start free trial" or "Download the app."

**Navigation:** Protocols · Monographs · Compendium · About · Contact, plus
Sign in. Five items, flat, content-taxonomy-driven rather than
feature-driven — notably this maps closely onto ÆTERNA's planned in-app
destinations (Protocol, Library ≈ Monographs/Compendium).

**Notable patterns:**
- Six "Pillars" (metabolic, cognitive, recovery, tissue/joint, sleep,
  hormonal) as problem-first entry points ("The afternoon crash, stubborn
  weight...") rather than compound-first or feature-first entry points —
  each opens onto a reading path of monographs + compendium essays.
- Explicit non-medical framing repeated three separate ways on one page: "We
  do not prescribe or dispense. We illuminate," "Peptides are vocabulary...
  your physician decides what to write," and a direct FAQ answer ("Does
  Aeterna Method prescribe or sell peptides?"). This is a strong, load-bearing
  pattern for staying inside ÆTERNA's non-medical-device constraint while
  still feeling authoritative.
- Credibility stats presented as plain numbers, no icons/badges: "7000+ peer-
  reviewed studies surveyed," "80+ signaling molecules catalogued," "45% of
  the human proteome is regulated... by short peptide messengers," "$0 cost
  to read every word of it." The last one doubles as a trust/anti-sales
  signal.
- A "Journal" section tagged by content type (Mechanism, Practice) rather
  than date — matches a Library/evidence-tier taxonomy better than a blog
  reverse-chronology would.

**Consistency check against the app's design direction:** The site's serif/
italic/ivory editorial register is distinct from (not identical to) the
app's charcoal/gold clinical-terminal direction already fixed in
`src/theme/tokens.ts` context — that's expected and fine for a marketing site
vs. a data-dense app, but the *voice* (curriculum, mechanism-first, explicit
non-prescriptive framing, evidence-first) should carry through directly into
the app's Library and Today copy, not just the marketing site.

## OneTwenty (onetwenty.com)

**Access:** Fully browsable live.

**Premium feel:** Data-forward health-tech, reads closer to a fintech/SaaS
dashboard landing page than a clinic or an editorial brand — white
background, indigo/purple gradient blobs, restrained serif+sans wordmark.
Targets data-literate biohackers directly (sample UI shows raw lab values
like "Total Testosterone 847 ng/dL" on the marketing page itself).

**Onboarding:** Single-step, low-friction — email-capture modal ("Stop
Guessing Your Health") plus a repeated "Become a Founding Member" CTA
routing off-site to a signup flow. No visible in-page intake form. Trust is
built through a live "Quarterly Review" sample card, not testimonials.

**Navigation:** Minimal, one level deep — Home / How It Works / Biometrics /
Blog / Contact, hamburger-collapsed even on desktop — except a deep,
category-grouped biomarker library (165+ pages) with progressive
"Load More" disclosure.

**Patterns worth studying:**
- Individual biomarker result cards: name, value+unit+source device, a
  status chip ("Above 15% target"), one-line clinical rationale. Directly
  applicable to ÆTERNA's Biomarkers screen.
- "Quarterly Review" narrative card: each metric delta gets an arrow + plain-
  language interpretation ("HRV Recovery +22ms → Possible overtraining or
  stress"). Turns raw numbers into a story — relevant to ÆTERNA's Today
  "what changed and why" requirement.
- Category-grouped library with a running count badge ("32 Biomarkers").
- Compound/medication cards tagged with category pills (Men's Health,
  Longevity, Weight Management) — a shape ÆTERNA's Peptide Vault evidence-
  tier tags could reuse.

**Doesn't fit ÆTERNA:** Gradient-blob SaaS-landing-page hero styling and
exclamation-heavy "Founding Member" scarcity/urgency framing read as
growth-hacky — at odds with ÆTERNA's clinical restraint and aeternamethod.com's
already-established, calmer editorial voice.

### Update: the actual gated dashboard (owner-provided screenshots, 2026-07-15)

The marketing-site audit above could not see past the signup wall. The owner
supplied three screenshots of a real logged-in account, which change the
picture — this is the first direct look at OneTwenty's actual in-app UX
rather than its marketing page.

**Home dashboard:** A dismissible announcement banner ("Apple Health Now
Supports Blood Pressure & CGM Data," 1/3, carousel arrows) sits above a
personalized greeting ("Welcome back, Chaim!"). The primary card is a
**Health Score** — a large number (76/100) paired with a dot-plot trend line
across a scrollable date axis, a Daily/Weekly toggle, and an explicit sample-
size disclosure ("106 days of data"). Sparse dot density in early weeks
visually communicates data ramp-up rather than hiding it. Beside it, a dark
**"member card"** widget — Health ID number, score, member name, brand
mark — styled like a physical loyalty/insurance card, not a data widget. A
**Connected Devices** panel (Apple Health, Oura, Withings, Google Fit; count
badge "4") sits as a first-class dashboard element, not buried in settings,
each with a colored status dot and a "+ Add" affordance. Below the fold,
per-metric sub-cards (Sleep, Heart Rate, Daily Calories) each pair a mini
sparkline with current value, a status chip ("NORMAL"), and a signed delta
("+2 bpm").

**Health Score detail screen:** A distinct destination (own nav tab, "Health
Score"), not just an expanded card. Leads with a semicircular gauge (65,
labeled "GREAT" — plain-language framing of a number, not just the number),
a Day/Week/1 Month/3 Month toggle, both absolute and period deltas ("+9
pts," "+76 today"), and a footer disclosing device count and staleness
("4 devices," "Synced 2h ago"). Below the gauge, category scores
(Cardiovascular 68, Metabolic 83) render as large tappable pill-buttons, not
a plain list — the active category becomes a filled orange bar. Under that,
a **marker table** (Name / Score / History) lists individual results
(Blood Pressure: 50, "LOW," "133/87," wavy sparkline; Blood Lipids: 85,
"NORMAL," "74 mg/dL," source-tagged "Lab result") — score, raw value, status
chip, and trend sparkline together in one row, reused consistently down the
table.

**Revised patterns worth studying (supersedes the marketing-page-only
findings above):**
- A composite score (Health Score) with plain-language status label
  ("GREAT") is the anchor, with named sub-scores (Cardiovascular, Metabolic)
  one tap away — the same score-then-drill-down structure noted for
  Ultrahuman's Recovery Score, now confirmed as OneTwenty's actual pattern
  too, not just a marketing claim.
- Explicit data-provenance and staleness in the UI itself ("106 days of
  data," "Synced 2h ago," "Lab result" tags) rather than buried in settings —
  directly relevant to ÆTERNA's own `DataSource`/provenance requirements
  (`docs/DATA_MODEL.md`) and stronger evidence than HeadsUp Health's
  click-through icon alone.
- One consistent row shape (score + raw value + status chip + sparkline)
  reused for every biomarker in a table, rather than a bespoke card per
  marker — simpler to build and scan than OneTwenty's own marketing-page
  card version.
- Connected-devices management surfaced as dashboard-level, not
  settings-level — worth weighing for ÆTERNA's own Health Sync status
  surface once Stage 1B is active.

**Still doesn't fit ÆTERNA:** the physical-membership-card visual metaphor
and consumer-app status-chip color coding (bright green "NORMAL" pills) skew
closer to a fintech/insurance app than ÆTERNA's clinical-editorial register
— if adapted, the *structure* (score, delta, provenance, drill-down) is the
reusable part, not this specific visual skin.

## Marek Health (marekhealth.com)

**Access:** Server-blocks non-US IPs — could not be directly browsed.
Findings below are reconstructed from third-party reviews, Trustpilot, and
indexed page titles; flagged as **lower confidence** throughout.

**Premium feel (low confidence):** Clinical, credential-driven telehealth
brand for an "analytically oriented" TRT/longevity audience. The one directly
observed page (a geo-block error page) showed black background with a bold
red-orange accent — a single data point, not confirmed as representative.

**Onboarding (from reviews):** High-commitment, human-in-the-loop: paid
intake call with a coordinator → detailed questionnaire → lab draw at a
partner site → physician video consult → ongoing monthly coach check-ins.
Trust built through volume social proof (905+ Trustpilot reviews) rather
than in-page data visualization.

**Navigation (partial):** Deeper, service-line-segmented IA — dedicated
destinations per condition/goal (Labs/Diagnostics, Fertility, Heart Health)
rather than OneTwenty's flatter feature-based structure.

**Pattern worth studying:** The human-in-the-loop intake is the opposite end
of the onboarding-friction spectrum from OneTwenty's frictionless
email-capture — useful as a deliberate contrast when deciding how much
friction ÆTERNA's own onboarding should have (ÆTERNA has no clinician
relationship in Stage 1A, so neither extreme applies directly, but the
"friction-as-trust-signal" tradeoff is worth keeping in mind).

**Doesn't fit ÆTERNA:** A bold red/orange-on-black accent risks reading as
aggressive/masculine-supplement-brand, not ÆTERNA's restrained charcoal-
and-gold. A third-party review explicitly flagged marketing copy
("bespoke," "hyper-personalized") as overselling a templated offering — a
copy-tone risk to avoid regardless of accuracy of that specific criticism.

## Ways2Well (ways2well.com)

**Access:** Researched via WebFetch/WebSearch (no live browser in that
research pass); findings are page-content/case-study based, not
screenshot-verified.

**Premium feel:** Clinical-but-consumer telehealth brand blending medical
credibility with active e-commerce/membership polish — closer to a
DTC-supplement-brand-plus-clinic hybrid than clinical starkness.

**Onboarding:** Intake questionnaire (rebuilt from a legacy PDF into an
online form feeding directly into their EHR) → lab ordering → provider
scheduling with real calendar availability → treatment plan → ongoing app
access. An "Allen" AI assistant is surfaced early as a trust-building
stand-in for a live human at signup.

**Navigation:** Flatter marketing-site-plus-commerce structure — Peptide
Therapy, Shop (separate `shop.ways2well.com`), Get Started, Membership, Blog
— commerce and clinical content sit as siblings, not separated.

**Patterns worth studying:**
- Converting a legacy paper intake form into a linear online questionnaire
  wired directly into the EHR, removing double-entry — a real trust signal
  regardless of ÆTERNA's own non-clinical positioning.
- Checkout/flow logic branching by service type (schedule-required vs.
  form-required vs. ship-required) rather than one generic flow.
- Membership as a single umbrella product bundling app + provider +
  supplements + prescriptions.

**Doesn't fit ÆTERNA:** Active e-commerce merged into the clinical journey
directly contradicts ÆTERNA's explicit non-catalog, non-commerce stance (see
the "This is not an e-commerce app" line in the product brief). An AI chat
assistant positioned as the onboarding trust layer also conflicts with
ÆTERNA's no-AI-recommendation/no-diagnosis constraint.

## Ultrahuman (ultrahuman.com + app)

**Access:** Researched via WebFetch/WebSearch and app reviews; no live
browser session in that research pass.

**Premium feel:** Dark, high-contrast, cyan-accented tech aesthetic with
athlete photography and a hardware-jewelry angle (18K gold "Ring Rare,"
designer collabs). Reads as premium wearable-tech/athletic-performance —
closer to Apple/luxury-gadget marketing than a health record. Targets
performance-driven biohackers and athletes specifically, not patients.

**Onboarding:** Device-first, not questionnaire-first — app download →
Bluetooth ring pairing (reviewers specifically praise pairing reliability) →
a baseline data-collection period before scores stabilize → profile setup.
No medical intake.

**Navigation:** Five tabs — Home (ring data/scores), Metabolism (gated
behind owning their CGM hardware), Zones (social/community), Discover
(workouts/meditation/podcasts), Profile. Reviewers explicitly criticize
this: most real metric depth is buried in Home submenus, and three of five
tabs are irrelevant unless you own extra hardware or want social features —
a direct cautionary data point against tab-bloat.

**Patterns worth studying:**
- Three aggregate indices (Movement, Sleep, Recovery) anchor the home
  screen — each a single score with one-line state, detail on tap. Close
  precedent for ÆTERNA's Today "Recovery Score" concept.
- Recovery Score synthesizes five underlying signals into one 0–100 number
  rather than showing raw signals up front.
- Circadian-timed recommendations tied to the current score ("best time to
  exercise"), not a generic tip feed.
- Sleep-cycle visualization as a timeline/band chart, not a bare number.

**Doesn't fit ÆTERNA:** Persistent upsell notifications inside core data
screens (reviewers call this "aggressive monetization") is exactly the noise
ÆTERNA should avoid. The social "Zones" tab and gamification-adjacent
content tab cut directly against ÆTERNA's no-gamification, editorial-not-
social direction — and against the five-destination navigation limit already
fixed in `docs/COMPETITIVE_PARITY_BLUEPRINT.md`.

## HeadsUp Health (headsuphealth.com + app)

**Access:** Marketing site browsed live; the actual product dashboard is
demo/login-gated, so in-app findings come from App/Play Store screenshots,
help docs, and third-party reviews.

**Premium feel:** The current marketing site has repositioned hard toward
B2B ("AI-Powered Clinical Intelligence Platform" for clinics) — generic
modern SaaS: white background, blue-indigo gradient CTAs, outline-icon
cards. Reads as an enterprise analytics tool, not a premium personal-health
product. The client-facing mobile app skins darker/moodier by contrast (navy
backgrounds, abstract wave graphics, "Meet your new wellness companion").

**Onboarding:** Gated, not self-serve — a provider invites the client or the
client enters a "provider code." One App Store review flagged this
directly as confusing (no explanation of how to get an invitation). Trust
signals lean on security messaging (Face ID/Touch ID, HIPAA) rather than a
guided first-run tour. Data-source connection happens post-signup via
category tabs; a review noted marker categorization is unintuitive
(cholesterol buried under "General Health and Fitness").

**Navigation — two distinct modes confirmed:**
- Client app (mobile): bottom nav = Dashboard, Lab Results, Journal,
  Assessments, plus a "More" catch-all.
- Practitioner portal (web/tablet): client-management table with
  role-swapped "Custom Menu Links" — practitioners see EHR/lab-portal links,
  patients see scheduling/education links.

**Patterns worth studying:**
- Customizable tile dashboard: add/hide/rearrange tiles, pick metric + time
  range per tile for instant charts.
- A combined CGM view merging glucose with sleep, HRV, weight, and blood
  pressure into one trend surface — the closest external precedent found
  for ÆTERNA's own Biomarkers/Today multi-source view.
- Click-through provenance: a small paper icon on any lab value links back
  to its source PDF — directly relevant to ÆTERNA's own provenance
  requirements (`docs/DATA_MODEL.md`'s `BiomarkerResult`/`DataSource`).
- Explicit before/after onboarding-trust framing ("multiple logins" → "one
  longitudinal view").

**Doesn't fit ÆTERNA:** The "Agentic AI / AI command center" enterprise-SaaS
voice and generic blue-gradient/icon-cluster aesthetic clash with ÆTERNA's
clinical-editorial restraint and sparse gold accent.

## Cross-cutting synthesis

**Recurring pattern worth adopting:** every credible product in this set
turns a raw number into a one-line interpretation next to it (OneTwenty's
delta arrows, Ultrahuman's single recovery score, HeadsUp's tile dashboard).
This directly validates ÆTERNA's own "Today answers what now, what changed,
and why it matters" principle already fixed in
`docs/COMPETITIVE_PARITY_BLUEPRINT.md` — none of these competitors show a
bare number without context, and neither should ÆTERNA.

**Recurring pattern worth explicitly rejecting:** persistent upsell/
monetization UI inside data screens (Ultrahuman), AI-chat-as-trust-layer at
onboarding (Ways2Well), and enterprise-SaaS visual genericness (current
HeadsUp Health) all actively undermine the "premium, calm, trustworthy"
feel ÆTERNA is after. Tab/destination bloat (Ultrahuman's 5 tabs, 2 of which
reviewers call filler) reinforces — don't relax — the existing 5-destination
cap.

**Onboarding-friction spectrum:** the five products span from near-zero
friction (OneTwenty: email + CTA) to maximum friction (Marek Health: paid
human intake call). ÆTERNA's own onboarding sits naturally toward the
low-friction end for Stage 1A (no clinician relationship yet), but
`aeternamethod.com`'s two-tier Guest/Full-member model is a good middle
precedent already established in ÆTERNA's own brand — the in-app onboarding
should be consistent with that, not invent a third model.

**Brand-voice validation:** `aeternamethod.com`'s explicit,
repeated non-prescriptive framing ("we do not prescribe, we illuminate") is
a stronger and more consistent version of the same disclaimer pattern seen
weakly in HeadsUp's HIPAA badges and HealthKit-style permission language
elsewhere. This is worth treating as a first-class in-app copy pattern
(recurring, not a one-time disclaimer screen), not just a legal footnote.

## Recommendations

1. No design or copy change follows from this report by itself — it is
   input for future Today/Biomarkers/Library screen design work, not an
   implementation authorization.
2. When the Today screen is designed, use OneTwenty's delta-arrow-plus-
   plain-language pattern and Ultrahuman's single-recovery-score pattern as
   the two strongest external precedents for "what changed and why."
3. When the Biomarkers screen is designed, HeadsUp's click-through
   source-provenance icon is a strong, legally relevant pattern (ties
   directly to ÆTERNA's own `DataSource`/provenance requirements) and
   OneTwenty's result-card shape (value + status chip + one-line rationale)
   is a strong layout precedent.
4. Carry `aeternamethod.com`'s non-prescriptive voice pattern into in-app
   copy deliberately, not just a disclaimer screen — it is ÆTERNA's
   strongest and most consistent differentiator across everything reviewed
   in this report.
5. Treat Ultrahuman's tab-bloat criticism and Ways2Well's commerce-bleeds-
   into-clinical-content pattern as concrete cautionary examples the next
   time a "just one more nav item" or "just one more upsell" question comes
   up.
