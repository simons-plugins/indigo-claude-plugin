---
name: html-pages
description: >-
  This skill should be used when the user asks to "build an HTML page for Indigo",
  "create an HTML dashboard", "make an Indigo web page", "create a device dashboard",
  "build a home summary page", "generate an HTML control page", "create a web dashboard",
  "make a lighting page", "build a security dashboard", or is working with HTML files
  in a plugin's Resources/static/pages/ directory. Generates self-contained HTML
  dashboard pages with indigo-api.js for live Indigo device data and controls.
match:
  - "**/Resources/static/pages/*.html"
  - "**/indigo-api.js"
---

# Indigo HTML Dashboard Pages

Self-contained HTML pages served by Indigo plugins via the IWS static file system. Pages use `indigo-api.js` for client-side device data and control via the Indigo REST API. Compatible with any plugin — primarily designed for the Domio plugin.

## Core Concepts

- **Self-contained**: Each page is a single `.html` file with inline CSS and JS
- **Self-describing**: Meta tags in `<head>` provide page name, icon, and description for app discovery
- **Live data**: `indigo-api.js` fetches device state and sends commands via `POST /v2/api/command`
- **Dark mode**: All pages support `prefers-color-scheme` for automatic light/dark switching
- **Responsive**: Pages adapt to iPhone, iPad, and desktop browsers

## Workflow

### Phase 1: DISCOVER

Determine what the page should display. Use Indigo MCP tools to find available devices:
- `mcp__indigo__list_devices` — all devices
- `mcp__indigo__get_devices_by_type` — filter by type (relay, dimmer, thermostat, sensor)
- `mcp__indigo__list_action_groups` — available scenes
- `mcp__indigo__list_variables` — variables

### Phase 2: DESIGN

Determine layout and interactivity:
- **Layout**: Grid of cards, compact list, or single-focus dashboard
- **Devices**: Specific devices by name/ID, or all of a type
- **Controls**: View-only, toggles, brightness sliders, thermostat setpoints
- **Refresh rate**: Polling interval for live updates (default: 5 seconds)

### Phase 3: GENERATE

Produce a single HTML file following this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <meta name="domio-page-name" content="PAGE NAME">
    <meta name="domio-page-icon" content="house.fill">
    <meta name="domio-page-description" content="Brief description">
    <title>PAGE NAME</title>
    <style>
        :root { /* light theme */ }
        @media (prefers-color-scheme: dark) { :root { /* dark theme */ } }
    </style>
</head>
<body>
    <div id="content"></div>
    <script src="../js/indigo-api.js"></script>
    <script>
        const indigo = new IndigoAPI();
        if (IndigoAPI.isConfigured()) {
            indigo.observeAll(render, 5000);
        }
        function render(devices) { /* ... */ }
    </script>
</body>
</html>
```

**Critical**: Load `indigo-api.js` via `../js/indigo-api.js` (sibling directory). All commands use `POST /v2/api/command` — consult `/indigo:api` skill docs (`docs/api/device-commands.md`) for the full command reference.

### Phase 4: DEPLOY

Offer deployment options:
1. **Domio plugin on Indigo server** — copy to `Resources/static/pages/`, restart plugin via MCP
2. **Another plugin** — copy to that plugin's `Resources/static/pages/`
3. **Local save** — write to working directory for manual placement

## Quick API Reference

```javascript
const indigo = new IndigoAPI();
await indigo.getDevices();                  // fetch all devices
await indigo.toggle(deviceId);              // toggle on/off
await indigo.setBrightness(deviceId, 75);   // dimmer 0-100
indigo.observeAll(callback, 5000);          // poll every 5s, call back on change
```

## Additional Resources

### Reference Files

For detailed API and design documentation, consult:
- **`references/indigo-api-js.md`** — Full indigo-api.js V1 API reference, device properties, error handling
- **`references/design-guidelines.md`** — CSS theme template, SF Symbol icons, interactive control patterns, responsive layout, deployment paths

### Related Skills

- **`/indigo:api`** — Indigo REST and WebSocket API reference (device commands, authentication)
- **`/indigo:control-pages`** — XML-based Indigo control pages (alternative to HTML pages)

### Working Example

The Domio plugin ships with `home-summary.html` — a bundled sample page that dynamically fetches devices, shows type counts, lists active devices with toggle and brightness controls. Examine it as a reference implementation.
