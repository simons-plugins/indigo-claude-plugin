---
name: update-plugins
description: >-
  This skill should be used when the user asks to "check for plugin updates",
  "update Indigo plugins", "bulk update plugins", "check which plugins are out
  of date", "upgrade plugins", "update all plugins", or similar bulk plugin
  maintenance tasks on an Indigo home automation server. Discovers installed
  plugins via MCP, finds upgrade candidates from GitHub releases or the Indigo
  plugin store, previews a diff, and applies upgrades with confirmation.
---

# Indigo Plugin Bulk Updater

Checks every installed Indigo plugin against its upstream source, reports which are out of date, and — with user confirmation — downloads and deploys upgrades. Interactive only.

This skill is loaded by the `/indigo:update-plugins` command. The reference files under `references/` hold the detailed logic — this doc is the top-level workflow.

## Workflow

### Phase 1 — DISCOVER

Call `mcp__indigo__list_plugins` (default `include_disabled=false`). For each returned entry, capture `id`, `name`, `version`, `enabled`, `path`.

**Disabled plugins are intentionally not candidates.** `list_plugins` with its default parameter excludes them, which is what we want — restarting a disabled plugin via `restart_plugin` could re-enable it unexpectedly. If the user wants to update a disabled plugin, tell them to enable it in Indigo first, then re-run.

### Phase 2 — RESOLVE UPGRADE SOURCE

For each plugin, see `references/discovery.md`. Short version:

1. **Try GitHub** — read `<path>/Contents/Info.plist` for `GithubInfo.GithubUser` + `GithubInfo.GithubRepo`. If present → `gh api /repos/<user>/<repo>/releases/latest` → capture `tag_name`, `html_url`, and any asset ending in `.indigoPlugin.zip`.
2. **Try store** — no GithubInfo → look up the bundle ID in the store cache (Phase 3).
3. **Unresolved** — neither source resolves → record and continue.

Parallelise. See `references/discovery.md` for the cap and concurrency notes.

### Phase 3 — MAINTAIN STORE CACHE

Cache at `$HOME/.claude/indigo-plugin-store-cache.json`. Schema:

```json
{
  "fetched_at": "2026-04-15T12:00:00Z",
  "listing_etag": "...",
  "plugins": {
    "pro.sleepers.indigoplugin.8channel-relay": {
      "name": "8 Channel Network Relay",
      "latest_version": "2.0.1",
      "detail_url": "https://www.indigodomo.com/pluginstore/196/",
      "download_url": "https://github.com/IndigoDomotics/indigo-8channel-relay/releases/download/v2.0.1/8chRelay.indigoPlugin.zip",
      "github_url": "https://github.com/IndigoDomotics/indigo-8channel-relay"
    }
  }
}
```

Refresh when: file missing, older than 24h, or the user asks. Full refresh procedure, parse rules, and the self-test that guards against HTML drift: see `references/store-scraping.md`.

### Phase 4 — DIFF

For each plugin with a resolved upstream, compare installed version to latest. Strip a leading `v`. Prefer `python3 -c 'from packaging.version import parse as p; ...'` if Python is available in the runtime; otherwise split on `.` and compare numeric segments, falling back to string compare if a segment isn't an integer. `2026.4.1`, `1.0.3`, `v1.0-beta` should all work.

Produce a grouped report:

```markdown
## Upgrades available

| Plugin | Bundle ID | Installed → Latest | Source | Release Notes |
|--------|-----------|---------------------|--------|---------------|

## Up to date

| Plugin | Installed |
|--------|-----------|

## Unresolved (no upstream source found)

| Plugin | Bundle ID | Notes |
|--------|-----------|-------|
```

### Phase 5 — CONFIRM

Print the report. Wait for the user. Accepted replies:

- `all` — apply every row in "Upgrades available"
- `all except foo` / `all except foo, bar` — apply all but the named exclusions (match on name or bundle ID)
- A single plugin name or bundle ID — apply that one
- `none` / `no` / `stop` — exit cleanly, no changes

Anything ambiguous → ask again.

### Phase 6 — APPLY

Follow `references/install-workflow.md` per plugin, one at a time. That file is the authoritative sequence; do not reinvent it here.

### Phase 7 — SUMMARY

Print three sections: **Upgraded** (name, old → new version), **Failed** (name, reason, one-line manual recovery hint), **Unresolved** (name, why no source was found).

## Safety Rules

The rules below are enforced by the phased instructions above and by the detailed sequence in `references/install-workflow.md`. They are listed here so a reader can audit them at a glance.

- **Updates only.** Never install a plugin that isn't already returned by `mcp__indigo__list_plugins`. First installs go through Indigo's UI.
- **Verify bundle ID before rsync.** Step 4 of the install workflow aborts the upgrade if the staged bundle's `CFBundleIdentifier` doesn't match the installed plugin.
- **Deploy path comes from MCP.** Never hardcode `/Library/Application Support/...`. Read it from the `path` field returned by `list_plugins` / `get_plugin_by_id`.
- **Interactive only.** No cron, no hooks, no silent apply. The user always sees the report and types confirmation.
- **One plugin at a time.** Failures stay isolated; the Indigo server is never left mid-restart on a known-good upgrade.
- **Disabled plugins are skipped.** See Phase 1.

## Related Skills

- **`/indigo:dev`** — Indigo SDK plugin development reference. Useful to understand what's inside a plugin bundle before trusting an upgrade.
- **`/indigo:api`** — Indigo REST/WebSocket API reference. Helpful if post-upgrade verification needs to confirm a plugin-specific endpoint came up.
