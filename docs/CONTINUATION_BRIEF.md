# ÆTERNA — Continuation brief for the next Claude session

**Written:** 2026-07-24, Europe/Istanbul
**Written by:** Claude (Opus 4.8), consolidation pass
**Audience:** The next Claude Code session/branch picking this project up. Read
this file, then `AGENTS.md`, then `docs/ACTIVE_CONTEXT.md`, in that order.
This file explains *why* things are the way they are; `ACTIVE_CONTEXT.md`
stays the compact, current-state pointer for day-to-day work.

---

## 1. Who the owner is and what they actually want

The owner is Harun Mızrak (`h4runx310@gmail.com`), building this solo with AI
agents as the entire engineering team — there is no other human developer.
He has been running work across **many parallel AI agents and cloud
sessions** (Codex, HY3, DeepSeek, GLM, OpenRouter, Claude, a separate Claude
Code *cloud* session at `claude.ai/code`, and others) each in their own git
worktree. As of **2026-07-24 he explicitly decided to stop that pattern**:

> "şimdi tüm herşeyi sadece sen yapacaksın" — "from now on, only you
> [this Claude session] will do everything."

He confirmed three things explicitly when asked:
1. Codebase foundation: merge **both** the coordinated canonical branch
   (`overnight/aeterna-product-integration`) **and** the cloud session branch
   (`origin/claude/peptid-app-screen-issue-0c0gxg`) — not pick one and
   discard the other.
2. The 5-agent parallel structure described in `docs/AGENT_TASKS.md` /
   `docs/ACTIVE_CONTEXT.md` (HY3, DeepSeek ×2, GLM-5.2, OpenRouter) is
   **retired**. Their worktrees were checked, their in-progress work was
   preserved (see §3), and they are stopped — not deleted, not silently
   discarded.
3. All of ÆTERNA should be pushed to the (private) GitHub remote
   (`harunmizrak1-eng/AETERNA-OS`) rather than kept as scattered local
   worktrees — recommended by this session and approved by the owner.

**What this means for you (the next session):** you are not one of several
agents anymore. You are the only active development agent. There is no
"lane" to stay in — read the whole current state (this file +
`ACTIVE_CONTEXT.md` + `docs/ROADMAP.md`) and act as the sole owner of
implementation, the way Codex used to, until the owner says otherwise.

## 2. Product, in brief (see `docs/PRODUCT_SPECIFICATION_V1.md` for the full spec)

ÆTERNA is a **peptide-first longevity operating system**, built on the
SparkyFitness open-source monorepo as its *only* technical foundation (never
add a second app foundation — this is a permanent decision in `AGENTS.md`).
It is explicitly **not** a forked fitness tracker, not a supplement store,
not a social network, not a diagnostic or autonomous-prescribing system.

Core loop: **Protocol → Action → Observation → Review → Informed
adjustment.**

Primary navigation (mobile): **Today, Protocol, Biomarkers, Track, Library,
Community** — six tabs, `Add` as a center action, `Settings` off to the
side. Today is agenda-first, never a metric dashboard. No opaque
health/readiness/longevity score, ever. "Evidence Before Protocol" — never
diagnose, prescribe, promise outcomes, or invent evidence; compound/protocol
content is reference/education only.

Business model: **completely free, no subscription, no ads, no user
tracking.** Fixed, not up for revisiting casually.

The product is the union of: peptide/compound knowledge library (Open
Peptide Dataset CC BY 4.0 + licensed Pepty/PeptIQ/Peppedia/etc. donor
content, all with owner-obtained written permission — see
`docs/DECISIONS.md` 2026-07-15 and 2026-07-17 entries, do not re-litigate),
protocols with versioned schedules, dose/injection logging, medication
pens/vial inventory, biomarker results with provenance and conflict
detection, a Body Atlas (2D injection-site + compound-effect map), a
topic-based "Study Club" community (Discourse-backed, **not** a Discord-style
feed — see `docs/DECISIONS.md` 2026-07-15), Weekly Review, and (later,
lower priority) AEON chat, nutrition, and training folded into Today rather
than given new primary tabs.

Full staged rollout, exit gates, and non-goals: `docs/ROADMAP.md`
(authoritative for what's in/out of active scope right now — read it before
starting anything that isn't obviously part of the current stage).

## 3. What actually happened in this consolidation session (2026-07-24)

### 3.1 The branch/worktree situation before this session

19 git worktrees existed under `AETERNA/`, each a full checkout of the
`aeterna-os` repo on its own branch — one per agent/task, per
`docs/AI_COLLABORATION.md`'s worktree-ownership model. Separately, a **cloud**
Claude Code session had been running against `origin/claude/peptid-app-screen-issue-0c0gxg`
and had drifted significantly ahead (83 commits) of the last
canonically-integrated local state.

### 3.2 What this session verified before touching anything

- `agent/final-aeterna-integration` (the most \"integrated\" local branch, 53
  commits, already pushed) was a **strict ancestor** of
  `origin/claude/peptid-app-screen-issue-0c0gxg`. That branch is the true
  superset for the *core integration lineage*.
- Grepped the cloud branch's full 83-commit history for `.env` files and
  `.apk` binaries — none were ever committed. Safe to merge/push from a
  secrets/binary-bloat standpoint.
- **Important correction to an earlier assumption in this same session:**
  it was initially assumed the cloud branch subsumed *every* worktree
  branch. That was wrong. When re-checked with
  `git merge-base --is-ancestor <branch> HEAD` after the merge landed, 13 of
  the ~18 agent branches had real, un-integrated unique commits (1–7 commits
  each) that the cloud branch did **not** contain — real work from HY3,
  DeepSeek (×3 branches), GLM-5.2, OpenRouter, Codex donor/ux branches, an
  `aeon-readonly` branch, and the standalone `fix/rls-matrix-stage1a-tables`
  branch. **Do not assume any branch is redundant without checking
  `git merge-base --is-ancestor` yourself first.**

### 3.3 What this session did, in order

1. **Committed genuinely-safe local uncommitted work** in the main
   `aeterna-os` checkout: a Windows Metro bundler fix
   (`SparkyFitnessMobile/metro.config.js` — scoped `watchFolders` to avoid
   Expo SDK 56's monorepo auto-detection trying to watch the entire
   `node_modules` tree, which hangs forever with no Watchman on Windows) and
   registering the `expo-sharing` plugin in `app.config.ts`. Commit
   `1ca6da18`.
2. **Parked (stashed) an uncertain local `package.json`/`pnpm-lock.yaml`
   Expo sub-version bump** that had one suspicious downgrade
   (`react-native-keyboard-controller` 1.21.14→1.21.6) with no test evidence
   — rather than commit it blind.
3. **Merged `origin/claude/peptid-app-screen-issue-0c0gxg` into
   `overnight/aeterna-product-integration`.** Clean, no conflicts (verified
   — `app.config.ts` was touched by both sides but merged automatically
   without markers). Merge commit `7f140bfa`. This brought in ~83 commits:
   PDF/CSV lab import + OCR fallback, biomarker provenance/retest/annotation
   backend, recommendations engine scaffolding, protocol experiments,
   Discourse identity/SSO groundwork, AI usage quota, full ÆTERNA branding
   sweep (web + mobile + email templates), sign-up flow, App Store
   submission prep (iOS privacy manifests, icon alpha fix), and more. See
   `git log 1ca6da18..7f140bfa` for the exhaustive list.
4. **Dropped the parked stash** after confirming the merged `package.json`
   already carried a newer, more complete dependency set (including
   `expo-document-picker`/`expo-location` that the stash's older base
   didn't have) — the stash was stale/superseded, not a real loss.
5. **Ran `pnpm install`** from repo root (new deps from the merge weren't
   in `node_modules` yet — this is *why* the first post-merge typecheck
   failed with `Cannot find module 'expo-location'` / `'expo-document-picker'`;
   not a real bug, just a missing install step).
6. **Verified clean state:** mobile `tsc --noEmit` clean, server
   `tsc --noEmit` clean, no unresolved merge conflicts.
7. **Pushed** the merged branch: `origin/overnight/aeterna-product-integration`
   now at `7f140bfa` (was `e99a3166`).
8. **Preserved every agent worktree's work before removing anything:**
   - Pushed all 13 branches that had real unique commits directly to origin
     as their own remote branches (no rebasing, no squashing — exact
     history preserved): `agent/aeon-readonly`,
     `agent/claude-product-coherence-backend`, `codex/donor-adoption`,
     `codex/ux-hardening`, `agent/deepseek-faz-b-community-mobile`,
     `agent/deepseek-golden-path-closure`, `agent/deepseek-lab-pdf-import`,
     `agent/deepseek-nutrition-core-v2`, `agent/glm-labs-response-intelligence`,
     `agent/hy3-faz-b-community-server`, `agent/laguna-community-integration`,
     `agent/openrouter-training-core`, `agent/laguna-release-integration`.
   - Found **6 worktrees also had real uncommitted (dirty) changes** on top
     of their branch tips: `aeterna-glm-coherence`,
     `aeterna-os-final-integration`, `aeterna-os-integrated-ux`,
     `aeterna-os-laguna-integration`, `aeterna-os-stepfun-ux`. Each was
     committed as an explicit, clearly-labeled `wip: parked in-progress
     changes before worktree cleanup` commit on its own branch, then
     pushed. **Nothing was reviewed, evaluated, or integrated — these are
     raw, as-found snapshots of other agents' unfinished work,** preserved
     so they're not lost, not endorsed as correct or mergeable.
   - Only *then* removed the local worktree checkouts
     (`git worktree remove`, not branch deletion — every branch above still
     exists locally and on origin). This is what freed the bulk of local
     disk space; see §4.

### 3.4 What this session explicitly did NOT do

- Did **not** review, evaluate, cherry-pick, or merge any of the 13
  preserved agent branches into the canonical branch. They exist as
  parked, reachable history on origin — someone (you, next session) needs
  to actually look at each one, decide what's real/duplicate/superseded/
  stale, and integrate or discard deliberately. **This is very likely your
  first real task.**
- Did **not** delete any branch, local or remote. Worktree removal only
  unlinks the working-directory checkout; `git branch -a` / `git log
  <branch>` still shows everything.
- Did **not** yet update `docs/ACTIVE_CONTEXT.md`'s "Active ownership"
  section to formally retire the 5-agent structure, or its "Canonical
  application state" HEAD pointer (still says `821597a4`, now stale — real
  HEAD is `7f140bfa`). That update should land alongside or immediately
  after this brief.

## 4. Disk space

The machine was at **1.6 GB free out of 119 GB (99% full)** when this
session started cleanup — critical. 19 full monorepo checkouts (each with
its own `node_modules`, and several with `ios/Pods`) is the cause. After
worktree removal only the canonical `aeterna-os` checkout remains under
`AETERNA/`. Other large items noticed but not yet acted on:
- `AETERNA-v1.5.0-build4.apk` (194 MB) at the outer `AETERNA/` root — an old
  build artifact, not source. Safe to delete once you don't need it as a
  reference, or move it out of the repo tree entirely (it should never be
  committed — check `.gitignore` covers `*.apk`).
- `references/` (52 MB) — **correction, verified 2026-07-24 after this
  brief's first draft:** this is not licensed donor content. It's a full
  third-party clone of Lemmy (open-source forum software, its own nested
  `.git`), presumably pulled as implementation reference for Study Club.
  It's a local research clone, not project source — safe to delete if disk
  space is needed, or leave as a reference; either way it should never be
  committed (it's someone else's repo with its own history).
- `docs/docs.zip` (160 KB) — trivial, ignore.

If disk is still tight, the next biggest win is deleting `node_modules` and
regenerating with `pnpm install` only when actively working (git-ignored
already, doesn't affect repo state), or moving `AETERNA-v1.5.0-build4.apk`
off this disk.

## 5. Where the `.env` file is

**`C:\Users\harun\Documents\New project\AETERNA\aeterna-os\.env`** — this is
the real, populated runtime config (gitignored, never commit it). It points
at a **Neon Postgres** instance (not Supabase — Supabase was tried and
proved incompatible: it permanently reserves the `auth` schema for GoTrue
and refuses `GRANT CREATE ON SCHEMA auth`, but `InitialDB.sql` needs to own
`auth`). All 199+ migrations are applied there, RLS policies + grants are
live, cross-user isolation is verified. See `docs/HANDOFF.md`'s "Live
Postgres — RESOLVED on Neon" section for the full story, including a real
RLS gap that was found and fixed there (11 ÆTERNA tables had policies
defined but RLS never enabled — a genuine security bug, now fixed both in
the live Neon DB and in `SparkyFitnessServer/db/rls_policies.sql`).

Every other `.env.example` / `.env.local` found across the various worktree
copies is either a template or a stale per-worktree duplicate — not
authoritative.

**Still outstanding:** `db_schema_backup.sql` was never re-synced against
the live Neon schema because `pg_dump` isn't installed in this environment.
Run `./db_backup.sh` (or `DB Backup.cmd` on Windows) from repo root on a
machine that has `pg_dump`, then commit the result.

## 6. Known open items you'll likely pick up next

In rough priority order, based on `docs/ACTIVE_CONTEXT.md` and
`docs/HANDOFF.md` at time of writing (re-verify against those files
directly — they may have moved on):

1. **Review and integrate (or explicitly discard) the 13 preserved agent
   branches from §3.3.** This is the direct consequence of retiring the
   parallel-agent model — that work doesn't just disappear, it needs a
   real decision now that one agent (you) owns integration.
2. Study Club / Community: replies via Discourse `POST /posts.json`,
   bounded pagination, topic search, honest `identityMode` capability
   endpoint, notification seams, moderation validation — flagged as
   incomplete by the owner mid-session ("Discourse backend adapter alone
   does NOT complete Community").
3. Peptide golden path end-to-end verification: Compound → Protocol →
   schedule/dose → reminder → Today → taken/skipped/injection → vial/
   inventory → symptom → Weekly Review. Most legs are implemented per
   `docs/ACTIVE_CONTEXT.md`; verification and visible relationship wiring
   remain.
4. Faz C: replace the Body Atlas's heuristic `mechanism_summary`-derived
   compound-effect mode with a real evidence-linked server contract.
5. `db_schema_backup.sql` sync (needs `pg_dump`, see §5).
6. Update `docs/ACTIVE_CONTEXT.md` and `docs/AGENT_TASKS.md` to reflect
   the retirement of the 5-agent structure (in progress alongside this
   brief — check git log for whether it landed).

## 7. Working conventions that still apply

Nothing about the *how* changed — only *who*. Everything in `AGENTS.md`,
`docs/AI_COLLABORATION.md`, and the package-level `AGENTS.md` files
(`SparkyFitnessMobile/AGENTS.md`, `SparkyFitnessServer/AGENTS.md`, etc.)
still governs: smallest coherent change, typecheck discipline
(`--incremental`, package-scoped before commit), touched-files-only lint
with `--max-warnings 0`, no destructive git ops without explicit
confirmation, `docs/DECISIONS.md` for material scope/architecture calls,
`docs/HANDOFF.md` updated before yielding the project. The multi-agent
*coordination* machinery (worktree ownership, file collision boundaries,
task cards) is what's retired — the actual engineering discipline is not.

## 8. Verification evidence for this session's changes

- Mobile `pnpm run typecheck` (`tsc --noEmit`, full repo): clean, 0 errors.
- Server `pnpm run typecheck`: clean, 0 errors.
- No merge conflicts on the `origin/claude/peptid-app-screen-issue-0c0gxg`
  merge; verified via `git status` immediately after (`git status --short |
  grep -E "^(UU|AA|DD|AU|UA|UD|DU)"` returned nothing).
- `git push origin overnight/aeterna-product-integration`:
  `e99a3166..7f140bfa`, succeeded.
- Full test suites (`pnpm run test:run` mobile, `pnpm test` server) were
  **not** re-run end-to-end this pass — only typecheck. Recommend running
  them before your first real feature commit on top of this merge, since an
  83-commit merge is large enough that a typecheck pass alone doesn't prove
  test-level correctness.
