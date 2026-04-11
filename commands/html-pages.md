---
name: html-pages
description: Indigo HTML page builder — generates interactive dashboard pages with device controls
---

# Indigo HTML Page Builder

**Plugin**: https://github.com/simons-plugins/indigo-claude-plugin
**Slash command**: `/indigo:html-pages`

## Description

Generates self-contained HTML dashboard pages for Indigo home automation.
Pages use the `indigo-api.js` client library for live device data and controls.
Compatible with any Indigo plugin's static file serving — designed primarily
for the Domio plugin but works anywhere.

## Workflow

### Phase 1: DISCOVER — Understand what the user wants

Ask the user what kind of page they want. Examples:
- "Security dashboard showing locks and motion sensors"
- "Lighting control page for the living room"
- "Energy monitor with thermostat controls"
- "Quick actions page with scene buttons"

Use the Indigo MCP tools to discover available devices:
- `mcp__indigo__list_devices` — get all devices
- `mcp__indigo__get_devices_by_type` — filter by type (relay, dimmer, thermostat, sensor)
- `mcp__indigo__list_action_groups` — get available scenes
- `mcp__indigo__list_variables` — get variables

### Phase 2: DESIGN — Choose layout and features

Ask about:
- **Layout style**: Grid of cards, compact list, or single-focus dashboard
- **Which devices**: Specific devices by name/ID, or all devices of a type
- **Interactivity**: View-only, toggle controls, brightness sliders, thermostat setpoints
- **Refresh rate**: How often to poll for updates (default: 5 seconds)

### Phase 3: GENERATE — Create the HTML page

Generate a single self-contained HTML file with:

1. **Meta tags** for page discovery:
```html
<meta name="domio-page-name" content="Page Name">
<meta name="domio-page-icon" content="sf.symbol.name">
<meta name="domio-page-description" content="Brief description">
```

2. **Inline CSS** with:
   - `prefers-color-scheme` media query for automatic dark mode
   - Responsive design (iPhone, iPad, desktop)
   - iOS-native feel (SF Pro font stack, system colors, rounded cards)
   - Smooth transitions for state changes

3. **Script tag** loading `indigo-api.js` from the sibling path:
```html
<script src="../js/indigo-api.js"></script>
```

4. **Page JavaScript** that:
   - Creates an `IndigoAPI` instance
   - Uses `observeAll()` or `observe(deviceId)` for live updates
   - Renders device state with appropriate controls
   - Handles toggle, brightness, thermostat commands
   - Debounces slider inputs (300ms)
   - Shows error states gracefully

### Phase 4: DEPLOY — Place the file

Offer deployment options:

**Option A — Deploy to Domio plugin on Indigo server** (if volume mounted):
```bash
cp "page-name.html" "/Volumes/Macintosh HD-1/Library/Application Support/Perceptive Automation/Indigo 2025.1/Plugins/Domio.indigoPlugin/Contents/Resources/static/pages/"
```
Then restart: `mcp__indigo__restart_plugin(plugin_id="com.simons-plugins.domio")`

**Option B — Deploy to another plugin**:
Ask for the plugin bundle path and copy to its `Contents/Resources/static/pages/`.

**Option C — Save locally**:
Write to current working directory for manual placement.

## Design Guidelines

### Visual Style
- Use CSS custom properties for theming (light/dark)
- Match iOS system aesthetics: `-apple-system` font, subtle shadows, 14px border radius
- Card-based layout with `.regularMaterial`-style backgrounds
- Teal accent for interactive elements, green for "on" state, gray for "off"

### SF Symbol Icons for Meta Tags
Common choices:
- `house.fill` — general home
- `shield.fill` — security
- `bolt.fill` — energy/power
- `lightbulb.fill` — lighting
- `thermometer.medium` — climate
- `drop.fill` — irrigation
- `gearshape.fill` — settings/system
- `play.fill` — scenes/actions

### indigo-api.js Reference

```javascript
const indigo = new IndigoAPI();

// Devices
await indigo.getDevices()           // all devices
await indigo.getDevice(id)          // single device
await indigo.turnOn(id)
await indigo.turnOff(id)
await indigo.toggle(id)
await indigo.setBrightness(id, 75)  // 0-100
await indigo.setHeatSetpoint(id, 21)
await indigo.setCoolSetpoint(id, 24)

// Action Groups
await indigo.getActionGroups()
await indigo.executeActionGroup(id)

// Variables
await indigo.getVariables()
await indigo.getVariable(id)

// Reactive polling
const watcher = indigo.observeAll(devices => {
    // called every 5s (or custom interval) when data changes
    renderDashboard(devices);
}, 5000);
watcher.stop(); // cleanup

// Error handling
indigo.onError(err => console.error(err));
indigo.onAuthFailure(err => showAuthError());
```

### Device Properties (from Indigo REST API)

Key fields on device objects:
- `id` — numeric device ID
- `name` — display name
- `class` — device class (`"indigo.RelayDevice"`, `"indigo.DimmerDevice"`, `"indigo.ThermostatDevice"`, `"indigo.SensorDevice"`)
- `onState` — boolean on/off
- `brightness` — 0-100 (dimmers only)
- `hvacMode` — `"heat"`, `"cool"`, `"auto"`, `"off"` (thermostats)
- `setpointHeat` — heat setpoint (thermostats)
- `setpointCool` — cool setpoint (thermostats)
- `sensorValue` — current sensor reading

### Page Template Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <meta name="domio-page-name" content="PAGE NAME">
    <meta name="domio-page-icon" content="ICON">
    <meta name="domio-page-description" content="DESCRIPTION">
    <title>PAGE NAME</title>
    <style>
        :root { /* light theme vars */ }
        @media (prefers-color-scheme: dark) { :root { /* dark theme vars */ } }
        /* ... page styles ... */
    </style>
</head>
<body>
    <div id="content"><!-- rendered by JS --></div>
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
