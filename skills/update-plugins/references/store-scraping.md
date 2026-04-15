# Indigo Plugin Store Scraping (rare path)

Runtime scraping of the Indigo plugin store. Called in two situations:

1. **Store-only registry entries** — a plugin is in `data/plugin-source-registry.json` with a `store_url` (not a `github` slug). The registry tells us the exact detail page URL; we fetch it and parse to get the latest version and download URL. One HTTP GET per store-only plugin per run.
2. **Unknown plugin fallback** — a plugin is installed locally but not in Info.plist AND not in the bundled registry. We don't know its detail URL, so we need to enumerate and match. This path should be rare once the registry is seeded; treat it as a recovery mode and suggest the user open a PR adding a registry entry when it triggers.

The second path is expensive and lossy. The first path is cheap and deterministic. **Prefer the first whenever possible.**

## What the store exposes

The store has no documented JSON/RSS/API feed. Detail pages are server-rendered static HTML readable by `WebFetch` without JavaScript. Empirically (from the initial seed scrape of ~210 detail pages), every page reliably exposes:

- Plugin name (heading)
- Latest version string (as "Latest Version: vX.Y.Z")
- Download URL (anchor pointing at either a github.com release asset or a `downloads.indigodomo.com/...` URL)

The **bundle identifier** is hit-or-miss — some pages expose it in the visible text, others don't. For store-only registry entries this isn't a problem (we already know the bundle ID from the registry), but it's why the unknown-plugin fallback path is unreliable for bulk discovery.

## Path 1: Store-only registry entry (preferred runtime use)

The registry entry already contains:
- `store_url` — the detail page URL
- `store_download` (optional) — a previously-seen download URL, may be stale

Fetch the detail page, parse it, extract:
- `latest_version` — for the version diff
- `download_url` — the current download URL (use this; don't trust the cached `store_download` field which may be stale)

Single fetch. No enumeration, no cache.

## Path 2: Unknown plugin fallback (recovery mode)

A plugin is installed, has no `GithubInfo`, and isn't in the registry. We have the bundle ID from MCP but no way to map it to a detail page directly.

Procedure:
1. Fetch `https://www.indigodomo.com/pluginstore/` to enumerate all detail page URLs
2. Fetch each one (parallelise, cap 4-6 concurrent)
3. Parse each for bundle ID
4. Match on bundle ID → found the detail page → treat as Path 1 from here

This is slow (~200 fetches). Cache the results for 24h in `$HOME/.claude/indigo-plugin-store-cache.json` as a `bundle_id → detail_url` map so subsequent runs within the cache window don't re-enumerate. When this path succeeds, tell the user: "This plugin isn't in the bundled registry yet. Consider opening a PR at `simons-plugins/indigo-claude-plugin` to add it, so future users don't need the fallback scrape."

If the fallback fails to find a matching bundle ID → mark the plugin unresolved.

## Parse rules

Defensive parsing: CSS selector OR regex fallback for each field, so a single DOM change doesn't break everything. Keep every selector/regex in this file so HTML drift can be fixed in one place.

Starting anchors (refine empirically as the store HTML changes):

```text
Bundle identifier: text matching /Bundle Identifier[:\s]+([a-z0-9._-]+)/i
                   (not always present — fine for Path 1, critical for Path 2)
Latest version:    text matching /Latest Version[:\s]+v?([0-9][0-9a-z.+\-]*)/i
Download URL:      any <a href> ending in `.indigoPlugin.zip` or `.zip`
GitHub URL:        any <a href> matching `github.com/<user>/<repo>` (no trailing path)
Name:              <h1> or <title> text, stripped of the site suffix
```

If a field extraction returns None for a detail page in Path 1, log a warning and report the plugin as unresolved for this run.

## Parse self-test

Before trusting any parse result, run the self-test against a pinned reference URL:

- Reference URL: `https://www.indigodomo.com/pluginstore/196/`
- Expected bundle ID: `pro.sleepers.indigoplugin.8channel-relay`
- Expected name substring: `8 Channel`

If the assertions fail, the store HTML has drifted. Report: "Indigo plugin store HTML has drifted — store-based upgrade detection is temporarily disabled. Update `skills/update-plugins/references/store-scraping.md` with fresh parse rules, or skip affected plugins for this run." Continue with Source 1 (Info.plist GithubInfo) and Source 2 github-backed registry entries — those paths don't depend on store HTML.

## Politeness

- Cap concurrent detail-page fetches at 4-6 during Path 2 enumeration
- Add a small inter-request delay (100-250ms) between batches
- User-Agent: `indigo-claude-plugin/<version> (update-plugins skill)`
- Aggressively cache (24h) Path 2 results

## Store newer than registry, registry newer than installed

- If the store lists a version older than what's installed → the user is running a dev/beta. Report as "installed is newer than store" and don't offer a downgrade.
- If the bundled registry points at a `store_url` but the store now links to a GitHub release → the plugin author has moved to GitHub. The registry is out of date; suggest a PR updating the entry to use a `github` slug instead.
