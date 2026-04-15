# Indigo Plugin Store Scraping

How to extract plugin metadata from https://www.indigodomo.com/pluginstore/ when a plugin doesn't declare a GitHub source in its Info.plist.

## Why scrape

The Indigo plugin store has no documented JSON/RSS/API feed. Detail pages are server-rendered static HTML — fully parseable with `WebFetch` without needing a JavaScript runtime. This is a pragmatic fallback only; **prefer GitHub releases when the plugin declares `GithubInfo`** (see `discovery.md`).

## Fields to extract

Every store detail page should expose these five fields. Extract them all when building the cache:

| Field | Purpose | Typical location |
|-------|---------|------------------|
| Bundle identifier | Match key — links store entry to installed plugin | Visible on the page as "Bundle Identifier: ..." text or data attribute |
| Latest version | Compared against installed version | "Latest Version: vX.Y.Z" text |
| Download URL | Target for `curl` in the apply phase | Anchor pointing at a `.zip` (often `github.com/.../releases/download/...`) |
| GitHub URL | Optional source-code link, good release notes fallback | Anchor pointing at `github.com/<user>/<repo>` |
| Plugin name + author | Display | Page heading + "Author: ..." text |

If any of the first three are missing for a plugin you expected to find, treat that plugin as unresolved rather than trying to proceed with partial data.

## Listing discovery

The store doesn't publish a sitemap or API index, so we have to enumerate detail pages ourselves. Two viable strategies:

### Strategy A — Landing page crawl (preferred)

1. Fetch `https://www.indigodomo.com/pluginstore/`
2. Parse every anchor pointing at a detail page (URL pattern: `https://www.indigodomo.com/pluginstore/<N>/` where `<N>` is a small integer)
3. Deduplicate and sort
4. Fetch each detail page, parse, store in cache

Pros: no enumeration gaps, no dependency on sequential IDs, robust to store deletions.
Cons: landing page may not list every plugin if there's pagination or category navigation. Check for category/pagination links and follow them too.

### Strategy B — Sequential ID enumeration (fallback)

If the landing page doesn't yield a full list, walk integer IDs from 1 upward until you see a run of consecutive 404s (say, 20 in a row). This is how a few home-automation communities discover scraped catalogs. Empirically the store has fewer than 500 plugins total, so this caps at a few hundred fetches.

Only use this if Strategy A demonstrably misses plugins. Don't use both unconditionally — it's wasted requests.

## Parse rules

**Do not** hardcode CSS selectors in code scattered across the skill. Keep them all in this file. When the store HTML drifts, updating this file should be the only fix needed.

As of the initial implementation, the store uses static HTML that WebFetch reads without difficulty. Use defensive parsing: BeautifulSoup-style with specific selectors *and* a regex fallback for each field, so a single selector change doesn't break everything at once.

Recommended anchors (to be refined empirically on first implementation):

```text
Bundle identifier: text matching /Bundle Identifier[:\s]+([a-z0-9._-]+)/i
Latest version:    text matching /Latest Version[:\s]+v?([0-9][0-9a-z.+\-]*)/i
Download URL:      any <a href> ending in `.indigoPlugin.zip` or `.zip`
GitHub URL:        any <a href> matching `github.com/<user>/<repo>` (no trailing path)
Name:              <h1> or <title> text, stripped of the site suffix
Author:            text matching /Author[:\s]+([^\n]+)/i
```

If any field extraction returns None, log a warning with the detail page URL and skip that plugin in the cache (rather than persisting a partial record).

## Parse self-test

Before writing a freshly-built cache to disk, verify the parser still works against a known-good reference plugin. Pick one that has been on the store for a long time and is unlikely to disappear — e.g. **Indigo Domotics Hue Lights**. Fetch its detail page and assert all five required fields extract successfully.

If the self-test fails:
- Do not write the cache
- Report to the user: "Indigo plugin store HTML has drifted — store-sourced upgrade detection is disabled until `references/store-scraping.md` is updated with fresh parse rules"
- Continue with GitHub-sourced plugins (Phase 2 still works for those)

This prevents a silent rot where the scraper keeps producing empty results after a store redesign.

## Politeness

Scraping is unmetered by the store but good-citizen limits still apply:
- Cap concurrent detail-page fetches at 4-6
- Add a small inter-request delay (100-250ms) between batches
- Set a descriptive User-Agent: `indigo-claude-plugin/<version> (update-plugins skill)`
- Cache aggressively (24h by default) so a typical user hits the store at most once per day

## Download URLs from the store

Many store detail pages link their download directly to a GitHub release asset. When that's the case, use the GitHub URL as the `download_url` in the cache — it's stable, tagged, and often has a release notes page attached. Only fall back to store-hosted downloads when the store page doesn't offer a GitHub asset URL.

If the store's download URL is relative (e.g. `/pluginstore/download/...`), resolve it against `https://www.indigodomo.com/` before caching.

## When the store is the wrong answer

If a plugin's store entry lists a version that is *older* than the installed version, that means the user is running a newer dev build or beta that isn't on the store yet. Report this as "installed is newer than store" and do not offer a downgrade. The user can manually revert if they want to.
