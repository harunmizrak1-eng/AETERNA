# AETERNA multi-agent collaboration

This repository is developed by multiple AI agents in parallel. Chat history is
not project state. Committed code, canonical product documents, and
`docs/ACTIVE_CONTEXT.md` are project state.

## Canonical locations

- Product/document root: `C:\Users\harun\Documents\New project\AETERNA`
- Application repository: `C:\Users\harun\Documents\New project\AETERNA\aeterna-os`
- Mobile application: `aeterna-os\SparkyFitnessMobile`
- Server: `aeterna-os\SparkyFitnessServer`
- Shared contracts: `aeterna-os\shared`
- Licensed donor material: `C:\Users\harun\Documents\New project\references`

Only Codex integrates commits into `overnight/aeterna-product-integration`.
Other agents work on dedicated branches and worktrees, commit locally, and do
not push.

## Low-token start protocol

Every new agent reads only these files from the product/document root:

1. `C:\Users\harun\Documents\New project\AETERNA\AGENTS.md`
2. `C:\Users\harun\Documents\New project\AETERNA\docs\PRODUCT_SPECIFICATION_V1.md`
3. `C:\Users\harun\Documents\New project\AETERNA\docs\ACTIVE_CONTEXT.md`
4. Its section in `C:\Users\harun\Documents\New project\AETERNA\docs\AGENT_TASKS.md`

Then it runs:

```powershell
git status --short --branch
git log -10 --oneline
```

It summarizes its understanding in at most 10 lines and begins the bounded
task. Do not read the full `HANDOFF.md`, `ROADMAP.md`, `DECISIONS.md`, or the
whole source tree unless the task points to a specific section or a discovered
conflict requires it.

## Worktree ownership

- `aeterna-os`: Codex integration checkout. Other agents never edit it.
- `aeterna-os-codex-donor`: licensed donor extraction and adoption.
- HY3: dedicated `agent/hy3-*` worktree; server/shared files only when assigned.
- DeepSeek: dedicated `agent/deepseek-*` worktree; bounded implementation only.
- Claude: dedicated `agent/claude-*` worktree until its current task ends.

Before work, an agent proves its worktree is clean and based on the exact Base
SHA in its task card. If stale, it may fast-forward only after confirming the
tree is clean. It never resets, cleans, or discards unknown changes.

No two agents edit the same file set concurrently. File ownership in
`ACTIVE_CONTEXT.md` and the task card overrides general role names.

## Canonical integration

1. Agent commits a small, independently reviewable change.
2. Agent reports the commit SHA and verification evidence.
3. Codex inspects the diff and tests.
4. Codex cherry-picks accepted commits into the integration branch.
5. Codex updates `ACTIVE_CONTEXT.md` when state or ownership changes.

Agents do not update `ROADMAP.md`, `DECISIONS.md`, `HANDOFF.md`, or
`ACTIVE_CONTEXT.md` unless their task explicitly assigns documentation.

## Context and token discipline

- Prefer task-specific reads and `rg` over broad repository scans.
- Do not paste complete logs; report command, exit code, and relevant errors.
- Do not carry a large prior conversation into a new model. Start a new task
  with the four-file protocol.
- Session IDs and trajectory logs are debugging aids, not canonical memory.
- Keep repeated prompt prefixes stable so provider prompt caching can work.

## Safety and repository rules

- Never expose `.env`, API keys, database dumps, or real health data.
- Do not touch Android build, Gradle, Expo native configuration, infrastructure,
  or dependencies unless explicitly assigned.
- Preserve unrelated dirty files; use explicit staging.
- No destructive reset, clean, force-push, or blanket staging.
- Licensed donor content is handled only by the assigned donor owner.
- A task is incomplete while relevant typecheck, lint, tests, or diff checks
  fail.

## End protocol

Every agent returns the compact report in `docs/AGENT_TASK_TEMPLATE.md`. A token
limit is not completion. If interrupted, the verdict is `PARTIAL`, with dirty
files and the last successful verification listed explicitly.
