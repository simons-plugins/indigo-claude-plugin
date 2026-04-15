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
- Roll back on failure
- Handle paid / authenticated store downloads
- Run non-interactively — you always confirm before anything is deployed

## On Command Load

1. Read `skills/update-plugins/references/discovery.md` — how to find the upstream source for each installed plugin
2. Read `skills/update-plugins/references/store-scraping.md` — parse rules for Indigo plugin store detail pages
3. Read `skills/update-plugins/references/install-workflow.md` — download → verify → rsync → restart sequence
4. Begin the phased workflow below

## Workflow

Follow every phase in order. Do not skip ahead to apply without showing the report and getting explicit go-ahead.

### Phase 1 — DISCOVER

Call `mcp__indigo__list_plugins` to get every installed plugin. For each entry, capture:
- `id` (bundle identifier — the match key)
- `displayName`
- `version` (installed version)
- `path` (bundle path on the Indigo server — used later for both reading Info.plist and for the deploy target)
- `enabled`

**No filtering.** Every installed plugin is a candidate regardless of author.

### Phase 2 — RESOLVE UPGRADE SOURCE

For each installed plugin, determine where to check for updates. See `references/discovery.md` for the full logic. Summary:

1. Read `<path>/Contents/Info.plist` and look for a `GithubInfo` dict with `GithubUser` + `GithubRepo` keys.
2. If present → source is **GitHub**. Query `gh api /repos/<user>/<repo>/releases/latest` and record tag, version, asset URL, release notes URL.
3. If absent → source is **store**. Look up the bundle ID in the store cache (Phase 3).
4. If neither yields a result → source is **unresolved**. Record it but don't block anything else.

Parallelise across plugins. Don't process them one at a time — a 30-plugin serial pass over the network is painfully slow.

### Phase 3 — MAINTAIN STORE CACHE

Store-sourced plugins need a `bundle_id → {name, latest_version, detail_url, download_url, github_url}` map. Cache it at `~/.claude/indigo-plugin-store-cache.json`.

Refresh the cache when:
- It doesn't exist
- It is older than 24 hours
- The user passes a refresh flag (`/indigo:update-plugins refresh`)

Before trusting a freshly refreshed cache, run the parse self-test described in `references/store-scraping.md` — if the HTML has drifted and any of the five required fields are missing for the reference plugin, bail with a clear error rather than silently producing wrong results.

### Phase 4 — DIFF

For every plugin with a resolved source, compare installed version to latest:
- Use `packaging.version.parse` where possible
- Fall back to lexicographic comparison for version strings that don't parse cleanly
- Strip leading `v` before comparing (`v1.0.3` vs `1.0.3`)
- Treat `YYYY.R.P`, semver, and prereleases as upgrades when the parsed version is strictly greater

Build an upgrade report with columns: `name`, `bundle_id`, `installed → latest`, `source`, `release notes`.

Group the report into three sections:
- **Upgrades available** — actionable items
- **Up to date** — informational
- **Unresolved** — plugins where no upstream source was found (show at the bottom, never treat as an error)

### Phase 5 — CONFIRM

Render the report as a markdown table. Wait for explicit user go-ahead. Accept:
- `all` → apply every upgrade in the "Upgrades available" section
- `all except <name>` / `all except <names>` → apply all but the excluded ones
- A specific plugin name or bundle ID → apply just that one
- `none` or `no` → stop cleanly, no writes

Do not interpret ambiguous replies as consent. When in doubt, ask again.

### Phase 6 — APPLY (per plugin, one at a time)

For each plugin the user confirmed, follow the sequence in `references/install-workflow.md`. Summary:

1. Download the `.indigoPlugin.zip` (`gh release download` for GitHub, `curl` for store)
2. Unzip to a temp staging dir
3. **Safety check**: the staged bundle's `Info.plist` must have the same `CFBundleIdentifier` as the installed plugin and a version matching what the upstream source advertised. If either check fails, abort this plugin's upgrade and continue to the next.
4. `rsync -av --delete` the staged `Contents/` over the live plugin's `Contents/` (use the `path` returned by MCP — never hardcode a deploy path)
5. `mcp__indigo__restart_plugin(plugin_id=<bundle_id>)`
6. Verify: `mcp__indigo__get_plugin_by_id` returns the new version; `mcp__indigo__query_event_log` shows a clean startup (look for the "Started plugin" line and the absence of error lines in the seconds after restart)
7. Clean up the temp staging dir

Report pass/fail for each plugin. On failure of one plugin, continue to the next — don't halt the whole batch unless the failure indicates something systemic (filesystem unwritable, MCP unreachable).

### Phase 7 — SUMMARY

Report:
- ✅ Successful upgrades (name, old → new version)
- ❌ Failed upgrades (name, error, any manual recovery steps)
- ℹ️ Unresolved plugins (name, reason — no `GithubInfo`, not in store, etc.)

If any plugin failed, suggest a manual next step (check the bundle path, try a manual download, file an issue).

## Safety

- **Never install a new plugin** via this command. If `mcp__indigo__list_plugins` doesn't know about a bundle ID, it's out of scope — the user must double-click install it via Indigo's UI first.
- **Always verify bundle ID before rsync**. A download from an unexpected source must not clobber a different plugin.
- **Interactive only**. No cron, no hooks, no silent application. The user always sees the report and types their confirmation.
- **Use the MCP-reported `path`** for the deploy target, not a hardcoded value. This is how the command works for any user of the marketplace, not just the author.
