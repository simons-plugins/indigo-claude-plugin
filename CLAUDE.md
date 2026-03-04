# Indigo Claude Code Plugin

## Release Process

- **Bump version** in `.claude-plugin/plugin.json` with every PR
- Use semantic versioning: patch for fixes/tweaks, minor for new features
- The version is checked by the `/indigo:update` command to detect available updates

## Structure

- `commands/` — Slash commands (`/indigo:dev`, `/indigo:api`, `/indigo:control-pages`, `/indigo:update`)
- `skills/` — Auto-triggered skills (activate on matching file patterns)
- `hooks/` — Session hooks (e.g., update check on startup)
- `docs/` — Documentation loaded by commands/skills
- `sdk-examples/` — 16 official Indigo SDK example plugins
- `reference/` — SDK reference documents
- `snippets/` — Plugin templates
- `examples/` — Control page examples
- `tools/` — Utility scripts

## Naming Convention

- Avoid using "plugin" for this project's own components — Claude Code uses "plugin" for its own concept
- Use "skill", "command", "hook" etc. for Claude Code plugin components
- "Plugin" is fine when referring to Indigo plugins (the things this tool helps build)
