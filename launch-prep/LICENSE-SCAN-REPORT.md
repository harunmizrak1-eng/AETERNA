# Transitive dependency license scan

**Date:** 2026-07-27
**Scope:** every package resolved under `aeterna-os/node_modules/.pnpm`
(all workspaces: server, mobile, frontend, shared, docs), production and
development, including platform-specific native variants.
**Method:** direct walk of each resolved package's `package.json` `license`
field. `pnpm licenses list` was tried first and produced empty output /
timed out in this environment, so it was not used — the walk is the actual
source of these numbers.

## Totals

| License | Packages |
|---|---|
| MIT | 2484 |
| ISC | 105 |
| Apache-2.0 | 100 |
| BSD-3-Clause | 50 |
| BSD-2-Clause | 37 |
| MPL-2.0 | 21 |
| BlueOak-1.0.0 | 18 |
| (MIT OR CC0-1.0) | 8 |
| CC0-1.0 | 5 |
| **UNKNOWN** | **4** |
| LGPL-3.0-or-later | 4 |
| 0BSD | 3 |
| MIT-0 | 2 |
| Apache-2.0 AND LGPL-3.0-or-later | 2 |
| Hippocratic-2.1 | 2 |
| CC-BY-4.0 | 2 |
| Unlicense | 2 |
| LGPL-3.0 | 2 |

**Total distinct packages: 2868.**

## The important negative finding

**No AGPL, BUSL, SSPL, Commons-Clause, Elastic, PolyForm, Prosperity, or
Confluent license appears anywhere in the tree.** Those are the licenses
that would actually threaten shipping a closed or differently-licensed
app, and none of them is present. The `wger` integration named in
`launch-prep/legal/ATTRIBUTION.md` is AGPL, but it is consumed as a remote
HTTP API, not as an npm dependency — consistent with it not appearing here.

## Flagged (27 packages, 5 distinct licenses)

### MPL-2.0 — `lightningcss` + 17 platform binaries
File-level copyleft. Obligations trigger only on distributing a **modified
MPL-covered file**. It is used unmodified as a CSS build tool. Not a
blocker; no source-release obligation for our own code.

### LGPL-3.0-or-later — `@img/sharp-libvips-*` (4 Linux/musl native builds)
Prebuilt libvips binaries behind `sharp` (server-side image processing).
LGPL permits linking from non-LGPL code provided the library stays
replaceable, which is how `sharp` loads them. Server-side only — not
distributed to end users in the mobile app.

### LGPL-3.0 — `libheif-js`
Same reasoning as libvips: HEIF decoding, dynamically consumed, not
statically bound into our source.

### LGPL-3.0 — `rollup-plugin-dts`
Build-time devDependency. Never shipped in any artifact.

### Hippocratic-2.1 (2), CC-BY-4.0 (2)
Not OSI-approved but not copyleft either. Hippocratic adds ethical-use
restrictions; CC-BY needs attribution, which
`launch-prep/legal/ATTRIBUTION.md` already provides for CC-BY content.

## Open gap — not resolved

**4 packages report UNKNOWN** (no `license` field in their
`package.json`). They are not identified in this report: the targeted
re-scan to name them timed out in this environment and was not completed.
This is a real remaining item, not a clean bill of health — those 4 must
be identified and classified before treating the license position as
settled.

## Caveats on these numbers

- The walk covers **everything resolved**, including devDependencies and
  platform binaries for OSes we never ship (linux-musl-arm64 etc.). The
  set actually distributed is smaller than 2868.
- A package's `license` field is taken at face value; no LICENSE file text
  was diffed against it.
- Dual licenses are recorded as written (e.g. `(MIT OR CC0-1.0)`), not
  resolved to one choice.
