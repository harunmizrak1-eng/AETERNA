# AETERNA agent task template

Use one bounded task card per agent. Do not add project history.

## Task card

```text
AGENT:
TASK ID:
BASE SHA:
WORKTREE:
BRANCH:

OBJECTIVE
One concrete outcome.

START CONDITION
Exact state that must be true before editing.

READ FIRST
1. AGENTS.md
2. docs/PRODUCT_SPECIFICATION_V1.md
3. docs/ACTIVE_CONTEXT.md
4. This task card only

ALLOWED FILES
Explicit paths or directories.

FORBIDDEN FILES
Explicit ownership boundaries.

SCOPE
Numbered requirements.

ACCEPTANCE
Observable, testable completion conditions.

NON-GOALS
Intentionally excluded work.

VERIFICATION
Exact package-local commands.

COMMITS
Expected small commit sequence.

FINAL REPORT
Use the standard report below.
```

## Standard final report

```text
STATUS: COMPLETE | PARTIAL | BLOCKED
TASK ID:
STARTING SHA:
FINAL SHA:
COMMITS:
FILES CHANGED:
WORK COMPLETED:
TESTS: command + exact pass/fail count
TYPECHECK: command + result
LINT: command + result
EXTERNAL VERIFICATION NOT RUN:
KNOWN RISKS:
WORKING TREE: CLEAN | DIRTY (list files)
INTEGRATION NOTES:
VERDICT: one sentence
```

Do not paste full logs. Never claim a command passed unless it ran to a
successful exit.
