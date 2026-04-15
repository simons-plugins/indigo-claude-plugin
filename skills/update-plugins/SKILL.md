---
name: update-plugins
description: >-
  This skill should be used when the user asks to "check for plugin updates",
  "update Indigo plugins", "bulk update plugins", "check which plugins are out
  of date", "upgrade plugins", "update all plugins", or similar bulk plugin
  maintenance tasks on an Indigo home automation server. Discovers installed
  plugins via MCP, finds upgrade candidates from GitHub releases or the Indigo
  plugin store, previews a diff, and applies upgrades with confirmation.
match:
  - "**/.claude/indigo-plugin-store-cache.json"
---

# Indigo Plugin Bulk Updater

Checks every installed Indigo plugin against its upstream source, reports which are out of date, and — with user confirmation — downloads and deploys upgrades.

This skill is the detailed reference that the `/indigo:update-plugins` command loads. It is designed to be used **interactively** — the user always sees the diff before anything is written to disk.

## Core Concepts

- **MCP as source of truth for installed state**. Use `mcp__indigo__list_plugins` to enumerate plugins; use `mcp__indigo__get_plugin_by_id` for post-upgrade verification. The MCP returns the canonical bundle path, so no path needs to be hardcoded — the command works on any Indigo install, not just the author's.
- **Two upstream sources, in priority order**: GitHub releases (preferred, clean API) → Indigo plugin store (fallback, HTML scraping).
- **Bundle identifier is the match key**. `CFBundleIdentifier` from the plugin's `Info.plist` is always reliable. Don't match on display name — names drift and collide.
- **`Info.plist` `GithubInfo`** is an Indigo-documented convention for plugins hosted on GitHub. When present, it gives us the repo coordinates with zero guessing.
- **Updates only**. This skill never installs a plugin that isn't already present. First installs must go through Indigo's UI per workspace convention.
- **Check → confirm → apply** is the only flow. No silent or batched automation in v1.

## Workflow

Follow all phases in order. The `/indigo:update-plugins` command file summarises these — this doc is the detailed version when something isn't obvious.

### Phase 1 — DISCOVER

```text
mcp__indigo__list_plugins
```

Capture `id`, `displayName`, `version`, `path`, `enabled` for each plugin. Include disabled plugins — the user may want to update them too, even if they're currently off.

### Phase 2 — RESOLVE UPGRADE SOURCE

For each plugin, consult `references/discovery.md`. The short version:

1. **Try GitHub** — read `<path>/Contents/Info.plist`, look for `GithubInfo.GithubUser` and `GithubInfo.GithubRepo`. If both present, query `gh api /repos/<user>/<repo>/releases/latest` and record `tag_name`, `assets[*].browser_download_url` for any `.indigoPlugin.zip` asset, `html_url`.
2. **Try store** — if no GithubInfo, look up the bundle ID in the store cache (Phase 3). If the cache was built from scraped detail pages, the entry already holds everything needed.
3. **Unresolved** — record the plugin but continue processing others.

Parallelise heavily. GitHub calls are independent; do them concurrently via subagents or background bash.

### Phase 3 — MAINTAIN STORE CACHE

The cache file lives at `~/.claude/indigo-plugin-store-cache.json`. This is a generic user path — **do not** hardcode to a specific workspace or user directory. Use `$HOME`.

Cache schema (example):

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

Refresh when: file doesn't exist, is older than 24 hours, or the user explicitly requests a refresh.

Refresh procedure:
1. Fetch the store listing (see `references/store-scraping.md` for the URL pattern and parse rules)
2. Extract plugin detail page URLs
3. Fetch each detail page (parallelise, be polite — small inter-request delay)
4. Parse the five required fields per `references/store-scraping.md`
5. Run the parse self-test against one known-good reference plugin; abort cache rebuild if the HTML has drifted
6. Write the cache atomically (write to a temp path, then `mv` into place)

### Phase 4 — DIFF

For each plugin with a resolved upstream, parse both version strings. Prefer `packaging.version.parse` when available; fall back to lexicographic compare if parsing raises. Strip leading `v`.

Produce a grouped report:

```markdown
## Upgrades available

| Plugin | Bundle ID | Installed → Latest | Source | Release Notes |
|--------|-----------|---------------------|--------|---------------|
| ...    | ...       | 1.0.3 → 1.1.0       | github | <link>        |

## Up to date

| Plugin | Installed |
|--------|-----------|

## Unresolved (no upstream source found)

| Plugin | Bundle ID | Notes |
|--------|-----------|-------|
```

### Phase 5 — CONFIRM

Print the report. Wait for the user. Accepted replies:

- `all` — apply every row in the "Upgrades available" section
- `all except foo` / `all except foo, bar` — apply all but the named exclusions (match on name OR bundle ID)
- A single plugin name or bundle ID — apply that one
- `none` / `no` / `stop` — exit cleanly with no changes

Anything ambiguous → ask again. Never guess at consent.

### Phase 6 — APPLY

Follow `references/install-workflow.md` per plugin. Sequence summary:

1. **Download** — `gh release download <tag> --repo <user>/<repo> --pattern '*.indigoPlugin.zip' --dir <tmp>` for GitHub, `curl -L -o <tmp>/bundle.zip <url>` for store
2. **Stage** — `unzip` to a temp dir. Expect a single `<Name>.indigoPlugin` directory at the top level
3. **Verify bundle identifier** — read the staged `Contents/Info.plist` `CFBundleIdentifier` and assert it equals the installed plugin's bundle ID. If mismatch, **abort this plugin** and log why. Do not rsync over a different bundle.
4. **Verify version** — read the staged `PluginVersion` and assert it matches what the upstream source advertised. Mismatch is a warning but not a hard fail (the source may have updated between check and apply).
5. **Deploy** — `rsync -av --delete <staged>/Contents/ <installed_path>/Contents/`. Use the `path` returned by `mcp__indigo__list_plugins` / `mcp__indigo__get_plugin_by_id` as the destination — never hardcode
6. **Restart** — `mcp__indigo__restart_plugin(plugin_id=<bundle_id>)`
7. **Verify startup** —
   - Poll `mcp__indigo__get_plugin_by_id` until the returned version matches the new version (or 15s timeout)
   - Fetch recent event log with `mcp__indigo__query_event_log` and look for a "Started plugin" line for this bundle ID within the last 30 seconds
   - If the log shows error-level entries from this plugin during the window, treat as a failure
8. **Cleanup** — remove the temp download and staging dirs

Record per-plugin status and continue to the next. Only halt on systemic failures (filesystem unwritable, MCP unreachable, network totally dead).

### Phase 7 — SUMMARY

```markdown
## Update summary

**Upgraded** (3):
- Netro Smart Sprinklers: 2026.1.3 → 2026.4.1
- 8 Channel Network Relay: 2.0.0 → 2.0.1
- ...

**Failed** (1):
- Foo Plugin: verification failed — bundle ID mismatch in downloaded asset

**Unresolved** (2):
- Custom Plugin X: no GithubInfo, not found in store
- Legacy Plugin Y: no upstream source
```

For failures, include a one-line manual recovery hint (e.g. "download manually from <url> and install via Indigo UI").

## Safety Rules

- **Never** install a plugin that isn't already present. If the bundle ID isn't in the MCP's list, it's not a candidate.
- **Always verify bundle ID** on the staged download before `rsync`. A wrong-bundle substitution would silently replace a different plugin.
- **Use the MCP-reported `path`** for the destination. Do not hardcode `/Library/Application Support/Perceptive Automation/...` — let the MCP tell you where the plugin lives.
- **Interactive only**. No automation hooks, no cron, no silent apply. The user always sees the report and confirms.
- **One plugin at a time** during the apply phase, so a failure in one doesn't block the others or leave the Indigo server mid-restart on a known-good upgrade.

## Related Skills

- **`/indigo:dev`** — Indigo SDK plugin development reference. Useful if the user wants to understand what's inside a plugin bundle before trusting an upgrade.
- **`/indigo:api`** — Indigo REST/WebSocket API reference. Not directly used here but helpful if the verification phase needs to confirm plugin-specific endpoints came up.
