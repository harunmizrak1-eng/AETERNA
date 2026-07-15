# Codex and Claude Code collaboration

This project is worked on sequentially by Codex and Claude Code. They share the
same Git repository and transfer context through committed code, canonical docs,
and `docs/HANDOFF.md`. Chat history is not treated as project state.

## Canonical location

```text
C:\Users\harun\Documents\New project\AETERNA
```

Both tools must open this exact directory as the project root. Do not create a
second copy for ordinary handoffs. Reference repositories remain read-only at:

```text
C:\Users\harun\Documents\New project\references
```

Only add that directory to a Claude session when an approved donor audit needs
it. Never make a donor repository the application root.

## Ownership rule

- Only one AI agent may edit the project at a time.
- The active agent owns the working tree until it writes a handoff.
- Do not start the other agent while a command, test, formatter, dev server, or
  migration is still running.
- Do not discard, reset, stage, or rewrite changes whose ownership is unclear.
- A token limit is not a reason to make a rushed commit. Leave an explicit
  partial handoff with the exact dirty files and verification state.

## Start-of-session checklist

1. Open the canonical project root.
2. Read `AGENTS.md`, `docs/HANDOFF.md`, and the documents linked by the active
   task. Claude receives these through `CLAUDE.md`; Codex must still read them.
3. Run `git status --short` and inspect only relevant diffs.
4. Confirm the handoff's branch, active stage, approved task, non-goals, and
   known dirty files.
5. If the handoff and working tree disagree, stop and reconcile before editing.
6. Work only on the smallest approved task.

## End-of-session checklist

1. Stop background commands and dev servers.
2. Run the relevant build, typecheck, lint, and targeted tests.
3. Inspect `git diff` and confirm no unrelated file was changed.
4. Update `docs/HANDOFF.md` with completed work, changed files, verification,
   risks, and one concrete next task.
5. Update `docs/DECISIONS.md` only for material decisions.
6. Prefer a focused commit before switching agents. If a commit is unsafe or the
   task is incomplete, leave the changes unstaged and mark them `PARTIAL` in the
   handoff.

## Git convention

- Use one task branch at a time; both agents continue the same branch.
- Suggested branch names: `sprint-0/foundation`, `stage-1a/protocol-core`, or
  `fix/<short-topic>`.
- Keep commits small and describe the product change, not the model used.
- Do not commit secrets, local credentials, generated build output, or personal
  health data.
- Never use destructive reset or force-push as part of a handoff.

## Handoff format

`docs/HANDOFF.md` is overwritten with current state rather than used as a chat
log. It must contain:

- status: `READY`, `PARTIAL`, `BLOCKED`, or `AWAITING_APPROVAL`;
- active branch and stage;
- last agent and timestamp;
- approved task and non-goals;
- work completed;
- changed/dirty files and ownership;
- verification commands and results;
- decisions and open risks;
- exactly one recommended next task.

## Recovery after an abrupt token limit

If an agent stops without updating the handoff, the next agent must not assume
the task is complete. It should:

1. read the last handoff;
2. inspect `git status --short` and relevant diffs;
3. check for running processes;
4. run only safe, targeted verification;
5. write a recovered `PARTIAL` handoff before continuing.

## Scope and safety

- `docs/ROADMAP.md` controls implementation order.
- The parity blueprint does not authorize implementation.
- Stage 1A must pass before Stage 1B.
- Product code, dependencies, migrations, and infrastructure require explicit
  task authorization.
- Neither agent may hide failing tests, unresolved conflicts, unverified medical
  claims, license restrictions, or platform limitations in a handoff.
