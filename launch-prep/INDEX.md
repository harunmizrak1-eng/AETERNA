# launch-prep/

Release-preparation deliverables for ÆTERNA. Produced 2026-07-26 by GLM
from three parallel read-only audits (privacy, attribution/license,
OWASP security). All in this folder, isolated from the active `aeterna-os/`
development tree, so they do not collide with concurrent agents.

---

## What's here

| File | What it is |
|------|------------|
| `legal/PRIVACY_POLICY.md` | Code-verified privacy policy (KVKK + GDPR), EN + TR summary. Reflects what the code actually does. |
| `legal/ATTRIBUTION.md` | All third-party credits and licenses — SparkyFitness, wger, FitBook/USDA, Open Peptide Dataset (CC BY 4.0), reference repos, dependencies. |
| `legal/TERMS_OF_SERVICE.md` | Terms with explicit non-medical-advice disclaimer aligned to the AGENTS.md "evidence before protocol" rule. |
| `SECURITY-AUDIT.md` | OWASP MASVS-lite audit. 10 domains, PASS/FAIL/GRAY verdicts with file:line evidence. |
| `RELEASE-BLOCKERS.md` | The honest pre-launch list: 4 hard blockers, 7 soft blockers, 4 operational tasks. |
| `README.md` | Project README for ÆTERNA (replaces SparkyFitness README). |
| `store/STORE_LISTING.md` | App Store + Play Store copy, EN + TR, ASO keywords, privacy nutrition labels. |
| `web/LANDING.md` | Landing-page content + visual spec. Light, calm, editorial, premium. No tracking. |

---

## Read order (for review)

1. **`RELEASE-BLOCKERS.md`** — the priority list. Start here.
2. **`SECURITY-AUDIT.md`** — why those blockers exist.
3. **`legal/PRIVACY_POLICY.md`** — what users will see.
4. **`legal/ATTRIBUTION.md`** — what licenses require.
5. **`legal/TERMS_OF_SERVICE.md`** — the rules of use.
6. **`README.md`**, **`store/STORE_LISTING.md`**, **`web/LANDING.md`** —
   public-facing surfaces.

---

## The headlines (so you don't have to read everything)

**Privacy — the promise holds.** No advertising SDKs. No analytics. No
tracking. No device fingerprinting for profiling. No background location.
No "phone-home" pings. The owner's "free, open, no tracking" promise is
**verified true in the code**. The policy can ship with confidence.

**Security — one real release blocker.** `/api/uploads` and `/uploads`
static mounts are unauthenticated (`SparkyFitnessServer.ts:305-306,
461-462`). Today only OIDC logos are exposed (randomized filenames, low
blast radius), but it's a latent IDOR. **One-line fix:** remove both from
`publicRoutes` and gate behind `authenticate`. Plus Medium/Low items
(SQLite plaintext at rest, DB TLS no-CA, chat-route Zod gap, AI disclosure
gap) — none individually blocking.

**Attribution — two real blockers.** (1) CC BY 4.0 requires user-visible
attribution for the Open Peptide Dataset — DB columns alone are not enough;
ship an "About / Credits" screen. (2) SparkyFitness commercial-use
permission exists in writing but is held privately; confirm it's
retrievable before launch. Plus: ÆTERNA's own license choice is still
deferred — pick one (MIT/AGPL) before public release.

**Operational — owner tasks.** Rotate Fly deploy token + Neon creds (they
were in chat history). Suspend Render. Confirm `references/` stays out of
any public repo.

---

## What's NOT here (intentional)

- **Final LICENSE choice** — pending ÆTERNA decision (see
  `docs/DECISIONS.md`). Recommended given the "free, open" promise: MIT or
  AGPL-3.0.
- **App icon / brand marks** — design work, not audit work.
- **Screenshots** — need a working build; listed as a needed artifact in
  `store/STORE_LISTING.md`.
- **`pnpm licenses ls` transitive scan** — listed as soft blocker S1; needs
  the installed `node_modules` graph.
- **Cookie banner / GDPR consent pop-up** — not needed: no tracking, no
  non-essential cookies. The Privacy Policy is the entire disclosure.

---

## Status

- All deliverables drafted. Code-verified where claimed.
- Awaiting owner action on the 4 hard blockers in
  `RELEASE-BLOCKERS.md` and the 4 operational tasks.
- Safe to integrate into the public repo once the blockers close.
