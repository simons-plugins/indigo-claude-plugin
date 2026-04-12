# indigo-api.js V1 Reference

Client-side JavaScript library for Indigo REST API access from HTML pages.

## Loading

```html
<script src="../js/indigo-api.js"></script>
```

The library reads credentials from `window.INDIGO_CONFIG` (injected by compatible iOS apps via WKWebView, or set manually) or from `?api-key=` URL query parameter (browser fallback).

## API

### Constructor

```javascript
const indigo = new IndigoAPI();        // auto-reads INDIGO_CONFIG
const indigo = new IndigoAPI(config);  // manual config: { baseURL, apiKey }
```

### Configuration Check

```javascript
IndigoAPI.isConfigured()  // → boolean
```

### Devices

```javascript
await indigo.getDevices()              // → Device[]
await indigo.getDevice(id)             // → Device
await indigo.turnOn(id)                // → void
await indigo.turnOff(id)               // → void
await indigo.toggle(id)                // → void
await indigo.setBrightness(id, 75)     // 0-100 → void
await indigo.setHeatSetpoint(id, 21)   // → void
await indigo.setCoolSetpoint(id, 24)   // → void
```

### Action Groups

```javascript
await indigo.getActionGroups()         // → ActionGroup[]
await indigo.executeActionGroup(id)    // → void
```

### Variables

```javascript
await indigo.getVariables()            // → Variable[]
await indigo.getVariable(id)           // → Variable
```

### Reactive Polling

```javascript
// Observe a single device (calls back on change)
const watcher = indigo.observe(deviceId, device => {
    updateDeviceUI(device);
}, 5000);  // poll interval in ms

// Observe all devices
const watcher = indigo.observeAll(devices => {
    renderDashboard(devices);
}, 5000);

watcher.stop();  // cleanup
```

### Error Handling

```javascript
indigo.onError(err => console.error(err));
indigo.onAuthFailure(err => showAuthError());
```

All methods reject with `IndigoAPIError` which has `.status` (HTTP code, 0 for network errors) and `.message`.

If `INDIGO_CONFIG` is missing, the library shows a visible red error banner automatically.

## Device Properties

Key fields on device objects returned by the Indigo REST API:

| Property | Type | Notes |
|----------|------|-------|
| `id` | number | Unique device ID |
| `name` | string | Display name |
| `class` | string | `"indigo.RelayDevice"`, `"indigo.DimmerDevice"`, `"indigo.ThermostatDevice"`, `"indigo.SensorDevice"` |
| `onState` | boolean | On/off state |
| `brightness` | number | 0-100, dimmers only |
| `hvacMode` | string | `"heat"`, `"cool"`, `"auto"`, `"off"` — thermostats only |
| `setpointHeat` | number | Heat setpoint — thermostats only |
| `setpointCool` | number | Cool setpoint — thermostats only |
| `sensorValue` | number | Current reading — sensors only |

## Command Transport

All commands are sent via `POST /v2/api/command` with JSON body:

```json
{
  "message": "indigo.device.toggle",
  "objectId": 123456789,
  "parameters": { "value": 50 }
}
```

Refer to `/indigo:api` skill documentation (`docs/api/device-commands.md`) for the full command reference.

## Capability Detection

Always render controls based on the device's actual capability flags, not on assumptions about device type. A device can be a "dimmer" but also support colour temperature and RGB — all three need controls.

| Capability flag | Control to render |
|-----------------|-------------------|
| `dev.supportsOnState === true` | Toggle switch |
| `dev.class` contains `"Dimmer"` or `dev.brightness != null` | Brightness slider |
| `dev.supportsWhiteTemperature === true` | Colour temperature slider |
| `dev.supportsRGB === true` | RGB colour picker |
| `dev.supportsHeatSetpoint === true` | Heat setpoint control |
| `dev.supportsCoolSetpoint === true` | Cool setpoint control |

**Rule:** Never hide a supported capability for layout reasons without asking the user first.

## Thermostat Display Rules

For TRVs and thermostats, show heating indicators only when actually heating:
- **Flame/heat icon:** Only when `hvacHeaterIsOn === true` AND `dev.states["valve-position"] > 0`
- **Valve position at 0%** means the valve is fully closed regardless of `hvacHeaterIsOn` — no flame
- **Setpoint below ~15°C** usually indicates the zone is off / frost protection mode

**Important:** Some Indigo state keys use hyphens (e.g. `valve-position`, `onOffState.ui`). These can only be accessed via **bracket notation** in JavaScript — `dev.states["valve-position"]` — never dot notation, because `dev.states.valve-position` is parsed as a subtraction. Also clamp the returned value: some firmware reports sentinel values (e.g. `-99`) for unknown states.

## History Endpoint (Domio Plugin)

The Domio plugin exposes a history endpoint backed by Indigo's SQL Logger:

```
GET /message/com.simons-plugins.domio/history/?device_id={id}&column={name}&range={range}&max_points=200
```

**Valid `range` values (strict):** `1h`, `6h`, `24h`, `7d`, `30d` — any other value returns 400.

**Parameters:**
- `device_id` (required) — numeric device ID
- `column` (optional) — state column to query (e.g. `temperatureInput1`); if omitted, uses first numeric column
- `range` — time window (strictly one of the allowed values above)
- `max_points` — downsample target (default 300)

**Response:**
```json
{
  "success": true,
  "device_id": 123,
  "column": "temperatureInput1",
  "range": "24h",
  "type": "float",
  "points": [[timestamp, value], ...],
  "min": 18.2,
  "max": 22.1,
  "current": 20.5
}
```

**Usage in pages:**
```javascript
const data = await indigo._fetch(
    `/message/com.simons-plugins.domio/history/?device_id=${id}&column=temperatureInput1&range=24h&max_points=200`
);
```

## Error Visibility

Silent error handling hides real problems. Every fetch that can fail should display the error on the page, not just `console.warn`. Pattern:

```javascript
async function loadHistory() {
    try {
        const data = await indigo._fetch(path);
        if (data?.success && data.points?.length > 0) {
            render(data);
        } else {
            showChartMessage(data?.error || "No data available");
        }
    } catch (e) {
        showChartMessage("Error: " + e.message);
    }
}

function showChartMessage(msg) {
    // Write the message into the chart area so the user sees it.
    // Use textContent (not innerHTML) — error messages may come from the
    // server and must never be interpolated as HTML.
    const el = document.getElementById("chart-message");
    if (el) el.textContent = msg;
}
```

For SVG chart containers, either use a dedicated non-SVG overlay element for messages (simpler), or construct an SVG `<text>` element with `document.createElementNS()` and set its `textContent`. Do **not** build HTML strings from error messages — server responses and caught exceptions can contain arbitrary content.

A page with an invisible 400 error looks identical to a page that's working but has no data. Always surface the difference.

## Script Structure

Use **two separate `<script>` blocks** in the HTML page:

1. **First block** — contains only the `IndigoAPI` class definition
2. **Second block** — contains all page logic, rendering, event handlers

This means a syntax error or runtime error in the page logic doesn't prevent the API class from being defined, and makes the failure mode more predictable.
