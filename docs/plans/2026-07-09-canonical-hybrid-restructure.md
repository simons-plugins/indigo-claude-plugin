# Design: Canonical-docs hybrid restructure — indigo-claude-plugin

Status: PROPOSED (2026-07-09). Supersedes the "hand-maintain derivative docs" model.
Companion: `indigo-docs-audit.md` (the gap analysis this responds to).

## Problem
We hand-maintain ~11.3k lines of derivative Indigo docs. The audit found they (a) drift
(version numbers, moved links), (b) **fabricate** specifics that never existed (wrong API
command envelope, `?detail=true`, `PUT` verb, `errorId` codes, `indigo.actionGroup.enable()`,
`indigo.server.error()`, `InsteonCommandReceivedTrigger.address`), and (c) have real gaps
(webhooks, ValidationError, subType enums, dev-env). Indigo now publishes a canonical
`llms-full.txt` + `llms.txt` index — always current, version-pegged, LLM-optimised.

## Principles
1. **Canonical is the single source of truth for reference facts.** We never hand-write API
   surface (methods, endpoints, XML attrs, constants) again — we vendor it verbatim.
2. **Local + incremental discovery.** Split the monolith into small per-page files a skill
   loads on demand (progressive disclosure) — never a 167KB webpage or 1.5MB monolith in context.
3. **Our docs shrink to what canonical lacks:** routing, workspace conventions/opinion, testing
   patterns, CI workflows, SDK examples, corrected quick-reference. Curation, not duplication.
4. **Drift is caught mechanically,** not by memory — a refresh script + optional CI check.

## What Indigo actually publishes (verified 2026-07-09)
- `https://docs.indigodomo.com/llms.txt` — 25KB index: `[Title](url): description` per page.
- `https://docs.indigodomo.com/llms-full.txt` — 1.5MB, sections delimited `--- Title (URL) ---`.
- Per-page `.md` → 404. Per-page HTML → 167KB each (rejected: too heavy, not machine-clean).
- URLs are version-pegged: `.../2025.2/...`.

## Target architecture

```
indigo-claude-plugin/
├── reference/
│   └── canonical/                 # GENERATED — never hand-edit
│       ├── VERSION                # indigo version + source URLs + fetch date + sha256(llms-full)
│       ├── INDEX.md               # routing manifest built from llms.txt (title · desc · local path)
│       ├── api/
│       │   ├── http.md  messages.md  websocket.md  webhooks.md  rest-migration.md  index.md
│       ├── plugin-dev/
│       │   ├── guide.md  sdk-examples.md
│       │   └── reference/
│       │       ├── dev-environment.md
│       │       ├── plugin-py/*.md         # device-methods, general-methods, helper-methods,
│       │       │                          #   http-requests, logging, message-flow, trigger-methods,
│       │       │                          #   variable-methods, additional-topics, properties
│       │       └── xml/*.md + xml/configui/*.md
│       └── scripting/
│           └── reference/*.md + device-subclasses/*.md + devices/*.md
├── tools/
│   └── refresh_canonical.py        # NEW — fetch, split, index, version, --check drift mode
├── skills/                         # THIN: opinion + corrected quick-ref + routing INTO canonical
├── commands/                       # THIN: same, plus fixed external links
└── docs/                           # KEEP only genuinely-additive hand docs (below)
```

Path mirrors the URL after the version segment, so `.../2025.2/api/http/` → `canonical/api/http.md`.

## The refresh tool  (`tools/refresh_canonical.py`, stdlib only)
- `python3 tools/refresh_canonical.py` →
  1. GET `llms.txt` + `llms-full.txt`.
  2. Derive version from the URL path segment (`2025.2`).
  3. Split `llms-full.txt` on `^--- (?P<title>.+) \((?P<url>http\S+)\) ---$`; each section → a file
     at the URL-derived path under `reference/canonical/`.
  4. Prepend a 2-line "GENERATED from <url> — do not edit" header to each file.
  5. Write `INDEX.md` from `llms.txt` (title, description, → local path).
  6. Write `VERSION` (version, source URLs, UTC fetch date, sha256 of llms-full.txt).
- `--check` → re-fetch, re-split to a temp dir, diff against committed `reference/canonical/`;
  exit 1 on drift (for an optional scheduled CI job / release step). Prints changed pages.
- No third-party deps (urllib + re + hashlib + pathlib). Runs anywhere.

## Migration map (from the audit)

DELETE (pure duplication / fabrication — replaced by canonical):
- `docs/api/{http-api,websocket-api,device-commands,authentication,overview,README}.md`
- `docs/plugin-dev/api/iom/*.md`, `docs/plugin-dev/api/indigo-object-model.md`, `docs/plugin-dev/api/README.md`
- Fabrication-heavy concepts we can't trust: fold `concepts/{devices,actions,events,menu-items,configui,plugin-preferences,http-responder}.md`
  content into thin routers OR delete where they only duplicate canonical.

KEEP AS-IS (audit: ahead of canonical):
- `docs/plugin-dev/patterns/{testing,open-source-contributing,README}.md`
- `docs/plugin-dev/workflows/*`  ·  `docs/plugin-dev/examples/sdk-examples-guide.md`

KEEP + REWRITE THIN (opinionated on-ramp, corrected, routes into canonical):
- `docs/plugin-dev/quick-start.md` — the "how we build plugins here" on-ramp (fix versions/super()).
- `docs/plugin-dev/concepts/plugin-lifecycle.md` — keep the narrative, fix the super() story, point
  method-level detail at `canonical/plugin-dev/reference/plugin-py/*`.
- `docs/plugin-dev/troubleshooting/common-issues.md` — workspace-specific gotchas (keep), version-fix,
  route env/debugger/python-conflicts detail into canonical.

REFRAME:
- `reference/Python3-Migration-Guide.md` → "legacy Py2→3 porting reference" (demote, don't delete).

REWRITE (routing + corrected quick-ref → canonical):
- `skills/api/SKILL.md`, `skills/dev/SKILL.md`, `commands/api.md`, `commands/dev.md`.
  Fix every Tier-1 inline error; replace `docs/...` routing tables with `reference/canonical/...`;
  fix stale wiki links → `docs.indigodomo.com/2025.2/*`.

## Correctness fixes fold in for free
Everything fabricated lived in the DELETE set → gone by construction. The only hand-fixes left are
the inline examples in the 4 rewritten routing files (Tier-1 items 1-3, 7, 10) + version sweep (Tier-2).

## Phasing (each a reviewable PR; version-bump per repo rule)
- **P1 — Vendor + tool.** Add `refresh_canonical.py`, generate `reference/canonical/**`, INDEX, VERSION.
  Pure addition, nothing wired yet. (Also lets us eyeball the split before deleting anything.)
- **P2 — Rewrite the 4 routing files** (api/dev SKILL + commands) to point at canonical + fix Tier-1
  inline errors + stale links. This alone kills the highest-traffic wrong content.
- **P3 — Prune + thin** the DELETE / REWRITE-THIN doc sets; reframe the migration guide; version sweep.
- **P4 — (optional)** CI: scheduled `refresh_canonical.py --check` → open an issue/PR on drift.

## Open choices for Simon
- A. concepts/ narrative docs: **thin-and-keep** (pedagogical on-ramp) vs **delete** (lean, pure routing)?
  Default proposed: thin-and-keep lifecycle + quick-start; delete the rest.
- B. Pin to `2025.2` explicitly, or make the tool track "latest published"? Default: pin, bump on Indigo release.
- C. P4 drift-CI now or later? Default: later (P1-P3 first).
```
