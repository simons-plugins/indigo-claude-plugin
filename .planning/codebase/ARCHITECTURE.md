# ARCHITECTURE.md — Plugin Architecture

## Overview

This is a **Claude Code plugin** — a content-only package (no server, no build step) that extends Claude Code with domain-specific commands, auto-triggering skills, and a session-start hook. All intelligence is delivered through structured Markdown that Claude reads and follows.

## Plugin Manifest Layer

```
.claude-plugin/
├── plugin.json          # Name, version, description, repo (installed plugin identity)
└── marketplace.json     # Marketplace listing with owner + plugins array
```

CI enforces that `version` fields in both files match on every PR. This is the release gate.

## Command Layer (`commands/`)

Commands are slash commands invoked explicitly by the user (`/indigo:dev`, etc.).

**Structure**: Each command is a single Markdown file with YAML frontmatter:
```yaml
---
name: dev
description: Indigo plugin development expert — SDK docs, examples, lifecycle, IOM reference
---
```

**Routing strategy**: Each command file is itself the routing guide. It contains:
1. A context optimization table (what to load, what to never load at once)
2. A query routing guide (what the user asks → which doc files to read)
3. Phase-based or topic-based loading instructions
4. Workflow examples showing the correct multi-step read sequence

**Commands never load all docs**. The `/indigo:dev` command calls out that `sdk-examples/` is 1.3MB and must be loaded individually. The `/indigo:api` command covers ~52KB across 6 files and should be loaded selectively.

### Command → Docs Mapping

| Command | Primary Docs |
|---------|-------------|
| `/indigo:dev` | `docs/plugin-dev/` tree (concepts, api/iom, patterns, troubleshooting, examples) |
| `/indigo:api` | `docs/api/` (6 files: overview, auth, websocket, http, device-commands, README) |
| `/indigo:control-pages` | `docs/control-pages/` (workflow, schema, images, layouts, export) + `control-pages.local.md` |
| `/indigo:html-pages` | `skills/html-pages/references/` (indigo-api-js.md, design-guidelines.md) + `skills/html-pages/examples/` |

## Skill Layer (`skills/`)

Skills auto-activate when Claude Code detects matching file patterns in the current workspace. They don't require user invocation.

**Structure**: Each skill is a directory with one `SKILL.md` file. The SKILL.md has extended YAML frontmatter including a `match` array of glob patterns.

```yaml
---
name: dev
description: >-
  This skill should be used when the user asks to "create an Indigo plugin"...
match:
  - "**/*.indigoPlugin/**"
  - "**/plugin.py"
  - "**/Devices.xml"
---
```

**Design principle**: Skills contain a condensed version of the command's guidance — the core facts and reference table — without the verbose workflow examples. They end with a pointer to the full command: "For comprehensive guidance, use `/indigo:dev`."

**Skills vs Commands**:
- Skills: auto-trigger, compact, pattern-matched, always-on background guidance
- Commands: explicit invocation, full workflow, verbose routing guides, multi-step loading

### Skill File Counts

| Skill | Contents |
|-------|---------|
| `skills/dev/SKILL.md` | Core plugin structure, lifecycle, device types, state updates, IOM reference table |
| `skills/api/SKILL.md` | Transport selection, auth, WebSocket/HTTP quick refs, command examples, doc table |
| `skills/control-pages/SKILL.md` | Element types, action types, essential rules, export tool, doc table |
| `skills/html-pages/SKILL.md` | Core concepts, 4-phase workflow, device classification, API reference, design refs |

The `html-pages` skill has additional reference material in subdirectories (unlike other skills):
- `skills/html-pages/references/indigo-api-js.md` — full IndigoAPI JS class source + API reference
- `skills/html-pages/references/design-guidelines.md` — CSS themes, SF Symbol icons, responsive layout rules
- `skills/html-pages/examples/active-devices.html` — complete working HTML dashboard page

## Hook Layer (`hooks/`)

```
hooks/
├── hooks.json           # Hook registration
└── check-update.js      # SessionStart hook implementation
```

**hooks.json** registers a `SessionStart` hook with matcher `"startup"`. The hook is non-async (`"async": false`) but the JS script itself spawns a detached background child process to avoid blocking startup.

**check-update.js** logic:
1. Read installed version from `.claude-plugin/plugin.json`
2. Check cache file at `~/.claude/cache/indigo-plugin-update-check.json` (1-hour TTL)
3. If cache is fresh: output `systemMessage` if `latest !== installed`
4. If cache is stale: output empty JSON immediately, spawn background process to refresh cache

This gives instant startup (no network wait) with eventual-consistency update notifications.

## Documentation Layer (`docs/`)

Docs are loaded on-demand by commands and skills. They are organized by domain:

```
docs/
├── api/                 # 6 files: Indigo WebSocket + HTTP API reference
├── control-pages/       # 5 subdirs: workflow, schema, images, layouts, export
└── plugin-dev/          # Rich tree: quick-start, concepts, api/iom, patterns, examples, troubleshooting
```

The `docs/plugin-dev/` tree is the most complex, with a modular IOM reference split into 9 focused files (~4KB each) under `docs/plugin-dev/api/iom/`.

## Supporting Assets

| Path | Contents |
|------|---------|
| `sdk-examples/` | 16 official Indigo SDK `.indigoPlugin` bundles (1.3MB total) |
| `snippets/plugin-base-template.py` | Clean Python 3 plugin starting template |
| `examples/` | 5 control page `.textClipping` examples |
| `reference/` | SDK-level reference: `Python3-Migration-Guide.md`, `SDK-CLAUDE.md`, `SDK-README.md` |
| `tools/create_clipping.py` | Generates `.textClipping` files from XML |
| `control-pages.local.md` | Per-user defaults for control page preferences (gitignored or user-managed) |

## Key Design Decisions

1. **No build step** — pure Markdown, runs directly in Claude Code
2. **Lazy loading** — 1.3MB of SDK examples are never bulk-loaded; commands route to specific files
3. **Dual surface** (command + skill) — same domain covered at different verbosity levels
4. **Modular IOM** — 40KB Object Model reference split into 9 ~4KB files for selective loading
5. **Self-contained HTML pages** — `html-pages` skill requires pages to inline `indigo-api.js` (no external script deps in WKWebView)
6. **User preferences file** — `control-pages.local.md` persists user defaults for screen size, theme, etc. across sessions
