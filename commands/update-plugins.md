---
name: update-plugins
description: Bulk Indigo plugin updater — finds installed plugins whose versions are out of date, previews the diff, and deploys upgrades with confirmation
---

# Indigo Plugin Bulk Updater

**Plugin**: https://github.com/simons-plugins/indigo-claude-plugin
**Slash command**: `/indigo:update-plugins`

## Description

Checks every installed Indigo plugin against its upstream source (GitHub releases or the Indigo plugin store), reports which are out of date, and — with confirmation — downloads and deploys the new bundle, then restarts the plugin.

**What it does NOT do:**
- Install plugins that aren't already present (first installs still require a double-click via Indigo's UI)
- Update disabled plugins (restarting a disabled plugin could re-enable it unexpectedly)
- Roll back on failure
- Handle paid / authenticated store downloads
- Run non-interactively — you always confirm before anything is deployed

## On Command Load

1. Read `skills/update-plugins/SKILL.md` — top-level workflow
2. Read `skills/update-plugins/references/discovery.md` — how to find the upstream source for each installed plugin
3. Read `skills/update-plugins/references/store-scraping.md` — parse rules for the store fallback
4. Read `skills/update-plugins/references/install-workflow.md` — the detailed download → verify → rsync → restart sequence
5. Begin the workflow below

## Workflow

Follow every phase in order. Do not skip ahead to apply without showing the report and getting explicit go-ahead.

### Phase 1 — DISCOVER

Call `mcp__indigo__list_plugins` with its default parameters (disabled plugins are excluded automatically — that's what we want). For each returned entry, capture:

- `id` (bundle identifier — the match key)
- `name` (display name)
- `version` (installed version)
- `path` (bundle path on the Indigo server — used for reading Info.plist and as the deploy destination)
- `enabled`

### Phase 2 — RESOLVE UPGRADE SOURCE

For each installed plugin, determine where to check for updates. See `references/discovery.md` for the full logic. Summary (three sources in priority order):

1. **Local `GithubInfo`** — read `<path>/Contents/Info.plist` via `/usr/libexec/PlistBuddy`. If `GithubInfo.GithubUser` + `GithubInfo.GithubRepo` are present → query `gh api /repos/<user>/<repo>/releases/latest`.
2. **Bundled registry** — look up the bundle ID in `$CLAUDE_PLUGIN_ROOT/data/plugin-source-registry.json`. Entries have either a `github` slug (→ GitHub releases) or a `store_url` (→ fetch the store detail page for version + download). No runtime scraping for plugins in the registry.
3. **Store scraping fallback** — for plugins in neither Info.plist nor the registry. See `references/store-scraping.md`. Rare; suggest a PR adding the plugin to the registry when it triggers.

If none resolve → mark unresolved and continue.

Parallelise across plugins — a 30-plugin serial pass over the network is painfully slow.

### Phase 3 — DIFF

For every plugin with a resolved source, compare installed version to latest. Strip leading `v`. Prefer `python3 -c 'from packaging.version import parse as p; ...'` when Python is available; fall back to split-on-`.` numeric-or-string segment compare. Handles `2026.4.1`, `1.0.3`, and `v1.0-beta`.

Build an upgrade report grouped into three sections:

- **Upgrades available** — actionable items
- **Up to date** — informational
- **Unresolved** — plugins where no upstream source was found (bottom of the report, never an error)

### Phase 4 — CONFIRM

Render the report. Wait for explicit user go-ahead. Accept:

- `all` → apply every upgrade in the "Upgrades available" section
- `all except <name>` / `all except <names>` → apply all but the excluded ones
- A specific plugin name or bundle ID → apply just that one
- `none` or `no` → stop cleanly, no writes

Do not interpret ambiguous replies as consent. When in doubt, ask again.

### Phase 5 — APPLY (per plugin, one at a time)

Follow `references/install-workflow.md` for the exact sequence. Every step — download, unzip-before-copy, verify bundle ID, rsync over the installed `Contents/`, restart via MCP, verify startup — is documented there with the commands to run. Don't reinvent the sequence here.

Report pass/fail per plugin. On failure of one plugin, continue to the next — don't halt the whole batch unless the failure indicates something systemic (filesystem unwritable, MCP unreachable, network dead).

### Phase 6 — SUMMARY

Report three sections:

- **Upgraded** — name, old → new version
- **Failed** — name, error, a one-line manual recovery hint
- **Unresolved** — name, reason (no GithubInfo, not in store, etc.)

If any plugin failed, suggest a concrete manual next step (check the bundle path, try a manual download, file an issue with the plugin author).

## Safety

All safety rules live in `SKILL.md` and `references/install-workflow.md`. Highlights: updates-only (never first-install), verify bundle ID before rsync, MCP-reported path as deploy destination (never hardcoded), interactive-only, one plugin at a time, disabled plugins skipped.
