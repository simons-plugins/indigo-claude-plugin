# Remove Custom Update Mechanism

**Date:** 2026-03-04
**Status:** Approved

## Problem

The plugin has a custom update pipeline (SessionStart hook + `/indigo:update` command) that uses `git pull` inside the cached plugin directory. This conflicts with Claude Code's built-in plugin system which uses version-specific directories.

Issues caused:
1. **Stale version-in-path** — cache directory stays at `1.0.2` after git-pull updates to `1.0.8`
2. **Hook output errors** — `systemMessage` field compatibility issues across Claude Code versions
3. **Cache staleness** — `~/.claude/cache/indigo-plugin-update-check.json` gets out of sync
4. **User confusion** — custom `/indigo:update` vs standard `/plugin update`

## Solution

Remove all custom update infrastructure. Users update via `/plugin update indigo` — the standard Claude Code flow (same as GSD/superpowers plugin).

## Changes

### Delete
- `hooks/check-update.js` — SessionStart update check script
- `hooks/hooks.json` — hook registration config
- `commands/update.md` — `/indigo:update` command
- `hooks/` directory (if empty after deletions)

### Update
- `CLAUDE.md` — remove references to update hook and `/indigo:update`
- `README.md` — update if it documents the update command

### No changes
- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`
- Skills (`dev`, `api`, `control-pages`)
- Commands (`dev`, `api`, `control-pages`)
- Documentation, SDK examples, tools

## Post-deployment

After merging and releasing, `/plugin update indigo` creates a fresh cache directory with the correct version number, permanently resolving the stale-path issue.
