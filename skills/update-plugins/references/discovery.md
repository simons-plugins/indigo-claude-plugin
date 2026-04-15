# Upgrade Source Discovery

How to find the upstream source for an installed Indigo plugin. Two sources, checked in priority order.

## Source 1: GitHub releases (preferred)

Indigo plugins that ship via GitHub embed a `GithubInfo` dict in `Contents/Info.plist`. This is a standard Indigo convention.

**Example** (from `Netro Sprinklers.indigoPlugin/Contents/Info.plist`):

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

The bundle path comes from `mcp__indigo__list_plugins` (the `path` field). Read the Info.plist at `<path>/Contents/Info.plist`. macOS has `/usr/libexec/PlistBuddy` which is the cleanest way to extract a value:

```bash
PlistBuddy -c "Print :GithubInfo:GithubUser" "<path>/Contents/Info.plist" 2>/dev/null
PlistBuddy -c "Print :GithubInfo:GithubRepo" "<path>/Contents/Info.plist" 2>/dev/null
```

If either command exits non-zero, the plugin doesn't declare a GitHub source — fall through to Source 2.

### Querying GitHub

```bash
gh api /repos/<user>/<repo>/releases/latest
```

Capture from the JSON response:
- `tag_name` — the release tag (strip leading `v` before comparing to installed version)
- `name` — human-readable release name (fallback display)
- `html_url` — the release page URL (use as release notes link)
- `assets[*]` — list of release assets. Find the one whose `name` ends in `.indigoPlugin.zip`. Record its `browser_download_url`. If no such asset exists, treat the plugin as unresolved (the upstream exists but doesn't publish a downloadable bundle).

### Rate limits

GitHub's unauthenticated limit is 60 requests/hour. With 20-30 plugins per run and daily cache refresh, we're well under. If `gh` is configured (`gh auth status`), the limit is 5000/hour — effectively unlimited for this use case. Assume `gh` is available and authenticated.

### Private repos

If `gh api` returns 404 for a repo that the user knows exists, the repo is probably private and the user's GitHub token doesn't have access. Report the plugin as unresolved with a "private repository" hint.

## Source 2: Indigo plugin store (fallback)

For plugins with no `GithubInfo`, look up the bundle ID in the store cache. The cache is a pre-scraped `bundle_id → metadata` map maintained by Phase 3 of the main workflow. See `store-scraping.md` for the scrape rules.

**If the bundle ID is in the cache:**
- `latest_version` → compare against installed version
- `download_url` → prefer this (often points to a GitHub release asset even for store-sourced plugins; in that case you're effectively using GitHub releases via the store as a directory)
- `detail_url` → use as the release notes link

**If the bundle ID is NOT in the cache:**
- The plugin isn't listed on the Indigo store (private plugin, custom build, or publicly unlisted)
- Mark as unresolved and continue

## Source 3: Unresolved

Record plugins with no upstream source. Report them at the end of the summary so the user knows which plugins aren't being tracked automatically. This is informational, not an error.

Common reasons:
- Plugin was sideloaded from a direct `.indigoPlugin.zip` download the user got privately
- Plugin lives on GitHub but doesn't declare `GithubInfo` and isn't on the store
- Plugin is from an author who distributes via their own website
- Plugin is disabled and never fully set up

For any of these, the manual remediation hint is: "check the plugin's documentation or contact the author for update instructions."

## Parallelisation

Phase 2 is per-plugin independent. For N installed plugins, Phase 2 is N potential network calls plus N Info.plist reads. Running them serially over 30 plugins can take 30+ seconds. Parallelise.

Options (in order of preference):
1. **Background bash**: launch `gh api` calls and Info.plist reads as background processes, collect results. Simple, effective, no external dependencies.
2. **Subagents** (`dispatch-parallel-agents` skill): one subagent per plugin resolves its own source and returns the result. Good when the per-plugin logic has more than one step and the subagent can short-circuit on GitHub-found plugins.
3. **Serial**: acceptable fallback for small plugin counts (<10) or when network is slow enough that parallelism adds little.

Whichever you pick, cap concurrency at ~8-10 to avoid hammering GitHub or the user's network.

## Caching per-plugin results

In-memory only. Don't persist Phase 2 results across runs — GitHub releases change frequently and a stale per-plugin cache would produce wrong diffs. The store cache persists; per-plugin GitHub queries do not.
