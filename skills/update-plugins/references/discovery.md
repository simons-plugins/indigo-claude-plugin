# Upgrade Source Discovery

How to find the upstream source for an installed Indigo plugin. Three sources, checked in priority order; fall through on miss.

## Source 1: `Info.plist` `GithubInfo` (preferred)

Plugins that ship via GitHub often embed a `GithubInfo` dict in `Contents/Info.plist`. When present, it gives us the repo coordinates with zero guessing and works for every install of that plugin without needing any shared data.

Example:

```xml
<key>GithubInfo</key>
<dict>
    <key>GithubRepo</key>
    <string>netro-indigo</string>
    <key>GithubUser</key>
    <string>simons-plugins</string>
</dict>
```

### Reading GithubInfo

The bundle path comes from `mcp__indigo__list_plugins` (the `path` field). Use the absolute `PlistBuddy` path so this works on any macOS without relying on `$PATH`:

```bash
/usr/libexec/PlistBuddy -c "Print :GithubInfo:GithubUser" "$PATH/Contents/Info.plist" 2>/dev/null
/usr/libexec/PlistBuddy -c "Print :GithubInfo:GithubRepo" "$PATH/Contents/Info.plist" 2>/dev/null
```

Non-zero exit → no GitHub source declared → fall through to Source 2.

### Querying GitHub

```bash
gh api /repos/$USER/$REPO/releases/latest
```

Capture:
- `tag_name` — release tag (strip leading `v` before version compare)
- `html_url` — release page, used as release notes link
- `assets[*]` — find the entry whose `name` ends in `.indigoPlugin.zip`; record its `browser_download_url`. If no such asset exists, mark the plugin as unresolved (upstream exists but doesn't publish a downloadable bundle)

`gh api` returns 404 if the repo has no releases yet, or if it's private and the user's token lacks access. Both cases → mark the plugin as unresolved with a short reason string so the user knows why.

## Source 2: Bundled plugin source registry

`data/plugin-source-registry.json` at the root of this marketplace plugin is a pre-populated map of `bundle_id → upstream`. Ships as static data so there is **zero runtime scraping** for plugins in the registry — it's a file read, not a network request. Fresh registry updates arrive via `/plugin marketplace update`, the same mechanism users already use to get new skill code.

### Registry schema

```json
{
  "updated_at": "2026-04-15",
  "note": "...",
  "source": "...",
  "plugins": {
    "<bundle_id>": {
      "name": "Human-readable name",
      "github": "user/repo"
    },
    "<other_bundle_id>": {
      "name": "Human-readable name",
      "store_url": "https://www.indigodomo.com/pluginstore/N/",
      "store_download": "https://downloads.indigodomo.com/pluginstore/.../plugin.indigoPlugin.zip"
    }
  }
}
```

Entries come in two shapes:

**GitHub-backed** — has a `github` field (`user/repo` slug). Resolution is identical to Source 1: query `gh api /repos/<github>/releases/latest` and use the tag + asset URL. This is the overwhelming majority of entries (~90% after the initial seed).

**Store-only** — has `store_url` and optionally `store_download`. The plugin is published via Indigo's store with no GitHub mirror, so we still need a lightweight runtime fetch to get the latest version. Fetch the `store_url` detail page, parse it per `store-scraping.md`, and extract the latest version and download URL. This is one HTTP GET per store-only plugin per run (no listing enumeration, no cache-build sweep).

### Loading the registry

```bash
REGISTRY="$CLAUDE_PLUGIN_ROOT/data/plugin-source-registry.json"
```

`$CLAUDE_PLUGIN_ROOT` is set by Claude Code to the root of this marketplace plugin. Read the JSON, look up the installed bundle ID under `.plugins`:

```bash
jq -e ".plugins[\"$BUNDLE_ID\"]" "$REGISTRY"
```

Non-zero exit → not in the registry → fall through to Source 3.

### Contributing to the registry

Users who discover a plugin not in the registry — or a GitHub URL the registry doesn't know about — are expected to open a PR against `simons-plugins/indigo-claude-plugin` adding or updating an entry. The registry is a flat JSON file, easy to edit, and the next marketplace update pushes the change to everyone.

Keep entries minimal. No versions, no dates, no dependency info — the whole file is just a routing table from bundle ID to upstream.

## Source 3: Store scraping fallback (rare)

For installed plugins that are in neither the local Info.plist nor the bundled registry. See `store-scraping.md`. This path is now expected to be unusual — the bundled registry covers the common case, so store scraping only kicks in when a user has installed a plugin the registry author hasn't seen yet.

When this path triggers, suggest to the user that they open a PR to add the plugin to the bundled registry so future users don't need to re-scrape.

## Unresolved

Plugins that didn't resolve through any of the three sources. Informational, not an error. Common reasons:

- Sideloaded from a private `.indigoPlugin.zip`
- Lives on GitHub but neither the Info.plist nor the registry knows the repo
- Author distributes via their own website
- Plugin was never fully set up

Manual remediation hint: "check the plugin's documentation or contact the author for update instructions, then consider adding an entry to `data/plugin-source-registry.json`."

## Parallelisation

Phase 2 is per-plugin independent. Run it concurrently with background bash — `gh api` calls, `PlistBuddy` reads, and registry lookups are all independent. Cap concurrency at ~8 to be polite to GitHub and the user's network. For small plugin counts (<10) serial is fine.

Don't persist per-plugin Phase 2 results across runs — GitHub releases change and a stale per-plugin cache produces wrong diffs. The registry is the only persistent data; live version checks against GitHub or store are always fresh.
