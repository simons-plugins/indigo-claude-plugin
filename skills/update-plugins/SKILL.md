---
name: update-plugins
description: >-
  This skill should be used when the user asks to "check for plugin updates",
  "update Indigo plugins", "bulk update plugins", "check which plugins are out
  of date", "upgrade plugins", "update all plugins", or similar bulk plugin
  maintenance tasks on an Indigo home automation server. Discovers installed
  plugins via MCP, finds upgrade candidates from GitHub releases or the
  bundled plugin source registry, previews a diff, and applies upgrades with
  confirmation.
---

# Indigo Plugin Bulk Updater

Checks every installed Indigo plugin against its upstream source, reports which are out of date, and — with user confirmation — downloads and deploys upgrades. Interactive only.

Loaded by the `/indigo:update-plugins` command. The reference files under `references/` hold the detailed logic — this doc is the top-level workflow.

## Workflow

### Phase 1 — DISCOVER

Call `mcp__indigo__list_plugins` with its default parameters (disabled plugins are excluded automatically). For each returned entry, capture `id`, `name`, `version` (note: this is `CFBundleVersion`, not `PluginVersion` — treat as advisory only), `enabled`, `path`.

**Disabled plugins are intentionally skipped.** `list_plugins` with its default parameter excludes them, which is what we want — restarting a disabled plugin via `restart_plugin` could re-enable it unexpectedly. If the user wants to update a disabled plugin, tell them to enable it in Indigo first, then re-run.

**Installed version is `PluginVersion` from Info.plist, not the MCP `version` field.** The MCP `version` field usually returns `CFBundleVersion` which is rarely updated. For accurate version diffs, read `PluginVersion` directly:

```bash
/usr/libexec/PlistBuddy -c "Print :PluginVersion" "$PATH/Contents/Info.plist"
```

Where `$PATH` is the `path` from `list_plugins` (with mount-prefix handling — see `references/install-workflow.md`).

### Phase 2 — RESOLVE UPGRADE SOURCE

Three sources checked in priority order. Full details in `references/discovery.md`. Short version:

1. **Local `GithubInfo`** — read `<path>/Contents/Info.plist` for `GithubInfo.GithubUser` + `GithubInfo.GithubRepo`. If present → `gh api /repos/<user>/<repo>/releases/latest`. **On 404 or any other error, fall through to Source 2** — local metadata is sometimes stale.
2. **Bundled registry** (`$CLAUDE_PLUGIN_ROOT/data/plugin-source-registry.json`, with optional live overlay from `raw.githubusercontent.com`) — a `bundle_id → {name, github?, store_url?, store_download?}` map. Resolution:
   - If entry has `github` → query GitHub releases. If the release has no `.indigoPlugin.zip` asset, try the GitHub zipball (`api.github.com/.../zipball/<tag>`). If that also fails, fall back to `store_download` if present.
   - If entry has only `store_url` → fetch the detail page at runtime to extract current version and download URL.
   - No runtime scraping for plugins that resolve fully through GitHub.
3. **Store scraping fallback** — for plugins in neither Info.plist nor registry. Rare; suggest a PR adding the plugin to the registry.

If none resolve → mark unresolved and continue.

Parallelise. See `references/discovery.md` for concurrency notes.

### Phase 3 — DIFF

For each plugin with a resolved upstream, compare installed version to latest. Strip leading `v`. Prefer `python3 -c 'from packaging.version import parse as p; ...'` if Python is available in the runtime; otherwise split on `.` and compare numeric segments, falling back to string compare if a segment isn't an integer. `2026.4.1`, `1.0.3`, `v1.0-beta` should all work.

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

### Phase 4 — CONFIRM

Print the report. Wait for the user. Accepted replies:

- `all` — apply every row in "Upgrades available"
- `all except foo` / `all except foo, bar` — apply all but the named exclusions (match on name or bundle ID)
- A single plugin name or bundle ID — apply that one
- `none` / `no` / `stop` — exit cleanly, no changes

Anything ambiguous → ask again.

### Phase 5 — APPLY

Follow `references/install-workflow.md` per plugin, one at a time. That file is the authoritative sequence; do not reinvent it here.

**Special case — MCP Server self-upgrade**: if the batch includes `com.vtmikel.mcp_server` (the plugin this skill uses to talk to Indigo), handle it specially — restarting it kills the skill's own connection. See the "Hard limitations" section in `install-workflow.md`. Recommended: skip with a clear manual-instruction message.

### Phase 6 — SUMMARY

Print three sections: **Upgraded** (name, old → new version), **Failed** (name, reason, one-line manual recovery hint), **Unresolved** (name, why no source was found). Also list any **Deferred** entries (e.g. MCP Server) separately with the exact manual steps needed.

## Safety Rules

Enforced by phase ordering and by the detailed sequence in `references/install-workflow.md`. Listed here for at-a-glance audit.

- **Updates only.** Never install a plugin that isn't already returned by `mcp__indigo__list_plugins`. First installs go through Indigo's UI.
- **Verify bundle ID before rsync.** Step 4 of the install workflow aborts the upgrade if the staged bundle's `CFBundleIdentifier` doesn't match the installed plugin.
- **Deploy path comes from MCP.** Never hardcode `/Library/Application Support/...`. Read from the `path` field returned by `list_plugins` / `get_plugin_by_id`. For cross-mount setups (skill running on a different Mac than the Indigo server), detect and apply a mount prefix.
- **Interactive only.** No cron, no hooks, no silent apply.
- **One plugin at a time.** Failures stay isolated.
- **Disabled plugins are skipped.** See Phase 1.
- **MCP Server never self-restarts via this skill.** Dedicated manual path.
- **Stop before rsync, start after.** For plugins with bundled native extensions, running-plugin file locks can break `rsync --delete`. The workflow restarts before and after the rsync for that reason.

## Related Skills

- **`/indigo:dev`** — Indigo SDK plugin development reference. Useful to understand what's inside a plugin bundle before trusting an upgrade.
- **`/indigo:api`** — Indigo REST/WebSocket API reference. Helpful if post-upgrade verification needs to confirm a plugin-specific endpoint came up.
