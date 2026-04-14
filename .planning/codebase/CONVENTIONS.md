# CONVENTIONS.md — Naming and Structural Conventions

## Terminology

The project has a deliberate naming convention to avoid ambiguity between Claude Code concepts and Indigo concepts:

| Term | Meaning |
|------|---------|
| **command** | A slash command (`/indigo:dev`) in Claude Code |
| **skill** | An auto-activating Claude Code context file |
| **hook** | A Claude Code lifecycle handler (SessionStart) |
| **plugin** | An Indigo home automation plugin (`.indigoPlugin` bundle) — NOT a Claude Code plugin |
| **Claude Code plugin** | This project as a whole — the distributable package |

Never use "plugin" for the Claude Code plugin's own components. Use "skill", "command", or "hook".

## Command File Conventions

**Location**: `commands/<name>.md`
**Frontmatter** (required):
```yaml
---
name: <command-name>
description: <one-line description>
---
```

**Body structure** (consistent across all 4 commands):
1. Plugin/repo header with slash command name
2. Description section
3. `CRITICAL: Context Optimization Strategy` section with file table
4. Query Routing Guide (table: user asks → files to load)
5. Workflow examples (numbered steps)
6. Key concepts
7. External Resources
8. Related Commands cross-links

**Naming**: Command name matches the file name and the part after `:` in the slash command. `/indigo:dev` → `commands/dev.md`.

## Skill File Conventions

**Location**: `skills/<name>/SKILL.md`
**Frontmatter** (required):
```yaml
---
name: <name>
description: >-
  This skill should be used when the user asks to "...",
  "...", or is working on <file types>.
  Provides <domain> guidance.
match:
  - "**/<glob-pattern>"
  - ...
---
```

**Description field**: Starts with "This skill should be used when the user asks to" followed by quoted phrases — this is the semantic trigger hint for Claude Code.

**Match field**: Glob patterns for file-based auto-activation. Uses `**/` prefix for recursive matching.

**Body structure**:
- Short concept summary (not the full command-level depth)
- Essential rules / quick reference tables
- Code examples (inline, representative)
- Reference Documentation table: `| Topic | File |` pointing to `docs/` files relative to `${CLAUDE_PLUGIN_ROOT}`
- Footer: "For comprehensive guidance with [feature], use `/<command>`."

Skills are intentionally shorter than their corresponding commands — they carry the essentials for background activation, not the full workflow.

## Documentation File Conventions

**Location**: `docs/<domain>/<file>.md`
**No frontmatter** — pure Markdown
**No required structure** — each doc is independently useful

**IOM reference files** (`docs/plugin-dev/api/iom/`): Each file covers one topic area, sized ~3–6KB for selective loading. Never lump multiple IOM topics together.

**README.md files** in subdirectories: Provide navigation/index for that subtree. Not loaded by default — used for human navigation.

## Naming Conventions

### Files

| Pattern | Example | Notes |
|---------|---------|-------|
| `kebab-case.md` | `plugin-lifecycle.md` | All docs and skill files |
| `kebab-case.md` | `control-pages.md` | Commands too |
| `UPPER.md` | `SKILL.md`, `CLAUDE.md` | Reserved for special files |
| `Title Case.indigoPlugin` | `Example Device - Custom.indigoPlugin` | SDK examples (upstream naming) |

### SDK Examples

SDK example names are upstream Indigo naming — they use "Title Case with spaces". Do not rename them.

### Docs Subdirectories

Use `kebab-case` for all subdirectory names:
- `plugin-dev/`, `control-pages/`, `api/`, `iom/`, `quick-start/`

## Cross-Reference Pattern

Commands reference docs using paths relative to `${CLAUDE_PLUGIN_ROOT}`:

```markdown
Read `docs/plugin-dev/concepts/plugin-lifecycle.md`
```

Skills use the same convention with an explicit note:
```markdown
For detailed guidance, read these files relative to `${CLAUDE_PLUGIN_ROOT}`:
```

The `${CLAUDE_PLUGIN_ROOT}` variable is a Claude Code convention that resolves to the plugin's installed root.

## Version Bump Convention

Every PR must bump the version in **both**:
1. `.claude-plugin/plugin.json` — `"version"` field
2. `.claude-plugin/marketplace.json` — `"version"` field inside the `plugins` array

Rules:
- **Patch** (`x.x.N`): fixes, tweaks, doc corrections
- **Minor** (`x.N.0`): new features, new docs, new skills/commands

CI fails if the two files don't match or if the version hasn't changed from the base branch.

## Control Page Preferences File

`control-pages.local.md` is a per-user YAML frontmatter file in the repo root. It stores user defaults for the `/indigo:control-pages` command:

```yaml
---
default_screen: iphone-14
theme: dark
background: "19 19 19"
icon_size: 2x
---
```

This file is user-managed. The `control-pages` command and skill both read it on activation. If absent, the command creates it from defaults documented in `docs/control-pages/workflow.md`.

## HTML Pages Conventions

Generated HTML pages must follow these rules (enforced by skill guidance):
- **Self-contained**: single `.html` file, no external script dependencies
- **Inline `indigo-api.js`**: paste the full `IndigoAPI` class inline — WKWebView cannot load relative scripts
- **Meta tags**: `indigo-page-name`, `indigo-page-icon`, `indigo-page-description` in `<head>`
- **Dark mode**: `prefers-color-scheme: dark` media query required
- **Browser fallback**: `showConfigForm()` when `INDIGO_CONFIG` is not injected
- **Debounce sliders**: 300ms debounce on all range inputs
- **Minimum touch target**: 44x44pt (Apple HIG)
