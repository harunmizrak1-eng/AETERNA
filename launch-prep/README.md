<div align="center">

# ÆTERNA

### A personal biology operating system.

**Track less. Understand more.**

Your biology, decoded — peptides, supplements, labs, sleep, training, and
nutrition in one private, offline-first system that shows you *what
changed* and *when*, not just *what you did*.

</div>

---

## What ÆTERNA is

Most health apps collect data. ÆTERNA connects it.

You don't just log that you took BPC-157 or started MOTS-c. ÆTERNA watches
what your body did next — sleep, HRV, resting heart rate, weight, waist,
labs, training, mood — and shows you the **response**:

> *Since starting MOTS-c (12 July):*
> *recovery ↑ 14% · sleep +22 min · resting HR −3 bpm*
> *Strongest signal: recovery*

That is the whole point. Not the most data — the clearest understanding.

### Built around one principle

**Evidence before protocol.** ÆTERNA never diagnoses, prescribes, or
promises outcomes. It shows observations, marks uncertainty honestly, and
leaves the medical decisions to you and your physician.

---

## What's inside

- **Compound library** — 174 peptides and compounds with monographs,
  reconstitution math, half-life charts, and an interaction checker. All
  bundled offline.
- **Protocol builder & templates** — structured protocols with versioning;
  ready-made stacks (Wolverine, healing, GLP-1 reset, anti-aging,
  cognitive, sleep) you can adapt.
- **Dose & injection tracking** — log doses and injections, rotate sites,
  track vial inventory.
- **Labs & biomarkers** — import PDF/CSV results, view longitudinal trends
  per marker, see which markers moved after a protocol.
- **Protocol → Response engine** — the killer feature: a before/after delta
  table for every protocol, sample-gated against insufficient data, never
  claiming causation.
- **n=1 experiments** — formalize a hypothesis, track a metric, and let
  ÆTERNA score the outcome against a baseline window.
- **AEON AI** — an assistant that reads *your* data and answers
  data-grounded questions ("why am I more tired lately?"). Bring your own
  key, or self-host — never ambient.
- **Biology timeline** — protocols, labs, symptoms, dose changes, and
  biological events on one chronological axis.
- **Stack intelligence** — see whether your stack skews toward recovery,
  metabolic, cognitive, sleep, or longevity; flag overlapping pathways.
- **Nutrition & training** — 7,000+ offline USDA foods and 870+ wger
  exercises; full logging without a server round-trip.

---

## Private by design

- **No advertising. No analytics. No tracking.** No ad or analytics SDKs in
  the app — verified by code audit.
- **Works without an account.** A local-only mode stores everything on your
  device and never transmits anything.
- **Bring your own server.** Point the app at any compatible deployment —
  yours, a friend's, or the reference server. Or none.
- **Your data is yours.** Export it, delete it, move it.
- **Open source.** Audit the code, run your own instance.

See [`launch-prep/legal/PRIVACY_POLICY.md`](./launch-prep/legal/PRIVACY_POLICY.md)
for the full, code-verified policy.

---

## Free, and staying that way

No paywall. No subscription. No "premium" tier that hides the features that
matter. No ads. No selling data. The things that make ÆTERNA useful are the
things everyone gets.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Mobile (offline-first)                                  │
│  • Bundled content (compounds, foods, exercises) — JSON │
│  • SQLite — your data, primary, on-device               │
│  • Optional sync — push outbox, pull updates            │
└──────────────┬──────────────────────────────────────────┘
               │ (optional, your server or none)
┌──────────────▼──────────────────────────────────────────┐
│ Reference server (Express + Postgres + RLS)             │
│  • AEON AI proxy (your key)                             │
│  • Optional account sync                                │
│  • Wearable integrations (HealthKit, Health Connect,    │
│    Withings, Fitbit, Garmin, Polar, Strava, Hevy)       │
└─────────────────────────────────────────────────────────┘
```

**Stack:** React Native 0.85 · Expo SDK 56 · React 19 · TypeScript
(strict) · Express 5 · PostgreSQL (Supabase/Neon-compatible) ·
`expo-sqlite` · React Query · Better-Auth.

---

## Status

Active development. The product roadmap and current status live in
[`docs/ACTIVE_CONTEXT.md`](./docs/ACTIVE_CONTEXT.md) and
[`docs/DECISIONS.md`](./docs/DECISIONS.md).

Not medical advice. Not a medical device. See
[`launch-prep/legal/TERMS_OF_SERVICE.md`](./launch-prep/legal/TERMS_OF_SERVICE.md).

---

## Credits

ÆTERNA builds on the work of the open-source health, nutrition, and
fitness communities. Full attributions in
[`launch-prep/legal/ATTRIBUTION.md`](./launch-prep/legal/ATTRIBUTION.md) —
notably SparkyFitness (application foundation), wger (exercises),
FitBook/USDA (foods), Open Peptide Dataset CC BY 4.0 (compounds), and
LoopHabitTracker (habit algorithms).

---

## License

Pending — see `docs/DECISIONS.md`. The application foundation is
SparkyFitness under its custom non-commercial license, with written
commercial-use permission obtained from the author. ÆTERNA's own license
will be recorded before public release.

<div align="center">

*Vücudunun verdiği sinyalleri anlamlandır.*

</div>
