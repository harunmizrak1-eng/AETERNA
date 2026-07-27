# ÆTERNA landing page — content & spec

A single-page, static, privacy-respecting landing site. No tracking, no
analytics, no third-party fonts/scripts beyond a self-hosted web font.
Suitable for GitHub Pages or any static host.

Copy below. Visual direction per AGENTS.md: **light, calm, editorial,
scientific, premium** — not generic SaaS, not black-and-gold.

---

## Page title

`ÆTERNA — your biology, decoded.`

## Meta description (≤160 char)

`A personal biology operating system. Track protocols, labs, sleep, training, and nutrition — and see what actually changed. Private, offline-first, free.`

## Open Graph / Twitter card

- Title: `ÆTERNA — your biology, decoded.`
- Description: as above.
- Image: editorial, light, calm — a single hero showing the "Since
  starting MOTS-c: recovery ↑14%" response card on a soft off-white
  background. No stock photos of syringes or pills.

---

## Hero

### Headline
**Track less.**
**Understand more.**

### Subhead
ÆTERNA is a personal biology operating system. It connects the signals
your body gives — sleep, recovery, labs, weight, training, mood — and
shows you what actually changed when you started a protocol.

### Primary CTA
`Download for iOS` · `Download for Android`

### Secondary CTA
`Read the privacy policy` · `View the source`

---

## Section 1 — "What changed?"

> Most apps track what you do. ÆTERNA helps you understand what it does
> to you.

Start a protocol. ÆTERNA watches what your body did next.

(Mock response card, real styling:)
```
┌─────────────────────────────────────────────┐
│ Since starting MOTS-c  ·  12 July           │
│                                             │
│  recovery          ↑ 14%                    │
│  sleep             + 22 min                 │
│  resting HR        − 3 bpm                  │
│  ───────────────────────────                │
│  Strongest signal: recovery                 │
│                                             │
│  Based on 28 days of your data.            │
│  Proximity in time is not causation.       │
└─────────────────────────────────────────────┘
```

---

## Section 2 — Built around one principle

**Evidence before protocol.**

ÆTERNA never diagnoses. Never prescribes. Never promises outcomes.
It shows observations, marks uncertainty honestly, and leaves the medical
decisions to you and your physician.

---

## Section 3 — What's inside

(Grid of feature cards, no icons-of-pills, calm typography.)

- **Protocol → Response engine** — before/after delta tables, sample-gated
  against insufficient data, never claiming causation.
- **n=1 experiments** — formalize a hypothesis, score the outcome against
  baseline. Your own personal biology laboratory.
- **Compound library** — 174 peptides and compounds with monographs,
  reconstitution math, half-life charts, interaction checker. Offline.
- **Protocol builder & templates** — structured, versioned, with
  ready-made stacks to adapt.
- **Dose & injection tracking** — log doses, rotate sites, track inventory.
- **Labs & biomarkers** — import PDF/CSV, longitudinal trends per marker,
  see which markers moved.
- **Biology timeline** — protocols, labs, symptoms, events on one axis.
- **Stack intelligence** — see whether your stack skews recovery /
  metabolic / cognitive / sleep / longevity; flag overlapping pathways.
- **AEON AI** — data-grounded, bring-your-own-key, never ambient.
- **Nutrition & training** — 7,000+ foods, 870+ exercises, full offline
  logging.

---

## Section 4 — Private by design

(Three columns.)

### No ads. No analytics. No tracking.
No ad or analytics SDKs ship in the app — verified by code audit. No
device fingerprinting for profiling. No background location. No
"phone-home" pings.

### Works without an account.
A local-only mode stores everything on your device and never transmits
anything. Connect a server only if you want optional sync.

### Your data is yours.
Export it. Delete it. Move it to your own server. ÆTERNA is yours.

[Read the code-verified privacy policy →](../legal/PRIVACY_POLICY.md)

---

## Section 5 — Free, and staying that way

No paywall. No subscription. No "premium" tier hiding the useful features.
No ads. No selling data.

The things that make ÆTERNA useful are the things everyone gets.

---

## Section 6 — Open source

Audit the code. Run your own server. Adapt it. Built on the work of the
open-source health community — SparkyFitness, wger, FitBook, OpenNutriTracker,
LoopHabitTracker, the Open Peptide Dataset (CC BY 4.0).

[Full attributions →](../legal/ATTRIBUTION.md)

---

## Footer

ÆTERNA · personal biology operating system
[Privacy Policy] · [Terms] · [Attributions] · [Security] · [Source]
*Vücudunun verdiği sinyalleri anlamlandır.*

Not medical advice. See Terms.

---

## Build spec

- **Static HTML + CSS, no framework.** One page.
- **Self-hosted font.** A neutral grotesk (Inter / Söhne / Söhne Mono for
  data). No Google Fonts CDN.
- **Color:** off-white background (#FAFAF7), ink black (#111), one muted
  accent (sage or slate). No gradients, no glassmorphism.
- **Type scale:** editorial — large headlines, generous line-height.
- **Imagery:** none of pills/syringes/stock photos. UI mockups of the
  product only.
- **Performance:** <50KB initial, Lighthouse 100 achievable.
- **Hosting:** GitHub Pages from `launch-prep/web/` or any static host. No
  server-side rendering needed.
- **Tracking:** none. Not even privacy-respecting analytics. The privacy
  promise starts at the front door.
- **i18n:** English primary, Turkish mirror at `/tr`.
