# ÆTERNA Security Audit — OWASP MASVS Lite

**Audit date:** 26 July 2026
**Scope:** `SparkyFitnessMobile/src`, `SparkyFitnessServer/`
**Method:** read-only code audit against OWASP MASVS (Mobile Application
Security Verification Standard) lite checklist.

This is an honest, evidence-cited snapshot of the security posture as of the
audit date. Findings are verdicted PASS / FAIL / GRAY AREA with severity and
a one-line remediation. Release blockers are summarized in
`launch-prep/RELEASE-BLOCKERS.md`.

---

## Summary

| # | Domain | Verdict | Severity |
|---|--------|---------|----------|
| 1 | Data at rest (mobile) | GRAY AREA | Medium |
| 2 | Data in transit | PASS (1 Medium caveat) | — |
| 3 | Authentication | PASS | — |
| 4 | Secrets in code | PASS (.env not leaked) | — |
| 5 | Input validation (server) | PASS (1 Low gap) | — |
| 6 | Authorization (RLS) | PASS | — |
| 7 | File upload security | PASS / 1 GRAY (High latent) | **High (latent)** |
| 8 | AI / LLM data leak | GRAY AREA | Medium |
| 9 | Deep links / WebView | PASS | — |
| 10 | Background sync | PASS | — |

**Critical:** none.
**High (release-blocker):** 1 latent — unauthenticated `/api/uploads` and
`/uploads` static mounts (see §7).
**Medium:** SQLite plaintext at rest (§1); DB TLS `rejectUnauthorized:false`
(§2); AI data-sharing disclosure gap (§8).
**Low:** missing Zod schema on chat payload (§5).

---

## 1. Data at rest (mobile) — GRAY AREA, Medium

**Good**: server configs (API keys, session tokens, proxy headers) are stored
in **SecureStore** (iOS Keychain / Android Keystore), not AsyncStorage
(`storage.ts:91,95`). Legacy plaintext keys are actively migrated out
(`storage.ts:178-237`). AsyncStorage holds only non-sensitive metadata
(`id`, `url`, `authType`) and UI prefs.

**Gap**: the local SQLite database (`aeterna.db`, `db/db.ts:5`) is **not
field-encrypted**. Health records (protocols, doses, labs, biomarkers,
symptoms, food, exercise, measurements, water) are stored as plaintext JSON.

**Risk**: on a non-jailbroken device with a passcode, iOS Data Protection
and Android file-based encryption protect the container at rest, so this is
acceptable for most threat models. If the threat model includes device
forensic access or a malware with root, plaintext JSON is recoverable.

**Remediation**: enable SQLCipher encryption via `expo-sqlite` with an
encryption key stored in SecureStore (per-user, generated on first run).
Document the residual risk in the Privacy Policy in the meantime (done —
see `PRIVACY_POLICY.md` §3, §10).

---

## 2. Data in transit — PASS (Medium caveat)

- **HTTPS enforced client-side**: `apiClient.ts:39-41` rejects `http://` in
  production; same guard in `authService.ts:248,326,617,724`.
- **iOS ATS locked down**: `app.config.ts:134-136`
  (`NSAllowsArbitraryLoads: false`).
- **No TLS bypass** in client traffic (no `rejectUnauthorized` hits outside
  the server DB pool).
- **No plaintext protocols**.

**Caveat (Medium)**: `poolManager.ts:14` uses `rejectUnauthorized: false`
for the server→Postgres TLS connection. This disables certificate
validation, exposing the DB connection to MitM between server and DB host.
Acceptable for some managed-Postgres providers using non-standard CAs, but
not ideal.

**Remediation**: bundle the provider CA and use `rejectUnauthorized: true`
with `ca: <pem>`, or document the accepted residual MitM risk.

---

## 3. Authentication — PASS

- Bearer-token sessions sourced from SecureStore (`authService.ts:91-96`).
- Tokens never in AsyncStorage; cleared on logout (`authService.ts:513-517`).
- Server-side session expiry 30 days, refresh 24h (`auth.ts:246-247`); 401
  triggers `notifySessionExpired` client-side (`apiClient.ts:73-74`).
- No hardcoded credentials; secrets from `process.env`.
- Rate limiting on auth endpoints (`auth.ts:213-218`).
- **Passkey** flow uses a single-use short-lived ticket, not a long-lived
  token in a URL (`authService.ts:817-887` — token in fragment, not query).
- MFA available (TOTP + email OTP), trusted-origin header validation.

No remediation required.

---

## 4. Secrets in code — PASS

- No hardcoded `sk_`, `pk_`, `AIza`, `ghp_`, `xoxb-`, `AKIA` patterns, no
  base64 blobs resembling keys in source.
- Server encryption key (`security/encryption.ts:3`) and DB creds
  (`poolManager.ts`) come from env vars.
- **`.env` is gitignored** and confirmed not tracked in git. It contains
  live Neon credentials on disk; rotate out of caution, and confirm no
  cloud-sync folder mirrors the working tree.

---

## 5. Input validation — PASS (Low gap)

- Server routes use **Zod consistently** on sensitive domains —
  `biomarkerResultRoutes.ts`, `protocolRoutes.ts`, `medicationRoutes.ts`
  all `safeParse` and return structured 400s.
- **SQL injection — PASS**: every repository uses `pg` parameterized
  queries (`$1, $2…`). Dynamic WHERE construction pushes values into a
  params array, never string-interpolates values into SQL
  (e.g. `biomarkerResultRepository.ts:30-41`).

**Gap (Low)**: `chatRoutes.ts:47` destructures `req.body` raw (no Zod schema
on the chat payload); validation happens as runtime shape checks inside
`chatService.processChatMessage`. The `custom_url` is still SSRF-validated
(`chatRoutes.ts:107-130`), and downstream type-checks make this defense in
depth, not an exploitable hole.

**Remediation**: add a Zod schema for the `/api/chat` POST body to fail
fast on malformed payloads.

---

## 6. Authorization (RLS) — PASS

- **Per-request RLS via Postgres session vars**: `poolManager.ts:96-99` runs
  `SELECT public.set_app_context($1, $2)` on every checked-out client,
  binding `app.user_id` so Postgres RLS policies enforce row scoping
  server-side. `getClient` throws if `userId` is missing.
- Verified on sensitive routes — biomarker-results
  (`biomarkerResultRoutes.ts:43-44`), protocols (`protocolRoutes.ts:36-37`),
  medications (`medicationRoutes.ts:41-42`) all apply delegate + per-permission
  checks.
- **No cross-user read path found** in the three sensitive domains.
- Delegate authorization is bounded (`onBehalfOfMiddleware.ts:18-23`,
  `checkPermissionMiddleware.ts:29-39`); admin predicate always uses the
  authenticated user, preventing privilege escalation
  (`authMiddleware.ts:153`).

No remediation required.

---

## 7. File upload security — PASS for imports, **HIGH (latent)** for static serving

**Imports — PASS**:
- Lab CSV: memory storage, 2 MB limit, mimetype allowlist, never touches
  disk (`biomarkerResultRoutes.ts:49-63`). Filenames sanitized and stored
  only as metadata.
- Lab PDF: memory storage, 10 MB, PDF-only, explicit 413/415 handlers
  (`:69-80`).
- Check-in photos: 10 MB + **real magic-byte signature check**
  (`checkInPhotoUpload.ts:60-74`); path traversal guarded
  (`checkInPhotoService.ts:30-34`); public static path explicitly 404'd
  (`SparkyFitnessServer.ts:298-304`).
- Exercise image serving: traversal guard with `startsWith(baseDir)` check
  (`SparkyFitnessServer.ts:357-399, 436-443`).

**HIGH (release-blocker)** — `SparkyFitnessServer.ts:305-306, 461-462`:
`express.static(UPLOADS_BASE_DIR)` is mounted at BOTH `/api/uploads` and
`/uploads`, and both are added to `publicRoutes`, so the auth gate
(`:470-484`) **skips them entirely**. Result: every file under `uploads/`
is **world-readable without authentication** (except check-in photos which
are explicitly 404'd).

- **Current exposure**: limited — `uploads/` today holds only
  `uploads/avatars` (OIDC logos/avatars), and OIDC logo upload uses a
  randomized filename (`oidcLogoUpload.ts:25-33`), mitigating direct
  enumeration.
- **Future risk**: any sensitive file persisted under `uploads/` (lab PDFs
  if ever written to disk, backups, exports) becomes public-downloadable
  with no auth.

**Remediation**:
1. Remove `/api/uploads` and `/uploads` from `publicRoutes`.
2. Gate the static mounts behind `authenticate`, OR serve all user-owned
   uploads through ownership-checked dynamic routes (as already done for
   check-in photos).
3. Never persist anything sensitive under `uploads/`.

---

## 8. AI / LLM data leak — GRAY AREA, Medium

- **What AEON sends**: the chat agent loads a tool surface
  (`chatService.ts:551-586`) including `checkinTools`
  (`ai/tools/checkinTools.ts:1-15`) which reads measurements, biometrics,
  sleep, mood, fasting — scoped to `req.userId` (RLS-safe, see §6). The
  configured model therefore receives the user's health data when a tool is
  invoked.
- **Bring-your-own-key**: the user picks their own AI service + API key
  (`chatService.ts:118-184`), AES-256-GCM-encrypted at rest
  (`security/encryption.ts:31-40`); key never returned in responses
  (`chatService.ts:163-168`). This is the implicit consent mechanism.
- **SSRF guard** on custom AI URLs (`chatRoutes.ts:107-130`,
  `outboundUrlPolicy.ts`).
- **Self-hosted option**: Ollama/compatible — data never leaves the user's
  infrastructure.

**Gap (Medium)**:
- No per-feature toggle ("send food/exercise to AI but not biometrics").
- No in-app UI listing what categories of data a given chat turn exposes.
- No server-side audit log of what was transmitted beyond
  `executedToolsList` in the response.

**Remediation**:
1. Add an explicit "Data shared with AI" disclosure in the AEON settings,
   listing tool categories active for the configured service.
2. Add a per-category opt-out toggle.
3. Log tool calls (names + targets) server-side for a user-visible audit
   trail.
4. State the BYOK data-sharing fact in the Privacy Policy (done — see
   `PRIVACY_POLICY.md` §5).

---

## 9. Deep links / WebView — PASS

- No `react-native-webview` / `WebView` usage anywhere in `src`.
- `Linking` / `WebBrowser` confined to SSO/passkey flows; `openAuthSessionAsync`
  restricted to the trusted callback `sparkyfitnessmobile://oauth-callback`
  (`authService.ts:565,734,871`).
- No handler routes arbitrary deep-link paths into sensitive actions; OAuth
  callback validates `result.type === 'success'` and parses only
  `token`/`email`/`role` from the fragment.

No remediation required.

---

## 10. Background sync — PASS

- iOS keychain accessibility correct: `AFTER_FIRST_UNLOCK`
  (`storage.ts:45`) — tokens readable in background after first unlock,
  never when freshly booted and locked (BFU).
- Device-locked handling: `backgroundSyncService.ts:172-190` detects
  HealthKit "database inaccessible" (device locked) and bails out without
  advancing the sync cursor — neither leaks data nor silently drops it.
- Background sync is **opt-in** (`storage.ts:419`, default false).
- No sensitive data logged in background paths (only metric ids and counts,
  `backgroundSyncService.ts:153,193`).

No remediation required.

---

## Priority order

1. **HIGH — gate `/api/uploads` and `/uploads` behind auth** (§7). Single
   edit to `SparkyFitnessServer.ts`. **Release blocker.**
2. **Medium — AI data-sharing disclosure + per-category opt-out** (§8).
   Partially addressed in Privacy Policy; UI work remains.
3. **Medium — bundle Postgres CA, drop `rejectUnauthorized:false`** (§2).
4. **Medium — SQLCipher for local SQLite** (§1). Larger native job; document
   the residual risk meanwhile.
5. **Low — Zod schema on `/api/chat` body** (§5). Defense in depth.
