# Upgrade Source Discovery

How to find the upstream source for an installed Indigo plugin. Sources are checked in priority order; fall through on miss.

## Source 1: `Info.plist` `GithubInfo` (preferred)

Indigo plugins that ship via GitHub embed a `GithubInfo` dict in `Contents/Info.plist`. Example:

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

`gh api` returns 404 if the repo has no releases published yet, or if the repo is private and the user's token doesn't have access. Both cases → mark the plugin as unresolved with a short reason string so the user knows why.

## Source 2: Indigo plugin store (fallback)

For plugins with no `GithubInfo`, look up the bundle ID in the store cache. The cache is a pre-scraped `bundle_id → metadata` map built by Phase 3. See `store-scraping.md` for the scrape rules and the hard-earned caveats about what the store HTML actually exposes.

**If the bundle ID is in the cache:**
- `latest_version` → compare against installed
- `download_url` → prefer this (often points at a GitHub release asset even for store-sourced plugins — you're effectively using GitHub releases with the store as a directory)
- `detail_url` → release notes link

**If the bundle ID is NOT in the cache:**
- Plugin isn't listed on the store → mark unresolved, continue

## Source 3: Unresolved

Plugins with no upstream source. Informational only, not an error. Common reasons:

- Sideloaded from a private `.indigoPlugin.zip`
- Lives on GitHub but doesn't declare `GithubInfo` and isn't on the store
- Author distributes via their own website
- Plugin was never fully set up

Manual remediation hint: "check the plugin's documentation or contact the author for update instructions."

## Parallelisation

Phase 2 is per-plugin independent. Run it concurrently with background bash — `gh api` calls and `PlistBuddy` reads are independent. Cap concurrency at ~8 to be polite to GitHub and the user's network. For small plugin counts (<10) serial is fine.

Don't persist per-plugin Phase 2 results across runs — GitHub releases change and a stale per-plugin cache produces wrong diffs. The store cache persists; GitHub queries do not.

## Future: shared source-of-truth catalog

A shared `bundle_id → {user, repo}` mapping hosted in a public repo (e.g. as `plugin-source-registry.json` in `indigo-device-catalog`) could replace most of Source 2. The current store-scraping fallback is necessary only because some plugins on the Indigo store don't declare `GithubInfo` locally. A user-maintained catalog would let one person's scrape work benefit everyone, and would reduce store-page fetches to the long tail. Not implemented in v1.5.0; planned as a follow-up. When it lands, the resolution order becomes: local `GithubInfo` → shared catalog → store scrape → unresolved.
