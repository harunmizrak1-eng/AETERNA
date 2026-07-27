# ÆTERNA backend deployment — Fly.io

> Migrated from Render free tier (15-min sleep) to Fly.io on 2026-07-25.
> See `docs/DECISIONS.md` (2026-07-25) for the architecture decision.

## What lives where

| Component | Host | Notes |
|---|---|---|
| Express server (`SparkyFitnessServer`) | **Fly.io** (`aeterna-os.fly.dev`) | This file documents its deploy |
| Postgres DB | **Neon** (`ep-noisy-union-auqe93vv…neon.tech`) | Unchanged from Render. Carry-over. |
| Mobile client | EAS / standalone APK | User points it at any server URL via Settings |

The server container is **stateless** — no volumes, no local DB. All state lives in Neon. Re-deploys and machine restarts lose nothing.

## Prerequisites

- `flyctl` installed (`iwr https://fly.io/install.ps1 | iex` on Windows PowerShell)
- `FLY_API_TOKEN` env var set, **or** `flyctl auth login` (browser)
- Working dir: `aeterna-os/` (where `fly.toml` and `docker/Dockerfile.backend` live)

## First-time / clean deploy

```bash
cd aeterna-os
flyctl deploy --dockerfile docker/Dockerfile.backend --strategy rolling
```

What happens on boot:
1. Container starts, runs `tsx index.ts`.
2. `index.ts` → `dotenv` → `loadSecrets` → `preflightChecks` (7 mandatory env vars — exits 1 if any missing).
3. `SparkyFitnessServer.ts:810` runs `applyMigrations()` against Neon — **215 migrations, idempotent, skips already-applied**.
4. `applyRlsPolicies()` runs (45 KB of RLS).
5. Server listens on internal port 3010.
6. Fly's healthcheck (`GET /api/health`) passes after 60s grace period.
7. Edge routes traffic to `https://aeterna-os.fly.dev`.

First boot can take 60–120s for migrations. Subsequent boots are fast (all migrations already recorded).

## Update an existing deploy

Same command — Fly does a rolling swap:

```bash
flyctl deploy --dockerfile docker/Dockerfile.backend --strategy rolling
```

## Secrets

Set once, never in code/git:

```bash
flyctl secrets set -a aeterna-os \
  SPARKY_FITNESS_DB_HOST=... \
  SPARKY_FITNESS_DB_PORT=5432 \
  SPARKY_FITNESS_DB_NAME=... \
  SPARKY_FITNESS_DB_USER=... \
  SPARKY_FITNESS_DB_PASSWORD=... \
  SPARKY_FITNESS_APP_DB_USER=... \
  SPARKY_FITNESS_APP_DB_PASSWORD=... \
  SPARKY_FITNESS_DB_SSL=require \
  SPARKY_FITNESS_API_ENCRYPTION_KEY=... \   # MUST match Neon-stored ciphertext (AES-256-GCM)
  BETTER_AUTH_SECRET=... \                   # MUST match or sessions break
  SPARKY_FITNESS_FRONTEND_URL=https://aeterna-os.fly.dev \
  SPARKY_FITNESS_PUBLIC_API_DOCS=false \
  NODE_ENV=production
```

### Non-negotiable carry-overs

If you change these, existing data/sessions break:
- `SPARKY_FITNESS_API_ENCRYPTION_KEY` — decrypts stored AI provider keys + OAuth creds in Neon. Wrong key = GCM auth-tag failure = unrecoverable.
- `BETTER_AUTH_SECRET` — signs session cookies. Wrong secret = every existing session invalid.

### Optional (Discourse, Garmin, AI bootstrap)

```bash
flyctl secrets set -a aeterna-os \
  DISCOURSE_BASE_URL=https://aeterna.discourse.group \
  DISCOURSE_API_KEY=... \
  DISCOURSE_API_USERNAME=...
# GARMIN_MICROSERVICE_URL — skipped (Garmin sidecar not deployed)
# OPENAI_API_KEY / AEON_SYSTEM_PROMPT — optional AEON bootstrap
```

## Verify

```bash
# Health
curl -i https://aeterna-os.fly.dev/api/health

# Auth reachable
curl -i https://aeterna-os.fly.dev/api/auth/ok

# Boot / migration log
flyctl logs -a aeterna-os | grep -iE "migration|RLS|listening|preflight"

# Secret list (values masked)
flyctl secrets list -a aeterna-os
```

## Point the mobile app at it

No code change. In the app: **Settings → Server URL → `https://aeterna-os.fly.dev`**.
`apiClient.ts` `getActiveServerConfig()` resolves the URL at runtime.

## Memory / scale

Current: 1 shared-cpu-1x VM, 1GB RAM (sized for the 215-migration boot spike).

```bash
fly scale memory 512 --app aeterna-os    # shrink after first boot if stable
fly scale count 2 --app aeterna-os       # HA (free tier allows up to 3 shared VMs)
fly scale count 1 --app aeterna-os       # back to single
```

`auto_stop_machines = false` + `min_machines_running = 1` in `fly.toml` means **never sleeps** — the whole point of moving off Render.

## Rollback

```bash
flyctl releases -a aeterna-os           # list versions
flyctl deploy --dockerfile docker/Dockerfile.backend --image-label <prev-version>
```

## Common failures

| Symptom | Cause | Fix |
|---|---|---|
| Boot exit 1, "PreflightChecks failed" | Missing env var | `flyctl secrets list`, compare to required set above |
| Healthcheck failing, machine restarts | Migration slow / OOM | Bump memory: `fly scale memory 2048` |
| 502 from edge | App crashed mid-boot | `flyctl logs -a aeterna-os` for stack trace |
| Sessions all invalid | `BETTER_AUTH_SECRET` rotated | Restore previous value (sessions are DB-backed + signed) |
| AI provider keys fail to decrypt | `SPARKY_FITNESS_API_ENCRYPTION_KEY` rotated | Restore previous value (ciphertext in DB unusable otherwise) |
| DB connection refused | Neon IP allowlist | Neon allows all by default; check `SPARKY_FITNESS_DB_SSL=require` |

## Token rotation

The deploy token in your local env / CI is a credential. Rotate on schedule:
1. https://fly.io/app/personal-access-tokens → delete old token
2. Create new, update wherever it's stored (CI secrets, local env).
