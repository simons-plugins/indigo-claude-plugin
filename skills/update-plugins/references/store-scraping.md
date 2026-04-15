# Indigo Plugin Store Scraping

Last-resort fallback for plugins that don't declare `GithubInfo` in their Info.plist. Prefer Source 1 (local GithubInfo) whenever possible — see `discovery.md`.

**Everything in this file is a hypothesis until verified against real store HTML.** The parse rules below are sketched from reading one sample detail page. They will need empirical refinement on first implementation, and the self-test at the end is designed to fail loudly if the HTML drifts away from what's documented here.

## What the store does and doesn't guarantee

The Indigo plugin store has no documented JSON/RSS/API feed. Detail pages appear to be server-rendered static HTML readable by `WebFetch` without JavaScript.

The fields below are what we *hope* to extract. The one with the highest rot/availability risk is the **bundle identifier** — it is the match key for the whole fallback path, and it is not guaranteed to be rendered in human-readable form on every detail page. If a given plugin's detail page doesn't expose the bundle ID, we cannot match it to an installed plugin and the fallback collapses for that plugin.

## Fields to extract (hypothesised)

| Field | Purpose | Availability |
|-------|---------|--------------|
| Bundle identifier | Match key against installed plugins | **Uncertain** — not visible on every store page; verify empirically |
| Latest version | Version comparison | Likely visible as "Latest Version: vX.Y.Z" |
| Download URL | Target for `curl` in apply phase | Anchor pointing at a `.zip` (often `github.com/.../releases/download/...`) |
| GitHub URL | Release notes fallback | Anchor pointing at `github.com/<user>/<repo>` |
| Plugin name + author | Display | Page heading + "Author: ..." text |

**If the bundle identifier isn't extractable for a plugin, skip it in the cache rather than persist a partial record.** Reporting no-upstream is better than wrong-upstream.

## Listing discovery

The store doesn't publish a sitemap. Two strategies, try A first:

### Strategy A — Landing page crawl (preferred)

1. Fetch `https://www.indigodomo.com/pluginstore/`
2. Parse anchors pointing at detail pages (URL pattern: `https://www.indigodomo.com/pluginstore/<N>/` where `<N>` is a small integer)
3. Follow category/pagination links if present
4. Deduplicate, fetch each detail page, parse, store in cache

### Strategy B — Sequential ID enumeration (fallback)

If the landing page demonstrably misses plugins: walk integer IDs from 1 upward until you hit a run of ~20 consecutive 404s. Don't run both strategies — it's wasted requests.

## Parse rules (hypotheses — refine on first run)

Keep all selectors in this one file. When the store HTML drifts, this should be the only file that needs updating.

Use defensive parsing: one CSS/structural selector and a regex fallback for each field, so a single DOM change doesn't take everything out at once.

Starting anchors:

```text
Bundle identifier: text matching /Bundle Identifier[:\s]+([a-z0-9._-]+)/i
Latest version:    text matching /Latest Version[:\s]+v?([0-9][0-9a-z.+\-]*)/i
Download URL:      any <a href> ending in `.indigoPlugin.zip` or `.zip`
GitHub URL:        any <a href> matching `github.com/<user>/<repo>` (no trailing path)
Name:              <h1> or <title> text, stripped of the site suffix
Author:            text matching /Author[:\s]+([^\n]+)/i
```

If any field extraction returns None for a detail page, log a warning with the URL and skip that plugin.

## Parse self-test

Before writing a freshly-built cache to disk, verify the parser still works against a pinned reference URL with pinned expected values. Use a URL, not just a plugin name — plugin names can be renamed or removed, but the detail URL + expected bundle ID are the actual contract:

- Reference URL: `https://www.indigodomo.com/pluginstore/196/`
- Expected bundle ID: `pro.sleepers.indigoplugin.8channel-relay`
- Expected name substring: `8 Channel`

Fetch the URL, run the parser, assert all five required fields extract and that bundle ID + name match. If any assertion fails:

- Do **not** write the cache
- Report: "Indigo plugin store HTML has drifted — store-sourced upgrade detection is disabled until `references/store-scraping.md` is updated with fresh parse rules"
- Continue with Source 1 (GithubInfo-backed plugins still work)

This guards against silent rot where the scraper keeps producing empty results after a store redesign.

## Politeness

- Cap concurrent detail-page fetches at 4-6
- Add a small inter-request delay (100-250ms) between batches
- User-Agent: `indigo-claude-plugin/<version> (update-plugins skill)`
- Cache aggressively (24h default) so a typical user hits the store at most once per day

## Download URL preference

When the store's download anchor already points at a GitHub release asset, use that URL directly — it's tagged, stable, and carries release notes. Only fall back to store-hosted downloads when no GitHub asset URL is linked.

If the store's download URL is relative (e.g. `/pluginstore/download/...`), resolve it against `https://www.indigodomo.com/` before caching.

## Store older than installed

If the store lists an older version than what's installed, the user is running a dev/beta that isn't on the store yet. Report as "installed is newer than store" and do not offer a downgrade.
