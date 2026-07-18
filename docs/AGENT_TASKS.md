# AETERNA active agent tasks

Only read the task assigned to your agent. Codex updates this file.

## HY3 — Faz B Study Club server closure

```text
AGENT: HY3
TASK ID: FAZ-B-COMMUNITY-SERVER
BASE SHA: 882ddca1
WORKTREE: C:\Users\harun\Documents\New project\AETERNA\aeterna-os-hy3-integration
BRANCH: agent/hy3-faz-b-community-server

OBJECTIVE
Complete the minimum server-side Study Club interaction contract: replies,
bounded pagination, search, honest identity/capabilities, validation,
moderation safety, and focused tests. This is code completeness, not live
Discourse production readiness.

START CONDITION
Run git status --short --branch. The worktree must be clean. Fast-forward or
recreate the task branch from exact SHA 882ddca1 without reset/discard. If the
tree is dirty, stop and classify ownership. Do not merge/cherry-pick old Faz B
commits; they are already in the base.

READ FIRST
1. C:\Users\harun\Documents\New project\AETERNA\AGENTS.md
2. C:\Users\harun\Documents\New project\AETERNA\docs\PRODUCT_SPECIFICATION_V1.md
3. C:\Users\harun\Documents\New project\AETERNA\docs\ACTIVE_CONTEXT.md
4. This assigned section only
Then inspect only communityRoutes, discourseClient, their tests, authentication
middleware, and the project's existing rate-limit pattern.

ALLOWED FILES
- SparkyFitnessServer/routes/v2/communityRoutes.ts
- SparkyFitnessServer/services/discourseClient.ts
- Their focused server tests
- Existing server rate-limit wiring only if required

FORBIDDEN FILES
- All mobile, shared, donor, Protocol, Labs, Library, Body Atlas, export,
  database/migration, native, and canonical documentation files

FIXED API CONTRACT
1. POST /api/v2/community/topics/:topicId/replies body { body: string }.
2. GET /api/v2/community/topics supports category, page and pageSize.
3. GET /api/v2/community/search supports q, page and pageSize.
4. GET /api/v2/community/capabilities returns identityMode:
   'shared_service' | 'per_user' and booleans for reply, pagination, search,
   followedTopics, unreadReplies and mentions.
5. Paginated responses return items plus page, pageSize, hasMore and optional
   nextPage. Keep existing topic fields compatible.
6. Preview mode uses the same response shapes and includes mode: 'preview'.
   Configured Discourse uses mode: 'live'.
7. Optional followed/unread/mention values exist only when authoritative
   upstream data supports them; never invent zero.

SCOPE
1. Implement Discourse POST /posts.json reply using numeric topic_id.
2. Reject empty/whitespace replies and bound body length.
3. Add bounded topic pagination; never scan every category/page indefinitely.
4. Add bounded topic search and normalize Discourse results.
5. Expose honest identity/capabilities. Current live writes are shared_service
   until real per-user identity exists.
6. Validate category allowlist, title/body/reply/report lengths, report reason,
   and numeric topic/post ids.
7. Ensure upstream HTML, API keys, headers, credential-bearing URLs, stack
   traces, and raw upstream bodies never reach mobile.
8. Apply the existing rate-limit pattern to write/search routes when suitable.
9. Preserve preview contract parity. Never silently fall back to preview after
   a configured live upstream failure.
10. Add focused route/client/security/error-normalization tests.

ACCEPTANCE
- Authenticated reply works in live and preview contracts.
- Invalid ids and empty/oversized content fail before upstream calls.
- Search/pagination are bounded and expose honest end state.
- Configured upstream failures return sanitized 502/429-style responses.
- shared_service identity is explicit; no fake per-user identity.
- Tests cover live mapping, preview parity, validation, rate-limit seam, HTML
  upstream failure, and secret redaction.

NON-GOALS
- No mobile UI, SSO implementation, push notifications, deployment, secrets,
  new database tables, Labs, Protocol, nutrition, AI, or Body Atlas

VERIFICATION
Server incremental typecheck, touched-file ESLint --max-warnings 0, focused
Vitest --no-file-parallelism. Live Discourse must be reported separately and
must not be claimed tested without a real instance.

COMMITS
1. feat(server): complete Study Club interaction API
2. test(server): verify Study Club validation and upstream safety

FINAL REPORT
Use docs/AGENT_TASK_TEMPLATE.md exactly. Do not push or update docs.
```

## DeepSeek V4 Flash — Faz B Study Club mobile closure

```text
AGENT: DeepSeek V4 Flash
TASK ID: FAZ-B-COMMUNITY-MOBILE
BASE SHA: 882ddca1
WORKTREE: C:\Users\harun\Documents\New project\AETERNA\aeterna-os-deepseek-community
BRANCH: agent/deepseek-faz-b-community-mobile

OBJECTIVE
Complete the minimum mobile Study Club interaction layer against HY3's fixed
API contract: reply composer, stable pagination, debounced search, honest
preview/identity states, and focused tests.

START CONDITION
Create a fresh worktree from exact SHA 882ddca1. Do not use or modify another
agent's worktree. Do not merge HY3. Both agents implement opposite sides of the
fixed contract; Codex integrates server first and mobile second.

READ FIRST
1. C:\Users\harun\Documents\New project\AETERNA\AGENTS.md
2. C:\Users\harun\Documents\New project\AETERNA\docs\PRODUCT_SPECIFICATION_V1.md
3. C:\Users\harun\Documents\New project\AETERNA\docs\ACTIVE_CONTEXT.md
4. This assigned section only
Then inspect only Community screens, communityApi, Community query hooks and
focused tests.

ALLOWED FILES
- Existing Community mobile screens
- SparkyFitnessMobile/src/services/api/communityApi.ts
- New Community hooks/types/utilities and focused tests

FORBIDDEN FILES
- All server/shared files
- LibraryScreen, LibraryShellScreen, App.tsx, TabsLayout, navigation types
- Protocol, Today, Track, Compound Detail, donor, Labs, Body Atlas, native,
  dependencies, and canonical docs

FIXED API CONTRACT
Use the endpoint and response contract stated in HY3's task above. Define the
matching mobile types locally without editing shared files.

SCOPE
1. Add typed calls for replies, pagination, search and capabilities.
2. Add reply composer to topic detail. Reject empty locally, show remaining
   length, preserve draft on failure, clear only on confirmed success, and
   refresh detail after success.
3. Topic list: initial loading, pull refresh, load more, end reached, retry
   while preserving loaded items, and stable-id deduplication.
4. Add debounced search. Distinguish initial empty, no matches,
   unavailable/upstream failure, and retry. Stale responses must not replace a
   newer query.
5. Fetch capabilities. When identityMode is shared_service, never present a
   personal Discourse profile or imply the write uses the user's identity.
6. Show an explicit Preview label when mode is preview. Never call preview data
   live or persistent.
7. Render followed/unread/mention state only when capability and authoritative
   values exist. Never display invented zeros.
8. Add accessibility labels, keyboard behavior, and focused state tests.

ACCEPTANCE
- Failed reply preserves the exact draft and offers retry.
- Successful reply refreshes detail once and clears the draft.
- Load-more failure preserves existing topics.
- Search is debounced and race-safe.
- Preview and shared-service identity are unmistakable.
- No fabricated profile, notification count, persistence, or live state.

NON-GOALS
- No server, SSO, push notifications, Library redesign, navigation changes,
  profile system, Labs, Protocol, nutrition, AI, Body Atlas, or infrastructure

VERIFICATION
Mobile focused Jest --runInBand, incremental typecheck, touched-file ESLint
--max-warnings 0, plus existing Community regressions.

COMMITS
1. feat(mobile): complete Study Club interaction experience
2. test(mobile): cover Study Club pagination search and replies

FINAL REPORT
Use docs/AGENT_TASK_TEMPLATE.md exactly. Do not push or update docs.
```
