# CONCERNS.md — Known Issues and Open Work

## PR #13 — Status: MERGED

PR #13 ("Add HTTP Responder docs and folder operations") was merged. The memory note saying "PR #13 open" is stale.

Merged changes:
- `docs/plugin-dev/concepts/http-responder.md` — handler methods, request/reply objects, Jinja2 templates, static files, error handling
- Added folder operations to `docs/plugin-dev/api/iom/architecture.md`

The memory file `/memory/indigo-plugin-docs-gaps.md` also confirms: "All LOW priority items completed in PR #14". The 5 LOW priority doc gaps described in that memory have all been addressed.

## PR #25 — Open: Deployment Path Fix for HTML Pages

**Title**: "docs: deploy user pages to Web Assets, not plugin bundle"
**Branch**: `docs/user-pages-deployment`
**State**: Open as of April 2026

**Problem**: The `/indigo:html-pages` skill and `references/design-guidelines.md` previously instructed deploying user pages into a plugin's `Contents/Resources/static/pages/` directory. This is incorrect — plugin bundles are wiped on every plugin update, destroying user pages.

**Fix**: 
- Option A is now "Indigo Web Assets folder" — an Indigo-managed directory outside any plugin bundle that survives updates
- Option C covers plugin authors who are shipping pages as part of their plugin source (commit to repo, not deploy at runtime)
- `references/design-guidelines.md` Deployment Options section rewritten
- New Page Manifest section documenting the `source` field (`plugin` | `user`) and URL patterns

**Companion PRs**:
- `simons-plugins/indigo-domio-plugin#13` — plugin scans Web Assets folder
- `simons-plugins/domio-code#172` — iOS app routes URLs by source

**Version**: Bumps to 1.5.0

**Status**: Waiting for CI check + user approval before merge.

## Active Feature Branches (as of April 2026)

Local branches ahead of main:

| Branch | Purpose | Status |
|--------|---------|--------|
| `docs/http-responder-polish` | Polish to HTTP Responder docs | Local, not yet PR |
| `docs/low-priority-gaps` | Additional doc gap work | Local |
| `fix/update-notification-hook` | Fix to update notification hook | Local |
| `docs/user-pages-deployment` | PR #25 — deployment fix | Open PR |

Remote branches with open work:
- `remotes/origin/docs/add-plugin-icon-info` — plugin icon documentation
- `remotes/origin/docs/remaining-low-priority-gaps` — doc gap work
- `remotes/origin/docs/user-pages-deployment` — PR #25

## Stale Memory

The memory note `indigo-plugin-docs-gaps.md` references "PR #13 open, 5 LOW priority doc gaps remaining." Both are stale:
- PR #13: merged
- PR #14: also merged (addressed remaining LOW priority gaps)
- All 5 LOW priority items are complete

The memory file itself says "All LOW priority items completed in PR #14. Merge to close out." — meaning PR #14 has merged and the gaps are closed.

Current version is 1.4.5, having gone through: 1.3.0 (docs gap work), 1.3.2 (plugin icon info), 1.4.x (HTML pages feature, inline JS guidance, dining room learnings, CodeRabbit fixes).

## Structural Concerns

### SDK Examples Are Upstream / Read-Only

The 16 SDK examples in `sdk-examples/` are copied from the official Indigo SDK. They are not modified here. If Indigo releases a new SDK version with updated examples, those would need to be manually refreshed. There is no automated sync mechanism.

**Risk**: SDK examples may become out of date relative to current Indigo APIs (currently Python 3.10+, API version 3.6+). The `reference/Python3-Migration-Guide.md` exists to help users migrate, but examples themselves may have Python 2 artifacts.

### control-pages.local.md Is User-Managed

`control-pages.local.md` is a per-user preferences file at the repo root. It is not gitignored in the codebase (no `.gitignore` was checked). If a user commits their personal preferences, they will land in the repo and affect other users.

**Recommendation**: Add `control-pages.local.md` to `.gitignore` if not already present.

### No IOM Coverage for Some Indigo Objects

The modular IOM reference in `docs/plugin-dev/api/iom/` covers: architecture, command namespaces, devices, triggers, filters, subscriptions, constants, containers, utilities. There is no dedicated file for:
- Schedules (time-based triggers) — partially covered in `command-namespaces.md`
- Variable folders / device folders — covered in architecture
- `indigo.activePlugin` properties — covered in utilities

These are low priority; the existing coverage handles the most common development scenarios.

### Hook Has No Fallback for Node.js Absence

`hooks/check-update.js` requires Node.js. If Node.js is not installed in the user's environment, the hook will fail silently (the hook runs with `"async": false`, so errors don't block startup, but no update check occurs). This is acceptable for a non-critical notification feature but is worth noting.

### HTML Pages Skill References `indigo-page-*` Meta Tags

The skill uses `indigo-page-*` meta tag names (changed from earlier `domio-page-*` naming in commit `5aa4df6`). The Domio iOS app and the indigo-domio-plugin must be using matching tag names. If either side falls out of sync, page discovery will break. This cross-repo coordination is a fragile integration point.
