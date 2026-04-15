# Upgrade Source Discovery

How to find the upstream source for an installed Indigo plugin. Sources are checked in priority order; on miss, fall through.

## Source 1: `Info.plist` `GithubInfo` (fastest when it works)

Plugins that ship via GitHub often embed a `GithubInfo` dict in `Contents/Info.plist`. When present and correct, it gives us the repo coordinates per-install with zero shared data needed.

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

The bundle path comes from `mcp__indigo__list_plugins` (the `path` field, captured into `$PLUGIN_PATH`). Use the absolute `PlistBuddy` binary path so this works on any macOS without relying on the system `$PATH` variable:

```bash
/usr/libexec/PlistBuddy -c "Print :GithubInfo:GithubUser" "$PLUGIN_PATH/Contents/Info.plist" 2>/dev/null
/usr/libexec/PlistBuddy -c "Print :GithubInfo:GithubRepo" "$PLUGIN_PATH/Contents/Info.plist" 2>/dev/null
```

Non-zero exit → no GitHub source declared → fall through to Source 2.

### Querying GitHub

```bash
gh api /repos/$USER/$REPO/releases/latest
```

Capture from the JSON response:
- `tag_name` — release tag (strip leading `v` before version compare)
- `html_url` — release page, used as release notes link
- `assets[*]` — find the entry whose `name` ends in `.indigoPlugin.zip`; record its `browser_download_url`. **If no such asset exists, do not mark the plugin unresolved yet** — fall back to the zipball URL `https://api.github.com/repos/$USER/$REPO/zipball/$TAG`, which downloads the repo source snapshot at that tag. Some authors ship plugins as a source-only release where the `.indigoPlugin/` bundle is embedded in the repo tree; the install workflow knows how to handle that layout (see `install-workflow.md` step 3).

### Fall-through on gh-api failure

**Important**: if `gh api` returns 404 or any other error for this `GithubInfo`, do not mark the plugin unresolved. Instead fall through to Source 2 (the bundled registry). The local `GithubInfo` is sometimes stale or wrong — a plugin author may have moved the repo, typo'd the slug, or published a new release path. The registry is curated and often has a working slug for plugins whose local metadata is bad.

Common stale-local cases observed in the wild:
- `simons-plugins/UKTrains` (local) vs `simons-plugins/indigo-UKTrains` (registry)
- `FlyingDiver/Indigo-Harmony` (local) vs the actual published repo name in the registry
- `Ghawken/iMessagePlugin` (local) 404s; registry may have a different slug

### Private repos

If `gh api` returns 404 *and* the registry also has no entry, the repo may be private and the user's token lacks access. Report the plugin as unresolved with a "private repository or missing GithubInfo" hint.

## Source 2: Bundled plugin source registry

`$CLAUDE_PLUGIN_ROOT/data/plugin-source-registry.json` — a pre-populated map of `bundle_id → upstream` that ships with this marketplace plugin. Zero runtime scraping for plugins in the registry — it's a file read.

### Registry schema (v2)

```json
{
  "updated_at": "2026-04-15",
  "schema_version": 2,
  "plugins": {
    "<bundle_id>": {
      "name": "Human-readable name",
      "github": "user/repo",
      "store_url": "https://www.indigodomo.com/pluginstore/N/",
      "store_download": "https://downloads.indigodomo.com/.../plugin.indigoPlugin.zip"
    }
  }
}
```

**Field semantics** (each optional except `name`):

- `name` — display name. Always present.
- `github` — `user/repo` slug. If present, prefer GitHub releases for version tracking.
- `store_url` — Indigo store detail page URL. Used as a release-notes link and as a runtime fetch target for store-only plugins (see below).
- `store_download` — direct download URL from the store page. Used as a **download fallback** when the GitHub release has no `.indigoPlugin.zip` asset AND the zipball fallback doesn't work. Always preserved when scraping, even for GitHub-backed entries, so there's something to fall back to.

Entries come in three shapes in practice:

1. **GitHub-backed with fallback** (most common, ~187/208): `github` + `store_download`. Version tracking via `gh api releases/latest`, download asset fallback via `store_download` if the release doesn't publish a `.indigoPlugin.zip`.
2. **Store-only** (~21/208): `store_url` + `store_download` only, no `github`. Version tracking requires fetching `store_url` at runtime and parsing the detail page. Download via `store_download`.
3. **GitHub-only** (rare): `github` with no store fields. Fine — upstream never got indexed on the store, or the scrape missed it.

### Loading the registry

```bash
REGISTRY="$CLAUDE_PLUGIN_ROOT/data/plugin-source-registry.json"
```

`$CLAUDE_PLUGIN_ROOT` is set by Claude Code to the root of this marketplace plugin. Read the JSON, look up by bundle ID:

```bash
jq -e ".plugins[\"$BUNDLE_ID\"]" "$REGISTRY"
```

Non-zero exit → not in the registry → fall through to Source 3.

### Live overlay (optional, short-circuits release cycle)

The bundled registry updates only when a new version of `indigo-claude-plugin` is pulled via `/plugin marketplace update`. To let registry contributors see their additions take effect immediately without waiting for a release, the skill also looks for a live overlay at `$HOME/.claude/indigo-plugin-source-registry-live.json`.

Resolution order:

1. If the live overlay exists AND is younger than 6 hours, use it.
2. If the live overlay exists AND is older than 6 hours, OR doesn't exist, fetch `https://raw.githubusercontent.com/simons-plugins/indigo-claude-plugin/main/data/plugin-source-registry.json`, validate it parses as JSON with the expected schema (has `plugins` key with a dict value), write it to the live overlay path atomically, use it.
3. If the fetch fails (offline, GitHub down, rate-limited), fall back to the bundled `$CLAUDE_PLUGIN_ROOT/data/plugin-source-registry.json`.

`/indigo:update-plugins refresh` as a user-facing refresh: delete the live overlay file and re-fetch.

This means: contributors PR a new entry → merge to `main` → live within 6 hours for everyone running the skill, no release needed.

### Contributing to the registry

Users who discover a plugin not in the registry — or notice a stale `github` slug — open a PR against `simons-plugins/indigo-claude-plugin` adding or updating an entry in `data/plugin-source-registry.json`. CI should skip the version-bump check for PRs whose diff is entirely under `data/`, so registry-only PRs don't bump the plugin version.

## Source 3: Store scraping fallback (rare)

For installed plugins that are in neither the local Info.plist nor the registry. See `store-scraping.md`. Suggest the user open a PR adding the plugin to the registry when this path triggers.

## Unresolved

Plugins that didn't resolve through any source. Informational, not an error. Common reasons:

- Built-in Indigo plugins (Airfoil Pro, Alexa, Email+, Virtual Devices, SQL Logger, Timers and Pesters, Global Property Manager) — ship with Indigo itself, not from GitHub or a public store entry
- Sideloaded from a private `.indigoPlugin.zip`
- GitHub-hosted but neither Info.plist nor registry knows the repo
- Author distributes via their own website

Manual remediation hint: "check the plugin's documentation, or add an entry to `data/plugin-source-registry.json` if you know the source."

## Parallelisation

Phase 2 is per-plugin independent. Run concurrently with background bash. `gh api` calls, `PlistBuddy` reads, and registry lookups are all independent. Cap concurrency at ~8. For small plugin counts (<10) serial is fine.

Don't persist per-plugin Phase 2 results across runs — GitHub releases change and a stale per-plugin cache produces wrong diffs. The registry (bundled + live overlay) is the only persistent data; live version checks against GitHub or store are always fresh.
