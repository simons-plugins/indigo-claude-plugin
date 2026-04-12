---
name: html-pages
description: Indigo HTML page builder — generates interactive dashboard pages with device controls
---

# Indigo HTML Page Builder

**Plugin**: https://github.com/simons-plugins/indigo-claude-plugin
**Slash command**: `/indigo:html-pages`

## Description

Guided builder for Indigo HTML dashboard pages. Generates self-contained HTML files with `indigo-api.js` for live device data and controls. Compatible with any Indigo plugin's static file serving.

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
- `domio-page-*` meta tags for app discovery
- Inline CSS with `prefers-color-scheme` dark mode support
- Load `indigo-api.js` via `<script src="../js/indigo-api.js"></script>`
- Use `observeAll()` or `observe(deviceId)` for live polling
- Debounce slider inputs (300ms)
- Handle errors gracefully

**Critical**: All device commands go to `POST /v2/api/command` — consult `/indigo:api` docs (`docs/api/device-commands.md`) for the command reference. Do not guess command formats.

### Phase 4: DEPLOY

Offer deployment options:

**Option A — Domio plugin on Indigo server** (if volume mounted):
```bash
cp "page-name.html" "/Volumes/Macintosh HD-1/Library/Application Support/Perceptive Automation/Indigo 2025.1/Plugins/Domio.indigoPlugin/Contents/Resources/static/pages/"
```
Then restart: `mcp__indigo__restart_plugin(plugin_id="com.simons-plugins.domio")`

**Option B — Another plugin**: Copy to its `Contents/Resources/static/pages/`.

**Option C — Save locally**: Write to current working directory.
