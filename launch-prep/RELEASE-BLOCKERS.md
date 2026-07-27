# ÆTERNA — Release Blockers

**Compiled:** 26 July 2026
**Source:** 3 internal audits (privacy, attribution/license, OWASP security).

This is the honest list of items that must close before a **public** release.
Items are grouped by severity and tagged with the audit that surfaced them.
Each has a concrete remediation.

---

## 🔴 Hard blockers (release cannot ship until fixed)

### B1. Unauthenticated `/api/uploads` and `/uploads` static mounts
**Audit:** security §7 (HIGH)
**Where:** `SparkyFitnessServer/SparkyFitnessServer.ts:305-306, 461-462`
**Issue:** `express.static(UPLOADS_BASE_DIR)` is mounted at both paths and
both are in `publicRoutes`, bypassing the auth gate. Every file under
`uploads/` is world-readable without authentication (except check-in
photos, which are explicitly 404'd).
**Today's exposure:** only OIDC logos/avatars (randomized filenames) — low
blast radius but a latent IDOR.
**Future exposure:** any sensitive file persisted under `uploads/` (lab
PDFs if ever written to disk, exports, backups) becomes public.
**Fix (single edit):** remove `/api/uploads` and `/uploads` from
`publicRoutes`; gate the static mounts behind `authenticate`, OR serve all
uploads via ownership-checked dynamic routes (as already done for check-in
photos).

### B2. CC BY 4.0 attribution is not user-visible
**Audit:** attribution §7
**Where:** Open Peptide Dataset seed —
`SparkyFitnessServer/db/migrations/20260718000000_seed_open_peptide_dataset.sql`
**Issue:** CC BY 4.0 requires "appropriate credit" reasonably prominent to
the recipient. Today the attribution exists only as database columns
(`source`, `source_url`) and migration comments — likely insufficient for a
shipped app.
**Fix:** add an "About / Credits" screen in the app that names "Open
Peptide Dataset (Peptides Institute), CC BY 4.0" with a link, plus
Peptidepedia/Pepmod references. Mirror the wording from
`launch-prep/legal/ATTRIBUTION.md`.

### B3. SparkyFitness commercial-use permission is private, not in-repo
**Audit:** attribution §10 (RISK)
**Where:** `docs/DECISIONS.md` (2026-07-15 entry)
**Issue:** the upstream SparkyFitness license is non-commercial by default.
Commercial-use permission was obtained in writing from codewithcj, but the
evidence is held privately by the owner, not committed. If the written
record cannot be produced on demand, the default non-commercial license
blocks any monetized or public distribution.
**Fix:** confirm the written permission is retrievable before launch. It
does not need to be committed publicly, but must exist and be producible.

### B4. ÆTERNA's own license not yet chosen
**Audit:** attribution §10 (RISK)
**Where:** repo root `aeterna-os/LICENSE` is still SparkyFitness's
non-commercial text; `docs/DECISIONS.md` (2026-07-17) records the choice
as "deferred".
**Issue:** before any public release, ÆTERNA needs its own license layered
on top of the SparkyFitness permission (MIT / AGPL / etc.). The current
LICENSE file misrepresents the project's terms.
**Fix:** record the license choice in `docs/DECISIONS.md` and update the
repo `LICENSE`. Recommended given the "free, open" product promise: a
permissive license (MIT/Apache-2.0) or strong copyleft (AGPL-3.0) if the
goal is to keep derivatives open.

---

## 🟡 Soft blockers (ship-with-caveat; fix fast post-launch)

### S1. Transitive npm license scan not run
**Audit:** attribution §10 (RISK)
**Issue:** direct dependencies look clean (MIT/Apache/BSD/ISC), but the
transitive `node_modules` graph was not exhaustively scanned. A copyleft
or non-commercial transitive package could be hiding.
**Fix:** run `pnpm licenses ls` (or `license-checker`) against the full
installed graph; flag any GPL/AGPL/BUSL/Commons-Clause/Elastic/SSPL.

### S2. AEON data-sharing has no in-app disclosure or per-category toggle
**Audit:** security §8 (Medium), privacy §5
**Issue:** BYOK is defensible implicit consent, but there's no UI listing
what tool categories a configured AI service can read, and no per-category
opt-out ("send food but not biometrics"). The Privacy Policy discloses it,
but the app does not surface it.
**Fix:** add a "Data shared with AEON" disclosure + per-category opt-out;
log tool calls server-side for user-visible audit.

### S3. SQLite local DB is plaintext at rest
**Audit:** security §1 (Medium)
**Issue:** `aeterna.db` is not field-encrypted; relies on OS-level full-disk
encryption. Acceptable for most threat models, insufficient against device
forensic access.
**Fix:** enable SQLCipher via `expo-sqlite` with a per-user key in
SecureStore. **Disclosed in Privacy Policy §3, §10 meanwhile.**

### S4. Server→DB TLS uses `rejectUnauthorized: false`
**Audit:** security §2 (Medium caveat)
**Where:** `SparkyFitnessServer/db/poolManager.ts:14`
**Issue:** DB TLS connection does not validate the server certificate,
exposing it to MitM between server and DB host.
**Fix:** bundle the provider CA and use `rejectUnauthorized: true` with
`ca: <pem>`.

### S5. Missing Zod schema on `/api/chat` body
**Audit:** security §5 (Low)
**Where:** `SparkyFitnessServer/routes/chatRoutes.ts:47`
**Issue:** chat payload destructured raw; validation is downstream runtime
shape checks. Defense-in-depth gap, not exploitable.
**Fix:** add a Zod schema to fail fast on malformed payloads.

### S6. Support/security email not filled
**Audit:** all three
**Issue:** Privacy Policy and Terms reference `[support email]` and
`[security email]` placeholders.
**Fix:** create a contact address before publishing; substitute everywhere.

### S7. Existing `SparkyFitnessMobile/PRIVACY_POLICY.md` is a stale stub
**Audit:** privacy §6
**Issue:** the in-repo `SparkyFitnessMobile/PRIVACY_POLICY.md` still has
`[Date]` and `[Your Support Email]` placeholders and does not cover
AI/LLM disclosure, IP/session retention, or operational logs.
**Fix:** replace with the new `launch-prep/legal/PRIVACY_POLICY.md` content
(or link to it from the app) before release.

---

## 🟢 Operational tasks (owner, not code)

### O1. Rotate the Fly.io deploy token
The deploy token was shared in chat to perform the Render→Fly migration. It
must be rotated at https://fly.io/app/personal-access-tokens.

### O2. Rotate Neon DB credentials
The `.env` file's Neon password, app-DB password, encryption key, and
Better-Auth secret were visible in chat history. Rotate all four and update
Fly.io secrets (`flyctl secrets set -a aeterna-os ...`).

### O3. Suspend/delete the Render service
The old Render `aeterna-api` service is now superseded by Fly.io. Suspend or
delete it from the Render dashboard.

### O4. Confirm `references/` is excluded from any public repo
**Audit:** attribution §10 (RISK)
The `references/` folder contains scraped/decompiled competitor artifacts
(pepy1, peptiqgg, lifehack, longec) and GPL/AGPL reference clones. These
must **not** be committed to a public ÆTERNA repo — they would import the
upstream licenses' obligations and the decompile provenance. The folder
already sits outside the git-tracked `aeterna-os/` tree; verify this stays
true on any mirror.

---

## Cross-reference

- Privacy findings → `launch-prep/legal/PRIVACY_POLICY.md`
- Attribution findings → `launch-prep/legal/ATTRIBUTION.md`
- Security details → `launch-prep/SECURITY-AUDIT.md`
