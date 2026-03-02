---
name: update
description: Check for and install Indigo plugin updates
allowed-tools:
  - Bash
  - Read
  - AskUserQuestion
---

# Update Indigo Plugin

Check for updates to the Indigo Claude Code plugin and install if available.

## Steps

### 1. Check installed version

Read the installed version from `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json`.

### 2. Check for cached update info

Read `~/.claude/cache/indigo-plugin-update-check.json` if it exists. This is written by the SessionStart hook. If the cache file doesn't exist or is stale (older than 1 hour), fetch the latest version directly:

```bash
curl -sL https://raw.githubusercontent.com/simons-plugins/indigo-claude-plugin/main/.claude-plugin/plugin.json | python3 -c "import sys,json; print(json.load(sys.stdin)['version'])"
```

### 3. Compare versions

If versions match, tell the user they're up to date and stop.

If an update is available, show:
- Current version → Latest version
- Fetch and display recent changes from the commit log:

```bash
cd "${CLAUDE_PLUGIN_ROOT}" && git log --oneline HEAD..origin/main 2>/dev/null || echo "Unable to fetch changelog"
```

### 4. Confirm and update

Ask the user to confirm the update using AskUserQuestion.

If confirmed, run:

```bash
cd "${CLAUDE_PLUGIN_ROOT}" && git pull origin main
```

### 5. Clear cache and notify

```bash
rm -f ~/.claude/cache/indigo-plugin-update-check.json
```

Display:
```
Indigo plugin updated: {old} → {new}
Restart Claude Code to load the new version.
```
