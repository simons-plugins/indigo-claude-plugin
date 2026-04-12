---
name: html-pages
description: Indigo HTML page builder — generates interactive dashboard pages with device controls
---

# Indigo HTML Page Builder

**Plugin**: https://github.com/simons-plugins/indigo-claude-plugin
**Slash command**: `/indigo:html-pages`

## Description

Guided builder for Indigo HTML dashboard pages. Generates self-contained HTML files with `indigo-api.js` for live device data and controls. Pages can be served from any Indigo plugin's static file directory or opened directly in a browser.

## On Command Load

1. Read `skills/html-pages/references/indigo-api-js.md` for the full API reference
2. Read `skills/html-pages/references/design-guidelines.md` for CSS themes and control patterns
3. Begin the 4-phase workflow below

## Workflow

Follow all four phases in order.

### Phase 1: DISCOVER

Determine what the page should display.

Use Indigo MCP tools to discover available devices:
- `mcp__indigo__list_devices` — all devices
- `mcp__indigo__get_devices_by_type` — filter by type (relay, dimmer, thermostat, sensor)
- `mcp__indigo__list_action_groups` — available scenes
- `mcp__indigo__list_variables` — variables

### Phase 2: DESIGN

Determine layout, device selection, interactivity, and refresh rate. Refer to `references/design-guidelines.md` for CSS theme template, SF Symbol icons, and control patterns.

### Phase 3: GENERATE

Produce a single self-contained HTML file. Refer to `references/indigo-api-js.md` for the full API.

**Requirements:**
- `indigo-page-*` meta tags for app discovery
- Inline CSS with `prefers-color-scheme` dark mode support
- Load `indigo-api.js` via `<script src="../js/indigo-api.js"></script>`
- Use `observeAll()` or `observe(deviceId)` for live polling
- Debounce slider inputs (300ms)
- Handle errors gracefully

**Critical**: All device commands go to `POST /v2/api/command` — consult `/indigo:api` docs (`docs/api/device-commands.md`) for the command reference. Do not guess command formats.

### Phase 4: DEPLOY

Offer deployment options based on how the page will be used:

**Option A — Serve from an Indigo plugin** (recommended for app integration):
Determine which plugin to deploy to. Copy the HTML file to the plugin's static pages directory:
```bash
cp "page-name.html" "/Volumes/Macintosh HD-1/Library/Application Support/Perceptive Automation/Indigo 2025.1/Plugins/{PluginName}.indigoPlugin/Contents/Resources/static/pages/"
```
Then restart the plugin: `mcp__indigo__restart_plugin(plugin_id="{plugin.bundle.id}")`

The page is then accessible at `https://{server}:8176/{bundleID}/static/pages/page-name.html`.

**Option B — Browser-only**:
Save the HTML file anywhere (working directory, Desktop, etc.). Open directly in a browser — the page shows a connection form prompting for the Indigo server URL and API key. No plugin deployment needed.

**Option C — Save locally for later**: Write to current working directory for manual placement.
