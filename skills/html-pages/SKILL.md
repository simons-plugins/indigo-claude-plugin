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

Self-contained HTML pages that display Indigo device data and controls. Pages use `indigo-api.js` for client-side REST API access. Serve from any Indigo plugin's static file directory, or open directly in a browser.

## Core Concepts

- **Self-contained**: Each page is a single `.html` file with inline CSS and JS
- **Self-describing**: `indigo-page-*` meta tags in `<head>` provide page name, icon, and description for app discovery
- **Live data**: `indigo-api.js` fetches device state and sends commands via `POST /v2/api/command`
- **Dark mode**: All pages must support `prefers-color-scheme` for automatic light/dark switching
- **Responsive**: Pages adapt to iPhone, iPad, and desktop browsers
- **Browser-friendly**: Include a connection form fallback when `INDIGO_CONFIG` is not injected, enabling direct browser use without plugin infrastructure

## Workflow

### Phase 1: DISCOVER

Determine what the page should display. Use Indigo MCP tools to explore the user's setup:
- `mcp__indigo__list_devices` — all devices
- `mcp__indigo__get_devices_by_type` — filter by type (relay, dimmer, thermostat, sensor)
- `mcp__indigo__list_action_groups` — available scenes
- `mcp__indigo__list_variables` — variables

Clarify the page's purpose. Common patterns:
- **Room dashboard** — all devices in a specific room with controls
- **Device type page** — all lights, all thermostats, all sensors
- **Status overview** — device counts by type, active devices only
- **Scene launcher** — grid of action group buttons
- **Single device focus** — detailed view of one device with history

### Phase 2: DESIGN

Determine layout, device selection, and interactivity:

**Layout options:**
- **Card grid** — responsive grid of device cards (best for mixed device types)
- **Compact list** — rows with name + control (best for many devices)
- **Single-focus** — one large widget for a single device or metric

**Interactivity levels:**
- **View-only** — display state, no controls (sensors, status boards)
- **Toggle** — on/off switches for relays and dimmers
- **Full control** — toggles + brightness sliders + thermostat setpoints
- **Action buttons** — execute action groups (scenes)

**Polling interval:**
- Default: 5 seconds (`observeAll(callback, 5000)`)
- Fast (2s): for security or time-sensitive pages
- Slow (15-30s): for overview dashboards that don't need instant updates

### Phase 3: GENERATE

Produce a single HTML file. Follow this template structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <meta name="indigo-page-name" content="PAGE NAME">
    <meta name="indigo-page-icon" content="house.fill">
    <meta name="indigo-page-description" content="Brief description">
    <title>PAGE NAME</title>
    <style>
        :root { /* light theme vars — see references/design-guidelines.md */ }
        @media (prefers-color-scheme: dark) { :root { /* dark theme vars */ } }
    </style>
</head>
<body>
    <div id="content"></div>
    <script src="../js/indigo-api.js"></script>
    <script>
        if (typeof IndigoAPI !== "undefined" && IndigoAPI.isConfigured()) {
            startDashboard();
        } else {
            showConfigForm();  // browser fallback
        }
    </script>
</body>
</html>
```

**Sizing rules** (pages are primarily viewed on iPhones and iPads):
- Design mobile-first at 375px width (iPhone SE), scale up to 1180px (iPad landscape)
- Minimum 44x44pt touch targets for all interactive elements (Apple HIG requirement)
- Minimum 13px font size — smaller is unreadable on phones
- Use `env(safe-area-inset-*)` padding to avoid navigation/tab bar clipping
- Use CSS Grid with `auto-fill, minmax(160px, 1fr)` for responsive card layouts
- See `references/design-guidelines.md` for full device width table, spacing scale, and scroll behaviour

**Generation rules:**
- Load `indigo-api.js` via `<script src="../js/indigo-api.js"></script>` (sibling directory)
- Check `typeof IndigoAPI !== "undefined"` before use — the script tag fails silently when opened as a local file
- Include a `showConfigForm()` fallback that prompts for server URL and API key (see `examples/active-devices.html` for the pattern)
- Use CSS custom properties for theming — see `references/design-guidelines.md` for the full theme template
- Debounce slider inputs at 300ms to avoid command spam
- Disable toggle controls briefly (500ms) after a command to prevent double-taps
- Escape all device names with a text-node approach before rendering as HTML

**Critical**: All device commands use `POST /v2/api/command` — consult `/indigo:api` skill docs (`docs/api/device-commands.md`) for the full command reference. Do not guess command formats.

### Phase 4: DEPLOY

Offer deployment options based on how the page will be used:

**Option A — Serve from an Indigo plugin** (recommended for app integration):
Copy to any plugin's `Contents/Resources/static/pages/` directory and restart the plugin via MCP. The page is then accessible at `https://{server}:8176/{bundleID}/static/pages/page.html`. Apps that support the `/pages/` manifest endpoint discover pages automatically.

**Option B — Browser-only**:
Save the HTML file anywhere. Open it directly in a browser — the page shows a connection form prompting for the Indigo server URL and API key. No plugin deployment needed. Good for quick testing or standalone dashboards on a wall-mounted tablet.

## Device Classification

When building pages that show mixed device types, classify devices by their `class` field:

| Class contains | Category | Controls |
|----------------|----------|----------|
| `DimmerDevice` | Lights | Toggle + brightness slider |
| `RelayDevice` | Switches (or Lights if name contains light/lamp) | Toggle |
| `ThermostatDevice` | Thermostats | Heat/cool setpoints, mode |
| `SensorDevice` | Sensors | Display-only (sensorValue, onState) |
| Other | Other | Toggle if `onState` exists |

Check `onState === true` to determine if a device is active. For dimmers, also check `brightness > 0`.

## Quick API Reference

```javascript
const indigo = new IndigoAPI();
await indigo.getDevices();                  // fetch all devices
await indigo.toggle(deviceId);              // toggle on/off
await indigo.setBrightness(deviceId, 75);   // dimmer 0-100
await indigo.setHeatSetpoint(deviceId, 21); // thermostat
await indigo.executeActionGroup(id);        // run a scene
indigo.observeAll(callback, 5000);          // poll every 5s, call back on change
indigo.observe(deviceId, callback, 5000);   // poll single device
```

## Additional Resources

### Reference Files

For detailed API and design documentation, consult:
- **`references/indigo-api-js.md`** — Full indigo-api.js V1 API reference, device properties, error handling, command transport
- **`references/design-guidelines.md`** — CSS theme template, SF Symbol icons, interactive control patterns, responsive layout, deployment paths

### Example Files

- **`examples/active-devices.html`** — Complete working page: active devices with toggle controls, dark mode, browser connection form fallback. Copy and adapt as a starting point.

### Related Skills

- **`/indigo:api`** — Indigo REST and WebSocket API reference (device commands, authentication). **Always consult before writing command code.**
- **`/indigo:control-pages`** — XML-based Indigo control pages (alternative to HTML pages)
