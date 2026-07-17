# ÆTERNA — Project Constitution

Read this file before every task. Detailed rules live in the canonical documents:

- Product destination and parity: `docs/COMPETITIVE_PARITY_BLUEPRINT.md`
- Delivery order, stage gates, and non-goals: `docs/ROADMAP.md`
- Domain entities, relationships, and statuses: `docs/DATA_MODEL.md`
- Material decisions: `docs/DECISIONS.md`

ÆTERNA is a premium longevity operating system built around:

**Data → Analysis → Protocol → Action → Tracking → Re-evaluation**

**Evidence Before Protocol.** Do not diagnose, prescribe, promise outcomes,
invent evidence, or silently change a protocol.

## Permanent decisions

- SparkyFitness is the only application foundation.
- SparkyFitness has explicit commercial-use permission for this project, obtained
  directly from the copyright holder (see `docs/DECISIONS.md`, 2026-07-15).
  Treat this as resolved; do not re-audit or question it unless the upstream
  repository's license changes or new information surfaces.
- Expo SDK 56, React Native 0.85, React 19, and strict TypeScript remain pinned
  until an explicit, tested upgrade decision is recorded.
- Other repositories are references or module donors only. Never add a second
  application foundation.
- Do not reuse the Sparky dashboard UI or the rejected ÆTERNA dashboard.
- Today is the product center; it must answer what to do, what changed, and why.
- The visual direction is light, calm, editorial, scientific, and premium—not a
  generic SaaS, clinic template, supplement store, or black-and-gold dashboard.

## Scope control

- The parity blueprint is a destination map, not implementation permission.
- `docs/ROADMAP.md` is authoritative for active scope.
- Stage 1A Protocol Core must pass its gate before Stage 1B Health Sync begins.
- V1 excludes nutrition, community, advanced AI, clinical portal, CGM, genetics,
  imaging, cohort analytics, and autonomous recommendations.
- Documentation, audit, and prototype tasks must not add product features,
  dependencies, migrations, or infrastructure.
- Risky or cross-domain work follows: audit → smallest safe plan → approval →
  implementation.
- Read only the relevant 3–6 files. Do not run a broad audit unless requested.
- Prefer existing patterns and the smallest coherent change; do not create a new
  abstraction before checking the current architecture.
- Record material scope or architecture decisions in `docs/DECISIONS.md`.
- Referans uygulamalardan (Pepty, PeptIQ, Protocol, Peppedia, Lifehackr,
  Longevity Labs) ve veri kaynaklarından (Open Peptide Dataset CC BY 4.0,
  peptidepedia.org, pepmod.com) owner'ın yazılı izni alınmıştır (see
  `docs/DECISIONS.md`, 2026-07-17). Bu izinli kaynaklardan feature, design,
  UX akışı, compound verisi ve içerik serbestçe kopyalanabilir ve adapte
  edilebilir. Kapalı kaynaklı rakiplerin private API'leri, gizli
  algoritmaları veya açıklanmamış içeriği yine de kullanılmaz.
- "Evidence Before Protocol" kuralı korunur: izinli kaynaklardan kopyalanan
  compound/içerik eğitim ve reference amaçlıdır, asla tıbbi tavsiye, teşhis
  veya reçete olarak sunulmaz.

## Completion rule

A task is incomplete while relevant build, typecheck, lint, tests, security,
privacy, accessibility, mobile layout, or documentation checks fail. Report only
changed files, work completed, test result, and known risk or gap.

## Typecheck disiplini

`tsc --noEmit` tüm Sparky monoreposunu tarar (~30 dk her koşumda). Zaman
israfını önlemek için:

- **Daima `--incremental` kullan.** `.tsbuildinfo` cache'ler; 2. koşumda
  saniyeler sürer. `tsc --noEmit --incremental`.
- **Her dosya değişikliğinde typecheck koşturma.** Küçük düzenlemede IDE/
  limitli check yeterli. Bir paket içinde ardışık 3-5 değişiklikte bir kez.
- **Watch mode tercih et:** `tsc --noEmit --incremental --watch` bir
  background shell'de çalışsın; her save'de anlık raporlar, ayrı koşum yok.
- **Commit öncesi:** sadece değişen paketin typecheck'i (mobile ise
  SparkyFitnessMobile, server ise SparkyFitnessServer), tüm monorepo değil.
- **Tam typecheck** yalnızca cross-paket değişiklikte (shared + iki paket)
  veya merge öncesi.
- Bu kural AGENTS.md root'unun "Definition of done" kuralını değiştirmez:
  commit/merge'den önce ilgili tip kontrolü hâlâ yeşil olmalı, sadece
  her dosya kaydetmede 30 dk beklenmez.

## Lint disiplini

- `expo lint` tüm projeyi tarar (yavaş, kesilebilir). Commit öncesi sadece
  değişen dosyaları lint'le: `pnpm exec eslint <file1> <file2>`.
- `--cache` kullan: `eslint src --cache --cache-location .eslintcache`.
- `--max-warnings 0`'ı commit öncesi uygula; development sırasında
  uyarılara izin ver, son temizle.
- Çalışırken kesilme olursa: tek dosya `eslint <file>` ile doğrula, tüm
  `expo lint`'i commit öncesi tek sefer koş.
- Server tarafı aynı prensip: `pnpm exec eslint <touched-files>`.
