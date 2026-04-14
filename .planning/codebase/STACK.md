# STACK.md — Technology Stack

## Plugin Type

**Claude Code Plugin** — a community plugin installable via `/plugin install simons-plugins/indigo-claude-plugin`.

Claude Code plugins extend Claude Code's capabilities by bundling commands, skills, and hooks into a distributable package. They are installed from GitHub repos.

## Plugin Manifest

Two files in `.claude-plugin/` must always be kept in sync (CI enforces matching versions):

| File | Purpose |
|------|---------|
| `.claude-plugin/plugin.json` | Installed plugin identity: `name`, `version`, `description`, `repository` |
| `.claude-plugin/marketplace.json` | Marketplace listing: owner, plugins array, per-plugin metadata |

Current version: **1.4.5** (as of April 2026). Version 1.5.0 is in-flight on PR #25.

### plugin.json shape

```json
{
  "name": "indigo",
  "version": "1.4.5",
  "description": "...",
  "repository": "https://github.com/simons-plugins/indigo-claude-plugin"
}
```

### marketplace.json shape

```json
{
  "name": "indigo-claude-plugin",
  "owner": { "name": "simons-plugins" },
  "plugins": [
    {
      "name": "indigo",
      "source": "./",
      "description": "...",
      "version": "1.4.5",
      "repository": "...",
      "license": "MIT",
      "keywords": ["indigo", "home-automation", "plugin-development", "iot"]
    }
  ]
}
```

## Commands

Four slash commands are exposed. Commands are Markdown files in `commands/` with YAML frontmatter (`name`, `description`).

| Command | File | Role |
|---------|------|------|
| `/indigo:dev` | `commands/dev.md` | Server-side plugin development expert |
| `/indigo:api` | `commands/api.md` | Client-side WebSocket + HTTP API expert |
| `/indigo:control-pages` | `commands/control-pages.md` | XML control page builder |
| `/indigo:html-pages` | `commands/html-pages.md` | HTML dashboard page builder |

## Skills

Skills auto-activate based on file-pattern `match` arrays in their YAML frontmatter. Each skill lives in `skills/<name>/SKILL.md`.

| Skill | Activates On |
|-------|-------------|
| `dev` | `**/*.indigoPlugin/**`, `**/plugin.py`, `**/Devices.xml`, `**/Actions.xml`, etc. |
| `api` | `**/WebSocketService*`, `**/IndigoAPI*`, `**/indigo_api*`, `**/indigo*client*`, etc. |
| `control-pages` | `**/*.textClipping`, `**/ControlPage*`, `**/control-page*` |
| `html-pages` | `**/Resources/static/pages/*.html`, `**/indigo-api.js` |

## Hooks

One hook in `hooks/`:

| Hook | Type | File | Behavior |
|------|------|------|----------|
| `SessionStart` | `command` | `hooks/check-update.js` | Node.js script; checks GitHub for newer version. Uses 1-hour cache in `~/.claude/cache/`. Outputs `systemMessage` if update available. Runs async on every session start. |

## Language / Runtime

| Layer | Technology |
|-------|-----------|
| Commands | Markdown + YAML frontmatter |
| Skills | Markdown + YAML frontmatter |
| Hook | Node.js (CommonJS, built-ins only — `fs`, `path`, `https`, `os`) |
| Docs | Markdown |
| SDK examples | Python 3 (Indigo plugin bundles) |
| Export tool | Python 3 (`tools/create_clipping.py`) |
| Snippets | Python 3 template (`snippets/plugin-base-template.py`) |

## Version Control

- GitHub: https://github.com/simons-plugins/indigo-claude-plugin
- Default branch: `main`
- Merge policy: GitHub PR only, no squash, wait for CI + user approval
- CI: Version-sync check (plugin.json and marketplace.json must match); enforced on every PR
- Version bump: required per PR (semantic: patch for fixes, minor for new features)
